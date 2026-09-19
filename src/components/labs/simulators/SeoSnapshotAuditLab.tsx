'use client';

import { useMemo, useState } from 'react';
import { LabScenarioVariant, LabDifficulty } from '@/lib/labs/types';
import { useUndoableState } from '@/lib/labs/useUndoableState';
import { downloadCsv, downloadJson } from '@/lib/labs/exportHelper';
import ChartFrame from '@/components/labs/charts/ChartFrame';
import CompareBarChart from '@/components/labs/charts/CompareBarChart';
import BreakdownDoughnutChart from '@/components/labs/charts/BreakdownDoughnutChart';
import {
  Send, Download, FileJson, Undo2, Redo2, RotateCcw, AlertTriangle, CheckCircle2,
  FileText, Eye, Search, ArrowUp, ArrowDown, Link2,
} from 'lucide-react';

interface SimulatorProps {
  scenario?: LabScenarioVariant;
  variant: LabDifficulty;
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

interface SeoPage { id: string; path: string; title: string; description: string; linksTo: string[]; external?: string[]; }

function mkPage(id: string, path: string, title: string, description: string, linksTo: string[], external?: string[]): SeoPage {
  return { id, path, title, description, linksTo, external };
}

function beginnerPages(): SeoPage[] {
  return [
    mkPage('p1', '/', 'SkillsGuide - Empower Your Career Journey', 'Master high-income in-demand tech and business skills with career roadmaps.', ['/skills/data-analytics', '/skills/full-stack-web', '/pricing', '/about', '/glossary'], ['https://twitter.com/skillsguide']),
    mkPage('p2', '/skills/data-analytics', 'Data Analytics Career Roadmap & Salary India', 'Comprehensive guide to becoming a Data Analyst in India with tools and benchmarks.', ['/skills/sql', '/skills/power-bi', '/pricing']),
    mkPage('p3', '/skills/full-stack-web', 'Full-Stack Web Developer Career Guide', 'Step-by-step roadmap to modern full-stack web development with React and Node.', ['/skills/frontend', '/skills/backend', '/pricing', '/tools/ats-resume']),
    mkPage('p4', '/pricing', 'SkillsGuide Pricing - Transparent Career Plans', '', ['/contact', '/about', '/tools/old-calc']),
    mkPage('p5', '/about', 'About Us - SkillsGuide Open Education Mission', 'Learn about our mission to provide accessible, high-quality career blueprints.', ['/contact', '/disclaimer']),
    mkPage('p6', '/contact', 'Contact SkillsGuide Team & Mentors', 'Get in touch with our editorial and skilling advisors.', ['/']),
    mkPage('p7', '/skills/sql', 'SQL for Data Analysis & Engineering Guide', 'Master SQL queries, joins, and window functions for analytics roles.', ['/skills/data-analytics']),
    mkPage('p8', '/skills/power-bi', 'Power BI & DAX Business Intelligence Guide', 'Build enterprise BI dashboards and calculate measures.', ['/skills/data-analytics']),
    mkPage('p9', '/skills/frontend', 'Frontend Engineering Career Blueprint', 'HTML, CSS, React, and accessibility standards for modern web engineering.', ['/skills/full-stack-web']),
    mkPage('p10', '/skills/backend', 'Frontend Engineering Career Blueprint', 'Node.js, Express, databases, and microservices backend engineering.', ['/skills/full-stack-web']),
    mkPage('p11', '/tools/salary-calculator', 'Indian Salary & Take-Home Pay Calculator', 'Calculate take-home monthly salary from CTC with PF and tax breakdown.', ['/pricing']),
    mkPage('p12', '/guides/data-engineering', 'Data Engineering Pipelines & Kafka Architecture', 'Learn Apache Spark, Airflow, Snowflake, and streaming data pipelines.', ['/skills/data-analytics']),
    mkPage('p13', '/glossary', 'Interactive Skilling & Tech Jargon Glossary', 'Demystify 100+ modern technology and career concepts.', ['/', '/compare']),
    mkPage('p14', '/roadmaps', 'Step-by-Step Career Roadmaps & Blueprints', 'Structured week-by-week learning timelines for high-growth tech careers.', ['/skills/data-analytics', '/skills/full-stack-web', '/tools/salary-calculator']),
    mkPage('p15', '/compare', 'Skill vs Skill Side-by-Side Comparisons', 'Compare Python vs Java, React vs Vue, AWS vs Azure.', ['/']),
    mkPage('p16', '/terms', 'Learner Data & Compliance Notice', 'Read our platform terms of service and educational use conditions.', ['/privacy']),
    mkPage('p17', '/privacy', 'Privacy Policy & Data Protection Notice', 'How we collect, protect, and respect learner data.', ['/terms']),
    mkPage('p18', '/disclaimer', 'Learner Data & Compliance Notice', 'Understand our salary data collection methodology and benchmarks.', ['/about']),
    mkPage('p19', '/tools/career-compass', 'Career Compass Quiz - Discover Your Top Career Fit', 'Answer 20 diagnostic questions to uncover your high-ROI trajectory.', ['/roadmaps']),
    mkPage('p20', '/tools/ats-resume', 'ATS Resume Checklist & Action Verbs Guide', 'Make your resume machine-readable and highlight quantified impact.', ['/skills/full-stack-web', '/tools/career-compass']),
  ];
}

function intermediatePages(): SeoPage[] {
  return [
    mkPage('p1', '/', 'SkillsGuide Certifications - Validate Your Skills', 'Enroll in proctored certification tracks with employer-recognized badges.', ['/certifications/data-science', '/certifications/cloud-architecture', '/enroll/pricing', '/company/about', '/resources/glossary'], ['https://linkedin.com/company/skillsguide']),
    mkPage('p2', '/certifications/data-science', 'Data Science Certification Track', 'Proctored exam covering statistics, SQL, and business intelligence modules.', ['/certifications/data-science/sql-module', '/certifications/data-science/bi-module', '/enroll/pricing']),
    mkPage('p3', '/certifications/cloud-architecture', 'Cloud Architecture Certification Track', 'Proctored exam covering AWS and Azure architecture patterns.', ['/certifications/cloud-architecture/aws-track', '/certifications/cloud-architecture/azure-track', '/enroll/pricing', '/tools/resume-badge-verifier']),
    mkPage('p4', '/enroll/pricing', 'Certification Pricing & Exam Vouchers', '', ['/company/contact', '/company/about', '/resources/proctoring-guides']),
    mkPage('p5', '/company/about', 'About Our Certification Board', 'Learn about our proctoring standards and accreditation partners.', ['/company/contact', '/legal/refund-policy']),
    mkPage('p6', '/company/contact', 'Contact the Certification Support Team', 'Reach exam scheduling and technical proctoring support.', ['/']),
    mkPage('p7', '/certifications/data-science/sql-module', 'SQL Module — Data Science Track', 'Query writing, joins, and window functions assessed in the proctored exam.', ['/certifications/data-science']),
    mkPage('p8', '/certifications/data-science/bi-module', 'BI Module — Data Science Track', 'Dashboarding and DAX measures assessed in the proctored exam.', ['/certifications/data-science']),
    mkPage('p9', '/certifications/cloud-architecture/aws-track', 'AWS Cloud Architect Certification Track', 'Well-Architected Framework and AWS service design patterns.', ['/certifications/cloud-architecture']),
    mkPage('p10', '/certifications/cloud-architecture/azure-track', 'AWS Cloud Architect Certification Track', 'Azure Resource Manager and landing-zone design patterns.', ['/certifications/cloud-architecture']),
    mkPage('p11', '/tools/exam-fee-calculator', 'Exam Fee & Retake Cost Calculator', 'Estimate total certification cost including retake vouchers.', ['/enroll/pricing']),
    mkPage('p12', '/resources/proctoring-guide', 'Remote Proctoring Setup Guide', 'Camera, ID verification, and environment requirements for exam day.', ['/certifications/data-science']),
    mkPage('p13', '/resources/glossary', 'Certification Terminology Glossary', 'Demystify proctoring, accreditation, and scoring terminology.', ['/', '/resources/compare-certs']),
    mkPage('p14', '/resources/study-roadmaps', 'Certification Study Roadmaps', 'Week-by-week study timelines per certification track.', ['/certifications/data-science', '/certifications/cloud-architecture', '/tools/exam-fee-calculator']),
    mkPage('p15', '/resources/compare-certs', 'Certification vs Certification Comparisons', 'Compare AWS vs Azure and Data Science vs Cloud tracks.', ['/']),
    mkPage('p16', '/legal/terms', 'Legal Terms & Learner Policies', 'Exam conduct policy, retake rules, and platform terms of service.', ['/legal/privacy']),
    mkPage('p17', '/legal/privacy', 'Privacy Policy & Proctoring Data Notice', 'How proctoring recordings and ID data are collected and protected.', ['/legal/terms']),
    mkPage('p18', '/legal/refund-policy', 'Legal Terms & Learner Policies', 'Refund eligibility windows for exam vouchers and retake bundles.', ['/company/about']),
    mkPage('p19', '/tools/readiness-quiz', 'Certification Readiness Quiz', 'A 15-question diagnostic to gauge exam readiness.', ['/resources/study-roadmaps']),
    mkPage('p20', '/tools/resume-badge-verifier', 'Digital Badge & Resume Verifier', 'Verify a candidate’s certification badge authenticity.', ['/certifications/cloud-architecture', '/tools/readiness-quiz']),
  ];
}

function challengePages(): SeoPage[] {
  return [
    mkPage('p1', '/en/', 'Global Learning Portal - Career Tracks Worldwide', 'Localized career tracks for tech and business skills across regions.', ['/en/tracks/data-analytics', '/en/tracks/full-stack', '/en/pricing', '/en/about', '/en/glossary'], ['https://youtube.com/skillsguideglobal']),
    mkPage('p2', '/en/tracks/data-analytics', 'Data Analytics Track — Global Edition', 'Region-agnostic data analytics curriculum with localized salary notes.', ['/en/tracks/data-analytics/sql', '/en/tracks/data-analytics/power-bi', '/en/pricing']),
    mkPage('p3', '/en/tracks/full-stack', 'Full-Stack Web Track — Global Edition', 'Full-stack curriculum localized for regional hiring markets.', ['/en/tracks/full-stack/frontend', '/en/tracks/full-stack/backend', '/en/pricing', '/en/tools/ats-resume']),
    mkPage('p4', '/en/pricing', 'Global Pricing & Regional Plans', '', ['/en/contact', '/en/about', '/en/guides/data-engineer']),
    mkPage('p5', '/en/about', 'About the Global Learning Portal', 'Our mission to localize high-quality career education worldwide.', ['/en/contact', '/en/legal/accessibility']),
    mkPage('p6', '/en/contact', 'Contact Regional Support', 'Reach a regional advisor for enrollment questions.', ['/en/']),
    mkPage('p7', '/en/tracks/data-analytics/sql', 'SQL Module — Global Data Analytics Track', 'Query writing and schema modeling assessed across regional cohorts.', ['/en/tracks/data-analytics']),
    mkPage('p8', '/en/tracks/data-analytics/power-bi', 'BI Module — Global Data Analytics Track', 'Dashboarding assessed across regional cohorts.', ['/en/tracks/data-analytics']),
    mkPage('p9', '/en/tracks/full-stack/frontend', 'Frontend Engineering — Global Full-Stack Track', 'Accessibility-first frontend curriculum for global learners.', ['/en/tracks/full-stack']),
    mkPage('p10', '/en/tracks/full-stack/backend', 'Frontend Engineering — Global Full-Stack Track', 'Backend services curriculum for global learners.', ['/en/tracks/full-stack']),
    mkPage('p11', '/en/tools/salary-calculator', 'Regional Salary & Take-Home Calculator', 'Estimate take-home pay across supported regions.', ['/en/pricing']),
    mkPage('p12', '/en/guides/data-engineering', 'Data Engineering Pipelines — Global Guide', 'Pipeline architecture patterns used across regional case studies.', ['/en/tracks/data-analytics']),
    mkPage('p13', '/en/glossary', 'Global Terminology Glossary', 'Demystify regional hiring and technology terminology.', ['/en/', '/en/compare']),
    mkPage('p14', '/en/roadmaps', 'Global Career Roadmaps', 'Week-by-week study timelines localized per region.', ['/en/tracks/data-analytics', '/en/tracks/full-stack', '/en/tools/salary-calculator']),
    mkPage('p15', '/en/compare', 'Track vs Track Global Comparisons', 'Compare tracks and regional outcomes side by side.', ['/en/']),
    mkPage('p16', '/en/legal/terms', 'Global Terms & Regional Learner Policies', 'Platform terms of service across supported regions.', ['/en/legal/privacy']),
    mkPage('p17', '/en/legal/privacy', 'Global Privacy Policy & Data Notice', 'How we collect and protect learner data across regions.', ['/en/legal/terms']),
    mkPage('p18', '/en/legal/accessibility', 'Global Terms & Regional Learner Policies', 'Our accessibility commitments across regional editions.', ['/en/about']),
    mkPage('p19', '/en/tools/career-compass', 'Global Career Compass Quiz', 'Answer diagnostic questions to uncover a regional career fit.', ['/en/roadmaps']),
    mkPage('p20', '/en/tools/ats-resume', 'ATS Resume Checklist — Global Edition', 'Make your resume machine-readable for regional applicant systems.', ['/en/tracks/full-stack', '/en/tools/career-compass']),
  ];
}

const HOMEPAGE_ID = 'p1';
const FIXTURES: Record<LabDifficulty, SeoPage[]> = { beginner: beginnerPages(), intermediate: intermediatePages(), challenge: challengePages() };

interface Issues {
  dupGroups: string[][];
  missingDesc: string[];
  orphans: string[];
  broken: { source: string; target: string }[];
}

function computeIssues(pages: SeoPage[]): Issues {
  const pathSet = new Set(pages.map((p) => p.path));
  const inbound = (path: string) => pages.filter((p) => p.linksTo.includes(path)).length;
  const byTitle = new Map<string, string[]>();
  pages.forEach((p) => { if (!p.title.trim()) return; const arr = byTitle.get(p.title) || []; arr.push(p.id); byTitle.set(p.title, arr); });
  const dupGroups: string[][] = [];
  byTitle.forEach((ids) => { if (ids.length >= 2) dupGroups.push(ids); });
  const missingDesc = pages.filter((p) => !p.description.trim()).map((p) => p.id);
  const orphans = pages.filter((p) => p.id !== HOMEPAGE_ID && inbound(p.path) === 0).map((p) => p.id);
  const broken: { source: string; target: string }[] = [];
  pages.forEach((p) => p.linksTo.forEach((l) => { if (l.startsWith('/') && !pathSet.has(l)) broken.push({ source: p.id, target: l }); }));
  return { dupGroups, missingDesc, orphans, broken };
}

export default function SeoSnapshotAuditLab({ variant, onDirty, onSubmit }: SimulatorProps) {
  const initialPages = useMemo(() => FIXTURES[variant], [variant]);
  const { state: pages, set: setPages, undo, redo, reset, canUndo, canRedo, stepIndex } = useUndoableState<SeoPage[]>(initialPages);
  const [activeTab, setActiveTab] = useState<'issues' | 'pages' | 'serp'>('issues');
  const [selectedPageId, setSelectedPageId] = useState('p4');
  const [auditNotes, setAuditNotes] = useState('');

  const initialIssues = useMemo(() => computeIssues(initialPages), [initialPages]);
  const issues = useMemo(() => computeIssues(pages), [pages]);
  const byId = useMemo(() => new Map(pages.map((p) => [p.id, p])), [pages]);
  const pathOptions = pages.map((p) => p.path);

  const [priorityOrder, setPriorityOrder] = useState<string[]>(() => {
    const keys: string[] = [];
    initialIssues.dupGroups.forEach((g, i) => keys.push(`dup-${i}`));
    initialIssues.missingDesc.forEach((id) => keys.push(`desc-${id}`));
    initialIssues.orphans.forEach((id) => keys.push(`orphan-${id}`));
    initialIssues.broken.forEach((b) => keys.push(`broken-${b.source}`));
    return keys;
  });
  const movePriority = (key: string, dir: -1 | 1) => {
    const idx = priorityOrder.indexOf(key);
    const swap = idx + dir;
    if (swap < 0 || swap >= priorityOrder.length) return;
    const next = [...priorityOrder];
    [next[idx], next[swap]] = [next[swap], next[idx]];
    setPriorityOrder(next);
    onDirty();
  };

  const update = (updater: (prev: SeoPage[]) => SeoPage[]) => { setPages(updater); onDirty(); };
  const updateTitle = (id: string, title: string) => update((prev) => prev.map((p) => (p.id === id ? { ...p, title } : p)));
  const updateDescription = (id: string, description: string) => update((prev) => prev.map((p) => (p.id === id ? { ...p, description } : p)));
  const addInboundLink = (sourceId: string, targetPath: string) => update((prev) => prev.map((p) => (p.id === sourceId && !p.linksTo.includes(targetPath) ? { ...p, linksTo: [...p.linksTo, targetPath] } : p)));
  const fixBrokenLink = (sourceId: string, oldTarget: string, newTarget: string) => update((prev) => prev.map((p) => (p.id === sourceId ? { ...p, linksTo: p.linksTo.map((l) => (l === oldTarget ? newTarget : l)) } : p)));

  const resolvedCount =
    initialIssues.dupGroups.filter((g) => { const titles = g.map((id) => byId.get(id)?.title || ''); return new Set(titles).size > 1; }).length +
    initialIssues.missingDesc.filter((id) => (byId.get(id)?.description.trim().length || 0) >= 25).length +
    initialIssues.orphans.filter((id) => !issues.orphans.includes(id)).length +
    initialIssues.broken.filter((b) => !issues.broken.some((cur) => cur.source === b.source)).length;
  const totalIssueCount = initialIssues.dupGroups.length + initialIssues.missingDesc.length + initialIssues.orphans.length + initialIssues.broken.length;

  const categoryCounts = [
    { label: 'Duplicate Titles', count: issues.dupGroups.length },
    { label: 'Missing Description', count: issues.missingDesc.length },
    { label: 'Orphan Pages', count: issues.orphans.length },
    { label: 'Broken Links', count: issues.broken.length },
  ];

  const handleExportCsv = () => {
    downloadCsv('seo_audit.csv', pages.map((p) => ({
      path: p.path, title: p.title, description_length: p.description.length,
      inbound_count: pages.filter((o) => o.linksTo.includes(p.path)).length, is_orphan: issues.orphans.includes(p.id) ? 'YES' : 'NO',
    })));
  };
  const handleExportJson = () => {
    downloadJson('seo_corrected_metadata.json', { variant, pages, priorityOrder, auditNotes });
  };

  const handleSubmit = () => {
    onSubmit({ pages, initialPages, priorityOrder, auditNotes });
  };

  const p4 = byId.get('p4');
  const inspected = byId.get(selectedPageId);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Audit Coverage</span>
          <span className="text-xl font-black text-white">{pages.length} / {pages.length} Pages</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Step {stepIndex} in history</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Issues Resolved</span>
          <span className="text-xl font-black text-purple-300">{resolvedCount} / {totalIssueCount}</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Orphan Pages</span>
          <span className={`text-xl font-black ${issues.orphans.length ? 'text-amber-400' : 'text-emerald-400'}`}>{issues.orphans.length}</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Broken Targets</span>
          <span className={`text-xl font-black ${issues.broken.length ? 'text-red-400' : 'text-emerald-400'}`}>{issues.broken.length}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-white/10 pb-3 flex-wrap">
        <button onClick={() => setActiveTab('issues')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'issues' ? 'bg-purple-600 text-white' : 'bg-white/5 hover:bg-white/10 text-slate-300'}`}>
          <AlertTriangle className="w-3.5 h-3.5" /><span>Repair Queue</span>
        </button>
        <button onClick={() => setActiveTab('pages')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'pages' ? 'bg-purple-600 text-white' : 'bg-white/5 hover:bg-white/10 text-slate-300'}`}>
          <FileText className="w-3.5 h-3.5" /><span>Metadata Table &amp; Inspector</span>
        </button>
        <button onClick={() => setActiveTab('serp')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'serp' ? 'bg-purple-600 text-white' : 'bg-white/5 hover:bg-white/10 text-slate-300'}`}>
          <Eye className="w-3.5 h-3.5" /><span>SERP Preview</span>
        </button>
        <div className="flex-1" />
        <button type="button" onClick={undo} disabled={!canUndo} title="Undo" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30"><Undo2 className="w-3.5 h-3.5" /></button>
        <button type="button" onClick={redo} disabled={!canRedo} title="Redo" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30"><Redo2 className="w-3.5 h-3.5" /></button>
        <button type="button" onClick={() => { reset(); onDirty(); }} title="Reset" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white"><RotateCcw className="w-3.5 h-3.5" /></button>
      </div>

      {activeTab === 'issues' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-3">
            {issues.dupGroups.map((g, i) => (
              <div key={`dup-${i}`} className="p-4 rounded-2xl bg-[#141829] border border-purple-500/40 space-y-2">
                <div className="text-xs font-bold text-white">Duplicate Title: {g.map((id) => byId.get(id)?.path).join(' & ')}</div>
                <p className="text-[11px] text-slate-400">Both pages share &ldquo;{byId.get(g[0])?.title}&rdquo;. Give one a distinct title.</p>
                {g.map((id) => (
                  <input key={id} value={byId.get(id)?.title || ''} onChange={(e) => updateTitle(id, e.target.value)}
                    className="w-full text-xs p-2 rounded-lg bg-black/40 border border-white/15 text-slate-200 focus:outline-none focus:border-purple-500/50" />
                ))}
              </div>
            ))}
            {issues.missingDesc.map((id) => (
              <div key={`desc-${id}`} className="p-4 rounded-2xl bg-[#141829] border border-purple-500/40 space-y-2">
                <div className="text-xs font-bold text-white">Missing Meta Description: {byId.get(id)?.path}</div>
                <textarea rows={2} value={byId.get(id)?.description || ''} onChange={(e) => updateDescription(id, e.target.value)}
                  placeholder="Author a 50-160 character description..."
                  className="w-full text-xs p-2 rounded-lg bg-black/40 border border-white/15 text-slate-200 focus:outline-none focus:border-purple-500/50" />
              </div>
            ))}
            {issues.orphans.map((id) => (
              <div key={`orphan-${id}`} className="p-4 rounded-2xl bg-[#141829] border border-purple-500/40 space-y-2">
                <div className="text-xs font-bold text-white">Orphan Page: {byId.get(id)?.path} (0 inbound links)</div>
                <div className="flex items-center gap-2">
                  <select id={`orphan-src-${id}`} className="flex-1 text-[11px] p-2 rounded-lg bg-black/40 border border-white/15 text-slate-200" defaultValue="">
                    <option value="" disabled>Choose a source page to link from...</option>
                    {pages.filter((p) => p.id !== id).map((p) => <option key={p.id} value={p.id}>{p.path}</option>)}
                  </select>
                  <button type="button" onClick={(e) => { const sel = (e.currentTarget.previousSibling as HTMLSelectElement); if (sel.value) addInboundLink(sel.value, byId.get(id)!.path); }}
                    className="px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold shrink-0">Add Link</button>
                </div>
              </div>
            ))}
            {issues.broken.map((b) => (
              <div key={`broken-${b.source}-${b.target}`} className="p-4 rounded-2xl bg-[#141829] border border-red-500/40 space-y-2">
                <div className="text-xs font-bold text-white flex items-center gap-1.5"><Link2 className="w-3.5 h-3.5 text-red-400" />Broken Target on {byId.get(b.source)?.path}: {b.target}</div>
                <div className="flex items-center gap-2">
                  <select id={`fix-${b.source}`} className="flex-1 text-[11px] p-2 rounded-lg bg-black/40 border border-white/15 text-slate-200" defaultValue="">
                    <option value="" disabled>Choose the correct target...</option>
                    {pathOptions.map((path) => <option key={path} value={path}>{path}</option>)}
                  </select>
                  <button type="button" onClick={(e) => { const sel = (e.currentTarget.previousSibling as HTMLSelectElement); if (sel.value) fixBrokenLink(b.source, b.target, sel.value); }}
                    className="px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold shrink-0">Repair</button>
                </div>
              </div>
            ))}
            {totalIssueCount === resolvedCount && (
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2"><CheckCircle2 className="w-4 h-4" />All tracked defects resolved.</div>
            )}
          </div>

          <div className="lg:col-span-5 space-y-4">
            <ChartFrame title="Issues by Category" icon={<Search className="w-4 h-4 text-purple-400" />} tableHeaders={['Category', 'Count']} tableRows={categoryCounts.map((c) => [c.label, c.count])}>
              <CompareBarChart horizontal labels={categoryCounts.map((c) => c.label)} series={[{ label: 'Remaining', data: categoryCounts.map((c) => c.count), statusOverride: categoryCounts.map((c) => (c.count > 0 ? 'critical' : null)) }]} />
            </ChartFrame>
            <ChartFrame title="Issue Type Share" icon={<AlertTriangle className="w-4 h-4 text-purple-400" />} tableHeaders={['Category', 'Count']} tableRows={categoryCounts.map((c) => [c.label, c.count])}>
              {categoryCounts.some((c) => c.count > 0) ? (
                <BreakdownDoughnutChart labels={categoryCounts.map((c) => c.label)} values={categoryCounts.map((c) => c.count)} centerValue={String(totalIssueCount - resolvedCount)} centerLabel="Open" />
              ) : (
                <BreakdownDoughnutChart labels={['Resolved']} values={[1]} centerValue="0" centerLabel="Open" />
              )}
            </ChartFrame>
            <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">Prioritized Repair List</h3>
              {priorityOrder.map((key, i) => (
                <div key={key} className="flex items-center justify-between text-[11px] p-2 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-slate-300">#{i + 1} — {key}</span>
                  <div className="flex gap-1">
                    <button type="button" onClick={() => movePriority(key, -1)} className="p-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300"><ArrowUp className="w-3 h-3" /></button>
                    <button type="button" onClick={() => movePriority(key, 1)} className="p-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300"><ArrowDown className="w-3 h-3" /></button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-2">
              <label htmlFor="audit-notes" className="text-xs font-extrabold text-white">Technical Audit Log</label>
              <textarea id="audit-notes" rows={3} value={auditNotes} onChange={(e) => { setAuditNotes(e.target.value); onDirty(); }}
                placeholder="Log your technical SEO audit findings: duplicate title resolution, missing descriptions, orphan page linking, and crawl health..."
                className="w-full text-xs p-3 rounded-xl bg-black/30 border border-white/15 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50" />
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={handleExportCsv} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] font-bold"><Download className="w-3.5 h-3.5" /><span>Audit CSV</span></button>
              <button type="button" onClick={handleExportJson} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] font-bold"><FileJson className="w-3.5 h-3.5" /><span>Metadata JSON</span></button>
            </div>
            <button type="button" onClick={handleSubmit} className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold flex items-center justify-center gap-2">
              <Send className="w-4 h-4" /><span>Submit &amp; Evaluate Audit</span>
            </button>
          </div>
        </div>
      )}

      {activeTab === 'pages' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">Metadata Table &amp; Internal Link Graph ({pages.length} pages)</h3>
            <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead><tr className="border-b border-white/10 text-slate-400 text-[11px] sticky top-0 bg-[#111425]"><th className="p-2">Path</th><th className="p-2">Title</th><th className="p-2">Inbound</th><th className="p-2">Outbound</th></tr></thead>
                <tbody className="divide-y divide-white/5">
                  {pages.map((p) => {
                    const inboundCount = pages.filter((o) => o.linksTo.includes(p.path)).length;
                    return (
                      <tr key={p.id} className="hover:bg-white/5 cursor-pointer" onClick={() => setSelectedPageId(p.id)}>
                        <td className="p-2 font-mono text-purple-300 font-semibold">{p.path}</td>
                        <td className="p-2 text-slate-200 max-w-xs truncate">{p.title}</td>
                        <td className="p-2"><span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${inboundCount === 0 && p.id !== HOMEPAGE_ID ? 'bg-red-500/20 text-red-300' : 'bg-white/10 text-slate-300'}`}>{inboundCount}</span></td>
                        <td className="p-2 text-slate-400 font-mono text-[10px]">{p.linksTo.length}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="lg:col-span-4 p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-2 text-xs">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">Page Inspector: {inspected?.path}</h3>
            <p className="text-slate-400">Title: <span className="text-slate-200">{inspected?.title}</span></p>
            <p className="text-slate-400">Description: <span className="text-slate-200">{inspected?.description || '(empty)'}</span></p>
            <p className="text-slate-400">Outbound links: {inspected?.linksTo.join(', ') || 'None'}</p>
            {inspected?.external && inspected.external.length > 0 && <p className="text-slate-500">External (inert): {inspected.external.join(', ')}</p>}
            <div className="pt-2 border-t border-white/10">
              <span className="text-slate-400 block mb-1">Repair Comparison (Before → After)</span>
              {(() => {
                const original = initialPages.find((p) => p.id === selectedPageId);
                if (!original || !inspected) return null;
                const titleChanged = original.title !== inspected.title;
                const descChanged = original.description !== inspected.description;
                if (!titleChanged && !descChanged) return <p className="text-slate-500 italic">No edits yet.</p>;
                return (
                  <div className="space-y-1">
                    {titleChanged && <p className="text-[11px]"><span className="text-slate-500 line-through">{original.title}</span> → <span className="text-emerald-300">{inspected.title}</span></p>}
                    {descChanged && <p className="text-[11px]"><span className="text-slate-500 line-through">{original.description || '(empty)'}</span> → <span className="text-emerald-300">{inspected.description}</span></p>}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'serp' && p4 && (
        <div className="p-6 rounded-3xl bg-[#111425] border border-white/10 space-y-6 max-w-2xl mx-auto">
          <h3 className="text-sm font-extrabold text-white">Simulated Search Results Preview</h3>
          <div className="p-4 rounded-2xl bg-[#1e2337] border border-white/10 space-y-1">
            <span className="text-[10px] text-slate-400 font-mono block">https://skillsguide.in{p4.path}</span>
            <div className="text-sm font-bold text-sky-400">{p4.title}</div>
            <p className="text-xs text-slate-300 leading-relaxed">{p4.description || '(Warning: description missing — Google will auto-generate a snippet.)'}</p>
          </div>
        </div>
      )}
    </div>
  );
}
