'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import { InsightEvent, Category, Severity } from '@/lib/types';
import { formatDate, getSeverityColor, getCategoryColor } from '@/lib/utils';
import Button from '@/components/ui/Button';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set Mapbox access token if available
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
if (MAPBOX_TOKEN) {
  mapboxgl.accessToken = MAPBOX_TOKEN;
}

export default function MapPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  const [events, setEvents] = useState<InsightEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<InsightEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<InsightEvent | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingData, setLoadingData] = useState(true);
  const [mapError, setMapError] = useState<string>('');

  // Filters
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedSeverities, setSelectedSeverities] = useState<Severity[]>([]);
  const [minScore, setMinScore] = useState<number>(0);
  const [dateRange, setDateRange] = useState<'7' | '30' | 'all'>('all');

  const initializeMap = useCallback(() => {
    if (!mapContainer.current || map.current) return;

    try {
      console.log('Initializing map with token:', MAPBOX_TOKEN ? 'Token present' : 'No token');
      
      // Check if we have a valid Mapbox token
      const hasValidToken = MAPBOX_TOKEN && MAPBOX_TOKEN.startsWith('pk.');
      
      if (hasValidToken) {
        console.log('Using Mapbox style');
        // Use Mapbox style
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [-98.5795, 39.8283],
          zoom: 3,
        });
      } else {
        console.log('Using OpenStreetMap fallback');
        // Fall back to OpenStreetMap
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: {
            version: 8,
            sources: {
              'osm-tiles': {
                type: 'raster',
                tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                tileSize: 256,
                attribution: '© OpenStreetMap contributors',
              },
            },
            layers: [
              {
                id: 'osm-tiles',
                type: 'raster',
                source: 'osm-tiles',
                minzoom: 0,
                maxzoom: 19,
              },
            ],
          },
          center: [-98.5795, 39.8283],
          zoom: 3,
        });
      }

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // Add error handler
      map.current.on('error', (e) => {
        console.error('Map error:', e);
        setMapError(`Map error: ${e.error?.message || 'Unknown error'}`);
      });

      // Add load handler
      map.current.on('load', () => {
        console.log('Map loaded successfully');
        setMapError('');
      });
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError(`Failed to initialize map: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      setEvents(data.events);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const applyFilters = useCallback(() => {
    let filtered = [...events];

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((e) => selectedCategories.includes(e.category));
    }

    if (selectedSeverities.length > 0) {
      filtered = filtered.filter((e) => selectedSeverities.includes(e.severity));
    }

    if (minScore > 0) {
      filtered = filtered.filter((e) => e.metrics.score >= minScore);
    }

    if (dateRange !== 'all') {
      const days = dateRange === '7' ? 7 : 30;
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      filtered = filtered.filter((e) => new Date(e.createdAt) >= cutoff);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.title.toLowerCase().includes(query) ||
          e.description.toLowerCase().includes(query) ||
          e.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    setFilteredEvents(filtered);
  }, [events, selectedCategories, selectedSeverities, minScore, dateRange, searchQuery]);

  const updateMarkers = useCallback(() => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    // Add new markers
    filteredEvents.forEach((event) => {
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.width = '32px';
      el.style.height = '32px';
      el.style.borderRadius = '50%';
      el.style.cursor = 'pointer';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.fontWeight = 'bold';
      el.style.fontSize = '14px';
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

      const severityColors = {
        High: { bg: '#dc2626', text: '#fff' },
        Medium: { bg: '#f59e0b', text: '#fff' },
        Low: { bg: '#10b981', text: '#fff' },
      };

      const color = severityColors[event.severity];
      el.style.backgroundColor = color.bg;
      el.style.color = color.text;
      el.textContent = event.severity[0];

      el.addEventListener('click', () => {
        setSelectedEvent(event);
      });

      const marker = new mapboxgl.Marker(el)
        .setLngLat([event.location.lng, event.location.lat])
        .addTo(map.current!);

      markers.current.push(marker);
    });
  }, [filteredEvents]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user]);

  useEffect(() => {
    console.log('Events loaded:', events.length, 'Map exists:', !!map.current, 'Container exists:', !!mapContainer.current);
    if (events.length > 0 && !map.current && mapContainer.current) {
      console.log('Calling initializeMap');
      initializeMap();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events.length]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  useEffect(() => {
    if (map.current) {
      updateMarkers();
    }
  }, [updateMarkers]);

  const toggleCategory = (category: Category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const toggleSeverity = (severity: Severity) => {
    setSelectedSeverities((prev) =>
      prev.includes(severity) ? prev.filter((s) => s !== severity) : [...prev, severity]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedSeverities([]);
    setMinScore(0);
    setDateRange('all');
    setSearchQuery('');
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl mb-4 animate-pulse">
            <span className="text-white font-bold text-2xl">IO</span>
          </div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const categories: Category[] = ['Fraud', 'Ops', 'Safety', 'Sales', 'Health', 'Marketing'];
  const severities: Severity[] = ['High', 'Medium', 'Low'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="h-[calc(100vh-64px)] flex">
        {/* Filters Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Category</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleCategory(category)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(category)}`}>
                      {category}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Severity</h3>
              <div className="space-y-2">
                {severities.map((severity) => (
                  <label key={severity} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedSeverities.includes(severity)}
                      onChange={() => toggleSeverity(severity)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{severity}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Minimum Score</h3>
              <input
                type="range"
                min="0"
                max="100"
                value={minScore}
                onChange={(e) => setMinScore(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span className="font-medium text-gray-900">{minScore}</span>
                <span>100</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Date Range</h3>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as '7' | '30' | 'all')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All time</option>
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
              </select>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <Button variant="secondary" onClick={clearFilters} className="w-full">
                Clear Filters
              </Button>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredEvents.length}</span> of{' '}
                <span className="font-semibold text-gray-900">{events.length}</span> events
              </p>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          <div ref={mapContainer} className="absolute inset-0" style={{ width: '100%', height: '100%' }} />
          
          {/* Debug Info */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm border border-gray-200 px-3 py-2 rounded-lg shadow-lg text-xs z-10">
            <div className="space-y-1">
              <div><span className="font-semibold">Token:</span> {MAPBOX_TOKEN ? (MAPBOX_TOKEN.startsWith('pk.') ? '✓ Valid (pk.)' : '✗ Invalid (sk. or other)') : '✗ Not set'}</div>
              <div><span className="font-semibold">Events:</span> {events.length} total, {filteredEvents.length} visible</div>
              <div><span className="font-semibold">Markers:</span> {markers.current.length} on map</div>
              <div><span className="font-semibold">Map:</span> {map.current ? '✓ Initialized' : '✗ Not initialized'}</div>
            </div>
          </div>

          {mapError && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-lg max-w-md z-10">
              <div className="flex items-start space-x-2">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="font-medium">Map Error</p>
                  <p className="text-sm mt-1">{mapError}</p>
                  {MAPBOX_TOKEN && MAPBOX_TOKEN.startsWith('sk.') && (
                    <p className="text-sm mt-2 font-medium">
                      Note: You&apos;re using a secret token (sk.). Please use a public token (pk.) for client-side maps.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Event Details Panel */}
        {selectedEvent && (
          <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{selectedEvent.title}</h3>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(selectedEvent.category)}`}>
                  {selectedEvent.category}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium border ${getSeverityColor(selectedEvent.severity)}`}>
                  {selectedEvent.severity}
                </span>
              </div>

              <p className="text-sm text-gray-600">{selectedEvent.description}</p>

              <div className="space-y-2 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Score</span>
                  <span className="font-medium text-gray-900">{selectedEvent.metrics.score}/100</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Confidence</span>
                  <span className="font-medium text-gray-900">{(selectedEvent.metrics.confidence * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Impact</span>
                  <span className="font-medium text-gray-900">{selectedEvent.metrics.impact}</span>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-gray-200">
                <div className="text-sm">
                  <span className="text-gray-500">Location:</span>
                  <span className="ml-2 text-gray-900">{selectedEvent.location.city || 'Unknown'}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Created:</span>
                  <span className="ml-2 text-gray-900">{formatDate(selectedEvent.createdAt)}</span>
                </div>
              </div>

              {selectedEvent.tags.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
