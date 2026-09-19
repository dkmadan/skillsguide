'use client';

import { useMemo, useState } from 'react';
import { LabScenarioVariant, LabDifficulty } from '@/lib/labs/types';
import { useUndoableState } from '@/lib/labs/useUndoableState';
import { downloadCsv, downloadJson } from '@/lib/labs/exportHelper';
import SimClock from '@/components/labs/SimClock';
import ChartFrame from '@/components/labs/charts/ChartFrame';
import TrendLineChart from '@/components/labs/charts/TrendLineChart';
import CompareRadarChart from '@/components/labs/charts/CompareRadarChart';
import {
  Undo2, Redo2, RotateCcw, Download, FileJson, Send, ArrowUp, ArrowDown,
  MessageSquare, HandshakeIcon, FileText, Info, Presentation,
} from 'lucide-react';

interface Props {
  scenario?: LabScenarioVariant;
  variant: LabDifficulty;
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

interface OutlineCard { id: string; heading: string; body: string; }
interface QaOption { id: string; label: string; quality: 'strong' | 'adequate' | 'weak'; }
interface QaPrompt { id: string; question: string; options: QaOption[]; }
interface NegotiationOption { id: string; label: string; description: string; principled: boolean; }

interface Fixture {
  label: string;
  stakeholderObjection: string;
  requestedCutWeeks: number;
  maxSafeCutWeeks: number;
  outline: OutlineCard[];
  questions: QaPrompt[];
  negotiationOptions: NegotiationOption[];
  interestAxes: string[];
  stakeholderInterests: number[];
  agreementEmphasis: Record<string, number[]>;
  targetWpmLow: number;
  targetWpmHigh: number;
}

// Three genuinely different fixture pools: the deadline gap between what the
// stakeholder is asking to cut and what is actually safe to cut widens from
// fully compatible (beginner) to irreconcilable without documented trade-offs
// (challenge), and the audience-question options get subtler per tier.
const FIXTURES: Record<LabDifficulty, Fixture> = {
  beginner: {
    label: 'Internal Platform Rollout Pitch',
    stakeholderObjection: 'CFO: "We would like the rollout three weeks sooner. Is that workable without cutting QA?"',
    requestedCutWeeks: 3,
    maxSafeCutWeeks: 4,
    outline: [
      { id: 'hook', heading: 'Opening Hook', body: 'Good morning executive committee. Today we propose deploying deterministic practice labs across our enterprise curriculum.' },
      { id: 'problem', heading: 'Problem Statement', body: 'Junior onboarding currently relies on black-box grading, which cannot verify genuine problem-solving skill.' },
      { id: 'solution', heading: 'Proposed Solution', body: 'By anchoring assessments in verifiable browser sandboxes, learners gain measurable, auditable fluency.' },
      { id: 'impact', heading: 'Business Impact', body: 'Over three quarters, this reduces junior onboarding escalation costs by an estimated 40%.' },
      { id: 'ask', heading: 'The Ask', body: 'We are asking for budget approval and a phased three-quarter rollout timeline.' },
    ],
    questions: [
      {
        id: 'q1', question: '"How do you know learners aren\'t just guessing the right answer?"',
        options: [
          { id: 'q1_a', label: 'Every submission is scored server-side against a deterministic rubric, not self-reported.', quality: 'strong' },
          { id: 'q1_b', label: 'We trust learners to be honest about their own progress.', quality: 'weak' },
          { id: 'q1_c', label: 'The interface makes guessing difficult.', quality: 'adequate' },
        ],
      },
      {
        id: 'q2', question: '"What happens if a lab has a bug in its scoring logic?"',
        options: [
          { id: 'q2_a', label: 'We have not needed to think about that yet.', quality: 'weak' },
          { id: 'q2_b', label: 'Scoring bugs are logged and patched centrally, and affected attempts are re-evaluated.', quality: 'strong' },
          { id: 'q2_c', label: 'Learners can just retake the lab.', quality: 'adequate' },
        ],
      },
      {
        id: 'q3', question: '"Why not just use existing off-the-shelf certification exams?"',
        options: [
          { id: 'q3_a', label: 'Off-the-shelf exams test recall; our labs test applied, hands-on execution in a realistic sandbox.', quality: 'strong' },
          { id: 'q3_b', label: 'Because building it ourselves is more interesting.', quality: 'weak' },
          { id: 'q3_c', label: 'Off-the-shelf exams are more expensive per seat.', quality: 'adequate' },
        ],
      },
    ],
    negotiationOptions: [
      { id: 'compromise_scope', label: 'Principled Trade-off', description: 'Ship the core rollout on the requested timeline; defer bonus tracks to a later phase.', principled: true },
      { id: 'crash_budget', label: 'Overtime Crash', description: 'Force the team into extended hours to hit the date without cutting scope.', principled: false },
      { id: 'surrender_quality', label: 'Cut QA', description: 'Ship without deterministic automated scoring checks to save time.', principled: false },
    ],
    interestAxes: ['Timeline', 'Budget', 'Scope', 'Quality', 'Team Morale'],
    stakeholderInterests: [5, 3, 2, 3, 2],
    agreementEmphasis: {
      compromise_scope: [4, 3, 3, 4, 4],
      crash_budget: [5, 2, 5, 2, 1],
      surrender_quality: [5, 4, 5, 1, 2],
    },
    targetWpmLow: 120,
    targetWpmHigh: 150,
  },
  intermediate: {
    label: 'Cross-Team Migration Proposal',
    stakeholderObjection: 'VP Engineering: "Leadership wants the migration four weeks sooner than your plan — can we make that work?"',
    requestedCutWeeks: 4,
    maxSafeCutWeeks: 3,
    outline: [
      { id: 'hook', heading: 'Opening Hook', body: 'Thank you for the time. We are proposing a phased migration of the legacy grading engine to the new deterministic scorer framework.' },
      { id: 'problem', heading: 'Problem Statement', body: 'The legacy engine cannot be audited, and two scoring disputes this quarter took a week each to resolve manually.' },
      { id: 'solution', heading: 'Proposed Solution', body: 'Migrate lab-by-lab behind a feature flag, validating each scorer against a golden test set before cutover.' },
      { id: 'impact', heading: 'Business Impact', body: 'This eliminates manual dispute resolution and gives us a fully reproducible audit trail for every submission.' },
      { id: 'ask', heading: 'The Ask', body: 'We are asking for a ten-week migration window and one dedicated reviewer.' },
    ],
    questions: [
      {
        id: 'q1', question: '"What is the rollback plan if a migrated scorer disagrees with the legacy one?"',
        options: [
          { id: 'q1_a', label: 'The feature flag reverts instantly to the legacy scorer while we investigate the discrepancy.', quality: 'strong' },
          { id: 'q1_b', label: 'We will fix it forward without rolling back.', quality: 'weak' },
          { id: 'q1_c', label: 'Discrepancies are rare enough not to plan for.', quality: 'weak' },
        ],
      },
      {
        id: 'q2', question: '"How do you validate a migrated scorer before it goes live?"',
        options: [
          { id: 'q2_a', label: 'Manual spot checks by the reviewer before launch.', quality: 'adequate' },
          { id: 'q2_b', label: 'Against a golden set of historical submissions with known expected scores, diffed automatically.', quality: 'strong' },
          { id: 'q2_c', label: 'We trust the original author\'s tests.', quality: 'weak' },
        ],
      },
      {
        id: 'q3', question: '"What is the cost of doing nothing this quarter?"',
        options: [
          { id: 'q3_a', label: 'Nothing changes, which is safer.', quality: 'weak' },
          { id: 'q3_b', label: 'Dispute resolution time compounds and the audit gap remains unaddressed for another quarter.', quality: 'strong' },
          { id: 'q3_c', label: 'A modest ongoing support cost continues.', quality: 'adequate' },
        ],
      },
    ],
    negotiationOptions: [
      { id: 'compromise_scope', label: 'Principled Trade-off', description: 'Migrate the highest-dispute labs first on the requested date; phase the rest in over the following quarter.', principled: true },
      { id: 'crash_budget', label: 'Overtime Crash', description: 'Compress the full migration into the requested window by adding unplanned overtime.', principled: false },
      { id: 'surrender_quality', label: 'Cut QA', description: 'Skip golden-set validation to migrate everything by the requested date.', principled: false },
    ],
    interestAxes: ['Timeline', 'Budget', 'Scope', 'Quality', 'Team Morale'],
    stakeholderInterests: [5, 3, 3, 4, 2],
    agreementEmphasis: {
      compromise_scope: [4, 3, 3, 4, 4],
      crash_budget: [5, 2, 5, 2, 1],
      surrender_quality: [5, 3, 5, 1, 2],
    },
    targetWpmLow: 120,
    targetWpmHigh: 150,
  },
  challenge: {
    label: 'Board-Level Restructuring Pitch',
    stakeholderObjection: 'Board Chair: "We need this restructuring live six weeks earlier than proposed, full stop."',
    requestedCutWeeks: 6,
    maxSafeCutWeeks: 3,
    outline: [
      { id: 'hook', heading: 'Opening Hook', body: 'Thank you, Board members. We are presenting a restructuring plan for how learner attempts are scored and audited platform-wide.' },
      { id: 'problem', heading: 'Problem Statement', body: 'Three separate scoring systems currently disagree on edge cases, undermining trust in verified results.' },
      { id: 'solution', heading: 'Proposed Solution', body: 'Consolidate onto a single deterministic scorer per lab, each independently reviewed and versioned.' },
      { id: 'impact', heading: 'Business Impact', body: 'A single source of truth for scoring restores confidence in every verified assessment report we issue.' },
      { id: 'ask', heading: 'The Ask', body: 'We are asking for board approval of a sixteen-week consolidation window across all thirty labs.' },
    ],
    questions: [
      {
        id: 'q1', question: '"Why sixteen weeks for something that sounds like configuration work?"',
        options: [
          { id: 'q1_a', label: 'It just takes that long.', quality: 'weak' },
          { id: 'q1_b', label: 'Each of the thirty labs needs its own reconciliation, review, and a rollback-safe cutover — that per-lab review is the majority of the time, not raw coding.', quality: 'strong' },
          { id: 'q1_c', label: 'We padded the estimate for safety.', quality: 'weak' },
        ],
      },
      {
        id: 'q2', question: '"What is the risk of compressing this to ten weeks instead?"',
        options: [
          { id: 'q2_a', label: 'Per-lab review would be skipped for the lowest-traffic labs, so their scoring disagreements would carry into the consolidated system unexamined.', quality: 'strong' },
          { id: 'q2_b', label: 'The team would just have to work faster.', quality: 'weak' },
          { id: 'q2_c', label: 'Some risk, but it is probably fine.', quality: 'weak' },
        ],
      },
      {
        id: 'q3', question: '"If we can\'t hit six weeks early, what can you commit to today?"',
        options: [
          { id: 'q3_a', label: 'Nothing further until the full sixteen weeks are approved as originally scoped.', quality: 'adequate' },
          { id: 'q3_b', label: 'We can consolidate the ten highest-traffic labs on an accelerated timeline now, with the remainder phased in transparently afterward.', quality: 'strong' },
          { id: 'q3_c', label: 'We will try to find time somewhere.', quality: 'weak' },
        ],
      },
    ],
    negotiationOptions: [
      { id: 'compromise_scope', label: 'Principled Trade-off', description: 'Consolidate the highest-traffic labs on an accelerated but reviewed timeline; phase the remainder in afterward with the gap explicitly documented.', principled: true },
      { id: 'crash_budget', label: 'Overtime Crash', description: 'Force the full thirty-lab consolidation into the requested window through mandatory overtime.', principled: false },
      { id: 'surrender_quality', label: 'Cut QA', description: 'Skip per-lab review entirely to hit the requested date across all thirty labs.', principled: false },
    ],
    interestAxes: ['Timeline', 'Budget', 'Scope', 'Quality', 'Team Morale'],
    stakeholderInterests: [5, 3, 4, 5, 2],
    agreementEmphasis: {
      compromise_scope: [4, 3, 3, 4, 3],
      crash_budget: [5, 2, 5, 2, 1],
      surrender_quality: [5, 3, 5, 1, 2],
    },
    targetWpmLow: 120,
    targetWpmHigh: 150,
  },
};

interface RehearsalPass { pass: number; minutes: number; words: number; wpm: number; }

interface PlannerState {
  outline: OutlineCard[];
  questionResponses: Record<string, string>;
  negotiationChoice: string;
  scopeConfirmed: boolean;
  agreedTerms: string;
  rehearsalLog: RehearsalPass[];
}

function initialState(fixture: Fixture): PlannerState {
  return {
    outline: fixture.outline,
    questionResponses: {},
    negotiationChoice: fixture.negotiationOptions[0].id,
    scopeConfirmed: false,
    agreedTerms: `Deliver the core scope on the agreed date; defer non-critical items to a documented follow-up phase so quality is never silently cut.`,
    rehearsalLog: [],
  };
}

export default function PresentationNegotiationLab({ variant, onDirty, onSubmit }: Props) {
  const fixture = FIXTURES[variant];
  const { state, set, undo, redo, reset, canUndo, canRedo, stepIndex, history } = useUndoableState<PlannerState>(initialState(fixture));
  const [clockStep, setClockStep] = useState(0); // 15s ticks, 0..20 (0..5 min)

  const update = (patch: Partial<PlannerState>) => {
    set((prev) => ({ ...prev, ...patch }));
    onDirty();
  };

  const wordCount = useMemo(
    () => state.outline.reduce((sum, card) => sum + card.body.trim().split(/\s+/).filter(Boolean).length, 0),
    [state.outline]
  );
  const rehearsalMinutes = (clockStep * 15) / 60;
  const wordsPerMinute = rehearsalMinutes > 0 ? Math.round(wordCount / rehearsalMinutes) : 0;

  const isIncompatible = fixture.requestedCutWeeks > fixture.maxSafeCutWeeks;

  const moveCard = (index: number, dir: -1 | 1) => {
    const next = [...state.outline];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    update({ outline: next });
  };

  const editCardBody = (id: string, body: string) => {
    update({ outline: state.outline.map((c) => (c.id === id ? { ...c, body } : c)) });
  };

  const logRehearsalPass = () => {
    const pass: RehearsalPass = { pass: state.rehearsalLog.length + 1, minutes: rehearsalMinutes, words: wordCount, wpm: wordsPerMinute };
    update({ rehearsalLog: [...state.rehearsalLog, pass] });
    setClockStep(0);
  };

  const negotiationOption = fixture.negotiationOptions.find((o) => o.id === state.negotiationChoice) ?? fixture.negotiationOptions[0];
  const agreementSeries = fixture.agreementEmphasis[state.negotiationChoice] ?? fixture.agreementEmphasis[fixture.negotiationOptions[0].id];

  const handleExportCsv = () => {
    downloadCsv('presentation_outline.csv', state.outline.map((c, i) => ({ order: i + 1, heading: c.heading, word_count: c.body.trim().split(/\s+/).filter(Boolean).length, body: c.body })));
  };

  const handleExportJson = () => {
    downloadJson('presentation_negotiation_agreement.json', {
      variant,
      outline: state.outline,
      rehearsalNotes: state.rehearsalLog,
      agreementDraft: { negotiationChoice: state.negotiationChoice, scopeConfirmed: state.scopeConfirmed, agreedTerms: state.agreedTerms },
      questionResponses: state.questionResponses,
      optimizationHistory: history.length,
    });
  };

  const handleSubmit = () => {
    onSubmit({
      variant,
      wordCount,
      rehearsalMinutes,
      wordsPerMinute,
      rehearsalLog: state.rehearsalLog,
      outline: state.outline,
      questionResponses: state.questionResponses,
      negotiationChoice: state.negotiationChoice,
      scopeConfirmed: state.scopeConfirmed,
      agreedTerms: state.agreedTerms,
      optimizationHistoryLength: history.length,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 uppercase">Outline Word Count</div>
          <div className="text-2xl font-bold text-white mt-1">{wordCount} Words</div>
          <p className="text-xs text-slate-500 mt-1">Sum across all outline cards</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 uppercase">Current Timer</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">{rehearsalMinutes.toFixed(2)} min</div>
          <p className="text-xs text-slate-500 mt-1">Manual rehearsal clock (this pass)</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 uppercase">Estimated Pace</div>
          <div className={`text-2xl font-bold mt-1 ${wordsPerMinute >= fixture.targetWpmLow && wordsPerMinute <= fixture.targetWpmHigh ? 'text-emerald-400' : 'text-amber-400'}`}>
            {rehearsalMinutes > 0 ? `${wordsPerMinute} WPM` : '— (0 min)'}
          </div>
          <p className="text-xs text-slate-500 mt-1">Target: {fixture.targetWpmLow}–{fixture.targetWpmHigh} WPM</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 uppercase">Rehearsal Passes Logged</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">{state.rehearsalLog.length}</div>
          <p className="text-xs text-slate-500 mt-1">Step {stepIndex} in history</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2"><Presentation className="w-4 h-4 text-amber-400" /><span>1. Outline Cards (drives the slide preview)</span></h3>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={undo} disabled={!canUndo} title="Undo" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30"><Undo2 className="w-3.5 h-3.5" /></button>
                <button type="button" onClick={redo} disabled={!canRedo} title="Redo" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30"><Redo2 className="w-3.5 h-3.5" /></button>
                <button type="button" onClick={() => { reset(); onDirty(); }} title="Reset" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white"><RotateCcw className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <div className="space-y-2.5">
              {state.outline.map((card, i) => (
                <div key={card.id} className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-bold text-white">{i + 1}. {card.heading}</span>
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => moveCard(i, -1)} disabled={i === 0} className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 text-slate-300" aria-label={`Move ${card.heading} up`}><ArrowUp className="w-3 h-3" /></button>
                      <button type="button" onClick={() => moveCard(i, 1)} disabled={i === state.outline.length - 1} className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 text-slate-300" aria-label={`Move ${card.heading} down`}><ArrowDown className="w-3 h-3" /></button>
                    </div>
                  </div>
                  <textarea rows={2} value={card.body} onChange={(e) => editCardBody(card.id, e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2">
            <h3 className="text-sm font-semibold text-white">Text-Only Slide Preview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {state.outline.map((card, i) => (
                <div key={card.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-amber-400 font-bold uppercase">Slide {i + 1}</div>
                  <div className="text-xs font-bold text-white mt-0.5">{card.heading}</div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-3">{card.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2"><MessageSquare className="w-4 h-4 text-amber-400" /><span>2. Prepared Audience Question Deck</span></h3>
            {fixture.questions.map((q) => (
              <div key={q.id} className="space-y-1.5">
                <p className="text-xs text-slate-300">{q.question}</p>
                <div className="space-y-1.5">
                  {q.options.map((opt) => (
                    <button key={opt.id} type="button" onClick={() => update({ questionResponses: { ...state.questionResponses, [q.id]: opt.id } })}
                      className={`w-full text-left p-2 rounded-lg border text-[11px] transition ${state.questionResponses[q.id] === opt.id ? 'bg-amber-500/20 border-amber-500 text-amber-200 font-semibold' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-white">Manual Rehearsal Timer</h3>
            <SimClock label="Elapsed rehearsal time (this pass)" step={clockStep} maxStep={20}
              stepLabel={(s) => `${Math.floor((s * 15) / 60)}:${String((s * 15) % 60).padStart(2, '0')}`}
              onAdvance={() => { setClockStep((s) => Math.min(20, s + 1)); onDirty(); }}
              onReset={() => setClockStep(0)} />
            <button type="button" onClick={logRehearsalPass} disabled={rehearsalMinutes <= 0}
              className="w-full py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-bold disabled:opacity-40">
              Log Rehearsal Pass ({wordCount} words / {rehearsalMinutes.toFixed(2)} min)
            </button>
          </div>

          <ChartFrame title="Rehearsal Pace Across Passes" icon={<FileText className="w-4 h-4 text-amber-400" />}
            tableHeaders={['Pass', 'Minutes', 'WPM']}
            tableRows={state.rehearsalLog.map((p) => [p.pass, p.minutes.toFixed(2), p.wpm])}>
            <TrendLineChart labels={state.rehearsalLog.map((p) => `Pass ${p.pass}`)}
              series={[
                { label: 'Your Pace (WPM)', data: state.rehearsalLog.map((p) => p.wpm) },
                { label: 'Target Pace', data: state.rehearsalLog.map(() => Math.round((fixture.targetWpmLow + fixture.targetWpmHigh) / 2)) },
              ]}
              yLabel="Words / minute" />
          </ChartFrame>

          <ChartFrame title="Stakeholder Interests Map" icon={<HandshakeIcon className="w-4 h-4 text-amber-400" />}
            tableHeaders={['Interest', 'Stakeholder Priority', 'Your Agreement Emphasis']}
            tableRows={fixture.interestAxes.map((axis, i) => [axis, fixture.stakeholderInterests[i], agreementSeries[i]])}>
            <CompareRadarChart axes={fixture.interestAxes} max={5}
              series={[
                { label: 'Stakeholder Priorities', data: fixture.stakeholderInterests },
                { label: 'Your Agreement Emphasis', data: agreementSeries },
              ]} />
          </ChartFrame>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 text-xs">
            <h3 className="text-sm font-semibold text-white">3. Deadline Negotiation &amp; Agreement</h3>
            <p className="text-slate-400">{fixture.stakeholderObjection}</p>
            {isIncompatible && (
              <div className="p-2.5 rounded-lg bg-red-950/30 border border-red-500/40 flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
                <p className="text-[11px] text-red-200">Incompatible ask: requested a {fixture.requestedCutWeeks}-week cut, but only {fixture.maxSafeCutWeeks} weeks can be cut safely. No option fully closes this gap — document the residual trade-off explicitly.</p>
              </div>
            )}
            <div className="space-y-2">
              {fixture.negotiationOptions.map((opt) => (
                <button key={opt.id} type="button" onClick={() => update({ negotiationChoice: opt.id })}
                  className={`w-full text-left p-3 rounded-xl border transition ${state.negotiationChoice === opt.id ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-semibold' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                  <span className="block font-bold">{opt.label}</span>
                  <span className="block text-[11px] font-normal mt-0.5">{opt.description}</span>
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 text-[11px] text-slate-300 pt-1">
              <input type="checkbox" checked={state.scopeConfirmed} onChange={(e) => update({ scopeConfirmed: e.target.checked })} className="accent-amber-500" />
              I explicitly confirm the final scope with the stakeholder (required before agreement is final).
            </label>
            <div className="pt-2 border-t border-slate-800">
              <label className="text-slate-400 block mb-1">Final Negotiated Term Sheet (Agreement Draft)</label>
              <textarea rows={3} value={state.agreedTerms} onChange={(e) => update({ agreedTerms: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none" />
            </div>
            <p className="text-[10px] text-slate-500 italic">Selected stance: {negotiationOption.label}. Pace and delivery are estimated from typed word count and your manually entered rehearsal duration only — no microphone, camera, transcription or speech analysis is used.</p>
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={handleExportCsv} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-bold"><Download className="w-3.5 h-3.5" /><span>CSV Outline</span></button>
            <button type="button" onClick={handleExportJson} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-bold"><FileJson className="w-3.5 h-3.5" /><span>JSON Agreement</span></button>
          </div>

          <button type="button" onClick={handleSubmit}
            className="w-full px-4 py-3 text-xs font-extrabold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2">
            <Send className="w-4 h-4" /><span>Submit Agreement</span>
          </button>
        </div>
      </div>
    </div>
  );
}
