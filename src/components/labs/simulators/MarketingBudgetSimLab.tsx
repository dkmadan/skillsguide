'use client';

import React, { useState, useMemo } from 'react';
import { LabScenarioVariant, LabDifficulty } from '@/lib/labs/types';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  MousePointer, 
  Eye, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Layers,
  Send
} from 'lucide-react';

interface SimulatorProps {
  scenario?: LabScenarioVariant;
  variant: LabDifficulty;
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

export default function MarketingBudgetSimLab({
  scenario,
  variant,
  onDirty,
  onSubmit
}: SimulatorProps) {
  // Scenario values with fallback defaults
  const totalBudgetLimit = 100000;

  // Channel allocations (credits)
  const [metaBudget, setMetaBudget] = useState(30000);
  const [googleBudget, setGoogleBudget] = useState(45000);
  const [linkedinBudget, setLinkedinBudget] = useState(25000);

  // Creative selections
  const [metaCreative, setMetaCreative] = useState('meta_v1');
  const [googleCreative, setGoogleCreative] = useState('goog_v1');
  const [linkedinCreative, setLinkedinCreative] = useState('li_v1');

  // Simulation timeline step
  const [currentDay, setCurrentDay] = useState(1);
  const [isSimulating, setIsSimulating] = useState(false);

  // Learner strategy memo
  const [strategyNotes, setStrategyNotes] = useState(
    'Allocated highest intent spend to Google Search, supported by Meta video branding for top-funnel awareness and LinkedIn for decision-maker conversions.'
  );

  const totalAllocated = metaBudget + googleBudget + linkedinBudget;
  const budgetRemaining = totalBudgetLimit - totalAllocated;

  // Real-time calculations based on deterministic formula
  const metrics = useMemo(() => {
    // Meta: CPM 120, CTR 0.018 + (v1 ? 0.003 : 0), Conv 0.040 + (v1 ? 0.005 : 0)
    const metaImp = (metaBudget / 120) * 1000;
    const metaCtr = 0.018 + (metaCreative === 'meta_v1' ? 0.003 : 0);
    const metaClicks = metaImp * metaCtr;
    const metaConv = 0.040 + (metaCreative === 'meta_v1' ? 0.005 : 0);
    const metaLeads = metaClicks * metaConv;

    // Google: CPM 240, CTR 0.038 + (v1 ? 0.005 : 0), Conv 0.065 + (v1 ? 0.010 : -0.005)
    const googImp = (googleBudget / 240) * 1000;
    const googCtr = 0.038 + (googleCreative === 'goog_v1' ? 0.005 : 0);
    const googClicks = googImp * googCtr;
    const googConv = 0.065 + (googleCreative === 'goog_v1' ? 0.010 : -0.005);
    const googLeads = googClicks * googConv;

    // LinkedIn: CPM 460, CTR 0.014 + (v1 ? 0.002 : -0.002), Conv 0.095 + (v1 ? 0.015 : -0.005)
    const liImp = (linkedinBudget / 460) * 1000;
    const liCtr = 0.014 + (linkedinCreative === 'li_v1' ? 0.002 : -0.002);
    const liClicks = liImp * liCtr;
    const liConv = 0.095 + (linkedinCreative === 'li_v1' ? 0.015 : -0.005);
    const liLeads = liClicks * liConv;

    // Simulation progress scaling (day / 30)
    const dayRatio = Math.min(currentDay / 30, 1.0);

    const activeImpressions = Math.round((metaImp + googImp + liImp) * dayRatio);
    const activeClicks = Math.round((metaClicks + googClicks + liClicks) * dayRatio);
    const activeLeads = Math.round((metaLeads + googLeads + liLeads) * dayRatio);
    const activeSpend = Math.round(totalAllocated * dayRatio);
    const cpl = activeLeads > 0 ? Math.round(activeSpend / activeLeads) : 0;

    return {
      activeImpressions,
      activeClicks,
      activeLeads,
      activeSpend,
      cpl,
      metaLeads: Math.round(metaLeads * dayRatio),
      googLeads: Math.round(googLeads * dayRatio),
      liLeads: Math.round(liLeads * dayRatio)
    };
  }, [metaBudget, googleBudget, linkedinBudget, metaCreative, googleCreative, linkedinCreative, currentDay, totalAllocated]);

  const handleAdvanceDay = () => {
    onDirty();
    setCurrentDay(prev => Math.min(prev + 5, 30));
  };

  const handleRunFullSim = () => {
    onDirty();
    setIsSimulating(true);
    let day = currentDay;
    const interval = setInterval(() => {
      day += 5;
      if (day >= 30) {
        setCurrentDay(30);
        setIsSimulating(false);
        clearInterval(interval);
      } else {
        setCurrentDay(day);
      }
    }, 120);
  };

  const handleSubmit = () => {
    onSubmit({
      metaBudget,
      googleBudget,
      linkedinBudget,
      totalSpend: totalAllocated,
      daysSimulated: currentDay,
      selectedCreatives: {
        meta: metaCreative,
        google: googleCreative,
        linkedin: linkedinCreative
      },
      strategyNotes
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Real-Time KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mb-1">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Spend / Budget</span>
          </div>
          <div className="text-lg sm:text-xl font-black text-white">
            {metrics.activeSpend.toLocaleString()} <span className="text-xs text-slate-400 font-normal">/ 100k</span>
          </div>
          <span className={`text-[10px] font-bold ${budgetRemaining < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
            {budgetRemaining >= 0 ? `${budgetRemaining.toLocaleString()} remaining` : 'Over budget limit!'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mb-1">
            <Eye className="w-4 h-4 text-indigo-400" />
            <span>Impressions</span>
          </div>
          <div className="text-lg sm:text-xl font-black text-white">
            {metrics.activeImpressions.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400">Total ad views</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mb-1">
            <MousePointer className="w-4 h-4 text-cyan-400" />
            <span>Clicks</span>
          </div>
          <div className="text-lg sm:text-xl font-black text-white">
            {metrics.activeClicks.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400">Traffic generated</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#131728] border border-purple-500/30 bg-purple-950/20">
          <div className="flex items-center gap-1.5 text-purple-300 text-xs font-bold mb-1">
            <Users className="w-4 h-4 text-purple-400" />
            <span>Qualified Leads</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-purple-200">
            {metrics.activeLeads} <span className="text-xs font-normal text-slate-400">/ 150 Target</span>
          </div>
          <span className={`text-[10px] font-bold ${metrics.activeLeads >= 150 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {metrics.activeLeads >= 150 ? 'Target achieved!' : `${150 - metrics.activeLeads} needed`}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10 col-span-2 md:col-span-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mb-1">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span>Cost Per Lead (CPL)</span>
          </div>
          <div className="text-lg sm:text-xl font-black text-amber-300">
            {metrics.cpl} <span className="text-xs font-normal text-slate-400">credits</span>
          </div>
          <span className={`text-[10px] font-bold ${metrics.cpl <= 700 && metrics.cpl > 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {metrics.cpl <= 700 ? 'Target efficiency' : 'Ceiling: 700'}
          </span>
        </div>

      </div>

      {/* Main Grid: Controls & Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Cols: Channel Budget Sliders & Creative Selectors */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>1. Multi-Channel Budget Allocation</span>
              </h2>
              <span className="text-xs font-mono text-slate-400">
                Limit: 100,000 credits
              </span>
            </div>

            {/* Channel 1: Meta Ads */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white">Meta Ads (Facebook &amp; Instagram)</span>
                  <p className="text-[10px] text-slate-400">Top-of-funnel reach • CPM: 120 credits</p>
                </div>
                <span className="text-sm font-black font-mono text-purple-300">
                  {metaBudget.toLocaleString()} credits
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="75000"
                step="2500"
                value={metaBudget}
                onChange={(e) => {
                  setMetaBudget(Number(e.target.value));
                  onDirty();
                }}
                className="w-full accent-purple-500 cursor-pointer"
              />
              <div className="pt-1 flex items-center gap-2 text-xs">
                <span className="text-[10px] text-slate-400">Creative Variant:</span>
                <button
                  type="button"
                  onClick={() => { setMetaCreative('meta_v1'); onDirty(); }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                    metaCreative === 'meta_v1'
                      ? 'bg-purple-600/30 text-purple-300 border-purple-500/50'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                  }`}
                >
                  Video Showcase (+0.5% Conv)
                </button>
                <button
                  type="button"
                  onClick={() => { setMetaCreative('meta_v2'); onDirty(); }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                    metaCreative === 'meta_v2'
                      ? 'bg-purple-600/30 text-purple-300 border-purple-500/50'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                  }`}
                >
                  Static Carousel
                </button>
              </div>
            </div>

            {/* Channel 2: Google Search Ads */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white">Google Search Ads</span>
                  <p className="text-[10px] text-slate-400">High-intent searchers • CPM: 240 credits</p>
                </div>
                <span className="text-sm font-black font-mono text-indigo-300">
                  {googleBudget.toLocaleString()} credits
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="75000"
                step="2500"
                value={googleBudget}
                onChange={(e) => {
                  setGoogleBudget(Number(e.target.value));
                  onDirty();
                }}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <div className="pt-1 flex items-center gap-2 text-xs">
                <span className="text-[10px] text-slate-400">Keyword Focus:</span>
                <button
                  type="button"
                  onClick={() => { setGoogleCreative('goog_v1'); onDirty(); }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                    googleCreative === 'goog_v1'
                      ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                  }`}
                >
                  Solution Intent (+1.0% Conv)
                </button>
                <button
                  type="button"
                  onClick={() => { setGoogleCreative('goog_v2'); onDirty(); }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                    googleCreative === 'goog_v2'
                      ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                  }`}
                >
                  Competitor Alternatives
                </button>
              </div>
            </div>

            {/* Channel 3: LinkedIn Sponsored Content */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white">LinkedIn Sponsored Content</span>
                  <p className="text-[10px] text-slate-400">Enterprise B2B decision makers • CPM: 460 credits</p>
                </div>
                <span className="text-sm font-black font-mono text-cyan-300">
                  {linkedinBudget.toLocaleString()} credits
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="75000"
                step="2500"
                value={linkedinBudget}
                onChange={(e) => {
                  setLinkedinBudget(Number(e.target.value));
                  onDirty();
                }}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <div className="pt-1 flex items-center gap-2 text-xs">
                <span className="text-[10px] text-slate-400">Content Angle:</span>
                <button
                  type="button"
                  onClick={() => { setLinkedinCreative('li_v1'); onDirty(); }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                    linkedinCreative === 'li_v1'
                      ? 'bg-cyan-600/30 text-cyan-300 border-cyan-500/50'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                  }`}
                >
                  Executive Whitepaper (+1.5% Conv)
                </button>
                <button
                  type="button"
                  onClick={() => { setLinkedinCreative('li_v2'); onDirty(); }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                    linkedinCreative === 'li_v2'
                      ? 'bg-cyan-600/30 text-cyan-300 border-cyan-500/50'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                  }`}
                >
                  Direct Product Demo
                </button>
              </div>
            </div>

          </div>

          {/* Strategy Rationale */}
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-2">
            <label htmlFor="strategy-notes" className="text-xs font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>2. Strategy Rationale &amp; Optimization Notes</span>
            </label>
            <textarea
              id="strategy-notes"
              rows={2}
              value={strategyNotes}
              onChange={(e) => {
                setStrategyNotes(e.target.value);
                onDirty();
              }}
              placeholder="Explain why you divided the budget across these channels..."
              className="w-full text-xs p-3 rounded-xl bg-black/30 border border-white/15 text-slate-200 focus:outline-none focus:border-purple-500/50"
            />
          </div>

        </div>

        {/* Right 5 Cols: Simulation Controls, Funnel & Submission */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Simulation Clock & Progress */}
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-white">3. Simulation Clock</h2>
              <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 font-mono text-xs font-bold">
                Day {currentDay} / 30
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300"
                style={{ width: `${(currentDay / 30) * 100}%` }}
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAdvanceDay}
                disabled={currentDay >= 30 || isSimulating}
                className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/15 disabled:opacity-50 text-xs font-bold text-slate-200 transition-colors"
              >
                +5 Days Step
              </button>
              <button
                type="button"
                onClick={handleRunFullSim}
                disabled={currentDay >= 30 || isSimulating}
                className="flex-1 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-xs font-bold text-purple-200 flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Simulate 30 Days</span>
              </button>
            </div>
          </div>

          {/* Channel Leads Breakdown */}
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Lead Generation by Channel
            </h3>
            
            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Meta Ads</span>
                  <span className="font-bold text-purple-300">{metrics.metaLeads} leads</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full bg-purple-500" style={{ width: `${metrics.activeLeads ? (metrics.metaLeads / metrics.activeLeads) * 100 : 0}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Google Search</span>
                  <span className="font-bold text-indigo-300">{metrics.googLeads} leads</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full bg-indigo-500" style={{ width: `${metrics.activeLeads ? (metrics.googLeads / metrics.activeLeads) * 100 : 0}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>LinkedIn Sponsored</span>
                  <span className="font-bold text-cyan-300">{metrics.liLeads} leads</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full bg-cyan-500" style={{ width: `${metrics.activeLeads ? (metrics.liLeads / metrics.activeLeads) * 100 : 0}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Explicit Submit Button */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-950/40 via-[#111425] to-indigo-950/40 border border-purple-500/30 space-y-3">
            <div>
              <span className="text-xs font-extrabold text-white block">Ready to Validate?</span>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                Submit simulation state for deterministic server evaluation against the 60/25/15 rubric.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-glow-btn transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Submit &amp; Evaluate Lab</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
