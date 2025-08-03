import React from 'react';
import { Globe, Activity, Users, Zap, TrendingUp, Shield, BarChart3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { LoginForm } from './LoginForm';

interface HomePageProps {
  onNavigate: (view: 'metrics' | 'analytics') => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left side - Welcome content */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <div className="flex justify-center lg:justify-start mb-6">
                <div className="p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl">
                  <BarChart3 className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">KloudScope</span>
              </h1>
              <p className="text-xl text-gray-400 mb-6">
                Advanced Google Cloud CDN Analytics Platform
              </p>
              <p className="text-gray-300 leading-relaxed">
                KloudScope provides comprehensive monitoring and analytics for your Google Cloud CDN infrastructure. 
                Get real-time insights into performance metrics, traffic patterns, and user behavior with our 
                powerful dashboard designed for cloud professionals.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/30 rounded-lg p-4 text-center">
                <Activity className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-white font-semibold">Real-time Metrics</p>
                <p className="text-gray-400 text-sm">Live CDN performance data</p>
              </div>
              <div className="bg-gray-800/30 rounded-lg p-4 text-center">
                <Users className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-white font-semibold">Traffic Analytics</p>
                <p className="text-gray-400 text-sm">Visitor insights & patterns</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-green-600/20 rounded-lg">
                  <Shield className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Developed by Kloud-Scaler</h3>
                  <p className="text-gray-400">
                    Professional cloud infrastructure monitoring solutions with enterprise-grade security and reliability.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Login form */}
          <div className="flex justify-center lg:justify-end">
            <LoginForm />
          </div>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: Activity,
      title: 'CDN Metrics',
      description: 'Monitor real-time CDN performance with requests and bytes served over customizable time ranges with interactive charts.',
      action: () => onNavigate('metrics'),
      color: 'bg-blue-600/20 text-blue-400',
      buttonColor: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      icon: Users,
      title: 'Traffic Analytics',
      description: 'Analyze visitor patterns with top countries, client IPs, and most requested URLs. Customizable top usage limits.',
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
          <div className="p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl relative">
            <BarChart3 className="w-12 h-12 text-white" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">
          KloudScope Dashboard
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Advanced Google Cloud CDN monitoring and analytics platform. Get comprehensive insights into 
          performance metrics, traffic patterns, and user behavior with customizable time frames and detailed reporting.
        </p>
        <div className="mt-6">
          <p className="text-sm text-gray-500">
            Welcome back, <span className="text-blue-400 font-semibold">{user.fullName || user.username}</span>
            {user.username === 'admin' && localStorage.getItem('kloudscope_password_changed') === 'skipped' && (
              <span className="ml-2 text-yellow-400 text-xs">(Using default password)</span>
            )}
          </p>
        </div>
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
      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-sm rounded-xl p-8 border border-blue-700/30">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-600/20 rounded-lg">
            <Globe className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Powered by Kloud-Scaler</h3>
            <p className="text-gray-400">
              KloudScope is developed by Kloud-Scaler, specializing in cloud infrastructure monitoring solutions. 
              Built with Google Cloud's robust infrastructure for enterprise-grade performance and security.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};