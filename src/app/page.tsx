import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { allSkillsList } from '@/data/skillsData';
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
  FileCheck
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
              <span>E-Learning & High-ROI Skilling Platform</span>
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
              Upgrade your career with expert-verified roadmaps, interactive Indian salary benchmarks, and actionable skills—spanning <strong>AI Automation, Data Analytics, Full-Stack, Tally GST, Remote Freelancing, and Creator Tools</strong>.
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
                  <span>30+ Tracks</span>
                </div>
                <p className="text-xs text-slate-300 font-medium">Free Career Guides</p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mb-1">
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  <span>120k+</span>
                </div>
                <p className="text-xs text-slate-300 font-medium">Indian Learners</p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mb-1">
                  <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                  <span>₹6L - ₹28L</span>
                </div>
                <p className="text-xs text-slate-300 font-medium">Verified CTC Range</p>
              </div>
            </div>

          </div>

          {/* Right Column: Asymmetrical Collage with Cutouts & Floating Glass Badges */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[480px]">
            
            {/* Collage Container */}
            <div className="relative w-full max-w-lg flex items-end justify-center gap-4">
              
              {/* Left Image Box */}
              <div className="relative w-1/2 space-y-3">
                <div className="hero-img-box-1 p-3 pb-0 overflow-hidden shadow-2xl relative border border-white/20">
                  <img 
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80" 
                    alt="Indian Tech Learner" 
                    className="w-full h-64 object-cover object-top rounded-b-2xl filter contrast-105"
                  />
                </div>

                {/* Floating Mentor Badge */}
                <div className="glass-card p-3 rounded-2xl border border-white/10 shadow-floating flex items-center gap-3 bg-[#161926]/90 backdrop-blur-md">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
                    alt="Mentor" 
                    className="w-10 h-10 rounded-xl object-cover border border-purple-400/40"
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
                <div className="hero-img-box-2 p-3 pb-0 overflow-hidden shadow-2xl relative border border-white/20">
                  
                  {/* Slanted Frosted Tag */}
                  <div className="absolute bottom-6 right-2 left-2 z-20">
                    <div className="glass-tag px-3 py-1.5 rounded-full flex items-center justify-center gap-1.5 text-[10px] font-bold text-white shadow-lg backdrop-blur-md">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-300" />
                      <span>Personalized Learning Paths</span>
                    </div>
                  </div>

                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80" 
                    alt="Student" 
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
