'use client';

import { useMemo } from 'react';
import { LabScenarioVariant, LabDifficulty } from '@/lib/labs/types';
import { useUndoableState } from '@/lib/labs/useUndoableState';
import { downloadCsv, downloadJson } from '@/lib/labs/exportHelper';
import ChartFrame from '@/components/labs/charts/ChartFrame';
import CompareBarChart from '@/components/labs/charts/CompareBarChart';
import BreakdownDoughnutChart from '@/components/labs/charts/BreakdownDoughnutChart';
import {
  Undo2,
  Redo2,
  RotateCcw,
  Send,
  Download,
  FileJson,
  GitMerge,
  Ban,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Scale,
  BarChart3,
  PieChart,
} from 'lucide-react';

interface SimulatorProps {
  scenario?: LabScenarioVariant;
  variant: LabDifficulty;
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

interface Transaction {
  id: string;
  type: 'sale' | 'purchase';
  party: string;
  description: string;
  baseAmount: number; // the TRUE base amount per the source invoice
  recordedBaseAmount: number; // what was actually posted (may contain a bookkeeping error)
  isEligibleCredit: boolean; // purchases only — case-defined fact, not user-editable
}

// Three genuinely different case files — same rule pack shape, increasing
// ambiguity: more duplicate patterns (case-insensitive party names, a
// look-alike vendor purchase that is NOT a duplicate), more recording errors,
// and more than one ineligible-credit purchase to catch.
const RULE_VERSIONS: Record<LabDifficulty, { ruleVersion: string; taxRatePercent: number }> = {
  beginner: { ruleVersion: 'EDU-GST-v1', taxRatePercent: 10 },
  intermediate: { ruleVersion: 'EDU-GST-v2', taxRatePercent: 12 },
  challenge: { ruleVersion: 'EDU-GST-v3', taxRatePercent: 15 },
};

const TRANSACTION_POOLS: Record<LabDifficulty, Transaction[]> = {
  beginner: [
    { id: 'txn-1', type: 'sale', party: 'Nimbus Retail Pvt Ltd', description: 'Consulting services invoice', baseAmount: 1000, recordedBaseAmount: 1000, isEligibleCredit: true },
    { id: 'txn-2', type: 'sale', party: 'Bright Interiors', description: 'Design services invoice', baseAmount: 2000, recordedBaseAmount: 1800, isEligibleCredit: true }, // recording error: under-posted revenue
    { id: 'txn-3', type: 'purchase', party: 'Apex Office Supplies', description: 'Office stationery', baseAmount: 500, recordedBaseAmount: 500, isEligibleCredit: true },
    { id: 'txn-4', type: 'purchase', party: 'Apex Office Supplies', description: 'Office stationery', baseAmount: 500, recordedBaseAmount: 500, isEligibleCredit: true }, // exact duplicate of txn-3
    { id: 'txn-5', type: 'purchase', party: 'Executive Retreat Resort', description: 'Team offsite — recreational', baseAmount: 800, recordedBaseAmount: 800, isEligibleCredit: false }, // ineligible credit
    { id: 'txn-6', type: 'purchase', party: 'Cloud Hosting Co', description: 'Server hosting', baseAmount: 1200, recordedBaseAmount: 1200, isEligibleCredit: true },
  ],
  intermediate: [
    { id: 'txn-1', type: 'sale', party: 'Nimbus Retail Pvt Ltd', description: 'Consulting services invoice', baseAmount: 1100, recordedBaseAmount: 1100, isEligibleCredit: true },
    { id: 'txn-2', type: 'sale', party: 'Bright Interiors', description: 'Design services invoice', baseAmount: 2100, recordedBaseAmount: 1900, isEligibleCredit: true }, // recording error
    { id: 'txn-3', type: 'sale', party: 'Solstice Traders', description: 'Training workshop invoice', baseAmount: 900, recordedBaseAmount: 900, isEligibleCredit: true },
    { id: 'txn-4', type: 'purchase', party: 'Apex Office Supplies', description: 'Office stationery', baseAmount: 520, recordedBaseAmount: 520, isEligibleCredit: true },
    { id: 'txn-5', type: 'purchase', party: 'Apex Office Supplies', description: 'Office stationery', baseAmount: 520, recordedBaseAmount: 520, isEligibleCredit: true }, // exact duplicate of txn-4
    { id: 'txn-6', type: 'purchase', party: 'Executive Retreat Resort', description: 'Team offsite — recreational', baseAmount: 850, recordedBaseAmount: 850, isEligibleCredit: false }, // ineligible #1
    { id: 'txn-7', type: 'purchase', party: 'Skyline Printing House', description: 'Personal event banners', baseAmount: 600, recordedBaseAmount: 600, isEligibleCredit: false }, // ineligible #2
    { id: 'txn-8', type: 'purchase', party: 'Cloud Hosting Co', description: 'Server hosting', baseAmount: 1300, recordedBaseAmount: 1300, isEligibleCredit: true },
  ],
  challenge: [
    { id: 'txn-1', type: 'sale', party: 'Nimbus Retail Pvt Ltd', description: 'Consulting services invoice', baseAmount: 1200, recordedBaseAmount: 1200, isEligibleCredit: true },
    { id: 'txn-2', type: 'sale', party: 'Bright Interiors', description: 'Design services invoice', baseAmount: 2200, recordedBaseAmount: 1950, isEligibleCredit: true }, // recording error (under-posted)
    { id: 'txn-3', type: 'sale', party: 'Solstice Traders', description: 'Training workshop invoice', baseAmount: 950, recordedBaseAmount: 1050, isEligibleCredit: true }, // recording error (over-posted)
    { id: 'txn-4', type: 'sale', party: 'Marigold Events', description: 'Event staffing invoice', baseAmount: 700, recordedBaseAmount: 700, isEligibleCredit: true },
    { id: 'txn-5', type: 'purchase', party: 'Apex Office Supplies', description: 'Office stationery', baseAmount: 540, recordedBaseAmount: 540, isEligibleCredit: true },
    { id: 'txn-6', type: 'purchase', party: 'apex office supplies', description: 'Office stationery', baseAmount: 540, recordedBaseAmount: 540, isEligibleCredit: true }, // duplicate — case/whitespace-insensitive match
    { id: 'txn-7', type: 'purchase', party: 'Apex Office Supplies', description: 'Printer toner', baseAmount: 300, recordedBaseAmount: 300, isEligibleCredit: true }, // same vendor, different amount/desc — NOT a duplicate
    { id: 'txn-8', type: 'purchase', party: 'Executive Retreat Resort', description: 'Team offsite — recreational', baseAmount: 900, recordedBaseAmount: 900, isEligibleCredit: false }, // ineligible #1
    { id: 'txn-9', type: 'purchase', party: 'Velvet Lounge Hospitality', description: 'Client entertainment — personal', baseAmount: 650, recordedBaseAmount: 650, isEligibleCredit: false }, // ineligible #2
    { id: 'txn-10', type: 'purchase', party: 'Cloud Hosting Co', description: 'Server hosting', baseAmount: 1400, recordedBaseAmount: 1400, isEligibleCredit: true },
  ],
};

function calcTax(base: number, ratePercent: number): number {
  return Math.round(base * (ratePercent / 100));
}

interface JournalLine {
  txnId: string;
  account: string;
  debit: number;
  credit: number;
}

// Explicit, developer-owned double-entry construction — never AI-estimated.
function buildLines(t: Transaction, ratePercent: number): JournalLine[] {
  const recordedTax = calcTax(t.recordedBaseAmount, ratePercent);
  const trueGross = Math.round(t.baseAmount * (1 + ratePercent / 100)); // matches the source invoice / cash movement
  if (t.type === 'sale') {
    return [
      { txnId: t.id, account: 'Cash / Accounts Receivable', debit: trueGross, credit: 0 },
      { txnId: t.id, account: 'Sales Revenue', debit: 0, credit: t.recordedBaseAmount },
      { txnId: t.id, account: 'Output Tax Payable', debit: 0, credit: recordedTax },
    ];
  }
  if (t.isEligibleCredit) {
    return [
      { txnId: t.id, account: 'Expense / Asset', debit: t.recordedBaseAmount, credit: 0 },
      { txnId: t.id, account: 'Input Tax Credit Receivable', debit: recordedTax, credit: 0 },
      { txnId: t.id, account: 'Cash / Accounts Payable', debit: 0, credit: trueGross },
    ];
  }
  return [
    { txnId: t.id, account: 'Expense (Tax Not Recoverable)', debit: Math.round(t.recordedBaseAmount * (1 + ratePercent / 100)), credit: 0 },
    { txnId: t.id, account: 'Cash / Accounts Payable', debit: 0, credit: trueGross },
  ];
}

function normalizeKey(s: string): string {
  return s.trim().toLowerCase();
}

function dupKey(t: Transaction): string {
  return `${t.type}|${normalizeKey(t.party)}|${normalizeKey(t.description)}|${t.baseAmount}`;
}

function groupKey(group: Transaction[]): string {
  return group.map((t) => t.id).sort().join('|');
}

function findDuplicateGroups(transactions: Transaction[]): Transaction[][] {
  const byKey = new Map<string, Transaction[]>();
  transactions.forEach((t) => {
    const k = dupKey(t);
    if (!byKey.has(k)) byKey.set(k, []);
    byKey.get(k)!.push(t);
  });
  return [...byKey.values()].filter((g) => g.length > 1);
}

interface WorkspaceState {
  transactions: Transaction[];
  reviewedGroups: Record<string, 'merged' | 'not_duplicate'>;
  ineligibleAcknowledged: Record<string, boolean>;
}

export default function BookkeepingTaxReconciliationLab({ variant, onDirty, onSubmit }: SimulatorProps) {
  const rawTransactions = TRANSACTION_POOLS[variant];
  const { ruleVersion, taxRatePercent } = RULE_VERSIONS[variant];

  const initialState: WorkspaceState = useMemo(
    () => ({ transactions: rawTransactions, reviewedGroups: {}, ineligibleAcknowledged: {} }),
    [rawTransactions]
  );

  const { state, set, undo, redo, reset, canUndo, canRedo, stepIndex } = useUndoableState<WorkspaceState>(initialState);

  const detectedGroups = useMemo(() => findDuplicateGroups(rawTransactions), [rawTransactions]);
  const liveGroups = useMemo(() => findDuplicateGroups(state.transactions), [state.transactions]);
  const pendingGroups = useMemo(
    () => liveGroups.filter((g) => state.reviewedGroups[groupKey(g)] !== 'not_duplicate'),
    [liveGroups, state.reviewedGroups]
  );

  const mismatchedTransactions = useMemo(
    () => state.transactions.filter((t) => t.recordedBaseAmount !== t.baseAmount),
    [state.transactions]
  );
  const ineligibleTransactions = useMemo(() => state.transactions.filter((t) => t.type === 'purchase' && !t.isEligibleCredit), [state.transactions]);
  const pendingIneligible = useMemo(
    () => ineligibleTransactions.filter((t) => !state.ineligibleAcknowledged[t.id]),
    [ineligibleTransactions, state.ineligibleAcknowledged]
  );

  const journalLines = useMemo(
    () => state.transactions.flatMap((t) => buildLines(t, taxRatePercent)),
    [state.transactions, taxRatePercent]
  );
  const totalDebit = journalLines.reduce((s, l) => s + l.debit, 0);
  const totalCredit = journalLines.reduce((s, l) => s + l.credit, 0);
  const isBalanced = totalDebit === totalCredit;

  const accountTotals = useMemo(() => {
    const map = new Map<string, { debit: number; credit: number }>();
    journalLines.forEach((l) => {
      const cur = map.get(l.account) || { debit: 0, credit: 0 };
      map.set(l.account, { debit: cur.debit + l.debit, credit: cur.credit + l.credit });
    });
    return [...map.entries()].map(([account, v]) => ({ account, ...v }));
  }, [journalLines]);

  const taxCategoryShare = useMemo(() => {
    const outputTax = journalLines.filter((l) => l.account === 'Output Tax Payable').reduce((s, l) => s + l.credit, 0);
    const inputCredit = journalLines.filter((l) => l.account === 'Input Tax Credit Receivable').reduce((s, l) => s + l.debit, 0);
    const blockedTax = state.transactions
      .filter((t) => t.type === 'purchase' && !t.isEligibleCredit)
      .reduce((s, t) => s + calcTax(t.recordedBaseAmount, taxRatePercent), 0);
    return { outputTax, inputCredit, blockedTax };
  }, [journalLines, state.transactions, taxRatePercent]);

  const applyCorrection = (id: string) => {
    set((prev) => ({ ...prev, transactions: prev.transactions.map((t) => (t.id === id ? { ...t, recordedBaseAmount: t.baseAmount } : t)) }));
    onDirty();
  };

  const mergeGroup = (group: Transaction[], keepId: string) => {
    const key = groupKey(group);
    set((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((t) => !group.some((g) => g.id === t.id) || t.id === keepId),
      reviewedGroups: { ...prev.reviewedGroups, [key]: 'merged' },
    }));
    onDirty();
  };

