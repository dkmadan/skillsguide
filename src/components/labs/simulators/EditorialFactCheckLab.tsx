'use client';

import { useMemo, useState } from 'react';
import { LabScenarioVariant, LabDifficulty } from '@/lib/labs/types';
import { useUndoableState } from '@/lib/labs/useUndoableState';
import { downloadCsv, downloadJson } from '@/lib/labs/exportHelper';
import ChartFrame from '@/components/labs/charts/ChartFrame';
import CompareRadarChart from '@/components/labs/charts/CompareRadarChart';
import {
  Undo2,
  Redo2,
  RotateCcw,
  Send,
  Download,
  FileJson,
  AlertTriangle,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  Link2,
  Camera,
  ListTree,
} from 'lucide-react';

interface SimulatorProps {
  scenario?: LabScenarioVariant;
  variant: LabDifficulty;
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

interface OutlineSection {
  id: string;
  title: string;
  required: boolean;
  included: boolean;
  order: number;
}

interface SourceCard {
  id: string;
  sourceName: string;
  claimText: string;
  supported: boolean;
}

interface Claim {
  id: string;
  text: string;
  correctSourceId: string | null; // null = no source in the repository actually supports this claim
  linkedSourceId: string | null;
}

interface SentenceRevision {
  id: string;
  original: string;
  options: string[]; // index 0 is always the original wording
  preferredIndex: number; // the clearer, authored revision
}

interface WordTarget {
  min: number;
  max: number;
}

// Three genuinely different fact-check exercises — increasing ambiguity via
// more sources (including additional "plausible but unsupported" traps),
// more claims to resolve, and more sample sentences to revise.
const OUTLINE_POOLS: Record<LabDifficulty, OutlineSection[]> = {
  beginner: [
    { id: 'intro', title: 'Introduction', required: true, included: true, order: 0 },
    { id: 'concept', title: 'Core Concept', required: true, included: true, order: 1 },
    { id: 'example', title: 'Practical Example', required: true, included: true, order: 2 },
    { id: 'conclusion', title: 'Conclusion', required: true, included: false, order: 3 }, // forgotten — must be re-included
    { id: 'further', title: 'Further Reading', required: false, included: false, order: 4 },
  ],
  intermediate: [
    { id: 'intro', title: 'Introduction', required: true, included: true, order: 0 },
    { id: 'concept', title: 'Core Concept', required: true, included: true, order: 1 },
    { id: 'evidence', title: 'Supporting Evidence', required: true, included: false, order: 2 }, // forgotten
    { id: 'example', title: 'Practical Example', required: true, included: true, order: 3 },
    { id: 'conclusion', title: 'Conclusion', required: true, included: false, order: 4 }, // forgotten
    { id: 'further', title: 'Further Reading', required: false, included: false, order: 5 },
  ],
  challenge: [
    { id: 'intro', title: 'Introduction', required: true, included: true, order: 0 },
    { id: 'context', title: 'Background Context', required: true, included: false, order: 1 }, // forgotten
    { id: 'concept', title: 'Core Concept', required: true, included: true, order: 2 },
    { id: 'evidence', title: 'Supporting Evidence', required: true, included: false, order: 3 }, // forgotten
    { id: 'example', title: 'Practical Example', required: true, included: true, order: 4 },
    { id: 'conclusion', title: 'Conclusion', required: true, included: false, order: 5 }, // forgotten
    { id: 'further', title: 'Further Reading', required: false, included: false, order: 6 },
  ],
};

const SOURCE_POOLS: Record<LabDifficulty, SourceCard[]> = {
  beginner: [
    { id: 's1', sourceName: 'IEEE Software Engineering Index 2025', claimText: 'Automated test suites reduce production defect escape rates by 48%.', supported: true },
    { id: 's2', sourceName: 'Random Anonymous Forum Post', claimText: 'Using tabs instead of spaces makes Python scripts run 3x faster.', supported: false },
    { id: 's3', sourceName: 'ACM Digital Library', claimText: 'Cognitive load decreases by 35% when API response times drop below 200ms.', supported: true },
  ],
  intermediate: [
    { id: 's1', sourceName: 'IEEE Software Engineering Index 2025', claimText: 'Automated test suites reduce production defect escape rates by 48%.', supported: true },
    { id: 's2', sourceName: 'Random Anonymous Forum Post', claimText: 'Using tabs instead of spaces makes Python scripts run 3x faster.', supported: false },
    { id: 's3', sourceName: 'ACM Digital Library', claimText: 'Cognitive load decreases by 35% when API response times drop below 200ms.', supported: true },
    { id: 's4', sourceName: 'Unreviewed Tech Blog Post', claimText: 'Rewriting any codebase in a trendy new framework always improves performance.', supported: false },
  ],
  challenge: [
    { id: 's1', sourceName: 'IEEE Software Engineering Index 2025', claimText: 'Automated test suites reduce production defect escape rates by 48%.', supported: true },
    { id: 's2', sourceName: 'Random Anonymous Forum Post', claimText: 'Using tabs instead of spaces makes Python scripts run 3x faster.', supported: false },
    { id: 's3', sourceName: 'ACM Digital Library', claimText: 'Cognitive load decreases by 35% when API response times drop below 200ms.', supported: true },
    { id: 's4', sourceName: 'Unreviewed Tech Blog Post', claimText: 'Rewriting any codebase in a trendy new framework always improves performance.', supported: false },
    { id: 's5', sourceName: 'Self-Published Vendor Whitepaper', claimText: 'Our proprietary tool eliminates 100% of production incidents.', supported: false },
  ],
};

const CLAIM_POOLS: Record<LabDifficulty, Omit<Claim, 'linkedSourceId'>[]> = {
  beginner: [
    { id: 'c1', text: 'Automated, verifiable test practice meaningfully reduces defect escapes.', correctSourceId: 's1' },
    { id: 'c2', text: 'Sub-200ms API responsiveness measurably reduces user cognitive load.', correctSourceId: 's3' },
    { id: 'c3', text: 'Code formatting style (tabs vs. spaces) directly changes program execution speed.', correctSourceId: null },
  ],
  intermediate: [
    { id: 'c1', text: 'Automated, verifiable test practice meaningfully reduces defect escapes.', correctSourceId: 's1' },
    { id: 'c2', text: 'Sub-200ms API responsiveness measurably reduces user cognitive load.', correctSourceId: 's3' },
    { id: 'c3', text: 'Code formatting style (tabs vs. spaces) directly changes program execution speed.', correctSourceId: null },
    { id: 'c4', text: 'Adopting a new framework always makes an existing system faster.', correctSourceId: null },
  ],
  challenge: [
    { id: 'c1', text: 'Automated, verifiable test practice meaningfully reduces defect escapes.', correctSourceId: 's1' },
    { id: 'c2', text: 'Sub-200ms API responsiveness measurably reduces user cognitive load.', correctSourceId: 's3' },
    { id: 'c3', text: 'Code formatting style (tabs vs. spaces) directly changes program execution speed.', correctSourceId: null },
    { id: 'c4', text: 'Adopting a new framework always makes an existing system faster.', correctSourceId: null },
    { id: 'c5', text: 'A single proprietary tool can guarantee zero production incidents.', correctSourceId: null },
  ],
};

const SENTENCE_POOLS: Record<LabDifficulty, SentenceRevision[]> = {
  beginner: [
    {
      id: 'sent1',
      original: 'The system, in a manner that is not immediately obvious to most readers, tends to occasionally experience what could be described as a slowdown under certain conditions that are difficult to predict in advance.',
      options: [
        'The system, in a manner that is not immediately obvious to most readers, tends to occasionally experience what could be described as a slowdown under certain conditions that are difficult to predict in advance.',
        'The system slows down unpredictably under certain load conditions.',
        'The system experiences things that are hard to predict sometimes because of conditions.',
      ],
      preferredIndex: 1,
    },
    {
      id: 'sent2',
      original: 'It should be noted that, generally speaking, the utilization of automated testing frameworks can, in most cases, lead to a reduction in the incidence of defects that escape into production environments.',
      options: [
        'It should be noted that, generally speaking, the utilization of automated testing frameworks can, in most cases, lead to a reduction in the incidence of defects that escape into production environments.',
        'Automated testing frameworks generally reduce production defect rates.',
        'Automated testing, generally, in most cases, likely helps reduce some defects sometimes.',
      ],
      preferredIndex: 1,
    },
  ],
  intermediate: [
    {
      id: 'sent3',
      original: 'Due to the fact that response latency is, in a great many instances, a variable which correlates in a nontrivial fashion with perceived user satisfaction, it is advisable to prioritize its reduction.',
      options: [
        'Due to the fact that response latency is, in a great many instances, a variable which correlates in a nontrivial fashion with perceived user satisfaction, it is advisable to prioritize its reduction.',
        'Because latency strongly affects user satisfaction, teams should prioritize reducing it.',
        'Latency is a thing that, due to correlating, should probably be looked at sometimes.',
      ],
      preferredIndex: 1,
    },
    {
      id: 'sent4',
      original: 'It is not uncommon for the sort of defect that tends to escape detection to be, in point of fact, attributable to an absence of sufficiently comprehensive automated coverage.',
      options: [
        'It is not uncommon for the sort of defect that tends to escape detection to be, in point of fact, attributable to an absence of sufficiently comprehensive automated coverage.',
        'Defects usually escape detection because automated test coverage is incomplete.',
        'Defects that escape are, in point of fact, sometimes due to a lack of coverage things.',
      ],
      preferredIndex: 1,
    },
  ],
  challenge: [
    {
      id: 'sent5',
      original: 'Insofar as it can be said that developer productivity is impacted by tooling, it would not be inaccurate to suggest that friction in the toolchain is a contributing factor of some non-negligible significance.',
      options: [
        'Insofar as it can be said that developer productivity is impacted by tooling, it would not be inaccurate to suggest that friction in the toolchain is a contributing factor of some non-negligible significance.',
        'Toolchain friction is a significant contributor to lost developer productivity.',
        'Tooling impacts productivity in ways that are, in a sense, somewhat significant sometimes.',
      ],
      preferredIndex: 1,
    },
    {
      id: 'sent6',
      original: 'The aforementioned metric, while not without its limitations in terms of universal applicability, nonetheless remains, in the view of many practitioners, a reasonably useful proxy for the underlying quality signal.',
      options: [
        'The aforementioned metric, while not without its limitations in terms of universal applicability, nonetheless remains, in the view of many practitioners, a reasonably useful proxy for the underlying quality signal.',
        'Despite its limits, most practitioners find this metric a useful quality proxy.',
        'The metric has limitations but is, in a sense, viewed as useful by some in a general way.',
      ],
      preferredIndex: 1,
    },
    {
      id: 'sent7',
      original: 'There exists a nontrivial possibility that the observed correlation, rather than indicating causation in the strict sense, may instead be reflective of a confounding variable not accounted for herein.',
      options: [
        'There exists a nontrivial possibility that the observed correlation, rather than indicating causation in the strict sense, may instead be reflective of a confounding variable not accounted for herein.',
        'This correlation may reflect an unaccounted confounding variable rather than true causation.',
        'The correlation could be a possibility of something not causation in a strict nontrivial sense maybe.',
      ],
      preferredIndex: 1,
    },
  ],
};

const WORD_TARGETS: Record<LabDifficulty, WordTarget> = {
  beginner: { min: 60, max: 160 },
  intermediate: { min: 80, max: 200 },
  challenge: { min: 100, max: 240 },
};

const ARTICLE_SEED: Record<LabDifficulty, string> = {
  beginner: 'Modern engineering education demands verifiable feedback loops rather than passive multiple choice exams.\n\nAccording to the IEEE Software Engineering Index, verified test-driven practice reduces defect escapes by nearly half. Furthermore, maintaining responsive interface feedback mitigates cognitive load for learners, allowing deeper mental engagement with core system architecture.',
  intermediate: 'Modern engineering education demands verifiable feedback loops rather than passive multiple choice exams, especially as systems grow in complexity.\n\nAccording to the IEEE Software Engineering Index, verified test-driven practice reduces defect escapes by nearly half. Furthermore, maintaining responsive interface feedback mitigates cognitive load for learners, allowing deeper mental engagement with core system architecture. Evidence-backed claims, rather than folklore, should guide how teams prioritize tooling investments.',
  challenge: 'Modern engineering education demands verifiable feedback loops rather than passive multiple choice exams, especially as systems grow in complexity and teams scale.\n\nAccording to the IEEE Software Engineering Index, verified test-driven practice reduces defect escapes by nearly half. Furthermore, maintaining responsive interface feedback mitigates cognitive load for learners, allowing deeper mental engagement with core system architecture. Evidence-backed claims, rather than folklore, should guide how teams prioritize tooling investments. Unsubstantiated claims about frameworks or proprietary tools should be treated with the same scrutiny as any other unverified statement.',
};

const SUMMARY_SEED = 'A short, evidence-backed explainer for new learners.';

const RUBRIC_AXES = ['Outline Complete', 'Claims Resolved', 'Sentences Revised', 'Article Length OK', 'Summary Adapted', 'Self-Review Done'];

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

interface WorkspaceState {
  outline: OutlineSection[];
  claims: Claim[];
  sentenceChoices: Record<string, number>;
}

interface Snapshot {
  label: string;
  scores: number[];
}

export default function EditorialFactCheckLab({ variant, onDirty, onSubmit }: SimulatorProps) {
  const sources = SOURCE_POOLS[variant];
  const sentences = SENTENCE_POOLS[variant];
  const wordTarget = WORD_TARGETS[variant];
  const sourceMap = useMemo(() => new Map(sources.map((s) => [s.id, s])), [sources]);

  const initialState: WorkspaceState = useMemo(() => ({
    outline: OUTLINE_POOLS[variant],
    claims: CLAIM_POOLS[variant].map((c) => ({ ...c, linkedSourceId: null })),
    sentenceChoices: {},
  }), [variant]);

  const { state, set, undo, redo, reset, canUndo, canRedo, stepIndex } = useUndoableState<WorkspaceState>(initialState);
  const [articleBody, setArticleBody] = useState(ARTICLE_SEED[variant]);
  const [summaryText, setSummaryText] = useState(SUMMARY_SEED);
  const [selfReview, setSelfReview] = useState('');
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);

