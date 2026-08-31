import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { allGlossaryTerms, getGlossaryTermBySlug } from '@/data/glossaryData';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import { BookOpen, ArrowRight, Code, Sparkles, Copy } from 'lucide-react';

interface Props {
  params: Promise<{ term: string }>;
}

export async function generateStaticParams() {
  return allGlossaryTerms.map((t) => ({
    term: t.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { term } = await params;
  const item = getGlossaryTermBySlug(term);

  if (!item) return { title: 'Term Not Found' };

  return {
    title: `What is ${item.term}? Definition, Guide & Examples`,
    description: `${item.shortDefinition} Learn how ${item.term} is used in modern careers with practical code snippets and frameworks.`,
    keywords: [item.term, `what is ${item.term}`, `${item.term} example`, item.relatedSkillName]
  };
}

export default async function GlossaryTermDetailPage({ params }: Props) {
  const { term } = await params;
  const item = getGlossaryTermBySlug(term);

  if (!item) notFound();

  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: item.term,
    description: item.fullExplanation,
    inDefinedTermSet: 'https://skillsguide.in/glossary'
  };

  const breadcrumbs = [
    { name: 'Glossary', url: '/glossary' },
    { name: item.category, url: '/glossary' },
    { name: item.term }
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-10 max-w-4xl mx-auto space-y-8">
      <JsonLd data={jsonLdData} />
      <Breadcrumbs items={breadcrumbs} />

      <div className="glass-card p-6 sm:p-10 rounded-3xl border border-white/10 shadow-2xl space-y-6">
        
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">
            {item.category}
          </span>
          <Link 
            href={`/skills/${item.relatedSkillSlug}`}
            className="text-xs text-purple-400 hover:text-purple-300 font-bold"
          >
            Related Track: {item.relatedSkillName} &rarr;
          </Link>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white">
          {item.term}
        </h1>

        <div className="p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20 text-sm font-medium text-purple-200">
          💡 <strong>Quick Definition:</strong> {item.shortDefinition}
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <h3 className="text-base font-bold text-white">Detailed Explanation & Workplace Application</h3>
          <p>{item.fullExplanation}</p>
        </div>

        {item.exampleOrSnippet && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Practical Syntax / Framework Formula
            </h4>
            <pre className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs font-mono text-purple-300 overflow-x-auto whitespace-pre-wrap">
              {item.exampleOrSnippet}
            </pre>
          </div>
        )}

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link 
            href="/glossary"
            className="text-xs text-slate-400 hover:text-white"
          >
            &larr; Back to Full Glossary
          </Link>

          <Link 
            href={`/skills/${item.relatedSkillSlug}`}
            className="px-6 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-glow-btn flex items-center gap-2"
          >
            <span>Learn {item.relatedSkillName}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
}
