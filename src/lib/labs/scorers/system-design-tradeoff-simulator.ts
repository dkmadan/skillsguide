import { ScoringCriterionResult, LabSubmissionResult } from '../types';

// =========================================================================
// LAB 11: System Design Tradeoff Simulator
// =========================================================================
interface SimRowLike {
  arrivalRps?: unknown;
  backlog?: unknown;
  dropped?: unknown;
}

export function evaluateSystemDesignLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const simRows = Array.isArray(answers.simRows) ? (answers.simRows as SimRowLike[]) : [];
  const zeroRow = simRows[0];
  const lastRow = simRows[simRows.length - 1];

  const zeroTrafficOk = Boolean(
    zeroRow && Number(zeroRow.arrivalRps) === 0 && Number(zeroRow.backlog) === 0 && Number(zeroRow.dropped) === 0
  );
  const noDropAtFurthestStep = Boolean(lastRow && Number(lastRow.dropped) === 0);

  const dependencyRemovalTested = Boolean(answers.dependencyRemovalTested);
  const failureInjectionTested = Boolean(answers.failureInjectionTested);
  const leversExplored = [dependencyRemovalTested, failureInjectionTested].filter(Boolean).length;

  const tradeoffRecord = String(answers.tradeoffRecord || '').trim();
  const savedScenario = answers.savedScenario;
  const hasMemo = tradeoffRecord.length >= 20;
  const hasComparison = savedScenario !== null && savedScenario !== undefined;

  // Equivalent graphs receive equivalent structural credit: any topology that
  // clears the peak load step with zero drops and confirms the zero-traffic
  // baseline scores full correctness, regardless of which levers were used.
  const correctnessEarned = noDropAtFurthestStep && zeroTrafficOk ? 60 : noDropAtFurthestStep || zeroTrafficOk ? 35 : 15;
  const constraintsEarned = leversExplored === 2 ? 25 : leversExplored === 1 ? 15 : 5;
  const evidenceEarned = hasMemo && hasComparison ? 15 : hasMemo || hasComparison ? 8 : 0;

  const criteria: ScoringCriterionResult[] = [
    {
      id: 'sd-c1',
      name: 'Zero-Drop Capacity Plan (Structural Credit for Any Valid Topology)',
      category: 'correctness',
      earned: correctnessEarned,
      max: 60,
      passed: noDropAtFurthestStep && zeroTrafficOk,
      feedback:
        noDropAtFurthestStep && zeroTrafficOk
          ? 'Confirmed zero traffic yields zero utilization/backlog, and the furthest load step reached has zero dropped requests.'
          : 'Simulation still drops requests at the furthest load step, or the zero-traffic baseline was not confirmed clean. This is a scenario assumption check, not a real load test result.',
    },
    {
      id: 'sd-c2',
      name: 'Explored Failure Injection and Dependency Removal Levers',
      category: 'constraints',
      earned: constraintsEarned,
      max: 25,
      passed: leversExplored === 2,
      feedback:
        leversExplored === 2
          ? 'Tested both removing the legacy dependency and injecting a chaos failure to observe their structural effect on capacity.'
          : `Explored ${leversExplored}/2 required resilience levers (dependency removal, failure injection).`,
    },
    {
      id: 'sd-c3',
      name: 'Tradeoff Record & Scenario Comparison',
      category: 'evidence',
      earned: evidenceEarned,
      max: 15,
      passed: hasMemo && hasComparison,
      feedback:
        hasMemo && hasComparison
          ? 'Saved a comparison scenario and documented the bottleneck/redundancy tradeoff reasoning.'
          : 'Save a scenario for comparison and write a tradeoff record of at least 20 characters.',
    },
  ];

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);
  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'system-design-tradeoff-simulator',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints:
      serverScore >= 75
        ? []
        : ['Check the utilization bars at your furthest load step — add capacity, remove the legacy dependency, or enable the queue until dropped requests reach zero.'],
    submittedAt: new Date().toISOString(),
  };
}
