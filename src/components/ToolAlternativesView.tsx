"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ToolAlternativeMatrixItem, AlternativeProduct } from "@/data/toolAlternativesData";
import { 
  Layers, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  DollarSign, 
  Server, 
  Code2, 
  Building2, 
  Sparkles, 
  HelpCircle, 
  ShieldCheck, 
  ArrowRight,
  Filter,
  Check,
  Star,
  Zap,
  Globe
} from "lucide-react";
import BookmarkButton from "@/components/BookmarkButton";

interface ToolAlternativesViewProps {
  tool: ToolAlternativeMatrixItem;
  relatedTools: ToolAlternativeMatrixItem[];
}

type IntentFilter = "all" | "free" | "open-source" | "self-hosted" | "small-business" | "developers";

export default function ToolAlternativesView({ tool, relatedTools }: ToolAlternativesViewProps) {
  const [activeFilter, setActiveFilter] = useState<IntentFilter>("all");

  const filteredAlternatives = tool.alternatives.filter((item) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "free") return item.isFreeTierAvailable;
    if (activeFilter === "open-source") return item.isOpenSource;
    if (activeFilter === "self-hosted") return item.isSelfHosted;
    if (activeFilter === "small-business") return item.idealFor === "small-business" || item.idealFor === "all";
    if (activeFilter === "developers") return item.idealFor === "developers" || item.idealFor === "all";
    return true;
  });

  const intentTabs: { id: IntentFilter; label: string; icon: any }[] = [
    { id: "all", label: "All Alternatives", icon: Layers },
    { id: "free", label: "Free & Freemium", icon: DollarSign },
    { id: "open-source", label: "Open-Source", icon: Code2 },
    { id: "self-hosted", label: "Self-Hosted", icon: Server },
    { id: "small-business", label: "Small Business", icon: Building2 },
    { id: "developers", label: "For Developers", icon: Zap },
  ];

  return (
    <div className="space-y-12">
      {/* Search Intent Filter Bar */}
      <div className="rounded-2xl bg-slate-900/80 border border-white/10 p-4 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5 text-emerald-400" />
          Filter By Search Intent / Deployment Model:
        </div>
        <div className="flex flex-wrap gap-2">
          {intentTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 border border-emerald-400/30"
                    : "bg-slate-950/70 text-slate-300 hover:bg-slate-800 border border-white/5 hover:text-white"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-emerald-400"}`} />
                <span>{tab.label}</span>
                {isActive && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
                    {filteredAlternatives.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Alternatives Comparison Matrix Table */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Layers className="w-6 h-6 text-emerald-400" />
            <h2 className="text-2xl font-bold text-white tracking-wide">
              {tool.toolName} Alternatives Comparison Matrix
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Showing {filteredAlternatives.length} of {tool.alternatives.length} tools
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md shadow-xl">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-xs uppercase tracking-wider text-slate-400 border-b border-white/10">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold">Tool Name</th>
                <th scope="col" className="px-6 py-4 font-semibold">Pricing Model</th>
                <th scope="col" className="px-6 py-4 font-semibold text-center">Open Source</th>
                <th scope="col" className="px-6 py-4 font-semibold text-center">Self-Hosted</th>
                <th scope="col" className="px-6 py-4 font-semibold">Key Differentiator</th>
                <th scope="col" className="px-6 py-4 font-semibold">Best For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs sm:text-sm">
              {filteredAlternatives.map((alt) => (
                <tr key={alt.name} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-bold text-white">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>{alt.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-950 text-emerald-400 border border-emerald-500/20">
                      {alt.pricing}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {alt.isOpenSource ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                        YES
                      </span>
                    ) : (
                      <span className="text-slate-500 font-mono text-xs">NO</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {alt.isSelfHosted ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                        YES
                      </span>
                    ) : (
                      <span className="text-slate-500 font-mono text-xs">NO</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-300">{alt.bestDifferentiator}</td>
                  <td className="px-6 py-4 text-slate-200 font-medium capitalize">{alt.idealFor.replace('-', ' ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Deep Dive Cards for Each Alternative */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-emerald-400" />
          <h2 className="text-2xl font-bold text-white tracking-wide">
            Detailed Review of Top {tool.toolName} Alternatives
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {filteredAlternatives.map((alt, idx) => (
            <div 
              key={alt.name}
              className="rounded-3xl bg-slate-900/70 border border-white/10 p-6 sm:p-8 space-y-6 shadow-xl hover:border-emerald-500/30 transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center font-extrabold text-white text-base shadow-lg shadow-emerald-500/20">
                    #{idx + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                      <span>{alt.name}</span>
                      {alt.isOpenSource && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          Open Source
                        </span>
                      )}
                      {alt.isSelfHosted && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                          Self-Hostable
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Pricing: <span className="text-emerald-400 font-semibold">{alt.pricing}</span> • Rating: <span className="text-amber-400 font-semibold">{alt.ratingScore}/5.0</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <BookmarkButton 
                    slug={`alt-item-${alt.slug}`} 
                    title={`${alt.name} (${tool.toolName} Alternative)`} 
                  />
                  <a
                    href={alt.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all shadow-lg shadow-emerald-600/30"
                  >
                    <span>Visit Website</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Tagline / Differentiator */}
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                {alt.tagline} - {alt.bestDifferentiator}
              </p>

              {/* Strengths & Limitations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-3 p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/20">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Key Strengths & Advantages
                  </h4>
                  <ul className="space-y-2">
                    {alt.keyPros.map((pro, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3 p-5 rounded-2xl bg-rose-950/20 border border-rose-500/20">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-rose-400" />
                    Limitations & Trade-offs
                  </h4>
                  <ul className="space-y-2">
                    {alt.keyCons.map((con, cIdx) => (
                      <li key={cIdx} className="flex items-start gap-2 text-xs text-slate-300">
                        <span className="text-rose-400 font-bold shrink-0">•</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Look for Alternatives Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <HelpCircle className="w-6 h-6 text-emerald-400" />
          <h2 className="text-2xl font-bold text-white tracking-wide">
            Why Look for Alternatives to {tool.toolName}?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tool.mainDrawbacksOfTool.map((reason, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-center text-xs font-bold text-emerald-400">
                0{idx + 1}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
                {reason}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Selection Criteria / Advice Guide */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          <h2 className="text-2xl font-bold text-white tracking-wide">
            How to Choose the Right Alternative
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2">
            <h3 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              For Budget-Conscious Teams
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">{tool.selectionAdvice.budget}</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2">
            <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" />
              For Self-Hosting & Privacy
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">{tool.selectionAdvice.privacy}</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2">
            <h3 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-400" />
              For Developers & Engineering
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">{tool.selectionAdvice.developers}</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2">
            <h3 className="text-sm font-bold text-purple-300 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-purple-400" />
              For Business & Cross-Functional Teams
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">{tool.selectionAdvice.teams}</p>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <HelpCircle className="w-6 h-6 text-emerald-400" />
          <h2 className="text-2xl font-bold text-white tracking-wide">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {tool.faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="rounded-2xl bg-slate-900/60 border border-white/5 p-6 space-y-2"
            >
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="text-emerald-400 font-mono">Q:</span> {faq.question}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-5">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Tools Cross-Links */}
      {relatedTools.length > 0 && (
        <section className="space-y-6 pt-6 border-t border-white/10">
          <h3 className="text-lg font-bold text-white">
            Explore Other Tool Alternatives in {tool.categoryLabel}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedTools.map((rel) => (
              <Link
                key={rel.slug}
                href={`/tools/${rel.slug}/alternatives`}
                className="group block p-5 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-emerald-500/30 hover:bg-slate-900/90 transition-all"
              >
                <p className="text-xs text-emerald-400 font-medium">{rel.categoryLabel}</p>
                <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors mt-1">
                  {rel.toolName} Alternatives
                </h4>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                  Top replacements: {rel.alternatives.map(a => a.name).slice(0, 3).join(", ")}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
