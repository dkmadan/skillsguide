import { ScoringCriterionResult, LabSubmissionResult } from '../types';

// =========================================================================
// LAB 09: Frontend Layout and Accessibility Lab
// =========================================================================
export function evaluateFrontendLayoutLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const nodes = (answers.nodes as Array<{ contrastRatio: number; ariaLabel: string; mobileStack: boolean; interactive?: boolean; touchTargetPx?: number }>) || [];
  const allContrastOk = Boolean(answers.allContrastOk) || (nodes.length > 0 && nodes.every((n) => n.contrastRatio >= 4.5));
  // ariaLabel must be non-empty after trimming — whitespace-only labels do not count.
  const allLabelsPresent = Boolean(answers.allLabelsOk) || (nodes.length > 0 && nodes.every((n) => n.ariaLabel && n.ariaLabel.trim().length > 0));
  const allStackedOnMobile = Boolean(answers.allStackedOnMobile) || (nodes.length > 0 && nodes.every((n) => n.mobileStack));
  const allTouchTargetsOk = Boolean(answers.allTouchTargetsOk) || (nodes.length > 0 && nodes.every((n) => !n.interactive || (n.touchTargetPx ?? 44) >= 44));
  const focusOrderCorrect = Boolean(answers.focusOrderCorrect);
  const visitedLoadingState = Boolean(answers.visitedLoadingState);
  const visitedEmptyState = Boolean(answers.visitedEmptyState);

  const contrastAndLabelsOk = allContrastOk && allLabelsPresent;

  const c1Earned = allContrastOk ? 25 : 10;
  const c2Earned = (allLabelsPresent ? 12 : 4) + (allTouchTargetsOk ? 8 : 0);
  const c3Earned = (focusOrderCorrect ? 15 : 5) + (allStackedOnMobile ? 10 : 0);
  const statesReviewed = visitedLoadingState && visitedEmptyState;
  const c4Earned = statesReviewed ? 15 : 6;

  const criteria: ScoringCriterionResult[] = [
    {
      id: 'fe-c1',
      name: 'WCAG 2.2 AA Contrast Compliance (>= 4.5:1)',
      category: 'correctness',
      earned: c1Earned,
      max: 25,
      passed: allContrastOk,
      feedback: allContrastOk ? 'Every component meets the 4.5:1 AA contrast minimum.' : 'One or more components are below the 4.5:1 AA contrast minimum.'
    },
    {
      id: 'fe-c2',
      name: 'Accessible Labels & Touch Target Size',
      category: 'correctness',
      earned: c2Earned,
      max: 20,
      passed: allLabelsPresent && allTouchTargetsOk,
      feedback: allLabelsPresent && allTouchTargetsOk
        ? 'All interactive elements have non-empty aria-labels and meet the 44px WCAG 2.2 touch target minimum.'
        : `${!allLabelsPresent ? 'One or more aria-labels are missing or whitespace-only. ' : ''}${!allTouchTargetsOk ? 'One or more interactive elements are below the 44px minimum touch target.' : ''}`
    },
    {
      id: 'fe-c3',
      name: 'Sequential Focus Order & Mobile Stacking',
      category: 'constraints',
      earned: c3Earned,
      max: 25,
      passed: focusOrderCorrect && allStackedOnMobile,
      feedback: focusOrderCorrect && allStackedOnMobile
        ? 'Keyboard tab order matches visual layout order and all cards stack correctly at mobile width.'
        : `${!focusOrderCorrect ? 'Tab order does not match the visual layout sequence. ' : ''}${!allStackedOnMobile ? 'One or more cards do not stack at mobile width.' : ''}`
    },
    {
      id: 'fe-c4',
      name: 'Loading & Empty State Review',
      category: 'evidence',
      earned: c4Earned,
      max: 15,
      passed: statesReviewed,
      feedback: statesReviewed
        ? 'Both the deterministic loading skeleton and empty state were reviewed without any network request.'
        : 'Review both the loading and empty simulation states before submitting.'
    }
  ];

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);
  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'frontend-layout-and-accessibility-lab',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: contrastAndLabelsOk && focusOrderCorrect && allStackedOnMobile ? [] : ['Fix contrast below 4.5:1, add non-empty aria-labels, enlarge touch targets under 44px, and renumber tab order to match the visual layout.'],
    submittedAt: new Date().toISOString()
  };
}
