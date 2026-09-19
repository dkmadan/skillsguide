'use client';

import { useMemo, useState } from 'react';
import { LabScenarioVariant, LabDifficulty } from '@/lib/labs/types';
import { useUndoableState } from '@/lib/labs/useUndoableState';
import { downloadCsv, downloadJson } from '@/lib/labs/exportHelper';
import ChartFrame from '@/components/labs/charts/ChartFrame';
import TrendLineChart from '@/components/labs/charts/TrendLineChart';
import CompareBarChart from '@/components/labs/charts/CompareBarChart';
import SimClock from '@/components/labs/SimClock';
import {
  Undo2,
  Redo2,
  RotateCcw,
  Send,
  Download,
  FileJson,
  Layers,
  LineChart as LineChartIcon,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface SimulatorProps {
  scenario?: LabScenarioVariant;
  variant: LabDifficulty;
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

interface Assumptions {
  unitsSold: number;
  unitPrice: number;
  variableCostPerUnit: number;
  fixedCostsMonthly: number;
  collectionLagPercent: number; // % of this month's revenue collected the FOLLOWING month
  openingCash: number;
  openingReceivable: number; // $ still owed from before month 1, collected in month 1
}

interface ScenarioLine extends Assumptions {
  id: string;
  name: string;
  description: string;
}

// Three genuinely different scenario pools — same formulas, increasing
// ambiguity: larger collection lags, a negative opening cash position, and
// (challenge tier) a zero-contribution-margin scenario with no finite break-even.
const SCENARIO_POOLS: Record<LabDifficulty, ScenarioLine[]> = {
  beginner: [
    { id: 'baseline', name: 'Baseline', description: 'Steady month, most revenue collected on time.', unitsSold: 60, unitPrice: 50, variableCostPerUnit: 30, fixedCostsMonthly: 1000, collectionLagPercent: 20, openingCash: 500, openingReceivable: 600 },
    { id: 'growth', name: 'Growth Push', description: 'More volume at a slight discount.', unitsSold: 90, unitPrice: 48, variableCostPerUnit: 31, fixedCostsMonthly: 1200, collectionLagPercent: 25, openingCash: 400, openingReceivable: 700 },
    { id: 'cost_shock', name: 'Cost Shock', description: 'Below-breakeven volume with rising overhead.', unitsSold: 50, unitPrice: 46, variableCostPerUnit: 34, fixedCostsMonthly: 1500, collectionLagPercent: 30, openingCash: 200, openingReceivable: 500 },
  ],
  intermediate: [
    { id: 'baseline', name: 'Baseline', description: 'Steady month with moderate collection lag.', unitsSold: 70, unitPrice: 52, variableCostPerUnit: 33, fixedCostsMonthly: 1400, collectionLagPercent: 30, openingCash: 300, openingReceivable: 900 },
    { id: 'growth', name: 'Growth Push', description: 'Higher volume, thinner margin, slower collections.', unitsSold: 110, unitPrice: 49, variableCostPerUnit: 35, fixedCostsMonthly: 1700, collectionLagPercent: 35, openingCash: 250, openingReceivable: 1100 },
    { id: 'margin_squeeze', name: 'Margin Squeeze', description: 'Tiny per-unit margin and a cash deficit at month start.', unitsSold: 65, unitPrice: 40, variableCostPerUnit: 38, fixedCostsMonthly: 900, collectionLagPercent: 40, openingCash: -100, openingReceivable: 600 },
  ],
  challenge: [
    { id: 'baseline', name: 'Baseline', description: 'Steady month with substantial collection lag.', unitsSold: 80, unitPrice: 55, variableCostPerUnit: 34, fixedCostsMonthly: 1800, collectionLagPercent: 35, openingCash: 200, openingReceivable: 1200 },
    { id: 'growth', name: 'Growth Push', description: 'Aggressive volume growth with slower collections.', unitsSold: 130, unitPrice: 50, variableCostPerUnit: 36, fixedCostsMonthly: 2200, collectionLagPercent: 45, openingCash: 150, openingReceivable: 1600 },
    { id: 'cost_shock', name: 'Cost Shock', description: 'Price equals variable cost — no finite break-even — starting cash already negative.', unitsSold: 75, unitPrice: 42, variableCostPerUnit: 42, fixedCostsMonthly: 1600, collectionLagPercent: 55, openingCash: -300, openingReceivable: 1400 },
  ],
};

const MAX_MONTHS = 6;

interface StaticModel {
  revenue: number;
  totalVariableCost: number;
  contributionMarginPerUnit: number;
  totalContribution: number;
  netOperatingIncome: number;
  breakEvenUnits: number | null; // null = no finite break-even (margin <= 0)
}

// Explicit, developer-owned arithmetic — never AI-estimated.
function computeModel(a: Assumptions): StaticModel {
  const revenue = a.unitsSold * a.unitPrice;
  const totalVariableCost = a.unitsSold * a.variableCostPerUnit;
  const contributionMarginPerUnit = a.unitPrice - a.variableCostPerUnit;
  const totalContribution = revenue - totalVariableCost;
  const netOperatingIncome = totalContribution - a.fixedCostsMonthly;
  const breakEvenUnits = contributionMarginPerUnit > 0 ? Math.ceil(a.fixedCostsMonthly / contributionMarginPerUnit) : null;
  return { revenue, totalVariableCost, contributionMarginPerUnit, totalContribution, netOperatingIncome, breakEvenUnits };
}

interface MonthResult {
  month: number;
  revenue: number;
  variableCost: number;
  fixedCost: number;
  collectionLagPercent: number;
  openingCashForMonth: number;
  cashIn: number;
  cashOut: number;
  closingCash: number;
  nextReceivable: number; // $ carried into the following month's collections
}

function advanceMonth(history: MonthResult[], a: Assumptions): MonthResult {
  const model = computeModel(a);
  const openingCashForMonth = history.length ? history[history.length - 1].closingCash : a.openingCash;
  const collectedFromPrior = history.length ? history[history.length - 1].nextReceivable : a.openingReceivable;
  const collectedFromThisMonth = model.revenue * (1 - a.collectionLagPercent / 100);
  const cashIn = collectedFromThisMonth + collectedFromPrior;
  const cashOut = model.totalVariableCost + a.fixedCostsMonthly;
  const closingCash = openingCashForMonth + cashIn - cashOut;
  const nextReceivable = model.revenue * (a.collectionLagPercent / 100);
  return {
    month: history.length + 1,
    revenue: model.revenue,
    variableCost: model.totalVariableCost,
    fixedCost: a.fixedCostsMonthly,
    collectionLagPercent: a.collectionLagPercent,
    openingCashForMonth,
    cashIn,
    cashOut,
    closingCash,
    nextReceivable,
  };
}

interface WorkspaceState {
  scenarioId: string;
  assumptions: Assumptions;
  month: number;
  cashHistory: MonthResult[];
}

export default function BusinessFinancialModelLab({ variant, onDirty, onSubmit }: SimulatorProps) {
  const scenarios = SCENARIO_POOLS[variant];
  const baseline = scenarios[0];

  const initialState: WorkspaceState = useMemo(
    () => ({ scenarioId: baseline.id, assumptions: { ...baseline }, month: 0, cashHistory: [] }),
    [baseline]
  );

  const { state, set, undo, redo, reset, canUndo, canRedo, stepIndex } = useUndoableState<WorkspaceState>(initialState);
  const [memo, setMemo] = useState(
    'Delayed collections create a temporary cash gap in the first simulated month; once receivables catch up, cash stabilizes provided the contribution margin stays positive.'
  );

  const updateAssumption = (patch: Partial<Assumptions>) => {
    set((prev) => ({ ...prev, assumptions: { ...prev.assumptions, ...patch } }));
    onDirty();
  };

  const loadScenario = (id: string) => {
    const preset = scenarios.find((s) => s.id === id);
    if (!preset) return;
    set(() => ({ scenarioId: id, assumptions: { ...preset }, month: 0, cashHistory: [] }));
    onDirty();
  };

  const handleAdvance = () => {
    if (state.month >= MAX_MONTHS) return;
    set((prev) => ({ ...prev, month: prev.month + 1, cashHistory: [...prev.cashHistory, advanceMonth(prev.cashHistory, prev.assumptions)] }));
    onDirty();
  };

  const handleClockReset = () => {
    set((prev) => ({ ...prev, month: 0, cashHistory: [] }));
    onDirty();
  };

  const model = useMemo(() => computeModel(state.assumptions), [state.assumptions]);
  const baselineModel = useMemo(() => computeModel(baseline), [baseline]);

  const hasShortfall = state.cashHistory.some((m) => m.closingCash < 0);
  const latestClosingCash = state.cashHistory.length ? state.cashHistory[state.cashHistory.length - 1].closingCash : state.assumptions.openingCash;

  const varianceVsBaseline = useMemo(() => ([
    { item: 'Revenue', baseline: baselineModel.revenue, active: model.revenue },
    { item: 'Variable Cost', baseline: baselineModel.totalVariableCost, active: model.totalVariableCost },
    { item: 'Fixed Cost', baseline: baseline.fixedCostsMonthly, active: state.assumptions.fixedCostsMonthly },
    { item: 'Net Operating Income', baseline: baselineModel.netOperatingIncome, active: model.netOperatingIncome },
  ]), [baselineModel, model, baseline.fixedCostsMonthly, state.assumptions.fixedCostsMonthly]);

  const handleExportCsv = () => {
    downloadCsv('financial_budget_model.csv', state.cashHistory.map((m) => ({
      month: m.month, revenue: m.revenue, variable_cost: m.variableCost, fixed_cost: m.fixedCost,
      cash_in: Math.round(m.cashIn), cash_out: Math.round(m.cashOut), closing_cash: Math.round(m.closingCash),
    })));
  };

  const handleExportJson = () => {
    downloadJson('financial_scenario_report.json', {
      variant, scenarioId: state.scenarioId, assumptions: state.assumptions, model, varianceVsBaseline, memo,
    });
  };

  const handleSubmit = () => {
    onSubmit({
      scenarioId: state.scenarioId,
      assumptions: state.assumptions,
      model,
      monthsAdvanced: state.month,
      cashHistory: state.cashHistory,
      hadShortfall: hasShortfall,
      varianceVsBaseline,
      assumptionsMemo: memo,
      stepIndex,
    });
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Monthly Revenue</span>
          <span className="text-xl font-black text-white">${model.revenue.toLocaleString()}</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">{state.assumptions.unitsSold} units × ${state.assumptions.unitPrice}</span>
        </div>
        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
          <span className="text-xs text-emerald-300 font-bold block mb-1">Break-Even Units</span>
          <span className="text-xl font-black text-emerald-200">{model.breakEvenUnits !== null ? `${model.breakEvenUnits} units` : 'No finite break-even'}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Contribution: ${model.contributionMarginPerUnit}/unit</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className={`text-xl font-black ${model.netOperatingIncome >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>${model.netOperatingIncome.toLocaleString()}</span>
          <span className="text-xs text-slate-400 font-semibold block mb-1 mt-1">Net Operating Income</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className={`text-xl font-black flex items-center gap-1 ${latestClosingCash < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
            {latestClosingCash < 0 ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            ${Math.round(latestClosingCash).toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">{hasShortfall ? 'Shortfall occurred during run' : 'Solvent through simulated months'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>1. Scenario Lines</span>
              </h2>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={undo} disabled={!canUndo} title="Undo last change"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30 transition-colors">
                  <Undo2 className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={redo} disabled={!canRedo} title="Redo"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30 transition-colors">
                  <Redo2 className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => { reset(); onDirty(); }} title="Reset scenario"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors">
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {scenarios.map((s) => (
                <button key={s.id} type="button" onClick={() => loadScenario(s.id)}
                  className={`p-3 rounded-2xl border text-xs font-bold text-left transition-all flex flex-col gap-1 ${state.scenarioId === s.id ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}>
                  <span>{s.name}</span>
                  <span className="text-[10px] font-normal text-slate-400">{s.description}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">2. Assumptions Controls</h3>
            <div className="space-y-3 text-xs">
              {[
                { key: 'unitsSold' as const, label: 'Monthly Sales Volume', min: 10, max: 200, step: 5, fmt: (v: number) => `${v} units` },
                { key: 'unitPrice' as const, label: 'Selling Price per Unit', min: 20, max: 100, step: 1, fmt: (v: number) => `$${v}` },
                { key: 'variableCostPerUnit' as const, label: 'Variable Cost per Unit', min: 10, max: 60, step: 1, fmt: (v: number) => `$${v}` },
                { key: 'fixedCostsMonthly' as const, label: 'Fixed Monthly Overhead', min: 500, max: 3000, step: 50, fmt: (v: number) => `$${v}` },
                { key: 'collectionLagPercent' as const, label: 'Collections Delayed to Next Month', min: 0, max: 70, step: 5, fmt: (v: number) => `${v}%` },
                { key: 'openingCash' as const, label: 'Opening Cash Reserve', min: -500, max: 1500, step: 50, fmt: (v: number) => `$${v}` },
                { key: 'openingReceivable' as const, label: 'Opening Receivable (owed from before month 1)', min: 0, max: 2000, step: 50, fmt: (v: number) => `$${v}` },
              ].map((ctrl) => (
                <div key={ctrl.key}>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>{ctrl.label}</span>
                    <span className="font-mono text-emerald-400 font-bold">{ctrl.fmt(state.assumptions[ctrl.key])}</span>
                  </div>
                  <input type="range" min={ctrl.min} max={ctrl.max} step={ctrl.step} value={state.assumptions[ctrl.key]}
                    onChange={(e) => updateAssumption({ [ctrl.key]: parseInt(e.target.value, 10) } as Partial<Assumptions>)}
                    className="w-full accent-emerald-500" aria-label={ctrl.label} />
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">3. Monthly Cash-Flow Clock</h3>
            <SimClock label="Simulated Month" step={state.month} maxStep={MAX_MONTHS}
              stepLabel={(s) => (s === 0 ? 'Not started' : `Month ${s}/${MAX_MONTHS}`)}
              onAdvance={handleAdvance} onReset={handleClockReset} />
            {state.cashHistory.length > 0 && (
              <div className="overflow-x-auto max-h-40 overflow-y-auto rounded-xl border border-white/5">
                <table className="w-full text-left text-[11px] border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 sticky top-0 bg-[#111425]">
                      <th className="p-2">Month</th><th className="p-2 text-right">Cash In</th><th className="p-2 text-right">Cash Out</th><th className="p-2 text-right">Closing Cash</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {state.cashHistory.map((m) => (
                      <tr key={m.month}>
                        <td className="p-2 font-mono text-emerald-300">M{m.month}</td>
                        <td className="p-2 text-right font-mono">${Math.round(m.cashIn).toLocaleString()}</td>
                        <td className="p-2 text-right font-mono">${Math.round(m.cashOut).toLocaleString()}</td>
                        <td className={`p-2 text-right font-mono font-bold ${m.closingCash < 0 ? 'text-red-400' : 'text-slate-200'}`}>${Math.round(m.closingCash).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="lg:col-span-5 space-y-4">
          <ChartFrame
            title="Monthly Closing Cash vs Solvency Line"
            icon={<LineChartIcon className="w-4 h-4 text-emerald-400" />}
            tableHeaders={['Month', 'Closing Cash', 'Solvency Line']}
            tableRows={state.cashHistory.map((m) => [`M${m.month}`, Math.round(m.closingCash), 0])}
          >
            <TrendLineChart
              labels={state.cashHistory.map((m) => `M${m.month}`)}
              series={[
                { label: 'Closing Cash', data: state.cashHistory.map((m) => Math.round(m.closingCash)), fill: true },
                { label: 'Solvency Line ($0)', data: state.cashHistory.map(() => 0) },
              ]}
              yLabel="Cash ($)"
            />
          </ChartFrame>

          <ChartFrame
            title="Variance vs Baseline Scenario"
            icon={<BarChart3 className="w-4 h-4 text-emerald-400" />}
            tableHeaders={['Line Item', 'Baseline', 'Active', 'Variance']}
            tableRows={varianceVsBaseline.map((v) => [v.item, v.baseline, v.active, v.active - v.baseline])}
          >
            <CompareBarChart
              labels={varianceVsBaseline.map((v) => v.item)}
              series={[{
                label: 'Variance ($)',
                data: varianceVsBaseline.map((v) => v.active - v.baseline),
                statusOverride: varianceVsBaseline.map((v) => (v.active - v.baseline < 0 ? 'critical' : null)),
              }]}
              yLabel="Variance ($)"
            />
          </ChartFrame>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-2">
            <label htmlFor="fin-memo" className="text-xs font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Assumptions Memo</span>
            </label>
            <textarea id="fin-memo" rows={4} value={memo}
              onChange={(e) => { setMemo(e.target.value); onDirty(); }}
              className="w-full text-xs p-3 rounded-xl bg-black/30 border border-white/15 text-slate-200 focus:outline-none focus:border-emerald-500/50" />
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
            <span>Submit Model</span>
          </button>
        </div>
      </div>
    </div>
  );
}