  const markNotDuplicate = (group: Transaction[]) => {
    const key = groupKey(group);
    set((prev) => ({ ...prev, reviewedGroups: { ...prev.reviewedGroups, [key]: 'not_duplicate' } }));
    onDirty();
  };

  const acknowledgeIneligible = (id: string) => {
    set((prev) => ({ ...prev, ineligibleAcknowledged: { ...prev.ineligibleAcknowledged, [id]: true } }));
    onDirty();
  };

  const exceptionCount = pendingGroups.length + mismatchedTransactions.length + pendingIneligible.length;

  const handleExportCsv = () => {
    downloadCsv('bookkeeping_journal.csv', journalLines.map((l) => ({
      transaction_id: l.txnId, account: l.account, debit: l.debit, credit: l.credit,
    })));
  };

  const handleExportJson = () => {
    downloadJson('bookkeeping_reconciliation_and_exceptions.json', {
      variant,
      ruleVersion,
      taxRatePercent,
      reconciliationStatement: state.transactions.map((t) => ({
        id: t.id, party: t.party, type: t.type, recordedBaseAmount: t.recordedBaseAmount, sourceBaseAmount: t.baseAmount,
        matches: t.recordedBaseAmount === t.baseAmount, isEligibleCredit: t.isEligibleCredit,
      })),
      exceptions: {
        pendingDuplicateGroups: pendingGroups.map((g) => g.map((t) => t.id)),
        mismatched: mismatchedTransactions.map((t) => t.id),
        pendingIneligible: pendingIneligible.map((t) => t.id),
      },
      totalDebit, totalCredit, isBalanced,
    });
  };

