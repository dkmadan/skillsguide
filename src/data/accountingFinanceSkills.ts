import type { SkillDetail } from './skillsData';

export const accountingFinanceSkills: SkillDetail[] = [
  {
    slug: 'financial-accounting',
    title: 'Financial Accounting & Ledger Operations',
    category: 'accounting',
    domainSlug: 'accounting-corporate-finance',
    categoryLabel: 'Accounting & Finance',
    shortDesc: 'Master double-entry bookkeeping, trial balance preparation, adjusting entries, and Schedule III financial statements.',
    longDesc: 'Financial Accounting is the universal language of business. Master the dual-aspect convention, journalizing transactions, general ledger posting, debit-credit controls, month-end accrual adjustments, trial balance reconciliation, and drafting balance sheets and P&L statements.',
    heroImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'Double-Entry Accounting & Financial Reporting Lifecycle',
      caption: 'Source documents, journal entries, ledger posting, trial balance, and Schedule III financial statements.',
      imageUrl: '/images/concepts/concept-accounting-tax.svg',
      keyPoints: [
        { label: 'Source Documentation', description: 'Auditing invoices, purchase orders, bank receipts, and voucher generation.' },
        { label: 'General Ledger & Accruals', description: 'Posting double-entry transactions, depreciation, and prepaid/accrued expense adjustments.' },
        { label: 'Trial Balance Reconciliation', description: 'Verifying mathematical equality of debit and credit balances prior to closing.' },
        { label: 'Schedule III Statements', description: 'Generating Balance Sheet, Statement of Profit & Loss, and Cash Flow Statement.' }
      ]
    },
    salaryRange: '₹3.5L – ₹9.5L LPA',
    minSalaryLPA: 3.5,
    maxSalaryLPA: 9.5,
    averageSalaryLPA: 6.2,
    timelineWeeks: '6 – 8 Weeks',
    hiringVolume: '45,000+ Openings across India',
    experienceLevel: 'Fresher Friendly',
    topCities: ['Mumbai', 'Delhi NCR', 'Bengaluru', 'Hyderabad', 'Pune', 'Kolkata', 'Chennai', 'Ahmedabad'],
    tools: ['TallyPrime 4.0', 'QuickBooks Online', 'Zoho Books', 'Advanced Excel', 'SAP FICO'],
    keyHighlights: [
      'Universal core foundation for B.Com, BBA, M.Com, CA-Inter, and CMA professionals',
      'High hiring volume across SMEs, CA firms, corporate finance divisions, and GCC shared service centers',
      'Direct progression into Senior Accountant, Finance Manager, and Controller'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Dual-Entry Journalizing & Ledger Operations',
        weeks: 'Weeks 1 - 3',
        topics: ['Accounting equation: Assets = Liabilities + Equity and Golden Rules of Accounting', 'Recording purchase, sales, receipt, payment, and contra vouchers in TallyPrime and Zoho Books', 'General Ledger posting, sub-ledger control accounts, and subsidiary cash book management'],
        project: 'Record 100 multi-currency transactions for a trading business and generate a Trial Balance.'
      },
      {
        phase: 'Phase 2: Month-End Adjustments & Financial Statement Preparation',
        weeks: 'Weeks 4 - 7',
        topics: ['Adjusting entries: Accruals, prepayments, depreciation (SLM vs WDV), and bad debt provisions', 'Bank Reconciliation Statements (BRS) with automated ledger matching', 'Drafting Balance Sheet, P&L Statement, and Cash Flow Statement (AS-3 / Ind AS 7)'],
        project: 'Prepare complete Schedule III Financial Statements and Closing Entries for a private limited entity.'
      }
    ],
    jobRoles: [
      { title: 'Accountant / Accounts Executive', salary: '₹3.5L – ₹6.0L', demand: 'Very High' },
      { title: 'Senior Accountant / Accounts Manager', salary: '₹6.5L – ₹12.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'What is the Golden Rule of Accounting for Real, Personal, and Nominal accounts?',
        answer: 'Real Accounts: Debit what comes in, Credit what goes out. Personal Accounts: Debit the receiver, Credit the giver. Nominal Accounts: Debit all expenses and losses, Credit all incomes and gains.'
      }
    ],
    faqs: [
      { question: 'What is the difference between Single-Entry and Double-Entry bookkeeping?', answer: 'Single-entry only tracks cash flows and personal accounts; Double-entry records every transaction with equal and opposite debit and credit entries, ensuring complete balance sheet and income statement integrity.' }
    ],
    relatedSkills: ['gst-accounting', 'income-tax', 'tds-compliance', 'bank-reconciliation', 'tally-prime']
  },
  {
    slug: 'gst-accounting',
    title: 'GST Accounting, Invoicing & Filing (GSTR-1, 3B, 9)',
    category: 'accounting',
    domainSlug: 'accounting-corporate-finance',
    categoryLabel: 'Accounting & Finance',
    shortDesc: 'Master CGST/SGST/IGST mechanics, E-Way bills, E-Invoicing, GSTR-2B Input Tax Credit reconciliation, and annual returns.',
    longDesc: 'Goods and Services Tax (GST) is the backbone of Indian indirect taxation. Master multi-tier tax rates (5%, 12%, 18%, 28%), Reverse Charge Mechanism (RCM), E-Way bill and E-Invoicing generation via IRP portals, GSTR-2B monthly ITC reconciliations, filing GSTR-1, GSTR-3B, GSTR-9 annual returns, and handling department scrutiny notices.',
    heroImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'GST Compliance & Input Tax Credit (ITC) Lifecycle',
      caption: 'B2B invoicing, E-Invoice QR code, GSTR-1 outward filing, GSTR-2B auto-population, and GSTR-3B tax offset.',
      imageUrl: '/images/concepts/concept-accounting-tax.svg',
      keyPoints: [
        { label: 'E-Invoicing & E-Way Bills', description: 'Generating IRN hash codes and E-Way bills on NIC/GST portals for B2B supplies.' },
        { label: 'Outward Supplies (GSTR-1)', description: 'Reporting B2B, B2C, export, and nil-rated turnover with HSN/SAC summary.' },
        { label: 'GSTR-2B ITC Matching', description: 'Reconciling purchase register with supplier-filed ITC in GSTR-2B to prevent clawbacks.' },
        { label: 'Monthly Offset (GSTR-3B)', description: 'Utilizing IGST, CGST, and SGST credits in statutory sequence and paying net tax.' }
      ]
    },
    salaryRange: '₹3.6L – ₹10.0L LPA',
    minSalaryLPA: 3.6,
    maxSalaryLPA: 10.0,
    averageSalaryLPA: 6.5,
    timelineWeeks: '6 – 8 Weeks',
    hiringVolume: '38,000+ GST Openings across India',
    experienceLevel: 'Fresher Friendly',
    topCities: ['Pan-India', 'Mumbai', 'Delhi NCR', 'Bengaluru', 'Ahmedabad', 'Surat', 'Hyderabad', 'Pune'],
    tools: ['GST Portal (gst.gov.in)', 'TallyPrime GST Module', 'ClearTax GST', 'E-Way Bill & E-Invoice Portal', 'Advanced Excel VLOOKUP/Power Query'],
    keyHighlights: [
      'Universal statutory requirement for every registered business in India with turnover over ₹20L/₹40L',
      'High earning potential for independent GST practitioners filing for multiple local businesses',
      'Eliminates heavy penalties and GST cancellation risks for businesses'
    ],
    syllabus: [
      {
        phase: 'Phase 1: GST Concepts, Invoicing & E-Way Bills',
        weeks: 'Weeks 1 - 3',
        topics: ['CGST, SGST, IGST, UTGST rules, Place of Supply, and Time & Value of Supply', 'Mandatory tax invoice particulars, HSN/SAC codes, and Debit/Credit note accounting', 'Generating E-Way bills and E-Invoices with QR codes via API/JSON on TallyPrime'],
        project: 'Configure GST rates and generate 30 B2B E-Invoices and E-Way bills in TallyPrime.'
      },
      {
        phase: 'Phase 2: ITC Reconciliation (GSTR-2B) & Monthly Returns',
        weeks: 'Weeks 4 - 6',
        topics: ['Section 16 eligibility criteria and Section 17(5) blocked Input Tax Credit items', 'Automated GSTR-2B vs Purchase Register reconciliation in Excel and ClearTax', 'Filing GSTR-1 (Outward Supplies) and GSTR-3B (Monthly Summary & Tax Payment) with credit offset rules'],
        project: 'Execute a full-month GSTR-2B purchase reconciliation and compute net tax payable in GSTR-3B.'
      },
      {
        phase: 'Phase 3: Annual Return GSTR-9 & Department Scrutiny',
        weeks: 'Weeks 7 - 8',
        topics: ['Filing Annual Return GSTR-9 and reconciliation statement GSTR-9C', 'Handling GST DRC-01 notices, ASMT-10 scrutiny notices, and interest calculations under Section 50', 'Export of goods/services under Letter of Undertaking (LUT) and GST refund applications (RFD-01)'],
        project: 'Compile an Annual GSTR-9 Return and draft a technical reply to a GST scrutiny mismatch notice.'
      }
    ],
    jobRoles: [
      { title: 'GST Executive / Accounts Officer', salary: '₹3.5L – ₹6.5L', demand: 'Very High' },
      { title: 'GST Consultant / Tax Manager', salary: '₹7.0L – ₹14.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'What are the core blocked Input Tax Credits under Section 17(5) of the CGST Act?',
        answer: 'Blocked credits under Section 17(5) include: (1) Motor vehicles for passenger transport (with seating capacity ≤ 13, unless used for transportation business or driving school), (2) Food, beverages, outdoor catering, beauty treatment, and health services, (3) Membership of clubs and fitness centers, (4) Works contract services for construction of immovable property (other than plant & machinery), and (5) Goods lost, stolen, destroyed, written off, or disposed of as gifts.'
      }
    ],
    faqs: [
      { question: 'What is the rule for utilizing IGST credit against tax liabilities in GSTR-3B?', answer: 'IGST credit must be fully exhausted first—against IGST liability, and then in any order/proportion against CGST and SGST liabilities—before CGST or SGST credits can be utilized.' }
    ],
    relatedSkills: ['financial-accounting', 'income-tax', 'tds-compliance', 'tally-prime']
  },
  {
    slug: 'income-tax',
    title: 'Income Tax & Corporate Tax Filing (ITR-1 to ITR-6)',
    category: 'accounting',
    domainSlug: 'accounting-corporate-finance',
    categoryLabel: 'Accounting & Finance',
    shortDesc: 'Master direct taxation, salary/capital gains taxation, corporate tax (MAT/115BAA), advance tax, and filing ITR forms.',
    longDesc: 'Income Tax & Corporate Taxation governs direct tax compliance across individuals, partnerships, and corporate enterprises. Master the 5 heads of income (Salary, House Property, PGBP, Capital Gains, Other Sources), New vs Old Tax Regime optimization, Corporate Tax rates under Section 115BAA, Advance Tax installments, and e-filing ITR-1 through ITR-6.',
    heroImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'Direct Tax Assessment & ITR Filing Pipeline',
      caption: 'Gross total income computation, Chapter VI-A deductions, Advance Tax offsets, and ITR e-filing.',
      imageUrl: '/images/concepts/concept-accounting-tax.svg',
      keyPoints: [
        { label: '5 Heads of Income', description: 'Salary, House Property, Profits & Gains of Business/Profession (PGBP), Capital Gains, Other Sources.' },
        { label: 'Old vs New Tax Regime', description: 'Comparing Section 115BAC slab benefits with 80C/80D deductions.' },
        { label: 'Corporate Tax (Sec 115BAA)', description: '22% flat corporate tax rate and Minimum Alternate Tax (MAT - Sec 115JB).' },
        { label: 'AIS & Form 26AS Matching', description: 'Reconciling Annual Information Statement (AIS) and TIS before e-verifying ITR.' }
      ]
    },
    salaryRange: '₹4.0L – ₹14.0L LPA',
    minSalaryLPA: 4.0,
    maxSalaryLPA: 14.0,
    averageSalaryLPA: 8.0,
    timelineWeeks: '6 – 8 Weeks',
    hiringVolume: '30,000+ Direct Tax Openings',
    experienceLevel: 'Fresher Friendly',
    topCities: ['Mumbai', 'Delhi NCR', 'Bengaluru', 'Ahmedabad', 'Kolkata', 'Hyderabad', 'Pune', 'Chennai'],
    tools: ['Income Tax e-Filing Portal (incometax.gov.in)', 'Computax / Winman Software', 'ClearTax Direct Tax', 'Excel Tax Calculators'],
    keyHighlights: [
      'High seasonal demand during July (Individual ITR) and October/November (Audit ITR) tax seasons',
      'Lucrative independent tax advisory and return preparation consultancy potential',
      'Crucial expertise for CA firms, corporate finance divisions, and family offices'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Heads of Income & Tax Computation',
        weeks: 'Weeks 1 - 3',
        topics: ['Income from Salary (HRA, standard deduction, perquisites) and House Property (interest under Sec 24b)', 'Profits and Gains of Business or Profession (PGBP - presumptive taxation under 44AD/44ADA)', 'Capital Gains (STCG/LTCG on shares, mutual funds, real estate with Section 54 exemptions)'],
        project: 'Calculate Gross Total Income and tax liability under both Old and New regimes for a multi-asset individual.'
      },
      {
        phase: 'Phase 2: Corporate Taxation, Advance Tax & AIS Reconciliation',
        weeks: 'Weeks 4 - 6',
        topics: ['Corporate tax calculation: Section 115BAA (22% flat rate) and Minimum Alternate Tax (MAT - Sec 115JB)', 'Advance Tax installment schedules (June, Sept, Dec, March) and interest under Section 234A/B/C', 'Reconciling Annual Information Statement (AIS), Taxpayer Information Summary (TIS), and Form 26AS'],
        project: 'Reconcile an Annual Information Statement (AIS) and compute quarterly Advance Tax payments.'
      },
      {
        phase: 'Phase 3: E-Filing ITR Forms & Defective Notice Responses',
        weeks: 'Weeks 7 - 8',
        topics: ['Step-by-step e-filing of ITR-1 (Sahaj), ITR-2 (Capital gains), ITR-3 (Business), and ITR-6 (Companies)', 'Responding to Section 139(9) defective return notices and Section 143(1) intimation adjustments', 'Filing condonation of delay petitions and rectification requests under Section 154'],
        project: 'Prepare, file, and e-verify a complete ITR-3 and ITR-6 tax return on the live portal simulator.'
      }
    ],
    jobRoles: [
      { title: 'Tax Executive / Direct Tax Associate', salary: '₹3.8L – ₹7.0L', demand: 'Very High' },
      { title: 'Senior Tax Consultant / Corporate Tax Manager', salary: '₹8.0L – ₹16.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'What is the default tax regime under Section 115BAC for individuals in India, and what are its key slab rates?',
        answer: 'The New Tax Regime under Section 115BAC is now the default regime. It offers lower slab rates: ₹0–3L (Nil), ₹3–7L (5% with Sec 87A rebate making up to ₹7L tax-free), ₹7–10L (10%), ₹10–12L (15%), ₹12–15L (20%), and >₹15L (30%), with standard deduction of ₹75,000 for salaried employees, but foregoes Chapter VI-A deductions (80C, 80D, HRA).'
      }
    ],
    faqs: [
      { question: 'Who is eligible for Presumptive Taxation under Section 44ADA?', answer: 'Resident professionals (engineers, doctors, lawyers, chartered accountants, technical consultants) with gross receipts up to ₹75 lakh (subject to ≤5% cash receipts) can declare 50% or more as net taxable profit without maintaining detailed books of accounts.' }
    ],
    relatedSkills: ['financial-accounting', 'gst-accounting', 'tds-compliance', 'auditing']
  },
  {
    slug: 'tds-compliance',
    title: 'TDS & TCS Compliance (TRACES, 24Q, 26Q, 27Q)',
    category: 'accounting',
    domainSlug: 'accounting-corporate-finance',
    categoryLabel: 'Accounting & Finance',
    shortDesc: 'Master Tax Deducted at Source (TDS), TRACES portal, Section 194C/J/Q, quarterly returns, and issuing Form 16/16A.',
    longDesc: 'Tax Deducted at Source (TDS) and Tax Collected at Source (TCS) represent critical cash-flow tax administration for Indian enterprises. Master Section 192 (Salaries), 194C (Contractors), 194J (Professional fees), 194Q / 206C(1H) (Goods purchase/sale), quarterly return filings (24Q, 26Q, 27Q), TRACES challan matching, lower deduction certificates, and issuing Form 16 / 16A certificates.',
    heroImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'Corporate TDS / TCS Deduction & TRACES Lifecycle',
      caption: 'Invoice booking, statutory rate deduction, Challan 281 deposit, quarterly 26Q return, and Form 16A issuance.',
      imageUrl: '/images/concepts/concept-accounting-tax.svg',
      keyPoints: [
        { label: 'TDS Deduction at Source', description: 'Applying Section 194C (1%/2%), 194J (2%/10%), 194Q (0.1%), and higher Sec 206AB rates for non-filers.' },
        { label: 'Monthly Deposit (Challan 281)', description: 'Depositing deducted tax via ITNS 281 by the 7th of the following month.' },
        { label: 'Quarterly E-TDS Returns', description: 'Generating CSI files, FVU validation, and filing Form 24Q (Salary) and Form 26Q (Non-salary).' },
        { label: 'TRACES Portal Operations', description: 'Downloading Conso files, resolving Short Deduction defaults, and downloading Form 16/16A.' }
      ]
    },
    salaryRange: '₹3.2L – ₹8.0L LPA',
    minSalaryLPA: 3.2,
    maxSalaryLPA: 8.0,
    averageSalaryLPA: 5.4,
    timelineWeeks: '4 – 6 Weeks',
    hiringVolume: '28,000+ Accounts Openings',
    experienceLevel: 'Fresher Friendly',
    topCities: ['Pan-India', 'Mumbai', 'Delhi NCR', 'Bengaluru', 'Hyderabad', 'Pune', 'Kolkata', 'Chennai'],
    tools: ['TRACES Portal (tdscpc.gov.in)', 'TIN-NSDL FVU Utility', 'TallyPrime TDS Module', 'Winman TDS / ClearTDS', 'Excel TDS Trackers'],
    keyHighlights: [
      'Universal monthly accounting duty across every company and partnership firm in India',
      'Prevents 30% statutory business expense disallowance under Section 40(a)(ia)',
      'Direct pathway into Corporate Accounts Manager and Payroll Specialist'
    ],
    syllabus: [
      {
        phase: 'Phase 1: TDS Sections, Thresholds & Booking Entries',
        weeks: 'Weeks 1 - 2',
        topics: ['Section 192 (Salary TDS computation), 194C (Contractors), 194J (Professional vs Technical fees), 194I (Rent)', 'Section 194Q (TDS on purchase of goods) vs Section 206C(1H) (TCS on sale of goods)', 'Accounting for TDS in TallyPrime: Deductee master setup, deduction on invoice booking vs payment'],
        project: 'Calculate and book TDS entries for 50 vendor invoices across diverse statutory sections.'
      },
      {
        phase: 'Phase 2: Challan 281 Payment, Quarterly Returns & TRACES',
        weeks: 'Weeks 3 - 5',
        topics: ['Monthly payment via Challan ITNS 281 (BSR code, challan tender date, challan number)', 'Filing quarterly returns: Form 24Q (Salary Annexures I & II), Form 26Q (Domestic vendor payments), Form 27Q (Non-residents)', 'TRACES portal: Downloading justification reports, handling Section 200A short deduction defaults, and generating Form 16/16A'],
        project: 'Prepare, validate via NSDL FVU, and file a complete quarterly Form 26Q TDS return.'
      }
    ],
    jobRoles: [
      { title: 'TDS & Accounts Executive', salary: '₹3.2L – ₹5.5L', demand: 'Very High' },
      { title: 'Tax & Compliance Manager', salary: '₹6.0L – ₹11.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'What is the consequence under the Income Tax Act if an Indian company fails to deduct TDS on a vendor payment?',
        answer: 'Under Section 40(a)(ia), 30% of the expenditure is disallowed as a business deduction in that financial year, increasing taxable profit. Additionally, the company is liable for interest under Section 201(1A) at 1% per month from the date of deductibility to actual deduction, plus 1.5% per month from deduction to payment date, along with potential penalties.'
      }
    ],
    faqs: [
      { question: 'What is Section 206AB in TDS compliance?', answer: 'Section 206AB mandates deducting TDS at higher rates (double the normal rate or 5%, whichever is higher) from "specified persons" who failed to file their Income Tax Returns for the preceding financial year and whose aggregate TDS/TCS exceeded ₹50,000.' }
    ],
    relatedSkills: ['financial-accounting', 'income-tax', 'payroll-accounting', 'tally-prime']
  },
  {
    slug: 'payroll-accounting',
    title: 'Payroll Accounting & Statutory Benefits (EPF, ESIC, PT)',
    category: 'accounting',
    domainSlug: 'accounting-corporate-finance',
    categoryLabel: 'Accounting & Finance',
    shortDesc: 'Calculate CTC breakdowns, employee tax withholding, EPF ECR returns, ESIC portal filings, and Gratuity provisioning.',
    longDesc: 'Payroll Accounting manages an organization\'s single largest operating expenditure: employee compensation. Master Cost to Company (CTC) structuring (Basic, HRA, Special Allowance, PF, Gratuity), Employee Provident Fund (EPF) ECR monthly filing, ESIC online returns, Professional Tax (PT), full & final (F&F) settlements, and payroll software (Keka, Darwinbox, GreytHR).',
    heroImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'End-to-End Monthly Payroll & Statutory Compliance Cycle',
      caption: 'Attendance cut-off, CTC gross-to-net calculation, EPF/ESIC ECR deposit, salary bank disbursement, and Form 16.',
      imageUrl: '/images/concepts/concept-accounting-tax.svg',
      keyPoints: [
        { label: 'Attendance & LOP Processing', description: 'Syncing biometric logs, paid leaves, and Loss of Pay (LOP) days.' },
        { label: 'Gross-to-Net Computation', description: 'Deducting PF (12%), ESIC (0.75%), PT, and Section 192 monthly income tax.' },
        { label: 'Statutory ECR Returns', description: 'Generating unified EPF ECR files and filing monthly ESIC contributions by the 15th.' },
        { label: 'Full & Final (F&F) Settlement', description: 'Calculating leave encashment, notice period pay, and Gratuity (Payment of Gratuity Act 1972).' }
      ]
    },
    salaryRange: '₹3.5L – ₹10.0L LPA',
    minSalaryLPA: 3.5,
    maxSalaryLPA: 10.0,
    averageSalaryLPA: 6.2,
    timelineWeeks: '4 – 6 Weeks',
    hiringVolume: '25,000+ Payroll Specialist Openings',
    experienceLevel: 'Fresher Friendly',
    topCities: ['Bengaluru', 'Delhi NCR', 'Mumbai', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata'],
    tools: ['Keka HR / Payroll', 'GreytHR', 'Darwinbox', 'EPFO Unified Portal', 'ESIC Portal', 'Advanced Excel'],
    keyHighlights: [
      'High-demand specialized role combining accounting, HR operations, and statutory labour compliance',
      'Zero-tolerance operational accuracy (paying thousands of employees on time every month)',
      'Direct pathway into Compensation & Benefits Manager and Head of HR Shared Services'
    ],
    syllabus: [
      {
        phase: 'Phase 1: CTC Structuring & Gross-to-Net Calculations',
        weeks: 'Weeks 1 - 2',
        topics: ['Salary components: Basic Pay (40-50% rule), House Rent Allowance (HRA), Special Allowance, and Perks', 'Statutory deductions: Employee Provident Fund (EPF 12% on Basic/DA up to ₹15,000 wage ceiling)', 'Employee State Insurance (ESIC 0.75% employee, 3.25% employer up to ₹21,000 gross ceiling) and Professional Tax (PT state slabs)'],
        project: 'Build an Automated Salary Gross-to-Net Excel Calculator for a 50-employee workforce.'
      },
      {
        phase: 'Phase 2: EPFO / ESIC Portals & Full & Final Settlements',
        weeks: 'Weeks 3 - 5',
        topics: ['Generating ECR text files and uploading monthly contributions on the EPFO Employer Portal by the 15th', 'Filing monthly returns on ESIC portal, generating Pehchan cards, and handling maternity benefits', 'Full & Final (F&F) settlements: Leave encashment, notice pay recovery, and Gratuity formula [(15 × Last Drawn Basic × Years)/26]'],
        project: 'Execute an end-to-end Monthly Payroll Run, generate Bank Payout File, and file EPF ECR return.'
      }
    ],
    jobRoles: [
      { title: 'Payroll Executive / Specialist', salary: '₹3.5L – ₹6.0L', demand: 'Very High' },
      { title: 'Senior Payroll & Benefits Manager', salary: '₹7.0L – ₹14.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'What is the statutory formula for calculating Gratuity under the Payment of Gratuity Act 1972?',
        answer: 'Gratuity = (15 × Last Drawn Basic Salary + DA × Number of Completed Years of Service) / 26. Any service period exceeding 6 months is rounded up to a full year. Gratuity becomes payable once an employee completes 5 continuous years of service (except in case of death or disablement).'
      }
    ],
    faqs: [
      { question: 'What is the monthly due date for depositing EPF and ESIC contributions in India?', answer: 'Both EPF (ECR) and ESIC monthly statutory contributions must be deposited by the 15th of the following calendar month.' }
    ],
    relatedSkills: ['financial-accounting', 'tds-compliance', 'income-tax', 'human-resources-management']
  },
  {
    slug: 'auditing',
    title: 'Statutory Auditing & Internal Financial Controls (IFC)',
    category: 'accounting',
    domainSlug: 'accounting-corporate-finance',
    categoryLabel: 'Accounting & Finance',
    shortDesc: 'Execute statutory financial audits, substantive testing, CARO 2020 reporting, and Internal Financial Controls (IFC).',
    longDesc: 'Auditing guarantees the true and fair view of financial statements for investors, banks, and regulators. Master Standards on Auditing (SAs by ICAI), substantive analytical procedures, audit sampling, Companies (Auditor\'s Report) Order (CARO 2020), Internal Financial Controls over Financial Reporting (IFCoFR), and independent audit report authoring.',
    heroImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'Statutory Financial Audit Execution Pipeline',
      caption: 'Risk assessment, test of controls (TOC), substantive procedures, CARO 2020 review, and Independent Auditor\'s Report.',
      imageUrl: '/images/concepts/concept-accounting-tax.svg',
      keyPoints: [
        { label: 'Audit Planning & Materiality', description: 'Setting Performance Materiality thresholds (SA 320) and risk of material misstatement (RMM).' },
        { label: 'Test of Controls (TOC)', description: 'Evaluating internal approval hierarchies, 3-way matching, and IT general controls (ITGC).' },
        { label: 'Substantive Analytical Testing', description: 'Physical inventory verification, bank confirmations (SA 505), and cut-off testing.' },
        { label: 'CARO 2020 & Audit Opinion', description: 'Reporting under 21 clauses of CARO 2020 and issuing Clean, Qualified, or Adverse opinions.' }
      ]
    },
    salaryRange: '₹5.5L – ₹22.0L LPA',
    minSalaryLPA: 5.5,
    maxSalaryLPA: 22.0,
    averageSalaryLPA: 12.0,
    timelineWeeks: '8 – 12 Weeks',
    hiringVolume: '18,000+ Openings across Big 4 & National Audit Firms',
    experienceLevel: 'Intermediate',
    topCities: ['Mumbai', 'Delhi NCR', 'Bengaluru', 'Hyderabad', 'Kolkata', 'Chennai', 'Pune', 'Ahmedabad'],
    tools: ['AuditBoard', 'Excel Power Query for Audits', 'SAP ERP Audit Logs', 'Caseware Working Papers', 'ICAI Standards on Auditing'],
    keyHighlights: [
      'Premier practice domain for Chartered Accountants (CA), ACCA affiliates, and Big 4 audit professionals (EY, Deloitte, PwC, KPMG)',
      'High responsibility certifying financial integrity of multi-billion rupee listed entities',
      'Strong international mobility across Middle East, UK, Europe, and North America'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Standards on Auditing & Risk Assessment',
        weeks: 'Weeks 1 - 4',
        topics: ['Overview of ICAI Standards on Auditing (SA 200 series to SA 700 series)', 'Determining Materiality, Performance Materiality (SA 320), and assessing Risk of Material Misstatement (RMM - SA 315)', 'Testing Internal Financial Controls over Financial Reporting (IFCoFR) and IT General Controls (ITGC)'],
        project: 'Build an Audit Planning & Materiality Matrix Document for a listed manufacturing client.'
      },
      {
        phase: 'Phase 2: Substantive Audit Procedures & Verification',
        weeks: 'Weeks 5 - 8',
        topics: ['External Confirmations (SA 505) for bank balances, debtor balances, and legal litigations', 'Physical inventory observation protocols (SA 501), roll-forward testing, and cut-off procedures for revenue/purchases', 'Substantive analytical procedures (SA 520): Ratio analysis, trend comparisons, and testing journal entries for management override (SA 240)'],
        project: 'Perform Substantive Audit Testing on Revenue, Inventory, and PPE with working paper documentation.'
      },
      {
        phase: 'Phase 3: CARO 2020 Reporting & Audit Opinions',
        weeks: 'Weeks 9 - 12',
        topics: ['Comprehensive auditing under all 21 clauses of CARO 2020 (PPE, inventory, benami property, default in borrowings, whistleblower complaints)', 'Going Concern evaluation (SA 570) and Subsequent Events review (SA 560)', 'Forming an opinion and drafting Independent Auditor\'s Reports (SA 700, 705, 706) and Key Audit Matters (KAM - SA 701)'],
        project: 'Author a complete Independent Auditor\'s Report with CARO 2020 annexures and Key Audit Matters.'
      }
    ],
    jobRoles: [
      { title: 'Audit Senior / Assurance Associate', salary: '₹6.0L – ₹11.0L', demand: 'Very High' },
      { title: 'Audit Manager / Senior Assurance Manager (Big 4)', salary: '₹14.0L – ₹28.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'What are the four types of audit opinions an auditor can issue under SA 700 and SA 705?',
        answer: '(1) Unmodified (Clean) Opinion: Financial statements give a true and fair view in all material respects. (2) Qualified Opinion: Misstatements are material but not pervasive. (3) Adverse Opinion: Misstatements are both material AND pervasive to the financial statements. (4) Disclaimer of Opinion: Auditor is unable to obtain sufficient appropriate audit evidence and the potential effects could be both material and pervasive.'
      }
    ],
    faqs: [
      { question: 'What is CARO 2020 in Indian statutory audits?', answer: 'CARO 2020 (Companies Auditor\'s Report Order) is an order issued by the Ministry of Corporate Affairs (MCA) mandating 21 detailed reporting clauses for auditors on assets, working capital limits, fraud, statutory dues, and group health.' }
    ],
    relatedSkills: ['financial-accounting', 'accounting-standards', 'internal-auditing', 'forensic-accounting']
  },
  {
    slug: 'accounting-standards',
    title: 'Ind AS & IFRS Accounting Standards',
    category: 'accounting',
    domainSlug: 'accounting-corporate-finance',
    categoryLabel: 'Accounting & Finance',
    shortDesc: 'Master Indian Accounting Standards (Ind AS) & IFRS: Revenue Recognition (Ind AS 115), Leases (Ind AS 116), and Financial Instruments (Ind AS 109).',
    longDesc: 'Ind AS (converged with IFRS) governs financial reporting for all Indian listed companies, large unlisted entities, and multinational enterprises. Master Ind AS 115 (Revenue from Contracts with Customers - 5-Step Model), Ind AS 116 (Right-of-Use Leases), Ind AS 109 (Expected Credit Loss ECL & Financial Instruments), Ind AS 12 (Deferred Taxes), and Business Combinations (Ind AS 103).',
    heroImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'Ind AS & IFRS Financial Reporting Architecture',
      caption: 'Standard evaluation, fair value measurement, balance sheet adjustments, and comprehensive footnote disclosure.',
      imageUrl: '/images/concepts/concept-accounting-tax.svg',
      keyPoints: [
        { label: 'Ind AS 115 Revenue', description: '5-step model identifying performance obligations, transaction price, and over-time recognition.' },
        { label: 'Ind AS 116 Leases', description: 'Recognizing Right-of-Use (ROU) assets and Lease Liabilities on balance sheet.' },
        { label: 'Ind AS 109 Financial Instruments', description: 'Amortized cost, FVTOCI, FVTPL, and 3-stage Expected Credit Loss (ECL) provisioning.' },
        { label: 'Ind AS 103 Business Combinations', description: 'Purchase price allocation (PPA), fair valuation of intangibles, and Goodwill calculation.' }
      ]
    },
    salaryRange: '₹6.5L – ₹25.0L LPA',
    minSalaryLPA: 6.5,
    maxSalaryLPA: 25.0,
    averageSalaryLPA: 14.5,
    timelineWeeks: '8 – 12 Weeks',
    hiringVolume: '15,000+ Openings in Big 4, GCCs & Listed Corporates',
    experienceLevel: 'Intermediate',
    topCities: ['Mumbai', 'Delhi NCR', 'Bengaluru', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata'],
    tools: ['ICAI Ind AS Standards Suite', 'IFRS Standards Portal', 'Advanced Financial Modeling in Excel', 'SAP S/4HANA Group Reporting'],
    keyHighlights: [
      'Top-tier technical accounting specialization commanded by high-growth listed companies and Big 4 advisory',
      'Mandatory reporting standard for all Indian listed companies and NBFCs',
      'Direct global equivalence with International Financial Reporting Standards (IFRS)'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Revenue Recognition (Ind AS 115) & Leases (Ind AS 116)',
        weeks: 'Weeks 1 - 4',
        topics: ['Ind AS 115 5-Step Model: Contract identification, performance obligations, transaction price, allocation, and recognition timing', 'Accounting for contract assets, contract liabilities, warranties, and variable consideration', 'Ind AS 116 Leases: Lessee accounting, Right-of-Use (ROU) asset amortization, lease liability discounting, and transition adjustments'],
        project: 'Build an Ind AS 115 5-Step Revenue Model and Ind AS 116 Lease Liability Amortization Schedule in Excel.'
      },
      {
        phase: 'Phase 2: Financial Instruments (Ind AS 109) & Fair Value (Ind AS 113)',
        weeks: 'Weeks 5 - 8',
        topics: ['Classification of financial assets & liabilities: Amortized cost, FVTOCI, and FVTPL', '3-Stage Expected Credit Loss (ECL) provisioning model for trade receivables and loan portfolios', 'Fair Value hierarchy (Level 1, 2, 3 inputs) under Ind AS 113 and embedded derivative accounting'],
        project: 'Calculate 3-Stage Expected Credit Loss (ECL) provisions on a corporate trade receivable portfolio.'
      },
      {
        phase: 'Phase 3: Business Combinations (Ind AS 103) & Consolidation (Ind AS 110)',
        weeks: 'Weeks 9 - 12',
        topics: ['Ind AS 103 Business Combinations: Acquisition method, Purchase Price Allocation (PPA), and Goodwill / Capital Reserve computation', 'Consolidated Financial Statements under Ind AS 110: Elimination of intra-group transactions and Non-Controlling Interest (NCI)', 'Deferred Tax Assets / Liabilities under Ind AS 12 (Balance sheet liability method)'],
        project: 'Prepare a complete Consolidated Financial Statement and Purchase Price Allocation (PPA) model.'
      }
    ],
    jobRoles: [
      { title: 'Ind AS / IFRS Technical Accounting Specialist', salary: '₹7.0L – ₹14.0L', demand: 'Very High' },
      { title: 'Financial Reporting Manager / Controller', salary: '₹15.0L – ₹30.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'Explain the 5-Step Model of Revenue Recognition under Ind AS 115 / IFRS 15.',
        answer: 'The 5 steps are: (1) Identify the contract with a customer, (2) Identify the separate performance obligations in the contract, (3) Determine the transaction price, (4) Allocate the transaction price to the distinct performance obligations based on relative standalone selling prices, and (5) Recognize revenue when (or as) the entity satisfies each performance obligation (either over time or at a point in time).'
      }
    ],
    faqs: [
      { question: 'What is the key difference between Indian GAAP (AS) and Ind AS?', answer: 'Indian GAAP was rule-based and historical-cost focused; Ind AS is principle-based, fair-value driven, and converged with international IFRS standards with extensive balance-sheet recognition (e.g. lease assets, ECL, fair valuation of investments).' }
    ],
    relatedSkills: ['financial-accounting', 'auditing', 'financial-analysis', 'corporate-finance']
  },
  {
    slug: 'financial-analysis',
    title: 'Financial Analysis, Budgeting & FP&A',
    category: 'accounting',
    domainSlug: 'accounting-corporate-finance',
    categoryLabel: 'Accounting & Finance',
    shortDesc: 'Build financial 3-statement models, rolling forecasts, variance analysis, DCF valuations, and executive CFO dashboards.',
    longDesc: 'Financial Planning & Analysis (FP&A) drives strategic corporate decisions. Master 3-statement financial modeling (P&L, Balance Sheet, Cash Flow), rolling annual budgets, revenue/expense variance analysis, Discounted Cash Flow (DCF) valuation, unit economics (CAC, LTV, payback), and Power BI executive CFO dashboards.',
    heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'Corporate FP&A & Strategic Financial Forecasting Model',
      caption: 'Historical data ingestion, dynamic 3-statement forecast, budget vs actual variance, and DCF scenario valuation.',
      imageUrl: '/images/concepts/concept-accounting-tax.svg',
      keyPoints: [
        { label: '3-Statement Financial Modeling', description: 'Dynamically linking Income Statement, Balance Sheet, and Cash Flow with debt schedules and working capital.' },
        { label: 'Budgeting & Rolling Forecasts', description: 'Zero-Based Budgeting (ZBB), quarterly rolling forecasts, and departmental OPEX/CAPEX.' },
        { label: 'Variance Analysis & Root Causes', description: 'Decomposing price, volume, and mix variances against annual operating plans (AOP).' },
        { label: 'Valuation & Strategic Scenario Analysis', description: 'Discounted Cash Flow (DCF), WACC estimation, sensitivity tables, and Monte Carlo models.' }
      ]
    },
    salaryRange: '₹6.5L – ₹24.0L LPA',
    minSalaryLPA: 6.5,
    maxSalaryLPA: 24.0,
    averageSalaryLPA: 13.5,
    timelineWeeks: '8 – 12 Weeks',
    hiringVolume: '20,000+ Openings across Startups, MNCs & GCCs',
    experienceLevel: 'Intermediate',
    topCities: ['Bengaluru', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Pune', 'Chennai', 'Remote'],
    tools: ['Advanced Excel Modeling', 'Power BI', 'Anaplan / Adaptive Insights', 'Tableau', 'Think-Cell'],
    keyHighlights: [
      'High-prestige, high-impact corporate finance track sitting at the right hand of the CFO and CEO',
      'High demand across funded startups, tech SaaS firms, FMCG giants, and Fortune 500 GCCs',
      'Direct stepping stone to VP of Finance, Head of Strategic Finance, and CFO'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Dynamic 3-Statement Financial Modeling in Excel',
        weeks: 'Weeks 1 - 4',
        topics: ['Building integrated 3-statement models: Revenue drivers, COGS, OPEX schedules, and depreciation waterfall', 'Working capital schedule (DSO, DPO, DIO) and circular debt interest waterfall calculations', 'Excel best practices: Dynamic named ranges, INDEX-MATCH, XLOOKUP, Data Tables, and error checking'],
        project: 'Construct a fully dynamic, 5-year 3-Statement Financial Model for an Indian SaaS or D2C company.'
      },
      {
        phase: 'Phase 2: Budgeting, Variance Analysis & Unit Economics',
        weeks: 'Weeks 5 - 8',
        topics: ['Annual Operating Plan (AOP) creation, Zero-Based Budgeting (ZBB), and quarterly rolling forecast updates', 'Budget vs Actual variance decomposition: Price variance, Volume variance, and Mix variance', 'SaaS and startup unit economics: CAC, LTV, Burn Multiple, Net Revenue Retention (NRR), and Magic Number'],
        project: 'Create a Monthly Budget vs Actual Executive Variance Dashboard with automated waterfall charts.'
      },
      {
        phase: 'Phase 3: Valuation (DCF, Multiples) & Executive Dashboarding',
        weeks: 'Weeks 9 - 12',
        topics: ['Discounted Cash Flow (DCF) valuation: Unlevered Free Cash Flow (FCFF), Terminal Value, and WACC computation', 'Comparable Company Analysis (Trading Comps) and Precedent Transactions (EV/EBITDA, P/E, EV/ARR)', 'Building interactive CFO Executive Dashboards in Power BI with drill-through capability'],
        project: 'Perform an end-to-end DCF Valuation & Sensitivity Matrix for a publicly traded Indian tech enterprise.'
      }
    ],
    jobRoles: [
      { title: 'Financial Analyst / FP&A Analyst', salary: '₹6.5L – ₹12.0L', demand: 'Very High' },
      { title: 'Senior FP&A Manager / Strategic Finance Lead', salary: '₹14.0L – ₹28.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'Walk me through how a ₹100 increase in Depreciation impacts all three financial statements (assuming a 25% tax rate).',
        answer: '(1) Income Statement: Operating Income (EBIT) decreases by ₹100. Taxes decrease by ₹25 (at 25% tax rate). Net Income decreases by ₹75. (2) Cash Flow Statement: Net Income starts ₹75 lower, but since Depreciation is a non-cash expense, we add back ₹100 under Operating Activities. Cash Flow from Operations increases by ₹25. (3) Balance Sheet: Cash increases by ₹25, PP&E decreases by ₹100 (net Assets down by ₹75). Retained Earnings on the Liabilities & Equity side decreases by ₹75 (from Net Income), so the Balance Sheet remains perfectly in balance.'
      }
    ],
    faqs: [
      { question: 'What is the difference between Accounting and FP&A?', answer: 'Accounting records historical financial transactions accurately following statutory standards (backward-looking); FP&A uses financial data to forecast future performance, optimize budgets, and guide strategic capital allocation (forward-looking).' }
    ],
    relatedSkills: ['accounting-standards', 'financial-accounting', 'corporate-finance', 'data-analytics']
  }
];
