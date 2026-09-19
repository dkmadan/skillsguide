'use client';

import { useMemo, useState } from 'react';
import { LabScenarioVariant, LabDifficulty } from '@/lib/labs/types';
import { useUndoableState } from '@/lib/labs/useUndoableState';
import { downloadCsv, downloadJson } from '@/lib/labs/exportHelper';
import ChartFrame from '@/components/labs/charts/ChartFrame';
import TrendLineChart from '@/components/labs/charts/TrendLineChart';
import CompareBarChart from '@/components/labs/charts/CompareBarChart';
import BreakdownDoughnutChart from '@/components/labs/charts/BreakdownDoughnutChart';
import SimClock from '@/components/labs/SimClock';
import {
  Undo2,
  Redo2,
  RotateCcw,
  Download,
  FileJson,
  Send,
  Server,
  ShieldAlert,
  ShieldCheck,
  Globe,
  DollarSign,
  Layers,
} from 'lucide-react';

interface SimulatorProps {
  scenario?: LabScenarioVariant;
  variant: LabDifficulty;
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

type Category = 'compute' | 'database' | 'storage' | 'network';
type Tier = 'critical' | 'standard';

interface ResourceItem {
  id: string;
  name: string;
  description: string;
  category: Category;
  tier: Tier;
  unitRatePerHour: number;
  hoursPerMonth: number;
  count: number;
  redundant: boolean;
  backupEnabled: boolean;
  publicAccess: boolean;
  publicByDesign: boolean; // e.g. a CDN asset bucket — public access is expected, not a risk
  necessaryIdle: boolean; // e.g. a warm DR standby — low utilization is expected, not waste
  utilizationPct: number;
}

interface Fixture {
  fixedMonthlyFees: number;
  resources: ResourceItem[];
  creepRatePerMonth: number; // monthly cost-creep applied to unresolved idle waste if left unfixed
  narrative: string;
}

const IDLE_THRESHOLD_PCT = 15;

// Three genuinely different resource inventories — increasing ambiguity via
// decoys that *look* risky but are legitimate, and vice versa, rather than
// just more rows.
const FIXTURES: Record<LabDifficulty, Fixture> = {
  beginner: {
    fixedMonthlyFees: 150,
    creepRatePerMonth: 0.03,
    narrative: 'A single-region web platform for a community learning portal.',
    resources: [
      { id: 'c1', name: 'App VM Pair', description: 'Two general-purpose VMs serving the web app.', category: 'compute', tier: 'critical', unitRatePerHour: 2, hoursPerMonth: 730, count: 2, redundant: false, backupEnabled: true, publicAccess: false, publicByDesign: false, necessaryIdle: false, utilizationPct: 62 },
      { id: 'c2', name: 'Staging VM (unused test cluster)', description: 'Spun up for a Q2 experiment, unused since March.', category: 'compute', tier: 'standard', unitRatePerHour: 2.5, hoursPerMonth: 730, count: 1, redundant: false, backupEnabled: false, publicAccess: false, publicByDesign: false, necessaryIdle: false, utilizationPct: 2 },
      { id: 'db1', name: 'Managed Postgres', description: 'Primary application database.', category: 'database', tier: 'critical', unitRatePerHour: 3.5, hoursPerMonth: 730, count: 1, redundant: false, backupEnabled: true, publicAccess: false, publicByDesign: false, necessaryIdle: false, utilizationPct: 48 },
      { id: 's1', name: 'User Uploads Bucket', description: 'Stores learner-submitted documents.', category: 'storage', tier: 'critical', unitRatePerHour: 0.8, hoursPerMonth: 730, count: 1, redundant: false, backupEnabled: false, publicAccess: true, publicByDesign: false, necessaryIdle: false, utilizationPct: 30 },
      { id: 'ref1', name: 'Reference Pair (worked example)', description: 'Illustrative pair used to verify the billing formula: 2 units x $2/hr x 100 hrs.', category: 'compute', tier: 'standard', unitRatePerHour: 2, hoursPerMonth: 100, count: 2, redundant: false, backupEnabled: true, publicAccess: false, publicByDesign: false, necessaryIdle: true, utilizationPct: 40 },
    ],
  },
  intermediate: {
    fixedMonthlyFees: 220,
    creepRatePerMonth: 0.04,
    narrative: 'A regional marketplace platform ahead of a seasonal sale.',
    resources: [
      { id: 'c1', name: 'App VM Cluster', description: 'Four general-purpose VMs behind a load balancer.', category: 'compute', tier: 'critical', unitRatePerHour: 2.2, hoursPerMonth: 730, count: 4, redundant: false, backupEnabled: true, publicAccess: false, publicByDesign: false, necessaryIdle: false, utilizationPct: 55 },
      { id: 'c2', name: 'Batch Report VM (unused test cluster)', description: 'A one-off analytics job cluster, idle since last quarter.', category: 'compute', tier: 'standard', unitRatePerHour: 2.5, hoursPerMonth: 730, count: 1, redundant: false, backupEnabled: false, publicAccess: false, publicByDesign: false, necessaryIdle: false, utilizationPct: 3 },
      { id: 'c3', name: 'Warm DR Standby VM', description: 'Kept warm at low usage to meet the 15-minute failover SLA — required, not waste.', category: 'compute', tier: 'critical', unitRatePerHour: 1.8, hoursPerMonth: 730, count: 1, redundant: false, backupEnabled: true, publicAccess: false, publicByDesign: false, necessaryIdle: true, utilizationPct: 6 },
      { id: 'db1', name: 'Managed Postgres Multi-AZ', description: 'Primary order database.', category: 'database', tier: 'critical', unitRatePerHour: 3.8, hoursPerMonth: 730, count: 1, redundant: true, backupEnabled: true, publicAccess: false, publicByDesign: false, necessaryIdle: false, utilizationPct: 64 },
      { id: 's1', name: 'Product Image Bucket (CDN origin)', description: 'Publicly served product photos — public access is intended here.', category: 'storage', tier: 'standard', unitRatePerHour: 0.5, hoursPerMonth: 730, count: 1, redundant: false, backupEnabled: true, publicAccess: true, publicByDesign: true, necessaryIdle: false, utilizationPct: 71 },
      { id: 's2', name: 'Customer Records Bucket', description: 'Stores customer PII exports — must never be public.', category: 'storage', tier: 'critical', unitRatePerHour: 0.9, hoursPerMonth: 730, count: 1, redundant: false, backupEnabled: false, publicAccess: true, publicByDesign: false, necessaryIdle: false, utilizationPct: 22 },
      { id: 'ref1', name: 'Reference Pair (worked example)', description: 'Illustrative pair used to verify the billing formula: 2 units x $2/hr x 100 hrs.', category: 'compute', tier: 'standard', unitRatePerHour: 2, hoursPerMonth: 100, count: 2, redundant: false, backupEnabled: true, publicAccess: false, publicByDesign: false, necessaryIdle: true, utilizationPct: 40 },
    ],
  },
  challenge: {
    fixedMonthlyFees: 340,
    creepRatePerMonth: 0.05,
    narrative: 'A multi-service fintech-adjacent platform undergoing a FinOps + security audit.',
    resources: [
      { id: 'c1', name: 'App VM Fleet', description: 'Six VMs behind an autoscaler.', category: 'compute', tier: 'critical', unitRatePerHour: 2.4, hoursPerMonth: 730, count: 6, redundant: true, backupEnabled: true, publicAccess: false, publicByDesign: false, necessaryIdle: false, utilizationPct: 58 },
      { id: 'c2', name: 'Legacy Batch VM (unused test cluster)', description: 'Left running after a migration finished last year.', category: 'compute', tier: 'standard', unitRatePerHour: 2.6, hoursPerMonth: 730, count: 2, redundant: false, backupEnabled: false, publicAccess: false, publicByDesign: false, necessaryIdle: false, utilizationPct: 4 },
      { id: 'c3', name: 'Warm DR Standby VM', description: 'Required by the compliance SLA to stay warm at low usage.', category: 'compute', tier: 'critical', unitRatePerHour: 2.0, hoursPerMonth: 730, count: 1, redundant: false, backupEnabled: true, publicAccess: false, publicByDesign: false, necessaryIdle: true, utilizationPct: 5 },
      { id: 'db1', name: 'Managed Postgres Multi-AZ', description: 'Primary ledger database — regulated data.', category: 'database', tier: 'critical', unitRatePerHour: 4.2, hoursPerMonth: 730, count: 1, redundant: true, backupEnabled: true, publicAccess: false, publicByDesign: false, necessaryIdle: false, utilizationPct: 70 },
      { id: 'db2', name: 'Reporting Read Replica', description: 'Serves nightly analytics — currently unbacked up.', category: 'database', tier: 'critical', unitRatePerHour: 3.0, hoursPerMonth: 730, count: 1, redundant: false, backupEnabled: false, publicAccess: false, publicByDesign: false, necessaryIdle: false, utilizationPct: 33 },
      { id: 's1', name: 'Marketing Assets Bucket (CDN origin)', description: 'Publicly served brand assets — public access is intended here.', category: 'storage', tier: 'standard', unitRatePerHour: 0.4, hoursPerMonth: 730, count: 1, redundant: false, backupEnabled: true, publicAccess: true, publicByDesign: true, necessaryIdle: false, utilizationPct: 66 },
      { id: 's2', name: 'KYC Documents Bucket', description: 'Stores regulated identity documents — must never be public and must be backed up.', category: 'storage', tier: 'critical', unitRatePerHour: 1.1, hoursPerMonth: 730, count: 1, redundant: false, backupEnabled: false, publicAccess: true, publicByDesign: false, necessaryIdle: false, utilizationPct: 19 },
      { id: 'n1', name: 'Idle Load Balancer (decommission candidate)', description: 'Provisioned for a cancelled regional launch — receives no traffic.', category: 'network', tier: 'standard', unitRatePerHour: 1.6, hoursPerMonth: 730, count: 1, redundant: false, backupEnabled: true, publicAccess: false, publicByDesign: false, necessaryIdle: false, utilizationPct: 1 },
      { id: 'ref1', name: 'Reference Pair (worked example)', description: 'Illustrative pair used to verify the billing formula: 2 units x $2/hr x 100 hrs.', category: 'compute', tier: 'standard', unitRatePerHour: 2, hoursPerMonth: 100, count: 2, redundant: false, backupEnabled: true, publicAccess: false, publicByDesign: false, necessaryIdle: true, utilizationPct: 40 },
    ],
  },
};

function itemMonthlyCost(r: ResourceItem): number {
  const effectiveCount = r.redundant ? r.count * 2 : r.count;
  return effectiveCount * r.unitRatePerHour * r.hoursPerMonth;
}

function isIdleWaste(r: ResourceItem): boolean {
  return !r.necessaryIdle && r.utilizationPct < IDLE_THRESHOLD_PCT && r.count > 0;
}
function isPublicRisk(r: ResourceItem): boolean {
  return r.publicAccess && !r.publicByDesign && r.count > 0;
}
function isBackupRisk(r: ResourceItem): boolean {
  return !r.backupEnabled && r.count > 0;
}
function isRedundancyGap(r: ResourceItem): boolean {
  return r.tier === 'critical' && !r.redundant && r.count > 0;
}

function optimize(resources: ResourceItem[]): ResourceItem[] {
  return resources.map((r) => {
    if (isIdleWaste(r)) return { ...r, count: 0 };
    const next = { ...r };
    if (isPublicRisk(next)) next.publicAccess = false;
    if (isBackupRisk(next)) next.backupEnabled = true;
    if (isRedundancyGap(next)) next.redundant = true;
    return next;
  });
}

function totalMonthly(resources: ResourceItem[], fixedFees: number): number {
  return resources.reduce((sum, r) => sum + itemMonthlyCost(r), 0) + fixedFees;
}

export default function CloudPlanningCostLab({ variant, onDirty, onSubmit }: SimulatorProps) {
  const fixture = FIXTURES[variant];
  const { state: resources, set: setResources, undo, redo, reset, canUndo, canRedo, stepIndex } = useUndoableState<ResourceItem[]>(fixture.resources);
  const [monthIndex, setMonthIndex] = useState(0);
  const [planNotes, setPlanNotes] = useState('');

  const updateResource = (id: string, updates: Partial<ResourceItem>) => {
    setResources((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
    onDirty();
  };

  const billCalculations = useMemo(() => {
    const idleWasteCost = resources.filter(isIdleWaste).reduce((s, r) => s + itemMonthlyCost(r), 0);
    const missingBackupCount = resources.filter(isBackupRisk).length;
    const publicExposureCount = resources.filter(isPublicRisk).length;
    const redundancyGapCount = resources.filter(isRedundancyGap).length;
    const rawTotal = resources.reduce((s, r) => s + itemMonthlyCost(r), 0);
    const totalMonthlyCost = rawTotal + fixture.fixedMonthlyFees;
    const optimizedResources = optimize(resources);
    const optimizedCost = totalMonthly(optimizedResources, fixture.fixedMonthlyFees);
    return { idleWasteCost, missingBackupCount, publicExposureCount, redundancyGapCount, totalMonthlyCost, optimizedCost, optimizedResources };
  }, [resources, fixture.fixedMonthlyFees]);

  // Reference worked example: 2 units x $2/hr x 100 hrs = $400 before fixed charges.
  const referenceResource = resources.find((r) => r.id === 'ref1');
  const referenceCheck = referenceResource ? referenceResource.count * referenceResource.unitRatePerHour * referenceResource.hoursPerMonth : 0;

  const monthlyProjection = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, i) => `Month ${i + 1}`);
    const currentSeries = months.map((_, i) => {
      const creepFactor = (1 + fixture.creepRatePerMonth) ** i;
      const nonWaste = resources.filter((r) => !isIdleWaste(r)).reduce((s, r) => s + itemMonthlyCost(r), 0);
      const waste = resources.filter(isIdleWaste).reduce((s, r) => s + itemMonthlyCost(r), 0) * creepFactor;
      return Math.round(nonWaste + waste + fixture.fixedMonthlyFees);
    });
    const optimizedSeries = months.map(() => Math.round(billCalculations.optimizedCost));
    return { months, currentSeries, optimizedSeries };
  }, [resources, fixture.creepRatePerMonth, fixture.fixedMonthlyFees, billCalculations.optimizedCost]);

  const costByCategory = useMemo(() => {
    const byCat: Record<Category, number> = { compute: 0, database: 0, storage: 0, network: 0 };
    resources.forEach((r) => { byCat[r.category] += itemMonthlyCost(r); });
    const labels = Object.keys(byCat).filter((k) => byCat[k as Category] > 0);
    return { labels, values: labels.map((l) => Math.round(byCat[l as Category])) };
  }, [resources]);

  const resilienceChecklist = useMemo(
    () => [
      { id: 'no-idle', label: 'No idle/unattached resources billed as waste', satisfied: billCalculations.idleWasteCost === 0 },
      { id: 'no-public', label: 'No unintended publicly exposed data', satisfied: billCalculations.publicExposureCount === 0 },
      { id: 'backups', label: 'All active resources have backups enabled', satisfied: billCalculations.missingBackupCount === 0 },
      { id: 'redundancy', label: 'All critical-tier resources are redundant', satisfied: billCalculations.redundancyGapCount === 0 },
    ],
    [billCalculations]
  );

  const handleExportCsv = () => {
    downloadCsv('finops_cloud_bill.csv', resources.map((r) => ({
      resource: r.name,
      category: r.category,
      tier: r.tier,
      quantity: r.count,
      redundant: r.redundant ? 'YES' : 'NO',
      rate_per_hour: r.unitRatePerHour,
      hours: r.hoursPerMonth,
      monthly_cost: itemMonthlyCost(r).toFixed(2),
      is_idle_waste: isIdleWaste(r) ? 'YES' : 'NO',
      public_exposure: isPublicRisk(r) ? 'HIGH_RISK' : 'SAFE',
      backup_enabled: r.backupEnabled ? 'YES' : 'NO',
    })));
  };

  const handleExportJson = () => {
    downloadJson('finops_resilience_checklist.json', {
      variant,
      resources,
      billCalculations: { ...billCalculations, optimizedResources: undefined },
      monthlyProjection,
      resilienceChecklist,
      planNotes,
    });
  };

  const handleSubmit = () => {
    onSubmit({
      resources,
      billCalculations: {
        idleWasteCost: billCalculations.idleWasteCost,
        missingBackupCount: billCalculations.missingBackupCount,
        publicExposureCount: billCalculations.publicExposureCount,
        redundancyGapCount: billCalculations.redundancyGapCount,
        totalMonthlyCost: billCalculations.totalMonthlyCost,
        optimizedCost: billCalculations.optimizedCost,
      },
      referenceCheck,
      monthlyProjection,
      resilienceChecklist,
      planNotes,
      undoStepsExplored: stepIndex,
    });
  };

  const risksResolved = billCalculations.idleWasteCost === 0 && billCalculations.publicExposureCount === 0 && billCalculations.missingBackupCount === 0;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Gross Monthly Bill</span>
          <span className="text-xl font-black text-slate-200">${billCalculations.totalMonthlyCost.toFixed(0)}</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Includes ${fixture.fixedMonthlyFees} fixed charges</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Idle Waste</span>
          <span className={`text-xl font-black ${billCalculations.idleWasteCost > 0 ? 'text-red-400' : 'text-emerald-400'}`}>${billCalculations.idleWasteCost.toFixed(0)}</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">{billCalculations.idleWasteCost > 0 ? 'Requires decommissioning' : 'None found'}</span>
        </div>
        <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30">
          <span className="text-xs text-purple-300 font-bold block mb-1">Optimized Target Bill</span>
          <span className="text-xl font-black text-purple-200">${billCalculations.optimizedCost.toFixed(0)}</span>
          <span className="text-[10px] text-emerald-400 block mt-0.5">History step {stepIndex}</span>
        </div>
        <div className={`p-4 rounded-2xl border ${risksResolved ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-amber-950/20 border-amber-500/30'}`}>
          <span className="text-xs font-semibold block mb-1 flex items-center gap-1.5">
            {risksResolved ? <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> : <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />}
            <span className={risksResolved ? 'text-emerald-300' : 'text-amber-300'}>Security &amp; Backup Flags</span>
          </span>
          <span className={`text-xl font-black ${risksResolved ? 'text-emerald-300' : 'text-amber-300'}`}>{billCalculations.publicExposureCount + billCalculations.missingBackupCount}</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">{billCalculations.publicExposureCount} public, {billCalculations.missingBackupCount} no backup</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Resource cards */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-purple-400" />
                <span>1. Resource Plan ({fixture.narrative})</span>
              </h2>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={undo} disabled={!canUndo} title="Undo last plan change"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30 transition-colors">
                  <Undo2 className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={redo} disabled={!canRedo} title="Redo"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30 transition-colors">
                  <Redo2 className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => { reset(); onDirty(); }} title="Reset resource plan"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors">
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-2.5 max-h-[30rem] overflow-y-auto pr-1">
              {resources.map((r) => {
                const cost = itemMonthlyCost(r);
                const waste = isIdleWaste(r);
                const publicRisk = isPublicRisk(r);
                const backupRisk = isBackupRisk(r);
                const redundancyGap = isRedundancyGap(r);
                return (
                  <div key={r.id} className={`p-3 rounded-xl border text-xs space-y-2 ${waste || publicRisk || backupRisk ? 'bg-red-950/10 border-red-500/20' : 'bg-white/5 border-white/10'}`}>
                    <div className="flex items-center justify-between flex-wrap gap-1.5">
                      <div>
                        <span className="font-bold text-white">{r.name}</span>
                        <span className="ml-2 text-[9px] px-1.5 py-0.5 rounded uppercase font-bold bg-white/10 text-slate-400">{r.category} · {r.tier}</span>
                      </div>
                      <span className="font-mono text-slate-300">${cost.toFixed(2)}/mo</span>
                    </div>
                    <p className="text-[10px] text-slate-500">{r.description}</p>
                    <div className="flex flex-wrap gap-1.5 items-center">
                      <label className="flex items-center gap-1 text-[10px] text-slate-400">
                        Qty
                        <input type="number" min={0} max={10} value={r.count}
                          onChange={(e) => updateResource(r.id, { count: Math.max(0, parseInt(e.target.value, 10) || 0) })}
                          className="w-12 px-1 py-0.5 rounded bg-black/40 border border-white/15 text-slate-200" />
                      </label>
                      <button type="button" onClick={() => updateResource(r.id, { redundant: !r.redundant })}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${r.redundant ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200' : redundancyGap ? 'bg-amber-500/20 border-amber-500/40 text-amber-200' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                        Redundant: {r.redundant ? 'Yes' : 'No'}
                      </button>
                      <button type="button" onClick={() => updateResource(r.id, { backupEnabled: !r.backupEnabled })}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${backupRisk ? 'bg-red-500/20 border-red-500/40 text-red-200' : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200'}`}>
                        Backup: {r.backupEnabled ? 'On' : 'Off'}
                      </button>
                      <button type="button" onClick={() => updateResource(r.id, { publicAccess: !r.publicAccess })}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border flex items-center gap-1 ${publicRisk ? 'bg-red-500/20 border-red-500/40 text-red-200' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                        <Globe className="w-2.5 h-2.5" /> {r.publicAccess ? (r.publicByDesign ? 'Public (by design)' : 'Public') : 'Private'}
                      </button>
                      {waste && (
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-red-500/20 border border-red-500/40 text-red-200">Idle waste at {r.utilizationPct}% util</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">Resilience Checklist</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {resilienceChecklist.map((c) => (
                <div key={c.id} className={`p-2.5 rounded-xl border text-[11px] font-semibold flex items-center gap-2 ${c.satisfied ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border-red-500/30 text-red-300'}`}>
                  {c.satisfied ? <ShieldCheck className="w-3.5 h-3.5 shrink-0" /> : <ShieldAlert className="w-3.5 h-3.5 shrink-0" />}
                  <span>{c.label}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-500">Worked-example check: {referenceResource?.count} units x ${referenceResource?.unitRatePerHour}/hr x {referenceResource?.hoursPerMonth} hrs = ${referenceCheck.toFixed(0)} before fixed charges.</p>
          </div>
        </div>

        {/* Right: Charts + submit */}
        <div className="lg:col-span-5 space-y-4">
          <ChartFrame
            title="Two-Scenario Budget Comparison (6 Months)"
            icon={<DollarSign className="w-4 h-4 text-purple-400" />}
            tableHeaders={['Month', 'Current Plan', 'Optimized Plan']}
            tableRows={monthlyProjection.months.map((m, i) => [m, monthlyProjection.currentSeries[i], monthlyProjection.optimizedSeries[i]])}
          >
            <TrendLineChart
              labels={monthlyProjection.months}
              series={[
                { label: 'Current plan (unresolved waste creeps)', data: monthlyProjection.currentSeries },
                { label: 'Optimized plan', data: monthlyProjection.optimizedSeries, fill: true },
              ]}
              yLabel="Illustrative $ / month"
            />
          </ChartFrame>

          <SimClock
            label="Month Scrubber"
            step={monthIndex}
            maxStep={monthlyProjection.months.length - 1}
            stepLabel={(s) => monthlyProjection.months[s] ?? `Month ${s + 1}`}
            onAdvance={() => setMonthIndex((m) => Math.min(monthlyProjection.months.length - 1, m + 1))}
            onReset={() => setMonthIndex(0)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ChartFrame
              title="Cost Breakdown by Resource"
              icon={<Layers className="w-4 h-4 text-purple-400" />}
              tableHeaders={['Resource', 'Monthly Cost']}
              tableRows={resources.map((r) => [r.name, itemMonthlyCost(r).toFixed(2)])}
            >
              <CompareBarChart
                horizontal
                labels={resources.map((r) => r.name)}
                series={[{
                  label: 'Monthly Cost ($)',
                  data: resources.map((r) => Math.round(itemMonthlyCost(r))),
                  statusOverride: resources.map((r) => (isIdleWaste(r) ? 'critical' : null)),
                }]}
                yLabel="Illustrative $"
              />
            </ChartFrame>

            <ChartFrame
              title="Cost Share by Resource Type"
              icon={<DollarSign className="w-4 h-4 text-purple-400" />}
              tableHeaders={['Category', 'Monthly Cost']}
              tableRows={costByCategory.labels.map((l, i) => [l, costByCategory.values[i]])}
            >
              <BreakdownDoughnutChart
                labels={costByCategory.labels}
                values={costByCategory.values}
                centerLabel="Total / mo"
                centerValue={`$${Math.round(billCalculations.totalMonthlyCost)}`}
              />
            </ChartFrame>
          </div>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-2">
            <label htmlFor="plan-notes" className="text-xs font-extrabold text-white flex items-center gap-2">
              <FileJson className="w-3.5 h-3.5 text-purple-400" />
              <span>FinOps Plan Notes</span>
            </label>
            <textarea id="plan-notes" rows={3} value={planNotes}
              placeholder="Document your FinOps rationale: idle waste decommission, public exposure containment, backup policies, and critical redundancy..."
              onChange={(e) => { setPlanNotes(e.target.value); onDirty(); }}
              className="w-full text-xs p-3 rounded-xl bg-black/30 border border-white/15 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50" />
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={handleExportCsv}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] font-bold transition-colors">
              <Download className="w-3.5 h-3.5" /><span>CSV</span>
            </button>
            <button type="button" onClick={handleExportJson}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] font-bold transition-colors">
              <FileJson className="w-3.5 h-3.5" /><span>JSON</span>
            </button>
          </div>

          <button type="button" onClick={handleSubmit}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold transition-all flex items-center justify-center gap-2">
            <Send className="w-4 h-4" />
            <span>Submit FinOps Plan</span>
          </button>
        </div>
      </div>
    </div>
  );
}
