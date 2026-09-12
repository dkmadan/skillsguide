'use client';

import React, { useState } from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { atsPowerVerbs, cheatSheetsData } from '@/data/toolsData';
import { FileText, Copy, Check, CheckCircle2, ShieldCheck, Layers, Lightbulb } from 'lucide-react';

export default function AtsResumeToolPage() {
  const [copied, setCopied] = useState(false);

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(cheatSheetsData.resume.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const breadcrumbs = [
    { name: 'Career Tools', url: '/#skills-catalog' },
    { name: 'ATS Resume Checklist & Action Verbs' }
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-10 max-w-5xl mx-auto space-y-8">
      <Breadcrumbs items={breadcrumbs} />

      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
          <span>Machine-Readable Parsing Checklist</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          ATS Resume Checklist & Power Action Verbs
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          How Applicant Tracking Systems (ATS) evaluate candidate resumes across formatting readability, taxonomy structure, relevant skill alignment, and verifiable evidence.
        </p>
      </div>

      {/* What ATS Actually Checks Banner */}
      <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>What Modern ATS & Recruiter Parsers Actually Check</span>
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <strong className="text-cyan-300 block font-semibold">1. Machine Readability</strong>
            <p className="text-slate-400 leading-relaxed">Single-column layout with UTF-8 text streams. Multi-column tables, textboxes, and floating shapes scramble OCR and token parsing.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <strong className="text-purple-300 block font-semibold">2. Section Taxonomy</strong>
            <p className="text-slate-400 leading-relaxed">Standard headings (Summary, Technical Skills, Projects, Experience, Education) that algorithms easily map to profile schemas.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <strong className="text-emerald-300 block font-semibold">3. Keyword Alignment</strong>
            <p className="text-slate-400 leading-relaxed">Accurate naming of tools, libraries, and frameworks (e.g., PostgreSQL, DAX, PyTorch) that match target job requirements.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <strong className="text-amber-300 block font-semibold">4. Verifiable Evidence</strong>
            <p className="text-slate-400 leading-relaxed">Action-verb bullet points with live portfolio links (GitHub, NovyPro, Streamlit) that human recruiters can immediately inspect.</p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left: Template & Copy Button */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Single-Column Plain-Text Template</h3>
                <p className="text-xs text-slate-400">Copy and replace marked placeholders with your genuine project metrics.</p>
              </div>
              <button 
                onClick={handleCopyTemplate}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  copied 
                    ? 'bg-emerald-600 text-white shadow-glow-btn' 
                    : 'bg-purple-600 hover:bg-purple-700 text-white shadow-glow-btn'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Template'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto max-h-96 whitespace-pre-wrap leading-relaxed">
              {cheatSheetsData.resume.content}
            </pre>
          </div>

          {/* Practical Guide to Measuring Genuine Results */}
          <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>How to Genuinely Measure Your Project Results (No Fake Numbers)</span>
            </h4>
            <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
                <strong className="text-slate-200">1. Dataset Scale & Complexity:</strong>
                <p className="text-slate-400">State exact numbers from open data sources (e.g., &quot;Cleaned 120,000 order rows across 4 relational tables from Kaggle/RBI Open Data&quot;).</p>
              </div>
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
                <strong className="text-slate-200">2. Technical Performance Benchmarks:</strong>
                <p className="text-slate-400">Measure query or rendering latency before vs. after indexing/normalization (e.g., &quot;Reduced query execution time from 2.4s to 320ms using indexed CTEs&quot;).</p>
              </div>
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
                <strong className="text-slate-200">3. Process Automation Hours:</strong>
                <p className="text-slate-400">Calculate realistic time savings on routine tasks (e.g., &quot;Automated weekly reconciliation that previously took ~4 manual spreadsheet hours per cycle&quot;).</p>
              </div>
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
                <strong className="text-slate-200">4. Model or Code Quality Metrics:</strong>
                <p className="text-slate-400">Report verifiable test coverage or model evaluation scores (e.g., &quot;Achieved 87% F1-score on test split using Scikit-Learn cross-validation&quot;).</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right: Power Verbs Dictionary */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
            <div>
              <h3 className="text-base font-bold text-white">Power Action Verbs</h3>
              <p className="text-xs text-slate-400 mt-0.5">Replace passive words (&quot;Worked on&quot;, &quot;Helped with&quot;) with specific, actionable descriptors.</p>
            </div>

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
                <span className="text-[10px] font-extrabold uppercase text-emerald-400 block mb-1">Optimization & Automation</span>
                <div className="flex flex-wrap gap-1.5">
                  {atsPowerVerbs.optimization.map((v, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 bg-slate-900 text-slate-200 rounded-lg border border-slate-800 font-semibold">{v}</span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-extrabold uppercase text-amber-400 block mb-1">Execution & Delivery</span>
                <div className="flex flex-wrap gap-1.5">
                  {atsPowerVerbs.achievement.map((v, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 bg-slate-900 text-slate-200 rounded-lg border border-slate-800 font-semibold">{v}</span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-extrabold uppercase text-indigo-400 block mb-1">Analysis & Modeling</span>
                <div className="flex flex-wrap gap-1.5">
                  {atsPowerVerbs.analysis.map((v, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 bg-slate-900 text-slate-200 rounded-lg border border-slate-800 font-semibold">{v}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Checklist */}
          <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Final Resume Submission Checklist</span>
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex items-start gap-2">
                <span className="text-purple-400 font-bold">✓</span>
                <span>File saved as standard text-selectable PDF or .docx (not an image scan).</span>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex items-start gap-2">
                <span className="text-purple-400 font-bold">✓</span>
                <span>Contact info includes clickable GitHub, portfolio, and LinkedIn profile URLs.</span>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex items-start gap-2">
                <span className="text-purple-400 font-bold">✓</span>
                <span>Each bullet follows: <strong>[Power Verb] + [Specific Task] + [Quantified Output/Tool]</strong>.</span>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex items-start gap-2">
                <span className="text-purple-400 font-bold">✓</span>
                <span>Page limit: 1 page for &lt; 5 years experience; 2 pages for 5+ years.</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
