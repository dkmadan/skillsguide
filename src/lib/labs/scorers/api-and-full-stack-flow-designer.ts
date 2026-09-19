import { ScoringCriterionResult, LabSubmissionResult } from '../types';

// =========================================================================
// LAB 10: API & Full Stack Flow Designer
// =========================================================================
export function evaluateApiFlowDesignerLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const statusesAchieved = (answers.statusesAchieved as Record<string, boolean>) || {};
  const has401 = Boolean(statusesAchieved.has401);
  const has400 = Boolean(statusesAchieved.has400);
  const has201 = Boolean(statusesAchieved.has201);
  const has409 = Boolean(statusesAchieved.has409);
  const genuineDuplicateProof = Boolean(answers.genuineDuplicateProof);

  const requiredFields = (answers.requiredFields as Record<string, boolean>) || {};
  const rolePermissions = (answers.rolePermissions as Record<string, boolean>) || {};
  const schemaCorrect = Boolean(requiredFields.courseId) && Boolean(requiredFields.learnerEmail);
  const permissionsCorrect = rolePermissions.anonymous === false && rolePermissions.authenticated_student === true;

  const notes = String(answers.notes || '').trim();
  const maxFlowStepReached = Number(answers.maxFlowStepReached) || 0;

  const statusesCount = [has401, has400, has201, has409].filter(Boolean).length;
  const allStatusesTested = statusesCount === 4;

  const c1Earned = Math.round(35 * (statusesCount / 4)) + (schemaCorrect && permissionsCorrect ? 25 : schemaCorrect || permissionsCorrect ? 12 : 0);
  const c2Earned = has409 && genuineDuplicateProof ? 25 : has409 ? 12 : 0;
  const notesOk = notes.length >= 20;
  const exploredFlow = maxFlowStepReached > 0;
  const c3Earned = (notesOk ? 7 : 2) + (exploredFlow ? 8 : 0);

  const criteria: ScoringCriterionResult[] = [
    {
      id: 'api-c1',
      name: 'HTTP Status Contract Coverage & Config Correctness',
      category: 'correctness',
      earned: c1Earned,
      max: 60,
      passed: allStatusesTested && schemaCorrect && permissionsCorrect,
      feedback: allStatusesTested && schemaCorrect && permissionsCorrect
        ? 'Verified all four contract flows (401/400/201/409) with a correctly scoped required-field schema and role permission matrix.'
        : `${!allStatusesTested ? `Tested ${statusesCount}/4 status codes. ` : ''}${!schemaCorrect ? 'courseId and learnerEmail must both be marked required. ' : ''}${!permissionsCorrect ? 'Anonymous must be denied and authenticated_student must be allowed to enroll.' : ''}`
    },
    {
      id: 'api-c2',
      name: 'Idempotency Proven Against the Record Store',
      category: 'constraints',
      earned: c2Earned,
      max: 25,
      passed: has409 && genuineDuplicateProof,
      feedback: has409 && genuineDuplicateProof
        ? 'A duplicate (courseId, learnerEmail) pair against the fictional enrollment record store correctly returned 409 Conflict.'
        : 'Dispatch the same courseId + learnerEmail twice (or reuse a seeded record) so the duplicate rejection is proven against real record-store state.'
    },
    {
      id: 'api-c3',
      name: 'Feature Flow Exploration & Contract Notes',
      category: 'evidence',
      earned: c3Earned,
      max: 15,
      passed: notesOk && exploredFlow,
      feedback: notesOk && exploredFlow
        ? 'Stepped through the UI-to-API request lifecycle and documented the contract behavior.'
        : `${!exploredFlow ? 'Advance the feature flow diagram at least once. ' : ''}${!notesOk ? 'Contract notes are too brief.' : ''}`
    }
  ];

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);
  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'api-and-full-stack-flow-designer',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: serverScore >= 75 ? [] : ['Test anonymous, missing-field, successful, and duplicate enrollment calls; keep courseId/learnerEmail required and anonymous denied.'],
    submittedAt: new Date().toISOString()
  };
}
