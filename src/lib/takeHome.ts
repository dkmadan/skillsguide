export type PayrollInputs = {
  annualCtc: number;
  employerCosts: number;
  annualBonus: number;
  monthlyEmployeePf: number;
  annualProfessionalTax: number;
  additional80C: number;
  hraExemption: number;
  regime: 'new' | 'old';
};
export const taxSources = {
  slabs: 'https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-1',
  budget2026: 'https://wmstatic-prd.incometaxindia.gov.in/documents/81799/11848482/memo-2026.pdf/fe530cfa-9c49-fc5c-4bfa-fc96fd5e7b7a?t=1770008674037',
  deductions: 'https://wmstatic-prd.incometaxindia.gov.in/web/guest/w/employees-benefits-allowable',
  epf: 'https://www.epfindia.gov.in/site_docs/PDFs/MiscPDFs/Employer_Information_Booklet.pdf',
};
export function slabTax(income: number, regime: 'new' | 'old') {
  const bands = regime === 'new' ? [[400000, 0], [800000, .05], [1200000, .1], [1600000, .15], [2000000, .2], [2400000, .25], [Infinity, .3]] : [[250000, 0], [500000, .05], [1000000, .2], [Infinity, .3]];
  let tax = 0, previous = 0;
  for (const [upper, rate] of bands) { tax += Math.max(0, Math.min(income, upper) - previous) * rate; previous = upper; }
  return tax;
}
export function estimateTakeHome(input: PayrollInputs) {
  for (const value of Object.values(input)) if (typeof value === 'number' && (!Number.isFinite(value) || value < 0)) throw new Error('Enter valid non-negative amounts.');
  if (input.annualProfessionalTax > 2500) throw new Error('Annual professional tax cannot exceed INR 2,500.');
  if (input.annualCtc > 5000000) throw new Error('This estimator supports annual CTC up to ₹50 lakh.');
  const gross = input.annualCtc - input.employerCosts;
  const employeePf = input.monthlyEmployeePf * 12;
  if (gross < 0 || input.annualBonus > gross || employeePf + input.annualProfessionalTax > gross - input.annualBonus || input.hraExemption > gross) throw new Error('Payroll components exceed the available gross salary.');
  const standardDeduction = Math.min(gross, input.regime === 'new' ? 75000 : 50000);
  const deduction80C = input.regime === 'old' ? Math.min(150000, employeePf + input.additional80C) : 0;
  const taxableIncome = Math.max(0, gross - standardDeduction - deduction80C - (input.regime === 'old' ? input.hraExemption + input.annualProfessionalTax : 0));
  const beforeRebate = slabTax(taxableIncome, input.regime);
  let afterRebate = beforeRebate;
  if (input.regime === 'new') afterRebate = taxableIncome <= 1200000 ? 0 : Math.min(beforeRebate, taxableIncome - 1200000);
  else if (taxableIncome <= 500000) afterRebate = 0;
  const rebateAndRelief = beforeRebate - afterRebate;
  const cess = afterRebate * .04;
  const annualTax = afterRebate + cess;
  const annualNet = Math.max(0, gross - employeePf - input.annualProfessionalTax - annualTax);
  const monthlyRecurring = Math.max(0, (annualNet - input.annualBonus) / 12);
  return { gross, employeePf, standardDeduction, deduction80C, taxableIncome, beforeRebate, rebateAndRelief, cess, annualTax, annualNet, monthlyRecurring };
}
