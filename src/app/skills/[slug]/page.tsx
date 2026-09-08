import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { allSkillsList, getSkillBySlug } from '@/data/skillsData';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import BookmarkButton from '@/components/BookmarkButton';
import { 
  Zap, 
  MapPin, 
  Clock, 
  IndianRupee, 
  CheckCircle2, 
  Briefcase, 
  Layers, 
  HelpCircle, 
  ArrowRight, 
  BookOpen, 
  Sparkles,
  Award,
  Cpu,
  TrendingUp
} from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return allSkillsList.map((skill) => ({
    slug: skill.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const skill = getSkillBySlug(slug);

  if (!skill) {
    return {
      title: 'Skill Track Not Found | SkillsGuide.in',
    };
  }

  return {
    title: `${skill.title} Blueprint (2026) | Salary: ${skill.salaryRange}`,
    description: `Complete guide to ${skill.title}. Discover verified Indian salary ranges (${skill.salaryRange}), learning timeline (${skill.timelineWeeks}), interview questions, and top hiring cities.`,
    keywords: [
      skill.title, 
      `${skill.title} syllabus`, 
      `${skill.title} salary india`,
      `${skill.title} jobs bangalore`, 
      ...skill.tools
    ],
    openGraph: {
      title: `${skill.title} Career Blueprint & Indian Salary Guide`,
      description: skill.shortDesc,
      url: `https://skillsguide.in/skills/${skill.slug}`,
      images: [
        {
          url: skill.heroImage,
          width: 1200,
          height: 630,
          alt: skill.title
        }
      ]
    }
  };
}

export default async function SkillDetailPage({ params }: Props) {
  const { slug } = await params;
  const skill = getSkillBySlug(slug);

  if (!skill) {
    notFound();
  }

  const courseJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: skill.title,
    description: skill.longDesc,
    provider: {
      '@type': 'Organization',
      name: 'SkillsGuide.in',
      sameAs: 'https://skillsguide.in'
    },
    educationalCredentialAwarded: 'Industry Job Readiness Blueprint',
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'Self-Paced Online Guide',
      duration: skill.timelineWeeks
    }
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: skill.faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  const breadcrumbs = [
    { name: 'Skills Directory', url: '/#skills-catalog' },
    { 
      name: skill.categoryLabel, 
      url: skill.domainSlug ? `/category/${skill.domainSlug}` : '/#skills-catalog' 
    },
    { name: skill.title }
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto">
      <JsonLd data={courseJsonLd} />
      {skill.faqs && skill.faqs.length > 0 && <JsonLd data={faqJsonLd} />}
      <Breadcrumbs items={breadcrumbs} />

      {/* Hero Header */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden mb-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{skill.categoryLabel}</span>
                </span>
                {skill.domainSlug && (
                  <Link 
                    href={`/category/${skill.domainSlug}`}
                    className="text-xs text-slate-400 hover:text-purple-300 transition-colors underline decoration-purple-500/40"
                  >
                    View Domain Hub →
                  </Link>
                )}
              </div>
              <BookmarkButton slug={skill.slug} title={skill.title} variant="button" />
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              {skill.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              {skill.longDesc}
            </p>

            {/* Hero Image Card */}
            <div className="relative h-52 sm:h-64 w-full rounded-2xl overflow-hidden border border-slate-800 shadow-xl my-4 group">
              <div className="absolute top-3 right-3 z-10">
                <BookmarkButton slug={skill.slug} title={skill.title} variant="icon" />
              </div>
              <Image 
                src={skill.heroImage} 
                alt={`${skill.title} Conceptual Visual`}
                fill 
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 60vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                <span className="px-2.5 py-1 rounded-md bg-slate-900/90 text-purple-300 font-bold border border-purple-500/30 text-[11px] backdrop-blur-md">
                  Verified 2026 Curriculum
                </span>
                <span className="px-2.5 py-1 rounded-md bg-emerald-950/90 text-emerald-300 font-bold border border-emerald-500/30 text-[11px] backdrop-blur-md">
                  High-ROI Track
                </span>
              </div>
            </div>

            {/* Quick Badges */}
            <div className="pt-2 flex flex-wrap gap-2">
              {skill.tools.map((tool, i) => (
                <span key={i} className="text-xs font-semibold px-3 py-1 bg-slate-800/90 text-purple-300 rounded-full border border-purple-500/20">
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Right Metrics Box */}
          <div className="lg:col-span-5 rounded-2xl p-6 bg-slate-950/80 border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
              🇮🇳 Indian Market Benchmark
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-medium">Expected CTC</span>
                <strong className="text-base sm:text-lg font-black text-emerald-400 mt-0.5 block">
                  {skill.salaryRange}
                </strong>
              </div>

              <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-medium">Learning Timeline</span>
                <strong className="text-base sm:text-lg font-black text-purple-300 mt-0.5 block">
                  {skill.timelineWeeks}
                </strong>
              </div>

              <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-medium">Hiring Openings</span>
                <strong className="text-xs sm:text-sm font-bold text-white mt-0.5 block">
                  {skill.hiringVolume}
                </strong>
              </div>

              <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-medium">Experience Level</span>
                <strong className="text-xs sm:text-sm font-bold text-amber-300 mt-0.5 block">
                  {skill.experienceLevel}
                </strong>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-purple-400" />
                <span>Top Hubs:</span>
              </span>
              <strong className="text-slate-200">{skill.topCities.join(', ')}</strong>
            </div>

            <Link 
              href="/tools/career-compass"
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-glow-btn flex items-center justify-center gap-2 transition-all mt-2"
            >
              <span>Take 30-Sec Career Match</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left Column: Concept Diagram, Syllabus & Interview Questions */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Key Value Highlights */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10">
            <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-400" />
              <span>Why This Skill Pays Off in 2026</span>
            </h2>
            <div className="space-y-2.5">
              {skill.keyHighlights.map((hl, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{hl}</span>
                </div>
              ))}
            </div>
          </div>

          {/* DEDICATED TECHNICAL CONCEPT ARCHITECTURE DIAGRAM (If present) */}
          {skill.conceptDiagram && (
            <section className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Technical Architecture & Concept Breakdown</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {skill.conceptDiagram.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  {skill.conceptDiagram.caption}
                </p>
              </div>

              {/* Responsive SVG Technical Graphic */}
              <figure className="rounded-2xl overflow-hidden border border-slate-800 bg-[#090d16] p-2 sm:p-4 shadow-2xl relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={skill.conceptDiagram.imageUrl} 
                  alt={`${skill.title} Core Architecture Diagram`}
                  className="w-full h-auto rounded-xl object-contain max-h-[500px]"
                  loading="lazy"
                />
                <figcaption className="text-[11px] text-slate-400 text-center mt-3 italic">
                  Figure: Structural Systems & Execution Lifecycle for {skill.title}
                </figcaption>
              </figure>

              {/* Key Concept Breakdown Cards */}
              <div className="grid sm:grid-cols-2 gap-3.5 pt-2">
                {skill.conceptDiagram.keyPoints.map((pt, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <h4 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                      <span>{pt.label}</span>
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-normal">
                      {pt.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Week-by-Week Syllabus & Projects */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                <span>Structured Week-by-Week Learning Syllabus</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">Focus on build-by-doing milestones rather than passive video lectures.</p>
            </div>

            <div className="space-y-6">
              {skill.syllabus.map((phase, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {phase.weeks}
                    </span>
                    <h3 className="text-sm font-bold text-white">{phase.phase}</h3>
                  </div>

                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                    {phase.topics.map((t, i) => (
                      <li key={i} className="leading-relaxed">{t}</li>
                    ))}
                  </ul>

                  <div className="pt-3 border-t border-slate-800 text-xs text-emerald-400 font-medium">
                    🎯 <strong>Milestone Proof Project:</strong> {phase.project}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* High-Frequency Interview Questions */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-purple-400" />
              <span>Top Interview Questions & Answers</span>
            </h2>

            <div className="space-y-4">
              {skill.interviewQuestions.map((q, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <h4 className="text-xs sm:text-sm font-bold text-white">Q{idx + 1}: {q.question}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-mono bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                    {q.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Frequently Asked Questions */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
            <h2 className="text-xl font-black text-white">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {skill.faqs.map((faq, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1">
                  <h4 className="text-xs font-bold text-white">{faq.question}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Sidebar: Job Roles & Cross-linked Tracks */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Target Job Roles */}
          <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="text-sm font-extrabold uppercase text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-purple-400" />
              <span>Target Job Roles</span>
            </h3>

            <div className="space-y-2.5">
              {skill.jobRoles.map((role, i) => (
                <div key={i} className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <h5 className="font-bold text-white">{role.title}</h5>
                    <span className="text-[10px] text-slate-400">Demand: {role.demand}</span>
                  </div>
                  <strong className="text-emerald-400 font-bold">{role.salary}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* Related Skills */}
          <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-3">
            <h3 className="text-sm font-extrabold uppercase text-white">
              Related Career Tracks
            </h3>
            <div className="space-y-2 text-xs">
              {skill.relatedSkills.map((relSlug) => {
                const relSkill = getSkillBySlug(relSlug);
                if (!relSkill) return null;
                return (
                  <div 
                    key={relSlug}
                    className="p-3 rounded-xl bg-slate-900/80 hover:bg-purple-500/10 border border-slate-800 hover:border-purple-500/40 flex items-center justify-between transition-all group gap-2"
                  >
                    <Link href={`/skills/${relSkill.slug}`} className="flex-1 min-w-0 pr-1">
                      <div className="font-bold text-white group-hover:text-purple-300 truncate">{relSkill.title}</div>
                      <div className="text-[10px] text-slate-400">{relSkill.salaryRange}</div>
                    </Link>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <BookmarkButton slug={relSkill.slug} title={relSkill.title} variant="icon" />
                      <Link href={`/skills/${relSkill.slug}`} className="p-1 text-slate-500 hover:text-purple-400">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Career CTA */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-slate-950 border border-purple-500/30 text-center space-y-3">
            <h4 className="text-sm font-bold text-white">Not sure if {skill.title} is right for you?</h4>
            <p className="text-xs text-slate-300">Take our 30-second career quiz to find your highest-ROI match.</p>
            <Link 
              href="/tools/career-compass"
              className="inline-block w-full py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-glow-btn transition-all"
            >
              Start Free Quiz
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
