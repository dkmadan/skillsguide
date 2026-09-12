export interface CategoryDomain {
  slug: string;
  title: string;
  badge: string;
  shortDesc: string;
  longDesc: string;
  icon: string;
  themeColor: 'purple' | 'emerald' | 'amber' | 'cyan' | 'rose' | 'teal' | 'blue' | 'indigo';
  accentGradient: string;
  cardBorder: string;
  cagrGrowth: string;
  averageSalary: string;
  hiringVolume: string;
  topHubs: string[];
  topicSlugs: string[];
  sourceAttribution: string;
  measurementPeriod: string;
  geography: string;
}

export const categoryDomains: CategoryDomain[] = [
  {
    slug: 'emerging-tech-ai',
    title: 'Emerging Tech & AI Engineering',
    badge: 'High-Demand Frontier',
    shortDesc: 'Master autonomous agentic workflows, multi-cloud declarative infrastructure, active cyber defense, and edge computing.',
    longDesc: 'The artificial intelligence and cloud platform frontier is shifting from static machine learning models to autonomous multi-agent systems, declarative multi-cloud infrastructure, zero-trust security postures, and low-latency bare-metal edge devices. Indian tech hubs (Bengaluru, Hyderabad, Pune) and Global Capability Centers (GCCs) are actively recruiting specialists capable of building operational Agentic pipelines with MCP, managing Kubernetes operators at scale, and securing enterprise attack surfaces.',
    icon: 'BrainCircuit',
    themeColor: 'purple',
    accentGradient: 'from-purple-600 via-indigo-600 to-cyan-500',
    cardBorder: 'border-purple-500/30',
    cagrGrowth: 'Estimated 28%–34% YoY Sector Demand',
    averageSalary: '₹12.0L – ₹32.0L LPA (Band Range)',
    hiringVolume: 'High Concentration across GCCs & Product Labs',
    topHubs: ['Bengaluru', 'Hyderabad', 'Pune', 'Gurugram', 'Remote Global'],
    sourceAttribution: 'NASSCOM Tech Industry Pulse & GCC Talent Landscape Report',
    measurementPeriod: 'CY2024–CY2025 Industry Aggregate',
    geography: 'Pan-India Tech Hubs & Remote GCC Roles',
    topicSlugs: [
      'ai-agents-llm-apps',
      'ai-agent-evaluation-observability',
      'ai-security-llm-security',
      'multimodal-ai-engineering',
      'mlops-ml-platform',
      'data-engineering',
      'backend-engineering-api',
      'software-architecture',
      'generative-ai-agentic-workflows',
      'platform-engineering',
      'sre',
      'finops',
      'data-governance',
      'cloud-platform-engineering',
      'cybersecurity-ethical-hacking',
      'iot-embedded-systems'
    ]
  },
  {
    slug: 'education-pedagogy',
    title: 'Education, Pedagogy & EdTech',
    badge: 'Educational Leadership & Teaching',
    shortDesc: 'Master evidence-based teaching methodologies, Bloom\'s taxonomy, classroom management, e-learning design, and educational leadership.',
    longDesc: 'Education in India is experiencing a paradigm shift powered by the National Education Policy (NEP 2020), digital hybrid classrooms, and competency-based assessment. Opportunities span K-12 academic coordination, instructional design for enterprise e-learning, special education inclusion, live online coaching, and school administration across CBSE, ICSE, and international IB school networks.',
    icon: 'BookOpen',
    themeColor: 'cyan',
    accentGradient: 'from-sky-500 via-blue-600 to-indigo-600',
    cardBorder: 'border-sky-500/30',
    cagrGrowth: 'Estimated 18%–24% YoY Education Expansion',
    averageSalary: '₹4.5L – ₹14.0L LPA (Band Range)',
    hiringVolume: '35,000+ Active School & EdTech Openings',
    topHubs: ['Delhi NCR', 'Bengaluru', 'Mumbai', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata'],
    sourceAttribution: 'Ministry of Education (MoE) & Indian School Education Industry Outlook',
    measurementPeriod: 'CY2024–CY2026 Academic Study',
    geography: 'Pan-India K-12 Networks, Universities & EdTech Centers',
    topicSlugs: [
      'teaching-pedagogy',
      'classroom-management',
      'lesson-planning',
      'curriculum-development',
      'instructional-design',
      'online-teaching',
      'early-childhood-education',
      'special-education',
      'edtech',
      'student-assessment-evaluation',
      'academic-counseling',
      'teacher-communication-skills',
      'educational-leadership',
      'school-administration'
    ]
  },
  {
    slug: 'pharma-healthcare-life-sciences',
    title: 'Pharmacy, Healthcare & Life Sciences',
    badge: 'Clinical & Drug Development',
    shortDesc: 'Lead the pharmaceutical pipeline across hospital pharmacy, clinical research, drug safety, GMP manufacturing, and regulatory affairs.',
    longDesc: 'India is the global "Pharmacy of the World", supplying over 20% of global generic medicines and 60% of world vaccines. Spanning hospital clinical pharmacy, pharmacovigilance for US FDA/EMA, electronic clinical data management (CDM), sterile cGMP manufacturing, and hospital administration, life sciences professionals power high-impact careers protecting global public health.',
    icon: 'HeartPulse',
    themeColor: 'emerald',
    accentGradient: 'from-emerald-500 via-teal-600 to-cyan-600',
    cardBorder: 'border-emerald-500/30',
    cagrGrowth: 'Estimated 15%–19% YoY Pharma Industry Growth',
    averageSalary: '₹4.5L – ₹16.0L LPA (Band Range)',
    hiringVolume: '30,000+ Openings across Pharma Hubs & CROs',
    topHubs: ['Hyderabad', 'Ahmedabad', 'Mumbai', 'Bengaluru', 'Pune', 'Baddi (HP)', 'Chennai'],
    sourceAttribution: 'Indian Pharmaceutical Alliance (IPA) & Pharmexcil Export Report',
    measurementPeriod: 'CY2024–CY2026 Sector Benchmark',
    geography: 'Pharma Clusters, Clinical CROs & Super-Specialty Hospitals',
    topicSlugs: [
      'pharmacy-practice',
      'clinical-pharmacy',
      'hospital-pharmacy',
      'community-pharmacy',
      'pharmaceutical-quality-assurance',
      'pharmaceutical-quality-control',
      'pharmacovigilance',
      'regulatory-affairs',
      'drug-safety',
      'clinical-research',
      'clinical-data-management',
      'gmp-manufacturing',
      'pharmaceutical-sales-marketing',
      'medical-writing',
      'pharmacy-inventory-management',
      'healthcare-data-analytics',
      'hospital-administration'
    ]
  },
  {
    slug: 'law-legal-operations',
    title: 'Law, Corporate Governance & Compliance',
    badge: 'Legal Operations & Advisory',
    shortDesc: 'Navigate corporate M&A deals, contract drafting, patent prosecution, litigation advocacy, cyber law, and DPDP Act compliance.',
    longDesc: 'Modern legal practice blends statutory mastery with commercial strategy and technology. From high-stakes M&A transactions and international arbitration to IP patent prosecution, courtroom litigation, secretarial audits, and digital personal data protection (DPDP 2023) governance, legal professionals safeguard enterprise value and constitutional rights.',
    icon: 'Scale',
    themeColor: 'indigo',
    accentGradient: 'from-indigo-600 via-purple-600 to-pink-600',
    cardBorder: 'border-indigo-500/30',
    cagrGrowth: 'Estimated 16%–22% YoY Legal Ops & Compliance Growth',
    averageSalary: '₹6.0L – ₹22.0L LPA (Band Range)',
    hiringVolume: '20,000+ Law Firm & In-House Legal Openings',
    topHubs: ['Delhi NCR', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Kolkata', 'Chennai', 'Pune'],
    sourceAttribution: 'Bar Council of India & Indian Corporate Legal Benchmarks',
    measurementPeriod: 'CY2024–CY2025 Industry Review',
    geography: 'Metropolitan High Courts, Corporate HQs & In-House Teams',
    topicSlugs: [
      'intellectual-property-law',
      'corporate-law',
      'contract-law',
      'contract-drafting',
      'legal-research',
      'legal-writing',
      'legal-drafting',
      'litigation-skills',
      'cyber-law',
      'data-privacy-law',
      'arbitration-mediation',
      'company-secretary-skills'
    ]
  },
  {
    slug: 'accounting-corporate-finance',
    title: 'Accounting, Taxation & Corporate Finance',
    badge: 'Financial Integrity & FP&A',
    shortDesc: 'Master statutory general ledger accounting, GST returns, corporate income tax, Ind AS reporting, internal audits, and FP&A models.',
    longDesc: 'Accounting and Corporate Finance form the indispensable backbone of every enterprise. Master dual-entry bookkeeping, GST e-invoicing and GSTR-2B matching, TDS challans, payroll statutory deductions, statutory auditing under CARO 2020, Ind AS 115/116 financial statement preparation, and 3-statement financial forecasting (FP&A).',
    icon: 'IndianRupee',
    themeColor: 'emerald',
    accentGradient: 'from-emerald-600 via-teal-600 to-green-500',
    cardBorder: 'border-emerald-500/30',
    cagrGrowth: 'Estimated 14%–18% YoY Finance & Audit Demand',
    averageSalary: '₹4.0L – ₹16.0L LPA (Band Range)',
    hiringVolume: '45,000+ Active Accounts & Finance Openings',
    topHubs: ['Mumbai', 'Delhi NCR', 'Bengaluru', 'Ahmedabad', 'Hyderabad', 'Kolkata', 'Pune'],
    sourceAttribution: 'ICAI Industry Pulse & Corporate Financial Services Benchmark',
    measurementPeriod: 'CY2024–CY2026 Fiscal Survey',
    geography: 'Pan-India Corporate Hubs, CA Firms & Shared Service Centers',
    topicSlugs: [
      'financial-accounting',
      'gst-accounting',
      'income-tax',
      'tds-compliance',
      'payroll-accounting',
      'auditing',
      'accounting-standards',
      'financial-analysis',
      'tally-gst'
    ]
  },
  {
    slug: 'business-growth-nocode',
    title: 'Business, Growth & Modern No-Code',
    badge: 'Modern Digital Execution',
    shortDesc: 'Accelerate revenue velocity, launch enterprise MVPs without heavy code, and manage specialized business workflows.',
    longDesc: 'Modern business velocity rewards operators who build and iterate fast. By combining product discovery frameworks, Amplitude behavioral analytics, full-stack visual builders (Bubble, Webflow), and automated webhook routers (Make.com, Zapier, Airtable), growth professionals can conceptualize, build, test, and monetize digital products rapidly. Complemented by performance marketing and analytics, this domain powers high-growth startups, SMEs, and international freelancing practices.',
    icon: 'TrendingUp',
    themeColor: 'amber',
    accentGradient: 'from-amber-500 via-orange-600 to-rose-600',
    cardBorder: 'border-amber-500/30',
    cagrGrowth: 'Estimated 22%–26% YoY Digital Adoption',
    averageSalary: '₹8.5L – ₹24.0L LPA (Band Range)',
    hiringVolume: 'Active across Startups, D2C Brands & Agencies',
    topHubs: ['Bengaluru', 'Mumbai', 'Gurugram', 'Delhi NCR', 'Pan-India Remote'],
    sourceAttribution: 'IAMAI Digital Commerce & Marketing Industry Review',
    measurementPeriod: 'CY2024 Survey Benchmark',
    geography: 'Metropolitan & Tier-1 Digital Marketing Clusters',
    topicSlugs: [
      'revops-sales-operations',
      'technical-seo',
      'salesforce-administration',
      'servicenow-development',
      'sap-s4hana',
      'power-platform',
      'product-management-growth',
      'nocode-lowcode-development',
      'digital-marketing-seo-performance',
      'gst-practitioner',
      'medical-coding',
      'logistics-supply-chain',
      'insurance',
      'real-estate',
      'newsletter-growth',
      'community-management'
    ]
  },
  {
    slug: 'industrial-automation-engineering',
    title: 'Industrial Automation & Core Engineering',
    badge: 'Industry 4.0 & Smart Manufacturing',
    shortDesc: 'Program industrial PLCs & SCADA, design automotive AUTOSAR embedded systems, robotics, and precision manufacturing.',
    longDesc: 'India is rapidly expanding into a global manufacturing powerhouse under the Make in India initiative. Spanning automated automotive assembly lines, Siemens/Rockwell PLC programming, SCADA telemetry, Electric Vehicle (EV) ECU firmware under AUTOSAR, and multi-axis CNC/CAD engineering, core engineers lead the Industry 4.0 transformation.',
    icon: 'Wrench',
    themeColor: 'amber',
    accentGradient: 'from-amber-600 via-orange-600 to-red-600',
    cardBorder: 'border-amber-500/30',
    cagrGrowth: 'Estimated 20%–26% YoY Industrial Automation Growth',
    averageSalary: '₹5.0L – ₹18.0L LPA (Band Range)',
    hiringVolume: '25,000+ Manufacturing & Core Tech Openings',
    topHubs: ['Pune', 'Chennai', 'Ahmedabad', 'Bengaluru', 'NCR / Manesar', 'Coimbatore'],
    sourceAttribution: 'Automotive Component Manufacturers Association (ACMA) & CII Report',
    measurementPeriod: 'CY2024–CY2026 Industrial Outlook',
    geography: 'Automotive Corridors, Industrial Estates & Tech R&D Centers',
    topicSlugs: [
      'industrial-automation-plc-scada',
      'automotive-embedded-software-autosar',
      'ev-battery-tech',
      'solar-renewable-energy-design'
    ]
  },
  {
    slug: 'creative-design-media',
    title: 'Creative, Design & Spatial Media',
    badge: 'Visual, Spatial & Interactive Media',
    shortDesc: 'Bridge spatial computing, real-time 3D pipelines, multi-brand design systems, and UX research.',
    longDesc: 'From tactile micro-interactions in Figma and Tokens Studio to real-time photorealistic ArchViz and AAA game development in Unreal Engine 5, creative design media has transformed into an engineering-adjacent discipline. As consumer brands prioritize high-conversion design systems, video workflows, and immersive digital assets, designers with structured systems expertise find diverse opportunities across India and global remote studios.',
    icon: 'Palette',
    themeColor: 'rose',
    accentGradient: 'from-rose-500 via-pink-600 to-purple-600',
    cardBorder: 'border-rose-500/30',
    cagrGrowth: 'Estimated 20%–25% Media & UI Demand',
    averageSalary: '₹7.0L – ₹22.0L LPA (Band Range)',
    hiringVolume: 'Diverse Studio, Product & Agency Demand',
    topHubs: ['Bengaluru', 'Mumbai', 'Pune', 'Hyderabad', 'Chennai'],
    sourceAttribution: 'Design in Tech Industry Survey & Indian Gaming/Media Reports',
    measurementPeriod: 'CY2024–CY2025 Study',
    geography: 'Major Indian Design & Agency Clusters',
    topicSlugs: [
      'ux-research-design-systems',
      'unreal-engine-game-development',
      'ui-ux-product-design',
      '3d-spatial-computing',
      'youtube-ops',
      'podcast-production'
    ]
  },
  {
    slug: 'leadership-professional-growth',
    title: 'Executive Leadership & Soft Skills',
    badge: 'Career Velocity & Commercial Influence',
    shortDesc: 'Master high-stakes commercial negotiation, keynote storytelling, team mentorship, and executive presence.',
    longDesc: 'Technical skills open doors, but executive leadership and persuasive communication drive commercial altitude and rapid promotions. Master the Harvard Negotiation Framework (BATNA/ZOPA), high-stakes keynote presentations, crisis communication, and cross-functional team leadership.',
    icon: 'Sparkles',
    themeColor: 'purple',
    accentGradient: 'from-purple-600 via-pink-600 to-indigo-600',
    cardBorder: 'border-purple-500/30',
    cagrGrowth: 'Universal Executive Demand',
    averageSalary: '₹10.0L – ₹35.0L LPA (Executive Range)',
    hiringVolume: 'Universal Leadership Competency',
    topHubs: ['Pan-India', 'Bengaluru', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Pune'],
    sourceAttribution: 'Harvard Program on Negotiation & Corporate Executive Benchmarks',
    measurementPeriod: 'CY2024–CY2026 Leadership Study',
    geography: 'Pan-India Corporate HQs & Executive Suites',
    topicSlugs: [
      'public-speaking-negotiation',
      'community-management'
    ]
  },
  {
    slug: 'green-tech-sustainability',
    title: 'Green Tech & Sustainable Industry',
    badge: 'Clean Energy & Net-Zero Transition',
    shortDesc: 'Lead the clean mobility and renewable transition across field technician operations, design-engineering simulation, and corporate ESG reporting.',
    longDesc: 'India is undergoing a clean technology industrial transformation, backed by government PLI schemes, EV adoption mandates, and renewable energy targets of 500GW non-fossil capacity by 2030. Opportunities span three distinct career pathways: (1) Practical Field Technicians (rooftop solar installation, EV 2W/3W motor & battery maintenance), (2) Design Engineers (PVsyst solar yield modeling, high-voltage grid SLDs, MATLAB BMS simulation), and (3) Sustainability Analysts (SEBI BRSR reporting, GHG Protocol Scope 1-3 carbon accounting).',
    icon: 'Zap',
    themeColor: 'teal',
    accentGradient: 'from-teal-500 via-emerald-600 to-green-600',
    cardBorder: 'border-teal-500/30',
    cagrGrowth: 'Estimated 30%–36% Clean Energy Capacity Expansion',
    averageSalary: '₹5.5L – ₹22.0L LPA (Pathway Dependent)',
    hiringVolume: 'Spanning Manufacturing OEMs, EPC Contractors & ESG Audits',
    topHubs: ['Pune', 'Chennai', 'Bengaluru', 'Ahmedabad', 'NCR / Manesar', 'Jaipur'],
    sourceAttribution: 'Ministry of New & Renewable Energy (MNRE) & CEA National Electricity Plan',
    measurementPeriod: 'CY2024–CY2030 Target Projections',
    geography: 'Industrial Corridors, Solar Parks & Corporate Headquarters',
    topicSlugs: [
      'ev-battery-tech',
      'solar-renewable-energy-design'
    ]
  }
];

export const getCategoryBySlug = (slug: string): CategoryDomain | undefined => {
  return categoryDomains.find(c => c.slug === slug);
};
