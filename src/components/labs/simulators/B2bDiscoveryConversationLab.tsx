'use client';

import { useMemo, useState } from 'react';
import { LabScenarioVariant, LabDifficulty } from '@/lib/labs/types';
import { useUndoableState } from '@/lib/labs/useUndoableState';
import { downloadJson } from '@/lib/labs/exportHelper';
import ChartFrame from '@/components/labs/charts/ChartFrame';
import CompareBarChart from '@/components/labs/charts/CompareBarChart';
import CompareRadarChart from '@/components/labs/charts/CompareRadarChart';
import { Undo2, Redo2, RotateCcw, Send, FileJson, ShieldAlert, MessageSquare, ClipboardList } from 'lucide-react';

interface SimulatorProps {
  scenario?: LabScenarioVariant;
  variant: LabDifficulty;
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

type FitId = 'qualified_deal' | 'disqualified_unfit' | 'nurture_future';
type NeedId = 'sso_or_compliance' | 'bulk_seat_onboarding' | 'lms_integration' | 'budget_approved_urgent' | 'individual_non_enterprise';
type BranchId = 'budget_timing' | 'technical_stack' | 'pricing_discount';

const NEED_IDS: NeedId[] = ['sso_or_compliance', 'bulk_seat_onboarding', 'lms_integration', 'budget_approved_urgent', 'individual_non_enterprise'];
const NEED_LABEL: Record<NeedId, string> = {
  sso_or_compliance: 'SOC2 / Compliance Requirement',
  bulk_seat_onboarding: 'Bulk Seat Onboarding at Scale',
  lms_integration: 'LMS / SCORM Integration',
  budget_approved_urgent: 'Budget Approved, Urgent Timeline',
  individual_non_enterprise: 'Individual Use, No Enterprise Budget',
};
const FIT_LABEL: Record<FitId, string> = { qualified_deal: 'Qualified', disqualified_unfit: 'Disqualify', nurture_future: 'Nurture' };

interface BranchResponse { id: BranchId; label: string; response: string; revealsNeed?: NeedId; }
interface ObjectionOption { id: string; label: string; respectful: boolean; }
interface Lead {
  id: string; company: string; contactName: string; headcount: number; timeline: string; inquiryNotes: string;
  branches: BranchResponse[]; objectionPrompt: string; objectionOptions: ObjectionOption[];
  trueNeeds: NeedId[]; idealFit: FitId; baseProbability: number;
}

function mkLeads(companySuffix: string, notesSuffix: string): Lead[] {
  return [
    {
      id: 'lead_1', company: `Nexus FinTech${companySuffix}`, contactName: 'Priya Sharma (VP Eng)', headcount: 500, timeline: 'urgent',
      inquiryNotes: `Urgent need: onboarding 40 juniors on AWS cloud & security this quarter. Budget approved.${notesSuffix}`,
      branches: [
        { id: 'budget_timing', label: 'Ask about timeline and budget authority', response: 'Budget is already approved for Q4 and we need seats live within three weeks.', revealsNeed: 'budget_approved_urgent' },
        { id: 'technical_stack', label: 'Ask about technical stack and compliance needs', response: 'We are SOC2 Type II and require SSO plus audit logging before any vendor onboarding.', revealsNeed: 'sso_or_compliance' },
        { id: 'pricing_discount', label: 'Ask for their target price point', response: 'We have not discussed pricing internally yet — that feels premature.' },
      ],
      objectionPrompt: 'Your pricing seems higher than a generic MOOC platform.',
      objectionOptions: [
        { id: 'value_explain', label: 'Explain the SOC2 compliance and dedicated onboarding included at this tier', respectful: true },
        { id: 'dismiss_competitor', label: 'Say competitors are lower quality and move on', respectful: false },
        { id: 'unauthorized_discount', label: 'Immediately offer 40% off without approval to close today', respectful: false },
      ],
      trueNeeds: ['sso_or_compliance', 'budget_approved_urgent'], idealFit: 'qualified_deal', baseProbability: 0.65,
    },
    {
      id: 'lead_2', company: `Sole Freelance Studio${companySuffix}`, contactName: 'Rahul Verma (Owner)', headcount: 1, timeline: 'not_now',
      inquiryNotes: `Looking for free personal certificates to bid on small freelance gigs. No enterprise training budget.${notesSuffix}`,
      branches: [
        { id: 'budget_timing', label: 'Ask about timeline and budget authority', response: 'No budget — I was hoping for a free plan or a big discount.' },
        { id: 'technical_stack', label: 'Ask about technical stack and compliance needs', response: 'I just need a certificate for my portfolio, nothing about integrations.' },
        { id: 'pricing_discount', label: 'Ask for their target price point', response: 'Honestly I want it for free, I am not able to pay the listed price.', revealsNeed: 'individual_non_enterprise' },
      ],
      objectionPrompt: 'Can I get the enterprise plan features for free since I am just one person?',
      objectionOptions: [
        { id: 'explain_individual_plan', label: 'Explain the individual plan already fits their use case at the right price', respectful: true },
        { id: 'ignore_keep_pushing', label: 'Ignore the question and keep pushing the enterprise deal', respectful: false },
        { id: 'grant_free_enterprise', label: 'Grant free enterprise access to keep them happy', respectful: false },
      ],
      trueNeeds: ['individual_non_enterprise'], idealFit: 'disqualified_unfit', baseProbability: 0.05,
    },
    {
      id: 'lead_3', company: `Global Logistics Corp${companySuffix}`, contactName: 'David Miller (Head of L&D)', headcount: 2000, timeline: 'exploratory',
      inquiryNotes: `Exploring internal upskilling for next fiscal year, no budget approved yet. Needs LMS SCORM integration.${notesSuffix}`,
      branches: [
        { id: 'budget_timing', label: 'Ask about timeline and budget authority', response: 'We are exploring for next fiscal year — no budget approved yet.' },
        { id: 'technical_stack', label: 'Ask about technical stack and compliance needs', response: 'We would need SCORM export so results sync into our internal LMS for 2,000 staff.', revealsNeed: 'lms_integration' },
        { id: 'pricing_discount', label: 'Ask for their target price point', response: 'We cannot discuss pricing without a budget cycle in place.' },
      ],
      objectionPrompt: 'We need to see this work for another logistics company before committing.',
      objectionOptions: [
        { id: 'offer_reference_pilot', label: 'Offer a reference call with a similar customer and propose a small pilot cohort', respectful: true },
        { id: 'dismiss_and_push', label: 'Dismiss the concern and ask them to sign now', respectful: false },
        { id: 'unlimited_free_pilot', label: 'Promise unlimited free seats indefinitely during the pilot', respectful: false },
      ],
      trueNeeds: ['lms_integration', 'bulk_seat_onboarding'], idealFit: 'nurture_future', baseProbability: 0.25,
    },
  ];
}

const FIXTURES: Record<LabDifficulty, Lead[]> = {
  beginner: mkLeads('', ''),
  intermediate: mkLeads(' (Regional Division)', ' Their champion mentioned budget approval could still shift after a security review.'),
  challenge: mkLeads(' (New Markets Unit)', ' A second stakeholder later hinted the approved budget may be reallocated to a competing initiative next week.'),
};

interface LeadState { fitAssessment: FitId | ''; checkedNeeds: Record<NeedId, boolean>; questionBranch: BranchId | ''; objectionChoice: string; }
interface B2bState { leads: Record<string, LeadState>; }

function initialState(leads: Lead[]): B2bState {
  const out: Record<string, LeadState> = {};
  leads.forEach((l) => { out[l.id] = { fitAssessment: '', checkedNeeds: Object.fromEntries(NEED_IDS.map((n) => [n, false])) as Record<NeedId, boolean>, questionBranch: '', objectionChoice: '' }; });
  return { leads: out };
}

export default function B2bDiscoveryConversationLab({ variant, onDirty, onSubmit }: SimulatorProps) {
  const leads = useMemo(() => FIXTURES[variant], [variant]);
  const { state, set, undo, redo, reset, canUndo, canRedo, stepIndex } = useUndoableState<B2bState>(initialState(leads));
  const [selectedLeadId, setSelectedLeadId] = useState(leads[0].id);
  const [discoveryNotes, setDiscoveryNotes] = useState('');
  const [followupDraft, setFollowupDraft] = useState('');

  const activeLead = leads.find((l) => l.id === selectedLeadId) || leads[0];
  const activeState = state.leads[activeLead.id];

  const update = (leadId: string, patch: Partial<LeadState>) => {
    set((prev) => ({ leads: { ...prev.leads, [leadId]: { ...prev.leads[leadId], ...patch } } }));
    onDirty();
  };

  const forecastValues = leads.map((l) => Math.round(l.headcount * 8 * l.baseProbability));

  const handleExportJson = () => {
    downloadJson('b2b_discovery_qualification.json', { variant, leads: state.leads, discoveryNotes, followupDraft, followupSent: false });
  };

  const handleSubmit = () => {
    onSubmit({
      leads: leads.map((l) => ({
        id: l.id,
        fitAssessment: state.leads[l.id].fitAssessment,
        idealFit: l.idealFit,
        checkedNeeds: NEED_IDS.filter((n) => state.leads[l.id].checkedNeeds[n]),
        trueNeeds: l.trueNeeds,
        objectionChoice: state.leads[l.id].objectionChoice,
        respectfulOptionId: l.objectionOptions.find((o) => o.respectful)?.id,
      })),
      discoveryNotes,
      followupDraft,
      followupSent: false,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Leads Qualified</span>
          <span className="text-xl font-black text-white">{leads.filter((l) => state.leads[l.id].fitAssessment).length} / 3</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Step {stepIndex} in history</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Objections Resolved</span>
          <span className="text-xl font-black text-white">{leads.filter((l) => state.leads[l.id].objectionChoice).length} / 3</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Follow-up Composer</span>
          <span className="text-xl font-black text-emerald-400">Draft Only</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Never sends email</span>
        </div>
        <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/30">
          <span className="text-xs text-blue-300 font-bold block mb-1">Discovery Progress</span>
          <span className="text-xl font-black text-blue-100">
            {leads.filter((l) => state.leads[l.id].questionBranch).length} / 3
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-sm font-extrabold text-white flex items-center gap-2"><MessageSquare className="w-4 h-4 text-blue-400" /><span>Inbound Lead Pipeline (3 Accounts)</span></h2>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={undo} disabled={!canUndo} title="Undo" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30"><Undo2 className="w-3.5 h-3.5" /></button>
                <button type="button" onClick={redo} disabled={!canRedo} title="Redo" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30"><Redo2 className="w-3.5 h-3.5" /></button>
                <button type="button" onClick={() => { reset(); onDirty(); }} title="Reset" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white"><RotateCcw className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <div className="space-y-2.5">
              {leads.map((l) => (
                <div key={l.id} onClick={() => setSelectedLeadId(l.id)} className={`p-3.5 rounded-xl border cursor-pointer transition ${l.id === selectedLeadId ? 'bg-blue-950/30 border-blue-500/60' : 'bg-black/20 border-white/10'}`}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-white">{l.company}</span>
                    {state.leads[l.id].fitAssessment && <span className="px-2 py-0.5 rounded font-bold text-[10px] uppercase bg-blue-500/20 text-blue-300">{FIT_LABEL[state.leads[l.id].fitAssessment as FitId]}</span>}
                  </div>
                  <div className="text-[11px] text-slate-400">Contact: {l.contactName} · {l.headcount} employees</div>
                  <p className="text-xs text-slate-300 mt-1.5">{l.inquiryNotes}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3 text-xs">
            <h3 className="text-sm font-semibold text-white">Discovery Conversation: {activeLead.company}</h3>
            <div>
              <label className="text-slate-400 block mb-1.5">Choose a discovery question branch</label>
              <div className="grid grid-cols-1 gap-1.5">
                {activeLead.branches.map((b) => (
                  <button key={b.id} type="button" onClick={() => update(activeLead.id, { questionBranch: b.id })}
                    className={`text-left p-2 rounded-lg border transition ${activeState.questionBranch === b.id ? 'bg-blue-600/20 border-blue-500/50 text-blue-100' : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'}`}>
                    {b.label}
                  </button>
                ))}
              </div>
              {activeState.questionBranch && (
                <p className="mt-2 p-2 rounded-lg bg-black/30 border border-white/10 text-slate-300 italic">&ldquo;{activeLead.branches.find((b) => b.id === activeState.questionBranch)?.response}&rdquo;</p>
              )}
            </div>

            <div className="pt-2 border-t border-white/10">
              <label className="text-slate-400 block mb-1.5 flex items-center gap-1.5"><ClipboardList className="w-3.5 h-3.5" />Stated Needs Checklist</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {NEED_IDS.map((n) => (
                  <label key={n} className="flex items-center gap-1.5 p-1.5 rounded-lg bg-white/5 border border-white/10 text-[11px] text-slate-300">
                    <input type="checkbox" checked={activeState.checkedNeeds[n]} onChange={(e) => update(activeLead.id, { checkedNeeds: { ...activeState.checkedNeeds, [n]: e.target.checked } })} />
                    {NEED_LABEL[n]}
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-white/10">
              <label className="text-slate-400 block mb-1 flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5" />Objection: {activeLead.objectionPrompt}</label>
              <div className="grid grid-cols-1 gap-1.5">
                {activeLead.objectionOptions.map((o) => (
                  <button key={o.id} type="button" onClick={() => update(activeLead.id, { objectionChoice: o.id })}
                    className={`text-left p-2 rounded-lg border transition ${activeState.objectionChoice === o.id ? 'bg-blue-600/20 border-blue-500/50 text-blue-100' : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'}`}>
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-white/10">
              <label className="text-slate-400 block mb-1">Lead Fit Classification</label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(FIT_LABEL) as FitId[]).map((fit) => (
                  <button key={fit} type="button" onClick={() => update(activeLead.id, { fitAssessment: fit })}
                    className={`py-1.5 text-xs font-semibold rounded-lg border transition ${activeState.fitAssessment === fit ? 'bg-blue-600 text-white border-blue-500' : 'bg-black/30 border-white/10 text-slate-400'}`}>
                    {FIT_LABEL[fit]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <ChartFrame title="Opportunity Value by Lead (Scenario Forecast)" icon={<MessageSquare className="w-4 h-4 text-blue-400" />}
            tableHeaders={['Lead', 'Forecast Value']} tableRows={leads.map((l, i) => [l.company, forecastValues[i]])}>
            <CompareBarChart labels={leads.map((l) => l.company.split(' ').slice(0, 2).join(' '))} series={[{ label: 'Forecast', data: forecastValues }]} yLabel="Scenario Value" />
          </ChartFrame>

          <ChartFrame title={`Needs Fit — ${activeLead.company}`} icon={<ClipboardList className="w-4 h-4 text-blue-400" />}
            tableHeaders={['Need', 'Actual', 'Your Assessment']}
            tableRows={NEED_IDS.map((n) => [NEED_LABEL[n], activeLead.trueNeeds.includes(n) ? 1 : 0, activeState.checkedNeeds[n] ? 1 : 0])}>
            <CompareRadarChart axes={NEED_IDS.map((n) => NEED_LABEL[n].split(' ').slice(0, 2).join(' '))}
              series={[
                { label: 'Actual Needs', data: NEED_IDS.map((n) => (activeLead.trueNeeds.includes(n) ? 1 : 0)) },
                { label: 'Your Assessment', data: NEED_IDS.map((n) => (activeState.checkedNeeds[n] ? 1 : 0)) },
              ]} max={1} />
          </ChartFrame>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-2">
            <label className="text-xs font-extrabold text-white">Discovery Notes (self-reviewed)</label>
            <textarea rows={3} value={discoveryNotes} onChange={(e) => { setDiscoveryNotes(e.target.value); onDirty(); }}
              placeholder="Synthesize your discovery findings across leads: budget availability, timeline urgency, compliance requirements, and disqualifications..."
              className="w-full text-xs p-3 rounded-xl bg-black/30 border border-white/15 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50" />
          </div>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-2">
            <label className="text-xs font-extrabold text-white">Follow-Up Draft — Saved Locally, Never Sent</label>
            <textarea rows={3} value={followupDraft} onChange={(e) => { setFollowupDraft(e.target.value); onDirty(); }}
              placeholder="Draft a professional follow-up addressing uncovered requirements (e.g. SOC2 compliance, team syllabus, pilot terms)..."
              className="w-full text-xs p-3 rounded-xl bg-black/30 border border-white/15 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50" />
            <p className="text-[10px] text-slate-500">This composer only saves a local draft. SkillsGuide never sends email or contacts anyone on your behalf.</p>
            <button type="button" onClick={handleExportJson} className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] font-bold"><FileJson className="w-3.5 h-3.5" /><span>Save Draft as JSON</span></button>
          </div>

          <button type="button" onClick={handleSubmit} className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-extrabold flex items-center justify-center gap-2">
            <Send className="w-4 h-4" /><span>Submit Discovery Qualification</span>
          </button>
        </div>
      </div>
    </div>
  );
}
