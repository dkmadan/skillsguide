import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { skillComparisonsList, getSkillComparisonBySlug } from '@/data/skillComparisonsData';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import BookmarkButton from '@/components/BookmarkButton';
import { 
  GitCompare, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  IndianRupee, 
  Code2, 
  Layers, 
  HelpCircle, 
  Award,
  Zap,
  TrendingUp,
  BrainCircuit,
  Compass
} from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return skillComparisonsList.map((comp) => ({
    slug: comp.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const comparison = getSkillComparisonBySlug(slug);

  if (!comparison) {
    return {
      title: 'Comparison Not Found | SkillsGuide.in',
    };
  }

  return {
    title: `${comparison.title} | Salary, Demand & Learning Curve`,
    description: `Detailed face-off between ${comparison.skillA.name} and ${comparison.skillB.name}. Compare Indian salary ranges (${comparison.skillA.salaryIndia} vs ${comparison.skillB.salaryIndia}), learning time, coding prerequisites, pros/cons, and final recommendation.`,
    keywords: [
      comparison.title,
      `${comparison.skillA.name} vs ${comparison.skillB.name}`,
      `${comparison.skillA.name} salary india`,
      `${comparison.skillB.name} salary india`,
      `which is better ${comparison.skillA.name} or ${comparison.skillB.name}`,
      ...comparison.skillA.primaryTools,
      ...comparison.skillB.primaryTools
    ],
    openGraph: {
      title: `${comparison.title} - 2026 Comparison Guide`,
      description: `Complete face-off: ${comparison.skillA.name} vs ${comparison.skillB.name}. Compare salary, learning difficulty, and career demand.`,
      url: `https://skillsguide.in/compare/${comparison.slug}`,
      siteName: 'SkillsGuide.in'
    }
  };
}

export default async function SkillComparisonDetailPage({ params }: Props) {
  const { slug } = await params;
  const comparison = getSkillComparisonBySlug(slug);

  if (!comparison) {
    notFound();
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: comparison.title,
    description: `Comprehensive comparison of ${comparison.skillA.name} vs ${comparison.skillB.name} covering salary benchmarks, learning timeline, and industry demand.`,
    author: {
      '@type': 'Organization',
      name: 'SkillsGuide.in',
      url: 'https://skillsguide.in'
    },
    publisher: {
      '@type': 'Organization',
      name: 'SkillsGuide.in',
      url: 'https://skillsguide.in'
    },
    mainEntityOfPage: `https://skillsguide.in/compare/${comparison.slug}`
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: comparison.faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Comparisons', url: '/compare' },
    { name: `${comparison.skillA.name} vs ${comparison.skillB.name}` }
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto">
      <JsonLd data={articleJsonLd} />
      {comparison.faqs && comparison.faqs.length > 0 && <JsonLd data={faqJsonLd} />}
      <Breadcrumbs items={breadcrumbs} />

      {/* Hero Header */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden mb-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold">
            <GitCompare className="w-3.5 h-3.5 text-purple-400" />
            <span>{comparison.categoryLabel} Face-Off</span>
          </span>
          <BookmarkButton slug={comparison.slug} title={comparison.title} variant="button" />
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4">
          {comparison.title}
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-4xl mb-8">
          An objective, data-backed comparison between <strong className="text-purple-300">{comparison.skillA.name}</strong> and <strong className="text-indigo-300">{comparison.skillB.name}</strong>. Analyze market demand in India, learning curves, coding and math requirements, and decide which skill fits your career trajectory.
        </p>

        {/* Side-by-Side Dual Hero Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Skill A Card */}
          <div className="p-6 rounded-2xl bg-slate-950/80 border border-purple-500/30 relative shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/40">
                Option A
              </span>
              <span className="text-xs font-extrabold text-emerald-400">
                {comparison.skillA.salaryIndia}
              </span>
            </div>
            <h2 className="text-2xl font-black text-white mb-1">{comparison.skillA.name}</h2>
            <p className="text-xs text-purple-200/80 font-medium mb-4">{comparison.skillA.tagline}</p>
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-3 border-t border-slate-800">
              <div>
                <span className="text-slate-400 block">Learning Time:</span>
                <strong className="text-slate-200">{comparison.skillA.timeWeeks}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Coding Level:</span>
                <strong className="text-slate-200">{comparison.skillA.codingLevel}</strong>
              </div>
            </div>
          </div>

          {/* Skill B Card */}
          <div className="p-6 rounded-2xl bg-slate-950/80 border border-indigo-500/30 relative shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/40">
                Option B
              </span>
              <span className="text-xs font-extrabold text-emerald-400">
                {comparison.skillB.salaryIndia}
              </span>
            </div>
            <h2 className="text-2xl font-black text-white mb-1">{comparison.skillB.name}</h2>
            <p className="text-xs text-indigo-200/80 font-medium mb-4">{comparison.skillB.tagline}</p>
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-3 border-t border-slate-800">
              <div>
                <span className="text-slate-400 block">Learning Time:</span>
                <strong className="text-slate-200">{comparison.skillB.timeWeeks}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Coding Level:</span>
                <strong className="text-slate-200">{comparison.skillB.codingLevel}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Quick Comparison Scorecard Table */}
      <section className="mb-14">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-amber-400" />
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Quick Comparison Table
          </h2>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/10 shadow-2xl glass-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/90 text-xs font-extrabold uppercase tracking-wider text-slate-300 border-b border-white/10">
              <tr>
                <th className="py-4 px-5">Metric / Feature</th>
                <th className="py-4 px-5 text-purple-300">{comparison.skillA.name}</th>
                <th className="py-4 px-5 text-indigo-300">{comparison.skillB.name}</th>
                <th className="py-4 px-5 text-slate-400">Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs sm:text-sm">
              <tr className="hover:bg-white/5 transition-colors">
                <td className="py-3.5 px-5 font-semibold text-slate-300">Expected Salary (India)</td>
                <td className="py-3.5 px-5 font-bold text-emerald-400">{comparison.skillA.salaryIndia}</td>
                <td className="py-3.5 px-5 font-bold text-emerald-400">{comparison.skillB.salaryIndia}</td>
                <td className="py-3.5 px-5 text-slate-400">Market benchmark</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="py-3.5 px-5 font-semibold text-slate-300">Global Salary (US/Remote)</td>
                <td className="py-3.5 px-5 text-slate-200">{comparison.skillA.salaryGlobal}</td>
                <td className="py-3.5 px-5 text-slate-200">{comparison.skillB.salaryGlobal}</td>
                <td className="py-3.5 px-5 text-slate-400">USD rates</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="py-3.5 px-5 font-semibold text-slate-300">Learning Curve</td>
                <td className="py-3.5 px-5 text-slate-200">{comparison.skillA.learningCurve}</td>
                <td className="py-3.5 px-5 text-slate-200">{comparison.skillB.learningCurve}</td>
                <td className="py-3.5 px-5 text-purple-300 font-semibold">{comparison.skillA.learningCurve === 'Easy' ? comparison.skillA.name : comparison.skillB.name} is easier</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="py-3.5 px-5 font-semibold text-slate-300">Time Required</td>
                <td className="py-3.5 px-5 text-slate-200">{comparison.skillA.timeWeeks}</td>
                <td className="py-3.5 px-5 text-slate-200">{comparison.skillB.timeWeeks}</td>
                <td className="py-3.5 px-5 text-slate-400">Study timeline</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="py-3.5 px-5 font-semibold text-slate-300">Coding Requirement</td>
                <td className="py-3.5 px-5 text-slate-200">{comparison.skillA.codingLevel}</td>
                <td className="py-3.5 px-5 text-slate-200">{comparison.skillB.codingLevel}</td>
                <td className="py-3.5 px-5 text-slate-400">Prerequisite</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="py-3.5 px-5 font-semibold text-slate-300">Mathematics Requirement</td>
                <td className="py-3.5 px-5 text-slate-200">{comparison.skillA.mathLevel}</td>
                <td className="py-3.5 px-5 text-slate-200">{comparison.skillB.mathLevel}</td>
                <td className="py-3.5 px-5 text-slate-400">Math level</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="py-3.5 px-5 font-semibold text-slate-300">2026 Job Demand</td>
                <td className="py-3.5 px-5 font-bold text-purple-300">{comparison.skillA.jobDemand}</td>
                <td className="py-3.5 px-5 font-bold text-indigo-300">{comparison.skillB.jobDemand}</td>
                <td className="py-3.5 px-5 text-slate-400">Hiring volume</td>
              </tr>

              {/* Custom Metrics */}
              {comparison.quickComparisonMetrics.map((metric, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-5 font-semibold text-slate-300">{metric.feature}</td>
                  <td className="py-3.5 px-5 text-slate-200">{metric.skillAValue}</td>
                  <td className="py-3.5 px-5 text-slate-200">{metric.skillBValue}</td>
                  <td className="py-3.5 px-5 font-bold text-xs text-amber-300">
                    {metric.winner === 'skillA' ? comparison.skillA.name : metric.winner === 'skillB' ? comparison.skillB.name : 'Tie / Contextual'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 2. Deep Dive: What is Skill A vs Skill B? */}
      <section className="grid md:grid-cols-2 gap-8 mb-14">
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
            <Zap className="w-4 h-4" />
            <span>Overview</span>
          </div>
          <h3 className="text-2xl font-black text-white">What is {comparison.skillA.name}?</h3>
          <p className="text-slate-300 text-sm leading-relaxed font-normal">
            {comparison.skillA.description}
          </p>
          <div className="pt-2">
            <span className="text-xs font-semibold text-slate-400 block mb-2">Core Tools &amp; Ecosystem:</span>
            <div className="flex flex-wrap gap-1.5">
              {comparison.skillA.primaryTools.map((t, i) => (
                <span key={i} className="text-xs px-2.5 py-1 rounded-md bg-slate-900 text-purple-300 border border-purple-500/20 font-medium">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <Zap className="w-4 h-4" />
            <span>Overview</span>
          </div>
          <h3 className="text-2xl font-black text-white">What is {comparison.skillB.name}?</h3>
          <p className="text-slate-300 text-sm leading-relaxed font-normal">
            {comparison.skillB.description}
          </p>
          <div className="pt-2">
            <span className="text-xs font-semibold text-slate-400 block mb-2">Core Tools &amp; Ecosystem:</span>
            <div className="flex flex-wrap gap-1.5">
              {comparison.skillB.primaryTools.map((t, i) => (
                <span key={i} className="text-xs px-2.5 py-1 rounded-md bg-slate-900 text-indigo-300 border border-indigo-500/20 font-medium">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Pros and Cons Side-by-Side */}
      <section className="mb-14">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-6">
          Pros &amp; Cons Face-Off
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Skill A Pros/Cons */}
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-emerald-500/30">
              <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>{comparison.skillA.name} Advantages</span>
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                {comparison.skillA.pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950/80 border border-rose-500/30">
              <h4 className="text-sm font-bold text-rose-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <XCircle className="w-4 h-4" />
                <span>{comparison.skillA.name} Drawbacks</span>
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                {comparison.skillA.cons.map((con, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-400 mt-0.5">•</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Skill B Pros/Cons */}
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-emerald-500/30">
              <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>{comparison.skillB.name} Advantages</span>
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                {comparison.skillB.pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950/80 border border-rose-500/30">
              <h4 className="text-sm font-bold text-rose-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <XCircle className="w-4 h-4" />
                <span>{comparison.skillB.name} Drawbacks</span>
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                {comparison.skillB.cons.map((con, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-400 mt-0.5">•</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Who Should Choose Which Skill? */}
      <section className="mb-14">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-6">
          Who Should Choose Which Track?
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card rounded-2xl p-6 border border-purple-500/30 bg-[#121526]">
            <h4 className="text-base font-bold text-purple-300 mb-2">
              Choose {comparison.skillA.name} If:
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              {comparison.skillA.bestFor}
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-indigo-500/30 bg-[#121526]">
            <h4 className="text-base font-bold text-indigo-300 mb-2">
              Choose {comparison.skillB.name} If:
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              {comparison.skillB.bestFor}
            </p>
          </div>
        </div>
      </section>

      {/* 5. Beginner Friendliness & Final Verdict */}
      <section className="glass-card rounded-3xl p-6 sm:p-10 border border-purple-500/30 shadow-2xl relative overflow-hidden mb-14 bg-gradient-to-br from-slate-950 via-[#15192c] to-slate-950">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>Expert Verdict &amp; Recommendation</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-white">
            Which is easier for beginners?
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            {comparison.beginnerFriendlinessVerdict}
          </p>

          <div className="pt-4 border-t border-white/10">
            <h4 className="text-sm font-extrabold uppercase text-purple-400 tracking-wider mb-2">
              Final Recommendation
            </h4>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
              {comparison.finalRecommendation}
            </p>
          </div>

          <div className="pt-4 flex flex-wrap gap-4">
            <Link 
              href="/tools/career-compass"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold shadow-glow-btn flex items-center gap-2 hover:brightness-110 transition-all"
            >
              <span>Take 30-Sec Career Match Quiz</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link 
              href="/#skills-catalog"
              className="px-6 py-3 rounded-xl glass-card text-slate-200 text-xs font-bold hover:bg-slate-800 border border-slate-700 transition-all"
            >
              <span>Browse All Skill Tracks</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Frequently Asked Questions */}
      {comparison.faqs && comparison.faqs.length > 0 && (
        <section className="mb-14">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {comparison.faqs.map((faq, i) => (
              <div key={i} className="glass-card rounded-2xl p-5 sm:p-6 border border-white/10">
                <h4 className="text-sm sm:text-base font-bold text-white mb-2">{faq.question}</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. Related Comparisons */}
      {comparison.relatedComparisons && comparison.relatedComparisons.length > 0 && (
        <section className="pt-8 border-t border-white/10">
          <h3 className="text-lg font-bold text-white mb-4">Related Comparisons</h3>
          <div className="flex flex-wrap gap-2.5">
            {comparison.relatedComparisons.map((relSlug, i) => (
              <Link 
                key={i} 
                href={`/compare/${relSlug}`}
                className="text-xs font-medium px-4 py-2 rounded-xl glass-card text-purple-300 hover:text-white hover:border-purple-500/50 transition-all"
              >
                {relSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} →
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
