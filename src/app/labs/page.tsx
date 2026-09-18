'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { allLabsCatalog, LAB_DOMAINS } from '@/data/labsCatalog';
import { LabDomain, LabDifficulty } from '@/lib/labs/types';
import { 
  Sparkles, 
  Search, 
  Clock, 
  Layers, 
  ArrowRight, 
  ShieldCheck, 
  Award, 
  Database, 
  Cpu, 
  Server, 
  TrendingUp, 
  Briefcase,
  SlidersHorizontal,
  CheckCircle2,
  FileCheck
} from 'lucide-react';

export default function LabsCatalogPage() {
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const filteredLabs = useMemo(() => {
    return allLabsCatalog.filter(lab => {
      // Domain filter
      if (selectedDomain !== 'all' && lab.domain !== selectedDomain) {
        return false;
      }
      // Difficulty filter
      if (selectedDifficulty !== 'all' && !lab.difficultyTiers.includes(selectedDifficulty as LabDifficulty)) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = lab.title.toLowerCase().includes(q);
        const matchesSummary = lab.summary.toLowerCase().includes(q);
        const matchesSkills = lab.skills.some(s => s.toLowerCase().includes(q));
        const matchesTools = lab.toolsSimulated.some(t => t.toLowerCase().includes(q));
        return matchesTitle || matchesSummary || matchesSkills || matchesTools;
      }
      return true;
    });
  }, [selectedDomain, selectedDifficulty, searchQuery]);

  const domainIcons: Record<LabDomain, React.ReactNode> = {
    'data-analytics': <Database className="w-4 h-4 text-blue-400" />,
    'ai-engineering': <Cpu className="w-4 h-4 text-purple-400" />,
    'cloud-systems': <Server className="w-4 h-4 text-cyan-400" />,
    'product-growth': <TrendingUp className="w-4 h-4 text-amber-400" />,
    'business-workplace': <Briefcase className="w-4 h-4 text-emerald-400" />
  };

  return (
    <div className="min-h-screen bg-[#0d0f18] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span>Virtual &amp; Interactive Learning Labs (30 Simulations)</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Practice Real Scenarios with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400">
              Deterministic Simulations.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Zero setup, browser-based sandboxes with instant automated scoring, authoritative rubric feedback, and downloadable portfolio reports. From marketing budgets and SEO audits to SQL queries and executive office triage.
          </p>

          {/* Quick Metrics */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
              <span className="text-xl font-black text-white block">30 Labs</span>
              <span className="text-[11px] text-slate-400">Full Catalogue</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
              <span className="text-xl font-black text-purple-300 block">60 / 25 / 15</span>
              <span className="text-[11px] text-slate-400">Objective Rubric</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
              <span className="text-xl font-black text-emerald-300 block">Zero Setup</span>
              <span className="text-[11px] text-slate-400">Runs in Browser</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
              <span className="text-xl font-black text-cyan-300 block">PDF &amp; CSV</span>
              <span className="text-[11px] text-slate-400">Report Exports</span>
            </div>
          </div>
        </div>

        {/* Filters & Search Bar */}
        <div className="p-4 sm:p-5 rounded-3xl bg-[#121526] border border-white/10 space-y-4 shadow-xl">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search labs by title, tool, or skill (e.g. SQL, SEO, Budget, AI)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-black/40 border border-white/15 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50"
              />
            </div>

            {/* Difficulty Selector */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <span className="text-xs text-slate-400 font-semibold hidden sm:inline">Tier:</span>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-200 focus:outline-none focus:border-purple-500/50 cursor-pointer"
              >
                <option value="all" className="bg-[#0f1322]">All Tiers</option>
                <option value="beginner" className="bg-[#0f1322]">Beginner</option>
                <option value="intermediate" className="bg-[#0f1322]">Intermediate</option>
                <option value="challenge" className="bg-[#0f1322]">Challenge</option>
              </select>
            </div>

          </div>

          {/* Domain Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 scrollbar-none text-xs">
            <button
              onClick={() => setSelectedDomain('all')}
              className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedDomain === 'all'
                  ? 'bg-purple-600 text-white shadow-glow-btn'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              All 30 Labs
            </button>

            {LAB_DOMAINS.map((dom) => (
              <button
                key={dom.id}
                onClick={() => setSelectedDomain(dom.id)}
                className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedDomain === dom.id
                    ? 'bg-purple-600 text-white shadow-glow-btn'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300'
                }`}
              >
                {domainIcons[dom.id]}
                <span>{dom.title}</span>
              </button>
            ))}
          </div>

        </div>

        {/* Labs Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Showing <strong className="text-white">{filteredLabs.length}</strong> simulations</span>
            <span className="hidden sm:inline">Click any lab to launch its interactive workspace</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredLabs.map((lab) => (
              <div 
                key={lab.slug}
                className="rounded-3xl bg-[#111425] hover:bg-[#14182c] border border-white/10 hover:border-purple-500/40 p-5 flex flex-col justify-between transition-all group shadow-lg hover:shadow-2xl"
              >
                <div className="space-y-3">
                  
                  {/* Card Header: Lab Number & Domain */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-mono text-[10px] font-extrabold uppercase border border-purple-500/30">
                        Lab {String(lab.labNumber).padStart(2, '0')}
                      </span>
                      {lab.isPilot && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-extrabold uppercase border border-emerald-500/30 flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>Phase 1 Pilot</span>
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock className="w-3 h-3 text-purple-400" />
                      <span>{lab.timeMinutes}m</span>
                    </div>
                  </div>

                  {/* Title & Domain */}
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1">
                      {domainIcons[lab.domain]}
                      <span>{lab.domainTitle}</span>
                    </div>
                    <h2 className="text-base font-extrabold text-white group-hover:text-purple-300 transition-colors leading-snug">
                      {lab.title}
                    </h2>
                  </div>

                  {/* Summary */}
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {lab.summary}
                  </p>

                  {/* Simulated Tools Badges */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {lab.toolsSimulated.slice(0, 3).map((tool, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-slate-400 border border-white/5">
                        {tool}
                      </span>
                    ))}
                    {lab.toolsSimulated.length > 3 && (
                      <span className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] text-slate-500">
                        +{lab.toolsSimulated.length - 3}
                      </span>
                    )}
                  </div>

                </div>

                {/* Card CTA Footer */}
                <div className="pt-5 mt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {lab.difficultyTiers.map(d => (
                      <span key={d} className="w-1.5 h-1.5 rounded-full bg-purple-400" title={d} />
                    ))}
                    <span className="text-[10px] text-slate-400 ml-1">3 Tiers</span>
                  </div>

                  <Link
                    href={`/labs/${lab.slug}`}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-200 hover:text-white text-xs font-bold transition-all border border-purple-500/30 flex items-center gap-1 group-hover:gap-2 cursor-pointer"
                  >
                    <span>Launch Lab</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
