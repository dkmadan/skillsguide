export interface QuizQuestion {
  id: string;
  question: string;
  subtitle: string;
  options: {
    label: string;
    description: string;
    value: string;
  }[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'background',
    question: '1. What is your academic or professional background?',
    subtitle: 'Select the option that closest represents your current stage',
    options: [
      { label: 'Engineering / IT Graduate (B.Tech / BCA / MCA)', description: 'Familiar with basic computers or programming', value: 'btech' },
      { label: 'Commerce / Finance / Business (B.Com / BBA / MBA)', description: 'Background in accounts, economics, or management', value: 'commerce' },
      { label: 'Arts / Science / Non-Tech Graduate (BA / B.Sc)', description: 'Seeking non-technical or vocational career entry', value: 'arts' },
      { label: 'Currently Working Professional (Seeking 2x Hike)', description: 'Looking to switch into higher-paying modern tech or business roles', value: 'working' }
    ]
  },
  {
    id: 'codingComfort',
    question: '2. What is your preferred comfort level with computer coding?',
    subtitle: 'Be honest — high-paying options exist for all levels',
    options: [
      { label: 'I enjoy programming & logic (React, Java, Python)', description: 'Love building software and solving algorithmic challenges', value: 'high_coding' },
      { label: 'Prefer simple queries & scripts (SQL, Excel, Prompts)', description: 'Comfortable with structured data and formulas without heavy DSA', value: 'moderate_coding' },
      { label: 'Zero Coding (Want visual design, marketing, or accounts)', description: 'Prefer creative tools, client communication, or statutory compliance', value: 'zero_coding' }
    ]
  },
  {
    id: 'careerGoal',
    question: '3. What is your primary career priority for 2026?',
    subtitle: 'This helps us optimize for timeline vs package ceiling',
    options: [
      { label: 'Highest Package in Indian MNCs & Product Startups', description: 'Aiming for ₹8L–₹24L LPA package ceilings', value: 'high_salary' },
      { label: 'Get Hired Fast (Within 30 to 45 Days)', description: 'Need immediate employment and monthly cash flow', value: 'fast_job' },
      { label: 'Remote Freelance & Earn in USD from Home', description: 'Freedom to work for international clients on Upwork/Fiverr', value: 'freelance_usd' },
      { label: 'Switch to a High-Growth Mid-Career Domain', description: 'Break the ₹15L–₹30L LPA glass ceiling in tech/management', value: 'switch_growth' }
    ]
  }
];

export interface CheatSheetItem {
  id: string;
  title: string;
  badge: string;
  badgeColor: string;
  description: string;
  content: string;
}

