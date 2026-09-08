'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SkillDetail } from '@/data/skillsData';
import { 
  Bookmark, 
  ArrowRight, 
  Search, 
  Sparkles, 
  Zap, 
  Layers,
  Building,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface HomeClientCatalogProps {
  skills: SkillDetail[];
}

export default function HomeClientCatalog({ skills }: HomeClientCatalogProps) {
  const [filter, setFilter] = useState<string>('all');
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    const syncBookmarks = () => {
      try {
        const stored = localStorage.getItem('skillsguide_bookmarks');
        if (stored) setSavedSlugs(JSON.parse(stored));
        else setSavedSlugs([]);
      } catch (e) {
        console.error(e);
      }
    };

    syncBookmarks();

    const handleBookmarkEvent = () => {
      syncBookmarks();
    };

    window.addEventListener('toggle-bookmark' as any, handleBookmarkEvent);
    window.addEventListener('storage', syncBookmarks);

    return () => {
      window.removeEventListener('toggle-bookmark' as any, handleBookmarkEvent);
      window.removeEventListener('storage', syncBookmarks);
    };
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
    if (filter === 'emerging-tech') return skill.category === 'emerging-tech' || skill.domainSlug === 'emerging-tech-ai';
    if (filter === 'growth-nocode') return skill.category === 'growth-nocode' || skill.domainSlug === 'business-growth-nocode';
    if (filter === 'creative-media') return skill.category === 'creative-media' || skill.domainSlug === 'creative-design-media';
    if (filter === 'green-tech') return skill.category === 'green-tech' || skill.domainSlug === 'green-tech-sustainability';
    if (filter === 'tech') return skill.category === 'tech' || skill.category === 'emerging-tech';
    if (filter === 'business') return skill.category === 'business' || skill.category === 'growth-nocode';
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
              High-Demand Skill Tracks &amp; Blueprints
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Explore Emerging Tech, AI Engineering, Modern No-Code, Creative Media, and Green Tech tracks tailored for Indian aspirants.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'All Tracks', value: 'all' },
              { label: 'Emerging Tech & AI', value: 'emerging-tech' },
              { label: 'Business & No-Code', value: 'growth-nocode' },
              { label: 'Creative & Design', value: 'creative-media' },
              { label: 'Green Tech & EV', value: 'green-tech' },
              { label: 'Core IT & Data', value: 'tech' },
              { label: 'Fresher Friendly', value: 'fresher' }
            ].map(tab => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`px-3.5 py-1.5 text-xs rounded-full font-bold transition-all ${
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
                className="glass-card rounded-3xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden hover:border-purple-500/50 hover:shadow-2xl hover:-translate-y-1 bg-[#101323]/80"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none"></div>

                <div>
                  {/* Visual Card Image Preview */}
                  {skill.heroImage && (
                    <div className="relative h-36 w-full rounded-2xl overflow-hidden border border-slate-800 mb-4">
                      <Image 
                        src={skill.heroImage}
                        alt={skill.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#101323] via-transparent to-transparent"></div>
                      <div className="absolute top-2.5 left-2.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-slate-900/90 text-purple-300 border border-purple-500/30 backdrop-blur-md">
                          {skill.categoryLabel}
                        </span>
                      </div>
                      <button
                        onClick={() => handleToggleBookmark(skill.slug)}
                        className={`absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-slate-900/80 backdrop-blur-md transition-colors ${
                          isSaved ? 'text-purple-400' : 'text-slate-400 hover:text-purple-300'
                        }`}
                        title={isSaved ? 'Remove from saved' : 'Save roadmap'}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-purple-400' : ''}`} />
                      </button>
                    </div>
                  )}

                  {/* Title & Tools */}
                  <div className="mb-2.5">
                    <Link href={`/skills/${skill.slug}`} className="block group-hover:text-purple-300 transition-colors">
                      <h3 className="text-base font-bold text-white leading-snug">
                        {skill.title}
                      </h3>
                    </Link>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {skill.tools.slice(0, 4).join(', ')}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-2">
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
                      <span>Expected Salary:</span>
                      <strong className="text-emerald-400 font-bold">{skill.salaryRange}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Timeline:</span>
                      <strong className="text-slate-200">{skill.timelineWeeks}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Top Hubs:</span>
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
                    className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors group-hover:translate-x-0.5"
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
