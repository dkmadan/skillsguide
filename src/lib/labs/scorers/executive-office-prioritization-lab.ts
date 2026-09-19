import { ScoringCriterionResult, LabSubmissionResult } from '../types';

// =========================================================================
// LAB 29 EVALUATOR: Executive Office Prioritization Lab
// =========================================================================
// NOTE (fixed pre-existing bug): the previous version of this scorer read
// `answers.resolvedConflicts` (an array) and `answers.selectedTravelOption`,
// but the component has never sent those field names — it sends
// `selectedSlotId`/`conflictResolved` and `selectedTravelId`. The conflict
// check also never actually detected an overlap; it just trusted a client
// boolean. This version recomputes overlap detection, triage accuracy and
// travel/approval compliance server-side from a fixture mirror keyed by
// variant, so scoring reflects what the learner actually decided.
type Tier = 'urgent_important' | 'important_not_urgent' | 'urgent_not_important' | 'delegate_archive';
type EventType = 'mandatory_internal' | 'mandatory_client';

interface CalendarEventMeta { id: string; type: EventType; startUtc: string; endUtc: string; movable: boolean; }
interface CandidateSlotMeta { id: string; startUtc: string; endUtc: string; }
interface InboxItemMeta { id: string; correctTier: Tier; }
interface TravelOptionMeta { id: string; arriveUtc: string; price: number; }
interface TaskMeta { id: string; deadlineUtc: string; approvalRequired: boolean; tieBreakPriority?: number; }
interface Fixture {
  events: CalendarEventMeta[];
  movableEventId: string;
  candidateSlots: CandidateSlotMeta[];
  inbox: InboxItemMeta[];
  travelOptions: TravelOptionMeta[];
  approvalThreshold: number;
  destinationOffsetHours: number;
  recommendedTravelId: string;
  tasks: TaskMeta[];
}

