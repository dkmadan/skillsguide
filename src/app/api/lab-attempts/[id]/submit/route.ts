import { NextRequest, NextResponse } from 'next/server';
import { getAttempt, saveSubmission } from '@/lib/labs/db';
import { evaluateLabSubmission } from '@/lib/labs/scorer';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ownerId = request.cookies.get('sg_owner_id')?.value || 'guest_anonymous';

    const body = await request.json();
    const { idempotencyKey, answers, variant, labSlug } = body;

    if (!idempotencyKey || typeof idempotencyKey !== 'string') {
      return NextResponse.json({ error: 'idempotencyKey is required' }, { status: 400 });
    }

    if (!answers || typeof answers !== 'object') {
      return NextResponse.json({ error: 'answers payload is required' }, { status: 400 });
    }

    // Verify attempt ownership if attempt exists in DB
    const attempt = await getAttempt(id, ownerId);
    const resolvedLabSlug = labSlug || attempt?.labSlug;

    if (!resolvedLabSlug) {
      return NextResponse.json({ error: 'Valid labSlug or existing attempt required' }, { status: 400 });
    }

    // DETERMINISTIC EVALUATION:
    // Server computes the final score strictly from validated answers and trusted rubric.
    // Never accepts a browser-supplied final score!
    const submissionResult = evaluateLabSubmission({
      labSlug: resolvedLabSlug,
      variant: variant || 'beginner',
      answers,
      idempotencyKey,
      attemptId: id,
      ownerId
    });

    // Persist immutable submission record in MongoDB
    await saveSubmission(submissionResult, answers);

    return NextResponse.json({
      success: true,
      submission: submissionResult
    });
  } catch (error) {
    console.error('Error processing submission:', error);
    return NextResponse.json({ error: 'Failed to process submission' }, { status: 500 });
  }
}
