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

interface PipelineStage {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'pending';
  logSnippet: string;
  errorDetail?: string;
}

export default function DevOpsPipelineDiagnosisLab({ onDirty, onSubmit }: Props) {
  const [stages, setStages] = useState<PipelineStage[]>([
    { id: 'lint', name: '1. Lint & Static Analysis', status: 'passed', logSnippet: 'ESLint passed: 0 warnings, 0 errors' },
    { id: 'unit_test', name: '2. Unit Test Suite', status: 'passed', logSnippet: 'Jest: 142 tests passed in 14.2s' },
    { id: 'integration', name: '3. DB Migration & Integration', status: 'failed', logSnippet: 'ERROR: FATAL: relation "users_v2" does not exist at /db/migrate.sql:42. Missing pre-deploy migration stage!', errorDetail: 'Database migration was skipped prior to service boot.' },
    { id: 'deploy_canary', name: '4. Canary 10% Rollout', status: 'pending', logSnippet: 'Awaiting upstream stages.' },
  ]);

  const [selectedFix, setSelectedFix] = useState<'none' | 'add_migration_step' | 'ignore_db_errors' | 'rollback_last_stable'>('none');
  const [pipelineReordered, setPipelineReordered] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [releaseNote, setReleaseNote] = useState<string>('');

  const handleApplyFix = (fix: typeof selectedFix) => {
    setSelectedFix(fix);
    if (fix === 'add_migration_step') {
      setStages([
        { id: 'lint', name: '1. Lint & Static Analysis', status: 'passed', logSnippet: 'ESLint passed: 0 warnings, 0 errors' },
        { id: 'migrate', name: '2. Schema Migration Check', status: 'passed', logSnippet: 'Applied schema migration 20260918_add_users_v2.sql cleanly.' },
        { id: 'unit_test', name: '3. Unit Test Suite', status: 'passed', logSnippet: 'Jest: 142 tests passed in 14.2s' },
        { id: 'integration', name: '4. DB Integration Tests', status: 'passed', logSnippet: 'All integration fixtures verified against PostgreSQL 16.' },
        { id: 'deploy_canary', name: '5. Canary 10% Rollout', status: 'passed', logSnippet: 'Canary healthy: 0.00% 5xx rate over 5 minutes.' },
      ]);
      setPipelineReordered(true);
    } else if (fix === 'rollback_last_stable') {
      setStages(prev => prev.map(s => s.id === 'integration' ? { ...s, status: 'passed', logSnippet: 'Rolled back commit to SHA: a8f99e (v2.4.1 stable)' } : s));
    }
    onDirty();
  };

  const handleExportJson = () => {
    downloadJson('devops_pipeline_diagnosis.json', {
      selectedFix,
      pipelineReordered,
      stages,
      releaseNote
    });
  };

  const handleFinalSubmit = () => {
    onSubmit({
      selectedFix,
      pipelineReordered,
      stages,
      releaseNote
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
              Lab 13 • CI/CD & DevOps Engineering
            </span>
            <h2 className="text-xl font-bold text-white mt-2">DevOps Pipeline Diagnosis & Rollback Decision Room</h2>
            <p className="text-sm text-slate-400 mt-1">
              Locate the root cause of a broken GitHub Actions build. Re-order pre-deploy database migration steps and verify green stage gates.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              Export Incident Note
            </button>
            <button
              onClick={handleFinalSubmit}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition shadow-lg shadow-violet-600/20"
            >
              Submit Diagnosis
            </button>
          </div>
        </div>
      </div>

      {/* Pipeline Stage Graph */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Pipeline Execution Stages</h3>

        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {stages.map(st => (
            <div
              key={st.id}
              className={`p-4 rounded-xl border flex flex-col justify-between ${
                st.status === 'passed'
                  ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
                  : st.status === 'failed'
                  ? 'bg-rose-950/30 border-rose-800/60 text-rose-300 animate-pulse'
                  : 'bg-slate-900/40 border-slate-800 text-slate-500'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold">{st.name}</span>
                  <span className="text-[10px] font-bold uppercase">{st.status}</span>
                </div>
                <p className="text-[11px] opacity-80 line-clamp-2">{st.logSnippet}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log Inspector & Remediation Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Logs */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-sans font-semibold">Live Build Terminal Logs</span>
            <input
              type="text"
              placeholder="Search logs..."
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-300 text-xs focus:outline-none"
            />
          </div>

          <div className="p-4 bg-slate-900/80 rounded-xl space-y-2 border border-slate-800/80 max-h-64 overflow-y-auto">
            {stages.map(s => (
              <div key={s.id} className="space-y-1">
                <div className="text-slate-500 font-bold">[{s.name}]</div>
                <div className={s.status === 'failed' ? 'text-rose-400' : 'text-slate-300'}>
                  {s.logSnippet}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Panel */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white">Root Cause Remediation</h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Select CI/CD Workflow Fix</label>
              <div className="space-y-2">
                {[
                  { id: 'add_migration_step', label: 'Insert Pre-Deploy Schema Migration Step' },
                  { id: 'ignore_db_errors', label: 'Add --continue-on-error flag to test runner (Unsafe)' },
                  { id: 'rollback_last_stable', label: 'Revert to Last Stable Release SHA' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => handleApplyFix(opt.id as any)}
                    className={`w-full text-left p-3 rounded-xl border transition ${
                      selectedFix === opt.id
                        ? 'bg-violet-500/20 border-violet-500 text-violet-300 font-semibold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Release Note & Post-Incident Reflection</label>
              <textarea
                rows={3}
                value={releaseNote}
                onChange={e => { setReleaseNote(e.target.value); onDirty(); }}
                placeholder="Explain why skipping database migrations before integration tests breaks the build pipeline..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
