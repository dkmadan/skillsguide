'use client';

import React, { useState } from 'react';
import { LabScenarioVariant } from '@/lib/labs/types';
import { downloadJson } from '@/lib/labs/exportHelper';

interface Props {
  scenario?: LabScenarioVariant;
  variant: 'beginner' | 'intermediate' | 'challenge';
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

interface TestRequest {
  scenario: string;
  role: 'anonymous' | 'authenticated_student' | 'admin';
  payload: { courseId?: string; learnerEmail?: string; idempotencyKey?: string };
  expectedStatus: number;
}

export default function ApiFlowDesignerLab({ onDirty, onSubmit }: Props) {
  const [httpMethod, setHttpMethod] = useState<'POST' | 'GET' | 'PUT'>('POST');
  const [apiEndpoint, setApiEndpoint] = useState<string>('/api/v1/courses/enroll');
  const [selectedRole, setSelectedRole] = useState<'anonymous' | 'authenticated_student' | 'admin'>('authenticated_student');
  const [courseIdInput, setCourseIdInput] = useState<string>('crs_fullstack_101');
  const [learnerEmailInput, setLearnerEmailInput] = useState<string>('alex.chen@example.com');
  const [isDuplicateTest, setIsDuplicateTest] = useState<boolean>(false);

  // Flow designer response state
  const [mockResponse, setMockResponse] = useState<{
    status: number;
    body: Record<string, unknown>;
    latencyMs: number;
  } | null>(null);

  const [executedScenarios, setExecutedScenarios] = useState<Record<string, number>>({});

  // Deterministic contract test execution (No external networks or arbitrary calls)
  const handleTestCall = (overrideRole?: typeof selectedRole, overrideCourseId?: string, overrideDup?: boolean) => {
    const role = overrideRole || selectedRole;
    const course = overrideCourseId !== undefined ? overrideCourseId : courseIdInput;
    const dup = overrideDup !== undefined ? overrideDup : isDuplicateTest;

    let status = 200;
    let body: Record<string, unknown> = {};

    if (role === 'anonymous') {
      status = 401;
      body = { error: 'Unauthorized', message: 'Authentication token required' };
    } else if (!course || course.trim() === '') {
      status = 400;
      body = { error: 'Bad Request', message: 'courseId is a mandatory parameter' };
    } else if (dup) {
      status = 409;
      body = { error: 'Conflict', message: 'Learner is already enrolled in this course' };
    } else {
      status = 201;
      body = {
        enrollmentId: `enr_${Date.now().toString(36)}`,
        status: 'active',
        courseId: course,
        email: learnerEmailInput,
        enrolledAt: new Date().toISOString()
      };
    }

    setMockResponse({
      status,
      body,
      latencyMs: 38
    });

    const scenarioKey = `${role}_${course ? 'validCourse' : 'emptyCourse'}_${dup ? 'duplicate' : 'unique'}`;
    setExecutedScenarios(prev => ({ ...prev, [scenarioKey]: status }));
    onDirty();
  };

  const handleExportJson = () => {
    downloadJson('api_flow_contract_schema.json', {
      method: httpMethod,
      endpoint: apiEndpoint,
      executedScenarios,
      statusCodesMapped: [201, 400, 401, 409]
    });
  };

  const handleFinalSubmit = () => {
    onSubmit({
      httpMethod,
      apiEndpoint,
      executedScenarios,
      lastResponse: mockResponse
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Lab 10 • Backend & API Architecture
            </span>
            <h2 className="text-xl font-bold text-white mt-2">API & Full-Stack Flow Designer</h2>
            <p className="text-sm text-slate-400 mt-1">
              Design and verify an idempotent course enrollment endpoint. Map expected HTTP status codes (201 Created, 400 Bad Request, 401 Unauthorized, 409 Conflict) deterministically.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              Export Schema
            </button>
            <button
              onClick={handleFinalSubmit}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/20"
            >
              Submit API Spec
            </button>
          </div>
        </div>
      </div>

      {/* Contract Verification Checklist */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { key: 'anonymous', label: 'Auth Check (401)', tested: Object.keys(executedScenarios).some(k => k.includes('anonymous')) },
          { key: 'validation', label: 'Missing Field (400)', tested: Object.keys(executedScenarios).some(k => k.includes('emptyCourse')) },
          { key: 'success', label: 'Success Enroll (201)', tested: Object.keys(executedScenarios).some(k => executedScenarios[k] === 201) },
          { key: 'conflict', label: 'Idempotent Dup (409)', tested: Object.keys(executedScenarios).some(k => executedScenarios[k] === 409) },
        ].map(st => (
          <div key={st.key} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-medium">{st.label}</div>
              <div className={`text-sm font-bold mt-1 ${st.tested ? 'text-emerald-400' : 'text-slate-500'}`}>
                {st.tested ? 'VERIFIED' : 'PENDING'}
              </div>
            </div>
            <span className={`w-3 h-3 rounded-full ${st.tested ? 'bg-emerald-400 ring-4 ring-emerald-400/20' : 'bg-slate-700'}`} />
          </div>
        ))}
      </div>

      {/* API Builder & Flow Inspector Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Request Builder */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            Simulated Request Builder
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex gap-2">
              <select
                value={httpMethod}
                onChange={e => setHttpMethod(e.target.value as any)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 font-mono font-bold text-cyan-400 focus:outline-none"
              >
                <option value="POST">POST</option>
                <option value="GET">GET</option>
                <option value="PUT">PUT</option>
              </select>
              <input
                type="text"
                value={apiEndpoint}
                onChange={e => setApiEndpoint(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 font-mono text-slate-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Simulated User Role Context</label>
              <div className="grid grid-cols-3 gap-2">
                {(['anonymous', 'authenticated_student', 'admin'] as const).map(role => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`py-1.5 text-xs font-semibold rounded-lg border capitalize transition ${
                      selectedRole === role
                        ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    {role.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-slate-400 block">Payload: courseId</label>
              <input
                type="text"
                value={courseIdInput}
                onChange={e => setCourseIdInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 font-mono text-slate-200 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-slate-400 block">Payload: learnerEmail</label>
              <input
                type="email"
                value={learnerEmailInput}
                onChange={e => setLearnerEmailInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 font-mono text-slate-200 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="dupToggle"
                checked={isDuplicateTest}
                onChange={e => setIsDuplicateTest(e.target.checked)}
                className="accent-indigo-500 rounded"
              />
              <label htmlFor="dupToggle" className="text-slate-300 cursor-pointer">
                Simulate Duplicate Enrollment Record (Trigger 409 Conflict)
              </label>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => handleTestCall()}
                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition"
              >
                Dispatch Test Call
              </button>
              <button
                onClick={() => {
                  // Run full test suite automatically
                  handleTestCall('anonymous', 'crs_101', false);
                  handleTestCall('authenticated_student', '', false);
                  handleTestCall('authenticated_student', 'crs_101', false);
                  handleTestCall('authenticated_student', 'crs_101', true);
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium transition"
              >
                Run All 4 Checks
              </button>
            </div>
          </div>
        </div>

        {/* Response & Flow Diagram */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Response Inspector</h3>
            {mockResponse ? (
              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-400">HTTP Status</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded ${
                      mockResponse.status === 201
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : mockResponse.status === 409
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {mockResponse.status}
                  </span>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 mb-1">Response JSON Body:</div>
                  <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 overflow-x-auto text-[11px]">
                    {JSON.stringify(mockResponse.body, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs">
                Dispatch a request to inspect simulated HTTP response and latency.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
