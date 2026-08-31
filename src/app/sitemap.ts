import { MetadataRoute } from 'next';
import { allSkillsList } from '@/data/skillsData';
import { allRoadmapsList } from '@/data/roadmapsData';
import { allSalaryGuidesList } from '@/data/salaryData';
import { allGlossaryTerms } from '@/data/glossaryData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://skillsguide.in';

  // Static Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
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

  // Dynamic Glossary Term Pages
  const glossaryRoutes: MetadataRoute.Sitemap = allGlossaryTerms.map((term) => ({
    url: `${baseUrl}/glossary/${term.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8
  }));

  return [
    ...staticRoutes,
    ...skillRoutes,
    ...roadmapRoutes,
    ...salaryRoutes,
    ...glossaryRoutes
  ];
}
