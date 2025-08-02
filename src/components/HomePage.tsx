import React from 'react';
import { Globe, Activity, Users, Zap, TrendingUp, Shield } from 'lucide-react';

interface HomePageProps {
  onNavigate: (view: 'metrics' | 'analytics') => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const features = [
    {
      icon: Activity,
      title: 'CDN Metrics',
      description: 'Monitor real-time CDN performance with requests and bytes served over customizable time ranges.',
      action: () => onNavigate('metrics'),
      color: 'bg-blue-600/20 text-blue-400',
      buttonColor: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      icon: Users,
      title: 'Traffic Analytics',
      description: 'Analyze visitor patterns with top countries, client IPs, and most requested URLs.',
      action: () => onNavigate('analytics'),
      color: 'bg-purple-600/20 text-purple-400',
      buttonColor: 'bg-purple-600 hover:bg-purple-700'
    }
  ];

  const stats = [
    { icon: Globe, label: 'Global CDN Coverage', value: '24/7' },
    { icon: Shield, label: 'Real-time Monitoring', value: 'Active' },
    { icon: TrendingUp, label: 'Performance Insights', value: 'Live' },
    { icon: Zap, label: 'Response Time', value: '<100ms' }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl">
            <Globe className="w-12 h-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">
          Google Cloud CDN Analytics
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Comprehensive monitoring and analytics dashboard for your Google Cloud CDN infrastructure. 
          Get real-time insights into performance, traffic patterns, and user behavior.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 text-center">
            <Icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <p className="text-2xl font-bold text-white mb-1">{value}</p>
            <p className="text-sm text-gray-400">{label}</p>
          </div>
        ))}
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-2 gap-8">
        {features.map(({ icon: Icon, title, description, action, color, buttonColor }) => (
          <div key={title} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
            <div className={`inline-flex p-3 rounded-lg ${color} mb-6`}>
              <Icon className="w-6 h-6" />
            </div>
            
            <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
            <p className="text-gray-400 mb-6 leading-relaxed">{description}</p>
            
            <button
              onClick={action}
              className={`w-full px-6 py-3 ${buttonColor} text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2`}
            >
              Explore {title}
              <TrendingUp className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-green-600/20 rounded-lg">
            <Shield className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Secure & Reliable</h3>
            <p className="text-gray-400">
              Built with Google Cloud's robust infrastructure, this dashboard provides secure access to your CDN metrics 
              with enterprise-grade authentication and real-time data processing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};