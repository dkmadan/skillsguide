import React from 'react';
import Link from 'next/link';
import { GraduationCap, ShieldAlert, Heart, ExternalLink, MapPin, Mail, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0a0c14] text-slate-400 pt-16 pb-10 text-xs border-t border-slate-800/80 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5 inline-flex">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-glow-btn">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Skills<span className="text-purple-400">Guide</span>.in
              </span>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed">
              India&apos;s leading career skilling and upward mobility platform. Providing verified Indian salary benchmarks, structured execution roadmaps, practical cheatsheets, and high-demand subject domain blueprints.
            </p>
            <div className="pt-2 flex items-center gap-4 text-slate-500">
              <span className="flex items-center gap-1 text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-purple-400" />
                Bengaluru • Gurugram • Pune • Remote
              </span>
            </div>
          </div>

          {/* Col 2: Emerging Tech & AI */}
          <div>
            <h5 className="font-extrabold text-white text-xs uppercase tracking-wider mb-3 text-purple-300">
              <Link href="/category/emerging-tech-ai" className="hover:underline">
                Emerging Tech &amp; AI
              </Link>
            </h5>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/skills/generative-ai-agentic-workflows" className="hover:text-purple-400 transition-colors">Generative AI &amp; Agents</Link></li>
              <li><Link href="/skills/cloud-platform-engineering" className="hover:text-purple-400 transition-colors">Cloud Platform (IaC &amp; SRE)</Link></li>
              <li><Link href="/skills/cybersecurity-ethical-hacking" className="hover:text-purple-400 transition-colors">Cybersecurity &amp; SOC</Link></li>
              <li><Link href="/skills/iot-embedded-systems" className="hover:text-purple-400 transition-colors">IoT &amp; Embedded Rust</Link></li>
              <li><Link href="/skills/data-analytics" className="hover:text-purple-400 transition-colors">Data Analytics &amp; BI</Link></li>
            </ul>
          </div>

          {/* Col 3: Business & No-Code */}
          <div>
            <h5 className="font-extrabold text-white text-xs uppercase tracking-wider mb-3 text-amber-300">
              <Link href="/category/business-growth-nocode" className="hover:underline">
                Business &amp; No-Code
              </Link>
            </h5>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/skills/product-management-growth" className="hover:text-amber-400 transition-colors">Product &amp; Growth Loops</Link></li>
              <li><Link href="/skills/nocode-lowcode-development" className="hover:text-amber-400 transition-colors">No-Code / Low-Code Dev</Link></li>
              <li><Link href="/skills/digital-marketing-seo-performance" className="hover:text-amber-400 transition-colors">Programmatic SEO &amp; Ads</Link></li>
              <li><Link href="/skills/freelancing-usd" className="hover:text-amber-400 transition-colors">Global USD Freelancing</Link></li>
              <li><Link href="/skills/tally-gst" className="hover:text-amber-400 transition-colors">Tally Prime &amp; GST</Link></li>
            </ul>
          </div>

          {/* Col 4: Creative & Green Tech */}
          <div>
            <h5 className="font-extrabold text-white text-xs uppercase tracking-wider mb-3 text-teal-300">
              Creative &amp; Green Tech
            </h5>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/skills/ui-ux-product-design" className="hover:text-rose-400 transition-colors">UI/UX &amp; Design Systems</Link></li>
              <li><Link href="/skills/3d-spatial-computing" className="hover:text-rose-400 transition-colors">3D &amp; Spatial Computing</Link></li>
              <li><Link href="/skills/ev-battery-tech" className="hover:text-teal-400 transition-colors">EV Powertrain &amp; BMS</Link></li>
              <li><Link href="/skills/solar-renewable-energy-design" className="hover:text-teal-400 transition-colors">Solar PVsyst &amp; ESG</Link></li>
              <li><Link href="/skills/video-editing" className="hover:text-teal-400 transition-colors">Video Editing &amp; Reels</Link></li>
            </ul>
          </div>

          {/* Col 5: Career Tools & Legal */}
          <div>
            <h5 className="font-extrabold text-white text-xs uppercase tracking-wider mb-3 text-indigo-300">Tools &amp; Legal</h5>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/tools/salary-calculator" className="hover:text-indigo-400 transition-colors">Salary &amp; Tax Calculator</Link></li>
              <li><Link href="/tools/career-compass" className="hover:text-indigo-400 transition-colors">30-Sec Career Compass</Link></li>
              <li><Link href="/tools/ats-resume" className="hover:text-indigo-400 transition-colors">ATS Resume Checklist</Link></li>
              <li><Link href="/glossary" className="hover:text-indigo-400 transition-colors">Interactive Glossary</Link></li>
              <li>
                <Link href="/disclaimer" className="hover:text-amber-400 text-amber-300/90 font-bold transition-colors flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span>Disclaimer</span>
                </Link>
              </li>
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
