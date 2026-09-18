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

interface CaseItem {
  id: string;
  prompt: string;
  systemA: string;
  systemB: string;
  groundTruth: string;
  goldLabel: 'supported' | 'unsupported' | 'incomplete';
  expectedBinary: 'positive' | 'negative'; // positive = faithful/supported, negative = hallucinated/unsupported
}

const SAMPLE_CASES: CaseItem[] = [
  { id: 'c1', prompt: 'What is the return window for electronics?', groundTruth: 'Items can be returned within 30 days of delivery with receipt.', systemA: 'Customers can return electronics within 30 days of delivery if they have the receipt.', systemB: 'Electronics are non-returnable once opened.', goldLabel: 'supported', expectedBinary: 'positive' },
  { id: 'c2', prompt: 'Are refurbished laptops covered by warranty?', groundTruth: 'All certified refurbished laptops include a 1-year limited warranty.', systemA: 'Yes, certified refurbished laptops come with a 1-year limited warranty.', systemB: 'No warranty is provided on used or refurbished stock.', goldLabel: 'supported', expectedBinary: 'positive' },
  { id: 'c3', prompt: 'Does the enterprise plan include 24/7 phone support?', groundTruth: 'Enterprise plan features 24/7 dedicated phone and slack channel support.', systemA: 'Yes, enterprise includes 24/7 phone and dedicated Slack support.', systemB: 'Support is email-only between 9am and 5pm EST.', goldLabel: 'supported', expectedBinary: 'positive' },
  { id: 'c4', prompt: 'Can users export data to BigQuery?', groundTruth: 'Data sync to Google BigQuery is supported via nightly scheduled pipelines.', systemA: 'BigQuery export is supported automatically every night via pipeline.', systemB: 'Exporting to BigQuery requires custom python SDK scripts.', goldLabel: 'supported', expectedBinary: 'positive' },
  { id: 'c5', prompt: 'Where are EU customer databases hosted?', groundTruth: 'EU user data is isolated in the Frankfurt (eu-central-1) AWS region.', systemA: 'All EU customer records are stored securely in Frankfurt.', systemB: 'Data is mirrored across US-East and Singapore clusters.', goldLabel: 'supported', expectedBinary: 'positive' },
  { id: 'c6', prompt: 'What is the maximum file upload size?', groundTruth: 'Max single file upload is 50MB on Pro and 500MB on Enterprise.', systemA: 'Pro users can upload files up to 50MB, while Enterprise tier supports 500MB.', systemB: 'Maximum size is unlimited for all registered accounts.', goldLabel: 'supported', expectedBinary: 'positive' },
  { id: 'c7', prompt: 'Is HIPAA compliance BAA provided?', groundTruth: 'Business Associate Agreements (BAA) are executed for Healthcare Enterprise tier.', systemA: 'BAAs are available upon request for Healthcare tier Enterprise contracts.', systemB: 'The platform is not HIPAA certified and cannot sign BAAs.', goldLabel: 'supported', expectedBinary: 'positive' },
  { id: 'c8', prompt: 'How is user billing calculated during seat expansion?', groundTruth: 'Mid-billing cycle seats are prorated to the exact remaining days.', systemA: 'Added team members are prorated based on remaining days in the cycle.', systemB: 'You are charged the full month fee regardless of joining date.', goldLabel: 'supported', expectedBinary: 'positive' },
  { id: 'c9', prompt: 'Can free accounts create custom subdomains?', groundTruth: 'Custom subdomains are restricted to paid Starter and Growth plans.', systemA: 'Yes, any free account can claim a unique custom subdomain immediately.', systemB: 'Subdomains are exclusive to Starter and Growth plans.', goldLabel: 'unsupported', expectedBinary: 'negative' },
  { id: 'c10', prompt: 'Is multi-factor authentication mandatory?', groundTruth: 'MFA is optional on Free/Starter, but strictly enforced on Enterprise.', systemA: 'MFA is completely optional across all subscription tiers.', systemB: 'MFA is enforced strictly for Enterprise organizations.', goldLabel: 'unsupported', expectedBinary: 'negative' },
  { id: 'c11', prompt: 'What is the rate limit for REST APIs?', groundTruth: 'Free tier is limited to 60 req/min; Pro tier is capped at 600 req/min.', systemA: 'The API has zero rate limits with burst allowance up to 10k rps.', systemB: 'Standard limits are 60 req/min for Free and 600 for Pro.', goldLabel: 'unsupported', expectedBinary: 'negative' },
  { id: 'c12', prompt: 'Can users restore deleted workspaces?', groundTruth: 'Workspaces are soft-deleted for 14 days before permanent purge.', systemA: 'Deleted workspaces are instantly destroyed and cannot ever be recovered.', systemB: 'You have a 14-day grace period to restore soft-deleted workspaces.', goldLabel: 'unsupported', expectedBinary: 'negative' },
];

