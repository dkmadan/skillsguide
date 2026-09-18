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

interface SourceCard {
  id: string;
  source: string;
  verifiedFact: string;
  isReliable: boolean;
}

export default function EditorialFactCheckLab({ onDirty, onSubmit }: Props) {
  const [sources] = useState<SourceCard[]>([
    { id: 'src_1', source: 'IEEE Software Engineering Index 2025', verifiedFact: 'Automated test suites reduce production defect escape rates by 48%.', isReliable: true },
    { id: 'src_2', source: 'Random Anonymous Forum Post', verifiedFact: 'Using tabs instead of spaces makes Python scripts run 3x faster.', isReliable: false }, // Unreliable source
    { id: 'src_3', source: 'ACM Digital Library', verifiedFact: 'Cognitive load decreases by 35% when API response times drop below 200ms.', isReliable: true },
  ]);

  const [selectedSources, setSelectedSources] = useState<string[]>(['src_1', 'src_3']);
  const [articleTitle, setArticleTitle] = useState<string>('Why Deterministic Verification Accelerates Modern Developer Competency');
  const [articleContent, setArticleContent] = useState<string>(
    'Modern engineering education demands verifiable feedback loops rather than passive multiple choice exams.\n\nAccording to the IEEE Software Engineering Index, verified test-driven practice reduces defect escapes by nearly half. Furthermore, maintaining responsive interface feedback mitigates cognitive load for learners, allowing deeper mental engagement with core system architecture.'
  );
  const [revisedSentence, setRevisedSentence] = useState<'clarified' | 'passive_jargon' | 'original'>('clarified');

  const wordCount = useMemo(() => {
    return articleContent.trim().split(/\s+/).filter(Boolean).length;
  }, [articleContent]);

  const hasReliableSourcesOnly = selectedSources.every(sId => {
    const s = sources.find(src => src.id === sId);
    return s && s.isReliable;
  });

  const toggleSource = (id: string) => {
    setSelectedSources(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
    onDirty();
  };

  const handleExportJson = () => {
    downloadJson('editorial_fact_check_article.json', {
      title: articleTitle,
      wordCount,
      selectedSources,
      hasReliableSourcesOnly,
      content: articleContent
    });
  };

  const handleFinalSubmit = () => {
    onSubmit({
      articleTitle,
      wordCount,
      selectedSources,
      hasReliableSourcesOnly,
      content: articleContent,
      revisedSentence
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
              Lab 25 • Technical Writing & Fact Checking
            </span>
            <h2 className="text-xl font-bold text-white mt-2">Editorial Structure, Citation & Fact-Check Lab</h2>
            <p className="text-sm text-slate-400 mt-1">
              Construct a well-structured technical brief. Cite peer-reviewed evidence, reject unsupported forum gossip, and maintain optimal word count length.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              Export Article JSON
            </button>
            <button
              onClick={handleFinalSubmit}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition shadow-lg shadow-violet-600/20"
            >
              Submit Article
            </button>
          </div>
        </div>
      </div>

      {/* Editor & Citation Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Editor */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Drafting Canvas</h3>
            <span className="text-xs font-mono text-slate-400">
              {wordCount} Words (Target: 40 - 150)
            </span>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              value={articleTitle}
              onChange={e => { setArticleTitle(e.target.value); onDirty(); }}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm font-bold text-white focus:outline-none"
              placeholder="Article Headline..."
            />

            <textarea
              rows={8}
              value={articleContent}
              onChange={e => { setArticleContent(e.target.value); onDirty(); }}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 focus:outline-none leading-relaxed"
            />
          </div>
        </div>

        {/* Source Cards & Fact-Check Verifier */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 text-xs">
            <h3 className="text-sm font-semibold text-white">Evidence Citation Repository</h3>
            <p className="text-slate-400">Select peer-reviewed verified facts to cite in the article:</p>

            <div className="space-y-2">
              {sources.map(src => {
                const isSelected = selectedSources.includes(src.id);
                return (
                  <div
                    key={src.id}
                    onClick={() => toggleSource(src.id)}
                    className={`p-3 rounded-xl border transition cursor-pointer ${
                      isSelected
                        ? src.isReliable
                          ? 'bg-emerald-950/20 border-emerald-500/60 text-emerald-200'
                          : 'bg-rose-950/30 border-rose-500/80 text-rose-300'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                      <span>{src.source}</span>
                      <span>{isSelected ? (src.isReliable ? '✓ CITED' : '⚠️ UNRELIABLE SOURCE') : '+ Cite'}</span>
                    </div>
                    <p className="text-[11px] opacity-90">&ldquo;{src.verifiedFact}&rdquo;</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
