import { ScoringCriterionResult, LabSubmissionResult } from '../types';

// =========================================================================
// LAB 18: Project & Sprint Rescue Lab
// =========================================================================

interface TaskAnswer { id: string; owner: string; durationDays: number; prereqIds: string[]; sequence: number; done?: boolean; }

function detectCycle(tasks: TaskAnswer[]): boolean {
  const byId = new Map(tasks.map((t) => [t.id, t]));
  const color = new Map<string, 'w' | 'g' | 'b'>();
  tasks.forEach((t) => color.set(t.id, 'w'));
  let cyclic = false;
  function dfs(id: string) {
    if (cyclic) return;
    color.set(id, 'g');
    const t = byId.get(id);
    if (t) {
      for (const p of t.prereqIds) {
        if (cyclic) return;
        const c = color.get(p);
        if (c === 'g') { cyclic = true; return; }
        if (c === 'w') dfs(p);
      }
    }
    color.set(id, 'b');
  }
  for (const t of tasks) { if (cyclic) break; if (color.get(t.id) === 'w') dfs(t.id); }
  return cyclic;
}

// Recomputes the same dependency + owner-serialized list-scheduling algorithm
// the component uses, purely from the raw submitted tasks, so "a task cannot
// start before its prerequisites finish" is genuinely re-verified server-side.
function verifyPrecedence(tasks: TaskAnswer[]): boolean {
  if (detectCycle(tasks)) return false;
  const finish: Record<string, number> = {};
  const scheduled = new Set<string>();
  tasks.filter((t) => t.done).forEach((t) => { finish[t.id] = 0; scheduled.add(t.id); });
  const ownerAvailable: Record<string, number> = {};
  const remaining = tasks.filter((t) => !t.done);
  let guard = 0;
  while (scheduled.size < tasks.length && guard < 500) {
    guard++;
    const candidates = remaining.filter((t) => !scheduled.has(t.id) && t.prereqIds.every((p) => scheduled.has(p)));
    if (candidates.length === 0) return false;
    candidates.sort((a, b) => a.sequence - b.sequence || a.id.localeCompare(b.id));
    const t = candidates[0];
    const depFloor = t.prereqIds.reduce((m, p) => Math.max(m, finish[p] ?? 0), 0);
    const ownerFloor = ownerAvailable[t.owner] ?? 0;
    const start = Math.max(depFloor, ownerFloor);
    // Precedence check: start must never precede any prerequisite's finish.
    if (t.prereqIds.some((p) => start < (finish[p] ?? 0))) return false;
    const f = start + t.durationDays;
    finish[t.id] = f; ownerAvailable[t.owner] = f; scheduled.add(t.id);
  }
  return scheduled.size === tasks.length;
}

export function evaluateProjectSprintRescueLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const capacity = Number(answers.capacity || 0);
  const tasks = (answers.tasks as TaskAnswer[]) || [];
  const scopeDecision = String(answers.scopeDecision || 'pending');
  const retro = String(answers.retro || '').trim();
  const riskNotesCount = Number(answers.riskNotesCount || 0);

  const noCycle = tasks.length > 0 && !detectCycle(tasks);
  const loads: Record<string, number> = {};
  tasks.filter((t) => !t.done).forEach((t) => { loads[t.owner] = (loads[t.owner] || 0) + t.durationDays; });
  const noOverallocation = Object.values(loads).every((l) => l <= capacity);

  const precedenceHolds = verifyPrecedence(tasks);
  const scopeHandled = scopeDecision === 'accepted' || scopeDecision === 'deferred';

  const criteria: ScoringCriterionResult[] = [
    {
      id: 'spr-c1',
      name: 'Dependency Cycle Resolution & Owner Capacity',
      category: 'correctness',
      earned: (noCycle ? 30 : 0) + (noOverallocation ? 30 : 0),
      max: 60,
      passed: noCycle && noOverallocation,
      feedback: !noCycle
        ? 'The task graph still contains a cyclic dependency — break one of the flagged links.'
        : noOverallocation
          ? 'Dependency graph is acyclic and no owner exceeds sprint capacity.'
          : `One or more owners exceed the ${capacity}-day sprint capacity — reassign or trim their tasks.`
    },
    {
      id: 'spr-c2',
      name: 'Precedence Integrity ("no task starts before its prerequisites finish")',
      category: 'constraints',
      earned: precedenceHolds ? 25 : 5,
      max: 25,
      passed: precedenceHolds,
      feedback: precedenceHolds
        ? 'Recomputed schedule confirms every task starts only after its prerequisites and owner are free.'
        : 'Recomputed schedule found a task starting before a prerequisite finished, or scheduling could not complete.'
    },
    {
      id: 'spr-c3',
      name: 'Scope Decision, Risk Register & Retrospective',
      category: 'evidence',
      earned: (scopeHandled ? 5 : 0) + (riskNotesCount > 0 ? 5 : 0) + (retro.length >= 30 ? 5 : 0),
      max: 15,
      passed: scopeHandled && retro.length >= 30,
      feedback: scopeHandled ? 'Scope-change card resolved and retrospective documented.' : 'Resolve the scope-change card (accept or defer) before submitting.'
    }
  ];

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);
  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'project-and-sprint-rescue-lab',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: [
      ...(noCycle ? [] : ['Use the "Break dependency" buttons to remove one edge from the detected cycle.']),
      ...(noOverallocation ? [] : ['Reassign work away from any owner whose planned days exceed sprint capacity.']),
      ...(scopeHandled ? [] : ['Accept or defer the scope-change card.']),
    ],
    submittedAt: new Date().toISOString()
  };
}
