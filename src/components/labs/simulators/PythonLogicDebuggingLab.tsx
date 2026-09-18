'use client';

import React, { useState } from 'react';
import { LabScenarioVariant, LabDifficulty } from '@/lib/labs/types';
import { 
  Terminal, 
  Play, 
  Bug, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  Send,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface SimulatorProps {
  scenario?: LabScenarioVariant;
  variant: LabDifficulty;
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

// Prepared trace steps for the CSV cleaning loop
const traceSteps = [
  { step: 1, line: 1, description: 'Initialize cleaned_rows list', variables: { cleaned_rows: '[]', i: 'undefined', total: '0' } },
  { step: 2, line: 3, description: 'Loop start: i = 0 (Processing Row 1: "Acme Corp")', variables: { cleaned_rows: '["Acme Corp"]', i: '0', total: '1' } },
  { step: 3, line: 3, description: 'Loop step: i = 1 (Processing Row 2: "Beta LLC")', variables: { cleaned_rows: '["Acme Corp", "Beta LLC"]', i: '1', total: '2' } },
  { step: 4, line: 3, description: 'Loop step: i = 2 (Processing Row 3: "Gamma Inc")', variables: { cleaned_rows: '["Acme Corp", "Beta LLC", "Gamma Inc"]', i: '2', total: '3' } },
  { step: 5, line: 4, description: 'CRITICAL BUG: IndexError encountered! i = 3 accesses rows[3] which is out of range!', variables: { cleaned_rows: '["Acme Corp", "Beta LLC", "Gamma Inc"]', i: '3 (Out of Bounds)', total: '3' } },
];

export default function PythonLogicDebuggingLab({
  scenario,
  variant,
  onDirty,
  onSubmit
}: SimulatorProps) {
  // Trace step player
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Selected Bug Identification
  const [identifiedBug, setIdentifiedBug] = useState<'off_by_one' | 'type_error' | 'syntax_error'>('off_by_one');

  // Selected Bug Patch
  const [selectedPatch, setSelectedPatch] = useState<'range_len' | 'range_len_plus_one' | 'while_loop'>('range_len');

  // Study Notes
  const [debuggingNotes, setDebuggingNotes] = useState(
    'Identified off-by-one IndexError on line 3 where the loop used range(len(rows) + 1). Replaced with range(len(rows)) to preserve 0-indexed boundary invariants.'
  );

  const currentTrace = traceSteps[currentStepIndex];

  const handleNextStep = () => {
    onDirty();
    setCurrentStepIndex(prev => Math.min(prev + 1, traceSteps.length - 1));
  };

  const handleResetTrace = () => {
    onDirty();
    setCurrentStepIndex(0);
  };

  const handleSubmit = () => {
    onSubmit({
      identifiedBug,
      selectedPatch,
      completedTrace: currentStepIndex === traceSteps.length - 1,
      debuggingNotes
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Execution Runtime</span>
          <span className="text-sm font-black text-purple-300">Authored Python Trace Frames</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Strict sandbox (No runtime eval)</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Current Trace Frame</span>
          <span className="text-xl font-black text-white">Step {currentStepIndex + 1} / {traceSteps.length}</span>
          <span className="text-[10px] text-emerald-400 block mt-0.5">{currentTrace.description}</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#131728] border border-purple-500/30 bg-purple-950/20">
          <span className="text-xs text-purple-300 font-bold block mb-1">Algorithmic Boundary</span>
          <span className={`text-base font-black ${selectedPatch === 'range_len' ? 'text-emerald-400' : 'text-amber-400'}`}>
            {selectedPatch === 'range_len' ? 'Fixed (range(len(rows)))' : 'Boundary Error Active'}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">0-Indexed Python list safety</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Cols: Code Card & Line Tracer */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="p-5 rounded-3xl bg-[#0d0f1a] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-extrabold text-purple-300 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-purple-400" />
                <span>clean_csv_records.py (Read-Only Syntax Cards)</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">Authored Snippet</span>
            </div>

            {/* Code Lines with highlight */}
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 font-mono text-xs space-y-1.5">
              <div className={`p-1 rounded ${currentTrace.line === 1 ? 'bg-purple-600/30 text-white font-bold' : 'text-slate-400'}`}>
                1:  cleaned_rows = []
              </div>
              <div className={`p-1 rounded ${currentTrace.line === 2 ? 'bg-purple-600/30 text-white font-bold' : 'text-slate-400'}`}>
                2:  rows = [&quot;Acme Corp&quot;, &quot;Beta LLC&quot;, &quot;Gamma Inc&quot;]
              </div>
              <div className={`p-1 rounded ${currentTrace.line === 3 ? 'bg-amber-500/30 text-amber-200 font-bold' : 'text-slate-400'}`}>
                3:  # BUG: range(len(rows) + 1) causes index 3 out of bounds!
              </div>
              <div className={`p-1 rounded ${currentTrace.line === 3 ? 'bg-amber-500/20 text-white font-bold' : 'text-slate-400'}`}>
                4:  for i in {selectedPatch === 'range_len' ? 'range(len(rows)):' : 'range(len(rows) + 1):'}
              </div>
              <div className={`p-1 rounded ${currentTrace.line === 4 ? 'bg-purple-600/30 text-white font-bold' : 'text-slate-400'}`}>
                5:      cleaned_rows.append(rows[i].strip())
              </div>
              <div className="p-1 text-slate-500">
                6:  return cleaned_rows
              </div>
            </div>

            {/* Step Controls */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleNextStep}
                disabled={currentStepIndex >= traceSteps.length - 1}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-xs font-bold text-white shadow-glow-btn flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Step Forward</span>
              </button>
              <button
                type="button"
                onClick={handleResetTrace}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Trace</span>
              </button>
            </div>
          </div>

          {/* Variable State Inspector */}
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
              Variable State Inspector at Step {currentStepIndex + 1}
            </h3>
            <div className="grid grid-cols-3 gap-2 font-mono text-xs">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-slate-400 block">i (loop index)</span>
                <span className="font-bold text-purple-300">{currentTrace.variables.i}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-slate-400 block">total processed</span>
                <span className="font-bold text-cyan-300">{currentTrace.variables.total}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-slate-400 block">cleaned_rows</span>
                <span className="font-bold text-emerald-300 truncate block">{currentTrace.variables.cleaned_rows}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right 5 Cols: Bug Diagnosis, Patch Selector & Submit */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
              <Bug className="w-4 h-4 text-purple-400" />
              <span>Algorithmic Diagnosis &amp; Patch</span>
            </h3>

            {/* Select Patch */}
            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-slate-300 block">Select Corrected Loop Iteration:</label>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => { setSelectedPatch('range_len'); onDirty(); }}
                  className={`w-full p-2.5 rounded-xl border text-left font-mono text-xs transition-all ${
                    selectedPatch === 'range_len'
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200'
                      : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  range(len(rows)) <span className="text-[10px] text-emerald-400 font-sans ml-1">(Correct: Stops at len - 1)</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setSelectedPatch('range_len_plus_one'); onDirty(); }}
                  className={`w-full p-2.5 rounded-xl border text-left font-mono text-xs transition-all ${
                    selectedPatch === 'range_len_plus_one'
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-200'
                      : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  range(len(rows) + 1) <span className="text-[10px] text-amber-400 font-sans ml-1">(Buggy: IndexError)</span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-2">
            <label htmlFor="debug-notes" className="text-xs font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Debugging Rationale &amp; Invariants Memo</span>
            </label>
            <textarea
              id="debug-notes"
              rows={4}
              value={debuggingNotes}
              onChange={(e) => { setDebuggingNotes(e.target.value); onDirty(); }}
              className="w-full text-xs p-3 rounded-xl bg-black/30 border border-white/15 text-slate-200 focus:outline-none focus:border-purple-500/50"
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-glow-btn transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Submit Python Debugging Patch</span>
          </button>

        </div>

      </div>

    </div>
  );
}
