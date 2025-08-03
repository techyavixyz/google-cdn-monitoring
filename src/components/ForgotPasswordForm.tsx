import React, { useState } from 'react';
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ForgotPasswordFormProps {
  onBack: () => void;
  onResetPassword: (email: string) => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBack, onResetPassword }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const { forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await forgotPassword(email);
      setSent(true);
      // Simulate email verification - in real app, user would click email link
      setTimeout(() => {
        onResetPassword(email);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-green-600/20 rounded-lg mb-4">
            <CheckCircle className="w-6 h-6 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Email Verified
          </h2>
          <p className="text-gray-400">
            Redirecting to password reset...
          </p>
        </div>
        <div className="flex justify-center">
          <div className="w-6 h-6 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 w-full max-w-md">
      <div className="text-center mb-8">
        <div className="inline-flex p-3 bg-orange-600/20 rounded-lg mb-4">
          <Mail className="w-6 h-6 text-orange-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Forgot Password
        </h2>
        <p className="text-gray-400">
          Enter your email to reset your password
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
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all duration-200"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Send className="w-4 h-4" />
              Send Reset Link
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={onBack}
          className="text-sm text-gray-400 hover:text-white transition-colors duration-200 flex items-center justify-center gap-1 mx-auto"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to Login
        </button>
      </div>
    </div>
  );
};