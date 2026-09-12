export type Answers = Record<string, string>;

export type Question = {
  id: string;
  label: string;
  options?: string[];
  optional?: boolean;
  type?: 'text' | 'number';
  hint?: string;
  category?: string;
};

export const comfort = ['None yet', 'Beginner', 'Comfortable', 'Strong', 'Advanced'];

export type UserDomainType = 
  | 'law_legal' 
  | 'finance_ca' 
  | 'pharma_health' 
  | 'education' 
  | 'core_engineering' 
  | 'technology' 
  | 'design_media' 
  | 'general_business';

export function resolveUserDomain(answers: Answers): UserDomainType {
  const edu = answers.education || '';
  const domain = answers.domain || '';

  if (edu.includes('CA / CS / CMA') || domain.includes('Chartered Accountancy') || domain.includes('Finance / Accounts') || edu.includes('Commerce')) {
    if (edu.includes('CA / CS / CMA') || domain.includes('Chartered Accountancy')) return 'finance_ca';
  }
  if (edu.includes('LL.B') || domain.includes('Law / Legal')) return 'law_legal';
  if (edu.includes('B.Pharm') || edu.includes('MBBS') || domain.includes('Pharmacy / Healthcare')) return 'pharma_health';
  if (edu.includes('B.Ed') || domain.includes('Education / Teaching')) return 'education';
  if (edu.includes('Core Eng') || edu.includes('Diploma / ITI') || domain.includes('Core Engineering')) return 'core_engineering';
  if (edu.includes('Computer Science') || domain.includes('Technology')) return 'technology';
  if (edu.includes('Design / Fine Arts') || domain.includes('Design / Media')) return 'design_media';
  if (edu.includes('Commerce') || domain.includes('Business Operations')) return 'finance_ca';
  
  return 'general_business';
}

// ---------------------------------------------------------------------------
// Step 1: Base Starting Point
// ---------------------------------------------------------------------------
export const baseStartingQuestions: Question[] = [
  {
    id: 'education',
    label: 'Highest educational qualification',
    options: [
      'CA / CS / CMA (Chartered Accountant / Finance Pro)',
      'LL.B / LL.M (Law Graduate / Advocate)',
      'B.Pharm / M.Pharm / Pharma.D / Life Sciences',
      'MBBS / BDS / Nursing / Allied Health',
      'B.Ed / M.Ed / Teaching Credential',
      'B.Com / BBA / M.Com (Commerce & Finance)',
      'B.Tech / B.E / BCA / MCA (Computer Science & IT)',
      'B.Tech / Diploma (Mechanical / Electrical / Core Eng)',
      'MBA / Post-Graduate Management',
      'BA / MA / Humanities & Social Sciences',
      'B.Sc / M.Sc (Pure Sciences / Statistics / Math)',
      'B.Arch / Design / Fine Arts',
      'Diploma / ITI (Technical Trades)',
      '12th Standard / Non-Graduate'
    ],
    hint: 'Your background unlocks specific accelerated career pathways without starting from scratch.'
  },
  {
    id: 'experience',
    label: 'Total work experience',
    options: [
      'Fresher / College Student',
      'Under 2 years',
      '2–5 years',
      '5–10 years',
      '10+ years'
    ]
  },
  {
    id: 'domain',
    label: 'Current or most familiar industry field',
    options: [
      'Chartered Accountancy / Taxation / Finance',
      'Law / Legal & Compliance',
      'Pharmacy / Healthcare / Clinical',
      'Education / Teaching / EdTech',
      'Technology / Software / Data',
      'Core Engineering / Manufacturing / Automation',
      'Business Operations / Sales / Product',
      'Design / Creative Media / Content',
      'Still exploring / Career Switcher'
    ]
  },
  {
    id: 'status',
    label: 'Current professional situation',
    options: [
      'Student / In final year of college',
      'Looking for my first job',
      'Employed & looking for high-growth upskilling',
      'Returning after a career break',
      'Self-employed / Independent Practitioner'
    ]
  },
  {
    id: 'salary',
    label: 'Current annual salary (₹ lakh)',
    type: 'number',
    optional: true,
    hint: 'Optional. Used to prevent suggesting career pathways with a negative pay delta.'
  },
  {
    id: 'location',
    label: 'Current city & state',
    type: 'text',
    hint: 'Used to benchmark local hiring clusters in your regional market.'
  }
];

