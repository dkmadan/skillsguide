'use client';

import React, { useState } from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Calculator, IndianRupee, HelpCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function SalaryCalculatorPage() {
  const [annualCTC, setAnnualCTC] = useState<number>(800000);
  const [cityTier, setCityTier] = useState<'tier1' | 'tier2'>('tier1');
  const [taxRegime, setTaxRegime] = useState<'new' | 'old'>('new');

  // Basic in-hand tax estimation under Indian Finance Act
  const standardDeduction = 75000;
  const basicSalary = annualCTC * 0.40;
  const employeePF = Math.min(basicSalary * 0.12, 21600); // 12% basic or standard
  const professionalTax = 2400; // Annual PT in most states

  const taxableIncome = Math.max(0, annualCTC - standardDeduction - (taxRegime === 'old' ? employeePF + 150000 : 0));

  // Income tax computation (New Regime Simplified Slabs 2024-2026)
  let calculatedTax = 0;
  if (taxRegime === 'new') {
    if (taxableIncome <= 700000) {
      calculatedTax = 0; // Section 87A rebate
    } else {
      if (taxableIncome > 300000) calculatedTax += Math.min(taxableIncome - 300000, 400000) * 0.05;
      if (taxableIncome > 700000) calculatedTax += Math.min(taxableIncome - 700000, 300000) * 0.10;
      if (taxableIncome > 1000000) calculatedTax += Math.min(taxableIncome - 1000000, 200000) * 0.15;
      if (taxableIncome > 1200000) calculatedTax += Math.min(taxableIncome - 1200000, 300000) * 0.20;
      if (taxableIncome > 1500000) calculatedTax += (taxableIncome - 1500000) * 0.30;
      // 4% Health and Education Cess
      calculatedTax = calculatedTax * 1.04;
    }
  } else {
    // Old Regime
    if (taxableIncome > 250000) calculatedTax += Math.min(taxableIncome - 250000, 250000) * 0.05;
    if (taxableIncome > 500000) calculatedTax += Math.min(taxableIncome - 500000, 500000) * 0.20;
    if (taxableIncome > 1000000) calculatedTax += (taxableIncome - 1000000) * 0.30;
    calculatedTax = calculatedTax * 1.04;
  }

  const annualInHand = Math.max(0, annualCTC - employeePF - professionalTax - calculatedTax);
  const monthlyInHand = Math.round(annualInHand / 12);
  const monthlyPF = Math.round(employeePF / 12);
  const monthlyTax = Math.round(calculatedTax / 12);

  const breadcrumbs = [
    { name: 'Career Tools', url: '/#salary-explorer' },
    { name: 'Indian In-Hand Salary Calculator' }
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-10 max-w-5xl mx-auto space-y-8">
      <Breadcrumbs items={breadcrumbs} />

      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-semibold">
          <Calculator className="w-3.5 h-3.5" />
          <span>Real Take-Home Salary Estimator</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Indian CTC to Monthly In-Hand Calculator
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Calculate your exact post-tax take-home pay under New vs Old tax regimes with PF deductions.
        </p>
      </div>

      <div className="glass-card p-6 sm:p-10 rounded-3xl border border-white/10 shadow-2xl grid lg:grid-cols-12 gap-8">
        
        {/* Controls */}
        <div className="lg:col-span-6 space-y-6">
          
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Annual CTC (Cost to Company): ₹{(annualCTC / 100000).toFixed(1)} LPA
            </label>
            <input 
              type="range"
              min="250000"
              max="5000000"
              step="50000"
              value={annualCTC}
              onChange={(e) => setAnnualCTC(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1">
              <span>₹2.5 LPA</span>
              <span>₹15 LPA</span>
              <span>₹30 LPA</span>
              <span>₹50 LPA</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Select Income Tax Regime:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setTaxRegime('new')}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all ${
                  taxRegime === 'new'
                    ? 'bg-purple-600 text-white border-purple-500 shadow-glow-btn'
                    : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                }`}
              >
                New Tax Regime (Default)
              </button>
              <button
                onClick={() => setTaxRegime('old')}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all ${
                  taxRegime === 'old'
                    ? 'bg-purple-600 text-white border-purple-500 shadow-glow-btn'
                    : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                }`}
              >
                Old Tax Regime (80C/HRA)
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200 space-y-1">
            <span className="font-bold block">💡 Standard Deductions Applied:</span>
            <p className="text-slate-300">
              Includes ₹75,000 standard salaried deduction, employee Provident Fund (EPF), and Professional Tax (PT).
            </p>
          </div>

        </div>

        {/* Results */}
        <div className="lg:col-span-6 rounded-2xl p-6 bg-slate-950/80 border border-slate-800 space-y-6 flex flex-col justify-between">
          
          <div>
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">
              Estimated Monthly In-Hand Cash Flow
            </span>
            <p className="text-3xl sm:text-4xl font-black text-emerald-400 mt-1">
              ₹{monthlyInHand.toLocaleString('en-IN')} <span className="text-xs font-medium text-slate-400">/ month</span>
            </p>
            <span className="text-xs text-slate-400 mt-1 block">
              Annual In-Hand: ₹{annualInHand.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Breakdown Table */}
          <div className="space-y-2 border-t border-slate-800 pt-4 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Gross Monthly Salary:</span>
              <strong className="text-white">₹{Math.round(annualCTC / 12).toLocaleString('en-IN')}</strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Monthly EPF Deduction (12%):</span>
              <span className="text-rose-400">- ₹{monthlyPF.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Monthly Income Tax (TDS):</span>
              <span className="text-rose-400">- ₹{monthlyTax.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Monthly Professional Tax:</span>
              <span className="text-rose-400">- ₹200</span>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-500 text-center">
            Exact take-home may vary slightly depending on employer medical insurance and gratuity structure.
          </div>

        </div>

      </div>
    </div>
  );
}
