import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { categoryDomains, getCategoryBySlug } from '@/data/categoryData';
import { allSkillsList } from '@/data/skillsData';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import { 
  ArrowRight, 
  Sparkles, 
  MapPin, 
  Clock, 
  IndianRupee, 
  Briefcase, 
  CheckCircle2, 
  Layers, 
  TrendingUp, 
  Compass,
  ArrowUpRight
} from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return categoryDomains.map((cat) => ({
    slug: cat.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return {
      title: 'Category Not Found | SkillsGuide.in',
    };
  }

  return {
    title: `${category.title} Blueprints (2026) | Salary: ${category.averageSalary}`,
    description: `Complete guide to ${category.title}. Discover verified 2026 Indian salary benchmarks (${category.averageSalary}), learning timelines, top hiring hubs, and step-by-step career tracks.`,
    keywords: [
      category.title,
      `${category.title} jobs india`,
      `${category.title} salary bangalore`,
      'high demand skills 2026',
      'career roadmaps india'
    ],
    openGraph: {
      title: `${category.title} Career Blueprints & Indian Salary Guide`,
      description: category.shortDesc,
      url: `https://skillsguide.in/category/${category.slug}`,
      type: 'website',
    }
  };
}

export default async function CategoryDetailPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  // Get skills belonging to this category domain
  const domainSkills = allSkillsList.filter(
    skill => category.topicSlugs.includes(skill.slug) || skill.domainSlug === category.slug
  );

  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.title} Career Blueprints`,
    description: category.longDesc,
    url: `https://skillsguide.in/category/${category.slug}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: domainSkills.map((s, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `https://skillsguide.in/skills/${s.slug}`,
        name: s.title
      }))
    }
  };

  const breadcrumbs = [
    { name: 'Domains', url: '/#skills-catalog' },
    { name: category.title }
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto">
      <JsonLd data={jsonLdData} />
      <Breadcrumbs items={breadcrumbs} />

      {/* Domain Hero Banner */}
      <section className="glass-card rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden mb-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
            <span>{category.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {category.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {category.longDesc}
          </p>
        </div>

        {/* Live Market Telemetry Stats */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3.5 pt-6 border-t border-slate-800">
          <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Industry Growth</span>
            <strong className="text-base sm:text-lg font-black text-emerald-400 mt-1 block">
              {category.cagrGrowth}
            </strong>
          </div>

          <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Expected Indian CTC</span>
            <strong className="text-base sm:text-lg font-black text-purple-300 mt-1 block">
              {category.averageSalary}
            </strong>
          </div>

          <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Hiring Demand</span>
            <strong className="text-base sm:text-lg font-black text-cyan-400 mt-1 block">
              {category.hiringVolume}
            </strong>
          </div>

          <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Top Tech Hubs</span>
            <strong className="text-xs sm:text-sm font-bold text-slate-200 mt-1 block truncate" title={category.topHubs.join(', ')}>
              {category.topHubs.slice(0, 3).join(', ')}
            </strong>
          </div>
        </div>
      </section>

      {/* Grid of Topic Blueprint Cards */}
      <section className="space-y-6 mb-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <Layers className="w-6 h-6 text-purple-400" />
              <span>Verified Career Blueprints in {category.title}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Select a specialized track to view detailed syllabi, concept architecture diagrams, salary benchmarks, and interview preparation.
            </p>
          </div>
          <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20 shrink-0">
            {domainSkills.length} High-Demand Tracks
          </span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {domainSkills.map((skill) => (
            <div 
              key={skill.slug}
              className="glass-card rounded-3xl border border-white/10 hover:border-purple-500/50 p-6 flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl bg-gradient-to-b from-[#161a2e]/60 to-[#0e111f]/80"
            >
              <div className="space-y-4">
                
                {/* Card Visual Header */}
                <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-slate-800">
                  <Image 
                    src={skill.heroImage} 
                    alt={skill.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                  
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-slate-900/90 text-purple-300 border border-purple-500/30 backdrop-blur-md">
                      {skill.experienceLevel}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                      {skill.salaryRange}
                    </span>
                    <span className="text-slate-300 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1 font-medium text-[11px]">
                      <Clock className="w-3 h-3 text-purple-400" />
                      <span>{skill.timelineWeeks}</span>
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-purple-300 transition-colors">
                    {skill.title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2 mt-1.5 leading-relaxed">
                    {skill.shortDesc}
                  </p>
                </div>

                {/* Tools Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {skill.tools.slice(0, 5).map((tool, idx) => (
                    <span 
                      key={idx}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-900 text-purple-300/90 border border-purple-500/20"
                    >
                      {tool}
                    </span>
                  ))}
                  {skill.tools.length > 5 && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-900 text-slate-400">
                      +{skill.tools.length - 5} more
                    </span>
                  )}
                </div>

              </div>

              {/* Action Button */}
              <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-purple-400" />
                  <span>{skill.hiringVolume}</span>
                </span>

                <Link
                  href={`/skills/${skill.slug}`}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-glow-btn flex items-center gap-1.5 transition-all group-hover:scale-105"
                >
                  <span>Explore Blueprint</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* Explore Other Subject Domains */}
      <section className="p-8 rounded-3xl glass-card border border-white/10 space-y-6">
        <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>Explore Other High-Demand Subject Domains</span>
        </h3>

        <div className="grid sm:grid-cols-3 gap-4">
          {categoryDomains
            .filter(c => c.slug !== category.slug)
            .map((otherCat) => (
              <Link 
                key={otherCat.slug}
                href={`/category/${otherCat.slug}`}
                className="p-4 rounded-2xl bg-slate-900/80 hover:bg-purple-600/10 border border-slate-800 hover:border-purple-500/40 transition-all group"
              >
                <span className="text-[10px] font-extrabold uppercase text-purple-400 block mb-1">
                  {otherCat.badge}
                </span>
                <div className="text-sm font-bold text-white group-hover:text-purple-300 flex items-center justify-between">
                  <span>{otherCat.title}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400" />
                </div>
                <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                  {otherCat.shortDesc}
                </div>
              </Link>
            ))}
        </div>
      </section>

    </div>
  );
}
