import React, { useState, useEffect } from 'react';
import { Activity, Globe, Zap, RefreshCw, AlertCircle } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { Chart } from './Chart';
import { TimeRangeSelector } from './TimeRangeSelector';
import { LoadingSpinner } from './LoadingSpinner';
import { useMetrics } from '../hooks/useMetrics';
import { humanBytes, humanNumber } from '../utils/formatters';
import { TimeRange } from '../types';

export const MetricsPage: React.FC = () => {
  const [selectedRange, setSelectedRange] = useState<TimeRange>({
    label: '24 Hours',
    value: '24h',
    hours: 24
  });

  const { metrics, loading, error, fetchMetrics } = useMetrics();

  useEffect(() => {
    fetchMetrics(selectedRange);
  }, [selectedRange, fetchMetrics]);

  const handleRefresh = () => {
    fetchMetrics(selectedRange);
  };

  const handleRangeChange = (range: TimeRange) => {
    setSelectedRange(range);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">CDN Metrics</h2>
          <p className="text-gray-400">Monitor real-time CDN performance and usage</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Time Range Selector */}
      <TimeRangeSelector
        selectedRange={selectedRange}
        onRangeChange={handleRangeChange}
        loading={loading}
      />

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/20 border border-red-800/50 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <div>
            <p className="text-red-300 font-medium">Failed to fetch metrics</p>
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && !metrics && (
        <div className="flex flex-col items-center justify-center py-16">
          <LoadingSpinner />
          <p className="text-gray-400 mt-4">Fetching CDN metrics...</p>
        </div>
      )}

      {/* Metrics Display */}
      {metrics && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <MetricCard
              title="Total Requests"
              value={metrics.totals.requestsFormatted}
              rawValue={metrics.totals.requests}
              icon={<Activity className="w-5 h-5 text-white" />}
              color="bg-blue-600/20"
            />
            
            <MetricCard
              title="Total Bytes Served"
              value={metrics.totals.bytesFormatted}
              rawValue={metrics.totals.bytes}
              icon={<Zap className="w-5 h-5 text-white" />}
              color="bg-purple-600/20"
            />
            
            <MetricCard
              title="Time Range"
              value={metrics.timeRange.duration}
              rawValue={0}
              icon={<Globe className="w-5 h-5 text-white" />}
              color="bg-green-600/20"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Chart
              data={metrics.timeSeries.requests}
              title="Requests Over Time"
              color="#3B82F6"
              formatValue={humanNumber}
            />
            
            <Chart
              data={metrics.timeSeries.bytes}
              title="Bytes Served Over Time"
              color="#8B5CF6"
              formatValue={humanBytes}
            />
          </div>

          {/* Data Table */}
          {metrics.timeSeries.requests.length > 0 && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
              <div className="p-6 border-b border-gray-700/50">
                <h3 className="text-lg font-semibold text-white">Recent Data Points</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700/30">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Timestamp
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Requests
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Bytes Served
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/50">
                    {metrics.timeSeries.requests.slice(-10).reverse().map((request) => {
                      const correspondingBytes = metrics.timeSeries.bytes.find(
                        b => b.timestamp === request.timestamp
                      );
                      return (
                        <tr key={request.timestamp} className="hover:bg-gray-700/20">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {new Date(request.timestamp).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                            {humanNumber(request.value)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                            {humanBytes(correspondingBytes?.value || 0)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};