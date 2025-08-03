import { useState, useEffect, useCallback } from 'react';
import { CDNMetrics, TimeRange } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const useMetrics = () => {
  const [metrics, setMetrics] = useState<CDNMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

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

      // For now, we'll create mock data since the backend isn't available
      // In production, this would be the actual API call
      const mockData = generateMockMetricsData(startTime, endTime);
      setMetrics(mockData);
      
      /* Uncomment when backend is available:
      const response = await fetch('/api/metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
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
      */
    } catch (err) {
      console.error('Error fetching metrics:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const generateMockMetricsData = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffHours = Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60);
    
    // Generate time series data
    const requestsTimeSeries = [];
    const bytesTimeSeries = [];
    const points = Math.min(24, Math.max(6, Math.floor(diffHours)));
    
    let totalRequests = 0;
    let totalBytes = 0;
    
    for (let i = 0; i < points; i++) {
      const timestamp = new Date(start.getTime() + (i * diffHours * 60 * 60 * 1000 / points));
      const requests = Math.floor(Math.random() * 10000) + 1000;
      const bytes = Math.floor(Math.random() * 1000000000) + 100000000; // 100MB to 1GB
      
      requestsTimeSeries.push({
        timestamp: timestamp.toISOString(),
        value: requests
      });
      
      bytesTimeSeries.push({
        timestamp: timestamp.toISOString(),
        value: bytes
      });
      
      totalRequests += requests;
      totalBytes += bytes;
    }
    
    return {
      totals: {
        requests: totalRequests,
        bytes: totalBytes,
        requestsFormatted: formatNumber(totalRequests),
        bytesFormatted: formatBytes(totalBytes)
      },
      timeSeries: {
        requests: requestsTimeSeries,
        bytes: bytesTimeSeries
      },
      timeRange: {
        start: startTime,
        end: endTime,
        duration: `${diffHours.toFixed(1)}h`
      }
    };
  };
  
  const formatNumber = (n: number): string => {
    if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
    if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
    if (n >= 1e3) return `${Math.round(n / 1e3)}K`;
    return n.toString();
  };
  
  const formatBytes = (bytes: number): string => {
    const gb = 1024 ** 3;
    const mb = 1024 ** 2;
    const kb = 1024;
    if (bytes >= gb) return `${(bytes / gb).toFixed(2)} GB`;
    if (bytes >= mb) return `${(bytes / mb).toFixed(2)} MB`;
    if (bytes >= kb) return `${(bytes / kb).toFixed(2)} KB`;
    return `${bytes} B`;
  };

  return {
    metrics,
    loading,
    error,
    fetchMetrics,
  };
};