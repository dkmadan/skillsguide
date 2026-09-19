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
  Activity,
  AlertTriangle,
  CheckCircle2,
  MessageSquare,
  Network,
  ClipboardList,
} from 'lucide-react';

interface SimulatorProps {
  scenario?: LabScenarioVariant;
  variant: LabDifficulty;
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

interface Hypothesis { id: string; label: string; correct: boolean; }
interface Mitigation { id: string; label: string; correct: boolean; }
interface LogEntry { id: string; text: string; distinguishing?: boolean; misleading?: boolean; }
interface TimelinePoint {
  step: number;
  timeLabel: string;
  alert?: string;
  degraded: { latencyMs: number; errorRatePct: number; cpuPct: number };
  logs: LogEntry[];
}
interface DependencyEdge { service: string; dependsOn: string; affected: boolean; }
interface Fixture {
  title: string;
  hypotheses: Hypothesis[];
  mitigations: Mitigation[];
  timeline: TimelinePoint[];
  branchStep: number; // earliest step recovery can be observed
  recovered: { latencyMs: number; errorRatePct: number; cpuPct: number };
  dependencyMap: DependencyEdge[];
}

const STATUS_TEMPLATES = [
  { id: 'investigating', label: 'Investigating', text: 'Investigating a P1 incident. No confirmed root cause yet — next update in 15 minutes.' },
  { id: 'probable_cause', label: 'Probable Cause', text: 'Probable cause identified. Mitigation being prepared.' },
  { id: 'mitigating', label: 'Mitigating', text: 'Mitigation applied. Monitoring metrics for recovery.' },
  { id: 'resolved', label: 'Resolved', text: 'Incident resolved. Metrics confirmed back to baseline. Post-incident review to follow.' },
];

// Three distinct incidents, each with one misleading alert and one genuine
// root cause, plus authored distinguishing evidence — increasing ambiguity
// per tier (more red-herring log lines, a later branch point).
const FIXTURES: Record<LabDifficulty, Fixture> = {
  beginner: {
    title: 'Search latency SLO breach after a canary deploy',
    hypotheses: [
      { id: 'cdn_edge', label: 'CDN edge node latency spike', correct: false },
      { id: 'n1_query', label: 'Canary release introduced an N+1 database query', correct: true },
    ],
    mitigations: [
      { id: 'scale_cdn', label: 'Scale out CDN edge nodes', correct: false },
      { id: 'restart_pods', label: 'Restart API pods', correct: false },
      { id: 'rollback_canary', label: 'Roll back canary release v482', correct: true },
    ],
    branchStep: 4,
    recovered: { latencyMs: 62, errorRatePct: 0.1, cpuPct: 21 },
    dependencyMap: [
      { service: 'edge-cdn', dependsOn: 'origin-api', affected: false },
      { service: 'search-api', dependsOn: 'search-db', affected: false },
      { service: 'search-api', dependsOn: 'canary v482 code path', affected: true },
    ],
    timeline: [
      { step: 0, timeLabel: '10:00 UTC', degraded: { latencyMs: 60, errorRatePct: 0.1, cpuPct: 20 }, logs: [{ id: 'b0', text: 'Baseline: all systems nominal.' }] },
      { step: 1, timeLabel: '10:05 UTC', alert: 'CDN edge latency spike detected (us-east-2)', degraded: { latencyMs: 220, errorRatePct: 0.3, cpuPct: 35 }, logs: [{ id: 'b1', text: 'ALERT: CDN edge latency spike detected (us-east-2).', misleading: true }] },
      { step: 2, timeLabel: '10:10 UTC', degraded: { latencyMs: 900, errorRatePct: 2.1, cpuPct: 55 }, logs: [{ id: 'b2', text: 'Deploy log: canary v482 shipped to 10% of traffic at 10:04 UTC.', distinguishing: true }] },
      { step: 3, timeLabel: '10:15 UTC', degraded: { latencyMs: 1450, errorRatePct: 4.2, cpuPct: 71 }, logs: [{ id: 'b3', text: 'APM trace: /search issuing 40 sequential DB queries per request (N+1 pattern), regression traced to v482 diff.', distinguishing: true }] },
      { step: 4, timeLabel: '10:20 UTC', degraded: { latencyMs: 1500, errorRatePct: 4.5, cpuPct: 74 }, logs: [{ id: 'b4', text: 'CDN edge latency spike self-resolved at 10:12 UTC — unrelated to current API latency.', distinguishing: true }] },
      { step: 5, timeLabel: '10:25 UTC', degraded: { latencyMs: 1520, errorRatePct: 4.6, cpuPct: 75 }, logs: [{ id: 'b5', text: 'Latency remains critical. Error budget draining.' }] },
      { step: 6, timeLabel: '10:30 UTC', degraded: { latencyMs: 1500, errorRatePct: 4.4, cpuPct: 73 }, logs: [{ id: 'b6', text: 'No change without a forward fix or rollback of v482.' }] },
    ],
  },
  intermediate: {
    title: 'Checkout errors during a downstream payment gateway timeout',
    hypotheses: [
      { id: 'db_cpu', label: 'Database CPU exhaustion', correct: false },
      { id: 'gateway_timeout', label: 'Downstream payment gateway is timing out', correct: true },
    ],
    mitigations: [
      { id: 'add_read_replica', label: 'Add a database read replica', correct: false },
      { id: 'increase_pool', label: 'Increase the DB connection pool size', correct: false },
      { id: 'circuit_breaker', label: 'Enable a circuit breaker + fallback queue for gateway calls', correct: true },
    ],
    branchStep: 4,
    recovered: { latencyMs: 90, errorRatePct: 0.2, cpuPct: 30 },
    dependencyMap: [
      { service: 'checkout-api', dependsOn: 'orders-db', affected: false },
      { service: 'checkout-api', dependsOn: 'payment-gateway (external)', affected: true },
      { service: 'orders-db', dependsOn: 'connection pool', affected: false },
    ],
    timeline: [
      { step: 0, timeLabel: '14:00 UTC', degraded: { latencyMs: 80, errorRatePct: 0.2, cpuPct: 25 }, logs: [{ id: 'i0', text: 'Baseline: all systems nominal.' }] },
      { step: 1, timeLabel: '14:05 UTC', alert: 'Database CPU crossed 90% threshold', degraded: { latencyMs: 500, errorRatePct: 1.5, cpuPct: 92 }, logs: [{ id: 'i1', text: 'ALERT: orders-db CPU at 92% — connection pool near saturation.', misleading: true }] },
      { step: 2, timeLabel: '14:10 UTC', degraded: { latencyMs: 2200, errorRatePct: 6.0, cpuPct: 95 }, logs: [{ id: 'i2', text: 'Trace: checkout-api threads blocked waiting on payment-gateway response (avg wait 8.2s).', distinguishing: true }] },
      { step: 3, timeLabel: '14:15 UTC', degraded: { latencyMs: 3400, errorRatePct: 9.5, cpuPct: 97 }, logs: [{ id: 'i3', text: 'Payment gateway status page: elevated latency on their end, incident acknowledged externally.', distinguishing: true }] },
      { step: 4, timeLabel: '14:20 UTC', degraded: { latencyMs: 3500, errorRatePct: 9.8, cpuPct: 97 }, logs: [{ id: 'i4', text: 'DB CPU is a symptom: queries are fast in isolation, threads are just piling up waiting on the gateway.', distinguishing: true }] },
      { step: 5, timeLabel: '14:25 UTC', degraded: { latencyMs: 3550, errorRatePct: 10.0, cpuPct: 98 }, logs: [{ id: 'i5', text: 'Checkout error rate still climbing.' }] },
      { step: 6, timeLabel: '14:30 UTC', degraded: { latencyMs: 3500, errorRatePct: 9.9, cpuPct: 98 }, logs: [{ id: 'i6', text: 'No change without isolating the gateway dependency.' }] },
    ],
  },
  challenge: {
    title: 'Retry-storm traffic surge masking an expired internal TLS certificate',
    hypotheses: [
      { id: 'ddos', label: 'Volumetric traffic surge / DDoS', correct: false },
      { id: 'expired_cert', label: 'Expired TLS certificate on the service mesh sidecar', correct: true },
    ],
    mitigations: [
      { id: 'edge_rate_limit', label: 'Enable DDoS protection / rate limiting at the edge', correct: false },
      { id: 'scale_pods', label: 'Scale out application pods', correct: false },
      { id: 'rotate_cert', label: 'Rotate and redeploy the expired TLS certificate on the mesh sidecar', correct: true },
    ],
    branchStep: 5,
    recovered: { latencyMs: 55, errorRatePct: 0.1, cpuPct: 24 },
    dependencyMap: [
      { service: 'api-gateway', dependsOn: 'service-mesh sidecar', affected: true },
      { service: 'service-mesh sidecar', dependsOn: 'internal TLS cert', affected: true },
      { service: 'api-gateway', dependsOn: 'edge network', affected: false },
    ],
    timeline: [
      { step: 0, timeLabel: '02:00 UTC', degraded: { latencyMs: 58, errorRatePct: 0.1, cpuPct: 22 }, logs: [{ id: 'c0', text: 'Baseline: all systems nominal.' }] },
      { step: 1, timeLabel: '02:05 UTC', alert: 'Inbound request volume up 6x in 5 minutes', degraded: { latencyMs: 300, errorRatePct: 3.0, cpuPct: 60 }, logs: [{ id: 'c1', text: 'ALERT: inbound request volume up 6x — possible volumetric attack.', misleading: true }] },
      { step: 2, timeLabel: '02:10 UTC', degraded: { latencyMs: 1200, errorRatePct: 18.0, cpuPct: 80 }, logs: [{ id: 'c2', text: 'Mesh sidecar logs: TLS handshake failures — certificate for internal-mesh.svc expired at 01:58 UTC.', distinguishing: true }] },
      { step: 3, timeLabel: '02:15 UTC', degraded: { latencyMs: 1800, errorRatePct: 32.0, cpuPct: 88 }, logs: [{ id: 'c3', text: 'Client SDKs auto-retry failed TLS handshakes 5x with backoff — this retry storm is the source of the traffic spike, not external users.', distinguishing: true }] },
      { step: 4, timeLabel: '02:20 UTC', degraded: { latencyMs: 2000, errorRatePct: 38.0, cpuPct: 90 }, logs: [{ id: 'c4', text: 'Unique client IP count is normal for this hour — traffic pattern is inconsistent with a real DDoS.', distinguishing: true }] },
      { step: 5, timeLabel: '02:25 UTC', degraded: { latencyMs: 2050, errorRatePct: 39.0, cpuPct: 90 }, logs: [{ id: 'c5', text: 'Handshake failure rate still climbing.' }] },
      { step: 6, timeLabel: '02:30 UTC', degraded: { latencyMs: 2000, errorRatePct: 38.0, cpuPct: 90 }, logs: [{ id: 'c6', text: 'No change without renewing the expired certificate.' }] },
    ],
  },
};

interface DecisionState {
  selectedHypothesis: string;
  selectedMitigation: string;
  collectedEvidenceIds: string[];
  followUpSelected: string[];
}

const FOLLOW_UP_CANDIDATES = [
  'Add an automated pre-deploy check for this failure class.',
  'Add a synthetic monitor that would have caught this sooner.',
  'Document the misleading alert so future responders discount it faster.',
  'Schedule a blameless post-incident review with all responders.',
];

export default function ProductionIncidentRoomLab({ variant, onDirty, onSubmit }: SimulatorProps) {
  const fixture = FIXTURES[variant];
  const initial: DecisionState = { selectedHypothesis: '', selectedMitigation: '', collectedEvidenceIds: [], followUpSelected: [] };
  const { state, set, undo, redo, reset, canUndo, canRedo, stepIndex } = useUndoableState<DecisionState>(initial);
  const [currentStep, setCurrentStep] = useState(0);
  const [statusUpdates, setStatusUpdates] = useState<{ id: string; simStep: number; templateId: string; text: string }[]>([]);
  const [incidentReport, setIncidentReport] = useState('');
  const [logSearch, setLogSearch] = useState('');

  const resolvedCorrectly = state.selectedHypothesis === fixture.hypotheses.find((h) => h.correct)?.id &&
    state.selectedMitigation === fixture.mitigations.find((m) => m.correct)?.id;
  const recoveryStep = resolvedCorrectly ? fixture.branchStep : Infinity;

  const revealed = fixture.timeline.slice(0, currentStep + 1);
  const metricsAt = (point: TimelinePoint) => (point.step >= recoveryStep ? fixture.recovered : point.degraded);

  const update = (patch: Partial<DecisionState>) => {
    set((prev) => ({ ...prev, ...patch }));
    onDirty();
  };

  const toggleEvidence = (id: string) => {
    update({ collectedEvidenceIds: state.collectedEvidenceIds.includes(id) ? state.collectedEvidenceIds.filter((x) => x !== id) : [...state.collectedEvidenceIds, id] });
  };
  const toggleFollowUp = (text: string) => {
    update({ followUpSelected: state.followUpSelected.includes(text) ? state.followUpSelected.filter((x) => x !== text) : [...state.followUpSelected, text] });
  };

  const postStatusUpdate = (templateId: string) => {
    const tpl = STATUS_TEMPLATES.find((t) => t.id === templateId);
    if (!tpl) return;
    setStatusUpdates((prev) => [...prev, { id: `${templateId}_${prev.length}`, simStep: currentStep, templateId, text: tpl.text }]);
    onDirty();
  };

  const allLogs = useMemo(() => revealed.flatMap((p) => p.logs.map((l) => ({ ...l, timeLabel: p.timeLabel }))), [revealed]);
  const filteredLogs = allLogs.filter((l) => l.text.toLowerCase().includes(logSearch.toLowerCase()));

  const latencyChart = { labels: revealed.map((p) => p.timeLabel), data: revealed.map((p) => metricsAt(p).latencyMs) };
  const healthChart = {
    labels: revealed.map((p) => p.timeLabel),
    error: revealed.map((p) => metricsAt(p).errorRatePct),
    cpu: revealed.map((p) => metricsAt(p).cpuPct),
  };

  const isCurrentlyRecovered = currentStep >= recoveryStep;
  const prematureResolution = statusUpdates.some((u) => u.templateId === 'resolved' && u.simStep < recoveryStep);

  const handleAdvance = () => { setCurrentStep((s) => Math.min(fixture.timeline.length - 1, s + 1)); onDirty(); };
  const handleResetClock = () => setCurrentStep(0);

  const handleExportJson = () => {
    downloadJson('sre_incident_report.json', {
      variant,
      title: fixture.title,
      decisions: state,
      statusUpdates,
      incidentReport,
      currentStep,
      isCurrentlyRecovered,
    });
  };

  const handleSubmit = () => {
    onSubmit({
      variant,
      selectedHypothesis: state.selectedHypothesis,
      selectedMitigation: state.selectedMitigation,
      collectedEvidenceIds: state.collectedEvidenceIds,
      followUpItems: state.followUpSelected,
      statusUpdates,
      incidentReport,
      currentStep,
      isResolved: isCurrentlyRecovered,
      undoStepsExplored: stepIndex,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10 sm:col-span-2">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Incident</span>
          <span className="text-sm font-black text-slate-200">{fixture.title}</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">P99 Latency</span>
          <span className={`text-xl font-black ${isCurrentlyRecovered ? 'text-emerald-300' : 'text-red-400'}`}>{Math.round(revealed[revealed.length - 1] ? metricsAt(revealed[revealed.length - 1]).latencyMs : 0)}ms</span>
        </div>
        <div className={`p-4 rounded-2xl border ${isCurrentlyRecovered ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-amber-950/20 border-amber-500/30'}`}>
          <span className="text-xs font-semibold block mb-1 text-slate-300">Incident State</span>
          <span className={`text-sm font-black ${isCurrentlyRecovered ? 'text-emerald-300' : 'text-amber-300'}`}>{isCurrentlyRecovered ? 'RESOLVED' : 'ACTIVE'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: metrics, logs, dependency map */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-purple-400" /><span>Incident Clock</span>
            </h3>
            <SimClock
              label="Simulated Time"
              step={currentStep}
              maxStep={fixture.timeline.length - 1}
              stepLabel={(s) => fixture.timeline[s]?.timeLabel ?? `Step ${s}`}
              onAdvance={handleAdvance}
              onReset={handleResetClock}
            />
            {revealed[revealed.length - 1]?.alert && (
              <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200 text-[11px] flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" /><span>{revealed[revealed.length - 1]?.alert}</span>
              </div>
            )}
          </div>

          <ChartFrame
            title="Latency Over Incident Timeline"
            icon={<Activity className="w-4 h-4 text-purple-400" />}
            tableHeaders={['Time', 'Latency (ms)']}
            tableRows={latencyChart.labels.map((l, i) => [l, latencyChart.data[i]])}
          >
            <TrendLineChart labels={latencyChart.labels} series={[{ label: 'P99 Latency (ms)', data: latencyChart.data, fill: true }]} yLabel="ms" />
          </ChartFrame>

          <ChartFrame
            title="Error Rate & CPU Over Incident Timeline"
            icon={<Activity className="w-4 h-4 text-purple-400" />}
            tableHeaders={['Time', 'Error Rate %', 'CPU %']}
            tableRows={healthChart.labels.map((l, i) => [l, healthChart.error[i], healthChart.cpu[i]])}
          >
            <TrendLineChart
              labels={healthChart.labels}
              series={[
                { label: 'Error Rate %', data: healthChart.error },
                { label: 'CPU %', data: healthChart.cpu },
              ]}
              yLabel="%"
            />
          </ChartFrame>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Search className="w-3.5 h-3.5" /><span>Evidence Notebook (collect distinguishing evidence)</span>
              </h3>
              <input type="text" placeholder="Filter logs..." value={logSearch} onChange={(e) => setLogSearch(e.target.value)}
                className="text-[11px] px-2 py-1 rounded-lg bg-black/40 border border-white/15 text-slate-200" />
            </div>
            <div className="space-y-1.5 max-h-56 overflow-y-auto font-mono text-[11px]">
              {filteredLogs.map((l) => (
                <label key={l.id} className="flex items-start gap-2 p-2 rounded-lg bg-black/30 border border-white/5 cursor-pointer hover:border-purple-500/30">
                  <input type="checkbox" checked={state.collectedEvidenceIds.includes(l.id)} onChange={() => toggleEvidence(l.id)} className="mt-0.5 accent-purple-500" />
                  <span className={l.misleading ? 'text-amber-300' : l.distinguishing ? 'text-emerald-300' : 'text-slate-300'}>[{l.timeLabel}] {l.text}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Network className="w-3.5 h-3.5" /><span>Dependency Map</span>
            </h3>
            <div className="space-y-1.5">
              {fixture.dependencyMap.map((d, i) => (
                <div key={i} className={`p-2 rounded-lg text-[11px] font-mono flex items-center justify-between ${d.affected ? 'bg-red-950/20 border border-red-500/30 text-red-200' : 'bg-white/5 border border-white/10 text-slate-400'}`}>
                  <span>{d.service} → {d.dependsOn}</span>
                  {d.affected && <span className="text-[9px] font-bold uppercase">Implicated</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: decisions */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-sm font-extrabold text-white">Incident Commander Decisions</h3>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={undo} disabled={!canUndo} title="Undo last decision"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30 transition-colors">
                  <Undo2 className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={redo} disabled={!canRedo} title="Redo"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30 transition-colors">
                  <Redo2 className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => { reset(); onDirty(); }} title="Reset decisions"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors">
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Root Cause Hypothesis</label>
              <div className="space-y-1.5">
                {fixture.hypotheses.map((h) => (
                  <button key={h.id} type="button" onClick={() => update({ selectedHypothesis: h.id })}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs transition-colors ${state.selectedHypothesis === h.id ? 'bg-purple-500/20 border-purple-500/50 text-purple-200 font-semibold' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                    {h.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Apply Mitigation</label>
              <div className="space-y-1.5">
                {fixture.mitigations.map((m) => (
                  <button key={m.id} type="button" onClick={() => update({ selectedMitigation: m.id })}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs transition-colors ${state.selectedMitigation === m.id ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200 font-semibold' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5" /><span>Status Update Templates (safe escalation)</span>
            </h3>
            <div className="grid grid-cols-2 gap-1.5">
              {STATUS_TEMPLATES.map((t) => (
                <button key={t.id} type="button" onClick={() => postStatusUpdate(t.id)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-bold text-slate-300 transition-colors">
                  {t.label}
                </button>
              ))}
            </div>
            {prematureResolution && (
              <div className="p-2 rounded-lg bg-red-950/20 border border-red-500/30 text-red-200 text-[10px] flex items-center gap-1.5">
                <AlertTriangle className="w-3 h-3 shrink-0" /><span>A &quot;Resolved&quot; update was posted before metrics actually confirmed recovery.</span>
              </div>
            )}
            <div className="space-y-1 max-h-24 overflow-y-auto text-[10px] font-mono text-slate-400">
              {statusUpdates.map((u) => <div key={u.id}>[{fixture.timeline[u.simStep]?.timeLabel}] {u.text}</div>)}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <ClipboardList className="w-3.5 h-3.5" /><span>Follow-Up List</span>
            </h3>
            <div className="space-y-1">
              {FOLLOW_UP_CANDIDATES.map((f) => (
                <label key={f} className="flex items-center gap-2 text-[11px] text-slate-300 cursor-pointer">
                  <input type="checkbox" checked={state.followUpSelected.includes(f)} onChange={() => toggleFollowUp(f)} className="accent-purple-500" />
                  <span>{f}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-2">
            <label htmlFor="incident-report" className="text-xs font-extrabold text-white">Post-Incident Executive Summary</label>
            <textarea id="incident-report" rows={3} value={incidentReport}
              onChange={(e) => { setIncidentReport(e.target.value); onDirty(); }}
              placeholder="Document the trigger, the misleading alert you ruled out, detection latency, mitigation, and guardrails..."
              className="w-full text-xs p-3 rounded-xl bg-black/30 border border-white/15 text-slate-200 focus:outline-none focus:border-purple-500/50" />
          </div>

          <button type="button" onClick={handleExportJson}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] font-bold transition-colors">
            <Download className="w-3.5 h-3.5" /><span>Export Incident Report JSON</span>
          </button>

          <button type="button" onClick={handleSubmit}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold transition-all flex items-center justify-center gap-2">
            <Send className="w-4 h-4" />
            <span>Submit Postmortem</span>
          </button>
          {isCurrentlyRecovered && (
            <p className="text-[10px] text-emerald-400 flex items-center gap-1 justify-center"><CheckCircle2 className="w-3 h-3" />Recovery confirmed at current simulated time.</p>
          )}
        </div>
      </div>
    </div>
  );
}
