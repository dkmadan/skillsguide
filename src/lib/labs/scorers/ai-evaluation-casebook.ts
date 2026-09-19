import { ScoringCriterionResult, LabSubmissionResult } from '../types';

// =========================================================================
// LAB 08: AI Evaluation Casebook
// =========================================================================
interface RawMetrics { tp: number; fp: number; fn: number; tn: number; skipped: number; precision: number | null; recall: number | null; }

function readMetrics(m: Record<string, unknown> | undefined): RawMetrics {
  const src = m || {};
  const tp = Math.max(0, Number(src.tp) || 0);
  const fp = Math.max(0, Number(src.fp) || 0);
  const fn = Math.max(0, Number(src.fn) || 0);
  const tn = Math.max(0, Number(src.tn) || 0);
  const skipped = Math.max(0, Number(src.skipped) || 0);
  const precision = typeof src.precision === 'number' ? src.precision : null;
  const recall = typeof src.recall === 'number' ? src.recall : null;
  return { tp, fp, fn, tn, skipped, precision, recall };
}

function integrityOk(m: RawMetrics, total: number): boolean {
  return (m.tp + m.fp + m.fn + m.tn + m.skipped) === total;
}
function precisionCoherent(m: RawMetrics): boolean {
  const denom = m.tp + m.fp;
  if (denom === 0) return m.precision === null;
  return m.precision !== null && Math.abs(m.precision - m.tp / denom) < 0.01;
}
function recallCoherent(m: RawMetrics): boolean {
  const denom = m.tp + m.fn;
  if (denom === 0) return m.recall === null;
  return m.recall !== null && Math.abs(m.recall - m.tp / denom) < 0.01;
}
function accuracy(m: RawMetrics): number {
  const reviewed = m.tp + m.fp + m.fn + m.tn;
  return reviewed > 0 ? (m.tp + m.tn) / reviewed : 0;
}

export function evaluateAiEvaluationLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const totalCases = Number(answers.totalCases) || 24;
  const a = readMetrics(answers.metricsA as Record<string, unknown> | undefined);
  const b = readMetrics(answers.metricsB as Record<string, unknown> | undefined);
  const disagreementLog = Array.isArray(answers.disagreementLog) ? answers.disagreementLog : [];
  const releaseMemo = String(answers.releaseMemo || '').trim();

  // --- Correctness: precision/recall are recomputed server-side from the raw tp/fp/fn counts
  // (including the N/A-when-undefined case) and compared against what the client reported,
  // then combined with a real accuracy threshold on the reviewed cases. ---
  const arithmeticOk = precisionCoherent(a) && recallCoherent(a) && precisionCoherent(b) && recallCoherent(b);
  const integrityAllOk = integrityOk(a, totalCases) && integrityOk(b, totalCases);
  const accA = accuracy(a);
  const accB = accuracy(b);
  const accuracyOk = accA >= 0.7 || accB >= 0.7;
  const correctnessEarned = (arithmeticOk ? 30 : 0) + (integrityAllOk ? 15 : 0) + (accuracyOk ? 15 : 0);
  const correctnessPassed = arithmeticOk && integrityAllOk && accuracyOk;

  // --- Constraints: annotation coverage must be reasonably complete (few skipped items),
  // and a disagreement log structure must actually be present. ---
  const skippedRatio = (a.skipped + b.skipped) / (2 * totalCases);
  const coverageOk = skippedRatio <= 0.15;
  const hasDisagreementStructure = Array.isArray(disagreementLog);
  const constraintsEarned = coverageOk && hasDisagreementStructure ? 25 : coverageOk || hasDisagreementStructure ? 14 : 5;

  // --- Evidence: release memo is scored with a lightweight self-review rubric — length plus
  // presence of concrete evaluation vocabulary, not a full NLP judgement. ---
  const KEYWORDS = ['precision', 'recall', 'hallucinat', 'risk', 'disagree', 'ground', 'confiden', 'accuracy'];
  const mentionsKeyword = KEYWORDS.some((k) => releaseMemo.toLowerCase().includes(k));
  const notesSubstantial = releaseMemo.length >= 30 && mentionsKeyword;
  const evidenceEarned = notesSubstantial ? 15 : releaseMemo.length >= 15 ? 8 : 2;

  const criteria: ScoringCriterionResult[] = [
    {
      id: 'eval-c1',
      name: 'Confusion Matrix Arithmetic & Annotation Accuracy',
      category: 'correctness',
      earned: correctnessEarned,
      max: 60,
      passed: correctnessPassed,
      feedback: correctnessPassed
        ? `Precision/recall are internally consistent for both systems (System A: ${(accA * 100).toFixed(0)}% accuracy, System B: ${(accB * 100).toFixed(0)}%).`
        : !arithmeticOk
          ? 'Reported precision/recall do not match tp/fp/fn — remember undefined ratios (denominator 0) must show N/A, not 0.'
          : !integrityAllOk
            ? 'Confusion-matrix counts plus skipped items do not add up to the total case count for one of the systems.'
            : 'Annotation accuracy is too low on both systems — review cases where a claim is only partially supported by the reference fact.'
    },
    {
      id: 'eval-c2',
      name: 'Annotation Coverage & Disagreement Tracking',
      category: 'constraints',
      earned: constraintsEarned,
      max: 25,
      passed: coverageOk && hasDisagreementStructure,
      feedback: coverageOk
        ? 'Most cases received a reviewed label rather than being left skipped, and the disagreement log is structurally present.'
        : `Too many cases were left unreviewed (skip rate ${(skippedRatio * 100).toFixed(0)}%) — a casebook with mostly skipped items cannot support a release decision.`
    },
    {
      id: 'eval-c3',
      name: 'Disagreement Audit & Release Memo Self-Review',
      category: 'evidence',
      earned: evidenceEarned,
      max: 15,
      passed: notesSubstantial,
      feedback: notesSubstantial
        ? 'Release memo references concrete metrics and risk vocabulary appropriate to a governance decision.'
        : 'Release memo is too brief or generic — cite the actual precision/recall gap or hallucination pattern that drove your decision.'
    }
  ];

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);
  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'ai-evaluation-casebook',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: correctnessPassed ? [] : ['Recheck cases where a response only partially matches the reference fact — those should be labeled incomplete, not supported.'],
    submittedAt: new Date().toISOString()
  };
}
