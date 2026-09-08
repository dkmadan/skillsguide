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
  Calculator
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
                <span className="hidden lg:inline">Search 45+ high-income skills, roadmaps, tools, salary guides...</span>
                <span className="lg:hidden">Search 45+ skills, roadmaps...</span>
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
            title="Take 30-Second Career Compass Quiz"
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

            {/* 1. Emerging Tech & AI Engineering Mega Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('ai')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button 
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                  pathname.startsWith('/skills/generative-ai') || 
                  pathname.startsWith('/skills/cloud-platform') || 
                  pathname.startsWith('/skills/cybersecurity') || 
                  pathname.startsWith('/skills/iot-embedded') ||
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
                  <div className="w-[560px] rounded-2xl glass-card p-5 shadow-2xl border border-white/15 bg-[#121526]/98 backdrop-blur-2xl">
                    
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
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2 block">
                          2026 AI &amp; Infrastructure
                        </span>
                        <div className="space-y-1">
                          <Link href="/skills/generative-ai-agentic-workflows" className="block p-2 rounded-xl hover:bg-white/5 transition-colors group">
                            <div className="text-xs font-bold text-white group-hover:text-purple-300 flex items-center gap-1.5">
                              <span>Generative AI &amp; Agents</span>
                              <span className="px-1 py-0.2 bg-purple-500/20 text-purple-300 text-[8px] rounded font-bold">Hot</span>
                            </div>
                            <div className="text-[10px] text-slate-400">LangChain, MCP, Tool Calling, SLMs</div>
                          </Link>
                          
                          <Link href="/skills/cloud-platform-engineering" className="block p-2 rounded-xl hover:bg-white/5 transition-colors group">
                            <div className="text-xs font-bold text-white group-hover:text-purple-300">Cloud Platform &amp; SRE</div>
                            <div className="text-[10px] text-slate-400">Terraform IaC, K8s Operators, Multi-cloud</div>
                          </Link>

                          <Link href="/skills/cybersecurity-ethical-hacking" className="block p-2 rounded-xl hover:bg-white/5 transition-colors group">
                            <div className="text-xs font-bold text-white group-hover:text-purple-300">Cybersecurity &amp; SOC</div>
                            <div className="text-[10px] text-slate-400">Pentest, Burp Suite, Splunk SIEM, CCSP</div>
                          </Link>

                          <Link href="/skills/iot-embedded-systems" className="block p-2 rounded-xl hover:bg-white/5 transition-colors group">
                            <div className="text-xs font-bold text-white group-hover:text-purple-300">IoT &amp; Embedded Systems</div>
                            <div className="text-[10px] text-slate-400">Rust, ESP32, Edge AI, Automotive CAN</div>
                          </Link>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2 block">
                          Data &amp; Core Software
                        </span>
                        <div className="space-y-1">
                          <Link href="/skills/data-analytics" className="block p-2 rounded-xl hover:bg-white/5 transition-colors group">
                            <div className="text-xs font-bold text-white group-hover:text-purple-300">Data Analytics &amp; BI</div>
                            <div className="text-[10px] text-slate-400">SQL, Power BI, Advanced Excel, Python</div>
                          </Link>

                          <Link href="/skills/full-stack-web" className="block p-2 rounded-xl hover:bg-white/5 transition-colors group">
                            <div className="text-xs font-bold text-white group-hover:text-purple-300">Full-Stack Web Dev</div>
                            <div className="text-[10px] text-slate-400">Next.js, React, Node.js, PostgreSQL</div>
                          </Link>

                          <Link href="/skills/data-engineering" className="block p-2 rounded-xl hover:bg-white/5 transition-colors group">
                            <div className="text-xs font-bold text-white group-hover:text-purple-300">Data Engineering</div>
                            <div className="text-[10px] text-slate-400">PySpark, Airflow, Snowflake, Kafka</div>
                          </Link>

                          <Link href="/skills/ai-prompt-engineering" className="block p-2 rounded-xl hover:bg-white/5 transition-colors group">
                            <div className="text-xs font-bold text-white group-hover:text-purple-300">AI Prompt Engineering</div>
                            <div className="text-[10px] text-slate-400">RAG Pipelines, Cursor AI, Claude</div>
                          </Link>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>

            {/* 2. Business, Growth & Modern No-Code Mega Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('business')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button 
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                  pathname.startsWith('/skills/product-management') || 
                  pathname.startsWith('/skills/nocode-lowcode') || 
                  pathname.startsWith('/skills/digital-marketing') ||
                  pathname.startsWith('/category/business-growth-nocode') ||
                  activeDropdown === 'business'
                    ? 'text-amber-300 bg-amber-500/10 font-bold' 
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
                onClick={() => toggleDropdown('business')}
              >
                <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                <span>Business &amp; No-Code</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${activeDropdown === 'business' ? 'rotate-180 text-amber-300' : ''}`} />
              </button>

              {activeDropdown === 'business' && (
                <div className="absolute top-full left-0 pt-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="w-[540px] rounded-2xl glass-card p-5 shadow-2xl border border-white/15 bg-[#121526]/98 backdrop-blur-2xl">
                    
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">
                          Business, Growth &amp; Modern No-Code
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
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2 block">
                          Growth &amp; Visual Tech
                        </span>
                        <div className="space-y-1">
                          <Link href="/skills/product-management-growth" className="block p-2 rounded-xl hover:bg-white/5 transition-colors group">
                            <div className="text-xs font-bold text-white group-hover:text-amber-300 flex items-center gap-1.5">
                              <span>Product &amp; Growth</span>
                              <span className="px-1 py-0.2 bg-amber-500/20 text-amber-300 text-[8px] rounded font-bold">Top</span>
                            </div>
                            <div className="text-[10px] text-slate-400">Discovery, Amplitude, PRDs, PLG</div>
                          </Link>

                          <Link href="/skills/nocode-lowcode-development" className="block p-2 rounded-xl hover:bg-white/5 transition-colors group">
                            <div className="text-xs font-bold text-white group-hover:text-amber-300 flex items-center gap-1.5">
                              <span>No-Code / Low-Code</span>
                              <span className="px-1 py-0.2 bg-purple-500/20 text-purple-300 text-[8px] rounded font-bold">Hot</span>
                            </div>
                            <div className="text-[10px] text-slate-400">Bubble, Webflow, Make, Airtable</div>
                          </Link>

                          <Link href="/skills/digital-marketing-seo-performance" className="block p-2 rounded-xl hover:bg-white/5 transition-colors group">
                            <div className="text-xs font-bold text-white group-hover:text-amber-300">SEO &amp; Performance</div>
                            <div className="text-[10px] text-slate-400">Programmatic SEO, Meta &amp; Google Ads</div>
                          </Link>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2 block">
                          Commerce &amp; Fluency
                        </span>
                        <div className="space-y-1">
                          <Link href="/skills/freelancing-usd" className="block p-2 rounded-xl hover:bg-white/5 transition-colors group">
                            <div className="text-xs font-bold text-white group-hover:text-amber-300">Global Freelancing (USD)</div>
                            <div className="text-[10px] text-slate-400">Upwork Proposals, Wise, 0% GST</div>
                          </Link>

                          <Link href="/skills/tally-gst" className="block p-2 rounded-xl hover:bg-white/5 transition-colors group">
                            <div className="text-xs font-bold text-white group-hover:text-amber-300">Tally Prime &amp; GST</div>
                            <div className="text-[10px] text-slate-400">GSTR-1, 3B, TDS, Invoicing</div>
                          </Link>

                          <Link href="/skills/advanced-excel" className="block p-2 rounded-xl hover:bg-white/5 transition-colors group">
                            <div className="text-xs font-bold text-white group-hover:text-amber-300">Advanced Excel &amp; MIS</div>
                            <div className="text-[10px] text-slate-400">XLOOKUP, Power Query, Macros</div>
                          </Link>

                          <Link href="/skills/communication-english" className="block p-2 rounded-xl hover:bg-white/5 transition-colors group">
                            <div className="text-xs font-bold text-white group-hover:text-amber-300">Business English &amp; Fluency</div>
                            <div className="text-[10px] text-slate-400">STAR Framework, Email Polish</div>
                          </Link>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>

            {/* 3. Creative & Design Media Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('creative')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button 
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
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
                <span>Creative &amp; Design</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${activeDropdown === 'creative' ? 'rotate-180 text-rose-300' : ''}`} />
              </button>

              {activeDropdown === 'creative' && (
                <div className="absolute top-full left-0 pt-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="w-[500px] rounded-2xl glass-card p-5 shadow-2xl border border-white/15 bg-[#121526]/98 backdrop-blur-2xl">
                    
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-400">
                          Creative &amp; Design Media
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
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2 block">
                          Product &amp; Spatial Experience
                        </span>
                        <div className="space-y-1">
                          <Link href="/skills/ui-ux-product-design" className="block p-2 rounded-xl hover:bg-white/5 transition-colors group">
                            <div className="text-xs font-bold text-white group-hover:text-rose-300 flex items-center gap-1.5">
                              <span>UI/UX &amp; Product Design</span>
                              <span className="px-1 py-0.2 bg-rose-500/20 text-rose-300 text-[8px] rounded font-bold">Hot</span>
                            </div>
                            <div className="text-[10px] text-slate-400">Figma Tokens, Framer, Rive</div>
                          </Link>

                          <Link href="/skills/3d-spatial-computing" className="block p-2 rounded-xl hover:bg-white/5 transition-colors group">
                            <div className="text-xs font-bold text-white group-hover:text-rose-300">3D &amp; Spatial Computing</div>
                            <div className="text-[10px] text-slate-400">Blender, UE5 Nanite, Vision Pro</div>
                          </Link>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2 block">
                          Media &amp; Creator Craft
                        </span>
                        <div className="space-y-1">
                          <Link href="/skills/video-editing" className="block p-2 rounded-xl hover:bg-white/5 transition-colors group">
                            <div className="text-xs font-bold text-white group-hover:text-rose-300">Video Editing &amp; Reels</div>
                            <div className="text-[10px] text-slate-400">Premiere Pro, DaVinci Resolve</div>
                          </Link>

                          <Link href="/skills/graphic-figma" className="block p-2 rounded-xl hover:bg-white/5 transition-colors group">
                            <div className="text-xs font-bold text-white group-hover:text-rose-300">Graphic Design &amp; Brand</div>
                            <div className="text-[10px] text-slate-400">Canva, Figma Ad Kits, Typography</div>
                          </Link>

                          <Link href="/skills/content-writing-seo" className="block p-2 rounded-xl hover:bg-white/5 transition-colors group">
                            <div className="text-xs font-bold text-white group-hover:text-rose-300">Content Writing &amp; SEO</div>
                            <div className="text-[10px] text-slate-400">Articles, High-Converting Copy</div>
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
                  <div className="w-[390px] rounded-2xl glass-card p-5 shadow-2xl border border-white/15 bg-[#121526]/98 backdrop-blur-2xl space-y-2">
                    
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

                    <Link href="/skills/ev-battery-tech" className="block p-2.5 rounded-xl hover:bg-white/5 transition-colors group">
                      <div className="text-xs font-bold text-white group-hover:text-teal-300 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-teal-400" />
                        <span>EV Powertrain &amp; Battery (BMS)</span>
                        <span className="px-1 py-0.2 bg-teal-500/20 text-teal-300 text-[8px] rounded font-bold">Booming</span>
                      </div>
                      <div className="text-[10px] text-slate-400 ml-5">Cell Balancing, Inverters, CCS2 Fast Charge</div>
                    </Link>

                    <Link href="/skills/solar-renewable-energy-design" className="block p-2.5 rounded-xl hover:bg-white/5 transition-colors group">
                      <div className="text-xs font-bold text-white group-hover:text-teal-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Solar &amp; Renewable Energy Design</span>
                      </div>
                      <div className="text-[10px] text-slate-400 ml-5">PVsyst 3D Modeling, Grid Sync, ESG Audits</div>
                    </Link>

                    <Link href="/skills/risk-compliance-bfsi" className="block p-2.5 rounded-xl hover:bg-white/5 transition-colors group">
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

            {/* 5. Roadmap Dropdown */}
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
                  <div className="w-[430px] rounded-2xl glass-card p-5 shadow-2xl border border-white/15 space-y-1 bg-[#121526]/98 backdrop-blur-2xl">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-400">
                        Step-by-Step Execution Plans
                      </span>
                      <span className="text-[10px] text-slate-400">Structured Timelines</span>
                    </div>

                    <Link href="/roadmaps/data-analytics-plan" className="block p-2.5 rounded-xl hover:bg-white/5 transition-colors group">
                      <div className="text-xs font-bold text-white group-hover:text-purple-300">Data Analytics 14-Week Plan</div>
                      <div className="text-[10px] text-slate-400">Excel &rarr; SQL &rarr; Power BI &rarr; Python Pandas</div>
                    </Link>

                    <Link href="/roadmaps/fullstack-dev-plan" className="block p-2.5 rounded-xl hover:bg-white/5 transition-colors group">
                      <div className="text-xs font-bold text-white group-hover:text-purple-300">Full-Stack Web Dev 18-Week Plan</div>
                      <div className="text-[10px] text-slate-400">React &rarr; Next.js &rarr; Node &rarr; PostgreSQL &rarr; Cloud</div>
                    </Link>

                    <Link href="/roadmaps/freelancing-upwork-plan" className="block p-2.5 rounded-xl hover:bg-white/5 transition-colors group">
                      <div className="text-xs font-bold text-white group-hover:text-purple-300">Upwork &amp; USD Freelancing 8-Week Plan</div>
                      <div className="text-[10px] text-slate-400">Niche &rarr; Proposal Hooks &rarr; Wise &rarr; 0% GST</div>
                    </Link>

                    <Link href="/roadmaps/tally-gst-plan" className="block p-2.5 rounded-xl hover:bg-white/5 transition-colors group">
                      <div className="text-xs font-bold text-white group-hover:text-purple-300">Tally Prime &amp; GST 6-Week Plan</div>
                      <div className="text-[10px] text-slate-400">Vouchers &rarr; E-Way &rarr; GSTR-1 &rarr; Balance Sheet</div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* 6. Career Tools Hub */}
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
                  <div className="w-[360px] rounded-2xl glass-card p-4 shadow-2xl border border-white/15 space-y-1 bg-[#121526]/98 backdrop-blur-2xl">
                    <div className="pb-2 mb-1 border-b border-white/10">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">
                        Interactive Career Utilities
                      </span>
                    </div>

                    <Link href="/tools/salary-calculator" className="block p-2.5 rounded-xl hover:bg-white/5 transition-colors group">
                      <div className="text-xs font-bold text-white group-hover:text-amber-300 flex items-center gap-2">
                        <Calculator className="w-3.5 h-3.5 text-purple-400" />
                        <span>Indian Salary &amp; In-Hand Calculator</span>
                      </div>
                      <div className="text-[10px] text-slate-400 ml-5.5">CTC to take-home, PF &amp; New Tax Regime</div>
                    </Link>

                    <Link href="/tools/career-compass" className="block p-2.5 rounded-xl hover:bg-white/5 transition-colors group">
                      <div className="text-xs font-bold text-white group-hover:text-amber-300 flex items-center gap-2">
                        <Compass className="w-3.5 h-3.5 text-emerald-400" />
                        <span>30-Sec Career Compass Quiz</span>
                      </div>
                      <div className="text-[10px] text-slate-400 ml-5.5">Algorithmic role &amp; track recommendation</div>
                    </Link>

                    <Link href="/tools/ats-resume" className="block p-2.5 rounded-xl hover:bg-white/5 transition-colors group">
                      <div className="text-xs font-bold text-white group-hover:text-amber-300 flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-indigo-400" />
                        <span>ATS Resume Builder &amp; Power Verbs</span>
                      </div>
                      <div className="text-[10px] text-slate-400 ml-5.5">Score 85%+ on recruiter ATS software</div>
                    </Link>

                    <Link href="/glossary" className="block p-2.5 rounded-xl hover:bg-white/5 transition-colors group">
                      <div className="text-xs font-bold text-white group-hover:text-amber-300 flex items-center gap-2">
                        <BookOpen className="w-3.5 h-3.5 text-teal-400" />
                        <span>Interactive Skilling Glossary</span>
                      </div>
                      <div className="text-[10px] text-slate-400 ml-5.5">Jargon demystified in plain Hinglish/English</div>
                    </Link>

                    <Link href="/disclaimer" className="block p-2 rounded-xl hover:bg-white/5 transition-colors group">
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
        <div className="lg:hidden mt-2 mx-4 p-5 rounded-3xl glass-card border border-white/15 space-y-3 text-xs font-semibold animate-in slide-in-from-top-4 duration-200 bg-[#0d0f18]/98 backdrop-blur-2xl max-h-[85vh] overflow-y-auto shadow-2xl">
          
          {/* Mobile Big Search trigger */}
          <button 
            onClick={() => { setMobileMenuOpen(false); onOpenSearch?.(); }}
            className="w-full h-11 px-4 rounded-2xl bg-slate-900/90 border border-purple-500/30 text-slate-300 flex items-center justify-between group"
          >
            <div className="flex items-center gap-2 text-slate-400">
              <Search className="w-4 h-4 text-purple-400" />
              <span>Search 45+ skills, roadmaps, tools...</span>
            </div>
            <kbd className="px-2 py-0.5 text-[9px] bg-slate-800 rounded font-mono text-purple-300">⌘K</kbd>
          </button>

          <Link href="/" className="block p-2.5 rounded-xl text-slate-200 hover:bg-purple-600/20 hover:text-purple-300">
            🏠 Home
          </Link>
          
          {/* Domain 1: Emerging Tech & AI */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-bold text-purple-400">1. Emerging Tech &amp; AI</span>
              <Link href="/category/emerging-tech-ai" className="text-[10px] text-purple-300 underline">Hub →</Link>
            </div>
            <div className="grid grid-cols-2 gap-1 text-[11px]">
              <Link href="/skills/generative-ai-agentic-workflows" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">Generative AI &amp; Agents</Link>
              <Link href="/skills/cloud-platform-engineering" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">Cloud Platform (IaC)</Link>
              <Link href="/skills/cybersecurity-ethical-hacking" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">Cybersecurity &amp; SOC</Link>
              <Link href="/skills/iot-embedded-systems" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">IoT &amp; Embedded Rust</Link>
            </div>
          </div>

          {/* Domain 2: Business & No-Code */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-bold text-amber-400">2. Business, Growth &amp; No-Code</span>
              <Link href="/category/business-growth-nocode" className="text-[10px] text-amber-300 underline">Hub →</Link>
            </div>
            <div className="grid grid-cols-2 gap-1 text-[11px]">
              <Link href="/skills/product-management-growth" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">Product &amp; Growth</Link>
              <Link href="/skills/nocode-lowcode-development" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">No-Code / Low-Code</Link>
              <Link href="/skills/digital-marketing-seo-performance" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">SEO &amp; Performance</Link>
              <Link href="/skills/freelancing-usd" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">Global Freelancing</Link>
            </div>
          </div>

          {/* Domain 3: Creative & Design */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-bold text-rose-400">3. Creative &amp; Design Media</span>
              <Link href="/category/creative-design-media" className="text-[10px] text-rose-300 underline">Hub →</Link>
            </div>
            <div className="grid grid-cols-2 gap-1 text-[11px]">
              <Link href="/skills/ui-ux-product-design" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">UI/UX &amp; Design Tokens</Link>
              <Link href="/skills/3d-spatial-computing" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">3D &amp; Spatial (UE5)</Link>
              <Link href="/skills/video-editing" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">Video Editing</Link>
              <Link href="/skills/graphic-figma" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">Graphic Design</Link>
            </div>
          </div>

          {/* Domain 4: Green Tech */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-bold text-teal-400">4. Green Tech &amp; Sustainability</span>
              <Link href="/category/green-tech-sustainability" className="text-[10px] text-teal-300 underline">Hub →</Link>
            </div>
            <div className="grid grid-cols-2 gap-1 text-[11px]">
              <Link href="/skills/ev-battery-tech" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">EV Powertrain &amp; BMS</Link>
              <Link href="/skills/solar-renewable-energy-design" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">Solar PVsyst &amp; ESG</Link>
            </div>
          </div>

          {/* Roadmaps & Tools */}
          <div className="pt-2 border-t border-slate-800">
            <span className="text-[10px] uppercase font-bold text-purple-400 block mb-1">5. Roadmaps &amp; Tools</span>
            <div className="grid grid-cols-2 gap-1 text-[11px]">
              <Link href="/roadmaps/data-analytics-plan" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">Data Roadmap</Link>
              <Link href="/roadmaps/fullstack-dev-plan" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">Fullstack Roadmap</Link>
              <Link href="/tools/salary-calculator" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">Salary Calculator</Link>
              <Link href="/glossary" className="p-2 rounded-lg hover:bg-white/5 text-slate-300">Glossary</Link>
            </div>
          </div>

          <button 
            onClick={() => { setMobileMenuOpen(false); onOpenQuiz?.(); }}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold flex items-center justify-center gap-2 shadow-glow-btn mt-3 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-amber-300" />
            <span>Take 30-Sec Career Compass</span>
          </button>
        </div>
      )}
    </header>
  );
}
