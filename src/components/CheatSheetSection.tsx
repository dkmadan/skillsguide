'use client';

import React, { useState } from 'react';
import { cheatSheetsData } from '@/data/toolsData';
import { Copy, Check, FileCode, Wand2, FileText, FileSpreadsheet } from 'lucide-react';

export default function CheatSheetSection() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2500);
  };

  const getIcon = (id: string) => {
    switch (id) {
      case 'sql': return <FileCode className="w-5 h-5 text-indigo-400" />;
      case 'prompts': return <Wand2 className="w-5 h-5 text-purple-400" />;
      case 'resume': return <FileText className="w-5 h-5 text-emerald-400" />;
      case 'excel': return <FileSpreadsheet className="w-5 h-5 text-teal-400" />;
      default: return <FileCode className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-10 border-t border-slate-800/80 bg-slate-900/20">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-semibold mb-3">
            <Copy className="w-3.5 h-3.5" />
            <span>Instant Productivity Boosters</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Free Curated Cheat Sheets & Workplace Kits
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Copy battle-tested templates directly into your daily workflow with a single click.
          </p>
        </div>

        {/* Cheat Sheets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.values(cheatSheetsData).map((sheet) => {
            const isCopied = copiedId === sheet.id;
            return (
              <div 
                key={sheet.id}
                className="glass-card p-6 rounded-3xl border border-white/10 hover:border-purple-500/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                      {getIcon(sheet.id)}
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {sheet.badge}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                    {sheet.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {sheet.description}
                  </p>
                </div>

                <button 
                  onClick={() => handleCopy(sheet.id, sheet.content)}
                  className={`mt-6 w-full py-2.5 rounded-xl font-bold text-xs border transition-all flex items-center justify-center gap-2 ${
                    isCopied 
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-glow-btn' 
                      : 'bg-slate-800/90 hover:bg-purple-600 text-white border-slate-700 hover:border-purple-500'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Template</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
