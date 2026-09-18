'use client';

import React, { useState, useMemo } from 'react';
import { LabScenarioVariant } from '@/lib/labs/types';
import { downloadCsv, downloadJson } from '@/lib/labs/exportHelper';

interface Props {
  scenario?: LabScenarioVariant;
  variant: 'beginner' | 'intermediate' | 'challenge';
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

interface SocialPost {
  id: string;
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  pillar: 'educational' | 'community' | 'product_announcement' | 'career_advice';
  copy: string;
  imageAltText: string;
  slotConflict: boolean;
}

export default function SocialContentCalendarLab({ onDirty, onSubmit }: Props) {
  const [posts, setPosts] = useState<SocialPost[]>([
    { id: 'p1', day: 'Mon', pillar: 'educational', copy: '5 Common Pitfalls in SQL Joins & How to Avoid Null Leakage 🧵', imageAltText: 'Diagram illustrating Left Join vs Inner Join row retention', slotConflict: false },
    { id: 'p2', day: 'Tue', pillar: 'career_advice', copy: 'How to transition from BI reporting to data engineering in 6 months.', imageAltText: '', slotConflict: false }, // missing alt text
    { id: 'p3', day: 'Tue', pillar: 'product_announcement', copy: 'Announcing 30 new Virtual Practice Labs on SkillsGuide!', imageAltText: 'Screenshot of interactive lab dashboard', slotConflict: true }, // Slot conflict with Tue
    { id: 'p4', day: 'Thu', pillar: 'educational', copy: 'Understanding P99 Latency: Why averages lie about user experience.', imageAltText: 'Graph showing long tail latency distribution', slotConflict: false },
    { id: 'p5', day: 'Fri', pillar: 'community', copy: 'Learner Spotlight: Meet Sarah, who just landed an SRE role!', imageAltText: 'Portrait of learner Sarah with celebration badge', slotConflict: false },
  ]);

  const [commentResponseChoice, setCommentResponseChoice] = useState<'defensive' | 'empathetic_actionable' | 'ignore'>('empathetic_actionable');
  const [selectedPostId, setSelectedPostId] = useState<string>('p2');

  const activePost = posts.find(p => p.id === selectedPostId) || posts[0];

  // Pillar balance check
  const pillarCounts = useMemo(() => {
    const counts: Record<string, number> = { educational: 0, community: 0, product_announcement: 0, career_advice: 0 };
    posts.forEach(p => { counts[p.pillar] = (counts[p.pillar] || 0) + 1; });
    return counts;
  }, [posts]);

  const hasMissingAlt = posts.some(p => !p.imageAltText || p.imageAltText.trim() === '');
  const hasSlotConflicts = posts.some(p => p.slotConflict);

  const updatePost = (id: string, updates: Partial<SocialPost>) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    onDirty();
  };

  const handleFixTuesdayConflict = () => {
    setPosts(prev => prev.map(p => p.id === 'p3' ? { ...p, day: 'Wed', slotConflict: false } : p));
    onDirty();
  };

  const handleAddAltText = () => {
    updatePost('p2', { imageAltText: 'Career progression roadmap infograph from Analyst to Data Engineer' });
  };

  const handleExportCsv = () => {
    const rows = posts.map(p => ({
      post_id: p.id,
      day: p.day,
      pillar: p.pillar,
      copy: p.copy,
      alt_text: p.imageAltText || 'MISSING',
      conflict: p.slotConflict ? 'YES' : 'NO'
    }));
    downloadCsv('social_content_calendar.csv', rows);
  };

  const handleExportJson = () => {
    downloadJson('social_content_plan.json', {
      posts,
      pillarCounts,
      commentResponseChoice,
      auditPassed: !hasMissingAlt && !hasSlotConflicts
    });
  };

