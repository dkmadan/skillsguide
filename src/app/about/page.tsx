import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import { GraduationCap, Users, Target, ShieldCheck, ArrowRight, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | SkillsGuide.in',
  description: 'Learn about the mission of SkillsGuide.in - bridging career literacy, high-demand skills, and transparent Indian salary benchmarks.'
};

export default function AboutPage() {
  const breadcrumbs = [
    { name: 'About Us' }
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-10 max-w-4xl mx-auto space-y-8">
      <Breadcrumbs items={breadcrumbs} />

      <div className="glass-card p-6 sm:p-10 rounded-3xl border border-white/10 shadow-2xl space-y-8">
        
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-semibold">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Open Indian Career Literacy Mission</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">About SkillsGuide.in</h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            SkillsGuide.in was created to democratize career intelligence for Indian learners, freshers, and working professionals. In an era of rapid technological change and tuition inflation, we believe career roadmaps, real salary benchmarks, and project-based execution should be 100% accessible to everyone.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-1 text-center">
            <span className="text-2xl font-black text-purple-400">100%</span>
            <h4 className="text-xs font-bold text-white">Open Access Guides</h4>
            <p className="text-[11px] text-slate-400">Zero paywalls on blueprints</p>
          </div>
          <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-1 text-center">
            <span className="text-2xl font-black text-emerald-400">₹6L - ₹28L</span>
            <h4 className="text-xs font-bold text-white">Verified Salary Data</h4>
            <p className="text-[11px] text-slate-400">Transparent compensation</p>
          </div>
          <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-1 text-center">
            <span className="text-2xl font-black text-indigo-400">120k+</span>
            <h4 className="text-xs font-bold text-white">Learners Helped</h4>
            <p className="text-[11px] text-slate-400">Across 28 Indian states</p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <h3 className="text-base font-bold text-white">Our Core Principles</h3>
          <ul className="space-y-2 list-disc list-inside text-slate-300">
            <li><strong>Proof of Work over Paper Degrees:</strong> Real deployed GitHub projects, Power BI dashboards, and video showreels win interviews.</li>
            <li><strong>Indian Workplace Realities:</strong> Blueprints tailored specifically for hiring standards across Bengaluru, Hyderabad, Gurugram, Pune, Mumbai, and Tier-2 hubs.</li>
            <li><strong>Radical Transparency:</strong> Clear in-hand salary calculations, break-even timelines, and honest difficulty ratings.</li>
          </ul>
        </div>

        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-slate-400">Join our growing community of self-taught achievers.</span>
          <Link 
            href="/#skills-catalog"
            className="px-6 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-glow-btn flex items-center gap-2"
          >
            <span>Explore All 30+ Tracks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
}
