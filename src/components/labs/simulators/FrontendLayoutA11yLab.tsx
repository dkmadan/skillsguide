'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { LabScenarioVariant, LabDifficulty } from '@/lib/labs/types';
import { useUndoableState } from '@/lib/labs/useUndoableState';
import { evaluateContrast, ContrastEvaluation } from '@/lib/labs/colorUtils';
import { downloadJson } from '@/lib/labs/exportHelper';
import {
  Monitor,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Undo2,
  Redo2,
  Sparkles,
  ArrowRight,
  Eye,
  Sliders,
  Keyboard,
  ShieldCheck,
  Palette,
  Layers,
  FileText
} from 'lucide-react';

interface Props {
  scenario?: LabScenarioVariant;
  variant: LabDifficulty;
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

export interface UIComponentItem {
  id: string;
  name: string;
  tag: 'header' | 'nav' | 'section' | 'article' | 'button' | 'footer' | 'div';
  text: string;
  fgColor: string; // hex
  bgColor: string; // hex
  paddingPx: number;
  mobileWrap: boolean;
  tabIndex: number;
  ariaLabel: string;
  touchTargetPx: number;
}

interface PageState {
  components: UIComponentItem[];
  previewMode: 'desktop' | 'mobile';
}

const INITIAL_COMPONENTS: Record<LabDifficulty, UIComponentItem[]> = {
  beginner: [
    { id: 'c1', name: 'Header Navigation', tag: 'nav', text: 'SkillsGuide Academy', fgColor: '#e2e8f0', bgColor: '#0f172a', paddingPx: 16, mobileWrap: true, tabIndex: 1, ariaLabel: 'Main Navigation', touchTargetPx: 48 },
    { id: 'c2', name: 'Hero Banner Title', tag: 'section', text: 'Master Autonomous AI & Engineering', fgColor: '#ffffff', bgColor: '#1e1b4b', paddingPx: 32, mobileWrap: true, tabIndex: 2, ariaLabel: 'Hero Section', touchTargetPx: 48 },
    { id: 'c3', name: 'Enrollment CTA Button', tag: 'button', text: 'Enroll Now (Free)', fgColor: '#888888', bgColor: '#3b82f6', paddingPx: 12, mobileWrap: true, tabIndex: 4, ariaLabel: '', touchTargetPx: 48 }, // low contrast + missing ARIA label + tabIndex out of order!
    { id: 'c4', name: 'Curriculum Module Card', tag: 'article', text: 'Module 1: Advanced Full-Stack Architecture', fgColor: '#cbd5e1', bgColor: '#1e293b', paddingPx: 20, mobileWrap: false, tabIndex: 3, ariaLabel: 'Course Module', touchTargetPx: 48 },
    { id: 'c5', name: 'Footer Copyright', tag: 'footer', text: '© 2026 SkillsGuide Learning Directory', fgColor: '#94a3b8', bgColor: '#0f172a', paddingPx: 16, mobileWrap: true, tabIndex: 5, ariaLabel: 'Site Footer', touchTargetPx: 44 }
  ],
  intermediate: [
    { id: 'c1', name: 'Header Navigation', tag: 'nav', text: 'SkillsGuide Academy', fgColor: '#e2e8f0', bgColor: '#0f172a', paddingPx: 16, mobileWrap: true, tabIndex: 1, ariaLabel: 'Main Navigation', touchTargetPx: 48 },
    { id: 'c2', name: 'Hero Banner Title', tag: 'section', text: 'Master Cloud & System Design', fgColor: '#e0e7ff', bgColor: '#1e1b4b', paddingPx: 32, mobileWrap: true, tabIndex: 2, ariaLabel: 'Hero Section', touchTargetPx: 48 },
    { id: 'c3', name: 'Enrollment CTA Button', tag: 'button', text: 'Enroll Now', fgColor: '#60a5fa', bgColor: '#1e3a8a', paddingPx: 8, mobileWrap: true, tabIndex: 5, ariaLabel: '', touchTargetPx: 32 }, // low contrast + undersized target + tabIndex mismatch
    { id: 'c4', name: 'Curriculum Module Card', tag: 'article', text: 'Module 1: High Availability Distributed Systems', fgColor: '#cbd5e1', bgColor: '#1e293b', paddingPx: 20, mobileWrap: false, tabIndex: 3, ariaLabel: 'Course Module', touchTargetPx: 48 },
    { id: 'c5', name: 'Secondary Outline Button', tag: 'button', text: 'Download Syllabus', fgColor: '#93c5fd', bgColor: '#172554', paddingPx: 10, mobileWrap: true, tabIndex: 4, ariaLabel: 'Download Syllabus', touchTargetPx: 40 },
    { id: 'c6', name: 'Footer Copyright', tag: 'footer', text: '© 2026 SkillsGuide', fgColor: '#94a3b8', bgColor: '#0f172a', paddingPx: 16, mobileWrap: true, tabIndex: 6, ariaLabel: 'Site Footer', touchTargetPx: 44 }
  ],
  challenge: [
    { id: 'c1', name: 'Header Navigation', tag: 'nav', text: 'SkillsGuide Academy', fgColor: '#e2e8f0', bgColor: '#0f172a', paddingPx: 16, mobileWrap: true, tabIndex: 1, ariaLabel: 'Main Navigation', touchTargetPx: 48 },
    { id: 'c2', name: 'Hero Banner Title', tag: 'section', text: 'FinOps & SRE Resilience', fgColor: '#cbd5e1', bgColor: '#0f172a', paddingPx: 32, mobileWrap: true, tabIndex: 4, ariaLabel: 'Hero', touchTargetPx: 48 }, // focus out of order
    { id: 'c3', name: 'Enrollment CTA Button', tag: 'button', text: 'Enroll Now', fgColor: '#888888', bgColor: '#2563eb', paddingPx: 6, mobileWrap: false, tabIndex: 6, ariaLabel: '   ', touchTargetPx: 28 }, // whitespace aria, undersized, low contrast
    { id: 'c4', name: 'Curriculum Module Card', tag: 'article', text: 'Module 1: Observability & Chaos Engineering', fgColor: '#cbd5e1', bgColor: '#1e293b', paddingPx: 20, mobileWrap: false, tabIndex: 2, ariaLabel: 'Module', touchTargetPx: 48 },
    { id: 'c5', name: 'Footer Copyright', tag: 'footer', text: '© 2026 SkillsGuide', fgColor: '#64748b', bgColor: '#0f172a', paddingPx: 16, mobileWrap: true, tabIndex: 5, ariaLabel: 'Site Footer', touchTargetPx: 44 }
  ]
};

export default function FrontendLayoutA11yLab({ variant, onDirty, onSubmit }: Props) {
  const initial = useMemo<PageState>(() => ({
    components: INITIAL_COMPONENTS[variant] || INITIAL_COMPONENTS.beginner,
    previewMode: 'desktop'
  }), [variant]);

  const { state, set, undo, redo, canUndo, canRedo } = useUndoableState<PageState>(initial);
  const [selectedCompId, setSelectedCompId] = useState<string>('c3');
  const [focusedTabIndex, setFocusedTabIndex] = useState<number | null>(null);

  const selectedComponent = useMemo(() => {
    return state.components.find(c => c.id === selectedCompId) || state.components[0];
  }, [state.components, selectedCompId]);

  const updateSelectedComponent = useCallback((patch: Partial<UIComponentItem>) => {
    set(prev => ({
      ...prev,
      components: prev.components.map(c => c.id === selectedCompId ? { ...c, ...patch } : c)
    }));
    onDirty();
  }, [selectedCompId, set, onDirty]);

  // Evaluate WCAG contrast for all components
  const contrastEvaluations = useMemo(() => {
    const res: Record<string, ContrastEvaluation> = {};
    state.components.forEach(c => {
      res[c.id] = evaluateContrast(c.fgColor, c.bgColor);
    });
    return res;
  }, [state.components]);

  // Audit results summary
  const auditSummary = useMemo(() => {
    let contrastFails = 0;
    let missingAria = 0;
    let undersizedTouch = 0;
    let focusOrderIssues = 0;

    state.components.forEach((c, idx) => {
      const evalResult = contrastEvaluations[c.id];
      if (evalResult && !evalResult.wcagAANormal) contrastFails++;
      if (c.ariaLabel.trim().length === 0) missingAria++;
      if (c.tag === 'button' && c.touchTargetPx < 44) undersizedTouch++;
      // Check if tabIndex matches expected reading position (idx + 1)
      if (c.tabIndex !== idx + 1) focusOrderIssues++;
    });

    return {
      totalDefects: contrastFails + missingAria + undersizedTouch + focusOrderIssues,
      contrastFails,
      missingAria,
      undersizedTouch,
      focusOrderIssues
    };
  }, [state.components, contrastEvaluations]);

  // Step keyboard focus sequentially
  const handleNextFocus = () => {
    const sorted = [...state.components].sort((a, b) => a.tabIndex - b.tabIndex);
    if (focusedTabIndex === null) {
      setFocusedTabIndex(sorted[0].tabIndex);
    } else {
      const currentIdx = sorted.findIndex(c => c.tabIndex === focusedTabIndex);
      const nextIdx = (currentIdx + 1) % sorted.length;
      setFocusedTabIndex(sorted[nextIdx].tabIndex);
    }
  };

  const handleSubmit = () => {
    onSubmit({
      variant,
      componentsState: state.components,
      auditSummary,
      passedWCAG: auditSummary.totalDefects === 0,
      activePreview: state.previewMode
    });
  };

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* ===================================================================== */}
      {/* TOOLBAR: Desktop / Mobile Preview & Focus Simulation Controls         */}
      {/* ===================================================================== */}
      <div className="p-3 rounded-2xl bg-[#0f1325] border border-white/10 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-2">
          <div className="inline-flex p-0.5 rounded-xl bg-white/5 border border-white/10">
            <button
              onClick={() => set(prev => ({ ...prev, previewMode: 'desktop' }))}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                state.previewMode === 'desktop' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop (1280px)</span>
            </button>

