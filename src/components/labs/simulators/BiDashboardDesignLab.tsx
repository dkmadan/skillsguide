'use client';

import React, { useState, useMemo } from 'react';
import { LabScenarioVariant, LabDifficulty } from '@/lib/labs/types';
import { 
  BarChart2, 
  GitFork, 
  Filter, 
  Layers, 
  PieChart, 
  Send,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

interface SimulatorProps {
  scenario?: LabScenarioVariant;
  variant: LabDifficulty;
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

// 3 Prepared sales tables
const salesTable = [
  { orderId: 'S-01', custId: 'C-01', prodId: 'P-01', revenue: 12000, cost: 8000, category: 'Enterprise' },
  { orderId: 'S-02', custId: 'C-02', prodId: 'P-02', revenue: 5000, cost: 3500, category: 'Mid-Market' },
  { orderId: 'S-03', custId: 'C-01', prodId: 'P-03', revenue: 9000, cost: 5000, category: 'Enterprise' },
  { orderId: 'S-04', custId: 'C-03', prodId: 'P-01', revenue: 15000, cost: 9500, category: 'Enterprise' },
  { orderId: 'S-05', custId: 'C-04', prodId: 'P-02', revenue: 4000, cost: 2800, category: 'SMB' },
];

export default function BiDashboardDesignLab({
  scenario,
  variant,
  onDirty,
  onSubmit
}: SimulatorProps) {
  // Selected relationship cardinality for Sales to Customers:
  // 'ONE_TO_MANY' (Correct) vs 'MANY_TO_MANY' (Incorrect/Inflates)
  const [custRelationship, setCustRelationship] = useState<'ONE_TO_MANY' | 'MANY_TO_MANY'>('ONE_TO_MANY');

  // Selected measure templates: Sales, Margin, Distinct Customers
  const [marginMeasure, setMarginMeasure] = useState<'DIVIDE_PROFIT_SALES' | 'SUBTRACT_COST_SALES'>('DIVIDE_PROFIT_SALES');
  const [activeFilterCategory, setActiveFilterCategory] = useState<string>('All');

  // Business Observations Memo
  const [biObservations, setBiObservations] = useState(
    '1. Enterprise segment generates 80% of gross margin with highest basket size at ₹12,000.\n2. Star-schema 1:Many relationships preserve total revenue integrity without duplicate join inflation.'
  );

  // Filtered rows
  const filteredSales = useMemo(() => {
    if (activeFilterCategory === 'All') return salesTable;
    return salesTable.filter(s => s.category === activeFilterCategory);
  }, [activeFilterCategory]);

  // Measures Calculation
  const kpis = useMemo(() => {
    const totalSales = filteredSales.reduce((s, r) => s + r.revenue, 0);
    const totalCost = filteredSales.reduce((s, r) => s + r.cost, 0);
    const profit = totalSales - totalCost;
    const marginPct = totalSales > 0 ? Math.round((profit / totalSales) * 100) : 0;
    const distinctCustomers = new Set(filteredSales.map(r => r.custId)).size;

    return {
      totalSales,
      profit,
      marginPct,
      distinctCustomers,
      isRelationshipValid: custRelationship === 'ONE_TO_MANY'
    };
  }, [filteredSales, custRelationship]);

  const handleSubmit = () => {
    onSubmit({
      custRelationship,
      marginMeasure,
      activeFilterCategory,
      totalSales: kpis.totalSales,
      marginPct: kpis.marginPct,
      distinctCustomers: kpis.distinctCustomers,
      biObservations
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Executive KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Total Sales Measure</span>
          <span className="text-xl font-black text-white">₹{kpis.totalSales.toLocaleString()}</span>
          <span className="text-[10px] text-emerald-400 block mt-0.5">Sum(Sales[Revenue])</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Profit Margin %</span>
          <span className="text-xl font-black text-purple-300">{kpis.marginPct}%</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">₹{kpis.profit.toLocaleString()} Gross Profit</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Distinct Customers</span>
          <span className="text-xl font-black text-indigo-300">{kpis.distinctCustomers}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">DistinctCount(CustID)</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#131728] border border-purple-500/30 bg-purple-950/20">
          <span className="text-xs text-purple-300 font-bold block mb-1">Model Relationship</span>
          <span className={`text-base font-black ${kpis.isRelationshipValid ? 'text-emerald-400' : 'text-amber-400'}`}>
            {kpis.isRelationshipValid ? '1:Many Star Schema' : 'Many:Many (Inflation Risk!)'}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {kpis.isRelationshipValid ? 'Clean single-direction filter' : 'Duplicate totals danger'}
          </span>
        </div>
      </div>

      {/* Main Grid: Data Modeling Canvas & Interactive Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Cols: BI Modeling Canvas & Filter Chips */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Modeling Canvas & Relationship Keys */}
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
                <GitFork className="w-4 h-4 text-purple-400" />
                <span>1. Semantic Model Relationship Keys</span>
              </h2>
              <span className="text-xs text-slate-400">Star-Schema Model</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
              <span className="text-xs font-semibold text-slate-200 block">
                Customers (Dimension) &rarr; Sales (Fact Table) Cardinality:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => { setCustRelationship('ONE_TO_MANY'); onDirty(); }}
                  className={`p-3 rounded-xl border text-left font-bold transition-all ${
                    custRelationship === 'ONE_TO_MANY' 
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200' 
                      : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  <div>1-to-Many (1 : *)</div>
                  <span className="text-[10px] font-normal text-emerald-400">Correct: Unique customer key</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setCustRelationship('MANY_TO_MANY'); onDirty(); }}
                  className={`p-3 rounded-xl border text-left font-bold transition-all ${
                    custRelationship === 'MANY_TO_MANY' 
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-200' 
                      : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  <div>Many-to-Many (* : *)</div>
                  <span className="text-[10px] font-normal text-amber-400">Warning: Inflates join totals</span>
                </button>
              </div>
            </div>

            {/* Filter Slicer Chips */}
            <div className="space-y-2 text-xs">
              <span className="font-semibold text-slate-300 block flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-purple-400" />
                <span>Cross-Filtering Category Slicer:</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {['All', 'Enterprise', 'Mid-Market', 'SMB'].map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => { setActiveFilterCategory(cat); onDirty(); }}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                      activeFilterCategory === cat
                        ? 'bg-purple-600 text-white shadow-glow-btn border-purple-500'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Fact Records Table */}
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
              Sales Fact Table Records ({filteredSales.length} Rows)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 text-[11px]">
                    <th className="p-2">Order ID</th>
                    <th className="p-2">Customer ID</th>
                    <th className="p-2">Category</th>
                    <th className="p-2 text-right">Revenue</th>
                    <th className="p-2 text-right">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {filteredSales.map(s => (
                    <tr key={s.orderId} className="hover:bg-white/5">
                      <td className="p-2 text-purple-300 font-bold">{s.orderId}</td>
                      <td className="p-2 text-slate-300">{s.custId}</td>
                      <td className="p-2 font-sans">{s.category}</td>
                      <td className="p-2 text-right font-bold text-white">₹{s.revenue.toLocaleString()}</td>
                      <td className="p-2 text-right text-slate-400">₹{s.cost.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right 5 Cols: DAX Measure Templates & Business Observations */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
              2. Measure Template Builder
            </h3>

            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-slate-300 block">Profit Margin Formula:</label>
              <button
                type="button"
                onClick={() => { setMarginMeasure('DIVIDE_PROFIT_SALES'); onDirty(); }}
                className={`w-full p-2.5 rounded-xl border text-left font-mono text-xs transition-all ${
                  marginMeasure === 'DIVIDE_PROFIT_SALES'
                    ? 'bg-purple-600/30 border-purple-500/50 text-white'
                    : 'bg-white/5 border-white/10 text-slate-400'
                }`}
              >
                DIVIDE([Total Profit], [Total Sales])
              </button>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-2">
            <label htmlFor="bi-observations" className="text-xs font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>3. Executive Business Observations</span>
            </label>
            <textarea
              id="bi-observations"
              rows={4}
              value={biObservations}
              onChange={(e) => { setBiObservations(e.target.value); onDirty(); }}
              className="w-full text-xs p-3 rounded-xl bg-black/30 border border-white/15 text-slate-200 focus:outline-none focus:border-purple-500/50"
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-glow-btn transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Submit BI Dashboard Configuration</span>
          </button>

        </div>

      </div>

    </div>
  );
}
