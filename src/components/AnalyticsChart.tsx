import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { humanNumberForDisplay } from '../utils/formatters';

interface AnalyticsChartProps {
  data: Array<{
    timestamp: string;
    requests: number;
  }>;
}

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ data }) => {
  const formatXAxisLabel = (tickItem: string) => {
    const date = new Date(tickItem);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const date = new Date(label);
      const dateString = isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString();
      
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-gray-300 text-sm mb-1">
            {dateString}
          </p>
          <p className="text-purple-400 font-semibold">
            Requests: {humanNumberForDisplay(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={formatXAxisLabel}
            stroke="#9CA3AF"
            fontSize={12}
            interval="preserveStartEnd"
          />
          <YAxis 
            tickFormatter={humanNumberForDisplay}
            stroke="#9CA3AF"
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="requests" 
            stroke="#8B5CF6" 
            strokeWidth={2}
            dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#8B5CF6', strokeWidth: 2 }}
            name="Requests"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};