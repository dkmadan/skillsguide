import { ScoringCriterionResult, LabSubmissionResult } from '../types';

// =========================================================================
// LAB 26: Social Content Calendar Lab
// =========================================================================

type Pillar = 'educational' | 'community' | 'product_announcement' | 'career_advice';
const PILLARS: Pillar[] = ['educational', 'community', 'product_announcement', 'career_advice'];

interface SubmittedPost {
  id: string;
  day: string;
  pillar: Pillar;
  copy: string;
  imageAltText: string;
}

interface SubmittedCaseMeta {
  id: string;
  requiresRespectfulChoice: boolean;
  options: { id: string; tone: 'defensive' | 'empathetic' | 'ignore' }[] | null;
}

export function evaluateSocialContentCalendarLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const posts = Array.isArray(answers.posts) ? (answers.posts as SubmittedPost[]) : [];
  const caseResponses = (answers.caseResponses as Record<string, string>) || {};
  const caseMeta = Array.isArray(answers.caseMeta) ? (answers.caseMeta as SubmittedCaseMeta[]) : [];
  const currentCaseStep = Number(answers.currentCaseStep || 0);

  // --- Slot conflicts: recompute independently from submitted posts.
  const dayCounts = new Map<string, number>();
  posts.forEach((p) => dayCounts.set(p.day, (dayCounts.get(p.day) || 0) + 1));
  const hasSlotConflicts = [...dayCounts.values()].some((n) => n > 1);

  // --- Accessibility: every post needs real alt text.
  const missingAltCount = posts.filter((p) => !p.imageAltText || !p.imageAltText.trim()).length;
  const accessibilityClean = posts.length > 0 && missingAltCount === 0;

  // --- Content pillar coverage: all four pillars represented.
  const coveredPillars = new Set(posts.map((p) => p.pillar));
  const pillarsCovered = PILLARS.every((p) => coveredPillars.has(p));

  // --- Respectful complaint-response branch: every case requiring a
  // response must have been resolved with an empathetic-toned option.
  const casesRequiringResponse = caseMeta.filter((c) => c.requiresRespectfulChoice);
  const allRespectfullyResolved =
    casesRequiringResponse.length > 0 &&
    casesRequiringResponse.every((c) => {
      const chosen = caseResponses[c.id];
      const opt = c.options?.find((o) => o.id === chosen);
      return opt?.tone === 'empathetic';
    });

  // --- Evidence: drafts have real copy, and the case-review clock was engaged.
  const draftsComplete = posts.length > 0 && posts.every((p) => p.copy && p.copy.trim().length > 10);
  const evidenceComplete = draftsComplete && currentCaseStep > 0 && Object.keys(caseResponses).length > 0;

  const criteria: ScoringCriterionResult[] = [
    {
      id: 'soc-med-c1',
      name: 'Slot Collision Resolution',
      category: 'correctness',
      earned: !hasSlotConflicts ? 20 : 8,
      max: 20,
      passed: !hasSlotConflicts,
      feedback: !hasSlotConflicts ? 'No two posts share the same day — the weekly schedule is conflict-free.' : 'Two or more posts are still scheduled on the same day.',
    },
    {
      id: 'soc-med-c2',
      name: 'WCAG Image Accessibility (Alt-Text on Every Post)',
      category: 'correctness',
      earned: accessibilityClean ? 20 : 8,
      max: 20,
      passed: accessibilityClean,
      feedback: accessibilityClean ? 'Every planned post includes descriptive alt text.' : `${missingAltCount} post(s) are still missing image descriptions.`,
    },
    {
      id: 'soc-med-c3',
      name: 'Content Pillar Coverage (All 4 Pillars Represented)',
      category: 'correctness',
      earned: pillarsCovered ? 20 : 10,
      max: 20,
      passed: pillarsCovered,
      feedback: pillarsCovered ? 'Educational, Community, Product, and Career pillars are all represented this week.' : 'At least one content pillar is missing from the week\'s calendar.',
    },
    {
      id: 'soc-med-c4',
      name: 'Respectful Complaint-Response Branch',
      category: 'constraints',
      earned: allRespectfullyResolved ? 25 : casesRequiringResponse.length > 0 ? 10 : 5,
      max: 25,
      passed: allRespectfullyResolved,
      feedback: allRespectfullyResolved
        ? 'Every prepared complaint/question case was resolved with a respectful, actionable response — not a defensive or dismissive one.'
        : 'At least one prepared case was left unresolved or resolved with a defensive/dismissive response.',
    },
    {
      id: 'soc-med-c5',
      name: 'Saved Evidence: Calendar, Post Drafts & Response Checklist',
      category: 'evidence',
      earned: evidenceComplete ? 15 : 6,
      max: 15,
      passed: evidenceComplete,
      feedback: evidenceComplete
        ? 'Post drafts have real copy, and the engagement case review was completed with recorded responses.'
        : 'Write full post copy for every slot and advance the case review clock to log your response checklist.',
    },
  ];

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);
  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'social-content-calendar-lab',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: !hasSlotConflicts && accessibilityClean && pillarsCovered && allRespectfullyResolved
      ? []
      : ['Resolve every same-day collision, add alt text to every post, cover all four content pillars, and choose the respectful/actionable response for every prepared complaint case.'],
    submittedAt: new Date().toISOString(),
  };
}
