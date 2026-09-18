'use client';

import React, { useState, useMemo } from 'react';
import { LabScenarioVariant, LabDifficulty } from '@/lib/labs/types';
import { 
  Calculator, 
  Table, 
  AlertTriangle, 
  CheckCircle2, 
  FunctionSquare, 
  Send,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface SimulatorProps {
  scenario?: LabScenarioVariant;
  variant: LabDifficulty;
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

// 6 representative product rows on the distributor's monthly MIS grid
const initialMisRows = [
  { id: 'R1', sku: 'SKU-01', item: 'Hydraulic Seals', targetQty: 100, actualQty: 80, unitCost: 450, formula: 'ACHIEVEMENT_RATE' },
  { id: 'R2', sku: 'SKU-02', item: 'Pneumatic Valves', targetQty: 150, actualQty: 150, unitCost: 320, formula: 'ACHIEVEMENT_RATE' },
  { id: 'R3', sku: 'SKU-03', item: 'Lubricant 5L', targetQty: 80, actualQty: 60, unitCost: 850, formula: 'ACHIEVEMENT_RATE' },
  { id: 'R4', sku: 'SKU-04', item: 'Coupling Joints', targetQty: 200, actualQty: 0, unitCost: 120, formula: 'ACHIEVEMENT_RATE' }, // zero actual!
  { id: 'R5', sku: 'SKU-05', item: 'O-Ring Assortment', targetQty: 50, actualQty: 55, unitCost: 200, formula: 'ACHIEVEMENT_RATE' },
  { id: 'R6', sku: 'SKU-06', item: 'Gasket Sheets', targetQty: 120, actualQty: 96, unitCost: 600, formula: 'ACHIEVEMENT_RATE' },
];

export default function SpreadsheetMisLab({
  scenario,
  variant,
  onDirty,
  onSubmit
}: SimulatorProps) {
  // Selected formula template for Total Sales: 'SUM' vs 'AVERAGE' vs 'COUNT'
  const [selectedTotalFormula, setSelectedTotalFormula] = useState<'SUM' | 'AVERAGE' | 'COUNT'>('SUM');

  // Selected formula template for Achievement Rate: 'ACTUAL_DIV_TARGET' vs 'TARGET_DIV_ACTUAL' vs 'SUBTRACT'
  const [selectedRateFormula, setSelectedRateFormula] = useState<'ACTUAL_DIV_TARGET' | 'TARGET_DIV_ACTUAL' | 'SUBTRACT'>('ACTUAL_DIV_TARGET');

  // Lookup Key selection: 'SKU' vs 'INDEX' vs 'NAME'
  const [selectedLookupKey, setSelectedLookupKey] = useState<'SKU' | 'NAME'>('SKU');

  // Threshold filter for achievement status: e.g. 80%
  const [achievementThreshold, setAchievementThreshold] = useState(80);

  // Memo
  const [misMemo, setMisMemo] = useState(
    'Configured monthly achievement rate formula as (Actual / Target) * 100. Guarded against divide-by-zero on zero targets, and computed column total sales using SUM(Range).'
  );

  // Compute cell values
  const rows = useMemo(() => {
    return initialMisRows.map(r => {
      let rate = 0;
      if (selectedRateFormula === 'ACTUAL_DIV_TARGET') {
        rate = r.targetQty > 0 ? Math.round((r.actualQty / r.targetQty) * 100) : 0;
      } else if (selectedRateFormula === 'TARGET_DIV_ACTUAL') {
        rate = r.actualQty > 0 ? Math.round((r.targetQty / r.actualQty) * 100) : 0;
      } else {
        rate = r.actualQty - r.targetQty;
      }

      const totalValue = r.actualQty * r.unitCost;
      const meetsThreshold = rate >= achievementThreshold;

      return {
        ...r,
        rate,
        totalValue,
        meetsThreshold
      };
    });
  }, [selectedRateFormula, achievementThreshold]);

  // Overall MIS Summary Aggregates
  const summary = useMemo(() => {
    const totalTarget = rows.reduce((s, r) => s + r.targetQty, 0);
    const totalActual = rows.reduce((s, r) => s + r.actualQty, 0);
    const overallRate = totalTarget > 0 ? Math.round((totalActual / totalTarget) * 100) : 0;
    
    let totalSales = 0;
    if (selectedTotalFormula === 'SUM') {
      totalSales = rows.reduce((s, r) => s + r.totalValue, 0);
    } else if (selectedTotalFormula === 'AVERAGE') {
      totalSales = Math.round(rows.reduce((s, r) => s + r.totalValue, 0) / rows.length);
    } else {
      totalSales = rows.length;
    }

    return {
      totalTarget,
      totalActual,
      overallRate,
      totalSales,
      sku1Rate: rows[0]?.rate || 0
    };
  }, [rows, selectedTotalFormula]);

  const handleSubmit = () => {
    onSubmit({
      selectedTotalFormula,
      selectedRateFormula,
      selectedLookupKey,
      achievementThreshold,
      sku1Rate: summary.sku1Rate,
      overallRate: summary.overallRate,
      totalSales: summary.totalSales,
      misMemo
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">SKU-01 Rate (Target 100, Act 80)</span>
          <span className={`text-xl font-black ${summary.sku1Rate === 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {summary.sku1Rate}%
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {summary.sku1Rate === 80 ? 'Correct (80% achieved)' : 'Formula error!'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Total Target vs Actual</span>
          <span className="text-xl font-black text-white">{summary.totalActual} / {summary.totalTarget}</span>
          <span className="text-[10px] text-purple-300 block mt-0.5">Overall: {summary.overallRate}%</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#131728] border border-purple-500/30 bg-purple-950/20">
          <span className="text-xs text-purple-300 font-bold block mb-1">Calculated Total Revenue</span>
          <span className="text-xl font-black text-purple-200">
            ₹{summary.totalSales.toLocaleString()}
          </span>
          <span className="text-[10px] text-emerald-400 block mt-0.5">
            Formula: {selectedTotalFormula}(E2:E7)
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Lookup Integrity</span>
          <span className="text-xl font-black text-emerald-400">
            {selectedLookupKey === 'SKU' ? 'Exact Match (SKU)' : 'Name (Collision Risk)'}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">XLOOKUP Primary Key</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Cols: 20x15 MIS Spreadsheet Grid */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Table className="w-4 h-4 text-purple-400" />
                <span>Distributor Monthly MIS Worksheet (20 × 15 Grid)</span>
              </h2>
              <span className="text-xs font-mono text-slate-400">Read-Only Formulas Display</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/15 text-slate-400 text-[11px] bg-white/5">
                    <th className="p-2.5">Row</th>
                    <th className="p-2.5">SKU Key</th>
                    <th className="p-2.5">Item Name</th>
                    <th className="p-2.5">Target</th>
                    <th className="p-2.5">Actual</th>
                    <th className="p-2.5">Achievement %</th>
                    <th className="p-2.5">Total Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {rows.map((r, i) => (
                    <tr key={r.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-2 text-slate-500 font-semibold">{i + 2}</td>
                      <td className="p-2 text-purple-300 font-bold">{r.sku}</td>
                      <td className="p-2 text-slate-200 font-sans">{r.item}</td>
                      <td className="p-2 text-slate-300">{r.targetQty}</td>
                      <td className="p-2 text-white font-bold">{r.actualQty}</td>
                      <td className="p-2">
                        <span className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                          r.meetsThreshold ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {r.rate}%
                        </span>
                      </td>
                      <td className="p-2 text-slate-200">₹{r.totalValue.toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-purple-500/40 bg-purple-950/20 font-bold">
                    <td className="p-2.5 text-purple-300">TOTAL</td>
                    <td className="p-2.5 text-slate-400">-</td>
                    <td className="p-2.5 font-sans">All SKUs Aggregate</td>
                    <td className="p-2.5">{summary.totalTarget}</td>
                    <td className="p-2.5">{summary.totalActual}</td>
                    <td className="p-2.5 text-purple-300">{summary.overallRate}%</td>
                    <td className="p-2.5 text-emerald-400 font-black">₹{summary.totalSales.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right 5 Cols: Formula Templates Configuration & Submit */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
              <FunctionSquare className="w-4 h-4 text-purple-400" />
              <span>Formula Template Selector</span>
            </h3>

            {/* Template 1: Total Formula */}
            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-slate-300 block">
                Total Column Calculation Template:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['SUM', 'AVERAGE', 'COUNT'] as const).map(f => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => { setSelectedTotalFormula(f); onDirty(); }}
                    className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                      selectedTotalFormula === f 
                        ? 'bg-purple-600 text-white shadow-glow-btn border-purple-500' 
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    ={f}()
                  </button>
                ))}
              </div>
            </div>

            {/* Template 2: Achievement Rate Formula */}
            <div className="space-y-1.5 text-xs pt-2">
              <label className="font-semibold text-slate-300 block">
                Achievement Rate Template:
              </label>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => { setSelectedRateFormula('ACTUAL_DIV_TARGET'); onDirty(); }}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                    selectedRateFormula === 'ACTUAL_DIV_TARGET' 
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200' 
                      : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  =(Actual / Target) * 100 <span className="text-[10px] text-emerald-400 font-bold ml-1">(Correct: 80 / 100 = 80%)</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setSelectedRateFormula('TARGET_DIV_ACTUAL'); onDirty(); }}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                    selectedRateFormula === 'TARGET_DIV_ACTUAL' 
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-200' 
                      : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  =(Target / Actual) * 100 <span className="text-[10px] text-amber-400 font-bold ml-1">(Inverted)</span>
                </button>
              </div>
            </div>

            {/* Template 3: Lookup Key */}
            <div className="space-y-1.5 text-xs pt-2">
              <label className="font-semibold text-slate-300 block">
                XLOOKUP Primary Key Field:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => { setSelectedLookupKey('SKU'); onDirty(); }}
                  className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                    selectedLookupKey === 'SKU' 
                      ? 'bg-purple-600 text-white shadow-glow-btn border-purple-500' 
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  SKU Code (Exact Match)
                </button>
                <button
                  type="button"
                  onClick={() => { setSelectedLookupKey('NAME'); onDirty(); }}
                  className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                    selectedLookupKey === 'NAME' 
                      ? 'bg-purple-600 text-white shadow-glow-btn border-purple-500' 
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  Item Name (Fuzzy)
                </button>
              </div>
            </div>

          </div>

          {/* Memo & Submission */}
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <label htmlFor="mis-memo" className="text-xs font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>MIS Formula Recipe Documentation</span>
            </label>
            <textarea
              id="mis-memo"
              rows={3}
              value={misMemo}
              onChange={(e) => { setMisMemo(e.target.value); onDirty(); }}
              className="w-full text-xs p-3 rounded-xl bg-black/30 border border-white/15 text-slate-200 focus:outline-none focus:border-purple-500/50"
            />

            <button
              type="button"
              onClick={handleSubmit}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-glow-btn transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Submit MIS Formula Recipe</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
