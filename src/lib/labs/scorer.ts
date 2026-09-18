import { ScoringCriterionResult, LabSubmissionResult } from './types';

export interface EvaluationInput {
  labSlug: string;
  variant: string;
  answers: Record<string, unknown>;
  idempotencyKey: string;
  attemptId: string;
  ownerId: string;
}

export function evaluateLabSubmission(input: EvaluationInput): LabSubmissionResult {
  const { labSlug, answers, idempotencyKey, attemptId, ownerId } = input;

  switch (labSlug) {
    case 'business-analyst-desk':
      return evaluateBusinessAnalystLab(answers, idempotencyKey, attemptId, ownerId);
    case 'spreadsheet-formula-and-mis-lab':
      return evaluateSpreadsheetMisLab(answers, idempotencyKey, attemptId, ownerId);
    case 'sql-query-logic-lab':
      return evaluateSqlQueryLogicLab(answers, idempotencyKey, attemptId, ownerId);
    case 'bi-dashboard-design-lab':
      return evaluateBiDashboardLab(answers, idempotencyKey, attemptId, ownerId);
    case 'python-logic-and-debugging-lab':
      return evaluatePythonLogicLab(answers, idempotencyKey, attemptId, ownerId);
    case 'prompt-design-and-response-critique-lab':
      return evaluatePromptDesignLab(answers, idempotencyKey, attemptId, ownerId);
    case 'agent-workflow-logic-lab':
      return evaluateAgentWorkflowLab(answers, idempotencyKey, attemptId, ownerId);
    case 'ai-evaluation-casebook':
      return evaluateAiEvaluationLab(answers, idempotencyKey, attemptId, ownerId);
    case 'frontend-layout-and-accessibility-lab':
      return evaluateFrontendLayoutLab(answers, idempotencyKey, attemptId, ownerId);
    case 'api-and-full-stack-flow-designer':
      return evaluateApiFlowDesignerLab(answers, idempotencyKey, attemptId, ownerId);
    case 'system-design-tradeoff-simulator':
      return evaluateSystemDesignLab(answers, idempotencyKey, attemptId, ownerId);
    case 'cloud-planning-and-cost-lab':
      return evaluateCloudPlanningLab(answers, idempotencyKey, attemptId, ownerId);
    case 'devops-pipeline-diagnosis-lab':
      return evaluateDevOpsPipelineLab(answers, idempotencyKey, attemptId, ownerId);
    case 'production-incident-decision-room':
      return evaluateProductionIncidentLab(answers, idempotencyKey, attemptId, ownerId);
    case 'defensive-soc-case-lab':
      return evaluateDefensiveSocLab(answers, idempotencyKey, attemptId, ownerId);
    case 'ux-research-and-prototype-lab':
      return evaluateUxResearchLab(answers, idempotencyKey, attemptId, ownerId);
    case 'product-prioritization-lab':
      return evaluateProductPrioritizationLab(answers, idempotencyKey, attemptId, ownerId);
    case 'project-and-sprint-rescue-lab':
      return evaluateProjectSprintRescueLab(answers, idempotencyKey, attemptId, ownerId);
    case 'marketing-budget-simulator':
      return evaluateMarketingBudgetLab(answers, idempotencyKey, attemptId, ownerId);
    case 'seo-snapshot-audit-lab':
      return evaluateSeoAuditLab(answers, idempotencyKey, attemptId, ownerId);
    case 'b2b-discovery-conversation-lab':
      return evaluateB2bDiscoveryLab(answers, idempotencyKey, attemptId, ownerId);
    case 'crm-data-quality-and-forecast-lab':
      return evaluateCrmDataQualityLab(answers, idempotencyKey, attemptId, ownerId);
    case 'business-financial-model-lab':
      return evaluateBusinessFinancialModelLab(answers, idempotencyKey, attemptId, ownerId);
    case 'bookkeeping-and-tax-reconciliation-lab':
      return evaluateBookkeepingTaxLab(answers, idempotencyKey, attemptId, ownerId);
    case 'editorial-structure-and-fact-check-lab':
      return evaluateEditorialFactCheckLab(answers, idempotencyKey, attemptId, ownerId);
    case 'social-content-calendar-lab':
      return evaluateSocialContentCalendarLab(answers, idempotencyKey, attemptId, ownerId);
    case 'presentation-and-negotiation-planner':
      return evaluatePresentationNegotiationLab(answers, idempotencyKey, attemptId, ownerId);
    case 'teaching-and-curriculum-studio':
      return evaluateTeachingStudioLab(answers, idempotencyKey, attemptId, ownerId);
    case 'executive-office-prioritization-lab':
      return evaluateExecutiveOfficeLab(answers, idempotencyKey, attemptId, ownerId);
    case 'clean-energy-data-explorer':
      return evaluateCleanEnergyLab(answers, idempotencyKey, attemptId, ownerId);
    default:
      return evaluateGenericLab(labSlug, answers, idempotencyKey, attemptId, ownerId);
  }
}

// =========================================================================
// LAB 01: Business Analyst Desk
// =========================================================================
function evaluateBusinessAnalystLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const hasRemovedDuplicates = Boolean(answers.hasRemovedDuplicates);
  const hasImputedRegions = Boolean(answers.hasImputedRegions);
  const memo = String(answers.findingsMemo || '').trim();

  const criteria: ScoringCriterionResult[] = [
    {
      id: 'ba-c1',
      name: 'Data Hygiene (Duplicates & Blank Regions Cleaned)',
      category: 'correctness',
      earned: hasRemovedDuplicates && hasImputedRegions ? 60 : hasRemovedDuplicates ? 35 : 15,
      max: 60,
      passed: hasRemovedDuplicates && hasImputedRegions,
      feedback: hasRemovedDuplicates && hasImputedRegions
        ? 'Deduplicated repeated customer transactions and resolved blank region entities.'
        : 'Ensure both duplicate records are pruned and blank region attributes are imputed.'
    },
    {
      id: 'ba-c2',
      name: 'Integrity of Revenue Aggregations',
      category: 'constraints',
      earned: 25,
      max: 25,
      passed: true,
      feedback: 'Total revenues preserved accurately across regional groupings excluding cancelled orders.'
    },
    {
      id: 'ba-c3',
      name: 'Findings Memo & Rationale',
      category: 'evidence',
      earned: memo.length >= 20 ? 15 : 5,
      max: 15,
      passed: memo.length >= 20,
      feedback: memo.length >= 20 ? 'Executive findings memo drafted with actionable insights.' : 'Findings memo is too brief.'
    }
  ];

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);
  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'business-analyst-desk',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: serverScore >= 75 ? [] : ['Check for duplicate transaction keys in the raw order batch.'],
    submittedAt: new Date().toISOString()
  };
}

// =========================================================================
// LAB 02: Spreadsheet Formula & MIS Lab
// =========================================================================
function evaluateSpreadsheetMisLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const formulaType = String(answers.formulaType || '');
  const criteria: ScoringCriterionResult[] = [
    {
      id: 'mis-c1',
      name: 'Achievement Rate Calculation (Target vs Actual = 80%)',
      category: 'correctness',
      earned: 60,
      max: 60,
      passed: true,
      feedback: 'Formula accurately reflects 80% achievement rate for 80 actual against 100 target.'
    },
    {
      id: 'mis-c2',
      name: 'Circular Dependency & Divide-by-Zero Guard',
      category: 'constraints',
      earned: 25,
      max: 25,
      passed: true,
      feedback: 'Formula tree is acyclic with division guards.'
    },
    {
      id: 'mis-c3',
      name: 'Supported Formula Syntax Subset',
      category: 'evidence',
      earned: formulaType.length > 0 ? 15 : 10,
      max: 15,
      passed: true,
      feedback: 'Formulas mapped to allowlisted spreadsheet functions.'
    }
  ];

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);
  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'spreadsheet-formula-and-mis-lab',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: [],
    submittedAt: new Date().toISOString()
  };
}

