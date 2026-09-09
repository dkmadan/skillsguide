import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { 
  careerRoleComparisons, 
  getCareerRoleComparisonBySlug 
} from "@/data/careerRoleComparisonsData";
import { 
  Briefcase, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  BookOpen, 
  Cpu, 
  HelpCircle, 
  Layers, 
  Compass, 
  Scale, 
  Award, 
  ShieldAlert, 
  GraduationCap, 
  MessageSquare, 
  Zap, 
  BarChart3, 
  Target, 
  Users,
  Code2,
  Calculator,
  Laptop
} from "lucide-react";
import BookmarkButton from "@/components/BookmarkButton";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return careerRoleComparisons.map((c) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getCareerRoleComparisonBySlug(slug);

  if (!item) {
    return {
      title: "Career Role Comparison Not Found | SkillsGuide",
    };
  }

  const title = `${item.roleA.title} vs ${item.roleB.title}: Career Guide, Salary & Day in the Life`;
  const description = `Compare ${item.roleA.title} vs ${item.roleB.title} side by side. Discover daily responsibilities, typical workday schedules, salary progression ladders, AI automation risk, and career roadmap.`;

  return {
    title,
    description,
    keywords: [
      `${item.roleA.title} vs ${item.roleB.title}`,
      `${item.roleA.title} career path`,
      `${item.roleB.title} career path`,
      `${item.roleA.title} salary`,
      `${item.roleB.title} salary`,
      "career comparison",
      "tech job roles",
      "day in the life"
    ],
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://skillsguide.in/career/compare/${item.slug}`,
    },
    alternates: {
      canonical: `https://skillsguide.in/career/compare/${item.slug}`,
    },
  };
}

