'use client';

import React, { useState } from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { atsPowerVerbs, cheatSheetsData } from '@/data/toolsData';
import { FileText, Copy, Check, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export default function AtsResumeToolPage() {
  const [copied, setCopied] = useState(false);

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(cheatSheetsData.resume.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const breadcrumbs = [
    { name: 'Career Tools', url: '/#skills-catalog' },
    { name: 'ATS Resume Builder & Power Verbs' }
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-10 max-w-5xl mx-auto space-y-8">
      <Breadcrumbs items={breadcrumbs} />

      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-semibold">
          <FileText className="w-3.5 h-3.5" />
          <span>ATS Optimization Kit (95+ Pass Rate)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          ATS Resume Checklist & Action Verbs
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Format your resume for Naukri, LinkedIn, and MNC applicant tracking systems with verifiable quantitative bullet points.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left: Template & Copy Button */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Single-Column Plain-Text Template</h3>
              <button 
                onClick={handleCopyTemplate}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  copied 
                    ? 'bg-emerald-600 text-white shadow-glow-btn' 
                    : 'bg-purple-600 hover:bg-purple-700 text-white shadow-glow-btn'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Template'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto max-h-96 whitespace-pre-wrap">
              {cheatSheetsData.resume.content}
            </pre>
          </div>

          {/* Golden ATS Rules */}
          <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>5 Golden Rules for 90+ ATS Score</span>
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                1. <strong>Strict Single-Column Layout:</strong> Never use 2-column templates or tables which scramble text parser algorithms.
              </div>
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                2. <strong>Google &quot;X-Y-Z&quot; Bullet Formula:</strong> &quot;Accomplished [X] as measured by [Y] by doing [Z]&quot;.
              </div>
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                3. <strong>Include Standard Headers:</strong> Summary, Technical Skills, Projects, Work Experience, Education.
              </div>
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                4. <strong>Live Project Links:</strong> Always include GitHub, NovyPro, Behance, or live URLs.
              </div>
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                5. <strong>Save as Plain PDF or DOCX:</strong> Avoid image-heavy scans.
              </div>
            </div>
          </div>

        </div>

        {/* Right: Power Verbs Dictionary */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white">Power Action Verbs by Category</h3>
            <p className="text-xs text-slate-400">Replace weak words (&quot;Worked on&quot;, &quot;Helped with&quot;) with strong impactful action verbs.</p>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-purple-400 block mb-1">Leadership & Ownership</span>
                <div className="flex flex-wrap gap-1.5">
                  {atsPowerVerbs.leadership.map((v, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 bg-slate-900 text-slate-200 rounded-lg border border-slate-800 font-semibold">{v}</span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-extrabold uppercase text-emerald-400 block mb-1">Optimization & Efficiency</span>
                <div className="flex flex-wrap gap-1.5">
                  {atsPowerVerbs.optimization.map((v, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 bg-slate-900 text-slate-200 rounded-lg border border-slate-800 font-semibold">{v}</span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-extrabold uppercase text-amber-400 block mb-1">Achievement & Results</span>
                <div className="flex flex-wrap gap-1.5">
                  {atsPowerVerbs.achievement.map((v, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 bg-slate-900 text-slate-200 rounded-lg border border-slate-800 font-semibold">{v}</span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-extrabold uppercase text-indigo-400 block mb-1">Analysis & Engineering</span>
                <div className="flex flex-wrap gap-1.5">
                  {atsPowerVerbs.analysis.map((v, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 bg-slate-900 text-slate-200 rounded-lg border border-slate-800 font-semibold">{v}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
