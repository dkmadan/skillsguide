'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { LabScenarioVariant, LabDifficulty } from '@/lib/labs/types';
import { useUndoableState } from '@/lib/labs/useUndoableState';
import { downloadCsv, downloadJson } from '@/lib/labs/exportHelper';
import {
  Calendar,
  Mail,
  Plane,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Undo2,
  Redo2,
  RotateCcw,
  Send,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText,
  Users,
  Building2,
  MapPin
} from 'lucide-react';

interface Props {
  scenario?: LabScenarioVariant;
  variant: LabDifficulty;
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

interface CalendarEvent {
  id: string;
  title: string;
  day: string;
  startHour: number; // 24h format in IST
  durationHours: number;
  priority: 'mandatory_client' | 'internal_sync' | 'flexible';
  attendees: string[];
}

interface InboxEmail {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  quadrant?: 'do_first' | 'schedule' | 'delegate' | 'archive';
}

interface TravelOption {
  id: string;
  airline: string;
  departureIST: string;
  arrivalSGT: string;
  duration: string;
  priceINR: number;
  policyCompliant: boolean;
  fatigueRisk: boolean;
}

const INITIAL_EVENTS: Record<LabDifficulty, CalendarEvent[]> = {
  beginner: [
    { id: 'ev1', title: 'Internal Operations Review', day: 'Thursday', startHour: 15, durationHours: 1, priority: 'internal_sync', attendees: ['VP Ops', 'Lead Architect'] },
    { id: 'ev2', title: 'Apex Enterprise Deal Pitch', day: 'Thursday', startHour: 15, durationHours: 1, priority: 'mandatory_client', attendees: ['Apex CEO', 'VP Sales', 'MD'] }, // CONFLICT with ev1!
    { id: 'ev3', title: 'Product Roadmap All-Hands', day: 'Friday', startHour: 14, durationHours: 2, priority: 'flexible', attendees: ['Engineering Team'] }
  ],
  intermediate: [
    { id: 'ev1', title: 'Internal Operations Review', day: 'Thursday', startHour: 15, durationHours: 1, priority: 'internal_sync', attendees: ['VP Ops', 'Lead Architect'] },
    { id: 'ev2', title: 'Apex Enterprise Deal Pitch', day: 'Thursday', startHour: 15, durationHours: 1, priority: 'mandatory_client', attendees: ['Apex CEO', 'VP Sales', 'MD'] },
    { id: 'ev3', title: 'Global Board Alignment Call (PST/GMT/IST)', day: 'Thursday', startHour: 16, durationHours: 1.5, priority: 'mandatory_client', attendees: ['Chairman', 'CFO'] },
    { id: 'ev4', title: 'Weekly 1:1 with VP Product', day: 'Friday', startHour: 11, durationHours: 1, priority: 'flexible', attendees: ['VP Product'] }
  ],
  challenge: [
    { id: 'ev1', title: 'Internal Operations Review', day: 'Thursday', startHour: 15, durationHours: 1, priority: 'internal_sync', attendees: ['VP Ops'] },
    { id: 'ev2', title: 'Apex Enterprise Deal Pitch', day: 'Thursday', startHour: 15, durationHours: 1, priority: 'mandatory_client', attendees: ['Apex CEO', 'VP Sales'] },
    { id: 'ev3', title: 'Hostile Takeover Emergency Board Consultation', day: 'Thursday', startHour: 17, durationHours: 2, priority: 'mandatory_client', attendees: ['Board Directors', 'General Counsel'] },
    { id: 'ev4', title: 'Investor Earnings Debrief', day: 'Friday', startHour: 15, durationHours: 1, priority: 'mandatory_client', attendees: ['IR Lead', 'Managing Director'] }
  ]
};

const INITIAL_EMAILS: InboxEmail[] = [
  { id: 'm1', sender: 'SEBI Regulatory Office', subject: 'URGENT: Formal Disclosure Query regarding Q3 filing', preview: 'Please provide certified schedule of board attendees by 5:00 PM today.' },
  { id: 'm2', sender: 'Sales Director', subject: 'Apex Closing Pitch prep notes', preview: 'Deck updated with final pricing options. Needs 15 min review before call.' },
  { id: 'm3', sender: 'Cloud Provider Rep', subject: 'Annual enterprise renewal discount proposal', preview: 'Proposing 18% tier discount if signed before end of quarter.' },
  { id: 'm4', sender: 'Catering Vendor', subject: 'Lunch menu options for board meeting next week', preview: 'Please confirm dietary preferences for 12 executive guests.' }
];

const TRAVEL_OPTIONS: TravelOption[] = [
  {
    id: 'tr_a',
    airline: 'Connecting Air (via KL)',
    departureIST: '22:30 IST',
    arrivalSGT: '04:15 SGT (Overnight)',
    duration: '8h 15m',
    priceINR: 32000,
    policyCompliant: false,
    fatigueRisk: true // 4 AM arrival before 9 AM keynote!
  },
  {
    id: 'tr_b',
    airline: 'Singapore Airlines Direct SQ503',
    departureIST: '23:10 IST',
    arrivalSGT: '06:20 SGT (Morning)',
    duration: '4h 40m',
    priceINR: 48000,
    policyCompliant: true,
    fatigueRisk: false
  }
];

export default function ExecutiveOfficePrioritizationLab({ variant, onDirty, onSubmit }: Props) {
  const initialEvents = useMemo(() => INITIAL_EVENTS[variant] || INITIAL_EVENTS.beginner, [variant]);

  // Calendar State
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [emails, setEmails] = useState<InboxEmail[]>(INITIAL_EMAILS);
  const [selectedTravelId, setSelectedTravelId] = useState<string>('tr_b');
  const [handoverMemo, setHandoverMemo] = useState<string>(
    'Executive office handover: Rescheduled internal sync to avoid overlap with mandatory Apex closing pitch. Approved direct travel SQ503 adhering to corporate fatigue policy.'
  );

  // Timezone display toggle
  const [activeTab, setActiveTab] = useState<'calendar' | 'inbox' | 'travel' | 'handover'>('calendar');

  // Conflict Detection: Overlapping hours on the same day
  const conflicts = useMemo(() => {
    const list: string[] = [];
    for (let i = 0; i < events.length; i++) {
      for (let j = i + 1; j < events.length; j++) {
        const a = events[i];
        const b = events[j];
        if (a.day === b.day) {
          const aEnd = a.startHour + a.durationHours;
          const bEnd = b.startHour + b.durationHours;
          if (Math.max(a.startHour, b.startHour) < Math.min(aEnd, bEnd)) {
            list.push(`Overlap on ${a.day}: "${a.title}" and "${b.title}" overlap at ${Math.max(a.startHour, b.startHour)}:00 IST!`);
          }
        }
      }
    }
    return list;
  }, [events]);

  const updateEventHour = (id: string, newStart: number) => {
    setEvents(prev => prev.map(ev => ev.id === id ? { ...ev, startHour: newStart } : ev));
    onDirty();
  };

  const updateEmailQuadrant = (id: string, q: InboxEmail['quadrant']) => {
    setEmails(prev => prev.map(m => m.id === id ? { ...m, quadrant: q } : m));
    onDirty();
  };

  const selectedTravel = useMemo(() => {
    return TRAVEL_OPTIONS.find(t => t.id === selectedTravelId) || TRAVEL_OPTIONS[0];
  }, [selectedTravelId]);

  const handleSubmit = () => {
    onSubmit({
      variant,
      events,
      emails,
      selectedTravelId,
      conflictsCount: conflicts.length,
      zeroConflicts: conflicts.length === 0,
      travelPolicyCompliant: selectedTravel.policyCompliant && !selectedTravel.fatigueRisk,
      handoverMemo
    });
  };

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* ===================================================================== */}
      {/* NAVIGATION TABS: Calendar / Inbox / Travel / Handover                 */}
      {/* ===================================================================== */}
      <div className="p-3 rounded-2xl bg-[#0f1325] border border-white/10 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'calendar' ? 'bg-purple-600 text-white shadow-md' : 'bg-white/5 text-slate-300 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Multi-Timezone Calendar</span>
          </button>