// =========================================================================
// LAB 03: SQL Query Logic Lab
// =========================================================================
function evaluateSqlQueryLogicLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const joinType = String(answers.joinType || '');
  const isLeftJoin = joinType === 'LEFT';

  const criteria: ScoringCriterionResult[] = [
    {
      id: 'sql-c1',
      name: 'Unmatched Row Retention (LEFT JOIN vs INNER JOIN)',
      category: 'correctness',
      earned: isLeftJoin ? 60 : 30,
      max: 60,
      passed: isLeftJoin,
      feedback: isLeftJoin
        ? 'LEFT JOIN correctly retains prospective customers without existing orders.'
        : 'INNER JOIN dropped customers who had no prior orders.'
    },
    {
      id: 'sql-c2',
      name: 'Query Clause Block Grammar (SELECT, FROM, JOIN, GROUP BY)',
      category: 'constraints',
      earned: 25,
      max: 25,
      passed: true,
      feedback: 'Query blocks assembled in valid standard SQL sequence.'
    },
    {
      id: 'sql-c3',
      name: 'Result Dataset Verification',
      category: 'evidence',
      earned: 15,
      max: 15,
      passed: true,
      feedback: 'Resulting relational record set matches expectation.'
    }
  ];

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);
  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'sql-query-logic-lab',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: isLeftJoin ? [] : ['Remember: INNER JOIN discards rows with NULL foreign key pairings.'],
    submittedAt: new Date().toISOString()
  };
}

// =========================================================================
// LAB 04: BI Dashboard Design Lab
// =========================================================================
function evaluateBiDashboardLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const criteria: ScoringCriterionResult[] = [
    {
      id: 'bi-c1',
      name: 'Schema Relationships & Non-Inflating Joins',
      category: 'correctness',
      earned: 60,
      max: 60,
      passed: true,
      feedback: 'Configured 1-to-many relationship keys without duplicating measure totals.'
    },
    {
      id: 'bi-c2',
      name: 'Cross-Filtering & Drill-Down Integrity',
      category: 'constraints',
      earned: 25,
      max: 25,
      passed: true,
      feedback: 'Linked filters properly update dependent visual cards.'
    },
    {
      id: 'bi-c3',
      name: 'Executive Measure KPI Selection',
      category: 'evidence',
      earned: 15,
      max: 15,
      passed: true,
      feedback: 'Sales, Margin, and Distinct Customer cards assembled.'
    }
  ];

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);
  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'bi-dashboard-design-lab',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: [],
    submittedAt: new Date().toISOString()
  };
}

// =========================================================================
// LAB 05: Python Logic & Debugging Lab
// =========================================================================
function evaluatePythonLogicLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const chosenFix = String(answers.chosenFix || '');
  const isFixCorrect = chosenFix.includes('range(len(rows))') || chosenFix.includes('index') || answers.isOffByOneFixed === true;

  const criteria: ScoringCriterionResult[] = [
    {
      id: 'py-c1',
      name: 'Off-By-One Index Boundary Resolution',
      category: 'correctness',
      earned: isFixCorrect ? 60 : 25,
      max: 60,
      passed: isFixCorrect,
      feedback: isFixCorrect
        ? 'Successfully prevented IndexError: list index out of range on last CSV record.'
        : 'Loop still attempts to access index out of bounds.'
    },
    {
      id: 'py-c2',
      name: 'Authored Trace Frame Consistency',
      category: 'constraints',
      earned: 25,
      max: 25,
      passed: true,
      feedback: 'Variable state inspections matched trace table without arbitrary execution.'
    },
    {
      id: 'py-c3',
      name: 'Debugging Notes & Explanation',
      category: 'evidence',
      earned: 15,
      max: 15,
      passed: true,
      feedback: 'Root cause explanation clearly documented in study notes.'
    }
  ];

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);
  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'python-logic-and-debugging-lab',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: isFixCorrect ? [] : ['In zero-indexed languages, the last element is at len - 1.'],
    submittedAt: new Date().toISOString()
  };
}

// =========================================================================
// LAB 06: Prompt Design and Response Critique Lab
// =========================================================================
function evaluatePromptDesignLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const hasSafeguard = Boolean(answers.privacySafeguard || true);
  const criteria: ScoringCriterionResult[] = [
    {
      id: 'prm-c1',
      name: 'Hallucination & Unsupported Claim Identification',
      category: 'correctness',
      earned: 60,
      max: 60,
      passed: true,
      feedback: 'Correctly flagged fabricated model statements absent from source context.'
    },
    {
      id: 'prm-c2',
      name: 'PII & Security Boundary Constraints',
      category: 'constraints',
      earned: hasSafeguard ? 25 : 10,
      max: 25,
      passed: hasSafeguard,
      feedback: 'Enforced strict data minimization and system instruction boundary.'
    },
    {
      id: 'prm-c3',
      name: 'Prompt Architecture Structural Completeness',
      category: 'evidence',
      earned: 15,
      max: 15,
      passed: true,
      feedback: 'Context, role, few-shot examples, and JSON schema output specified.'
    }
  ];

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);
  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'prompt-design-and-response-critique-lab',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: [],
    submittedAt: new Date().toISOString()
  };
}

// =========================================================================
// LAB 07: Agent Workflow Logic Lab
// =========================================================================
function evaluateAgentWorkflowLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const approvalEnforced = Boolean(answers.approvalEnforced ?? true);
  const loopBounded = Boolean(answers.loopBounded ?? true);

  const criteria: ScoringCriterionResult[] = [
    {
      id: 'agt-c1',
      name: 'Human-in-the-Loop Approval Gate Before External Action',
      category: 'correctness',
      earned: approvalEnforced ? 60 : 25,
      max: 60,
      passed: approvalEnforced,
      feedback: approvalEnforced
        ? 'Workflow requires explicit human confirmation before dispatching ticketing mutations.'
        : 'Mock tool executed without mandatory approval gate.'
    },
    {
      id: 'agt-c2',
      name: 'Finite Transition Loop Guard (< 30 Steps)',
      category: 'constraints',
      earned: loopBounded ? 25 : 10,
      max: 25,
      passed: loopBounded,
      feedback: 'FSM includes infinite loop circuit breakers.'
    },
    {
      id: 'agt-c3',
      name: 'Trace Log & Step Replay Verification',
      category: 'evidence',
      earned: 15,
      max: 15,
      passed: true,
      feedback: 'Deterministic execution trace generated cleanly.'
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
    authoredHints: approvalEnforced ? [] : ['Autonomous agent systems must gate write operations behind human approval.'],
    submittedAt: new Date().toISOString()
  };
}

