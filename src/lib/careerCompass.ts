export type Answers = Record<string, string>;
export type Question = { id: string; label: string; options?: string[]; optional?: boolean; type?: 'text' | 'number'; hint?: string };
const comfort = ['None yet', 'Beginner', 'Comfortable', 'Strong', 'Advanced'];

export const compassSteps: { title: string; description: string; questions: Question[] }[] = [
  { title: 'Your starting point', description: 'Every background has a path forward. Let’s start with yours.', questions: [
    { id: 'education', label: 'Highest education', options: ['12th or below', 'Diploma / ITI', 'B.Com / BBA', 'B.Tech / BCA / MCA', 'BA / Humanities', 'B.Sc / Other degree', 'B.Pharm / Life Sciences', 'LL.B / Law', 'B.Ed / Teaching'] },
    { id: 'experience', label: 'Total work experience', options: ['Fresher', 'Under 2 years', '2–5 years', '5+ years'] },
    { id: 'domain', label: 'Current or most familiar field', options: ['Still exploring', 'Technology', 'Finance / Accounts', 'Marketing / Sales', 'Design / Media', 'Customer operations', 'Education / Teaching', 'Pharmacy / Healthcare', 'Law / Legal', 'Core Engineering'] },
    { id: 'status', label: 'Where are you today?', options: ['Student', 'Looking for my first job', 'Employed', 'Returning after a break', 'Self-employed'] },
    { id: 'salary', label: 'Current annual salary (₹ lakh)', type: 'number', optional: true, hint: 'Optional. Used only to compare with your planning range.' },
    { id: 'location', label: 'City / state', type: 'text', hint: 'Used in your local job-search plan, not to infer your abilities.' },
  ] },
  { title: 'Your strengths', description: 'Answer for today, not where you think you should be.', questions: [
    { id: 'coding', label: 'Coding comfort', options: comfort },
    { id: 'maths', label: 'Maths & statistics', options: comfort },
    { id: 'communication', label: 'Explaining ideas to others', options: comfort },
    { id: 'creative', label: 'Creative thinking & visual work', options: comfort },
    { id: 'analysis', label: 'Solving problems with evidence', options: comfort },
    { id: 'detail', label: 'Working carefully with details', options: comfort },
  ] },
  { title: 'What draws you in', description: 'Find work that fits your interests as well as your skills.', questions: [
    { id: 'interest', label: 'Which work sounds most interesting?', options: ['Finding insights in data', 'Building software', 'Growing a business', 'Creating visual stories', 'Managing money', 'Helping customers', 'Keeping systems reliable', 'Teaching and mentoring', 'Healthcare and pharmacy', 'Legal and compliance', 'Industrial tech and engineering'] },
    { id: 'style', label: 'Preferred way of working', options: ['Deep independent focus', 'A mix of solo and teamwork', 'Frequent people interaction'] },
    { id: 'structure', label: 'How much structure do you like?', options: ['Clear processes', 'A balance', 'Open-ended problems'] },
    { id: 'english', label: 'Professional English comfort', options: comfort },
    { id: 'tools', label: 'Your strongest existing tool', options: ['None yet', 'Excel / Sheets', 'SQL / Power BI', 'Python / JavaScript', 'Figma / Adobe / Video tools', 'Tally / Accounting tools', 'CRM / Marketing tools', 'LMS / Classroom tools', 'MedDRA / Pharmacy ERP', 'Legal databases (SCC/Manupatra)', 'CAD / PLC tools'] },
    { id: 'portfolio', label: 'Evidence of your skills', options: ['Starting from scratch', 'Course exercises', 'One personal project', 'Multiple projects / professional work'] },
  ] },
  { title: 'Your destination', description: 'Tell us what a worthwhile career move looks like.', questions: [
    { id: 'target', label: 'Target annual salary', options: ['₹4 lakh', '₹8 lakh', '₹15 lakh', '₹25 lakh+'] },
    { id: 'goal', label: 'Your biggest priority', options: ['Get a job sooner', 'Long-term earning growth', 'A sustainable career switch', 'Freelance flexibility'] },
    { id: 'work', label: 'Preferred workplace', options: ['Office', 'Hybrid', 'Remote', 'Flexible'] },
    { id: 'relocate', label: 'Open to relocating?', options: ['Yes', 'Within my state', 'No'] },
    { id: 'employment', label: 'Preferred employment', options: ['Full-time role', 'Freelance / Contract', 'Either'] },
    { id: 'risk', label: 'Comfort with uncertain income', options: ['Need predictability', 'Some flexibility', 'Comfortable experimenting'] },
  ] },
  { title: 'Make it achievable', description: 'A useful plan respects your time, resources, and responsibilities.', questions: [
    { id: 'hours', label: 'Learning time each week', options: ['5 hours', '10 hours', '20 hours', '30 hours'] },
    { id: 'deadline', label: 'When would you like to switch?', options: ['3 months', '6 months', '12 months'] },
    { id: 'budget', label: 'Learning budget', options: ['Free resources only', 'Under ₹10,000', 'Can invest in certification'] },
    { id: 'device', label: 'Computer access', options: ['Own laptop / desktop', 'Shared computer', 'Phone only'] },
    { id: 'learning', label: 'How do you learn best?', options: ['Building projects', 'Structured courses', 'With a mentor / community'] },
    { id: 'shifts', label: 'Schedule flexibility', options: ['Daytime only', 'Flexible hours', 'Open to shifts / on-call'] },
  ] },
];

