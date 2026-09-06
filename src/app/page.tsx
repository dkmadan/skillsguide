import React from 'react';
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
  Layers
} from 'lucide-react';

export default function HomePage() {
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SkillsGuide.in',
    url: 'https://skillsguide.in',
    description: 'India\'s leading career skilling and roadmap platform with verified salary benchmarks.',
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
              Upgrade your career with expert-verified roadmaps, interactive Indian salary benchmarks, and actionable blueprints—spanning <strong>Generative AI &amp; Agents, Cloud Platform IaC, EV &amp; Battery Systems, Modern No-Code, and UI/UX Design Systems</strong>.
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
                  <span>45+ Tracks</span>
                </div>
                <p className="text-xs text-slate-300 font-medium">Free Career Guides</p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mb-1">
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  <span>140k+</span>
                </div>
                <p className="text-xs text-slate-300 font-medium">Indian Learners</p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mb-1">
                  <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                  <span>₹6L - ₹35L</span>
                </div>
                <p className="text-xs text-slate-300 font-medium">Verified CTC Range</p>
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

                {/* Placement Rate Badge */}
                <div className="glass-card px-3 py-2 rounded-xl flex items-center justify-between text-[11px] border border-white/10 bg-[#161926]/90 backdrop-blur-md">
                  <span className="text-slate-300 font-medium">Placement Rate</span>
                  <span className="text-emerald-400 font-extrabold">91.4% Proven</span>
                </div>
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
