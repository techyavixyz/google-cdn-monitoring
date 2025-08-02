import React from 'react';
import { MetricData } from '../types';
import { formatTimestamp } from '../utils/formatters';

interface ChartProps {
  data: MetricData[];
  title: string;
  color: string;
  formatValue: (value: number) => string;
}

export const Chart: React.FC<ChartProps> = ({ data, title, color, formatValue }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
        <div className="flex items-center justify-center h-64 text-gray-400">
          No data available
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const chartWidth = Math.max(data.length * 10, 400);

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div className="relative h-64">
        <svg className="w-full h-full" viewBox={`0 0 ${chartWidth} 200`}>
          <defs>
            <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0.05" />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map(i => (
            <line
              key={i}
              x1="0"
              y1={i * 40}
              x2={chartWidth}
              y2={i * 40}
              stroke="#374151"
              strokeWidth="0.5"
              opacity="0.5"
            />
          ))}
          
          {/* Chart area */}
          <path
            d={`M 0 ${200 - ((data[0].value - minValue) / (maxValue - minValue)) * 180} ${data
              .map((d, i) => `L ${i * 10} ${200 - ((d.value - minValue) / (maxValue - minValue)) * 180}`)
              .join(' ')} L ${(data.length - 1) * 10} 200 L 0 200 Z`}
            fill={`url(#gradient-${color})`}
          />
          
          {/* Chart line */}
          <path
            d={`M 0 ${200 - ((data[0].value - minValue) / (maxValue - minValue)) * 180} ${data
              .map((d, i) => `L ${i * 10} ${200 - ((d.value - minValue) / (maxValue - minValue)) * 180}`)
              .join(' ')}`}
            fill="none"
            stroke={color}
            strokeWidth="2"
          />
          
          {/* Data points */}
          {data.map((d, i) => (
            <g key={i}>
              <circle
                cx={i * 10}
                cy={200 - ((d.value - minValue) / (maxValue - minValue)) * 180}
                r="3"
                fill={color}
                className="hover:r-4 transition-all duration-200"
              />
              <title>{`${formatTimestamp(d.timestamp)}: ${formatValue(d.value)}`}</title>
            </g>
          ))}
        </svg>
        
        {/* Time labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-400 mt-2">
          <span>{data.length > 0 ? new Date(data[0].timestamp).toLocaleTimeString() : ''}</span>
          <span>{data.length > 0 ? new Date(data[data.length - 1].timestamp).toLocaleTimeString() : ''}</span>
        </div>
        
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 -ml-16">
          <span>{formatValue(maxValue)}</span>
          <span>{formatValue(maxValue * 0.75)}</span>
          <span>{formatValue(maxValue * 0.5)}</span>
          <span>{formatValue(maxValue * 0.25)}</span>
          <span>{formatValue(0)}</span>
        </div>
      </div>
    </div>
  );
};
              key={i}
              cx={i * 10}
              cy={200 - ((d.value - minValue) / (maxValue - minValue)) * 180}
              r="3"
              fill={color}
              className="hover:r-4 transition-all duration-200"
            />
          ))}
        </svg>
        
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 -ml-16">
          <span>{formatValue(maxValue)}</span>
          <span>{formatValue(maxValue * 0.75)}</span>
          <span>{formatValue(maxValue * 0.5)}</span>
          <span>{formatValue(maxValue * 0.25)}</span>
          <span>{formatValue(0)}</span>
        </div>
      </div>
    </div>
  );
};