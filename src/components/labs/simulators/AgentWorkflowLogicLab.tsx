'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { LabScenarioVariant, LabDifficulty } from '@/lib/labs/types';
import { useUndoableState } from '@/lib/labs/useUndoableState';
import { downloadJson } from '@/lib/labs/exportHelper';
import {
  GitCommit,
  ShieldCheck,
  Send,
  Sparkles,
  Plus,
  Trash2,
  Undo2,
  Redo2,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  Pause,
  ArrowRight,
  GitBranch,
  UserCheck,
  HelpCircle
} from 'lucide-react';

interface SimulatorProps {
  scenario?: LabScenarioVariant;
  variant: LabDifficulty;
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

export type NodeType =
  | 'INPUT'
  | 'VALIDATION'
  | 'RULE_CHECK'
  | 'BRANCH'
  | 'TRANSFORMATION'
  | 'HUMAN_APPROVAL'
  | 'OUTPUT'
  | 'STOP';

export interface WorkflowNode {
  id: string;
  type: NodeType;
  title: string;
  config: {
    approvalThreshold?: number;
    requiredField?: string;
    conditionField?: string;
  };
}

export interface WorkflowEdge {
  id: string;
  fromNode: string;
  fromPort: 'next' | 'true' | 'false' | 'approved' | 'rejected';
  toNode: string;
}

interface WorkflowGraph {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

const INITIAL_GRAPHS: Record<LabDifficulty, WorkflowGraph> = {
  beginner: {
    nodes: [
      { id: 'n1', type: 'INPUT', title: 'Ticket Ingestion', config: {} },
      { id: 'n2', type: 'VALIDATION', title: 'Validate Required Fields', config: { requiredField: 'order_id' } },
      { id: 'n3', type: 'BRANCH', title: 'Check Value > ₹5,000', config: { approvalThreshold: 5000 } },
      { id: 'n4', type: 'HUMAN_APPROVAL', title: 'Manager Approval Gate', config: {} },
      { id: 'n5', type: 'TRANSFORMATION', title: 'Format Refund Dispatch', config: {} },
      { id: 'n6', type: 'STOP', title: 'Execution Complete (STOP)', config: {} }
    ],
    edges: [
      { id: 'e1', fromNode: 'n1', fromPort: 'next', toNode: 'n2' },
      { id: 'e2', fromNode: 'n2', fromPort: 'next', toNode: 'n3' },
      { id: 'e3', fromNode: 'n3', fromPort: 'true', toNode: 'n4' }, // Above threshold -> requires manager approval
      { id: 'e4', fromNode: 'n3', fromPort: 'false', toNode: 'n5' }, // Below threshold -> auto-dispatch
      { id: 'e5', fromNode: 'n4', fromPort: 'approved', toNode: 'n5' },
      { id: 'e6', fromNode: 'n4', fromPort: 'rejected', toNode: 'n6' },
      { id: 'e7', fromNode: 'n5', fromPort: 'next', toNode: 'n6' }
    ]
  },
  intermediate: {
    nodes: [
      { id: 'n1', type: 'INPUT', title: 'Ticket Ingestion', config: {} },
      { id: 'n2', type: 'VALIDATION', title: 'Validate Account & Order', config: { requiredField: 'customer_account' } },
      { id: 'n3', type: 'BRANCH', title: 'Check Value > ₹5,000', config: { approvalThreshold: 5000 } },
      { id: 'n4', type: 'HUMAN_APPROVAL', title: 'Manager Approval Gate', config: {} },
      { id: 'n5', type: 'TRANSFORMATION', title: 'Retry API Call', config: {} },
      { id: 'n6', type: 'STOP', title: 'Execution Complete (STOP)', config: {} }
    ],
    edges: [
      { id: 'e1', fromNode: 'n1', fromPort: 'next', toNode: 'n2' },
      { id: 'e2', fromNode: 'n2', fromPort: 'next', toNode: 'n3' },
      { id: 'e3', fromNode: 'n3', fromPort: 'true', toNode: 'n4' },
      { id: 'e4', fromNode: 'n3', fromPort: 'false', toNode: 'n5' },
      { id: 'e5', fromNode: 'n4', fromPort: 'approved', toNode: 'n5' },
      { id: 'e6', fromNode: 'n4', fromPort: 'rejected', toNode: 'n6' },
      { id: 'e7', fromNode: 'n5', fromPort: 'next', toNode: 'n6' }
    ]
  },
  challenge: {
    nodes: [
      { id: 'n1', type: 'INPUT', title: 'High-Value Fraud Intake', config: {} },
      { id: 'n2', type: 'VALIDATION', title: 'Sanctions & KYC Check', config: { requiredField: 'kyc_verified' } },
      { id: 'n3', type: 'BRANCH', title: 'Risk Score > 80', config: { approvalThreshold: 80 } },
      { id: 'n4', type: 'HUMAN_APPROVAL', title: 'Compliance Officer Gate', config: {} },
      { id: 'n5', type: 'TRANSFORMATION', title: 'Suspicious Activity Report', config: {} },
      { id: 'n6', type: 'STOP', title: 'Case Closed (STOP)', config: {} }
    ],
    edges: [
      { id: 'e1', fromNode: 'n1', fromPort: 'next', toNode: 'n2' },
      { id: 'e2', fromNode: 'n2', fromPort: 'next', toNode: 'n3' },
      { id: 'e3', fromNode: 'n3', fromPort: 'true', toNode: 'n4' },
      { id: 'e4', fromNode: 'n3', fromPort: 'false', toNode: 'n6' },
      { id: 'e5', fromNode: 'n4', fromPort: 'approved', toNode: 'n5' },
      { id: 'e6', fromNode: 'n5', fromPort: 'next', toNode: 'n6' }
    ]
  }
};

interface ExecutionTraceStep {
  step: number;
  nodeId: string;
  nodeTitle: string;
  status: 'SUCCESS' | 'WAITING_APPROVAL' | 'REJECTED' | 'BLOCKED' | 'COMPLETE';
  message: string;
}

export default function AgentWorkflowLogicLab({ variant, onDirty, onSubmit }: SimulatorProps) {
  const initial = useMemo(() => INITIAL_GRAPHS[variant] || INITIAL_GRAPHS.beginner, [variant]);
  const { state: graph, set: setGraph, undo, redo, canUndo, canRedo } = useUndoableState<WorkflowGraph>(initial);

  const [selectedNodeId, setSelectedNodeId] = useState<string>('n3');
  const [ticketValue, setTicketValue] = useState<number>(7500);
  const [dataComplete, setDataComplete] = useState<boolean>(true);
  const [managerDecision, setManagerDecision] = useState<'approved' | 'rejected' | null>(null);

  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [isPausedForApproval, setIsPausedForApproval] = useState<boolean>(false);

  const selectedNode = useMemo(() => {
    return graph.nodes.find(n => n.id === selectedNodeId) || graph.nodes[0];
  }, [graph.nodes, selectedNodeId]);

  const updateNodeConfig = (nodeId: string, patch: Partial<WorkflowNode['config']>) => {
    setGraph(prev => ({
      ...prev,
      nodes: prev.nodes.map(n => n.id === nodeId ? { ...n, config: { ...n.config, ...patch } } : n)
    }));
    onDirty();
  };

  // Deterministic workflow graph execution engine
  const executionTrace = useMemo(() => {
    const trace: ExecutionTraceStep[] = [];
    const visited = new Set<string>();
    let currentNode = graph.nodes.find(n => n.type === 'INPUT') || graph.nodes[0];
    let stepCount = 1;
    const MAX_STEPS = 25;

    while (currentNode && stepCount <= MAX_STEPS) {
      if (currentNode.type === 'STOP') {
        trace.push({
          step: stepCount,
          nodeId: currentNode.id,
          nodeTitle: currentNode.title,
          status: 'COMPLETE',
          message: 'Reached terminal STOP state successfully.'
        });
        break;
      }

      if (visited.has(currentNode.id) && currentNode.type !== 'TRANSFORMATION') {
        trace.push({
          step: stepCount,
          nodeId: currentNode.id,
          nodeTitle: currentNode.title,
          status: 'BLOCKED',
          message: 'Loop cycle detected without exit condition. Terminating execution.'
        });
        break;
      }
      visited.add(currentNode.id);

      if (currentNode.type === 'INPUT') {
        trace.push({
          step: stepCount,
          nodeId: currentNode.id,
          nodeTitle: currentNode.title,
          status: 'SUCCESS',
          message: `Ingested ticket with declared value ₹${ticketValue.toLocaleString()}.`
        });
      } else if (currentNode.type === 'VALIDATION') {
        trace.push({
          step: stepCount,
          nodeId: currentNode.id,
          nodeTitle: currentNode.title,
          status: dataComplete ? 'SUCCESS' : 'BLOCKED',
          message: dataComplete ? 'Required fields present and validated.' : 'Missing required field! Pipeline blocked.'
        });
        if (!dataComplete) break;
      } else if (currentNode.type === 'BRANCH') {
        const threshold = currentNode.config.approvalThreshold ?? 5000;
        const conditionMet = ticketValue > threshold;
        trace.push({
          step: stepCount,
          nodeId: currentNode.id,
          nodeTitle: currentNode.title,
          status: 'SUCCESS',
          message: `Evaluated value (₹${ticketValue}) > threshold (₹${threshold}): ${conditionMet ? 'TRUE (requires approval)' : 'FALSE (auto-route)'}`
        });

        const edge = graph.edges.find(e => e.fromNode === currentNode.id && e.fromPort === (conditionMet ? 'true' : 'false'));
        if (!edge) {
          trace.push({ step: stepCount + 1, nodeId: currentNode.id, nodeTitle: currentNode.title, status: 'BLOCKED', message: `No edge found for branch outcome: ${conditionMet}` });
          break;
        }
        currentNode = graph.nodes.find(n => n.id === edge.toNode)!;
        stepCount++;
        continue;
      } else if (currentNode.type === 'HUMAN_APPROVAL') {
        if (managerDecision === 'approved') {
          trace.push({ step: stepCount, nodeId: currentNode.id, nodeTitle: currentNode.title, status: 'SUCCESS', message: 'Manager explicitly APPROVED refund dispatch.' });
          const edge = graph.edges.find(e => e.fromNode === currentNode.id && e.fromPort === 'approved');
          currentNode = edge ? graph.nodes.find(n => n.id === edge.toNode)! : graph.nodes.find(n => n.type === 'STOP')!;
          stepCount++;
          continue;
        } else if (managerDecision === 'rejected') {
          trace.push({ step: stepCount, nodeId: currentNode.id, nodeTitle: currentNode.title, status: 'REJECTED', message: 'Manager explicitly REJECTED refund dispatch.' });
          const edge = graph.edges.find(e => e.fromNode === currentNode.id && e.fromPort === 'rejected');
          currentNode = edge ? graph.nodes.find(n => n.id === edge.toNode)! : graph.nodes.find(n => n.type === 'STOP')!;
          stepCount++;
          continue;
        } else {
          trace.push({ step: stepCount, nodeId: currentNode.id, nodeTitle: currentNode.title, status: 'WAITING_APPROVAL', message: 'Paused: Awaiting human manager decision in panel.' });
          break;
        }
      } else if (currentNode.type === 'TRANSFORMATION') {
        trace.push({
          step: stepCount,
          nodeId: currentNode.id,
          nodeTitle: currentNode.title,
          status: 'SUCCESS',
          message: 'Transformed state and dispatched external service call.'
        });
      }

      // Default transition: find edge with 'next' port
      const nextEdge = graph.edges.find(e => e.fromNode === currentNode.id);
      if (!nextEdge) {
        trace.push({ step: stepCount + 1, nodeId: currentNode.id, nodeTitle: currentNode.title, status: 'BLOCKED', message: 'Disconnected node! No outgoing transition edge.' });
        break;
      }

      currentNode = graph.nodes.find(n => n.id === nextEdge.toNode)!;
      stepCount++;
    }

    return trace;
  }, [graph, ticketValue, dataComplete, managerDecision]);

  const hasApprovalGate = useMemo(() => {
    return graph.nodes.some(n => n.type === 'HUMAN_APPROVAL');
  }, [graph.nodes]);

  const handleSubmit = () => {
    onSubmit({
      variant,
      graphState: graph,
      ticketValue,
      dataComplete,
      managerDecision,
      traceLength: executionTrace.length,
      reachedStop: executionTrace.some(t => t.status === 'COMPLETE'),
      enforcesApproval: hasApprovalGate
    });
  };

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* ===================================================================== */}
      {/* TEST SCENARIO PAYLOAD SIMULATION BAR                                  */}
      {/* ===================================================================== */}
      <div className="p-3 rounded-2xl bg-[#0f1325] border border-white/10 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Test Ticket Value:</span>
            <input
              type="number"
              value={ticketValue}
              onChange={(e) => { setTicketValue(parseInt(e.target.value, 10) || 0); onDirty(); }}
              className="w-24 bg-black/40 border border-white/10 rounded-xl px-2.5 py-1 text-white font-mono"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={dataComplete}
              onChange={(e) => { setDataComplete(e.target.checked); onDirty(); }}
              className="rounded accent-purple-600"
            />
            <span className="text-slate-300">Ticket Data Complete</span>
          </label>

