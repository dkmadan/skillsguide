import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { allRoadmapsList, getRoadmapBySlug } from '@/data/roadmapsData';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import { 
  MapPin, 
  Clock, 
  Target, 
  CheckCircle2, 
  ArrowRight, 
  BookOpen, 
  Layers, 
  Compass, 
  Briefcase 
} from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return allRoadmapsList.map((roadmap) => ({
    slug: roadmap.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const roadmap = getRoadmapBySlug(slug);

  if (!roadmap) {
    return { title: 'Roadmap Not Found' };
  }

  return {
    title: `${roadmap.title} | ${roadmap.duration} Structured Learning Guide`,
    description: `Follow our step-by-step ${roadmap.duration} blueprint to become a ${roadmap.targetRole}. Includes weekly milestones, projects, and career transition guides.`,
    keywords: [roadmap.title, roadmap.targetRole, `${roadmap.title} syllabus`, 'career roadmap india'],
    openGraph: {
      title: `${roadmap.title} - Step-by-Step Career Roadmap`,
      description: roadmap.overview,
      url: `https://skillsguide.in/roadmaps/${roadmap.slug}`,
      images: [{ url: roadmap.heroImage, width: 1200, height: 630, alt: roadmap.title }]
    }
  };
}

export default async function RoadmapDetailPage({ params }: Props) {
  const { slug } = await params;
  const roadmap = getRoadmapBySlug(slug);

  if (!roadmap) {
    notFound();
  }

  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: roadmap.title,
    description: roadmap.overview,
    totalTime: `P${roadmap.duration.replace(/\D/g, '')}W`,
    step: roadmap.phases.map((phase, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: phase.phaseTitle,
      text: phase.description
    }))
  };

  const breadcrumbs = [
    { name: 'Roadmaps', url: '/#roadmaps' },
    { name: roadmap.categoryLabel, url: '/#roadmaps' },
    { name: roadmap.title }
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto">
      <JsonLd data={jsonLdData} />
      <Breadcrumbs items={breadcrumbs} />

      {/* Hero */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden mb-10">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <MapPin className="w-3.5 h-3.5" />
            <span>Structured Multi-Week Career Blueprint</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {roadmap.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {roadmap.overview}
          </p>

          <div className="pt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Target Role</span>
              <strong className="text-white font-bold truncate block">{roadmap.targetRole}</strong>
            </div>
            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Total Duration</span>
              <strong className="text-purple-300 font-bold block">{roadmap.duration}</strong>
            </div>
            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Weekly Effort</span>
              <strong className="text-emerald-400 font-bold block">{roadmap.weeklyCommitment}</strong>
            </div>
            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Target CTC</span>
              <strong className="text-amber-300 font-bold block">{roadmap.salaryExpectation}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left: Phase Breakdowns */}
        <div className="lg:col-span-8 space-y-8">
          
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-purple-400" />
            <span>Milestone Execution Timeline</span>
          </h2>

          <div className="space-y-6">
            {roadmap.phases.map((phase, idx) => (
              <div key={idx} className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">
                    Phase {idx + 1} • {phase.duration}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white">{phase.phaseTitle}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{phase.description}</p>

                <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Key Milestones:</span>
                  <ul className="text-xs text-slate-200 space-y-1.5 list-disc list-inside">
                    {phase.milestones.map((m, i) => (
                      <li key={i} className="leading-relaxed">{m}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-xs text-emerald-300 font-medium">
                  🎯 <strong>Deliverable Milestone Project:</strong> {phase.projectIdea}
                </div>
              </div>
            ))}
          </div>

          {/* Checklist */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Job-Readiness Graduation Checklist</span>
            </h3>
            <div className="space-y-2.5">
              {roadmap.checklist.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Career Transitions */}
          <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="text-sm font-black uppercase text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-purple-400" />
              <span>Common Career Transitions</span>
            </h3>

            <div className="space-y-3 text-xs">
              {roadmap.careerTransitions.map((t, i) => (
                <div key={i} className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                  <div className="font-bold text-white">
                    <span className="text-slate-400">{t.from}</span> &rarr; <span className="text-purple-300">{t.to}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{t.advantage}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Quiz Box */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-slate-950 border border-purple-500/30 text-center space-y-3">
            <h4 className="text-sm font-bold text-white">Discover more tailored roadmaps</h4>
            <p className="text-xs text-slate-300">Our 30-sec career compass calculates your highest return on investment.</p>
            <Link 
              href="/tools/career-compass"
              className="inline-block w-full py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-glow-btn transition-all"
            >
              Take Free Career Quiz
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
