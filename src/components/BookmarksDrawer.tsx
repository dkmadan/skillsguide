'use client';

import React from 'react';
import Link from 'next/link';
import { Bookmark, X, Trash2, ArrowRight, Sparkles, MapPin } from 'lucide-react';
import { allSkillsList } from '@/data/skillsData';
import { allRoadmapsList } from '@/data/roadmapsData';

interface BookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedSlugs: string[];
  onRemoveBookmark: (slug: string) => void;
}

interface SavedItem {
  slug: string;
  title: string;
  subtitle: string;
  type: 'skill' | 'roadmap';
  url: string;
  badge: string;
}

export default function BookmarksDrawer({
  isOpen,
  onClose,
  savedSlugs,
  onRemoveBookmark
}: BookmarksDrawerProps) {
  if (!isOpen) return null;

  const savedItems: SavedItem[] = savedSlugs.map(slug => {
    const skill = allSkillsList.find(s => s.slug === slug);
    if (skill) {
      return {
        slug: skill.slug,
        title: skill.title,
        subtitle: skill.salaryRange,
        type: 'skill',
        url: `/skills/${skill.slug}`,
        badge: skill.categoryLabel || 'Topic Blueprint'
      };
    }
    const roadmap = allRoadmapsList.find(r => r.slug === slug);
    if (roadmap) {
      return {
        slug: roadmap.slug,
        title: roadmap.title,
        subtitle: `${roadmap.duration} • ${roadmap.salaryExpectation || 'Verified Roadmap'}`,
        type: 'roadmap',
        url: `/roadmaps/${roadmap.slug}`,
        badge: 'Structured Roadmap'
      };
    }
    // Fallback if slug format is customized
    const cleanTitle = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    return {
      slug,
      title: cleanTitle,
      subtitle: 'Saved Track',
      type: 'skill',
      url: `/skills/${slug}`,
      badge: 'Saved Topic'
    };
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end">
      <div className="glass-card w-full max-w-md h-full p-6 shadow-floating border-l border-white/10 flex flex-col justify-between animate-in slide-in-from-right duration-200 bg-[#121526]/95">
        
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-purple-400 fill-purple-400/20" />
              <h3 className="text-base font-black text-white">Your Saved Roadmaps ({savedItems.length})</h3>
            </div>
            <button 
              onClick={onClose} 
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Close saved drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List of Saved Items */}
          <div className="mt-4 space-y-3 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
            {savedItems.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-30 text-purple-400" />
                <p className="text-sm font-bold text-slate-300">No saved tracks yet.</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
                  Click the bookmark icon on any topic, skill, or roadmap to save it to your local storage for offline access.
                </p>
              </div>
            ) : (
              savedItems.map(item => (
                <div 
                  key={item.slug}
                  className="p-3.5 rounded-2xl border border-slate-800 bg-slate-900/80 flex items-center justify-between hover:border-purple-500/40 transition-all gap-3 group"
                >
                  <div className="pr-1 min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      {item.type === 'roadmap' ? (
                        <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                      ) : (
                        <Sparkles className="w-3 h-3 text-purple-400 shrink-0" />
                      )}
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 truncate">
                        {item.badge}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-purple-300 transition-colors">
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">
                      {item.subtitle}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link 
                      href={item.url}
                      onClick={onClose}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-[10px] font-bold shadow-glow-btn flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <span>Open</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </Link>
                    <button 
                      onClick={() => onRemoveBookmark(item.slug)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
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
