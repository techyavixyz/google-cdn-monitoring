import { useState, useCallback } from 'react';
import { AnalyticsData, TimeRange } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchAnalytics = useCallback(async (timeRange: TimeRange, limit: number = 10) => {
    setLoading(true);
    setError(null);

    try {
      let startTime: string;
      let endTime: string;

      if (timeRange.start && timeRange.end) {
        // Custom range
        startTime = timeRange.start.toISOString();
        endTime = timeRange.end.toISOString();
      } else if (timeRange.hours) {
        // Preset range
        const end = new Date();
        const start = new Date(end.getTime() - (timeRange.hours * 60 * 60 * 1000));
        endTime = end.toISOString();
        startTime = start.toISOString();
      } else {
        throw new Error('Invalid time range');
      }

      // For now, we'll create mock data since the backend isn't available
      // In production, this would be the actual API call
      const mockData = generateMockAnalyticsData(startTime, endTime, limit);
      setAnalytics(mockData);
      
      /* Uncomment when backend is available:
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          startTime,
          endTime,
          limit,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAnalytics(data);
      */
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const generateMockAnalyticsData = (startTime: string, endTime: string, limit: number) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffHours = Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60);
    
    // Generate time series data
    const timeSeries = [];
    const points = Math.min(24, Math.max(6, Math.floor(diffHours)));
    
    for (let i = 0; i < points; i++) {
      const timestamp = new Date(start.getTime() + (i * diffHours * 60 * 60 * 1000 / points));
      timeSeries.push({
        timestamp: timestamp.toISOString(),
        requests: Math.floor(Math.random() * 1000) + 100
      });
    }
    
    // Generate mock countries data
    const countries = ['IN', 'US', 'KN', 'AE', 'QA', 'IE', 'PK', 'GB', 'KE', 'AU'];
    const topCountries = countries.slice(0, limit).map((country, index) => ({
      country,
      count: Math.floor(Math.random() * 100) + (100 - index * 10),
      countFormatted: ''
    }));
    
    // Generate mock IPs data
    const topIps = Array.from({ length: limit }, (_, index) => ({
      ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      count: Math.floor(Math.random() * 100) + (100 - index * 10),
      countFormatted: '',
      region: ['IN', 'US', 'KN', 'AE', 'QA'][Math.floor(Math.random() * 5)],
      topUrl: 'https://example.com/path',
      location: null
    }));
    
    const totalEntries = timeSeries.reduce((sum, point) => sum + point.requests, 0);
    
    return {
      topIps,
      topCountries,
      timeSeries,
      totalEntries,
      timeRange: {
        start: startTime,
        end: endTime,
        duration: `${diffHours.toFixed(1)}h`
      }
    };
  };

  return {
    analytics,
    loading,
    error,
    fetchAnalytics,
  };
};