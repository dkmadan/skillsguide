'use client';

import React, { useState, useMemo } from 'react';
import { LabScenarioVariant } from '@/lib/labs/types';
import { downloadJson } from '@/lib/labs/exportHelper';

interface Props {
  scenario?: LabScenarioVariant;
  variant: 'beginner' | 'intermediate' | 'challenge';
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

interface LessonSegment {
  id: string;
  title: string;
  durationMins: number;
  hasAssessment: boolean;
  type: 'warmup' | 'lecture' | 'interactive_lab' | 'wrapup';
}

export default function TeachingCurriculumStudioLab({ onDirty, onSubmit }: Props) {
  const [segments, setSegments] = useState<LessonSegment[]>([
    { id: 'seg_1', title: 'Interactive Warmup & Diagnostic Probe', durationMins: 5, hasAssessment: true, type: 'warmup' },
    { id: 'seg_2', title: 'Conceptual Walkthrough (SQL Joins)', durationMins: 15, hasAssessment: false, type: 'lecture' },
    { id: 'seg_3', title: 'Hands-on Browser Practice Lab', durationMins: 15, hasAssessment: true, type: 'interactive_lab' },
    { id: 'seg_4', title: 'Class Reflection & Formative Exit Ticket', durationMins: 5, hasAssessment: true, type: 'wrapup' },
  ]);

  const targetMaxMins = 40;

  const totalDuration = useMemo(() => {
    return segments.reduce((sum, s) => sum + s.durationMins, 0);
  }, [segments]);

  const isOverTime = totalDuration > targetMaxMins;

  const [misconceptionRemedy, setMisconceptionRemedy] = useState<'visual_venn' | 'more_homework' | 'ignore'>('visual_venn');
  const [pedagogicalNotes, setPedagogicalNotes] = useState<string>('Students confuse LEFT JOIN with INNER JOIN by assuming unmatched rows disappear. We address this using linked visual row grids.');

  const updateSegmentDuration = (id: string, mins: number) => {
    setSegments(prev => prev.map(s => s.id === id ? { ...s, durationMins: mins } : s));
    onDirty();
  };

  const handleExportJson = () => {
    downloadJson('lesson_curriculum_plan.json', {
      segments,
      totalDuration,
      targetMaxMins,
      isOverTime,
      misconceptionRemedy,
      pedagogicalNotes
    });
  };

  const handleFinalSubmit = () => {
    onSubmit({
      segments,
      totalDuration,
      targetMaxMins,
      isOverTime,
      misconceptionRemedy,
      pedagogicalNotes
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
              Lab 28 • Curriculum Architecture & Pedagogy
            </span>
            <h2 className="text-xl font-bold text-white mt-2">Teaching & Curriculum Studio (40-Minute Lesson Plan)</h2>
            <p className="text-sm text-slate-400 mt-1">
              Sequence a high-impact 40-minute instructional block. Ensure learning objectives pair with formative assessments, prevent schedule overflow, and address student misconceptions.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              Export Lesson JSON
            </button>
            <button
              onClick={handleFinalSubmit}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold transition shadow-lg shadow-teal-500/20"
            >
              Submit Lesson Plan
            </button>
          </div>
        </div>
      </div>

      {/* Lesson Clock & Timing Meter */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-semibold text-slate-300">Total Instructional Time Allotment</span>
          <span className={`font-mono font-bold ${isOverTime ? 'text-rose-400' : 'text-emerald-400'}`}>
            {totalDuration} / {targetMaxMins} Minutes {isOverTime && '(OVER SCHEDULE)'}
          </span>
        </div>
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${isOverTime ? 'bg-rose-500' : 'bg-teal-500'}`}
            style={{ width: `${Math.min(100, (totalDuration / targetMaxMins) * 100)}%` }}
          />
        </div>
      </div>

      {/* Segments & Misconceptions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white">Instructional Sequence</h3>

          <div className="space-y-3">
            {segments.map(seg => (
              <div key={seg.id} className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{seg.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded uppercase font-semibold bg-slate-800 text-slate-300">
                      {seg.type}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Assessment: {seg.hasAssessment ? '✓ Formative Check Included' : 'Conceptual Only'}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={seg.durationMins}
                    onChange={e => updateSegmentDuration(seg.id, parseInt(e.target.value) || 1)}
                    className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-center font-mono text-white text-xs"
                  />
                  <span className="text-slate-400 text-xs">min</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Classroom Misconception Scenario */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
          <h3 className="text-sm font-semibold text-white">Pedagogical Intervention</h3>
          <p className="text-slate-400">
            Misconception: 60% of students assume that an INNER JOIN produces fewer rows than an unjoined table, but get bewildered when duplicates create a Cartesian product.
          </p>

          <div className="space-y-2">
            {[
              { id: 'visual_venn', label: 'Intervention A: Step through concrete row-matching trace with animated duplicate keys.' },
              { id: 'more_homework', label: 'Intervention B: Assign 20 additional SQL drill problems without explanation.' },
              { id: 'ignore', label: 'Intervention C: Skip and move immediately to indexing.' },
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => { setMisconceptionRemedy(opt.id as any); onDirty(); }}
                className={`w-full text-left p-3 rounded-xl border transition ${
                  misconceptionRemedy === opt.id
                    ? 'bg-teal-500/20 border-teal-500 text-teal-300 font-semibold'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800">
            <label className="text-slate-400 block mb-1">Curriculum Design Rationale</label>
            <textarea
              rows={3}
              value={pedagogicalNotes}
              onChange={e => { setPedagogicalNotes(e.target.value); onDirty(); }}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
