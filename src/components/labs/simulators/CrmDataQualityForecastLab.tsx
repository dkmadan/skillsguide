'use client';

import { useMemo } from 'react';
import { LabScenarioVariant, LabDifficulty } from '@/lib/labs/types';
import { useUndoableState } from '@/lib/labs/useUndoableState';
import { downloadCsv, downloadJson } from '@/lib/labs/exportHelper';
import ChartFrame from '@/components/labs/charts/ChartFrame';
import TrendLineChart from '@/components/labs/charts/TrendLineChart';
import CompareBarChart from '@/components/labs/charts/CompareBarChart';
import {
  Undo2,
  Redo2,
  RotateCcw,
  Send,
  Download,
  FileJson,
  GitMerge,
  Wand2,
  AlertTriangle,
  CheckCircle2,
  Ban,
  LineChart as LineChartIcon,
  BarChart3,
  Database,
} from 'lucide-react';

interface SimulatorProps {
  scenario?: LabScenarioVariant;
  variant: LabDifficulty;
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

type RepairableStage = 'discovery' | 'proposal' | 'negotiation' | 'closed_won';
type PipelineStage = RepairableStage | 'unknown';

const STAGE_PROBABILITY: Record<RepairableStage, number> = {
  discovery: 0.2,
  proposal: 0.5,
  negotiation: 0.8,
  closed_won: 1,
};

const STAGE_ORDER: RepairableStage[] = ['discovery', 'proposal', 'negotiation', 'closed_won'];
const STAGE_LABEL: Record<PipelineStage, string> = {
  discovery: 'Discovery',
  proposal: 'Proposal',
  negotiation: 'Negotiation',
  closed_won: 'Closed Won',
  unknown: 'Unknown',
};

interface CrmDeal {
  id: string;
  account: string;
  contactEmail: string;
  amount: number | null;
  stage: PipelineStage;
  autoFilled?: boolean;
  autoStaged?: boolean;
}

// Three genuinely different synthetic pipelines — same lesson (duplicates,
// missing amounts, unrepaired stages) but increasing ambiguity per tier:
// more duplicate patterns (exact, typo'd amount, case-insensitive email) and
// more near-duplicates that must NOT be merged.
const DEAL_POOLS: Record<LabDifficulty, CrmDeal[]> = {
  beginner: [
    { id: 'deal-101', account: 'Acme Health Systems', contactEmail: 'procure@acmehealth.com', amount: 45000, stage: 'proposal' },
    { id: 'deal-102', account: 'Acme Health Systems', contactEmail: 'procure@acmehealth.com', amount: 45000, stage: 'discovery' }, // exact duplicate (same email + amount)
    { id: 'deal-103', account: 'BlueSky AI Corp', contactEmail: 'finance@bluesky.ai', amount: 80000, stage: 'negotiation' },
    { id: 'deal-104', account: 'Zeta Financial', contactEmail: 'ops@zetafin.com', amount: 25000, stage: 'discovery' },
    { id: 'deal-105', account: 'Omega Retail', contactEmail: 'it@omega.org', amount: 60000, stage: 'closed_won' },
    { id: 'deal-106', account: 'Nimbus Cloud', contactEmail: 'billing@nimbuscloud.io', amount: 32000, stage: 'proposal' },
    { id: 'deal-107', account: 'Vertex Analytics', contactEmail: 'contracts@vertexanalytics.com', amount: null, stage: 'negotiation' }, // missing amount
    { id: 'deal-108', account: 'Solstice Robotics', contactEmail: 'deals@solsticerobotics.com', amount: 54000, stage: 'unknown' }, // unrepaired stage
    { id: 'deal-109', account: 'Meridian Foods', contactEmail: 'buyer@meridianfoods.com', amount: 18000, stage: 'discovery' },
    { id: 'deal-110', account: 'Cobalt Freight', contactEmail: 'ap@cobaltfreight.com', amount: 41000, stage: 'proposal' },
    { id: 'deal-111', account: 'Lumen Energy', contactEmail: 'procurement@lumenenergy.com', amount: 97000, stage: 'negotiation' },
    { id: 'deal-112', account: 'Pioneer Biotech', contactEmail: 'grants@pioneerbiotech.com', amount: 63000, stage: 'closed_won' },
    { id: 'deal-113', account: 'Anchor Logistics', contactEmail: 'ops@anchorlogistics.com', amount: 28000, stage: 'discovery' },
    { id: 'deal-114', account: 'Crestwood Realty', contactEmail: 'leasing@crestwoodrealty.com', amount: 71000, stage: 'proposal' },
    { id: 'deal-115', account: 'Falcon Media', contactEmail: 'ads@falconmedia.com', amount: 15000, stage: 'discovery' },
    { id: 'deal-116', account: 'Ironclad Security', contactEmail: 'sales@ironcladsecurity.com', amount: 89000, stage: 'negotiation' },
    { id: 'deal-117', account: 'Juniper Health', contactEmail: 'intake@juniperhealth.com', amount: 37000, stage: 'proposal' },
    { id: 'deal-118', account: 'Kestrel Aerospace', contactEmail: 'vendor@kestrelaero.com', amount: 120000, stage: 'closed_won' },
    { id: 'deal-119', account: 'Lighthouse Finance', contactEmail: 'ops@lighthousefin.com', amount: 22000, stage: 'discovery' },
    { id: 'deal-120', account: 'Marlin Sports', contactEmail: 'gear@marlinsports.com', amount: 34000, stage: 'proposal' },
  ],
  intermediate: [
    { id: 'deal-201', account: 'Acme Health Systems', contactEmail: 'procure@acmehealth.com', amount: 46000, stage: 'proposal' },
    { id: 'deal-202', account: 'Acme Health Systems', contactEmail: 'procure@acmehealth.com', amount: 46000, stage: 'discovery' }, // duplicate #1
    { id: 'deal-203', account: 'BlueSky AI Corp', contactEmail: 'finance@bluesky.ai', amount: 82000, stage: 'negotiation' },
    { id: 'deal-204', account: 'BlueSky AI Corp', contactEmail: 'finance@bluesky.ai', amount: 82000, stage: 'proposal' }, // duplicate #2
    { id: 'deal-205', account: 'Zeta Financial', contactEmail: 'ops@zetafin.com', amount: 26000, stage: 'discovery' },
    { id: 'deal-206', account: 'Zeta Financial', contactEmail: 'ops.backup@zetafin.com', amount: 26500, stage: 'discovery' }, // similar account, different contact — NOT a duplicate
    { id: 'deal-207', account: 'Omega Retail', contactEmail: 'it@omega.org', amount: 61000, stage: 'closed_won' },
    { id: 'deal-208', account: 'Nimbus Cloud', contactEmail: 'billing@nimbuscloud.io', amount: 33000, stage: 'proposal' },
    { id: 'deal-209', account: 'Vertex Analytics', contactEmail: 'contracts@vertexanalytics.com', amount: null, stage: 'negotiation' }, // missing amount #1
    { id: 'deal-210', account: 'Solstice Robotics', contactEmail: 'deals@solsticerobotics.com', amount: 55000, stage: 'unknown' }, // unrepaired #1
    { id: 'deal-211', account: 'Meridian Foods', contactEmail: 'buyer@meridianfoods.com', amount: null, stage: 'discovery' }, // missing amount #2
    { id: 'deal-212', account: 'Cobalt Freight', contactEmail: 'ap@cobaltfreight.com', amount: 42000, stage: 'proposal' },
    { id: 'deal-213', account: 'Lumen Energy', contactEmail: 'procurement@lumenenergy.com', amount: 98000, stage: 'negotiation' },
    { id: 'deal-214', account: 'Pioneer Biotech', contactEmail: 'grants@pioneerbiotech.com', amount: 64000, stage: 'closed_won' },
    { id: 'deal-215', account: 'Anchor Logistics', contactEmail: 'ops@anchorlogistics.com', amount: 29000, stage: 'unknown' }, // unrepaired #2
    { id: 'deal-216', account: 'Crestwood Realty', contactEmail: 'leasing@crestwoodrealty.com', amount: 72000, stage: 'proposal' },
    { id: 'deal-217', account: 'Falcon Media', contactEmail: 'ads@falconmedia.com', amount: 16000, stage: 'discovery' },
    { id: 'deal-218', account: 'Ironclad Security', contactEmail: 'sales@ironcladsecurity.com', amount: 90000, stage: 'negotiation' },
    { id: 'deal-219', account: 'Juniper Health', contactEmail: 'intake@juniperhealth.com', amount: 38000, stage: 'proposal' },
    { id: 'deal-220', account: 'Kestrel Aerospace', contactEmail: 'vendor@kestrelaero.com', amount: 121000, stage: 'closed_won' },
    { id: 'deal-221', account: 'Lighthouse Finance', contactEmail: 'ops@lighthousefin.com', amount: 23000, stage: 'discovery' },
    { id: 'deal-222', account: 'Marlin Sports', contactEmail: 'gear@marlinsports.com', amount: 35000, stage: 'proposal' },
    { id: 'deal-223', account: 'Nova Publishing', contactEmail: 'rights@novapublishing.com', amount: 47000, stage: 'negotiation' },
    { id: 'deal-224', account: 'Halcyon Insurance', contactEmail: 'claims@halcyoninsure.com', amount: 56000, stage: 'discovery' },
    { id: 'deal-225', account: 'Driftwood Hospitality', contactEmail: 'events@driftwoodhg.com', amount: 31000, stage: 'proposal' },
    { id: 'deal-226', account: 'Sequoia Manufacturing', contactEmail: 'supply@sequoiamfg.com', amount: 68000, stage: 'negotiation' },
  ],
  challenge: [
    { id: 'deal-301', account: 'Acme Health Systems', contactEmail: 'procure@acmehealth.com', amount: 47000, stage: 'proposal' },
    { id: 'deal-302', account: 'Acme Health Systems', contactEmail: 'procure@acmehealth.com', amount: 47000, stage: 'discovery' }, // duplicate #1
    { id: 'deal-303', account: 'BlueSky AI Corp', contactEmail: 'finance@bluesky.ai', amount: 84000, stage: 'negotiation' },
    { id: 'deal-304', account: 'BlueSky AI Corp', contactEmail: 'finance@bluesky.ai', amount: 85000, stage: 'proposal' }, // duplicate #2 — amount typo, still same email
    { id: 'deal-305', account: 'Zeta Financial', contactEmail: 'ops@zetafin.com', amount: 27000, stage: 'discovery' },
    { id: 'deal-306', account: 'Zeta Financial', contactEmail: 'ops.backup@zetafin.com', amount: 27500, stage: 'discovery' }, // NOT a duplicate — different contact
    { id: 'deal-307', account: 'Omega Retail', contactEmail: 'it@omega.org', amount: 62000, stage: 'closed_won' },
    { id: 'deal-308', account: 'Omega Retail', contactEmail: 'IT@OMEGA.ORG', amount: 62000, stage: 'closed_won' }, // duplicate #3 — case-insensitive email match
    { id: 'deal-309', account: 'Nimbus Cloud', contactEmail: 'billing@nimbuscloud.io', amount: 34000, stage: 'proposal' },
    { id: 'deal-310', account: 'Vertex Analytics', contactEmail: 'contracts@vertexanalytics.com', amount: null, stage: 'negotiation' }, // missing amount #1
    { id: 'deal-311', account: 'Solstice Robotics', contactEmail: 'deals@solsticerobotics.com', amount: 56000, stage: 'unknown' }, // unrepaired #1
    { id: 'deal-312', account: 'Meridian Foods', contactEmail: 'buyer@meridianfoods.com', amount: null, stage: 'discovery' }, // missing amount #2
    { id: 'deal-313', account: 'Cobalt Freight', contactEmail: 'ap@cobaltfreight.com', amount: null, stage: 'proposal' }, // missing amount #3
    { id: 'deal-314', account: 'Lumen Energy', contactEmail: 'procurement@lumenenergy.com', amount: 99000, stage: 'negotiation' },
    { id: 'deal-315', account: 'Pioneer Biotech', contactEmail: 'grants@pioneerbiotech.com', amount: 65000, stage: 'closed_won' },
    { id: 'deal-316', account: 'Anchor Logistics', contactEmail: 'ops@anchorlogistics.com', amount: 30000, stage: 'unknown' }, // unrepaired #2
    { id: 'deal-317', account: 'Crestwood Realty', contactEmail: 'leasing@crestwoodrealty.com', amount: 73000, stage: 'unknown' }, // unrepaired #3
    { id: 'deal-318', account: 'Falcon Media', contactEmail: 'ads@falconmedia.com', amount: 17000, stage: 'discovery' },
    { id: 'deal-319', account: 'Ironclad Security', contactEmail: 'sales@ironcladsecurity.com', amount: 91000, stage: 'negotiation' },
    { id: 'deal-320', account: 'Juniper Health', contactEmail: 'intake@juniperhealth.com', amount: 39000, stage: 'proposal' },
    { id: 'deal-321', account: 'Kestrel Aerospace', contactEmail: 'vendor@kestrelaero.com', amount: 122000, stage: 'closed_won' },
    { id: 'deal-322', account: 'Lighthouse Finance', contactEmail: 'ops@lighthousefin.com', amount: 24000, stage: 'discovery' },
    { id: 'deal-323', account: 'Marlin Sports', contactEmail: 'gear@marlinsports.com', amount: 36000, stage: 'proposal' },
    { id: 'deal-324', account: 'Nova Publishing', contactEmail: 'rights@novapublishing.com', amount: 48000, stage: 'negotiation' },
    { id: 'deal-325', account: 'Halcyon Insurance', contactEmail: 'claims@halcyoninsure.com', amount: 57000, stage: 'discovery' },
    { id: 'deal-326', account: 'Driftwood Hospitality', contactEmail: 'events@driftwoodhg.com', amount: 32000, stage: 'proposal' },
    { id: 'deal-327', account: 'Sequoia Manufacturing', contactEmail: 'supply@sequoiamfg.com', amount: 69000, stage: 'negotiation' },
    { id: 'deal-328', account: 'Blackrock Textiles', contactEmail: 'orders@blackrocktextile.com', amount: 41000, stage: 'discovery' },
    { id: 'deal-329', account: 'Amberline Studios', contactEmail: 'licensing@amberlinestudios.com', amount: 53000, stage: 'proposal' },
    { id: 'deal-330', account: 'Redwood Analytics', contactEmail: 'data@redwoodanalytics.com', amount: 76000, stage: 'negotiation' },
    { id: 'deal-331', account: 'Silverpeak Capital', contactEmail: 'invest@silverpeakcap.com', amount: 88000, stage: 'closed_won' },
    { id: 'deal-332', account: 'Timberline Foods', contactEmail: 'purchasing@timberlinefoods.com', amount: 20000, stage: 'discovery' },
  ],
};

// Automation only ever touches a capped number of records per run — an
// explicit, visible limit rather than an unbounded background sweep.
const AUTOMATION_STEP_CAP = 5;

function normalizeKey(s: string): string {
  return s.trim().toLowerCase();
}

function groupKey(deals: CrmDeal[]): string {
  return deals.map((d) => d.id).sort().join('|');
}

// Normalized exact email OR ID matching — case/whitespace-insensitive, never
// fuzzy — so legitimately distinct accounts are never silently conflated.
function findDuplicateGroups(deals: CrmDeal[]): CrmDeal[][] {
  const byEmail = new Map<string, CrmDeal[]>();
  const byId = new Map<string, CrmDeal[]>();
  deals.forEach((d) => {
    const email = normalizeKey(d.contactEmail);
    if (!byEmail.has(email)) byEmail.set(email, []);
    byEmail.get(email)!.push(d);
    const id = normalizeKey(d.id);
    if (!byId.has(id)) byId.set(id, []);
    byId.get(id)!.push(d);
  });
  const seen = new Set<string>();
  const groups: CrmDeal[][] = [];
  [...byEmail.values(), ...byId.values()].forEach((group) => {
    if (group.length > 1) {
      const key = groupKey(group);
      if (!seen.has(key)) {
        seen.add(key);
        groups.push(group);
      }
    }
  });
  return groups;
}

interface WorkspaceState {
  deals: CrmDeal[];
  reviewedGroups: Record<string, 'merged' | 'not_duplicate'>;
  rules: { fillMissingAmount: boolean; defaultUnknownStage: boolean };
}

export default function CrmDataQualityForecastLab({ variant, onDirty, onSubmit }: SimulatorProps) {
  const rawDeals = DEAL_POOLS[variant];

  const initialState: WorkspaceState = useMemo(
    () => ({ deals: rawDeals, reviewedGroups: {}, rules: { fillMissingAmount: false, defaultUnknownStage: false } }),
    [rawDeals]
  );

  const { state, set, undo, redo, reset, canUndo, canRedo, stepIndex } = useUndoableState<WorkspaceState>(initialState);

  // Duplicate candidates detected in the ORIGINAL raw batch — a fixed baseline
  // so "reviewed vs pending" always compares against the true starting count,
  // even as merges shrink the live deals array.
  const detectedGroups = useMemo(() => findDuplicateGroups(rawDeals), [rawDeals]);
  const liveGroups = useMemo(() => findDuplicateGroups(state.deals), [state.deals]);
  const pendingGroups = useMemo(
    () => liveGroups.filter((g) => state.reviewedGroups[groupKey(g)] !== 'not_duplicate'),
    [liveGroups, state.reviewedGroups]
  );

  const mergeGroup = (group: CrmDeal[], keepId: string) => {
    const key = groupKey(group);
    set((prev) => ({
      ...prev,
      deals: prev.deals.filter((d) => !group.some((g) => g.id === d.id) || d.id === keepId),
      reviewedGroups: { ...prev.reviewedGroups, [key]: 'merged' },
    }));
    onDirty();
  };

  const markNotDuplicate = (group: CrmDeal[]) => {
    const key = groupKey(group);
    set((prev) => ({ ...prev, reviewedGroups: { ...prev.reviewedGroups, [key]: 'not_duplicate' } }));
    onDirty();
  };

  const repairStage = (id: string, stage: RepairableStage) => {
    set((prev) => ({ ...prev, deals: prev.deals.map((d) => (d.id === id ? { ...d, stage, autoStaged: false } : d)) }));
    onDirty();
  };

  const setAmount = (id: string, amount: number) => {
    set((prev) => ({ ...prev, deals: prev.deals.map((d) => (d.id === id ? { ...d, amount, autoFilled: false } : d)) }));
    onDirty();
  };

  const toggleRule = (rule: keyof WorkspaceState['rules']) => {
    set((prev) => ({ ...prev, rules: { ...prev.rules, [rule]: !prev.rules[rule] } }));
    onDirty();
  };

  const runAutomation = () => {
    set((prev) => {
      let cap = AUTOMATION_STEP_CAP;
      let deals = prev.deals.map((d) => ({ ...d }));
      if (prev.rules.fillMissingAmount) {
        const known = deals.filter((d) => d.amount != null).map((d) => d.amount as number);
        const fallback = known.length ? Math.round(known.reduce((a, b) => a + b, 0) / known.length) : 0;
        deals = deals.map((d) => {
          if (d.amount == null && cap > 0) {
            cap -= 1;
            return { ...d, amount: fallback, autoFilled: true };
          }
          return d;
        });
      }
      if (prev.rules.defaultUnknownStage) {
        deals = deals.map((d) => {
          if (d.stage === 'unknown' && cap > 0) {
            cap -= 1;
            return { ...d, stage: 'discovery', autoStaged: true };
          }
          return d;
        });
      }
      return { ...prev, deals };
    });
    onDirty();
  };

  const metrics = useMemo(() => {
    const deals = state.deals;
    const withAmount = deals.filter((d) => d.amount != null);
    const missingAmountCount = deals.length - withAmount.length;
    const unweightedTotal = withAmount.reduce((s, d) => s + (d.amount as number), 0);
    const knownStageWithAmount = withAmount.filter((d): d is CrmDeal & { stage: RepairableStage } => d.stage !== 'unknown');
    const weightedTotal = knownStageWithAmount.reduce((s, d) => s + (d.amount as number) * STAGE_PROBABILITY[d.stage], 0);
    const unknownStageCount = deals.filter((d) => d.stage === 'unknown').length;
    const byStage = STAGE_ORDER.map((stage) => {
      const stageDeals = withAmount.filter((d) => d.stage === stage);
      return {
        stage,
        count: stageDeals.length,
        unweighted: stageDeals.reduce((s, d) => s + (d.amount as number), 0),
        weighted: Math.round(stageDeals.reduce((s, d) => s + (d.amount as number) * STAGE_PROBABILITY[stage], 0)),
      };
    });
    return { unweightedTotal, weightedTotal: Math.round(weightedTotal), missingAmountCount, unknownStageCount, byStage, dealCount: deals.length };
  }, [state.deals]);

  const eligibleForAutomation = state.deals.filter(
    (d) => (state.rules.fillMissingAmount && d.amount == null) || (state.rules.defaultUnknownStage && d.stage === 'unknown')
  ).length;

  const handleExportCsv = () => {
    downloadCsv(
      'crm_cleaned_pipeline.csv',
      state.deals.map((d) => ({
        deal_id: d.id,
        account: d.account,
        email: d.contactEmail,
        amount: d.amount ?? '',
        stage: d.stage,
        weighted_amount: d.amount != null && d.stage !== 'unknown' ? Math.round(d.amount * STAGE_PROBABILITY[d.stage]) : '',
      }))
    );
  };

  const handleExportJson = () => {
    downloadJson('crm_rules_and_forecast.json', {
      variant,
      rules: state.rules,
      automationStepCap: AUTOMATION_STEP_CAP,
      forecastByStage: metrics.byStage,
      unweightedTotal: metrics.unweightedTotal,
      weightedTotal: metrics.weightedTotal,
    });
  };

  const handleSubmit = () => {
    onSubmit({
      cleanedDeals: state.deals,
      reviewedGroups: state.reviewedGroups,
      duplicateGroupsDetectedCount: detectedGroups.length,
      pendingDuplicateCount: pendingGroups.length,
      unweightedTotal: metrics.unweightedTotal,
      weightedTotal: metrics.weightedTotal,
      missingAmountCount: metrics.missingAmountCount,
      unknownStageCount: metrics.unknownStageCount,
      automationRulesApplied: Object.entries(state.rules).filter(([, v]) => v).map(([k]) => k),
      automationStepCap: AUTOMATION_STEP_CAP,
      forecastByStage: metrics.byStage,
      stepIndex,
    });
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Gross Unweighted Pipeline</span>
          <span className="text-xl font-black text-white">${metrics.unweightedTotal.toLocaleString()}</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Face value of open deals</span>
        </div>
        <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30">
          <span className="text-xs text-cyan-300 font-bold block mb-1">Weighted Forecast</span>
          <span className="text-xl font-black text-cyan-200">${metrics.weightedTotal.toLocaleString()}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Sum of (Amount × Stage %)</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Duplicate Review</span>
          <span className={`text-xl font-black flex items-center gap-1 ${pendingGroups.length > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {pendingGroups.length > 0 ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            {pendingGroups.length} Pending
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">{detectedGroups.length} candidate group(s) found</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Data Quality Gaps</span>
          <span className="text-xl font-black text-amber-300">{metrics.missingAmountCount + metrics.unknownStageCount}</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">{metrics.missingAmountCount} missing amount · {metrics.unknownStageCount} unrepaired stage</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: duplicate review, automation, grid */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
                <GitMerge className="w-4 h-4 text-cyan-400" />
                <span>1. Duplicate Candidate Review ({state.deals.length} live records)</span>
              </h2>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={undo} disabled={!canUndo} title="Undo last action"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30 transition-colors">
                  <Undo2 className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={redo} disabled={!canRedo} title="Redo"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30 transition-colors">
                  <Redo2 className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => { reset(); onDirty(); }} title="Reset pipeline"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors">
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {pendingGroups.length === 0 ? (
              <p className="text-xs text-emerald-300 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> No pending duplicate candidates. History step {stepIndex}.</p>
            ) : (
              <div className="space-y-3">
                {pendingGroups.map((group) => (
                  <div key={groupKey(group)} className="p-3 rounded-2xl bg-amber-950/10 border border-amber-500/30 space-y-2">
                    <p className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> Normalized email/ID match — review before acting, never silently delete.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {group.map((d) => (
                        <div key={d.id} className="p-2.5 rounded-xl bg-black/30 border border-white/10 text-[11px] space-y-0.5">
                          <p className="font-mono text-cyan-300">{d.id}</p>
                          <p className="font-semibold text-white">{d.account}</p>
                          <p className="text-slate-400">{d.contactEmail}</p>
                          <p className="text-slate-400">${d.amount?.toLocaleString() ?? 'missing'} · {STAGE_LABEL[d.stage]}</p>
                          <button type="button" onClick={() => mergeGroup(group, d.id)}
                            className="mt-1 w-full text-[10px] font-bold py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-200 transition-colors">
                            Keep this record, merge others
                          </button>
                        </div>
                      ))}
                    </div>
                    <button type="button" onClick={() => markNotDuplicate(group)}
                      className="w-full flex items-center justify-center gap-1.5 text-[10px] font-bold py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-colors">
                      <Ban className="w-3 h-3" /> Not a duplicate — these are distinct opportunities
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-cyan-400" />
              <span>2. Fixed-Rule Automation Builder (cap {AUTOMATION_STEP_CAP} records/run)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button type="button" onClick={() => toggleRule('fillMissingAmount')}
                className={`p-3 rounded-2xl border text-xs font-bold text-left transition-all flex flex-col gap-1 ${state.rules.fillMissingAmount ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}>
                <span>Fill Missing Amounts</span>
                <span className="text-[10px] font-normal text-slate-400">Assign the average known deal amount</span>
              </button>
              <button type="button" onClick={() => toggleRule('defaultUnknownStage')}
                className={`p-3 rounded-2xl border text-xs font-bold text-left transition-all flex flex-col gap-1 ${state.rules.defaultUnknownStage ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}>
                <span>Default Unknown Stage → Discovery</span>
                <span className="text-[10px] font-normal text-slate-400">Conservative lowest-probability default</span>
              </button>
            </div>
            <button type="button" onClick={runAutomation} disabled={eligibleForAutomation === 0}
              className="w-full py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 text-cyan-200 text-[11px] font-bold disabled:opacity-30 transition-colors">
              Run Automation on up to {Math.min(AUTOMATION_STEP_CAP, eligibleForAutomation)} of {eligibleForAutomation} eligible synthetic record(s)
            </button>
          </div>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              <span>3. Opportunities Data Grid</span>
            </h3>
            <div className="overflow-x-auto max-h-80 overflow-y-auto rounded-xl border border-white/5">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 text-[11px] sticky top-0 bg-[#111425]">
                    <th className="p-2">ID</th><th className="p-2">Account</th><th className="p-2">Email</th>
                    <th className="p-2 text-right">Amount</th><th className="p-2">Stage</th><th className="p-2 text-right">Weighted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {state.deals.map((d) => (
                    <tr key={d.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-2 font-mono text-cyan-300">{d.id}</td>
                      <td className="p-2 font-semibold text-white">{d.account}</td>
                      <td className="p-2 text-slate-400">{d.contactEmail}</td>
                      <td className="p-2 text-right font-mono">
                        {d.amount == null ? (
                          <span className="inline-flex items-center gap-1">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-300">MISSING</span>
                            <input type="number" placeholder="amount" aria-label={`Set amount for ${d.id}`}
                              onKeyDown={(e) => { if (e.key === 'Enter') { const v = Number((e.target as HTMLInputElement).value); if (v > 0) setAmount(d.id, v); } }}
                              className="w-16 text-[10px] px-1 py-0.5 rounded bg-black/40 border border-white/15 text-slate-200" />
                          </span>
                        ) : (
                          <span className={d.autoFilled ? 'text-amber-300' : ''}>${d.amount.toLocaleString()}</span>
                        )}
                      </td>
                      <td className="p-2">
                        {d.stage === 'unknown' ? (
                          <select aria-label={`Repair stage for ${d.id}`} defaultValue=""
                            onChange={(e) => { if (e.target.value) repairStage(d.id, e.target.value as RepairableStage); }}
                            className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-500/20 border border-red-500/40 text-red-200">
                            <option value="" disabled>Repair stage…</option>
                            {STAGE_ORDER.map((s) => <option key={s} value={s}>{STAGE_LABEL[s]}</option>)}
                          </select>
                        ) : (
                          <span className={`text-[11px] ${d.autoStaged ? 'text-amber-300' : 'text-slate-300'}`}>{STAGE_LABEL[d.stage]}</span>
                        )}
                      </td>
                      <td className="p-2 text-right font-mono text-slate-300">
                        {d.amount != null && d.stage !== 'unknown' ? `$${Math.round(d.amount * STAGE_PROBABILITY[d.stage]).toLocaleString()}` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: charts, exports, submit */}
        <div className="lg:col-span-5 space-y-4">
          <ChartFrame
            title="Weighted vs Unweighted Forecast by Stage"
            icon={<LineChartIcon className="w-4 h-4 text-cyan-400" />}
            tableHeaders={['Stage', 'Unweighted', 'Weighted']}
            tableRows={metrics.byStage.map((s) => [STAGE_LABEL[s.stage], s.unweighted, s.weighted])}
          >
            <TrendLineChart
              labels={metrics.byStage.map((s) => STAGE_LABEL[s.stage])}
              series={[
                { label: 'Unweighted', data: metrics.byStage.map((s) => s.unweighted) },
                { label: 'Weighted', data: metrics.byStage.map((s) => s.weighted), fill: true },
              ]}
              yLabel="Amount ($)"
            />
          </ChartFrame>

          <ChartFrame
            title="Stage Funnel (Deal Count)"
            icon={<BarChart3 className="w-4 h-4 text-cyan-400" />}
            tableHeaders={['Stage', 'Deals']}
            tableRows={metrics.byStage.map((s) => [STAGE_LABEL[s.stage], s.count])}
          >
            <CompareBarChart
              labels={metrics.byStage.map((s) => STAGE_LABEL[s.stage])}
              series={[{ label: 'Deals in Stage', data: metrics.byStage.map((s) => s.count) }]}
              yLabel="Deal Count"
            />
          </ChartFrame>

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
            <span>Submit Forecast</span>
          </button>
        </div>
      </div>
    </div>
  );
}
