'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { roadmapsData } from '@/data/roadmapsData';
import { MapPin, ArrowRight, CheckCircle2, Clock, Target } from 'lucide-react';

export default function HomeRoadmapTabs() {
  const [activeTab, setActiveTab] = useState<string>('data-analytics-plan');

  const activeRoadmap = roadmapsData.find(r => r.slug === activeTab) || roadmapsData[0];

  return (
    <section id="roadmaps" className="py-16 px-4 sm:px-6 lg:px-10 border-t border-slate-800/80 bg-slate-950/50 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-semibold mb-3">
            <MapPin className="w-3.5 h-3.5" />
            <span>Structured Career Execution</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Curated 3-Phase Indian Learning Roadmaps
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-2">
            No passive tutorial bingeing. Each blueprint includes exact weekly milestones and real-world project proof ideas.
          </p>
        </div>

        {/* Roadmap Tab Switcher */}
        <div className="flex justify-start sm:justify-center overflow-x-auto pb-3 gap-2 mb-8 text-xs font-bold">
          {roadmapsData.slice(0, 4).map(r => (
            <button
              key={r.slug}
              onClick={() => setActiveTab(r.slug)}
              className={`px-5 py-2.5 rounded-full whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === r.slug
                  ? 'bg-purple-600 text-white shadow-glow-btn'
                  : 'glass-card text-slate-300 hover:bg-slate-800 border border-slate-700'
              }`}
            >
              <span>{r.title.split(' ')[0]} {r.title.split(' ')[1]} Plan</span>
            </button>
          ))}
        </div>

        {/* Active Roadmap Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2 mb-6">
            <div>
              <h3 className="text-xl font-black text-white">{activeRoadmap.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">Target Role: {activeRoadmap.targetRole}</p>
            </div>
            <span className="inline-flex items-center text-xs font-bold text-purple-300 bg-purple-500/20 px-3 py-1 rounded-full border border-purple-500/30 self-start sm:self-auto gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>⏱ {activeRoadmap.weeklyCommitment}</span>
            </span>
          </div>

          {/* Phases Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {activeRoadmap.phases.map((phase, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded">
                    {phase.duration}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-2.5">{phase.phaseTitle}</h4>
                  <ul className="text-xs text-slate-300 space-y-2 mt-3 list-disc list-inside">
                    {phase.milestones.slice(0, 3).map((item, i) => (
                      <li key={i} className="leading-relaxed">{item}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-emerald-400 font-semibold flex items-start gap-1.5">
                  <Target className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Project:</strong> {phase.projectIdea}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Link to Full Blueprint Page */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-400">
              Verified for 2026 hiring standards across Indian IT, GCCs, and startups.
            </p>
            <Link 
              href={`/roadmaps/${activeRoadmap.slug}`}
              className="px-6 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-glow-btn flex items-center gap-2 transition-all"
            >
              <span>View Full Weekly Syllabus & Resources</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
