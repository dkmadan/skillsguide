import { ScoringCriterionResult, LabSubmissionResult } from '../types';

// =========================================================================
// LAB 13: DevOps Pipeline Diagnosis Lab
// =========================================================================
// Mirrors the three authored scenarios in DevOpsPipelineDiagnosisLab.tsx —
// kept in sync manually since each lab embeds its own fixtures client-side.
const CANONICAL_ORDER: Record<string, string[]> = {
  beginner: ['lint', 'config_validate', 'unit_test', 'integration', 'canary'],
  intermediate: ['lint', 'unit_test', 'fix_test', 'integration', 'canary'],
  challenge: ['lint', 'resolve_deps', 'unit_test', 'integration', 'canary'],
};
const CORRECT_FIX: Record<string, string> = {
  beginner: 'add_config_validate',
  intermediate: 'patch_discount_logic',
  challenge: 'pin_compatible_versions',
};
const ROLLBACK_AVAILABLE: Record<string, boolean> = {
  beginner: true,
  intermediate: true,
  challenge: false,
};

export function evaluateDevOpsPipelineLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  // The scorer barrel does not forward `variant` as a positional argument, so
  // the component echoes it into `answers.variant` for the scorer to read.
  const variant = String(answers.variant || 'beginner');
  const stageOrder = Array.isArray(answers.stageOrder) ? (answers.stageOrder as string[]) : [];
  const selectedFix = String(answers.selectedFix || '');
  const rollbackChosen = Boolean(answers.rollbackChosen);
  const allGreen = Boolean(answers.allGreen);
  const citedLogIds = Array.isArray(answers.citedLogIds) ? (answers.citedLogIds as unknown[]) : [];
  const releaseNote = String(answers.releaseNote || '').trim();

  const canonical = CANONICAL_ORDER[variant] ?? CANONICAL_ORDER.beginner;
  const rollbackAvailable = ROLLBACK_AVAILABLE[variant] ?? true;
  const orderCorrect = stageOrder.length === canonical.length && stageOrder.every((id, i) => id === canonical[i]);
  const fixCorrect = selectedFix === (CORRECT_FIX[variant] ?? CORRECT_FIX.beginner);

  const resolvedViaFix = allGreen && !rollbackChosen && orderCorrect && fixCorrect;
  const resolvedViaValidRollback = allGreen && rollbackChosen && rollbackAvailable;
  // Choosing rollback when none is available and correctly recognizing the
  // failure (via the explanation panel + citing evidence) still demonstrates
  // sound judgement, even though the pipeline itself stays red.
  const recognizedRollbackTrap = !rollbackAvailable && rollbackChosen && citedLogIds.length > 0;

  const correctnessEarned = resolvedViaFix ? 60 : resolvedViaValidRollback ? 35 : recognizedRollbackTrap ? 20 : 15;
  const constraintsEarned = orderCorrect && (rollbackAvailable || !rollbackChosen) ? 25 : orderCorrect || fixCorrect ? 15 : 5;
  const evidenceEarned = releaseNote.length >= 20 && citedLogIds.length > 0 ? 15 : releaseNote.length >= 20 || citedLogIds.length > 0 ? 8 : 0;

  const criteria: ScoringCriterionResult[] = [
    {
      id: 'dvo-c1',
      name: 'Causal Root-Cause Remediation (Correct Fix + Stage Order)',
      category: 'correctness',
      earned: correctnessEarned,
      max: 60,
      passed: resolvedViaFix,
      feedback: resolvedViaFix
        ? 'Applied the correct root-cause fix and stage order — the pipeline reaches a fully green, scenario-verified state.'
        : resolvedViaValidRollback
        ? 'Rollback resolved the immediate build, but did not fix the root cause forward.'
        : recognizedRollbackTrap
        ? 'Correctly recognized that rollback is unavailable for a first-ever release and cited the supporting log evidence.'
        : 'Pipeline is still blocked — recheck the causal log line and apply the matching fix in the correct stage order.',
    },
    {
      id: 'dvo-c2',
      name: 'Stage Prerequisites & Rollback Availability',
      category: 'constraints',
      earned: constraintsEarned,
      max: 25,
      passed: orderCorrect,
      feedback: orderCorrect
        ? 'Final stage order matches the required dependency sequence, so no stage runs before its prerequisite.'
        : 'Stage order does not match the required prerequisite sequence — a downstream stage still runs before what it depends on.',
    },
    {
      id: 'dvo-c3',
      name: 'Cited Evidence & Release Note',
      category: 'evidence',
      earned: evidenceEarned,
      max: 15,
      passed: releaseNote.length >= 20 && citedLogIds.length > 0,
      feedback: releaseNote.length >= 20 && citedLogIds.length > 0
        ? 'Cited the causal log lines and documented the fix and rollback reasoning in the release note.'
        : 'Cite at least one causal log line and write a release note of 20+ characters.',
    },
  ];

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);
  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'devops-pipeline-diagnosis-lab',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: resolvedViaFix ? [] : ['Re-read the first error log line, reorder the stage that catches it earlier, and select the fix that addresses that exact cause.'],
    submittedAt: new Date().toISOString(),
  };
}
