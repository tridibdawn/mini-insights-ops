import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/middleware';
import { getEventById, updateEvent, deleteEvent, initializeEvents } from '@/lib/data/events';
import { hasPermission } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Initialize events before fetching
  initializeEvents();

  const { id } = await params;
  const event = getEventById(id);

  if (!event) {
    return NextResponse.json(
      { error: 'Event not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(event);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!hasPermission(user.role, 'edit')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Initialize events before updating
  initializeEvents();

  try {
    const { id } = await params;
    const body = await request.json();

    const existingEvent = getEventById(id);
    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    const updatedEvent = updateEvent(id, body);

    if (!updatedEvent) {
      return NextResponse.json(
        { error: 'Failed to update event' },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!hasPermission(user.role, 'delete')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Initialize events before deleting
  initializeEvents();

  const { id } = await params;
  const success = deleteEvent(id);

  if (!success) {
    return NextResponse.json(
      { error: 'Event not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}
