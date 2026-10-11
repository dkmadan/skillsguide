import type { LearnerJourney } from './journeysData';

export const additionalLearnerJourneys: LearnerJourney[] = [
  {
    slug: 'non-cs-engineer-to-software-dev',
    title: 'Non-CS Engineer to Software Developer Pivot',
    subtitle: 'Transition from Mechanical, Civil, Chemical, or Electrical engineering into full-stack and backend roles',
    badge: 'Core Engineering Pivot',
    badgeColor: 'purple',
    heroSummary: 'Thousands of core branch engineering graduates in India face stagnant starting salaries or scarce campus placements in their core fields. Software engineering companies actively hire candidates from any engineering branch—provided they demonstrate production-ready programming, data structures, and deployed applications rather than just textbook syntax.',
    targetAudience: 'Graduates and professionals with Mechanical, Civil, Chemical, Electrical, or Instrumentation engineering backgrounds wanting to break into software development.',
    keyChallengesAddressed: [
      'Bridging missing CS fundamentals (operating systems, concurrency, networking, and memory models)',
      'Overcoming recruiter bias favoring CS/IT degree tags on resume screening algorithms',
      'Balancing algorithmic coding practice with building deployable full-stack web applications',
      'Reframing numerical modeling or CAD/CAM logic as transferable analytical problem-solving skills'
    ],
    recommendedTracks: [
      { title: 'Full-Stack Web Development', slug: 'full-stack-web', whyRecommended: 'Strongest hiring volume with visible proof of work through deployed full-stack web applications.', startingRole: 'Associate Software Engineer / Frontend Developer' },
      { title: 'Python & Automation Engineering', slug: 'python-automation', whyRecommended: 'Smooth transition for engineers already familiar with MATLAB or scripting, ideal for backend and data pipelines.', startingRole: 'Junior Python Developer' },
      { title: 'Cloud Computing & DevOps', slug: 'cloud-computing', whyRecommended: 'High demand for engineers who understand infrastructure, containerization, and automated deployments.', startingRole: 'Cloud Support Engineer' }
    ],
    prerequisiteBridge: [
      { area: 'Data Structures & Algorithms', startingGap: 'Familiarity with basic C loops from 1st-year college but no algorithmic problem-solving or complexity analysis.', bridgeAction: 'Solve 100 curated problems across arrays, two pointers, hashing, and trees using Python or JavaScript.', freeResource: 'NeetCode 150 & freeCodeCamp Data Structures in JavaScript' },
      { area: 'Git & Command Line Environments', startingGap: 'Used only GUI applications, Windows Explorer, and standard desktop engineering software.', bridgeAction: 'Set up Linux WSL2 or macOS terminal, configure Git SSH keys, and commit project updates daily to GitHub.', freeResource: 'The Missing Semester of Your CS Education (MIT OpenCourseWare)' }
    ],
    actionPlanSteps: [
      { stepNumber: 1, title: 'Master One Modern Language & Tooling', duration: 'Weeks 1–4', description: 'Deep-dive into modern JavaScript/TypeScript or Python. Master ES6+, asynchronous programming, HTTP APIs, and Git branching workflows.', deliverables: ['Command-line CLI tool published to npm or PyPI', 'Git repository with clean commit history and documentation'] },
      { stepNumber: 2, title: 'Build and Deploy Full-Stack Web Applications', duration: 'Weeks 5–10', description: 'Construct a full-stack CRUD application with relational database persistence (PostgreSQL), JWT authentication, and automated tests.', deliverables: ['Production app hosted on Vercel or Render with live PostgreSQL database', 'API documentation created using Swagger/Postman'] },
      { stepNumber: 3, title: 'DSA Sprints & Open-Source Contributions', duration: 'Weeks 11–16', description: 'Practice live coding under 30-minute constraints, resolve real GitHub issues on active repositories, and prepare system design basics.', deliverables: ['80+ LeetCode solved problems across core patterns', '1 merged pull request in an open-source project'] }
    ],
    portfolioAndProjectStrategy: {
      focus: 'Emphasize engineering rigor, data integrity, error handling, and clean code rather than trivial tutorial clones.',
      recommendedProject: 'Internal Inventory and Asset Tracker with multi-tenant authentication, role-based access control (RBAC), and automated PDF reporting.',
      howToStandOut: 'Write comprehensive end-to-end tests using Playwright/Vitest and include an interactive system architecture diagram in your GitHub README.'
    },
    resumeAndPositioningAdvice: {
      framingStrategy: 'Frame your core engineering degree as proof of quantitative stamina and systems thinking. Put technical projects and GitHub links in the top third of your resume.',
      sampleBullet: 'Engineered a full-stack inventory analytics platform (Next.js, FastAPI, PostgreSQL) supporting 5,000 SKU records with sub-120ms search latencies via Redis caching.',
      avoidMistake: 'Do not apologize for your non-CS branch in cover letters or interview introductions; focus 100% on what you have built and deployed.'
    },
    financialAndTransitionPlanning: {
      timeToFirstIncome: '4 to 6 Months of dedicated preparation.',
      hardwareRequirements: '8GB to 16GB RAM laptop running Windows 10/11 with WSL2, Ubuntu Linux, or macOS.',
      opportunityCostAdvice: 'Entry-level software engineer packages (₹4.5L–₹9.0L LPA) quickly outpace entry core-branch stagnation in India within 18 months.'
    }
  },
  {
    slug: 'pharma-lifesciences-to-clinical-data',
    title: 'Pharma & Life Sciences to Clinical Data Specialist',
    subtitle: 'Bridge B.Pharm, M.Pharm, B.Sc Biotech, and Life Sciences into Clinical Data Management (CDM) and Pharmacovigilance',
    badge: 'Healthcare & Life Sciences',
    badgeColor: 'teal',
    heroSummary: 'Graduates in Pharmacy and Life Sciences in India often start in low-paying medical store retail or hospital chemist jobs. Global pharmaceutical GCCs, CROs (Clinical Research Organizations like IQVIA, Syneos, Parexel), and IT healthcare units (Cognizant, TCS Life Sciences) actively recruit life science graduates who learn Clinical Data Management, EDC tools, SAS, and Good Clinical Practice (GCP).',
    targetAudience: 'B.Pharm, M.Pharm, B.Sc/M.Sc Biotechnology, Microbiology, and Life Sciences graduates looking for high-paying corporate healthcare IT roles.',
    keyChallengesAddressed: [
      'Transitioning from lab bench chemistry and retail dispensing into corporate clinical IT environments',
      'Mastering CDISC standards (SDTM, ADaM) and Electronic Data Capture (EDC) workflows',
      'Understanding FDA 21 CFR Part 11 and ICH-GCP regulatory guidelines without paying ₹1 Lakh for private institutes',
      'Bridging spreadsheets and medical vocabulary into relational databases and clinical reporting'
    ],
    recommendedTracks: [
      { title: 'Data Analytics & Business Intelligence', slug: 'data-analytics', whyRecommended: 'Master SQL and Excel to clean, validate, and report clinical trial patient safety datasets.', startingRole: 'Clinical Data Coordinator / Junior Data Analyst' },
      { title: 'Python & Automation', slug: 'python-automation', whyRecommended: 'Automate data discrepancy identification and adverse event surveillance log validations.', startingRole: 'Clinical Data Programmer' },
      { title: 'Advanced Excel & MIS', slug: 'advanced-excel', whyRecommended: 'Crucial for clinical audit trails, query management trackers, and patient cohort reconciliations.', startingRole: 'Clinical Trial Associate' }
    ],
    prerequisiteBridge: [
      { area: 'Good Clinical Practice (GCP) & CDISC Standards', startingGap: 'Theoretical knowledge of pharmacology without practical understanding of clinical trial phases, EDC systems, and CDISC SDTM.', bridgeAction: 'Complete the official NIDA/NIH GCP certificate and read the CDISC SDTM Implementation Guide.', freeResource: 'National Institute on Drug Abuse (NIDA) Clinical Trials Network GCP Training' },
      { area: 'SQL & Clinical Query Generation', startingGap: 'Zero database experience; only handled manual lab notes and Word documents.', bridgeAction: 'Learn relational queries: SELECT, JOINs, GROUP BY, and NULL validation against sample patient trial databases.', freeResource: 'Kaggle Clinical Trial Data Cleaning Notebooks & SQLZoo' }
    ],
    actionPlanSteps: [
      { stepNumber: 1, title: 'Earn Recognized Regulatory Certifications', duration: 'Weeks 1–3', description: 'Complete free, globally recognized certifications in ICH-GCP (E6 R2), 21 CFR Part 11, and basic pharmacovigilance concepts.', deliverables: ['ICH GCP Certificate of Completion', 'One-page regulatory cheat sheet on Adverse Events (AE) and SAE reporting'] },
      { stepNumber: 2, title: 'Clinical Data Cleaning & Query Management', duration: 'Weeks 4–8', description: 'Work on mock Phase III trial datasets. Write Data Validation Specifications (DVS), generate queries, and resolve discrepancy logs in Excel and SQL.', deliverables: ['Data Management Plan (DMP) mock document', 'SQL discrepancy query validation script on 10,000-row patient dataset'] },
      { stepNumber: 3, title: 'CRO & Pharma GCC Interview Preparation', duration: 'Weeks 9–12', description: 'Prepare for technical assessments on MedDRA coding, WHO Drug dictionaries, serious adverse event (SAE) narratives, and behavioral rounds.', deliverables: ['Optimized LinkedIn profile targeting CRO talent sourcers', '10 solved mock clinical scenario questions'] }
    ],
    portfolioAndProjectStrategy: {
      focus: 'Demonstrate deep adherence to protocol compliance, data accuracy, and patient safety tracking.',
      recommendedProject: 'Phase II Oncology Trial Patient Safety & Discrepancy Reconciliation Dashboard built in Power BI with an auditable SQL query backend.',
      howToStandOut: 'Include a documented Case Report Form (eCRF) design sample and a Data Validation Specification matrix mapped to CDISC SDTM domains.'
    },
    resumeAndPositioningAdvice: {
      framingStrategy: 'Highlight clinical domain authority combined with digital data handling skills. Target job titles such as Clinical Data Associate, CDM Trainee, or Pharmacovigilance Associate.',
      sampleBullet: 'Validated 15,000+ electronic Case Report Form (eCRF) patient entries against CDISC SDTM standards, flagging 120 protocol deviations using custom SQL validation queries.',
      avoidMistake: 'Do not describe yourself merely as a pharmacy graduate; position yourself as a Clinical Data Management specialist with pharmacy domain expertise.'
    },
    financialAndTransitionPlanning: {
      timeToFirstIncome: '3 to 5 Months.',
      hardwareRequirements: 'Standard 8GB RAM computer with Excel and internet access.',
      opportunityCostAdvice: 'CRO and pharma IT entry packages range between ₹3.8L to ₹6.5L LPA, offering predictable office/remote hours compared to retail pharmacy shifts.'
    }
  },
  {
    slug: 'law-graduate-to-legal-tech-corporate',
    title: 'Law Graduate to Legal Tech & Compliance Analyst',
    subtitle: 'Leverage LL.B and legal education for contract lifecycle tech, DPDP Act 2023 compliance, and legal operations',
    badge: 'Legal & Governance',
    badgeColor: 'amber',
    heroSummary: 'Litigation in Indian trial courts often demands 5+ years of grueling, poorly compensated junior practice under senior advocates. Meanwhile, multinational GCCs, fintechs, and tech enterprises are hiring law graduates who understand privacy laws (India DPDP Act 2023, GDPR), contract lifecycle management (CLM software), and automated compliance workflows.',
    targetAudience: 'Fresh LL.B, 5-year integrated law graduates, and practicing junior lawyers seeking corporate legal ops and compliance careers.',
    keyChallengesAddressed: [
      'Escaping low-stipend trial court litigation without giving up legal training',
      'Mastering technology-driven contract lifecycle management (Ironclad, Icertis, SpotDraft, DocuSign)',
      'Translating privacy and cybersecurity statutes into practical IT audit checklists and data governance maps',
      'Communicating effectively with software engineers, product managers, and enterprise risk officers'
    ],
    recommendedTracks: [
      { title: 'Cybersecurity & Governance', slug: 'cybersecurity', whyRecommended: 'Understanding data classification, access governance, and incident response is critical for privacy compliance.', startingRole: 'Compliance Analyst / Data Privacy Associate' },
      { title: 'Data Analytics & Business Intelligence', slug: 'data-analytics', whyRecommended: 'Track vendor risk metrics, contract expiry milestones, and regulatory audit compliance rates.', startingRole: 'Legal Operations Specialist' },
      { title: 'Product & Project Management', slug: 'product-management', whyRecommended: 'Manage enterprise contract workflows, vendor due diligence cycles, and regulatory filing roadmaps.', startingRole: 'Legal Tech Project Coordinator' }
    ],
    prerequisiteBridge: [
      { area: 'DPDP Act 2023 & Privacy Frameworks', startingGap: 'Knowledge of Indian Penal Code and civil procedure but unaware of Data Protection Board provisions and cross-border transfer rules.', bridgeAction: 'Read the official Digital Personal Data Protection Act 2023 rules and create an enterprise compliance audit checklist.', freeResource: 'Ministry of Electronics and IT (MeitY) DPDP Act Gazette & DSCI Privacy Guides' },
      { area: 'Contract Metadata & CLM Tools', startingGap: 'Drafted agreements only in Microsoft Word; unfamiliar with digital redlining, clause libraries, and metadata extraction.', bridgeAction: 'Learn how CLM tools extract indemnity, liability caps, and termination clauses for automated risk scoring.', freeResource: 'SpotDraft and Icertis open webinars & Contract Standards Open Library' }
    ],
    actionPlanSteps: [
      { stepNumber: 1, title: 'Master DPDP Act 2023 & Global Privacy Regulations', duration: 'Weeks 1–3', description: 'Analyze the obligations of Data Fiduciaries, Data Processors, Consent Managers, and penalties under the DPDP Act 2023 and EU GDPR.', deliverables: ['Enterprise Data Protection Impact Assessment (DPIA) template', 'Consent banner and notice flow audit document'] },
      { stepNumber: 2, title: 'Contract Playbook & CLM Automation', duration: 'Weeks 4–8', description: 'Build standard contract negotiation playbooks for Master Services Agreements (MSAs), Non-Disclosure Agreements (NDAs), and SaaS Vendor Agreements.', deliverables: ['Complete Vendor Contract Risk Scoring matrix in Excel/Notion', 'Standard clause fallbacks playbook for SaaS procurement'] },
      { stepNumber: 3, title: 'Corporate In-House & GCC Applications', duration: 'Weeks 9–12', description: 'Target GCCs, Big 4 forensic/compliance teams, and SaaS companies hiring Legal Operations Associates and Privacy Analysts.', deliverables: ['Resume tailored with CLM and DPDP keywords', 'Case study presentation analyzing a simulated corporate data breach response'] }
    ],
    portfolioAndProjectStrategy: {
      focus: 'Provide practical, actionable governance documents that save corporate counsel time and mitigate financial liability.',
      recommendedProject: 'Comprehensive DPDP Act 2023 Readiness Audit Report for an Indian E-Commerce Startup, including Data Flow Mapping and Consent Notices.',
      howToStandOut: 'Include a quantitative Vendor Risk Dashboard tracking third-party risk assessments, contract expiry alerts, and indemnity exposure.'
    },
    resumeAndPositioningAdvice: {
      framingStrategy: 'Frame legal analysis as an enabler of business velocity and risk mitigation. Emphasize compliance frameworks, CLM platforms, and audit preparedness.',
      sampleBullet: 'Drafted enterprise DPDP Act 2023 data flow mapping covering 14 user touchpoints, reducing privacy consent non-compliance risk across 500,000 monthly active users.',
      avoidMistake: 'Avoid filling your resume with trial court dates, bail filings, or criminal case numbers if applying for corporate tech and compliance roles.'
    },
    financialAndTransitionPlanning: {
      timeToFirstIncome: '3 to 4 Months.',
      hardwareRequirements: 'Standard laptop with MS Office, Google Workspace, and PDF editing software.',
      opportunityCostAdvice: 'Corporate legal ops and privacy roles start at ₹6.0L to ₹12.0L LPA in GCCs and tier-1 tech firms, with predictable working hours and clear corporate hierarchy.'
    }
  },
  {
    slug: 'teacher-to-edtech-instructional-designer',
    title: 'Educator to EdTech Instructional Designer',
    subtitle: 'Translate classroom pedagogy, curriculum planning, and school teaching into corporate L&D and EdTech instructional design',
    badge: 'Education & L&D',
    badgeColor: 'cyan',
    heroSummary: 'School teachers, college lecturers, and tuition educators in India often work long hours for modest salaries with limited career progression. The booming corporate Learning & Development (L&D) sector, enterprise onboarding teams, and EdTech platforms eagerly seek educators who can design structured e-learning modules, micro-learning assessments, and multimedia learning journeys.',
    targetAudience: 'School teachers (CBSE/ICSE/State Board), college lecturers, test-prep instructors, and corporate trainers wanting to enter instructional design.',
    keyChallengesAddressed: [
      'Translating blackboard teaching and classroom management into digital e-learning design',
      'Mastering instructional frameworks (ADDIE model, Bloom’s Taxonomy, Kirkpatrick’s 4 Levels of Evaluation)',
      'Learning modern authoring tools (Articulate Storyline, Canva, Loom, Figma) without formal design degrees',
      'Overcoming the perception that teachers are only qualified for traditional school environments'
    ],
    recommendedTracks: [
      { title: 'UI/UX & Product Design', slug: 'graphic-figma', whyRecommended: 'Design intuitive visual learning interfaces, storyboards, and interactive learning slides.', startingRole: 'Instructional Designer / E-Learning Developer' },
      { title: 'Digital Marketing & Content Strategy', slug: 'digital-marketing', whyRecommended: 'Create engaging course promos, email learning campaigns, and educational newsletters.', startingRole: 'Content Strategist / Curriculum Specialist' },
      { title: 'AI & Prompt Engineering', slug: 'ai-prompt-engineering', whyRecommended: 'Use generative AI to accelerate lesson plan generation, quiz creation, and multimedia voiceovers.', startingRole: 'AI-Enabled Curriculum Designer' }
    ],
    prerequisiteBridge: [
      { area: 'ADDIE & Adult Learning Theories', startingGap: 'Relied on school board prescribed syllabi without knowledge of adult learning theory (Andragogy) or corporate L&D frameworks.', bridgeAction: 'Study the ADDIE framework (Analysis, Design, Development, Implementation, Evaluation) and design a mock 4-week corporate onboarding module.', freeResource: 'Instructional Design Central (IDC) free guides & Coursera Foundations of Learning Design' },
      { area: 'Digital Storyboarding & Authoring Tools', startingGap: 'Comfortable with physical chalkboards or basic PowerPoint, but unfamiliar with interactive branching scenarios and SCORM packages.', bridgeAction: 'Create an interactive 10-slide branching scenario in Figma or Canva that adapts based on user quiz answers.', freeResource: 'Articulate 360 free trial community tutorials & Canva for Educators' }
    ],
    actionPlanSteps: [
      { stepNumber: 1, title: 'Ground Yourself in Corporate Learning Frameworks', duration: 'Weeks 1–3', description: 'Master Bloom’s Taxonomy for measurable learning objectives and Kirkpatrick’s model for measuring business training ROI.', deliverables: ['Course Design Document (CDD) with measurable business learning objectives', 'Needs Analysis assessment questionnaire'] },
      { stepNumber: 2, title: 'Develop an Interactive E-Learning Portfolio', duration: 'Weeks 4–8', description: 'Design 2 interactive e-learning modules: one software walkthrough simulation and one scenario-based soft-skills training module.', deliverables: ['Live interactive module hosted on Notion or personal portfolio site', 'Complete storyboard document with visual mockups and voiceover scripts'] },
      { stepNumber: 3, title: 'Target L&D and EdTech Opportunities', duration: 'Weeks 9–12', description: 'Network with Corporate L&D heads, EdTech instructional leads, and HR enablement managers on LinkedIn.', deliverables: ['Instructional Design portfolio link on resume header', '10 customized application pitches highlighting business ROI impact'] }
    ],
    portfolioAndProjectStrategy: {
      focus: 'Show how your learning interventions solve measurable business problems (e.g., reducing onboarding time or error rates).',
      recommendedProject: 'New-Hire Security & Phishing Awareness Interactive Module featuring realistic simulated email scams and branch decision trees.',
      howToStandOut: 'Include a downloadable learner guide, measurable pre/post quiz metrics, and a clean Figma storyboard.'
    },
    resumeAndPositioningAdvice: {
      framingStrategy: 'Reposition classroom teaching as curriculum engineering, stakeholder management, assessment design, and learner engagement optimization.',
      sampleBullet: 'Architected a modular 5-part digital training curriculum with interactive knowledge checks, boosting test completion rates by 42% across 300+ learners.',
      avoidMistake: 'Do not write your resume like a school application listing PTA meetings or syllabus completion; focus on instructional design deliverables and business outcomes.'
    },
    financialAndTransitionPlanning: {
      timeToFirstIncome: '3 to 4 Months.',
      hardwareRequirements: 'Standard 8GB RAM PC or laptop with mic for voiceover recordings.',
      opportunityCostAdvice: 'Corporate L&D and Instructional Designer roles offer starting packages of ₹5.0L to ₹10.0L LPA compared to the typical ₹2.5L to ₹4.0L school teacher salaries.'
    }
  },
  {
    slug: 'accountant-to-financial-analyst-fp-and-a',
    title: 'Accountant to Corporate Financial Analyst (FP&A)',
    subtitle: 'Move from manual Tally and voucher entry to financial modeling, Power BI forecasting, and strategic FP&A',
    badge: 'Finance & FP&A',
    badgeColor: 'emerald',
    heroSummary: 'Traditional accountants in India often remain trapped entering debit/credit vouchers, doing monthly bank reconciliations, and filing GST in Tally for modest pay. Modern corporations, MNC Global Capability Centers (GCCs), and funded startups pay 2x–3x more for Financial Planning & Analysis (FP&A) professionals who can build 3-statement financial models, variance analyses, and cash flow forecasts in Excel and Power BI.',
    targetAudience: 'B.Com/M.Com graduates, Tally operators, and accounting executives looking to transition into high-paying corporate finance roles.',
    keyChallengesAddressed: [
      'Transitioning from historical backward-looking accounting to forward-looking budgeting and forecasting',
      'Upgrading basic spreadsheet entry to dynamic 3-statement financial models with sensitivity analysis',
      'Learning business intelligence tools (Power BI, DAX, Power Query) for automated executive reporting',
      'Overcoming the barrier of not having a formal CA/CFA credential through verifiable modeling case studies'
    ],
    recommendedTracks: [
      { title: 'Data Analytics & Business Intelligence', slug: 'data-analytics', whyRecommended: 'Master SQL and Power BI to analyze millions of ERP transactional records and create executive dashboards.', startingRole: 'Financial Data Analyst / FP&A Analyst' },
      { title: 'Tally Prime & GST Accounting', slug: 'tally-gst', whyRecommended: 'Leverage deep statutory accounting fundamentals while automating manual ledger exports.', startingRole: 'Senior Financial Analyst' },
      { title: 'Advanced Excel & Financial Modeling', slug: 'advanced-excel', whyRecommended: 'Build dynamic discounted cash flow (DCF), budgeting, and scenario planning models.', startingRole: 'FP&A Executive / Corporate Finance Associate' }
    ],
    prerequisiteBridge: [
      { area: 'Dynamic Financial Modeling', startingGap: 'Used Excel only for summing rows and manual journal adjustments; unfamiliar with INDEX-MATCH, XLOOKUP, dynamic ranges, and circular references.', bridgeAction: 'Build an interconnected 3-statement financial model (Income Statement, Balance Sheet, Cash Flow) with working capital schedules.', freeResource: 'Corporate Finance Institute (CFI) free modeling webinars & YouTube Corporate Finance tutorials' },
      { area: 'Variance Analysis & Business Storytelling', startingGap: 'Viewed accounts as debits and credits without explaining variance drivers (price vs. volume mix) to business leadership.', bridgeAction: 'Take a sample manufacturing P&L and write an executive monthly commentary detailing why gross margins contracted by 180 basis points.', freeResource: 'Aswath Damodaran (NYU Stern) Corporate Finance Lecture Series' }
    ],
    actionPlanSteps: [
      { stepNumber: 1, title: 'Master Advanced Excel for Finance', duration: 'Weeks 1–3', description: 'Master XLOOKUP, nested logic, data tables, scenario managers, and dynamic financial charts without touching a mouse.', deliverables: ['Fully dynamic 3-statement financial model template', 'Keyboard shortcut speed mastery'] },
      { stepNumber: 2, title: 'Build FP&A Budgeting & Variance Models', duration: 'Weeks 4–8', description: 'Create an Annual Operating Plan (AOP) budgeting model with monthly Budget vs. Actual (BvA) variance analysis and rolling forecasts.', deliverables: ['Budget vs Actual automated model with waterfall charts', 'Power BI financial dashboard connected to Excel source'] },
      { stepNumber: 3, title: 'GCC & Corporate Interview Preparation', duration: 'Weeks 9–12', description: 'Prepare for FP&A technical interviews covering EBITDA calculations, Free Cash Flow formulas, working capital optimization, and business cases.', deliverables: ['1-page executive financial summary ready for interview portfolio', '20 targeted applications sent to finance GCC recruiters'] }
    ],
    portfolioAndProjectStrategy: {
      focus: 'Demonstrate foresight, strategic commercial understanding, and flawless mathematical modeling.',
      recommendedProject: '5-Year Rolling Financial Model & Budget Variance Dashboard for an Indian D2C Brand, complete with unit economics and customer acquisition cost (CAC) sensitivity.',
      howToStandOut: 'Record a 3-minute video walking through how changing raw material price assumptions automatically cascades through EBITDA and Free Cash Flow in your model.'
    },
    resumeAndPositioningAdvice: {
      framingStrategy: 'Frame your accounting background as rock-solid foundational domain knowledge, while highlighting your analytical forecasting and modeling tools.',
      sampleBullet: 'Engineered a dynamic 12-month rolling cash flow forecast model in Excel/Power BI, identifying a ₹45L working capital deficit 60 days in advance.',
      avoidMistake: 'Do not simply list "Tally data entry" or "filing GST returns"; emphasize financial analysis, variance commentary, and forecasting.'
    },
    financialAndTransitionPlanning: {
      timeToFirstIncome: '3 to 5 Months.',
      hardwareRequirements: 'Standard 8GB to 16GB RAM PC running Microsoft Excel (Windows version strongly preferred for financial shortcuts).',
      opportunityCostAdvice: 'FP&A Analysts in Indian GCCs and corporates earn ₹6.5L to ₹13.0L LPA compared to the typical ₹2.5L to ₹4.0L salary cap of traditional bookkeepers.'
    }
  },
  {
    slug: 'graphic-designer-to-ui-ux-product-designer',
    title: 'Graphic Designer to UI/UX Product Designer',
    subtitle: 'Upgrade print, branding, and Photoshop skills into Figma design systems, UX research, wireframing, and product design',
    badge: 'Design & Product',
    badgeColor: 'rose',
    heroSummary: 'Graphic designers working on social media banners, print brochures, and marketing flyers frequently hit a salary ceiling of ₹25,000–₹40,000 per month. By transitioning to UI/UX Product Design—learning user journey mapping, wireframing, Figma design systems, responsive layout grids, and usability testing—designers can enter high-paying tech and product roles.',
    targetAudience: 'Graphic designers, Photoshop/Illustrator creators, digital artists, and visual designers wanting to transition into software product design.',
    keyChallengesAddressed: [
      'Moving from purely aesthetic visual design to problem-solving, user-centric product architecture',
      'Mastering Figma component architecture (Auto Layout, Variants, Variables, and Token systems)',
      'Conducting practical user research, wireframing, and usability testing without large budgets',
      'Writing structured UX case studies that demonstrate product thinking rather than just pretty dribbble mockups'
    ],
    recommendedTracks: [
      { title: 'Graphic & UI/UX Design with Figma', slug: 'graphic-figma', whyRecommended: 'Master modern Figma workflows, responsive design systems, accessibility contrast, and micro-interactions.', startingRole: 'Associate UI/UX Designer / Product Designer' },
      { title: 'Full-Stack Web Fundamentals', slug: 'full-stack-web', whyRecommended: 'Understanding HTML/CSS flexbox and responsive breakpoints makes you 10x more valuable to frontend engineering teams.', startingRole: 'Design Technologist / UI Designer' },
      { title: 'Product Management Fundamentals', slug: 'product-management', whyRecommended: 'Learn how product managers define metrics, user stories, and feature prioritization matrices.', startingRole: 'Product Design Associate' }
    ],
    prerequisiteBridge: [
      { area: 'Figma Auto Layout & Design Tokens', startingGap: 'Relied on pixel-based canvas tools (Photoshop/CorelDRAW) with static artboards and manual alignments.', bridgeAction: 'Rebuild a responsive SaaS navigation header and card grid utilizing 100% Auto Layout with nested components and min/max width constraints.', freeResource: 'Figma Community official YouTube channel & DesignerUp Auto Layout Deep Dive' },
      { area: 'UX Research & Information Architecture', startingGap: 'Assumed design is only about color palettes and typography; unfamiliar with user interview scripts, empathy maps, and user flow diagrams.', bridgeAction: 'Conduct 3 usability interviews on an existing friction-heavy app (e.g., IRCTC tatkal booking) and chart the complete user journey map.', freeResource: 'Nielsen Norman Group (NN/g) Free UX Articles and Usability Heuristics' }
    ],
    actionPlanSteps: [
      { stepNumber: 1, title: 'Master Figma Component Architecture', duration: 'Weeks 1–3', description: 'Master Figma Auto Layout, component variants, interactive prototyping states (hover, pressed, disabled), and WCAG accessibility standards.', deliverables: ['Modular UI Kit with 20+ accessible components with light/dark theme tokens', 'Figma prototype with micro-interactions'] },
      { stepNumber: 2, title: 'Conduct UX Research and Write Case Studies', duration: 'Weeks 4–8', description: 'Select 2 real-world problems. Execute competitive analysis, low-fidelity wireframes, high-fidelity prototypes, and usability testing rounds.', deliverables: ['2 comprehensive, scannable case studies published on Notion or Webflow', 'Before-and-after user journey mapping diagram'] },
      { stepNumber: 3, title: 'Portfolio Curation & Design Reviews', duration: 'Weeks 9–12', description: 'Package case studies into a clean portfolio website, practice explaining design trade-offs, and conduct live Figma whiteboard challenges.', deliverables: ['Live portfolio website link on custom domain', 'Figma presentation deck ready for design hiring managers'] }
    ],
    portfolioAndProjectStrategy: {
      focus: 'Emphasize the problem statement, user friction points, wireframe iterations, and measurable business outcomes over superficial animations.',
      recommendedProject: 'Fintech Mobile App redesign simplifying UPI recurring bill payments and split-expense settlements for Indian college students.',
      howToStandOut: 'Include screenshots of rejected early wireframes and clearly document why user feedback forced you to pivot your layout decisions.'
    },
    resumeAndPositioningAdvice: {
      framingStrategy: 'Position your visual design background as an asset for UI polish, but lead your portfolio with UX research, information architecture, and design system scalability.',
      sampleBullet: 'Redesigned checkout onboarding flow in Figma using design system tokens, reducing checkout drop-off by 24% across 8 prototype usability testing sessions.',
      avoidMistake: 'Do not submit a portfolio of static Behance posters or logo designs; tech recruiters want to see interactive product flows and problem-solving rationale.'
    },
    financialAndTransitionPlanning: {
      timeToFirstIncome: '3 to 4 Months.',
      hardwareRequirements: '8GB to 16GB RAM laptop or desktop running modern web browser capable of Figma.',
      opportunityCostAdvice: 'UI/UX Product Designers in India command ₹6.0L to ₹14.0L LPA at tech startups and product companies, compared to ₹3.0L to ₹4.5L for conventional graphic designers.'
    }
  },
  {
    slug: 'sales-executive-to-b2b-saas-sdr-revops',
    title: 'Field Sales Executive to B2B SaaS SDR & RevOps',
    subtitle: 'Transition from offline field sales into global B2B SaaS inside sales, pipeline management, and revenue operations',
    badge: 'Sales & Go-To-Market',
    badgeColor: 'purple',
    heroSummary: 'Field sales professionals in India endure scorching commutes, physical door-to-door store visits, and exhausting collection cycles for low fixed pay. B2B SaaS companies in Bengaluru, Gurugram, Pune, and remote US/Europe-focused startups hire tech-savvy Sales Development Representatives (SDRs) and Revenue Operations (RevOps) specialists who work indoors or from home with high USD-pegged commissions.',
    targetAudience: 'Field sales representatives, FMCG/telecom distributors, retail relationship executives, and telecallers looking to break into enterprise SaaS sales.',
    keyChallengesAddressed: [
      'Transitioning from unstructured offline sales pitches to structured consultative enterprise sales methodologies',
      'Mastering modern B2B outbound tech stacks (LinkedIn Sales Navigator, Apollo.io, HubSpot, Salesforce)',
      'Writing high-converting cold email sequences and consultative discovery call scripts',
      'Understanding SaaS business metrics (ARR, ACV, CAC, Churn, LTV) and inbound vs. outbound pipeline math'
    ],
    recommendedTracks: [
      { title: 'Digital Marketing & Growth', slug: 'digital-marketing', whyRecommended: 'Understand buyer personas, inbound lead funnels, and email sequence automation.', startingRole: 'Sales Development Representative (SDR) / BDR' },
      { title: 'Data Analytics & Reporting', slug: 'data-analytics', whyRecommended: 'Track pipeline conversion rates, rep quota attainment, and CRM hygiene for Revenue Operations.', startingRole: 'RevOps Analyst / Sales Operations Executive' },
      { title: 'Business English & Communication', slug: 'communication-english', whyRecommended: 'Polish professional cadence, neutral accent clarity, and executive objection handling for US/UK/Indian CXO calls.', startingRole: 'International SDR / Inside Sales Specialist' }
    ],
    prerequisiteBridge: [
      { area: 'Consultative B2B Frameworks (BANT & MEDDIC)', startingGap: 'Trained only in transactional, pushy hard-selling without qualifying budget, authority, need, and timeline.', bridgeAction: 'Study the MEDDPICC framework and draft a consultative discovery questionnaire for an enterprise SaaS product.', freeResource: 'HubSpot Sales Academy free certification & Winning by Design YouTube framework' },
      { area: 'Outbound Prospecting Tech Stack', startingGap: 'Relied on handwritten registers or basic phone contact lists; never used CRM stages or lead enrichment tools.', bridgeAction: 'Set up a free HubSpot CRM account, import 50 prospective target leads enriched via Apollo.io, and build a 4-step cadence.', freeResource: 'Apollo Academy & HubSpot Inbound Sales Certification' }
    ],
    actionPlanSteps: [
      { stepNumber: 1, title: 'Master SaaS Metrics and Qualification Frameworks', duration: 'Weeks 1–3', description: 'Learn the unit economics of software companies: Annual Recurring Revenue (ARR), Pipeline Velocity, and the MEDDPICC qualification system.', deliverables: ['One-page SaaS Sales Glossary and metrics cheat sheet', 'Completed HubSpot Inbound Sales Certificate'] },
      { stepNumber: 2, title: 'Build a Live Outbound Cold Campaign', duration: 'Weeks 4–8', description: 'Select a real SaaS product. Define the Ideal Customer Profile (ICP), build a verified list of 100 decision-makers, and write personalized email sequences.', deliverables: ['3-step personalized cold outreach sequence with 30%+ open rate benchmark', 'Recorded 5-minute mock discovery call video'] },
      { stepNumber: 3, title: 'Cold Outreach Directly to Sales Leaders', duration: 'Weeks 9–12', description: 'Use your prospecting skills on VPs of Sales and Founders: send personalized LinkedIn video notes demonstrating your hustle and preparation.', deliverables: ['10 customized video pitches sent to hiring managers', 'Target list of 40 well-funded Series A–C SaaS companies'] }
    ],
    portfolioAndProjectStrategy: {
      focus: 'Prove you can book qualified pipeline and communicate with busy VP and C-level executives.',
      recommendedProject: 'Complete Outbound Playbook for an AI Customer Support SaaS, targeting E-commerce Heads of Operations with customized pain-point messaging.',
      howToStandOut: 'Record a mock 3-minute cold call objection handling simulation tackling common objections: "Send me an email", "We already have a vendor", and "No budget".'
    },
    resumeAndPositioningAdvice: {
      framingStrategy: 'Frame field sales as resilience, thick skin, and grit that cannot be taught, while demonstrating complete mastery of digital CRM workflows and email metrics.',
      sampleBullet: 'Constructed an outbound multi-channel prospecting cadence (Apollo, LinkedIn) generating 14 qualified demo opportunities in simulated enterprise campaign.',
      avoidMistake: 'Do not focus on physical territory distribution or inventory stocking; focus on quota attainment percentage, objection handling, and lead pipeline value.'
    },
    financialAndTransitionPlanning: {
      timeToFirstIncome: '2 to 4 Months.',
      hardwareRequirements: 'Reliable laptop, stable high-speed broadband, and a noise-canceling headset for calls.',
      opportunityCostAdvice: 'B2B SaaS SDRs in India earn a base pay of ₹4.5L to ₹8.0L LPA plus uncapped performance incentives, with rapid promotion to Account Executive (₹12L–₹25L LPA) within 18 months.'
    }
  },
  {
    slug: 'qa-manual-tester-to-sdet-automation',
    title: 'Manual QA Tester to SDET Automation Engineer',
    subtitle: 'Break through the manual testing salary ceiling with Playwright, Selenium, API testing, and CI/CD pipelines',
    badge: 'QA to Engineering',
    badgeColor: 'cyan',
    heroSummary: 'Manual QA engineers in India face plateaued compensation and the threat of AI test generation replacing repetitive click-and-verify testing. The industry has decisively shifted toward Software Development Engineers in Test (SDETs)—engineers who write automated end-to-end test suites, performance benchmarks, and CI/CD validation gates in TypeScript, Python, or Java.',
    targetAudience: 'Manual testers, QA analysts, test coordinators, and quality consultants stuck doing manual regression cycles.',
    keyChallengesAddressed: [
      'Transitioning from writing Excel test case checklists to writing maintainable, reusable automation code',
      'Overcoming fear of object-oriented programming, data structures, and script debugging',
      'Mastering modern browser automation tools (Playwright, Cypress) instead of obsolete, flaky Selenium setups',
      'Integrating automated test suites into GitHub Actions and Jenkins continuous integration pipelines'
    ],
    recommendedTracks: [
      { title: 'Full-Stack Web Development', slug: 'full-stack-web', whyRecommended: 'Understand Document Object Model (DOM), CSS selectors, async promises, and RESTful APIs from an architectural level.', startingRole: 'QA Automation Engineer / SDET 1' },
      { title: 'Python & Automation Engineering', slug: 'python-automation', whyRecommended: 'Write concise pytest automation suites, backend database validators, and data-driven testing scripts.', startingRole: 'Automation Test Engineer' },
      { title: 'DevOps & SRE Practices', slug: 'devops-sre', whyRecommended: 'Set up automated headless browser test runs in GitHub Actions, Docker containers, and test reporting dashboards.', startingRole: 'SDET / Quality Ops Engineer' }
    ],
    prerequisiteBridge: [
      { area: 'JavaScript/TypeScript or Python Fundamentals', startingGap: 'Only copied boilerplate snippets or executed manual test steps without coding clean functions, loops, and async/await syntax.', bridgeAction: 'Build a script that parses JSON API responses, validates HTTP status codes, and asserts schema conformity.', freeResource: 'JavaScript.info & freeCodeCamp Modern JavaScript Course' },
      { area: 'Modern Test Frameworks (Playwright)', startingGap: 'Taught outdated Selenium WebDriver in college or bootcamps; frustrated with brittle timeouts and complex driver installations.', bridgeAction: 'Install Playwright and write 5 automated test specs with assertions, screenshots on failure, and auto-waiting selectors.', freeResource: 'Playwright official documentation & ExecuteAutomation YouTube tutorials' }
    ],
    actionPlanSteps: [
      { stepNumber: 1, title: 'Master Core Programming and API Automation', duration: 'Weeks 1–4', description: 'Master TypeScript or Python fundamentals. Automate REST API testing using Postman/Newman and Supertest/Requests with automated authentication tokens.', deliverables: ['Suite of 20 automated API tests validating status, schema, and response latency', 'Postman collection with automated environment variables'] },
      { stepNumber: 2, title: 'Build an End-to-End Playwright Framework', duration: 'Weeks 5–8', description: 'Implement the Page Object Model (POM) pattern in Playwright. Automate critical e-commerce flows: login, search, cart, checkout, and receipt generation.', deliverables: ['GitHub repository containing modular Page Object Model framework', 'HTML test execution report with failure trace recordings'] },
      { stepNumber: 3, title: 'CI/CD Pipeline Integration & Interview Prep', duration: 'Weeks 9–12', description: 'Configure GitHub Actions to execute your Playwright test suite headlessly on every git push. Prepare for coding and framework architecture interviews.', deliverables: ['Working GitHub Actions workflow badge showing green passing tests', '30 answered SDET coding and debugging interview questions'] }
    ],
    portfolioAndProjectStrategy: {
      focus: 'Prove your automation framework is stable, maintainable, self-healing, and runs headlessly in CI without flakiness.',
      recommendedProject: 'Production-Grade E-Commerce Test Automation Suite built with Playwright and TypeScript, featuring Page Object Model, parallel workers, and Slack failure alerts.',
      howToStandOut: 'Include a custom reporting dashboard and demonstrated visual regression testing using Playwright pixel comparison snapshots.'
    },
    resumeAndPositioningAdvice: {
      framingStrategy: 'Reposition your manual testing experience as deep domain knowledge in edge case identification and test strategy, now supercharged with production automation code.',
      sampleBullet: 'Architected a Playwright/TypeScript test automation framework executing 120 regression test cases across Chromium, Firefox, and WebKit in CI within 8 minutes.',
      avoidMistake: 'Do not describe yourself as a "Manual QA willing to learn automation"; position yourself directly as an SDET with a live GitHub automation repo.'
    },
    financialAndTransitionPlanning: {
      timeToFirstIncome: '3 to 5 Months.',
      hardwareRequirements: '8GB to 16GB RAM laptop capable of running Node.js, Docker, and headless browser instances.',
      opportunityCostAdvice: 'SDET packages in India range from ₹7.0L to ₹16.0L LPA, compared to the ₹3.5L to ₹6.0L ceiling typical of manual QA testers with similar years of experience.'
    }
  },
  {
    slug: 'diploma-electrical-to-ev-battery-engineer',
    title: 'Electrical Diploma to EV Battery & BMS Technician',
    subtitle: 'Transition conventional domestic and industrial wiring skills into EV powertrain, battery pack assembly, and BMS diagnostics',
    badge: 'Green Mobility & EV',
    badgeColor: 'teal',
    heroSummary: 'Polytechnic diploma holders in Electrical and Mechanical engineering often end up in low-wage building maintenance or factory operator jobs earning under ₹18,000 per month. With India’s aggressive electric 2-wheeler, 3-wheeler, and commercial fleet adoption (Ola Electric, Ather, Tata EV, Exide Energy), technicians with practical skills in cell testing, Battery Management Systems (BMS), and thermal validation are in acute shortage.',
    targetAudience: 'Diploma (Polytechnic) in Electrical, Electronics, or Mechanical engineering, ITI Electricians, and automotive mechanics wanting to enter the electric vehicle sector.',
    keyChallengesAddressed: [
      'Transitioning from 230V AC building wiring to high-voltage DC automotive traction packs',
      'Understanding Lithium-ion cell chemistries (NMC vs. LFP), cell sorting, and internal resistance measurement',
      'Diagnosing Battery Management Systems (BMS) wiring harnesses, thermal sensors, and CAN bus communication',
      'Navigating ARAI and AIS 156 (Phase 2) Indian EV battery safety standards and compliance guidelines'
    ],
    recommendedTracks: [
      { title: 'Electric Vehicle & Battery Tech', slug: 'ev-battery-tech', whyRecommended: 'Covers lithium cell grading, spot welding, BMS calibration, and high-voltage safety interlocks.', startingRole: 'EV Battery Assembly Technician / BMS Testing Associate' },
      { title: 'Solar & Renewable Energy Design', slug: 'solar-renewable-energy-design', whyRecommended: 'Complements battery storage knowledge with solar PV charging stations and commercial BESS systems.', startingRole: 'Renewable Storage Technician' },
      { title: 'Python & Automation Fundamentals', slug: 'python-automation', whyRecommended: 'Automate battery cycling data logging and charge/discharge degradation curve analysis.', startingRole: 'Battery Test Lab Assistant' }
    ],
    prerequisiteBridge: [
      { area: 'DC Electronics & Cell Safety (AIS 156 Standards)', startingGap: 'Trained primarily on AC motors and home wiring; unaware of thermal runaway risks and automotive DC safety protocols.', bridgeAction: 'Study the AIS 156 Indian battery safety amendment and practice DC Ohm’s law calculations for parallel/series cell strings.', freeResource: 'ARAI Open AIS-156 Standards Guidelines & NPTEL Electric Vehicles Part 1' },
      { area: 'Battery Management Systems (BMS) Architecture', startingGap: 'Never handled digital microcontrollers or protection circuit modules; unfamiliar with cell balancing and CAN protocol.', bridgeAction: 'Learn how BMS protection ICs monitor over-voltage, under-voltage, over-temperature, and perform passive balancing.', freeResource: 'Texas Instruments Battery Management Training Series (free online)' }
    ],
    actionPlanSteps: [
      { stepNumber: 1, title: 'Master Cell Chemistries, Sizing, and Pack Design', duration: 'Weeks 1–4', description: 'Calculate series-parallel cell configurations (e.g., 16S4P 60V pack for an electric scooter). Understand C-ratings, Depth of Discharge (DoD), and thermal dissipation.', deliverables: ['Complete battery sizing calculation worksheet for an electric 2-wheeler', 'Cell sorting and grading procedure checklist'] },
      { stepNumber: 2, title: 'BMS Wiring, Spot Welding, and Assembly Protocol', duration: 'Weeks 5–8', description: 'Study nickel strip sizing, spot welding current parameters, insulation materials (Kapton, fish paper), and BMS wiring schematics.', deliverables: ['Wiring schematic diagram for 16S LFP pack with active BMS wiring harness', 'Battery pack testing and quality control checklist'] },
      { stepNumber: 3, title: 'Hands-On Diagnostic Testing & OEM Applications', duration: 'Weeks 9–12', description: 'Learn diagnostic troubleshooting using digital multimeters, internal resistance (IR) testers, and CAN-to-USB diagnostic loggers. Apply to EV OEMs and battery pack manufacturers.', deliverables: ['Technical portfolio document documenting battery build schematics', '20 targeted applications sent to EV manufacturing hubs in Tamil Nadu, Pune, and NCR'] }
    ],
    portfolioAndProjectStrategy: {
      focus: 'Demonstrate rigorous electrical safety awareness, precise calculations, and clean physical assembly documentation.',
      recommendedProject: 'Detailed Engineering Blueprint for a 48V 30Ah LFP Battery Pack for Electric 3-Wheelers, complete with thermal management, cell holder matrix, and AIS 156 compliance checks.',
      howToStandOut: 'Include clear CAD or schematic drawings showing cell interconnection, fuse protection locations, and emergency disconnect contactors.'
    },
    resumeAndPositioningAdvice: {
      framingStrategy: 'Highlight practical hands-on electrical troubleshooting combined with specialized, certified knowledge of Lithium-ion pack standards and automotive BMS.',
      sampleBullet: 'Engineered CAD electrical layout and BMS wiring schematic for 60V 32Ah EV battery pack adhering to AIS 156 Phase 2 thermal runaway prevention standards.',
      avoidMistake: 'Do not position yourself as a generic maintenance electrician; state clearly: "EV Battery Pack & BMS Integration Specialist".'
    },
    financialAndTransitionPlanning: {
      timeToFirstIncome: '2 to 4 Months.',
      hardwareRequirements: 'Standard PC for calculations and CAD/schematic review; basic digital multimeter for personal experiments.',
      opportunityCostAdvice: 'EV battery technicians earn starting packages of ₹3.5L to ₹6.0L LPA at top EV OEMs with rapid escalation to pack design supervisor roles, well ahead of general factory labor.'
    }
  },
  {
    slug: 'data-entry-to-mis-business-intelligence',
    title: 'Data Entry Operator to MIS & BI Specialist',
    subtitle: 'Climb out of repetitive back-office typing roles into automated Excel macros, Power Query data cleaning, and Power BI reporting',
    badge: 'Career Elevation',
    badgeColor: 'amber',
    heroSummary: 'Millions of workers across India work in back-office data entry, copy-pasting records between spreadsheets and legacy ERPs for ₹12,000–₹18,000 a month with no growth prospect. By mastering Power Query automation, advanced lookup logic, and interactive Power BI executive dashboards, data entry operators can step up into high-respect Management Information Systems (MIS) and Business Intelligence roles.',
    targetAudience: 'Data entry operators, back-office executives, administrative assistants, and computer operators looking to double their income and automate manual work.',
    keyChallengesAddressed: [
      'Breaking free from manual, mindless copy-pasting that is susceptible to errors and fatigue',
      'Learning to automate recurring daily/weekly reports using Excel Power Query without writing complex code',
      'Bridging basic typing skills into structured database queries (SQL) and relational data modeling',
      'Building the confidence to present interactive dashboards directly to department managers and executives'
    ],
    recommendedTracks: [
      { title: 'Advanced Excel & MIS Reporting', slug: 'advanced-excel', whyRecommended: 'Transform messy raw exports into automated daily dashboards using Power Query, Pivot Tables, and dynamic formulas.', startingRole: 'MIS Executive / Operations Analyst' },
      { title: 'Data Analytics & Power BI', slug: 'data-analytics', whyRecommended: 'Create beautiful, interactive visual dashboards that senior management can access on mobile and web.', startingRole: 'Business Intelligence Associate' },
      { title: 'Python & Desktop Automation', slug: 'python-automation', whyRecommended: 'Automate repetitive file renaming, email report sending, and web scraping with simple Python scripts.', startingRole: 'Automation Assistant / Reporting Specialist' }
    ],
    prerequisiteBridge: [
      { area: 'Excel Power Query Automation', startingGap: 'Spent 3 hours every morning manually copying data from 10 different branch files into a master spreadsheet.', bridgeAction: 'Use Power Query "Get Data from Folder" to combine, clean, and transform multiple CSV/Excel files with a single click.', freeResource: 'Kevin Stratvert Power Query Beginner Tutorial & Chandoo Excel Automation' },
      { area: 'Basic Relational Database Concepts & SQL', startingGap: 'Viewed all data as single flat spreadsheets; never used primary keys or joined tables.', bridgeAction: 'Learn how to normalize data, eliminate redundant columns, and write fundamental SQL SELECT statements.', freeResource: 'SQLBolt Interactive Lessons & ExcelIsFun YouTube channel' }
    ],
    actionPlanSteps: [
      { stepNumber: 1, title: 'Master Excel Power Query & Pivot Tables', duration: 'Weeks 1–3', description: 'Replace all manual copy-pasting with automated Power Query refresh buttons. Master SUMIFS, XLOOKUP, conditional formatting, and slicers.', deliverables: ['One-click automated sales reconciliation workbook', '10 Excel productivity keyboard shortcuts mastered'] },
      { stepNumber: 2, title: 'Build Executive Dashboards in Power BI', duration: 'Weeks 4–8', description: 'Import cleaned data into Microsoft Power BI Desktop. Build data models with 1-to-many relationships, write basic DAX measures (Total Sales, YoY Growth), and build interactive visuals.', deliverables: ['Interactive 3-page Power BI executive report published to web', 'Documented data dictionary of business metrics'] },
      { stepNumber: 3, title: 'Target MIS Executive Roles in Logistics & Retail', duration: 'Weeks 9–12', description: 'Apply for MIS Executive, Operations Reporting Specialist, and Junior BI Analyst openings in logistics, retail chains, and IT services.', deliverables: ['Resume highlighting automation hours saved rather than typing speed', 'Portfolio link showcasing interactive Power BI dashboards'] },
      { stepNumber: 4, title: 'Scale with Basic SQL & Automated Schedulers', duration: 'Weeks 13–16', description: 'Connect Power BI directly to PostgreSQL or MySQL databases to query live production data without requiring manual Excel exports.', deliverables: ['SQL script portfolio demonstrating data cleaning queries', 'Automated email distribution setup for weekly KPI reports'] }
    ],
    portfolioAndProjectStrategy: {
      focus: 'Emphasize hours saved through automation, error reduction, and visual clarity for executive decision-makers.',
      recommendedProject: 'End-to-End Retail Multi-Store Sales & Inventory Dashboard in Power BI, automatically consolidating daily branch sales and highlighting stockout risks.',
      howToStandOut: 'Write a case study summary stating: "Automated a manual 4-hour daily branch reconciliation process into a 15-second one-click Power Query refresh".'
    },
    resumeAndPositioningAdvice: {
      framingStrategy: 'Completely eliminate terms like "typing speed (WPM)" or "data entry operator" from your resume. Rebrand as an "MIS Reporting & Business Intelligence Specialist".',
      sampleBullet: 'Automated daily consolidation of 12 regional branch reports using Excel Power Query, saving 15 manual hours weekly while eliminating data entry errors.',
      avoidMistake: 'Do not list simple copy-paste tasks on your resume; showcase dashboard links, automated workflows, and business KPIs tracked.'
    },
    financialAndTransitionPlanning: {
      timeToFirstIncome: '2 to 3 Months.',
      hardwareRequirements: 'Standard office PC or laptop with Microsoft Excel and free Power BI Desktop.',
      opportunityCostAdvice: 'MIS Executives and BI Associates in India start at ₹3.5L to ₹6.5L LPA, more than doubling the stagnant ₹1.5L to ₹2.2L ceiling of basic data entry clerks.'
    }
  }
];
