import { RoadmapDetail } from './roadmapsData';

export const extraRoadmapsList: RoadmapDetail[] = [
  {
    slug: 'digital-marketing-plan',
    title: 'Digital & Performance Marketing 12-Week Blueprint',
    category: 'business',
    categoryLabel: 'Business & Growth',
    targetRole: 'Performance Marketer / Paid Media Lead',
    duration: '12 Weeks',
    weeklyCommitment: '10 Hours / Week',
    difficulty: 'Beginner',
    heroImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80',
    overview: 'Master paid user acquisition, ROAS calculations, landing page conversion copywriting, Meta Ads Manager, and GA4 telemetry.',
    salaryExpectation: '₹3.8L – ₹12.0L LPA',
    phases: [
      {
        phaseTitle: 'Phase 1: Search Intent & Technical SEO',
        duration: 'Weeks 1 – 4',
        badgeColor: 'brand',
        description: 'Conduct keyword intent mapping and technical on-page SEO optimization.',
        milestones: ['Keyword difficulty analysis in Ahrefs', 'Technical site health audit & schema markup', 'Writing high-ranking pillar articles'],
        projectIdea: 'Full SEO Content Growth Audit for an Indian D2C Brand.',
        resources: [{ name: 'Ahrefs Academy', type: 'Course' }]
      },
      {
        phaseTitle: 'Phase 2: Meta Ads & High-ROAS Direct Response',
        duration: 'Weeks 5 – 8',
        badgeColor: 'purple',
        description: 'Set up profitable Meta CBO campaigns, pixel tracking, and UGC video ads.',
        milestones: ['Pixel standard events & custom conversions', 'UGC script frameworks and direct response copy', 'Scaling ad budgets while maintaining >3.5x ROAS'],
        projectIdea: 'Live ₹10k Meta Ad Campaign Setup & Optimization Case Study.',
        resources: [{ name: 'Meta Blueprint', type: 'Certification' }]
      },
      {
        phaseTitle: 'Phase 3: Google Ads, GA4 & Omnichannel Retention',
        duration: 'Weeks 9 – 12',
        badgeColor: 'emerald',
        description: 'Run Google Search & Performance Max ads and track full-funnel conversions in GA4.',
        milestones: ['PMax asset groups and negative keyword lists', 'GA4 custom event exploration funnels', 'WhatsApp automated abandoned cart sequences'],
        projectIdea: 'Omnichannel D2C Acquisition & Retention Playbook.',
        resources: [{ name: 'Google Skillshop', type: 'Certification' }]
      }
    ],
    careerTransitions: [
      { from: 'Traditional Sales Executive', to: 'Digital Performance Marketer', advantage: 'Customer persuasion and objection handling translate directly into high-converting ad copy.' }
    ],
    checklist: ['Ran live paid ad campaign with documented positive ROAS', 'Google Ads & Meta Blueprint certified', 'GA4 custom conversion dashboard portfolio published']
  },
  {
    slug: 'cybersecurity-soc-plan',
    title: 'Cybersecurity SOC Analyst 16-Week Blueprint',
    category: 'tech',
    categoryLabel: 'BFSI & Compliance',
    targetRole: 'SOC Tier 1 Analyst / Incident Responder',
    duration: '16 Weeks',
    weeklyCommitment: '12 Hours / Week',
    difficulty: 'Intermediate',
    heroImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=900&q=80',
    overview: 'Learn SIEM log analysis in Splunk, packet inspection in Wireshark, threat hunting, and CERT-In compliance protocols.',
    salaryExpectation: '₹6.0L – ₹20.0L LPA',
    phases: [
      {
        phaseTitle: 'Phase 1: Networking & Linux Security Foundations',
        duration: 'Weeks 1 – 5',
        badgeColor: 'brand',
        description: 'Understand TCP/IP handshakes, DNS spoofing, Wireshark PCAP analysis, and Linux logs.',
        milestones: ['Wireshark deep packet analysis of DDoS and SYN floods', 'Linux /var/log inspection and auth logs', 'Nmap port scanning and banner grabbing'],
        projectIdea: 'PCAP Forensic Analysis of a Malware Infiltration.',
        resources: [{ name: 'TryHackMe Pre-Security Path', type: 'Practice' }]
      },
      {
        phaseTitle: 'Phase 2: Splunk SIEM & Threat Triage',
        duration: 'Weeks 6 – 11',
        badgeColor: 'purple',
        description: 'Aggregate enterprise logs, write SPL queries, and triage security alerts.',
        milestones: ['Splunk Search Processing Language (SPL)', 'MITRE ATT&CK framework mapping', 'Brute-force and privilege escalation alert rules'],
        projectIdea: 'Enterprise SOC Detection Ruleset Configuration.',
        resources: [{ name: 'Splunk Free Training', type: 'Tutorial' }]
      },
      {
        phaseTitle: 'Phase 3: Incident Response & Security+ Prep',
        duration: 'Weeks 12 – 16',
        badgeColor: 'emerald',
        description: 'Handle containment, eradication, post-incident reporting, and CERT-In compliance.',
        milestones: ['Incident response lifecycle (NIST SP 800-61)', 'CompTIA Security+ mock exam drills', 'Writing professional Incident Response Executive Reports'],
        projectIdea: 'Ransomware Outbreak Incident Response Playbook.',
        resources: [{ name: 'CompTIA Security+ Guide', type: 'Certification' }]
      }
    ],
    careerTransitions: [
      { from: 'Network Support / Sysadmin', to: 'SOC Analyst', advantage: 'Strong IP networking intuition speeds up packet inspection and firewall analysis.' }
    ],
    checklist: ['Completed 30+ TryHackMe / HackTheBox SOC rooms', 'Built 5 custom Splunk detection dashboards', 'Prepared for CompTIA Security+ certification']
  },
  {
    slug: 'video-editing-creators-plan',
    title: 'Video Editing for Creators 8-Week Blueprint',
    category: 'vocational',
    categoryLabel: 'Creator Economy Boom',
    targetRole: 'Short-Form Video Editor / YouTube Producer',
    duration: '8 Weeks',
    weeklyCommitment: '10 Hours / Week',
    difficulty: 'Beginner',
    heroImage: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=900&q=80',
    overview: 'Master Premiere Pro, DaVinci Resolve, retention pacing, sound design SFX, and kinetic typography for top creators and brands.',
    salaryExpectation: '₹3.6L – ₹10.0L LPA / ₹5k per Reel',
    phases: [
      {
        phaseTitle: 'Phase 1: Timeline Hygiene & The 3-Second Hook',
        duration: 'Weeks 1 – 3',
        badgeColor: 'brand',
        description: 'Edit fast-paced short-form videos with zero dead air.',
        milestones: ['Premiere Pro / CapCut shortcuts and ripple trims', 'Scripting visual pattern interrupts in the first 3 seconds', 'Kinetic animated captions and word-by-word highlight colors'],
        projectIdea: '3 High-Retention 60-Second Viral Instagram Reels.',
        resources: [{ name: 'Creator Editing Breakdown Guides', type: 'Tutorial' }]
      },
      {
        phaseTitle: 'Phase 2: Sound Design, SFX & Motion Graphics',
        duration: 'Weeks 4 – 6',
        badgeColor: 'purple',
        description: 'Layer whooshes, risers, pop SFX, and After Effects zooms.',
        milestones: ['Multi-track audio ducking and ambient soundscapes', 'Green screen overlays and split-screen reactions', 'DaVinci Resolve color grading and LUT application'],
        projectIdea: '5-Minute YouTube Educational Documentary with rich sound effects.',
        resources: [{ name: 'Epidemic Sound Library', type: 'Audio Assets' }]
      },
      {
        phaseTitle: 'Phase 3: Showreel & High-Ticket Client Outreach',
        duration: 'Weeks 7 – 8',
        badgeColor: 'emerald',
        description: 'Build a 60-second video showreel and pitch top creators on X and Instagram.',
        milestones: ['Creating an unforgettable 60-second video showreel', 'Cold video pitch scripts offering 1 free trial edit', 'Pricing models: Per-video vs monthly retainers'],
        projectIdea: '60-Second Video Showreel & 10 Creator Pitch Submissions.',
        resources: [{ name: 'Creator Outreach Swipe File', type: 'Templates' }]
      }
    ],
    careerTransitions: [
      { from: 'Content Consumer', to: 'High-Paid Creator Editor', advantage: 'Familiarity with trending viral audio and visual memes makes editing intuitive.' }
    ],
    checklist: ['Published a 60-second video showreel on Google Drive/YouTube', 'Mastered Premiere Pro shortcuts and multi-track audio ducking', 'Secured first 3 freelance client video editing orders']
  },
  {
    slug: 'product-management-plan',
    title: 'Product Management (APM to PM) 12-Week Blueprint',
    category: 'business',
    categoryLabel: 'Product & Leadership',
    targetRole: 'Associate Product Manager (APM) / Product Lead',
    duration: '12 Weeks',
    weeklyCommitment: '12 Hours / Week',
    difficulty: 'Intermediate',
    heroImage: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=900&q=80',
    overview: 'Learn customer empathy discovery, writing thorough Product Requirement Documents (PRDs), Agile sprint planning in Jira, and North Star metric tracking.',
    salaryExpectation: '₹12.0L – ₹32.0L LPA',
    phases: [
      {
        phaseTitle: 'Phase 1: User Discovery & Jobs-to-be-Done (JTBD)',
        duration: 'Weeks 1 – 4',
        badgeColor: 'brand',
        description: 'Conduct user interviews and map customer journeys.',
        milestones: ['Conducting unbiased user discovery interviews', 'Jobs-to-be-done (JTBD) customer journey mapping', 'Identifying core friction bottlenecks and drop-offs'],
        projectIdea: 'User Drop-Off Root Cause Teardown for an Indian FinTech App.',
        resources: [{ name: 'The Mom Test Book Summary', type: 'Book' }]
      },
      {
        phaseTitle: 'Phase 2: Writing PRDs & Agile Sprint Execution',
        duration: 'Weeks 5 – 8',
        badgeColor: 'purple',
        description: 'Author detailed PRDs, Figma wireframes, and Jira backlogs.',
        milestones: ['Writing comprehensive PRDs with edge cases', 'Figma lo-fi wireframes and user flow charts', 'RICE feature prioritization and Jira sprint backlogs'],
        projectIdea: 'Comprehensive PRD for a WhatsApp Quick Commerce Feature.',
        resources: [{ name: 'Lenny’s Product Newsletter', type: 'Resource' }]
      },
      {
        phaseTitle: 'Phase 3: Product Analytics & A/B Experimentation',
        duration: 'Weeks 9 – 12',
        badgeColor: 'emerald',
        description: 'Define North Star metrics, retention curves, and A/B test experiments.',
        milestones: ['Retention cohort curves and LTV/CAC dynamics', 'Designing statistically significant A/B split tests', 'Go-to-Market (GTM) strategy and executive stakeholder pitching'],
        projectIdea: 'Complete A/B Experiment Design & Product Portfolio Pitch Deck.',
        resources: [{ name: 'Mixpanel Analytics Handbook', type: 'Guide' }]
      }
    ],
    careerTransitions: [
      { from: 'Software Developer / QA', to: 'Technical Product Manager (TPM)', advantage: 'Engineering background allows evaluating technical feasibility and communicating seamlessly with devs.' }
    ],
    checklist: ['Authored 2 thorough PRDs hosted on Notion', 'Designed an interactive Figma prototype and user flow map', 'Completed a comprehensive product teardown deck']
  }
];
