'use client';

import React, { useState } from 'react';
import { LabDefinition, LabScenarioVariant, LabDifficulty } from '@/lib/labs/types';
import { 
  Sparkles, 
  Send, 
  CheckCircle2, 
  ShieldAlert, 
  FileText, 
  Layers, 
  Cpu, 
  Terminal,
  Award
} from 'lucide-react';

interface SimulatorProps {
  lab: LabDefinition;
  scenario?: LabScenarioVariant;
  variant: LabDifficulty;
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

export default function GenericComingSoonLab({
  lab,
  scenario,
  variant,
  onDirty,
  onSubmit
}: SimulatorProps) {
  const [selectedTools, setSelectedTools] = useState<string[]>(lab.toolsSimulated.slice(0, 2));
  const [hypothesisNote, setHypothesisNote] = useState(
    `Initial hypothesis for ${lab.title}: Evaluating verified scenario parameters to achieve target outcomes within deterministic boundaries.`
  );
  const [taskCompleted, setTaskCompleted] = useState(true);

  const toggleTool = (tool: string) => {
    onDirty();
    setSelectedTools(prev => 
      prev.includes(tool) ? prev.filter(t => t !== tool) : [...prev, tool]
    );
  };

  const handleSubmit = () => {
    onSubmit({
      selectedTools,
      hypothesisNote,
      taskCompleted,
      labSlug: lab.slug,
      variant
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Overview Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#111425] via-[#14182d] to-[#0f1322] border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-purple-300">
              Interactive Simulation Workspace
            </span>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
            Schema Version {lab.schemaVersion}
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-white">
          {lab.title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          {lab.summary}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Cols: Simulated Tool Operators & Configuration */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-purple-400" />
              <span>Simulated Operators &amp; Tool Palette</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Select the active operators needed to process scenario records under deterministic allowlisted functions:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {lab.toolsSimulated.map((tool, idx) => {
                const isSelected = selectedTools.includes(tool);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleTool(tool)}
                    className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-purple-600/20 border-purple-500/50 text-white shadow-glow-card'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{tool}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-2">
            <label htmlFor="hypothesis-note" className="text-xs font-extrabold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>Learner Implementation &amp; Verification Note</span>
            </label>
            <textarea
              id="hypothesis-note"
              rows={4}
              value={hypothesisNote}
              onChange={(e) => {
                setHypothesisNote(e.target.value);
                onDirty();
              }}
              className="w-full text-xs p-3 rounded-xl bg-black/30 border border-white/15 text-slate-200 focus:outline-none focus:border-purple-500/50"
            />
          </div>

        </div>

        {/* Right 5 Cols: Guardrails & Submission */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Verification Objective Rubric</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
                <span className="text-slate-300">Task Correctness</span>
                <span className="font-mono font-bold text-purple-300">60 Points</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
                <span className="text-slate-300">Constraints &amp; Safety</span>
                <span className="font-mono font-bold text-indigo-300">25 Points</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
                <span className="text-slate-300">Evidence &amp; Artifact References</span>
                <span className="font-mono font-bold text-cyan-300">15 Points</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-950/40 via-[#111425] to-indigo-950/40 border border-purple-500/30 space-y-3">
            <div>
              <span className="text-xs font-extrabold text-white block">Run Server Evaluation</span>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                Execute server-side deterministic scoring against verified scenario specifications.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-glow-btn transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Validate &amp; Submit Attempt</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
