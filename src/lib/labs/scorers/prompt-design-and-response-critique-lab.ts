import { ScoringCriterionResult, LabSubmissionResult } from '../types';

// =========================================================================
// LAB 06: Prompt Design and Response Critique Lab
// =========================================================================
export function evaluatePromptDesignLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const blocksEnabled = (answers.blocksEnabled && typeof answers.blocksEnabled === 'object') ? (answers.blocksEnabled as Record<string, boolean>) : {};
  const totalDefects = Number(answers.totalDefects) || 0;
  const correctFlags = Math.max(0, Number(answers.correctFlags) || 0);
  const falseFlags = Math.max(0, Number(answers.falseFlags) || 0);
  const bestResponseCorrect = Boolean(answers.bestResponseCorrect);
  const promptText = String(answers.promptText || '');
  const critiqueMemo = String(answers.critiqueMemo || '').trim();
  const outcomeId = String(answers.outcomeId || '');

  // --- Correctness: recomputed from raw counts, penalized for both missed and false flags. ---
  const defectRatio = totalDefects > 0 ? Math.max(0, (correctFlags - falseFlags) / totalDefects) : (falseFlags === 0 ? 1 : 0);
  const flagScore = Math.round(Math.min(1, defectRatio) * 45);
  const bestScore = bestResponseCorrect ? 15 : 0;
  const correctnessEarned = Math.min(60, flagScore + bestScore);
  const correctnessPassed = defectRatio >= 0.99 && bestResponseCorrect;

  // --- Constraints: schema + privacy blocks must both be enabled — a structural safeguard
  // recomputed directly from the raw toggle booleans, not trusted from a summary flag. ---
  const enabledCount = Object.values(blocksEnabled).filter(Boolean).length;
  const safeguardsOn = Boolean(blocksEnabled.schema) && Boolean(blocksEnabled.privacy);
  const promptCoherent = enabledCount === 0 ? promptText.trim().length === 0 : promptText.length > 20 * enabledCount * 0.3;
  const constraintsEarned = safeguardsOn && promptCoherent ? 25 : safeguardsOn ? 18 : Math.round((enabledCount / 5) * 15);

  // --- Evidence: critique memo must be substantive and reference real quality vocabulary. ---
  const KEYWORDS = ['evidence', 'hallucinat', 'privacy', 'schema', 'ground', 'unsupported', 'confidence'];
  const mentionsKeyword = KEYWORDS.some((k) => critiqueMemo.toLowerCase().includes(k));
  const notesSubstantial = critiqueMemo.length >= 30 && mentionsKeyword;
  const evidenceEarned = notesSubstantial ? 15 : critiqueMemo.length >= 15 ? 8 : 2;

  const criteria: ScoringCriterionResult[] = [
    {
      id: 'prm-c1',
      name: 'Hallucination & Unsupported Claim Identification',
      category: 'correctness',
      earned: correctnessEarned,
      max: 60,
      passed: correctnessPassed,
      feedback: correctnessPassed
        ? `Flagged ${correctFlags}/${totalDefects} unsupported responses with no false flags, and selected the fully grounded response as best.`
        : `Flagged ${correctFlags}/${totalDefects} unsupported responses (${falseFlags} false flag${falseFlags === 1 ? '' : 's'}) — re-check each response against the ticket text before flagging or selecting "best".`
    },
    {
      id: 'prm-c2',
      name: 'Output Schema & Privacy Safeguards Enabled',
      category: 'constraints',
      earned: constraintsEarned,
      max: 25,
      passed: safeguardsOn,
      feedback: safeguardsOn
        ? 'Output schema and privacy/safety constraint blocks are both enabled and the assembled prompt reflects the enabled blocks.'
        : 'Enable both the output-schema and privacy-constraint blocks — leaving either off increases hallucination or PII-leak risk in the prepared outcome table.'
    },
    {
      id: 'prm-c3',
      name: 'Critique Memo & Revision Rationale',
      category: 'evidence',
      earned: evidenceEarned,
      max: 15,
      passed: notesSubstantial,
      feedback: notesSubstantial
        ? `Critique memo references concrete evidence/quality vocabulary (prepared outcome: ${outcomeId || 'none'}).`
        : 'Critique memo is too brief or generic — name the specific defect (hallucination, privacy leak, overclaim) found in each flagged response.'
    }
  ];

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);
  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'prompt-design-and-response-critique-lab',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: correctnessPassed ? [] : ['Re-read each response against the ticket text one field at a time — a claim with no matching source text is unsupported, not just "unlikely".'],
    submittedAt: new Date().toISOString()
  };
}
