import { ScoringCriterionResult, LabSubmissionResult } from '../types';

// =========================================================================
// LAB 28: Teaching and Curriculum Studio
// =========================================================================
interface ObjectiveMeta { id: string; }
interface CurriculumUnitMeta { id: string; prerequisiteId?: string; }
interface MisconceptionOptionMeta { id: string; quality: 'strong' | 'adequate' | 'weak'; }
interface Fixture {
  targetMaxMins: number;
  objectives: ObjectiveMeta[];
  curriculumUnits: CurriculumUnitMeta[];
  misconceptionOptions: MisconceptionOptionMeta[];
}

const FIXTURES: Record<string, Fixture> = {
  beginner: {
    targetMaxMins: 40,
    objectives: [{ id: 'obj1' }, { id: 'obj2' }, { id: 'obj3' }, { id: 'obj4' }],
    curriculumUnits: [{ id: 'unitA' }, { id: 'unitB', prerequisiteId: 'unitA' }, { id: 'unitC', prerequisiteId: 'unitB' }],
    misconceptionOptions: [{ id: 'trace', quality: 'strong' }, { id: 'homework', quality: 'weak' }, { id: 'ignore', quality: 'weak' }],
  },
  intermediate: {
    targetMaxMins: 40,
    objectives: [{ id: 'obj1' }, { id: 'obj2' }, { id: 'obj3' }, { id: 'obj4' }, { id: 'obj5' }],
    curriculumUnits: [{ id: 'unitA' }, { id: 'unitB', prerequisiteId: 'unitA' }, { id: 'unitC', prerequisiteId: 'unitA' }, { id: 'unitD', prerequisiteId: 'unitB' }],
    misconceptionOptions: [{ id: 'trace', quality: 'strong' }, { id: 'explain', quality: 'adequate' }, { id: 'homework', quality: 'weak' }],
  },
  challenge: {
    targetMaxMins: 40,
    objectives: [{ id: 'obj1' }, { id: 'obj2' }, { id: 'obj3' }, { id: 'obj4' }, { id: 'obj5' }, { id: 'obj6' }],
    curriculumUnits: [{ id: 'unitA' }, { id: 'unitB', prerequisiteId: 'unitA' }, { id: 'unitE', prerequisiteId: 'unitB' }, { id: 'unitC', prerequisiteId: 'unitE' }, { id: 'unitD', prerequisiteId: 'unitA' }],
    misconceptionOptions: [{ id: 'trace', quality: 'strong' }, { id: 'explain', quality: 'adequate' }, { id: 'ignore', quality: 'weak' }],
  },
};

const RUBRIC_ITEM_IDS = ['criteria', 'evidence', 'action', 'respectful'];

interface SubmittedSegment { objectiveId?: string | null; hasAssessment?: boolean; accessibleAlt?: string; durationMins?: number; }

