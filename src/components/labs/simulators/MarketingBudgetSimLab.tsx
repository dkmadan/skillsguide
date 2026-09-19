'use client';

import { useMemo, useState } from 'react';
import { LabScenarioVariant, LabDifficulty } from '@/lib/labs/types';
import { useUndoableState } from '@/lib/labs/useUndoableState';
import { downloadCsv, downloadJson } from '@/lib/labs/exportHelper';
import SimClock from '@/components/labs/SimClock';
import ChartFrame from '@/components/labs/charts/ChartFrame';
import TrendLineChart from '@/components/labs/charts/TrendLineChart';
import CompareBarChart from '@/components/labs/charts/CompareBarChart';
import BreakdownDoughnutChart from '@/components/labs/charts/BreakdownDoughnutChart';
import {
  DollarSign,
  TrendingUp,
  Users,
  Eye,
  Sparkles,
  Layers,
  Send,
  Undo2,
  Redo2,
  RotateCcw,
  Download,
  FileJson,
  Info,
  Megaphone,
} from 'lucide-react';

interface SimulatorProps {
  scenario?: LabScenarioVariant;
  variant: LabDifficulty;
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

type ChannelId = 'meta' | 'google' | 'linkedin';

interface CreativeVariant {
  id: string;
  label: string;
  preview: string;
  ctrBonus: number;
  convBonus: number;
}

interface Channel {
  id: ChannelId;
  name: string;
  blurb: string;
  cpm: number;
  ctr: number;
  conversionRate: number;
  creativeVariants: CreativeVariant[];
}

interface AudienceSegment {
  id: string;
  label: string;
  description: string;
  ctrMultiplier: number;
  convMultiplier: number;
  cpmMultiplier: number;
}

interface MarketingFixture {
  label: string;
  totalBudget: number;
  targetLeads: number;
  targetCpl: number;
  maxChannelShare: number;
  minChannelsUsed: number;
  channelMinSpend: Partial<Record<ChannelId, number>>;
  channels: Channel[];
  audiences: AudienceSegment[];
}

// Three genuinely different fixture pools keyed by variant. Increasing
// ambiguity: tighter targets, mandatory per-channel minimums, and creative /
// audience options whose trade-offs require real computation rather than an
// obviously-best pick.
const FIXTURES: Record<LabDifficulty, MarketingFixture> = {
  beginner: {
    label: 'B2B SaaS Launch Campaign (Balanced Budget)',
    totalBudget: 100000,
    targetLeads: 150,
    targetCpl: 700,
    maxChannelShare: 0.75,
    minChannelsUsed: 2,
    channelMinSpend: {},
    channels: [
      {
        id: 'meta', name: 'Meta Ads (Facebook & Instagram)', blurb: 'Top-of-funnel reach', cpm: 120, ctr: 0.018, conversionRate: 0.040,
        creativeVariants: [
          { id: 'meta_v1', label: 'Video Showcase', preview: 'Ad Preview: "See it in action" — 15s product walkthrough — CTA: Learn More', ctrBonus: 0.003, convBonus: 0.005 },
          { id: 'meta_v2', label: 'Static Carousel', preview: 'Ad Preview: 4-panel feature carousel — CTA: Explore Features', ctrBonus: 0, convBonus: 0 },
        ],
      },
      {
        id: 'google', name: 'Google Search Ads', blurb: 'High-intent searchers', cpm: 240, ctr: 0.038, conversionRate: 0.065,
        creativeVariants: [
          { id: 'goog_v1', label: 'Solution Intent Keywords', preview: 'Headline: "Deterministic Practice Labs for Teams" — CTA: Start Free Trial', ctrBonus: 0.005, convBonus: 0.010 },
          { id: 'goog_v2', label: 'Competitor Alternatives', preview: 'Headline: "A Better Alternative to Legacy LMS" — CTA: Compare Plans', ctrBonus: -0.005, convBonus: -0.005 },
        ],
      },
      {
        id: 'linkedin', name: 'LinkedIn Sponsored Content', blurb: 'Enterprise decision makers', cpm: 460, ctr: 0.014, conversionRate: 0.095,
        creativeVariants: [
          { id: 'li_v1', label: 'Executive Whitepaper', preview: 'Sponsored post: "The ROI of Verified Practice" whitepaper download — CTA: Get the Report', ctrBonus: 0.002, convBonus: 0.015 },
          { id: 'li_v2', label: 'Direct Product Demo', preview: 'Sponsored post: 90-second product demo — CTA: Book a Demo', ctrBonus: -0.002, convBonus: -0.005 },
        ],
      },
    ],
    audiences: [
      { id: 'broad', label: 'Broad Prospecting', description: 'Wide net across the category, unqualified.', ctrMultiplier: 1.0, convMultiplier: 1.0, cpmMultiplier: 1.0 },
      { id: 'retarget', label: 'Warm Retargeting List', description: 'Site visitors from the last 30 days.', ctrMultiplier: 1.20, convMultiplier: 1.30, cpmMultiplier: 1.15 },
      { id: 'lookalike', label: 'Lookalike Precision', description: 'Modeled on existing paying customers.', ctrMultiplier: 1.08, convMultiplier: 1.12, cpmMultiplier: 1.05 },
    ],
  },
  intermediate: {
    label: 'Q4 Mid-Market Enterprise Push',
    totalBudget: 100000,
    targetLeads: 175,
    targetCpl: 600,
    maxChannelShare: 0.70,
    minChannelsUsed: 3,
    channelMinSpend: { meta: 10000, google: 10000, linkedin: 10000 },
    channels: [
      {
        id: 'meta', name: 'Meta Ads (Facebook & Instagram)', blurb: 'Elevated Q4 CPMs', cpm: 140, ctr: 0.020, conversionRate: 0.042,
        creativeVariants: [
          { id: 'meta_v1', label: 'UGC Video Review', preview: 'Ad Preview: customer testimonial clip — CTA: Watch Their Story', ctrBonus: 0.006, convBonus: 0.004 },
          { id: 'meta_v2', label: 'Founder-Led Story Ad', preview: 'Ad Preview: founder-to-camera narrative — CTA: Learn Why We Built This', ctrBonus: 0.002, convBonus: 0.009 },
        ],
      },
      {
        id: 'google', name: 'Google Search Ads', blurb: 'Elevated Q4 CPMs', cpm: 260, ctr: 0.040, conversionRate: 0.070,
        creativeVariants: [
          { id: 'goog_v1', label: 'Exact-Match Case Studies', preview: 'Headline: "See the Case Study" — CTA: Read the Results', ctrBonus: 0.006, convBonus: 0.012 },
          { id: 'goog_v2', label: 'Broad Modified Keywords', preview: 'Headline: "Practice Labs for Every Team" — CTA: Browse Plans', ctrBonus: 0.010, convBonus: -0.006 },
        ],
      },
      {
        id: 'linkedin', name: 'LinkedIn Sponsored Content', blurb: 'Elevated Q4 CPMs', cpm: 520, ctr: 0.015, conversionRate: 0.100,
        creativeVariants: [
          { id: 'li_v1', label: 'Executive Thought Leadership', preview: 'Sponsored post: exec byline article — CTA: Read the Article', ctrBonus: 0.003, convBonus: 0.015 },
          { id: 'li_v2', label: 'Interactive ROI Calculator', preview: 'Sponsored post: embedded ROI calculator — CTA: Calculate Your Savings', ctrBonus: 0.007, convBonus: 0.006 },
        ],
      },
    ],
    audiences: [
      { id: 'broad', label: 'Broad Prospecting', description: 'Wide net across the category, unqualified.', ctrMultiplier: 1.0, convMultiplier: 1.0, cpmMultiplier: 1.0 },
      { id: 'retarget', label: 'Warm Retargeting List', description: 'Site visitors from the last 30 days.', ctrMultiplier: 1.15, convMultiplier: 1.22, cpmMultiplier: 1.20 },
      { id: 'intent', label: 'High-Intent Segment', description: 'Engaged with pricing or demo pages.', ctrMultiplier: 1.10, convMultiplier: 1.18, cpmMultiplier: 1.12 },
    ],
  },
  challenge: {
    label: 'Hyper-Growth Scaled Acquisition (Strict Caps)',
    totalBudget: 100000,
    targetLeads: 190,
    targetCpl: 550,
    maxChannelShare: 0.65,
    minChannelsUsed: 3,
    channelMinSpend: { meta: 20000 },
    channels: [
      {
        id: 'meta', name: 'Meta Ads (Facebook & Instagram)', blurb: 'Mandatory minimum spend', cpm: 160, ctr: 0.019, conversionRate: 0.038,
        creativeVariants: [
          { id: 'meta_v1', label: 'Short-Form Vertical Video', preview: 'Ad Preview: 9-second vertical hook — CTA: Try It Now', ctrBonus: 0.010, convBonus: 0.002 },
          { id: 'meta_v2', label: 'Customer Proof Carousel', preview: 'Ad Preview: 5-panel customer results carousel — CTA: See Results', ctrBonus: 0.003, convBonus: 0.011 },
        ],
      },
      {
        id: 'google', name: 'Google Search Ads', blurb: 'Highly competitive auction', cpm: 300, ctr: 0.042, conversionRate: 0.072,
        creativeVariants: [
          { id: 'goog_v1', label: 'Branded Exact-Match', preview: 'Headline: "SkillsGuide — Official Site" — CTA: Sign Up Free', ctrBonus: 0.004, convBonus: 0.016 },
          { id: 'goog_v2', label: 'Aggressive Broad Match', preview: 'Headline: "Learn Any Job Skill Online" — CTA: Get Started', ctrBonus: 0.014, convBonus: -0.010 },
        ],
      },
      {
        id: 'linkedin', name: 'LinkedIn Sponsored Content', blurb: 'Premium enterprise inventory', cpm: 600, ctr: 0.016, conversionRate: 0.105,
        creativeVariants: [
          { id: 'li_v1', label: 'Gated Executive Report', preview: 'Sponsored post: gated benchmark report — CTA: Download the Report', ctrBonus: 0.002, convBonus: 0.018 },
          { id: 'li_v2', label: 'Conversational InMail', preview: 'Sponsored InMail: 1:1 conversational opener — CTA: Reply to Learn More', ctrBonus: 0.009, convBonus: 0.003 },
        ],
      },
    ],
    audiences: [
      { id: 'broad', label: 'Broad Prospecting', description: 'Wide net across the category, unqualified.', ctrMultiplier: 1.0, convMultiplier: 1.0, cpmMultiplier: 1.0 },
      { id: 'retarget', label: 'Warm Retargeting List', description: 'Site visitors from the last 30 days.', ctrMultiplier: 1.12, convMultiplier: 1.28, cpmMultiplier: 1.25 },
      { id: 'lookalike_trap', label: 'Aggressive Lookalike Expansion', description: 'Loosened match threshold for scale — inflates clicks, dilutes intent.', ctrMultiplier: 1.35, convMultiplier: 0.85, cpmMultiplier: 1.10 },
    ],
  },
};

/**
 * Pure channel-volume formula shared by the assessment's verification case:
 * spend 1000, CPM 100, CTR 0.02, conversion 0.05 -> 10000 impressions,
 * 200 clicks, 10 leads. impressions = spend / CPM * 1000; clicks =
 * impressions * CTR; leads = clicks * conversion.
 */
function computeVolumes(spend: number, cpm: number, ctr: number, conversionRate: number) {
  const impressions = cpm > 0 ? (spend / cpm) * 1000 : 0;
  const clicks = impressions * Math.max(0, ctr);
  const leads = clicks * Math.max(0, conversionRate);
  return { impressions, clicks, leads };
}

/** Deterministic pseudo-random hash in [0.75, 1.25] — seeds daily variation without Math.random. */
function seededWeight(day: number, salt: number): number {
  const x = Math.sin(day * 12.9898 + salt * 78.233) * 43758.5453;
  const frac = x - Math.floor(x);
  return 0.75 + frac * 0.5;
}

interface AllocationState {
  channelBudgets: Record<ChannelId, number>;
  selectedCreatives: Record<ChannelId, string>;
  audienceId: string;
}

function initialAllocation(fixture: MarketingFixture): AllocationState {
  const share = fixture.totalBudget / fixture.channels.length;
  const channelBudgets = {} as Record<ChannelId, number>;
  const selectedCreatives = {} as Record<ChannelId, string>;
  fixture.channels.forEach((ch) => {
    channelBudgets[ch.id] = Math.round(share / 2500) * 2500;
    selectedCreatives[ch.id] = ch.creativeVariants[0].id;
  });
  return { channelBudgets, selectedCreatives, audienceId: fixture.audiences[0].id };
}

export default function MarketingBudgetSimLab({ variant, onDirty, onSubmit }: SimulatorProps) {
  const fixture = FIXTURES[variant];
  const { state, set, undo, redo, reset, canUndo, canRedo, stepIndex, history } = useUndoableState<AllocationState>(initialAllocation(fixture));
  const [currentDay, setCurrentDay] = useState(0);
  const [strategyNotes, setStrategyNotes] = useState(
    'Allocated highest-intent spend to Search, supported by top-funnel video branding and a warm/lookalike audience layer for decision-maker conversions.'
  );

  const totalAllocated = fixture.channels.reduce((sum, ch) => sum + (state.channelBudgets[ch.id] || 0), 0);
  const budgetRemaining = fixture.totalBudget - totalAllocated;
  const audience = fixture.audiences.find((a) => a.id === state.audienceId) ?? fixture.audiences[0];

  const perChannel = useMemo(() => {
    return fixture.channels.map((ch) => {
      const spend = state.channelBudgets[ch.id] || 0;
      const creative = ch.creativeVariants.find((c) => c.id === state.selectedCreatives[ch.id]) ?? ch.creativeVariants[0];
      const ctr = (ch.ctr + creative.ctrBonus) * audience.ctrMultiplier;
      const conv = (ch.conversionRate + creative.convBonus) * audience.convMultiplier;
      const cpm = ch.cpm * audience.cpmMultiplier;
      const { impressions, clicks, leads } = computeVolumes(spend, cpm, ctr, conv);
      return { channel: ch, spend, creative, impressions, clicks, leads };
    });
  }, [fixture, state.channelBudgets, state.selectedCreatives, audience]);

  const fullTotals = useMemo(() => {
    const impressions = perChannel.reduce((s, p) => s + p.impressions, 0);
    const clicks = perChannel.reduce((s, p) => s + p.clicks, 0);
    const leads = perChannel.reduce((s, p) => s + p.leads, 0);
    return { impressions, clicks, leads: Math.round(leads) };
  }, [perChannel]);

  // 30-day seeded daily weight series, normalized so the sum of weights == 30
  // (i.e. cumulative reveal at day 30 exactly equals fullTotals).
  const dayWeights = useMemo(() => {
    const raw = Array.from({ length: 30 }, (_, i) => seededWeight(i + 1, totalAllocated + (variant.length * 7)));
    const avg = raw.reduce((s, w) => s + w, 0) / raw.length;
    return raw.map((w) => w / avg);
  }, [totalAllocated, variant]);

  const dailyLeadSeries = useMemo(() => {
    return dayWeights.map((w) => (fullTotals.leads / 30) * w);
  }, [dayWeights, fullTotals.leads]);

  const cumulativeFraction = useMemo(() => {
    const revealedWeightSum = dayWeights.slice(0, currentDay).reduce((s, w) => s + w, 0);
    return currentDay === 0 ? 0 : revealedWeightSum / 30;
  }, [dayWeights, currentDay]);

  const revealed = useMemo(() => ({
    impressions: Math.round(fullTotals.impressions * cumulativeFraction),
    clicks: Math.round(fullTotals.clicks * cumulativeFraction),
    leads: Math.round(fullTotals.leads * cumulativeFraction),
    spend: Math.round(totalAllocated * cumulativeFraction),
  }), [fullTotals, cumulativeFraction, totalAllocated]);

  const cpl = revealed.leads > 0 ? Math.round(revealed.spend / revealed.leads) : 0;

  const update = (patch: Partial<AllocationState>) => {
    set((prev) => ({ ...prev, ...patch }));
    onDirty();
  };

  const setChannelBudget = (id: ChannelId, value: number) => update({ channelBudgets: { ...state.channelBudgets, [id]: value } });
  const setCreative = (id: ChannelId, creativeId: string) => update({ selectedCreatives: { ...state.selectedCreatives, [id]: creativeId } });

  const channelsUsed = fixture.channels.filter((ch) => (state.channelBudgets[ch.id] || 0) > 0).length;
  const maxChannelShare = totalAllocated > 0 ? Math.max(...fixture.channels.map((ch) => (state.channelBudgets[ch.id] || 0) / totalAllocated)) : 0;

  const handleExportCsv = () => {
    downloadCsv('marketing_budget_daily_results.csv', dailyLeadSeries.map((leads, i) => ({
      day: i + 1, estimated_daily_leads: Math.round(leads), revealed: i < currentDay ? 'yes' : 'no',
    })));
  };

  const handleExportJson = () => {
    downloadJson('marketing_budget_campaign_plan.json', {
      variant,
      campaignPlan: { channelBudgets: state.channelBudgets, selectedCreatives: state.selectedCreatives, audienceId: state.audienceId },
      optimizationHistory: history,
      simulatedResults: { daysSimulated: currentDay, revealed, fullTotals, cpl },
      strategyNotes,
    });
  };

  const handleSubmit = () => {
    onSubmit({
      variant,
      channelBudgets: state.channelBudgets,
      selectedCreatives: state.selectedCreatives,
      audienceId: state.audienceId,
      totalSpend: totalAllocated,
      daysSimulated: currentDay,
      dailyLeadSeries: dailyLeadSeries.slice(0, currentDay).map((v) => Math.round(v)),
      totalLeads: revealed.leads,
      cpl,
      optimizationHistoryLength: history.length,
      strategyNotes,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mb-1"><DollarSign className="w-4 h-4 text-emerald-400" /><span>Spend / Budget</span></div>
          <div className="text-lg sm:text-xl font-black text-white">{totalAllocated.toLocaleString()} <span className="text-xs text-slate-400 font-normal">/ {fixture.totalBudget.toLocaleString()}</span></div>
          <span className={`text-[10px] font-bold ${budgetRemaining < 0 ? 'text-red-400' : 'text-emerald-400'}`}>{budgetRemaining >= 0 ? `${budgetRemaining.toLocaleString()} remaining` : 'Over budget limit!'}</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mb-1"><Eye className="w-4 h-4 text-indigo-400" /><span>Impressions (to date)</span></div>
          <div className="text-lg sm:text-xl font-black text-white">{revealed.impressions.toLocaleString()}</div>
          <span className="text-[10px] text-slate-400">Day {currentDay}/30</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mb-1"><Megaphone className="w-4 h-4 text-cyan-400" /><span>Clicks (to date)</span></div>
          <div className="text-lg sm:text-xl font-black text-white">{revealed.clicks.toLocaleString()}</div>
          <span className="text-[10px] text-slate-400">Traffic generated</span>
        </div>
        <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30">
          <div className="flex items-center gap-1.5 text-purple-300 text-xs font-bold mb-1"><Users className="w-4 h-4 text-purple-400" /><span>Qualified Leads</span></div>
          <div className="text-xl sm:text-2xl font-black text-purple-200">{revealed.leads} <span className="text-xs font-normal text-slate-400">/ {fixture.targetLeads} target</span></div>
          <span className={`text-[10px] font-bold ${revealed.leads >= fixture.targetLeads ? 'text-emerald-400' : 'text-amber-400'}`}>{revealed.leads >= fixture.targetLeads ? 'Target achieved' : `${fixture.targetLeads - revealed.leads} needed`}</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10 col-span-2 md:col-span-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mb-1"><TrendingUp className="w-4 h-4 text-amber-400" /><span>Cost Per Lead</span></div>
          <div className="text-lg sm:text-xl font-black text-amber-300">{cpl} <span className="text-xs font-normal text-slate-400">credits</span></div>
          <span className={`text-[10px] font-bold ${cpl > 0 && cpl <= fixture.targetCpl ? 'text-emerald-400' : 'text-amber-400'}`}>{cpl > 0 && cpl <= fixture.targetCpl ? 'Target efficiency' : `Ceiling: ${fixture.targetCpl}`}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-sm font-extrabold text-white flex items-center gap-2"><Layers className="w-4 h-4 text-purple-400" /><span>1. Multi-Channel Budget Allocation</span></h2>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={undo} disabled={!canUndo} title="Undo last allocation change" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30 transition-colors"><Undo2 className="w-3.5 h-3.5" /></button>
                <button type="button" onClick={redo} disabled={!canRedo} title="Redo" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30 transition-colors"><Redo2 className="w-3.5 h-3.5" /></button>
                <button type="button" onClick={() => { reset(); onDirty(); }} title="Reset allocation" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors"><RotateCcw className="w-3.5 h-3.5" /></button>
                <span className="text-[10px] text-slate-500 font-mono pl-1">step {stepIndex}</span>
              </div>
            </div>

            {fixture.channels.map((ch) => {
              const spend = state.channelBudgets[ch.id] || 0;
              const activeCreative = ch.creativeVariants.find((c) => c.id === state.selectedCreatives[ch.id]) ?? ch.creativeVariants[0];
              const minSpend = fixture.channelMinSpend[ch.id];
              return (
                <div key={ch.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <div>
                      <span className="text-xs font-bold text-white">{ch.name}</span>
                      <p className="text-[10px] text-slate-400">{ch.blurb} • CPM: {ch.cpm} credits{minSpend ? ` • Min spend: ${minSpend.toLocaleString()}` : ''}</p>
                    </div>
                    <span className="text-sm font-black font-mono text-purple-300">{spend.toLocaleString()} credits</span>
                  </div>
                  <input type="range" min={0} max={fixture.totalBudget} step={2500} value={spend}
                    onChange={(e) => setChannelBudget(ch.id, Number(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer" aria-label={`${ch.name} budget`} />
                  {minSpend !== undefined && spend < minSpend && (
                    <p className="text-[10px] text-amber-400 font-semibold">Below required minimum of {minSpend.toLocaleString()} credits.</p>
                  )}
                  <div className="pt-1 flex items-center gap-2 text-xs flex-wrap">
                    <span className="text-[10px] text-slate-400">Creative:</span>
                    {ch.creativeVariants.map((cv) => (
                      <button key={cv.id} type="button" onClick={() => setCreative(ch.id, cv.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${state.selectedCreatives[ch.id] === cv.id ? 'bg-purple-600/30 text-purple-300 border-purple-500/50' : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'}`}>
                        {cv.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-500 italic">{activeCreative.preview}</p>
                </div>
              );
            })}

            <div className="pt-1">
              <span className="text-[10px] text-slate-400 font-semibold block mb-1.5">Audience Segment</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {fixture.audiences.map((seg) => (
                  <button key={seg.id} type="button" onClick={() => update({ audienceId: seg.id })}
                    className={`p-2.5 rounded-xl border text-left transition-all ${state.audienceId === seg.id ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-200' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}>
                    <span className="text-[11px] font-bold block">{seg.label}</span>
                    <span className="text-[10px] text-slate-400">{seg.description}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-2">
            <label htmlFor="strategy-notes" className="text-xs font-extrabold text-white flex items-center gap-2"><Sparkles className="w-3.5 h-3.5 text-purple-400" /><span>2. Strategy Rationale &amp; Optimization Notes</span></label>
            <textarea id="strategy-notes" rows={2} value={strategyNotes}
              onChange={(e) => { setStrategyNotes(e.target.value); onDirty(); }}
              placeholder="Explain why you divided the budget across these channels..."
              className="w-full text-xs p-3 rounded-xl bg-black/30 border border-white/15 text-slate-200 focus:outline-none focus:border-purple-500/50" />
          </div>

          <ChartFrame title="Impressions → Clicks → Leads Funnel" icon={<Layers className="w-4 h-4 text-purple-400" />}
            tableHeaders={['Stage', 'Volume (to date)']}
            tableRows={[['Impressions', revealed.impressions], ['Clicks', revealed.clicks], ['Leads', revealed.leads]]}>
            <CompareBarChart horizontal labels={['Impressions', 'Clicks', 'Leads']} series={[{ label: 'Volume', data: [revealed.impressions, revealed.clicks, revealed.leads] }]} />
          </ChartFrame>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <SimClock label="30-Day Simulation Clock" step={currentDay} maxStep={30}
            stepLabel={(s) => `Day ${s}/30`}
            onAdvance={() => { setCurrentDay((d) => Math.min(30, d + 1)); onDirty(); }}
            onReset={() => { setCurrentDay(0); onDirty(); }} />

          <ChartFrame title="Daily Lead Velocity (30-Day Trend)" icon={<TrendingUp className="w-4 h-4 text-purple-400" />}
            tableHeaders={['Day', 'Estimated Leads']}
            tableRows={dailyLeadSeries.map((v, i) => [i + 1, i < currentDay ? Math.round(v) : '—'])}>
            <TrendLineChart labels={dailyLeadSeries.map((_, i) => i + 1)}
              series={[{ label: 'Daily leads', data: dailyLeadSeries.map((v, i) => (i < currentDay ? Math.round(v) : null)), fill: true }]}
              yLabel="Leads / day" />
          </ChartFrame>

          <ChartFrame title="Budget Allocation Share" icon={<DollarSign className="w-4 h-4 text-purple-400" />}
            tableHeaders={['Channel', 'Budget']}
            tableRows={fixture.channels.map((ch) => [ch.name, state.channelBudgets[ch.id] || 0])}>
            <BreakdownDoughnutChart labels={fixture.channels.map((ch) => ch.name)} values={fixture.channels.map((ch) => state.channelBudgets[ch.id] || 0)}
              centerLabel="Total Spend" centerValue={totalAllocated.toLocaleString()} />
          </ChartFrame>

          <ChartFrame title="Leads &amp; CPL by Channel" icon={<Users className="w-4 h-4 text-purple-400" />}
            tableHeaders={['Channel', 'Leads (30-day)', 'CPL (credits)']}
            tableRows={perChannel.map((p) => [p.channel.name, Math.round(p.leads), p.leads > 0 ? Math.round(p.spend / p.leads) : 0])}>
            <CompareBarChart labels={perChannel.map((p) => p.channel.name)}
              series={[{ label: 'Leads (30-day)', data: perChannel.map((p) => Math.round(p.leads)) }]} yLabel="Leads" />
          </ChartFrame>

          <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
            <p className="text-[10px] text-amber-200/90 leading-relaxed">
              Diversify across at least {fixture.minChannelsUsed} channels (currently {channelsUsed}), keep any single channel under {Math.round(fixture.maxChannelShare * 100)}% of spend (currently {Math.round(maxChannelShare * 100)}%), and stay within budget. All impressions, clicks and leads are simulated from disclosed CPM/CTR/conversion assumptions — these are fictional practice results, not real ad spend or a forecast of actual campaign performance.
            </p>
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={handleExportCsv} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] font-bold transition-colors"><Download className="w-3.5 h-3.5" /><span>CSV</span></button>
            <button type="button" onClick={handleExportJson} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] font-bold transition-colors"><FileJson className="w-3.5 h-3.5" /><span>JSON</span></button>
          </div>

          <button type="button" onClick={handleSubmit} className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold transition-all flex items-center justify-center gap-2">
            <Send className="w-4 h-4" /><span>Submit &amp; Evaluate Lab</span>
          </button>
        </div>
      </div>
    </div>
  );
}
