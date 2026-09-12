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
  sourceAttribution: string;
  measurementPeriod: string;
  geography: string;
}

export const categoryDomains: CategoryDomain[] = [
  {
    slug: 'emerging-tech-ai',
    title: 'Emerging Tech & AI Engineering',
    badge: 'High-Demand Frontier',
    shortDesc: 'Master autonomous agentic workflows, multi-cloud declarative infrastructure, active cyber defense, and edge computing.',
    longDesc: 'The artificial intelligence and cloud platform frontier is shifting from static machine learning models to autonomous multi-agent systems, declarative multi-cloud infrastructure, zero-trust security postures, and low-latency bare-metal edge devices. Indian tech hubs (Bengaluru, Hyderabad, Pune) and Global Capability Centers (GCCs) are actively recruiting specialists capable of building operational Agentic pipelines with MCP, managing Kubernetes operators at scale, and securing enterprise attack surfaces.',
    icon: 'BrainCircuit',
    themeColor: 'purple',
    accentGradient: 'from-purple-600 via-indigo-600 to-cyan-500',
    cardBorder: 'border-purple-500/30',
    cagrGrowth: 'Estimated 28%–34% YoY Sector Demand',
    averageSalary: '₹12.0L – ₹32.0L LPA (Band Range)',
    hiringVolume: 'High Concentration across GCCs & Product Labs',
    topHubs: ['Bengaluru', 'Hyderabad', 'Pune', 'Gurugram', 'Remote Global'],
    sourceAttribution: 'NASSCOM Tech Industry Pulse & GCC Talent Landscape Report',
    measurementPeriod: 'CY2024–CY2025 Industry Aggregate',
    geography: 'Pan-India Tech Hubs & Remote GCC Roles',
    topicSlugs: [
      'ai-agents-llm-apps',
      'generative-ai-agentic-workflows',
      'platform-engineering',
      'sre',
      'finops',
      'data-governance',
      'cloud-platform-engineering',
      'cybersecurity-ethical-hacking',
      'iot-embedded-systems'
    ]
  },
  {
    slug: 'business-growth-nocode',
    title: 'Business, Growth & Modern No-Code',
    badge: 'Modern Digital Execution',
    shortDesc: 'Accelerate revenue velocity, launch enterprise MVPs without heavy code, and manage specialized business workflows.',
    longDesc: 'Modern business velocity rewards operators who build and iterate fast. By combining product discovery frameworks, Amplitude behavioral analytics, full-stack visual builders (Bubble, Webflow), and automated webhook routers (Make.com, Zapier, Airtable), growth professionals can conceptualize, build, test, and monetize digital products rapidly. Complemented by performance marketing and analytics, this domain powers high-growth startups, SMEs, and international freelancing practices.',
    icon: 'TrendingUp',
    themeColor: 'amber',
    accentGradient: 'from-amber-500 via-orange-600 to-rose-600',
    cardBorder: 'border-amber-500/30',
    cagrGrowth: 'Estimated 22%–26% YoY Digital Adoption',
    averageSalary: '₹8.5L – ₹24.0L LPA (Band Range)',
    hiringVolume: 'Active across Startups, D2C Brands & Agencies',
    topHubs: ['Bengaluru', 'Mumbai', 'Gurugram', 'Delhi NCR', 'Pan-India Remote'],
    sourceAttribution: 'IAMAI Digital Commerce & Marketing Industry Review',
    measurementPeriod: 'CY2024 Survey Benchmark',
    geography: 'Metropolitan & Tier-1 Digital Marketing Clusters',
    topicSlugs: [
      'product-management-growth',
      'nocode-lowcode-development',
      'digital-marketing-seo-performance',
      'gst-practitioner',
      'medical-coding',
      'logistics-supply-chain',
      'insurance',
      'real-estate',
      'newsletter-growth',
      'community-management'
    ]
  },
  {
    slug: 'creative-design-media',
    title: 'Creative & Design Media',
    badge: 'Visual, Spatial & Interactive Media',
    shortDesc: 'Bridge spatial computing, real-time 3D pipelines, and multi-mode design systems to architect modern user experiences.',
    longDesc: 'From tactile micro-interactions in Figma and Framer to real-time photorealistic ArchViz in Unreal Engine 5 and spatial UI, creative design media has transformed into an engineering-adjacent discipline. As consumer brands prioritize high-conversion design systems, video workflows, and immersive digital assets, designers with structured systems expertise find diverse opportunities across India and global remote studios.',
    icon: 'Palette',
    themeColor: 'rose',
    accentGradient: 'from-rose-500 via-pink-600 to-purple-600',
    cardBorder: 'border-rose-500/30',
    cagrGrowth: 'Estimated 20%–25% Media & UI Demand',
    averageSalary: '₹7.0L – ₹20.0L LPA (Band Range)',
    hiringVolume: 'Diverse Studio, Product & Agency Demand',
    topHubs: ['Bengaluru', 'Mumbai', 'Pune', 'Hyderabad', 'Chennai'],
    sourceAttribution: 'Design in Tech Industry Survey & Indian Gaming/Media Reports',
    measurementPeriod: 'CY2024–CY2025 Study',
    geography: 'Major Indian Design & Agency Clusters',
    topicSlugs: [
      'ui-ux-product-design',
      '3d-spatial-computing',
      'youtube-ops',
      'podcast-production'
    ]
  },
  {
    slug: 'green-tech-sustainability',
    title: 'Green Tech & Sustainable Industry',
    badge: 'Clean Energy & Net-Zero Transition',
    shortDesc: 'Lead the clean mobility and renewable transition across field technician operations, design-engineering simulation, and corporate ESG reporting.',
    longDesc: 'India is undergoing a clean technology industrial transformation, backed by government PLI schemes, EV adoption mandates, and renewable energy targets of 500GW non-fossil capacity by 2030. Opportunities span three distinct career pathways: (1) Practical Field Technicians (rooftop solar installation, EV 2W/3W motor & battery maintenance), (2) Design Engineers (PVsyst solar yield modeling, high-voltage grid SLDs, MATLAB BMS simulation), and (3) Sustainability Analysts (SEBI BRSR reporting, GHG Protocol Scope 1-3 carbon accounting).',
    icon: 'Zap',
    themeColor: 'teal',
    accentGradient: 'from-teal-500 via-emerald-600 to-green-600',
    cardBorder: 'border-teal-500/30',
    cagrGrowth: 'Estimated 30%–36% Clean Energy Capacity Expansion',
    averageSalary: '₹5.5L – ₹22.0L LPA (Pathway Dependent)',
    hiringVolume: 'Spanning Manufacturing OEMs, EPC Contractors & ESG Audits',
    topHubs: ['Pune', 'Chennai', 'Bengaluru', 'Ahmedabad', 'NCR / Manesar', 'Jaipur'],
    sourceAttribution: 'Ministry of New & Renewable Energy (MNRE) & CEA National Electricity Plan',
    measurementPeriod: 'CY2024–CY2030 Target Projections',
    geography: 'Industrial Corridors, Solar Parks & Corporate Headquarters',
    topicSlugs: [
      'ev-battery-tech',
      'solar-renewable-energy-design'
    ]
  }
];

export const getCategoryBySlug = (slug: string): CategoryDomain | undefined => {
  return categoryDomains.find(c => c.slug === slug);
};
