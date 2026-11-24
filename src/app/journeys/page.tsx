import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { learnerJourneys } from '@/data/journeysData';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import { Compass, ArrowRight, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tailored Learner Journeys | SkillsGuide.in',
  description: 'Step-by-step career pathways tailored to your specific situation: GenAI engineering pivots, medical coding, cybersecurity SOC, supply chain SAP, people analytics, B.Com/BA graduates, career switchers, and more.',
  keywords: [
    'career transitions india',
    'software developer to ai agent engineer',
    'nursing to medical coding career',
    'it support to cybersecurity soc',
    'supply chain sap career transition',
    'hr to people analytics india',
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
    { name: 'Learner Journeys' }
  ];

  const illustratedJourneys = learnerJourneys.filter((j) => Boolean(j.image));
  const libraryJourneys = learnerJourneys.filter((j) => !j.image);

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
        name: j.title,
        ...(j.image ? { image: `https://skillsguide.in${j.image}` } : {})
      }))
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto space-y-14">
      <JsonLd data={jsonLdData} />
      <Breadcrumbs items={breadcrumbs} />

      {/* Hero Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF8E7] border border-[#F2B33D]/40 text-[#9A5B00] text-xs font-semibold">
          <Compass className="w-3.5 h-3.5 text-[#9A5B00]" />
          <span>Tailored to Your Starting Point • {learnerJourneys.length} Actionable Pathways</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#0F1E4A] tracking-tight leading-tight">
          Career Journeys Built Around Your Reality
        </h1>
        <p className="text-xs sm:text-sm text-[#555] leading-relaxed">
          Generic advice doesn’t work when your background, available time, and hardware differ. Choose the journey that matches your situation for realistic prerequisite bridges, project portfolios, and transition budgets.
        </p>
      </section>

      {/* Featured High-Impact Illustrated Journeys */}
      {illustratedJourneys.length > 0 && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#E4E0D4] pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#9A5B00]">
                <Sparkles className="w-3.5 h-3.5 text-[#F2B33D]" />
                <span>High-Demand 2026 Career Transitions</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-[#0F1E4A]">
                Featured High-Impact Journeys
              </h2>
            </div>
            <p className="text-xs text-[#666] max-w-md">
              In-depth, India-focused transition blueprints across AI Agents, Medical Coding, Cybersecurity SOC, Supply Chain SAP, and People Analytics.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {illustratedJourneys.map((journey, index) => (
              <article
                key={journey.slug}
                className="bg-white rounded-3xl border border-[#E4E0D4] hover:border-[#1E3A8A] transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 shadow-sm hover:shadow-md overflow-hidden"
              >
                <div>
                  {journey.image && (
                    <Link
                      href={`/journeys/${journey.slug}`}
                      className="block relative aspect-[16/9] w-full overflow-hidden bg-[#0F1E4A] border-b border-[#E4E0D4]"
                    >
                      <Image
                        src={journey.image}
                        alt={journey.imageAlt ?? journey.title}
                        fill
                        unoptimized={journey.image.endsWith('.svg')}
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        priority={index < 2}
                        fetchPriority={index < 2 ? 'high' : undefined}
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </Link>
                  )}

                  <div className="p-6 sm:p-7 space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-extrabold uppercase px-3 py-1 rounded-full bg-[#FFF8E7] border border-[#F2B33D]/40 text-[#9A5B00]">
                        {journey.badge}
                      </span>
                      <span className="text-[11px] text-[#047857] font-bold text-right">
                        {journey.financialAndTransitionPlanning.timeToFirstIncome}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-serif font-bold text-[#0F1E4A] group-hover:text-[#1E3A8A] transition-colors">
                        <Link href={`/journeys/${journey.slug}`}>
                          {journey.title}
                        </Link>
                      </h3>
                      <p className="text-xs text-[#1E3A8A] font-semibold mt-1">
                        {journey.subtitle}
                      </p>
                    </div>

                    <p className="text-xs text-[#555] line-clamp-3 leading-relaxed">
                      {journey.heroSummary}
                    </p>

                    {/* Recommended Tracks Quick List */}
                    <div className="pt-2 border-t border-[#E4E0D4] space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-[#666] block">Recommended Tracks:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {journey.recommendedTracks.map((trk, i) => (
                          <span key={i} className="text-[11px] px-2.5 py-1 rounded-lg bg-[#FAF8F3] text-[#0F1E4A] border border-[#E4E0D4]">
                            {trk.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 sm:px-7 pb-6 pt-4 border-t border-[#E4E0D4] flex items-center justify-between">
                  <span className="text-[11px] text-[#666] font-medium">
                    {journey.actionPlanSteps.length} Step Action Plan
                  </span>
                  <Link
                    href={`/journeys/${journey.slug}`}
                    className="px-4 py-2 rounded-xl bg-[#F2B33D] hover:bg-[#E09F26] text-[#0F1E4A] text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all group-hover:scale-105"
                  >
                    <span>View Journey</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Complete Journeys Library */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#E4E0D4] pb-4">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-serif font-black text-[#0F1E4A]">
              All Tailored Learner Journeys
            </h2>
            <p className="text-xs text-[#666]">
              Explore {libraryJourneys.length} additional pathways across degrees, diplomas, career breaks, and domain switches.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {libraryJourneys.map((journey) => (
            <div
              key={journey.slug}
              className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E4E0D4] hover:border-[#1E3A8A] transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 shadow-sm hover:shadow-md"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-extrabold uppercase px-3 py-1 rounded-full bg-[#FFF8E7] border border-[#F2B33D]/40 text-[#9A5B00]">
                    {journey.badge}
                  </span>
                  <span className="text-[11px] text-[#555] font-semibold text-right">
                    {journey.financialAndTransitionPlanning.timeToFirstIncome}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-[#0F1E4A] group-hover:text-[#1E3A8A] transition-colors">
                    {journey.title}
                  </h3>
                  <p className="text-xs text-[#1E3A8A] font-semibold mt-0.5">
                    {journey.subtitle}
                  </p>
                </div>

                <p className="text-xs text-[#555] line-clamp-3 leading-relaxed">
                  {journey.heroSummary}
                </p>

                {/* Recommended Tracks Quick List */}
                <div className="pt-2 border-t border-[#E4E0D4] space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-[#666] block">Recommended Tracks:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {journey.recommendedTracks.map((trk, i) => (
                      <span key={i} className="text-[11px] px-2.5 py-1 rounded-lg bg-[#FAF8F3] text-[#0F1E4A] border border-[#E4E0D4]">
                        {trk.title}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[#E4E0D4] flex items-center justify-between">
                <span className="text-[11px] text-[#666] font-medium">
                  {journey.actionPlanSteps.length} Step Action Plan
                </span>
                <Link
                  href={`/journeys/${journey.slug}`}
                  className="px-4 py-2 rounded-xl bg-[#F2B33D] hover:bg-[#E09F26] text-[#0F1E4A] text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all group-hover:scale-105"
                >
                  <span>View Journey</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Career Compass Integration CTA */}
      <section className="p-8 sm:p-10 rounded-3xl bg-[#0F1E4A] border border-[#1b2d63] text-center max-w-4xl mx-auto space-y-4 shadow-xl text-white">
        <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
          Not Sure Which Journey Fits Your Background?
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Take the comprehensive <strong>Career Compass (20+ Signal Assessment)</strong> to map your education, weekly hours, quantitative strengths, and target industry into tailored recommendations.
        </p>
        <Link
          href="/tools/career-compass"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#F2B33D] hover:bg-[#E09F26] text-[#0F1E4A] text-xs font-bold shadow-md transition-all"
        >
          <Compass className="w-4 h-4" />
          <span>Launch Career Compass Assessment</span>
        </Link>
      </section>

    </div>
  );
}
