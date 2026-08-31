import React from 'react';
import { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import GlossarySearch from '@/components/GlossarySearch';
import JsonLd from '@/components/JsonLd';
import { BookOpen, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Interactive Skilling Glossary | 40+ Industry Tech & Business Terms',
  description: 'Search and understand high-frequency terms like DAX, RAG, GSTR-3B, ROAS, STAR framework, SIEM, and CKA with code snippets and real-world examples.',
  keywords: ['skilling glossary', 'tech terms explained', 'what is dax', 'what is rag', 'gstr 3b full form']
};

export default function GlossaryPage() {
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: 'SkillsGuide.in Skilling & Career Glossary',
    description: 'Comprehensive definitions and code examples of high-demand tech, business, and tax compliance concepts.'
  };

  const breadcrumbs = [
    { name: 'Tools', url: '/#skills-catalog' },
    { name: 'Skilling Glossary' }
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto">
      <JsonLd data={jsonLdData} />
      <Breadcrumbs items={breadcrumbs} />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Interactive Knowledge Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          Comprehensive Skilling Glossary
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm">
          Clear definitions, formula snippets, and practical Indian workplace context across Tech, AI, Marketing, and Finance.
        </p>
      </div>

      {/* Interactive Glossary Component */}
      <GlossarySearch />

    </div>
  );
}
