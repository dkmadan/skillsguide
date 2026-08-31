import React from 'react';
import { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import { ShieldAlert, Info, Scale, AlertCircle, FileCheck, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Disclaimer & Salary Data Methodology | SkillsGuide.in',
  description: 'Official legal disclaimer, market salary aggregation methodology, and skilling guidance notice for SkillsGuide.in.',
  keywords: ['skillsguide disclaimer', 'salary data methodology', 'legal terms skillsguide']
};

export default function DisclaimerPage() {
  const breadcrumbs = [
    { name: 'Legal', url: '/disclaimer' },
    { name: 'Disclaimer & Methodology' }
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-10 max-w-4xl mx-auto space-y-8">
      <Breadcrumbs items={breadcrumbs} />

      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-semibold">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          <span>Transparency & Legal Notice</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          Disclaimer & Data Methodology
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Last Updated: 2026 • Official Terms of Guidance on SkillsGuide.in
        </p>
      </div>

      <div className="glass-card p-6 sm:p-10 rounded-3xl border border-white/10 shadow-2xl space-y-8 text-xs sm:text-sm text-slate-300 leading-relaxed">
        
        {/* Section 1: General Information & Guidance */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Info className="w-4 h-4 text-purple-400" />
            <span>1. General Career & Educational Guidance</span>
          </h2>
          <p>
            The content, syllabi, career roadmaps, salary estimations, and tools provided on <strong>SkillsGuide.in</strong> are published in good faith for general informational, career planning, and educational purposes only. SkillsGuide.in is an independent career intelligence directory and does not operate as an accredited educational university, placement agency, or recruitment firm.
          </p>
        </section>

        {/* Section 2: Salary Data & Compensation Methodology */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Scale className="w-4 h-4 text-emerald-400" />
            <span>2. Indian Salary Benchmarks & Methodology</span>
          </h2>
          <p>
            Salary benchmarks, Cost to Company (CTC) figures, and monthly in-hand approximations published on this platform are aggregated from publicly available industry sources, including:
          </p>
          <ul className="space-y-1.5 list-disc list-inside text-slate-400 pl-2">
            <li>Verified Indian tech job disclosures (AmbitionBox, Glassdoor, Instahyre, Naukri)</li>
            <li>Compensation reports from leading Indian recruitment consultancies and Tier-1 staffing agencies</li>
            <li>Direct recruiter salary bracket disclosures across Bengaluru, Hyderabad, NCR, Pune, and Mumbai</li>
          </ul>
          <p>
            Actual compensation offered by employers is subject to multiple individualized variables, including candidate interview performance, prior work experience, academic pedigree, specific company revenue stage, location allowances, and variable incentive clauses. SkillsGuide.in does not guarantee any specific salary or job offer.
          </p>
        </section>

        {/* Section 3: No Placement or Employment Guarantee */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>3. No Guarantee of Employment</span>
          </h2>
          <p>
            While our curated blueprints, weekly milestones, and project recommendations are modeled after modern Indian workplace expectations, completion of any roadmap does not constitute a legal or implied guarantee of employment, internship, or interview callbacks from third-party employers.
          </p>
        </section>

        {/* Section 4: Third-Party Trademarks & External Links */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-indigo-400" />
            <span>4. Trademarks & Brand References</span>
          </h2>
          <p>
            All product names, logos, software brands, and trademarks cited on SkillsGuide.in (including Microsoft Excel, Power BI, Tally Prime, AWS, Azure, Python, React, Next.js, Docker, Kubernetes, Splunk, Figma, Upwork, and others) are the property of their respective trademark owners. Reference to these commercial tools and software products is made strictly for identification, reference, and educational syllabus mapping.
          </p>
        </section>

        {/* Section 5: Limitation of Liability */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>5. Limitation of Liability</span>
          </h2>
          <p>
            In no event shall SkillsGuide.in, its creators, or contributors be held liable for any direct, indirect, incidental, consequential, or punitive damages arising from the use of, or inability to use, the information, tools, formulas, or roadmaps on this website.
          </p>
        </section>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 text-center">
          For questions, data corrections, or partnership queries, contact us at <strong>dkmadan2k@gmail.com</strong>.
        </div>

      </div>
    </div>
  );
}
