import React, { useState } from 'react';
import { User, Lock, LogIn, Eye, EyeOff, KeyRound } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LoginFormProps {
  onForgotPassword: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onForgotPassword }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.username, formData.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 w-full max-w-md">
      <div className="text-center mb-8">
        <div className="inline-flex p-3 bg-blue-600/20 rounded-lg mb-4">
          <User className="w-6 h-6 text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Welcome Back
        </h2>
        <p className="text-gray-400">
          Sign in to access KloudScope
        </p>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-800/50 rounded-lg p-3 mb-6">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Username
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-200"
              placeholder="Enter your username"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-12 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-200"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              Sign In
            </>
          )}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={onForgotPassword}
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200 flex items-center justify-center gap-1 mx-auto"
        >
          <KeyRound className="w-3 h-3" />
          Forgot Password?
        </button>
      </div>

    </div>
  );
};