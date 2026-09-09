import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { toolAlternativesData, toolCategories } from "@/data/toolAlternativesData";
import { 
  Layers, 
  ArrowRight, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  DollarSign, 
  Cpu, 
  Code2, 
  Server,
  Zap,
  Star
} from "lucide-react";
import BookmarkButton from "@/components/BookmarkButton";

export const metadata: Metadata = {
  title: "Top Software & Tool Alternatives Matrix (2025) | SkillsGuide",
  description: "Explore top free, open-source, self-hosted, small business, and developer-friendly alternatives to Figma, Jira, Tableau, GitHub, ChatGPT, WordPress, and more.",
  keywords: [
    "software alternatives",
    "figma alternatives",
    "jira alternatives",
    "tableau alternatives",
    "github alternatives",
    "chatgpt alternatives",
    "open source software",
    "free tool alternatives"
  ],
  alternates: {
    canonical: "https://skillsguide.in/tools/alternatives",
  },
};

export default function ToolsAlternativesHubPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Hero */}
        <div className="relative rounded-3xl bg-gradient-to-br from-emerald-950/70 via-slate-900 to-cyan-950/50 border border-emerald-500/20 p-8 sm:p-12 overflow-hidden shadow-2xl backdrop-blur-xl">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide uppercase">
              <Layers className="w-4 h-4" />
              Software Alternatives Engine
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Top <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Free & Open-Source Alternatives</span> to Industry Tools
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Find the perfect replacement for expensive proprietary tools. Compare features, pricing, open-source options, self-hosted deployment models, and developer ergonomics across design, dev, BI, and AI suites.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-white/5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                {toolAlternativesData.length}+ Comprehensive Tool Matrices
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-white/5">
                <Server className="w-3.5 h-3.5 text-cyan-400" />
                Self-Hosted & Privacy Tested
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-white/5">
                <DollarSign className="w-3.5 h-3.5 text-yellow-400" />
                100% Free Tiers Identified
              </span>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        {toolCategories.map((categoryLabel) => {
          const tools = toolAlternativesData.filter(t => t.categoryLabel === categoryLabel);
          if (tools.length === 0) return null;

          return (
            <div key={categoryLabel} className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-7 rounded-full bg-gradient-to-b from-emerald-500 to-cyan-500" />
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                    {categoryLabel}
                  </h2>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-900 border border-white/10 text-slate-400">
                  {tools.length} Tool Hubs
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.map((tool) => (
                  <div 
                    key={tool.slug}
                    className="group relative rounded-2xl bg-slate-900/70 border border-white/10 p-6 hover:border-emerald-500/40 hover:bg-slate-900/90 transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-emerald-950/40"
                  >
                    <div className="space-y-4">
                      {/* Header & Badges */}
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          {tool.categoryLabel}
                        </span>
                        <BookmarkButton 
                          slug={`tool-alt-${tool.slug}`} 
                          title={`${tool.toolName} Alternatives`} 
                        />
                      </div>

                      {/* Title */}
                      <Link href={`/tools/${tool.slug}/alternatives`} className="block group-hover:text-emerald-300 transition-colors">
                        <h3 className="text-xl font-bold text-white leading-snug">
                          {tool.toolName} Alternatives
                        </h3>
                      </Link>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {tool.overview}
                      </p>

                      {/* Top Alternatives Preview Badges */}
                      <div className="space-y-2 pt-2 border-t border-white/5">
                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                          Top Replacements ({tool.alternatives.length}):
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {tool.alternatives.slice(0, 4).map((alt) => (
                            <span 
                              key={alt.name}
                              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-950 border border-white/10 text-slate-300 flex items-center gap-1"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              {alt.name}
                            </span>
                          ))}
                          {tool.alternatives.length > 4 && (
                            <span className="text-[11px] px-2 py-1 rounded-lg bg-slate-950/50 text-slate-400 font-mono">
                              +{tool.alternatives.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Search Intent Variations Quick Links */}
                      <div className="pt-2">
                        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5">Search Intent Angles:</p>
                        <div className="flex flex-wrap gap-1">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-500/20">Free</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/40 text-cyan-300 border border-cyan-500/20">Open-Source</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950/40 text-purple-300 border border-purple-500/20">Self-Hosted</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-500/20">Small Biz</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Link */}
                    <div className="pt-5 mt-4 border-t border-white/5">
                      <Link
                        href={`/tools/${tool.slug}/alternatives`}
                        className="inline-flex items-center justify-between w-full text-xs font-semibold text-emerald-400 group-hover:text-emerald-300 transition-colors"
                      >
                        <span>Explore Full Matrix & Pricing</span>
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
        <div className="rounded-2xl bg-gradient-to-r from-emerald-900/40 via-teal-900/30 to-slate-900 border border-white/10 p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl font-bold text-white">Compare Technologies & Programming Stacks</h3>
            <p className="text-sm text-slate-300 max-w-xl">
              Compare programming languages, web frameworks, and cloud architectures side-by-side.
            </p>
          </div>
          <Link
            href="/compare"
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-600/30 whitespace-nowrap"
          >
            Explore Skill Comparisons →
          </Link>
        </div>
      </div>
    </div>
  );
}
