'use client';

import { useState, useEffect } from 'react';
import { X, Mail, Gift } from 'lucide-react';
import { addDocument } from '@/lib/firebase';
import toast from 'react-hot-toast';

export default function NewsletterPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('newsletter-popup-dismissed');
    const subscribed = localStorage.getItem('newsletter-subscribed');
    if (dismissed || subscribed) return;

    const timer = setTimeout(() => setVisible(true), 30000); // Show after 30s
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem('newsletter-popup-dismissed', Date.now().toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    setLoading(true);
    try {
      await addDocument('newsletterSubscriptions', {
        email: trimmed,
        source: 'popup',
        subscribedAt: new Date().toISOString(),
      });
      localStorage.setItem('newsletter-subscribed', 'true');
      setSubmitted(true);
      toast.success('Welcome! Check your inbox for your discount code.');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
        {/* Close */}
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 z-10 p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close popup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top accent */}
        <div className="h-2 bg-gradient-to-r from-primary-600 to-primary-400" />

        <div className="p-8 text-center">
          {!submitted ? (
            <>
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Gift className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Get 10% Off Your First Order
              </h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                Subscribe to our newsletter and receive an exclusive discount code,
                plus the latest tech deals and product updates.
              </p>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-primary-600 text-white rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Subscribing...' : 'Claim My 10% Off'}
                </button>
              </form>
              <button
                onClick={dismiss}
                className="mt-4 text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                No thanks, I&apos;ll pay full price
              </button>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                You&apos;re In!
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                Check your inbox for your exclusive 10% discount code.
                Happy shopping!
              </p>
              <button
                onClick={dismiss}
                className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-medium text-sm hover:bg-primary-700 transition-colors"
              >
                Start Shopping
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
