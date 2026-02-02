import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/middleware';
import {
  getAllEvents,
  getFilteredEvents,
  createEvent,
  initializeEvents,
} from '@/lib/data/events';
import { EventFilters, Category, Severity } from '@/lib/types';
import { hasPermission } from '@/lib/auth';

// Initialize events on first request
initializeEvents();

export const GET = requireAuth(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);

  const filters: EventFilters = {};

  // Parse category filter
  const categoryParam = searchParams.get('category');
  if (categoryParam) {
    filters.category = categoryParam.split(',') as Category[];
  }

  // Parse severity filter
  const severityParam = searchParams.get('severity');
  if (severityParam) {
    filters.severity = severityParam.split(',') as Severity[];
  }

  // Parse minScore filter
  const minScoreParam = searchParams.get('minScore');
  if (minScoreParam) {
    filters.minScore = parseInt(minScoreParam, 10);
  }

  // Parse date range filter
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  if (startDate && endDate) {
    filters.dateRange = { start: startDate, end: endDate };
  }

  // Parse search filter
  const search = searchParams.get('search');
  if (search) {
    filters.search = search;
  }

  // Parse tags filter
  const tagsParam = searchParams.get('tags');
  if (tagsParam) {
    filters.tags = tagsParam.split(',');
  }

  const events = Object.keys(filters).length > 0
    ? getFilteredEvents(filters)
    : getAllEvents();

  // Parse pagination
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '50', 10);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedEvents = events.slice(startIndex, endIndex);

  return NextResponse.json({
    events: paginatedEvents,
    total: events.length,
    page,
    limit,
    totalPages: Math.ceil(events.length / limit),
  });
});

export const POST = requireRole(['admin', 'analyst'], async (request: NextRequest, user) => {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.description || !body.category || !body.severity) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!body.location || typeof body.location.lat !== 'number' || typeof body.location.lng !== 'number') {
      return NextResponse.json(
        { error: 'Invalid location data' },
        { status: 400 }
      );
    }

    const newEvent = createEvent({
      title: body.title,
      description: body.description,
      category: body.category,
      severity: body.severity,
      location: body.location,
      metrics: body.metrics || { score: 50, confidence: 0.5, impact: 0 },
      tags: body.tags || [],
      createdBy: user.email,
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
});
