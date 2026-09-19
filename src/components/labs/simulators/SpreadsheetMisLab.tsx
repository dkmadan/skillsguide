'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { LabScenarioVariant, LabDifficulty } from '@/lib/labs/types';
import { useUndoableState } from '@/lib/labs/useUndoableState';
import { downloadCsv, downloadJson } from '@/lib/labs/exportHelper';
import {
  evaluateFormula,
  isFormulaError,
  CellValue,
  FormulaError,
  colLettersToIndex,
  indexToColLetters,
  parseCellAddress
} from '@/lib/labs/formulaParser';
import {
  Table,
  FunctionSquare,
  Sparkles,
  Undo2,
  Redo2,
  RotateCcw,
  Download,
  FileJson,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Filter,
  ArrowUpDown,
  Copy,
  Plus,
  Trash2,
  Search
} from 'lucide-react';

interface SimulatorProps {
  scenario?: LabScenarioVariant;
  variant: LabDifficulty;
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

interface CellData {
  raw: string; // The formula or literal entered by the user e.g. "=SUM(D2:D10)" or "80"
}

type GridState = Record<string, CellData>;

// Column configurations
const COLS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const COL_HEADERS: Record<string, string> = {
  A: 'SKU (A)',
  B: 'Item Name (B)',
  C: 'Category (C)',
  D: 'Target Qty (D)',
  E: 'Actual Qty (E)',
  F: 'Achieve % (F)',
  G: 'Total Val (G)'
};

// Master catalog data for XLOOKUP/VLOOKUP reference
export const MASTER_CATALOG = [
  { sku: 'SKU-01', name: 'Hydraulic Seals', unitCost: 450 },
  { sku: 'SKU-02', name: 'Pneumatic Valves', unitCost: 320 },
  { sku: 'SKU-03', name: 'Lubricant 5L', unitCost: 850 },
  { sku: 'SKU-04', name: 'Coupling Joints', unitCost: 120 },
  { sku: 'SKU-05', name: 'O-Ring Assortment', unitCost: 200 },
  { sku: 'SKU-06', name: 'Gasket Sheets', unitCost: 600 },
  { sku: 'SKU-07', name: 'Grease Cartridge', unitCost: 180 },
  { sku: 'SKU-08', name: 'M8 Bolt Pack', unitCost: 90 },
  { sku: 'SKU-09', name: 'Filter Cartridge', unitCost: 340 },
  { sku: 'SKU-10', name: 'Spring Washer Set', unitCost: 55 }
];

// Initial starter grid with authentic broken formulas matching the scenario
function buildInitialGrid(variant: LabDifficulty): GridState {
  const grid: GridState = {};

  const baseRows = [
    { sku: 'SKU-01', item: 'Hydraulic Seals', cat: 'Seals & Fittings', target: 100, actual: 80, formulaF: '=E2/D2*100', formulaG: '=E2*450' },
    { sku: 'SKU-02', item: 'Pneumatic Valves', cat: 'Valves & Actuators', target: 150, actual: 150, formulaF: '=E3/D3*100', formulaG: '=E3*320' },
    { sku: 'SKU-03', item: 'Lubricant 5L', cat: 'Lubricants', target: 80, actual: 0, formulaF: '=E4/D4*100', formulaG: '=E4*850' },
    { sku: 'SKU-04', item: 'Coupling Joints', cat: 'Fasteners', target: 0, actual: 40, formulaF: '=E5/D5*100', formulaG: '=E5*120' }, // divide by zero defect!
    { sku: 'SKU-05', item: 'O-Ring Assortment', cat: 'Seals & Fittings', target: 50, actual: 55, formulaF: '=E6/D6*100', formulaG: '=E6*200' },
    { sku: 'SKU-06', item: 'Gasket Sheets', cat: 'Valves & Actuators', target: 120, actual: 96, formulaF: '=E7/D7*100', formulaG: '=E7*600' },
    { sku: 'SKU-07', item: 'Grease Cartridge', cat: 'Lubricants', target: 90, actual: 70, formulaF: '=E8/D8*100', formulaG: '=E8*180' },
    { sku: 'SKU-08', item: 'M8 Bolt Pack', cat: 'Fasteners', target: 60, actual: 48, formulaF: '=E9/D9*100', formulaG: '=E9*90' }
  ];

  baseRows.forEach((r, idx) => {
    const rowNum = idx + 2; // Row 1 is header
    grid[`A${rowNum}`] = { raw: r.sku };
    grid[`B${rowNum}`] = { raw: r.item };
    grid[`C${rowNum}`] = { raw: r.cat };
    grid[`D${rowNum}`] = { raw: String(r.target) };
    grid[`E${rowNum}`] = { raw: String(r.actual) };
    grid[`F${rowNum}`] = { raw: r.formulaF };
    grid[`G${rowNum}`] = { raw: r.formulaG };
  });

  // Summary Row at Row 10
  grid['A10'] = { raw: 'TOTAL' };
  grid['B10'] = { raw: '=COUNTA(A2:A9)' };
  grid['C10'] = { raw: '-' };
  grid['D10'] = { raw: '=SUM(D2:D9)' };
  grid['E10'] = { raw: '=SUM(E2:E9)' };
  grid['F10'] = { raw: '=AVERAGE(F2:F9)' };
  grid['G10'] = { raw: '=SUM(G2:G9)' };

  return grid;
}

export default function SpreadsheetMisLab({ variant, onDirty, onSubmit }: SimulatorProps) {
  const initialGrid = useMemo(() => buildInitialGrid(variant), [variant]);
  const { state: grid, set: setGrid, undo, redo, reset, canUndo, canRedo } = useUndoableState<GridState>(initialGrid);

  const [activeCell, setActiveCell] = useState<string>('F5');
  const [editingFormula, setEditingFormula] = useState<string>(grid['F5']?.raw || '');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [showFormulas, setShowFormulas] = useState<boolean>(false);

  // Sync editing formula when active cell changes
  const handleSelectCell = (addr: string) => {
    setActiveCell(addr);
    setEditingFormula(grid[addr]?.raw || '');
  };

  const updateCell = useCallback((addr: string, rawVal: string) => {
    setGrid(prev => ({
      ...prev,
      [addr]: { raw: rawVal }
    }));
    onDirty();
  }, [setGrid, onDirty]);

  const handleCommitFormula = () => {
    updateCell(activeCell, editingFormula);
  };

  // Evaluate all cells in grid with dependency resolution
  const evaluatedGrid = useMemo(() => {
    const computedValues: Record<string, CellValue | FormulaError> = {};
    const evalStack = new Set<string>();

    const getCellValue = (addr: string): CellValue | FormulaError => {
      if (evalStack.has(addr)) {
        return { isError: true, type: '#CIRCULAR!', message: `Circular reference detected at ${addr}` };
      }

      if (computedValues[addr] !== undefined) {
        return computedValues[addr];
      }

      const cell = grid[addr];
      if (!cell || cell.raw.trim() === '') {
        return null;
      }

      const raw = cell.raw.trim();
      if (!raw.startsWith('=')) {
        // Plain number or string
        const num = Number(raw);
        const val = isNaN(num) ? raw : num;
        computedValues[addr] = val;
        return val;
      }

      evalStack.add(addr);
      try {
        const val = evaluateFormula(raw, { getCellValue, evaluatingStack: evalStack });
        computedValues[addr] = val;
        return val;
      } finally {
        evalStack.delete(addr);
      }
    };

    // Pre-evaluate all cells present in grid
    Object.keys(grid).forEach(addr => {
      getCellValue(addr);
    });

    return computedValues;
  }, [grid]);

  // Error count in sheet
  const errorCount = useMemo(() => {
    return Object.values(evaluatedGrid).filter(v => isFormulaError(v)).length;
  }, [evaluatedGrid]);

  // Copy/Fill formula down from active cell
  const handleFillDown = () => {
    const parsed = parseCellAddress(activeCell);
    if (!parsed) return;
    const colName = indexToColLetters(parsed.col);
    const sourceFormula = grid[activeCell]?.raw || '';
    if (!sourceFormula.startsWith('=')) return;

    // Fill next 3 rows
    for (let r = parsed.row + 1; r <= parsed.row + 4; r++) {
      const targetAddr = `${colName}${r}`;
      // Adjust relative row numbers in formula e.g. E2/D2 -> E3/D3
      const adjusted = sourceFormula.replace(/([A-Z])([0-9]+)/g, (match, col, row) => {
        const rowNum = parseInt(row, 10);
        const delta = r - parsed.row;
        return `${col}${rowNum + delta}`;
      });
      updateCell(targetAddr, adjusted);
    }
  };

  // Submit assessment payload
  const handleSubmit = () => {
    const answers = {
      variant,
      gridState: grid,
      errorCount,
      totalSum: evaluatedGrid['G10'],
      averageAchieve: evaluatedGrid['F10'],
      repairedZeroDiv: !isFormulaError(evaluatedGrid['F5']),
      repairedCircular: !Object.values(evaluatedGrid).some(v => isFormulaError(v) && v.type === '#CIRCULAR!')
    };
    onSubmit(answers);
  };

  // Display rows from Row 2 to Row 10
  const rowIndices = [2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* ===================================================================== */}
      {/* SPREADSHEET ACTION BAR & FORMULA EDITOR                               */}
      {/* ===================================================================== */}
      <div className="p-3 rounded-2xl bg-[#0f1325] border border-white/10 space-y-3 shadow-xl">
        {/* Top Controls: Toolbar shortcuts */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[11px]">
              MIS Grid
            </span>
            <span className="text-slate-400 text-xs">Formula Bar &amp; Range Editor</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowFormulas(!showFormulas)}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all ${
                showFormulas ? 'bg-purple-600/30 text-purple-200 border-purple-500/40' : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
              }`}
            >
              <FunctionSquare className="w-3.5 h-3.5 inline mr-1" />
              {showFormulas ? 'Show Values' : 'Show Formulas'}
            </button>

            <button
              onClick={handleFillDown}
              className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all flex items-center gap-1"
              title="Copy active cell formula down to next rows"
            >
              <Copy className="w-3.5 h-3.5 text-cyan-400" />
              <span>Fill Down</span>
            </button>

            <button
              onClick={undo}
              disabled={!canUndo}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 border border-white/10 text-slate-300"
              title="Undo formula edit"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={redo}
              disabled={!canRedo}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 border border-white/10 text-slate-300"
              title="Redo formula edit"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Formula Input Bar (fx) */}
        <div className="flex items-center gap-2">
          {/* Active Cell Indicator */}
          <div className="w-14 px-2 py-1.5 rounded-xl bg-black/50 border border-white/10 font-mono font-bold text-center text-purple-300 text-xs shadow-inner">
            {activeCell}
          </div>

          {/* Formula Prefix Badge */}
          <div className="px-2 py-1 rounded-lg bg-purple-500/20 text-purple-300 font-mono font-bold text-xs">
            fx
          </div>

          {/* Direct Formula Input Field */}
          <input
            type="text"
            value={editingFormula}
            onChange={(e) => setEditingFormula(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCommitFormula();
            }}
            placeholder="Enter formula or literal, e.g. =IF(D5=0, 0, E5/D5*100) or =SUM(G2:G9)"
            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 font-mono text-xs text-white focus:outline-none focus:border-purple-500/60"
          />

          <button
            onClick={handleCommitFormula}
            className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shadow-md"
          >
            Apply
          </button>
        </div>

        {/* Quick Function Helper Chips */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400 pt-1">
          <span className="font-semibold text-slate-300">Quick Formula Templates:</span>
          {[
            { label: 'Guard Zero-Div', formula: '=IF(D5=0, 0, E5/D5*100)' },
            { label: 'SUM Range', formula: '=SUM(G2:G9)' },
            { label: 'AVERAGE Range', formula: '=AVERAGE(F2:F9)' },
            { label: 'ROUND', formula: '=ROUND(E2/D2*100, 2)' }
          ].map((chip, idx) => (
            <button
              key={idx}
              onClick={() => {
                setEditingFormula(chip.formula);
                updateCell(activeCell, chip.formula);
              }}
              className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-purple-300 font-mono text-[10px] transition-colors"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* SPREADSHEET TABLE GRID                                                */}
      {/* ===================================================================== */}
      <div className="rounded-2xl bg-[#0b0e1b] border border-white/10 overflow-x-auto shadow-2xl">
        <table className="w-full border-collapse text-left font-mono">
          <thead>
            <tr className="bg-[#12162a] border-b border-white/10 text-[11px] text-slate-400">
              <th className="w-12 p-2.5 text-center border-r border-white/10 font-bold bg-[#0e1122]">#</th>
              {COLS.map((col) => (
                <th key={col} className="p-2.5 border-r border-white/10 font-bold text-slate-300 min-w-[130px]">
                  {COL_HEADERS[col]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rowIndices.map((rowNum) => {
              const isSummaryRow = rowNum === 10;
              return (
                <tr
                  key={rowNum}
                  className={`border-b border-white/5 transition-colors ${
                    isSummaryRow ? 'bg-purple-950/20 font-bold border-t-2 border-purple-500/30' : 'hover:bg-white/[0.02]'
                  }`}
                >
                  {/* Row Index Header */}
                  <td className="p-2 text-center border-r border-white/10 font-bold text-slate-500 bg-[#0e1122]/50 select-none">
                    {rowNum}
                  </td>

                  {/* Columns A to G */}
                  {COLS.map((col) => {
                    const addr = `${col}${rowNum}`;
                    const rawVal = grid[addr]?.raw || '';
                    const evalResult = evaluatedGrid[addr];
                    const isError = isFormulaError(evalResult);
                    const isSelected = activeCell === addr;

                    let displayVal: string = '';
                    if (showFormulas && rawVal.startsWith('=')) {
                      displayVal = rawVal;
                    } else if (isError) {
                      displayVal = evalResult.type;
                    } else if (evalResult !== null && evalResult !== undefined) {
                      displayVal = typeof evalResult === 'number' && !Number.isInteger(evalResult)
                        ? evalResult.toFixed(2)
                        : String(evalResult);
                    }

                    return (
                      <td
                        key={col}
                        onClick={() => handleSelectCell(addr)}
                        className={`p-2 border-r border-white/5 cursor-pointer relative transition-all ${
                          isSelected
                            ? 'ring-2 ring-purple-500 bg-purple-500/10 z-10'
                            : isError
                            ? 'bg-red-500/10 text-red-400'
                            : 'text-slate-200'
                        }`}
                        title={`Cell ${addr}: ${rawVal}`}
                      >
                        <div className="flex items-center justify-between min-h-[22px]">
                          <span className={`truncate ${isError ? 'text-red-400 font-bold' : ''}`}>
                            {displayVal || <span className="text-slate-600 font-normal">--</span>}
                          </span>

                          {isError && (
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" title={evalResult.message} />
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ===================================================================== */}
      {/* STATUS METRICS & SUBMIT BAR                                           */}
      {/* ===================================================================== */}
      <div className="p-4 rounded-2xl bg-[#0f1325] border border-white/10 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Total Errors:</span>
            <span className={`px-2 py-0.5 rounded-md font-bold font-mono ${errorCount === 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
              {errorCount} {errorCount === 0 ? '✓ (Clean)' : 'Defects'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Total Valuation (G10):</span>
            <span className="font-bold text-white font-mono">
              ₹{typeof evaluatedGrid['G10'] === 'number' ? evaluatedGrid['G10'].toLocaleString() : '--'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Average Achievement (F10):</span>
            <span className="font-bold text-cyan-300 font-mono">
              {typeof evaluatedGrid['F10'] === 'number' ? `${evaluatedGrid['F10'].toFixed(1)}%` : '--'}
            </span>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
        >
          <span>Submit Workbook for Verification</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
