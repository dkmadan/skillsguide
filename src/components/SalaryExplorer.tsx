'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { BarChart3, ArrowUpRight, Database, Info } from 'lucide-react';
import { companyTypes, experienceLabels, findSalaryBenchmark, salaryCities, salaryDistribution, salaryIndustries, salaryRoles, salarySource } from '@/data/salaryBenchmarks';

const format = (n: number | null) => n === null ? 'Unavailable' : `₹${n.toFixed(2)}L`;
export default function SalaryExplorer() {
  const id = useId();
  const [query, setQuery] = useState({ role: 'Data Analyst', years: 2, city: 'Bengaluru', industry: 'BFSI', companyType: 'All company types' });
  const benchmark = findSalaryBenchmark(query);
  const distribution = salaryDistribution(query);
  const controls = [
    { key: 'role', label: 'Role', options: salaryRoles },
    { key: 'city', label: 'City', options: salaryCities },
    { key: 'industry', label: 'Industry', options: salaryIndustries },
    { key: 'companyType', label: 'Company type', options: companyTypes },
  ] as const;
  return <section id="salary-explorer" className="border-t border-white/10 bg-slate-950/30 px-4 py-16 sm:px-6 lg:px-10">
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 max-w-3xl"><p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-purple-300"><BarChart3 className="h-4 w-4" />Salary, with context</p><h2 className="text-3xl font-black text-white sm:text-4xl">Explore the market behind the number.</h2><p className="mt-3 text-sm leading-6 text-slate-400">Compare a specific role, experience band, city, industry, and company type. See the source and its limits alongside every figure.</p></div>
      <div className="overflow-hidden rounded-3xl border border-purple-400/20 bg-[#111320] shadow-2xl">
        <div className="grid gap-4 border-b border-white/10 bg-white/[.02] p-5 sm:grid-cols-2 sm:p-8 lg:grid-cols-5">
          {controls.map((control, i) => <div key={control.key} className={i === 0 ? 'lg:order-0' : 'lg:order-2'}><label htmlFor={`${id}-${control.key}`} className="mb-2 block text-xs font-bold text-slate-300">{control.label}</label><select id={`${id}-${control.key}`} value={query[control.key]} onChange={e => setQuery({ ...query, [control.key]: e.target.value })} className="w-full rounded-xl border border-slate-600 bg-slate-800 p-3 text-sm text-white outline-none focus:ring-2 focus:ring-purple-400">{control.options.map(option => <option key={option}>{option}</option>)}</select></div>)}
          <div className="lg:order-1"><label htmlFor={`${id}-years`} className="mb-2 block text-xs font-bold text-slate-300">Experience</label><select id={`${id}-years`} value={query.years} onChange={e => setQuery({ ...query, years: Number(e.target.value) })} className="w-full rounded-xl border border-slate-600 bg-slate-800 p-3 text-sm text-white outline-none focus:ring-2 focus:ring-purple-400">{Array.from({ length: 41 }, (_, years) => <option key={years} value={years}>{years === 0 ? 'Fresher' : `${years} ${years === 1 ? 'year' : 'years'}`}</option>)}</select></div>
        </div>
        <div className="space-y-6 p-5 sm:p-8" aria-live="polite" aria-atomic="true">
          <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-lg font-bold text-white">{query.role} / {query.years} yrs / {query.city}</h3><span className="rounded-full border border-purple-400/25 bg-purple-400/10 px-3 py-1.5 text-xs text-purple-200">{query.industry} · {query.companyType}</span></div>
          <div className="grid gap-4 sm:grid-cols-3">{[['P25', distribution.p25], ['Median', distribution.median], ['P75', distribution.p75]].map(([label, value]) => <div key={label} className={`rounded-2xl border p-5 ${label === 'Median' ? 'border-purple-400/40 bg-purple-500/10' : 'border-white/10 bg-white/[.025]'}`}><p className="text-xs font-semibold text-slate-400">{label} · Annual CTC</p><p className="mt-3 text-2xl font-black text-white">{format(value as number | null)}</p></div>)}</div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-400"><span>Sample: {distribution.sample} verified observations in our dataset</span><span>Observation update: {distribution.updated || 'No observation data'}</span><span>Matched experience band: {experienceLabels[benchmark.band]}</span></div>
          {distribution.median === null && <p className="flex items-start gap-2 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm leading-6 text-slate-300"><Info className="mt-1 h-4 w-4 shrink-0 text-amber-300" />Insufficient matching observations to publish percentiles. We require 30 verified observations per cohort. A published average cannot be converted into P25, a median, or P75.</p>}
          <div className="grid gap-6 rounded-2xl border border-white/10 bg-slate-950/50 p-5 sm:grid-cols-[1fr_2fr]">
            <div><p className="mb-2 text-xs font-bold uppercase tracking-wider text-purple-300">{benchmark.exactCompany ? 'Published reference average' : 'Broader reference · all company types'}</p><p className="text-3xl font-black text-white">{format(benchmark.mean)}</p><p className="mt-2 text-xs text-slate-400">Annual CTC · {experienceLabels[benchmark.band]}</p></div>
            <div className="space-y-2 text-sm leading-6 text-slate-300">{benchmark.row ? <><p>{query.role} · {query.city} · {query.industry}. {benchmark.exactCompany ? 'Company types are pooled in the source.' : `This is not a ${query.companyType}-specific benchmark; no company premium is applied.`}</p><a href={`${salarySource.url}#page=${benchmark.row.page}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-purple-300 underline underline-offset-4">{salarySource.publisher}, {salarySource.period} · page {benchmark.row.page}<ArrowUpRight className="h-3 w-3" /></a><p className="text-xs text-slate-400">Source cohort sample: not disclosed. Publication month: not stated. Source checked: {salarySource.checkedOn}.</p></> : <p>No published reference loaded for this role, city, and industry. Try Data Analyst in BFSI or Cloud Architect / Computing in Information Technology. We do not substitute another industry without telling you.</p>}</div>
          </div>
          <details className="rounded-2xl border border-white/10 p-5"><summary className="cursor-pointer font-bold text-white">How we calculate this</summary><div className="mt-4 space-y-3 text-sm leading-6 text-slate-400"><p><strong className="text-slate-200">Published reference:</strong> look up the source cell for role × experience band × city × industry. The report pools company types. No interpolation between experience bands, annual uplift, or assumed city/GCC multiplier is used.</p><p><strong className="text-slate-200">Percentile formula:</strong> for verified observations in the selected cohort and trailing 12 months, deduplicate by observation ID, sort annual CTC ascending, and calculate h = (n − 1) × p. Interpolate between the observations at floor(h) and ceil(h), with p = 0.25, 0.50, or 0.75. Require n ≥ 30. This is a publication threshold, not a confidence guarantee.</p><p>Exact years map to the source bands: 0–5, 6–14, and 15+. Individual observations are not currently loaded. A report-wide sample is never presented as the sample for your selected cohort. Report period, source-check date, and observation-update date are separate.</p><p><strong className="text-slate-200">Coverage:</strong> four roles in four cities, from the BFSI and IT tables. These are reported CTC averages, not fixed salary, take-home pay, or an offer guarantee. The source methodology is on pages 5–8.</p><a href={`${salarySource.url}#page=5`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-purple-300 underline"><Database className="h-4 w-4" />Read source methodology</a></div></details>
          <Link href="/tools/salary-calculator" className="inline-flex items-center gap-2 text-sm font-bold text-purple-300 hover:text-purple-200">Have an offer? Calculate estimated take-home<ArrowUpRight className="h-4 w-4" /></Link>
        </div>
      </div>
    </div>
  </section>;
}
