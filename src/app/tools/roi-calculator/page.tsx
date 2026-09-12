'use client';

import React, { useState } from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { TrendingUp, IndianRupee, Clock, ShieldCheck, AlertCircle, Sparkles, HelpCircle, Layers, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function RoiCalculatorPage() {
  const [courseFee, setCourseFee] = useState<number>(30000);
  const [equipmentToolsCost, setEquipmentToolsCost] = useState<number>(15000);
  const [learningMonths, setLearningMonths] = useState<number>(4);
  const [jobSearchLagMonths, setJobSearchLagMonths] = useState<number>(3);
  const [monthlyForegoneIncome, setMonthlyForegoneIncome] = useState<number>(0);
  const [currentSalaryLPA, setCurrentSalaryLPA] = useState<number>(4.0);
  const [expectedSalaryLPA, setExpectedSalaryLPA] = useState<number>(7.5);

  const currentAnnual = currentSalaryLPA * 100000;
  const targetAnnual = expectedSalaryLPA * 100000;

  // Direct out-of-pocket costs
  const directInvestment = courseFee + equipmentToolsCost;
  // Opportunity cost / foregone income during study + transition
  const totalStudyMonths = learningMonths;
  const opportunityCost = monthlyForegoneIncome * totalStudyMonths;
  const totalRealInvestment = directInvestment + opportunityCost;

  // Base Case
  const annualBaseHike = Math.max(0, targetAnnual - currentAnnual);
  const monthlyBaseHike = annualBaseHike / 12;
  const baseBreakEvenMonths = monthlyBaseHike > 0 
    ? (totalRealInvestment / monthlyBaseHike + jobSearchLagMonths).toFixed(1) 
    : 'N/A';
  const base3YearNet = annualBaseHike * 3 - totalRealInvestment;
  const base3YearRoiPct = totalRealInvestment > 0 
    ? ((base3YearNet / totalRealInvestment) * 100).toFixed(0) 
    : '0';

  // Conservative Case (Lateral to +10% hike)
  const conservativeTargetAnnual = Math.max(currentAnnual, currentAnnual * 1.10);
  const conservativeAnnualHike = conservativeTargetAnnual - currentAnnual;
  const conservativeMonthlyHike = conservativeAnnualHike / 12;
  const conservativeBreakEvenMonths = conservativeMonthlyHike > 0
    ? (totalRealInvestment / conservativeMonthlyHike + jobSearchLagMonths).toFixed(1)
    : 'No hike (Lateral)';
  const conservative3YearNet = conservativeAnnualHike * 3 - totalRealInvestment;

  // Optimistic Case (+60% hike or higher tier specialization)
  const optimisticTargetAnnual = Math.max(targetAnnual, currentAnnual * 1.60);
  const optimisticAnnualHike = optimisticTargetAnnual - currentAnnual;
  const optimisticMonthlyHike = optimisticAnnualHike / 12;
  const optimisticBreakEvenMonths = optimisticMonthlyHike > 0
    ? (totalRealInvestment / optimisticMonthlyHike + jobSearchLagMonths).toFixed(1)
    : 'N/A';
  const optimistic3YearNet = optimisticAnnualHike * 3 - totalRealInvestment;

  const breadcrumbs = [
    { name: 'Career Tools', url: '/#salary-explorer' },
    { name: 'Career Skilling ROI & Break-Even Calculator' }
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-10 max-w-5xl mx-auto space-y-8">
      <Breadcrumbs items={breadcrumbs} />

      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-semibold">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span>Realistic Career Investment Modeling</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          Skilling ROI & Payback Calculator
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Evaluate the true financial equation of learning new skills: accounts for course fees, hardware, job search lag, and opportunity cost across conservative, base, and optimistic scenarios.
        </p>
      </div>

      <div className="glass-card p-6 sm:p-10 rounded-3xl border border-white/10 shadow-2xl grid lg:grid-cols-12 gap-8">
        
        {/* Left: Input Parameters */}
        <div className="lg:col-span-6 space-y-5">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Investment & Salary Inputs</span>
          </h2>

          {/* Direct Costs */}
          <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5">
                <span>Course / Certification Fee</span>
                <span className="text-purple-300">₹{courseFee.toLocaleString('en-IN')}</span>
              </div>
              <input 
                type="range"
                min="0"
                max="200000"
                step="5000"
                value={courseFee}
                onChange={(e) => setCourseFee(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg cursor-pointer accent-purple-500"
              />
              <span className="text-[10px] text-slate-400">Set to ₹0 if using SkillsGuide free self-learning resources.</span>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5">
                <span>Hardware, Tools & Software Subscriptions</span>
                <span className="text-purple-300">₹{equipmentToolsCost.toLocaleString('en-IN')}</span>
              </div>
              <input 
                type="range"
                min="0"
                max="100000"
                step="2500"
                value={equipmentToolsCost}
                onChange={(e) => setEquipmentToolsCost(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg cursor-pointer accent-purple-500"
              />
              <span className="text-[10px] text-slate-400">RAM upgrade, broadband, IDEs, or cloud lab costs.</span>
            </div>
          </div>

          {/* Time & Opportunity Cost */}
          <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Learning Time: <span className="text-cyan-300">{learningMonths} Mo</span>
                </label>
                <input 
                  type="range"
                  min="1"
                  max="12"
                  step="1"
                  value={learningMonths}
                  onChange={(e) => setLearningMonths(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg cursor-pointer accent-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Hiring Delay: <span className="text-cyan-300">{jobSearchLagMonths} Mo</span>
                </label>
                <input 
                  type="range"
                  min="0"
                  max="9"
                  step="1"
                  value={jobSearchLagMonths}
                  onChange={(e) => setJobSearchLagMonths(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg cursor-pointer accent-cyan-500"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5">
                <span>Monthly Foregone Income (if unpaid study)</span>
                <span className="text-amber-300">₹{monthlyForegoneIncome.toLocaleString('en-IN')} / mo</span>
              </div>
              <input 
                type="range"
                min="0"
                max="60000"
                step="2500"
                value={monthlyForegoneIncome}
                onChange={(e) => setMonthlyForegoneIncome(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg cursor-pointer accent-amber-500"
              />
              <span className="text-[10px] text-slate-400">Leave at ₹0 if studying part-time alongside your current job.</span>
            </div>
          </div>

          {/* Salary Transition */}
          <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5">
                <span>Current Annual CTC</span>
                <span className="text-slate-200">{currentSalaryLPA.toFixed(1)} LPA</span>
              </div>
              <input 
                type="range"
                min="1.0"
                max="30.0"
                step="0.5"
                value={currentSalaryLPA}
                onChange={(e) => setCurrentSalaryLPA(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg cursor-pointer accent-purple-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5">
                <span>Target / Expected CTC</span>
                <span className="text-emerald-400 font-bold">{expectedSalaryLPA.toFixed(1)} LPA</span>
              </div>
              <input 
                type="range"
                min="1.5"
                max="45.0"
                step="0.5"
                value={expectedSalaryLPA}
                onChange={(e) => setExpectedSalaryLPA(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg cursor-pointer accent-emerald-500"
              />
            </div>
          </div>

        </div>

        {/* Right: Results & Multi-Scenario Analysis */}
        <div className="lg:col-span-6 space-y-5">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Payback Analysis & 3 Scenarios</span>
          </h2>

          {/* Primary Summary Box */}
          <div className="rounded-2xl p-5 bg-slate-950/90 border border-slate-800 space-y-4">
            <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-800/80 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total True Investment</span>
                <strong className="text-base font-black text-white mt-0.5 block">
                  ₹{totalRealInvestment.toLocaleString('en-IN')}
                </strong>
                <span className="text-[10px] text-slate-400">Direct: ₹{directInvestment.toLocaleString('en-IN')} | Opp: ₹{opportunityCost.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Base Payback Window</span>
                <strong className="text-base font-black text-emerald-400 mt-0.5 block">
                  {baseBreakEvenMonths !== 'N/A' ? `${baseBreakEvenMonths} Months` : 'N/A'}
                </strong>
                <span className="text-[10px] text-slate-400">Includes {jobSearchLagMonths} mo job-search delay</span>
              </div>
            </div>

            {/* 3 Scenarios Table */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-slate-300 block">3 Multi-Scenario Projections:</span>

              {/* Conservative */}
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-amber-300">1. Conservative / Lateral (+10%)</span>
                  <span className="text-slate-300">₹{(conservativeTargetAnnual / 100000).toFixed(1)} LPA</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Payback: {conservativeBreakEvenMonths}</span>
                  <span className={conservative3YearNet >= 0 ? 'text-emerald-400' : 'text-amber-400'}>
                    3-Yr Net: {conservative3YearNet >= 0 ? '+' : ''}₹{(conservative3YearNet / 100000).toFixed(1)}L
                  </span>
                </div>
              </div>

              {/* Base Case */}
              <div className="p-3 bg-purple-950/30 rounded-xl border border-purple-500/30 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-purple-300">2. Base Target Case ({expectedSalaryLPA.toFixed(1)} LPA)</span>
                  <span className="text-emerald-400 font-bold">+{((annualBaseHike / currentAnnual) * 100).toFixed(0)}% Hike</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-300">
                  <span>Payback: <strong>{baseBreakEvenMonths} Months</strong></span>
                  <span className="text-emerald-400 font-bold">
                    3-Yr Net: +₹{(base3YearNet / 100000).toFixed(1)}L (+{base3YearRoiPct}%)
                  </span>
                </div>
              </div>

              {/* Optimistic */}
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-cyan-300">3. Optimistic / Specialization (+60%)</span>
                  <span className="text-slate-300">₹{(optimisticTargetAnnual / 100000).toFixed(1)} LPA</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Payback: {optimisticBreakEvenMonths} Months</span>
                  <span className="text-emerald-400">
                    3-Yr Net: +₹{(optimistic3YearNet / 100000).toFixed(1)}L
                  </span>
                </div>
              </div>
            </div>

            {/* Opportunity Cost & Risk Caveat */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Career Risk & Planning Caveat</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Zero-tuition self-learning eliminates upfront course fees, but real career progression still requires consistent learning hours, building verifiable project deliverables, and budgeting for interview hiring cycles.
              </p>
            </div>

          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <Link href="/tools/salary-calculator" className="hover:text-purple-300 underline">
              Explore Take-Home In-Hand Salary Calculator →
            </Link>
            <Link href="/#salary-explorer" className="hover:text-purple-300 underline">
              Published Benchmark Explorer →
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
