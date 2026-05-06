'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { loginWithEmail, loginWithGoogle } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) router.push('/');
  }, [user, router]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await loginWithEmail(email, password);
      toast.success('Welcome back!');
      router.push('/');
    } catch (err: any) {
      const errorMessages: Record<string, string> = {
        'auth/invalid-credential': 'Invalid email or password',
        'auth/user-not-found': 'No account found with this email',
        'auth/wrong-password': 'Incorrect password',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
      };
      toast.error(errorMessages[err?.code] || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      toast.success('Welcome!');
      router.push('/');
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        toast.error('Google login failed. Please try again.');
      }
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <span className="eyebrow-chip eyebrow-light mb-3">Welcome back</span>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
          Sign in to your account
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Pick up where you left off — orders, saved hardware and more.
        </p>
      </div>

      {/* Google Sign In */}
      <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 h-12 px-4 rounded-xl border border-slate-200 bg-white text-gray-700 font-medium text-sm hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm transition-all mb-6"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Continue with Google
      </button>

      {/* Divider */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-gradient-to-r from-white via-slate-50 to-white px-4 text-slate-400 uppercase tracking-[0.18em] font-semibold">
            or with email
          </span>
        </div>
      </div>

      {/* Email Form */}
      <form onSubmit={handleEmailLogin} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="w-4 h-4" />}
          autoComplete="email"
          required
        />
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="w-4 h-4" />}
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-600">Remember me</span>
          </label>
          <Link
            href="/auth/forgot-password"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" size="lg" loading={loading} className="w-full">
          Sign In
        </Button>
      </form>

      {/* Register Link */}
      <p className="text-center text-sm text-gray-500 mt-8">
        Don&apos;t have an account?{' '}
        <Link
          href="/auth/register"
          className="text-primary-600 hover:text-primary-700 font-semibold"
        >
          Create one →
        </Link>
      </p>
    </div>
  );
}