// ---------------------------------------------------------------------------
// Step 2: Intelligent Strengths (Adaptive per Domain)
// ---------------------------------------------------------------------------
export function getStrengthQuestions(userDomain: UserDomainType): Question[] {
  switch (userDomain) {
    case 'law_legal':
      return [
        { id: 'legal_drafting', label: 'Contract Drafting & Agreement Structuring', options: comfort, hint: 'Reviewing indemnity, limitation of liability, MSAs, and NDAs' },
        { id: 'statutory_research', label: 'Statutory Research & Case Law (SCC / Manupatra)', options: comfort, hint: 'Finding judicial precedents, Bare Acts, and regulatory notifications' },
        { id: 'litigation_advocacy', label: 'Litigation, Courtroom Arguments & Dispute Strategy', options: comfort, hint: 'Drafting petitions, pleading before High Courts/NCLT, arbitration' },
        { id: 'corporate_compliance', label: 'Corporate Law, M&A & DPDP Act Compliance', options: comfort, hint: 'Due diligence, SEBI regulations, and data privacy frameworks' },
        { id: 'client_advisory', label: 'Commercial Advisory & Client Negotiation', options: comfort, hint: 'Translating legal risks into commercial business decisions' },
        { id: 'detail', label: 'Meticulous Attention to Detail & Clause Cross-Referencing', options: comfort, hint: 'Catching subtle ambiguities in contracts and statutory definitions' }
      ];

    case 'finance_ca':
      return [
        { id: 'statutory_audit', label: 'Statutory Auditing, Internal Controls & Ind AS / IFRS', options: comfort, hint: 'Audit sampling, vouching, CARO 2020, and financial statement review' },
        { id: 'taxation_gst', label: 'Direct & Indirect Taxation (GST Filings & Corporate Tax)', options: comfort, hint: 'GSTR-1/3B reconciliation, ITC audits, ITR-6, TDS/TCS' },
        { id: 'financial_modeling', label: 'Financial Modeling & Valuation (DCF / 3-Statement Excel)', options: comfort, hint: 'Forecasting cash flows, WACC, sensitivity analysis, and M&A valuation' },
        { id: 'erp_accounting', label: 'Accounting Software & ERPs (TallyPrime, SAP FICO, Zoho)', options: comfort, hint: 'Ledger management, balance sheets, e-invoicing, and sub-ledgers' },
        { id: 'cost_analysis', label: 'Working Capital & Cost MIS Reporting', options: comfort, hint: 'Variance analysis, budget allocation, and liquidity management' },
        { id: 'detail', label: 'Numerical Accuracy & Precision Reconciliation', options: comfort, hint: 'Reconciling 2B vs purchase registers and complex ledger entries' }
      ];

    case 'pharma_health':
      return [
        { id: 'pharmacology', label: 'Pharmacology, Drug Interactions & Patient Counseling', options: comfort, hint: 'Mechanism of action, contraindicated drug pairings, dosage regimens' },
        { id: 'pharmacovigilance', label: 'Pharmacovigilance & Drug Safety (ICSR, MedDRA, Argus)', options: comfort, hint: 'Adverse event triage, narrative writing, causality assessment' },
        { id: 'clinical_trials', label: 'Clinical Research & Data Management (GCP, CDM, eCRF)', options: comfort, hint: 'Protocol adherence, discrepancy management, audit trails' },
        { id: 'regulatory_submissions', label: 'Regulatory Affairs Dossiers (US FDA, CDSCO, eCTD Module 1-5)', options: comfort, hint: 'ANDAs, CTD dossiers, query responses, pharmacopoeia specs' },
        { id: 'gmp_quality', label: 'cGMP Manufacturing, Sterile QA & QC Lab Protocols', options: comfort, hint: 'SOP compliance, OOS/OOT investigations, HPLC testing' },
        { id: 'detail', label: 'Data Integrity & Regulatory Protocol Compliance', options: comfort, hint: 'Strict 21 CFR Part 11 adherence and error-free clinical records' }
      ];

    case 'education':
      return [
        { id: 'pedagogical_design', label: 'Pedagogical Frameworks & Lesson Planning (NEP 2020 / Bloom’s)', options: comfort, hint: 'Outcome-based learning objectives, rubrics, and differentiated instruction' },
        { id: 'classroom_management', label: 'Classroom Engagement & Active Inquiry Methods', options: comfort, hint: 'Fostering student participation, conflict resolution, group dynamics' },
        { id: 'edtech_lms', label: 'EdTech Tools & LMS Platforms (Canvas, Moodle, Google Classroom)', options: comfort, hint: 'Interactive quizzes, digital assessments, e-learning authoring' },
        { id: 'student_evaluation', label: 'Competency-Based Student Assessment & Rubrics', options: comfort, hint: 'Formative assessments, diagnostic feedback, analytics' },
        { id: 'communication', label: 'Empathetic Student Mentoring & Parent Communication', options: comfort, hint: 'Parent-teacher conferences, student counseling, career guidance' },
        { id: 'creative', label: 'Creative Learning Material Design & Visual Storytelling', options: comfort, hint: 'Worksheets, infographics, gamified modules, and audio-visual aids' }
      ];

    case 'core_engineering':
      return [
        { id: 'plc_scada', label: 'PLC Programming & SCADA Telemetry (Siemens / Rockwell)', options: comfort, hint: 'Ladder logic, functional block diagrams, HMI screens, VFD drives' },
        { id: 'schematics_circuits', label: 'Electrical / Mechanical Schematics & Wiring Diagrams', options: comfort, hint: 'Single-line diagrams, sensor loop checks, instrumentation' },
        { id: 'industrial_robotics', label: 'Industrial Robotics & Automation Kinematics (ROS2 / ABB / KUKA)', options: comfort, hint: 'Robotic arm programming, pick-and-place, servo motors' },
        { id: 'preventive_maintenance', label: 'Root Cause Analysis & Preventive Maintenance (TPM / Six Sigma)', options: comfort, hint: 'Troubleshooting downtime, vibration analysis, 5S standards' },
        { id: 'cad_design', label: 'CAD 3D Modeling & Mechanical Drafting (SolidWorks / AutoCAD)', options: comfort, hint: 'Part modeling, tolerances (GD&T), manufacturing drawings' },
        { id: 'detail', label: 'Industrial Safety Standards & Precision Compliance', options: comfort, hint: 'OSHA protocols, Lockout-Tagout (LOTO), ISO 9001/14001' }
      ];

    case 'design_media':
      return [
        { id: 'ui_ux_design', label: 'UI/UX & Product Design Systems (Figma)', options: comfort, hint: 'Auto-layout, design tokens, responsive components, usability testing' },
        { id: 'video_motion', label: 'Video Editing & Motion Graphics (Premiere / DaVinci / After Effects)', options: comfort, hint: 'Pacing, sound design, color grading, social media reels' },
        { id: 'visual_storytelling', label: 'Visual Hierarchy, Typography & Layout Composition', options: comfort, hint: 'Brand identity, marketing collateral, grid systems' },
        { id: '3d_spatial', label: '3D Spatial Modeling & Real-Time Rendering (Blender / UE5)', options: comfort, hint: 'Mesh topology, texturing, lighting, asset optimization' },
        { id: 'creative', label: 'Creative Conceptualization & Visual Problem Solving', options: comfort, hint: 'Moodboards, wireframing, creative briefs, brand guidelines' },
        { id: 'communication', label: 'Design Rationale Presentation & Stakeholder Buy-In', options: comfort, hint: 'Pitching creative concepts and collaborating with engineers/marketers' }
      ];

    case 'technology':
      return [
        { id: 'coding', label: 'Application Programming & Data Structures (JS / Python / Java)', options: comfort, hint: 'Building scalable logic, handling async tasks, writing clean modular code' },
        { id: 'ai_engineering', label: 'AI Agents, LLMs & Prompt Architecture (LangGraph / RAG)', options: comfort, hint: 'Vector embeddings, model evaluation, MCP tools, fine-tuning' },
        { id: 'database_sql', label: 'Database Architecture & Querying (SQL / PostgreSQL / NoSQL)', options: comfort, hint: 'Complex joins, indexing, data modeling, ETL queries' },
        { id: 'cloud_devops', label: 'Cloud Infrastructure & DevOps (AWS / Docker / Kubernetes)', options: comfort, hint: 'Container orchestration, CI/CD pipelines, IaC Terraform' },
        { id: 'system_design', label: 'API Architecture & Distributed System Design', options: comfort, hint: 'REST/GraphQL, caching, message queues, microservices' },
        { id: 'detail', label: 'Code Quality, Testing & Automated Debugging', options: comfort, hint: 'Unit tests, telemetry logs, edge case handling, code reviews' }
      ];

    case 'general_business':
    default:
      return [
        { id: 'analysis', label: 'Structured Business Problem Solving & Analytical Thinking', options: comfort, hint: 'Breaking down complex challenges using data and logic' },
        { id: 'communication', label: 'Professional Stakeholder Communication & Persuasion', options: comfort, hint: 'Client pitches, executive summaries, cross-functional collaboration' },
        { id: 'excel_tools', label: 'Business Analytics & Spreadsheet Modeling (Excel / Sheets)', options: comfort, hint: 'Pivot tables, VLOOKUP/XLOOKUP, summary dashboards' },
        { id: 'digital_tools', label: 'Software Aptitude & Modern Digital Tool Adoption', options: comfort, hint: 'Quickly picking up new SaaS tools, CRMs, and productivity suites' },
        { id: 'detail', label: 'Process Execution & Operational Accuracy', options: comfort, hint: 'Ensuring deliverables meet deadlines without sloppy errors' },
        { id: 'creative', label: 'Creative Strategy & Commercial Growth Ideas', options: comfort, hint: 'Finding novel ways to attract customers, improve workflows, or grow' }
      ];
  }
}