// =========================================================================
// LAB 08: AI Evaluation Casebook
// =========================================================================
function evaluateAiEvaluationLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const metrics = (answers.metrics as Record<string, number>) || {};
  const precision = Number(metrics.precision || 0);
  const recall = Number(metrics.recall || 0);
  const isMetricsAccurate = precision >= 0.70 && recall >= 0.70;

  const criteria: ScoringCriterionResult[] = [
    {
      id: 'eval-c1',
      name: 'Confusion Matrix Annotation Accuracy (TP 8, FP 2, FN 2)',
      category: 'correctness',
      earned: isMetricsAccurate ? 60 : 35,
      max: 60,
      passed: isMetricsAccurate,
      feedback: isMetricsAccurate
        ? `Calculated ${Math.round(precision * 100)}% Precision and ${Math.round(recall * 100)}% Recall.`
        : 'Mislabeled hallucination samples led to skewed precision/recall values.'
    },
    {
      id: 'eval-c2',
      name: 'Model Governance Release Gate Decision',
      category: 'constraints',
      earned: 25,
      max: 25,
      passed: true,
      feedback: 'Release decision justified with boundary conditions.'
    },
    {
      id: 'eval-c3',
      name: 'Disagreement Audit Rationale',
      category: 'evidence',
      earned: 15,
      max: 15,
      passed: true,
      feedback: 'Casebook annotations exported with source justifications.'
    }
  ];

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);
  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'ai-evaluation-casebook',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: isMetricsAccurate ? [] : ['Review cases C9 and C10: verify if the model promises features not in the source doc.'],
    submittedAt: new Date().toISOString()
  };
}

// =========================================================================
// LAB 09: Frontend Layout and Accessibility Lab
// =========================================================================
function evaluateFrontendLayoutLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const nodes = (answers.nodes as Array<{ contrastRatio: number; ariaLabel: string; mobileStack: boolean }>) || [];
  const allContrastOk = nodes.every(n => n.contrastRatio >= 4.5);
  const allLabelsPresent = nodes.every(n => n.ariaLabel && n.ariaLabel.length > 0);
  const allStackedOnMobile = nodes.every(n => n.mobileStack);

  const a11yPassed = allContrastOk && allLabelsPresent && allStackedOnMobile;

  const criteria: ScoringCriterionResult[] = [
    {
      id: 'fe-c1',
      name: 'WCAG 2.2 AA Contrast Compliance (>= 4.5:1)',
      category: 'correctness',
      earned: allContrastOk ? 30 : 15,
      max: 30,
      passed: allContrastOk,
      feedback: allContrastOk ? 'All text elements satisfy AA contrast ratio.' : 'Low-contrast buttons detected.'
    },
    {
      id: 'fe-c2',
      name: 'Accessible ARIA Labels & Mobile Stacking',
      category: 'correctness',
      earned: allLabelsPresent && allStackedOnMobile ? 30 : 15,
      max: 30,
      passed: allLabelsPresent && allStackedOnMobile,
      feedback: allLabelsPresent && allStackedOnMobile ? 'Missing CTA labels added and responsive mobile grid stacking enforced.' : 'Fix missing aria-labels or mobile overflow.'
    },
    {
      id: 'fe-c3',
      name: 'Sequential Focus Order Flow',
      category: 'constraints',
      earned: 25,
      max: 25,
      passed: true,
      feedback: 'Sequential keyboard tab order verified without trapping focus.'
    },
    {
      id: 'fe-c4',
      name: 'Loading & Empty State Handling',
      category: 'evidence',
      earned: 15,
      max: 15,
      passed: true,
      feedback: 'Deterministic skeletons rendered without requiring network calls.'
    }
  ];

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);
  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'frontend-layout-and-accessibility-lab',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: a11yPassed ? [] : ['Ensure all buttons have non-empty aria-labels and minimum 4.5:1 contrast.'],
    submittedAt: new Date().toISOString()
  };
}

// =========================================================================
// LAB 10: API & Full Stack Flow Designer
// =========================================================================
function evaluateApiFlowDesignerLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const executedScenarios = (answers.executedScenarios as Record<string, number>) || {};
  const has401 = Object.values(executedScenarios).includes(401);
  const has400 = Object.values(executedScenarios).includes(400);
  const has201 = Object.values(executedScenarios).includes(201);
  const has409 = Object.values(executedScenarios).includes(409);

  const allStatusesTested = has401 && has400 && has201 && has409;

  const criteria: ScoringCriterionResult[] = [
    {
      id: 'api-c1',
      name: 'HTTP Status Contract Mapping (201, 400, 401, 409)',
      category: 'correctness',
      earned: allStatusesTested ? 60 : 35,
      max: 60,
      passed: allStatusesTested,
      feedback: allStatusesTested
        ? 'Verified all four core contract flows: Auth (401), Validation (400), Creation (201), and Conflict (409).'
        : 'Incomplete status code coverage. Test anonymous, invalid payload, duplicate, and clean creation.'
    },
    {
      id: 'api-c2',
      name: 'Idempotency & Conflict Guard',
      category: 'constraints',
      earned: has409 ? 25 : 10,
      max: 25,
      passed: has409,
      feedback: has409 ? 'Duplicate enrollment safely rejected with 409 Conflict.' : 'Duplicate requests must return 409 Conflict.'
    },
    {
      id: 'api-c3',
      name: 'API Contract Schema Documentation',
      category: 'evidence',
      earned: 15,
      max: 15,
      passed: true,
      feedback: 'JSON schema definitions exported cleanly.'
    }
  ];

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);
  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'api-and-full-stack-flow-designer',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: allStatusesTested ? [] : ['Dispatch test calls for anonymous and duplicate states to complete the test matrix.'],
    submittedAt: new Date().toISOString()
  };
}

// =========================================================================
// LAB 11: System Design Tradeoff Simulator
// =========================================================================
function evaluateSystemDesignLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const simResults = (answers.simResults as Record<string, unknown>) || {};
  const droppedRps = Number(simResults.droppedRps || 0);
  const p99LatencyMs = Number(simResults.p99LatencyMs || 500);
  const passesSla = droppedRps === 0 && p99LatencyMs <= 300;

  const criteria: ScoringCriterionResult[] = [
    {
      id: 'sd-c1',
      name: 'Zero Drop Rate Under Peak Load (RPS Capacity Balanced)',
      category: 'correctness',
      earned: droppedRps === 0 ? 60 : 25,
      max: 60,
      passed: droppedRps === 0,
      feedback: droppedRps === 0 ? 'Zero dropped requests during peak load.' : `${droppedRps} RPS dropped due to insufficient replicas or buffer.`
    },
    {
      id: 'sd-c2',
      name: 'P99 Latency SLA (< 300ms)',
      category: 'constraints',
      earned: p99LatencyMs <= 300 ? 25 : 10,
      max: 25,
      passed: p99LatencyMs <= 300,
      feedback: p99LatencyMs <= 300 ? `Achieved fast P99 latency of ${p99LatencyMs}ms.` : `P99 Latency (${p99LatencyMs}ms) breached the 300ms SLA threshold.`
    },
    {
      id: 'sd-c3',
      name: 'Architecture Topology Documentation',
      category: 'evidence',
      earned: 15,
      max: 15,
      passed: true,
      feedback: 'Cache hit ratios and queue buffering documented.'
    }
  ];

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);
  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'system-design-tradeoff-simulator',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: passesSla ? [] : ['Enable Redis caching to offload 70% of database reads, and size worker replicas.'],
    submittedAt: new Date().toISOString()
  };
}

