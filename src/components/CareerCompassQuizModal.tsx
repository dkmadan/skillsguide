'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Compass, X, ArrowRight, RotateCcw, CheckCircle2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CareerCompassQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CareerCompassQuizModal({ isOpen, onClose }: CareerCompassQuizModalProps) {
  const [background, setBackground] = useState('btech');
  const [coding, setCoding] = useState('moderate_coding');
  const [goal, setGoal] = useState('high_salary');
  const [result, setResult] = useState<any | null>(null);

  if (!isOpen) return null;

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

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // Ignore if confetti fails
    }
  };

  const handleReset = () => {
    setResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-card rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-floating border border-white/15 relative animate-in fade-in zoom-in-95 duration-200 bg-[#121526]/95">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors"
          aria-label="Close Quiz"
        >
          <X className="w-5 h-5" />
        </button>

        {!result ? (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/30 text-purple-300 flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">30-Second Career Compass</h3>
                <p className="text-xs text-slate-400">Discover your highest ROI skilling track for 2026</p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              
              <div>
                <label className="block font-bold text-white mb-1.5">1. What is your background?</label>
                <select 
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs font-semibold text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option value="btech">B.Tech / BCA / MCA / IT Graduate</option>
                  <option value="commerce">B.Com / BBA / Commerce / Finance</option>
                  <option value="arts">BA / Arts / Any Graduate seeking Non-Tech</option>
                  <option value="working">Working in IT / Testing (Seeking 2x Hike)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-white mb-1.5">2. What is your comfort level with coding?</label>
                <select 
                  value={coding}
                  onChange={(e) => setCoding(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs font-semibold text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option value="high_coding">I enjoy programming logic (React, Java, Python)</option>
                  <option value="moderate_coding">Prefer simple queries/scripts (SQL, Excel, Prompts)</option>
                  <option value="zero_coding">Zero coding (Want marketing, accounting, or design)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-white mb-1.5">3. What is your primary career priority?</label>
                <select 
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs font-semibold text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option value="high_salary">Highest starting package in Indian IT/MNCs</option>
                  <option value="fast_job">Get hired fast within 30 to 45 days</option>
                  <option value="freelance_usd">Freelance from home & earn in USD / INR</option>
                  <option value="switch_growth">Mid-Career 2x Salary Leap</option>
                </select>
              </div>

              <button 
                onClick={handleCalculate}
                className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold rounded-xl text-xs transition-all shadow-glow-btn mt-2 flex items-center justify-center gap-2"
              >
                <span>Get Tailored Recommendation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 rounded-2xl bg-purple-500/20 border border-purple-500/30">
              <span className="text-[10px] font-extrabold text-purple-300 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                Top Recommended Track
              </span>
              <h4 className="text-xl font-black text-white mt-1">{result.title}</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{result.desc}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center text-xs">
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="text-slate-400 block text-[10px]">Expected CTC</span>
                <strong className="text-white font-bold">{result.salary}</strong>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="text-slate-400 block text-[10px]">Timeline to Job-Ready</span>
                <strong className="text-emerald-400 font-bold">{result.timeline}</strong>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button 
                onClick={handleReset}
                className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Quiz</span>
              </button>
              <Link 
                href={result.link}
                onClick={onClose}
                className="w-1/2 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors shadow-glow-btn flex items-center justify-center gap-1.5"
              >
                <span>View Blueprint</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