// ---------------------------------------------------------------------------
// Step 3: Interests, Tools & Work Style (Adaptive per Domain)
// ---------------------------------------------------------------------------
export function getInterestQuestions(userDomain: UserDomainType): Question[] {
  const toolOptionsMap: Record<UserDomainType, string[]> = {
    law_legal: [
      'None yet / Starting fresh',
      'Legal Databases (SCC Online / Manupatra / Westlaw)',
      'MS Word / Contract Automation & Redlining Tools',
      'MCA21 / Trademark & Patent Registry Portals',
      'Data Privacy & Compliance Checklists',
      'Case Management / E-Filing Portals'
    ],
    finance_ca: [
      'None yet / Starting fresh',
      'TallyPrime / Busy Accounting',
      'Advanced Excel (XLOOKUP, Power Query, Financial Models)',
      'SAP S/4HANA FICO / Oracle ERP',
      'Income Tax & GST Government Filing Portals',
      'Power BI / Tableau Financial Dashboards'
    ],
    pharma_health: [
      'None yet / Starting fresh',
      'Argus Safety / ArisGlobal Safety Database',
      'Medidata Rave / Oracle Clinical / Electronic Data Capture (eCRF)',
      'eCTD Dossier Publishing Tools',
      'Hospital HIS / Pharmacy Dispensing Software',
      'Laboratory Analytical Tools (HPLC, UV Spectrophotometry)'
    ],
    education: [
      'None yet / Starting fresh',
      'Google Classroom / Canvas / Moodle LMS',
      'Interactive Whiteboards & Presentation Suites (Canva / PPT)',
      'Articulate Storyline 360 / Instructional Authoring',
      'Student Analytics & Automated Gradebooks',
      'Kahoot / Mentimeter / Live Poll Systems'
    ],
    core_engineering: [
      'None yet / Starting fresh',
      'Siemens TIA Portal / Rockwell RSLogix (PLC)',
      'SCADA Systems (Wonderware / Ignition)',
      'AutoCAD / SolidWorks / CATIA (CAD/CAM)',
      'Industrial Robotics Simulators (ROS2 / RoboDK)',
      'Multimeters, Oscilloscopes & Calibration Kits'
    ],
    design_media: [
      'None yet / Starting fresh',
      'Figma / FigJam / Adobe XD',
      'Adobe Premiere Pro / DaVinci Resolve',
      'Blender / Unreal Engine 5',
      'Adobe After Effects / Motion Graphics',
      'Canva / Illustrator / Photoshop'
    ],
    technology: [
      'None yet / Starting fresh',
      'VS Code / Git / GitHub',
      'SQL / PostgreSQL / MongoDB',
      'Python / JavaScript / TypeScript Frameworks',
      'Docker / Kubernetes / Cloud Terminals (AWS/GCP)',
      'LangChain / LangGraph / AI Prompt Testing Workbenches'
    ],
    general_business: [
      'None yet / Starting fresh',
      'Excel / Google Sheets',
      'CRM Systems (Salesforce / HubSpot / Zoho)',
      'Project Management Tools (Jira / Notion / Asana)',
      'No-Code Tools (Airtable / Make / Webflow)',
      'Data Dashboards (Power BI / Looker Studio)'
    ]
  };

  return [
    {
      id: 'interest',
      label: 'Which domain or work challenge excites you most?',
      options: [
        'Corporate Law, Contracts & Regulatory Compliance',
        'Financial Auditing, Taxation, FP&A & Valuation',
        'Clinical Research, Pharmacovigilance & Hospital Pharmacy',
        'Teaching, Pedagogy, EdTech & Educational Leadership',
        'Industrial Automation, Robotics & Smart Manufacturing',
        'AI Engineering, Autonomous Agents & Machine Learning',
        'Full-Stack Software, Web Apps & Cloud Infrastructure',
        'Data Analytics, BI Dashboards & Business Insights',
        'Product Management, RevOps & Business Growth',
        'UI/UX Product Design, 3D Spatial & Motion Media'
      ]
    },
    {
      id: 'style',
      label: 'Preferred daily work style',
      options: [
        'Deep independent analytical focus (Solo deep work)',
        'Balanced mix of solo work and collaborative team brainstorms',
        'High-touch client, student, patient or stakeholder advisory'
      ]
    },
    {
      id: 'structure',
      label: 'How much procedural structure do you prefer?',
      options: [
        'Highly structured workflows with clear compliance/standard operating procedures (SOPs)',
        'Balanced framework with guidelines and room for personal problem-solving',
        'Fast-paced, creative, or open-ended challenges with high autonomy'
      ]
    },
    {
      id: 'tools',
      label: 'Your strongest existing tool stack',
      options: toolOptionsMap[userDomain] || toolOptionsMap.general_business
    },
    {
      id: 'english',
      label: 'Professional English & formal communication comfort',
      options: comfort,
      hint: 'Crucial for client-facing legal memos, international regulatory dossiers, or enterprise meetings.'
    },
    {
      id: 'portfolio',
      label: 'Current evidence of your practical skills',
      options: [
        'Starting completely from scratch',
        'Academic coursework & theoretical concepts only',
        'One structured case study / personal project completed',
        'Multiple real-world projects / professional work experience'
      ]
    }
  ];
}

// ---------------------------------------------------------------------------
// Step 4: Destination & Work Preferences
// ---------------------------------------------------------------------------
export const baseDestinationQuestions: Question[] = [
  {
    id: 'target',
    label: 'Target annual compensation goal (CTC)',
    options: [
      '₹4.0L – ₹6.0L / year (Solid Entry / Step-Up)',
      '₹6.0L – ₹12.0L / year (Mid-Level High Growth)',
      '₹12.0L – ₹20.0L / year (Senior / GCC Advisory)',
      '₹20.0L+ / year (Executive / Frontier Specialist)'
    ]
  },
  {
    id: 'goal',
    label: 'Your #1 career priority right now',
    options: [
      'Fastest transition into a stable, accredited role',
      'Maximum long-term earning ceiling & compounding',
      'High-prestige corporate, hospital, or law advisory path',
      'Independent practice, consulting, or global freelance flexibility',
      'Work-life balance and structured predictable hours'
    ]
  },
  {
    id: 'work',
    label: 'Preferred workplace environment',
    options: [
      'In-Person / Office / Hospital / Factory Floor / School Campus',
      'Hybrid (2–3 days in office / campus)',
      '100% Remote / Work from Anywhere',
      'Flexible / Open to any viable format'
    ]
  },
  {
    id: 'relocate',
    label: 'Willingness to relocate to major Indian career hubs?',
    options: [
      'Yes, open to major hubs (Bengaluru, Mumbai, NCR, Hyderabad, Pune, Ahmedabad)',
      'Within my current state / region only',
      'No, strictly local / home city only'
    ]
  },
  {
    id: 'employment',
    label: 'Preferred employment model',
    options: [
      'Full-time salaried corporate / institutional employment',
      'Independent practice / Consulting / Contract / Freelance',
      'Either model is fine'
    ]
  },
  {
    id: 'risk',
    label: 'Comfort with income variability',
    options: [
      'Need complete salary predictability (Fixed monthly pay)',
      'Moderate flexibility (Base salary + performance bonus / retainers)',
      'Comfortable with performance-driven upside (Consulting / Incentives)'
    ]
  }
];

// ---------------------------------------------------------------------------
// Step 5: Pragmatic Learning Plan & Constraints
// ---------------------------------------------------------------------------
export const baseLearningQuestions: Question[] = [
  {
    id: 'hours',
    label: 'Realistic study time you can commit each week',
    options: [
      '5 hours / week (Light weekend pace)',
      '10 hours / week (Consistent 1.5 hrs/day)',
      '20 hours / week (Dedicated upskilling)',
      '30+ hours / week (Full-time intensive study)'
    ]
  },
  {
    id: 'deadline',
    label: 'When do you aim to complete this transition?',
    options: [
      '3 months (Fast-track transition)',
      '6 months (Balanced, deep preparation)',
      '12 months (Comprehensive career transformation)'
    ]
  },
  {
    id: 'budget',
    label: 'Upskilling & certification investment budget',
    options: [
      'Free open-source & self-study documentation only',
      'Under ₹15,000 (Targeted courses & exam fees)',
      'Can invest in accredited professional certifications / bootcamps'
    ]
  },
  {
    id: 'device',
    label: 'Primary computer & hardware access',
    options: [
      'Own personal laptop / desktop workstation',
      'Shared family computer / office PC',
      'Smartphone / Tablet only'
    ]
  },
  {
    id: 'learning',
    label: 'How do you absorb complex skills best?',
    options: [
      'Hands-on case studies & building real portfolio projects',
      'Structured sequential courses with step-by-step milestones',
      'Community cohort learning with 1-on-1 mentorship'
    ]
  },
  {
    id: 'shifts',
    label: 'Daily work schedule flexibility',
    options: [
      'Standard daytime hours only (9 AM – 6 PM)',
      'Flexible hours (Outcome-based deliverables)',
      'Open to hospital shifts, on-call rotations, or global timezones'
    ]
  }
];