  const handleSubmit = () => {
    onSubmit({
      transactions: state.transactions,
      journalLines,
      totalDebit,
      totalCredit,
      isBalanced,
      ruleVersion,
      taxRatePercent,
      reviewedGroups: state.reviewedGroups,
      duplicateGroupsDetectedCount: detectedGroups.length,
      pendingDuplicateCount: pendingGroups.length,
      mismatchedCount: mismatchedTransactions.length,
      ineligibleAcknowledged: state.ineligibleAcknowledged,
      pendingIneligibleCount: pendingIneligible.length,
      exceptionCount,
      stepIndex,
    });
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Total Debits</span>
          <span className="text-xl font-black text-white">${totalDebit.toLocaleString()}</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Total Credits</span>
          <span className="text-xl font-black text-white">${totalCredit.toLocaleString()}</span>
        </div>
        <div className={`p-4 rounded-2xl border ${isBalanced ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-red-950/20 border-red-500/30'}`}>
          <span className="text-xs text-slate-400 font-semibold block mb-1">Trial Balance</span>
          <span className={`text-xl font-black flex items-center gap-1 ${isBalanced ? 'text-emerald-300' : 'text-red-300'}`}>
            {isBalanced ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            {isBalanced ? 'Balanced' : `Off by $${Math.abs(totalDebit - totalCredit)}`}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Open Exceptions</span>
          <span className={`text-xl font-black ${exceptionCount > 0 ? 'text-amber-300' : 'text-emerald-400'}`}>{exceptionCount}</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">{ruleVersion} · {taxRatePercent}% hypothetical rate</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>1. Exception Queue ({exceptionCount})</span>
              </h2>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={undo} disabled={!canUndo} title="Undo last action"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30 transition-colors">
                  <Undo2 className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={redo} disabled={!canRedo} title="Redo"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30 transition-colors">
                  <Redo2 className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => { reset(); onDirty(); }} title="Reset ledger"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors">
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {exceptionCount === 0 ? (
              <p className="text-xs text-emerald-300 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> All exceptions resolved. History step {stepIndex}.</p>
            ) : (
              <div className="space-y-2.5">
                {pendingGroups.map((group) => (
                  <div key={groupKey(group)} className="p-3 rounded-2xl bg-amber-950/10 border border-amber-500/30 space-y-2">
                    <p className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5"><GitMerge className="w-3.5 h-3.5" /> Duplicate candidate — same party, amount &amp; description</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {group.map((t) => (
                        <div key={t.id} className="p-2 rounded-xl bg-black/30 border border-white/10 text-[11px]">
                          <p className="font-mono text-cyan-300">{t.id}</p>
                          <p className="text-white font-semibold">{t.party}</p>
                          <p className="text-slate-400">${t.baseAmount} · {t.description}</p>
                          <button type="button" onClick={() => mergeGroup(group, t.id)}
                            className="mt-1 w-full text-[10px] font-bold py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-200 transition-colors">
                            Keep this record, merge others
                          </button>
                        </div>
                      ))}
                    </div>
                    <button type="button" onClick={() => markNotDuplicate(group)}
                      className="w-full flex items-center justify-center gap-1.5 text-[10px] font-bold py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-colors">
                      <Ban className="w-3 h-3" /> Not a duplicate — distinct transactions
                    </button>
                  </div>
                ))}