export default async function CareerRoleComparisonDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = getCareerRoleComparisonBySlug(slug);

  if (!item) {
    notFound();
  }

  // Related role comparisons
  const relatedComparisons = careerRoleComparisons
    .filter((c) => c.category === item.category && c.slug !== item.slug)
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": `${item.roleA.title} vs ${item.roleB.title} Career Comparison`,
    "description": item.finalVerdict,
    "author": {
      "@type": "Organization",
      "name": "SkillsGuide",
      "url": "https://skillsguide.in"
    },
    "publisher": {
      "@type": "Organization",
      "name": "SkillsGuide",
      "logo": {
        "@type": "ImageObject",
        "url": "https://skillsguide.in/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://skillsguide.in/career/compare/${item.slug}`
    }
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": item.faqs.map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer
      }
    }))
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="max-w-6xl mx-auto space-y-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/career/compare" className="hover:text-white transition-colors">Career Compare</Link>
          <span>/</span>
          <span className="text-indigo-400 font-medium">{item.roleA.title} vs {item.roleB.title}</span>
        </nav>

        {/* Hero Section */}
        <div className="relative rounded-3xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-purple-950/60 border border-indigo-500/20 p-8 sm:p-12 overflow-hidden shadow-2xl backdrop-blur-xl">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
                <Briefcase className="w-3.5 h-3.5" />
                {item.categoryLabel} Role Face-Off
              </div>
              
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                <span className="text-indigo-400">{item.roleA.title}</span>
                <span className="text-slate-400 font-light mx-3">vs</span>
                <span className="text-purple-400">{item.roleB.title}</span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                {item.roleA.summary}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <BookmarkButton 
                  slug={`career-compare-${item.slug}`} 
                  title={`${item.roleA.title} vs ${item.roleB.title}`} 
                />
                <span className="text-xs text-slate-400 flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-white/5">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  12 min career deep-dive
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-white/5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  AI Impact Index Included
                </span>
              </div>
            </div>

            {/* Quick Verdict Summary Pill */}
            <div className="w-full md:w-80 rounded-2xl bg-slate-900/80 border border-white/10 p-6 shadow-xl space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-400" />
                Quick Verdict
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {item.finalVerdict}
              </p>
              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-slate-400">Entry Difficulty:</span>
                <span className="font-semibold text-white">
                  {item.roleA.entryDifficulty} vs {item.roleB.entryDifficulty}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Quick Career Comparison Table */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Scale className="w-6 h-6 text-indigo-400" />
            <h2 className="text-2xl font-bold text-white tracking-wide">
              Quick Career Comparison Matrix
            </h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md shadow-xl">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-xs uppercase tracking-wider text-slate-400 border-b border-white/10">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold">Evaluation Criteria</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-indigo-400">{item.roleA.title}</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-purple-400">{item.roleB.title}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs sm:text-sm">
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                    <Laptop className="w-4 h-4 text-indigo-400" /> Core Focus
                  </td>
                  <td className="px-6 py-4">{item.roleA.tagline}</td>
                  <td className="px-6 py-4">{item.roleB.tagline}</td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition-colors bg-slate-950/20">
                  <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" /> Senior Salary (India)
                  </td>
                  <td className="px-6 py-4 font-semibold text-emerald-400">{item.roleA.salaryProgression.senior}</td>
                  <td className="px-6 py-4 font-semibold text-emerald-400">{item.roleB.salaryProgression.senior}</td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-teal-400" /> Fresher Entry Salary
                  </td>
                  <td className="px-6 py-4 text-slate-200">{item.roleA.salaryProgression.fresher}</td>
                  <td className="px-6 py-4 text-slate-200">{item.roleB.salaryProgression.fresher}</td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition-colors bg-slate-950/20">
                  <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-blue-400" /> Coding Requirement
                  </td>
                  <td className="px-6 py-4 font-medium text-white">{item.roleA.codingRequirement}</td>
                  <td className="px-6 py-4 font-medium text-white">{item.roleB.codingRequirement}</td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-amber-400" /> Mathematics Requirement
                  </td>
                  <td className="px-6 py-4">{item.roleA.mathRequirement}</td>
                  <td className="px-6 py-4">{item.roleB.mathRequirement}</td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition-colors bg-slate-950/20">
                  <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-purple-400" /> Technical Depth
                  </td>
                  <td className="px-6 py-4">{item.roleA.technicalDepth}</td>
                  <td className="px-6 py-4">{item.roleB.technicalDepth}</td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-pink-400" /> Communication Need
                  </td>
                  <td className="px-6 py-4">{item.roleA.communicationRequirement}</td>
                  <td className="px-6 py-4">{item.roleB.communicationRequirement}</td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition-colors bg-slate-950/20">
                  <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-sky-400" /> Educational Background
                  </td>
                  <td className="px-6 py-4">{item.roleA.educationalBackground}</td>
                  <td className="px-6 py-4">{item.roleB.educationalBackground}</td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-400" /> Job Market Demand
                  </td>
                  <td className="px-6 py-4 font-medium text-green-300">{item.roleA.jobMarketDemand}</td>
                  <td className="px-6 py-4 font-medium text-green-300">{item.roleB.jobMarketDemand}</td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition-colors bg-slate-950/20">
                  <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-300" /> Work-Life Balance
                  </td>
                  <td className="px-6 py-4">{item.roleA.workLifeBalanceRating}</td>
                  <td className="px-6 py-4">{item.roleB.workLifeBalanceRating}</td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-400" /> AI Automation Risk
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-rose-300 border border-rose-500/20">
                      {item.roleA.aiAutomationRisk}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-rose-300 border border-rose-500/20">
                      {item.roleB.aiAutomationRisk}
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition-colors bg-slate-950/20">
                  <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-yellow-400" /> Career Ceiling
                  </td>
                  <td className="px-6 py-4 text-slate-200">{item.roleA.careerCeiling}</td>
                  <td className="px-6 py-4 text-slate-200">{item.roleB.careerCeiling}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 2: Daily Responsibilities Deep-Dive */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Briefcase className="w-6 h-6 text-indigo-400" />
            <h2 className="text-2xl font-bold text-white tracking-wide">
              Daily Responsibilities Breakdown
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Role A Responsibilities */}
            <div className="rounded-2xl bg-slate-900/70 border border-indigo-500/20 p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-lg font-bold text-indigo-300">{item.roleA.title}</h3>
                <span className="text-xs px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                  {item.roleA.entryDifficulty} Entry
                </span>
              </div>
              <p className="text-xs text-slate-300 italic">{item.roleA.tagline}</p>
              
              <ul className="space-y-3 pt-2">
                {item.roleA.dailyResponsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Role B Responsibilities */}
            <div className="rounded-2xl bg-slate-900/70 border border-purple-500/20 p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-lg font-bold text-purple-300">{item.roleB.title}</h3>
                <span className="text-xs px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium">
                  {item.roleB.entryDifficulty} Entry
                </span>
              </div>
              <p className="text-xs text-slate-300 italic">{item.roleB.tagline}</p>
              
              <ul className="space-y-3 pt-2">
                {item.roleB.dailyResponsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3: Typical Workday Schedule Comparison */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-indigo-400" />
            <h2 className="text-2xl font-bold text-white tracking-wide">
              A Typical Workday Routine
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-2xl bg-slate-900/60 border border-white/10 p-6 space-y-3 shadow-lg">
              <h3 className="text-base font-bold text-indigo-300 flex items-center gap-2 border-b border-white/10 pb-3">
                <Zap className="w-4 h-4 text-indigo-400" />
                {item.roleA.title} Day in the Life
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {item.roleA.typicalWorkday}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-900/60 border border-white/10 p-6 space-y-3 shadow-lg">
              <h3 className="text-base font-bold text-purple-300 flex items-center gap-2 border-b border-white/10 pb-3">
                <Zap className="w-4 h-4 text-purple-400" />
                {item.roleB.title} Day in the Life
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {item.roleB.typicalWorkday}
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Salary Progression Ladder */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <DollarSign className="w-6 h-6 text-emerald-400" />
            <h2 className="text-2xl font-bold text-white tracking-wide">
              Salary Progression Ladders
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Salary Ladder Role A */}
            <div className="rounded-2xl bg-slate-900/70 border border-white/10 p-6 space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-indigo-300 flex items-center justify-between border-b border-white/10 pb-3">
                <span>{item.roleA.title} Compensation</span>
                <span className="text-xs text-emerald-400 font-normal">Senior: {item.roleA.salaryProgression.senior}</span>
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-white/5">
                  <span className="text-xs text-slate-400">Fresher Entry-Level (0-2 Yrs)</span>
                  <span className="text-sm font-bold text-white">{item.roleA.salaryProgression.fresher}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-white/5">
                  <span className="text-xs text-slate-400">Mid-Level (3-5 Yrs)</span>
                  <span className="text-sm font-bold text-indigo-300">{item.roleA.salaryProgression.mid}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-white/5">
                  <span className="text-xs text-slate-400">Senior Level (6-9 Yrs)</span>
                  <span className="text-sm font-bold text-purple-300">{item.roleA.salaryProgression.senior}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                  <span className="text-xs text-emerald-300">Staff / Lead / Director</span>
                  <span className="text-sm font-bold text-emerald-400">{item.roleA.salaryProgression.lead}</span>
                </div>
              </div>
            </div>

            {/* Salary Ladder Role B */}
            <div className="rounded-2xl bg-slate-900/70 border border-white/10 p-6 space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-purple-300 flex items-center justify-between border-b border-white/10 pb-3">
                <span>{item.roleB.title} Compensation</span>
                <span className="text-xs text-emerald-400 font-normal">Senior: {item.roleB.salaryProgression.senior}</span>
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-white/5">
                  <span className="text-xs text-slate-400">Fresher Entry-Level (0-2 Yrs)</span>
                  <span className="text-sm font-bold text-white">{item.roleB.salaryProgression.fresher}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-white/5">
                  <span className="text-xs text-slate-400">Mid-Level (3-5 Yrs)</span>
                  <span className="text-sm font-bold text-indigo-300">{item.roleB.salaryProgression.mid}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-white/5">
                  <span className="text-xs text-slate-400">Senior Level (6-9 Yrs)</span>
                  <span className="text-sm font-bold text-purple-300">{item.roleB.salaryProgression.senior}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                  <span className="text-xs text-emerald-300">Staff / Lead / Director</span>
                  <span className="text-sm font-bold text-emerald-400">{item.roleB.salaryProgression.lead}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Skills & Tools Stack */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Layers className="w-6 h-6 text-indigo-400" />
            <h2 className="text-2xl font-bold text-white tracking-wide">
              Required Skills & Core Toolstacks
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Skills & Tools A */}
            <div className="rounded-2xl bg-slate-900/60 border border-white/10 p-6 space-y-5">
              <h3 className="text-base font-bold text-indigo-300 border-b border-white/10 pb-3">
                {item.roleA.title} Stack
              </h3>
              
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Required Skills:</p>
                <div className="flex flex-wrap gap-2">
                  {item.roleA.keySkills.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-lg bg-indigo-950/50 border border-indigo-500/30 text-indigo-300 text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Primary Tools:</p>
                <div className="flex flex-wrap gap-2">
                  {item.roleA.primaryTools.map((tool, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-lg bg-slate-950 border border-white/10 text-slate-200 text-xs font-mono">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Skills & Tools B */}
            <div className="rounded-2xl bg-slate-900/60 border border-white/10 p-6 space-y-5">
              <h3 className="text-base font-bold text-purple-300 border-b border-white/10 pb-3">
                {item.roleB.title} Stack
              </h3>
              
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Required Skills:</p>
                <div className="flex flex-wrap gap-2">
                  {item.roleB.keySkills.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-lg bg-purple-950/50 border border-purple-500/30 text-purple-300 text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Primary Tools:</p>
                <div className="flex flex-wrap gap-2">
                  {item.roleB.primaryTools.map((tool, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-lg bg-slate-950 border border-white/10 text-slate-200 text-xs font-mono">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: AI Automation Risk & Job Security Analysis */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-amber-400" />
            <h2 className="text-2xl font-bold text-white tracking-wide">
              AI Automation Risk & Job Security Analysis
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-2xl bg-slate-900/70 border border-white/10 p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">{item.roleA.title}</h3>
                <span className="text-xs font-bold px-2.5 py-1 rounded bg-slate-800 text-amber-400 border border-amber-400/20">
                  Risk Level: {item.roleA.aiAutomationRisk}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pt-2">
                {item.roleA.title} requires deep contextual understanding and collaboration. While generative AI accelerates boilerplate tasks, critical decision-making remains with human professionals.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-900/70 border border-white/10 p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">{item.roleB.title}</h3>
                <span className="text-xs font-bold px-2.5 py-1 rounded bg-slate-800 text-amber-400 border border-amber-400/20">
                  Risk Level: {item.roleB.aiAutomationRisk}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pt-2">
                {item.roleB.title} focuses on high-impact workflows and cross-functional alignment where human judgment and domain expertise provide substantial defensibility.
              </p>
            </div>
          </div>
        </section>

        {/* Section 7: Beginner Suitability & Target Audience Recommendation */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Compass className="w-6 h-6 text-indigo-400" />
            <h2 className="text-2xl font-bold text-white tracking-wide">
              Who Should Choose Which Role?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/20 p-6 space-y-4">
              <h3 className="text-lg font-bold text-indigo-300">
                Choose {item.roleA.title} if you:
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {item.roleA.whoShouldChoose}
              </p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-purple-950/60 to-slate-900 border border-purple-500/20 p-6 space-y-4">
              <h3 className="text-lg font-bold text-purple-300">
                Choose {item.roleB.title} if you:
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {item.roleB.whoShouldChoose}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900/90 border border-white/10 p-6 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-yellow-400" />
              Which role is better for beginners?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {item.beginnerVerdict}
            </p>
          </div>
        </section>

        {/* Section 8: Final Recommendation */}
        <section className="rounded-3xl bg-gradient-to-br from-indigo-900/50 via-slate-900 to-purple-900/40 border border-indigo-500/30 p-8 space-y-4 shadow-2xl">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-400" />
            Final Recommendation & Next Steps
          </h2>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
            {item.finalVerdict}
          </p>
          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link
              href="/career/compare"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-600/30"
            >
              ← Explore All Career Guides
            </Link>
            <Link
              href="/compare"
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-all border border-white/10"
            >
              Compare Skill Stacks →
            </Link>
          </div>
        </section>

        {/* Related Comparisons */}
        {relatedComparisons.length > 0 && (
          <section className="space-y-6 pt-6 border-t border-white/10">
            <h3 className="text-lg font-bold text-white">
              Related Career Role Guides
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedComparisons.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/career/compare/${rel.slug}`}
                  className="group block p-5 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-indigo-500/30 hover:bg-slate-900/90 transition-all"
                >
                  <p className="text-xs text-indigo-400 font-medium">{rel.categoryLabel}</p>
                  <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors mt-1">
                    {rel.roleA.title} vs {rel.roleB.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                    {rel.roleA.summary}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