// ---------------------------------------------------------------------------
// Dynamic Step Builder
// ---------------------------------------------------------------------------
export function getCompassSteps(answers: Answers) {
  const userDomain = resolveUserDomain(answers);
  const domainTitleMap: Record<UserDomainType, string> = {
    law_legal: 'Legal & Regulatory Strengths',
    finance_ca: 'Accounting, Tax & Financial Strengths',
    pharma_health: 'Clinical & Healthcare Competencies',
    education: 'Pedagogical & Instructional Strengths',
    core_engineering: 'Automation & Core Engineering Strengths',
    technology: 'Software & Technology Strengths',
    design_media: 'Creative & Product Design Strengths',
    general_business: 'Core Professional & Analytical Strengths'
  };

  return [
    {
      title: 'Your Starting Point',
      description: 'Every educational background has specific high-leverage advantages. Let’s map yours.',
      questions: baseStartingQuestions
    },
    {
      title: domainTitleMap[userDomain] || 'Your Domain Strengths',
      description: `Targeted evaluation tailored specifically for your ${userDomain.replace('_', ' ')} background. Answer honestly for where you are today.`,
      questions: getStrengthQuestions(userDomain)
    },
    {
      title: 'What Draws You In',
      description: 'Discover specialized career tracks that match your intellectual curiosities and preferred tools.',
      questions: getInterestQuestions(userDomain)
    },
    {
      title: 'Your Career Destination',
      description: 'Define what a rewarding, sustainable career leap looks like in terms of compensation and lifestyle.',
      questions: baseDestinationQuestions
    },
    {
      title: 'Make It Achievable',
      description: 'A realistic transition roadmap that respects your available hours, timeline, and hardware.',
      questions: baseLearningQuestions
    }
  ];
}

// Fallback static steps for initialization
export const compassSteps = getCompassSteps({});

// ---------------------------------------------------------------------------
// Comprehensive Track Registry (All 10 Domains Supported)
// ---------------------------------------------------------------------------
export type Strength = 
  | 'coding' 
  | 'maths' 
  | 'communication' 
  | 'creative' 
  | 'analysis' 
  | 'detail' 
  | 'english'
  | 'legal_drafting'
  | 'statutory_research'
  | 'litigation_advocacy'
  | 'corporate_compliance'
  | 'client_advisory'
  | 'statutory_audit'
  | 'taxation_gst'
  | 'financial_modeling'
  | 'erp_accounting'
  | 'cost_analysis'
  | 'pharmacology'
  | 'pharmacovigilance'
  | 'clinical_trials'
  | 'regulatory_submissions'
  | 'gmp_quality'
  | 'pedagogical_design'
  | 'classroom_management'
  | 'edtech_lms'
  | 'student_evaluation'
  | 'plc_scada'
  | 'schematics_circuits'
  | 'industrial_robotics'
  | 'preventive_maintenance'
  | 'cad_design'
  | 'ui_ux_design'
  | 'video_motion'
  | 'visual_storytelling'
  | '3d_spatial'
  | 'ai_engineering'
  | 'database_sql'
  | 'cloud_devops'
  | 'system_design'
  | 'excel_tools'
  | 'digital_tools';

export type Track = {
  title: string;
  slug: string;
  domain: string;
  domainType: UserDomainType;
  interest: string;
  tools: string;
  educationMatch: string[];
  strengths: Partial<Record<Strength, number>>;
  hours: number;
  salary: [number, number];
  skills: string[];
  projects: string[];
  remote: boolean;
  freelance: boolean;
  people: boolean;
  structured: boolean;
  stretch: string;
  stretchSlug: string;
};

