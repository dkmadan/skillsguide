import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { skillComparisonsList } from '@/data/skillComparisonsData';
import Breadcrumbs from '@/components/Breadcrumbs';
import { 
  GitCompare, 
  ArrowRight, 
  Sparkles, 
  Code2, 
  BrainCircuit, 
  Cloud, 
  ShieldCheck, 
  TrendingUp,
  Award
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Skill & Tech Comparisons (2026) | Side-by-Side In-Depth Guides',
  description: 'Compare high-demand programming languages, frameworks, cloud platforms, and tech skills. Objective metrics, Indian salary comparisons, learning curves, and beginner recommendations.',
  keywords: [
    'tech comparisons', 
    'python vs java', 
    'react vs angular', 
    'aws vs azure', 
    'data science vs data analytics', 
    'which skill to learn 2026'
  ]
};

export default function CompareDirectoryPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Compare Skills' }
  ];

  const categories = [
    { id: 'all', label: 'All Comparisons', icon: GitCompare },
    { id: 'programming', label: 'Programming & Software', icon: Code2 },
    { id: 'ai-data', label: 'AI, Data & Analytics', icon: BrainCircuit },
    { id: 'cloud-devops', label: 'Cloud & DevOps', icon: Cloud },
    { id: 'cybersecurity', label: 'Cybersecurity', icon: ShieldCheck },
    { id: 'career-emerging', label: 'Career & Emerging', icon: TrendingUp }
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto min-h-screen">
      <Breadcrumbs items={breadcrumbs} />

      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden mb-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>2026 Objective Career &amp; Technology Face-Offs</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Skill vs Skill <span className="text-purple-400">Comparisons</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Stop guessing which technology to master. Explore in-depth side-by-side breakdowns evaluating verified Indian salary ranges, learning timelines, coding &amp; math requirements, job demand, and beginner friendliness.
          </p>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="space-y-12">
        {categories.filter(c => c.id !== 'all').map(cat => {
          const items = skillComparisonsList.filter(item => item.category === cat.id);
          if (items.length === 0) return null;

          return (
            <section key={cat.id} className="space-y-6">
              <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                <cat.icon className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {cat.label}
                </h2>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {items.length} Guides
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map(item => (
                  <Link
                    key={item.slug}
                    href={`/compare/${item.slug}`}
                    className="glass-card rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-300 group relative flex flex-col justify-between hover:-translate-y-1 shadow-lg"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md bg-white/5 text-slate-300 border border-white/10">
                          {item.categoryLabel}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          {item.skillA.salaryIndia.split('–')[0]} vs {item.skillB.salaryIndia.split('–')[0]}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors mb-2">
                        {item.title}
                      </h3>

                      <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                        Compare {item.skillA.name} and {item.skillB.name}: learning curves, coding prerequisites, tools, and career recommendations.
                      </p>

                      <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] mb-4">
                        <div>
                          <strong className="text-purple-300 block truncate">{item.skillA.name}</strong>
                          <span className="text-slate-400">{item.skillA.timeWeeks}</span>
                        </div>
                        <div>
                          <strong className="text-indigo-300 block truncate">{item.skillB.name}</strong>
                          <span className="text-slate-400">{item.skillB.timeWeeks}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs font-bold text-purple-300 group-hover:text-purple-200">
                      <span>View Full Breakdown</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
