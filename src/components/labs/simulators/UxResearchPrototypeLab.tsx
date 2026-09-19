'use client';

import { useMemo, useState } from 'react';
import { LabScenarioVariant, LabDifficulty } from '@/lib/labs/types';
import { useUndoableState } from '@/lib/labs/useUndoableState';
import { downloadCsv, downloadJson } from '@/lib/labs/exportHelper';
import ChartFrame from '@/components/labs/charts/ChartFrame';
import TrendLineChart from '@/components/labs/charts/TrendLineChart';
import BreakdownDoughnutChart from '@/components/labs/charts/BreakdownDoughnutChart';
import {
  Undo2, Redo2, RotateCcw, Send, Download, FileJson, LineChart as LineChartIcon,
  PieChart as PieChartIcon, AlertTriangle, CheckCircle2, MapPin, Layers, MousePointerClick,
} from 'lucide-react';

interface SimulatorProps {
  scenario?: LabScenarioVariant;
  variant: LabDifficulty;
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

type ThemeId = 'course_discovery' | 'pricing_friction' | 'checkout_dropoff';
type AssignedTheme = ThemeId | 'unassigned';

const THEME_LABEL: Record<ThemeId, string> = {
  course_discovery: 'Course Discovery',
  pricing_friction: 'Pricing & Billing',
  checkout_dropoff: 'Checkout Dropoff',
};
const THEMES: ThemeId[] = ['course_discovery', 'pricing_friction', 'checkout_dropoff'];

interface InterviewQuote { id: string; userType: string; quote: string; presetTheme: ThemeId; }
interface FunnelStep { id: string; label: string; count: number; theme?: ThemeId }
interface ProblemStatementCandidate { id: string; theme: ThemeId; text: string; }
interface WireframeAction { id: string; label: string; target: string; editable?: boolean; }
interface WireframeScreen { id: string; label: string; description: string; actions: WireframeAction[]; }
interface TaskScenario { id: string; label: string; startScreenId: string; destinationScreenId: string; }

interface Fixture {
  quotes: InterviewQuote[];
  funnelSteps: FunnelStep[];
  tasks: TaskScenario[];
}

function mkQuotes(entries: [string, ThemeId, string][]): InterviewQuote[] {
  return entries.map(([userType, theme, quote], i) => ({ id: `q${i + 1}`, userType, presetTheme: theme, quote }));
}

const BASE_SCREENS = (): WireframeScreen[] => [
  { id: 'landing', label: 'Landing', description: 'Full-Stack AI Bootcamp marketing page.', actions: [
    { id: 'browse', label: 'Browse Courses', target: 'catalog' },
    { id: 'enroll', label: 'Enroll Now ($49)', target: 'checkout' },
  ] },
  { id: 'catalog', label: 'Course Catalog', description: 'Compares syllabus tracks side by side.', actions: [
    { id: 'select', label: 'Select Track & Continue', target: 'checkout' },
    { id: 'back', label: 'Back to Landing', target: 'landing' },
  ] },
  { id: 'checkout', label: 'Checkout', description: 'Order summary with GST invoice line.', actions: [
    { id: 'decline', label: 'Simulate Card Decline', target: 'payment_failed' },
    { id: 'pay', label: 'Complete Payment', target: 'success' },
  ] },
  { id: 'payment_failed', label: 'Payment Failed', description: '3D-Secure timeout error state.', actions: [
    { id: 'retry', label: 'Retry Payment', target: '', editable: true },
  ] },
  { id: 'success', label: 'Enrollment Confirmed', description: 'Success state with receipt.', actions: [
    { id: 'home', label: 'Return to Home', target: 'landing' },
  ] },
];

const STEP_THEME: Record<string, ThemeId> = {
  browse: 'course_discovery',
  checkout_start: 'pricing_friction',
  payment: 'checkout_dropoff',
};

const PROBLEM_STATEMENTS: Record<ThemeId, string> = {
  course_discovery: 'Learners abandon browsing because comparing syllabus tracks takes too many clicks and levels are unclear.',
  pricing_friction: 'Learners hesitate at checkout because currency conversion and GST invoicing appear late and without warning.',
  checkout_dropoff: 'Learners who hit a failed payment cannot recover because the error screen offers no retry path, permanently losing the sale.',
};

const FIXTURES: Record<LabDifficulty, Fixture> = {
  beginner: {
    quotes: mkQuotes([
      ['Career Switcher', 'course_discovery', 'I could not tell which Python track was for non-programmers vs seniors.'],
      ['Data Analyst', 'course_discovery', 'Comparing the 3 syllabus levels took 10 clicks across separate tabs.'],
      ['Bootcamp Grad', 'course_discovery', 'The catalog does not say which track leads to which job roles.'],
      ['Engineering Lead', 'pricing_friction', 'Our company card needs a GST invoice before we can authorize seat checkout.'],
      ['Product Manager', 'pricing_friction', 'Pricing showed USD on landing but converted without warning at checkout.'],
      ['HR Coordinator', 'pricing_friction', 'No way to request a bulk-seat quote before entering card details.'],
      ['Student', 'checkout_dropoff', 'I clicked Enroll Now and got stuck on an empty screen with no back button.'],
      ['Self-taught Dev', 'checkout_dropoff', 'When payment failed, the modal closed and my entire 6-field form cleared out.'],
      ['Working Parent', 'checkout_dropoff', 'My card declined and there was no obvious way to try again — I gave up.'],
      ['Freelancer', 'checkout_dropoff', 'After the decline screen, refreshing sent me back to the homepage, losing my cart.'],
      ['Night-shift Nurse', 'checkout_dropoff', 'The failure message had no retry button, so I emailed support and never enrolled.'],
      ['College Senior', 'checkout_dropoff', 'Dead end after decline — I assumed the whole site was broken.'],
    ]),
    funnelSteps: [
      { id: 'land', label: 'Landing Visit', count: 1000 },
      { id: 'browse', label: 'Course Browse', count: 700, theme: 'course_discovery' },
      { id: 'signup', label: 'Account Signup', count: 650 },
      { id: 'checkout_start', label: 'Checkout Started', count: 600, theme: 'pricing_friction' },
      { id: 'payment', label: 'Payment Attempt', count: 300, theme: 'checkout_dropoff' },
      { id: 'complete', label: 'Enrollment Complete', count: 280 },
    ],
    tasks: [
      { id: 'task_enroll', label: 'New learner completes enrollment', startScreenId: 'landing', destinationScreenId: 'success' },
      { id: 'task_recover', label: 'Learner recovers after a failed payment', startScreenId: 'payment_failed', destinationScreenId: 'success' },
    ],
  },
  intermediate: {
    quotes: mkQuotes([
      ['Career Switcher', 'course_discovery', 'I could not tell which Python track fit a total beginner.'],
      ['Data Analyst', 'course_discovery', 'Levels are labeled Foundation/Advance/Pro with no explanation of the difference.'],
      ['Bootcamp Grad', 'course_discovery', 'It is unclear which track maps to which job title on LinkedIn.'],
      ['Engineering Lead', 'pricing_friction', 'GST invoice request is buried two menus deep, we almost gave up.'],
      ['Product Manager', 'pricing_friction', 'Currency switched from USD to INR mid-checkout with no notice.'],
      ['HR Coordinator', 'pricing_friction', 'Bulk seat pricing is not shown anywhere before checkout starts.'],
      ['Finance Analyst', 'pricing_friction', 'The discount code field silently ignored an expired code with no message.'],
      ['Student', 'checkout_dropoff', 'Card decline sent me to a blank screen with no retry option.'],
      ['Self-taught Dev', 'checkout_dropoff', 'My form fields cleared after the decline, so I abandoned the purchase.'],
      ['Working Parent', 'checkout_dropoff', 'There was no way back from the failure screen except closing the tab.'],
      ['Freelancer', 'checkout_dropoff', 'After the decline, my saved cart contents were gone entirely.'],
      ['Night-shift Nurse', 'checkout_dropoff', 'No retry button after decline — I emailed support instead of retrying.'],
    ]),
    funnelSteps: [
      { id: 'land', label: 'Landing Visit', count: 1000 },
      { id: 'browse', label: 'Course Browse', count: 750, theme: 'course_discovery' },
      { id: 'signup', label: 'Account Signup', count: 700 },
      { id: 'checkout_start', label: 'Checkout Started', count: 550, theme: 'pricing_friction' },
      { id: 'payment', label: 'Payment Attempt', count: 480, theme: 'checkout_dropoff' },
      { id: 'complete', label: 'Enrollment Complete', count: 460 },
    ],
    tasks: [
      { id: 'task_enroll', label: 'New learner completes enrollment', startScreenId: 'landing', destinationScreenId: 'success' },
      { id: 'task_recover', label: 'Learner recovers after a failed payment', startScreenId: 'payment_failed', destinationScreenId: 'success' },
      { id: 'task_compare', label: 'Learner compares tracks before enrolling', startScreenId: 'catalog', destinationScreenId: 'success' },
    ],
  },
  challenge: {
    quotes: mkQuotes([
      ['Career Switcher', 'course_discovery', 'I spent 20 minutes comparing tracks and still was not sure which to pick.'],
      ['Data Analyst', 'course_discovery', 'The catalog filter resets every time I go back from a track detail page.'],
      ['Bootcamp Grad', 'course_discovery', 'No comparison table exists, so I opened five browser tabs to compare.'],
      ['Career Switcher #2', 'course_discovery', 'Search inside the catalog returns irrelevant tracks half the time.'],
      ['Bootcamp Grad #2', 'course_discovery', 'The "recommended for you" track did not match my stated goal at signup.'],
      ['Engineering Lead', 'pricing_friction', 'GST invoicing is not offered at all for teams under 10 seats.'],
      ['Product Manager', 'pricing_friction', 'Currency mismatch between landing and checkout confused our finance team.'],
      ['HR Coordinator', 'pricing_friction', 'No bulk quote path exists; we had to email support manually.'],
      ['Finance Analyst', 'pricing_friction', 'Expired discount codes fail silently with no explanation shown.'],
      ['Student', 'checkout_dropoff', 'Card decline dead-ends with zero retry option — I lost the sale entirely.'],
      ['Self-taught Dev', 'checkout_dropoff', 'All my entered details vanished the moment payment failed once.'],
      ['Working Parent', 'checkout_dropoff', 'The only way out of the failure screen is closing the browser tab.'],
    ]),
    funnelSteps: [
      { id: 'land', label: 'Landing Visit', count: 1000 },
      { id: 'browse', label: 'Course Browse', count: 800, theme: 'course_discovery' },
      { id: 'signup', label: 'Account Signup', count: 760 },
      { id: 'checkout_start', label: 'Checkout Started', count: 700, theme: 'pricing_friction' },
      { id: 'payment', label: 'Payment Attempt', count: 500, theme: 'checkout_dropoff' },
      { id: 'complete', label: 'Enrollment Complete', count: 480 },
    ],
    tasks: [
      { id: 'task_enroll', label: 'New learner completes enrollment', startScreenId: 'landing', destinationScreenId: 'success' },
      { id: 'task_recover', label: 'Learner recovers after a failed payment', startScreenId: 'payment_failed', destinationScreenId: 'success' },
      { id: 'task_compare', label: 'Learner compares tracks before enrolling', startScreenId: 'catalog', destinationScreenId: 'success' },
      { id: 'task_rediscover', label: 'Returning learner re-opens the catalog after purchase', startScreenId: 'success', destinationScreenId: 'catalog' },
    ],
  },
};

// Problem statement candidates are always the same 3 authored options (one per theme);
// which one is "supported by evidence" is computed from the fixed funnel data below.
function buildStatements(): ProblemStatementCandidate[] {
  return THEMES.map((t) => ({ id: `stmt_${t}`, theme: t, text: PROBLEM_STATEMENTS[t] }));
}

interface UxState {
  themeAssignments: Record<string, AssignedTheme>;
  problemStatementId: string;
  retryTarget: string;
  activeScreenId: string;
}

function initialState(fixture: Fixture): UxState {
  const themeAssignments: Record<string, AssignedTheme> = {};
  fixture.quotes.forEach((q) => { themeAssignments[q.id] = 'unassigned'; });
  return { themeAssignments, problemStatementId: '', retryTarget: '', activeScreenId: 'landing' };
}

function resolveScreens(screens: WireframeScreen[], retryTarget: string): WireframeScreen[] {
  return screens.map((s) => ({
    ...s,
    actions: s.actions.map((a) => (a.editable ? { ...a, target: retryTarget } : a)),
  }));
}

function findDeadEnds(screens: WireframeScreen[]): string[] {
  return screens.filter((s) => s.actions.length > 0 && s.actions.every((a) => a.target === '')).map((s) => s.id);
}

function bfsReachable(screens: WireframeScreen[], startId: string, destId: string): boolean {
  if (startId === destId) return true;
  const byId = new Map(screens.map((s) => [s.id, s]));
  const visited = new Set<string>([startId]);
  const queue = [startId];
  while (queue.length) {
    const cur = queue.shift() as string;
    const screen = byId.get(cur);
    if (!screen) continue;
    for (const action of screen.actions) {
      if (!action.target || visited.has(action.target)) continue;
      if (action.target === destId) return true;
      visited.add(action.target);
      queue.push(action.target);
    }
  }
  return false;
}

function bottleneckTheme(steps: FunnelStep[]): ThemeId {
  let best: { theme: ThemeId; drop: number } | null = null;
  for (let i = 1; i < steps.length; i++) {
    const theme = STEP_THEME[steps[i].id];
    if (!theme) continue;
    const drop = (steps[i - 1].count - steps[i].count) / steps[i - 1].count;
    if (!best || drop > best.drop) best = { theme, drop };
  }
  return best?.theme ?? 'checkout_dropoff';
}

export default function UxResearchPrototypeLab({ variant, onDirty, onSubmit }: SimulatorProps) {
  const fixture = useMemo(() => FIXTURES[variant], [variant]);
  const statements = useMemo(() => buildStatements(), []);
  const { state, set, undo, redo, reset, canUndo, canRedo, stepIndex } = useUndoableState<UxState>(initialState(fixture));
  const [designRationale, setDesignRationale] = useState(
    'Grouped interview evidence by theme, cross-checked the funnel stage with the steepest drop, and rebuilt the failed-payment screen with an explicit retry path back to checkout.'
  );

  const update = (patch: Partial<UxState>) => { set((prev) => ({ ...prev, ...patch })); onDirty(); };

  const screens = useMemo(() => BASE_SCREENS(), []);
  const resolvedScreens = useMemo(() => resolveScreens(screens, state.retryTarget), [screens, state.retryTarget]);
  const deadEndIds = useMemo(() => findDeadEnds(resolvedScreens), [resolvedScreens]);
  const taskResults = useMemo(
    () => fixture.tasks.map((t) => ({ ...t, reachable: bfsReachable(resolvedScreens, t.startScreenId, t.destinationScreenId) })),
    [fixture.tasks, resolvedScreens]
  );
  const allTasksReachable = taskResults.every((t) => t.reachable);

  const trueBottleneck = useMemo(() => bottleneckTheme(fixture.funnelSteps), [fixture.funnelSteps]);
  const selectedStatement = statements.find((s) => s.id === state.problemStatementId);
  const statementIsSupported = selectedStatement?.theme === trueBottleneck;

  const themeCounts = useMemo(() => {
    const counts: Record<AssignedTheme, number> = { course_discovery: 0, pricing_friction: 0, checkout_dropoff: 0, unassigned: 0 };
    Object.values(state.themeAssignments).forEach((t) => { counts[t] += 1; });
    return counts;
  }, [state.themeAssignments]);

  const findings = THEMES.map((theme) => ({
    theme,
    evidenceQuoteIds: fixture.quotes.filter((q) => state.themeAssignments[q.id] === theme).map((q) => q.id),
  }));
  const classifiedCount = fixture.quotes.length - themeCounts.unassigned;

  const activeScreen = resolvedScreens.find((s) => s.id === state.activeScreenId) ?? resolvedScreens[0];

  const handleExportCsv = () => {
    downloadCsv('ux_research_board.csv', fixture.quotes.map((q) => ({
      quote_id: q.id, user_type: q.userType, quote: q.quote, theme: state.themeAssignments[q.id],
    })));
  };
  const handleExportJson = () => {
    downloadJson('ux_prototype.json', {
      variant, findings, prototype: resolvedScreens, tasks: taskResults, designRationale,
    });
  };

  const handleSubmit = () => {
    onSubmit({
      themeAssignments: state.themeAssignments,
      findings,
      problemStatementId: state.problemStatementId,
      bottleneckTheme: trueBottleneck,
      statementIsSupported,
      retryTarget: state.retryTarget,
      deadEndResolved: state.retryTarget === 'checkout',
      allTasksReachable,
      taskResults: taskResults.map((t) => ({ id: t.id, reachable: t.reachable })),
      designRationale,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Interviews Classified</span>
          <span className="text-xl font-black text-white">{classifiedCount} / {fixture.quotes.length}</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Step {stepIndex} in history</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Dead-End Screens</span>
          <span className={`text-xl font-black ${deadEndIds.length ? 'text-red-400' : 'text-emerald-400'}`}>{deadEndIds.length}</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">{deadEndIds.length ? deadEndIds.join(', ') : 'None detected'}</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Task Reachability</span>
          <span className={`text-xl font-black ${allTasksReachable ? 'text-emerald-400' : 'text-amber-400'}`}>
            {taskResults.filter((t) => t.reachable).length} / {taskResults.length}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Authored usability tasks</span>
        </div>
        <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30">
          <span className="text-xs text-purple-300 font-bold block mb-1">Problem Statement</span>
          <span className={`text-xl font-black ${statementIsSupported ? 'text-emerald-300' : 'text-slate-300'}`}>
            {selectedStatement ? (statementIsSupported ? 'Evidence-backed' : 'Unsupported') : 'Not selected'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>1. Affinity Board — Cluster 12 Interview Quotes</span>
              </h2>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={undo} disabled={!canUndo} title="Undo"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30 transition-colors"><Undo2 className="w-3.5 h-3.5" /></button>
                <button type="button" onClick={redo} disabled={!canRedo} title="Redo"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30 transition-colors"><Redo2 className="w-3.5 h-3.5" /></button>
                <button type="button" onClick={() => { reset(); onDirty(); }} title="Reset"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors"><RotateCcw className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
              {fixture.quotes.map((q) => (
                <div key={q.id} className="p-3 bg-black/20 border border-white/10 rounded-xl space-y-1.5 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-300">{q.userType}</span>
                    <select
                      value={state.themeAssignments[q.id]}
                      onChange={(e) => update({ themeAssignments: { ...state.themeAssignments, [q.id]: e.target.value as AssignedTheme } })}
                      className="bg-black/40 border border-white/15 rounded px-2 py-0.5 text-[11px] text-purple-300 focus:outline-none"
                    >
                      <option value="unassigned">Unsorted</option>
                      {THEMES.map((t) => <option key={t} value={t}>{THEME_LABEL[t]}</option>)}
                    </select>
                  </div>
                  <p className="text-slate-400 italic">&ldquo;{q.quote}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">Findings &amp; Linked Evidence</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {findings.map((f) => (
                <div key={f.theme} className={`p-3 rounded-2xl border text-xs ${f.evidenceQuoteIds.length >= 2 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/10'}`}>
                  <div className="flex items-center gap-1.5 font-bold text-white mb-1">
                    {f.evidenceQuoteIds.length >= 2 ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                    <span>{THEME_LABEL[f.theme]}</span>
                  </div>
                  <p className="text-slate-400">{f.evidenceQuoteIds.length} linked evidence quote(s)</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">2. Choose the Supported Problem Statement</h3>
            <div className="space-y-2">
              {statements.map((s) => (
                <button key={s.id} type="button" onClick={() => update({ problemStatementId: s.id })}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-colors ${state.problemStatementId === s.id ? 'bg-purple-600/20 border-purple-500/50 text-purple-100' : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'}`}>
                  {s.text}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <ChartFrame title="Enrollment Funnel" icon={<LineChartIcon className="w-4 h-4 text-purple-400" />}
            tableHeaders={['Stage', 'Learners']} tableRows={fixture.funnelSteps.map((s) => [s.label, s.count])}>
            <TrendLineChart labels={fixture.funnelSteps.map((s) => s.label)} series={[{ label: 'Learners', data: fixture.funnelSteps.map((s) => s.count), fill: true }]} yLabel="Learners" />
          </ChartFrame>

          <ChartFrame title="Finding Category Breakdown" icon={<PieChartIcon className="w-4 h-4 text-purple-400" />}
            tableHeaders={['Theme', 'Quotes']} tableRows={[...THEMES.map((t) => [THEME_LABEL[t], themeCounts[t]]), ['Unsorted', themeCounts.unassigned]]}>
            <BreakdownDoughnutChart labels={[...THEMES.map((t) => THEME_LABEL[t]), 'Unsorted']} values={[...THEMES.map((t) => themeCounts[t]), themeCounts.unassigned]} centerValue={String(classifiedCount)} centerLabel="Classified" />
          </ChartFrame>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <MousePointerClick className="w-3.5 h-3.5 text-purple-400" /> 3. Prototype Walkthrough
            </h3>
            <div className="p-4 bg-black/20 border border-white/10 rounded-xl min-h-[140px] flex flex-col justify-between">
              <div className="space-y-2">
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Screen: {activeScreen.label}</div>
                <p className="text-xs text-slate-300">{activeScreen.description}</p>
                {deadEndIds.includes(activeScreen.id) && (
                  <div className="p-2 rounded-lg bg-red-950/40 border border-red-800 text-red-300 text-[11px] flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> Dead end detected — no forward action configured.
                  </div>
                )}
                <div className="flex flex-wrap gap-1.5">
                  {activeScreen.actions.map((a) => (
                    a.editable ? null : (
                      <button key={a.id} type="button" disabled={!a.target}
                        onClick={() => update({ activeScreenId: a.target })}
                        className="px-2.5 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-200 text-[11px] font-bold disabled:opacity-30">
                        {a.label}
                      </button>
                    )
                  ))}
                </div>
              </div>
              {activeScreen.actions.some((a) => a.editable) && (
                <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400">Fix retry destination</span>
                  <select value={state.retryTarget} onChange={(e) => update({ retryTarget: e.target.value })}
                    className="text-[11px] font-bold px-2 py-1 rounded-lg bg-black/40 border border-white/15 text-slate-300">
                    <option value="">— none (dead end) —</option>
                    {resolvedScreens.filter((s) => s.id !== 'payment_failed').map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>
              )}
            </div>
            <div className="space-y-1.5">
              {taskResults.map((t) => (
                <div key={t.id} className="flex items-center justify-between text-[11px] p-2 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-slate-300 flex items-center gap-1.5"><MapPin className="w-3 h-3 text-slate-500" />{t.label}</span>
                  <span className={`font-bold ${t.reachable ? 'text-emerald-400' : 'text-red-400'}`}>{t.reachable ? 'Reachable' : 'Unreachable'}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-2">
            <label htmlFor="ux-rationale" className="text-xs font-extrabold text-white">Design Rationale (self-reviewed, not auto-graded for quality)</label>
            <textarea id="ux-rationale" rows={3} value={designRationale}
              onChange={(e) => { setDesignRationale(e.target.value); onDirty(); }}
              className="w-full text-xs p-3 rounded-xl bg-black/30 border border-white/15 text-slate-200 focus:outline-none focus:border-purple-500/50" />
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={handleExportCsv} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] font-bold transition-colors">
              <Download className="w-3.5 h-3.5" /><span>Board CSV</span>
            </button>
            <button type="button" onClick={handleExportJson} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] font-bold transition-colors">
              <FileJson className="w-3.5 h-3.5" /><span>Prototype JSON</span>
            </button>
          </div>

          <button type="button" onClick={handleSubmit}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold transition-all flex items-center justify-center gap-2">
            <Send className="w-4 h-4" /><span>Submit UX Research Report</span>
          </button>
        </div>
      </div>
    </div>
  );
}
