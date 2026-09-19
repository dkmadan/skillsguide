'use client';

import React, { useId, useState } from 'react';
import { Table2, BarChart3 } from 'lucide-react';

interface ChartFrameProps {
  title: string;
  icon?: React.ReactNode;
  subtitle?: string;
  /** Column headers for the accessible data-table alternative. */
  tableHeaders: string[];
  /** Row values, same order as tableHeaders. */
  tableRows: (string | number)[][];
  children: React.ReactNode;
  /** Optional right-aligned controls (e.g. a series toggle) rendered in the header. */
  controls?: React.ReactNode;
  height?: number;
}

/**
 * Shared frame for every lab chart: gives each visualization a labelled
 * heading plus a keyboard-operable "data table" alternative, per the shared
 * implementation contract ("chart data tables" / "text alternative").
 */
export default function ChartFrame({
  title,
  icon,
  subtitle,
  tableHeaders,
  tableRows,
  children,
  controls,
  height = 220,
}: ChartFrameProps) {
  const [showTable, setShowTable] = useState(false);
  const panelId = useId();

  return (
    <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            {icon}
            <span>{title}</span>
          </h3>
          {subtitle && <p className="text-[11px] text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {controls}
          <button
            type="button"
            onClick={() => setShowTable((v) => !v)}
            aria-pressed={showTable}
            aria-controls={panelId}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-bold text-slate-300 transition-colors"
            title="Toggle accessible data table view"
          >
            {showTable ? <BarChart3 className="w-3 h-3" /> : <Table2 className="w-3 h-3" />}
            <span>{showTable ? 'View chart' : 'View table'}</span>
          </button>
        </div>
      </div>

      <div id={panelId}>
        {showTable ? (
          <div className="overflow-x-auto max-h-64 overflow-y-auto rounded-xl border border-white/10">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 bg-white/5 sticky top-0">
                  {tableHeaders.map((h) => (
                    <th key={h} className="p-2 font-bold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {tableRows.map((row, i) => (
                  <tr key={i} className="hover:bg-white/5">
                    {row.map((cell, j) => (
                      <td key={j} className="p-2 text-slate-300 font-mono">{cell}</td>
                    ))}
                  </tr>
                ))}
                {tableRows.length === 0 && (
                  <tr><td className="p-3 text-slate-500 italic" colSpan={tableHeaders.length}>No data for current filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ height }}>{children}</div>
        )}
      </div>
    </div>
  );
}
