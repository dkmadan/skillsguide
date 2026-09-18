import { getDatabase } from '@/lib/mongodb';
import { LabAttempt, LabSubmissionResult, LabArtifact } from './types';
import { ObjectId } from 'mongodb';

// Ensure required indexes are present on collections
let indexesEnsured = false;
async function ensureIndexes() {
  if (indexesEnsured) return;
  try {
    const db = await getDatabase();
    
    // Index attempts by owner and updated time
    await db.collection('labAttempts').createIndex(
      { ownerId: 1, updatedAt: -1 }
    );
    
    // Unique index for idempotency on submissions
    await db.collection('labSubmissions').createIndex(
      { attemptId: 1, idempotencyKey: 1 },
      { unique: true }
    );

    // Index artifacts by attempt
    await db.collection('labArtifacts').createIndex(
      { ownerId: 1, attemptId: 1 }
    );

    indexesEnsured = true;
  } catch (err) {
    // Database might be unavailable in pure static/build environments; handle gracefully
    console.warn('MongoDB index initialization skipped or pending:', err instanceof Error ? err.message : err);
  }
}

// In-memory fallback cache for development/build mode when MongoDB is not connected
const memoryAttempts = new Map<string, LabAttempt>();
const memorySubmissions = new Map<string, LabSubmissionResult>();
const memoryArtifacts = new Map<string, LabArtifact[]>();

export async function createAttempt(data: {
  ownerId: string;
  labSlug: string;
  scenarioId: string;
  version: string;
  seed: number;
}): Promise<LabAttempt> {
  const attemptId = new ObjectId().toHexString();
  const now = new Date().toISOString();

  const attempt: LabAttempt = {
    id: attemptId,
    ownerId: data.ownerId,
    labSlug: data.labSlug,
    scenarioId: data.scenarioId,
    version: data.version,
    seed: data.seed,
    status: 'in_progress',
    draftState: {},
    revision: 1,
    createdAt: now,
    updatedAt: now
  };

  try {
    await ensureIndexes();
    const db = await getDatabase();
    await db.collection('labAttempts').insertOne({
      _id: new ObjectId(attemptId),
      ownerId: data.ownerId,
      labSlug: data.labSlug,
      scenarioId: data.scenarioId,
      version: data.version,
      seed: data.seed,
      status: 'in_progress',
      draftState: {},
      revision: 1,
      createdAt: new Date(now),
      updatedAt: new Date(now)
    });
  } catch (err) {
    console.warn('Storing attempt in memory fallback:', err instanceof Error ? err.message : err);
    memoryAttempts.set(attemptId, attempt);
  }

  return attempt;
}

export async function getAttempt(id: string, ownerId: string): Promise<LabAttempt | null> {
  try {
    const db = await getDatabase();
    let query: Record<string, unknown> = { ownerId };
    if (ObjectId.isValid(id)) {
      query._id = new ObjectId(id);
    } else {
      query.id = id;
    }

    const doc = await db.collection('labAttempts').findOne(query);
    if (!doc) {
      return memoryAttempts.get(id) || null;
    }

    return {
      id: doc._id.toString(),
      ownerId: doc.ownerId,
      labSlug: doc.labSlug,
      scenarioId: doc.scenarioId,
      version: doc.version,
      seed: doc.seed,
      status: doc.status,
      draftState: doc.draftState || {},
      revision: doc.revision || 1,
      createdAt: doc.createdAt?.toISOString?.() || doc.createdAt,
      updatedAt: doc.updatedAt?.toISOString?.() || doc.updatedAt
    };
  } catch (err) {
    return memoryAttempts.get(id) || null;
  }
}