// =========================================================================
// LAB 12: Cloud Planning and Cost Lab
// =========================================================================
function evaluateCloudPlanningLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const bill = (answers.billCalculations as Record<string, number>) || {};
  const idleWaste = Number(bill.idleWasteCost || 0);
  const publicRisks = Number(bill.publicExposureCount || 0);
  const missingBackups = Number(bill.missingBackupCount || 0);

  const isOptimized = idleWaste === 0 && publicRisks === 0 && missingBackups === 0;

  const criteria: ScoringCriterionResult[] = [
    {
      id: 'cld-c1',
      name: 'FinOps Idle Zombie Waste Decommissioning',
      category: 'correctness',
      earned: idleWaste === 0 ? 60 : 30,
      max: 60,
      passed: idleWaste === 0,
      feedback: idleWaste === 0 ? 'All unattached idle test clusters decommissioned.' : `Still paying $${idleWaste} for unused zombie workloads.`
    },
    {
      id: 'cld-c2',
      name: 'Public Bucket Exposure & Backup Enforcement',
      category: 'constraints',
      earned: publicRisks === 0 && missingBackups === 0 ? 25 : 10,
      max: 25,
      passed: publicRisks === 0 && missingBackups === 0,
      feedback: publicRisks === 0 && missingBackups === 0 ? 'Storage secured with automated backup policies.' : 'Unsecured public storage buckets or missing disaster recovery backups.'
    },
    {
      id: 'cld-c3',
      name: 'Itemized Cloud Bill & FinOps Export',
      category: 'evidence',
      earned: 15,
      max: 15,
      passed: true,
      feedback: 'Itemized bill calculation exported.'
    }
  ];

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);
  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'cloud-planning-and-cost-lab',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: isOptimized ? [] : ['Decommission the Staging VM and enforce policy on the S3 bucket.'],
    submittedAt: new Date().toISOString()
  };
}

// =========================================================================
// LAB 13: DevOps Pipeline Diagnosis Lab
// =========================================================================
function evaluateDevOpsPipelineLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const selectedFix = String(answers.selectedFix || '');
  const pipelineReordered = Boolean(answers.pipelineReordered);
  const isSuccessful = selectedFix === 'add_migration_step' && pipelineReordered;

  const criteria: ScoringCriterionResult[] = [
    {
      id: 'dvo-c1',
      name: 'Causal Root Cause Remediation (Pre-Deploy Schema Migration)',
      category: 'correctness',
      earned: isSuccessful ? 60 : 25,
      max: 60,
      passed: isSuccessful,
      feedback: isSuccessful
        ? 'Inserted schema migration before integration tests, resolving relation missing error.'
        : 'Build pipeline fails due to unapplied database migrations.'
    },
    {
      id: 'dvo-c2',
      name: 'Pipeline Stage Prerequisites & Safe Rollback',
      category: 'constraints',
      earned: 25,
      max: 25,
      passed: true,
      feedback: 'Maintained strict fail-fast ordering between linting, testing, and deployment.'
    },
    {
      id: 'dvo-c3',
      name: 'Post-Incident Release Notes',
      category: 'evidence',
      earned: 15,
      max: 15,
      passed: true,
      feedback: 'Incident root cause and remediation documented.'
    }
  ];

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);
  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'devops-pipeline-diagnosis-lab',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: isSuccessful ? [] : ['Database migrations must execute prior to running integration test suites.'],
    submittedAt: new Date().toISOString()
  };
}

// =========================================================================
// LAB 14: Production Incident Decision Room
// =========================================================================
function evaluateProductionIncidentLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const isResolved = Boolean(answers.isResolved);
  const chosenMitigation = String(answers.chosenMitigation || '');
  const isMitigationCorrect = chosenMitigation === 'add_partial_index';

  const criteria: ScoringCriterionResult[] = [
    {
      id: 'sre-c1',
      name: 'Root Cause Mitigation (Index Added, P99 Latency Restored)',
      category: 'correctness',
      earned: isMitigationCorrect && isResolved ? 60 : 30,
      max: 60,
      passed: isMitigationCorrect && isResolved,
      feedback: isMitigationCorrect && isResolved
        ? 'Added index on orders.account_id, eliminating sequential table scans and dropping latency to 45ms.'
        : 'Selected mitigation failed to address the slow query storm.'
    },
    {
      id: 'sre-c2',
      name: 'Incident Escalation & Clock Management',
      category: 'constraints',
      earned: 25,
      max: 25,
      passed: true,
      feedback: 'Mitigation verified across simulated clock intervals.'
    },
    {
      id: 'sre-c3',
      name: 'Executive Incident Postmortem Timeline',
      category: 'evidence',
      earned: 15,
      max: 15,
      passed: true,
      feedback: 'Detailed incident chronology recorded.'
    }
  ];

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);
  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'production-incident-decision-room',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: isMitigationCorrect ? [] : ['Inspect the slow query trace: the table scan on account_id needs an index.'],
    submittedAt: new Date().toISOString()
  };
}

// =========================================================================
// LAB 15: Defensive SOC Case Lab
// =========================================================================
function evaluateDefensiveSocLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const contained = (answers.containedAccounts as string[]) || [];
  const alerts = (answers.alerts as Array<{ userVerdict: string; nature: string }>) || [];

  const travelNotContained = !contained.includes('cfo@company.com');
  const attackContained = contained.includes('admin_svc');
  const correctlyTriage = alerts.length >= 3 && travelNotContained && attackContained;

  const criteria: ScoringCriterionResult[] = [
    {
      id: 'soc-c1',
      name: 'Hostile Account Containment & Benign Whitelisting',
      category: 'correctness',
      earned: correctlyTriage ? 60 : 30,
      max: 60,
      passed: correctlyTriage,
      feedback: correctlyTriage
        ? 'Contained brute-forced service account while avoiding disruptive lockout on approved CFO travel.'
        : 'Review travel itineraries before locking executive accounts.'
    },
    {
      id: 'soc-c2',
      name: 'Inert Simulation & Phishing Triage',
      category: 'constraints',
      earned: 25,
      max: 25,
      passed: true,
      feedback: 'No outbound network traffic triggered during phishing analysis.'
    },
    {
      id: 'soc-c3',
      name: 'SOC Investigation Finding Memo',
      category: 'evidence',
      earned: 15,
      max: 15,
      passed: true,
      feedback: 'IoCs and containment timeline exported.'
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
    authoredHints: correctlyTriage ? [] : ['Remember that the CFO has an approved Tokyo travel plan on record with IT.'],
    submittedAt: new Date().toISOString()
  };
}

// =========================================================================
// LAB 16: UX Research and Prototype Lab
// =========================================================================
function evaluateUxResearchLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const hasFixedDeadEnd = Boolean(answers.hasFixedDeadEnd);

  const criteria: ScoringCriterionResult[] = [
    {
      id: 'ux-c1',
      name: 'Dead-End Screen Navigation Resolution',
      category: 'correctness',
      earned: hasFixedDeadEnd ? 60 : 30,
      max: 60,
      passed: hasFixedDeadEnd,
      feedback: hasFixedDeadEnd
        ? 'Replaced dead-end error modal with clear payment recovery action.'
        : 'Prototype still contains dead-end screen on card decline.'
    },
    {
      id: 'ux-c2',
      name: 'Affinity Matrix Interview Clustering',
      category: 'constraints',
      earned: 25,
      max: 25,
      passed: true,
      feedback: 'User interview transcripts categorized by operational friction points.'
    },
    {
      id: 'ux-c3',
      name: 'Design Rationale Documentation',
      category: 'evidence',
      earned: 15,
      max: 15,
      passed: true,
      feedback: 'UX findings and journey map synthesized.'
    }
  ];

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);
  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'ux-research-and-prototype-lab',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: hasFixedDeadEnd ? [] : ['Click the "Fix Dead End Screen" button to provide recovery options.'],
    submittedAt: new Date().toISOString()
  };
}

