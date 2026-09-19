import { ScoringCriterionResult, LabSubmissionResult } from '../types';

// =========================================================================
// LAB 02: Spreadsheet Formula & MIS Lab
// =========================================================================
export function evaluateSpreadsheetMisLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const selectedRateFormula = String(answers.selectedRateFormula || '');
  const selectedTotalFormula = String(answers.selectedTotalFormula || '');
  const selectedLookupKey = String(answers.selectedLookupKey || '');
  const statusLogic = String(answers.statusLogic || '');
  const canonicalRate = Number(answers.canonicalRate);
  const totalErrorsCount = Number(answers.totalErrorsCount) || 0;
  const errorsResolvedCount = Number(answers.errorsResolvedCount) || 0;
  const memo = String(answers.misMemo || '').trim();

  // Verification case named in the spec: a 100 target and 80 actual must
  // show an 80 percent achievement rate — only true when the correct
  // (Actual / Target) * 100 template is selected.
  const rateCorrect = selectedRateFormula === 'ACTUAL_DIV_TARGET' && canonicalRate === 80;
  const totalFormulaCorrect = selectedTotalFormula === 'SUM';
  const statusLogicCorrect = statusLogic === 'STANDARD';
  const lookupKeyCorrect = selectedLookupKey === 'SKU';

  const errorsRatio = totalErrorsCount > 0 ? errorsResolvedCount / totalErrorsCount : 1;
  const allErrorsResolved = errorsResolvedCount === totalErrorsCount;

  const c1Earned = rateCorrect ? 35 : Number.isFinite(canonicalRate) && Math.abs(canonicalRate - 80) <= 5 ? 15 : 0;
  const c2Earned = (totalFormulaCorrect ? 15 : 5) + (statusLogicCorrect ? 10 : 0);
  const c3Earned = Math.round(25 * errorsRatio);
  const memoOk = memo.length >= 20;
  const c4Earned = (memoOk ? 10 : 3) + (lookupKeyCorrect ? 5 : 0);

  const criteria: ScoringCriterionResult[] = [
    {
      id: 'mis-c1',
      name: 'Achievement Rate Calculation (Target 100, Actual 80 = 80%)',
      category: 'correctness',
      earned: c1Earned,
      max: 35,
      passed: rateCorrect,
      feedback: rateCorrect
        ? 'Achievement rate template correctly computes (Actual / Target) * 100, verified at 80% for the 100-target/80-actual row.'
        : `Achievement rate formula produced ${Number.isFinite(canonicalRate) ? canonicalRate : 'an invalid value'}% for the 100-target/80-actual row instead of 80% — select the (Actual / Target) * 100 template.`
    },
    {
      id: 'mis-c2',
      name: 'Aggregate Total & Status (IF) Templates',
      category: 'correctness',
      earned: c2Earned,
      max: 25,
      passed: totalFormulaCorrect && statusLogicCorrect,
      feedback: totalFormulaCorrect && statusLogicCorrect
        ? 'Grand total uses SUM(TotalValue) and the IF-based status column reads the correct polarity.'
        : `${!totalFormulaCorrect ? 'Total revenue should use SUM, not AVERAGE/COUNT. ' : ''}${!statusLogicCorrect ? 'Status IF() formula is evaluating the reversed condition.' : ''}`
    },
    {
      id: 'mis-c3',
      name: 'Data Hygiene: Blank Cells, Invalid Numbers, Missing Lookups, Divide-by-Zero & Circular Refs',
      category: 'constraints',
      earned: c3Earned,
      max: 25,
      passed: allErrorsResolved,
      feedback: allErrorsResolved
        ? 'Every data-hygiene defect present in this worksheet (blank cells, invalid numbers, missing lookup keys, divide-by-zero, circular references) was resolved.'
        : `Resolved ${errorsResolvedCount}/${totalErrorsCount} defect types present in this worksheet — check the Error Inspector panel for what remains.`
    },
    {
      id: 'mis-c4',
      name: 'Supported Formula Documentation & Exact-Match Lookup Key',
      category: 'evidence',
      earned: c4Earned,
      max: 15,
      passed: memoOk && lookupKeyCorrect,
      feedback: memoOk && lookupKeyCorrect
        ? 'Documented the supported formula subset and used the SKU exact-match key rather than a collision-prone name lookup.'
        : `${!memoOk ? 'Formula recipe memo is too brief. ' : ''}${!lookupKeyCorrect ? 'Prefer the SKU exact-match key over item name for lookups.' : ''}`
    }
  ];

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);
  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'spreadsheet-formula-and-mis-lab',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: serverScore >= 75 ? [] : ['Verify the achievement-rate formula against the 100-target/80-actual row, then resolve every flagged data-hygiene defect before resubmitting.'],
    submittedAt: new Date().toISOString()
  };
}
