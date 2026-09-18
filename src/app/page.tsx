import React from 'react';
import { trackCount } from '@/data/siteStats';
import Link from 'next/link';
import Image from 'next/image';
import { allSkillsList } from '@/data/skillsData';
import { categoryDomains } from '@/data/categoryData';
import SalaryExplorer from '@/components/SalaryExplorer';
import CheatSheetSection from '@/components/CheatSheetSection';
import HomeClientCatalog from '@/components/HomeClientCatalog';
import HomeRoadmapTabs from '@/components/HomeRoadmapTabs';
import JsonLd from '@/components/JsonLd';
import { 
  ArrowUpRight, 
  ArrowRight, 
  Bookmark, 
  Users, 
  IndianRupee, 
  Star, 
  CheckCircle2, 
  Sparkles,
  Zap,
  TrendingUp,
  MapPin,
  FileCheck,
  Cpu,
  Palette,
  Leaf,
  Layers,
  FlaskConical,
  Play
} from 'lucide-react';

export default function HomePage() {
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SkillsGuide.in',
    url: 'https://skillsguide.in',
    description: 'India\'s leading career skilling and roadmap platform with source-linked salary references.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://skillsguide.in/glossary?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  const domainIcons: Record<string, React.ReactNode> = {
    'emerging-tech-ai': <Cpu className="w-5 h-5 text-indigo-400" />,
    'business-growth-nocode': <TrendingUp className="w-5 h-5 text-amber-400" />,
    'creative-design-media': <Palette className="w-5 h-5 text-rose-400" />,
    'green-tech-sustainability': <Leaf className="w-5 h-5 text-teal-400" />
  };

  return (
    <>
      <JsonLd data={jsonLdData} />

      {/* Hero Section matching provided HTML markup */}
      <section id="hero" className="relative pt-8 pb-16 md:pt-14 md:pb-24 px-4 sm:px-6 lg:px-10 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Typography, Badges & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-left relative z-10">
            
            {/* Pill Indicator */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
              <span>E-Learning &amp; High-ROI Skilling Platform</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-black text-white tracking-tight leading-[1.12]">
              Empower Your <br />
              Learning Journey <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-purple-400 to-indigo-300">
                With Modern Skills.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed font-normal">
              Upgrade your career with practical roadmaps, interactive Indian salary benchmarks, and actionable blueprints—spanning <strong>Generative AI &amp; Agents, Cloud Platform IaC, EV &amp; Battery Systems, Modern No-Code, and UI/UX Design Systems</strong>.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link 
                href="/tools/career-compass"
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-glow-btn hover:scale-105 transition-all flex items-center gap-2.5"
              >
                <span>Take Career Compass Free</span>
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </Link>
              
              <a 
                href="#skills-catalog" 
                className="px-7 py-3.5 rounded-full glass-card hover:bg-slate-800/80 text-white font-semibold text-xs sm:text-sm transition-all border border-slate-700"
              >
                Explore Tracks
              </a>
            </div>

            {/* Live Metric Stats Bar */}
            <div className="pt-8 grid grid-cols-3 gap-4 border-t border-slate-800/80 max-w-lg">
              <div>
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mb-1">
                  <Bookmark className="w-3.5 h-3.5 text-purple-400" />
                  <span>{trackCount} Tracks</span>
                </div>
                <p className="text-xs text-slate-300 font-medium">Free Career Guides</p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mb-1">
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Open access</span>
                </div>
                <p className="text-xs text-slate-300 font-medium">For Indian Learners</p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mb-1">
                  <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Source-linked</span>
                </div>
                <p className="text-xs text-slate-300 font-medium">Salary Explorer</p>
              </div>
            </div>

          </div>

          {/* Right Column: Dynamic Visual Showcase */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            
            <div className="relative w-full max-w-lg flex gap-4 items-center">
              
              {/* Left Image Box */}
              <div className="relative w-1/2 space-y-3">
                <div className="hero-img-box-1 p-2 pb-0 overflow-hidden shadow-2xl relative border border-white/20">
                  <img 
                    src="/images/hero-learner-avatar.jpg" 
                    alt="Young Indian Learner Avatar" 
                    className="w-full h-72 object-cover object-top rounded-t-2xl filter contrast-105"
                  />
                  <div className="absolute top-3 left-3 bg-purple-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-white border border-purple-500/40">
                    ⚡ 2026 Ready
                  </div>
                </div>

                {/* Mentor Card */}
                <div className="glass-card p-2.5 rounded-2xl flex items-center gap-2.5 border border-white/10 bg-[#161926]/90 backdrop-blur-md">
                  <img 
                    src="/images/hero-mentor-avatar.jpg" 
                    alt="Ananya Verma Mentor Avatar" 
                    className="w-11 h-11 rounded-xl object-cover border border-purple-400/40 shrink-0"
                  />
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-bold text-white truncate">Ananya Verma</h4>
                    <p className="text-[10px] text-purple-300 truncate">Lead Data Architect</p>
                    <div className="flex items-center text-amber-400 text-[9px] gap-0.5 mt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-2.5 h-2.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Image Box */}
              <div className="relative w-1/2 space-y-3">
                <div className="hero-img-box-2 p-2 pb-0 overflow-hidden shadow-2xl relative border border-white/20">
                  
                  {/* Slanted Frosted Tag */}
                  <div className="absolute bottom-6 right-2 left-2 z-20">
                    <div className="glass-tag px-3 py-1.5 rounded-full flex items-center justify-center gap-1.5 text-[10px] font-bold text-white shadow-lg backdrop-blur-md">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-300" />
                      <span>Personalized Learning Paths</span>
                    </div>
                  </div>

                  <img 
                    src="/images/hero-student-avatar.jpg" 
                    alt="Female Tech Student Avatar" 
                    className="w-full h-80 object-cover object-top rounded-b-2xl filter contrast-105"
                  />
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* VIRTUAL & INTERACTIVE LABS SHOWCASE                                       */}
      {/* ========================================================================= */}
      <section className="py-14 px-4 sm:px-6 lg:px-10 border-t border-purple-500/20 bg-gradient-to-b from-purple-950/20 via-[#0d101e] to-slate-950/30 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold mb-2">
                <FlaskConical className="w-3.5 h-3.5 text-purple-400" />
                <span>Zero-Setup Interactive Workspaces</span>
                <span className="w-1 h-1 rounded-full bg-purple-400" />
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-extrabold">30 Labs</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                Virtual &amp; Interactive Practice Labs
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Test concepts through deterministic browser simulations. Instant objective evaluation against standard 60/25/15 rubrics, authored hints, and exportable portfolio reports.
              </p>
            </div>

            <Link
              href="/labs"
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-glow-btn flex items-center gap-2 shrink-0 transition-all self-start md:self-auto"
            >
              <span>Explore All 30 Labs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Showcase 1: Marketing Budget Simulator */}
            <div className="p-6 rounded-3xl bg-[#13172b] border border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 flex flex-col justify-between group shadow-xl">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-mono text-[10px] font-extrabold uppercase">
                    Lab 19 • Digital Marketing
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    Live Pilot
                  </span>
                </div>
                <h3 className="text-lg font-black text-white group-hover:text-purple-300 transition-colors">
                  Marketing Budget Simulator
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Allocate 100k credits across Meta, Google Search, and LinkedIn. Test creative variants, advance simulated days, and hit 150 qualified leads below 700 CPL.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400">Budget Sliders</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400">Funnel CPM/CTR</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400">30-Day Clock</span>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">20 mins • 3 Tiers</span>
                <Link
                  href="/labs/marketing-budget-simulator"
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 group-hover:bg-purple-600 text-slate-200 group-hover:text-white text-xs font-bold transition-all flex items-center gap-1"
                >
                  <span>Launch Simulator</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Showcase 2: SEO Snapshot Audit Lab */}
            <div className="p-6 rounded-3xl bg-[#13172b] border border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 flex flex-col justify-between group shadow-xl">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-mono text-[10px] font-extrabold uppercase">
                    Lab 20 • SEO &amp; Growth
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    Live Pilot
                  </span>
                </div>
                <h3 className="text-lg font-black text-white group-hover:text-purple-300 transition-colors">
                  SEO Snapshot Audit Lab
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Audit a 20-page fictional site snapshot. Eliminate duplicate title tags, author missing descriptions, re-link orphan pages, and repair dead 404 links.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400">20-Page Tree</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400">SERP Preview</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400">Orphan Linker</span>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">20 mins • 3 Tiers</span>
                <Link
                  href="/labs/seo-snapshot-audit-lab"
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 group-hover:bg-purple-600 text-slate-200 group-hover:text-white text-xs font-bold transition-all flex items-center gap-1"
                >
                  <span>Launch Audit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Showcase 3: Executive Office Prioritization Lab */}
            <div className="p-6 rounded-3xl bg-[#13172b] border border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 flex flex-col justify-between group shadow-xl">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-mono text-[10px] font-extrabold uppercase">
                    Lab 29 • Executive Office
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    Live Pilot
                  </span>
                </div>
                <h3 className="text-lg font-black text-white group-hover:text-purple-300 transition-colors">
                  Executive Office Prioritization
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Triage incoming executive mail via Eisenhower Matrix, resolve overlapping Wednesday board &amp; client meeting conflicts, and enforce travel policies.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400">Inbox Triage</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400">Calendar Conflicts</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400">Handover Memo</span>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">20 mins • 3 Tiers</span>
                <Link
                  href="/labs/executive-office-prioritization-lab"
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 group-hover:bg-purple-600 text-slate-200 group-hover:text-white text-xs font-bold transition-all flex items-center gap-1"
                >
                  <span>Launch Triage</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* NEW HIGH-DEMAND SUBJECT DOMAINS SHOWCASE */}
      <section className="py-12 px-4 sm:px-6 lg:px-10 border-t border-slate-800/80 bg-slate-950/20">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>2026 Core Subject Domains</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                High-Demand Career Tracks by Domain
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Explore specialized career clusters designed for high hiring growth, remote USD compensation, and industrial transformation.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categoryDomains.map((cat) => (
              <Link 
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="glass-card p-6 rounded-3xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 hover:shadow-2xl bg-gradient-to-b from-[#14182b]/80 to-[#0e1120]/90"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center border border-slate-800 group-hover:scale-105 transition-transform">
                      {domainIcons[cat.slug] || <Layers className="w-5 h-5 text-purple-400" />}
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                      {cat.cagrGrowth}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {cat.shortDesc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-400 font-bold">
                    {cat.averageSalary}
                  </span>
                  <span className="text-xs font-bold text-purple-400 group-hover:text-purple-300 flex items-center gap-1">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* Comprehensive Skills Directory Catalog with Client-Side Filtering */}
      <HomeClientCatalog skills={allSkillsList} />

      {/* Interactive Indian Salary & ROI Chart.js Visualization */}
      <SalaryExplorer />

      {/* Step-by-Step Learning Roadmaps Section */}
      <HomeRoadmapTabs />

      {/* Free Curated Cheat Sheets Section */}
      <CheatSheetSection />

    </>
  );
}
