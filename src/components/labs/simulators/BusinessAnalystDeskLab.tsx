'use client';

import React, { useState, useMemo } from 'react';
import { LabScenarioVariant, LabDifficulty } from '@/lib/labs/types';
import { 
  Database, 
  Filter, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp, 
  BarChart3, 
  RotateCcw, 
  Send,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

interface SimulatorProps {
  scenario?: LabScenarioVariant;
  variant: LabDifficulty;
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

// Initial 12 representative synthetic order records from the 300 orders pool
const initialOrders = [
  { id: 'ORD-101', customer: 'Nexus Retail', region: 'North', period: 'Q1', qty: 40, unitPrice: 250, discount: 500, status: 'Completed' },
  { id: 'ORD-102', customer: 'Delta Logistics', region: 'West', period: 'Q1', qty: 60, unitPrice: 180, discount: 800, status: 'Completed' },
  { id: 'ORD-103', customer: 'Vertex Media', region: 'South', period: 'Q1', qty: 25, unitPrice: 300, discount: 250, status: 'Completed' },
  { id: 'ORD-104', customer: 'Apex Corp', region: 'North', period: 'Q2', qty: 15, unitPrice: 250, discount: 0, status: 'Completed' }, // North decline!
  { id: 'ORD-105', customer: 'Sigma Solutions', region: 'East', period: 'Q1', qty: 80, unitPrice: 150, discount: 1000, status: 'Completed' },
  { id: 'ORD-106', customer: 'Nexus Retail', region: 'North', period: 'Q1', qty: 40, unitPrice: 250, discount: 500, status: 'Completed' }, // DUPLICATE OF ORD-101!
  { id: 'ORD-107', customer: 'Zeta Innovations', region: 'South', period: 'Q2', qty: 50, unitPrice: 220, discount: 600, status: 'Completed' },
  { id: 'ORD-108', customer: 'Pinnacle Tech', region: 'West', period: 'Q2', qty: 70, unitPrice: 190, discount: 900, status: 'Completed' },
  { id: 'ORD-109', customer: 'Horizon Group', region: '', period: 'Q2', qty: 35, unitPrice: 240, discount: 400, status: 'Completed' }, // BLANK REGION!
  { id: 'ORD-110', customer: 'Quantum Dynamics', region: 'North', period: 'Q2', qty: 90, unitPrice: 300, discount: 2000, status: 'Cancelled' }, // CANCELLED ORDER!
  { id: 'ORD-111', customer: 'Omega Labs', region: 'East', period: 'Q2', qty: 45, unitPrice: 210, discount: 450, status: 'Completed' },
  { id: 'ORD-112', customer: 'Aura Systems', region: 'South', period: 'Q2', qty: 30, unitPrice: 280, discount: 300, status: 'Completed' },
];

export default function BusinessAnalystDeskLab({
  scenario,
  variant,
  onDirty,
  onSubmit
}: SimulatorProps) {
  // Cleaning pipeline toggles
  const [removeDuplicates, setRemoveDuplicates] = useState(false);
  const [excludeCancelled, setExcludeCancelled] = useState(false);
  const [imputeBlankRegion, setImputeBlankRegion] = useState(false);

  // Grouping and period filters
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedPeriod, setSelectedPeriod] = useState('All');

  // Findings memo
  const [findingsMemo, setFindingsMemo] = useState(
    'Identified that falling North regional revenue in Q2 was caused by supply churn at Apex Corp, aggravated by a cancelled high-value order (ORD-110). Removed duplicate record ORD-106 to prevent double-counting.'
  );

  // Filtered and processed orders
  const cleanedOrders = useMemo(() => {
    let list = [...initialOrders];

    // Step 1: Remove duplicates
    if (removeDuplicates) {
      const seen = new Set<string>();
      list = list.filter(item => {
        const key = `${item.customer}_${item.period}_${item.qty}_${item.unitPrice}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }

    // Step 2: Exclude cancelled
    if (excludeCancelled) {
      list = list.filter(item => item.status !== 'Cancelled');
    }

    // Step 3: Handle blank region
    if (imputeBlankRegion) {
      list = list.map(item => item.region === '' ? { ...item, region: 'East' } : item);
    }

    return list;
  }, [removeDuplicates, excludeCancelled, imputeBlankRegion]);

  // Aggregates calculation: Revenue = Qty * Price - Discount
  const metrics = useMemo(() => {
    let displayed = cleanedOrders;
    if (selectedRegion !== 'All') {
      displayed = displayed.filter(o => o.region === selectedRegion);
    }
    if (selectedPeriod !== 'All') {
      displayed = displayed.filter(o => o.period === selectedPeriod);
    }

    const totalOrders = displayed.length;
    const totalUnits = displayed.reduce((acc, o) => acc + o.qty, 0);
    const grossRevenue = displayed.reduce((acc, o) => acc + (o.qty * o.unitPrice), 0);
    const totalDiscount = displayed.reduce((acc, o) => acc + o.discount, 0);
    const netRevenue = grossRevenue - totalDiscount;

    // Regional breakdown for bar chart
    const regions = ['North', 'West', 'South', 'East'];
    const regionalRev: Record<string, number> = {};
    regions.forEach(r => {
      regionalRev[r] = displayed
        .filter(o => o.region === r)
        .reduce((sum, o) => sum + (o.qty * o.unitPrice - o.discount), 0);
    });

    return {
      totalOrders,
      totalUnits,
      netRevenue,
      regionalRev
    };
  }, [cleanedOrders, selectedRegion, selectedPeriod]);

  const handleSubmit = () => {
    onSubmit({
      removeDuplicates,
      excludeCancelled,
      imputeBlankRegion,
      selectedRegion,
      selectedPeriod,
      calculatedRevenue: metrics.netRevenue,
      findingsMemo
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Total Valid Orders</span>
          <span className="text-xl font-black text-white">{metrics.totalOrders}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Records in active view</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Total Units Sold</span>
          <span className="text-xl font-black text-indigo-300">{metrics.totalUnits} units</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Sum of ordered quantities</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#131728] border border-purple-500/30 bg-purple-950/20">
          <span className="text-xs text-purple-300 font-bold block mb-1">Clean Net Revenue</span>
          <span className="text-xl font-black text-purple-200">₹{metrics.netRevenue.toLocaleString()}</span>
          <span className="text-[10px] text-emerald-400 block mt-0.5">Qty × Price − Discount</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Pipeline Health</span>
          <span className="text-xl font-black text-emerald-400">
            {removeDuplicates && excludeCancelled && imputeBlankRegion ? 'Cleaned' : 'Action Req'}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {[removeDuplicates, excludeCancelled, imputeBlankRegion].filter(Boolean).length}/3 steps applied
          </span>
        </div>
      </div>

      {/* Main Grid: Data Cleaning Pipeline & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Cols: Cleaning Recipe & Linked Orders Grid */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Cleaning Pipeline Controls */}
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Filter className="w-4 h-4 text-purple-400" />
                <span>1. Data Cleaning Recipe &amp; Pipeline</span>
              </h2>
              <span className="text-xs text-slate-400">Deterministic Allowlist</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => { setRemoveDuplicates(!removeDuplicates); onDirty(); }}
                className={`p-3 rounded-2xl border text-xs font-bold text-left transition-all cursor-pointer flex flex-col justify-between gap-1 ${
                  removeDuplicates 
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200' 
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <span>Deduplicate</span>
                <span className="text-[10px] font-normal text-slate-400">Remove duplicate orders (ORD-106)</span>
              </button>

              <button
                type="button"
                onClick={() => { setExcludeCancelled(!excludeCancelled); onDirty(); }}
                className={`p-3 rounded-2xl border text-xs font-bold text-left transition-all cursor-pointer flex flex-col justify-between gap-1 ${
                  excludeCancelled 
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200' 
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <span>Filter Cancelled</span>
                <span className="text-[10px] font-normal text-slate-400">Exclude cancelled orders from revenue</span>
              </button>

              <button
                type="button"
                onClick={() => { setImputeBlankRegion(!imputeBlankRegion); onDirty(); }}
                className={`p-3 rounded-2xl border text-xs font-bold text-left transition-all cursor-pointer flex flex-col justify-between gap-1 ${
                  imputeBlankRegion 
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200' 
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <span>Impute Missing</span>
                <span className="text-[10px] font-normal text-slate-400">Assign blank region to East</span>
              </button>
            </div>
          </div>

          {/* Linked Data Grid */}
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                Orders Data Grid ({cleanedOrders.length} Records)
              </h3>
              <div className="flex items-center gap-2">
                <select
                  value={selectedRegion}
                  onChange={(e) => { setSelectedRegion(e.target.value); onDirty(); }}
                  className="text-[11px] font-bold px-2 py-1 rounded-lg bg-black/40 border border-white/15 text-slate-300"
                >
                  <option value="All">All Regions</option>
                  <option value="North">North</option>
                  <option value="West">West</option>
                  <option value="South">South</option>
                  <option value="East">East</option>
                </select>

                <select
                  value={selectedPeriod}
                  onChange={(e) => { setSelectedPeriod(e.target.value); onDirty(); }}
                  className="text-[11px] font-bold px-2 py-1 rounded-lg bg-black/40 border border-white/15 text-slate-300"
                >
                  <option value="All">All Periods</option>
                  <option value="Q1">Q1</option>
                  <option value="Q2">Q2</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto max-h-72 overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 text-[11px]">
                    <th className="p-2">ID</th>
                    <th className="p-2">Customer</th>
                    <th className="p-2">Region</th>
                    <th className="p-2">Period</th>
                    <th className="p-2">Qty</th>
                    <th className="p-2">Unit Price</th>
                    <th className="p-2">Discount</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {cleanedOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-2 font-mono text-purple-300">{o.id}</td>
                      <td className="p-2 font-semibold text-white">{o.customer}</td>
                      <td className="p-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          o.region === '' ? 'bg-red-500/20 text-red-300' : 'bg-white/10 text-slate-300'
                        }`}>
                          {o.region || 'BLANK'}
                        </span>
                      </td>
                      <td className="p-2 text-slate-300">{o.period}</td>
                      <td className="p-2 font-mono">{o.qty}</td>
                      <td className="p-2 font-mono">₹{o.unitPrice}</td>
                      <td className="p-2 font-mono text-amber-300">₹{o.discount}</td>
                      <td className="p-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          o.status === 'Cancelled' ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right 5 Cols: Visualizations, Findings Memo & Submit */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Regional Revenue Bars */}
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <span>Regional Revenue Performance</span>
            </h3>

            <div className="space-y-2 text-xs">
              {Object.entries(metrics.regionalRev).map(([reg, rev]) => (
                <div key={reg}>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>{reg} Region</span>
                    <span className="font-bold text-purple-300">₹{rev.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden">
                    <div 
                      className={`h-full ${reg === 'North' ? 'bg-amber-500' : 'bg-purple-500'}`} 
                      style={{ width: `${metrics.netRevenue ? (rev / metrics.netRevenue) * 100 : 0}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Findings Memo */}
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-2">
            <label htmlFor="findings-memo" className="text-xs font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Executive Findings &amp; Root Cause Memo</span>
            </label>
            <textarea
              id="findings-memo"
              rows={4}
              value={findingsMemo}
              onChange={(e) => { setFindingsMemo(e.target.value); onDirty(); }}
              className="w-full text-xs p-3 rounded-xl bg-black/30 border border-white/15 text-slate-200 focus:outline-none focus:border-purple-500/50"
            />
          </div>

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-glow-btn transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Submit Data Analytics Findings</span>
          </button>

        </div>

      </div>

    </div>
  );
}
