import React from 'react';
import { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Scale } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Use | SkillsGuide.in',
  description: 'Terms and conditions for utilizing educational guides and career roadmaps on SkillsGuide.in.'
};

export default function TermsPage() {
  const breadcrumbs = [
    { name: 'Terms of Use' }
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-10 max-w-4xl mx-auto space-y-8">
      <Breadcrumbs items={breadcrumbs} />

      <div className="glass-card p-6 sm:p-10 rounded-3xl border border-white/10 shadow-2xl space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
        
        <div className="flex items-center gap-2 text-purple-400 font-bold">
          <Scale className="w-5 h-5" />
          <span>Terms & Conditions</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white">Terms of Use</h1>
        <p>Last updated: 2026</p>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-white">1. Acceptance of Terms</h3>
          <p>
            By accessing and utilizing SkillsGuide.in, you agree to comply with and be bound by these Terms of Use and our published <a href="/disclaimer" className="text-purple-400 underline">Disclaimer</a>.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-white">2. Educational Use</h3>
          <p>
            All content on SkillsGuide.in is intended for personal, non-commercial self-education. You may not scrape or redistribute our complete proprietary roadmap datasets without written consent.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-white">3. Modifications</h3>
          <p>
            We reserve the right to modify these terms and update market salary benchmarks at any time to reflect evolving industry dynamics.
          </p>
        </section>

      </div>
    </div>
  );
}