          {/* Human Manager Decision Gate */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-white/10">
            <span className="text-slate-400">Manager Gate:</span>
            <button
              onClick={() => { setManagerDecision('approved'); onDirty(); }}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] ${managerDecision === 'approved' ? 'bg-emerald-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white'}`}
            >
              Approve
            </button>
            <button
              onClick={() => { setManagerDecision('rejected'); onDirty(); }}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] ${managerDecision === 'rejected' ? 'bg-red-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white'}`}
            >
              Reject
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={undo} disabled={!canUndo} className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 border border-white/10 text-slate-300">
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={redo} disabled={!canRedo} className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 border border-white/10 text-slate-300">
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* WORKFLOW GRAPH CANVAS & NODE INSPECTOR                                */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Graph Canvas */}
        <div className="lg:col-span-8 p-4 rounded-3xl bg-[#0a0d1a] border border-white/10 space-y-3 min-h-[380px] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="font-bold text-white text-xs flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5 text-purple-400" />
              Agent Orchestration Finite State Graph ({graph.nodes.length} nodes, {graph.edges.length} transitions)
            </span>
            <span className="text-[10px] text-slate-500 italic">Models orchestration logic without invoking live AI models</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {graph.nodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              const traceStep = executionTrace.find(t => t.nodeId === node.id);
              const isExecuted = Boolean(traceStep);

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all space-y-2 relative ${
                    isSelected
                      ? 'bg-[#151934] border-purple-500 ring-2 ring-purple-500/40 shadow-xl'
                      : isExecuted
                      ? 'bg-[#0f1325] border-purple-500/30 hover:border-purple-500/50'
                      : 'bg-[#0b0e1b] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{node.title}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-white/5 text-purple-300">
                      {node.type}
                    </span>
                  </div>

                  {/* Outgoing edge destinations */}
                  <div className="text-[10px] text-slate-400 font-mono space-y-0.5">
                    {graph.edges.filter(e => e.fromNode === node.id).map(e => {
                      const target = graph.nodes.find(n => n.id === e.toNode);
                      return (
                        <div key={e.id} className="flex items-center gap-1">
                          <span className="text-purple-400">[{e.fromPort}]</span>
                          <span>&rarr; {target?.title || e.toNode}</span>
                        </div>
                      );
                    })}
                  </div>

                  {traceStep && (
                    <div className="pt-1 flex items-center gap-1 text-[10px] font-bold">
                      {traceStep.status === 'SUCCESS' || traceStep.status === 'COMPLETE' ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Step {traceStep.step}: Executed
                        </span>
                      ) : traceStep.status === 'WAITING_APPROVAL' ? (
                        <span className="text-amber-400 flex items-center gap-1">
                          <Pause className="w-3 h-3" /> Paused: Needs Approval
                        </span>
                      ) : (
                        <span className="text-red-400 flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> Blocked
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Node Properties & Execution Trace */}
        <div className="lg:col-span-4 space-y-3">
          {/* Node Config */}
          <div className="p-4 rounded-2xl bg-[#0f1325] border border-white/10 space-y-2.5 shadow-xl">
            <span className="font-bold text-white text-xs block border-b border-white/5 pb-2">
              Node Inspector: {selectedNode.title}
            </span>

            {selectedNode.type === 'BRANCH' && (
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-semibold block">Approval Value Threshold (₹):</label>
                <input
                  type="number"
                  value={selectedNode.config.approvalThreshold || 5000}
                  onChange={(e) => updateNodeConfig(selectedNode.id, { approvalThreshold: parseInt(e.target.value, 10) || 0 })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-1 text-white font-mono text-xs"
                />
              </div>
            )}

            {selectedNode.type === 'VALIDATION' && (
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-semibold block">Required Field Name:</label>
                <input
                  type="text"
                  value={selectedNode.config.requiredField || 'order_id'}
                  onChange={(e) => updateNodeConfig(selectedNode.id, { requiredField: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-1 text-white font-mono text-xs"
                />
              </div>
            )}
          </div>

          {/* Execution Trace Log */}
          <div className="p-4 rounded-2xl bg-[#0a0d1a] border border-white/10 space-y-2 shadow-xl">
            <span className="font-bold text-white text-xs block border-b border-white/5 pb-2">
              Trace Execution Engine ({executionTrace.length} steps)
            </span>

            <div className="space-y-1.5 max-h-56 overflow-y-auto">
              {executionTrace.map((t, i) => (
                <div key={i} className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-0.5 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-300">Step {t.step}: {t.nodeTitle}</span>
                    <span className={`text-[10px] font-bold ${
                      t.status === 'SUCCESS' || t.status === 'COMPLETE' ? 'text-emerald-400' : t.status === 'WAITING_APPROVAL' ? 'text-amber-400' : 'text-red-400'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                  <p className="text-slate-400 leading-snug">{t.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* SUBMISSION BAR                                                        */}
      {/* ===================================================================== */}
      <div className="p-4 rounded-2xl bg-[#0f1325] border border-white/10 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span>Approval Gate: <strong className={hasApprovalGate ? 'text-emerald-400' : 'text-amber-400'}>{hasApprovalGate ? 'Present' : 'Missing'}</strong></span>
          <span>•</span>
          <span>Outcome: <strong className={executionTrace.some(t => t.status === 'COMPLETE') ? 'text-emerald-400' : 'text-amber-400'}>
            {executionTrace.some(t => t.status === 'COMPLETE') ? 'Execution Complete (STOP)' : 'Halted / Paused'}
          </strong></span>
        </div>

        <button
          onClick={handleSubmit}
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/25 flex items-center gap-1.5 transition-all"
        >
          <span>Submit Workflow Logic for Verification</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
