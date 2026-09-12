import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { learnerJourneys, getLearnerJourneyBySlug } from '@/data/journeysData';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import { 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Clock, 
  Laptop, 
  FileText, 
  ShieldCheck, 
  Lightbulb, 
  Compass, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return learnerJourneys.map((j) => ({
    slug: j.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const journey = getLearnerJourneyBySlug(slug);

  if (!journey) {
    return {
      title: 'Journey Not Found | SkillsGuide.in',
    };
  }

  return {
    title: `${journey.title} | SkillsGuide.in`,
    description: journey.heroSummary,
    keywords: [
      journey.title,
      'career transition plan',
      'upskilling strategy',
      'portfolio guidelines',
      'indian job market'
    ],
    openGraph: {
      title: `${journey.title} - Career Strategy`,
      description: journey.heroSummary,
      url: `https://skillsguide.in/journeys/${journey.slug}`,
      type: 'article',
    }
  };
}

export default async function JourneyDetailPage({ params }: Props) {
  const { slug } = await params;
  const journey = getLearnerJourneyBySlug(slug);

  if (!journey) {
    notFound();
  }

  const breadcrumbs = [
    { name: 'Learner Journeys', url: '/journeys' },
    { name: journey.title }
  ];

  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: journey.title,
    description: journey.heroSummary,
    author: {
      '@type': 'Organization',
      name: 'SkillsGuide.in'
    },
    publisher: {
      '@type': 'Organization',
      name: 'SkillsGuide.in',
      url: 'https://skillsguide.in'
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-10 max-w-6xl mx-auto space-y-10">
      <JsonLd data={jsonLdData} />
      <Breadcrumbs items={breadcrumbs} />

      {/* Hero Header */}
      <section className="glass-card rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold">
            <span>{journey.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {journey.title}
          </h1>

          <p className="text-base text-purple-300 font-medium">
            {journey.subtitle}
          </p>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
            {journey.heroSummary}
          </p>
        </div>

        {/* Quick Info Grid */}
        <div className="mt-8 grid sm:grid-cols-3 gap-3.5 pt-6 border-t border-slate-800 text-xs">
          <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Target Audience</span>
            <p className="text-slate-200 font-medium">{journey.targetAudience}</p>
          </div>
          <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Realistic Timeline</span>
            <p className="text-emerald-400 font-bold">{journey.financialAndTransitionPlanning.timeToFirstIncome}</p>
          </div>
          <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Hardware & Specs</span>
            <p className="text-slate-200">{journey.financialAndTransitionPlanning.hardwareRequirements}</p>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 cols): Action Plan, Bridges & Projects */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Key Challenges */}
          <section className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              <span>Core Challenges This Journey Solves</span>
            </h2>
            <div className="space-y-2.5">
              {journey.keyChallengesAddressed.map((c, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Prerequisite Bridge Section */}
          <section className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" />
              <span>Prerequisite Bridge Modules</span>
            </h2>
            <p className="text-xs text-slate-400">Targeted bridge exercises to close foundational gaps before tackling advanced tracks.</p>

            <div className="space-y-3 pt-2">
              {journey.prerequisiteBridge.map((b, i) => (
                <div key={i} className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2 text-xs">
                  <div className="font-bold text-white text-sm text-purple-300">{b.area}</div>
                  <div className="grid sm:grid-cols-2 gap-2 text-slate-300">
                    <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80">
                      <span className="text-[10px] uppercase font-bold text-amber-400 block mb-0.5">Common Starting Gap:</span>
                      <span>{b.startingGap}</span>
                    </div>
                    <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80">
                      <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-0.5">Recommended Bridge Action:</span>
                      <span>{b.bridgeAction}</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400 pt-1">
                    📖 <strong>Recommended Resource:</strong> <span className="text-cyan-300">{b.freeResource}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Step-by-Step Action Plan */}
          <section className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-400" />
                <span>Step-by-Step Execution Plan</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">Structured milestones with concrete outputs to build momentum.</p>
            </div>

            <div className="space-y-4">
              {journey.actionPlanSteps.map((step) => (
                <div key={step.stepNumber} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-black flex items-center justify-center">
                        {step.stepNumber}
                      </span>
                      <h3 className="text-sm font-bold text-white">{step.title}</h3>
                    </div>
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {step.duration}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {step.description}
                  </p>

                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Expected Deliverables:</span>
                    <ul className="text-xs text-emerald-400 space-y-1 list-disc list-inside">
                      {step.deliverables.map((del, dIdx) => (
                        <li key={dIdx} className="leading-relaxed">{del}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Portfolio & Resume Strategy */}
          <section className="grid sm:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>Portfolio Strategy</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Focus:</strong> {journey.portfolioAndProjectStrategy.focus}
              </p>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-200">
                <strong className="text-purple-300 block mb-1">Recommended Project:</strong>
                {journey.portfolioAndProjectStrategy.recommendedProject}
              </div>
              <p className="text-xs text-emerald-400">
                ✨ <strong>Stand-out Tip:</strong> {journey.portfolioAndProjectStrategy.howToStandOut}
              </p>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Resume & Positioning</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Strategy:</strong> {journey.resumeAndPositioningAdvice.framingStrategy}
              </p>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono text-slate-200">
                <strong className="text-cyan-300 block font-sans mb-1">Sample Bullet Point:</strong>
                &quot;{journey.resumeAndPositioningAdvice.sampleBullet}&quot;
              </div>
              <p className="text-xs text-amber-300">
                ⚠️ <strong>Avoid:</strong> {journey.resumeAndPositioningAdvice.avoidMistake}
              </p>
            </div>
          </section>

        </div>

        {/* Right Sidebar (4 cols): Recommended Tracks & Planning */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Recommended Tracks */}
          <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="text-sm font-bold uppercase text-white tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-400" />
              <span>Recommended Flagship Tracks</span>
            </h3>

            <div className="space-y-3">
              {journey.recommendedTracks.map((trk) => (
                <div key={trk.slug} className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-xs">{trk.title}</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {trk.whyRecommended}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] text-purple-300 font-semibold">Entry: {trk.startingRole}</span>
                    <Link
                      href={`/skills/${trk.slug}`}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
                    >
                      <span>Explore</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial & Opportunity Cost Advice */}
          <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Opportunity Cost & Financial Planning</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {journey.financialAndTransitionPlanning.opportunityCostAdvice}
            </p>
            <div className="pt-2">
              <Link
                href="/tools/roi-calculator"
                className="text-xs text-purple-300 hover:underline flex items-center gap-1"
              >
                <span>Calculate your personalized career ROI →</span>
              </Link>
            </div>
          </div>

          {/* Other Journeys */}
          <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-3">
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
              Explore Other Journeys
            </h4>
            <div className="space-y-2 text-xs">
              {learnerJourneys
                .filter(j => j.slug !== journey.slug)
                .slice(0, 4)
                .map((other) => (
                  <Link
                    key={other.slug}
                    href={`/journeys/${other.slug}`}
                    className="block p-2.5 rounded-xl bg-slate-900 hover:bg-purple-900/20 border border-slate-800 text-slate-300 hover:text-white transition-all"
                  >
                    <div className="font-semibold">{other.title}</div>
                    <div className="text-[10px] text-slate-500">{other.badge}</div>
                  </Link>
                ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
