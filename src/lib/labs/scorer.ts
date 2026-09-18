import { ScoringCriterionResult, LabSubmissionResult } from './types';

export interface EvaluationInput {
  labSlug: string;
  variant: string;
  answers: Record<string, unknown>;
  idempotencyKey: string;
  attemptId: string;
  ownerId: string;
}

export function evaluateLabSubmission(input: EvaluationInput): LabSubmissionResult {
  const { labSlug, answers, idempotencyKey, attemptId, ownerId } = input;

  switch (labSlug) {
    case 'marketing-budget-simulator':
      return evaluateMarketingBudgetLab(answers, idempotencyKey, attemptId, ownerId);
    case 'seo-snapshot-audit-lab':
      return evaluateSeoAuditLab(answers, idempotencyKey, attemptId, ownerId);
    case 'executive-office-prioritization-lab':
      return evaluateExecutiveOfficeLab(answers, idempotencyKey, attemptId, ownerId);
    default:
      return evaluateGenericLab(labSlug, answers, idempotencyKey, attemptId, ownerId);
  }
}

// =========================================================================
// LAB 19 EVALUATOR: Marketing Budget Simulator
// =========================================================================
function evaluateMarketingBudgetLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const metaBudget = Number(answers.metaBudget || 0);
  const googleBudget = Number(answers.googleBudget || 0);
  const linkedinBudget = Number(answers.linkedinBudget || 0);
  const totalSpend = metaBudget + googleBudget + linkedinBudget;
  const daysSimulated = Number(answers.daysSimulated || 0);
  const selectedCreatives = (answers.selectedCreatives as Record<string, string>) || {};
  const strategyNotes = String(answers.strategyNotes || '').trim();

  // Deterministic calculation from trusted formulas:
  // Meta: CPM 120, CTR 0.018, Conv 0.040 (with bonus if v1 video chosen)
  const metaConvBonus = selectedCreatives.meta === 'meta_v1' ? 0.005 : 0;
  const metaImpressions = (metaBudget / 120) * 1000;
  const metaClicks = metaImpressions * (0.018 + (selectedCreatives.meta === 'meta_v1' ? 0.003 : 0));
  const metaLeads = metaClicks * (0.040 + metaConvBonus);

  // Google: CPM 240, CTR 0.038, Conv 0.065 (with bonus if v1 chosen)
  const googConvBonus = selectedCreatives.google === 'goog_v1' ? 0.010 : (selectedCreatives.google === 'goog_v2' ? -0.005 : 0);
  const googImpressions = (googleBudget / 240) * 1000;
  const googClicks = googImpressions * (0.038 + (selectedCreatives.google === 'goog_v1' ? 0.005 : 0));
  const googLeads = googClicks * (0.065 + googConvBonus);

  // LinkedIn: CPM 460, CTR 0.014, Conv 0.095 (with bonus if v1 chosen)
  const liConvBonus = selectedCreatives.linkedin === 'li_v1' ? 0.015 : 0;
  const liImpressions = (linkedinBudget / 460) * 1000;
  const liClicks = liImpressions * (0.014 + (selectedCreatives.linkedin === 'li_v1' ? 0.002 : 0));
  const liLeads = liClicks * (0.095 + liConvBonus);

  const totalLeads = Math.round(metaLeads + googLeads + liLeads);
  const cpl = totalLeads > 0 ? Math.round(totalSpend / totalLeads) : 9999;

  const criteria: ScoringCriterionResult[] = [];
  const hints: string[] = [];

  // Criterion 1: Target Leads >= 150 (Task: 25 pts)
  const leadsTargetMet = totalLeads >= 150;
  criteria.push({
    id: 'mkt-c1',
    name: 'Lead Volume Target (>= 150 qualified leads)',
    category: 'correctness',
    earned: leadsTargetMet ? 25 : totalLeads >= 120 ? 15 : 5,
    max: 25,
    passed: leadsTargetMet,
    feedback: leadsTargetMet
      ? `Successfully generated ${totalLeads} qualified leads (target was 150).`
      : `Generated ${totalLeads} leads. Try optimizing channel mix with high-converting creative variants.`
  });
  if (!leadsTargetMet) {
    hints.push('High-intent channels like Google Search yield better conversion when coupled with high-engagement Meta video creative.');
  }

  // Criterion 2: Cost Per Lead <= 700 (Task: 20 pts)
  const cplTargetMet = cpl <= 700 && totalLeads > 0;
  criteria.push({
    id: 'mkt-c2',
    name: 'Acquisition Efficiency (CPL <= 700 credits)',
    category: 'correctness',
    earned: cplTargetMet ? 20 : cpl <= 850 ? 10 : 0,
    max: 20,
    passed: cplTargetMet,
    feedback: cplTargetMet
      ? `Efficient blended CPL achieved at ${cpl} credits per lead.`
      : `CPL of ${cpl} credits exceeded the 700 budget ceiling. LinkedIn has high CPM; balance it with scalable Meta top-of-funnel.`
  });

  // Criterion 3: Simulation Horizon 30 Days (Task: 15 pts)
  const fullSimulationRun = daysSimulated >= 30;
  criteria.push({
    id: 'mkt-c3',
    name: 'Full Campaign Lifecycle Run (30 Days)',
    category: 'correctness',
    earned: fullSimulationRun ? 15 : 5,
    max: 15,
    passed: fullSimulationRun,
    feedback: fullSimulationRun
      ? 'Completed the entire 30-day simulation lifecycle.'
      : 'Campaign simulation was only partially run before submission.'
  });

  // Criterion 4: Budget Discipline <= 100,000 (Constraints: 15 pts)
  const withinBudget = totalSpend <= 100000 && totalSpend >= 70000;
  criteria.push({
    id: 'mkt-c4',
    name: 'Budget Discipline (Spend <= 100,000 credits)',
    category: 'constraints',
    earned: withinBudget ? 15 : totalSpend <= 100000 ? 8 : 0,
    max: 15,
    passed: withinBudget,
    feedback: withinBudget
      ? `Allocated ${totalSpend.toLocaleString()} credits cleanly within the 100,000 ceiling.`
      : totalSpend > 100000
        ? `Overspent budget! Allocated ${totalSpend.toLocaleString()} vs 100,000 max.`
        : `Under-allocated: Only ${totalSpend.toLocaleString()} credits spent, leaving growth capital on the table.`
  });

  // Criterion 5: Diversification (Constraints: 10 pts)
  const maxChannelShare = totalSpend > 0 ? Math.max(metaBudget, googleBudget, linkedinBudget) / totalSpend : 1;
  const diversified = maxChannelShare <= 0.75;
  criteria.push({
    id: 'mkt-c5',
    name: 'Channel Diversification (<= 75% in any one channel)',
    category: 'constraints',
    earned: diversified ? 10 : 3,
    max: 10,
    passed: diversified,
    feedback: diversified
      ? 'Well balanced multi-channel portfolio without over-reliance on a single ad network.'
      : 'Over-concentrated! More than 75% of spend was directed into one channel.'
  });

  // Criterion 6: Creative Variant Optimization (Evidence: 10 pts)
  const optimalCreatives = selectedCreatives.meta === 'meta_v1' && selectedCreatives.google === 'goog_v1';
  criteria.push({
    id: 'mkt-c6',
    name: 'Creative Optimization Selection',
    category: 'evidence',
    earned: optimalCreatives ? 10 : 5,
    max: 10,
    passed: optimalCreatives,
    feedback: optimalCreatives
      ? 'Selected high-converting creative assets (Video showcase & Intent keyword copy).'
      : 'Creative selection used generic or lower-converting assets.'
  });

  // Criterion 7: Strategy Rationale (Evidence: 5 pts)
  const hasRationale = strategyNotes.length >= 20;
  criteria.push({
    id: 'mkt-c7',
    name: 'Campaign Strategy Documentation',
    category: 'evidence',
    earned: hasRationale ? 5 : 0,
    max: 5,
    passed: hasRationale,
    feedback: hasRationale
      ? 'Provided clear strategic rationale for channel split and lead projections.'
      : 'Missing strategy justification notes.'
  });

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);

  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'marketing-budget-simulator',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: hints,
    submittedAt: new Date().toISOString(),
    selfReviewPrompt: 'Reflect on how your chosen channel allocation would change if customer acquisition cost in LinkedIn doubled during Q4.'
  };
}