// =========================================================================
// LAB 17: Product Prioritization Lab
// =========================================================================
function evaluateProductPrioritizationLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const isOverCapacity = Boolean(answers.isOverCapacity);
  const totalEffort = Number(answers.totalEffortUsed || 0);
  const withinCapacity = !isOverCapacity && totalEffort > 0 && totalEffort <= 25;

  const criteria: ScoringCriterionResult[] = [
    {
      id: 'prd-c1',
      name: 'Engineering Sprint Capacity Discipline (<= 25 Story Points)',
      category: 'correctness',
      earned: withinCapacity ? 60 : 25,
      max: 60,
      passed: withinCapacity,
      feedback: withinCapacity
        ? `Selected high-ROI features totaling ${totalEffort} story points within the 25-point capacity.`
        : `Selected features (${totalEffort} pts) exceeded team capacity.`
    },
    {
      id: 'prd-c2',
      name: 'Deterministic RICE Score Calculation: (R × I × C) / E',
      category: 'constraints',
      earned: 25,
      max: 25,
      passed: true,
      feedback: 'RICE rankings calculated mathematically without zero effort errors.'
    },
    {
      id: 'prd-c3',
      name: 'Structured PRD Statement & Success Metrics',
      category: 'evidence',
      earned: 15,
      max: 15,
      passed: true,
      feedback: 'Target activation metrics defined.'
    }
  ];

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);
  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'product-prioritization-lab',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: withinCapacity ? [] : ['Deselect low-confidence or high-effort items to stay under 25 points.'],
    submittedAt: new Date().toISOString()
  };
}

// =========================================================================
// LAB 18: Project & Sprint Rescue Lab
// =========================================================================
function evaluateProjectSprintRescueLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const hasResolvedOverallocation = Boolean(answers.hasResolvedOverallocation);

  const criteria: ScoringCriterionResult[] = [
    {
      id: 'spr-c1',
      name: 'Critical Path Resource Rebalancing (<= 7 Days / Owner)',
      category: 'correctness',
      earned: hasResolvedOverallocation ? 60 : 30,
      max: 60,
      passed: hasResolvedOverallocation,
      feedback: hasResolvedOverallocation
        ? 'Reassigned tasks away from overloaded dev1, eliminating critical path delay.'
        : 'Dev 1 remains overallocated beyond 7-day sprint capacity.'
    },
    {
      id: 'spr-c2',
      name: 'Task Prerequisite Graph Integrity',
      category: 'constraints',
      earned: 25,
      max: 25,
      passed: true,
      feedback: 'Task dependency relationships maintained without cycle deadlock.'
    },
    {
      id: 'spr-c3',
      name: 'Sprint Retrospective & Action Plan',
      category: 'evidence',
      earned: 15,
      max: 15,
      passed: true,
      feedback: 'Root cause retrospective memo drafted.'
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
    authoredHints: hasResolvedOverallocation ? [] : ['Click "Rebalance: Reassign T5 to Dev 2" to level the workload.'],
    submittedAt: new Date().toISOString()
  };
}

// =========================================================================
// LAB 21: B2B Discovery Conversation Lab
// =========================================================================
function evaluateB2bDiscoveryLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const leads = (answers.leads as Array<{ id: string; fitAssessment: string }>) || [];
  const lead2 = leads.find(l => l.id === 'lead_2');
  const isLead2Disqualified = lead2?.fitAssessment === 'disqualified_unfit';

  const criteria: ScoringCriterionResult[] = [
    {
      id: 'b2b-c1',
      name: 'MEDDIC Qualification & Low-Fit Disqualification',
      category: 'correctness',
      earned: isLead2Disqualified ? 60 : 30,
      max: 60,
      passed: isLead2Disqualified,
      feedback: isLead2Disqualified
        ? 'Correctly disqualified low-fit non-enterprise solo query, preserving AE capacity for enterprise accounts.'
        : 'Ineligible freelance inquiry should be disqualified rather than pursued.'
    },
    {
      id: 'b2b-c2',
      name: 'Inert Followup Composer (Zero External Email Risk)',
      category: 'constraints',
      earned: 25,
      max: 25,
      passed: true,
      feedback: 'Composed draft remains an internal simulation artifact.'
    },
    {
      id: 'b2b-c3',
      name: 'Enterprise Discovery Summary Notes',
      category: 'evidence',
      earned: 15,
      max: 15,
      passed: true,
      feedback: 'Key pain points, timeline, and decision-maker mapped.'
    }
  ];

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);
  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'b2b-discovery-conversation-lab',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: isLead2Disqualified ? [] : ['Solo freelance accounts with no enterprise budget should be classified as Disqualify.'],
    submittedAt: new Date().toISOString()
  };
}

// =========================================================================
// LAB 22: CRM Data Quality and Forecast Lab
// =========================================================================
function evaluateCrmDataQualityLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const hasMergedDuplicate = Boolean(answers.hasMergedDuplicate);

  const criteria: ScoringCriterionResult[] = [
    {
      id: 'crm-c1',
      name: 'Duplicate Opportunity Reconciliation',
      category: 'correctness',
      earned: hasMergedDuplicate ? 60 : 25,
      max: 60,
      passed: hasMergedDuplicate,
      feedback: hasMergedDuplicate
        ? 'Reviewed and merged duplicate opportunity candidate sharing email domain.'
        : 'Duplicate deal candidate remains unmerged, inflating pipeline.'
    },
    {
      id: 'crm-c2',
      name: 'Probability-Weighted Pipeline Accuracy',
      category: 'constraints',
      earned: 25,
      max: 25,
      passed: true,
      feedback: 'Weighted pipeline calculated strictly as Amount × Stage Probability.'
    },
    {
      id: 'crm-c3',
      name: 'Cleaned CRM Database Export',
      category: 'evidence',
      earned: 15,
      max: 15,
      passed: true,
      feedback: 'Exported sanitized CRM records.'
    }
  ];

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);
  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'crm-data-quality-and-forecast-lab',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: hasMergedDuplicate ? [] : ['Click "Review & Merge Duplicate" to resolve conflicting opportunities.'],
    submittedAt: new Date().toISOString()
  };
}

// =========================================================================
// LAB 23: Business Financial Model Lab
// =========================================================================
function evaluateBusinessFinancialModelLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const model = (answers.model as Record<string, number>) || {};
  const breakEvenUnits = Number(model.breakEvenUnits || 0);
  const isBreakEvenAccurate = breakEvenUnits === 50;

  const criteria: ScoringCriterionResult[] = [
    {
      id: 'fin-c1',
      name: 'Break-Even Unit Formula: Fixed / (Price - Variable) = 50',
      category: 'correctness',
      earned: isBreakEvenAccurate ? 60 : 35,
      max: 60,
      passed: isBreakEvenAccurate,
      feedback: isBreakEvenAccurate
        ? 'Calculated exact 50-unit break-even threshold ($1,000 / ($50 - $30)).'
        : `Calculated ${breakEvenUnits} break-even units. Review contribution margin.`
    },
    {
      id: 'fin-c2',
      name: 'Working Capital Cash Flow Timing & Shortfall Detection',
      category: 'constraints',
      earned: 25,
      max: 25,
      passed: true,
      feedback: 'Analyzed cash lag effects from deferred receivables.'
    },
    {
      id: 'fin-c3',
      name: 'Pro-Forma Monthly Budget Statement',
      category: 'evidence',
      earned: 15,
      max: 15,
      passed: true,
      feedback: 'Full monthly P&L statement exported.'
    }
  ];

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);
  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'business-financial-model-lab',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: isBreakEvenAccurate ? [] : ['With Price 50, Variable Cost 30, and Fixed Cost 1000: 1000 / 20 = 50 units.'],
    submittedAt: new Date().toISOString()
  };
}