          <button
            onClick={() => setActiveTab('inbox')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'inbox' ? 'bg-purple-600 text-white shadow-md' : 'bg-white/5 text-slate-300 hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Inbox Triage</span>
          </button>

          <button
            onClick={() => setActiveTab('travel')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'travel' ? 'bg-purple-600 text-white shadow-md' : 'bg-white/5 text-slate-300 hover:text-white'
            }`}
          >
            <Plane className="w-3.5 h-3.5" />
            <span>Travel Compliance</span>
          </button>

          <button
            onClick={() => setActiveTab('handover')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'handover' ? 'bg-purple-600 text-white shadow-md' : 'bg-white/5 text-slate-300 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Shift Handover Memo</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-xl text-[11px] font-bold ${conflicts.length === 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300 animate-pulse'}`}>
            {conflicts.length === 0 ? '✓ 0 Calendar Conflicts' : `${conflicts.length} Overlapping Conflict`}
          </span>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 1. MULTI-TIMEZONE CALENDAR CANVAS                                     */}
      {/* ===================================================================== */}
      {activeTab === 'calendar' && (
        <div className="space-y-3">
          {conflicts.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>Scheduling Collision Detected!</span>
              </div>
              <ul className="list-disc pl-5 text-[11px]">
                {conflicts.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Timezone Grid Header */}
          <div className="grid grid-cols-4 gap-2 p-2.5 rounded-xl bg-black/40 border border-white/5 text-center font-mono text-[11px]">
            <div><span className="text-purple-300 font-bold">IST</span> (UTC+5:30) - Mumbai</div>
            <div><span className="text-cyan-300 font-bold">GMT</span> (UTC+0) - London</div>
            <div><span className="text-amber-300 font-bold">EST</span> (UTC-5) - New York</div>
            <div><span className="text-emerald-300 font-bold">JST</span> (UTC+9) - Tokyo</div>
          </div>

          {/* Calendar Events List with Reschedule Controls */}
          <div className="space-y-2">
            {events.map((ev) => {
              const istHour = ev.startHour;
              const gmtHour = (istHour - 5.5 + 24) % 24;
              const estHour = (istHour - 10.5 + 24) % 24;
              const jstHour = (istHour + 3.5) % 24;

              return (
                <div
                  key={ev.id}
                  className="p-4 rounded-2xl bg-[#0f1325] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg hover:border-purple-500/40 transition-colors"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{ev.title}</span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        ev.priority === 'mandatory_client' ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/20 text-blue-300'
                      }`}>
                        {ev.priority === 'mandatory_client' ? 'Mandatory Client' : 'Internal Sync'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-400">
                      <span>Day: <strong className="text-slate-200">{ev.day}</strong></span>
                      <span>IST: <strong className="text-purple-300">{istHour}:00 - {istHour + ev.durationHours}:00</strong></span>
                      <span>GMT: <strong>{Math.floor(gmtHour)}:30</strong></span>
                      <span>EST: <strong>{Math.floor(estHour)}:30</strong></span>
                      <span>Attendees: {ev.attendees.join(', ')}</span>
                    </div>
                  </div>

                  {/* Direct Reschedule Control */}
                  <div className="flex items-center gap-2 shrink-0">
                    <label className="text-[10px] text-slate-400 font-semibold">Reschedule Start:</label>
                    <select
                      value={ev.startHour}
                      onChange={(e) => updateEventHour(ev.id, parseInt(e.target.value, 10))}
                      disabled={ev.priority === 'mandatory_client'}
                      className="bg-black/40 border border-white/10 rounded-xl px-2.5 py-1 text-white font-mono text-xs disabled:opacity-50"
                    >
                      <option value="11">11:00 AM IST (Open Slot)</option>
                      <option value="14">02:00 PM IST</option>
                      <option value="15">03:00 PM IST (Conflict)</option>
                      <option value="16">04:00 PM IST</option>
                      <option value="17">05:00 PM IST</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. INBOX TRIAGE (EISENHOWER MATRIX)                                   */}
      {/* ===================================================================== */}
      {activeTab === 'inbox' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {emails.map((m) => (
              <div key={m.id} className="p-4 rounded-2xl bg-[#0f1325] border border-white/10 space-y-2.5 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">{m.subject}</span>
                  <span className="text-[10px] text-purple-300 font-mono">{m.sender}</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">{m.preview}</p>

                <div className="flex items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 font-semibold">Triage Action:</span>
                  {(['do_first', 'schedule', 'delegate', 'archive'] as InboxEmail['quadrant'][]).map((q) => (
                    <button
                      key={q}
                      onClick={() => updateEmailQuadrant(m.id, q)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold capitalize transition-all ${
                        m.quadrant === q
                          ? 'bg-purple-600 text-white'
                          : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
                      }`}
                    >
                      {q?.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. TRAVEL POLICY COMPLIANCE                                           */}
      {/* ===================================================================== */}
      {activeTab === 'travel' && (
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs">
            Corporate Travel Rule: Direct flights preferred. Arrival must be at least 3 hours before keynote to prevent fatigue.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {TRAVEL_OPTIONS.map((tr) => {
              const isSelected = selectedTravelId === tr.id;
              return (
                <div
                  key={tr.id}
                  onClick={() => { setSelectedTravelId(tr.id); onDirty(); }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                    isSelected
                      ? 'bg-[#121630] border-purple-500 ring-2 ring-purple-500/40 shadow-xl'
                      : 'bg-[#0f1325] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{tr.airline}</span>
                    <span className="font-mono text-purple-300 font-bold">₹{tr.priceINR.toLocaleString()}</span>
                  </div>

                  <div className="text-[11px] text-slate-300 space-y-1">
                    <div>Departure: <strong>{tr.departureIST}</strong></div>
                    <div>Arrival: <strong>{tr.arrivalSGT}</strong> (Duration: {tr.duration})</div>
                  </div>

                  <div className="pt-1 flex items-center justify-between">
                    <span className={`text-[10px] font-bold ${tr.fatigueRisk ? 'text-red-400' : 'text-emerald-400'}`}>
                      {tr.fatigueRisk ? '⚠ Severe Fatigue Risk (Arrives 4 AM)' : '✓ Compliant: 3h Buffer Window'}
                    </span>
                    <input type="radio" checked={isSelected} readOnly className="accent-purple-600" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 4. SHIFT HANDOVER MEMO EDITOR                                         */}
      {/* ===================================================================== */}
      {activeTab === 'handover' && (
        <div className="p-4 rounded-2xl bg-[#0f1325] border border-white/10 space-y-3 shadow-xl">
          <span className="font-bold text-white text-xs block">Executive Handover Memo</span>
          <textarea
            rows={5}
            value={handoverMemo}
            onChange={(e) => { setHandoverMemo(e.target.value); onDirty(); }}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 font-sans text-xs text-slate-200 focus:outline-none focus:border-purple-500/50"
            placeholder="Document all rescheduled calendar events, triaged regulatory items, and confirmed travel bookings..."
          />
        </div>
      )}

      {/* ===================================================================== */}
      {/* SUBMISSION BAR                                                        */}
      {/* ===================================================================== */}
      <div className="p-4 rounded-2xl bg-[#0f1325] border border-white/10 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span>Calendar: <strong className={conflicts.length === 0 ? 'text-emerald-400' : 'text-red-400'}>{conflicts.length === 0 ? 'Clean (0 Overlaps)' : 'Conflicts Present'}</strong></span>
          <span>•</span>
          <span>Flight: <strong className={selectedTravel.policyCompliant ? 'text-emerald-400' : 'text-red-400'}>{selectedTravel.policyCompliant ? 'Policy Compliant' : 'Non-compliant'}</strong></span>
        </div>

        <button
          onClick={handleSubmit}
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
        >
          <span>Submit Executive Desk Schedule &amp; Triage</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
