import { ScoringCriterionResult, LabSubmissionResult } from '../types';

// =========================================================================
// LAB 23: Business Financial Model Lab
// =========================================================================

interface SubmittedAssumptions {
  unitsSold: number;
  unitPrice: number;
  variableCostPerUnit: number;
  fixedCostsMonthly: number;
  collectionLagPercent: number;
  openingCash: number;
  openingReceivable: number;
}

interface SubmittedModel {
  revenue: number;
  totalVariableCost: number;
  contributionMarginPerUnit: number;
  totalContribution: number;
  netOperatingIncome: number;
  breakEvenUnits: number | null;
}

interface SubmittedMonth {
  month: number;
  revenue: number;
  variableCost: number;
  fixedCost: number;
  collectionLagPercent: number;
  openingCashForMonth: number;
  cashIn: number;
  cashOut: number;
  closingCash: number;
  nextReceivable: number;
}

const TOLERANCE = 1;
const close = (a: number, b: number) => Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= TOLERANCE;

export function evaluateBusinessFinancialModelLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const assumptions = (answers.assumptions as SubmittedAssumptions) || ({} as SubmittedAssumptions);
  const model = (answers.model as SubmittedModel) || ({} as SubmittedModel);
  const monthsAdvanced = Number(answers.monthsAdvanced || 0);
  const cashHistory = Array.isArray(answers.cashHistory) ? (answers.cashHistory as SubmittedMonth[]) : [];
  const varianceVsBaseline = Array.isArray(answers.varianceVsBaseline) ? answers.varianceVsBaseline : [];
  const memo = String(answers.assumptionsMemo || '').trim();

  // --- Break-even formula: units = fixedCost / (price - variableCost), or
  // "no finite break-even" when contribution per unit is zero or negative.
  // This generically covers the required case (price 50, variable cost 30,
  // fixed cost 1000 -> 50 units) because it re-derives from the same inputs.
  const contributionPerUnit = Number(assumptions.unitPrice) - Number(assumptions.variableCostPerUnit);
  const expectedBreakEven = contributionPerUnit > 0 ? Math.ceil(Number(assumptions.fixedCostsMonthly) / contributionPerUnit) : null;
  const breakEvenCorrect =
    expectedBreakEven === null ? model.breakEvenUnits === null : model.breakEvenUnits !== null && close(model.breakEvenUnits, expectedBreakEven);

  // --- Revenue / contribution arithmetic coherence.
  const expectedRevenue = Number(assumptions.unitsSold) * Number(assumptions.unitPrice);
  const expectedVariableCost = Number(assumptions.unitsSold) * Number(assumptions.variableCostPerUnit);
  const expectedContribution = expectedRevenue - expectedVariableCost;
  const expectedNetIncome = expectedContribution - Number(assumptions.fixedCostsMonthly);
  const arithmeticCoherent =
    close(model.revenue, expectedRevenue) &&
    close(model.totalVariableCost, expectedVariableCost) &&
    close(model.totalContribution, expectedContribution) &&
    close(model.netOperatingIncome, expectedNetIncome);

  // --- Cash-flow chain self-consistency: each month's closing cash must equal
  // opening + cashIn - cashOut, cashOut must equal variableCost + fixedCost,
  // and collections must be tracked separately from sales (cashIn recomputed
  // from this month's on-time collections plus the PRIOR month's delayed receivable).
  let chainCoherent = cashHistory.length > 0 && cashHistory.length === monthsAdvanced;
  let priorReceivable = Number(assumptions.openingReceivable);
  let priorClosing = Number(assumptions.openingCash);
  for (const m of cashHistory) {
    const expectedCashOut = m.variableCost + m.fixedCost;
    const expectedCashIn = m.revenue * (1 - m.collectionLagPercent / 100) + priorReceivable;
    const expectedClosing = m.openingCashForMonth + m.cashIn - m.cashOut;
    if (
      !close(m.openingCashForMonth, priorClosing) ||
      !close(m.cashOut, expectedCashOut) ||
      !close(m.cashIn, expectedCashIn) ||
      !close(m.closingCash, expectedClosing)
    ) {
      chainCoherent = false;
    }
    priorReceivable = m.nextReceivable;
    priorClosing = m.closingCash;
  }
  const testedDelayedCollections = monthsAdvanced >= 2;

  const evidenceComplete = memo.length >= 20 && varianceVsBaseline.length === 4;

  const criteria: ScoringCriterionResult[] = [
    {
      id: 'fin-c1',
      name: 'Break-Even Formula: Fixed / (Price − Variable), or No Finite Break-Even',
      category: 'correctness',
      earned: breakEvenCorrect ? 35 : 15,
      max: 35,
      passed: breakEvenCorrect,
      feedback: breakEvenCorrect
        ? (expectedBreakEven !== null
          ? `Break-even correctly computed at ${expectedBreakEven} units from the current price/cost assumptions.`
          : 'Correctly reported no finite break-even for a zero/negative contribution margin.')
        : 'Break-even units did not match Fixed Cost / (Price − Variable Cost) for the submitted assumptions.',
    },
    {
      id: 'fin-c2',
      name: 'Revenue & Contribution Arithmetic Coherence',
      category: 'correctness',
      earned: arithmeticCoherent ? 25 : 10,
      max: 25,
      passed: arithmeticCoherent,
      feedback: arithmeticCoherent
        ? 'Revenue, variable cost, contribution, and net operating income all reconcile with units × price and revenue − variable cost.'
        : 'Reported P&L figures do not reconcile with the submitted assumptions.',
    },
    {
      id: 'fin-c3',
      name: 'Cash-Flow Timing: Collections Tracked Separately From Sales',
      category: 'constraints',
      earned: chainCoherent && testedDelayedCollections ? 25 : chainCoherent ? 15 : 5,
      max: 25,
      passed: chainCoherent && testedDelayedCollections,
      feedback: chainCoherent
        ? (testedDelayedCollections
          ? 'Advanced the simulation clock across at least two months, and each month\'s cash-in correctly separates on-time collections from the prior month\'s delayed receivable.'
          : 'Cash-flow math is internally consistent, but advance the clock through at least 2 months to demonstrate delayed-collection timing.')
        : 'Cash-flow chain is not internally consistent — closing cash must equal opening cash plus collections minus outflows each month.',
    },
    {
      id: 'fin-c4',
      name: 'Saved Evidence: Scenario Report & Assumptions Memo',
      category: 'evidence',
      earned: evidenceComplete ? 15 : 7,
      max: 15,
      passed: evidenceComplete,
      feedback: evidenceComplete
        ? 'Assumptions memo and a full 4-line-item variance-vs-baseline report were captured.'
        : 'Write a substantive assumptions memo (20+ characters) and ensure the baseline variance report is complete.',
    },
  ];

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);
  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'business-financial-model-lab',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: breakEvenCorrect && arithmeticCoherent && chainCoherent
      ? []
      : ['Recheck break-even = Fixed Cost / (Price − Variable Cost), and confirm each month\'s closing cash equals opening cash plus collections minus outflows.'],
    submittedAt: new Date().toISOString(),
  };
}
