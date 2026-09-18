'use client';

import React, { useState } from 'react';
import { LabScenarioVariant } from '@/lib/labs/types';
import { downloadJson } from '@/lib/labs/exportHelper';

interface Props {
  scenario?: LabScenarioVariant;
  variant: 'beginner' | 'intermediate' | 'challenge';
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

interface B2bLead {
  id: string;
  company: string;
  contactName: string;
  headcount: number;
  inquiryNotes: string;
  fitAssessment?: 'qualified_deal' | 'disqualified_unfit' | 'nurture_future';
}

export default function B2bDiscoveryConversationLab({ onDirty, onSubmit }: Props) {
  const [leads, setLeads] = useState<B2bLead[]>([
    { id: 'lead_1', company: 'Nexus FinTech (500 Eng)', contactName: 'Priya Sharma (VP Eng)', headcount: 500, inquiryNotes: 'Urgent need: Onboarding 40 juniors on AWS cloud & security. Budget approved for Q4.', fitAssessment: 'qualified_deal' },
    { id: 'lead_2', company: 'Sole Freelance Studio', contactName: 'Rahul Verma (Owner)', headcount: 1, inquiryNotes: 'Looking for free personal certificates to bid on small Fiverr gigs. No enterprise training budget.', fitAssessment: 'disqualified_unfit' }, // Correctly disqualified
    { id: 'lead_3', company: 'Global Logistics Corp', contactName: 'David Miller (Head of L&D)', headcount: 2000, inquiryNotes: 'Exploring internal upskilling for next fiscal year. Needs LMS SCORM integration.', fitAssessment: 'nurture_future' },
  ]);

  const [selectedLeadId, setSelectedLeadId] = useState<string>('lead_1');
  const [selectedQuestionBranch, setSelectedQuestionBranch] = useState<'budget_timing' | 'technical_stack' | 'pricing_discount'>('budget_timing');
  const [followupEmailDraft, setFollowupEmailDraft] = useState<string>('Hi Priya, thank you for sharing Nexus FinTech\'s onboarding goals for the 40 new engineers. Attached is our tailored syllabus and enterprise SOC2 compliance package...');

  const activeLead = leads.find(l => l.id === selectedLeadId) || leads[0];

  const updateLeadFit = (id: string, fit: B2bLead['fitAssessment']) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, fitAssessment: fit } : l));
    onDirty();
  };

  const handleExportJson = () => {
    downloadJson('b2b_discovery_qualification.json', {
      leads,
      selectedQuestionBranch,
      followupEmailDraft
    });
  };

  const handleFinalSubmit = () => {
    onSubmit({
      leads,
      selectedQuestionBranch,
      followupEmailDraft
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Lab 21 • Enterprise Sales & Discovery
            </span>
            <h2 className="text-xl font-bold text-white mt-2">B2B Discovery Conversation & Qualification Lab</h2>
            <p className="text-sm text-slate-400 mt-1">
              Apply MEDDIC qualification to inbound enterprise training leads. Disqualify low-fit leads gracefully to preserve sales capacity, and compose targeted stakeholder recaps.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              Export Qualification
            </button>
            <button
              onClick={handleFinalSubmit}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition shadow-lg shadow-blue-600/20"
            >
              Submit Discovery
            </button>
          </div>
        </div>
      </div>

      {/* Leads & Discovery Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white">Inbound Lead Pipeline (3 Accounts)</h3>

          <div className="space-y-3">
            {leads.map(l => (
              <div
                key={l.id}
                onClick={() => setSelectedLeadId(l.id)}
                className={`p-4 rounded-xl border transition cursor-pointer ${
                  l.id === selectedLeadId
                    ? 'bg-slate-800 border-blue-500/60 shadow-md'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-white">{l.company}</span>
                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${
                    l.fitAssessment === 'qualified_deal'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : l.fitAssessment === 'disqualified_unfit'
                      ? 'bg-slate-700 text-slate-300'
                      : 'bg-blue-500/20 text-blue-300'
                  }`}>
                    {l.fitAssessment?.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">Contact: {l.contactName} • {l.headcount} employees</div>
                <p className="text-xs text-slate-300 mt-2">{l.inquiryNotes}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Discovery Question Branching & Followup Draft */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 text-xs">
            <h3 className="text-sm font-semibold text-white">Qualification Decision: {activeLead.company}</h3>

            <div>
              <label className="text-slate-400 block mb-1">Lead Fit Classification</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'qualified_deal', label: 'Qualified' },
                  { id: 'disqualified_unfit', label: 'Disqualify' },
                  { id: 'nurture_future', label: 'Nurture' },
                ].map(fit => (
                  <button
                    key={fit.id}
                    onClick={() => updateLeadFit(activeLead.id, fit.id as any)}
                    className={`py-1.5 text-xs font-semibold rounded-lg border transition ${
                      activeLead.fitAssessment === fit.id
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {fit.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <label className="text-slate-400 block mb-1">Selected Discovery Question Focus</label>
              <select
                value={selectedQuestionBranch}
                onChange={e => { setSelectedQuestionBranch(e.target.value as any); onDirty(); }}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none"
              >
                <option value="budget_timing">Timeline & Budget Authority (Decision Process)</option>
                <option value="technical_stack">Technical Architecture & Stack Alignment</option>
                <option value="pricing_discount">Premature Pricing Negotiation (Avoid in Discovery)</option>
              </select>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <label className="text-slate-400 block mb-1">Executive Recap Follow-Up Draft (Inert Simulation)</label>
              <textarea
                rows={4}
                value={followupEmailDraft}
                onChange={e => { setFollowupEmailDraft(e.target.value); onDirty(); }}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
