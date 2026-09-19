import { ScoringCriterionResult, LabSubmissionResult } from '../types';

// =========================================================================
// LAB 21: B2B Discovery Conversation Lab
// =========================================================================

interface LeadAnswer {
  id: string; fitAssessment: string; idealFit: string; checkedNeeds: string[]; trueNeeds: string[];
  objectionChoice: string; respectfulOptionId?: string;
}

export function evaluateB2bDiscoveryLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const leads = (answers.leads as LeadAnswer[]) || [];
  const discoveryNotes = String(answers.discoveryNotes || '').trim();
  const followupDraft = String(answers.followupDraft || '').trim();
  const followupSent = Boolean(answers.followupSent);

  const fitMatches = leads.filter((l) => l.fitAssessment && l.fitAssessment === l.idealFit).length;
  const respectfulChoices = leads.filter((l) => l.objectionChoice && l.objectionChoice === l.respectfulOptionId).length;
  const totalLeads = leads.length || 3;

  // Needs-checklist accuracy recomputed directly from the raw checked/true need
  // arrays each lead sent, rather than trusting a pre-scored boolean.
  const needsAccuracy = leads.length > 0
    ? leads.reduce((sum, l) => {
      const checked = new Set(l.checkedNeeds || []);
      const truth = new Set(l.trueNeeds || []);
      const union = new Set([...checked, ...truth]);
      if (union.size === 0) return sum + 1;
      let intersect = 0;
      union.forEach((n) => { if (checked.has(n) && truth.has(n)) intersect++; });
      return sum + intersect / union.size;
    }, 0) / leads.length
    : 0;

  const fitScore = Math.round((fitMatches / totalLeads) * 40);
  const objectionScore = Math.round((respectfulChoices / totalLeads) * 20);

  const criteria: ScoringCriterionResult[] = [
    {
      id: 'b2b-c1',
      name: 'Lead Qualification Accuracy & Respectful Objection Handling',
      category: 'correctness',
      earned: fitScore + objectionScore,
      max: 60,
      passed: fitMatches === totalLeads && respectfulChoices === totalLeads,
      feedback: `${fitMatches}/${totalLeads} leads correctly classified (including disqualifying the low-fit lead when warranted); ${respectfulChoices}/${totalLeads} objections handled with a respectful, policy-compliant response.`
    },
    {
      id: 'b2b-c2',
      name: 'Stated Needs Checklist Accuracy',
      category: 'constraints',
      earned: Math.round(needsAccuracy * 25),
      max: 25,
      passed: needsAccuracy >= 0.8,
      feedback: needsAccuracy >= 0.8 ? 'Needs checklist closely matches the needs actually stated in each conversation.' : 'Needs checklist diverges from what each lead actually stated — revisit the revealed dialogue responses.'
    },
    {
      id: 'b2b-c3',
      name: 'Discovery Notes & Inert Follow-Up Composer',
      category: 'evidence',
      earned: (discoveryNotes.length >= 30 ? 8 : 0) + (followupDraft.length > 0 && !followupSent ? 7 : 0),
      max: 15,
      passed: discoveryNotes.length >= 30 && !followupSent,
      feedback: followupSent ? 'Follow-up composer must never send email or contact anyone.' : 'Discovery notes documented and follow-up draft saved locally only.'
    }
  ];

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);
  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'b2b-discovery-conversation-lab',
    serverScore,
    passed: serverScore >= 75 && !followupSent,
    criterionResults: criteria,
    authoredHints: fitMatches === totalLeads ? [] : ['Re-check each lead\'s stated budget, timeline, and headcount before classifying fit — a low-fit solo inquiry should be disqualified.'],
    submittedAt: new Date().toISOString()
  };
}
