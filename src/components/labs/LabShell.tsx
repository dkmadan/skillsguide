'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LabDefinition, LabScenarioVariant, LabDifficulty, SaveStatus, LabSubmissionResult } from '@/lib/labs/types';
import LabScorerModal from './LabScorerModal';
import { 
  BookOpen, 
  RotateCcw, 
  Undo2, 
  Send, 
  CheckCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  ChevronDown, 
  Layers, 
  ArrowLeft,
  Printer,
  Sparkles,
  Info
} from 'lucide-react';

interface LabShellProps {
  lab: LabDefinition;
  initialScenario?: LabScenarioVariant | null;
  onSaveDraft?: (draftState: Record<string, unknown>) => Promise<boolean>;
  onSubmitLab: (answers: Record<string, unknown>) => Promise<LabSubmissionResult>;
  children: (props: {
    scenario: LabScenarioVariant | undefined;
    variant: LabDifficulty;
    saveStatus: SaveStatus;
    markDirty: () => void;
    triggerSubmit: (answers: Record<string, unknown>) => void;
  }) => React.ReactNode;
}

export default function LabShell({
  lab,
  initialScenario,
  onSaveDraft,
  onSubmitLab,
  children
}: LabShellProps) {
  const [variant, setVariant] = useState<LabDifficulty>('beginner');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [briefingOpen, setBriefingOpen] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<LabSubmissionResult | null>(null);

  // Auto-save debounce effect
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!dirty || !onSaveDraft) return;

    const timer = setTimeout(async () => {
      setSaveStatus('saving');
      try {
        const success = await onSaveDraft({});
        setSaveStatus(success ? 'saved' : 'failed');
        setDirty(false);
      } catch (e) {
        setSaveStatus('failed');
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [dirty, onSaveDraft]);

  const handleTriggerSubmit = async (answers: Record<string, unknown>) => {
    setSubmitting(true);
    try {
      const res = await onSubmitLab(answers);
      setSubmissionResult(res);
      setResultModalOpen(true);
    } catch (err) {
      console.error('Submission failed:', err);
      alert('Failed to submit simulation answers. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset your workspace to the initial scenario state?')) {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-[#090b14] text-slate-100 flex flex-col selection:bg-purple-600 selection:text-white">
      
      {/* ===================================================================== */}
      {/* LAB WORKSPACE HEADER                                                  */}
      {/* ===================================================================== */}
      <header className="sticky top-0 z-30 bg-[#0d101e]/95 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Left: Back Link & Lab Title */}
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/labs"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors shrink-0"
              title="Return to Labs Catalog"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-purple-500/20 border border-purple-500/30 text-purple-300 font-mono text-[10px] font-extrabold uppercase">
                  Lab {String(lab.labNumber).padStart(2, '0')}
                </span>
                <span className="hidden sm:inline text-xs text-slate-400 font-medium">
                  {lab.domainTitle}
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-600 hidden sm:inline"></span>
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Clock className="w-3 h-3 text-purple-400" />
                  <span>{lab.timeMinutes} mins</span>
                </div>
              </div>

              <h1 className="text-sm sm:text-base font-extrabold text-white truncate max-w-md sm:max-w-xl">
                {lab.title}
              </h1>
            </div>
          </div>

          {/* Right: Variant Selector, Auto-Save Badge & Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Difficulty Variant Selector */}
            <div className="relative">
              <select
                value={variant}
                onChange={(e) => setVariant(e.target.value as LabDifficulty)}
                className="appearance-none text-xs font-bold pl-3 pr-8 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 focus:outline-none focus:border-purple-500/50 cursor-pointer"
                title="Select scenario difficulty tier"
              >
                <option value="beginner" className="bg-[#0f1322] text-white">Beginner</option>
                <option value="intermediate" className="bg-[#0f1322] text-white">Intermediate</option>
                <option value="challenge" className="bg-[#0f1322] text-white">Challenge</option>
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Auto-save Status Indicator */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-[11px] font-semibold text-slate-300">
              <span className={`w-2 h-2 rounded-full ${
                saveStatus === 'saved' ? 'bg-emerald-400' :
                saveStatus === 'saving' ? 'bg-amber-400 animate-ping' :
                saveStatus === 'unsaved' ? 'bg-amber-400' : 'bg-red-500'
              }`} />
              <span className="capitalize">{saveStatus}</span>
            </div>

            {/* Mission Briefing Toggle */}
            <button
              onClick={() => setBriefingOpen(!briefingOpen)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                briefingOpen 
                  ? 'bg-purple-600/20 text-purple-300 border-purple-500/40' 
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
              }`}
              title="Toggle mission briefing panel"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mission</span>
            </button>

            {/* Reset */}
            <button
              onClick={handleReset}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors"
              title="Reset workspace"
              aria-label="Reset workspace"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

          </div>
        </div>
      </header>

      {/* ===================================================================== */}
      {/* COLLAPSIBLE MISSION BRIEFING DRAWER                                  */}
      {/* ===================================================================== */}
      {briefingOpen && (
        <div className="bg-[#111425] border-b border-purple-500/20 px-4 sm:px-6 py-4 animate-in slide-in-from-top-2 duration-150">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            
            {/* Objective & Mission */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-1.5 font-extrabold uppercase text-[10px] tracking-wider text-purple-300 mb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Mission Briefing</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {initialScenario?.instructions || lab.summary}
              </p>
            </div>

            {/* Expected Output */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-1.5 font-extrabold uppercase text-[10px] tracking-wider text-emerald-300 mb-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Success Criteria</span>
              </div>
              <ul className="space-y-1 text-slate-300">
                {initialScenario?.expectedOutput ? (
                  initialScenario.expectedOutput.map((out, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{out}</span>
                    </li>
                  ))
                ) : (
                  <li>Complete scenario tasks and verify feedback.</li>
                )}
              </ul>
            </div>

            {/* Simulated Tools & Boundary */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 font-extrabold uppercase text-[10px] tracking-wider text-cyan-300 mb-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Interactive Sandbox Guardrails</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {lab.toolsSimulated.map((tool, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[10px] font-medium">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-[10px] text-slate-400 italic">
                Deterministic browser simulation with server-authoritative scoring. Zero setup required.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MAIN INTERACTIVE WORKSPACE AREA                                       */}
      {/* ===================================================================== */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full">
        {children({
          scenario: initialScenario || undefined,
          variant,
          saveStatus,
          markDirty: () => { setDirty(true); setSaveStatus('unsaved'); },
          triggerSubmit: handleTriggerSubmit
        })}
      </main>

      {/* ===================================================================== */}
      {/* VERIFIED EVALUATION MODAL                                             */}
      {/* ===================================================================== */}
      <LabScorerModal
        isOpen={resultModalOpen}
        onClose={() => setResultModalOpen(false)}
        lab={lab}
        result={submissionResult}
        onRetry={() => {
          setResultModalOpen(false);
          handleReset();
        }}
      />

    </div>
  );
}
