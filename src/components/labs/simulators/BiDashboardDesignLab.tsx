'use client';

import React, { useMemo, useState } from 'react';
import { LabScenarioVariant, LabDifficulty } from '@/lib/labs/types';
import { useUndoableState } from '@/lib/labs/useUndoableState';
import { downloadJson } from '@/lib/labs/exportHelper';
import ChartFrame from '@/components/labs/charts/ChartFrame';
import CompareBarChart from '@/components/labs/charts/CompareBarChart';
import BreakdownDoughnutChart from '@/components/labs/charts/BreakdownDoughnutChart';
import {
  GitFork,
  Filter,
  Send,
  Sparkles,
  AlertTriangle,
  ChevronRight,
  Undo2,
  Redo2,
  RotateCcw,
  FileJson,
  BarChart3,
  PieChart as PieChartIcon,
  Users,
} from 'lucide-react';

interface SimulatorProps {
  scenario?: LabScenarioVariant;
  variant: LabDifficulty;
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

interface CustomerDim { custId: string; name: string; segment: string; }
interface ProductDim { prodId: string; name: string; }
interface SalesFact { orderId: string; custId: string; prodId: string; revenue: number; cost: number; }

// Three prepared sales tables (Customers dimension, Products dimension, Sales
// fact) per tier. Every tier already contains a duplicate customer key row
// (from beginner onward, matching the reference lab's philosophy) — higher
// tiers add more instances, a legitimately-distinct look-alike customer, a
// duplicated product key, and an orphan fact row with no matching dimension.
const CUSTOMERS: Record<LabDifficulty, CustomerDim[]> = {
  beginner: [
    { custId: 'C-01', name: 'Nexus Retail', segment: 'Enterprise' },
    { custId: 'C-01', name: 'Nexus Retail', segment: 'Enterprise' }, // exact duplicate signup
    { custId: 'C-02', name: 'Bright Mart', segment: 'Mid-Market' },
    { custId: 'C-03', name: 'Orbit Traders', segment: 'Enterprise' },
    { custId: 'C-04', name: 'Fern SMB Co', segment: 'SMB' },
  ],
  intermediate: [
    { custId: 'C-01', name: 'Nexus Retail', segment: 'Enterprise' },
    { custId: 'C-01', name: 'Nexus Retail', segment: 'Enterprise' }, // exact duplicate
    { custId: 'C-02', name: 'Bright Mart', segment: 'Mid-Market' },
    { custId: 'C-03', name: 'Orbit Traders', segment: 'Enterprise' },
    { custId: 'C-04', name: 'Fern SMB Co', segment: 'SMB' },
    { custId: 'C-05', name: 'Nexus Retail Group', segment: 'Enterprise' }, // legitimately distinct — NOT a duplicate
    { custId: 'C-06', name: 'Solstice Partners', segment: 'Mid-Market' }, // zero sales
  ],
  challenge: [
    { custId: 'C-01', name: 'Nexus Retail', segment: 'Enterprise' },
    { custId: 'C-01', name: 'Nexus Retail', segment: 'Enterprise' }, // exact duplicate
    { custId: 'C-01', name: 'Nexus Retai', segment: 'Enterprise' }, // near-duplicate typo, same key — trickier to spot
    { custId: 'C-02', name: 'Bright Mart', segment: 'Mid-Market' },
    { custId: 'C-03', name: 'Orbit Traders', segment: 'Enterprise' },
    { custId: 'C-04', name: 'Fern SMB Co', segment: 'SMB' },
    { custId: 'C-05', name: 'Nexus Retail Group', segment: 'Enterprise' }, // legitimately distinct
    { custId: 'C-06', name: 'Solstice Partners', segment: 'Mid-Market' }, // zero sales
    { custId: 'C-07', name: 'Vale Systems', segment: 'Enterprise' }, // zero sales
  ],
};

const PRODUCTS: Record<LabDifficulty, ProductDim[]> = {
  beginner: [
    { prodId: 'P-01', name: 'Widget Pro' },
    { prodId: 'P-02', name: 'Widget Lite' },
    { prodId: 'P-03', name: 'Widget Max' },
  ],
  intermediate: [
    { prodId: 'P-01', name: 'Widget Pro' },
    { prodId: 'P-02', name: 'Widget Lite' },
    { prodId: 'P-03', name: 'Widget Max' },
    { prodId: 'P-04', name: 'Widget Nano' },
  ],
  challenge: [
    { prodId: 'P-01', name: 'Widget Pro' },
    { prodId: 'P-01', name: 'Widget Pro' }, // duplicate product key — compounds fan-out risk
    { prodId: 'P-02', name: 'Widget Lite' },
    { prodId: 'P-03', name: 'Widget Max' },
    { prodId: 'P-04', name: 'Widget Nano' },
    { prodId: 'P-05', name: 'Widget Ultra' },
  ],
};

const SALES: Record<LabDifficulty, SalesFact[]> = {
  beginner: [
    { orderId: 'S-01', custId: 'C-01', prodId: 'P-01', revenue: 12000, cost: 8000 },
    { orderId: 'S-02', custId: 'C-02', prodId: 'P-02', revenue: 5000, cost: 3500 },
    { orderId: 'S-03', custId: 'C-01', prodId: 'P-03', revenue: 9000, cost: 5000 },
    { orderId: 'S-04', custId: 'C-03', prodId: 'P-01', revenue: 15000, cost: 9500 },
    { orderId: 'S-05', custId: 'C-04', prodId: 'P-02', revenue: 4000, cost: 2800 },
  ],
  intermediate: [
    { orderId: 'S-01', custId: 'C-01', prodId: 'P-01', revenue: 12000, cost: 8000 },
    { orderId: 'S-02', custId: 'C-02', prodId: 'P-02', revenue: 5000, cost: 3500 },
    { orderId: 'S-03', custId: 'C-01', prodId: 'P-03', revenue: 9000, cost: 5000 },
    { orderId: 'S-04', custId: 'C-03', prodId: 'P-01', revenue: 15000, cost: 9500 },
    { orderId: 'S-05', custId: 'C-04', prodId: 'P-02', revenue: 4000, cost: 2800 },
    { orderId: 'S-06', custId: 'C-05', prodId: 'P-04', revenue: 7000, cost: 4200 },
    { orderId: 'S-07', custId: 'C-02', prodId: 'P-04', revenue: 3000, cost: 1900 },
  ],
  challenge: [
    { orderId: 'S-01', custId: 'C-01', prodId: 'P-01', revenue: 12000, cost: 8000 },
    { orderId: 'S-02', custId: 'C-02', prodId: 'P-02', revenue: 5000, cost: 3500 },
    { orderId: 'S-03', custId: 'C-01', prodId: 'P-03', revenue: 9000, cost: 5000 },
    { orderId: 'S-04', custId: 'C-03', prodId: 'P-01', revenue: 15000, cost: 9500 },
    { orderId: 'S-05', custId: 'C-04', prodId: 'P-02', revenue: 4000, cost: 2800 },
    { orderId: 'S-06', custId: 'C-05', prodId: 'P-04', revenue: 7000, cost: 4200 },
    { orderId: 'S-07', custId: 'C-02', prodId: 'P-04', revenue: 3000, cost: 1900 },
    { orderId: 'S-08', custId: 'C-09', prodId: 'P-02', revenue: 6000, cost: 4000 }, // orphan: C-09 does not exist in the customer dimension
    { orderId: 'S-09', custId: 'C-03', prodId: 'P-05', revenue: 11000, cost: 7000 },
  ],
};

const SEGMENTS = ['All', 'Enterprise', 'Mid-Market', 'SMB', 'Government'] as const; // "Government" is a deliberate zero-match filter

type KeyMode = 'DEDUPED' | 'RAW_DUPLICATES';
type MeasureId = 'totalSales' | 'marginPct' | 'distinctCustomers' | 'distinctProducts';

interface BiState {
  customerKeyMode: KeyMode;
  productKeyMode: KeyMode;
  activeFilterSegment: (typeof SEGMENTS)[number];
  selectedMeasures: Record<MeasureId, boolean>;
  drillPath: string[]; // ['All'] or ['All', segment] or ['All', segment, customerName]
}

const INITIAL_STATE: BiState = {
  customerKeyMode: 'RAW_DUPLICATES',
  productKeyMode: 'RAW_DUPLICATES',
  activeFilterSegment: 'All',
  selectedMeasures: { totalSales: true, marginPct: true, distinctCustomers: true, distinctProducts: false },
  drillPath: ['All'],
};

interface JoinedRow { orderId: string; custName: string; segment: string; prodName: string; revenue: number; cost: number; }

function joinSales(sales: SalesFact[], customers: CustomerDim[], products: ProductDim[], customerKeyMode: KeyMode, productKeyMode: KeyMode): JoinedRow[] {
  const rows: JoinedRow[] = [];
  sales.forEach((s) => {
    const custMatches = customers.filter((c) => c.custId === s.custId);
    if (custMatches.length === 0) return; // orphan fact row — no valid customer to attribute to
    const custRows = customerKeyMode === 'DEDUPED' ? custMatches.slice(0, 1) : custMatches;
    const prodMatches = products.filter((p) => p.prodId === s.prodId);
    const prodRows = prodMatches.length === 0 ? [{ prodId: s.prodId, name: 'Unknown Product' }] : (productKeyMode === 'DEDUPED' ? prodMatches.slice(0, 1) : prodMatches);
    custRows.forEach((c) => prodRows.forEach((p) => rows.push({ orderId: s.orderId, custName: c.name, segment: c.segment, prodName: p.name, revenue: s.revenue, cost: s.cost })));
  });
  return rows;
}

function capToSix(labels: string[], values: number[]): { labels: string[]; values: number[] } {
  if (labels.length <= 6) return { labels, values };
  const pairs = labels.map((l, i) => ({ l, v: values[i] })).sort((a, b) => b.v - a.v);
  const top = pairs.slice(0, 5);
  const restTotal = pairs.slice(5).reduce((s, p) => s + p.v, 0);
  return { labels: [...top.map((p) => p.l), 'Other'], values: [...top.map((p) => p.v), restTotal] };
}

export default function BiDashboardDesignLab({ variant, onDirty, onSubmit }: SimulatorProps) {
  const customers = CUSTOMERS[variant];
  const products = PRODUCTS[variant];
  const sales = SALES[variant];

  const { state, set, undo, redo, reset, canUndo, canRedo, stepIndex } = useUndoableState<BiState>(INITIAL_STATE);
  const [biObservations, setBiObservations] = useState(
    '1. Enterprise is the highest-revenue segment once duplicate customer signups are deduplicated — raw many-to-many joins overstate it.\n2. A correctly keyed 1:many model preserves total fact-table revenue exactly; only the duplicate/near-duplicate dimension keys change the number.'
  );

  const update = (patch: Partial<BiState>) => {
    set((prev) => ({ ...prev, ...patch }));
    onDirty();
  };

  const hasDuplicateCustomerKeys = useMemo(() => {
    const counts: Record<string, number> = {};
    customers.forEach((c) => { counts[c.custId] = (counts[c.custId] || 0) + 1; });
    return Object.values(counts).some((n) => n > 1);
  }, [customers]);
  const hasDuplicateProductKeys = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => { counts[p.prodId] = (counts[p.prodId] || 0) + 1; });
    return Object.values(counts).some((n) => n > 1);
  }, [products]);

  const joinedAll = useMemo(() => joinSales(sales, customers, products, state.customerKeyMode, state.productKeyMode), [sales, customers, products, state.customerKeyMode, state.productKeyMode]);

  const correctTotalRevenue = useMemo(() => {
    return sales.filter((s) => customers.some((c) => c.custId === s.custId)).reduce((sum, s) => sum + s.revenue, 0);
  }, [sales, customers]);

  const activeSegment = state.drillPath[1];
  const filteredJoined = useMemo(() => {
    let rows = joinedAll;
    if (state.activeFilterSegment !== 'All') rows = rows.filter((r) => r.segment === state.activeFilterSegment);
    if (activeSegment) rows = rows.filter((r) => r.segment === activeSegment);
    return rows;
  }, [joinedAll, state.activeFilterSegment, activeSegment]);

  const kpis = useMemo(() => {
    const totalSales = filteredJoined.reduce((s, r) => s + r.revenue, 0);
    const totalCost = filteredJoined.reduce((s, r) => s + r.cost, 0);
    const profit = totalSales - totalCost;
    const marginPct = totalSales > 0 ? Math.round((profit / totalSales) * 100) : 0;
    const distinctCustomers = new Set(filteredJoined.map((r) => r.custName)).size;
    const distinctProducts = new Set(filteredJoined.map((r) => r.prodName)).size;
    return { totalSales, profit, marginPct, distinctCustomers, distinctProducts };
  }, [filteredJoined]);

  const computedTotalRevenue = useMemo(() => joinedAll.reduce((s, r) => s + r.revenue, 0), [joinedAll]);
  const relationshipCorrect = computedTotalRevenue === correctTotalRevenue;

  // Level 0: revenue by segment. Level 1 (drilled into a segment): revenue by customer within it.
  const chartData = useMemo(() => {
    if (activeSegment) {
      const names = Array.from(new Set(filteredJoined.map((r) => r.custName)));
      return { labels: names, values: names.map((n) => filteredJoined.filter((r) => r.custName === n).reduce((s, r) => s + r.revenue, 0)) };
    }
    const segs = SEGMENTS.filter((s) => s !== 'All');
    const base = state.activeFilterSegment === 'All' ? joinedAll : joinedAll.filter((r) => r.segment === state.activeFilterSegment);
    return { labels: segs, values: segs.map((s) => base.filter((r) => r.segment === s).reduce((sum, r) => sum + r.revenue, 0)) };
  }, [activeSegment, filteredJoined, joinedAll, state.activeFilterSegment]);

  const productShare = useMemo(() => {
    const names = Array.from(new Set(filteredJoined.map((r) => r.prodName)));
    return capToSix(names, names.map((n) => filteredJoined.filter((r) => r.prodName === n).reduce((s, r) => s + r.revenue, 0)));
  }, [filteredJoined]);

  const drillInto = (segment: string) => { update({ drillPath: ['All', segment] }); };
  const drillReset = () => { update({ drillPath: ['All'] }); };

  const requiredMeasuresOk = state.selectedMeasures.totalSales && state.selectedMeasures.marginPct && state.selectedMeasures.distinctCustomers;

  const handleExportJson = () => {
    downloadJson('bi_dashboard_config.json', {
      variant,
      relationships: { customerKeyMode: state.customerKeyMode, productKeyMode: state.productKeyMode },
      measures: state.selectedMeasures,
      activeFilterSegment: state.activeFilterSegment,
      drillPath: state.drillPath,
      kpis,
      biObservations,
    });
  };

  const handleSubmit = () => {
    onSubmit({
      variant,
      customerKeyMode: state.customerKeyMode,
      productKeyMode: state.productKeyMode,
      activeFilterSegment: state.activeFilterSegment,
      selectedMeasures: state.selectedMeasures,
      drillPath: state.drillPath,
      computedTotalRevenue,
      correctTotalRevenue,
      marginPct: kpis.marginPct,
      distinctCustomers: kpis.distinctCustomers,
      biObservations,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Executive KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {state.selectedMeasures.totalSales && (
          <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
            <span className="text-xs text-slate-400 font-semibold block mb-1">Total Sales Measure</span>
            <span className="text-xl font-black text-white">₹{kpis.totalSales.toLocaleString()}</span>
            <span className="text-[10px] text-emerald-400 block mt-0.5">SUM(Sales[Revenue])</span>
          </div>
        )}
        {state.selectedMeasures.marginPct && (
          <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
            <span className="text-xs text-slate-400 font-semibold block mb-1">Profit Margin %</span>
            <span className="text-xl font-black text-purple-300">{kpis.marginPct}%</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">₹{kpis.profit.toLocaleString()} Gross Profit</span>
          </div>
        )}
        {state.selectedMeasures.distinctCustomers && (
          <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
            <span className="text-xs text-slate-400 font-semibold block mb-1">Distinct Customers</span>
            <span className="text-xl font-black text-indigo-300">{kpis.distinctCustomers}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">DISTINCTCOUNT(CustID)</span>
          </div>
        )}
        {state.selectedMeasures.distinctProducts && (
          <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
            <span className="text-xs text-slate-400 font-semibold block mb-1">Distinct Products</span>
            <span className="text-xl font-black text-cyan-300">{kpis.distinctProducts}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">DISTINCTCOUNT(ProdID)</span>
          </div>
        )}
        <div className={`p-4 rounded-2xl border ${relationshipCorrect ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-amber-950/20 border-amber-500/30'}`}>
          <span className="text-xs font-bold block mb-1 text-slate-300">Model Integrity</span>
          <span className={`text-base font-black ${relationshipCorrect ? 'text-emerald-400' : 'text-amber-400'}`}>
            {relationshipCorrect ? 'Revenue Preserved' : 'Inflated by Fan-Out'}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">₹{computedTotalRevenue.toLocaleString()} vs expected ₹{correctTotalRevenue.toLocaleString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: relationship canvas, filters, breadcrumbs, table */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
                <GitFork className="w-4 h-4 text-purple-400" />
                <span>1. Semantic Model Relationship Canvas</span>
              </h2>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={undo} disabled={!canUndo} title="Undo" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30"><Undo2 className="w-3.5 h-3.5" /></button>
                <button type="button" onClick={redo} disabled={!canRedo} title="Redo" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30"><Redo2 className="w-3.5 h-3.5" /></button>
                <button type="button" onClick={() => { reset(); onDirty(); }} title="Reset model" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white"><RotateCcw className="w-3.5 h-3.5" /></button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 flex-wrap py-1 text-[10px] font-mono text-slate-400">
              <div className="p-2 rounded-lg bg-white/5 border border-white/10">customers ({customers.length} rows)</div>
              <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
              <div className="p-2 rounded-lg bg-white/5 border border-white/10">sales ({sales.length} rows)</div>
              <ChevronRight className="w-3.5 h-3.5 text-purple-400 rotate-180" />
              <div className="p-2 rounded-lg bg-white/5 border border-white/10">products ({products.length} rows)</div>
            </div>

            {(hasDuplicateCustomerKeys || hasDuplicateProductKeys) && (
              <div className="flex items-start gap-1.5 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>Duplicate keys detected in {hasDuplicateCustomerKeys && hasDuplicateProductKeys ? 'both dimension tables' : hasDuplicateCustomerKeys ? 'the customer dimension' : 'the product dimension'}. A &quot;raw&quot; (many-to-many) relationship will fan out and inflate revenue.</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-xs font-semibold text-slate-200 block">Customers &rarr; Sales Key</span>
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  <button type="button" onClick={() => update({ customerKeyMode: 'DEDUPED' })} className={`p-2 rounded-lg border font-bold ${state.customerKeyMode === 'DEDUPED' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200' : 'bg-white/5 border-white/10 text-slate-400'}`}>1:Many (deduped)</button>
                  <button type="button" onClick={() => update({ customerKeyMode: 'RAW_DUPLICATES' })} className={`p-2 rounded-lg border font-bold ${state.customerKeyMode === 'RAW_DUPLICATES' ? 'bg-amber-500/20 border-amber-500/50 text-amber-200' : 'bg-white/5 border-white/10 text-slate-400'}`}>Many:Many (raw)</button>
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-xs font-semibold text-slate-200 block">Products &rarr; Sales Key</span>
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  <button type="button" onClick={() => update({ productKeyMode: 'DEDUPED' })} className={`p-2 rounded-lg border font-bold ${state.productKeyMode === 'DEDUPED' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200' : 'bg-white/5 border-white/10 text-slate-400'}`}>1:Many (deduped)</button>
                  <button type="button" onClick={() => update({ productKeyMode: 'RAW_DUPLICATES' })} className={`p-2 rounded-lg border font-bold ${state.productKeyMode === 'RAW_DUPLICATES' ? 'bg-amber-500/20 border-amber-500/50 text-amber-200' : 'bg-white/5 border-white/10 text-slate-400'}`}>Many:Many (raw)</button>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-semibold text-slate-300 block flex items-center gap-1.5"><Filter className="w-3.5 h-3.5 text-purple-400" /><span>Cross-Filtering Segment Slicer:</span></span>
              <div className="flex flex-wrap gap-2">
                {SEGMENTS.map((seg) => (
                  <button key={seg} type="button" onClick={() => update({ activeFilterSegment: seg })}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${state.activeFilterSegment === seg ? 'bg-purple-600 text-white border-purple-500' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}>
                    {seg}
                  </button>
                ))}
              </div>
              {state.activeFilterSegment === 'Government' && (
                <p className="text-[11px] text-amber-300">No customers belong to the &quot;Government&quot; segment in this fixture — every linked view should gracefully show zero, not an error.</p>
              )}
            </div>

            {/* Drill-down breadcrumbs */}
            <div className="flex items-center gap-1.5 text-[11px] font-bold">
              <button type="button" onClick={drillReset} className={`px-2 py-1 rounded-lg ${!activeSegment ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white'}`}>All Segments</button>
              {activeSegment && (<><ChevronRight className="w-3 h-3 text-slate-500" /><span className="px-2 py-1 rounded-lg bg-purple-600 text-white">{activeSegment}</span></>)}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">Sales Fact Table ({filteredJoined.length} joined rows)</h3>
            <div className="overflow-x-auto max-h-56 overflow-y-auto rounded-xl border border-white/5">
              <table className="w-full text-left text-xs border-collapse">
                <thead><tr className="border-b border-white/10 text-slate-400 text-[11px] bg-white/5 sticky top-0"><th className="p-2">Order</th><th className="p-2">Customer</th><th className="p-2">Segment</th><th className="p-2">Product</th><th className="p-2 text-right">Revenue</th><th className="p-2 text-right">Cost</th></tr></thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {filteredJoined.map((r, i) => (
                    <tr key={i} className="hover:bg-white/5">
                      <td className="p-2 text-purple-300 font-bold">{r.orderId}</td>
                      <td className="p-2 text-slate-300 font-sans cursor-pointer hover:text-white" onClick={() => drillInto(r.segment)}>{r.custName}</td>
                      <td className="p-2 font-sans">{r.segment}</td>
                      <td className="p-2 font-sans">{r.prodName}</td>
                      <td className="p-2 text-right font-bold text-white">₹{r.revenue.toLocaleString()}</td>
                      <td className="p-2 text-right text-slate-400">₹{r.cost.toLocaleString()}</td>
                    </tr>
                  ))}
                  {filteredJoined.length === 0 && (<tr><td colSpan={6} className="p-3 text-slate-500 italic">No matching records for this filter.</td></tr>)}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: measure builder, charts, observations, submit */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-2"><Users className="w-4 h-4 text-purple-400" /><span>2. Measure Template Builder</span></h3>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {([
                ['totalSales', 'SUM(Revenue)'],
                ['marginPct', 'DIVIDE(Profit, Sales)'],
                ['distinctCustomers', 'DISTINCTCOUNT(CustID)'],
                ['distinctProducts', 'DISTINCTCOUNT(ProdID)'],
              ] as const).map(([key, label]) => (
                <button key={key} type="button" onClick={() => update({ selectedMeasures: { ...state.selectedMeasures, [key]: !state.selectedMeasures[key] } })}
                  className={`p-2.5 rounded-xl border font-mono font-bold text-left transition-all ${state.selectedMeasures[key] ? 'bg-purple-600/30 border-purple-500/50 text-white' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                  {label}
                </button>
              ))}
            </div>
            {!requiredMeasuresOk && <p className="text-[10px] text-amber-400">Mission requires Sales, Margin and Distinct Customers on the dashboard.</p>}
          </div>

          <ChartFrame
            title={activeSegment ? `Revenue by Customer — ${activeSegment}` : 'Revenue by Segment'}
            icon={<BarChart3 className="w-4 h-4 text-purple-400" />}
            tableHeaders={['Group', 'Revenue']}
            tableRows={chartData.labels.map((l, i) => [l, chartData.values[i]])}
          >
            <CompareBarChart labels={chartData.labels} series={[{ label: 'Revenue', data: chartData.values }]} yLabel="Revenue (₹)" />
          </ChartFrame>

          <ChartFrame
            title="Revenue Share by Product"
            icon={<PieChartIcon className="w-4 h-4 text-purple-400" />}
            tableHeaders={['Product', 'Revenue']}
            tableRows={productShare.labels.map((l, i) => [l, productShare.values[i]])}
          >
            <BreakdownDoughnutChart labels={productShare.labels} values={productShare.values} centerLabel="Total" centerValue={`₹${kpis.totalSales.toLocaleString()}`} />
          </ChartFrame>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-2">
            <label htmlFor="bi-observations" className="text-xs font-extrabold text-white flex items-center gap-2"><Sparkles className="w-3.5 h-3.5 text-purple-400" /><span>3. Executive Business Observations</span></label>
            <textarea id="bi-observations" rows={4} value={biObservations} onChange={(e) => { setBiObservations(e.target.value); onDirty(); }}
              className="w-full text-xs p-3 rounded-xl bg-black/30 border border-white/15 text-slate-200 focus:outline-none focus:border-purple-500/50" />
          </div>

          <button type="button" onClick={handleExportJson} className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] font-bold"><FileJson className="w-3.5 h-3.5" /><span>Export Dashboard JSON</span></button>

          <div className="p-3 rounded-xl bg-black/30 border border-white/10 text-[10px] text-slate-500 font-mono">History step {stepIndex} · BI concepts simulator — not a Power BI embed, DAX execution engine or PBIX export.</div>

          <button type="button" onClick={handleSubmit} className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold transition-all flex items-center justify-center gap-2">
            <Send className="w-4 h-4" />
            <span>Submit BI Dashboard Configuration</span>
          </button>
        </div>
      </div>
    </div>
  );
}