type Strength = 'coding' | 'maths' | 'communication' | 'creative' | 'analysis' | 'detail' | 'english';
type Track = { title: string; slug: string; domain: string; interest: string; tools: string; education: string; strengths: Record<Strength, number>; hours: number; salary: [number, number]; skills: string[]; projects: string[]; remote: boolean; freelance: boolean; people: boolean; structured: boolean; stretch: string; stretchSlug: string };

export const compassTracks: Track[] = [
  { title: 'Data Analytics', slug: 'data-analytics', domain: 'Technology', interest: 'Finding insights in data', tools: 'SQL / Power BI', education: 'B.Sc / Other degree', strengths: { coding: 2, maths: 3, communication: 2, creative: 1, analysis: 4, detail: 3, english: 2 }, hours: 220, salary: [3.5, 6.5], skills: ['SQL', 'Excel', 'Power BI', 'Statistics', 'Data storytelling'], projects: ['Clean a public sales dataset and document quality checks', 'Build a sales dashboard with five business KPIs', 'Analyse customer retention and present three recommendations'], remote: true, freelance: true, people: false, structured: true, stretch: 'Product Analytics', stretchSlug: 'product-management' },
  { title: 'Full-Stack Development', slug: 'full-stack-web', domain: 'Technology', interest: 'Building software', tools: 'Python / JavaScript', education: 'B.Tech / BCA / MCA', strengths: { coding: 4, maths: 2, communication: 2, creative: 2, analysis: 4, detail: 3, english: 2 }, hours: 420, salary: [4, 8], skills: ['JavaScript', 'React', 'Databases', 'API design', 'Testing'], projects: ['Build an accessible personal portfolio', 'Create a task app with authentication and a database', 'Deploy a booking app with tests and error handling'], remote: true, freelance: true, people: false, structured: false, stretch: 'Cloud Engineering', stretchSlug: 'cloud-computing' },
  { title: 'AI Agents & LLM Apps', slug: 'ai-agents-llm-apps', domain: 'Technology', interest: 'Building software', tools: 'Python / JavaScript', education: 'B.Tech / BCA / MCA', strengths: { coding: 4, maths: 3, communication: 3, creative: 2, analysis: 4, detail: 4, english: 3 }, hours: 380, salary: [8, 18], skills: ['Python', 'LangGraph', 'MCP Tools', 'Vector Databases', 'Prompt Architecture'], projects: ['Build an autonomous SQL query agent with self-correction', 'Deploy an enterprise document Q&A pipeline with guardrails'], remote: true, freelance: true, people: false, structured: false, stretch: 'AI Evaluation Architect', stretchSlug: 'ai-agent-evaluation-observability' },
  { title: 'Teaching & Pedagogy', slug: 'teaching-pedagogy', domain: 'Education / Teaching', interest: 'Teaching and mentoring', tools: 'LMS / Classroom tools', education: 'B.Ed / Teaching', strengths: { coding: 0, maths: 1, communication: 4, creative: 3, analysis: 3, detail: 3, english: 3 }, hours: 160, salary: [3.5, 7], skills: ['Classroom Management', 'Lesson Planning', 'Bloom\'s Taxonomy', 'EdTech Tools', 'Student Evaluation'], projects: ['Design a 4-week experiential unit plan aligned with NEP 2020', 'Record an interactive masterclass with live engagement triggers'], remote: false, freelance: true, people: true, structured: true, stretch: 'Educational Leadership', stretchSlug: 'educational-leadership' },
  { title: 'Pharmacy Practice & Dispensing', slug: 'pharmacy-practice', domain: 'Pharmacy / Healthcare', interest: 'Healthcare and pharmacy', tools: 'MedDRA / Pharmacy ERP', education: 'B.Pharm / Life Sciences', strengths: { coding: 0, maths: 2, communication: 3, creative: 0, analysis: 4, detail: 4, english: 2 }, hours: 180, salary: [3, 6], skills: ['Prescription Verification', 'Drug Interactions', 'Patient Counseling', 'Schedule H1 Compliance', 'Retail POS ERP'], projects: ['Audit 50 chronic illness prescriptions for contraindications', 'Develop a cold-chain storage and Schedule H1 compliance protocol'], remote: false, freelance: false, people: true, structured: true, stretch: 'Clinical Pharmacy', stretchSlug: 'clinical-pharmacy' },
  { title: 'Corporate Law & Contract Drafting', slug: 'corporate-law', domain: 'Law / Legal', interest: 'Legal and compliance', tools: 'Legal databases (SCC/Manupatra)', education: 'LL.B / Law', strengths: { coding: 0, maths: 1, communication: 4, creative: 1, analysis: 4, detail: 4, english: 4 }, hours: 260, salary: [5.5, 12], skills: ['Contract Drafting', 'Companies Act 2013', 'Legal Research', 'Due Diligence', 'M&A Deal Structures'], projects: ['Draft a Master Services Agreement with limitation of liability caps', 'Conduct a full legal due diligence audit on a target company'], remote: true, freelance: true, people: true, structured: true, stretch: 'Arbitration & Dispute Resolution', stretchSlug: 'arbitration-mediation' },
  { title: 'Accounting & GST Filing', slug: 'tally-gst', domain: 'Finance / Accounts', interest: 'Managing money', tools: 'Tally / Accounting tools', education: 'B.Com / BBA', strengths: { coding: 0, maths: 3, communication: 2, creative: 0, analysis: 3, detail: 4, english: 1 }, hours: 150, salary: [2.5, 4.5], skills: ['Bookkeeping', 'TallyPrime', 'GST Return Filing (GSTR-1/3B)', 'TDS Compliance', 'Bank Reconciliation'], projects: ['Create a company ledger with 50 transactions and prepare trial balance', 'Reconcile a purchase register with GSTR-2B and file mock GSTR-3B'], remote: false, freelance: true, people: false, structured: true, stretch: 'FP&A & Financial Modeling', stretchSlug: 'financial-analysis' },
  { title: 'Salesforce Administration', slug: 'salesforce-administration', domain: 'Technology', interest: 'Building software', tools: 'CRM / Marketing tools', education: 'B.Com / BBA', strengths: { coding: 1, maths: 2, communication: 3, creative: 1, analysis: 3, detail: 4, english: 3 }, hours: 220, salary: [4.5, 9], skills: ['Lightning App Builder', 'Flow Automation', 'Security & Roles', 'Data Loader', 'Reports & Dashboards'], projects: ['Build an automated customer onboarding workflow in Flow Builder', 'Configure security profiles and permission sets for a 50-user org'], remote: true, freelance: true, people: false, structured: true, stretch: 'ServiceNow Architecture', stretchSlug: 'servicenow-development' },
  { title: 'Industrial Automation & PLC', slug: 'industrial-automation-plc-scada', domain: 'Core Engineering', interest: 'Industrial tech and engineering', tools: 'CAD / PLC tools', education: 'Diploma / ITI', strengths: { coding: 2, maths: 3, communication: 1, creative: 1, analysis: 4, detail: 4, english: 1 }, hours: 250, salary: [3.8, 7.5], skills: ['Ladder Logic', 'Siemens TIA Portal', 'SCADA Mimics', 'VFD Motor Controls', 'Modbus Industrial Protocols'], projects: ['Program an automated sorting conveyor logic in Siemens TIA Portal', 'Configure a live SCADA telemetry monitoring dashboard with alarms'], remote: false, freelance: false, people: false, structured: true, stretch: 'Automotive AUTOSAR Embedded', stretchSlug: 'automotive-embedded-software-autosar' },
  { title: 'Digital Marketing & Growth', slug: 'digital-marketing', domain: 'Marketing / Sales', interest: 'Growing a business', tools: 'CRM / Marketing tools', education: 'B.Com / BBA', strengths: { coding: 0, maths: 2, communication: 4, creative: 3, analysis: 3, detail: 2, english: 3 }, hours: 180, salary: [2.8, 5.5], skills: ['SEO', 'Copywriting', 'Campaign analytics', 'Audience research', 'Experiment design'], projects: ['Audit a local business website and create an SEO plan', 'Build a four-week content calendar with sample posts', 'Design a campaign and measurement dashboard using sample data'], remote: true, freelance: true, people: true, structured: false, stretch: 'Revenue Operations (RevOps)', stretchSlug: 'revops-sales-operations' },
  { title: 'Visual & UI Design', slug: 'graphic-figma', domain: 'Design / Media', interest: 'Creating visual stories', tools: 'Figma / Adobe / Video tools', education: 'BA / Humanities', strengths: { coding: 0, maths: 1, communication: 3, creative: 4, analysis: 2, detail: 4, english: 2 }, hours: 240, salary: [3, 6], skills: ['Figma', 'Typography', 'Accessibility', 'User research', 'Prototyping'], projects: ['Redesign a local service landing page', 'Create a reusable accessible UI component kit', 'Prototype a booking flow and test it with five people'], remote: true, freelance: true, people: false, structured: false, stretch: 'Design Systems Engineering', stretchSlug: 'ux-research-design-systems' },
  { title: 'Customer Support', slug: 'bpo-support', domain: 'Customer operations', interest: 'Helping customers', tools: 'CRM / Marketing tools', education: '12th or below', strengths: { coding: 0, maths: 1, communication: 4, creative: 1, analysis: 2, detail: 2, english: 3 }, hours: 90, salary: [2.4, 4.2], skills: ['Customer communication', 'CRM', 'Ticket triage', 'Conflict resolution', 'Knowledge-base writing'], projects: ['Write responses to ten sample support tickets', 'Create a help centre for a fictional app', 'Record three mock customer calls and review your responses'], remote: false, freelance: false, people: true, structured: true, stretch: 'Customer Operations Analytics', stretchSlug: 'data-analytics' },
  { title: 'Video Editing & Motion Media', slug: 'video-editing', domain: 'Design / Media', interest: 'Creating visual stories', tools: 'Figma / Adobe / Video tools', education: 'BA / Humanities', strengths: { coding: 0, maths: 0, communication: 2, creative: 4, analysis: 1, detail: 4, english: 1 }, hours: 160, salary: [2.5, 5], skills: ['Editing workflow', 'Pacing', 'Sound', 'Colour correction', 'Client briefs'], projects: ['Edit a 60-second story from freely licensed footage', 'Turn a practice interview into three captioned clips', 'Produce a mock brand video with a revision log'], remote: true, freelance: true, people: false, structured: false, stretch: 'Real-Time 3D & Unreal Engine', stretchSlug: 'unreal-engine-game-development' },
];

