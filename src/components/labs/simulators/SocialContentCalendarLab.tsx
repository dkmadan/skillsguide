'use client';

import { useMemo } from 'react';
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
  Send,
  Download,
  FileJson,
  AlertTriangle,
  CheckCircle2,
  CalendarDays,
  MessageCircle,
  LineChart as LineChartIcon,
  BarChart3,
  PieChart,
} from 'lucide-react';

interface SimulatorProps {
  scenario?: LabScenarioVariant;
  variant: LabDifficulty;
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

type Day = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
type Pillar = 'educational' | 'community' | 'product_announcement' | 'career_advice';

const DAYS: Day[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const PILLARS: Pillar[] = ['educational', 'community', 'product_announcement', 'career_advice'];
const PILLAR_LABEL: Record<Pillar, string> = {
  educational: 'Educational', community: 'Community', product_announcement: 'Product Announcement', career_advice: 'Career Advice',
};

interface SocialPost {
  id: string;
  day: Day;
  pillar: Pillar;
  copy: string;
  imageAltText: string;
}

// Three genuinely different weekly calendars — increasing ambiguity via more
// same-day conflicts, more missing alt-text, and a heavier pillar imbalance
// that must be actively rebalanced (not just re-labeled).
const POST_POOLS: Record<LabDifficulty, SocialPost[]> = {
  beginner: [
    { id: 'p1', day: 'Mon', pillar: 'educational', copy: '5 Common Pitfalls in SQL Joins & How to Avoid Null Leakage.', imageAltText: 'Diagram illustrating Left Join vs Inner Join row retention' },
    { id: 'p2', day: 'Tue', pillar: 'career_advice', copy: 'How to transition from BI reporting to data engineering in 6 months.', imageAltText: '' },
    { id: 'p3', day: 'Tue', pillar: 'product_announcement', copy: 'Announcing 30 new Virtual Practice Labs on SkillsGuide!', imageAltText: 'Screenshot of interactive lab dashboard' },
    { id: 'p4', day: 'Thu', pillar: 'educational', copy: 'Understanding P99 Latency: why averages lie about user experience.', imageAltText: 'Graph showing long tail latency distribution' },
    { id: 'p5', day: 'Fri', pillar: 'community', copy: 'Learner Spotlight: meet Sarah, who just landed an SRE role!', imageAltText: 'Portrait of learner Sarah with celebration badge' },
  ],
  intermediate: [
    { id: 'p1', day: 'Mon', pillar: 'educational', copy: 'Indexing 101: why your query is slow even with the right WHERE clause.', imageAltText: 'Diagram of a B-tree index lookup path' },
    { id: 'p2', day: 'Mon', pillar: 'educational', copy: 'Window functions explained with a running-total example.', imageAltText: 'Table showing a running total column' },
    { id: 'p3', day: 'Tue', pillar: 'career_advice', copy: 'Portfolio projects that actually get analysts hired.', imageAltText: '' },
    { id: 'p4', day: 'Tue', pillar: 'product_announcement', copy: 'New: export any lab result as a verified PDF report.', imageAltText: 'Screenshot of the PDF export button' },
    { id: 'p5', day: 'Thu', pillar: 'educational', copy: 'Normalization vs denormalization: a practical decision guide.', imageAltText: 'Side-by-side schema comparison diagram' },
    { id: 'p6', day: 'Fri', pillar: 'educational', copy: 'Common dashboard mistakes that mislead stakeholders.', imageAltText: '' },
    { id: 'p7', day: 'Sat', pillar: 'product_announcement', copy: 'Weekend challenge: try the new SQL lab tier.', imageAltText: 'Banner for the weekend challenge lab' },
  ],
  challenge: [
    { id: 'p1', day: 'Mon', pillar: 'educational', copy: 'Query plans decoded: reading EXPLAIN output line by line.', imageAltText: 'Annotated query execution plan diagram' },
    { id: 'p2', day: 'Mon', pillar: 'community', copy: 'Community AMA recap: your top data career questions answered.', imageAltText: '' },
    { id: 'p3', day: 'Tue', pillar: 'educational', copy: 'CTEs vs subqueries: readability and performance trade-offs.', imageAltText: 'Code comparison of CTE and subquery syntax' },
    { id: 'p4', day: 'Tue', pillar: 'educational', copy: 'Partitioning strategies for large fact tables.', imageAltText: 'Diagram of a partitioned fact table' },
    { id: 'p5', day: 'Wed', pillar: 'product_announcement', copy: 'New lab tier: challenge-level scenarios for every track.', imageAltText: '' },
    { id: 'p6', day: 'Thu', pillar: 'career_advice', copy: 'How to talk about lab projects in a technical interview.', imageAltText: 'Checklist graphic for interview prep' },
    { id: 'p7', day: 'Fri', pillar: 'educational', copy: 'Debugging slow ETL jobs: a five-step framework.', imageAltText: 'Flowchart of the five-step debugging framework' },
    { id: 'p8', day: 'Sat', pillar: 'educational', copy: 'Weekend deep-dive: window frame clauses explained.', imageAltText: '' },
    { id: 'p9', day: 'Sun', pillar: 'educational', copy: 'Sunday recap: this week\'s top three lessons.', imageAltText: 'Recap graphic listing three lessons' },
  ],
};

interface ResponseOption {
  id: string;
  label: string;
  tone: 'defensive' | 'empathetic' | 'ignore';
}

interface EngagementCase {
  id: string;
  week: number;
  engagementByPillar: Record<Pillar, number>; // fixed, authored — never derived from post copy
  comment?: {
    author: string;
    text: string;
    options: ResponseOption[];
    requiresRespectfulChoice: boolean;
  };
}

const CASE_POOLS: Record<LabDifficulty, EngagementCase[]> = {
  beginner: [
    {
      id: 'case-1', week: 1,
      engagementByPillar: { educational: 120, community: 90, product_announcement: 60, career_advice: 75 },
      comment: {
        author: 'Frustrated learner', text: 'My certificate download failed 3 times! Total scam!',
        options: [
          { id: 'defensive', label: '"Our servers have 99.9% uptime. Check your own internet."', tone: 'defensive' },
          { id: 'empathetic', label: '"So sorry for the frustration! We\'ve DM\'d a direct PDF copy and escalated to tech."', tone: 'empathetic' },
          { id: 'ignore', label: 'Ignore the comment and delete it from the post', tone: 'ignore' },
        ],
        requiresRespectfulChoice: true,
      },
    },
    { id: 'case-2', week: 2, engagementByPillar: { educational: 130, community: 100, product_announcement: 70, career_advice: 60 } },
    {
      id: 'case-3', week: 3,
      engagementByPillar: { educational: 110, community: 140, product_announcement: 55, career_advice: 95 },
      comment: {
        author: 'Curious prospect', text: 'Do you offer refunds if I don\'t finish the course?',
        options: [
          { id: 'vague', label: '"Refunds are handled case by case, just ask."', tone: 'defensive' },
          { id: 'clear', label: '"Yes — full refund within 14 days of purchase, no questions asked. Here\'s the link to request one."', tone: 'empathetic' },
          { id: 'ignore', label: 'Don\'t respond', tone: 'ignore' },
        ],
        requiresRespectfulChoice: true,
      },
    },
  ],
  intermediate: [
    {
      id: 'case-1', week: 1,
      engagementByPillar: { educational: 120, community: 90, product_announcement: 60, career_advice: 75 },
      comment: {
        author: 'Frustrated learner', text: 'My certificate download failed 3 times! Total scam!',
        options: [
          { id: 'defensive', label: '"Our servers have 99.9% uptime. Check your own internet."', tone: 'defensive' },
          { id: 'empathetic', label: '"So sorry for the frustration! We\'ve DM\'d a direct PDF copy and escalated to tech."', tone: 'empathetic' },
          { id: 'ignore', label: 'Ignore the comment and delete it from the post', tone: 'ignore' },
        ],
        requiresRespectfulChoice: true,
      },
    },
    { id: 'case-2', week: 2, engagementByPillar: { educational: 130, community: 100, product_announcement: 70, career_advice: 60 } },
    {
      id: 'case-3', week: 3,
      engagementByPillar: { educational: 110, community: 140, product_announcement: 55, career_advice: 95 },
      comment: {
        author: 'Curious prospect', text: 'Do you offer refunds if I don\'t finish the course?',
        options: [
          { id: 'vague', label: '"Refunds are handled case by case, just ask."', tone: 'defensive' },
          { id: 'clear', label: '"Yes — full refund within 14 days of purchase, no questions asked. Here\'s the link to request one."', tone: 'empathetic' },
          { id: 'ignore', label: 'Don\'t respond', tone: 'ignore' },
        ],
        requiresRespectfulChoice: true,
      },
    },
    {
      id: 'case-4', week: 4,
      engagementByPillar: { educational: 100, community: 120, product_announcement: 90, career_advice: 110 },
      comment: {
        author: 'Skeptical commenter', text: 'Another "AI-powered" course platform... does this even work?',
        options: [
          { id: 'sarcastic', label: '"lol sure, keep scrolling if you don\'t believe us."', tone: 'defensive' },
          { id: 'measured', label: '"Fair question — here\'s a link to real learner outcomes so you can judge for yourself."', tone: 'empathetic' },
          { id: 'ignore', label: 'Delete the comment', tone: 'ignore' },
        ],
        requiresRespectfulChoice: true,
      },
    },
  ],
  challenge: [
    {
      id: 'case-1', week: 1,
      engagementByPillar: { educational: 120, community: 90, product_announcement: 60, career_advice: 75 },
      comment: {
        author: 'Frustrated learner', text: 'My certificate download failed 3 times! Total scam!',
        options: [
          { id: 'defensive', label: '"Our servers have 99.9% uptime. Check your own internet."', tone: 'defensive' },
          { id: 'empathetic', label: '"So sorry for the frustration! We\'ve DM\'d a direct PDF copy and escalated to tech."', tone: 'empathetic' },
          { id: 'ignore', label: 'Ignore the comment and delete it from the post', tone: 'ignore' },
        ],
        requiresRespectfulChoice: true,
      },
    },
    { id: 'case-2', week: 2, engagementByPillar: { educational: 130, community: 100, product_announcement: 70, career_advice: 60 } },
    {
      id: 'case-3', week: 3,
      engagementByPillar: { educational: 110, community: 140, product_announcement: 55, career_advice: 95 },
      comment: {
        author: 'Curious prospect', text: 'Do you offer refunds if I don\'t finish the course?',
        options: [
          { id: 'vague', label: '"Refunds are handled case by case, just ask."', tone: 'defensive' },
          { id: 'clear', label: '"Yes — full refund within 14 days of purchase, no questions asked. Here\'s the link to request one."', tone: 'empathetic' },
          { id: 'ignore', label: 'Don\'t respond', tone: 'ignore' },
        ],
        requiresRespectfulChoice: true,
      },
    },
    {
      id: 'case-4', week: 4,
      engagementByPillar: { educational: 100, community: 120, product_announcement: 90, career_advice: 110 },
      comment: {
        author: 'Skeptical commenter', text: 'Another "AI-powered" course platform... does this even work?',
        options: [
          { id: 'sarcastic', label: '"lol sure, keep scrolling if you don\'t believe us."', tone: 'defensive' },
          { id: 'measured', label: '"Fair question — here\'s a link to real learner outcomes so you can judge for yourself."', tone: 'empathetic' },
          { id: 'ignore', label: 'Delete the comment', tone: 'ignore' },
        ],
        requiresRespectfulChoice: true,
      },
    },
    {
      id: 'case-5', week: 5,
      engagementByPillar: { educational: 140, community: 100, product_announcement: 80, career_advice: 120 },
      comment: {
        author: 'Upset parent', text: 'My child was charged twice for the same course!',
        options: [
          { id: 'dismissive_polite', label: '"That\'s odd, please contact billing."', tone: 'defensive' },
          { id: 'trap_empathetic_sounding', label: '"So sorry to hear that — unfortunately we can\'t do anything about billing issues here."', tone: 'defensive' },
          { id: 'true_empathetic', label: '"So sorry — I\'ve confirmed the duplicate charge and refunded it in full; you\'ll see it in 3-5 days."', tone: 'empathetic' },
          { id: 'ignore', label: 'Do not respond', tone: 'ignore' },
        ],
        requiresRespectfulChoice: true,
      },
    },
  ],
};

function conflictDays(posts: SocialPost[]): Set<Day> {
  const counts = new Map<Day, number>();
  posts.forEach((p) => counts.set(p.day, (counts.get(p.day) || 0) + 1));
  return new Set([...counts.entries()].filter(([, n]) => n > 1).map(([d]) => d));
}

interface WorkspaceState {
  posts: SocialPost[];
  caseResponses: Record<string, string>;
  currentCaseStep: number;
}

export default function SocialContentCalendarLab({ variant, onDirty, onSubmit }: SimulatorProps) {
  const rawPosts = POST_POOLS[variant];
  const cases = CASE_POOLS[variant];

  const initialState: WorkspaceState = useMemo(() => ({ posts: rawPosts, caseResponses: {}, currentCaseStep: 0 }), [rawPosts]);
  const { state, set, undo, redo, reset, canUndo, canRedo, stepIndex } = useUndoableState<WorkspaceState>(initialState);

  const updatePost = (id: string, patch: Partial<SocialPost>) => {
    set((prev) => ({ ...prev, posts: prev.posts.map((p) => (p.id === id ? { ...p, ...patch } : p)) }));
    onDirty();
  };

  const chooseResponse = (caseId: string, optionId: string) => {
    set((prev) => ({ ...prev, caseResponses: { ...prev.caseResponses, [caseId]: optionId } }));
    onDirty();
  };

  const handleAdvance = () => {
    if (state.currentCaseStep >= cases.length) return;
    set((prev) => ({ ...prev, currentCaseStep: prev.currentCaseStep + 1 }));
    onDirty();
  };

  const handleClockReset = () => {
    set((prev) => ({ ...prev, currentCaseStep: 0 }));
    onDirty();
  };

  const conflicts = useMemo(() => conflictDays(state.posts), [state.posts]);
  const hasSlotConflicts = conflicts.size > 0;
  const missingAltPosts = state.posts.filter((p) => !p.imageAltText.trim());
  const hasMissingAlt = missingAltPosts.length > 0;

  const pillarCounts = useMemo(() => {
    const counts: Record<Pillar, number> = { educational: 0, community: 0, product_announcement: 0, career_advice: 0 };
    state.posts.forEach((p) => { counts[p.pillar] += 1; });
    return counts;
  }, [state.posts]);
  const pillarsCovered = PILLARS.filter((p) => pillarCounts[p] > 0).length;

  const revealedCases = cases.slice(0, state.currentCaseStep);
  const casesRequiringResponse = cases.filter((c) => c.comment?.requiresRespectfulChoice);
  const respectfullyResolvedCount = casesRequiringResponse.filter((c) => {
    const chosen = state.caseResponses[c.id];
    return c.comment?.options.find((o) => o.id === chosen)?.tone === 'empathetic';
  }).length;
  const unresolvedRevealedComments = revealedCases.filter((c) => c.comment && !state.caseResponses[c.id]);

  const handleExportCsv = () => {
    downloadCsv('social_content_calendar.csv', state.posts.map((p) => ({
      post_id: p.id, day: p.day, pillar: p.pillar, copy: p.copy,
      alt_text: p.imageAltText || 'MISSING', conflict: conflicts.has(p.day) ? 'YES' : 'NO',
    })));
  };

  const handleExportJson = () => {
    downloadJson('social_content_plan.json', {
      variant, posts: state.posts, pillarCounts,
      responseChecklist: cases.map((c) => ({ caseId: c.id, hasComment: Boolean(c.comment), chosenOptionId: state.caseResponses[c.id] ?? null })),
    });
  };

  const handleSubmit = () => {
    onSubmit({
      posts: state.posts,
      pillarCounts,
      hasSlotConflicts,
      hasMissingAlt,
      currentCaseStep: state.currentCaseStep,
      totalCases: cases.length,
      caseResponses: state.caseResponses,
      caseMeta: cases.map((c) => ({
        id: c.id,
        requiresRespectfulChoice: Boolean(c.comment?.requiresRespectfulChoice),
        options: c.comment?.options.map((o) => ({ id: o.id, tone: o.tone })) ?? null,
      })),
      engagementByWeek: revealedCases.map((c) => ({ week: c.week, engagement: c.engagementByPillar })),
      stepIndex,
    });
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className={`p-4 rounded-2xl border ${hasSlotConflicts ? 'bg-red-950/20 border-red-500/30' : 'bg-[#131728] border-white/10'}`}>
          <span className="text-xs text-slate-400 font-semibold block mb-1">Slot Scheduling</span>
          <span className={`text-xl font-black flex items-center gap-1 ${hasSlotConflicts ? 'text-red-300' : 'text-emerald-400'}`}>
            {hasSlotConflicts ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            {hasSlotConflicts ? `${conflicts.size} Day Collision(s)` : 'Clean Schedule'}
          </span>
        </div>
        <div className={`p-4 rounded-2xl border ${hasMissingAlt ? 'bg-amber-950/20 border-amber-500/30' : 'bg-[#131728] border-white/10'}`}>
          <span className="text-xs text-slate-400 font-semibold block mb-1">Accessibility Alt-Text</span>
          <span className={`text-xl font-black ${hasMissingAlt ? 'text-amber-300' : 'text-emerald-400'}`}>
            {hasMissingAlt ? `${missingAltPosts.length} Missing` : '100% Ready'}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Content Pillar Coverage</span>
          <span className={`text-xl font-black ${pillarsCovered === 4 ? 'text-emerald-400' : 'text-amber-300'}`}>{pillarsCovered}/4 Pillars</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Cases Reviewed</span>
          <span className="text-xl font-black text-fuchsia-300">{state.currentCaseStep}/{cases.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-fuchsia-400" />
                <span>1. Weekly Content Calendar</span>
              </h2>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={undo} disabled={!canUndo} title="Undo"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30 transition-colors"><Undo2 className="w-3.5 h-3.5" /></button>
                <button type="button" onClick={redo} disabled={!canRedo} title="Redo"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30 transition-colors"><Redo2 className="w-3.5 h-3.5" /></button>
                <button type="button" onClick={() => { reset(); onDirty(); }} title="Reset calendar"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors"><RotateCcw className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <div className="space-y-2">
              {state.posts.map((p) => (
                <div key={p.id} className={`p-3 rounded-xl border space-y-2 ${conflicts.has(p.day) ? 'bg-red-950/10 border-red-500/30' : 'bg-white/5 border-white/10'}`}>
                  <div className="flex flex-wrap items-center gap-2">
                    <select aria-label={`Day for ${p.id}`} value={p.day} onChange={(e) => updatePost(p.id, { day: e.target.value as Day })}
                      className="text-[11px] font-bold px-2 py-1 rounded-lg bg-black/40 border border-white/15 text-fuchsia-300">
                      {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <select aria-label={`Pillar for ${p.id}`} value={p.pillar} onChange={(e) => updatePost(p.id, { pillar: e.target.value as Pillar })}
                      className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-black/40 border border-white/15 text-slate-300 uppercase">
                      {PILLARS.map((pl) => <option key={pl} value={pl}>{PILLAR_LABEL[pl]}</option>)}
                    </select>
                    {conflicts.has(p.day) && <span className="text-[10px] font-bold text-red-300 bg-red-500/20 px-1.5 py-0.5 rounded border border-red-500/30">Collision</span>}
                    {!p.imageAltText.trim() && <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/30">No Alt</span>}
                  </div>
                  <p className="text-xs text-slate-200">{p.copy}</p>
                  <input type="text" value={p.imageAltText} onChange={(e) => updatePost(p.id, { imageAltText: e.target.value })}
                    placeholder="Describe the image for screen readers…" aria-label={`Alt text for ${p.id}`}
                    className="w-full text-[11px] px-2 py-1.5 rounded-lg bg-black/30 border border-white/15 text-slate-300 focus:outline-none focus:border-fuchsia-500/50" />
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-fuchsia-400" />
              <span>2. Prepared Engagement Case Review</span>
              <span className="ml-auto text-[10px] font-bold text-slate-400 normal-case tracking-normal">
                {respectfullyResolvedCount}/{casesRequiringResponse.length} resolved respectfully
              </span>
            </h3>
            <SimClock label="Case Review" step={state.currentCaseStep} maxStep={cases.length}
              stepLabel={(s) => (s === 0 ? 'Not started' : `Week ${s}/${cases.length}`)}
              onAdvance={handleAdvance} onReset={handleClockReset} />
            <div className="space-y-2">
              {revealedCases.filter((c) => c.comment).map((c) => (
                <div key={c.id} className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5 text-xs">
                  <p className="text-slate-400">Week {c.week} — <span className="font-semibold text-slate-300">{c.comment!.author}</span> commented: &ldquo;{c.comment!.text}&rdquo;</p>
                  <div className="space-y-1">
                    {c.comment!.options.map((opt) => (
                      <label key={opt.id} className={`flex items-start gap-2 p-2 rounded-lg cursor-pointer border ${state.caseResponses[c.id] === opt.id ? 'bg-fuchsia-500/20 border-fuchsia-500/40 text-fuchsia-200' : 'bg-black/20 border-white/10 text-slate-300'}`}>
                        <input type="radio" name={c.id} checked={state.caseResponses[c.id] === opt.id} onChange={() => chooseResponse(c.id, opt.id)} className="mt-0.5 accent-fuchsia-500" />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              {revealedCases.length === 0 && <p className="text-[11px] text-slate-500 italic">Advance the case review clock to reveal this week&apos;s engagement data and any comment to handle.</p>}
              {unresolvedRevealedComments.length > 0 && (
                <p className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> {unresolvedRevealedComments.length} revealed case(s) still need a response choice.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="lg:col-span-5 space-y-4">
          <ChartFrame
            title="Weekly Engagement Metric Trend (Authored, Fixed)"
            icon={<LineChartIcon className="w-4 h-4 text-fuchsia-400" />}
            tableHeaders={['Week', ...PILLARS.map((p) => PILLAR_LABEL[p])]}
            tableRows={revealedCases.map((c) => [`Wk${c.week}`, ...PILLARS.map((p) => c.engagementByPillar[p])])}
          >
            <TrendLineChart
              labels={revealedCases.map((c) => `Wk${c.week}`)}
              series={PILLARS.map((p) => ({ label: PILLAR_LABEL[p], data: revealedCases.map((c) => c.engagementByPillar[p]) }))}
              yLabel="Engagement Score"
            />
          </ChartFrame>

          <ChartFrame
            title="Content Pillar Mix (Planned Posts)"
            icon={<BarChart3 className="w-4 h-4 text-fuchsia-400" />}
            tableHeaders={['Pillar', 'Posts']}
            tableRows={PILLARS.map((p) => [PILLAR_LABEL[p], pillarCounts[p]])}
          >
            <CompareBarChart
              labels={PILLARS.map((p) => PILLAR_LABEL[p])}
              series={[{ label: 'Planned Posts', data: PILLARS.map((p) => pillarCounts[p]), statusOverride: PILLARS.map((p) => (pillarCounts[p] === 0 ? 'critical' : null)) }]}
              yLabel="Post Count"
            />
          </ChartFrame>

          <ChartFrame
            title="Content Pillar Distribution"
            icon={<PieChart className="w-4 h-4 text-fuchsia-400" />}
            tableHeaders={['Pillar', 'Share']}
            tableRows={PILLARS.map((p) => [PILLAR_LABEL[p], pillarCounts[p]])}
          >
            <BreakdownDoughnutChart
              labels={PILLARS.map((p) => PILLAR_LABEL[p])}
              values={PILLARS.map((p) => pillarCounts[p])}
              centerLabel="Total Posts"
              centerValue={String(state.posts.length)}
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
            <span>Submit Calendar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
