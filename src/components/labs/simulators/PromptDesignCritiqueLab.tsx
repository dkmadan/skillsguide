'use client';

import React, { useMemo, useState } from 'react';
import { LabScenarioVariant, LabDifficulty } from '@/lib/labs/types';
import { useUndoableState } from '@/lib/labs/useUndoableState';
import { downloadCsv, downloadJson } from '@/lib/labs/exportHelper';
import ChartFrame from '@/components/labs/charts/ChartFrame';
import CompareRadarChart from '@/components/labs/charts/CompareRadarChart';
import {
  Sparkles, ShieldCheck, Layers, Send, Eye, Undo2, Redo2, RotateCcw,
  Download, FileJson, ListChecks, AlertTriangle, CheckCircle2, XCircle,
} from 'lucide-react';

interface SimulatorProps {
  scenario?: LabScenarioVariant;
  variant: LabDifficulty;
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

type BlockKey = 'task' | 'context' | 'examples' | 'schema' | 'privacy';
const BLOCK_ORDER: BlockKey[] = ['task', 'context', 'examples', 'schema', 'privacy'];
const BLOCK_LABEL: Record<BlockKey, string> = {
  task: 'TASK', context: 'CONTEXT', examples: 'FEW-SHOT EXAMPLES', schema: 'OUTPUT SCHEMA', privacy: 'SAFETY & PRIVACY CONSTRAINTS',
};

interface ResponseExample {
  id: string;
  modelLabel: string;
  text: string;
  hasUnsupportedClaim: boolean;
  defectNote: string;
  evidenceQuote: string;
  scores: { grounded: number; schema: number; privacy: number; confidence: number; actionable: number };
}

interface Outcome { id: string; summary: string; risk: 'low' | 'medium' | 'high'; }

interface Fixture {
  ticketText: string;
  blocksContent: Record<BlockKey, string>;
  examples: ResponseExample[];
  outcomeTable: Record<string, Outcome>;
}

const ALL_KEY = [...BLOCK_ORDER].sort().join(',');

function comboKey(blocks: Record<BlockKey, boolean>): string {
  return BLOCK_ORDER.filter((k) => blocks[k]).sort().join(',');
}
function keyWithout(omit: BlockKey): string {
  return BLOCK_ORDER.filter((k) => k !== omit).sort().join(',');
}

function buildFixture(variant: LabDifficulty): Fixture {
  if (variant === 'beginner') {
    const ticketText = 'Customer email: "I was charged twice for my Pro plan renewal on March 3rd. Please refund the duplicate charge."';
    const examples: ResponseExample[] = [
      {
        id: 'resp_a', modelLabel: 'Response A', hasUnsupportedClaim: false,
        text: '{"category":"Billing","priority":"High","evidence":"charged twice for Pro plan renewal on March 3rd","action":"Escalate duplicate charge to Finance"}',
        defectNote: 'Every field traces directly back to the ticket text — no invented facts.',
        evidenceQuote: 'charged twice for my Pro plan renewal on March 3rd',
        scores: { grounded: 4, schema: 4, privacy: 4, confidence: 3, actionable: 4 },
      },
      {
        id: 'resp_b', modelLabel: 'Response B', hasUnsupportedClaim: true,
        text: '{"category":"Account Security","priority":"Critical","rationale":"Customer also reported their account was hacked."}',
        defectNote: 'Hallucination — the ticket never mentions a hacked account. This claim has zero source evidence.',
        evidenceQuote: '(no matching text in the ticket)',
        scores: { grounded: 0, schema: 3, privacy: 4, confidence: 1, actionable: 1 },
      },
      {
        id: 'resp_c', modelLabel: 'Response C', hasUnsupportedClaim: true,
        text: '{"category":"Billing","notes":"Refunded card ending in full number 4111 1111 1111 1111."}',
        defectNote: 'Privacy violation — a full card number is fabricated and printed in plain text; the ticket never supplied one.',
        evidenceQuote: '(card number is not present in the ticket)',
        scores: { grounded: 1, schema: 2, privacy: 0, confidence: 2, actionable: 2 },
      },
    ];
    const outcomeTable: Record<string, Outcome> = {
      [ALL_KEY]: { id: 'clean_grounded_json', summary: 'Grounded JSON output, correctly scoped to the evidence in the ticket.', risk: 'low' },
      [keyWithout('task')]: { id: 'ambiguous_output', summary: 'Without an explicit task block, the desired output shape is unclear — free-form prose instead of JSON.', risk: 'medium' },
      [keyWithout('context')]: { id: 'misclassification_risk', summary: 'Without platform context, billing tickets can be miscategorized as generic inquiries.', risk: 'medium' },
      [keyWithout('examples')]: { id: 'schema_drift', summary: 'Without a worked example, field names drift between responses (category vs. type vs. issue).', risk: 'medium' },
      [keyWithout('schema')]: { id: 'unstructured_text', summary: 'Without a schema, the model returns a paragraph instead of parseable fields.', risk: 'medium' },
      [keyWithout('privacy')]: { id: 'pii_leak_risk', summary: 'Without a privacy constraint, payment details can be echoed back in full.', risk: 'high' },
      'context,task': { id: 'high_risk_unstructured', summary: 'Bare-minimum prompt: no schema, no examples, no privacy guardrail — highest overall risk.', risk: 'high' },
      '': { id: 'no_instructions', summary: 'No blocks enabled — there is nothing for the classifier to act on.', risk: 'high' },
    };
    return { ticketText, blocksContent: {
      task: 'Classify the incoming support ticket into billing, technical, or account category with an urgency level.',
      context: 'You are a triage assistant for an enterprise SaaS platform with 50,000 active users.',
      examples: 'Input: "Charged twice for annual renewal" -> Output: {"category":"Billing","priority":"High"}',
      schema: 'Respond strictly as JSON with keys: category, priority, evidence, action.',
      privacy: 'Never print full payment card numbers, passwords, or auth tokens in the output.',
    }, examples, outcomeTable };
  }

  if (variant === 'intermediate') {
    const ticketText = 'Customer email: "My dashboard shows two different plan names and I was billed for both. Also your support agent yesterday told me this was a known bug."';
    const examples: ResponseExample[] = [
      {
        id: 'resp_a', modelLabel: 'Response A', hasUnsupportedClaim: false,
        text: '{"category":"Billing","priority":"High","evidence":"billed for two plan names shown on dashboard","unverified_claim":"agent said known bug — pending confirmation"}',
        defectNote: 'Correctly separates the confirmed billing evidence from the unverifiable "agent said" claim instead of asserting it as fact.',
        evidenceQuote: 'billed for both',
        scores: { grounded: 4, schema: 4, privacy: 4, confidence: 3, actionable: 4 },
      },
      {
        id: 'resp_b', modelLabel: 'Response B', hasUnsupportedClaim: true,
        text: '{"category":"Billing","rootCause":"Caused by the database migration performed on Feb 28."}',
        defectNote: 'Hallucination — a specific, invented technical root cause with a fabricated date; the ticket says nothing about a migration.',
        evidenceQuote: '(no matching text in the ticket)',
        scores: { grounded: 0, schema: 3, privacy: 4, confidence: 1, actionable: 1 },
      },
      {
        id: 'resp_c', modelLabel: 'Response C', hasUnsupportedClaim: true,
        text: '{"category":"Billing","status":"Refund has been processed."}',
        defectNote: 'Overclaims a completed action — a classification step cannot itself verify that a refund was actually issued.',
        evidenceQuote: '(no refund action occurred)',
        scores: { grounded: 2, schema: 3, privacy: 4, confidence: 3, actionable: 2 },
      },
    ];
    const outcomeTable: Record<string, Outcome> = {
      [ALL_KEY]: { id: 'clean_grounded_json', summary: 'Grounded JSON that separates confirmed evidence from the unverified agent claim.', risk: 'low' },
      [keyWithout('privacy')]: { id: 'pii_leak_risk', summary: 'Without a privacy constraint, account identifiers can be echoed in full.', risk: 'high' },
      [keyWithout('context')]: { id: 'misclassification_risk', summary: 'Without context, the dual plan-name defect can be filed as a UI bug instead of billing.', risk: 'medium' },
      '': { id: 'no_instructions', summary: 'No blocks enabled — there is nothing for the classifier to act on.', risk: 'high' },
      'context,task': { id: 'high_risk_unstructured', summary: 'Bare-minimum prompt: no schema, no examples, no privacy guardrail — the "known bug" claim is likely to be repeated as fact.', risk: 'high' },
    };
    return { ticketText, blocksContent: {
      task: 'Classify the incoming support ticket and separate confirmed evidence from unverified customer-reported claims.',
      context: 'You are a triage assistant for an enterprise SaaS platform; billing and account-display issues are handled by different teams.',
      examples: 'Input: "Two plan names shown, billed for both" -> Output: {"category":"Billing","evidence":"..."}',
      schema: 'Respond strictly as JSON with keys: category, priority, evidence, unverified_claim.',
      privacy: 'Never assert an action (refund, cancellation) was completed unless it is explicitly confirmed in the ticket.',
    }, examples, outcomeTable };
  }

  // challenge
  const ticketText = 'Customer email: "Cancel my subscription immediately — actually, just downgrade me to the free tier instead, whichever is faster. On second thought, don\'t cancel, just pause billing."';
  const examples: ResponseExample[] = [
    {
      id: 'resp_a', modelLabel: 'Response A', hasUnsupportedClaim: false,
      text: '{"category":"Account Change","priority":"Medium","evidence":"three conflicting requests (cancel, downgrade, pause) in one message","action":"Request clarification before acting"}',
      defectNote: 'Correctly recognizes the instructions conflict and recommends clarification instead of guessing which one to execute.',
      evidenceQuote: 'Cancel ... downgrade ... don\'t cancel, just pause billing',
      scores: { grounded: 4, schema: 4, privacy: 4, confidence: 3, actionable: 4 },
    },
    {
      id: 'resp_b', modelLabel: 'Response B', hasUnsupportedClaim: true,
      text: '{"category":"Cancellation","status":"Customer confirmed cancellation via phone call."}',
      defectNote: 'Hallucination — no phone call occurred; the response fabricates a confirmation channel to resolve ambiguity instead of flagging it.',
      evidenceQuote: '(no phone call is mentioned anywhere)',
      scores: { grounded: 0, schema: 3, privacy: 4, confidence: 1, actionable: 1 },
    },
    {
      id: 'resp_c', modelLabel: 'Response C', hasUnsupportedClaim: true,
      text: '{"category":"Churn Risk","rationale":"Customer is likely switching to a competitor based on market trends."}',
      defectNote: 'Unsupported extrapolation — an inference about competitor-switching with no basis anywhere in the ticket.',
      evidenceQuote: '(no competitor is mentioned)',
      scores: { grounded: 1, schema: 2, privacy: 4, confidence: 2, actionable: 1 },
    },
  ];
  const outcomeTable: Record<string, Outcome> = {
    [ALL_KEY]: { id: 'clean_grounded_json', summary: 'Grounded JSON that surfaces the conflicting instructions instead of resolving them silently.', risk: 'low' },
    [keyWithout('privacy')]: { id: 'pii_leak_risk', summary: 'Without a privacy constraint, the account identifier is echoed in full.', risk: 'high' },
    '': { id: 'no_instructions', summary: 'No blocks enabled — there is nothing for the classifier to act on.', risk: 'high' },
  };
  return { ticketText, blocksContent: {
    task: 'Classify the ticket and explicitly flag when the customer message contains conflicting instructions.',
    context: 'You are a triage assistant for an enterprise SaaS platform; conflicting requests must be routed to a human before any account action.',
    examples: 'Input: "Cancel, then don\'t cancel" -> Output: {"category":"Account Change","action":"Request clarification"}',
    schema: 'Respond strictly as JSON with keys: category, priority, evidence, action.',
    privacy: 'Never assert an action was confirmed through a channel (call, chat) that is not present in the ticket.',
  }, examples, outcomeTable };
}

interface ComposerState {
  blocks: Record<BlockKey, boolean>;
  flaggedResponseIds: string[];
  bestResponseId: string;
}

const DEFAULT_BLOCKS: Record<BlockKey, boolean> = { task: true, context: false, examples: false, schema: false, privacy: false };

export default function PromptDesignCritiqueLab({ variant, onDirty, onSubmit }: SimulatorProps) {
  const fixture = useMemo(() => buildFixture(variant), [variant]);
  const initial: ComposerState = { blocks: { ...DEFAULT_BLOCKS }, flaggedResponseIds: [], bestResponseId: '' };
  const { state, set, undo, redo, reset, canUndo, canRedo } = useUndoableState<ComposerState>(initial);
  const [critiqueMemo, setCritiqueMemo] = useState('');

  const toggleBlock = (key: BlockKey) => {
    set((prev) => ({ ...prev, blocks: { ...prev.blocks, [key]: !prev.blocks[key] } }));
    onDirty();
  };
  const toggleFlag = (id: string) => {
    set((prev) => ({
      ...prev,
      flaggedResponseIds: prev.flaggedResponseIds.includes(id) ? prev.flaggedResponseIds.filter((f) => f !== id) : [...prev.flaggedResponseIds, id],
    }));
    onDirty();
  };
  const chooseBest = (id: string) => {
    set((prev) => ({ ...prev, bestResponseId: id }));
    onDirty();
  };

  const assembledPrompt = useMemo(() => BLOCK_ORDER
    .filter((k) => state.blocks[k])
    .map((k) => `### ${BLOCK_LABEL[k]}\n${fixture.blocksContent[k]}`)
    .join('\n\n'), [state.blocks, fixture]);

  const currentComboKey = comboKey(state.blocks);
  const outcome = fixture.outcomeTable[currentComboKey];

  const totalDefects = fixture.examples.filter((e) => e.hasUnsupportedClaim).length;
  const correctFlags = state.flaggedResponseIds.filter((id) => fixture.examples.find((e) => e.id === id)?.hasUnsupportedClaim).length;
  const falseFlags = state.flaggedResponseIds.length - correctFlags;
  const missedFlags = totalDefects - correctFlags;
  const groundedExample = fixture.examples.find((e) => !e.hasUnsupportedClaim);
  const bestResponseCorrect = state.bestResponseId !== '' && state.bestResponseId === groundedExample?.id;

  const enabledCount = BLOCK_ORDER.filter((k) => state.blocks[k]).length;

  const checklist = useMemo(() => ([
    { id: 'schema_on', label: 'Output schema block included', passed: state.blocks.schema },
    { id: 'privacy_on', label: 'Privacy & safety constraint included', passed: state.blocks.privacy },
    { id: 'defects_flagged', label: `All unsupported claims flagged (${correctFlags}/${totalDefects}, ${falseFlags} false)`, passed: correctFlags === totalDefects && falseFlags === 0 },
    { id: 'best_selected', label: 'Best (fully grounded) response selected', passed: bestResponseCorrect },
  ]), [state.blocks, correctFlags, totalDefects, falseFlags, bestResponseCorrect]);

  const radarSeries = fixture.examples.map((e) => ({
    label: e.modelLabel,
    data: [e.scores.grounded, e.scores.schema, e.scores.privacy, e.scores.confidence, e.scores.actionable],
  }));

  const handleExportCsv = () => {
    downloadCsv('prompt_critique_examples.csv', fixture.examples.map((e) => ({
      response_id: e.id, has_unsupported_claim: e.hasUnsupportedClaim ? 'YES' : 'NO',
      flagged_by_learner: state.flaggedResponseIds.includes(e.id) ? 'YES' : 'NO', defect_note: e.defectNote,
    })));
  };
  const handleExportJson = () => {
    downloadJson('prompt_design_revision.json', { variant, promptText: assembledPrompt, comboKey: currentComboKey, outcome, checklist, critiqueMemo });
  };

  const handleSubmit = () => {
    onSubmit({
      variant,
      blocksEnabled: state.blocks,
      comboKey: currentComboKey,
      outcomeId: outcome?.id ?? 'no_prepared_example',
      promptText: assembledPrompt,
      flaggedResponseIds: state.flaggedResponseIds,
      selectedBestResponseId: state.bestResponseId,
      totalDefects,
      correctFlags,
      falseFlags,
      missedFlags,
      bestResponseCorrect,
      revisionChecklist: checklist,
      critiqueMemo,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Prompt Framework</span>
          <span className="text-sm font-black text-purple-300">{enabledCount}/5 Blocks Enabled</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Task • Context • Examples • Schema • Privacy</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Defect Identification</span>
          <span className="text-sm font-black text-amber-300">{correctFlags}/{totalDefects} correct, {falseFlags} false</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Unsupported claims flagged</span>
        </div>
        <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30">
          <span className="text-xs text-purple-300 font-bold block mb-1">Prepared Outcome</span>
          <span className={`text-sm font-black ${outcome ? (outcome.risk === 'low' ? 'text-emerald-300' : outcome.risk === 'medium' ? 'text-amber-300' : 'text-red-300') : 'text-slate-400'}`}>
            {outcome ? outcome.risk.toUpperCase() + ' RISK' : 'No prepared example'}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">For this exact block combination</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>1. Prompt Architecture Block Composer</span>
              </h2>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={undo} disabled={!canUndo} title="Undo" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30">
                  <Undo2 className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={redo} disabled={!canRedo} title="Redo" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30">
                  <Redo2 className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => { reset(); onDirty(); }} title="Reset" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white">
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-black/30 border border-white/10 text-[11px] text-slate-300 italic">{fixture.ticketText}</div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {BLOCK_ORDER.map((k) => (
                <button key={k} type="button" onClick={() => toggleBlock(k)}
                  className={`p-3 rounded-xl border text-left font-bold transition-all ${state.blocks[k] ? (k === 'privacy' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200' : 'bg-purple-600/30 border-purple-500 text-white') : 'bg-white/5 border-white/10 text-slate-400'} ${k === 'privacy' ? 'sm:col-span-2' : ''}`}>
                  {state.blocks[k] ? '✓ ' : ''}{BLOCK_LABEL[k]}
                </button>
              ))}
            </div>

