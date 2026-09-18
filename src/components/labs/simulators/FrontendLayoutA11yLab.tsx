'use client';

import React, { useState } from 'react';
import { LabScenarioVariant } from '@/lib/labs/types';
import { downloadJson } from '@/lib/labs/exportHelper';

interface Props {
  scenario?: LabScenarioVariant;
  variant: 'beginner' | 'intermediate' | 'challenge';
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

interface ComponentNode {
  id: string;
  type: 'navbar' | 'hero' | 'cardGrid' | 'ctaButton' | 'emptyState' | 'loadingSkeleton';
  title: string;
  ariaLabel: string;
  contrastRatio: number; // e.g. 4.8
  mobileStack: boolean;
  tabIndex: number;
}

export default function FrontendLayoutA11yLab({ onDirty, onSubmit }: Props) {
  const [nodes, setNodes] = useState<ComponentNode[]>([
    { id: 'node-1', type: 'navbar', title: 'Header Navigation', ariaLabel: 'Main Navigation', contrastRatio: 5.2, mobileStack: true, tabIndex: 1 },
    { id: 'node-2', type: 'hero', title: 'Course Hero Banner', ariaLabel: 'Course Overview', contrastRatio: 7.1, mobileStack: true, tabIndex: 2 },
    { id: 'node-3', type: 'cardGrid', title: 'Curriculum Modules Grid', ariaLabel: 'Module List', contrastRatio: 4.6, mobileStack: false, tabIndex: 3 }, // deliberate bug: mobileStack false
    { id: 'node-4', type: 'ctaButton', title: 'Enroll Now CTA Button', ariaLabel: '', contrastRatio: 2.8, mobileStack: true, tabIndex: 4 }, // deliberate bugs: missing ariaLabel and contrast 2.8
  ]);

  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [showFocusOrder, setShowFocusOrder] = useState<boolean>(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-4');
  const [simulationState, setSimulationState] = useState<'normal' | 'loading' | 'empty'>('normal');

  const activeNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  const updateActiveNode = (updates: Partial<ComponentNode>) => {
    setNodes(prev => prev.map(n => n.id === selectedNodeId ? { ...n, ...updates } : n));
    onDirty();
  };

  const handleToggleAriaFix = () => {
    if (activeNode) {
      updateActiveNode({
        ariaLabel: activeNode.ariaLabel ? activeNode.ariaLabel : 'Enroll in course module',
        contrastRatio: activeNode.contrastRatio < 4.5 ? 5.8 : activeNode.contrastRatio
      });
    }
  };

  const handleFixMobileStack = () => {
    setNodes(prev => prev.map(n => ({ ...n, mobileStack: true })));
    onDirty();
  };

  const handleExportJson = () => {
    downloadJson('frontend_layout_a11y_config.json', {
      layoutComponents: nodes,
      previewMode,
      wcagPassed: nodes.every(n => n.contrastRatio >= 4.5 && n.ariaLabel.length > 0 && n.mobileStack)
    });
  };

  const handleFinalSubmit = () => {
    onSubmit({
      nodes,
      previewMode,
      simulationState,
      showFocusOrder
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
            <h2 className="text-xl font-bold text-white mt-2">Frontend Layout, Responsive Grid & WCAG 2.2 Accessibility</h2>
            <p className="text-sm text-slate-400 mt-1">
              Assemble developer-approved component tokens. Eliminate low-contrast elements (4.5:1 minimum), ensure mobile card stacking, and verify sequential keyboard focus flow.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              Export Tokens
            </button>
            <button
              onClick={handleFinalSubmit}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition shadow-lg shadow-cyan-500/20"
            >
              Submit Layout
            </button>
          </div>
        </div>
      </div>

      {/* Control Bar: Viewport & Simulation State */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 rounded-xl p-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Viewport:</span>
          <button
            onClick={() => setPreviewMode('desktop')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${previewMode === 'desktop' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}
          >
            Desktop (1280px)
          </button>
          <button
            onClick={() => setPreviewMode('mobile')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${previewMode === 'mobile' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}
          >
            Mobile (390px Stack)
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFocusOrder(!showFocusOrder)}
            className={`px-3 py-1 text-xs font-semibold rounded-lg border transition ${
              showFocusOrder ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            {showFocusOrder ? 'Hide Keyboard Focus Order' : 'Show Focus Order (#)'}
          </button>
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400">State:</span>
            {(['normal', 'loading', 'empty'] as const).map(st => (
              <button
                key={st}
                onClick={() => { setSimulationState(st); onDirty(); }}
                className={`px-2.5 py-1 rounded capitalize font-medium ${simulationState === st ? 'bg-slate-700 text-white font-bold' : 'bg-slate-800/60 text-slate-400'}`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Workspace Split: Visual Canvas & A11y Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Canvas Preview */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl p-6 min-h-[460px] flex flex-col items-center justify-start overflow-hidden">
          <div className={`transition-all duration-300 ${previewMode === 'mobile' ? 'w-[360px] border-x border-slate-800 shadow-2xl px-3 py-4' : 'w-full'}`}>
            <div className="space-y-4">
              {nodes.map(node => {
                const isSelected = node.id === selectedNodeId;
                const hasA11yBug = !node.ariaLabel || node.contrastRatio < 4.5 || (!node.mobileStack && previewMode === 'mobile');

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
                  <div
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`relative p-4 rounded-xl border transition cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-500/10'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Focus order badge */}
                    {showFocusOrder && (
                      <span className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-mono font-bold text-xs flex items-center justify-center shadow">
                        {node.tabIndex}
                      </span>
                    )}

                    {/* Node Content */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wide">
                            {node.type}
                          </span>
                          {hasA11yBug && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                              A11y Warning
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-semibold text-white mt-1">{node.title}</h4>
                      </div>

                      <div className="text-right text-xs">
                        <div className="text-slate-400">Contrast: <span className={node.contrastRatio < 4.5 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>{node.contrastRatio}:1</span></div>
                        <div className="text-slate-500 text-[11px]">ARIA: {node.ariaLabel ? 'OK' : 'Missing'}</div>
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
                <div className="p-2 rounded bg-slate-950 text-cyan-400 font-mono font-semibold">
                  {activeNode.title} ({activeNode.type})
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Accessible Label (`aria-label`)</label>
                <input
                  type="text"
                  value={activeNode.ariaLabel}
                  onChange={e => updateActiveNode({ ariaLabel: e.target.value })}
                  placeholder="e.g. Enroll in curriculum"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Text Contrast Ratio (WCAG AA &gt;= 4.5:1)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="2.0"
                    max="12.0"
                    step="0.2"
                    value={activeNode.contrastRatio}
                    onChange={e => updateActiveNode({ contrastRatio: parseFloat(e.target.value) })}
                    className="flex-1 accent-cyan-500"
                  />
                  <span className={`font-mono font-bold ${activeNode.contrastRatio < 4.5 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {activeNode.contrastRatio.toFixed(1)}:1
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-2">
                <button
                  onClick={handleToggleAriaFix}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition"
                >
                  Apply WCAG AA Fix
                </button>
                <button
                  onClick={handleFixMobileStack}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold transition"
                >
                  Enable Mobile Card Stacking
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
