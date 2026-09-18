'use client';

import React, { useState, useEffect } from 'react';
import { LabDefinition, LabScenarioVariant, LabSubmissionResult } from '@/lib/labs/types';
import LabShell from '@/components/labs/LabShell';

// Simulators for all 30 labs
import BusinessAnalystDeskLab from '@/components/labs/simulators/BusinessAnalystDeskLab';
import SpreadsheetMisLab from '@/components/labs/simulators/SpreadsheetMisLab';
import SqlQueryLogicLab from '@/components/labs/simulators/SqlQueryLogicLab';
import BiDashboardDesignLab from '@/components/labs/simulators/BiDashboardDesignLab';
import PythonLogicDebuggingLab from '@/components/labs/simulators/PythonLogicDebuggingLab';
import PromptDesignCritiqueLab from '@/components/labs/simulators/PromptDesignCritiqueLab';
import AgentWorkflowLogicLab from '@/components/labs/simulators/AgentWorkflowLogicLab';
import AiEvaluationCasebookLab from '@/components/labs/simulators/AiEvaluationCasebookLab';
import FrontendLayoutA11yLab from '@/components/labs/simulators/FrontendLayoutA11yLab';
import ApiFlowDesignerLab from '@/components/labs/simulators/ApiFlowDesignerLab';
import SystemDesignTradeoffLab from '@/components/labs/simulators/SystemDesignTradeoffLab';
import CloudPlanningCostLab from '@/components/labs/simulators/CloudPlanningCostLab';
import DevOpsPipelineDiagnosisLab from '@/components/labs/simulators/DevOpsPipelineDiagnosisLab';
import ProductionIncidentRoomLab from '@/components/labs/simulators/ProductionIncidentRoomLab';
import DefensiveSocCaseLab from '@/components/labs/simulators/DefensiveSocCaseLab';
import UxResearchPrototypeLab from '@/components/labs/simulators/UxResearchPrototypeLab';
import ProductPrioritizationLab from '@/components/labs/simulators/ProductPrioritizationLab';
import ProjectSprintRescueLab from '@/components/labs/simulators/ProjectSprintRescueLab';
import MarketingBudgetSimLab from '@/components/labs/simulators/MarketingBudgetSimLab';
import SeoSnapshotAuditLab from '@/components/labs/simulators/SeoSnapshotAuditLab';
import B2bDiscoveryConversationLab from '@/components/labs/simulators/B2bDiscoveryConversationLab';
import CrmDataQualityForecastLab from '@/components/labs/simulators/CrmDataQualityForecastLab';
import BusinessFinancialModelLab from '@/components/labs/simulators/BusinessFinancialModelLab';
import BookkeepingTaxReconciliationLab from '@/components/labs/simulators/BookkeepingTaxReconciliationLab';
import EditorialFactCheckLab from '@/components/labs/simulators/EditorialFactCheckLab';
import SocialContentCalendarLab from '@/components/labs/simulators/SocialContentCalendarLab';
import PresentationNegotiationLab from '@/components/labs/simulators/PresentationNegotiationLab';
import TeachingCurriculumStudioLab from '@/components/labs/simulators/TeachingCurriculumStudioLab';
import ExecutiveOfficePrioritizationLab from '@/components/labs/simulators/ExecutiveOfficePrioritizationLab';
import CleanEnergyDataExplorerLab from '@/components/labs/simulators/CleanEnergyDataExplorerLab';
import GenericComingSoonLab from '@/components/labs/simulators/GenericComingSoonLab';

interface Props {
  lab: LabDefinition;
  initialScenario?: LabScenarioVariant;
}

