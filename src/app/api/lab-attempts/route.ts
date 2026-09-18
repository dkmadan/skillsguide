import { NextRequest, NextResponse } from 'next/server';
import { createAttempt } from '@/lib/labs/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { labSlug, scenarioId, version } = body;

    if (!labSlug || typeof labSlug !== 'string') {
      return NextResponse.json({ error: 'labSlug is required' }, { status: 400 });
    }

    // Determine owner ID from cookie or generate new guest identifier
    let ownerId = request.cookies.get('sg_owner_id')?.value;
    let isNewOwner = false;
    if (!ownerId) {
      ownerId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      isNewOwner = true;
    }

    const seed = Math.floor(Math.random() * 1000000);
    const attempt = await createAttempt({
      ownerId,
      labSlug,
      scenarioId: scenarioId || `${labSlug}-default`,
      version: version || '1.0.0',
      seed
    });

    const response = NextResponse.json({
      attemptId: attempt.id,
      ownerId: attempt.ownerId,
      version: attempt.version,
      seed: attempt.seed,
      revision: attempt.revision,
      status: attempt.status
    });

    if (isNewOwner) {
      response.cookies.set('sg_owner_id', ownerId, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365 // 1 year
      });
    }

    return response;
  } catch (error) {
    console.error('Error creating lab attempt:', error);
    return NextResponse.json({ error: 'Failed to create attempt' }, { status: 500 });
  }
}