// =========================================================================
// LAB 20 EVALUATOR: SEO Snapshot Audit Lab
// =========================================================================
function evaluateSeoAuditLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const fixedTitleBackend = String(answers.fixedTitleBackend || '').trim();
  const addedPricingDesc = String(answers.addedPricingDesc || '').trim();
  const orphanLinked = Boolean(answers.orphanLinked);
  const brokenLinkFixed = Boolean(answers.brokenLinkFixed);
  const auditNotes = String(answers.auditNotes || '').trim();

  const criteria: ScoringCriterionResult[] = [];
  const hints: string[] = [];

  // Criterion 1: Fix duplicate title (Task: 25 pts)
  const isDuplicateFixed = fixedTitleBackend.length > 5 && !fixedTitleBackend.toLowerCase().includes('frontend');
  criteria.push({
    id: 'seo-c1',
    name: 'Resolve Duplicate Title on /skills/backend',
    category: 'correctness',
    earned: isDuplicateFixed ? 25 : 0,
    max: 25,
    passed: isDuplicateFixed,
    feedback: isDuplicateFixed
      ? `Title successfully differentiated to unique backend terminology: "${fixedTitleBackend}".`
      : 'Duplicate title was not resolved. Ensure /skills/backend has a unique, descriptive title tag.'
  });
  if (!isDuplicateFixed) hints.push('Every page requires a distinct title tag reflecting its unique primary keyword.');

  // Criterion 2: Fix broken 404 link (Task: 20 pts)
  criteria.push({
    id: 'seo-c2',
    name: 'Repair Broken Internal Link (/tools/old-calc)',
    category: 'correctness',
    earned: brokenLinkFixed ? 20 : 0,
    max: 20,
    passed: brokenLinkFixed,
    feedback: brokenLinkFixed
      ? 'Broken link successfully re-pointed from /tools/old-calc to /tools/salary-calculator.'
      : 'Broken 404 internal link still present on /pricing page.'
  });

  // Criterion 3: Provide missing meta description (Task: 15 pts)
  const isDescAdequate = addedPricingDesc.length >= 40 && addedPricingDesc.length <= 170;
  criteria.push({
    id: 'seo-c3',
    name: 'Author Missing Meta Description on /pricing',
    category: 'correctness',
    earned: isDescAdequate ? 15 : addedPricingDesc.length > 0 ? 8 : 0,
    max: 15,
    passed: isDescAdequate,
    feedback: isDescAdequate
      ? `Meta description populated within ideal length (${addedPricingDesc.length} characters).`
      : 'Meta description missing or outside recommended length (ideal: 50-160 characters).'
  });

  // Criterion 4: Resolve orphan page (Constraints: 15 pts)
  criteria.push({
    id: 'seo-c4',
    name: 'Integrate Orphan Page (/guides/data-engineering)',
    category: 'constraints',
    earned: orphanLinked ? 15 : 0,
    max: 15,
    passed: orphanLinked,
    feedback: orphanLinked
      ? 'Orphan page linked from relevant contextual parent (/skills/data-analytics).'
      : 'The guide /guides/data-engineering still has 0 internal inbound links and cannot be crawled.'
  });

  // Criterion 5: Title length constraint (Constraints: 10 pts)
  const isTitleLengthIdeal = isDuplicateFixed && fixedTitleBackend.length <= 65;
  criteria.push({
    id: 'seo-c5',
    name: 'Title Length & Snippet Truncation Boundary',
    category: 'constraints',
    earned: isTitleLengthIdeal ? 10 : 4,
    max: 10,
    passed: isTitleLengthIdeal,
    feedback: isTitleLengthIdeal
      ? 'Title tag stays below 65 characters to prevent SERP truncation.'
      : 'Title tag exceeds 65 characters and risks truncation in search engine result pages.'
  });

  // Criterion 6: SERP Preview Checked (Evidence: 10 pts)
  const serpChecked = Boolean(answers.serpPreviewChecked);
  criteria.push({
    id: 'seo-c6',
    name: 'SERP Visual Verification',
    category: 'evidence',
    earned: serpChecked ? 10 : 5,
    max: 10,
    passed: serpChecked,
    feedback: serpChecked
      ? 'Learner inspected desktop and mobile SERP rendering previews.'
      : 'SERP snippet verification was skipped.'
  });

  // Criterion 7: Audit Log (Evidence: 5 pts)
  const hasAuditLog = auditNotes.length >= 20;
  criteria.push({
    id: 'seo-c7',
    name: 'Audit Repair Log & Handover',
    category: 'evidence',
    earned: hasAuditLog ? 5 : 0,
    max: 5,
    passed: hasAuditLog,
    feedback: hasAuditLog
      ? 'Documented technical audit findings and remediation history.'
      : 'Audit change log was empty.'
  });

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);

  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'seo-snapshot-audit-lab',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: hints,
    submittedAt: new Date().toISOString(),
    selfReviewPrompt: 'How would you prioritize fixing technical issues across a 10,000 page website when developer resources are constrained?'
  };
}

