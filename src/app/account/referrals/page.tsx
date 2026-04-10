'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency, generateId } from '@/lib/utils';
import { doc, getDoc, setDoc, getFirestore } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { getCollection, where } from '@/lib/firebase';
import { Users, Copy, Gift, Share2, Trophy } from 'lucide-react';
import type { QueryConstraint } from 'firebase/firestore';
import toast from 'react-hot-toast';

const db = getFirestore(app);

interface ReferralAccount {
  userId: string;
  referralCode: string;
  referralLink: string;
  totalReferred: number;
  totalEarned: number;
  pendingEarnings: number;
  referrals: { email: string; date: string; status: string; earned: number }[];
}

export default function ReferralPage() {
  const { user } = useAuth();
  const [account, setAccount] = useState<ReferralAccount | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    loadOrCreate();
  }, [user]);

  const loadOrCreate = async () => {
    if (!user) return;
    try {
      const snap = await getDoc(doc(db, 'referrals', user.uid));
      if (snap.exists()) {
        setAccount(snap.data() as ReferralAccount);
      } else {
        // Create referral account
        const code = `REF-${user.displayName?.replace(/\s/g, '').substring(0, 4).toUpperCase() || 'USER'}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        const newAccount: ReferralAccount = {
          userId: user.uid,
          referralCode: code,
          referralLink: `https://unlimitedits.co.za/?ref=${code}`,
          totalReferred: 0,
          totalEarned: 0,
          pendingEarnings: 0,
          referrals: [],
        };
        await setDoc(doc(db, 'referrals', user.uid), newAccount);
        setAccount(newAccount);
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    if (account?.referralLink) {
      navigator.clipboard.writeText(account.referralLink);
      toast.success('Referral link copied!');
    }
  };

  const copyCode = () => {
    if (account?.referralCode) {
      navigator.clipboard.writeText(account.referralCode);
      toast.success('Referral code copied!');
    }
  };

  const shareReferral = () => {
    if (navigator.share && account) {
      navigator.share({
        title: 'Join Unlimited IT Solutions',
        text: `Use my referral code ${account.referralCode} and we both earn rewards!`,
        url: account.referralLink,
      });
    } else {
      copyLink();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <Users className="w-16 h-16 text-primary-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Referral Program</h1>
        <p className="text-gray-600 mb-6">Sign in to get your unique referral link and start earning rewards.</p>
        <a href="/auth/login" className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors">
          Sign In
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Referral Program</h1>
      <p className="text-gray-600 mb-8">Invite friends and earn R50 credit for each successful referral!</p>

      {/* How it works */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Share2 className="w-6 h-6 text-primary-600" />
          </div>
          <h3 className="font-medium text-gray-900 mb-1">1. Share</h3>
          <p className="text-xs text-gray-500">Share your unique referral link with friends</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6 text-primary-600" />
          </div>
          <h3 className="font-medium text-gray-900 mb-1">2. They Sign Up</h3>
          <p className="text-xs text-gray-500">Your friend creates an account and makes a purchase</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Gift className="w-6 h-6 text-primary-600" />
          </div>
          <h3 className="font-medium text-gray-900 mb-1">3. Both Earn</h3>
          <p className="text-xs text-gray-500">You get R50 credit, they get 10% off first order</p>
        </div>
      </div>

      {/* Referral Details */}
      {account && (
        <>
          {/* Share Card */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white mb-8">
            <h2 className="text-lg font-semibold mb-4">Your Referral Link</h2>
            <div className="flex gap-2 mb-4">
              <input
                readOnly
                value={account.referralLink}
                className="flex-1 bg-white/20 border border-white/30 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/60 focus:outline-none"
              />
              <button
                onClick={copyLink}
                className="px-4 py-2.5 bg-white text-primary-700 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm opacity-80">Code:</span>
                <code className="bg-white/20 px-3 py-1 rounded-lg text-sm font-mono">{account.referralCode}</code>
                <button onClick={copyCode} className="opacity-80 hover:opacity-100">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={shareReferral}
                className="ml-auto flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg text-sm hover:bg-white/30 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{account.totalReferred}</p>
                  <p className="text-xs text-gray-500">Friends Referred</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <Trophy className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(account.totalEarned)}</p>
                  <p className="text-xs text-gray-500">Total Earned</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100">
                  <Gift className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(account.pendingEarnings)}</p>
                  <p className="text-xs text-gray-500">Pending</p>
                </div>
              </div>
            </div>
          </div>

          {/* Referral History */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Referral History</h3>
            {account.referrals.length > 0 ? (
              <div className="space-y-3">
                {account.referrals.map((r, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{r.email}</p>
                      <p className="text-xs text-gray-500">{new Date(r.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        r.status === 'completed' ? 'bg-green-100 text-green-700' :
                        r.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {r.status}
                      </span>
                      {r.earned > 0 && (
                        <p className="text-sm font-bold text-green-600 mt-1">+{formatCurrency(r.earned)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-6">No referrals yet. Share your link to start earning!</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
