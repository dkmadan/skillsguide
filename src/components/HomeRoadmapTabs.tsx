'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { roadmapsData } from '@/data/roadmapsData';
import { MapPin, ArrowRight, Clock, Target } from 'lucide-react';
import BookmarkButton from './BookmarkButton';

export default function HomeRoadmapTabs() {
  const [activeTab, setActiveTab] = useState<string>('data-analytics-plan');

  const activeRoadmap = roadmapsData.find(r => r.slug === activeTab) || roadmapsData[0];

  return (
    <section id="roadmaps" className="py-16 px-4 sm:px-6 lg:px-10 border-t border-[#E4E0D4] bg-[#F7F5EF] relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF8E7] border border-[#F2B33D]/40 text-[#9A5B00] text-xs font-semibold mb-3">
            <MapPin className="w-3.5 h-3.5 text-[#9A5B00]" />
            <span>Structured Career Execution</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0F1E4A] tracking-tight">
            Curated 3-Phase Indian Learning Roadmaps
          </h2>
          <p className="text-[#555] text-xs sm:text-sm mt-2">
            No passive tutorial bingeing. Each blueprint includes exact weekly milestones and real-world project proof ideas.
          </p>
        </div>

        {/* Roadmap Tab Switcher */}
        <div className="flex justify-start sm:justify-center overflow-x-auto pb-3 gap-2 mb-8 text-xs font-bold">
          {roadmapsData.slice(0, 4).map(r => (
            <button
              key={r.slug}
              onClick={() => setActiveTab(r.slug)}
              className={`px-5 py-2.5 rounded-full whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === r.slug
                  ? 'bg-[#0F1E4A] text-[#F2B33D] shadow-sm'
                  : 'bg-white text-[#555] hover:text-[#0F1E4A] hover:bg-[#FAF8F3] border border-[#E4E0D4]'
              }`}
            >
              <span>{r.title.split(' ')[0]} {r.title.split(' ')[1]} Plan</span>
            </button>
          ))}
        </div>

        {/* Active Roadmap Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E4E0D4] shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E4E0D4] gap-4 mb-6">
            <div>
              <h3 className="text-xl font-serif font-bold text-[#0F1E4A]">{activeRoadmap.title}</h3>
              <p className="text-xs text-[#555] mt-0.5">Target Role: {activeRoadmap.targetRole}</p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="inline-flex items-center text-xs font-bold text-[#9A5B00] bg-[#FFF8E7] px-3 py-1 rounded-full border border-[#F2B33D]/40 gap-1">
                <Clock className="w-3.5 h-3.5 text-[#9A5B00]" />
                <span>⏱ {activeRoadmap.weeklyCommitment}</span>
              </span>
              <BookmarkButton slug={activeRoadmap.slug} title={activeRoadmap.title} variant="button" />
            </div>
          </div>

          {/* Phases Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {activeRoadmap.phases.map((phase, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-[#FAF8F3] border border-[#E4E0D4] flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0F1E4A] bg-[#0F1E4A]/10 px-2 py-0.5 rounded">
                    {phase.duration}
                  </span>
                  <h4 className="text-sm font-serif font-bold text-[#0F1E4A] mt-2.5">{phase.phaseTitle}</h4>
                  <ul className="text-xs text-[#555] space-y-2 mt-3 list-disc list-inside">
                    {phase.milestones.slice(0, 3).map((item, i) => (
                      <li key={i} className="leading-relaxed">{item}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-4 pt-3 border-t border-[#E4E0D4] text-[11px] text-emerald-800 font-semibold flex items-start gap-1.5">
                  <Target className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Project:</strong> {phase.projectIdea}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Link to Full Blueprint Page */}
          <div className="pt-4 border-t border-[#E4E0D4] flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-[#555]">
              Verified for 2026 hiring standards across Indian IT, GCCs, and startups.
            </p>
            <div className="flex items-center gap-3">
              <Link 
                href={`/roadmaps/${activeRoadmap.slug}`}
                className="px-6 py-2.5 rounded-full bg-[#F2B33D] hover:bg-[#E09F26] text-[#0F1E4A] text-xs font-bold shadow-sm flex items-center gap-2 transition-all"
              >
                <span>View Full Weekly Syllabus &amp; Resources</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
