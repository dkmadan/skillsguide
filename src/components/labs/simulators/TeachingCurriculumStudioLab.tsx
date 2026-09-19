'use client';

import { useMemo, useState } from 'react';
import { LabScenarioVariant, LabDifficulty } from '@/lib/labs/types';
import { useUndoableState } from '@/lib/labs/useUndoableState';
import { downloadCsv, downloadJson } from '@/lib/labs/exportHelper';
import ChartFrame from '@/components/labs/charts/ChartFrame';
import TrendLineChart from '@/components/labs/charts/TrendLineChart';
import CompareBarChart from '@/components/labs/charts/CompareBarChart';
import {
  Undo2, Redo2, RotateCcw, Download, FileJson, Send, ArrowUp, ArrowDown,
  ClipboardCheck, GraduationCap, Info,
} from 'lucide-react';

interface Props {
  scenario?: LabScenarioVariant;
  variant: LabDifficulty;
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

type SegmentType = 'warmup' | 'lecture' | 'interactive_lab' | 'wrapup';

interface Objective { id: string; label: string; competencyTag: string; }
interface LessonSegment { id: string; title: string; type: SegmentType; durationMins: number; objectiveId: string | null; hasAssessment: boolean; accessibleAlt: string; }
interface CurriculumUnit { id: string; title: string; competencyTag: string; prerequisiteId?: string; }
interface MisconceptionOption { id: string; label: string; quality: 'strong' | 'adequate' | 'weak'; }

interface Fixture {
  label: string;
  targetMaxMins: number;
  objectives: Objective[];
  segments: LessonSegment[];
  curriculumUnits: CurriculumUnit[];
  curriculumOrder: string[];
  misconceptionPrompt: string;
  misconceptionOptions: MisconceptionOption[];
}

// Three genuinely different fixtures: the beginner plan already fits inside
// the 40-minute ceiling with a single missing-assessment gap and a correctly
// ordered curriculum; intermediate overflows by 5 minutes with an entirely
// uncovered objective and one broken prerequisite; challenge overflows by 10
// minutes with two uncovered objectives and two broken prerequisites.
const FIXTURES: Record<LabDifficulty, Fixture> = {
  beginner: {
    label: 'SQL Joins — Single Class Session',
    targetMaxMins: 40,
    objectives: [
      { id: 'obj1', label: 'Identify LEFT vs INNER JOIN row-count differences', competencyTag: 'sql-joins' },
      { id: 'obj2', label: 'Write a basic INNER JOIN query', competencyTag: 'sql-syntax' },
      { id: 'obj3', label: 'Diagnose an unexpected row-multiplication (Cartesian) bug', competencyTag: 'sql-debugging' },
      { id: 'obj4', label: 'Self-assess understanding via exit ticket', competencyTag: 'metacognition' },
    ],
    segments: [
      { id: 'seg1', title: 'Interactive Warmup & Diagnostic Probe', type: 'warmup', durationMins: 5, objectiveId: 'obj1', hasAssessment: true, accessibleAlt: 'Provide a printed row-matching handout for learners who prefer not to use the live poll tool.' },
      { id: 'seg2', title: 'Conceptual Walkthrough (SQL Joins)', type: 'lecture', durationMins: 15, objectiveId: 'obj2', hasAssessment: false, accessibleAlt: '' },
      { id: 'seg3', title: 'Hands-on Browser Practice Lab', type: 'interactive_lab', durationMins: 15, objectiveId: 'obj3', hasAssessment: true, accessibleAlt: 'Offer a paired-programming option for learners who find independent typing difficult.' },
      { id: 'seg4', title: 'Class Reflection & Formative Exit Ticket', type: 'wrapup', durationMins: 5, objectiveId: 'obj4', hasAssessment: true, accessibleAlt: 'Allow verbal exit-ticket responses recorded by a peer scribe.' },
    ],
    curriculumUnits: [
      { id: 'unitA', title: 'Relational Model Refresher', competencyTag: 'sql-foundations' },
      { id: 'unitB', title: 'Join Types & Row Semantics', competencyTag: 'sql-joins', prerequisiteId: 'unitA' },
      { id: 'unitC', title: 'Debugging Join Bugs in Practice', competencyTag: 'sql-debugging', prerequisiteId: 'unitB' },
    ],
    curriculumOrder: ['unitA', 'unitB', 'unitC'],
    misconceptionPrompt: '60% of students assume an INNER JOIN always produces fewer rows than the unjoined table, then get confused when duplicate keys create a Cartesian product.',
    misconceptionOptions: [
      { id: 'trace', label: 'Step through a concrete row-matching trace with duplicate keys highlighted.', quality: 'strong' },
      { id: 'homework', label: 'Assign 20 additional SQL drill problems without further explanation.', quality: 'weak' },
      { id: 'ignore', label: 'Skip the confusion and move directly to indexing.', quality: 'weak' },
    ],
  },
  intermediate: {
    label: 'SQL Joins, Indexing & Debugging — Extended Session',
    targetMaxMins: 40,
    objectives: [
      { id: 'obj1', label: 'Explain why LEFT JOIN preserves unmatched left-table rows', competencyTag: 'sql-joins' },
      { id: 'obj2', label: 'Write a multi-table JOIN with an explicit ON clause', competencyTag: 'sql-syntax' },
      { id: 'obj3', label: 'Identify a Cartesian-product bug from row-count symptoms', competencyTag: 'sql-debugging' },
      { id: 'obj4', label: 'Explain why an unindexed JOIN column slows a query', competencyTag: 'sql-performance' },
      { id: 'obj5', label: 'Self-assess confidence against every lesson objective', competencyTag: 'metacognition' },
    ],
    segments: [
      { id: 'seg1', title: 'Interactive Warmup & Diagnostic Probe', type: 'warmup', durationMins: 5, objectiveId: 'obj1', hasAssessment: true, accessibleAlt: 'Provide a handout version of the warm-up poll.' },
      { id: 'seg2', title: 'Conceptual Walkthrough (Multi-table JOINs)', type: 'lecture', durationMins: 20, objectiveId: 'obj2', hasAssessment: false, accessibleAlt: '' },
      { id: 'seg3', title: 'Hands-on Browser Practice Lab', type: 'interactive_lab', durationMins: 15, objectiveId: 'obj3', hasAssessment: true, accessibleAlt: '' },
      { id: 'seg4', title: 'Indexing Mini-Lecture', type: 'wrapup', durationMins: 5, objectiveId: 'obj4', hasAssessment: false, accessibleAlt: '' },
    ],
    curriculumUnits: [
      { id: 'unitA', title: 'Relational Model Refresher', competencyTag: 'sql-foundations' },
      { id: 'unitB', title: 'Join Types & Row Semantics', competencyTag: 'sql-joins', prerequisiteId: 'unitA' },
      { id: 'unitC', title: 'Index Fundamentals', competencyTag: 'sql-performance', prerequisiteId: 'unitA' },
      { id: 'unitD', title: 'Debugging Join & Performance Bugs', competencyTag: 'sql-debugging', prerequisiteId: 'unitB' },
    ],
    curriculumOrder: ['unitA', 'unitD', 'unitB', 'unitC'],
    misconceptionPrompt: 'Students believe adding more JOINs always returns more precise results, not realizing an unindexed multi-way JOIN can silently multiply rows via duplicate keys across tables.',
    misconceptionOptions: [
      { id: 'trace', label: 'Trace a live 2-table example step by step, counting expected vs. actual output rows before scaling to three tables.', quality: 'strong' },
      { id: 'explain', label: 'Explain the Cartesian-product concept verbally without a concrete row trace.', quality: 'adequate' },
      { id: 'homework', label: 'Assign extra homework problems on JOIN syntax without addressing the row-count reasoning.', quality: 'weak' },
    ],
  },
  challenge: {
    label: 'SQL Joins, Performance & Secure Query Design — Full Unit',
    targetMaxMins: 40,
    objectives: [
      { id: 'obj1', label: 'Identify LEFT vs INNER JOIN row-count differences', competencyTag: 'sql-joins' },
      { id: 'obj2', label: 'Write a multi-table JOIN with an explicit ON clause', competencyTag: 'sql-syntax' },
      { id: 'obj3', label: 'Diagnose an unexpected row-multiplication (Cartesian) bug', competencyTag: 'sql-debugging' },
      { id: 'obj4', label: 'Explain why an unindexed JOIN column slows a query', competencyTag: 'sql-performance' },
      { id: 'obj5', label: 'Recognize why string-concatenated JOIN conditions risk injection', competencyTag: 'sql-security' },
      { id: 'obj6', label: 'Self-assess confidence against every lesson objective', competencyTag: 'metacognition' },
    ],
    segments: [
      { id: 'seg1', title: 'Interactive Warmup & Diagnostic Probe', type: 'warmup', durationMins: 10, objectiveId: 'obj1', hasAssessment: true, accessibleAlt: 'Provide a printed row-matching handout as an alternative to the live poll tool.' },
      { id: 'seg2', title: 'Conceptual Walkthrough (Multi-table JOINs)', type: 'lecture', durationMins: 20, objectiveId: 'obj2', hasAssessment: false, accessibleAlt: '' },
      { id: 'seg3', title: 'Hands-on Browser Practice Lab', type: 'interactive_lab', durationMins: 15, objectiveId: 'obj3', hasAssessment: true, accessibleAlt: '' },
      { id: 'seg4', title: 'Indexing Mini-Lecture', type: 'lecture', durationMins: 5, objectiveId: 'obj4', hasAssessment: false, accessibleAlt: '' },
    ],
    curriculumUnits: [
      { id: 'unitA', title: 'Relational Model Refresher', competencyTag: 'sql-foundations' },
      { id: 'unitB', title: 'Join Types & Row Semantics', competencyTag: 'sql-joins', prerequisiteId: 'unitA' },
      { id: 'unitE', title: 'Debugging Join & Performance Bugs', competencyTag: 'sql-debugging', prerequisiteId: 'unitB' },
      { id: 'unitC', title: 'Security-Aware Query Design', competencyTag: 'sql-security', prerequisiteId: 'unitE' },
      { id: 'unitD', title: 'Index Fundamentals', competencyTag: 'sql-performance', prerequisiteId: 'unitA' },
    ],
    curriculumOrder: ['unitC', 'unitE', 'unitA', 'unitD', 'unitB'],
    misconceptionPrompt: 'A student argues that because their multi-table JOIN "ran without errors," the output must be correct — even though the row count is 3x the source table.',
    misconceptionOptions: [
      { id: 'trace', label: 'Walk through a minimal 2-row-per-table example live, counting expected vs. actual output rows together.', quality: 'strong' },
      { id: 'explain', label: 'Explain the Cartesian-product concept verbally without a concrete trace.', quality: 'adequate' },
      { id: 'ignore', label: 'Note it briefly in passing and move on to the next topic.', quality: 'weak' },
    ],
  },
};

const RUBRIC_ITEMS = [
  { id: 'criteria', label: 'States a clear, observable success criterion for the intervention' },
  { id: 'evidence', label: 'Names specific evidence of the misconception, not a generic description' },
  { id: 'action', label: 'Proposes a concrete, actionable remediation step' },
  { id: 'respectful', label: 'Uses respectful, bias-free language about learners' },
];

interface StudioState {
  segments: LessonSegment[];
  curriculumOrder: string[];
  misconceptionRemedy: string;
  rubricChecks: Record<string, boolean>;
}

function initialState(fixture: Fixture): StudioState {
  return {
    segments: fixture.segments,
    curriculumOrder: fixture.curriculumOrder,
    misconceptionRemedy: '',
    rubricChecks: Object.fromEntries(RUBRIC_ITEMS.map((r) => [r.id, false])),
  };
}

function checkPrerequisites(order: string[], units: CurriculumUnit[]): { unit: CurriculumUnit; ok: boolean }[] {
  return units.map((u) => {
    if (!u.prerequisiteId) return { unit: u, ok: true };
    const prereqIdx = order.indexOf(u.prerequisiteId);
    const unitIdx = order.indexOf(u.id);
    return { unit: u, ok: prereqIdx >= 0 && unitIdx >= 0 && prereqIdx < unitIdx };
  });
}

export default function TeachingCurriculumStudioLab({ variant, onDirty, onSubmit }: Props) {
  const fixture = FIXTURES[variant];
  const { state, set, undo, redo, reset, canUndo, canRedo, stepIndex, history } = useUndoableState<StudioState>(initialState(fixture));
  const [pedagogicalNotes, setPedagogicalNotes] = useState('');

  const update = (patch: Partial<StudioState>) => {
    set((prev) => ({ ...prev, ...patch }));
    onDirty();
  };

  const totalDuration = useMemo(() => state.segments.reduce((s, seg) => s + seg.durationMins, 0), [state.segments]);
  const isOverTime = totalDuration > fixture.targetMaxMins;

  const cumulativeMinutes = useMemo(
    () => state.segments.reduce<number[]>((acc, seg) => {
      const prevTotal = acc.length > 0 ? acc[acc.length - 1] : 0;
      return [...acc, prevTotal + seg.durationMins];
    }, []),
    [state.segments]
  );

  const coverage = useMemo(() => fixture.objectives.map((obj) => {
    const matching = state.segments.filter((s) => s.objectiveId === obj.id);
    return { objective: obj, segmentCount: matching.length, assessedCount: matching.filter((s) => s.hasAssessment).length };
  }), [fixture.objectives, state.segments]);

  const prereqChecks = useMemo(() => checkPrerequisites(state.curriculumOrder, fixture.curriculumUnits), [state.curriculumOrder, fixture.curriculumUnits]);
  const allPrereqsOk = prereqChecks.every((c) => c.ok);

  const accessibleAltCoverage = state.segments.filter((s) => s.accessibleAlt.trim().length >= 8).length;

  const updateSegment = (id: string, patch: Partial<LessonSegment>) => {
    update({ segments: state.segments.map((s) => (s.id === id ? { ...s, ...patch } : s)) });
  };

  const moveUnit = (index: number, dir: -1 | 1) => {
    const next = [...state.curriculumOrder];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    update({ curriculumOrder: next });
  };

  const toggleRubric = (id: string) => update({ rubricChecks: { ...state.rubricChecks, [id]: !state.rubricChecks[id] } });

  const handleExportCsv = () => {
    downloadCsv('lesson_plan.csv', state.segments.map((s) => ({
      title: s.title, type: s.type, duration_mins: s.durationMins, objective: fixture.objectives.find((o) => o.id === s.objectiveId)?.label || 'Unassigned', has_assessment: s.hasAssessment, accessible_alternative: s.accessibleAlt,
    })));
  };

  const handleExportJson = () => {
    downloadJson('teaching_curriculum_studio.json', {
      variant,
      lessonPlan: { segments: state.segments, totalDuration, targetMaxMins: fixture.targetMaxMins, isOverTime },
      curriculumMap: { order: state.curriculumOrder, units: fixture.curriculumUnits, allPrereqsOk },
      assessmentOutline: coverage,
      reflection: { pedagogicalNotes, rubricChecks: state.rubricChecks, misconceptionRemedy: state.misconceptionRemedy },
      optimizationHistory: history.length,
    });
  };

  const handleSubmit = () => {
    onSubmit({
      variant,
      segments: state.segments,
      totalDuration,
      targetMaxMins: fixture.targetMaxMins,
      isOverTime,
      objectives: fixture.objectives,
      curriculumOrder: state.curriculumOrder,
      misconceptionRemedy: state.misconceptionRemedy,
      rubricChecks: state.rubricChecks,
      pedagogicalNotes,
      optimizationHistoryLength: history.length,
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">Lab 28 • Curriculum Architecture &amp; Pedagogy</span>
            <h2 className="text-xl font-bold text-white mt-2">{fixture.label}</h2>
            <p className="text-sm text-slate-400 mt-1">Sequence a {fixture.targetMaxMins}-minute instructional block, pair objectives with assessments, order the curriculum by prerequisite, and respond to a classroom misconception. Coverage here is structural — not proof of teaching effectiveness.</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={undo} disabled={!canUndo} title="Undo" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 disabled:opacity-30"><Undo2 className="w-3.5 h-3.5" /></button>
            <button type="button" onClick={redo} disabled={!canRedo} title="Redo" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 disabled:opacity-30"><Redo2 className="w-3.5 h-3.5" /></button>
            <button type="button" onClick={() => { reset(); onDirty(); }} title="Reset" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white"><RotateCcw className="w-3.5 h-3.5" /></button>
            <button onClick={handleExportCsv} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1.5"><Download className="w-3.5 h-3.5" />CSV</button>
            <button onClick={handleExportJson} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1.5"><FileJson className="w-3.5 h-3.5" />JSON</button>
            <button onClick={handleSubmit} className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold transition shadow-lg shadow-teal-500/20 flex items-center gap-1.5"><Send className="w-3.5 h-3.5" />Submit</button>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-semibold text-slate-300">Total Instructional Time Allotment</span>
          <span className={`font-mono font-bold ${isOverTime ? 'text-rose-400' : 'text-emerald-400'}`}>{totalDuration} / {fixture.targetMaxMins} Minutes {isOverTime && '(OVER SCHEDULE)'}</span>
        </div>
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-300 ${isOverTime ? 'bg-rose-500' : 'bg-teal-500'}`} style={{ width: `${Math.min(100, (totalDuration / fixture.targetMaxMins) * 100)}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white">1. Instructional Sequence &amp; Objective-to-Assessment Map</h3>
            <div className="space-y-3">
              {state.segments.map((seg) => (
                <div key={seg.id} className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{seg.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded uppercase font-semibold bg-slate-800 text-slate-300">{seg.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="number" min={1} max={30} value={seg.durationMins}
                        onChange={(e) => updateSegment(seg.id, { durationMins: parseInt(e.target.value) || 1 })}
                        className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-center font-mono text-white text-xs" aria-label={`${seg.title} duration`} />
                      <span className="text-slate-400">min</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <label className="text-slate-400">Objective:</label>
                    <select value={seg.objectiveId ?? ''} onChange={(e) => updateSegment(seg.id, { objectiveId: e.target.value || null })}
                      className="text-[11px] font-bold px-2 py-1 rounded-lg bg-black/40 border border-white/15 text-slate-300">
                      <option value="">Unassigned</option>
                      {fixture.objectives.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
                    </select>
                    <label className="flex items-center gap-1.5 text-slate-300">
                      <input type="checkbox" checked={seg.hasAssessment} onChange={(e) => updateSegment(seg.id, { hasAssessment: e.target.checked })} className="accent-teal-500" />
                      Formative check included
                    </label>
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Accessible alternative activity (differentiation):</label>
                    <input type="text" value={seg.accessibleAlt} onChange={(e) => updateSegment(seg.id, { accessibleAlt: e.target.value })}
                      placeholder="Describe an alternative pathway for learners who need it..."
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs" />
                  </div>
                </div>
              ))}
            </div>
            {!fixture.objectives.every((o) => coverage.find((c) => c.objective.id === o.id)!.assessedCount > 0) && (
              <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/40 flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                <p className="text-[11px] text-amber-200">Objective(s) without any assessment-bearing segment: {fixture.objectives.filter((o) => coverage.find((c) => c.objective.id === o.id)!.assessedCount === 0).map((o) => o.label).join('; ')}.</p>
              </div>
            )}
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-white">2. Curriculum Sequence (Prerequisite Ordering)</h3>
            <div className="space-y-2">
              {state.curriculumOrder.map((unitId, i) => {
                const unit = fixture.curriculumUnits.find((u) => u.id === unitId)!;
                const check = prereqChecks.find((c) => c.unit.id === unitId)!;
                return (
                  <div key={unitId} className={`p-3 rounded-xl border flex items-center justify-between gap-2 text-xs ${check.ok ? 'bg-slate-950/60 border-slate-800' : 'bg-red-950/30 border-red-500/40'}`}>
                    <div>
                      <span className="font-bold text-white">{i + 1}. {unit.title}</span>
                      {unit.prerequisiteId && (
                        <p className={`text-[10px] mt-0.5 ${check.ok ? 'text-slate-400' : 'text-red-300 font-semibold'}`}>
                          Requires: {fixture.curriculumUnits.find((u) => u.id === unit.prerequisiteId)?.title} {check.ok ? '✓' : '— out of order!'}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => moveUnit(i, -1)} disabled={i === 0} className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 text-slate-300" aria-label={`Move ${unit.title} up`}><ArrowUp className="w-3 h-3" /></button>
                      <button type="button" onClick={() => moveUnit(i, 1)} disabled={i === state.curriculumOrder.length - 1} className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 text-slate-300" aria-label={`Move ${unit.title} down`}><ArrowDown className="w-3 h-3" /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <ChartFrame title="Lesson Timeline vs. Time Budget" icon={<GraduationCap className="w-4 h-4 text-teal-400" />}
            tableHeaders={['Segment', 'Cumulative Minutes']}
            tableRows={state.segments.map((s, i) => [s.title, cumulativeMinutes[i]])}>
            <TrendLineChart labels={state.segments.map((_, i) => `${i + 1}`)}
              series={[
                { label: 'Cumulative minutes', data: cumulativeMinutes, fill: true },
                { label: `${fixture.targetMaxMins}-min limit`, data: state.segments.map(() => fixture.targetMaxMins) },
              ]} yLabel="Minutes" />
          </ChartFrame>

          <ChartFrame title="Competency Coverage" icon={<ClipboardCheck className="w-4 h-4 text-teal-400" />}
            tableHeaders={['Objective', 'Segments', 'With Assessment']}
            tableRows={coverage.map((c) => [c.objective.label, c.segmentCount, c.assessedCount])}>
            <CompareBarChart horizontal labels={coverage.map((c) => c.objective.competencyTag)}
              series={[
                { label: 'Segments', data: coverage.map((c) => c.segmentCount) },
                { label: 'With assessment', data: coverage.map((c) => c.assessedCount) },
              ]} />
          </ChartFrame>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
            <h3 className="text-sm font-semibold text-white">3. Classroom Misconception Scenario</h3>
            <p className="text-slate-400">{fixture.misconceptionPrompt}</p>
            <div className="space-y-2">
              {fixture.misconceptionOptions.map((opt) => (
                <button key={opt.id} type="button" onClick={() => update({ misconceptionRemedy: opt.id })}
                  className={`w-full text-left p-3 rounded-xl border transition ${state.misconceptionRemedy === opt.id ? 'bg-teal-500/20 border-teal-500 text-teal-300 font-semibold' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-2">
              <label className="text-slate-400 block">Curriculum Design Rationale &amp; Reflection</label>
              <textarea rows={3} value={pedagogicalNotes} onChange={(e) => { setPedagogicalNotes(e.target.value); onDirty(); }}
                placeholder="Explain how your lesson sequence and remediation address the identified learner misconception, time constraints, and prerequisite progression..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 placeholder:text-slate-600 focus:outline-none" />
              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Self-Review Rubric</span>
                {RUBRIC_ITEMS.map((item) => (
                  <label key={item.id} className="flex items-center gap-2 text-[11px] text-slate-300">
                    <input type="checkbox" checked={state.rubricChecks[item.id]} onChange={() => toggleRubric(item.id)} className="accent-teal-500" />
                    {item.label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="block text-slate-400">Prerequisite ordering</span>
              <span className={`font-bold ${allPrereqsOk ? 'text-emerald-400' : 'text-rose-400'}`}>{allPrereqsOk ? 'Valid' : 'Out of order'}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="block text-slate-400">Accessible alternatives</span>
              <span className="font-bold text-teal-300">{accessibleAltCoverage}/{state.segments.length} segments</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 text-right">History step {stepIndex}</p>
        </div>
      </div>
    </div>
  );
}
