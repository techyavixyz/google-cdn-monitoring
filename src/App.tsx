import React, { useState, useEffect } from 'react';
import { Activity, Globe, Zap, RefreshCw, AlertCircle } from 'lucide-react';
import { MetricCard } from './components/MetricCard';
import { Chart } from './components/Chart';
import { TimeRangeSelector } from './components/TimeRangeSelector';
import { LoadingSpinner } from './components/LoadingSpinner';
import { useMetrics } from './hooks/useMetrics';
import { humanBytes, humanNumber } from './utils/formatters';
import { TimeRange } from './types';

function App() {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%234f46e5" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="30"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-gray-700/50 bg-gray-900/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">CDN Analytics</h1>
                  <p className="text-gray-400">Google Cloud CDN Monitoring Dashboard</p>
                </div>
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
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Time Range Selector */}
          <div className="mb-8">
            <TimeRangeSelector
              selectedRange={selectedRange}
              onRangeChange={handleRangeChange}
              loading={loading}
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-8 bg-red-900/20 border border-red-800/50 rounded-xl p-4 flex items-center gap-3">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                <div className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
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
                        {metrics.timeSeries.requests.slice(-10).reverse().map((request, index) => {
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
        </main>
      </div>
    </div>
  );
}

export default App;