  const moveSection = (id: string, direction: -1 | 1) => {
    set((prev) => {
      const sorted = [...prev.outline].sort((a, b) => a.order - b.order);
      const idx = sorted.findIndex((s) => s.id === id);
      const swapWith = idx + direction;
      if (swapWith < 0 || swapWith >= sorted.length) return prev;
      const a = sorted[idx];
      const b = sorted[swapWith];
      return { ...prev, outline: prev.outline.map((s) => (s.id === a.id ? { ...s, order: b.order } : s.id === b.id ? { ...s, order: a.order } : s)) };
    });
    onDirty();
  };

  const toggleSection = (id: string) => {
    set((prev) => ({ ...prev, outline: prev.outline.map((s) => (s.id === id ? { ...s, included: !s.included } : s)) }));
    onDirty();
  };

  const linkClaim = (claimId: string, sourceId: string | null) => {
    set((prev) => ({ ...prev, claims: prev.claims.map((c) => (c.id === claimId ? { ...c, linkedSourceId: sourceId } : c)) }));
    onDirty();
  };

  const chooseSentence = (sentenceId: string, idx: number) => {
    set((prev) => ({ ...prev, sentenceChoices: { ...prev.sentenceChoices, [sentenceId]: idx } }));
    onDirty();
  };

  const orderedOutline = useMemo(() => [...state.outline].sort((a, b) => a.order - b.order), [state.outline]);
  const outlineComplete = state.outline.filter((s) => s.required).every((s) => s.included);