export const compassTracks: Track[] = [
  // 1. Finance, CA & Accounts
  {
    title: 'Chartered Accountancy & Statutory Audit',
    slug: 'corporate-tax-planning',
    domain: 'Chartered Accountancy / Taxation / Finance',
    domainType: 'finance_ca',
    interest: 'Financial Auditing, Taxation, FP&A & Valuation',
    tools: 'TallyPrime / Busy Accounting',
    educationMatch: ['CA / CS / CMA (Chartered Accountant / Finance Pro)', 'B.Com / BBA / M.Com (Commerce & Finance)', 'MBA / Post-Graduate Management'],
    strengths: { statutory_audit: 4, taxation_gst: 4, erp_accounting: 3, detail: 4, analysis: 4, english: 3 },
    hours: 220,
    salary: [7.5, 16.0],
    skills: ['Ind AS / IFRS Standards', 'Statutory Auditing & CARO 2020', 'Tax Audit u/s 44AB', 'Internal Financial Controls', 'TallyPrime & SAP FICO'],
    projects: ['Perform a mock statutory audit on a manufacturing firm’s balance sheet', 'Draft an Internal Audit report identifying 5 operational control deficiencies'],
    remote: false,
    freelance: true,
    people: true,
    structured: true,
    stretch: 'M&A Due Diligence & Deal Structuring',
    stretchSlug: 'corporate-law'
  },
  {
    title: 'Financial Modeling & Valuation (FP&A)',
    slug: 'financial-modeling-valuation',
    domain: 'Chartered Accountancy / Taxation / Finance',
    domainType: 'finance_ca',
    interest: 'Financial Auditing, Taxation, FP&A & Valuation',
    tools: 'Advanced Excel (XLOOKUP, Power Query, Financial Models)',
    educationMatch: ['CA / CS / CMA (Chartered Accountant / Finance Pro)', 'B.Com / BBA / M.Com (Commerce & Finance)', 'MBA / Post-Graduate Management'],
    strengths: { financial_modeling: 4, cost_analysis: 4, analysis: 4, detail: 4, english: 3 },
    hours: 240,
    salary: [6.5, 14.0],
    skills: ['3-Statement Financial Modeling', 'Discounted Cash Flow (DCF)', 'Comparable Company Analysis (CCA)', 'WACC Calculation', 'Scenario & Sensitivity Analysis'],
    projects: ['Build a dynamic 5-year forecast model for a listed SaaS company', 'Perform a DCF valuation and sensitivity matrix for an FMCG acquisition'],
    remote: true,
    freelance: true,
    people: false,
    structured: true,
    stretch: 'Investment Banking & Equity Research',
    stretchSlug: 'financial-modeling-valuation'
  },
  {
    title: 'GST Practitioner & TallyPrime Accounting',
    slug: 'gst-accounting-tally-prime',
    domain: 'Chartered Accountancy / Taxation / Finance',
    domainType: 'finance_ca',
    interest: 'Financial Auditing, Taxation, FP&A & Valuation',
    tools: 'TallyPrime / Busy Accounting',
    educationMatch: ['B.Com / BBA / M.Com (Commerce & Finance)', '12th Standard / Non-Graduate', 'CA / CS / CMA (Chartered Accountant / Finance Pro)'],
    strengths: { taxation_gst: 3, erp_accounting: 4, detail: 4, analysis: 3, english: 2 },
    hours: 140,
    salary: [3.0, 5.5],
    skills: ['GSTR-1 & GSTR-3B Filings', 'ITC Reconciliation (2B vs Books)', 'E-Way Bills & E-Invoicing', 'TallyPrime Voucher Accounting', 'TDS & TCS Deductions'],
    projects: ['Reconcile 200 purchase invoices against GSTR-2B and identify ineligible ITC', 'Set up multi-state GST inventory ledgers in TallyPrime with automated tax splitting'],
    remote: false,
    freelance: true,
    people: false,
    structured: true,
    stretch: 'Corporate Tax Planning & Litigations',
    stretchSlug: 'corporate-tax-planning'
  },

  // 2. Law & Corporate Governance
  {
    title: 'Corporate Law, M&A & Due Diligence',
    slug: 'corporate-law',
    domain: 'Law / Legal & Compliance',
    domainType: 'law_legal',
    interest: 'Corporate Law, Contracts & Regulatory Compliance',
    tools: 'Legal Databases (SCC Online / Manupatra / Westlaw)',
    educationMatch: ['LL.B / LL.M (Law Graduate / Advocate)', 'CA / CS / CMA (Chartered Accountant / Finance Pro)'],
    strengths: { legal_drafting: 4, statutory_research: 4, corporate_compliance: 4, client_advisory: 4, detail: 5, english: 4 },
    hours: 260,
    salary: [6.5, 15.0],
    skills: ['Companies Act 2013 Compliance', 'Shareholders & Share Purchase Agreements (SHA/SPA)', 'Legal Due Diligence Audit', 'SEBI LODR Guidelines', 'Secretarial Standards'],
    projects: ['Draft an acquisition term sheet with anti-dilution and indemnity caps', 'Prepare a comprehensive 50-page legal due diligence checklist for an unlisted target'],
    remote: true,
    freelance: true,
    people: true,
    structured: true,
    stretch: 'International Arbitration & Cross-Border Deals',
    stretchSlug: 'corporate-law'
  },
  {
    title: 'Intellectual Property & Patent Law',
    slug: 'intellectual-property-law',
    domain: 'Law / Legal & Compliance',
    domainType: 'law_legal',
    interest: 'Corporate Law, Contracts & Regulatory Compliance',
    tools: 'MCA21 / Trademark & Patent Registry Portals',
    educationMatch: ['LL.B / LL.M (Law Graduate / Advocate)', 'B.Tech / B.E / BCA / MCA (Computer Science & IT)', 'B.Pharm / M.Pharm / Pharma.D / Life Sciences'],
    strengths: { statutory_research: 4, legal_drafting: 4, detail: 5, analysis: 4, english: 4 },
    hours: 240,
    salary: [6.0, 14.0],
    skills: ['Patent Claim Drafting (Form 1/2)', 'Freedom-to-Operate (FTO) Searches', 'Trademark Prosecution (TM-A)', 'Section 3 Patentability Exceptions', 'IP Licensing Agreements'],
    projects: ['Conduct a prior art novelty search on Google Patents and draft 10 independent claims', 'Draft a trademark infringement cease-and-desist notice and opposition response'],
    remote: true,
    freelance: true,
    people: false,
    structured: true,
    stretch: 'Patent Agent Certification (Indian Patent Office)',
    stretchSlug: 'intellectual-property-law'
  },
  {
    title: 'Contract Drafting & Commercial Advisory',
    slug: 'contract-drafting',
    domain: 'Law / Legal & Compliance',
    domainType: 'law_legal',
    interest: 'Corporate Law, Contracts & Regulatory Compliance',
    tools: 'MS Word / Contract Automation & Redlining Tools',
    educationMatch: ['LL.B / LL.M (Law Graduate / Advocate)', 'BA / MA / Humanities & Social Sciences', 'B.Com / BBA / M.Com (Commerce & Finance)'],
    strengths: { legal_drafting: 5, detail: 5, client_advisory: 3, statutory_research: 3, english: 4 },
    hours: 180,
    salary: [5.0, 11.0],
    skills: ['Master Services Agreements (MSAs)', 'Statements of Work (SOWs)', 'Indemnification & Limitation of Liability', 'IP Assignment Clauses', 'Dispute Resolution Clauses'],
    projects: ['Draft an end-to-end B2B SaaS Master Services Agreement with SLA breach remedies', 'Review and redline a vendor contract to negotiate favorable payment and termination terms'],
    remote: true,
    freelance: true,
    people: false,
    structured: true,
    stretch: 'Global Legal Operations (CLMOps)',
    stretchSlug: 'contract-drafting'
  },

  // 3. Pharmacy, Healthcare & Life Sciences
  {
    title: 'Clinical Pharmacy & Hospital Practice',
    slug: 'clinical-pharmacy',
    domain: 'Pharmacy / Healthcare / Clinical',
    domainType: 'pharma_health',
    interest: 'Clinical Research, Pharmacovigilance & Hospital Pharmacy',
    tools: 'Hospital HIS / Pharmacy Dispensing Software',
    educationMatch: ['B.Pharm / M.Pharm / Pharma.D / Life Sciences', 'MBBS / BDS / Nursing / Allied Health'],
    strengths: { pharmacology: 5, client_advisory: 4, detail: 4, analysis: 4, english: 3 },
    hours: 220,
    salary: [4.2, 9.0],
    skills: ['Therapeutic Drug Monitoring (TDM)', 'ICU Ward Rounds', 'Adverse Drug Reaction (ADR) Reporting', 'Antibiotic Stewardship', 'Patient Discharge Counseling'],
    projects: ['Audit 50 patient charts in an ICU ward for drug-drug interactions and dosage adjustments', 'Create an evidence-based institutional antibiotic stewardship guidelines protocol'],
    remote: false,
    freelance: false,
    people: true,
    structured: true,
    stretch: 'Clinical Research Director (CRO)',
    stretchSlug: 'clinical-research'
  },
  {
    title: 'Pharmacovigilance & Drug Safety',
    slug: 'pharmacovigilance',
    domain: 'Pharmacy / Healthcare / Clinical',
    domainType: 'pharma_health',
    interest: 'Clinical Research, Pharmacovigilance & Hospital Pharmacy',
    tools: 'Argus Safety / ArisGlobal Safety Database',
    educationMatch: ['B.Pharm / M.Pharm / Pharma.D / Life Sciences', 'MBBS / BDS / Nursing / Allied Health', 'B.Sc / M.Sc (Pure Sciences / Statistics / Math)'],
    strengths: { pharmacovigilance: 5, pharmacology: 4, detail: 5, analysis: 4, english: 4 },
    hours: 200,
    salary: [4.5, 10.0],
    skills: ['Individual Case Safety Reports (ICSR)', 'MedDRA Coding (PT/LLT/SOC)', 'Argus Safety Workflows', 'Narrative Writing & Causality Assessment', 'Periodic Safety Update Reports (PSUR/PBRER)'],
    projects: ['Process and narrative-draft 10 complex clinical trial adverse event safety cases in MedDRA', 'Perform a signal detection causality assessment on a post-marketing drug event dataset'],
    remote: true,
    freelance: true,
    people: false,
    structured: true,
    stretch: 'Regulatory Affairs & Pharmacovigilance Lead',
    stretchSlug: 'regulatory-affairs'
  },
  {
    title: 'Clinical Research & Data Management (CDM)',
    slug: 'clinical-research',
    domain: 'Pharmacy / Healthcare / Clinical',
    domainType: 'pharma_health',
    interest: 'Clinical Research, Pharmacovigilance & Hospital Pharmacy',
    tools: 'Medidata Rave / Oracle Clinical / Electronic Data Capture (eCRF)',
    educationMatch: ['B.Pharm / M.Pharm / Pharma.D / Life Sciences', 'MBBS / BDS / Nursing / Allied Health', 'B.Sc / M.Sc (Pure Sciences / Statistics / Math)'],
    strengths: { clinical_trials: 5, detail: 5, analysis: 4, english: 3 },
    hours: 210,
    salary: [4.5, 9.5],
    skills: ['ICH-GCP Guidelines', 'Electronic Data Capture (EDC / Medidata Rave)', 'Data Management Plan (DMP)', 'Discrepancy / Query Management', 'Database Lock & CDISC SDTM Standards'],
    projects: ['Design an annotated Case Report Form (eCRF) for a Phase III oncology trial', 'Execute a data validation query check specification for 100 patient subject records'],
    remote: true,
    freelance: false,
    people: false,
    structured: true,
    stretch: 'Biostatistics & CDISC SAS Programmer',
    stretchSlug: 'clinical-research'
  },

  // 4. Education & Pedagogy
  {
    title: 'Teaching & Experiential Pedagogy (NEP 2020)',
    slug: 'teaching-pedagogy',
    domain: 'Education / Teaching / EdTech',
    domainType: 'education',
    interest: 'Teaching, Pedagogy, EdTech & Educational Leadership',
    tools: 'Google Classroom / Canvas / Moodle LMS',
    educationMatch: ['B.Ed / M.Ed / Teaching Credential', 'BA / MA / Humanities & Social Sciences', 'B.Sc / M.Sc (Pure Sciences / Statistics / Math)'],
    strengths: { pedagogical_design: 4, classroom_management: 5, communication: 5, student_evaluation: 4, creative: 3, english: 3 },
    hours: 160,
    salary: [3.8, 8.0],
    skills: ['Inquiry-Based Learning Architecture', 'Bloom’s Taxonomy Cognitive Mapping', 'NEP 2020 Experiential Unit Design', 'Differentiated Classroom Instruction', 'Formative Assessment Rubrics'],
    projects: ['Design a 4-week experiential science unit plan with active inquiry lab triggers', 'Develop a comprehensive student portfolio evaluation rubric with self-reflection prompts'],
    remote: false,
    freelance: true,
    people: true,
    structured: true,
    stretch: 'Educational Leadership & School Principalship',
    stretchSlug: 'educational-leadership'
  },
  {
    title: 'Instructional Design & E-Learning (ADDIE)',
    slug: 'instructional-design',
    domain: 'Education / Teaching / EdTech',
    domainType: 'education',
    interest: 'Teaching, Pedagogy, EdTech & Educational Leadership',
    tools: 'Articulate Storyline 360 / Instructional Authoring',
    educationMatch: ['B.Ed / M.Ed / Teaching Credential', 'BA / MA / Humanities & Social Sciences', 'B.Tech / B.E / BCA / MCA (Computer Science & IT)'],
    strengths: { pedagogical_design: 5, edtech_lms: 4, creative: 4, communication: 4, english: 4 },
    hours: 200,
    salary: [5.0, 12.0],
    skills: ['ADDIE & SAM Instructional Models', 'Storyline 360 & Rise Interactive Modules', 'Storyboard Writing for E-Learning', 'SCORM / xAPI Integration', 'Microlearning & Gamification'],
    projects: ['Write a 15-screen interactive branching scenario storyboard for corporate compliance', 'Develop and publish an accessible Storyline 360 e-learning module with quiz knowledge checks'],
    remote: true,
    freelance: true,
    people: false,
    structured: false,
    stretch: 'Learning Experience Platform (LXP) Architect',
    stretchSlug: 'instructional-design'
  },

  // 5. Industrial Automation & Core Engineering
  {
    title: 'PLC, SCADA & Industrial Automation',
    slug: 'industrial-automation-plc-scada',
    domain: 'Core Engineering / Manufacturing / Automation',
    domainType: 'core_engineering',
    interest: 'Industrial Automation, Robotics & Smart Manufacturing',
    tools: 'Siemens TIA Portal / Rockwell RSLogix (PLC)',
    educationMatch: ['B.Tech / Diploma (Mechanical / Electrical / Core Eng)', 'Diploma / ITI (Technical Trades)'],
    strengths: { plc_scada: 5, schematics_circuits: 4, preventive_maintenance: 4, detail: 4 },
    hours: 250,
    salary: [4.0, 8.5],
    skills: ['Ladder Logic & Function Block (FBD)', 'Siemens TIA Portal & S7-1200/1500', 'SCADA & HMI Screen Development', 'VFD Variable Frequency Drives', 'Industrial Modbus & Profinet Protocols'],
    projects: ['Program an automated sorting conveyor system logic in Siemens TIA Portal', 'Build an interactive SCADA mimic screen with real-time temperature telemetry & alarms'],
    remote: false,
    freelance: false,
    people: false,
    structured: true,
    stretch: 'Industrial IoT & Smart Factory Architect',
    stretchSlug: 'industrial-automation-plc-scada'
  },
  {
    title: 'EV Battery Powertrain & BMS Engineering',
    slug: 'ev-battery-tech',
    domain: 'Core Engineering / Manufacturing / Automation',
    domainType: 'core_engineering',
    interest: 'Industrial Automation, Robotics & Smart Manufacturing',
    tools: 'AutoCAD / SolidWorks / CATIA (CAD/CAM)',
    educationMatch: ['B.Tech / Diploma (Mechanical / Electrical / Core Eng)', 'B.Sc / M.Sc (Pure Sciences / Statistics / Math)'],
    strengths: { schematics_circuits: 4, preventive_maintenance: 4, analysis: 4, detail: 4 },
    hours: 260,
    salary: [5.5, 12.0],
    skills: ['Lithium-ion Cell Chemistry (NMC/LFP)', 'Battery Management System (BMS) Architecture', 'Cell Balancing & Thermal Runaway Protection', 'CAN Bus Telemetry Diagnostics', 'CCS2 & Bharat EV DC Fast Charging Protocols'],
    projects: ['Model a 48V 100Ah battery pack with passive cell balancing circuits in MATLAB/Simulink', 'Simulate thermal dissipation and cooling airflow across a 200-cell EV battery enclosure'],
    remote: false,
    freelance: false,
    people: false,
    structured: true,
    stretch: 'Autonomous Vehicle AUTOSAR Embedded Systems',
    stretchSlug: 'ev-battery-tech'
  },

  // 6. Technology, AI & Data Frontier
  {
    title: 'AI Agents & LLM Application Engineering',
    slug: 'ai-agents-llm-apps',
    domain: 'Technology / Software / Data',
    domainType: 'technology',
    interest: 'AI Engineering, Autonomous Agents & Machine Learning',
    tools: 'LangChain / LangGraph / AI Prompt Testing Workbenches',
    educationMatch: ['B.Tech / B.E / BCA / MCA (Computer Science & IT)', 'B.Sc / M.Sc (Pure Sciences / Statistics / Math)', 'MBA / Post-Graduate Management'],
    strengths: { coding: 4, ai_engineering: 5, database_sql: 3, system_design: 4, analysis: 4, english: 3 },
    hours: 320,
    salary: [8.0, 20.0],
    skills: ['LangGraph Multi-Agent Orchestration', 'Anthropic Model Context Protocol (MCP)', 'RAG Pipelines with Hybrid Search', 'Vector Databases (Pinecone/Qdrant)', 'LLM Evaluation & Guardrails'],
    projects: ['Build an autonomous SQL agent with schema reflection and error self-correction', 'Deploy an enterprise document intelligence pipeline with structured RAG and citation verification'],
    remote: true,
    freelance: true,
    people: false,
    structured: false,
    stretch: 'AI Platform Architect & Agent Ops',
    stretchSlug: 'ai-agents-llm-apps'
  },
  {
    title: 'Data Analytics & Power BI Insights',
    slug: 'data-analytics',
    domain: 'Technology / Software / Data',
    domainType: 'technology',
    interest: 'Data Analytics, BI Dashboards & Business Insights',
    tools: 'SQL / PostgreSQL / MongoDB',
    educationMatch: ['B.Com / BBA / M.Com (Commerce & Finance)', 'B.Sc / M.Sc (Pure Sciences / Statistics / Math)', 'B.Tech / B.E / BCA / MCA (Computer Science & IT)', 'BA / MA / Humanities & Social Sciences'],
    strengths: { database_sql: 4, analysis: 4, excel_tools: 4, communication: 3, detail: 3 },
    hours: 200,
    salary: [4.0, 8.5],
    skills: ['Advanced SQL (Window Functions, CTEs)', 'Power BI & DAX Calculations', 'Data Cleaning & Transformation', 'Business Metrics & KPI Tree Mapping', 'Executive Data Storytelling'],
    projects: ['Clean a messy retail sales dataset and calculate customer lifetime value in SQL', 'Build an interactive 3-page Power BI executive dashboard tracking monthly MRR and churn'],
    remote: true,
    freelance: true,
    people: false,
    structured: true,
    stretch: 'Data Engineering & Modern Lakehouse (dbt / Snowflake)',
    stretchSlug: 'data-analytics'
  },
  {
    title: 'Full-Stack Web Development',
    slug: 'full-stack-web',
    domain: 'Technology / Software / Data',
    domainType: 'technology',
    interest: 'Full-Stack Software, Web Apps & Cloud Infrastructure',
    tools: 'Python / JavaScript / TypeScript Frameworks',
    educationMatch: ['B.Tech / B.E / BCA / MCA (Computer Science & IT)', 'B.Sc / M.Sc (Pure Sciences / Statistics / Math)', 'Diploma / ITI (Technical Trades)'],
    strengths: { coding: 4, system_design: 3, database_sql: 3, detail: 3, analysis: 3 },
    hours: 360,
    salary: [4.5, 10.0],
    skills: ['TypeScript & Next.js React', 'Node.js Backend & REST/GraphQL APIs', 'PostgreSQL Database & Prisma ORM', 'JWT / OAuth Authentication', 'Vercel / AWS Cloud Deployment'],
    projects: ['Build an e-commerce platform with stripe checkout, auth, and database persistence', 'Create a real-time collaborative task manager with WebSocket live synchronization'],
    remote: true,
    freelance: true,
    people: false,
    structured: false,
    stretch: 'Cloud Platform Engineering & Kubernetes',
    stretchSlug: 'full-stack-web'
  },
  {
    title: 'Salesforce Administration & Automation',
    slug: 'salesforce-administration',
    domain: 'Technology / Software / Data',
    domainType: 'technology',
    interest: 'Product Management, RevOps & Business Growth',
    tools: 'CRM Systems (Salesforce / HubSpot / Zoho)',
    educationMatch: ['B.Com / BBA / M.Com (Commerce & Finance)', 'BA / MA / Humanities & Social Sciences', 'B.Tech / B.E / BCA / MCA (Computer Science & IT)'],
    strengths: { digital_tools: 4, detail: 4, analysis: 3, communication: 3, english: 3 },
    hours: 200,
    salary: [4.5, 9.5],
    skills: ['Lightning App Builder', 'Salesforce Flow Automation (Record/Schedule)', 'Security Architecture & Permission Sets', 'Data Loader Import/Export', 'Custom Reports & Dashboards'],
    projects: ['Build an automated lead qualification and SLA escalation flow in Salesforce Flow Builder', 'Configure object relationships, validation rules, and role hierarchies for a 50-user sales org'],
    remote: true,
    freelance: true,
    people: false,
    structured: true,
    stretch: 'Salesforce Developer (Apex / LWC) & CPQ',
    stretchSlug: 'salesforce-administration'
  },

  // 7. Design, Creative & Media
  {
    title: 'UI/UX & Product Design Systems',
    slug: 'ui-ux-product-design',
    domain: 'Design / Creative Media / Content',
    domainType: 'design_media',
    interest: 'UI/UX Product Design, 3D Spatial & Motion Media',
    tools: 'Figma / FigJam / Adobe XD',
    educationMatch: ['B.Arch / Design / Fine Arts', 'BA / MA / Humanities & Social Sciences', 'B.Tech / B.E / BCA / MCA (Computer Science & IT)'],
    strengths: { ui_ux_design: 5, visual_storytelling: 4, creative: 4, communication: 3, detail: 4 },
    hours: 240,
    salary: [4.5, 11.0],
    skills: ['Figma Auto-Layout & Design Tokens', 'User Journey Mapping & Wireframing', 'Interactive Micro-Prototypes', 'Usability Testing & Feedback Synthesis', 'Mobile & Web Accessibility (WCAG)'],
    projects: ['Redesign a complex fintech loan application flow with a 30% reduction in cognitive load', 'Create a complete multi-theme design system component library with auto-layout in Figma'],
    remote: true,
    freelance: true,
    people: false,
    structured: false,
    stretch: 'UX Research & Design Strategy Lead',
    stretchSlug: 'ui-ux-product-design'
  },
  {
    title: 'YouTube Operations & Media Strategy',
    slug: 'youtube-ops',
    domain: 'Design / Creative Media / Content',
    domainType: 'design_media',
    interest: 'UI/UX Product Design, 3D Spatial & Motion Media',
    tools: 'Adobe Premiere Pro / DaVinci Resolve',
    educationMatch: ['BA / MA / Humanities & Social Sciences', 'B.Com / BBA / M.Com (Commerce & Finance)', '12th Standard / Non-Graduate'],
    strengths: { video_motion: 4, visual_storytelling: 4, creative: 4, communication: 4, analysis: 3 },
    hours: 160,
    salary: [3.5, 8.0],
    skills: ['CTR Packaging & Title/Thumbnail Psychology', 'Retention Curve Scripting & Story Beats', 'Video Editing Pacing & Sound Effects', 'YouTube Analytics & Audience Demographics', 'Sponsorship Pitch Decks & Media Kits'],
    projects: ['Audit a 50k subscriber channel and present 5 actionable changes to boost average view duration', 'Script, edit, and package a 5-minute high-retention educational video with custom thumbnails'],
    remote: true,
    freelance: true,
    people: true,
    structured: false,
    stretch: 'Media Brand Director & Creator Agency Lead',
    stretchSlug: 'youtube-ops'
  }
];