const FIXTURES: Record<string, Fixture> = {
  beginner: {
    events: [
      { id: 'ev_board', type: 'mandatory_internal', startUtc: '2026-09-23T09:30:00Z', endUtc: '2026-09-23T10:30:00Z', movable: false },
      { id: 'ev_pitch', type: 'mandatory_client', startUtc: '2026-09-23T09:30:00Z', endUtc: '2026-09-23T10:30:00Z', movable: true },
    ],
    movableEventId: 'ev_pitch',
    candidateSlots: [
      { id: 'slot_same', startUtc: '2026-09-23T09:30:00Z', endUtc: '2026-09-23T10:30:00Z' },
      { id: 'slot_thu11', startUtc: '2026-09-24T05:30:00Z', endUtc: '2026-09-24T06:30:00Z' },
    ],
    inbox: [
      { id: 'mail_1', correctTier: 'urgent_important' }, { id: 'mail_2', correctTier: 'urgent_important' },
      { id: 'mail_3', correctTier: 'important_not_urgent' }, { id: 'mail_4', correctTier: 'urgent_not_important' },
      { id: 'mail_5', correctTier: 'delegate_archive' }, { id: 'mail_6', correctTier: 'urgent_important' },
    ],
    travelOptions: [
      { id: 'opt_a', arriveUtc: '2026-09-29T20:15:00Z', price: 32000 },
      { id: 'opt_b', arriveUtc: '2026-09-29T22:20:00Z', price: 48000 },
    ],
    approvalThreshold: 40000,
    destinationOffsetHours: 8,
    recommendedTravelId: 'opt_b',
    tasks: [
      { id: 'task_audit', deadlineUtc: '2026-09-23T09:00:00Z', approvalRequired: false, tieBreakPriority: 1 },
      { id: 'task_redlines', deadlineUtc: '2026-09-23T09:00:00Z', approvalRequired: false, tieBreakPriority: 2 },
      { id: 'task_2fa', deadlineUtc: '2026-09-18T12:00:00Z', approvalRequired: false },
      { id: 'task_vendor', deadlineUtc: '2026-10-05T00:00:00Z', approvalRequired: false },
      { id: 'task_travel', deadlineUtc: '2026-09-25T00:00:00Z', approvalRequired: true },
    ],
  },
  intermediate: {
    events: [
      { id: 'ev_board', type: 'mandatory_internal', startUtc: '2026-09-23T09:30:00Z', endUtc: '2026-09-23T10:30:00Z', movable: false },
      { id: 'ev_pitch', type: 'mandatory_client', startUtc: '2026-09-23T09:30:00Z', endUtc: '2026-09-23T10:30:00Z', movable: true },
      { id: 'ev_cfo', type: 'mandatory_internal', startUtc: '2026-09-24T05:30:00Z', endUtc: '2026-09-24T06:00:00Z', movable: false },
    ],
    movableEventId: 'ev_pitch',
    candidateSlots: [
      { id: 'slot_same', startUtc: '2026-09-23T09:30:00Z', endUtc: '2026-09-23T10:30:00Z' },
      { id: 'slot_thu11', startUtc: '2026-09-24T05:30:00Z', endUtc: '2026-09-24T06:30:00Z' },
      { id: 'slot_thu14', startUtc: '2026-09-24T08:30:00Z', endUtc: '2026-09-24T09:30:00Z' },
    ],
    inbox: [
      { id: 'mail_1', correctTier: 'urgent_important' }, { id: 'mail_2', correctTier: 'urgent_important' },
      { id: 'mail_3', correctTier: 'important_not_urgent' }, { id: 'mail_4', correctTier: 'urgent_not_important' },
      { id: 'mail_5', correctTier: 'delegate_archive' }, { id: 'mail_6', correctTier: 'urgent_important' },
      { id: 'mail_7', correctTier: 'important_not_urgent' },
    ],
    travelOptions: [
      { id: 'opt_a', arriveUtc: '2026-09-29T20:15:00Z', price: 34000 },
      { id: 'opt_b', arriveUtc: '2026-09-29T22:20:00Z', price: 52000 },
    ],
    approvalThreshold: 45000,
    destinationOffsetHours: 8,
    recommendedTravelId: 'opt_b',
    tasks: [
      { id: 'task_audit', deadlineUtc: '2026-09-23T09:00:00Z', approvalRequired: false, tieBreakPriority: 1 },
      { id: 'task_redlines', deadlineUtc: '2026-09-23T09:00:00Z', approvalRequired: false, tieBreakPriority: 2 },
      { id: 'task_2fa', deadlineUtc: '2026-09-18T12:00:00Z', approvalRequired: false },
      { id: 'task_vendor', deadlineUtc: '2026-10-05T00:00:00Z', approvalRequired: false },
      { id: 'task_travel', deadlineUtc: '2026-09-25T00:00:00Z', approvalRequired: true },
      { id: 'task_budget', deadlineUtc: '2026-09-26T00:00:00Z', approvalRequired: false },
    ],
  },
  challenge: {
    events: [
      { id: 'ev_board', type: 'mandatory_internal', startUtc: '2026-09-23T09:30:00Z', endUtc: '2026-09-23T10:30:00Z', movable: false },
      { id: 'ev_pitch', type: 'mandatory_client', startUtc: '2026-09-23T09:30:00Z', endUtc: '2026-09-23T10:30:00Z', movable: true },
      { id: 'ev_cfo', type: 'mandatory_internal', startUtc: '2026-09-24T05:30:00Z', endUtc: '2026-09-24T06:00:00Z', movable: false },
      { id: 'ev_travel_call', type: 'mandatory_internal', startUtc: '2026-09-24T08:30:00Z', endUtc: '2026-09-24T09:00:00Z', movable: false },
    ],
    movableEventId: 'ev_pitch',
    candidateSlots: [
      { id: 'slot_same', startUtc: '2026-09-23T09:30:00Z', endUtc: '2026-09-23T10:30:00Z' },
      { id: 'slot_thu11', startUtc: '2026-09-24T05:30:00Z', endUtc: '2026-09-24T06:30:00Z' },
      { id: 'slot_thu14', startUtc: '2026-09-24T08:30:00Z', endUtc: '2026-09-24T09:30:00Z' },
      { id: 'slot_thu16', startUtc: '2026-09-24T10:30:00Z', endUtc: '2026-09-24T11:30:00Z' },
    ],
    inbox: [
      { id: 'mail_1', correctTier: 'urgent_important' }, { id: 'mail_2', correctTier: 'urgent_important' },
      { id: 'mail_3', correctTier: 'important_not_urgent' }, { id: 'mail_4', correctTier: 'urgent_not_important' },
      { id: 'mail_5', correctTier: 'delegate_archive' }, { id: 'mail_6', correctTier: 'urgent_important' },
      { id: 'mail_7', correctTier: 'important_not_urgent' }, { id: 'mail_8', correctTier: 'delegate_archive' },
    ],
    travelOptions: [
      { id: 'opt_a', arriveUtc: '2026-09-29T20:15:00Z', price: 36000 },
      { id: 'opt_b', arriveUtc: '2026-09-29T22:20:00Z', price: 58000 },
    ],
    approvalThreshold: 50000,
    destinationOffsetHours: 8,
    recommendedTravelId: 'opt_b',
    tasks: [
      { id: 'task_audit', deadlineUtc: '2026-09-23T09:00:00Z', approvalRequired: false, tieBreakPriority: 1 },
      { id: 'task_redlines', deadlineUtc: '2026-09-23T09:00:00Z', approvalRequired: false, tieBreakPriority: 2 },
      { id: 'task_2fa', deadlineUtc: '2026-09-18T12:00:00Z', approvalRequired: false, tieBreakPriority: 1 },
      { id: 'task_legal', deadlineUtc: '2026-09-18T12:00:00Z', approvalRequired: false, tieBreakPriority: 2 },
      { id: 'task_vendor', deadlineUtc: '2026-10-05T00:00:00Z', approvalRequired: false },
      { id: 'task_travel', deadlineUtc: '2026-09-25T00:00:00Z', approvalRequired: true },
      { id: 'task_budget', deadlineUtc: '2026-09-26T00:00:00Z', approvalRequired: false },
    ],
  },
};

