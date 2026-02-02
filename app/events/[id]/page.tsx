'use client';

import { useEffect, useState, use, useCallback } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import { InsightEvent } from '@/lib/types';
import { formatDate, getSeverityColor, getCategoryColor } from '@/lib/utils';
import Button from '@/components/ui/Button';

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { user, loading } = useAuth();
  const router = useRouter();
  const [event, setEvent] = useState<InsightEvent | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const fetchEvent = useCallback(async () => {
    try {
      const response = await fetch(`/api/events/${resolvedParams.id}`);
      if (response.ok) {
        const data = await response.json();
        setEvent(data);
      } else {
        router.push('/events');
      }
    } catch (error) {
      console.error('Failed to fetch event:', error);
      router.push('/events');
    } finally {
      setLoadingData(false);
    }
  }, [resolvedParams.id, router]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && resolvedParams.id) {
      fetchEvent();
    }
  }, [user, resolvedParams.id, fetchEvent]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/events/${resolvedParams.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/events');
      } else {
        alert('Failed to delete event');
      }
    } catch (error) {
      console.error('Failed to delete event:', error);
      alert('Failed to delete event');
    } finally {
      setDeleting(false);
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl mb-4 animate-pulse">
            <span className="text-white font-bold text-2xl">IO</span>
          </div>
          <p className="text-gray-600">Loading event...</p>
        </div>
      </div>
    );
  }

  if (!user || !event) return null;

  const canEdit = user.role === 'admin' || user.role === 'analyst';
  const canDelete = user.role === 'admin';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded text-sm font-medium ${getCategoryColor(event.category)}`}>
                    {event.category}
                  </span>
                  <span className={`px-3 py-1 rounded text-sm font-medium border ${getSeverityColor(event.severity)}`}>
                    {event.severity}
                  </span>
                </div>
              </div>
              {canDelete && (
                <Button variant="danger" onClick={handleDelete} disabled={deleting}>
                  {deleting ? 'Deleting...' : 'Delete'}
                </Button>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-sm font-medium text-gray-500 mb-2">Description</h2>
                <p className="text-gray-900">{event.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-200">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Score</h3>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-gray-900">{event.metrics.score}</span>
                    <span className="text-gray-500 ml-1">/100</span>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${event.metrics.score}%` }}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Confidence</h3>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-gray-900">
                      {(event.metrics.confidence * 100).toFixed(0)}
                    </span>
                    <span className="text-gray-500 ml-1">%</span>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${event.metrics.confidence * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Impact</h3>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-gray-900">{event.metrics.impact}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 mb-4">Location</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-900">{event.location.city || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="ml-7">Coordinates: {event.location.lat.toFixed(4)}, {event.location.lng.toFixed(4)}</span>
                  </div>
                </div>
              </div>

              {event.tags.length > 0 && (
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Created:</span>
                    <span className="ml-2 text-gray-900">{formatDate(event.createdAt)}</span>
                  </div>
                  {event.updatedAt && (
                    <div>
                      <span className="text-gray-500">Updated:</span>
                      <span className="ml-2 text-gray-900">{formatDate(event.updatedAt)}</span>
                    </div>
                  )}
                  {event.createdBy && (
                    <div>
                      <span className="text-gray-500">Created by:</span>
                      <span className="ml-2 text-gray-900">{event.createdBy}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