  const claimStatus = useMemo(() => state.claims.map((c) => {
    const linkedSource = c.linkedSourceId ? sourceMap.get(c.linkedSourceId) : null;
    const isUnsupportedLink = Boolean(linkedSource && !linkedSource.supported);
    const isCorrect = c.correctSourceId === null ? c.linkedSourceId === null : c.linkedSourceId === c.correctSourceId;
    return { ...c, isUnsupportedLink, isCorrect };
  }), [state.claims, sourceMap]);
  const claimsResolved = claimStatus.every((c) => c.isCorrect);
  const pendingUnsupportedLink = claimStatus.some((c) => c.isUnsupportedLink);

  const sentencesRevised = sentences.every((s) => state.sentenceChoices[s.id] === s.preferredIndex);

  const bodyWordCount = wordCount(articleBody);
  const articleLengthOk = bodyWordCount >= wordTarget.min && bodyWordCount <= wordTarget.max;
  const summaryWordCount = wordCount(summaryText);
  const summaryAdapted = summaryWordCount >= 8 && summaryWordCount <= 45;
  const selfReviewDone = selfReview.trim().length >= 20;

  const rubricScores = useMemo(() => [
    outlineComplete ? 100 : 0,
    claimsResolved ? 100 : 0,
    sentencesRevised ? 100 : 0,
    articleLengthOk ? 100 : 0,
    summaryAdapted ? 100 : 0,
    selfReviewDone ? 100 : 0,
  ], [outlineComplete, claimsResolved, sentencesRevised, articleLengthOk, summaryAdapted, selfReviewDone]);

