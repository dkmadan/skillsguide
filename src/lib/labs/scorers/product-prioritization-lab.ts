import { ScoringCriterionResult, LabSubmissionResult } from '../types';

// =========================================================================
// LAB 17: Product Prioritization Lab
// =========================================================================

type GoalId = 'activation_d7' | 'paid_conversion' | 'support_reduction';
type MetricId = 'd7_activation_rate' | 'checkout_completion_rate' | 'tickets_per_100_users' | 'total_pageviews' | 'social_followers' | 'nps_score';

const GOAL_PRIMARY_METRIC: Record<GoalId, MetricId> = {
  activation_d7: 'd7_activation_rate',
  paid_conversion: 'checkout_completion_rate',
  support_reduction: 'tickets_per_100_users',
};
const VANITY_METRICS: MetricId[] = ['total_pageviews', 'social_followers'];

interface FeatureAnswer { id: string; reach: number; impact: number; confidence: number; effort: number; selectedForSprint: boolean; }

export function evaluateProductPrioritizationLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const capacity = Number(answers.capacity || 0);
  const features = (answers.features as FeatureAnswer[]) || [];
  const riceScores = (answers.riceScores as Record<string, number>) || {};
  const activationGoal = String(answers.activationGoal || '') as GoalId | '';
  const primaryMetric = String(answers.primaryMetric || '') as MetricId | '';
  const guardrailMetric = String(answers.guardrailMetric || '') as MetricId | '';
  const prdProblem = String(answers.prdProblem || '').trim();

  // --- Recompute RICE server-side from the raw reach/impact/confidence/effort
  // the client sent, rather than trusting riceScores blindly.
  const recomputedRice = (f: FeatureAnswer) => (f.effort > 0 ? (f.reach * f.impact * f.confidence) / f.effort : 0);
  const riceMatches = features.length > 0 && features.every((f) => {
    const expected = recomputedRice(f);
    const reported = riceScores[f.id];
    return reported === undefined || Math.abs(expected - reported) <= Math.max(0.5, expected * 0.02);
  });

  const zeroEffortRejected = features.every((f) => !(f.effort <= 0 && f.selectedForSprint));
  const validFeatures = features.filter((f) => f.effort > 0);
  const selectedValid = validFeatures.filter((f) => f.selectedForSprint);
  const totalEffort = selectedValid.reduce((s, f) => s + f.effort, 0);
  const withinCapacity = totalEffort > 0 && totalEffort <= capacity;

  const selectedRice = selectedValid.reduce((s, f) => s + recomputedRice(f), 0);
  // Greedy achievable-optimum within the same capacity budget, computed from the
  // same raw feature list, so "allow alternate priorities" is judged against a
  // genuine benchmark rather than one hardcoded "correct" set.
  const greedyOrder = [...validFeatures].sort((a, b) => recomputedRice(b) - recomputedRice(a));
  let remaining = capacity;
  let optimalRice = 0;
  for (const f of greedyOrder) {
    if (f.effort <= remaining) { optimalRice += recomputedRice(f); remaining -= f.effort; }
  }
  const qualityRatio = optimalRice > 0 ? selectedRice / optimalRice : 0;

  const primaryFits = activationGoal !== '' && primaryMetric === GOAL_PRIMARY_METRIC[activationGoal];
  const guardrailValid = guardrailMetric !== '' && guardrailMetric !== primaryMetric && !VANITY_METRICS.includes(guardrailMetric);

  const correctnessEarned =
    (zeroEffortRejected ? 15 : 0) +
    (withinCapacity ? 15 : 0) +
    (withinCapacity ? Math.round(30 * Math.min(1, qualityRatio)) : 0);

  const criteria: ScoringCriterionResult[] = [
    {
      id: 'prd-c1',
      name: 'Capacity Discipline, Zero-Effort Rejection & Prioritization Quality',
      category: 'correctness',
      earned: correctnessEarned,
      max: 60,
      passed: zeroEffortRejected && withinCapacity && qualityRatio >= 0.8,
      feedback: !zeroEffortRejected
        ? 'A zero-effort feature (invalid RICE input) was included in the sprint — reject it instead.'
        : !withinCapacity
          ? `Selected features (${totalEffort} pts) do not fit the ${capacity}-point capacity budget.`
          : qualityRatio >= 0.8
            ? `Selected backlog captures ${Math.round(qualityRatio * 100)}% of the achievable RICE value within capacity.`
            : `Selected backlog only captures ${Math.round(qualityRatio * 100)}% of the achievable RICE value — reconsider lower-RICE picks.`
    },
    {
      id: 'prd-c2',
      name: 'Deterministic RICE Calculation: (Reach × Impact × Confidence) / Effort',
      category: 'constraints',
      earned: riceMatches ? 25 : 10,
      max: 25,
      passed: riceMatches,
      feedback: riceMatches ? 'RICE scores match the deterministic formula for every feature.' : 'One or more reported RICE scores do not match reach × impact × confidence / effort.'
    },
    {
      id: 'prd-c3',
      name: 'Structured PRD & Experiment Metric Selection',
      category: 'evidence',
      earned: (prdProblem.length >= 30 ? 5 : 0) + (primaryFits ? 6 : 0) + (guardrailValid ? 4 : 0),
      max: 15,
      passed: prdProblem.length >= 30 && primaryFits && guardrailValid,
      feedback: primaryFits
        ? (guardrailValid ? 'PRD documented with a goal-aligned primary metric and a valid guardrail metric.' : 'Guardrail metric should differ from the primary metric and avoid vanity metrics.')
        : 'Primary metric does not match the selected activation goal.'
    }
  ];

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);
  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'product-prioritization-lab',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: [
      ...(zeroEffortRejected ? [] : ['Exclude the feature with a 0-point effort estimate — RICE cannot be computed for it.']),
      ...(withinCapacity ? [] : ['Deselect lower-RICE items until total effort fits the sprint capacity.']),
      ...(primaryFits ? [] : ['Pick the primary metric that matches your chosen activation goal.']),
    ],
    submittedAt: new Date().toISOString()
  };
}
