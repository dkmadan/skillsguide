'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { allSkillsList } from '@/data/skillsData';
import { roadmapsData } from '@/data/roadmapsData';
import { glossaryTerms } from '@/data/glossaryData';
import { Search, X, ArrowRight, Code, Briefcase, MapPin, BookOpen } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  // Search in Skills
  const matchedSkills = allSkillsList.filter(s => 
    !q || 
    s.title.toLowerCase().includes(q) || 
    s.shortDesc.toLowerCase().includes(q) || 
    s.tools.some(t => t.toLowerCase().includes(q))
  ).slice(0, 6);

  // Search in Roadmaps
  const matchedRoadmaps = roadmapsData.filter(r => 
    !q || 
    r.title.toLowerCase().includes(q) || 
    r.targetRole.toLowerCase().includes(q)
  ).slice(0, 3);

  // Search in Glossary
  const matchedGlossary = glossaryTerms.filter(g => 
    !q || 
    g.term.toLowerCase().includes(q) || 
    g.shortDefinition.toLowerCase().includes(q)
  ).slice(0, 3);

  const totalMatches = matchedSkills.length + matchedRoadmaps.length + matchedGlossary.length;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center p-4 pt-16 sm:pt-24">
      <div className="glass-card rounded-3xl max-w-2xl w-full p-6 shadow-floating border border-white/15 relative animate-in fade-in zoom-in-95 duration-150 bg-[#121526]/95">
        
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <Search className="w-5 h-5 text-slate-400" />
          <input 
            ref={inputRef}
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by skill name, tool, or roadmap (e.g. SQL, Next.js, Tally, RAG, Python)..." 
            className="w-full text-sm font-semibold text-white placeholder-slate-500 focus:outline-none bg-transparent"
          />
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 bg-slate-800 rounded-lg"
          >
            ESC
          </button>
        </div>

        {/* Search Results */}
        <div className="mt-4 max-h-[360px] overflow-y-auto space-y-4 pr-1 text-xs">
          
          {totalMatches === 0 ? (
            <div className="text-center py-10 text-slate-500">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="font-semibold text-slate-400">No matching skills or guides found for &quot;{query}&quot;</p>
              <p className="text-[10px] mt-1">Try searching for keywords like &quot;SQL&quot;, &quot;Tally&quot;, &quot;AI&quot;, or &quot;Excel&quot;.</p>
            </div>
          ) : (
            <>
              {/* Skills Matches */}
              {matchedSkills.length > 0 && (
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-400 block mb-2">
                    Career Skills & Tracks ({matchedSkills.length})
                  </span>
                  <div className="space-y-1.5">
                    {matchedSkills.map((skill) => (
                      <Link 
                        key={skill.slug} 
                        href={`/skills/${skill.slug}`}
                        onClick={onClose}
                        className="p-3 rounded-2xl border border-slate-800 hover:border-purple-500 bg-slate-900/60 hover:bg-purple-500/10 cursor-pointer transition-all flex items-center justify-between group"
                      >
                        <div className="overflow-hidden pr-2">
                          <div className="font-bold text-white text-xs group-hover:text-purple-300 flex items-center gap-1.5">
                            <Code className="w-3.5 h-3.5 text-purple-400" />
                            <span>{skill.title}</span>
                            <span className="text-[9px] px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded font-normal">
                              {skill.salaryRange}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">{skill.shortDesc}</p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400 shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Roadmaps Matches */}
              {matchedRoadmaps.length > 0 && (
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 block mb-2">
                    Curated Roadmaps ({matchedRoadmaps.length})
                  </span>
                  <div className="space-y-1.5">
                    {matchedRoadmaps.map((roadmap) => (
                      <Link 
                        key={roadmap.slug} 
                        href={`/roadmaps/${roadmap.slug}`}
                        onClick={onClose}
                        className="p-3 rounded-2xl border border-slate-800 hover:border-emerald-500 bg-slate-900/60 hover:bg-emerald-500/10 cursor-pointer transition-all flex items-center justify-between group"
                      >
                        <div>
                          <div className="font-bold text-white text-xs group-hover:text-emerald-300 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{roadmap.title}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">Target: {roadmap.targetRole} • {roadmap.duration}</p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Glossary Matches */}
              {matchedGlossary.length > 0 && (
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-400 block mb-2">
                    Glossary Terms ({matchedGlossary.length})
                  </span>
                  <div className="space-y-1.5">
                    {matchedGlossary.map((term) => (
                      <Link 
                        key={term.slug} 
                        href={`/glossary/${term.slug}`}
                        onClick={onClose}
                        className="p-3 rounded-2xl border border-slate-800 hover:border-teal-500 bg-slate-900/60 hover:bg-teal-500/10 cursor-pointer transition-all flex items-center justify-between group"
                      >
                        <div>
                          <div className="font-bold text-white text-xs group-hover:text-teal-300 flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-teal-400" />
                            <span>{term.term}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{term.shortDefinition}</p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-teal-400 shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

        </div>

        {/* Footer tip */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-between items-center text-[11px] text-slate-500">
          <span>Tip: Navigate with keyboard and press ESC to close</span>
          <span>SkillsGuide.in Direct Search Index</span>
        </div>

      </div>
    </div>
  );
}
