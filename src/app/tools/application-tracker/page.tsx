'use client';

import React, { useState, useEffect } from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { 
  Briefcase, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ExternalLink, 
  Calendar, 
  Building, 
  IndianRupee,
  Search,
  Filter,
  Layers,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

interface JobApplication {
  id: string;
  companyName: string;
  roleTitle: string;
  stage: 'Applied' | 'Screening' | 'Technical Round / Assignment' | 'Final Interview' | 'Offer Received' | 'Archived';
  appliedDate: string;
  targetSalary: string;
  projectLinkSubmitted: string;
  interviewNotes: string;
  nextFollowUpDate: string;
}

const DEFAULT_APPLICATIONS: JobApplication[] = [
  {
    id: 'demo-1',
    companyName: 'FinTech Analytics Solutions',
    roleTitle: 'Junior Data Analyst',
    stage: 'Technical Round / Assignment',
    appliedDate: '2026-09-01',
    targetSalary: '₹6.5 LPA',
    projectLinkSubmitted: 'https://novypro.com/project/swiggy-analytics-demo',
    interviewNotes: 'Passed HR screening. Requested SQL take-home assignment focusing on window functions and cohort retention by Friday.',
    nextFollowUpDate: '2026-09-15'
  },
  {
    id: 'demo-2',
    companyName: 'CloudScale Technologies',
    roleTitle: 'Full-Stack Next.js Developer',
    stage: 'Screening',
    appliedDate: '2026-09-08',
    targetSalary: '₹8.0 LPA',
    projectLinkSubmitted: 'https://github.com/demo/edtech-marketplace-razorpay',
    interviewNotes: 'Applied via LinkedIn direct message to engineering lead. Sent Loom video demo.',
    nextFollowUpDate: '2026-09-14'
  }
];

export default function ApplicationTrackerPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('All');

  // Form State
  const [companyName, setCompanyName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [stage, setStage] = useState<JobApplication['stage']>('Applied');
  const [appliedDate, setAppliedDate] = useState(new Date().toISOString().split('T')[0]);
  const [targetSalary, setTargetSalary] = useState('');
  const [projectLinkSubmitted, setProjectLinkSubmitted] = useState('');
  const [interviewNotes, setInterviewNotes] = useState('');
  const [nextFollowUpDate, setNextFollowUpDate] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('skillsguide_job_applications');
      if (saved) {
        setApplications(JSON.parse(saved));
      } else {
        setApplications(DEFAULT_APPLICATIONS);
      }
    } catch (e) {
      console.error('Error loading applications', e);
      setApplications(DEFAULT_APPLICATIONS);
    }
    setIsLoaded(true);
  }, []);

  const saveApplications = (list: JobApplication[]) => {
    setApplications(list);
    try {
      localStorage.setItem('skillsguide_job_applications', JSON.stringify(list));
    } catch (e) {
      console.error('Error saving applications', e);
    }
  };

  const handleAddApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !roleTitle.trim()) return;

    const newApp: JobApplication = {
      id: Date.now().toString(),
      companyName: companyName.trim(),
      roleTitle: roleTitle.trim(),
      stage,
      appliedDate: appliedDate || new Date().toISOString().split('T')[0],
      targetSalary: targetSalary.trim(),
      projectLinkSubmitted: projectLinkSubmitted.trim(),
      interviewNotes: interviewNotes.trim(),
      nextFollowUpDate
    };

    const updated = [newApp, ...applications];
    saveApplications(updated);

    // Reset Form
    setCompanyName('');
    setRoleTitle('');
    setStage('Applied');
    setTargetSalary('');
    setProjectLinkSubmitted('');
    setInterviewNotes('');
    setNextFollowUpDate('');
    setIsAddingNew(false);
  };

  const handleDelete = (id: string) => {
    const updated = applications.filter(a => a.id !== id);
    saveApplications(updated);
  };

  const handleStageChange = (id: string, newStage: JobApplication['stage']) => {
    const updated = applications.map(a => a.id === id ? { ...a, stage: newStage } : a);
    saveApplications(updated);
  };

  const filteredApplications = applications.filter(a => {
    const matchesSearch = a.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.roleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.interviewNotes.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = stageFilter === 'All' || a.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  const breadcrumbs = [
    { name: 'Career Tools', url: '/#salary-explorer' },
    { name: 'Job Application & Interview Tracker' }
  ];

  const stageBadgeColors: Record<JobApplication['stage'], string> = {
    'Applied': 'bg-slate-800 text-slate-300 border-slate-700',
    'Screening': 'bg-purple-900/40 text-purple-300 border-purple-500/40',
    'Technical Round / Assignment': 'bg-cyan-900/40 text-cyan-300 border-cyan-500/40',
    'Final Interview': 'bg-amber-900/40 text-amber-300 border-amber-500/40',
    'Offer Received': 'bg-emerald-900/40 text-emerald-300 border-emerald-500/40',
    'Archived': 'bg-slate-900 text-slate-500 border-slate-800'
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-10 max-w-6xl mx-auto space-y-8">
      <Breadcrumbs items={breadcrumbs} />

      {/* Hero Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-semibold mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Structured Job Search Pipeline</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Job Application & Interview Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Track your target companies, technical project submissions, interview rounds, and notes in one private dashboard saved to your browser.
          </p>
        </div>

        <button
          onClick={() => setIsAddingNew(!isAddingNew)}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-glow-btn flex items-center gap-2 shrink-0 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{isAddingNew ? 'Close Form' : 'Add Application'}</span>
        </button>
      </div>

      {/* Add New Application Form */}
      {isAddingNew && (
        <form onSubmit={handleAddApplication} className="glass-card p-6 sm:p-8 rounded-3xl border border-purple-500/30 space-y-4 bg-slate-900/90 animate-in fade-in">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-purple-400" />
            <span>Add New Job Application</span>
          </h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Company Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Swiggy / TCS / Startup"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white focus:border-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Role Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Junior Data Analyst"
                value={roleTitle}
                onChange={e => setRoleTitle(e.target.value)}
                className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white focus:border-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Current Stage</label>
              <select
                value={stage}
                onChange={e => setStage(e.target.value as JobApplication['stage'])}
                className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white focus:border-purple-500 outline-none"
              >
                <option value="Applied">Applied</option>
                <option value="Screening">Screening</option>
                <option value="Technical Round / Assignment">Technical Round / Assignment</option>
                <option value="Final Interview">Final Interview</option>
                <option value="Offer Received">Offer Received</option>
                <option value="Archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Date Applied</label>
              <input
                type="date"
                value={appliedDate}
                onChange={e => setAppliedDate(e.target.value)}
                className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white focus:border-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Target CTC / Salary</label>
              <input
                type="text"
                placeholder="e.g. ₹6.5 LPA"
                value={targetSalary}
                onChange={e => setTargetSalary(e.target.value)}
                className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white focus:border-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Project / Portfolio Link Submitted</label>
              <input
                type="url"
                placeholder="e.g. https://github.com/yourname/project"
                value={projectLinkSubmitted}
                onChange={e => setProjectLinkSubmitted(e.target.value)}
                className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white focus:border-purple-500 outline-none"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-bold mb-1">Interview Notes & Questions Asked</label>
              <textarea
                rows={3}
                placeholder="Take notes on questions asked, feedback received, or follow-up assignments..."
                value={interviewNotes}
                onChange={e => setInterviewNotes(e.target.value)}
                className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white focus:border-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Next Follow-Up Date</label>
              <input
                type="date"
                value={nextFollowUpDate}
                onChange={e => setNextFollowUpDate(e.target.value)}
                className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white focus:border-purple-500 outline-none"
              />
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-glow-btn transition-all"
                >
                  Save Application
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search company, role, or notes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900 rounded-xl border border-slate-800 text-white focus:border-purple-500 outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {['All', 'Applied', 'Screening', 'Technical Round / Assignment', 'Final Interview', 'Offer Received'].map(stg => (
            <button
              key={stg}
              onClick={() => setStageFilter(stg)}
              className={`px-3 py-1.5 rounded-lg border text-[11px] font-semibold transition-all ${
                stageFilter === stg 
                  ? 'bg-purple-600 text-white border-purple-500' 
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {stg}
            </button>
          ))}
        </div>
      </div>

      {/* Application Cards List */}
      <div className="space-y-3">
        {filteredApplications.length === 0 ? (
          <div className="glass-card p-10 rounded-3xl border border-white/10 text-center space-y-3">
            <Briefcase className="w-8 h-8 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No applications matching your filter</h3>
            <p className="text-xs text-slate-400">Click &quot;Add Application&quot; above to log your first target role.</p>
          </div>
        ) : (
          filteredApplications.map((app) => (
            <div 
              key={app.id} 
              className="glass-card p-5 sm:p-6 rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all space-y-3 bg-slate-900/80"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{app.companyName}</h3>
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${stageBadgeColors[app.stage]}`}>
                      {app.stage}
                    </span>
                  </div>
                  <p className="text-xs text-purple-300 font-semibold mt-0.5">{app.roleTitle}</p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={app.stage}
                    onChange={e => handleStageChange(app.id, e.target.value as JobApplication['stage'])}
                    className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none"
                  >
                    <option value="Applied">Move to: Applied</option>
                    <option value="Screening">Move to: Screening</option>
                    <option value="Technical Round / Assignment">Move to: Technical Round</option>
                    <option value="Final Interview">Move to: Final Interview</option>
                    <option value="Offer Received">Move to: Offer Received</option>
                    <option value="Archived">Move to: Archived</option>
                  </select>

                  <button
                    onClick={() => handleDelete(app.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                    title="Delete application"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Details Row */}
              <div className="grid sm:grid-cols-3 gap-2 text-xs pt-1 text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Applied: <strong>{app.appliedDate}</strong></span>
                </div>
                {app.targetSalary && (
                  <div className="flex items-center gap-1.5">
                    <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Target CTC: <strong className="text-emerald-300">{app.targetSalary}</strong></span>
                  </div>
                )}
                {app.nextFollowUpDate && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Follow-up: <strong className="text-amber-300">{app.nextFollowUpDate}</strong></span>
                  </div>
                )}
              </div>

              {/* Submitted Project Link */}
              {app.projectLinkSubmitted && (
                <div className="text-xs pt-1">
                  <span className="text-slate-500">Submitted Proof Link: </span>
                  <a 
                    href={app.projectLinkSubmitted} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-purple-300 hover:underline inline-flex items-center gap-1 font-mono text-[11px]"
                  >
                    <span>{app.projectLinkSubmitted}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {/* Interview Notes */}
              {app.interviewNotes && (
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono leading-relaxed">
                  <span className="text-[10px] uppercase font-bold text-slate-400 font-sans block mb-0.5">Notes:</span>
                  {app.interviewNotes}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Connected Journey Links */}
      <div className="grid sm:grid-cols-3 gap-4 pt-4 text-xs">
        <Link 
          href="/tools/ats-resume"
          className="p-4 rounded-2xl glass-card border border-white/10 hover:border-purple-500/40 transition-all space-y-1 group"
        >
          <strong className="text-white group-hover:text-purple-300 block">1. ATS Resume Checklist</strong>
          <p className="text-slate-400">Review machine-readable formatting before submitting.</p>
        </Link>
        <Link 
          href="/tools/roi-calculator"
          className="p-4 rounded-2xl glass-card border border-white/10 hover:border-purple-500/40 transition-all space-y-1 group"
        >
          <strong className="text-white group-hover:text-purple-300 block">2. Salary ROI Calculator</strong>
          <p className="text-slate-400">Calculate transition break-even and payback timelines.</p>
        </Link>
        <Link 
          href="/journeys"
          className="p-4 rounded-2xl glass-card border border-white/10 hover:border-purple-500/40 transition-all space-y-1 group"
        >
          <strong className="text-white group-hover:text-purple-300 block">3. Tailored Learner Journeys</strong>
          <p className="text-slate-400">Explore situation-specific career transition strategies.</p>
        </Link>
      </div>

    </div>
  );
}
