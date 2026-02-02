import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateShort(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'High':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'Medium':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'Low':
      return 'text-green-600 bg-green-50 border-green-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    Fraud: 'bg-red-100 text-red-800',
    Ops: 'bg-blue-100 text-blue-800',
    Safety: 'bg-orange-100 text-orange-800',
    Sales: 'bg-green-100 text-green-800',
    Health: 'bg-purple-100 text-purple-800',
    Marketing: 'bg-pink-100 text-pink-800',
  };
  return colors[category] || 'bg-gray-100 text-gray-800';
}
