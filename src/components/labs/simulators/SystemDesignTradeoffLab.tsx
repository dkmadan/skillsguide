'use client';

import React, { useState, useMemo } from 'react';
import { LabScenarioVariant } from '@/lib/labs/types';
import { downloadJson } from '@/lib/labs/exportHelper';

interface Props {
  scenario?: LabScenarioVariant;
  variant: 'beginner' | 'intermediate' | 'challenge';
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

export default function SystemDesignTradeoffLab({ onDirty, onSubmit }: Props) {
  const [arrivalRps, setArrivalRps] = useState<number>(1200); // req / sec
  const [hasRedisCache, setHasRedisCache] = useState<boolean>(true);
  const [hasKafkaQueue, setHasKafkaQueue] = useState<boolean>(true);
  const [appServerReplicas, setAppServerReplicas] = useState<number>(3); // 500 rps per replica
  const [dbReadReplicas, setDbReadReplicas] = useState<number>(2); // 400 rps per replica
  const [injectedFailure, setInjectedFailure] = useState<'none' | 'cache_down' | 'db_primary_down'>('none');

  // Architecture performance calculation using teaching formulas:
  // Baseline capacity:
  // App cluster capacity = replicas * 500 rps
  // Cache absorbs 70% of read traffic if enabled and not failed
  const simResults = useMemo(() => {
    let effectiveCacheHitRate = (hasRedisCache && injectedFailure !== 'cache_down') ? 0.70 : 0.0;
    let effectiveAppCapacity = appServerReplicas * 500;
    let effectiveDbCapacity = (1 + dbReadReplicas) * 400 * (injectedFailure === 'db_primary_down' ? 0.3 : 1.0);

    // Demand that reaches app layer
    let appUtilization = Math.min(1.0, arrivalRps / Math.max(1, effectiveAppCapacity));
    let appBacklogRps = Math.max(0, arrivalRps - effectiveAppCapacity);

    // Demand reaching database
    let dbDemand = arrivalRps * (1 - effectiveCacheHitRate);
    let dbUtilization = Math.min(1.0, dbDemand / Math.max(1, effectiveDbCapacity));
    let dbBacklogRps = Math.max(0, dbDemand - effectiveDbCapacity);

    // Queue buffering effect
    let droppedRps = 0;
    let queuedBacklog = 0;
    if (appBacklogRps > 0 || dbBacklogRps > 0) {
      if (hasKafkaQueue) {
        queuedBacklog = appBacklogRps + dbBacklogRps;
        droppedRps = Math.max(0, queuedBacklog - 2500); // buffer holds up to 2500
      } else {
        droppedRps = appBacklogRps + dbBacklogRps;
      }
    }

    let p99LatencyMs = 25;
    if (appUtilization > 0.8) p99LatencyMs += (appUtilization - 0.8) * 200;
    if (dbUtilization > 0.8) p99LatencyMs += (dbUtilization - 0.8) * 350;
    if (injectedFailure !== 'none') p99LatencyMs += 400;

    return {
      effectiveAppCapacity,
      effectiveDbCapacity,
      appUtilization,
      dbUtilization,
      queuedBacklog,
      droppedRps,
      p99LatencyMs: Math.round(p99LatencyMs),
      isHealthy: droppedRps === 0 && p99LatencyMs < 300
    };
  }, [arrivalRps, hasRedisCache, hasKafkaQueue, appServerReplicas, dbReadReplicas, injectedFailure]);

  const handleExportJson = () => {
    downloadJson('system_design_topology.json', {
      topology: {
        arrivalRps,
        hasRedisCache,
        hasKafkaQueue,
        appServerReplicas,
        dbReadReplicas
      },
      simResults
    });
  };

  const handleFinalSubmit = () => {
    onSubmit({
      arrivalRps,
      hasRedisCache,
      hasKafkaQueue,
      appServerReplicas,
      dbReadReplicas,
      injectedFailure,
      simResults
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
              Lab 11 • Distributed Systems Architecture
            </span>
            <h2 className="text-xl font-bold text-white mt-2">System Design Tradeoff Simulator</h2>
            <p className="text-sm text-slate-400 mt-1">
              Architect an auto-scaling assessment backend. Size cache offloading, message queue buffering, and replica capacities under peak traffic loads without request drops.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              Export Topology
            </button>
            <button
              onClick={handleFinalSubmit}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold transition shadow-lg shadow-sky-500/20"
            >
              Submit Design
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-400 uppercase">App Cluster Load</div>
          <div className={`text-2xl font-bold mt-1 ${simResults.appUtilization > 0.9 ? 'text-rose-400' : 'text-sky-400'}`}>
            {(simResults.appUtilization * 100).toFixed(0)}%
          </div>
          <p className="text-xs text-slate-500 mt-1">{arrivalRps} RPS / {simResults.effectiveAppCapacity} Cap</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-400 uppercase">Database Utilization</div>
          <div className={`text-2xl font-bold mt-1 ${simResults.dbUtilization > 0.9 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {(simResults.dbUtilization * 100).toFixed(0)}%
          </div>
          <p className="text-xs text-slate-500 mt-1">{hasRedisCache ? '70% Cache Offload' : 'Direct DB Pressure'}</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-400 uppercase">P99 Latency</div>
          <div className={`text-2xl font-bold mt-1 ${simResults.p99LatencyMs > 250 ? 'text-amber-400' : 'text-indigo-400'}`}>
            {simResults.p99LatencyMs} ms
          </div>
          <p className="text-xs text-slate-500 mt-1">SLA Target &lt; 250ms</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-400 uppercase">Packet / Request Drops</div>
          <div className={`text-2xl font-bold mt-1 ${simResults.droppedRps > 0 ? 'text-rose-500' : 'text-emerald-400'}`}>
            {simResults.droppedRps} rps
          </div>
          <p className="text-xs text-slate-500 mt-1">{hasKafkaQueue ? `Buffered: ${simResults.queuedBacklog} rps` : 'No Queue Buffer'}</p>
        </div>
      </div>

      {/* Interactive Controls & Topology Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls */}
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-5">
          <h3 className="text-sm font-semibold text-white">Traffic & Infrastructure Parameters</h3>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Peak Inbound Traffic Arrival Rate</span>
                <span className="font-mono text-cyan-400 font-bold">{arrivalRps} RPS</span>
              </div>
              <input
                type="range"
                min="200"
                max="3500"
                step="100"
                value={arrivalRps}
                onChange={e => { setArrivalRps(parseInt(e.target.value)); onDirty(); }}
                className="w-full accent-sky-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>App Server Replicas (500 RPS each)</span>
                <span className="font-mono text-cyan-400 font-bold">{appServerReplicas} nodes</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                value={appServerReplicas}
                onChange={e => { setAppServerReplicas(parseInt(e.target.value)); onDirty(); }}
                className="w-full accent-sky-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Database Read Replicas (400 RPS each)</span>
                <span className="font-mono text-cyan-400 font-bold">{dbReadReplicas} replicas</span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                value={dbReadReplicas}
                onChange={e => { setDbReadReplicas(parseInt(e.target.value)); onDirty(); }}
                className="w-full accent-sky-500"
              />
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                <input
                  type="checkbox"
                  checked={hasRedisCache}
                  onChange={e => { setHasRedisCache(e.target.checked); onDirty(); }}
                  className="accent-sky-500 rounded"
                />
                <span>Enable Distributed In-Memory Cache (Redis Cluster)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                <input
                  type="checkbox"
                  checked={hasKafkaQueue}
                  onChange={e => { setHasKafkaQueue(e.target.checked); onDirty(); }}
                  className="accent-sky-500 rounded"
                />
                <span>Enable Asynchronous Message Queue (Kafka Backpressure Buffer)</span>
              </label>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <label className="text-slate-400 block mb-1">Chaos Fault Injection</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'none', label: 'Healthy (0 Chaos)' },
                  { id: 'cache_down', label: 'Kill Redis Node' },
                  { id: 'db_primary_down', label: 'Primary DB Fail' }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => { setInjectedFailure(f.id as any); onDirty(); }}
                    className={`py-1.5 rounded-lg border text-[11px] font-semibold transition ${
                      injectedFailure === f.id
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live Architecture Flow Map */}
        <div className="lg:col-span-6 bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <h3 className="text-sm font-semibold text-white mb-4">Architecture Topology & Data Path</h3>

          <div className="space-y-4">
            {/* Edge Gateway */}
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">Cloudflare Edge & CDN</span>
              <span className="text-cyan-400 font-mono">{arrivalRps} RPS Inbound</span>
            </div>

            {/* Redis Cache */}
            <div className={`p-3 rounded-xl border text-xs flex items-center justify-between transition ${
              !hasRedisCache
                ? 'bg-slate-900/30 border-dashed border-slate-800 text-slate-600'
                : injectedFailure === 'cache_down'
                ? 'bg-rose-950/30 border-rose-800 text-rose-300 animate-pulse'
                : 'bg-sky-950/30 border-sky-800/60 text-sky-200'
            }`}>
              <span>Redis Cache Layer (70% TTL Offload)</span>
              <span className="font-mono">{hasRedisCache ? (injectedFailure === 'cache_down' ? 'OFFLINE' : 'ONLINE') : 'DISABLED'}</span>
            </div>

            {/* App Replicas */}
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs space-y-2">
              <div className="flex justify-between">
                <span className="font-semibold text-slate-200">App Compute Pods ({appServerReplicas} Replicas)</span>
                <span className="font-mono text-slate-400">{simResults.effectiveAppCapacity} RPS Capacity</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${simResults.appUtilization > 0.9 ? 'bg-rose-500' : 'bg-sky-500'}`}
                  style={{ width: `${Math.min(100, simResults.appUtilization * 100)}%` }}
                />
              </div>
            </div>

            {/* Database & Queue */}
            <div className="grid grid-cols-2 gap-3">
              <div className={`p-3 rounded-xl border text-xs ${hasKafkaQueue ? 'bg-indigo-950/20 border-indigo-800 text-indigo-300' : 'bg-slate-900/40 border-slate-800 text-slate-600'}`}>
                <div className="font-semibold">Kafka Queue</div>
                <div className="text-[11px] mt-1">{hasKafkaQueue ? 'Buffering spikes' : 'Disabled'}</div>
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs">
                <div className="font-semibold text-slate-200">PostgreSQL Store</div>
                <div className="text-[11px] text-slate-400 mt-1">{dbReadReplicas} Read Replicas</div>
              </div>
            </div>
          </div>

          <div className={`mt-4 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${simResults.isHealthy ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'}`}>
            <span className={`w-2.5 h-2.5 rounded-full ${simResults.isHealthy ? 'bg-emerald-400' : 'bg-rose-400'}`} />
            {simResults.isHealthy
              ? 'Architecture passes SLA: Zero request drops, P99 < 300ms'
              : 'SLA Violated: Backlog saturated, request drops detected'}
          </div>
        </div>
      </div>
    </div>
  );
}
