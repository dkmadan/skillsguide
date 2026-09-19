'use client';

import React, { useMemo } from 'react';
import { LabScenarioVariant, LabDifficulty } from '@/lib/labs/types';
import { useUndoableState } from '@/lib/labs/useUndoableState';
import { downloadCsv, downloadJson } from '@/lib/labs/exportHelper';
import ChartFrame from '@/components/labs/charts/ChartFrame';
import TrendLineChart from '@/components/labs/charts/TrendLineChart';
import CompareBarChart from '@/components/labs/charts/CompareBarChart';
import {
  Filter,
  BarChart3,
  LineChart as LineChartIcon,
  Send,
  Sparkles,
  Undo2,
  Redo2,
  RotateCcw,
  Download,
  FileJson,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

interface SimulatorProps {
  scenario?: LabScenarioVariant;
  variant: LabDifficulty;
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

interface Order {
  id: string;
  customer: string;
  region: string;
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  qty: number;
  unitPrice: number;
  discount: number;
  status: 'Completed' | 'Cancelled';
}

const REGIONS = ['North', 'West', 'South', 'East'];

// Three genuinely different fixture pools per difficulty tier — same North
// Q1->Q4 decline narrative, increasing data-hygiene ambiguity per the
// contract ("increasing ambiguity, not larger infrastructure requirements").
const ORDER_POOLS: Record<LabDifficulty, Order[]> = {
  beginner: [
    { id: 'ORD-101', customer: 'Nexus Retail', region: 'North', quarter: 'Q1', qty: 40, unitPrice: 250, discount: 500, status: 'Completed' },
    { id: 'ORD-102', customer: 'Delta Logistics', region: 'West', quarter: 'Q1', qty: 60, unitPrice: 180, discount: 800, status: 'Completed' },
    { id: 'ORD-103', customer: 'Vertex Media', region: 'South', quarter: 'Q1', qty: 25, unitPrice: 300, discount: 250, status: 'Completed' },
    { id: 'ORD-104', customer: 'Sigma Solutions', region: 'East', quarter: 'Q1', qty: 80, unitPrice: 150, discount: 1000, status: 'Completed' },
    { id: 'ORD-105', customer: 'Orion Traders', region: 'North', quarter: 'Q1', qty: 55, unitPrice: 250, discount: 300, status: 'Completed' },
    { id: 'ORD-106', customer: 'Nexus Retail', region: 'North', quarter: 'Q1', qty: 40, unitPrice: 250, discount: 500, status: 'Completed' }, // exact duplicate of ORD-101
    { id: 'ORD-107', customer: 'Zeta Innovations', region: 'South', quarter: 'Q2', qty: 50, unitPrice: 220, discount: 600, status: 'Completed' },
    { id: 'ORD-108', customer: 'Pinnacle Tech', region: 'West', quarter: 'Q2', qty: 70, unitPrice: 190, discount: 900, status: 'Completed' },
    { id: 'ORD-109', customer: 'Horizon Group', region: '', quarter: 'Q2', qty: 35, unitPrice: 240, discount: 400, status: 'Completed' }, // blank region
    { id: 'ORD-110', customer: 'Quantum Dynamics', region: 'North', quarter: 'Q2', qty: 90, unitPrice: 300, discount: 2000, status: 'Cancelled' }, // cancelled
    { id: 'ORD-111', customer: 'Omega Labs', region: 'East', quarter: 'Q2', qty: 45, unitPrice: 210, discount: 450, status: 'Completed' },
    { id: 'ORD-112', customer: 'Aura Systems', region: 'South', quarter: 'Q2', qty: 30, unitPrice: 280, discount: 300, status: 'Completed' },
    { id: 'ORD-113', customer: 'Apex Corp', region: 'North', quarter: 'Q3', qty: 20, unitPrice: 250, discount: 0, status: 'Completed' }, // North decline begins
    { id: 'ORD-114', customer: 'Delta Logistics', region: 'West', quarter: 'Q3', qty: 58, unitPrice: 180, discount: 700, status: 'Completed' },
    { id: 'ORD-115', customer: 'Vertex Media', region: 'South', quarter: 'Q3', qty: 33, unitPrice: 300, discount: 260, status: 'Completed' },
    { id: 'ORD-116', customer: 'Sigma Solutions', region: 'East', quarter: 'Q3', qty: 76, unitPrice: 150, discount: 950, status: 'Completed' },
    { id: 'ORD-117', customer: 'Nova Traders', region: 'North', quarter: 'Q4', qty: 12, unitPrice: 250, discount: 0, status: 'Completed' }, // North decline continues
    { id: 'ORD-118', customer: 'Pinnacle Tech', region: 'West', quarter: 'Q4', qty: 66, unitPrice: 190, discount: 850, status: 'Completed' },
    { id: 'ORD-119', customer: 'Zeta Innovations', region: 'South', quarter: 'Q4', qty: 52, unitPrice: 220, discount: 580, status: 'Completed' },
    { id: 'ORD-120', customer: 'Omega Labs', region: 'East', quarter: 'Q4', qty: 48, unitPrice: 210, discount: 470, status: 'Completed' },
  ],
  intermediate: [
    { id: 'ORD-201', customer: 'Nexus Retail', region: 'North', quarter: 'Q1', qty: 42, unitPrice: 260, discount: 520, status: 'Completed' },
    { id: 'ORD-202', customer: 'Delta Logistics', region: 'West', quarter: 'Q1', qty: 61, unitPrice: 185, discount: 810, status: 'Completed' },
    { id: 'ORD-203', customer: 'Vertex Media', region: 'South', quarter: 'Q1', qty: 27, unitPrice: 305, discount: 260, status: 'Completed' },
    { id: 'ORD-204', customer: 'Nexus Retail', region: 'North', quarter: 'Q1', qty: 42, unitPrice: 260, discount: 520, status: 'Completed' }, // exact duplicate #1
    { id: 'ORD-205', customer: 'Orion Traders', region: 'North', quarter: 'Q1', qty: 22, unitPrice: 260, discount: 100, status: 'Completed' }, // similar but legitimately distinct — NOT a duplicate
    { id: 'ORD-206', customer: 'Sigma Solutions', region: '', quarter: 'Q1', qty: 82, unitPrice: 155, discount: 1010, status: 'Completed' }, // blank region #1
    { id: 'ORD-207', customer: 'Zeta Innovations', region: 'South', quarter: 'Q2', qty: 51, unitPrice: 225, discount: 610, status: 'Completed' },
    { id: 'ORD-208', customer: 'Pinnacle Tech', region: '', quarter: 'Q2', qty: 71, unitPrice: 195, discount: 910, status: 'Completed' }, // blank region #2
    { id: 'ORD-209', customer: 'Quantum Dynamics', region: 'North', quarter: 'Q2', qty: 91, unitPrice: 305, discount: 2010, status: 'Cancelled' }, // cancelled #1
    { id: 'ORD-210', customer: 'Helios Freight', region: 'East', quarter: 'Q2', qty: 38, unitPrice: 175, discount: 380, status: 'Cancelled' }, // cancelled #2
    { id: 'ORD-211', customer: 'Omega Labs', region: 'East', quarter: 'Q2', qty: 46, unitPrice: 215, discount: 460, status: 'Completed' },
    { id: 'ORD-212', customer: 'Aura Systems', region: 'South', quarter: 'Q2', qty: 31, unitPrice: 285, discount: 310, status: 'Completed' },
    { id: 'ORD-213', customer: 'Apex Corp', region: 'North', quarter: 'Q3', qty: 18, unitPrice: 260, discount: 0, status: 'Completed' },
    { id: 'ORD-214', customer: 'Delta Logistics', region: 'West', quarter: 'Q3', qty: 59, unitPrice: 185, discount: 720, status: 'Completed' },
    { id: 'ORD-215', customer: 'Vertex Media', region: 'South', quarter: 'Q3', qty: 35, unitPrice: 305, discount: 270, status: 'Completed' },
    { id: 'ORD-216', customer: 'Sigma Solutions', region: 'East', quarter: 'Q3', qty: 77, unitPrice: 155, discount: 960, status: 'Completed' },
    { id: 'ORD-217', customer: 'Nova Traders', region: 'North', quarter: 'Q4', qty: 9, unitPrice: 260, discount: 0, status: 'Completed' },
    { id: 'ORD-218', customer: 'Pinnacle Tech', region: 'West', quarter: 'Q4', qty: 67, unitPrice: 195, discount: 860, status: 'Completed' },
    { id: 'ORD-219', customer: 'Zeta Innovations', region: 'South', quarter: 'Q4', qty: 53, unitPrice: 225, discount: 590, status: 'Completed' },
    { id: 'ORD-220', customer: 'Omega Labs', region: 'East', quarter: 'Q4', qty: 49, unitPrice: 215, discount: 480, status: 'Completed' },
    { id: 'ORD-221', customer: 'Helios Freight', region: 'East', quarter: 'Q4', qty: 28, unitPrice: 175, discount: 260, status: 'Completed' },
  ],
  challenge: [
    { id: 'ORD-301', customer: 'Nexus Retail', region: 'North', quarter: 'Q1', qty: 44, unitPrice: 265, discount: 530, status: 'Completed' },
    { id: 'ORD-302', customer: 'Nexus Retail', region: 'North', quarter: 'Q1', qty: 44, unitPrice: 265, discount: 545, status: 'Completed' }, // near-duplicate: discount typo, still same underlying order
    { id: 'ORD-303', customer: 'Delta Logistics', region: 'West', quarter: 'Q1', qty: 62, unitPrice: 188, discount: 820, status: 'Completed' },
    { id: 'ORD-304', customer: 'Vertex Media', region: 'South', quarter: 'Q1', qty: 28, unitPrice: 310, discount: 265, status: 'Completed' },
    { id: 'ORD-305', customer: 'Orion Traders', region: 'North', quarter: 'Q1', qty: 24, unitPrice: 265, discount: 120, status: 'Completed' }, // legitimately distinct, NOT a duplicate
    { id: 'ORD-306', customer: 'Sigma Solutions', region: '', quarter: 'Q1', qty: 83, unitPrice: 158, discount: 1020, status: 'Completed' }, // blank region #1
    { id: 'ORD-307', customer: 'Zeta Innovations', region: '', quarter: 'Q2', qty: 52, unitPrice: 228, discount: 615, status: 'Completed' }, // blank region #2 (different customer than #1)
    { id: 'ORD-308', customer: 'Pinnacle Tech', region: 'West', quarter: 'Q2', qty: 72, unitPrice: 198, discount: 915, status: 'Completed' },
    { id: 'ORD-309', customer: 'Quantum Dynamics', region: 'North', quarter: 'Q2', qty: 92, unitPrice: 308, discount: 2020, status: 'Cancelled' }, // cancelled #1
    { id: 'ORD-310', customer: 'Helios Freight', region: 'East', quarter: 'Q2', qty: 39, unitPrice: 178, discount: 385, status: 'Cancelled' }, // cancelled #2
    { id: 'ORD-311', customer: 'Crestline Media', region: 'South', quarter: 'Q2', qty: 21, unitPrice: 300, discount: 90, status: 'Cancelled' }, // cancelled #3
    { id: 'ORD-312', customer: 'Omega Labs', region: 'East', quarter: 'Q2', qty: 47, unitPrice: 218, discount: 465, status: 'Completed' },
    { id: 'ORD-313', customer: 'Apex Corp', region: 'North', quarter: 'Q3', qty: 16, unitPrice: 265, discount: 0, status: 'Completed' },
    { id: 'ORD-314', customer: 'Delta Logistics', region: 'West', quarter: 'Q3', qty: 60, unitPrice: 188, discount: 730, status: 'Completed' },
    { id: 'ORD-315', customer: 'Vertex Media', region: 'South', quarter: 'Q3', qty: 36, unitPrice: 310, discount: 275, status: 'Completed' },
    { id: 'ORD-316', customer: 'Sigma Solutions', region: 'East', quarter: 'Q3', qty: 78, unitPrice: 158, discount: 970, status: 'Completed' },
    { id: 'ORD-317', customer: 'Nova Traders', region: 'North', quarter: 'Q4', qty: 7, unitPrice: 265, discount: 0, status: 'Completed' },
    { id: 'ORD-318', customer: 'Pinnacle Tech', region: 'West', quarter: 'Q4', qty: 68, unitPrice: 198, discount: 870, status: 'Completed' },
    { id: 'ORD-319', customer: 'Zeta Innovations', region: 'South', quarter: 'Q4', qty: 54, unitPrice: 228, discount: 600, status: 'Completed' },
    { id: 'ORD-320', customer: 'Omega Labs', region: 'East', quarter: 'Q4', qty: 50, unitPrice: 218, discount: 490, status: 'Completed' },
    { id: 'ORD-321', customer: 'Helios Freight', region: 'East', quarter: 'Q4', qty: 29, unitPrice: 178, discount: 265, status: 'Completed' },
    { id: 'ORD-322', customer: 'Crestline Media', region: 'South', quarter: 'Q4', qty: 19, unitPrice: 300, discount: 80, status: 'Completed' },
  ],
};

type GroupDimension = 'region' | 'quarter' | 'customer';

interface CleaningState {
  removeDuplicates: boolean;
  excludeCancelled: boolean;
  imputeBlankRegion: boolean;
  groupDimension: GroupDimension;
  selectedRegion: string;
}

const INITIAL_STATE: CleaningState = {
  removeDuplicates: false,
  excludeCancelled: false,
  imputeBlankRegion: false,
  groupDimension: 'region',
  selectedRegion: 'All',
};

function computeRevenue(o: Order): number {
  return o.qty * o.unitPrice - o.discount;
}

export default function BusinessAnalystDeskLab({ variant, onDirty, onSubmit }: SimulatorProps) {
  const rawOrders = ORDER_POOLS[variant];
  const { state, set, undo, redo, reset, canUndo, canRedo, stepIndex } = useUndoableState<CleaningState>(INITIAL_STATE);
  const [findingsMemo, setFindingsMemo] = React.useState(
    'Regional revenue in North fell steadily from Q1 to Q4 because large accounts (Apex Corp, Nova Traders) placed shrinking orders each quarter, while a cancelled high-value order further masked true demand. After deduplication and exclusion of cancelled orders, the decline is real — not a data-quality artifact.'
  );

  const update = (patch: Partial<CleaningState>) => {
    set((prev) => ({ ...prev, ...patch }));
    onDirty();
  };

  // Fallback region for imputation = most common non-blank region in the raw pool (computed, not hardcoded).
  const fallbackRegion = useMemo(() => {
    const counts: Record<string, number> = {};
    rawOrders.forEach((o) => { if (o.region) counts[o.region] = (counts[o.region] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'East';
  }, [rawOrders]);

  const cleanedOrders = useMemo(() => {
    let list = [...rawOrders];
    if (state.removeDuplicates) {
      const seen = new Set<string>();
      list = list.filter((o) => {
        const key = `${o.customer}_${o.quarter}_${o.qty}_${o.unitPrice}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }
    if (state.excludeCancelled) list = list.filter((o) => o.status !== 'Cancelled');
    if (state.imputeBlankRegion) list = list.map((o) => (o.region === '' ? { ...o, region: fallbackRegion } : o));
    return list;
  }, [rawOrders, state.removeDuplicates, state.excludeCancelled, state.imputeBlankRegion, fallbackRegion]);

  const rawNetRevenue = useMemo(() => rawOrders.reduce((s, o) => s + computeRevenue(o), 0), [rawOrders]);

  const metrics = useMemo(() => {
    const filtered = state.selectedRegion === 'All' ? cleanedOrders : cleanedOrders.filter((o) => o.region === state.selectedRegion);
    const netRevenue = filtered.reduce((s, o) => s + computeRevenue(o), 0);
    const totalUnits = filtered.reduce((s, o) => s + o.qty, 0);

    const regionalRev: Record<string, number> = {};
    REGIONS.forEach((r) => {
      regionalRev[r] = cleanedOrders.filter((o) => o.region === r).reduce((s, o) => s + computeRevenue(o), 0);
    });

    const quarterlyRevClean: Record<string, number> = { Q1: 0, Q2: 0, Q3: 0, Q4: 0 };
    const quarterlyRevRaw: Record<string, number> = { Q1: 0, Q2: 0, Q3: 0, Q4: 0 };
    cleanedOrders.forEach((o) => { quarterlyRevClean[o.quarter] += computeRevenue(o); });
    rawOrders.forEach((o) => { quarterlyRevRaw[o.quarter] += computeRevenue(o); });

    const byCustomer: Record<string, number> = {};
    cleanedOrders.forEach((o) => { byCustomer[o.customer] = (byCustomer[o.customer] || 0) + computeRevenue(o); });
    const topCustomers = Object.entries(byCustomer).sort((a, b) => b[1] - a[1]).slice(0, 6);

    return { netRevenue, totalUnits, regionalRev, quarterlyRevClean, quarterlyRevRaw, topCustomers, filteredCount: filtered.length };
  }, [cleanedOrders, rawOrders, state.selectedRegion]);

  const northTrend = metrics.quarterlyRevClean.Q4 - metrics.quarterlyRevClean.Q1;
  const stepsApplied = [state.removeDuplicates, state.excludeCancelled, state.imputeBlankRegion].filter(Boolean).length;

  const groupChartData = useMemo(() => {
    if (state.groupDimension === 'region') {
      return { labels: REGIONS, values: REGIONS.map((r) => metrics.regionalRev[r]) };
    }
    if (state.groupDimension === 'quarter') {
      return { labels: ['Q1', 'Q2', 'Q3', 'Q4'], values: ['Q1', 'Q2', 'Q3', 'Q4'].map((q) => metrics.quarterlyRevClean[q]) };
    }
    return { labels: metrics.topCustomers.map(([c]) => c), values: metrics.topCustomers.map(([, v]) => v) };
  }, [state.groupDimension, metrics]);

  const handleExportCsv = () => {
    downloadCsv('business_analyst_cleaned_orders.csv', cleanedOrders.map((o) => ({
      order_id: o.id, customer: o.customer, region: o.region, quarter: o.quarter,
      qty: o.qty, unit_price: o.unitPrice, discount: o.discount, status: o.status, revenue: computeRevenue(o),
    })));
  };

  const handleExportJson = () => {
    downloadJson('business_analyst_findings.json', {
      variant, cleaningRecipe: state, metrics: { netRevenue: metrics.netRevenue, rawNetRevenue }, findingsMemo,
    });
  };

  const handleSubmit = () => {
    onSubmit({
      removedDuplicates: state.removeDuplicates,
      excludedCancelled: state.excludeCancelled,
      imputedBlankRegions: state.imputeBlankRegion,
      groupDimension: state.groupDimension,
      selectedRegion: state.selectedRegion,
      calculatedNetRevenue: metrics.netRevenue,
      rawNetRevenue,
      findingsMemo,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Metric Cards: Before vs After */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Raw (Before) Revenue</span>
          <span className="text-xl font-black text-slate-300">₹{rawNetRevenue.toLocaleString()}</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">{rawOrders.length} uncleaned records</span>
        </div>
        <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30">
          <span className="text-xs text-purple-300 font-bold block mb-1">Clean (After) Net Revenue</span>
          <span className="text-xl font-black text-purple-200">₹{metrics.netRevenue.toLocaleString()}</span>
          <span className="text-[10px] text-emerald-400 block mt-0.5">{metrics.filteredCount} valid records in view</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">North Q1→Q4 Trend</span>
          <span className={`text-xl font-black flex items-center gap-1 ${northTrend < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
            {northTrend < 0 ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
            ₹{Math.abs(northTrend).toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">{northTrend < 0 ? 'Confirmed decline' : 'Growth'}</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Cleaning Pipeline</span>
          <span className="text-xl font-black text-emerald-400">{stepsApplied}/3 steps</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">History step {stepIndex}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Cleaning pipeline + grid */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Filter className="w-4 h-4 text-purple-400" />
                <span>1. Data Cleaning Recipe &amp; Pipeline</span>
              </h2>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={undo} disabled={!canUndo} title="Undo last cleaning action"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30 transition-colors">
                  <Undo2 className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={redo} disabled={!canRedo} title="Redo"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30 transition-colors">
                  <Redo2 className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => { reset(); onDirty(); }} title="Reset pipeline"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors">
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button type="button" onClick={() => update({ removeDuplicates: !state.removeDuplicates })}
                className={`p-3 rounded-2xl border text-xs font-bold text-left transition-all flex flex-col gap-1 ${state.removeDuplicates ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}>
                <span>Deduplicate</span>
                <span className="text-[10px] font-normal text-slate-400">Drop repeated customer/qty/price rows</span>
              </button>
              <button type="button" onClick={() => update({ excludeCancelled: !state.excludeCancelled })}
                className={`p-3 rounded-2xl border text-xs font-bold text-left transition-all flex flex-col gap-1 ${state.excludeCancelled ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}>
                <span>Filter Cancelled</span>
                <span className="text-[10px] font-normal text-slate-400">Exclude cancelled orders from revenue</span>
              </button>
              <button type="button" onClick={() => update({ imputeBlankRegion: !state.imputeBlankRegion })}
                className={`p-3 rounded-2xl border text-xs font-bold text-left transition-all flex flex-col gap-1 ${state.imputeBlankRegion ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}>
                <span>Impute Missing</span>
                <span className="text-[10px] font-normal text-slate-400">Assign blank region to &quot;{fallbackRegion}&quot;</span>
              </button>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                Orders Data Grid ({cleanedOrders.length} Records)
              </h3>
              <div className="flex items-center gap-2">
                <select value={state.selectedRegion} onChange={(e) => update({ selectedRegion: e.target.value })}
                  className="text-[11px] font-bold px-2 py-1 rounded-lg bg-black/40 border border-white/15 text-slate-300">
                  <option value="All">All Regions</option>
                  {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
                <select value={state.groupDimension} onChange={(e) => update({ groupDimension: e.target.value as GroupDimension })}
                  className="text-[11px] font-bold px-2 py-1 rounded-lg bg-black/40 border border-white/15 text-slate-300"
                  title="Chart grouping dimension">
                  <option value="region">Group: Region</option>
                  <option value="quarter">Group: Quarter</option>
                  <option value="customer">Group: Top Customers</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto max-h-72 overflow-y-auto rounded-xl border border-white/5">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 text-[11px] sticky top-0 bg-[#111425]">
                    <th className="p-2">ID</th><th className="p-2">Customer</th><th className="p-2">Region</th>
                    <th className="p-2">Quarter</th><th className="p-2">Qty</th><th className="p-2">Unit Price</th>
                    <th className="p-2">Discount</th><th className="p-2">Status</th><th className="p-2">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {cleanedOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-2 font-mono text-purple-300">{o.id}</td>
                      <td className="p-2 font-semibold text-white">{o.customer}</td>
                      <td className="p-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${o.region === '' ? 'bg-red-500/20 text-red-300' : 'bg-white/10 text-slate-300'}`}>
                          {o.region || 'BLANK'}
                        </span>
                      </td>
                      <td className="p-2 text-slate-300">{o.quarter}</td>
                      <td className="p-2 font-mono">{o.qty}</td>
                      <td className="p-2 font-mono">₹{o.unitPrice}</td>
                      <td className="p-2 font-mono text-amber-300">₹{o.discount}</td>
                      <td className="p-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${o.status === 'Cancelled' ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="p-2 font-mono text-slate-300">₹{computeRevenue(o).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Visualizations, memo, exports */}
        <div className="lg:col-span-5 space-y-4">
          <ChartFrame
            title="Revenue Trend (Before vs After Cleaning)"
            icon={<LineChartIcon className="w-4 h-4 text-purple-400" />}
            tableHeaders={['Quarter', 'Raw Revenue', 'Clean Revenue']}
            tableRows={['Q1', 'Q2', 'Q3', 'Q4'].map((q) => [q, metrics.quarterlyRevRaw[q], metrics.quarterlyRevClean[q]])}
          >
            <TrendLineChart
              labels={['Q1', 'Q2', 'Q3', 'Q4']}
              series={[
                { label: 'Raw', data: ['Q1', 'Q2', 'Q3', 'Q4'].map((q) => metrics.quarterlyRevRaw[q]) },
                { label: 'Cleaned', data: ['Q1', 'Q2', 'Q3', 'Q4'].map((q) => metrics.quarterlyRevClean[q]), fill: true },
              ]}
              yLabel="Revenue (₹)"
            />
          </ChartFrame>

          <ChartFrame
            title={`Breakdown by ${state.groupDimension === 'region' ? 'Region' : state.groupDimension === 'quarter' ? 'Quarter' : 'Top Customer'}`}
            icon={<BarChart3 className="w-4 h-4 text-purple-400" />}
            tableHeaders={['Group', 'Revenue']}
            tableRows={groupChartData.labels.map((l, i) => [l, groupChartData.values[i]])}
          >
            <CompareBarChart
              labels={groupChartData.labels}
              series={[{
                label: 'Revenue',
                data: groupChartData.values,
                statusOverride: state.groupDimension === 'region' ? groupChartData.labels.map((l) => (l === 'North' ? 'critical' : null)) : undefined,
              }]}
              yLabel="Revenue (₹)"
            />
          </ChartFrame>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-2">
            <label htmlFor="findings-memo" className="text-xs font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Executive Findings &amp; Root Cause Memo</span>
            </label>
            <textarea id="findings-memo" rows={4} value={findingsMemo}
              onChange={(e) => { setFindingsMemo(e.target.value); onDirty(); }}
              className="w-full text-xs p-3 rounded-xl bg-black/30 border border-white/15 text-slate-200 focus:outline-none focus:border-purple-500/50" />
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={handleExportCsv} title="Export cleaned orders as CSV"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] font-bold transition-colors">
              <Download className="w-3.5 h-3.5" /><span>CSV</span>
            </button>
            <button type="button" onClick={handleExportJson} title="Export findings as JSON"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] font-bold transition-colors">
              <FileJson className="w-3.5 h-3.5" /><span>JSON</span>
            </button>
          </div>

          <button type="button" onClick={handleSubmit}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold transition-all flex items-center justify-center gap-2">
            <Send className="w-4 h-4" />
            <span>Submit Data Analytics Findings</span>
          </button>
        </div>
      </div>
    </div>
  );
}
