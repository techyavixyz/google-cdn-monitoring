import React, { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ResetPasswordFormProps {
  email: string;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ email }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      await resetPassword(email, formData.newPassword);
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
        <div className="inline-flex p-3 bg-purple-600/20 rounded-lg mb-4">
          <Lock className="w-6 h-6 text-purple-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Reset Password
        </h2>
        <p className="text-gray-400">
          Create a new password for {email}
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
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-12 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all duration-200"
              placeholder="Enter new password"
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

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-12 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all duration-200"
              placeholder="Confirm new password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              Reset Password
            </>
          )}
        </button>
      </form>
    </div>
  );
};