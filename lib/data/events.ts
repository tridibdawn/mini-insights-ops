import { InsightEvent, EventFilters, Category, Severity } from '../types';

// In-memory event store
let events: InsightEvent[] = [];

// Seed data with 30+ events across different cities
export function initializeEvents() {
  if (events.length === 0) {
    events = [
      {
        id: '1',
        title: 'Fraudulent Transaction Detected',
        description: 'Multiple high-value transactions from unusual location detected in user account.',
        category: 'Fraud',
        severity: 'High',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        location: { lat: 40.7128, lng: -74.0060, city: 'New York, NY' },
        metrics: { score: 92, confidence: 0.95, impact: 8500 },
        tags: ['transaction', 'high-risk', 'automated-alert'],
      },
      {
        id: '2',
        title: 'Server Response Time Degradation',
        description: 'API response times increased by 300% in the last hour.',
        category: 'Ops',
        severity: 'High',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        location: { lat: 37.7749, lng: -122.4194, city: 'San Francisco, CA' },
        metrics: { score: 88, confidence: 0.92, impact: 4200 },
        tags: ['performance', 'api', 'urgent'],
      },
      {
        id: '3',
        title: 'Workplace Safety Incident',
        description: 'Minor injury reported in warehouse facility, all protocols followed.',
        category: 'Safety',
        severity: 'Medium',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        location: { lat: 41.8781, lng: -87.6298, city: 'Chicago, IL' },
        metrics: { score: 65, confidence: 0.88, impact: 1200 },
        tags: ['warehouse', 'injury', 'compliance'],
      },
      {
        id: '4',
        title: 'Sales Conversion Drop',
        description: 'Checkout conversion rate dropped 15% compared to last week.',
        category: 'Sales',
        severity: 'Medium',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        location: { lat: 34.0522, lng: -118.2437, city: 'Los Angeles, CA' },
        metrics: { score: 72, confidence: 0.89, impact: 3500 },
        tags: ['conversion', 'checkout', 'revenue'],
      },
      {
        id: '5',
        title: 'Health Check Failed',
        description: 'Database health check failed, backup systems activated.',
        category: 'Health',
        severity: 'High',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        location: { lat: 47.6062, lng: -122.3321, city: 'Seattle, WA' },
        metrics: { score: 95, confidence: 0.98, impact: 6800 },
        tags: ['database', 'health-check', 'critical'],
      },
      {
        id: '6',
        title: 'Marketing Campaign Performance',
        description: 'Email campaign showing higher than expected engagement rates.',
        category: 'Marketing',
        severity: 'Low',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        location: { lat: 42.3601, lng: -71.0589, city: 'Boston, MA' },
        metrics: { score: 78, confidence: 0.85, impact: 2100 },
        tags: ['email', 'engagement', 'positive'],
      },
      {
        id: '7',
        title: 'Suspicious Account Activity',
        description: 'Multiple failed login attempts from different IP addresses.',
        category: 'Fraud',
        severity: 'Medium',
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        location: { lat: 33.4484, lng: -112.0740, city: 'Phoenix, AZ' },
        metrics: { score: 68, confidence: 0.82, impact: 1800 },
        tags: ['login', 'security', 'monitoring'],
      },
      {
        id: '8',
        title: 'Infrastructure Cost Spike',
        description: 'Cloud infrastructure costs increased by 40% this week.',
        category: 'Ops',
        severity: 'Medium',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        location: { lat: 39.7392, lng: -104.9903, city: 'Denver, CO' },
        metrics: { score: 75, confidence: 0.90, impact: 5200 },
        tags: ['infrastructure', 'cost', 'budget'],
      },
      {
        id: '9',
        title: 'Equipment Maintenance Required',
        description: 'Predictive maintenance alert for production line equipment.',
        category: 'Safety',
        severity: 'Low',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        location: { lat: 29.7604, lng: -95.3698, city: 'Houston, TX' },
        metrics: { score: 55, confidence: 0.75, impact: 900 },
        tags: ['maintenance', 'equipment', 'preventive'],
      },
      {
        id: '10',
        title: 'Record Sales Day',
        description: 'Highest single-day sales in Q4, exceeding targets by 25%.',
        category: 'Sales',
        severity: 'Low',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        location: { lat: 25.7617, lng: -80.1918, city: 'Miami, FL' },
        metrics: { score: 98, confidence: 0.99, impact: 12500 },
        tags: ['sales', 'record', 'positive'],
      },
      {
        id: '11',
        title: 'System Uptime Achievement',
        description: '99.99% uptime maintained for 90 consecutive days.',
        category: 'Health',
        severity: 'Low',
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        location: { lat: 39.9526, lng: -75.1652, city: 'Philadelphia, PA' },
        metrics: { score: 96, confidence: 0.97, impact: 3200 },
        tags: ['uptime', 'reliability', 'milestone'],
      },
      {
        id: '12',
        title: 'Ad Fraud Detection',
        description: 'Bot traffic detected in advertising campaign, blocking initiated.',
        category: 'Marketing',
        severity: 'High',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        location: { lat: 32.7767, lng: -96.7970, city: 'Dallas, TX' },
        metrics: { score: 85, confidence: 0.91, impact: 4800 },
        tags: ['advertising', 'fraud', 'bot-detection'],
      },
      {
        id: '13',
        title: 'Data Center Temperature Alert',
        description: 'Cooling system efficiency dropped, temperature rising in Zone B.',
        category: 'Ops',
        severity: 'Medium',
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        location: { lat: 30.2672, lng: -97.7431, city: 'Austin, TX' },
        metrics: { score: 70, confidence: 0.86, impact: 2800 },
        tags: ['datacenter', 'cooling', 'hardware'],
      },
      {
        id: '14',
        title: 'Employee Safety Training Completion',
        description: '98% of employees completed quarterly safety training.',
        category: 'Safety',
        severity: 'Low',
        createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
        location: { lat: 37.3382, lng: -121.8863, city: 'San Jose, CA' },
        metrics: { score: 92, confidence: 0.94, impact: 1500 },
        tags: ['training', 'compliance', 'positive'],
      },
      {
        id: '15',
        title: 'Payment Gateway Timeout',
        description: 'Third-party payment processor experiencing intermittent timeouts.',
        category: 'Ops',
        severity: 'High',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        location: { lat: 45.5152, lng: -122.6784, city: 'Portland, OR' },
        metrics: { score: 89, confidence: 0.93, impact: 7200 },
        tags: ['payment', 'gateway', 'timeout'],
      },
      {
        id: '16',
        title: 'Customer Churn Prediction',
        description: 'ML model identified 50 high-risk customers likely to churn this month.',
        category: 'Sales',
        severity: 'Medium',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        location: { lat: 36.1627, lng: -86.7816, city: 'Nashville, TN' },
        metrics: { score: 73, confidence: 0.87, impact: 4500 },
        tags: ['churn', 'retention', 'ml-prediction'],
      },
      {
        id: '17',
        title: 'Credit Card Fraud Alert',
        description: 'Stolen credit card detected attempting multiple purchases.',
        category: 'Fraud',
        severity: 'High',
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        location: { lat: 38.5816, lng: -121.4944, city: 'Sacramento, CA' },
        metrics: { score: 94, confidence: 0.96, impact: 6200 },
        tags: ['credit-card', 'fraud', 'blocked'],
      },
      {
        id: '18',
        title: 'Social Media Campaign Success',
        description: 'Viral social media campaign exceeded engagement targets by 200%.',
        category: 'Marketing',
        severity: 'Low',
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        location: { lat: 35.2271, lng: -80.8431, city: 'Charlotte, NC' },
        metrics: { score: 88, confidence: 0.90, impact: 3800 },
        tags: ['social-media', 'viral', 'positive'],
      },
      {
        id: '19',
        title: 'API Rate Limit Exceeded',
        description: 'Third-party API rate limits being hit, affecting service availability.',
        category: 'Health',
        severity: 'Medium',
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        location: { lat: 39.7684, lng: -86.1581, city: 'Indianapolis, IN' },
        metrics: { score: 67, confidence: 0.84, impact: 2200 },
        tags: ['api', 'rate-limit', 'integration'],
      },
      {
        id: '20',
        title: 'Fire Suppression System Test',
        description: 'Quarterly fire suppression system test completed successfully.',
        category: 'Safety',
        severity: 'Low',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        location: { lat: 43.0389, lng: -87.9065, city: 'Milwaukee, WI' },
        metrics: { score: 91, confidence: 0.95, impact: 800 },
        tags: ['fire-safety', 'testing', 'compliance'],
      },
      {
        id: '21',
        title: 'Inventory Shrinkage Detected',
        description: 'Unexplained inventory discrepancies detected at retail location.',
        category: 'Fraud',
        severity: 'Medium',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        location: { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City, OK' },
        metrics: { score: 71, confidence: 0.81, impact: 3200 },
        tags: ['inventory', 'shrinkage', 'investigation'],
      },
      {
        id: '22',
        title: 'Server Disk Space Critical',
        description: 'Production server disk usage at 95%, cleanup required immediately.',
        category: 'Ops',
        severity: 'High',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        location: { lat: 36.7478, lng: -119.7871, city: 'Fresno, CA' },
        metrics: { score: 91, confidence: 0.94, impact: 5500 },
        tags: ['disk-space', 'storage', 'urgent'],
      },
      {
        id: '23',
        title: 'Customer Satisfaction Score Up',
        description: 'NPS score increased by 12 points compared to last quarter.',
        category: 'Sales',
        severity: 'Low',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        location: { lat: 38.9072, lng: -77.0369, city: 'Washington, DC' },
        metrics: { score: 87, confidence: 0.91, impact: 2800 },
        tags: ['nps', 'satisfaction', 'positive'],
      },
      {
        id: '24',
        title: 'Load Balancer Health Check',
        description: 'One load balancer node failing health checks, traffic redistributed.',
        category: 'Health',
        severity: 'Medium',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        location: { lat: 33.7490, lng: -84.3880, city: 'Atlanta, GA' },
        metrics: { score: 74, confidence: 0.88, impact: 3400 },
        tags: ['load-balancer', 'health', 'redundancy'],
      },
      {
        id: '25',
        title: 'Email Deliverability Issue',
        description: 'Spike in email bounce rates, possible reputation issue.',
        category: 'Marketing',
        severity: 'Medium',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        location: { lat: 40.7608, lng: -111.8910, city: 'Salt Lake City, UT' },
        metrics: { score: 69, confidence: 0.83, impact: 2600 },
        tags: ['email', 'deliverability', 'reputation'],
      },
      {
        id: '26',
        title: 'Hazmat Compliance Audit Passed',
        description: 'Annual hazardous materials compliance audit completed with zero violations.',
        category: 'Safety',
        severity: 'Low',
        createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
        location: { lat: 35.0844, lng: -106.6504, city: 'Albuquerque, NM' },
        metrics: { score: 95, confidence: 0.96, impact: 1100 },
        tags: ['hazmat', 'compliance', 'audit'],
      },
      {
        id: '27',
        title: 'Account Takeover Prevented',
        description: 'Automated system prevented account takeover attempt using stolen credentials.',
        category: 'Fraud',
        severity: 'High',
        createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
        location: { lat: 32.7157, lng: -117.1611, city: 'San Diego, CA' },
        metrics: { score: 93, confidence: 0.97, impact: 7800 },
        tags: ['account-takeover', 'prevention', 'security'],
      },
      {
        id: '28',
        title: 'Network Latency Spike',
        description: 'Unusual network latency detected between data centers.',
        category: 'Ops',
        severity: 'Medium',
        createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
        location: { lat: 44.9778, lng: -93.2650, city: 'Minneapolis, MN' },
        metrics: { score: 66, confidence: 0.79, impact: 1900 },
        tags: ['network', 'latency', 'performance'],
      },
      {
        id: '29',
        title: 'Lead Generation Surge',
        description: 'Webinar generated 300% more qualified leads than average.',
        category: 'Marketing',
        severity: 'Low',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        location: { lat: 41.2565, lng: -95.9345, city: 'Omaha, NE' },
        metrics: { score: 89, confidence: 0.92, impact: 4200 },
        tags: ['leads', 'webinar', 'positive'],
      },
      {
        id: '30',
        title: 'SSL Certificate Expiring',
        description: 'Production SSL certificate expires in 7 days, renewal required.',
        category: 'Health',
        severity: 'High',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        location: { lat: 33.4484, lng: -112.0740, city: 'Phoenix, AZ' },
        metrics: { score: 86, confidence: 0.99, impact: 8900 },
        tags: ['ssl', 'certificate', 'expiration'],
      },
      {
        id: '31',
        title: 'Quarterly Revenue Target Exceeded',
        description: 'Q4 revenue exceeded target by 18%, strongest quarter of the year.',
        category: 'Sales',
        severity: 'Low',
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        location: { lat: 40.4406, lng: -79.9959, city: 'Pittsburgh, PA' },
        metrics: { score: 97, confidence: 0.98, impact: 15200 },
        tags: ['revenue', 'quarterly', 'positive'],
      },
      {
        id: '32',
        title: 'DDoS Attack Mitigated',
        description: 'Large-scale DDoS attack detected and successfully mitigated.',
        category: 'Ops',
        severity: 'High',
        createdAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
        location: { lat: 36.1699, lng: -115.1398, city: 'Las Vegas, NV' },
        metrics: { score: 90, confidence: 0.95, impact: 9200 },
        tags: ['ddos', 'security', 'attack'],
      },
    ];
  }
}

export function getAllEvents(): InsightEvent[] {
  return [...events];
}

export function getEventById(id: string): InsightEvent | undefined {
  return events.find((e) => e.id === id);
}

export function getFilteredEvents(filters: EventFilters): InsightEvent[] {
  let filtered = [...events];

  if (filters.category && filters.category.length > 0) {
    filtered = filtered.filter((e) => filters.category!.includes(e.category));
  }

  if (filters.severity && filters.severity.length > 0) {
    filtered = filtered.filter((e) => filters.severity!.includes(e.severity));
  }

  if (filters.minScore !== undefined) {
    filtered = filtered.filter((e) => e.metrics.score >= filters.minScore!);
  }

  if (filters.dateRange) {
    const start = new Date(filters.dateRange.start);
    const end = new Date(filters.dateRange.end);
    filtered = filtered.filter((e) => {
      const eventDate = new Date(e.createdAt);
      return eventDate >= start && eventDate <= end;
    });
  }

  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(
      (e) =>
        e.title.toLowerCase().includes(search) ||
        e.description.toLowerCase().includes(search) ||
        e.tags.some((tag) => tag.toLowerCase().includes(search))
    );
  }

  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter((e) =>
      filters.tags!.some((tag) => e.tags.includes(tag))
    );
  }

  return filtered;
}