export const cheatSheetsData: Record<string, CheatSheetItem> = {
  sql: {
    id: 'sql',
    title: 'Top 20 Indian Interview SQL Queries',
    badge: 'SQL & Data',
    badgeColor: 'brand',
    description: 'High-frequency query patterns asked in TCS, Infosys, Amazon, and FinTech interviews.',
    content: `-- TOP HIGH-FREQUENCY INDIAN INTERVIEW SQL QUERIES

-- 1. Find 2nd Highest Salary in Employees Table
SELECT MAX(salary) AS SecondHighestSalary 
FROM Employees 
WHERE salary < (SELECT MAX(salary) FROM Employees);

-- 2. Find Duplicate Records in Indian Customer DB by PAN
SELECT pan_number, COUNT(*) AS duplicate_count 
FROM Customers 
GROUP BY pan_number 
HAVING COUNT(*) > 1;

-- 3. Top 3 Selling Products per Region (Window Partition)
WITH RankedSales AS (
  SELECT region, product_name, revenue,
         DENSE_RANK() OVER(PARTITION BY region ORDER BY revenue DESC) as rank_pos
  FROM RegionSales
)
SELECT region, product_name, revenue 
FROM RankedSales 
WHERE rank_pos <= 3;

-- 4. Calculate Month-over-Month (MoM) Revenue Growth
WITH MonthlyRevenue AS (
  SELECT DATE_TRUNC('month', order_date) AS order_month,
         SUM(order_amount) AS current_rev
  FROM Orders
  GROUP BY 1
)
SELECT order_month, current_rev,
       LAG(current_rev, 1) OVER (ORDER BY order_month) AS prev_month_rev,
       ROUND(((current_rev - LAG(current_rev, 1) OVER (ORDER BY order_month))::numeric / LAG(current_rev, 1) OVER (ORDER BY order_month)) * 100, 2) AS mom_growth_pct
FROM MonthlyRevenue;`
  },
  prompts: {
    id: 'prompts',
    title: '10 High-ROI Workplace AI Prompts',
    badge: 'Claude & ChatGPT',
    badgeColor: 'purple',
    description: 'Battle-tested corporate prompts for summarizing circulars, code review, and executive communication.',
    content: `// 10 HIGH-ROI WORKPLACE AI PROMPTS

1. Executive Tone Rewrite:
"Transform the following rough message into a concise, polite corporate email suitable for an Indian IT Delivery Manager. Keep it under 100 words with Bottom Line Up Front (BLUF):
[Insert draft here]"

2. RBI / Tax Regulatory Circular Summary:
"Analyze this Indian regulatory circular and extract: (1) Mandatory compliance deadlines, (2) Penalty clauses for non-compliance, (3) 3 immediate operational action items for our finance team. Present as a clean markdown table:
[Insert text]"

3. Code Review & Performance Audit:
"Analyze this JavaScript / Python function for: (a) Potential memory leaks or async unhandled rejections, (b) Edge cases with empty inputs, (c) Big-O time complexity optimization. Provide refactored code with explanatory comments:
[Insert code here]"

4. High-Converting Upwork Proposal Hook:
"Based on this client job description, write a 3-sentence proposal hook. Line 1 must identify their exact technical problem. Line 2 must propose the solution architecture. Line 3 must propose a 5-minute Loom screen share:
[Insert Job Post]"

5. STAR Behavioral Interview Story Builder:
"I solved [Problem] using [Tools] which improved [Metric]. Format this into a compelling 90-second interview answer using the STAR (Situation, Task, Action, Result) method with quantitative percentages."`
  },
  resume: {
    id: 'resume',
    title: 'ATS Single-Column Plain Text Resume Template',
    badge: 'Machine-Readable Format',
    badgeColor: 'emerald',
    description: 'Plain-text ATS-compliant markdown template structured for readability, standard section taxonomy, and verifiable quantifiable impact.',
    content: `# [YOUR FULL NAME]
[City, State, India] | [+91 XXXXX XXXXX] | [your.email@gmail.com]
LinkedIn: linkedin.com/in/[your-handle] | GitHub: github.com/[your-handle] | Portfolio: [yourportfolio.com]

## PROFESSIONAL SUMMARY
[Target Job Title] with hands-on project experience in [3 Core Tools/Languages, e.g. SQL, Power BI, Python]. Built [X completed end-to-end projects] analyzing [describe domain datasets, e.g. e-commerce logistics and loan risk]. Skilled in translating business questions into interactive dashboards, automated pipelines, and documented insights.

## CORE TECHNICAL SKILLS
- Languages & Databases: SQL (PostgreSQL/MySQL: Window Functions, CTEs, Indexing), Python (Pandas, NumPy, Matplotlib)
- BI & Visualization: Power BI (DAX Measures, Star Schema, Power Query ETL), Advanced Excel (Dynamic Arrays, XLOOKUP)
- Core Competencies: Dimensional Data Modeling, KPI Dashboard Design, Cohort Retention Analysis, Business MIS Reporting

## FEATURED PROJECTS
### [Project 1 Title: e.g. E-Commerce Delivery Analytics Dashboard] | [Tools: e.g. Power BI, PostgreSQL, DAX]
- Engineered a Star Schema dimensional model connecting [X,000+ records / X tables], improving data refresh efficiency by [X% measured before vs after query tuning].
- Formulated [X+ custom DAX measures / SQL queries] (e.g. CALCULATE, Time-Intelligence) to analyze [Key Metric 1: e.g. average turnaround time] and [Key Metric 2: e.g. regional margin variations].
- Delivered an interactive executive report with automated drill-through filters; published documentation and schema diagrams to GitHub.
- Live Interactive Dashboard: [link to public portfolio/NovyPro] | GitHub Repository: [github.com/your-handle/project-repo]

### [Project 2 Title: e.g. Retail Loan Risk Classification Model] | [Tools: e.g. Python, Scikit-Learn, Streamlit]
- Performed exploratory data analysis (EDA) across [X,000+ open benchmark records, e.g. Kaggle / RBI dataset] to identify correlation between [Variable A] and [Variable B].
- Implemented and evaluated baseline classification models, achieving [X% Precision / Recall / F1-Score] validated via cross-validation.
- Deployed a lightweight interactive web interface on Streamlit Community Cloud enabling users to test custom parameter scenarios.
- Live Web Application: [link to Streamlit/HuggingFace demo] | GitHub Repository: [github.com/your-handle/project-repo]

## WORK EXPERIENCE / APPRENTICESHIPS
### [Company / Organization Name] | [Job Title / Intern Role] | [City, India]
[Month, Year] – [Month, Year / Present]
- [Action Verb] [specific business task or workflow] using [Tools], resulting in [Measurable Outcome: e.g. automated daily MIS reporting, saving ~X manual hours weekly].
- Collaborated with [Stakeholder Team, e.g. Sales / Finance / Operations leads] to reconcile [Deliverable, e.g. monthly inventory discrepancies], achieving [X% verified data completeness].
- Documented standard operating procedures (SOPs) and query repositories for internal team knowledge sharing.

## EDUCATION & CERTIFICATIONS
- Bachelor of [Degree, e.g. Technology / Commerce / Science] | [University / College Name] | [Graduation Year]
- [Relevant Certification Name, e.g. Microsoft Certified: Power BI Data Analyst Associate (PL-300)] | [Year]`
  },
  excel: {
    id: 'excel',
    title: '20 Essential Modern Excel Formulas',
    badge: 'MS Excel 365',
    badgeColor: 'teal',
    description: 'Dynamic arrays, XLOOKUP, and Power Query formulas to automate 90% of office spreadsheet tasks.',
    content: `// 20 ESSENTIAL MODERN EXCEL FORMULAS

1. Exact XLOOKUP with Fallback:
=XLOOKUP(A2, EmployeeDB[ID], EmployeeDB[Salary], "Not Found")

2. Dynamic Multi-Condition Filter:
=FILTER(SalesData[Amount], (SalesData[Region]="North") * (SalesData[Amount]>50000), "No Records")

3. Extract Unique Customer Names Sorted Alphabetically:
=SORT(UNIQUE(Orders[CustomerName]))

4. Calculate Workdays Between Dates Excluding Indian Holidays:
=NETWORKDAYS.INTL(StartDate, EndDate, 1, HolidaysRange)

5. Calculate Monthly EMI on Home/Personal Loan:
=PMT(AnnualRate/12/100, TenureMonths, -LoanAmount)

6. LET Formula for Clean Readable Variables:
=LET(
    Rev, Sales[Amount],
    Cost, Sales[Cost],
    Margin, (Rev - Cost) / Rev,
    IF(Margin > 0.3, "High Profit", "Standard")
)`
  }
};

export const atsPowerVerbs = {
  leadership: ['Spearheaded', 'Orchestrated', 'Architected', 'Pioneered', 'Championed', 'Mobilized'],
  optimization: ['Automated', 'Streamlined', 'Accelerated', 'Consolidated', 'Restructured', 'Eliminated'],
  achievement: ['Exceeded', 'Generated', 'Amplified', 'Maximized', 'Boosted', 'Delivered'],
  analysis: ['Diagnosed', 'Formulated', 'Audited', 'Synthesized', 'Quantified', 'Engineered']
};
