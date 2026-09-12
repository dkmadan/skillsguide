import { test } from 'node:test';
import assert from 'node:assert/strict';
import { estimateTakeHome, slabTax } from './src/lib/takeHome.ts';
import { experienceBand, findSalaryBenchmark, quantile, salaryDistribution } from './src/data/salaryBenchmarks.ts';
const payroll = { annualCtc: 800000, employerCosts: 21600, annualBonus: 0, monthlyEmployeePf: 1800, annualProfessionalTax: 0, additional80C: 0, hraExemption: 0, regime: 'new' };
const query = { role: 'Data Analyst', years: 2, city: 'Bengaluru', industry: 'BFSI', companyType: 'GCC' };
test('published mean is not a GCC-specific median and uses the correct source column', () => {
  const r = findSalaryBenchmark(query);
  assert.equal(r.mean, 8.98); assert.equal(r.exactCompany, false); assert.equal(r.row.page, 32);
  assert.equal(findSalaryBenchmark({...query, industry:'Other'}).mean, null);
  assert.equal(findSalaryBenchmark({...query, years:6}).mean, 23.7);
  assert.equal(findSalaryBenchmark({...query, years:15}).mean, 42.08);
});
test('experience band boundaries and invalid input', () => {
  assert.deepEqual([0,5,6,14,15,40].map(experienceBand),[0,0,1,1,2,2]);
  for(const n of [-1,1.5,41,NaN]) assert.throws(()=>experienceBand(n));
});
test('no observations means no fabricated percentiles or date',()=>{
  assert.deepEqual(salaryDistribution(query),{sample:0,p25:null,median:null,p75:null,updated:null});
});
test('quantiles use interpolation without mutating inputs',()=>{
 const values=[4,1,3,2]; assert.equal(quantile(values,.25),1.75); assert.equal(quantile(values,.5),2.5);assert.equal(quantile(values,.75),3.25);assert.deepEqual(values,[4,1,3,2]);assert.throws(()=>quantile([], .5));
});
test('cohorts filter, deduplicate, and suppress small samples',()=>{
 const now=new Date('2026-09-12T00:00:00Z');
 const rows=Array.from({length:30},(_,i)=>({...query,id:String(i),annualCtcLakh:i+1,observedOn:'2026-08-01',sourceUrl:'https://example.com/licensed-test-fixture',verified:true}));
 const contaminated=[...rows,rows[0],{...rows[0],id:'old',observedOn:'2024-01-01'},{...rows[0],id:'future',observedOn:'2027-01-01'},{...rows[0],id:'wrong-city',city:'Mumbai'},{...rows[0],id:'unverified',verified:false}];
 const result=salaryDistribution(query,contaminated,now);assert.equal(result.sample,30);assert.equal(result.median,15.5);assert.equal(result.p25,8.25);assert.equal(result.p75,22.75);
 assert.equal(salaryDistribution(query,rows.slice(0,29),now).median,null);
});
test('default CTC separates employer costs and employee PF',()=>{
 const r=estimateTakeHome(payroll);assert.equal(r.gross,778400);assert.equal(r.annualTax,0);assert.equal(r.annualNet,756800);assert.equal(r.standardDeduction,75000);
});
test('new regime rebate threshold and marginal relief include cess',()=>{
 const noPf={...payroll,employerCosts:0,monthlyEmployeePf:0};
 assert.equal(estimateTakeHome({...noPf,annualCtc:1275000}).annualTax,0);
 assert.equal(estimateTakeHome({...noPf,annualCtc:1285000}).annualTax,10400);
 assert.equal(estimateTakeHome({...noPf,annualCtc:1675000}).annualTax,124800);
 assert.equal(slabTax(2400000,'new'),300000);
});
test('old regime uses 50k deduction, rebate and capped combined 80C',()=>{
 const old={...payroll,regime:'old',employerCosts:0,monthlyEmployeePf:0};
 assert.equal(estimateTakeHome({...old,annualCtc:550000}).annualTax,0);
 const r=estimateTakeHome({...old,monthlyEmployeePf:1800,additional80C:150000});assert.equal(r.standardDeduction,50000);assert.equal(r.deduction80C,150000);assert.equal(r.taxableIncome,600000);assert.equal(r.annualTax,33800);
});
test('bonus excluded from recurring cash but included in annual tax',()=>{
 const r=estimateTakeHome({...payroll,annualBonus:120000});const base=estimateTakeHome(payroll);assert.equal(r.annualTax,base.annualTax);assert.ok(Math.abs(base.monthlyRecurring-r.monthlyRecurring-10000)<.001);
});
test('reject invalid payroll instead of displaying misleading results',()=>{
 for(const change of [{annualCtc:NaN},{annualCtc:-1},{annualCtc:5000001},{employerCosts:900000},{annualBonus:900000},{monthlyEmployeePf:90000}])assert.throws(()=>estimateTakeHome({...payroll,...change}));
});
