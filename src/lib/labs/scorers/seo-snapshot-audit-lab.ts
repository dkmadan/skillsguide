import { ScoringCriterionResult, LabSubmissionResult } from '../types';

// =========================================================================
// LAB 20 EVALUATOR: SEO Snapshot Audit Lab
// =========================================================================

interface SeoPageAnswer { id: string; path: string; title: string; description: string; linksTo: string[]; }

const HOMEPAGE_ID = 'p1';

function computeIssues(pages: SeoPageAnswer[]) {
  const pathSet = new Set(pages.map((p) => p.path));
  const inbound = (path: string) => pages.filter((p) => p.linksTo.includes(path)).length;
  const byTitle = new Map<string, string[]>();
  pages.forEach((p) => { if (!p.title?.trim()) return; const arr = byTitle.get(p.title) || []; arr.push(p.id); byTitle.set(p.title, arr); });
  const dupGroups: string[][] = [];
  byTitle.forEach((ids) => { if (ids.length >= 2) dupGroups.push(ids); });
  const missingDesc = pages.filter((p) => !p.description?.trim()).map((p) => p.id);
  const orphans = pages.filter((p) => p.id !== HOMEPAGE_ID && inbound(p.path) === 0).map((p) => p.id);
  const broken: { source: string; target: string }[] = [];
  pages.forEach((p) => p.linksTo.forEach((l) => { if (l.startsWith('/') && !pathSet.has(l)) broken.push({ source: p.id, target: l }); }));
  return { dupGroups, missingDesc, orphans, broken };
}

export function evaluateSeoAuditLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const pages = (answers.pages as SeoPageAnswer[]) || [];
  const initialPages = (answers.initialPages as SeoPageAnswer[]) || [];
  const priorityOrder = (answers.priorityOrder as string[]) || [];
  const auditNotes = String(answers.auditNotes || '').trim();

  const initialIssues = computeIssues(initialPages);
  const finalIssues = computeIssues(pages);
  const finalById = new Map(pages.map((p) => [p.id, p]));

  const dupResolved = initialIssues.dupGroups.filter((g) => {
    const titles = g.map((id) => finalById.get(id)?.title || '');
    return new Set(titles).size > 1;
  }).length;
  const descResolved = initialIssues.missingDesc.filter((id) => (finalById.get(id)?.description?.trim().length || 0) >= 25).length;
  const orphanResolved = initialIssues.orphans.filter((id) => !finalIssues.orphans.includes(id)).length;
  const brokenResolved = initialIssues.broken.filter((b) => !finalIssues.broken.some((cur) => cur.source === b.source)).length;

  const totalIssues = initialIssues.dupGroups.length + initialIssues.missingDesc.length + initialIssues.orphans.length + initialIssues.broken.length;
  const resolvedCount = dupResolved + descResolved + orphanResolved + brokenResolved;
  const coverageRatio = totalIssues > 0 ? resolvedCount / totalIssues : 1;

  // Constraint: repairs must not introduce NEW broken internal links beyond what
  // already existed, i.e. link-graph integrity is preserved while fixing defects.
  const noNewBreakage = finalIssues.broken.length <= initialIssues.broken.length;
  const graphIntegrityOk = noNewBreakage && finalIssues.broken.every((b) => initialIssues.broken.some((ib) => ib.source === b.source));

  const hasPriorities = priorityOrder.length >= Math.max(1, totalIssues - 1);

  const criteria: ScoringCriterionResult[] = [
    {
      id: 'seo-c1',
      name: 'Crawl Defect Resolution (Duplicates, Orphan, Broken Link, Missing Description)',
      category: 'correctness',
      earned: Math.round(coverageRatio * 60),
      max: 60,
      passed: resolvedCount === totalIssues,
      feedback: `Resolved ${resolvedCount} of ${totalIssues} tracked technical defects (${dupResolved}/${initialIssues.dupGroups.length} duplicate titles, ${descResolved}/${initialIssues.missingDesc.length} missing descriptions, ${orphanResolved}/${initialIssues.orphans.length} orphans, ${brokenResolved}/${initialIssues.broken.length} broken links).`
    },
    {
      id: 'seo-c2',
      name: 'Internal Link Graph Integrity',
      category: 'constraints',
      earned: graphIntegrityOk ? 25 : 10,
      max: 25,
      passed: graphIntegrityOk,
      feedback: graphIntegrityOk ? 'No new broken internal links were introduced while repairing the snapshot.' : 'Repairs introduced additional broken internal link targets.'
    },
    {
      id: 'seo-c3',
      name: 'Repair Prioritization & Audit Log',
      category: 'evidence',
      earned: (hasPriorities ? 8 : 3) + (auditNotes.length >= 20 ? 7 : 0),
      max: 15,
      passed: hasPriorities && auditNotes.length >= 20,
      feedback: hasPriorities ? 'Repair list prioritized and audit log documented.' : 'Prioritize the repair queue before submitting.'
    }
  ];

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);
  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'seo-snapshot-audit-lab',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: resolvedCount === totalIssues ? [] : ['Revisit the Repair Queue tab — every duplicate title, missing description, orphan, and broken link must be resolved.'],
    submittedAt: new Date().toISOString()
  };
}
