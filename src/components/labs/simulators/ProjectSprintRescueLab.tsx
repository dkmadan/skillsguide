'use client';

import { useMemo, useState } from 'react';
import { LabScenarioVariant, LabDifficulty } from '@/lib/labs/types';
import { useUndoableState } from '@/lib/labs/useUndoableState';
import { downloadCsv, downloadJson } from '@/lib/labs/exportHelper';
import ChartFrame from '@/components/labs/charts/ChartFrame';
import TrendLineChart from '@/components/labs/charts/TrendLineChart';
import CompareBarChart from '@/components/labs/charts/CompareBarChart';
import SimClock from '@/components/labs/SimClock';
import {
  Undo2, Redo2, RotateCcw, Send, Download, FileJson, AlertTriangle, GitBranch,
  ScrollText, KanbanSquare, ArrowUp, ArrowDown,
} from 'lucide-react';

interface SimulatorProps {
  scenario?: LabScenarioVariant;
  variant: LabDifficulty;
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

type OwnerId = 'dev1' | 'dev2' | 'designer' | 'qa';
const OWNERS: OwnerId[] = ['dev1', 'dev2', 'designer', 'qa'];
const OWNER_LABEL: Record<OwnerId, string> = { dev1: 'Dev 1 (Backend Lead)', dev2: 'Dev 2 (Full-Stack)', designer: 'Product Designer', qa: 'QA Engineer' };

interface Task { id: string; title: string; owner: OwnerId; durationDays: number; prereqIds: string[]; sequence: number; done?: boolean; }
interface Fixture { tasks: Task[]; capacity: number; scopeTask: Task; scopeTargetPrereqOwner: string; }

function baseTasks(overrides: Partial<Record<string, number>>): Task[] {
  const d = (id: string, fallback: number) => overrides[id] ?? fallback;
  return [
    { id: 't1', title: 'API Gateway Schema Migration', owner: 'dev1', durationDays: 3, prereqIds: [], sequence: 1, done: true },
    { id: 't2', title: 'Payment Webhook Handler', owner: 'dev1', durationDays: d('t2', 4), prereqIds: ['t1'], sequence: 2 },
    { id: 't3', title: 'Checkout Mobile UI Layout', owner: 'designer', durationDays: 2, prereqIds: [], sequence: 3, done: true },
    { id: 't4', title: 'Stripe 3DS Error Handling Modal', owner: 'dev2', durationDays: d('t4', 3), prereqIds: ['t2'], sequence: 4 },
    { id: 't5', title: 'End-to-End Cypress Integration', owner: 'dev1', durationDays: d('t5', 4), prereqIds: ['t4'], sequence: 5 },
    { id: 't6', title: 'Production Canary Verification', owner: 'dev2', durationDays: d('t6', 2), prereqIds: ['t5'], sequence: 6 },
    { id: 't7', title: 'Accessibility Audit Pass', owner: 'designer', durationDays: d('t7', 2), prereqIds: ['t3'], sequence: 7 },
    { id: 't8', title: 'Onboarding Tooltip Redesign', owner: 'designer', durationDays: d('t8', 3), prereqIds: ['t7'], sequence: 8 },
    { id: 't9', title: 'Compliance Logging Hooks', owner: 'dev1', durationDays: d('t9', 2), prereqIds: ['t2'], sequence: 9 },
    { id: 't10', title: 'Regression Test Suite', owner: 'qa', durationDays: d('t10', 3), prereqIds: ['t9', 't5'], sequence: 10 },
    { id: 't11', title: 'Performance Load Test', owner: 'qa', durationDays: d('t11', 2), prereqIds: ['t10'], sequence: 11 },
    { id: 't12', title: 'Release Readiness Signoff', owner: 'dev2', durationDays: d('t12', 1), prereqIds: ['t6', 't11'], sequence: 12 },
  ];
}

const FIXTURES: Record<LabDifficulty, Fixture> = {
  beginner: {
    capacity: 9,
    tasks: baseTasks({}),
    scopeTask: { id: 't13', title: 'Regulatory Data Retention Addendum', owner: 'qa', durationDays: 2, prereqIds: ['t10'], sequence: 13 },
    scopeTargetPrereqOwner: 't2',
  },
  intermediate: {
    capacity: 8,
    tasks: baseTasks({}),
    scopeTask: { id: 't13', title: 'Regulatory Data Retention Addendum', owner: 'qa', durationDays: 2, prereqIds: ['t10'], sequence: 13 },
    scopeTargetPrereqOwner: 't2',
  },
  challenge: {
    capacity: 7,
    tasks: baseTasks({ t5: 3, t9: 3, t10: 2 }),
    scopeTask: { id: 't13', title: 'Regulatory Data Retention Addendum', owner: 'qa', durationDays: 2, prereqIds: ['t10'], sequence: 13 },
    scopeTargetPrereqOwner: 't2',
  },
};

function detectCycle(tasks: Task[]): string[] | null {
  const byId = new Map(tasks.map((t) => [t.id, t]));
  const color = new Map<string, 'w' | 'g' | 'b'>();
  tasks.forEach((t) => color.set(t.id, 'w'));
  const stack: string[] = [];
  let found: string[] | null = null;
  function dfs(id: string) {
    if (found) return;
    color.set(id, 'g');
    stack.push(id);
    const t = byId.get(id);
    if (t) {
      for (const p of t.prereqIds) {
        if (found) return;
        const c = color.get(p);
        if (c === 'g') {
          const idx = stack.indexOf(p);
          found = [...stack.slice(idx), p];
          return;
        } else if (c === 'w') {
          dfs(p);
        }
      }
    }
    stack.pop();
    color.set(id, 'b');
  }
  for (const t of tasks) {
    if (found) break;
    if (color.get(t.id) === 'w') dfs(t.id);
  }
  return found;
}

interface ScheduleResult { schedule: Record<string, { start: number; finish: number }>; cyclePath: string[] | null; makespan: number; }

function computeSchedule(tasks: Task[]): ScheduleResult {
  const cyclePath = detectCycle(tasks);
  if (cyclePath) {
    const schedule: Record<string, { start: number; finish: number }> = {};
    tasks.forEach((t) => { schedule[t.id] = { start: 0, finish: t.done ? 0 : 0 }; });
    return { schedule, cyclePath, makespan: 0 };
  }
  const finish: Record<string, number> = {};
  const start: Record<string, number> = {};
  const scheduledIds = new Set<string>();
  tasks.filter((t) => t.done).forEach((t) => { finish[t.id] = 0; start[t.id] = 0; scheduledIds.add(t.id); });
  const remaining = tasks.filter((t) => !t.done);
  const ownerAvailable: Record<string, number> = {};
  let guard = 0;
  while (scheduledIds.size < tasks.length && guard < 500) {
    guard++;
    const candidates = remaining.filter((t) => !scheduledIds.has(t.id) && t.prereqIds.every((p) => scheduledIds.has(p)));
    if (candidates.length === 0) break;
    candidates.sort((a, b) => a.sequence - b.sequence || a.id.localeCompare(b.id));
    const t = candidates[0];
    const depFloor = t.prereqIds.reduce((m, p) => Math.max(m, finish[p] ?? 0), 0);
    const ownerFloor = ownerAvailable[t.owner] ?? 0;
    const s = Math.max(depFloor, ownerFloor);
    const f = s + t.durationDays;
    start[t.id] = s; finish[t.id] = f; ownerAvailable[t.owner] = f; scheduledIds.add(t.id);
  }
  const schedule: Record<string, { start: number; finish: number }> = {};
  tasks.forEach((t) => { schedule[t.id] = { start: start[t.id] ?? 0, finish: finish[t.id] ?? 0 }; });
  const makespan = Math.max(0, ...Object.values(finish));
  return { schedule, cyclePath: null, makespan };
}

function ownerLoads(tasks: Task[]): Record<string, number> {
  const loads: Record<string, number> = {};
  tasks.filter((t) => !t.done).forEach((t) => { loads[t.owner] = (loads[t.owner] || 0) + t.durationDays; });
  return loads;
}

function burndownSeries(tasks: Task[], schedule: Record<string, { start: number; finish: number }>, days: number): number[] {
  const nonDone = tasks.filter((t) => !t.done);
  const totalWork = nonDone.reduce((s, t) => s + t.durationDays, 0);
  const arr: number[] = [];
  for (let d = 0; d <= days; d++) {
    const doneWork = nonDone.filter((t) => (schedule[t.id]?.finish ?? 0) <= d).reduce((s, t) => s + t.durationDays, 0);
    arr.push(totalWork - doneWork);
  }
  return arr;
}

interface SprintState { tasks: Task[]; scopeDecision: 'pending' | 'accepted' | 'deferred'; simDay: number; }

function initialState(fixture: Fixture): SprintState {
  return { tasks: fixture.tasks, scopeDecision: 'pending', simDay: 0 };
}

export default function ProjectSprintRescueLab({ variant, onDirty, onSubmit }: SimulatorProps) {
  const fixture = useMemo(() => FIXTURES[variant], [variant]);
  const baseline = useMemo(() => computeSchedule(fixture.tasks), [fixture.tasks]);
  const { state, set, undo, redo, reset, canUndo, canRedo, stepIndex } = useUndoableState<SprintState>(initialState(fixture));
  const [retro, setRetro] = useState('Rebalanced dev1\'s overallocation, kept the dependency graph acyclic, and logged the compliance scope request for next sprint.');
  const [riskNotes, setRiskNotes] = useState<Record<string, string>>({});

  const update = (patch: Partial<SprintState>) => { set((prev) => ({ ...prev, ...patch })); onDirty(); };

  const revised = useMemo(() => computeSchedule(state.tasks), [state.tasks]);
  const loads = useMemo(() => ownerLoads(state.tasks), [state.tasks]);
  const overloadedOwners = OWNERS.filter((o) => (loads[o] || 0) > fixture.capacity);

  const maxDay = Math.max(baseline.makespan, revised.cyclePath ? baseline.makespan : revised.makespan, 1);
  const baselineBurndown = useMemo(() => burndownSeries(fixture.tasks, baseline.schedule, maxDay), [fixture.tasks, baseline.schedule, maxDay]);
  const revisedBurndown = useMemo(
    () => (revised.cyclePath ? null : burndownSeries(state.tasks, revised.schedule, maxDay)),
    [revised.cyclePath, state.tasks, revised.schedule, maxDay]
  );

  const reassignOwner = (taskId: string, owner: OwnerId) => {
    update({ tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, owner } : t)) });
  };
  const moveSequence = (taskId: string, dir: -1 | 1) => {
    const sorted = [...state.tasks].sort((a, b) => a.sequence - b.sequence);
    const idx = sorted.findIndex((t) => t.id === taskId);
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const a = sorted[idx], b = sorted[swapIdx];
    update({ tasks: state.tasks.map((t) => (t.id === a.id ? { ...t, sequence: b.sequence } : t.id === b.id ? { ...t, sequence: a.sequence } : t)) });
  };

  const acceptScope = () => {
    const scope = fixture.scopeTask;
    update({
      tasks: [...state.tasks.map((t) => (t.id === fixture.scopeTargetPrereqOwner ? { ...t, prereqIds: [...t.prereqIds, scope.id] } : t)), scope],
      scopeDecision: 'accepted',
    });
  };
  const deferScope = () => update({ scopeDecision: 'deferred' });

  const breakEdge = (from: string, to: string) => {
    update({ tasks: state.tasks.map((t) => (t.id === from ? { ...t, prereqIds: t.prereqIds.filter((p) => p !== to) } : t)) });
  };

  const kanbanStatus = (t: Task): 'done' | 'in_progress' | 'blocked' | 'ready' => {
    if (t.done) return 'done';
    const sched = revised.schedule[t.id];
    if (!sched) return 'blocked';
    if (sched.finish <= state.simDay) return 'done';
    if (sched.start <= state.simDay) return 'in_progress';
    const prereqsFinished = t.prereqIds.every((p) => (revised.schedule[p]?.finish ?? 0) <= state.simDay);
    return prereqsFinished ? 'ready' : 'blocked';
  };

  const handleExportCsv = () => {
    downloadCsv('sprint_rescue_schedule.csv', state.tasks.map((t) => ({
      task_id: t.id, title: t.title, owner: t.owner, duration_days: t.durationDays,
      prereqs: t.prereqIds.join('|') || 'NONE', start_day: revised.schedule[t.id]?.start ?? '', finish_day: revised.schedule[t.id]?.finish ?? '',
    })));
  };
  const handleExportJson = () => {
    downloadJson('sprint_rescue_plan.json', {
      variant, capacity: fixture.capacity, tasks: state.tasks, loads, baselineMakespan: baseline.makespan,
      revisedMakespan: revised.cyclePath ? null : revised.makespan, scopeDecision: state.scopeDecision, riskNotes, retro,
    });
  };

  const handleSubmit = () => {
    onSubmit({
      capacity: fixture.capacity,
      tasks: state.tasks.map((t) => ({ id: t.id, owner: t.owner, durationDays: t.durationDays, prereqIds: t.prereqIds, sequence: t.sequence, done: Boolean(t.done) })),
      cycleResolved: revised.cyclePath === null,
      scopeDecision: state.scopeDecision,
      baselineMakespan: baseline.makespan,
      revisedMakespan: revised.cyclePath ? null : revised.makespan,
      riskNotesCount: Object.values(riskNotes).filter((v) => v.trim().length > 0).length,
      retro,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Owner Capacity</span>
          <span className={`text-xl font-black ${overloadedOwners.length ? 'text-red-400' : 'text-emerald-400'}`}>{overloadedOwners.length ? `${overloadedOwners.length} over` : 'Balanced'}</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Cap {fixture.capacity}d/owner · step {stepIndex}</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Dependency Graph</span>
          <span className={`text-xl font-black ${revised.cyclePath ? 'text-red-400' : 'text-emerald-400'}`}>{revised.cyclePath ? 'Cycle!' : 'Acyclic'}</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Baseline Finish</span>
          <span className="text-xl font-black text-white">Day {baseline.makespan}</span>
        </div>
        <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30">
          <span className="text-xs text-purple-300 font-bold block mb-1">Revised Finish</span>
          <span className="text-xl font-black text-purple-100">{revised.cyclePath ? 'Blocked' : `Day ${revised.makespan}`}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-sm font-extrabold text-white flex items-center gap-2"><KanbanSquare className="w-4 h-4 text-amber-400" /><span>Kanban (Day {state.simDay})</span></h2>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={undo} disabled={!canUndo} title="Undo" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30"><Undo2 className="w-3.5 h-3.5" /></button>
                <button type="button" onClick={redo} disabled={!canRedo} title="Redo" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30"><Redo2 className="w-3.5 h-3.5" /></button>
                <button type="button" onClick={() => { reset(); onDirty(); }} title="Reset" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white"><RotateCcw className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <SimClock label="Sprint Day" step={state.simDay} maxStep={maxDay} onAdvance={() => update({ simDay: Math.min(maxDay, state.simDay + 1) })} onReset={() => update({ simDay: 0 })} stepLabel={(s) => `Day ${s}/${maxDay}`} />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {(['done', 'in_progress', 'ready', 'blocked'] as const).map((col) => (
                <div key={col} className="space-y-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{col.replace('_', ' ')}</div>
                  {state.tasks.filter((t) => kanbanStatus(t) === col).map((t) => (
                    <div key={t.id} className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] text-slate-300">{t.title}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2"><GitBranch className="w-3.5 h-3.5 text-amber-400" />Task Sequence, Owners &amp; Dependencies</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {[...state.tasks].sort((a, b) => a.sequence - b.sequence).map((t) => (
                <div key={t.id} className="p-3 bg-black/20 border border-white/10 rounded-xl text-xs space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-white">{t.title}{t.done && <span className="ml-2 text-[10px] text-emerald-400">DONE</span>}</span>
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => moveSequence(t.id, -1)} className="p-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300" title="Move earlier"><ArrowUp className="w-3 h-3" /></button>
                      <button type="button" onClick={() => moveSequence(t.id, 1)} className="p-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300" title="Move later"><ArrowDown className="w-3 h-3" /></button>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                    <span>Duration: {t.durationDays}d</span>
                    <span>Prereqs: {t.prereqIds.length ? t.prereqIds.join(', ') : 'None'}</span>
                    <span>Start/Finish: {revised.schedule[t.id]?.start ?? '—'} → {revised.schedule[t.id]?.finish ?? '—'}</span>
                    {!t.done && (
                      <select value={t.owner} onChange={(e) => reassignOwner(t.id, e.target.value as OwnerId)}
                        className="bg-black/40 border border-white/15 rounded px-1.5 py-0.5 text-[10px] text-slate-200">
                        {OWNERS.map((o) => <option key={o} value={o}>{OWNER_LABEL[o]}</option>)}
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {revised.cyclePath && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-800 space-y-2">
                <div className="text-[11px] font-bold text-red-300 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" />Cyclic dependency detected: {revised.cyclePath.join(' → ')}</div>
                <div className="flex flex-wrap gap-1.5">
                  {revised.cyclePath.slice(0, -1).map((from, i) => {
                    const to = revised.cyclePath![i + 1];
                    return (
                      <button key={`${from}-${to}`} type="button" onClick={() => breakEdge(from, to)}
                        className="px-2.5 py-1 rounded-lg bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-200 text-[10px] font-bold">
                        Break: {from} no longer requires {to}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">Scope-Change Card</h3>
            <p className="text-[11px] text-slate-400">Compliance requests a new &quot;{fixture.scopeTask.title}&quot; task ({fixture.scopeTask.durationDays}d, {OWNER_LABEL[fixture.scopeTask.owner]}) that would also require Payment Webhook Handler to wait on it.</p>
            {state.scopeDecision === 'pending' ? (
              <div className="flex gap-2">
                <button type="button" onClick={acceptScope} className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold">Accept &amp; Add Dependency</button>
                <button type="button" onClick={deferScope} className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-bold">Defer to Backlog</button>
              </div>
            ) : (
              <div className="text-[11px] text-slate-400">Decision: <span className="font-bold text-white">{state.scopeDecision === 'accepted' ? 'Accepted (dependency added)' : 'Deferred to backlog'}</span></div>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <ChartFrame title="Burndown: Baseline vs Revised" icon={<ScrollText className="w-4 h-4 text-amber-400" />}
            tableHeaders={['Day', 'Baseline Remaining', 'Revised Remaining']}
            tableRows={baselineBurndown.map((v, i) => [i, v, revisedBurndown ? revisedBurndown[i] : 'blocked'])}>
            <TrendLineChart labels={baselineBurndown.map((_, i) => `Day ${i}`)}
              series={[
                { label: 'Baseline', data: baselineBurndown.map((v, i) => (i <= state.simDay ? v : null)) },
                { label: 'Revised', data: revisedBurndown ? revisedBurndown.map((v, i) => (i <= state.simDay ? v : null)) : baselineBurndown.map(() => null) },
              ]}
              yLabel="Remaining Days of Work" />
          </ChartFrame>

          <ChartFrame title="Capacity per Owner" icon={<AlertTriangle className="w-4 h-4 text-amber-400" />}
            tableHeaders={['Owner', 'Planned Days']} tableRows={OWNERS.map((o) => [OWNER_LABEL[o], loads[o] || 0])}>
            <CompareBarChart labels={OWNERS.map((o) => OWNER_LABEL[o])}
              series={[{ label: 'Planned Days', data: OWNERS.map((o) => loads[o] || 0), statusOverride: OWNERS.map((o) => ((loads[o] || 0) > fixture.capacity ? 'critical' : null)) }]}
              yLabel="Days" />
          </ChartFrame>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">Risk Register</h3>
            <div className="space-y-2">
              {overloadedOwners.map((o) => (
                <div key={`risk-${o}`} className="p-2.5 rounded-xl bg-red-950/20 border border-red-500/30 text-[11px] space-y-1">
                  <span className="font-bold text-red-300">{OWNER_LABEL[o]} is overallocated ({loads[o]}d &gt; {fixture.capacity}d cap)</span>
                  <input value={riskNotes[`ov-${o}`] || ''} onChange={(e) => { setRiskNotes({ ...riskNotes, [`ov-${o}`]: e.target.value }); onDirty(); }}
                    placeholder="Mitigation..." className="w-full text-[11px] p-1.5 rounded bg-black/30 border border-white/10 text-slate-200" />
                </div>
              ))}
              {revised.cyclePath && (
                <div className="p-2.5 rounded-xl bg-red-950/20 border border-red-500/30 text-[11px] space-y-1">
                  <span className="font-bold text-red-300">Cyclic dependency blocks scheduling</span>
                  <input value={riskNotes['cycle'] || ''} onChange={(e) => { setRiskNotes({ ...riskNotes, cycle: e.target.value }); onDirty(); }}
                    placeholder="Mitigation..." className="w-full text-[11px] p-1.5 rounded bg-black/30 border border-white/10 text-slate-200" />
                </div>
              )}
              {state.scopeDecision === 'accepted' && (
                <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-[11px] space-y-1">
                  <span className="font-bold text-amber-300">Scope increase: +{fixture.scopeTask.durationDays}d added to {OWNER_LABEL[fixture.scopeTask.owner]}</span>
                  <input value={riskNotes['scope'] || ''} onChange={(e) => { setRiskNotes({ ...riskNotes, scope: e.target.value }); onDirty(); }}
                    placeholder="Mitigation..." className="w-full text-[11px] p-1.5 rounded bg-black/30 border border-white/10 text-slate-200" />
                </div>
              )}
              {overloadedOwners.length === 0 && !revised.cyclePath && state.scopeDecision !== 'accepted' && (
                <p className="text-[11px] text-slate-500 italic">No active risks — capacity balanced, graph acyclic.</p>
              )}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-2">
            <label className="text-xs font-extrabold text-white">Sprint Retrospective</label>
            <textarea rows={4} value={retro} onChange={(e) => { setRetro(e.target.value); onDirty(); }}
              className="w-full text-xs p-3 rounded-xl bg-black/30 border border-white/15 text-slate-200 focus:outline-none focus:border-amber-500/50" />
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={handleExportCsv} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] font-bold"><Download className="w-3.5 h-3.5" /><span>Schedule CSV</span></button>
            <button type="button" onClick={handleExportJson} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] font-bold"><FileJson className="w-3.5 h-3.5" /><span>Plan JSON</span></button>
          </div>

          <button type="button" onClick={handleSubmit}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 text-xs font-extrabold transition-all flex items-center justify-center gap-2">
            <Send className="w-4 h-4" /><span>Submit Sprint Replan</span>
          </button>
        </div>
      </div>
    </div>
  );
}
