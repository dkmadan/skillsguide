'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Compass, Sparkles, ArrowRight, RotateCcw, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CareerCompassPage() {
  const [background, setBackground] = useState('btech');
  const [coding, setCoding] = useState('moderate_coding');
  const [goal, setGoal] = useState('high_salary');
  const [result, setResult] = useState<any | null>(null);

  const handleCalculate = () => {
    let recTitle = "Data Analytics & Power BI";
    let recDesc = "Combines SQL queries and visual dashboards. Ideal entry point into Indian FinTech, IT, and startup sectors without heavy DSA coding.";
    let recSalary = "₹5.5L – ₹14.0L LPA";
    let recTimeline = "12 – 14 Weeks";
    let recLink = "/skills/data-analytics";

    if (goal === 'freelance_usd') {
      recTitle = "Global Freelancing (USD) & Video / Design";
      recDesc = "High international demand on Upwork/Fiverr with fast turnaround and 0% GST via LUT compliance.";
      recSalary = "₹80,000 – ₹3,50,000 / Month";
      recTimeline = "6 – 8 Weeks";
      recLink = "/skills/freelancing-usd";
    } else if (background === 'commerce' && coding === 'zero_coding') {
      recTitle = "Tally Prime & GST Accounting Compliance";
      recDesc = "Immediate employment in India's massive 6.3 Cr MSME network. Fast-track with practical e-invoicing and TDS filings.";
      recSalary = "₹3.2L – ₹8.0L LPA";
      recTimeline = "6 – 8 Weeks";
      recLink = "/skills/tally-gst";
    } else if (coding === 'high_coding' && goal === 'high_salary') {
      recTitle = "Full-Stack Web Dev (Next.js & PostgreSQL)";
      recDesc = "Core engine of product startups and MNCs. Build verified GitHub full-stack projects with live payment integrations.";
      recSalary = "₹6.0L – ₹18.0L LPA";
      recTimeline = "16 – 20 Weeks";
      recLink = "/skills/full-stack-web";
    } else if (background === 'working') {
      recTitle = "DevOps, SRE & Cloud Architecture";
      recDesc = "Top mid-career salary multiplier. Learn Docker, Kubernetes (CKA), CI/CD, and AWS architecture.";
      recSalary = "₹10.0L – ₹28.0L LPA";
      recTimeline = "14 – 18 Weeks";
      recLink = "/skills/devops-sre";
    } else if (coding === 'zero_coding' && goal === 'fast_job') {
      recTitle = "BPO Voice & International Customer Support";
      recDesc = "Shortest hiring turnaround (1-2 weeks). International voice training and CRM handling with night allowances.";
      recSalary = "₹3.0L – ₹6.5L LPA";
      recTimeline = "2 – 4 Weeks";
      recLink = "/skills/bpo-support";
    }

    setResult({
      title: recTitle,
      desc: recDesc,
      salary: recSalary,
      timeline: recTimeline,
      link: recLink
    });

    try {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const breadcrumbs = [
    { name: 'Career Tools', url: '/#skills-catalog' },
    { name: '30-Sec Career Compass' }
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-10 max-w-4xl mx-auto space-y-8">
      <Breadcrumbs items={breadcrumbs} />

      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-semibold">
          <Compass className="w-3.5 h-3.5" />
          <span>Interactive Career Assessment</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          30-Second Career Compass Quiz
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Find the highest-ROI career track matching your educational background and coding preference.
        </p>
      </div>

      <div className="glass-card p-6 sm:p-10 rounded-3xl border border-white/10 shadow-2xl space-y-6">
        {!result ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-white mb-2">1. What is your background?</label>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { value: 'btech', label: 'B.Tech / BCA / MCA / IT Graduate', desc: 'Computer background or engineering' },
                  { value: 'commerce', label: 'B.Com / BBA / Commerce / Finance', desc: 'Commerce, accounts, or economics' },
                  { value: 'arts', label: 'BA / Arts / Non-Tech Graduate', desc: 'Seeking creative or business roles' },
                  { value: 'working', label: 'Working Professional (Seeking 2x Hike)', desc: 'Transitioning to higher-paying tracks' }
                ].map((item) => (
                  <div 
                    key={item.value}
                    onClick={() => setBackground(item.value)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      background === item.value 
                        ? 'bg-purple-600/20 border-purple-500 ring-2 ring-purple-500' 
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-white text-xs">{item.label}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-white mb-2">2. What is your comfort with coding?</label>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { value: 'high_coding', label: 'High Coding', desc: 'Enjoy React, Java, Python' },
                  { value: 'moderate_coding', label: 'Moderate / Query', desc: 'Prefer SQL, Excel, Prompts' },
                  { value: 'zero_coding', label: 'Zero Coding', desc: 'Design, Accounts, BPO' }
                ].map((item) => (
                  <div 
                    key={item.value}
                    onClick={() => setCoding(item.value)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      coding === item.value 
                        ? 'bg-purple-600/20 border-purple-500 ring-2 ring-purple-500' 
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-white text-xs">{item.label}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-white mb-2">3. What is your primary career goal?</label>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { value: 'high_salary', label: 'Top Package', desc: 'Highest CTC in Indian IT/MNCs' },
                  { value: 'fast_job', label: 'Fast Hiring', desc: 'Job offer in 30 to 45 days' },
                  { value: 'freelance_usd', label: 'USD Freelancing', desc: 'Earn in dollars from home' }
                ].map((item) => (
                  <div 
                    key={item.value}
                    onClick={() => setGoal(item.value)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      goal === item.value 
                        ? 'bg-purple-600/20 border-purple-500 ring-2 ring-purple-500' 
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-white text-xs">{item.label}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={handleCalculate}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black rounded-2xl text-sm shadow-glow-btn transition-all flex items-center justify-center gap-2"
            >
              <span>Calculate My Highest-ROI Match</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 rounded-3xl bg-purple-500/20 border border-purple-500/30">
              <span className="text-xs font-extrabold text-purple-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Your Top Recommended Track</span>
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">{result.title}</h3>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">{result.desc}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400 block">Expected Indian CTC</span>
                <strong className="text-lg sm:text-2xl font-black text-emerald-400 mt-1 block">{result.salary}</strong>
              </div>
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400 block">Job-Ready Timeline</span>
                <strong className="text-lg sm:text-2xl font-black text-purple-300 mt-1 block">{result.timeline}</strong>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button 
                onClick={() => setResult(null)}
                className="w-full sm:w-1/2 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Quiz</span>
              </button>
              <Link 
                href={result.link}
                className="w-full sm:w-1/2 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-glow-btn transition-colors flex items-center justify-center gap-2"
              >
                <span>View Complete Blueprint</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
