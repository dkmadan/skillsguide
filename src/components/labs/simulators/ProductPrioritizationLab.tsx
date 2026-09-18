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

interface FeatureCandidate {
  id: string;
  name: string;
  reach: number;
  impact: number; // 0.5 to 3
  confidence: number; // 0.5 to 1.0
  effort: number; // Story points (cannot be 0)
  selectedForSprint: boolean;
}

export default function ProductPrioritizationLab({ onDirty, onSubmit }: Props) {
  const [features, setFeatures] = useState<FeatureCandidate[]>([
    { id: 'f1', name: '1-Click Google & GitHub SSO Login', reach: 800, impact: 2.0, confidence: 0.9, effort: 4, selectedForSprint: true },
    { id: 'f2', name: 'Course Progress Milestone Badges', reach: 500, impact: 1.0, confidence: 0.8, effort: 3, selectedForSprint: true },
    { id: 'f3', name: 'AI Voice Tutor Live Audio Streaming', reach: 200, impact: 2.0, confidence: 0.4, effort: 18, selectedForSprint: false }, // High risk, low confidence, huge effort
    { id: 'f4', name: 'Automated GST Invoice Receipt Generator', reach: 450, impact: 2.5, confidence: 0.95, effort: 5, selectedForSprint: true },
    { id: 'f5', name: 'Dark Mode Theme Customizer', reach: 600, impact: 0.5, confidence: 1.0, effort: 2, selectedForSprint: false },
    { id: 'f6', name: 'Interactive Lab Diagnostic Sandbox', reach: 950, impact: 3.0, confidence: 0.85, effort: 12, selectedForSprint: true },
  ]);

  const maxCapacity = 25; // 25 Story point sprint capacity
  const [prdProblem, setPrdProblem] = useState<string>('B2B learners and teams drop off before activation due to lack of SSO authentication and manual GST invoice requests.');
  const [targetMetric, setTargetMetric] = useState<string>('30-day course completion rate + Day-7 activation');

  const { totalEffortUsed, featuresWithRice } = useMemo(() => {
    let totalEffort = 0;
    const computed = features.map(f => {
      const safeEffort = Math.max(1, f.effort);
      const riceScore = Math.round((f.reach * f.impact * f.confidence) / safeEffort);
      if (f.selectedForSprint) {
        totalEffort += safeEffort;
      }
      return { ...f, riceScore };
    });

    return { totalEffortUsed: totalEffort, featuresWithRice: computed };
  }, [features]);

  const isOverCapacity = totalEffortUsed > maxCapacity;

  const toggleFeature = (id: string) => {
    setFeatures(prev => prev.map(f => f.id === id ? { ...f, selectedForSprint: !f.selectedForSprint } : f));
    onDirty();
  };

  const handleExportCsv = () => {
    const rows = featuresWithRice.map(f => ({
      feature_name: f.name,
      reach: f.reach,
      impact: f.impact,
      confidence: f.confidence,
      effort_points: f.effort,
      rice_score: f.riceScore,
      in_sprint: f.selectedForSprint ? 'YES' : 'NO'
    }));
    downloadCsv('product_rice_backlog.csv', rows);
  };

  const handleExportJson = () => {
    downloadJson('product_prd_prioritization.json', {
      totalEffortUsed,
      maxCapacity,
      isOverCapacity,
      features: featuresWithRice,
      prd: { prdProblem, targetMetric }
    });
  };

  const handleFinalSubmit = () => {
    onSubmit({
      totalEffortUsed,
      maxCapacity,
      isOverCapacity,
      features: featuresWithRice,
      prdProblem,
      targetMetric
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
              Lab 17 • Product Management
            </span>
            <h2 className="text-xl font-bold text-white mt-2">Product Feature Prioritization & RICE Modeling Lab</h2>
            <p className="text-sm text-slate-400 mt-1">
              Score feature ideas using the deterministic RICE formula: <code>(Reach × Impact × Confidence) / Effort</code>. Balance high-leverage deliverables within a 25-point engineering capacity budget.
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
              onClick={handleFinalSubmit}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold transition shadow-lg shadow-orange-500/20"
            >
              Submit PRD & Roadmap
            </button>
          </div>
        </div>
      </div>

      {/* Capacity Meter Row */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-semibold text-slate-300">Engineering Sprint Capacity Budget</span>
          <span className={`font-mono font-bold ${isOverCapacity ? 'text-rose-400' : 'text-emerald-400'}`}>
            {totalEffortUsed} / {maxCapacity} Story Points {isOverCapacity && '(OVER CAPACITY!)'}
          </span>
        </div>
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${isOverCapacity ? 'bg-rose-500' : 'bg-orange-500'}`}
            style={{ width: `${Math.min(100, (totalEffortUsed / maxCapacity) * 100)}%` }}
          />
        </div>
      </div>

      {/* Feature Backlog Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white">Backlog Feature Candidates</h3>

          <div className="space-y-3">
            {featuresWithRice.map(f => (
              <div
                key={f.id}
                className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition ${
                  f.selectedForSprint
                    ? 'bg-slate-800/80 border-orange-500/60 shadow-md'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div>
                  <h4 className="text-xs font-bold text-white">{f.name}</h4>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 mt-1 font-mono">
                    <span>Reach: {f.reach}</span>
                    <span>Impact: {f.impact}x</span>
                    <span>Confidence: {Math.round(f.confidence * 100)}%</span>
                    <span>Effort: {f.effort} pts</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xs text-slate-400">RICE Score</div>
                    <div className="text-base font-mono font-bold text-orange-400">{f.riceScore}</div>
                  </div>

                  <button
                    onClick={() => toggleFeature(f.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                      f.selectedForSprint
                        ? 'bg-orange-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {f.selectedForSprint ? 'Included in Sprint' : '+ Add to Sprint'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PRD Rationale */}
        <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white">Structured PRD Summary</h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Problem Statement & User Need</label>
              <textarea
                rows={4}
                value={prdProblem}
                onChange={e => { setPrdProblem(e.target.value); onDirty(); }}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">North Star Experiment Metric</label>
              <input
                type="text"
                value={targetMetric}
                onChange={e => { setTargetMetric(e.target.value); onDirty(); }}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