export async function saveDraft(params: {
  attemptId: string;
  ownerId: string;
  expectedRevision: number;
  draftState: Record<string, unknown>;
}): Promise<{ success: boolean; revision: number; conflict?: boolean }> {
  const { attemptId, ownerId, expectedRevision, draftState } = params;

  // Bound draft character length to guardrails (100,000 chars)
  const serialized = JSON.stringify(draftState);
  if (serialized.length > 100000) {
    throw new Error('Draft payload exceeds 100,000 characters limit');
  }

  const now = new Date().toISOString();
  const nextRevision = expectedRevision + 1;

  try {
    const db = await getDatabase();
    let filter: Record<string, unknown> = { 
      ownerId,
      revision: expectedRevision
    };

    if (ObjectId.isValid(attemptId)) {
      filter._id = new ObjectId(attemptId);
    } else {
      filter.id = attemptId;
    }

    const res = await db.collection('labAttempts').updateOne(
      filter,
      {
        $set: {
          draftState,
          revision: nextRevision,
          updatedAt: new Date(now)
        }
      }
    );

    if (res.matchedCount === 0) {
      // Check if attempt exists to determine if it's a conflict
      const existing = await db.collection('labAttempts').findOne(
        ObjectId.isValid(attemptId) ? { _id: new ObjectId(attemptId), ownerId } : { id: attemptId, ownerId }
      );
      if (existing && existing.revision !== expectedRevision) {
        return { success: false, revision: existing.revision, conflict: true };
      }
    }

    return { success: true, revision: nextRevision };
  } catch (err) {
    // Memory fallback
    const mem = memoryAttempts.get(attemptId);
    if (mem && mem.ownerId === ownerId) {
      if (mem.revision !== expectedRevision) {
        return { success: false, revision: mem.revision, conflict: true };
      }
      mem.draftState = draftState;
      mem.revision = nextRevision;
      mem.updatedAt = now;
      return { success: true, revision: nextRevision };
    }
    return { success: true, revision: nextRevision };
  }
}

export async function saveSubmission(
  submission: LabSubmissionResult,
  answers: Record<string, unknown>
): Promise<{ success: boolean; duplicate?: boolean }> {
  try {
    await ensureIndexes();
    const db = await getDatabase();

    // Check if idempotency key was already recorded
    const existing = await db.collection('labSubmissions').findOne({
      attemptId: submission.attemptId,
      idempotencyKey: submission.idempotencyKey
    });

    if (existing) {
      return { success: true, duplicate: true };
    }

    await db.collection('labSubmissions').insertOne({
      ownerId: submission.ownerId,
      attemptId: submission.attemptId,
      idempotencyKey: submission.idempotencyKey,
      labSlug: submission.labSlug,
      serverScore: submission.serverScore,
      passed: submission.passed,
      criterionResults: submission.criterionResults,
      answers,
      submittedAt: new Date(submission.submittedAt)
    });

    // Mark attempt as submitted
    await db.collection('labAttempts').updateOne(
      ObjectId.isValid(submission.attemptId) 
        ? { _id: new ObjectId(submission.attemptId), ownerId: submission.ownerId }
        : { id: submission.attemptId, ownerId: submission.ownerId },
      { $set: { status: 'submitted', updatedAt: new Date() } }
    );

    return { success: true };
  } catch (err) {
    // Memory fallback
    memorySubmissions.set(`${submission.attemptId}_${submission.idempotencyKey}`, submission);
    return { success: true };
  }
}

export async function saveArtifact(artifact: Omit<LabArtifact, 'id'>): Promise<LabArtifact> {
  const artifactId = new ObjectId().toHexString();
  const created: LabArtifact = {
    ...artifact,
    id: artifactId
  };

  try {
    const db = await getDatabase();
    await db.collection('labArtifacts').insertOne({
      _id: new ObjectId(artifactId),
      ownerId: artifact.ownerId,
      attemptId: artifact.attemptId,
      labSlug: artifact.labSlug,
      artifactType: artifact.artifactType,
      payload: artifact.payload,
      createdAt: new Date(artifact.createdAt)
    });
  } catch (err) {
    const list = memoryArtifacts.get(artifact.attemptId) || [];
    list.push(created);
    memoryArtifacts.set(artifact.attemptId, list);
  }

  return created;
}
