'use client';

import { useId, useRef, useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, Compass, Download, RotateCcw, Sparkles, Layers, ShieldCheck } from 'lucide-react';
import { Answers, CareerResult, getCompassSteps, isAnswered, rankCareers, resolveUserDomain } from '@/lib/careerCompass';

const button = 'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-400 cursor-pointer';
const money = (n: number) => `₹${n.toFixed(1)}L`;

export default function CareerCompassAssessment({ onNavigate }: { onNavigate?: () => void }) {
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const [results, setResults] = useState<CareerResult[] | null>(null);
  const [selected, setSelected] = useState(0);
  const [error, setError] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  const uid = useId();

  // Dynamically compute steps and active questions based on user's current answers
  const dynamicSteps = useMemo(() => getCompassSteps(answers), [answers]);
  const current = dynamicSteps[step];
  const allQuestions = dynamicSteps.flatMap(s => s.questions);
  const answeredCount = allQuestions.filter(q => answers[q.id]?.trim() && isAnswered(q, answers)).length;
  const userDomain = resolveUserDomain(answers);

  const domainBadgeMap: Record<string, { label: string; color: string }> = {
    law_legal: { label: '⚖️ Law & Corporate Governance Track Active', color: 'bg-pink-500/20 text-pink-300 border-pink-500/30' },
    finance_ca: { label: '📊 Chartered Accountancy & Finance Track Active', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    pharma_health: { label: '💊 Pharmacy & Healthcare Track Active', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    education: { label: '🎓 Education & Pedagogy Track Active', color: 'bg-sky-500/20 text-sky-300 border-sky-500/30' },
    core_engineering: { label: '🤖 Industrial Automation & Core Eng Track Active', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
    technology: { label: '🧠 Software & AI Frontier Track Active', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
    design_media: { label: '🎨 Design & Creative Media Track Active', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
    general_business: { label: '📈 General Professional & Career Switcher Active', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' }
  };

  const currentBadge = domainBadgeMap[userDomain] || domainBadgeMap.general_business;

  const focusHeading = () => requestAnimationFrame(() => {
    heading.current?.focus();
    heading.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  });

  const changeStep = (next: number) => {
    setStep(next);
    setError('');
    focusHeading();
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const missing = current.questions.find(q => !isAnswered(q, answers));
    if (missing) {
      setError(`Please complete “${missing.label}” before continuing.`);
      return;
    }
    if (step < dynamicSteps.length - 1) {
      changeStep(step + 1);
    } else {
      try {
        const ranked = rankCareers(answers);
        setResults(ranked);
        setSelected(0);
        setError('');
        focusHeading();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Please complete all required fields.');
      }
    }
  };

  const download = () => {
    const blob = new Blob([JSON.stringify({
      assessment: 'SkillsGuide Career Compass',
      version: 2,
      domainContext: userDomain,
      answers,
      results,
      timestamp: new Date().toISOString(),
      methodology: 'Multi-signal heuristic matching based on Indian compensation benchmarks, domain prerequisites, and lifestyle constraints.'
    }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `career-compass-plan-${answers.education?.split(' ')[0] || 'report'}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const result = results?.[selected];

  return (
    <div className="overflow-hidden rounded-3xl border border-purple-400/25 bg-[#111320] text-slate-200 shadow-2xl">
      {/* Header Banner */}
      <div className="border-b border-white/10 bg-gradient-to-br from-purple-500/15 via-transparent to-indigo-500/10 p-5 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-purple-400/30 bg-purple-500/15 p-3">
              <Compass className="h-6 w-6 text-purple-300 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold uppercase tracking-[.2em] text-purple-300">Intelligent Adaptive Discovery</p>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  v2.0 Adaptive Signals
                </span>
              </div>
              <h2 className="mt-1 text-xl font-black text-white sm:text-2xl">Indian Career Compass &amp; Transition Blueprint</h2>
            </div>
          </div>
          
          {step > 0 && (
            <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 shadow-sm ${currentBadge.color}`}>
              <span>{currentBadge.label}</span>
            </div>
          )}
        </div>

        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400">
          Personalized specifically for your domain background (CA, Law, Pharmacy, Teaching, Tech, Engineering &amp; Commerce). Questions dynamically adapt so you are evaluated on relevant skills — never forced into mismatched generic questions.
        </p>

        <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
          {['Adaptive 30-Signal Engine', 'Domain-Specific Competency Matching', 'Zero Unwanted Generic Coding for Non-Tech', '5 Adaptive Steps'].map(label => (
            <span key={label} className="rounded-full border border-white/10 px-3 py-1.5 bg-white/[0.02]">
              {label}
            </span>
          ))}
        </div>
      </div>

      {!results ? (
        <>
          {/* Progress Indicator */}
          <nav aria-label="Assessment progress" className="grid grid-cols-5 gap-1 border-b border-white/10 px-3 py-4 sm:px-8 bg-black/20">
            {dynamicSteps.map((s, i) => (
              <button
                type="button"
                key={s.title}
                disabled={i > step}
                onClick={() => changeStep(i)}
                aria-current={i === step ? 'step' : undefined}
                className={`flex flex-col items-center gap-1.5 rounded-xl p-1.5 text-center text-[10px] sm:text-xs transition-all disabled:cursor-not-allowed ${
                  i === step ? 'text-purple-300 font-bold bg-purple-500/10' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  i < step ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40' : i === step ? 'bg-purple-600 text-white shadow-glow-btn' : 'bg-white/5 border border-white/10'
                }`}>
                  {i < step ? <Check className="h-4 w-4" /> : `0${i + 1}`}
                </span>
                <span className="truncate max-w-[85px] sm:max-w-none">{['Background', 'Strengths', 'Interests', 'Goals', 'Feasibility'][i]}</span>
              </button>
            ))}
          </nav>

          {/* Form Content */}
          <form onSubmit={submit} className="p-5 sm:p-8">
            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono text-purple-300 font-semibold">STEP {step + 1} OF 5</span>
                <span>{answeredCount} / {allQuestions.length} signals captured</span>
              </div>
              <h3 ref={heading} tabIndex={-1} className="text-xl font-bold text-white outline-none flex items-center gap-2">
                <span>{current.title}</span>
              </h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">{current.description}</p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {current.questions.map(q => (
                <div key={q.id} className="rounded-2xl border border-white/[.08] bg-white/[.025] p-4.5 hover:border-purple-500/30 transition-colors">
                  <label id={`${uid}-${q.id}-label`} htmlFor={`${uid}-${q.id}`} className="mb-2.5 block text-sm font-semibold text-slate-100">
                    {q.label}
                    {q.optional && <span className="ml-2 text-xs font-normal text-slate-400">(Optional)</span>}
                  </label>

                  {q.options?.[4] === 'Advanced' ? (
                    <fieldset aria-labelledby={`${uid}-${q.id}-label`} className="min-w-0">
                      <div className="grid grid-cols-5 gap-1.5">
                        {q.options.map((option, index) => (
                          <label key={option} className="cursor-pointer text-center group">
                            <input
                              className="peer sr-only"
                              type="radio"
                              name={`${uid}-${q.id}`}
                              value={option}
                              checked={answers[q.id] === option}
                              required
                              onChange={() => setAnswers({ ...answers, [q.id]: option })}
                            />
                            <span className="flex h-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/80 text-sm font-bold text-slate-300 transition-all peer-checked:border-purple-400 peer-checked:bg-purple-500/30 peer-checked:text-purple-200 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-purple-400 group-hover:border-slate-500 shadow-sm">
                              {index + 1}
                            </span>
                            <span className="sr-only">{option}</span>
                          </label>
                        ))}
                      </div>
                      <div className="mt-2 flex justify-between text-[11px] text-slate-400">
                        <span>1 (None / Novice)</span>
                        <span className="text-purple-300 font-semibold">{answers[q.id] || 'Select comfort level (1–5)'}</span>
                        <span>5 (Advanced / Pro)</span>
                      </div>
                    </fieldset>
                  ) : q.options ? (
                    <select
                      id={`${uid}-${q.id}`}
                      value={answers[q.id] || ''}
                      required={!q.optional}
                      onChange={e => setAnswers({ ...answers, [q.id]: e.target.value })}
                      className="w-full min-w-0 rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-3 text-sm text-white outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 cursor-pointer"
                    >
                      <option value="" disabled>Select your answer...</option>
                      {q.options.map(o => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={`${uid}-${q.id}`}
                      type={q.type}
                      required={!q.optional}
                      min={q.type === 'number' ? 0 : undefined}
                      max={q.type === 'number' ? 1000 : undefined}
                      step={q.type === 'number' ? '.1' : undefined}
                      minLength={q.type === 'text' ? 2 : undefined}
                      maxLength={100}
                      placeholder={q.id === 'location' ? 'e.g. Mumbai, Maharashtra or Bengaluru, KA' : 'e.g. 6.5'}
                      value={answers[q.id] || ''}
                      onChange={e => setAnswers({ ...answers, [q.id]: e.target.value })}
                      aria-describedby={q.hint ? `${uid}-${q.id}-hint` : undefined}
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-3 text-sm text-white outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30"
                    />
                  )}

                  {q.hint && (
                    <p id={`${uid}-${q.id}-hint`} className="mt-2 text-xs leading-5 text-slate-400">
                      💡 {q.hint}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {error && (
              <div role="alert" className="mt-4 p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-sm text-rose-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="mt-7 flex items-center justify-between gap-3 border-t border-white/10 pt-5">
              <button
                type="button"
                disabled={step === 0}
                onClick={() => changeStep(step - 1)}
                className={`${button} bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed`}
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
              
              <button
                type="submit"
                className={`${button} bg-gradient-to-r from-purple-600 via-brand-600 to-indigo-600 text-white shadow-glow-btn hover:brightness-110`}
              >
                <span>{step === dynamicSteps.length - 1 ? 'Find My Matched Tracks' : 'Continue'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-4 text-center text-xs leading-5 text-slate-500">
              🔒 Complete client-side privacy. Answers stay in your browser and are never uploaded without permission. Export your blueprint below to save a copy.
            </p>
          </form>
        </>
      ) : result && (
        <div className="space-y-6 p-5 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
          <div>
            <div className="flex items-center gap-2">
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-300">
                <Sparkles className="h-4 w-4" />
                <span>Your Personalized Shortlist ({results.length} Pathways Evaluated)</span>
              </p>
            </div>
            <h3 ref={heading} tabIndex={-1} className="mt-1 text-2xl font-black text-white outline-none">
              Matched for {answers.education || 'Your Profile'}
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Ranked with heuristic multi-signal scoring tailored to your specific background strengths and lifestyle criteria.
            </p>
          </div>

          {/* Top 3 Cards Grid */}
          <div className="grid gap-3 sm:grid-cols-3">
            {results.slice(0, 3).map((r, i) => (
              <button
                type="button"
                key={r.slug}
                onClick={() => setSelected(i)}
                aria-pressed={i === selected}
                className={`rounded-2xl border p-5 text-left transition-all focus-visible:outline-2 focus-visible:outline-purple-400 cursor-pointer ${
                  i === selected
                    ? 'border-purple-400 bg-purple-500/20 shadow-glow-btn'
                    : 'border-white/10 bg-white/[.03] hover:bg-white/[.06]'
                }`}
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${
                    i === 0 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                  }`}>
                    {i === 0 ? '★ Strongest Match' : `Alternative #${i + 1}`}
                  </span>
                  <span className="text-xl font-black text-purple-300 font-mono">{r.score}%</span>
                </div>
                <h4 className="font-bold text-white text-base leading-snug">{r.title}</h4>
                <p className="mt-2 text-xs text-slate-400">
                  ⏱️ {r.weeks} weeks prep · 💰 {money(r.salary[0])}–{money(r.salary[1])} LPA
                </p>
              </button>
            ))}
          </div>

          {/* Selected Track Deep Dive Card */}
          <section aria-label={`${result.title} plan`} className="space-y-6 rounded-2xl border border-purple-400/25 bg-gradient-to-br from-purple-500/10 via-[#151828] to-transparent p-5 sm:p-7 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                  {selected === 0 ? 'YOUR #1 STRONGEST CAREER FIT' : `RECOMMENDED ALTERNATIVE PATH #${selected + 1}`}
                </span>
                <h3 className="mt-1 text-2xl sm:text-3xl font-black text-white">{result.title}</h3>
                <span className="text-xs text-slate-400 mt-1 block">Domain: {result.domain}</span>
              </div>
              <div className="rounded-2xl border border-purple-400/30 bg-purple-400/10 px-5 py-3 text-center shadow-inner">
                <strong className="text-3xl font-black text-purple-200 font-mono">{result.score}%</strong>
                <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Fit Score</p>
              </div>
            </div>

            {/* Why it suits you */}
            <div>
              <h4 className="mb-3 font-bold text-white flex items-center gap-2">
                <span>Why This Path Fits Your Profile</span>
              </h4>
              <ul className="grid gap-2.5 sm:grid-cols-2">
                {result.reasons.map(reason => (
                  <li key={reason} className="flex items-start gap-2.5 text-sm leading-6 text-slate-300 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-400" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Snapshot Metrics */}
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ['Indian Entry Salary Range', `${money(result.salary[0])} – ${money(result.salary[1])} LPA`],
                ['Estimated Study Timeline', `${result.weeks} Weeks (${result.learningHours} Total Hours)`],
                ['Transition Difficulty', result.gaps.reduce((s, g) => s + g.gap, 0) > 6 ? 'Challenging (Structured Prep Needed)' : result.gaps.length > 1 ? 'Moderate (Build Portfolio)' : 'Approachable (Direct Foundation)']
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-black/40 border border-white/5 p-4">
                  <p className="text-xs text-slate-400">{label}</p>
                  <p className="mt-1.5 text-base sm:text-lg font-bold text-white font-mono">{value}</p>
                </div>
              ))}
            </div>

            {/* Salary Disclaimer note */}
            <p className="text-xs leading-5 text-slate-400 italic">
              * Salary ranges represent contextual Indian market entry benchmarks based on industry aggregates across Bengaluru, Mumbai, NCR, Hyderabad, and Pune. Career outcome timings vary based on interview performance and verified project portfolios.
            </p>

            {/* Cautions */}
            {!!result.cautions.length && (
              <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-4.5">
                <h4 className="text-sm font-bold text-amber-200 flex items-center gap-2">
                  <span>Plan Around These Realistic Trade-Offs:</span>
                </h4>
                <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs sm:text-sm leading-6 text-slate-300">
                  {result.cautions.map(c => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills & Capstone Projects */}
            <div className="grid gap-6 sm:grid-cols-2 pt-2">
              <div className="rounded-xl bg-black/30 border border-white/5 p-4.5">
                <h4 className="mb-2.5 font-bold text-white">Target Competencies &amp; Skills</h4>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {result.skills.map(s => (
                    <span key={s} className="px-2.5 py-1 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-200 text-xs font-semibold">
                      {s}
                    </span>
                  ))}
                </div>
                {result.gaps.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-xs text-slate-400 mb-1.5 font-semibold">Skills to Practice / Bridge:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {result.gaps.map(g => (
                        <span key={g.key} className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] capitalize">
                          {g.key.replace(/_/g, ' ')} (+{g.gap})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-xl bg-black/30 border border-white/5 p-4.5">
                <h4 className="mb-2.5 font-bold text-white">Recommended Capstone Projects</h4>
                <ol className="list-decimal space-y-2.5 pl-5 text-xs sm:text-sm leading-relaxed text-slate-300">
                  {result.projects.map(p => (
                    <li key={p}>{p}</li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Practical Transition Plan */}
            <div className="rounded-xl bg-black/40 border border-white/5 p-4.5 space-y-2">
              <h4 className="font-bold text-white">Your Step-by-Step Transition Plan</h4>
              <p className="text-xs sm:text-sm leading-6 text-slate-300">
                <strong>Learning Strategy:</strong> {result.learningPlan} {result.budgetPlan}
              </p>
              <p className="text-xs sm:text-sm leading-6 text-slate-400">
                <strong>Target Job Search Strategy:</strong> {result.searchPlan}
              </p>
            </div>

            {/* Footer CTAs */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
              <div>
                <p className="text-xs font-bold text-purple-300 uppercase tracking-wider">Next Advancement Milestone</p>
                <Link
                  href={`/skills/${result.stretchSlug}`}
                  onClick={onNavigate}
                  className="mt-1 inline-block font-bold text-white hover:text-purple-300 underline decoration-purple-400/50 underline-offset-4"
                >
                  {result.stretch} →
                </Link>
                <p className="text-xs text-slate-400 mt-0.5">Build the foundation first, then target this advanced specialization.</p>
              </div>

              <Link
                href={`/skills/${result.slug}`}
                onClick={onNavigate}
                className={`${button} bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-glow-btn hover:brightness-110`}
              >
                <span>View Full {result.title} Blueprint</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          {/* Dimension Breakdown Accordion */}
          <details className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <summary className="cursor-pointer text-sm font-bold text-white hover:text-purple-300 flex items-center justify-between">
              <span>View Match Score Breakdown Across 6 Dimensions</span>
              <span className="text-xs text-purple-400">Expand details ▾</span>
            </summary>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 pt-2 border-t border-white/10">
              {Object.entries(result.dimensions).map(([name, scoreVal]) => (
                <div key={name} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="mb-1.5 flex justify-between text-xs">
                    <span className="text-slate-300 font-semibold">{name}</span>
                    <span className="text-purple-300 font-mono font-bold">{scoreVal}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      style={{ width: `${scoreVal}%` }}
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </details>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              className={`${button} bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10`}
              onClick={() => { setResults(null); changeStep(0); }}
            >
              <RotateCcw className="h-4 w-4" />
              <span>Modify Answers</span>
            </button>
            
            <button
              className={`${button} bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10`}
              onClick={download}
            >
              <Download className="h-4 w-4" />
              <span>Export Transition Plan (.JSON)</span>
            </button>
            
            <button
              className={`${button} text-slate-400 hover:text-white`}
              onClick={() => { setAnswers({}); setResults(null); changeStep(0); }}
            >
              <span>Reset &amp; Start Fresh</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
