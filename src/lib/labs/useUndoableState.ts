'use client';

import { useCallback, useRef, useState } from 'react';

interface UndoableApi<T> {
  state: T;
  /** Push a new state onto the history stack (truncates any redo branch). */
  set: (next: T | ((prev: T) => T)) => void;
  undo: () => void;
  redo: () => void;
  /** Reset history back to the original initial value. */
  reset: () => void;
  canUndo: boolean;
  canRedo: boolean;
  /** Number of applied actions since the initial state — useful for step-replay UIs. */
  stepIndex: number;
  history: T[];
}

/**
 * Generic bounded undo/redo stack for lab workspaces, satisfying the shared
 * contract's "undo and reset" + "step replay" requirement without each lab
 * re-implementing its own history plumbing.
 */
interface Timeline<T> {
  history: T[];
  index: number;
}

export function useUndoableState<T>(initial: T, maxHistory = 50): UndoableApi<T> {
  const initialRef = useRef(initial);
  const [timeline, setTimeline] = useState<Timeline<T>>({ history: [initial], index: 0 });

  const set = useCallback((next: T | ((prev: T) => T)) => {
    setTimeline(({ history, index }) => {
      const current = history[index];
      const resolved = typeof next === 'function' ? (next as (prev: T) => T)(current) : next;
      const truncated = history.slice(0, index + 1);
      const appended = [...truncated, resolved].slice(-maxHistory);
      return { history: appended, index: appended.length - 1 };
    });
  }, [maxHistory]);

  const undo = useCallback(() => {
    setTimeline(({ history, index }) => ({ history, index: Math.max(0, index - 1) }));
  }, []);

  const redo = useCallback(() => {
    setTimeline(({ history, index }) => ({ history, index: Math.min(history.length - 1, index + 1) }));
  }, []);

  const reset = useCallback(() => {
    setTimeline({ history: [initialRef.current], index: 0 });
  }, []);

  return {
    state: timeline.history[timeline.index],
    set,
    undo,
    redo,
    reset,
    canUndo: timeline.index > 0,
    canRedo: timeline.index < timeline.history.length - 1,
    stepIndex: timeline.index,
    history: timeline.history,
  };
}
