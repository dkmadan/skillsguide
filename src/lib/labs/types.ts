export type LabDifficulty = 'beginner' | 'intermediate' | 'challenge';

export type LabDomain = 
  | 'data-analytics'
  | 'ai-engineering'
  | 'cloud-systems'
  | 'product-growth'
  | 'business-workplace';

export type SaveStatus = 'unsaved' | 'saving' | 'saved' | 'failed';

export interface LabDefinition {
  labNumber: number;
  slug: string;
  title: string;
  domain: LabDomain;
  domainTitle: string;
  skills: string[];
  associatedSkillSlugs: string[];
  summary: string;
  missionObjective: string;
  timeMinutes: number;
  difficultyTiers: LabDifficulty[];
  schemaVersion: string;
  publishedScenarioIds: string[];
  toolsSimulated: string[];
  isPilot?: boolean;
}

export type WorkspaceMode = 'guided' | 'challenge' | 'explore';

export interface ScenarioHint {
  level: number;
  clue: string;
  explanation?: string;
}

export interface LabScenarioVariant {
  id: string;
  labSlug: string;
  variant: LabDifficulty;
  scenarioVersion: string;
  title: string;
  instructions: string;
  prerequisites: string[];
  expectedOutput: string[];
  publicFixture: Record<string, unknown>;
  allowedActions: string[];
  // Enhanced sandbox attributes
  objective?: string;
  editableInputs?: string[];
  constraints?: string[];
  startingMaterials?: Record<string, unknown>;
  supportedOperations?: string[];
  evaluationMethod?: string;
  assumptions?: string[];
  hints?: ScenarioHint[];
  // Private answer key used ONLY on server for deterministic scoring
  privateAnswerKey?: Record<string, unknown>;
}

export interface ExperimentSnapshot {
  id: string;
  name: string;
  timestamp: string;
  inputs: Record<string, unknown>;
  metrics: Record<string, number | string>;
  notes?: string;
}

export interface ValidationFeedback {
  validity: { passed: boolean; errors: string[] };
  correctness: { passed: boolean; score: number; details: string[]; counterexamples?: string[] };
  constraints: { passed: boolean; violated: string[] };
  tradeOffs: string[];
  reflectionRubric?: { prompt: string; criteria: string[] };
}

export interface DataDataset {
  id: string;
  name: string;
  schema: { name: string; type: 'string' | 'number' | 'boolean' | 'date' }[];
  records: Record<string, unknown>[];
  rowCount: number;
}

export interface LabAttempt {
  id: string;
  ownerId: string;
  labSlug: string;
  scenarioId: string;
  version: string;
  seed: number;
  status: 'in_progress' | 'submitted' | 'abandoned';
  draftState: Record<string, unknown>;
  revision: number;
  createdAt: string;
  updatedAt: string;
}

export interface ScoringCriterionResult {
  id: string;
  name: string;
  category: 'correctness' | 'constraints' | 'evidence';
  earned: number;
  max: number;
  feedback: string;
  passed: boolean;
}

export interface LabSubmissionResult {
  id: string;
  ownerId: string;
  attemptId: string;
  idempotencyKey: string;
  labSlug: string;
  serverScore: number; // 0-100 (60 correctness, 25 constraints, 15 evidence)
  passed: boolean;
  criterionResults: ScoringCriterionResult[];
  authoredHints: string[];
  submittedAt: string;
  selfReviewPrompt?: string;
  unverifiedGuest?: boolean;
}

export interface LabArtifact {
  id: string;
  ownerId: string;
  attemptId: string;
  labSlug: string;
  artifactType: 'json' | 'csv' | 'text' | 'report';
  payload: string | Record<string, unknown>;
  createdAt: string;
}
