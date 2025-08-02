import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { Navigation } from './components/Navigation';
import { HomePage } from './components/HomePage';
import { MetricsPage } from './components/MetricsPage';
import { AnalyticsPage } from './components/AnalyticsPage';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'metrics' | 'analytics'>('home');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage onNavigate={setCurrentView} />;
      case 'metrics':
        return <MetricsPage />;
      case 'analytics':
        return <AnalyticsPage />;
      default:
        return <HomePage onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2760%27%20height=%2760%27%20viewBox=%270%200%2060%2060%27%20xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg%20fill=%27none%27%20fill-rule=%27evenodd%27%3E%3Cg%20fill=%27%234f46e5%27%20fill-opacity=%270.03%27%3E%3Ccircle%20cx=%2730%27%20cy=%2730%27%20r=%2730%27/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
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
              
              <Navigation currentView={currentView} onViewChange={setCurrentView} />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
}

export default App;