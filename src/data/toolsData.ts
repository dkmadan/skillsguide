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
    badge: 'ATS Score 95+',
    badgeColor: 'emerald',
    description: 'Plain-text ATS-compliant markdown template optimized for Naukri, Instahyre, and LinkedIn recruiter parsing algorithms.',
    content: `# [YOUR FULL NAME]
[City, State, India] | [+91 XXXXX XXXXX] | [your.email@gmail.com]
LinkedIn: linkedin.com/in/yourname | GitHub: github.com/yourname | Portfolio: yourportfolio.com

## PROFESSIONAL SUMMARY
Results-driven [Target Job Title] with hands-on expertise in [3 Core Tools, e.g. SQL, Power BI, Python]. Built and deployed [X real-world projects], optimizing business workflows by [X%]. Passionate about turning complex data into actionable executive insights.

## CORE TECHNICAL SKILLS
- Languages & Tools: SQL (Window Functions, CTEs), Power BI (DAX, Star Schema), Python (Pandas, NumPy), Excel (Power Query, XLOOKUP)
- Competencies: Data Modeling, Dashboard Design, A/B Testing, ETL Pipelines, Business MIS Reporting

## FEATURED PROJECTS
### Swiggy / Zomato Delivery Analytics Dashboard | Power BI, SQL, DAX
- Engineered a Star Schema dimensional model connecting 150,000+ delivery records, reducing report refresh latency by 45%.
- Formulated 20+ custom DAX measures (CALCULATE, Time-Intelligence) to analyze average delivery times, rider payouts, and regional margins.
- Live Interactive Dashboard: [novypro.com/project/link] | GitHub: [github.com/yourname/project]

### Indian FinTech Loan Default Risk Analyzer | Python, Pandas, Scikit-Learn
- Performed exploratory data analysis (EDA) on 80,000 banking loan records to identify high-risk customer default triggers.
- Developed an interactive Streamlit dashboard allowing loan officers to simulate borrower default probabilities.

## WORK EXPERIENCE
### [Company Name] | [Job Title] | [City, India]
[Month, Year] – Present
- Automated daily and weekly sales MIS reporting using Power Query and advanced Excel, saving 12 manual team hours per week.
- Collaborated with cross-functional sales and finance leads to reconcile monthly revenue variations, achieving 99.4% reporting accuracy.

## EDUCATION & CERTIFICATIONS
- Bachelor of Technology / Commerce / Science | [University Name] | [Graduation Year]
- Microsoft Certified: Power BI Data Analyst Associate (PL-300) | [Year]`
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
