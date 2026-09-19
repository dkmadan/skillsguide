'use client';

import { useMemo, useState } from 'react';
import { LabScenarioVariant, LabDifficulty } from '@/lib/labs/types';
import { useUndoableState } from '@/lib/labs/useUndoableState';
import { downloadJson } from '@/lib/labs/exportHelper';
import ChartFrame from '@/components/labs/charts/ChartFrame';
import TrendLineChart from '@/components/labs/charts/TrendLineChart';
import SimClock from '@/components/labs/SimClock';
import {
  Undo2,
  Redo2,
  RotateCcw,
  Download,
  Send,
  Search,
  ArrowUp,
  ArrowDown,
  ListChecks,
  GitBranch,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from 'lucide-react';

interface SimulatorProps {
  scenario?: LabScenarioVariant;
  variant: LabDifficulty;
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

type FailureKind = 'missing_setting' | 'failing_test' | 'incompatible_dependency';
type StageStatus = 'passed' | 'failed' | 'blocked';

interface LogLine {
  id: string;
  stageId: string;
  level: 'info' | 'error' | 'warn';
  text: string;
}

interface FixOption {
  id: string;
  label: string;
  correct: boolean;
}

interface Fixture {
  failureKind: FailureKind;
  title: string;
  requiredStageIds: string[]; // canonical correct order
  scrambledStageIds: string[]; // starting (broken) order
  stageNames: Record<string, string>;
  failingStageId: string; // the stage that fails when order/fix are wrong
  configDiff: { before: string; after: string; explanation: string };
  logs: LogLine[];
  fixOptions: FixOption[];
  rollbackAvailable: boolean;
  rollbackUnavailableReason: string;
  releaseChecklist: { id: string; label: string; prerequisiteStageId: string }[];
}

const STAGE_LABELS: Record<string, string> = {
  lint: 'Lint & Static Analysis',
  config_validate: 'Config Validation',
  unit_test: 'Unit Test Suite',
  fix_test: 'Patch Failing Test Case',
  migrate: 'Schema Migration',
  resolve_deps: 'Resolve Dependency Pin',
  integration: 'Integration Tests',
  canary: 'Canary 10% Rollout',
};

// Three distinct, authored root-cause scenarios — one per required failure
// type from the spec (missing setting / failing test / incompatible
// dependency) — each with its own finite-state repair graph.
const FIXTURES: Record<LabDifficulty, Fixture> = {
  beginner: {
    failureKind: 'missing_setting',
    title: 'Missing production config setting crashes boot',
    requiredStageIds: ['lint', 'config_validate', 'unit_test', 'integration', 'canary'],
    scrambledStageIds: ['lint', 'unit_test', 'integration', 'canary', 'config_validate'],
    stageNames: STAGE_LABELS,
    failingStageId: 'integration',
    configDiff: {
      before: 'DATABASE_POOL_SIZE=<unset>\nFEATURE_FLAG_SERVICE_URL=<unset>',
      after: 'DATABASE_POOL_SIZE=20\nFEATURE_FLAG_SERVICE_URL=https://flags.internal.example/v1',
      explanation: 'The deploy environment was missing two required settings, so the service crashed on boot during integration tests.',
    },
    logs: [
      { id: 'l1', stageId: 'lint', level: 'info', text: 'ESLint passed: 0 warnings, 0 errors' },
      { id: 'l2', stageId: 'unit_test', level: 'info', text: 'Jest: 142 tests passed in 14.2s' },
      { id: 'l3', stageId: 'integration', level: 'error', text: 'FATAL: DATABASE_POOL_SIZE is not set. Service failed health check at boot.' },
      { id: 'l4', stageId: 'integration', level: 'error', text: 'FATAL: FEATURE_FLAG_SERVICE_URL is not set. Falling back failed — no default configured.' },
      { id: 'l5', stageId: 'canary', level: 'warn', text: 'Awaiting upstream stages.' },
    ],
    fixOptions: [
      { id: 'add_config_validate', label: 'Insert a Config Validation stage before tests to fail fast on missing settings', correct: true },
      { id: 'ignore_missing_config', label: 'Wrap the boot code in a try/catch and continue on missing settings (unsafe)', correct: false },
      { id: 'rollback_last_stable', label: 'Roll back to the last stable release', correct: false },
    ],
    rollbackAvailable: true,
    rollbackUnavailableReason: '',
    releaseChecklist: [
      { id: 'rc1', label: 'Static analysis clean', prerequisiteStageId: 'lint' },
      { id: 'rc2', label: 'Required settings validated', prerequisiteStageId: 'config_validate' },
      { id: 'rc3', label: 'Unit tests green', prerequisiteStageId: 'unit_test' },
      { id: 'rc4', label: 'Integration tests green', prerequisiteStageId: 'integration' },
    ],
  },
  intermediate: {
    failureKind: 'failing_test',
    title: 'Genuine logic bug fails a unit test',
    requiredStageIds: ['lint', 'unit_test', 'fix_test', 'integration', 'canary'],
    scrambledStageIds: ['lint', 'integration', 'unit_test', 'canary', 'fix_test'],
    stageNames: STAGE_LABELS,
    failingStageId: 'unit_test',
    configDiff: {
      before: 'function applyDiscount(total, pct) {\n  return total - pct; // bug: treats pct as a flat amount, not a percentage\n}',
      after: 'function applyDiscount(total, pct) {\n  return total - total * (pct / 100);\n}',
      explanation: 'applyDiscount() subtracted the raw percentage instead of a proportional amount, so the discount test caught real, reproducible incorrect output.',
    },
    logs: [
      { id: 'l1', stageId: 'lint', level: 'info', text: 'ESLint passed: 0 warnings, 0 errors' },
      { id: 'l2', stageId: 'unit_test', level: 'error', text: 'FAIL pricing.test.js > applyDiscount(200, 10) expected 180 received 190' },
      { id: 'l3', stageId: 'unit_test', level: 'error', text: '141 passed, 1 failed — applyDiscount treats percentage as a flat subtraction' },
      { id: 'l4', stageId: 'integration', level: 'warn', text: 'Skipped: upstream unit test stage failed.' },
      { id: 'l5', stageId: 'canary', level: 'warn', text: 'Awaiting upstream stages.' },
    ],
    fixOptions: [
      { id: 'patch_discount_logic', label: 'Patch applyDiscount() to compute a proportional discount, then re-run the suite', correct: true },
      { id: 'skip_failing_test', label: 'Mark the failing test as skipped so the suite goes green (unsafe)', correct: false },
      { id: 'rollback_last_stable', label: 'Roll back to the last stable release', correct: false },
    ],
    rollbackAvailable: true,
    rollbackUnavailableReason: '',
    releaseChecklist: [
      { id: 'rc1', label: 'Static analysis clean', prerequisiteStageId: 'lint' },
      { id: 'rc2', label: 'Unit tests green (real fix, not skipped)', prerequisiteStageId: 'unit_test' },
      { id: 'rc3', label: 'Fix verified by re-running the suite', prerequisiteStageId: 'fix_test' },
      { id: 'rc4', label: 'Integration tests green', prerequisiteStageId: 'integration' },
    ],
  },
  challenge: {
    failureKind: 'incompatible_dependency',
    title: 'Incompatible dependency breaks the build on a first-ever release',
    requiredStageIds: ['lint', 'resolve_deps', 'unit_test', 'integration', 'canary'],
    scrambledStageIds: ['resolve_deps', 'unit_test', 'lint', 'canary', 'integration'],
    stageNames: STAGE_LABELS,
    failingStageId: 'integration',
    configDiff: {
      before: '"http-client": "^4.2.0",\n"auth-sdk": "^9.0.0" // requires http-client ^5, conflicts with pin above',
      after: '"http-client": "^5.1.0",\n"auth-sdk": "^9.0.0"',
      explanation: 'auth-sdk 9.x requires http-client ^5, but the lockfile pinned http-client ^4, producing an incompatible dependency graph at integration time.',
    },
    logs: [
      { id: 'l1', stageId: 'resolve_deps', level: 'warn', text: 'peer dependency warning: auth-sdk@9.0.0 requires http-client@^5, found ^4.2.0' },
      { id: 'l2', stageId: 'lint', level: 'info', text: 'ESLint passed: 0 warnings, 0 errors' },
      { id: 'l3', stageId: 'unit_test', level: 'info', text: 'Jest: 96 tests passed in 9.8s (auth-sdk mocked out)' },
      { id: 'l4', stageId: 'integration', level: 'error', text: 'FATAL: TypeError — auth-sdk called an http-client v5-only API that does not exist on v4.2.0.' },
      { id: 'l5', stageId: 'canary', level: 'warn', text: 'Awaiting upstream stages.' },
    ],
    fixOptions: [
      { id: 'pin_compatible_versions', label: 'Bump http-client to the ^5 range required by auth-sdk and re-lock', correct: true },
      { id: 'force_install_ignore_peers', label: 'Force-install and ignore the peer dependency conflict (unsafe)', correct: false },
      { id: 'rollback_last_stable', label: 'Roll back to the last stable release', correct: false },
    ],
    rollbackAvailable: false,
    rollbackUnavailableReason: 'This is the project\'s first-ever release — there is no prior stable release tag to roll back to. The dependency conflict must be fixed forward.',
    releaseChecklist: [
      { id: 'rc1', label: 'Static analysis clean', prerequisiteStageId: 'lint' },
      { id: 'rc2', label: 'Dependency graph resolved without peer conflicts', prerequisiteStageId: 'resolve_deps' },
      { id: 'rc3', label: 'Unit tests green', prerequisiteStageId: 'unit_test' },
      { id: 'rc4', label: 'Integration tests green', prerequisiteStageId: 'integration' },
    ],
  },
};

interface RepairState {
  stageOrder: string[];
  selectedFix: string;
  rollbackChosen: boolean;
}

function arraysEqual(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

// Finite-state graph: authored outcomes only, no execution. A stage after the
// canonical failing point stays 'blocked' until both the order is corrected
// AND the correct fix is selected — teaching that reordering alone or a fix
// alone is not sufficient.
function computeStageStatuses(fixture: Fixture, repair: RepairState): Record<string, StageStatus> {
  const statuses: Record<string, StageStatus> = {};
  if (repair.rollbackChosen) {
    if (fixture.rollbackAvailable) {
      fixture.requiredStageIds.forEach((id) => { statuses[id] = 'passed'; });
      return statuses;
    }
    // Rollback unavailable: pipeline remains exactly as broken as it started.
    repair.stageOrder.forEach((id, idx) => {
      const firstFailingIdx = repair.stageOrder.indexOf(fixture.failingStageId);
      statuses[id] = idx < firstFailingIdx ? 'passed' : idx === firstFailingIdx ? 'failed' : 'blocked';
    });
    return statuses;
  }

  const orderCorrect = arraysEqual(repair.stageOrder, fixture.requiredStageIds);
  const fixOption = fixture.fixOptions.find((f) => f.id === repair.selectedFix);
  const fixCorrect = Boolean(fixOption?.correct);

  if (orderCorrect && fixCorrect) {
    fixture.requiredStageIds.forEach((id) => { statuses[id] = 'passed'; });
    return statuses;
  }

  // Otherwise the pipeline still fails at (or before) the causal stage.
  const workingOrder = repair.stageOrder;
  const failIdx = workingOrder.indexOf(fixture.failingStageId);
  workingOrder.forEach((id, idx) => {
    if (idx < failIdx) statuses[id] = 'passed';
    else if (idx === failIdx) statuses[id] = 'failed';
    else statuses[id] = 'blocked';
  });
  return statuses;
}

export default function DevOpsPipelineDiagnosisLab({ variant, onDirty, onSubmit }: SimulatorProps) {
  const fixture = FIXTURES[variant];
  const initialRepair: RepairState = { stageOrder: fixture.scrambledStageIds, selectedFix: 'none', rollbackChosen: false };
  const { state: repair, set: setRepair, undo, redo, reset, canUndo, canRedo, stepIndex } = useUndoableState<RepairState>(initialRepair);
  const [runStep, setRunStep] = useState(0);
  const [searchFilter, setSearchFilter] = useState('');
  const [citedLogIds, setCitedLogIds] = useState<string[]>([]);
  const [releaseNote, setReleaseNote] = useState('');

  const statuses = useMemo(() => computeStageStatuses(fixture, repair), [fixture, repair]);
  const orderForDisplay = repair.rollbackChosen && fixture.rollbackAvailable ? fixture.requiredStageIds : repair.stageOrder;
  const revealedStatuses = useMemo(() => {
    const revealed: Record<string, StageStatus | 'pending'> = {};
    orderForDisplay.forEach((id, idx) => {
      revealed[id] = idx <= runStep ? statuses[id] : 'pending';
    });
    return revealed;
  }, [orderForDisplay, statuses, runStep]);

  const allGreen = orderForDisplay.every((id) => statuses[id] === 'passed');
  const revealedAllGreen = orderForDisplay.every((id, idx) => idx > runStep || statuses[id] === 'passed');

  const moveStage = (index: number, direction: -1 | 1) => {
    const next = [...repair.stageOrder];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setRepair((prev) => ({ ...prev, stageOrder: next }));
    onDirty();
  };

  const selectFix = (fixId: string) => {
    setRepair((prev) => ({ ...prev, selectedFix: fixId, rollbackChosen: false }));
    onDirty();
  };

  const chooseRollback = () => {
    setRepair((prev) => ({ ...prev, rollbackChosen: true }));
    onDirty();
  };

  const toggleCiteLog = (id: string) => {
    setCitedLogIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    onDirty();
  };

  const filteredLogs = fixture.logs.filter((l) => l.text.toLowerCase().includes(searchFilter.toLowerCase()));

  // Before/after pipeline-stage timing (ms), for a small, illustrative,
  // deterministic per-stage duration — never real build execution.
  const timingChart = useMemo(() => {
    const baseDurations: Record<string, number> = { lint: 8, config_validate: 4, unit_test: 14, fix_test: 6, migrate: 10, resolve_deps: 7, integration: 22, canary: 30 };
    const uncorrectedOrder = fixture.scrambledStageIds;
    const correctedOrder = fixture.requiredStageIds;
    const uncorrectedStatuses = computeStageStatuses(fixture, { stageOrder: uncorrectedOrder, selectedFix: 'none', rollbackChosen: false });
    const allLabels = Array.from(new Set([...uncorrectedOrder, ...correctedOrder]));
    return {
      labels: allLabels.map((id) => fixture.stageNames[id] ?? id),
      uncorrected: allLabels.map((id) => (uncorrectedOrder.includes(id) && uncorrectedStatuses[id] !== 'blocked' ? baseDurations[id] ?? 5 : 0)),
      corrected: allLabels.map((id) => (correctedOrder.includes(id) ? baseDurations[id] ?? 5 : 0)),
    };
  }, [fixture]);

  const handleAdvanceRun = () => {
    setRunStep((s) => Math.min(orderForDisplay.length - 1, s + 1));
    onDirty();
  };
  const handleResetRun = () => setRunStep(0);

  const handleExportJson = () => {
    downloadJson('devops_pipeline_plan.json', {
      variant,
      failureKind: fixture.failureKind,
      repair,
      statuses,
      citedLogIds,
      releaseNote,
    });
  };

  const handleSubmit = () => {
    onSubmit({
      variant,
      stageOrder: repair.stageOrder,
      selectedFix: repair.selectedFix,
      rollbackChosen: repair.rollbackChosen,
      rollbackAvailable: fixture.rollbackAvailable,
      finalStatuses: statuses,
      allGreen,
      citedLogIds,
      releaseNote,
      undoStepsExplored: stepIndex,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10 sm:col-span-2 md:col-span-2">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Root Cause</span>
          <span className="text-sm font-black text-slate-200">{fixture.title}</span>
        </div>
        <div className={`p-4 rounded-2xl border ${revealedAllGreen ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-red-950/20 border-red-500/30'}`}>
          <span className="text-xs font-semibold block mb-1 text-slate-300">Revealed Run</span>
          <span className={`text-xl font-black flex items-center gap-1.5 ${revealedAllGreen ? 'text-emerald-300' : 'text-red-300'}`}>
            {revealedAllGreen ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            {revealedAllGreen ? 'All Green' : 'Blocked'}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">History Step</span>
          <span className="text-xl font-black text-purple-300">{stepIndex}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: pipeline graph + logs */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-purple-400" />
                <span>1. Pipeline Stage Order &amp; Run</span>
              </h2>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={undo} disabled={!canUndo} title="Undo last repair choice"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30 transition-colors">
                  <Undo2 className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={redo} disabled={!canRedo} title="Redo"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30 transition-colors">
                  <Redo2 className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => { reset(); setRunStep(0); onDirty(); }} title="Reset pipeline"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors">
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {repair.stageOrder.map((id, idx) => (
                <div key={id} className="flex items-center gap-2">
                  <div className="flex flex-col">
                    <button type="button" onClick={() => moveStage(idx, -1)} disabled={idx === 0} aria-label={`Move ${fixture.stageNames[id]} up`}
                      className="p-0.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 disabled:opacity-20">
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button type="button" onClick={() => moveStage(idx, 1)} disabled={idx === repair.stageOrder.length - 1} aria-label={`Move ${fixture.stageNames[id]} down`}
                      className="p-0.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 disabled:opacity-20">
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>
                  <div className={`flex-1 p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between ${
                    revealedStatuses[id] === 'passed' ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200' :
                    revealedStatuses[id] === 'failed' ? 'bg-red-950/30 border-red-500/50 text-red-200' :
                    revealedStatuses[id] === 'blocked' ? 'bg-white/5 border-white/10 text-slate-500' :
                    'bg-white/5 border-white/10 text-slate-500 opacity-60'
                  }`}>
                    <span>{idx + 1}. {fixture.stageNames[id] ?? id}</span>
                    <span className="text-[10px] uppercase">{revealedStatuses[id]}</span>
                  </div>
                </div>
              ))}
            </div>

            <SimClock
              label="Pipeline Run"
              step={runStep}
              maxStep={orderForDisplay.length - 1}
              stepLabel={(s) => `Stage ${s + 1}/${orderForDisplay.length}`}
              onAdvance={handleAdvanceRun}
              onReset={handleResetRun}
            />
          </div>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Search className="w-3.5 h-3.5" /><span>Searchable Build Logs (cite evidence)</span>
              </h3>
              <input type="text" placeholder="Search logs..." value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="text-[11px] px-2 py-1 rounded-lg bg-black/40 border border-white/15 text-slate-200" />
            </div>
            <div className="space-y-1.5 max-h-56 overflow-y-auto font-mono text-[11px]">
              {filteredLogs.map((l) => (
                <label key={l.id} className="flex items-start gap-2 p-2 rounded-lg bg-black/30 border border-white/5 cursor-pointer hover:border-purple-500/30">
                  <input type="checkbox" checked={citedLogIds.includes(l.id)} onChange={() => toggleCiteLog(l.id)} className="mt-0.5 accent-purple-500" />
                  <span className={l.level === 'error' ? 'text-red-300' : l.level === 'warn' ? 'text-amber-300' : 'text-slate-300'}>
                    [{fixture.stageNames[l.stageId] ?? l.stageId}] {l.text}
                  </span>
                </label>
              ))}
              {filteredLogs.length === 0 && <p className="text-slate-500 italic p-2">No log lines match your search.</p>}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-2 text-xs">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">Read-Only Config Diff</h3>
            <p className="text-[11px] text-slate-500">{fixture.configDiff.explanation}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[10px]">
              <pre className="p-2 rounded-lg bg-red-950/20 border border-red-500/20 text-red-200 whitespace-pre-wrap">{fixture.configDiff.before}</pre>
              <pre className="p-2 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-emerald-200 whitespace-pre-wrap">{fixture.configDiff.after}</pre>
            </div>
          </div>
        </div>

        {/* Right: repair choices + charts */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <h3 className="text-sm font-extrabold text-white">2. Select Root-Cause Fix</h3>
            <div className="space-y-2">
              {fixture.fixOptions.map((opt) => (
                <button key={opt.id} type="button" onClick={() => selectFix(opt.id)}
                  className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition-colors ${repair.selectedFix === opt.id && !repair.rollbackChosen ? 'bg-purple-500/20 border-purple-500/50 text-purple-200' : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'}`}>
                  {opt.label}
                </button>
              ))}
              <button type="button" onClick={chooseRollback}
                className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition-colors ${repair.rollbackChosen ? 'bg-amber-500/20 border-amber-500/50 text-amber-200' : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'}`}>
                Roll back to the last stable release
              </button>
              {repair.rollbackChosen && !fixture.rollbackAvailable && (
                <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/30 text-red-200 text-[11px] flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{fixture.rollbackUnavailableReason}</span>
                </div>
              )}
            </div>
          </div>

          <ChartFrame
            title="Before/After Pipeline-Stage Timing"
            icon={<ListChecks className="w-4 h-4 text-purple-400" />}
            tableHeaders={['Stage', 'Uncorrected (ms)', 'Corrected (ms)']}
            tableRows={timingChart.labels.map((l, i) => [l, timingChart.uncorrected[i], timingChart.corrected[i]])}
          >
            <TrendLineChart
              labels={timingChart.labels}
              series={[
                { label: 'Uncorrected run', data: timingChart.uncorrected },
                { label: 'Corrected run', data: timingChart.corrected, fill: true },
              ]}
              yLabel="Stage duration (ms, illustrative)"
            />
          </ChartFrame>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">Release Checklist</h3>
            <div className="space-y-1.5">
              {fixture.releaseChecklist.map((c) => {
                const satisfied = statuses[c.prerequisiteStageId] === 'passed';
                return (
                  <div key={c.id} className={`p-2 rounded-lg text-[11px] font-semibold flex items-center gap-2 ${satisfied ? 'bg-emerald-500/10 text-emerald-300' : 'bg-white/5 text-slate-500'}`}>
                    {satisfied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    <span>{c.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-2">
            <label htmlFor="release-note" className="text-xs font-extrabold text-white">Release Note &amp; Post-Incident Reflection</label>
            <textarea id="release-note" rows={3} value={releaseNote}
              onChange={(e) => { setReleaseNote(e.target.value); onDirty(); }}
              placeholder="Explain the root cause, the fix applied, and why rollback was or wasn't the right call..."
              className="w-full text-xs p-3 rounded-xl bg-black/30 border border-white/15 text-slate-200 focus:outline-none focus:border-purple-500/50" />
          </div>

          <button type="button" onClick={handleExportJson}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] font-bold transition-colors">
            <Download className="w-3.5 h-3.5" /><span>Export Pipeline Plan JSON</span>
          </button>

          <button type="button" onClick={handleSubmit}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold transition-all flex items-center justify-center gap-2">
            <Send className="w-4 h-4" />
            <span>Submit Diagnosis</span>
          </button>
        </div>
      </div>
    </div>
  );
}
