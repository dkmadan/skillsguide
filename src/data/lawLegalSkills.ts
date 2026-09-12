import type { SkillDetail } from './skillsData';

export const lawLegalSkills: SkillDetail[] = [
  {
    slug: 'intellectual-property-law',
    title: 'Intellectual Property Law (IPR)',
    category: 'law',
    domainSlug: 'law-legal-operations',
    categoryLabel: 'Law & Legal Studies',
    shortDesc: 'Master patent prosecution, trademark filing, copyright protection, trade secrets, and IP litigation under Indian & global treaties.',
    longDesc: 'Intellectual Property (IP) Law protects innovations and brand equity. Master Indian Patent Office & USPTO patent drafting, trademark opposition proceedings, software/AI copyright boundaries, trade secret safeguards, licensing agreements, and PCT international filing routes.',
    heroImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'Intellectual Property Lifecycle & Prosecution Pipeline',
      caption: 'Prior art search, provisional/complete specification drafting, examination response, and commercial licensing.',
      imageUrl: '/images/concepts/concept-law-compliance.svg',
      keyPoints: [
        { label: 'Prior Art Search', description: 'Querying Google Patents, Espacenet, and Indian Patent Office databases for novelty.' },
        { label: 'Patent Drafting', description: 'Authoring Claims, Background, Detailed Description, and Patent Drawings.' },
        { label: 'Prosecution & First Examination Report', description: 'Responding to FER objections on Section 3(k) non-patentability and inventive step.' },
        { label: 'Commercial Licensing', description: 'Drafting IP assignment, technology transfer, and royalty agreements.' }
      ]
    },
    salaryRange: '₹6.0L – ₹22.0L LPA',
    minSalaryLPA: 6.0,
    maxSalaryLPA: 22.0,
    averageSalaryLPA: 12.5,
    timelineWeeks: '8 – 12 Weeks',
    hiringVolume: '10,000+ Openings in Tier-1 Law Firms & Tech MNCs',
    experienceLevel: 'Intermediate',
    topCities: ['Delhi NCR', 'Bengaluru', 'Mumbai', 'Hyderabad', 'Pune', 'Chennai'],
    tools: ['Google Patents', 'Espacenet', 'IP India e-Filing Portal', 'USPTO Patent Center', 'Anaqua IP Management'],
    keyHighlights: [
      'Highest-paying legal specialization across top law firms (Shardul Amarchand, Cyril Amarchand, Anand & Anand, Khaitan)',
      'Massive demand across tech giants (Google, Microsoft, Samsung, Qualcomm) and pharma R&D hubs',
      'Direct pathway for Science & Engineering graduates to become Registered Indian Patent Agents'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Patent Searching, Drafting & Indian Patent Act 1970',
        weeks: 'Weeks 1 - 4',
        topics: ['Patentability criteria: Novelty, Inventive step (Non-obviousness), and Industrial applicability', 'Section 3 non-patentable subject matter (Section 3d pharma, Section 3k computer software per se)', 'Drafting Provisional and Complete Specifications with independent and dependent claims'],
        project: 'Perform a full Prior Art Patent Search and draft a Complete Patent Specification with 10 claims.'
      },
      {
        phase: 'Phase 2: Trademarks, Copyrights & Design Protection',
        weeks: 'Weeks 5 - 8',
        topics: ['Trademarks Act 1999: Nice Classification (Classes 1-45), trademark search, examination, and opposition notices', 'Copyright Act 1957: Software source code, literary works, and AI-generated content ownership issues', 'Designs Act 2000: Industrial design registration and defending against design piracy'],
        project: 'Draft a Trademark Opposition Notice and a Technology Licensing & Royalty Agreement.'
      },
      {
        phase: 'Phase 3: International IP Treaties, Litigation & Patent Agent Exam',
        weeks: 'Weeks 9 - 12',
        topics: ['Patent Cooperation Treaty (PCT) filing mechanisms, Madrid Protocol for trademarks, and Paris Convention', 'IP Litigation: Interim injunctions, Anton Piller orders, damages calculation, and Section 64 revocation petitions', 'Preparation for the Indian Patent Agent Examination (Paper 1 Viva, Paper 2 Drafting)'],
        project: 'Prepare a response to a First Examination Report (FER) overcoming Section 3(k) objections.'
      }
    ],
    jobRoles: [
      { title: 'Patent Associate / IP Attorney', salary: '₹6.0L – ₹12.0L', demand: 'Very High' },
      { title: 'Senior IP Counsel / Registered Patent Agent', salary: '₹12.0L – ₹24.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'How do you overcome a Section 3(k) patent objection for a software-related invention in India?',
        answer: 'Under the Indian Patent Act (Section 3k), computer programs per se are not patentable. To overcome this, I demonstrate that the software produces a technical effect, solves a technical problem, and operates in combination with novel hardware architectures or creates an external real-world technical improvement rather than functioning merely as abstract mathematical algorithms.'
      }
    ],
    faqs: [
      { question: 'Do I need a law degree to become a Patent Agent in India?', answer: 'No! Any graduate with a degree in Science, Engineering, or Technology (B.Tech, B.Sc, M.Sc, B.Pharm) is eligible to write the Indian Patent Agent Examination conducted by CGPDTM.' }
    ],
    relatedSkills: ['corporate-law', 'contract-drafting', 'legal-research', 'legal-writing']
  },
  {
    slug: 'corporate-law',
    title: 'Corporate Law & M&A Transactions',
    category: 'law',
    domainSlug: 'law-legal-operations',
    categoryLabel: 'Law & Legal Studies',
    shortDesc: 'Structure Mergers & Acquisitions (M&A), private equity due diligence, shareholder agreements (SHA), and Companies Act 2013 compliance.',
    longDesc: 'Corporate Law powers high-stakes business transactions. Master Companies Act 2013 governance, Mergers & Acquisitions (M&A) deal structuring, Private Equity (PE) and Venture Capital (VC) funding rounds, Share Purchase Agreements (SPA), legal due diligence, and SEBI regulations.',
    heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'M&A Deal Structuring & Corporate Governance Cycle',
      caption: 'Term sheet negotiation, legal due diligence audit, definitive agreement drafting, and regulatory approvals.',
      imageUrl: '/images/concepts/concept-law-compliance.svg',
      keyPoints: [
        { label: 'Term Sheet & Valuation', description: 'Negotiating condition precedents, exclusivity, and key governance clauses.' },
        { label: 'Legal Due Diligence', description: 'Reviewing corporate records, material contracts, employment, and IP liabilities.' },
        { label: 'Definitive Agreements (SHA/SPA)', description: 'Drafting Tag-Along, Drag-Along, Liquidation Preference, and ROFR clauses.' },
        { label: 'Closing & Regulatory Filings', description: 'Board resolutions, MCA ROC filings, RBI FEMA compliance, and CCI merger clearance.' }
      ]
    },
    salaryRange: '₹7.0L – ₹28.0L LPA',
    minSalaryLPA: 7.0,
    maxSalaryLPA: 28.0,
    averageSalaryLPA: 15.5,
    timelineWeeks: '8 – 12 Weeks',
    hiringVolume: '12,000+ Corporate Law Openings',
    experienceLevel: 'Intermediate',
    topCities: ['Mumbai', 'Delhi NCR', 'Bengaluru', 'Hyderabad', 'Pune', 'Chennai'],
    tools: ['MCA21 Portal', 'SCC Online', 'Manupatra', 'Intralinks Virtual Data Room (VDR)', 'DocuSign'],
    keyHighlights: [
      'Premier tier in Indian legal practice with top compensation packages at leading national law firms',
      'High growth in in-house legal counsel roles across unicorns, conglomerates, and multinational GCCs',
      'Directly shapes multi-million dollar venture capital fundraises and corporate consolidations'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Companies Act 2013 Governance & Board Operations',
        weeks: 'Weeks 1 - 4',
        topics: ['Incorporation, Articles of Association (AoA), and Memorandum of Association (MoA) structuring', 'Board Meetings, General Meetings, Voting Rights, and Director Duties/Liabilities under Companies Act 2013', 'Related Party Transactions (Section 188), Inter-corporate Loans, and Statutory Corporate Governance'],
        project: 'Draft a comprehensive Articles of Association (AoA) and Board Resolution for a high-growth startup.'
      },
      {
        phase: 'Phase 2: M&A Transactions & Legal Due Diligence',
        weeks: 'Weeks 5 - 8',
        topics: ['M&A deal lifecycle: Non-Disclosure Agreements (NDA), Non-Binding Term Sheets, and Letter of Intent (LOI)', 'Conducting full-scope Legal Due Diligence across corporate books, IP ownership, material contracts, and litigations', 'Drafting and negotiating Share Purchase Agreements (SPA) and Business Transfer Agreements (BTA - Slump Sale)'],
        project: 'Perform a comprehensive Legal Due Diligence Audit on a target company and author a Red-Flag Report.'
      },
      {
        phase: 'Phase 3: PE/VC Financing, Shareholder Agreements & SEBI',
        weeks: 'Weeks 9 - 12',
        topics: ['Structuring Series A/B investments: Share Subscription and Shareholders Agreements (SSHA)', 'Key SSHA clauses: Pre-emptive rights, ROFR, ROFO, Tag-Along, Drag-Along, Anti-dilution, and Exit options', 'FEMA FDI compliance, RBI filings (FC-GPR), and Competition Commission of India (CCI) merger control thresholds'],
        project: 'Draft and negotiate a complete Shareholders Agreement (SHA) with custom liquidation preference cascades.'
      }
    ],
    jobRoles: [
      { title: 'Corporate Law Associate (M&A / PE-VC)', salary: '₹7.0L – ₹14.0L', demand: 'Very High' },
      { title: 'Senior Corporate Associate / In-House Legal Counsel', salary: '₹14.0L – ₹30.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'What is the distinction between a Right of First Refusal (ROFR) and a Right of First Offer (ROFO) in a Shareholders Agreement?',
        answer: 'In a ROFR, a selling shareholder must first obtain a bona fide third-party offer and give existing investors the option to match that exact price and terms before selling to the outsider. In a ROFO, the selling shareholder must first offer the shares to existing investors at an asking price; if existing investors decline, the seller may sell to third parties, but only at a price equal to or higher than the offered price.'
      }
    ],
    faqs: [
      { question: 'What qualification is required to practice corporate law in India?', answer: 'An LL.B degree (3-year or 5-year integrated BA/BBA LL.B) from a Bar Council of India (BCI) recognized law school.' }
    ],
    relatedSkills: ['contract-law', 'contract-drafting', 'legal-compliance', 'company-secretary-skills']
  },
  {
    slug: 'contract-law',
    title: 'Contract Law & Commercial Agreements',
    category: 'law',
    domainSlug: 'law-legal-operations',
    categoryLabel: 'Law & Legal Studies',
    shortDesc: 'Master Indian Contract Act 1872 principles, offer-acceptance, consideration, breach remedies, and commercial dispute clauses.',
    longDesc: 'Contract Law is the cornerstone of every commercial transaction. Master Indian Contract Act 1872 doctrines, capacity, free consent (coercion, undue influence), void vs voidable agreements, liquidated damages vs penalty, frustration of contract (Force Majeure), and specific performance remedies.',
    heroImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'Commercial Contract Enforceability & Lifecycle Framework',
      caption: 'Offer, acceptance, lawful consideration, execution, performance, breach, and judicial remedies.',
      imageUrl: '/images/concepts/concept-law-compliance.svg',
      keyPoints: [
        { label: 'Essential Validity Elements', description: 'Offer, unequivocal acceptance, free consent, lawful object, and consideration.' },
        { label: 'Risk Allocation Clauses', description: 'Indemnification, representations & warranties, and limitation of liability caps.' },
        { label: 'Breach & Damages (Sec 73/74)', description: 'Ascertaining direct damages, consequential damages, and pre-estimated liquidated damages.' },
        { label: 'Dispute Resolution & Jurisdiction', description: 'Arbitration clauses, governing law, and exclusive territorial court jurisdiction.' }
      ]
    },
    salaryRange: '₹5.0L – ₹16.0L LPA',
    minSalaryLPA: 5.0,
    maxSalaryLPA: 16.0,
    averageSalaryLPA: 9.5,
    timelineWeeks: '6 – 10 Weeks',
    hiringVolume: '18,000+ Openings in Law Firms & Corporate In-House Teams',
    experienceLevel: 'Fresher Friendly',
    topCities: ['Delhi NCR', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Pune', 'Kolkata', 'Chennai'],
    tools: ['SCC Online', 'Manupatra', 'Westlaw', 'SpotDraft', 'Ironclad CLM'],
    keyHighlights: [
      'Universal foundational legal skill applicable to all legal sectors and commercial industries',
      'High demand for contract review specialists across Indian IT services and MNC capability centers',
      'Direct stepping stone into Contract Drafting, M&A, and In-House Commercial Counsel roles'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Indian Contract Act 1872 Foundations',
        weeks: 'Weeks 1 - 3',
        topics: ['Formation of contracts: Offer, acceptance, communication rules, and intention to create legal relations', 'Lawful consideration (Section 2d) and exceptions to "no consideration, no contract"', 'Free consent: Coercion (Sec 15), Undue Influence (Sec 16), Fraud (Sec 17), and Misrepresentation (Sec 18)'],
        project: 'Audit 5 complex commercial dispute case studies for validity of consent and enforceability.'
      },
      {
        phase: 'Phase 2: Discharge, Breach & Statutory Remedies',
        weeks: 'Weeks 4 - 7',
        topics: ['Discharge by performance, novation, alteration, and doctrine of frustration (Section 56 / Force Majeure)', 'Breach of contract: Anticipatory breach vs actual breach', 'Section 73 (Unliquidated damages - Hadley v Baxendale rule) vs Section 74 (Liquidated damages and penalties)'],
        project: 'Draft a formal Legal Notice for Anticipatory Breach of Contract claiming liquidated damages and specific performance.'
      }
    ],
    jobRoles: [
      { title: 'Commercial Contracts Associate', salary: '₹5.0L – ₹9.5L', demand: 'Very High' },
      { title: 'Senior Legal Contracts Counsel', salary: '₹10.0L – ₹18.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'What is the key difference between Liquidated Damages and Penalty under Section 74 of the Indian Contract Act?',
        answer: 'Under Indian law (Section 74), courts do not enforce penal clauses designed purely to terrify a party into performance. Liquidated damages must represent a genuine pre-estimate of loss. The court awards reasonable compensation not exceeding the specified amount, requiring the claimant to prove actual injury unless the loss is impossible to quantify.'
      }
    ],
    faqs: [
      { question: 'Is an e-contract signed digitally legally enforceable in India?', answer: 'Yes! Under the Information Technology Act 2000 (Section 10A), electronic contracts formed via electronic records and validated via digital signatures or Aadhaar e-Sign are fully legally valid and enforceable in Indian courts.' }
    ],
    relatedSkills: ['contract-drafting', 'corporate-law', 'legal-research', 'legal-drafting']
  },
  {
    slug: 'contract-drafting',
    title: 'Contract Drafting & Negotiation',
    category: 'law',
    domainSlug: 'law-legal-operations',
    categoryLabel: 'Law & Legal Studies',
    shortDesc: 'Draft bulletproof MSAs, NDAs, SaaS SLAs, Employment contracts, Indemnity clauses, and negotiate redlines.',
    longDesc: 'Contract Drafting translates commercial agreements into clear, legally enforceable documents. Master Master Services Agreements (MSA), Statements of Work (SOW), Non-Disclosure Agreements (NDA), SaaS terms, redline negotiations, limitation of liability caps, and boilerplate clauses.',
    heroImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'Commercial Contract Anatomy & Negotiation Flowchart',
      caption: 'Preamble, Operative clauses, Risk allocation, Termination, Boilerplates, and Redline review.',
      imageUrl: '/images/concepts/concept-law-compliance.svg',
      keyPoints: [
        { label: 'Operative Clauses', description: 'Scope of services, deliverables, milestone payments, and acceptance criteria.' },
        { label: 'Risk Allocation', description: 'Indemnity covenants, representations & warranties, and aggregate liability caps.' },
        { label: 'Termination & Post-Termination', description: 'Termination for convenience vs cause, data retrieval, and IP survival.' },
        { label: 'Boilerplates & Redlining', description: 'Severability, assignment, force majeure, notice clauses, and Word track-changes redlines.' }
      ]
    },
    salaryRange: '₹5.5L – ₹18.0L LPA',
    minSalaryLPA: 5.5,
    maxSalaryLPA: 18.0,
    averageSalaryLPA: 10.5,
    timelineWeeks: '6 – 10 Weeks',
    hiringVolume: '20,000+ Openings across IT, SaaS & In-House Legal',
    experienceLevel: 'Fresher Friendly',
    topCities: ['Bengaluru', 'Delhi NCR', 'Mumbai', 'Hyderabad', 'Pune', 'Chennai', 'Remote'],
    tools: ['Microsoft Word Track Changes', 'SpotDraft CLM', 'Ironclad', 'DocuSign', 'ContractPodAi'],
    keyHighlights: [
      'High-volume hiring track across Indian IT services (Infosys, TCS, Wipro) and SaaS giants',
      'High remote freelancing and cross-border US/UK contract review potential ($30–$80/hr)',
      'Transforms complex business intent into crystal-clear, litigation-proof legal language'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Contract Structure, Anatomy & Precision Writing',
        weeks: 'Weeks 1 - 3',
        topics: ['Contract anatomy: Title, Preamble, Recitals, Definitions, Operative Covenants, and Schedules', 'Plain English legal drafting: Eliminating archaic legalese, ambiguity, and passive voice', 'Drafting core commercial clauses: Scope, SOW deliverables, milestone payments, and SLAs'],
        project: 'Draft a comprehensive Master Services Agreement (MSA) and Statement of Work (SOW) for a tech vendor.'
      },
      {
        phase: 'Phase 2: Risk Allocation, IP & Liability Negotiation',
        weeks: 'Weeks 4 - 7',
        topics: ['Drafting mutual and unilateral Non-Disclosure Agreements (NDAs) with trade secret safeguards', 'Indemnity clauses: IP infringement indemnification, gross negligence, and carve-outs', 'Limitation of Liability (LoL) caps: Super-caps, aggregate 12-month fees, and exclusion of consequential damages'],
        project: 'Execute a Redline Negotiation Simulation on a SaaS Vendor Agreement with aggressive liability terms.'
      },
      {
        phase: 'Phase 3: Specialized Tech, Employment & Cross-Border Contracts',
        weeks: 'Weeks 8 - 10',
        topics: ['Drafting SaaS Subscription Agreements, End User License Agreements (EULA), and Data Processing Agreements (DPA)', 'Employment contracts: Non-compete, Non-solicit, IP Assignment, and Confidentiality clauses', 'Cross-border governing law, jurisdictional clauses, and international arbitration provisions'],
        project: 'Author a complete Enterprise SaaS Cloud Agreement with an integrated Data Processing Addendum.'
      }
    ],
    jobRoles: [
      { title: 'Contract Specialist / Legal Associate', salary: '₹5.5L – ₹10.0L', demand: 'Very High' },
      { title: 'Senior Contracts Manager / Commercial Counsel', salary: '₹11.0L – ₹22.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'How do you balance an Indemnity clause and a Limitation of Liability (LoL) clause during vendor contract negotiation?',
        answer: 'I typically propose an aggregate liability cap (e.g. 1x or 2x annual contract fees) for ordinary breaches while maintaining standard uncapped or super-capped carve-outs for third-party IP infringement indemnification, confidentiality breaches, willful misconduct, and gross negligence.'
      }
    ],
    faqs: [
      { question: 'Are non-compete clauses enforceable against employees in India?', answer: 'Under Section 27 of the Indian Contract Act 1872, agreements in restraint of trade are void. Post-employment non-compete restrictions are generally held void and unenforceable by Indian courts, although confidentiality and non-solicitation covenants remain enforceable.' }
    ],
    relatedSkills: ['contract-law', 'corporate-law', 'legal-drafting', 'legal-operations']
  },
  {
    slug: 'legal-research',
    title: 'Legal Research & Case Precedent Analysis',
    category: 'law',
    domainSlug: 'law-legal-operations',
    categoryLabel: 'Law & Legal Studies',
    shortDesc: 'Master SCC Online, Manupatra, Westlaw, Indian Kanoon, statutory construction, and case brief preparation.',
    longDesc: 'Legal Research is the bedrock of victorious courtroom litigation and strategic advisory. Master case law databases (SCC Online, Manupatra), Boolean search queries, Shepardizing/overruled precedent tracking, legislative intent research, and preparing analytical legal case briefs.',
    heroImage: 'https://images.unsplash.com/photo-1453733190371-0a9bedd828e1?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'Judicial Precedent & Statutory Research Pipeline',
      caption: 'Fact discovery, Boolean search, ratio decidendi extraction, precedent verification, and case brief synthesis.',
      imageUrl: '/images/concepts/concept-law-compliance.svg',
      keyPoints: [
        { label: 'Issue Identification', description: 'Distilling core factual and constitutional/statutory legal questions.' },
        { label: 'Boolean Query Construction', description: 'Using AND, OR, NOT, NEAR connectors across high court and Supreme Court databases.' },
        { label: 'Ratio Decidendi Analysis', description: 'Separating binding judicial principles (Ratio) from passing observations (Obiter Dicta).' },
        { label: 'Legal Proposition Brief', description: 'Synthesizing conflicting high court rulings into an authoritative legal opinion.' }
      ]
    },
    salaryRange: '₹4.0L – ₹12.0L LPA',
    minSalaryLPA: 4.0,
    maxSalaryLPA: 12.0,
    averageSalaryLPA: 7.2,
    timelineWeeks: '4 – 6 Weeks',
    hiringVolume: '15,000+ Law Clerk & Associate Openings',
    experienceLevel: 'Fresher Friendly',
    topCities: ['Delhi NCR', 'Mumbai', 'Bengaluru', 'Kolkata', 'Hyderabad', 'Chennai', 'Prayagraj'],
    tools: ['SCC Online Web Edition', 'Manupatra', 'Indian Kanoon', 'LiveLaw / Bar & Bench', 'LexisNexis Advance'],
    keyHighlights: [
      'Fundamental skill evaluated during law firm associate hiring, judicial clerkships, and senior advocate chambers',
      'Enables rapid discovery of winning Supreme Court and High Court precedents',
      'Essential for judicial competitive exams and high-stakes appellate litigation'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Database Navigation, Boolean Queries & Statutory Interpretation',
        weeks: 'Weeks 1 - 3',
        topics: ['Mastering SCC Online and Manupatra: Boolean operators, topic search, Judgments by Judge, and citations', 'Principles of Statutory Interpretation: Literal rule, Golden rule, Mischief rule, and Purposive construction', 'Tracking legislative amendments, statement of objects and reasons, and parliamentary standing committee reports'],
        project: 'Execute a multi-jurisdictional case law research assignment and compile an Annotated Case Table.'
      },
      {
        phase: 'Phase 2: Ratio Decidendi Extraction & Legal Opinion Writing',
        weeks: 'Weeks 4 - 6',
        topics: ['Distinguishing binding Ratio Decidendi from non-binding Obiter Dicta and per incuriam judgments', 'Checking precedent status: Overruled, distinguished, affirmed, and referred judgments', 'Structuring a formal Legal Research Memorandum (Facts, Issues, Statutory Law, Precedents, Conclusion)'],
        project: 'Draft a 10-page Formal Legal Opinion Memorandum on an unsettled corporate or constitutional law issue.'
      }
    ],
    jobRoles: [
      { title: 'Legal Researcher / Judicial Clerk', salary: '₹4.0L – ₹7.5L', demand: 'Very High' },
      { title: 'Litigation Research Associate / Legal Editor', salary: '₹6.0L – ₹12.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'What does it mean when a judgment is rendered "per incuriam" and what is its precedential value?',
        answer: '"Per incuriam" translates to "through lack of care." A judgment is per incuriam when delivered in ignorance or oversight of a binding statutory provision or a binding decision of a superior or coordinate bench. Such judgments do not carry binding precedential force and need not be followed by subsequent courts.'
      }
    ],
    faqs: [
      { question: 'What is the most widely cited law report in the Supreme Court of India?', answer: 'Supreme Court Cases (SCC) published by Eastern Book Company (EBC) is the standard citation format preferred by the Supreme Court of India.' }
    ],
    relatedSkills: ['legal-writing', 'legal-drafting', 'litigation-skills', 'contract-law']
  },
  {
    slug: 'legal-writing',
    title: 'Legal Writing & Opinion Drafting',
    category: 'law',
    domainSlug: 'law-legal-operations',
    categoryLabel: 'Law & Legal Studies',
    shortDesc: 'Master the IRAC method, client legal opinions, advisory memos, case briefs, and persuasive legal analysis.',
    longDesc: 'Legal Writing is the craft of clear, rigorous, and persuasive legal argumentation. Master the IRAC/CRAC method (Issue, Rule, Application/Analysis, Conclusion), authoring formal client legal opinions, inter-office strategy memos, case notes, and regulatory advisories.',
    heroImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'IRAC Legal Analysis & Opinion Writing Method',
      caption: 'Issue framing, Statutory/Precedent Rule, Fact-Law Application, and Definite Conclusion.',
      imageUrl: '/images/concepts/concept-law-compliance.svg',
      keyPoints: [
        { label: 'Issue (I)', description: 'Framing precise legal questions of law and fact.' },
        { label: 'Rule (R)', description: 'Stating governing statutory sections and established judicial precedents.' },
        { label: 'Application (A)', description: 'Applying legal rules to client facts with analogical reasoning and counter-argument rebuttal.' },
        { label: 'Conclusion (C)', description: 'Delivering actionable, probabilistic legal advice.' }
      ]
    },
    salaryRange: '₹4.5L – ₹14.0L LPA',
    minSalaryLPA: 4.5,
    maxSalaryLPA: 14.0,
    averageSalaryLPA: 8.5,
    timelineWeeks: '4 – 6 Weeks',
    hiringVolume: '16,000+ Openings in Law Firms & Consultancies',
    experienceLevel: 'Fresher Friendly',
    topCities: ['Delhi NCR', 'Mumbai', 'Bengaluru', 'Kolkata', 'Hyderabad', 'Pune'],
    tools: ['Microsoft Word Styles', 'Grammarly Pro', 'Bluebook / OSCOLA Citation Guides', 'SCC Online'],
    keyHighlights: [
      'Core skill differentiating top-tier law firm associates from peers',
      'Transforms complex statutory ambiguities into clear, actionable advice for corporate C-suite executives',
      'Essential for publication in reputed law reviews and leading legal portals'
    ],
    syllabus: [
      {
        phase: 'Phase 1: IRAC Methodology & Legal Style',
        weeks: 'Weeks 1 - 2',
        topics: ['The IRAC/CREAC method for structured legal reasoning', 'Eliminating passive voice, redundant nominalizations, and legalese in legal prose', 'Standard citation mechanics (Bluebook 21st Edition and Indian standard citation formats)'],
        project: 'Draft an IRAC Legal Memo analyzing an employment termination dispute.'
      },
      {
        phase: 'Phase 2: Formal Client Legal Opinions & Advisory Notes',
        weeks: 'Weeks 3 - 5',
        topics: ['Structuring formal Client Advisory Opinions: Executive Summary, Factual Matrix, Legal Analysis, and Recommendations', 'Balancing legal risk assessment: Providing clear commercial probabilities rather than hedging', 'Drafting regulatory advisories for RBI, SEBI, and GST compliance circulars'],
        project: 'Write a comprehensive 8-page Client Legal Opinion on the regulatory impact of DPDP Act 2023 on fintech onboarding.'
      }
    ],
    jobRoles: [
      { title: 'Legal Analyst / Advisory Associate', salary: '₹4.5L – ₹8.5L', demand: 'Very High' },
      { title: 'Senior Legal Advisory Counsel', salary: '₹9.0L – ₹16.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'How do you structure the "Application/Analysis" section of an IRAC legal memorandum?',
        answer: 'The Application section connects the legal rule directly to the specific facts. I compare the client\'s facts with the factual circumstances of landmark precedents (analogizing where facts align and distinguishing where they differ), address potential opposing arguments proactively, and explain why the rule leads logically to our proposed outcome.'
      }
    ],
    faqs: [
      { question: 'What is the Bluebook citation system?', answer: 'The Bluebook is the globally recognized uniform system of legal citation used by law journals, courts, and practitioners to cite statutes, case reporters, books, and articles consistently.' }
    ],
    relatedSkills: ['legal-research', 'legal-drafting', 'contract-drafting', 'corporate-law']
  },
  {
    slug: 'legal-drafting',
    title: 'Legal Drafting & Pleadings',
    category: 'law',
    domainSlug: 'law-legal-operations',
    categoryLabel: 'Law & Legal Studies',
    shortDesc: 'Draft civil plaints, written statements, writ petitions (Article 32/226), bail applications, and SLPs under CPC and CrPC/BNSS.',
    longDesc: 'Legal Drafting translates litigation strategy into binding court pleadings. Master Code of Civil Procedure (CPC) plaints, written statements, affidavits, interlocutory applications (Order 39 injunctions), Criminal Procedure (CrPC/BNSS) bail applications, Section 138 NI Act notices, and High Court / Supreme Court Writ Petitions and Special Leave Petitions (SLP).',
    heroImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'Civil & Criminal Court Pleadings Lifecycle',
      caption: 'Cause of action framing, Plaint/Complaint drafting, Interlocutory relief, and Appellate SLP filings.',
      imageUrl: '/images/concepts/concept-law-compliance.svg',
      keyPoints: [
        { label: 'Cause of Action Matrix', description: 'Drafting chronological material facts without pleading evidence (Order 6 Rule 2 CPC).' },
        { label: 'Interlocutory Applications', description: 'Seeking urgent ex-parte interim injunctions under Order 39 Rules 1 & 2 CPC.' },
        { label: 'Writ Jurisdiction (Art 226/32)', description: 'Drafting Mandamus, Certiorari, and Quo Warranto petitions for fundamental rights violations.' },
        { label: 'Appellate & Special Leave (SLP)', description: 'Drafting Questions of Law and Grounds for Supreme Court SLPs (Article 136).' }
      ]
    },
    salaryRange: '₹4.5L – ₹18.0L LPA',
    minSalaryLPA: 4.5,
    maxSalaryLPA: 18.0,
    averageSalaryLPA: 9.2,
    timelineWeeks: '8 – 12 Weeks',
    hiringVolume: '18,000+ Litigation & Chamber Openings',
    experienceLevel: 'Intermediate',
    topCities: ['Delhi NCR', 'Mumbai', 'Kolkata', 'Chennai', 'Bengaluru', 'Prayagraj', 'Hyderabad'],
    tools: ['Court E-Filing Portals (eCourts)', 'Supreme Court E-Filing', 'High Court E-Filing', 'Legal Formatting Templates'],
    keyHighlights: [
      'Core skill of successful courtroom litigators, trial advocates, and High Court / Supreme Court practitioners',
      'Direct responsibility for securing urgent ad-interim stays, bails, and constitutional remedies',
      'Essential for clearing state Advocate-on-Record (AoR) and judicial service examinations'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Civil Pleadings (CPC) & Injunctions',
        weeks: 'Weeks 1 - 4',
        topics: ['Fundamental rules of pleading (Order 6 CPC): Plead facts not evidence, brevity, and verification', 'Drafting Plaints (Order 7) and Written Statements (Order 8) with specific denials and counterclaims', 'Drafting Interlocutory Applications: Temporary Injunctions (Order 39), appointment of receiver, and rejection of plaint (Order 7 Rule 11)'],
        project: 'Draft a complete Civil Suit Plaint claiming damages for breach of contract with an Order 39 interim stay application.'
      },
      {
        phase: 'Phase 2: Criminal Pleadings & Commercial Litigations',
        weeks: 'Weeks 5 - 8',
        topics: ['Drafting complaints under Section 138 Negotiable Instruments Act (Cheque bounce)', 'Drafting Regular Bail (Sec 437/439 CrPC / BNSS) and Anticipatory Bail (Sec 438) applications', 'Commercial Court suits (Commercial Courts Act 2015): Statement of Truth and Summary Judgments (Order 13A)'],
        project: 'Draft a Section 138 NI Act Statutory Demand Notice and Criminal Complaint with supporting affidavit.'
      },
      {
        phase: 'Phase 3: Writ Petitions & Supreme Court Special Leave Petitions (SLP)',
        weeks: 'Weeks 9 - 12',
        topics: ['Drafting Writ Petitions under Article 226 (High Court) and Article 32 (Supreme Court): Mandamus, Certiorari, Prohibition', 'Structuring grounds, questions of law, and interim stay prayers in Special Leave Petitions (Article 136)', 'Court E-Filing procedures, curing registry defects, and affidavit notarization'],
        project: 'Draft an Article 226 Writ Petition challenging an arbitrary government tender disqualification.'
      }
    ],
    jobRoles: [
      { title: 'Litigation Drafting Associate', salary: '₹4.5L – ₹9.0L', demand: 'Very High' },
      { title: 'Senior Advocate Associate / Counsel', salary: '₹10.0L – ₹22.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'What are the three essential golden tests evaluated by courts when granting an interim injunction under Order 39 Rules 1 & 2 CPC?',
        answer: 'Courts evaluate: (1) Prima Facie Case (a strong substantive case on merits requiring trial), (2) Balance of Convenience (greater hardship to the plaintiff if injunction is denied compared to hardship to defendant if granted), and (3) Irreparable Injury (monetary compensation would not adequately remedy the injury sustained).'
      }
    ],
    faqs: [
      { question: 'What is an Advocate-on-Record (AoR) in the Supreme Court of India?', answer: 'An AoR is an advocate who has passed the Supreme Court AoR examination, entitled exclusively under the Supreme Court Rules to file pleadings, vakalatnamas, and represent clients in the Supreme Court.' }
    ],
    relatedSkills: ['litigation-skills', 'legal-research', 'legal-writing', 'contract-drafting']
  },
  {
    slug: 'litigation-skills',
    title: 'Litigation & Courtroom Trial Advocacy',
    category: 'law',
    domainSlug: 'law-legal-operations',
    categoryLabel: 'Law & Legal Studies',
    shortDesc: 'Master examination-in-chief, cross-examination, oral arguments, marking exhibits, and appellate trial strategy.',
    longDesc: 'Litigation Advocacy is the art of courtroom combat. Master framing of issues, conducting deadly cross-examinations, marking documentary evidence under the Indian Evidence Act (BSA 2023), interim argument mastery, appellate hearings, and courtroom demeanor.',
    heroImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'Courtroom Trial Advocacy & Evidence Lifecycle',
      caption: 'Case admission, issue framing, witness examination, evidence exhibition, and final oral arguments.',
      imageUrl: '/images/concepts/concept-law-compliance.svg',
      keyPoints: [
        { label: 'First Hearing & Admissions', description: 'Admission/denial of documents and framing contentious issues for trial.' },
        { label: 'Examination-in-Chief & Cross', description: 'Leading witness evidence and executing destructive/constructive cross-examination.' },
        { label: 'Evidence & Electronic Records', description: 'Proving Section 65B (BSA Sec 63) electronic certificates and marking exhibits.' },
        { label: 'Final Oral Arguments', description: 'Marshaling facts, statutory provisions, and judicial precedents into a persuasive narrative.' }
      ]
    },
    salaryRange: '₹4.5L – ₹25.0L LPA',
    minSalaryLPA: 4.5,
    maxSalaryLPA: 25.0,
    averageSalaryLPA: 12.0,
    timelineWeeks: '8 – 12 Weeks',
    hiringVolume: '16,000+ Litigation Openings',
    experienceLevel: 'Intermediate',
    topCities: ['Delhi NCR', 'Mumbai', 'Kolkata', 'Chennai', 'Bengaluru', 'Prayagraj', 'Hyderabad'],
    tools: ['eCourts Services App', 'Court Board Trackers', 'Indian Evidence Act / BSA', 'SCC Online'],
    keyHighlights: [
      'The traditional pinnacle of legal prestige, advocacy, and independent courtroom practice',
      'Uncapped earning potential for senior arguing counsels and trial specialists',
      'Direct pathway from Junior Advocate to Senior Counsel and High Court Judge'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Trial Preparation & Evidence Law (BSA 2023)',
        weeks: 'Weeks 1 - 4',
        topics: ['Framing of issues in civil suits (Order 14 CPC) and charge framing in criminal trials', 'Relevancy, admissibility, and burden of proof under Bharatiya Sakshya Adhiniyam 2023 / Evidence Act', 'Proving primary and secondary evidence, electronic records certification (Sec 65B / Sec 63 BSA), and expert witness testimony'],
        project: 'Construct an Evidence Admissibility Matrix and Section 65B Certificate for digital WhatsApp and email exhibits.'
      },
      {
        phase: 'Phase 2: Witness Examination & Cross-Examination Techniques',
        weeks: 'Weeks 5 - 8',
        topics: ['Drafting Evidence Affidavits for Examination-in-Chief', 'The art of Cross-Examination: Leading questions, impeaching credibility, highlighting contradictions, and trapping adverse witnesses', 'Handling hostile witnesses and re-examination boundaries'],
        project: 'Draft a 30-question Cross-Examination Questionnaire to impeach a hostile corporate witness.'
      },
      {
        phase: 'Phase 3: Oral Advocacy & Appellate Court Arguments',
        weeks: 'Weeks 9 - 12',
        topics: ['Structuring 15-minute oral arguments: Pitching the core equity, statutory anchoring, and handling bench questions', 'Arguing interim stay applications before vacation benches and single-judge benches', 'Appellate advocacy in High Courts and Supreme Court (Appeals, Revisions, Reviews)'],
        project: 'Deliver and record a simulated 15-minute Oral Argument before a mock High Court appellate bench.'
      }
    ],
    jobRoles: [
      { title: 'Litigation Associate / Arguing Counsel', salary: '₹4.5L – ₹10.0L', demand: 'Very High' },
      { title: 'Senior Litigation Partner / Trial Advocate', salary: '₹14.0L – ₹35.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'What are the golden rules of effective witness cross-examination?',
        answer: 'The golden rules: (1) Never ask a question unless you already know the answer, (2) Ask only short, leading questions containing one fact per question, (3) Never let the witness explain or wander into open narratives, (4) Listen carefully to exploit unexpected concessions, and (5) Stop when you have established the point—save the conclusion for final argument.'
      }
    ],
    faqs: [
      { question: 'What is the All India Bar Examination (AIBE)?', answer: 'The AIBE is a mandatory certification exam conducted by the Bar Council of India (BCI) for law graduates to obtain a Certificate of Practice (CoP) allowing practice in Indian courts.' }
    ],
    relatedSkills: ['legal-drafting', 'legal-research', 'arbitration-mediation', 'contract-law']
  },
  {
    slug: 'cyber-law',
    title: 'Cyber Law, IT Act & Cybersecurity Compliance',
    category: 'law',
    domainSlug: 'law-legal-operations',
    categoryLabel: 'Law & Legal Studies',
    shortDesc: 'Master IT Act 2000, cybercrime litigation, intermediary liability (Section 79), digital forensics, and CERT-In compliance.',
    longDesc: 'Cyber Law protects digital infrastructure, online platforms, and electronic transactions. Master Information Technology Act 2000 (Sections 43, 66, 67, 79), CERT-In 6-hour cybersecurity incident reporting mandates, intermediary safe harbor guidelines, electronic evidence preservation (Section 65B), and dark web investigations.',
    heroImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'Cyber Incident Response & IT Legal Compliance Framework',
      caption: 'Breach detection, CERT-In 6-hr notification, Sec 65B evidence seizure, and intermediary safe harbor defense.',
      imageUrl: '/images/concepts/concept-law-compliance.svg',
      keyPoints: [
        { label: 'IT Act Offenses & Penalties', description: 'Hacking (Sec 66), identity theft (Sec 66C), data theft (Sec 43), and cyber terrorism (Sec 66F).' },
        { label: 'CERT-In Incident Mandates', description: 'Mandatory 6-hour cybersecurity breach reporting and 180-day log preservation.' },
        { label: 'Intermediary Safe Harbor (Sec 79)', description: 'Due diligence rules and takedown notice compliance within 24–36 hours.' },
        { label: 'Digital Evidence Integrity', description: 'Maintaining hash-value forensic chain of custody for electronic evidence.' }
      ]
    },
    salaryRange: '₹6.0L – ₹20.0L LPA',
    minSalaryLPA: 6.0,
    maxSalaryLPA: 20.0,
    averageSalaryLPA: 11.5,
    timelineWeeks: '8 – 12 Weeks',
    hiringVolume: '14,000+ Openings across Tech Platforms & Law Firms',
    experienceLevel: 'Intermediate',
    topCities: ['Bengaluru', 'Delhi NCR', 'Mumbai', 'Hyderabad', 'Pune', 'Chennai'],
    tools: ['CERT-In Incident Reporting Portal', 'EnCase / FTK Imager Forensics', 'SCC Online Cyber Law Modules'],
    keyHighlights: [
      'High-growth legal niche bridging technology architecture, cyber incident response, and criminal law',
      'Crucial advisory role for fintechs, e-commerce giants, social media platforms, and data centers',
      'High international demand for cross-border cybercrime defense and safe-harbor compliance'
    ],
    syllabus: [
      {
        phase: 'Phase 1: IT Act 2000 & Cyber Offenses',
        weeks: 'Weeks 1 - 4',
        topics: ['IT Act 2000 overview: Electronic records legal recognition, digital signatures, and certifying authorities', 'Cyber offenses: Data theft (Sec 43), Hacking & ransomware (Sec 66), Identity theft (Sec 66C), Cheating by personation (Sec 66D)', 'Adjudicating Officer proceedings (damages up to ₹5 crore) vs Cyber Crime Police Station criminal FIRs'],
        project: 'Draft a formal Cyber Crime Complaint and Section 43 Damages Application before the IT Adjudicating Officer.'
      },
      {
        phase: 'Phase 2: Intermediary Liability & CERT-In Directives',
        weeks: 'Weeks 5 - 8',
        topics: ['Intermediary Guidelines and Digital Media Ethics Code Rules 2021 (due diligence, Grievance Officer, 24-hr takedowns)', 'Section 79 Safe Harbor defense: Shreya Singhal v UOI doctrine and court order takedown requirements', 'CERT-In cybersecurity directives: 6-hour breach notification, NTP synchronization, and 5-year VPN log storage'],
        project: 'Author a Platform Intermediary Terms of Service, Privacy Policy, and 24-Hour Grievance Redressal SOP.'
      },
      {
        phase: 'Phase 3: Digital Forensics & Electronic Evidence (Sec 65B)',
        weeks: 'Weeks 9 - 12',
        topics: ['Forensic image acquisition, hash value validation (MD5/SHA-256), and chain of custody documentation', 'Drafting Section 65B (BSA Sec 63) Electronic Evidence Certificates for server logs, CCTV, and emails (Arjun Panditrao ruling)', 'Cross-border cyber investigations: Mutual Legal Assistance Treaties (MLAT) and cloud subpoena requests (US CLOUD Act)'],
        project: 'Create a Comprehensive Incident Response & Section 65B Electronic Evidence Toolkit for an enterprise IT firm.'
      }
    ],
    jobRoles: [
      { title: 'Cyber Law Associate / Legal Counsel', salary: '₹6.0L – ₹12.0L', demand: 'Very High' },
      { title: 'Head of Cybersecurity & Privacy Legal', salary: '₹14.0L – ₹28.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'What is the Shreya Singhal v. Union of India (2015) ruling and how does it protect intermediaries under Section 79 of the IT Act?',
        answer: 'The Supreme Court struck down Section 66A for being unconstitutionally vague. For Section 79 intermediary safe harbor, the Court held that an intermediary is only required to take down user content upon receiving "actual knowledge" in the form of a binding court order or a directive from an authorized government agency, rather than acting on arbitrary private complaints.'
      }
    ],
    faqs: [
      { question: 'What is CERT-In in Indian cybersecurity?', answer: 'CERT-In (Indian Computer Emergency Response Team) is the national nodal agency under MeitY responsible for cybersecurity monitoring, incident response, and issuing mandatory reporting guidelines.' }
    ],
    relatedSkills: ['data-privacy-law', 'corporate-compliance', 'legal-technology', 'api-security']
  },
  {
    slug: 'data-privacy-law',
    title: 'Data Privacy Law & DPDP Act 2023',
    category: 'law',
    domainSlug: 'law-legal-operations',
    categoryLabel: 'Law & Legal Studies',
    shortDesc: 'Implement Digital Personal Data Protection (DPDP) Act 2023, GDPR cross-border compliance, DPIA audits, and DPO workflows.',
    longDesc: 'Data Privacy Law is one of the fastest-growing global corporate compliance disciplines. Master India\'s Digital Personal Data Protection (DPDP) Act 2023, EU General Data Protection Regulation (GDPR), Data Protection Officer (DPO) duties, Data Protection Impact Assessments (DPIA), consent notice architectures, cross-border data transfers, and Data Protection Board (DPB) penalty defenses (up to ₹250 crore).',
    heroImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'DPDP Act 2023 & GDPR Privacy Compliance Lifecycle',
      caption: 'Data mapping, itemized consent notices, Data Principal rights fulfillment, DPIA audit, and breach notification.',
      imageUrl: '/images/concepts/concept-law-compliance.svg',
      keyPoints: [
        { label: 'Data Mapping & ROPA', description: 'Identifying collection points, processing purposes, storage lifecycles, and third-party fiduciaries.' },
        { label: 'Itemized Multilingual Consent', description: 'Drafting standalone, granular notices in English and all 22 Eighth Schedule Indian languages.' },
        { label: 'Data Principal Rights Engine', description: 'Workflows for right to access, correction, erasure, and grievance redressal within statutory SLAs.' },
        { label: 'Significant Data Fiduciary (SDF)', description: 'Conducting Periodic Data Protection Impact Assessments (DPIAs) and independent privacy audits.' }
      ]
    },
    salaryRange: '₹7.0L – ₹26.0L LPA',
    minSalaryLPA: 7.0,
    maxSalaryLPA: 26.0,
    averageSalaryLPA: 14.0,
    timelineWeeks: '8 – 12 Weeks',
    hiringVolume: '15,000+ DPO & Privacy Counsel Openings',
    experienceLevel: 'Intermediate',
    topCities: ['Bengaluru', 'Delhi NCR', 'Mumbai', 'Hyderabad', 'Pune', 'Chennai', 'Remote'],
    tools: ['OneTrust Privacy Platform', 'Securiti.ai', 'BigID Data Discovery', 'DPDP Compliance Tracker', 'Consent Management Platforms (CMP)'],
    keyHighlights: [
      'Top corporate compliance priority across Indian enterprises following the notification of the DPDP Act 2023',
      'Massive penalties up to ₹250 crore for data breaches make DPOs and Privacy Counsels indispensable',
      'Dual global career value with CIPP/A, CIPP/E, and CIPM professional privacy certifications'
    ],
    syllabus: [
      {
        phase: 'Phase 1: DPDP Act 2023 Architecture & Core Obligations',
        weeks: 'Weeks 1 - 4',
        topics: ['DPDP Act 2023 scope, digital personal data definition, Data Fiduciaries, and Data Principals', 'Valid consent requirements: Free, specific, informed, unconditional, and itemized multilingual notice requirements', 'Grounds for processing without consent: Legitimate uses (employment, state benefits, medical emergencies)'],
        project: 'Design a compliant Multilingual Privacy & Consent Notice Framework for an e-commerce or fintech app.'
      },
      {
        phase: 'Phase 2: Significant Data Fiduciaries, DPIA & Children\'s Data',
        weeks: 'Weeks 5 - 8',
        topics: ['Significant Data Fiduciary (SDF) obligations: Appointing an India-based Data Protection Officer (DPO) and independent audits', 'Conducting Data Protection Impact Assessments (DPIA) for high-risk processing and AI models', 'Children\'s data safeguards: Verifiable parental consent and prohibition of tracking/targeted advertising'],
        project: 'Perform a comprehensive Data Protection Impact Assessment (DPIA) on a healthcare patient portal.'
      },
      {
        phase: 'Phase 3: Cross-Border Transfers, Breach Protocols & GDPR Comparison',
        weeks: 'Weeks 9 - 12',
        topics: ['Cross-border data transfer rules: Negative list mechanism vs GDPR Standard Contractual Clauses (SCCs)', 'Data breach notification SOPs to the Data Protection Board of India and impacted Data Principals', 'Comparing DPDP Act 2023 with EU GDPR and California CCPA/CPRA'],
        project: 'Create an Enterprise Data Breach Response Playbook and Data Principal Rights (DSAR) SLA Workflow.'
      }
    ],
    jobRoles: [
      { title: 'Data Privacy Associate / Privacy Counsel', salary: '₹7.0L – ₹14.0L', demand: 'Very High' },
      { title: 'Data Protection Officer (DPO) / Head of Privacy', salary: '₹16.0L – ₹32.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'What are the core obligations of a Significant Data Fiduciary (SDF) under the Indian DPDP Act 2023?',
        answer: 'An SDF must: (1) Appoint a Data Protection Officer (DPO) who represents the fiduciary and is based in India, (2) Appoint an independent Data Auditor to evaluate compliance, (3) Conduct periodic Data Protection Impact Assessments (DPIAs), (4) Undertake periodic audits, and (5) Implement robust measures to safeguard children’s data and public order.'
      }
    ],
    faqs: [
      { question: 'What is the maximum financial penalty under the DPDP Act 2023?', answer: 'The Data Protection Board of India can impose penalties up to ₹250 crore for failure to implement reasonable security safeguards resulting in a personal data breach, and up to ₹200 crore for non-compliance with children\'s data protections.' }
    ],
    relatedSkills: ['cyber-law', 'corporate-compliance', 'legal-compliance', 'legal-operations']
  },
  {
    slug: 'arbitration-mediation',
    title: 'Arbitration, Mediation & Alternative Dispute Resolution (ADR)',
    category: 'law',
    domainSlug: 'law-legal-operations',
    categoryLabel: 'Law & Legal Studies',
    shortDesc: 'Master Arbitration & Conciliation Act 1996, institutional arbitration (SIAC, MCIA), Section 9/11 petitions, and mediation.',
    longDesc: 'Alternative Dispute Resolution (ADR) resolves high-value corporate and infrastructure disputes outside overloaded courtrooms. Master the Arbitration and Conciliation Act 1996 (as amended), drafting binding arbitration clauses, Section 9 interim measures, Section 11 arbitrator appointments, domestic & international commercial arbitration (SIAC, LCIA, MCIA, DIAC), Section 34 challenge to arbitral awards, and Mediation Act 2023 protocols.',
    heroImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'Commercial Arbitration & Award Enforcement Pipeline',
      caption: 'Dispute trigger, Section 11 appointment, statement of claim/defense, evidentiary hearing, arbitral award, and Section 34/36 enforcement.',
      imageUrl: '/images/concepts/concept-law-compliance.svg',
      keyPoints: [
        { label: 'Arbitration Agreement (Sec 7)', description: 'Drafting clear seat, venue, governing law, and institutional rule clauses.' },
        { label: 'Interim Relief (Sec 9 / Sec 17)', description: 'Securing pre-arbitration asset freezing and performance security.' },
        { label: 'Arbitral Proceedings & Award', description: 'Pleadings, witness cross-examination, and reasoned final arbitral awards.' },
        { label: 'Enforcement & Section 34', description: 'Enforcing under Section 36 (Order 21 CPC) and defending against public policy challenges (Sec 34).' }
      ]
    },
    salaryRange: '₹6.0L – ₹24.0L LPA',
    minSalaryLPA: 6.0,
    maxSalaryLPA: 24.0,
    averageSalaryLPA: 13.0,
    timelineWeeks: '8 – 12 Weeks',
    hiringVolume: '12,000+ ADR Openings',
    experienceLevel: 'Intermediate',
    topCities: ['Delhi NCR', 'Mumbai', 'Bengaluru', 'Kolkata', 'Hyderabad', 'Singapore (Cross-Border)'],
    tools: ['SIAC Rules Portal', 'MCIA Rules', 'DIAC Rules', 'SCC Online Arbitration Modules', 'Kluwer Arbitration'],
    keyHighlights: [
      'Preferred dispute resolution mechanism for commercial contracts, infrastructure, and international joint ventures',
      'High-paying practice across leading ADR boutique firms and international arbitration groups',
      'The Mediation Act 2023 has introduced mandatory pre-litigation mediation across commercial disputes'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Arbitration Agreement & Court Interventions',
        weeks: 'Weeks 1 - 4',
        topics: ['Arbitration agreement essentials (Section 7): Seat vs Venue distinction and doctrine of severability', 'Court interim measures (Section 9) vs Arbitral Tribunal interim orders (Section 17)', 'Section 11 court appointment of arbitrators, neutrality standards, and Fifth/Seventh Schedule disqualifications'],
        project: 'Draft a Section 9 Petition seeking urgent interim preservation of bank guarantees in a construction dispute.'
      },
      {
        phase: 'Phase 2: Arbitral Proceedings & International Commercial Arbitration',
        weeks: 'Weeks 5 - 8',
        topics: ['Conducting arbitral proceedings: Statement of Claim, Statement of Defense, Counterclaims, and procedural orders', 'Institutional arbitration rules: Singapore International Arbitration Centre (SIAC), MCIA (Mumbai), and LCIA', 'Evidence in arbitration: IBA Rules on the Taking of Evidence and witness cross-examination'],
        project: 'Draft a comprehensive Statement of Claim in a multi-crore infrastructure commercial arbitration.'
      },
      {
        phase: 'Phase 3: Setting Aside Awards, Enforcement & Mediation Act 2023',
        weeks: 'Weeks 9 - 12',
        topics: ['Challenging arbitral awards under Section 34: Patent illegality and public policy grounds (Associate Builders doctrine)', 'Enforcement of domestic awards (Section 36) and foreign awards under the New York Convention (Part II)', 'Mediation Act 2023: Pre-litigation mediation process, confidentiality, and enforcement of mediated settlement agreements'],
        project: 'Author a Section 34 Petition challenging an arbitral award on grounds of patent illegality and lack of jurisdiction.'
      }
    ],
    jobRoles: [
      { title: 'Arbitration & ADR Associate', salary: '₹6.0L – ₹12.0L', demand: 'Very High' },
      { title: 'Senior Dispute Resolution Counsel / Arbitrator', salary: '₹14.0L – ₹28.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'What is the critical legal difference between the "Seat" and the "Venue" of an arbitration?',
        answer: 'The "Seat" determines the curial law (lex arbitri) governing the arbitral procedure and grants supervisory jurisdiction to the courts of that specific geographic jurisdiction (including Section 9, 11, and 34 applications). The "Venue" is simply the convenient geographical meeting place for hearings. If a seat is designated, its courts exercise exclusive supervisory jurisdiction, regardless of where hearings take place.'
      }
    ],
    faqs: [
      { question: 'What is the standard time limit for completing an arbitration in India?', answer: 'Under Section 29A of the Arbitration Act, arbitral tribunals must render awards within 12 months from completion of pleadings, extendable by 6 months by mutual consent of parties.' }
    ],
    relatedSkills: ['litigation-skills', 'contract-drafting', 'contract-law', 'corporate-law']
  },
  {
    slug: 'company-secretary-skills',
    title: 'Company Secretary & Corporate Governance',
    category: 'law',
    domainSlug: 'law-legal-operations',
    categoryLabel: 'Law & Legal Studies',
    shortDesc: 'Manage secretarial audits, MCA21 e-filings, board minutes, SEBI LODR compliance, and ROC annual returns.',
    longDesc: 'Company Secretaries (CS) and Corporate Governance specialists safeguard institutional integrity. Master Secretarial Standards (SS-1 Meetings of Board, SS-2 General Meetings), MCA21 V3 portal filings (MGT-7, AOC-4, DIR-12), SEBI (LODR) Regulations 2015, Insider Trading regulations (PIT), and Secretarial Audits under Section 204 of the Companies Act 2013.',
    heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'Corporate Secretarial Compliance & Governance Calendar',
      caption: 'Board meeting notice, agenda curation, drafting minutes (SS-1), ROC e-filings, and AGM compliance.',
      imageUrl: '/images/concepts/concept-law-compliance.svg',
      keyPoints: [
        { label: 'Board & Committee Meetings', description: 'Issuing 7-day notice, agenda packs, and verbatim compliance minutes under SS-1.' },
        { label: 'ROC Annual Filings', description: 'E-filing Financial Statements (AOC-4 XBRL) and Annual Returns (MGT-7) on MCA21 V3.' },
        { label: 'SEBI LODR Compliance', description: 'Quarterly financial disclosures, shareholding patterns, and corporate governance reports.' },
        { label: 'Secretarial Audit (Sec 204)', description: 'Auditing statutory registers, share allotments, charges, and statutory registers (Form MR-3).' }
      ]
    },
    salaryRange: '₹5.5L – ₹20.0L LPA',
    minSalaryLPA: 5.5,
    maxSalaryLPA: 20.0,
    averageSalaryLPA: 11.0,
    timelineWeeks: '8 – 12 Weeks',
    hiringVolume: '14,000+ CS & Secretarial Openings',
    experienceLevel: 'Intermediate',
    topCities: ['Mumbai', 'Delhi NCR', 'Bengaluru', 'Kolkata', 'Hyderabad', 'Chennai', 'Pune', 'Ahmedabad'],
    tools: ['MCA21 V3 Portal', 'BSE / NSE Listing Portals (NEAPS)', 'XBRL Filing Software', 'Secretarial Audit Management Tools'],
    keyHighlights: [
      'Statutory high-prestige executive office mandated by Section 203 of Companies Act 2013 for listed and public companies',
      'Direct confidential advisor to the Board of Directors, Chairman, and Audit Committee',
      'Crucial bridge between corporate management, shareholders, and regulatory authorities (ROC, SEBI, NCLT)'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Secretarial Standards, Board Meetings & MCA21 Filings',
        weeks: 'Weeks 1 - 4',
        topics: ['Secretarial Standard 1 (SS-1 on Board Meetings) and Secretarial Standard 2 (SS-2 on General Meetings)', 'Drafting Notice, Agenda, Board Resolutions, and Minutes for Board and Committee Meetings', 'MCA21 V3 Portal operations: Filing DIR-12 (Directors), PAS-3 (Allotment), CHG-1 (Charges), and AOC-4 / MGT-7'],
        project: 'Compile a complete Board Meeting Agenda Pack, draft Resolutions, and post-meeting Minutes.'
      },
      {
        phase: 'Phase 2: SEBI Compliance, Insider Trading & Listing Obligations',
        weeks: 'Weeks 5 - 8',
        topics: ['SEBI (Listing Obligations and Disclosure Requirements - LODR) Regulations 2015: Quarterly filings and disclosures', 'SEBI (Prohibition of Insider Trading - PIT) Regulations: Trading window closures, UPSI policies, and structured digital databases (SDD)', 'Related Party Transactions (RPT) approvals and audit committee compliance reviews'],
        project: 'Develop an Enterprise SEBI LODR & PIT Compliance Calendar and Structured Digital Database SOP.'
      },
      {
        phase: 'Phase 3: Secretarial Audit, Due Diligence & NCLT Proceedings',
        weeks: 'Weeks 9 - 12',
        topics: ['Conducting Secretarial Audits under Section 204 of Companies Act 2013 and issuing Form MR-3 reports', 'Maintaining statutory registers (Members, Directors, Loans, Charges, Investments) under Companies Rules', 'Handling NCLT matters: Compounding of offenses (Section 441), strike off, and amalgamation schemes'],
        project: 'Execute a full-scope Secretarial Audit Checklist and author a Form MR-3 Secretarial Audit Report.'
      }
    ],
    jobRoles: [
      { title: 'Company Secretary (Assistant / Deputy CS)', salary: '₹5.5L – ₹11.0L', demand: 'Very High' },
      { title: 'Company Secretary & Compliance Officer (Head of Secretarial)', salary: '₹12.0L – ₹28.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'What are the key requirements for recording and circulating Board Meeting minutes under Secretarial Standard 1 (SS-1)?',
        answer: 'Under SS-1, draft minutes must be circulated to all directors within 15 days of the meeting for their comments (directors have 7 days to provide feedback). The final minutes must be entered in the physical Minutes Book within 30 days of the meeting and signed by the Chairman of the meeting or the Chairman of the subsequent meeting.'
      }
    ],
    faqs: [
      { question: 'What qualification is required to become a certified Company Secretary in India?', answer: 'Clearing the Executive and Professional examinations of the Institute of Company Secretaries of India (ICSI) along with mandatory practical training.' }
    ],
    relatedSkills: ['corporate-law', 'legal-compliance', 'corporate-compliance', 'accounting-standards']
  }
];