                {mismatchedTransactions.map((t) => (
                  <div key={t.id} className="p-3 rounded-2xl bg-red-950/10 border border-red-500/30 flex items-center justify-between gap-2 text-[11px]">
                    <div>
                      <p className="font-bold text-red-300">Amount mismatch — {t.id} ({t.party})</p>
                      <p className="text-slate-400">Recorded ${t.recordedBaseAmount} vs source invoice ${t.baseAmount}</p>
                    </div>
                    <button type="button" onClick={() => applyCorrection(t.id)}
                      className="shrink-0 text-[10px] font-bold px-2.5 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-200 transition-colors">
                      Apply Correction
                    </button>
                  </div>
                ))}

                {pendingIneligible.map((t) => (
                  <div key={t.id} className="p-3 rounded-2xl bg-amber-950/10 border border-amber-500/30 flex items-center justify-between gap-2 text-[11px]">
                    <div>
                      <p className="font-bold text-amber-300">Case-defined ineligible credit — {t.id} ({t.party})</p>
                      <p className="text-slate-400">{t.description} — rule pack blocks this input credit</p>
                    </div>
                    <button type="button" onClick={() => acknowledgeIneligible(t.id)}
                      className="shrink-0 text-[10px] font-bold px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 transition-colors">
                      Flag — Do Not Claim
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>2. Journal Ledger ({journalLines.length} lines)</span>
            </h3>
            <div className="overflow-x-auto max-h-72 overflow-y-auto rounded-xl border border-white/5">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 text-[11px] sticky top-0 bg-[#111425]">
                    <th className="p-2">Txn</th><th className="p-2">Account</th><th className="p-2 text-right">Debit</th><th className="p-2 text-right">Credit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {journalLines.map((l, i) => (
                    <tr key={`${l.txnId}-${i}`} className="hover:bg-white/5 transition-colors">
                      <td className="p-2 font-mono text-cyan-300">{l.txnId}</td>
                      <td className="p-2 text-slate-200">{l.account}</td>
                      <td className="p-2 text-right font-mono">{l.debit ? `$${l.debit.toLocaleString()}` : ''}</td>
                      <td className="p-2 text-right font-mono">{l.credit ? `$${l.credit.toLocaleString()}` : ''}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-white/10 font-bold text-slate-200">
                    <td className="p-2" colSpan={2}>Totals</td>
                    <td className="p-2 text-right font-mono">${totalDebit.toLocaleString()}</td>
                    <td className="p-2 text-right font-mono">${totalCredit.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">3. Rule Pack Reference ({ruleVersion})</h3>
            <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
              <li>Hypothetical tax rate: <span className="text-cyan-300 font-bold">{taxRatePercent}%</span> — tax = round(base × rate ÷ 100), e.g. a 1000 base at 10% yields exactly 100.</li>
              <li>Sales: debit Cash/AR for gross, credit Sales Revenue for base, credit Output Tax Payable for tax.</li>
              <li>Eligible purchases: debit Expense/Asset + Input Tax Credit Receivable, credit Cash/Payable for gross.</li>
              <li>Case-defined ineligible purchases (e.g. personal/recreational spend): the tax cost is absorbed into the expense and never claimed as a credit.</li>
              <li>Educational simulation only — no GST portal access, no filings, no claim of current legal compliance.</li>
            </ul>
          </div>
        </div>

        {/* Right */}
        <div className="lg:col-span-5 space-y-4">
          <ChartFrame
            title="Debit vs Credit by Account"
            icon={<BarChart3 className="w-4 h-4 text-cyan-400" />}
            tableHeaders={['Account', 'Debit', 'Credit']}
            tableRows={accountTotals.map((a) => [a.account, a.debit, a.credit])}
          >
            <CompareBarChart
              labels={accountTotals.map((a) => a.account)}
              series={[
                { label: 'Debit', data: accountTotals.map((a) => a.debit) },
                { label: 'Credit', data: accountTotals.map((a) => a.credit) },
              ]}
              horizontal
              yLabel="Amount ($)"
            />
          </ChartFrame>

          <ChartFrame
            title="Tax Category Share"
            icon={<PieChart className="w-4 h-4 text-cyan-400" />}
            tableHeaders={['Category', 'Amount']}
            tableRows={[
              ['Output Tax Payable', taxCategoryShare.outputTax],
              ['Input Tax Credit Receivable', taxCategoryShare.inputCredit],
              ['Blocked / Non-Recoverable Tax', taxCategoryShare.blockedTax],
            ]}
          >
            <BreakdownDoughnutChart
              labels={['Output Tax Payable', 'Input Tax Credit Receivable', 'Blocked / Non-Recoverable']}
              values={[taxCategoryShare.outputTax, taxCategoryShare.inputCredit, taxCategoryShare.blockedTax]}
              centerLabel="Total Tax Touched"
              centerValue={`$${(taxCategoryShare.outputTax + taxCategoryShare.inputCredit + taxCategoryShare.blockedTax).toLocaleString()}`}
            />
          </ChartFrame>

          <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#111425] border border-white/10 text-[11px] text-slate-400">
            <Scale className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>A journal is only trustworthy once it is both balanced <em>and</em> exception-free — balance alone cannot catch duplicates or ineligible credits.</span>
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={handleExportCsv}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] font-bold transition-colors">
              <Download className="w-3.5 h-3.5" /><span>CSV</span>
            </button>
            <button type="button" onClick={handleExportJson}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] font-bold transition-colors">
              <FileJson className="w-3.5 h-3.5" /><span>JSON</span>
            </button>
          </div>

          <button type="button" onClick={handleSubmit}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold transition-all flex items-center justify-center gap-2">
            <Send className="w-4 h-4" />
            <span>Submit Ledger</span>
          </button>
        </div>
      </div>
    </div>
  );
}
