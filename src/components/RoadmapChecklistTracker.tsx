'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Trophy, RefreshCw } from 'lucide-react';

interface Props {
  roadmapSlug: string;
  checklist: string[];
}

export default function RoadmapChecklistTracker({ roadmapSlug, checklist }: Props) {
  const [completedItems, setCompletedItems] = useState<Record<number, boolean>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`roadmap_progress_${roadmapSlug}`);
      if (saved) {
        setCompletedItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error loading roadmap progress', e);
    }
    setIsLoaded(true);
  }, [roadmapSlug]);

  const toggleItem = (index: number) => {
    const updated = {
      ...completedItems,
      [index]: !completedItems[index]
    };
    setCompletedItems(updated);
    try {
      localStorage.setItem(`roadmap_progress_${roadmapSlug}`, JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving roadmap progress', e);
    }
  };

  const resetProgress = () => {
    setCompletedItems({});
    try {
      localStorage.removeItem(`roadmap_progress_${roadmapSlug}`);
    } catch (e) {
      console.error('Error clearing progress', e);
    }
  };

  const completedCount = Object.values(completedItems).filter(Boolean).length;
  const totalCount = checklist.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  if (!checklist || checklist.length === 0) return null;

  return (
    <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4 bg-slate-900/80">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold uppercase text-white tracking-wider flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Interactive Learning Tracker</span>
        </h3>
        {completedCount > 0 && (
          <button
            onClick={resetProgress}
            className="text-[10px] text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1"
            title="Reset checklist progress"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-slate-300">Progress: {completedCount} of {totalCount} completed</span>
          <span className={progressPct === 100 ? 'text-emerald-400 font-bold' : 'text-purple-300'}>
            {progressPct}%
          </span>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-emerald-400 transition-all duration-300 rounded-full"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Checklist items */}
      <div className="space-y-2 pt-1">
        {checklist.map((item, i) => {
          const isDone = isLoaded && !!completedItems[i];
          return (
            <button
              key={i}
              onClick={() => toggleItem(i)}
              className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-2.5 text-xs ${
                isDone 
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' 
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <Circle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              )}
              <span className={`leading-relaxed ${isDone ? 'line-through opacity-80' : ''}`}>
                {item}
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-[10px] text-slate-500 text-center">
        Progress is automatically saved to your browser local storage.
      </p>
    </div>
  );
}
