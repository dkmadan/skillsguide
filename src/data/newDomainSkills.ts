import type { SkillDetail } from './skillsData';

export const newDomainSkills: SkillDetail[] = [
  // =========================================================================
  // DOMAIN 1: EMERGING TECH & AI ENGINEERING
  // =========================================================================
  {
    slug: 'generative-ai-agentic-workflows',
    title: 'Generative AI & Agentic Workflows',
    category: 'emerging-tech',
    domainSlug: 'emerging-tech-ai',
    categoryLabel: 'Emerging Tech & AI',
    shortDesc: 'Master autonomous multi-agent orchestration, Model Context Protocol (MCP), tool calling, RAG knowledge pipelines, and SLM fine-tuning.',
    longDesc: 'Practical enterprise AI is evolving from passive chatbot prompts into autonomous agentic systems. Master how to architect autonomous agents with LangChain, LlamaIndex, and the Model Context Protocol (MCP). Learn to give foundation models real-time tool execution capabilities, connect secure Postgres/filesystem MCP servers, fine-tune domain-specific Small Language Models (SLMs) with LoRA, and deploy high-throughput vLLM inference microservices.',
    heroImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
    conceptDiagram: {
      title: 'Autonomous Agent & Model Context Protocol (MCP) Architecture',
      caption: 'End-to-end telemetry showing user intent processing, autonomous ReAct planning loops, standardized MCP client/server tool discovery, and parameter-efficient SLM fine-tuning.',
      imageUrl: '/images/concepts/concept-agentic-mcp.svg',
      keyPoints: [
        { label: 'Autonomous Orchestrator', description: 'LangChain and LlamaIndex agents dynamically reason, reflect, and decompose ambiguous goals into step-by-step tool actions.' },
        { label: 'Model Context Protocol (MCP)', description: 'Anthropic open standard exposing local filesystems, relational databases, and REST APIs as discoverable tools via JSON-RPC 2.0.' },
        { label: 'SLM Parameter-Efficient Tuning', description: 'Fine-tuning lightweight models (Llama-3, Phi-3, Mistral) using LoRA and QLoRA for private, low-latency enterprise execution.' },
        { label: 'Guardrails & Telemetry', description: 'Real-time LangSmith / Phoenix tracing ensuring deterministic outputs, zero hallucination, and PII redacting.' }
      ]
    },
    salaryRange: '₹12.0L – ₹35.0L LPA',
    minSalaryLPA: 12.0,
    maxSalaryLPA: 35.0,
    averageSalaryLPA: 21.5,
    timelineWeeks: '12 – 16 Weeks',
    hiringVolume: '18,500+ Openings in India & US Remote',
    experienceLevel: 'Intermediate to Advanced',
    topCities: ['Bengaluru', 'Hyderabad', 'Pune', 'Gurugram', 'San Francisco (Remote)'],
    tools: ['LangChain', 'LlamaIndex', 'MCP (Model Context Protocol)', 'Prompt Engineering', 'LoRA / QLoRA', 'vLLM', 'Python', 'Pinecone / pgvector', 'Claude 3.5 Sonnet'],
    keyHighlights: [
      'Highest-paying software engineering discipline in 2026 with international USD consulting arbitrage',
      'Massive shift from generic prompt writing to standardized MCP tool integration and multi-agent coordination',
      'High conversion from traditional full-stack/data roles to Principal AI Systems Architect'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Advanced Prompt Engineering & Tool Calling',
        weeks: 'Weeks 1 - 4',
        topics: [
          'Few-shot prompting, chain-of-thought (CoT), self-consistency sampling',
          'Structured output enforcement with Pydantic and Instructor',
          'OpenAI & Anthropic function calling mechanics and error retry handlers'
        ],
        project: 'Automated Financial Report Analyzer with Structured JSON Extraction and Confidence Scoring.'
      },
      {
        phase: 'Phase 2: RAG Vector Pipelines & Model Context Protocol (MCP)',
        weeks: 'Weeks 5 - 10',
        topics: [
          'Hybrid search (Dense vector embeddings + Sparse BM25) in pgvector',
          'Model Context Protocol (MCP) Client and Server implementation in TypeScript/Python',
          'Integrating MCP servers for local filesystem, GitHub repositories, and PostgreSQL databases'
        ],
        project: 'Production MCP Server allowing Claude/Cursor to query live enterprise databases with row-level security.'
      },
      {
        phase: 'Phase 3: Autonomous Agent Orchestration & SLM Fine-Tuning',
        weeks: 'Weeks 11 - 16',
        topics: [
          'ReAct and Plan-and-Solve multi-agent architectures (LangGraph, CrewAI)',
          'Fine-tuning open-source SLMs (Phi-3, Mistral 7B, Llama-3) using Unsloth & QLoRA',
          'Low-latency serving with vLLM, TensorRT-LLM, and GGUF quantization'
        ],
        project: 'Autonomous Competitive Market Research Agent with web search, data synthesis, and auto-generated PDF briefs.'
      }
    ],
    jobRoles: [
      { title: 'Generative AI Engineer', salary: '₹14.0L – ₹28.0L', demand: 'Very High' },
      { title: 'Agentic Systems Architect', salary: '₹22.0L – ₹42.0L', demand: 'High' },
      { title: 'AI Automation Consultant', salary: '₹18.0L – ₹35.0L', demand: 'Very High' }
    ],
    interviewQuestions: [
      {
        question: 'What is the Model Context Protocol (MCP) and how does it differ from traditional proprietary function calling?',
        answer: 'Model Context Protocol (MCP) is an open, standardized protocol developed to connect AI assistants to external data sources and tools via JSON-RPC 2.0. Unlike proprietary one-off tool integrations, MCP allows an agent client to dynamically discover tools, read context resources, and execute actions across interchangeable servers (databases, filesystems, APIs) through a unified interface.'
      },
      {
        question: 'When should an enterprise choose LoRA fine-tuning of an SLM over RAG with an existing frontier LLM?',
        answer: 'RAG is optimal when information is volatile and needs external citations. LoRA fine-tuning of a Small Language Model (SLM like Phi-3 or Mistral) is preferred when the goal is to master a specialized tone, domain terminology, strict structured output syntax, low latency (<50ms), air-gapped private deployment, and significant cost savings at massive API volume.'
      }
    ],
    faqs: [
      {
        question: 'Do I need deep mathematical machine learning knowledge to build agentic workflows?',
        answer: 'No. Agentic workflows and MCP focus on systems engineering, software design patterns (async queues, tool contracts, state machines), and prompt architecture rather than raw neural network calculus.'
      },
      {
        question: 'What are the main tools Indian GCCs look for in AI engineers?',
        answer: 'Companies primarily test proficiency in LangChain/LangGraph, LlamaIndex, MCP servers, Python Pydantic validation, vector databases (pgvector/Qdrant), and Docker containerized inference.'
      }
    ],
    relatedSkills: ['cloud-platform-engineering', 'cybersecurity-ethical-hacking', 'full-stack-web', 'data-engineering']
  },

  {
    slug: 'cloud-platform-engineering',
    title: 'Cloud Platform Engineering & SRE',
    category: 'emerging-tech',
    domainSlug: 'emerging-tech-ai',
    categoryLabel: 'Emerging Tech & AI',
    shortDesc: 'Build resilient multi-cloud foundations using Terraform (IaC), AWS/GCP, custom Kubernetes operators, and SRE observability.',
    longDesc: 'Modern cloud infrastructure is no longer configured manually in web consoles. Platform Engineers build self-service developer portals, declarative infrastructure-as-code with Terraform, custom Kubernetes operators that automate complex cluster lifecycles, and Site Reliability Engineering (SRE) telemetry using Prometheus and Grafana. Master multi-cloud networking, GitOps deployment with ArgoCD, and production incident management across AWS and GCP.',
    heroImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    conceptDiagram: {
      title: 'Multi-Cloud GitOps, Kubernetes Operator & SRE Pipeline',
      caption: 'Complete infrastructure flow from declarative Terraform HCL code and ArgoCD GitOps sync to Kubernetes custom controller reconciliation loops and Prometheus SLO alerts.',
      imageUrl: '/images/concepts/concept-cloud-k8s-iac.svg',
      keyPoints: [
        { label: 'Terraform Multi-Cloud IaC', description: 'Modular declarative infrastructure managing AWS VPCs, GCP subnets, IAM roles, and HashiCorp Vault secrets with state locking.' },
        { label: 'Kubernetes Operator SDK', description: 'Custom controllers written in Go/Python that observe desired state, diff cluster telemetry, and reconcile self-healing workloads.' },
        { label: 'GitOps Continuous Delivery', description: 'ArgoCD maintaining immutable cluster state synced directly from version-controlled Git repositories.' },
        { label: 'SRE Error Budgets', description: 'Tracking Service Level Indicators (SLIs) and 99.99% availability targets using Prometheus, OpenTelemetry, and Grafana.' }
      ]
    },
    salaryRange: '₹10.0L – ₹28.0L LPA',
    minSalaryLPA: 10.0,
    maxSalaryLPA: 28.0,
    averageSalaryLPA: 17.5,
    timelineWeeks: '14 – 18 Weeks',
    hiringVolume: '26,000+ Openings',
    experienceLevel: 'Intermediate to Advanced',
    topCities: ['Bengaluru', 'Pune', 'Hyderabad', 'Chennai', 'Noida'],
    tools: ['Terraform (IaC)', 'AWS / GCP Multi-cloud', 'Kubernetes (CKA)', 'Kubernetes Operators', 'ArgoCD', 'Prometheus', 'Grafana', 'Docker', 'Linux / Bash'],
    keyHighlights: [
      'Massive hiring across FinTech, SaaS, and Global Capability Centers (GCCs) in India',
      'Platform engineering replaces traditional DevOps by treating internal infrastructure as a self-service product',
      'Commands 25-40% higher compensation than standard system administration roles'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Declarative Multi-Cloud Infrastructure (Terraform)',
        weeks: 'Weeks 1 - 5',
        topics: [
          'Terraform HCL syntax, state locking in AWS S3 with DynamoDB',
          'Reusable modules, workspaces, and multi-region VPC peering',
          'Managing IAM least-privilege policies, security groups, and HashiCorp Vault'
        ],
        project: 'Production Multi-Cloud VPC Peering & Resilient Bastion Host Pipeline in Terraform.'
      },
      {
        phase: 'Phase 2: Kubernetes Operators & GitOps CI/CD',
        weeks: 'Weeks 6 - 11',
        topics: [
          'CKA-level Kubernetes primitives: Deployments, StatefulSets, Ingress, mTLS',
          'Building custom Kubernetes Operators using Operator SDK / Kubebuilder',
          'ArgoCD GitOps synchronization, Helm charts, and canary release strategies'
        ],
        project: 'Custom Kubernetes Database Operator that automates point-in-time backups and failovers.'
      },
      {
        phase: 'Phase 3: SRE Observability, SLIs/SLOs & Chaos Engineering',
        weeks: 'Weeks 12 - 16',
        topics: [
          'Prometheus metrics scraping, PromQL queries, and custom Grafana dashboards',
          'OpenTelemetry distributed tracing across microservices',
          'SLI/SLO error budget alerts, PagerDuty on-call escalation, and Litmus chaos drills'
        ],
        project: 'Full-Stack Observability Stack with Automated SLA Breach Alerting and Chaos Testing.'
      }
    ],
    jobRoles: [
      { title: 'Cloud Platform Engineer', salary: '₹12.0L – ₹22.0L', demand: 'Very High' },
      { title: 'Site Reliability Engineer (SRE)', salary: '₹14.0L – ₹28.0L', demand: 'Very High' },
      { title: 'Kubernetes Infrastructure Specialist', salary: '₹16.0L – ₹30.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'How does a Kubernetes Operator differ from a standard Kubernetes Controller?',
        answer: 'A standard controller (like ReplicaSetController) manages built-in Kubernetes resources. A Kubernetes Operator is an application-specific controller that extends the Kubernetes API using Custom Resource Definitions (CRDs) to encapsulate human operational knowledge (such as stateful database clustering, auto-backups, and zero-downtime schema upgrades).'
      },
      {
        question: 'How do you handle Terraform state file drift in a large engineering team?',
        answer: 'Use remote state storage with distributed state locking (e.g. AWS S3 + DynamoDB or Terraform Cloud), enforce GitOps pull-request workflows where plans are automatically calculated via Atlantis/Spacelift, and run periodic drift-detection cron jobs.'
      }
    ],
    faqs: [
      {
        question: 'Which cloud provider is most in demand in India: AWS or GCP?',
        answer: 'AWS holds the largest market share in Indian enterprise IT, while GCP has rapid growth in data-heavy startups and AI workloads. Multi-cloud proficiency (AWS + GCP via Terraform) is the most sought-after combination.'
      },
      {
        question: 'Is CKA (Certified Kubernetes Administrator) mandatory to get hired?',
        answer: 'While not mandatory, having CKA certification guarantees interview callbacks from tier-1 MNCs and GCCs in Bengaluru and Pune.'
      }
    ],
    relatedSkills: ['generative-ai-agentic-workflows', 'cybersecurity-ethical-hacking', 'devops-sre', 'linux-sysadmin']
  },

  {
    slug: 'cybersecurity-ethical-hacking',
    title: 'Cybersecurity & Ethical Hacking',
    category: 'emerging-tech',
    domainSlug: 'emerging-tech-ai',
    categoryLabel: 'Emerging Tech & AI',
    shortDesc: 'Master threat triage, SOC Analyst Tier-1 operations, penetration testing (OWASP Top 10), and cloud security posture (CCSP).',
    longDesc: 'With high-profile cyberattacks and digital data protection acts (such as India’s DPDP Act), cybersecurity is a top corporate priority. This track bridges defensive Blue Team operations (SOC Analyst alert triage, SIEM Splunk queries, PCAP packet analysis) and offensive Red Team penetration testing (Burp Suite web exploitation, privilege escalation, Kali Linux tooling, and AWS/Azure cloud security posture management).',
    heroImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    conceptDiagram: {
      title: 'SOC Analyst Tier-1 Defense Matrix & Penetration Testing Lifecycle',
      caption: 'Side-by-side comparison of Blue Team security telemetry ingestion and alert triage versus Red Team reconnaissance, vulnerability exploitation, and remediation verification.',
      imageUrl: '/images/concepts/concept-soc-cybersecurity.svg',
      keyPoints: [
        { label: 'SIEM Alert Triage', description: 'Ingesting logs across CrowdStrike EDR, firewall syslog, and AWS CloudTrail into Splunk for correlation and threat hunting.' },
        { label: 'Packet & Malware Analysis', description: 'Deconstructing network captures in Wireshark and analyzing suspicious payloads inside isolated sandbox environments.' },
        { label: 'OWASP Top 10 Exploitation', description: 'Burp Suite Professional testing for SQLi, SSRF, Broken Object Level Auth (BOLA), and JWT tampering.' },
        { label: 'Cloud Security (CCSP)', description: 'Auditing IAM over-privileging, S3 bucket misconfigurations, and cloud security posture management (CSPM).' }
      ]
    },
    salaryRange: '₹6.5L – ₹22.0L LPA',
    minSalaryLPA: 6.5,
    maxSalaryLPA: 22.0,
    averageSalaryLPA: 13.0,
    timelineWeeks: '12 – 16 Weeks',
    hiringVolume: '22,000+ Openings',
    experienceLevel: 'Fresher Friendly',
    topCities: ['Bengaluru', 'Hyderabad', 'Mumbai', 'Delhi NCR', 'Chennai'],
    tools: ['CompTIA Security+', 'SOC Analyst Level-1', 'Splunk SIEM', 'Burp Suite Pro', 'Wireshark', 'Kali Linux', 'Metasploit', 'Nmap', 'Cloud Security (CCSP)'],
    keyHighlights: [
      'Recession-resilient field with a global talent shortfall exceeding 3.5 million professionals',
      'Clear progression path from Tier-1 SOC Analyst (₹5L-₹8L) to Lead Penetration Tester (₹18L-₹28L)',
      'Direct compliance mandate driven by RBI guidelines and global ISO 27001 standards'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Network Defense & SOC Tier-1 Triage',
        weeks: 'Weeks 1 - 5',
        topics: [
          'TCP/IP 3-way handshake, DNS, ARP poisoning, and Wireshark PCAP analysis',
          'Splunk SIEM query language (SPL), alert correlation, and false positive reduction',
          'MITRE ATT&CK framework mapping and NIST incident response lifecycle'
        ],
        project: 'SOC Investigation Case Study: Triaging a Simulated Ransomware Infection Incident.'
      },
      {
        phase: 'Phase 2: Web Application & Network Penetration Testing',
        weeks: 'Weeks 6 - 11',
        topics: [
          'Reconnaissance with Nmap, Shodan, and Sublist3r',
          'OWASP Top 10 vulnerabilities: SQL injection, XSS, SSRF, IDOR',
          'Burp Suite repeater, intruder, and writing structured vulnerability reports (CVSS v3.1)'
        ],
        project: 'Full-Scale Web Application Penetration Test on vulnerable lab with remediation proof.'
      },
      {
        phase: 'Phase 3: Cloud Security Posture (CCSP) & Active Directory',
        weeks: 'Weeks 12 - 16',
        topics: [
          'Active Directory attack paths: Kerberoasting, Pass-the-Hash, BloodHound mapping',
          'AWS/Azure cloud security posture management (CSPM) and IAM privilege escalation',
          'CompTIA Security+ exam readiness and hands-on lab drilling'
        ],
        project: 'Cloud Security Compliance Audit for a Multi-Tier FinTech Microservices Architecture.'
      }
    ],
    jobRoles: [
      { title: 'SOC Analyst (Tier-1 / Tier-2)', salary: '₹5.5L – ₹9.5L', demand: 'Very High' },
      { title: 'Vulnerability Assessment & Pentester', salary: '₹8.0L – ₹18.0L', demand: 'High' },
      { title: 'Cloud Security Engineer (CCSP)', salary: '₹14.0L – ₹26.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'What are the steps of the Incident Response lifecycle according to NIST SP 800-61?',
        answer: 'The NIST incident response lifecycle consists of four main phases: 1) Preparation (tools, training, policies), 2) Detection & Analysis (alert triage, verifying IOCs, scoping the breach), 3) Containment, Eradication & Recovery (isolating compromised endpoints, purging malware, restoring from backups), and 4) Post-Incident Activity (lessons learned, post-mortem report, refining defense rules).'
      },
      {
        question: 'What is an SSRF (Server-Side Request Forgery) attack and why is it devastating in cloud environments?',
        answer: 'SSRF occurs when an attacker tricks a backend server into making requests to unauthorized internal destinations. In cloud environments (AWS/GCP), attackers frequently exploit SSRF to query the instance metadata service (e.g. 169.254.169.254) to steal temporary IAM credentials and gain lateral access to cloud resources.'
      }
    ],
    faqs: [
      {
        question: 'Can I start in cybersecurity as a fresher without prior IT experience?',
        answer: 'Yes! Tier-1 SOC Analyst roles actively hire freshers who demonstrate strong networking basics, Wireshark packet analysis, and hands-on TryHackMe / HackTheBox badges.'
      },
      {
        question: 'Is ethical hacking legal to practice in India?',
        answer: 'Practicing on authorized platforms (HackTheBox, PortSwigger Web Security Academy) or systems you have explicit written permission to test is 100% legal and recommended.'
      }
    ],
    relatedSkills: ['cloud-platform-engineering', 'generative-ai-agentic-workflows', 'linux-sysadmin']
  },

  {
    slug: 'iot-embedded-systems',
    title: 'IoT & Embedded Systems (Rust & Edge AI)',
    category: 'emerging-tech',
    domainSlug: 'emerging-tech-ai',
    categoryLabel: 'Emerging Tech & AI',
    shortDesc: 'Build intelligent hardware devices with bare-metal Rust, ESP32 microcontrollers, on-device Edge AI (TinyML), and automotive CAN bus.',
    longDesc: 'The Internet of Things has advanced from simple sensor data logging into real-time on-device intelligence. Master bare-metal embedded programming with memory-safe Rust (#![no_std]), FreeRTOS multitasking on ESP32 microcontrollers, quantized TinyML neural network execution directly on MCU silicon, and automotive CAN bus communication compliant with ISO 26262 functional safety standards.',
    heroImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    conceptDiagram: {
      title: 'Edge AI Microcontroller Pipeline: Sensors to In-Vehicle CAN Bus',
      caption: 'Hardware architecture showing physical sensor sampling, bare-metal Rust memory safety, on-device TinyML neural inference, and CAN Bus 2.0B automotive telemetry.',
      imageUrl: '/images/concepts/concept-iot-edge-rust.svg',
      keyPoints: [
        { label: 'Physical Sensor Ingestion', description: 'Sampling accelerometer, temperature, and acoustic signals over high-speed I2C, SPI, and DMA hardware channels.' },
        { label: 'Bare-Metal Rust Firmware', description: 'Zero-cost abstractions and compile-time memory safety eliminating pointer errors and buffer overflows without an OS runtime.' },
        { label: 'TinyML Edge Inference', description: 'Executing INT8 quantized neural models on ESP32-S3 silicon with sub-10ms response times and zero cloud dependencies.' },
        { label: 'Automotive CAN Bus', description: 'Deterministic vehicle electronic control unit (ECU) messaging compliant with ISO 26262 ASIL safety protocols.' }
      ]
    },
    salaryRange: '₹6.0L – ₹20.0L LPA',
    minSalaryLPA: 6.0,
    maxSalaryLPA: 20.0,
    averageSalaryLPA: 12.5,
    timelineWeeks: '12 – 16 Weeks',
    hiringVolume: '14,000+ Openings',
    experienceLevel: 'Intermediate',
    topCities: ['Bengaluru', 'Pune', 'Hyderabad', 'Chennai', 'Coimbatore'],
    tools: ['Rust for Embedded (#![no_std])', 'ESP32-S3 / C6', 'Edge AI / TinyML', 'CAN Bus 2.0B', 'FreeRTOS', 'MQTT / Cellular IoT', 'C / Modern C++', 'Oscilloscopes & Logic Analyzers'],
    keyHighlights: [
      'Huge hiring surge driven by Indian EV manufacturers (Ola Electric, Ather Energy, Tata AutoComp) and IoT smart metering',
      'Rust is officially becoming the premier language for mission-critical embedded systems and Linux kernel modules',
      'Bridges hands-on electronics hardware design with cutting-edge artificial intelligence'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Bare-Metal Rust & Microcontroller Fundamentals',
        weeks: 'Weeks 1 - 5',
        topics: [
          'Rust memory ownership, borrowing, and no_std bare-metal fundamentals',
          'ESP32 hardware architecture, GPIO, UART, SPI, I2C driver writing',
          'FreeRTOS task scheduling, queues, mutexes, and interrupt handlers (ISR)'
        ],
        project: 'Bare-Metal Rust Firmware for an Industrial Multi-Sensor Environmental Data Logger.'
      },
      {
        phase: 'Phase 2: TinyML & On-Device Edge AI Inference',
        weeks: 'Weeks 6 - 10',
        topics: [
          'Data collection, feature extraction (FFT spectral analysis), and model training',
          'Quantizing models to INT8 using TensorFlow Lite for Microcontrollers (TFLM)',
          'Deploying anomaly detection on ESP32-S3 vector instructions'
        ],
        project: 'Edge AI Industrial Motor Vibration Anomaly Detector running in real-time under 200mW power.'
      },
      {
        phase: 'Phase 3: Automotive Electronics, CAN Bus & Connected IoT',
        weeks: 'Weeks 11 - 16',
        topics: [
          'CAN Bus 2.0B / CAN-FD physical layer, transceivers, and DBC file parsing',
          'ISO 26262 functional safety, watchdog timers, and fail-safe state machines',
          'Cellular / MQTT telemetry streaming to AWS IoT Core with cryptographic OTA updates'
        ],
        project: 'Automotive CAN Bus Telemetry Gateway sending live vehicle performance diagnostics to the cloud.'
      }
    ],
    jobRoles: [
      { title: 'Embedded Software Engineer (Rust / C++)', salary: '₹6.5L – ₹14.0L', demand: 'Very High' },
      { title: 'Edge AI / TinyML Engineer', salary: '₹10.0L – ₹22.0L', demand: 'High' },
      { title: 'Automotive Embedded Systems Specialist', salary: '₹9.0L – ₹20.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'Why is Rust gaining massive adoption over traditional C in embedded and automotive systems?',
        answer: 'Over 70% of high-severity vulnerabilities in C/C++ embedded systems stem from memory safety bugs (buffer overflows, dangling pointers, race conditions). Rust guarantees memory safety and thread safety at compile-time with zero runtime garbage-collection overhead, dramatically reducing safety-critical recalls in automotive and medical hardware.'
      },
      {
        question: 'How does INT8 quantization work in TinyML edge models?',
        answer: 'INT8 quantization maps 32-bit floating-point weights and activation values into 8-bit signed integers through scaling and zero-point offsets. This reduces model memory footprint by 75% and enables 2x-4x faster integer SIMD execution on microcontrollers with minimal accuracy degradation.'
      }
    ],
    faqs: [
      {
        question: 'Do I need expensive hardware lab equipment to learn embedded systems?',
        answer: 'An affordable ESP32-S3 development board (₹600–₹1,200), a couple of basic sensor modules (MPU6050, DHT22), and an inexpensive USB logic analyzer (₹500) are all that is needed to build a complete portfolio.'
      },
      {
        question: 'Are there jobs for Rust embedded engineers in India?',
        answer: 'Yes! EV leaders like Ather, Ola, Tata Motors, and global tier-1 automotive suppliers (Bosch, Continental) are aggressively hiring Rust engineers for vehicle telematics and battery controllers.'
      }
    ],
    relatedSkills: ['ev-battery-tech', 'cybersecurity-ethical-hacking', 'cloud-platform-engineering']
  },

  // =========================================================================
  // DOMAIN 2: BUSINESS, GROWTH & MODERN NO-CODE
  // =========================================================================
  {
    slug: 'product-management-growth',
    title: 'Product Management & Growth',
    category: 'growth-nocode',
    domainSlug: 'business-growth-nocode',
    categoryLabel: 'Business & Growth',
    shortDesc: 'Master continuous customer discovery, Amplitude analytics, PRD writing, feature prioritization, and viral growth loops.',
    longDesc: 'Product Managers are the CEOs of product execution, sitting at the intersection of business strategy, technology, and user experience. Master customer discovery interview methodologies, write airtight Product Requirement Documents (PRDs) in Notion and Jira, decode behavioral retention curves in Amplitude and Mixpanel, and architect viral growth loops that scale user acquisition with compounding product-led growth (PLG) flywheels.',
    heroImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
    conceptDiagram: {
      title: 'Continuous Product Discovery to Viral Growth Flywheel',
      caption: 'Four-quadrant flywheel linking continuous user interviews, Notion PRD sprint execution, Amplitude behavioral cohort analytics, and product-led viral loops.',
      imageUrl: '/images/concepts/concept-product-growth-flywheel.svg',
      keyPoints: [
        { label: 'Customer Discovery', description: 'Weekly customer interviews uncovering latent pain points using Opportunity Solution Trees.' },
        { label: 'PRD Specifications', description: 'Writing engineering-ready PRDs with clear user stories, edge cases, and RICE feature scoring.' },
        { label: 'Amplitude Analytics', description: 'Diagnosing onboarding drop-offs, tracking feature adoption, and measuring D1/D7/D30 cohort retention.' },
        { label: 'Viral Growth Loops', description: 'Architecting two-sided referral mechanics and viral hooks (K-Factor > 1.0) for self-sustaining growth.' }
      ]
    },
    salaryRange: '₹12.0L – ₹32.0L LPA',
    minSalaryLPA: 12.0,
    maxSalaryLPA: 32.0,
    averageSalaryLPA: 19.5,
    timelineWeeks: '10 – 14 Weeks',
    hiringVolume: '16,000+ Openings',
    experienceLevel: 'Intermediate',
    topCities: ['Bengaluru', 'Gurugram', 'Mumbai', 'Hyderabad', 'Pune'],
    tools: ['Amplitude', 'Mixpanel', 'Notion / Jira', 'Product Discovery', 'PRD Writing', 'RICE Scoring', 'PostHog', 'Figma Wireframing'],
    keyHighlights: [
      'High-prestige corporate leadership role with direct pathway to VP of Product and Chief Product Officer (CPO)',
      'Substantial startup equity (ESOP) and compensation upside for unlocking growth funnels',
      'Combines quantitative data analytics with deep human empathy and commercial strategy'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Continuous Discovery & Opportunity Solution Trees',
        weeks: 'Weeks 1 - 4',
        topics: [
          'Conducting generative user interviews without bias (The Mom Test framework)',
          'Mapping Opportunity Solution Trees and identifying unmet customer needs',
          'Customer journey mapping and value proposition canvases'
        ],
        project: 'Comprehensive Customer Discovery Playbook for an Indian FinTech Micro-Investment App.'
      },
      {
        phase: 'Phase 2: PRD Writing, Metrics & Agile Sprint Delivery',
        weeks: 'Weeks 5 - 8',
        topics: [
          'Writing comprehensive PRDs: User stories, acceptance criteria (Gherkin), edge cases',
          'Prioritization frameworks: RICE (Reach, Impact, Confidence, Effort) vs Kano model',
          'Sprint planning, backlog grooming, and collaborating smoothly with engineering in Jira'
        ],
        project: 'Production-Ready Notion PRD & User Story Roadmap for a Quick-Commerce Loyalty Feature.'
      },
      {
        phase: 'Phase 3: Amplitude Analytics & Product-Led Growth (PLG)',
        weeks: 'Weeks 9 - 14',
        topics: [
          'Event taxonomy design, tracking plans, and funnel conversion audits in Amplitude',
          'Cohort retention analysis and locating the user "Aha!" moment',
          'Designing viral referral loops, in-app onboarding guides, and high-velocity A/B testing'
        ],
        project: 'End-to-End Amplitude Funnel Audit & Onboarding Redesign driving 25% activation uplift.'
      }
    ],
    jobRoles: [
      { title: 'Associate Product Manager (APM)', salary: '₹9.0L – ₹16.0L', demand: 'Very High' },
      { title: 'Product Manager (PM)', salary: '₹16.0L – ₹28.0L', demand: 'High' },
      { title: 'Growth Product Manager', salary: '₹18.0L – ₹35.0L', demand: 'Very High' }
    ],
    interviewQuestions: [
      {
        question: 'How do you prioritize features using the RICE framework?',
        answer: 'RICE Score = (Reach × Impact × Confidence) / Effort. Reach estimates how many users the feature impacts per quarter. Impact scores value to the user (0.25 to 3). Confidence reflects evidence backing the estimate (50% to 100%). Effort is estimated in person-weeks. Dividing by effort surfaces high-impact, low-cost features first.'
      },
      {
        question: 'What is the difference between a vanity metric and a North Star Metric?',
        answer: 'A vanity metric (like registered users or app downloads) looks impressive on paper but does not correlate directly to long-term business value or active customer satisfaction. A North Star Metric (e.g. Weekly Active Transacting Users, or Queries Solved per Day) captures the core value delivered to customers and reliably predicts sustainable revenue growth.'
      }
    ],
    faqs: [
      {
        question: 'Do I need an MBA or Computer Science degree to become a Product Manager in India?',
        answer: 'No. Candidates from engineering, design, marketing, and data analytics transition into PM roles by presenting detailed PRD case studies, live app teardowns, and Amplitude analytics portfolios.'
      },
      {
        question: 'What is the difference between a traditional PM and a Growth PM?',
        answer: 'A traditional PM focuses on core value creation and solving user problems in features. A Growth PM focuses on maximizing business metrics—optimizing acquisition funnels, activation rates, retention cohorts, and viral referrals.'
      }
    ],
    relatedSkills: ['digital-marketing-seo-performance', 'nocode-lowcode-development', 'ui-ux-product-design']
  },

  {
    slug: 'nocode-lowcode-development',
    title: 'No-Code / Low-Code Development',
    category: 'growth-nocode',
    domainSlug: 'business-growth-nocode',
    categoryLabel: 'Business & Growth',
    shortDesc: 'Build full-stack web applications, visual CMS portals, and webhook automation architectures with Bubble, Webflow, Make, and Airtable.',
    longDesc: 'No-Code and Low-Code development enables creators and consultants to build production-grade web applications, customer portals, and internal tools at 10x the speed of traditional development. Master visual full-stack programming in Bubble, high-converting CMS websites in Webflow, multi-branch webhook routing in Make.com and Zapier, and relational database modeling in Airtable to launch profitable client MVPs and automated operations.',
    heroImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    conceptDiagram: {
      title: 'Full-Stack No-Code Architecture & Webhook Middleware Stack',
      caption: 'Three-tier architecture showing visual frontends (Bubble/Webflow), middleware webhook automation routers (Make.com/Zapier), and relational databases (Airtable).',
      imageUrl: '/images/concepts/concept-nocode-stack.svg',
      keyPoints: [
        { label: 'Visual Frontend Canvas', description: 'Bubble flexbox canvas and Webflow semantic HTML5 engines building responsive client-facing interfaces.' },
        { label: 'Automation & Webhooks', description: 'Make.com and Zapier multi-routers processing webhooks, formatting arrays, and triggering third-party APIs.' },
        { label: 'Relational Database Engine', description: 'Airtable linked records, rollups, and JavaScript automation scripts acting as the single source of operational truth.' },
        { label: 'Speed-to-Market', description: 'Shipping commercial SaaS prototypes and internal tools in 2 weeks instead of 6 months.' }
      ]
    },
    salaryRange: '₹5.5L – ₹18.0L LPA / $30 - $75/hr Freelancing',
    minSalaryLPA: 5.5,
    maxSalaryLPA: 18.0,
    averageSalaryLPA: 10.5,
    timelineWeeks: '8 – 10 Weeks',
    hiringVolume: '19,000+ Global & Indian Gigs',
    experienceLevel: 'Fresher Friendly',
    topCities: ['Worldwide Remote', 'Bengaluru', 'Mumbai', 'Delhi NCR', 'Pune'],
    tools: ['Bubble', 'Webflow', 'Make.com', 'Zapier', 'Airtable', 'Stripe API', 'Softr', 'REST Webhooks'],
    keyHighlights: [
      'High international USD freelancing rates: Charging $1,500 to $6,000 per no-code MVP build on Upwork',
      'Zero traditional syntax coding required—ideal for entrepreneurs, business analysts, and designers',
      'Adopted by Fortune 500 enterprises and fast-moving startups to eliminate engineering bottlenecks'
    ],
    syllabus: [
      {
        phase: 'Phase 1: High-Converting CMS Web Design (Webflow)',
        weeks: 'Weeks 1 - 3',
        topics: [
          'Webflow box model, CSS Grid, responsive breakpoints, and classes',
          'Dynamic CMS collections, multi-reference fields, and filtered views',
          'Interactive micro-animations, navbar states, and custom form actions'
        ],
        project: 'Production B2B SaaS Marketing Website with Dynamic CMS Blog and Custom Modals.'
      },
      {
        phase: 'Phase 2: Complex Full-Stack Web Applications (Bubble)',
        weeks: 'Weeks 4 - 6',
        topics: [
          'Bubble responsive layout engine, custom states, and reusable elements',
          'User authentication, role-based privacy rules, and relational data structures',
          'Custom workflows, condition logic, and Stripe payment gateway integrations'
        ],
        project: 'Multi-Vendor Marketplace MVP with User Profiles, Search, and Live Stripe Checkout.'
      },
      {
        phase: 'Phase 3: Automated Architecture (Make.com, Zapier & Airtable)',
        weeks: 'Weeks 7 - 10',
        topics: [
          'Airtable relational database modeling (1:N and N:M linked records, rollups)',
          'Make.com scenario routing, webhook ingestion, routers, and JSON aggregators',
          'Connecting OpenAI API for automated content generation and Slack notifications'
        ],
        project: 'Automated CRM Lead Enrichment & Invoicing Pipeline synchronizing Stripe, Make, and Airtable.'
      }
    ],
    jobRoles: [
      { title: 'No-Code Developer / Bubble Specialist', salary: '₹6.0L – ₹14.0L', demand: 'Very High' },
      { title: 'Webflow Designer & Developer', salary: '₹5.5L – ₹12.5L', demand: 'High' },
      { title: 'Automation Architect (Make / Zapier)', salary: '₹8.0L – ₹18.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'How do you structure privacy rules in Bubble to ensure sensitive user data is not leaked?',
        answer: 'Bubble privacy rules are defined on data types on the server side. You specify conditions (e.g. "Current User is This Thing\'s Creator" or "Current User\'s Role is Admin") and restrict viewable fields, search visibility, and auto-binding. This prevents client-side inspection tools from intercepting unauthorized database fields.'
      },
      {
        question: 'What is the advantage of using Make.com (formerly Integromat) over Zapier for complex automation architectures?',
        answer: 'Make.com provides visual multi-branch routing, array iterators and aggregators, advanced error-handling directives (Rollback, Resume, Ignore), granular execution history, and substantially lower per-operation cost for enterprise data volumes compared to Zapier.'
      }
    ],
    faqs: [
      {
        question: 'Can no-code applications scale to tens of thousands of users?',
        answer: 'Yes! Bubble applications routinely handle millions of monthly pageviews and millions of database records when database indexes and search queries are properly architected.'
      },
      {
        question: 'How much can a freelance No-Code developer earn in India?',
        answer: 'Indian freelancers targeting US and European clients typically earn between $2,000 and $6,000 (₹1.6L to ₹5L) per month by delivering complete MVPs and automation workflows.'
      }
    ],
    relatedSkills: ['product-management-growth', 'digital-marketing-seo-performance', 'freelancing-usd']
  },

  {
    slug: 'digital-marketing-seo-performance',
    title: 'Digital Marketing & SEO Performance',
    category: 'growth-nocode',
    domainSlug: 'business-growth-nocode',
    categoryLabel: 'Business & Growth',
    shortDesc: 'Master database-driven programmatic SEO, Meta & Google Ads performance arbitrage, and technical Core Web Vitals audits.',
    longDesc: 'Digital marketing has evolved into an algorithmic, data-driven science. Master Programmatic SEO to dynamically generate thousands of high-converting, indexable landing pages targeting long-tail intent. Learn Performance Marketing arbitrage on Meta Ads Manager and Google Ads to scale ROAS (Return on Ad Spend), implement server-side Conversion APIs (CAPI), and conduct technical SEO audits that maximize Google crawl budgets and Core Web Vitals.',
    heroImage: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=1200&q=80',
    conceptDiagram: {
      title: 'Programmatic SEO & Performance Paid Media Arbitrage Funnel',
      caption: 'Two-engine growth architecture: Organic programmatic SEO capturing long-tail zero-CAC search intent, paired with Meta & Google Ads conversion arbitrage funnels.',
      imageUrl: '/images/concepts/concept-programmatic-seo.svg',
      keyPoints: [
        { label: 'Database-Driven SEO', description: 'Generating thousands of unique, helpful landing pages targeting localized queries from structured relational datasets.' },
        { label: 'Technical SEO Auditing', description: 'Optimizing crawl efficiency, XML sitemap hierarchies, schema markup, and sub-second Core Web Vitals (LCP/CLS).' },
        { label: 'Paid Arbitrage Engine', description: 'Scaling Meta Advantage+ and Google Performance Max campaigns with dynamic creative testing and ROAS > 3.0x.' },
        { label: 'Server-Side Tracking', description: 'Implementing Meta Conversions API (CAPI) and GA4 server containers to bypass adblockers and cookie degradation.' }
      ]
    },
    salaryRange: '₹5.0L – ₹16.0L LPA',
    minSalaryLPA: 5.0,
    maxSalaryLPA: 16.0,
    averageSalaryLPA: 9.5,
    timelineWeeks: '8 – 12 Weeks',
    hiringVolume: '28,000+ Openings in India',
    experienceLevel: 'Fresher Friendly',
    topCities: ['Bengaluru', 'Mumbai', 'Delhi NCR', 'Jaipur', 'Ahmedabad'],
    tools: ['Programmatic SEO', 'Meta Ads Manager', 'Google Ads', 'Google Analytics 4 (GA4)', 'Ahrefs / Semrush', 'Screaming Frog', 'Meta CAPI', 'Search Console'],
    keyHighlights: [
      'Essential revenue driver for E-Commerce, D2C brands, EdTech, FinTech, and B2B SaaS',
      'Combines quantitative analytics, copywriting psychology, and technical web architectures',
      'High freelancing and agency client retainer potential (₹40,000 to ₹1.5L/month per client)'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Technical SEO Audits & Core Web Vitals',
        weeks: 'Weeks 1 - 4',
        topics: [
          'Crawling sites with Screaming Frog: Status codes, redirect chains, canonical tags',
          'Optimizing Core Web Vitals: LCP, INP, and CLS minimization strategies',
          'Structured schema markup (JSON-LD): Organization, Product, Course, FAQPage'
        ],
        project: 'Complete Technical SEO Audit Report of an E-Commerce Website with prioritized fixes.'
      },
      {
        phase: 'Phase 2: Programmatic SEO Architecture & Indexation',
        weeks: 'Weeks 5 - 8',
        topics: [
          'Keyword research for programmatic templates: Head terms vs long-tail modifiers',
          'Building relational datasets (cities, comparisons, tools) in Next.js / Webflow',
          'Internal linking equity algorithms and automated XML sitemap clustering'
        ],
        project: 'Programmatic SEO Directory generating 2,500 indexable, unique comparison landing pages.'
      },
      {
        phase: 'Phase 3: Performance Marketing & Paid Ad Arbitrage',
        weeks: 'Weeks 9 - 12',
        topics: [
          'Meta Ads Manager: Advantage+ campaigns, creative fatigue management, hook rates',
          'Google Ads: Performance Max (PMax), Search intent bidding, negative keyword lists',
          'Server-side Conversion API (CAPI) setup and multi-touch GA4 attribution modeling'
        ],
        project: 'End-to-End Meta & Google Ads Performance Campaign scaling to 3.8x ROAS.'
      }
    ],
    jobRoles: [
      { title: 'Performance Marketing Specialist', salary: '₹6.0L – ₹12.0L', demand: 'Very High' },
      { title: 'Technical SEO Strategist', salary: '₹5.5L – ₹11.0L', demand: 'High' },
      { title: 'Growth Marketer / Media Buyer', salary: '₹8.0L – ₹18.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'What is Programmatic SEO and how do you avoid Google "thin content" penalties?',
        answer: 'Programmatic SEO is the practice of publishing landing pages at scale using structured database templates. To prevent Google "thin content" or unhelpful content penalties, each programmatic page must contain unique proprietary data, customized interactive elements (calculators, local reviews, maps), dynamic user-generated content, and genuine unique value that directly answers the user search query.'
      },
      {
        question: 'Why is Meta Conversions API (CAPI) critical alongside standard browser pixel tracking?',
        answer: 'Browser pixels suffer up to 30-40% data loss due to iOS privacy restrictions (ATT), adblockers, and third-party cookie phaseouts. Meta CAPI sends event data (purchases, leads) directly from the server to Meta, ensuring accurate attribution, superior audience matching, and lower customer acquisition costs (CAC).'
      }
    ],
    faqs: [
      {
        question: 'How quickly can I see results from Programmatic SEO?',
        answer: 'Indexation typically begins within 2 to 4 weeks, with compounding organic traffic scaling significantly within 3 to 6 months as internal link equity builds.'
      },
      {
        question: 'Is performance marketing stressful with ad spend budgets?',
        answer: 'It is highly rewarding because success is directly measurable in revenue and ROAS. Systematic A/B testing and structured budgets eliminate guesswork.'
      }
    ],
    relatedSkills: ['product-management-growth', 'nocode-lowcode-development', 'content-writing-seo']
  },

  // =========================================================================
  // DOMAIN 3: CREATIVE & DESIGN MEDIA
  // =========================================================================
  {
    slug: 'ui-ux-product-design',
    title: 'UI/UX & Product Design',
    category: 'creative-media',
    domainSlug: 'creative-design-media',
    categoryLabel: 'Creative & Design',
    shortDesc: 'Master design systems in Figma, component variables, tactile micro-interactions (Framer/Rive), and UX research methodologies.',
    longDesc: 'Product designers shape how humans interact with technology. Master multi-theme design systems in Figma using variables and auto-layout 5.0, create spring-physics micro-interactions in Framer and Rive, conduct qualitative user research and usability testing on Maze, and ensure full WCAG 2.2 accessibility compliance for web and mobile interfaces.',
    heroImage: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80',
    conceptDiagram: {
      title: 'Figma Atomic Design Tokens & Framer Micro-Interaction Architecture',
      caption: 'Hierarchical design system structure spanning primitive global tokens, semantic theming variables, Figma auto-layout components, and Framer interactive state machines.',
      imageUrl: '/images/concepts/concept-figma-design-tokens.svg',
      keyPoints: [
        { label: 'Primitive Global Tokens', description: 'Raw hex color palettes, typography scales, and 8pt grid spacing values defined as foundation primitives.' },
        { label: 'Semantic Theming Variables', description: 'Multi-mode variables supporting seamless Dark/Light theme switching and multi-brand white-labeling.' },
        { label: 'Auto-Layout 5.0 Components', description: 'Responsive button, form, and navigation components with hover, active, focus, and disabled variants.' },
        { label: 'Tactile Framer Physics', description: 'Spring-driven micro-interactions, drag gestures, and dynamic state machines providing instant feedback.' }
      ]
    },
    salaryRange: '₹6.0L – ₹20.0L LPA',
    minSalaryLPA: 6.0,
    maxSalaryLPA: 20.0,
    averageSalaryLPA: 12.0,
    timelineWeeks: '10 – 14 Weeks',
    hiringVolume: '15,000+ Openings',
    experienceLevel: 'Fresher Friendly',
    topCities: ['Bengaluru', 'Mumbai', 'Gurugram', 'Pune', 'Hyderabad'],
    tools: ['Figma (Auto-Layout & Variables)', 'Framer', 'Rive', 'UX Research', 'Maze', 'FigJam', 'WCAG 2.2 Accessibility', 'Notion'],
    keyHighlights: [
      'High visual impact without requiring complex mathematical programming',
      'Massive demand across high-growth startups (Swiggy, Zomato, CRED, Zerodha) prioritizing premium craft',
      'Fast-track career progression into Senior Product Designer, Design Systems Lead, and Head of Design'
    ],
    syllabus: [
      {
        phase: 'Phase 1: UX Research Methodologies & Information Architecture',
        weeks: 'Weeks 1 - 4',
        topics: [
          'User interviews, empathy mapping, and persona synthesis',
          'Card sorting, user journey mapping, and low-fidelity wireframing',
          'Usability testing protocols and unmoderated testing with Maze'
        ],
        project: 'FinTech Micro-Savings Mobile App User Research & Usability Case Study.'
      },
      {
        phase: 'Phase 2: Scalable Design Systems & Figma Variables',
        weeks: 'Weeks 5 - 9',
        topics: [
          'Figma Auto-Layout 5.0, constraints, component variants, and nested properties',
          'Design Tokens: Primitive tokens, semantic variables, and Dark/Light mode switching',
          'WCAG 2.2 AAA accessibility, contrast ratio audits, and Developer Mode specs'
        ],
        project: 'Multi-Brand Enterprise Design System with 40+ Accessible Components in Figma.'
      },
      {
        phase: 'Phase 3: Micro-Interactions & Interactive Prototyping (Framer / Rive)',
        weeks: 'Weeks 10 - 14',
        topics: [
          'Physics-based spring animations and tactile button states in Framer',
          'State machine animations, cursor tracking, and loaders in Rive',
          'Publishing case studies on Behance, Dribbble, and personal portfolio domains'
        ],
        project: 'Interactive High-Fidelity Framer Prototype with Physics Micro-Interactions.'
      }
    ],
    jobRoles: [
      { title: 'UI/UX Designer', salary: '₹5.5L – ₹11.0L', demand: 'Very High' },
      { title: 'Product Designer', salary: '₹9.0L – ₹18.0L', demand: 'Very High' },
      { title: 'Design Systems Lead', salary: '₹14.0L – ₹26.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between Primitive Tokens and Semantic Tokens in a Figma Design System?',
        answer: 'Primitive tokens represent raw, immutable values (e.g., color-purple-500 = #8B5CF6, spacing-4 = 16px). Semantic tokens assign contextual meaning to those primitives (e.g., color-text-action = color-purple-500, color-background-surface = color-slate-900). Semantic tokens allow the entire product to switch themes (light/dark) or rebrand without altering underlying component structures.'
      },
      {
        question: 'How do you conduct an effective unmoderated usability test?',
        answer: 'Define specific, measurable user goals (e.g. "Complete checkout using UPI"), create realistic prototype flows on tools like Maze, write neutral scenario instructions without leading prompts, and evaluate quantitative metrics (time-on-task, misclick rate) alongside qualitative user feedback recordings.'
      }
    ],
    faqs: [
      {
        question: 'Do I need drawing or illustration skills to be a UI/UX designer?',
        answer: 'No. UI/UX design is about problem-solving, information hierarchy, layout systems, user psychology, and component consistency.'
      },
      {
        question: 'How important is a design portfolio versus a formal degree?',
        answer: 'A portfolio with 2 to 3 detailed, end-to-end case studies showing your thinking, iterations, and metrics is 90% of what hiring managers evaluate.'
      }
    ],
    relatedSkills: ['product-management-growth', '3d-spatial-computing', 'nocode-lowcode-development']
  },

  {
    slug: '3d-spatial-computing',
    title: '3D & Spatial Computing',
    category: 'creative-media',
    domainSlug: 'creative-design-media',
    categoryLabel: 'Creative & Design',
    shortDesc: 'Build real-time photorealistic 3D environments, ArchViz, game worlds in Unreal Engine 5, and spatial UI for Apple Vision Pro.',
    longDesc: 'Spatial computing is redefining human-computer interaction across gaming, architectural visualization, virtual production, and mixed reality. Master hard-surface 3D asset modeling in Blender, real-time virtual geometry (Nanite) and dynamic global illumination (Lumen) in Unreal Engine 5, and design next-generation spatial computing interfaces for Apple Vision Pro using visionOS and RealityKit.',
    heroImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    conceptDiagram: {
      title: '3D Asset Pipeline from Blender to UE5 & Apple Vision Pro Spatial UI',
      caption: 'End-to-end production workflow: Blender PBR modeling, Unreal Engine 5 real-time Nanite/Lumen rendering, and visionOS spatial computing interactive windows.',
      imageUrl: '/images/concepts/concept-3d-spatial-pipeline.svg',
      keyPoints: [
        { label: 'Blender 3D Modeling', description: 'Hard-surface quad topology, UV unwrapping, and PBR texture baking exported to clean FBX and USDZ formats.' },
        { label: 'Unreal Engine 5 Real-Time', description: 'Nanite virtualized geometry and Lumen dynamic global illumination rendering cinematic ArchViz at 60fps.' },
        { label: 'Apple Vision Pro (visionOS)', description: 'SwiftUI spatial windows, 3D volumes, and RealityKit interactive anchor points in physical space.' },
        { label: 'Eye & Hand Tracking', description: 'Designing natural spatial interactions triggered by gaze focus and micro-pinch finger gestures.' }
      ]
    },
    salaryRange: '₹7.0L – ₹24.0L LPA',
    minSalaryLPA: 7.0,
    maxSalaryLPA: 24.0,
    averageSalaryLPA: 14.5,
    timelineWeeks: '14 – 18 Weeks',
    hiringVolume: '8,500+ Openings',
    experienceLevel: 'Intermediate',
    topCities: ['Bengaluru', 'Mumbai', 'Pune', 'Hyderabad', 'Chennai'],
    tools: ['Blender 3D', 'Unreal Engine 5 (UE5)', 'Apple Vision Pro (visionOS)', 'Nanite & Lumen', 'PBR Texturing', 'RealityKit', 'SwiftUI', 'Substance Painter'],
    keyHighlights: [
      'Massive surge in demand from global gaming studios, luxury real estate developers, and automotive virtual showrooms',
      'Unreal Engine 5 has become the undisputed standard for ArchViz, automotive configurators, and Hollywood virtual production',
      'Early-mover advantage in Apple Vision Pro spatial computing ecosystem'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Blender 3D Asset Pipeline & PBR Materials',
        weeks: 'Weeks 1 - 5',
        topics: [
          'Hard surface modeling, modifiers (bevel, boolean), and clean quad topology',
          'UV mapping, texel density calculation, and texture baking in Substance/Blender',
          'PBR material workflows: Albedo, Roughness, Metallic, Normal maps'
        ],
        project: 'Photorealistic Hard-Surface Sci-Fi / Product Asset with PBR Texture Maps.'
      },
      {
        phase: 'Phase 2: Unreal Engine 5 Real-Time ArchViz & Environments',
        weeks: 'Weeks 6 - 11',
        topics: [
          'Nanite virtualized geometry import and performance profiling',
          'Lumen dynamic global illumination, reflections, and post-processing volumes',
          'Blueprint visual scripting for architectural door triggers, lighting changes, and material swaps'
        ],
        project: 'Real-Time Photorealistic Luxury Villa Walkthrough in Unreal Engine 5.'
      },
      {
        phase: 'Phase 3: Apple Vision Pro Spatial UI & visionOS Development',
        weeks: 'Weeks 12 - 16',
        topics: [
          'Spatial design principles: Windows, Volumes, and Immersive Spaces in visionOS',
          'RealityKit entities, RealityView, and USDZ model placement in passthrough AR',
          'Spatial audio integration and gaze/hand-tracking pinch gesture interactions'
        ],
        project: 'Interactive visionOS Spatial Product Showcase allowing users to inspect and disassemble a 3D model.'
      }
    ],
    jobRoles: [
      { title: '3D Generalist / Environment Artist', salary: '₹6.5L – ₹14.0L', demand: 'High' },
      { title: 'Unreal Engine 5 Real-Time Developer', salary: '₹9.0L – ₹20.0L', demand: 'Very High' },
      { title: 'Spatial Computing UI Designer', salary: '₹12.0L – ₹26.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'How do Nanite and Lumen revolutionize real-time rendering in Unreal Engine 5?',
        answer: 'Nanite virtualizes geometry, allowing developers to import film-quality assets with millions of polygons directly into the engine without manual LOD (Level of Detail) authoring; it dynamically scales rendering detail to the pixel level. Lumen provides fully real-time dynamic global illumination and reflections, eliminating the hours previously required to bake static lightmaps.'
      },
      {
        question: 'What are the three core presentation modes in visionOS for Apple Vision Pro?',
        answer: 'The three modes are: 1) Windows (2D planes floating in physical space built with familiar SwiftUI), 2) Volumes (bounded 3D bounded containers presenting volumetric content with RealityKit), and 3) Immersive Spaces (unbounded mixed or fully immersive virtual reality environments taking over the user’s peripheral vision).'
      }
    ],
    faqs: [
      {
        question: 'Do I need a Mac or Apple Vision Pro hardware to learn spatial computing?',
        answer: 'Blender and Unreal Engine 5 run smoothly on Windows PCs with modern NVIDIA GPUs (RTX 3060 or higher). visionOS development can be practiced using the official visionOS Simulator in Xcode on macOS.'
      },
      {
        question: 'Which industries are hiring 3D and spatial developers in India?',
        answer: 'Gaming studios, real estate luxury ArchViz firms, automotive OEMs (virtual crash tests & digital twins), and enterprise training companies.'
      }
    ],
    relatedSkills: ['ui-ux-product-design', 'full-stack-web', 'video-editing']
  },

  // =========================================================================
  // DOMAIN 4: GREEN TECH & SUSTAINABLE INDUSTRY
  // =========================================================================
  {
    slug: 'ev-battery-tech',
    title: 'EV Powertrain & Battery Management Systems (BMS)',
    category: 'green-tech',
    domainSlug: 'green-tech-sustainability',
    categoryLabel: 'Green Tech & Mobility',
    shortDesc: 'Master electric vehicle powertrain engineering, Battery Management Systems (BMS), cell balancing, and CCS2 fast charging standards.',
    longDesc: 'The electric mobility revolution is sweeping across two-wheelers, passenger cars, and commercial fleets in India and globally. Master the core engineering of electric vehicle powertrains, Lithium-ion cell chemistry (LFP/NMC), Battery Management Systems (BMS) hardware and active cell balancing, traction inverter thermodynamics, and international fast-charging communication protocols (CCS2, Type-2, and GB/T).',
    heroImage: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=80',
    conceptDiagram: {
      title: 'EV Powertrain, BMS Control Loop & High-Power Charging Flow',
      caption: 'Four-stage electric vehicle power transmission architecture: HV battery pack with active cell balancing, SiC traction inverter, permanent magnet motor, and CCS2 DC fast charging.',
      imageUrl: '/images/concepts/concept-ev-bms-powertrain.svg',
      keyPoints: [
        { label: 'HV Battery & Cell Balancing', description: 'LFP/NMC cell stacks managed by BMS microcontrollers equalizing voltages to ±5mV and calculating State-of-Charge (SoC).' },
        { label: 'Silicon Carbide Traction Inverter', description: 'High-frequency DC-to-3-Phase AC power conversion with >98% thermal efficiency and regenerative braking.' },
        { label: 'Permanent Magnet Motor', description: 'Instantaneous torque delivery, field-oriented control (FOC), and dynamic cornering stability.' },
        { label: 'Fast-Charging Standards', description: 'CCS2 and Type-2 standards supporting 350kW DC fast-charging with ISO 15118 plug-and-charge cryptographic handshakes.' }
      ]
    },
    salaryRange: '₹6.5L – ₹22.0L LPA',
    minSalaryLPA: 6.5,
    maxSalaryLPA: 22.0,
    averageSalaryLPA: 13.5,
    timelineWeeks: '14 – 18 Weeks',
    hiringVolume: '16,000+ Automotive Roles',
    experienceLevel: 'Intermediate',
    topCities: ['Pune', 'Chennai', 'Bengaluru', 'Ahmedabad', 'Manesar / Gurugram'],
    tools: ['EV Powertrain Engineering', 'Battery Management Systems (BMS)', 'CCS2 / Type-2 Standards', 'MATLAB / Simulink', 'CANoe / CANalyzer', 'Cell Balancing Topologies', 'Thermal Cooling Sim'],
    keyHighlights: [
      'Massive hiring surge backed by India’s PLI (Production Linked Incentive) scheme and global EV adoption mandates',
      'High-demand transition track for mechanical, electrical, and electronics engineering graduates',
      'Direct pathway to Lead Powertrain Architect, Chief BMS Engineer, and Battery R&D Director'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Lithium-Ion Battery Chemistry & Pack Architecture',
        weeks: 'Weeks 1 - 5',
        topics: [
          'Lithium iron phosphate (LFP) vs Nickel Manganese Cobalt (NMC) trade-offs',
          'Series-parallel cell sizing, busbar design, and packaging constraints',
          'Thermal runaway mechanics, propagation prevention, and liquid cooling plates'
        ],
        project: 'Thermal Dissipation & Structural Battery Pack Sizing Simulation for a 40kWh EV.'
      },
      {
        phase: 'Phase 2: BMS Architecture & State Estimation Algorithms',
        weeks: 'Weeks 6 - 11',
        topics: [
          'Passive vs Active cell voltage balancing topologies',
          'State of Charge (SoC) and State of Health (SoH) calculation using Extended Kalman Filters',
          'Over-voltage, under-voltage, over-current, and isolation resistance fault protection'
        ],
        project: 'MATLAB / Simulink BMS Simulation with Active Cell Balancing and Short-Circuit Protection.'
      },
      {
        phase: 'Phase 3: Traction Inverters, Motor Control & Charging Protocols',
        weeks: 'Weeks 12 - 16',
        topics: [
          'Silicon Carbide (SiC) vs IGBT traction inverter thermodynamics and Space Vector PWM',
          'Field-Oriented Control (FOC) of Permanent Magnet Synchronous Motors (PMSM)',
          'CCS2 / Type-2 charging communication protocols, PLC controllers, and ISO 15118 standards'
        ],
        project: 'Hardware-in-the-Loop (HIL) Test Protocol for a 150kW CCS2 DC Fast Charging Session.'
      }
    ],
    jobRoles: [
      { title: 'BMS Hardware / Firmware Engineer', salary: '₹7.0L – ₹15.0L', demand: 'Very High' },
      { title: 'EV Powertrain Systems Engineer', salary: '₹9.0L – ₹20.0L', demand: 'High' },
      { title: 'Battery Pack Thermal Analyst', salary: '₹8.0L – ₹16.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'What is the fundamental difference between Passive and Active Cell Balancing in a BMS?',
        answer: 'Passive balancing burns off excess energy from higher-voltage cells as heat through bleed resistors until all cells match the lowest cell. Active balancing uses capacitive or inductive charge-shuttling circuits to transfer energy from higher-voltage cells to lower-voltage cells, conserving pack energy, generating less thermal heat, and maximizing total vehicle range.'
      },
      {
        question: 'Why is LFP chemistry preferred for electric two-wheelers and buses in Indian tropical climates?',
        answer: 'LFP (Lithium Iron Phosphate) has superior thermal stability with a thermal runaway threshold around ~270°C (compared to ~210°C for NMC), exceptional cycle life (3,000+ cycles vs 1,500 for NMC), and uses non-toxic iron and phosphate without volatile cobalt, making it much safer in high ambient Indian temperatures (45°C+).'
      }
    ],
    faqs: [
      {
        question: 'Which Indian companies hire EV powertrain and BMS engineers?',
        answer: 'Automotive OEMs (Tata Motors, Mahindra Electric, Ola Electric, Ather Energy), global Tier-1 suppliers (Bosch India, Continental, Valeo), and battery gigafactories (Exide, Amara Raja).'
      },
      {
        question: 'Is MATLAB and Simulink proficiency required for EV engineering?',
        answer: 'Yes! Model-Based Development (MBD) in MATLAB/Simulink is standard for control algorithm verification and auto-code generation for automotive ECUs.'
      }
    ],
    relatedSkills: ['solar-renewable-energy-design', 'iot-embedded-systems', 'cloud-platform-engineering']
  },

  {
    slug: 'solar-renewable-energy-design',
    title: 'Solar & Renewable Energy Design (PVsyst & ESG)',
    category: 'green-tech',
    domainSlug: 'green-tech-sustainability',
    categoryLabel: 'Green Tech & Sustainability',
    shortDesc: 'Master utility-scale solar farm PVsyst 3D modeling, high-voltage grid interconnection, and corporate ESG sustainability compliance.',
    longDesc: 'As global nations commit to Net Zero emissions and India targets 500GW of non-fossil capacity by 2030, solar and renewable energy design has become a high-growth career track. Master PVsyst 3D near-shading simulations, P50/P90 energy yield DPR forecasting, central vs string inverter sizing, high-voltage substation grid interconnection, and corporate ESG compliance auditing under SEBI BRSR and GHG Protocol standards.',
    heroImage: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1200&q=80',
    conceptDiagram: {
      title: 'Utility Solar Farm PVsyst Simulation & High-Voltage Grid Interconnection',
      caption: 'Four-stage renewable lifecycle: PVsyst 3D yield modeling, central inverter DC/AC conversion, substation grid synchronization, and SEBI BRSR ESG compliance reporting.',
      imageUrl: '/images/concepts/concept-solar-pvsyst-grid.svg',
      keyPoints: [
        { label: 'PVsyst 3D Shading Simulation', description: 'Simulating complex terrain near-shading losses and bifacial albedo gain to compute P50/P90 bankable energy yields.' },
        { label: 'Balance of Plant (BOP)', description: 'Sizing 1500V DC solar array strings, combiner boxes, central inverters, and medium-voltage step-up transformers.' },
        { label: 'Substation Grid Sync', description: 'Synchronizing with state transmission utilities at 33kV/132kV while complying with CEA grid code harmonic standards.' },
        { label: 'Corporate ESG Auditing', description: 'Calculating Scope 1, 2, and 3 greenhouse gas emissions and auditing corporate compliance under SEBI BRSR guidelines.' }
      ]
    },
    salaryRange: '₹5.5L – ₹18.0L LPA',
    minSalaryLPA: 5.5,
    maxSalaryLPA: 18.0,
    averageSalaryLPA: 10.5,
    timelineWeeks: '10 – 14 Weeks',
    hiringVolume: '14,500+ Openings',
    experienceLevel: 'Fresher Friendly',
    topCities: ['Ahmedabad', 'Bengaluru', 'Delhi NCR', 'Hyderabad', 'Jaipur'],
    tools: ['PVsyst 3D Modeling', 'Solar Farm Grid Integration', 'ESG Compliance Auditing', 'AutoCAD Electrical', 'Helioscope', 'SEBI BRSR Core', 'GHG Protocol Carbon Accounting'],
    keyHighlights: [
      'Massive solar park buildouts across Rajasthan, Gujarat, Karnataka, and Madhya Pradesh',
      'Mandatory SEBI BRSR reporting for India’s top 1,000 listed companies created an urgent shortage of ESG auditors',
      'Direct gateway into multi-million dollar renewable energy EPC contractors and green energy funds'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Solar Irradiance & PVsyst 3D Yield Modeling',
        weeks: 'Weeks 1 - 4',
        topics: [
          'Global Horizontal Irradiance (GHI) and DNI meteorological data sourcing',
          'PVsyst 3D scene construction, near-shading calculations, and bifacial module albedo gain',
          'P50, P90, and P99 generation probability curves for bankable Detailed Project Reports (DPR)'
        ],
        project: '50MW Utility Solar PVsyst Energy Yield & Bankability Detailed Project Report.'
      },
      {
        phase: 'Phase 2: Electrical Balance of Plant & Substation Grid Integration',
        weeks: 'Weeks 5 - 8',
        topics: [
          '1500V DC array stringing, DC/AC inverter loading ratio (ILR), and combiner box sizing',
          'Step-up transformers (800V to 33kV to 132kV) and single-line diagrams (SLD) in AutoCAD',
          'Grid code compliance, CEA harmonic limits, and SCADA monitoring protocols'
        ],
        project: 'Complete Single Line Diagram (SLD) and Balance of Plant Design for a 20MW Solar Farm.'
      },
      {
        phase: 'Phase 3: ESG Compliance Auditing & Carbon Decarbonization',
        weeks: 'Weeks 9 - 14',
        topics: [
          'SEBI Business Responsibility and Sustainability Reporting (BRSR Core) guidelines',
          'Scope 1 (Direct), Scope 2 (Electricity), and Scope 3 (Value Chain) GHG carbon accounting',
          'International Renewable Energy Certificates (I-RECs) and corporate net-zero roadmaps'
        ],
        project: 'Corporate Scope 1-3 Decarbonization Audit & SEBI BRSR Compliance Dossier.'
      }
    ],
    jobRoles: [
      { title: 'Solar Design & PVsyst Engineer', salary: '₹5.5L – ₹11.0L', demand: 'Very High' },
      { title: 'Renewable Energy Project Manager', salary: '₹9.0L – ₹18.0L', demand: 'High' },
      { title: 'ESG Sustainability Analyst', salary: '₹7.0L – ₹15.0L', demand: 'Very High' }
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between P50 and P90 energy generation estimates in PVsyst?',
        answer: 'P50 represents the energy yield where there is a 50% probability that actual production will exceed that value in any given year (the expected median). P90 is a conservative financial benchmark where there is a 90% probability that production will exceed this threshold. Commercial lenders and banks insist on P90 estimates to calculate debt service coverage ratios (DSCR).'
      },
      {
        question: 'What are Scope 1, Scope 2, and Scope 3 greenhouse gas emissions under the GHG Protocol?',
        answer: 'Scope 1 covers direct emissions from company-owned sources (e.g. diesel generators, company vehicles). Scope 2 covers indirect emissions from the generation of purchased electricity, steam, heating, and cooling consumed by the reporting company. Scope 3 covers all other indirect emissions across the entire upstream and downstream value chain (supply chain suppliers, employee commutes, product end-of-life disposal).'
      }
    ],
    faqs: [
      {
        question: 'Do I need an electrical engineering degree to work in solar design?',
        answer: 'An electrical or mechanical engineering degree is traditional, but civil engineers, environmental science graduates, and architects routinely design solar farms after mastering PVsyst and AutoCAD.'
      },
      {
        question: 'What is driving the massive boom in ESG compliance auditing in India?',
        answer: 'The Securities and Exchange Board of India (SEBI) made Business Responsibility and Sustainability Reporting (BRSR) mandatory for the top 1,000 listed companies, requiring verified assurance of ESG metrics.'
      }
    ],
    relatedSkills: ['ev-battery-tech', 'cloud-platform-engineering', 'risk-compliance-bfsi']
  }
];
