import { LabSubmissionResult } from '../types';
import { evaluateBusinessAnalystLab } from './business-analyst-desk';
import { evaluateSpreadsheetMisLab } from './spreadsheet-formula-and-mis-lab';
import { evaluateSqlQueryLogicLab } from './sql-query-logic-lab';
import { evaluateBiDashboardLab } from './bi-dashboard-design-lab';
import { evaluatePythonLogicLab } from './python-logic-and-debugging-lab';
import { evaluatePromptDesignLab } from './prompt-design-and-response-critique-lab';
import { evaluateAgentWorkflowLab } from './agent-workflow-logic-lab';
import { evaluateAiEvaluationLab } from './ai-evaluation-casebook';
import { evaluateFrontendLayoutLab } from './frontend-layout-and-accessibility-lab';
import { evaluateApiFlowDesignerLab } from './api-and-full-stack-flow-designer';
import { evaluateSystemDesignLab } from './system-design-tradeoff-simulator';
import { evaluateCloudPlanningLab } from './cloud-planning-and-cost-lab';
import { evaluateDevOpsPipelineLab } from './devops-pipeline-diagnosis-lab';
import { evaluateProductionIncidentLab } from './production-incident-decision-room';
import { evaluateDefensiveSocLab } from './defensive-soc-case-lab';
import { evaluateUxResearchLab } from './ux-research-and-prototype-lab';
import { evaluateProductPrioritizationLab } from './product-prioritization-lab';
import { evaluateProjectSprintRescueLab } from './project-and-sprint-rescue-lab';
import { evaluateMarketingBudgetLab } from './marketing-budget-simulator';
import { evaluateSeoAuditLab } from './seo-snapshot-audit-lab';
import { evaluateB2bDiscoveryLab } from './b2b-discovery-conversation-lab';
import { evaluateCrmDataQualityLab } from './crm-data-quality-and-forecast-lab';
import { evaluateBusinessFinancialModelLab } from './business-financial-model-lab';
import { evaluateBookkeepingTaxLab } from './bookkeeping-and-tax-reconciliation-lab';
import { evaluateEditorialFactCheckLab } from './editorial-structure-and-fact-check-lab';
import { evaluateSocialContentCalendarLab } from './social-content-calendar-lab';
import { evaluatePresentationNegotiationLab } from './presentation-and-negotiation-planner';
import { evaluateTeachingStudioLab } from './teaching-and-curriculum-studio';
import { evaluateExecutiveOfficeLab } from './executive-office-prioritization-lab';
import { evaluateCleanEnergyLab } from './clean-energy-data-explorer';
import { evaluateGenericLab } from './generic';

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
