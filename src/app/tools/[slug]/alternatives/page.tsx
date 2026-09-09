import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { 
  toolAlternativesData, 
  getToolAlternativeBySlug 
} from "@/data/toolAlternativesData";
import { 
  Layers, 
  ExternalLink, 
  DollarSign, 
  Server, 
  Sparkles, 
  HelpCircle, 
  ShieldCheck, 
  ArrowRight,
  Clock
} from "lucide-react";
import BookmarkButton from "@/components/BookmarkButton";
import ToolAlternativesView from "@/components/ToolAlternativesView";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return toolAlternativesData.map((t) => ({
    slug: t.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getToolAlternativeBySlug(slug);

  if (!item) {
    return {
      title: "Tool Alternatives Not Found | SkillsGuide",
    };
  }

  const title = `Top ${item.alternatives.length} Best Free & Open-Source ${item.toolName} Alternatives (2025)`;
  const description = `Explore the best alternatives to ${item.toolName}. Compare free, open-source, self-hosted, and team-friendly software options with detailed pros, cons, and pricing.`;

  return {
    title,
    description,
    keywords: [
      `${item.toolName} alternatives`,
      `free ${item.toolName} alternatives`,
      `open source ${item.toolName} alternatives`,
      `self hosted ${item.toolName} alternatives`,
      `${item.toolName} competitors`,
      ...item.alternatives.map(a => `${a.name} vs ${item.toolName}`)
    ],
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://skillsguide.in/tools/${item.slug}/alternatives`,
    },
    alternates: {
      canonical: `https://skillsguide.in/tools/${item.slug}/alternatives`,
    },
  };
}

export default async function ToolAlternativesDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = getToolAlternativeBySlug(slug);

  if (!item) {
    notFound();
  }

  // Related tools in same category
  const relatedTools = toolAlternativesData
    .filter((t) => t.category === item.category && t.slug !== item.slug)
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Top Alternatives to ${item.toolName}`,
    "description": item.overview,
    "itemListElement": item.alternatives.map((alt, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": alt.name,
      "description": `${alt.tagline} - ${alt.bestDifferentiator}`,
      "url": alt.websiteUrl
    }))
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": item.faqs.map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer
      }
    }))
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="max-w-6xl mx-auto space-y-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/tools/alternatives" className="hover:text-white transition-colors">Tools</Link>
          <span>/</span>
          <span className="text-emerald-400 font-medium">{item.toolName} Alternatives</span>
        </nav>

        {/* Hero Banner */}
        <div className="relative rounded-3xl bg-gradient-to-br from-emerald-950/80 via-slate-900 to-cyan-950/60 border border-emerald-500/20 p-8 sm:p-12 overflow-hidden shadow-2xl backdrop-blur-xl">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              {item.categoryLabel} Matrix
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Top <span className="text-emerald-400">{item.alternatives.length} Best Alternatives</span> to {item.toolName} (Free &amp; Open-Source)
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              {item.overview}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <BookmarkButton 
                slug={`tool-alt-${item.slug}`} 
                title={`${item.toolName} Alternatives`} 
              />
              <span className="text-xs text-slate-400 flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-white/5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                Updated for 2025
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-white/5">
                <Server className="w-3.5 h-3.5 text-cyan-400" />
                Self-Hosted &amp; Open Source Included
              </span>
            </div>
          </div>
        </div>

        {/* Client Interactive Matrix View */}
        <ToolAlternativesView tool={item} relatedTools={relatedTools} />
      </div>
    </div>
  );
}
