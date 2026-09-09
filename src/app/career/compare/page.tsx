import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { careerRoleComparisons, roleCategories } from "@/data/careerRoleComparisonsData";
import { 
  Users, 
  ArrowRight, 
  Search, 
  Briefcase, 
  TrendingUp, 
  DollarSign, 
  Scale, 
  Cpu, 
  Award,
  Sparkles,
  ShieldAlert
} from "lucide-react";
import BookmarkButton from "@/components/BookmarkButton";

export const metadata: Metadata = {
  title: "Career Role vs Role Comparisons & Pathways | SkillsGuide",
  description: "Comprehensive side-by-side career guides comparing daily responsibilities, salaries, entry difficulty, AI automation risk, and career ceiling across tech and business roles.",
  keywords: [
    "career comparison",
    "software engineer vs developer",
    "data analyst vs data scientist",
    "devops vs cloud engineer",
    "product manager vs project manager",
    "tech career paths",
    "salary comparison"
  ],
  alternates: {
    canonical: "https://skillsguide.in/career/compare",
  },
};

export default function CareerCompareHubPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Hero */}
        <div className="relative rounded-3xl bg-gradient-to-br from-indigo-950/70 via-slate-900 to-purple-950/50 border border-indigo-500/20 p-8 sm:p-12 overflow-hidden shadow-2xl backdrop-blur-xl">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold tracking-wide uppercase">
              <Users className="w-4 h-4" />
              Role vs Role Career Guides
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Compare <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">Tech & Business Careers</span> Side-by-Side
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Unsure which job title fits your strengths? Explore comprehensive breakdowns of daily responsibilities, workday routines, entry requirements, salary ladders, work-life balance, and AI automation risk.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-white/5">
                <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                {careerRoleComparisons.length}+ In-Depth Role Guides
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-white/5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                Verified Salary Ladders
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-white/5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                AI Automation Risk Index
              </span>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        {roleCategories.map((categoryLabel) => {
          const comparisons = careerRoleComparisons.filter(c => c.categoryLabel === categoryLabel);
          if (comparisons.length === 0) return null;

          return (
            <div key={categoryLabel} className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-7 rounded-full bg-gradient-to-b from-indigo-500 to-purple-500" />
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                    {categoryLabel}
                  </h2>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-900 border border-white/10 text-slate-400">
                  {comparisons.length} Comparisons
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {comparisons.map((item) => (
                  <div 
                    key={item.slug}
                    className="group relative rounded-2xl bg-slate-900/70 border border-white/10 p-6 hover:border-indigo-500/40 hover:bg-slate-900/90 transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-indigo-950/40"
                  >
                    <div className="space-y-4">
                      {/* Header & Badges */}
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                          {item.categoryLabel}
                        </span>
                        <BookmarkButton 
                          slug={`career-compare-${item.slug}`} 
                          title={`${item.roleA.title} vs ${item.roleB.title}`} 
                        />
                      </div>

                      {/* Title */}
                      <Link href={`/career/compare/${item.slug}`} className="block group-hover:text-indigo-300 transition-colors">
                        <h3 className="text-lg font-bold text-white leading-snug">
                          {item.roleA.title} <span className="text-indigo-400">vs</span> {item.roleB.title}
                        </h3>
                      </Link>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {item.roleA.summary}
                      </p>

                      {/* Side-by-Side Quick Metrics */}
                      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/5 text-[11px]">
                        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-white/5 space-y-1">
                          <p className="font-semibold text-slate-200 truncate">{item.roleA.title}</p>
                          <p className="text-emerald-400 font-bold">{item.roleA.salaryProgression.senior}</p>
                          <p className="text-slate-400 text-[10px]">Coding: <span className="text-slate-200">{item.roleA.codingRequirement}</span></p>
                        </div>
                        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-white/5 space-y-1">
                          <p className="font-semibold text-slate-200 truncate">{item.roleB.title}</p>
                          <p className="text-emerald-400 font-bold">{item.roleB.salaryProgression.senior}</p>
                          <p className="text-slate-400 text-[10px]">Coding: <span className="text-slate-200">{item.roleB.codingRequirement}</span></p>
                        </div>
                      </div>

                      {/* AI Risk & Work-Life Balance */}
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span className="flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3 text-amber-400" />
                          AI Risk: {item.roleA.aiAutomationRisk} vs {item.roleB.aiAutomationRisk}
                        </span>
                        <span className="text-slate-300 font-medium truncate max-w-[120px] text-right">
                          Best for: {item.roleA.entryDifficulty} Entry
                        </span>
                      </div>
                    </div>

                    {/* Footer Link */}
                    <div className="pt-5 mt-4 border-t border-white/5">
                      <Link
                        href={`/career/compare/${item.slug}`}
                        className="inline-flex items-center justify-between w-full text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 transition-colors"
                      >
                        <span>Full Role Breakdown & Verdict</span>
                        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Cross-Link Card */}
        <div className="rounded-2xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border border-white/10 p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl font-bold text-white">Looking for Technology & Skill Face-Offs?</h3>
            <p className="text-sm text-slate-300 max-w-xl">
              Compare programming languages, web frameworks, cloud providers, and analytics suites on learning curve and syntax.
            </p>
          </div>
          <Link
            href="/compare"
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30 whitespace-nowrap"
          >
            Explore Skill Comparisons →
          </Link>
        </div>
      </div>
    </div>
  );
}
