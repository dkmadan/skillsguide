import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { allSalaryGuidesList, getSalaryGuideBySlug } from '@/data/salaryData';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import { TrendingUp, IndianRupee, MapPin, Sparkles, Building, CheckCircle2, ArrowRight } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return allSalaryGuidesList.map((guide) => ({
    slug: guide.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getSalaryGuideBySlug(slug);

  if (!guide) return { title: 'Salary Guide Not Found' };

  return {
    title: `${guide.roleTitle} | CTC & In-Hand Breakdown`,
    description: `Comprehensive 2026 Indian salary benchmarks for ${guide.roleTitle}. Compare Tier-1 vs Tier-2 city compensations, experience scales, and in-hand monthly salaries.`,
    keywords: [guide.roleTitle, 'salary in india', 'in-hand salary calculator', 'fresher salary bangalore']
  };
}

export default async function SalaryGuideDetailPage({ params }: Props) {
  const { slug } = await params;
  const guide = getSalaryGuideBySlug(slug);

  if (!guide) notFound();

  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.roleTitle,
    description: `Indian compensation benchmarks, city variations, and monthly take-home estimations for ${guide.roleTitle}.`,
    author: {
      '@type': 'Organization',
      name: 'SkillsGuide.in'
    }
  };

  const breadcrumbs = [
    { name: 'Salary Explorer', url: '/#salary-explorer' },
    { name: guide.categoryLabel, url: '/#salary-explorer' },
    { name: guide.roleTitle }
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto">
      <JsonLd data={jsonLdData} />
      <Breadcrumbs items={breadcrumbs} />

      {/* Header */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden mb-10">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>2026 Indian Compensation Intelligence</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {guide.roleTitle}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Detailed breakdown of annual CTC packages, post-tax monthly in-hand take-home, and Tier-1 vs Tier-2 hiring hub variations across India.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left: Experience Table & City Benchmarks */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Experience Progression Table */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-emerald-400" />
              <span>Experience-Wise Salary Progression</span>
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-3">Experience Level</th>
                    <th className="pb-3">Average Annual CTC</th>
                    <th className="pb-3">Est. Monthly In-Hand</th>
                    <th className="pb-3">Variable Bonus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {guide.experienceScale.map((scale, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 font-semibold text-white">{scale.expLabel}</td>
                      <td className="py-3 font-bold text-emerald-400">₹{scale.baseLPA.toFixed(1)} LPA</td>
                      <td className="py-3 font-medium text-purple-300">₹{scale.monthlyInHandINR.toLocaleString('en-IN')} / mo</td>
                      <td className="py-3 text-slate-400">₹{scale.bonusLPA} LPA</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* City-Wise Comparison Table */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-purple-400" />
              <span>City-Wise Compensation Benchmarks</span>
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              {guide.cityBenchmarks.map((city, i) => (
                <div key={i} className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-sm">{city.city}</h4>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-800 text-purple-300">
                      {city.tier}
                    </span>
                  </div>

                  <div className="text-xs space-y-1 text-slate-300">
                    <div className="flex justify-between">
                      <span>Average CTC:</span>
                      <strong className="text-emerald-400">₹{city.avgSalaryLPA} LPA</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Senior CTC Range:</span>
                      <strong className="text-slate-200">Up to ₹{city.seniorSalaryLPA} LPA</strong>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 truncate">
                    🏢 <strong>Top Employers:</strong> {city.topCompanies.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Drivers for 30%+ Hikes */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
            <h2 className="text-xl font-black text-white">Factors Driving 30%+ Salary Hikes</h2>
            <div className="space-y-2.5">
              {guide.factorsDrivingHikes.map((factor, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{factor}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Sidebar: Negotiation & Tools */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-3">
            <h3 className="text-sm font-black uppercase text-white">Salary Negotiation Tips</h3>
            <div className="space-y-2.5 text-xs text-slate-300">
              {guide.negotiationTips.map((tip, i) => (
                <div key={i} className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  💡 {tip}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-slate-950 border border-purple-500/30 text-center space-y-3">
            <h4 className="text-sm font-bold text-white">Calculate your exact in-hand salary</h4>
            <p className="text-xs text-slate-300">Compare New vs Old tax regimes with our free interactive calculator.</p>
            <Link 
              href="/tools/salary-calculator"
              className="inline-block w-full py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-glow-btn transition-all"
            >
              Open Tax & Salary Tool
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
