import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  rawValue: number;
  previousValue?: number;
  icon: React.ReactNode;
  color: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  rawValue,
  previousValue,
  icon,
  color
}) => {
  const getTrendIcon = () => {
    if (previousValue === undefined) return <Minus className="w-4 h-4" />;
    if (rawValue > previousValue) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (rawValue < previousValue) return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getTrendPercentage = () => {
    if (previousValue === undefined || previousValue === 0) return null;
    const change = ((rawValue - previousValue) / previousValue) * 100;
    return Math.abs(change).toFixed(1);
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-2">{value}</p>
          {getTrendPercentage() && (
            <div className="flex items-center mt-2 text-sm">
              {getTrendIcon()}
              <span className="ml-1 text-gray-400">{getTrendPercentage()}%</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};