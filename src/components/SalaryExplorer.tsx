'use client';

import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { salaryDataStore } from '@/data/salaryData';
import { TrendingUp, IndianRupee, MapPin, Sparkles } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function SalaryExplorer() {
  const [selectedTrack, setSelectedTrack] = useState<string>('data-analytics');
  const [expYears, setExpYears] = useState<number>(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const trackData = salaryDataStore[selectedTrack] || salaryDataStore['data-analytics'];

  const expLabels = [
    'Fresher (0 - 1 Yr)',
    '1 - 2 Yrs',
    '2 - 3 Yrs',
    '3 - 4 Yrs',
    '4 - 5 Yrs (Mid-Level)',
    '5 - 6 Yrs',
    '6 - 7 Yrs',
    '7 - 8 Yrs',
    '8+ Yrs (Lead / Principal)'
  ];

  const baseSalary = trackData.baseLPA[expYears] || 5.5;
  const minSal = (baseSalary * 0.85).toFixed(1);
  const maxSal = (baseSalary * 1.15).toFixed(1);
  const monthlyInHand = Math.round((baseSalary * 100000 * 0.82) / 12);

  // City data breakdown
  const blr = parseFloat((baseSalary * 1.1).toFixed(1));
  const hyd = parseFloat((baseSalary * 1.05).toFixed(1));
  const pune = parseFloat((baseSalary * 0.98).toFixed(1));
  const ncr = parseFloat((baseSalary * 1.02).toFixed(1));
  const mum = parseFloat((baseSalary * 1.04).toFixed(1));
  const t2 = parseFloat((baseSalary * 0.75).toFixed(1));

  const chartData = {
    labels: ['Bengaluru', 'Hyderabad', 'Pune', 'NCR (Delhi/Ggn)', 'Mumbai', 'Tier-2 Cities'],
    datasets: [
      {
        label: 'Average Indian CTC (LPA)',
        data: [blr, hyd, pune, ncr, mum, t2],
        backgroundColor: [
          '#a855f7',
          '#9333ea',
          '#7c3aed',
          '#6366f1',
          '#4f46e5',
          '#334155'
        ],
        borderRadius: 8,
        borderSkipped: false
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => `₹${context.raw} LPA`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255, 255, 255, 0.06)' },
        ticks: {
          color: '#94a3b8',
          callback: (value: any) => `₹${value}L`
        }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8' }
      }
    }
  };

  return (
    <section id="salary-explorer" className="py-16 px-4 sm:px-6 lg:px-10 border-t border-slate-800/80 bg-slate-900/40 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-semibold mb-3">
            <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
            <span>Real-Time Indian Market Intelligence</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Interactive Indian Salary & ROI Explorer
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-2">
            Adjust experience and select a track to estimate realistic CTC, monthly in-hand take-home pay, and Tier-1 vs Tier-2 city variations across India.
          </p>
        </div>

        {/* Visualizer Glass Container */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Controls */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Select Track */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  1. Select Target Career Track:
                </label>
                <select 
                  value={selectedTrack}
                  onChange={(e) => setSelectedTrack(e.target.value)}
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl p-3.5 text-xs sm:text-sm font-bold text-white focus:ring-2 focus:ring-purple-500 focus:outline-none cursor-pointer"
                >
                  <option value="data-analytics">Data Analytics & Business Intelligence</option>
                  <option value="ai-prompt-engg">AI Automation & Prompt Engineering</option>
                  <option value="full-stack">Full-Stack Web Development (Next.js / Java)</option>
                  <option value="cloud-devops">Cloud & DevOps / SRE Engineering</option>
                  <option value="cybersecurity">Cybersecurity & SOC Analysis</option>
                  <option value="digital-mktg">Performance Marketing & SEO</option>
                  <option value="tally-gst">Tally Prime & GST Accounting</option>
                  <option value="video-editing">Video Editing & Motion Graphics</option>
                  <option value="bpo-support">International BPO & Tech Support</option>
                </select>
              </div>

              {/* Experience Range Slider */}
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  <span>2. Work Experience:</span>
                  <span className="text-purple-400 font-extrabold text-sm">{expLabels[expYears]}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="8" 
                  step="1" 
                  value={expYears}
                  onChange={(e) => setExpYears(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg cursor-pointer accent-purple-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1">
                  <span>Fresher</span>
                  <span>2 Yrs</span>
                  <span>4 Yrs</span>
                  <span>6 Yrs</span>
                  <span>8+ Yrs (Lead)</span>
                </div>
              </div>

              {/* Key Insight Card */}
              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                <p className="text-xs text-purple-200 font-medium leading-relaxed">
                  💡 <strong className="font-bold">Key Market Takeaway:</strong> <br />
                  <span className="text-slate-300 font-normal">{trackData.insight}</span>
                </p>
              </div>

            </div>

            {/* Right Dynamic Stats & Chart.js */}
            <div className="lg:col-span-7 rounded-2xl p-6 bg-slate-950/60 border border-slate-800">
              
              {/* Stat Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center mb-6">
                
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Estimated Annual CTC</p>
                  <p className="text-lg sm:text-2xl font-black text-purple-300 mt-1">
                    ₹{minSal} - ₹{maxSal} LPA
                  </p>
                  <span className="text-[10px] text-slate-400 font-medium">INR Fixed + Variable</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Estimated Monthly In-Hand</p>
                  <p className="text-lg sm:text-2xl font-black text-emerald-400 mt-1">
                    ₹{monthlyInHand.toLocaleString('en-IN')} / mo
                  </p>
                  <span className="text-[10px] text-slate-400 font-medium">Post-tax & PF deduction</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 col-span-2 sm:col-span-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Top Hiring Hub</p>
                  <p className="text-base sm:text-lg font-bold text-white mt-1.5">
                    {trackData.topCity}
                  </p>
                  <span className="text-[10px] text-purple-400 font-semibold">Highest job density</span>
                </div>

              </div>

              {/* City Comparison Bar Chart */}
              <div className="h-48 sm:h-56 w-full relative">
                {isClient ? (
                  <Bar data={chartData} options={chartOptions} />
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                    Loading Salary Visualizer...
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
