import { ScoringCriterionResult, LabSubmissionResult } from '../types';

// =========================================================================
// LAB 15: Defensive SOC Case Lab
// =========================================================================
type Verdict = 'benign' | 'suspicious' | 'critical_threat';
type Nature = 'benign_travel' | 'credential_stuffing' | 'phishing' | 'misleading_bec' | 'impossible_travel' | 'wfh_anomaly' | 'authorized_pentest' | 'insider_exfiltration';

// Stable nature -> expected-verdict mapping. These are semantic truths about each
// synthetic alert category (independent of variant/tier), so they can be safely
// duplicated here for genuine server-side verification without needing the full
// fixture text.
const EXPECTED_VERDICT: Record<Nature, Verdict> = {
  benign_travel: 'benign',
  wfh_anomaly: 'benign',
  authorized_pentest: 'benign',
  credential_stuffing: 'critical_threat',
  phishing: 'critical_threat',
  misleading_bec: 'critical_threat',
  impossible_travel: 'critical_threat',
  insider_exfiltration: 'critical_threat',
};
const BENIGN_NATURES: Nature[] = ['benign_travel', 'wfh_anomaly', 'authorized_pentest'];

interface SubmittedAlert { id: string; user: string; nature: Nature; userVerdict: Verdict | null; evidenceLinked: number; escalationAction: string | null; }

export function evaluateDefensiveSocLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const alerts = Array.isArray(answers.alerts) ? (answers.alerts as SubmittedAlert[]) : [];
  const containedAccounts = Array.isArray(answers.containedAccounts) ? (answers.containedAccounts as string[]) : [];
  const socReport = String(answers.socReport || '').trim();
  const totalAlerts = alerts.length || Number(answers.totalAlerts) || 0;

  // --- Correctness: each alert's verdict is checked against the nature -> expected-verdict
  // table. Exact match = full credit; "suspicious" is a partial hedge in either direction;
  // the opposite classification (missing a real threat, or over-reacting to a benign one)
  // earns nothing. ---
  let scoreSum = 0;
  alerts.forEach((a) => {
    const expected = EXPECTED_VERDICT[a.nature];
    if (!a.userVerdict) return;
    if (a.userVerdict === expected) scoreSum += 1;
    else if (a.userVerdict === 'suspicious') scoreSum += 0.5;
  });
  const accuracyRatio = totalAlerts > 0 ? scoreSum / totalAlerts : 0;
  const correctnessEarned = Math.round(accuracyRatio * 60);
  const correctnessPassed = accuracyRatio >= 0.8;

  // --- Constraints: no critical classification without linked evidence, and no benign
  // account left disruptively contained. Recomputed from the raw per-alert fields. ---
  const criticalAlerts = alerts.filter((a) => a.userVerdict === 'critical_threat');
  const allCriticalHaveEvidence = criticalAlerts.every((a) => a.evidenceLinked > 0);
  const benignAlerts = alerts.filter((a) => BENIGN_NATURES.includes(a.nature));
  const noBenignFalselyContained = benignAlerts.every((a) => !containedAccounts.includes(a.user));
  const constraintsOk = allCriticalHaveEvidence && noBenignFalselyContained;
  const constraintsEarned = constraintsOk ? 25 : allCriticalHaveEvidence || noBenignFalselyContained ? 14 : 5;

  // --- Evidence: case report memo must be substantive and reference concrete
  // investigative vocabulary (IoC, technique, containment, etc.). ---
  const KEYWORDS = ['ioc', 'indicator', 'technique', 'contain', 'evidence', 'phish', 'credential', 'exfilt', 'travel'];
  const mentionsKeyword = KEYWORDS.some((k) => socReport.toLowerCase().includes(k));
  const notesSubstantial = socReport.length >= 40 && mentionsKeyword;
  const evidenceEarned = notesSubstantial ? 15 : socReport.length >= 15 ? 8 : 2;

  const criteria: ScoringCriterionResult[] = [
    {
      id: 'soc-c1',
      name: 'Alert Triage Accuracy (Benign vs. Malicious Classification)',
      category: 'correctness',
      earned: correctnessEarned,
      max: 60,
      passed: correctnessPassed,
      feedback: correctnessPassed
        ? `Correctly triaged ${Math.round(accuracyRatio * 100)}% of alerts against their true nature.`
        : `Triage accuracy was only ${Math.round(accuracyRatio * 100)}% — re-examine benign-looking alerts for hidden approval evidence and malicious-looking alerts for missing red flags.`
    },
    {
      id: 'soc-c2',
      name: 'Evidence-Gated Severity & Non-Disruptive Containment',
      category: 'constraints',
      earned: constraintsEarned,
      max: 25,
      passed: constraintsOk,
      feedback: constraintsOk
        ? 'Every critical-threat classification is backed by linked evidence, and no benign account was disruptively contained.'
        : !allCriticalHaveEvidence
          ? 'At least one alert was marked critical-threat without any evidence tag linked — high-severity calls require supporting evidence.'
          : 'A benign account (e.g. approved travel, WFH, or an authorized pentest) was contained — this disrupts a legitimate user.'
    },
    {
      id: 'soc-c3',
      name: 'SOC Investigation Finding Memo',
      category: 'evidence',
      earned: evidenceEarned,
      max: 15,
      passed: notesSubstantial,
      feedback: notesSubstantial
        ? 'Case report references concrete indicators of compromise and containment reasoning.'
        : 'Case report is too brief or generic — name the specific IoCs, technique, and blast radius for each contained account.'
    }
  ];

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);
  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'defensive-soc-case-lab',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: correctnessPassed ? [] : ['Check for an approval record (travel, WFH, or pentest calendar) before treating an unusual login as malicious, and require linked evidence before escalating anything to critical.'],
    submittedAt: new Date().toISOString()
  };
}