export function evaluateTeachingStudioLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const variantKey = typeof answers.variant === 'string' && FIXTURES[answers.variant] ? (answers.variant as string) : 'beginner';
  const fixture = FIXTURES[variantKey];

  const segments = Array.isArray(answers.segments) ? (answers.segments as SubmittedSegment[]) : [];
  const totalDuration = Number(answers.totalDuration ?? segments.reduce((s, seg) => s + Number(seg.durationMins || 0), 0));
  const curriculumOrder = Array.isArray(answers.curriculumOrder) ? (answers.curriculumOrder as string[]) : [];
  const misconceptionRemedy = String(answers.misconceptionRemedy || '');
  const rubricChecks = (answers.rubricChecks as Record<string, boolean>) || {};
  const pedagogicalNotes = String(answers.pedagogicalNotes || '').trim();

  const criteria: ScoringCriterionResult[] = [];
  const hints: string[] = [];

  const within40 = totalDuration <= fixture.targetMaxMins;
  const overflowRatio = within40 ? 0 : Math.min(1, (totalDuration - fixture.targetMaxMins) / fixture.targetMaxMins);
  criteria.push({
    id: 'tch-c1',
    name: `Instructional Time Budget Discipline (<= ${fixture.targetMaxMins} Minutes)`,
    category: 'correctness',
    earned: within40 ? 25 : Math.max(0, Math.round(25 * (1 - overflowRatio))),
    max: 25,
    passed: within40,
    feedback: within40
      ? `Lesson plan fits within the ${fixture.targetMaxMins}-minute ceiling at ${totalDuration} minutes.`
      : `Lesson plan overflows the ${fixture.targetMaxMins}-minute ceiling — currently ${totalDuration} minutes.`
  });
  if (!within40) hints.push('Trim segment durations until the total is at or below the class time limit.');

  const coveredCount = fixture.objectives.filter((obj) => segments.some((s) => s.objectiveId === obj.id && s.hasAssessment)).length;
  const coverageFraction = fixture.objectives.length > 0 ? coveredCount / fixture.objectives.length : 1;
  criteria.push({
    id: 'tch-c2',
    name: 'Objective-to-Assessment Alignment',
    category: 'correctness',
    earned: Math.round(coverageFraction * 25),
    max: 25,
    passed: coverageFraction === 1,
    feedback: `${coveredCount} of ${fixture.objectives.length} objectives are paired with an assessment-bearing segment.`
  });
  if (coverageFraction < 1) hints.push('Every learning objective needs at least one segment with a formative assessment attached.');

  const prereqOk = fixture.curriculumUnits.every((u) => {
    if (!u.prerequisiteId) return true;
    const prereqIdx = curriculumOrder.indexOf(u.prerequisiteId);
    const unitIdx = curriculumOrder.indexOf(u.id);
    return prereqIdx >= 0 && unitIdx >= 0 && prereqIdx < unitIdx;
  });
  criteria.push({
    id: 'tch-c3',
    name: 'Curriculum Prerequisite Ordering',
    category: 'correctness',
    earned: prereqOk ? 10 : 0,
    max: 10,
    passed: prereqOk,
    feedback: prereqOk ? 'Every curriculum unit is sequenced after its prerequisite.' : 'One or more curriculum units are sequenced before their required prerequisite.'
  });

  const chosenOption = fixture.misconceptionOptions.find((o) => o.id === misconceptionRemedy);
  const remedyQuality = chosenOption?.quality ?? 'weak';
  const remedyPoints = remedyQuality === 'strong' ? 15 : remedyQuality === 'adequate' ? 7 : 0;
  criteria.push({
    id: 'tch-c4',
    name: 'Pedagogical Misconception Intervention',
    category: 'constraints',
    earned: remedyPoints,
    max: 15,
    passed: remedyQuality === 'strong',
    feedback: remedyQuality === 'strong'
      ? 'Selected a concrete, evidence-based intervention targeting the specific misconception.'
      : 'Selected intervention does not directly confront the misconception with concrete evidence.'
  });

  const altCount = segments.filter((s) => (s.accessibleAlt || '').trim().length >= 8).length;
  const altFraction = segments.length > 0 ? altCount / segments.length : 0;
  criteria.push({
    id: 'tch-c5',
    name: 'Accessible Alternative Activities',
    category: 'constraints',
    earned: Math.round(altFraction * 10),
    max: 10,
    passed: altFraction === 1,
    feedback: `${altCount} of ${segments.length} segments describe an accessible alternative activity.`
  });

  const checkedCount = RUBRIC_ITEM_IDS.filter((id) => rubricChecks[id]).length;
  const notesOk = pedagogicalNotes.length >= 40;
  const rubricOk = checkedCount >= 3;
  const evidenceOk = notesOk && rubricOk;
  criteria.push({
    id: 'tch-c6',
    name: 'Reflection Quality & Self-Review Rubric',
    category: 'evidence',
    earned: evidenceOk ? 15 : notesOk || rubricOk ? 7 : 0,
    max: 15,
    passed: evidenceOk,
    feedback: evidenceOk
      ? `Reflection is substantive and self-checked against ${checkedCount}/4 rubric criteria.`
      : 'Reflection is too brief or fewer than 3 of the 4 self-review rubric criteria are checked.'
  });

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
    authoredHints: hints,
    submittedAt: new Date().toISOString()
  };
}
