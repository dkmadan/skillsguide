export interface CategoryDomain {
  slug: string;
  title: string;
  badge: string;
  shortDesc: string;
  longDesc: string;
  icon: string;
  themeColor: 'purple' | 'emerald' | 'amber' | 'cyan' | 'rose' | 'teal';
  accentGradient: string;
  cardBorder: string;
  cagrGrowth: string;
  averageSalary: string;
  hiringVolume: string;
  topHubs: string[];
  topicSlugs: string[];
}

export const categoryDomains: CategoryDomain[] = [
  {
    slug: 'emerging-tech-ai',
    title: 'Emerging Tech & AI Engineering',
    badge: 'High-Demand 2026 Frontier',
    shortDesc: 'Master autonomous agentic workflows, multi-cloud declarative infrastructure, active cyber defense, and edge computing.',
    longDesc: 'The artificial intelligence and cloud platform frontier is shifting from static machine learning models to autonomous multi-agent systems, declarative multi-cloud infrastructure, zero-trust security postures, and low-latency bare-metal edge devices. Indian tech hubs (Bengaluru, Hyderabad, Pune) and Global Capability Centers (GCCs) are aggressively recruiting specialists capable of building operational Agentic pipelines with MCP, managing Kubernetes operators at scale, and securing enterprise attack surfaces.',
    icon: 'BrainCircuit',
    themeColor: 'purple',
    accentGradient: 'from-purple-600 via-indigo-600 to-cyan-500',
    cardBorder: 'border-purple-500/30',
    cagrGrowth: '34.8% CAGR',
    averageSalary: '₹14.5L - ₹35.0L LPA',
    hiringVolume: '38,000+ Active Openings',
    topHubs: ['Bengaluru', 'Hyderabad', 'Pune', 'Gurugram', 'Remote Global'],
    topicSlugs: [
      'generative-ai-agentic-workflows',
      'cloud-platform-engineering',
      'cybersecurity-ethical-hacking',
      'iot-embedded-systems'
    ]
  },
  {
    slug: 'business-growth-nocode',
    title: 'Business, Growth & Modern No-Code',
    badge: 'High-ROI Modern Execution',
    shortDesc: 'Accelerate revenue velocity, launch enterprise MVPs in days without traditional code, and scale programmatic acquisition funnels.',
    longDesc: 'Modern business velocity rewards operators who build and iterate fast. By combining product discovery frameworks, Amplitude behavioral analytics, full-stack visual builders (Bubble, Webflow), and automated webhook routers (Make.com, Zapier, Airtable), growth professionals can conceptualize, build, test, and monetize digital products in days rather than quarters. Complemented by programmatic SEO and Meta/Google ad arbitrage, this domain powers India\'s high-growth startups and international USD freelancing practices.',
    icon: 'TrendingUp',
    themeColor: 'amber',
    accentGradient: 'from-amber-500 via-orange-600 to-rose-600',
    cardBorder: 'border-amber-500/30',
    cagrGrowth: '29.2% CAGR',
    averageSalary: '₹10.5L - ₹28.0L LPA',
    hiringVolume: '24,000+ Openings & Retainers',
    topHubs: ['Bengaluru', 'Mumbai', 'Gurugram', 'Delhi NCR', 'Worldwide Remote'],
    topicSlugs: [
      'product-management-growth',
      'nocode-lowcode-development',
      'digital-marketing-seo-performance'
    ]
  },
  {
    slug: 'creative-design-media',
    title: 'Creative & Design Media',
    badge: 'Tactile & Spatial Experiences',
    shortDesc: 'Bridge spatial computing, real-time 3D pipelines, and multi-mode design systems to architect world-class user experiences.',
    longDesc: 'From tactile micro-interactions in Figma and Framer to real-time photorealistic ArchViz in Unreal Engine 5 and spatial UI for Apple Vision Pro, creative design media has transformed into an engineering-adjacent discipline. As high-growth companies prioritize premium brand design, conversion-optimized design tokens, and next-generation immersive gaming and architectural experiences, designers with technical systems expertise command top-tier compensation across India and global studios.',
    icon: 'Palette',
    themeColor: 'rose',
    accentGradient: 'from-rose-500 via-pink-600 to-purple-600',
    cardBorder: 'border-rose-500/30',
    cagrGrowth: '26.4% CAGR',
    averageSalary: '₹8.5L - ₹22.0L LPA',
    hiringVolume: '18,500+ Design Roles',
    topHubs: ['Bengaluru', 'Mumbai', 'Pune', 'Hyderabad', 'Chennai'],
    topicSlugs: [
      'ui-ux-product-design',
      '3d-spatial-computing'
    ]
  },
  {
    slug: 'green-tech-sustainability',
    title: 'Green Tech & Sustainable Industry',
    badge: 'Net-Zero & Clean Mobility Boom',
    shortDesc: 'Lead the global clean mobility transition with advanced EV powertrain engineering, battery management systems, and utility solar farms.',
    longDesc: 'India is undergoing a massive clean technology industrial transformation, backed by government PLI schemes, EV adoption mandates, and ambitious renewable energy targets of 500GW non-fossil capacity by 2030. Engineers who master Lithium-ion cell balancing, Battery Management Systems (BMS), high-power inverter thermodynamics, and utility-scale PVsyst solar grid modeling are in unprecedented demand across automotive OEMs, battery gigafactories, renewable EPC developers, and corporate ESG compliance teams.',
    icon: 'Zap',
    themeColor: 'teal',
    accentGradient: 'from-teal-500 via-emerald-600 to-green-600',
    cardBorder: 'border-teal-500/30',
    cagrGrowth: '38.5% CAGR',
    averageSalary: '₹7.5L - ₹24.0L LPA',
    hiringVolume: '22,000+ Industrial Roles',
    topHubs: ['Pune', 'Chennai', 'Bengaluru', 'Ahmedabad', 'NCR / Manesar'],
    topicSlugs: [
      'ev-battery-tech',
      'solar-renewable-energy-design'
    ]
  }
];

export const getCategoryBySlug = (slug: string): CategoryDomain | undefined => {
  return categoryDomains.find(c => c.slug === slug);
};