  const handleFinalSubmit = () => {
    onSubmit({
      posts,
      pillarCounts,
      commentResponseChoice,
      hasMissingAlt,
      hasSlotConflicts
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20">
              Lab 26 • Social Media & Brand Strategy
            </span>
            <h2 className="text-xl font-bold text-white mt-2">Social Content Calendar & Moderation Planner</h2>
            <p className="text-sm text-slate-400 mt-1">
              Assemble a 7-day content schedule across 4 pillars. Resolve double-booked publication slots, ensure WCAG image descriptions (alt-text), and craft empathetic escalation replies.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              Export Calendar CSV
            </button>
            <button
              onClick={handleFinalSubmit}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500 text-white transition shadow-lg shadow-fuchsia-600/20"
            >
              Submit Calendar
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Health Checks */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 uppercase">Slot Scheduling</div>
          <div className={`text-xl font-bold mt-1 ${hasSlotConflicts ? 'text-rose-400' : 'text-emerald-400'}`}>
            {hasSlotConflicts ? 'Slot Collision' : 'Clean Schedule'}
          </div>
          <p className="text-xs text-slate-500 mt-1">{hasSlotConflicts ? 'Tue has 2 conflicting posts' : 'Distributed evenly'}</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 uppercase">Accessibility Alt-Text</div>
          <div className={`text-xl font-bold mt-1 ${hasMissingAlt ? 'text-amber-400' : 'text-emerald-400'}`}>
            {hasMissingAlt ? 'Missing Alt-Text' : '100% WCAG Ready'}
          </div>
          <p className="text-xs text-slate-500 mt-1">{hasMissingAlt ? 'Post P2 requires description' : 'Screen-reader compliant'}</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 uppercase">Content Diversity</div>
          <div className="text-xl font-bold text-cyan-400 mt-1">4 Pillars Covered</div>
          <p className="text-xs text-slate-500 mt-1">Edu, Community, Prod, Career</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 uppercase">Brand Escalation Tone</div>
          <div className="text-xl font-bold text-fuchsia-400 mt-1 capitalize">{commentResponseChoice.replace('_', ' ')}</div>
          <p className="text-xs text-slate-500 mt-1">Empathetic community resolution</p>
        </div>
      </div>

      {/* Post Grid & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Scheduled Posts Pipeline</h3>
            {hasSlotConflicts && (
              <button
                onClick={handleFixTuesdayConflict}
                className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition"
              >
                Reschedule Conflict to Wed
              </button>
            )}
          </div>

          <div className="space-y-3">
            {posts.map(p => (
              <div
                key={p.id}
                onClick={() => setSelectedPostId(p.id)}
                className={`p-3.5 rounded-xl border transition cursor-pointer ${
                  p.id === selectedPostId
                    ? 'bg-slate-800 border-fuchsia-500/60 shadow-md'
                    : p.slotConflict
                    ? 'bg-rose-950/20 border-rose-800/40'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-fuchsia-400">{p.day}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded uppercase font-semibold bg-slate-800 text-slate-300">
                      {p.pillar.replace('_', ' ')}
                    </span>
                  </div>
                  {p.slotConflict && (
                    <span className="text-[10px] font-bold text-rose-400 bg-rose-500/20 px-1.5 py-0.5 rounded border border-rose-500/30">
                      Collision
                    </span>
                  )}
                  {!p.imageAltText && (
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/30">
                      No Alt
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-200 mt-1 line-clamp-2">{p.copy}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Post Inspector & Community Response */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 text-xs">
            <h3 className="text-sm font-semibold text-white">Post Inspector ({activePost.id.toUpperCase()})</h3>

            <div>
              <label className="text-slate-400 block mb-1">Image Description (WCAG Alt-Text)</label>
              <textarea
                rows={2}
                value={activePost.imageAltText}
                onChange={e => updatePost(activePost.id, { imageAltText: e.target.value })}
                placeholder="Describe image clearly for screen readers..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none"
              />
              {!activePost.imageAltText && (
                <button
                  onClick={handleAddAltText}
                  className="mt-1 text-[11px] text-fuchsia-400 hover:underline"
                >
                  + Auto-fill recommended descriptive alt-text
                </button>
              )}
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 text-xs">
            <h3 className="text-sm font-semibold text-white">Crisis / Complaint Moderation Response</h3>
            <p className="text-slate-400">A user comments: &ldquo;My certificate download failed 3 times! Total scam!&rdquo;</p>
            <div className="space-y-1.5">
              {[
                { id: 'defensive', label: 'Defensive: "Our servers have 99.9% uptime. Check your own internet."' },
                { id: 'empathetic_actionable', label: 'Empathetic: "So sorry for the frustration! We DM\'d you a direct PDF copy and escalated to tech."' },
                { id: 'ignore', label: 'Ignore comment and delete from post' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => { setCommentResponseChoice(opt.id as any); onDirty(); }}
                  className={`w-full text-left p-2.5 rounded-lg border text-xs transition ${
                    commentResponseChoice === opt.id
                      ? 'bg-fuchsia-500/20 border-fuchsia-500 text-fuchsia-300 font-semibold'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
