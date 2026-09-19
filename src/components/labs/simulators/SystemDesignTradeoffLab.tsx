'use client';

import { useMemo, useState } from 'react';
import { LabScenarioVariant, LabDifficulty } from '@/lib/labs/types';
import { useUndoableState } from '@/lib/labs/useUndoableState';
import { downloadJson } from '@/lib/labs/exportHelper';
import ChartFrame from '@/components/labs/charts/ChartFrame';
import TrendLineChart from '@/components/labs/charts/TrendLineChart';
import CompareBarChart from '@/components/labs/charts/CompareBarChart';
import CompareRadarChart from '@/components/labs/charts/CompareRadarChart';
import SimClock from '@/components/labs/SimClock';
import {
  Undo2,
  Redo2,
  RotateCcw,
  Download,
  FileJson,
  Send,
  Network,
  AlertTriangle,
  CheckCircle2,
  Radar as RadarIcon,
  Layers,
  Cpu,
  Database,
  Zap,
  Camera,
} from 'lucide-react';

interface SimulatorProps {
  scenario?: LabScenarioVariant;
  variant: LabDifficulty;
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

type FailureMode = 'none' | 'cache_down' | 'db_primary_down';

interface Topology {
  cacheEnabled: boolean;
  queueEnabled: boolean;
  appReplicas: number;
  dbReplicas: number;
  legacyDependencyRemoved: boolean;
  injectedFailure: FailureMode;
}

interface LoadStepDef {
  label: string;
  arrivalRps: number;
}

interface Fixture {
  appCapacityPerReplica: number;
  dbCapacityPerReplica: number;
  cacheOffloadRate: number;
  legacyDependencyTax: number;
  queueBufferCapacity: number;
  loadSteps: LoadStepDef[];
  initialTopology: Topology;
  narrative: string;
}

// Three genuinely different traffic/topology narratives per difficulty tier —
// increasing ambiguity (tighter margins, more simultaneous bottlenecks, more
// levers required), not just re-labeled numbers.
const FIXTURES: Record<LabDifficulty, Fixture> = {
  beginner: {
    appCapacityPerReplica: 500,
    dbCapacityPerReplica: 400,
    cacheOffloadRate: 0.6,
    legacyDependencyTax: 0.2,
    queueBufferCapacity: 1500,
    loadSteps: [
      { label: 'Midnight (Zero Traffic)', arrivalRps: 0 },
      { label: 'Early Morning', arrivalRps: 400 },
      { label: 'Mid-Morning Ramp', arrivalRps: 900 },
      { label: 'Midday Peak', arrivalRps: 1400 },
      { label: 'Afternoon Steady', arrivalRps: 1100 },
      { label: 'Evening Taper', arrivalRps: 600 },
      { label: 'Late Night', arrivalRps: 100 },
    ],
    initialTopology: {
      cacheEnabled: true,
      queueEnabled: false,
      appReplicas: 2,
      dbReplicas: 1,
      legacyDependencyRemoved: false,
      injectedFailure: 'none',
    },
    narrative: 'A single-region assessment platform preparing for its first public exam window.',
  },
  intermediate: {
    appCapacityPerReplica: 500,
    dbCapacityPerReplica: 400,
    cacheOffloadRate: 0.5,
    legacyDependencyTax: 0.25,
    queueBufferCapacity: 1200,
    loadSteps: [
      { label: 'Zero Traffic', arrivalRps: 0 },
      { label: 'Ramp-Up', arrivalRps: 700 },
      { label: 'Pre-Event Surge', arrivalRps: 1600 },
      { label: 'Flash Registration Peak', arrivalRps: 2600 },
      { label: 'Post-Peak Cooldown', arrivalRps: 1800 },
      { label: 'Late Recovery', arrivalRps: 900 },
      { label: 'Night', arrivalRps: 150 },
    ],
    initialTopology: {
      cacheEnabled: true,
      queueEnabled: false,
      appReplicas: 3,
      dbReplicas: 2,
      legacyDependencyRemoved: false,
      injectedFailure: 'none',
    },
    narrative: 'A national scholarship exam pushes registration traffic into one flash surge.',
  },
  challenge: {
    appCapacityPerReplica: 500,
    dbCapacityPerReplica: 400,
    cacheOffloadRate: 0.55,
    legacyDependencyTax: 0.3,
    queueBufferCapacity: 1000,
    loadSteps: [
      { label: 'Zero Traffic', arrivalRps: 0 },
      { label: 'Steady Baseline', arrivalRps: 900 },
      { label: 'Regional Failover Event', arrivalRps: 2100 },
      { label: 'Global Peak', arrivalRps: 3400 },
      { label: 'Secondary Spike (Retry Storm)', arrivalRps: 3900 },
      { label: 'Decay', arrivalRps: 2000 },
      { label: 'Night Trickle', arrivalRps: 300 },
    ],
    initialTopology: {
      cacheEnabled: true,
      queueEnabled: true,
      appReplicas: 4,
      dbReplicas: 2,
      legacyDependencyRemoved: false,
      injectedFailure: 'none',
    },
    narrative: 'A multi-region assessment platform absorbs a global peak plus a retry storm during a regional failover.',
  },
};

interface SimRow {
  step: number;
  label: string;
  arrivalRps: number;
  appCapacity: number;
  dbCapacity: number;
  appUtilization: number;
  dbUtilization: number;
  backlog: number;
  dropped: number;
}

// Transparent teaching equations: utilization = arrival / configured capacity.
// When demand exceeds the combined system capacity, the excess accumulates as
// backlog (if a queue is present) or is dropped immediately (if not).
function simulateRun(fixture: Fixture, topology: Topology, uptoStep: number): SimRow[] {
  const rows: SimRow[] = [];
  let backlog = 0;
  const lastStep = Math.min(uptoStep, fixture.loadSteps.length - 1);
  for (let i = 0; i <= lastStep; i++) {
    const arrival = fixture.loadSteps[i].arrivalRps;
    const depMultiplier = topology.legacyDependencyRemoved ? 1 : 1 - fixture.legacyDependencyTax;
    const appCapacity = topology.appReplicas * fixture.appCapacityPerReplica * depMultiplier;
    const cacheHit = topology.cacheEnabled && topology.injectedFailure !== 'cache_down' ? fixture.cacheOffloadRate : 0;
    const dbCapacity = topology.dbReplicas * fixture.dbCapacityPerReplica * (topology.injectedFailure === 'db_primary_down' ? 0.3 : 1);
    const dbDemand = arrival * (1 - cacheHit);
    const dbCapacityAsArrival = cacheHit < 1 ? dbCapacity / (1 - cacheHit) : Infinity;
    const systemCapacity = Math.min(appCapacity, dbCapacityAsArrival);
    const excess = arrival - systemCapacity;

    if (topology.queueEnabled) {
      backlog = Math.max(0, backlog + excess);
    } else {
      backlog = Math.max(0, excess);
    }
    const dropped = topology.queueEnabled ? Math.max(0, backlog - fixture.queueBufferCapacity) : Math.max(0, excess);
    if (topology.queueEnabled) backlog = Math.min(backlog, fixture.queueBufferCapacity);

    rows.push({
      step: i,
      label: fixture.loadSteps[i].label,
      arrivalRps: arrival,
      appCapacity,
      dbCapacity,
      appUtilization: appCapacity > 0 ? arrival / appCapacity : 0,
      dbUtilization: dbCapacity > 0 ? dbDemand / dbCapacity : 0,
      backlog,
      dropped,
    });
  }
  return rows;
}

interface ScenarioSnapshot {
  topology: Topology;
  rows: SimRow[];
  capturedAtStep: number;
}

function radarScores(topology: Topology, rows: SimRow[], fixture: Fixture) {
  const last = rows[rows.length - 1];
  const redundancyRaw = (topology.cacheEnabled ? 1 : 0) + (topology.queueEnabled ? 1 : 0) + (topology.appReplicas >= 3 ? 1 : 0) + (topology.dbReplicas >= 2 ? 1 : 0);
  const totalNodes = topology.appReplicas + topology.dbReplicas + (topology.cacheEnabled ? 1 : 0) + (topology.queueEnabled ? 1 : 0);
  const maxUtil = last ? Math.max(last.appUtilization, last.dbUtilization) : 0;
  return {
    redundancy: Math.round(redundancyRaw * 2.5 * 10) / 10,
    costEfficiency: Math.round(Math.max(0, 10 - totalNodes) * 10) / 10,
    latencyHeadroom: Math.round(Math.max(0, Math.min(10, 10 - maxUtil * 10)) * 10) / 10,
    backlogResilience: Math.round(Math.max(0, Math.min(10, 10 - (last ? last.backlog / fixture.queueBufferCapacity : 0) * 10)) * 10) / 10,
  };
}

export default function SystemDesignTradeoffLab({ variant, onDirty, onSubmit }: SimulatorProps) {
  const fixture = FIXTURES[variant];
  const { state: topology, set: setTopology, undo, redo, reset, canUndo, canRedo, stepIndex, history } = useUndoableState<Topology>(fixture.initialTopology);
  const [step, setStep] = useState(0);
  const [savedScenario, setSavedScenario] = useState<ScenarioSnapshot | null>(null);
  const [tradeoffRecord, setTradeoffRecord] = useState<string>('');

  const update = (patch: Partial<Topology>) => {
    setTopology((prev) => ({ ...prev, ...patch }));
    onDirty();
  };

  const rows = useMemo(() => simulateRun(fixture, topology, step), [fixture, topology, step]);
  const currentRow = rows[rows.length - 1];

  const dependencyRemovalTested = useMemo(
    () => history.some((t, i) => i > 0 && t.legacyDependencyRemoved !== history[i - 1].legacyDependencyRemoved),
    [history]
  );
  const failureInjectionTested = useMemo(
    () => history.some((t, i) => i > 0 && t.injectedFailure !== history[i - 1].injectedFailure),
    [history]
  );

  const currentRadar = useMemo(() => radarScores(topology, rows, fixture), [topology, rows, fixture]);
  const savedRadar = useMemo(
    () => (savedScenario ? radarScores(savedScenario.topology, savedScenario.rows, fixture) : null),
    [savedScenario, fixture]
  );

  const handleCaptureScenario = () => {
    setSavedScenario({ topology: { ...topology }, rows, capturedAtStep: step });
    onDirty();
  };

  const handleAdvance = () => {
    setStep((s) => Math.min(fixture.loadSteps.length - 1, s + 1));
    onDirty();
  };
  const handleResetClock = () => {
    setStep(0);
  };

  const handleExportJson = () => {
    downloadJson('system_design_topology.json', {
      variant,
      topology,
      loadSteps: fixture.loadSteps,
      simRows: rows,
      savedScenario,
    });
  };

  const handleSubmit = () => {
    onSubmit({
      topology,
      finalStep: step,
      simRows: rows,
      savedScenario,
      radarComparisonCurrent: currentRadar,
      radarComparisonSaved: savedRadar,
      dependencyRemovalTested,
      failureInjectionTested,
      undoStepsExplored: stepIndex,
      tradeoffRecord,
    });
  };

  const isHealthy = currentRow ? currentRow.dropped === 0 : false;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">App Cluster Utilization</span>
          <span className={`text-xl font-black ${currentRow && currentRow.appUtilization > 0.9 ? 'text-red-400' : 'text-purple-200'}`}>
            {currentRow ? Math.round(currentRow.appUtilization * 100) : 0}%
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">{currentRow?.arrivalRps ?? 0} RPS / {Math.round(currentRow?.appCapacity ?? 0)} cap</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Database Utilization</span>
          <span className={`text-xl font-black ${currentRow && currentRow.dbUtilization > 0.9 ? 'text-red-400' : 'text-purple-200'}`}>
            {currentRow ? Math.round(currentRow.dbUtilization * 100) : 0}%
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">{topology.cacheEnabled ? `${Math.round(fixture.cacheOffloadRate * 100)}% cache offload` : 'Direct DB pressure'}</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Queue Backlog</span>
          <span className="text-xl font-black text-amber-300">{Math.round(currentRow?.backlog ?? 0)} rps</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">{topology.queueEnabled ? `Buffer cap ${fixture.queueBufferCapacity}` : 'No queue buffer'}</span>
        </div>
        <div className={`p-4 rounded-2xl border ${isHealthy ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-red-950/20 border-red-500/30'}`}>
          <span className="text-xs font-semibold block mb-1 flex items-center gap-1.5">
            {isHealthy ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <AlertTriangle className="w-3.5 h-3.5 text-red-400" />}
            <span className={isHealthy ? 'text-emerald-300' : 'text-red-300'}>Scenario Checks</span>
          </span>
          <span className={`text-xl font-black ${isHealthy ? 'text-emerald-300' : 'text-red-300'}`}>{Math.round(currentRow?.dropped ?? 0)} dropped</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Assumption-based simulation, not a real load test</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Controls */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Network className="w-4 h-4 text-purple-400" />
                <span>1. Topology &amp; Failure Injection</span>
              </h2>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={undo} disabled={!canUndo} title="Undo last topology change"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30 transition-colors">
                  <Undo2 className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={redo} disabled={!canRedo} title="Redo"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30 transition-colors">
                  <Redo2 className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => { reset(); onDirty(); }} title="Reset topology"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors">
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <p className="text-[11px] text-slate-500">{fixture.narrative}</p>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-purple-400" />App Server Replicas ({fixture.appCapacityPerReplica} rps each)</span>
                  <span className="font-mono text-purple-300 font-bold">{topology.appReplicas} nodes</span>
                </div>
                <input type="range" min={1} max={8} value={topology.appReplicas}
                  onChange={(e) => update({ appReplicas: parseInt(e.target.value, 10) })}
                  className="w-full accent-purple-500" />
              </div>
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5 text-purple-400" />Database Read Replicas ({fixture.dbCapacityPerReplica} rps each)</span>
                  <span className="font-mono text-purple-300 font-bold">{topology.dbReplicas} replicas</span>
                </div>
                <input type="range" min={0} max={6} value={topology.dbReplicas}
                  onChange={(e) => update({ dbReplicas: parseInt(e.target.value, 10) })}
                  className="w-full accent-purple-500" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button type="button" onClick={() => update({ cacheEnabled: !topology.cacheEnabled })}
                  className={`p-2.5 rounded-xl border text-left text-[11px] font-bold transition-all ${topology.cacheEnabled ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                  Cache Layer: {topology.cacheEnabled ? 'Enabled' : 'Disabled'}
                </button>
                <button type="button" onClick={() => update({ queueEnabled: !topology.queueEnabled })}
                  className={`p-2.5 rounded-xl border text-left text-[11px] font-bold transition-all ${topology.queueEnabled ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                  Message Queue: {topology.queueEnabled ? 'Enabled' : 'Disabled'}
                </button>
                <button type="button" onClick={() => update({ legacyDependencyRemoved: !topology.legacyDependencyRemoved })}
                  className={`p-2.5 rounded-xl border text-left text-[11px] font-bold transition-all sm:col-span-2 ${topology.legacyDependencyRemoved ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                  Legacy Synchronous Enrichment Dependency: {topology.legacyDependencyRemoved ? 'Removed (async)' : `Present (-${Math.round(fixture.legacyDependencyTax * 100)}% app throughput)`}
                </button>
              </div>

              <div className="pt-2 border-t border-white/10">
                <label className="text-slate-400 block mb-1 flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" />Chaos Fault Injection</label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { id: 'none', label: 'Healthy' },
                    { id: 'cache_down', label: 'Kill Cache' },
                    { id: 'db_primary_down', label: 'Primary DB Fail' },
                  ] as { id: FailureMode; label: string }[]).map((f) => (
                    <button key={f.id} type="button" onClick={() => update({ injectedFailure: f.id })}
                      className={`py-1.5 rounded-lg border text-[10px] font-bold transition-colors ${topology.injectedFailure === f.id ? 'bg-red-500/20 border-red-500/40 text-red-300' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>2. Traffic Step Simulation</span>
            </h3>
            <SimClock
              label="Load Profile"
              step={step}
              maxStep={fixture.loadSteps.length - 1}
              stepLabel={(s) => fixture.loadSteps[s]?.label ?? `Step ${s}`}
              onAdvance={handleAdvance}
              onReset={handleResetClock}
            />
            <p className="text-[10px] text-slate-500">Capacity and latency figures are scenario assumptions for teaching purposes only — never evidence of a real load test.</p>
          </div>
        </div>

        {/* Right: Visualizations */}
        <div className="lg:col-span-7 space-y-4">
          <ChartFrame
            title="Queue-Depth Trend (Current vs Saved Scenario)"
            icon={<Layers className="w-4 h-4 text-purple-400" />}
            tableHeaders={['Step', 'Current Backlog', 'Saved Backlog']}
            tableRows={rows.map((r, i) => [r.label, Math.round(r.backlog), savedScenario ? Math.round(savedScenario.rows[i]?.backlog ?? 0) : 0])}
          >
            <TrendLineChart
              labels={rows.map((r) => r.label)}
              series={[
                { label: 'Current design', data: rows.map((r) => Math.round(r.backlog)), fill: true },
                ...(savedScenario ? [{ label: 'Saved scenario', data: rows.map((_, i) => Math.round(savedScenario.rows[i]?.backlog ?? 0)) }] : []),
              ]}
              yLabel="Backlog (rps)"
            />
          </ChartFrame>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ChartFrame
              title="Utilization by Node (Current Step)"
              icon={<Cpu className="w-4 h-4 text-purple-400" />}
              tableHeaders={['Node', 'Utilization %']}
              tableRows={[['App Cluster', Math.round((currentRow?.appUtilization ?? 0) * 100)], ['Database', Math.round((currentRow?.dbUtilization ?? 0) * 100)]]}
            >
              <CompareBarChart
                labels={['App Cluster', 'Database']}
                series={[{
                  label: 'Utilization %',
                  data: [Math.round((currentRow?.appUtilization ?? 0) * 100), Math.round((currentRow?.dbUtilization ?? 0) * 100)],
                  statusOverride: [
                    (currentRow?.appUtilization ?? 0) > 1 ? 'critical' : null,
                    (currentRow?.dbUtilization ?? 0) > 1 ? 'critical' : null,
                  ],
                }]}
                yLabel="Utilization %"
              />
            </ChartFrame>

            <ChartFrame
              title="Bottleneck / Redundancy Tradeoff"
              icon={<RadarIcon className="w-4 h-4 text-purple-400" />}
              tableHeaders={['Axis', 'Current', 'Saved']}
              tableRows={[
                ['Redundancy', currentRadar.redundancy, savedRadar?.redundancy ?? '—'],
                ['Cost Efficiency', currentRadar.costEfficiency, savedRadar?.costEfficiency ?? '—'],
                ['Latency Headroom', currentRadar.latencyHeadroom, savedRadar?.latencyHeadroom ?? '—'],
                ['Backlog Resilience', currentRadar.backlogResilience, savedRadar?.backlogResilience ?? '—'],
              ]}
            >
              <CompareRadarChart
                axes={['Redundancy', 'Cost Efficiency', 'Latency Headroom', 'Backlog Resilience']}
                series={[
                  { label: 'Current design', data: [currentRadar.redundancy, currentRadar.costEfficiency, currentRadar.latencyHeadroom, currentRadar.backlogResilience] },
                  ...(savedRadar ? [{ label: 'Saved scenario', data: [savedRadar.redundancy, savedRadar.costEfficiency, savedRadar.latencyHeadroom, savedRadar.backlogResilience] }] : []),
                ]}
                max={10}
              />
            </ChartFrame>
          </div>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label htmlFor="tradeoff-record" className="text-xs font-extrabold text-white flex items-center gap-2">
                <FileJson className="w-3.5 h-3.5 text-purple-400" />
                <span>3. Tradeoff Record</span>
              </label>
              <button type="button" onClick={handleCaptureScenario}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-bold text-slate-300 transition-colors">
                <Camera className="w-3 h-3" /><span>Save Scenario for Comparison</span>
              </button>
            </div>
            <textarea id="tradeoff-record" rows={3} value={tradeoffRecord}
              onChange={(e) => { setTradeoffRecord(e.target.value); onDirty(); }}
              className="w-full text-xs p-3 rounded-xl bg-black/30 border border-white/15 text-slate-200 focus:outline-none focus:border-purple-500/50" />
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={handleExportJson}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] font-bold transition-colors">
              <Download className="w-3.5 h-3.5" /><span>Export Topology JSON</span>
            </button>
          </div>

          <button type="button" onClick={handleSubmit}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold transition-all flex items-center justify-center gap-2">
            <Send className="w-4 h-4" />
            <span>Submit System Design</span>
          </button>
        </div>
      </div>
    </div>
  );
}
