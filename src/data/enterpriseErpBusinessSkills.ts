import type { SkillDetail } from './skillsData';

export const enterpriseErpBusinessSkills: SkillDetail[] = [
  {
    slug: 'salesforce-administration',
    title: 'Salesforce Administration & Automation (ADM 201)',
    category: 'tech',
    domainSlug: 'business-growth-nocode',
    categoryLabel: 'Enterprise Cloud & ERP',
    shortDesc: 'Master Salesforce Lightning, Flows automation, Security Profiles, Permission Sets, and Sales/Service Cloud.',
    longDesc: 'Salesforce powers the customer relationship management (CRM) of over 150,000 global enterprises. Master Lightning App Builder, Flow Builder automation, Object relationships, Security & Role Hierarchies, Report Types & Dashboards, and prepare for the official Salesforce Administrator (ADM 201) certification.',
    heroImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'Salesforce Enterprise Architecture & Automation Pipeline',
      caption: 'Data model objects, Flow Builder automation, security role hierarchy, and Lightning reporting.',
      imageUrl: '/images/concepts/concept-enterprise-erp.svg',
      keyPoints: [
        { label: 'Custom Objects & Relationships', description: 'Master-Detail, Lookup, and Junction objects creating relational data models.' },
        { label: 'Flow Builder Automation', description: 'Record-triggered, Screen, and Scheduled flows replacing legacy Process Builder and Workflow Rules.' },
        { label: 'Security & Access Architecture', description: 'Org-Wide Defaults (OWD), Role Hierarchy, Profiles, and Permission Set Groups.' },
        { label: 'Analytics & Dashboards', description: 'Cross-object report types, summary matrices, and dynamic executive dashboards.' }
      ]
    },
    salaryRange: '₹5.5L – ₹18.0L LPA',
    minSalaryLPA: 5.5,
    maxSalaryLPA: 18.0,
    averageSalaryLPA: 10.5,
    timelineWeeks: '8 – 12 Weeks',
    hiringVolume: '25,000+ Salesforce Openings in India',
    experienceLevel: 'Fresher Friendly',
    topCities: ['Bengaluru', 'Hyderabad', 'Pune', 'Noida / Delhi NCR', 'Chennai', 'Mumbai', 'Remote'],
    tools: ['Salesforce Lightning', 'Flow Builder', 'Salesforce Data Loader', 'Trailhead', 'Workbench', 'Sales & Service Cloud'],
    keyHighlights: [
      'Massive ecosystem in India with huge hiring across IT consultancies (Accenture, Deloitte, Cognizant, Wipro)',
      'No complex coding required—mastering visual configuration and flows yields high corporate compensation',
      'Direct stepping stone to Salesforce Developer (Apex/LWC) and Salesforce Consultant'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Data Model, Custom Objects & User Management',
        weeks: 'Weeks 1 - 4',
        topics: ['Standard vs Custom Objects, Fields, Picklists, Formula fields, and Validation Rules', 'Relationships: Lookup vs Master-Detail relationships, Roll-up Summary fields, and Schema Builder', 'User setup, License allocation, Login hours, and IP range security restrictions'],
        project: 'Build a Complete Custom Recruitment & Job Application Tracker Data Model in Salesforce.'
      },
      {
        phase: 'Phase 2: Security Model & Flow Builder Automation',
        weeks: 'Weeks 5 - 8',
        topics: ['Salesforce Security: Organization-Wide Defaults (OWD), Role Hierarchy, Profiles vs Permission Sets, and Sharing Rules', 'Flow Builder mastery: Record-Triggered Flows (Before vs After save), Screen Flows, and fault paths', 'Automated approval processes, email alerts, and outbound webhook triggers'],
        project: 'Create a Multi-Step Automated Customer Onboarding & Credit Approval Flow in Flow Builder.'
      },
      {
        phase: 'Phase 3: Data Management, Reports & ADM 201 Certification',
        weeks: 'Weeks 9 - 12',
        topics: ['Data Loader and Data Import Wizard: Mass insert, update, upsert, and export operations', 'Advanced Reporting: Summary, Matrix, and Joined reports with custom Report Types and dynamic Dashboards', 'Sales Cloud (Lead conversion, Opportunity stages) and Service Cloud (Case routing, Queues, Omni-Channel)'],
        project: 'Deploy an Executive Sales Performance & Lead Conversion Dashboard and complete full ADM 201 mock tests.'
      }
    ],
    jobRoles: [
      { title: 'Salesforce Administrator / Consultant', salary: '₹5.5L – ₹10.0L', demand: 'Very High' },
      { title: 'Senior Salesforce Business Analyst / Lead', salary: '₹11.0L – ₹22.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between a Master-Detail relationship and a Lookup relationship in Salesforce?',
        answer: 'In a Master-Detail relationship: (1) The child record\'s lifetime is tied to the parent (if the parent is deleted, all detail records are cascade deleted), (2) The child inherits sharing and security settings directly from the parent, (3) Roll-up summary fields can be created on the master object. In a Lookup relationship: records are loosely coupled, deletion of the parent does not delete the child, security is evaluated independently, and standard roll-up summaries are not supported without flows or custom Apex.'
      }
    ],
    faqs: [
      { question: 'What is the official certification path for Salesforce Admins?', answer: 'The foundational credential is Salesforce Certified Administrator (ADM 201), followed by Advanced Administrator and Salesforce Business Analyst certifications.' }
    ],
    relatedSkills: ['servicenow-development', 'sap-s4hana', 'business-analysis', 'power-platform']
  },
  {
    slug: 'servicenow-development',
    title: 'ServiceNow Development & Administration (CSA / CAD)',
    category: 'tech',
    domainSlug: 'business-growth-nocode',
    categoryLabel: 'Enterprise Cloud & ERP',
    shortDesc: 'Master ServiceNow IT Service Management (ITSM), Flow Designer, Client Scripts, Business Rules, and CMDB.',
    longDesc: 'ServiceNow is the leading enterprise cloud platform orchestrating digital workflows for IT, employees, and customers. Master Incident, Problem, Change, and Service Request Management (ITSM), Configuration Management Database (CMDB), Flow Designer automation, Client Scripts, Business Rules, Script Includes, and prepare for Certified System Administrator (CSA) and Certified Application Developer (CAD).',
    heroImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'ServiceNow Enterprise ITIL Workflow Architecture',
      caption: 'Service Portal catalog intake, Flow Designer execution, Business Rules logic, and CMDB asset updates.',
      imageUrl: '/images/concepts/concept-enterprise-erp.svg',
      keyPoints: [
        { label: 'ITSM Core Modules', description: 'Incident, Problem, Change, and Request Management adhering to ITIL v4 standards.' },
        { label: 'Flow Designer Automation', description: 'No-code process automation, approvals, subflows, and IntegrationHub spokes.' },
        { label: 'JavaScript Scripting', description: 'Client Scripts (onLoad, onChange, onSubmit), UI Policies, Business Rules, and Script Includes.' },
        { label: 'CMDB & Discovery', description: 'Configuration Items (CIs), dependency mapping, and asset lifecycle tracking.' }
      ]
    },
    salaryRange: '₹6.0L – ₹20.0L LPA',
    minSalaryLPA: 6.0,
    maxSalaryLPA: 20.0,
    averageSalaryLPA: 12.0,
    timelineWeeks: '8 – 12 Weeks',
    hiringVolume: '22,000+ ServiceNow Openings across India',
    experienceLevel: 'Intermediate',
    topCities: ['Hyderabad', 'Bengaluru', 'Pune', 'Noida / Delhi NCR', 'Chennai', 'Mumbai', 'Remote'],
    tools: ['ServiceNow Washington/Xanadu Release', 'Flow Designer', 'ServiceNow Studio', 'CMDB', 'Postman REST for ServiceNow'],
    keyHighlights: [
      'One of the highest-paying enterprise platform skills in Indian IT with acute talent shortages',
      'Massive enterprise adoption across Fortune 500 banks, tech giants, and government institutions',
      'Direct pathway to ServiceNow Technical Architect and Implementation Specialist'
    ],
    syllabus: [
      {
        phase: 'Phase 1: ServiceNow Administration & ITSM Core',
        weeks: 'Weeks 1 - 4',
        topics: ['ServiceNow architecture: Tables, Records, Fields, Dictionary overrides, and Form design', 'User administration: Groups, Roles (admin, itil, approver_user), and Access Control Lists (ACLs)', 'ITSM workflows: Incident triage, Problem root-cause investigation, Change advisory board (CAB) approvals, and Service Catalog creation'],
        project: 'Configure an Enterprise Service Catalog with dynamic variables, record producers, and approval flows.'
      },
      {
        phase: 'Phase 2: Flow Designer & JavaScript Scripting',
        weeks: 'Weeks 5 - 8',
        topics: ['Automating multi-system approvals and tasks using Flow Designer and IntegrationHub spokes', 'Client-Side Scripting: Client Scripts (onLoad, onChange, onSubmit), UI Policies, and UI Actions', 'Server-Side Scripting: Business Rules (before, after, async), GlideRecord queries, GlideSystem, and Script Includes'],
        project: 'Develop a custom Employee Asset Allocation Application with automated script includes and GlideAjax.'
      },
      {
        phase: 'Phase 3: CMDB, REST Integrations & CSA/CAD Prep',
        weeks: 'Weeks 9 - 12',
        topics: ['Configuration Management Database (CMDB): Identification and Reconciliation Engine (IRE) and CI relationships', 'REST API integrations: Scripted REST APIs and consuming third-party webhooks (Jira, Slack)', 'Update Sets, Application Repository deployment, and Certified System Administrator (CSA) certification practice'],
        project: 'Build a bi-directional REST Integration syncing ServiceNow Incidents with Jira issues.'
      }
    ],
    jobRoles: [
      { title: 'ServiceNow Administrator / Developer', salary: '₹6.0L – ₹12.0L', demand: 'Very High' },
      { title: 'Senior ServiceNow Technical Architect', salary: '₹14.0L – ₹28.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between a synchronous (before/after) Business Rule and an Async Business Rule in ServiceNow?',
        answer: 'Before/After Business Rules run synchronously within the same user transaction thread—meaning the user\'s screen waits until the script finishes executing, which can degrade user performance if external API calls or heavy loops are performed. Async Business Rules run in the background via the ServiceNow scheduler queue after the database change has been committed, freeing up the user interface immediately for better performance.'
      }
    ],
    faqs: [
      { question: 'What programming language is used in ServiceNow development?', answer: 'ServiceNow development uses modern JavaScript (ECMAScript 2021) for both client-side and server-side script includes and Business Rules.' }
    ],
    relatedSkills: ['salesforce-administration', 'sap-s4hana', 'business-analysis', 'power-platform']
  },
  {
    slug: 'sap-s4hana',
    title: 'SAP S/4HANA Enterprise ERP & FICO / MM',
    category: 'tech',
    domainSlug: 'business-growth-nocode',
    categoryLabel: 'Enterprise Cloud & ERP',
    shortDesc: 'Master SAP S/4HANA in-memory architecture, FICO financial ledger, Procure-to-Pay (MM), and Fiori user apps.',
    longDesc: 'SAP S/4HANA is the world\'s leading enterprise resource planning (ERP) platform running Fortune 500 corporations. Master SAP HANA in-memory database architecture, General Ledger & Asset Accounting (FICO), Material Management (MM) Procure-to-Pay workflows, Sales & Distribution (SD), Master Data Governance (MDG), and SAP Fiori apps.',
    heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'SAP S/4HANA Universal Journal & Process Architecture',
      caption: 'Universal Journal (ACDOCA), FICO general ledger, MM procurement, SD sales, and Fiori dashboard.',
      imageUrl: '/images/concepts/concept-enterprise-erp.svg',
      keyPoints: [
        { label: 'Universal Journal (ACDOCA)', description: 'Single source of financial truth combining General Ledger, Cost Center, and Asset Accounting.' },
        { label: 'Procure-to-Pay (P2P)', description: 'Purchase Requisition -> Purchase Order -> Goods Receipt (MIGO) -> Invoice Verification (MIRO).' },
        { label: 'Order-to-Cash (O2C)', description: 'Sales Order -> Outbound Delivery -> Goods Issue -> Customer Billing.' },
        { label: 'SAP Fiori Experience', description: 'Role-based responsive tiles replacing legacy SAP GUI transaction codes.' }
      ]
    },
    salaryRange: '₹6.5L – ₹24.0L LPA',
    minSalaryLPA: 6.5,
    maxSalaryLPA: 24.0,
    averageSalaryLPA: 14.0,
    timelineWeeks: '8 – 12 Weeks',
    hiringVolume: '28,000+ SAP Openings across Indian IT & GCCs',
    experienceLevel: 'Intermediate',
    topCities: ['Bengaluru', 'Hyderabad', 'Pune', 'Mumbai', 'Noida / Delhi NCR', 'Chennai', 'Kolkata'],
    tools: ['SAP S/4HANA Cloud', 'SAP GUI & SAP Fiori', 'SAP FICO & MM Modules', 'SAP Solution Manager', 'ABAP Core / CDS Views'],
    keyHighlights: [
      'High corporate prestige and global consulting career track (Accenture, Deloitte, IBM, Infosys, Capgemini)',
      'Global mandate: Millions of legacy SAP ECC systems must migrate to S/4HANA by 2027, creating massive demand',
      'Direct pathway into SAP Functional Consultant, Solution Architect, and Enterprise ERP Director'
    ],
    syllabus: [
      {
        phase: 'Phase 1: SAP S/4HANA Fundamentals & Financials (FICO)',
        weeks: 'Weeks 1 - 4',
        topics: ['SAP S/4HANA architecture: In-memory column store database and the Universal Journal (Table ACDOCA)', 'Financial Accounting (FI): General Ledger (G/L), Accounts Payable (AP), Accounts Receivable (AR), and Asset Accounting (AA)', 'Controlling (CO): Cost Center Accounting, Profit Center Accounting, and Internal Orders'],
        project: 'Configure a Complete Company Code, Chart of Accounts, and Fiscal Year Variant in SAP S/4HANA.'
      },
      {
        phase: 'Phase 2: Materials Management (MM) & Procure-to-Pay',
        weeks: 'Weeks 5 - 8',
        topics: ['MM Enterprise Structure: Plant, Storage Location, and Purchasing Organization setup', 'Material Master, Vendor Master (Business Partner - BP in S/4HANA), and Purchasing Info Records', 'Procure-to-Pay (P2P) cycle: Purchase Requisition (PR), Purchase Order (PO), Goods Receipt (MIGO), and Invoice Verification (MIRO)'],
        project: 'Execute an end-to-end Procure-to-Pay (P2P) Procurement Workflow with 3-way invoice matching in SAP.'
      },
      {
        phase: 'Phase 3: Integration, Fiori Apps & Migration Projects',
        weeks: 'Weeks 9 - 12',
        topics: ['FI-MM and FI-SD automatic account determination (OBYC and VKOA configuration)', 'SAP Fiori Launchpad administration, analytical apps, and custom tile configuration', 'SAP Activate methodology: S/4HANA Greenfield vs Brownfield system conversion steps'],
        project: 'Perform complete automatic account determination (OBYC) configuration and test full transaction postings.'
      }
    ],
    jobRoles: [
      { title: 'SAP Functional Consultant (FICO / MM)', salary: '₹6.5L – ₹13.0L', demand: 'Very High' },
      { title: 'Senior SAP S/4HANA Solution Architect', salary: '₹15.0L – ₹30.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'What is the Universal Journal (Table ACDOCA) in SAP S/4HANA and how does it differ from legacy SAP ECC?',
        answer: 'In legacy SAP ECC, financial data was fragmented across separate tables for General Ledger (BSEG/BSIS), Cost Accounting (COEP), Asset Accounting (ANEP), and Profitability Analysis (CE1). In SAP S/4HANA, all financial and managerial accounting data is unified into a single database table called ACDOCA (Universal Journal). This eliminates redundancy, eliminates month-end reconciliation between FI and CO, and enables real-time financial reporting.'
      }
    ],
    faqs: [
      { question: 'What is the Business Partner (BP) concept in S/4HANA?', answer: 'In S/4HANA, the legacy separate transaction codes for Customers (XD01) and Vendors (XK01) are obsolete. All entities are created under the unified Business Partner (BP) transaction code with distinct roles assigned.' }
    ],
    relatedSkills: ['financial-accounting', 'salesforce-administration', 'servicenow-development', 'supply-chain-analytics']
  },
  {
    slug: 'power-platform',
    title: 'Microsoft Power Platform & Power Automate',
    category: 'tech',
    domainSlug: 'business-growth-nocode',
    categoryLabel: 'Enterprise Cloud & ERP',
    shortDesc: 'Build enterprise Canvas Apps, Model-Driven Apps, Power Automate cloud/desktop RPA flows, and Dataverse tables (PL-900 / PL-100).',
    longDesc: 'Microsoft Power Platform empowers organizations to build custom business apps and automated workflows rapidly. Master Canvas Apps, Model-Driven Apps in Microsoft Dataverse, Power Automate cloud & desktop RPA flows, Copilot Studio chatbot assistants, Power Pages external portals, and Power BI report embeddings.',
    heroImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'Microsoft Power Platform Enterprise Architecture',
      caption: 'Dataverse backend, Canvas mobile apps, Model-driven web apps, Power Automate RPA, and Power BI dashboards.',
      imageUrl: '/images/concepts/concept-enterprise-erp.svg',
      keyPoints: [
        { label: 'Microsoft Dataverse', description: 'Enterprise relational data layer with role-based security, business rules, and audit logging.' },
        { label: 'Canvas Apps', description: 'Pixel-perfect mobile and tablet applications using Power Fx Excel-like formulas.' },
        { label: 'Power Automate RPA', description: 'Automating multi-system approvals, email parsing, and legacy desktop screen scraping.' },
        { label: 'Copilot Studio Assistants', description: 'Deploying conversational AI bots answering internal enterprise employee queries.' }
      ]
    },
    salaryRange: '₹5.0L – ₹16.0L LPA',
    minSalaryLPA: 5.0,
    maxSalaryLPA: 16.0,
    averageSalaryLPA: 9.8,
    timelineWeeks: '6 – 10 Weeks',
    hiringVolume: '20,000+ Openings across IT Services & Enterprises',
    experienceLevel: 'Fresher Friendly',
    topCities: ['Bengaluru', 'Hyderabad', 'Pune', 'Noida / Delhi NCR', 'Mumbai', 'Chennai', 'Remote'],
    tools: ['Power Apps', 'Power Automate Desktop (RPA)', 'Microsoft Dataverse', 'Copilot Studio', 'Power Pages', 'Power Fx'],
    keyHighlights: [
      'High-growth low-code enterprise development ecosystem powered by Microsoft 365 and Azure integrations',
      'Rapidly builds enterprise solutions 5x faster than traditional custom code',
      'Direct pathway into Power Platform Developer, Low-Code Architect, and Digital Transformation Lead'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Microsoft Dataverse & Canvas App Development',
        weeks: 'Weeks 1 - 3',
        topics: ['Dataverse architecture: Tables, Columns, Relationships (1:N, N:N), Choice columns, and Business Rules', 'Building pixel-perfect Canvas Apps using Power Fx functions (Filter, LookUp, Patch, Collect, Navigate)', 'Connecting Canvas Apps to SharePoint Lists, SQL Server, and custom REST API connectors'],
        project: 'Build a Mobile-Responsive Employee Expense Approval & Receipt Scanner Canvas App.'
      },
      {
        phase: 'Phase 2: Model-Driven Apps & Power Automate Cloud Flows',
        weeks: 'Weeks 4 - 7',
        topics: ['Designing Model-Driven Apps: Forms, Views, Dashboards, and Business Process Flows (BPF)', 'Power Automate Cloud Flows: Automated triggers, Multi-tier approval workflows, and condition branches', 'Error handling: Scope actions, Configure Run After settings, and Microsoft 365 Outlook/Teams alerts'],
        project: 'Create a Model-Driven IT Helpdesk & Hardware Requisition System with automated multi-tier approval flows.'
      },
      {
        phase: 'Phase 3: Robotic Process Automation (RPA) & Copilot Studio',
        weeks: 'Weeks 8 - 10',
        topics: ['Power Automate Desktop (RPA): UI automation, web data scraping, Excel macro triggers, and legacy terminal automation', 'Building custom AI Copilot chatbots in Microsoft Copilot Studio connected to SharePoint document libraries', 'Environment Lifecycle Management (ALM): Solutions, export/import pipelines, and environment variables'],
        project: 'Deploy an Unattended Desktop RPA Bot automating invoice extraction from PDFs into a legacy accounting portal.'
      }
    ],
    jobRoles: [
      { title: 'Power Platform Developer / Consultant', salary: '₹5.0L – ₹10.5L', demand: 'Very High' },
      { title: 'Senior Low-Code Solutions Architect', salary: '₹12.0L – ₹24.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between a Canvas App and a Model-Driven App in Microsoft Power Apps?',
        answer: 'Canvas Apps start with a blank canvas and offer complete pixel-perfect drag-and-drop UI control using Power Fx formulas, connecting to 1000+ diverse data sources (SharePoint, SQL, Excel). Model-Driven Apps start from the data model in Microsoft Dataverse, automatically generating responsive, standardized enterprise forms, views, and business process flows with deep relational security, though with less custom visual UI control.'
      }
    ],
    faqs: [
      { question: 'What is Power Fx in Power Platform?', answer: 'Power Fx is Microsoft\'s open-source, low-code programming language based on familiar Microsoft Excel formula syntax, used across Power Apps and Dataverse.' }
    ],
    relatedSkills: ['salesforce-administration', 'servicenow-development', 'data-analytics', 'business-analysis']
  }
];
