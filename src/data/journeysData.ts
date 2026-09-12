export interface LearnerJourney {
  slug: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: 'purple' | 'emerald' | 'amber' | 'cyan' | 'rose' | 'teal';
  heroSummary: string;
  targetAudience: string;
  keyChallengesAddressed: string[];
  recommendedTracks: {
    title: string;
    slug: string;
    whyRecommended: string;
    startingRole: string;
  }[];
  prerequisiteBridge: {
    area: string;
    startingGap: string;
    bridgeAction: string;
    freeResource: string;
  }[];
  actionPlanSteps: {
    stepNumber: number;
    title: string;
    duration: string;
    description: string;
    deliverables: string[];
  }[];
  portfolioAndProjectStrategy: {
    focus: string;
    recommendedProject: string;
    howToStandOut: string;
  };
  resumeAndPositioningAdvice: {
    framingStrategy: string;
    sampleBullet: string;
    avoidMistake: string;
  };
  financialAndTransitionPlanning: {
    timeToFirstIncome: string;
    hardwareRequirements: string;
    opportunityCostAdvice: string;
  };
}

export const learnerJourneys: LearnerJourney[] = [
  {
    slug: 'bcom-ba-graduates',
    title: 'B.Com / BA Graduate Career Transition',
    subtitle: 'Bridge qualitative and numeracy strengths into high-demand tech & business roles',
    badge: 'Non-Engineering Degree Holder',
    badgeColor: 'purple',
    heroSummary: 'Graduates with non-engineering degrees (B.Com, BA, B.Sc, BBA) often assume tech roles require four-year Computer Science degrees. In reality, roles in Data Analytics, Tally/GST Accounting, Performance Marketing, and No-Code Operations prioritize verifiable SQL queries, spreadsheet modeling, and business communication over formal engineering degrees.',
    targetAudience: 'Recent or graduating B.Com, BA, BBA, and B.Sc graduates seeking entry into IT services, GCCs, and high-growth digital firms.',
    keyChallengesAddressed: [
      'Overcoming degree-filter anxiety with verifiable public project proof (GitHub, NovyPro, live portfolio)',
      'Bridging foundational tech gaps (relational databases, basic scripting) without expensive master’s degrees',
      'Translating commerce/humanities vocabulary into corporate analytics and marketing metrics'
    ],
    recommendedTracks: [
      {
        title: 'Data Analytics & Business Intelligence',
        slug: 'data-analytics',
        whyRecommended: 'Leverages numeracy and business intuition with SQL and Power BI rather than deep algorithm coding.',
        startingRole: 'Junior Business Data Analyst'
      },
      {
        title: 'Tally Prime & GST Accounting',
        slug: 'tally-gst',
        whyRecommended: 'Direct commercial application for B.Com graduates covering GSTR-1, GSTR-3B, TDS, and e-invoicing.',
        startingRole: 'Accounts Executive / GST Practitioner'
      },
      {
        title: 'Digital & Performance Marketing',
        slug: 'digital-marketing',
        whyRecommended: 'Combines creative copywriting with spreadsheet ROAS analysis for fast campaign execution.',
        startingRole: 'Performance Marketing Associate'
      }
    ],
    prerequisiteBridge: [
      {
        area: 'Spreadsheet to Relational DBs',
        startingGap: 'Comfortable in Excel but unfamiliar with relational databases.',
        bridgeAction: 'Learn SQL table structures, primary/foreign keys, and JOIN syntax on SQLite/PostgreSQL.',
        freeResource: 'SQLZoo & LeetCode 50 SQL Study Plan'
      },
      {
        area: 'Business Metrics Translation',
        startingGap: 'Knowing accounting entries but not digital metrics (CAC, LTV, Retention Cohorts).',
        bridgeAction: 'Build an e-commerce revenue dashboard modeling customer churn and repeat order rates.',
        freeResource: 'SkillsGuide E-Commerce Analytics Starter Brief'
      }
    ],
    actionPlanSteps: [
      {
        stepNumber: 1,
        title: 'Build Foundations with Core Tools',
        duration: 'Weeks 1–4',
        description: 'Focus on Excel dynamic arrays (XLOOKUP, FILTER), relational SQL queries, and basic visualization.',
        deliverables: ['100 SQL practice queries completed', '1 Multi-table Excel financial model']
      },
      {
        stepNumber: 2,
        title: 'Execute 2 Domain-Specific Projects',
        duration: 'Weeks 5–8',
        description: 'Create end-to-end projects using open datasets (RBI DBIE or Kaggle Indian Retail).',
        deliverables: ['Interactive Power BI dashboard published to NovyPro', 'Documented SQL repository on GitHub']
      },
      {
        stepNumber: 3,
        title: 'Resume Alignment & Outreach',
        duration: 'Weeks 9–12',
        description: 'Format single-column ATS resume highlighting project metrics and initiate LinkedIn networking with alumni in analytics.',
        deliverables: ['ATS-compliant resume with live links', '20 tailored applications with project loom walk-throughs']
      }
    ],
    portfolioAndProjectStrategy: {
      focus: 'Emphasize business context and data reconciliation accuracy over abstract algorithms.',
      recommendedProject: 'Indian Retail Multi-Store Sales & Margin Analyzer: Reconciling 50k transactions with GST-adjusted margins in Power BI.',
      howToStandOut: 'Include a 2-minute Loom screen recording explaining business decisions made from the data.'
    },
    resumeAndPositioningAdvice: {
      framingStrategy: 'Frame your commerce/arts degree as a business context advantage: understanding P&L, customer psychology, and stakeholder reporting.',
      sampleBullet: 'Engineered a Star Schema Power BI model connecting 50,000+ sales records, identifying ₹4.2L in regional margin variances.',
      avoidMistake: 'Do not apologize for having a non-tech degree; let your live project URLs do the talking.'
    },
    financialAndTransitionPlanning: {
      timeToFirstIncome: '3 to 5 Months of focused study (10-15 hrs/week).',
      hardwareRequirements: 'Standard 8GB RAM laptop with Windows 10/11 for Power BI Desktop and PostgreSQL.',
      opportunityCostAdvice: 'Do not enroll in expensive ₹1.5L+ master’s bootcamps; self-paced free documentation and verified projects are sufficient for junior roles.'
    }
  },
  {
    slug: 'diploma-iti-12th',
    title: 'Diploma / ITI / 12th-Pass Career Pathway',
    subtitle: 'Hands-on technician, field engineering, and non-degree entry into industry',
    badge: 'Vocational & Practical Entry',
    badgeColor: 'emerald',
    heroSummary: 'For learners with ITI certifications, polytechnic diplomas, or 12th standard qualifications, practical technical competencies unlock immediate employment in clean mobility, solar installation, hardware diagnostics, and digital operations.',
    targetAudience: 'ITI diploma holders, polytechnic graduates, and 12th-pass learners seeking practical, structured career entry.',
    keyChallengesAddressed: [
      'Navigating formal educational qualification filters through Government Apprenticeships (NAPS)',
      'Gaining hands-on diagnostic experience on real equipment (EV powertrains, solar inverters, network hardware)',
      'Securing stable regional employment with clear upward promotion ladders'
    ],
    recommendedTracks: [
      {
        title: 'Solar & Renewable Field Technician',
        slug: 'solar-renewable-energy-design',
        whyRecommended: 'High hiring volume across rooftop solar EPCs, state DISCOMs, and industrial solar parks.',
        startingRole: 'Solar Installation & O&M Technician'
      },
      {
        title: 'EV Two-Wheeler & Battery Service',
        slug: 'ev-battery-tech',
        whyRecommended: 'Booming service network requirements for Ola, Ather, TVS, and commercial delivery fleets.',
        startingRole: 'EV Service & Diagnostic Technician'
      },
      {
        title: 'Customer Support & BPO Operations',
        slug: 'bpo-support',
        whyRecommended: 'Immediate hiring with clear salary progression and English communication skill development.',
        startingRole: 'Customer Support Associate'
      }
    ],
    prerequisiteBridge: [
      {
        area: 'Electrical Safety & Multimeter Diagnostics',
        startingGap: 'Understanding basic circuits without DC high-voltage safety knowledge.',
        bridgeAction: 'Complete National Skill Development Corporation (NSDC) Suryamitra or EV safety modules.',
        freeResource: 'Skill India Digital & National Apprenticeship Portal (NAPS)'
      },
      {
        area: 'Digital Work Tools',
        startingGap: 'Limited computer typing speed and basic email formatting.',
        bridgeAction: 'Practice touch typing to 35+ WPM and master Google Sheets for field logs.',
        freeResource: 'TypingClub & Google Workspace Learning Center'
      }
    ],
    actionPlanSteps: [
      {
        stepNumber: 1,
        title: 'Complete Practical Safety & Diagnostic Training',
        duration: 'Weeks 1–4',
        description: 'Master multimeter voltage/resistance checks, wiring harness continuity, and DC safety gear.',
        deliverables: ['NSDC / NAPS registered profile', 'Safety protocol test checklist']
      },
      {
        stepNumber: 2,
        title: 'Apply for NAPS Industrial Apprenticeship',
        duration: 'Weeks 5–8',
        description: 'Secure a 1-year paid apprenticeship at a local manufacturing plant, solar EPC, or EV workshop.',
        deliverables: ['NAPS Apprenticeship contract with monthly stipend (₹9,000–₹14,000)']
      },
      {
        stepNumber: 3,
        title: 'Transition to Permanent Full-Time Role',
        duration: 'Months 6–12',
        description: 'Demonstrate diagnostic accuracy, field maintenance log keeping, and client communication.',
        deliverables: ['National Apprenticeship Certificate (NAC)', 'Permanent technician offer letter']
      }
    ],
    portfolioAndProjectStrategy: {
      focus: 'Document hands-on troubleshooting logs, tool certifications, and on-site photo evidence.',
      recommendedProject: 'Rooftop Solar 5kW Inverter Wiring & Earth Resistance Inspection Logbook.',
      howToStandOut: 'Demonstrate strict adherence to safety standards (PPE, lock-out tag-out, DC isolators).'
    },
    resumeAndPositioningAdvice: {
      framingStrategy: 'Highlight punctuality, diagnostic tool fluency, safety adherence, and field readiness.',
      sampleBullet: 'Diagnosed and resolved 40+ EV battery pack communication faults using CAN diagnostic tools with zero safety incidents.',
      avoidMistake: 'Do not leave gaps unexplained; highlight hands-on workshop hours and apprentice projects.'
    },
    financialAndTransitionPlanning: {
      timeToFirstIncome: '4 to 8 Weeks via government apprentice stipend programs.',
      hardwareRequirements: 'Basic smartphone for field logging apps; training centers provide diagnostic hardware.',
      opportunityCostAdvice: 'NAPS apprenticeships pay a mandatory monthly stipend while you learn on the job.'
    }
  },
  {
    slug: 'career-switchers',
    title: 'Professional Career Pivot Strategy',
    subtitle: 'Map existing industry domain knowledge into modern tech & analytics roles',
    badge: 'Mid-Career Switcher',
    badgeColor: 'amber',
    heroSummary: 'Switching careers does not mean starting from zero. Professionals from banking, sales, civil/mechanical engineering, operations, and teaching carry deep domain expertise, stakeholder intuition, and process discipline that pure freshers lack.',
    targetAudience: 'Working professionals with 2 to 10 years experience looking to transition into high-growth tech or product roles.',
    keyChallengesAddressed: [
      'Managing the fear of lateral or temporary entry-level salary adjustments',
      'Balancing 10–12 hours of weekly skill building alongside a full-time demanding job',
      'Framing past domain experience as an asset rather than dead weight'
    ],
    recommendedTracks: [
      {
        title: 'Data Analytics & Business Intelligence',
        slug: 'data-analytics',
        whyRecommended: 'Combines your existing domain knowledge (Banking, Retail, Logistics) with SQL and Power BI.',
        startingRole: 'Senior / Domain Data Analyst'
      },
      {
        title: 'Digital & Performance Marketing',
        slug: 'digital-marketing',
        whyRecommended: 'Ideal for sales, operations, and commerce professionals looking to manage customer acquisition funnels.',
        startingRole: 'Growth & Performance Manager'
      },
      {
        title: 'Full-Stack Web Development',
        slug: 'full-stack-web',
        whyRecommended: 'For technical switchers (testing, support, CAD engineers) transitioning to product development.',
        startingRole: 'Software Engineer (Frontend / Full-Stack)'
      }
    ],
    prerequisiteBridge: [
      {
        area: 'Domain Skill Mapping',
        startingGap: 'Unsure how past experience in e.g. Banking relates to Data Analytics.',
        bridgeAction: 'Identify specific business problems you already understand (e.g. loan NPA rates, customer churn) and build analytics projects solving them.',
        freeResource: 'SkillsGuide Domain Portfolio Playbook'
      },
      {
        area: 'Modern Tooling Stack',
        startingGap: 'Familiar with legacy tools but new to Git, modern BI, or cloud environments.',
        bridgeAction: 'Set up GitHub repositories and public portfolio dashboards.',
        freeResource: 'GitHub Skills Interactive Tutorials'
      }
    ],
    actionPlanSteps: [
      {
        stepNumber: 1,
        title: 'Targeted Night & Weekend Study',
        duration: 'Weeks 1–6',
        description: 'Dedicate 1.5 hours on weekdays and 4 hours on Saturday/Sunday to core technical competencies.',
        deliverables: ['Weekly milestones completed', 'Zero disruption to current daytime job performance']
      },
      {
        stepNumber: 2,
        title: 'Build 2 Domain-Native Case Studies',
        duration: 'Weeks 7–12',
        description: 'Build flagship projects solving real problems in your target industry domain.',
        deliverables: ['Interactive case studies showing before-and-after business metrics']
      },
      {
        stepNumber: 3,
        title: 'Internal Transition or Targeted Lateral Search',
        duration: 'Weeks 13–18',
        description: 'Explore internal transfers within your existing company first, or reach out to hiring managers in your domain.',
        deliverables: ['3 internal transfer discussions or 10 direct hiring lead outreach meetings']
      }
    ],
    portfolioAndProjectStrategy: {
      focus: 'Solve a real problem you personally witnessed in your past career.',
      recommendedProject: 'End-to-End Operational Risk & Turnaround Time Optimization Dashboard for [Your Past Industry].',
      howToStandOut: 'Demonstrate domain mastery in the documentation that a pure computer science graduate could never write.'
    },
    resumeAndPositioningAdvice: {
      framingStrategy: 'Position yourself as a "Domain Specialist who builds data/software solutions", not an entry-level novice.',
      sampleBullet: 'Leveraged 4 years of retail operations expertise to architect a Power BI replenishment model reducing stockout alerts by 28%.',
      avoidMistake: 'Do not hide past experience; translate it into quantifiable business value.'
    },
    financialAndTransitionPlanning: {
      timeToFirstIncome: '4 to 6 Months (without quitting current job).',
      hardwareRequirements: 'Existing work/personal laptop (16GB RAM recommended for full-stack/local DBs).',
      opportunityCostAdvice: 'Never quit your job to study full-time; transition part-time to protect your cash flow.'
    }
  },
  {
    slug: 'career-break-return',
    title: 'Returning After a Career Break',
    subtitle: 'Structured 8-week ramp-up, modern tool refresh, and returnship strategies',
    badge: 'Career Relaunch',
    badgeColor: 'rose',
    heroSummary: 'Whether taking time off for caregiving, maternity, family health, or sabbatical, returning to the workforce requires rebuilding tool confidence, creating fresh proof-of-work, and transparently communicating career gap context.',
    targetAudience: 'Professionals returning to work after a 1 to 5+ year career pause.',
    keyChallengesAddressed: [
      'Overcoming resume gap screening in applicant tracking systems',
      'Updating knowledge on modern tooling (Power BI, modern JS, cloud tools, AI assistants)',
      'Accessing structured corporate returnship programs at leading IT and GCC employers'
    ],
    recommendedTracks: [
      {
        title: 'Data Analytics & Business Intelligence',
        slug: 'data-analytics',
        whyRecommended: 'Structured problem solving with fast visible project execution in Power BI and SQL.',
        startingRole: 'Data Analyst / Reporting Specialist'
      },
      {
        title: 'Customer Support & Operations',
        slug: 'bpo-support',
        whyRecommended: 'Immediate hiring with remote/hybrid flexibility and rapid onboarding.',
        startingRole: 'Operations / Customer Success Lead'
      },
      {
        title: 'Tally Prime & GST Accounting',
        slug: 'tally-gst',
        whyRecommended: 'High local demand across SMEs and accounting consultancies with flexible schedules.',
        startingRole: 'Senior Accountant / Tax Compliance Associate'
      }
    ],
    prerequisiteBridge: [
      {
        area: 'Modern Workflow Refresher',
        startingGap: 'Familiar with concepts but unfamiliar with recent cloud and AI developer tools.',
        bridgeAction: 'Learn how to use AI productivity tools (ChatGPT, Cursor) and modern cloud portals.',
        freeResource: 'SkillsGuide AI Productivity Guide'
      },
      {
        area: 'Resume Gap Framing',
        startingGap: 'Unsure how to address career pause on LinkedIn and CV.',
        bridgeAction: 'Add a clear "Career Sabbatical / Upskilling" entry detailing recent project milestones.',
        freeResource: 'SkillsGuide ATS Resume Template'
      }
    ],
    actionPlanSteps: [
      {
        stepNumber: 1,
        title: 'Tool Refresh & Baseline Confidence',
        duration: 'Weeks 1–3',
        description: 'Complete hands-on tutorials to refresh SQL, spreadsheet modeling, or programming syntax.',
        deliverables: ['2 Refresher projects completed', 'GitHub / Portfolio created']
      },
      {
        stepNumber: 2,
        title: 'Build 1 Comprehensive Capstone Project',
        duration: 'Weeks 4–6',
        description: 'Build a recent, high-polish project demonstrating current 2026 industry standards.',
        deliverables: ['Live interactive project with complete documentation and schema diagrams']
      },
      {
        stepNumber: 3,
        title: 'Apply to Returnship Programs & Direct Outreach',
        duration: 'Weeks 7–10',
        description: 'Target corporate returnship programs (e.g., Tata SCIP, Amazon Rekindle, Infosys Restart) and warm network referrals.',
        deliverables: ['15 Targeted returnship applications', 'Reconnected with 10 former colleagues']
      }
    ],
    portfolioAndProjectStrategy: {
      focus: 'Prove current recency of skill rather than historical knowledge.',
      recommendedProject: 'Modern Business Performance & Executive Dashboard built within the last 30 days.',
      howToStandOut: 'Commit daily/weekly to GitHub or publish regular LinkedIn learning reflections.'
    },
    resumeAndPositioningAdvice: {
      framingStrategy: 'State career pause transparently in 1 concise line, followed immediately by recent upskilling deliverables.',
      sampleBullet: 'Completed intensive 12-week Data Analytics blueprint, engineering 2 production-grade Power BI dashboards with SQL backend.',
      avoidMistake: 'Never try to hide a career gap with deceptive dates; address it with confidence.'
    },
    financialAndTransitionPlanning: {
      timeToFirstIncome: '2 to 4 Months.',
      hardwareRequirements: 'Standard personal laptop and reliable home internet.',
      opportunityCostAdvice: 'Returnship programs offer paid 3 to 6-month trial periods that frequently convert to full-time roles.'
    }
  },
  {
    slug: 'limited-resources',
    title: 'Learning with Limited Hardware & Low Bandwidth',
    subtitle: 'Maximize career outcomes using shared computers, free cloud sandboxes & offline docs',
    badge: 'Resource-Optimized Plan',
    badgeColor: 'cyan',
    heroSummary: 'You do not need a ₹1,00,000 gaming laptop or unlimited fiber broadband to master high-paying tech and business skills. By leveraging free cloud compute sandboxes (Google Colab, StackBlitz, Replit), lightweight open-source software, and offline documentation, you can build production-ready projects on low-spec computers or shared cyber cafe workstations.',
    targetAudience: 'Learners with older PCs (4GB RAM, dual-core), shared family devices, or limited mobile hotspot data.',
    keyChallengesAddressed: [
      'Running heavy developer environments (Docker, Android Studio) on 4GB RAM machines',
      'Minimizing bandwidth consumption from heavy video courses and software downloads',
      'Preserving work progress safely across shared or public computers'
    ],
    recommendedTracks: [
      {
        title: 'Data Analytics with SQL & SQLite / DuckDB',
        slug: 'data-analytics',
        whyRecommended: 'SQL and SQLite require minimal RAM (<100MB) and run blazingly fast on any computer.',
        startingRole: 'SQL Data Analyst'
      },
      {
        title: 'Full-Stack Web Development (Cloud Sandboxes)',
        slug: 'full-stack-web',
        whyRecommended: 'Build Next.js / Node apps entirely inside the browser using free StackBlitz or GitHub Codespaces.',
        startingRole: 'Frontend Developer'
      },
      {
        title: 'Tally Prime & Business Accounting',
        slug: 'tally-gst',
        whyRecommended: 'Tally is extremely lightweight and runs smoothly even on Windows 7 with 2GB RAM.',
        startingRole: 'Junior Accountant'
      }
    ],
    prerequisiteBridge: [
      {
        area: 'Browser-Based Cloud Compute',
        startingGap: 'Cannot install heavy IDEs or Python libraries locally.',
        bridgeAction: 'Use Google Colab (free cloud GPU/CPU) and GitHub Codespaces for 60 free compute hours monthly.',
        freeResource: 'Google Colab & StackBlitz Web IDE'
      },
      {
        area: 'Offline Documentation & Text Guides',
        startingGap: 'Buffering video lectures drains daily mobile data limits.',
        bridgeAction: 'Download text/markdown tutorials and offline docs via DevDocs.io for zero-data studying.',
        freeResource: 'DevDocs.io (Offline Documentation Reader)'
      }
    ],
    actionPlanSteps: [
      {
        stepNumber: 1,
        title: 'Set Up Free Cloud Development Toolchain',
        duration: 'Week 1',
        description: 'Create accounts on GitHub, StackBlitz, Google Colab, and download DevDocs offline packs.',
        deliverables: ['Functional in-browser coding environment requiring zero local installs']
      },
      {
        stepNumber: 2,
        title: 'Execute Lightweight Projects',
        duration: 'Weeks 2–8',
        description: 'Focus on pure SQL queries, clean semantic HTML/CSS/JS, or lightweight spreadsheet automation.',
        deliverables: ['3 GitHub repositories hosted on free GitHub Pages / Vercel']
      },
      {
        stepNumber: 3,
        title: 'Job Search via Mobile & Web Portals',
        duration: 'Weeks 9–12',
        description: 'Apply to remote and local roles with mobile-friendly portfolios and direct email applications.',
        deliverables: ['Hosted portfolio link accessible on any browser']
      }
    ],
    portfolioAndProjectStrategy: {
      focus: 'Build fast, lightweight, accessible web applications and efficient SQL queries.',
      recommendedProject: 'Zero-Dependency Vanilla JavaScript & SQL Logistics Tracker hosted on Vercel.',
      howToStandOut: 'Demonstrate superior code cleanliness, page load speed (<1s), and algorithmic efficiency.'
    },
    resumeAndPositioningAdvice: {
      framingStrategy: 'Highlight deep appreciation for resource efficiency, performance optimization, and clean architecture.',
      sampleBullet: 'Engineered a lightweight client-side order dashboard with zero heavy framework dependencies, achieving 100 Lighthouse performance.',
      avoidMistake: 'Never view low specs as a limitation; resource constraints forge the most disciplined engineers.'
    },
    financialAndTransitionPlanning: {
      timeToFirstIncome: '3 to 5 Months.',
      hardwareRequirements: 'Any working computer with 4GB RAM + Chrome browser; mobile hotspot is sufficient.',
      opportunityCostAdvice: 'Total software investment required: ₹0. All tools and cloud compute recommended are 100% free.'
    }
  },
  {
    slug: 'freelance-first-clients',
    title: 'Freelancer Strategy: Winning First Paying Clients',
    subtitle: 'Service packaging, proposal messaging, pricing calculations, and payment contracts',
    badge: 'Independent Consulting',
    badgeColor: 'teal',
    heroSummary: 'Transitioning from learning skills to winning paid client engagements requires shifting from "generalist freelancer" to offering a specific, high-urgency solution for a well-defined target customer.',
    targetAudience: 'Skilled individuals ready to offer services on Upwork, LinkedIn, and direct cold outreach.',
    keyChallengesAddressed: [
      'Breaking the "no reviews / no job history" deadlock on freelance marketplaces',
      'Pricing projects correctly without undercharging or losing money on scope creep',
      'Ensuring international payment protection, contracts, and compliant Indian banking setup'
    ],
    recommendedTracks: [
      {
        title: 'Global Freelancing & Remote Service Delivery',
        slug: 'freelancing-usd',
        whyRecommended: 'Covers the full business stack: positioning, proposal hooks, GST LUT, and Wise payments.',
        startingRole: 'Independent Contractor'
      },
      {
        title: 'Digital & Performance Marketing',
        slug: 'digital-marketing',
        whyRecommended: 'High retainer demand from e-commerce brands seeking ad optimization and funnel design.',
        startingRole: 'Freelance Media Buyer / Growth Specialist'
      },
      {
        title: 'UI/UX Product Design',
        slug: 'ui-ux-product-design',
        whyRecommended: 'High-ticket international demand for Figma landing page redesigns and SaaS interfaces.',
        startingRole: 'Freelance Product Designer'
      }
    ],
    prerequisiteBridge: [
      {
        area: 'Service Productization',
        startingGap: 'Offering vague "web development" or "graphic design" services.',
        bridgeAction: 'Package a narrow, high-value offer: e.g., "Next.js Core Web Vitals Optimization for E-Commerce" or "Figma Landing Page Redesign in 5 Days".',
        freeResource: 'SkillsGuide Service Packaging Matrix'
      },
      {
        area: 'Banking & GST LUT Setup',
        startingGap: 'Unsure how foreign wire transfers and Indian taxes work.',
        bridgeAction: 'Open a Wise Business account, obtain GSTIN, and file online LUT for 0% export GST invoicing.',
        freeResource: 'GST.gov.in LUT Portal Guide'
      }
    ],
    actionPlanSteps: [
      {
        stepNumber: 1,
        title: 'Create 2 Proof-of-Concept Deliverables',
        duration: 'Weeks 1–2',
        description: 'Build 2 hyper-specific sample projects addressing common client pain points.',
        deliverables: ['2 Case studies with 90-second video walk-throughs']
      },
      {
        stepNumber: 2,
        title: 'Targeted Proposal Bidding & Outbound Outreach',
        duration: 'Weeks 3–5',
        description: 'Submit 2–3 highly customized proposals daily focusing on the client’s exact problem in lines 1–2.',
        deliverables: ['15 Tailored proposals with custom Loom screen recordings']
      },
      {
        stepNumber: 3,
        title: 'Client Discovery, Contract & Delivery',
        duration: 'Weeks 6–8',
        description: 'Conduct 15-minute scoping calls, agree on milestone contracts, and overdeliver on the first project.',
        deliverables: ['First completed paid project with 5-star testimonial and repeat retainer offer']
      }
    ],
    portfolioAndProjectStrategy: {
      focus: 'Show the financial and operational impact of your deliverable on the client’s business.',
      recommendedProject: 'Complete Redesign & Speed Optimization for a Live Shopify / Next.js Storefront.',
      howToStandOut: 'Record a personalized 2-minute video audit pointing out 3 specific improvements for the prospective client.'
    },
    resumeAndPositioningAdvice: {
      framingStrategy: 'Position yourself as an external subject matter partner rather than an hourly task executor.',
      sampleBullet: 'Engineered a custom Shopify checkout funnel that reduced abandoned cart rates for a UK D2C brand.',
      avoidMistake: 'Never send copy-paste proposals; clients filter generic bids within 3 seconds.'
    },
    financialAndTransitionPlanning: {
      timeToFirstIncome: '4 to 8 Weeks of disciplined outreach.',
      hardwareRequirements: 'Reliable computer, microphone for client calls, and high-speed broadband.',
      opportunityCostAdvice: 'Remember the real take-home formula: Gross Billings minus Platform Fees (10-20%), Forex Fees (1-2%), and Income Tax.'
    }
  },
  {
    slug: 'green-tech-technician',
    title: 'Green Tech Pathway: Solar & EV Field Technician',
    subtitle: 'Practical installation, wiring, diagnostic testing, and maintenance',
    badge: 'Field Engineering & Trades',
    badgeColor: 'teal',
    heroSummary: 'India’s clean mobility and renewable energy expansion requires tens of thousands of skilled field technicians to install rooftop solar PV systems, wire balance-of-plant electricals, and service electric two-wheelers, three-wheelers, and commercial battery packs.',
    targetAudience: 'ITI Electricians/Motor Mechanics, Diploma Engineers, and practical learners seeking field technical roles.',
    keyChallengesAddressed: [
      'Mastering DC high-voltage safety and lockout-tagout (LOTO) protocols',
      'Diagnostic tool fluency: Multimeters, insulation resistance testers, CAN bus analyzers',
      'Connecting with regional solar EPC contractors and authorized EV service dealerships'
    ],
    recommendedTracks: [
      {
        title: 'Solar & Renewable Field Installation',
        slug: 'solar-renewable-energy-design',
        whyRecommended: 'Rapid growth driven by PM Surya Ghar Muft Bijli Yojana (1 Crore Rooftop Solar Installations).',
        startingRole: 'Rooftop Solar Installation Specialist'
      },
      {
        title: 'EV Powertrain & Battery Diagnostics',
        slug: 'ev-battery-tech',
        whyRecommended: 'Massive dealership and fleet service demand across 2-wheeler and 3-wheeler EV segments.',
        startingRole: 'EV Maintenance & Battery Technician'
      }
    ],
    prerequisiteBridge: [
      {
        area: 'DC High-Voltage & Solar String Safety',
        startingGap: 'Familiar with AC domestic wiring but unfamiliar with DC string voltages (up to 1000V).',
        bridgeAction: 'Complete Suryamitra or NSDC Solar PV installer certification modules.',
        freeResource: 'National Institute of Solar Energy (NISE) Guidelines'
      },
      {
        area: 'CAN Bus & EV ECU Diagnostics',
        startingGap: 'Traditional mechanical vehicle knowledge without electronic ECU diagnostic skills.',
        bridgeAction: 'Learn OBD-II and CAN diagnostic tools for reading battery cell voltage error codes.',
        freeResource: 'Open EV Diagnostic Training Modules'
      }
    ],
    actionPlanSteps: [
      {
        stepNumber: 1,
        title: 'Electrical Tools & Practical Measurement',
        duration: 'Weeks 1–4',
        description: 'Master multimeter, clamp meter, earth resistance tester, and torque wrench calibration.',
        deliverables: ['Tool safety and measurement logbook']
      },
      {
        stepNumber: 2,
        title: 'Field Installation & Diagnostic Shadowing',
        duration: 'Weeks 5–8',
        description: 'Complete hands-on rooftop mounting, crimping MC4 connectors, and DC isolator wiring.',
        deliverables: ['5 Completed solar rooftop installation checklists']
      },
      {
        stepNumber: 3,
        title: 'Certification & Local EPC Deployment',
        duration: 'Weeks 9–12',
        description: 'Register with local solar installers and EV fleet operators.',
        deliverables: ['Full-time field technician placement with regional EPC / EV dealership']
      }
    ],
    portfolioAndProjectStrategy: {
      focus: 'Demonstrate rigorous adherence to safety standards, wiring neatness, and diagnostic accuracy.',
      recommendedProject: 'Comprehensive 10kW On-Grid Rooftop Solar Installation & Earth Resistance Test Dossier.',
      howToStandOut: 'Highlight certified knowledge of MNRE rooftop solar installation guidelines.'
    },
    resumeAndPositioningAdvice: {
      framingStrategy: 'Emphasize safety certifications, physical reliability, diagnostic speed, and client handover communication.',
      sampleBullet: 'Installed and commissioned 18+ rooftop solar PV arrays (3kW–10kW) with zero safety infractions and verified grid synchronizations.',
      avoidMistake: 'Do not overlook local safety codes and earthing standards.'
    },
    financialAndTransitionPlanning: {
      timeToFirstIncome: '2 to 3 Months.',
      hardwareRequirements: 'Basic smartphone for field apps; standard electrician tool kit.',
      opportunityCostAdvice: 'High immediate demand with starting salaries of ₹18,000–₹30,000/month plus field installation bonuses.'
    }
  },
  {
    slug: 'green-tech-design-engineering',
    title: 'Green Tech Pathway: Clean Energy & EV Design Engineer',
    subtitle: 'PVsyst 3D modeling, high-voltage grid SLDs, MATLAB BMS algorithms, and thermal simulation',
    badge: 'Core Engineering Track',
    badgeColor: 'cyan',
    heroSummary: 'Engineering graduates in Electrical, Mechanical, Electronics, and Energy Engineering can lead the Net-Zero transition by mastering utility solar farm PVsyst 3D modeling, AutoCAD Single Line Diagrams (SLDs), Lithium-ion battery thermal management, and MATLAB/Simulink BMS control algorithms.',
    targetAudience: 'B.E. / B.Tech / M.Tech graduates in Electrical, Electronics, Mechanical, or Automobile Engineering.',
    keyChallengesAddressed: [
      'Transitioning from academic theory to industry-standard simulation software (PVsyst, MATLAB/Simulink, Ansys)',
      'Understanding utility-scale grid synchronization regulations (CEA Technical Standards for Connectivity)',
      'Designing bankable Detailed Project Reports (DPRs) that pass commercial lender due diligence'
    ],
    recommendedTracks: [
      {
        title: 'Solar & Renewable Energy Design (PVsyst)',
        slug: 'solar-renewable-energy-design',
        whyRecommended: 'Core design role for 50MW+ utility solar parks, bifacial yield simulations, and substation engineering.',
        startingRole: 'Solar Design & PVsyst Engineer'
      },
      {
        title: 'EV Powertrain & Battery Management Systems',
        slug: 'ev-battery-tech',
        whyRecommended: 'Automotive OEM and Tier-1 supplier demand for BMS firmware, cell balancing, and thermal analysis.',
        startingRole: 'BMS Hardware / Systems Engineer'
      }
    ],
    prerequisiteBridge: [
      {
        area: 'PVsyst 3D Scene Modeling',
        startingGap: 'Understanding solar geometry without software simulation expertise.',
        bridgeAction: 'Master PVsyst trial edition for 3D near-shading scene construction and P50/P90 loss tree analysis.',
        freeResource: 'PVsyst Official Tutorials & Sample Project Packs'
      },
      {
        area: 'Model-Based Development in MATLAB',
        startingGap: 'Coding in C/C++ without Simulink state machine experience.',
        bridgeAction: 'Build a Simulink model of an active cell balancing circuit with Kalman filter SoC estimation.',
        freeResource: 'MathWorks Onramp for Automotive & Battery Systems'
      }
    ],
    actionPlanSteps: [
      {
        stepNumber: 1,
        title: 'Master Core Simulation Software',
        duration: 'Weeks 1–6',
        description: 'Complete comprehensive modeling in PVsyst (Solar) or MATLAB/Simulink (EV BMS).',
        deliverables: ['Detailed Project Report (DPR) with P50/P90 energy yield curves']
      },
      {
        stepNumber: 2,
        title: 'Electrical Balance of Plant & Thermal Sizing',
        duration: 'Weeks 7–12',
        description: 'Draft complete Single Line Diagrams in AutoCAD and perform battery pack thermal dissipation calculations.',
        deliverables: ['AutoCAD SLD of 20MW solar substation or 40kWh EV battery cooling architecture']
      },
      {
        stepNumber: 3,
        title: 'Industry Portfolio & OEM Applications',
        duration: 'Weeks 13–16',
        description: 'Publish engineering design dossiers to GitHub/LinkedIn and apply to renewable EPCs and automotive OEMs.',
        deliverables: ['Engineering portfolio dossier reviewed by senior industry architects']
      }
    ],
    portfolioAndProjectStrategy: {
      focus: 'Demonstrate rigorous calculation of engineering trade-offs, loss trees, and bankability metrics.',
      recommendedProject: '50MW Utility-Scale Solar PVsyst Simulation & Substation Grid Interconnection DPR.',
      howToStandOut: 'Include sensitivity analysis comparing mono-PERC vs bifacial TOPCon modules with albedo impact.'
    },
    resumeAndPositioningAdvice: {
      framingStrategy: 'Highlight proficiency in industry-standard software, grid codes, and bankability standards.',
      sampleBullet: 'Simulated 50MW utility solar farm in PVsyst with 3D near-shading, delivering a bankable DPR with 18.2% P90 capacity utilization factor (CUF).',
      avoidMistake: 'Do not present generic academic projects; build realistic industry DPRs with real meteorological data.'
    },
    financialAndTransitionPlanning: {
      timeToFirstIncome: '3 to 5 Months.',
      hardwareRequirements: '16GB RAM Windows laptop with dedicated graphics for 3D PVsyst and MATLAB simulations.',
      opportunityCostAdvice: 'Starting salaries for specialized design engineers range from ₹6.5L to ₹12.0L LPA across major renewable hubs.'
    }
  },
  {
    slug: 'green-tech-sustainability-reporting',
    title: 'Green Tech Pathway: ESG & Sustainability Reporting',
    subtitle: 'SEBI BRSR Core compliance, GHG Protocol Scope 1-3 carbon accounting, and Net-Zero strategy',
    badge: 'Corporate Strategy & ESG',
    badgeColor: 'emerald',
    heroSummary: 'With SEBI mandating Business Responsibility and Sustainability Reporting (BRSR Core) for India’s top 1,000 listed companies, organizations face an urgent talent shortage of analysts capable of quantifying Scope 1, 2, and 3 greenhouse gas emissions, auditing supply chain sustainability, and compiling regulatory ESG filings.',
    targetAudience: 'Commerce, Economics, Environmental Science, Management, and Engineering professionals.',
    keyChallengesAddressed: [
      'Translating corporate operational data into standardized GHG Protocol carbon emission equivalents',
      'Navigating SEBI BRSR Core mandatory indicators and third-party assurance requirements',
      'Designing corporate decarbonization roadmaps (energy efficiency, renewable PPAs, I-RECs)'
    ],
    recommendedTracks: [
      {
        title: 'Solar & Renewable Energy Design (ESG Track)',
        slug: 'solar-renewable-energy-design',
        whyRecommended: 'Covers corporate decarbonization, Scope 1-3 GHG accounting, and SEBI BRSR compliance.',
        startingRole: 'ESG Sustainability Analyst'
      },
      {
        title: 'Data Analytics & Business Intelligence',
        slug: 'data-analytics',
        whyRecommended: 'Essential for collecting, cleaning, and visualizing enterprise-wide sustainability data.',
        startingRole: 'ESG Data Specialist'
      }
    ],
    prerequisiteBridge: [
      {
        area: 'GHG Protocol Standard Framework',
        startingGap: 'Knowing climate concepts without formal carbon calculation methodology.',
        bridgeAction: 'Learn emission factor databases (CEA CO2 Baseline Database for Indian Power Sector) and Scope 1, 2, 3 calculation formulas.',
        freeResource: 'GHG Protocol Corporate Standard & CEA CO2 Database'
      },
      {
        area: 'SEBI BRSR Core Principles',
        startingGap: 'Unfamiliar with the 9 National Guidelines on Responsible Business Conduct (NGRBC).',
        bridgeAction: 'Review real BRSR annual filings of top Nifty 50 companies on the NSE/BSE portals.',
        freeResource: 'SEBI Circular on BRSR Core & NSE Listed Company Filings'
      }
    ],
    actionPlanSteps: [
      {
        stepNumber: 1,
        title: 'Master Carbon Accounting & Indian Emission Factors',
        duration: 'Weeks 1–4',
        description: 'Calculate Scope 1 (fuel, DG sets), Scope 2 (grid electricity), and Scope 3 (business travel, logistics) emissions.',
        deliverables: ['Complete Corporate Carbon Inventory Spreadsheet with Indian emission factor formulas']
      },
      {
        stepNumber: 2,
        title: 'Compile a Mock SEBI BRSR Compliance Report',
        duration: 'Weeks 5–8',
        description: 'Draft an end-to-end BRSR Core reporting dossier for a mid-cap manufacturing firm.',
        deliverables: ['Comprehensive SEBI BRSR Core compliance report covering all 9 NGRBC principles']
      },
      {
        stepNumber: 3,
        title: 'Consulting & Corporate ESG Applications',
        duration: 'Weeks 9–12',
        description: 'Apply to Big 4 accounting firms, specialized ESG consulting agencies, and listed corporate sustainability teams.',
        deliverables: ['15 Targeted applications with your published BRSR case study attached']
      }
    ],
    portfolioAndProjectStrategy: {
      focus: 'Provide auditable, source-referenced carbon calculations with clear decarbonization recommendations.',
      recommendedProject: 'SEBI BRSR Core Compliance & Decarbonization Roadmap for an Indian Manufacturing Enterprise.',
      howToStandOut: 'Include financial calculations for corporate solar Open Access Power Purchase Agreements (PPAs).'
    },
    resumeAndPositioningAdvice: {
      framingStrategy: 'Position yourself at the intersection of regulatory compliance, data accuracy, and corporate strategy.',
      sampleBullet: 'Quantified Scope 1, 2, and 3 GHG emissions across 4 facilities using CEA emission factors, compiling a full SEBI BRSR Core compliance filing.',
      avoidMistake: 'Do not use vague "green" jargon; use exact metric tonnes of CO2 equivalent (tCO2e) and official SEBI KPIs.'
    },
    financialAndTransitionPlanning: {
      timeToFirstIncome: '3 to 4 Months.',
      hardwareRequirements: 'Standard office laptop with Excel and PDF tools.',
      opportunityCostAdvice: 'ESG compliance is a high-demand white-collar field with starting packages of ₹7.0L to ₹15.0L LPA across Big 4 and corporate headquarters.'
    }
  }
];

export const getLearnerJourneyBySlug = (slug: string): LearnerJourney | undefined => {
  return learnerJourneys.find(j => j.slug === slug);
};
