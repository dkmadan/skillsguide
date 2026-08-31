import { SalaryRoleGuide } from './salaryData';

export const extraSalaryGuides: SalaryRoleGuide[] = [
  {
    slug: 'devops-sre-salary-india',
    roleTitle: 'DevOps & SRE Engineer Salary in India (2026)',
    category: 'tech',
    categoryLabel: 'Enterprise Cloud & SRE',
    experienceScale: [
      { expLabel: 'Entry / Junior (0 - 1 Yr)', years: 0, baseLPA: 6.5, monthlyInHandINR: 48000, bonusLPA: 0.8 },
      { expLabel: 'DevOps Engineer (1 - 3 Yrs)', years: 2, baseLPA: 12.0, monthlyInHandINR: 85000, bonusLPA: 1.5 },
      { expLabel: 'Senior SRE Lead (4 - 6 Yrs)', years: 5, baseLPA: 22.0, monthlyInHandINR: 152000, bonusLPA: 3.5 },
      { expLabel: 'Principal Cloud Architect (7+ Yrs)', years: 8, baseLPA: 38.0, monthlyInHandINR: 255000, bonusLPA: 7.0 }
    ],
    cityBenchmarks: [
      { city: 'Bengaluru', tier: 'Tier 1', avgSalaryLPA: 15.0, fresherSalaryLPA: 7.5, seniorSalaryLPA: 42.0, hiringDensity: 'Very High', livingCostIndex: 'High', topCompanies: ['CRED', 'Swiggy', 'PhonePe', 'Flipkart'] },
      { city: 'Hyderabad', tier: 'Tier 1', avgSalaryLPA: 13.5, fresherSalaryLPA: 7.0, seniorSalaryLPA: 38.0, hiringDensity: 'Very High', livingCostIndex: 'Moderate', topCompanies: ['Amazon AWS', 'Microsoft', 'ServiceNow'] },
      { city: 'Pune', tier: 'Tier 1', avgSalaryLPA: 11.5, fresherSalaryLPA: 6.0, seniorSalaryLPA: 34.0, hiringDensity: 'High', livingCostIndex: 'Moderate', topCompanies: ['Barclays', 'Thoughtworks', 'Mastercard'] }
    ],
    factorsDrivingHikes: ['Certified Kubernetes Administrator (CKA) credential', 'Terraform modular multi-cloud infrastructure automation', 'Site reliability incident response and 99.99% uptime track record'],
    negotiationTips: ['Emphasize deployment frequency improvements and cloud cost reduction percentage in past roles'],
    faqs: [{ question: 'What is the highest salary for a DevOps Lead in Bengaluru?', answer: 'Senior DevOps / SRE Architects in funded tech unicorns routinely command ₹35L–₹50L LPA fixed packages.' }]
  },
  {
    slug: 'video-editor-salary-india',
    roleTitle: 'Video Editor & Motion Designer Salary in India (2026)',
    category: 'vocational',
    categoryLabel: 'Creator Economy Boom',
    experienceScale: [
      { expLabel: 'Fresher / Junior Editor (0 - 1 Yr)', years: 0, baseLPA: 3.6, monthlyInHandINR: 26000, bonusLPA: 0.4 },
      { expLabel: 'Creator Editor (1 - 3 Yrs)', years: 2, baseLPA: 6.5, monthlyInHandINR: 48000, bonusLPA: 0.8 },
      { expLabel: 'Senior Post-Production Lead (4 - 6 Yrs)', years: 5, baseLPA: 12.0, monthlyInHandINR: 85000, bonusLPA: 1.5 },
      { expLabel: 'Independent Freelance Retainer', years: 3, baseLPA: 18.0, monthlyInHandINR: 130000, bonusLPA: 3.0 }
    ],
    cityBenchmarks: [
      { city: 'Mumbai', tier: 'Tier 1', avgSalaryLPA: 7.5, fresherSalaryLPA: 4.0, seniorSalaryLPA: 18.0, hiringDensity: 'Very High', livingCostIndex: 'High', topCompanies: ['Top YouTube Creators', 'OTT Studios', 'D2C Agencies'] },
      { city: 'Delhi NCR', tier: 'Tier 1', avgSalaryLPA: 6.8, fresherSalaryLPA: 3.8, seniorSalaryLPA: 16.0, hiringDensity: 'Very High', livingCostIndex: 'High', topCompanies: ['EdTech Studios', 'Media Agencies'] },
      { city: 'Remote Global (US/UK Creators)', tier: 'Remote / Global', avgSalaryLPA: 22.0, fresherSalaryLPA: 10.0, seniorSalaryLPA: 45.0, hiringDensity: 'High', livingCostIndex: 'Low', topCompanies: ['International Creators', 'US Podcast Networks'] }
    ],
    factorsDrivingHikes: ['High retention metrics (first 3-second hook rate > 65%)', 'DaVinci Resolve cinematic color grading', 'Kinetic typography and sound design polish'],
    negotiationTips: ['Charge per finished minute or flat monthly retainer (e.g. ₹50k for 12 reels/month) rather than hourly rates'],
    faqs: [{ question: 'How much do Indian editors charge per Instagram Reel?', answer: 'Junior editors charge ₹1,500–₹3,000 per reel, while top retention editors charge ₹5,000–₹10,000 per 60-second video.' }]
  },
  {
    slug: 'product-manager-salary-india',
    roleTitle: 'Product Manager (PM & APM) Salary in India (2026)',
    category: 'business',
    categoryLabel: 'Product & Leadership',
    experienceScale: [
      { expLabel: 'Associate PM (0 - 2 Yrs)', years: 1, baseLPA: 10.0, monthlyInHandINR: 72000, bonusLPA: 1.5 },
      { expLabel: 'Product Manager (3 - 5 Yrs)', years: 4, baseLPA: 18.0, monthlyInHandINR: 125000, bonusLPA: 3.0 },
      { expLabel: 'Senior Product Manager (6 - 8 Yrs)', years: 7, baseLPA: 32.0, monthlyInHandINR: 215000, bonusLPA: 6.0 },
      { expLabel: 'VP of Product / CPO (8+ Yrs)', years: 9, baseLPA: 55.0, monthlyInHandINR: 360000, bonusLPA: 12.0 }
    ],
    cityBenchmarks: [
      { city: 'Bengaluru', tier: 'Tier 1', avgSalaryLPA: 22.0, fresherSalaryLPA: 12.0, seniorSalaryLPA: 60.0, hiringDensity: 'Very High', livingCostIndex: 'High', topCompanies: ['Swiggy', 'CRED', 'Flipkart', 'Razorpay'] },
      { city: 'Gurugram', tier: 'Tier 1', avgSalaryLPA: 20.0, fresherSalaryLPA: 11.0, seniorSalaryLPA: 55.0, hiringDensity: 'Very High', livingCostIndex: 'High', topCompanies: ['Zomato', 'MakeMyTrip', 'Blinkit'] }
    ],
    factorsDrivingHikes: ['Track record of moving core business KPIs (Conversion Rate, Retention, GMV)', 'Clear PRD writing and technical empathy', 'A/B testing and experimentation velocity'],
    negotiationTips: ['Always negotiate for meaningful stock options (ESOPs) alongside cash CTC in fast-growing startups'],
    faqs: [{ question: 'What is the entry package for an APM in Bengaluru?', answer: 'Top product startups offer ₹10L–₹16L LPA starting CTC for APMs.' }]
  },
  {
    slug: 'freelancer-usd-salary-india',
    roleTitle: 'USD Freelance Earnings Benchmark in India (2026)',
    category: 'business',
    categoryLabel: 'Earn in USD from India',
    experienceScale: [
      { expLabel: 'Starting Freelancer (0 - 6 Mos)', years: 0, baseLPA: 6.0, monthlyInHandINR: 50000, bonusLPA: 0 },
      { expLabel: 'Established Upwork Specialist (1 - 2 Yrs)', years: 2, baseLPA: 18.0, monthlyInHandINR: 140000, bonusLPA: 0 },
      { expLabel: 'Top-Rated Plus Consultant (3+ Yrs)', years: 4, baseLPA: 36.0, monthlyInHandINR: 280000, bonusLPA: 0 }
    ],
    cityBenchmarks: [
      { city: 'Work from Anywhere India', tier: 'Remote / Global', avgSalaryLPA: 18.0, fresherSalaryLPA: 6.0, seniorSalaryLPA: 45.0, hiringDensity: 'Very High', livingCostIndex: 'Low', topCompanies: ['Direct US/EU Clients', 'Upwork Enterprise', 'Toptal'] }
    ],
    factorsDrivingHikes: ['High proposal response rates with personalized Loom screen shares', 'Positive 5-star client testimonials and Top Rated Plus badge', 'Offering full-stack end-to-end turnkey solutions'],
    negotiationTips: ['Quote fixed-price milestones for fast projects or $30–$60/hr for ongoing retainer contracts'],
    faqs: [{ question: 'How much tax does a freelancer pay in India under Section 44ADA?', answer: 'Tax is computed on only 50% of gross receipts, resulting in effective tax rates often under 5%–8% with standard deductions.' }]
  }
];
