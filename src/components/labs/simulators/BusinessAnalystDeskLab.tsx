'use client';

import React, { useState, useMemo, useCallback } from 'react';
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
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Database,
  Search,
  Eye
} from 'lucide-react';

interface SimulatorProps {
  scenario?: LabScenarioVariant;
  variant: LabDifficulty;
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

interface OrderRecord {
  id: string;
  customer: string;
  region: string;
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  qty: number;
  unitPrice: number;
  discount: number;
  status: 'Completed' | 'Cancelled';
  returned?: boolean;
}

const REGIONS = ['North', 'West', 'South', 'East'];

const ORDER_POOLS: Record<LabDifficulty, OrderRecord[]> = {
  beginner: [
    { id: 'ORD-101', customer: 'Nexus Retail', region: 'North', quarter: 'Q1', qty: 40, unitPrice: 250, discount: 500, status: 'Completed', returned: false },
    { id: 'ORD-102', customer: 'Delta Logistics', region: 'West', quarter: 'Q1', qty: 60, unitPrice: 180, discount: 800, status: 'Completed', returned: false },
    { id: 'ORD-103', customer: 'Vertex Media', region: 'South', quarter: 'Q1', qty: 25, unitPrice: 300, discount: 250, status: 'Completed', returned: false },
    { id: 'ORD-104', customer: 'Sigma Solutions', region: 'East', quarter: 'Q1', qty: 80, unitPrice: 150, discount: 1000, status: 'Completed', returned: false },
    { id: 'ORD-105', customer: 'Orion Traders', region: 'North', quarter: 'Q1', qty: 55, unitPrice: 250, discount: 300, status: 'Completed', returned: false },
    { id: 'ORD-106', customer: 'Nexus Retail', region: 'North', quarter: 'Q1', qty: 40, unitPrice: 250, discount: 500, status: 'Completed', returned: false }, // exact duplicate of ORD-101
    { id: 'ORD-107', customer: 'Zeta Innovations', region: 'South', quarter: 'Q2', qty: 50, unitPrice: 220, discount: 600, status: 'Completed', returned: false },
    { id: 'ORD-108', customer: 'Pinnacle Tech', region: 'West', quarter: 'Q2', qty: 70, unitPrice: 190, discount: 900, status: 'Completed', returned: false },
    { id: 'ORD-109', customer: 'Horizon Group', region: '', quarter: 'Q2', qty: 35, unitPrice: 240, discount: 400, status: 'Completed', returned: false }, // blank region
    { id: 'ORD-110', customer: 'Quantum Dynamics', region: 'North', quarter: 'Q2', qty: 90, unitPrice: 300, discount: 2000, status: 'Cancelled', returned: false },
    { id: 'ORD-111', customer: 'Omega Labs', region: 'East', quarter: 'Q2', qty: 45, unitPrice: 210, discount: 450, status: 'Completed', returned: false },
    { id: 'ORD-112', customer: 'Aura Systems', region: 'South', quarter: 'Q2', qty: 30, unitPrice: 280, discount: 300, status: 'Completed', returned: false },
    { id: 'ORD-113', customer: 'Apex Corp', region: 'North', quarter: 'Q3', qty: 20, unitPrice: 250, discount: 0, status: 'Completed', returned: false },
    { id: 'ORD-114', customer: 'Delta Logistics', region: 'West', quarter: 'Q3', qty: 58, unitPrice: 180, discount: 700, status: 'Completed', returned: false },
    { id: 'ORD-115', customer: 'Vertex Media', region: 'South', quarter: 'Q3', qty: 33, unitPrice: 300, discount: 260, status: 'Completed', returned: false },
    { id: 'ORD-116', customer: 'Sigma Solutions', region: 'East', quarter: 'Q3', qty: 76, unitPrice: 150, discount: 950, status: 'Completed', returned: false },
    { id: 'ORD-117', customer: 'Nova Traders', region: 'North', quarter: 'Q4', qty: 12, unitPrice: 250, discount: 0, status: 'Completed', returned: false },
    { id: 'ORD-118', customer: 'Pinnacle Tech', region: 'West', quarter: 'Q4', qty: 66, unitPrice: 190, discount: 850, status: 'Completed', returned: false },
    { id: 'ORD-119', customer: 'Zeta Innovations', region: 'South', quarter: 'Q4', qty: 52, unitPrice: 220, discount: 580, status: 'Completed', returned: true }, // return
    { id: 'ORD-120', customer: 'Omega Labs', region: 'East', quarter: 'Q4', qty: 48, unitPrice: 210, discount: 470, status: 'Completed', returned: false },
  ],
  intermediate: [
    { id: 'ORD-201', customer: 'Nexus Retail', region: 'North', quarter: 'Q1', qty: 42, unitPrice: 260, discount: 520, status: 'Completed', returned: false },
    { id: 'ORD-202', customer: 'Delta Logistics', region: 'West', quarter: 'Q1', qty: 61, unitPrice: 185, discount: 810, status: 'Completed', returned: false },
    { id: 'ORD-203', customer: 'Vertex Media', region: 'South', quarter: 'Q1', qty: 27, unitPrice: 305, discount: 260, status: 'Completed', returned: false },
    { id: 'ORD-204', customer: 'Nexus Retail', region: 'North', quarter: 'Q1', qty: 42, unitPrice: 260, discount: 520, status: 'Completed', returned: false },
    { id: 'ORD-205', customer: 'Orion Traders', region: 'North', quarter: 'Q1', qty: 22, unitPrice: 260, discount: 100, status: 'Completed', returned: false },
    { id: 'ORD-206', customer: 'Sigma Solutions', region: '', quarter: 'Q1', qty: 82, unitPrice: 155, discount: 1010, status: 'Completed', returned: false },
    { id: 'ORD-207', customer: 'Zeta Innovations', region: 'South', quarter: 'Q2', qty: 51, unitPrice: 225, discount: 610, status: 'Completed', returned: false },
    { id: 'ORD-208', customer: 'Pinnacle Tech', region: '', quarter: 'Q2', qty: 71, unitPrice: 195, discount: 910, status: 'Completed', returned: false },
    { id: 'ORD-209', customer: 'Quantum Dynamics', region: 'North', quarter: 'Q2', qty: 91, unitPrice: 305, discount: 2010, status: 'Cancelled', returned: false },
    { id: 'ORD-210', customer: 'Helios Freight', region: 'East', quarter: 'Q2', qty: 38, unitPrice: 175, discount: 380, status: 'Cancelled', returned: false },
    { id: 'ORD-211', customer: 'Omega Labs', region: 'East', quarter: 'Q2', qty: 46, unitPrice: 215, discount: 460, status: 'Completed', returned: false },
    { id: 'ORD-212', customer: 'Aura Systems', region: 'South', quarter: 'Q2', qty: 31, unitPrice: 285, discount: 310, status: 'Completed', returned: false },
    { id: 'ORD-213', customer: 'Apex Corp', region: 'North', quarter: 'Q3', qty: 18, unitPrice: 260, discount: 0, status: 'Completed', returned: false },
    { id: 'ORD-214', customer: 'Delta Logistics', region: 'West', quarter: 'Q3', qty: 59, unitPrice: 185, discount: 720, status: 'Completed', returned: false },
    { id: 'ORD-215', customer: 'Vertex Media', region: 'South', quarter: 'Q3', qty: 35, unitPrice: 305, discount: 270, status: 'Completed', returned: false },
    { id: 'ORD-216', customer: 'Sigma Solutions', region: 'East', quarter: 'Q3', qty: 77, unitPrice: 155, discount: 960, status: 'Completed', returned: false },
    { id: 'ORD-217', customer: 'Nova Traders', region: 'North', quarter: 'Q4', qty: 9, unitPrice: 260, discount: 0, status: 'Completed', returned: false },
    { id: 'ORD-218', customer: 'Pinnacle Tech', region: 'West', quarter: 'Q4', qty: 67, unitPrice: 195, discount: 860, status: 'Completed', returned: false },
    { id: 'ORD-219', customer: 'Zeta Innovations', region: 'South', quarter: 'Q4', qty: 53, unitPrice: 225, discount: 590, status: 'Completed', returned: true },
    { id: 'ORD-220', customer: 'Omega Labs', region: 'East', quarter: 'Q4', qty: 49, unitPrice: 215, discount: 480, status: 'Completed', returned: false }
  ],
  challenge: [
    { id: 'ORD-301', customer: 'Nexus Retail', region: 'North', quarter: 'Q1', qty: 44, unitPrice: 265, discount: 530, status: 'Completed', returned: false },
    { id: 'ORD-302', customer: 'Nexus Retail', region: 'North', quarter: 'Q1', qty: 44, unitPrice: 265, discount: 545, status: 'Completed', returned: false },
    { id: 'ORD-303', customer: 'Delta Logistics', region: 'West', quarter: 'Q1', qty: 62, unitPrice: 188, discount: 820, status: 'Completed', returned: false },
    { id: 'ORD-304', customer: 'Vertex Media', region: 'South', quarter: 'Q1', qty: 28, unitPrice: 310, discount: 265, status: 'Completed', returned: false },
    { id: 'ORD-305', customer: 'Orion Traders', region: 'North', quarter: 'Q1', qty: 24, unitPrice: 265, discount: 120, status: 'Completed', returned: false },
    { id: 'ORD-306', customer: 'Sigma Solutions', region: '', quarter: 'Q1', qty: 83, unitPrice: 158, discount: 1020, status: 'Completed', returned: false },
    { id: 'ORD-307', customer: 'Zeta Innovations', region: '', quarter: 'Q2', qty: 52, unitPrice: 228, discount: 615, status: 'Completed', returned: false },
    { id: 'ORD-308', customer: 'Pinnacle Tech', region: 'West', quarter: 'Q2', qty: 72, unitPrice: 198, discount: 915, status: 'Completed', returned: false },
    { id: 'ORD-309', customer: 'Quantum Dynamics', region: 'North', quarter: 'Q2', qty: 92, unitPrice: 308, discount: 2020, status: 'Cancelled', returned: false },
    { id: 'ORD-310', customer: 'Helios Freight', region: 'East', quarter: 'Q2', qty: 39, unitPrice: 178, discount: 385, status: 'Cancelled', returned: false },
    { id: 'ORD-311', customer: 'Crestline Media', region: 'South', quarter: 'Q2', qty: 21, unitPrice: 300, discount: 90, status: 'Cancelled', returned: false },
    { id: 'ORD-312', customer: 'Omega Labs', region: 'East', quarter: 'Q2', qty: 47, unitPrice: 218, discount: 465, status: 'Completed', returned: false },
    { id: 'ORD-313', customer: 'Apex Corp', region: 'North', quarter: 'Q3', qty: 16, unitPrice: 265, discount: 0, status: 'Completed', returned: false },
    { id: 'ORD-314', customer: 'Delta Logistics', region: 'West', quarter: 'Q3', qty: 60, unitPrice: 188, discount: 730, status: 'Completed', returned: false },
    { id: 'ORD-315', customer: 'Vertex Media', region: 'South', quarter: 'Q3', qty: 36, unitPrice: 310, discount: 275, status: 'Completed', returned: false },
    { id: 'ORD-316', customer: 'Sigma Solutions', region: 'East', quarter: 'Q3', qty: 78, unitPrice: 158, discount: 970, status: 'Completed', returned: false },
    { id: 'ORD-317', customer: 'Nova Traders', region: 'North', quarter: 'Q4', qty: 7, unitPrice: 265, discount: 0, status: 'Completed', returned: false },
    { id: 'ORD-318', customer: 'Pinnacle Tech', region: 'West', quarter: 'Q4', qty: 68, unitPrice: 198, discount: 870, status: 'Completed', returned: false },
    { id: 'ORD-319', customer: 'Zeta Innovations', region: 'South', quarter: 'Q4', qty: 54, unitPrice: 228, discount: 600, status: 'Completed', returned: true },
    { id: 'ORD-320', customer: 'Omega Labs', region: 'East', quarter: 'Q4', qty: 50, unitPrice: 218, discount: 490, status: 'Completed', returned: false }
  ]
};

type MissingRegionStrategy = 'leave_unresolved' | 'drop_record' | 'impute_mode' | 'lookup_profile';
type DuplicateStrategy = 'none' | 'exact_order_id' | 'customer_quarter_match';

interface AnalysisState {
  duplicateStrategy: DuplicateStrategy;
  missingRegionStrategy: MissingRegionStrategy;
  excludeCancelled: boolean;
  excludeReturns: boolean;
  groupDimension: 'region' | 'quarter' | 'customer';
  selectedRegionFilter: string;
}

const INITIAL_ANALYSIS: AnalysisState = {
  duplicateStrategy: 'none',
  missingRegionStrategy: 'leave_unresolved',
  excludeCancelled: false,
  excludeReturns: false,
  groupDimension: 'region',
  selectedRegionFilter: 'All'
};

function computeRevenue(o: OrderRecord): number {
  return Math.max(0, o.qty * o.unitPrice - o.discount);
}

export default function BusinessAnalystDeskLab({ variant, onDirty, onSubmit }: SimulatorProps) {
  const rawOrders = ORDER_POOLS[variant] || ORDER_POOLS.beginner;
  const { state, set, undo, redo, canUndo, canRedo } = useUndoableState<AnalysisState>(INITIAL_ANALYSIS);

  // Learner's own findings memo - starts empty so learner explains evidence themselves
  const [findingsMemo, setFindingsMemo] = useState('');

  const updateState = (patch: Partial<AnalysisState>) => {
    set(prev => ({ ...prev, ...patch }));
    onDirty();
  };

  // Duplicate candidates preview
  const duplicateCandidates = useMemo(() => {
    const seen = new Map<string, string>();
    const dupIds = new Set<string>();

    rawOrders.forEach(o => {
      const key = state.duplicateStrategy === 'exact_order_id'
        ? o.id
        : `${o.customer}_${o.quarter}_${o.qty}_${o.unitPrice}`;
      if (seen.has(key)) {
        dupIds.add(o.id);
      } else {
        seen.set(key, o.id);
      }
    });
    return dupIds;
  }, [rawOrders, state.duplicateStrategy]);

  // Cleaned orders calculation
  const cleanedOrders = useMemo(() => {
    let list = [...rawOrders];

    // Apply deduplication
    if (state.duplicateStrategy !== 'none') {
      const seen = new Set<string>();
      list = list.filter(o => {
        const key = state.duplicateStrategy === 'exact_order_id'
          ? o.id
          : `${o.customer}_${o.quarter}_${o.qty}_${o.unitPrice}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }

    // Apply cancelled filter
    if (state.excludeCancelled) {
      list = list.filter(o => o.status !== 'Cancelled');
    }

    // Apply returns filter
    if (state.excludeReturns) {
      list = list.filter(o => !o.returned);
    }

    // Apply missing region strategy
    if (state.missingRegionStrategy === 'drop_record') {
      list = list.filter(o => o.region !== '');
    } else if (state.missingRegionStrategy === 'impute_mode') {
      list = list.map(o => o.region === '' ? { ...o, region: 'East' } : o);
    } else if (state.missingRegionStrategy === 'lookup_profile') {
      list = list.map(o => o.region === '' ? { ...o, region: o.customer === 'Horizon Group' ? 'North' : 'West' } : o);
    }

    return list;
  }, [rawOrders, state]);

  // Metrics computation
  const metrics = useMemo(() => {
    const filtered = state.selectedRegionFilter === 'All'
      ? cleanedOrders
      : cleanedOrders.filter(o => o.region === state.selectedRegionFilter);

    const netRevenue = filtered.reduce((s, o) => s + computeRevenue(o), 0);
    const totalUnits = filtered.reduce((s, o) => s + o.qty, 0);

    const regionalRev: Record<string, number> = {};
    REGIONS.forEach(r => {
      regionalRev[r] = cleanedOrders.filter(o => o.region === r).reduce((s, o) => s + computeRevenue(o), 0);
    });

    const quarterlyRev: Record<string, number> = { Q1: 0, Q2: 0, Q3: 0, Q4: 0 };
    cleanedOrders.forEach(o => { quarterlyRev[o.quarter] += computeRevenue(o); });

    return {
      netRevenue,
      totalUnits,
      regionalRev,
      quarterlyRev,
      activeRowCount: filtered.length
    };
  }, [cleanedOrders, state.selectedRegionFilter]);

  const handleSubmit = () => {
    onSubmit({
      variant,
      cleaningState: state,
      calculatedNetRevenue: metrics.netRevenue,
      regionalRev: metrics.regionalRev,
      quarterlyRev: metrics.quarterlyRev,
      findingsMemo,
      identifiedNorthDecline: metrics.quarterlyRev.Q4 < metrics.quarterlyRev.Q1
    });
  };

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* ===================================================================== */}
      {/* CLEANING PIPELINE WORKBENCH                                           */}
      {/* ===================================================================== */}
      <div className="p-4 rounded-3xl bg-[#0f1325] border border-white/10 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-purple-400" />
            <span className="font-bold text-white text-sm">Data Cleaning &amp; Synthesis Workbench</span>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={undo} disabled={!canUndo} className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 border border-white/10 text-slate-300">
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button onClick={redo} disabled={!canRedo} className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 border border-white/10 text-slate-300">
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Cleaning Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Deduplication Strategy */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-semibold block">Deduplication Rule:</label>
            <select
              value={state.duplicateStrategy}
              onChange={(e) => updateState({ duplicateStrategy: e.target.value as DuplicateStrategy })}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-white"
            >
              <option value="none">None (Keep all rows)</option>
              <option value="customer_quarter_match">Match Customer + Quarter + Amount</option>
              <option value="exact_order_id">Exact Order ID only</option>
            </select>
          </div>

          {/* Missing Region Strategy */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-semibold block">Missing Region Strategy:</label>
            <select
              value={state.missingRegionStrategy}
              onChange={(e) => updateState({ missingRegionStrategy: e.target.value as MissingRegionStrategy })}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-white"
            >
              <option value="leave_unresolved">Leave Unresolved (Flag blanks)</option>
              <option value="lookup_profile">Lookup Customer Historical Region</option>
              <option value="impute_mode">Impute Regional Mode (East)</option>
              <option value="drop_record">Drop Incomplete Records</option>
            </select>
          </div>

          {/* Business Logic Filters */}
          <div className="space-y-1 sm:col-span-2 pt-1">
            <span className="text-[10px] text-slate-400 font-semibold block">Business Event Exclusions:</span>
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={state.excludeCancelled}
                  onChange={(e) => updateState({ excludeCancelled: e.target.checked })}
                  className="rounded accent-purple-600"
                />
                <span className="text-slate-300">Exclude Cancelled Orders</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={state.excludeReturns}
                  onChange={(e) => updateState({ excludeReturns: e.target.checked })}
                  className="rounded accent-purple-600"
                />
                <span className="text-slate-300">Exclude Returned Merchandise</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* ORDERS DATA GRID (ORIGINAL VS CLEANED PREVIEW)                        */}
      {/* ===================================================================== */}
      <div className="rounded-2xl bg-[#0b0e1b] border border-white/10 overflow-hidden shadow-2xl">
        <div className="p-3 bg-[#111425] border-b border-white/10 flex items-center justify-between">
          <span className="font-bold text-white text-xs flex items-center gap-1.5">
            Orders Dataset ({cleanedOrders.length} active rows after rules)
          </span>

          <button
            onClick={() => downloadCsv('cleaned_orders.csv', cleanedOrders as unknown as Record<string, unknown>[])}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-slate-300 flex items-center gap-1"
          >
            <Download className="w-3 h-3" />
            <span>Export Cleaned CSV</span>
          </button>
        </div>

        <div className="overflow-x-auto max-h-56">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="bg-[#12162a] border-b border-white/10 text-slate-400">
                <th className="p-2">Order ID</th>
                <th className="p-2">Customer</th>
                <th className="p-2">Region</th>
                <th className="p-2">Quarter</th>
                <th className="p-2">Qty</th>
                <th className="p-2">Price</th>
                <th className="p-2">Status</th>
                <th className="p-2">Net Revenue</th>
              </tr>
            </thead>
            <tbody>
              {cleanedOrders.map((o) => {
                const isDupCandidate = duplicateCandidates.has(o.id);
                const isMissingRegion = o.region === '';

                return (
                  <tr
                    key={o.id}
                    className={`border-b border-white/5 hover:bg-white/[0.02] ${
                      isDupCandidate ? 'bg-amber-500/10 text-amber-200' : isMissingRegion ? 'bg-red-500/10 text-red-200' : 'text-slate-300'
                    }`}
                  >
                    <td className="p-2 font-bold">{o.id}</td>
                    <td className="p-2">{o.customer}</td>
                    <td className="p-2">{o.region || <span className="text-red-400 italic font-bold">&lt;MISSING&gt;</span>}</td>
                    <td className="p-2">{o.quarter}</td>
                    <td className="p-2">{o.qty}</td>
                    <td className="p-2">₹{o.unitPrice}</td>
                    <td className="p-2">{o.status} {o.returned ? '(Returned)' : ''}</td>
                    <td className="p-2 text-purple-300 font-bold">₹{computeRevenue(o).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* LEARNER FINDINGS MEMO (BLANK BY DEFAULT - NO PREFILLED ANSWERS!)      */}
      {/* ===================================================================== */}
      <div className="p-4 rounded-2xl bg-[#0f1325] border border-white/10 space-y-2 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="font-bold text-white text-xs flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            Executive Findings Memo (Learner Authored Synthesis)
          </span>
          <span className="text-[10px] text-slate-500 italic">Support claims with cleaned calculations</span>
        </div>

        <textarea
          rows={3}
          value={findingsMemo}
          onChange={(e) => { setFindingsMemo(e.target.value); onDirty(); }}
          placeholder="State your analysis: What caused the revenue decline in the North region? Support your conclusion with quarterly figures..."
          className="w-full bg-black/40 border border-white/10 rounded-xl p-3 font-sans text-xs text-slate-200 focus:outline-none focus:border-purple-500/50"
        />
      </div>

      {/* ===================================================================== */}
      {/* SUBMISSION BAR                                                        */}
      {/* ===================================================================== */}
      <div className="p-4 rounded-2xl bg-[#0f1325] border border-white/10 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span>Net Revenue: <strong className="text-white font-mono">₹{metrics.netRevenue.toLocaleString()}</strong></span>
          <span>•</span>
          <span>North Q1 $\to$ Q4: <strong className="text-purple-300 font-mono">₹{metrics.quarterlyRev.Q1.toLocaleString()} $\to$ ₹{metrics.quarterlyRev.Q4.toLocaleString()}</strong></span>
        </div>

        <button
          onClick={handleSubmit}
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
        >
          <span>Submit Analysis Report</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
