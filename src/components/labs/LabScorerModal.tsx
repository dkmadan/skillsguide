'use client';

import React, { useState } from 'react';
import { LabDefinition, LabSubmissionResult } from '@/lib/labs/types';
import { 
  downloadJson, 
  downloadCsv, 
  generateReportText, 
  triggerPrintReport 
} from '@/lib/labs/exportHelper';
import { 
  CheckCircle2, 
  AlertCircle, 
  Award, 
  Download, 
  Printer, 
  FileText, 
  X, 
  RotateCcw,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface LabScorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lab: LabDefinition;
  result: LabSubmissionResult | null;
  onRetry: () => void;
}

export default function LabScorerModal({
  isOpen,
  onClose,
  lab,
  result,
  onRetry
}: LabScorerModalProps) {
  const [reflection, setReflection] = useState('');
  const [reflectionSaved, setReflectionSaved] = useState(false);

  if (!isOpen || !result) return null;

  const isPassed = result.passed;
  const score = result.serverScore;

  const handleExportJson = () => {
    downloadJson(`${lab.slug}-submission-report.json`, {
      labSlug: lab.slug,
      labTitle: lab.title,
      serverScore: result.serverScore,
      passed: result.passed,
      criteria: result.criterionResults,
      reflection,
      submittedAt: result.submittedAt,
      referenceId: result.attemptId
    });
  };

  const handleExportCsv = () => {
    const headers = ['Criterion ID', 'Category', 'Criterion Name', 'Earned Pts', 'Max Pts', 'Status', 'Feedback'];
    const rows = result.criterionResults.map(c => [
      c.id,
      c.category,
      c.name,
      c.earned,
      c.max,
      c.passed ? 'PASSED' : 'DEFICIT',
      c.feedback
    ]);
    downloadCsv(`${lab.slug}-criteria-breakdown.csv`, headers, rows);
  };

  const handleExportText = () => {
    const text = generateReportText(lab, result, reflection);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${lab.slug}-verified-report.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl rounded-3xl bg-[#0f1322] border border-white/15 p-6 sm:p-8 shadow-2xl text-slate-100 my-8 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Score Banner */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-white/10">
          <div className={`relative w-28 h-28 rounded-full flex flex-col items-center justify-center shrink-0 border-4 ${
            isPassed 
              ? 'border-emerald-500/60 bg-emerald-950/40 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.25)]' 
              : 'border-amber-500/60 bg-amber-950/40 text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.25)]'
          }`}>
            <span className="text-3xl font-black">{score}</span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">/ 100 PTS</span>
          </div>

          <div className="text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2 border ${
              isPassed 
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' 
                : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
            }">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isPassed ? 'Verified Competency Achieved' : 'Re-Attempt Recommended (Target >= 75)'}</span>
            </div>

            <h2 id="modal-headline" className="text-2xl font-black text-white">
              {lab.title}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Simulation evaluation calculated deterministically on server. Objective score based on 60 pts task correctness, 25 pts constraints, and 15 pts evidence references.
            </p>
          </div>
        </div>

        {/* Rubric Category Summaries */}
        <div className="grid grid-cols-3 gap-3 my-6">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Task Correctness</span>
            <span className="text-lg font-black text-white">
              {result.criterionResults.filter(c => c.category === 'correctness').reduce((s, c) => s + c.earned, 0)} / 60
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Constraints</span>
            <span className="text-lg font-black text-white">
              {result.criterionResults.filter(c => c.category === 'constraints').reduce((s, c) => s + c.earned, 0)} / 25
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Evidence &amp; Notes</span>
            <span className="text-lg font-black text-white">
              {result.criterionResults.filter(c => c.category === 'evidence').reduce((s, c) => s + c.earned, 0)} / 15
            </span>
          </div>
        </div>

        {/* Detailed Criterion Results */}
        <div className="space-y-3 mb-6">
          <h3 className="text-xs uppercase font-extrabold tracking-wider text-purple-300 flex items-center gap-2">
            <Award className="w-4 h-4" />
            <span>Criterion-by-Criterion Assessment</span>
          </h3>

          <div className="space-y-2.5">
            {result.criterionResults.map((c) => (
              <div 
                key={c.id} 
                className="p-3.5 rounded-2xl bg-[#141829] border border-white/10 flex items-start gap-3"
              >
                <div className="mt-0.5 shrink-0">
                  {c.passed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white truncate">{c.name}</span>
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md shrink-0 ${
                      c.passed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {c.earned} / {c.max} pts
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{c.feedback}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Authored Improvement Hints */}
        {result.authoredHints && result.authoredHints.length > 0 && (
          <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 mb-6 space-y-2">
            <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Authored Improvement Hints</span>
            </span>
            <ul className="text-xs text-slate-300 space-y-1 pl-4 list-disc marker:text-purple-400">
              {result.authoredHints.map((hint, i) => (
                <li key={i}>{hint}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Learner Ungraded Self-Reflection */}
        {result.selfReviewPrompt && (
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-6 space-y-2">
            <label htmlFor="self-review" className="text-xs font-bold text-slate-200 block">
              Self-Review Reflection (Ungraded)
            </label>
            <p className="text-[11px] text-slate-400 italic mb-2">
              {result.selfReviewPrompt}
            </p>
            <textarea
              id="self-review"
              rows={3}
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Record your reasoning or key takeaways here. Included in your exported portfolio report..."
              className="w-full text-xs p-3 rounded-xl bg-black/40 border border-white/15 text-slate-200 focus:outline-none focus:border-purple-500/60"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setReflectionSaved(true)}
                className="px-3 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 text-xs font-semibold transition-colors"
              >
                {reflectionSaved ? 'Reflection Saved' : 'Save to Report'}
              </button>
            </div>
          </div>
        )}

        {/* Export & Actions Footer */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportJson}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
              title="Download structured JSON artifact"
            >
              <Download className="w-3.5 h-3.5 text-purple-400" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={handleExportCsv}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
              title="Download CSV criteria breakdown"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleExportText}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
              title="Download plain text report"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>Text Report</span>
            </button>
            <button
              onClick={triggerPrintReport}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-400" />
              <span>Print / PDF</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onRetry}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Mission</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-glow-btn transition-all"
            >
              Back to Workspace
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
