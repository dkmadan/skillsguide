import { ScoringCriterionResult, LabSubmissionResult } from '../types';

// =========================================================================
// LAB 27: Presentation and Negotiation Planner
// =========================================================================
interface QaOptionMeta { id: string; quality: 'strong' | 'adequate' | 'weak'; }
interface QaPromptMeta { id: string; options: QaOptionMeta[]; }
interface Fixture {
  questions: QaPromptMeta[];
  principledOptionId: string;
}

const FIXTURES: Record<string, Fixture> = {
  beginner: {
    principledOptionId: 'compromise_scope',
    questions: [
      { id: 'q1', options: [{ id: 'q1_a', quality: 'strong' }, { id: 'q1_b', quality: 'weak' }, { id: 'q1_c', quality: 'adequate' }] },
      { id: 'q2', options: [{ id: 'q2_a', quality: 'weak' }, { id: 'q2_b', quality: 'strong' }, { id: 'q2_c', quality: 'adequate' }] },
      { id: 'q3', options: [{ id: 'q3_a', quality: 'strong' }, { id: 'q3_b', quality: 'weak' }, { id: 'q3_c', quality: 'adequate' }] },
    ],
  },
  intermediate: {
    principledOptionId: 'compromise_scope',
    questions: [
      { id: 'q1', options: [{ id: 'q1_a', quality: 'strong' }, { id: 'q1_b', quality: 'weak' }, { id: 'q1_c', quality: 'weak' }] },
      { id: 'q2', options: [{ id: 'q2_a', quality: 'adequate' }, { id: 'q2_b', quality: 'strong' }, { id: 'q2_c', quality: 'weak' }] },
      { id: 'q3', options: [{ id: 'q3_a', quality: 'weak' }, { id: 'q3_b', quality: 'strong' }, { id: 'q3_c', quality: 'adequate' }] },
    ],
  },
  challenge: {
    principledOptionId: 'compromise_scope',
    questions: [
      { id: 'q1', options: [{ id: 'q1_a', quality: 'weak' }, { id: 'q1_b', quality: 'strong' }, { id: 'q1_c', quality: 'weak' }] },
      { id: 'q2', options: [{ id: 'q2_a', quality: 'strong' }, { id: 'q2_b', quality: 'weak' }, { id: 'q2_c', quality: 'weak' }] },
      { id: 'q3', options: [{ id: 'q3_a', quality: 'adequate' }, { id: 'q3_b', quality: 'strong' }, { id: 'q3_c', quality: 'weak' }] },
    ],
  },
};

const QUALITY_POINTS: Record<QaOptionMeta['quality'], number> = { strong: 1, adequate: 0.5, weak: 0 };

export function evaluatePresentationNegotiationLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const variantKey = typeof answers.variant === 'string' && FIXTURES[answers.variant] ? (answers.variant as string) : 'beginner';
  const fixture = FIXTURES[variantKey];

  const wordCount = Number(answers.wordCount || 0);
  const rehearsalMinutes = Number(answers.rehearsalMinutes || 0);
  const submittedWpm = Number(answers.wordsPerMinute || 0);
  const rehearsalLog = Array.isArray(answers.rehearsalLog) ? (answers.rehearsalLog as unknown[]) : [];
  const outline = Array.isArray(answers.outline) ? (answers.outline as { heading?: string; body?: string }[]) : [];
  const questionResponses = (answers.questionResponses as Record<string, string>) || {};
  const negotiationChoice = String(answers.negotiationChoice || '');
  const scopeConfirmed = Boolean(answers.scopeConfirmed);
  const agreedTerms = String(answers.agreedTerms || '').trim();

  const criteria: ScoringCriterionResult[] = [];
  const hints: string[] = [];

  // Recompute the cadence formula server-side: WPM = round(words / minutes).
  // This is the deterministic verification of the spec's "300 words / 3
  // minutes = 100 WPM" case, applied to whatever the learner actually typed
  // and timed rather than trusting their reported figure.
  const recomputedWpm = rehearsalMinutes > 0 ? Math.round(wordCount / rehearsalMinutes) : 0;
  const wpmMatches = rehearsalMinutes === 0 ? submittedWpm === 0 : Math.abs(recomputedWpm - submittedWpm) <= 1;
  criteria.push({
    id: 'prs-c1',
    name: 'Verbal Cadence Estimation (words / minutes = WPM)',
    category: 'correctness',
    earned: wpmMatches ? 20 : 5,
    max: 20,
    passed: wpmMatches,
    feedback: wpmMatches
      ? `Cadence recomputed server-side as ${recomputedWpm} WPM from ${wordCount} words over ${rehearsalMinutes.toFixed(2)} minutes, matching the reported estimate.`
      : `Server recomputed ${recomputedWpm} WPM from ${wordCount} words / ${rehearsalMinutes.toFixed(2)} minutes, which does not match the reported ${submittedWpm} WPM.`
  });

  let qaScore = 0;
  let qaMax = 0;
  fixture.questions.forEach((q) => {
    qaMax += 1;
    const chosen = questionResponses[q.id];
    const opt = q.options.find((o) => o.id === chosen);
    qaScore += opt ? QUALITY_POINTS[opt.quality] : 0;
  });
  const qaFraction = qaMax > 0 ? qaScore / qaMax : 0;
  criteria.push({
    id: 'prs-c2',
    name: 'Prepared Audience Question Responses',
    category: 'correctness',
    earned: Math.round(qaFraction * 30),
    max: 30,
    passed: qaFraction >= 0.66,
    feedback: `Selected the strongest response on ${Math.round(qaFraction * fixture.questions.length * 10) / 10} of ${fixture.questions.length} prepared questions (weighted by answer quality).`
  });
  if (qaFraction < 0.66) hints.push('Re-read each audience question for the response that is specific and evidence-based rather than vague or defensive.');

  const hasMultiplePasses = rehearsalLog.length >= 2;
  criteria.push({
    id: 'prs-c3',
    name: 'Iterative Rehearsal (2+ Logged Passes)',
    category: 'correctness',
    earned: hasMultiplePasses ? 10 : rehearsalLog.length === 1 ? 5 : 0,
    max: 10,
    passed: hasMultiplePasses,
    feedback: hasMultiplePasses ? `Logged ${rehearsalLog.length} rehearsal passes with the manual timer.` : 'Log at least two rehearsal passes with the manual timer before submitting.'
  });

  const isPrincipled = negotiationChoice === fixture.principledOptionId;
  criteria.push({
    id: 'prs-c4',
    name: 'Principled Negotiation Stance',
    category: 'constraints',
    earned: isPrincipled ? 15 : 5,
    max: 15,
    passed: isPrincipled,
    feedback: isPrincipled ? 'Protected quality and morale by staging scope into a later phase instead of crashing the schedule or cutting QA.' : 'Unprincipled stance risks burnout (overtime crash) or quality escapes (cutting QA).'
  });
  if (!isPrincipled) hints.push('Select the principled trade-off option to protect quality while still respecting the timeline pressure.');

  criteria.push({
    id: 'prs-c5',
    name: 'Explicit Scope Confirmation',
    category: 'constraints',
    earned: scopeConfirmed ? 10 : 0,
    max: 10,
    passed: scopeConfirmed,
    feedback: scopeConfirmed ? 'Final scope was explicitly confirmed with the stakeholder before the agreement was treated as final.' : 'Scope was never explicitly confirmed — check the confirmation box before finalizing the agreement.'
  });

  const outlineComplete = outline.length >= 5 && outline.every((c) => (c.body || '').trim().split(/\s+/).filter(Boolean).length >= 5);
  const hasAgreement = agreedTerms.length >= 20;
  const evidenceOk = outlineComplete && hasAgreement;
  criteria.push({
    id: 'prs-c6',
    name: 'Presentation Outline & Agreement Draft Completeness',
    category: 'evidence',
    earned: evidenceOk ? 15 : outlineComplete || hasAgreement ? 8 : 3,
    max: 15,
    passed: evidenceOk,
    feedback: evidenceOk ? 'Full outline and a substantive negotiated agreement draft were both saved as evidence.' : 'Outline cards need real content on every card and/or the agreement draft is too brief.'
  });

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);
  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'presentation-and-negotiation-planner',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: hints,
    submittedAt: new Date().toISOString()
  };
}
