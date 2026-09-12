export interface FlagshipTrackContent {
  slug: string;
  fitProfile: {
    whoThisPathSuits: string[];
    prerequisites: string[];
    reasonsToConsiderAnotherPath: string[];
  };
  workReality: {
    dailyTasks: string[];
    typicalDeliverables: string[];
    keyStakeholders: string[];
    entryLevelResponsibilities: string[];
  };
  learningCommitment: {
    estimatedHours: string;
    assumedStartingKnowledge: string;
    necessaryEquipment: string;
  };
  weeklyCuratedResources: {
    weekRange: string;
    focusTopic: string;
    freeResources: { title: string; url: string; format: string; note: string }[];
    paidOptions?: { title: string; provider: string; cost: string; note: string }[];
    expectedOutput: string;
  }[];
  projectPacks: {
    id: string;
    title: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    datasetOrContext: { name: string; source: string; url?: string; description: string };
    businessBrief: string;
    starterSteps: string[];
    sampleOutputDescription: string;
    rubric: { criterion: string; weight: string; guidance: string }[];
  }[];
  readinessChecks: {
    task: string;
    howToValidate: string;
  }[];
  hiringPreparation: {
    relevantJobTitles: string[];
    portfolioStrategy: string[];
    interviewExercises: { question: string; scenario: string; whatGoodLooksLike: string; commonMistakes: string }[];
    applicationGuidance: string[];
  };
}

