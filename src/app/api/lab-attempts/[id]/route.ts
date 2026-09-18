import { NextRequest, NextResponse } from 'next/server';
import { getAttempt, saveDraft } from '@/lib/labs/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ownerId = request.cookies.get('sg_owner_id')?.value;

    if (!ownerId) {
      return NextResponse.json({ error: 'Unauthorized: No session token found' }, { status: 401 });
    }

    const attempt = await getAttempt(id, ownerId);
    if (!attempt) {
      return NextResponse.json({ error: 'Attempt not found or access denied' }, { status: 404 });
    }

    return NextResponse.json({ attempt });
  } catch (error) {
    console.error('Error fetching attempt:', error);
    return NextResponse.json({ error: 'Failed to fetch attempt' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ownerId = request.cookies.get('sg_owner_id')?.value;

    if (!ownerId) {
      return NextResponse.json({ error: 'Unauthorized: No session token found' }, { status: 401 });
    }

    const body = await request.json();
    const { draftState, expectedRevision } = body;

    if (typeof expectedRevision !== 'number') {
      return NextResponse.json({ error: 'expectedRevision number is required' }, { status: 400 });
    }

    if (!draftState || typeof draftState !== 'object') {
      return NextResponse.json({ error: 'draftState object is required' }, { status: 400 });
    }

    const result = await saveDraft({
      attemptId: id,
      ownerId,
      expectedRevision,
      draftState
    });

    if (result.conflict) {
      return NextResponse.json({
        error: 'Conflict: Draft has been updated elsewhere',
        currentRevision: result.revision
      }, { status: 409 });
    }

    return NextResponse.json({
      success: true,
      revision: result.revision
    });
  } catch (error) {
    console.error('Error saving draft:', error);
    const message = error instanceof Error ? error.message : 'Failed to save draft';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
