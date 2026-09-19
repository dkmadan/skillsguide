'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { LabScenarioVariant, LabDifficulty } from '@/lib/labs/types';
import { createRng } from '@/lib/labs/seedGenerator';
import { downloadCsv, downloadJson } from '@/lib/labs/exportHelper';
import {
  TrendingUp,
  DollarSign,
  Users,
  MousePointer,
  Eye,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  GitFork,
  Sliders,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface Props {
  scenario?: LabScenarioVariant;
  variant: LabDifficulty;
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

interface ChannelDef {
  id: string;
  name: string;
  cpm: number; // Cost per 1,000 impressions
  ctr: number; // Click-through rate
  conversionRate: number; // Lead conversion rate
  variants: { id: string; label: string; ctrDelta: number; convDelta: number }[];
}

const CHANNELS: ChannelDef[] = [
  {
    id: 'meta',
    name: 'Meta Ads (FB/IG)',
    cpm: 120,
    ctr: 0.018,
    conversionRate: 0.040,
    variants: [
      { id: 'v1', label: 'Video Showcase (High Eng)', ctrDelta: 0.004, convDelta: 0.005 },
      { id: 'v2', label: 'Static Carousel (Broad)', ctrDelta: 0.0, convDelta: 0.0 }
    ]
  },
  {
    id: 'google',
    name: 'Google Intent Search',
    cpm: 240,
    ctr: 0.038,
    conversionRate: 0.068,
    variants: [
      { id: 'v1', label: 'Exact Match Intent', ctrDelta: 0.006, convDelta: 0.012 },
      { id: 'v2', label: 'Competitor Alternative', ctrDelta: -0.004, convDelta: -0.006 }
    ]
  },
  {
    id: 'linkedin',
    name: 'LinkedIn Sponsored Updates',
    cpm: 460,
    ctr: 0.014,
    conversionRate: 0.095,
    variants: [
      { id: 'v1', label: 'Whitepaper Download', ctrDelta: 0.003, convDelta: 0.015 },
      { id: 'v2', label: 'Direct Demo CTA', ctrDelta: -0.002, convDelta: -0.005 }
    ]
  },
  {
    id: 'youtube',
    name: 'YouTube In-Stream Explainer',
    cpm: 180,
    ctr: 0.022,
    conversionRate: 0.035,
    variants: [
      { id: 'v1', label: 'Customer Case Study', ctrDelta: 0.003, convDelta: 0.008 }
    ]
  }
];

interface DailyRecord {
  day: number;
  channelId: string;
  spend: number;
  impressions: number;
  clicks: number;
  leads: number;
}

export default function MarketingBudgetSimLab({ variant, onDirty, onSubmit }: Props) {
  const seed = useMemo(() => 42, []);
  const rng = useMemo(() => createRng(seed), [seed]);

  // Channel budget allocations (total budget limit: 100,000)
  const [budgets, setBudgets] = useState<Record<string, number>>({
    meta: 30000,
    google: 45000,
    linkedin: 25000,
    youtube: 0
  });

  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({
    meta: 'v1',
    google: 'v1',
    linkedin: 'v1',
    youtube: 'v1'
  });

  // Simulation day clock (1 to 30)
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [historyLedger, setHistoryLedger] = useState<DailyRecord[]>([]);

  const totalAllocated = useMemo(() => {
    return Object.values(budgets).reduce((a, b) => a + b, 0);
  }, [budgets]);

  const updateBudget = (channelId: string, val: number) => {
    setBudgets(prev => ({ ...prev, [channelId]: Math.max(0, val) }));
    onDirty();
  };

  // Step simulation forward by N days
  const advanceSimulation = (daysToAdvance: number) => {
    const endDay = Math.min(30, currentDay + daysToAdvance - 1);
    const newRecords: DailyRecord[] = [];

    for (let d = currentDay; d <= endDay; d++) {
      CHANNELS.forEach(ch => {
        const totalChannelBudget = budgets[ch.id] || 0;
        const dailySpend = Math.round(totalChannelBudget / 30);
        if (dailySpend <= 0) return;

        const variantObj = ch.variants.find(v => v.id === selectedVariants[ch.id]) || ch.variants[0];
        const effectiveCtr = Math.max(0.001, ch.ctr + (variantObj?.ctrDelta || 0));
        const effectiveConv = Math.max(0.005, ch.conversionRate + (variantObj?.convDelta || 0));

        // Stochastic variation (+-10%) using deterministic rng
        const noise = 0.9 + rng() * 0.2;
        const impressions = Math.round((dailySpend / ch.cpm) * 1000 * noise);
        const clicks = Math.round(impressions * effectiveCtr);
        const leads = Math.round(clicks * effectiveConv);

        newRecords.push({
          day: d,
          channelId: ch.id,
          spend: dailySpend,
          impressions,
          clicks,
          leads
        });
      });
    }

    setHistoryLedger(prev => [...prev, ...newRecords]);
    setCurrentDay(Math.min(31, endDay + 1));
    onDirty();
  };

  // Restart / Reset
  const handleRestart = () => {
    setCurrentDay(1);
    setHistoryLedger([]);
  };

  // Aggregate metrics from the immutable daily ledger
  const aggregateMetrics = useMemo(() => {
    let totalSpend = 0;
    let totalImpressions = 0;
    let totalClicks = 0;
    let totalLeads = 0;

    historyLedger.forEach(r => {
      totalSpend += r.spend;
      totalImpressions += r.impressions;
      totalClicks += r.clicks;
      totalLeads += r.leads;
    });

    const cpl = totalLeads > 0 ? Math.round(totalSpend / totalLeads) : 0;
    const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';
    const cpc = totalClicks > 0 ? (totalSpend / totalClicks).toFixed(2) : '0.00';

    return {
      totalSpend,
      totalImpressions,
      totalClicks,
      totalLeads,
      cpl,
      ctr,
      cpc,
      budgetCompliance: totalAllocated <= 100000,
      targetLeadMet: totalLeads >= 150,
      targetCplMet: cpl > 0 && cpl <= 700
    };
  }, [historyLedger, totalAllocated]);

  const handleSubmit = () => {
    onSubmit({
      variant,
      budgets,
      totalAllocated,
      aggregateMetrics,
      finalDayReached: currentDay > 30,
      passedObjectives: aggregateMetrics.targetLeadMet && aggregateMetrics.targetCplMet && aggregateMetrics.budgetCompliance
    });
  };

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* ===================================================================== */}
      {/* SIMULATION TIMEBAR & PROGRESS CONTROLS                                */}
      {/* ===================================================================== */}
      <div className="p-3 rounded-2xl bg-[#0f1325] border border-white/10 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 font-bold font-mono text-xs">
            <Calendar className="w-3.5 h-3.5" />
            <span>Simulation Clock: Day {Math.min(30, currentDay)} / 30</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => advanceSimulation(1)}
              disabled={currentDay > 30}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-bold transition-all flex items-center gap-1"
            >
              <Play className="w-3 h-3 fill-white" />
              <span>Step +1 Day</span>
            </button>

            <button
              onClick={() => advanceSimulation(7)}
              disabled={currentDay > 30}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-40 text-slate-300 hover:text-white font-bold transition-all"
            >
              <span>+7 Days</span>
            </button>

            <button
              onClick={() => advanceSimulation(30)}
              disabled={currentDay > 30}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-40 text-cyan-300 hover:text-white font-bold transition-all"
            >
              <span>Complete 30 Days</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRestart}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white flex items-center gap-1 transition-all"
            title="Restart simulation from Day 1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Run</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* CHANNEL BUDGET ALLOCATION CARDS                                       */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {CHANNELS.map((ch) => {
          const alloc = budgets[ch.id] || 0;
          return (
            <div key={ch.id} className="p-4 rounded-2xl bg-[#0f1325] border border-white/10 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">{ch.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">CPM: ₹{ch.cpm}</span>
              </div>

              {/* Budget Input & Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Monthly Budget:</span>
                  <span className="font-bold text-purple-300 font-mono">₹{alloc.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="75000"
                  step="5000"
                  value={alloc}
                  onChange={(e) => updateBudget(ch.id, parseInt(e.target.value, 10))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>

              {/* Creative Variant Selection */}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 block font-semibold">Active Creative Variant:</span>
                <select
                  value={selectedVariants[ch.id]}
                  onChange={(e) => {
                    setSelectedVariants(prev => ({ ...prev, [ch.id]: e.target.value }));
                    onDirty();
                  }}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-2 py-1 text-[11px] text-white font-medium truncate"
                >
                  {ch.variants.map((v) => (
                    <option key={v.id} value={v.id} className="bg-[#0f1322]">
                      {v.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          );
        })}
      </div>

      {/* ===================================================================== */}
      {/* PERFORMANCE METRICS OVERVIEW & IMMUTABLE LEDGER                       */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* KPI Scorecard */}
        <div className="lg:col-span-4 p-4 rounded-2xl bg-[#0f1325] border border-white/10 space-y-3 shadow-xl">
          <span className="font-bold text-white text-xs block border-b border-white/5 pb-2">
            Performance Scorecard (Day {Math.min(30, currentDay)})
          </span>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-slate-400">Total Spend:</span>
              <span className="font-bold font-mono text-white">₹{aggregateMetrics.totalSpend.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-slate-400">Total Impressions:</span>
              <span className="font-bold font-mono text-white">{aggregateMetrics.totalImpressions.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-slate-400">Total Clicks:</span>
              <span className="font-bold font-mono text-white">{aggregateMetrics.totalClicks.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-slate-400">Qualified Leads:</span>
              <span className={`font-bold font-mono ${aggregateMetrics.targetLeadMet ? 'text-emerald-400' : 'text-amber-300'}`}>
                {aggregateMetrics.totalLeads} / 150 Target
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-slate-400">Cost Per Lead (CPL):</span>
              <span className={`font-bold font-mono ${aggregateMetrics.targetCplMet ? 'text-emerald-400' : 'text-red-400'}`}>
                ₹{aggregateMetrics.cpl} (Max: ₹700)
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-slate-400">Click-Through Rate (CTR):</span>
              <span className="font-bold font-mono text-cyan-300">{aggregateMetrics.ctr}%</span>
            </div>
          </div>
        </div>

        {/* Immutable Daily History Ledger Table */}
        <div className="lg:col-span-8 rounded-2xl bg-[#0b0e1b] border border-white/10 overflow-hidden shadow-2xl">
          <div className="p-3 bg-[#111425] border-b border-white/10 flex items-center justify-between">
            <span className="font-bold text-white text-xs flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-purple-400" />
              Immutable Daily Ledger ({historyLedger.length} events logged)
            </span>

            <button
              onClick={() => downloadCsv('marketing_ledger.csv', historyLedger as unknown as Record<string, unknown>[])}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-slate-300 flex items-center gap-1"
            >
              Export Ledger
            </button>
          </div>

          <div className="overflow-x-auto max-h-56">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="bg-[#12162a] border-b border-white/10 text-slate-400">
                  <th className="p-2">Day</th>
                  <th className="p-2">Channel</th>
                  <th className="p-2">Spend</th>
                  <th className="p-2">Impressions</th>
                  <th className="p-2">Clicks</th>
                  <th className="p-2">Leads</th>
                </tr>
              </thead>
              <tbody>
                {historyLedger.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-slate-500 italic">
                      No days simulated yet. Advance the clock to record daily results.
                    </td>
                  </tr>
                ) : (
                  historyLedger.slice(-20).map((rec, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="p-2 text-purple-300 font-bold">Day {rec.day}</td>
                      <td className="p-2 text-slate-300">{rec.channelId}</td>
                      <td className="p-2 text-slate-300">₹{rec.spend}</td>
                      <td className="p-2 text-slate-400">{rec.impressions}</td>
                      <td className="p-2 text-slate-400">{rec.clicks}</td>
                      <td className="p-2 text-emerald-400 font-bold">{rec.leads}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* SUBMISSION BAR                                                        */}
      {/* ===================================================================== */}
      <div className="p-4 rounded-2xl bg-[#0f1325] border border-white/10 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span>Allocated: <strong className={aggregateMetrics.budgetCompliance ? 'text-white' : 'text-red-400'}>₹{totalAllocated.toLocaleString()} / ₹100,000</strong></span>
          <span>•</span>
          <span>Leads: <strong className={aggregateMetrics.targetLeadMet ? 'text-emerald-400' : 'text-amber-400'}>{aggregateMetrics.totalLeads}</strong></span>
          <span>•</span>
          <span>CPL: <strong className={aggregateMetrics.targetCplMet ? 'text-emerald-400' : 'text-red-400'}>₹{aggregateMetrics.cpl}</strong></span>
        </div>

        <button
          onClick={handleSubmit}
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
        >
          <span>Submit Marketing Experiment Results</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
