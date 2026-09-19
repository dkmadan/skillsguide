'use client';

import React, { useMemo, useRef, useState } from 'react';
import { LabScenarioVariant, LabDifficulty } from '@/lib/labs/types';
import { useUndoableState } from '@/lib/labs/useUndoableState';
import { downloadCsv, downloadJson } from '@/lib/labs/exportHelper';
import ChartFrame from '@/components/labs/charts/ChartFrame';
import BreakdownDoughnutChart from '@/components/labs/charts/BreakdownDoughnutChart';
import SimClock from '@/components/labs/SimClock';
import { Undo2, Redo2, RotateCcw, FileJson, Download, PieChart as PieChartIcon } from 'lucide-react';

interface Props {
  scenario?: LabScenarioVariant;
  variant: LabDifficulty;
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

type Role = 'anonymous' | 'authenticated_student' | 'admin';
type FieldKey = 'courseId' | 'learnerEmail' | 'termsAccepted' | 'paymentMethod';

interface CourseRecord { courseId: string; title: string; }
interface EnrollmentRecord { courseId: string; learnerEmail: string; enrollmentId: string; }

// Three catalog/record-store fixtures with increasing size/ambiguity. Every
// tier already seeds at least one existing enrollment so the duplicate (409)
// path is reachable without any manual "cheat" toggle.
const COURSES: Record<LabDifficulty, CourseRecord[]> = {
  beginner: [
    { courseId: 'crs_fullstack_101', title: 'Full-Stack Foundations' },
    { courseId: 'crs_intro_101', title: 'Intro to Programming' },
  ],
  intermediate: [
    { courseId: 'crs_fullstack_101', title: 'Full-Stack Foundations' },
    { courseId: 'crs_intro_101', title: 'Intro to Programming' },
    { courseId: 'crs_backend_201', title: 'Backend Systems Design' },
  ],
  challenge: [
    { courseId: 'crs_fullstack_101', title: 'Full-Stack Foundations' },
    { courseId: 'crs_intro_101', title: 'Intro to Programming' },
    { courseId: 'crs_backend_201', title: 'Backend Systems Design' },
    { courseId: 'crs_capstone_301', title: 'Capstone Project Studio' },
  ],
};

const SEED_ENROLLMENTS: Record<LabDifficulty, EnrollmentRecord[]> = {
  beginner: [
    { courseId: 'crs_intro_101', learnerEmail: 'bob@example.com', enrollmentId: 'enr_seed1' },
  ],
  intermediate: [
    { courseId: 'crs_intro_101', learnerEmail: 'bob@example.com', enrollmentId: 'enr_seed1' },
    { courseId: 'crs_backend_201', learnerEmail: 'alex.chen@example.com', enrollmentId: 'enr_seed2' },
  ],
  challenge: [
    { courseId: 'crs_intro_101', learnerEmail: 'bob@example.com', enrollmentId: 'enr_seed1' },
    { courseId: 'crs_backend_201', learnerEmail: 'alex.chen@example.com', enrollmentId: 'enr_seed2' },
    { courseId: 'crs_capstone_301', learnerEmail: 'PRIYA@EXAMPLE.COM', enrollmentId: 'enr_seed3' }, // uppercase email — tests case-insensitive duplicate matching
  ],
};

const FIELD_DEFS: { key: FieldKey; label: string }[] = [
  { key: 'courseId', label: 'courseId' },
  { key: 'learnerEmail', label: 'learnerEmail' },
  { key: 'termsAccepted', label: 'termsAccepted' },
  { key: 'paymentMethod', label: 'paymentMethod' },
];

const FLOW_STAGES = ['UI Action', 'Auth Check', 'Field Validation', 'Duplicate Check', 'Record Store Write', 'Response'];

interface ApiState {
  httpMethod: 'POST' | 'GET' | 'PUT';
  apiEndpoint: string;
  requiredFields: Record<FieldKey, boolean>;
  rolePermissions: Record<Role, boolean>;
  enrollmentRecords: EnrollmentRecord[];
}

interface CallLogEntry {
  id: number;
  role: Role;
  courseId: string;
  learnerEmail: string;
  status: number;
  body: Record<string, unknown>;
}

export default function ApiFlowDesignerLab({ variant, onDirty, onSubmit }: Props) {
  const courses = COURSES[variant];
  const initialState: ApiState = {
    httpMethod: 'POST',
    apiEndpoint: '/api/v1/courses/enroll',
    requiredFields: { courseId: true, learnerEmail: true, termsAccepted: false, paymentMethod: false },
    rolePermissions: { anonymous: false, authenticated_student: true, admin: true },
    enrollmentRecords: SEED_ENROLLMENTS[variant],
  };
  const { state, set, undo, redo, reset, canUndo, canRedo, stepIndex } = useUndoableState<ApiState>(initialState);

  const [selectedRole, setSelectedRole] = useState<Role>('authenticated_student');
  const [courseIdInput, setCourseIdInput] = useState(courses[0].courseId);
  const [learnerEmailInput, setLearnerEmailInput] = useState('new.learner@example.com');
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [callLog, setCallLog] = useState<CallLogEntry[]>([]);
  const [notes, setNotes] = useState(
    'Anonymous requests are rejected with 401 before any validation runs. A missing courseId fails schema validation with 400. Re-submitting the same courseId + learnerEmail pair against the record store returns 409 Conflict instead of creating a second row.'
  );
  const [flowStep, setFlowStep] = useState(0);
  const maxFlowStepRef = useRef(0);

  const update = (patch: Partial<ApiState>) => {
    set((prev) => ({ ...prev, ...patch }));
    onDirty();
  };

  const dispatch = () => {
    const role = selectedRole;
    const payload: Record<FieldKey, string> = {
      courseId: courseIdInput.trim(),
      learnerEmail: learnerEmailInput.trim(),
      termsAccepted: termsAccepted ? 'true' : '',
      paymentMethod: paymentMethod.trim(),
    };

    let status: number;
    let body: Record<string, unknown>;

    if (!state.rolePermissions[role]) {
      status = 401;
      body = { error: 'Unauthorized', message: 'Authentication token required or role not permitted to enroll' };
    } else {
      const missing = FIELD_DEFS.filter((f) => state.requiredFields[f.key] && !payload[f.key]).map((f) => f.key);
      if (missing.length > 0) {
        status = 400;
        body = { error: 'Bad Request', message: `Missing required field(s): ${missing.join(', ')}` };
      } else {
        const dup = state.enrollmentRecords.some(
          (r) => r.courseId === payload.courseId && r.learnerEmail.toLowerCase() === payload.learnerEmail.toLowerCase()
        );
        if (dup) {
          status = 409;
          body = { error: 'Conflict', message: 'Learner is already enrolled in this course' };
        } else {
          const enrollmentId = `enr_${Date.now().toString(36)}`;
          status = 201;
          body = { enrollmentId, status: 'active', courseId: payload.courseId, email: payload.learnerEmail, enrolledAt: new Date().toISOString() };
          update({ enrollmentRecords: [...state.enrollmentRecords, { courseId: payload.courseId, learnerEmail: payload.learnerEmail, enrollmentId }] });
        }
      }
    }

    setCallLog((prev) => [...prev, { id: prev.length + 1, role, courseId: payload.courseId, learnerEmail: payload.learnerEmail, status, body }]);
    onDirty();
  };

  const statusCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    callLog.forEach((c) => { counts[c.status] = (counts[c.status] || 0) + 1; });
    return counts;
  }, [callLog]);

  const has201 = Boolean(statusCounts[201]);
  const has400 = Boolean(statusCounts[400]);
  const has401 = Boolean(statusCounts[401]);
  const has409 = Boolean(statusCounts[409]);

  // Duplicate proof: a genuine 409 requires an earlier 201 for the exact
  // same courseId + learnerEmail pair (not a manual toggle).
  const genuineDuplicateProof = useMemo(() => {
    return callLog.some((c) => {
      if (c.status !== 409) return false;
      return callLog.some((prior) => prior.status === 201 && prior.courseId === c.courseId && prior.learnerEmail.toLowerCase() === c.learnerEmail.toLowerCase());
    }) || SEED_ENROLLMENTS[variant].some((seed) => callLog.some((c) => c.status === 409 && c.courseId === seed.courseId && c.learnerEmail.toLowerCase() === seed.learnerEmail.toLowerCase()));
  }, [callLog, variant]);

  const handleAdvanceFlow = () => {
    setFlowStep((s) => {
      const next = Math.min(FLOW_STAGES.length - 1, s + 1);
      if (next > maxFlowStepRef.current) maxFlowStepRef.current = next;
      return next;
    });
    onDirty();
  };

  const handleExportContract = () => {
    downloadJson('api_flow_contract_schema.json', {
      variant,
      method: state.httpMethod,
      endpoint: state.apiEndpoint,
      requiredFields: state.requiredFields,
      rolePermissions: state.rolePermissions,
      statusCodesMapped: [201, 400, 401, 409],
    });
  };

  const handleExportFlowDiagram = () => {
    downloadJson('api_feature_flow_diagram.json', { variant, stages: FLOW_STAGES, endpoint: state.apiEndpoint, method: state.httpMethod });
  };

  const handleExportCallLogCsv = () => {
    downloadCsv('api_request_response_log.csv', callLog.map((c) => ({ call: c.id, role: c.role, courseId: c.courseId, learnerEmail: c.learnerEmail, status: c.status, body: JSON.stringify(c.body) })));
  };

  const handleFinalSubmit = () => {
    onSubmit({
      variant,
      httpMethod: state.httpMethod,
      apiEndpoint: state.apiEndpoint,
      requiredFields: state.requiredFields,
      rolePermissions: state.rolePermissions,
      statusesAchieved: { has201, has400, has401, has409 },
      genuineDuplicateProof,
      callLogCount: callLog.length,
      maxFlowStepReached: maxFlowStepRef.current,
      notes,
    });
  };

  const doughnutLabels = Object.keys(statusCounts).map((s) => `${s}`);
  const doughnutValues = Object.values(statusCounts);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">Lab 10 • Backend &amp; API Architecture</span>
            <h2 className="text-xl font-bold text-white mt-2">API &amp; Full-Stack Flow Designer</h2>
            <p className="text-sm text-slate-400 mt-1">Design and verify an idempotent course enrollment endpoint against a fictional record store. Map role permissions, required fields and HTTP status codes deterministically.</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={undo} disabled={!canUndo} title="Undo" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 disabled:opacity-30"><Undo2 className="w-4 h-4" /></button>
            <button type="button" onClick={redo} disabled={!canRedo} title="Redo" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 disabled:opacity-30"><Redo2 className="w-4 h-4" /></button>
            <button type="button" onClick={() => { reset(); setCallLog([]); setFlowStep(0); maxFlowStepRef.current = 0; onDirty(); }} title="Reset" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"><RotateCcw className="w-4 h-4" /></button>
            <button type="button" onClick={handleFinalSubmit} className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/20">Submit API Spec</button>
          </div>
        </div>
      </div>

      {/* Contract Verification Checklist */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Auth Check (401)', tested: has401 },
          { label: 'Missing Field (400)', tested: has400 },
          { label: 'Success Enroll (201)', tested: has201 },
          { label: 'Idempotent Dup (409)', tested: has409 && genuineDuplicateProof },
        ].map((st) => (
          <div key={st.label} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-medium">{st.label}</div>
              <div className={`text-sm font-bold mt-1 ${st.tested ? 'text-emerald-400' : 'text-slate-500'}`}>{st.tested ? 'VERIFIED' : 'PENDING'}</div>
            </div>
            <span className={`w-3 h-3 rounded-full ${st.tested ? 'bg-emerald-400 ring-4 ring-emerald-400/20' : 'bg-slate-700'}`} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Request Builder + Schema + Roles */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-indigo-400" />Simulated Request Builder</h3>
            <div className="space-y-3 text-xs">
              <div className="flex gap-2">
                <select value={state.httpMethod} onChange={(e) => update({ httpMethod: e.target.value as ApiState['httpMethod'] })}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 font-mono font-bold text-cyan-400 focus:outline-none">
                  <option value="POST">POST</option><option value="GET">GET</option><option value="PUT">PUT</option>
                </select>
                <input type="text" value={state.apiEndpoint} onChange={(e) => update({ apiEndpoint: e.target.value })}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 font-mono text-slate-200 focus:outline-none" />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Simulated User Role Context</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['anonymous', 'authenticated_student', 'admin'] as const).map((role) => (
                    <button key={role} type="button" onClick={() => setSelectedRole(role)}
                      className={`py-1.5 text-xs font-semibold rounded-lg border capitalize transition ${selectedRole === role ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                      {role.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="text-slate-400 block">Payload: courseId</label>
                <select value={courseIdInput} onChange={(e) => setCourseIdInput(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 font-mono text-slate-200 focus:outline-none">
                  <option value="">(blank — triggers 400)</option>
                  {courses.map((c) => <option key={c.courseId} value={c.courseId}>{c.courseId}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-slate-400 block">Payload: learnerEmail</label>
                <input type="email" value={learnerEmailInput} onChange={(e) => setLearnerEmailInput(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 font-mono text-slate-200 focus:outline-none" />
              </div>
              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 text-slate-300"><input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="accent-indigo-500 rounded" />termsAccepted</label>
                <input type="text" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} placeholder="paymentMethod" className="flex-1 bg-slate-950 border border-slate-700 rounded-lg p-1.5 font-mono text-slate-200 focus:outline-none" />
              </div>

              <button type="button" onClick={dispatch} className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition">Dispatch Test Call</button>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-white">Schema Form — Required Fields</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {FIELD_DEFS.map((f) => (
                <button key={f.key} type="button" onClick={() => update({ requiredFields: { ...state.requiredFields, [f.key]: !state.requiredFields[f.key] } })}
                  className={`p-2 rounded-lg border font-mono font-bold text-left ${state.requiredFields[f.key] ? 'bg-indigo-500/20 border-indigo-500 text-indigo-200' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                  {f.label} {state.requiredFields[f.key] ? '(required)' : '(optional)'}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-white">Role Permission Matrix — Can Enroll?</h3>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {(['anonymous', 'authenticated_student', 'admin'] as const).map((role) => (
                <button key={role} type="button" onClick={() => update({ rolePermissions: { ...state.rolePermissions, [role]: !state.rolePermissions[role] } })}
                  className={`p-2 rounded-lg border font-bold capitalize ${state.rolePermissions[role] ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'}`}>
                  {role.replace('_', ' ')}: {state.rolePermissions[role] ? 'Allowed' : 'Denied'}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-white">UI-to-API Feature Flow</h3>
            <SimClock label="Request Lifecycle" step={flowStep} maxStep={FLOW_STAGES.length - 1} stepLabel={(s) => FLOW_STAGES[s]} onAdvance={handleAdvanceFlow} onReset={() => setFlowStep(0)} />
            <div className="flex flex-wrap gap-2 text-[11px] font-mono">
              {FLOW_STAGES.map((stage, i) => (
                <span key={stage} className={`px-2 py-1 rounded-lg border ${i === flowStep ? 'bg-indigo-500/30 border-indigo-500 text-indigo-200' : i < flowStep ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>{stage}</span>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-white">Synthetic Enrollment Record Store ({state.enrollmentRecords.length})</h3>
            <div className="overflow-x-auto max-h-32 overflow-y-auto rounded-lg border border-slate-800">
              <table className="w-full text-left text-[11px] font-mono border-collapse">
                <thead><tr className="border-b border-slate-800 text-slate-400 bg-slate-950 sticky top-0"><th className="p-2">enrollmentId</th><th className="p-2">courseId</th><th className="p-2">learnerEmail</th></tr></thead>
                <tbody className="divide-y divide-slate-800">
                  {state.enrollmentRecords.map((r) => (<tr key={r.enrollmentId}><td className="p-2 text-indigo-300">{r.enrollmentId}</td><td className="p-2 text-slate-300">{r.courseId}</td><td className="p-2 text-slate-300">{r.learnerEmail}</td></tr>))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Response Inspector, chart, notes, exports */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Response Log ({callLog.length} calls)</h3>
            {callLog.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto font-mono text-xs">
                {[...callLog].reverse().map((c) => (
                  <div key={c.id} className="p-2 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">#{c.id} {c.role}</span>
                      <span className={`font-bold px-2 py-0.5 rounded ${c.status === 201 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : c.status === 409 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'}`}>{c.status}</span>
                    </div>
                    <pre className="text-[10px] text-slate-400 whitespace-pre-wrap">{JSON.stringify(c.body)}</pre>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs">Dispatch a request to inspect the simulated HTTP response.</div>
            )}
          </div>

          <ChartFrame title="Status Code Distribution" icon={<PieChartIcon className="w-4 h-4 text-indigo-400" />} tableHeaders={['Status', 'Count']} tableRows={doughnutLabels.map((l, i) => [l, doughnutValues[i]])}>
            <BreakdownDoughnutChart labels={doughnutLabels} values={doughnutValues} centerLabel="Calls" centerValue={String(callLog.length)} />
          </ChartFrame>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2">
            <label htmlFor="api-notes" className="text-xs font-extrabold text-white">API Contract Notes</label>
            <textarea id="api-notes" rows={4} value={notes} onChange={(e) => { setNotes(e.target.value); onDirty(); }}
              className="w-full text-xs p-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-indigo-500" />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button type="button" onClick={handleExportContract} className="flex items-center justify-center gap-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-[10px] font-bold"><FileJson className="w-3.5 h-3.5" />Contract</button>
            <button type="button" onClick={handleExportFlowDiagram} className="flex items-center justify-center gap-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-[10px] font-bold"><FileJson className="w-3.5 h-3.5" />Flow</button>
            <button type="button" onClick={handleExportCallLogCsv} className="flex items-center justify-center gap-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-[10px] font-bold"><Download className="w-3.5 h-3.5" />Log CSV</button>
          </div>

          <div className="text-[10px] text-slate-500 font-mono">History step {stepIndex}</div>
        </div>
      </div>
    </div>
  );
}
