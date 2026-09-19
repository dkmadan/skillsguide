'use client';

import { useMemo, useState } from 'react';
import { LabScenarioVariant, LabDifficulty } from '@/lib/labs/types';
import { useUndoableState } from '@/lib/labs/useUndoableState';
import { downloadCsv, downloadJson } from '@/lib/labs/exportHelper';
import ChartFrame from '@/components/labs/charts/ChartFrame';
import CompareBarChart from '@/components/labs/charts/CompareBarChart';
import {
  Undo2, Redo2, RotateCcw, Send, Download, FileJson, BarChart3, Gauge,
  AlertTriangle, MessageSquareWarning, ListOrdered,
} from 'lucide-react';

interface SimulatorProps {
  scenario?: LabScenarioVariant;
  variant: LabDifficulty;
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

type GoalId = 'activation_d7' | 'paid_conversion' | 'support_reduction';
type MetricId = 'd7_activation_rate' | 'checkout_completion_rate' | 'tickets_per_100_users' | 'total_pageviews' | 'social_followers' | 'nps_score';

const GOAL_LABEL: Record<GoalId, string> = {
  activation_d7: 'Increase Day-7 Activation',
  paid_conversion: 'Increase Paid Conversion',
  support_reduction: 'Reduce Support Ticket Volume',
};
const METRIC_LABEL: Record<MetricId, string> = {
  d7_activation_rate: 'Day-7 Activation Rate',
  checkout_completion_rate: 'Checkout Completion Rate',
  tickets_per_100_users: 'Support Tickets per 100 Users',
  total_pageviews: 'Total Pageviews (vanity)',
  social_followers: 'Social Media Followers (vanity)',
  nps_score: 'Net Promoter Score (guardrail)',
};
const METRIC_IDS: MetricId[] = ['d7_activation_rate', 'checkout_completion_rate', 'tickets_per_100_users', 'total_pageviews', 'social_followers', 'nps_score'];
const VANITY_METRICS: MetricId[] = ['total_pageviews', 'social_followers'];
const GOAL_PRIMARY_METRIC: Record<GoalId, MetricId> = {
  activation_d7: 'd7_activation_rate',
  paid_conversion: 'checkout_completion_rate',
  support_reduction: 'tickets_per_100_users',
};

interface ChallengeOption { id: string; label: string; effort?: number; confidence?: number; }
interface StakeholderChallenge { prompt: string; options: ChallengeOption[]; }
interface FeatureCandidate {
  id: string; name: string; reach: number; impact: number; confidence: number; effort: number;
  challenge?: StakeholderChallenge;
}
interface FeedbackCard { id: string; author: string; quote: string; featureId: string; votes: number; }
interface Fixture { features: FeatureCandidate[]; feedback: FeedbackCard[]; capacity: number; }

function mkFeedback(rows: [string, string, string, number][]): FeedbackCard[] {
  return rows.map(([author, quote, featureId, votes], i) => ({ id: `fb${i + 1}`, author, quote, featureId, votes }));
}

const FIXTURES: Record<LabDifficulty, Fixture> = {
  beginner: {
    capacity: 30,
    features: [
      { id: 'f1', name: '1-Click Google & GitHub SSO Login', reach: 800, impact: 2, confidence: 0.9, effort: 4 },
      { id: 'f2', name: 'Course Progress Milestone Badges', reach: 500, impact: 1, confidence: 0.8, effort: 3 },
      { id: 'f3', name: 'AI Voice Tutor Live Audio Streaming', reach: 200, impact: 2, confidence: 0.4, effort: 18 },
      { id: 'f4', name: 'Automated GST Invoice Generator', reach: 450, impact: 2.5, confidence: 0.95, effort: 5 },
      { id: 'f5', name: 'Dark Mode Theme Customizer', reach: 600, impact: 0.5, confidence: 1.0, effort: 0 },
      { id: 'f6', name: 'Interactive Lab Diagnostic Sandbox', reach: 950, impact: 3, confidence: 0.85, effort: 12 },
      { id: 'f7', name: 'Offline Mobile Download Mode', reach: 300, impact: 1.5, confidence: 0.6, effort: 6 },
      { id: 'f8', name: 'Enterprise Manager Reporting Dashboard', reach: 150, impact: 2, confidence: 0.7, effort: 8 },
    ],
    feedback: mkFeedback([
      ['Priya S.', 'Logging in with a work Google account would save my team so much onboarding time.', 'f1', 41],
      ['Rahul V.', 'I keep forgetting my SkillsGuide password — SSO would fix that instantly.', 'f1', 33],
      ['Ananya D.', 'Badges after each milestone would keep me motivated to finish the track.', 'f2', 22],
      ['Karan M.', 'A visible progress badge system would help me show completion to my manager.', 'f2', 18],
      ['Devika R.', 'An AI voice tutor sounds cool but honestly I would trust it less than the written labs.', 'f3', 9],
      ['Farhan A.', 'Live voice tutoring seems experimental — I would rather see it stabilize first.', 'f3', 6],
      ['Meera K.', 'Our finance team rejects checkout without a proper GST invoice — this blocks renewal.', 'f4', 47],
      ['Sanjay G.', 'Manually requesting GST invoices by email takes days — automate it.', 'f4', 39],
      ['Ibrahim T.', 'Dark mode would be nice for late-night study sessions.', 'f5', 20],
      ['Priya S.', 'Not a dealbreaker, but dark mode is a frequently requested nice-to-have.', 'f5', 14],
      ['Ritu N.', 'The diagnostic sandbox is the single biggest reason I upgraded — more labs like it please.', 'f6', 52],
      ['Aditya P.', 'Practicing debugging in the sandbox helped me pass my interview loop.', 'f6', 44],
      ['Neha J.', 'I only have mobile data on my commute — offline downloads would help a lot.', 'f7', 25],
      ['Vikram S.', 'Would love to download a module for the flight instead of streaming it.', 'f7', 19],
      ['Ops Lead — GlobalTech', 'Our L&D manager needs a dashboard to track team completion, not per-user emails.', 'f8', 15],
      ['HR — Nexus Retail', 'Enterprise reporting would justify renewing our team license.', 'f8', 12],
      ['Ananya D.', 'SSO plus badges together would make onboarding effortless for new hires.', 'f1', 17],
      ['Karan M.', 'GST invoices should auto-attach a PDF, not just text.', 'f4', 21],
      ['Ritu N.', 'Sandbox needs more scenarios per skill track — I finished all of them in a week.', 'f6', 28],
      ['Devika R.', 'Offline mode would need to support partial sync when back online.', 'f7', 11],
    ]),
  },
  intermediate: {
    capacity: 22,
    features: [
      { id: 'f1', name: '1-Click Google & GitHub SSO Login', reach: 800, impact: 2, confidence: 0.8, effort: 5 },
      { id: 'f2', name: 'Course Progress Milestone Badges', reach: 500, impact: 1, confidence: 0.8, effort: 3 },
      { id: 'f3', name: 'AI Voice Tutor Live Audio Streaming', reach: 250, impact: 2, confidence: 0.35, effort: 20 },
      { id: 'f4', name: 'Automated GST Invoice Generator', reach: 450, impact: 2.5, confidence: 0.9, effort: 6 },
      { id: 'f5', name: 'Dark Mode Theme Customizer', reach: 600, impact: 0.5, confidence: 1.0, effort: 0 },
      {
        id: 'f6', name: 'Interactive Lab Diagnostic Sandbox', reach: 900, impact: 2.5, confidence: 0.8, effort: 10,
        challenge: {
          prompt: 'Engineering flags integration risk on the sandbox scoring engine. How do you respond?',
          options: [
            { id: 'accept_estimate', label: 'Accept the revised estimate (effort rises to 14 points)', effort: 14 },
            { id: 'push_back', label: 'Keep the original estimate, but log the confidence risk (confidence −0.15)', confidence: 0.65 },
          ],
        },
      },
      { id: 'f7', name: 'Offline Mobile Download Mode', reach: 350, impact: 2, confidence: 0.6, effort: 7 },
      { id: 'f8', name: 'Enterprise Manager Reporting Dashboard', reach: 220, impact: 2.5, confidence: 0.75, effort: 8 },
    ],
    feedback: mkFeedback([
      ['Priya S.', 'SSO would remove the single biggest onboarding friction for my team of 40.', 'f1', 38],
      ['Rahul V.', 'Password resets are our #1 support ticket — SSO should fix most of them.', 'f1', 30],
      ['Ananya D.', 'Milestone badges keep juniors engaged past week 2, when most drop off.', 'f2', 24],
      ['Karan M.', 'Badges alone will not fix retention — the content pacing matters more.', 'f2', 9],
      ['Devika R.', 'A live voice tutor is intriguing but I worry about accuracy for technical topics.', 'f3', 8],
      ['Farhan A.', 'I would not trust an AI tutor for exam-critical material yet.', 'f3', 5],
      ['Meera K.', 'GST invoicing is blocking three enterprise renewals right now.', 'f4', 45],
      ['Sanjay G.', 'Manual invoice requests delay our procurement approval by a week.', 'f4', 36],
      ['Ibrahim T.', 'Dark mode is low priority for me personally but many teammates ask for it.', 'f5', 16],
      ['Priya S.', 'Dark mode would be nice, not urgent.', 'f5', 10],
      ['Ritu N.', 'The sandbox is why our team upgraded — but scoring occasionally lags.', 'f6', 48],
      ['Aditya P.', 'Sandbox helped me most, but a scoring bug cost me a submission once.', 'f6', 33],
      ['Neha J.', 'Offline downloads matter for our field engineers with poor connectivity.', 'f7', 27],
      ['Vikram S.', 'I would use offline mode weekly on my commute.', 'f7', 21],
      ['Ops Lead — GlobalTech', 'Our L&D dashboard request has been open for two quarters.', 'f8', 19],
      ['HR — Nexus Retail', 'Enterprise reporting is the top ask from our renewal call.', 'f8', 17],
      ['Ananya D.', 'SSO plus GST invoicing together would remove our two biggest blockers.', 'f4', 14],
      ['Karan M.', 'Sandbox needs more scenarios — I finished the current set already.', 'f6', 20],
      ['Devika R.', 'Offline sync conflicts would need clear resolution rules.', 'f7', 8],
      ['Meera K.', 'A manager dashboard should show per-cohort completion, not just per-user.', 'f8', 13],
    ]),
  },
  challenge: {
    capacity: 16,
    features: [
      { id: 'f1', name: '1-Click Google & GitHub SSO Login', reach: 800, impact: 1.5, confidence: 0.7, effort: 6 },
      { id: 'f2', name: 'Course Progress Milestone Badges', reach: 500, impact: 1, confidence: 0.75, effort: 3 },
      { id: 'f3', name: 'AI Voice Tutor Live Audio Streaming', reach: 300, impact: 2, confidence: 0.3, effort: 22 },
      { id: 'f4', name: 'Automated GST Invoice Generator', reach: 420, impact: 2.5, confidence: 0.9, effort: 5 },
      { id: 'f5', name: 'Dark Mode Theme Customizer', reach: 600, impact: 0.5, confidence: 1.0, effort: 0 },
      {
        id: 'f6', name: 'Interactive Lab Diagnostic Sandbox', reach: 850, impact: 2, confidence: 0.7, effort: 9,
        challenge: {
          prompt: 'Engineering flags integration risk on the sandbox scoring engine. How do you respond?',
          options: [
            { id: 'accept_estimate', label: 'Accept the revised estimate (effort rises to 13 points)', effort: 13 },
            { id: 'push_back', label: 'Keep the original estimate, but log the confidence risk (confidence −0.2)', confidence: 0.5 },
          ],
        },
      },
      { id: 'f7', name: 'Offline Mobile Download Mode', reach: 380, impact: 2, confidence: 0.65, effort: 6 },
      {
        id: 'f8', name: 'Enterprise Manager Reporting Dashboard', reach: 260, impact: 2.5, confidence: 0.8, effort: 7,
        challenge: {
          prompt: 'Sales asks to fast-track this for a renewal next week. How do you respond?',
          options: [
            { id: 'fast_track', label: 'Fast-track it (effort compresses to 5, but confidence drops to 0.55 from untested scope cuts)', effort: 5, confidence: 0.55 },
            { id: 'hold_scope', label: 'Hold the full scope and original timeline (no change)' },
          ],
        },
      },
    ],
    feedback: mkFeedback([
      ['Priya S.', 'SSO is nice but our real blocker is invoicing for procurement sign-off.', 'f1', 22],
      ['Rahul V.', 'SSO would help, though it is not urgent for a 5-person team like mine.', 'f1', 14],
      ['Ananya D.', 'Badges are a small motivator, not a dealbreaker either way.', 'f2', 11],
      ['Karan M.', 'I barely notice the badges I already have.', 'f2', 6],
      ['Devika R.', 'The voice tutor pitch is exciting but reach feels overstated for how niche it is.', 'f3', 7],
      ['Farhan A.', 'I would not rely on an unproven AI tutor before a certification exam.', 'f3', 4],
      ['Meera K.', 'GST invoicing is blocking renewal approval across three enterprise accounts.', 'f4', 44],
      ['Sanjay G.', 'This is the highest-friction manual process our finance team deals with.', 'f4', 37],
      ['Ibrahim T.', 'Dark mode requests keep coming in but nobody has churned over it.', 'f5', 13],
      ['Priya S.', 'Cosmetic only for me — dark mode is not worth much engineering time.', 'f5', 7],
      ['Ritu N.', 'Sandbox is valuable, but recent scoring lag makes me hesitant to rely on it for grading.', 'f6', 34],
      ['Aditya P.', 'Sandbox reach is high, but the integration risk mentioned in standup worries me.', 'f6', 25],
      ['Neha J.', 'Offline mode matters for field engineers, but is not our loudest request.', 'f7', 18],
      ['Vikram S.', 'I would use offline sync weekly, but I would not churn without it.', 'f7', 12],
      ['Ops Lead — GlobalTech', 'Reporting dashboard is explicitly tied to a renewal decision next week.', 'f8', 29],
      ['HR — Nexus Retail', 'If the dashboard slips again we may not renew this cycle.', 'f8', 24],
      ['Ananya D.', 'GST invoicing plus a manager dashboard would resolve both open renewal blockers.', 'f4', 16],
      ['Karan M.', 'Sandbox scoring bug needs a fix before more scenarios are added.', 'f6', 15],
      ['Devika R.', 'Fast-tracking the dashboard sounds risky if scope gets cut to hit the date.', 'f8', 10],
      ['Meera K.', 'Invoicing automation should be prioritized over cosmetic requests like dark mode.', 'f4', 12],
    ]),
  },
};

interface PpState {
  selectedForSprint: Record<string, boolean>;
  challengeChoice: Record<string, string>;
  activationGoal: GoalId | '';
  primaryMetric: MetricId | '';
  guardrailMetric: MetricId | '';
}

function initialState(): PpState {
  return { selectedForSprint: {}, challengeChoice: {}, activationGoal: '', primaryMetric: '', guardrailMetric: '' };
}

function riceOf(f: { reach: number; impact: number; confidence: number; effort: number }): number {
  return f.effort > 0 ? (f.reach * f.impact * f.confidence) / f.effort : 0;
}

export default function ProductPrioritizationLab({ variant, onDirty, onSubmit }: SimulatorProps) {
  const fixture = useMemo(() => FIXTURES[variant], [variant]);
  const { state, set, undo, redo, reset, canUndo, canRedo, stepIndex } = useUndoableState<PpState>(initialState());
  const [prdProblem, setPrdProblem] = useState('');

  const update = (patch: Partial<PpState>) => { set((prev) => ({ ...prev, ...patch })); onDirty(); };

  const effectiveFeatures = useMemo(() => fixture.features.map((f) => {
    const choiceId = state.challengeChoice[f.id];
    const option = f.challenge?.options.find((o) => o.id === choiceId);
    return {
      ...f,
      effort: option?.effort ?? f.effort,
      confidence: option?.confidence ?? f.confidence,
      riceScore: riceOf({ reach: f.reach, impact: f.impact, confidence: option?.confidence ?? f.confidence, effort: option?.effort ?? f.effort }),
      invalid: (option?.effort ?? f.effort) <= 0,
    };
  }), [fixture.features, state.challengeChoice]);

  const totalEffortUsed = effectiveFeatures.filter((f) => state.selectedForSprint[f.id] && !f.invalid).reduce((s, f) => s + f.effort, 0);
  const isOverCapacity = totalEffortUsed > fixture.capacity;

  const toggleFeature = (id: string, invalid: boolean) => {
    if (invalid) return;
    update({ selectedForSprint: { ...state.selectedForSprint, [id]: !state.selectedForSprint[id] } });
  };

  const rankedFeatures = useMemo(() => [...effectiveFeatures].sort((a, b) => b.riceScore - a.riceScore), [effectiveFeatures]);
  const roadmap = rankedFeatures.filter((f) => state.selectedForSprint[f.id] && !f.invalid);

  const handleExportCsv = () => {
    downloadCsv('product_rice_backlog.csv', rankedFeatures.map((f) => ({
      feature_name: f.name, reach: f.reach, impact: f.impact, confidence: f.confidence,
      effort_points: f.effort, rice_score: Math.round(f.riceScore), in_sprint: state.selectedForSprint[f.id] && !f.invalid ? 'YES' : 'NO',
      invalid_effort: f.invalid ? 'YES' : 'NO',
    })));
  };
  const handleExportJson = () => {
    downloadJson('product_prd_prioritization.json', {
      variant, capacity: fixture.capacity, totalEffortUsed, roadmap: roadmap.map((f) => f.id),
      prd: { activationGoal: state.activationGoal, primaryMetric: state.primaryMetric, guardrailMetric: state.guardrailMetric, prdProblem },
    });
  };

  const handleSubmit = () => {
    onSubmit({
      capacity: fixture.capacity,
      totalEffortUsed,
      isOverCapacity,
      features: effectiveFeatures.map((f) => ({
        id: f.id, name: f.name, reach: f.reach, impact: f.impact, confidence: f.confidence, effort: f.effort,
        selectedForSprint: Boolean(state.selectedForSprint[f.id]) && !f.invalid,
      })),
      riceScores: Object.fromEntries(effectiveFeatures.map((f) => [f.id, Math.round(f.riceScore * 100) / 100])),
      activationGoal: state.activationGoal,
      primaryMetric: state.primaryMetric,
      guardrailMetric: state.guardrailMetric,
      prdProblem,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Sprint Capacity</span>
          <span className={`text-xl font-black ${isOverCapacity ? 'text-red-400' : 'text-white'}`}>{totalEffortUsed} / {fixture.capacity} pts</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Step {stepIndex} in history</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Features In Sprint</span>
          <span className="text-xl font-black text-white">{roadmap.length} / 8</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">RICE Reference Check</span>
          <span className="text-xl font-black text-emerald-400">100·2·0.5/5 = 20</span>
        </div>
        <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30">
          <span className="text-xs text-purple-300 font-bold block mb-1">Activation Goal</span>
          <span className="text-sm font-black text-purple-100">{state.activationGoal ? GOAL_LABEL[state.activationGoal] : 'Not selected'}</span>
        </div>
      </div>

      <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
        <div className={`h-full rounded-full transition-all ${isOverCapacity ? 'bg-red-500' : 'bg-orange-500'}`} style={{ width: `${Math.min(100, (totalEffortUsed / fixture.capacity) * 100)}%` }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-sm font-extrabold text-white flex items-center gap-2"><Gauge className="w-4 h-4 text-orange-400" /><span>1. RICE Backlog &amp; Sprint Selection</span></h2>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={undo} disabled={!canUndo} title="Undo" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30"><Undo2 className="w-3.5 h-3.5" /></button>
                <button type="button" onClick={redo} disabled={!canRedo} title="Redo" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30"><Redo2 className="w-3.5 h-3.5" /></button>
                <button type="button" onClick={() => { reset(); onDirty(); }} title="Reset" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white"><RotateCcw className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <div className="space-y-2.5">
              {effectiveFeatures.map((f) => (
                <div key={f.id} className={`p-3.5 rounded-2xl border ${f.invalid ? 'bg-red-950/20 border-red-500/30' : state.selectedForSprint[f.id] ? 'bg-orange-500/10 border-orange-500/40' : 'bg-white/5 border-white/10'}`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-bold text-white">{f.name}</h4>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 mt-1 font-mono">
                        <span>Reach: {f.reach}</span><span>Impact: {f.impact}x</span>
                        <span>Confidence: {Math.round(f.confidence * 100)}%</span>
                        <span className={f.invalid ? 'text-red-400 font-bold' : ''}>Effort: {f.effort} pts{f.invalid ? ' (invalid)' : ''}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400">RICE</div>
                        <div className="text-base font-mono font-bold text-orange-400">{f.invalid ? '—' : Math.round(f.riceScore)}</div>
                      </div>
                      <button type="button" onClick={() => toggleFeature(f.id, f.invalid)} disabled={f.invalid}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed ${state.selectedForSprint[f.id] ? 'bg-orange-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
                        {f.invalid ? 'Excluded (0 effort)' : state.selectedForSprint[f.id] ? 'In Sprint' : '+ Add to Sprint'}
                      </button>
                    </div>
                  </div>
                  {f.challenge && (
                    <div className="mt-3 pt-3 border-t border-white/10 space-y-1.5">
                      <div className="text-[11px] text-amber-300 font-bold flex items-center gap-1.5"><MessageSquareWarning className="w-3.5 h-3.5" />{f.challenge.prompt}</div>
                      <div className="flex flex-wrap gap-1.5">
                        {f.challenge.options.map((o) => (
                          <button key={o.id} type="button" onClick={() => update({ challengeChoice: { ...state.challengeChoice, [f.id]: o.id } })}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition ${state.challengeChoice[f.id] === o.id ? 'bg-amber-500/20 border-amber-500/50 text-amber-200' : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'}`}>
                            {o.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2"><ListOrdered className="w-3.5 h-3.5 text-orange-400" />Roadmap (Ranked by RICE, In-Sprint Only)</h3>
            {roadmap.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No features selected yet.</p>
            ) : (
              <ol className="space-y-1.5">
                {roadmap.map((f, i) => (
                  <li key={f.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-slate-300">#{i + 1} — {f.name}</span>
                    <span className="font-mono text-orange-400 font-bold">{Math.round(f.riceScore)}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">Feedback Board (20 Cards)</h3>
            <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
              {fixture.feedback.map((c) => (
                <div key={c.id} className="p-2.5 rounded-xl bg-black/20 border border-white/10 text-[11px]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-300">{c.author}</span>
                    <span className="text-slate-500">{fixture.features.find((f) => f.id === c.featureId)?.name.split(' ').slice(0, 3).join(' ')} · {c.votes} votes</span>
                  </div>
                  <p className="text-slate-400 italic">&ldquo;{c.quote}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <ChartFrame title="Impact vs Effort by Feature" icon={<BarChart3 className="w-4 h-4 text-orange-400" />}
            tableHeaders={['Feature', 'Impact', 'Effort']} tableRows={effectiveFeatures.map((f) => [f.name, f.impact, f.effort])}>
            <CompareBarChart labels={effectiveFeatures.map((f) => f.name.split(' ').slice(0, 2).join(' '))}
              series={[{ label: 'Impact', data: effectiveFeatures.map((f) => f.impact) }, { label: 'Effort', data: effectiveFeatures.map((f) => f.effort) }]} yLabel="Score / Points" />
          </ChartFrame>

          <ChartFrame title="RICE Score per Feature" icon={<Gauge className="w-4 h-4 text-orange-400" />}
            tableHeaders={['Feature', 'RICE']} tableRows={rankedFeatures.map((f) => [f.name, Math.round(f.riceScore)])}>
            <CompareBarChart horizontal labels={rankedFeatures.map((f) => f.name.split(' ').slice(0, 2).join(' '))}
              series={[{ label: 'RICE', data: rankedFeatures.map((f) => Math.round(f.riceScore)), statusOverride: rankedFeatures.map((f) => (f.invalid ? 'critical' : null)) }]} />
          </ChartFrame>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3 text-xs">
            <h3 className="text-sm font-semibold text-white">Structured PRD &amp; Experiment Worksheet</h3>
            <div>
              <label className="text-slate-400 block mb-1">Activation Goal</label>
              <select value={state.activationGoal} onChange={(e) => update({ activationGoal: e.target.value as GoalId })}
                className="w-full bg-black/40 border border-white/15 rounded-lg p-2 text-slate-200 focus:outline-none">
                <option value="">— select a goal —</option>
                {(Object.keys(GOAL_LABEL) as GoalId[]).map((g) => <option key={g} value={g}>{GOAL_LABEL[g]}</option>)}
              </select>
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Problem Statement &amp; User Need (self-reviewed)</label>
              <textarea rows={3} value={prdProblem} onChange={(e) => { setPrdProblem(e.target.value); onDirty(); }}
                placeholder="Synthesize the user feedback and business goal into a clear problem statement..."
                className="w-full bg-black/40 border border-white/15 rounded-lg p-2 text-slate-200 placeholder:text-slate-600 focus:outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-400 block mb-1">Primary Metric</label>
                <select value={state.primaryMetric} onChange={(e) => update({ primaryMetric: e.target.value as MetricId })}
                  className="w-full bg-black/40 border border-white/15 rounded-lg p-2 text-slate-200 focus:outline-none">
                  <option value="">— select —</option>
                  {METRIC_IDS.map((m) => <option key={m} value={m}>{METRIC_LABEL[m]}</option>)}
                </select>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Guardrail Metric</label>
                <select value={state.guardrailMetric} onChange={(e) => update({ guardrailMetric: e.target.value as MetricId })}
                  className="w-full bg-black/40 border border-white/15 rounded-lg p-2 text-slate-200 focus:outline-none">
                  <option value="">— select —</option>
                  {METRIC_IDS.map((m) => <option key={m} value={m}>{METRIC_LABEL[m]}</option>)}
                </select>
              </div>
            </div>
            {state.activationGoal && state.primaryMetric && (
              <p className={`text-[11px] ${state.primaryMetric === GOAL_PRIMARY_METRIC[state.activationGoal] ? 'text-emerald-400' : 'text-amber-400'}`}>
                {state.primaryMetric === GOAL_PRIMARY_METRIC[state.activationGoal]
                  ? 'Primary metric matches the selected activation goal.'
                  : `For "${GOAL_LABEL[state.activationGoal]}", the goal-aligned primary metric is "${METRIC_LABEL[GOAL_PRIMARY_METRIC[state.activationGoal]]}".`}
              </p>
            )}
            {state.guardrailMetric && VANITY_METRICS.includes(state.guardrailMetric) && (
              <p className="text-[11px] text-amber-400">A vanity metric makes a weak guardrail — pick one that reflects real user behavior.</p>
            )}
            {isOverCapacity && (
              <div className="p-2 rounded-lg bg-red-950/40 border border-red-800 text-red-300 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5 shrink-0" />Selected features exceed the {fixture.capacity}-point sprint capacity.</div>
            )}
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={handleExportCsv} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] font-bold"><Download className="w-3.5 h-3.5" /><span>Backlog CSV</span></button>
            <button type="button" onClick={handleExportJson} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] font-bold"><FileJson className="w-3.5 h-3.5" /><span>PRD JSON</span></button>
          </div>

          <button type="button" onClick={handleSubmit}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-slate-950 text-xs font-extrabold transition-all flex items-center justify-center gap-2">
            <Send className="w-4 h-4" /><span>Submit PRD &amp; Roadmap</span>
          </button>
        </div>
      </div>
    </div>
  );
}
