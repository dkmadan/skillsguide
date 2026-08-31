export interface CitySalaryBenchmark {
  city: string;
  tier: 'Tier 1' | 'Tier 2' | 'Remote / Global';
  avgSalaryLPA: number;
  fresherSalaryLPA: number;
  seniorSalaryLPA: number;
  hiringDensity: 'Very High' | 'High' | 'Moderate';
  livingCostIndex: 'High' | 'Moderate' | 'Low';
  topCompanies: string[];
}

export interface SalaryRoleGuide {
  slug: string;
  roleTitle: string;
  category: 'tech' | 'business' | 'vocational';
  categoryLabel: string;
  experienceScale: {
    expLabel: string;
    years: number;
    baseLPA: number;
    monthlyInHandINR: number;
    bonusLPA: number;
  }[];
  cityBenchmarks: CitySalaryBenchmark[];
  factorsDrivingHikes: string[];
  negotiationTips: string[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export const salaryDataStore: Record<string, {
  title: string;
  baseLPA: number[];
  topCity: string;
  insight: string;
}> = {
  'data-analytics': {
    title: 'Data Analytics & Power BI',
    baseLPA: [5.5, 7.5, 10.5, 14.0, 18.5, 23.0, 27.0, 31.0, 35.0],
    topCity: 'Bengaluru & Hyderabad',
    insight: 'SQL + Power BI portfolio with 2 verified Kaggle/Swiggy case studies gets first interview calls in under 3 weeks.'
  },
  'ai-prompt-engg': {
    title: 'AI Automation & Prompt Engineering',
    baseLPA: [7.0, 10.0, 14.5, 19.5, 25.0, 30.0, 35.0, 40.0, 45.0],
    topCity: 'Bengaluru & Gurugram',
    insight: 'RAG pipelines and LLM API integrations currently command a 35% premium over generic developers in Indian startups.'
  },
  'full-stack': {
    title: 'Full-Stack Web Dev (MERN/Java)',
    baseLPA: [4.8, 7.0, 10.0, 13.5, 17.5, 22.0, 26.0, 30.0, 34.0],
    topCity: 'Bengaluru, Pune & NCR',
    insight: 'Java + Spring Boot dominates enterprise banking, while Next.js + Tailwind dominates funded consumer tech.'
  },
  'cloud-devops': {
    title: 'Cloud & DevOps Engineering',
    baseLPA: [6.5, 9.0, 13.0, 17.0, 22.5, 28.0, 33.0, 38.0, 44.0],
    topCity: 'Hyderabad & Pune',
    insight: 'Certified Kubernetes Administrators (CKA) and Terraform users experience the fastest mid-career CTC leaps in India.'
  },
  'cybersecurity': {
    title: 'Cybersecurity SOC Analyst',
    baseLPA: [5.2, 7.8, 11.0, 15.0, 19.5, 24.5, 29.0, 34.0, 38.0],
    topCity: 'Mumbai & Chennai (BFSI)',
    insight: 'Driven by strict RBI digital banking mandates. SOC Tier 1 analysts transition to Threat Hunters in 2 years.'
  },
  'digital-mktg': {
    title: 'Performance Marketing & SEO',
    baseLPA: [3.8, 5.5, 8.0, 11.0, 14.5, 18.0, 21.0, 24.0, 28.0],
    topCity: 'Gurugram & Mumbai',
    insight: 'Managing real Meta/Google Ad spends with positive ROAS trumps certifications. Great remote/freelance upside.'
  },
  'tally-gst': {
    title: 'Tally Prime & GST Accounting',
    baseLPA: [2.8, 3.8, 5.0, 6.5, 8.0, 9.5, 11.0, 12.5, 14.0],
    topCity: 'Ahmedabad, Surat, Delhi NCR',
    insight: 'Over 6.3 Crore Indian MSMEs need compliant GST filing. Independent part-time bookkeeping easily adds ₹25k/month.'
  },
  'video-editing': {
    title: 'Video Editing for Creators',
    baseLPA: [3.6, 5.2, 7.5, 10.0, 13.0, 16.5, 19.5, 22.0, 25.0],
    topCity: 'Mumbai, Delhi & Remote',
    insight: 'Retention editing (first 3-second hook, sound effects) allows top Indian editors to charge ₹5,000 per 60-second reel.'
  },
  'bpo-support': {
    title: 'International BPO & Support',
    baseLPA: [3.0, 4.0, 5.2, 6.5, 7.8, 9.0, 10.2, 11.5, 12.5],
    topCity: 'Noida, Gurugram, Jaipur, Indore',
    insight: 'Night shifts + process incentives add ₹6,000 to ₹10,000 monthly. Fast promotions to Team Leader/Quality Analyst.'
  }
};

export const salaryGuidesList: SalaryRoleGuide[] = [
  {
    slug: 'data-analyst-salary-india',
    roleTitle: 'Data Analyst & BI Engineer Salary in India (2026)',
    category: 'tech',
    categoryLabel: 'High-Demand Tech',
    experienceScale: [
      { expLabel: 'Fresher (0 - 1 Yr)', years: 0, baseLPA: 5.5, monthlyInHandINR: 42000, bonusLPA: 0.5 },
      { expLabel: 'Junior Analyst (1 - 2 Yrs)', years: 2, baseLPA: 8.0, monthlyInHandINR: 58000, bonusLPA: 0.8 },
      { expLabel: 'Mid-Level BI Engineer (3 - 5 Yrs)', years: 4, baseLPA: 14.0, monthlyInHandINR: 98000, bonusLPA: 1.5 },
      { expLabel: 'Senior Data Consultant (6 - 8 Yrs)', years: 7, baseLPA: 24.0, monthlyInHandINR: 165000, bonusLPA: 3.0 },
      { expLabel: 'Lead Analytics Manager (8+ Yrs)', years: 9, baseLPA: 34.0, monthlyInHandINR: 230000, bonusLPA: 5.0 }
    ],
    cityBenchmarks: [
      { city: 'Bengaluru', tier: 'Tier 1', avgSalaryLPA: 8.5, fresherSalaryLPA: 6.0, seniorSalaryLPA: 26.0, hiringDensity: 'Very High', livingCostIndex: 'High', topCompanies: ['Swiggy', 'Flipkart', 'Mu Sigma', 'Target India', 'CRED'] },
      { city: 'Hyderabad', tier: 'Tier 1', avgSalaryLPA: 8.0, fresherSalaryLPA: 5.8, seniorSalaryLPA: 24.0, hiringDensity: 'Very High', livingCostIndex: 'Moderate', topCompanies: ['Microsoft IDC', 'Amazon', 'Deloitte', 'Cognizant'] },
      { city: 'Pune', tier: 'Tier 1', avgSalaryLPA: 7.2, fresherSalaryLPA: 5.2, seniorSalaryLPA: 22.0, hiringDensity: 'High', livingCostIndex: 'Moderate', topCompanies: ['Barclays', 'Tech Mahindra', 'Infosys', 'Zensar'] },
      { city: 'Delhi NCR (Gurugram/Noida)', tier: 'Tier 1', avgSalaryLPA: 7.8, fresherSalaryLPA: 5.5, seniorSalaryLPA: 23.5, hiringDensity: 'High', livingCostIndex: 'High', topCompanies: ['Zomato', 'Paytm', 'American Express', 'Genpact'] },
      { city: 'Tier-2 (Jaipur, Indore, Coimbatore)', tier: 'Tier 2', avgSalaryLPA: 4.8, fresherSalaryLPA: 3.6, seniorSalaryLPA: 14.0, hiringDensity: 'Moderate', livingCostIndex: 'Low', topCompanies: ['Local Tech Firms', 'BPO/KPOs', 'Remote Startups'] }
    ],
    factorsDrivingHikes: [
      'Mastery of advanced DAX measures and dimensional data modeling over basic Excel charts',
      'Proven SQL window functions and database optimization skills',
      'Domain expertise in Indian FinTech lending metrics, e-commerce GMV, or healthcare claims',
      'Portfolio proof hosted on NovyPro and GitHub'
    ],
    negotiationTips: [
      'Always quote your expected compensation based on fixed in-hand CTC rather than total variable packages',
      'Leverage competing counter-offers during the standard 60–90 day Indian notice period',
      'Highlight specific business metric improvements from past projects (e.g., "Automated weekly MIS reporting, saving 15 analyst hours weekly")'
    ],
    faqs: [
      { question: 'What is the in-hand monthly salary for a Data Analyst earning ₹6 LPA?', answer: 'Under the New Tax Regime, after standard deductions and PF, monthly in-hand is approximately ₹44,500 – ₹46,000.' },
      { question: 'Do FinTech companies pay more than IT service companies for Data Analysts?', answer: 'Yes. Product FinTech startups (CRED, PhonePe, Razorpay) typically pay 40%–60% higher than traditional IT service companies.' }
    ]
  },
  {
    slug: 'full-stack-developer-salary-india',
    roleTitle: 'Full-Stack Developer Salary in India (2026)',
    category: 'tech',
    categoryLabel: 'Evergreen IT Core',
    experienceScale: [
      { expLabel: 'Fresher (0 - 1 Yr)', years: 0, baseLPA: 5.0, monthlyInHandINR: 38000, bonusLPA: 0.5 },
      { expLabel: 'Junior Dev (1 - 2 Yrs)', years: 2, baseLPA: 8.5, monthlyInHandINR: 62000, bonusLPA: 1.0 },
      { expLabel: 'Software Engineer (3 - 5 Yrs)', years: 4, baseLPA: 15.0, monthlyInHandINR: 105000, bonusLPA: 2.0 },
      { expLabel: 'Senior Full-Stack Lead (6 - 8 Yrs)', years: 7, baseLPA: 26.0, monthlyInHandINR: 178000, bonusLPA: 4.0 },
      { expLabel: 'Principal Engineer / Architect (8+ Yrs)', years: 9, baseLPA: 40.0, monthlyInHandINR: 265000, bonusLPA: 8.0 }
    ],
    cityBenchmarks: [
      { city: 'Bengaluru', tier: 'Tier 1', avgSalaryLPA: 11.5, fresherSalaryLPA: 6.5, seniorSalaryLPA: 32.0, hiringDensity: 'Very High', livingCostIndex: 'High', topCompanies: ['Flipkart', 'Razorpay', 'Atlassian', 'Zepto'] },
      { city: 'Hyderabad', tier: 'Tier 1', avgSalaryLPA: 10.0, fresherSalaryLPA: 5.8, seniorSalaryLPA: 28.0, hiringDensity: 'Very High', livingCostIndex: 'Moderate', topCompanies: ['Uber', 'Qualcomm', 'ServiceNow', 'Oracle'] },
      { city: 'Pune', tier: 'Tier 1', avgSalaryLPA: 8.5, fresherSalaryLPA: 5.0, seniorSalaryLPA: 24.0, hiringDensity: 'High', livingCostIndex: 'Moderate', topCompanies: ['Persistent', 'Thoughtworks', 'Bajaj Finserv'] },
      { city: 'Remote (US/EU Startups)', tier: 'Remote / Global', avgSalaryLPA: 28.0, fresherSalaryLPA: 14.0, seniorSalaryLPA: 65.0, hiringDensity: 'High', livingCostIndex: 'Low', topCompanies: ['Toptal', 'Arc.dev', 'Y-Combinator Startups'] }
    ],
    factorsDrivingHikes: [
      'Mastery of Next.js Server Components, server actions, and web performance optimization',
      'Strong relational schema design in PostgreSQL with Prisma or Drizzle ORM',
      'System design knowledge (microservices, caching with Redis, message queues with Kafka)',
      'Live deployed full-stack applications with payment gateway integrations'
    ],
    negotiationTips: [
      'Demonstrate full-stack ownership by showcasing end-to-end deployed web applications on Vercel or AWS',
      'Request joining bonuses and equity (ESOPs) when joining early-stage Indian product startups'
    ],
    faqs: [
      { question: 'What is the average hike when switching jobs as a Full-Stack Developer in India?', answer: 'Standard market switch hikes range between 30% and 50% for high-demand skills like Next.js, Node.js, and Java Spring Boot.' }
    ]
  },
  {
    slug: 'tally-gst-accountant-salary-india',
    roleTitle: 'Tally Prime & GST Accountant Salary in India (2026)',
    category: 'vocational',
    categoryLabel: 'MSME & Commerce',
    experienceScale: [
      { expLabel: 'Fresher Trainee (0 - 1 Yr)', years: 0, baseLPA: 2.8, monthlyInHandINR: 22000, bonusLPA: 0.2 },
      { expLabel: 'Junior Accountant (1 - 2 Yrs)', years: 2, baseLPA: 3.8, monthlyInHandINR: 29000, bonusLPA: 0.4 },
      { expLabel: 'Senior GST Executive (3 - 5 Yrs)', years: 4, baseLPA: 5.5, monthlyInHandINR: 42000, bonusLPA: 0.6 },
      { expLabel: 'Accounts Manager (6 - 8 Yrs)', years: 7, baseLPA: 8.5, monthlyInHandINR: 62000, bonusLPA: 1.0 },
      { expLabel: 'Independent Tax Practitioner', years: 8, baseLPA: 12.0, monthlyInHandINR: 90000, bonusLPA: 2.0 }
    ],
    cityBenchmarks: [
      { city: 'Mumbai', tier: 'Tier 1', avgSalaryLPA: 4.5, fresherSalaryLPA: 3.2, seniorSalaryLPA: 9.5, hiringDensity: 'Very High', livingCostIndex: 'High', topCompanies: ['CA Advisory Firms', 'Export Houses', 'Textile MSMEs'] },
      { city: 'Ahmedabad & Surat', tier: 'Tier 1', avgSalaryLPA: 4.0, fresherSalaryLPA: 2.8, seniorSalaryLPA: 8.5, hiringDensity: 'Very High', livingCostIndex: 'Moderate', topCompanies: ['Diamond & Textile Units', 'Chemical Manufacturers'] },
      { city: 'Delhi NCR', tier: 'Tier 1', avgSalaryLPA: 4.2, fresherSalaryLPA: 3.0, seniorSalaryLPA: 9.0, hiringDensity: 'High', livingCostIndex: 'High', topCompanies: ['Logistics Firms', 'FMCG Traders', 'CA Partnerships'] },
      { city: 'Tier-2 & Tier-3 Cities', tier: 'Tier 2', avgSalaryLPA: 2.8, fresherSalaryLPA: 2.2, seniorSalaryLPA: 6.0, hiringDensity: 'Very High', livingCostIndex: 'Low', topCompanies: ['Local Wholesalers', 'Retail Chains', 'Hospitals'] }
    ],
    factorsDrivingHikes: [
      'Ability to independently reconcile GSTR-1, GSTR-3B, and GSTR-2B Input Tax Credit without errors',
      'Knowledge of Section 194C and 194J TDS deductions and challan payments',
      'Finalizing annual Balance Sheets and P&L statements ready for CA audit',
      'Part-time evening bookkeeping for local businesses adding ₹20k–₹35k/month'
    ],
    negotiationTips: [
      'Highlight zero-error track record during monthly GST return deadlines (10th, 11th, and 20th of the month)',
      'Negotiate quarterly GST filing bonuses for managing peak compliance cycles'
    ],
    faqs: [
      { question: 'How much can a freelance Tally accountant earn in India?', answer: 'Managing the books for 4 to 6 small shops or traders charges ₹4,000–₹8,000 per client, generating ₹20,000 to ₹45,000 in monthly part-time income.' }
    ]
  },
  {
    slug: 'ai-engineer-salary-india',
    roleTitle: 'AI Automation & Prompt Engineer Salary in India (2026)',
    category: 'tech',
    categoryLabel: 'AI Tools & Automation',
    experienceScale: [
      { expLabel: 'Fresher / Entry (0 - 1 Yr)', years: 0, baseLPA: 7.0, monthlyInHandINR: 52000, bonusLPA: 1.0 },
      { expLabel: 'Junior AI Developer (1 - 2 Yrs)', years: 2, baseLPA: 11.5, monthlyInHandINR: 82000, bonusLPA: 1.5 },
      { expLabel: 'Generative AI Engineer (3 - 5 Yrs)', years: 4, baseLPA: 20.0, monthlyInHandINR: 140000, bonusLPA: 3.0 },
      { expLabel: 'Lead AI Architect (6 - 8 Yrs)', years: 7, baseLPA: 34.0, monthlyInHandINR: 230000, bonusLPA: 6.0 },
      { expLabel: 'Principal AI Scientist (8+ Yrs)', years: 9, baseLPA: 55.0, monthlyInHandINR: 360000, bonusLPA: 12.0 }
    ],
    cityBenchmarks: [
      { city: 'Bengaluru', tier: 'Tier 1', avgSalaryLPA: 16.5, fresherSalaryLPA: 8.5, seniorSalaryLPA: 45.0, hiringDensity: 'Very High', livingCostIndex: 'High', topCompanies: ['Sarvam AI', 'Krutrim', 'Infosys AI Labs', 'Flipkart'] },
      { city: 'Gurugram', tier: 'Tier 1', avgSalaryLPA: 15.0, fresherSalaryLPA: 7.5, seniorSalaryLPA: 40.0, hiringDensity: 'Very High', livingCostIndex: 'High', topCompanies: ['MakeMyTrip AI', 'Zomato', 'Bain & Company'] },
      { city: 'Hyderabad', tier: 'Tier 1', avgSalaryLPA: 14.0, fresherSalaryLPA: 7.0, seniorSalaryLPA: 38.0, hiringDensity: 'High', livingCostIndex: 'Moderate', topCompanies: ['Microsoft AI', 'Amazon AWS', 'Optum'] },
      { city: 'US Remote', tier: 'Remote / Global', avgSalaryLPA: 45.0, fresherSalaryLPA: 22.0, seniorSalaryLPA: 95.0, hiringDensity: 'High', livingCostIndex: 'Low', topCompanies: ['Silicon Valley Startups', 'Remote AI Agencies'] }
    ],
    factorsDrivingHikes: [
      'Production deployment of RAG vector search systems with verifiable source citations',
      'Knowledge of multi-agent state machines with LangGraph / CrewAI',
      'Token optimization and latency reduction techniques',
      'Hands-on fine-tuning and evaluation metrics (Ragas, BLEU, ROUGE)'
    ],
    negotiationTips: [
      'Showcase live deployed AI applications with interactive web interfaces',
      'Emphasize business automation cost reductions (e.g. "Reduced manual support triage time by 75%")'
    ],
    faqs: [
      { question: 'Why are AI salaries higher than traditional software roles?', answer: 'The rapid emergence of enterprise LLM integrations paired with a shortage of engineers who understand vector search and agentic tool calling creates intense hiring competition.' }
    ]
  },
  {
    slug: 'digital-marketer-salary-india',
    roleTitle: 'Digital & Performance Marketer Salary in India (2026)',
    category: 'business',
    categoryLabel: 'Business & Growth',
    experienceScale: [
      { expLabel: 'Fresher / Trainee (0 - 1 Yr)', years: 0, baseLPA: 3.8, monthlyInHandINR: 28000, bonusLPA: 0.4 },
      { expLabel: 'Performance Executive (1 - 2 Yrs)', years: 2, baseLPA: 5.8, monthlyInHandINR: 44000, bonusLPA: 0.8 },
      { expLabel: 'Senior Media Buyer / SEO Lead (3 - 5 Yrs)', years: 4, baseLPA: 9.5, monthlyInHandINR: 70000, bonusLPA: 1.5 },
      { expLabel: 'Growth Marketing Manager (6 - 8 Yrs)', years: 7, baseLPA: 16.0, monthlyInHandINR: 112000, bonusLPA: 3.0 },
      { expLabel: 'Head of Growth / VP Marketing', years: 9, baseLPA: 28.0, monthlyInHandINR: 190000, bonusLPA: 6.0 }
    ],
    cityBenchmarks: [
      { city: 'Gurugram & Delhi NCR', tier: 'Tier 1', avgSalaryLPA: 7.5, fresherSalaryLPA: 4.2, seniorSalaryLPA: 20.0, hiringDensity: 'Very High', livingCostIndex: 'High', topCompanies: ['Dentsu', 'GroupM', 'Mamaearth', 'Lenskart'] },
      { city: 'Mumbai', tier: 'Tier 1', avgSalaryLPA: 8.0, fresherSalaryLPA: 4.5, seniorSalaryLPA: 22.0, hiringDensity: 'Very High', livingCostIndex: 'High', topCompanies: ['Nykaa', 'Schbang', 'FoxyMoron', 'Publicis'] },
      { city: 'Bengaluru', tier: 'Tier 1', avgSalaryLPA: 7.8, fresherSalaryLPA: 4.0, seniorSalaryLPA: 21.0, hiringDensity: 'High', livingCostIndex: 'High', topCompanies: ['Cult.fit', 'KreditBee', 'GrowthX'] },
      { city: 'Freelance / Retainer Model', tier: 'Remote / Global', avgSalaryLPA: 14.0, fresherSalaryLPA: 6.0, seniorSalaryLPA: 35.0, hiringDensity: 'High', livingCostIndex: 'Low', topCompanies: ['Direct D2C Brands', 'US Dropshipping Stores'] }
    ],
    factorsDrivingHikes: [
      'Proven track record of managing ₹5L+ monthly ad spends with profitable ROAS (3.5x+)',
      'Technical SEO knowledge (Core Web Vitals, Schema markup, programmatic SEO)',
      'Direct response copywriting and UGC video ad direction',
      'Advanced GA4 custom event tracking and attribution modeling'
    ],
    negotiationTips: [
      'Present a portfolio case study showing ad spend vs net revenue generated with ROAS metrics',
      'Negotiate performance profit-share bonuses (e.g. 5% of incremental revenue generated over target)'
    ],
    faqs: [
      { question: 'Can digital marketers work remotely for overseas clients?', answer: 'Yes! International D2C brands frequently hire Indian media buyers and SEO specialists on retainers of $1,000–$3,000 per month.' }
    ]
  }
];

import { extraSalaryGuides } from './moreSalaryGuides';

export const allSalaryGuidesList: SalaryRoleGuide[] = [...salaryGuidesList, ...extraSalaryGuides];

export const getSalaryGuideBySlug = (slug: string): SalaryRoleGuide | undefined => {
  return allSalaryGuidesList.find(g => g.slug === slug);
};

