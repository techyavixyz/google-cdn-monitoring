import React from 'react';
import { BarChart3, Users, Home } from 'lucide-react';

interface NavigationProps {
  currentView: 'home' | 'metrics' | 'analytics';
  onViewChange: (view: 'home' | 'metrics' | 'analytics') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: 'home', label: 'Overview', icon: Home },
    { id: 'metrics', label: 'CDN Metrics', icon: BarChart3 },
    { id: 'analytics', label: 'Traffic Analytics', icon: Users },
  ] as const;

  return (
    <nav className="flex gap-1 bg-gray-800/50 rounded-lg p-1 items-center">
      {navItems.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onViewChange(id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            currentView === id
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
              : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
          }`}
        >
          <Icon className="w-4 h-4" />
          {label}
        </button>
      ))}
    </nav>
  );
};