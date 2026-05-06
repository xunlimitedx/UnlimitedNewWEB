'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { registerWithEmail, loginWithGoogle } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (user) router.push('/');
  }, [user, router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await registerWithEmail(form.email, form.password, form.name);
      toast.success('Account created successfully!');
      router.push('/');
    } catch (err: any) {
      const errorMessages: Record<string, string> = {
        'auth/email-already-in-use': 'An account with this email already exists',
        'auth/weak-password': 'Password is too weak. Use at least 6 characters.',
        'auth/invalid-email': 'Please enter a valid email address',
      };
      toast.error(errorMessages[err?.code] || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await loginWithGoogle();
      toast.success('Account created!');
      router.push('/');
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        toast.error('Google sign-up failed. Please try again.');
      }
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <span className="eyebrow-chip eyebrow-light mb-3">Create your account</span>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
          Join the workshop.
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Track repairs, save addresses and earn rewards on every order.
        </p>
      </div>

      {/* Google Sign Up */}
      <button
        onClick={handleGoogleSignUp}
        className="w-full flex items-center justify-center gap-3 h-12 px-4 rounded-xl border border-slate-200 bg-white text-gray-700 font-medium text-sm hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm transition-all mb-6"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Sign up with Google
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

      {/* Form */}
      <form onSubmit={handleRegister} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          placeholder="Jane Doe"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          icon={<User className="w-4 h-4" />}
          autoComplete="name"
          required
        />
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          icon={<Mail className="w-4 h-4" />}
          autoComplete="email"
          required
        />
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="At least 6 characters"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            icon={<Lock className="w-4 h-4" />}
            autoComplete="new-password"
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
        <Input
          label="Confirm Password"
          type="password"
          placeholder="Repeat your password"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          icon={<Lock className="w-4 h-4" />}
          autoComplete="new-password"
          required
        />

        <label className="flex items-start gap-2 cursor-pointer pt-1">
          <input
            type="checkbox"
            required
            className="w-4 h-4 mt-0.5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-xs text-gray-500 leading-relaxed">
            I agree to the{' '}
            <Link href="/terms" className="text-primary-600 hover:text-primary-700 font-medium">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-primary-600 hover:text-primary-700 font-medium">
              Privacy Policy
            </Link>
          </span>
        </label>

        <Button type="submit" size="lg" loading={loading} className="w-full">
          Create Account
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-8">
        Already have an account?{' '}
        <Link
          href="/auth/login"
          className="text-primary-600 hover:text-primary-700 font-semibold"
        >
          Sign in →
        </Link>
      </p>
    </div>
  );
}