export const flagshipTracksData: Record<string, FlagshipTrackContent> = {
  // =========================================================================
  // 1. DATA ANALYTICS & BUSINESS INTELLIGENCE
  // =========================================================================
  'data-analytics': {
    slug: 'data-analytics',
    fitProfile: {
      whoThisPathSuits: [
        'Curious problem solvers who enjoy finding patterns in numbers and business operations.',
        'Graduates in Commerce, Economics, Engineering, Arts, or Science wanting a high-volume non-coding-heavy entry into IT/GCCs.',
        'Working professionals in sales, operations, or finance seeking higher compensation through data-driven automation.'
      ],
      prerequisites: [
        'Basic arithmetic intuition (averages, percentages, ratios, margins).',
        'Familiarity with basic spreadsheet formulas (SUM, AVERAGE, IF).',
        'Commitment to practice SQL query writing and dashboard modeling 8–10 hours per week.'
      ],
      reasonsToConsiderAnotherPath: [
        'If you strongly dislike numbers, business metrics, or structured relational tables, consider Creative UI/UX Design or Content Strategy.',
        'If you want to build heavy algorithmic software architectures, compilers, or operating systems, consider Full-Stack Engineering or Systems Programming.'
      ]
    },
    workReality: {
      dailyTasks: [
        'Writing SQL queries to extract cohort data, customer churn trends, and product transaction logs from relational databases.',
        'Building and refreshing automated Power BI / Tableau dashboards with custom DAX calculations.',
        'Reconciling monthly data discrepancies across finance, marketing, and warehouse fulfillment systems.',
        'Translating executive business queries into quantitative summaries and slide presentations.'
      ],
      typicalDeliverables: [
        'Executive KPI Dashboard with interactive drill-throughs and automated daily refresh.',
        'Monthly Sales MIS & Margin Variance Report in Excel/Power Query.',
        'Ad-hoc SQL query extracts and cohort retention heatmaps.'
      ],
      keyStakeholders: [
        'Product Managers (tracking feature adoption and checkout drop-off rates).',
        'Finance Controllers (monitoring revenue reconciliation and margin leakages).',
        'Marketing Leads (evaluating CAC, ROAS, and customer acquisition channels).'
      ],
      entryLevelResponsibilities: [
        'Cleaning raw CSVs and handling missing data under senior analyst supervision.',
        'Documenting data dictionary definitions and SQL query repositories.',
        'Updating weekly and monthly recurring reporting decks.'
      ]
    },
    learningCommitment: {
      estimatedHours: '180 – 220 Total Hours (12 – 14 Weeks at 12–15 hrs/week)',
      assumedStartingKnowledge: 'Basic computer literacy; no prior programming or computer science degree required.',
      necessaryEquipment: 'Windows laptop with 8GB RAM (16GB recommended for heavy local Power BI models) and dual-core CPU.'
    },
    weeklyCuratedResources: [
      {
        weekRange: 'Weeks 1 – 4',
        focusTopic: 'Advanced Excel & Relational SQL Foundations',
        freeResources: [
          { title: 'SQL Tutorial for Data Analysis', url: 'https://mode.com/sql-tutorial/', format: 'Interactive Guide', note: 'Covers SELECT, JOINs, aggregations, and subqueries.' },
          { title: 'LeetCode Top 50 SQL Study Plan', url: 'https://leetcode.com/studyplan/top-sql-50/', format: 'Practice Platform', note: 'High-frequency interview query patterns.' }
        ],
        paidOptions: [
          { title: 'Excel to MySQL: Analytic Techniques for Business', provider: 'Duke University on Coursera', cost: 'Financial Aid Available', note: 'Structured business case studies.' }
        ],
        expectedOutput: '100 completed SQL practice queries and 1 automated multi-table Excel financial reconciliation model.'
      },
      {
        weekRange: 'Weeks 5 – 9',
        focusTopic: 'Power BI, DAX & Dimensional Data Modeling',
        freeResources: [
          { title: 'Microsoft Learn Power BI Data Analyst (PL-300)', url: 'https://learn.microsoft.com/en-us/training/courses/pl-300t00', format: 'Official Documentation', note: 'Official Microsoft curriculum covering DAX and modeling.' },
          { title: 'DAX Guide & SQLBI Best Practices', url: 'https://dax.guide/', format: 'Reference', note: 'Comprehensive syntax guide for CALCULATE, FILTER, and Time Intelligence.' }
        ],
        paidOptions: [
          { title: 'PL-300 Exam Certification', provider: 'Microsoft', cost: '₹4,800 (with student discount)', note: 'Industry recognized accreditation.' }
        ],
        expectedOutput: 'Interactive 3-page Power BI dashboard published to NovyPro with Star Schema data model.'
      },
      {
        weekRange: 'Weeks 10 – 14',
        focusTopic: 'Python for Data Cleaning & Portfolio Packaging',
        freeResources: [
          { title: 'Kaggle Python & Pandas Micro-Courses', url: 'https://www.kaggle.com/learn', format: 'Interactive Notebooks', note: 'Hands-on data cleaning and EDA.' },
          { title: 'RBI Database on Indian Economy (DBIE)', url: 'https://dbie.rbi.org.in', format: 'Open Data', note: 'Real Indian banking and macro indicators.' }
        ],
        expectedOutput: 'End-to-end GitHub portfolio repository with documented data pipeline and live dashboard links.'
      }
    ],
    projectPacks: [
      {
        id: 'da-proj-1',
        title: 'Indian E-Commerce Sales & Regional Margin Optimization',
        difficulty: 'Beginner',
        datasetOrContext: {
          name: 'Indian E-Commerce Order Records (100,000+ rows)',
          source: 'Kaggle Public Open Dataset',
          description: 'Multi-table relational dataset containing customer orders, shipping logistics, payment types, and regional warehouse locations across Indian states.'
        },
        businessBrief: 'The VP of Operations wants to identify why Tier-2 cities experience higher return-to-origin (RTO) rates on Cash-on-Delivery (COD) orders and determine which product categories generate the highest net profit margin after logistics expenses.',
        starterSteps: [
          'Import raw CSV tables into PostgreSQL or SQLite database; establish primary and foreign key constraints.',
          'Write SQL queries using CTEs and window functions to calculate 30-day customer repeat purchase rates.',
          'Model a Star Schema in Power BI linking Orders (Fact) with Date, Customer, Product, and Geography dimensions.',
          'Formulate custom DAX measures for Net Margin %, COD vs Prepaid Return Rate, and Average Delivery Turnaround.'
        ],
        sampleOutputDescription: 'Interactive 3-page Power BI report featuring executive KPI cards, state-level map distribution, dynamic cohort matrix, and drill-through details per logistics partner.',
        rubric: [
          { criterion: 'Data Modeling', weight: '30%', guidance: 'Correct Star Schema with 1-to-many single-direction relationships; no bidirectional relationship spaghetti.' },
          { criterion: 'DAX Formulation', weight: '30%', guidance: 'Accurate CALCULATE, DIVIDE with fallbacks, and time-intelligence YoY metrics.' },
          { criterion: 'UI & Storytelling', weight: '20%', guidance: 'Consistent 3-color palette, clear visual hierarchy, and intuitive filter pane.' },
          { criterion: 'Documentation', weight: '20%', guidance: 'GitHub README containing problem statement, architecture schema diagram, and executive takeaway summary.' }
        ]
      },
      {
        id: 'da-proj-2',
        title: 'FinTech Retail Loan Default & NPA Risk Dashboard',
        difficulty: 'Intermediate',
        datasetOrContext: {
          name: 'RBI Retail Banking & Kaggle Credit Risk Dataset',
          source: 'Open Banking Benchmark Data',
          description: '80,000 customer loan profiles including credit score (CIBIL equivalent), debt-to-income ratio, employment tenure, and repayment delinquency status.'
        },
        businessBrief: 'A retail lending institution wants to build an early-warning risk monitoring dashboard to detect borrower delinquency patterns before accounts turn into Non-Performing Assets (NPAs).',
        starterSteps: [
          'Perform Exploratory Data Analysis (EDA) in Python (Pandas/Seaborn) to identify correlation between borrower salary bands and default triggers.',
          'Segment borrowers into High, Medium, and Low risk tiers based on CIBIL scores and debt-to-income ratios.',
          'Build an interactive dashboard allowing credit risk officers to simulate interest rate hikes and portfolio loss provisions.'
        ],
        sampleOutputDescription: 'Executive Risk Dashboard with dynamic sensitivity slider, risk matrix breakdown, and delinquency aging table.',
        rubric: [
          { criterion: 'Risk Segmentation Logic', weight: '35%', guidance: 'Robust business logic handling edge cases with missing salary and tenure data.' },
          { criterion: 'Dashboard Interactivity', weight: '35%', guidance: 'Smooth slicer cross-filtering with clear delinquency heatmaps.' },
          { criterion: 'Executive Presentation', weight: '30%', guidance: 'Summary slide highlighting actionable underwriting recommendations.' }
        ]
      }
    ],
    readinessChecks: [
      {
        task: 'Write a complex SQL window query from memory',
        howToValidate: 'Use DENSE_RANK() OVER(PARTITION BY department ORDER BY salary DESC) to identify top-3 earners without syntax lookup.'
      },
      {
        task: 'Construct a Star Schema in Power BI',
        howToValidate: 'Explain why Snowflake schemas with normalized sub-dimensions can slow down DAX performance compared to Star Schemas.'
      },
      {
        task: 'Formulate a DAX Time-Intelligence measure',
        howToValidate: 'Write CALCULATE(SUM(Sales[Revenue]), SAMEPERIODLASTYEAR(DimDate[Date])) and verify correct total row behavior.'
      },
      {
        task: 'Conduct a live 2-minute project walkthrough',
        howToValidate: 'Record a Loom video explaining the core business takeaway from your dashboard in under 120 seconds.'
      }
    ],
    hiringPreparation: {
      relevantJobTitles: [
        'Junior Data Analyst',
        'Business Intelligence (BI) Developer',
        'MIS Reporting Analyst',
        'Commercial Analytics Associate',
        'Operations Data Specialist'
      ],
      portfolioStrategy: [
        'Host interactive dashboards on NovyPro or Power BI Service with public view links.',
        'Maintain a clean GitHub profile with comprehensive READMEs containing business context, schema diagrams, and SQL scripts.',
        'Embed a 90-second video demo at the top of every repository.'
      ],
      interviewExercises: [
        {
          question: 'How do you handle a scenario where business leads report conflicting definitions for "Active Customer"?',
          scenario: 'Marketing considers anyone who opened an email as active; Finance considers only paying users in the last 30 days.',
          whatGoodLooksLike: 'Propose establishing a standardized data dictionary with explicit tiered definitions (e.g. "Engaged User" vs "Monetized Active User") aligned across stakeholders.',
          commonMistakes: 'Choosing one team’s side without documenting the distinction, leading to inconsistent reports.'
        },
        {
          question: 'Why did you choose a Star Schema over a Single Flat Table in your Power BI project?',
          scenario: 'Interviewer tests your understanding of data modeling principles and engine performance.',
          whatGoodLooksLike: 'Explain that Star Schemas optimize VertiPaq columnar compression, minimize redundant string memory, and ensure predictable DAX filter propagation.',
          commonMistakes: 'Saying "because the tutorial told me to" or confusing relationships with SQL joins.'
        }
      ],
      applicationGuidance: [
        'Apply directly on LinkedIn, Instahyre, and Naukri with your NovyPro link prominent in your contact header.',
        'Reach out to Analytics Managers on LinkedIn with a 2-line message sharing your live project link.'
      ]
    }
  },

  // =========================================================================
  // 2. FULL-STACK WEB DEVELOPMENT
  // =========================================================================
  'full-stack-web': {
    slug: 'full-stack-web',
    fitProfile: {
      whoThisPathSuits: [
        'Builders who want the capability to create, deploy, and scale complete digital web applications from scratch.',
        'Computer Science, IT, BCA/MCA, and self-taught engineers wanting comprehensive product engineering skills.',
        'Entrepreneurs and freelancers wanting to build SaaS products, client portals, and web platforms.'
      ],
      prerequisites: [
        'Logical reasoning and familiarity with basic programming fundamentals (variables, loops, conditionals).',
        'Persistence to debug asynchronous network errors, database migrations, and CSS layout issues.',
        'Willingness to write code daily for 16–20 weeks.'
      ],
      reasonsToConsiderAnotherPath: [
        'If you want immediate job placement within 4–6 weeks without coding, consider Customer Support Operations or BPO.',
        'If you prefer analyzing existing business data rather than building software systems from zero, consider Data Analytics.'
      ]
    },
    workReality: {
      dailyTasks: [
        'Developing responsive React/Next.js components with TypeScript and Tailwind CSS.',
        'Writing backend REST APIs, database schemas, and SQL migrations in PostgreSQL / Prisma.',
        'Integrating third-party services (Razorpay, OAuth, AWS S3, email delivery).',
        'Debugging production errors, writing automated tests, and deploying updates via CI/CD pipelines.'
      ],
      typicalDeliverables: [
        'Full-stack responsive web application with authenticated user portal.',
        'RESTful API documentation and Postman collections.',
        'Database migration scripts and performance indexing.'
      ],
      keyStakeholders: [
        'Product Managers (reviewing user stories and feature specs).',
        'UI/UX Designers (collaborating on design systems and responsive states).',
        'QA Engineers & DevOps Leads (ensuring test coverage and deployment stability).'
      ],
      entryLevelResponsibilities: [
        'Implementing UI components from Figma design specs.',
        'Fixing front-end bugs and writing unit tests.',
        'Building basic CRUD API endpoints under tech lead review.'
      ]
    },
    learningCommitment: {
      estimatedHours: '250 – 320 Total Hours (16 – 20 Weeks at 15–18 hrs/week)',
      assumedStartingKnowledge: 'Basic computer literacy and enthusiasm for software construction.',
      necessaryEquipment: 'Laptop with 8GB RAM (16GB recommended for Docker/Node development) with Windows, macOS, or Linux.'
    },
    weeklyCuratedResources: [
      {
        weekRange: 'Weeks 1 – 6',
        focusTopic: 'Modern JavaScript, TypeScript & React Fundamentals',
        freeResources: [
          { title: 'The Modern JavaScript Tutorial', url: 'https://javascript.info/', format: 'Interactive Guide', note: 'Deep dive into event loop, closures, and async/await.' },
          { title: 'Official React Documentation', url: 'https://react.dev/', format: 'Official Docs', note: 'Hooks, state management, and component architecture.' }
        ],
        expectedOutput: 'Responsive Zerodha-style live trading and watchlist interface simulator.'
      },
      {
        weekRange: 'Weeks 7 – 12',
        focusTopic: 'Node.js, PostgreSQL & Relational Architecture',
        freeResources: [
          { title: 'Prisma ORM & PostgreSQL Guide', url: 'https://www.prisma.io/docs', format: 'Documentation', note: 'Type-safe database modeling and migrations.' },
          { title: 'Full Stack Open', url: 'https://fullstackopen.com/en/', format: 'Comprehensive Course', note: 'University of Helsinki free full-stack curriculum.' }
        ],
        expectedOutput: 'Multi-tenant invoicing API with JWT authentication and PostgreSQL backend.'
      },
      {
        weekRange: 'Weeks 13 – 18',
        focusTopic: 'Next.js App Router, Razorpay Payments & Deployments',
        freeResources: [
          { title: 'Next.js Official Learn Course', url: 'https://nextjs.org/learn', format: 'Interactive Tutorial', note: 'Server Components, Server Actions, and Caching.' },
          { title: 'Razorpay Developer Documentation', url: 'https://razorpay.com/docs/payments/payment-gateway/', format: 'API Docs', note: 'Standard checkout and webhook signature verification.' }
        ],
        expectedOutput: 'Production-deployed EdTech / E-Commerce Marketplace with verified payment checkout.'
      }
    ],
    projectPacks: [
      {
        id: 'fs-proj-1',
        title: 'Full-Stack EdTech Course Marketplace with Razorpay',
        difficulty: 'Advanced',
        datasetOrContext: {
          name: 'Multi-Tenant Course & Subscription Platform',
          source: 'Original Full-Stack Product Specification',
          description: 'A complete web application enabling instructors to upload video courses, manage pricing, and process student enrollments with automated PDF invoices.'
        },
        businessBrief: 'Build a production-ready digital course marketplace with secure authentication, video streaming protection, Razorpay webhook verification, and student progress tracking.',
        starterSteps: [
          'Initialize Next.js App Router with TypeScript and Tailwind CSS; configure NextAuth.js for credentials and Google OAuth.',
          'Model database entities in Prisma: User, Course, Module, Lesson, Purchase, and Invoice.',
          'Implement Razorpay standard checkout; build backend webhook handler with cryptographic signature verification (HMAC SHA256).',
          'Deploy on Vercel with Neon/Supabase PostgreSQL and configure automated GitHub Actions CI/CD.'
        ],
        sampleOutputDescription: 'Live deployed web application with responsive dashboard, working payment flow in Razorpay test mode, student course player, and downloadable PDF receipt.',
        rubric: [
          { criterion: 'Authentication & Security', weight: '25%', guidance: 'Secure password hashing (bcrypt), protected API routes, and webhook HMAC signature checks.' },
          { criterion: 'Database Modeling', weight: '25%', guidance: 'Proper indexes on foreign keys, transaction rollback on payment failure, and clean Prisma schema.' },
          { criterion: 'UI/UX Polish', weight: '25%', guidance: 'Mobile responsive, zero hydration errors, accessible forms with Zod validation.' },
          { criterion: 'Deployment & CI/CD', weight: '25%', guidance: 'Live URL with custom domain, automated build tests, and clean GitHub repository documentation.' }
        ]
      }
    ],
    readinessChecks: [
      {
        task: 'Implement custom debounce hook in React',
        howToValidate: 'Write useDebounce hook to delay search API calls by 300ms without memory leaks.'
      },
      {
        task: 'Verify Razorpay Webhook Signatures',
        howToValidate: 'Explain and implement crypto.createHmac("sha256", secret).update(body).digest("hex") verification.'
      },
      {
        task: 'Explain Server Components vs Client Components in Next.js',
        howToValidate: 'Articulate when to use "use client" and how Server Components reduce client bundle size.'
      }
    ],
    hiringPreparation: {
      relevantJobTitles: [
        'Full-Stack Developer (MERN / Next.js)',
        'Frontend React Engineer',
        'Software Engineer - Web',
        'Junior Node.js Backend Developer'
      ],
      portfolioStrategy: [
        'Deploy at least 2 full-stack projects to live URLs with custom domains or Vercel links.',
        'Write detailed READMEs including architecture diagrams, API route specifications, and environment setup instructions.',
        'Link live demo and test credentials directly in resume header.'
      ],
      interviewExercises: [
        {
          question: 'How do you prevent SQL Injection and Cross-Site Scripting (XSS) in modern web applications?',
          scenario: 'Interviewer tests core web security knowledge.',
          whatGoodLooksLike: 'Explain parameterized queries/prepared statements (ORM protection), input validation with Zod/Joi, React auto-escaping, and setting Content Security Policy (CSP) headers.',
          commonMistakes: 'Believing that client-side validation alone is sufficient.'
        }
      ],
      applicationGuidance: [
        'Apply on Instahyre, Wellfound, and LinkedIn with live deployment URLs directly visible in your initial outreach note.'
      ]
    }
  },

  // =========================================================================
  // 3. DIGITAL & PERFORMANCE MARKETING
  // =========================================================================
  'digital-marketing': {
    slug: 'digital-marketing',
    fitProfile: {
      whoThisPathSuits: [
        'Creative and analytical individuals who enjoy consumer psychology, copywriting, and spreadsheet ROAS optimization.',
        'Commerce, arts, and communications graduates wanting fast commercial entry with measurable revenue results.',
        'Small business operators and freelancers looking to scale customer acquisition channels.'
      ],
      prerequisites: [
        'Comfortable analyzing campaign data in spreadsheets (CTR, CPC, Conversion Rate, ROAS).',
        'Strong written communication skills in English and/or regional languages.',
        'Willingness to learn ad platform mechanics (Meta Ads Manager, Google Ads, GA4).'
      ],
      reasonsToConsiderAnotherPath: [
        'If you dislike fast-paced campaign iterations, ad creative testing, and budget optimization, consider Technical Documentation or Accounting.',
        'If you want a purely code-heavy engineering role, consider Full-Stack or DevOps.'
      ]
    },
    workReality: {
      dailyTasks: [
        'Setting up, monitoring, and optimizing Meta Ads Manager and Google Ads campaigns.',
        'Writing ad copy, designing creative briefs for designers, and setting up landing page A/B tests.',
        'Tracking conversion funnels in Google Analytics 4 (GA4) and Google Tag Manager (GTM).',
        'Preparing weekly acquisition reports detailing CAC, spend, and ROAS per channel.'
      ],
      typicalDeliverables: [
        'Weekly Paid Media Performance Report with channel ROAS and budget allocation.',
        'Creative Strategy Matrix with 10+ hook and visual angle variations.',
        'SEO On-Page Audit and Keyword Content Calendar.'
      ],
      keyStakeholders: [
        'Creative Designers & Video Editors (producing ad creatives).',
        'E-Commerce / Product Managers (optimizing landing page conversion rates).',
        'Business Founders & CMOs (aligning marketing budgets with monthly revenue targets).'
      ],
      entryLevelResponsibilities: [
        'Setting up ad campaigns and UTM tracking parameters accurately.',
        'Conducting keyword research and competitor ad library audits.',
        'Compiling weekly spend and performance sheets.'
      ]
    },
    learningCommitment: {
      estimatedHours: '140 – 180 Total Hours (10 – 12 Weeks at 12–15 hrs/week)',
      assumedStartingKnowledge: 'Basic computer literacy and active familiarity with social media platforms.',
      necessaryEquipment: 'Any standard laptop or computer with internet access.'
    },
    weeklyCuratedResources: [
      {
        weekRange: 'Weeks 1 – 4',
        focusTopic: 'Funnel Architecture, Meta Ads & Creative Strategy',
        freeResources: [
          { title: 'Meta Blueprint Free Certification Training', url: 'https://www.facebook.com/business/learn', format: 'Official Training', note: 'Campaign objectives, pixel setup, and bidding strategies.' },
          { title: 'Meta Ad Library', url: 'https://www.facebook.com/ads/library', format: 'Research Tool', note: 'Analyze live ads from top Indian and global brands.' }
        ],
        expectedOutput: 'Complete Creative Strategy Matrix with 10 visual hooks and ad copy variations for a target brand.'
      },
      {
        weekRange: 'Weeks 5 – 8',
        focusTopic: 'Google Ads, Search Intent & Keyword Arbitrage',
        freeResources: [
          { title: 'Google Skillshop Search Ads Certification', url: 'https://skillshop.withgoogle.com/', format: 'Official Certification', note: 'Quality Score, match types, and bid optimization.' }
        ],
        expectedOutput: 'Full Search Campaign Structure: 3 Ad Groups, 30 Keywords (Exact/Phrase), and negative keyword list.'
      },
      {
        weekRange: 'Weeks 9 – 12',
        focusTopic: 'Google Analytics 4, Tag Manager & Retention Funnels',
        freeResources: [
          { title: 'Google Analytics Academy (GA4)', url: 'https://analytics.google.com/analytics/academy/', format: 'Official Course', note: 'Event-driven tracking and conversion funnel analysis.' }
        ],
        expectedOutput: 'End-to-end Marketing Portfolio Dossier with live campaign audits and analytics tear-downs.'
      }
    ],
    projectPacks: [
      {
        id: 'dm-proj-1',
        title: 'Full-Funnel Acquisition Strategy for an Indian D2C Brand',
        difficulty: 'Intermediate',
        datasetOrContext: {
          name: 'D2C Consumer Product Growth Case Study',
          source: 'Simulated D2C Brand Scenario',
          description: 'A direct-to-consumer skincare or coffee brand with ₹5,00,000 monthly ad budget seeking to scale customer acquisition while maintaining a minimum 3.0x Blended ROAS.'
        },
        businessBrief: 'Develop an end-to-end paid acquisition strategy covering Meta Ads, Google Search, landing page optimization recommendations, and GA4 event tracking setup.',
        starterSteps: [
          'Audit top competitors in Meta Ad Library; identify prevailing creative angles (founder story, problem-solution, UGC review).',
          'Structure a 3-tier campaign budget: Top of Funnel (60%), Middle of Funnel (20%), Bottom of Funnel Retargeting (20%).',
          'Write 5 distinct ad copy variants using PAS (Problem-Agitate-Solution) and AIDA frameworks.',
          'Define a GA4 custom event tracking schema: ViewContent, AddToCart, InitiateCheckout, Purchase.'
        ],
        sampleOutputDescription: 'Comprehensive 15-slide Growth Strategy Deck containing target audience personas, creative storyboard briefs, keyword bid matrix, and financial ROAS projection model.',
        rubric: [
          { criterion: 'Audience & Funnel Logic', weight: '30%', guidance: 'Clear separation of cold prospecting vs warm retargeting with realistic budget allocations.' },
          { criterion: 'Creative & Copy Quality', weight: '30%', guidance: 'Compelling hooks, strong value propositions, and compliance with ad platform policies.' },
          { criterion: 'Measurement & Unit Economics', weight: '25%', guidance: 'Accurate calculations of CAC, Break-Even ROAS, and expected conversion rates.' },
          { criterion: 'Executive Presentation', weight: '15%', guidance: 'Clean professional slides suitable for presenting to a brand founder.' }
        ]
      }
    ],
    readinessChecks: [
      {
        task: 'Calculate Break-Even ROAS from Gross Margins',
        howToValidate: 'Explain why a product with 60% gross margin requires a minimum Break-Even ROAS of 1.67x (1 / 0.60).'
      },
      {
        task: 'Configure GA4 Custom Conversion Event in Tag Manager',
        howToValidate: 'Explain GTM trigger creation for form submissions without page reloads.'
      }
    ],
    hiringPreparation: {
      relevantJobTitles: [
        'Performance Marketing Associate',
        'Digital Marketing Executive',
        'Paid Media Specialist (Meta / Google)',
        'Growth Marketing Analyst',
        'SEO & Content Specialist'
      ],
      portfolioStrategy: [
        'Package your campaign audits, creative storyboards, and GA4 dashboards into a clean Notion portfolio or PDF slide deck.',
        'Highlight analytical rigor and unit economics understanding rather than vague buzzwords.'
      ],
      interviewExercises: [
        {
          question: 'If a campaign’s CTR is high (3.5%) but conversion rate on the landing page is extremely low (0.4%), where is the bottleneck?',
          scenario: 'Interviewer tests diagnostic troubleshooting ability.',
          whatGoodLooksLike: 'Identify that the ad creative is compelling (high CTR), but there is a mismatch with the landing page: slow page speed, confusing pricing, lack of trust badges, or broken checkout flow.',
          commonMistakes: 'Suggesting to pause the ad without inspecting the landing page experience.'
        }
      ],
      applicationGuidance: [
        'Apply to digital marketing agencies and D2C startups with a customized 1-page audit of their current ads attached to your message.'
      ]
    }
  },

  // =========================================================================
  // 4. ACCOUNTING, TALLY PRIME & GST
  // =========================================================================
  'tally-gst': {
    slug: 'tally-gst',
    fitProfile: {
      whoThisPathSuits: [
        'B.Com, M.Com, BBA, and finance graduates seeking structured, reliable accounting careers.',
        'Learners wanting high regional employment density across SMEs, trading firms, and CA consultancies.',
        'Aspiring GST practitioners and tax consultants.'
      ],
      prerequisites: [
        'Understanding of fundamental accounting rules (Debit what comes in, Credit what goes out; Nominal, Real, Personal accounts).',
        'Attention to numerical accuracy and document reconciliation discipline.',
        'Familiarity with basic computer data entry.'
      ],
      reasonsToConsiderAnotherPath: [
        'If you want a purely creative design or coding role without regulatory compliance and statutory ledgers, consider Web Development or UI Design.'
      ]
    },
    workReality: {
      dailyTasks: [
        'Recording sales, purchase, payment, and receipt vouchers in Tally Prime.',
        'Reconciling monthly GSTR-2B Input Tax Credit (ITC) with purchase registers.',
        'Generating e-Way bills and e-Invoices on government portals.',
        'Preparing bank reconciliation statements (BRS) and TDS deduction entries.'
      ],
      typicalDeliverables: [
        'Monthly GSTR-1 and GSTR-3B filing summaries.',
        'Bank Reconciliation Statement (BRS) with zero unexplained variance.',
        'Trial Balance, Profit & Loss Statement, and Balance Sheet schedules.'
      ],
      keyStakeholders: [
        'Chartered Accountants / External Auditors (reviewing year-end tax audits).',
        'Business Owners / Managing Directors (monitoring daily cash flow and supplier payables).',
        'Suppliers and Vendors (resolving payment and billing discrepancies).'
      ],
      entryLevelResponsibilities: [
        'Entering daily purchase and sales invoices into Tally.',
        'Managing petty cash vouchers and physical invoice filing.',
        'Matching vendor GST numbers and verifying tax invoice compliance.'
      ]
    },
    learningCommitment: {
      estimatedHours: '120 – 150 Total Hours (8 – 10 Weeks at 12–15 hrs/week)',
      assumedStartingKnowledge: 'Basic commerce principles; 12th commerce or B.Com background is advantageous.',
      necessaryEquipment: 'Any basic computer running Windows 7/8/10/11 with 2GB–4GB RAM.'
    },
    weeklyCuratedResources: [
      {
        weekRange: 'Weeks 1 – 4',
        focusTopic: 'Tally Prime Voucher Entry, Inventory & BRS',
        freeResources: [
          { title: 'Tally Solutions Official Help & Tutorials', url: 'https://help.tallysolutions.com/', format: 'Official Documentation', note: 'Company creation, voucher entry, inventory ledgers, and BRS.' }
        ],
        expectedOutput: 'Complete 30-day corporate trading dataset entered into Tally with zero BRS discrepancy.'
      },
      {
        weekRange: 'Weeks 5 – 8',
        focusTopic: 'GST Compliance, GSTR-1, GSTR-3B & Input Tax Credit (ITC)',
        freeResources: [
          { title: 'GST Portal Official User Manuals', url: 'https://www.gst.gov.in/help', format: 'Government Portal', note: 'Filing rules for GSTR-1, GSTR-3B, and GSTR-2B reconciliation.' },
          { title: 'CBIC GST Law & Circulars', url: 'https://cbic-gst.gov.in/', format: 'Regulatory Portal', note: 'HSN/SAC codes, tax rates, and reverse charge mechanisms.' }
        ],
        expectedOutput: 'Full GSTR-2B reconciliation spreadsheet identifying unmatched vendor invoices.'
      }
    ],
    projectPacks: [
      {
        id: 'tally-proj-1',
        title: 'Complete Annual Accounting & GST Reconciliation for a Manufacturing SME',
        difficulty: 'Intermediate',
        datasetOrContext: {
          name: 'Multi-State Trading Company Transaction Log',
          source: 'Simulated Indian Business Financials',
          description: '200+ sales and purchase invoices involving inter-state (IGST) and intra-state (CGST+SGST) supplies, advance payments, and TDS deductions.'
        },
        businessBrief: 'Record transactions in Tally Prime, reconcile monthly purchase registers against GSTR-2B, calculate net GST payable, and generate final financial statements.',
        starterSteps: [
          'Create company in Tally Prime with GSTIN and multi-rate tax ledgers (5%, 12%, 18%, 28%).',
          'Enter raw purchase invoices and match with GSTR-2B portal extract to detect missing ITC.',
          'Execute monthly TDS entries under Section 194C and 194J.',
          'Generate Trial Balance, Trading Account, P&L Statement, and Balance Sheet.'
        ],
        sampleOutputDescription: 'Complete Tally backup file, automated GSTR-2B reconciliation spreadsheet, and audit-ready Balance Sheet schedule.',
        rubric: [
          { criterion: 'Voucher & Ledger Accuracy', weight: '35%', guidance: 'Correct debit/credit assignments and tax ledger mapping without suspense balance.' },
          { criterion: 'GST & ITC Reconciliation', weight: '35%', guidance: 'Accurate identification of ineligible and unmatched ITC per Section 16(4).' },
          { criterion: 'Statutory Reports', weight: '30%', guidance: 'Clean Balance Sheet matching Trial Balance with proper depreciation entries.' }
        ]
      }
    ],
    readinessChecks: [
      {
        task: 'Reconcile GSTR-2B with Purchase Register',
        howToValidate: 'Explain how to handle invoices present in books but missing in GSTR-2B.'
      },
      {
        task: 'Explain Reverse Charge Mechanism (RCM)',
        howToValidate: 'State when RCM applies (e.g. GTA transport, legal services) and how tax is paid and claimed as ITC.'
      }
    ],
    hiringPreparation: {
      relevantJobTitles: [
        'Accounts Executive',
        'Tally Operator',
        'GST & Tax Compliance Associate',
        'Junior Accountant',
        'Billing & Inventory Specialist'
      ],
      portfolioStrategy: [
        'Prepare a sample GST reconciliation spreadsheet and a documented Tally company backup showcasing error-free financial statements.'
      ],
      interviewExercises: [
        {
          question: 'What is the consequence of taking Input Tax Credit (ITC) for an invoice not appearing in GSTR-2B?',
          scenario: 'Interviewer tests compliance and statutory knowledge.',
          whatGoodLooksLike: 'Explain that per Rule 36(4) and Section 16(2)(aa) of the CGST Act, ITC can only be availed if the supplier has filed GSTR-1 and it appears in GSTR-2B; otherwise, it results in tax demand with 18% interest.',
          commonMistakes: 'Believing that a physical invoice copy is sufficient to claim ITC without portal matching.'
        }
      ],
      applicationGuidance: [
        'Apply to local Chartered Accountant firms, tax consultancies, and commercial businesses via direct walk-ins and local job portals.'
      ]
    }
  },

  // =========================================================================
  // 5. CUSTOMER SUPPORT & GLOBAL BPO OPERATIONS
  // =========================================================================
  'bpo-support': {
    slug: 'bpo-support',
    fitProfile: {
      whoThisPathSuits: [
        'Learners seeking immediate employment (within 2–4 weeks) with structured training and competitive starting salaries.',
        '12th-pass learners, college graduates, and career returnees with good English communication and active listening skills.',
        'Individuals looking for clear operational promotion ladders to Team Lead, Quality Analyst, and Operations Manager.'
      ],
      prerequisites: [
        'Fluent spoken and written English communication.',
        'Typing speed of 30+ WPM with 90%+ accuracy.',
        'Emotional composure and problem-solving patience during stressful customer interactions.'
      ],
      reasonsToConsiderAnotherPath: [
        'If you strongly prefer solo analytical or asynchronous coding work with minimal real-time human interaction, consider Data Analytics or Web Development.'
      ]
    },
    workReality: {
      dailyTasks: [
        'Handling customer inquiries via inbound voice calls, live chat, or email ticketing systems (Zendesk, Freshdesk).',
        'Troubleshooting account access, billing disputes, order tracking, and refund requests.',
        'Documenting interaction notes in CRM systems (Salesforce, HubSpot) within Average Handle Time (AHT) targets.',
        'Participating in weekly Quality Assurance (QA) coaching sessions to maintain 90%+ CSAT scores.'
      ],
      typicalDeliverables: [
        'Daily resolved ticket log meeting SLA (Service Level Agreement) benchmarks.',
        'Escalation incident reports for critical technical or security issues.',
        'Customer satisfaction feedback documentation.'
      ],
      keyStakeholders: [
        'Team Leaders (monitoring real-time adherence and queue coverage).',
        'Quality Analysts (scoring call recordings and chat transcripts).',
        'End Customers (delivering empathetic, first-contact resolutions).'
      ],
      entryLevelResponsibilities: [
        'Answering customer queries per standard operating procedures (SOPs).',
        'Following security verification protocols before releasing account info.',
        'Maintaining prompt attendance and schedule adherence.'
      ]
    },
    learningCommitment: {
      estimatedHours: '60 – 80 Total Hours (3 – 4 Weeks at 15–20 hrs/week)',
      assumedStartingKnowledge: 'Basic computer literacy and functional English conversational ability.',
      necessaryEquipment: 'Any computer or smartphone for communication practice and typing assessments.'
    },
    weeklyCuratedResources: [
      {
        weekRange: 'Weeks 1 – 2',
        focusTopic: 'English Fluency, Neutral Accent & Active Listening',
        freeResources: [
          { title: 'TypingClub WPM Speed Builder', url: 'https://www.typingclub.com/', format: 'Practice Tool', note: 'Achieve 35+ WPM typing speed.' },
          { title: 'BBC Learning English Business Communication', url: 'https://www.bbc.co.uk/learningenglish', format: 'Audio Guide', note: 'Professional tone, de-escalation vocabulary, and phonetics.' }
        ],
        expectedOutput: 'Verified 35+ WPM typing certificate and 5 recorded mock customer call scripts.'
      },
      {
        weekRange: 'Weeks 3 – 4',
        focusTopic: 'CRM Ticketing Systems, Zendesk & De-Escalation',
        freeResources: [
          { title: 'Zendesk Training Tutorials', url: 'https://support.zendesk.com/hc/en-us', format: 'Official Guide', note: 'Ticket statuses, macros, SLA timers, and escalation rules.' }
        ],
        expectedOutput: 'Completed customer resolution portfolio: 10 complex chat and email response transcripts.'
      }
    ],
    projectPacks: [
      {
        id: 'bpo-proj-1',
        title: 'Customer Resolution & De-Escalation Simulation Dossier',
        difficulty: 'Beginner',
        datasetOrContext: {
          name: '15 Real-World Customer Support Incident Scenarios',
          source: 'Simulated E-Commerce & FinTech Support Desk',
          description: 'Complex customer support scenarios covering delayed deliveries, unauthorized card charges, product returns, and irate customer de-escalation.'
        },
        businessBrief: 'Draft professional, empathetic, policy-compliant email and live chat responses that maintain high CSAT while adhering to company guidelines.',
        starterSteps: [
          'Review the 15 customer scenario prompts covering billing, technical bugs, and service complaints.',
          'Draft empathetic opening acknowledgments ("I completely understand how frustrating it is to have your delivery delayed...").',
          'Provide clear, actionable resolution steps with realistic timeframes.',
          'Score responses against standard BPO Quality Assurance (QA) parameters (Empathy, Accuracy, Professional Tone, Security Verification).'
        ],
        sampleOutputDescription: 'Portfolio dossier containing 15 comprehensive resolution transcripts and a personal audio recording demonstrating neutral, calm voice delivery.',
        rubric: [
          { criterion: 'Empathy & De-escalation', weight: '35%', guidance: 'Sincere acknowledgment of customer emotions without defensive language.' },
          { criterion: 'Accuracy & Policy Adherence', weight: '35%', guidance: 'Clear, correct step-by-step guidance adhering to security and refund policies.' },
          { criterion: 'Grammar & Professional Tone', weight: '30%', guidance: 'Flawless spelling, punctuation, and courteous sign-off.' }
        ]
      }
    ],
    readinessChecks: [
      {
        task: 'Achieve 35+ WPM typing speed with 95%+ accuracy',
        howToValidate: 'Complete a 3-minute test on TypingClub / Monkeytype and save certificate.'
      },
      {
        task: 'Perform live mock customer de-escalation call',
        howToValidate: 'Demonstrate handling an angry customer without interrupting, maintaining a calm professional tone.'
      }
    ],
    hiringPreparation: {
      relevantJobTitles: [
        'Customer Support Executive (Voice / Non-Voice)',
        'Customer Success Specialist',
        'Technical Support Associate',
        'Client Operations Coordinator',
        'Quality Analyst Trainee'
      ],
      portfolioStrategy: [
        'Include typing speed score, English proficiency score, and customer resolution case examples in your resume.'
      ],
      interviewExercises: [
        {
          question: 'How would you handle a customer who demands an immediate refund for a product that is non-refundable per company policy?',
          scenario: 'Interviewer tests empathy, policy adherence, and de-escalation skill.',
          whatGoodLooksLike: 'Acknowledge the customer’s frustration empathetically, clearly explain the policy reason without blaming them, and offer the best allowable alternative (e.g. store credit, replacement, or account review).',
          commonMistakes: 'Arguing bluntly ("That is our policy, nothing can be done") or breaking policy without authorization.'
        }
      ],
      applicationGuidance: [
        'BPO and Customer Support companies hire continuously via direct walk-in interviews in Bengaluru, Pune, Hyderabad, Gurugram, Kolkata, and Chennai.'
      ]
    }
  }
};

export const getFlagshipTrackDetails = (slug: string): FlagshipTrackContent | undefined => {
  return flagshipTracksData[slug];
};
