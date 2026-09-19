'use client';

import { useMemo, useState } from 'react';
import { LabScenarioVariant, LabDifficulty } from '@/lib/labs/types';
import { useUndoableState } from '@/lib/labs/useUndoableState';
import { downloadCsv, downloadJson } from '@/lib/labs/exportHelper';
import SimClock from '@/components/labs/SimClock';
import ChartFrame from '@/components/labs/charts/ChartFrame';
import CompareBarChart from '@/components/labs/charts/CompareBarChart';
import {
  GitCommit, ShieldCheck, Send, Sparkles, Plus, Trash2, ArrowUp, ArrowDown,
  Undo2, Redo2, RotateCcw, CheckCircle2, XCircle, Download, FileJson, Wrench,
} from 'lucide-react';

interface SimulatorProps {
  scenario?: LabScenarioVariant;
  variant: LabDifficulty;
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

type NodeType = 'INSPECT' | 'CLASSIFY' | 'ASK_APPROVAL' | 'ROUTE' | 'RETRY_TOOL' | 'STOP';
const ALLOWED_NODES: NodeType[] = ['INSPECT', 'CLASSIFY', 'ASK_APPROVAL', 'ROUTE', 'RETRY_TOOL', 'STOP'];
const MAX_TRANSITIONS = 30;
const MAX_RETRIES = 3;

type ScenarioId = 'normal' | 'missing_data' | 'tool_failure';

interface ScenarioFixture {
  id: ScenarioId;
  ticketId: string;
  ticketValue: number;
  approvalThreshold: number;
  description: string;
  dataComplete: boolean;
  toolRecoversAtAttempt: number | null;
}

function buildScenarios(variant: LabDifficulty): Record<ScenarioId, ScenarioFixture> {
  if (variant === 'beginner') {
    return {
      normal: { id: 'normal', ticketId: 'T-8821', ticketValue: 7500, approvalThreshold: 5000, description: 'Refund request for a cancelled order (₹7,500 — clearly above the approval threshold).', dataComplete: true, toolRecoversAtAttempt: null },
      missing_data: { id: 'missing_data', ticketId: 'T-8822', ticketValue: 7500, approvalThreshold: 5000, description: 'Same refund policy, but the order ID field on the ticket is blank.', dataComplete: false, toolRecoversAtAttempt: null },
      tool_failure: { id: 'tool_failure', ticketId: 'T-8823', ticketValue: 7500, approvalThreshold: 5000, description: 'Routing API times out on the first attempt, then recovers.', dataComplete: true, toolRecoversAtAttempt: 2 },
    };
  }
  if (variant === 'intermediate') {
    return {
      normal: { id: 'normal', ticketId: 'T-9004', ticketValue: 4800, approvalThreshold: 5000, description: 'Refund request for ₹4,800 — just below the ₹5,000 approval threshold.', dataComplete: true, toolRecoversAtAttempt: null },
      missing_data: { id: 'missing_data', ticketId: 'T-9005', ticketValue: 4800, approvalThreshold: 5000, description: 'Same ticket, but the customer account field is blank.', dataComplete: false, toolRecoversAtAttempt: null },
      tool_failure: { id: 'tool_failure', ticketId: 'T-9006', ticketValue: 4800, approvalThreshold: 5000, description: 'Routing API fails twice before recovering on the third attempt.', dataComplete: true, toolRecoversAtAttempt: 2 },
    };
  }
  return {
    normal: { id: 'normal', ticketId: 'T-9210', ticketValue: 5000, approvalThreshold: 5000, description: 'Refund request for exactly ₹5,000 — policy requires approval only when value is strictly greater than the threshold.', dataComplete: true, toolRecoversAtAttempt: null },
    missing_data: { id: 'missing_data', ticketId: 'T-9211', ticketValue: 5000, approvalThreshold: 5000, description: 'Same boundary ticket, but two required fields are blank.', dataComplete: false, toolRecoversAtAttempt: null },
    tool_failure: { id: 'tool_failure', ticketId: 'T-9212', ticketValue: 5000, approvalThreshold: 5000, description: 'Routing API fails on attempts 1 and 2, recovering only on the 3rd — exactly at the retry cap.', dataComplete: true, toolRecoversAtAttempt: 3 },
  };
}

interface TraceStep { step: number; node: NodeType; status: string; detail: string; }
type Outcome = 'STOPPED' | 'STOPPED_INCOMPLETE' | 'BLOCKED' | 'NO_REACHABLE_STOP' | 'LOOP_BUDGET_EXCEEDED';

function runWorkflow(nodes: NodeType[], fixture: ScenarioFixture, humanApproved: boolean | null): { trace: TraceStep[]; transitions: number; outcome: Outcome } {
  if (!nodes.includes('STOP')) {
    return { trace: [{ step: 0, node: 'STOP', status: 'Rejected', detail: 'Graph has no STOP node anywhere — rejected before execution begins.' }], transitions: 0, outcome: 'NO_REACHABLE_STOP' };
  }
  const approvalRequired = fixture.ticketValue > fixture.approvalThreshold;
  const trace: TraceStep[] = [];
  let transitions = 0;
  let approved = !approvalRequired;
  let retryAttempts = 0;
  let lastRouteSucceeded: boolean | null = null;

  for (const node of nodes) {
    if (transitions >= MAX_TRANSITIONS) {
      trace.push({ step: transitions + 1, node, status: 'Blocked', detail: 'Transition budget (30) exhausted before reaching this node.' });
      return { trace, transitions, outcome: 'LOOP_BUDGET_EXCEEDED' };
    }
    transitions++;
    if (node === 'INSPECT') {
      trace.push({ step: transitions, node, status: 'Success', detail: fixture.dataComplete ? `Ticket ${fixture.ticketId} fields complete.` : `Ticket ${fixture.ticketId} is missing required field(s) — flagged.` });
    } else if (node === 'CLASSIFY') {
      trace.push({ step: transitions, node, status: fixture.dataComplete ? 'Success' : 'Warning', detail: fixture.dataComplete ? 'Classified with high confidence.' : 'Classified with reduced confidence due to incomplete data.' });
    } else if (node === 'ASK_APPROVAL') {
      if (!approvalRequired) {
        trace.push({ step: transitions, node, status: 'Skipped', detail: `Ticket value (₹${fixture.ticketValue}) does not exceed the ₹${fixture.approvalThreshold} threshold — gate not required.` });
      } else if (humanApproved === true) {
        approved = true;
        trace.push({ step: transitions, node, status: 'Approved', detail: 'Manager approved dispatch above threshold.' });
      } else if (humanApproved === false) {
        trace.push({ step: transitions, node, status: 'Rejected', detail: 'Manager rejected the request.' });
      } else {
        trace.push({ step: transitions, node, status: 'Pending', detail: 'Awaiting a manager decision in the Approval Panel.' });
      }
    } else if (node === 'ROUTE') {
      if (approvalRequired && !approved) {
        trace.push({ step: transitions, node, status: 'Blocked', detail: 'POLICY VIOLATION: routing attempted without a granted approval gate.' });
        return { trace, transitions, outcome: 'BLOCKED' };
      }
      if (fixture.id === 'tool_failure') {
        const attemptNumber = retryAttempts + 1;
        if (fixture.toolRecoversAtAttempt !== null && attemptNumber >= fixture.toolRecoversAtAttempt) {
          trace.push({ step: transitions, node, status: 'Success', detail: `Routing API succeeded on attempt ${attemptNumber}.` });
          lastRouteSucceeded = true;
        } else {
          trace.push({ step: transitions, node, status: 'Failed', detail: `Routing API timeout on attempt ${attemptNumber}.` });
          lastRouteSucceeded = false;
        }
      } else {
        trace.push({ step: transitions, node, status: 'Success', detail: 'Routed ticket to the destination queue.' });
        lastRouteSucceeded = true;
      }
    } else if (node === 'RETRY_TOOL') {
      retryAttempts++;
      if (retryAttempts > MAX_RETRIES) {
        trace.push({ step: transitions, node, status: 'Blocked', detail: `Retry cap (${MAX_RETRIES}) exceeded — bounded loop failure, aborting.` });
        return { trace, transitions, outcome: 'LOOP_BUDGET_EXCEEDED' };
      }
      trace.push({ step: transitions, node, status: 'Retrying', detail: `Retry attempt ${retryAttempts} scheduled after a tool failure.` });
    } else if (node === 'STOP') {
      trace.push({ step: transitions, node, status: 'Completed', detail: 'Workflow terminated safely.' });
      const incomplete = lastRouteSucceeded === false;
      return { trace, transitions, outcome: incomplete ? 'STOPPED_INCOMPLETE' : 'STOPPED' };
    }
  }
  return { trace, transitions, outcome: 'NO_REACHABLE_STOP' };
}

interface WorkflowState { nodes: NodeType[]; humanApproved: boolean | null; }
const INITIAL_NODES: NodeType[] = ['INSPECT', 'CLASSIFY', 'ASK_APPROVAL', 'ROUTE', 'STOP'];

export default function AgentWorkflowLogicLab({ variant, onDirty, onSubmit }: SimulatorProps) {
  const scenarios = useMemo(() => buildScenarios(variant), [variant]);
  const { state, set, undo, redo, reset, canUndo, canRedo } = useUndoableState<WorkflowState>({ nodes: [...INITIAL_NODES], humanApproved: null });
  const [activeScenario, setActiveScenario] = useState<ScenarioId>('normal');
  const [stepIndex, setStepIndex] = useState(0);
  const [safeguardNotes, setSafeguardNotes] = useState(
    'Configured an explicit human-in-the-loop approval gate before ROUTE and capped tool retries at 3 to prevent a runaway loop on repeated failures.'
  );

  const addNode = (n: NodeType) => { set((prev) => ({ ...prev, nodes: [...prev.nodes, n] })); onDirty(); };
  const removeNode = (idx: number) => { set((prev) => ({ ...prev, nodes: prev.nodes.filter((_, i) => i !== idx) })); onDirty(); };
  const moveNode = (idx: number, dir: -1 | 1) => {
    set((prev) => {
      const arr = [...prev.nodes];
      const t = idx + dir;
      if (t < 0 || t >= arr.length) return prev;
      [arr[idx], arr[t]] = [arr[t], arr[idx]];
      return { ...prev, nodes: arr };
    });
    onDirty();
  };
  const setApproval = (v: boolean) => { set((prev) => ({ ...prev, humanApproved: v })); onDirty(); };

  const currentRun = useMemo(() => runWorkflow(state.nodes, scenarios[activeScenario], state.humanApproved), [state.nodes, state.humanApproved, scenarios, activeScenario]);
  const traceLen = currentRun.trace.length;

  // Reset the replay position whenever the underlying run changes. Adjusting state
  // directly during render (rather than in a useEffect) avoids an extra cascading
  // render pass — see https://react.dev/learn/you-might-not-need-an-effect.
  const runKey = `${activeScenario}|${state.nodes.join(',')}|${state.humanApproved}`;
  const [lastRunKey, setLastRunKey] = useState(runKey);
  if (runKey !== lastRunKey) {
    setLastRunKey(runKey);
    setStepIndex(0);
  }
  const currentFrame = traceLen > 0 ? currentRun.trace[Math.min(stepIndex, traceLen - 1)] : null;

  const hasStopNode = state.nodes.includes('STOP');
  const routeIdx = state.nodes.indexOf('ROUTE');
  const approvalIdx = state.nodes.indexOf('ASK_APPROVAL');
  const approvalBeforeRoute = routeIdx === -1 || (approvalIdx !== -1 && approvalIdx < routeIdx);
  const retryCount = state.nodes.filter((n) => n === 'RETRY_TOOL').length;
  const loopBounded = retryCount <= MAX_RETRIES && state.nodes.length <= MAX_TRANSITIONS;
  const allowlistValid = state.nodes.every((n) => ALLOWED_NODES.includes(n));
  const normalRun = useMemo(() => runWorkflow(state.nodes, scenarios.normal, state.humanApproved), [state.nodes, state.humanApproved, scenarios]);
  const normalReachesStop = normalRun.outcome === 'STOPPED';

  const checklist = [
    { id: 'stop_present', label: 'A STOP node exists in the graph', passed: hasStopNode },
    { id: 'approval_before_route', label: 'ASK_APPROVAL precedes ROUTE (or ROUTE is absent)', passed: approvalBeforeRoute },
    { id: 'loop_bounded', label: `Retry/transition counts within bounds (${retryCount}/${MAX_RETRIES} retries, ${state.nodes.length}/${MAX_TRANSITIONS} nodes)`, passed: loopBounded },
    { id: 'normal_reaches_stop', label: 'Normal-path run actually reaches STOP', passed: normalReachesStop },
  ];

  const scenarioRuns = (Object.keys(scenarios) as ScenarioId[]).map((id) => runWorkflow(state.nodes, scenarios[id], state.humanApproved));
  const budgetChart = {
    labels: ['Normal', 'Missing Data', 'Tool Failure'],
    values: scenarioRuns.map((r) => r.transitions),
    statuses: scenarioRuns.map((r) => (r.outcome === 'STOPPED' ? null : r.outcome === 'STOPPED_INCOMPLETE' ? 'warning' : 'critical') as ('warning' | 'critical' | null)),
  };

  const handleExportJson = () => {
    downloadJson('agent_workflow_definition.json', { variant, nodes: state.nodes, humanApproved: state.humanApproved, checklist, activeScenario, trace: currentRun.trace });
  };
  const handleExportCsv = () => {
    downloadCsv('agent_workflow_trace.csv', currentRun.trace.map((t) => ({ step: t.step, node: t.node, status: t.status, detail: t.detail })));
  };

  const handleSubmit = () => {
    onSubmit({
      variant,
      workflowNodes: state.nodes,
      humanApproved: state.humanApproved,
      activeScenario,
      traceForActiveScenario: currentRun.trace,
      transitionsUsed: currentRun.transitions,
      outcome: currentRun.outcome,
      hasStopNode,
      approvalBeforeRoute,
      loopBounded,
      allowlistValid,
      normalReachesStop,
      safeguardNotes,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">State Machine Engine</span>
          <span className="text-sm font-black text-purple-300">Deterministic FSM (Max {MAX_TRANSITIONS} Steps)</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Allowlisted nodes only</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Current Run Outcome</span>
          <span className={`text-base font-black ${currentRun.outcome === 'STOPPED' ? 'text-emerald-400' : currentRun.outcome === 'STOPPED_INCOMPLETE' ? 'text-amber-400' : 'text-red-400'}`}>
            {currentRun.outcome.replace(/_/g, ' ')}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">{currentRun.transitions}/{MAX_TRANSITIONS} transitions used</span>
        </div>
        <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30">
          <span className="text-xs text-purple-300 font-bold block mb-1">Safeguards</span>
          <span className="text-xl font-black text-purple-200">{checklist.filter((c) => c.passed).length}/{checklist.length}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Structural checks passed</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
                <GitCommit className="w-4 h-4 text-purple-400" />
                <span>1. Node Canvas — Build the Workflow</span>
              </h2>
              <div className="flex gap-1.5">
                {(Object.keys(scenarios) as ScenarioId[]).map((sc) => (
                  <button key={sc} type="button" onClick={() => setActiveScenario(sc)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${activeScenario === sc ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-400'}`}>
                    {sc.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 italic">{scenarios[activeScenario].description}</p>

            <div className="flex flex-wrap gap-1.5">
              {ALLOWED_NODES.map((n) => (
                <button key={n} type="button" onClick={() => addNode(n)}
                  className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-purple-600/30 border border-white/10 text-[10px] font-bold text-slate-300 flex items-center gap-1">
                  <Plus className="w-3 h-3" /><span>{n}</span>
                </button>
              ))}
              <div className="flex items-center gap-1 ml-auto">
                <button type="button" onClick={undo} disabled={!canUndo} title="Undo" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30">
                  <Undo2 className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={redo} disabled={!canRedo} title="Redo" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30">
                  <Redo2 className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => { reset(); onDirty(); }} title="Reset" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white">
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              {state.nodes.map((n, idx) => (
                <div key={`${n}-${idx}`} className="flex items-center gap-2 p-2 rounded-xl bg-black/40 border border-white/10 text-xs font-mono">
                  <span className="text-[10px] text-slate-500 w-5">{idx + 1}</span>
                  <span className="flex-1 font-bold text-purple-200">{n}</span>
                  <button type="button" onClick={() => moveNode(idx, -1)} disabled={idx === 0} className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-20"><ArrowUp className="w-3 h-3" /></button>
                  <button type="button" onClick={() => moveNode(idx, 1)} disabled={idx === state.nodes.length - 1} className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-20"><ArrowDown className="w-3 h-3" /></button>
                  <button type="button" onClick={() => removeNode(idx)} className="p-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-300"><Trash2 className="w-3 h-3" /></button>
                </div>
              ))}
              {state.nodes.length === 0 && <p className="text-[11px] text-slate-500 italic">Empty graph — add nodes from the palette above.</p>}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">Replay Timeline</h3>
            {traceLen > 0 && (
              <SimClock label="Execution Trace" step={Math.min(stepIndex, traceLen - 1)} maxStep={traceLen - 1}
                stepLabel={(s) => `Step ${s + 1}/${traceLen}`}
                onAdvance={() => setStepIndex((s) => Math.min(s + 1, traceLen - 1))}
                onReset={() => setStepIndex(0)} />
            )}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {currentRun.trace.map((t, i) => (
                <div key={i} className={`p-3 rounded-2xl border flex items-start gap-3 text-xs transition-opacity ${i > stepIndex ? 'opacity-30' : ''} ${i === Math.min(stepIndex, traceLen - 1) ? 'bg-white/10 border-cyan-500/40' : 'bg-white/5 border-white/10'}`}>
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-purple-300">Step {t.step}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="font-mono font-bold text-white">{t.node}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${['Success', 'Completed', 'Approved'].includes(t.status) ? 'bg-emerald-500/20 text-emerald-300' : ['Blocked', 'Rejected', 'Failed'].includes(t.status) ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'}`}>{t.status}</span>
                    </div>
                    <p className="text-[11px] text-slate-300">{t.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {currentFrame?.node === 'ROUTE' || currentFrame?.node === 'RETRY_TOOL' ? (
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-3">
              <Wrench className="w-5 h-5 text-cyan-400" />
              <div className="text-xs">
                <span className="font-bold text-white block">Synthetic Tool: Routing API</span>
                <span className="text-slate-400">{currentFrame.detail}</span>
              </div>
            </div>
          ) : null}
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Human Approval Intercept</span>
            </h3>
            <p className="text-xs text-slate-300">
              Ticket {scenarios[activeScenario].ticketId} is valued at ₹{scenarios[activeScenario].ticketValue.toLocaleString()} (threshold ₹{scenarios[activeScenario].approvalThreshold.toLocaleString()}). Do you authorize dispatch?
            </p>
            <div className="flex gap-2">
              <button type="button" onClick={() => setApproval(true)}
                className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${state.humanApproved === true ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-white/5 border-white/10 text-slate-300'}`}>
                Approve
              </button>
              <button type="button" onClick={() => setApproval(false)}
                className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${state.humanApproved === false ? 'bg-red-600 text-white border-red-500' : 'bg-white/5 border-white/10 text-slate-300'}`}>
                Reject
              </button>
            </div>
          </div>

          <ChartFrame
            title="Transition Budget Usage by Scenario"
            icon={<GitCommit className="w-4 h-4 text-purple-400" />}
            tableHeaders={['Scenario', 'Transitions Used']}
            tableRows={budgetChart.labels.map((l, i) => [l, budgetChart.values[i]])}
          >
            <CompareBarChart labels={budgetChart.labels} series={[{ label: 'Transitions', data: budgetChart.values, statusOverride: budgetChart.statuses }]} yLabel="Transitions" />
          </ChartFrame>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">Safeguard Checklist</h3>
            {checklist.map((c) => (
              <div key={c.id} className="flex items-center gap-2 text-[11px]">
                {c.passed ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />}
                <span className={c.passed ? 'text-emerald-200' : 'text-slate-400'}>{c.label}</span>
              </div>
            ))}
          </div>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-2">
            <label htmlFor="safeguard-notes" className="text-xs font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Agent Safeguards &amp; Architecture Memo</span>
            </label>
            <textarea id="safeguard-notes" rows={4} value={safeguardNotes}
              onChange={(e) => { setSafeguardNotes(e.target.value); onDirty(); }}
              className="w-full text-xs p-3 rounded-xl bg-black/30 border border-white/15 text-slate-200 focus:outline-none focus:border-purple-500/50" />
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={handleExportCsv} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] font-bold">
              <Download className="w-3.5 h-3.5" /><span>CSV</span>
            </button>
            <button type="button" onClick={handleExportJson} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] font-bold">
              <FileJson className="w-3.5 h-3.5" /><span>JSON</span>
            </button>
          </div>

          <button type="button" onClick={handleSubmit}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold transition-all flex items-center justify-center gap-2">
            <Send className="w-4 h-4" />
            <span>Submit Agent Workflow</span>
          </button>
        </div>
      </div>
    </div>
  );
}
