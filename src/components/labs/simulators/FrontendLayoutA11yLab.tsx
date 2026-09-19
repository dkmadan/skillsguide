'use client';

import React, { useMemo, useState } from 'react';
import { LabScenarioVariant, LabDifficulty } from '@/lib/labs/types';
import { useUndoableState } from '@/lib/labs/useUndoableState';
import { downloadCsv, downloadJson } from '@/lib/labs/exportHelper';
import ChartFrame from '@/components/labs/charts/ChartFrame';
import CompareBarChart from '@/components/labs/charts/CompareBarChart';
import { Undo2, Redo2, RotateCcw, Download, FileJson, BarChart3 } from 'lucide-react';

interface Props {
  scenario?: LabScenarioVariant;
  variant: LabDifficulty;
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

interface ComponentNode {
  id: string;
  type: 'navbar' | 'hero' | 'cardGrid' | 'ctaButton' | 'secondaryButton';
  title: string;
  ariaLabel: string;
  contrastRatio: number;
  mobileStack: boolean;
  tabIndex: number; // intended focus order — should equal visual DOM position + 1
  interactive: boolean;
  touchTargetPx: number; // WCAG 2.2 minimum target size is 44px for interactive elements
}

// Three fixtures with increasing accessibility ambiguity, all sharing the
// same defect *types* from beginner onward (contrast, missing label, mobile
// overflow, focus-order mismatch, undersized touch target) — higher tiers
// add borderline/near-miss values that are harder to eyeball.
const NODE_POOLS: Record<LabDifficulty, ComponentNode[]> = {
  beginner: [
    { id: 'node-1', type: 'navbar', title: 'Header Navigation', ariaLabel: 'Main Navigation', contrastRatio: 5.2, mobileStack: true, tabIndex: 1, interactive: true, touchTargetPx: 48 },
    { id: 'node-2', type: 'hero', title: 'Course Hero Banner', ariaLabel: 'Course Overview', contrastRatio: 7.1, mobileStack: true, tabIndex: 2, interactive: false, touchTargetPx: 48 },
    { id: 'node-3', type: 'cardGrid', title: 'Curriculum Modules Grid', ariaLabel: 'Module List', contrastRatio: 4.6, mobileStack: false, tabIndex: 3, interactive: false, touchTargetPx: 48 }, // mobileStack bug
    { id: 'node-4', type: 'ctaButton', title: 'Enroll Now CTA Button', ariaLabel: '', contrastRatio: 2.8, mobileStack: true, tabIndex: 4, interactive: true, touchTargetPx: 48 }, // missing label + contrast bug
  ],
  intermediate: [
    { id: 'node-1', type: 'navbar', title: 'Header Navigation', ariaLabel: 'Main Navigation', contrastRatio: 5.2, mobileStack: true, tabIndex: 1, interactive: true, touchTargetPx: 48 },
    { id: 'node-2', type: 'hero', title: 'Course Hero Banner', ariaLabel: 'Course Overview', contrastRatio: 4.4, mobileStack: true, tabIndex: 2, interactive: false, touchTargetPx: 48 }, // borderline fail (4.4 < 4.5)
    { id: 'node-3', type: 'cardGrid', title: 'Curriculum Modules Grid', ariaLabel: 'Module List', contrastRatio: 4.6, mobileStack: false, tabIndex: 4, interactive: false, touchTargetPx: 48 }, // mobileStack bug + focus-order mismatch (should be 3rd)
    { id: 'node-4', type: 'ctaButton', title: 'Enroll Now CTA Button', ariaLabel: '', contrastRatio: 2.8, mobileStack: true, tabIndex: 3, interactive: true, touchTargetPx: 32 }, // missing label, contrast bug, undersized target, focus-order mismatch
    { id: 'node-5', type: 'secondaryButton', title: 'View Syllabus Button', ariaLabel: 'View course syllabus PDF', contrastRatio: 5.0, mobileStack: true, tabIndex: 5, interactive: true, touchTargetPx: 44 },
  ],
  challenge: [
    { id: 'node-1', type: 'navbar', title: 'Header Navigation', ariaLabel: 'Main Navigation', contrastRatio: 5.2, mobileStack: true, tabIndex: 1, interactive: true, touchTargetPx: 48 },
    { id: 'node-2', type: 'hero', title: 'Course Hero Banner', ariaLabel: 'Course Overview', contrastRatio: 4.4, mobileStack: true, tabIndex: 3, interactive: false, touchTargetPx: 48 }, // borderline fail + focus-order mismatch (should be 2nd)
    { id: 'node-3', type: 'cardGrid', title: 'Curriculum Modules Grid', ariaLabel: 'Module List', contrastRatio: 4.6, mobileStack: false, tabIndex: 2, interactive: false, touchTargetPx: 48 }, // mobileStack bug + focus-order mismatch
    { id: 'node-4', type: 'ctaButton', title: 'Enroll Now CTA Button', ariaLabel: '   ', contrastRatio: 2.8, mobileStack: true, tabIndex: 6, interactive: true, touchTargetPx: 32 }, // whitespace-only label (must count as missing), contrast bug, undersized target, focus-order mismatch
    { id: 'node-5', type: 'secondaryButton', title: 'View Syllabus Button', ariaLabel: 'View course syllabus PDF', contrastRatio: 4.5, mobileStack: true, tabIndex: 5, interactive: true, touchTargetPx: 44 }, // borderline PASS exactly at threshold
    { id: 'node-6', type: 'ctaButton', title: 'Share Progress Button', ariaLabel: 'Share course progress', contrastRatio: 6.0, mobileStack: false, tabIndex: 4, interactive: true, touchTargetPx: 40 }, // mobileStack bug + undersized target + focus-order mismatch
  ],
};

interface FrontendState {
  nodes: ComponentNode[];
  previewMode: 'desktop' | 'mobile';
}

const AA_MIN_CONTRAST = 4.5;
const MIN_TOUCH_TARGET = 44;

function hasNonEmptyLabel(label: string): boolean {
  return label.trim().length > 0;
}

export default function FrontendLayoutA11yLab({ variant, onDirty, onSubmit }: Props) {
  const initialNodes = NODE_POOLS[variant];
  const { state, set, undo, redo, reset, canUndo, canRedo, stepIndex } = useUndoableState<FrontendState>({ nodes: initialNodes, previewMode: 'desktop' });
  const [showFocusOrder, setShowFocusOrder] = useState(false);
  const [showTargetOverlay, setShowTargetOverlay] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState(initialNodes[initialNodes.length - 1].id);
  const [simulationState, setSimulationState] = useState<'normal' | 'loading' | 'empty'>('normal');
  const [visitedLoading, setVisitedLoading] = useState(false);
  const [visitedEmpty, setVisitedEmpty] = useState(false);

  const nodes = state.nodes;
  const activeNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  const update = (patch: Partial<FrontendState>) => {
    set((prev) => ({ ...prev, ...patch }));
    onDirty();
  };

  const updateActiveNode = (updates: Partial<ComponentNode>) => {
    update({ nodes: nodes.map((n) => (n.id === selectedNodeId ? { ...n, ...updates } : n)) });
  };

  const handleToggleAriaFix = () => {
    updateActiveNode({
      ariaLabel: hasNonEmptyLabel(activeNode.ariaLabel) ? activeNode.ariaLabel : `${activeNode.title}`,
      contrastRatio: activeNode.contrastRatio < AA_MIN_CONTRAST ? 5.8 : activeNode.contrastRatio,
      touchTargetPx: activeNode.interactive && activeNode.touchTargetPx < MIN_TOUCH_TARGET ? 48 : activeNode.touchTargetPx,
    });
  };

  const handleFixMobileStack = () => {
    update({ nodes: nodes.map((n) => ({ ...n, mobileStack: true })) });
  };

  const handleFixFocusOrder = () => {
    // Renumber tabIndex to match visual DOM order (array position + 1) —
    // the deterministic, keyboard-verifiable notion of "correct" focus order.
    update({ nodes: nodes.map((n, i) => ({ ...n, tabIndex: i + 1 })) });
  };

  const focusOrderCorrect = useMemo(() => nodes.every((n, i) => n.tabIndex === i + 1), [nodes]);
  const allContrastOk = useMemo(() => nodes.every((n) => n.contrastRatio >= AA_MIN_CONTRAST), [nodes]);
  const allLabelsOk = useMemo(() => nodes.every((n) => hasNonEmptyLabel(n.ariaLabel)), [nodes]);
  const allStackedOnMobile = useMemo(() => nodes.every((n) => n.mobileStack), [nodes]);
  const allTouchTargetsOk = useMemo(() => nodes.every((n) => !n.interactive || n.touchTargetPx >= MIN_TOUCH_TARGET), [nodes]);

  const contrastChartData = useMemo(() => ({
    labels: nodes.map((n) => n.type),
    values: nodes.map((n) => n.contrastRatio),
    statusOverride: nodes.map((n) => (n.contrastRatio >= AA_MIN_CONTRAST ? 'good' : 'critical') as 'good' | 'critical'),
  }), [nodes]);

  const handleExportJson = () => {
    downloadJson('frontend_layout_a11y_config.json', {
      variant,
      layoutComponents: nodes,
      previewMode: state.previewMode,
      wcagPassed: allContrastOk && allLabelsOk && allStackedOnMobile && allTouchTargetsOk && focusOrderCorrect,
    });
  };

  const handleExportChecklistCsv = () => {
    downloadCsv('frontend_a11y_checklist.csv', nodes.map((n) => ({
      component: n.title, type: n.type, contrast_ratio: n.contrastRatio, contrast_pass: n.contrastRatio >= AA_MIN_CONTRAST,
      aria_label_present: hasNonEmptyLabel(n.ariaLabel), mobile_stack: n.mobileStack, tab_index: n.tabIndex,
      touch_target_px: n.touchTargetPx, touch_target_pass: !n.interactive || n.touchTargetPx >= MIN_TOUCH_TARGET,
    })));
  };

  const handleFinalSubmit = () => {
    onSubmit({
      variant,
      nodes,
      previewMode: state.previewMode,
      simulationState,
      showFocusOrder,
      focusOrderCorrect,
      allContrastOk,
      allLabelsOk,
      allStackedOnMobile,
      allTouchTargetsOk,
      visitedLoadingState: visitedLoading,
      visitedEmptyState: visitedEmpty,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Lab 09 • Modern Frontend Architecture
            </span>
            <h2 className="text-xl font-bold text-white mt-2">Frontend Layout, Responsive Grid &amp; WCAG 2.2 Accessibility</h2>
            <p className="text-sm text-slate-400 mt-1">
              Assemble developer-approved component tokens. Eliminate low-contrast elements (4.5:1 minimum), ensure mobile card stacking, correct keyboard focus order, and meet the 44px minimum touch target.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={undo} disabled={!canUndo} title="Undo" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 disabled:opacity-30"><Undo2 className="w-4 h-4" /></button>
            <button type="button" onClick={redo} disabled={!canRedo} title="Redo" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 disabled:opacity-30"><Redo2 className="w-4 h-4" /></button>
            <button type="button" onClick={() => { reset(); onDirty(); }} title="Reset layout" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"><RotateCcw className="w-4 h-4" /></button>
            <button type="button" onClick={handleExportJson} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition">Export Tokens</button>
            <button type="button" onClick={handleFinalSubmit} className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition shadow-lg shadow-cyan-500/20">Submit Layout</button>
          </div>
        </div>
      </div>

      {/* Control Bar: Viewport & Simulation State */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 rounded-xl p-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Viewport:</span>
          <button type="button" onClick={() => update({ previewMode: 'desktop' })} className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${state.previewMode === 'desktop' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>Desktop (1280px)</button>
          <button type="button" onClick={() => update({ previewMode: 'mobile' })} className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${state.previewMode === 'mobile' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>Mobile (390px Stack)</button>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button type="button" onClick={() => setShowFocusOrder(!showFocusOrder)}
            className={`px-3 py-1 text-xs font-semibold rounded-lg border transition ${showFocusOrder ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
            {showFocusOrder ? 'Hide Focus Order' : 'Show Focus Order (#)'}
          </button>
          <button type="button" onClick={() => setShowTargetOverlay(!showTargetOverlay)}
            className={`px-3 py-1 text-xs font-semibold rounded-lg border transition ${showTargetOverlay ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
            {showTargetOverlay ? 'Hide Target Overlay' : 'Show Target Size Overlay'}
          </button>
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400">State:</span>
            {(['normal', 'loading', 'empty'] as const).map((st) => (
              <button key={st} type="button" onClick={() => { setSimulationState(st); if (st === 'loading') setVisitedLoading(true); if (st === 'empty') setVisitedEmpty(true); onDirty(); }}
                className={`px-2.5 py-1 rounded capitalize font-medium ${simulationState === st ? 'bg-slate-700 text-white font-bold' : 'bg-slate-800/60 text-slate-400'}`}>
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Workspace Split: Visual Canvas & A11y Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl p-6 min-h-[460px] flex flex-col items-center justify-start overflow-hidden">
          <div className={`transition-all duration-300 ${state.previewMode === 'mobile' ? 'w-[360px] border-x border-slate-800 shadow-2xl px-3 py-4' : 'w-full'}`}>
            <div className={state.previewMode === 'mobile' ? 'space-y-4' : 'space-y-4'}>
              {nodes.map((node) => {
                const isSelected = node.id === selectedNodeId;
                const overflowBug = !node.mobileStack && state.previewMode === 'mobile';
                const targetBug = node.interactive && node.touchTargetPx < MIN_TOUCH_TARGET;
                const hasA11yBug = !hasNonEmptyLabel(node.ariaLabel) || node.contrastRatio < AA_MIN_CONTRAST || overflowBug || targetBug;

                if (simulationState === 'loading' && node.type === 'cardGrid') {
                  return (
                    <div key={node.id} className="animate-pulse bg-slate-800/60 border border-slate-700/50 rounded-xl p-6 space-y-3">
                      <div className="h-4 bg-slate-700 rounded w-1/3" />
                      <div className="h-10 bg-slate-700/50 rounded" />
                    </div>
                  );
                }
                if (simulationState === 'empty' && node.type === 'cardGrid') {
                  return (
                    <div key={node.id} className="bg-slate-900 border border-dashed border-slate-700 rounded-xl p-8 text-center text-slate-400">
                      <p className="text-sm font-semibold">No modules published yet</p>
                      <p className="text-xs text-slate-500 mt-1">Empty state triggered deterministically.</p>
                    </div>
                  );
                }

                return (
                  <div key={node.id} role="button" tabIndex={0} onClick={() => setSelectedNodeId(node.id)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedNodeId(node.id); }}
                    className={`relative p-4 rounded-xl border transition cursor-pointer ${isSelected ? 'bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-500/10' : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'}`}>
                    {showFocusOrder && (
                      <span className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-mono font-bold text-xs flex items-center justify-center shadow">{node.tabIndex}</span>
                    )}
                    {showTargetOverlay && node.interactive && (
                      <span className={`absolute -top-2 -right-2 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${targetBug ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-slate-950'}`}>{node.touchTargetPx}px</span>
                    )}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wide">{node.type}</span>
                          {hasA11yBug && <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">A11y Warning</span>}
                        </div>
                        <h4 className="text-sm font-semibold text-white mt-1">{node.title}</h4>
                      </div>
                      <div className="text-right text-xs">
                        <div className="text-slate-400">Contrast: <span className={node.contrastRatio < AA_MIN_CONTRAST ? 'text-rose-400 font-bold' : 'text-emerald-400'}>{node.contrastRatio.toFixed(1)}:1</span></div>
                        <div className="text-slate-500 text-[11px]">ARIA: {hasNonEmptyLabel(node.ariaLabel) ? 'OK' : 'Missing'}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Component Inspector & A11y Auditor */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Component Inspector</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Selected Element</label>
                <div className="p-2 rounded bg-slate-950 text-cyan-400 font-mono font-semibold">{activeNode.title} ({activeNode.type})</div>
              </div>

              <div>
                <label htmlFor="aria-label-input" className="text-slate-400 block mb-1">Accessible Label (`aria-label`)</label>
                <input id="aria-label-input" type="text" value={activeNode.ariaLabel} onChange={(e) => updateActiveNode({ ariaLabel: e.target.value })}
                  placeholder="e.g. Enroll in curriculum" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500" />
              </div>

              <div>
                <label htmlFor="contrast-range" className="text-slate-400 block mb-1">Text Contrast Ratio (WCAG AA &gt;= 4.5:1)</label>
                <div className="flex items-center gap-3">
                  <input id="contrast-range" type="range" min="2.0" max="12.0" step="0.1" value={activeNode.contrastRatio}
                    onChange={(e) => updateActiveNode({ contrastRatio: parseFloat(e.target.value) })} className="flex-1 accent-cyan-500" />
                  <span className={`font-mono font-bold ${activeNode.contrastRatio < AA_MIN_CONTRAST ? 'text-rose-400' : 'text-emerald-400'}`}>{activeNode.contrastRatio.toFixed(1)}:1</span>
                </div>
              </div>

              {activeNode.interactive && (
                <div>
                  <label htmlFor="target-range" className="text-slate-400 block mb-1">Touch Target Size (WCAG 2.2 &gt;= 44px)</label>
                  <div className="flex items-center gap-3">
                    <input id="target-range" type="range" min="24" max="56" step="2" value={activeNode.touchTargetPx}
                      onChange={(e) => updateActiveNode({ touchTargetPx: parseInt(e.target.value, 10) })} className="flex-1 accent-cyan-500" />
                    <span className={`font-mono font-bold ${activeNode.touchTargetPx < MIN_TOUCH_TARGET ? 'text-rose-400' : 'text-emerald-400'}`}>{activeNode.touchTargetPx}px</span>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="tabindex-input" className="text-slate-400 block mb-1">Focus Order (tabIndex)</label>
                <input id="tabindex-input" type="number" min={1} max={nodes.length} value={activeNode.tabIndex}
                  onChange={(e) => updateActiveNode({ tabIndex: parseInt(e.target.value, 10) || 1 })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500" />
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-2">
                <button type="button" onClick={handleToggleAriaFix} className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition">Apply WCAG AA Fix</button>
                <button type="button" onClick={handleFixMobileStack} className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold transition">Enable Mobile Card Stacking</button>
                <button type="button" onClick={handleFixFocusOrder} className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold transition">Fix Focus Order to Match Visual Layout</button>
              </div>

              <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-1.5 text-[10px]">
                <span className={`px-2 py-1 rounded ${allContrastOk ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>Contrast {allContrastOk ? 'OK' : 'FAIL'}</span>
                <span className={`px-2 py-1 rounded ${allLabelsOk ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>Labels {allLabelsOk ? 'OK' : 'FAIL'}</span>
                <span className={`px-2 py-1 rounded ${allStackedOnMobile ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>Mobile Stack {allStackedOnMobile ? 'OK' : 'FAIL'}</span>
                <span className={`px-2 py-1 rounded ${focusOrderCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>Focus Order {focusOrderCorrect ? 'OK' : 'FAIL'}</span>
                <span className={`px-2 py-1 rounded col-span-2 ${allTouchTargetsOk ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>Touch Targets {allTouchTargetsOk ? 'OK' : 'FAIL'}</span>
              </div>
            </div>
          </div>

          <ChartFrame
            title="Contrast Ratio by Component"
            icon={<BarChart3 className="w-4 h-4 text-cyan-400" />}
            tableHeaders={['Component', 'Contrast Ratio']}
            tableRows={nodes.map((n) => [n.type, n.contrastRatio.toFixed(1)])}
          >
            <CompareBarChart labels={contrastChartData.labels} series={[{ label: 'Contrast Ratio', data: contrastChartData.values, statusOverride: contrastChartData.statusOverride }]} yLabel="Contrast Ratio" />
          </ChartFrame>

          <div className="flex gap-2">
            <button type="button" onClick={handleExportChecklistCsv} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-[11px] font-bold"><Download className="w-3.5 h-3.5" /><span>Checklist CSV</span></button>
            <button type="button" onClick={handleExportJson} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-[11px] font-bold"><FileJson className="w-3.5 h-3.5" /><span>Layout JSON</span></button>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">Edit step {stepIndex} · {visitedLoading && visitedEmpty ? 'Loading & empty states reviewed' : 'Review the loading and empty states above'}</div>
        </div>
      </div>
    </div>
  );
}
