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

interface CrmDeal {
  id: string;
  account: string;
  contactEmail: string;
  amount: number;
  stage: 'discovery' | 'proposal' | 'negotiation' | 'closed_won';
  probability: number; // 0.2, 0.5, 0.8, 1.0
  isDuplicateCandidate?: boolean;
}

export default function CrmDataQualityForecastLab({ onDirty, onSubmit }: Props) {
  const [deals, setDeals] = useState<CrmDeal[]>([
    { id: 'deal-101', account: 'Acme Health Systems', contactEmail: 'procure@acmehealth.com', amount: 45000, stage: 'proposal', probability: 0.5 },
    { id: 'deal-102', account: 'Acme Health (Old Duplicate)', contactEmail: 'procure@acmehealth.com', amount: 45000, stage: 'discovery', probability: 0.2, isDuplicateCandidate: true }, // Duplicate
    { id: 'deal-103', account: 'BlueSky AI Corp', contactEmail: 'finance@bluesky.ai', amount: 80000, stage: 'negotiation', probability: 0.8 },
    { id: 'deal-104', account: 'Zeta Financial', contactEmail: 'ops@zetafin.com', amount: 25000, stage: 'discovery', probability: 0.2 },
    { id: 'deal-105', account: 'Omega Retail', contactEmail: 'it@omega.org', amount: 60000, stage: 'closed_won', probability: 1.0 },
  ]);

  const [hasMergedDuplicate, setHasMergedDuplicate] = useState<boolean>(false);

  const pipelineTotals = useMemo(() => {
    let unweighted = 0;
    let weighted = 0;
    deals.forEach(d => {
      unweighted += d.amount;
      weighted += d.amount * d.probability;
    });
    return { unweighted, weighted };
  }, [deals]);

  const handleMergeDuplicate = () => {
    setDeals(prev => prev.filter(d => d.id !== 'deal-102'));
    setHasMergedDuplicate(true);
    onDirty();
  };

  const handleExportCsv = () => {
    const rows = deals.map(d => ({
      deal_id: d.id,
      account: d.account,
      email: d.contactEmail,
      amount: d.amount,
      stage: d.stage,
      probability: d.probability,
      weighted_amount: d.amount * d.probability
    }));
    downloadCsv('crm_cleaned_pipeline.csv', rows);
  };

  const handleExportJson = () => {
    downloadJson('crm_forecast_summary.json', {
      pipelineTotals,
      hasMergedDuplicate,
      dealCount: deals.length
    });
  };

  const handleFinalSubmit = () => {
    onSubmit({
      deals,
      pipelineTotals,
      hasMergedDuplicate
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Lab 22 • RevOps & CRM Architecture
            </span>
            <h2 className="text-xl font-bold text-white mt-2">CRM Data Quality & Weighted Forecast Lab</h2>
            <p className="text-sm text-slate-400 mt-1">
              Audit synthetic pipeline opportunities. Review duplicate candidates sharing identical contact emails, calculate stage-weighted forecasts, and prevent artificial pipeline inflation.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              Export Pipeline CSV
            </button>
            <button
              onClick={handleFinalSubmit}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition shadow-lg shadow-cyan-500/20"
            >
              Submit Forecast
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 uppercase">Gross Unweighted Pipeline</div>
          <div className="text-2xl font-bold text-white mt-1">${pipelineTotals.unweighted.toLocaleString()}</div>
          <p className="text-xs text-slate-500 mt-1">Face value of open deals</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 uppercase">Weighted Forecast</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">${pipelineTotals.weighted.toLocaleString()}</div>
          <p className="text-xs text-slate-500 mt-1">Sum of (Amount × Stage %)</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 uppercase">Duplicate Alert</div>
          <div className={`text-2xl font-bold mt-1 ${hasMergedDuplicate ? 'text-emerald-400' : 'text-amber-400'}`}>
            {hasMergedDuplicate ? '0 Flagged' : '1 Candidate'}
          </div>
          <p className="text-xs text-slate-500 mt-1">{hasMergedDuplicate ? 'Deduplication complete' : 'Review duplicate contact'}</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 uppercase">Active Opportunities</div>
          <div className="text-2xl font-bold text-indigo-400 mt-1">{deals.length}</div>
          <p className="text-xs text-slate-500 mt-1">Verified deals in flight</p>
        </div>
      </div>

      {/* Pipeline Opportunities Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Pipeline Opportunities Grid</h3>
          {!hasMergedDuplicate && (
            <button
              onClick={handleMergeDuplicate}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition"
            >
              Review & Merge Duplicate (Deal-102)
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="p-3">Deal ID</th>
                <th className="p-3">Account Name</th>
                <th className="p-3">Contact Email</th>
                <th className="p-3">Stage</th>
                <th className="p-3">Probability</th>
                <th className="p-3 text-right">Face Amount</th>
                <th className="p-3 text-right">Weighted Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {deals.map(d => (
                <tr key={d.id} className={d.isDuplicateCandidate ? 'bg-amber-950/20 text-amber-200' : 'text-slate-300'}>
                  <td className="p-3 font-mono">{d.id}</td>
                  <td className="p-3 font-semibold">{d.account}</td>
                  <td className="p-3 font-mono text-[11px] text-slate-400">{d.contactEmail}</td>
                  <td className="p-3 uppercase text-[10px] font-bold text-cyan-400">{d.stage.replace('_', ' ')}</td>
                  <td className="p-3 font-mono">{(d.probability * 100).toFixed(0)}%</td>
                  <td className="p-3 text-right font-mono">${d.amount.toLocaleString()}</td>
                  <td className="p-3 text-right font-mono font-bold text-white">${(d.amount * d.probability).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
