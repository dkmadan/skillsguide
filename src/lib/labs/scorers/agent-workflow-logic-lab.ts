import { ScoringCriterionResult, LabSubmissionResult } from '../types';

// =========================================================================
// LAB 07: Agent Workflow Logic Lab
// =========================================================================
const ALLOWED_NODES = ['INSPECT', 'CLASSIFY', 'ASK_APPROVAL', 'ROUTE', 'RETRY_TOOL', 'STOP'];
const MAX_TRANSITIONS = 30;
const MAX_RETRIES = 3;

export function evaluateAgentWorkflowLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const nodes = Array.isArray(answers.workflowNodes) ? (answers.workflowNodes as unknown[]).map(String) : [];
  const safeguardNotes = String(answers.safeguardNotes || '').trim();
  const normalReachesStopClient = Boolean(answers.normalReachesStop);

  // --- All structural checks are recomputed here from the raw node array, independent of
  // whatever the client reported, since the array alone is enough to verify them. ---
  const endsWithStop = nodes.length > 0 && nodes[nodes.length - 1] === 'STOP';
  const hasStopNode = nodes.includes('STOP');
  const routeIdx = nodes.indexOf('ROUTE');
  const approvalIdx = nodes.indexOf('ASK_APPROVAL');
  const approvalBeforeRoute = routeIdx === -1 || (approvalIdx !== -1 && approvalIdx < routeIdx);
  const retryCount = nodes.filter((n) => n === 'RETRY_TOOL').length;
  const loopBounded = retryCount <= MAX_RETRIES && nodes.length <= MAX_TRANSITIONS;
  const allowlistValid = nodes.length > 0 && nodes.every((n) => ALLOWED_NODES.includes(n));

  // --- Correctness: a reachable STOP and an approval gate ahead of ROUTE are the two
  // load-bearing safety properties of this FSM. ---
  const stopEarned = endsWithStop ? 30 : hasStopNode ? 12 : 0;
  const approvalEarned = approvalBeforeRoute ? 30 : 8;
  const correctnessEarned = stopEarned + approvalEarned;
  const correctnessPassed = endsWithStop && approvalBeforeRoute;

  // --- Constraints: allowlisted nodes only, and bounded retries/transitions. ---
  const constraintsPassed = allowlistValid && loopBounded;
  const constraintsEarned = constraintsPassed ? 25 : allowlistValid || loopBounded ? 12 : 0;

  // --- Evidence: safeguard memo must be substantive, plus the reported normal-path replay
  // should agree with what the structural checks imply (a lightweight cross-check). ---
  const KEYWORDS = ['approval', 'loop', 'retry', 'stop', 'gate', 'budget', 'route'];
  const mentionsKeyword = KEYWORDS.some((k) => safeguardNotes.toLowerCase().includes(k));
  const notesSubstantial = safeguardNotes.length >= 30 && mentionsKeyword;
  const replayCoherent = normalReachesStopClient === endsWithStop || !endsWithStop;
  const evidenceEarned = notesSubstantial && replayCoherent ? 15 : notesSubstantial || replayCoherent ? 9 : 3;

  const criteria: ScoringCriterionResult[] = [
    {
      id: 'agt-c1',
      name: 'Reachable STOP & Approval Gate Before Routing',
      category: 'correctness',
      earned: correctnessEarned,
      max: 60,
      passed: correctnessPassed,
      feedback: correctnessPassed
        ? 'The graph ends at STOP and every ROUTE node is preceded by an approval gate.'
        : !endsWithStop
          ? 'The workflow does not end at a STOP node — a graph must terminate safely, not just include STOP somewhere unreachable.'
          : 'ROUTE appears before (or without) an ASK_APPROVAL gate — the mock routing action must be blocked until approval is granted.'
    },
    {
      id: 'agt-c2',
      name: 'Allowlisted Nodes & Bounded Retry Loop',
      category: 'constraints',
      earned: constraintsEarned,
      max: 25,
      passed: constraintsPassed,
      feedback: constraintsPassed
        ? `Retry count (${retryCount}/${MAX_RETRIES}) and total node count (${nodes.length}/${MAX_TRANSITIONS}) both stay within the FSM's bounds.`
        : 'Retry attempts or total node count exceed the configured safety bounds — a real agent would loop indefinitely or blow its transition budget.'
    },
    {
      id: 'agt-c3',
      name: 'Trace Replay & Safeguard Memo',
      category: 'evidence',
      earned: evidenceEarned,
      max: 15,
      passed: notesSubstantial && replayCoherent,
      feedback: notesSubstantial
        ? 'Safeguard memo documents the approval and loop-bound design decisions clearly.'
        : 'Safeguard memo is too brief — name the specific gate and bound you configured and why.'
    }
  ];

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);
  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'agent-workflow-logic-lab',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: correctnessPassed ? [] : ['Autonomous agent workflows must gate write operations (ROUTE) behind human approval and always terminate at a reachable STOP.'],
    submittedAt: new Date().toISOString()
  };
}
