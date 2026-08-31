'use client';

import React, { useState } from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { TrendingUp, IndianRupee, Clock, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function RoiCalculatorPage() {
  const [courseFee, setCourseFee] = useState<number>(35000);
  const [currentSalary, setCurrentSalary] = useState<number>(350000);
  const [expectedSalary, setExpectedSalary] = useState<number>(850000);

  const annualHike = Math.max(0, expectedSalary - currentSalary);
  const monthlyHike = annualHike / 12;
  const breakEvenMonths = monthlyHike > 0 ? (courseFee / monthlyHike).toFixed(1) : '0';
  const threeYearRoi = annualHike > 0 ? (((annualHike * 3) - courseFee) / courseFee * 100).toFixed(0) : '0';

  const breadcrumbs = [
    { name: 'Career Tools', url: '/#salary-explorer' },
    { name: 'Skilling ROI & Break-Even Calculator' }
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-10 max-w-4xl mx-auto space-y-8">
      <Breadcrumbs items={breadcrumbs} />

      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-semibold">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Skilling Return on Investment</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          Career ROI & Break-Even Calculator
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Calculate how quickly your investment in certifications or skill training pays for itself.
        </p>
      </div>

      <div className="glass-card p-6 sm:p-10 rounded-3xl border border-white/10 shadow-2xl grid lg:grid-cols-12 gap-8">
        
        {/* Sliders */}
        <div className="lg:col-span-6 space-y-6">
          
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Certification / Course Fee: ₹{courseFee.toLocaleString('en-IN')}
            </label>
            <input 
              type="range"
              min="0"
              max="200000"
              step="5000"
              value={courseFee}
              onChange={(e) => setCourseFee(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg cursor-pointer accent-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Current Annual CTC: ₹{(currentSalary / 100000).toFixed(1)} LPA
            </label>
            <input 
              type="range"
              min="0"
              max="3000000"
              step="50000"
              value={currentSalary}
              onChange={(e) => setCurrentSalary(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg cursor-pointer accent-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Target / Expected CTC: ₹{(expectedSalary / 100000).toFixed(1)} LPA
            </label>
            <input 
              type="range"
              min="300000"
              max="5000000"
              step="50000"
              value={expectedSalary}
              onChange={(e) => setExpectedSalary(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg cursor-pointer accent-purple-500"
            />
          </div>

        </div>

        {/* Output Metrics */}
        <div className="lg:col-span-6 rounded-2xl p-6 bg-slate-950/80 border border-slate-800 space-y-6 flex flex-col justify-between">
          
          <div>
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">
              Break-Even Payback Period
            </span>
            <p className="text-3xl sm:text-4xl font-black text-emerald-400 mt-1">
              {breakEvenMonths} Months
            </p>
            <span className="text-xs text-slate-400 mt-1 block">
              Your investment is fully recovered in under {Math.ceil(parseFloat(breakEvenMonths))} months on the job.
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Annual CTC Increment</span>
              <strong className="text-white font-bold text-sm">₹{(annualHike / 100000).toFixed(1)} LPA</strong>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">3-Year ROI</span>
              <strong className="text-purple-400 font-bold text-sm">+{threeYearRoi}%</strong>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200">
            ✨ Free self-learning on SkillsGuide.in eliminates course fee friction entirely, giving you infinite ROI!
          </div>

        </div>

      </div>
    </div>
  );
}