export default function AiEvaluationCasebookLab({ onDirty, onSubmit }: Props) {
  const [annotations, setAnnotations] = useState<Record<string, 'supported' | 'unsupported' | 'incomplete'>>({
    c1: 'supported',
    c2: 'supported',
    c3: 'supported',
    c4: 'supported',
    c5: 'supported',
    c6: 'supported',
    c7: 'supported',
    c8: 'supported',
    c9: 'supported', // Deliberate error for learner to discover
    c10: 'supported', // Deliberate error for learner to discover
    c11: 'unsupported',
    c12: 'unsupported',
  });

  const [selectedCaseId, setSelectedCaseId] = useState<string>('c1');
  const [targetSystem, setTargetSystem] = useState<'systemA' | 'systemB'>('systemA');
  const [releaseDecision, setReleaseDecision] = useState<'hold' | 'conditional' | 'deploy'>('hold');
  const [releaseMemo, setReleaseMemo] = useState<string>('Model A demonstrates high factual precision in basic FAQ questions but hallucinates security boundaries on subdomains and MFA.');

  const activeCase = SAMPLE_CASES.find(c => c.id === selectedCaseId) || SAMPLE_CASES[0];

  // Confusion Matrix calculation comparing learner's annotation to groundTruth binary fidelity
  // Positive = learner marked 'supported'; Negative = learner marked 'unsupported' or 'incomplete'
  // True positive = marked supported when ground truth is positive
  // False positive = marked supported when ground truth is negative (hallucination missed)
  // False negative = marked unsupported when ground truth is positive
  // True negative = marked unsupported when ground truth is negative
  const metrics = useMemo(() => {
    let tp = 0;
    let fp = 0;
    let fn = 0;
    let tn = 0;

    SAMPLE_CASES.forEach(c => {
      const userChoice = annotations[c.id];
      const isPositivePredicted = userChoice === 'supported';
      const isPositiveActual = c.expectedBinary === 'positive';

      if (isPositivePredicted && isPositiveActual) tp++;
      else if (isPositivePredicted && !isPositiveActual) fp++;
      else if (!isPositivePredicted && isPositiveActual) fn++;
      else if (!isPositivePredicted && !isPositiveActual) tn++;
    });

    const precision = (tp + fp) > 0 ? (tp / (tp + fp)) : 0;
    const recall = (tp + fn) > 0 ? (tp / (tp + fn)) : 0;
    const f1 = (precision + recall) > 0 ? (2 * precision * recall) / (precision + recall) : 0;

    return { tp, fp, fn, tn, precision, recall, f1 };
  }, [annotations]);

  const handleLabelChange = (caseId: string, label: 'supported' | 'unsupported' | 'incomplete') => {
    setAnnotations(prev => ({ ...prev, [caseId]: label }));
    onDirty();
  };

  const handleExportCsv = () => {
    const rows = SAMPLE_CASES.map(c => ({
      case_id: c.id,
      prompt: c.prompt,
      evaluator_label: annotations[c.id],
      expected_label: c.goldLabel,
      system_evaluated: targetSystem,
      matches_ground_truth: annotations[c.id] === c.goldLabel ? 'YES' : 'NO'
    }));
    downloadCsv('ai_eval_casebook_annotations.csv', rows);
  };

  const handleExportJson = () => {
    downloadJson('ai_eval_casebook_summary.json', {
      evaluatedCases: SAMPLE_CASES.length,
      confusionMatrix: metrics,
      releaseDecision,
      releaseMemo,
      annotations
    });
  };

  const handleFinalSubmit = () => {
    onSubmit({
      annotations,
      targetSystem,
      metrics,
      releaseDecision,
      releaseMemo
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Lab 08 • Responsible AI & LLM Evaluation
            </span>
            <h2 className="text-xl font-bold text-white mt-2">AI Evaluation Casebook & Faithfulness Metrics</h2>
            <p className="text-sm text-slate-400 mt-1">
              Verify 12 authored model responses against ground-truth facts. Correctly label hallucinations to achieve TP 8, FP 2, FN 2 (Precision 0.8, Recall 0.8).
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              Export CSV
            </button>
            <button
              onClick={handleExportJson}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              Export JSON
            </button>
            <button
              onClick={handleFinalSubmit}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-lg shadow-emerald-600/20"
            >
              Submit Casebook
            </button>
          </div>
        </div>
      </div>

      {/* Metrics & Confusion Matrix Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">True Positives (TP)</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{metrics.tp}</div>
          <p className="text-xs text-slate-500 mt-1">Target benchmark: 8 cases</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">False Positives (FP)</div>
          <div className={`text-2xl font-bold mt-1 ${metrics.fp === 2 ? 'text-amber-400' : 'text-rose-400'}`}>
            {metrics.fp}
          </div>
          <p className="text-xs text-slate-500 mt-1">Hallucinations mislabeled as supported (Target: 2)</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Precision</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">
            {(metrics.precision * 100).toFixed(1)}%
          </div>
          <p className="text-xs text-slate-500 mt-1">Formula: TP / (TP + FP) [Target: 80.0%]</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Recall</div>
          <div className="text-2xl font-bold text-indigo-400 mt-1">
            {(metrics.recall * 100).toFixed(1)}%
          </div>
          <p className="text-xs text-slate-500 mt-1">Formula: TP / (TP + FN) [Target: 80.0%]</p>
        </div>
      </div>

      {/* Main Workspace Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Case Selector and Annotation Table */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Evaluation Queue (12 Samples)
            </h3>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Target Model:</span>
              <button
                onClick={() => setTargetSystem('systemA')}
                className={`px-2.5 py-1 rounded font-medium ${targetSystem === 'systemA' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}
              >
                Model A (Falcon-7B)
              </button>
              <button
                onClick={() => setTargetSystem('systemB')}
                className={`px-2.5 py-1 rounded font-medium ${targetSystem === 'systemB' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}
              >
                Model B (Llama-3B)
              </button>
            </div>
          </div>

          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {SAMPLE_CASES.map(c => {
              const isSelected = c.id === selectedCaseId;
              const currentLabel = annotations[c.id];
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCaseId(c.id)}
                  className={`p-3 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-500/50 shadow-md'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-400">{c.id.toUpperCase()}</span>
                        <span className="text-xs font-medium text-slate-200 truncate">{c.prompt}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1 italic">
                        {targetSystem === 'systemA' ? c.systemA : c.systemB}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => handleLabelChange(c.id, 'supported')}
                        className={`text-[10px] px-2 py-1 rounded font-medium transition ${
                          currentLabel === 'supported'
                            ? 'bg-emerald-600 text-white font-bold'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        Supported
                      </button>
                      <button
                        onClick={() => handleLabelChange(c.id, 'unsupported')}
                        className={`text-[10px] px-2 py-1 rounded font-medium transition ${
                          currentLabel === 'unsupported'
                            ? 'bg-rose-600 text-white font-bold'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        Hallucinated
                      </button>
                      <button
                        onClick={() => handleLabelChange(c.id, 'incomplete')}
                        className={`text-[10px] px-2 py-1 rounded font-medium transition ${
                          currentLabel === 'incomplete'
                            ? 'bg-amber-600 text-white font-bold'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        Incomplete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Case Inspection & Evidence Comparator */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center justify-between">
              <span>Inspection: Case {activeCase.id.toUpperCase()}</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400">
                Current: {annotations[activeCase.id]?.toUpperCase()}
              </span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 font-semibold uppercase tracking-wider block mb-1">User Query</label>
                <div className="p-2.5 rounded-lg bg-slate-800/80 text-slate-200 border border-slate-700/50">
                  {activeCase.prompt}
                </div>
              </div>

              <div>
                <label className="text-emerald-400 font-semibold uppercase tracking-wider block mb-1 flex items-center justify-between">
                  <span>Ground Truth Reference Knowledge</span>
                  <span className="text-[10px] text-emerald-500 font-normal">Verified Document</span>
                </label>
                <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-800/40 text-emerald-200">
                  {activeCase.groundTruth}
                </div>
              </div>

              <div>
                <label className="text-cyan-400 font-semibold uppercase tracking-wider block mb-1">
                  Evaluated Model Output ({targetSystem === 'systemA' ? 'Falcon-7B' : 'Llama-3B'})
                </label>
                <div className="p-3 rounded-lg bg-slate-950/80 border border-cyan-800/40 text-slate-200">
                  {targetSystem === 'systemA' ? activeCase.systemA : activeCase.systemB}
                </div>
              </div>
            </div>
          </div>

          {/* Release Decision & Governance Memo */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Model Governance & Deployment Gate</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1.5">Production Gate Recommendation</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => { setReleaseDecision('hold'); onDirty(); }}
                    className={`py-1.5 text-xs font-semibold rounded-lg border transition ${
                      releaseDecision === 'hold'
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    Block / Hold
                  </button>
                  <button
                    onClick={() => { setReleaseDecision('conditional'); onDirty(); }}
                    className={`py-1.5 text-xs font-semibold rounded-lg border transition ${
                      releaseDecision === 'conditional'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    Conditional Pilot
                  </button>
                  <button
                    onClick={() => { setReleaseDecision('deploy'); onDirty(); }}
                    className={`py-1.5 text-xs font-semibold rounded-lg border transition ${
                      releaseDecision === 'deploy'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    Deploy to Prod
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1.5">Safety & Disagreement Audit Memo</label>
                <textarea
                  rows={3}
                  value={releaseMemo}
                  onChange={e => { setReleaseMemo(e.target.value); onDirty(); }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  placeholder="Summarize disagreement rate and hallucination risk..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
