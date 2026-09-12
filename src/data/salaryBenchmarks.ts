export const salarySource = {
  publisher: 'Randstad India',
  title: 'Annual Salary Trends Report 2025–26',
  url: 'https://info.randstad.in/hubfs/Campaigns/Randstad_salary_trends_report_2025-26.pdf',
  period: '2025–26',
  checkedOn: '12 September 2026',
  publishedMonth: null,
  note: 'Published average annual CTC in INR lakh. Cohort sample sizes, percentiles, and company-type splits are not published in these tables.',
};
export const salaryRoles = ['Data Analyst', 'Business Analyst', 'Cloud Architect / Computing', 'Front-End Developer'] as const;
export const salaryCities = ['Bengaluru', 'Hyderabad', 'Mumbai', 'Pune'] as const;
export const salaryIndustries = ['BFSI', 'Information Technology', 'Retail / E-commerce', 'Manufacturing', 'Other'] as const;
export const companyTypes = ['All company types', 'GCC', 'IT services', 'Product company', 'Startup', 'Other'] as const;
export type SalaryQuery = { role: string; years: number; city: string; industry: string; companyType: string };
export type SalaryBenchmark = { role: string; city: string; industry: string; means: [number, number, number]; page: number };
// Transcribed from the cited tables, checked against the PDF's column coordinates.
// Values are experience-band MEANS. They must never be relabelled as percentiles.
const rows: [string, string, number, [number, number, number][]][] = [
  ['Data Analyst', 'BFSI', 32, [[8.98, 23.70, 42.08], [6.78, 17.90, 36.49], [7.17, 24.58, 51.86], [6.93, 20.23, 35.23]]],
  ['Business Analyst', 'BFSI', 32, [[8.34, 22.00, 39.07], [5.94, 17.26, 34.87], [7.03, 24.11, 50.87], [6.94, 22.28, 38.44]]],
  ['Cloud Architect / Computing', 'Information Technology', 40, [[8.97, 26.05, 45.83], [7.84, 22.76, 42.19], [7.06, 26.63, 55.68], [7.56, 24.27, 41.89]]],
  ['Front-End Developer', 'Information Technology', 40, [[8.17, 23.73, 41.74], [6.79, 19.73, 39.85], [6.14, 21.05, 44.42], [7.04, 20.55, 35.79]]],
];
export const salaryBenchmarks: SalaryBenchmark[] = rows.flatMap(([role, industry, page, values]) => salaryCities.map((city, i) => ({ role, industry, page, city, means: values[i] })));
export function experienceBand(years: number) {
  if (!Number.isInteger(years) || years < 0 || years > 40) throw new Error('Experience must be a whole number from 0 to 40.');
  return years <= 5 ? 0 : years <= 14 ? 1 : 2;
}
export const experienceLabels = ['0–5 years', '6–14 years', '15+ years'];
export function findSalaryBenchmark(q: SalaryQuery) {
  const band = experienceBand(q.years);
  const row = salaryBenchmarks.find(r => r.role === q.role && r.city === q.city && r.industry === q.industry);
  return { row, band, mean: row?.means[band] ?? null, exactCompany: q.companyType === 'All company types' };
}

export type SalaryObservation = SalaryQuery & { id: string; annualCtcLakh: number; observedOn: string; sourceUrl: string; verified: boolean };
// No invented individual salaries. Populate only with licensed, deduplicated,
// verified observations; aggregated report rows are not individual observations.
export const salaryObservations: SalaryObservation[] = [];
export function quantile(values: number[], p: number) {
  if (!values.length || p < 0 || p > 1 || !Number.isFinite(p) || values.some(v => !Number.isFinite(v))) throw new Error('Invalid quantile input.');
  const sorted = [...values].sort((a, b) => a - b);
  const position = (sorted.length - 1) * p;
  const lower = Math.floor(position);
  return sorted[lower] + (position - lower) * ((sorted[lower + 1] ?? sorted[lower]) - sorted[lower]);
}
export function salaryDistribution(q: SalaryQuery, observations: SalaryObservation[] = salaryObservations, asOf = new Date()) {
  const band = experienceBand(q.years);
  const cutoff = new Date(asOf); cutoff.setUTCFullYear(cutoff.getUTCFullYear() - 1);
  const eligible = observations.filter(o => o.verified && /^https:\/\//.test(o.sourceUrl) && o.annualCtcLakh > 0 && Number.isFinite(o.annualCtcLakh) && Number.isInteger(o.years) && o.years >= 0 && o.years <= 40 && o.role === q.role && o.city === q.city && o.industry === q.industry && (q.companyType === 'All company types' || o.companyType === q.companyType) && experienceBand(o.years) === band && Date.parse(o.observedOn) >= cutoff.getTime() && Date.parse(o.observedOn) <= asOf.getTime());
  const unique = [...new Map(eligible.sort((a, b) => Date.parse(a.observedOn) - Date.parse(b.observedOn)).map(o => [o.id, o])).values()];
  const sample = unique.length;
  const values = unique.map(o => o.annualCtcLakh);
  return { sample, p25: sample >= 30 ? quantile(values, .25) : null, median: sample >= 30 ? quantile(values, .5) : null, p75: sample >= 30 ? quantile(values, .75) : null, updated: sample ? unique.reduce((latest, o) => o.observedOn > latest ? o.observedOn : latest, '') : null };
}