            {outcome ? (
              <div className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${outcome.risk === 'low' ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200' : outcome.risk === 'medium' ? 'bg-amber-950/20 border-amber-500/30 text-amber-200' : 'bg-red-950/20 border-red-500/30 text-red-200'}`}>
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span><strong>Prepared example:</strong> {outcome.summary}</span>
              </div>
            ) : (
              <div className="p-3 rounded-xl border border-white/10 bg-white/5 text-xs text-slate-400 italic">
                No prepared example for this exact block configuration — this combination has not been curated, so no output is fabricated for it. Try enabling more blocks (schema + privacy are the highest-value pair).
              </div>
            )}
          </div>

          <div className="p-5 rounded-3xl bg-[#0e101a] border border-white/10 space-y-2">
            <span className="text-xs font-mono font-extrabold text-purple-300 block">Assembled Structured Prompt</span>
            <pre className="p-3 rounded-xl bg-black/50 border border-white/10 text-xs font-mono text-purple-200 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">{assembledPrompt || '(no blocks enabled)'}</pre>
          </div>

          <ChartFrame
            title="Response Quality Checklist (Radar)"
            icon={<ShieldCheck className="w-4 h-4 text-purple-400" />}
            tableHeaders={['Response', 'Grounded', 'Schema', 'Privacy', 'Confidence', 'Actionable']}
            tableRows={fixture.examples.map((e) => [e.modelLabel, e.scores.grounded, e.scores.schema, e.scores.privacy, e.scores.confidence, e.scores.actionable])}
          >
            <CompareRadarChart axes={['Grounded', 'Schema', 'Privacy', 'Confidence', 'Actionable']} series={radarSeries} max={4} />
          </ChartFrame>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-purple-400" />
              <span>2. Authored Response Critique &amp; Flagging</span>
            </h3>
            <div className="space-y-3">
              {fixture.examples.map((r) => {
                const flagged = state.flaggedResponseIds.includes(r.id);
                const isBest = state.bestResponseId === r.id;
                return (
                  <div key={r.id} className={`p-3.5 rounded-2xl border text-xs space-y-1.5 transition-all ${flagged ? 'bg-amber-950/20 border-amber-500/50' : isBest ? 'bg-emerald-950/20 border-emerald-500/40' : 'bg-white/5 border-white/10'}`}>
                    <div className="flex justify-between items-center gap-2 flex-wrap">
                      <span className="font-bold text-white">{r.modelLabel}</span>
                      <div className="flex gap-1.5">
                        <button type="button" onClick={() => toggleFlag(r.id)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${flagged ? 'bg-amber-500 text-black' : 'bg-white/10 text-slate-400'}`}>
                          {flagged ? <XCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                          {flagged ? 'Flagged Unsupported' : 'Flag Unsupported'}
                        </button>
                        <button type="button" onClick={() => chooseBest(r.id)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${isBest ? 'bg-emerald-500 text-black' : 'bg-white/10 text-slate-400'}`}>
                          <CheckCircle2 className="w-3 h-3" />
                          Best
                        </button>
                      </div>
                    </div>
                    <pre className="p-2 rounded bg-black/40 text-[11px] font-mono text-slate-300 whitespace-pre-wrap">{r.text}</pre>
                    <p className="text-[10px] text-slate-400 italic">Evidence: &quot;{r.evidenceQuote}&quot;</p>
                    {(flagged || isBest) && <p className="text-[10px] text-slate-300">{r.defectNote}</p>}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-cyan-400" />
              <span>Revision Checklist</span>
            </h3>
            {checklist.map((c) => (
              <div key={c.id} className="flex items-center gap-2 text-[11px]">
                {c.passed ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />}
                <span className={c.passed ? 'text-emerald-200' : 'text-slate-400'}>{c.label}</span>
              </div>
            ))}
          </div>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-2">
            <label htmlFor="critique-memo" className="text-xs font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Prompt Quality &amp; Critique Memo</span>
            </label>
            <textarea id="critique-memo" rows={4} value={critiqueMemo}
              onChange={(e) => { setCritiqueMemo(e.target.value); onDirty(); }}
              className="w-full text-xs p-3 rounded-xl bg-black/30 border border-white/15 text-slate-200 focus:outline-none focus:border-purple-500/50" />
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={handleExportCsv} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] font-bold">
              <Download className="w-3.5 h-3.5" /><span>CSV</span>
            </button>
            <button type="button" onClick={handleExportJson} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] font-bold">
              <FileJson className="w-3.5 h-3.5" /><span>JSON</span>
            </button>
          </div>

          <button type="button" onClick={handleSubmit}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold transition-all flex items-center justify-center gap-2">
            <Send className="w-4 h-4" />
            <span>Submit Prompt Critique</span>
          </button>
        </div>
      </div>
    </div>
  );
}
