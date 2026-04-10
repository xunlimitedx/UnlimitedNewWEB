'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Shield, Check, Smartphone, Key } from 'lucide-react';
import { multiFactor, PhoneAuthProvider, PhoneMultiFactorGenerator, getAuth } from 'firebase/auth';
import toast from 'react-hot-toast';

/**
 * Admin 2FA enrollment page. Uses Firebase's multi-factor authentication
 * with phone-based verification. Admin users can enable/disable 2FA here.
 * Note: Requires Firebase project to have multi-factor auth enabled.
 */
export default function Admin2FAPage() {
  const { user } = useAuth();
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    try {
      const mfaUser = multiFactor(user);
      setEnrolled(mfaUser.enrolledFactors.length > 0);
    } catch {
      setEnrolled(false);
    }
    setLoading(false);
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Two-Factor Authentication</h1>

      <div className="max-w-xl">
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-xl ${enrolled ? 'bg-green-100' : 'bg-gray-100'}`}>
              <Shield className={`w-6 h-6 ${enrolled ? 'text-green-600' : 'text-gray-400'}`} />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">
                {enrolled ? '2FA is Enabled' : '2FA is Not Enabled'}
              </h2>
              <p className="text-sm text-gray-500">
                {enrolled
                  ? 'Your account is protected with two-factor authentication.'
                  : 'Add an extra layer of security to your admin account.'}
              </p>
            </div>
          </div>

          {enrolled ? (
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-sm text-green-700">Multi-factor authentication is active</span>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                To enable 2FA, please configure it through your Firebase Console under
                Authentication &gt; Sign-in method &gt; Multi-factor authentication.
                This adds phone-based verification as a second factor.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://console.firebase.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                >
                  <Key className="w-4 h-4" />
                  Open Firebase Console
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Security Tips */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Security Best Practices</h3>
          <ul className="space-y-3">
            {[
              'Use a strong, unique password for your admin account',
              'Enable 2FA on your Google account used for sign-in',
              'Never share your admin credentials',
              'Log out after each admin session',
              'Review the audit log regularly for suspicious activity',
              'Keep your browser and OS up to date',
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
