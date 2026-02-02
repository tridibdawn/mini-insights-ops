import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware';
import { getAllEvents, getEventStats } from '@/lib/data/events';
import { subDays, format, startOfDay } from 'date-fns';
import { DashboardInsight } from '@/lib/types';

export const GET = requireAuth(async (request: NextRequest) => {
  const events = getAllEvents();
  const stats = getEventStats();

  // Calculate trend over time (last 14 days, grouped by day)
  const now = new Date();
  const fourteenDaysAgo = subDays(now, 14);
  
  const trendData: { date: string; count: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const date = subDays(now, i);
    const dateStr = format(startOfDay(date), 'MMM dd');
    const count = events.filter((e) => {
      const eventDate = startOfDay(new Date(e.createdAt));
      return eventDate.getTime() === startOfDay(date).getTime();
    }).length;
    trendData.push({ date: dateStr, count });
  }

  // Calculate insights
  const insights: DashboardInsight[] = [];

  // Insight 1: High severity trend
  const sevenDaysAgo = subDays(now, 7);
  const fourteenDaysAgoDate = subDays(now, 14);
  
  const lastSevenDaysHighSeverity = events.filter((e) => {
    const eventDate = new Date(e.createdAt);
    return e.severity === 'High' && eventDate >= sevenDaysAgo;
  }).length;

  const previousSevenDaysHighSeverity = events.filter((e) => {
    const eventDate = new Date(e.createdAt);
    return e.severity === 'High' && eventDate >= fourteenDaysAgoDate && eventDate < sevenDaysAgo;
  }).length;

  if (previousSevenDaysHighSeverity > 0) {
    const change = ((lastSevenDaysHighSeverity - previousSevenDaysHighSeverity) / previousSevenDaysHighSeverity) * 100;
    insights.push({
      title: 'High Severity Events',
      description: `${change > 0 ? 'Increased' : 'Decreased'} by ${Math.abs(Math.round(change))}% vs previous 7 days`,
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
      percentage: Math.abs(Math.round(change)),
    });
  }

  // Insight 2: Top category
  const lastSevenDaysEvents = events.filter((e) => new Date(e.createdAt) >= sevenDaysAgo);
  const categoryCounts: Record<string, number> = {};
  lastSevenDaysEvents.forEach((e) => {
    categoryCounts[e.category] = (categoryCounts[e.category] || 0) + 1;
  });
  
  const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0];
  if (topCategory) {
    insights.push({
      title: 'Top Category This Week',
      description: `${topCategory[0]} (${topCategory[1]} events)`,
      trend: 'stable',
    });
  }

  // Insight 3: Highest impact event
  const sortedByImpact = [...events].sort((a, b) => b.metrics.impact - a.metrics.impact);
  if (sortedByImpact.length > 0) {
    const highestImpact = sortedByImpact[0];
    insights.push({
      title: 'Highest Impact Event',
      description: `${highestImpact.title} (Impact: ${highestImpact.metrics.impact})`,
      trend: 'stable',
    });
  }

  return NextResponse.json({
    stats,
    trendData,
    insights,
  });
});
