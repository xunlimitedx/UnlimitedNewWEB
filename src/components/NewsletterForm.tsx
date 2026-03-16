'use client';

import { useState } from 'react';
import { addDocument } from '@/lib/firebase';
import toast from 'react-hot-toast';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    setLoading(true);
    try {
      await addDocument('newsletterSubscriptions', { email: trimmed });
      toast.success('Subscribed successfully!');
      setEmail('');
    } catch {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full md:w-auto gap-2">
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full md:w-72 h-11 px-4 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      />
      <button
        type="submit"
        disabled={loading}
        className="h-11 px-6 bg-primary-600 text-white rounded-lg font-medium text-sm hover:bg-primary-700 transition-colors whitespace-nowrap disabled:opacity-50"
      >
        {loading ? 'Sending...' : 'Subscribe'}
      </button>
    </form>
  );
}
