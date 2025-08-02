import React from 'react';
import { ChevronDown } from 'lucide-react';

interface TopUsageSelectorProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
}

export const TopUsageSelector: React.FC<TopUsageSelectorProps> = ({ value, onChange, label }) => {
  const options = [5, 10, 20, 50, 100];

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-gray-300">{label}:</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="appearance-none bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 pr-8 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-200"
        >
          {options.map(option => (
            <option key={option} value={option}>
              Top {option}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
};