// ---------------------------------------------------------------------------
// Validation Helper
// ---------------------------------------------------------------------------
export const isAnswered = (q: Question, answers: Answers) => {
  const value = answers[q.id]?.trim();
  if (!value) return !!q.optional;
  if (q.options) return q.options.includes(value);
  if (q.type === 'number') return Number.isFinite(Number(value)) && Number(value) >= 0 && Number(value) <= 1000;
  return value.length >= 2 && value.length <= 100;
};

// ---------------------------------------------------------------------------
// Intelligent Adaptive Career Ranking Algorithm
// ---------------------------------------------------------------------------
export function rankCareers(a: Answers) {
  const dynamicSteps = getCompassSteps(a);
  const allActiveQuestions = dynamicSteps.flatMap(s => s.questions);
  const missing = allActiveQuestions.filter(q => !isAnswered(q, a));
  if (missing.length) {
    throw new Error(`Complete all required signals with valid answers. Missing: ${missing[0].label}`);
  }

  const userDomain = resolveUserDomain(a);
  const level = (id: string) => Math.max(0, comfort.indexOf(a[id] || ''));

  return compassTracks.map(track => {
    // 1. Strengths Fit & Competency Gap
    const trackStrengths = Object.entries(track.strengths) as [Strength, number][];
    const gaps: { key: string; gap: number }[] = [];
    let requiredPoints = 0;
    let satisfiedPoints = 0;

    trackStrengths.forEach(([key, need]) => {
      requiredPoints += need;
      const userLevel = level(key);
      if (userLevel < need) {
        gaps.push({ key, gap: need - userLevel });
        satisfiedPoints += userLevel;
      } else {
        satisfiedPoints += need;
      }
    });

    const ability = requiredPoints > 0 ? satisfiedPoints / requiredPoints : 0.7;

    // 2. Educational & Domain Synergy
    const eduMatch = track.educationMatch.some(e => e.toLowerCase() === (a.education || '').toLowerCase() || (a.education || '').toLowerCase().includes(e.toLowerCase().slice(0, 5)));
    const domainMatch = track.domainType === userDomain || track.domain === a.domain;
    const backgroundBonus = (eduMatch ? 0.4 : 0.1) + (domainMatch ? 0.5 : 0.1);

    // 3. Tool Stack Affinity
    const toolMatch = a.tools === track.tools || (a.tools && a.tools !== 'None yet / Starting fresh' && track.tools.includes(a.tools.split(' ')[0]));

    // 4. Learning Timeline Feasibility
    const portfolioIdx = ['Starting completely from scratch', 'Academic coursework & theoretical concepts only', 'One structured case study / personal project completed', 'Multiple real-world projects / professional work'].indexOf(a.portfolio || '') || 0;
    const experienceIdx = ['Fresher / College Student', 'Under 2 years', '2–5 years', '5–10 years', '10+ years'].indexOf(a.experience || '') || 0;
    
    const learningHours = Math.round(
      track.hours * (1.25 - ability * 0.3 - (toolMatch ? 0.12 : 0) - portfolioIdx * 0.04 - (domainMatch ? experienceIdx * 0.03 : 0))
    );

    const weekly = parseInt((a.hours || '10').replace(/[^0-9]/g, '')) || 10;
    const access = a.device?.includes('Shared') ? 0.8 : a.device?.includes('Smartphone') ? 0.5 : 1.0;
    const weeks = Math.max(4, Math.ceil(learningHours / (weekly * access)));
    const deadlineMonths = parseInt((a.deadline || '6').replace(/[^0-9]/g, '')) || 6;
    const deadlineWeeks = deadlineMonths * 4.33;
    const readiness = Math.min(1.0, deadlineWeeks / weeks);

    // 5. Interest & Work Style Alignment
    const interestFit = a.interest === track.interest ? 1.0 : (domainMatch ? 0.6 : 0.25);
    const workFit = a.work?.includes('100% Remote') && !track.remote ? 0.3 : 1.0;
    const employmentFit = a.employment?.includes('Independent practice') && !track.freelance ? 0.3 : 1.0;
    const styleFit = a.style?.includes('mix of solo') || (a.style?.includes('High-touch') === track.people) ? 1.0 : 0.6;
    const structureFit = a.structure?.includes('Balanced') || (a.structure?.includes('Highly structured') === track.structured) ? 1.0 : 0.6;

    // 6. Target Salary Feasibility
    const targetSalaryNum = Number((a.target || '6').match(/\d+(\.\d+)?/)?.[0] || '6');
    const salaryFit = Math.min(1.0, (track.salary[1] * 1.1) / targetSalaryNum);

    // 7. Multi-Dimensional Score Composition
    const dimensions = {
      'Domain & Background Fit': Math.min(100, Math.round(backgroundBonus * 100)),
      'Core Competencies': Math.min(100, Math.round(ability * 100)),
      'Interest Alignment': Math.min(100, Math.round(interestFit * 100)),
      'Work Style & Lifestyle': Math.min(100, Math.round(((styleFit + structureFit + workFit + employmentFit) / 4) * 100)),
      'Timeline Feasibility': Math.min(100, Math.round(readiness * 100)),
      'Compensation Ceiling': Math.min(100, Math.round(salaryFit * 100))
    };

    const score = Math.min(
      99,
      Math.max(
        35,
        Math.round(
          dimensions['Domain & Background Fit'] * 0.25 +
          dimensions['Core Competencies'] * 0.25 +
          dimensions['Interest Alignment'] * 0.20 +
          dimensions['Work Style & Lifestyle'] * 0.15 +
          dimensions['Timeline Feasibility'] * 0.15
        )
      )
    );

    // Tailored Personalized Rationale
    const reasons: string[] = [];
    if (eduMatch || domainMatch) {
      reasons.push(`Directly leverages your ${a.education || a.domain} foundation, accelerating your learning curve.`);
    }
    if (a.interest === track.interest) {
      reasons.push(`Perfect match for your focus on ${track.interest.toLowerCase()}.`);
    } else if (interestFit >= 0.5) {
      reasons.push(`High synergy with your career interests and functional domain.`);
    }
    if (ability >= 0.75) {
      reasons.push(`Your current competency ratings cover the core prerequisites for this path.`);
    } else {
      reasons.push(`A structured project portfolio will systematically bridge the identified skill gaps.`);
    }
    if (toolMatch) {
      reasons.push(`Your familiarity with ${a.tools} gives you a distinct practical head start.`);
    }

    // Honest Contextual Cautions
    const cautions: string[] = [];
    if (weeks > deadlineWeeks) {
      cautions.push(`Your target deadline of ${deadlineMonths} months is faster than the estimated ${weeks}-week preparation plan. Increase weekly hours to ${Math.ceil(learningHours / deadlineWeeks)} hrs/week.`);
    }
    if (a.device?.includes('Smartphone')) {
      cautions.push('A smartphone alone is insufficient for professional case studies and software tools. Secure regular access to a laptop or workstation.');
    }
    if (a.work?.includes('100% Remote') && !track.remote) {
      cautions.push('This profession primarily operates in-person or on-site (hospital, manufacturing plant, school, or court). Expect physical presence.');
    }
    if (targetSalaryNum > track.salary[1] * 1.2) {
      cautions.push(`Your target compensation (₹${targetSalaryNum}L) is above the typical starting band (₹${track.salary[0]}L–₹${track.salary[1]}L). Treat this as a 2–3 year growth milestone.`);
    }
    if (a.salary && Number(a.salary) > track.salary[1]) {
      cautions.push(`Your current compensation (₹${a.salary}L) is higher than the entry band. Highlight your transferable domain seniority to negotiate lateral pay.`);
    }

    const learningPlan = a.learning?.includes('case studies')
      ? 'Build real case study deliverables week-by-week and publish them to a public portfolio.'
      : a.learning?.includes('sequential courses')
      ? 'Complete a recognized curriculum track and validate each module with practical capstone submissions.'
      : 'Pair up with industry practitioners and arrange monthly project feedback reviews.';

    const budgetPlan = a.budget?.includes('Free')
      ? 'Rely on official documentation, open-source repositories, and trial tool tiers. Avoid unneeded paid bootcamps.'
      : a.budget?.includes('Under ₹15,000')
      ? 'Invest selectively in accredited certification exams or professional tool licenses.'
      : 'Prioritize accredited specialized credentials and mentorship cohorts.';

    const searchPlan = `${a.work || 'Hybrid'} ${a.employment?.includes('Independent') ? 'consulting & freelance' : 'full-time'} opportunities in ${a.location || 'your preferred city'}${a.relocate?.includes('Yes') ? ' and major national employment hubs' : ''}.`;

    return {
      ...track,
      score,
      dimensions,
      weeks,
      learningHours,
      gaps,
      reasons,
      cautions,
      learningPlan,
      budgetPlan,
      searchPlan
    };
  }).sort((a, b) => b.score - a.score || a.weeks - b.weeks);
}

export type CareerResult = ReturnType<typeof rankCareers>[number];
