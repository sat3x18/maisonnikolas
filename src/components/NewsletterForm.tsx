import React, { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import { api } from '../lib/supabase';

const NewsletterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError('');

    try {
      await api.subscribeToNewsletter(email.trim());
      setSuccess(true);
      setEmail('');
      
      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (error: any) {
      console.error('Newsletter subscription error:', error);
      if (error.message?.includes('duplicate key')) {
        setError('This email is already subscribed to our newsletter.');
      } else {
        setError('Failed to subscribe. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center space-x-3 text-green-400">
        <CheckCircle className="h-6 w-6" />
        <span className="font-medium">Successfully subscribed to our newsletter!</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
        <div className="flex-1 relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full pl-10 pr-4 py-3 border border-white bg-transparent text-white placeholder-gray-300 focus:outline-none focus:border-gray-300 transition-colors duration-200"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !email.trim()}
          className="bg-white text-navy-900 px-6 py-3 font-medium hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
        </button>
      </div>
      
      {error && (
        <p className="text-red-400 text-sm text-center max-w-md mx-auto">
          {error}
        </p>
      )}
    </form>
  );
};

export default NewsletterForm;