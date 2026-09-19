'use client';

import React, { useMemo, useState } from 'react';
import { LabScenarioVariant, LabDifficulty } from '@/lib/labs/types';
import { useUndoableState } from '@/lib/labs/useUndoableState';
import { downloadCsv, downloadJson } from '@/lib/labs/exportHelper';
import ChartFrame from '@/components/labs/charts/ChartFrame';
import CompareBarChart from '@/components/labs/charts/CompareBarChart';
import BreakdownDoughnutChart from '@/components/labs/charts/BreakdownDoughnutChart';
import {
  Table,
  FunctionSquare,
  Send,
  Sparkles,
  Undo2,
  Redo2,
  RotateCcw,
  Download,
  FileJson,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  PieChart as PieChartIcon,
  ShieldAlert,
} from 'lucide-react';

interface SimulatorProps {
  scenario?: LabScenarioVariant;
  variant: LabDifficulty;
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

// Actual quantity cell: a real number, a blank cell (null), or a corrupted
// non-numeric entry ('invalid') — the three "invalid numbers / blank cells"
// data-hygiene defects the spec asks us to test.
type ActualCell = number | null | 'invalid';

interface MisRow {
  id: string;
  sku: string;
  item: string;
  category: string;
  targetQty: number; // 0 => divide-by-zero defect
  actualQty: ActualCell;
  circularRef?: boolean; // true => Total Value formula is self-referential until fixed
}

interface MasterPriceEntry {
  sku: string;
  unitCost: number;
}

// Three genuinely different 20x15-style MIS worksheets (rows shown are the
// meaningful subset of the distributor's 20-row x 15-column monthly workbook)
// with increasing data-hygiene ambiguity per difficulty tier. R1 is held
// constant across all tiers as the fixed target-100/actual-80 verification row.
const ROW_POOLS: Record<LabDifficulty, MisRow[]> = {
  beginner: [
    { id: 'R1', sku: 'SKU-01', item: 'Hydraulic Seals', category: 'Seals & Fittings', targetQty: 100, actualQty: 80 },
    { id: 'R2', sku: 'SKU-02', item: 'Pneumatic Valves', category: 'Valves & Actuators', targetQty: 150, actualQty: 150 },
    { id: 'R3', sku: 'SKU-03', item: 'Lubricant 5L', category: 'Lubricants', targetQty: 80, actualQty: null }, // blank cell
    { id: 'R4', sku: 'SKU-04', item: 'Coupling Joints', category: 'Fasteners', targetQty: 0, actualQty: 40 }, // divide-by-zero
    { id: 'R5', sku: 'SKU-05', item: 'O-Ring Assortment', category: 'Seals & Fittings', targetQty: 50, actualQty: 55 },
    { id: 'R6', sku: 'SKU-06', item: 'Gasket Sheets', category: 'Valves & Actuators', targetQty: 120, actualQty: 96 },
    { id: 'R7', sku: 'SKU-07', item: 'Grease Cartridge', category: 'Lubricants', targetQty: 90, actualQty: 70 }, // missing lookup (see master list)
    { id: 'R8', sku: 'SKU-08', item: 'M8 Bolt Pack', category: 'Fasteners', targetQty: 60, actualQty: 48 },
  ],
  intermediate: [
    { id: 'R1', sku: 'SKU-01', item: 'Hydraulic Seals', category: 'Seals & Fittings', targetQty: 100, actualQty: 80 },
    { id: 'R2', sku: 'SKU-02', item: 'Pneumatic Valves', category: 'Valves & Actuators', targetQty: 150, actualQty: 150 },
    { id: 'R3', sku: 'SKU-03', item: 'Lubricant 5L', category: 'Lubricants', targetQty: 80, actualQty: null }, // blank
    { id: 'R4', sku: 'SKU-04', item: 'Coupling Joints', category: 'Fasteners', targetQty: 0, actualQty: 40 }, // divide-by-zero
    { id: 'R5', sku: 'SKU-05', item: 'O-Ring Assortment', category: 'Seals & Fittings', targetQty: 50, actualQty: 55 },
    { id: 'R6', sku: 'SKU-06', item: 'Gasket Sheets', category: 'Valves & Actuators', targetQty: 120, actualQty: 96 },
    { id: 'R7', sku: 'SKU-07', item: 'Grease Cartridge', category: 'Lubricants', targetQty: 90, actualQty: 70 }, // missing lookup #1
    { id: 'R8', sku: 'SKU-08', item: 'M8 Bolt Pack', category: 'Fasteners', targetQty: 60, actualQty: 48 },
    { id: 'R9', sku: 'SKU-09', item: 'Filter Cartridge', category: 'Lubricants', targetQty: 100, actualQty: 'invalid' }, // invalid number
    { id: 'R10', sku: 'SKU-10', item: 'Spring Washer Set', category: 'Fasteners', targetQty: 70, actualQty: 60, circularRef: true }, // circular dependency
    { id: 'R11', sku: 'SKU-11', item: 'Ball Bearing 608', category: 'Seals & Fittings', targetQty: 40, actualQty: 0 },
    { id: 'R12', sku: 'SKU-12', item: 'Solenoid Valve', category: 'Valves & Actuators', targetQty: 110, actualQty: 88 }, // missing lookup #2
  ],
  challenge: [
    { id: 'R1', sku: 'SKU-01', item: 'Hydraulic Seals', category: 'Seals & Fittings', targetQty: 100, actualQty: 80 },
    { id: 'R2', sku: 'SKU-02', item: 'Pneumatic Valves', category: 'Valves & Actuators', targetQty: 150, actualQty: 150 },
    { id: 'R3', sku: 'SKU-03', item: 'Lubricant 5L', category: 'Lubricants', targetQty: 80, actualQty: null }, // blank #1
    { id: 'R4', sku: 'SKU-04', item: 'Coupling Joints', category: 'Fasteners', targetQty: 0, actualQty: 40 }, // divide-by-zero #1
    { id: 'R5', sku: 'SKU-05', item: 'O-Ring Assortment', category: 'Seals & Fittings', targetQty: 50, actualQty: 55 },
    { id: 'R6', sku: 'SKU-06', item: 'Gasket Sheets', category: 'Valves & Actuators', targetQty: 120, actualQty: 96 },
    { id: 'R7', sku: 'SKU-07', item: 'Grease Cartridge', category: 'Lubricants', targetQty: 90, actualQty: 70 }, // missing lookup #1 (absent from master)
    { id: 'R8', sku: 'SKU-08', item: 'M8 Bolt Pack', category: 'Fasteners', targetQty: 60, actualQty: 48 },
    { id: 'R9', sku: 'SKU-09', item: 'Filter Cartridge', category: 'Lubricants', targetQty: 100, actualQty: 'invalid' }, // invalid #1
    { id: 'R10', sku: 'SKU-10', item: 'Spring Washer Set', category: 'Fasteners', targetQty: 70, actualQty: 60, circularRef: true }, // circular #1
    { id: 'R11', sku: 'SKU-11', item: 'Ball Bearing 608', category: 'Seals & Fittings', targetQty: 0, actualQty: 0 }, // divide-by-zero #2 (ambiguous: truly inactive SKU or a data-entry gap?)
    { id: 'R12', sku: 'SKU-12', item: 'Solenoid Valve', category: 'Valves & Actuators', targetQty: 110, actualQty: 88 }, // missing lookup #2 (case-mismatched key in master list)
    { id: 'R13', sku: 'SKU-13', item: 'Anti-Vibration Pad', category: 'Seals & Fittings', targetQty: 65, actualQty: null }, // blank #2
    { id: 'R14', sku: 'SKU-14', item: 'Flow Sensor', category: 'Valves & Actuators', targetQty: 85, actualQty: 'invalid' }, // invalid #2
    { id: 'R15', sku: 'SKU-15', item: 'Chain Lubricant', category: 'Lubricants', targetQty: 95, actualQty: 76, circularRef: true }, // circular #2
    { id: 'R16', sku: 'SKU-16', item: 'Hex Nut Assortment', category: 'Fasteners', targetQty: 55, actualQty: 44 },
  ],
};

// Master price lists deliberately omit the "missing lookup" SKUs (and, on
// challenge, key SKU-12 under a mismatched case to illustrate why *exact*
// match lookup is brittle) so an un-guarded exact-match lookup fails.
const MASTER_PRICE_LISTS: Record<LabDifficulty, MasterPriceEntry[]> = {
  beginner: [
    { sku: 'SKU-01', unitCost: 450 }, { sku: 'SKU-02', unitCost: 320 }, { sku: 'SKU-03', unitCost: 850 },
    { sku: 'SKU-04', unitCost: 120 }, { sku: 'SKU-05', unitCost: 200 }, { sku: 'SKU-06', unitCost: 600 },
    { sku: 'SKU-08', unitCost: 90 }, // SKU-07 intentionally absent
  ],
  intermediate: [
    { sku: 'SKU-01', unitCost: 450 }, { sku: 'SKU-02', unitCost: 320 }, { sku: 'SKU-03', unitCost: 850 },
    { sku: 'SKU-04', unitCost: 120 }, { sku: 'SKU-05', unitCost: 200 }, { sku: 'SKU-06', unitCost: 600 },
    { sku: 'SKU-08', unitCost: 90 }, { sku: 'SKU-09', unitCost: 340 }, { sku: 'SKU-10', unitCost: 55 },
    { sku: 'SKU-11', unitCost: 30 }, // SKU-07 and SKU-12 intentionally absent
  ],
  challenge: [
    { sku: 'SKU-01', unitCost: 450 }, { sku: 'SKU-02', unitCost: 320 }, { sku: 'SKU-03', unitCost: 850 },
    { sku: 'SKU-04', unitCost: 120 }, { sku: 'SKU-05', unitCost: 200 }, { sku: 'SKU-06', unitCost: 600 },
    { sku: 'SKU-08', unitCost: 90 }, { sku: 'SKU-09', unitCost: 340 }, { sku: 'SKU-10', unitCost: 55 },
    { sku: 'SKU-11', unitCost: 30 }, { sku: 'sku-12', unitCost: 275 }, // case-mismatched key: exact match fails against "SKU-12"
    { sku: 'SKU-13', unitCost: 65 }, { sku: 'SKU-14', unitCost: 410 }, { sku: 'SKU-15', unitCost: 180 }, { sku: 'SKU-16', unitCost: 22 },
    // SKU-07 intentionally absent
  ],
};

type TotalFormula = 'SUM' | 'AVERAGE' | 'COUNT';
type RateFormula = 'ACTUAL_DIV_TARGET' | 'TARGET_DIV_ACTUAL' | 'SUBTRACT';
type LookupKey = 'SKU' | 'NAME';
type StatusLogic = 'STANDARD' | 'INVERTED';
type PivotDimension = 'category' | 'status' | 'none';

interface MisConfigState {
  selectedTotalFormula: TotalFormula;
  selectedRateFormula: RateFormula;
  selectedLookupKey: LookupKey;
  statusLogic: StatusLogic;
  achievementThreshold: number;
  pivotDimension: PivotDimension;
  guardDivideByZero: boolean;
  imputeBlankActual: boolean;
  resolveInvalidNumbers: boolean;
  fixMissingLookup: boolean;
  breakCircularRef: boolean;
}

const INITIAL_CONFIG: MisConfigState = {
  selectedTotalFormula: 'SUM',
  selectedRateFormula: 'ACTUAL_DIV_TARGET',
  selectedLookupKey: 'SKU',
  statusLogic: 'STANDARD',
  achievementThreshold: 80,
  pivotDimension: 'category',
  guardDivideByZero: false,
  imputeBlankActual: false,
  resolveInvalidNumbers: false,
  fixMissingLookup: false,
  breakCircularRef: false,
};

function capToSix(labels: string[], values: number[]): { labels: string[]; values: number[] } {
  if (labels.length <= 6) return { labels, values };
  const pairs = labels.map((l, i) => ({ l, v: values[i] })).sort((a, b) => b.v - a.v);
  const top = pairs.slice(0, 5);
  const restTotal = pairs.slice(5).reduce((s, p) => s + p.v, 0);
  return { labels: [...top.map((p) => p.l), 'Other'], values: [...top.map((p) => p.v), restTotal] };
}

export default function SpreadsheetMisLab({ variant, onDirty, onSubmit }: SimulatorProps) {
  const rows = ROW_POOLS[variant];
  const masterList = MASTER_PRICE_LISTS[variant];
  const { state, set, undo, redo, reset, canUndo, canRedo, stepIndex } = useUndoableState<MisConfigState>(INITIAL_CONFIG);
  const [misMemo, setMisMemo] = useState(
    'Achievement Rate = (Actual / Target) x 100 using exact-match SKU lookup for unit cost. Guarded divide-by-zero on zero-target rows, imputed blank/invalid actuals to 0, resolved missing lookups to the category-average unit cost, and broke the circular Total Value reference before aggregating with SUM(TotalValue).'
  );

  const update = (patch: Partial<MisConfigState>) => {
    set((prev) => ({ ...prev, ...patch }));
    onDirty();
  };

  // Category-average unit cost, computed from whatever the master list
  // actually resolves (never hardcoded), used as the fallback for missing
  // lookup keys once the learner opts to fix them.
  const fallbackCostByCategory = useMemo(() => {
    const sums: Record<string, { total: number; count: number }> = {};
    rows.forEach((r) => {
      const found = masterList.find((m) => m.sku === r.sku);
      if (found) {
        sums[r.category] = sums[r.category] || { total: 0, count: 0 };
        sums[r.category].total += found.unitCost;
        sums[r.category].count += 1;
      }
    });
    const out: Record<string, number> = {};
    Object.entries(sums).forEach(([cat, v]) => { out[cat] = v.count > 0 ? Math.round(v.total / v.count) : 0; });
    return out;
  }, [rows, masterList]);

  const defectCounts = useMemo(() => {
    let blank = 0, invalid = 0, missingLookup = 0, divZero = 0, circular = 0;
    rows.forEach((r) => {
      if (r.actualQty === null) blank += 1;
      if (r.actualQty === 'invalid') invalid += 1;
      if (r.targetQty === 0) divZero += 1;
      if (r.circularRef) circular += 1;
      if (!masterList.some((m) => m.sku === r.sku)) missingLookup += 1;
    });
    return { blank, invalid, missingLookup, divZero, circular };
  }, [rows, masterList]);

  const errorTypesPresent = useMemo(
    () => (Object.entries(defectCounts) as [keyof typeof defectCounts, number][]).filter(([, v]) => v > 0).map(([k]) => k),
    [defectCounts]
  );
  const resolvedFlags: Record<string, boolean> = {
    blank: state.imputeBlankActual,
    invalid: state.resolveInvalidNumbers,
    missingLookup: state.fixMissingLookup,
    divZero: state.guardDivideByZero,
    circular: state.breakCircularRef,
  };
  const totalErrorsCount = errorTypesPresent.length;
  const errorsResolvedCount = errorTypesPresent.filter((t) => resolvedFlags[t]).length;

  const resolvedRows = useMemo(() => {
    return rows.map((r) => {
      const actualUnresolved =
        (r.actualQty === null && !state.imputeBlankActual) ||
        (r.actualQty === 'invalid' && !state.resolveInvalidNumbers);
      const effectiveActual =
        r.actualQty === null ? (state.imputeBlankActual ? 0 : null)
          : r.actualQty === 'invalid' ? (state.resolveInvalidNumbers ? 0 : null)
          : r.actualQty;

      const master = masterList.find((m) => m.sku === r.sku);
      const lookupOk = Boolean(master) || state.fixMissingLookup;
      const unitCost = master ? master.unitCost : (state.fixMissingLookup ? (fallbackCostByCategory[r.category] ?? 0) : 0);

      let rate: number | null = null;
      let divideByZeroError = false;
      if (actualUnresolved) {
        rate = null;
      } else if (r.targetQty === 0) {
        if (state.guardDivideByZero) rate = 0;
        else divideByZeroError = true;
      } else {
        const a = effectiveActual ?? 0;
        if (state.selectedRateFormula === 'ACTUAL_DIV_TARGET') rate = Math.round((a / r.targetQty) * 100);
        else if (state.selectedRateFormula === 'TARGET_DIV_ACTUAL') rate = a > 0 ? Math.round((r.targetQty / a) * 100) : null;
        else rate = a - r.targetQty;
      }

      const circularUnresolved = Boolean(r.circularRef) && !state.breakCircularRef;
      const totalValue = circularUnresolved || actualUnresolved || !lookupOk ? 0 : (effectiveActual ?? 0) * unitCost;

      const status: 'ON_TRACK' | 'BELOW' | 'N/A' =
        rate === null ? 'N/A'
          : state.statusLogic === 'STANDARD'
            ? (rate >= state.achievementThreshold ? 'ON_TRACK' : 'BELOW')
            : (rate >= state.achievementThreshold ? 'BELOW' : 'ON_TRACK');

      return {
        ...r,
        effectiveActual,
        actualUnresolved,
        unitCost,
        lookupOk,
        rate,
        divideByZeroError,
        circularUnresolved,
        totalValue,
        status,
      };
    });
  }, [rows, masterList, state, fallbackCostByCategory]);

  const summary = useMemo(() => {
    const totalTarget = rows.reduce((s, r) => s + r.targetQty, 0);
    const totalActual = resolvedRows.reduce((s, r) => s + (r.effectiveActual ?? 0), 0);
    const overallRate = totalTarget > 0 ? Math.round((totalActual / totalTarget) * 100) : 0;

    let totalSales: number;
    if (state.selectedTotalFormula === 'SUM') totalSales = resolvedRows.reduce((s, r) => s + r.totalValue, 0);
    else if (state.selectedTotalFormula === 'AVERAGE') totalSales = Math.round(resolvedRows.reduce((s, r) => s + r.totalValue, 0) / resolvedRows.length);
    else totalSales = resolvedRows.length;

    const r1 = resolvedRows.find((r) => r.id === 'R1');
    return { totalTarget, totalActual, overallRate, totalSales, canonicalRate: r1?.rate ?? 0 };
  }, [rows, resolvedRows, state.selectedTotalFormula]);

  const pivotSource = useMemo(() => {
    if (state.pivotDimension === 'category') {
      const cats = Array.from(new Set(resolvedRows.map((r) => r.category)));
      return { labels: cats, values: cats.map((c) => resolvedRows.filter((r) => r.category === c).reduce((s, r) => s + r.totalValue, 0)) };
    }
    if (state.pivotDimension === 'status') {
      const statuses: Array<'ON_TRACK' | 'BELOW' | 'N/A'> = ['ON_TRACK', 'BELOW', 'N/A'];
      return { labels: statuses.map((s) => s.replace('_', ' ')), values: statuses.map((s) => resolvedRows.filter((r) => r.status === s).length) };
    }
    return { labels: resolvedRows.map((r) => r.sku), values: resolvedRows.map((r) => r.totalValue) };
  }, [state.pivotDimension, resolvedRows]);

  const doughnutData = useMemo(() => capToSix(pivotSource.labels, pivotSource.values), [pivotSource]);

  const handleExportCsv = () => {
    downloadCsv('spreadsheet_mis_grid.csv', resolvedRows.map((r) => ({
      row: r.id, sku: r.sku, item: r.item, category: r.category, target: r.targetQty,
      actual: r.actualUnresolved ? 'UNRESOLVED' : r.effectiveActual, unit_cost: r.unitCost,
      achievement_pct: r.rate ?? 'N/A', status: r.status, total_value: r.totalValue,
    })));
  };

  const handleExportJson = () => {
    downloadJson('spreadsheet_mis_recipe.json', {
      variant,
      formulaRecipe: {
        totalFormula: `${state.selectedTotalFormula}(TotalValue Range)`,
        rateFormula: state.selectedRateFormula === 'ACTUAL_DIV_TARGET' ? '(Actual / Target) * 100' : state.selectedRateFormula === 'TARGET_DIV_ACTUAL' ? '(Target / Actual) * 100' : 'Actual - Target',
        lookupKey: state.selectedLookupKey,
        statusFormula: state.statusLogic === 'STANDARD' ? `IF(Rate >= ${state.achievementThreshold}, "ON TRACK", "BELOW")` : `IF(Rate >= ${state.achievementThreshold}, "BELOW", "ON TRACK")`,
        pivotDimension: state.pivotDimension,
        supportedFunctions: ['SUM', 'AVERAGE', 'COUNT', 'IF', 'exact-match LOOKUP'],
      },
      hygieneFixes: {
        guardDivideByZero: state.guardDivideByZero,
        imputeBlankActual: state.imputeBlankActual,
        resolveInvalidNumbers: state.resolveInvalidNumbers,
        fixMissingLookup: state.fixMissingLookup,
        breakCircularRef: state.breakCircularRef,
      },
      gridSnapshot: resolvedRows,
      misMemo,
    });
  };

  const handleSubmit = () => {
    onSubmit({
      variant,
      selectedTotalFormula: state.selectedTotalFormula,
      selectedRateFormula: state.selectedRateFormula,
      selectedLookupKey: state.selectedLookupKey,
      statusLogic: state.statusLogic,
      achievementThreshold: state.achievementThreshold,
      pivotDimension: state.pivotDimension,
      guardDivideByZero: state.guardDivideByZero,
      imputeBlankActual: state.imputeBlankActual,
      resolveInvalidNumbers: state.resolveInvalidNumbers,
      fixMissingLookup: state.fixMissingLookup,
      breakCircularRef: state.breakCircularRef,
      canonicalRate: summary.canonicalRate,
      overallRate: summary.overallRate,
      totalSales: summary.totalSales,
      totalErrorsCount,
      errorsResolvedCount,
      misMemo,
      gridSnapshot: resolvedRows.map((r) => ({ id: r.id, sku: r.sku, totalValue: r.totalValue, status: r.status })),
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">SKU-01 Rate (Target 100, Act 80)</span>
          <span className={`text-xl font-black ${summary.canonicalRate === 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {summary.canonicalRate}%
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {summary.canonicalRate === 80 ? 'Correct (80% achieved)' : 'Formula error!'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Total Target vs Actual</span>
          <span className="text-xl font-black text-white">{summary.totalActual} / {summary.totalTarget}</span>
          <span className="text-[10px] text-purple-300 block mt-0.5">Overall: {summary.overallRate}%</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#131728] border border-purple-500/30 bg-purple-950/20">
          <span className="text-xs text-purple-300 font-bold block mb-1">Calculated Total Revenue</span>
          <span className="text-xl font-black text-purple-200">₹{summary.totalSales.toLocaleString()}</span>
          <span className="text-[10px] text-emerald-400 block mt-0.5">Formula: {state.selectedTotalFormula}(TotalValue)</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Data Hygiene Fixes</span>
          <span className={`text-xl font-black ${errorsResolvedCount === totalErrorsCount ? 'text-emerald-400' : 'text-amber-400'}`}>
            {errorsResolvedCount}/{totalErrorsCount}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">History step {stepIndex}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Grid + error inspector */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Table className="w-4 h-4 text-purple-400" />
                <span>Distributor Monthly MIS Worksheet ({rows.length} rows shown of 20x15 workbook)</span>
              </h2>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={undo} disabled={!canUndo} title="Undo last configuration change"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30 transition-colors">
                  <Undo2 className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={redo} disabled={!canRedo} title="Redo"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30 transition-colors">
                  <Redo2 className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => { reset(); onDirty(); }} title="Reset MIS configuration"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors">
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto max-h-80 overflow-y-auto rounded-xl border border-white/5">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/15 text-slate-400 text-[11px] bg-white/5 sticky top-0">
                    <th className="p-2">Row</th><th className="p-2">SKU</th><th className="p-2">Item</th>
                    <th className="p-2">Target</th><th className="p-2">Actual</th><th className="p-2">Unit Cost</th>
                    <th className="p-2">Achievement %</th><th className="p-2">Status (IF)</th><th className="p-2">Total Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {resolvedRows.map((r) => (
                    <tr key={r.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-2 text-slate-500 font-semibold">{r.id}</td>
                      <td className="p-2 text-purple-300 font-bold">{r.sku}</td>
                      <td className="p-2 text-slate-200 font-sans">{r.item}</td>
                      <td className="p-2 text-slate-300">{r.targetQty === 0 ? <span className="text-red-300">0 (÷0)</span> : r.targetQty}</td>
                      <td className="p-2 text-white font-bold">
                        {r.actualUnresolved ? <span className="text-red-300">{rows.find((x) => x.id === r.id)?.actualQty === null ? 'BLANK' : 'INVALID'}</span> : r.effectiveActual}
                      </td>
                      <td className="p-2 text-slate-300">{r.lookupOk ? `₹${r.unitCost}` : <span className="text-red-300">#N/A</span>}</td>
                      <td className="p-2">
                        {r.divideByZeroError ? (
                          <span className="px-1.5 py-0.5 rounded text-[11px] font-bold bg-red-500/20 text-red-300">#DIV/0!</span>
                        ) : r.rate === null ? (
                          <span className="px-1.5 py-0.5 rounded text-[11px] font-bold bg-red-500/20 text-red-300">#N/A</span>
                        ) : (
                          <span className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${r.rate >= state.achievementThreshold ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>{r.rate}%</span>
                        )}
                      </td>
                      <td className="p-2 text-slate-300 font-sans">{r.status.replace('_', ' ')}</td>
                      <td className="p-2 text-slate-200">
                        {r.circularUnresolved ? <span className="text-red-300 font-sans">#CIRCULAR!</span> : `₹${r.totalValue.toLocaleString()}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Error inspector */}
            <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 space-y-1.5">
              <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>Error Inspector ({errorsResolvedCount}/{totalErrorsCount} resolved)</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                {[
                  { key: 'blank', label: `Blank cells (${defectCounts.blank})`, fixed: state.imputeBlankActual },
                  { key: 'invalid', label: `Invalid numbers (${defectCounts.invalid})`, fixed: state.resolveInvalidNumbers },
                  { key: 'missingLookup', label: `Missing lookup keys (${defectCounts.missingLookup})`, fixed: state.fixMissingLookup },
                  { key: 'divZero', label: `Divide-by-zero rows (${defectCounts.divZero})`, fixed: state.guardDivideByZero },
                  { key: 'circular', label: `Circular dependencies (${defectCounts.circular})`, fixed: state.breakCircularRef },
                ].filter((d) => (defectCounts as Record<string, number>)[d.key] > 0).map((d) => (
                  <div key={d.key} className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border ${d.fixed ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border-red-500/30 text-red-300'}`}>
                    {d.fixed ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    <span>{d.label}</span>
                  </div>
                ))}
                {totalErrorsCount === 0 && <span className="text-slate-500 italic">No data-hygiene defects in this dataset.</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Formula templates + charts + submit */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
              <FunctionSquare className="w-4 h-4 text-purple-400" />
              <span>Formula Template Selector</span>
            </h3>

            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-slate-300 block">Total Value Column:</label>
              <div className="grid grid-cols-3 gap-2">
                {(['SUM', 'AVERAGE', 'COUNT'] as const).map((f) => (
                  <button key={f} type="button" onClick={() => update({ selectedTotalFormula: f })}
                    className={`py-2 rounded-xl border text-xs font-bold transition-all ${state.selectedTotalFormula === f ? 'bg-purple-600 text-white border-purple-500' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}>
                    ={f}()
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 text-xs pt-1">
              <label className="font-semibold text-slate-300 block">Achievement Rate Template:</label>
              <div className="space-y-1.5">
                <button type="button" onClick={() => update({ selectedRateFormula: 'ACTUAL_DIV_TARGET' })}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${state.selectedRateFormula === 'ACTUAL_DIV_TARGET' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                  =(Actual / Target) * 100 <span className="text-[10px] text-emerald-400 font-bold ml-1">(Correct: 80/100 = 80%)</span>
                </button>
                <button type="button" onClick={() => update({ selectedRateFormula: 'TARGET_DIV_ACTUAL' })}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${state.selectedRateFormula === 'TARGET_DIV_ACTUAL' ? 'bg-amber-500/20 border-amber-500/50 text-amber-200' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                  =(Target / Actual) * 100 <span className="text-[10px] text-amber-400 font-bold ml-1">(Inverted)</span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5 text-xs pt-1">
              <label className="font-semibold text-slate-300 block">Status Column (IF):</label>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => update({ statusLogic: 'STANDARD' })}
                  className={`p-2 rounded-xl border text-[11px] font-bold text-left transition-all ${state.statusLogic === 'STANDARD' ? 'bg-purple-600 text-white border-purple-500' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                  IF(Rate&ge;Threshold,&quot;ON TRACK&quot;,&quot;BELOW&quot;)
                </button>
                <button type="button" onClick={() => update({ statusLogic: 'INVERTED' })}
                  className={`p-2 rounded-xl border text-[11px] font-bold text-left transition-all ${state.statusLogic === 'INVERTED' ? 'bg-amber-500/20 text-amber-200 border-amber-500/50' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                  IF(Rate&ge;Threshold,&quot;BELOW&quot;,&quot;ON TRACK&quot;) <span className="text-amber-400">(reversed)</span>
                </button>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <label className="text-[11px] text-slate-400">Threshold:</label>
                <input type="range" min={50} max={100} step={5} value={state.achievementThreshold}
                  onChange={(e) => update({ achievementThreshold: Number(e.target.value) })} className="flex-1 accent-purple-500" />
                <span className="text-[11px] font-mono text-purple-300">{state.achievementThreshold}%</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs pt-1">
              <label className="font-semibold text-slate-300 block">Exact-Match Lookup Key (Unit Cost):</label>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => update({ selectedLookupKey: 'SKU' })}
                  className={`py-2 rounded-xl border text-xs font-bold transition-all ${state.selectedLookupKey === 'SKU' ? 'bg-purple-600 text-white border-purple-500' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}>
                  SKU Code
                </button>
                <button type="button" onClick={() => update({ selectedLookupKey: 'NAME' })}
                  className={`py-2 rounded-xl border text-xs font-bold transition-all ${state.selectedLookupKey === 'NAME' ? 'bg-purple-600 text-white border-purple-500' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}>
                  Item Name <span className="text-amber-400">(collision risk)</span>
                </button>
              </div>
            </div>

            {/* Data hygiene fix pipeline */}
            <div className="space-y-1.5 text-xs pt-2 border-t border-white/10">
              <label className="font-semibold text-slate-300 block">Data Hygiene Fix Pipeline:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {([
                  ['guardDivideByZero', 'Guard ÷0 rows'],
                  ['imputeBlankActual', 'Impute blank actuals'],
                  ['resolveInvalidNumbers', 'Resolve invalid numbers'],
                  ['fixMissingLookup', 'Fallback missing lookups'],
                  ['breakCircularRef', 'Break circular reference'],
                ] as const).map(([key, label]) => (
                  <button key={key} type="button" onClick={() => update({ [key]: !state[key] } as Partial<MisConfigState>)}
                    className={`p-2 rounded-xl border text-[11px] font-bold text-left transition-all ${state[key] ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reference arrows / dependency map */}
            <div className="space-y-1 pt-2 border-t border-white/10 text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-purple-400" /><span>Total Value ← Actual x Unit Cost</span></div>
              <div className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-purple-400" /><span>Achievement % ← (Actual ÷ Target) x 100, guarded</span></div>
              <div className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-purple-400" /><span>Unit Cost ← LOOKUP({state.selectedLookupKey}, Master Price List)</span></div>
              <div className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-purple-400" /><span>Grand Total ← {state.selectedTotalFormula}(Total Value Range)</span></div>
            </div>
          </div>

          <ChartFrame
            title="Achievement % by SKU"
            icon={<BarChart3 className="w-4 h-4 text-purple-400" />}
            tableHeaders={['SKU', 'Achievement %']}
            tableRows={resolvedRows.map((r) => [r.sku, r.rate ?? 'N/A'])}
          >
            <CompareBarChart
              labels={resolvedRows.map((r) => r.sku)}
              series={[{
                label: 'Achievement %',
                data: resolvedRows.map((r) => r.rate ?? 0),
                statusOverride: resolvedRows.map((r) => (r.rate === null ? 'critical' : r.rate < state.achievementThreshold ? 'warning' : 'good')),
              }]}
              yLabel="Achievement %"
            />
          </ChartFrame>

          <ChartFrame
            title={`Total Value by ${state.pivotDimension === 'category' ? 'Category' : state.pivotDimension === 'status' ? 'Status' : 'SKU'} (Pivot)`}
            icon={<PieChartIcon className="w-4 h-4 text-purple-400" />}
            tableHeaders={['Group', 'Value']}
            tableRows={doughnutData.labels.map((l, i) => [l, doughnutData.values[i]])}
            controls={
              <select value={state.pivotDimension} onChange={(e) => update({ pivotDimension: e.target.value as PivotDimension })}
                className="text-[10px] font-bold px-2 py-1 rounded-lg bg-black/40 border border-white/15 text-slate-300">
                <option value="category">Pivot: Category</option>
                <option value="status">Pivot: Status</option>
                <option value="none">Pivot: SKU</option>
              </select>
            }
          >
            <BreakdownDoughnutChart labels={doughnutData.labels} values={doughnutData.values} centerLabel="Total" centerValue={`₹${summary.totalSales.toLocaleString()}`} />
          </ChartFrame>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-2">
            <label htmlFor="mis-memo" className="text-xs font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>MIS Formula Recipe Documentation</span>
            </label>
            <textarea id="mis-memo" rows={3} value={misMemo} onChange={(e) => { setMisMemo(e.target.value); onDirty(); }}
              className="w-full text-xs p-3 rounded-xl bg-black/30 border border-white/15 text-slate-200 focus:outline-none focus:border-purple-500/50" />
            <p className="text-[10px] text-slate-500">Supported subset: SUM, AVERAGE, COUNT, IF and exact-match LOOKUP only — this is not a full Excel-compatible engine; arbitrary formula strings, macros, and external links are not supported.</p>
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={handleExportCsv} title="Export MIS grid as CSV"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] font-bold transition-colors">
              <Download className="w-3.5 h-3.5" /><span>CSV</span>
            </button>
            <button type="button" onClick={handleExportJson} title="Export formula recipe as JSON"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] font-bold transition-colors">
              <FileJson className="w-3.5 h-3.5" /><span>JSON</span>
            </button>
          </div>

          <button type="button" onClick={handleSubmit}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold transition-all flex items-center justify-center gap-2">
            <Send className="w-4 h-4" />
            <span>Submit MIS Formula Recipe</span>
          </button>
        </div>
      </div>
    </div>
  );
}