  const saveSnapshot = () => {
    setSnapshots((prev) => [...prev, { label: `Snapshot ${prev.length + 1}`, scores: rubricScores }].slice(-2));
    onDirty();
  };

  const handleExportCsv = () => {
    downloadCsv('editorial_source_mapping.csv', state.claims.map((c) => ({
      claim: c.text,
      linked_source: c.linkedSourceId ? sourceMap.get(c.linkedSourceId)?.sourceName ?? c.linkedSourceId : 'unlinked',
      supported: c.linkedSourceId ? String(Boolean(sourceMap.get(c.linkedSourceId)?.supported)) : 'n/a',
    })));
  };

  const handleExportJson = () => {
    downloadJson('editorial_article_package.json', {
      variant, outline: orderedOutline, claims: claimStatus, articleBody, summaryText, selfReview, rubricScores, snapshots,
    });
  };

  const handleSubmit = () => {
    onSubmit({
      outline: state.outline,
      sources,
      claims: state.claims,
      sentenceChoices: state.sentenceChoices,
      sentenceMeta: sentences.map((s) => ({ id: s.id, preferredIndex: s.preferredIndex })),
      articleBody,
      articleWordCount: bodyWordCount,
      wordTarget,
      summaryText,
      summaryWordCount,
      selfReview,
      rubricScores,
      rubricAxes: RUBRIC_AXES,
      snapshots,
      pendingUnsupportedLink,
      stepIndex,
    });
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Article Length</span>
          <span className={`text-xl font-black ${articleLengthOk ? 'text-white' : 'text-amber-400'}`}>{bodyWordCount} words</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Target {wordTarget.min}–{wordTarget.max}</span>
        </div>
        <div className={`p-4 rounded-2xl border ${pendingUnsupportedLink ? 'bg-red-950/20 border-red-500/30' : 'bg-[#131728] border-white/10'}`}>
          <span className="text-xs text-slate-400 font-semibold block mb-1">Fact-Check Status</span>
          <span className={`text-xl font-black flex items-center gap-1 ${pendingUnsupportedLink ? 'text-red-300' : claimsResolved ? 'text-emerald-400' : 'text-amber-300'}`}>
            {pendingUnsupportedLink ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            {pendingUnsupportedLink ? 'Unsupported Link' : claimsResolved ? 'All Resolved' : 'In Progress'}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Outline</span>
          <span className={`text-xl font-black ${outlineComplete ? 'text-emerald-400' : 'text-amber-300'}`}>{outlineComplete ? 'Complete' : 'Missing Section'}</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Sentences Revised</span>
          <span className={`text-xl font-black ${sentencesRevised ? 'text-emerald-400' : 'text-amber-300'}`}>
            {sentences.filter((s) => state.sentenceChoices[s.id] === s.preferredIndex).length}/{sentences.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
                <ListTree className="w-4 h-4 text-violet-400" />
                <span>1. Outline Tree</span>
              </h2>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={undo} disabled={!canUndo} title="Undo"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30 transition-colors"><Undo2 className="w-3.5 h-3.5" /></button>
                <button type="button" onClick={redo} disabled={!canRedo} title="Redo"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30 transition-colors"><Redo2 className="w-3.5 h-3.5" /></button>
                <button type="button" onClick={() => { reset(); onDirty(); }} title="Reset draft structure"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors"><RotateCcw className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <div className="space-y-1.5">
              {orderedOutline.map((s, i) => (
                <div key={s.id} className={`flex items-center justify-between gap-2 p-2.5 rounded-xl border text-xs ${s.included ? 'bg-white/5 border-white/10' : 'bg-red-950/10 border-red-500/20'}`}>
                  <label className="flex items-center gap-2 flex-1 cursor-pointer">
                    <input type="checkbox" checked={s.included} onChange={() => toggleSection(s.id)} className="accent-violet-500" />
                    <span className={`font-semibold ${s.included ? 'text-white' : 'text-red-300'}`}>{s.title}</span>
                    {s.required && <span className="text-[9px] px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 font-bold uppercase">Required</span>}
                  </label>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => moveSection(s.id, -1)} disabled={i === 0} aria-label={`Move ${s.title} up`}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30"><ArrowUp className="w-3 h-3" /></button>
                    <button type="button" onClick={() => moveSection(s.id, 1)} disabled={i === orderedOutline.length - 1} aria-label={`Move ${s.title} down`}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30"><ArrowDown className="w-3 h-3" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Link2 className="w-4 h-4 text-violet-400" />
              <span>2. Link Claims to Evidence</span>
            </h3>
            <div className="space-y-2">
              {claimStatus.map((c) => (
                <div key={c.id} className={`p-3 rounded-xl border text-xs space-y-1.5 ${c.isUnsupportedLink ? 'bg-red-950/10 border-red-500/30' : 'bg-white/5 border-white/10'}`}>
                  <p className="text-slate-200">{c.text}</p>
                  <select value={c.linkedSourceId ?? ''} onChange={(e) => linkClaim(c.id, e.target.value || null)}
                    className="w-full text-[11px] px-2 py-1.5 rounded-lg bg-black/40 border border-white/15 text-slate-300">
                    <option value="">— No supporting evidence —</option>
                    {sources.map((s) => <option key={s.id} value={s.id}>{s.sourceName}</option>)}
                  </select>
                  {c.isUnsupportedLink && (
                    <p className="text-[10px] font-bold text-red-300 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Flagged: this source does not actually support this claim. Unlink it or choose another.</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">3. Revise Unclear Sample Sentences</h3>
            <div className="space-y-3">
              {sentences.map((s) => (
                <div key={s.id} className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5 text-xs">
                  <p className="text-slate-400 italic">&ldquo;{s.original}&rdquo;</p>
                  <div className="space-y-1">
                    {s.options.map((opt, idx) => (
                      <label key={idx} className={`flex items-start gap-2 p-2 rounded-lg cursor-pointer border ${state.sentenceChoices[s.id] === idx ? 'bg-violet-500/20 border-violet-500/40 text-violet-200' : 'bg-black/20 border-white/10 text-slate-300'}`}>
                        <input type="radio" name={s.id} checked={state.sentenceChoices[s.id] === idx} onChange={() => chooseSentence(s.id, idx)} className="mt-0.5 accent-violet-500" />
                        <span>{idx === 0 ? '(Original) ' : ''}{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-white">Drafting Canvas</h3>
              <span className="text-[10px] font-mono text-slate-400">{bodyWordCount} words</span>
            </div>
            <textarea rows={7} value={articleBody} onChange={(e) => { setArticleBody(e.target.value); onDirty(); }}
              className="w-full text-xs p-3 rounded-xl bg-black/30 border border-white/15 text-slate-200 leading-relaxed focus:outline-none focus:border-violet-500/50" />
            <label htmlFor="summary-text" className="text-[11px] font-bold text-slate-300 block pt-1">Adapted Summary (for a new audience)</label>
            <textarea id="summary-text" rows={2} value={summaryText} onChange={(e) => { setSummaryText(e.target.value); onDirty(); }}
              className="w-full text-xs p-2.5 rounded-xl bg-black/30 border border-white/15 text-slate-200 focus:outline-none focus:border-violet-500/50" />
            <span className="text-[10px] text-slate-500">{summaryWordCount} words</span>
            <label htmlFor="self-review" className="text-[11px] font-bold text-slate-300 block pt-1">Self-Review Notes</label>
            <textarea id="self-review" rows={2} value={selfReview} onChange={(e) => { setSelfReview(e.target.value); onDirty(); }}
              placeholder="Reflect on your outline, sourcing, and revision choices…"
              className="w-full text-xs p-2.5 rounded-xl bg-black/30 border border-white/15 text-slate-200 focus:outline-none focus:border-violet-500/50" />
          </div>

          <ChartFrame
            title="Rubric Checklist Across Draft Revisions"
            icon={<Camera className="w-4 h-4 text-violet-400" />}
            tableHeaders={['Criterion', ...snapshots.map((s) => s.label), 'Current']}
            tableRows={RUBRIC_AXES.map((axis, i) => [axis, ...snapshots.map((s) => s.scores[i]), rubricScores[i]])}
            controls={
              <button type="button" onClick={saveSnapshot}
                className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/40 text-violet-200 transition-colors">
                Save Revision Snapshot
              </button>
            }
          >
            <CompareRadarChart
              axes={RUBRIC_AXES}
              series={[...snapshots.map((s) => ({ label: s.label, data: s.scores })), { label: 'Current', data: rubricScores }]}
              max={100}
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
            <span>Submit Article</span>
          </button>
        </div>
      </div>
    </div>
  );
}