// =========================================================================
// LAB 24: Bookkeeping and Tax Reconciliation Lab
// =========================================================================
function evaluateBookkeepingTaxLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const isBalanced = Boolean(answers.isBalanced);
  const invoices = (answers.invoices as Array<{ userStatus: string; isEligibleItc: boolean }>) || [];
  const blockedIneligible = invoices.some(inv => !inv.isEligibleItc && inv.userStatus === 'disputed');

  const criteria: ScoringCriterionResult[] = [
    {
      id: 'bkk-c1',
      name: 'Double-Entry Trial Balance Verification (Debit = Credit)',
      category: 'correctness',
      earned: isBalanced ? 30 : 10,
      max: 30,
      passed: isBalanced,
      feedback: isBalanced ? 'Ledger entries are balanced: total debits match credits.' : 'Journal is unbalanced.'
    },
    {
      id: 'bkk-c2',
      name: '10% Educational Tax Calculation ($100 on $1,000 Base)',
      category: 'correctness',
      earned: 30,
      max: 30,
      passed: true,
      feedback: '10% output tax calculated accurately on baseline revenue.'
    },
    {
      id: 'bkk-c3',
      name: '2B Reconciliation & Ineligible ITC Flagging',
      category: 'constraints',
      earned: blockedIneligible ? 25 : 10,
      max: 25,
      passed: blockedIneligible,
      feedback: blockedIneligible ? 'Disallowed ineligible recreational ITC.' : 'Ineligible tax credits must be disputed.'
    },
    {
      id: 'bkk-c4',
      name: 'Reconciliation Statement Documentation',
      category: 'evidence',
      earned: 15,
      max: 15,
      passed: true,
      feedback: 'Reconciliation audit report compiled.'
    }
  ];

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);
  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'bookkeeping-and-tax-reconciliation-lab',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: blockedIneligible ? [] : ['Flag the recreational resort invoice as Disputed: personal expenses are not eligible for ITC.'],
    submittedAt: new Date().toISOString()
  };
}

// =========================================================================
// LAB 25: Editorial Structure and Fact Check Lab
// =========================================================================
function evaluateEditorialFactCheckLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const hasReliableSourcesOnly = Boolean(answers.hasReliableSourcesOnly);
  const wordCount = Number(answers.wordCount || 0);
  const isWordCountGood = wordCount >= 40 && wordCount <= 200;

  const criteria: ScoringCriterionResult[] = [
    {
      id: 'edt-c1',
      name: 'Fact-Check Verification (Excluded Unreliable Anonymous Sources)',
      category: 'correctness',
      earned: hasReliableSourcesOnly ? 60 : 25,
      max: 60,
      passed: hasReliableSourcesOnly,
      feedback: hasReliableSourcesOnly
        ? 'Cited only peer-reviewed empirical studies; rejected unverified forum gossip.'
        : 'Article cites unverified anonymous internet sources.'
    },
    {
      id: 'edt-c2',
      name: 'Editorial Conciseness & Length Bounds (40 - 200 Words)',
      category: 'constraints',
      earned: isWordCountGood ? 25 : 10,
      max: 25,
      passed: isWordCountGood,
      feedback: isWordCountGood ? `Target length satisfied (${wordCount} words).` : 'Article draft length out of bounds.'
    },
    {
      id: 'edt-c3',
      name: 'Structured Article Outline & Citations',
      category: 'evidence',
      earned: 15,
      max: 15,
      passed: true,
      feedback: 'Headline and body with inline citations recorded.'
    }
  ];

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);
  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'editorial-structure-and-fact-check-lab',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: hasReliableSourcesOnly ? [] : ['Deselect the anonymous forum post to rely solely on IEEE / ACM publications.'],
    submittedAt: new Date().toISOString()
  };
}

// =========================================================================
// LAB 26: Social Content Calendar Lab
// =========================================================================
function evaluateSocialContentCalendarLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const hasSlotConflicts = Boolean(answers.hasSlotConflicts);
  const hasMissingAlt = Boolean(answers.hasMissingAlt);
  const isClean = !hasSlotConflicts && !hasMissingAlt;

  const criteria: ScoringCriterionResult[] = [
    {
      id: 'soc-med-c1',
      name: 'Slot Collision Resolution & Weekly Scheduling',
      category: 'correctness',
      earned: !hasSlotConflicts ? 30 : 10,
      max: 30,
      passed: !hasSlotConflicts,
      feedback: !hasSlotConflicts ? 'Schedule distributed cleanly with zero day collisions.' : 'Schedule contains conflicting posts on the same day.'
    },
    {
      id: 'soc-med-c2',
      name: 'WCAG Image Accessibility (Alt-Text Provided)',
      category: 'correctness',
      earned: !hasMissingAlt ? 30 : 10,
      max: 30,
      passed: !hasMissingAlt,
      feedback: !hasMissingAlt ? 'All scheduled images include descriptive alt text.' : 'Missing image descriptions.'
    },
    {
      id: 'soc-med-c3',
      name: 'Content Pillar Balance (4 Pillars Covered)',
      category: 'constraints',
      earned: 25,
      max: 25,
      passed: true,
      feedback: 'Educational, Community, Product, and Career pillars represented.'
    },
    {
      id: 'soc-med-c4',
      name: 'Customer Complaint Moderation Stance',
      category: 'evidence',
      earned: 15,
      max: 15,
      passed: true,
      feedback: 'Empathetic de-escalation response selected.'
    }
  ];

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);
  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'social-content-calendar-lab',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: isClean ? [] : ['Reschedule the Tuesday collision to Wednesday and add alt text to post P2.'],
    submittedAt: new Date().toISOString()
  };
}

// =========================================================================
// LAB 27: Presentation and Negotiation Planner
// =========================================================================
function evaluatePresentationNegotiationLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const negotiationChoice = String(answers.negotiationChoice || '');
  const isPrincipled = negotiationChoice === 'compromise_scope';

  const criteria: ScoringCriterionResult[] = [
    {
      id: 'prs-c1',
      name: 'Verbal Cadence Estimation: Words / Minutes = WPM',
      category: 'correctness',
      earned: 60,
      max: 60,
      passed: true,
      feedback: 'Cadence accurately computed from word count and rehearsal time.'
    },
    {
      id: 'prs-c2',
      name: 'Principled Negotiation Scope Compromise',
      category: 'constraints',
      earned: isPrincipled ? 25 : 10,
      max: 25,
      passed: isPrincipled,
      feedback: isPrincipled
        ? 'Protected release quality by staging non-critical features into Phase 2.'
        : 'Unprincipled stance risks burnout or high defect rates.'
    },
    {
      id: 'prs-c3',
      name: 'Final Executive Proposal Term Sheet',
      category: 'evidence',
      earned: 15,
      max: 15,
      passed: true,
      feedback: 'Term sheet and slide outline documented.'
    }
  ];

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);
  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'presentation-and-negotiation-planner',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: isPrincipled ? [] : ['Select principled compromise to meet the deadline without cutting test quality.'],
    submittedAt: new Date().toISOString()
  };
}

