'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { BarChart3, ArrowUpRight, Database, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';
import {
  companyTypes,
  experienceLabels,
  findSalaryBenchmark,
  salaryCities,
  salaryDistribution,
  salaryIndustries,
  salaryRoles,
  salarySource,
} from '@/data/salaryBenchmarks';

const format = (n: number | null) => (n === null ? 'Unavailable' : `₹${n.toFixed(2)}L`);

export default function SalaryExplorer() {
  const id = useId();
  const [query, setQuery] = useState({
    role: 'Data Analyst',
    years: 2,
    city: 'Hyderabad',
    industry: 'BFSI',
    companyType: 'IT services',
  });

  const benchmark = findSalaryBenchmark(query);
  const distribution = salaryDistribution(query);

  const controls = [
    { key: 'role', label: 'Role', options: salaryRoles },
    { key: 'city', label: 'City', options: salaryCities },
    { key: 'industry', label: 'Industry', options: salaryIndustries },
    { key: 'companyType', label: 'Company type', options: companyTypes },
  ] as const;

  return (
    <section id="salary-explorer" className="border-t border-white/10 bg-slate-950/30 px-4 py-16 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 max-w-3xl">
          <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-purple-300">
            <BarChart3 className="h-4 w-4" />
            Salary Intelligence & Benchmarks
          </p>
          <h2 className="text-3xl font-black text-white sm:text-4xl">
            Explore the market behind the number.
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Compare compensation benchmarks across experience tiers, major Indian tech hubs, industries, and company categories. Sourced and calibrated from Randstad India, Michael Page, and NASSCOM compensation surveys.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-purple-400/20 bg-[#111320] shadow-2xl">
          {/* Controls Bar */}
          <div className="grid gap-4 border-b border-white/10 bg-white/[.02] p-5 sm:grid-cols-2 sm:p-8 lg:grid-cols-5">
            {controls.map((control, i) => (
              <div key={control.key} className={i === 0 ? 'lg:order-0' : 'lg:order-2'}>
                <label htmlFor={`${id}-${control.key}`} className="mb-2 block text-xs font-bold text-slate-300">
                  {control.label}
                </label>
                <select
                  id={`${id}-${control.key}`}
                  value={query[control.key]}
                  onChange={e => setQuery({ ...query, [control.key]: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/90 p-3 text-sm text-white outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                >
                  {control.options.map(option => (
                    <option key={option} value={option} className="bg-slate-900 text-white">
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ))}
            <div className="lg:order-1">
              <label htmlFor={`${id}-years`} className="mb-2 block text-xs font-bold text-slate-300">
                Experience
              </label>
              <select
                id={`${id}-years`}
                value={query.years}
                onChange={e => setQuery({ ...query, years: Number(e.target.value) })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800/90 p-3 text-sm text-white outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
              >
                {Array.from({ length: 41 }, (_, years) => (
                  <option key={years} value={years} className="bg-slate-900 text-white">
                    {years === 0 ? 'Fresher (0 yrs)' : `${years} ${years === 1 ? 'year' : 'years'}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Area */}
          <div className="space-y-6 p-5 sm:p-8" aria-live="polite" aria-atomic="true">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {query.role} · {query.years === 0 ? 'Fresher' : `${query.years} yrs exp`} · {query.city}
                </h3>
                <p className="mt-0.5 text-xs text-slate-400">
                  Estimated annual compensation distribution for Indian market
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-purple-400/30 bg-purple-400/10 px-3 py-1.5 text-xs font-medium text-purple-200">
                  {query.industry}
                </span>
                <span className="rounded-full border border-indigo-400/30 bg-indigo-400/10 px-3 py-1.5 text-xs font-medium text-indigo-200">
                  {query.companyType}
                </span>
              </div>
            </div>

            {/* 3 Percentile Cards */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[.025] p-5 transition hover:border-white/20">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">P25 · Lower Quartile</p>
                  <span className="text-[11px] text-slate-400">Bottom 25%</span>
                </div>
                <p className="mt-3 text-3xl font-black text-slate-100">{format(distribution.p25)}</p>
                <p className="mt-2 text-xs text-slate-400">Entry level of band / standard service firms</p>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-purple-400/40 bg-gradient-to-br from-purple-500/15 via-indigo-500/10 to-slate-900/60 p-5 shadow-lg shadow-purple-900/20">
                <div className="flex items-center justify-between">
                  <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-300">
                    <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                    Median · Annual CTC
                  </p>
                  <span className="rounded-full bg-purple-400/20 px-2 py-0.5 text-[10px] font-bold text-purple-200">
                    50th Percentile
                  </span>
                </div>
                <p className="mt-3 text-3xl font-black text-white">{format(distribution.median)}</p>
                <p className="mt-2 text-xs text-purple-200/80">Market midpoint for selected profile</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[.025] p-5 transition hover:border-white/20">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">P75 · Upper Quartile</p>
                  <span className="text-[11px] text-slate-400">Top 25%</span>
                </div>
                <p className="mt-3 text-3xl font-black text-emerald-400">{format(distribution.p75)}</p>
                <p className="mt-2 text-xs text-slate-400">Top tier firms, product companies, GCCs</p>
              </div>
            </div>

            {/* Context & Metadata Bar */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-white/5 bg-slate-900/40 px-4 py-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                Sample: {distribution.sample}
              </span>
              <span>Calibration: {distribution.updated}</span>
              <span>Matched Band: {experienceLabels[benchmark.band]}</span>
            </div>

            {/* Published Reference Comparison */}
            <div className="grid gap-6 rounded-2xl border border-white/10 bg-slate-950/50 p-5 sm:grid-cols-[1fr_2fr]">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-purple-300">
                  {benchmark.exactCompany ? 'Published Report Reference' : 'Broader Industry Baseline'}
                </p>
                <p className="text-3xl font-black text-white">{format(benchmark.mean)}</p>
                <p className="mt-2 text-xs text-slate-400">
                  Macro average · {experienceLabels[benchmark.band]} ({query.city})
                </p>
              </div>
              <div className="space-y-2 text-sm leading-6 text-slate-300">
                {benchmark.row ? (
                  <>
                    <p>
                      Official published average for <strong className="text-white">{query.role}</strong> in{' '}
                      <strong className="text-white">{query.city}</strong> ({benchmark.row.industry} sector).
                      {benchmark.exactCompany
                        ? ' Published report figures pool company types across the city.'
                        : ` Calibrated for ${query.companyType} tier with industry multipliers applied.`}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 pt-1">
                      <a
                        href={`${salarySource.url}#page=${benchmark.row.page}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-purple-300 hover:text-purple-200 underline underline-offset-4"
                      >
                        Randstad India {salarySource.period} · Table Page {benchmark.row.page}
                        <ArrowUpRight className="h-3 w-3" />
                      </a>
                      <a
                        href={salarySource.secondaryUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-300 hover:text-indigo-200 underline underline-offset-4"
                      >
                        Michael Page India Benchmark
                        <ArrowUpRight className="h-3 w-3" />
                      </a>
                    </div>
                  </>
                ) : (
                  <p>
                    Calibrated from Michael Page India Salary Guide & NASSCOM Tech Talent surveys for {query.role} in {query.city}.
                  </p>
                )}
              </div>
            </div>

            {/* Calculation Methodology Disclosure */}
            <details className="rounded-2xl border border-white/10 bg-white/[.01] p-5">
              <summary className="cursor-pointer font-bold text-white hover:text-purple-300 transition">
                How these numbers are calculated & sourced
              </summary>
              <div className="mt-4 space-y-3 text-sm leading-6 text-slate-400">
                <p>
                  <strong className="text-slate-200">1. Data Sources:</strong> Primary benchmarks are drawn from the{' '}
                  <strong className="text-slate-300">Randstad India Annual Salary Trends Report 2025–26</strong> and verified against the{' '}
                  <strong className="text-slate-300">Michael Page India Salary Guide & NASSCOM Tech Talent Matrix</strong>.
                </p>
                <p>
                  <strong className="text-slate-200">2. Percentile Modeling:</strong> P25 (lower 25th percentile), Median (50th percentile), and P75 (upper 75th percentile) are computed using calibrated compensation curves adjusting for exact years of experience, city talent cost indices (e.g. Bengaluru tech premium, Mumbai BFSI hub), and company tier multipliers (Product firms, GCCs, Startups, IT Services).
                </p>
                <p>
                  <strong className="text-slate-200">3. CTC Definition:</strong> All numbers reflect Total Cost to Company (CTC) per annum in Indian Lakhs (INR), including fixed base, standard allowances, and typical annual performance bonus components.
                </p>
                <div className="pt-2">
                  <a
                    href={`${salarySource.url}#page=5`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-purple-300 hover:text-purple-200 underline"
                  >
                    <Database className="h-4 w-4" />
                    Read Randstad Survey Methodology
                  </a>
                </div>
              </div>
            </details>

            {/* Quick Links */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4">
              <Link
                href="/tools/salary-calculator"
                className="inline-flex items-center gap-2 text-sm font-bold text-purple-300 hover:text-purple-200 transition"
              >
                <TrendingUp className="h-4 w-4" />
                Have an offer? Calculate estimated in-hand take-home
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/roadmaps"
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
              >
                Explore high-paying skill roadmaps
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
