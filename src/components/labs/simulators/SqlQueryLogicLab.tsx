'use client';

import React, { useMemo, useRef, useState } from 'react';
import { LabScenarioVariant, LabDifficulty } from '@/lib/labs/types';
import { useUndoableState } from '@/lib/labs/useUndoableState';
import { downloadCsv, downloadJson } from '@/lib/labs/exportHelper';
import ChartFrame from '@/components/labs/charts/ChartFrame';
import CompareBarChart from '@/components/labs/charts/CompareBarChart';
import SimClock from '@/components/labs/SimClock';
import {
  Database,
  Code2,
  Layers,
  Send,
  Sparkles,
  GitMerge,
  Undo2,
  Redo2,
  RotateCcw,
  Download,
  FileJson,
  CheckCircle2,
  Circle,
  ArrowRight,
  BarChart3,
  Table2,
} from 'lucide-react';

interface SimulatorProps {
  scenario?: LabScenarioVariant;
  variant: LabDifficulty;
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

interface Customer { customer_id: number; name: string; city: string; tier: 'Gold' | 'Silver' | 'Bronze'; }
interface Order { order_id: number; customer_id: number; amount: number | null; status: 'Delivered' | 'Cancelled'; }

// Three genuinely different relational fixtures with the SAME defect
// *types* present from beginner onward (duplicate customer key, cancelled
// order, null amount, unmatched customer) — higher tiers add more instances
// and trickier near-duplicates/orphan rows, matching the reference lab's
// "increasing ambiguity, not new categories" approach.
const CUSTOMERS: Record<LabDifficulty, Customer[]> = {
  beginner: [
    { customer_id: 1, name: 'Alice Sharma', city: 'Bengaluru', tier: 'Gold' },
    { customer_id: 1, name: 'Alice Sharma', city: 'Bengaluru', tier: 'Gold' }, // exact duplicate signup row
    { customer_id: 2, name: 'Bhavin Patel', city: 'Mumbai', tier: 'Silver' },
    { customer_id: 3, name: 'Chitra Nair', city: 'Hyderabad', tier: 'Gold' },
    { customer_id: 4, name: 'Devendra Rao', city: 'Pune', tier: 'Bronze' }, // unmatched: 0 orders
  ],
  intermediate: [
    { customer_id: 1, name: 'Alice Sharma', city: 'Bengaluru', tier: 'Gold' },
    { customer_id: 1, name: 'Alice Sharma', city: 'Bengaluru', tier: 'Gold' }, // exact duplicate
    { customer_id: 2, name: 'Bhavin Patel', city: 'Mumbai', tier: 'Silver' },
    { customer_id: 3, name: 'Chitra Nair', city: 'Hyderabad', tier: 'Gold' },
    { customer_id: 4, name: 'Devendra Rao', city: 'Pune', tier: 'Bronze' }, // unmatched
    { customer_id: 5, name: 'Alicia Sharma', city: 'Bengaluru', tier: 'Gold' }, // legitimately distinct — NOT a duplicate
    { customer_id: 6, name: 'Esha Kapoor', city: 'Chennai', tier: 'Silver' }, // second unmatched customer
  ],
  challenge: [
    { customer_id: 1, name: 'Alice Sharma', city: 'Bengaluru', tier: 'Gold' },
    { customer_id: 1, name: 'Alice Sharma', city: 'Bengaluru', tier: 'Gold' }, // exact duplicate
    { customer_id: 2, name: 'Bhavin Patel', city: 'Mumbai', tier: 'Silver' },
    { customer_id: 3, name: 'Chitra Nair', city: 'Hyderabad', tier: 'Gold' },
    { customer_id: 3, name: 'Chitra Nair', city: 'Hyderbad', tier: 'Gold' }, // near-duplicate: same key, typo'd city — trickier to spot
    { customer_id: 4, name: 'Devendra Rao', city: 'Pune', tier: 'Bronze' }, // unmatched
    { customer_id: 5, name: 'Alicia Sharma', city: 'Bengaluru', tier: 'Gold' }, // legitimately distinct
    { customer_id: 6, name: 'Esha Kapoor', city: 'Chennai', tier: 'Silver' }, // unmatched
    { customer_id: 7, name: 'Farah Iyer', city: 'bengaluru ', tier: 'Gold' }, // unmatched, inconsistent city casing/whitespace
  ],
};

const ORDERS: Record<LabDifficulty, Order[]> = {
  beginner: [
    { order_id: 101, customer_id: 1, amount: 4500, status: 'Delivered' },
    { order_id: 102, customer_id: 1, amount: 2200, status: 'Delivered' },
    { order_id: 103, customer_id: 2, amount: 8900, status: 'Delivered' },
    { order_id: 104, customer_id: 3, amount: 1500, status: 'Delivered' },
    { order_id: 105, customer_id: 3, amount: 3100, status: 'Cancelled' },
    { order_id: 106, customer_id: 2, amount: null, status: 'Delivered' }, // failed payment
  ],
  intermediate: [
    { order_id: 101, customer_id: 1, amount: 4500, status: 'Delivered' },
    { order_id: 102, customer_id: 1, amount: 2200, status: 'Delivered' },
    { order_id: 103, customer_id: 2, amount: 8900, status: 'Delivered' },
    { order_id: 104, customer_id: 3, amount: 1500, status: 'Delivered' },
    { order_id: 105, customer_id: 3, amount: 3100, status: 'Cancelled' },
    { order_id: 106, customer_id: 2, amount: null, status: 'Delivered' }, // null #1
    { order_id: 107, customer_id: 5, amount: 2600, status: 'Delivered' }, // Alicia's legitimate order
    { order_id: 108, customer_id: 3, amount: null, status: 'Delivered' }, // null #2
  ],
  challenge: [
    { order_id: 101, customer_id: 1, amount: 4500, status: 'Delivered' },
    { order_id: 102, customer_id: 1, amount: 2200, status: 'Delivered' },
    { order_id: 103, customer_id: 2, amount: 8900, status: 'Delivered' },
    { order_id: 104, customer_id: 3, amount: 1500, status: 'Delivered' },
    { order_id: 105, customer_id: 3, amount: 3100, status: 'Cancelled' },
    { order_id: 106, customer_id: 2, amount: null, status: 'Delivered' }, // null #1
    { order_id: 107, customer_id: 5, amount: 2600, status: 'Delivered' },
    { order_id: 108, customer_id: 3, amount: null, status: 'Delivered' }, // null #2
    { order_id: 109, customer_id: 9, amount: 3200, status: 'Delivered' }, // orphan: no matching customer at all
    { order_id: 110, customer_id: 1, amount: 1800, status: 'Delivered' },
  ],
};

type SelectMode = 'name_sum' | 'name_count';
type JoinType = 'LEFT_JOIN' | 'INNER_JOIN';
type WhereMode = 'none' | 'gold_only' | 'delivered_only';
type GroupByMode = 'customer_name' | 'none';
type OrderByMode = 'total_desc' | 'name_asc';

interface QueryState {
  selectedSelect: SelectMode;
  selectedJoinType: JoinType;
  selectedWhere: WhereMode;
  selectedGroupBy: GroupByMode;
  selectedOrderBy: OrderByMode;
  dedupeCustomers: boolean;
  guardNullAmounts: boolean;
}

const INITIAL_QUERY_STATE: QueryState = {
  selectedSelect: 'name_sum',
  selectedJoinType: 'INNER_JOIN',
  selectedWhere: 'none',
  selectedGroupBy: 'customer_name',
  selectedOrderBy: 'total_desc',
  dedupeCustomers: false,
  guardNullAmounts: false,
};

interface Question {
  id: string;
  title: string;
  prompt: string;
  predictionLabel: string;
  predictionAnswer: boolean;
  // Only the fields that matter for correctness — orderBy is deliberately
  // excluded so equivalent block arrangements (different sort) still count,
  // per the spec's "accept equivalent block arrangements" rule.
  requiredConfig: Partial<QueryState>;
}

const QUESTIONS: Question[] = [
  {
    id: 'q1', title: 'Q1 — Every Customer, Zero-Order Prospects Included',
    prompt: 'Show total spend per customer, including prospects who have never ordered.',
    predictionLabel: 'Will Devendra Rao (a zero-order prospect) appear in the result set?',
    predictionAnswer: true,
    requiredConfig: { selectedSelect: 'name_sum', selectedJoinType: 'LEFT_JOIN', selectedWhere: 'none', selectedGroupBy: 'customer_name' },
  },
  {
    id: 'q2', title: 'Q2 — Orders Placed, Actual Customers Only',
    prompt: 'Count how many orders each customer placed — only customers who actually ordered.',
    predictionLabel: 'Will Devendra Rao appear in the result set?',
    predictionAnswer: false,
    requiredConfig: { selectedSelect: 'name_count', selectedJoinType: 'INNER_JOIN', selectedWhere: 'none', selectedGroupBy: 'customer_name' },
  },
  {
    id: 'q3', title: 'Q3 — Gold Tier Only, Prospects Included',
    prompt: 'Show total spend for Gold-tier customers only, including Gold prospects with zero orders.',
    predictionLabel: 'Will Bhavin Patel (Silver tier) appear in this Gold-only result?',
    predictionAnswer: false,
    requiredConfig: { selectedSelect: 'name_sum', selectedJoinType: 'LEFT_JOIN', selectedWhere: 'gold_only', selectedGroupBy: 'customer_name' },
  },
  {
    id: 'q4', title: 'Q4 — Delivered Revenue Only',
    prompt: 'Show total spend per customer counting only Delivered orders — customers with no delivered orders should not appear.',
    predictionLabel: "Will Chitra Nair's cancelled order be counted in this Delivered-only total?",
    predictionAnswer: false,
    requiredConfig: { selectedSelect: 'name_sum', selectedJoinType: 'INNER_JOIN', selectedWhere: 'delivered_only', selectedGroupBy: 'customer_name' },
  },
  {
    id: 'q5', title: 'Q5 — Duplicate Signup Key',
    prompt: 'The customer table has a duplicated signup row for one customer. Fix the pipeline so totals are not double-counted.',
    predictionLabel: "After deduplication, is Alice Sharma's total still inflated by the duplicate signup row?",
    predictionAnswer: false,
    requiredConfig: { selectedSelect: 'name_sum', selectedJoinType: 'LEFT_JOIN', selectedWhere: 'none', selectedGroupBy: 'customer_name', dedupeCustomers: true },
  },
  {
    id: 'q6', title: 'Q6 — NULL Payment Amount',
    prompt: 'One Delivered order has a NULL payment amount (a failed charge). Fix totals so this does not corrupt the customer total.',
    predictionLabel: 'After guarding NULL amounts, does the failed-payment order corrupt (NaN) the customer total?',
    predictionAnswer: false,
    requiredConfig: { selectedSelect: 'name_sum', selectedJoinType: 'LEFT_JOIN', selectedWhere: 'none', selectedGroupBy: 'customer_name', guardNullAmounts: true },
  },
];

function questionConfigMatches(q: Question, s: QueryState): boolean {
  return (Object.keys(q.requiredConfig) as (keyof QueryState)[]).every((k) => s[k] === q.requiredConfig[k]);
}

function dedupeByCustomerId(customers: Customer[]): Customer[] {
  const seen = new Set<number>();
  return customers.filter((c) => {
    if (seen.has(c.customer_id)) return false;
    seen.add(c.customer_id);
    return true;
  });
}

interface JoinStep { customerName: string; orderId: number | null; amount: number | null; matched: boolean; note: string; }

export default function SqlQueryLogicLab({ variant, onDirty, onSubmit }: SimulatorProps) {
  const customers = CUSTOMERS[variant];
  const orders = ORDERS[variant];

  const { state, set, undo, redo, reset, canUndo, canRedo, stepIndex } = useUndoableState<QueryState>(INITIAL_QUERY_STATE);
  const [predictions, setPredictions] = useState<Record<string, boolean>>({});
  const [achieved, setAchieved] = useState<Set<string>>(new Set());
  const [explanation, setExplanation] = useState(
    'A LEFT JOIN keeps every row from the left (customers) table even when there is no matching order, filling amount with NULL/0 — this is why zero-order prospects still appear. An INNER JOIN only keeps rows with a match on both sides, so prospects and dangling foreign keys silently disappear.'
  );
  const [tableTab, setTableTab] = useState<'customers' | 'orders'>('customers');
  const [animStep, setAnimStep] = useState(0);
  const maxAnimSeenRef = useRef(0);

  const evaluateAchieved = (nextState: QueryState, nextPredictions: Record<string, boolean>) => {
    setAchieved((prev) => {
      const next = new Set(prev);
      QUESTIONS.forEach((q) => {
        if (questionConfigMatches(q, nextState) && nextPredictions[q.id] === q.predictionAnswer) next.add(q.id);
      });
      return next;
    });
  };

  const update = (patch: Partial<QueryState>) => {
    set((prev) => {
      const next = { ...prev, ...patch };
      evaluateAchieved(next, predictions);
      return next;
    });
    onDirty();
  };

  const setPrediction = (qId: string, val: boolean) => {
    setPredictions((prev) => {
      const next = { ...prev, [qId]: val };
      evaluateAchieved(state, next);
      return next;
    });
    onDirty();
  };

  const handleReset = () => {
    reset();
    setPredictions({});
    setAchieved(new Set());
    setAnimStep(0);
    maxAnimSeenRef.current = 0;
    onDirty();
  };

  // Compiled block config -> compact SQL-like text (display only, never executed).
  const generatedSql = useMemo(() => {
    let sql = 'SELECT ';
    sql += state.selectedSelect === 'name_sum' ? 'c.name, SUM(o.amount) AS total_spent\n' : 'c.name, COUNT(o.order_id) AS order_count\n';
    sql += 'FROM customers c\n';
    sql += `${state.selectedJoinType === 'LEFT_JOIN' ? 'LEFT JOIN' : 'INNER JOIN'} orders o ON c.customer_id = o.customer_id\n`;
    if (state.selectedWhere === 'gold_only') sql += "WHERE c.tier = 'Gold'\n";
    else if (state.selectedWhere === 'delivered_only') sql += "WHERE o.status = 'Delivered'\n";
    if (state.selectedGroupBy === 'customer_name') sql += 'GROUP BY c.name\n';
    sql += state.selectedOrderBy === 'total_desc' ? 'ORDER BY total_spent DESC;' : 'ORDER BY c.name ASC;';
    let header = '';
    if (state.dedupeCustomers) header += '-- fix: DISTINCT customer_id dimension row (duplicate signup collapsed)\n';
    if (state.guardNullAmounts) header += '-- fix: COALESCE(o.amount, 0) guards NULL payment amounts\n';
    return header + sql;
  }, [state]);

  // Deterministic array-operation compile of the block configuration — never
  // real SQL execution, bounded table sizes, one join, fixed operators only.
  const joinSteps: JoinStep[] = useMemo(() => {
    const effCustomers = state.dedupeCustomers ? dedupeByCustomerId(customers) : customers;
    const filteredCustomers = state.selectedWhere === 'gold_only' ? effCustomers.filter((c) => c.tier === 'Gold') : effCustomers;
    const steps: JoinStep[] = [];
    filteredCustomers.forEach((c) => {
      let matchingOrders = orders.filter((o) => o.customer_id === c.customer_id);
      if (state.selectedWhere === 'delivered_only') matchingOrders = matchingOrders.filter((o) => o.status === 'Delivered');
      if (matchingOrders.length > 0) {
        matchingOrders.forEach((o) => {
          const amount = o.amount === null ? (state.guardNullAmounts ? 0 : NaN) : o.amount;
          steps.push({ customerName: c.name, orderId: o.order_id, amount, matched: true, note: `Matched order #${o.order_id} on customer_id = ${c.customer_id}` });
        });
      } else if (state.selectedJoinType === 'LEFT_JOIN') {
        steps.push({ customerName: c.name, orderId: null, amount: 0, matched: false, note: 'No matching orders — LEFT JOIN retains this row with amount = 0' });
      } else {
        steps.push({ customerName: c.name, orderId: null, amount: 0, matched: false, note: 'No matching orders — INNER JOIN drops this row' });
      }
    });
    return steps;
  }, [customers, orders, state.dedupeCustomers, state.selectedWhere, state.selectedJoinType, state.guardNullAmounts]);

  // INNER JOIN drop rows never make it into the visible result rows.
  const joinedRows = useMemo(
    () => joinSteps.filter((s) => s.matched || state.selectedJoinType === 'LEFT_JOIN'),
    [joinSteps, state.selectedJoinType]
  );

  const queryResults = useMemo(() => {
    if (state.selectedGroupBy === 'customer_name') {
      const groups: Record<string, number> = {};
      joinedRows.forEach((r) => {
        const contribution = r.matched ? (Number.isNaN(r.amount) ? 0 : (r.amount ?? 0)) : 0;
        const metricValue = state.selectedSelect === 'name_count' ? (r.matched ? 1 : 0) : contribution;
        groups[r.customerName] = (groups[r.customerName] || 0) + metricValue;
      });
      const hasCorruption = joinedRows.some((r) => r.matched && Number.isNaN(r.amount));
      let res = Object.entries(groups).map(([name, value]) => ({ name, value }));
      res = state.selectedOrderBy === 'total_desc' ? res.sort((a, b) => b.value - a.value) : res.sort((a, b) => a.name.localeCompare(b.name));
      return { rows: res, hasCorruption };
    }
    return { rows: joinedRows.map((r) => ({ name: r.customerName, value: r.amount ?? 0 })), hasCorruption: false };
  }, [joinedRows, state.selectedGroupBy, state.selectedSelect, state.selectedOrderBy]);

  const duplicateCustomerKeyCount = useMemo(() => {
    const counts: Record<number, number> = {};
    customers.forEach((c) => { counts[c.customer_id] = (counts[c.customer_id] || 0) + 1; });
    return Object.values(counts).filter((n) => n > 1).length;
  }, [customers]);
  const nullAmountCount = useMemo(() => orders.filter((o) => o.amount === null).length, [orders]);

  const correctCount = achieved.size;

  const handleAdvanceAnim = () => {
    setAnimStep((s) => {
      const next = Math.min(joinSteps.length, s + 1);
      if (next > maxAnimSeenRef.current) maxAnimSeenRef.current = next;
      return next;
    });
    onDirty();
  };

  const handleExportCsv = () => {
    downloadCsv('sql_query_result.csv', queryResults.rows.map((r) => ({ customer: r.name, value: r.value })));
  };

  const handleExportJson = () => {
    downloadJson('sql_query_logic_blocks.json', {
      variant,
      selectedBlocks: state,
      generatedSql,
      correctCount,
      totalQuestions: QUESTIONS.length,
      explanation,
    });
  };

  const handleSubmit = () => {
    onSubmit({
      variant,
      selectedSelect: state.selectedSelect,
      selectedJoinType: state.selectedJoinType,
      selectedWhere: state.selectedWhere,
      selectedGroupBy: state.selectedGroupBy,
      selectedOrderBy: state.selectedOrderBy,
      dedupeCustomers: state.dedupeCustomers,
      guardNullAmounts: state.guardNullAmounts,
      correctCount,
      totalQuestions: QUESTIONS.length,
      predictions,
      generatedSql,
      explanation,
      resultRowCount: queryResults.rows.length,
      maxJoinAnimStepReached: maxAnimSeenRef.current,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Knowledge & Relational Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Questions Correct</span>
          <span className={`text-xl font-black ${correctCount === QUESTIONS.length ? 'text-emerald-400' : 'text-white'}`}>{correctCount}/{QUESTIONS.length}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Config + prediction must both match</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Active Join Type</span>
          <span className={`text-base font-black ${state.selectedJoinType === 'LEFT_JOIN' ? 'text-purple-300' : 'text-cyan-300'}`}>
            {state.selectedJoinType === 'LEFT_JOIN' ? 'LEFT JOIN' : 'INNER JOIN'}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">{joinedRows.length} rows in result</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#131728] border border-purple-500/30 bg-purple-950/20">
          <span className="text-xs text-purple-300 font-bold block mb-1">Data Quality Signals</span>
          <span className="text-base font-black text-purple-200">{duplicateCustomerKeyCount} dup keys · {nullAmountCount} null amounts</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">{state.dedupeCustomers ? 'Dedup ON' : 'Dedup OFF'} · {state.guardNullAmounts ? 'Null guard ON' : 'Null guard OFF'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: ER diagram, table browser, block builder, SQL text */}
        <div className="lg:col-span-7 space-y-4">
          {/* ER diagram */}
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
              <GitMerge className="w-4 h-4 text-purple-400" />
              <span>Entity Relationship Diagram</span>
            </h2>
            <div className="flex items-center justify-center gap-3 flex-wrap py-2">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                <div className="font-bold text-cyan-300 mb-1">customers</div>
                <div className="text-slate-400 font-mono text-[10px]">customer_id (PK)<br />name, city, tier</div>
              </div>
              <div className="flex flex-col items-center text-[10px] text-slate-400 font-mono">
                <span>1 : N</span>
                <ArrowRight className="w-5 h-5 text-purple-400" />
                <span>customer_id = customer_id</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                <div className="font-bold text-cyan-300 mb-1">orders</div>
                <div className="text-slate-400 font-mono text-[10px]">order_id (PK)<br />customer_id (FK), amount, status</div>
              </div>
            </div>
          </div>

          {/* Table browser */}
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Table2 className="w-4 h-4 text-purple-400" />
                <span>Table Browser</span>
              </h3>
              <div className="flex gap-1.5">
                <button type="button" onClick={() => setTableTab('customers')} className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${tableTab === 'customers' ? 'bg-purple-600 text-white border-purple-500' : 'bg-white/5 border-white/10 text-slate-400'}`}>customers ({customers.length})</button>
                <button type="button" onClick={() => setTableTab('orders')} className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${tableTab === 'orders' ? 'bg-purple-600 text-white border-purple-500' : 'bg-white/5 border-white/10 text-slate-400'}`}>orders ({orders.length})</button>
              </div>
            </div>
            <div className="overflow-x-auto max-h-48 overflow-y-auto rounded-xl border border-white/5">
              {tableTab === 'customers' ? (
                <table className="w-full text-left text-[11px] border-collapse font-mono">
                  <thead><tr className="border-b border-white/10 text-slate-400 bg-white/5 sticky top-0"><th className="p-2">customer_id</th><th className="p-2">name</th><th className="p-2">city</th><th className="p-2">tier</th></tr></thead>
                  <tbody className="divide-y divide-white/5">
                    {customers.map((c, i) => (
                      <tr key={i} className="hover:bg-white/5"><td className="p-2 text-purple-300">{c.customer_id}</td><td className="p-2 text-white font-sans">{c.name}</td><td className="p-2 text-slate-300">{c.city}</td><td className="p-2 text-slate-300">{c.tier}</td></tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-left text-[11px] border-collapse font-mono">
                  <thead><tr className="border-b border-white/10 text-slate-400 bg-white/5 sticky top-0"><th className="p-2">order_id</th><th className="p-2">customer_id</th><th className="p-2">amount</th><th className="p-2">status</th></tr></thead>
                  <tbody className="divide-y divide-white/5">
                    {orders.map((o, i) => (
                      <tr key={i} className="hover:bg-white/5"><td className="p-2 text-purple-300">{o.order_id}</td><td className="p-2 text-white">{o.customer_id}</td><td className="p-2 text-slate-300">{o.amount === null ? <span className="text-red-300">NULL</span> : `₹${o.amount}`}</td><td className="p-2 text-slate-300">{o.status}</td></tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Query Block Assembler */}
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>Query Block Assembler</span>
              </h2>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={undo} disabled={!canUndo} title="Undo" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30"><Undo2 className="w-3.5 h-3.5" /></button>
                <button type="button" onClick={redo} disabled={!canRedo} title="Redo" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30"><Redo2 className="w-3.5 h-3.5" /></button>
                <button type="button" onClick={handleReset} title="Reset query" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white"><RotateCcw className="w-3.5 h-3.5" /></button>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-xs font-mono font-bold text-purple-300">SELECT</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button type="button" onClick={() => update({ selectedSelect: 'name_sum' })} className={`p-2 rounded-xl border font-bold text-left ${state.selectedSelect === 'name_sum' ? 'bg-purple-600 text-white border-purple-500' : 'bg-white/5 border-white/10 text-slate-400'}`}>c.name, SUM(o.amount)</button>
                <button type="button" onClick={() => update({ selectedSelect: 'name_count' })} className={`p-2 rounded-xl border font-bold text-left ${state.selectedSelect === 'name_count' ? 'bg-purple-600 text-white border-purple-500' : 'bg-white/5 border-white/10 text-slate-400'}`}>c.name, COUNT(o.order_id)</button>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-xs font-mono font-bold text-cyan-300">JOIN</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button type="button" onClick={() => update({ selectedJoinType: 'LEFT_JOIN' })} className={`p-2.5 rounded-xl border font-bold text-left flex flex-col gap-0.5 ${state.selectedJoinType === 'LEFT_JOIN' ? 'bg-cyan-600 text-white border-cyan-500' : 'bg-white/5 border-white/10 text-slate-400'}`}><span>LEFT JOIN</span><span className="text-[10px] font-normal opacity-80">Retains customers with 0 orders</span></button>
                <button type="button" onClick={() => update({ selectedJoinType: 'INNER_JOIN' })} className={`p-2.5 rounded-xl border font-bold text-left flex flex-col gap-0.5 ${state.selectedJoinType === 'INNER_JOIN' ? 'bg-cyan-600 text-white border-cyan-500' : 'bg-white/5 border-white/10 text-slate-400'}`}><span>INNER JOIN</span><span className="text-[10px] font-normal opacity-80">Only customers with placed orders</span></button>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-xs font-mono font-bold text-amber-300">WHERE</span>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button type="button" onClick={() => update({ selectedWhere: 'none' })} className={`p-2 rounded-xl border font-bold ${state.selectedWhere === 'none' ? 'bg-amber-600 text-white border-amber-500' : 'bg-white/5 border-white/10 text-slate-400'}`}>none</button>
                <button type="button" onClick={() => update({ selectedWhere: 'gold_only' })} className={`p-2 rounded-xl border font-bold ${state.selectedWhere === 'gold_only' ? 'bg-amber-600 text-white border-amber-500' : 'bg-white/5 border-white/10 text-slate-400'}`}>tier = Gold</button>
                <button type="button" onClick={() => update({ selectedWhere: 'delivered_only' })} className={`p-2 rounded-xl border font-bold ${state.selectedWhere === 'delivered_only' ? 'bg-amber-600 text-white border-amber-500' : 'bg-white/5 border-white/10 text-slate-400'}`}>Delivered only</button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                <span className="text-xs font-mono font-bold text-emerald-300 block">GROUP BY</span>
                <button type="button" onClick={() => update({ selectedGroupBy: state.selectedGroupBy === 'customer_name' ? 'none' : 'customer_name' })} className="w-full p-2 rounded-xl bg-white/10 border border-white/15 text-white font-bold text-left">{state.selectedGroupBy === 'customer_name' ? 'c.name' : '(none)'}</button>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                <span className="text-xs font-mono font-bold text-slate-300 block">ORDER BY</span>
                <button type="button" onClick={() => update({ selectedOrderBy: state.selectedOrderBy === 'total_desc' ? 'name_asc' : 'total_desc' })} className="w-full p-2 rounded-xl bg-white/10 border border-white/15 text-white font-bold text-left">{state.selectedOrderBy === 'total_desc' ? 'total DESC' : 'c.name ASC'}</button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs">
              <button type="button" onClick={() => update({ dedupeCustomers: !state.dedupeCustomers })} className={`p-2.5 rounded-xl border font-bold text-left ${state.dedupeCustomers ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200' : 'bg-white/5 border-white/10 text-slate-400'}`}>Deduplicate customer keys</button>
              <button type="button" onClick={() => update({ guardNullAmounts: !state.guardNullAmounts })} className={`p-2.5 rounded-xl border font-bold text-left ${state.guardNullAmounts ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200' : 'bg-white/5 border-white/10 text-slate-400'}`}>Guard NULL amounts</button>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#0e101a] border border-white/10 space-y-2">
            <span className="text-xs font-mono font-extrabold text-purple-300 flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-purple-400" />
              <span>Compiled SQL (Display Only — Never Executed)</span>
            </span>
            <pre className="p-3 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-purple-200 overflow-x-auto leading-relaxed whitespace-pre-wrap">{generatedSql}</pre>
          </div>

          {/* Join animation */}
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-400" />
              <span>Row-by-Row Join Walkthrough</span>
            </h3>
            <SimClock label="Join Steps" step={animStep} maxStep={joinSteps.length} stepLabel={(s) => `${s}/${joinSteps.length}`} onAdvance={handleAdvanceAnim} onReset={() => setAnimStep(0)} />
            <div className="space-y-1 max-h-40 overflow-y-auto text-[11px] font-mono">
              {joinSteps.slice(0, animStep).map((s, i) => (
                <div key={i} className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${s.matched ? 'text-emerald-300' : 'text-amber-300'}`}>
                  {s.matched ? <CheckCircle2 className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
                  <span>{s.customerName}: {s.note}</span>
                </div>
              ))}
              {animStep === 0 && <span className="text-slate-500 italic">Click Advance to step through the join, row by row.</span>}
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Questions checklist, result table + chart, explanation, submit */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">Six Questions ({correctCount}/{QUESTIONS.length} correct)</h3>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {QUESTIONS.map((q) => {
                const done = achieved.has(q.id);
                return (
                  <div key={q.id} className={`p-2.5 rounded-xl border text-[11px] space-y-1.5 ${done ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/10'}`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-slate-200">{q.title}</span>
                      {done ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <Circle className="w-3.5 h-3.5 text-slate-600 shrink-0" />}
                    </div>
                    <p className="text-slate-400">{q.prompt}</p>
                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/10">
                      <span className="text-slate-400 flex-1">{q.predictionLabel}</span>
                      <div className="flex gap-1 shrink-0">
                        <button type="button" onClick={() => setPrediction(q.id, true)} className={`px-2 py-0.5 rounded font-bold ${predictions[q.id] === true ? 'bg-purple-600 text-white' : 'bg-white/10 text-slate-400'}`}>Yes</button>
                        <button type="button" onClick={() => setPrediction(q.id, false)} className={`px-2 py-0.5 rounded font-bold ${predictions[q.id] === false ? 'bg-purple-600 text-white' : 'bg-white/10 text-slate-400'}`}>No</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <ChartFrame
            title="Total Spend by Customer"
            icon={<BarChart3 className="w-4 h-4 text-purple-400" />}
            tableHeaders={['Customer', 'Value']}
            tableRows={queryResults.rows.map((r) => [r.name, Number.isNaN(r.value) ? 'ERROR' : r.value])}
          >
            <CompareBarChart
              labels={queryResults.rows.map((r) => r.name)}
              series={[{
                label: state.selectedSelect === 'name_sum' ? 'Total Spend' : 'Order Count',
                data: queryResults.rows.map((r) => (Number.isNaN(r.value) ? 0 : r.value)),
                statusOverride: queryResults.rows.map((r) => (r.name === 'Devendra Rao' ? 'warning' : Number.isNaN(r.value) ? 'critical' : null)),
              }]}
              yLabel={state.selectedSelect === 'name_sum' ? 'Total Spend (₹)' : 'Orders'}
            />
          </ChartFrame>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-2">
            <label htmlFor="sql-explanation" className="text-xs font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Explain LEFT vs INNER JOIN Retention</span>
            </label>
            <textarea id="sql-explanation" rows={4} value={explanation} onChange={(e) => { setExplanation(e.target.value); onDirty(); }}
              className="w-full text-xs p-3 rounded-xl bg-black/30 border border-white/15 text-slate-200 focus:outline-none focus:border-purple-500/50" />
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={handleExportCsv} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] font-bold"><Download className="w-3.5 h-3.5" /><span>CSV</span></button>
            <button type="button" onClick={handleExportJson} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] font-bold"><FileJson className="w-3.5 h-3.5" /><span>JSON</span></button>
          </div>

          <div className="p-3 rounded-xl bg-black/30 border border-white/10 text-[10px] text-slate-500 font-mono">History step {stepIndex} · {queryResults.rows.length} rows in current result</div>

          <button type="button" onClick={handleSubmit} className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold transition-all flex items-center justify-center gap-2">
            <Send className="w-4 h-4" />
            <span>Submit &amp; Evaluate Query Logic</span>
          </button>
        </div>
      </div>
    </div>
  );
}
