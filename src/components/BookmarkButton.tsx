'use client';

import React, { useState, useEffect } from 'react';
import { Bookmark, Check } from 'lucide-react';

interface BookmarkButtonProps {
  slug: string;
  title?: string;
  variant?: 'icon' | 'button' | 'compact';
  className?: string;
}

export default function BookmarkButton({
  slug,
  title,
  variant = 'icon',
  className = '',
}: BookmarkButtonProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    const checkSaved = () => {
      try {
        const stored = localStorage.getItem('skillsguide_bookmarks');
        if (stored) {
          const slugs: string[] = JSON.parse(stored);
          setIsSaved(slugs.includes(slug));
        } else {
          setIsSaved(false);
        }
      } catch (e) {
        console.error(e);
      }
    };

    checkSaved();

    const handleSync = (e: any) => {
      if (e?.detail?.slug === slug || !e?.detail?.slug) {
        checkSaved();
      }
    };

    window.addEventListener('toggle-bookmark' as any, handleSync);
    window.addEventListener('storage', checkSaved);

    return () => {
      window.removeEventListener('toggle-bookmark' as any, handleSync);
      window.removeEventListener('storage', checkSaved);
    };
  }, [slug]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const stored = localStorage.getItem('skillsguide_bookmarks');
      let slugs: string[] = stored ? JSON.parse(stored) : [];

      let updated: string[];
      let nextState: boolean;

      if (slugs.includes(slug)) {
        updated = slugs.filter((s) => s !== slug);
        nextState = false;
      } else {
        updated = [...slugs, slug];
        nextState = true;
        setJustSaved(true);
        setTimeout(() => setJustSaved(false), 1800);
      }

      localStorage.setItem('skillsguide_bookmarks', JSON.stringify(updated));
      setIsSaved(nextState);

      window.dispatchEvent(
        new CustomEvent('toggle-bookmark', {
          detail: { slug, isSaved: nextState },
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (variant === 'button') {
    return (
      <button
        onClick={handleToggle}
        type="button"
        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
          isSaved
            ? 'bg-purple-600/20 text-purple-300 border-purple-500/50 shadow-glow-btn'
            : 'glass-card bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border-slate-700 hover:border-purple-500/40'
        } ${className}`}
        title={isSaved ? 'Remove from saved roadmaps' : 'Save roadmap to local storage'}
        aria-label={isSaved ? 'Remove bookmark' : 'Bookmark topic or roadmap'}
      >
        {justSaved ? (
          <>
            <Check className="w-4 h-4 text-emerald-400 animate-bounce" />
            <span className="text-emerald-300">Saved to Local Storage!</span>
          </>
        ) : (
          <>
            <Bookmark
              className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                isSaved ? 'fill-purple-400 text-purple-400' : 'text-slate-400'
              }`}
            />
            <span>{isSaved ? 'Saved in Bookmarks' : 'Bookmark Roadmap'}</span>
          </>
        )}
      </button>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={handleToggle}
        type="button"
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer border ${
          isSaved
            ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
            : 'bg-slate-900/90 text-slate-400 hover:text-purple-300 border-slate-800 hover:border-purple-500/30'
        } ${className}`}
        title={isSaved ? 'Remove from saved' : 'Save track to bookmarks'}
      >
        <Bookmark
          className={`w-3 h-3 ${
            isSaved ? 'fill-purple-400 text-purple-400' : 'text-slate-400'
          }`}
        />
        <span>{isSaved ? 'Saved' : 'Save'}</span>
      </button>
    );
  }

  // Default: variant === 'icon' (for card overlay or quick action)
  return (
    <button
      onClick={handleToggle}
      type="button"
      className={`p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer border ${
        isSaved
          ? 'bg-purple-600/30 text-purple-300 border-purple-500/60 shadow-lg scale-105'
          : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border-slate-700/80 hover:border-purple-500/50'
      } ${className}`}
      title={isSaved ? `Remove ${title || 'topic'} from bookmarks` : `Save ${title || 'topic'} to bookmarks`}
      aria-label={isSaved ? 'Remove bookmark' : 'Add bookmark'}
    >
      <Bookmark
        className={`w-4 h-4 transition-all ${
          isSaved ? 'fill-purple-400 text-purple-400 scale-110' : ''
        }`}
      />
    </button>
  );
}