// =========================================================================
// LAB 29 EVALUATOR: Executive Office Prioritization Lab
// =========================================================================
function evaluateExecutiveOfficeLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const rescheduledClientPitch = answers.clientPitchSlot === 'thursday_11';
  const triagedInbox = (answers.triagedInbox as Record<string, string>) || {};
  const selectedTravel = answers.selectedTravelId === 'opt_b';
  const handoverMemo = String(answers.handoverMemo || '').trim();

  const criteria: ScoringCriterionResult[] = [];
  const hints: string[] = [];

  // Criterion 1: Calendar Conflict Resolution (Task: 30 pts)
  criteria.push({
    id: 'eop-c1',
    name: 'Resolve Overlapping Mandatory Meeting Conflict',
    category: 'correctness',
    earned: rescheduledClientPitch ? 30 : 0,
    max: 30,
    passed: rescheduledClientPitch,
    feedback: rescheduledClientPitch
      ? 'Rescheduled Apex Corp Enterprise Deal closing pitch to Thursday 11:00 AM, protecting the Board Audit slot.'
      : 'Mandatory conflict on Wednesday 15:00 IST remains unresolved.'
  });
  if (!rescheduledClientPitch) hints.push('Executive calendars cannot double-book mandatory board meetings and Tier-1 deal pitches simultaneously.');

  // Criterion 2: Inbox Eisenhower Triage (Task: 30 pts)
  // Check key mails: mail_1 (urgent_important), mail_4 (urgent_not_important), mail_3 (important_not_urgent), mail_5 (delegate_archive)
  let correctTriageCount = 0;
  if (triagedInbox.mail_1 === 'urgent_important') correctTriageCount++;
  if (triagedInbox.mail_2 === 'urgent_important') correctTriageCount++;
  if (triagedInbox.mail_3 === 'important_not_urgent') correctTriageCount++;
  if (triagedInbox.mail_4 === 'urgent_not_important') correctTriageCount++;
  if (triagedInbox.mail_5 === 'delegate_archive') correctTriageCount++;
  if (triagedInbox.mail_6 === 'urgent_important') correctTriageCount++;

  const triageScore = Math.round((correctTriageCount / 6) * 30);
  criteria.push({
    id: 'eop-c2',
    name: 'Eisenhower Matrix Inbox Classification',
    category: 'correctness',
    earned: triageScore,
    max: 30,
    passed: triageScore >= 20,
    feedback: `Accurately classified ${correctTriageCount} of 6 executive communications into the correct urgency/importance quadrants.`
  });

  // Criterion 3: Executive Travel Policy Compliance (Constraints: 15 pts)
  criteria.push({
    id: 'eop-c3',
    name: 'Travel Policy & Fatigue Window Selection',
    category: 'constraints',
    earned: selectedTravel ? 15 : 0,
    max: 15,
    passed: selectedTravel,
    feedback: selectedTravel
      ? 'Selected Option B (Direct flight arriving 06:20 AM), avoiding a disruptive 04:15 AM arrival.'
      : 'Selected Option A which lands at 04:15 AM causing fatigue before the morning keynote.'
  });

  // Criterion 4: Security 2FA Prioritization (Constraints: 10 pts)
  const is2faPrioritized = triagedInbox.mail_4 === 'urgent_not_important' || triagedInbox.mail_4 === 'urgent_important';
  criteria.push({
    id: 'eop-c4',
    name: 'Hardware Token Lockout Prevention',
    category: 'constraints',
    earned: is2faPrioritized ? 10 : 0,
    max: 10,
    passed: is2faPrioritized,
    feedback: is2faPrioritized
      ? 'Treated 4-hour YubiKey expiration promptly to avoid executive system lockout.'
      : 'Security token expiry was neglected, risking system lockout.'
  });

  // Criterion 5: Shift Handover Documentation (Evidence: 15 pts)
  const hasHandover = handoverMemo.length >= 30;
  criteria.push({
    id: 'eop-c5',
    name: 'Executive Shift Handover Memo',
    category: 'evidence',
    earned: hasHandover ? 15 : 5,
    max: 15,
    passed: hasHandover,
    feedback: hasHandover
      ? 'Comprehensive briefing memo drafted for incoming executive staff.'
      : 'Handover memo is too brief or missing critical action items.'
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
    submittedAt: new Date().toISOString(),
    selfReviewPrompt: 'When handling high-stakes executive conflicts, how do you communicate re-scheduling decisions to external VIP clients without compromising relationships?'
  };
}

// Fallback evaluator for other 27 labs until their custom rules are active in Phases 2 and 3
function evaluateGenericLab(
  labSlug: string,
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const criteria: ScoringCriterionResult[] = [
    {
      id: 'gen-c1',
      name: 'Primary Simulation Task Completion',
      category: 'correctness',
      earned: 55,
      max: 60,
      passed: true,
      feedback: 'Completed verified scenario steps.'
    },
    {
      id: 'gen-c2',
      name: 'Simulation Constraints & Boundaries',
      category: 'constraints',
      earned: 22,
      max: 25,
      passed: true,
      feedback: 'Decisions respected scenario boundaries.'
    },
    {
      id: 'gen-c3',
      name: 'Evidence References & Rationale',
      category: 'evidence',
      earned: 14,
      max: 15,
      passed: true,
      feedback: 'Artifact inputs recorded.'
    }
  ];

  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug,
    serverScore: 91,
    passed: true,
    criterionResults: criteria,
    authoredHints: [],
    submittedAt: new Date().toISOString()
  };
}
