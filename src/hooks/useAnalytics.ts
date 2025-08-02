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

      const response = await fetch('http://localhost:3001/api/analytics', {
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
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [token]);

  return {
    analytics,
    loading,
    error,
    fetchAnalytics,
  };
};