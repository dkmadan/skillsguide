'use client';

import React, { useState, useMemo } from 'react';
import { LabScenarioVariant } from '@/lib/labs/types';
import { downloadCsv, downloadJson } from '@/lib/labs/exportHelper';

interface Props {
  scenario?: LabScenarioVariant;
  variant: 'beginner' | 'intermediate' | 'challenge';
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

export default function BusinessFinancialModelLab({ onDirty, onSubmit }: Props) {
  const [unitsSold, setUnitsSold] = useState<number>(120);
  const [unitPrice, setUnitPrice] = useState<number>(50); // $50
  const [variableCostPerUnit, setVariableCostPerUnit] = useState<number>(30); // $30
  const [fixedCostsMonthly, setFixedCostsMonthly] = useState<number>(1000); // $1000
  const [collectionLagPercent, setCollectionLagPercent] = useState<number>(30); // 30% collected next month
  const [openingCash, setOpeningCash] = useState<number>(500);

  const model = useMemo(() => {
    const revenue = unitsSold * unitPrice;
    const totalVariableCost = unitsSold * variableCostPerUnit;
    const contributionMarginPerUnit = unitPrice - variableCostPerUnit;
    const totalContribution = revenue - totalVariableCost;
    const netOperatingIncome = totalContribution - fixedCostsMonthly;

    // Break-even units = Fixed Costs / Contribution per unit
    const breakEvenUnits = contributionMarginPerUnit > 0
      ? Math.round(fixedCostsMonthly / contributionMarginPerUnit)
      : Infinity;

    // Cash flow:
    // Cash in = (1 - lag%) * revenue + opening cash
    const cashIn = revenue * (1 - collectionLagPercent / 100);
    const cashOut = totalVariableCost + fixedCostsMonthly;
    const closingCash = openingCash + cashIn - cashOut;

    return {
      revenue,
      totalVariableCost,
      contributionMarginPerUnit,
      totalContribution,
      netOperatingIncome,
      breakEvenUnits,
      cashIn,
      cashOut,
      closingCash,
      hasCashShortfall: closingCash < 0
    };
  }, [unitsSold, unitPrice, variableCostPerUnit, fixedCostsMonthly, collectionLagPercent, openingCash]);

  const handleExportCsv = () => {
    const rows = [
      { metric: 'Units Sold', value: unitsSold },
      { metric: 'Unit Price', value: `$${unitPrice}` },
      { metric: 'Variable Cost / Unit', value: `$${variableCostPerUnit}` },
      { metric: 'Contribution Margin / Unit', value: `$${model.contributionMarginPerUnit}` },
      { metric: 'Fixed Costs Monthly', value: `$${fixedCostsMonthly}` },
      { metric: 'Break-Even Units Target', value: isFinite(model.breakEvenUnits) ? model.breakEvenUnits : 'N/A' },
      { metric: 'Total Revenue', value: `$${model.revenue}` },
      { metric: 'Net Operating Income', value: `$${model.netOperatingIncome}` },
      { metric: 'Closing Cash Balance', value: `$${model.closingCash}` },
    ];
    downloadCsv('financial_budget_model.csv', rows);
  };

  const handleExportJson = () => {
    downloadJson('financial_budget_model.json', {
      assumptions: { unitsSold, unitPrice, variableCostPerUnit, fixedCostsMonthly, collectionLagPercent, openingCash },
      model
    });
  };

  const handleFinalSubmit = () => {
    onSubmit({
      unitsSold,
      unitPrice,
      variableCostPerUnit,
      fixedCostsMonthly,
      collectionLagPercent,
      openingCash,
      model
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Lab 23 • Financial Analysis & Modeling
            </span>
            <h2 className="text-xl font-bold text-white mt-2">Business Financial Model & Cash-Flow Runway Lab</h2>
            <p className="text-sm text-slate-400 mt-1">
              Simulate unit economics, contribution margins, and break-even thresholds: <code>Break-Even = Fixed / (Price - Variable)</code>. Anticipate working capital cash shortfalls caused by accounts receivable collection lag.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              Export Budget CSV
            </button>
            <button
              onClick={handleFinalSubmit}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-lg shadow-emerald-600/20"
            >
              Submit Model
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 uppercase">Gross Revenue</div>
          <div className="text-2xl font-bold text-white mt-1">${model.revenue.toLocaleString()}</div>
          <p className="text-xs text-slate-500 mt-1">{unitsSold} units @ ${unitPrice}</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 uppercase">Break-Even Units</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">
            {isFinite(model.breakEvenUnits) ? `${model.breakEvenUnits} units` : 'No finite B/E'}
          </div>
          <p className="text-xs text-slate-500 mt-1">Contribution: ${model.contributionMarginPerUnit}/unit</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 uppercase">Net Operating Profit</div>
          <div className={`text-2xl font-bold mt-1 ${model.netOperatingIncome >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            ${model.netOperatingIncome.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 mt-1">After $1,000 monthly overhead</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 uppercase">Closing Cash Position</div>
          <div className={`text-2xl font-bold mt-1 ${model.closingCash >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            ${model.closingCash.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 mt-1">{model.hasCashShortfall ? '⚠️ Liquidity Crisis!' : 'Solvent'}</p>
        </div>
      </div>

      {/* Interactive Controls & Financial Table Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders */}
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white">Unit Economics & Working Capital Controls</h3>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Monthly Sales Volume</span>
                <span className="font-mono text-emerald-400 font-bold">{unitsSold} Units</span>
              </div>
              <input
                type="range"
                min="10"
                max="300"
                step="5"
                value={unitsSold}
                onChange={e => { setUnitsSold(parseInt(e.target.value)); onDirty(); }}
                className="w-full accent-emerald-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Selling Price per Unit</span>
                <span className="font-mono text-emerald-400 font-bold">${unitPrice}</span>
              </div>
              <input
                type="range"
                min="35"
                max="100"
                step="1"
                value={unitPrice}
                onChange={e => { setUnitPrice(parseInt(e.target.value)); onDirty(); }}
                className="w-full accent-emerald-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Variable Cost per Unit (COGS)</span>
                <span className="font-mono text-emerald-400 font-bold">${variableCostPerUnit}</span>
              </div>
              <input
                type="range"
                min="15"
                max="60"
                step="1"
                value={variableCostPerUnit}
                onChange={e => { setVariableCostPerUnit(parseInt(e.target.value)); onDirty(); }}
                className="w-full accent-emerald-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Fixed Monthly Overhead (Rent, Core Team)</span>
                <span className="font-mono text-emerald-400 font-bold">${fixedCostsMonthly}</span>
              </div>
              <input
                type="range"
                min="500"
                max="2500"
                step="50"
                value={fixedCostsMonthly}
                onChange={e => { setFixedCostsMonthly(parseInt(e.target.value)); onDirty(); }}
                className="w-full accent-emerald-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Delayed Receivables Collection (30-Day Delay)</span>
                <span className="font-mono text-emerald-400 font-bold">{collectionLagPercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="5"
                value={collectionLagPercent}
                onChange={e => { setCollectionLagPercent(parseInt(e.target.value)); onDirty(); }}
                className="w-full accent-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Pro-Forma Income Statement */}
        <div className="lg:col-span-6 bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white">Monthly Pro-Forma P&L & Cash Flow</h3>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between p-2 rounded bg-slate-900/60 text-slate-300">
              <span>Gross Sales Revenue</span>
              <span className="font-bold text-white">${model.revenue}</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-slate-900/40 text-slate-400">
              <span>- Total Variable COGS ({unitsSold} × ${variableCostPerUnit})</span>
              <span>-${model.totalVariableCost}</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-slate-900/80 text-emerald-400 font-bold border-t border-slate-800">
              <span>= Contribution Margin Total</span>
              <span>${model.totalContribution}</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-slate-900/40 text-slate-400">
              <span>- Fixed Operating Overhead</span>
              <span>-${fixedCostsMonthly}</span>
            </div>
            <div className="flex justify-between p-2.5 rounded bg-slate-900 text-white font-bold border-t border-slate-700">
              <span>= Net Operating Profit (EBIT)</span>
              <span className={model.netOperatingIncome >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                ${model.netOperatingIncome}
              </span>
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-1">
              <div className="text-[11px] text-slate-500 uppercase font-sans font-bold">Cash Flow Adjustment</div>
              <div className="flex justify-between text-slate-400">
                <span>Opening Cash Reserve</span>
                <span>${openingCash}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Collections Received ({100 - collectionLagPercent}% of Rev)</span>
                <span>+${Math.round(model.cashIn)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Cash Outflows (COGS + Overhead)</span>
                <span>-${model.cashOut}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-900 font-bold">
                <span>Ending Cash Balance</span>
                <span className={model.closingCash >= 0 ? 'text-emerald-400' : 'text-rose-400 font-bold'}>
                  ${Math.round(model.closingCash)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
