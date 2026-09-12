import assert from 'node:assert/strict';
import { test } from 'node:test';
import { compassSteps, compassTracks, rankCareers } from './src/lib/careerCompass.ts';

const base = Object.fromEntries(compassSteps.flatMap(s => s.questions).map(q => [q.id, q.options?.[0] ?? (q.id === 'location' ? 'Jaipur, Rajasthan' : '')]));
const analyst = { ...base, education: 'B.Sc / Other degree', domain: 'Technology', coding: 'Comfortable', maths: 'Strong', communication: 'Comfortable', creative: 'Beginner', analysis: 'Advanced', detail: 'Strong', english: 'Comfortable', interest: 'Finding insights in data', tools: 'SQL / Power BI', hours: '10 hours', deadline: '6 months' };

test('captures 30 unique signals and accepts omitted salary', () => {
  assert.equal(new Set(compassSteps.flatMap(s => s.questions).map(q => q.id)).size, 30);
  assert.equal(rankCareers(base).length, compassTracks.length);
});
test('matches analyst and creative profiles to different relevant paths', () => {
  assert.equal(rankCareers(analyst)[0].slug, 'data-analytics');
  const creative = { ...base, domain: 'Design / Media', education: 'BA / Humanities', creative: 'Advanced', detail: 'Advanced', communication: 'Strong', english: 'Comfortable', interest: 'Creating visual stories', tools: 'Figma / Adobe / Video tools', structure: 'Open-ended problems', employment: 'Freelance / Contract', goal: 'Freelance flexibility', hours: '20 hours', deadline: '12 months' };
  assert.ok(['graphic-figma', 'video-editing'].includes(rankCareers(creative)[0].slug));
});
test('more study time shortens the same learning plan', () => {
  const slow = rankCareers({ ...analyst, hours: '5 hours' }).find(r => r.slug === 'data-analytics');
  const fast = rankCareers({ ...analyst, hours: '20 hours' }).find(r => r.slug === 'data-analytics');
  assert.ok(fast.weeks < slow.weeks);
  assert.equal(fast.learningHours, slow.learningHours);
});
test('rejects missing, invalid and whitespace-only answers', () => {
  for (const change of [{ coding: '' }, { coding: 'made up' }, { location: '  ' }, { salary: '-1' }, { salary: 'NaN' }]) assert.throws(() => rankCareers({ ...base, ...change }));
});
test('salary never changes match rank and identifies pay-cut risk', () => {
  assert.deepEqual(rankCareers({ ...analyst, salary: '50' }).map(r => r.score), rankCareers(analyst).map(r => r.score));
  assert.ok(rankCareers({ ...analyst, salary: '50' })[0].cautions.some(c => c.includes('current salary')));
});
test('phone access and short deadlines create actionable cautions', () => {
  const result = rankCareers({ ...base, device: 'Phone only', deadline: '3 months', hours: '5 hours' }).find(r => r.slug === 'full-stack-web');
  assert.ok(result.cautions.some(c => c.includes('computer access')));
  assert.ok(result.cautions.some(c => c.includes('tighter')));
});
test('all results are bounded, ordered, deterministic and have three projects', () => {
  for (const profile of [base, analyst]) {
    const results = rankCareers(profile);
    assert.deepEqual(results, rankCareers(profile));
    results.forEach((r, i) => {
      assert.ok(r.score >= 0 && r.score <= 100);
      assert.ok(r.weeks > 0);
      assert.equal(r.projects.length, 3);
      if (i) assert.ok(results[i - 1].score >= r.score);
    });
  }
});

