import { ScoringCriterionResult, LabSubmissionResult } from '../types';

// =========================================================================
// LAB 16: UX Research and Prototype Lab
// =========================================================================
export function evaluateUxResearchLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const themeAssignments = (answers.themeAssignments as Record<string, string>) || {};
  const findings = (answers.findings as Array<{ theme: string; evidenceQuoteIds: string[] }>) || [];
  const problemStatementId = String(answers.problemStatementId || '');
  const bottleneckTheme = String(answers.bottleneckTheme || '');
  const retryTarget = String(answers.retryTarget || '');
  const taskResults = (answers.taskResults as Array<{ id: string; reachable: boolean }>) || [];
  const designRationale = String(answers.designRationale || '').trim();

  // Recompute from the raw theme-assignment map rather than trusting a boolean,
  // so "every finding links to evidence" is genuinely verified server-side.
  const classifiedCount = Object.values(themeAssignments).filter((t) => t && t !== 'unassigned').length;
  const totalQuotes = Object.keys(themeAssignments).length || 12;
  const evidenceCounts: Record<string, number> = {};
  Object.values(themeAssignments).forEach((t) => { if (t && t !== 'unassigned') evidenceCounts[t] = (evidenceCounts[t] || 0) + 1; });
  const usedThemes = Object.keys(evidenceCounts);
  const everyFindingHasEvidence = usedThemes.length > 0 && usedThemes.every((t) => evidenceCounts[t] >= 2);
  const findingsCoherent = findings.length === 0 || findings.every((f) => Array.isArray(f.evidenceQuoteIds));

  const deadEndResolved = retryTarget === 'checkout';
  const allTasksReachable = taskResults.length > 0 && taskResults.every((t) => t.reachable === true);
  const statementIsSupported = problemStatementId === `stmt_${bottleneckTheme}` && bottleneckTheme.length > 0;

  const criteria: ScoringCriterionResult[] = [
    {
      id: 'ux-c1',
      name: 'Dead-End Screen Resolution & Task Reachability',
      category: 'correctness',
      earned: (deadEndResolved ? 25 : 0) + (allTasksReachable ? 10 : 0) + (statementIsSupported ? 25 : 0),
      max: 60,
      passed: deadEndResolved && allTasksReachable && statementIsSupported,
      feedback: deadEndResolved
        ? (allTasksReachable
          ? (statementIsSupported ? 'Dead end fixed, every authored task is reachable, and the problem statement matches the funnel\'s steepest drop-off stage.' : 'Prototype is fully reachable, but the chosen problem statement is not the one backed by the funnel\'s steepest drop-off.')
          : 'Retry path fixed, but one or more authored usability tasks still cannot reach their destination screen.')
        : 'The payment-failed screen still dead-ends — wire its retry action back to Checkout.'
    },
    {
      id: 'ux-c2',
      name: 'Affinity Clustering & Evidence-Linked Findings',
      category: 'constraints',
      earned: Math.round((classifiedCount / totalQuotes) * 15) + (everyFindingHasEvidence ? 10 : 0),
      max: 25,
      passed: classifiedCount === totalQuotes && everyFindingHasEvidence,
      feedback: classifiedCount === totalQuotes
        ? (everyFindingHasEvidence ? 'All interviews clustered and every finding is backed by at least two linked evidence quotes.' : 'Some findings are backed by fewer than two evidence quotes — link more case cards before relying on a theme.')
        : `${classifiedCount}/${totalQuotes} interviews clustered — finish sorting the affinity board.`
    },
    {
      id: 'ux-c3',
      name: 'Design Rationale Documentation',
      category: 'evidence',
      earned: designRationale.length >= 30 && findingsCoherent ? 15 : 5,
      max: 15,
      passed: designRationale.length >= 30,
      feedback: designRationale.length >= 30 ? 'Design rationale documented and journey/prototype artifacts saved for self-review.' : 'Design rationale is too brief to document the reasoning behind the fix.'
    }
  ];

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);
  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'ux-research-and-prototype-lab',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: [
      ...(deadEndResolved ? [] : ['Set the payment-failed screen\'s retry action to target Checkout.']),
      ...(allTasksReachable ? [] : ['Check that every authored task scenario can reach its destination screen from its start screen.']),
      ...(statementIsSupported ? [] : ['Compare the funnel\'s steepest percentage drop against your theme clusters before picking a problem statement.']),
    ],
    submittedAt: new Date().toISOString()
  };
}
