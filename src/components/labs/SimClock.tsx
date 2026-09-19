'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';

interface SimClockProps {
  label: string;
  step: number;
  maxStep: number;
  stepLabel?: (step: number) => string;
  onAdvance: () => void;
  onReset: () => void;
  /** ms between auto-advance ticks while playing. Explicit state, not a hidden background job. */
  tickMs?: number;
}

/**
 * Shared "Advance" simulation clock: explicit step state plus an optional
 * manual auto-play driven by a foreground interval the user can pause any
 * time, per the shared contract ("Simulation clocks use explicit state and
 * an Advance step control, not background jobs").
 */
export default function SimClock({ label, step, maxStep, stepLabel, onAdvance, onReset, tickMs = 700 }: SimClockProps) {
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!playing || step >= maxStep) return;
    timerRef.current = setInterval(() => {
      onAdvance();
    }, tickMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [playing, step, maxStep, onAdvance, tickMs]);

  const atEnd = step >= maxStep;

  return (
    <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-black/30 border border-white/10 flex-wrap">
      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-1">{label}</span>

      <div className="flex-1 min-w-[100px]">
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full bg-cyan-500 transition-all" style={{ width: `${maxStep ? (step / maxStep) * 100 : 0}%` }} />
        </div>
      </div>

      <span className="text-[11px] font-mono text-cyan-300 min-w-[64px]">
        {stepLabel ? stepLabel(step) : `Step ${step}/${maxStep}`}
      </span>

      <button
        type="button"
        onClick={() => setPlaying((p) => !p)}
        disabled={atEnd}
        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 disabled:opacity-40 transition-colors"
        title={playing ? 'Pause auto-advance' : 'Auto-advance'}
        aria-label={playing ? 'Pause simulation' : 'Play simulation'}
      >
        {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
      </button>

      <button
        type="button"
        onClick={onAdvance}
        disabled={atEnd}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 text-cyan-200 text-[11px] font-bold disabled:opacity-40 transition-colors"
      >
        <SkipForward className="w-3 h-3" />
        <span>Advance</span>
      </button>

      <button
        type="button"
        onClick={() => { setPlaying(false); onReset(); }}
        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors"
        title="Reset simulation clock"
        aria-label="Reset simulation clock"
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
