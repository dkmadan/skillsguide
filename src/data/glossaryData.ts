export interface GlossaryTerm {
  term: string;
  slug: string;
  category: 'Tech' | 'Business' | 'Finance & Tax' | 'Marketing' | 'AI';
  shortDefinition: string;
  fullExplanation: string;
  exampleOrSnippet: string;
  relatedSkillSlug: string;
  relatedSkillName: string;
}

export const glossaryTerms: GlossaryTerm[] = [
  {
    term: 'DAX (Data Analysis Expressions)',
    slug: 'dax',
    category: 'Tech',
    shortDefinition: 'A formula expression language used in Microsoft Power BI, Analysis Services, and Power Pivot in Excel.',
    fullExplanation: 'DAX is a collection of functions, operators, and constants that can be used in a formula to calculate and return one or more values. Unlike standard Excel formulas that refer to cell ranges, DAX operates over entire tables and columns, dynamically adjusting calculations based on the active filter context.',
    exampleOrSnippet: `Total Sales India = 
CALCULATE(
    SUM(Sales[Revenue]),
    DimGeography[Country] = "India",
    Sales[Year] = 2026
)`,
    relatedSkillSlug: 'data-analytics',
    relatedSkillName: 'Data Analytics & Power BI'
  },
  {
    term: 'RAG (Retrieval-Augmented Generation)',
    slug: 'rag',
    category: 'AI',
    shortDefinition: 'An AI framework that dynamically retrieves private documents from a vector database to provide accurate, grounded context to Large Language Models.',
    fullExplanation: 'RAG prevents LLM hallucinations by retrieving factual chunks of text from internal knowledge bases (PDFs, SQL databases, customer tickets) and injecting them into the prompt before generating the final answer. It eliminates the high cost and latency of retraining or fine-tuning models.',
    exampleOrSnippet: `// Standard RAG Workflow:
1. User Query -> Embedding Model -> Vector DB similarity search
2. Top 3 matching document chunks retrieved
3. LLM Prompt: "Answer query based ONLY on Context: [Chunks] User: [Query]"`,
    relatedSkillSlug: 'ai-prompt-engineering',
    relatedSkillName: 'AI & Prompt Engineering'
  },
  {
    term: 'GSTR-3B',
    slug: 'gstr-3b',
    category: 'Finance & Tax',
    shortDefinition: 'A mandatory monthly self-declared summary return filed by registered Indian GST taxpayers declaring outward supplies, Input Tax Credit (ITC), and net tax payments.',
    fullExplanation: 'GSTR-3B is filed on or before the 20th of the subsequent month. It summarizes total sales, purchases eligible for ITC (matched against GSTR-2B), reverse charge liabilities, and facilitates cash ledger payments directly on the GST portal.',
    exampleOrSnippet: `Net GST Payable = Output GST on Sales (CGST+SGST/IGST) - Eligible Input Tax Credit (ITC from GSTR-2B)`,
    relatedSkillSlug: 'tally-gst',
    relatedSkillName: 'Tally Prime & GST Accounting'
  },
  {
    term: 'ROAS (Return on Ad Spend)',
    slug: 'roas',
    category: 'Marketing',
    shortDefinition: 'A marketing metric that measures the amount of revenue a company earns for each rupee or dollar spent on advertising.',
    fullExplanation: 'ROAS determines the profitability and scalability of paid advertising campaigns on Meta Ads Manager and Google Ads. A 4.0x ROAS means ₹400 in gross sales was generated for every ₹100 invested in ad spend.',
    exampleOrSnippet: `ROAS = Total Revenue Generated from Ads / Total Ad Spend
Break-Even ROAS = 1 / Gross Profit Margin %`,
    relatedSkillSlug: 'digital-marketing',
    relatedSkillName: 'Digital & Performance Marketing'
  },
  {
    term: 'STAR Framework',
    slug: 'star-framework',
    category: 'Business',
    shortDefinition: 'A structured behavioral interview storytelling technique: Situation, Task, Action, and Result.',
    fullExplanation: 'The STAR framework provides a clear, quantitative structure to answer behavioral questions like "Tell me about a time you handled a crisis". It ensures candidates dedicate 50% of their answer to specific personal actions and 20% to measurable business results.',
    exampleOrSnippet: `• Situation (15%): Set the business context & urgency
• Task (15%): Your specific responsibility
• Action (50%): The tools and exact steps you implemented
• Result (20%): Quantifiable outcome (+35% efficiency, ₹10L saved)`,
    relatedSkillSlug: 'communication-english',
    relatedSkillName: 'Business English & Fluency'
  },
  {
    term: 'GST LUT (Letter of Undertaking)',
    slug: 'gst-lut',
    category: 'Finance & Tax',
    shortDefinition: 'An annual online declaration filed by Indian service exporters to export services without payment of IGST (0% GST rate).',
    fullExplanation: 'For Indian IT freelancers and agencies receiving foreign exchange (USD/EUR/GBP) via Wise or bank wires, filing Form GST RFD-11 (LUT) on the GST portal allows exporting zero-rated services legally without paying tax upfront and applying for refunds.',
    exampleOrSnippet: `Form GST RFD-11: Valid for 1 Financial Year (e.g. April 1 to March 31). Requires 2 witnesses and zero government filing fee.`,
    relatedSkillSlug: 'freelancing-usd',
    relatedSkillName: 'Global Freelancing & USD Earning'
  },
  {
    term: 'SIEM (Security Information & Event Management)',
    slug: 'siem',
    category: 'Tech',
    shortDefinition: 'A security solution that aggregates, analyzes, and correlates log data across enterprise servers, firewalls, and applications in real time.',
    fullExplanation: 'SIEM platforms (such as Splunk, Microsoft Sentinel, and IBM QRadar) empower SOC analysts to identify unauthorized access attempts, malware infections, and compliance anomalies before they lead to data breaches.',
    exampleOrSnippet: `index=security sourcetype=cisco:asa action=blocked 
| stats count by src_ip 
| where count > 500 
| sort -count`,
    relatedSkillSlug: 'cybersecurity',
    relatedSkillName: 'Cybersecurity SOC Analyst'
  },
  {
    term: 'CKA (Certified Kubernetes Administrator)',
    slug: 'cka',
    category: 'Tech',
    shortDefinition: 'A prestigious, hands-on certification provided by the Cloud Native Computing Foundation (CNCF) and Linux Foundation validating Kubernetes operational skills.',
    fullExplanation: 'The CKA exam tests real-time troubleshooting, cluster architecture, storage, networking (CNI), and security inside live command-line environments. It is among the highest-ROI certifications for DevOps engineers in India.',
    exampleOrSnippet: `kubectl create deployment web-nginx --image=nginx:alpine --replicas=3
kubectl expose deployment web-nginx --port=80 --type=ClusterIP`,
    relatedSkillSlug: 'devops-sre',
    relatedSkillName: 'DevOps & SRE Engineering'
  },
  {
    term: 'ATS (Applicant Tracking System)',
    slug: 'ats',
    category: 'Business',
    shortDefinition: 'Human resources software used by companies to scan, parse, sort, and rank incoming job applications based on keyword matching and formatting rules.',
    fullExplanation: 'Over 85% of large Indian enterprises and MNCs use ATS software (Taleo, Workday, Greenhouse). Resumes with tables, textboxes, icons, or complex columns frequently fail parsing algorithms, leading to automatic rejection.',
    exampleOrSnippet: `ATS Golden Rule: Use single-column plain typography, standard headers (Work Experience, Skills, Education), and extract exact keywords from the target Job Description.`,
    relatedSkillSlug: 'resume-linkedin',
    relatedSkillName: 'ATS Resume & LinkedIn Mastery'
  },
  {
    term: 'BRS (Bank Reconciliation Statement)',
    slug: 'brs',
    category: 'Finance & Tax',
    shortDefinition: 'A schedule prepared by accountants to reconcile the difference between the bank balance in the company ledger and the actual bank passbook balance.',
    fullExplanation: 'Differences typically arise from cheques issued but not yet presented for payment, direct bank charges, interest credited, or auto-debits. Automated BRS in Tally Prime imports electronic bank statements (CSV/Excel) for instant reconciliation.',
    exampleOrSnippet: `Bank Balance as per Tally Books
+ Cheques issued but not presented
- Cheques deposited but not cleared
- Bank charges debited by bank
= Bank Balance as per Bank Statement`,
    relatedSkillSlug: 'tally-gst',
    relatedSkillName: 'Tally Prime & GST Accounting'
  },
  {
    term: 'ETL (Extract, Transform, Load)',
    slug: 'etl',
    category: 'Tech',
    shortDefinition: 'The three-step data integration process of extracting raw data from multiple sources, transforming it into a clean schema, and loading it into a data warehouse.',
    fullExplanation: 'ETL forms the backbone of business intelligence and analytics. Tools like Apache Airflow, PySpark, dbt, and Power Query handle automated data extraction, deduplication, type casting, and schema loading.',
    exampleOrSnippet: `// ETL Architecture:
Extract: MySQL OLTP DB + REST APIs + CSV S3 Dumps
Transform: PySpark cleans missing nulls, computes customer LTV
Load: Snowflake / BigQuery Analytical Tables`,
    relatedSkillSlug: 'data-engineering',
    relatedSkillName: 'Data Engineering'
  },
  {
    term: 'Vector Embeddings',
    slug: 'vector-embeddings',
    category: 'AI',
    shortDefinition: 'Numerical high-dimensional array representations of text or images that capture semantic meaning and contextual relationships.',
    fullExplanation: 'Vector embeddings map words, sentences, or documents into geometric space (e.g. 1536 dimensions in OpenAI text-embedding-3). Texts with similar meanings (e.g. "king" and "queen" or "refund" and "money back") sit close to each other, allowing lightning-fast cosine similarity search.',
    exampleOrSnippet: `embedding("How to cancel an order?") -> [0.0124, -0.0452, 0.0891, ..., 0.0031]
Cosine Distance between "Cancel order" and "Return package" = 0.89 (High Match)`,
    relatedSkillSlug: 'ai-prompt-engineering',
    relatedSkillName: 'AI & Prompt Engineering'
  },
  {
    slug: 'infrastructure-as-code-iac',
    term: 'IaC (Infrastructure as Code)',
    category: 'Tech',
    shortDefinition: 'The practice of managing and provisioning computing infrastructure through machine-readable definition files (such as Terraform or Ansible) rather than manual console clicks.',
    fullExplanation: 'IaC enables teams to version control, review, and reproduce complete multi-cloud server, database, and network architectures in seconds, eliminating configuration drift and human error.',
    exampleOrSnippet: `resource "aws_s3_bucket" "skillsguide_assets" {
  bucket = "skillsguide-prod-assets-2026"
  tags = {
    Environment = "Production"
  }
}`,
    relatedSkillSlug: 'devops-sre',
    relatedSkillName: 'DevOps & SRE Engineering'
  },
  {
    slug: 'star-schema',
    term: 'Star Schema Data Modeling',
    category: 'Tech',
    shortDefinition: 'A dimensional data modeling design where a central Fact table containing quantitative metrics is connected directly to surrounding Dimension tables containing descriptive attributes.',
    fullExplanation: 'Star schemas are the standard modeling format for Power BI and relational data warehouses because they minimize table joins, simplify DAX measure writing, and dramatically improve report query speed.',
    exampleOrSnippet: `Center: Fact_Sales (SalesAmount, Quantity, DateKey, ProductKey, CustomerKey)
Branches: Dim_Date, Dim_Product, Dim_Customer, Dim_Store`,
    relatedSkillSlug: 'data-analytics',
    relatedSkillName: 'Data Analytics & Power BI'
  },
  {
    slug: 'server-actions-nextjs',
    term: 'Server Actions (Next.js)',
    category: 'Tech',
    shortDefinition: 'Asynchronous functions in Next.js that execute securely on the server and can be invoked directly from Client Components or HTML forms without manually writing REST API endpoints.',
    fullExplanation: 'Server Actions simplify data mutations, form submissions, and database queries. They automatically handle POST requests, provide progressive enhancement, and integrate seamlessly with Next.js revalidation and caching.',
    exampleOrSnippet: `'use server';

export async function submitQuizScore(formData: FormData) {
  const email = formData.get('email');
  await db.leads.create({ data: { email } });
  revalidatePath('/dashboard');
}`,
    relatedSkillSlug: 'full-stack-web',
    relatedSkillName: 'Full-Stack Web Development'
  }
];

import { extraGlossaryTerms } from './moreGlossary';

export const allGlossaryTerms: GlossaryTerm[] = [...glossaryTerms, ...extraGlossaryTerms];

export const getGlossaryTermBySlug = (slug: string): GlossaryTerm | undefined => {
  return allGlossaryTerms.find(t => t.slug === slug);
};

