'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  GraduationCap, 
  Search, 
  Bookmark, 
  ChevronDown, 
  Sparkles, 
  Menu, 
  X, 
  Code, 
  Briefcase, 
  Calculator, 
  MapPin, 
  Compass, 
  FileText, 
  TrendingUp, 
  BookOpen, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

interface NavbarProps {
  onOpenSearch?: () => void;
  onOpenBookmarks?: () => void;
  onOpenQuiz?: () => void;
  bookmarkCount?: number;
}

export default function Navbar({ 
  onOpenSearch, 
  onOpenBookmarks, 
  onOpenQuiz,
  bookmarkCount = 0 
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const toggleDropdown = (menu: string) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  return (
    <header className={`sticky top-0 z-40 px-4 sm:px-6 lg:px-10 pt-3 pb-2 transition-all duration-300 ${scrolled ? 'bg-[#0d0f18]/90 backdrop-blur-xl border-b border-white/10 shadow-lg' : ''}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-brand-500 to-indigo-500 flex items-center justify-center shadow-glow-btn group-hover:scale-105 transition-all">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-white flex items-center gap-1">
              Skills<span className="text-purple-400">Guide</span>
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">.in</span>
            </span>
          </div>
        </Link>

        {/* Central Pill Navigation with Mega Dropdowns */}
        <nav className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-full glass-pill-nav shadow-lg relative">
          
          <Link 
            href="/" 
            className={`px-4 py-2 text-xs font-bold rounded-full transition-all ${pathname === '/' ? 'bg-purple-600 text-white shadow-glow-btn' : 'text-slate-300 hover:text-white'}`}
          >
            Home
          </Link>

          {/* 1. Tech Skills Mega Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setActiveDropdown('tech')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button 
              className={`px-3.5 py-2 text-xs font-semibold rounded-full flex items-center gap-1 transition-colors ${pathname.startsWith('/skills') ? 'text-purple-300 font-bold' : 'text-slate-300 hover:text-white'}`}
              onClick={() => toggleDropdown('tech')}
            >
              <Code className="w-3.5 h-3.5 text-indigo-400" />
              <span>Tech Skills</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {activeDropdown === 'tech' && (
              <div className="absolute top-full left-0 mt-2 w-[520px] rounded-3xl glass-card p-5 shadow-2xl border border-white/15 animate-in fade-in zoom-in-95 duration-150 grid grid-cols-2 gap-3 bg-[#121526]/95 backdrop-blur-2xl">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-400 mb-2 block">High-Demand IT & Data</span>
                  <div className="space-y-1">
                    <Link href="/skills/data-analytics" className="block p-2 rounded-xl hover:bg-white/5 transition-colors group">
                      <div className="text-xs font-bold text-white group-hover:text-purple-300">Data Analytics & BI</div>
                      <div className="text-[10px] text-slate-400">SQL, Power BI, Advanced Excel, Python</div>
                    </Link>
                    <Link href="/skills/ai-prompt-engineering" className="block p-2 rounded-xl hover:bg-white/5 transition-colors group">
                      <div className="text-xs font-bold text-white group-hover:text-purple-300 flex items-center gap-1.5">
                        <span>AI & Prompt Engineering</span>
                        <span className="px-1 py-0.2 bg-purple-500/20 text-purple-300 text-[8px] rounded font-bold">Hot</span>
                      </div>
                      <div className="text-[10px] text-slate-400">RAG, LangChain, Claude, Cursor AI</div>
                    </Link>
                    <Link href="/skills/full-stack-web" className="block p-2 rounded-xl hover:bg-white/5 transition-colors group">
                      <div className="text-xs font-bold text-white group-hover:text-purple-300">Full-Stack Web Dev</div>
                      <div className="text-[10px] text-slate-400">Next.js, React, Node.js, PostgreSQL</div>
                    </Link>
                    <Link href="/skills/data-engineering" className="block p-2 rounded-xl hover:bg-white/5 transition-colors group">
                      <div className="text-xs font-bold text-white group-hover:text-purple-300">Data Engineering</div>
                      <div className="text-[10px] text-slate-400">PySpark, Airflow, Snowflake, Kafka</div>
                    </Link>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400 mb-2 block">Cloud, DevOps & Systems</span>
                  <div className="space-y-1">
                    <Link href="/skills/cloud-computing" className="block p-2 rounded-xl hover:bg-white/5 transition-colors group">
                      <div className="text-xs font-bold text-white group-hover:text-purple-300">AWS & Azure Cloud</div>
                      <div className="text-[10px] text-slate-400">Solutions Architect, SAA-C03</div>
                    </Link>
                    <Link href="/skills/devops-sre" className="block p-2 rounded-xl hover:bg-white/5 transition-colors group">
                      <div className="text-xs font-bold text-white group-hover:text-purple-300">DevOps & SRE</div>
                      <div className="text-[10px] text-slate-400">Docker, Kubernetes (CKA), Terraform</div>
                    </Link>
                    <Link href="/skills/cybersecurity" className="block p-2 rounded-xl hover:bg-white/5 transition-colors group">
                      <div className="text-xs font-bold text-white group-hover:text-purple-300">Cybersecurity SOC</div>
                      <div className="text-[10px] text-slate-400">SIEM Splunk, Wireshark, Threat Triage</div>
                    </Link>
                    <Link href="/skills/java-spring-boot" className="block p-2 rounded-xl hover:bg-white/5 transition-colors group">
                      <div className="text-xs font-bold text-white group-hover:text-purple-300">Java & Spring Boot</div>
                      <div className="text-[10px] text-slate-400">Enterprise Microservices & Banking</div>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. Non IT Skills Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setActiveDropdown('nonit')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button 
              className="px-3.5 py-2 text-xs font-semibold rounded-full flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
              onClick={() => toggleDropdown('nonit')}
            >
              <Briefcase className="w-3.5 h-3.5 text-teal-400" />
              <span>Non IT Skills</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {activeDropdown === 'nonit' && (
              <div className="absolute top-full left-0 mt-2 w-[480px] rounded-3xl glass-card p-5 shadow-2xl border border-white/15 animate-in fade-in zoom-in-95 duration-150 grid grid-cols-2 gap-3 bg-[#121526]/95 backdrop-blur-2xl">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-400 mb-2 block">Commerce & Creator</span>
                  <div className="space-y-1">
                    <Link href="/skills/tally-gst" className="block p-2 rounded-xl hover:bg-white/5 transition-colors group">
                      <div className="text-xs font-bold text-white group-hover:text-teal-300">Tally Prime & GST</div>
                      <div className="text-[10px] text-slate-400">GSTR-1, GSTR-3B, TDS, E-Way</div>
                    </Link>
                    <Link href="/skills/video-editing" className="block p-2 rounded-xl hover:bg-white/5 transition-colors group">
                      <div className="text-xs font-bold text-white group-hover:text-teal-300">Video Editing & Reels</div>
                      <div className="text-[10px] text-slate-400">Premiere Pro, DaVinci, Retention Cuts</div>
                    </Link>
                    <Link href="/skills/graphic-figma" className="block p-2 rounded-xl hover:bg-white/5 transition-colors group">
                      <div className="text-xs font-bold text-white group-hover:text-teal-300">Graphic Design & UI</div>
                      <div className="text-[10px] text-slate-400">Canva, Figma Auto-Layout, Ad Kits</div>
                    </Link>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 mb-2 block">Support & Services</span>
                  <div className="space-y-1">
                    <Link href="/skills/bpo-support" className="block p-2 rounded-xl hover:bg-white/5 transition-colors group">
                      <div className="text-xs font-bold text-white group-hover:text-teal-300">BPO & Voice Process</div>
                      <div className="text-[10px] text-slate-400">Zendesk, Accent, Night Allowance</div>
                    </Link>
                    <Link href="/skills/content-writing-seo" className="block p-2 rounded-xl hover:bg-white/5 transition-colors group">
                      <div className="text-xs font-bold text-white group-hover:text-teal-300">Content Writing & SEO</div>
                      <div className="text-[10px] text-slate-400">Blog Articles, Sales Copywriting</div>
                    </Link>
                    <Link href="/skills/ecommerce-management" className="block p-2 rounded-xl hover:bg-white/5 transition-colors group">
                      <div className="text-xs font-bold text-white group-hover:text-teal-300">Amazon & E-Commerce</div>
                      <div className="text-[10px] text-slate-400">Catalog, PPC Ads, Buy Box</div>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. Business Skills Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setActiveDropdown('business')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button 
              className="px-3.5 py-2 text-xs font-semibold rounded-full flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
              onClick={() => toggleDropdown('business')}
            >
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
              <span>Business Skills</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {activeDropdown === 'business' && (
              <div className="absolute top-full left-0 mt-2 w-[480px] rounded-3xl glass-card p-5 shadow-2xl border border-white/15 animate-in fade-in zoom-in-95 duration-150 grid grid-cols-2 gap-3 bg-[#121526]/95 backdrop-blur-2xl">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 mb-2 block">Growth & Marketing</span>
                  <div className="space-y-1">
                    <Link href="/skills/digital-marketing" className="block p-2 rounded-xl hover:bg-white/5 transition-colors group">
                      <div className="text-xs font-bold text-white group-hover:text-amber-300">Performance Marketing</div>
                      <div className="text-[10px] text-slate-400">Meta Ads, Google Search, GA4, ROAS</div>
                    </Link>
                    <Link href="/skills/freelancing-usd" className="block p-2 rounded-xl hover:bg-white/5 transition-colors group">
                      <div className="text-xs font-bold text-white group-hover:text-amber-300">Global Freelancing (USD)</div>
                      <div className="text-[10px] text-slate-400">Upwork Proposals, Wise, GST LUT</div>
                    </Link>
                    <Link href="/skills/product-management" className="block p-2 rounded-xl hover:bg-white/5 transition-colors group">
                      <div className="text-xs font-bold text-white group-hover:text-amber-300">Product Management</div>
                      <div className="text-[10px] text-slate-400">PRDs, Jira Sprints, User Discovery</div>
                    </Link>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-400 mb-2 block">Professional Fluency</span>
                  <div className="space-y-1">
                    <Link href="/skills/communication-english" className="block p-2 rounded-xl hover:bg-white/5 transition-colors group">
                      <div className="text-xs font-bold text-white group-hover:text-amber-300">Business English & Fluency</div>
                      <div className="text-[10px] text-slate-400">STAR Framework, Email Etiquette</div>
                    </Link>
                    <Link href="/skills/advanced-excel" className="block p-2 rounded-xl hover:bg-white/5 transition-colors group">
                      <div className="text-xs font-bold text-white group-hover:text-amber-300">Advanced Excel & MIS</div>
                      <div className="text-[10px] text-slate-400">XLOOKUP, Power Query, Macros</div>
                    </Link>
                    <Link href="/skills/resume-linkedin" className="block p-2 rounded-xl hover:bg-white/5 transition-colors group">
                      <div className="text-xs font-bold text-white group-hover:text-amber-300">Resume & LinkedIn SEO</div>
                      <div className="text-[10px] text-slate-400">ATS Formatting, Recruiter DMs</div>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4. Roadmap Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setActiveDropdown('roadmaps')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button 
              className={`px-3.5 py-2 text-xs font-semibold rounded-full flex items-center gap-1 transition-colors ${pathname.startsWith('/roadmaps') ? 'text-purple-300 font-bold' : 'text-slate-300 hover:text-white'}`}
              onClick={() => toggleDropdown('roadmaps')}
            >
              <MapPin className="w-3.5 h-3.5 text-purple-400" />
              <span>Roadmap</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {activeDropdown === 'roadmaps' && (
              <div className="absolute top-full left-0 mt-2 w-[420px] rounded-3xl glass-card p-5 shadow-2xl border border-white/15 animate-in fade-in zoom-in-95 duration-150 space-y-1 bg-[#121526]/95 backdrop-blur-2xl">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-400 mb-2 block">Step-by-Step Blueprints</span>
                <Link href="/roadmaps/data-analytics-plan" className="block p-2.5 rounded-xl hover:bg-white/5 transition-colors group">
                  <div className="text-xs font-bold text-white group-hover:text-purple-300">Data Analytics 14-Week Plan</div>
                  <div className="text-[10px] text-slate-400">Excel &rarr; SQL &rarr; Power BI &rarr; Python Pandas</div>
                </Link>
                <Link href="/roadmaps/fullstack-dev-plan" className="block p-2.5 rounded-xl hover:bg-white/5 transition-colors group">
                  <div className="text-xs font-bold text-white group-hover:text-purple-300">Full-Stack Web Dev 18-Week Plan</div>
                  <div className="text-[10px] text-slate-400">React &rarr; Next.js &rarr; Node &rarr; PostgreSQL &rarr; Cloud</div>
                </Link>
                <Link href="/roadmaps/freelancing-upwork-plan" className="block p-2.5 rounded-xl hover:bg-white/5 transition-colors group">
                  <div className="text-xs font-bold text-white group-hover:text-purple-300">Upwork & USD Freelancing 8-Week Plan</div>
                  <div className="text-[10px] text-slate-400">Niche &rarr; Proposal Hooks &rarr; Wise &rarr; 0% GST</div>
                </Link>
                <Link href="/roadmaps/tally-gst-plan" className="block p-2.5 rounded-xl hover:bg-white/5 transition-colors group">
                  <div className="text-xs font-bold text-white group-hover:text-purple-300">Tally Prime & GST 6-Week Plan</div>
                  <div className="text-[10px] text-slate-400">Vouchers &rarr; E-Way &rarr; GSTR-1 &rarr; BRS Balance Sheet</div>
                </Link>
              </div>
            )}
          </div>

          {/* 5. Career Tools Hub */}
          <div 
            className="relative"
            onMouseEnter={() => setActiveDropdown('tools')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button 
              className={`px-3.5 py-2 text-xs font-semibold rounded-full flex items-center gap-1 transition-colors ${pathname.startsWith('/tools') || pathname.startsWith('/glossary') ? 'text-purple-300 font-bold' : 'text-slate-300 hover:text-white'}`}
              onClick={() => toggleDropdown('tools')}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Tools</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {activeDropdown === 'tools' && (
              <div className="absolute top-full right-0 mt-2 w-[340px] rounded-3xl glass-card p-4 shadow-2xl border border-white/15 animate-in fade-in zoom-in-95 duration-150 space-y-1 bg-[#121526]/95 backdrop-blur-2xl">
                <Link href="/tools/salary-calculator" className="block p-2.5 rounded-xl hover:bg-white/5 transition-colors group">
                  <div className="text-xs font-bold text-white group-hover:text-purple-300 flex items-center gap-2">
                    <Calculator className="w-3.5 h-3.5 text-purple-400" />
                    <span>Indian Salary & In-Hand Calculator</span>
                  </div>
                </Link>
                <Link href="/tools/career-compass" className="block p-2.5 rounded-xl hover:bg-white/5 transition-colors group">
                  <div className="text-xs font-bold text-white group-hover:text-purple-300 flex items-center gap-2">
                    <Compass className="w-3.5 h-3.5 text-emerald-400" />
                    <span>30-Sec Career Compass Quiz</span>
                  </div>
                </Link>
                <Link href="/tools/ats-resume" className="block p-2.5 rounded-xl hover:bg-white/5 transition-colors group">
                  <div className="text-xs font-bold text-white group-hover:text-purple-300 flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-indigo-400" />
                    <span>ATS Resume Builder & Power Verbs</span>
                  </div>
                </Link>
                <Link href="/glossary" className="block p-2.5 rounded-xl hover:bg-white/5 transition-colors group">
                  <div className="text-xs font-bold text-white group-hover:text-purple-300 flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-teal-400" />
                    <span>Interactive Skilling Glossary</span>
                  </div>
                </Link>
                <Link href="/disclaimer" className="block p-2.5 rounded-xl hover:bg-white/5 transition-colors group">
                  <div className="text-xs font-bold text-white group-hover:text-amber-300 flex items-center gap-2">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                    <span>Disclaimer & Data Methodology</span>
                  </div>
                </Link>
              </div>
            )}
          </div>

        </nav>

        {/* Right Action Icons & CTAs */}
        <div className="flex items-center gap-2.5">
          
          {/* Quick Search Button (Cmd+K) */}
          <button 
            onClick={onOpenSearch}
            className="p-2.5 rounded-full glass-card hover:border-purple-500/50 text-slate-300 hover:text-white transition-all text-xs flex items-center gap-2"
            title="Instant Search Skills (Cmd+K)"
          >
            <Search className="w-4 h-4" />
            <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[9px] bg-slate-800/80 border border-slate-700 rounded text-slate-400 font-mono">⌘K</kbd>
          </button>

          {/* Bookmarks Drawer Trigger */}
          <button 
            onClick={onOpenBookmarks}
            className="relative p-2.5 rounded-full glass-card hover:border-purple-500/50 text-slate-300 hover:text-white transition-all"
            title="Saved Roadmaps"
          >
            <Bookmark className="w-4 h-4" />
            {bookmarkCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse">
                {bookmarkCount}
              </span>
            )}
          </button>

          {/* Career Quiz CTA */}
          <button 
            onClick={onOpenQuiz}
            className="hidden sm:inline-flex px-4 py-2 text-xs font-bold text-slate-200 hover:text-white transition-colors"
          >
            Career Quiz
          </button>

          {/* Explore Tracks CTA */}
          <Link 
            href="/#skills-catalog"
            className="hidden md:inline-flex px-5 py-2 rounded-full bg-gradient-to-r from-purple-600 via-brand-600 to-indigo-600 text-white text-xs font-bold shadow-glow-btn hover:brightness-110 transition-all items-center gap-1.5"
          >
            <span>Explore Tracks</span>
            <ArrowRight className="w-3 h-3" />
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white glass-card"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 p-5 rounded-3xl glass-card border border-white/15 space-y-3 text-xs font-semibold animate-in slide-in-from-top-4 duration-200 bg-[#0d0f18]/95 backdrop-blur-2xl">
          <Link href="/" className="block p-2.5 rounded-xl text-slate-200 hover:bg-purple-600/20 hover:text-purple-300">
            🏠 Home
          </Link>
          
          <div className="pt-2 border-t border-slate-800">
            <span className="text-[10px] uppercase font-bold text-purple-400 block mb-1">1. Tech Skills</span>
            <div className="grid grid-cols-2 gap-1 text-[11px]">
              <Link href="/skills/data-analytics" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">Data Analytics</Link>
              <Link href="/skills/ai-prompt-engineering" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">AI & Prompts</Link>
              <Link href="/skills/full-stack-web" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">Full-Stack Web</Link>
              <Link href="/skills/cloud-computing" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">AWS / Azure Cloud</Link>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <span className="text-[10px] uppercase font-bold text-teal-400 block mb-1">2. Non IT Skills</span>
            <div className="grid grid-cols-2 gap-1 text-[11px]">
              <Link href="/skills/tally-gst" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">Tally Prime & GST</Link>
              <Link href="/skills/video-editing" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">Video Editing</Link>
              <Link href="/skills/graphic-figma" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">Graphic Design</Link>
              <Link href="/skills/bpo-support" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">BPO & Voice</Link>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <span className="text-[10px] uppercase font-bold text-amber-400 block mb-1">3. Business Skills</span>
            <div className="grid grid-cols-2 gap-1 text-[11px]">
              <Link href="/skills/digital-marketing" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">Digital Marketing</Link>
              <Link href="/skills/communication-english" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">Business English</Link>
              <Link href="/skills/freelancing-usd" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">USD Freelancing</Link>
              <Link href="/skills/advanced-excel" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">Advanced Excel</Link>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <span className="text-[10px] uppercase font-bold text-purple-400 block mb-1">4. Roadmaps & Tools</span>
            <div className="grid grid-cols-2 gap-1 text-[11px]">
              <Link href="/roadmaps/data-analytics-plan" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">Data Roadmap</Link>
              <Link href="/roadmaps/fullstack-dev-plan" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">Fullstack Roadmap</Link>
              <Link href="/tools/salary-calculator" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">Salary Calculator</Link>
              <Link href="/glossary" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">Glossary</Link>
              <Link href="/disclaimer" className="p-2 rounded-lg hover:bg-white/5 text-slate-300 col-span-2">Disclaimer & Legal</Link>
            </div>
          </div>

          <button 
            onClick={() => { setMobileMenuOpen(false); onOpenQuiz?.(); }}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold flex items-center justify-center gap-2 shadow-glow-btn mt-3"
          >
            <Compass className="w-4 h-4 text-amber-300" />
            <span>Take 30-Sec Career Compass</span>
          </button>
        </div>
      )}
    </header>
  );
}
