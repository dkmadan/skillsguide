'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SkillDetail } from '@/data/skillsData';
import { 
  Bookmark, 
  ArrowRight, 
  Search, 
  Sparkles, 
  Zap, 
  Layers,
  Building,
  CheckCircle2
} from 'lucide-react';

interface HomeClientCatalogProps {
  skills: SkillDetail[];
}

export default function HomeClientCatalog({ skills }: HomeClientCatalogProps) {
  const [filter, setFilter] = useState<string>('all');
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('skillsguide_bookmarks');
      if (stored) setSavedSlugs(JSON.parse(stored));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleToggleBookmark = (slug: string) => {
    let updated: string[];
    if (savedSlugs.includes(slug)) {
      updated = savedSlugs.filter(s => s !== slug);
      showToast('Roadmap removed from saved drawer');
    } else {
      updated = [...savedSlugs, slug];
      showToast('Roadmap saved to study drawer!');
    }
    setSavedSlugs(updated);
    try {
      localStorage.setItem('skillsguide_bookmarks', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('toggle-bookmark', { detail: { slug } }));
    } catch (e) {
      console.error(e);
    }
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const filteredSkills = skills.filter(skill => {
    if (filter === 'all') return true;
    if (filter === 'tech') return skill.category === 'tech';
    if (filter === 'business') return skill.category === 'business';
    if (filter === 'vocational') return skill.category === 'vocational';
    if (filter === 'fresher') return skill.experienceLevel === 'Fresher Friendly';
    return true;
  });

  return (
    <section id="skills-catalog" className="py-16 px-4 sm:px-6 lg:px-10 border-t border-slate-800/80 bg-slate-950/40 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>Verified 2026 Industry Blueprints</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Comprehensive Career Skilling Tracks
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Explore High-Demand Tech, Business, Freelancing, and Vocational opportunities tailored for Indian aspirants.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'All Tracks', value: 'all' },
              { label: 'High-Demand Tech', value: 'tech' },
              { label: 'Business & Remote', value: 'business' },
              { label: 'Vocational & Non-IT', value: 'vocational' },
              { label: 'Fresher Friendly', value: 'fresher' }
            ].map(tab => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`px-4 py-2 text-xs rounded-full font-bold transition-all ${
                  filter === tab.value
                    ? 'bg-purple-600 text-white shadow-glow-btn'
                    : 'glass-card text-slate-300 hover:bg-slate-800 border border-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map(skill => {
            const isSaved = savedSlugs.includes(skill.slug);
            return (
              <div 
                key={skill.slug}
                className="glass-card rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none"></div>

                <div>
                  {/* Top Bar: Badge & Bookmark */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                      {skill.categoryLabel}
                    </span>
                    <button
                      onClick={() => handleToggleBookmark(skill.slug)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isSaved ? 'text-purple-400' : 'text-slate-500 hover:text-purple-300'
                      }`}
                      title={isSaved ? 'Remove from saved' : 'Save roadmap'}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-purple-400' : ''}`} />
                    </button>
                  </div>

                  {/* Title & Tools */}
                  <div className="mb-3">
                    <Link href={`/skills/${skill.slug}`} className="block group-hover:text-purple-300 transition-colors">
                      <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                        {skill.title}
                      </h3>
                    </Link>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {skill.tools.slice(0, 4).join(', ')}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-3">
                    {skill.shortDesc}
                  </p>

                  {/* Highlights Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {skill.tools.slice(0, 3).map((tool, i) => (
                      <span key={i} className="text-[10px] font-medium px-2 py-0.5 bg-slate-800/80 text-slate-300 rounded-md border border-slate-700/50">
                        {tool}
                      </span>
                    ))}
                    <span className="text-[10px] font-medium px-2 py-0.5 bg-purple-500/10 text-purple-300 rounded-md border border-purple-500/20">
                      {skill.experienceLevel}
                    </span>
                  </div>

                  {/* Metrics Table */}
                  <div className="space-y-1.5 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
                    <div className="flex justify-between">
                      <span>India Salary Range:</span>
                      <strong className="text-emerald-400 font-bold">{skill.salaryRange}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Learning Timeline:</span>
                      <strong className="text-slate-200">{skill.timelineWeeks}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Top Hiring Hubs:</span>
                      <strong className="text-slate-200 truncate max-w-[140px] text-right">
                        {skill.topCities.slice(0, 2).join(', ')}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Card Footer CTA */}
                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    <span>{skill.hiringVolume}</span>
                  </span>
                  <Link 
                    href={`/skills/${skill.slug}`}
                    className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
                  >
                    <span>View Blueprint</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

              </div>
            );
          })}
        </div>

        {/* Toast feedback */}
        {toastMsg && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-700 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom-5 duration-200">
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
            <span>{toastMsg}</span>
          </div>
        )}

      </div>
    </section>
  );
}
