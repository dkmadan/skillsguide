'use client';

import React, { useState } from 'react';
import { LabScenarioVariant } from '@/lib/labs/types';
import { downloadJson } from '@/lib/labs/exportHelper';

interface Props {
  scenario?: LabScenarioVariant;
  variant: 'beginner' | 'intermediate' | 'challenge';
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

interface InterviewQuote {
  id: string;
  userType: string;
  quote: string;
  theme: 'pricing_friction' | 'course_discovery' | 'checkout_dropoff' | 'unassigned';
}

export default function UxResearchPrototypeLab({ onDirty, onSubmit }: Props) {
  const [quotes, setQuotes] = useState<InterviewQuote[]>([
    { id: 'q1', userType: 'Career Switcher', quote: 'I couldnt figure out which python track was meant for non-programmers vs seniors.', theme: 'course_discovery' },
    { id: 'q2', userType: 'Engineering Lead', quote: 'Our company credit card needs GST invoices before we can authorize seat checkout.', theme: 'pricing_friction' },
    { id: 'q3', userType: 'Student', quote: 'I clicked "Enroll Now" and got stuck on an empty screen with no back button.', theme: 'checkout_dropoff' }, // Dead end screen issue
    { id: 'q4', userType: 'Data Analyst', quote: 'Comparing the 3 syllabus levels took 10 clicks across separate tabs.', theme: 'course_discovery' },
    { id: 'q5', userType: 'Product Manager', quote: 'The pricing showed USD on the landing page but converted without warning at checkout.', theme: 'pricing_friction' },
    { id: 'q6', userType: 'Self-taught Dev', quote: 'When the payment failed, the modal closed and my entire 6-field form cleared out.', theme: 'checkout_dropoff' },
  ]);

  const [activeScreenId, setActiveScreenId] = useState<string>('landing');
  const [hasFixedDeadEnd, setHasFixedDeadEnd] = useState<boolean>(false);
  const [problemStatement, setProblemStatement] = useState<string>('Learners experience 42% dropoff at checkout due to hidden currency conversion and unrecoverable payment error states.');
  const [designRationale, setDesignRationale] = useState<string>('');

  const handleUpdateTheme = (id: string, theme: InterviewQuote['theme']) => {
    setQuotes(prev => prev.map(q => q.id === id ? { ...q, theme } : q));
    onDirty();
  };

  const handleExportJson = () => {
    downloadJson('ux_research_prototype.json', {
      problemStatement,
      quotes,
      hasFixedDeadEnd,
      designRationale
    });
  };

  const handleFinalSubmit = () => {
    onSubmit({
      problemStatement,
      quotes,
      hasFixedDeadEnd,
      designRationale
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20">
              Lab 16 • UX Research & Interaction Design
            </span>
            <h2 className="text-xl font-bold text-white mt-2">UX Research Synthesis & Interactive Prototype Lab</h2>
            <p className="text-sm text-slate-400 mt-1">
              Cluster qualitative user interview feedback into affinity themes, detect dead-end navigation loops in the checkout prototype, and draft validated design rationale.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              Export Synthesis
            </button>
            <button
              onClick={handleFinalSubmit}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-pink-600 hover:bg-pink-500 text-white transition shadow-lg shadow-pink-600/20"
            >
              Submit UX Report
            </button>
          </div>
        </div>
      </div>

      {/* Affinity Board & Quotes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Research Feedback Cluster */}
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white">Affinity Matrix: User Interview Transcripts</h3>

          <div className="space-y-3">
            {quotes.map(q => (
              <div key={q.id} className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-300">{q.userType}</span>
                  <select
                    value={q.theme}
                    onChange={e => handleUpdateTheme(q.id, e.target.value as any)}
                    className="bg-slate-800 border border-slate-700 rounded px-2 py-0.5 text-[11px] text-pink-300 focus:outline-none"
                  >
                    <option value="course_discovery">Course Discovery</option>
                    <option value="pricing_friction">Pricing & Billing</option>
                    <option value="checkout_dropoff">Checkout Dropoff</option>
                  </select>
                </div>
                <p className="text-slate-400 italic">&ldquo;{q.quote}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>

        {/* Clickable Prototype & Journey Map */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white">Interactive Prototype State Machine</h3>

            {/* Wireframe Mock Screen */}
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl min-h-[200px] flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2">
                  Screen: {activeScreenId.toUpperCase()}
                </div>

                {activeScreenId === 'landing' && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-white">Full-Stack AI Bootcamp</h4>
                    <p className="text-xs text-slate-400">Transform your career with hands-on practice labs.</p>
                    <button
                      onClick={() => { setActiveScreenId('checkout'); onDirty(); }}
                      className="mt-3 px-4 py-1.5 bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold rounded-lg transition"
                    >
                      Enroll Now ($49) &rarr;
                    </button>
                  </div>
                )}

                {activeScreenId === 'checkout' && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-white">Secure Order Summary</h4>
                    <div className="p-2 bg-slate-900 rounded border border-slate-800 text-xs text-slate-300">
                      Total: ₹4,100 (incl. 18% GST invoice receipt)
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setActiveScreenId('payment_failed'); onDirty(); }}
                        className="px-3 py-1.5 bg-slate-800 text-slate-200 text-xs rounded hover:bg-slate-700"
                      >
                        Simulate Card Decline
                      </button>
                      <button
                        onClick={() => { setActiveScreenId('success'); onDirty(); }}
                        className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded hover:bg-emerald-500"
                      >
                        Complete Payment
                      </button>
                    </div>
                  </div>
                )}

                {activeScreenId === 'payment_failed' && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-rose-400">Card Authorization Failed</h4>
                    <p className="text-xs text-slate-400">Bank 3D-Secure timeout. Your form state has been preserved.</p>
                    {hasFixedDeadEnd ? (
                      <button
                        onClick={() => { setActiveScreenId('checkout'); onDirty(); }}
                        className="px-3 py-1.5 bg-pink-600 text-white text-xs font-semibold rounded hover:bg-pink-500"
                      >
                        Retry Payment with Alternative Card
                      </button>
                    ) : (
                      <div className="p-2 bg-rose-950/40 border border-rose-800 text-rose-300 text-xs rounded">
                        ⚠️ DEAD END DETECTED: No retry CTA or back button provided!
                      </div>
                    )}
                  </div>
                )}

                {activeScreenId === 'success' && (
                  <div className="text-center py-4 space-y-2">
                    <div className="text-emerald-400 font-bold text-sm">🎉 Enrollment Confirmed!</div>
                    <button
                      onClick={() => { setActiveScreenId('landing'); onDirty(); }}
                      className="text-xs text-slate-400 hover:text-slate-200 underline"
                    >
                      Return to home
                    </button>
                  </div>
                )}
              </div>

              {!hasFixedDeadEnd && (
                <div className="pt-3 border-t border-slate-800 mt-4 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Dead-End Navigation Vulnerability</span>
                  <button
                    onClick={() => { setHasFixedDeadEnd(true); onDirty(); }}
                    className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition"
                  >
                    Fix Dead End Screen
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
