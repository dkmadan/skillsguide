import { ScoringCriterionResult, LabSubmissionResult } from '../types';

// =========================================================================
// LAB 05: Python Logic & Debugging Lab
// =========================================================================
export function evaluatePythonLogicLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const totalSnippets = Number(answers.totalSnippets) || 6;
  const correctCountRaw = Number(answers.correctCount);
  const correctCount = Number.isFinite(correctCountRaw) ? Math.max(0, Math.min(totalSnippets, correctCountRaw)) : 0;

  const orderedSnippetIds = Array.isArray(answers.orderedSnippetIds) ? (answers.orderedSnippetIds as unknown[]).map(String) : [];
  const predictions = (answers.predictions && typeof answers.predictions === 'object') ? (answers.predictions as Record<string, unknown>) : {};
  const bugChoices = (answers.bugChoices && typeof answers.bugChoices === 'object') ? (answers.bugChoices as Record<string, unknown>) : {};
  const orderArrangements = (answers.orderArrangements && typeof answers.orderArrangements === 'object') ? (answers.orderArrangements as Record<string, unknown>) : {};
  const studyNotes = String(answers.studyNotes || '').trim();

  // --- Correctness: verified against the authored answer key, proportional to the 6 snippets. ---
  const accuracyRatio = totalSnippets > 0 ? correctCount / totalSnippets : 0;
  const correctnessEarned = Math.round(accuracyRatio * 60);
  const correctnessPassed = correctCount >= Math.ceil(totalSnippets * 0.8);

  // --- Constraints: every one of the 6 categories (loops/lists/conditions/dicts/functions/errors)
  // must have been visited exactly once with a genuine recorded decision (predict, bug id, or ordering) —
  // recomputed from the raw arrays/records rather than trusted from a single opaque flag. ---
  const uniqueVisited = new Set(orderedSnippetIds).size;
  const decisionCount = Object.keys(predictions).length + Object.keys(bugChoices).length + Object.keys(orderArrangements).length;
  const coverageOk = uniqueVisited >= totalSnippets && orderedSnippetIds.length === uniqueVisited && decisionCount > 0;
  const coverageRatio = totalSnippets > 0 ? Math.min(1, uniqueVisited / totalSnippets) : 0;
  const constraintsEarned = coverageOk ? 25 : Math.round(coverageRatio * 18);

  // --- Evidence: study notes must be substantive and reference real debugging vocabulary,
  // not just a placeholder sentence. ---
  const KEYWORDS = ['off-by-one', 'off by one', 'index', 'bound', 'loop', 'except', 'error', 'trace', 'range', 'key'];
  const mentionsKeyword = KEYWORDS.some((k) => studyNotes.toLowerCase().includes(k));
  const notesSubstantial = studyNotes.length >= 40 && mentionsKeyword;
  const evidenceEarned = notesSubstantial ? 15 : studyNotes.length >= 15 ? 8 : 2;

  const criteria: ScoringCriterionResult[] = [
    {
      id: 'py-c1',
      name: 'Trace Diagnosis Accuracy (Loops, Lists, Conditions, Dicts, Functions, Errors)',
      category: 'correctness',
      earned: correctnessEarned,
      max: 60,
      passed: correctnessPassed,
      feedback: correctnessPassed
        ? `Matched the authored answer key on ${correctCount}/${totalSnippets} snippets, including the off-by-one boundary defect.`
        : `Matched the authored answer key on only ${correctCount}/${totalSnippets} snippets — re-trace the variable state before locking in a prediction.`
    },
    {
      id: 'py-c2',
      name: 'Full Coverage of the Six Snippet Categories',
      category: 'constraints',
      earned: constraintsEarned,
      max: 25,
      passed: coverageOk,
      feedback: coverageOk
        ? 'Every snippet (loops, lists, conditions, dictionaries, functions, errors) received a recorded decision with no duplicate visits.'
        : `Only ${uniqueVisited}/${totalSnippets} snippet categories received a recorded decision — visit each tab and make a selection before submitting.`
    },
    {
      id: 'py-c3',
      name: 'Debugging Notes & Root-Cause Explanation',
      category: 'evidence',
      earned: evidenceEarned,
      max: 15,
      passed: notesSubstantial,
      feedback: notesSubstantial
        ? 'Notes clearly reference the root cause using concrete debugging vocabulary.'
        : 'Notes are too brief or generic — name the specific boundary, index, or exception involved.'
    }
  ];

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);
  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'python-logic-and-debugging-lab',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: correctnessPassed ? [] : ['In zero-indexed sequences the last element sits at len - 1; re-check any range() bound before trusting a prediction.'],
    submittedAt: new Date().toISOString()
  };
}
