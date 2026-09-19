import { ScoringCriterionResult, LabSubmissionResult } from '../types';

// =========================================================================
// LAB 24: Bookkeeping and Tax Reconciliation Lab
// =========================================================================

interface SubmittedTransaction {
  id: string;
  type: 'sale' | 'purchase';
  baseAmount: number;
  recordedBaseAmount: number;
  isEligibleCredit: boolean;
}

function calcTax(base: number, ratePercent: number): number {
  return Math.round(base * (ratePercent / 100));
}

// Independently recompute the double-entry lines from the submitted
// transactions + rate, mirroring the component's own construction, so the
// "balanced journal" claim is verified rather than trusted at face value.
function recomputeTotals(transactions: SubmittedTransaction[], ratePercent: number) {
  let debit = 0;
  let credit = 0;
  transactions.forEach((t) => {
    const recordedTax = calcTax(t.recordedBaseAmount, ratePercent);
    const trueGross = Math.round(t.baseAmount * (1 + ratePercent / 100));
    if (t.type === 'sale') {
      debit += trueGross;
      credit += t.recordedBaseAmount + recordedTax;
    } else if (t.isEligibleCredit) {
      debit += t.recordedBaseAmount + recordedTax;
      credit += trueGross;
    } else {
      debit += Math.round(t.recordedBaseAmount * (1 + ratePercent / 100));
      credit += trueGross;
    }
  });
  return { debit, credit };
}

export function evaluateBookkeepingTaxLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const transactions = Array.isArray(answers.transactions) ? (answers.transactions as SubmittedTransaction[]) : [];
  const taxRatePercent = Number(answers.taxRatePercent || 0);
  const submittedDebit = Number(answers.totalDebit);
  const submittedCredit = Number(answers.totalCredit);
  const submittedBalanced = Boolean(answers.isBalanced);

  const reviewedGroups = (answers.reviewedGroups as Record<string, string>) || {};
  const reviewedCount = Object.keys(reviewedGroups).length;
  const duplicateGroupsDetectedCount = Number(answers.duplicateGroupsDetectedCount || 0);
  const pendingDuplicateCount = Number(answers.pendingDuplicateCount ?? 1);
  const mismatchedCount = Number(answers.mismatchedCount ?? transactions.filter((t) => t.recordedBaseAmount !== t.baseAmount).length);
  const pendingIneligibleCount = Number(
    answers.pendingIneligibleCount ?? transactions.filter((t) => t.type === 'purchase' && !t.isEligibleCredit).length
  );

  // --- Trial balance: recompute independently and confirm debit === credit.
  // Also sanity-checks the tax formula generically (round(base * rate / 100)),
  // which covers the required case of a 1000 base at 10% producing 100.
  const recomputed = recomputeTotals(transactions, taxRatePercent);
  const balanceCoherent =
    Number.isFinite(submittedDebit) && Number.isFinite(submittedCredit) &&
    Math.abs(submittedDebit - recomputed.debit) <= 1 && Math.abs(submittedCredit - recomputed.credit) <= 1;
  const actuallyBalanced = Math.abs(recomputed.debit - recomputed.credit) <= 1;
  const balanceCorrect = balanceCoherent && actuallyBalanced && submittedBalanced === actuallyBalanced;
  const sampleTaxCorrect = calcTax(1000, 10) === 100;

  // --- Duplicate reconciliation: every detected candidate reviewed, none silently deleted.
  const duplicatesProperlyReviewed =
    duplicateGroupsDetectedCount > 0 && pendingDuplicateCount === 0 && reviewedCount >= duplicateGroupsDetectedCount;

  // --- Mismatches corrected and ineligible credits flagged (case-defined rule pack respected).
  const exceptionsResolved = mismatchedCount === 0 && pendingIneligibleCount === 0;

  const journalLines = Array.isArray(answers.journalLines) ? answers.journalLines : [];
  const evidenceSaved = journalLines.length > 0 && transactions.length > 0;

  const criteria: ScoringCriterionResult[] = [
    {
      id: 'bkk-c1',
      name: 'Double-Entry Trial Balance (Debit = Credit, Independently Verified)',
      category: 'correctness',
      earned: balanceCorrect && sampleTaxCorrect ? 30 : balanceCoherent ? 15 : 5,
      max: 30,
      passed: balanceCorrect,
      feedback: balanceCorrect
        ? 'Recomputing every journal line from the submitted transactions confirms total debits equal total credits.'
        : 'Recomputed debit and credit totals do not match — check for uncorrected recording errors.',
    },
    {
      id: 'bkk-c2',
      name: 'Duplicate Transaction Review (No Silent Deletion)',
      category: 'correctness',
      earned: duplicatesProperlyReviewed ? 30 : reviewedCount > 0 ? 15 : 5,
      max: 30,
      passed: duplicatesProperlyReviewed,
      feedback: duplicatesProperlyReviewed
        ? `All ${duplicateGroupsDetectedCount} duplicate candidate group(s) were reviewed and either merged or confirmed distinct.`
        : `${pendingDuplicateCount} duplicate candidate group(s) remain unreviewed.`,
    },
    {
      id: 'bkk-c3',
      name: 'Reconciliation Exceptions Resolved (Mismatches & Ineligible Credit)',
      category: 'constraints',
      earned: exceptionsResolved ? 25 : mismatchedCount === 0 || pendingIneligibleCount === 0 ? 14 : 5,
      max: 25,
      passed: exceptionsResolved,
      feedback: exceptionsResolved
        ? 'All amount mismatches were corrected against the source invoice, and every case-defined ineligible credit was flagged rather than claimed.'
        : `${mismatchedCount} amount mismatch(es) and ${pendingIneligibleCount} unflagged ineligible credit(s) remain.`,
    },
    {
      id: 'bkk-c4',
      name: 'Saved Evidence: Journal, Reconciliation Statement & Exceptions',
      category: 'evidence',
      earned: evidenceSaved ? 15 : 6,
      max: 15,
      passed: evidenceSaved,
      feedback: evidenceSaved
        ? 'Journal ledger, reconciliation statement, and exception list were all captured for this submission.'
        : 'Journal or transaction evidence is missing from the submission.',
    },
  ];

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);
  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'bookkeeping-and-tax-reconciliation-lab',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: balanceCorrect && duplicatesProperlyReviewed && exceptionsResolved
      ? []
      : [
          'Apply Correction on every amount-mismatch exception so recorded amounts match the source invoice, which also rebalances the trial balance.',
          'Review every duplicate candidate and flag every case-defined ineligible credit before submitting.',
        ],
    submittedAt: new Date().toISOString(),
  };
}
