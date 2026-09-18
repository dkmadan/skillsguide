'use client';

import React, { useState, useEffect } from 'react';
import { LabDefinition, LabScenarioVariant, LabSubmissionResult } from '@/lib/labs/types';
import LabShell from '@/components/labs/LabShell';
import MarketingBudgetSimLab from '@/components/labs/simulators/MarketingBudgetSimLab';
import SeoSnapshotAuditLab from '@/components/labs/simulators/SeoSnapshotAuditLab';
import ExecutiveOfficePrioritizationLab from '@/components/labs/simulators/ExecutiveOfficePrioritizationLab';
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
        // Check local storage for existing attempt draft
        const localKey = `sg_attempt_${lab.slug}`;
        const localDraft = localStorage.getItem(localKey);

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
          // Local fallback ID
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
    // Always persist to localStorage for offline resilience
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
    } catch (err) {
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
        // Select simulator
        if (lab.slug === 'marketing-budget-simulator') {
          return (
            <MarketingBudgetSimLab
              scenario={scenario}
              variant={variant}
              onDirty={markDirty}
              onSubmit={triggerSubmit}
            />
          );
        }

        if (lab.slug === 'seo-snapshot-audit-lab') {
          return (
            <SeoSnapshotAuditLab
              scenario={scenario}
              variant={variant}
              onDirty={markDirty}
              onSubmit={triggerSubmit}
            />
          );
        }

        if (lab.slug === 'executive-office-prioritization-lab') {
          return (
            <ExecutiveOfficePrioritizationLab
              scenario={scenario}
              variant={variant}
              onDirty={markDirty}
              onSubmit={triggerSubmit}
            />
          );
        }

        return (
          <GenericComingSoonLab
            lab={lab}
            scenario={scenario}
            variant={variant}
            onDirty={markDirty}
            onSubmit={triggerSubmit}
          />
        );
      }}
    </LabShell>
  );
}
