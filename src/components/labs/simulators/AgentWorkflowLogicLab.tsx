'use client';

import React, { useState, useMemo } from 'react';
import { LabScenarioVariant, LabDifficulty } from '@/lib/labs/types';
import { 
  GitCommit, 
  Play, 
  RotateCcw, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Send,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface SimulatorProps {
  scenario?: LabScenarioVariant;
  variant: LabDifficulty;
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

export default function AgentWorkflowLogicLab({
  scenario,
  variant,
  onDirty,
  onSubmit
}: SimulatorProps) {
  // Workflow Graph Nodes configuration
  const [requireApprovalForRefunds, setRequireApprovalForRefunds] = useState(true);
  const [fallbackOnToolFailure, setFallbackOnToolFailure] = useState(true);
  const [maxLoopBound, setMaxLoopBound] = useState(3);

  // Active scenario: 'normal' vs 'missing_data' vs 'tool_failure'
  const [activeScenario, setActiveScenario] = useState<'normal' | 'missing_data' | 'tool_failure'>('normal');

  // Human in the loop approval decision state
  const [humanApproved, setHumanApproved] = useState<boolean | null>(null);

  // Replay Step index
  const [currentStep, setCurrentStep] = useState(0);

  // Safeguard Notes
  const [safeguardNotes, setSafeguardNotes] = useState(
    'Configured explicit human-in-the-loop approval gate for transactions above ₹5,000. Capped agent retry loops at 3 iterations to prevent runaway token spend.'
  );

  // Trace generator
  const trace = useMemo(() => {
    const steps = [
      { id: 1, node: 'INSPECT', status: 'Success', detail: 'Received ticket #T-8821: "Refund request for ₹7,500 due to cancelled order."' },
      { id: 2, node: 'CLASSIFY', status: 'Success', detail: 'Classified category as "High-Value Refund" (Confidence: 0.96).' }
    ];

    if (requireApprovalForRefunds) {
      steps.push({
        id: 3,
        node: 'ASK_APPROVAL',
        status: humanApproved ? 'Approved' : 'Pending',
        detail: 'Gate triggered: Transactions > ₹5,000 require manager approval.'
      });

      if (humanApproved) {
        steps.push({ id: 4, node: 'ROUTE', status: 'Success', detail: 'Routed ticket to Finance Escrow Queue.' });
        steps.push({ id: 5, node: 'STOP', status: 'Completed', detail: 'Workflow terminated safely.' });
      } else {
        steps.push({ id: 4, node: 'HOLD', status: 'Blocked', detail: 'Execution paused awaiting manager sign-off.' });
      }
    } else {
      steps.push({ id: 3, node: 'ROUTE', status: 'Unsafe', detail: 'Auto-routed without manager approval! (Policy violation)' });
      steps.push({ id: 4, node: 'STOP', status: 'Completed', detail: 'Workflow completed.' });
    }

    return steps;
  }, [requireApprovalForRefunds, humanApproved]);

  const handleSubmit = () => {
    onSubmit({
      requireApprovalForRefunds,
      fallbackOnToolFailure,
      maxLoopBound,
      activeScenario,
      hasReachableStop: true,
      approvalBlockedUntilGranted: requireApprovalForRefunds && humanApproved === true,
      safeguardNotes
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">State Machine Engine</span>
          <span className="text-sm font-black text-purple-300">Deterministic FSM (Max 30 Steps)</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Inspect &rarr; Classify &rarr; Gate &rarr; Route &rarr; Stop</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Human-in-the-Loop Gate</span>
          <span className={`text-base font-black ${requireApprovalForRefunds ? 'text-emerald-400' : 'text-red-400'}`}>
            {requireApprovalForRefunds ? 'Active Guardrail (₹5k+)' : 'Disabled (High Risk!)'}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">High-value refund policy</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#131728] border border-purple-500/30 bg-purple-950/20">
          <span className="text-xs text-purple-300 font-bold block mb-1">Loop Bound Constraint</span>
          <span className="text-xl font-black text-purple-200">{maxLoopBound} Max Transitions</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Infinite recursion prevention</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Cols: Node Canvas & Execution Trace */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
                <GitCommit className="w-4 h-4 text-purple-400" />
                <span>1. Finite-State Node Topology</span>
              </h2>
              <div className="flex gap-1.5 text-xs">
                {(['normal', 'missing_data', 'tool_failure'] as const).map(sc => (
                  <button
                    key={sc}
                    type="button"
                    onClick={() => { setActiveScenario(sc); onDirty(); }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                      activeScenario === sc ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-400'
                    }`}
                  >
                    {sc.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Workflow Node Chain Visualizer */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-purple-600/30 border border-purple-500/50 text-purple-200">
                INSPECT
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              <div className="p-2.5 rounded-xl bg-indigo-600/30 border border-indigo-500/50 text-indigo-200">
                CLASSIFY
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              <div className={`p-2.5 rounded-xl border ${
                requireApprovalForRefunds ? 'bg-amber-600/30 border-amber-500/50 text-amber-200' : 'bg-slate-800 text-slate-500'
              }`}>
                ASK_APPROVAL
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              <div className="p-2.5 rounded-xl bg-cyan-600/30 border border-cyan-500/50 text-cyan-200">
                ROUTE
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              <div className="p-2.5 rounded-xl bg-emerald-600/30 border border-emerald-500/50 text-emerald-200">
                STOP
              </div>
            </div>
          </div>

          {/* Trace Table */}
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
              Agent Execution Step Trace
            </h3>
            <div className="space-y-2">
              {trace.map(t => (
                <div key={t.id} className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3 text-xs">
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-purple-300">
                    Step {t.id}
                  </span>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="font-mono font-bold text-white">{t.node}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        t.status === 'Success' || t.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300' :
                        t.status === 'Approved' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {t.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300">{t.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 5 Cols: Approval Controls & Safeguard Checklist */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Human Gate Controller */}
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Human Approval Intercept</span>
            </h3>
            <p className="text-xs text-slate-300">
              Ticket #T-8821 exceeds ₹5,000 threshold. Do you authorize dispatch of refund?
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setHumanApproved(true); onDirty(); }}
                className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                  humanApproved === true ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-white/5 border-white/10 text-slate-300'
                }`}
              >
                Approve Refund
              </button>
              <button
                type="button"
                onClick={() => { setHumanApproved(false); onDirty(); }}
                className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                  humanApproved === false ? 'bg-red-600 text-white border-red-500' : 'bg-white/5 border-white/10 text-slate-300'
                }`}
              >
                Reject / Escalate
              </button>
            </div>
          </div>

          {/* Safeguard Checklist */}
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-2">
            <label htmlFor="safeguard-notes" className="text-xs font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Agent Safeguards &amp; Architecture Memo</span>
            </label>
            <textarea
              id="safeguard-notes"
              rows={4}
              value={safeguardNotes}
              onChange={(e) => { setSafeguardNotes(e.target.value); onDirty(); }}
              className="w-full text-xs p-3 rounded-xl bg-black/30 border border-white/15 text-slate-200 focus:outline-none focus:border-purple-500/50"
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-glow-btn transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Submit Agent Workflow</span>
          </button>

        </div>

      </div>

    </div>
  );
}
