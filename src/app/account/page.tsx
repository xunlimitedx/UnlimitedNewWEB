'use client';

import React, { useState } from 'react';
import { Button, Input } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { updateDocument } from '@/lib/firebase';
import { updateProfile } from 'firebase/auth';
import { User, Mail, Phone, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    displayName: userProfile?.displayName || user?.displayName || '',
    email: userProfile?.email || user?.email || '',
    phone: userProfile?.phone || '',
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: form.displayName,
      });

      // Update Firestore profile (fire-and-forget)
      updateDocument('users', user.uid, {
        displayName: form.displayName,
        phone: form.phone,
      });

      toast.success('Profile updated successfully');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-premium overflow-hidden">
      {/* Header band with gradient */}
      <div className="relative px-6 py-5 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-br from-primary-50/60 via-blue-50/40 to-transparent dark:from-primary-900/20 dark:via-blue-900/10">
        <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br from-primary-500/10 to-blue-500/10 blur-2xl" />
        <h2 className="relative text-lg font-bold text-gray-900 dark:text-white tracking-tight">Profile Information</h2>
        <p className="relative text-sm text-gray-500 dark:text-gray-400">Update your personal details</p>
      </div>
      <div className="p-6 sm:p-8">
        {/* Avatar */}
        <div className="flex items-center gap-5 mb-8 pb-8 border-b border-gray-100 dark:border-gray-800">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-blue-600 p-[2px] shadow-lg shadow-primary-500/20">
              <div className="w-full h-full rounded-[14px] bg-white dark:bg-gray-900 flex items-center justify-center text-primary-600 overflow-hidden">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-9 h-9" />
                )}
              </div>
            </div>
            <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-br from-primary-500 to-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-primary-500/30 hover:scale-110 transition-transform ring-2 ring-white dark:ring-gray-900">
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="min-w-0">
            <p className="font-bold text-gray-900 dark:text-white text-lg truncate">
              {user?.displayName || 'User'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
            <span className="inline-flex items-center gap-1.5 mt-2 rounded-full bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Verified account
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 max-w-lg">
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={form.displayName}
            onChange={(e) => setForm({ ...form, displayName: e.target.value })}
            icon={<User className="w-4 h-4" />}
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            disabled
            icon={<Mail className="w-4 h-4" />}
          />
          <Input
            label="Phone"
            type="tel"
            placeholder="082 000 0000"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            icon={<Phone className="w-4 h-4" />}
          />
          <div className="pt-4">
            <Button type="submit" loading={loading}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
