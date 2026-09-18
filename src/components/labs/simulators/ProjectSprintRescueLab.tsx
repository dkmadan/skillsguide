'use client';

import React, { useState, useMemo } from 'react';
import { LabScenarioVariant } from '@/lib/labs/types';
import { downloadJson, downloadCsv } from '@/lib/labs/exportHelper';

interface Props {
  scenario?: LabScenarioVariant;
  variant: 'beginner' | 'intermediate' | 'challenge';
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

interface SprintTask {
  id: string;
  title: string;
  assignedOwner: 'dev1' | 'dev2' | 'designer';
  durationDays: number;
  prereqId?: string;
  status: 'backlog' | 'in_progress' | 'blocked' | 'done';
}

export default function ProjectSprintRescueLab({ onDirty, onSubmit }: Props) {
  const [tasks, setTasks] = useState<SprintTask[]>([
    { id: 't1', title: 'API Gateway Schema Migration', assignedOwner: 'dev1', durationDays: 3, status: 'done' },
    { id: 't2', title: 'Payment Webhook Handler', assignedOwner: 'dev1', durationDays: 4, prereqId: 't1', status: 'in_progress' },
    { id: 't3', title: 'Checkout Mobile UI Layout', assignedOwner: 'designer', durationDays: 2, status: 'done' },
    { id: 't4', title: 'Stripe 3DS Error Handling Modal', assignedOwner: 'dev2', durationDays: 3, prereqId: 't2', status: 'blocked' }, // blocked by t2
    { id: 't5', title: 'End-to-End Cypress Integration', assignedOwner: 'dev1', durationDays: 4, prereqId: 't4', status: 'backlog' }, // Dev1 overallocated
    { id: 't6', title: 'Production Canary Verification', assignedOwner: 'dev2', durationDays: 2, prereqId: 't5', status: 'backlog' },
  ]);

  const [hasResolvedOverallocation, setHasResolvedOverallocation] = useState<boolean>(false);
  const [sprintRetro, setSprintRetro] = useState<string>('Identified critical path blocker on Task 2 (Payment Webhook). Reassigned Task 5 to dev2 to eliminate resource starvation.');

  // Check owner workloads: max 7 days per dev
  const ownerLoads = useMemo(() => {
    const loads: Record<string, number> = { dev1: 0, dev2: 0, designer: 0 };
    tasks.forEach(t => {
      loads[t.assignedOwner] += t.durationDays;
    });
    return loads;
  }, [tasks]);

  const isDev1Overloaded = ownerLoads.dev1 > 7;

  const handleReassignTask5 = () => {
    setTasks(prev => prev.map(t => t.id === 't5' ? { ...t, assignedOwner: 'dev2' } : t));
    setHasResolvedOverallocation(true);
    onDirty();
  };

  const handleExportCsv = () => {
    const rows = tasks.map(t => ({
      task_id: t.id,
      title: t.title,
      owner: t.assignedOwner,
      days: t.durationDays,
      prerequisite: t.prereqId || 'NONE',
      status: t.status
    }));
    downloadCsv('sprint_rescue_gantt.csv', rows);
  };

  const handleExportJson = () => {
    downloadJson('sprint_rescue_plan.json', {
      tasks,
      ownerLoads,
      hasResolvedOverallocation,
      sprintRetro
    });
  };

  const handleFinalSubmit = () => {
    onSubmit({
      tasks,
      ownerLoads,
      hasResolvedOverallocation,
      sprintRetro
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Lab 18 • Agile Project Management & SRE
            </span>
            <h2 className="text-xl font-bold text-white mt-2">Project & Sprint Rescue Decision Lab</h2>
            <p className="text-sm text-slate-400 mt-1">
              Rescue a delayed sprint on the critical path. Unblock downstream tasks, resolve developer overallocation (&gt;7 days/sprint), and calculate updated project finish dates.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              Export Gantt CSV
            </button>
            <button
              onClick={handleFinalSubmit}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition shadow-lg shadow-amber-500/20"
            >
              Submit Sprint Replan
            </button>
          </div>
        </div>
      </div>

      {/* Developer Capacity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { key: 'dev1', name: 'Dev 1 (Backend Lead)', cap: 7, load: ownerLoads.dev1 },
          { key: 'dev2', name: 'Dev 2 (Full-Stack)', cap: 7, load: ownerLoads.dev2 },
          { key: 'designer', name: 'Product Designer', cap: 7, load: ownerLoads.designer },
        ].map(dev => (
          <div key={dev.key} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-200">{dev.name}</span>
              <span className={`font-mono font-bold ${dev.load > dev.cap ? 'text-rose-400' : 'text-emerald-400'}`}>
                {dev.load} / {dev.cap} Days {dev.load > dev.cap && '⚠️ OVERALLOCATED'}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mt-2">
              <div
                className={`h-full rounded-full transition-all duration-300 ${dev.load > dev.cap ? 'bg-rose-500' : 'bg-amber-500'}`}
                style={{ width: `${Math.min(100, (dev.load / dev.cap) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Task Dependency & Gantt Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Critical Path Dependency Graph</h3>
            {isDev1Overloaded && (
              <button
                onClick={handleReassignTask5}
                className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition"
              >
                Rebalance: Reassign T5 to Dev 2
              </button>
            )}
          </div>

          <div className="space-y-3">
            {tasks.map(t => (
              <div
                key={t.id}
                className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-400">{t.id.toUpperCase()}</span>
                    <span className="font-semibold text-white">{t.title}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Assigned: <span className="text-slate-200 capitalize">{t.assignedOwner}</span> • Duration: {t.durationDays} days • Prereq: {t.prereqId || 'None'}
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${
                  t.status === 'done'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : t.status === 'in_progress'
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : t.status === 'blocked'
                    ? 'bg-rose-500/20 text-rose-300'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {t.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Retrospective Documentation */}
        <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white">Sprint Retrospective Memo</h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Root Cause & Bottleneck Mitigation</label>
              <textarea
                rows={5}
                value={sprintRetro}
                onChange={e => { setSprintRetro(e.target.value); onDirty(); }}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
