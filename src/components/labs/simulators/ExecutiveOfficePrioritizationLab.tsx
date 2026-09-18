'use client';

import React, { useState } from 'react';
import { LabScenarioVariant, LabDifficulty } from '@/lib/labs/types';
import { 
  Inbox, 
  Calendar, 
  Clock, 
  Plane, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Send,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building
} from 'lucide-react';

interface SimulatorProps {
  scenario?: LabScenarioVariant;
  variant: LabDifficulty;
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

export default function ExecutiveOfficePrioritizationLab({
  scenario,
  variant,
  onDirty,
  onSubmit
}: SimulatorProps) {
  // Calendar reschedule state
  const [clientPitchSlot, setClientPitchSlot] = useState<'wednesday_15' | 'thursday_11'>('wednesday_15');

  // Eisenhower Matrix triage state for 6 inbox items
  const [triagedInbox, setTriagedInbox] = useState<Record<string, string>>({
    mail_1: 'urgent_important', // Board Audit Signoff
    mail_2: 'urgent_important', // Client Pitch
    mail_3: 'important_not_urgent', // Headcount Strategy
    mail_4: 'urgent_not_important', // 2FA Token Expiry
    mail_5: 'delegate_archive', // Coffee Bean Vendor
    mail_6: 'urgent_important' // Singapore Travel Review
  });

  // Travel flight choice
  const [selectedTravelId, setSelectedTravelId] = useState<'opt_a' | 'opt_b'>('opt_b');

  // Executive handover memo
  const [handoverMemo, setHandoverMemo] = useState(
    'Shift Handover Briefing:\n1. Rescheduled Apex Corp Pitch to Thursday 11:00 AM IST to resolve Board Audit overlap.\n2. Booked direct SQ503 flight for Singapore summit avoiding 4 AM fatigue.\n3. Prompted MD for immediate 2FA hardware token verification.\n4. Delegated vendor coffee catalogue.'
  );

  const isConflictResolved = clientPitchSlot === 'thursday_11';
  const isTravelPolicyCompliant = selectedTravelId === 'opt_b';

  const handleSubmit = () => {
    onSubmit({
      clientPitchSlot,
      triagedInbox,
      selectedTravelId,
      handoverMemo
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Status & Conflict Alert */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        
        <div className={`p-4 rounded-2xl border transition-all ${
          isConflictResolved ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-red-950/30 border-red-500/40 animate-pulse'
        }`}>
          <div className="flex items-center gap-2 mb-1">
            {isConflictResolved ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-400" />
            )}
            <span className="text-xs font-bold text-white">Calendar Overlap Conflict</span>
          </div>
          <p className="text-[11px] text-slate-300">
            {isConflictResolved 
              ? 'Conflict resolved! Pitch moved to Thursday 11 AM.' 
              : 'CRITICAL: Wednesday 15:00 IST double-booked (Board Audit vs Apex Deal Pitch).'}
          </p>
        </div>

        <div className={`p-4 rounded-2xl border transition-all ${
          isTravelPolicyCompliant ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-amber-950/30 border-amber-500/40'
        }`}>
          <div className="flex items-center gap-2 mb-1">
            <Plane className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white">Travel Policy Window</span>
          </div>
          <p className="text-[11px] text-slate-300">
            {isTravelPolicyCompliant 
              ? 'Option B selected: Direct flight, 06:20 AM arrival.' 
              : 'Warning: Option A lands at 04:15 AM causing keynote fatigue.'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <Inbox className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold text-white">Inbox Triage Status</span>
          </div>
          <p className="text-[11px] text-slate-300">
            6 of 6 communications mapped to Eisenhower quadrants.
          </p>
        </div>

      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Cols: Calendar Conflict Resolver & Travel Selector */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Calendar Management */}
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span>1. Executive Calendar Schedule Triage</span>
              </h2>
              <span className="text-xs font-mono text-purple-300">Timezone: IST (UTC+5:30)</span>
            </div>

            <div className="space-y-3">
              {/* Event 1 */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 text-[10px] font-bold uppercase">Mandatory Internal</span>
                    <span className="text-xs font-bold text-white">Board Audit Committee Formal Review</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Wed 15:00 - 16:00 IST • Attendees: Board Chair, MD, Legal Counsel (Cannot be moved)
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-slate-400">LOCKED</span>
              </div>

              {/* Event 2 (The Conflicted One) */}
              <div className={`p-3.5 rounded-2xl border transition-all ${
                clientPitchSlot === 'wednesday_15' ? 'bg-red-950/20 border-red-500/40' : 'bg-emerald-950/20 border-emerald-500/40'
              }`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase">Client Deal Pitch</span>
                      <span className="text-xs font-bold text-white">Apex Corp Enterprise Deal ($450k ARR)</span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1">
                      Current Slot: {clientPitchSlot === 'wednesday_15' ? 'Wed 15:00 (CONFLICT WITH BOARD!)' : 'Thursday 11:00 AM (Clean slot)'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setClientPitchSlot(clientPitchSlot === 'wednesday_15' ? 'thursday_11' : 'wednesday_15');
                      onDirty();
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      clientPitchSlot === 'thursday_11'
                        ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                        : 'bg-purple-600 hover:bg-purple-500 text-white shadow-glow-btn'
                    }`}
                  >
                    {clientPitchSlot === 'thursday_11' ? 'Rescheduled to Thu 11 AM' : 'Reschedule to Thu 11 AM'}
                  </button>
                </div>
              </div>

              {/* Event 3 (Available slot) */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-dashed border-white/15">
                <span className="text-xs font-semibold text-slate-300">Thursday 11:00 - 12:00 IST</span>
                <p className="text-[10px] text-slate-400">
                  {clientPitchSlot === 'thursday_11' ? 'Booked: Apex Corp Client Closing Pitch' : 'Open Executive Working Slot (Recommended for rescheduled pitch)'}
                </p>
              </div>
            </div>
          </div>

          {/* Travel Option Selection */}
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-4">
            <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Plane className="w-4 h-4 text-cyan-400" />
              <span>2. Singapore Summit Flight Selection</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Option A */}
              <div 
                onClick={() => { setSelectedTravelId('opt_a'); onDirty(); }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedTravelId === 'opt_a'
                    ? 'bg-purple-600/10 border-purple-500/50 shadow-glow-card'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-white">Option A: Connecting Air</span>
                  <span className="text-xs font-mono text-slate-400">₹32,000</span>
                </div>
                <p className="text-[11px] text-slate-300">Dep: 22:30 IST &rarr; Arr: 04:15 SGT (Overnight)</p>
                <span className="text-[10px] text-amber-400 block mt-2 font-semibold">
                  ⚠️ Lands at 4:15 AM (fatigue before 9 AM keynote)
                </span>
              </div>

              {/* Option B */}
              <div 
                onClick={() => { setSelectedTravelId('opt_b'); onDirty(); }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedTravelId === 'opt_b'
                    ? 'bg-purple-600/10 border-purple-500/50 shadow-glow-card'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-emerald-300">Option B: Singapore Airlines Direct</span>
                  <span className="text-xs font-mono text-emerald-400 font-bold">₹48,000</span>
                </div>
                <p className="text-[11px] text-slate-300">Dep: 23:10 IST &rarr; Arr: 06:20 SGT (Morning)</p>
                <span className="text-[10px] text-emerald-400 block mt-2 font-semibold">
                  ✓ Compliant: 3-hour refresh before morning keynote
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* Right 5 Cols: Eisenhower Triage & Handover Memo */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Eisenhower Triage */}
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-4">
            <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Inbox className="w-4 h-4 text-indigo-400" />
              <span>3. Eisenhower Inbox Priority</span>
            </h2>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 text-xs">
              {[
                { id: 'mail_1', sender: 'Board Chair', subject: 'URGENT: Audit Draft Review' },
                { id: 'mail_2', sender: 'VP Sales', subject: 'Apex Corp Deal Closing Pitch' },
                { id: 'mail_3', sender: 'HR Director', subject: 'Headcount Strategy 2027 Memo' },
                { id: 'mail_4', sender: 'IT Desk Admin', subject: '2FA Token 4-Hour Expiry Lockout' },
                { id: 'mail_5', sender: 'Vendor', subject: 'Cafeteria Coffee Bean Catalogue' },
                { id: 'mail_6', sender: 'Travel Desk', subject: 'Singapore Summit Flights' },
              ].map(mail => (
                <div key={mail.id} className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="font-bold text-white block truncate">{mail.subject}</span>
                    <span className="text-[10px] text-slate-400">{mail.sender}</span>
                  </div>
                  <select
                    value={triagedInbox[mail.id] || 'urgent_important'}
                    onChange={(e) => {
                      setTriagedInbox(prev => ({ ...prev, [mail.id]: e.target.value }));
                      onDirty();
                    }}
                    className="text-[10px] font-bold p-1 rounded-lg bg-black/40 border border-white/15 text-slate-300 focus:outline-none focus:border-purple-500"
                  >
                    <option value="urgent_important">1. Urgent &amp; Important</option>
                    <option value="important_not_urgent">2. Important / Schedule</option>
                    <option value="urgent_not_important">3. Urgent / Quick Fix</option>
                    <option value="delegate_archive">4. Delegate / Archive</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Shift Handover Memo */}
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-2">
            <label htmlFor="handover-memo" className="text-xs font-extrabold text-white flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-purple-400" />
              <span>4. Executive Shift Handover Briefing</span>
            </label>
            <textarea
              id="handover-memo"
              rows={4}
              value={handoverMemo}
              onChange={(e) => {
                setHandoverMemo(e.target.value);
                onDirty();
              }}
              className="w-full text-xs p-3 rounded-xl bg-black/30 border border-white/15 text-slate-200 focus:outline-none focus:border-purple-500/50"
            />
          </div>

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-glow-btn transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Submit Handover &amp; Evaluate Lab</span>
          </button>

        </div>

      </div>

    </div>
  );
}
