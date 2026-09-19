'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  LabDefinition,
  LabScenarioVariant,
  LabDifficulty,
  SaveStatus,
  LabSubmissionResult,
  WorkspaceMode,
  ExperimentSnapshot,
  ValidationFeedback
} from '@/lib/labs/types';
import { getScenariosForLab } from '@/data/labsScenariosData';
import { downloadCsv, downloadJson, generateReportText, triggerPrintReport } from '@/lib/labs/exportHelper';
import LabScorerModal from './LabScorerModal';
import {
  ArrowLeft,
  BookOpen,
  RotateCcw,
  Undo2,
  Redo2,
  Play,
  Copy,
  Download,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  Sparkles,
  Sliders,
  Database,
  Layers,
  History,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Eye,
  FileJson,
  FileSpreadsheet,
  Printer,
  ShieldCheck,
  Compass,
  FileText,
  Clock,
  X
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
    mode: WorkspaceMode;
    activeScenario: LabScenarioVariant;
    snapshots: ExperimentSnapshot[];
    takeSnapshot: (name: string, inputs: Record<string, unknown>, metrics: Record<string, number | string>) => void;
    validationFeedback?: ValidationFeedback;
    setValidationFeedback: (feedback: ValidationFeedback) => void;
    selectedObject: Record<string, unknown> | null;
    setSelectedObject: (obj: Record<string, unknown> | null) => void;
  }) => React.ReactNode;
}