function overlaps(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return new Date(aStart).getTime() < new Date(bEnd).getTime() && new Date(bStart).getTime() < new Date(aEnd).getTime();
}

function localHourFromUtc(utcIso: string, offsetHours: number): number {
  const d = new Date(utcIso);
  return ((d.getUTCHours() + d.getUTCMinutes() / 60 + offsetHours) % 24 + 24) % 24;
}

export function evaluateExecutiveOfficeLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const variantKey = typeof answers.variant === 'string' && FIXTURES[answers.variant] ? (answers.variant as string) : 'beginner';
  const fixture = FIXTURES[variantKey];

  const selectedSlotId = String(answers.selectedSlotId || '');
  const triagedInbox = (answers.triagedInbox as Record<string, string>) || {};
  const selectedTravelId = String(answers.selectedTravelId || '');
  const travelApprovalConfirmed = Boolean(answers.travelApprovalConfirmed);
  const taskApprovals = (answers.taskApprovals as Record<string, boolean>) || {};
  const taskOrder = Array.isArray(answers.taskOrder) ? (answers.taskOrder as string[]) : [];
  const handoverMemo = String(answers.handoverMemo || '').trim();
  const rescheduleNoticeDraft = String(answers.rescheduleNoticeDraft || '').trim();
  const draftPrepared = Boolean(answers.draftPrepared);

  const criteria: ScoringCriterionResult[] = [];
  const hints: string[] = [];

  // Recompute conflict resolution server-side: look up the CHOSEN slot's
  // authoritative time from the fixture (never trust client-submitted
  // times), substitute it for the movable event, then run generic interval
  // overlap detection against every other mandatory event in the fixture.
  const chosenSlot = fixture.candidateSlots.find((s) => s.id === selectedSlotId);
  const effectiveEvents = fixture.events.map((ev) => (ev.id === fixture.movableEventId && chosenSlot ? { ...ev, startUtc: chosenSlot.startUtc, endUtc: chosenSlot.endUtc } : ev));
  const mandatory = effectiveEvents.filter((e) => e.type === 'mandatory_internal' || e.type === 'mandatory_client');
  let hasOverlap = false;
  for (let i = 0; i < mandatory.length && !hasOverlap; i++) {
    for (let j = i + 1; j < mandatory.length && !hasOverlap; j++) {
      if (overlaps(mandatory[i].startUtc, mandatory[i].endUtc, mandatory[j].startUtc, mandatory[j].endUtc)) hasOverlap = true;
    }
  }
  const conflictResolved = Boolean(chosenSlot) && !hasOverlap;
  criteria.push({
    id: 'eop-c1',
    name: 'Calendar Meeting Conflict Resolution',
    category: 'correctness',
    earned: conflictResolved ? 25 : 0,
    max: 25,
    passed: conflictResolved,
    feedback: conflictResolved
      ? 'The rescheduled slot creates no overlap with any other mandatory commitment.'
      : 'The chosen slot still overlaps another mandatory commitment — recheck every existing meeting, not just the original conflict.'
  });
  if (!conflictResolved) hints.push('Check the candidate slot against every mandatory event on the calendar, not only the one it was originally trying to avoid.');

  let correctTriageCount = 0;
  fixture.inbox.forEach((item) => { if (triagedInbox[item.id] === item.correctTier) correctTriageCount += 1; });
  const triageFraction = correctTriageCount / fixture.inbox.length;
  criteria.push({
    id: 'eop-c2',
    name: 'Eisenhower Matrix Inbox Classification',
    category: 'correctness',
    earned: Math.round(triageFraction * 25),
    max: 25,
    passed: triageFraction >= 0.75,
    feedback: `Accurately classified ${correctTriageCount} of ${fixture.inbox.length} communications into the correct urgency/importance quadrant.`
  });

  // NOTE: checking only that tied tasks land at *distinct* array indices is
  // not a real test — `taskOrder` starts as a permutation of unique ids, so
  // every index is trivially distinct with zero learner effort. The genuine
  // check is whether the learner actually ranked the task with less real
  // slack (lower authored `tieBreakPriority`) ahead of its tied peer.
  const tieBreakGroups = Object.values(
    fixture.tasks.reduce<Record<string, TaskMeta[]>>((acc, t) => { (acc[t.deadlineUtc] ||= []).push(t); return acc; }, {})
  ).filter((g) => g.length > 1);
  const tieBreaksResolved = tieBreakGroups.every((group) => {
    const ranked = group.filter((t) => t.tieBreakPriority !== undefined);
    if (ranked.length < 2) return true;
    for (let i = 0; i < ranked.length; i++) {
      for (let j = i + 1; j < ranked.length; j++) {
        const a = ranked[i];
        const b = ranked[j];
        const aIdx = taskOrder.indexOf(a.id);
        const bIdx = taskOrder.indexOf(b.id);
        if (aIdx < 0 || bIdx < 0) return false;
        const higherPriorityFirst = a.tieBreakPriority! < b.tieBreakPriority! ? aIdx < bIdx : bIdx < aIdx;
        if (!higherPriorityFirst) return false;
      }
    }
    return true;
  });
  criteria.push({
    id: 'eop-c3',
    name: 'Same-Deadline Task Prioritization',
    category: 'correctness',
    earned: tieBreaksResolved ? 10 : 0,
    max: 10,
    passed: tieBreaksResolved,
    feedback: tieBreaksResolved
      ? 'Tasks sharing an identical deadline were ranked with the genuinely less flexible task first.'
      : 'Two or more tasks share a deadline but were not ranked with the less flexible task ahead of the other.'
  });
  if (!tieBreaksResolved) hints.push('When two tasks share a deadline, rank the one with less real slack (irreversible consequence, no grace window) ahead of the other.');

  const travelWithRisk = fixture.travelOptions.map((opt) => ({ ...opt, fatigueRisk: localHourFromUtc(opt.arriveUtc, fixture.destinationOffsetHours) < 6, needsApproval: opt.price > fixture.approvalThreshold }));
  const chosenTravel = travelWithRisk.find((t) => t.id === selectedTravelId);
  const travelCorrect = selectedTravelId === fixture.recommendedTravelId;
  const approvalOk = !chosenTravel?.needsApproval || travelApprovalConfirmed;
  const allTaskApprovalsOk = fixture.tasks.filter((t) => t.approvalRequired).every((t) => taskApprovals[t.id]);
  const travelConstraintOk = travelCorrect && approvalOk && allTaskApprovalsOk;
  criteria.push({
    id: 'eop-c4',
    name: 'Travel Fatigue Policy & Approval Compliance',
    category: 'constraints',
    earned: travelConstraintOk ? 15 : travelCorrect ? 8 : 0,
    max: 15,
    passed: travelConstraintOk,
    feedback: travelConstraintOk
      ? 'Selected the fatigue-compliant flight and confirmed every required approval.'
      : !travelCorrect
        ? `Selected flight arrives at a fatigue-risk local hour instead of the compliant option.`
        : 'Flight choice was correct but a required approval (travel and/or task) was never confirmed.'
  });
  if (!travelConstraintOk) hints.push('Recompute the destination-local arrival hour for each flight, and confirm approval for anything priced above the disclosed threshold.');

  const evidenceOk = handoverMemo.length >= 30 && rescheduleNoticeDraft.length >= 15;
  criteria.push({
    id: 'eop-c5',
    name: 'Draft Prepared, Never Sent',
    category: 'constraints',
    earned: evidenceOk && draftPrepared ? 10 : evidenceOk || draftPrepared ? 5 : 0,
    max: 10,
    passed: evidenceOk && draftPrepared,
    feedback: evidenceOk && draftPrepared
      ? 'Handover and client notice were both drafted with substance and explicitly marked prepared — never sent.'
      : 'Draft messages are too brief and/or were never marked prepared.'
  });

  criteria.push({
    id: 'eop-c6',
    name: 'Executive Handover & Unsent Messages Completeness',
    category: 'evidence',
    earned: evidenceOk ? 15 : handoverMemo.length >= 20 || rescheduleNoticeDraft.length >= 10 ? 8 : 3,
    max: 15,
    passed: evidenceOk,
    feedback: evidenceOk ? 'Comprehensive handover memo and client notice saved as evidence for the incoming shift.' : 'Handover memo or client notice is too brief or missing key action items.'
  });

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);

  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'executive-office-prioritization-lab',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: hints,
    submittedAt: new Date().toISOString()
  };
}
