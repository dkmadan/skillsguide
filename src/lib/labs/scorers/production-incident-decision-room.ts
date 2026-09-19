import { ScoringCriterionResult, LabSubmissionResult } from '../types';

// =========================================================================
// LAB 14: Production Incident Decision Room
// =========================================================================
// Mirrors the three authored incidents in ProductionIncidentRoomLab.tsx —
// kept in sync manually since each lab embeds its own fixtures client-side.
const CORRECT_HYPOTHESIS: Record<string, string> = {
  beginner: 'n1_query',
  intermediate: 'gateway_timeout',
  challenge: 'expired_cert',
};
const CORRECT_MITIGATION: Record<string, string> = {
  beginner: 'rollback_canary',
  intermediate: 'circuit_breaker',
  challenge: 'rotate_cert',
};
const MIN_DISTINGUISHING_EVIDENCE = 2;

interface StatusUpdateLike {
  templateId?: unknown;
  simStep?: unknown;
}

export function evaluateProductionIncidentLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const variant = String(answers.variant || 'beginner');
  const selectedHypothesis = String(answers.selectedHypothesis || '');
  const selectedMitigation = String(answers.selectedMitigation || '');
  const isResolved = Boolean(answers.isResolved);
  const collectedEvidenceIds = Array.isArray(answers.collectedEvidenceIds) ? (answers.collectedEvidenceIds as unknown[]) : [];
  const followUpItems = Array.isArray(answers.followUpItems) ? (answers.followUpItems as unknown[]) : [];
  const incidentReport = String(answers.incidentReport || '').trim();
  const statusUpdates = Array.isArray(answers.statusUpdates) ? (answers.statusUpdates as StatusUpdateLike[]) : [];

  const hypothesisCorrect = selectedHypothesis === (CORRECT_HYPOTHESIS[variant] ?? CORRECT_HYPOTHESIS.beginner);
  const mitigationCorrect = selectedMitigation === (CORRECT_MITIGATION[variant] ?? CORRECT_MITIGATION.beginner);
  const decisionsCorrect = hypothesisCorrect && mitigationCorrect;

  // Safe escalation: a "Resolved" status update must not have been posted
  // before recovery was actually achieved (isResolved reflects the sim clock
  // having reached the branch step with the correct decisions in place).
  const anyResolvedUpdate = statusUpdates.some((u) => u.templateId === 'resolved');
  const prematureResolution = anyResolvedUpdate && !isResolved;

  const correctnessEarned = decisionsCorrect && isResolved ? 60 : decisionsCorrect || isResolved ? 30 : 15;
  const constraintsEarned = collectedEvidenceIds.length >= MIN_DISTINGUISHING_EVIDENCE && !prematureResolution
    ? 25
    : collectedEvidenceIds.length >= MIN_DISTINGUISHING_EVIDENCE || !prematureResolution
    ? 15
    : 5;
  const evidenceEarned = incidentReport.length >= 20 && followUpItems.length >= 1 ? 15 : incidentReport.length >= 20 || followUpItems.length >= 1 ? 8 : 0;

  const criteria: ScoringCriterionResult[] = [
    {
      id: 'sre-c1',
      name: 'Correct Hypothesis, Mitigation & Confirmed Recovery',
      category: 'correctness',
      earned: correctnessEarned,
      max: 60,
      passed: decisionsCorrect && isResolved,
      feedback: decisionsCorrect && isResolved
        ? 'Selected the genuine root cause over the misleading alert, applied the matching mitigation, and confirmed recovery on the simulated clock.'
        : 'Recheck the distinguishing evidence — one alert in this incident is a red herring that does not explain the full metrics pattern.',
    },
    {
      id: 'sre-c2',
      name: 'Evidence-Based Diagnosis & Safe Escalation',
      category: 'constraints',
      earned: constraintsEarned,
      max: 25,
      passed: collectedEvidenceIds.length >= MIN_DISTINGUISHING_EVIDENCE && !prematureResolution,
      feedback: prematureResolution
        ? 'A "Resolved" status update was posted before the metrics actually confirmed recovery — this is unsafe escalation.'
        : collectedEvidenceIds.length >= MIN_DISTINGUISHING_EVIDENCE
        ? 'Collected sufficient distinguishing evidence and avoided premature "resolved" status updates.'
        : 'Collect at least two distinguishing evidence log lines before committing to a hypothesis.',
    },
    {
      id: 'sre-c3',
      name: 'Incident Report & Follow-Up List',
      category: 'evidence',
      earned: evidenceEarned,
      max: 15,
      passed: incidentReport.length >= 20 && followUpItems.length >= 1,
      feedback: incidentReport.length >= 20 && followUpItems.length >= 1
        ? 'Post-incident report and follow-up action list captured as saved evidence.'
        : 'Write a post-incident summary (20+ characters) and select at least one follow-up action.',
    },
  ];

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);
  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'production-incident-decision-room',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: decisionsCorrect ? [] : ['Compare the alert timing against the distinguishing evidence log lines — the loudest alert is not always the root cause.'],
    submittedAt: new Date().toISOString(),
  };
}