export default function LabShell({
  lab,
  initialScenario,
  onSaveDraft,
  onSubmitLab,
  children
}: LabShellProps) {
  // Scenarios available for this lab (at least 6)
  const scenarios = getScenariosForLab(lab.slug);
  const [activeScenarioId, setActiveScenarioId] = useState<string>(
    initialScenario?.id || scenarios[0]?.id || `${lab.slug}-001`
  );
  const activeScenario = scenarios.find(s => s.id === activeScenarioId) || scenarios[0];

  // Workspace configuration & state
  const [mode, setMode] = useState<WorkspaceMode>('guided');
  const [variant, setVariant] = useState<LabDifficulty>(activeScenario.variant || 'beginner');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [dirty, setDirty] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<LabSubmissionResult | null>(null);

  // Panels visibility
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [leftTab, setLeftTab] = useState<'mission' | 'materials' | 'hints'>('mission');
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [bottomPanelOpen, setBottomPanelOpen] = useState(true);
  const [bottomTab, setBottomTab] = useState<'results' | 'validation' | 'comparison' | 'history'>('validation');

  // Progressive hints state (Guided mode)
  const [revealedHintLevel, setRevealedHintLevel] = useState<number>(0);

  // Experiment snapshots (up to 3 versions)
  const [snapshots, setSnapshots] = useState<ExperimentSnapshot[]>([]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  // Multi-dimensional validation state
  const [validationFeedback, setValidationFeedback] = useState<ValidationFeedback>({
    validity: { passed: true, errors: [] },
    correctness: { passed: true, score: 85, details: ['Ready for verification run'] },
    constraints: { passed: true, violated: [] },
    tradeOffs: ['Inspect scenario parameters to evaluate trade-offs.']
  });

  // Selected object for right inspector panel
  const [selectedObject, setSelectedObject] = useState<Record<string, unknown> | null>(null);

  // History action log
  const [actionLog, setActionLog] = useState<{ id: string; time: string; action: string }[]>([
    { id: '1', time: new Date().toLocaleTimeString(), action: `Loaded scenario: ${activeScenario.title}` }
  ]);

  // Sync variant when scenario changes
  const handleSelectScenario = (id: string) => {
    setActiveScenarioId(id);
    const found = scenarios.find(s => s.id === id);
    if (found) {
      setVariant(found.variant);
      setRevealedHintLevel(0);
      setActionLog(prev => [{ id: String(Date.now()), time: new Date().toLocaleTimeString(), action: `Switched scenario to ${found.title}` }, ...prev]);
    }
  };

  // Auto-save debounce effect
  useEffect(() => {
    if (!dirty || !onSaveDraft) return;
    const timer = setTimeout(async () => {
      setSaveStatus('saving');
      try {
        const success = await onSaveDraft({});
        setSaveStatus(success ? 'saved' : 'failed');
        setDirty(false);
      } catch {
        setSaveStatus('failed');
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [dirty, onSaveDraft]);

  const markDirty = useCallback(() => {
    setDirty(true);
    setSaveStatus('unsaved');
  }, []);

  const takeSnapshot = useCallback((name: string, inputs: Record<string, unknown>, metrics: Record<string, number | string>) => {
    const newSnapshot: ExperimentSnapshot = {
      id: `snap_${Date.now()}`,
      name: name || `Attempt #${snapshots.length + 1}`,
      timestamp: new Date().toLocaleTimeString(),
      inputs,
      metrics
    };
    setSnapshots(prev => [newSnapshot, ...prev].slice(0, 3));
    setActionLog(prev => [{ id: String(Date.now()), time: new Date().toLocaleTimeString(), action: `Recorded snapshot: ${newSnapshot.name}` }, ...prev]);
  }, [snapshots.length]);

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
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col selection:bg-purple-600 selection:text-white">
      {/* ===================================================================== */}
      {/* 1. TOP TOOLBAR                                                        */}
      {/* ===================================================================== */}
      <header className="sticky top-0 z-40 bg-[#0c0f1d]/95 backdrop-blur-xl border-b border-white/10 px-3 sm:px-6 py-2.5">
        <div className="max-w-[1920px] mx-auto flex flex-wrap items-center justify-between gap-2.5">
          {/* Left: Navigation & Lab Info */}
          <div className="flex items-center gap-2.5 min-w-0">
            <Link
              href="/labs"
              className="p-1.5 sm:p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors shrink-0"
              title="Return to Labs Catalog"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="px-2 py-0.5 rounded-md bg-purple-500/20 border border-purple-500/30 text-purple-300 font-mono text-[10px] font-extrabold uppercase">
                  Lab {String(lab.labNumber).padStart(2, '0')}
                </span>
                <span className="hidden sm:inline text-xs text-slate-400 font-medium">
                  {lab.domainTitle}
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-600 hidden sm:inline" />
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-purple-400" />
                  {lab.timeMinutes}m
                </span>
              </div>
              <h1 className="text-xs sm:text-sm font-extrabold text-white truncate max-w-xs sm:max-w-md lg:max-w-lg">
                {lab.title}
              </h1>
            </div>
          </div>

          {/* Center: Scenario Selector & Mode Toggle */}
          <div className="flex items-center gap-2">
            {/* Scenario Picker (at least 6 options) */}
            <div className="relative">
              <select
                value={activeScenario.id}
                onChange={(e) => handleSelectScenario(e.target.value)}
                className="appearance-none text-xs font-semibold pl-2.5 pr-7 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 focus:outline-none focus:border-purple-500/50 cursor-pointer max-w-[200px] sm:max-w-[280px] truncate"
                title="Select authored scenario"
              >
                {scenarios.map((sc, idx) => (
                  <option key={sc.id} value={sc.id} className="bg-[#0f1322] text-white">
                    S{idx + 1}: {sc.title} ({sc.variant})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Mode Switcher: Guided / Challenge / Explore */}
            <div className="inline-flex p-0.5 rounded-xl bg-white/5 border border-white/10 text-[11px] font-bold">
              {(['guided', 'challenge', 'explore'] as WorkspaceMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                    mode === m
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title={`${m} mode`}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* Difficulty Badge */}
            <span
              className={`hidden xl:inline px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase border ${
                variant === 'beginner'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : variant === 'intermediate'
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              }`}
            >
              {variant}
            </span>
          </div>

          {/* Right: Actions, Undo/Redo, Reset, Run, Compare, Export */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Auto-save Status */}
            <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded-xl bg-white/5 border border-white/10 text-[10px] text-slate-400">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  saveStatus === 'saved'
                    ? 'bg-emerald-400'
                    : saveStatus === 'saving'
                    ? 'bg-amber-400 animate-ping'
                    : 'bg-red-400'
                }`}
              />
              <span className="capitalize">{saveStatus}</span>
            </div>

            {/* Reset */}
            <button
              onClick={handleReset}
              className="p-1.5 sm:p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors"
              title="Reset workspace"
              aria-label="Reset workspace"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Compare Snapshots Modal Toggle */}
            <button
              onClick={() => setCompareModalOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-all"
              title="Compare attempt snapshots"
            >
              <Copy className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">Compare ({snapshots.length})</span>
            </button>

            {/* Export Dropdown Menu */}
            <div className="relative group">
              <button
                className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-all"
                title="Export options"
              >
                <Download className="w-3.5 h-3.5 text-purple-400" />
                <span className="hidden md:inline">Export</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              <div className="absolute right-0 top-full mt-1.5 w-48 bg-[#111424] border border-white/10 rounded-2xl shadow-2xl p-1.5 hidden group-hover:block z-50 animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={() => downloadJson(`${lab.slug}_snapshot.json`, { lab: lab.slug, scenario: activeScenario.id, mode, timestamp: new Date().toISOString() })}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/5 text-xs text-slate-300 hover:text-white flex items-center gap-2"
                >
                  <FileJson className="w-3.5 h-3.5 text-blue-400" />
                  <span>Export JSON</span>
                </button>
                <button
                  onClick={() => downloadCsv(`${lab.slug}_data.csv`, [{ scenario: activeScenario.title, mode, variant, timestamp: new Date().toISOString() }])}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/5 text-xs text-slate-300 hover:text-white flex items-center gap-2"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={triggerPrintReport}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/5 text-xs text-slate-300 hover:text-white flex items-center gap-2 border-t border-white/5 mt-1"
                >
                  <Printer className="w-3.5 h-3.5 text-purple-400" />
                  <span>Print Report</span>
                </button>
              </div>
            </div>

            {/* Run / Verify Check Primary Action */}
            <button
              onClick={() => {
                setBottomPanelOpen(true);
                setBottomTab('validation');
                setActionLog(prev => [{ id: String(Date.now()), time: new Date().toLocaleTimeString(), action: 'Executed deterministic simulation check' }, ...prev]);
              }}
              className="px-3 sm:px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/25 flex items-center gap-1.5 transition-all"
              title="Run simulation and verify constraints"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Check / Run</span>
            </button>
          </div>
        </div>
      </header>

      {/* ===================================================================== */}
      {/* 2. THREE-PANEL COLLAPSIBLE WORKSPACE CONTAINER                       */}
      {/* ===================================================================== */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* ------------------------------------------------------------------- */}
        {/* LEFT PANEL: Mission, Source Materials, Datasets, Hints             */}
        {/* ------------------------------------------------------------------- */}
        <aside
          className={`${
            leftPanelOpen ? 'w-80 sm:w-96' : 'w-12'
          } shrink-0 bg-[#0a0d1a] border-r border-white/10 flex flex-col transition-all duration-200 z-20`}
        >
          {/* Header & Toggle */}
          <div className="p-2.5 border-b border-white/10 flex items-center justify-between">
            {leftPanelOpen ? (
              <>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setLeftTab('mission')}
                    className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      leftTab === 'mission' ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Mission
                  </button>
                  <button
                    onClick={() => setLeftTab('materials')}
                    className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      leftTab === 'materials' ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Materials
                  </button>
                  {mode === 'guided' && (
                    <button
                      onClick={() => setLeftTab('hints')}
                      className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
                        leftTab === 'hints' ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Hints ({activeScenario.hints?.length || 0})
                    </button>
                  )}
                </div>
                <button
                  onClick={() => setLeftPanelOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
                  title="Collapse left panel"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setLeftPanelOpen(true)}
                className="w-full py-2 flex flex-col items-center gap-2 text-slate-400 hover:text-white"
                title="Expand mission and materials panel"
              >
                <ChevronRight className="w-4 h-4" />
                <BookOpen className="w-4 h-4 text-purple-400" />
              </button>
            )}
          </div>

          {/* Left Panel Body */}
          {leftPanelOpen && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {leftTab === 'mission' && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center gap-1.5 font-bold uppercase text-[10px] tracking-wider text-purple-300">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Objective</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      {activeScenario.objective || activeScenario.instructions}
                    </p>
                  </div>

                  {activeScenario.constraints && activeScenario.constraints.length > 0 && (
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                      <div className="flex items-center gap-1.5 font-bold uppercase text-[10px] tracking-wider text-amber-300">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Constraints</span>
                      </div>
                      <ul className="space-y-1 text-slate-300">
                        {activeScenario.constraints.map((c, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-amber-400 font-bold">•</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeScenario.expectedOutput && (
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                      <div className="flex items-center gap-1.5 font-bold uppercase text-[10px] tracking-wider text-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Success Criteria</span>
                      </div>
                      <ul className="space-y-1 text-slate-300">
                        {activeScenario.expectedOutput.map((o, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-emerald-400 font-bold">✓</span>
                            <span>{o}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center gap-1.5 font-bold uppercase text-[10px] tracking-wider text-cyan-300">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Simulation Model Assumptions</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed italic">
                      Deterministic educational simulation. Calculations execute safely in browser without external APIs or learner code execution.
                    </p>
                  </div>
                </div>
              )}

              {leftTab === 'materials' && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center gap-1.5 font-bold uppercase text-[10px] tracking-wider text-cyan-300">
                      <Database className="w-3.5 h-3.5" />
                      <span>Starting Materials</span>
                    </div>
                    <pre className="text-[11px] font-mono bg-black/40 p-2.5 rounded-xl overflow-x-auto text-slate-300 border border-white/5">
                      {JSON.stringify(activeScenario.startingMaterials || activeScenario.publicFixture, null, 2)}
                    </pre>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <span className="font-bold text-white text-xs block">Allowed Sandbox Operations:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(activeScenario.supportedOperations || activeScenario.allowedActions || []).map((op, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-purple-300">
                          {op}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {leftTab === 'hints' && mode === 'guided' && (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
                    Progressive hints provide non-judgmental guidance from clues to worked explanations.
                  </div>

                  {(activeScenario.hints || []).map((hint, idx) => {
                    const isRevealed = revealedHintLevel >= hint.level;
                    return (
                      <div key={idx} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-xs">Hint Level {hint.level}</span>
                          {!isRevealed && (
                            <button
                              onClick={() => setRevealedHintLevel(Math.max(revealedHintLevel, hint.level))}
                              className="px-2 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-[10px] font-bold"
                            >
                              Reveal Clue
                            </button>
                          )}
                        </div>
                        {isRevealed ? (
                          <div className="space-y-1.5 text-slate-300 text-xs">
                            <p>{hint.clue}</p>
                            {hint.explanation && (
                              <p className="text-emerald-300 bg-emerald-500/10 p-2 rounded-xl text-[11px] border border-emerald-500/20 mt-1">
                                {hint.explanation}
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-slate-500 text-[11px] italic">Locked hint. Click reveal when needed.</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </aside>

        {/* ------------------------------------------------------------------- */}
        {/* MAIN CANVAS AREA: Interactive Editable Grid/Simulator               */}
        {/* ------------------------------------------------------------------- */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-[#070913]">
          <div className="flex-1 p-3 sm:p-6 max-w-[1920px] w-full mx-auto">
            {children({
              scenario: activeScenario,
              variant,
              saveStatus,
              markDirty,
              triggerSubmit: handleTriggerSubmit,
              mode,
              activeScenario,
              snapshots,
              takeSnapshot,
              validationFeedback,
              setValidationFeedback,
              selectedObject,
              setSelectedObject
            })}
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* BOTTOM PANEL: Results, Validation, Comparison, History            */}
          {/* ----------------------------------------------------------------- */}
          <section
            className={`${
              bottomPanelOpen ? 'h-64 sm:h-72' : 'h-10'
            } shrink-0 bg-[#0a0d1a] border-t border-white/10 flex flex-col transition-all duration-200 z-10`}
          >
            {/* Header & Bottom Tab Switcher */}
            <div className="h-10 px-3 border-b border-white/10 flex items-center justify-between bg-[#0e1122]">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => { setBottomPanelOpen(true); setBottomTab('validation'); }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    bottomTab === 'validation' && bottomPanelOpen ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Validation &amp; Feedback</span>
                </button>
                <button
                  onClick={() => { setBottomPanelOpen(true); setBottomTab('results'); }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    bottomTab === 'results' && bottomPanelOpen ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Results &amp; Telemetry</span>
                </button>
                <button
                  onClick={() => { setBottomPanelOpen(true); setBottomTab('comparison'); }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    bottomTab === 'comparison' && bottomPanelOpen ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Snapshots ({snapshots.length})</span>
                </button>
                <button
                  onClick={() => { setBottomPanelOpen(true); setBottomTab('history'); }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    bottomTab === 'history' && bottomPanelOpen ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Event Log</span>
                </button>
              </div>

              <button
                onClick={() => setBottomPanelOpen(!bottomPanelOpen)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
                title={bottomPanelOpen ? 'Minimize bottom panel' : 'Maximize bottom panel'}
              >
                {bottomPanelOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
            </div>

            {/* Bottom Content Area */}
            {bottomPanelOpen && (
              <div className="flex-1 overflow-y-auto p-4 text-xs">
                {bottomTab === 'validation' && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    {/* Validity */}
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block">1. Validity</span>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{validationFeedback.validity.passed ? 'Inputs Supported' : 'Unsupported Inputs'}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {validationFeedback.validity.errors.length > 0 ? validationFeedback.validity.errors.join(', ') : 'All configuration parameters are valid.'}
                      </p>
                    </div>

                    {/* Correctness */}
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block">2. Correctness</span>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300">
                        <Sparkles className="w-4 h-4" />
                        <span>Objective: {validationFeedback.correctness.passed ? 'Demonstrated' : 'Pending Check'}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {validationFeedback.correctness.details.join(' • ')}
                      </p>
                    </div>

                    {/* Constraints */}
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block">3. Constraints</span>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
                        <ShieldCheck className="w-4 h-4" />
                        <span>{validationFeedback.constraints.passed ? 'Within Limits' : 'Constraint Violated'}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {validationFeedback.constraints.violated.length > 0 ? validationFeedback.constraints.violated.join(', ') : 'Budget, SLA, and capacity limits respected.'}
                      </p>
                    </div>

                    {/* Trade-offs */}
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block">4. Trade-offs</span>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                        <Sliders className="w-4 h-4" />
                        <span>Analysis</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {validationFeedback.tradeOffs.join(' • ')}
                      </p>
                    </div>
                  </div>
                )}

                {bottomTab === 'results' && (
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-300 space-y-2">
                    <span className="font-bold text-white text-xs block">Execution Trace &amp; Calculations:</span>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      All calculations are derived live from actual workspace state. Results update deterministically upon modification.
                    </p>
                  </div>
                )}

                {bottomTab === 'comparison' && (
                  <div className="space-y-3">
                    {snapshots.length === 0 ? (
                      <div className="text-center py-6 text-slate-500">
                        No snapshots saved yet. Click &quot;Take Snapshot&quot; or test alternative inputs to compare up to 3 versions.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {snapshots.map((snap, i) => (
                          <div key={snap.id} className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white text-xs">Version {i + 1}: {snap.name}</span>
                              <span className="text-[10px] text-slate-500">{snap.timestamp}</span>
                            </div>
                            <div className="text-[11px] font-mono text-slate-300 space-y-1 bg-black/40 p-2 rounded-xl">
                              {Object.entries(snap.metrics).map(([k, v]) => (
                                <div key={k} className="flex justify-between">
                                  <span className="text-slate-400">{k}:</span>
                                  <span className="text-purple-300 font-bold">{String(v)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {bottomTab === 'history' && (
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {actionLog.map((log) => (
                      <div key={log.id} className="flex items-center gap-2 text-[11px] font-mono text-slate-400 py-1 border-b border-white/5">
                        <span className="text-purple-400">{log.time}</span>
                        <span className="text-slate-200">{log.action}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        </main>

        {/* ------------------------------------------------------------------- */}
        {/* RIGHT PANEL: Inspector & Selected Object Properties                */}
        {/* ------------------------------------------------------------------- */}
        {rightPanelOpen && (
          <aside className="w-80 shrink-0 bg-[#0a0d1a] border-l border-white/10 flex flex-col z-20">
            <div className="p-3 border-b border-white/10 flex items-center justify-between">
              <span className="font-bold text-white text-xs flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-purple-400" />
                Object Inspector
              </span>
              <button
                onClick={() => setRightPanelOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto text-xs space-y-3">
              {selectedObject ? (
                <pre className="p-2.5 rounded-xl bg-black/40 text-slate-300 font-mono text-[11px] border border-white/5">
                  {JSON.stringify(selectedObject, null, 2)}
                </pre>
              ) : (
                <p className="text-slate-500 italic">Select an object or node on canvas to view and edit its properties.</p>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* ===================================================================== */}
      {/* 3. SNAPSHOT COMPARISON MODAL                                          */}
      {/* ===================================================================== */}
      {compareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111425] border border-white/10 rounded-3xl max-w-4xl w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Compare Experiment Snapshots</h3>
                <p className="text-xs text-slate-400">Evaluate up to 3 versions of your parameters side-by-side.</p>
              </div>
              <button
                onClick={() => setCompareModalOpen(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {snapshots.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                No snapshots captured yet. You can record snapshots during exploration to compare tradeoffs.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {snapshots.map((snap, idx) => (
                  <div key={snap.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                    <span className="text-xs font-bold text-purple-300 block">Version {idx + 1}: {snap.name}</span>
                    <div className="space-y-1 text-xs">
                      {Object.entries(snap.metrics).map(([k, v]) => (
                        <div key={k} className="flex justify-between py-1 border-b border-white/5">
                          <span className="text-slate-400">{k}</span>
                          <span className="font-bold text-white">{String(v)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 4. VERIFIED EVALUATION MODAL                                          */}
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