export function createEvent(event: Omit<InsightEvent, 'id' | 'createdAt'>): InsightEvent {
  const newEvent: InsightEvent = {
    ...event,
    id: String(events.length + 1),
    createdAt: new Date().toISOString(),
  };
  events.push(newEvent);
  return newEvent;
}

export function updateEvent(id: string, updates: Partial<InsightEvent>): InsightEvent | null {
  const index = events.findIndex((e) => e.id === id);
  if (index === -1) return null;

  events[index] = {
    ...events[index],
    ...updates,
    id: events[index].id,
    createdAt: events[index].createdAt,
    updatedAt: new Date().toISOString(),
  };

  return events[index];
}

export function deleteEvent(id: string): boolean {
  const index = events.findIndex((e) => e.id === id);
  if (index === -1) return false;

  events.splice(index, 1);
  return true;
}

export function getEventStats() {
  const total = events.length;
  const byCategory: Record<Category, number> = {
    Fraud: 0,
    Ops: 0,
    Safety: 0,
    Sales: 0,
    Health: 0,
    Marketing: 0,
  };
  const bySeverity: Record<Severity, number> = {
    Low: 0,
    Medium: 0,
    High: 0,
  };

  events.forEach((event) => {
    byCategory[event.category]++;
    bySeverity[event.severity]++;
  });

  return { total, byCategory, bySeverity };
}
