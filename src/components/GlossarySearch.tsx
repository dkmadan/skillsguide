'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { allGlossaryTerms } from '@/data/glossaryData';
import { Search, BookOpen, ArrowRight, Code, Copy, Check } from 'lucide-react';

export default function GlossarySearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const categories = ['All', 'Tech', 'AI', 'Finance & Tax', 'Marketing', 'Business'];

  const filteredTerms = allGlossaryTerms.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.shortDefinition.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopySnippet = (slug: string, snippet: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  return (
    <div className="space-y-8">
      
      {/* Search & Filter Bar */}
      <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search across 40+ skilling terms (e.g. DAX, RAG, GSTR-3B, ROAS, STAR, SIEM, CKA)..."
            className="w-full bg-slate-900/90 border border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 text-xs sm:text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedCategory === cat 
                  ? 'bg-purple-600 text-white shadow-glow-btn' 
                  : 'glass-card text-slate-300 hover:bg-slate-800 border border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTerms.length === 0 ? (
          <div className="col-span-full py-16 text-center glass-card rounded-3xl border border-dashed border-slate-800">
            <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <h4 className="text-base font-bold text-white">No terms found matching &quot;{searchTerm}&quot;</h4>
            <p className="text-xs text-slate-400 mt-1">Try selecting a different category or clearing your search query.</p>
          </div>
        ) : (
          filteredTerms.map(item => (
            <div 
              key={item.slug}
              className="glass-card p-6 rounded-3xl border border-white/10 hover:border-purple-500/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                    {item.category}
                  </span>
                  <Link 
                    href={`/skills/${item.relatedSkillSlug}`}
                    className="text-[10px] text-slate-400 hover:text-purple-300 transition-colors font-medium truncate max-w-[150px]"
                    title={`Related Skill: ${item.relatedSkillName}`}
                  >
                    🔗 {item.relatedSkillName}
                  </Link>
                </div>

                <Link href={`/glossary/${item.slug}`} className="block group-hover:text-purple-300 transition-colors">
                  <h3 className="text-base font-bold text-white">{item.term}</h3>
                </Link>

                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {item.shortDefinition}
                </p>

                {item.exampleOrSnippet && (
                  <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800 relative text-[11px] font-mono text-purple-200/90 overflow-x-auto">
                    <button 
                      onClick={() => handleCopySnippet(item.slug, item.exampleOrSnippet)}
                      className="absolute top-2 right-2 p-1 text-slate-400 hover:text-white rounded bg-slate-800 hover:bg-slate-700 transition-colors"
                      title="Copy formula/snippet"
                    >
                      {copiedSlug === item.slug ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                    <pre className="pr-6 whitespace-pre-wrap">{item.exampleOrSnippet}</pre>
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <Link 
                  href={`/glossary/${item.slug}`}
                  className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1"
                >
                  <span>Deep-Dive Guide</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
                <Link 
                  href={`/skills/${item.relatedSkillSlug}`}
                  className="text-[11px] text-slate-400 hover:text-slate-200"
                >
                  View Track Blueprint
                </Link>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
