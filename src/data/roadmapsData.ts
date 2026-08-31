export interface RoadmapPhase {
  phaseTitle: string;
  duration: string;
  badgeColor: string;
  description: string;
  milestones: string[];
  projectIdea: string;
  resources: { name: string; type: string }[];
}

export interface RoadmapDetail {
  slug: string;
  title: string;
  category: 'tech' | 'business' | 'vocational';
  categoryLabel: string;
  targetRole: string;
  duration: string;
  weeklyCommitment: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  heroImage: string;
  overview: string;
  salaryExpectation: string;
  phases: RoadmapPhase[];
  careerTransitions: {
    from: string;
    to: string;
    advantage: string;
  }[];
  checklist: string[];
}

export const roadmapsData: RoadmapDetail[] = [
  {
    slug: 'data-analytics-plan',
    title: 'Data Analytics & Power BI 14-Week Blueprint',
    category: 'tech',
    categoryLabel: 'High-Demand Tech',
    targetRole: 'Junior BI Developer / Business Data Analyst',
    duration: '14 Weeks',
    weeklyCommitment: '10 – 12 Hours / Week',
    difficulty: 'Beginner',
    heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
    overview: 'This 14-week zero-to-hire blueprint takes you step-by-step from raw spreadsheet data to building interactive executive Power BI dashboards with complex DAX measures, automated SQL data pipelines, and a verified GitHub/NovyPro portfolio.',
    salaryExpectation: '₹5.5L – ₹14.0L LPA',
    phases: [
      {
        phaseTitle: 'Phase 1: Advanced Excel & Relational SQL Core',
        duration: 'Weeks 1 – 4',
        badgeColor: 'brand',
        description: 'Build an unshakeable foundation in Excel lookups, pivot calculations, and multi-table relational SQL query optimization.',
        milestones: [
          'Master XLOOKUP, INDEX-MATCH, and nested dynamic arrays (FILTER, UNIQUE)',
          'SQL SELECT, GROUP BY, HAVING, subqueries, and table joins (INNER, LEFT, FULL)',
          'Window functions: DENSE_RANK(), ROW_NUMBER(), LEAD(), LAG(), and PARTITION BY',
          'Database normalization (1NF to 3NF) and indexing basics'
        ],
        projectIdea: 'Indian E-Commerce Sales SQL Analysis: Query 100k customer order records on Kaggle to calculate regional churn, monthly retention, and revenue per category.',
        resources: [
          { name: 'SQL for Data Analysis Guide', type: 'Interactive Tutorial' },
          { name: 'LeetCode Top 50 SQL Study Plan', type: 'Practice' }
        ]
      },
      {
        phaseTitle: 'Phase 2: Power BI, DAX & Dimensional Data Modeling',
        duration: 'Weeks 5 – 9',
        badgeColor: 'purple',
        description: 'Connect heterogeneous data sources, construct Star Schema data models, and write advanced DAX formulas for dynamic executive KPIs.',
        milestones: [
          'Power Query ETL: Unpivoting, merging, appending, and automated data cleaning',
          'Star Schema architecture, fact vs dimension tables, and relationship cardinality',
          'DAX fundamentals: CALCULATE, ALL, FILTER, VALUES, and Time-Intelligence (YTD, SAMEPERIODLASTYEAR)',
          'Custom visual themes, tooltips, drill-through pages, and Row-Level Security (RLS)'
        ],
        projectIdea: 'Swiggy / Zomato Hyperlocal Delivery Analytics: Build an interactive executive dashboard showing delivery time SLAs, rider payouts, and restaurant commission margins.',
        resources: [
          { name: 'DAX.guide Reference Manual', type: 'Documentation' },
          { name: 'NovyPro Dashboard Hosting', type: 'Portfolio Platform' }
        ]
      },
      {
        phaseTitle: 'Phase 3: Python Pandas, Portfolio Deployment & Interview Pitch',
        duration: 'Weeks 10 – 14',
        badgeColor: 'emerald',
        description: 'Learn exploratory data analysis in Python, bundle your live projects into a standalone portfolio, and drill top Indian MNC interview questions.',
        milestones: [
          'Python Pandas & NumPy for handling missing values and outlier detection',
          'Matplotlib & Seaborn for exploratory data visualization',
          'Publish 3 polished case studies on GitHub with clear README problem statements and NovyPro embeds',
          'Optimize LinkedIn & Naukri profiles with target data analyst keywords'
        ],
        projectIdea: 'FinTech Credit Risk & Loan Default Predictor: Perform exploratory analysis on Indian banking micro-loans to identify default indicators.',
        resources: [
          { name: 'Kaggle Datasets & Notebooks', type: 'Dataset Repository' },
          { name: 'ATS Resume Data Analyst Template', type: 'Template' }
        ]
      }
    ],
    careerTransitions: [
      { from: 'B.Com / Finance Graduate', to: 'Financial BI Analyst', advantage: 'Strong domain understanding of P&L and Balance Sheet metrics accelerates DAX KPI creation.' },
      { from: 'Manual QA / Testing', to: 'Data Quality Analyst', advantage: 'Test-case thinking translates directly into SQL data validation and integrity verification.' },
      { from: 'Non-Tech Operations', to: 'Operations Business Analyst', advantage: 'Deep familiarity with ground workflows allows crafting actionable operational dashboards.' }
    ],
    checklist: [
      'Completed 50+ medium LeetCode/HackerRank SQL problems',
      'Built and hosted 3 distinct Power BI dashboards on NovyPro',
      'Created a single-column ATS resume highlighting quantifiable business impact',
      'Set up daily job alerts on Naukri, Instahyre, and LinkedIn'
    ]
  },
  {
    slug: 'fullstack-dev-plan',
    title: 'Full-Stack Web Dev (Next.js & MERN) 18-Week Blueprint',
    category: 'tech',
    categoryLabel: 'Evergreen IT Core',
    targetRole: 'Junior Software Engineer / Full-Stack Developer',
    duration: '18 Weeks',
    weeklyCommitment: '15 Hours / Week',
    difficulty: 'Intermediate',
    heroImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=900&q=80',
    overview: 'Go from basic HTML/CSS to shipping full-stack production SaaS applications with Next.js App Router, Tailwind CSS, Node.js/PostgreSQL, authentication, Razorpay payments, and automated CI/CD cloud deployments.',
    salaryExpectation: '₹4.8L – ₹18.0L LPA',
    phases: [
      {
        phaseTitle: 'Phase 1: Modern JS, React & Responsive Tailwind',
        duration: 'Weeks 1 – 6',
        badgeColor: 'brand',
        description: 'Master ES6+ asynchronous JavaScript, component lifecycles, custom React hooks, and sleek mobile-first design systems.',
        milestones: [
          'ES6+ closures, promises, async/await, and event loops',
          'React functional components, useState, useEffect, useMemo, custom hooks',
          'Tailwind CSS grid, flexbox, transitions, dark mode, and glassmorphism styling',
          'Git version control, feature branches, and pull request workflows'
        ],
        projectIdea: 'Zerodha / Groww Trading Terminal Simulator: Real-time stock search, interactive portfolio charts, and dynamic buy/sell orders in React.',
        resources: [
          { name: 'JavaScript.info Guide', type: 'Documentation' },
          { name: 'React Official Documentation', type: 'Interactive Guide' }
        ]
      },
      {
        phaseTitle: 'Phase 2: Backend REST APIs & Relational PostgreSQL',
        duration: 'Weeks 7 – 12',
        badgeColor: 'purple',
        description: 'Design robust backend architectures with Node.js/Express, relational database schemas, Prisma ORM, and JWT authentication.',
        milestones: [
          'RESTful API design conventions, middleware chains, error handling',
          'PostgreSQL schema modeling, foreign keys, indexes, and Prisma ORM migrations',
          'JWT authentication, bcrypt password hashing, and role-based access control (RBAC)',
          'Input validation with Zod and API rate limiting'
        ],
        projectIdea: 'Indian Multi-Tenant Invoicing SaaS: REST API supporting GST tax calculations, invoice PDF generation, and automated email dispatches.',
        resources: [
          { name: 'Prisma ORM Docs', type: 'Documentation' },
          { name: 'Postman API Testing Suites', type: 'Tool' }
        ]
      },
      {
        phaseTitle: 'Phase 3: Next.js App Router, Razorpay & Production Cloud',
        duration: 'Weeks 13 – 18',
        badgeColor: 'emerald',
        description: 'Harness Next.js Server Components, Server Actions, webhook payment integrations, and deploy containerized apps to production.',
        milestones: [
          'Next.js 14/15 App Router, Server Actions, dynamic caching, and SEO metadata',
          'Razorpay / Stripe Webhook payment gateway integration with order verification',
          'Docker containerization and multi-stage Dockerfiles',
          'Deploying to Vercel and AWS, setting up GitHub Actions automated CI/CD'
        ],
        projectIdea: 'Full Production EdTech Platform: Video lessons, Razorpay course checkout, student dashboard, and automated invoice delivery.',
        resources: [
          { name: 'Next.js App Router Documentation', type: 'Documentation' },
          { name: 'Razorpay Developer Hub', type: 'API Reference' }
        ]
      }
    ],
    careerTransitions: [
      { from: 'Frontend / HTML-CSS Coder', to: 'Full-Stack Developer', advantage: 'Existing visual design skills make learning backend API consumption fast.' },
      { from: 'Java / Python Core Student', to: 'Next.js Full-Stack Engineer', advantage: 'Strong programming foundations ease TypeScript and asynchronous logic.' }
    ],
    checklist: [
      'Deployed at least 2 full-stack web applications with live working URLs',
      'Clean GitHub profile with consistent commit activity and detailed READMEs',
      'Integrated live Razorpay test-mode checkout in a production demo',
      'Proficient in explaining React rendering lifecycle and Next.js Server Components in interviews'
    ]
  },
  {
    slug: 'freelancing-upwork-plan',
    title: 'Upwork & Global Freelancing 8-Week Blueprint',
    category: 'business',
    categoryLabel: 'Earn in USD from India',
    targetRole: 'Independent Remote Contractor / Freelance Specialist',
    duration: '8 Weeks',
    weeklyCommitment: '8 Hours / Week',
    difficulty: 'Beginner',
    heroImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
    overview: 'Break into high-paying international freelancing. Win your first 3 overseas clients on Upwork/Fiverr ($500+ milestones), master proposal copywriting, receive USD seamlessly via Wise, and set up 0% GST export compliance.',
    salaryExpectation: '₹80,000 – ₹3,50,000 / Month in USD',
    phases: [
      {
        phaseTitle: 'Phase 1: High-Ticket Niche Positioning & Case Studies',
        duration: 'Weeks 1 – 2',
        badgeColor: 'brand',
        description: 'Position your profile as a specialized problem solver rather than a generic generalist.',
        milestones: [
          'Choose a specific niche (e.g., "Next.js Speed Optimization for Shopify Brands")',
          'Craft an Upwork profile title and bio focused on client ROI and turnaround speed',
          'Upload 3 visual case studies structured as: Client Problem -> Your Implementation -> Quantifiable Results',
          'Record a clean 60-second Loom introduction video showcasing your screen and personality'
        ],
        projectIdea: 'Build a polished personal one-page portfolio and 3 before/after case studies.',
        resources: [
          { name: 'Upwork Profile Optimization Checklist', type: 'Guide' },
          { name: 'Loom Video Recording', type: 'Tool' }
        ]
      },
      {
        phaseTitle: 'Phase 2: The "First 2 Lines" Proposal Formula & Bidding',
        duration: 'Weeks 3 – 5',
        badgeColor: 'purple',
        description: 'Learn the exact bidding strategy that yields 80%+ proposal view rates and booked discovery calls.',
        milestones: [
          'Never start with "Hello, I am an expert with 5 years experience..."',
          'Address the client’s exact problem in Line 1 (e.g., "Saw your Next.js hydration error on checkout...")',
          'Attach a 45-second custom Loom video demonstrating the fix',
          'Submit 2–3 high-intent proposals daily during US/UK morning hours (6:00 PM – 10:00 PM IST)'
        ],
        projectIdea: 'Submit 20 tailored proposals and secure your first 3 international client interviews.',
        resources: [
          { name: 'High-Converting Proposal Swipe File', type: 'Templates' }
        ]
      },
      {
        phaseTitle: 'Phase 3: Indian Inward Remittance, Wise & 0% GST LUT',
        duration: 'Weeks 6 – 8',
        badgeColor: 'emerald',
        description: 'Set up seamless cross-border payments, bank integrations, and legal Indian tax compliance.',
        milestones: [
          'Configure Wise Business / Direct Local Bank Transfer for maximum USD-INR exchange rate retention',
          'Obtain Foreign Inward Remittance Certificates (FIRC / FIRS) for every payment',
          'File for Letter of Undertaking (LUT) on the GST Portal to legally export services at 0% GST',
          'Leverage Section 44ADA presumptive taxation (pay tax on only 50% of gross freelance receipts)'
        ],
        projectIdea: 'Set up complete legal and banking operations ready to invoice global clients.',
        resources: [
          { name: 'GST Portal LUT Filing Manual', type: 'Compliance Guide' },
          { name: 'Wise Business Setup', type: 'FinTech Platform' }
        ]
      }
    ],
    careerTransitions: [
      { from: 'Indian IT Employee (₹30k/mo)', to: 'US Remote Freelancer ($2,500/mo)', advantage: 'Currency arbitrage allows earning 4x–5x more with flexible remote hours.' },
      { from: 'College Student / Fresher', to: 'Global Micro-Agency Founder', advantage: 'Zero legacy overhead allows pitching competitive rates with rapid turnaround.' }
    ],
    checklist: [
      'Upwork Profile approved at 100% completeness with Top-Rated pathway',
      'Submitted 20+ personalized proposals with Loom screen recording attachments',
      'Wise account verified with local USD/EUR/GBP receiving bank accounts',
      'Applied for GST LUT online for zero-rated service export compliance'
    ]
  },
  {
    slug: 'tally-gst-plan',
    title: 'Tally Prime & GST Accounting 6-Week Blueprint',
    category: 'vocational',
    categoryLabel: 'Massive MSME Hiring',
    targetRole: 'Junior Accountant / Commercial Executive in MSME',
    duration: '6 Weeks',
    weeklyCommitment: '8 Hours / Week',
    difficulty: 'Beginner',
    heroImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80',
    overview: 'Learn practical statutory accounting in Tally Prime 4.0. Master voucher entries (Purchase, Sales, Payment), E-Way bill generation, GSTR-1 and GSTR-3B tax returns, TDS calculations, and bank reconciliation.',
    salaryExpectation: '₹2.8L – ₹7.5L LPA',
    phases: [
      {
        phaseTitle: 'Phase 1: Company Setup & Core Ledger Accounting',
        duration: 'Weeks 1 – 2',
        badgeColor: 'brand',
        description: 'Set up trading companies, chart of accounts, and process daily business vouchers.',
        milestones: [
          'Company creation and statutory GSTIN configuration in Tally Prime',
          'Voucher types: Contra (F4), Payment (F5), Receipt (F6), Journal (F7), Sales (F8), Purchase (F9)',
          'Managing inventory stock items, units of measure, and godown allocations',
          'Generating Day Book, Cash Book, and Ledger balance summaries'
        ],
        projectIdea: 'Process 50 real-world commercial transaction vouchers for an Indian wholesale trader.',
        resources: [
          { name: 'Tally Prime 4.0 Official Guide', type: 'Documentation' }
        ]
      },
      {
        phaseTitle: 'Phase 2: GST Compliance, E-Invoicing & E-Way Bills',
        duration: 'Weeks 3 – 4',
        badgeColor: 'purple',
        description: 'Configure multi-tier GST slabs (5%, 12%, 18%, 28%), generate e-invoices, and reconcile Input Tax Credit (ITC).',
        milestones: [
          'Configuring CGST, SGST, IGST tax ledgers by HSN/SAC codes',
          'Generating E-Way bills and JSON e-invoices directly from Tally Prime',
          'GSTR-1 outward supply JSON export and error validation',
          'Reconciling purchase invoices with GSTR-2B to maximize legal ITC claims'
        ],
        projectIdea: 'Complete Monthly GST Return Filing & Input Tax Credit Reconciliation File.',
        resources: [
          { name: 'GST Portal Offline Utility', type: 'Government Software' }
        ]
      },
      {
        phaseTitle: 'Phase 3: TDS, Payroll, BRS & Balance Sheet Finalization',
        duration: 'Weeks 5 – 6',
        badgeColor: 'emerald',
        description: 'Execute contractor TDS deductions, auto bank reconciliation, and balance sheet preparation for CA audit.',
        milestones: [
          'Section 194C (Contractors), 194J (Professional fees), and 194I (Rent) TDS deductions',
          'Employee payroll vouchers, PF (12%), and ESI statutory deductions',
          'Auto Bank Reconciliation (BRS) with Excel bank statement import',
          'Finalizing Trial Balance, Profit & Loss Statement, and Balance Sheet'
        ],
        projectIdea: 'End-of-Year Financial Accounts Closure & Audit Ready Balance Sheet.',
        resources: [
          { name: 'TRACES TDS Portal Guide', type: 'Tax Manual' }
        ]
      }
    ],
    careerTransitions: [
      { from: 'B.Com / Arts Fresher', to: 'Junior MSME Accountant', advantage: 'Immediate employment across 6.3 Crore MSMEs and CA firms in every Indian district.' },
      { from: 'Retail Shop Assistant', to: 'Independent Bookkeeper', advantage: 'Handling books for 4–5 local stores easily yields ₹25k–₹40k monthly side income.' }
    ],
    checklist: [
      'Proficient in rapid 10-key numeric keypad voucher entry without mouse dependence',
      'Successfully generated and exported GSTR-1 and GSTR-3B JSON return files',
      'Completed 3 end-to-end Bank Reconciliations with zero variance',
      'Ready to assist CA firms during monthly GST filing cycles (10th – 20th of every month)'
    ]
  },
  {
    slug: 'ai-prompt-engineer-plan',
    title: 'AI Automation & Prompt Engineering 10-Week Blueprint',
    category: 'tech',
    categoryLabel: 'AI Tools & Automation',
    targetRole: 'AI Workflow Developer / Prompt & Automation Architect',
    duration: '10 Weeks',
    weeklyCommitment: '12 Hours / Week',
    difficulty: 'Intermediate',
    heroImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80',
    overview: 'Go beyond ChatGPT chats into building production AI applications. Architect Retrieval-Augmented Generation (RAG) vector pipelines, orchestrate multi-agent workflows with LangChain, and leverage Cursor AI for 5x engineering throughput.',
    salaryExpectation: '₹8.0L – ₹24.0L LPA',
    phases: [
      {
        phaseTitle: 'Phase 1: LLM APIs, Structured Outputs & System Prompts',
        duration: 'Weeks 1 – 3',
        badgeColor: 'brand',
        description: 'Master OpenAI and Claude API integrations, JSON mode, few-shot prompt crafting, and token budgeting.',
        milestones: [
          'Chain-of-thought, few-shot prompting, and XML structural boundaries',
          'OpenAI & Claude API parameters (temperature, top_p, max_tokens)',
          'Enforcing strict JSON outputs with Pydantic schemas',
          'Token cost estimation and rate limit backoff algorithms'
        ],
        projectIdea: 'Customer Escalation Triage Bot that analyzes incoming support emails, classifies urgency, and outputs structured JSON action items.',
        resources: [
          { name: 'Anthropic Prompt Engineering Interactive Tutorial', type: 'Documentation' }
        ]
      },
      {
        phaseTitle: 'Phase 2: RAG Pipelines & Vector Database Retrieval',
        duration: 'Weeks 4 – 7',
        badgeColor: 'purple',
        description: 'Build real-time knowledge retrieval engines connecting proprietary PDF documents, Notion pages, and SQL databases.',
        milestones: [
          'Text embeddings (text-embedding-3-small, Cohere Embed)',
          'Chunking strategies (recursive character splitting, semantic chunking)',
          'Vector database indexing and hybrid search (Pinecone, ChromaDB, PGVector)',
          'Re-ranking search results with Cohere Re-rank for high contextual precision'
        ],
        projectIdea: 'Indian Tax & Legal Circulars Assistant: Ask complex GST/RBI questions and get exact citation answers with page references.',
        resources: [
          { name: 'Pinecone Vector Search Handbook', type: 'Guide' }
        ]
      },
      {
        phaseTitle: 'Phase 3: Autonomous Multi-Agents & Production Deployment',
        duration: 'Weeks 8 – 10',
        badgeColor: 'emerald',
        description: 'Orchestrate agents capable of calling external APIs, browsing the web, and executing automated multi-step workflows.',
        milestones: [
          'LangGraph / CrewAI multi-agent state machines and human-in-the-loop approvals',
          'Tool calling (function calling) with custom Python scripts and REST APIs',
          'Prompt injection defense (input validation, system prompt delimiters)',
          'Evaluating RAG quality using Ragas (Faithfulness, Answer Relevance)'
        ],
        projectIdea: 'Automated Competitor Pricing Agent: Scrapes competitor product prices daily, analyzes shifts, and drafts an executive briefing deck.',
        resources: [
          { name: 'LangChain Documentation', type: 'Documentation' }
        ]
      }
    ],
    careerTransitions: [
      { from: 'Traditional Software Developer', to: 'Generative AI Engineer', advantage: 'Existing programming skills make API integration and vector database queries second nature.' },
      { from: 'Content / Product Strategist', to: 'AI Automation Consultant', advantage: 'Strong domain understanding of workflow bottlenecks enables designing high-ROI bots.' }
    ],
    checklist: [
      'Built and deployed a live RAG chatbot with verifiable source citations',
      'Implemented structured JSON output extraction with Pydantic validation',
      'Configured automated multi-agent tasks with LangGraph or CrewAI',
      'Published code repositories on GitHub with clean architectural diagrams'
    ]
  },
  {
    slug: 'cloud-devops-plan',
    title: 'Cloud Architecture & DevOps 16-Week Blueprint',
    category: 'tech',
    categoryLabel: 'Enterprise Cloud & SRE',
    targetRole: 'DevOps Engineer / Cloud Infrastructure Architect',
    duration: '16 Weeks',
    weeklyCommitment: '14 Hours / Week',
    difficulty: 'Advanced',
    heroImage: 'https://images.unsplash.com/photo-1618401471353-b98aedd04e11?auto=format&fit=crop&w=900&q=80',
    overview: 'Master modern cloud automation. Provision multi-tier infrastructure on AWS with Terraform, package containerized microservices with Docker, orchestrate production Kubernetes clusters, and build automated CI/CD pipelines.',
    salaryExpectation: '₹8.5L – ₹28.0L LPA',
    phases: [
      {
        phaseTitle: 'Phase 1: Linux Administration & Shell Scripting',
        duration: 'Weeks 1 – 4',
        badgeColor: 'brand',
        description: 'Build enterprise Linux server management and automated Bash scripting capabilities.',
        milestones: [
          'Linux user permissions, SSH key pairs, systemd services, and cron jobs',
          'Networking diagnostics: netstat, iptables, curl, dig, and DNS resolution',
          'Bash automation scripts for log rotation and automated database backups',
          'Git branching models (GitFlow, trunk-based development)'
        ],
        projectIdea: 'Automated Multi-Server Provisioning & Health-Monitoring Bash Script with Telegram/Slack alerts.',
        resources: [{ name: 'Linux Command Line Handbook', type: 'Guide' }]
      },
      {
        phaseTitle: 'Phase 2: Docker Containers & CI/CD Automation',
        duration: 'Weeks 5 – 9',
        badgeColor: 'purple',
        description: 'Containerize microservices, optimize Docker image layers, and build automated test-and-deploy pipelines in GitHub Actions.',
        milestones: [
          'Multi-stage Dockerfiles and container image security scanning',
          'Docker Compose multi-container local environments (Web + DB + Redis)',
          'GitHub Actions CI/CD workflows: Automated linting, testing, Docker build and push to Amazon ECR',
          'Zero-downtime Blue-Green deployment principles'
        ],
        projectIdea: 'Complete Automated Continuous Integration & Delivery Pipeline for a Node/Postgres application.',
        resources: [{ name: 'Docker Deep Dive', type: 'Documentation' }]
      },
      {
        phaseTitle: 'Phase 3: Kubernetes (K8s), Terraform & Cloud Observability',
        duration: 'Weeks 10 – 16',
        badgeColor: 'emerald',
        description: 'Orchestrate production Kubernetes clusters and manage infrastructure as code on AWS with Terraform.',
        milestones: [
          'Kubernetes Pods, Deployments, Services, Ingress, ConfigMaps, and Secrets',
          'Terraform modular infrastructure provisioning on AWS (VPC, EKS, RDS, S3)',
          'Prometheus metric collection and Grafana alert dashboards',
          'Certified Kubernetes Administrator (CKA) exam practice drills'
        ],
        projectIdea: 'Production-Grade Kubernetes Microservice Cluster on AWS EKS with Autoscaling & Grafana Monitoring.',
        resources: [{ name: 'CKA Practice Labs', type: 'Certification' }]
      }
    ],
    careerTransitions: [
      { from: 'Linux Sysadmin / Network Engineer', to: 'Cloud DevOps Engineer', advantage: 'Existing infrastructure instincts make container networking and Linux troubleshooting effortless.' },
      { from: 'QA Automation Engineer', to: 'DevOps / Release Engineer', advantage: 'Deep familiarity with CI/CD build runners and test integration.' }
    ],
    checklist: [
      'Wrote and executed Terraform code to provision an entire multi-tier AWS infrastructure',
      'Configured a functional Kubernetes cluster with Ingress routing and HPA autoscaling',
      'Built a GitHub Actions pipeline deploying to cloud on git push',
      'Prepared for AWS Solutions Architect (SAA-C03) or CKA certification'
    ]
  }
];

import { extraRoadmapsList } from './moreRoadmaps';

export const allRoadmapsList: RoadmapDetail[] = [...roadmapsData, ...extraRoadmapsList];

export const getRoadmapBySlug = (slug: string): RoadmapDetail | undefined => {
  return allRoadmapsList.find(r => r.slug === slug);
};

