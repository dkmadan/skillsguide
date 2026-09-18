'use client';

import React, { useState } from 'react';
import { LabScenarioVariant } from '@/lib/labs/types';
import { downloadJson, downloadCsv } from '@/lib/labs/exportHelper';

interface Props {
  scenario?: LabScenarioVariant;
  variant: 'beginner' | 'intermediate' | 'challenge';
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

interface SocAlert {
  id: string;
  timestamp: string;
  sourceIp: string;
  user: string;
  description: string;
  nature: 'benign_travel' | 'credential_stuffing' | 'phishing';
  userVerdict?: 'benign' | 'suspicious' | 'critical_threat';
}

export default function DefensiveSocCaseLab({ onDirty, onSubmit }: Props) {
  const [alerts, setAlerts] = useState<SocAlert[]>([
    { id: 'alt-101', timestamp: '08:14 UTC', sourceIp: '198.51.100.24', user: 'cfo@company.com', description: 'Login from Tokyo IP. Note: CFO has approved travel itinerary on file with IT desk.', nature: 'benign_travel', userVerdict: 'suspicious' }, // Misclassified initially
    { id: 'alt-102', timestamp: '08:19 UTC', sourceIp: '203.0.113.88', user: 'admin_svc', description: '42 consecutive failed SSH attempts followed by successful sudo privilege escalation from unknown subnet.', nature: 'credential_stuffing', userVerdict: 'suspicious' },
    { id: 'alt-103', timestamp: '08:24 UTC', sourceIp: '192.0.2.14', user: 'sales_rep1@company.com', description: 'Clicked link in email claiming "Urgent Wire Receipt Update" pointing to inert domain [hxxp://pay-internal-portal[.]top]', nature: 'phishing', userVerdict: 'suspicious' },
  ]);

  const [containedAccounts, setContainedAccounts] = useState<string[]>([]);
  const [selectedAlertId, setSelectedAlertId] = useState<string>('alt-101');
  const [socReport, setSocReport] = useState<string>('');

  const activeAlert = alerts.find(a => a.id === selectedAlertId) || alerts[0];

  const handleUpdateVerdict = (alertId: string, verdict: SocAlert['userVerdict']) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, userVerdict: verdict } : a));
    onDirty();
  };

  const handleContainUser = (user: string) => {
    if (!containedAccounts.includes(user)) {
      setContainedAccounts(prev => [...prev, user]);
      onDirty();
    }
  };

  const handleExportCsv = () => {
    const rows = alerts.map(a => ({
      alert_id: a.id,
      timestamp: a.timestamp,
      user: a.user,
      ip: a.sourceIp,
      analyst_verdict: a.userVerdict || 'UNREVIEWED',
      true_nature: a.nature,
      contained: containedAccounts.includes(a.user) ? 'YES' : 'NO'
    }));
    downloadCsv('soc_triage_log.csv', rows);
  };

  const handleExportJson = () => {
    downloadJson('soc_case_report.json', {
      alerts,
      containedAccounts,
      socReport
    });
  };

  const handleFinalSubmit = () => {
    onSubmit({
      alerts,
      containedAccounts,
      socReport
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
              Lab 15 • Defensive Cyber Operations
            </span>
            <h2 className="text-xl font-bold text-white mt-2">Defensive SOC Case Lab & Incident Containment</h2>
            <p className="text-sm text-slate-400 mt-1">
              Triage telemetry alerts into Benign, Suspicious, or Critical. Contain compromised identity accounts while avoiding false-positive business disruptions on approved executive travel.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              Export CSV
            </button>
            <button
              onClick={handleFinalSubmit}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-500 text-white transition shadow-lg shadow-red-600/20"
            >
              Submit SOC Triage
            </button>
          </div>
        </div>
      </div>

      {/* Alert Feed & Evidence Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Alert Table */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-semibold text-white">SIEM Real-Time Ingestion Queue</h3>

          <div className="space-y-2">
            {alerts.map(alt => {
              const isSelected = alt.id === selectedAlertId;
              const isContained = containedAccounts.includes(alt.user);
              return (
                <div
                  key={alt.id}
                  onClick={() => setSelectedAlertId(alt.id)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer ${
                    isSelected ? 'bg-slate-800 border-red-500/50' : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono font-bold text-slate-300">{alt.timestamp} • {alt.user}</span>
                    <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                      alt.userVerdict === 'critical_threat'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                        : alt.userVerdict === 'benign'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {alt.userVerdict}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{alt.description}</p>
                  {isContained && (
                    <div className="mt-2 text-[11px] font-bold text-red-400 flex items-center gap-1">
                      [CONTAINED] Okta session revoked & MFA challenge reset
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Investigation & Mitigation Actions */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white">Analyst Workbench: {activeAlert.id}</h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Classify Alert Severity</label>
              <div className="grid grid-cols-3 gap-2">
                {(['benign', 'suspicious', 'critical_threat'] as const).map(verdict => (
                  <button
                    key={verdict}
                    onClick={() => handleUpdateVerdict(activeAlert.id, verdict)}
                    className={`py-2 text-xs font-semibold rounded-lg border capitalize transition ${
                      activeAlert.userVerdict === verdict
                        ? 'bg-slate-700 text-white font-bold border-slate-500'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {verdict.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <label className="text-slate-400 block mb-1.5">Defensive Containment Action</label>
              <button
                onClick={() => handleContainUser(activeAlert.user)}
                disabled={containedAccounts.includes(activeAlert.user)}
                className={`w-full py-2 rounded-lg text-xs font-semibold transition ${
                  containedAccounts.includes(activeAlert.user)
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20'
                }`}
              >
                {containedAccounts.includes(activeAlert.user) ? 'Account Already Contained' : `Isolate & Revoke Session for ${activeAlert.user}`}
              </button>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <label className="text-slate-400 block mb-1">SOC Investigation Finding Memo</label>
              <textarea
                rows={3}
                value={socReport}
                onChange={e => { setSocReport(e.target.value); onDirty(); }}
                placeholder="Detail indicators of compromise (IoC), MITRE ATT&CK techniques, and blast radius..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 text-xs focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
