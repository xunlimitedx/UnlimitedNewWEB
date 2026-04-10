'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/utils';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { Award, Star, Zap, TrendingUp, Gift } from 'lucide-react';
import type { LoyaltyAccount } from '@/types';

const db = getFirestore(app);

const TIER_CONFIG = {
  bronze: { color: 'amber', minSpent: 0, pointMultiplier: 1, label: 'Bronze' },
  silver: { color: 'gray', minSpent: 5000, pointMultiplier: 1.5, label: 'Silver' },
  gold: { color: 'yellow', minSpent: 15000, pointMultiplier: 2, label: 'Gold' },
};

export default function LoyaltyDashboard() {
  const { user } = useAuth();
  const [account, setAccount] = useState<LoyaltyAccount | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, 'loyalty', user.uid));
        if (snap.exists()) {
          setAccount(snap.data() as LoyaltyAccount);
        }
      } catch {} finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

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
        <Award className="w-16 h-16 text-primary-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Loyalty Rewards</h1>
        <p className="text-gray-600 mb-6">Sign in to view and earn loyalty points on every purchase.</p>
        <a href="/auth/login" className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors">
          Sign In
        </a>
      </div>
    );
  }

  const points = account?.points ?? 0;
  const tier = account?.tier ?? 'bronze';
  const totalSpent = account?.totalSpent ?? 0;
  const config = TIER_CONFIG[tier];
  const nextTier = tier === 'bronze' ? 'silver' : tier === 'silver' ? 'gold' : null;
  const nextTierConfig = nextTier ? TIER_CONFIG[nextTier] : null;
  const progressToNext = nextTierConfig ? Math.min((totalSpent / nextTierConfig.minSpent) * 100, 100) : 100;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Loyalty Rewards</h1>

      {/* Current Tier Card */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm opacity-80">Your Tier</p>
              <h2 className="text-2xl font-bold">{config.label} Member</h2>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-80">Available Points</p>
            <p className="text-3xl font-bold">{points.toLocaleString()}</p>
          </div>
        </div>

        {/* Points Value Display */}
        <div className="bg-white/10 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span>Points value: <strong>{formatCurrency(points / 10)}</strong></span>
            <span>Earn rate: <strong>{config.pointMultiplier}x</strong> points per R1</span>
          </div>
        </div>

        {/* Progress to Next Tier */}
        {nextTierConfig && (
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Progress to {nextTierConfig.label}</span>
              <span>{formatCurrency(totalSpent)} / {formatCurrency(nextTierConfig.minSpent)}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div
                className="bg-white rounded-full h-3 transition-all duration-500"
                style={{ width: `${progressToNext}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <Zap className="w-8 h-8 text-primary-600 mx-auto mb-2" />
          <h3 className="font-medium text-gray-900 mb-1">Earn Points</h3>
          <p className="text-xs text-gray-500">Earn {config.pointMultiplier} point(s) for every R1 spent</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <Gift className="w-8 h-8 text-primary-600 mx-auto mb-2" />
          <h3 className="font-medium text-gray-900 mb-1">Redeem</h3>
          <p className="text-xs text-gray-500">10 points = R1 discount at checkout</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <TrendingUp className="w-8 h-8 text-primary-600 mx-auto mb-2" />
          <h3 className="font-medium text-gray-900 mb-1">Tier Up</h3>
          <p className="text-xs text-gray-500">Spend more to unlock higher multipliers</p>
        </div>
      </div>

      {/* Tier Comparison */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h3 className="font-semibold text-gray-900 mb-4">Tier Benefits</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-500">Tier</th>
                <th className="text-center py-2 px-4 font-medium text-gray-500">Min Spend</th>
                <th className="text-center py-2 px-4 font-medium text-gray-500">Points Multiplier</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(TIER_CONFIG).map(([key, val]) => (
                <tr key={key} className={`border-b border-gray-100 ${key === tier ? 'bg-primary-50' : ''}`}>
                  <td className="py-3 pr-4 font-medium text-gray-900 flex items-center gap-2">
                    <Star className={`w-4 h-4 ${key === tier ? 'text-primary-600' : 'text-gray-300'}`} />
                    {val.label}
                    {key === tier && <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">Current</span>}
                  </td>
                  <td className="py-3 px-4 text-center text-gray-600">{formatCurrency(val.minSpent)}</td>
                  <td className="py-3 px-4 text-center text-gray-600">{val.pointMultiplier}x</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Points History */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Points History</h3>
        {account?.history && account.history.length > 0 ? (
          <div className="space-y-3">
            {account.history.slice(0, 20).map((entry, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{entry.description}</p>
                  <p className="text-xs text-gray-500">{new Date(entry.date).toLocaleDateString()}</p>
                </div>
                <span className={`text-sm font-bold ${entry.type === 'earned' ? 'text-green-600' : 'text-red-600'}`}>
                  {entry.type === 'earned' ? '+' : '-'}{entry.points}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-6">No points history yet. Start shopping to earn rewards!</p>
        )}
      </div>
    </div>
  );
}
