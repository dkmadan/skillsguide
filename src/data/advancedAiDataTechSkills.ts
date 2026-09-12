import type { SkillDetail } from './skillsData';

export const advancedAiDataTechSkills: SkillDetail[] = [
  {
    slug: 'ai-agent-evaluation-observability',
    title: 'AI Agent Evaluation & LLM Observability',
    category: 'emerging-tech',
    domainSlug: 'emerging-tech-ai',
    categoryLabel: 'Emerging Tech & AI',
    shortDesc: 'Evaluate agentic LLM outputs, benchmark RAG pipelines with Ragas & TruLens, and trace multi-hop spans with LangSmith & Arize Phoenix.',
    longDesc: 'Building AI agents is only half the battle—evaluating and monitoring them in production determines enterprise viability. Master LLM evaluation frameworks (Ragas, TruLens, DeepEval), synthetic test dataset generation, multi-hop agent tracing, hallucination rate quantification, token latency profiling, and semantic drift detection with LangSmith and Arize Phoenix.',
    heroImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'LLM Observability & Continuous Agent Evaluation Pipeline',
      caption: 'Prompt execution, OpenTelemetry span capture, Ragas metric evaluation, and automated regression benchmarking.',
      imageUrl: '/images/concepts/concept-ai-mlops.svg',
      keyPoints: [
        { label: 'RAG Triad Metrics', description: 'Quantifying Context Relevance, Groundedness (Faithfulness), and Answer Relevance.' },
        { label: 'Distributed Tracing Spans', description: 'Capturing token latency, cost, and tool-call payload execution across multi-agent loops.' },
        { label: 'Synthetic Benchmark Suites', description: 'Generating hundreds of edge-case evaluation QA pairs using LLM-as-a-Judge.' },
        { label: 'CI/CD Regression Gates', description: 'Failing automated pull requests if hallucination score exceeds 2% or latency spikes.' }
      ]
    },
    salaryRange: '₹14.0L – ₹35.0L LPA',
    minSalaryLPA: 14.0,
    maxSalaryLPA: 35.0,
    averageSalaryLPA: 22.5,
    timelineWeeks: '8 – 12 Weeks',
    hiringVolume: '14,000+ AI Systems Openings',
    experienceLevel: 'Intermediate to Advanced',
    topCities: ['Bengaluru', 'Hyderabad', 'Pune', 'Gurugram', 'San Francisco (Remote)'],
    tools: ['LangSmith', 'Arize Phoenix', 'Ragas Framework', 'DeepEval', 'OpenTelemetry', 'Python', 'Weights & Biases'],
    keyHighlights: [
      'Highest-priority technical hire for enterprise GenAI labs deploying production agentic workflows',
      'Transforms vague prompt tinkering into deterministic, measurable, and regression-tested engineering',
      'Direct pathway into Principal AI Systems Engineer and AI Platform Architect'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Metric Foundations & RAG Triad Evaluation',
        weeks: 'Weeks 1 - 4',
        topics: ['The RAG Triad: Faithfulness, Answer Relevance, and Context Precision/Recall', 'Implementing Ragas and DeepEval for automated offline evaluation suites', 'LLM-as-a-Judge prompting patterns, calibration against human gold standards, and G-Eval scoring'],
        project: 'Build an Automated Evaluation Benchmark measuring hallucination and retrieval precision across 500 documents.'
      },
      {
        phase: 'Phase 2: Production Observability, Tracing & Cost Telemetry',
        weeks: 'Weeks 5 - 8',
        topics: ['Instrumenting LangChain, LangGraph, and LlamaIndex applications with OpenTelemetry spans', 'LangSmith and Arize Phoenix setup: Tracing multi-agent tool calls, latency bottlenecks, and token cost tracking', 'Online evaluation: User thumbs-up/down telemetry and real-time guardrail failure alerts'],
        project: 'Deploy real-time tracing and telemetry for a multi-agent financial research system with Phoenix.'
      },
      {
        phase: 'Phase 3: CI/CD Quality Gates & Semantic Drift Detection',
        weeks: 'Weeks 9 - 12',
        topics: ['Integrating automated LLM eval suites into GitHub Actions CI/CD deployment pipelines', 'Detecting embedding semantic drift, prompt regression, and out-of-distribution user queries', 'Red-teaming datasets: Testing jailbreak resilience and PII leakage during automated builds'],
        project: 'Create a GitHub Actions CI/CD Pipeline blocking agent deployment on benchmark regression.'
      }
    ],
    jobRoles: [
      { title: 'AI Evaluation & Observability Engineer', salary: '₹14.0L – ₹24.0L', demand: 'Very High' },
      { title: 'Staff AI Systems Architect', salary: '₹25.0L – ₹45.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'How do you calculate Faithfulness and Answer Relevance in a RAG evaluation pipeline using Ragas?',
        answer: 'Faithfulness measures whether the generated answer can be completely grounded in the retrieved context (Statements in answer inferred from context / Total statements in answer). Answer Relevance uses an LLM to generate hypothetical questions from the generated response and computes embedding cosine similarity against the original user query, measuring whether the response directly addresses the question without fluff.'
      }
    ],
    faqs: [
      { question: 'Why is LLM-as-a-Judge preferred over traditional BLEU or ROUGE metrics?', answer: 'BLEU and ROUGE rely on exact n-gram overlap, failing completely when an LLM gives a semantically identical answer using different vocabulary. LLM-as-a-Judge evaluates semantic understanding, reasoning, and nuanced factual accuracy.' }
    ],
    relatedSkills: ['ai-agents-llm-apps', 'ai-security-llm-security', 'mlops-ml-platform', 'multimodal-ai-engineering']
  },
  {
    slug: 'ai-security-llm-security',
    title: 'AI Security, Red Teaming & LLM Defense',
    category: 'emerging-tech',
    domainSlug: 'emerging-tech-ai',
    categoryLabel: 'Emerging Tech & AI',
    shortDesc: 'Defend against prompt injection, jailbreaks, data poisoning, model inversion, and enforce NVIDIA NeMo Guardrails.',
    longDesc: 'AI Security protects enterprise foundation models from adversarial attacks. Master OWASP Top 10 for LLMs, direct and indirect prompt injection defense, red teaming foundation models, PII masking, toxic content filtering, model extraction defenses, and deploying NVIDIA NeMo Guardrails and Llama Guard.',
    heroImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'Enterprise AI Security & Guardrail Defense Architecture',
      caption: 'Input sanitization, prompt injection detection, vector access controls, and output toxicity filtering.',
      imageUrl: '/images/concepts/concept-ai-mlops.svg',
      keyPoints: [
        { label: 'Prompt Injection Defense', description: 'Detecting adversarial system-override tokens and invisible Unicode payloads.' },
        { label: 'Indirect Injection Sanitization', description: 'Sanitizing third-party scraped web pages and emails before LLM ingestion.' },
        { label: 'NeMo Guardrails Execution', description: 'Enforcing topical rails, dialog flow constraints, and factual verification.' },
        { label: 'PII Redaction & Leaks', description: 'Real-time token anonymization preventing confidential model extraction.' }
      ]
    },
    salaryRange: '₹15.0L – ₹38.0L LPA',
    minSalaryLPA: 15.0,
    maxSalaryLPA: 38.0,
    averageSalaryLPA: 24.0,
    timelineWeeks: '8 – 12 Weeks',
    hiringVolume: '10,000+ Specialized Openings',
    experienceLevel: 'Intermediate to Advanced',
    topCities: ['Bengaluru', 'Hyderabad', 'Pune', 'Gurugram', 'Remote'],
    tools: ['NVIDIA NeMo Guardrails', 'Llama Guard 3', 'Garak LLM Vulnerability Scanner', 'PyRIT (Microsoft Red Teaming)', 'Rebuff AI'],
    keyHighlights: [
      'Critical frontier role protecting enterprises from catastrophic AI PR disasters and data leaks',
      'High-paying niche combining cybersecurity penetration testing with deep generative AI architecture',
      'Employed across leading AI research labs, fintechs, defence contractors, and enterprise banks'
    ],
    syllabus: [
      {
        phase: 'Phase 1: OWASP Top 10 for LLMs & Adversarial Prompting',
        weeks: 'Weeks 1 - 4',
        topics: ['OWASP Top 10 for Large Language Model Applications (LLM01 Prompt Injection to LLM10 Model Theft)', 'Direct jailbreak taxonomies: Roleplay persona switches, base64 obfuscation, multi-turn crescendo attacks', 'Indirect prompt injection in RAG pipelines: Malicious payloads hidden in PDFs, emails, and web search results'],
        project: 'Execute an Automated Red-Teaming Attack on an unprotected customer service LLM using Garak.'
      },
      {
        phase: 'Phase 2: Programmable Guardrails & Input/Output Firewalls',
        weeks: 'Weeks 5 - 8',
        topics: ['Deploying NVIDIA NeMo Guardrails (Colang scripts for topical rails, moderation, and fact-checking)', 'Llama Guard 3 and Presidio for real-time PII anonymization and toxic response blocking', 'Defense-in-depth: Dual-LLM validation architectures (Untrusted Content vs Decision-Maker Model)'],
        project: 'Build a Multi-Layered NeMo Guardrail Pipeline blocking prompt injections and data leaks.'
      },
      {
        phase: 'Phase 3: Model Inversion, Poisoning & AI Security Governance',
        weeks: 'Weeks 9 - 12',
        topics: ['Training data extraction attacks and membership inference defense', 'RAG data poisoning: Protecting vector databases from adversarial document injection', 'AI governance risk cards: Threat modeling enterprise AI agents and red team reporting'],
        project: 'Author an Enterprise AI Red-Teaming Audit Report with exploit proofs-of-concept and remediation code.'
      }
    ],
    jobRoles: [
      { title: 'AI Security Engineer / Red Teamer', salary: '₹15.0L – ₹28.0L', demand: 'Very High' },
      { title: 'Head of AI Trust, Safety & Security', salary: '₹30.0L – ₹55.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'What is an Indirect Prompt Injection attack and how do you mitigate it in a RAG system?',
        answer: 'Indirect Prompt Injection occurs when an attacker places adversarial instructions into an external data source (a website, email, or resume) that the LLM later retrieves via RAG or web search. When the LLM ingests this untrusted content, the hidden prompt overrides the system instructions (e.g. instructing the agent to exfiltrate user data). Mitigation includes: isolating untrusted data in separate context blocks, using dual-model architectures, and deploying input guardrails to scan retrieved chunks before context assembly.'
      }
    ],
    faqs: [
      { question: 'What background is best for transitioning into AI Security?', answer: 'A background in cybersecurity (SOC, AppSec, PenTesting) or software engineering combined with hands-on prompt engineering and transformer model understanding.' }
    ],
    relatedSkills: ['ai-agent-evaluation-observability', 'ai-agents-llm-apps', 'api-security', 'devsecops']
  },
  {
    slug: 'multimodal-ai-engineering',
    title: 'Multimodal AI Engineering (Vision, Audio & Video)',
    category: 'emerging-tech',
    domainSlug: 'emerging-tech-ai',
    categoryLabel: 'Emerging Tech & AI',
    shortDesc: 'Build vision-language models (VLM), real-time speech pipelines (Whisper/ElevenLabs), and multimodal spatial reasoning.',
    longDesc: 'The future of AI is multimodal. Master Vision-Language Models (GPT-4o, Claude 3.5 Sonnet, LLaVA), open-source visual fine-tuning (Qwen2-VL), real-time low-latency speech pipelines (Whisper, Kokoro, WebRTC audio streaming), video chunk analysis, and multimodal vector embeddings (CLIP, ColPali).',
    heroImage: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'Multimodal Vision-Language & Audio Processing Architecture',
      caption: 'Image/Audio tokenization, unified cross-attention transformer, and low-latency streaming outputs.',
      imageUrl: '/images/concepts/concept-ai-mlops.svg',
      keyPoints: [
        { label: 'Vision Encoder & Patching', description: 'Transforming images into spatial visual tokens using ViT / SigLIP architectures.' },
        { label: 'ColPali Multi-Vector Search', description: 'Indexing complex PDF document pages directly as visual image patches without messy OCR.' },
        { label: 'Real-Time Voice WebRTC', description: 'Sub-300ms duplex audio streaming using Whisper STT and low-latency neural TTS.' },
        { label: 'Video Frame Reasoning', description: 'Dynamic keyframe extraction and temporal reasoning across hour-long video streams.' }
      ]
    },
    salaryRange: '₹16.0L – ₹40.0L LPA',
    minSalaryLPA: 16.0,
    maxSalaryLPA: 40.0,
    averageSalaryLPA: 26.0,
    timelineWeeks: '10 – 14 Weeks',
    hiringVolume: '12,000+ Frontier AI Openings',
    experienceLevel: 'Advanced',
    topCities: ['Bengaluru', 'Hyderabad', 'Pune', 'Gurugram', 'Remote'],
    tools: ['PyTorch', 'Hugging Face Transformers', 'ColPali VLM Retrieval', 'OpenAI Whisper', 'vLLM VLM', 'LiveKit WebRTC'],
    keyHighlights: [
      'Top-tier engineering track building the next generation of voice agents and vision intelligence',
      'Replaces fragile legacy OCR and text extraction with direct visual document understanding',
      'High demand across autonomous driving, robotics, healthcare imaging, and interactive customer voicebots'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Vision-Language Models & Visual Document RAG',
        weeks: 'Weeks 1 - 4',
        topics: ['Vision Transformer (ViT) architecture, image patch tokenization, and cross-attention projectors', 'Visual Document RAG with ColPali: Querying complex charts, tables, and handwritten notes directly as images', 'Fine-tuning open-source VLMs (LLaVA-NeXT, Qwen2-VL) using LoRA on custom visual datasets'],
        project: 'Build a Vision RAG System parsing multi-column complex financial PDF reports using ColPali.'
      },
      {
        phase: 'Phase 2: Real-Time Audio & Duplex Speech Pipelines',
        weeks: 'Weeks 5 - 8',
        topics: ['Speech-to-Text (STT) optimization: Local Whisper streaming with Voice Activity Detection (Silero VAD)', 'Ultra-low latency Text-to-Speech (TTS) with Kokoro and ElevenLabs', 'Building full-duplex conversational voice agents over WebRTC with LiveKit and OpenAI Realtime API'],
        project: 'Deploy a Sub-400ms Real-Time Conversational AI Voice Assistant with interruption handling.'
      },
      {
        phase: 'Phase 3: Video Analytics & Multimodal Edge Deployment',
        weeks: 'Weeks 9 - 14',
        topics: ['Video reasoning: Temporal sampling, scene boundary detection, and long-context video comprehension', 'Serving multimodal models at scale using vLLM VLM with PagedAttention and FP8 quantization', 'Deploying vision agents on edge devices (NVIDIA Jetson, Apple Silicon MLX)'],
        project: 'Create an End-to-End Multimodal Video Surveillance & Incident Q&A System.'
      }
    ],
    jobRoles: [
      { title: 'Multimodal AI Engineer', salary: '₹16.0L – ₹30.0L', demand: 'Very High' },
      { title: 'Principal Vision-Language Scientist', salary: '₹30.0L – ₹55.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'What is ColPali and how does it revolutionize Document Retrieval compared to traditional OCR + Text RAG?',
        answer: 'Traditional RAG relies on OCR tools to transcribe PDFs into text, discarding layouts, fonts, tables, and images, which causes massive loss of context. ColPali leverages a Vision-Language Model (PaliGemma) to embed entire PDF pages as multi-vector patch representations. At query time, ColPali matches user text queries directly against the visual features of the page, accurately retrieving charts, tables, and complex diagrams without running OCR.'
      }
    ],
    faqs: [
      { question: 'What hardware is needed to train and run multimodal models?', answer: 'Inference can be run locally on Apple Silicon (M2/M3/M4 with unified memory) or NVIDIA GPUs with 16GB+ VRAM (RTX 4090 / A10G); fine-tuning requires 24GB–80GB VRAM (A100/H100).' }
    ],
    relatedSkills: ['ai-agents-llm-apps', 'ai-agent-evaluation-observability', 'computer-vision-engineering', 'data-engineering']
  },
  {
    slug: 'data-engineering',
    title: 'Data Engineering & Big Data Lakehouses',
    category: 'tech',
    domainSlug: 'emerging-tech-ai',
    categoryLabel: 'High-Demand Tech',
    shortDesc: 'Build scalable ETL/ELT pipelines with Apache Spark, Apache Iceberg, Snowflake, Databricks, and dbt.',
    longDesc: 'Data Engineering powers the modern data stack for AI and analytics. Master Apache Spark distributed processing, Apache Iceberg / Delta Lake table formats, Apache Kafka real-time streaming, dbt modular SQL transformations, data orchestration with Apache Airflow, and cloud data warehouses (Snowflake, Databricks).',
    heroImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'Modern Data Lakehouse & Streaming Pipeline Architecture',
      caption: 'Kafka event streams, Spark streaming ingestion, Iceberg storage layer, dbt transformations, and BI mart.',
      imageUrl: '/images/concepts/concept-ai-mlops.svg',
      keyPoints: [
        { label: 'Event Streaming (Kafka)', description: 'Real-time pub/sub event ingestion with schema registry contracts.' },
        { label: 'Apache Spark Processing', description: 'Distributed data transformations, joins, and windowing across petabyte datasets.' },
        { label: 'Lakehouse Table Formats', description: 'Apache Iceberg and Delta Lake providing ACID transactions and time travel.' },
        { label: 'dbt Analytics Modeling', description: 'Modular SQL DAGs with automated testing and documentation.' }
      ]
    },
    salaryRange: '₹7.5L – ₹28.0L LPA',
    minSalaryLPA: 7.5,
    maxSalaryLPA: 28.0,
    averageSalaryLPA: 16.0,
    timelineWeeks: '10 – 14 Weeks',
    hiringVolume: '35,000+ Openings in IT, GCCs & Product Companies',
    experienceLevel: 'Intermediate',
    topCities: ['Bengaluru', 'Hyderabad', 'Pune', 'Gurugram', 'Chennai', 'Mumbai'],
    tools: ['Apache Spark / PySpark', 'Snowflake', 'Databricks', 'dbt Core', 'Apache Kafka', 'Apache Airflow', 'AWS S3 / Glue'],
    keyHighlights: [
      'Foundational infrastructure role with massive hiring across every tech organization and GCC in India',
      'Consistent demand regardless of AI model cycles—clean, reliable data pipelines are universally needed',
      'Direct pathway to Lead Data Architect, Head of Data Platform, and Chief Data Officer'
    ],
    syllabus: [
      {
        phase: 'Phase 1: PySpark & Distributed Processing Foundations',
        weeks: 'Weeks 1 - 4',
        topics: ['Spark architecture: Driver, Executors, DAG scheduler, RDDs, DataFrames, and Catalyst Optimizer', 'Optimizing Spark joins (Broadcast Hash Join, Shuffle Hash Join) and solving data skew/partitioning issues', 'Batch ETL pipelines on AWS S3 / Databricks with schema validation and error handling'],
        project: 'Build an optimized PySpark ETL Pipeline processing 50M e-commerce clickstream records.'
      },
      {
        phase: 'Phase 2: Modern Lakehouse (Iceberg/Delta) & dbt Modeling',
        weeks: 'Weeks 5 - 8',
        topics: ['Open table formats: Apache Iceberg and Delta Lake (ACID transactions, hidden partitioning, time-travel queries)', 'dbt Core: Building Medallion Architecture (Bronze -> Silver -> Gold), incremental models, and Jinja macros', 'Data quality testing with dbt expectations and Great Expectations'],
        project: 'Design a Complete Medallion Lakehouse on Snowflake using dbt with automated CI testing.'
      },
      {
        phase: 'Phase 3: Real-Time Streaming & Orchestration (Kafka, Airflow)',
        weeks: 'Weeks 9 - 14',
        topics: ['Apache Kafka: Topics, partitions, consumer groups, exactly-once semantics, and Kafka Connect', 'Spark Structured Streaming: Processing live Kafka event streams with sliding time windows and watermarking', 'Apache Airflow: Authoring robust DAGs, sensors, dynamic task mapping, and Slack alerting'],
        project: 'Deploy an End-to-End Real-Time Fraud Detection Pipeline from Kafka to Iceberg orchestrated via Airflow.'
      }
    ],
    jobRoles: [
      { title: 'Data Engineer / Analytics Engineer', salary: '₹7.5L – ₹15.0L', demand: 'Very High' },
      { title: 'Senior Data Engineer / Lakehouse Architect', salary: '₹16.0L – ₹32.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'How do you identify and resolve data skew in an Apache Spark distributed join?',
        answer: 'Data skew occurs when one or more partition keys contain a disproportionately large volume of records, causing a single executor task to hang while all other tasks finish. I identify skew by checking task execution timelines in the Spark UI. To resolve it: (1) Use Broadcast Hash Join if the other table is small (<10MB–1GB), (2) Implement Salting by appending random integers to skewed keys to distribute them across multiple partitions, or (3) Enable Adaptive Query Execution (AQE) with spark.sql.adaptive.skewJoin.enabled = true.'
      }
    ],
    faqs: [
      { question: 'What is the Medallion Architecture in data engineering?', answer: 'The Medallion Architecture organizes data into three refinement layers: Bronze (raw immutable ingestion), Silver (cleaned, deduplicated, and enriched tables), and Gold (aggregated, business-level dimensional models ready for analytics and ML).' }
    ],
    relatedSkills: ['data-analytics', 'mlops-ml-platform', 'multimodal-ai-engineering', 'data-governance']
  },
  {
    slug: 'mlops-ml-platform',
    title: 'MLOps & Machine Learning Platform Engineering',
    category: 'emerging-tech',
    domainSlug: 'emerging-tech-ai',
    categoryLabel: 'Emerging Tech & AI',
    shortDesc: 'Automate model training pipelines, feature stores, Kubeflow, MLflow tracking, Triton inference, and canary rollouts.',
    longDesc: 'MLOps bridges data science models and production software engineering. Master automated ML training pipelines (Kubeflow, Vertex AI), model registry and versioning (MLflow), feature stores (Feast), low-latency GPU serving (Triton Inference Server, vLLM), data/concept drift monitoring (Evidently AI), and zero-downtime canary model deployments.',
    heroImage: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'End-to-End MLOps Pipeline & Continuous Training (CT) Loop',
      caption: 'Feature store, experiment tracking, automated model training DAG, Triton serving, and drift detection.',
      imageUrl: '/images/concepts/concept-ai-mlops.svg',
      keyPoints: [
        { label: 'Feature Store (Feast)', description: 'Unified point-in-time correct features for offline training and low-latency online inference.' },
        { label: 'Experiment Tracking (MLflow)', description: 'Tracking hyperparameters, metrics, artifacts, and registering candidate models.' },
        { label: 'Containerized Serving (Triton)', description: 'Concurrent model execution, dynamic batching, and TensorRT optimization.' },
        { label: 'Drift & Retraining Triggers', description: 'Monitoring Population Stability Index (PSI) and triggering automated retraining.' }
      ]
    },
    salaryRange: '₹12.0L – ₹35.0L LPA',
    minSalaryLPA: 12.0,
    maxSalaryLPA: 35.0,
    averageSalaryLPA: 21.0,
    timelineWeeks: '10 – 14 Weeks',
    hiringVolume: '16,000+ Openings across Tech GCCs & Product Labs',
    experienceLevel: 'Intermediate to Advanced',
    topCities: ['Bengaluru', 'Hyderabad', 'Pune', 'Gurugram', 'Chennai', 'Remote'],
    tools: ['MLflow', 'Kubeflow / Vertex AI', 'Docker & Kubernetes', 'Triton Inference Server', 'Feast Feature Store', 'Evidently AI'],
    keyHighlights: [
      'High-paying engineering track converting experimental Jupyter notebooks into hardened 99.99% uptime services',
      'Direct migration pathway for DevOps, Backend, and Data Engineers into AI Platform teams',
      'High international remote USD compensation potential'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Experiment Tracking, Packaging & Feature Stores',
        weeks: 'Weeks 1 - 4',
        topics: ['MLflow tracking: Logging metrics, parameters, code hashes, and model artifacts', 'Building online/offline Feature Stores with Feast to prevent training-serving skew', 'Data versioning with DVC (Data Version Control) linked to cloud object storage (S3/GCS)'],
        project: 'Build an end-to-end MLflow Tracking & Feast Feature Store system for a credit risk model.'
      },
      {
        phase: 'Phase 2: Automated Pipelines on Kubernetes & Model Serving',
        weeks: 'Weeks 5 - 8',
        topics: ['Containerizing ML pipelines with Docker and orchestrating training DAGs on Kubeflow / Airflow', 'High-performance model serving with Triton Inference Server and FastAPI (Dynamic batching, TensorRT)', 'Deploying shadow deployments, A/B model splits, and canary rollouts using Istio on Kubernetes'],
        project: 'Deploy a Triton Inference Server cluster on Kubernetes with dynamic batching and load balancing.'
      },
      {
        phase: 'Phase 3: Production Monitoring, Drift & Continuous Training (CT)',
        weeks: 'Weeks 9 - 14',
        topics: ['Data drift vs Concept drift: Calculating Wasserstein distance and Population Stability Index (PSI)', 'Real-time model monitoring using Evidently AI and Prometheus/Grafana alerts', 'Building Continuous Training (CT) pipelines triggering automated retraining on drift detection'],
        project: 'Create an Automated Continuous Training & Model Drift Alerting Pipeline in production.'
      }
    ],
    jobRoles: [
      { title: 'MLOps Engineer / ML Platform Engineer', salary: '₹12.0L – ₹22.0L', demand: 'Very High' },
      { title: 'Staff MLOps Architect / AI Infrastructure Lead', salary: '₹24.0L – ₹45.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'What is Training-Serving Skew and how do you prevent it in an MLOps architecture?',
        answer: 'Training-Serving Skew occurs when the feature values or data transformations used during model training differ from the values computed during real-time production inference. It is prevented by: (1) Using a centralized Feature Store (like Feast) that guarantees identical point-in-time feature transformation logic for both batch training and online lookup, (2) Packaging data preprocessing pipelines inside the serialized model artifact itself (e.g. Scikit-learn Pipeline or ONNX graph), and (3) Continuous data drift monitoring.'
      }
    ],
    faqs: [
      { question: 'What is the difference between Data Science and MLOps?', answer: 'Data Scientists focus on exploratory data analysis, feature engineering, and model accuracy metrics; MLOps engineers focus on infrastructure, automated CI/CD pipelines, containerization, low-latency deployment, model drift monitoring, and 99.99% system availability.' }
    ],
    relatedSkills: ['data-engineering', 'ai-agent-evaluation-observability', 'devsecops', 'cloud-platform-engineering']
  },
  {
    slug: 'backend-engineering-api',
    title: 'Backend Engineering & Distributed API Development',
    category: 'tech',
    domainSlug: 'emerging-tech-ai',
    categoryLabel: 'High-Demand Tech',
    shortDesc: 'Design high-throughput microservices, REST & gRPC APIs, Redis caching, PostgreSQL indexing, and message queues in Node.js/Go/Java.',
    longDesc: 'Backend Engineering powers all digital products and enterprise platforms. Master scalable microservices architecture, RESTful and gRPC API contracts, asynchronous message queues (RabbitMQ, Kafka), Redis caching strategies, PostgreSQL query optimization, connection pooling, and resilient rate limiting.',
    heroImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'High-Throughput Distributed Backend & API Architecture',
      caption: 'API Gateway, rate limiter, microservice cluster, Redis cache, message queue, and primary-replica database.',
      imageUrl: '/images/concepts/concept-ai-mlops.svg',
      keyPoints: [
        { label: 'API Gateway & Rate Limiting', description: 'Token bucket rate limiting, JWT validation, and reverse proxy routing.' },
        { label: 'Microservices & gRPC', description: 'Low-latency inter-service communication via Protocol Buffers over HTTP/2.' },
        { label: 'Distributed Caching (Redis)', description: 'Cache-aside patterns, TTL invalidation, and preventing cache stampedes.' },
        { label: 'Database Optimization', description: 'B-Tree/GIN indexing, transaction isolation levels, and read-replica routing.' }
      ]
    },
    salaryRange: '₹6.5L – ₹28.0L LPA',
    minSalaryLPA: 6.5,
    maxSalaryLPA: 28.0,
    averageSalaryLPA: 15.0,
    timelineWeeks: '10 – 14 Weeks',
    hiringVolume: '50,000+ Openings across India',
    experienceLevel: 'Intermediate',
    topCities: ['Bengaluru', 'Hyderabad', 'Pune', 'Gurugram', 'Chennai', 'Mumbai', 'Remote'],
    tools: ['Node.js / Express', 'Go (Golang)', 'Java Spring Boot', 'PostgreSQL', 'Redis', 'Docker', 'RabbitMQ / Kafka'],
    keyHighlights: [
      'The backbone of software engineering with constant high-volume hiring across startups and global product firms',
      'Direct pathway into System Architect, Principal Engineer, and VP of Engineering',
      'Enables you to build robust services capable of handling millions of concurrent user requests'
    ],
    syllabus: [
      {
        phase: 'Phase 1: API Architecture, Databases & Indexing',
        weeks: 'Weeks 1 - 4',
        topics: ['RESTful API design best practices, HTTP status codes, idempotency, and OpenAPI/Swagger specs', 'Relational database design in PostgreSQL: Normalization, Foreign keys, ACID transactions, and isolation levels', 'Deep dive into database indexing: B-Tree, GIN, Composite indexes, and reading EXPLAIN ANALYZE execution plans'],
        project: 'Build an E-Commerce API with complex PostgreSQL multi-table transactions and indexing optimization.'
      },
      {
        phase: 'Phase 2: Distributed Caching, Message Queues & gRPC',
        weeks: 'Weeks 5 - 8',
        topics: ['Redis caching patterns: Cache-Aside, Write-Through, Cache Penetration/Stampede prevention, and distributed locks (Redlock)', 'Asynchronous event processing using RabbitMQ and Kafka: Producers, consumers, dead-letter queues (DLQ)', 'Microservice inter-communication: Building high-speed gRPC services with Protocol Buffers'],
        project: 'Develop a Scalable Asynchronous Order Processing System with Redis caching and RabbitMQ queues.'
      },
      {
        phase: 'Phase 3: Security, Resilience & Scalability',
        weeks: 'Weeks 9 - 14',
        topics: ['Authentication & Authorization: OAuth 2.0, OpenID Connect, JWT signing, and RBAC middleware', 'API Rate Limiting (Token Bucket / Sliding Window algorithms) and DDoS mitigation', 'Circuit Breakers (Resilience4j), connection pooling (HikariCP/PgBouncer), and health check endpoints'],
        project: 'Deploy a Production-Ready Microservice Backend with rate limiting, circuit breakers, and Docker.'
      }
    ],
    jobRoles: [
      { title: 'Backend Developer / API Engineer', salary: '₹6.5L – ₹14.0L', demand: 'Very High' },
      { title: 'Senior Backend Engineer / Architect', salary: '₹15.0L – ₹32.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'How do you prevent the Cache Stampede (Thundering Herd) problem when a hot Redis cache key expires?',
        answer: 'To prevent thousands of concurrent requests from hitting the database simultaneously when a key expires: (1) Use Mutex Locking (distributed lock like Redlock so only one worker queries the DB and repopulates the cache while others wait), (2) Implement Probabilistic Early Expiration (XFetch algorithm recalculating the cache before it officially expires), or (3) Use Background Refresh with long TTLs where an asynchronous worker periodically refreshes the cache.'
      }
    ],
    faqs: [
      { question: 'Which programming language is best for backend engineering in 2026?', answer: 'Node.js (TypeScript) and Go (Golang) are predominant in high-growth startups and microservices; Java (Spring Boot) and C# (.NET) dominate enterprise banking and multinational GCCs.' }
    ],
    relatedSkills: ['database-engineering', 'software-architecture', 'api-security', 'java-spring-boot']
  },
  {
    slug: 'software-architecture',
    title: 'Software Architecture & System Design',
    category: 'tech',
    domainSlug: 'emerging-tech-ai',
    categoryLabel: 'High-Demand Tech',
    shortDesc: 'Master Low-Level Design (LLD - SOLID, Design Patterns) and High-Level Design (HLD - Sharding, CAP Theorem, Event-Driven).',
    longDesc: 'Software Architecture & System Design separates junior coders from high-earning engineering leaders. Master Low-Level Design (LLD - OOP principles, SOLID, GoF Design Patterns, UML), High-Level Design (HLD - CAP theorem, database sharding, consistent hashing, CQRS, Event Sourcing), and architecting systems at scale (designing Uber, Netflix, WhatsApp).',
    heroImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'Scalable System Design & Distributed Architecture Blueprint',
      caption: 'DNS routing, Global CDN, API Gateway, Sharded databases, Consistent Hashing, and Event Bus.',
      imageUrl: '/images/concepts/concept-ai-mlops.svg',
      keyPoints: [
        { label: 'SOLID & Clean Code (LLD)', description: 'Single Responsibility, Open-Closed, Liskov, Interface Segregation, Dependency Inversion.' },
        { label: 'Scalability & Sharding (HLD)', description: 'Consistent hashing, database horizontal sharding, and master-slave replication.' },
        { label: 'Event-Driven Patterns', description: 'CQRS (Command Query Responsibility Segregation), Sagas, and Event Sourcing.' },
        { label: 'High Availability & Resiliency', description: 'Active-Active multi-region deployments, circuit breakers, and fault-tolerant fallbacks.' }
      ]
    },
    salaryRange: '₹14.0L – ₹45.0L LPA',
    minSalaryLPA: 14.0,
    maxSalaryLPA: 45.0,
    averageSalaryLPA: 26.0,
    timelineWeeks: '8 – 12 Weeks',
    hiringVolume: '20,000+ Senior Engineering Openings',
    experienceLevel: 'Advanced',
    topCities: ['Bengaluru', 'Hyderabad', 'Pune', 'Gurugram', 'Mumbai', 'Chennai', 'Remote'],
    tools: ['PlantUML / Mermaid', 'Draw.io / Excalidraw', 'System Design Frameworks', 'Java / Go / TypeScript'],
    keyHighlights: [
      'The definitive evaluation bar for Senior Engineer, Staff Engineer, and Principal Architect interviews at FAANG/Product MNCs',
      'Commands the highest compensation packages in the global technology industry',
      'Equips you to architect resilient systems handling billions of requests daily'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Low-Level Design (LLD) & Object-Oriented Principles',
        weeks: 'Weeks 1 - 4',
        topics: ['SOLID design principles with real-world refactoring examples in clean code', 'GoF Design Patterns: Factory, Singleton, Strategy, Observer, Decorator, Adapter, and Builder', 'Designing LLD systems: Parking Lot, BookMyShow booking engine, Splitwise expense sharing, Elevator system'],
        project: 'Design and implement an object-oriented Low-Level Design for a Ride-Sharing Matching Engine.'
      },
      {
        phase: 'Phase 2: High-Level Design (HLD) Building Blocks',
        weeks: 'Weeks 5 - 8',
        topics: ['CAP Theorem, PACELC theorem, and Base vs ACID consistency models', 'Database partitioning: Horizontal vs Vertical Sharding, Consistent Hashing algorithms', 'Load balancing algorithms, distributed locking, and message delivery guarantees (At-least-once, Exactly-once)'],
        project: 'Architect a Distributed URL Shortener (TinyURL) handling 100M daily writes with consistent hashing.'
      },
      {
        phase: 'Phase 3: Large-Scale System Design Case Studies',
        weeks: 'Weeks 9 - 12',
        topics: ['Designing a Global Video Streaming Platform (Netflix / YouTube architecture: Transcoding, CDN, metadata)', 'Designing a Real-Time Messaging App (WhatsApp: WebSockets, XMPP, E2E encryption, message queue states)', 'Designing a Distributed Rate Limiter and Distributed Cache at billion-request scale'],
        project: 'Produce a comprehensive High-Level System Architecture Design Document for a real-time food delivery platform.'
      }
    ],
    jobRoles: [
      { title: 'Staff Software Engineer / Lead Architect', salary: '₹18.0L – ₹35.0L', demand: 'Very High' },
      { title: 'Principal System Architect / Director of Engineering', salary: '₹35.0L – ₹65.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'How does Consistent Hashing minimize data movement when scaling out a distributed cache cluster?',
        answer: 'In traditional modular hashing (hash(key) % N), adding or removing a server changes the divisor N, causing almost 100% of keys to rehash to different servers and destroying the cache. Consistent Hashing maps both keys and servers to positions on an abstract 360-degree hash ring. When a server is added or removed, only the keys residing between that server and its immediate neighbor need to be migrated (an average of K/N keys), minimizing data re-balancing overhead. Virtual nodes are added to prevent hot spots.'
      }
    ],
    faqs: [
      { question: 'How is a System Design interview structured at top tech product companies?', answer: 'Typically 45–60 minutes: (1) Scope requirements (functional/non-functional) & back-of-the-envelope estimation (5-10m), (2) High-level component diagram & API contracts (15m), (3) Database schema & deep dive into bottleneck components (15m), (4) Scalability, failure recovery, and edge-case tradeoffs (10m).' }
    ],
    relatedSkills: ['backend-engineering-api', 'database-engineering', 'devsecops', 'data-engineering']
  }
];
