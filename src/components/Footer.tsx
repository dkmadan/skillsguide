import React from 'react';
import Link from 'next/link';
import { GraduationCap, ShieldAlert, Heart, ExternalLink, MapPin, Mail, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0F1E4A] text-slate-300 pt-16 pb-10 text-xs border-t border-[#1b2d63] relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 inline-flex">
              <div className="w-9 h-9 rounded-2xl bg-[#1E3A8A] border border-[#F2B33D]/30 flex items-center justify-center font-bold text-[#F2B33D] shadow-sm">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xl font-serif font-black tracking-tight text-white">
                Skills<span className="text-[#F2B33D]">Guide</span>.in
              </span>
            </Link>
            <p className="text-slate-300 text-xs leading-relaxed max-w-sm">
              India&apos;s leading career skilling and upward mobility platform. Providing source-linked salary references, structured execution roadmaps, practical cheatsheets, and high-demand subject domain blueprints across tech, pharma, law, education, finance &amp; core engineering.
            </p>
            <div className="pt-2 flex items-center gap-4 text-slate-400">
              <span className="flex items-center gap-1 text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-[#F2B33D]" />
                Bengaluru • Hyderabad • Delhi NCR • Pune • Remote
              </span>
            </div>
          </div>

          {/* Col 2: Healthcare, Law & Edu */}
          <div>
            <h5 className="font-serif font-bold text-[#F2B33D] text-xs uppercase tracking-wider mb-3">
              Healthcare &amp; Law
            </h5>
            <ul className="space-y-2 text-slate-300">
              <li><Link href="/category/pharma-healthcare-life-sciences" className="text-emerald-300 font-semibold hover:underline">Pharma &amp; Health Hub</Link></li>
              <li><Link href="/skills/clinical-pharmacy" className="hover:text-[#F2B33D] transition-colors">Clinical Pharmacy</Link></li>
              <li><Link href="/skills/pharmacovigilance" className="hover:text-[#F2B33D] transition-colors">Pharmacovigilance</Link></li>
              <li><Link href="/category/law-legal-operations" className="text-pink-300 font-semibold hover:underline pt-1 block">Law &amp; Governance Hub</Link></li>
              <li><Link href="/skills/corporate-law" className="hover:text-[#F2B33D] transition-colors">Corporate M&amp;A Law</Link></li>
              <li><Link href="/skills/intellectual-property-law" className="hover:text-[#F2B33D] transition-colors">IP &amp; Patents</Link></li>
              <li><Link href="/category/education-pedagogy" className="text-sky-300 font-semibold hover:underline pt-1 block">Education &amp; EdTech Hub</Link></li>
              <li><Link href="/skills/teaching-pedagogy" className="hover:text-[#F2B33D] transition-colors">Teaching Pedagogy</Link></li>
            </ul>
          </div>

          {/* Col 3: Finance, ERP & Automation */}
          <div>
            <h5 className="font-serif font-bold text-[#F2B33D] text-xs uppercase tracking-wider mb-3">
              Finance &amp; Industry
            </h5>
            <ul className="space-y-2 text-slate-300">
              <li><Link href="/category/accounting-corporate-finance" className="text-amber-300 font-semibold hover:underline">Accounting &amp; Tax Hub</Link></li>
              <li><Link href="/skills/gst-accounting-tally-prime" className="hover:text-[#F2B33D] transition-colors">GST &amp; Tally Prime</Link></li>
              <li><Link href="/skills/financial-modeling-valuation" className="hover:text-[#F2B33D] transition-colors">Financial Modeling</Link></li>
              <li><Link href="/category/enterprise-erp-crm" className="text-purple-300 font-semibold hover:underline pt-1 block">Enterprise ERP &amp; CRM</Link></li>
              <li><Link href="/skills/salesforce-administration" className="hover:text-[#F2B33D] transition-colors">Salesforce Admin</Link></li>
              <li><Link href="/skills/sap-s4hana-fico" className="hover:text-[#F2B33D] transition-colors">SAP S/4HANA FICO</Link></li>
              <li><Link href="/category/industrial-automation-engineering" className="text-cyan-300 font-semibold hover:underline pt-1 block">Automation &amp; Robotics</Link></li>
              <li><Link href="/skills/industrial-automation-plc-scada" className="hover:text-[#F2B33D] transition-colors">PLC &amp; SCADA Ops</Link></li>
            </ul>
          </div>

          {/* Col 4: AI & Emerging Tech */}
          <div>
            <h5 className="font-serif font-bold text-[#F2B33D] text-xs uppercase tracking-wider mb-3">
              <Link href="/category/emerging-tech-ai" className="hover:underline">
                AI &amp; Frontier Tech
              </Link>
            </h5>
            <ul className="space-y-2 text-slate-300">
              <li><Link href="/skills/ai-agents-llm-apps" className="hover:text-[#F2B33D] transition-colors">AI Agents &amp; LLMs</Link></li>
              <li><Link href="/skills/platform-engineering" className="hover:text-[#F2B33D] transition-colors">Platform Engineering</Link></li>
              <li><Link href="/skills/generative-ai-agentic-workflows" className="hover:text-[#F2B33D] transition-colors">Generative AI Workflows</Link></li>
              <li><Link href="/skills/cybersecurity-ethical-hacking" className="hover:text-[#F2B33D] transition-colors">Cybersecurity &amp; SOC</Link></li>
              <li><Link href="/skills/ev-battery-tech" className="hover:text-[#F2B33D] transition-colors">EV Battery &amp; BMS</Link></li>
              <li><Link href="/skills/ui-ux-product-design" className="hover:text-[#F2B33D] transition-colors">UI/UX Product Design</Link></li>
              <li><Link href="/skills/3d-spatial-computing" className="hover:text-[#F2B33D] transition-colors">3D &amp; Spatial Blender</Link></li>
            </ul>
          </div>

          {/* Col 5: Career Tools & Journeys */}
          <div>
            <h5 className="font-serif font-bold text-[#F2B33D] text-xs uppercase tracking-wider mb-3">Labs &amp; Utilities</h5>
            <ul className="space-y-2 text-slate-300">
              <li><Link href="/labs" className="hover:text-amber-300 font-bold text-amber-200 flex items-center gap-1"><span>Virtual Practice Labs</span> <span className="text-[9px] px-1 bg-[#F2B33D]/20 rounded text-[#F2B33D]">30 Labs</span></Link></li>
              <li><Link href="/labs/marketing-budget-simulator" className="hover:text-[#F2B33D] transition-colors">Marketing Budget Sim</Link></li>
              <li><Link href="/labs/seo-snapshot-audit-lab" className="hover:text-[#F2B33D] transition-colors">SEO Snapshot Audit</Link></li>
              <li><Link href="/journeys" className="hover:text-[#F2B33D] font-semibold text-amber-200 transition-colors">Learner Journeys (9 Tracks)</Link></li>
              <li><Link href="/tools/career-compass" className="hover:text-white text-[#F2B33D] font-bold transition-colors">Career Compass (20+ Signals)</Link></li>
              <li><Link href="/tools/salary-calculator" className="hover:text-[#F2B33D] transition-colors">Salary &amp; Tax Calculator</Link></li>
              <li><Link href="/tools/application-tracker" className="hover:text-[#F2B33D] transition-colors">Job Tracker</Link></li>
              <li><Link href="/compare" className="hover:text-[#F2B33D] transition-colors">Skill &amp; Role Comparisons</Link></li>
              <li><Link href="/glossary" className="hover:text-[#F2B33D] transition-colors">Interactive Glossary</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar with Copyright & Mandatory Links */}
        <div className="pt-8 border-t border-[#1b2d63] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} SkillsGuide.in. All rights reserved. Open Indian Career Literacy &amp; Skilling Directory.</p>
          <div className="flex flex-wrap items-center justify-center gap-5">
            <Link href="/disclaimer" className="hover:text-white font-semibold text-[#F2B33D]">Disclaimer</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
            <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
