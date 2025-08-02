import { useState, useEffect, useCallback } from 'react';
import { CDNMetrics, TimeRange } from '../types';

export const useMetrics = () => {
  const [metrics, setMetrics] = useState<CDNMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async (timeRange: TimeRange) => {
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

      const response = await fetch('http://localhost:3001/api/metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startTime,
          endTime,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMetrics(data);
    } catch (err) {
      console.error('Error fetching metrics:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    metrics,
    loading,
    error,
    fetchMetrics,
  };
};