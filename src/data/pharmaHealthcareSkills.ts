import type { SkillDetail } from './skillsData';

export const pharmaHealthcareSkills: SkillDetail[] = [
  {
    slug: 'pharmacy-practice',
    title: 'Pharmacy Practice & Dispensing',
    category: 'pharma',
    domainSlug: 'pharma-healthcare-life-sciences',
    categoryLabel: 'Pharmacy & Healthcare',
    shortDesc: 'Master prescription interpretation, drug-drug interaction screening, patient counseling, and retail/institutional dispensing.',
    longDesc: 'Pharmacy Practice is the frontline of safe medication therapy. Master prescription verification, dosage calculations, compounding fundamentals, patient medication counseling, adverse reaction flagging, and Pharmacy Act 1948 statutory standards.',
    heroImage: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'Clinical Dispensing & Patient Safety Pipeline',
      caption: 'Prescription intake, therapeutic audit, interaction check, and patient counseling.',
      imageUrl: '/images/concepts/concept-pharma-clinical.svg',
      keyPoints: [
        { label: 'Prescription Screening', description: 'Verifying drug names, dosage regimens, patient allergies, and legal validity.' },
        { label: 'Interaction Screening', description: 'Cross-referencing CYP450 enzyme interactions and contraindications in drug databases.' },
        { label: 'Patient Counseling', description: 'Communicating administration schedules, side effects, dietary interactions, and storage.' },
        { label: 'Schedule H/H1 Compliance', description: 'Strict record-keeping and register audits for regulated drugs.' }
      ]
    },
    salaryRange: '₹3.0L – ₹7.5L LPA',
    minSalaryLPA: 3.0,
    maxSalaryLPA: 7.5,
    averageSalaryLPA: 5.0,
    timelineWeeks: '6 – 8 Weeks',
    hiringVolume: '25,000+ Retail & Hospital Pharmacy Openings',
    experienceLevel: 'Fresher Friendly',
    topCities: ['Hyderabad', 'Mumbai', 'Ahmedabad', 'Bengaluru', 'Delhi NCR', 'Chennai', 'Pune'],
    tools: ['Medscape / Lexicomp', 'Marg ERP for Pharmacy', 'CIMS Drug Directory', 'Schedule H1 Registers'],
    keyHighlights: [
      'Core foundation for B.Pharm and D.Pharm graduates across India',
      'High demand across leading retail pharmacy chains (Apollo, MedPlus, Tata 1mg, Netmeds)',
      'Direct pathway into Clinical Pharmacy, Medical Representation, and Retail Entrepreneurship'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Pharmacology & Prescription Analysis',
        weeks: 'Weeks 1 - 3',
        topics: ['Pharmacokinetics, pharmacodynamics, and therapeutic drug classifications', 'Prescription validation, deciphering physician abbreviations, and calculating pediatric doses', 'Screening for drug-drug, drug-food interactions and contraindicated polypharmacy'],
        project: 'Audit 50 mock prescriptions across chronic cardiology, diabetic, and oncology regimens.'
      },
      {
        phase: 'Phase 2: Patient Counseling & Pharmacy Laws',
        weeks: 'Weeks 4 - 7',
        topics: ['Structured patient counseling protocols for inhalers, insulin pens, and antibiotic courses', 'Drugs and Cosmetics Act 1940 & Rules 1945: Schedule H, H1, X regulations', 'Inventory storage standards, cold-chain maintenance (2-8°C), and Marg ERP billing'],
        project: 'Create a Comprehensive Patient Counseling & Schedule H1 Pharmacy Compliance Protocol.'
      }
    ],
    jobRoles: [
      { title: 'Registered Pharmacist (Retail/Hospital)', salary: '₹3.0L – ₹5.5L', demand: 'Very High' },
      { title: 'Pharmacy In-Charge / Store Manager', salary: '₹5.0L – ₹8.5L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'What mandatory steps must a pharmacist take before dispensing a Schedule H1 drug in India?',
        answer: 'Verify the doctor\'s original prescription, record patient name/address, prescriber details, drug name, batch number, quantity, and date in a separate Schedule H1 register, preserve the register for at least 3 years, and ensure the prescription is marked to prevent unauthorized re-dispensing.'
      }
    ],
    faqs: [
      { question: 'Is state pharmacy council registration mandatory?', answer: 'Yes, a valid registered pharmacist license issued by your State Pharmacy Council (under the Pharmacy Act) is legally required for dispensing medications in India.' }
    ],
    relatedSkills: ['clinical-pharmacy', 'hospital-pharmacy', 'community-pharmacy', 'pharmacovigilance']
  },
  {
    slug: 'clinical-pharmacy',
    title: 'Clinical Pharmacy & Therapeutics',
    category: 'pharma',
    domainSlug: 'pharma-healthcare-life-sciences',
    categoryLabel: 'Pharmacy & Healthcare',
    shortDesc: 'Work in tertiary care ICU/ward rounds optimizing medication regimens, therapeutic drug monitoring (TDM), and antibiotic stewardship.',
    longDesc: 'Clinical Pharmacists work alongside physicians in tertiary hospital settings (ICUs, oncology, cardiology). Master Therapeutic Drug Monitoring (TDM), pharmacokinetic dosing adjustments (vancomycin, aminoglycosides), antibiotic stewardship protocols, and adverse drug event (ADE) reporting.',
    heroImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'Clinical Pharmacy Inpatient Rounding Model',
      caption: 'Bedside chart audit, TDM calculation, clinical intervention, and progress documentation.',
      imageUrl: '/images/concepts/concept-pharma-clinical.svg',
      keyPoints: [
        { label: 'Chart Audit (SOAP)', description: 'Evaluating Subjective, Objective, Assessment, and Plan notes for inpatient charts.' },
        { label: 'TDM Dosing Optimization', description: 'Calculating peak/trough levels and adjusting doses based on renal clearance (eGFR/CrCl).' },
        { label: 'Antimicrobial Stewardship', description: 'Preventing resistance through culture-directed de-escalation.' },
        { label: 'Medication Reconciliation', description: 'Transition-of-care medication checks preventing omission and duplications.' }
      ]
    },
    salaryRange: '₹4.5L – ₹12.0L LPA',
    minSalaryLPA: 4.5,
    maxSalaryLPA: 12.0,
    averageSalaryLPA: 7.5,
    timelineWeeks: '8 – 12 Weeks',
    hiringVolume: '10,000+ Super-Specialty Hospital Openings',
    experienceLevel: 'Intermediate',
    topCities: ['Hyderabad', 'Bengaluru', 'Mumbai', 'Chennai', 'Delhi NCR', 'Kochi', 'Kolkata'],
    tools: ['Micromedex', 'UpToDate', 'Epic / Cerner EHR', 'Vancomycin TDM Calculators', 'Sanford Guide to Antimicrobial Therapy'],
    keyHighlights: [
      'High prestige hospital rounding role for Pharm.D, M.Pharm (Pharmacy Practice), and clinical pharmacists',
      'Expanding across NABH and JCI accredited corporate hospital networks (Apollo, Fortis, Max, Manipal)',
      'High international migration potential (US, UK, UAE, Canada, Australia)'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Clinical Pharmacokinetics & Organ Function Adjustments',
        weeks: 'Weeks 1 - 4',
        topics: ['Creatinine clearance (Cockcroft-Gault) and Child-Pugh liver impairment dose calculations', 'Therapeutic Drug Monitoring (TDM) for narrow therapeutic index drugs (Vancomycin, Digoxin, Lithium, Phenytoin)', 'Interpreting arterial blood gases (ABG), electrolyte panels, and microbiological culture reports'],
        project: 'Develop a Complete TDM & Pharmacokinetic Dosing Protocol for ICU Vancomycin and Gentamicin.'
      },
      {
        phase: 'Phase 2: Antimicrobial Stewardship & Inpatient Case Workups',
        weeks: 'Weeks 5 - 8',
        topics: ['Antibiotic stewardship: Empiric therapy selection, de-escalation, and IV-to-oral switch protocols', 'Conducting clinical SOAP notes and bedside physician rounding interventions', 'Oncology chemotherapy protocol verification and toxicities management'],
        project: 'Write 10 Inpatient Clinical SOAP Case Studies across Critical Care, Cardiology, and Infectious Diseases.'
      },
      {
        phase: 'Phase 3: Medication Safety, ADRs & NABH Accreditation',
        weeks: 'Weeks 9 - 12',
        topics: ['High-alert medication protocols (LASA - Look Alike Sound Alike safeguards)', 'Adverse Drug Reaction (ADR) root-cause analysis and Naranjo algorithm causality scoring', 'NABH medication management standards and clinical audit indicators'],
        project: 'Design an institutional Medication Safety & LASA Audit Blueprint for a 300-bed hospital.'
      }
    ],
    jobRoles: [
      { title: 'Clinical Pharmacist / ICU Pharmacist', salary: '₹4.5L – ₹8.0L', demand: 'Very High' },
      { title: 'Lead Clinical Pharmacist / Specialist', salary: '₹8.0L – ₹14.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'How do you calculate creatinine clearance using the Cockcroft-Gault equation for dosage adjustment?',
        answer: 'CrCl (mL/min) = [(140 - Age) × Weight in kg] / (72 × Serum Creatinine in mg/dL). For females, multiply the result by 0.85 to account for lower muscle mass. The resulting CrCl guides dosing adjustments for renally cleared medications like enoxaparin, cephalosporins, and vancomycin.'
      }
    ],
    faqs: [
      { question: 'Is Pharm.D or M.Pharm required for clinical pharmacy?', answer: 'Pharm.D or M.Pharm in Pharmacy Practice is preferred by accredited hospitals for bedside clinical roles, though experienced B.Pharm candidates with clinical hospital exposure are also hired.' }
    ],
    relatedSkills: ['pharmacy-practice', 'hospital-pharmacy', 'pharmacovigilance', 'drug-safety']
  },
  {
    slug: 'hospital-pharmacy',
    title: 'Hospital Pharmacy Management',
    category: 'pharma',
    domainSlug: 'pharma-healthcare-life-sciences',
    categoryLabel: 'Pharmacy & Healthcare',
    shortDesc: 'Manage central inpatient pharmacies, automated dispensing cabinets, sterile compounding, and NABH medication audits.',
    longDesc: 'Hospital Pharmacy Management coordinates the entire drug supply and compounding operations of healthcare institutions. Master centralized unit-dose dispensing, laminar airflow sterile IV compounding, narcotic register audits, hospital formulary management, and emergency crash cart replenishment.',
    heroImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'Inpatient Hospital Drug Distribution & Safety Architecture',
      caption: 'Central pharmacy, sterile compounding, satellite wards, and automated dispensing cabinets.',
      imageUrl: '/images/concepts/concept-pharma-clinical.svg',
      keyPoints: [
        { label: 'Unit-Dose Dispensing', description: 'Individual barcoded doses for daily patient administration reducing errors.' },
        { label: 'Cleanroom Sterile Compounding', description: 'Class 100 Laminar Air Flow hoods for Total Parenteral Nutrition (TPN) and cytotoxic prep.' },
        { label: 'Crash Cart & Emergency Kits', description: 'Standardized layout and expiry auditing for emergency resuscitation drugs.' },
        { label: 'Narcotics & High-Alert Audit', description: 'Double-sign verification and biometric tracking for controlled substances.' }
      ]
    },
    salaryRange: '₹3.5L – ₹9.0L LPA',
    minSalaryLPA: 3.5,
    maxSalaryLPA: 9.0,
    averageSalaryLPA: 6.2,
    timelineWeeks: '6 – 8 Weeks',
    hiringVolume: '15,000+ Hospital Openings',
    experienceLevel: 'Fresher Friendly',
    topCities: ['Hyderabad', 'Bengaluru', 'Mumbai', 'Delhi NCR', 'Chennai', 'Pune', 'Kochi'],
    tools: ['Hospital Information Systems (HIS)', 'Pyxis / Omnicell ADC', 'Laminar Air Flow Cleanrooms', 'Marg Hospital ERP'],
    keyHighlights: [
      'Core management track across private and government multi-specialty hospitals',
      'Direct responsibility for multi-crore drug inventories and sterile IV preparation suites',
      'Strong upward mobility to Hospital Materials Manager and Director of Pharmacy'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Inpatient Dispensing & Cleanroom Operations',
        weeks: 'Weeks 1 - 3',
        topics: ['Centralized vs decentralized satellite pharmacy workflows and unit-dose cart filling', 'Aseptic technique and Laminar Air Flow (LAF) operation for IV admixtures and TPN', 'Cytotoxic oncology drug handling, personal protective equipment (PPE), and spill response'],
        project: 'Draft an SOP for Sterile IV Compounding and Cleanroom Quality Control.'
      },
      {
        phase: 'Phase 2: Formulary Management & Narcotics Control',
        weeks: 'Weeks 4 - 7',
        topics: ['Pharmacy & Therapeutics (P&T) committee functions and hospital formulary evaluation', 'Narcotic and psychotropic drug requisition, double-locked storage, and waste destruction logs', 'Crash cart management, Defibrillator kit maintenance, and NABH medication audit prep'],
        project: 'Build a Complete Hospital Pharmacy Formulary & Narcotics Audit Management Blueprint.'
      }
    ],
    jobRoles: [
      { title: 'Hospital Pharmacist / Inpatient Supervisor', salary: '₹3.5L – ₹6.5L', demand: 'Very High' },
      { title: 'Chief Hospital Pharmacist / Pharmacy Manager', salary: '₹7.0L – ₹13.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'How do you ensure sterile conditions when preparing Total Parenteral Nutrition (TPN) in a hospital pharmacy?',
        answer: 'By working inside a certified ISO Class 5 Laminar Air Flow (LAF) hood located within an ISO Class 7 cleanroom, adhering to strict hand hygiene and sterile gowning, wiping all supplies with 70% sterile isopropyl alcohol, operating at least 6 inches inside the hood, and conducting regular environmental particle counts and settle plate testing.'
      }
    ],
    faqs: [
      { question: 'What is NABH MOM in hospital accreditation?', answer: 'NABH MOM (Management of Medication) is the statutory hospital accreditation chapter governing safe procurement, storage, prescription, dispensing, administration, and monitoring of drugs.' }
    ],
    relatedSkills: ['pharmacy-practice', 'clinical-pharmacy', 'pharmacy-inventory-management', 'hospital-administration']
  },
  {
    slug: 'community-pharmacy',
    title: 'Community Pharmacy & Retail Chain Operations',
    category: 'pharma',
    domainSlug: 'pharma-healthcare-life-sciences',
    categoryLabel: 'Pharmacy & Healthcare',
    shortDesc: 'Run high-volume retail pharmacies, OTC consultation, point-of-care testing, and omni-channel e-pharmacy fulfillment.',
    longDesc: 'Community Pharmacy operates at the heart of neighborhood wellness. Master retail dispensing, over-the-counter (OTC) symptom triage, minor ailment protocols, retail inventory turns, point-of-care blood pressure/glucose screening, and quick-commerce e-pharmacy integration.',
    heroImage: 'https://images.unsplash.com/photo-1586015555751-63c29994c6f3?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'Community Pharmacy Patient Care & Retail Model',
      caption: 'OTC triage, chronic refill adherence, point-of-care screening, and omnichannel retail delivery.',
      imageUrl: '/images/concepts/concept-pharma-clinical.svg',
      keyPoints: [
        { label: 'OTC Triage & Red Flags', description: 'Evaluating common symptoms and identifying critical red-flag signs requiring physician referral.' },
        { label: 'Chronic Disease Refill Sync', description: 'Automated monthly refills for hypertension and diabetic medications improving patient adherence.' },
        { label: 'Point-of-Care Diagnostics', description: 'Glucometer, digital BP, and rapid diagnostic testing.' },
        { label: 'Retail Inventory Turnover', description: 'Managing fast-moving consumer health goods (FMCG) and near-expiry stock returns.' }
      ]
    },
    salaryRange: '₹3.0L – ₹7.0L LPA',
    minSalaryLPA: 3.0,
    maxSalaryLPA: 7.0,
    averageSalaryLPA: 4.8,
    timelineWeeks: '4 – 6 Weeks',
    hiringVolume: '30,000+ Retail Openings',
    experienceLevel: 'Fresher Friendly',
    topCities: ['Pan-India', 'Bengaluru', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Pune', 'Ahmedabad'],
    tools: ['Marg ERP', 'Logic POS', 'Red Book Drug Database', 'Point-of-Care Glucometers / BP Monitors'],
    keyHighlights: [
      'Huge hiring by corporate pharmacy retail chains (Apollo 24|7, MedPlus, Wellness Forever)',
      'Essential skill for setting up your own profitable independent retail pharmacy store',
      'Direct everyday human interaction improving community health outcomes'
    ],
    syllabus: [
      {
        phase: 'Phase 1: OTC Triage & Chronic Disease Adherence',
        weeks: 'Weeks 1 - 3',
        topics: ['Differential assessment of cough, cold, GI upset, pain, and skin allergies for OTC treatment', 'Red flag symptom identification requiring immediate emergency hospital referral', 'Designing chronic medication reminder programs (Hypertension, Diabetes, Thyroid)'],
        project: 'Create an OTC Triage and Referral Decision Tree for 10 common retail community presentations.'
      },
      {
        phase: 'Phase 2: Retail Merchandising, Billing & Store Profitability',
        weeks: 'Weeks 4 - 6',
        topics: ['Point-of-Sale (POS) ERP billing, GST invoicing, and drug batch expiry tracking', 'Fast vs slow moving stock analysis (ABC/VED analysis) and managing distributor returns', 'Omni-channel order packing, cold chain fulfillment, and customer loyalty retention'],
        project: 'Develop an End-to-End Retail Community Pharmacy Business & Inventory Operations Blueprint.'
      }
    ],
    jobRoles: [
      { title: 'Community Pharmacist / Store In-Charge', salary: '₹3.0L – ₹5.5L', demand: 'Very High' },
      { title: 'Retail Area Operations Manager', salary: '₹6.0L – ₹11.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'How do you differentiate between a common tension headache and a red-flag headache requiring urgent medical referral?',
        answer: 'A tension headache is typically diffuse, dull, and gradual without neurological deficits. Red-flag symptoms ("SNOOP" criteria) include sudden thunderclap onset, focal neurological symptoms, fever with neck stiffness, onset after age 50, or worsening with head position changes—all requiring immediate physician referral.'
      }
    ],
    faqs: [
      { question: 'What profit margins exist in retail community pharmacy in India?', answer: 'Branded generic medicines typically yield 15%–20% margins, generic formulations yield 40%–60%, and surgical/FMCG products yield 25%–35%.' }
    ],
    relatedSkills: ['pharmacy-practice', 'pharmacy-inventory-management', 'pharmaceutical-sales-marketing']
  },
  {
    slug: 'pharmaceutical-quality-assurance',
    title: 'Pharmaceutical Quality Assurance (QA)',
    category: 'pharma',
    domainSlug: 'pharma-healthcare-life-sciences',
    categoryLabel: 'Pharmacy & Healthcare',
    shortDesc: 'Ensure US FDA, EU-GMP, and WHO-GMP compliance, manage Change Controls, CAPA, Deviations, and batch release.',
    longDesc: 'Pharmaceutical Quality Assurance (QA) oversees manufacturing integrity. Master Quality Management Systems (QMS), Corrective and Preventive Actions (CAPA), Out of Specification (OOS/OOT) investigations, Change Controls, Process Validation, and US FDA 21 CFR Part 210/211 audit readiness.',
    heroImage: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'Pharmaceutical Quality Management System (QMS) Lifecycle',
      caption: 'Deviation capture, root cause analysis (Fishbone/5-Why), CAPA execution, and batch record release.',
      imageUrl: '/images/concepts/concept-pharma-clinical.svg',
      keyPoints: [
        { label: 'Deviation Management', description: 'Logging planned/unplanned manufacturing variances within 24 hours.' },
        { label: 'Root Cause & CAPA', description: 'Executing 5-Whys and Ishikawa diagrams to implement permanent systemic fixes.' },
        { label: 'Change Control', description: 'Evaluating risk before modifying equipment, facilities, raw materials, or processes.' },
        { label: 'Batch Record Review (BMR)', description: 'Auditing critical process parameters (CPPs) before QP/QA batch market release.' }
      ]
    },
    salaryRange: '₹4.0L – ₹12.5L LPA',
    minSalaryLPA: 4.0,
    maxSalaryLPA: 12.5,
    averageSalaryLPA: 7.8,
    timelineWeeks: '8 – 12 Weeks',
    hiringVolume: '20,000+ Manufacturing QA Openings',
    experienceLevel: 'Intermediate',
    topCities: ['Hyderabad', 'Ahmedabad', 'Mumbai', 'Baddi (HP)', 'Visakhapatnam', 'Pune', 'Goa'],
    tools: ['TrackWise QMS', 'MasterControl', 'Documentum', 'SAP QM Module', 'Minitab for Statistical Quality Control'],
    keyHighlights: [
      'High-demand career track across Indian pharma manufacturing hubs exporting to US/Europe',
      'Directly safeguards global patient safety and prevents costly regulatory warning letters',
      'High mobility into Regulatory Affairs, Plant Head, and Global Quality Director roles'
    ],
    syllabus: [
      {
        phase: 'Phase 1: cGMP Guidelines & QMS Fundamentals',
        weeks: 'Weeks 1 - 4',
        topics: ['ICH Guidelines: Q8 (Pharmaceutical Dev), Q9 (Quality Risk Mgmt), Q10 (Pharmaceutical Quality System)', 'US FDA 21 CFR Part 211, EU-GMP Volume 4, and Schedule M standards', 'Documentation practices (ALCOA+ Data Integrity) and Standard Operating Procedure (SOP) authoring'],
        project: 'Draft a master SOP for Deviation Handling and Root Cause Analysis.'
      },
      {
        phase: 'Phase 2: CAPA, Change Control & OOS Investigations',
        weeks: 'Weeks 5 - 8',
        topics: ['Conducting Out of Specification (OOS) and Out of Trend (OOT) investigations (FDA guidance)', 'Root Cause Analysis methodologies: 5-Whys, Fishbone (Ishikawa), and FMEA risk matrix', 'Change Control workflow: Evaluation, testing, regulatory impact, and closure tracking'],
        project: 'Perform an End-to-End OOS Investigation and CAPA Case Study for a failed dissolution batch.'
      },
      {
        phase: 'Phase 3: Validation, Audits & Batch Release',
        weeks: 'Weeks 9 - 12',
        topics: ['Process Validation (Stage 1-3), Equipment Qualification (DQ, IQ, OQ, PQ), and Cleaning Validation', 'Batch Manufacturing Record (BMR) and Batch Packaging Record (BPR) review and release', 'Preparing for and defending regulatory audits (US FDA, MHRA, WHO)'],
        project: 'Design a Complete Process Validation Protocol (PVP) for an oral solid dosage formulation.'
      }
    ],
    jobRoles: [
      { title: 'Quality Assurance Executive / Officer', salary: '₹4.0L – ₹7.5L', demand: 'Very High' },
      { title: 'QA Assistant Manager / QMS Lead', salary: '₹8.0L – ₹14.0L', demand: 'High' },
      { title: 'Head of Quality Assurance (Plant QA)', salary: '₹15.0L – ₹28.0L', demand: 'Moderate' }
    ],
    interviewQuestions: [
      {
        question: 'What is the ALCOA+ framework in pharmaceutical Data Integrity?',
        answer: 'ALCOA+ specifies that all GMP records must be: Attributable (who did it), Legible (readable), Contemporaneous (recorded in real time), Original (first recording), Accurate (truthful). The "+" adds: Complete, Consistent, Enduring, and Available throughout the record retention period.'
      }
    ],
    faqs: [
      { question: 'What is the key difference between QA and QC in pharmaceuticals?', answer: 'QC (Quality Control) is product-oriented (testing samples via HPLC, dissolution to check compliance); QA (Quality Assurance) is process-oriented (designing systems, SOPs, audits, and validations to prevent defects).' }
    ],
    relatedSkills: ['pharmaceutical-quality-control', 'gmp-manufacturing', 'regulatory-affairs', 'pharmacovigilance']
  },
  {
    slug: 'pharmaceutical-quality-control',
    title: 'Pharmaceutical Quality Control (QC)',
    category: 'pharma',
    domainSlug: 'pharma-healthcare-life-sciences',
    categoryLabel: 'Pharmacy & Healthcare',
    shortDesc: 'Perform analytical testing of raw materials, in-process samples, and finished dosage forms using HPLC, GC, and UV-Vis.',
    longDesc: 'Pharmaceutical Quality Control (QC) is the analytical laboratory powerhouse verifying drug purity, potency, and safety. Master High-Performance Liquid Chromatography (HPLC), Gas Chromatography (GC), UV-Vis Spectroscopy, Dissolution testing, stability studies, and pharmacopeial monographs (IP, USP, BP).',
    heroImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'Pharmaceutical Analytical QC Testing Workflow',
      caption: 'Sample login, chemical/chromatographic assay, instrument calibration, and Certificate of Analysis (CoA) generation.',
      imageUrl: '/images/concepts/concept-pharma-clinical.svg',
      keyPoints: [
        { label: 'Sample Login & LIMS', description: 'Receiving raw materials, API, and finished goods in Laboratory Information Management System.' },
        { label: 'HPLC / GC Assay', description: 'Chromatographic separation verifying active ingredient potency and related substances.' },
        { label: 'Dissolution & Physical QC', description: 'Testing tablet hardness, friability, disintegration, and dissolution release kinetics.' },
        { label: 'Certificate of Analysis (CoA)', description: 'Comparing empirical test data against USP/IP monograph specifications for release.' }
      ]
    },
    salaryRange: '₹3.6L – ₹10.0L LPA',
    minSalaryLPA: 3.6,
    maxSalaryLPA: 10.0,
    averageSalaryLPA: 6.5,
    timelineWeeks: '8 – 12 Weeks',
    hiringVolume: '22,000+ QC Lab Openings',
    experienceLevel: 'Fresher Friendly',
    topCities: ['Hyderabad', 'Ahmedabad', 'Mumbai', 'Baddi (HP)', 'Visakhapatnam', 'Pune', 'Goa'],
    tools: ['Waters / Agilent HPLC', 'Empower CDS Software', 'Gas Chromatography (GC)', 'LabX Dissolution', 'LabVantage LIMS'],
    keyHighlights: [
      'Core laboratory testing entry for B.Pharm, M.Pharm, B.Sc/M.Sc Chemistry graduates',
      'Hands-on expertise on million-dollar chromatography instrumentation',
      'Direct pathway into Analytical Method Development (ADL) and Formulation R&D'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Instrumental Chemistry & Pharmacopeial Standards',
        weeks: 'Weeks 1 - 4',
        topics: ['Indian Pharmacopoeia (IP), USP, and BP monographs: Structure and interpretation', 'UV-Visible Spectrophotometry, Karl Fischer titration (water content), and pH potentiometry', 'Physical testing: Tablet hardness, friability, disintegration time, and weight variation'],
        project: 'Execute and document physical and chemical quality analysis for an oral solid dosage formulation.'
      },
      {
        phase: 'Phase 2: HPLC, GC & Chromatography Data Systems',
        weeks: 'Weeks 5 - 8',
        topics: ['HPLC theory: Reverse phase vs normal phase, mobile phase prep, column selection (C18), and peak symmetry', 'Chromatographic Data Systems (Empower 3 / ChemStation): Sequence setup, baseline integration, and system suitability', 'Gas Chromatography (GC) for residual solvents (USP <467>) and headspace analysis'],
        project: 'Develop an HPLC Assay sequence with system suitability calculations (Theoretical plates, Resolution, %RSD).'
      },
      {
        phase: 'Phase 3: Stability Studies & Method Validation',
        weeks: 'Weeks 9 - 12',
        topics: ['ICH Q1A stability testing protocols (Accelerated, Intermediate, Long-Term chambers)', 'Analytical Method Validation (ICH Q2): Specificity, Linearity, Range, Accuracy, Precision, LOD, LOQ', 'Investigating Laboratory Out of Specification (OOS) analytical testing errors'],
        project: 'Write a full Analytical Method Validation Protocol (AMVP) for a multi-component generic assay.'
      }
    ],
    jobRoles: [
      { title: 'Quality Control Chemist / Analyst', salary: '₹3.5L – ₹6.0L', demand: 'Very High' },
      { title: 'Senior QC Executive / HPLC Specialist', salary: '₹6.0L – ₹10.5L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'What are the core parameters checked during HPLC System Suitability testing?',
        answer: 'System suitability verifies the instrument and method are operating reproducibly prior to sample analysis. Key parameters include: (1) %RSD of peak area (typically ≤ 2.0% for 5-6 replicate injections), (2) Theoretical Plates (N > 2000 for column efficiency), (3) Tailing Factor / Peak Symmetry (0.8 to 1.5), and (4) Resolution (Rs > 1.5 between adjacent peaks).'
      }
    ],
    faqs: [
      { question: 'What software is most important for QC chromatographers?', answer: 'Empower (Waters) and OpenLab / ChemStation (Agilent) are the global industry standard Chromatography Data Systems (CDS).' }
    ],
    relatedSkills: ['pharmaceutical-quality-assurance', 'gmp-manufacturing', 'regulatory-affairs']
  },
  {
    slug: 'pharmacovigilance',
    title: 'Pharmacovigilance & Drug Safety',
    category: 'pharma',
    domainSlug: 'pharma-healthcare-life-sciences',
    categoryLabel: 'Pharmacy & Healthcare',
    shortDesc: 'Process Individual Case Safety Reports (ICSRs), MedDRA coding, aggregate reports (PSUR), and signal detection for US FDA / EMA.',
    longDesc: 'Pharmacovigilance (PV) ensures post-marketing drug safety worldwide. Master Individual Case Safety Report (ICSR) triaging, MedDRA medical coding, narrative writing, causality assessment (WHO-UMC), aggregate reporting (PSUR/PBRER), and safety databases (Argus Safety).',
    heroImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'End-to-End Pharmacovigilance & ICSR Processing Pipeline',
      caption: 'Adverse event intake, triage, MedDRA coding, narrative generation, medical review, and regulatory e-submission.',
      imageUrl: '/images/concepts/concept-pharma-clinical.svg',
      keyPoints: [
        { label: 'Case Intake & Triage', description: 'Validating 4 criteria: Identifiable patient, reporter, suspect drug, and adverse event.' },
        { label: 'MedDRA Coding', description: 'Mapping clinical terms to System Organ Classes (SOC) and Preferred Terms (PT).' },
        { label: 'Narrative Authoring', description: 'Writing chronological clinical summaries highlighting onset, dechallenge, and rechallenge.' },
        { label: 'Safety Submissions', description: 'Expedited 15-day reporting to US FDA (FAERS), EMA (EudraVigilance), and CDSCO.' }
      ]
    },
    salaryRange: '₹4.2L – ₹14.0L LPA',
    minSalaryLPA: 4.2,
    maxSalaryLPA: 14.0,
    averageSalaryLPA: 8.5,
    timelineWeeks: '8 – 12 Weeks',
    hiringVolume: '18,000+ Openings across IT CROs & Pharma GCCs',
    experienceLevel: 'Fresher Friendly',
    topCities: ['Hyderabad', 'Bengaluru', 'Mumbai', 'Pune', 'Noida / Delhi NCR', 'Chennai'],
    tools: ['Oracle Argus Safety', 'ArisG', 'MedDRA Dictionary', 'WHO Drug Dictionary', 'EudraVigilance Portal'],
    keyHighlights: [
      'High-paying corporate IT-healthcare career track (Cognizant, TCS, Accenture, IQVIA, Novartis)',
      'Ideal career path for B.Pharm, M.Pharm, Pharm.D, MBBS, BDS, and Life Sciences graduates',
      'Strong international remote and MNC GCC consulting opportunities'
    ],
    syllabus: [
      {
        phase: 'Phase 1: PV Fundamentals, MedDRA & Case Triage',
        weeks: 'Weeks 1 - 4',
        topics: ['Introduction to Pharmacovigilance: History (Thalidomide disaster) and regulations (ICH E2A to E2F)', 'Valid ICSR criteria: Identifiable patient, identifiable reporter, suspect medicinal product, adverse event', 'MedDRA hierarchy: SOC, HLGT, HLT, PT, LLT and WHO Drug dictionary mapping'],
        project: 'Triage and code 20 complex multi-drug adverse event case reports in MedDRA.'
      },
      {
        phase: 'Phase 2: ICSR Processing & Narrative Writing in Argus Safety',
        weeks: 'Weeks 5 - 8',
        topics: ['Data entry workflow in Oracle Argus Safety: General, Patient, Product, Event, and Analysis tabs', 'Medical narrative writing: Chronological structure, lab findings, dechallenge/rechallenge analysis', 'Causality assessment methods (Naranjo Algorithm, WHO-UMC criteria) and Seriousness criteria'],
        project: 'Author 10 complete ICSR case narratives with causality assessment and 15-day expedited tagging.'
      },
      {
        phase: 'Phase 3: Aggregate Reporting, Signal Detection & Audits',
        weeks: 'Weeks 9 - 12',
        topics: ['Periodic Safety Update Reports (PSUR / PBRER) and Risk Management Plans (RMP)', 'Signal detection methodologies: Disproportionality analysis, PRR, and ROR metrics', 'Inspection readiness for US FDA, EMA, and Pharmacovigilance Programme of India (PvPI) audits'],
        project: 'Compile a Periodic Safety Aggregate Review Section and Signal Analysis Report.'
      }
    ],
    jobRoles: [
      { title: 'Drug Safety Associate / PV Scientist', salary: '₹4.0L – ₹7.5L', demand: 'Very High' },
      { title: 'Senior Drug Safety Officer / Medical Reviewer', salary: '₹8.0L – ₹15.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'What are the four mandatory minimum criteria for an Individual Case Safety Report (ICSR) to be valid?',
        answer: 'An ICSR is valid only when all four elements exist: (1) An identifiable patient (initials, age, gender), (2) An identifiable reporter (name, contact, qualification), (3) At least one suspect drug/medicinal product, and (4) At least one adverse event or fatal outcome.'
      }
    ],
    faqs: [
      { question: 'What is the standard expedited reporting timeline for a serious unexpected adverse drug reaction?', answer: 'Fatal or life-threatening serious unexpected suspected adverse reactions must be reported to health authorities (FDA/EMA) within 7 calendar days; all other serious unexpected cases within 15 calendar days.' }
    ],
    relatedSkills: ['drug-safety', 'clinical-research', 'clinical-data-management', 'medical-writing']
  },
  {
    slug: 'regulatory-affairs',
    title: 'Pharmaceutical Regulatory Affairs (RA)',
    category: 'pharma',
    domainSlug: 'pharma-healthcare-life-sciences',
    categoryLabel: 'Pharmacy & Healthcare',
    shortDesc: 'Compile eCTD dossiers, ANDA/DMF filings, post-approval changes, and manage US FDA, EMA, and CDSCO approvals.',
    longDesc: 'Pharmaceutical Regulatory Affairs (RA) bridges science, government law, and corporate strategy. Master Common Technical Document (CTD / eCTD) Modules 1–5, ANDA and DMF submissions, CDSCO Sugam filings, labelling regulations, and US FDA lifecycle compliance.',
    heroImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'Common Technical Document (eCTD) Regulatory Dossier Architecture',
      caption: 'Modules 1 through 5 compilation for global drug marketing authorization.',
      imageUrl: '/images/concepts/concept-pharma-clinical.svg',
      keyPoints: [
        { label: 'Module 1: Regional Info', description: 'Administrative forms, cover letters, and draft prescribing labels.' },
        { label: 'Module 2: Summaries', description: 'Executive Quality, Nonclinical, and Clinical Overviews.' },
        { label: 'Module 3: Quality (CMC)', description: 'Chemistry, Manufacturing, and Controls (API characterization, stability, method validation).' },
        { label: 'Modules 4 & 5: Safety & Clinical', description: 'Nonclinical study reports and Human Clinical Trial study reports (CSRs).' }
      ]
    },
    salaryRange: '₹4.8L – ₹16.0L LPA',
    minSalaryLPA: 4.8,
    maxSalaryLPA: 16.0,
    averageSalaryLPA: 9.5,
    timelineWeeks: '8 – 12 Weeks',
    hiringVolume: '14,000+ Openings in Top Pharma Export Houses',
    experienceLevel: 'Intermediate',
    topCities: ['Hyderabad', 'Mumbai', 'Ahmedabad', 'Bengaluru', 'Delhi NCR', 'Chennai', 'Pune'],
    tools: ['Lorenz docuBridge eCTD', 'Extedo eCTDmanager', 'CDSCO Sugam Portal', 'US FDA ESG Gateway', 'Veeva Vault RIM'],
    keyHighlights: [
      'High-prestige corporate career track driving multi-million dollar global drug launches',
      'India supplies over 40% of generic formulations to the US and Europe',
      'Direct interaction with international health authorities and corporate C-suite'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Global Drug Regulatory Frameworks & CTD Structure',
        weeks: 'Weeks 1 - 4',
        topics: ['Overview of US FDA (CDER), EMA, PMDA (Japan), and India CDSCO / DCGI regulatory pathways', 'Investigational New Drug (IND), New Drug Application (NDA), and Abbreviated New Drug Application (ANDA)', 'The ICH Common Technical Document (CTD) 5-module hierarchy and electronic eCTD XML specifications'],
        project: 'Compile Module 1 and Module 2 administrative and quality summaries for a generic drug dossier.'
      },
      {
        phase: 'Phase 2: Chemistry, Manufacturing & Controls (CMC) & DMF',
        weeks: 'Weeks 5 - 8',
        topics: ['Module 3 Quality (CMC) writing: Drug substance (3.2.S) and Drug product (3.2.P) details', 'Drug Master File (DMF) Type II compilation, open and closed part structures, and Letters of Access', 'Post-approval lifecycle management: Supplements (PAS, CBE-30, CBE-0), Annual Reports, and Variations'],
        project: 'Author a complete 3.2.P.5 Control of Drug Product specification and stability summary section.'
      },
      {
        phase: 'Phase 3: eCTD Publishing, Query Responses & CDSCO',
        weeks: 'Weeks 9 - 12',
        topics: ['eCTD publishing software, hyperlinking, bookmarking, and validation error resolution', 'Handling and drafting technical responses to US FDA Complete Response Letters (CRL) and deficiency queries', 'India CDSCO: Sugam portal registrations, Form 44, New Drugs & Clinical Trials Rules 2019'],
        project: 'Publish and validate a complete electronic eCTD sequence using standard XML validation tools.'
      }
    ],
    jobRoles: [
      { title: 'Regulatory Affairs Associate / Specialist', salary: '₹4.5L – ₹8.5L', demand: 'Very High' },
      { title: 'Senior Regulatory Manager / Lead (US/EU Markets)', salary: '₹9.0L – ₹18.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'What is the structure of the ICH Common Technical Document (CTD) and what does Module 3 contain?',
        answer: 'The CTD is organized into 5 Modules: Module 1 is Regional Administrative Information; Module 2 contains CTD Summaries; Module 3 contains Quality (Chemistry, Manufacturing, and Controls - CMC for Drug Substance and Drug Product); Module 4 contains Nonclinical Study Reports; and Module 5 contains Clinical Study Reports.'
      }
    ],
    faqs: [
      { question: 'What is a DMF (Drug Master File)?', answer: 'A DMF is a confidential submission to the FDA containing proprietary chemistry and manufacturing details for an Active Pharmaceutical Ingredient (API), referenced by drug product manufacturers via a Letter of Authorization (LoA).' }
    ],
    relatedSkills: ['pharmaceutical-quality-assurance', 'clinical-research', 'medical-writing', 'drug-safety']
  },
  {
    slug: 'drug-safety',
    title: 'Drug Safety & Risk Management',
    category: 'pharma',
    domainSlug: 'pharma-healthcare-life-sciences',
    categoryLabel: 'Pharmacy & Healthcare',
    shortDesc: 'Design Risk Evaluation and Mitigation Strategies (REMS), Benefit-Risk Assessments, and Safety Governance.',
    longDesc: 'Drug Safety & Risk Management goes beyond individual case processing to holistic lifecycle risk governance. Master Risk Management Plans (RMP), FDA REMS, epidemiological signal validation, safety data sheets, and therapeutic benefit-risk profiling.',
    heroImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'Pharmaceutical Lifecycle Risk Management Architecture',
      caption: 'Pre-clinical toxicology, clinical trial safety monitoring, and post-marketing risk minimization.',
      imageUrl: '/images/concepts/concept-pharma-clinical.svg',
      keyPoints: [
        { label: 'Safety Risk Characterization', description: 'Identifying important identified risks, potential risks, and missing information.' },
        { label: 'Pharmacovigilance Plan', description: 'Active surveillance studies and targeted questionnaires.' },
        { label: 'Risk Minimization Measures', description: 'Black box warnings, educational brochures, and controlled distribution.' },
        { label: 'Benefit-Risk Re-evaluation', description: 'Continuous quantitative benefit-harm balance modeling.' }
      ]
    },
    salaryRange: '₹5.0L – ₹15.0L LPA',
    minSalaryLPA: 5.0,
    maxSalaryLPA: 15.0,
    averageSalaryLPA: 9.0,
    timelineWeeks: '8 – 10 Weeks',
    hiringVolume: '12,000+ Openings',
    experienceLevel: 'Intermediate',
    topCities: ['Hyderabad', 'Bengaluru', 'Mumbai', 'Pune', 'Delhi NCR'],
    tools: ['Oracle Argus Safety', 'R Studio for Pharmacoepidemiology', 'Veeva Safety', 'FDA REMS Guidelines'],
    keyHighlights: [
      'High-impact clinical decision-making preventing market withdrawals and protecting patients',
      'Expanding demand across Global Capability Centers (Novartis, AstraZeneca, GSK, Pfizer)',
      'Direct career path to Global Safety Physician and Risk Management Director'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Risk Assessment & EU-RMP Compilation',
        weeks: 'Weeks 1 - 4',
        topics: ['ICH E2E Pharmacovigilance Planning and EU-GVP Module V (Risk Management Systems)', 'Characterizing Safety Profiles: Identified risks, potential risks, and missing information', 'Writing EU Risk Management Plans (RMP) Parts I through VI'],
        project: 'Author an EU Risk Management Plan (RMP) for an innovative biologic or high-risk oral therapeutic.'
      },
      {
        phase: 'Phase 2: US FDA REMS & Active Safety Surveillance',
        weeks: 'Weeks 5 - 8',
        topics: ['US FDA Risk Evaluation and Mitigation Strategies (REMS) components and implementation', 'Pharmacoepidemiological study designs: Cohort, case-control, and registry studies', 'Signal detection algorithms (Empirical Bayes, MGPS, Information Component)'],
        project: 'Design a Complete FDA REMS Program with Elements to Assure Safe Use (ETASU).'
      }
    ],
    jobRoles: [
      { title: 'Drug Safety Physician / Risk Management Specialist', salary: '₹6.0L – ₹12.0L', demand: 'High' },
      { title: 'Global Safety Lead / Director', salary: '₹14.0L – ₹26.0L', demand: 'Moderate' }
    ],
    interviewQuestions: [
      {
        question: 'What is the purpose of an EU-RMP (Risk Management Plan)?',
        answer: 'An EU-RMP identifies and characterizes the safety profile of a medicinal product, documents how its risks will be monitored post-approval (pharmacovigilance plan), describes proactive risk minimization measures to reduce patient harm, and establishes metrics to evaluate the effectiveness of those measures.'
      }
    ],
    faqs: [
      { question: 'Who is eligible for Drug Safety roles?', answer: 'MBBS, BDS, Pharm.D, and M.Pharm graduates with strong medical pharmacology and clinical evaluation acumen.' }
    ],
    relatedSkills: ['pharmacovigilance', 'regulatory-affairs', 'clinical-research', 'medical-writing']
  },
  {
    slug: 'clinical-research',
    title: 'Clinical Research & Trials Management',
    category: 'pharma',
    domainSlug: 'pharma-healthcare-life-sciences',
    categoryLabel: 'Pharmacy & Healthcare',
    shortDesc: 'Conduct Phase I–IV human trials, site monitoring (CRA), GCP compliance, and Institutional Ethics Committee approvals.',
    longDesc: 'Clinical Research brings breakthrough therapies to human medicine. Master Phase I–IV trial design, Good Clinical Practice (ICH-GCP E6 R2), Clinical Research Associate (CRA) site monitoring visits (SIV, IMV, COV), patient informed consent, and electronic Trial Master Files (eTMF).',
    heroImage: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'Clinical Trial Phases & Site Monitoring Lifecycle',
      caption: 'Protocol design, Ethics approval, Site Initiation, Interim Monitoring, and Study Closeout.',
      imageUrl: '/images/concepts/concept-pharma-clinical.svg',
      keyPoints: [
        { label: 'Trial Protocol & Ethics Approval', description: 'Securing Institutional Ethics Committee (IEC) and DCGI regulatory permissions.' },
        { label: 'Site Initiation & Informed Consent', description: 'Training site investigators, verifying source documentation and consent integrity.' },
        { label: 'Interim Monitoring (IMV)', description: '100% Source Document Verification (SDV) for primary endpoints and SAEs.' },
        { label: 'Closeout & Clinical Study Report', description: 'Database lock, drug reconciliation, and final CSR publication.' }
      ]
    },
    salaryRange: '₹4.0L – ₹13.0L LPA',
    minSalaryLPA: 4.0,
    maxSalaryLPA: 13.0,
    averageSalaryLPA: 8.0,
    timelineWeeks: '8 – 12 Weeks',
    hiringVolume: '16,000+ CRO & Hospital Openings',
    experienceLevel: 'Fresher Friendly',
    topCities: ['Bengaluru', 'Hyderabad', 'Mumbai', 'Delhi NCR', 'Pune', 'Ahmedabad', 'Chennai'],
    tools: ['Veeva eTMF', 'Medidata Rave', 'Oracle Clinical', 'ICH-GCP Guidelines', 'EDC Systems'],
    keyHighlights: [
      'India is a major global hub for Contract Research Organizations (IQVIA, Syneos, Fortrea, Parexel)',
      'High growth from Clinical Research Coordinator (CRC) to Clinical Research Associate (CRA) and Project Manager',
      'Directly responsible for testing life-saving cancer, cardiovascular, and rare disease therapies'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Drug Development Pipeline & ICH-GCP Guidelines',
        weeks: 'Weeks 1 - 4',
        topics: ['Clinical trial phases: Phase I (Safety/PK), Phase II (Proof of Concept), Phase III (Efficacy), Phase IV (Post-marketing)', 'ICH-GCP E6(R2) principles, Declaration of Helsinki, and Indian New Drugs & Clinical Trials Rules 2019', 'Informed Consent Process (ICF), vulnerable population safeguards, and Ethics Committee submissions'],
        project: 'Develop an Informed Consent Form (ICF) and Clinical Trial Protocol synopsis.'
      },
      {
        phase: 'Phase 2: Site Management & Monitoring Visits (CRA Workflows)',
        weeks: 'Weeks 5 - 8',
        topics: ['Executing Pre-Study Visits (PSV), Site Initiation Visits (SIV), and Routine Monitoring (IMV)', 'Source Data Verification (SDV), Case Report Form (CRF) review, and query resolution', 'Investigational Product (IP) accountability, temperature logs, and Serious Adverse Event (SAE) reporting'],
        project: 'Write a comprehensive Clinical Monitoring Trip Report and Protocol Deviation Log.'
      },
      {
        phase: 'Phase 3: eTMF, Audits & Study Closeout',
        weeks: 'Weeks 9 - 12',
        topics: ['Electronic Trial Master File (eTMF) Reference Model and essential document management', 'Database lock procedures, Site Closeout Visits (COV), and clinical trial archiving', 'Preparing clinical trial sites for US FDA, EMA, and DCGI regulatory inspections'],
        project: 'Build an Essential Document eTMF Folder Structure and Inspection-Ready Audit Checklist.'
      }
    ],
    jobRoles: [
      { title: 'Clinical Research Coordinator (CRC)', salary: '₹3.5L – ₹6.0L', demand: 'Very High' },
      { title: 'Clinical Research Associate (CRA / Monitor)', salary: '₹6.0L – ₹12.0L', demand: 'High' },
      { title: 'Clinical Project Manager / Trial Lead', salary: '₹12.0L – ₹22.0L', demand: 'Moderate' }
    ],
    interviewQuestions: [
      {
        question: 'What are the core responsibilities of a Clinical Research Associate (CRA) during an Interim Monitoring Visit?',
        answer: 'A CRA verifies that the trial is conducted according to the approved protocol and GCP, performs Source Data Verification (SDV) comparing medical records against CRFs, audits Investigational Product accountability and storage, ensures all SAEs were reported within 24 hours, and reviews the Investigator Site File (ISF).'
      }
    ],
    faqs: [
      { question: 'What is the career transition path from CRC to CRA?', answer: 'Professionals typically spend 1–2 years as an on-site Clinical Research Coordinator (CRC) managing patient visits and data entry before stepping up into a multi-site monitoring CRA role at a CRO.' }
    ],
    relatedSkills: ['clinical-data-management', 'pharmacovigilance', 'medical-writing', 'regulatory-affairs']
  },
  {
    slug: 'clinical-data-management',
    title: 'Clinical Data Management (CDM)',
    category: 'pharma',
    domainSlug: 'pharma-healthcare-life-sciences',
    categoryLabel: 'Pharmacy & Healthcare',
    shortDesc: 'Design electronic CRFs (eCRF), edit checks, query management, and SDTM database lock in Medidata Rave and Oracle InForm.',
    longDesc: 'Clinical Data Management (CDM) ensures clinical trial data is complete, clean, and regulatory-ready. Master Electronic Data Capture (EDC - Medidata Rave, Oracle InForm), Data Management Plans (DMP), electronic CRF (eCRF) design, automated edit check validation, medical coding (MedDRA/WHODrug), and CDISC SDTM standards.',
    heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'Clinical Data Management (CDM) Data Pipeline',
      caption: 'eCRF design, EDC data entry, automated discrepancy check, medical coding, and final database lock.',
      imageUrl: '/images/concepts/concept-pharma-clinical.svg',
      keyPoints: [
        { label: 'eCRF Build & UAT', description: 'Designing electronic Case Report Forms and validating user acceptance testing.' },
        { label: 'Automated Edit Checks', description: 'Programmed validation rules detecting out-of-range, missing, or contradictory data.' },
        { label: 'Query Management & Discrepancies', description: 'Issuing data queries to clinical sites and tracking timely resolution.' },
        { label: 'CDISC SDTM & Database Lock', description: 'Mapping raw clinical data into CDISC SDTM domains for FDA statistical review.' }
      ]
    },
    salaryRange: '₹4.5L – ₹14.0L LPA',
    minSalaryLPA: 4.5,
    maxSalaryLPA: 14.0,
    averageSalaryLPA: 8.8,
    timelineWeeks: '8 – 12 Weeks',
    hiringVolume: '15,000+ Openings in CROs & IT Tech Giants',
    experienceLevel: 'Fresher Friendly',
    topCities: ['Bengaluru', 'Hyderabad', 'Mumbai', 'Pune', 'Noida / Delhi NCR', 'Chennai'],
    tools: ['Medidata Rave EDC', 'Oracle InForm', 'Oracle Clinical', 'CDISC SDTM Standards', 'JReview', 'SAS for CDM'],
    keyHighlights: [
      'Desk-based IT-healthcare career track with strong work-life balance and hybrid options',
      'Employed by global CROs (IQVIA, Parexel, Syneos) and IT powerhouses (Cognizant, TCS, Wipro)',
      'Direct stepping stone into CDISC SAS Programming and Biostatistics'
    ],
    syllabus: [
      {
        phase: 'Phase 1: CDM Lifecycle & eCRF Design',
        weeks: 'Weeks 1 - 4',
        topics: ['Data Management Plan (DMP) authoring and GCDMP (Good Clinical Data Management Practice)', 'Designing electronic Case Report Forms (eCRF) aligned with clinical trial protocol endpoints', 'Authoring Edit Check Specifications (range checks, date logic, cross-form consistency)'],
        project: 'Create a complete Data Management Plan (DMP) and eCRF Specification Document.'
      },
      {
        phase: 'Phase 2: EDC Operations, Query Management & Medical Coding',
        weeks: 'Weeks 5 - 8',
        topics: ['Data entry, source document verification flags, and discrepancy management in Medidata Rave', 'Issuing, tracking, and resolving manual and automated data queries with clinical investigator sites', 'Medical coding workflows: Adverse events in MedDRA and concomitant medications in WHO-Drug'],
        project: 'Execute query management and discrepancy resolution across 50 simulated clinical trial patient visits.'
      },
      {
        phase: 'Phase 3: External Data Reconciliation, CDISC & Database Lock',
        weeks: 'Weeks 9 - 12',
        topics: ['Reconciling central lab data, ECG, pharmacokinetic, and SAE databases with EDC records', 'Overview of CDISC standards: CDASH (data capture) and SDTM (submission data models)', 'Final Data Quality Review, Blind Review, and formal Database Lock (DBL) execution'],
        project: 'Perform end-to-end SAE reconciliation, blind data review, and execute a formal Database Lock drill.'
      }
    ],
    jobRoles: [
      { title: 'Clinical Data Associate / Coordinator', salary: '₹4.0L – ₹7.5L', demand: 'Very High' },
      { title: 'Senior Clinical Data Manager (CDM Lead)', salary: '₹8.0L – ₹15.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'What are the prerequisite criteria required before executing a final Clinical Database Lock (DBL)?',
        answer: 'Prerequisites include: (1) 100% data entry completed and verified, (2) All manual and automated queries resolved and closed, (3) 100% medical coding approved for adverse events and concomitant medications, (4) External lab and SAE reconciliation completed with zero discrepancies, (5) Protocol deviations finalized, and (6) Formal sign-off by the Principal Investigator, Biostatistician, and CDM Lead.'
      }
    ],
    faqs: [
      { question: 'What is CDISC SDTM?', answer: 'CDISC SDTM (Study Data Tabulation Model) is the mandatory standardized data structure required by the US FDA and PMDA Japan for submitting human clinical trial data in electronic format.' }
    ],
    relatedSkills: ['clinical-research', 'pharmacovigilance', 'healthcare-data-analytics', 'medical-writing']
  },
  {
    slug: 'gmp-manufacturing',
    title: 'Pharmaceutical Manufacturing & GMP Operations',
    category: 'pharma',
    domainSlug: 'pharma-healthcare-life-sciences',
    categoryLabel: 'Pharmacy & Healthcare',
    shortDesc: 'Operate tablet compression, sterile vial filling, granulators, and HVAC cleanrooms under WHO and US FDA cGMP standards.',
    longDesc: 'Pharmaceutical Manufacturing translates drug discoveries into billions of high-quality dosage forms. Master solid oral dosage processing (granulation, compression, coating), sterile injectables (aseptic filling, lyophilization), HVAC cleanroom air handling (AHU), water systems (Purified Water, WFI), and Schedule M compliance.',
    heroImage: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'Solid Oral & Sterile Manufacturing Facility Architecture',
      caption: 'Dispensing, granulation, compression, coating, blister packaging, and cleanroom air handling.',
      imageUrl: '/images/concepts/concept-pharma-clinical.svg',
      keyPoints: [
        { label: 'Granulation & Fluid Bed Drying', description: 'Transforming fine API and excipient powders into uniform granules (RMixer & FBD).' },
        { label: 'High-Speed Tablet Compression', description: 'Rotary tablet presses controlling hardness, thickness, and weight uniformity.' },
        { label: 'Aseptic Injectable Filling', description: 'Class A Laminar Air Flow filling lines, depyrogenation tunnels, and lyophilization.' },
        { label: 'Water & HVAC Utility Systems', description: 'Generating Water for Injection (WFI), Pure Steam, and HEPA air balance.' }
      ]
    },
    salaryRange: '₹3.5L – ₹11.0L LPA',
    minSalaryLPA: 3.5,
    maxSalaryLPA: 11.0,
    averageSalaryLPA: 7.0,
    timelineWeeks: '8 – 12 Weeks',
    hiringVolume: '24,000+ Plant Openings',
    experienceLevel: 'Fresher Friendly',
    topCities: ['Hyderabad', 'Ahmedabad', 'Baddi (HP)', 'Visakhapatnam', 'Mumbai', 'Pune', 'Goa', 'Sikkim'],
    tools: ['SCADA Manufacturing Systems', 'Rotary Tablet Presses', 'Fluid Bed Dryers (FBD)', 'WFI Generation Systems', 'SAP PP Module'],
    keyHighlights: [
      'India is the "Pharmacy of the World", producing over 60% of global vaccines and 20% of generic formulations',
      'Massive employment scale across major pharma manufacturing belts (Telangana, Gujarat, HP, Maharashtra)',
      'High growth trajectory into Production Executive, Plant Head, and Operations VP'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Solid Dosage Formulation & Equipment Operations',
        weeks: 'Weeks 1 - 4',
        topics: ['Unit operations: Sifting, Rapid Mixer Granulation (RMG), Fluid Bed Drying (FBD), and Milling', 'Rotary tablet compression machine tooling (D, B, BB tooling), weight control, and hardness parameters', 'Film and enteric tablet coating pan operations (inlet/outlet air temp, spray rate, atomization pressure)'],
        project: 'Author a Batch Manufacturing Record (BMR) for a 500mg Paracetamol / Metformin formulation.'
      },
      {
        phase: 'Phase 2: Sterile Injectables, Cleanrooms & Utilities',
        weeks: 'Weeks 5 - 8',
        topics: ['Cleanroom classifications (ISO 5 to ISO 8 / Grade A-D) and air differential pressure cascades', 'Aseptic filling lines, depyrogenation tunnels, sterile filtration (0.22 micron), and lyophilization', 'Pharmaceutical water systems: Reverse Osmosis (RO), Continuous Deionization (EDI), and WFI loops'],
        project: 'Design an HVAC Cleanroom Airflow Differential Pressure Layout and Aseptic Media Fill Protocol.'
      },
      {
        phase: 'Phase 3: GMP Audits, Packaging & Plant Safety',
        weeks: 'Weeks 9 - 12',
        topics: ['Primary and secondary blister packaging lines, serialization, and 2D barcode track-and-trace', 'Line clearance SOPs, cross-contamination prevention, and cleaning validation limits (10 ppm rule)', 'Preparing for US FDA, WHO, and Schedule M Revised 2024 manufacturing inspections'],
        project: 'Create a Comprehensive Line Clearance & Cleaning Validation SOP for a multi-product facility.'
      }
    ],
    jobRoles: [
      { title: 'Production Officer / Manufacturing Executive', salary: '₹3.5L – ₹6.5L', demand: 'Very High' },
      { title: 'Plant Production Manager / Section Head', salary: '₹7.5L – ₹14.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'Why is air differential pressure maintained between adjacent cleanroom corridors and manufacturing cubicles?',
        answer: 'Differential pressure ensures that air always flows from cleaner areas to less clean areas, preventing airborne cross-contamination. For non-potent oral solid dosage rooms, the corridor is kept at positive pressure relative to the processing cubicle (containment), whereas for sterile aseptic rooms, the Grade A/B filling zone is kept at the highest positive pressure to keep contaminants out.'
      }
    ],
    faqs: [
      { question: 'What is Schedule M Revised in India?', answer: 'Revised Schedule M (2024) mandates updated Good Manufacturing Practices (GMP) aligning Indian domestic pharma manufacturing with WHO and international PIC/S quality standards.' }
    ],
    relatedSkills: ['pharmaceutical-quality-assurance', 'pharmaceutical-quality-control', 'regulatory-affairs']
  },
  {
    slug: 'pharmaceutical-sales-marketing',
    title: 'Pharmaceutical Sales & Brand Management',
    category: 'pharma',
    domainSlug: 'pharma-healthcare-life-sciences',
    categoryLabel: 'Pharmacy & Healthcare',
    shortDesc: 'Master physician detailing, Key Opinion Leader (KOL) engagement, medical marketing, and pharma brand launching.',
    longDesc: 'Pharmaceutical Sales & Brand Management drives market adoption of life-saving and chronic therapeutic medicines. Master doctor detailing, scientific visual aid presentation, Key Opinion Leader (KOL) advisory boards, CME conference execution, territory sales analytics, and digital omnichannel marketing.',
    heroImage: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'Pharmaceutical Brand Launch & Physician Detailing Cycle',
      caption: 'KOL discovery, clinical visual aid detailing, prescription tracking, and CME conference execution.',
      imageUrl: '/images/concepts/concept-pharma-clinical.svg',
      keyPoints: [
        { label: 'Scientific Detailing', description: 'Presenting head-to-head clinical efficacy data to doctors within 3 minutes.' },
        { label: 'KOL Advisory Boards', description: 'Collaborating with leading super-specialists for clinical consensus guidelines.' },
        { label: 'Territory Sales Analytics', description: 'Auditing secondary sales, stockist orders, and chemist prescription audits (RCPA).' },
        { label: 'Digital Omnichannel Reach', description: 'Deploying webinars, clinical podcasts, and digital medical portals for doctors.' }
      ]
    },
    salaryRange: '₹3.5L – ₹12.0L LPA',
    minSalaryLPA: 3.5,
    maxSalaryLPA: 12.0,
    averageSalaryLPA: 7.2,
    timelineWeeks: '4 – 8 Weeks',
    hiringVolume: '35,000+ Openings across India',
    experienceLevel: 'Fresher Friendly',
    topCities: ['Pan-India', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Ahmedabad', 'Bengaluru', 'Kolkata', 'Chennai'],
    tools: ['Veeva CRM for Pharma', 'Salesforce Health Cloud', 'IQVIA Secondary Sales Data', 'Canva for Medical Decks'],
    keyHighlights: [
      'Huge volume entry point with attractive daily allowances, company vehicles, and uncapped quarterly incentives',
      'Direct pathway from Medical Representative (MR) to Area Manager, Product Manager (PMT), and Marketing Director',
      'Combines medical science knowledge with high-stakes commercial persuasion'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Pharmacology Detailing & Physician Communication',
        weeks: 'Weeks 1 - 3',
        topics: ['Converting clinical trial data (p-values, hazard ratios) into compelling 3-minute doctor visual aids', 'Handling physician objections on pricing, efficacy, and competitor brand loyalty', 'Retail Chemist Prescription Audit (RCPA) methodology to identify prescribing patterns'],
        project: 'Execute and record a 3-minute Scientific Detailing Presentation for a novel anti-diabetic brand.'
      },
      {
        phase: 'Phase 2: Product Management & Brand Launch Strategy',
        weeks: 'Weeks 4 - 7',
        topics: ['Conducting brand positioning, market segmentation, and competitor pricing strategy', 'Organizing Continuing Medical Education (CME) seminars and Advisory Board symposia', 'Deploying Veeva CRM for territory coverage, call average metrics, and omnichannel doctor engagement'],
        project: 'Develop a Complete 12-Month Marketing & Brand Launch Plan for a Cardiology/Oncology formulation.'
      }
    ],
    jobRoles: [
      { title: 'Medical Representative (MR) / Territory Manager', salary: '₹3.5L – ₹6.0L + Incentives', demand: 'Very High' },
      { title: 'Product Executive / Brand Manager (PMT)', salary: '₹7.0L – ₹14.0L', demand: 'High' },
      { title: 'Marketing Head / Business Unit Director', salary: '₹15.0L – ₹30.0L', demand: 'Moderate' }
    ],
    interviewQuestions: [
      {
        question: 'What is an RCPA (Retail Chemist Prescription Audit) and why is it essential for a pharmaceutical sales professional?',
        answer: 'RCPA is the practice of surveying pharmacies located near targeted doctors to discover which competing brands they prescribe, in what volumes, and for which indications. This intelligence allows the medical representative to tailor their detailing pitch to directly address the specific clinical reasons preventing the doctor from prescribing their brand.'
      }
    ],
    faqs: [
      { question: 'Do I need a science degree to become a Medical Representative?', answer: 'While B.Pharm, D.Pharm, and B.Sc graduates are strongly preferred, graduates in any stream with excellent scientific communication, confidence, and commercial drive are frequently hired.' }
    ],
    relatedSkills: ['pharmacy-practice', 'community-pharmacy', 'medical-writing']
  },
  {
    slug: 'medical-writing',
    title: 'Medical Writing & Clinical Documentation',
    category: 'pharma',
    domainSlug: 'pharma-healthcare-life-sciences',
    categoryLabel: 'Pharmacy & Healthcare',
    shortDesc: 'Author Clinical Study Reports (CSRs), Investigator Brochures (IB), clinical protocols, and peer-reviewed journal manuscripts.',
    longDesc: 'Medical Writing translates complex clinical data into clear, regulatory-compliant documentation and medical publications. Master ICH E3 Clinical Study Reports (CSR), Investigator Brochures (IB), clinical protocols, Patient Information Leaflets (PIL), and peer-reviewed manuscripts for high-impact journals (ICMJE standards).',
    heroImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'Regulatory & Medico-Marketing Writing Pipeline',
      caption: 'Protocol synopsis, Investigator Brochure, Clinical Study Report (CSR), and peer-reviewed manuscript.',
      imageUrl: '/images/concepts/concept-pharma-clinical.svg',
      keyPoints: [
        { label: 'ICH E3 CSR Authoring', description: 'Writing efficacy and safety study narratives for regulatory submissions.' },
        { label: 'Investigator Brochure (IB)', description: 'Compiling pre-clinical and clinical data for trial investigators.' },
        { label: 'Plain Language Summaries', description: 'Translating trial results into patient-friendly summaries.' },
        { label: 'ICMJE Journal Manuscripts', description: 'Authoring PubMed-indexed papers following CONSORT and PRISMA reporting guidelines.' }
      ]
    },
    salaryRange: '₹5.0L – ₹16.0L LPA',
    minSalaryLPA: 5.0,
    maxSalaryLPA: 16.0,
    averageSalaryLPA: 9.8,
    timelineWeeks: '8 – 12 Weeks',
    hiringVolume: '14,000+ Openings across CROs & Global Pharma',
    experienceLevel: 'Intermediate',
    topCities: ['Bengaluru', 'Hyderabad', 'Mumbai', 'Noida / Delhi NCR', 'Pune', 'Remote'],
    tools: ['EndNote / Mendeley', 'StartingPoint CSR Templates', 'PleaseReview Document Collab', 'PubMed / Embase', 'Grammarly Pro'],
    keyHighlights: [
      'High-paying remote-friendly desk career for Pharm.D, MBBS, BDS, M.Pharm, and PhD Life Sciences graduates',
      'Employed across global MNC medical writing divisions (Novartis, Pfizer, IQVIA, Cactus Communications)',
      'Direct contribution to global peer-reviewed clinical literature and drug approvals'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Regulatory Clinical Writing (CSR, Protocol, IB)',
        weeks: 'Weeks 1 - 4',
        topics: ['ICH E3 guidelines for Clinical Study Reports (CSR): Structure, efficacy endpoints, safety narratives', 'Authoring Investigator Brochures (IB) and Clinical Trial Protocols (ICH E6)', 'Interpreting Statistical Analysis Plans (SAP) and clinical summary tables/figures/listings (TFLs)'],
        project: 'Author a complete 15-page Clinical Study Report (CSR) Safety & Adverse Events section from raw TFLs.'
      },
      {
        phase: 'Phase 2: Scientific Publications & Medico-Marketing',
        weeks: 'Weeks 5 - 8',
        topics: ['ICMJE guidelines, CONSORT statement for clinical trials, and PRISMA for systematic reviews', 'Authoring peer-reviewed manuscripts, abstracts, poster presentations, and journal submission response letters', 'Creating patient education brochures, Clinical Summary Overviews, and Continuing Medical Education (CME) slides'],
        project: 'Write a full PubMed-formatted Clinical Research Manuscript with abstract, methods, and discussion.'
      }
    ],
    jobRoles: [
      { title: 'Medical Writer (Regulatory / Publication)', salary: '₹5.0L – ₹9.5L', demand: 'Very High' },
      { title: 'Senior Medical Writer / Scientific Communications Lead', salary: '₹10.0L – ₹18.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'What are the main sections required in an ICH E3 Clinical Study Report (CSR)?',
        answer: 'An ICH E3 CSR includes: Title Page, Synopsis, Table of Contents, List of Abbreviations, Ethics, Investigators and Administrative Structure, Introduction, Study Objectives, Investigational Plan, Study Patients (disposition, demographics), Efficacy Evaluation, Safety Evaluation (adverse events, deaths, lab values), Discussion and Overall Conclusions, and Tables/Figures/Patient Data Listings.'
      }
    ],
    faqs: [
      { question: 'What is the difference between Regulatory Medical Writing and Scientific Publications?', answer: 'Regulatory writing produces official submission dossiers for health authorities (CSRs, Protocols, IBs); Scientific publication writing produces manuscripts and conference abstracts for medical journals and physicians.' }
    ],
    relatedSkills: ['clinical-research', 'pharmacovigilance', 'regulatory-affairs', 'clinical-data-management']
  },
  {
    slug: 'pharmacy-inventory-management',
    title: 'Pharmacy Inventory & Supply Chain Management',
    category: 'pharma',
    domainSlug: 'pharma-healthcare-life-sciences',
    categoryLabel: 'Pharmacy & Healthcare',
    shortDesc: 'Optimize pharmaceutical stock levels, ABC/VED analysis, cold chain logistics, and distributor replenishment.',
    longDesc: 'Pharmacy Inventory Management prevents stockouts of critical medications while minimizing expired drug write-offs. Master ABC-VED inventory matrix analysis, Economic Order Quantity (EOQ), re-order level (ROL) calculations, cold-chain temperature validation (2–8°C), and distributor credit reconciliation.',
    heroImage: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'Pharmaceutical Supply Chain & Cold Chain Pipeline',
      caption: 'Manufacturer, C&F Agent, Stockist, Pharmacy Store, and Cold-Chain monitoring.',
      imageUrl: '/images/concepts/concept-pharma-clinical.svg',
      keyPoints: [
        { label: 'ABC-VED Matrix', description: 'Categorizing stock by value (ABC) and clinical criticality (Vital, Essential, Desirable).' },
        { label: 'EOQ & Reorder Levels', description: 'Balancing holding costs with purchase discounts to prevent stockouts.' },
        { label: 'Cold-Chain Logistics', description: 'Data loggers and Phase Change Material (PCM) boxes for vaccines and biologics.' },
        { label: 'Expiry & Return Management', description: 'Automated 90-day expiry alerts for stockist credit notes.' }
      ]
    },
    salaryRange: '₹3.5L – ₹8.5L LPA',
    minSalaryLPA: 3.5,
    maxSalaryLPA: 8.5,
    averageSalaryLPA: 5.8,
    timelineWeeks: '4 – 6 Weeks',
    hiringVolume: '18,000+ Openings',
    experienceLevel: 'Fresher Friendly',
    topCities: ['Hyderabad', 'Mumbai', 'Bengaluru', 'Delhi NCR', 'Ahmedabad', 'Chennai'],
    tools: ['Marg ERP Inventory', 'SAP MM Module', 'Excel Solver', 'LogTag Cold Chain Trackers'],
    keyHighlights: [
      'Crucial operational skill for hospital pharmacy networks and retail e-commerce warehouses',
      'Prevents high financial losses from expired medications and uncollected supplier credits',
      'Direct pathway to Supply Chain Manager and Central Warehouse Lead'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Inventory Categorization & Demand Forecasting',
        weeks: 'Weeks 1 - 3',
        topics: ['ABC Analysis (Annual value), VED Analysis (Vital, Essential, Desirable), and FSN (Fast, Slow, Non-moving)', 'Calculating Re-order Levels (ROL), Minimum Stock, Safety Stock, and Economic Order Quantity (EOQ)', 'Seasonal disease demand forecasting (monsoon dengue/malaria, winter respiratory meds)'],
        project: 'Build an ABC-VED Inventory Matrix and Automated ROL Calculator in Excel.'
      },
      {
        phase: 'Phase 2: Cold Chain Compliance & Expiry Return Workflows',
        weeks: 'Weeks 4 - 6',
        topics: ['Cold chain monitoring: 2°C to 8°C standards, deep freeze (-20°C), temperature data logger verification', 'Near-expiry stock management: FEFO (First Expired First Out) and automated distributor return credit notes', 'Warehouse storage zoning, humidity control, and physical stock count audit reconciliation'],
        project: 'Design an SOP for Cold-Chain Breakage Handling and 90-Day Expiry Return Reconciliation.'
      }
    ],
    jobRoles: [
      { title: 'Pharmacy Inventory Controller / Executive', salary: '₹3.5L – ₹6.0L', demand: 'Very High' },
      { title: 'Hospital Supply Chain / Materials Manager', salary: '₹7.0L – ₹13.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'How do you apply the ABC-VED matrix in a hospital pharmacy setting?',
        answer: 'By combining monetary value (A: high cost, B: moderate cost, C: low cost) with clinical criticality (V: vital for life support, E: essential, D: desirable). Category "AV" (high-cost, life-saving drugs like specialized oncology/monoclonal antibodies) requires strict executive control and daily stock verification, while "CD" items can be ordered in bulk with low monitoring.'
      }
    ],
    faqs: [
      { question: 'What is FEFO in pharmacy inventory?', answer: 'FEFO stands for "First Expired, First Out"—a mandatory inventory principle ensuring that stock batches with the closest expiration date are placed in front and dispensed first, regardless of when they arrived.' }
    ],
    relatedSkills: ['pharmacy-practice', 'hospital-pharmacy', 'community-pharmacy', 'supply-chain-analytics']
  },
  {
    slug: 'healthcare-data-analytics',
    title: 'Healthcare Data Analytics & Informatics',
    category: 'pharma',
    domainSlug: 'pharma-healthcare-life-sciences',
    categoryLabel: 'Pharmacy & Healthcare',
    shortDesc: 'Analyze Electronic Health Records (EHR), clinical outcomes, ICD-10 claims data, and hospital bed occupancy in SQL and Power BI.',
    longDesc: 'Healthcare Data Analytics transforms raw Electronic Health Records (EHR), insurance claims, and clinical trial datasets into actionable health insights. Master SQL for healthcare, ICD-10 / CPT billing analytics, 30-day readmission prediction, patient length of stay (LOS) modeling, and Power BI clinical dashboards.',
    heroImage: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'Healthcare Data & Clinical Informatics Pipeline',
      caption: 'EHR ingestion, FHIR standards, clinical data warehouse, and predictive patient analytics.',
      imageUrl: '/images/concepts/concept-pharma-clinical.svg',
      keyPoints: [
        { label: 'EHR & Claims Ingestion', description: 'Querying relational hospital databases, Epic/Cerner tables, and insurance claims.' },
        { label: 'Interoperability Standards', description: 'HL7 and FHIR (Fast Healthcare Interoperability Resources) data models.' },
        { label: 'Clinical KPI Modeling', description: 'Measuring Average Length of Stay (ALOS), bed turnover, infection rates, and mortality.' },
        { label: 'Predictive Risk Scoring', description: 'Machine learning algorithms flagging sepsis risk and 30-day hospital readmission.' }
      ]
    },
    salaryRange: '₹6.0L – ₹16.0L LPA',
    minSalaryLPA: 6.0,
    maxSalaryLPA: 16.0,
    averageSalaryLPA: 10.2,
    timelineWeeks: '8 – 12 Weeks',
    hiringVolume: '14,000+ Openings in Healthcare IT & GCCs',
    experienceLevel: 'Intermediate',
    topCities: ['Bengaluru', 'Hyderabad', 'Pune', 'Gurugram', 'Mumbai', 'Chennai', 'Remote'],
    tools: ['SQL (PostgreSQL/SQL Server)', 'Power BI / Tableau', 'Python (Pandas, Scikit-Learn)', 'HL7 / FHIR Standards', 'ICD-10-CM'],
    keyHighlights: [
      'High-paying tech-healthcare intersection with massive US Healthcare GCC demand (Optum, UnitedHealth, Cotiviti)',
      'Empowers healthcare leaders to improve clinical outcomes and reduce billions in claim rejections',
      'Direct stepping stone to Healthcare Chief Data Officer and Health Informatics Director'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Healthcare Relational Data & SQL Queries',
        weeks: 'Weeks 1 - 4',
        topics: ['Healthcare data architectures: EHR, Laboratory Information (LIS), Radiology (PACS), and Claims engines', 'Writing advanced SQL queries on patient encounters, medication orders, and ICD-10 diagnostic codes', 'HL7 v2 messages and modern FHIR JSON resource standards (Patient, Encounter, Observation)'],
        project: 'Build a Multi-Table SQL Database Query analyzing patient length of stay and medication costs on MIMIC-IV dataset.'
      },
      {
        phase: 'Phase 2: Clinical Quality Dashboards & Claims Analytics',
        weeks: 'Weeks 5 - 8',
        topics: ['Building hospital executive dashboards in Power BI: Bed occupancy, ER wait times, and infection metrics', 'Healthcare insurance claims analysis: Denial rate calculation, medical loss ratio (MLR), and fraud detection', 'Quality metrics: HEDIS measures, NABH clinical indicators, and hospital-acquired infection (HAI) tracking'],
        project: 'Create an Executive Hospital Clinical Performance & Bed Occupancy Power BI Dashboard.'
      },
      {
        phase: 'Phase 3: Predictive Clinical Analytics in Python',
        weeks: 'Weeks 9 - 12',
        topics: ['Exploratory data analysis on electronic health records with Python Pandas and Seaborn', 'Predictive classification modeling: Predicting 30-day heart failure readmission risk using Logistic Regression & XGBoost', 'HIPAA compliance, patient data de-identification (Safe Harbor method), and DPDP guidelines'],
        project: 'Train and evaluate a Machine Learning model predicting patient hospital readmission risk.'
      }
    ],
    jobRoles: [
      { title: 'Healthcare Data Analyst / Informatics Specialist', salary: '₹6.0L – ₹11.0L', demand: 'Very High' },
      { title: 'Senior Clinical Data Scientist', salary: '₹12.0L – ₹20.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'What is FHIR and why is it replacing legacy HL7 v2 for healthcare data exchange?',
        answer: 'FHIR (Fast Healthcare Interoperability Resources) is a modern, web-based standard created by HL7. It utilizes modular RESTful APIs and standardized JSON/XML data formats (e.g. Patient, Condition, Observation resources), making EHR data integration significantly faster and easier for mobile apps and cloud analytics compared to legacy pipe-delimited HL7 v2 messages.'
      }
    ],
    faqs: [
      { question: 'What background is ideal for healthcare analytics?', answer: 'Graduates in Pharmacy, Medicine, Biotechnology, Computer Science, or Data Analytics with strong SQL and healthcare domain knowledge.' }
    ],
    relatedSkills: ['clinical-data-management', 'data-analytics', 'hospital-administration', 'medical-writing']
  },
  {
    slug: 'hospital-administration',
    title: 'Hospital Administration & Healthcare Management',
    category: 'pharma',
    domainSlug: 'pharma-healthcare-life-sciences',
    categoryLabel: 'Pharmacy & Healthcare',
    shortDesc: 'Manage hospital operations, NABH accreditation, OT scheduling, patient billing, and biomedical engineering.',
    longDesc: 'Hospital Administration coordinates all operational, financial, and clinical support workflows across healthcare institutions. Master patient flow management, Emergency & Operation Theatre (OT) scheduling, NABH & JCI quality accreditation, insurance TPA billing, biomedical equipment maintenance, and clinical governance.',
    heroImage: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'Hospital Operational Infrastructure & Governance Loop',
      caption: 'Front office, OPD/IPD flow, OT scheduling, TPA insurance desk, and NABH quality compliance.',
      imageUrl: '/images/concepts/concept-pharma-clinical.svg',
      keyPoints: [
        { label: 'Patient Flow & Triage', description: 'Streamlining OPD queues, emergency admissions, and IPD bed allocations.' },
        { label: 'OT & ICU Optimization', description: 'Scheduling operating rooms, surgical supplies, and sterilizers to maximize utilization.' },
        { label: 'TPA & Cashless Claims', description: 'Pre-authorization, query settlement, and insurance discharge turnaround times.' },
        { label: 'NABH Quality & Safety Audits', description: 'Monitoring statutory hospital quality indicators and patient feedback.' }
      ]
    },
    salaryRange: '₹5.0L – ₹18.0L LPA',
    minSalaryLPA: 5.0,
    maxSalaryLPA: 18.0,
    averageSalaryLPA: 9.8,
    timelineWeeks: '8 – 12 Weeks',
    hiringVolume: '16,000+ Openings across Hospital Chains',
    experienceLevel: 'Intermediate',
    topCities: ['Bengaluru', 'Delhi NCR', 'Mumbai', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Kochi'],
    tools: ['Hospital Information Management Systems (HIMS)', 'NABH 5th Edition Standards', 'Excel for Healthcare Operations', 'TPA Insurance Portals'],
    keyHighlights: [
      'High-growth executive management track (MHA, MBA Healthcare, PGDHHM, Medical graduates)',
      'Essential leadership role across fast-expanding corporate hospital chains (Max, Apollo, Manipal, Fortis)',
      'High responsibility directing hundreds of clinical and non-clinical personnel'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Hospital Departments & Patient Flow Optimization',
        weeks: 'Weeks 1 - 4',
        topics: ['Front office operations: Patient registration, admission scheduling, and bed management', 'Outpatient Department (OPD) queue optimization, doctor scheduling, and Emergency Department triage', 'Operation Theatre (OT) utilization, CSSD sterilization logistics, and ICU bed management'],
        project: 'Develop a Complete Patient Flow & Emergency Department SOP for a 250-bed multi-specialty hospital.'
      },
      {
        phase: 'Phase 2: Insurance TPA Desk, Billing & Revenue Cycle',
        weeks: 'Weeks 5 - 8',
        topics: ['Revenue Cycle Management (RCM): Patient billing, tariff packages, and doctor payout calculation', 'Third-Party Administrator (TPA) cashless pre-authorization, claim query resolution, and denial appeals', 'Ayushman Bharat (PMJAY) and state government cashless scheme operational procedures'],
        project: 'Create an Insurance TPA & Revenue Cycle Optimization Model reducing claim rejection rates.'
      },
      {
        phase: 'Phase 3: NABH Accreditation, Quality Indicators & Biomedical',
        weeks: 'Weeks 9 - 12',
        topics: ['NABH 5th Edition hospital accreditation standards, key chapters, and continuous quality audits', 'Tracking core hospital quality indicators: Bed Occupancy Rate (BOR), ALOS, Medication errors, Return to ICU', 'Biomedical engineering maintenance (preventive maintenance, calibration, AMC contracts), and Biomedical Waste (BMW) rules'],
        project: 'Draft an institutional NABH Quality Audit Manual and Biomedical Waste Management Protocol.'
      }
    ],
    jobRoles: [
      { title: 'Assistant Hospital Administrator / Operations Executive', salary: '₹4.5L – ₹8.0L', demand: 'Very High' },
      { title: 'Hospital Operations Manager / Quality Manager', salary: '₹8.5L – ₹16.0L', demand: 'High' },
      { title: 'Chief Operating Officer (COO) / Medical Superintendent', salary: '₹18.0L – ₹35.0L', demand: 'Moderate' }
    ],
    interviewQuestions: [
      {
        question: 'How do you calculate and optimize the Average Length of Stay (ALOS) in a tertiary care hospital?',
        answer: 'ALOS = Total Patient Inpatient Days / Total Number of Discharges during a given period. To optimize ALOS without compromising patient safety, I streamline pre-admission diagnostic workups, establish morning multidisciplinary discharge rounds, standardize clinical care pathways, and expedite insurance TPA billing approvals before noon.'
      }
    ],
    faqs: [
      { question: 'What degrees are common for Hospital Administrators in India?', answer: 'MHA (Master of Hospital Administration), MBA in Healthcare Management, or PGDHM, often combined with a clinical background (MBBS, BDS, B.Pharm, B.Sc Nursing).' }
    ],
    relatedSkills: ['healthcare-data-analytics', 'hospital-pharmacy', 'operations-management', 'quality-management-six-sigma']
  }
];
