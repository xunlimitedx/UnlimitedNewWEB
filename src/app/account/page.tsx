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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
        <p className="text-sm text-gray-500">Update your personal details</p>
      </div>
      <div className="p-6">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-8 h-8" />
              )}
            </div>
            <button className="absolute bottom-0 right-0 w-7 h-7 bg-primary-600 rounded-full flex items-center justify-center text-white shadow-sm hover:bg-primary-700 transition-colors">
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <div>
            <p className="font-semibold text-gray-900">
              {user?.displayName || 'User'}
            </p>
            <p className="text-sm text-gray-500">{user?.email}</p>
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
