export interface SkillDetail {
  slug: string;
  title: string;
  category: 'tech' | 'business' | 'vocational';
  categoryLabel: string;
  shortDesc: string;
  longDesc: string;
  heroImage: string;
  salaryRange: string;
  minSalaryLPA: number;
  maxSalaryLPA: number;
  averageSalaryLPA: number;
  timelineWeeks: string;
  hiringVolume: string;
  experienceLevel: 'Fresher Friendly' | 'Intermediate' | 'Advanced' | 'All Levels' | 'Intermediate to Advanced';
  topCities: string[];
  tools: string[];
  keyHighlights: string[];
  syllabus: {
    phase: string;
    weeks: string;
    topics: string[];
    project: string;
  }[];
  jobRoles: {
    title: string;
    salary: string;
    demand: string;
  }[];
  interviewQuestions: {
    question: string;
    answer: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
  relatedSkills: string[];
}

export const skillsData: SkillDetail[] = [
  // =================== TECH SKILLS ===================
  {
    slug: 'data-analytics',
    title: 'Data Analytics & Business Intelligence',
    category: 'tech',
    categoryLabel: 'High-Demand Tech',
    shortDesc: 'Master SQL queries, Power BI DAX measures, Advanced Excel MIS, and Python ETL pipelines for high-paying Indian IT and FinTech roles.',
    longDesc: 'Data Analytics is the highest-volume non-coding-heavy entry into Indian IT, GCCs, and FinTech powerhouses. This comprehensive blueprint guides you from raw relational data to executive dashboards, bridging SQL window functions, dimensional modeling, and interactive storytelling.',
    heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
    salaryRange: '₹5.5L – ₹14.0L LPA',
    minSalaryLPA: 5.5,
    maxSalaryLPA: 14.0,
    averageSalaryLPA: 8.5,
    timelineWeeks: '12 – 14 Weeks',
    hiringVolume: '14,000+ Openings',
    experienceLevel: 'Fresher Friendly',
    topCities: ['Bengaluru', 'Hyderabad', 'Pune', 'Gurugram', 'Mumbai'],
    tools: ['SQL Server', 'Power BI', 'Advanced Excel', 'Python Pandas', 'Tableau', 'PostgreSQL'],
    keyHighlights: [
      'Zero heavy math or complex algorithms required to get hired',
      'Massive demand across Banking, Healthcare, E-Commerce, and SaaS',
      'High conversion from junior analyst to Senior BI Consultant within 2 years'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Advanced Excel & SQL Foundations',
        weeks: 'Weeks 1 - 4',
        topics: ['XLOOKUP, INDEX-MATCH & Pivot Charts', 'SQL DDL & DML, GROUP BY, HAVING, subqueries', 'Window functions: DENSE_RANK, LEAD, LAG, PARTITION BY'],
        project: 'Indian E-Commerce Sales SQL Analysis using multi-table joins on Kaggle dataset.'
      },
      {
        phase: 'Phase 2: Power BI, DAX & Data Modeling',
        weeks: 'Weeks 5 - 9',
        topics: ['Star & Snowflake Schemas, Cardinality & Relationships', 'DAX Measures: CALCULATE, ALLSELECTED, SAMEPERIODLASTYEAR', 'Interactive visual hierarchies, drill-throughs, and row-level security (RLS)'],
        project: 'Swiggy & Zomato Delivery Performance & Delivery Time Optimization Dashboard.'
      },
      {
        phase: 'Phase 3: Python Data Cleaning & Portfolio',
        weeks: 'Weeks 10 - 14',
        topics: ['Pandas for missing value treatment & outlier detection', 'Seaborn & Matplotlib for exploratory visualization', 'Publishing live NovyPro dashboards and GitHub portfolio repositories'],
        project: 'End-to-End Indian FinTech Loan Default Risk Analysis with automated reporting.'
      }
    ],
    jobRoles: [
      { title: 'Junior Data Analyst', salary: '₹4.5L – ₹7.0L', demand: 'Very High' },
      { title: 'BI Developer (Power BI / Tableau)', salary: '₹7.0L – ₹12.5L', demand: 'High' },
      { title: 'Senior Business Analyst', salary: '₹12.0L – ₹18.0L', demand: 'Moderate' }
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between RANK(), DENSE_RANK(), and ROW_NUMBER() in SQL?',
        answer: 'ROW_NUMBER assigns a unique sequential integer to each row. RANK assigns identical numbers for tied values but skips subsequent numbers (e.g. 1, 2, 2, 4). DENSE_RANK does not skip ranks on ties (e.g. 1, 2, 2, 3).'
      },
      {
        question: 'Explain the CALCULATE function in Power BI DAX with an example.',
        answer: 'CALCULATE evaluates an expression in a modified filter context. Example: CALCULATE(SUM(Sales[Amount]), Region[Country] = "India") calculates total sales specifically filtered for India.'
      }
    ],
    faqs: [
      { question: 'Do I need a Computer Science degree for Data Analytics?', answer: 'No. Graduates from Commerce, Engineering, Economics, Arts, and Sciences routinely transition to Data Analytics by proving SQL and Power BI portfolio projects.' },
      { question: 'What is the starting salary in Tier-1 vs Tier-2 cities in India?', answer: 'In Bengaluru and Hyderabad, freshers average ₹5L–₹7.5L LPA. In Tier-2 cities like Jaipur, Indore, and Coimbatore, starting salaries range between ₹3.5L–₹5L LPA.' }
    ],
    relatedSkills: ['ai-prompt-engineering', 'advanced-excel', 'cloud-computing', 'python-automation']
  },
  {
    slug: 'ai-prompt-engineering',
    title: 'AI Automation & Practical Prompt Engineering',
    category: 'tech',
    categoryLabel: 'AI Tools & Automation',
    shortDesc: 'Harness OpenAI/Claude APIs, Cursor AI, RAG knowledge bases, and LangChain agents to build commercial automation pipelines.',
    longDesc: 'Practical workplace AI is shifting from abstract machine learning theory to operational generative AI workflows. Learn how to architect Retrieval-Augmented Generation (RAG) vector pipelines, orchestrate multi-agent workflows, and leverage IDEs like Cursor to supercharge engineering throughput.',
    heroImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80',
    salaryRange: '₹8.0L – ₹24.0L LPA',
    minSalaryLPA: 8.0,
    maxSalaryLPA: 24.0,
    averageSalaryLPA: 14.5,
    timelineWeeks: '8 – 12 Weeks',
    hiringVolume: '9,500+ Openings',
    experienceLevel: 'Intermediate',
    topCities: ['Bengaluru', 'Gurugram', 'Hyderabad', 'Pune', 'San Francisco (Remote)'],
    tools: ['OpenAI API', 'Claude 3.7', 'LangChain', 'Cursor AI', 'Pinecone / Qdrant', 'LlamaIndex', 'Python'],
    keyHighlights: [
      'Highest compensation upside and growth rate in the modern software landscape',
      'Huge demand from Indian startups, SaaS companies, and global remote agencies',
      'Focus on real-world tool calling, structured outputs, and enterprise guardrails'
    ],
    syllabus: [
      {
        phase: 'Phase 1: LLM Fundamentals & Prompt Crafting',
        weeks: 'Weeks 1 - 3',
        topics: ['System prompts, few-shot conditioning, Chain-of-Thought (CoT)', 'JSON mode & structured outputs validation with Pydantic', 'API cost optimization, token management & rate limit handling'],
        project: 'Enterprise Email Escalation Triage Bot with automated customer sentiment analysis.'
      },
      {
        phase: 'Phase 2: RAG Systems & Vector Databases',
        weeks: 'Weeks 4 - 7',
        topics: ['Text embeddings (OpenAI text-embedding-3, Cohere)', 'Chunking strategies (sliding window, recursive character)', 'Vector DBs (Pinecone, ChromaDB, PGVector) and hybrid search'],
        project: 'Indian Legal & Tax Circulars RAG Assistant with citation back-referencing.'
      },
      {
        phase: 'Phase 3: Autonomous Agents & Tool Use',
        weeks: 'Weeks 8 - 12',
        topics: ['LangGraph / CrewAI multi-agent orchestration', 'Function calling with external APIs (SERP, Weather, Database)', 'Evaluation frameworks (Ragas) and security red-teaming against prompt injections'],
        project: 'Autonomous Competitor Research Agent that scrapes pricing and generates executive slide summaries.'
      }
    ],
    jobRoles: [
      { title: 'Generative AI Engineer', salary: '₹10.0L – ₹20.0L', demand: 'Very High' },
      { title: 'Prompt & Automation Architect', salary: '₹12.0L – ₹24.0L', demand: 'High' },
      { title: 'AI Solutions Consultant', salary: '₹14.0L – ₹28.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'What is RAG (Retrieval-Augmented Generation) and why is it preferred over fine-tuning?',
        answer: 'RAG dynamically fetches relevant private documents from a vector store at query time and provides them in context. It is cost-effective, prevents hallucinations, and allows instant real-time knowledge updates without re-training.'
      },
      {
        question: 'How do you prevent prompt injection attacks in production applications?',
        answer: 'Use strict system prompt boundary delimiters (XML tags), input sanitization, secondary LLM evaluator guardrails (like Llama Guard), and enforce read-only tool permissions.'
      }
    ],
    faqs: [
      { question: 'Is coding necessary for Prompt Engineering & AI Automation?', answer: 'Basic Python is recommended for connecting LLM APIs, vector stores, and creating full web automation workflows.' },
      { question: 'Can freshers apply for Generative AI Engineer roles?', answer: 'Yes, if you have live deployed demos on GitHub showcasing RAG and LLM tool integrations rather than just notebook experiments.' }
    ],
    relatedSkills: ['data-analytics', 'full-stack-web', 'python-automation', 'machine-learning']
  },
  {
    slug: 'full-stack-web',
    title: 'Full-Stack Web Development (Next.js & MERN)',
    category: 'tech',
    categoryLabel: 'Evergreen IT Core',
    shortDesc: 'Build resilient web apps with Next.js App Router, React, Node.js / Java Spring Boot, PostgreSQL, and live Razorpay payment checkouts.',
    longDesc: 'Full-Stack Development remains the anchor of digital product development worldwide. Master component architectures, server actions, relational schema design, JWT auth, and production deployments on modern cloud platforms.',
    heroImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=900&q=80',
    salaryRange: '₹4.8L – ₹18.0L LPA',
    minSalaryLPA: 4.8,
    maxSalaryLPA: 18.0,
    averageSalaryLPA: 9.2,
    timelineWeeks: '16 – 20 Weeks',
    hiringVolume: '28,000+ Openings',
    experienceLevel: 'Fresher Friendly',
    topCities: ['Bengaluru', 'Pune', 'NCR', 'Hyderabad', 'Chennai'],
    tools: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Node.js / Express', 'PostgreSQL / Prisma', 'Docker'],
    keyHighlights: [
      'Highest hiring volume across service companies (TCS, Infosys) and product unicorns (Zomato, Swiggy, CRED)',
      'Versatile skillset enabling full-time engineering, contract freelancing, and indie hacking',
      'Strong upward trajectory to Tech Lead and Engineering Manager'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Modern JS, React & Tailwind',
        weeks: 'Weeks 1 - 6',
        topics: ['ES6+, closures, async/await, Fetch API', 'React state, hooks (useState, useEffect, custom hooks)', 'Tailwind CSS layout responsiveness and dark mode design systems'],
        project: 'Zerodha-style live trading and watchlist interface simulator.'
      },
      {
        phase: 'Phase 2: Backend APIs & Relational Databases',
        weeks: 'Weeks 7 - 12',
        topics: ['Node.js/Express or Spring Boot REST standards', 'PostgreSQL schema modeling, indexes, and Prisma ORM', 'JWT authentication, RBAC, and rate limiting'],
        project: 'Indian GST compliant multi-tenant Invoicing API with PDF downloads.'
      },
      {
        phase: 'Phase 3: Next.js App Router, Payments & Deployments',
        weeks: 'Weeks 13 - 18',
        topics: ['Next.js Server Components, Server Actions, and Caching', 'Razorpay / Stripe Webhook payment integration', 'Vercel, Docker containers, and GitHub Actions CI/CD'],
        project: 'Production EdTech Course Marketplace with verified payment gateway.'
      }
    ],
    jobRoles: [
      { title: 'Frontend Developer', salary: '₹4.5L – ₹10.0L', demand: 'Very High' },
      { title: 'Full-Stack Engineer', salary: '₹6.5L – ₹18.0L', demand: 'Very High' },
      { title: 'Backend Software Engineer', salary: '₹7.0L – ₹16.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between React Server Components (RSC) and Client Components in Next.js?',
        answer: 'Server Components execute only on the server, producing zero client-side JavaScript bundle and allowing direct database access. Client Components render on client (and pre-render on server) to handle interactivity, state, and browser APIs.'
      },
      {
        question: 'How do you handle database connection pooling in serverless environments?',
        answer: 'Use connection pooling proxies like Prisma Accelerate, PgBouncer, or Supabase connection pooling to avoid exhausting PostgreSQL max connection limits during serverless scaling.'
      }
    ],
    faqs: [
      { question: 'Should I learn MERN (Mongo/Express/React/Node) or Next.js + PostgreSQL in 2026?', answer: 'Next.js + PostgreSQL (with Prisma or Drizzle) is the industry standard for modern startups and high-paying roles.' }
    ],
    relatedSkills: ['cloud-computing', 'devops-sre', 'ui-ux-design', 'mobile-app-dev']
  },
  {
    slug: 'cloud-computing',
    title: 'Cloud Architecture (AWS & Azure)',
    category: 'tech',
    categoryLabel: 'Enterprise & GCCs',
    shortDesc: 'Design secure, scalable multi-tier architectures on AWS and Azure. Master S3, EC2, IAM, Lambda serverless, and VPC networking.',
    longDesc: 'Cloud engineers are in monumental demand as Indian IT services and GCCs migrate on-premise infrastructure to public cloud. Learn how to configure resilient networks, implement zero-trust IAM, optimize cloud costs, and deploy serverless backends.',
    heroImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80',
    salaryRange: '₹7.0L – ₹22.0L LPA',
    minSalaryLPA: 7.0,
    maxSalaryLPA: 22.0,
    averageSalaryLPA: 12.8,
    timelineWeeks: '10 – 14 Weeks',
    hiringVolume: '16,000+ Openings',
    experienceLevel: 'Intermediate',
    topCities: ['Hyderabad', 'Bengaluru', 'Pune', 'Chennai', 'Noida'],
    tools: ['AWS (S3, EC2, Lambda, RDS, VPC)', 'Microsoft Azure (AZ-104)', 'Terraform', 'CloudWatch', 'Docker'],
    keyHighlights: [
      'AWS Solutions Architect (SAA-C03) certification provides an immediate +35% salary boost',
      'Preferred career track for sysadmins and network engineers transitioning to modern IT',
      'High remote and global mobility prospects across US/UK/Middle East clients'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Cloud Core & Identity',
        weeks: 'Weeks 1 - 4',
        topics: ['Cloud fundamentals, regions, and availability zones', 'IAM policies, roles, MFA, and least-privilege security', 'VPC subnets, route tables, internet gateways, and security groups'],
        project: 'Secure High-Availability Dual-AZ Web Tier Architecture in AWS VPC.'
      },
      {
        phase: 'Phase 2: Storage, Compute & Databases',
        weeks: 'Weeks 5 - 8',
        topics: ['S3 lifecycle rules, versioning, and presigned URLs', 'EC2 autoscaling, Application Load Balancers (ALB)', 'RDS multi-AZ failover and DynamoDB NoSQL basics'],
        project: 'Automated Media Transcoding Pipeline using S3 events, Lambda, and DynamoDB.'
      },
      {
        phase: 'Phase 3: Serverless, Cost & Certification Prep',
        weeks: 'Weeks 9 - 14',
        topics: ['AWS Lambda, API Gateway, and Step Functions', 'AWS Cost Explorer & FinOps cost optimization principles', 'AWS SAA-C03 / Azure AZ-104 mock practice exams'],
        project: 'Serverless Indian Weather & Crop Advisory Notification Engine with SES.'
      }
    ],
    jobRoles: [
      { title: 'Cloud Support Associate', salary: '₹5.5L – ₹8.5L', demand: 'High' },
      { title: 'AWS / Azure Cloud Engineer', salary: '₹8.0L – ₹16.0L', demand: 'Very High' },
      { title: 'Cloud Solutions Architect', salary: '₹16.0L – ₹28.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between a Security Group and a Network ACL (NACL) in AWS?',
        answer: 'Security Groups operate at the instance/ENI level, are stateful (inbound allows corresponding outbound), and support allow rules only. NACLs operate at the subnet level, are stateless, and support both allow and deny rules.'
      }
    ],
    faqs: [
      { question: 'Which certification should I get first: AWS SAA or Azure AZ-104?', answer: 'AWS Certified Solutions Architect Associate (SAA-C03) has the widest market recognition in Indian startups, while Azure AZ-104 is heavily favored by enterprise GCCs.' }
    ],
    relatedSkills: ['devops-sre', 'cybersecurity', 'full-stack-web', 'python-automation']
  },
  {
    slug: 'cybersecurity',
    title: 'Cybersecurity & SOC Analysis',
    category: 'tech',
    categoryLabel: 'BFSI & Compliance',
    shortDesc: 'Protect enterprise infrastructure through SIEM monitoring (Splunk), threat triage, Wireshark packet inspection, and CERT-In compliance.',
    longDesc: 'Driven by strict RBI digital banking directives and CERT-In cyber crisis mandates, cybersecurity specialists in India enjoy remarkable job stability and premium compensation. Learn Security Operations Center (SOC) Tier-1 triage, malware analysis, and network packet defense.',
    heroImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=900&q=80',
    salaryRange: '₹6.0L – ₹20.0L LPA',
    minSalaryLPA: 6.0,
    maxSalaryLPA: 20.0,
    averageSalaryLPA: 11.0,
    timelineWeeks: '14 – 18 Weeks',
    hiringVolume: '8,200+ Openings',
    experienceLevel: 'Intermediate',
    topCities: ['Mumbai', 'Chennai', 'Bengaluru', 'Hyderabad', 'Delhi NCR'],
    tools: ['Splunk SIEM', 'Wireshark', 'Nmap', 'Metasploit', 'Burp Suite', 'Linux', 'MITRE ATT&CK'],
    keyHighlights: [
      'Recession-proof industry driven by government mandates and corporate audits',
      'High hiring volume in Indian BFSI, Fintech, Telecom, and Big 4 Advisory firms',
      'Clear progression: SOC Tier 1 -> Tier 2 Incident Responder -> Threat Hunter'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Networking & Linux Security Core',
        weeks: 'Weeks 1 - 4',
        topics: ['TCP/IP handshakes, DNS, HTTP/S, ARP spoofing', 'Wireshark deep packet analysis', 'Linux file permissions, SSH hardening, and log inspection'],
        project: 'Packet Capture (PCAP) forensic investigation of a simulated DDoS and SYN Flood attack.'
      },
      {
        phase: 'Phase 2: SIEM, Log Analysis & Incident Response',
        weeks: 'Weeks 5 - 10',
        topics: ['Splunk Search Processing Language (SPL) & dashboards', 'MITRE ATT&CK matrix mapping', 'Brute force and privilege escalation alert triage'],
        project: 'Configuring Enterprise SOC Detection Rules for unauthorized lateral movement.'
      },
      {
        phase: 'Phase 3: Ethical Hacking & Regulatory Compliance',
        weeks: 'Weeks 11 - 18',
        topics: ['OWASP Top 10 web vulnerabilities (SQLi, XSS, SSRF)', 'CERT-In mandatory reporting guidelines & RBI CSFR framework', 'CompTIA Security+ / CEH mock prep'],
        project: 'Vulnerability Assessment and Penetration Testing (VAPT) Report for an Indian E-Commerce portal.'
      }
    ],
    jobRoles: [
      { title: 'SOC Tier 1 Analyst', salary: '₹5.0L – ₹9.0L', demand: 'High' },
      { title: 'VAPT Security Consultant', salary: '₹8.0L – ₹16.0L', demand: 'High' },
      { title: 'Cyber Threat Intelligence Specialist', salary: '₹14.0L – ₹24.0L', demand: 'Moderate' }
    ],
    interviewQuestions: [
      {
        question: 'Explain the difference between a False Positive and a False Negative in SOC analysis.',
        answer: 'A False Positive occurs when benign user activity is flagged as a security alert. A False Negative occurs when an actual cyberattack goes undetected by the security sensors.'
      }
    ],
    faqs: [
      { question: 'Is coding required for a SOC Analyst?', answer: 'Deep software engineering is not needed; however, basic Python/Bash scripting and query language (SPL/KQL) proficiency is vital.' }
    ],
    relatedSkills: ['cloud-computing', 'devops-sre', 'python-automation']
  },
  {
    slug: 'devops-sre',
    title: 'DevOps & Site Reliability Engineering',
    category: 'tech',
    categoryLabel: 'Top Mid-Career Multiplier',
    shortDesc: 'Automate build pipelines, orchestrate Kubernetes clusters, manage infrastructure with Terraform, and achieve 99.99% uptime.',
    longDesc: 'DevOps & SRE engineers bridge the gap between software development and production stability. Highly valued for doubling deployment velocity and reducing cloud incidents, this track covers containerization, CI/CD pipelines, GitOps, and observability.',
    heroImage: 'https://images.unsplash.com/photo-1618401471353-b98aedd04e11?auto=format&fit=crop&w=900&q=80',
    salaryRange: '₹8.5L – ₹28.0L LPA',
    minSalaryLPA: 8.5,
    maxSalaryLPA: 28.0,
    averageSalaryLPA: 16.0,
    timelineWeeks: '14 – 20 Weeks',
    hiringVolume: '15,500+ Openings',
    experienceLevel: 'Advanced',
    topCities: ['Bengaluru', 'Hyderabad', 'Pune', 'Gurugram', 'Chennai'],
    tools: ['Docker', 'Kubernetes (K8s)', 'Terraform', 'GitHub Actions', 'Jenkins', 'Prometheus & Grafana', 'Linux'],
    keyHighlights: [
      'Fastest pathway for QA testers and Linux sysadmins to achieve 2x–3x salary hikes',
      'Key requirement for all modern product startups and GCCs scaling in India',
      'Mastery of Kubernetes (CKA) commands premium remuneration'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Linux, Shell Scripting & GitOps',
        weeks: 'Weeks 1 - 4',
        topics: ['Linux process management, cron jobs, network diagnostics', 'Bash scripting for automated server backups', 'Git branching strategies and release management'],
        project: 'Automated Multi-Stage Server Provisioning Script with SSL setup.'
      },
      {
        phase: 'Phase 2: Docker Containers & CI/CD Pipelines',
        weeks: 'Weeks 5 - 10',
        topics: ['Multi-stage Dockerfiles and container optimization', 'GitHub Actions & Jenkins CI/CD pipeline creation', 'SonarQube code quality scans & artifact registries'],
        project: 'Zero-Downtime Blue-Green Deployment Pipeline with automated rollbacks.'
      },
      {
        phase: 'Phase 3: Kubernetes, Terraform IaC & Observability',
        weeks: 'Weeks 11 - 18',
        topics: ['Kubernetes Pods, Deployments, Services, Ingress & Helm', 'Terraform modular infrastructure provisioning on AWS', 'Prometheus metric scraping and Grafana alert dashboards'],
        project: 'Production-Grade Kubernetes Microservices Cluster with Autoscaling & Alerts.'
      }
    ],
    jobRoles: [
      { title: 'DevOps Engineer', salary: '₹8.0L – ₹18.0L', demand: 'Very High' },
      { title: 'Site Reliability Engineer (SRE)', salary: '₹12.0L – ₹25.0L', demand: 'High' },
      { title: 'Cloud Infrastructure Architect', salary: '₹20.0L – ₹35.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'What is the purpose of Kubernetes Ingress compared to a NodePort or LoadBalancer Service?',
        answer: 'NodePort opens a port on every node, while LoadBalancer provisions an external cloud load balancer for each service. Ingress provides a single consolidated HTTP/HTTPS routing entry point for multiple services with host/path-based routing, reducing cloud costs.'
      }
    ],
    faqs: [
      { question: 'Can a fresher get hired directly into a DevOps role?', answer: 'While junior DevOps roles exist, candidates with strong Linux foundations, personal Kubernetes cluster projects, and automated CI/CD portfolios stand out drastically.' }
    ],
    relatedSkills: ['cloud-computing', 'full-stack-web', 'cybersecurity', 'python-automation']
  },
  {
    slug: 'python-automation',
    title: 'Python Automation & Web Scraping',
    category: 'tech',
    categoryLabel: 'Practical Tech Scripting',
    shortDesc: 'Automate repetitive workflows, parse complex PDF/Excel files, and extract web data using Selenium, Beautiful Soup, and FastAPI.',
    longDesc: 'Python remains the lingua franca of automation and scripting. Master end-to-end data pipelines that scrape public listings, automatically email executive summaries, process PDFs, and expose quick microservices.',
    heroImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=900&q=80',
    salaryRange: '₹4.5L – ₹12.5L LPA',
    minSalaryLPA: 4.5,
    maxSalaryLPA: 12.5,
    averageSalaryLPA: 7.5,
    timelineWeeks: '8 – 10 Weeks',
    hiringVolume: '12,000+ Openings',
    experienceLevel: 'Fresher Friendly',
    topCities: ['Bengaluru', 'Pune', 'Noida', 'Hyderabad', 'Kolkata'],
    tools: ['Python 3', 'Playwright / Selenium', 'BeautifulSoup', 'Pandas', 'FastAPI', 'Celery'],
    keyHighlights: [
      'Easiest first programming language with immense immediate workplace utility',
      'High freelance demand for web data extraction and lead scraping on Upwork',
      'Direct springboard to Data Engineering, Machine Learning, and QA Automation'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Core Python & File Automation',
        weeks: 'Weeks 1 - 3',
        topics: ['Data structures, list comprehensions, error handling', 'Working with OS, JSON, CSV, and Excel automation (openpyxl)', 'Regex for phone and PAN/GST extraction'],
        project: 'Automated Invoice Renamer and CSV consolidator from messy folder dumps.'
      },
      {
        phase: 'Phase 2: Web Scraping & Browser Automation',
        weeks: 'Weeks 4 - 6',
        topics: ['BeautifulSoup HTML parsing and requests session handling', 'Playwright for JavaScript-heavy dynamic websites', 'Bypassing basic CAPTCHAs, proxies, and user-agent rotation'],
        project: 'Daily Indian Real-Estate and Gold Price Web Scraper with email alerts.'
      },
      {
        phase: 'Phase 3: APIs, Fast Microservices & Scheduling',
        weeks: 'Weeks 7 - 10',
        topics: ['FastAPI endpoints and OpenAPI documentation', 'Celery & Redis background task queues', 'Cron scheduling and deployment on cloud instances'],
        project: 'Public Competitor Pricing API that delivers structured JSON feeds.'
      }
    ],
    jobRoles: [
      { title: 'Python Developer / Automation Specialist', salary: '₹4.5L – ₹9.0L', demand: 'High' },
      { title: 'Web Scraping & Data Acquisition Engineer', salary: '₹6.0L – ₹11.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'What is the Global Interpreter Lock (GIL) in Python?',
        answer: 'The GIL is a mutex that allows only one thread to hold control of the Python interpreter at a time in CPython. For CPU-bound tasks, multiprocessing is preferred over multithreading to achieve true concurrency.'
      }
    ],
    faqs: [
      { question: 'Is Python automation useful for non-IT professionals?', answer: 'Yes! Finance executives, operations managers, and marketers save 10+ hours a week automating spreadsheets and reporting.' }
    ],
    relatedSkills: ['data-analytics', 'ai-prompt-engineering', 'advanced-excel']
  },
  {
    slug: 'mobile-app-dev',
    title: 'Mobile App Development (Flutter & React Native)',
    category: 'tech',
    categoryLabel: 'Cross-Platform Mobile',
    shortDesc: 'Build performant cross-platform iOS and Android apps with Flutter/Dart or React Native, Supabase backend, and offline caching.',
    longDesc: 'India is a mobile-first nation with over 750 million smartphone users. Cross-platform mobile developers who can craft fluid 60 FPS user interfaces and integrate push notifications and native device sensors are in constant demand.',
    heroImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=900&q=80',
    salaryRange: '₹5.0L – ₹16.0L LPA',
    minSalaryLPA: 5.0,
    maxSalaryLPA: 16.0,
    averageSalaryLPA: 9.0,
    timelineWeeks: '14 – 16 Weeks',
    hiringVolume: '10,000+ Openings',
    experienceLevel: 'Intermediate',
    topCities: ['Bengaluru', 'Gurugram', 'Hyderabad', 'Pune', 'Ahmedabad'],
    tools: ['Flutter / Dart', 'React Native / Expo', 'Firebase', 'Supabase', 'Redux / Riverpod', 'App Store / Play Store Deploy'],
    keyHighlights: [
      'Single codebase builds production apps for both Google Play and Apple App Store',
      'Massive startup demand for consumer apps in Quick-Commerce, EdTech, and HealthTech',
      'High opportunities for direct Google Play monetization through micro-apps'
    ],
    syllabus: [
      {
        phase: 'Phase 1: UI Widgets & Cross-Platform Fundamentals',
        weeks: 'Weeks 1 - 5',
        topics: ['Dart / React Native syntax and component lifecycle', 'Layouts, responsive grids, custom animations', 'State management (Riverpod / Zustand / Redux)'],
        project: 'Swiggy Instamart-style Cart & Grocery browsing mobile interface.'
      },
      {
        phase: 'Phase 2: Authentication, APIs & Offline Database',
        weeks: 'Weeks 6 - 10',
        topics: ['Firebase Phone Auth (OTP) & Supabase integration', 'REST and GraphQL consumption with Dio/Axios', 'Offline storage with Hive / SQLite and optimistic UI updates'],
        project: 'Indian Daily Expense & Splitwise Clone with offline sync.'
      },
      {
        phase: 'Phase 3: Hardware Sensors, Push & App Publishing',
        weeks: 'Weeks 11 - 16',
        topics: ['Camera, GPS location tracking, and biometric auth', 'FCM Push notifications and deep linking', 'Play Store Console & Apple Developer publishing guidelines'],
        project: 'Hyperlocal Delivery Tracker with live GPS location pinning.'
      }
    ],
    jobRoles: [
      { title: 'Flutter Developer', salary: '₹5.0L – ₹12.0L', demand: 'High' },
      { title: 'React Native Developer', salary: '₹6.0L – ₹15.0L', demand: 'High' },
      { title: 'Mobile Solutions Architect', salary: '₹14.0L – ₹24.0L', demand: 'Moderate' }
    ],
    interviewQuestions: [
      {
        question: 'Explain the difference between Hot Reload and Hot Restart in Flutter.',
        answer: 'Hot Reload injects updated source code into the running Dart VM, preserving the existing app state. Hot Restart resets the entire app state and restarts the Dart app, loading updated code from scratch.'
      }
    ],
    faqs: [
      { question: 'Which is better to learn: Flutter or React Native?', answer: 'Both have huge demand. If you know React/Web, React Native is faster to pick up. If you want blistering 60 FPS performance and clean typing, Flutter is exceptional.' }
    ],
    relatedSkills: ['full-stack-web', 'ui-ux-design', 'cloud-computing']
  },
  {
    slug: 'machine-learning',
    title: 'Machine Learning & MLOps',
    category: 'tech',
    categoryLabel: 'Advanced Data Science',
    shortDesc: 'Build predictive regression, classification, and deep learning models with Scikit-Learn, PyTorch, and deploy models via MLflow and Docker.',
    longDesc: 'Go beyond theoretical algorithms into production machine learning. Learn data preprocessing, feature engineering, neural network architectures, and the MLOps pipeline to monitor model drift and performance.',
    heroImage: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=900&q=80',
    salaryRange: '₹9.0L – ₹26.0L LPA',
    minSalaryLPA: 9.0,
    maxSalaryLPA: 26.0,
    averageSalaryLPA: 15.5,
    timelineWeeks: '16 – 22 Weeks',
    hiringVolume: '7,500+ Openings',
    experienceLevel: 'Advanced',
    topCities: ['Bengaluru', 'Hyderabad', 'Gurugram', 'Pune', 'Noida'],
    tools: ['Python', 'Scikit-Learn', 'PyTorch', 'TensorFlow', 'MLflow', 'FastAPI', 'Docker'],
    keyHighlights: [
      'Premium package ceilings in Indian FinTech, E-Commerce recommendations, and Healthcare',
      'Transition path for senior data analysts seeking deep algorithmic modeling',
      'Focus on real-time serving, low latency inference, and continuous retraining'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Math Foundations & Supervised Algorithms',
        weeks: 'Weeks 1 - 6',
        topics: ['Linear Algebra, Probability, Calculus intuitions', 'Regression, Decision Trees, Random Forests, XGBoost', 'Hyperparameter tuning with Optuna and cross-validation'],
        project: 'Indian Used Car Price Valuation Predictor with feature importance analysis.'
      },
      {
        phase: 'Phase 2: Deep Learning & Computer Vision / NLP',
        weeks: 'Weeks 7 - 14',
        topics: ['Neural networks, backpropagation, and PyTorch tensors', 'CNNs for image classification and Object Detection (YOLO)', 'Transformers, BERT, and sentiment analysis'],
        project: 'Medical Chest X-Ray Disease Classification Model with 92%+ accuracy.'
      },
      {
        phase: 'Phase 3: MLOps, Model Deployment & Monitoring',
        weeks: 'Weeks 15 - 22',
        topics: ['Model packaging with ONNX and FastAPI serving', 'MLflow experiment tracking and model registry', 'Detecting data drift and concept drift in production'],
        project: 'Real-time FinTech Credit Card Fraud Detection Microservice with latency SLA under 50ms.'
      }
    ],
    jobRoles: [
      { title: 'Junior Data Scientist', salary: '₹7.0L – ₹12.0L', demand: 'High' },
      { title: 'Machine Learning Engineer', salary: '₹11.0L – ₹22.0L', demand: 'High' },
      { title: 'Lead AI Scientist', salary: '₹22.0L – ₹40.0L', demand: 'Moderate' }
    ],
    interviewQuestions: [
      {
        question: 'How do you handle severe class imbalance in a dataset (e.g. 99% non-fraud, 1% fraud)?',
        answer: 'Use techniques such as SMOTE (Synthetic Minority Over-sampling), cost-sensitive loss functions (focal loss), undersampling majority classes, and evaluate using Precision-Recall AUC (PR-AUC) or F1-score rather than accuracy.'
      }
    ],
    faqs: [
      { question: 'Is a Master’s degree compulsory for Machine Learning?', answer: 'Not strictly, but strong mathematical maturity and documented Kaggle or GitHub implementations are heavily screened.' }
    ],
    relatedSkills: ['data-analytics', 'ai-prompt-engineering', 'python-automation']
  },

  // =================== BUSINESS & PROFESSIONAL SKILLS ===================
  {
    slug: 'digital-marketing',
    title: 'Digital & Performance Marketing',
    category: 'business',
    categoryLabel: 'Business & Growth',
    shortDesc: 'Master Meta Ads Manager, Google Search & PMax Ads, GA4 Analytics, and Technical SEO to scale Indian D2C brands and agency clients.',
    longDesc: 'Digital marketing has evolved into an engineering-adjacent discipline driven by data, conversion rate optimization (CRO), and ROAS calculations. Learn full-funnel customer acquisition, creative strategy, and search indexing.',
    heroImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80',
    salaryRange: '₹3.8L – ₹12.0L LPA',
    minSalaryLPA: 3.8,
    maxSalaryLPA: 12.0,
    averageSalaryLPA: 7.0,
    timelineWeeks: '8 – 12 Weeks',
    hiringVolume: '22,000+ Openings',
    experienceLevel: 'Fresher Friendly',
    topCities: ['Gurugram', 'Mumbai', 'Bengaluru', 'Delhi NCR', 'Tier-2 Agencies'],
    tools: ['Meta Ads Manager', 'Google Ads', 'Google Analytics 4 (GA4)', 'Ahrefs / SEMrush', 'Shopify', 'Canva'],
    keyHighlights: [
      'Zero degree barriers; direct portfolio evaluation based on live ad spends and ROAS results',
      'Massive freelance retainer potential (₹25,000 to ₹60,000 per client per month)',
      'Directly applicable to launch your own D2C, dropshipping, or agency business'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Search Engine Optimization & Content',
        weeks: 'Weeks 1 - 4',
        topics: ['Keyword intent research and SERP competitive analysis', 'On-page SEO, schema markup, and technical site health audits', 'Backlink acquisition and digital PR pitching'],
        project: 'Comprehensive SEO Growth Audit and Content Strategy for an Indian D2C Skincare Brand.'
      },
      {
        phase: 'Phase 2: Meta Ads & Paid Social Acquisition',
        weeks: 'Weeks 5 - 8',
        topics: ['Broad targeting, CBO vs ABO budgeting, and pixel setup', 'Creative hooks, UGC video frameworks, and direct response copywriting', 'A/B testing ad variations and calculating Break-even ROAS'],
        project: 'Live ₹10,000 Ad Campaign setup and optimization achieving 3.5x ROAS.'
      },
      {
        phase: 'Phase 3: Google Ads, GA4 & Full Funnel Retention',
        weeks: 'Weeks 9 - 12',
        topics: ['Google Search, Performance Max (PMax), and YouTube ads', 'GA4 event tracking, conversion funnels, and UTM parameters', 'Email/WhatsApp automation flows (Klaviyo / Wati)'],
        project: 'Full-Funnel Omnichannel Growth Blueprint with WhatsApp cart abandonment automation.'
      }
    ],
    jobRoles: [
      { title: 'SEO Specialist', salary: '₹3.5L – ₹7.0L', demand: 'High' },
      { title: 'Performance Marketing Executive', salary: '₹5.0L – ₹11.0L', demand: 'Very High' },
      { title: 'Growth Marketing Lead', salary: '₹12.0L – ₹22.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'What is ROAS and how do you calculate Break-even ROAS?',
        answer: 'ROAS (Return on Ad Spend) = Total Revenue Generated / Total Ad Spend. Break-even ROAS = 1 / Gross Profit Margin Percentage. For example, if a product has a 50% profit margin, Break-even ROAS is 1 / 0.50 = 2.0x.'
      }
    ],
    faqs: [
      { question: 'Do I need a large budget to practice Meta and Google Ads?', answer: 'No. You can run test campaigns with as little as ₹500 to ₹1,000 to understand pixel fires, CPC, and CTR metrics.' }
    ],
    relatedSkills: ['freelancing-usd', 'graphic-figma', 'video-editing', 'advanced-excel']
  },
  {
    slug: 'communication-english',
    title: 'Business English & Executive Fluency',
    category: 'business',
    categoryLabel: 'Universal Multiplier',
    shortDesc: 'Overcome hesitation, master corporate email etiquette, STAR interview storytelling, and speech intonation for rapid salary hikes.',
    longDesc: 'Technical skills get you considered; exceptional communication gets you promoted and hired with top compensation. This intensive roadmap breaks language barriers, eliminates mother-tongue influence (MTI), and builds assertive executive presence.',
    heroImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80',
    salaryRange: '+40% to +70% Salary Multiplier',
    minSalaryLPA: 4.0,
    maxSalaryLPA: 15.0,
    averageSalaryLPA: 8.0,
    timelineWeeks: '6 – 8 Weeks',
    hiringVolume: 'Applicable across all 100,000+ roles',
    experienceLevel: 'All Levels',
    topCities: ['Pan-India', 'Bengaluru', 'Mumbai', 'NCR', 'Tier-2 Aspirants'],
    tools: ['STAR Framework', 'Loom Video Practice', 'Grammarly', 'Voice Recorder', 'Executive Memo Templates'],
    keyHighlights: [
      'Single biggest factor separating candidates in final HR and managerial rounds',
      'Transforms technical competence into compelling executive presentations',
      'Empowers Tier-2/3 college graduates to compete confidently with metro candidates'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Eliminating Hesitation & Voice Clarity',
        weeks: 'Weeks 1 - 2',
        topics: ['Breath control, vocal pacing, and syllable stress', 'Eliminating filler words ("um", "basically", "actually")', 'Daily 15-minute shadowing exercises and tongue-twister drills'],
        project: 'Recorded 2-Minute Professional "Tell Me About Yourself" Video pitch.'
      },
      {
        phase: 'Phase 2: Corporate Email & Written Presence',
        weeks: 'Weeks 3 - 5',
        topics: ['The BLUF (Bottom Line Up Front) email framework', 'Handling escalations, delays, and pushback politely but assertively', 'Executive status memos and Slack messaging etiquette'],
        project: 'Portfolio of 10 Professional Email Scenarios (Salary negotiation, project delays, client escalations).'
      },
      {
        phase: 'Phase 3: The STAR Interview Method & Negotiation',
        weeks: 'Weeks 6 - 8',
        topics: ['Structuring answers: Situation, Task, Action, Result', 'Handling behavioral questions ("Tell me about a time you failed")', 'Tactful salary negotiation scripts without sounding aggressive'],
        project: 'Mock Technical & Behavioral Interview Recording with peer review.'
      }
    ],
    jobRoles: [
      { title: 'Universal Booster for Software, Sales, Management, and Analytics', salary: 'Increases offers by ₹2L – ₹6L', demand: 'Critical' }
    ],
    interviewQuestions: [
      {
        question: 'How do you structure an answer using the STAR method?',
        answer: 'Situation (15% context), Task (15% your specific responsibility), Action (50% the exact steps and tools you implemented), Result (20% quantifiable outcome with percentage or revenue metrics).'
      }
    ],
    faqs: [
      { question: 'Can someone improve spoken English without an expensive coaching institute?', answer: 'Yes! Daily recorded practice, reading aloud, and structured frameworks like STAR produce dramatic improvements in 30 days.' }
    ],
    relatedSkills: ['resume-linkedin', 'bpo-support', 'digital-marketing', 'freelancing-usd']
  },
  {
    slug: 'advanced-excel',
    title: 'Advanced Excel & MIS Reporting',
    category: 'business',
    categoryLabel: 'Corporate Essential',
    shortDesc: 'Automate business reporting with XLOOKUP, dynamic arrays, Power Query ETL, and interactive management dashboards.',
    longDesc: 'Microsoft Excel powers the backend operations of almost every Indian enterprise, bank, and SME. Master modern dynamic arrays, nested lookups, automated Power Query data merges, and executive MIS dashboards.',
    heroImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=80',
    salaryRange: '₹3.5L – ₹9.5L LPA',
    minSalaryLPA: 3.5,
    maxSalaryLPA: 9.5,
    averageSalaryLPA: 5.8,
    timelineWeeks: '3 – 5 Weeks',
    hiringVolume: '35,000+ Openings',
    experienceLevel: 'Fresher Friendly',
    topCities: ['Mumbai', 'Delhi NCR', 'Bengaluru', 'Ahmedabad', 'Tier-2 Hubs'],
    tools: ['MS Excel 365', 'Power Query', 'Pivot Tables & Slicers', 'Dynamic Arrays (LET, LAMBDA, FILTER)', 'VBA Macros Basics'],
    keyHighlights: [
      'Fastest skill to learn with immediate productivity payoff on Day 1 of any office job',
      'Deceptively high leverage across Finance, Operations, HR, Supply Chain, and Sales',
      'Power Query transforms 4-hour manual copy-paste chores into a 5-second single click refresh'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Modern Formulas & Dynamic Arrays',
        weeks: 'Weeks 1 - 2',
        topics: ['XLOOKUP vs VLOOKUP/HLOOKUP, INDEX-MATCH-MATCH', 'Dynamic functions: FILTER, UNIQUE, SORT, SEQUENCE', 'Text manipulation: TEXTSPLIT, TEXTJOIN, nested IF/AND/OR logic'],
        project: 'Automated Employee Payroll & Attendance Calculator with tax brackets.'
      },
      {
        phase: 'Phase 2: Pivot Tables & Power Query ETL',
        weeks: 'Weeks 3 - 4',
        topics: ['Multi-file folder data ingestion in Power Query', 'Unpivoting columns, data type conversions, conditional columns', 'Pivot Tables, Slicers, Timelines, and calculated fields'],
        project: 'Multi-Branch Indian Retail Store Sales Consolidation Engine.'
      },
      {
        phase: 'Phase 3: Executive MIS Dashboard & VBA Basics',
        weeks: 'Weeks 5',
        topics: ['KPI scorecard design, chart formatting, color theory', 'Recording macros and basic VBA for button triggers', 'Protecting workbooks and automated email triggers'],
        project: 'Complete Interactive CEO Executive MIS Dashboard.'
      }
    ],
    jobRoles: [
      { title: 'MIS Executive', salary: '₹3.2L – ₹6.0L', demand: 'Very High' },
      { title: 'Operations Data Analyst', salary: '₹4.5L – ₹8.5L', demand: 'High' },
      { title: 'Commercial Business Associate', salary: '₹4.0L – ₹7.5L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'Why is XLOOKUP superior to VLOOKUP in modern Excel?',
        answer: 'XLOOKUP searches in any direction (left or right), defaults to exact match, does not break when columns are inserted/deleted, and handles missing values natively with an if_not_found argument.'
      }
    ],
    faqs: [
      { question: 'Is Excel still relevant when Power BI and Python exist?', answer: 'Yes! Over 80% of day-to-day corporate communication and fast decision modeling happens in Excel before any BI tool is touched.' }
    ],
    relatedSkills: ['data-analytics', 'tally-gst', 'python-automation']
  },
  {
    slug: 'freelancing-usd',
    title: 'Global Freelancing & Remote USD Work',
    category: 'business',
    categoryLabel: 'Earn in USD from India',
    shortDesc: 'Win international clients on Upwork/Fiverr, pitch high-converting proposals, receive USD via Wise, and claim 0% export GST with LUT.',
    longDesc: 'Tap into global currency arbitrage by delivering tech, design, marketing, or virtual services to US, European, and Australian clients while living in India. Learn profile optimization, the "First 2 Lines" proposal framework, and Indian banking compliance.',
    heroImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
    salaryRange: '₹80,000 – ₹3,50,000 / Month',
    minSalaryLPA: 9.6,
    maxSalaryLPA: 35.0,
    averageSalaryLPA: 18.0,
    timelineWeeks: '6 – 8 Weeks',
    hiringVolume: 'Global Remote Market',
    experienceLevel: 'All Levels',
    topCities: ['Work from Anywhere in India'],
    tools: ['Upwork', 'Fiverr', 'Wise / Payoneer', 'Loom', 'GST Portal (LUT)', 'Notion Client Portals'],
    keyHighlights: [
      'Earn $20 to $60/hour directly from overseas clients without moving abroad',
      'Learn legal Indian GST Letter of Undertaking (LUT) for 0% tax on software/service exports',
      'Build long-term monthly retainers with international businesses'
    ],
    syllabus: [
      {
        phase: 'Phase 1: High-Ticket Niche & Profile Proof',
        weeks: 'Weeks 1 - 2',
        topics: ['Narrow positioning (e.g., "Shopify Speed Optimization Specialist")', 'Portfolio case studies formatted with problem-action-results', 'Loom 60-second video introduction showing live work'],
        project: '100% Optimized Upwork & LinkedIn Freelance Profile with 3 case studies.'
      },
      {
        phase: 'Phase 2: High-Converting Proposal Bidding Strategy',
        weeks: 'Weeks 3 - 5',
        topics: ['The "First 2 Lines" proposal formula that gets 80%+ view rates', 'Spotting high-value clients and filtering low-budget tire-kickers', 'Conducting discovery calls and scope of work contracts'],
        project: 'Submitting 20 tailored proposals and booking first 3 international client discovery calls.'
      },
      {
        phase: 'Phase 3: Indian Inward Remittance, Wise & Tax LUT',
        weeks: 'Weeks 6 - 8',
        topics: ['Wise Business and local FIRC (Foreign Inward Remittance Certificate)', 'Applying for GST LUT (Letter of Undertaking) online for 0% export GST', 'Section 44ADA presumptive taxation for Indian freelance professionals'],
        project: 'Complete Freelance Business Operating Setup ready to receive USD/EUR/GBP.'
      }
    ],
    jobRoles: [
      { title: 'Independent Remote Contractor', salary: '₹1.0L – ₹3.5L / month', demand: 'High' },
      { title: 'Freelance Agency Founder', salary: '₹3.0L – ₹10.0L / month', demand: 'Growing' }
    ],
    interviewQuestions: [
      {
        question: 'What is GST LUT (Letter of Undertaking) for Indian Freelancers?',
        answer: 'GST LUT allows registered Indian service providers to export services to foreign clients at 0% GST (zero-rated supply) without paying IGST upfront and waiting for refunds.'
      }
    ],
    faqs: [
      { question: 'Is it hard to get the first job on Upwork?', answer: 'It is hard only if you send copy-pasted generic bids. By addressing the client’s exact pain point in the first 2 lines and attaching a short Loom screen recording, conversion jumps 5x.' }
    ],
    relatedSkills: ['digital-marketing', 'video-editing', 'graphic-figma', 'communication-english']
  },
  {
    slug: 'resume-linkedin',
    title: 'ATS Resume & LinkedIn Optimization',
    category: 'business',
    categoryLabel: 'Immediate High ROI',
    shortDesc: 'Craft single-column ATS-parsing resumes, optimize Naukri/LinkedIn recruiter algorithms, and execute cold DM outreach.',
    longDesc: 'Most job applications are rejected by Applicant Tracking Systems (ATS) before a human recruiter ever sees them. Learn how to format high-score resumes, optimize LinkedIn headlines and keywords, and write high-response cold messages to hiring managers.',
    heroImage: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=900&q=80',
    salaryRange: '3x to 5x More Interview Callbacks',
    minSalaryLPA: 5.0,
    maxSalaryLPA: 25.0,
    averageSalaryLPA: 12.0,
    timelineWeeks: '1 Weekend (48 Hours)',
    hiringVolume: 'Universal Advantage',
    experienceLevel: 'All Levels',
    topCities: ['Pan-India'],
    tools: ['ATS Parsers', 'LinkedIn Creator Mode', 'Naukri Recruiter Search', 'Overleaf / Plain Text', 'Hunter.io'],
    keyHighlights: [
      'Single highest ROI weekend investment you can make in your professional journey',
      'Transforms single-digit callback rates into multiple competing interview offers',
      'Teaches proactive outreach to bypass crowded job portals entirely'
    ],
    syllabus: [
      {
        phase: 'Phase 1: ATS Formatting & Action-Verb Bullets',
        weeks: 'Step 1 (Day 1)',
        topics: ['Single-column clean typography without tables, textboxes, or icons', 'Google "X-Y-Z" formula: Accomplished [X] as measured by [Y] by doing [Z]', 'Keyword alignment against target Job Descriptions (JD)'],
        project: 'ATS 90+ Score Industry-Tailored Resume.'
      },
      {
        phase: 'Phase 2: LinkedIn & Naukri Recruiter SEO',
        weeks: 'Step 2 (Day 2)',
        topics: ['Keyword stuffing the Headline and About sections naturally', 'Showcasing featured media, GitHub links, and recommendations', 'Daily profile refreshing algorithm hack for Naukri search rankings'],
        project: 'All-Star LinkedIn Profile & 100% Completed Naukri Account.'
      },
      {
        phase: 'Phase 3: Cold DM Scripts & Hiring Manager Outreach',
        weeks: 'Step 3 (Ongoing)',
        topics: ['Identifying engineering leads and HR decision makers', 'The 4-line value-first cold LinkedIn DM template', 'Follow-up cadences that do not sound desperate'],
        project: 'Sending 15 targeted outreach messages yielding 3+ interview requests.'
      }
    ],
    jobRoles: [
      { title: 'Universal Job Search Accelerator', salary: 'Unlocks higher negotiation leverage', demand: 'Essential' }
    ],
    interviewQuestions: [
      {
        question: 'Why do two-column graphical Canva resumes fail ATS scanners?',
        answer: 'Many legacy ATS parsers read resumes left-to-right across the entire page width, blending columns together and scrambling job titles, dates, and skill keywords into unreadable noise.'
      }
    ],
    faqs: [
      { question: 'Should freshers include college projects on their resume?', answer: 'Absolutely! Freshers should place 2 to 3 detailed real-world portfolio projects with live hosted links above their education section.' }
    ],
    relatedSkills: ['communication-english', 'freelancing-usd']
  },
  {
    slug: 'product-management',
    title: 'Product Management & Agile Strategy',
    category: 'business',
    categoryLabel: 'Product & Leadership',
    shortDesc: 'Drive product roadmaps from ideation to launch. Master PRD writing, user interview discovery, wireframing, and metric telemetry.',
    longDesc: 'Product Managers sit at the intersection of business, technology, and user experience. Learn customer empathy discovery, backlog prioritization (RICE framework), writing crisp Product Requirement Documents (PRDs), and tracking North Star metrics.',
    heroImage: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=900&q=80',
    salaryRange: '₹12.0L – ₹32.0L LPA',
    minSalaryLPA: 12.0,
    maxSalaryLPA: 32.0,
    averageSalaryLPA: 19.5,
    timelineWeeks: '12 – 16 Weeks',
    hiringVolume: '6,000+ Openings',
    experienceLevel: 'Intermediate to Advanced',
    topCities: ['Bengaluru', 'Gurugram', 'Mumbai', 'Hyderabad'],
    tools: ['Jira / Linear', 'Figma', 'Mixpanel / Amplitude', 'Miro', 'Notion PRD Templates'],
    keyHighlights: [
      'Among the most influential and well-compensated individual contributor roles in tech',
      'Ideal transition for software engineers, consultants, and business analysts',
      'High decision-making authority driving core company revenue metrics'
    ],
    syllabus: [
      {
        phase: 'Phase 1: User Discovery & Problem Definition',
        weeks: 'Weeks 1 - 4',
        topics: ['Jobs-to-be-done (JTBD) framework', 'Conducting unbiased user discovery interviews', 'Customer journey mapping and identifying key drop-off bottlenecks'],
        project: 'User Drop-off Root Cause Analysis and Solution Concept for an Indian FinTech App.'
      },
      {
        phase: 'Phase 2: Writing PRDs, Wireframing & Agile Backlogs',
        weeks: 'Weeks 5 - 9',
        topics: ['Writing thorough Product Requirement Documents (PRD)', 'Figma lo-fi wireframing and user flow diagrams', 'User stories, acceptance criteria, and Sprint planning in Jira'],
        project: 'Comprehensive PRD for a New WhatsApp-Based Quick Commerce Ordering Feature.'
      },
      {
        phase: 'Phase 3: Product Analytics, A/B Testing & GTM',
        weeks: 'Weeks 10 - 14',
        topics: ['North Star Metrics, LTV, CAC, and Retention cohort curves', 'Designing statistically significant A/B experiments', 'Go-To-Market (GTM) rollout and stakeholder management'],
        project: 'Full A/B Experiment Design & Product Tear-down Pitch Deck.'
      }
    ],
    jobRoles: [
      { title: 'Associate Product Manager (APM)', salary: '₹8.0L – ₹14.0L', demand: 'High' },
      { title: 'Product Manager (PM)', salary: '₹14.0L – ₹28.0L', demand: 'High' },
      { title: 'Principal Product Manager', salary: '₹28.0L – ₹50.0L', demand: 'Moderate' }
    ],
    interviewQuestions: [
      {
        question: 'How would you prioritize 10 competing feature requests with limited engineering bandwidth?',
        answer: 'Use the RICE framework: (Reach × Impact × Confidence) / Effort. Score each feature quantitatively, cross-reference against current quarter business OKRs, and validate with user research data.'
      }
    ],
    faqs: [
      { question: 'Do I need an MBA from IIM to become a Product Manager?', answer: 'No. While MBAs are common, many top PMs transition directly from engineering, UX design, or data analytics with strong product portfolios.' }
    ],
    relatedSkills: ['data-analytics', 'ui-ux-design', 'digital-marketing']
  },

  // =================== VOCATIONAL & NON-IT SKILLS ===================
  {
    slug: 'tally-gst',
    title: 'Tally Prime & GST Accounting',
    category: 'vocational',
    categoryLabel: 'Massive MSME Hiring',
    shortDesc: 'Master Tally Prime 4.0, GST returns (GSTR-1, GSTR-3B), e-invoicing, TDS 194C/J deductions, and MSME balance sheet preparation.',
    longDesc: 'With over 6.3 Crore registered MSMEs and CA firms across India, skilled accountants proficient in practical Tally Prime and statutory tax compliance are hired immediately in every tier-1, tier-2, and tier-3 city.',
    heroImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80',
    salaryRange: '₹2.8L – ₹7.5L LPA',
    minSalaryLPA: 2.8,
    maxSalaryLPA: 7.5,
    averageSalaryLPA: 4.5,
    timelineWeeks: '6 – 8 Weeks',
    hiringVolume: '50,000+ MSME Openings',
    experienceLevel: 'Fresher Friendly',
    topCities: ['Ahmedabad', 'Surat', 'Delhi NCR', 'Mumbai', 'Indore', 'Jaipur', 'Coimbatore'],
    tools: ['Tally Prime 4.0', 'GST Portal', 'E-Way Bill Portal', 'TRACES TDS', 'MS Excel'],
    keyHighlights: [
      'Immediate employment opportunity for B.Com, Commerce, and non-tech graduates',
      'Independent part-time bookkeeping for 3 to 5 local shops easily generates ₹20k–₹35k/month',
      'Essential compliance foundation for Chartered Accountant (CA) firm articles and assistants'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Company Setup & Core Ledger Vouchers',
        weeks: 'Weeks 1 - 2',
        topics: ['Creating Companies and configuring GSTIN in Tally Prime', 'Voucher types: Purchase (F9), Sales (F8), Receipt (F6), Payment (F5), Contra (F4)', 'Inventory management, stock items, units of measurement, and godowns'],
        project: 'Complete Monthly Ledger Bookkeeping for a Trading Business.'
      },
      {
        phase: 'Phase 2: GST Returns, E-Invoicing & E-Way Bills',
        weeks: 'Weeks 3 - 4',
        topics: ['Configuring CGST, SGST, IGST tax rates by HSN code', 'Generating E-Way bills and JSON e-invoices directly from Tally', 'GSTR-1 outward supply export and GSTR-3B monthly reconciliation with GSTR-2B'],
        project: 'Monthly GST Reconciliation & JSON Filing for a Manufacturing Entity.'
      },
      {
        phase: 'Phase 3: TDS, Payroll & Final Financial Statements',
        weeks: 'Weeks 5 - 6',
        topics: ['Section 194C, 194J, 194I TDS calculations and challan payments', 'Employee payroll vouchers, PF, and ESI deductions', 'Auto Bank Reconciliation (BRS), Trial Balance, P&L, and Balance Sheet finalization'],
        project: 'End-of-Year Financial Accounts Closure & Balance Sheet Audit Ready File.'
      }
    ],
    jobRoles: [
      { title: 'Junior Accountant', salary: '₹2.5L – ₹4.2L', demand: 'Very High' },
      { title: 'Senior GST & Accounts Executive', salary: '₹4.5L – ₹7.5L', demand: 'High' },
      { title: 'Independent Tax Consultant', salary: '₹30k – ₹80k / month', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between GSTR-1 and GSTR-3B?',
        answer: 'GSTR-1 is a monthly/quarterly statement of outward supplies (sales) containing invoice-level details. GSTR-3B is a monthly summary return where the taxpayer declares summary tax liability, claims Input Tax Credit (ITC), and makes net tax payment.'
      },
      {
        question: 'What is Input Tax Credit (ITC) and when can it be claimed?',
        answer: 'ITC is the GST paid on purchases of goods/services used for business purposes, which can be deducted from the output GST liability on sales, provided the vendor has uploaded the invoice and it appears in GSTR-2B.'
      }
    ],
    faqs: [
      { question: 'Can non-commerce students learn Tally Prime?', answer: 'Yes! Basic debit and credit rules can be mastered in 3 days, after which software vouchers and GST operations are straightforward.' }
    ],
    relatedSkills: ['advanced-excel', 'freelancing-usd']
  },
  {
    slug: 'video-editing',
    title: 'Video Editing & Short-Form Storytelling',
    category: 'vocational',
    categoryLabel: 'Creator Economy Boom',
    shortDesc: 'Master Premiere Pro, DaVinci Resolve, and CapCut PC. Craft high-retention YouTube Shorts, Instagram Reels, and brand video ads.',
    longDesc: 'The Indian creator economy and D2C brand ecosystem is starved for editors who understand audience psychology, 3-second visual hooks, kinetic captions, sound design, and color grading.',
    heroImage: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=900&q=80',
    salaryRange: '₹3.6L – ₹10.0L LPA / ₹3k – ₹10k per Reel',
    minSalaryLPA: 3.6,
    maxSalaryLPA: 10.0,
    averageSalaryLPA: 6.5,
    timelineWeeks: '6 – 8 Weeks',
    hiringVolume: '18,000+ Creator & Agency Roles',
    experienceLevel: 'Fresher Friendly',
    topCities: ['Mumbai', 'Delhi NCR', 'Bengaluru', 'Remote Pan-India'],
    tools: ['Adobe Premiere Pro', 'DaVinci Resolve', 'CapCut Desktop', 'After Effects', 'Epidemic Sound', 'Motion Graphics'],
    keyHighlights: [
      'Zero degrees needed; hiring is 100% based on a 60-second video showreel',
      'High freelance pricing power: Top editors charge ₹5,000 to ₹10,000 per short-form reel',
      'Direct access to working with famous influencers, YouTubers, and funded startups'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Timeline Mastery & The Hook Cut',
        weeks: 'Weeks 1 - 2',
        topics: ['Premiere Pro / CapCut shortcuts, J & L cuts, timeline hygiene', 'First 3-second hook theory to stop the scroll', 'Pacing and trimming dead air to maintain retention'],
        project: '3 High-Retention 30-Second Instagram Reels from raw podcast footage.'
      },
      {
        phase: 'Phase 2: Sound Design, SFX & Kinetic Typography',
        weeks: 'Weeks 3 - 5',
        topics: ['Layering whooshes, risers, pops, and background music ducking', 'Kinetic animated captions and word-by-word highlight effects', 'B-roll overlays, zooms, whip pans, and glitch transitions'],
        project: 'Full 5-Minute YouTube Educational Documentary with rich sound effects.'
      },
      {
        phase: 'Phase 3: Color Grading & Direct Response Video Ads',
        weeks: 'Weeks 6 - 8',
        topics: ['DaVinci Resolve color correction, LUTs, and skin tone vectorscopes', 'High-converting UGC video ad frameworks for D2C brands', 'Building a professional portfolio showreel and pitching clients'],
        project: 'Commercial 30-Second D2C Brand Video Ad with high conversion CTA.'
      }
    ],
    jobRoles: [
      { title: 'Short-Form Video Editor', salary: '₹3.5L – ₹6.5L', demand: 'Very High' },
      { title: 'Senior Video Producer', salary: '₹7.0L – ₹14.0L', demand: 'High' },
      { title: 'Freelance Creator Editor', salary: '₹50k – ₹2.0L / month', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'What is audio ducking and why is it crucial in video editing?',
        answer: 'Audio ducking automatically lowers the volume of background music whenever speech/dialogue is detected, ensuring the voiceover remains crystal clear without manual volume keyframing.'
      }
    ],
    faqs: [
      { question: 'Do I need a high-end expensive PC to learn video editing?', answer: 'No. CapCut Desktop and Premiere Pro 1080p proxy editing run smoothly even on modest laptops with 8GB–16GB RAM.' }
    ],
    relatedSkills: ['graphic-figma', 'freelancing-usd', 'digital-marketing']
  },
  {
    slug: 'graphic-figma',
    title: 'Graphic Design & Figma UI/UX',
    category: 'vocational',
    categoryLabel: 'Creative & UI/UX',
    shortDesc: 'Design high-CTR social ad creatives, brand identity kits, and interactive mobile app prototypes in Figma and Canva.',
    longDesc: 'Visual appeal determines click-through rates and brand trust. Master color harmonies, typographic hierarchy, responsive auto-layout in Figma, wireframing modern mobile apps, and exporting clean design system assets.',
    heroImage: 'https://images.unsplash.com/photo-1581291518655-9523c932deda?auto=format&fit=crop&w=900&q=80',
    salaryRange: '₹3.5L – ₹14.0L LPA',
    minSalaryLPA: 3.5,
    maxSalaryLPA: 14.0,
    averageSalaryLPA: 7.8,
    timelineWeeks: '8 – 12 Weeks',
    hiringVolume: '14,500+ Openings',
    experienceLevel: 'Fresher Friendly',
    topCities: ['Bengaluru', 'Mumbai', 'Pune', 'Gurugram', 'Remote'],
    tools: ['Figma', 'Adobe Photoshop', 'Adobe Illustrator', 'Canva Pro', 'Dribbble / Behance'],
    keyHighlights: [
      'Visual portfolio is your currency; Behance and Dribbble links win immediate client trust',
      'Dual applicability in marketing ad design and modern software product UI/UX',
      'High growth ceiling transitioning from Graphic Designer to Lead Product Designer'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Design Principles, Color & Typography',
        weeks: 'Weeks 1 - 3',
        topics: ['Contrast, balance, proximity, and visual hierarchy', 'Pairing font families and building harmonious color palettes', 'Creating high-CTR ad creatives and social carousels in Canva / Photoshop'],
        project: 'Complete Social Media Brand Kit & 10 High-Converting Ad Banners.'
      },
      {
        phase: 'Phase 2: Figma UI Prototyping & Auto-Layout',
        weeks: 'Weeks 4 - 8',
        topics: ['Figma frames, nested auto-layout, and constraints', 'Component variants, interactive states (hover, pressed), and variables', 'Mobile app wireframing and clickable prototype transitions'],
        project: 'Full 10-Screen E-Commerce Mobile App UI Design in Figma.'
      },
      {
        phase: 'Phase 3: Design Systems & Developer Handoff',
        weeks: 'Weeks 9 - 12',
        topics: ['Building scalable typography scales and design token libraries', 'Figma Dev Mode annotations, asset exports (SVG, WebP)', 'Publishing case studies on Behance and Medium'],
        project: 'End-to-End SaaS Web App Design System with documented components.'
      }
    ],
    jobRoles: [
      { title: 'Graphic & Marketing Designer', salary: '₹3.5L – ₹6.5L', demand: 'High' },
      { title: 'UI/UX Designer', salary: '₹6.0L – ₹14.0L', demand: 'Very High' },
      { title: 'Product Design Lead', salary: '₹14.0L – ₹26.0L', demand: 'Moderate' }
    ],
    interviewQuestions: [
      {
        question: 'What is Auto-Layout in Figma and why is it essential?',
        answer: 'Auto-Layout creates dynamic frames that automatically adjust padding and dimensions based on their content, mirroring CSS Flexbox for seamless responsive designs and developer handoff.'
      }
    ],
    faqs: [
      { question: 'Do I need drawing or sketching skills to be a UI/UX designer?', answer: 'No! UI/UX design is about problem solving, layout consistency, and user flow psychology rather than freehand illustration.' }
    ],
    relatedSkills: ['full-stack-web', 'video-editing', 'digital-marketing', 'freelancing-usd']
  },
  {
    slug: 'bpo-support',
    title: 'BPO, Voice & Customer Support',
    category: 'vocational',
    categoryLabel: 'Quickest Job Entry',
    shortDesc: 'Fast-track into international BPO leaders (Teleperformance, Concentrix). Master neutral accent, Zendesk CRM, and customer empathy.',
    longDesc: 'India’s Business Process Outsourcing (BPO) and Global Customer Experience sector generates hundreds of thousands of immediate employment opportunities. Master voice modulation, email support ticket handling, de-escalation, and 45+ WPM typing.',
    heroImage: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&w=900&q=80',
    salaryRange: '₹2.8L – ₹6.5L LPA',
    minSalaryLPA: 2.8,
    maxSalaryLPA: 6.5,
    averageSalaryLPA: 4.2,
    timelineWeeks: '2 – 4 Weeks',
    hiringVolume: '60,000+ Immediate Openings',
    experienceLevel: 'Fresher Friendly',
    topCities: ['Noida', 'Gurugram', 'Jaipur', 'Indore', 'Hyderabad', 'Bengaluru', 'Pune', 'Kolkata'],
    tools: ['Zendesk CRM', 'Freshdesk', 'Salesforce Service Cloud', 'TypingMaster', 'Voice & Accent Coaching'],
    keyHighlights: [
      'Shortest hiring turnaround in India (1 to 2 weeks from interview to offer letter)',
      'Night shift and process performance incentives easily add ₹5,000 to ₹10,000 monthly',
      'Fast internal promotions to Quality Analyst (QA), Trainer, and Team Leader (TL)'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Voice Modulation & Neutral Accent',
        weeks: 'Weeks 1 - 2',
        topics: ['Phonetics, consonant articulation, and eliminating regional MTI', 'Active listening, paraphrasing, and empathetic phrasing', '45+ Words Per Minute (WPM) typing speed with 98%+ accuracy'],
        project: 'Recorded 10 Customer Service Call Simulations across US/UK customer scenarios.'
      },
      {
        phase: 'Phase 2: CRM Handling & Escalation Resolution',
        weeks: 'Weeks 3 - 4',
        topics: ['Zendesk ticketing workflows, tags, and SLA resolution timers', 'Managing irate customers and conflict de-escalation frameworks', 'Omnichannel chat, email, and voice multi-tasking'],
        project: 'Resolving 30 complex simulated customer tickets with high CSAT ratings.'
      }
    ],
    jobRoles: [
      { title: 'Customer Support Executive (Voice/Chat)', salary: '₹2.5L – ₹4.5L', demand: 'Very High' },
      { title: 'Quality Analyst (QA) / Trainer', salary: '₹4.5L – ₹7.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'How do you handle an angry customer shouting on the phone?',
        answer: 'Stay calm and listen without interrupting, acknowledge their frustration empathetically ("I understand how inconvenient this is, let me resolve this for you right away"), take ownership of the issue, and provide clear step-by-step resolution.'
      }
    ],
    faqs: [
      { question: 'What qualifications are needed for BPO voice processes?', answer: 'Any 12th pass or graduate with good spoken English and basic computer skills is eligible.' }
    ],
    relatedSkills: ['communication-english', 'resume-linkedin']
  }
];

import { additionalSkills } from './additionalSkills';
import { moreSkillsList } from './moreSkillsCatalog';
import { expansionSkills } from './expansionSkills';

export const allSkillsList: SkillDetail[] = [...skillsData, ...additionalSkills, ...moreSkillsList, ...expansionSkills];

export const getSkillBySlug = (slug: string): SkillDetail | undefined => {
  return allSkillsList.find(s => s.slug === slug);
};

export const getSkillsByCategory = (category: 'tech' | 'business' | 'vocational'): SkillDetail[] => {
  return allSkillsList.filter(s => s.category === category);
};



