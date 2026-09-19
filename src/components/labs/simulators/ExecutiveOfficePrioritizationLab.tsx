'use client';

import { useMemo, useState } from 'react';
import { LabScenarioVariant, LabDifficulty } from '@/lib/labs/types';
import { useUndoableState } from '@/lib/labs/useUndoableState';
import { downloadCsv, downloadJson } from '@/lib/labs/exportHelper';
import ChartFrame from '@/components/labs/charts/ChartFrame';
import CompareBarChart from '@/components/labs/charts/CompareBarChart';
import BreakdownDoughnutChart from '@/components/labs/charts/BreakdownDoughnutChart';
import {
  Inbox, Calendar, Plane, FileText, AlertTriangle, CheckCircle2, Send, ArrowUp, ArrowDown,
  Undo2, Redo2, RotateCcw, Download, FileJson, ShieldAlert, Lock,
} from 'lucide-react';

interface SimulatorProps {
  scenario?: LabScenarioVariant;
  variant: LabDifficulty;
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

type EventType = 'mandatory_internal' | 'mandatory_client';
type Tier = 'urgent_important' | 'important_not_urgent' | 'urgent_not_important' | 'delegate_archive';

interface CalendarEvent { id: string; title: string; type: EventType; startUtc: string; endUtc: string; localLabel: string; movable: boolean; }
interface CandidateSlot { id: string; label: string; startUtc: string; endUtc: string; }
interface InboxItem { id: string; sender: string; subject: string; correctTier: Tier; }
interface TravelOption { id: string; label: string; departUtc: string; arriveUtc: string; price: number; }
interface TaskItem { id: string; title: string; deadlineUtc: string; approvalRequired: boolean; tieBreakPriority?: number; tieBreakHint?: string; }

interface Fixture {
  label: string;
  events: CalendarEvent[];
  movableEventId: string;
  candidateSlots: CandidateSlot[];
  inbox: InboxItem[];
  travelOptions: TravelOption[];
  approvalThreshold: number;
  destinationOffsetHours: number;
  recommendedTravelId: string;
  tasks: TaskItem[];
}

const TIER_LABELS: Record<Tier, string> = {
  urgent_important: '1. Urgent & Important',
  important_not_urgent: '2. Important / Schedule',
  urgent_not_important: '3. Urgent / Quick Fix',
  delegate_archive: '4. Delegate / Archive',
};

function overlaps(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return new Date(aStart).getTime() < new Date(bEnd).getTime() && new Date(bStart).getTime() < new Date(aEnd).getTime();
}

function localHourFromUtc(utcIso: string, offsetHours: number): number {
  const d = new Date(utcIso);
  const hour = ((d.getUTCHours() + d.getUTCMinutes() / 60 + offsetHours) % 24 + 24) % 24;
  return hour;
}

function fmtLocalHour(hour: number): string {
  const h = Math.floor(hour);
  const m = Math.round((hour - h) * 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// Three genuinely different fixtures: calendar distractor events (and thus
// candidate reschedule slots that look free but actually collide) increase
// from 0 to 2, the inbox grows from 6 to 8 items, and the number of
// same-deadline task pairs that require an explicit tie-break grows from 1
// to 2.
const FIXTURES: Record<LabDifficulty, Fixture> = {
  beginner: {
    label: 'Monday Morning Calendar & Inbox Triage',
    events: [
      { id: 'ev_board', title: 'Board Audit Committee Formal Review', type: 'mandatory_internal', startUtc: '2026-09-23T09:30:00Z', endUtc: '2026-09-23T10:30:00Z', localLabel: 'Wed 15:00–16:00 IST', movable: false },
      { id: 'ev_pitch', title: 'Apex Corp Enterprise Deal Closing Pitch', type: 'mandatory_client', startUtc: '2026-09-23T09:30:00Z', endUtc: '2026-09-23T10:30:00Z', localLabel: 'Wed 15:00–16:00 IST', movable: true },
    ],
    movableEventId: 'ev_pitch',
    candidateSlots: [
      { id: 'slot_same', label: 'Keep Wed 15:00 IST (original slot)', startUtc: '2026-09-23T09:30:00Z', endUtc: '2026-09-23T10:30:00Z' },
      { id: 'slot_thu11', label: 'Thu 11:00 IST', startUtc: '2026-09-24T05:30:00Z', endUtc: '2026-09-24T06:30:00Z' },
    ],
    inbox: [
      { id: 'mail_1', sender: 'Kavita Rao (Board Chair)', subject: 'URGENT: Board Audit Committee Draft Review', correctTier: 'urgent_important' },
      { id: 'mail_2', sender: 'Rajesh Verma (VP Sales)', subject: 'Wednesday: Apex Corp Enterprise Renewal ($450k ARR)', correctTier: 'urgent_important' },
      { id: 'mail_3', sender: 'Pooja Nair (HR Director)', subject: 'Annual Headcount Strategy 2027 Memo', correctTier: 'important_not_urgent' },
      { id: 'mail_4', sender: 'IT Desk Admin', subject: 'ACTION REQUIRED: 2FA Hardware Token Expiry (4 hours)', correctTier: 'urgent_not_important' },
      { id: 'mail_5', sender: 'Office Supplies Vendor', subject: 'Updated Cafeteria Coffee Bean Catalogue Q4', correctTier: 'delegate_archive' },
      { id: 'mail_6', sender: 'Corporate Travel Desk', subject: 'Singapore Summit Flight Itinerary Options', correctTier: 'urgent_important' },
    ],
    travelOptions: [
      { id: 'opt_a', label: 'Connecting Air (via Kuala Lumpur)', departUtc: '2026-09-29T17:00:00Z', arriveUtc: '2026-09-29T20:15:00Z', price: 32000 },
      { id: 'opt_b', label: 'Singapore Airlines Direct SQ503', departUtc: '2026-09-29T17:40:00Z', arriveUtc: '2026-09-29T22:20:00Z', price: 48000 },
    ],
    approvalThreshold: 40000,
    destinationOffsetHours: 8,
    recommendedTravelId: 'opt_b',
    tasks: [
      { id: 'task_audit', title: 'Submit Board Audit Signoff', deadlineUtc: '2026-09-23T09:00:00Z', approvalRequired: false, tieBreakPriority: 1, tieBreakHint: 'Blocks the mandatory Board Audit meeting — zero slack if missed.' },
      { id: 'task_redlines', title: 'Confirm Client Contract Redlines', deadlineUtc: '2026-09-23T09:00:00Z', approvalRequired: false, tieBreakPriority: 2, tieBreakHint: 'Client has indicated flexibility of up to one business day.' },
      { id: 'task_2fa', title: 'Renew 2FA Hardware Token', deadlineUtc: '2026-09-18T12:00:00Z', approvalRequired: false },
      { id: 'task_vendor', title: 'Delegate Coffee Vendor Renewal', deadlineUtc: '2026-10-05T00:00:00Z', approvalRequired: false },
      { id: 'task_travel', title: 'Approve Singapore Travel Booking', deadlineUtc: '2026-09-25T00:00:00Z', approvalRequired: true },
    ],
  },
  intermediate: {
    label: 'Cross-Booked Wednesday with a Hidden Conflict',
    events: [
      { id: 'ev_board', title: 'Board Audit Committee Formal Review', type: 'mandatory_internal', startUtc: '2026-09-23T09:30:00Z', endUtc: '2026-09-23T10:30:00Z', localLabel: 'Wed 15:00–16:00 IST', movable: false },
      { id: 'ev_pitch', title: 'Apex Corp Enterprise Deal Closing Pitch', type: 'mandatory_client', startUtc: '2026-09-23T09:30:00Z', endUtc: '2026-09-23T10:30:00Z', localLabel: 'Wed 15:00–16:00 IST', movable: true },
      { id: 'ev_cfo', title: 'CFO 1:1 Sync', type: 'mandatory_internal', startUtc: '2026-09-24T05:30:00Z', endUtc: '2026-09-24T06:00:00Z', localLabel: 'Thu 11:00–11:30 IST', movable: false },
    ],
    movableEventId: 'ev_pitch',
    candidateSlots: [
      { id: 'slot_same', label: 'Keep Wed 15:00 IST (original slot)', startUtc: '2026-09-23T09:30:00Z', endUtc: '2026-09-23T10:30:00Z' },
      { id: 'slot_thu11', label: 'Thu 11:00 IST', startUtc: '2026-09-24T05:30:00Z', endUtc: '2026-09-24T06:30:00Z' },
      { id: 'slot_thu14', label: 'Thu 14:00 IST', startUtc: '2026-09-24T08:30:00Z', endUtc: '2026-09-24T09:30:00Z' },
    ],
    inbox: [
      { id: 'mail_1', sender: 'Kavita Rao (Board Chair)', subject: 'URGENT: Board Audit Committee Draft Review', correctTier: 'urgent_important' },
      { id: 'mail_2', sender: 'Rajesh Verma (VP Sales)', subject: 'Wednesday: Apex Corp Enterprise Renewal ($450k ARR)', correctTier: 'urgent_important' },
      { id: 'mail_3', sender: 'Pooja Nair (HR Director)', subject: 'Annual Headcount Strategy 2027 Memo', correctTier: 'important_not_urgent' },
      { id: 'mail_4', sender: 'IT Desk Admin', subject: 'ACTION REQUIRED: 2FA Hardware Token Expiry (4 hours)', correctTier: 'urgent_not_important' },
      { id: 'mail_5', sender: 'Office Supplies Vendor', subject: 'Updated Cafeteria Coffee Bean Catalogue Q4', correctTier: 'delegate_archive' },
      { id: 'mail_6', sender: 'Corporate Travel Desk', subject: 'Singapore Summit Flight Itinerary Options', correctTier: 'urgent_important' },
      { id: 'mail_7', sender: 'Legal Counsel', subject: 'Non-Urgent: NDA Template Refresh', correctTier: 'important_not_urgent' },
    ],
    travelOptions: [
      { id: 'opt_a', label: 'Connecting Air (via Kuala Lumpur)', departUtc: '2026-09-29T17:00:00Z', arriveUtc: '2026-09-29T20:15:00Z', price: 34000 },
      { id: 'opt_b', label: 'Singapore Airlines Direct SQ503', departUtc: '2026-09-29T17:40:00Z', arriveUtc: '2026-09-29T22:20:00Z', price: 52000 },
    ],
    approvalThreshold: 45000,
    destinationOffsetHours: 8,
    recommendedTravelId: 'opt_b',
    tasks: [
      { id: 'task_audit', title: 'Submit Board Audit Signoff', deadlineUtc: '2026-09-23T09:00:00Z', approvalRequired: false, tieBreakPriority: 1, tieBreakHint: 'Blocks the mandatory Board Audit meeting — zero slack if missed.' },
      { id: 'task_redlines', title: 'Confirm Client Contract Redlines', deadlineUtc: '2026-09-23T09:00:00Z', approvalRequired: false, tieBreakPriority: 2, tieBreakHint: 'Client has indicated flexibility of up to one business day.' },
      { id: 'task_2fa', title: 'Renew 2FA Hardware Token', deadlineUtc: '2026-09-18T12:00:00Z', approvalRequired: false },
      { id: 'task_vendor', title: 'Delegate Coffee Vendor Renewal', deadlineUtc: '2026-10-05T00:00:00Z', approvalRequired: false },
      { id: 'task_travel', title: 'Approve Singapore Travel Booking', deadlineUtc: '2026-09-25T00:00:00Z', approvalRequired: true },
      { id: 'task_budget', title: 'Submit Q4 Budget Draft', deadlineUtc: '2026-09-26T00:00:00Z', approvalRequired: false },
    ],
  },
  challenge: {
    label: 'Triple-Booked Wednesday Under Regulatory Deadline',
    events: [
      { id: 'ev_board', title: 'Board Audit Committee Formal Review', type: 'mandatory_internal', startUtc: '2026-09-23T09:30:00Z', endUtc: '2026-09-23T10:30:00Z', localLabel: 'Wed 15:00–16:00 IST', movable: false },
      { id: 'ev_pitch', title: 'Apex Corp Enterprise Deal Closing Pitch', type: 'mandatory_client', startUtc: '2026-09-23T09:30:00Z', endUtc: '2026-09-23T10:30:00Z', localLabel: 'Wed 15:00–16:00 IST', movable: true },
      { id: 'ev_cfo', title: 'CFO 1:1 Sync', type: 'mandatory_internal', startUtc: '2026-09-24T05:30:00Z', endUtc: '2026-09-24T06:00:00Z', localLabel: 'Thu 11:00–11:30 IST', movable: false },
      { id: 'ev_travel_call', title: 'Travel Desk Confirmation Call', type: 'mandatory_internal', startUtc: '2026-09-24T08:30:00Z', endUtc: '2026-09-24T09:00:00Z', localLabel: 'Thu 14:00–14:30 IST', movable: false },
    ],
    movableEventId: 'ev_pitch',
    candidateSlots: [
      { id: 'slot_same', label: 'Keep Wed 15:00 IST (original slot)', startUtc: '2026-09-23T09:30:00Z', endUtc: '2026-09-23T10:30:00Z' },
      { id: 'slot_thu11', label: 'Thu 11:00 IST', startUtc: '2026-09-24T05:30:00Z', endUtc: '2026-09-24T06:30:00Z' },
      { id: 'slot_thu14', label: 'Thu 14:00 IST', startUtc: '2026-09-24T08:30:00Z', endUtc: '2026-09-24T09:30:00Z' },
      { id: 'slot_thu16', label: 'Thu 16:00 IST', startUtc: '2026-09-24T10:30:00Z', endUtc: '2026-09-24T11:30:00Z' },
    ],
    inbox: [
      { id: 'mail_1', sender: 'Kavita Rao (Board Chair)', subject: 'URGENT: Board Audit Committee Draft Review', correctTier: 'urgent_important' },
      { id: 'mail_2', sender: 'Rajesh Verma (VP Sales)', subject: 'Wednesday: Apex Corp Enterprise Renewal ($450k ARR)', correctTier: 'urgent_important' },
      { id: 'mail_3', sender: 'Pooja Nair (HR Director)', subject: 'Annual Headcount Strategy 2027 Memo', correctTier: 'important_not_urgent' },
      { id: 'mail_4', sender: 'IT Desk Admin', subject: 'ACTION REQUIRED: 2FA Hardware Token Expiry (4 hours)', correctTier: 'urgent_not_important' },
      { id: 'mail_5', sender: 'Office Supplies Vendor', subject: 'Updated Cafeteria Coffee Bean Catalogue Q4', correctTier: 'delegate_archive' },
      { id: 'mail_6', sender: 'Corporate Travel Desk', subject: 'Singapore Summit Flight Itinerary Options', correctTier: 'urgent_important' },
      { id: 'mail_7', sender: 'Legal Counsel', subject: 'Non-Urgent: NDA Template Refresh', correctTier: 'important_not_urgent' },
      { id: 'mail_8', sender: 'Facilities', subject: 'FYI Only: Elevator Maintenance Notice', correctTier: 'delegate_archive' },
    ],
    travelOptions: [
      { id: 'opt_a', label: 'Connecting Air (via Kuala Lumpur)', departUtc: '2026-09-29T17:00:00Z', arriveUtc: '2026-09-29T20:15:00Z', price: 36000 },
      { id: 'opt_b', label: 'Singapore Airlines Direct SQ503', departUtc: '2026-09-29T17:40:00Z', arriveUtc: '2026-09-29T22:20:00Z', price: 58000 },
    ],
    approvalThreshold: 50000,
    destinationOffsetHours: 8,
    recommendedTravelId: 'opt_b',
    tasks: [
      { id: 'task_audit', title: 'Submit Board Audit Signoff', deadlineUtc: '2026-09-23T09:00:00Z', approvalRequired: false, tieBreakPriority: 1, tieBreakHint: 'Blocks the mandatory Board Audit meeting — zero slack if missed.' },
      { id: 'task_redlines', title: 'Confirm Client Contract Redlines', deadlineUtc: '2026-09-23T09:00:00Z', approvalRequired: false, tieBreakPriority: 2, tieBreakHint: 'Client has indicated flexibility of up to one business day.' },
      { id: 'task_2fa', title: 'Renew 2FA Hardware Token', deadlineUtc: '2026-09-18T12:00:00Z', approvalRequired: false, tieBreakPriority: 1, tieBreakHint: 'Hardware token lockout is irreversible without an IT escalation ticket.' },
      { id: 'task_legal', title: 'Review NDA Template', deadlineUtc: '2026-09-18T12:00:00Z', approvalRequired: false, tieBreakPriority: 2, tieBreakHint: 'Legal has an internal two-day grace window before this is due externally.' },
      { id: 'task_vendor', title: 'Delegate Coffee Vendor Renewal', deadlineUtc: '2026-10-05T00:00:00Z', approvalRequired: false },
      { id: 'task_travel', title: 'Approve Singapore Travel Booking', deadlineUtc: '2026-09-25T00:00:00Z', approvalRequired: true },
      { id: 'task_budget', title: 'Submit Q4 Budget Draft', deadlineUtc: '2026-09-26T00:00:00Z', approvalRequired: false },
    ],
  },
};

interface OfficeState {
  selectedSlotId: string;
  triagedInbox: Record<string, Tier>;
  selectedTravelId: string;
  travelApprovalConfirmed: boolean;
  taskApprovals: Record<string, boolean>;
  taskOrder: string[];
}

function initialState(fixture: Fixture): OfficeState {
  return {
    selectedSlotId: fixture.candidateSlots[0].id,
    triagedInbox: Object.fromEntries(fixture.inbox.map((i) => [i.id, 'urgent_important' as Tier])),
    selectedTravelId: fixture.travelOptions[0].id,
    travelApprovalConfirmed: false,
    taskApprovals: Object.fromEntries(fixture.tasks.filter((t) => t.approvalRequired).map((t) => [t.id, false])),
    taskOrder: fixture.tasks.map((t) => t.id),
  };
}

export default function ExecutiveOfficePrioritizationLab({ variant, onDirty, onSubmit }: SimulatorProps) {
  const fixture = FIXTURES[variant];
  const { state, set, undo, redo, reset, canUndo, canRedo, stepIndex, history } = useUndoableState<OfficeState>(initialState(fixture));
  const [handoverMemo, setHandoverMemo] = useState(
    'Shift Handover Briefing:\n1. Rescheduling the Apex Corp pitch to resolve the Board Audit overlap.\n2. Reviewing Singapore travel options against the fatigue and approval policy.\n3. Prompting the MD for immediate 2FA hardware token verification.'
  );
  const [rescheduleNoticeDraft, setRescheduleNoticeDraft] = useState(
    'Draft note to Apex Corp (not sent): "We would like to move our pitch discussion — proposing the earliest available slot this week that works for your team. Will confirm shortly."'
  );
  const [preparedNotices, setPreparedNotices] = useState({ handover: false, clientNotice: false });

  const update = (patch: Partial<OfficeState>) => {
    set((prev) => ({ ...prev, ...patch }));
    onDirty();
  };

  const effectiveEvents = useMemo(() => {
    const slot = fixture.candidateSlots.find((s) => s.id === state.selectedSlotId) ?? fixture.candidateSlots[0];
    return fixture.events.map((ev) => (ev.id === fixture.movableEventId ? { ...ev, startUtc: slot.startUtc, endUtc: slot.endUtc, localLabel: slot.label } : ev));
  }, [fixture, state.selectedSlotId]);

  const conflicts = useMemo(() => {
    const mandatory = effectiveEvents.filter((e) => e.type === 'mandatory_internal' || e.type === 'mandatory_client');
    const pairs: [string, string][] = [];
    for (let i = 0; i < mandatory.length; i++) {
      for (let j = i + 1; j < mandatory.length; j++) {
        if (overlaps(mandatory[i].startUtc, mandatory[i].endUtc, mandatory[j].startUtc, mandatory[j].endUtc)) pairs.push([mandatory[i].title, mandatory[j].title]);
      }
    }
    return pairs;
  }, [effectiveEvents]);
  const conflictResolved = conflicts.length === 0;

  const tierCounts = useMemo(() => {
    const counts: Record<Tier, number> = { urgent_important: 0, important_not_urgent: 0, urgent_not_important: 0, delegate_archive: 0 };
    fixture.inbox.forEach((item) => { counts[state.triagedInbox[item.id] || 'urgent_important'] += 1; });
    return counts;
  }, [fixture.inbox, state.triagedInbox]);

  const travelWithRisk = useMemo(() => fixture.travelOptions.map((opt) => {
    const localArrival = localHourFromUtc(opt.arriveUtc, fixture.destinationOffsetHours);
    return { ...opt, localArrival, fatigueRisk: localArrival < 6, needsApproval: opt.price > fixture.approvalThreshold };
  }), [fixture]);
  const selectedTravel = travelWithRisk.find((t) => t.id === state.selectedTravelId) ?? travelWithRisk[0];

  const deadlineGroups = useMemo(() => {
    const groups: Record<string, TaskItem[]> = {};
    fixture.tasks.forEach((t) => { groups[t.deadlineUtc] = [...(groups[t.deadlineUtc] || []), t]; });
    return Object.values(groups).filter((g) => g.length > 1);
  }, [fixture.tasks]);

  const moveTask = (index: number, dir: -1 | 1) => {
    const next = [...state.taskOrder];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    update({ taskOrder: next });
  };

  const handleExportCsv = () => {
    downloadCsv('executive_task_plan.csv', state.taskOrder.map((id, i) => {
      const t = fixture.tasks.find((task) => task.id === id)!;
      return { rank: i + 1, title: t.title, deadline_utc: t.deadlineUtc, approval_required: t.approvalRequired, approved: state.taskApprovals[id] ?? false };
    }));
  };

  const handleExportJson = () => {
    downloadJson('executive_office_agenda.json', {
      variant,
      agenda: effectiveEvents,
      taskPlan: state.taskOrder.map((id, i) => ({ rank: i + 1, id })),
      unsentMessages: { handoverMemo, rescheduleNoticeDraft, preparedNotices },
      handover: handoverMemo,
      optimizationHistory: history.length,
    });
  };

  const handleSubmit = () => {
    onSubmit({
      variant,
      selectedSlotId: state.selectedSlotId,
      conflictResolved,
      triagedInbox: state.triagedInbox,
      selectedTravelId: state.selectedTravelId,
      travelApprovalConfirmed: state.travelApprovalConfirmed,
      taskApprovals: state.taskApprovals,
      taskOrder: state.taskOrder,
      handoverMemo,
      rescheduleNoticeDraft,
      draftPrepared: preparedNotices.handover && preparedNotices.clientNotice,
      optimizationHistoryLength: history.length,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className={`p-4 rounded-2xl border transition-all ${conflictResolved ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-red-950/30 border-red-500/40 animate-pulse'}`}>
          <div className="flex items-center gap-2 mb-1">{conflictResolved ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-red-400" />}<span className="text-xs font-bold text-white">Calendar Overlap Conflict</span></div>
          <p className="text-[11px] text-slate-300">{conflictResolved ? 'No overlapping mandatory commitments detected.' : `CRITICAL: ${conflicts.map(([a, b]) => `${a} overlaps ${b}`).join('; ')}`}</p>
        </div>
        <div className={`p-4 rounded-2xl border transition-all ${state.selectedTravelId === fixture.recommendedTravelId && (!selectedTravel.needsApproval || state.travelApprovalConfirmed) ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-amber-950/30 border-amber-500/40'}`}>
          <div className="flex items-center gap-2 mb-1"><Plane className="w-4 h-4 text-cyan-400" /><span className="text-xs font-bold text-white">Travel Policy Window</span></div>
          <p className="text-[11px] text-slate-300">{selectedTravel.label}: arrives {fmtLocalHour(selectedTravel.localArrival)} local {selectedTravel.fatigueRisk ? '(fatigue risk)' : '(within refresh window)'}{selectedTravel.needsApproval ? state.travelApprovalConfirmed ? ' — approval confirmed' : ' — APPROVAL MISSING' : ''}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <div className="flex items-center gap-2 mb-1"><Inbox className="w-4 h-4 text-purple-400" /><span className="text-xs font-bold text-white">Inbox Triage Status</span></div>
          <p className="text-[11px] text-slate-300">{fixture.inbox.length} of {fixture.inbox.length} communications mapped to Eisenhower quadrants.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-sm font-extrabold text-white flex items-center gap-2"><Calendar className="w-4 h-4 text-purple-400" /><span>1. Week Calendar &amp; Conflict Resolution</span></h2>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={undo} disabled={!canUndo} title="Undo" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30"><Undo2 className="w-3.5 h-3.5" /></button>
                <button type="button" onClick={redo} disabled={!canRedo} title="Redo" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30"><Redo2 className="w-3.5 h-3.5" /></button>
                <button type="button" onClick={() => { reset(); onDirty(); }} title="Reset" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white"><RotateCcw className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <div className="space-y-2.5">
              {effectiveEvents.map((ev) => (
                <div key={ev.id} className={`p-3 rounded-xl border flex items-center justify-between gap-2 text-xs ${ev.type === 'mandatory_client' && !conflictResolved ? 'bg-red-950/20 border-red-500/40' : 'bg-white/5 border-white/10'}`}>
                  <div>
                    <span className="font-bold text-white">{ev.title}</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">{ev.localLabel} • UTC {ev.startUtc.slice(11, 16)}–{ev.endUtc.slice(11, 16)}</p>
                  </div>
                  {ev.movable ? null : <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400"><Lock className="w-3 h-3" />LOCKED</span>}
                </div>
              ))}
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block mb-1.5">Reschedule the movable pitch to:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {fixture.candidateSlots.map((slot) => (
                  <button key={slot.id} type="button" onClick={() => update({ selectedSlotId: slot.id })}
                    className={`p-2.5 rounded-xl border text-left text-[11px] font-semibold transition-all ${state.selectedSlotId === slot.id ? 'bg-purple-600/20 border-purple-500/40 text-purple-200' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}>
                    {slot.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-4">
            <h2 className="text-sm font-extrabold text-white flex items-center gap-2"><Plane className="w-4 h-4 text-cyan-400" /><span>2. Singapore Summit Travel Comparison</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {travelWithRisk.map((opt) => (
                <button key={opt.id} type="button" onClick={() => update({ selectedTravelId: opt.id })}
                  className={`p-4 rounded-2xl border text-left transition-all ${state.selectedTravelId === opt.id ? 'bg-purple-600/10 border-purple-500/50' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-white">{opt.label}</span>
                    <span className="text-xs font-mono text-slate-400">₹{opt.price.toLocaleString()}</span>
                  </div>
                  <p className="text-[11px] text-slate-300">Arrives {fmtLocalHour(opt.localArrival)} local time</p>
                  <span className={`text-[10px] block mt-2 font-semibold ${opt.fatigueRisk ? 'text-amber-400' : 'text-emerald-400'}`}>{opt.fatigueRisk ? 'Fatigue risk: early-hours arrival' : 'Compliant refresh window'}</span>
                  {opt.needsApproval && <span className="text-[10px] block mt-1 font-semibold text-cyan-300">Exceeds ₹{fixture.approvalThreshold.toLocaleString()} — requires approval</span>}
                </button>
              ))}
            </div>
            {selectedTravel.needsApproval && (
              <label className="flex items-center gap-2 text-[11px] text-slate-300">
                <input type="checkbox" checked={state.travelApprovalConfirmed} onChange={(e) => update({ travelApprovalConfirmed: e.target.checked })} className="accent-purple-500" />
                I have requested and confirmed budget approval for this booking.
              </label>
            )}
          </div>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <h2 className="text-sm font-extrabold text-white flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-amber-400" /><span>3. Task Board (Priority Ranking)</span></h2>
            {deadlineGroups.length > 0 && (
              <p className="text-[10px] text-amber-300">Tasks sharing an identical deadline must be explicitly re-ranked based on which has less real slack: {deadlineGroups.map((g) => g.map((t) => t.title).join(' vs. ')).join('; ')}.</p>
            )}
            <div className="space-y-2">
              {state.taskOrder.map((id, i) => {
                const task = fixture.tasks.find((t) => t.id === id)!;
                const tied = deadlineGroups.some((g) => g.some((t) => t.id === id));
                return (
                  <div key={id} className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs ${tied ? 'bg-amber-950/20 border-amber-500/30' : 'bg-white/5 border-white/10'}`}>
                    <div>
                      <span className="font-bold text-white">#{i + 1} {task.title}</span>
                      <p className="text-[10px] text-slate-400">Deadline UTC: {task.deadlineUtc.slice(0, 16).replace('T', ' ')}{task.approvalRequired ? ' • Approval required' : ''}</p>
                      {task.tieBreakHint && <p className="text-[10px] text-amber-300/90 italic mt-0.5">{task.tieBreakHint}</p>}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {task.approvalRequired && (
                        <label className="flex items-center gap-1 text-[10px] text-slate-300">
                          <input type="checkbox" checked={state.taskApprovals[id] ?? false} onChange={(e) => update({ taskApprovals: { ...state.taskApprovals, [id]: e.target.checked } })} className="accent-purple-500" />
                          Approved
                        </label>
                      )}
                      <button type="button" onClick={() => moveTask(i, -1)} disabled={i === 0} className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 text-slate-300" aria-label={`Raise priority of ${task.title}`}><ArrowUp className="w-3 h-3" /></button>
                      <button type="button" onClick={() => moveTask(i, 1)} disabled={i === state.taskOrder.length - 1} className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 text-slate-300" aria-label={`Lower priority of ${task.title}`}><ArrowDown className="w-3 h-3" /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-4">
            <h2 className="text-sm font-extrabold text-white flex items-center gap-2"><Inbox className="w-4 h-4 text-indigo-400" /><span>4. Eisenhower Priority Matrix</span></h2>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              {(Object.keys(TIER_LABELS) as Tier[]).map((tier) => (
                <div key={tier} className="p-2 rounded-lg bg-white/5 border border-white/10 min-h-[70px]">
                  <span className="font-bold text-slate-300 block mb-1">{TIER_LABELS[tier]}</span>
                  {fixture.inbox.filter((i) => state.triagedInbox[i.id] === tier).map((i) => (
                    <span key={i.id} className="block text-slate-400 truncate">{i.subject}</span>
                  ))}
                </div>
              ))}
            </div>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1 text-xs">
              {fixture.inbox.map((mail) => (
                <div key={mail.id} className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-2">
                  <div className="min-w-0"><span className="font-bold text-white block truncate">{mail.subject}</span><span className="text-[10px] text-slate-400">{mail.sender}</span></div>
                  <select value={state.triagedInbox[mail.id]} onChange={(e) => update({ triagedInbox: { ...state.triagedInbox, [mail.id]: e.target.value as Tier } })}
                    className="text-[10px] font-bold p-1 rounded-lg bg-black/40 border border-white/15 text-slate-300">
                    {(Object.keys(TIER_LABELS) as Tier[]).map((tier) => <option key={tier} value={tier}>{TIER_LABELS[tier]}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>

          <ChartFrame title="Eisenhower Tier Counts" icon={<Inbox className="w-4 h-4 text-purple-400" />}
            tableHeaders={['Tier', 'Count']} tableRows={(Object.keys(TIER_LABELS) as Tier[]).map((t) => [TIER_LABELS[t], tierCounts[t]])}>
            <CompareBarChart labels={(Object.keys(TIER_LABELS) as Tier[]).map((t) => TIER_LABELS[t].replace(/^\d\.\s*/, ''))} series={[{ label: 'Items', data: (Object.keys(TIER_LABELS) as Tier[]).map((t) => tierCounts[t]) }]} />
          </ChartFrame>

          <ChartFrame title="Inbox Triage Share" icon={<Inbox className="w-4 h-4 text-purple-400" />}
            tableHeaders={['Tier', 'Share']} tableRows={(Object.keys(TIER_LABELS) as Tier[]).map((t) => [TIER_LABELS[t], tierCounts[t]])}>
            <BreakdownDoughnutChart labels={(Object.keys(TIER_LABELS) as Tier[]).map((t) => TIER_LABELS[t].replace(/^\d\.\s*/, ''))} values={(Object.keys(TIER_LABELS) as Tier[]).map((t) => tierCounts[t])} centerLabel="Items" centerValue={String(fixture.inbox.length)} />
          </ChartFrame>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-2">
            <label htmlFor="handover-memo" className="text-xs font-extrabold text-white flex items-center gap-2"><FileText className="w-3.5 h-3.5 text-purple-400" /><span>5. Executive Shift Handover (unsent evidence)</span></label>
            <textarea id="handover-memo" rows={3} value={handoverMemo} onChange={(e) => { setHandoverMemo(e.target.value); onDirty(); }}
              className="w-full text-xs p-3 rounded-xl bg-black/30 border border-white/15 text-slate-200 focus:outline-none focus:border-purple-500/50" />
            <label className="flex items-center gap-2 text-[11px] text-slate-300">
              <input type="checkbox" checked={preparedNotices.handover} onChange={(e) => setPreparedNotices((p) => ({ ...p, handover: e.target.checked }))} className="accent-purple-500" />
              Mark handover as prepared (never sent — simulation only)
            </label>
            <label htmlFor="client-notice" className="text-xs font-extrabold text-white block pt-2">Client Reschedule Notice (unsent draft)</label>
            <textarea id="client-notice" rows={2} value={rescheduleNoticeDraft} onChange={(e) => { setRescheduleNoticeDraft(e.target.value); onDirty(); }}
              className="w-full text-xs p-3 rounded-xl bg-black/30 border border-white/15 text-slate-200 focus:outline-none focus:border-purple-500/50" />
            <label className="flex items-center gap-2 text-[11px] text-slate-300">
              <input type="checkbox" checked={preparedNotices.clientNotice} onChange={(e) => setPreparedNotices((p) => ({ ...p, clientNotice: e.target.checked }))} className="accent-purple-500" />
              Mark client notice as prepared (never sent — simulation only)
            </label>
            <p className="text-[10px] text-slate-500 italic">All messages, bookings and calendar changes here exist only within this simulation — nothing is ever actually sent, booked or synced. History step {stepIndex}.</p>
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={handleExportCsv} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] font-bold"><Download className="w-3.5 h-3.5" /><span>CSV</span></button>
            <button type="button" onClick={handleExportJson} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] font-bold"><FileJson className="w-3.5 h-3.5" /><span>JSON</span></button>
          </div>

          <button type="button" onClick={handleSubmit} className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold transition-all flex items-center justify-center gap-2">
            <Send className="w-4 h-4" /><span>Submit Handover &amp; Evaluate Lab</span>
          </button>
        </div>
      </div>
    </div>
  );
}
