import React from 'react';
import Link from 'next/link';
import { GraduationCap, ShieldAlert, Heart, ExternalLink, MapPin, Mail, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0a0c14] text-slate-400 pt-16 pb-10 text-xs border-t border-slate-800/80 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 inline-flex">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-glow-btn">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Skills<span className="text-purple-400">Guide</span>.in
              </span>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              India&apos;s leading career skilling and upward mobility platform. Providing source-linked salary references, structured execution roadmaps, practical cheatsheets, and high-demand subject domain blueprints across tech, pharma, law, education, finance &amp; core engineering.
            </p>
            <div className="pt-2 flex items-center gap-4 text-slate-500">
              <span className="flex items-center gap-1 text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-purple-400" />
                Bengaluru • Hyderabad • Delhi NCR • Pune • Remote
              </span>
            </div>
          </div>

          {/* Col 2: Healthcare, Law & Edu */}
          <div>
            <h5 className="font-extrabold text-white text-xs uppercase tracking-wider mb-3 text-emerald-300">
              Healthcare &amp; Law
            </h5>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/category/pharma-healthcare-life-sciences" className="text-emerald-400 font-semibold hover:underline">Pharma &amp; Health Hub</Link></li>
              <li><Link href="/skills/clinical-pharmacy" className="hover:text-emerald-400 transition-colors">Clinical Pharmacy</Link></li>
              <li><Link href="/skills/pharmacovigilance" className="hover:text-emerald-400 transition-colors">Pharmacovigilance</Link></li>
              <li><Link href="/category/law-legal-operations" className="text-pink-400 font-semibold hover:underline pt-1 block">Law &amp; Governance Hub</Link></li>
              <li><Link href="/skills/corporate-law" className="hover:text-pink-400 transition-colors">Corporate M&amp;A Law</Link></li>
              <li><Link href="/skills/intellectual-property-law" className="hover:text-pink-400 transition-colors">IP &amp; Patents</Link></li>
              <li><Link href="/category/education-pedagogy" className="text-sky-400 font-semibold hover:underline pt-1 block">Education &amp; EdTech Hub</Link></li>
              <li><Link href="/skills/teaching-pedagogy" className="hover:text-sky-400 transition-colors">Teaching Pedagogy</Link></li>
            </ul>
          </div>

          {/* Col 3: Finance, ERP & Automation */}
          <div>
            <h5 className="font-extrabold text-white text-xs uppercase tracking-wider mb-3 text-amber-300">
              Finance &amp; Industry
            </h5>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/category/accounting-corporate-finance" className="text-amber-400 font-semibold hover:underline">Accounting &amp; Tax Hub</Link></li>
              <li><Link href="/skills/gst-accounting-tally-prime" className="hover:text-amber-400 transition-colors">GST &amp; Tally Prime</Link></li>
              <li><Link href="/skills/financial-modeling-valuation" className="hover:text-amber-400 transition-colors">Financial Modeling</Link></li>
              <li><Link href="/category/enterprise-erp-crm" className="text-purple-400 font-semibold hover:underline pt-1 block">Enterprise ERP &amp; CRM</Link></li>
              <li><Link href="/skills/salesforce-administration" className="hover:text-purple-400 transition-colors">Salesforce Admin</Link></li>
              <li><Link href="/skills/sap-s4hana-fico" className="hover:text-purple-400 transition-colors">SAP S/4HANA FICO</Link></li>
              <li><Link href="/category/industrial-automation-engineering" className="text-cyan-400 font-semibold hover:underline pt-1 block">Automation &amp; Robotics</Link></li>
              <li><Link href="/skills/industrial-automation-plc-scada" className="hover:text-cyan-400 transition-colors">PLC &amp; SCADA Ops</Link></li>
            </ul>
          </div>

          {/* Col 4: AI & Emerging Tech */}
          <div>
            <h5 className="font-extrabold text-white text-xs uppercase tracking-wider mb-3 text-purple-300">
              <Link href="/category/emerging-tech-ai" className="hover:underline">
                AI &amp; Frontier Tech
              </Link>
            </h5>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/skills/ai-agents-llm-apps" className="hover:text-purple-400 transition-colors">AI Agents &amp; LLMs</Link></li>
              <li><Link href="/skills/platform-engineering" className="hover:text-purple-400 transition-colors">Platform Engineering</Link></li>
              <li><Link href="/skills/generative-ai-agentic-workflows" className="hover:text-purple-400 transition-colors">Generative AI Workflows</Link></li>
              <li><Link href="/skills/cybersecurity-ethical-hacking" className="hover:text-purple-400 transition-colors">Cybersecurity &amp; SOC</Link></li>
              <li><Link href="/skills/ev-battery-tech" className="hover:text-teal-400 transition-colors">EV Battery &amp; BMS</Link></li>
              <li><Link href="/skills/ui-ux-product-design" className="hover:text-rose-400 transition-colors">UI/UX Product Design</Link></li>
              <li><Link href="/skills/3d-spatial-computing" className="hover:text-rose-400 transition-colors">3D &amp; Spatial Blender</Link></li>
            </ul>
          </div>

          {/* Col 5: Career Tools & Journeys */}
          <div>
            <h5 className="font-extrabold text-white text-xs uppercase tracking-wider mb-3 text-indigo-300">Labs &amp; Utilities</h5>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/labs" className="hover:text-purple-300 font-bold text-purple-400 flex items-center gap-1"><span>Virtual Practice Labs</span> <span className="text-[9px] px-1 bg-purple-500/20 rounded">30 Labs</span></Link></li>
              <li><Link href="/labs/marketing-budget-simulator" className="hover:text-purple-400 transition-colors">Marketing Budget Sim</Link></li>
              <li><Link href="/labs/seo-snapshot-audit-lab" className="hover:text-purple-400 transition-colors">SEO Snapshot Audit</Link></li>
              <li><Link href="/journeys" className="hover:text-indigo-400 font-semibold text-purple-300 transition-colors">Learner Journeys (9 Tracks)</Link></li>
              <li><Link href="/tools/career-compass" className="hover:text-indigo-400 text-amber-300 font-bold transition-colors">Career Compass (20+ Signals)</Link></li>
              <li><Link href="/tools/salary-calculator" className="hover:text-indigo-400 transition-colors">Salary &amp; Tax Calculator</Link></li>
              <li><Link href="/tools/application-tracker" className="hover:text-indigo-400 transition-colors">Job Tracker</Link></li>
              <li><Link href="/compare" className="hover:text-cyan-400 transition-colors">Skill &amp; Role Comparisons</Link></li>
              <li><Link href="/glossary" className="hover:text-indigo-400 transition-colors">Interactive Glossary</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar with Copyright & Mandatory Links */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} SkillsGuide.in. All rights reserved. Open Indian Career Literacy &amp; Skilling Directory.</p>
          <div className="flex flex-wrap items-center justify-center gap-5">
            <Link href="/disclaimer" className="hover:text-slate-300 font-semibold text-amber-400/90">Disclaimer</Link>
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms of Use</Link>
            <Link href="/about" className="hover:text-slate-300 transition-colors">About Us</Link>
            <Link href="/contact" className="hover:text-slate-300 transition-colors">Contact</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
