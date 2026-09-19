'use client';

import { useMemo, useState } from 'react';
import { LabScenarioVariant, LabDifficulty } from '@/lib/labs/types';
import { useUndoableState } from '@/lib/labs/useUndoableState';
import { downloadJson, downloadCsv } from '@/lib/labs/exportHelper';
import ChartFrame from '@/components/labs/charts/ChartFrame';
import CompareBarChart from '@/components/labs/charts/CompareBarChart';
import BreakdownDoughnutChart from '@/components/labs/charts/BreakdownDoughnutChart';
import {
  Undo2, Redo2, RotateCcw, Download, FileJson, Send, ShieldAlert, Tag, Clock, Users,
} from 'lucide-react';

interface Props {
  scenario?: LabScenarioVariant;
  variant: LabDifficulty;
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

type Verdict = 'benign' | 'suspicious' | 'critical_threat';
type Nature = 'benign_travel' | 'credential_stuffing' | 'phishing' | 'misleading_bec' | 'impossible_travel' | 'wfh_anomaly' | 'authorized_pentest' | 'insider_exfiltration';

interface SocAlert {
  id: string;
  timestamp: string;
  sourceIp: string;
  user: string;
  description: string;
  nature: Nature;
  displayUrl?: string;
}

interface EvidenceTag { id: string; label: string; relatesTo: string[]; }

type EscalationAction = 'monitor_only' | 'mark_false_positive' | 'request_more_evidence' | 'contain_account' | 'escalate_to_incident_response';

const ESCALATION_OPTIONS: Record<Verdict, { id: EscalationAction; label: string }[]> = {
  benign: [{ id: 'monitor_only', label: 'Monitor Only' }, { id: 'mark_false_positive', label: 'Mark False Positive' }],
  suspicious: [{ id: 'monitor_only', label: 'Monitor Only' }, { id: 'request_more_evidence', label: 'Request More Evidence' }, { id: 'contain_account', label: 'Contain Account' }],
  critical_threat: [{ id: 'contain_account', label: 'Contain Account' }, { id: 'escalate_to_incident_response', label: 'Escalate to Incident Response' }],
};

function buildScenario(variant: LabDifficulty): { alerts: SocAlert[]; evidence: EvidenceTag[] } {
  const base: SocAlert[] = [
    { id: 'alt-101', timestamp: '08:14', sourceIp: '198.51.100.24', user: 'cfo@company.com', description: 'Login from Tokyo IP. CFO travel itinerary is on file with IT.', nature: 'benign_travel' },
    { id: 'alt-102', timestamp: '08:19', sourceIp: '203.0.113.88', user: 'admin_svc', description: '42 consecutive failed SSH attempts, then successful sudo escalation from an unrecognized subnet.', nature: 'credential_stuffing' },
    { id: 'alt-103', timestamp: '08:24', sourceIp: '192.0.2.14', user: 'sales_rep1@company.com', description: 'Clicked a link in an email claiming "Urgent Wire Receipt Update".', nature: 'phishing', displayUrl: 'hxxp://pay-internal-portal[.]top' },
    { id: 'alt-104', timestamp: '08:31', sourceIp: '203.0.113.51', user: 'finance_ops@company.com', description: '"Q3 Vendor Invoice" email from billing@vendr-support.co requesting a bank-detail update.', nature: 'misleading_bec' },
  ];
  const evidence: EvidenceTag[] = [
    { id: 'ev1', label: 'IT Travel Approval #4471: CFO approved Tokyo trip Mar 3-10', relatesTo: ['alt-101'] },
    { id: 'ev2', label: 'HR Record: no travel filed for admin_svc this month', relatesTo: ['alt-102'] },
    { id: 'ev3', label: 'SSH Audit Log: 42 failed attempts from unrecognized subnet 203.0.113.0/24', relatesTo: ['alt-102'] },
    { id: 'ev4', label: 'DNS Sinkhole Log: pay-internal-portal[.]top registered 2 days ago', relatesTo: ['alt-103'] },
    { id: 'ev5', label: 'Domain WHOIS: vendr-support.co registered 5 days ago, mimics real vendor-support.co', relatesTo: ['alt-104'] },
    { id: 'ev6', label: 'Finance Policy: bank-detail changes require phone verification', relatesTo: ['alt-104'] },
  ];

  if (variant === 'beginner') return { alerts: base, evidence };

  const extra2: SocAlert[] = [
    { id: 'alt-105', timestamp: '09:02', sourceIp: '198.51.100.77', user: 'dev_ana@company.com', description: 'New-device login from a co-working space address.', nature: 'wfh_anomaly' },
    { id: 'alt-106', timestamp: '09:10', sourceIp: '203.0.113.140', user: 'ops_lee@company.com', description: 'Two successful logins 9,000km apart within 47 minutes.', nature: 'impossible_travel' },
  ];
  const extraEvidence2: EvidenceTag[] = [
    { id: 'ev7', label: 'WFH Policy Log: dev_ana approved to work from a co-working space this week', relatesTo: ['alt-105'] },
    { id: 'ev8', label: 'Geo-IP Report: the two login locations are physically impossible to reach in 47 minutes', relatesTo: ['alt-106'] },
    { id: 'ev9', label: 'Marketing Newsletter: office relocation announcement (unrelated to any alert)', relatesTo: [] },
  ];

  if (variant === 'intermediate') return { alerts: [...base, ...extra2], evidence: [...evidence, ...extraEvidence2] };

  const extra3: SocAlert[] = [
    { id: 'alt-107', timestamp: '09:45', sourceIp: '10.0.4.12', user: 'sec_eng1@company.com', description: 'WAF flagged repeated exploit-pattern requests from an internal engineer\'s workstation.', nature: 'authorized_pentest' },
    { id: 'alt-108', timestamp: '02:13', sourceIp: '10.0.9.4', user: 'admin_root@company.com', description: '2.3M customer records exported to an external USB device at 2am, no ticket on file.', nature: 'insider_exfiltration' },
  ];
  const extraEvidence3: EvidenceTag[] = [
    { id: 'ev10', label: 'Security Calendar: authorized penetration test window Mar 4-6, sec_eng1 assigned', relatesTo: ['alt-107'] },
    { id: 'ev11', label: 'DLP Log: 2.3M customer records exported to an external USB device', relatesTo: ['alt-108'] },
    { id: 'ev12', label: 'Change Ticket Queue: no export or maintenance ticket filed for this window', relatesTo: ['alt-108'] },
  ];
  return { alerts: [...base, ...extra2, ...extra3], evidence: [...evidence, ...extraEvidence2, ...extraEvidence3] };
}

interface CaseState {
  verdicts: Record<string, Verdict>;
  evidenceLinks: Record<string, string[]>;
  containedAccounts: string[];
  escalationActions: Record<string, EscalationAction>;
}

export default function DefensiveSocCaseLab({ variant, onDirty, onSubmit }: Props) {
  const { alerts, evidence } = useMemo(() => buildScenario(variant), [variant]);
  const { state, set, undo, redo, reset, canUndo, canRedo } = useUndoableState<CaseState>({ verdicts: {}, evidenceLinks: {}, containedAccounts: [], escalationActions: {} });
  const [selectedAlertId, setSelectedAlertId] = useState<string>(alerts[0].id);
  const [socReport, setSocReport] = useState<string>('');

  const activeAlert = alerts.find((a) => a.id === selectedAlertId) ?? alerts[0];
  const activeEvidenceLinks = state.evidenceLinks[activeAlert.id] ?? [];

  const setVerdict = (alertId: string, verdict: Verdict) => {
    set((prev) => ({ ...prev, verdicts: { ...prev.verdicts, [alertId]: verdict } }));
    onDirty();
  };
  const toggleEvidence = (alertId: string, evId: string) => {
    set((prev) => {
      const current = prev.evidenceLinks[alertId] ?? [];
      const next = current.includes(evId) ? current.filter((e) => e !== evId) : [...current, evId];
      return { ...prev, evidenceLinks: { ...prev.evidenceLinks, [alertId]: next } };
    });
    onDirty();
  };
  const containUser = (user: string) => {
    set((prev) => (prev.containedAccounts.includes(user) ? prev : { ...prev, containedAccounts: [...prev.containedAccounts, user] }));
    onDirty();
  };
  const setEscalation = (alertId: string, action: EscalationAction) => {
    set((prev) => ({ ...prev, escalationActions: { ...prev.escalationActions, [alertId]: action } }));
    onDirty();
  };

  const activeVerdict = state.verdicts[activeAlert.id];
  const canMarkCritical = activeEvidenceLinks.length > 0;

  const chronological = [...alerts].sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  const accountMap = useMemo(() => {
    const counts: Record<string, number> = {};
    alerts.forEach((a) => { counts[a.user] = (counts[a.user] || 0) + 1; });
    const users = Object.keys(counts);
    return { users, counts, statuses: users.map((u) => (state.containedAccounts.includes(u) ? 'critical' as const : null)) };
  }, [alerts, state.containedAccounts]);

  const classificationBreakdown = useMemo(() => {
    const buckets: Record<string, number> = { benign: 0, suspicious: 0, critical_threat: 0, unclassified: 0 };
    alerts.forEach((a) => { const v = state.verdicts[a.id]; buckets[v ?? 'unclassified']++; });
    return buckets;
  }, [alerts, state.verdicts]);

  const handleExportCsv = () => {
    downloadCsv('soc_triage_log.csv', alerts.map((a) => ({
      alert_id: a.id, timestamp: a.timestamp, user: a.user, ip: a.sourceIp,
      analyst_verdict: state.verdicts[a.id] || 'UNREVIEWED', evidence_linked: (state.evidenceLinks[a.id] || []).length,
      escalation: state.escalationActions[a.id] || 'NONE', contained: state.containedAccounts.includes(a.user) ? 'YES' : 'NO',
    })));
  };
  const handleExportJson = () => {
    downloadJson('soc_case_report.json', { variant, alerts: alerts.map((a) => ({ id: a.id, user: a.user, verdict: state.verdicts[a.id] })), containedAccounts: state.containedAccounts, socReport });
  };

  const handleFinalSubmit = () => {
    onSubmit({
      variant,
      alerts: alerts.map((a) => ({
        id: a.id, user: a.user, nature: a.nature,
        userVerdict: state.verdicts[a.id] ?? null,
        evidenceLinked: (state.evidenceLinks[a.id] ?? []).length,
        escalationAction: state.escalationActions[a.id] ?? null,
      })),
      containedAccounts: state.containedAccounts,
      totalAlerts: alerts.length,
      socReport,
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
              Lab 15 • Defensive Cyber Operations
            </span>
            <h2 className="text-xl font-bold text-white mt-2">Defensive SOC Case Lab &amp; Incident Containment</h2>
            <p className="text-sm text-slate-400 mt-1">
              Triage {alerts.length} synthetic alerts. Link evidence before classifying critical threats. All URLs shown are inert text — no simulation button ever sends a real network request.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={undo} disabled={!canUndo} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 disabled:opacity-30"><Undo2 className="w-3.5 h-3.5" /></button>
            <button type="button" onClick={redo} disabled={!canRedo} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 disabled:opacity-30"><Redo2 className="w-3.5 h-3.5" /></button>
            <button type="button" onClick={() => { reset(); onDirty(); }} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white"><RotateCcw className="w-3.5 h-3.5" /></button>
            <button onClick={handleExportCsv} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1"><Download className="w-3 h-3" />CSV</button>
            <button onClick={handleExportJson} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1"><FileJson className="w-3 h-3" />JSON</button>
            <button onClick={handleFinalSubmit} className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-500 text-white transition shadow-lg shadow-red-600/20 flex items-center gap-1">
              <Send className="w-3 h-3" />Submit
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2"><Clock className="w-4 h-4 text-red-400" />Chronological Event View</h3>
            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {chronological.map((alt) => {
                const isSelected = alt.id === selectedAlertId;
                const isContained = state.containedAccounts.includes(alt.user);
                const verdict = state.verdicts[alt.id];
                return (
                  <div key={alt.id} onClick={() => setSelectedAlertId(alt.id)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer ${isSelected ? 'bg-slate-800 border-red-500/50' : 'bg-slate-950/60 border-slate-800'}`}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-mono font-bold text-slate-300">{alt.timestamp} UTC • {alt.user}</span>
                      <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${verdict === 'critical_threat' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : verdict === 'benign' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : verdict === 'suspicious' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-700/40 text-slate-400 border border-slate-700'}`}>
                        {verdict ?? 'unreviewed'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{alt.description}</p>
                    {alt.displayUrl && <code className="text-[10px] text-slate-500 block mt-1">Inert text (not a link): {alt.displayUrl}</code>}
                    {isContained && <div className="mt-2 text-[11px] font-bold text-red-400">[CONTAINED] Session revoked &amp; MFA reset (simulated — no external call made)</div>}
                  </div>
                );
              })}
            </div>
          </div>

          <ChartFrame title="Fictional Account Map — Alerts per Account" icon={<Users className="w-4 h-4 text-red-400" />}
            tableHeaders={['Account', 'Alerts', 'Contained']}
            tableRows={accountMap.users.map((u, i) => [u, accountMap.counts[u], accountMap.statuses[i] ? 'YES' : 'NO'])}>
            <CompareBarChart labels={accountMap.users} series={[{ label: 'Alerts', data: accountMap.users.map((u) => accountMap.counts[u]), statusOverride: accountMap.statuses }]} horizontal yLabel="Alert count" />
          </ChartFrame>

          <ChartFrame title="Classification Breakdown" icon={<ShieldAlert className="w-4 h-4 text-red-400" />}
            tableHeaders={['Classification', 'Count']}
            tableRows={Object.entries(classificationBreakdown).map(([k, v]) => [k, v])}>
            <BreakdownDoughnutChart labels={Object.keys(classificationBreakdown)} values={Object.values(classificationBreakdown)} centerValue={`${alerts.length}`} centerLabel="Total Alerts" />
          </ChartFrame>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white">Analyst Workbench: {activeAlert.id}</h3>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" />Link Evidence Before Classifying</label>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {evidence.map((ev) => {
                  const linked = activeEvidenceLinks.includes(ev.id);
                  return (
                    <button key={ev.id} type="button" onClick={() => toggleEvidence(activeAlert.id, ev.id)}
                      className={`w-full text-left p-2 rounded-lg border text-[11px] transition ${linked ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-200' : 'bg-slate-950/60 border-slate-800 text-slate-400'}`}>
                      {linked ? '✓ ' : ''}{ev.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400 text-xs block">Classify Alert Severity</label>
              <div className="grid grid-cols-3 gap-2">
                {(['benign', 'suspicious', 'critical_threat'] as Verdict[]).map((verdict) => {
                  const disabled = verdict === 'critical_threat' && !canMarkCritical;
                  return (
                    <button key={verdict} type="button" disabled={disabled} onClick={() => setVerdict(activeAlert.id, verdict)}
                      title={disabled ? 'Link at least one evidence tag before marking critical' : undefined}
                      className={`py-2 text-xs font-semibold rounded-lg border capitalize transition disabled:opacity-30 disabled:cursor-not-allowed ${activeVerdict === verdict ? 'bg-slate-700 text-white font-bold border-slate-500' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                      {verdict.replace('_', ' ')}
                    </button>
                  );
                })}
              </div>
              {!canMarkCritical && <p className="text-[10px] text-amber-400">Link at least one evidence tag to unlock the &quot;critical threat&quot; classification.</p>}
            </div>

            {activeVerdict && (
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <label className="text-slate-400 text-xs block">Defensive Escalation Action</label>
                <div className="grid grid-cols-1 gap-1.5">
                  {ESCALATION_OPTIONS[activeVerdict].map((opt) => (
                    <button key={opt.id} type="button" onClick={() => { setEscalation(activeAlert.id, opt.id); if (opt.id === 'contain_account') containUser(activeAlert.user); }}
                      className={`py-2 rounded-lg text-xs font-semibold transition text-left px-3 ${state.escalationActions[activeAlert.id] === opt.id ? 'bg-red-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-slate-800">
              <label className="text-slate-400 block mb-1 text-xs">SOC Investigation Finding Memo</label>
              <textarea rows={4} value={socReport} onChange={(e) => { setSocReport(e.target.value); onDirty(); }}
                placeholder="Detail indicators of compromise (IoC), MITRE ATT&CK techniques, and blast radius..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 text-xs focus:outline-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
