import { ScoringCriterionResult, LabSubmissionResult } from '../types';

// =========================================================================
// LAB 03: SQL Query Logic Lab
// =========================================================================
export function evaluateSqlQueryLogicLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const correctCount = Number(answers.correctCount) || 0;
  const totalQuestions = Number(answers.totalQuestions) || 6;
  const dedupeCustomers = Boolean(answers.dedupeCustomers);
  const guardNullAmounts = Boolean(answers.guardNullAmounts);
  const explanation = String(answers.explanation || '').trim();
  const maxJoinAnimStepReached = Number(answers.maxJoinAnimStepReached) || 0;

  const allQuestionsCorrect = correctCount >= totalQuestions;
  const bothHygieneFixesApplied = dedupeCustomers && guardNullAmounts;
  const oneHygieneFixApplied = dedupeCustomers || guardNullAmounts;

  const c1Earned = Math.round(60 * Math.min(1, correctCount / Math.max(1, totalQuestions)));
  const c2Earned = bothHygieneFixesApplied ? 25 : oneHygieneFixApplied ? 12 : 0;
  const explanationOk = explanation.length >= 30;
  const steppedThroughJoin = maxJoinAnimStepReached > 0;
  const c3Earned = (explanationOk ? 8 : 2) + (steppedThroughJoin ? 7 : 0);

  const criteria: ScoringCriterionResult[] = [
    {
      id: 'sql-c1',
      name: 'Six-Question Block Configuration Accuracy',
      category: 'correctness',
      earned: c1Earned,
      max: 60,
      passed: allQuestionsCorrect,
      feedback: allQuestionsCorrect
        ? 'All six questions were answered with block arrangements and predictions that match the required relational logic.'
        : `${correctCount}/${totalQuestions} questions correctly configured and predicted — recheck join type, WHERE filters and GROUP BY for the remaining questions.`
    },
    {
      id: 'sql-c2',
      name: 'Duplicate Key & NULL Value Guards',
      category: 'constraints',
      earned: c2Earned,
      max: 25,
      passed: bothHygieneFixesApplied,
      feedback: bothHygieneFixesApplied
        ? 'Duplicate customer signup keys were deduplicated and NULL payment amounts were guarded before aggregation.'
        : 'Duplicate customer keys inflate totals and unguarded NULL amounts corrupt sums — enable both data-hygiene fixes.'
    },
    {
      id: 'sql-c3',
      name: 'Join Walkthrough & Written Explanation',
      category: 'evidence',
      earned: c3Earned,
      max: 15,
      passed: explanationOk && steppedThroughJoin,
      feedback: explanationOk && steppedThroughJoin
        ? 'Stepped through the row-by-row join walkthrough and documented why LEFT JOIN retains unmatched customers.'
        : `${!steppedThroughJoin ? 'Advance the join walkthrough at least once before submitting. ' : ''}${!explanationOk ? 'Explanation is too brief.' : ''}`
    }
  ];

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);
  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'sql-query-logic-lab',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: serverScore >= 75 ? [] : ['Work through each of the six questions in order, and remember that duplicate customer keys and unguarded NULL amounts silently corrupt aggregate totals.'],
    submittedAt: new Date().toISOString()
  };
}
