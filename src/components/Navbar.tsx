'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { trackCount } from '@/data/siteStats';
import { usePathname } from 'next/navigation';
import { 
  GraduationCap, 
  Search, 
  Bookmark, 
  ChevronDown, 
  Sparkles, 
  Menu, 
  X, 
  MapPin, 
  Compass, 
  FileText, 
  TrendingUp, 
  BookOpen, 
  ArrowRight,
  ShieldAlert,
  Cpu,
  Palette,
  Leaf,
  Zap,
  Calculator,
  Scale,
  Briefcase,
  Layers
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

  // Close mobile drawer and dropdowns on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const toggleDropdown = (menu: string) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  return (
    <header 
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled 
          ? 'bg-[#0a0c16]/95 backdrop-blur-2xl border-b border-white/10 shadow-2xl' 
          : 'bg-[#0d0f18]/90 backdrop-blur-xl border-b border-white/5 shadow-md'
      }`}
    >
      {/* ========================================================================= */}
      {/* LINE 1: Brand Logo, Prominent Large Search Bar & Action CTAs              */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3 md:gap-6">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-brand-500 to-indigo-500 flex items-center justify-center shadow-glow-btn group-hover:scale-105 transition-all">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-white">
                Skills<span className="text-purple-400">Guide</span>
              </span>
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                .in
              </span>
            </div>
            <span className="hidden sm:block text-[10px] text-slate-400 font-medium tracking-wide">
              High-Income Career Blueprints
            </span>
          </div>
        </Link>

        {/* Center: Prominent Big Search Box (Desktop & Tablet) */}
        <div className="hidden md:block flex-1 max-w-xl mx-3 lg:mx-6 min-w-0">
          <button 
            onClick={onOpenSearch}
            type="button"
            className="w-full h-10 sm:h-11 px-3.5 sm:px-4 rounded-full bg-[#15192c]/90 hover:bg-[#1a2038] border border-white/12 hover:border-purple-500/50 text-slate-300 transition-all flex items-center justify-between group shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-500/40 cursor-pointer"
            title="Search skills, blueprints, roadmaps (Press ⌘K)"
          >
            <div className="flex items-center gap-2.5 min-w-0 overflow-hidden text-left">
              <Search className="w-4 h-4 text-purple-400 shrink-0 group-hover:text-purple-300 group-hover:scale-110 transition-transform" />
              <span className="text-xs sm:text-sm text-slate-400 group-hover:text-slate-200 truncate">
                <span className="hidden lg:inline">Search {trackCount} high-income skills, roadmaps, tools, salary guides...</span>
                <span className="lg:hidden">Search {trackCount} skills, roadmaps...</span>
              </span>
            </div>
            
            <div className="flex items-center gap-1 shrink-0 ml-2">
              <kbd className="px-2 py-0.5 text-[10px] font-mono bg-white/10 border border-white/15 rounded-md text-slate-300 font-semibold group-hover:border-purple-400/50 group-hover:text-purple-300 transition-colors shadow-sm">
                ⌘K
              </kbd>
            </div>
          </button>
        </div>

        {/* Right Action Icons & CTAs */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* Mobile Quick Search Icon Button (visible on mobile only) */}
          <button
            onClick={onOpenSearch}
            type="button"
            className="md:hidden p-2 rounded-xl glass-card hover:border-purple-500/50 text-purple-300 hover:text-white transition-all cursor-pointer"
            title="Search skills & roadmaps"
            aria-label="Open search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Bookmarks Drawer Trigger */}
          <button 
            onClick={onOpenBookmarks}
            className="relative p-2 sm:px-3 sm:py-2 rounded-xl glass-card hover:border-purple-500/50 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            title="Saved Roadmaps & Skills"
            aria-label="Open bookmarks"
          >
            <Bookmark className="w-4 h-4 text-purple-300" />
            <span className="hidden xl:inline text-xs font-semibold text-slate-300">Saved</span>
            {bookmarkCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse shadow-glow-btn">
                {bookmarkCount}
              </span>
            )}
          </button>

          {/* Career Quiz CTA */}
          <button 
            onClick={onOpenQuiz}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass-card hover:border-amber-500/50 text-xs font-bold text-slate-200 hover:text-amber-300 transition-all group cursor-pointer"
            title="Take Career Compass Quiz"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-45 transition-transform" />
            <span>Career Quiz</span>
          </button>

          {/* Explore Tracks CTA */}
          <Link 
            href="/#skills-catalog"
            className="hidden lg:inline-flex px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-brand-600 to-indigo-600 text-white text-xs font-bold shadow-glow-btn hover:brightness-110 transition-all items-center gap-1.5 shrink-0"
          >
            <span>Explore Tracks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white glass-card cursor-pointer"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* LINE 2: Categorized Domain Navigation Bar (Desktop lg+)                    */}
      {/* ========================================================================= */}
      <div className="hidden lg:block border-t border-white/5 bg-[#0b0e1b]/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-center relative">
          
          <nav className="flex items-center gap-1 sm:gap-1.5">
            
            {/* Home */}
            <Link 
              href="/" 
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                pathname === '/' 
                  ? 'bg-purple-600 text-white shadow-glow-btn' 
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Home
            </Link>

            {/* 1. All 10 Domain Hubs Mega Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('domains')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button 
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                  pathname.startsWith('/category/') || activeDropdown === 'domains'
                    ? 'text-purple-300 bg-purple-500/10 font-bold' 
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
                onClick={() => toggleDropdown('domains')}
              >
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                <span>All Domains</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${activeDropdown === 'domains' ? 'rotate-180 text-purple-300' : ''}`} />
              </button>

              {activeDropdown === 'domains' && (
                <div className="absolute top-full left-0 pt-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="w-[740px] rounded-2xl nav-dropdown-menu p-5 shadow-2xl border border-white/15">
                    
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-400">
                          10 Career Domain Hubs &amp; Specialized Blueprints
                        </span>
                      </div>
                      <Link 
                        href="/#skills-catalog" 
                        className="text-[11px] font-bold text-purple-300 hover:text-white flex items-center gap-1 group/hub"
                      >
                        <span>Full Skills Catalog ({trackCount}+ Tracks)</span>
                        <ArrowRight className="w-3 h-3 group-hover/hub:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <Link href="/category/emerging-tech-ai" className="p-2.5 rounded-xl hover:bg-white/10 transition-all group flex items-start gap-2.5">
                        <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300 shrink-0">
                          <Cpu className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-purple-300 flex items-center gap-1.5">
                            <span>Emerging Tech &amp; AI</span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono">16 Tracks</span>
                          </div>
                          <div className="text-[10px] text-slate-400 leading-tight mt-0.5">AI Agents, LLMs, SRE, FinOps, Cloud, Security</div>
                        </div>
                      </Link>

                      <Link href="/category/education-pedagogy" className="p-2.5 rounded-xl hover:bg-white/10 transition-all group flex items-start gap-2.5">
                        <div className="p-2 rounded-lg bg-sky-500/20 text-sky-300 shrink-0">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-sky-300 flex items-center gap-1.5">
                            <span>Education &amp; Pedagogy</span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 font-mono">14 Tracks</span>
                          </div>
                          <div className="text-[10px] text-slate-400 leading-tight mt-0.5">NEP 2020, EdTech, Special Ed, School Admin</div>
                        </div>
                      </Link>

                      <Link href="/category/pharma-healthcare-life-sciences" className="p-2.5 rounded-xl hover:bg-white/10 transition-all group flex items-start gap-2.5">
                        <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 shrink-0">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-emerald-300 flex items-center gap-1.5">
                            <span>Pharmacy &amp; Healthcare</span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">17 Tracks</span>
                          </div>
                          <div className="text-[10px] text-slate-400 leading-tight mt-0.5">Clinical Pharmacy, Pharmacovigilance, CDM, GMP</div>
                        </div>
                      </Link>

                      <Link href="/category/law-legal-operations" className="p-2.5 rounded-xl hover:bg-white/10 transition-all group flex items-start gap-2.5">
                        <div className="p-2 rounded-lg bg-pink-500/20 text-pink-300 shrink-0">
                          <Scale className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-pink-300 flex items-center gap-1.5">
                            <span>Law &amp; Corporate Governance</span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-pink-500/20 text-pink-300 font-mono">15 Tracks</span>
                          </div>
                          <div className="text-[10px] text-slate-400 leading-tight mt-0.5">Corporate M&amp;A, IP Patents, DPDP Act, Litigation</div>
                        </div>
                      </Link>

                      <Link href="/category/accounting-corporate-finance" className="p-2.5 rounded-xl hover:bg-white/10 transition-all group flex items-start gap-2.5">
                        <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300 shrink-0">
                          <Calculator className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-amber-300 flex items-center gap-1.5">
                            <span>Accounting &amp; Finance</span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">14 Tracks</span>
                          </div>
                          <div className="text-[10px] text-slate-400 leading-tight mt-0.5">GST Filings, Financial Modeling, Ind AS, US GAAP</div>
                        </div>
                      </Link>

                      <Link href="/category/industrial-automation-engineering" className="p-2.5 rounded-xl hover:bg-white/10 transition-all group flex items-start gap-2.5">
                        <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300 shrink-0">
                          <Zap className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-cyan-300 flex items-center gap-1.5">
                            <span>Industrial Automation &amp; Eng</span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono">14 Tracks</span>
                          </div>
                          <div className="text-[10px] text-slate-400 leading-tight mt-0.5">PLC &amp; SCADA, Robotics ROS2, IoT, CNC Machining</div>
                        </div>
                      </Link>

                      <Link href="/category/enterprise-erp-crm" className="p-2.5 rounded-xl hover:bg-white/10 transition-all group flex items-start gap-2.5">
                        <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300 shrink-0">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-purple-300 flex items-center gap-1.5">
                            <span>Enterprise ERP &amp; CRM</span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono">13 Tracks</span>
                          </div>
                          <div className="text-[10px] text-slate-400 leading-tight mt-0.5">SAP S/4HANA, Salesforce, Oracle, Microsoft Dynamics</div>
                        </div>
                      </Link>

                      <Link href="/category/business-growth-nocode" className="p-2.5 rounded-xl hover:bg-white/10 transition-all group flex items-start gap-2.5">
                        <div className="p-2 rounded-lg bg-orange-500/20 text-orange-300 shrink-0">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-orange-300 flex items-center gap-1.5">
                            <span>Vocational &amp; High Growth</span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-300 font-mono">10 Tracks</span>
                          </div>
                          <div className="text-[10px] text-slate-400 leading-tight mt-0.5">Product Mgmt, Logistics, Medical Coding, No-Code</div>
                        </div>
                      </Link>

                      <Link href="/category/creative-design-media" className="p-2.5 rounded-xl hover:bg-white/10 transition-all group flex items-start gap-2.5">
                        <div className="p-2 rounded-lg bg-rose-500/20 text-rose-300 shrink-0">
                          <Palette className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-rose-300 flex items-center gap-1.5">
                            <span>Creator Economy &amp; Media</span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-mono">10 Tracks</span>
                          </div>
                          <div className="text-[10px] text-slate-400 leading-tight mt-0.5">UI/UX Figma, YouTube Ops, 3D Spatial Blender</div>
                        </div>
                      </Link>

                      <Link href="/category/green-tech-sustainability" className="p-2.5 rounded-xl hover:bg-white/10 transition-all group flex items-start gap-2.5">
                        <div className="p-2 rounded-lg bg-teal-500/20 text-teal-300 shrink-0">
                          <Leaf className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-teal-300 flex items-center gap-1.5">
                            <span>Green Tech &amp; Sustainability</span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-300 font-mono">3 Tracks</span>
                          </div>
                          <div className="text-[10px] text-slate-400 leading-tight mt-0.5">EV BMS Battery Tech, Solar PVsyst, ESG Audits</div>
                        </div>
                      </Link>
                    </div>

                  </div>
                </div>
              )}
            </div>

            {/* 2. Emerging Tech & AI Engineering Mega Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('ai')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button 
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                  pathname.startsWith('/skills/ai-agents') || 
                  pathname.startsWith('/skills/platform-engineering') || 
                  pathname.startsWith('/skills/sre') || 
                  pathname.startsWith('/skills/finops') || 
                  pathname.startsWith('/skills/data-governance') || 
                  pathname.startsWith('/skills/generative-ai') || 
                  pathname.startsWith('/skills/cloud-platform') || 
                  pathname.startsWith('/skills/cybersecurity') || 
                  pathname.startsWith('/category/emerging-tech-ai') ||
                  activeDropdown === 'ai'
                    ? 'text-purple-300 bg-purple-500/10 font-bold' 
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
                onClick={() => toggleDropdown('ai')}
              >
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                <span>Emerging Tech &amp; AI</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${activeDropdown === 'ai' ? 'rotate-180 text-purple-300' : ''}`} />
              </button>

              {activeDropdown === 'ai' && (
                <div className="absolute top-full left-0 pt-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="w-[620px] rounded-2xl nav-dropdown-menu p-5 shadow-2xl border border-white/15">
                    
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-400">
                          Emerging Tech &amp; AI Engineering
                        </span>
                      </div>
                      <Link 
                        href="/category/emerging-tech-ai" 
                        className="text-[11px] font-bold text-purple-300 hover:text-white flex items-center gap-1 group/hub"
                      >
                        <span>View Domain Hub</span>
                        <ArrowRight className="w-3 h-3 group-hover/hub:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-300 mb-2 block">
                          Autonomous AI &amp; IDPs (2026)
                        </span>
                        <div className="space-y-1">
                          <Link href="/skills/ai-agents-llm-apps" className="block p-2 rounded-xl hover:bg-white/10 transition-colors group">
                            <div className="text-xs font-bold text-white group-hover:text-purple-300 flex items-center gap-1.5">
                              <span>AI Agents &amp; LLM Apps</span>
                              <span className="px-1 py-0.2 bg-purple-500/20 text-purple-300 text-[8px] rounded font-bold">Hot</span>
                            </div>
                            <div className="text-[10px] text-slate-400">LangGraph, Anthropic MCP, ReAct, SLMs</div>
                          </Link>

                          <Link href="/skills/platform-engineering" className="block p-2 rounded-xl hover:bg-white/10 transition-colors group">
                            <div className="text-xs font-bold text-white group-hover:text-purple-300 flex items-center gap-1.5">
                              <span>Platform Engineering</span>
                              <span className="px-1 py-0.2 bg-indigo-500/20 text-indigo-300 text-[8px] rounded font-bold">IDP</span>
                            </div>
                            <div className="text-[10px] text-slate-400">Backstage, Crossplane, Terraform, K8s</div>
                          </Link>

                          <Link href="/skills/sre" className="block p-2 rounded-xl hover:bg-white/10 transition-colors group">
                            <div className="text-xs font-bold text-white group-hover:text-purple-300">SRE &amp; Observability</div>
                            <div className="text-[10px] text-slate-400">OpenTelemetry, SLOs, Prometheus, Chaos</div>
                          </Link>

                          <Link href="/skills/finops" className="block p-2 rounded-xl hover:bg-white/10 transition-colors group">
                            <div className="text-xs font-bold text-white group-hover:text-purple-300">Cloud FinOps (Cost Ops)</div>
                            <div className="text-[10px] text-slate-400">FOCUS Spec, Kubecost, Infracost CI/CD</div>
                          </Link>

                          <Link href="/skills/data-governance" className="block p-2 rounded-xl hover:bg-white/10 transition-colors group">
                            <div className="text-xs font-bold text-white group-hover:text-purple-300">Data Governance &amp; Lineage</div>
                            <div className="text-[10px] text-slate-400">Collibra, DPDP 2023, Great Expectations</div>
                          </Link>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2 block">
                          Applied AI &amp; Infrastructure
                        </span>
                        <div className="space-y-1">
                          <Link href="/skills/generative-ai-agentic-workflows" className="block p-2 rounded-xl hover:bg-white/10 transition-colors group">
                            <div className="text-xs font-bold text-white group-hover:text-purple-300">Generative AI Workflows</div>
                            <div className="text-[10px] text-slate-400">LangChain, RAG Pipelines, QLoRA</div>
                          </Link>

                          <Link href="/skills/cloud-platform-engineering" className="block p-2 rounded-xl hover:bg-white/10 transition-colors group">
                            <div className="text-xs font-bold text-white group-hover:text-purple-300">Cloud Infrastructure</div>
                            <div className="text-[10px] text-slate-400">AWS / Azure Architecture, Multi-Cloud</div>
                          </Link>

                          <Link href="/skills/cybersecurity-ethical-hacking" className="block p-2 rounded-xl hover:bg-white/10 transition-colors group">
                            <div className="text-xs font-bold text-white group-hover:text-purple-300">Cybersecurity &amp; SOC</div>
                            <div className="text-[10px] text-slate-400">Pentesting, Splunk SIEM, Zero-Trust</div>
                          </Link>

                          <Link href="/skills/data-analytics" className="block p-2 rounded-xl hover:bg-white/10 transition-colors group">
                            <div className="text-xs font-bold text-white group-hover:text-purple-300">Data Analytics &amp; BI</div>
                            <div className="text-[10px] text-slate-400">SQL, Power BI, Advanced Excel, Python</div>
                          </Link>

                          <Link href="/skills/full-stack-web" className="block p-2 rounded-xl hover:bg-white/10 transition-colors group">
                            <div className="text-xs font-bold text-white group-hover:text-purple-300">Full-Stack Web Dev</div>
                            <div className="text-[10px] text-slate-400">Next.js, TypeScript, PostgreSQL</div>
                          </Link>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>

            {/* 2. Business, Vocational & Growth Mega Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('business')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button 
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                  pathname.startsWith('/skills/gst-practitioner') || 
                  pathname.startsWith('/skills/medical-coding') || 
                  pathname.startsWith('/skills/logistics-supply-chain') || 
                  pathname.startsWith('/skills/insurance') || 
                  pathname.startsWith('/skills/real-estate') || 
                  pathname.startsWith('/skills/product-management') || 
                  pathname.startsWith('/skills/nocode-lowcode') || 
                  pathname.startsWith('/category/business-growth-nocode') ||
                  activeDropdown === 'business'
                    ? 'text-amber-300 bg-amber-500/10 font-bold' 
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
                onClick={() => toggleDropdown('business')}
              >
                <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                <span>Vocational &amp; Business</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${activeDropdown === 'business' ? 'rotate-180 text-amber-300' : ''}`} />
              </button>

              {activeDropdown === 'business' && (
                <div className="absolute top-full left-0 pt-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="w-[620px] rounded-2xl nav-dropdown-menu p-5 shadow-2xl border border-white/15">
                    
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">
                          Vocational Depth &amp; High-Growth Business
                        </span>
                      </div>
                      <Link 
                        href="/category/business-growth-nocode" 
                        className="text-[11px] font-bold text-amber-300 hover:text-white flex items-center gap-1 group/hub"
                      >
                        <span>View Domain Hub</span>
                        <ArrowRight className="w-3 h-3 group-hover/hub:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 mb-2 block">
                          Vocational Depth &amp; BFSI
                        </span>
                        <div className="space-y-1">
                          <Link href="/skills/gst-practitioner" className="block p-2 rounded-xl hover:bg-white/10 transition-colors group">
                            <div className="text-xs font-bold text-white group-hover:text-amber-300 flex items-center gap-1.5">
                              <span>GST Practitioner &amp; Tax</span>
                              <span className="px-1 py-0.2 bg-amber-500/20 text-amber-300 text-[8px] rounded font-bold">Govt</span>
                            </div>
                            <div className="text-[10px] text-slate-400">GSTR-1, 3B, ITC Reconcile, E-Invoicing</div>
                          </Link>

                          <Link href="/skills/medical-coding" className="block p-2 rounded-xl hover:bg-white/10 transition-colors group">
                            <div className="text-xs font-bold text-white group-hover:text-amber-300 flex items-center gap-1.5">
                              <span>Medical Coding &amp; CPC</span>
                              <span className="px-1 py-0.2 bg-emerald-500/20 text-emerald-300 text-[8px] rounded font-bold">RCM</span>
                            </div>
                            <div className="text-[10px] text-slate-400">ICD-10-CM, CPT, HCPCS, AAPC CPC</div>
                          </Link>

                          <Link href="/skills/logistics-supply-chain" className="block p-2 rounded-xl hover:bg-white/10 transition-colors group">
                            <div className="text-xs font-bold text-white group-hover:text-amber-300">Logistics &amp; Supply Chain</div>
                            <div className="text-[10px] text-slate-400">SAP SCM/MM, WMS, Cold-Chain, 3PL</div>
                          </Link>

                          <Link href="/skills/insurance" className="block p-2 rounded-xl hover:bg-white/10 transition-colors group">
                            <div className="text-xs font-bold text-white group-hover:text-amber-300">Insurance &amp; TPA Claims</div>
                            <div className="text-[10px] text-slate-400">Underwriting, Cashless Pre-Auth, FWA</div>
                          </Link>

                          <Link href="/skills/real-estate" className="block p-2 rounded-xl hover:bg-white/10 transition-colors group">
                            <div className="text-xs font-bold text-white group-hover:text-amber-300">Real Estate &amp; RERA Ops</div>
                            <div className="text-[10px] text-slate-400">Sell.Do CRM, RERA Escrow, REIT Yields</div>
                          </Link>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2 block">
                          Modern Growth &amp; No-Code
                        </span>
                        <div className="space-y-1">
                          <Link href="/skills/product-management-growth" className="block p-2 rounded-xl hover:bg-white/10 transition-colors group">
                            <div className="text-xs font-bold text-white group-hover:text-amber-300 flex items-center gap-1.5">
                              <span>Product &amp; Growth</span>
                              <span className="px-1 py-0.2 bg-amber-500/20 text-amber-300 text-[8px] rounded font-bold">Top</span>
                            </div>
                            <div className="text-[10px] text-slate-400">Discovery, Amplitude, PRDs, PLG</div>
                          </Link>

                          <Link href="/skills/nocode-lowcode-development" className="block p-2 rounded-xl hover:bg-white/10 transition-colors group">
                            <div className="text-xs font-bold text-white group-hover:text-amber-300">No-Code / Low-Code</div>
                            <div className="text-[10px] text-slate-400">Bubble, Webflow, Make, Airtable</div>
                          </Link>

                          <Link href="/skills/digital-marketing-seo-performance" className="block p-2 rounded-xl hover:bg-white/10 transition-colors group">
                            <div className="text-xs font-bold text-white group-hover:text-amber-300">SEO &amp; Performance Ads</div>
                            <div className="text-[10px] text-slate-400">Programmatic SEO, Meta &amp; Google Ads</div>
                          </Link>

                          <Link href="/skills/freelancing-usd" className="block p-2 rounded-xl hover:bg-white/10 transition-colors group">
                            <div className="text-xs font-bold text-white group-hover:text-amber-300">Global Freelancing (USD)</div>
                            <div className="text-[10px] text-slate-400">Upwork Proposals, Wise, 0% GST</div>
                          </Link>

                          <Link href="/skills/advanced-excel" className="block p-2 rounded-xl hover:bg-white/10 transition-colors group">
                            <div className="text-xs font-bold text-white group-hover:text-amber-300">Advanced Excel &amp; MIS</div>
                            <div className="text-[10px] text-slate-400">XLOOKUP, Power Query, Macros</div>
                          </Link>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>

            {/* 3. Creative & Creator Economy Mega Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('creative')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button 
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                  pathname.startsWith('/skills/youtube-ops') || 
                  pathname.startsWith('/skills/podcast-production') || 
                  pathname.startsWith('/skills/newsletter-growth') || 
                  pathname.startsWith('/skills/community-management') || 
                  pathname.startsWith('/skills/ui-ux-product-design') || 
                  pathname.startsWith('/skills/3d-spatial-computing') ||
                  pathname.startsWith('/category/creative-design-media') ||
                  activeDropdown === 'creative'
                    ? 'text-rose-300 bg-rose-500/10 font-bold' 
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
                onClick={() => toggleDropdown('creative')}
              >
                <Palette className="w-3.5 h-3.5 text-rose-400" />
                <span>Creator &amp; Creative</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${activeDropdown === 'creative' ? 'rotate-180 text-rose-300' : ''}`} />
              </button>

              {activeDropdown === 'creative' && (
                <div className="absolute top-full left-0 pt-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="w-[600px] rounded-2xl nav-dropdown-menu p-5 shadow-2xl border border-white/15">
                    
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-400">
                          Creator Economy &amp; Creative Design Media
                        </span>
                      </div>
                      <Link 
                        href="/category/creative-design-media" 
                        className="text-[11px] font-bold text-rose-300 hover:text-white flex items-center gap-1 group/hub"
                      >
                        <span>View Domain Hub</span>
                        <ArrowRight className="w-3 h-3 group-hover/hub:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-300 mb-2 block">
                          Creator Economy Systems (2026)
                        </span>
                        <div className="space-y-1">
                          <Link href="/skills/youtube-ops" className="block p-2 rounded-xl hover:bg-white/10 transition-colors group">
                            <div className="text-xs font-bold text-white group-hover:text-rose-300 flex items-center gap-1.5">
                              <span>YouTube Ops &amp; Packaging</span>
                              <span className="px-1 py-0.2 bg-rose-500/20 text-rose-300 text-[8px] rounded font-bold">Hot</span>
                            </div>
                            <div className="text-[10px] text-slate-400">CTR Packaging, Retention Hooks, VidIQ</div>
                          </Link>

                          <Link href="/skills/podcast-production" className="block p-2 rounded-xl hover:bg-white/10 transition-colors group">
                            <div className="text-xs font-bold text-white group-hover:text-rose-300">Podcast Production</div>
                            <div className="text-[10px] text-slate-400">Descript, -16 LUFS Audio, RSS Syndication</div>
                          </Link>

                          <Link href="/skills/newsletter-growth" className="block p-2 rounded-xl hover:bg-white/10 transition-colors group">
                            <div className="text-xs font-bold text-white group-hover:text-rose-300">Newsletter Publishing</div>
                            <div className="text-[10px] text-slate-400">Beehiiv, DMARC Deliverability, Sponsors</div>
                          </Link>

                          <Link href="/skills/community-management" className="block p-2 rounded-xl hover:bg-white/10 transition-colors group">
                            <div className="text-xs font-bold text-white group-hover:text-rose-300">Community Management</div>
                            <div className="text-[10px] text-slate-400">Discord, Circle.so, Retention Flywheels</div>
                          </Link>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2 block">
                          Product &amp; Spatial Design
                        </span>
                        <div className="space-y-1">
                          <Link href="/skills/ui-ux-product-design" className="block p-2 rounded-xl hover:bg-white/10 transition-colors group">
                            <div className="text-xs font-bold text-white group-hover:text-rose-300 flex items-center gap-1.5">
                              <span>UI/UX &amp; Product Design</span>
                              <span className="px-1 py-0.2 bg-rose-500/20 text-rose-300 text-[8px] rounded font-bold">Hot</span>
                            </div>
                            <div className="text-[10px] text-slate-400">Figma Tokens, Framer, Rive</div>
                          </Link>

                          <Link href="/skills/3d-spatial-computing" className="block p-2 rounded-xl hover:bg-white/10 transition-colors group">
                            <div className="text-xs font-bold text-white group-hover:text-rose-300">3D &amp; Spatial Computing</div>
                            <div className="text-[10px] text-slate-400">Blender, UE5 Nanite, Vision Pro</div>
                          </Link>

                          <Link href="/skills/video-editing" className="block p-2 rounded-xl hover:bg-white/10 transition-colors group">
                            <div className="text-xs font-bold text-white group-hover:text-rose-300">Video Editing &amp; Reels</div>
                            <div className="text-[10px] text-slate-400">Premiere Pro, DaVinci Resolve</div>
                          </Link>

                          <Link href="/skills/graphic-figma" className="block p-2 rounded-xl hover:bg-white/10 transition-colors group">
                            <div className="text-xs font-bold text-white group-hover:text-rose-300">Graphic Design &amp; Brand</div>
                            <div className="text-[10px] text-slate-400">Canva, Figma Ad Kits, Typography</div>
                          </Link>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>

            {/* 4. Green Tech & Sustainable Industry Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('green')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button 
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                  pathname.startsWith('/skills/ev-battery-tech') || 
                  pathname.startsWith('/skills/solar-renewable') ||
                  pathname.startsWith('/category/green-tech-sustainability') ||
                  activeDropdown === 'green'
                    ? 'text-teal-300 bg-teal-500/10 font-bold' 
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
                onClick={() => toggleDropdown('green')}
              >
                <Leaf className="w-3.5 h-3.5 text-teal-400" />
                <span>Green Tech</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${activeDropdown === 'green' ? 'rotate-180 text-teal-300' : ''}`} />
              </button>

              {activeDropdown === 'green' && (
                <div className="absolute top-full left-0 pt-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="w-[390px] rounded-2xl nav-dropdown-menu p-5 shadow-2xl border border-white/15 space-y-2">
                    
                    <div className="flex items-center justify-between pb-3 mb-1 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-400">
                          Green Tech &amp; Sustainability
                        </span>
                      </div>
                      <Link 
                        href="/category/green-tech-sustainability" 
                        className="text-[11px] font-bold text-teal-300 hover:text-white flex items-center gap-1 group/hub"
                      >
                        <span>Domain Hub</span>
                        <ArrowRight className="w-3 h-3 group-hover/hub:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>

                    <Link href="/skills/ev-battery-tech" className="block p-2.5 rounded-xl hover:bg-white/10 transition-colors group">
                      <div className="text-xs font-bold text-white group-hover:text-teal-300 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-teal-400" />
                        <span>EV Powertrain &amp; Battery (BMS)</span>
                        <span className="px-1 py-0.2 bg-teal-500/20 text-teal-300 text-[8px] rounded font-bold">Booming</span>
                      </div>
                      <div className="text-[10px] text-slate-400 ml-5">Cell Balancing, Inverters, CCS2 Fast Charge</div>
                    </Link>

                    <Link href="/skills/solar-renewable-energy-design" className="block p-2.5 rounded-xl hover:bg-white/10 transition-colors group">
                      <div className="text-xs font-bold text-white group-hover:text-teal-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Solar &amp; Renewable Energy Design</span>
                      </div>
                      <div className="text-[10px] text-slate-400 ml-5">PVsyst 3D Modeling, Grid Sync, ESG Audits</div>
                    </Link>

                    <Link href="/skills/risk-compliance-bfsi" className="block p-2.5 rounded-xl hover:bg-white/10 transition-colors group">
                      <div className="text-xs font-bold text-white group-hover:text-teal-300 flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5 text-teal-400" />
                        <span>ESG &amp; Risk Compliance</span>
                      </div>
                      <div className="text-[10px] text-slate-400 ml-5">SEBI BRSR Standards, Carbon Offsetting</div>
                    </Link>

                  </div>
                </div>
              )}
            </div>

            {/* 5. Journeys Link */}
            <Link 
              href="/journeys" 
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                pathname.startsWith('/journeys')
                  ? 'bg-purple-600 text-white shadow-glow-btn' 
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Journeys
            </Link>

            {/* 6. Roadmap Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('roadmaps')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button 
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                  pathname.startsWith('/roadmaps') || activeDropdown === 'roadmaps'
                    ? 'text-purple-300 bg-purple-500/10 font-bold' 
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
                onClick={() => toggleDropdown('roadmaps')}
              >
                <MapPin className="w-3.5 h-3.5 text-purple-400" />
                <span>Roadmaps</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${activeDropdown === 'roadmaps' ? 'rotate-180 text-purple-300' : ''}`} />
              </button>

              {activeDropdown === 'roadmaps' && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="w-[430px] rounded-2xl nav-dropdown-menu p-5 shadow-2xl border border-white/15 space-y-1">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-400">
                        Step-by-Step Execution Plans
                      </span>
                      <span className="text-[10px] text-slate-400">Structured Timelines</span>
                    </div>

                    <Link href="/roadmaps/data-analytics-plan" className="block p-2.5 rounded-xl hover:bg-white/10 transition-colors group">
                      <div className="text-xs font-bold text-white group-hover:text-purple-300">Data Analytics 14-Week Plan</div>
                      <div className="text-[10px] text-slate-400">Excel &rarr; SQL &rarr; Power BI &rarr; Python Pandas</div>
                    </Link>

                    <Link href="/roadmaps/fullstack-dev-plan" className="block p-2.5 rounded-xl hover:bg-white/10 transition-colors group">
                      <div className="text-xs font-bold text-white group-hover:text-purple-300">Full-Stack Web Dev 18-Week Plan</div>
                      <div className="text-[10px] text-slate-400">React &rarr; Next.js &rarr; Node &rarr; PostgreSQL &rarr; Cloud</div>
                    </Link>

                    <Link href="/roadmaps/freelancing-upwork-plan" className="block p-2.5 rounded-xl hover:bg-white/10 transition-colors group">
                      <div className="text-xs font-bold text-white group-hover:text-purple-300">Upwork &amp; USD Freelancing 8-Week Plan</div>
                      <div className="text-[10px] text-slate-400">Niche &rarr; Proposal Hooks &rarr; Wise &rarr; 0% GST</div>
                    </Link>

                    <Link href="/roadmaps/tally-gst-plan" className="block p-2.5 rounded-xl hover:bg-white/10 transition-colors group">
                      <div className="text-xs font-bold text-white group-hover:text-purple-300">Tally Prime &amp; GST 6-Week Plan</div>
                      <div className="text-[10px] text-slate-400">Vouchers &rarr; E-Way &rarr; GSTR-1 &rarr; Balance Sheet</div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* 7. Compare & Alternatives Hub Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('compare')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button 
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                  pathname.startsWith('/compare') || pathname.startsWith('/career/compare') || pathname.startsWith('/tools/alternatives') || activeDropdown === 'compare'
                    ? 'text-cyan-300 bg-cyan-500/10 font-bold' 
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
                onClick={() => toggleDropdown('compare')}
              >
                <Scale className="w-3.5 h-3.5 text-cyan-400" />
                <span>Compare</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${activeDropdown === 'compare' ? 'rotate-180 text-cyan-300' : ''}`} />
              </button>

              {activeDropdown === 'compare' && (
                <div className="absolute top-full right-0 pt-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="w-[420px] rounded-2xl nav-dropdown-menu p-4 shadow-2xl border border-white/15 space-y-2">
                    <div className="flex items-center justify-between pb-2 mb-1 border-b border-white/10">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400">
                        Side-by-Side Face-Offs &amp; Alternatives
                      </span>
                    </div>

                    <Link href="/compare" className="block p-2.5 rounded-xl hover:bg-white/10 transition-colors group">
                      <div className="text-xs font-bold text-white group-hover:text-cyan-300 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Cpu className="w-3.5 h-3.5 text-purple-400" />
                          <span>Skill vs Skill Comparisons</span>
                        </div>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">35+ Stacks</span>
                      </div>
                      <div className="text-[10px] text-slate-400 ml-5.5">Python vs Java, React vs Vue, AWS vs Azure</div>
                    </Link>

                    <Link href="/career/compare" className="block p-2.5 rounded-xl hover:bg-white/10 transition-colors group">
                      <div className="text-xs font-bold text-white group-hover:text-cyan-300 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Scale className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Role vs Role Career Guides</span>
                        </div>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">25+ Roles</span>
                      </div>
                      <div className="text-[10px] text-slate-400 ml-5.5">Dev vs SRE, Data Analyst vs Scientist, PM vs BA</div>
                    </Link>

                    <Link href="/tools/alternatives" className="block p-2.5 rounded-xl hover:bg-white/10 transition-colors group">
                      <div className="text-xs font-bold text-white group-hover:text-cyan-300 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Top Tool Alternatives Matrix</span>
                        </div>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">Free &amp; FOSS</span>
                      </div>
                      <div className="text-[10px] text-slate-400 ml-5.5">Figma, Jira, Tableau, GitHub, ChatGPT replacements</div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* 8. Career Tools Hub */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('tools')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button 
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                  pathname.startsWith('/tools') || pathname.startsWith('/glossary') || activeDropdown === 'tools'
                    ? 'text-amber-300 bg-amber-500/10 font-bold' 
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
                onClick={() => toggleDropdown('tools')}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Tools</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${activeDropdown === 'tools' ? 'rotate-180 text-amber-300' : ''}`} />
              </button>

              {activeDropdown === 'tools' && (
                <div className="absolute top-full right-0 pt-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="w-[380px] rounded-2xl nav-dropdown-menu p-4 shadow-2xl border border-white/15 space-y-1">
                    <div className="pb-2 mb-1 border-b border-white/10">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">
                        Interactive Career Utilities
                      </span>
                    </div>

                    <Link href="/tools/application-tracker" className="block p-2.5 rounded-xl hover:bg-white/10 transition-colors group">
                      <div className="text-xs font-bold text-white group-hover:text-amber-300 flex items-center gap-2">
                        <Briefcase className="w-3.5 h-3.5 text-purple-400" />
                        <span>Job Application &amp; Interview Tracker</span>
                      </div>
                      <div className="text-[10px] text-slate-400 ml-5.5">Private pipeline tracking saved to browser</div>
                    </Link>

                    <Link href="/tools/career-compass" className="block p-2.5 rounded-xl hover:bg-white/10 transition-colors group">
                      <div className="text-xs font-bold text-white group-hover:text-amber-300 flex items-center gap-2">
                        <Compass className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Career Compass (20+ Signals)</span>
                      </div>
                      <div className="text-[10px] text-slate-400 ml-5.5">Comprehensive career assessment</div>
                    </Link>

                    <Link href="/tools/roi-calculator" className="block p-2.5 rounded-xl hover:bg-white/10 transition-colors group">
                      <div className="text-xs font-bold text-white group-hover:text-amber-300 flex items-center gap-2">
                        <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Career ROI &amp; Payback Calculator</span>
                      </div>
                      <div className="text-[10px] text-slate-400 ml-5.5">3-tier scenarios with opportunity costs</div>
                    </Link>

                    <Link href="/tools/salary-calculator" className="block p-2.5 rounded-xl hover:bg-white/10 transition-colors group">
                      <div className="text-xs font-bold text-white group-hover:text-amber-300 flex items-center gap-2">
                        <Calculator className="w-3.5 h-3.5 text-purple-400" />
                        <span>Indian Salary &amp; In-Hand Calculator</span>
                      </div>
                      <div className="text-[10px] text-slate-400 ml-5.5">CTC to take-home, PF &amp; New Tax Regime</div>
                    </Link>

                    <Link href="/tools/ats-resume" className="block p-2.5 rounded-xl hover:bg-white/10 transition-colors group">
                      <div className="text-xs font-bold text-white group-hover:text-amber-300 flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-indigo-400" />
                        <span>ATS Resume &amp; Action Verbs Checklist</span>
                      </div>
                      <div className="text-[10px] text-slate-400 ml-5.5">Machine-readable single-column template</div>
                    </Link>

                    <Link href="/glossary" className="block p-2.5 rounded-xl hover:bg-white/10 transition-colors group">
                      <div className="text-xs font-bold text-white group-hover:text-amber-300 flex items-center gap-2">
                        <BookOpen className="w-3.5 h-3.5 text-teal-400" />
                        <span>Interactive Skilling Glossary</span>
                      </div>
                      <div className="text-[10px] text-slate-400 ml-5.5">Jargon demystified in plain Hinglish/English</div>
                    </Link>

                    <Link href="/disclaimer" className="block p-2 rounded-xl hover:bg-white/10 transition-colors group">
                      <div className="text-xs font-bold text-slate-400 group-hover:text-slate-200 flex items-center gap-2">
                        <ShieldAlert className="w-3.5 h-3.5 text-slate-500" />
                        <span>Disclaimer &amp; Data Methodology</span>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

          </nav>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE DRAWER                                                             */}
      {/* ========================================================================= */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 mx-4 p-5 rounded-3xl nav-mobile-drawer border border-white/15 space-y-3 text-xs font-semibold animate-in slide-in-from-top-4 duration-200 max-h-[85vh] overflow-y-auto shadow-2xl">
          
          {/* Mobile Big Search trigger */}
          <button 
            onClick={() => { setMobileMenuOpen(false); onOpenSearch?.(); }}
            className="w-full h-11 px-4 rounded-2xl bg-slate-900/90 border border-purple-500/30 text-slate-300 flex items-center justify-between group"
          >
            <div className="flex items-center gap-2 text-slate-400">
              <Search className="w-4 h-4 text-purple-400" />
              <span>Search {trackCount} skills, roadmaps, tools...</span>
            </div>
            <kbd className="px-2 py-0.5 text-[9px] bg-slate-800 rounded font-mono text-purple-300">⌘K</kbd>
          </button>

          <div className="flex items-center justify-between pt-1">
            <Link href="/" className="p-2 rounded-xl text-slate-200 hover:bg-purple-600/20 hover:text-purple-300">
              🏠 Home
            </Link>
            <Link href="/journeys" className="p-2 rounded-xl text-purple-300 hover:bg-purple-600/20 font-bold">
              🚀 Learner Journeys
            </Link>
          </div>
          
          {/* Domain 1: Pharmacy, Healthcare & Life Sciences */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-bold text-emerald-400">1. Pharmacy &amp; Healthcare</span>
              <Link href="/category/pharma-healthcare-life-sciences" className="text-[10px] text-emerald-300 underline">Hub →</Link>
            </div>
            <div className="grid grid-cols-2 gap-1 text-[11px]">
              <Link href="/skills/clinical-pharmacy" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">Clinical Pharmacy</Link>
              <Link href="/skills/pharmacovigilance" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">Pharmacovigilance</Link>
              <Link href="/skills/clinical-research" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">Clinical Trials</Link>
              <Link href="/skills/regulatory-affairs" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">Regulatory Affairs</Link>
            </div>
          </div>

          {/* Domain 2: Law & Corporate Governance */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-bold text-pink-400">2. Law &amp; Governance</span>
              <Link href="/category/law-legal-operations" className="text-[10px] text-pink-300 underline">Hub →</Link>
            </div>
            <div className="grid grid-cols-2 gap-1 text-[11px]">
              <Link href="/skills/corporate-law" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">Corporate M&amp;A Law</Link>
              <Link href="/skills/intellectual-property-law" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">IP &amp; Patents</Link>
              <Link href="/skills/contract-drafting" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">Contract Drafting</Link>
              <Link href="/skills/cyber-law" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">Cyber &amp; DPDP Law</Link>
            </div>
          </div>

          {/* Domain 3: Education & Pedagogy */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-bold text-sky-400">3. Education &amp; Pedagogy</span>
              <Link href="/category/education-pedagogy" className="text-[10px] text-sky-300 underline">Hub →</Link>
            </div>
            <div className="grid grid-cols-2 gap-1 text-[11px]">
              <Link href="/skills/teaching-pedagogy" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">Teaching Pedagogy</Link>
              <Link href="/skills/instructional-design" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">Instructional Design</Link>
              <Link href="/skills/special-education" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">Special Education</Link>
              <Link href="/skills/educational-leadership" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">School Admin</Link>
            </div>
          </div>

          {/* Domain 4: Accounting, Finance & ERP */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-bold text-amber-400">4. Accounting, Finance &amp; ERP</span>
              <Link href="/category/accounting-corporate-finance" className="text-[10px] text-amber-300 underline">Hub →</Link>
            </div>
            <div className="grid grid-cols-2 gap-1 text-[11px]">
              <Link href="/skills/gst-accounting-tally-prime" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">GST &amp; Tally Prime</Link>
              <Link href="/skills/financial-modeling-valuation" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">Financial Modeling</Link>
              <Link href="/skills/salesforce-administration" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">Salesforce Admin</Link>
              <Link href="/skills/sap-s4hana-fico" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">SAP S/4HANA FICO</Link>
            </div>
          </div>

          {/* Domain 5: Industrial Automation & Core Eng */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-bold text-cyan-400">5. Automation &amp; Core Eng</span>
              <Link href="/category/industrial-automation-engineering" className="text-[10px] text-cyan-300 underline">Hub →</Link>
            </div>
            <div className="grid grid-cols-2 gap-1 text-[11px]">
              <Link href="/skills/industrial-automation-plc-scada" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">PLC &amp; SCADA Ops</Link>
              <Link href="/skills/robotics-automation" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">Robotics &amp; ROS2</Link>
              <Link href="/skills/ev-battery-tech" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">EV Battery BMS</Link>
              <Link href="/skills/solar-renewable-energy-design" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">Solar Renewable</Link>
            </div>
          </div>

          {/* Domain 6: Emerging Tech & AI */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-bold text-purple-400">6. Emerging Tech &amp; AI</span>
              <Link href="/category/emerging-tech-ai" className="text-[10px] text-purple-300 underline">Hub →</Link>
            </div>
            <div className="grid grid-cols-2 gap-1 text-[11px]">
              <Link href="/skills/ai-agents-llm-apps" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">AI Agents &amp; LLMs</Link>
              <Link href="/skills/platform-engineering" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">Platform Eng (IDP)</Link>
              <Link href="/skills/sre" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">SRE &amp; Observability</Link>
              <Link href="/skills/cybersecurity-ethical-hacking" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">Cybersecurity</Link>
            </div>
          </div>

          {/* Domain 7: Creator & Design Media */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-bold text-rose-400">7. Creator &amp; Design Media</span>
              <Link href="/category/creative-design-media" className="text-[10px] text-rose-300 underline">Hub →</Link>
            </div>
            <div className="grid grid-cols-2 gap-1 text-[11px]">
              <Link href="/skills/ui-ux-product-design" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">UI/UX Product Design</Link>
              <Link href="/skills/youtube-ops" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">YouTube Operations</Link>
              <Link href="/skills/3d-spatial-computing" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">3D &amp; Spatial Blender</Link>
              <Link href="/skills/podcast-production" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">Podcast Production</Link>
            </div>
          </div>

          {/* Compare & Tools */}
          <div className="pt-2 border-t border-slate-800">
            <span className="text-[10px] uppercase font-bold text-cyan-400 block mb-1">8. Compare, Tools &amp; Compass</span>
            <div className="grid grid-cols-2 gap-1 text-[11px]">
              <Link href="/compare" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">Skill Comparisons</Link>
              <Link href="/career/compare" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">Role vs Role</Link>
              <Link href="/tools/salary-calculator" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">Salary Calculator</Link>
              <Link href="/glossary" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">Glossary</Link>
            </div>
          </div>

          <button 
            onClick={() => { setMobileMenuOpen(false); onOpenQuiz?.(); }}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold flex items-center justify-center gap-2 shadow-glow-btn mt-3 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-amber-300" />
            <span>Take Career Compass</span>
          </button>
        </div>
      )}
    </header>
  );
}
