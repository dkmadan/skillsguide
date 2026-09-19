import { ScoringCriterionResult, LabSubmissionResult } from '../types';

// =========================================================================
// LAB 30: Clean Energy Data Explorer
// =========================================================================
// Mirrors the battery-card answer keys authored in
// CleanEnergyDataExplorerLab.tsx — kept in sync manually since each lab
// embeds its own fixtures client-side.
const BATTERY_ANSWER_KEYS: Record<string, Record<string, string>> = {
  beginner: { bc1: 'charging', bc2: 'discharging', bc3: 'idle' },
  intermediate: { ic1: 'charging', ic2: 'charging', ic3: 'discharging', ic4: 'idle' },
  challenge: { cc1: 'charging', cc2: 'discharging', cc3: 'charging', cc4: 'idle', cc5: 'idle' },
};

interface PointLike {
  loadKw?: unknown;
  durationHours?: unknown;
  solarGenKw?: unknown;
  selfUseKwh?: unknown;
  stepLoadKwh?: unknown;
}

export function evaluateCleanEnergyLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const variant = String(answers.variant || 'beginner');
  const points = Array.isArray(answers.points) ? (answers.points as PointLike[]) : [];
  const totals = (answers.totals as Record<string, number>) || {};
  const submittedTotalLoad = Number(totals.totalLoadKwh || 0);
  const submittedSelfConsumed = Number(totals.totalSelfConsumedKwh || 0);
  const workedExampleKwh = Number(answers.workedExampleKwh || 0);

  // Independently recompute totals from the raw points using the same
  // formula (energy = power x each point's own duration, self-use = min of
  // load and generation energy) to verify correct handling of mismatched
  // time intervals, not just trust the client's reported totals.
  const recomputedLoad = points.reduce((s, p) => s + Number(p.loadKw || 0) * Number(p.durationHours || 0), 0);
  const recomputedSelfUse = points.reduce((s, p) => s + Number(p.selfUseKwh || 0), 0);

  const loadMatches = points.length > 0 && Math.abs(recomputedLoad - submittedTotalLoad) < 0.5;
  const selfUseMatches = points.length > 0 && Math.abs(recomputedSelfUse - submittedSelfConsumed) < 0.5;
  const workedExampleOk = Math.abs(workedExampleKwh - 6) < 0.001;

  const batteryAnswers = (answers.batteryCardAnswers as Record<string, string>) || {};
  const answerKey = BATTERY_ANSWER_KEYS[variant] ?? BATTERY_ANSWER_KEYS.beginner;
  const cardIds = Object.keys(answerKey);
  const correctCount = cardIds.filter((id) => batteryAnswers[id] === answerKey[id]).length;
  const batteryScorePct = cardIds.length > 0 ? correctCount / cardIds.length : 0;

  const assumptionsNotes = String(answers.assumptionsNotes || '').trim();

  const correctnessEarned = loadMatches && selfUseMatches && workedExampleOk ? 60 : (loadMatches && selfUseMatches) || workedExampleOk ? 35 : 15;
  const constraintsEarned = batteryScorePct === 1 ? 25 : batteryScorePct >= 0.5 ? 15 : 5;
  const evidenceEarned = assumptionsNotes.length >= 20 && points.length > 0 ? 15 : assumptionsNotes.length >= 20 || points.length > 0 ? 8 : 0;

  const criteria: ScoringCriterionResult[] = [
    {
      id: 'eng-c1',
      name: 'Energy Integration: kWh = Power (kW) x Time (hrs), Summed Per Interval',
      category: 'correctness',
      earned: correctnessEarned,
      max: 60,
      passed: loadMatches && selfUseMatches && workedExampleOk,
      feedback: loadMatches && selfUseMatches && workedExampleOk
        ? 'Cumulative load and self-consumed energy correctly integrate each interval\'s own duration, and the 2 kW x 3 h = 6 kWh worked example checks out.'
        : 'Recomputed totals from the raw interval data do not match what was submitted, or the worked-example check failed.',
    },
    {
      id: 'eng-c2',
      name: 'Battery Telemetry Chart Interpretation',
      category: 'constraints',
      earned: constraintsEarned,
      max: 25,
      passed: batteryScorePct === 1,
      feedback: batteryScorePct === 1
        ? 'Correctly interpreted every battery state-of-charge case card (charging vs. discharging vs. idle).'
        : `Interpreted ${correctCount}/${cardIds.length} battery telemetry cards correctly — compare the SoC trend direction against the load/generation gap.`,
    },
    {
      id: 'eng-c3',
      name: 'Energy Comparison Export & Assumptions Summary',
      category: 'evidence',
      earned: evidenceEarned,
      max: 15,
      passed: assumptionsNotes.length >= 20 && points.length > 0,
      feedback: assumptionsNotes.length >= 20 && points.length > 0
        ? 'Hourly energy comparison data and a written assumptions summary were captured as saved evidence.'
        : 'Write an assumptions summary of at least 20 characters and confirm the hourly telemetry was generated.',
    },
  ];

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);
  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'clean-energy-data-explorer',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: loadMatches && selfUseMatches ? [] : ['Recheck that energy at each interval is power x that interval\'s own duration, not a fixed 2-hour step.'],
    submittedAt: new Date().toISOString(),
  };
}
