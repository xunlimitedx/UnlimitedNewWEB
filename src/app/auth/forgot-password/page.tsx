'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button, Input } from '@/components/ui';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
      toast.success('Reset link sent!');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to send reset email';
      if (message.includes('user-not-found')) {
        toast.error('No account found with that email address');
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <span className="eyebrow-chip eyebrow-light mb-3">Password reset</span>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
          Forgot your password?
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Enter your email and we&apos;ll send you a link to set a new one.
        </p>
      </div>

      {sent ? (
        <div className="text-center space-y-4 bg-white rounded-2xl border border-slate-100 p-8 shadow-[0_2px_20px_-8px_rgba(15,23,42,0.08)]">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-green-500/25">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Check your inbox</h3>
          <p className="text-gray-600 text-sm">
            We&apos;ve sent a password reset link to <strong className="text-gray-900">{email}</strong>. Click the link in the
            email to set a new password.
          </p>
          <p className="text-gray-400 text-xs">
            Didn&apos;t receive it? Check your spam folder or{' '}
            <button
              onClick={() => setSent(false)}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              try again
            </button>
            .
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
            icon={<Mail className="w-4 h-4" />}
          />

          <Button type="submit" size="lg" loading={loading} className="w-full">
            Send Reset Link
          </Button>
        </form>
      )}

      <div className="mt-8 text-center">
        <Link
          href="/auth/login"
          className="text-sm text-primary-600 hover:text-primary-700 font-semibold inline-flex items-center gap-1 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