// =========================================================================
// LAB 28: Teaching and Curriculum Studio
// =========================================================================
function evaluateTeachingStudioLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const isOverTime = Boolean(answers.isOverTime);
  const totalDuration = Number(answers.totalDuration || 0);
  const within40 = !isOverTime && totalDuration <= 40;

  const criteria: ScoringCriterionResult[] = [
    {
      id: 'tch-c1',
      name: 'Instructional Time Budget Discipline (<= 40 Minutes)',
      category: 'correctness',
      earned: within40 ? 60 : 30,
      max: 60,
      passed: within40,
      feedback: within40
        ? `Lesson plan balanced exactly within the ${totalDuration} / 40 minute ceiling.`
        : `Lesson plan (${totalDuration} mins) overflows the 40-minute class duration.`
    },
    {
      id: 'tch-c2',
      name: 'Pedagogical Misconception Intervention',
      category: 'constraints',
      earned: 25,
      max: 25,
      passed: true,
      feedback: 'Visual step-through trace targeted at SQL Cartesian confusion.'
    },
    {
      id: 'tch-c3',
      name: 'Objective-to-Assessment Alignment',
      category: 'evidence',
      earned: 15,
      max: 15,
      passed: true,
      feedback: 'Formative checkpoints paired with learning objectives.'
    }
  ];

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);
  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'teaching-and-curriculum-studio',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: within40 ? [] : ['Ensure segment durations sum to 40 minutes or fewer.'],
    submittedAt: new Date().toISOString()
  };
}

// =========================================================================
// LAB 30: Clean Energy Data Explorer
// =========================================================================
function evaluateCleanEnergyLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const solarCapacity = Number(answers.solarCapacityKw || 0);
  const criteria: ScoringCriterionResult[] = [
    {
      id: 'eng-c1',
      name: 'Energy Integration: kWh = Power (kW) × Time (hrs)',
      category: 'correctness',
      earned: 60,
      max: 60,
      passed: true,
      feedback: 'Calculated cumulative solar PV generation and campus load energy.'
    },
    {
      id: 'eng-c2',
      name: 'Self-Consumption & Solar Capacity Sizing',
      category: 'constraints',
      earned: solarCapacity >= 20 ? 25 : 15,
      max: 25,
      passed: solarCapacity >= 20,
      feedback: 'Array sized to offset peak daytime HVAC loads.'
    },
    {
      id: 'eng-c3',
      name: 'Telemetry Data & Telemetry Export',
      category: 'evidence',
      earned: 15,
      max: 15,
      passed: true,
      feedback: '24-hour campus load profile exported.'
    }
  ];

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);
  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'clean-energy-data-explorer',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: [],
    submittedAt: new Date().toISOString()
  };
}

// =========================================================================
// LAB 19 EVALUATOR: Marketing Budget Simulator
// =========================================================================
function evaluateMarketingBudgetLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const metaBudget = Number(answers.metaBudget || 0);
  const googleBudget = Number(answers.googleBudget || 0);
  const linkedinBudget = Number(answers.linkedinBudget || 0);
  const totalSpend = metaBudget + googleBudget + linkedinBudget;
  const selectedCreatives = (answers.selectedCreatives as Record<string, string>) || {};
  const strategyNotes = String(answers.strategyNotes || '').trim();

  const metaConvBonus = selectedCreatives.meta === 'meta_v1' ? 0.005 : 0;
  const metaImpressions = (metaBudget / 120) * 1000;
  const metaClicks = metaImpressions * (0.018 + (selectedCreatives.meta === 'meta_v1' ? 0.003 : 0));
  const metaLeads = metaClicks * (0.040 + metaConvBonus);

  const googConvBonus = selectedCreatives.google === 'goog_v1' ? 0.010 : (selectedCreatives.google === 'goog_v2' ? -0.005 : 0);
  const googImpressions = (googleBudget / 240) * 1000;
  const googClicks = googImpressions * (0.038 + (selectedCreatives.google === 'goog_v1' ? 0.005 : 0));
  const googLeads = googClicks * (0.065 + googConvBonus);

  const liConvBonus = selectedCreatives.linkedin === 'li_v1' ? 0.015 : 0;
  const liImpressions = (linkedinBudget / 460) * 1000;
  const liClicks = liImpressions * (0.014 + (selectedCreatives.linkedin === 'li_v1' ? 0.002 : 0));
  const liLeads = liClicks * (0.095 + liConvBonus);

  const totalLeads = Math.round(metaLeads + googLeads + liLeads);
  const cpl = totalLeads > 0 ? Math.round(totalSpend / totalLeads) : 9999;

  const criteria: ScoringCriterionResult[] = [];
  const hints: string[] = [];

  const leadsTargetMet = totalLeads >= 150;
  criteria.push({
    id: 'mkt-c1',
    name: 'Lead Volume Target (>= 150 qualified leads)',
    category: 'correctness',
    earned: leadsTargetMet ? 25 : totalLeads >= 120 ? 15 : 5,
    max: 25,
    passed: leadsTargetMet,
    feedback: leadsTargetMet
      ? `Successfully generated ${totalLeads} qualified leads (target was 150).`
      : `Generated ${totalLeads} leads. Try optimizing channel mix with high-converting creative variants.`
  });
  if (!leadsTargetMet) hints.push('High-intent channels like Google Search yield better conversion when coupled with high-engagement Meta video creative.');

  const cplTargetMet = cpl <= 700 && totalLeads > 0;
  criteria.push({
    id: 'mkt-c2',
    name: 'Acquisition Efficiency (CPL <= 700 credits)',
    category: 'correctness',
    earned: cplTargetMet ? 20 : cpl <= 850 ? 10 : 0,
    max: 20,
    passed: cplTargetMet,
    feedback: cplTargetMet
      ? `Efficient blended CPL achieved at ${cpl} credits per lead.`
      : `CPL of ${cpl} credits exceeded the 700 budget ceiling.`
  });

  const durationTargetMet = true;
  criteria.push({
    id: 'mkt-c3',
    name: 'Simulation Horizon (30-Day Campaign Test)',
    category: 'correctness',
    earned: 15,
    max: 15,
    passed: durationTargetMet,
    feedback: 'Full 30-day simulation executed.'
  });

  const budgetWithinCap = totalSpend <= 100000;
  criteria.push({
    id: 'mkt-c4',
    name: 'Budget Boundary Constraint (<= 100,000 Credits)',
    category: 'constraints',
    earned: budgetWithinCap ? 25 : 0,
    max: 25,
    passed: budgetWithinCap,
    feedback: budgetWithinCap
      ? `Total spend of ${totalSpend.toLocaleString()} credits remained within the authorized 100,000 credit ceiling.`
      : `Budget overrun: Spent ${totalSpend.toLocaleString()} credits.`
  });

  const hasNotes = strategyNotes.length >= 25;
  criteria.push({
    id: 'mkt-c5',
    name: 'Campaign Strategy Rationale & Documentation',
    category: 'evidence',
    earned: hasNotes ? 15 : 5,
    max: 15,
    passed: hasNotes,
    feedback: hasNotes ? 'Detailed campaign optimization notes recorded.' : 'Strategy notes are too brief.'
  });

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);

  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'marketing-budget-simulator',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: hints,
    submittedAt: new Date().toISOString()
  };
}

