'use client';

import React, { useState, useMemo } from 'react';
import { LabScenarioVariant } from '@/lib/labs/types';
import { downloadJson } from '@/lib/labs/exportHelper';

interface Props {
  scenario?: LabScenarioVariant;
  variant: 'beginner' | 'intermediate' | 'challenge';
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

export default function PresentationNegotiationLab({ onDirty, onSubmit }: Props) {
  const [pitchDraft, setPitchDraft] = useState<string>(
    'Good morning executive committee. Today we propose deploying deterministic practice labs across our enterprise curriculum. By eliminating black-box grading and anchoring our assessments in verifiable browser sandboxes, our learners gain genuine problem-solving fluency. Over three quarters, this reduces junior onboarding escalation costs by 40%.'
  );
  const [rehearsalMinutes, setRehearsalMinutes] = useState<number>(3.0);
  const [negotiationChoice, setNegotiationChoice] = useState<'compromise_scope' | 'crash_budget' | 'surrender_quality'>('compromise_scope');
  const [agreedTerms, setAgreedTerms] = useState<string>('Deliver Core 30 labs by Q3 with phased rollout of specialized AI tracks in Q4 to ensure zero QA compromise.');

  const wordCount = useMemo(() => {
    return pitchDraft.trim().split(/\s+/).filter(Boolean).length;
  }, [pitchDraft]);

  const wordsPerMinute = useMemo(() => {
    if (rehearsalMinutes <= 0) return 0;
    return Math.round(wordCount / rehearsalMinutes);
  }, [wordCount, rehearsalMinutes]);

  const handleExportJson = () => {
    downloadJson('presentation_negotiation_agreement.json', {
      wordCount,
      rehearsalMinutes,
      wordsPerMinute,
      negotiationChoice,
      agreedTerms
    });
  };

  const handleFinalSubmit = () => {
    onSubmit({
      wordCount,
      rehearsalMinutes,
      wordsPerMinute,
      negotiationChoice,
      agreedTerms
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Lab 27 • Executive Communication & Negotiation
            </span>
            <h2 className="text-xl font-bold text-white mt-2">Presentation Pacing & Executive Negotiation Lab</h2>
            <p className="text-sm text-slate-400 mt-1">
              Rehearse a 3-minute executive proposal. Calibrate verbal cadence: <code>Words / Minutes = WPM (Target: 120–150 WPM)</code>. Negotiate scope vs deadline tradeoffs with stakeholders without compromising quality.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              Export Agreement
            </button>
            <button
              onClick={handleFinalSubmit}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition shadow-lg shadow-amber-500/20"
            >
              Submit Agreement
            </button>
          </div>
        </div>
      </div>

      {/* Rehearsal Pacing Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 uppercase">Pitch Word Count</div>
          <div className="text-2xl font-bold text-white mt-1">{wordCount} Words</div>
          <p className="text-xs text-slate-500 mt-1">Calculated from typed script</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 uppercase">Rehearsal Duration</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">{rehearsalMinutes.toFixed(1)} Mins</div>
          <p className="text-xs text-slate-500 mt-1">Target: 3.0 minute pitch</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 uppercase">Estimated Verbal Pace</div>
          <div className={`text-2xl font-bold mt-1 ${wordsPerMinute >= 110 && wordsPerMinute <= 160 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {wordsPerMinute} WPM
          </div>
          <p className="text-xs text-slate-500 mt-1">Optimal cadence: 120 - 150 WPM</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 uppercase">Negotiation Stance</div>
          <div className="text-xl font-bold text-amber-400 mt-1 capitalize">{negotiationChoice.replace('_', ' ')}</div>
          <p className="text-xs text-slate-500 mt-1">Principled interest alignment</p>
        </div>
      </div>

      {/* Scripting Canvas & Negotiation Branch */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white">Proposal Pitch Script (3-Minute Executive Briefing)</h3>

          <textarea
            rows={6}
            value={pitchDraft}
            onChange={e => { setPitchDraft(e.target.value); onDirty(); }}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 focus:outline-none leading-relaxed"
          />

          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-400">Rehearsed Timer Duration:</span>
            <input
              type="range"
              min="1.0"
              max="5.0"
              step="0.5"
              value={rehearsalMinutes}
              onChange={e => { setRehearsalMinutes(parseFloat(e.target.value)); onDirty(); }}
              className="flex-1 accent-amber-500"
            />
            <span className="font-mono font-bold text-white">{rehearsalMinutes.toFixed(1)} min</span>
          </div>
        </div>

        {/* Stakeholder Pushback & Negotiation */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
          <h3 className="text-sm font-semibold text-white">Stakeholder Objection & Scope Tradeoff</h3>
          <p className="text-slate-400">
            CFO Objection: &ldquo;We need to cut the timeline by 4 weeks, but the engineering team says that is impossible without cutting QA.&rdquo;
          </p>

          <div className="space-y-2">
            {[
              { id: 'compromise_scope', label: 'Principled Tradeoff: Ship Core 30 labs on time, defer bonus tracks to Phase 2.' },
              { id: 'crash_budget', label: 'Overtime Crash: Force developers to work 70-hour weeks (Risks burnout & bugs).' },
              { id: 'surrender_quality', label: 'Cut QA: Ship without deterministic automated tests (Risks high defect escapes).' },
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => { setNegotiationChoice(opt.id as any); onDirty(); }}
                className={`w-full text-left p-3 rounded-xl border transition ${
                  negotiationChoice === opt.id
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-semibold'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800">
            <label className="text-slate-400 block mb-1">Final Negotiated Term Sheet</label>
            <textarea
              rows={3}
              value={agreedTerms}
              onChange={e => { setAgreedTerms(e.target.value); onDirty(); }}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
