import React, { useState } from 'react';
import { Calendar, Clock, ChevronDown } from 'lucide-react';
import { TimeRange } from '../types';

interface TimeRangeSelectorProps {
  selectedRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
  loading?: boolean;
}

const PRESET_RANGES: TimeRange[] = [
  { label: '1 Hour', value: '1h', hours: 1 },
  { label: '6 Hours', value: '6h', hours: 6 },
  { label: '24 Hours', value: '24h', hours: 24 },
  { label: '7 Days', value: '7d', hours: 168 },
  { label: '30 Days', value: '30d', hours: 720 },
];

export const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  selectedRange,
  onRangeChange,
  loading = false
}) => {
  const [showCustom, setShowCustom] = useState(false);
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const handlePresetSelect = (range: TimeRange) => {
    setShowCustom(false);
    onRangeChange(range);
  };

  const handleCustomApply = () => {
    if (customStart && customEnd) {
      const start = new Date(customStart);
      const end = new Date(customEnd);
      
      if (start < end) {
        const customRange: TimeRange = {
          label: 'Custom Range',
          value: 'custom',
          start,
          end
        };
        onRangeChange(customRange);
        setShowCustom(false);
      }
    }
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2 mb-4">
        {PRESET_RANGES.map((range) => (
          <button
            key={range.value}
            onClick={() => handlePresetSelect(range)}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedRange.value === range.value
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {range.label}
          </button>
        ))}
        
        <button
          onClick={() => setShowCustom(!showCustom)}
          disabled={loading}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
            selectedRange.value === 'custom'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
              : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white'
          } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Calendar className="w-4 h-4" />
          Custom
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {showCustom && (
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 mb-4">
          <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Custom Time Range
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Start Date & Time
              </label>
              <input
                type="datetime-local"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                End Date & Time
              </label>
              <input
                type="datetime-local"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setShowCustom(false)}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleCustomApply}
              disabled={!customStart || !customEnd}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Apply Range
            </button>
          </div>
        </div>
      )}

      {selectedRange.value === 'custom' && selectedRange.start && selectedRange.end && (
        <div className="text-sm text-gray-400 mb-4">
          <span className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {formatDateTime(selectedRange.start)} → {formatDateTime(selectedRange.end)}
          </span>
        </div>
      )}
    </div>
  );
};