export default function LabWorkspaceClient({ lab, initialScenario }: Props) {
  const [attemptId, setAttemptId] = useState<string>('');
  const [revision, setRevision] = useState<number>(1);

  // Initialize or resume attempt on mount
  useEffect(() => {
    async function initAttempt() {
      try {
        const res = await fetch('/api/lab-attempts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            labSlug: lab.slug,
            scenarioId: initialScenario?.id || `${lab.slug}-default`,
            version: '1.0.0'
          })
        });

        if (res.ok) {
          const data = await res.json();
          setAttemptId(data.attemptId);
          setRevision(data.revision || 1);
        } else {
          setAttemptId(`local_${Date.now()}`);
        }
      } catch (err) {
        console.warn('Failed to register attempt on server; falling back to local mode:', err);
        setAttemptId(`local_${Date.now()}`);
      }
    }

    initAttempt();
  }, [lab.slug, initialScenario?.id]);

  // Handle draft saving
  const handleSaveDraft = async (draftState: Record<string, unknown>): Promise<boolean> => {
    try {
      localStorage.setItem(`sg_draft_${lab.slug}`, JSON.stringify(draftState));
    } catch (e) {
      console.warn('Failed to write to localStorage', e);
    }

    if (!attemptId || attemptId.startsWith('local_')) {
      return true;
    }

    try {
      const res = await fetch(`/api/lab-attempts/${attemptId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expectedRevision: revision,
          draftState
        })
      });

      if (res.ok) {
        const data = await res.json();
        setRevision(data.revision);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Handle submission
  const handleSubmitLab = async (answers: Record<string, unknown>): Promise<LabSubmissionResult> => {
    const idempotencyKey = `sub_${lab.slug}_${attemptId}_${Date.now()}`;

    const res = await fetch(`/api/lab-attempts/${attemptId || 'anon'}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idempotencyKey,
        answers,
        labSlug: lab.slug,
        variant: 'beginner'
      })
    });

    if (!res.ok) {
      throw new Error('Failed to submit lab');
    }

    const data = await res.json();
    return data.submission;
  };

  return (
    <LabShell
      lab={lab}
      initialScenario={initialScenario}
      onSaveDraft={handleSaveDraft}
      onSubmitLab={handleSubmitLab}
    >
      {({ scenario, variant, markDirty, triggerSubmit }) => {
        // Dispatch all 30 labs to their respective simulators
        switch (lab.slug) {
          case 'business-analyst-desk':
            return <BusinessAnalystDeskLab scenario={scenario} variant={variant} onDirty={markDirty} onSubmit={triggerSubmit} />;
          case 'spreadsheet-formula-and-mis-lab':
            return <SpreadsheetMisLab scenario={scenario} variant={variant} onDirty={markDirty} onSubmit={triggerSubmit} />;
          case 'sql-query-logic-lab':
            return <SqlQueryLogicLab scenario={scenario} variant={variant} onDirty={markDirty} onSubmit={triggerSubmit} />;
          case 'bi-dashboard-design-lab':
            return <BiDashboardDesignLab scenario={scenario} variant={variant} onDirty={markDirty} onSubmit={triggerSubmit} />;
          case 'python-logic-and-debugging-lab':
            return <PythonLogicDebuggingLab scenario={scenario} variant={variant} onDirty={markDirty} onSubmit={triggerSubmit} />;
          case 'prompt-design-and-response-critique-lab':
            return <PromptDesignCritiqueLab scenario={scenario} variant={variant} onDirty={markDirty} onSubmit={triggerSubmit} />;
          case 'agent-workflow-logic-lab':
            return <AgentWorkflowLogicLab scenario={scenario} variant={variant} onDirty={markDirty} onSubmit={triggerSubmit} />;
          case 'ai-evaluation-casebook':
            return <AiEvaluationCasebookLab scenario={scenario} variant={variant} onDirty={markDirty} onSubmit={triggerSubmit} />;
          case 'frontend-layout-and-accessibility-lab':
            return <FrontendLayoutA11yLab scenario={scenario} variant={variant} onDirty={markDirty} onSubmit={triggerSubmit} />;
          case 'api-and-full-stack-flow-designer':
            return <ApiFlowDesignerLab scenario={scenario} variant={variant} onDirty={markDirty} onSubmit={triggerSubmit} />;
          case 'system-design-tradeoff-simulator':
            return <SystemDesignTradeoffLab scenario={scenario} variant={variant} onDirty={markDirty} onSubmit={triggerSubmit} />;
          case 'cloud-planning-and-cost-lab':
            return <CloudPlanningCostLab scenario={scenario} variant={variant} onDirty={markDirty} onSubmit={triggerSubmit} />;
          case 'devops-pipeline-diagnosis-lab':
            return <DevOpsPipelineDiagnosisLab scenario={scenario} variant={variant} onDirty={markDirty} onSubmit={triggerSubmit} />;
          case 'production-incident-decision-room':
            return <ProductionIncidentRoomLab scenario={scenario} variant={variant} onDirty={markDirty} onSubmit={triggerSubmit} />;
          case 'defensive-soc-case-lab':
            return <DefensiveSocCaseLab scenario={scenario} variant={variant} onDirty={markDirty} onSubmit={triggerSubmit} />;
          case 'ux-research-and-prototype-lab':
            return <UxResearchPrototypeLab scenario={scenario} variant={variant} onDirty={markDirty} onSubmit={triggerSubmit} />;
          case 'product-prioritization-lab':
            return <ProductPrioritizationLab scenario={scenario} variant={variant} onDirty={markDirty} onSubmit={triggerSubmit} />;
          case 'project-and-sprint-rescue-lab':
            return <ProjectSprintRescueLab scenario={scenario} variant={variant} onDirty={markDirty} onSubmit={triggerSubmit} />;
          case 'marketing-budget-simulator':
            return <MarketingBudgetSimLab scenario={scenario} variant={variant} onDirty={markDirty} onSubmit={triggerSubmit} />;
          case 'seo-snapshot-audit-lab':
            return <SeoSnapshotAuditLab scenario={scenario} variant={variant} onDirty={markDirty} onSubmit={triggerSubmit} />;
          case 'b2b-discovery-conversation-lab':
            return <B2bDiscoveryConversationLab scenario={scenario} variant={variant} onDirty={markDirty} onSubmit={triggerSubmit} />;
          case 'crm-data-quality-and-forecast-lab':
            return <CrmDataQualityForecastLab scenario={scenario} variant={variant} onDirty={markDirty} onSubmit={triggerSubmit} />;
          case 'business-financial-model-lab':
            return <BusinessFinancialModelLab scenario={scenario} variant={variant} onDirty={markDirty} onSubmit={triggerSubmit} />;
          case 'bookkeeping-and-tax-reconciliation-lab':
            return <BookkeepingTaxReconciliationLab scenario={scenario} variant={variant} onDirty={markDirty} onSubmit={triggerSubmit} />;
          case 'editorial-structure-and-fact-check-lab':
            return <EditorialFactCheckLab scenario={scenario} variant={variant} onDirty={markDirty} onSubmit={triggerSubmit} />;
          case 'social-content-calendar-lab':
            return <SocialContentCalendarLab scenario={scenario} variant={variant} onDirty={markDirty} onSubmit={triggerSubmit} />;
          case 'presentation-and-negotiation-planner':
            return <PresentationNegotiationLab scenario={scenario} variant={variant} onDirty={markDirty} onSubmit={triggerSubmit} />;
          case 'teaching-and-curriculum-studio':
            return <TeachingCurriculumStudioLab scenario={scenario} variant={variant} onDirty={markDirty} onSubmit={triggerSubmit} />;
          case 'executive-office-prioritization-lab':
            return <ExecutiveOfficePrioritizationLab scenario={scenario} variant={variant} onDirty={markDirty} onSubmit={triggerSubmit} />;
          case 'clean-energy-data-explorer':
            return <CleanEnergyDataExplorerLab scenario={scenario} variant={variant} onDirty={markDirty} onSubmit={triggerSubmit} />;
          default:
            return <GenericComingSoonLab lab={lab} scenario={scenario} variant={variant} onDirty={markDirty} onSubmit={triggerSubmit} />;
        }
      }}
    </LabShell>
  );
}
