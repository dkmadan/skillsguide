import { NextRequest, NextResponse } from 'next/server';
import { getLabBySlug } from '@/data/labsCatalog';
import { getScenarioForLab } from '@/data/labsScenariosData';
import { LabDifficulty } from '@/lib/labs/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const lab = getLabBySlug(slug);

    if (!lab) {
      return NextResponse.json({ error: 'Lab not found' }, { status: 404 });
    }

    const searchParams = request.nextUrl.searchParams;
    const variant = (searchParams.get('variant') || 'beginner') as LabDifficulty;
    const scenario = getScenarioForLab(slug, variant);

    // Filter out privateAnswerKey from public response
    const publicScenario = scenario ? {
      id: scenario.id,
      labSlug: scenario.labSlug,
      variant: scenario.variant,
      scenarioVersion: scenario.scenarioVersion,
      title: scenario.title,
      instructions: scenario.instructions,
      prerequisites: scenario.prerequisites,
      expectedOutput: scenario.expectedOutput,
      publicFixture: scenario.publicFixture,
      allowedActions: scenario.allowedActions
    } : null;

    return NextResponse.json({
      lab,
      scenario: publicScenario
    });
  } catch (error) {
    console.error('Error fetching lab metadata:', error);
    return NextResponse.json({ error: 'Failed to fetch lab' }, { status: 500 });
  }
}
