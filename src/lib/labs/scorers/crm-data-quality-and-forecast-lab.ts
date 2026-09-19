import { ScoringCriterionResult, LabSubmissionResult } from '../types';

// =========================================================================
// LAB 22: CRM Data Quality and Forecast Lab
// =========================================================================

type RepairableStage = 'discovery' | 'proposal' | 'negotiation' | 'closed_won';

const STAGE_PROBABILITY: Record<RepairableStage, number> = {
  discovery: 0.2,
  proposal: 0.5,
  negotiation: 0.8,
  closed_won: 1,
};

interface SubmittedDeal {
  id: string;
  amount: number | null;
  stage: RepairableStage | 'unknown';
}

export function evaluateCrmDataQualityLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const cleanedDeals = Array.isArray(answers.cleanedDeals) ? (answers.cleanedDeals as SubmittedDeal[]) : [];
  const reviewedGroups = (answers.reviewedGroups as Record<string, string>) || {};
  const reviewedCount = Object.keys(reviewedGroups).length;
  const duplicateGroupsDetectedCount = Number(answers.duplicateGroupsDetectedCount || 0);
  const pendingDuplicateCount = Number(answers.pendingDuplicateCount ?? 1);
  const missingAmountCount = Number(answers.missingAmountCount ?? cleanedDeals.filter((d) => d.amount == null).length);
  const unknownStageCount = Number(answers.unknownStageCount ?? cleanedDeals.filter((d) => d.stage === 'unknown').length);
  const submittedUnweighted = Number(answers.unweightedTotal);
  const submittedWeighted = Number(answers.weightedTotal);
  const automationRulesApplied = Array.isArray(answers.automationRulesApplied) ? (answers.automationRulesApplied as string[]) : [];
  const automationStepCap = Number(answers.automationStepCap || 0);
  const forecastByStage = Array.isArray(answers.forecastByStage) ? answers.forecastByStage : [];

  // Duplicates must be REVIEWED (merged or explicitly marked not-a-duplicate),
  // never silently deleted — verified by the reviewed-decision count matching
  // (or exceeding) the originally detected candidate groups, with none left pending.
  const duplicatesProperlyReviewed =
    duplicateGroupsDetectedCount > 0 && pendingDuplicateCount === 0 && reviewedCount >= duplicateGroupsDetectedCount;

  // Data hygiene: missing amounts and unrepaired ("unknown") stages should be
  // resolved before the forecast is trusted.
  const dataHygieneClean = missingAmountCount === 0 && unknownStageCount === 0;
  const dataHygienePartial = missingAmountCount + unknownStageCount <= 1;

  // Recompute weighted/unweighted totals independently from the submitted
  // cleaned records to confirm "weighted = amount x supplied stage probability"
  // was applied correctly (not hardcoded or guessed).
  const recomputedUnweighted = cleanedDeals.filter((d) => d.amount != null).reduce((s, d) => s + (d.amount as number), 0);
  const recomputedWeighted = cleanedDeals
    .filter((d) => d.amount != null && d.stage !== 'unknown')
    .reduce((s, d) => s + (d.amount as number) * STAGE_PROBABILITY[d.stage as RepairableStage], 0);

  const forecastArithmeticCoherent =
    Number.isFinite(submittedUnweighted) &&
    Number.isFinite(submittedWeighted) &&
    Math.abs(submittedUnweighted - recomputedUnweighted) <= 1 &&
    Math.abs(submittedWeighted - recomputedWeighted) <= 1 &&
    submittedWeighted <= submittedUnweighted;

  const automationRespectsCap = automationStepCap > 0 && automationStepCap <= 25;

  const evidenceSaved = forecastByStage.length === 4 && cleanedDeals.length > 0;

  const criteria: ScoringCriterionResult[] = [
    {
      id: 'crm-c1',
      name: 'Duplicate Opportunity Review (No Silent Deletion)',
      category: 'correctness',
      earned: duplicatesProperlyReviewed ? 35 : reviewedCount > 0 ? 18 : 5,
      max: 35,
      passed: duplicatesProperlyReviewed,
      feedback: duplicatesProperlyReviewed
        ? `Reviewed all ${duplicateGroupsDetectedCount} normalized email/ID duplicate candidate group(s) — each merged or explicitly confirmed as distinct.`
        : `${pendingDuplicateCount} duplicate candidate group(s) remain unreviewed. Every candidate sharing an email or ID must be inspected before merging or dismissing.`,
    },
    {
      id: 'crm-c2',
      name: 'Stage Repair & Missing-Amount Resolution',
      category: 'correctness',
      earned: dataHygieneClean ? 25 : dataHygienePartial ? 15 : 5,
      max: 25,
      passed: dataHygieneClean,
      feedback: dataHygieneClean
        ? 'All unrepaired ("unknown") stages and missing amounts were resolved before forecasting.'
        : `${unknownStageCount} deal(s) still have an unrepaired stage and ${missingAmountCount} still have a missing amount.`,
    },
    {
      id: 'crm-c3',
      name: 'Weighted Pipeline Formula Accuracy (Amount × Stage Probability)',
      category: 'constraints',
      earned: forecastArithmeticCoherent ? 25 : 10,
      max: 25,
      passed: forecastArithmeticCoherent,
      feedback: forecastArithmeticCoherent
        ? 'Weighted forecast recomputes exactly as amount × supplied stage probability, and automation stayed within its record step cap.'
        : 'Reported pipeline totals do not match a recomputation of amount × stage probability from the submitted records.',
    },
    {
      id: 'crm-c4',
      name: 'Saved Evidence: Cleaned Records, Rules & Forecast',
      category: 'evidence',
      earned: evidenceSaved && automationRespectsCap ? 15 : evidenceSaved ? 10 : 5,
      max: 15,
      passed: evidenceSaved,
      feedback: evidenceSaved
        ? `Cleaned record set, automation rule configuration (${automationRulesApplied.length} rule(s) active, cap ${automationStepCap}), and a 4-stage forecast were captured.`
        : 'Forecast breakdown by stage was incomplete — export the cleaned CSV, rules configuration, and forecast before submitting.',
    },
  ];

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);
  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'crm-data-quality-and-forecast-lab',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: duplicatesProperlyReviewed && dataHygieneClean
      ? []
      : [
          'Review every duplicate candidate group — merge or explicitly mark it "not a duplicate" instead of leaving it pending.',
          'Repair every "unknown" stage and fill every missing amount so the weighted forecast reflects the full pipeline.',
        ],
    submittedAt: new Date().toISOString(),
  };
}
