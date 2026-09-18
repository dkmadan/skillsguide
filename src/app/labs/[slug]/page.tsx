import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { allLabsCatalog, getLabBySlug } from '@/data/labsCatalog';
import { getScenarioForLab } from '@/data/labsScenariosData';
import LabWorkspaceClient from './LabWorkspaceClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return allLabsCatalog.map((lab) => ({
    slug: lab.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const lab = getLabBySlug(slug);

  if (!lab) {
    return {
      title: 'Lab Not Found | SkillsGuide.in',
    };
  }

  return {
    title: `${lab.title} (Lab #${lab.labNumber}) | Virtual Interactive Lab`,
    description: `${lab.summary} Practice real-world scenarios with zero setup, instant deterministic server evaluation, and exportable reports.`,
    keywords: [
      lab.title,
      `${lab.title} simulation`,
      'skillsguide virtual lab',
      'interactive practice simulation',
      ...lab.skills
    ],
    openGraph: {
      title: `${lab.title} - Virtual Learning Lab | SkillsGuide`,
      description: lab.summary,
      url: `https://skillsguide.in/labs/${lab.slug}`,
      type: 'article',
    }
  };
}

export default async function LabPage({ params }: Props) {
  const { slug } = await params;
  const lab = getLabBySlug(slug);

  if (!lab) {
    notFound();
  }

  const initialScenario = getScenarioForLab(slug, 'beginner');

  return (
    <LabWorkspaceClient
      lab={lab}
      initialScenario={initialScenario}
    />
  );
}
