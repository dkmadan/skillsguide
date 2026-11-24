import type { LearnerJourney } from './journeysData';

export const featuredLearnerJourneys: LearnerJourney[] = [
  {
    slug: 'software-dev-to-ai-agent-engineer',
    title: 'Software Developer to GenAI & AI Agent Engineer',
    subtitle: 'Upgrade from standard CRUD and API work into production RAG, MCP tool-calling, and multi-agent AI systems',
    badge: 'AI Engineering Pivot',
    badgeColor: 'purple',
    image: '/images/journeys/software-dev-to-ai-agent-engineer.svg',
    imageAlt: 'Software developer transitioning into Generative AI and autonomous agent engineering',
    heroSummary: 'Traditional backend, frontend, and full-stack developers in India face rapid commoditization of boilerplate CRUD development. Product startups, SaaS companies, and GCC AI Centers of Excellence are paying 35–80% premiums for software engineers who can architect reliable RAG pipelines, tool-calling AI agents, structured outputs, and automated LLM evaluation harnesses in production.',
    targetAudience: 'Full-stack, backend, and Python/TypeScript software engineers with 1–7 years of experience looking to pivot into Applied AI and Agentic Engineering.',
    keyChallengesAddressed: [
      'Moving beyond fragile prompt demos to deterministic, observable, production-grade LLM applications',
      'Bridging classic software engineering (APIs, databases) with embeddings, vector search, and hybrid retrieval',
      'Preventing hallucinations, prompt injection, and runaway token costs in enterprise deployments',
      'Building objective evaluation pipelines (evals) instead of manually eyeballing chatbot outputs'
    ],
    recommendedTracks: [
      {
        title: 'AI Agents & LLM Applications',
        slug: 'ai-agents-llm-apps',
        whyRecommended: 'Covers structured tool calling, agent state graphs, memory architectures, and production deployment.',
        startingRole: 'Applied AI Engineer / LLM Application Developer'
      },
      {
        title: 'Generative AI & Agentic Workflows',
        slug: 'generative-ai-agentic-workflows',
        whyRecommended: 'Hands-on mastery of RAG, Model Context Protocol (MCP), and multi-step enterprise orchestration.',
        startingRole: 'AI Workflow & Agent Engineer'
      },
      {
        title: 'AI Agent Evaluation & Observability',
        slug: 'ai-agent-evaluation-observability',
        whyRecommended: 'Separates serious production AI engineers from hobbyists through automated evals and tracing.',
        startingRole: 'Senior AI Systems Engineer'
      }
    ],
    prerequisiteBridge: [
      {
        area: 'Embeddings, Chunking & Hybrid Retrieval (RAG)',
        startingGap: 'Experienced with SQL/NoSQL queries but unfamiliar with semantic similarity, pgvector, BM25 fusion, and reranking.',
        bridgeAction: 'Build a hybrid search service over 500 technical PDFs using PostgreSQL pgvector + keyword search with citations.',
        freeResource: 'PostgreSQL pgvector docs & Anthropic Contextual Retrieval guide'
      },
      {
        area: 'Structured Outputs, Tool Calling & Evals',
        startingGap: 'Treating LLMs as unpredictable text boxes rather than typed, testable software components.',
        bridgeAction: 'Implement JSON-schema validated tool calls with retries, trace logging, and a 50-case golden evaluation dataset.',
        freeResource: 'OpenAI / Google Gemini Structured Output docs & Langfuse open-source tracing'
      }
    ],
    actionPlanSteps: [
      {
        stepNumber: 1,
        title: 'Master Production RAG & Structured LLM APIs',
        duration: 'Weeks 1–3',
        description: 'Implement document ingestion, semantic chunking, hybrid search (vector + BM25), citation grounding, and strict schema outputs in TypeScript or Python.',
        deliverables: ['Hybrid RAG API with source citations and latency benchmarks', 'Token cost and caching calculator for production workloads']
      },
      {
        stepNumber: 2,
        title: 'Build a Multi-Step Tool-Calling AI Agent',
        duration: 'Weeks 4–8',
        description: 'Engineer an autonomous agent using MCP or typed function calling that safely queries databases, invokes internal APIs, enforces human-in-the-loop approvals, and handles failure states.',
        deliverables: ['Deployed multi-step agent app with live trace viewer', 'Guardrails layer blocking prompt injection and PII leakage']
      },
      {
        stepNumber: 3,
        title: 'Ship Automated Evals & Target AI Engineering Roles',
        duration: 'Weeks 9–12',
        description: 'Write an automated regression evaluation suite measuring faithfulness, tool-selection accuracy, and p95 latency. Showcase architecture write-ups to AI startup founders and GCC engineering leads.',
        deliverables: ['CI-integrated eval suite scoring 60+ edge cases', 'System design write-up comparing cost, latency, and accuracy trade-offs']
      }
    ],
    portfolioAndProjectStrategy: {
      focus: 'Demonstrate engineering reliability—latency, eval accuracy, cost per query, and safe tool boundaries—not flashy UI wrappers.',
      recommendedProject: 'Enterprise Support & Policy Copilot with Hybrid RAG, SQL Tool Calling, Role-Based Access Control, and an Automated 50-Test Eval Dashboard.',
      howToStandOut: 'Publish an engineering benchmark table showing how your chunking and reranking changes improved retrieval recall from 64% to 91% while cutting token costs by 40%.'
    },
    resumeAndPositioningAdvice: {
      framingStrategy: 'Position yourself as a production software engineer who brings distributed-systems rigor to AI applications, rather than an academic ML researcher.',
      sampleBullet: 'Architected a production hybrid-RAG and tool-calling support agent (TypeScript, pgvector, FastAPI) achieving 92% grounded-answer accuracy on a 100-case eval suite at ₹0.18/query.',
      avoidMistake: 'Do not list basic "ChatGPT clone" wrappers on your resume; interviewers immediately test for evals, retrieval quality, latency optimization, and failure recovery.'
    },
    financialAndTransitionPlanning: {
      timeToFirstIncome: '2 to 4 Months while remaining in your current engineering role.',
      hardwareRequirements: 'Any 8GB–16GB RAM laptop; all heavy LLM inference runs via free-tier and low-cost API credits (₹500–₹1,500 total testing budget).',
      opportunityCostAdvice: 'Do not pause your career for an expensive 1-year PG Diploma in AI/ML; shipping two evaluated production agent systems commands ₹12L–₹32L+ LPA faster at near-zero tuition cost.'
    }
  },
  {
    slug: 'hospital-nurse-allied-health-to-medical-coding',
    title: 'Nursing & Allied Health to Medical Coding & Healthcare Analytics',
    subtitle: 'Transition clinical anatomy knowledge into structured corporate RCM, ICD-10-CM/CPT coding, and healthcare data roles',
    badge: 'Healthcare Career Shift',
    badgeColor: 'teal',
    image: '/images/journeys/nursing-to-medical-coding-analytics.svg',
    imageAlt: 'Nursing and allied health graduate transitioning into medical coding and healthcare analytics',
    heroSummary: 'B.Sc Nursing, GNM, BPT (Physiotherapy), BHMS/BAMS, and Allied Health graduates in India frequently face exhausting 12-hour rotating hospital shifts and modest pay. India’s booming US-healthcare Revenue Cycle Management (RCM) and global healthcare GCC ecosystem (Optum, Omega Healthcare, GeBBS, Episource, Access Healthcare) actively hires clinical graduates for daytime corporate medical coding, clinical documentation audit, and healthcare analytics roles.',
    targetAudience: 'B.Sc/GNM Nursing, Physiotherapy (BPT), BAMS/BHMS, Life Sciences, and Allied Health graduates seeking stable corporate healthcare careers.',
    keyChallengesAddressed: [
      'Transitioning from bedside clinical shifts to structured corporate desk, hybrid, or remote healthcare workflows',
      'Mastering ICD-10-CM diagnosis coding, CPT procedural coding, HCPCS Level II, and HIPAA privacy compliance',
      'Deciding whether and when to invest in CPC (AAPC) or CCS (AHIMA) certification without falling for overpriced coaching scams',
      'Building a career ladder beyond entry-level coding into Quality Auditing, Risk Adjustment (HCC), and Healthcare Analytics'
    ],
    recommendedTracks: [
      {
        title: 'Medical Coding & RCM Compliance',
        slug: 'medical-coding',
        whyRecommended: 'Directly converts your existing anatomy, physiology, and medical terminology background into billable coding proficiency.',
        startingRole: 'Junior Medical Coder / Coding Trainee'
      },
      {
        title: 'Healthcare Data Analytics',
        slug: 'healthcare-data-analytics',
        whyRecommended: 'Unlocks higher-paying claims analytics, denial trend analysis, and population health reporting roles.',
        startingRole: 'Healthcare Claims & RCM Data Analyst'
      },
      {
        title: 'Hospital Administration & Operations',
        slug: 'hospital-administration',
        whyRecommended: 'Opens NABH quality compliance, TPA insurance desk management, and healthcare operations leadership.',
        startingRole: 'Healthcare Operations / Quality Coordinator'
      }
    ],
    prerequisiteBridge: [
      {
        area: 'ICD-10-CM, CPT & HIPAA Guidelines',
        startingGap: 'Strong clinical understanding of diseases and procedures, but unfamiliar with US payer billing rules, modifiers, and coding conventions.',
        bridgeAction: 'Practice translating 100 sample clinical charts (OPD, Emergency, Surgery) into accurate ICD-10-CM and CPT codes with modifier justification.',
        freeResource: 'CMS.gov official ICD-10-CM Guidelines & CDC ICD-10 browser tool'
      },
      {
        area: 'Corporate Spreadsheets & Claims Denial Tracking',
        startingGap: 'Minimal exposure to Excel pivot tables, claim rejection codes (CARC/RARC), and productivity SLA dashboards.',
        bridgeAction: 'Build an Excel claims-denial tracker categorizing top 10 coding errors and reimbursement recovery impact.',
        freeResource: 'CMS Medicare Learning Network (MLN) free modules & Excel Pivot Table guides'
      }
    ],
    actionPlanSteps: [
      {
        stepNumber: 1,
        title: 'Master Coding Guidelines & Anatomy Mapping',
        duration: 'Weeks 1–4',
        description: 'Study official ICD-10-CM chapter-specific guidelines, CPT E/M leveling, surgical modifiers (25, 59, LT/RT), and HIPAA patient privacy mandates.',
        deliverables: ['50 coded sample clinical charts with guideline citations', 'Personal quick-reference sheet for high-frequency E/M and surgical modifiers']
      },
      {
        stepNumber: 2,
        title: 'Timed Mock Audits & Certification Readiness',
        duration: 'Weeks 5–8',
        description: 'Practice coding specialty charts (Radiology, ED, HCC Risk Adjustment, Inpatient) under strict accuracy (95%+) and speed benchmarks; decide on employer-sponsored vs. self-funded CPC exam.',
        deliverables: ['3 timed mock coding assessments scoring 85%+', 'Claims Denial & Accuracy Audit spreadsheet built in Excel']
      },
      {
        stepNumber: 3,
        title: 'Target Healthcare BPOs, RCM Firms & GCCs',
        duration: 'Weeks 9–12',
        description: 'Apply to coding trainee and certified coder drives in Chennai, Hyderabad, Bengaluru, Pune, Mumbai, and Noida, highlighting clinical terminology mastery and mock audit accuracy.',
        deliverables: ['ATS resume tailored to RCM/Medical Coding recruiters', '25 targeted applications across major Indian healthcare GCCs and RCM firms']
      }
    ],
    portfolioAndProjectStrategy: {
      focus: 'Demonstrate 95%+ coding precision, strict HIPAA awareness, and an analytical mindset toward preventing claim denials.',
      recommendedProject: 'Anonymized Outpatient Claims Denial & HCC Risk Adjustment Audit Workbook identifying top documentation gaps and corrective coding rules.',
      howToStandOut: 'Showcase familiarity with both coding accuracy AND Excel-based claims denial trend analysis so hiring managers see immediate audit and analytics potential.'
    },
    resumeAndPositioningAdvice: {
      framingStrategy: 'Highlight your clinical degree as a speed-to-accuracy advantage in reading physician notes, discharge summaries, and operative reports.',
      sampleBullet: 'Applied clinical nursing background to audit 120+ mock multispecialty charts across ICD-10-CM and CPT E/M guidelines, maintaining 96.5% coding accuracy.',
      avoidMistake: 'Do not pay ₹60,000+ to unaccredited local institutes promising "100% job guarantee"—many major RCM employers train clinical graduates in-house or reimburse official AAPC CPC fees.'
    },
    financialAndTransitionPlanning: {
      timeToFirstIncome: '2 to 4 Months for Coding Trainee roles; 4 to 6 Months with CPC certification.',
      hardwareRequirements: 'Standard 8GB RAM laptop with Excel and PDF reader for official CMS codebooks and practice charts.',
      opportunityCostAdvice: 'Entry certified coders earn ₹3.2L–₹5.5L LPA with 5-day corporate weeks, scaling to ₹8L–₹16L+ LPA as Senior QA Auditors, HCC Specialists, or Healthcare Data Analysts.'
    }
  },
  {
    slug: 'sysadmin-it-support-to-cybersecurity-soc',
    title: 'IT Support & SysAdmin to Cybersecurity SOC Analyst',
    subtitle: 'Convert networking, Windows/Linux admin, and troubleshooting skills into SIEM threat detection and incident response',
    badge: 'Cybersecurity Pivot',
    badgeColor: 'cyan',
    image: '/images/journeys/it-support-to-cybersecurity-soc.svg',
    imageAlt: 'IT support and system administrator transitioning into Cybersecurity SOC Analyst role',
    heroSummary: 'L1/L2 IT helpdesk technicians, desktop support engineers, and system administrators in India often get stuck resetting passwords and imaging laptops with slow salary growth. Yet they already hold the exact prerequisite cybersecurity recruiters value most: real-world knowledge of Active Directory, DNS, TCP/IP, Windows Event Logs, and Linux administration. Layering SIEM triage, log analysis, and incident response unlocks high-demand SOC Analyst roles across Indian banks, IT services, and global MSSPs.',
    targetAudience: 'IT helpdesk engineers, L1/L2 technical support, network administrators, and Windows/Linux sysadmins with 1–6 years of experience.',
    keyChallengesAddressed: [
      'Breaking the cybersecurity "experience paradox" without starting over as a fresher',
      'Translating routine IT troubleshooting (DNS, AD, firewalls, patching) into defensive security language',
      'Gaining hands-on SIEM, EDR, and packet analysis experience in a safe home lab without enterprise licenses',
      'Understanding structured incident triage frameworks (MITRE ATT&CK, Cyber Kill Chain, NIST IR)'
    ],
    recommendedTracks: [
      {
        title: 'Cybersecurity & SOC Defense',
        slug: 'cybersecurity',
        whyRecommended: 'Builds core defensive capabilities in SIEM log correlation, phishing triage, and threat hunting.',
        startingRole: 'SOC Analyst (Tier 1 / Tier 2)'
      },
      {
        title: 'Linux System Administration',
        slug: 'linux-sysadmin',
        whyRecommended: 'Hardening Linux servers, reading auth/auditd logs, and scripting bash triage commands are daily SOC essentials.',
        startingRole: 'Security Operations / Infrastructure Analyst'
      },
      {
        title: 'Cloud Computing & Security',
        slug: 'cloud-computing',
        whyRecommended: 'Modern Indian enterprises run AWS/Azure workloads—CloudTrail and IAM log analysis command top salaries.',
        startingRole: 'Cloud SOC / Junior Cloud Security Engineer'
      }
    ],
    prerequisiteBridge: [
      {
        area: 'Security Logs, SIEM Queries & Packet Inspection',
        startingGap: 'Used Windows Event Viewer only for crash errors; unfamiliar with Sysmon, Wazuh/Splunk queries, or Wireshark traffic inspection.',
        bridgeAction: 'Deploy a free Wazuh or Microsoft Sentinel lab, ingest Windows Event IDs (4624, 4625, 4688, 7045), and write detection rules for brute-force and suspicious PowerShell.',
        freeResource: 'LetsDefend free SOC labs, TryHackMe SOC Level 1 path & Wireshark Sample Captures'
      },
      {
        area: 'Phishing Analysis & MITRE ATT&CK Mapping',
        startingGap: 'Forwarded suspicious user emails to security teams without inspecting SMTP headers, SPF/DKIM, or malicious attachments.',
        bridgeAction: 'Analyze 15 sample phishing emails (headers, URL defanging, sandbox detonation) and map observed tactics to MITRE ATT&CK IDs.',
        freeResource: 'MITRE ATT&CK Matrix & Malware-Traffic-Analysis.net exercises'
      }
    ],
    actionPlanSteps: [
      {
        stepNumber: 1,
        title: 'Strengthen Networking, OS Internals & Log Triage',
        duration: 'Weeks 1–4',
        description: 'Deep-dive into TCP/IP handshakes, HTTP/DNS protocols, Windows Active Directory authentication (Kerberos/NTLM), and Linux /var/log analysis.',
        deliverables: ['Wireshark packet analysis notes for 5 simulated attack PCAPs', 'Windows & Linux critical security Event ID cheat sheet']
      },
      {
        stepNumber: 2,
        title: 'Build a Home SOC Lab & Detection Rules',
        duration: 'Weeks 5–9',
        description: 'Set up an open-source SIEM (Wazuh or Elastic Security) connected to a Windows/Linux VM, simulate attacks with Atomic Red Team, and author 10 detection queries and incident playbooks.',
        deliverables: ['Documented Home SOC Lab architecture on GitHub', '5 Incident Response Playbooks (Phishing, Brute Force, Ransomware, Impossible Travel, Suspicious PowerShell)']
      },
      {
        stepNumber: 3,
        title: 'Scenario Interviews & Security Cert Alignment',
        duration: 'Weeks 10–14',
        description: 'Prepare for live SOC triage scenarios (alert fatigue, false positive vs. true positive escalation) and optionally pair with CompTIA Security+ or Microsoft SC-200.',
        deliverables: ['Reframed security-first resume highlighting IT infra ownership', '20 targeted applications to BFSI SOCs, Big 4 Cyber, and MSSPs']
      }
    ],
    portfolioAndProjectStrategy: {
      focus: 'Prove you can investigate a noisy alert from initial trigger to root cause and containment without panicking.',
      recommendedProject: 'End-to-End Home SOC Detection Lab (Wazuh SIEM + Sysmon + Atomic Red Team) with 5 complete Incident Investigation Reports mapped to MITRE ATT&CK.',
      howToStandOut: 'Write clear, executive-ready Incident Investigation Reports showing exact timestamps, Indicators of Compromise (IoCs), containment steps, and remediation rules.'
    },
    resumeAndPositioningAdvice: {
      framingStrategy: 'Reframe existing sysadmin/helpdesk work around access control, patch compliance, endpoint hardening, and anomaly troubleshooting.',
      sampleBullet: 'Hardened 180+ Windows endpoints via Group Policy and automated patch compliance, cutting recurring malware and privilege escalation tickets by 62%.',
      avoidMistake: 'Do not focus solely on "ethical hacking" or Kali Linux buzzwords—over 75% of entry-to-mid Indian cybersecurity jobs are in Blue Team / SOC / Cloud Defense.'
    },
    financialAndTransitionPlanning: {
      timeToFirstIncome: '3 to 5 Months while staying employed in IT support/admin.',
      hardwareRequirements: '16GB RAM laptop recommended to run 2 lightweight VMs (or use free cloud/browser labs like TryHackMe and CyberDefenders on an 8GB laptop).',
      opportunityCostAdvice: 'SOC Tier-1/Tier-2 roles in Indian GCCs and MSSPs start at ₹5.5L–₹11.0L LPA and scale rapidly to ₹15L–₹28L+ LPA in Detection Engineering and Cloud Security.'
    }
  },
  {
    slug: 'operations-logistics-to-supply-chain-sap',
    title: 'Operations & Warehouse Executive to Supply Chain & SAP S/4HANA Analyst',
    subtitle: 'Elevate floor logistics, procurement, and inventory experience into enterprise ERP consulting and supply chain analytics',
    badge: 'Enterprise Supply Chain',
    badgeColor: 'amber',
    image: '/images/journeys/operations-to-supply-chain-sap.svg',
    imageAlt: 'Operations and logistics executive transitioning into Supply Chain and SAP S/4HANA analytics',
    heroSummary: 'Warehouse supervisors, logistics coordinators, and procurement executives in India understand real-world bottlenecks—stockouts, vendor delays, demurrage, and dispatch SLA misses—better than anyone. Yet manual floor roles cap out early. By combining that physical operations intuition with SAP S/4HANA Materials Management (MM) / Sales & Distribution (SD) workflows, SQL, and Power BI inventory modeling, operations staff can transition into high-paying GCC Supply Chain Analyst and ERP Functional Consultant roles.',
    targetAudience: 'Warehouse supervisors, logistics/dispatch coordinators, procurement executives, and manufacturing planners with 1–8 years of operational experience.',
    keyChallengesAddressed: [
      'Moving from reactive daily dispatch firefighting to strategic inventory planning and ERP process design',
      'Translating physical Procure-to-Pay (P2P) and Order-to-Cash (O2C) execution into SAP S/4HANA terminology',
      'Quantifying supply chain KPIs (OTIF, Inventory Turnover, Fill Rate, Days of Inventory Outstanding) using data tools',
      'Navigating high-cost ERP training institutes by focusing on verifiable business-process and analytics deliverables'
    ],
    recommendedTracks: [
      {
        title: 'Logistics & Supply Chain Management',
        slug: 'logistics-supply-chain',
        whyRecommended: 'Formalizes demand forecasting, safety stock math, 3PL SLA governance, and global freight cost optimization.',
        startingRole: 'Supply Chain Planning Analyst'
      },
      {
        title: 'SAP S/4HANA Enterprise ERP',
        slug: 'sap-s4hana',
        whyRecommended: 'Directly unlocks MNC manufacturing, FMCG, and IT consulting roles in MM, SD, and EWM functional tracks.',
        startingRole: 'Junior SAP MM / Supply Chain Functional Analyst'
      },
      {
        title: 'Data Analytics & Business Intelligence',
        slug: 'data-analytics',
        whyRecommended: 'Enables automated supplier scorecarding, warehouse throughput tracking, and working-capital dashboards.',
        startingRole: 'Supply Chain BI & Inventory Analyst'
      }
    ],
    prerequisiteBridge: [
      {
        area: 'End-to-End ERP Process Mapping (P2P & O2C)',
        startingGap: 'Entered GRNs or delivery challans in a single ERP screen without understanding end-to-end integration with Finance (FI) and Inventory Valuation.',
        bridgeAction: 'Map the complete Procure-to-Pay flow (Purchase Requisition → PO → MIGO Goods Receipt → MIRO Invoice Verification → Payment) and document exception handling.',
        freeResource: 'SAP Learning (learning.sap.com) free S/4HANA Supply Chain journeys'
      },
      {
        area: 'Inventory Math & SQL/Power BI Reporting',
        startingGap: 'Tracked stock manually in flat Excel sheets without calculating Reorder Points, ABC-XYZ segmentation, or vendor OTIF.',
        bridgeAction: 'Build an ABC-XYZ inventory segmentation and safety-stock calculator in Excel/Power BI using open supply chain datasets.',
        freeResource: 'MITx Supply Chain Fundamentals (edX audit) & Kaggle DataCo Supply Chain dataset'
      }
    ],
    actionPlanSteps: [
      {
        stepNumber: 1,
        title: 'Master Supply Chain KPIs & Inventory Modeling',
        duration: 'Weeks 1–4',
        description: 'Build dynamic models for Economic Order Quantity (EOQ), Safety Stock, ABC-XYZ SKU classification, and On-Time In-Full (OTIF) vendor scorecards in Excel.',
        deliverables: ['Automated Inventory Optimization & Reorder Point workbook', 'Supplier OTIF & Lead-Time Variance Scorecard']
      },
      {
        stepNumber: 2,
        title: 'Learn SAP S/4HANA P2P / O2C Functional Flows',
        duration: 'Weeks 5–9',
        description: 'Complete free official SAP Learning modules covering S/4HANA sourcing, procurement, inventory management, master data governance, and Fiori apps.',
        deliverables: ['End-to-end Business Blueprint document for a multi-warehouse P2P workflow', 'SAP Learning Record badges earned on official portal']
      },
      {
        stepNumber: 3,
        title: 'Build Executive Supply Chain Dashboard & Target GCCs',
        duration: 'Weeks 10–14',
        description: 'Connect SQL/Excel datasets to Power BI to visualize freight spend, warehouse aging stock, and regional stockout alerts. Apply to FMCG, e-commerce, and global industrial GCCs.',
        deliverables: ['Interactive Supply Chain Control Tower dashboard in Power BI', '20 targeted applications to GCC supply chain & ERP support teams']
      }
    ],
    portfolioAndProjectStrategy: {
      focus: 'Connect operational warehouse realities directly to working-capital savings and service-level improvements.',
      recommendedProject: 'Multi-Warehouse Supply Chain Control Tower (SQL + Power BI) tracking ₹50Cr SKU inventory aging, ABC-XYZ classification, and vendor OTIF delays.',
      howToStandOut: 'Include a 1-page Business Process Blueprint showing how clean ERP master data eliminates duplicate POs and invoice reconciliation holds.'
    },
    resumeAndPositioningAdvice: {
      framingStrategy: 'Position yourself as a domain-grounded Supply Chain Analyst who understands both physical floor constraints and digital ERP/BI systems.',
      sampleBullet: 'Implemented ABC-XYZ SKU classification and automated weekly stockout tracking across 3,200 SKUs, improving warehouse fill rate from 86% to 95.4%.',
      avoidMistake: 'Do not pay lakhs for unverified "SAP server access" institutes promising instant senior consultant jobs; pair official SAP Learning journeys with strong SQL/Power BI proof.'
    },
    financialAndTransitionPlanning: {
      timeToFirstIncome: '3 to 5 Months while staying employed in operations.',
      hardwareRequirements: 'Standard 8GB RAM Windows laptop for Excel, Power BI Desktop, and browser-based SAP Learning portals.',
      opportunityCostAdvice: 'Supply Chain Analysts and Junior SAP Functional Consultants in Indian GCCs earn ₹6.0L–₹13.5L LPA, breaking far past the ₹2.5L–₹4.5L warehouse supervisor ceiling.'
    }
  },
  {
    slug: 'hr-admin-to-people-analytics-hrtech',
    title: 'HR Generalist & Recruiter to People Analytics & HR Tech Specialist',
    subtitle: 'Upgrade manual screening and attendance admin into HRIS workflows, workforce analytics, and AI-enabled talent ops',
    badge: 'HR & People Tech',
    badgeColor: 'emerald',
    image: '/images/journeys/hr-generalist-to-people-analytics.svg',
    imageAlt: 'HR generalist and recruiter transitioning into People Analytics and HR Tech specialist',
    heroSummary: 'HR executives, agency recruiters, and payroll coordinators in India spend hours chasing attendance sheets, manually filtering resumes, and answering repetitive policy queries—roles that face rapid automation and stagnant compensation. Forward-looking enterprises and GCCs pay significantly higher packages to People Analytics Specialists and HR Tech / HRIS Analysts who automate talent workflows, model attrition drivers in Power BI, and manage modern HR platforms (Darwinbox, Keka, Workday, SAP SuccessFactors).',
    targetAudience: 'HR generalists, campus/agency recruiters, HR operations executives, and MBA-HR graduates seeking analytical and HR-Tech career acceleration.',
    keyChallengesAddressed: [
      'Moving from administrative "people coordinator" perception to strategic, data-backed HR business partnering',
      'Learning to quantify HR outcomes (attrition risk, time-to-fill, quality-of-hire, cost-per-hire, compa-ratio)',
      'Overcoming fear of spreadsheets, SQL, and BI dashboards with no coding background',
      'Using Generative AI ethically for JD calibration, structured interview rubrics, and policy knowledge bases without violating candidate privacy'
    ],
    recommendedTracks: [
      {
        title: 'HR Operations, Recruitment & Payroll Compliance',
        slug: 'hr-recruitment-payroll',
        whyRecommended: 'Solidifies Indian statutory compliance (PF, ESIC, Gratuity, TDS) and modern HRIS lifecycle processes.',
        startingRole: 'HRIS / People Operations Specialist'
      },
      {
        title: 'Data Analytics & Business Intelligence',
        slug: 'data-analytics',
        whyRecommended: 'Equips you with Excel, SQL, and Power BI to diagnose attrition patterns and recruiting funnel bottlenecks.',
        startingRole: 'People Analytics Associate'
      },
      {
        title: 'AI Prompt Engineering & Workflow Automation',
        slug: 'ai-prompt-engineering',
        whyRecommended: 'Automates structured screening scorecards, onboarding checklists, and employee survey sentiment analysis.',
        startingRole: 'AI-Enabled Talent Operations Specialist'
      }
    ],
    prerequisiteBridge: [
      {
        area: 'Workforce Metrics & Compensation Math',
        startingGap: 'Tracked hiring headcount and leave logs without modeling attrition cohorts, offer-acceptance ratios, or salary band compa-ratios.',
        bridgeAction: 'Analyze an anonymized 1,500-employee HR dataset to compute voluntary attrition by tenure band, manager span of control, and promotion velocity.',
        freeResource: 'IBM HR Analytics Employee Attrition Dataset (Kaggle) & AIHR free People Analytics guides'
      },
      {
        area: 'HRIS Data Hygiene & Privacy Governance',
        startingGap: 'Maintained fragmented employee spreadsheets across hiring, payroll, and exit interviews with inconsistent IDs.',
        bridgeAction: 'Design a normalized employee master schema linking Employee ID across Attendance, Performance, Compensation, and Exit tables while enforcing PII masking.',
        freeResource: 'SkillsGuide Data Analytics starter playbook & MeitY DPDP employee data guidelines'
      }
    ],
    actionPlanSteps: [
      {
        stepNumber: 1,
        title: 'Master HR Metrics & Automated Excel Modeling',
        duration: 'Weeks 1–3',
        description: 'Automate monthly recruitment funnels, headcount bridges, payroll variance checks, and attrition cohort tables using Power Query and XLOOKUP.',
        deliverables: ['Automated Recruitment Funnel & Cost-per-Hire workbook', 'Compensation Band & Compa-Ratio audit template']
      },
      {
        stepNumber: 2,
        title: 'Build an Executive People Analytics Dashboard',
        duration: 'Weeks 4–8',
        description: 'Build an interactive 3-page Power BI dashboard covering Hiring Velocity, Regrettable Attrition Drivers, and Diversity/Pay-Equity health, backed by clean SQL queries.',
        deliverables: ['Live Power BI People Analytics Dashboard published to NovyPro/Portfolio', '1-page CHRO Executive Memo recommending 3 retention interventions']
      },
      {
        stepNumber: 3,
        title: 'HRIS Workflows, AI Enablement & Role Targeting',
        duration: 'Weeks 9–12',
        description: 'Document end-to-end Hire-to-Retire workflows for modern HRIS platforms (Darwinbox, Keka, Workday concepts) and build an AI-assisted structured interview rubric pack.',
        deliverables: ['HRIS Hire-to-Retire Process & Automation Dossier', '20 targeted applications to People Analytics, HRIS, and Talent Ops roles in GCCs and tech startups']
      }
    ],
    portfolioAndProjectStrategy: {
      focus: 'Show leadership-ready workforce insights that reduce regrettable attrition and hiring spend, while strictly protecting employee PII.',
      recommendedProject: 'Workforce Attrition & Recruiting Funnel Intelligence Suite (SQL + Power BI) pinpointing early-tenure drop-offs and ₹35L+ avoidable replacement cost.',
      howToStandOut: 'Pair your dashboard with a concise 1-page CHRO action memo quantifying the rupee savings of reducing 90-day early attrition by 5 percentage points.'
    },
    resumeAndPositioningAdvice: {
      framingStrategy: 'Rebrand from transactional recruitment/admin support to a data-literate People Operations & Analytics partner.',
      sampleBullet: 'Built a Power BI recruiting funnel and attrition cohort dashboard across 1,200 employees, cutting average time-to-fill from 48 to 31 days and flagging high-risk tenure segments.',
      avoidMistake: 'Never upload real company employee spreadsheets or candidate resumes into public AI tools or public portfolio dashboards—always use fully anonymized or synthetic datasets.'
    },
    financialAndTransitionPlanning: {
      timeToFirstIncome: '2 to 4 Months while remaining in your current HR/recruiting job.',
      hardwareRequirements: 'Standard 8GB RAM Windows laptop with Excel and free Power BI Desktop.',
      opportunityCostAdvice: 'People Analytics and HRIS Specialists in Indian tech firms and GCCs earn ₹6.5L–₹15.0L LPA, significantly outpacing the ₹3.0L–₹5.0L band of manual HR admin roles.'
    }
  }
];
