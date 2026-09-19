import { ScoringCriterionResult, LabSubmissionResult } from '../types';

// =========================================================================
// LAB 19 EVALUATOR: Marketing Budget Simulator
// =========================================================================
// Server-authoritative mirror of the component's three fixture tiers so
// scoring cannot be gamed by a client that reports inflated assumptions —
// only the learner's actual decisions (channel budgets, creative picks,
// audience segment, days simulated) are trusted from `answers`.
type ChannelId = 'meta' | 'google' | 'linkedin';

interface CreativeVariant { id: string; ctrBonus: number; convBonus: number; }
interface Channel { id: ChannelId; cpm: number; ctr: number; conversionRate: number; creativeVariants: CreativeVariant[]; }
interface AudienceSegment { id: string; ctrMultiplier: number; convMultiplier: number; cpmMultiplier: number; }
interface Fixture {
  totalBudget: number;
  targetLeads: number;
  targetCpl: number;
  maxChannelShare: number;
  minChannelsUsed: number;
  channelMinSpend: Partial<Record<ChannelId, number>>;
  channels: Channel[];
  audiences: AudienceSegment[];
}

const FIXTURES: Record<string, Fixture> = {
  beginner: {
    totalBudget: 100000, targetLeads: 150, targetCpl: 700, maxChannelShare: 0.75, minChannelsUsed: 2, channelMinSpend: {},
    channels: [
      { id: 'meta', cpm: 120, ctr: 0.018, conversionRate: 0.040, creativeVariants: [{ id: 'meta_v1', ctrBonus: 0.003, convBonus: 0.005 }, { id: 'meta_v2', ctrBonus: 0, convBonus: 0 }] },
      { id: 'google', cpm: 240, ctr: 0.038, conversionRate: 0.065, creativeVariants: [{ id: 'goog_v1', ctrBonus: 0.005, convBonus: 0.010 }, { id: 'goog_v2', ctrBonus: -0.005, convBonus: -0.005 }] },
      { id: 'linkedin', cpm: 460, ctr: 0.014, conversionRate: 0.095, creativeVariants: [{ id: 'li_v1', ctrBonus: 0.002, convBonus: 0.015 }, { id: 'li_v2', ctrBonus: -0.002, convBonus: -0.005 }] },
    ],
    audiences: [
      { id: 'broad', ctrMultiplier: 1.0, convMultiplier: 1.0, cpmMultiplier: 1.0 },
      { id: 'retarget', ctrMultiplier: 1.20, convMultiplier: 1.30, cpmMultiplier: 1.15 },
      { id: 'lookalike', ctrMultiplier: 1.08, convMultiplier: 1.12, cpmMultiplier: 1.05 },
    ],
  },
  intermediate: {
    totalBudget: 100000, targetLeads: 175, targetCpl: 600, maxChannelShare: 0.70, minChannelsUsed: 3, channelMinSpend: { meta: 10000, google: 10000, linkedin: 10000 },
    channels: [
      { id: 'meta', cpm: 140, ctr: 0.020, conversionRate: 0.042, creativeVariants: [{ id: 'meta_v1', ctrBonus: 0.006, convBonus: 0.004 }, { id: 'meta_v2', ctrBonus: 0.002, convBonus: 0.009 }] },
      { id: 'google', cpm: 260, ctr: 0.040, conversionRate: 0.070, creativeVariants: [{ id: 'goog_v1', ctrBonus: 0.006, convBonus: 0.012 }, { id: 'goog_v2', ctrBonus: 0.010, convBonus: -0.006 }] },
      { id: 'linkedin', cpm: 520, ctr: 0.015, conversionRate: 0.100, creativeVariants: [{ id: 'li_v1', ctrBonus: 0.003, convBonus: 0.015 }, { id: 'li_v2', ctrBonus: 0.007, convBonus: 0.006 }] },
    ],
    audiences: [
      { id: 'broad', ctrMultiplier: 1.0, convMultiplier: 1.0, cpmMultiplier: 1.0 },
      { id: 'retarget', ctrMultiplier: 1.15, convMultiplier: 1.22, cpmMultiplier: 1.20 },
      { id: 'intent', ctrMultiplier: 1.10, convMultiplier: 1.18, cpmMultiplier: 1.12 },
    ],
  },
  challenge: {
    totalBudget: 100000, targetLeads: 190, targetCpl: 550, maxChannelShare: 0.65, minChannelsUsed: 3, channelMinSpend: { meta: 20000 },
    channels: [
      { id: 'meta', cpm: 160, ctr: 0.019, conversionRate: 0.038, creativeVariants: [{ id: 'meta_v1', ctrBonus: 0.010, convBonus: 0.002 }, { id: 'meta_v2', ctrBonus: 0.003, convBonus: 0.011 }] },
      { id: 'google', cpm: 300, ctr: 0.042, conversionRate: 0.072, creativeVariants: [{ id: 'goog_v1', ctrBonus: 0.004, convBonus: 0.016 }, { id: 'goog_v2', ctrBonus: 0.014, convBonus: -0.010 }] },
      { id: 'linkedin', cpm: 600, ctr: 0.016, conversionRate: 0.105, creativeVariants: [{ id: 'li_v1', ctrBonus: 0.002, convBonus: 0.018 }, { id: 'li_v2', ctrBonus: 0.009, convBonus: 0.003 }] },
    ],
    audiences: [
      { id: 'broad', ctrMultiplier: 1.0, convMultiplier: 1.0, cpmMultiplier: 1.0 },
      { id: 'retarget', ctrMultiplier: 1.12, convMultiplier: 1.28, cpmMultiplier: 1.25 },
      { id: 'lookalike_trap', ctrMultiplier: 1.35, convMultiplier: 0.85, cpmMultiplier: 1.10 },
    ],
  },
};

