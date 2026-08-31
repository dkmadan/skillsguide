import React from 'react';
import { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import { ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | SkillsGuide.in',
  description: 'Official privacy policy and cookie handling standards on SkillsGuide.in.'
};

export default function PrivacyPage() {
  const breadcrumbs = [
    { name: 'Privacy Policy' }
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-10 max-w-4xl mx-auto space-y-8">
      <Breadcrumbs items={breadcrumbs} />

      <div className="glass-card p-6 sm:p-10 rounded-3xl border border-white/10 shadow-2xl space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
        
        <div className="flex items-center gap-2 text-purple-400 font-bold">
          <ShieldCheck className="w-5 h-5" />
          <span>Privacy & Data Protection</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white">Privacy Policy</h1>
        <p>Last updated: 2026</p>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-white">1. Information We Collect</h3>
          <p>
            SkillsGuide.in respects user privacy. We do not sell personal data. The only information collected includes anonymous analytics (page views, browser type) to improve page performance and locally stored preferences (such as saved bookmarks) kept strictly in your own browser storage.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-white">2. Cookies & Local Storage</h3>
          <p>
            We use minimal cookies and browser local storage to remember your saved career roadmaps and dark mode preferences. You can clear your browser storage at any time.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-white">3. Third-Party Links</h3>
          <p>
            Our blueprints provide links to official documentation (e.g. Next.js, Python, PostgreSQL, AWS). We are not responsible for the privacy practices of external websites.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-white">4. Contact</h3>
          <p>
            For privacy inquiries, please contact <strong>dkmadan2k@gmail.com</strong>.
          </p>
        </section>

      </div>
    </div>
  );
}
