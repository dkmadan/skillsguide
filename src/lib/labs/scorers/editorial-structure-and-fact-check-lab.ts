import { ScoringCriterionResult, LabSubmissionResult } from '../types';

// =========================================================================
// LAB 25: Editorial Structure and Fact Check Lab
// =========================================================================

interface SubmittedSource {
  id: string;
  supported: boolean;
}

interface SubmittedClaim {
  id: string;
  correctSourceId: string | null;
  linkedSourceId: string | null;
}

interface SubmittedOutlineSection {
  id: string;
  required: boolean;
  included: boolean;
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function evaluateEditorialFactCheckLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const sources = Array.isArray(answers.sources) ? (answers.sources as SubmittedSource[]) : [];
  const claims = Array.isArray(answers.claims) ? (answers.claims as SubmittedClaim[]) : [];
  const outline = Array.isArray(answers.outline) ? (answers.outline as SubmittedOutlineSection[]) : [];
  const sentenceChoices = (answers.sentenceChoices as Record<string, number>) || {};
  const sentenceMeta = Array.isArray(answers.sentenceMeta) ? (answers.sentenceMeta as { id: string; preferredIndex: number }[]) : [];
  const articleBody = String(answers.articleBody || '');
  const wordTarget = (answers.wordTarget as { min: number; max: number }) || { min: 0, max: Infinity };
  const summaryText = String(answers.summaryText || '');
  const selfReview = String(answers.selfReview || '').trim();

  const sourceMap = new Map(sources.map((s) => [s.id, s]));

  // --- Fact-check: every claim must resolve to its correct source (or
  // correctly stay unlinked when no source actually supports it), and NO
  // claim may point to a source marked unsupported.
  const noUnsupportedLinked = claims.every((c) => {
    if (!c.linkedSourceId) return true;
    const src = sourceMap.get(c.linkedSourceId);
    return Boolean(src?.supported);
  });
  const allClaimsCorrect = claims.length > 0 && claims.every((c) => (c.correctSourceId === null ? c.linkedSourceId === null : c.linkedSourceId === c.correctSourceId));
  const factCheckPassed = noUnsupportedLinked && allClaimsCorrect;

  // --- Sentence revision: must select the authored, clearer revision — not
  // merely move away from the original — for every sample sentence.
  const sentencesRevised = sentenceMeta.length > 0 && sentenceMeta.every((s) => sentenceChoices[s.id] === s.preferredIndex);

  // --- Structural constraints: required outline sections present, article
  // length and summary length within the developer-set bounds (word counts
  // and section presence only — never a claim of grammar/originality scoring).
  const recomputedWordCount = wordCount(articleBody);
  const articleLengthOk = recomputedWordCount > 0 && recomputedWordCount >= wordTarget.min && recomputedWordCount <= wordTarget.max;
  const requiredSectionsPresent = outline.length > 0 && outline.filter((s) => s.required).every((s) => s.included);
  const summaryWordCount = wordCount(summaryText);
  const summaryAdapted = summaryWordCount >= 8 && summaryWordCount <= 45;
  const structuralOk = articleLengthOk && requiredSectionsPresent && summaryAdapted;

  const evidenceComplete = selfReview.length >= 20 && recomputedWordCount > 0 && summaryWordCount > 0;

  const criteria: ScoringCriterionResult[] = [
    {
      id: 'edt-c1',
      name: 'Fact-Check: Claims Correctly Linked, No Unsupported Source Cited',
      category: 'correctness',
      earned: factCheckPassed ? 35 : noUnsupportedLinked ? 20 : 5,
      max: 35,
      passed: factCheckPassed,
      feedback: factCheckPassed
        ? 'Every claim resolves to its correct supporting source, and no unsupported source was left linked to a claim.'
        : noUnsupportedLinked
          ? 'No unsupported sources are linked, but not every claim is resolved to its correct source (or correctly left unlinked).'
          : 'An unsupported source is still linked to a claim — this must be flagged and unlinked.',
    },
    {
      id: 'edt-c2',
      name: 'Sample Sentences Revised to the Clearer Authored Option',
      category: 'correctness',
      earned: sentencesRevised ? 25 : 10,
      max: 25,
      passed: sentencesRevised,
      feedback: sentencesRevised
        ? 'Every unclear sample sentence was revised to the clearer, authored alternative.'
        : 'At least one sample sentence still uses the original (or a weaker) wording.',
    },
    {
      id: 'edt-c3',
      name: 'Structure & Length: Outline, Word Count, Summary Bounds',
      category: 'constraints',
      earned: structuralOk ? 25 : requiredSectionsPresent ? 15 : 5,
      max: 25,
      passed: structuralOk,
      feedback: structuralOk
        ? `All required outline sections are present, the article (${recomputedWordCount} words) is within its target range, and the summary was meaningfully adapted.`
        : `Draft length was ${recomputedWordCount} words (target ${wordTarget.min}-${wordTarget.max}); ensure every required section is included and the summary is adapted.`,
    },
    {
      id: 'edt-c4',
      name: 'Saved Evidence: Article, Source Mapping, Revision Notes & Self-Review',
      category: 'evidence',
      earned: evidenceComplete ? 15 : 6,
      max: 15,
      passed: evidenceComplete,
      feedback: evidenceComplete
        ? 'Article text, source mapping, and a substantive self-review were all captured.'
        : 'Self-review is too short, or the article/summary is empty — quality of arbitrary prose stays self/instructor-reviewed, but these artifacts must exist.',
    },
  ];

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);
  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'editorial-structure-and-fact-check-lab',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: factCheckPassed && sentencesRevised && structuralOk
      ? []
      : ['Unlink any claim pointing to an unsupported source, revise every sample sentence to its clearer authored option, and confirm every required outline section is included.'],
    submittedAt: new Date().toISOString(),
  };
}