function computeVolumes(spend: number, cpm: number, ctr: number, conversionRate: number) {
  const impressions = cpm > 0 ? (spend / cpm) * 1000 : 0;
  const clicks = impressions * Math.max(0, ctr);
  const leads = clicks * Math.max(0, conversionRate);
  return { impressions, clicks, leads };
}

export function evaluateMarketingBudgetLab(
  answers: Record<string, unknown>,
  idempotencyKey: string,
  attemptId: string,
  ownerId: string
): LabSubmissionResult {
  const variantKey = typeof answers.variant === 'string' && FIXTURES[answers.variant] ? (answers.variant as string) : 'beginner';
  const fixture = FIXTURES[variantKey];

  const channelBudgets = (answers.channelBudgets as Record<string, number>) || {};
  const selectedCreatives = (answers.selectedCreatives as Record<string, string>) || {};
  const audienceId = String(answers.audienceId || fixture.audiences[0].id);
  const audience = fixture.audiences.find((a) => a.id === audienceId) ?? fixture.audiences[0];
  const daysSimulated = Number(answers.daysSimulated || 0);
  const strategyNotes = String(answers.strategyNotes || '').trim();
  const optimizationHistoryLength = Number(answers.optimizationHistoryLength || 0);

  let totalSpend = 0;
  let totalLeads = 0;
  const channelSpend: Record<string, number> = {};

  fixture.channels.forEach((ch) => {
    const spend = Math.max(0, Number(channelBudgets[ch.id] || 0));
    totalSpend += spend;
    channelSpend[ch.id] = spend;
    const creative = ch.creativeVariants.find((c) => c.id === selectedCreatives[ch.id]) ?? ch.creativeVariants[0];
    const ctr = (ch.ctr + creative.ctrBonus) * audience.ctrMultiplier;
    const conv = (ch.conversionRate + creative.convBonus) * audience.convMultiplier;
    const cpm = ch.cpm * audience.cpmMultiplier;
    totalLeads += computeVolumes(spend, cpm, ctr, conv).leads;
  });

  totalLeads = Math.round(totalLeads);
  const cpl = totalLeads > 0 ? Math.round(totalSpend / totalLeads) : 0;

  const criteria: ScoringCriterionResult[] = [];
  const hints: string[] = [];

  const leadsTargetMet = totalLeads >= fixture.targetLeads;
  criteria.push({
    id: 'mkt-c1',
    name: `Lead Volume Target (>= ${fixture.targetLeads} qualified leads)`,
    category: 'correctness',
    earned: leadsTargetMet ? 30 : Math.max(0, Math.round((totalLeads / fixture.targetLeads) * 30)),
    max: 30,
    passed: leadsTargetMet,
    feedback: leadsTargetMet
      ? `Recomputed ${totalLeads} qualified leads server-side (target was ${fixture.targetLeads}).`
      : `Server recomputed ${totalLeads} leads from your budgets, creatives and audience — short of the ${fixture.targetLeads} target.`
  });
  if (!leadsTargetMet) hints.push('Increase spend on the channel/creative/audience combination with the highest recomputed leads-per-credit.');

  const cplTargetMet = cpl > 0 && cpl <= fixture.targetCpl;
  criteria.push({
    id: 'mkt-c2',
    name: `Acquisition Efficiency (CPL <= ${fixture.targetCpl} credits)`,
    category: 'correctness',
    earned: cplTargetMet ? 20 : cpl > 0 && cpl <= fixture.targetCpl * 1.2 ? 10 : 0,
    max: 20,
    passed: cplTargetMet,
    feedback: cplTargetMet ? `Efficient blended CPL of ${cpl} credits per lead.` : `Recomputed CPL of ${cpl} credits exceeded the ${fixture.targetCpl} credit ceiling.`
  });

  const fullSimRun = daysSimulated >= 30;
  criteria.push({
    id: 'mkt-c3',
    name: 'Simulation Horizon (30-Day Campaign Advance)',
    category: 'correctness',
    earned: fullSimRun ? 10 : Math.round((Math.min(daysSimulated, 30) / 30) * 10),
    max: 10,
    passed: fullSimRun,
    feedback: fullSimRun ? 'Advanced the simulation clock through all 30 days.' : `Only advanced ${daysSimulated}/30 simulated days — run the full horizon before submitting.`
  });

  const budgetWithinCap = totalSpend <= fixture.totalBudget;
  criteria.push({
    id: 'mkt-c4',
    name: `Budget Boundary Constraint (<= ${fixture.totalBudget.toLocaleString()} credits)`,
    category: 'constraints',
    earned: budgetWithinCap ? 10 : 0,
    max: 10,
    passed: budgetWithinCap,
    feedback: budgetWithinCap ? `Total spend of ${totalSpend.toLocaleString()} credits stayed within the ceiling.` : `Budget overrun: spent ${totalSpend.toLocaleString()} credits.`
  });

  const channelsUsed = fixture.channels.filter((ch) => channelSpend[ch.id] > 0).length;
  const maxShareOk = totalSpend === 0 || Math.max(...fixture.channels.map((ch) => channelSpend[ch.id] / totalSpend)) <= fixture.maxChannelShare;
  const minSpendOk = Object.entries(fixture.channelMinSpend).every(([chId, min]) => channelSpend[chId] >= (min || 0));
  const diversified = channelsUsed >= fixture.minChannelsUsed && maxShareOk && minSpendOk;
  criteria.push({
    id: 'mkt-c5',
    name: 'Channel Diversification & Minimum-Spend Rules',
    category: 'constraints',
    earned: diversified ? 15 : channelsUsed >= fixture.minChannelsUsed ? 7 : 0,
    max: 15,
    passed: diversified,
    feedback: diversified
      ? `Diversified across ${channelsUsed} channels, honoring per-channel minimums and the ${Math.round(fixture.maxChannelShare * 100)}% concentration cap.`
      : 'Diversification rules not met — check per-channel minimum spend and the maximum single-channel share.'
  });
  if (!diversified) hints.push('This scenario requires spend across multiple channels and respects a maximum per-channel concentration cap.');

  const hasNotes = strategyNotes.length >= 25;
  const hasHistory = optimizationHistoryLength >= 2;
  const evidenceOk = hasNotes && hasHistory;
  criteria.push({
    id: 'mkt-c6',
    name: 'Campaign Strategy Rationale & Optimization History',
    category: 'evidence',
    earned: evidenceOk ? 15 : hasNotes || hasHistory ? 8 : 3,
    max: 15,
    passed: evidenceOk,
    feedback: evidenceOk
      ? 'Detailed campaign rationale recorded alongside a saved optimization history of allocation changes.'
      : 'Strategy notes are too brief or the allocation was never iterated on — adjust budgets/creatives at least once and document why.'
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
