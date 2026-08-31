'use client';

import React from 'react';
import Link from 'next/link';
import { Bookmark, X, Trash2, ArrowRight } from 'lucide-react';
import { allSkillsList } from '@/data/skillsData';

interface BookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedSlugs: string[];
  onRemoveBookmark: (slug: string) => void;
}

export default function BookmarksDrawer({
  isOpen,
  onClose,
  savedSlugs,
  onRemoveBookmark
}: BookmarksDrawerProps) {
  if (!isOpen) return null;

  const savedSkills = allSkillsList.filter(s => savedSlugs.includes(s.slug));

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end">
      <div className="glass-card w-full max-w-md h-full p-6 shadow-floating border-l border-white/10 flex flex-col justify-between animate-in slide-in-from-right duration-200 bg-[#121526]/95">
        
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-purple-400" />
              <h3 className="text-base font-black text-white">Your Saved Roadmaps ({savedSkills.length})</h3>
            </div>
            <button 
              onClick={onClose} 
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
              aria-label="Close saved drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List of Saved Items */}
          <div className="mt-4 space-y-3 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
            {savedSkills.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <Bookmark className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-xs font-bold text-slate-300">No saved tracks yet.</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                  Click the bookmark icon on any skill or roadmap card to save it for offline review.
                </p>
              </div>
            ) : (
              savedSkills.map(skill => (
                <div 
                  key={skill.slug}
                  className="p-3.5 rounded-2xl border border-slate-800 bg-slate-900/80 flex items-center justify-between hover:border-purple-500/40 transition-all"
                >
                  <div className="pr-2">
                    <h4 className="text-xs font-bold text-white line-clamp-1">{skill.title}</h4>
                    <span className="text-[10px] text-purple-400 font-semibold">{skill.salaryRange}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link 
                      href={`/skills/${skill.slug}`}
                      onClick={onClose}
                      className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[10px] font-bold shadow-glow-btn flex items-center gap-1"
                    >
                      <span>Open</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </Link>
                    <button 
                      onClick={() => onRemoveBookmark(skill.slug)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-500">Saved locally in your browser storage for instant access.</p>
        </div>

      </div>
    </div>
  );
}