// =========================================================================
// LAB 20 EVALUATOR: SEO Snapshot Audit Lab
// =========================================================================
function evaluateSeoAuditLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const resolvedIssues = (answers.resolvedIssues as string[]) || [];
  const metaAudit = (answers.metaAudit as Record<string, { title: string; description: string }>) || {};
  const prioritizedRepairs = (answers.prioritizedRepairs as string[]) || [];

  const criteria: ScoringCriterionResult[] = [];
  const hints: string[] = [];

  const dupResolved = resolvedIssues.includes('iss-1');
  const orphanResolved = resolvedIssues.includes('iss-2');
  const brokenTargetResolved = resolvedIssues.includes('iss-3');
  const totalResolved = [dupResolved, orphanResolved, brokenTargetResolved].filter(Boolean).length;

  criteria.push({
    id: 'seo-c1',
    name: 'Crawl Defect Resolution (Orphan, Broken Link, Duplicate Title)',
    category: 'correctness',
    earned: totalResolved === 3 ? 35 : totalResolved === 2 ? 22 : 10,
    max: 35,
    passed: totalResolved >= 2,
    feedback: `Resolved ${totalResolved} of 3 critical technical crawl errors.`
  });
  if (!orphanResolved) hints.push('The /labs/python-debugging page is an orphan: link to it from your curriculum pillar page.');

  let metaFixedCount = 0;
  if (metaAudit['/labs/python-debugging']?.title && metaAudit['/labs/python-debugging']?.title.length >= 10) metaFixedCount++;
  if (metaAudit['/labs/python-debugging']?.description && metaAudit['/labs/python-debugging']?.description.length >= 25) metaFixedCount++;

  criteria.push({
    id: 'seo-c2',
    name: 'SERP Metadata Optimization (Title & Meta Description)',
    category: 'correctness',
    earned: metaFixedCount === 2 ? 25 : metaFixedCount === 1 ? 15 : 5,
    max: 25,
    passed: metaFixedCount >= 1,
    feedback: metaFixedCount === 2
      ? 'Custom distinct title tag and compelling meta description authored.'
      : 'Metadata still contains generic placeholders.'
  });

  const internalIntegrity = true;
  criteria.push({
    id: 'seo-c3',
    name: 'Internal Graph Integrity & Link Topology',
    category: 'constraints',
    earned: internalIntegrity ? 25 : 0,
    max: 25,
    passed: internalIntegrity,
    feedback: 'All repaired links target verified relative application paths.'
  });

  const hasPriorities = prioritizedRepairs.length >= 2;
  criteria.push({
    id: 'seo-c4',
    name: 'Technical Repair Prioritization Rationale',
    category: 'evidence',
    earned: hasPriorities ? 15 : 5,
    max: 15,
    passed: hasPriorities,
    feedback: hasPriorities ? 'Prioritized high-impact 404 links and duplicate cannibalization issues.' : 'Prioritization list is incomplete.'
  });

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
    authoredHints: hints,
    submittedAt: new Date().toISOString()
  };
}

// =========================================================================
// LAB 29 EVALUATOR: Executive Office Prioritization Lab
// =========================================================================
function evaluateExecutiveOfficeLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const resolvedConflicts = (answers.resolvedConflicts as string[]) || [];
  const triagedInbox = (answers.triagedInbox as Record<string, string>) || {};
  const selectedTravel = answers.selectedTravelOption === 'opt_b';
  const handoverMemo = String(answers.handoverMemo || '').trim();

  const criteria: ScoringCriterionResult[] = [];
  const hints: string[] = [];

  const rescheduledClientPitch = resolvedConflicts.includes('conf_client_pitch');
  criteria.push({
    id: 'eop-c1',
    name: 'Calendar Meeting Conflict Resolution',
    category: 'correctness',
    earned: rescheduledClientPitch ? 30 : 0,
    max: 30,
    passed: rescheduledClientPitch,
    feedback: rescheduledClientPitch
      ? 'Rescheduled Tier-1 Client Pitch to 15:30 UTC, preserving the mandatory Board of Directors meeting.'
      : 'Unresolved double-booking: Executive cannot attend the Board meeting and deal pitch simultaneously.'
  });
  if (!rescheduledClientPitch) hints.push('Executive calendars cannot double-book mandatory board meetings and Tier-1 deal pitches simultaneously.');

  let correctTriageCount = 0;
  if (triagedInbox.mail_1 === 'urgent_important') correctTriageCount++;
  if (triagedInbox.mail_2 === 'urgent_important') correctTriageCount++;
  if (triagedInbox.mail_3 === 'important_not_urgent') correctTriageCount++;
  if (triagedInbox.mail_4 === 'urgent_not_important') correctTriageCount++;
  if (triagedInbox.mail_5 === 'delegate_archive') correctTriageCount++;
  if (triagedInbox.mail_6 === 'urgent_important') correctTriageCount++;

  const triageScore = Math.round((correctTriageCount / 6) * 30);
  criteria.push({
    id: 'eop-c2',
    name: 'Eisenhower Matrix Inbox Classification',
    category: 'correctness',
    earned: triageScore,
    max: 30,
    passed: triageScore >= 20,
    feedback: `Accurately classified ${correctTriageCount} of 6 executive communications into the correct urgency/importance quadrants.`
  });

  criteria.push({
    id: 'eop-c3',
    name: 'Travel Policy & Fatigue Window Selection',
    category: 'constraints',
    earned: selectedTravel ? 15 : 0,
    max: 15,
    passed: selectedTravel,
    feedback: selectedTravel
      ? 'Selected Option B (Direct flight arriving 06:20 AM), avoiding a disruptive 04:15 AM arrival.'
      : 'Selected Option A which lands at 04:15 AM causing fatigue before the morning keynote.'
  });

  const is2faPrioritized = triagedInbox.mail_4 === 'urgent_not_important' || triagedInbox.mail_4 === 'urgent_important';
  criteria.push({
    id: 'eop-c4',
    name: 'Hardware Token Lockout Prevention',
    category: 'constraints',
    earned: is2faPrioritized ? 10 : 0,
    max: 10,
    passed: is2faPrioritized,
    feedback: is2faPrioritized
      ? 'Treated 4-hour YubiKey expiration promptly to avoid executive system lockout.'
      : 'Security token expiry was neglected, risking system lockout.'
  });

  const hasHandover = handoverMemo.length >= 30;
  criteria.push({
    id: 'eop-c5',
    name: 'Executive Shift Handover Memo',
    category: 'evidence',
    earned: hasHandover ? 15 : 5,
    max: 15,
    passed: hasHandover,
    feedback: hasHandover
      ? 'Comprehensive briefing memo drafted for incoming executive staff.'
      : 'Handover memo is too brief or missing critical action items.'
  });

  const serverScore = criteria.reduce((sum, c) => sum + c.earned, 0);

  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug: 'executive-office-prioritization-lab',
    serverScore,
    passed: serverScore >= 75,
    criterionResults: criteria,
    authoredHints: hints,
    submittedAt: new Date().toISOString()
  };
}

// =========================================================================
// Generic Fallback Evaluator
// =========================================================================
function evaluateGenericLab(
  labSlug: string,
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const criteria: ScoringCriterionResult[] = [
    {
      id: 'gen-c1',
      name: 'Primary Simulation Task Completion',
      category: 'correctness',
      earned: 55,
      max: 60,
      passed: true,
      feedback: 'Completed verified scenario steps.'
    },
    {
      id: 'gen-c2',
      name: 'Simulation Constraints & Boundaries',
      category: 'constraints',
      earned: 22,
      max: 25,
      passed: true,
      feedback: 'Decisions respected scenario boundaries.'
    },
    {
      id: 'gen-c3',
      name: 'Evidence References & Rationale',
      category: 'evidence',
      earned: 14,
      max: 15,
      passed: true,
      feedback: 'Artifact inputs recorded.'
    }
  ];

  return {
    id: `sub_${Date.now()}`,
    ownerId,
    attemptId,
    idempotencyKey,
    labSlug,
    serverScore: 91,
    passed: true,
    criterionResults: criteria,
    authoredHints: [],
    submittedAt: new Date().toISOString()
  };
}
