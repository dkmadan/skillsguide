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

export default function ProductionIncidentRoomLab({ onDirty, onSubmit }: Props) {
  const [simMinute, setSimMinute] = useState<number>(14); // 14:00 Incident start
  const [selectedHypothesis, setSelectedHypothesis] = useState<'ddos' | 'memory_leak' | 'bad_indexing' | 'none'>('none');
  const [chosenMitigation, setChosenMitigation] = useState<'none' | 'rate_limit' | 'restart_pods' | 'add_partial_index'>('none');
  const [timelineEvents, setTimelineEvents] = useState<string[]>([
    '14:02 UTC: P99 API Latency breached 2,500ms alert threshold (SEV-1)',
    '14:06 UTC: Database CPU spiked to 98% across all primary connection pools',
  ]);
  const [incidentReport, setIncidentReport] = useState<string>('');

  const handleAdvanceTime = () => {
    const nextMin = simMinute + 5;
    setSimMinute(nextMin);
    if (chosenMitigation === 'add_partial_index') {
      setTimelineEvents(prev => [...prev, `${nextMin}:00 UTC: Missing index applied on "orders.account_id". DB CPU dropped to 14%, Latency stabilized at 45ms (RESOLVED)`]);
    } else if (chosenMitigation === 'restart_pods') {
      setTimelineEvents(prev => [...prev, `${nextMin}:00 UTC: Pods restarted. CPU spiked right back up within 90 seconds due to unindexed query storm.`]);
    } else {
      setTimelineEvents(prev => [...prev, `${nextMin}:00 UTC: Latency remains critical at 3,200ms. Error budget draining rapidly.`]);
    }
    onDirty();
  };

  const isResolved = chosenMitigation === 'add_partial_index' && simMinute >= 24;

  const handleExportJson = () => {
    downloadJson('sre_incident_postmortem.json', {
      selectedHypothesis,
      chosenMitigation,
      timelineEvents,
      incidentReport,
      isResolved
    });
  };

  const handleFinalSubmit = () => {
    onSubmit({
      selectedHypothesis,
      chosenMitigation,
      timelineEvents,
      incidentReport,
      isResolved
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
              Lab 14 • SRE & Incident Command
            </span>
            <h2 className="text-xl font-bold text-white mt-2">Production Incident Decision Room (SEV-1 Latency Spike)</h2>
            <p className="text-sm text-slate-400 mt-1">
              Correlate APM metrics, DB slow queries, and distributed traces. Identify the root cause between DDoS, memory leak, or unindexed query, and advance the simulation clock to verify recovery.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              Export Postmortem
            </button>
            <button
              onClick={handleFinalSubmit}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition shadow-lg shadow-rose-600/20"
            >
              Submit Postmortem
            </button>
          </div>
        </div>
      </div>

      {/* Clock & Incident Status */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 uppercase">Simulated Time</div>
            <div className="text-xl font-mono font-bold text-white mt-1">14:{simMinute}:00 UTC</div>
          </div>
          <button
            onClick={handleAdvanceTime}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold rounded-lg border border-slate-700 transition"
          >
            +5 Mins
          </button>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 uppercase">Current P99 Latency</div>
          <div className={`text-2xl font-bold mt-1 ${isResolved ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isResolved ? '45 ms' : '2,850 ms'}
          </div>
          <p className="text-xs text-slate-500 mt-1">{isResolved ? 'Normal healthy SLA' : 'Alert: Critical Breached'}</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 uppercase">PostgreSQL CPU</div>
          <div className={`text-2xl font-bold mt-1 ${isResolved ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isResolved ? '14%' : '98%'}
          </div>
          <p className="text-xs text-slate-500 mt-1">{isResolved ? 'Low thread wait' : 'Sequential Scan Saturation'}</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 uppercase">Incident State</div>
          <div className={`text-xl font-bold mt-1 ${isResolved ? 'text-emerald-400' : 'text-amber-400'}`}>
            {isResolved ? 'RESOLVED' : 'ACTIVE OUTAGE'}
          </div>
          <p className="text-xs text-slate-500 mt-1">{isResolved ? 'Mitigation Confirmed' : 'Action Required'}</p>
        </div>
      </div>

      {/* Observability & Decision Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Timeline Log */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white">Incident Timeline & Slow Query Traces</h3>

          <div className="space-y-2 text-xs">
            {timelineEvents.map((evt, idx) => (
              <div key={idx} className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl text-slate-300 font-mono">
                {evt}
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-slate-400">
            <span className="text-amber-400 font-bold">Top Slow Query: </span>
            <code>SELECT * FROM orders WHERE account_id = $1 ORDER BY created_at DESC;</code>
            <div className="text-slate-500 mt-1">Seq Scan on orders (cost=0.00..48291.20 rows=320140 width=148) • Execution: 2,410ms</div>
          </div>
        </div>

        {/* Triage Choices */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white">Incident Commander Decisions</h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Root Cause Hypothesis</label>
              <div className="grid grid-cols-1 gap-1.5">
                {[
                  { id: 'ddos', label: 'Volumetric Distributed Denial-of-Service' },
                  { id: 'bad_indexing', label: 'Missing B-Tree Index on orders.account_id' },
                  { id: 'memory_leak', label: 'Node.js V8 Heap Memory Leak in API pods' },
                ].map(h => (
                  <button
                    key={h.id}
                    onClick={() => { setSelectedHypothesis(h.id as any); onDirty(); }}
                    className={`text-left p-2.5 rounded-lg border text-xs transition ${
                      selectedHypothesis === h.id
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-semibold'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {h.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Apply Mitigation Action</label>
              <div className="grid grid-cols-1 gap-1.5">
                {[
                  { id: 'restart_pods', label: 'Roll and restart all Kubernetes worker pods' },
                  { id: 'rate_limit', label: 'Throttle client requests via Cloudflare WAF' },
                  { id: 'add_partial_index', label: 'Create Concurrent Index on (account_id, created_at)' },
                ].map(m => (
                  <button
                    key={m.id}
                    onClick={() => { setChosenMitigation(m.id as any); onDirty(); }}
                    className={`text-left p-2.5 rounded-lg border text-xs transition ${
                      chosenMitigation === m.id
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Post-Mortem Executive Summary</label>
              <textarea
                rows={3}
                value={incidentReport}
                onChange={e => { setIncidentReport(e.target.value); onDirty(); }}
                placeholder="Document trigger, detection latency, mitigation, and preventive guardrails..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 text-xs focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
