import { ScoringCriterionResult, LabSubmissionResult } from '../types';

// =========================================================================
// LAB 01: Business Analyst Desk
// =========================================================================
export function evaluateBusinessAnalystLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const removedDuplicates = Boolean(answers.removedDuplicates);
  const excludedCancelled = Boolean(answers.excludedCancelled);
  const imputedBlankRegions = Boolean(answers.imputedBlankRegions);
  const memo = String(answers.findingsMemo || '').trim();
  const calculatedNetRevenue = Number(answers.calculatedNetRevenue);
  const rawNetRevenue = Number(answers.rawNetRevenue);

  const stepsApplied = [removedDuplicates, excludedCancelled, imputedBlankRegions].filter(Boolean).length;
  const allStepsApplied = stepsApplied === 3;

  const revenueIsCoherent =
    Number.isFinite(calculatedNetRevenue) &&
    Number.isFinite(rawNetRevenue) &&
    calculatedNetRevenue >= 0 &&
    calculatedNetRevenue <= rawNetRevenue;

  const criteria: ScoringCriterionResult[] = [
    {
      id: 'ba-c1',
      name: 'Data Hygiene (Duplicates, Cancelled Orders & Blank Regions Resolved)',
      category: 'correctness',
      earned: allStepsApplied ? 60 : stepsApplied === 2 ? 40 : stepsApplied === 1 ? 20 : 0,
      max: 60,
      passed: allStepsApplied,
      feedback: allStepsApplied
        ? 'Deduplicated repeated transactions, excluded cancelled orders, and resolved blank region entities.'
        : `Applied ${stepsApplied}/3 required cleaning steps. Ensure duplicates are pruned, cancelled orders excluded, and blank regions imputed.`
    },
    {
      id: 'ba-c2',
      name: 'Integrity of Revenue Aggregations',
      category: 'constraints',
      earned: revenueIsCoherent ? 25 : 10,
      max: 25,
      passed: revenueIsCoherent,
      feedback: revenueIsCoherent
        ? 'Clean net revenue is a coherent subset of raw revenue (quantity × price − discount, cancelled orders excluded).'
        : 'Reported net revenue was inconsistent with the raw revenue baseline — recheck the aggregation formula.'
    },
    {
      id: 'ba-c3',
      name: 'Findings Memo & Root-Cause Rationale',
      category: 'evidence',
      earned: memo.length >= 20 ? 15 : 5,
      max: 15,
      passed: memo.length >= 20,
      feedback: memo.length >= 20 ? 'Executive findings memo drafted with actionable insights.' : 'Findings memo is too brief.'
    }
  ];

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);
  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'business-analyst-desk',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: serverScore >= 75 ? [] : ['Check for duplicate transaction keys, cancelled-order exclusion, and blank-region imputation in the raw order batch.'],
    submittedAt: new Date().toISOString()
  };
}