            <button
              onClick={() => set(prev => ({ ...prev, previewMode: 'mobile' }))}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                state.previewMode === 'mobile' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile (375px)</span>
            </button>
          </div>

          <button
            onClick={handleNextFocus}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white flex items-center gap-1.5 transition-all font-semibold"
            title="Simulate Tab key press to inspect focus progression"
          >
            <Keyboard className="w-3.5 h-3.5 text-cyan-400" />
            <span>Step Keyboard Focus {focusedTabIndex !== null ? `(Focus: Tab ${focusedTabIndex})` : ''}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-[11px]">
            <span className="text-slate-400">A11y Audit:</span>
            <span className={`font-bold ${auditSummary.totalDefects === 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {auditSummary.totalDefects === 0 ? '✓ WCAG AA Certified' : `${auditSummary.totalDefects} Issues Detected`}
            </span>
          </div>

          <button onClick={undo} disabled={!canUndo} className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 border border-white/10 text-slate-300">
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={redo} disabled={!canRedo} className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 border border-white/10 text-slate-300">
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* SPLIT VIEW: Live Rendered Canvas & Direct Inspector                   */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Rendered Live Canvas Container */}
        <div className="lg:col-span-8 flex justify-center bg-[#070914] p-4 sm:p-6 rounded-3xl border border-white/10 overflow-x-auto min-h-[420px] shadow-2xl">
          <div
            className={`transition-all duration-300 flex flex-col space-y-3 bg-[#0a0d1d] p-4 rounded-2xl border border-white/10 ${
              state.previewMode === 'mobile' ? 'w-[375px] max-w-[375px] shadow-2xl ring-4 ring-slate-800' : 'w-full max-w-3xl'
            }`}
          >
            {state.components.map((comp) => {
              const isSelected = selectedCompId === comp.id;
              const hasFocus = focusedTabIndex === comp.tabIndex;
              const evalRes = contrastEvaluations[comp.id];
              const contrastPass = evalRes?.wcagAANormal;

              return (
                <div
                  key={comp.id}
                  onClick={() => setSelectedCompId(comp.id)}
                  style={{
                    color: comp.fgColor,
                    backgroundColor: comp.bgColor,
                    padding: `${comp.paddingPx}px`,
                    minHeight: `${comp.touchTargetPx}px`
                  }}
                  className={`rounded-xl cursor-pointer relative transition-all flex flex-col justify-between ${
                    isSelected ? 'ring-2 ring-purple-500 shadow-lg' : 'hover:ring-1 hover:ring-white/20'
                  } ${hasFocus ? 'outline-2 outline-cyan-400 outline-offset-2' : ''}`}
                >
                  {/* Accessibility & Diagnostic Badges Header */}
                  <div className="flex items-center justify-between gap-1 mb-1 text-[10px] font-mono opacity-85">
                    <span className="px-1.5 py-0.5 rounded bg-black/40 text-slate-300 font-bold">
                      &lt;{comp.tag}&gt; Tab: {comp.tabIndex}
                    </span>

                    <div className="flex items-center gap-1">
                      <span className={`px-1.5 py-0.5 rounded font-bold ${contrastPass ? 'bg-emerald-500/30 text-emerald-200' : 'bg-red-500/40 text-red-200 animate-pulse'}`}>
                        {evalRes?.ratioFormatted || '--'} {contrastPass ? 'AA' : 'FAIL'}
                      </span>
                      {comp.ariaLabel.trim() === '' && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/40 text-amber-200 font-bold" title="Missing ARIA label">
                          NO ARIA
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Component Rendered Text */}
                  <div className="font-semibold text-xs sm:text-sm leading-snug">
                    {comp.text}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Component Property Inspector Panel */}
        <div className="lg:col-span-4 space-y-3">
          <div className="p-4 rounded-3xl bg-[#0f1325] border border-white/10 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="font-bold text-white text-xs flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-purple-400" />
                <span>Selected: {selectedComponent.name}</span>
              </span>
              <span className="font-mono text-[10px] text-purple-300">ID: {selectedComponent.id}</span>
            </div>

            {/* Content Text */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 block font-semibold">Element Content Text:</label>
              <input
                type="text"
                value={selectedComponent.text}
                onChange={(e) => updateSelectedComponent({ text: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-white font-medium text-xs"
              />
            </div>

            {/* Colors (Foreground & Background Hex) */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 block font-semibold">Text Color (FG):</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={selectedComponent.fgColor.startsWith('#') ? selectedComponent.fgColor : '#ffffff'}
                    onChange={(e) => updateSelectedComponent({ fgColor: e.target.value })}
                    className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={selectedComponent.fgColor}
                    onChange={(e) => updateSelectedComponent({ fgColor: e.target.value })}
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-2 py-1 font-mono text-[11px] text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 block font-semibold">Background (BG):</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={selectedComponent.bgColor.startsWith('#') ? selectedComponent.bgColor : '#000000'}
                    onChange={(e) => updateSelectedComponent({ bgColor: e.target.value })}
                    className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={selectedComponent.bgColor}
                    onChange={(e) => updateSelectedComponent({ bgColor: e.target.value })}
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-2 py-1 font-mono text-[11px] text-white"
                  />
                </div>
              </div>
            </div>

            {/* Mathematical Contrast Ratio Card */}
            {contrastEvaluations[selectedComponent.id] && (
              <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-semibold">WCAG 2.1 Contrast Ratio:</span>
                  <span className={`font-mono font-bold text-xs ${contrastEvaluations[selectedComponent.id].wcagAANormal ? 'text-emerald-400' : 'text-red-400'}`}>
                    {contrastEvaluations[selectedComponent.id].ratioFormatted}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Status:</span>
                  <span className="font-bold text-slate-200">{contrastEvaluations[selectedComponent.id].statusText}</span>
                </div>
                {!contrastEvaluations[selectedComponent.id].wcagAANormal && (
                  <p className="text-[10px] text-red-300 pt-1 border-t border-white/5">
                    Fails WCAG AA minimum 4.5:1 ratio. Adjust text color lighter or background darker.
                  </p>
                )}
              </div>
            )}

            {/* ARIA Label & Focus Order */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 block font-semibold">ARIA Label (Accessibility):</label>
              <input
                type="text"
                value={selectedComponent.ariaLabel}
                onChange={(e) => updateSelectedComponent({ ariaLabel: e.target.value })}
                placeholder="e.g. Enroll in Free Course"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-white text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 block font-semibold">Focus tabIndex:</label>
                <input
                  type="number"
                  value={selectedComponent.tabIndex}
                  onChange={(e) => updateSelectedComponent({ tabIndex: parseInt(e.target.value, 10) || 1 })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 font-mono text-white text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 block font-semibold">Touch Target (px):</label>
                <input
                  type="number"
                  value={selectedComponent.touchTargetPx}
                  onChange={(e) => updateSelectedComponent({ touchTargetPx: parseInt(e.target.value, 10) || 24 })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 font-mono text-white text-xs"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => updateSelectedComponent({ fgColor: '#ffffff', ariaLabel: selectedComponent.name, touchTargetPx: 48, tabIndex: state.components.findIndex(c => c.id === selectedComponent.id) + 1 })}
                className="w-full py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 font-bold text-xs transition-colors"
              >
                Apply Remediation Preset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* SUBMISSION BAR                                                        */}
      {/* ===================================================================== */}
      <div className="p-4 rounded-2xl bg-[#0f1325] border border-white/10 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span>Contrast Failures: <strong className={auditSummary.contrastFails === 0 ? 'text-emerald-400' : 'text-red-400'}>{auditSummary.contrastFails}</strong></span>
          <span>•</span>
          <span>Missing ARIA Labels: <strong className={auditSummary.missingAria === 0 ? 'text-emerald-400' : 'text-amber-400'}>{auditSummary.missingAria}</strong></span>
          <span>•</span>
          <span>Undersized Touch Targets: <strong className={auditSummary.undersizedTouch === 0 ? 'text-emerald-400' : 'text-red-400'}>{auditSummary.undersizedTouch}</strong></span>
        </div>

        <button
          onClick={handleSubmit}
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
        >
          <span>Submit Interface Layout for Verification</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
