import type { SkillDetail } from './skillsData';

export const designMediaSoftSkills: SkillDetail[] = [
  {
    slug: 'ux-research-design-systems',
    title: 'UX Research & Design Systems Engineering',
    category: 'creative-media',
    domainSlug: 'creative-design-media',
    categoryLabel: 'Creative & Design Media',
    shortDesc: 'Conduct user interviews, usability testing, and architect scalable multi-brand Figma Design Systems with Tokens Studio.',
    longDesc: 'UX Research and Design Systems Engineering connects user empathy with scalable product architecture. Master qualitative user interviews, usability testing, journey mapping, multi-brand design tokens in Figma (W3C DTCG standard), component variants, accessible typography hierarchies (WCAG 2.2 AAA), and developer handoff.',
    heroImage: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'Design System Token Architecture & UX Research Pipeline',
      caption: 'Generative user research, usability benchmarking, design token taxonomy, and code sync.',
      imageUrl: '/images/concepts/concept-creative-leadership.svg',
      keyPoints: [
        { label: 'Qualitative UX Discovery', description: 'Semi-structured interviews, mental models, and thematic affinity mapping.' },
        { label: 'Multi-Tier Token Architecture', description: 'Global Tokens (Primitive) -> Alias Tokens (Semantic) -> Component Tokens.' },
        { label: 'Auto-Layout & Variants in Figma', description: 'Fluid responsive components with nested properties, slots, and interactive states.' },
        { label: 'Tokens-to-Code Sync', description: 'Exporting JSON tokens directly to CSS variables and Tailwind theme tokens via GitHub Actions.' }
      ]
    },
    salaryRange: '₹6.5L – ₹22.0L LPA',
    minSalaryLPA: 6.5,
    maxSalaryLPA: 22.0,
    averageSalaryLPA: 13.0,
    timelineWeeks: '8 – 12 Weeks',
    hiringVolume: '15,000+ Product Design Openings',
    experienceLevel: 'Intermediate',
    topCities: ['Bengaluru', 'Delhi NCR', 'Mumbai', 'Hyderabad', 'Pune', 'Remote'],
    tools: ['Figma 2026', 'Tokens Studio for Figma', 'Maze Usability Testing', 'Miro / FigJam', 'Storybook', 'Lottie'],
    keyHighlights: [
      'High-paying product design track sitting at the intersection of user psychology and front-end engineering',
      'Design systems eliminate 40%+ of repetitive design work for enterprise product teams',
      'High global remote USD freelancing and design consulting opportunities'
    ],
    syllabus: [
      {
        phase: 'Phase 1: Generative & Evaluative UX Research',
        weeks: 'Weeks 1 - 4',
        topics: ['Planning and conducting user interviews, contextual inquiries, and card sorting', 'Synthesizing qualitative findings: Affinity diagramming, User Personas, and Customer Journey Maps (CJMs)', 'Usability testing: Moderated and unmoderated testing with Maze, System Usability Scale (SUS) scoring'],
        project: 'Conduct an end-to-end UX Research Study on a fintech onboarding flow and publish an Insights Report.'
      },
      {
        phase: 'Phase 2: Figma Design System Architecture & Tokens',
        weeks: 'Weeks 5 - 8',
        topics: ['Design token hierarchy: Global/Primitive -> Semantic/Alias -> Component-level design tokens', 'Figma advanced features: Auto-Layout 5.0, Component Properties (Boolean, Text, Instance swap), and Variants', 'Dark mode theming, WCAG 2.2 color contrast compliance, and typography scale systems'],
        project: 'Build a Complete Multi-Brand Figma Design System with 40+ accessible UI components.'
      },
      {
        phase: 'Phase 3: Design Tokens to Code & Developer Handoff',
        weeks: 'Weeks 9 - 12',
        topics: ['Syncing Tokens Studio JSON to GitHub repositories via automated GitHub Actions workflows', 'Translating Figma tokens into CSS Custom Properties and Tailwind CSS theme extensions', 'Documenting design system guidelines in Zeroheight and pairing with front-end Storybook components'],
        project: 'Create a live Design System Documentation Hub in Zeroheight with synchronized Storybook code.'
      }
    ],
    jobRoles: [
      { title: 'UX Researcher / Product Designer', salary: '₹6.5L – ₹12.5L', demand: 'Very High' },
      { title: 'Design System Architect / Lead Product Designer', salary: '₹14.0L – ₹28.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'What is the three-tier Design Token architecture and why is it essential for multi-theme apps?',
        answer: 'The three-tier token architecture consists of: (1) Global/Primitive Tokens (raw hex values like color-blue-500: #3B82F6), (2) Semantic/Alias Tokens (meaning-driven tokens mapped to primitives like color-background-primary -> color-blue-500 in light mode and color-slate-900 in dark mode), and (3) Component Tokens (scoped specifically to an element like button-primary-bg -> color-background-primary). This allows updating an entire brand or switching dark/light themes instantly by modifying semantic tokens without breaking hardcoded component styles.'
      }
    ],
    faqs: [
      { question: 'Do UX Designers and Design System Engineers need to code?', answer: 'Deep coding is not required, but understanding HTML/CSS layout (Flexbox/Grid), component props, and JSON token pipelines enables seamless developer collaboration.' }
    ],
    relatedSkills: ['ui-ux-product-design', 'web-design-webflow-framer', 'graphic-figma', 'motion-design']
  },
  {
    slug: 'unreal-engine-game-development',
    title: 'Game Development & Real-Time 3D (Unreal Engine 5)',
    category: 'creative-media',
    domainSlug: 'creative-design-media',
    categoryLabel: 'Creative & Design Media',
    shortDesc: 'Build photorealistic games, virtual production environments, and interactive 3D simulations in Unreal Engine 5.4.',
    longDesc: 'Unreal Engine 5 is the industry standard for AAA gaming, Hollywood virtual production, architectural visualization (ArchViz), and automotive digital twins. Master Nanite virtualized geometry, Lumen real-time global illumination, Visual Blueprint scripting, C++ game programming, Chaos physics, and Niagara VFX.',
    heroImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'Unreal Engine 5 Real-Time Rendering & Game Loop',
      caption: 'Nanite micro-poly geometry, Lumen real-time lighting, Blueprint/C++ gameplay logic, and packaging.',
      imageUrl: '/images/concepts/concept-creative-leadership.svg',
      keyPoints: [
        { label: 'Nanite Micro-Polygon Geometry', description: 'Importing multi-million polygon film-quality 3D assets with zero LOD pop-in.' },
        { label: 'Lumen Real-Time Global Illumination', description: 'Dynamic indirect bounced lighting without baking lightmaps.' },
        { label: 'Blueprints & C++ Gameplay Architecture', description: 'High-performance gameplay loops, player state machines, and AI behavior trees.' },
        { label: 'Niagara Particle VFX', description: 'Real-time volumetric smoke, sparks, and magical spell visual effects.' }
      ]
    },
    salaryRange: '₹5.5L – ₹20.0L LPA',
    minSalaryLPA: 5.5,
    maxSalaryLPA: 20.0,
    averageSalaryLPA: 11.5,
    timelineWeeks: '10 – 14 Weeks',
    hiringVolume: '10,000+ Openings in Gaming Studios, VFX & Automotive',
    experienceLevel: 'Intermediate',
    topCities: ['Bengaluru', 'Hyderabad', 'Pune', 'Mumbai', 'Noida / Delhi NCR', 'Remote'],
    tools: ['Unreal Engine 5.4', 'C++ / Visual Studio', 'Quixel Megascans', 'Blender', 'Substance 3D Painter'],
    keyHighlights: [
      'High-demand technical creative specialization spanning gaming, Bollywood/Hollywood VFX, and automotive HMI',
      'India\'s gaming and animation industry is experiencing unprecedented 25%+ annual growth',
      'Direct pathway into Gameplay Programmer, Technical Artist, and Virtual Production Director'
    ],
    syllabus: [
      {
        phase: 'Phase 1: UE5 Environment Design (Nanite, Lumen & Quixel)',
        weeks: 'Weeks 1 - 4',
        topics: ['Unreal Engine 5 editor layout, coordinate systems, and Quixel Megascans integration', 'Nanite geometry pipeline and virtual texturing for photorealistic open-world environments', 'Lumen global illumination: Direct lighting, sky atmosphere, volumetric fog, and post-process volumes'],
        project: 'Create a Photorealistic Cinematic Cyberpunk or Ancient Temple Environment in UE5.'
      },
      {
        phase: 'Phase 2: Visual Scripting with Blueprints & Game Mechanics',
        weeks: 'Weeks 5 - 8',
        topics: ['Blueprint visual scripting: Variables, Custom Events, Functions, Macros, and Event Tick management', 'Character movement: Enhanced Input System, Animation Blueprints (Blend Spaces, Control Rig)', 'Object interactions: Line tracing, collision channels, inventory systems, and UI widgets (UMG)'],
        project: 'Develop a Complete Playable Third-Person Action-Adventure Game Prototype with combat.'
      },
      {
        phase: 'Phase 3: Niagara VFX, C++ Optimization & Packaging',
        weeks: 'Weeks 9 - 14',
        topics: ['Niagara particle systems: Creating real-time fire, magic effects, and environmental weather', 'Hybrid C++ and Blueprint architecture: Creating custom C++ base classes for performance-critical loops', 'Profiling with Unreal Insights (GPU/CPU frame times) and packaging cross-platform builds (PC/Console)'],
        project: 'Package and publish a fully optimized 3D Game Demo with custom Niagara VFX and UI.'
      }
    ],
    jobRoles: [
      { title: 'Unreal Engine Developer / Gameplay Programmer', salary: '₹5.5L – ₹11.0L', demand: 'Very High' },
      { title: 'Technical Artist / Lead Unreal Engine Architect', salary: '₹12.0L – ₹24.0L', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'What is the fundamental performance advantage of Nanite in Unreal Engine 5?',
        answer: 'Nanite is a virtualized micropolygon geometry system. It dynamically scales the level of detail of 3D meshes on the fly, rendering only as many polygons as there are pixels on the screen. This eliminates the need to manually author manual LODs (Levels of Detail), eliminates normal map baking compromises, and allows artists to import billions of raw ZBrush/CAD polygons directly into real-time scenes with minimal frame-rate impact.'
      }
    ],
    faqs: [
      { question: 'Do I need C++ knowledge for Unreal Engine, or is Blueprint visual scripting enough?', answer: 'Blueprints are powerful enough to build entire indie games and prototypes; for AAA studios and performance-critical multiplayer backends, combining C++ base classes with Blueprint subclasses is the industry standard.' }
    ],
    relatedSkills: ['3d-spatial-computing', 'motion-design', 'cad-cam-engineering', 'software-architecture']
  },
  {
    slug: 'public-speaking-negotiation',
    title: 'Public Speaking, Negotiation & Executive Leadership',
    category: 'business',
    domainSlug: 'leadership-professional-growth',
    categoryLabel: 'Leadership & Soft Skills',
    shortDesc: 'Master high-stakes commercial negotiation (BATNA/ZOPA), keynote storytelling, crisis communication, and executive presence.',
    longDesc: 'Executive Leadership & Persuasive Communication determines career velocity and commercial success. Master the Harvard Negotiation Framework (BATNA, ZOPA, value creation), high-impact keynote presentations, vocal dynamics, active de-escalation, board room pitching, and team motivation.',
    heroImage: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=900&q=80',
    conceptDiagram: {
      title: 'Strategic Negotiation & Executive Influence Framework',
      caption: 'BATNA preparation, active value expansion, objection reframing, and win-win contract closure.',
      imageUrl: '/images/concepts/concept-creative-leadership.svg',
      keyPoints: [
        { label: 'BATNA & ZOPA Preparation', description: 'Knowing your Best Alternative to a Negotiated Agreement and Zone of Possible Agreement.' },
        { label: 'Keynote Storytelling', description: 'Structuring compelling 3-act narrative arcs with visual decks commanding audience attention.' },
        { label: 'Tactical Empathy & Framing', description: 'Labeling counterpart emotions and calibrated "How" and "What" questioning.' },
        { label: 'Executive Presence', description: 'Vocal modulation, strategic silence, open body language, and non-defensive composure.' }
      ]
    },
    salaryRange: '₹8.0L – ₹35.0L LPA (Executive Multiplier)',
    minSalaryLPA: 8.0,
    maxSalaryLPA: 35.0,
    averageSalaryLPA: 18.0,
    timelineWeeks: '4 – 6 Weeks',
    hiringVolume: 'Universal Leadership Competency',
    experienceLevel: 'All Levels',
    topCities: ['Pan-India', 'Bengaluru', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Pune', 'Global'],
    tools: ['Harvard Negotiation Framework (PON)', 'Toastmasters Competencies', 'Canva / Pitch Decks', 'Vocal Recording Analysis'],
    keyHighlights: [
      'The single highest-ROI professional skill accelerating promotions from individual contributor to C-suite',
      'Transforms complex technical ideas into compelling multi-million dollar business propositions',
      'Equips you to negotiate 30%+ higher salary packages, vendor contracts, and client retainers'
    ],
    syllabus: [
      {
        phase: 'Phase 1: High-Stakes Negotiation & Value Creation',
        weeks: 'Weeks 1 - 3',
        topics: ['The Harvard Negotiation Framework: Separating people from the problem, focusing on interests not positions', 'BATNA (Best Alternative to a Negotiated Agreement), ZOPA, and anchoring strategies', 'Tactical Empathy: Chris Voss "Never Split the Difference" mirroring, labeling, and calibrated questioning'],
        project: 'Execute and document a Simulated Commercial Contract / Salary Negotiation Case Study.'
      },
      {
        phase: 'Phase 2: Public Speaking & Keynote Presentation Mastery',
        weeks: 'Weeks 4 - 6',
        topics: ['Storytelling architectures: The Hero\'s Journey, Problem-Agitation-Solution, and What-Is vs What-Could-Be arcs', 'Vocal dynamics: Pitch variety, cadence control, eliminating filler words, and the power of strategic silence', 'Designing high-conversion slide decks: 1 idea per slide, visual hierarchy, and data visualization'],
        project: 'Record and deliver a compelling 10-minute Keynote Presentation on a strategic business topic.'
      }
    ],
    jobRoles: [
      { title: 'Team Lead / Engineering Manager', salary: '₹14.0L – ₹28.0L', demand: 'Very High' },
      { title: 'Director / Vice President / Business Head', salary: '₹28.0L – ₹65.0L+', demand: 'High' }
    ],
    interviewQuestions: [
      {
        question: 'How do you utilize your BATNA during a commercial contract or compensation negotiation?',
        answer: 'BATNA (Best Alternative to a Negotiated Agreement) is my primary source of negotiating power. Before entering any negotiation, I clearly define and strengthen my realistic walk-away alternative. This prevents me from accepting disadvantageous terms out of desperation. During the negotiation, I anchor high, understand the counterpart\'s underlying interests, create trade-offs across multiple non-monetary variables (timeline, scope, equity), and only accept terms that clearly exceed my BATNA.'
      }
    ],
    faqs: [
      { question: 'Can introverts become exceptional public speakers and negotiators?', answer: 'Absolutely! Exceptional public speaking and negotiation rely on structured preparation, active listening, and calibrated questions rather than extroverted talkativeness.' }
    ],
    relatedSkills: ['leadership-people-management', 'career-networking', 'interview-preparation', 'problem-solving-critical-thinking']
  }
];
