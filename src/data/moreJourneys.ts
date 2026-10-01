import type { LearnerJourney } from './journeysData';

export const moreLearnerJourneys: LearnerJourney[] = [
  {
    slug: 'engineering-graduates-placement-prep',
    title: 'B.Tech Graduate Placement & First Job Strategy',
    subtitle: 'Turn a generic engineering degree into a job offer with skills-first proof, not just CGPA',
    badge: 'Engineering Fresher',
    badgeColor: 'cyan',
    heroSummary: 'Lakhs of B.Tech graduates in India compete for the same mass-recruiter openings every year. Candidates who stand out pair core fundamentals with one job-aligned specialisation, two deployed projects, and a recruiter-friendly resume. This journey gives final-year and recently passed-out engineers a 12-week plan to get shortlisted beyond campus drives.',
    targetAudience: 'Final-year and recently graduated B.Tech / BE students (any branch) who have not secured an offer through campus placements.',
    keyChallengesAddressed: [
      'Standing out when thousands of applicants share the same degree and similar marks',
      'Moving from classroom theory to deployable, demonstrable projects',
      'Clearing aptitude, coding and HR rounds used by IT services and product companies',
      'Switching to a skill-based job search once campus drives are over'
    ],
    recommendedTracks: [
      { title: 'Full-Stack Web Development', slug: 'full-stack-web', whyRecommended: 'Large number of fresher openings and easy-to-showcase deployed projects.', startingRole: 'Junior Software Developer' },
      { title: 'Data Analytics & Business Intelligence', slug: 'data-analytics', whyRecommended: 'Lower coding bar than SDE roles with strong demand across GCCs and consulting.', startingRole: 'Graduate Data Analyst' },
      { title: 'Cloud Computing', slug: 'cloud-computing', whyRecommended: 'Entry certifications create a clear, verifiable credential for freshers.', startingRole: 'Cloud Support Associate' }
    ],
    prerequisiteBridge: [
      { area: 'Data Structures & Problem Solving', startingGap: 'Syllabus knowledge but no timed practice under interview conditions.', bridgeAction: 'Solve 3 problems per day across arrays, strings, hashing and trees for 8 weeks, then do weekly mock rounds.', freeResource: 'LeetCode Top Interview 150 & NeetCode roadmap' },
      { area: 'Aptitude & Communication', startingGap: 'Weak speed in quantitative and logical sections; hesitant HR answers.', bridgeAction: 'Practise 30 minutes of timed aptitude daily and record 5 self-introduction videos.', freeResource: 'IndiaBIX & PrepInsta free practice sets' }
    ],
    actionPlanSteps: [
      { stepNumber: 1, title: 'Pick One Role Family and Fix Fundamentals', duration: 'Weeks 1–3', description: 'Choose a single target role and revise the 10 topics that role interviews always test (e.g., OOP, DBMS, OS, SQL, networking basics).', deliverables: ['One-page topic checklist with confidence ratings', '60 practice problems solved'] },
      { stepNumber: 2, title: 'Ship Two Deployed Projects', duration: 'Weeks 4–8', description: 'Build one CRUD-style project and one problem-specific project with a live URL, README, and short demo video.', deliverables: ['2 GitHub repos with live links', 'Architecture diagram in each README'] },
      { stepNumber: 3, title: 'Apply, Referral and Mock Interview Loop', duration: 'Weeks 9–12', description: 'Apply through off-campus portals, request alumni referrals, and run weekly mock interviews to tighten answers.', deliverables: ['50 targeted applications', '10 referral requests sent', '4 recorded mock interviews'] }
    ],
    portfolioAndProjectStrategy: {
      focus: 'Prove you can ship working software or analysis, not only pass exams.',
      recommendedProject: 'College-resource booking or placement-tracking web app with authentication, a database, and deployment.',
      howToStandOut: 'Add measurable results such as response time, test coverage, or number of real users from your own campus.'
    },
    resumeAndPositioningAdvice: {
      framingStrategy: 'Lead with skills and projects above education; keep CGPA small unless it is above 7.5.',
      sampleBullet: 'Built and deployed a campus event portal (Node.js, PostgreSQL) used by 400+ students, cutting manual registrations by 80%.',
      avoidMistake: 'Do not list 20 technologies you cannot discuss; interviewers probe every keyword.'
    },
    financialAndTransitionPlanning: {
      timeToFirstIncome: '3 to 6 Months of consistent preparation and applications.',
      hardwareRequirements: 'Any 8GB RAM laptop; free tiers of Vercel, Render and GitHub cover deployment.',
      opportunityCostAdvice: 'Avoid paying for “guaranteed placement” programmes; free practice platforms and open-source contributions deliver the same signal.'
    }
  },
  {
    slug: 'it-services-to-product-company',
    title: 'IT Services to Product Company Switch',
    subtitle: 'Move from TCS/Infosys-style maintenance work to product, startup and GCC roles',
    badge: 'Working Professional',
    badgeColor: 'purple',
    heroSummary: 'Many engineers spend 2–5 years in IT services on support or maintenance projects and feel their skills are stagnating. Product companies and GCCs hire for depth in system design, ownership and shipped impact. This journey shows how to reframe your service experience, upskill in evenings, and clear product-company interviews without quitting first.',
    targetAudience: 'Software engineers with 1–6 years of experience in IT services, support or maintenance projects who want product-company or GCC roles.',
    keyChallengesAddressed: [
      'Resume bias against “service company” experience',
      'Gaps in system design, scalable architecture and modern tooling',
      'Preparing for DSA-heavy interviews while working full-time',
      'Negotiating a salary jump of 40–100% when switching'
    ],
    recommendedTracks: [
      { title: 'Full-Stack Web Development', slug: 'full-stack-web', whyRecommended: 'Modern frameworks and deployment exposure close the stack gap quickly.', startingRole: 'Software Engineer (Product)' },
      { title: 'DevOps & SRE', slug: 'devops-sre', whyRecommended: 'Service-company engineers with infra exposure convert well into platform roles.', startingRole: 'DevOps / SRE Engineer' },
      { title: 'Cloud Computing', slug: 'cloud-computing', whyRecommended: 'Cloud certifications validate hands-on skills missing from legacy projects.', startingRole: 'Cloud Engineer' }
    ],
    prerequisiteBridge: [
      { area: 'System Design Basics', startingGap: 'Experience limited to working inside an existing codebase.', bridgeAction: 'Study load balancing, caching, queues and database sharding; design 6 systems on paper.', freeResource: 'System Design Primer (GitHub) & ByteByteGo free articles' },
      { area: 'Modern Engineering Practices', startingGap: 'Little exposure to CI/CD, containers and code review culture.', bridgeAction: 'Containerise a side project with Docker and add a GitHub Actions pipeline.', freeResource: 'Docker official tutorials & GitHub Actions docs' }
    ],
    actionPlanSteps: [
      { stepNumber: 1, title: 'Audit and Reframe Your Experience', duration: 'Weeks 1–2', description: 'List every project in terms of scale, ownership and measurable outcome rather than ticket volume.', deliverables: ['Impact-based resume with 6–8 quantified bullets', 'Target list of 30 companies'] },
      { stepNumber: 2, title: 'Evening Upskilling Sprint', duration: 'Weeks 3–10', description: 'Spend 1.5 hours on weekdays on DSA and weekends on one system-design or cloud build.', deliverables: ['120 DSA problems solved', '1 containerised project with CI/CD'] },
      { stepNumber: 3, title: 'Targeted Referral-Led Applications', duration: 'Weeks 11–14', description: 'Seek referrals from ex-colleagues and use LinkedIn outreach; schedule interviews in a tight 2-week window to compare offers.', deliverables: ['15 referrals requested', '5+ interview loops completed'] }
    ],
    portfolioAndProjectStrategy: {
      focus: 'Show architecture thinking and end-to-end ownership.',
      recommendedProject: 'Rebuild a legacy-style batch process as an event-driven service with queue, API and dashboard.',
      howToStandOut: 'Publish a short design doc explaining trade-offs you considered.'
    },
    resumeAndPositioningAdvice: {
      framingStrategy: 'Position yourself as an owner of outcomes (uptime, cost, latency), not a ticket resolver.',
      sampleBullet: 'Reduced nightly batch runtime from 6 hours to 55 minutes by parallelising ETL jobs, saving ₹18L annually in compute cost.',
      avoidMistake: 'Do not list client names or confidential details; describe the problem and scale generically.'
    },
    financialAndTransitionPlanning: {
      timeToFirstIncome: '3 to 5 Months while remaining employed.',
      hardwareRequirements: 'Personal laptop with 8–16GB RAM; free cloud tiers for labs.',
      opportunityCostAdvice: 'Do not resign before an offer; switching with a notice-period buyout clause in mind can protect cash flow.'
    }
  },
  {
    slug: 'government-exam-aspirants-to-private-jobs',
    title: 'Government Exam Aspirant to Private Sector Career',
    subtitle: 'Convert years of preparation discipline into skills employers actually pay for',
    badge: 'Exam Aspirant Reset',
    badgeColor: 'amber',
    heroSummary: 'Many graduates spend 2–4 years preparing for UPSC, SSC, banking or state exams before deciding to pivot. The gap on a resume feels daunting, but aspirants carry strong discipline, reasoning and general knowledge. This journey maps those strengths to operations, analytics, accounting and communication roles with a short, structured ramp-up.',
    targetAudience: 'Graduates and post-graduates exiting government-exam preparation who want a private-sector or digital career.',
    keyChallengesAddressed: [
      'Explaining a multi-year preparation gap confidently to recruiters',
      'Having no recent work experience or modern tool proficiency',
      'Choosing between many career options without wasting another year',
      'Rebuilding professional confidence and networking'
    ],
    recommendedTracks: [
      { title: 'Advanced Excel', slug: 'advanced-excel', whyRecommended: 'Fast to learn and opens operations, MIS and finance support roles.', startingRole: 'MIS Executive' },
      { title: 'Communication & English', slug: 'communication-english', whyRecommended: 'Unlocks customer-facing, sales and HR roles with strong aptitude fit.', startingRole: 'Business Development Associate' },
      { title: 'Tally Prime & GST Accounting', slug: 'tally-gst', whyRecommended: 'Practical entry for commerce graduates with immediate local demand.', startingRole: 'Accounts Executive' }
    ],
    prerequisiteBridge: [
      { area: 'Workplace Digital Tools', startingGap: 'Limited exposure to office software and collaboration tools.', bridgeAction: 'Complete a 2-week routine using Excel, Google Workspace, email etiquette and Slack-style chat.', freeResource: 'Microsoft Learn Excel basics & Google Workspace Learning Center' },
      { area: 'Interview Narrative', startingGap: 'Uncertainty about how to explain the preparation gap.', bridgeAction: 'Write a 60-second story: what you learned, why you pivoted, what you are building now.', freeResource: 'SkillsGuide Resume & LinkedIn track' }
    ],
    actionPlanSteps: [
      { stepNumber: 1, title: 'Decide Within Two Weeks', duration: 'Weeks 1–2', description: 'Shortlist two target roles using strengths and local demand; stop open-ended exploration.', deliverables: ['Role decision note', 'Daily 3-hour study schedule'] },
      { stepNumber: 2, title: 'Skill Sprint With Proof', duration: 'Weeks 3–10', description: 'Learn tools for the chosen role and complete two practical projects such as a MIS report or accounting case.', deliverables: ['2 documented projects', 'Course completion certificates'] },
      { stepNumber: 3, title: 'Gap-Aware Applications', duration: 'Weeks 11–14', description: 'Apply with a resume that includes a “Self-Directed Professional Development” entry and ask for trial or internship roles.', deliverables: ['40 applications', '3 mock interviews'] }
    ],
    portfolioAndProjectStrategy: {
      focus: 'Show practical, job-ready output quickly.',
      recommendedProject: 'Monthly MIS dashboard for a small business using Excel pivot tables and charts.',
      howToStandOut: 'Share a one-page case study explaining insights, not just the spreadsheet.'
    },
    resumeAndPositioningAdvice: {
      framingStrategy: 'Present preparation years as structured self-study with disciplined output, then show recent skill proof.',
      sampleBullet: 'Completed 800+ hours of structured analytical study and built a monthly sales MIS tracker reducing reporting time by 60%.',
      avoidMistake: 'Do not leave an unexplained multi-year gap or sound apologetic about the decision.'
    },
    financialAndTransitionPlanning: {
      timeToFirstIncome: '2 to 4 Months with focused study.',
      hardwareRequirements: 'Basic laptop or desktop with Excel; cybercafe access works for early learning.',
      opportunityCostAdvice: 'Start with a paid entry role while learning; waiting for the perfect job extends the gap.'
    }
  },
  {
    slug: 'tier-2-3-city-remote-work',
    title: 'Remote Careers from Tier-2 and Tier-3 Cities',
    subtitle: 'Earn metro or global salaries without relocating from your hometown',
    badge: 'Small-Town Talent',
    badgeColor: 'emerald',
    heroSummary: 'Students and professionals in smaller Indian cities often assume good careers require moving to Bengaluru, Pune or Gurugram. Remote-first startups, global clients and distributed teams now hire on skill and communication. This journey explains which remote roles are realistic, how to build trust without a metro network, and how to handle connectivity and payments.',
    targetAudience: 'Graduates and early-career professionals living outside metro cities who want remote or hybrid work.',
    keyChallengesAddressed: [
      'Limited local job market and networking access',
      'Proving reliability to remote employers and clients',
      'Handling power cuts, unstable internet and time-zone overlap',
      'Setting up international payments and tax compliance'
    ],
    recommendedTracks: [
      { title: 'Freelancing & Earning in USD', slug: 'freelancing-usd', whyRecommended: 'Direct path to global clients with payment and contract guidance.', startingRole: 'Freelance Specialist' },
      { title: 'Digital & Performance Marketing', slug: 'digital-marketing', whyRecommended: 'High remote demand and results that are easy to measure.', startingRole: 'Remote Marketing Associate' },
      { title: 'Python & Automation', slug: 'python-automation', whyRecommended: 'Automation services are billable remotely with minimal infrastructure.', startingRole: 'Automation Developer' }
    ],
    prerequisiteBridge: [
      { area: 'Remote Reliability Stack', startingGap: 'No backup for internet or power during client calls.', bridgeAction: 'Set up a dual-SIM/mobile hotspot backup and a small UPS; document uptime in your profile.', freeResource: 'Remote-work infrastructure checklist on SkillsGuide' },
      { area: 'Async Communication', startingGap: 'Experience limited to in-person classroom or office communication.', bridgeAction: 'Practise written updates, Loom walkthroughs and daily progress notes.', freeResource: 'GitLab Handbook on async work' }
    ],
    actionPlanSteps: [
      { stepNumber: 1, title: 'Choose a Billable Skill', duration: 'Weeks 1–2', description: 'Pick one skill with proven remote demand and check live job boards for requirements.', deliverables: ['Target role definition', 'List of 20 remote-friendly job posts'] },
      { stepNumber: 2, title: 'Build Public Proof', duration: 'Weeks 3–8', description: 'Create two samples and publish them on LinkedIn, GitHub or a simple portfolio site.', deliverables: ['Portfolio site', '2 case studies with outcomes'] },
      { stepNumber: 3, title: 'Win First Remote Engagement', duration: 'Weeks 9–12', description: 'Apply to remote startups and pitch small paid trial projects with clear scope.', deliverables: ['30 outreach messages', 'First paid trial or part-time role'] }
    ],
    portfolioAndProjectStrategy: {
      focus: 'Demonstrate clear communication and dependable delivery.',
      recommendedProject: 'A local-business digital growth case study documenting before/after leads or sales.',
      howToStandOut: 'Include client testimonial screenshots and turnaround times.'
    },
    resumeAndPositioningAdvice: {
      framingStrategy: 'Emphasise remote readiness: time-zone availability, tools used and written communication quality.',
      sampleBullet: 'Delivered a Google Ads campaign for a local retailer, lowering cost per lead from ₹420 to ₹165 within six weeks working fully remotely.',
      avoidMistake: 'Do not hide your location; instead highlight availability and backup arrangements.'
    },
    financialAndTransitionPlanning: {
      timeToFirstIncome: '3 to 6 Months.',
      hardwareRequirements: 'Laptop, headset, stable broadband plus mobile hotspot backup and power backup.',
      opportunityCostAdvice: 'Living in a lower-cost city while earning metro-level pay compounds savings; invest first earnings in reliable internet and power backup.'
    }
  },
  {
    slug: 'final-year-students-internship-strategy',
    title: 'College Student Internship Strategy',
    subtitle: 'Land a meaningful internship in 1st–3rd year without an inside connection',
    badge: 'College Student',
    badgeColor: 'teal',
    heroSummary: 'Internships are the strongest predictor of a first job offer, yet many students apply randomly or only to famous companies. This journey shows how to pick a target role early, create small proof-of-work projects, and use cold outreach, startup job boards and college alumni to secure paid or high-learning internships.',
    targetAudience: 'Undergraduate students in any stream who want internships during semester breaks or alongside college.',
    keyChallengesAddressed: [
      'Having no experience to show for experience-required internships',
      'Cold outreach messages that get ignored',
      'Balancing academics with practical learning',
      'Converting an internship into a pre-placement offer'
    ],
    recommendedTracks: [
      { title: 'Graphic Design & Figma', slug: 'graphic-figma', whyRecommended: 'Visible portfolio work lets students win internships without prior employment.', startingRole: 'Design Intern' },
      { title: 'Data Analytics & Business Intelligence', slug: 'data-analytics', whyRecommended: 'Open datasets provide projects that substitute for work experience.', startingRole: 'Data Analyst Intern' },
      { title: 'Resume & LinkedIn Branding', slug: 'resume-linkedin', whyRecommended: 'Improves response rate to applications and cold outreach.', startingRole: 'Any Intern Role' }
    ],
    prerequisiteBridge: [
      { area: 'Proof of Work', startingGap: 'Only academic coursework to show.', bridgeAction: 'Build two mini projects tied to the role, such as a dashboard or UI redesign of a known app.', freeResource: 'Kaggle datasets & Figma Community files' },
      { area: 'Professional Presence', startingGap: 'Incomplete LinkedIn profile and unprofessional email.', bridgeAction: 'Create a headline, summary and featured section with project links.', freeResource: 'SkillsGuide LinkedIn optimisation guide' }
    ],
    actionPlanSteps: [
      { stepNumber: 1, title: 'Select Role and Build Basics', duration: 'Weeks 1–4', description: 'Choose one function to target and complete a beginner project.', deliverables: ['One-page role goal', 'Project #1 published'] },
      { stepNumber: 2, title: 'Create Application Assets', duration: 'Weeks 5–6', description: 'Prepare a one-page resume, a LinkedIn profile and a short cold-email template.', deliverables: ['ATS-friendly resume', 'LinkedIn profile at 100% completeness'] },
      { stepNumber: 3, title: 'Outreach and Follow-Up', duration: 'Weeks 7–10', description: 'Send 10 personalised messages per week to founders, HR and alumni and follow up after 5 days.', deliverables: ['40+ personalised outreach messages', '3+ interview calls'] }
    ],
    portfolioAndProjectStrategy: {
      focus: 'Show initiative and learning velocity.',
      recommendedProject: 'A real mini-brief completed for a student club or local business with a before/after outcome.',
      howToStandOut: 'Write a short blog post on lessons learned and share it with your outreach.'
    },
    resumeAndPositioningAdvice: {
      framingStrategy: 'Highlight projects, club leadership and skills above academics.',
      sampleBullet: 'Redesigned college fest registration flow in Figma, increasing sign-ups by 35% across 1,200 students.',
      avoidMistake: 'Do not send generic “Dear Sir/Madam” emails; personalise the first line.'
    },
    financialAndTransitionPlanning: {
      timeToFirstIncome: '1 to 3 Months to first internship (stipend varies from unpaid to ₹25,000/month).',
      hardwareRequirements: 'Personal or college lab computer; free tools cover most needs.',
      opportunityCostAdvice: 'Prioritise learning-rich internships over brand-name unpaid ones; a strong reference is worth more than a logo.'
    }
  },
  {
    slug: 'layoff-recovery-job-search-plan',
    title: 'Job Loss & Layoff Recovery Plan',
    subtitle: 'A structured 60-day plan to regain income, confidence and momentum after a layoff',
    badge: 'Layoff Recovery',
    badgeColor: 'rose',
    heroSummary: 'Layoffs are common across tech, startups and BFSI, and a sudden exit can disrupt finances and confidence. Success depends on acting fast: preserving cash runway, updating proof of work, tapping your network and targeting roles where skills are in demand. This journey provides a practical 60-day plan for Indian job seekers.',
    targetAudience: 'Employees recently laid off or facing role redundancy, with 1–15 years of experience.',
    keyChallengesAddressed: [
      'Managing finances during the notice and severance period',
      'Explaining the layoff in interviews without sounding defensive',
      'Competing with many applicants from the same company',
      'Updating skills quickly for the current market'
    ],
    recommendedTracks: [
      { title: 'Resume & LinkedIn Branding', slug: 'resume-linkedin', whyRecommended: 'A sharp profile is the fastest lever for recruiter inbound.', startingRole: 'Same or adjacent role' },
      { title: 'AI Prompt Engineering', slug: 'ai-prompt-engineering', whyRecommended: 'AI productivity skills are now expected across functions.', startingRole: 'AI-augmented professional' },
      { title: 'Freelancing & Earning in USD', slug: 'freelancing-usd', whyRecommended: 'Bridge income while you search for full-time work.', startingRole: 'Independent Consultant' }
    ],
    prerequisiteBridge: [
      { area: 'Financial Runway', startingGap: 'No clear view of savings, EMIs and insurance coverage.', bridgeAction: 'Calculate months of runway, pause non-essential spends and review health insurance continuity.', freeResource: 'SkillsGuide ROI Calculator & RBI financial literacy resources' },
      { area: 'Skill Refresh', startingGap: 'Tools used at the last employer may be outdated.', bridgeAction: 'Identify the three most-requested tools in your target job posts and learn them within 4 weeks.', freeResource: 'Official documentation and free vendor tutorials' }
    ],
    actionPlanSteps: [
      { stepNumber: 1, title: 'Stabilise and Document', duration: 'Days 1–7', description: 'Secure severance paperwork, export work samples where allowed and note achievements with numbers.', deliverables: ['Achievement log', 'Cash runway sheet'] },
      { stepNumber: 2, title: 'Activate Network and Applications', duration: 'Days 8–35', description: 'Post a clear “open to work” message, contact 5 people daily and apply to roles with referral paths.', deliverables: ['100 networking touchpoints', '40 targeted applications'] },
      { stepNumber: 3, title: 'Bridge Income and Interviews', duration: 'Days 36–60', description: 'Take consulting or contract work to cover expenses and keep interview practice weekly.', deliverables: ['1 contract/consulting gig', '6+ interviews completed'] }
    ],
    portfolioAndProjectStrategy: {
      focus: 'Demonstrate current capability and impact.',
      recommendedProject: 'A case study of your best project at the previous employer, anonymised with metrics.',
      howToStandOut: 'Publish weekly learning posts to remain visible while searching.'
    },
    resumeAndPositioningAdvice: {
      framingStrategy: 'State the layoff briefly and factually, then pivot to your value and next goal.',
      sampleBullet: 'Led a 6-member team delivering a payments module that processed ₹120Cr monthly with 99.95% uptime.',
      avoidMistake: 'Never criticise the former employer or give a long emotional explanation.'
    },
    financialAndTransitionPlanning: {
      timeToFirstIncome: '1 to 3 Months for contract work; 2 to 5 Months for full-time roles.',
      hardwareRequirements: 'Existing laptop; secure personal email and cloud backup.',
      opportunityCostAdvice: 'Accepting a good-fit interim role is often better than holding out for months at a perfect salary.'
    }
  },
  {
    slug: 'mid-career-40-plus-reskilling',
    title: 'Mid-Career Reskilling After 40',
    subtitle: 'Leverage deep experience while adding in-demand digital and AI skills',
    badge: 'Experienced Professional',
    badgeColor: 'amber',
    heroSummary: 'Professionals above 40 face ageism concerns and rapid tool change, yet bring judgement, leadership and domain depth that younger candidates lack. The strongest strategy is to combine experience with one or two current skills and position yourself for advisory, management, consulting or product-adjacent roles.',
    targetAudience: 'Professionals aged 40+ in any industry planning a role upgrade, domain shift or consulting career.',
    keyChallengesAddressed: [
      'Age bias in screening and salary negotiation',
      'Learning new tools while managing family and work',
      'Choosing between a job switch and independent consulting',
      'Showing relevance in an AI-first workplace'
    ],
    recommendedTracks: [
      { title: 'AI Prompt Engineering', slug: 'ai-prompt-engineering', whyRecommended: 'Adds AI fluency to existing expertise with a gentle learning curve.', startingRole: 'AI-Enabled Manager / Consultant' },
      { title: 'Product Management', slug: 'product-management', whyRecommended: 'Domain depth and stakeholder skills transfer strongly.', startingRole: 'Senior Product / Domain PM' },
      { title: 'Data Analytics & Business Intelligence', slug: 'data-analytics', whyRecommended: 'Data-driven decision-making strengthens senior roles.', startingRole: 'Business Insights Lead' }
    ],
    prerequisiteBridge: [
      { area: 'Digital Fluency', startingGap: 'Comfort with legacy systems rather than current SaaS tools.', bridgeAction: 'Adopt one modern workflow tool per week (Notion, Slack, Looker Studio, an AI assistant).', freeResource: 'Official product tutorials & Google Skillshop' },
      { area: 'Personal Brand', startingGap: 'Limited online presence despite strong credentials.', bridgeAction: 'Publish two LinkedIn posts weekly on lessons from your career.', freeResource: 'SkillsGuide LinkedIn branding guide' }
    ],
    actionPlanSteps: [
      { stepNumber: 1, title: 'Define the Next Chapter', duration: 'Weeks 1–3', description: 'Decide between a senior role, domain pivot or consulting practice and shortlist target sectors.', deliverables: ['Positioning statement', 'Target companies/sectors list'] },
      { stepNumber: 2, title: 'Add One Current Skill Layer', duration: 'Weeks 4–12', description: 'Complete a focused course and apply it to a real workplace or advisory problem.', deliverables: ['1 applied case study', 'Certificate or portfolio proof'] },
      { stepNumber: 3, title: 'Network and Advisory Outreach', duration: 'Weeks 13–20', description: 'Reconnect with former colleagues, offer short advisory engagements and apply for senior openings.', deliverables: ['30 conversations', '2 advisory/pilot engagements'] }
    ],
    portfolioAndProjectStrategy: {
      focus: 'Pair experience with evidence of current skills.',
      recommendedProject: 'A data- or AI-driven improvement plan for a real process in your previous domain.',
      howToStandOut: 'Present a one-page “before vs after” business impact summary.'
    },
    resumeAndPositioningAdvice: {
      framingStrategy: 'Lead with leadership outcomes and recent learning; trim experience beyond the last 15 years.',
      sampleBullet: 'Led a 40-member operations team and introduced AI-assisted reporting that cut weekly MIS effort by 25 hours.',
      avoidMistake: 'Avoid phrases like “30+ years of experience”; emphasise relevance and results.'
    },
    financialAndTransitionPlanning: {
      timeToFirstIncome: '2 to 6 Months, faster via advisory and contract work.',
      hardwareRequirements: 'Standard laptop with good webcam and microphone for virtual meetings.',
      opportunityCostAdvice: 'Prefer low-cost courses and keep income stable while exploring; consulting income often starts before a permanent offer.'
    }
  },
  {
    slug: 'ai-skills-for-non-tech-professionals',
    title: 'AI Skills for Non-Tech Professionals',
    subtitle: 'Use AI tools to become 2x more productive and stay relevant in any role',
    badge: 'AI Upskilling',
    badgeColor: 'cyan',
    heroSummary: 'AI tools now handle drafting, research, analysis and reporting across HR, finance, sales, operations and teaching. Professionals who learn to direct these tools safely will outperform peers. This journey focuses on practical prompting, workflow automation and responsible data handling, without needing to code.',
    targetAudience: 'Working professionals and students in non-technical roles who want to use AI to improve productivity and job security.',
    keyChallengesAddressed: [
      'Not knowing where AI fits into daily tasks',
      'Unreliable outputs and hallucinations',
      'Data privacy risks when pasting company information',
      'Demonstrating AI skills on a resume'
    ],
    recommendedTracks: [
      { title: 'AI Prompt Engineering', slug: 'ai-prompt-engineering', whyRecommended: 'Core skill for working effectively with large language models.', startingRole: 'AI-Augmented Specialist' },
      { title: 'Advanced Excel', slug: 'advanced-excel', whyRecommended: 'Excel plus AI is a powerful analysis combination for non-coders.', startingRole: 'Business Analyst / MIS Lead' },
      { title: 'Python & Automation', slug: 'python-automation', whyRecommended: 'Optional next step to automate repetitive reports.', startingRole: 'Operations Automation Specialist' }
    ],
    prerequisiteBridge: [
      { area: 'Prompt Fundamentals', startingGap: 'Short vague prompts yield generic results.', bridgeAction: 'Practise the role-task-context-format structure on 10 real work tasks.', freeResource: 'Anthropic prompt engineering guide & SkillsGuide AI track' },
      { area: 'Verification Habits', startingGap: 'Trusting AI output without checking sources.', bridgeAction: 'Build a checklist for fact-checking numbers, names and citations before sharing.', freeResource: 'SkillsGuide AI safety checklist' }
    ],
    actionPlanSteps: [
      { stepNumber: 1, title: 'Map Your Repetitive Tasks', duration: 'Week 1', description: 'List weekly tasks and mark those involving drafting, summarising or data cleaning.', deliverables: ['Task inventory of 15 items', 'Top 5 AI candidates'] },
      { stepNumber: 2, title: 'Build Reusable AI Workflows', duration: 'Weeks 2–4', description: 'Create prompt templates and test them against real examples while following company data policy.', deliverables: ['5 reusable prompt templates', 'Time-saved log'] },
      { stepNumber: 3, title: 'Show Measurable Impact', duration: 'Weeks 5–6', description: 'Document hours saved and quality improvements and share results with your manager or on LinkedIn.', deliverables: ['One-page impact report', 'Updated resume with AI skills'] }
    ],
    portfolioAndProjectStrategy: {
      focus: 'Prove practical productivity gains.',
      recommendedProject: 'An AI-assisted monthly reporting or content workflow with before/after time comparisons.',
      howToStandOut: 'Share a redacted workflow video with step-by-step reasoning and verification.'
    },
    resumeAndPositioningAdvice: {
      framingStrategy: 'Present AI as a tool that improved outcomes in your domain, not a stand-alone gimmick.',
      sampleBullet: 'Designed AI-assisted candidate screening templates that cut shortlisting time from 12 hours to 4 hours per role.',
      avoidMistake: 'Do not paste confidential data into public AI tools or claim AI output as unreviewed work.'
    },
    financialAndTransitionPlanning: {
      timeToFirstIncome: 'Immediate productivity gains; role or salary impact in 2 to 4 Months.',
      hardwareRequirements: 'Any laptop or smartphone with internet; free-tier AI assistants are enough to start.',
      opportunityCostAdvice: 'Prefer free documentation and tool trials over expensive AI certificates; employers value demonstrated results.'
    }
  },
  {
    slug: 'bpo-support-to-tech-career',
    title: 'BPO / Customer Support to Tech Career Growth',
    subtitle: 'Move from voice and chat support into higher-paying technical and operations roles',
    badge: 'Support Professional',
    badgeColor: 'teal',
    heroSummary: 'Customer support and BPO roles offer thousands of entry jobs but plateau quickly in pay. Agents already have communication skills, tool exposure and process discipline. By adding SQL, ticket analytics, cloud basics or QA skills, they can move into technical support, data operations, QA and customer success roles within 6–9 months.',
    targetAudience: 'BPO, KPO and customer support agents with 6 months to 4 years of experience seeking technical or higher-paid roles.',
    keyChallengesAddressed: [
      'Night-shift schedules leaving little study time',
      'Limited technical exposure on the job',
      'Lack of a path beyond team lead roles',
      'Translating support metrics into resume achievements'
    ],
    recommendedTracks: [
      { title: 'BPO & Customer Support Excellence', slug: 'bpo-support', whyRecommended: 'Sharpens current skills and leads to senior and process roles.', startingRole: 'Senior Support Specialist' },
      { title: 'Data Analytics & Business Intelligence', slug: 'data-analytics', whyRecommended: 'Ticket and CSAT data are excellent starting datasets.', startingRole: 'Operations Data Analyst' },
      { title: 'Cloud Computing', slug: 'cloud-computing', whyRecommended: 'Technical support experience transitions well into cloud support.', startingRole: 'Cloud Support Associate' }
    ],
    prerequisiteBridge: [
      { area: 'Technical Troubleshooting', startingGap: 'Following scripts without understanding root causes.', bridgeAction: 'Learn networking basics, logs and API fundamentals; practise on sandbox environments.', freeResource: 'Cisco Networking Academy intro & Postman Learning Center' },
      { area: 'Data from Support Work', startingGap: 'Metrics tracked but not analysed.', bridgeAction: 'Use anonymised ticket data to calculate resolution time trends in SQL or Excel.', freeResource: 'SQLBolt & Excel pivot table tutorials' }
    ],
    actionPlanSteps: [
      { stepNumber: 1, title: 'Optimise Study Within Shift Pattern', duration: 'Weeks 1–2', description: 'Block two 45-minute study slots daily and pick one skill path.', deliverables: ['Weekly study timetable', 'Skill path selection'] },
      { stepNumber: 2, title: 'Build Technical and Analytical Proof', duration: 'Weeks 3–16', description: 'Complete a SQL or cloud fundamentals course and apply it to a support analytics project.', deliverables: ['Support insights dashboard', 'Entry-level certification'] },
      { stepNumber: 3, title: 'Internal Move or External Switch', duration: 'Weeks 17–24', description: 'Apply for internal technical support/QA roles and external openings with a revised resume.', deliverables: ['Updated resume', '25 targeted applications'] }
    ],
    portfolioAndProjectStrategy: {
      focus: 'Show data-informed improvement of support operations.',
      recommendedProject: 'Ticket analysis dashboard identifying top issue drivers and proposing knowledge-base improvements.',
      howToStandOut: 'Quantify the projected reduction in repeat contacts.'
    },
    resumeAndPositioningAdvice: {
      framingStrategy: 'Convert call-handling metrics into business impact: CSAT, FCR, escalation reduction and process improvement.',
      sampleBullet: 'Improved first-contact resolution from 71% to 84% by building a troubleshooting guide used by a 25-agent team.',
      avoidMistake: 'Do not list only “handled customer calls”; show improvements and tools used.'
    },
    financialAndTransitionPlanning: {
      timeToFirstIncome: '4 to 8 Months for a role change; salary increases of 30–70% are common.',
      hardwareRequirements: 'Home laptop or desktop with reliable internet.',
      opportunityCostAdvice: 'Stay employed during the transition; growing within your current company can be the fastest first step.'
    }
  },
  {
    slug: 'small-business-owner-digital-skills',
    title: 'Digital Skills for Small Business Owners & Shopkeepers',
    subtitle: 'Bring customers online, automate accounts and grow sales using low-cost digital tools',
    badge: 'Entrepreneur',
    badgeColor: 'emerald',
    heroSummary: 'Millions of Indian MSMEs, retailers and service providers still depend on walk-ins and manual records. Basic digital skills—Google Business Profile, WhatsApp Business, UPI and GST-ready billing, simple ads and spreadsheets—can raise sales, reduce errors and improve cash flow. This journey is a practical 6-week plan for owners and family members who manage the business.',
    targetAudience: 'Small shop owners, local service providers, home-based businesses and family members entering the business.',
    keyChallengesAddressed: [
      'Limited online visibility compared to marketplace sellers',
      'Manual bookkeeping and GST compliance stress',
      'Not knowing how to measure what marketing works',
      'Hesitation about technology and online payments'
    ],
    recommendedTracks: [
      { title: 'Digital & Performance Marketing', slug: 'digital-marketing', whyRecommended: 'Local search and low-budget ads bring measurable customer enquiries.', startingRole: 'Business Owner / Marketing Lead' },
      { title: 'Tally Prime & GST Accounting', slug: 'tally-gst', whyRecommended: 'Digital billing and GST filing reduce errors and penalties.', startingRole: 'Business Owner / Accounts Lead' },
      { title: 'Video Editing', slug: 'video-editing', whyRecommended: 'Short videos build trust and drive social media enquiries.', startingRole: 'Content Creator for Business' }
    ],
    prerequisiteBridge: [
      { area: 'Local Online Presence', startingGap: 'No verified Google listing or catalogue.', bridgeAction: 'Create and verify a Google Business Profile, add photos, services and hours, and request reviews.', freeResource: 'Google Business Profile Help & WhatsApp Business Academy' },
      { area: 'Digital Records', startingGap: 'Handwritten ledgers and delayed invoicing.', bridgeAction: 'Switch to simple billing software and record daily sales in a spreadsheet.', freeResource: 'Tally learning resources & Google Sheets templates' }
    ],
    actionPlanSteps: [
      { stepNumber: 1, title: 'Set Up Digital Foundations', duration: 'Weeks 1–2', description: 'Create business listings, enable UPI QR payments and set up WhatsApp Business with a catalogue.', deliverables: ['Verified Google profile', 'WhatsApp catalogue with 20 items'] },
      { stepNumber: 2, title: 'Systemise Billing and Records', duration: 'Weeks 3–4', description: 'Adopt GST-ready billing and a daily sales/stock tracker.', deliverables: ['Digital invoice format', 'Weekly sales report'] },
      { stepNumber: 3, title: 'Launch Small Marketing Tests', duration: 'Weeks 5–6', description: 'Run a ₹3,000–₹5,000 local ad test and a short video series; track enquiries per source.', deliverables: ['2 ad variations tested', 'Lead source tracking sheet'] }
    ],
    portfolioAndProjectStrategy: {
      focus: 'Document growth from digital changes to improve credibility and repeat customers.',
      recommendedProject: 'A before/after record of enquiries and sales after listing optimisation and WhatsApp follow-ups.',
      howToStandOut: 'Display customer reviews and a simple price catalogue for trust.'
    },
    resumeAndPositioningAdvice: {
      framingStrategy: 'For owners seeking loans or partnerships, present digital sales trends and clean records as evidence of reliability.',
      sampleBullet: 'Increased monthly walk-in and phone enquiries by 45% within 8 weeks using Google Business Profile optimisation and WhatsApp follow-up.',
      avoidMistake: 'Do not spend on large ad budgets before confirming demand with small tests.'
    },
    financialAndTransitionPlanning: {
      timeToFirstIncome: 'Visible enquiry growth in 2 to 6 weeks; sustained revenue impact in 3 months.',
      hardwareRequirements: 'Smartphone with a good camera; basic laptop or tablet is optional.',
      opportunityCostAdvice: 'Start with free tools and small ad tests; invest in paid software only after consistent usage for 30 days.'
    }
  }
];
