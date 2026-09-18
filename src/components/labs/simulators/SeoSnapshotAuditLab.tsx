'use client';

import React, { useState } from 'react';
import { LabScenarioVariant, LabDifficulty } from '@/lib/labs/types';
import { 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Link2, 
  FileText, 
  Eye, 
  ExternalLink, 
  Send,
  Sparkles,
  Layers,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface SimulatorProps {
  scenario?: LabScenarioVariant;
  variant: LabDifficulty;
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

export default function SeoSnapshotAuditLab({
  scenario,
  variant,
  onDirty,
  onSubmit
}: SimulatorProps) {
  // Fix state
  const [fixedTitleBackend, setFixedTitleBackend] = useState('');
  const [addedPricingDesc, setAddedPricingDesc] = useState('');
  const [orphanLinked, setOrphanLinked] = useState(false);
  const [brokenLinkFixed, setBrokenLinkFixed] = useState(false);
  const [serpPreviewChecked, setSerpPreviewChecked] = useState(false);
  const [auditNotes, setAuditNotes] = useState(
    'Fixed duplicate backend title, added pricing meta description, linked orphan data engineering guide, and resolved 404 broken calculator target.'
  );

  // Filter/view state
  const [activeTab, setActiveTab] = useState<'issues' | 'pages' | 'serp'>('issues');
  const [selectedPageId, setSelectedPageId] = useState('p10'); // defaults to backend duplicate

  // Simulated 20-page audit dataset
  const pages = [
    { id: 'p1', path: '/', title: 'SkillsGuide - Empower Your Career Journey', desc: 'Master high-income in-demand tech and business skills.', inboundCount: 19, status: 200 },
    { id: 'p2', path: '/skills/data-analytics', title: 'Data Analytics Career Roadmap & Salary India', desc: 'Comprehensive guide to becoming a Data Analyst in India.', inboundCount: 5, status: 200 },
    { id: 'p3', path: '/skills/full-stack-web', title: 'Full-Stack Web Developer Career Guide', desc: 'Step-by-step roadmap to modern full-stack web development.', inboundCount: 4, status: 200 },
    { id: 'p4', path: '/pricing', title: 'SkillsGuide Pricing - Transparent Career Plans', desc: addedPricingDesc || '(Missing meta description)', inboundCount: 3, status: 200, hasIssue: !addedPricingDesc },
    { id: 'p5', path: '/about', title: 'About Us - SkillsGuide Open Education Mission', desc: 'Learn about our mission to provide high quality blueprints.', inboundCount: 3, status: 200 },
    { id: 'p6', path: '/contact', title: 'Contact SkillsGuide Team & Mentors', desc: 'Get in touch with our editorial and skilling advisors.', inboundCount: 2, status: 200 },
    { id: 'p7', path: '/skills/sql', title: 'SQL for Data Analysis & Engineering Guide', desc: 'Master SQL queries, joins, and window functions.', inboundCount: 2, status: 200 },
    { id: 'p8', path: '/skills/power-bi', title: 'Power BI & DAX Business Intelligence Guide', desc: 'Build enterprise BI dashboards and calculate measures.', inboundCount: 2, status: 200 },
    { id: 'p9', path: '/skills/frontend', title: 'Frontend Engineering Career Blueprint', desc: 'HTML, CSS, React, and accessibility standards.', inboundCount: 2, status: 200 },
    { id: 'p10', path: '/skills/backend', title: fixedTitleBackend || 'Frontend Engineering Career Blueprint', desc: 'Node.js, Express, databases, and microservices backend.', inboundCount: 2, status: 200, hasIssue: !fixedTitleBackend },
    { id: 'p11', path: '/tools/salary-calculator', title: 'Indian Salary & Take-Home In-Hand Pay Calculator', desc: 'Calculate take-home monthly salary from CTC with PF and taxes.', inboundCount: brokenLinkFixed ? 2 : 1, status: 200 },
    { id: 'p12', path: '/guides/data-engineering', title: 'Data Engineering Pipelines & Kafka Architecture', desc: 'Learn Apache Spark, Airflow, Snowflake, and streaming pipelines.', inboundCount: orphanLinked ? 1 : 0, status: 200, hasIssue: !orphanLinked },
    { id: 'p13', path: '/glossary', title: 'Interactive Skilling & Tech Jargon Glossary', desc: 'Demystify 100+ modern technology and career concepts.', inboundCount: 1, status: 200 },
    { id: 'p14', path: '/roadmaps', title: 'Step-by-Step Career Roadmaps & Blueprints', desc: 'Structured week-by-week learning timelines for high-growth tech.', inboundCount: 2, status: 200 },
    { id: 'p15', path: '/compare', title: 'Skill vs Skill Side-by-Side Comparisons', desc: 'Compare Python vs Java, React vs Vue, AWS vs Azure.', inboundCount: 1, status: 200 },
    { id: 'p16', path: '/terms', title: 'Terms of Use & Platform Policies', desc: 'Read our platform terms of service and educational use.', inboundCount: 1, status: 200 },
    { id: 'p17', path: '/privacy', title: 'Privacy Policy & Data Protection Notice', desc: 'How we collect, protect, and respect learner data.', inboundCount: 2, status: 200 },
    { id: 'p18', path: '/disclaimer', title: 'Salary Data Methodology & Disclaimer', desc: 'Understand our data collection methodology and benchmarks.', inboundCount: 1, status: 200 },
    { id: 'p19', path: '/tools/career-compass', title: 'Career Compass Quiz - Discover Your Top Career Fit', desc: 'Answer 20 diagnostic questions to uncover your high-ROI trajectory.', inboundCount: 1, status: 200 },
    { id: 'p20', path: '/tools/ats-resume', title: 'ATS Resume Checklist & Action Verbs Guide', desc: 'Make your resume machine-readable and highlight metrics.', inboundCount: 1, status: 200 }
  ];

  const issuesResolvedCount = 
    (fixedTitleBackend ? 1 : 0) + 
    (addedPricingDesc ? 1 : 0) + 
    (orphanLinked ? 1 : 0) + 
    (brokenLinkFixed ? 1 : 0);

  const handleSubmit = () => {
    onSubmit({
      fixedTitleBackend,
      addedPricingDesc,
      orphanLinked,
      brokenLinkFixed,
      serpPreviewChecked,
      auditNotes
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Issue Summary & Progress */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Audit Coverage</span>
          <span className="text-xl font-black text-white">20 / 20 Pages</span>
          <span className="text-[10px] text-emerald-400 block mt-0.5">Snapshot crawl complete</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Issues Resolved</span>
          <span className="text-xl font-black text-purple-300">{issuesResolvedCount} / 4</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {issuesResolvedCount === 4 ? 'All technical defects patched!' : `${4 - issuesResolvedCount} critical remaining`}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Orphan Status</span>
          <span className={`text-xl font-black ${orphanLinked ? 'text-emerald-400' : 'text-amber-400'}`}>
            {orphanLinked ? '0 Orphans' : '1 Orphan Page'}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">/guides/data-engineering</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Broken Targets</span>
          <span className={`text-xl font-black ${brokenLinkFixed ? 'text-emerald-400' : 'text-red-400'}`}>
            {brokenLinkFixed ? '0 Broken' : '1 Broken 404'}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">/tools/old-calc</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('issues')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'issues'
              ? 'bg-purple-600 text-white shadow-glow-btn'
              : 'bg-white/5 hover:bg-white/10 text-slate-300'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Audit Resolution Queue (4 Tasks)</span>
        </button>

        <button
          onClick={() => setActiveTab('pages')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'pages'
              ? 'bg-purple-600 text-white shadow-glow-btn'
              : 'bg-white/5 hover:bg-white/10 text-slate-300'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>20-Page Hierarchy &amp; Inbound Links</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('serp');
            setSerpPreviewChecked(true);
            onDirty();
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'serp'
              ? 'bg-purple-600 text-white shadow-glow-btn'
              : 'bg-white/5 hover:bg-white/10 text-slate-300'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>SERP Preview Inspector</span>
        </button>
      </div>

      {/* TAB 1: Resolution Queue */}
      {activeTab === 'issues' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-7 space-y-4">
            
            {/* Task 1: Duplicate Title */}
            <div className={`p-5 rounded-3xl border transition-all ${
              fixedTitleBackend ? 'bg-[#111425] border-emerald-500/30' : 'bg-[#141829] border-purple-500/40'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 font-bold text-xs flex items-center justify-center">1</span>
                  <span className="text-xs font-bold text-white">Resolve Duplicate Title on /skills/backend</span>
                </div>
                {fixedTitleBackend ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">Defect</span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                Both <code className="text-purple-300">/skills/frontend</code> and <code className="text-purple-300">/skills/backend</code> share the exact same title tag (&quot;Frontend Engineering Career Blueprint&quot;). Provide a distinct title for Backend.
              </p>
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300 block">
                  New Title Tag for /skills/backend (keep under 65 chars):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={fixedTitleBackend}
                    onChange={(e) => {
                      setFixedTitleBackend(e.target.value);
                      onDirty();
                    }}
                    placeholder="e.g. Backend Engineering & Node.js Career Blueprint"
                    className="flex-1 text-xs p-2.5 rounded-xl bg-black/40 border border-white/15 text-slate-200 focus:outline-none focus:border-purple-500/50"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFixedTitleBackend('Backend Engineering & Architecture Career Blueprint');
                      onDirty();
                    }}
                    className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[11px] text-slate-300 font-semibold transition-colors shrink-0"
                  >
                    Suggest
                  </button>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Chars: {fixedTitleBackend.length} / 65 max</span>
                  {fixedTitleBackend.length > 65 && <span className="text-red-400">Exceeds 65 char limit!</span>}
                </div>
              </div>
            </div>

            {/* Task 2: Missing Meta Description */}
            <div className={`p-5 rounded-3xl border transition-all ${
              addedPricingDesc ? 'bg-[#111425] border-emerald-500/30' : 'bg-[#141829] border-purple-500/40'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 font-bold text-xs flex items-center justify-center">2</span>
                  <span className="text-xs font-bold text-white">Author Missing Meta Description on /pricing</span>
                </div>
                {addedPricingDesc ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">Defect</span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                The <code className="text-purple-300">/pricing</code> page has an empty description tag. Author a compelling snippet between 50 and 160 characters.
              </p>
              <textarea
                rows={2}
                value={addedPricingDesc}
                onChange={(e) => {
                  setAddedPricingDesc(e.target.value);
                  onDirty();
                }}
                placeholder="Transparent pricing plans for Indian career blueprints, personalized mentor roadmaps, and salary explorer access..."
                className="w-full text-xs p-2.5 rounded-xl bg-black/40 border border-white/15 text-slate-200 focus:outline-none focus:border-purple-500/50"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Chars: {addedPricingDesc.length} (Ideal: 50-160)</span>
                <button
                  type="button"
                  onClick={() => {
                    setAddedPricingDesc('Explore transparent pricing plans for SkillsGuide career blueprints, roadmap tools, and salary benchmarks for Indian learners.');
                    onDirty();
                  }}
                  className="text-purple-400 hover:underline"
                >
                  Fill Sample Description
                </button>
              </div>
            </div>

            {/* Task 3: Orphan Page */}
            <div className={`p-5 rounded-3xl border transition-all ${
              orphanLinked ? 'bg-[#111425] border-emerald-500/30' : 'bg-[#141829] border-purple-500/40'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 font-bold text-xs flex items-center justify-center">3</span>
                  <span className="text-xs font-bold text-white">Connect Orphan Page (/guides/data-engineering)</span>
                </div>
                {orphanLinked ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">Defect</span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                <code className="text-purple-300">/guides/data-engineering</code> has <strong>0 inbound links</strong> across the entire site. Search engines cannot crawl it.
              </p>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-200">Add Inbound Link from /skills/data-analytics</span>
                  <p className="text-[10px] text-slate-400">Embed contextual link in related curriculum section</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setOrphanLinked(!orphanLinked);
                    onDirty();
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    orphanLinked 
                      ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                      : 'bg-purple-600 hover:bg-purple-500 text-white shadow-glow-btn'
                  }`}
                >
                  {orphanLinked ? 'Linked (1 Inbound)' : 'Add Inbound Link'}
                </button>
              </div>
            </div>

            {/* Task 4: Broken 404 Link */}
            <div className={`p-5 rounded-3xl border transition-all ${
              brokenLinkFixed ? 'bg-[#111425] border-emerald-500/30' : 'bg-[#141829] border-purple-500/40'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 font-bold text-xs flex items-center justify-center">4</span>
                  <span className="text-xs font-bold text-white">Repair Broken 404 Hyperlink on /pricing</span>
                </div>
                {brokenLinkFixed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-300">404 Error</span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                The pricing page points to dead link <code className="text-red-400">/tools/old-calc</code>. Update destination to the modern <code className="text-emerald-400">/tools/salary-calculator</code>.
              </p>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-200">Re-target link to /tools/salary-calculator</span>
                  <p className="text-[10px] text-slate-400">Preserves link equity and eliminates 404 crawl errors</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setBrokenLinkFixed(!brokenLinkFixed);
                    onDirty();
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    brokenLinkFixed 
                      ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                      : 'bg-purple-600 hover:bg-purple-500 text-white shadow-glow-btn'
                  }`}
                >
                  {brokenLinkFixed ? 'Fixed (Target: 200 OK)' : 'Repair Target'}
                </button>
              </div>
            </div>

          </div>

          {/* Right 5 Cols: Audit Log & Submission */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Audit Notes */}
            <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-2">
              <label htmlFor="audit-notes" className="text-xs font-extrabold text-white flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-purple-400" />
                <span>Technical Audit Log &amp; Rationale</span>
              </label>
              <textarea
                id="audit-notes"
                rows={4}
                value={auditNotes}
                onChange={(e) => {
                  setAuditNotes(e.target.value);
                  onDirty();
                }}
                placeholder="Explain the SEO improvements performed..."
                className="w-full text-xs p-3 rounded-xl bg-black/30 border border-white/15 text-slate-200 focus:outline-none focus:border-purple-500/50"
              />
            </div>

            {/* Submission CTA */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-950/40 via-[#111425] to-indigo-950/40 border border-purple-500/30 space-y-3">
              <div>
                <span className="text-xs font-extrabold text-white block">Audit Verification</span>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                  Submit audit fixes for automated server evaluation against the 60/25/15 rubric.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-glow-btn transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit &amp; Evaluate Audit</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: 20-Page Table */}
      {activeTab === 'pages' && (
        <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
              Snapshot Page Metadata &amp; Inbound Link Counts
            </h3>
            <span className="text-xs text-slate-400">Total: 20 Pages</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 text-[11px]">
                  <th className="p-2.5">Path</th>
                  <th className="p-2.5">Title Tag</th>
                  <th className="p-2.5">Inbound</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {pages.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-2.5 font-mono text-purple-300 font-semibold">{p.path}</td>
                    <td className="p-2.5 text-slate-200 max-w-xs truncate">{p.title}</td>
                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                        p.inboundCount === 0 ? 'bg-red-500/20 text-red-300' : 'bg-white/10 text-slate-300'
                      }`}>
                        {p.inboundCount}
                      </span>
                    </td>
                    <td className="p-2.5">
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        {p.status} OK
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SERP Preview */}
      {activeTab === 'serp' && (
        <div className="p-6 rounded-3xl bg-[#111425] border border-white/10 space-y-6 max-w-2xl mx-auto">
          <div>
            <h3 className="text-sm font-extrabold text-white">Google Search Results Preview</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulated SERP rendering for /skills/backend and /pricing based on your updated metadata.
            </p>
          </div>

          {/* Snippet 1 */}
          <div className="p-4 rounded-2xl bg-[#1e2337] border border-white/10 space-y-1">
            <span className="text-[10px] text-slate-400 font-mono block">https://skillsguide.in/skills/backend</span>
            <div className="text-sm font-bold text-sky-400 hover:underline cursor-pointer">
              {fixedTitleBackend || 'Frontend Engineering Career Blueprint (Duplicate!)'}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Node.js, Express, databases, and microservices backend engineering roadmap with Indian salary benchmarks.
            </p>
          </div>

          {/* Snippet 2 */}
          <div className="p-4 rounded-2xl bg-[#1e2337] border border-white/10 space-y-1">
            <span className="text-[10px] text-slate-400 font-mono block">https://skillsguide.in/pricing</span>
            <div className="text-sm font-bold text-sky-400 hover:underline cursor-pointer">
              SkillsGuide Pricing - Transparent Career Plans
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {addedPricingDesc || '(Warning: Meta description is missing. Google will generate arbitrary snippet from body text.)'}
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
