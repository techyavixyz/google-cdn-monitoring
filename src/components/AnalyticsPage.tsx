import React, { useState, useEffect } from 'react';
import { Users, Globe, MapPin, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';
import { TimeRangeSelector } from './TimeRangeSelector';
import { LoadingSpinner } from './LoadingSpinner';
import { useAnalytics } from '../hooks/useAnalytics';
import { TimeRange } from '../types';

export const AnalyticsPage: React.FC = () => {
  const [selectedRange, setSelectedRange] = useState<TimeRange>({
    label: '24 Hours',
    value: '24h',
    hours: 24
  });

  const { analytics, loading, error, fetchAnalytics } = useAnalytics();

  useEffect(() => {
    fetchAnalytics(selectedRange);
  }, [selectedRange, fetchAnalytics]);

  const handleRefresh = () => {
    fetchAnalytics(selectedRange);
  };

  const handleRangeChange = (range: TimeRange) => {
    setSelectedRange(range);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Traffic Analytics</h2>
          <p className="text-gray-400">Analyze visitor patterns and geographic distribution</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
            <p className="text-red-300 font-medium">Failed to fetch analytics</p>
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && !analytics && (
        <div className="flex flex-col items-center justify-center py-16">
          <LoadingSpinner />
          <p className="text-gray-400 mt-4">Fetching analytics data...</p>
        </div>
      )}

      {/* Analytics Display */}
      {analytics && (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-600/20 rounded-lg">
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Total Requests</h3>
              </div>
              <p className="text-2xl font-bold text-white">{analytics.totalEntries.toLocaleString()}</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-600/20 rounded-lg">
                  <Globe className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Countries</h3>
              </div>
              <p className="text-2xl font-bold text-white">{analytics.topCountries.length}</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-600/20 rounded-lg">
                  <MapPin className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Unique IPs</h3>
              </div>
              <p className="text-2xl font-bold text-white">{analytics.topIps.length}</p>
            </div>
          </div>

          {/* Top Countries and IPs */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Top Countries */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
              <div className="p-6 border-b border-gray-700/50">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-400" />
                  Top Countries by Request Count
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {analytics.topCountries.map((country, index) => (
                    <div key={country.country} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <span className="text-white font-medium">{country.country}</span>
                      </div>
                      <span className="text-blue-400 font-semibold">{country.countFormatted}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top IPs */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
              <div className="p-6 border-b border-gray-700/50">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  Top Client IPs by Request Count
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {analytics.topIps.map((ip, index) => (
                    <div key={ip.ip} className="p-4 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          <span className="text-white font-mono text-sm">{ip.ip}</span>
                        </div>
                        <span className="text-purple-400 font-semibold">{ip.countFormatted}</span>
                      </div>
                      <div className="ml-9 space-y-1">
                        <p className="text-gray-400 text-sm flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {ip.region}
                        </p>
                        <p className="text-gray-400 text-sm flex items-center gap-1">
                          <ExternalLink className="w-3 h-3" />
                          <span className="truncate max-w-xs">{ip.topUrl}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};