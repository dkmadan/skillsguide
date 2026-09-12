import type { SkillDetail } from './skillsData';

export const marketingOperationsCoreEngSkills: SkillDetail[] = [
  {
    slug: 'revops-sales-operations',
    title: 'Revenue Operations (RevOps) & Sales Operations',
    category: 'business',
    domainSlug: 'business-growth-nocode',
    categoryLabel: 'Business & Growth',
    shortDesc: 'Align marketing, sales, and customer success funnels, optimize CRM pipelines, and model revenue forecasting.',
    longDesc: 'Revenue Operations (RevOps) breaks down corporate silos across Marketing, Sales, and Customer Success to maximize ARR growth. Master full-funnel pipeline analytics (HubSpot, Salesforce), lead routing logic, sales compensation plans, territory modeling, churn forecasting, and Net Revenue Retention (NRR) optimization.',
    heroImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'RevOps Full-Funnel Revenue Engine Architecture',
      caption: 'MQL generation, SQL routing, deal stage progression, billing handoff, and expansion retention.',
      imageUrl: '/images/concepts/concept-product-growth-flywheel.svg',
      keyPoints: [
        { label: 'Full-Funnel Telemetry', description: 'Tracking CAC, conversion velocity, win/loss ratios, and pipeline coverage ratios.' },
        { label: 'Automated Lead Routing', description: 'Round-robin assignment and territory scoring algorithms in CRM.' },
        { label: 'Sales Compensation Models', description: 'Designing OTE commissions, accelerators, and quota attainment tiers.' },
        { label: 'Revenue Forecasting', description: 'Predictive weighted pipeline forecasting and Net Revenue Retention (NRR) modeling.' }
      ]
    },
    salaryRange: '₹7.0L – ₹24.0L LPA',
    minSalaryLPA: 7.0,
    maxSalaryLPA: 24.0,
    averageSalaryLPA: 14.5,
    timelineWeeks: '8 – 12 Weeks',
    hiringVolume: '15,000+ Openings in B2B SaaS & Tech Startups',
    experienceLevel: 'Intermediate',
    topCities: ['Bengaluru', 'Delhi NCR', 'Mumbai', 'Hyderabad', 'Pune', 'Remote'],
    tools: ['HubSpot CRM', 'Salesforce Sales Cloud', 'Gong.io / Chorus.ai', 'Clari Forecasting', 'Looker / Power BI'],
    keyHighlights: [
      'One of the fastest-growing executive tracks in the global B2B SaaS and venture-backed ecosystem',
      'High direct influence on multi-million dollar annual recurring revenue (ARR) growth and investor reporting',
      'Direct pathway to VP of Revenue Operations and Chief Operating Officer (COO)'
    ],
    syllabus: [
      {
        phase: 'Phase 1: RevOps Frameworks & CRM Architecture',
        weeks: 'Weeks 1 - 4',
        topics: ['RevOps foundations: Aligning Marketing, Sales, and CS data models and unified KPIs', 'Configuring deal pipeline stages, mandatory qualification fields (BANT / MEDDIC), and loss reasons in HubSpot/Salesforce', 'Automated lead scoring, enrichment (Clearbit/Apollo), and round-robin routing logic'],
        project: 'Design and configure an end-to-end B2B SaaS Lead-to-Closed-Won CRM Pipeline.'
      },
      {
        phase: 'Phase 2: Forecasting, Sales Comp & Quota Modeling',
        weeks: 'Weeks 5 - 8',
        topics: ['Revenue forecasting methodologies: Historical conversion rates, weighted pipeline, and commit vs best-case buckets', 'Structuring Sales Compensation Plans: On-Target Earnings (OTE), base-to-variable splits, accelerators, and clawback rules', 'Territory planning, account tiering, and capacity planning models in Excel/Google Sheets'],
        project: 'Build a dynamic B2B Sales Quota, Capacity Planning & Commission Model in Excel.'
      },
      {
        phase: 'Phase 3: Retention, Expansion Analytics & Executive Reporting',
        weeks: 'Weeks 9 - 12',
        topics: ['Customer Success operations: Health scores, proactive churn early-warning triggers, and renewal tracking', 'Modeling Net Revenue Retention (NRR), Gross Revenue Retention (GRR), and expansion pipelines', 'Building unified executive RevOps dashboards in Looker/Power BI'],
        project: 'Create a Comprehensive SaaS Revenue Analytics & Pipeline Conversion Executive Dashboard.'
      }
    ],
    jobRoles: [
      { title: 'Sales Operations / RevOps Analyst', salary: '₹7.0L – ₹13.0L', demand: 'Very High' },
      { title: 'Head of Revenue Operations (Director of RevOps)', salary: '₹16.0L – ₹35.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between Gross Revenue Retention (GRR) and Net Revenue Retention (NRR)?',
        answer: 'Gross Revenue Retention (GRR) measures the percentage of recurring revenue retained from existing customers, accounting only for downgrades and churn (cannot exceed 100%). Net Revenue Retention (NRR) includes downgrades and churn PLUS expansion revenue (upsells and cross-sells) from the existing cohort (can exceed 100%, with top SaaS firms targeting 120%+ NRR).'
      }
    ],
    faqs: [
      { question: 'What background is ideal for transitioning into RevOps?', answer: 'Professionals with backgrounds in Sales Operations, Business Analytics, CRM Administration, or Financial Modeling.' }
    ],
    relatedSkills: ['salesforce-administration', 'business-analysis', 'financial-analysis', 'product-analytics']
  },
  {
    slug: 'technical-seo',
    title: 'Technical & Programmatic SEO',
    category: 'business',
    domainSlug: 'business-growth-nocode',
    categoryLabel: 'Business & Growth',
    shortDesc: 'Master Core Web Vitals (INP, LCP), JavaScript rendering, crawl budget optimization, Schema markup, and programmatic SEO.',
    longDesc: 'Technical SEO ensures that search engines can crawl, render, index, and rank web applications at scale. Master Google Core Web Vitals (INP, LCP, CLS), Next.js / React SSR hydration, XML sitemaps, canonicalization, JSON-LD Schema markup, log file analysis, and building 10,000+ programmatic SEO directory pages.',
    heroImage: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'Technical SEO Crawl, Render & Core Web Vitals Engine',
      caption: 'Bot crawler discovery, JavaScript hydration, structured schema indexing, and CWV performance score.',
      imageUrl: '/images/concepts/concept-programmatic-seo.svg',
      keyPoints: [
        { label: 'Crawl Budget Optimization', description: 'Robots.txt directives, status codes (301 vs 302, 410), and internal link equity silos.' },
        { label: 'Core Web Vitals Optimization', description: 'Improving Interaction to Next Paint (INP), Largest Contentful Paint (LCP), and CLS.' },
        { label: 'Structured JSON-LD Schema', description: 'Implementing Rich Snippets for Courses, FAQs, Products, and Organization entities.' },
        { label: 'Programmatic SEO Scaling', description: 'Generating database-driven high-intent landing pages with dynamic metadata.' }
      ]
    },
    salaryRange: '₹5.0L – ₹16.0L LPA',
    minSalaryLPA: 5.0,
    maxSalaryLPA: 16.0,
    averageSalaryLPA: 9.5,
    timelineWeeks: '6 – 8 Weeks',
    hiringVolume: '20,000+ Digital Growth Openings',
    experienceLevel: 'Intermediate',
    topCities: ['Bengaluru', 'Delhi NCR', 'Mumbai', 'Pune', 'Hyderabad', 'Remote'],
    tools: ['Screaming Frog SEO Spider', 'Google Search Console', 'Ahrefs / Semrush', 'Lighthouse / PageSpeed', 'Next.js SEO'],
    keyHighlights: [
      'High-paying technical marketing specialization driving millions of organic visits without paid ad spend',
      'Essential for high-scale e-commerce platforms, media portals, SaaS marketplaces, and directories',
      'High international USD consulting and freelancing demand'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Crawling, Indexing & Server Logs',
        weeks: 'Weeks 1 - 3',
        topics: ['How Googlebot crawls: Rendering budget, Google Search Console coverage reports, and HTTP status codes', 'Screaming Frog audits: Identifying redirect chains, broken links, orphan pages, and canonical loops', 'Server log file analysis: Tracking bot visit frequency and crawling priority on high-value URLs'],
        project: 'Execute a 10,000-page Technical SEO Audit on an e-commerce website and author a remediation report.'
      },
      {
        phase: 'Phase 2: Core Web Vitals, Rendering & Structured Data',
        weeks: 'Weeks 4 - 6',
        topics: ['Optimizing Core Web Vitals: Interaction to Next Paint (INP), Largest Contentful Paint (LCP), and Cumulative Layout Shift (CLS)', 'JavaScript SEO: Client-Side Rendering (CSR) vs Server-Side Rendering (SSR) vs Incremental Static Regeneration (ISR)', 'Advanced JSON-LD Structured Data: Organization, Article, Product, Course, FAQ, and Breadcrumb Schema'],
        project: 'Optimize a Next.js / React application to achieve 95+ PageSpeed scores and valid JSON-LD rich results.'
      },
      {
        phase: 'Phase 3: Programmatic SEO & International Architecture',
        weeks: 'Weeks 7 - 8',
        topics: ['Building Programmatic SEO architectures: Generating dynamic landing pages from PostgreSQL / Supabase datasets', 'International SEO: Hreflang annotations, ccTLDs vs subdirectories, and geo-targeting', 'Entity SEO and semantic topic clustering for Google Helpful Content guidelines'],
        project: 'Build a live Programmatic SEO Directory of 1,000+ local service pages with dynamic metadata.'
      }
    ],
    jobRoles: [
      { title: 'Technical SEO Specialist / Strategist', salary: '₹5.5L – ₹10.5L', demand: 'Very High' },
      { title: 'Head of Organic Growth / SEO Director', salary: '₹12.0L – ₹25.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'What is INP (Interaction to Next Paint) in Google Core Web Vitals and how do you optimize it?',
        answer: 'INP measures page responsiveness by tracking the latency of all user interactions (clicks, taps, key presses) throughout the entire page lifecycle, reporting the single worst latency duration. To optimize INP: (1) Break up long JavaScript tasks using requestAnimationFrame or setTimeout/scheduler.yield(), (2) Minimize main-thread DOM reflows and expensive re-renders, and (3) Defer non-critical third-party scripts.'
      }
    ],
    faqs: [
      { question: 'What is the difference between a 301 and a 302 redirect for SEO?', answer: 'A 301 redirect indicates a permanent move, passing full link equity (PageRank) and replacing the old URL in Google\'s index; a 302 redirect indicates a temporary move, retaining the original URL in search results.' }
    ],
    relatedSkills: ['digital-marketing', 'web-development', 'data-analytics', 'content-strategy']
  },
  {
    slug: 'industrial-automation-plc-scada',
    title: 'Industrial Automation, PLC Programming & SCADA',
    category: 'tech',
    domainSlug: 'industrial-automation-engineering',
    categoryLabel: 'Industrial Tech & Core Engineering',
    shortDesc: 'Program Siemens & Allen-Bradley PLCs, design SCADA telemetry interfaces, HMI touchscreens, and industrial VFDs.',
    longDesc: 'Industrial Automation powers smart manufacturing, automated automotive assembly lines, and process plants. Master PLC programming (Ladder Logic, Structured Text, Function Block Diagrams), SCADA system design (Siemens WinCC, Wonderware, Ignition), HMI touchscreens, Variable Frequency Drives (VFDs), industrial networking (Modbus, Profinet, EtherCAT), and sensor-actuator integration.',
    heroImage: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'Industrial Automation & SCADA Control Architecture',
      caption: 'Field sensors/actuators, PLC real-time logic, HMI operator interface, and enterprise SCADA historian.',
      imageUrl: '/images/concepts/concept-industrial-tech.svg',
      keyPoints: [
        { label: 'PLC Logic Execution (IEC 61131-3)', description: 'Writing Ladder Logic (LD) and Structured Text (ST) for cyclic scan execution.' },
        { label: 'Industrial Fieldbus Networks', description: 'Profinet, Modbus TCP/IP, and EtherCAT connecting VFDs and servo drives.' },
        { label: 'SCADA & Alarm Telemetry', description: 'Real-time graphic mimic displays, historical trending, and safety alarm thresholds.' },
        { label: 'VFD & Servo Motion Control', description: 'Controlling 3-phase motor speed, torque, position, and automated conveyor sorting.' }
      ]
    },
    salaryRange: '₹4.0L – ₹14.0L LPA',
    minSalaryLPA: 4.0,
    maxSalaryLPA: 14.0,
    averageSalaryLPA: 8.5,
    timelineWeeks: '8 – 12 Weeks',
    hiringVolume: '22,000+ Automation Openings across Manufacturing Hubs',
    experienceLevel: 'Fresher Friendly',
    topCities: ['Pune', 'Chennai', 'Ahmedabad', 'Bengaluru', 'NCR / Manesar', 'Coimbatore', 'Jamshedpur'],
    tools: ['Siemens TIA Portal', 'Rockwell Studio 5000 (Allen-Bradley)', 'Inductive Automation Ignition SCADA', 'Schneider SoMachine', 'Modbus Poll'],
    keyHighlights: [
      'Core high-demand technical career for Electrical, Electronics, Instrumentation, and Mechanical engineering graduates',
      'Massive employment scale across automotive manufacturing (Tata Motors, Hyundai, Maruti), pharma plants, and FMCG packaging',
      'Direct pathway to Automation Specialist, Commissioning Engineer, and Plant Engineering Lead'
    ],
    syllabus: [
      {
        phase: 'Phase 1: PLC Hardware, Wiring & Ladder Logic Programming',
        weeks: 'Weeks 1 - 4',
        topics: ['PLC hardware architecture: CPU scan cycles, Digital/Analog I/O modules, power supplies, and wiring diagrams (Sink vs Source)', 'IEC 61131-3 programming languages: Ladder Diagram (LD), Function Block Diagram (FBD), and Structured Text (ST)', 'Timers (TON, TOF, TP), Counters (CTU, CTD), Math instructions, and Memory bit flags in Siemens TIA Portal'],
        project: 'Program an Automated 4-Way Traffic Light System and Conveyor Sorting Logic in TIA Portal.'
      },
      {
        phase: 'Phase 2: HMI Touchscreens, VFDs & Industrial Fieldbus',
        weeks: 'Weeks 5 - 8',
        topics: ['Designing operator Human-Machine Interfaces (HMI): Alarms, pushbuttons, numeric inputs, and trend charts', 'Variable Frequency Drive (VFD) configuration: Motor parameter tuning, acceleration/deceleration ramps, and analog 4-20mA speed control', 'Industrial communication protocols: Modbus RTU/TCP, Profinet, Profibus DP, and industrial Ethernet switches'],
        project: 'Configure a Siemens S7-1200 PLC communicating with a VFD via Modbus TCP with live HMI controls.'
      },
      {
        phase: 'Phase 3: SCADA Systems, Historians & Industry 4.0',
        weeks: 'Weeks 9 - 12',
        topics: ['SCADA development in Ignition / WinCC: Mimic screens, Real-time tags, SQL database logging, and alarm management', 'OPC-UA server-client configuration for cross-vendor machine interoperability', 'Troubleshooting industrial electrical panels, multimeter diagnostics, and commissioning safety interlocks'],
        project: 'Develop a Complete Industrial Water Treatment Plant SCADA System with historical SQL logging and alarms.'
      }
    ],
    jobRoles: [
      { title: 'PLC Programmer / Automation Engineer', salary: '₹4.0L – ₹8.0L', demand: 'Very High' },
      { title: 'Senior SCADA / Automation Project Manager', salary: '₹8.5L – ₹16.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'What is the scan cycle of a Programmable Logic Controller (PLC) and why does scan time matter?',
        answer: 'The PLC scan cycle consists of 3 repeating steps: (1) Input Scan (reads the status of all physical input terminals and copies them to the Input Image Table), (2) Program Execution (executes the user ladder logic line by line using the memory image values), and (3) Output Update (writes the computed results from the Output Image Table to physical output terminals). If the scan time is too long, high-speed sensor pulses (e.g. fast packaging bottles) might be missed.'
      }
    ],
    faqs: [
      { question: 'Which PLC brands are most popular in Indian manufacturing?', answer: 'Siemens (S7-1200 / S7-1500) dominates the Indian market (~50%), followed by Rockwell Allen-Bradley, Schneider Electric, Mitsubishi, and Delta.' }
    ],
    relatedSkills: ['mechatronics', 'cnc-programming', 'cad-cam-engineering', 'automotive-embedded-software']
  },
  {
    slug: 'automotive-embedded-software-autosar',
    title: 'Automotive Embedded Systems & AUTOSAR',
    category: 'tech',
    domainSlug: 'industrial-automation-engineering',
    categoryLabel: 'Industrial Tech & Core Engineering',
    shortDesc: 'Develop automotive ECUs, AUTOSAR Classic/Adaptive software layers, CAN/LIN protocols, and ISO 26262 functional safety.',
    longDesc: 'Automotive Embedded Systems powers modern Electric Vehicles (EVs) and Software-Defined Vehicles (SDVs). Master AUTOSAR Classic & Adaptive architectures, Electronic Control Unit (ECU) firmware in Embedded C, in-vehicle networking (CAN, CAN-FD, LIN, Automotive Ethernet), Diagnostics over IP (DoIP / UDS ISO 14229), and ISO 26262 Functional Safety (ASIL-D).',
    heroImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'AUTOSAR Layered ECU Software Architecture',
      caption: 'Application Software Components (SWC), Runtime Environment (RTE), Basic Software (BSW), and Microcontroller (MCAL).',
      imageUrl: '/images/concepts/concept-industrial-tech.svg',
      keyPoints: [
        { label: 'Application Layer (SWC)', description: 'Sensor fusion and powertrain control algorithms connected via standardized ports.' },
        { label: 'Runtime Environment (RTE)', description: 'Middleware abstraction decoupling applications from underlying ECU hardware.' },
        { label: 'Basic Software (BSW)', description: 'Services, ECU State Management, Memory Stack (NvM), and Communication Stack (Com/CanIf).' },
        { label: 'MCAL Hardware Drivers', description: 'Direct register drivers (ADC, PWM, SPI, CAN) for automotive microcontrollers (Infineon AURIX, NXP).' }
      ]
    },
    salaryRange: '₹6.5L – ₹26.0L LPA',
    minSalaryLPA: 6.5,
    maxSalaryLPA: 26.0,
    averageSalaryLPA: 14.5,
    timelineWeeks: '10 – 14 Weeks',
    hiringVolume: '18,000+ Openings across Automotive Tier-1s & GCCs',
    experienceLevel: 'Intermediate to Advanced',
    topCities: ['Bengaluru', 'Pune', 'Chennai', 'Hyderabad', 'NCR / Gurugram', 'Coimbatore'],
    tools: ['Vector CANoe / CANalyzer', 'Vector DaVinci Developer / Configurator', 'Embedded C / MISRA-C', 'MATLAB Simulink Embedded Coder', 'ETAS INCA'],
    keyHighlights: [
      'One of the highest-paying core engineering domains in India (Bosch, Continental, KPIT, Tata Elxsi, Mercedes R&D)',
      'Massive global transition to Electric Vehicles and Software-Defined Vehicles (SDVs)',
      'Direct pathway to Automotive System Architect, Principal ECU Engineer, and Chief Engineer'
    ],
    syllabus: [
      {
        phase: 'Phase 1: In-Vehicle Networking & Embedded C (MISRA)',
        weeks: 'Weeks 1 - 4',
        topics: ['Controller Area Network (CAN & CAN-FD) physical layer, bit stuffing, arbitration, and DBC database creation', 'LIN, FlexRay, and Automotive Ethernet (SOME/IP) fundamentals', 'Writing safety-critical Embedded C code adhering strictly to MISRA-C:2012 guidelines'],
        project: 'Create a CAN DBC Database and simulate a vehicle speed sensor broadcasting telemetry in Vector CANoe.'
      },
      {
        phase: 'Phase 2: AUTOSAR Classic Architecture & BSW Configuration',
        weeks: 'Weeks 5 - 8',
        topics: ['AUTOSAR 3-layer architecture: Application Layer (SWC), Runtime Environment (RTE), and Basic Software (BSW)', 'Configuring the Communication Stack (CAN Driver -> CanIf -> PduR -> Com) and Memory Stack (NvM -> Fee/Fls)', 'Microcontroller Abstraction Layer (MCAL) drivers for Infineon AURIX TC3xx and NXP S32K'],
        project: 'Configure an AUTOSAR Classic Communication Stack using Vector DaVinci Configurator for an EV Battery ECU.'
      },
      {
        phase: 'Phase 3: UDS Diagnostics, ISO 26262 & HIL Testing',
        weeks: 'Weeks 9 - 14',
        topics: ['Unified Diagnostic Services (UDS - ISO 14229): Diagnostic Trouble Codes (DTCs), Security Access ($27), and flashing routines ($31)', 'ISO 26262 Functional Safety lifecycle: HARA analysis, Safety Goals, and ASIL-A to ASIL-D decomposition', 'Hardware-in-the-Loop (HIL) automated test bench validation with CAPL scripting in CANoe'],
        project: 'Develop automated CAPL test scripts validating UDS diagnostic fault reporting and ASIL-D safety shutoffs.'
      }
    ],
    jobRoles: [
      { title: 'AUTOSAR Software Engineer / Embedded Developer', salary: '₹6.5L – ₹14.0L', demand: 'Very High' },
      { title: 'Senior Automotive Systems Architect / Lead', salary: '₹15.0L – ₹32.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'Explain the purpose and function of the Runtime Environment (RTE) in the AUTOSAR architecture.',
        answer: 'The RTE acts as the communication middleware in AUTOSAR. It completely abstracts the Application Software Components (SWCs) from the underlying hardware and Basic Software (BSW). SWCs communicate through standardized Client-Server and Sender-Receiver ports connected to the RTE. The RTE handles inter-runnable communication within the same ECU (via shared memory/mutex) or routes data through the BSW Com stack to external ECUs over the CAN bus, allowing SWCs to be reused across different microcontrollers without changing application code.'
      }
    ],
    faqs: [
      { question: 'What is the difference between AUTOSAR Classic and AUTOSAR Adaptive?', answer: 'AUTOSAR Classic runs on real-time deterministic microcontrollers with static memory allocation for hard real-time functions (powertrain, brakes); AUTOSAR Adaptive runs on POSIX operating systems (Linux/QNX) on powerful multi-core processors for high-compute functions (ADAS, Infotainment, autonomous driving).' }
    ],
    relatedSkills: ['industrial-automation-plc-scada', 'mechatronics', 'ev-battery-tech', 'cad-cam-engineering']
  }
];
