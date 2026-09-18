'use client';

import React, { useState, useMemo } from 'react';
import { LabScenarioVariant, LabDifficulty } from '@/lib/labs/types';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Layers, 
  FileText, 
  Send,
  Eye,
  ArrowRight
} from 'lucide-react';

interface SimulatorProps {
  scenario?: LabScenarioVariant;
  variant: LabDifficulty;
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

// 3 Authored response examples
const responseExamples = [
  {
    id: 'resp_a',
    modelLabel: 'Model Output A (Few-Shot & Schema Guarded)',
    classification: 'Billing Issue',
    priority: 'High',
    rationale: 'Customer was double-charged on invoice #INV-902.',
    hasUnsupportedClaim: false,
    text: '{"category": "Billing Issue", "priority": "High", "action": "Escalate to Finance", "confidence": 0.98}'
  },
  {
    id: 'resp_b',
    modelLabel: 'Model Output B (Hallucination Detected)',
    classification: 'Account Takeover',
    priority: 'Critical',
    rationale: 'Customer stated their password was hacked from a dark-web leak (UNGROUNDED CLAIM: No mention of dark web in ticket!)',
    hasUnsupportedClaim: true,
    text: '{"category": "Account Takeover", "priority": "Critical", "rationale": "Dark web password leak detected."}'
  },
  {
    id: 'resp_c',
    modelLabel: 'Model Output C (Missing Privacy Guardrail)',
    classification: 'General Inquiry',
    priority: 'Low',
    rationale: 'Customer credit card ending 4242 shared in plain text output without redaction.',
    hasUnsupportedClaim: true,
    text: '{"category": "General", "notes": "Processed card 4111-XXXX-XXXX-4242"}'
  }
];

export default function PromptDesignCritiqueLab({
  scenario,
  variant,
  onDirty,
  onSubmit
}: SimulatorProps) {
  // Prompt Component Blocks
  const [includeTask, setIncludeTask] = useState(true);
  const [includeContext, setIncludeContext] = useState(true);
  const [includeExamples, setIncludeExamples] = useState(true);
  const [includeOutputSchema, setIncludeOutputSchema] = useState(true);
  const [includePrivacyConstraints, setIncludePrivacyConstraints] = useState(true);

  // Response Critique & Flagging
  const [flaggedUnsupportedResponse, setFlaggedUnsupportedResponse] = useState<string>('resp_b');
  const [selectedBestResponse, setSelectedBestResponse] = useState<string>('resp_a');

  // Critique Memo
  const [critiqueMemo, setCritiqueMemo] = useState(
    'Model Output B introduced an unsupported hallucination ("dark web leak") not present in the customer query. Model Output A strictly followed JSON output schema with valid evidence.'
  );

  // Dynamic assembled prompt
  const assembledPrompt = useMemo(() => {
    let p = '';
    if (includeTask) p += '### TASK\nClassify incoming support ticket into billing, technical, or account category with urgency level.\n\n';
    if (includeContext) p += '### CONTEXT\nYou are a triage assistant for an enterprise SaaS platform with 50,000 active Indian users.\n\n';
    if (includeExamples) p += '### FEW-SHOT EXAMPLES\nInput: "Charged twice for annual renewal"\nOutput: {"category": "Billing", "priority": "High"}\n\n';
    if (includeOutputSchema) p += '### OUTPUT SCHEMA\nRespond strictly with JSON containing keys: category, priority, rationale, confidence.\n\n';
    if (includePrivacyConstraints) p += '### SAFETY & PRIVACY CONSTRAINTS\nNever disclose customer PII, credit card details, or auth tokens in output.';
    return p;
  }, [includeTask, includeContext, includeExamples, includeOutputSchema, includePrivacyConstraints]);

  const handleSubmit = () => {
    onSubmit({
      includeTask,
      includeContext,
      includeExamples,
      includeOutputSchema,
      includePrivacyConstraints,
      flaggedUnsupportedResponse,
      selectedBestResponse,
      critiqueMemo
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Prompt Framework</span>
          <span className="text-sm font-black text-purple-300">Structured 5-Block Blueprint</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Task • Context • Examples • Schema • Privacy</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Hallucination Detection</span>
          <span className="text-sm font-black text-amber-300">
            {flaggedUnsupportedResponse === 'resp_b' ? 'Output B Flagged (Correct)' : 'Defect unflagged'}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Ungrounded dark web claim</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#131728] border border-purple-500/30 bg-purple-950/20">
          <span className="text-xs text-purple-300 font-bold block mb-1">Output Schema Integrity</span>
          <span className="text-base font-black text-purple-200">
            {includeOutputSchema && includePrivacyConstraints ? 'Guarded JSON' : 'Vulnerable'}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Strict schema validation</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Cols: Prompt Block Composer & Assembled Prompt */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-4">
            <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>1. Prompt Architecture Block Composer</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => { setIncludeTask(!includeTask); onDirty(); }}
                className={`p-3 rounded-xl border text-left font-bold transition-all ${
                  includeTask ? 'bg-purple-600/30 border-purple-500 text-white' : 'bg-white/5 border-white/10 text-slate-400'
                }`}
              >
                ✓ Task Definition Block
              </button>
              <button
                type="button"
                onClick={() => { setIncludeContext(!includeContext); onDirty(); }}
                className={`p-3 rounded-xl border text-left font-bold transition-all ${
                  includeContext ? 'bg-purple-600/30 border-purple-500 text-white' : 'bg-white/5 border-white/10 text-slate-400'
                }`}
              >
                ✓ System Context Block
              </button>
              <button
                type="button"
                onClick={() => { setIncludeExamples(!includeExamples); onDirty(); }}
                className={`p-3 rounded-xl border text-left font-bold transition-all ${
                  includeExamples ? 'bg-purple-600/30 border-purple-500 text-white' : 'bg-white/5 border-white/10 text-slate-400'
                }`}
              >
                ✓ Few-Shot Input/Output Pair
              </button>
              <button
                type="button"
                onClick={() => { setIncludeOutputSchema(!includeOutputSchema); onDirty(); }}
                className={`p-3 rounded-xl border text-left font-bold transition-all ${
                  includeOutputSchema ? 'bg-purple-600/30 border-purple-500 text-white' : 'bg-white/5 border-white/10 text-slate-400'
                }`}
              >
                ✓ Strict JSON Output Schema
              </button>
              <button
                type="button"
                onClick={() => { setIncludePrivacyConstraints(!includePrivacyConstraints); onDirty(); }}
                className={`p-3 rounded-xl border text-left font-bold transition-all col-span-2 ${
                  includePrivacyConstraints ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200' : 'bg-white/5 border-white/10 text-slate-400'
                }`}
              >
                ✓ Safety &amp; Privacy Constraints (PII Redaction)
              </button>
            </div>
          </div>

          {/* Assembled Prompt Preview */}
          <div className="p-5 rounded-3xl bg-[#0e101a] border border-white/10 space-y-2">
            <span className="text-xs font-mono font-extrabold text-purple-300 block">
              Assembled Structured Prompt
            </span>
            <pre className="p-3 rounded-xl bg-black/50 border border-white/10 text-xs font-mono text-purple-200 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
              {assembledPrompt}
            </pre>
          </div>

        </div>

        {/* Right 5 Cols: Response Critique & Flagging */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-purple-400" />
              <span>2. Authored Response Critique &amp; Flagging</span>
            </h3>

            <div className="space-y-3">
              {responseExamples.map(r => (
                <div 
                  key={r.id} 
                  className={`p-3.5 rounded-2xl border text-xs space-y-1.5 transition-all ${
                    flaggedUnsupportedResponse === r.id ? 'bg-amber-950/20 border-amber-500/50' : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">{r.modelLabel}</span>
                    <button
                      type="button"
                      onClick={() => { setFlaggedUnsupportedResponse(r.id); onDirty(); }}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        flaggedUnsupportedResponse === r.id ? 'bg-amber-500 text-black font-extrabold' : 'bg-white/10 text-slate-400'
                      }`}
                    >
                      {flaggedUnsupportedResponse === r.id ? 'Flagged Hallucination' : 'Flag Hallucination'}
                    </button>
                  </div>
                  <pre className="p-2 rounded bg-black/40 text-[11px] font-mono text-slate-300">{r.text}</pre>
                  <p className="text-[10px] text-slate-400 italic">{r.rationale}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-2">
            <label htmlFor="critique-memo" className="text-xs font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Prompt Quality &amp; Critique Memo</span>
            </label>
            <textarea
              id="critique-memo"
              rows={3}
              value={critiqueMemo}
              onChange={(e) => { setCritiqueMemo(e.target.value); onDirty(); }}
              className="w-full text-xs p-3 rounded-xl bg-black/30 border border-white/15 text-slate-200 focus:outline-none focus:border-purple-500/50"
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-glow-btn transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Submit Prompt Critique</span>
          </button>

        </div>

      </div>

    </div>
  );
}
