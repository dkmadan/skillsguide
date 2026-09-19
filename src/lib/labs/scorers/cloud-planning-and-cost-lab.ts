import { ScoringCriterionResult, LabSubmissionResult } from '../types';

// =========================================================================
// LAB 12: Cloud Planning and Cost Lab
// =========================================================================
interface ResourceLike {
  count?: unknown;
  unitRatePerHour?: unknown;
  hoursPerMonth?: unknown;
  redundant?: unknown;
}

export function evaluateCloudPlanningLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const bill = (answers.billCalculations as Record<string, number>) || {};
  const idleWaste = Number(bill.idleWasteCost || 0);
  const publicRisks = Number(bill.publicExposureCount || 0);
  const missingBackups = Number(bill.missingBackupCount || 0);
  const redundancyGaps = Number(bill.redundancyGapCount || 0);
  const totalMonthlyCost = Number(bill.totalMonthlyCost || 0);

  const resources = Array.isArray(answers.resources) ? (answers.resources as ResourceLike[]) : [];
  const referenceCheck = Number(answers.referenceCheck || 0);

  // Re-derive the bill from the submitted resource fields server-side: guards
  // against the reported total not matching (qty x rate x hours [x2 if
  // redundant]) + fixed charges, and re-verifies the spec's worked example
  // (2 units @ $2/hr for 100 hrs = $400 before fixed charges) independently.
  const recomputedRaw = resources.reduce((sum, r) => {
    const count = Number(r.count || 0);
    const rate = Number(r.unitRatePerHour || 0);
    const hours = Number(r.hoursPerMonth || 0);
    const effectiveCount = r.redundant ? count * 2 : count;
    return sum + effectiveCount * rate * hours;
  }, 0);
  // The submitted total must equal the recomputed raw resource cost plus a
  // non-negative fixed monthly charge (fixture fixed fees run $150-$340) — a
  // generous but bounded band that still catches a fabricated or stale total.
  const impliedFixedFee = totalMonthlyCost - recomputedRaw;
  const totalWithinTolerance = Number.isFinite(totalMonthlyCost) && impliedFixedFee >= -0.01 && impliedFixedFee <= 500;
  const workedExampleOk = Math.abs(referenceCheck - 400) < 0.01;

  const allRisksResolved = idleWaste === 0 && publicRisks === 0 && missingBackups === 0;
  const risksPartiallyResolved = idleWaste === 0 || (publicRisks === 0 && missingBackups === 0);

  const planNotes = String(answers.planNotes || '').trim();
  const resilienceChecklist = Array.isArray(answers.resilienceChecklist) ? (answers.resilienceChecklist as { satisfied?: boolean }[]) : [];
  const hasChecklist = resilienceChecklist.length > 0;
  const monthlyProjection = answers.monthlyProjection as { currentSeries?: unknown[]; optimizedSeries?: unknown[] } | undefined;
  const hasProjection = Boolean(monthlyProjection && Array.isArray(monthlyProjection.currentSeries) && monthlyProjection.currentSeries.length === 6);

  const correctnessEarned = allRisksResolved ? 60 : risksPartiallyResolved ? 35 : 15;
  const constraintsEarned = workedExampleOk && totalWithinTolerance ? 25 : workedExampleOk || totalWithinTolerance ? 15 : 5;
  const evidenceEarned = planNotes.length >= 20 && hasProjection && hasChecklist ? 15 : (planNotes.length >= 20 ? 1 : 0) + (hasProjection ? 1 : 0) + (hasChecklist ? 1 : 0) >= 2 ? 10 : 0;

  const criteria: ScoringCriterionResult[] = [
    {
      id: 'cld-c1',
      name: 'Idle Waste, Public Exposure & Backup Risk Resolution',
      category: 'correctness',
      earned: correctnessEarned,
      max: 60,
      passed: allRisksResolved,
      feedback: allRisksResolved
        ? 'All unnecessary idle resources decommissioned, no unintended public exposure, and every active resource has backups enabled.'
        : `Unresolved risk: $${idleWaste} idle waste, ${publicRisks} public exposure flag(s), ${missingBackups} missing backup(s). Redundancy gaps remaining on ${redundancyGaps} critical resource(s).`,
    },
    {
      id: 'cld-c2',
      name: 'Billing Formula Integrity (qty x rate x hours + fixed charges)',
      category: 'constraints',
      earned: constraintsEarned,
      max: 25,
      passed: workedExampleOk && totalWithinTolerance,
      feedback: workedExampleOk && totalWithinTolerance
        ? 'Reported bill matches the recomputed formula, and the worked example (2 units x $2/hr x 100 hrs) correctly totals $400 before fixed charges.'
        : 'Reported bill total is inconsistent with quantity x rate x hours, or the worked-example check did not total $400.',
    },
    {
      id: 'cld-c3',
      name: 'Resilience Checklist & FinOps Plan Notes',
      category: 'evidence',
      earned: evidenceEarned,
      max: 15,
      passed: planNotes.length >= 20 && hasProjection && hasChecklist,
      feedback: planNotes.length >= 20 && hasProjection && hasChecklist
        ? 'FinOps plan notes, the resilience checklist, and a 6-month two-scenario budget projection were all captured as saved evidence.'
        : 'Add FinOps plan notes (20+ characters) and confirm the resilience checklist and 6-month budget comparison were generated.',
    },
  ];

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);
  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'cloud-planning-and-cost-lab',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: allRisksResolved ? [] : ['Decommission zero-utilization resources that are not marked as necessary standby, close unintended public access, and enable backups on every active resource.'],
    submittedAt: new Date().toISOString(),
  };
}
