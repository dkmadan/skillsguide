import { ScoringCriterionResult, LabSubmissionResult } from '../types';

// =========================================================================
// LAB 04: BI Dashboard Design Lab
// =========================================================================
export function evaluateBiDashboardLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const computedTotalRevenue = Number(answers.computedTotalRevenue);
  const correctTotalRevenue = Number(answers.correctTotalRevenue);
  const selectedMeasures = (answers.selectedMeasures as Record<string, boolean>) || {};
  const drillPath = (answers.drillPath as string[]) || ['All'];
  const biObservations = String(answers.biObservations || '').trim();

  // Verification case named in the spec: correct relationships must
  // preserve the expected revenue — a wrongly-modeled many-to-many
  // relationship fans out duplicate dimension keys and inflates the total.
  const revenuePreserved = Number.isFinite(computedTotalRevenue) && Number.isFinite(correctTotalRevenue) && computedTotalRevenue === correctTotalRevenue;

  const requiredMeasuresSelected = Boolean(selectedMeasures.totalSales) && Boolean(selectedMeasures.marginPct) && Boolean(selectedMeasures.distinctCustomers);
  const usedDrillDown = drillPath.length > 1;

  // Count distinct, non-trivial sentences/lines as a proxy for "two business observations".
  const observationLines = biObservations.split(/\n|(?<=[.!?])\s+(?=[A-Z0-9])/).map((l) => l.trim()).filter((l) => l.length >= 10);
  const hasTwoObservations = observationLines.length >= 2;

  const c1Earned = revenuePreserved ? 60 : 20;
  const c2Earned = requiredMeasuresSelected ? 25 : 10;
  const c3Earned = (hasTwoObservations ? 10 : 4) + (usedDrillDown ? 5 : 0);

  const criteria: ScoringCriterionResult[] = [
    {
      id: 'bi-c1',
      name: 'Schema Relationships Preserve Expected Revenue',
      category: 'correctness',
      earned: c1Earned,
      max: 60,
      passed: revenuePreserved,
      feedback: revenuePreserved
        ? `Computed total revenue (₹${Number.isFinite(computedTotalRevenue) ? computedTotalRevenue.toLocaleString() : '—'}) exactly matches the expected fact-table total — duplicate dimension keys were not allowed to fan out the join.`
        : `Computed total revenue (₹${Number.isFinite(computedTotalRevenue) ? computedTotalRevenue.toLocaleString() : '—'}) does not match the expected ₹${Number.isFinite(correctTotalRevenue) ? correctTotalRevenue.toLocaleString() : '—'} — a many-to-many (raw duplicate key) relationship is inflating totals.`
    },
    {
      id: 'bi-c2',
      name: 'Core Executive Measures Selected (Sales, Margin, Distinct Customers)',
      category: 'constraints',
      earned: c2Earned,
      max: 25,
      passed: requiredMeasuresSelected,
      feedback: requiredMeasuresSelected
        ? 'Total Sales, Profit Margin %, and Distinct Customers measures are all present on the dashboard.'
        : 'The mission requires Total Sales, Profit Margin %, and Distinct Customers on the dashboard grid.'
    },
    {
      id: 'bi-c3',
      name: 'Business Observations & Drill-Down Usage',
      category: 'evidence',
      earned: c3Earned,
      max: 15,
      passed: hasTwoObservations,
      feedback: hasTwoObservations
        ? 'Documented at least two distinct business observations, grounded in the dashboard data.'
        : 'Document at least two separate business observations drawn from the dashboard.'
    }
  ];

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);
  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'bi-dashboard-design-lab',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: serverScore >= 75 ? [] : ['Deduplicate customer and product keys to a 1:many relationship, keep Sales/Margin/Distinct Customers on the dashboard, and record two grounded observations.'],
    submittedAt: new Date().toISOString()
  };
}
