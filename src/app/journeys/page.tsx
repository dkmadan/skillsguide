import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { learnerJourneys } from '@/data/journeysData';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import { 
  Compass, 
  ArrowRight, 
  Sparkles, 
  GraduationCap, 
  Briefcase, 
  RefreshCw, 
  Wrench, 
  Laptop, 
  DollarSign, 
  Zap, 
  CheckCircle2, 
  Layers 
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tailored Learner Journeys | SkillsGuide.in',
  description: 'Step-by-step career pathways tailored to your specific situation: B.Com/BA graduates, Diploma/ITI holders, career switchers, returnees, and resource-conscious learners.',
  keywords: [
    'career transitions india',
    'bcom to data analyst',
    'career break restart jobs',
    'iti diploma career paths',
    'low budget tech learning'
  ],
  openGraph: {
    title: 'Tailored Learner Journeys & Career Roadmaps',
    description: 'Practical, contextual career paths tailored for every learner situation in India.',
    url: 'https://skillsguide.in/journeys',
    type: 'website'
  }
};

export default function JourneysPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Learner Journeys' }
  ];

  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Tailored Learner Journeys',
    description: 'Career blueprints tailored for distinct educational and professional backgrounds.',
    url: 'https://skillsguide.in/journeys',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: learnerJourneys.map((j, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `https://skillsguide.in/journeys/${j.slug}`,
        name: j.title
      }))
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto space-y-12">
      <JsonLd data={jsonLdData} />
      <Breadcrumbs items={breadcrumbs} />

      {/* Hero Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-semibold">
          <Compass className="w-3.5 h-3.5" />
          <span>Tailored to Your Starting Point</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
          Career Journeys Built Around Your Reality
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Generic advice doesn’t work when your background, available time, and hardware differ. Choose the journey that matches your situation for realistic prerequisite bridges, project portfolios, and transition budgets.
        </p>
      </section>

      {/* Journeys Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {learnerJourneys.map((journey) => (
          <div 
            key={journey.slug}
            className="glass-card p-6 sm:p-7 rounded-3xl border border-white/10 hover:border-purple-500/40 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 hover:shadow-2xl bg-gradient-to-b from-[#161a2e]/60 to-[#0e111f]/80"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300">
                  {journey.badge}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {journey.financialAndTransitionPlanning.timeToFirstIncome}
                </span>
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-black text-white group-hover:text-purple-300 transition-colors">
                  {journey.title}
                </h2>
                <p className="text-xs text-purple-400 font-medium mt-0.5">
                  {journey.subtitle}
                </p>
              </div>

              <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                {journey.heroSummary}
              </p>

              {/* Recommended Tracks Quick List */}
              <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Recommended Tracks:</span>
                <div className="flex flex-wrap gap-1.5">
                  {journey.recommendedTracks.map((trk, i) => (
                    <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800">
                      {trk.title}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                {journey.actionPlanSteps.length} Step Action Plan
              </span>
              <Link
                href={`/journeys/${journey.slug}`}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-glow-btn flex items-center gap-1.5 transition-all group-hover:scale-105"
              >
                <span>View Journey</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Career Compass Integration CTA */}
      <section className="p-8 sm:p-10 rounded-3xl glass-card border border-purple-500/30 bg-gradient-to-br from-purple-950/40 via-indigo-950/30 to-slate-950 text-center max-w-4xl mx-auto space-y-4">
        <h3 className="text-xl sm:text-2xl font-black text-white">
          Not Sure Which Journey Fits Your Background?
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Take the comprehensive <strong>Career Compass (20+ Signal Assessment)</strong> to map your education, weekly hours, quantitative strengths, and target industry into tailored recommendations.
        </p>
        <Link
          href="/tools/career-compass"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-glow-btn transition-all"
        >
          <Compass className="w-4 h-4" />
          <span>Launch Career Compass Assessment</span>
        </Link>
      </section>

    </div>
  );
}