export const isAnswered = (q: Question, answers: Answers) => {
  const value = answers[q.id]?.trim();
  if (!value) return !!q.optional;
  if (q.options) return q.options.includes(value);
  if (q.type === 'number') return Number.isFinite(Number(value)) && Number(value) >= 0 && Number(value) <= 1000;
  return value.length >= 2 && value.length <= 100;
};

export function rankCareers(a: Answers) {
  const missing = compassSteps.flatMap(s => s.questions).filter(q => !isAnswered(q, a));
  if (missing.length) throw new Error('Complete all required signals with valid answers.');
  const level = (id: string) => Math.max(0, comfort.indexOf(a[id]));
  return compassTracks.map(track => {
    const gaps = (Object.entries(track.strengths) as [Strength, number][]).map(([key, need]) => ({ key, gap: Math.max(0, need - level(key)) })).filter(x => x.gap > 0);
    const ability = 1 - gaps.reduce((sum, x) => sum + x.gap, 0) / Object.values(track.strengths).reduce((s, n) => s + n, 0);
    const toolMatch = a.tools === track.tools || (a.tools === 'Excel / Sheets' && ['data-analytics', 'tally-gst'].includes(track.slug));
    const relevant = a.domain === track.domain;
    const portfolio = ['Starting from scratch', 'Course exercises', 'One personal project', 'Multiple projects / professional work'].indexOf(a.portfolio);
    const experience = ['Fresher', 'Under 2 years', '2–5 years', '5+ years'].indexOf(a.experience);
    const learningHours = Math.round(track.hours * (1.2 - ability * .25 - (toolMatch ? .12 : 0) - portfolio * .035 - (relevant ? experience * .025 : 0)));
    const weekly = parseInt(a.hours) || 10;
    const access = a.device === 'Shared computer' ? .75 : a.device === 'Phone only' ? .45 : 1;
    const weeks = Math.ceil(learningHours / (weekly * access));
    const deadlineWeeks = (parseInt(a.deadline) || 6) * 4.33;
    const readiness = Math.min(1, deadlineWeeks / weeks);
    const interest = a.interest === track.interest ? 1 : .25;
    const workFit = a.work === 'Remote' && !track.remote ? .2 : 1;
    const employmentFit = a.employment === 'Freelance / Contract' && !track.freelance ? .2 : 1;
    const styleFit = a.style === 'A mix of solo and teamwork' || (a.style === 'Frequent people interaction') === track.people ? 1 : .4;
    const structureFit = a.structure === 'A balance' || (a.structure === 'Clear processes') === track.structured ? 1 : .4;
    const targetSalaryNum = Number((a.target || '4').replace(/[^0-9]/g, '')) || 4;
    const salaryFit = Math.min(1, track.salary[1] / targetSalaryNum);
    const goalFit = a.goal === 'Get a job sooner' ? readiness : a.goal === 'Long-term earning growth' ? salaryFit : a.goal === 'Freelance flexibility' ? Number(track.freelance) : (ability + Number(relevant)) / 2;
    const constraints = [workFit, employmentFit, a.relocate === 'No' && !track.remote ? .5 : 1, a.risk === 'Need predictability' && a.employment === 'Freelance / Contract' ? .3 : 1, a.budget === 'Free resources only' && track.slug === 'devops-sre' ? .6 : 1, access, a.shifts === 'Daytime only' && ['bpo-support', 'industrial-automation-plc-scada'].includes(track.slug) ? .5 : 1];
    const dimensions = { 'Strengths': Math.round(ability * 100), 'Interests': Math.round(interest * 100), 'Background': Math.round((Number(relevant) * .4 + Number(toolMatch) * .4 + (a.education === track.education ? .2 : .1)) * 100), 'Work preferences': Math.round((styleFit + structureFit + constraints.reduce((s, n) => s + n, 0) / constraints.length) / 3 * 100), 'Timeline': Math.round(readiness * 100), 'Goals': Math.round((goalFit + salaryFit) / 2 * 100) };
    const score = Math.round(dimensions.Strengths * .3 + dimensions.Interests * .2 + dimensions.Background * .1 + dimensions['Work preferences'] * .15 + dimensions.Timeline * .15 + dimensions.Goals * .1);
    const reasons = [a.interest === track.interest ? `Matches your interest in ${a.interest.toLowerCase()}.` : 'An adjacent path to explore alongside your main interest.', ability >= .7 ? 'Your current strengths cover most of the foundation.' : 'A foundation-first plan can address the gaps below.', relevant ? `Builds on your ${a.domain.toLowerCase()} background.` : 'Projects will help demonstrate your move into a new field.', toolMatch ? `Your ${a.tools} experience gives you a head start.` : `Start with ${track.skills[0]} before adding specialist tools.`];
    const cautions = [weeks > deadlineWeeks ? `Your ${a.deadline} goal is tighter than this ${weeks}-week learning plan. Increase study time or extend the deadline.` : '', a.device === 'Phone only' ? 'Arrange regular computer access before starting portfolio projects; a phone alone is insufficient.' : '', a.work === 'Remote' && !track.remote ? 'Remote-only openings may limit this path; include local employers if possible.' : '', salaryFit < 1 ? 'Your salary target is above this entry-level planning range; treat it as a longer-term milestone.' : '', a.shifts === 'Daytime only' && ['bpo-support', 'industrial-automation-plc-scada'].includes(track.slug) ? 'Filter out shift-based or on-call roles.' : '', a.salary && Number(a.salary) > track.salary[1] ? 'This switch may initially pay less than your current salary.' : ''].filter(Boolean);
    const learningPlan = a.learning === 'Building projects' ? 'Learn one concept, then immediately apply it to the projects below.' : a.learning === 'Structured courses' ? 'Follow one structured course and complete a portfolio milestone after each module.' : 'Join a study community and arrange a weekly project review.';
    return { ...track, score, dimensions, weeks, learningHours, gaps, reasons, cautions, learningPlan, searchPlan: `${a.work} ${a.employment?.toLowerCase() || 'full-time'} opportunities in ${(a.location || 'your area').trim()}${a.relocate !== 'No' ? ' and locations you can relocate to' : ''}. ${a.status === 'Student' || a.status === 'Looking for my first job' ? 'Include internships and trainee roles.' : a.status === 'Returning after a break' ? 'Include returnships and explain your recent portfolio work.' : 'Use transferable experience in your applications.'}`, budgetPlan: a.budget === 'Free resources only' ? 'Use free documentation, community learning, and local or free-tier tools. Avoid paid cloud resources.' : a.budget === 'Under ₹10,000' ? 'Prioritise one practical course; reserve the rest for project needs.' : 'Build projects first; choose a certification only when target roles request it.' };
  }).sort((a, b) => b.score - a.score || a.weeks - b.weeks);
}
export type CareerResult = ReturnType<typeof rankCareers>[number];
