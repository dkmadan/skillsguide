import { MetadataRoute } from 'next';
import { allSkillsList } from '@/data/skillsData';
import { allRoadmapsList } from '@/data/roadmapsData';
import { allSalaryGuidesList } from '@/data/salaryData';
import { allGlossaryTerms } from '@/data/glossaryData';
import { categoryDomains } from '@/data/categoryData';
import { skillComparisons } from '@/data/skillComparisonsData';
import { careerRoleComparisons } from '@/data/careerRoleComparisonsData';
import { toolAlternativesData } from '@/data/toolAlternativesData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://skillsguide.in';

  // Static Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/compare`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.95 },
    { url: `${baseUrl}/career/compare`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.95 },
    { url: `${baseUrl}/tools/alternatives`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.95 },
    { url: `${baseUrl}/glossary`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/tools/salary-calculator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/tools/career-compass`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/tools/roi-calculator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/tools/ats-resume`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/disclaimer`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
  ];

  // Dynamic Category Domain Hub Pages
  const categoryRoutes: MetadataRoute.Sitemap = categoryDomains.map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.95
  }));

  // Dynamic Skill Pages
  const skillRoutes: MetadataRoute.Sitemap = allSkillsList.map((skill) => ({
    url: `${baseUrl}/skills/${skill.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.95
  }));

  // Dynamic Roadmap Pages
  const roadmapRoutes: MetadataRoute.Sitemap = allRoadmapsList.map((roadmap) => ({
    url: `${baseUrl}/roadmaps/${roadmap.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9
  }));

  // Dynamic Salary Guide Pages
  const salaryRoutes: MetadataRoute.Sitemap = allSalaryGuidesList.map((guide) => ({
    url: `${baseUrl}/salary-guide/${guide.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.85
  }));

  // Dynamic Skill vs Skill Comparison Pages
  const compareRoutes: MetadataRoute.Sitemap = skillComparisons.map((c) => ({
    url: `${baseUrl}/compare/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9
  }));

  // Dynamic Role vs Role Career Guides
  const careerCompareRoutes: MetadataRoute.Sitemap = careerRoleComparisons.map((c) => ({
    url: `${baseUrl}/career/compare/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9
  }));

  // Dynamic Tool Alternatives Pages
  const toolAlternativeRoutes: MetadataRoute.Sitemap = toolAlternativesData.map((t) => ({
    url: `${baseUrl}/tools/${t.slug}/alternatives`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9
  }));

  // Dynamic Glossary Term Pages
  const glossaryRoutes: MetadataRoute.Sitemap = allGlossaryTerms.map((term) => ({
    url: `${baseUrl}/glossary/${term.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8
  }));

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...skillRoutes,
    ...roadmapRoutes,
    ...salaryRoutes,
    ...compareRoutes,
    ...careerCompareRoutes,
    ...toolAlternativeRoutes,
    ...glossaryRoutes
  ];
}

