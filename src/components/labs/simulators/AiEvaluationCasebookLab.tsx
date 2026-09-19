'use client';

import { useMemo, useState } from 'react';
import { LabScenarioVariant, LabDifficulty } from '@/lib/labs/types';
import { useUndoableState } from '@/lib/labs/useUndoableState';
import { downloadJson, downloadCsv } from '@/lib/labs/exportHelper';
import ChartFrame from '@/components/labs/charts/ChartFrame';
import CompareBarChart from '@/components/labs/charts/CompareBarChart';
import CompareRadarChart from '@/components/labs/charts/CompareRadarChart';
import {
  Undo2, Redo2, RotateCcw, Download, FileJson, Send, ClipboardList, ScanEye,
} from 'lucide-react';

interface Props {
  scenario?: LabScenarioVariant;
  variant: LabDifficulty;
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

type Label3 = 'supported' | 'unsupported' | 'incomplete';
type SystemKey = 'a' | 'b';

interface CaseItem {
  id: string;
  prompt: string;
  groundTruth: string;
  systemA: string;
  systemB: string;
  goldA: Label3;
  goldB: Label3;
  secondReviewer?: { system: SystemKey; label: Label3 };
}

function c(id: string, prompt: string, gt: string, a: string, b: string, goldA: Label3, goldB: Label3, secondReviewer?: CaseItem['secondReviewer']): CaseItem {
  return { id, prompt, groundTruth: gt, systemA: a, systemB: b, goldA, goldB, secondReviewer };
}

function buildCases(variant: LabDifficulty): CaseItem[] {
  if (variant === 'beginner') {
    return [
      c('c1', 'Return window for electronics?', 'Returnable within 30 days with receipt.', 'Returnable within 30 days with a receipt.', 'Electronics are non-returnable once opened.', 'supported', 'unsupported'),
      c('c2', 'Refurb laptop warranty?', 'Certified refurbished laptops include a 1-year warranty.', 'Yes, a 1-year limited warranty is included.', 'No warranty on refurbished stock.', 'supported', 'unsupported'),
      c('c3', 'Enterprise 24/7 phone support?', 'Enterprise includes 24/7 phone and Slack support.', 'Yes, 24/7 phone and Slack support included.', 'Support is email-only, 9am-5pm EST.', 'supported', 'unsupported'),
      c('c4', 'BigQuery export supported?', 'Nightly scheduled sync to BigQuery is supported.', 'Yes, automatic nightly sync to BigQuery.', 'Requires a custom Python SDK script.', 'supported', 'unsupported'),
      c('c5', 'EU data hosting location?', 'EU data isolated in Frankfurt (eu-central-1).', 'All EU data is stored in Frankfurt.', 'Data is mirrored in US-East and Singapore.', 'supported', 'unsupported'),
      c('c6', 'Max file upload size?', '50MB on Pro, 500MB on Enterprise.', 'Pro: 50MB, Enterprise: 500MB.', 'Uploads are unlimited for all accounts.', 'supported', 'unsupported'),
      c('c7', 'HIPAA BAA available?', 'BAAs signed for Healthcare Enterprise tier.', 'Yes, BAAs available for Healthcare Enterprise.', 'Not HIPAA certified, cannot sign BAAs.', 'supported', 'unsupported'),
      c('c8', 'Seat billing during mid-cycle expansion?', 'Seats prorated to remaining days.', 'New seats are prorated to remaining days.', 'Full month is charged regardless of join date.', 'supported', 'unsupported'),
      c('c9', 'Free accounts get custom subdomains?', 'Subdomains restricted to paid Starter/Growth plans.', 'Yes, any free account can claim one.', 'Subdomains are exclusive to Starter and Growth.', 'unsupported', 'supported'),
      c('c10', 'Is MFA mandatory?', 'Optional on Free/Starter, enforced on Enterprise.', 'MFA is optional across all tiers.', 'MFA is strictly enforced for Enterprise orgs.', 'unsupported', 'supported'),
      c('c11', 'REST API rate limit?', '60 req/min Free, 600 req/min Pro.', 'No rate limits, burst up to 10k rps.', '60 req/min Free, 600 req/min Pro.', 'unsupported', 'supported'),
      c('c12', 'Can deleted workspaces be restored?', 'Soft-deleted for 14 days before purge.', 'Deleted workspaces are destroyed instantly, unrecoverable.', 'A 14-day grace period allows restoration.', 'unsupported', 'supported'),
      c('c13', 'What export formats are supported?', 'CSV, JSON, and Parquet on all paid tiers.', 'CSV and JSON export are supported.', 'Only CSV export is supported.', 'incomplete', 'unsupported', { system: 'a', label: 'supported' }),
      c('c14', 'Password reset link rules?', 'Expires in 24h, resendable up to 3x/day.', 'The reset link expires in 24 hours.', 'The reset link never expires.', 'incomplete', 'unsupported'),
      c('c15', 'SSO providers supported?', 'SAML+OAuth2 for Enterprise; SAML also on Growth.', 'SAML and OAuth2 SSO for Enterprise.', 'SAML for Growth and Enterprise; OAuth2 for Enterprise, matching policy exactly.', 'incomplete', 'supported'),
      c('c16', 'Backup frequency and retention?', 'Nightly backups (30-day) + hourly snapshots (24h).', 'Nightly backups are retained for 30 days.', 'No backups are taken at all.', 'incomplete', 'unsupported', { system: 'a', label: 'supported' }),
      c('c17', 'Team roles and billing access?', 'Admin/Editor/Viewer; only Admin manages billing.', 'Admin, Editor, and Viewer roles exist.', 'Any role can manage billing.', 'incomplete', 'unsupported'),
      c('c18', 'Data retention after cancellation?', 'Retained 90 days post-cancellation, then deleted.', 'Data is retained 90 days, then permanently deleted.', 'Data is deleted immediately on cancellation.', 'supported', 'unsupported'),
      c('c19', 'Custom domain SSL cost?', 'Free auto-renewing SSL for custom domains.', 'Custom domains get free auto-renewing SSL.', 'SSL certificates must be purchased separately.', 'supported', 'unsupported'),
      c('c20', 'Audit log retention by tier?', '1 year Enterprise, 30 days Pro.', 'Audit logs are retained 1 year on Enterprise.', 'Audit logs are unavailable on any tier.', 'incomplete', 'unsupported', { system: 'a', label: 'supported' }),
      c('c21', 'Current API version status?', 'v1 deprecated Dec 2025; v2 is current, read-only backward compatible.', 'v2 is the current API version, fully backward compatible for reads and writes with v1.', 'v2 is the current API version.', 'supported', 'incomplete'),
      c('c22', 'Support SLA by tier?', '1-hour critical / 4-hour standard on Enterprise.', '1-hour SLA for critical, 4-hour for standard on Enterprise.', 'All tickets answered within 1 hour, any tier.', 'supported', 'unsupported'),
      c('c23', 'Data encryption approach?', 'AES-256 at rest, TLS 1.2+ in transit.', 'Data is encrypted at rest (AES-256) and in transit (TLS 1.2+).', 'Data is encrypted at rest with AES-256.', 'supported', 'incomplete'),
      c('c24', 'Free trial length and extensions?', '14-day trial, extendable once by 7 days via support.', '14-day free trial, extendable once by 7 days on request.', '14-day free trial.', 'supported', 'incomplete'),
    ];
  }

  if (variant === 'intermediate') {
    return [
      c('c1', 'Return window for electronics?', '30 days with receipt.', '30 days with a receipt required.', '45 days, no receipt needed.', 'supported', 'unsupported'),
      c('c2', 'Refurb laptop warranty?', '1-year warranty on certified refurb units.', '1-year limited warranty on certified refurb.', '6-month warranty on refurbished units.', 'supported', 'unsupported'),
      c('c3', 'Enterprise phone support hours?', '24/7 phone and Slack for Enterprise.', '24/7 phone and Slack support.', 'Phone support 8am-8pm only.', 'supported', 'unsupported'),
      c('c4', 'BigQuery sync cadence?', 'Nightly scheduled sync.', 'Automatic nightly sync.', 'Hourly sync via manual trigger.', 'supported', 'unsupported'),
      c('c5', 'EU hosting region?', 'Frankfurt (eu-central-1).', 'Frankfurt region.', 'Dublin (eu-west-1) region.', 'supported', 'unsupported'),
      c('c6', 'Upload size caps?', '50MB Pro / 500MB Enterprise.', 'Pro 50MB, Enterprise 500MB.', 'Pro 100MB, Enterprise 500MB.', 'supported', 'unsupported'),
      c('c7', 'HIPAA BAA scope?', 'Healthcare Enterprise tier only.', 'Available for Healthcare Enterprise.', 'Available for any Enterprise plan.', 'supported', 'unsupported'),
      c('c8', 'Seat proration rule?', 'Prorated to remaining cycle days.', 'Prorated to the remaining days.', 'Prorated to remaining weeks, rounded up.', 'supported', 'unsupported'),
      c('c9', 'Free subdomain eligibility?', 'Paid Starter/Growth only.', 'Available on Free tier too.', 'Starter and Growth plans only.', 'unsupported', 'supported'),
      c('c10', 'MFA enforcement policy?', 'Optional Free/Starter, enforced Enterprise.', 'Optional on every tier.', 'Enforced on Enterprise organizations.', 'unsupported', 'supported'),
      c('c11', 'API rate limits?', '60/min Free, 600/min Pro.', 'No limits at all.', '60/min Free, 600/min Pro.', 'unsupported', 'supported'),
      c('c12', 'Workspace restore window?', '14-day soft-delete grace period.', 'Deleted instantly, unrecoverable.', '14-day grace period before purge.', 'unsupported', 'supported'),
      c('c13', 'Export formats offered?', 'CSV, JSON, Parquet on paid tiers.', 'CSV and JSON only.', 'CSV export only, no JSON.', 'incomplete', 'unsupported'),
      c('c14', 'Reset link expiry/resend?', 'Expires 24h, resend up to 3x/day.', 'Expires in 24 hours.', 'Expires in 7 days.', 'incomplete', 'unsupported'),
      c('c15', 'SSO coverage by tier?', 'SAML+OAuth2 Enterprise, SAML also Growth.', 'SAML and OAuth2 for Enterprise.', 'SAML for Growth and Enterprise; OAuth2 Enterprise only — matches policy.', 'incomplete', 'supported', { system: 'a', label: 'supported' }),
      c('c16', 'Backup schedule detail?', 'Nightly (30-day) + hourly snapshots (24h).', 'Nightly backups, 30-day retention.', 'Weekly backups, 90-day retention.', 'incomplete', 'unsupported'),
      c('c17', 'Billing role restriction?', 'Only Admin manages billing.', 'Admin/Editor/Viewer roles exist.', 'Editor role can also manage billing.', 'incomplete', 'unsupported'),
      c('c18', 'Post-cancel data retention?', '90 days, then deleted.', 'Retained 90 days, then deleted.', 'Retained 30 days, then deleted.', 'supported', 'unsupported'),
      c('c19', 'Custom domain SSL cost?', 'Free auto-renewing SSL included.', 'Free auto-renewing SSL certificates.', 'SSL costs an additional annual fee.', 'supported', 'unsupported'),
      c('c20', 'Audit log retention?', '1 year Enterprise / 30 days Pro.', '1 year on Enterprise tier.', '90 days on Enterprise tier.', 'incomplete', 'unsupported'),
      c('c21', 'API version support?', 'v1 deprecated Dec 2025, v2 read-only compatible.', 'v2 is current and fully backward compatible for reads and writes.', 'v2 is current.', 'supported', 'incomplete'),
      c('c22', 'Support SLA tiers?', '1h critical / 4h standard, Enterprise.', '1h critical, 4h standard on Enterprise.', '2h critical, 6h standard on Enterprise.', 'supported', 'unsupported'),
      c('c23', 'Encryption standards?', 'AES-256 at rest, TLS 1.2+ in transit.', 'AES-256 at rest and TLS 1.2+ in transit.', 'AES-256 at rest only.', 'supported', 'incomplete'),
      c('c24', 'Trial length/extension?', '14 days, one 7-day extension via support.', '14-day trial, one 7-day extension available.', '14-day trial, no extensions.', 'supported', 'incomplete'),
    ];
  }

  // challenge — System B is a deliberately weak fallback model: every one of its 24
  // responses is authored as unsupported or incomplete (never supported), so the
  // metrics for System B specifically exercise the "no positive cases" / N/A path.
  return [
    c('c1', 'Return window for electronics?', '30 days with receipt.', '30 days with receipt required.', 'Returns accepted any time, no limit.', 'supported', 'unsupported'),
    c('c2', 'Refurb laptop warranty?', '1-year warranty on certified refurb.', '1-year limited warranty included.', 'Warranty length is at the manager\'s discretion.', 'supported', 'unsupported'),
    c('c3', 'Enterprise phone support?', '24/7 phone and Slack, Enterprise.', '24/7 phone and Slack support.', 'Phone support was 24/7 as of last year\'s policy (since narrowed to business hours).', 'supported', 'unsupported'),
    c('c4', 'BigQuery sync cadence?', 'Nightly scheduled sync.', 'Nightly automatic sync.', 'Sync frequency depends on unspecified account settings.', 'supported', 'incomplete'),
    c('c5', 'EU hosting region?', 'Frankfurt (eu-central-1).', 'Frankfurt region.', 'Likely somewhere in the EU, exact region not published.', 'supported', 'incomplete'),
    c('c6', 'Upload size caps?', '50MB Pro / 500MB Enterprise.', 'Pro 50MB, Enterprise 500MB.', 'Caps probably scale with plan tier, exact numbers unclear.', 'supported', 'incomplete'),
    c('c7', 'HIPAA BAA scope?', 'Healthcare Enterprise tier only.', 'Available for Healthcare Enterprise.', 'HIPAA support was announced but the rollout tier is unconfirmed.', 'supported', 'incomplete'),
    c('c8', 'Seat proration rule?', 'Prorated to remaining cycle days.', 'Prorated to remaining days in cycle.', 'Billing adjusts automatically, mechanism unspecified.', 'supported', 'incomplete'),
    c('c9', 'Free subdomain eligibility?', 'Paid Starter/Growth only.', 'Available on Free tier too.', 'Subdomains were free-tier eligible last quarter (policy has since changed).', 'unsupported', 'unsupported'),
    c('c10', 'MFA enforcement policy?', 'Optional Free/Starter, enforced Enterprise.', 'Optional on every tier.', 'MFA is being considered for a future release.', 'unsupported', 'incomplete'),
    c('c11', 'API rate limits?', '60/min Free, 600/min Pro.', 'No limits at all.', 'Rate limits exist but the exact thresholds were not published this quarter.', 'unsupported', 'incomplete'),
    c('c12', 'Workspace restore window?', '14-day soft-delete grace period.', 'Deleted instantly, unrecoverable.', 'Some grace period likely applies, duration unconfirmed.', 'unsupported', 'incomplete'),
    c('c13', 'Export formats offered?', 'CSV, JSON, Parquet on paid tiers.', 'CSV and JSON only.', 'CSV export only, JSON was deprecated last year (still active today).', 'incomplete', 'unsupported'),
    c('c14', 'Reset link expiry/resend?', 'Expires 24h, resend up to 3x/day.', 'Expires in 24 hours.', 'Reset links used to last 7 days (shortened since to 24h).', 'incomplete', 'unsupported'),
    c('c15', 'SSO coverage by tier?', 'SAML+OAuth2 Enterprise, SAML also Growth.', 'SAML and OAuth2 for Enterprise.', 'SSO rollout to Growth tier is planned, not yet confirmed live.', 'incomplete', 'incomplete', { system: 'a', label: 'supported' }),
    c('c16', 'Backup schedule detail?', 'Nightly (30-day) + hourly snapshots (24h).', 'Nightly backups, 30-day retention.', 'Backups run on some schedule; hourly snapshots were removed last release (still active).', 'incomplete', 'unsupported'),
    c('c17', 'Billing role restriction?', 'Only Admin manages billing.', 'Admin/Editor/Viewer roles exist.', 'Role permissions are configurable per workspace, specifics vary.', 'incomplete', 'incomplete', { system: 'a', label: 'supported' }),
    c('c18', 'Post-cancel data retention?', '90 days, then deleted.', 'Retained 90 days, then deleted.', 'Data used to be deleted immediately on cancellation (now retained 90 days).', 'supported', 'unsupported'),
    c('c19', 'Custom domain SSL cost?', 'Free auto-renewing SSL included.', 'Free auto-renewing SSL certificates.', 'SSL was a paid add-on in the previous pricing model (now bundled free).', 'supported', 'unsupported'),
    c('c20', 'Audit log retention?', '1 year Enterprise / 30 days Pro.', '1 year on Enterprise tier.', 'Retention window scales with plan, exact days not confirmed.', 'incomplete', 'incomplete'),
    c('c21', 'API version support?', 'v1 deprecated Dec 2025, v2 read-only compatible.', 'v2 is current, backward compatible for reads only.', 'v2 is fully backward compatible for both reads and writes.', 'supported', 'unsupported'),
    c('c22', 'Support SLA tiers?', '1h critical / 4h standard, Enterprise.', '1h critical, 4h standard on Enterprise.', 'SLA commitments are best-effort and not contractually fixed.', 'supported', 'incomplete'),
    c('c23', 'Encryption standards?', 'AES-256 at rest, TLS 1.2+ in transit.', 'AES-256 at rest and TLS 1.2+ in transit.', 'Encryption in transit used to be TLS 1.0 (upgraded since to 1.2+).', 'supported', 'unsupported'),
    c('c24', 'Trial length/extension?', '14 days, one 7-day extension via support.', '14-day trial, one 7-day extension available.', 'Trial length varies by promotion, current default not confirmed.', 'supported', 'incomplete'),
  ];
}

type Binary = 'positive' | 'negative';
function toBinary(label: Label3 | undefined): Binary | undefined {
  if (!label) return undefined;
  return label === 'supported' ? 'positive' : 'negative';
}

interface Annotations { [caseId: string]: { a?: Label3; b?: Label3 }; }

interface Metrics { tp: number; fp: number; fn: number; tn: number; skipped: number; precision: number | null; recall: number | null; f1: number | null; }

function computeMetrics(cases: CaseItem[], annotations: Annotations, system: SystemKey): Metrics {
  let tp = 0, fp = 0, fn = 0, tn = 0, skipped = 0;
  cases.forEach((item) => {
    const gold = system === 'a' ? item.goldA : item.goldB;
    const predicted = annotations[item.id]?.[system];
    if (!predicted) { skipped++; return; }
    const actual = toBinary(gold);
    const pred = toBinary(predicted);
    if (pred === 'positive' && actual === 'positive') tp++;
    else if (pred === 'positive' && actual === 'negative') fp++;
    else if (pred === 'negative' && actual === 'positive') fn++;
    else tn++;
  });
  const precision = (tp + fp) > 0 ? tp / (tp + fp) : null;
  const recall = (tp + fn) > 0 ? tp / (tp + fn) : null;
  const f1 = (precision !== null && recall !== null && (precision + recall) > 0) ? (2 * precision * recall) / (precision + recall) : null;
  return { tp, fp, fn, tn, skipped, precision, recall, f1 };
}

function fmtPct(v: number | null): string { return v === null ? 'N/A' : `${(v * 100).toFixed(1)}%`; }

export default function AiEvaluationCasebookLab({ variant, onDirty, onSubmit }: Props) {
  const cases = useMemo(() => buildCases(variant), [variant]);
  const { state: annotations, set: setAnnotations, undo, redo, reset, canUndo, canRedo } = useUndoableState<Annotations>({});
  const [selectedCaseId, setSelectedCaseId] = useState<string>(cases[0].id);
  const [releaseDecision, setReleaseDecision] = useState<'hold' | 'conditional' | 'deploy'>('hold');
  const [releaseMemo, setReleaseMemo] = useState<string>(
    'System A stays grounded in the reference facts across most cases and only drifts on partial answers. System B fabricates or omits key details far more often — hold System B and consider a conditional pilot for System A pending disagreement review.'
  );

  const activeCase = cases.find((cs) => cs.id === selectedCaseId) ?? cases[0];

  const handleLabel = (caseId: string, system: SystemKey, label: Label3) => {
    setAnnotations((prev) => ({ ...prev, [caseId]: { ...prev[caseId], [system]: label } }));
    onDirty();
  };

  const metricsA = useMemo(() => computeMetrics(cases, annotations, 'a'), [cases, annotations]);
  const metricsB = useMemo(() => computeMetrics(cases, annotations, 'b'), [cases, annotations]);

  const disagreementLog = useMemo(() => {
    const log: { caseId: string; system: SystemKey; learnerLabel: Label3; reviewerLabel: Label3 }[] = [];
    cases.forEach((item) => {
      if (!item.secondReviewer) return;
      const learnerLabel = annotations[item.id]?.[item.secondReviewer.system];
      if (learnerLabel && learnerLabel !== item.secondReviewer.label) {
        log.push({ caseId: item.id, system: item.secondReviewer.system, learnerLabel, reviewerLabel: item.secondReviewer.label });
      }
    });
    return log;
  }, [cases, annotations]);

  const errorBarChart = {
    labels: ['False Positives', 'False Negatives', 'Skipped'],
    a: [metricsA.fp, metricsA.fn, metricsA.skipped],
    b: [metricsB.fp, metricsB.fn, metricsB.skipped],
  };

  const radarSeries = [
    { label: 'System A', data: [(metricsA.precision ?? 0) * 100, (metricsA.recall ?? 0) * 100, (metricsA.f1 ?? 0) * 100, ((cases.length - metricsA.skipped) / cases.length) * 100] },
    { label: 'System B', data: [(metricsB.precision ?? 0) * 100, (metricsB.recall ?? 0) * 100, (metricsB.f1 ?? 0) * 100, ((cases.length - metricsB.skipped) / cases.length) * 100] },
  ];

  const handleExportCsv = () => {
    downloadCsv('ai_eval_casebook_annotations.csv', cases.map((cs) => ({
      case_id: cs.id, prompt: cs.prompt,
      gold_a: cs.goldA, learner_a: annotations[cs.id]?.a ?? 'SKIPPED', match_a: annotations[cs.id]?.a === cs.goldA ? 'YES' : 'NO',
      gold_b: cs.goldB, learner_b: annotations[cs.id]?.b ?? 'SKIPPED', match_b: annotations[cs.id]?.b === cs.goldB ? 'YES' : 'NO',
    })));
  };
  const handleExportJson = () => {
    downloadJson('ai_eval_casebook_summary.json', { variant, totalCases: cases.length, metricsA, metricsB, disagreementLog, releaseDecision, releaseMemo });
  };

  const handleFinalSubmit = () => {
    onSubmit({
      variant,
      totalCases: cases.length,
      annotations,
      metricsA,
      metricsB,
      disagreementLog,
      releaseDecision,
      releaseMemo,
    });
  };

  const LabelButtons = ({ caseId, system }: { caseId: string; system: SystemKey }) => {
    const current = annotations[caseId]?.[system];
    return (
      <div className="flex items-center gap-1">
        {(['supported', 'unsupported', 'incomplete'] as Label3[]).map((lab) => (
          <button key={lab} onClick={() => handleLabel(caseId, system, lab)}
            className={`text-[9px] px-1.5 py-0.5 rounded font-medium transition ${current === lab
              ? (lab === 'supported' ? 'bg-emerald-600 text-white font-bold' : lab === 'unsupported' ? 'bg-rose-600 text-white font-bold' : 'bg-amber-600 text-white font-bold')
              : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
            {lab === 'supported' ? 'Sup' : lab === 'unsupported' ? 'Uns' : 'Inc'}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Lab 08 • Responsible AI &amp; LLM Evaluation
            </span>
            <h2 className="text-xl font-bold text-white mt-2">AI Evaluation Casebook &amp; Faithfulness Metrics</h2>
            <p className="text-sm text-slate-400 mt-1">
              Annotate {cases.length} authored responses from two systems against reference facts. Undefined ratios (no positive predictions/actuals) display N/A rather than 0%.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={undo} disabled={!canUndo} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 disabled:opacity-30"><Undo2 className="w-3.5 h-3.5" /></button>
            <button type="button" onClick={redo} disabled={!canRedo} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 disabled:opacity-30"><Redo2 className="w-3.5 h-3.5" /></button>
            <button type="button" onClick={() => { reset(); onDirty(); }} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white"><RotateCcw className="w-3.5 h-3.5" /></button>
            <button onClick={handleExportCsv} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1"><Download className="w-3 h-3" />CSV</button>
            <button onClick={handleExportJson} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1"><FileJson className="w-3 h-3" />JSON</button>
            <button onClick={handleFinalSubmit} className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-lg shadow-emerald-600/20 flex items-center gap-1">
              <Send className="w-3 h-3" />Submit
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[{ label: 'System A', m: metricsA }, { label: 'System B', m: metricsB }].map(({ label, m }) => (
          <div key={label} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="text-xs font-bold text-white">{label} — Confusion Matrix</div>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <div className="p-2 rounded bg-emerald-950/30 border border-emerald-800/30 text-emerald-200">TP: {m.tp}</div>
              <div className="p-2 rounded bg-rose-950/30 border border-rose-800/30 text-rose-200">FP: {m.fp}</div>
              <div className="p-2 rounded bg-amber-950/30 border border-amber-800/30 text-amber-200">FN: {m.fn}</div>
              <div className="p-2 rounded bg-slate-800/60 border border-slate-700 text-slate-300">TN: {m.tn}</div>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 pt-1">
              <span>Precision: <strong className="text-cyan-400">{fmtPct(m.precision)}</strong></span>
              <span>Recall: <strong className="text-indigo-400">{fmtPct(m.recall)}</strong></span>
              <span>Skipped: <strong className="text-slate-300">{m.skipped}</strong></span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2"><ClipboardList className="w-4 h-4 text-emerald-400" />Annotation Grid ({cases.length} cases)</h3>
          </div>
          <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
            {cases.map((cs) => {
              const isSelected = cs.id === selectedCaseId;
              return (
                <div key={cs.id} onClick={() => setSelectedCaseId(cs.id)}
                  className={`p-2.5 rounded-xl border transition cursor-pointer ${isSelected ? 'bg-slate-800/90 border-cyan-500/50' : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'}`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono font-bold text-slate-400 w-8">{cs.id.toUpperCase()}</span>
                    <span className="text-[11px] text-slate-200 truncate flex-1">{cs.prompt}</span>
                    <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <span className="text-[9px] text-slate-500">A:</span>
                      <LabelButtons caseId={cs.id} system="a" />
                      <span className="text-[9px] text-slate-500">B:</span>
                      <LabelButtons caseId={cs.id} system="b" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><ScanEye className="w-4 h-4 text-cyan-400" />Inspection: {activeCase.id.toUpperCase()}</h3>
            <div className="space-y-3 text-xs">
              <div><label className="text-slate-400 font-semibold uppercase tracking-wider block mb-1">Prompt</label>
                <div className="p-2.5 rounded-lg bg-slate-800/80 text-slate-200 border border-slate-700/50">{activeCase.prompt}</div></div>
              <div><label className="text-emerald-400 font-semibold uppercase tracking-wider block mb-1">Reference Fact</label>
                <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-800/40 text-emerald-200">{activeCase.groundTruth}</div></div>
              <div><label className="text-cyan-400 font-semibold uppercase tracking-wider block mb-1">System A Response</label>
                <div className="p-3 rounded-lg bg-slate-950/80 border border-cyan-800/40 text-slate-200">{activeCase.systemA}</div></div>
              <div><label className="text-rose-400 font-semibold uppercase tracking-wider block mb-1">System B Response</label>
                <div className="p-3 rounded-lg bg-slate-950/80 border border-rose-800/40 text-slate-200">{activeCase.systemB}</div></div>
            </div>
          </div>

          <ChartFrame title="Error Categories by System" icon={<ClipboardList className="w-4 h-4 text-purple-400" />}
            tableHeaders={['Category', 'System A', 'System B']}
            tableRows={errorBarChart.labels.map((l, i) => [l, errorBarChart.a[i], errorBarChart.b[i]])}>
            <CompareBarChart labels={errorBarChart.labels} series={[{ label: 'System A', data: errorBarChart.a }, { label: 'System B', data: errorBarChart.b }]} yLabel="Cases" />
          </ChartFrame>

          <ChartFrame title="Precision / Recall / F1 / Coverage (%)" icon={<ScanEye className="w-4 h-4 text-purple-400" />}
            tableHeaders={['System', 'Precision', 'Recall', 'F1', 'Coverage']}
            tableRows={[['System A', fmtPct(metricsA.precision), fmtPct(metricsA.recall), fmtPct(metricsA.f1), `${(((cases.length - metricsA.skipped) / cases.length) * 100).toFixed(0)}%`], ['System B', fmtPct(metricsB.precision), fmtPct(metricsB.recall), fmtPct(metricsB.f1), `${(((cases.length - metricsB.skipped) / cases.length) * 100).toFixed(0)}%`]]}>
            <CompareRadarChart axes={['Precision', 'Recall', 'F1', 'Coverage']} series={radarSeries} max={100} />
          </ChartFrame>

          {disagreementLog.length > 0 && (
            <div className="bg-slate-900/80 border border-amber-800/40 rounded-2xl p-4 space-y-1">
              <h3 className="text-xs font-semibold text-amber-300">Disagreement Log ({disagreementLog.length})</h3>
              {disagreementLog.map((d, i) => (
                <p key={i} className="text-[11px] text-slate-400">{d.caseId.toUpperCase()} (system {d.system.toUpperCase()}): you said <strong className="text-slate-200">{d.learnerLabel}</strong>, second reviewer said <strong className="text-slate-200">{d.reviewerLabel}</strong></p>
              ))}
            </div>
          )}

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Model Governance &amp; Deployment Gate</h3>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {(['hold', 'conditional', 'deploy'] as const).map((d) => (
                <button key={d} onClick={() => { setReleaseDecision(d); onDirty(); }}
                  className={`py-1.5 text-xs font-semibold rounded-lg border transition ${releaseDecision === d ? (d === 'hold' ? 'bg-rose-500/20 border-rose-500 text-rose-300' : d === 'conditional' ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'bg-emerald-500/20 border-emerald-500 text-emerald-300') : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                  {d === 'hold' ? 'Block / Hold' : d === 'conditional' ? 'Conditional Pilot' : 'Deploy to Prod'}
                </button>
              ))}
            </div>
            <textarea rows={3} value={releaseMemo} onChange={(e) => { setReleaseMemo(e.target.value); onDirty(); }}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              placeholder="Summarize disagreement rate and hallucination risk..." />
          </div>
        </div>
      </div>
    </div>
  );
}
