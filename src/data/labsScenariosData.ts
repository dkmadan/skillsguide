import { LabScenarioVariant, LabDifficulty } from '../lib/labs/types';

export const pilotScenarios: Record<string, Record<LabDifficulty, LabScenarioVariant>> = {
  // =========================================================================
  // LAB 19: Marketing Budget Simulator
  // =========================================================================
  'marketing-budget-simulator': {
    beginner: {
      id: 'mbs-001',
      labSlug: 'marketing-budget-simulator',
      variant: 'beginner',
      scenarioVersion: '1.0.0',
      title: 'B2B SaaS Launch Campaign (Balanced Budget)',
      instructions: `You have an initial monthly growth budget of 100,000 credits to allocate across 3 marketing channels: Meta Ads, Google Search Ads, and LinkedIn Sponsored Content.

Your target is to produce at least 150 qualified sales leads while keeping Cost Per Lead (CPL) below 700 credits.
- Keep total allocation exactly or below 100,000 credits.
- Diversify across at least 2 channels (do not put 100% into a single channel).
- Advance the 30-day simulation clock to observe daily lead velocity and conversion performance.`,
      prerequisites: [
        'Understand CPM (Cost per Thousand Impressions)',
        'Understand CTR (Click-Through Rate = Clicks / Impressions)',
        'Understand CPL (Cost per Lead = Total Spend / Total Leads)'
      ],
      expectedOutput: [
        'Total budget allocated <= 100,000 credits',
        'At least 150 qualified leads generated over 30 days',
        'Average CPL below 700 credits',
        'Balanced multi-channel split with no single channel above 75%'
      ],
      allowedActions: ['set_channel_budget', 'select_creative_variant', 'advance_simulation', 'reset_simulation'],
      publicFixture: {
        totalBudgetLimit: 100000,
        simulationDays: 30,
        channels: [
          {
            id: 'meta',
            name: 'Meta Ads (Facebook & Instagram)',
            cpm: 120, // 120 credits per 1,000 impressions
            ctr: 0.018, // 1.8%
            conversionRate: 0.040, // 4.0%
            creativeVariants: [
              { id: 'meta_v1', label: 'Video Showcase (High Engagement)', ctrBonus: 0.003, convBonus: 0.005 },
              { id: 'meta_v2', label: 'Static Carousels (Broad Reach)', ctrBonus: 0.0, convBonus: 0.0 }
            ],
            recommendedMin: 15000,
            recommendedMax: 45000
          },
          {
            id: 'google',
            name: 'Google Intent Search Ads',
            cpm: 240, // 240 credits per 1,000 impressions
            ctr: 0.038, // 3.8%
            conversionRate: 0.065, // 6.5%
            creativeVariants: [
              { id: 'goog_v1', label: 'High-Intent Solution Keywords', ctrBonus: 0.005, convBonus: 0.010 },
              { id: 'goog_v2', label: 'Broad Competitor Alternative Terms', ctrBonus: -0.005, convBonus: -0.005 }
            ],
            recommendedMin: 20000,
            recommendedMax: 50000
          },
          {
            id: 'linkedin',
            name: 'LinkedIn Sponsored Updates',
            cpm: 460, // 460 credits per 1,000 impressions
            ctr: 0.014, // 1.4%
            conversionRate: 0.095, // 9.5% high-intent B2B conversion
            creativeVariants: [
              { id: 'li_v1', label: 'Whitepaper & Case Study Download', ctrBonus: 0.002, convBonus: 0.015 },
              { id: 'li_v2', label: 'Product Tour Direct CTA', ctrBonus: -0.002, convBonus: -0.005 }
            ],
            recommendedMin: 15000,
            recommendedMax: 40000
          }
        ]
      }
    },
    intermediate: {
      id: 'mbs-002',
      labSlug: 'marketing-budget-simulator',
      variant: 'intermediate',
      scenarioVersion: '1.0.0',
      title: 'Q4 Mid-Market Enterprise Push',
      instructions: `Allocate 100,000 credits to generate at least 175 qualified leads while maintaining an overall CPL below 600 credits. LinkedIn rates are elevated due to Q4 competition.`,
      prerequisites: ['B2B multi-touch attribution', 'Creative fatigue adjustments'],
      expectedOutput: ['>= 175 qualified leads', 'Average CPL < 600 credits', 'No budget overspend'],
      allowedActions: ['set_channel_budget', 'select_creative_variant', 'advance_simulation', 'reset_simulation'],
      publicFixture: {
        totalBudgetLimit: 100000,
        simulationDays: 30,
        channels: [
          { id: 'meta', name: 'Meta Ads', cpm: 140, ctr: 0.020, conversionRate: 0.042, creativeVariants: [{ id: 'meta_v1', label: 'UGC Video Review', ctrBonus: 0.004, convBonus: 0.006 }] },
          { id: 'google', name: 'Google Search Ads', cpm: 260, ctr: 0.040, conversionRate: 0.070, creativeVariants: [{ id: 'goog_v1', label: 'Exact Match Case Studies', ctrBonus: 0.006, convBonus: 0.012 }] },
          { id: 'linkedin', name: 'LinkedIn Sponsored InMail', cpm: 520, ctr: 0.015, conversionRate: 0.100, creativeVariants: [{ id: 'li_v1', label: 'Executive Thought Leadership', ctrBonus: 0.003, convBonus: 0.015 }] }
        ]
      }
    },
    challenge: {
      id: 'mbs-003',
      labSlug: 'marketing-budget-simulator',
      variant: 'challenge',
      scenarioVersion: '1.0.0',
      title: 'Hyper-Growth Scaled Acquisition with Strict CPA Caps',
      instructions: `Maximize leads with strict channel constraints: Meta must receive at least 20,000 credits, and total lead count must exceed 190 with CPL < 550.`,
      prerequisites: ['Full-funnel optimization', 'Cross-channel synergy'],
      expectedOutput: ['Total leads >= 190', 'CPL <= 550', 'Meta budget >= 20,000'],
      allowedActions: ['set_channel_budget', 'select_creative_variant', 'advance_simulation', 'reset_simulation'],
      publicFixture: {
        totalBudgetLimit: 100000,
        simulationDays: 30,
        channels: [
          { id: 'meta', name: 'Meta Ads', cpm: 130, ctr: 0.022, conversionRate: 0.045, creativeVariants: [{ id: 'meta_v1', label: 'Interactive Quiz Funnel', ctrBonus: 0.005, convBonus: 0.008 }] },
          { id: 'google', name: 'Google Search Ads', cpm: 250, ctr: 0.042, conversionRate: 0.072, creativeVariants: [{ id: 'goog_v1', label: 'High Intent Solutions', ctrBonus: 0.006, convBonus: 0.012 }] },
          { id: 'linkedin', name: 'LinkedIn Sponsored', cpm: 480, ctr: 0.016, conversionRate: 0.098, creativeVariants: [{ id: 'li_v1', label: 'Enterprise ROI Calculator', ctrBonus: 0.004, convBonus: 0.018 }] }
        ]
      }
    }
  },

  // =========================================================================
  // LAB 20: SEO Snapshot Audit Lab
  // =========================================================================
  'seo-snapshot-audit-lab': {
    beginner: {
      id: 'seo-001',
      labSlug: 'seo-snapshot-audit-lab',
      variant: 'beginner',
      scenarioVersion: '1.0.0',
      title: '20-Page SaaS Platform Information Architecture Audit',
      instructions: `Audit this 20-page website snapshot. The site has suffered ranking drops following a recent migration.
Inspect the Page Hierarchy, Metadata, and Internal Link Graph to resolve all 4 critical technical issues:
1. Identify and fix 2 pages with duplicate <title> tags.
2. Provide a descriptive meta description for the pricing page missing its snippet.
3. Discover the orphan page (/guides/data-engineering) that has 0 internal inbound links, and add an internal link from /skills/data-analytics.
4. Locate the broken internal 404 hyperlink (/tools/old-calc) and update its target to /tools/salary-calculator.`,
      prerequisites: [
        'Title tag uniqueness and length (< 60 chars)',
        'Meta description best practices (120-160 chars)',
        'Internal link crawlability and orphan pages'
      ],
      expectedOutput: [
        'Zero duplicate title tags across the 20 pages',
        'Zero missing meta descriptions',
        'Zero orphan pages (all pages reachable from homepage)',
        'Zero 404 broken internal link targets'
      ],
      allowedActions: ['update_page_title', 'update_meta_description', 'add_internal_link', 'fix_broken_link'],
      publicFixture: {
        totalPages: 20,
        pages: [
          { id: 'p1', path: '/', title: 'SkillsGuide - Empower Your Career Journey', desc: 'Master high-income in-demand tech and business skills with career roadmaps and salary benchmarks.', inboundCount: 19, status: 200, linksTo: ['/skills/data-analytics', '/skills/full-stack-web', '/pricing', '/about'] },
          { id: 'p2', path: '/skills/data-analytics', title: 'Data Analytics Career Roadmap & Salary India', desc: 'Comprehensive guide to becoming a Data Analyst in India. Skills, tools, and salary benchmarks.', inboundCount: 5, status: 200, linksTo: ['/skills/sql', '/skills/power-bi', '/pricing'] },
          { id: 'p3', path: '/skills/full-stack-web', title: 'Full-Stack Web Developer Career Guide', desc: 'Step-by-step roadmap to modern full-stack web development with React, Node, and TypeScript.', inboundCount: 4, status: 200, linksTo: ['/skills/frontend', '/skills/backend', '/pricing'] },
          { id: 'p4', path: '/pricing', title: 'SkillsGuide Pricing - Transparent Career Plans', desc: '', inboundCount: 3, status: 200, linksTo: ['/contact', '/about', '/tools/old-calc'] }, // Missing meta desc & has broken link!
          { id: 'p5', path: '/about', title: 'About Us - SkillsGuide Open Education Mission', desc: 'Learn about our mission to provide high quality, accessible career blueprints for Indian learners.', inboundCount: 3, status: 200, linksTo: ['/contact'] },
          { id: 'p6', path: '/contact', title: 'Contact SkillsGuide Team & Mentors', desc: 'Get in touch with our editorial and skilling advisors.', inboundCount: 2, status: 200, linksTo: ['/'] },
          { id: 'p7', path: '/skills/sql', title: 'SQL for Data Analysis & Engineering Guide', desc: 'Master SQL queries, joins, window functions, and relational schema modeling.', inboundCount: 2, status: 200, linksTo: ['/skills/data-analytics'] },
          { id: 'p8', path: '/skills/power-bi', title: 'Power BI & DAX Business Intelligence Guide', desc: 'Build enterprise BI dashboards, calculate measures, and design executive reporting views.', inboundCount: 2, status: 200, linksTo: ['/skills/data-analytics'] },
          { id: 'p9', path: '/skills/frontend', title: 'Frontend Engineering Career Blueprint', desc: 'HTML, CSS, React, and accessibility standards for modern web engineering.', inboundCount: 2, status: 200, linksTo: ['/skills/full-stack-web'] },
          { id: 'p10', path: '/skills/backend', title: 'Frontend Engineering Career Blueprint', desc: 'Node.js, Express, databases, and microservices backend blueprint.', inboundCount: 2, status: 200, linksTo: ['/skills/full-stack-web'] }, // DUPLICATE TITLE with p9!
          { id: 'p11', path: '/tools/salary-calculator', title: 'Indian Salary & Take-Home In-Hand Pay Calculator', desc: 'Calculate take-home monthly salary from CTC with PF, gratuity, and new tax regime breakdown.', inboundCount: 1, status: 200, linksTo: ['/pricing'] },
          { id: 'p12', path: '/guides/data-engineering', title: 'Data Engineering Pipelines & Kafka Architecture', desc: 'Learn Apache Spark, Airflow, Snowflake, and streaming data pipelines from scratch.', inboundCount: 0, status: 200, linksTo: ['/skills/data-analytics'] }, // ORPHAN PAGE (0 inbound)!
          { id: 'p13', path: '/glossary', title: 'Interactive Skilling & Tech Jargon Glossary', desc: 'Demystify 100+ modern technology and career concepts in simple plain English.', inboundCount: 1, status: 200, linksTo: ['/'] },
          { id: 'p14', path: '/roadmaps', title: 'Step-by-Step Career Roadmaps & Blueprints', desc: 'Structured week-by-week learning timelines for high-growth tech and vocational careers.', inboundCount: 2, status: 200, linksTo: ['/skills/data-analytics', '/skills/full-stack-web'] },
          { id: 'p15', path: '/compare', title: 'Skill vs Skill Side-by-Side Comparisons', desc: 'Compare Python vs Java, React vs Vue, AWS vs Azure to make informed career choices.', inboundCount: 1, status: 200, linksTo: ['/'] },
          { id: 'p16', path: '/terms', title: 'Terms of Use & Platform Policies', desc: 'Read our platform terms of service and educational use conditions.', inboundCount: 1, status: 200, linksTo: ['/privacy'] },
          { id: 'p17', path: '/privacy', title: 'Privacy Policy & Data Protection Notice', desc: 'How we collect, protect, and respect learner data under DPDP standards.', inboundCount: 2, status: 200, linksTo: ['/terms'] },
          { id: 'p18', path: '/disclaimer', title: 'Salary Data Methodology & Disclaimer', desc: 'Understand our data collection methodology and source-linked benchmarks.', inboundCount: 1, status: 200, linksTo: ['/about'] },
          { id: 'p19', path: '/tools/career-compass', title: 'Career Compass Quiz - Discover Your Top Career Fit', desc: 'Answer 20 diagnostic questions to uncover your high-ROI career trajectory.', inboundCount: 1, status: 200, linksTo: ['/roadmaps'] },
          { id: 'p20', path: '/tools/ats-resume', title: 'ATS Resume Checklist & Action Verbs Guide', desc: 'Make your resume machine-readable and highlight quantified impact metrics.', inboundCount: 1, status: 200, linksTo: ['/skills/full-stack-web'] }
        ],
        knownIssues: [
          { type: 'duplicate_title', pageA: '/skills/frontend', pageB: '/skills/backend', severity: 'high' },
          { type: 'missing_description', page: '/pricing', severity: 'medium' },
          { type: 'orphan_page', page: '/guides/data-engineering', severity: 'high' },
          { type: 'broken_link', sourcePage: '/pricing', brokenUrl: '/tools/old-calc', correctedUrl: '/tools/salary-calculator', severity: 'high' }
        ]
      }
    },
    intermediate: {
      id: 'seo-002',
      labSlug: 'seo-snapshot-audit-lab',
      variant: 'intermediate',
      scenarioVersion: '1.0.0',
      title: 'E-Commerce Skilling Subdomain Re-Architecture',
      instructions: `Audit 20 catalog pages with canonical loop and schema hierarchy defects.`,
      prerequisites: ['Canonicalization', 'Crawl depth budget'],
      expectedOutput: ['Resolved orphan pages', 'Fixed duplicate H1 and title tags'],
      allowedActions: ['update_page_title', 'update_meta_description', 'add_internal_link', 'fix_broken_link'],
      publicFixture: { totalPages: 20, pages: [] }
    },
    challenge: {
      id: 'seo-003',
      labSlug: 'seo-snapshot-audit-lab',
      variant: 'challenge',
      scenarioVersion: '1.0.0',
      title: 'International Multi-Locale Site Migration',
      instructions: `Resolve hreflang inconsistencies, internal redirection chains, and orphan regional pages.`,
      prerequisites: ['Hreflang validation', 'Redirect chain resolution'],
      expectedOutput: ['Zero redirect chains', 'Zero broken internal links'],
      allowedActions: ['update_page_title', 'update_meta_description', 'add_internal_link', 'fix_broken_link'],
      publicFixture: { totalPages: 20, pages: [] }
    }
  },

  // =========================================================================
  // LAB 29: Executive Office Prioritization Lab
  // =========================================================================
  'executive-office-prioritization-lab': {
    beginner: {
      id: 'eop-001',
      labSlug: 'executive-office-prioritization-lab',
      variant: 'beginner',
      scenarioVersion: '1.0.0',
      title: 'Executive Calendar & Inbox Conflict Triage',
      instructions: `You are Chief of Staff to the Managing Director. It is Monday morning 08:30 IST.
Review the 6 incoming urgent communications and calendar schedule to resolve all priority conflicts:
1. Notice that two mandatory meetings overlap on Wednesday afternoon (15:00 - 16:00 IST: Board Audit Committee vs Tier-1 Client Pitch). Re-schedule the Client Pitch to Thursday 11:00 AM IST.
2. Triage the 6 inbox communications into the Eisenhower Matrix (Urgent & Important, Important not Urgent, Urgent not Important, Delegate/Archive).
3. Review 2 flight travel options for the upcoming Bengaluru to Singapore quarterly summit. Select Option B (direct flight meeting corporate travel policy and avoiding 3 AM arrival).
4. Draft an executive shift handover memo outlining key actions taken and pending approvals.`,
      prerequisites: [
        'Timezone translation (IST = UTC+5:30, GMT = UTC+0, SGT = UTC+8)',
        'Eisenhower Matrix categorization',
        'Corporate travel policy guidelines'
      ],
      expectedOutput: [
        'Zero overlapping mandatory calendar conflicts',
        'Accurate Eisenhower triage of all 6 inbox items',
        'Compliant travel selection adhering to executive arrival window',
        'Professional shift handover memo containing all required verification points'
      ],
      allowedActions: ['reschedule_calendar_event', 'triage_inbox_item', 'select_travel_option', 'save_handover_memo'],
      publicFixture: {
        currentTimestampIST: '2026-09-21T08:30:00+05:30',
        inboxItems: [
          {
            id: 'mail_1',
            sender: 'Kavita Rao (Board Chair)',
            subject: 'URGENT: Board Audit Committee Draft Review',
            snippet: 'Need signed compliance audit sign-off before Wednesday 3 PM meeting.',
            receivedAt: '07:45 IST',
            priorityTier: 'urgent_important'
          },
          {
            id: 'mail_2',
            sender: 'Rajesh Verma (VP Sales)',
            subject: 'Wednesday 3 PM: Apex Corp Enterprise Renewal ($450k ARR)',
            snippet: 'Apex CEO requested MD present on the pitch call. Please confirm attendance.',
            receivedAt: '08:05 IST',
            priorityTier: 'urgent_important'
          },
          {
            id: 'mail_3',
            sender: 'Pooja Nair (HR Director)',
            subject: 'Annual Headcount Strategy 2027 Memo',
            snippet: 'Draft strategy document attached. No immediate rush, review by end of month.',
            receivedAt: 'Yesterday',
            priorityTier: 'important_not_urgent'
          },
          {
            id: 'mail_4',
            sender: 'IT Desk Admin',
            subject: 'ACTION REQUIRED: Two-Factor Authentication Token Expiry',
            snippet: 'Please re-verify your hardware YubiKey within 4 hours to avoid lock-out.',
            receivedAt: '08:15 IST',
            priorityTier: 'urgent_not_important'
          },
          {
            id: 'mail_5',
            sender: 'Office Supplies Vendor',
            subject: 'Updated Cafeteria Coffee Bean Catalogue Q4',
            snippet: 'New organic arabica blends available for corporate cafeteria subscription.',
            receivedAt: '06:00 IST',
            priorityTier: 'delegate_archive'
          },
          {
            id: 'mail_6',
            sender: 'Corporate Travel Desk',
            subject: 'Singapore Summit Flight Itinerary Review Options',
            snippet: 'Please select preferred flight for the Singapore Quarterly Summit next week.',
            receivedAt: '08:20 IST',
            priorityTier: 'urgent_important'
          }
        ],
        calendarEvents: [
          {
            id: 'ev_1',
            day: 'Wednesday',
            startTime: '15:00',
            endTime: '16:00',
            title: 'Board Audit Committee Formal Review',
            type: 'mandatory_internal',
            status: 'confirmed',
            attendees: ['Board Chair', 'MD', 'Legal Counsel']
          },
          {
            id: 'ev_2',
            day: 'Wednesday',
            startTime: '15:00',
            endTime: '16:00',
            title: 'Apex Corp Enterprise Deal Closing Pitch',
            type: 'mandatory_client',
            status: 'conflicted', // Overlaps with ev_1!
            attendees: ['Apex CEO', 'VP Sales', 'MD']
          },
          {
            id: 'ev_3',
            day: 'Thursday',
            startTime: '11:00',
            endTime: '12:00',
            title: 'Open Executive Office Working Slot',
            type: 'available_slot',
            status: 'open',
            attendees: []
          }
        ],
        travelOptions: [
          {
            id: 'opt_a',
            airline: 'Connecting Air (Via Kuala Lumpur)',
            departureIST: '22:30 IST',
            arrivalSGT: '04:15 SGT (Overnight)',
            duration: '8h 15m',
            price: '₹32,000',
            hotelEarlyCheckinRequired: true,
            recommendation: 'Not recommended: Arrives at 4 AM local time causing fatigue before 9 AM keynote.'
          },
          {
            id: 'opt_b',
            airline: 'Singapore Airlines Direct SQ503',
            departureIST: '23:10 IST',
            arrivalSGT: '06:20 SGT (Morning)',
            duration: '4h 40m',
            price: '₹48,000',
            hotelEarlyCheckinRequired: false,
            recommendation: 'Corporate Policy Compliant: Direct flight, arrives 6:20 AM with 3 hours refresh window.'
          }
        ]
      }
    },
    intermediate: {
      id: 'eop-002',
      labSlug: 'executive-office-prioritization-lab',
      variant: 'intermediate',
      scenarioVersion: '1.0.0',
      title: 'Cross-Continent Multi-Entity Board Preparation',
      instructions: `Coordinate meeting agendas across 4 global time zones (PST, GMT, IST, JST).`,
      prerequisites: ['Global timezone daylight saving rules', 'Quorum compliance'],
      expectedOutput: ['Zero timezone scheduling errors', 'Completed board brief'],
      allowedActions: ['reschedule_calendar_event', 'triage_inbox_item', 'select_travel_option', 'save_handover_memo'],
      publicFixture: { inboxItems: [], calendarEvents: [], travelOptions: [] }
    },
    challenge: {
      id: 'eop-003',
      labSlug: 'executive-office-prioritization-lab',
      variant: 'challenge',
      scenarioVersion: '1.0.0',
      title: 'Hostile Takeover Defense Emergency Schedule',
      instructions: `Rearrange 3 days of executive meetings under regulatory embargo conditions.`,
      prerequisites: ['Crisis communications', 'Embargo compliance'],
      expectedOutput: ['Zero confidential calendar leaks', 'Emergency schedule aligned'],
      allowedActions: ['reschedule_calendar_event', 'triage_inbox_item', 'select_travel_option', 'save_handover_memo'],
      publicFixture: { inboxItems: [], calendarEvents: [], travelOptions: [] }
    }
  }
};

export function getScenarioForLab(slug: string, variant: LabDifficulty = 'beginner'): LabScenarioVariant | undefined {
  return pilotScenarios[slug]?.[variant];
}
