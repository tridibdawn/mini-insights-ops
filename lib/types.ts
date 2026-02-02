export type UserRole = 'admin' | 'analyst' | 'viewer';

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  name: string;
}

export type Category = 'Fraud' | 'Ops' | 'Safety' | 'Sales' | 'Health' | 'Marketing';
export type Severity = 'Low' | 'Medium' | 'High';

export interface InsightEvent {
  id: string;
  title: string;
  description: string;
  category: Category;
  severity: Severity;
  createdAt: string;
  location: {
    lat: number;
    lng: number;
    city?: string;
  };
  metrics: {
    score: number; // 0-100
    confidence: number; // 0-1
    impact: number;
  };
  tags: string[];
  createdBy?: string;
  updatedAt?: string;
}

export interface EventFilters {
  category?: Category[];
  severity?: Severity[];
  minScore?: number;
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
  tags?: string[];
}

export interface DashboardInsight {
  title: string;
  description: string;
  trend?: 'up' | 'down' | 'stable';
  percentage?: number;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}
