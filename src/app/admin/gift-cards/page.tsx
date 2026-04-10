'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { isAdmin } from '@/lib/utils';
import { formatCurrency, formatDate, generateId } from '@/lib/utils';
import { getCollection, addDocument, updateDocument } from '@/lib/firebase';
import { Gift, Plus, Search, Copy, ToggleLeft, ToggleRight } from 'lucide-react';
import type { GiftCard } from '@/types';
import toast from 'react-hot-toast';

export default function GiftCardsPage() {
  const { user } = useAuth();
  const [cards, setCards] = useState<GiftCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newAmount, setNewAmount] = useState(500);
  const [search, setSearch] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!user || !isAdmin(user.email || '')) return;
    loadCards();
  }, [user]);

  const loadCards = async () => {
    try {
      const data = await getCollection('gift-cards');
      const sorted = (data as unknown as GiftCard[]).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setCards(sorted);
    } catch {
      toast.error('Failed to load gift cards');
    } finally {
      setLoading(false);
    }
  };

  const generateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 16; i++) {
      if (i > 0 && i % 4 === 0) code += '-';
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  };

  const createCard = async () => {
    if (newAmount < 50 || newAmount > 10000) {
      toast.error('Amount must be between R50 and R10,000');
      return;
    }
    setCreating(true);
    try {
      const code = generateCode();
      await addDocument('gift-cards', {
        code,
        balance: newAmount,
        originalAmount: newAmount,
        isActive: true,
        purchasedBy: user?.email || '',
        createdAt: new Date().toISOString(),
      });
      toast.success(`Gift card created: ${code}`);
      setShowCreate(false);
      setNewAmount(500);
      loadCards();
    } catch {
      toast.error('Failed to create gift card');
    } finally {
      setCreating(false);
    }
  };

  const toggleCard = async (card: GiftCard) => {
    try {
      await updateDocument('gift-cards', card.id, { isActive: !card.isActive });
      setCards((prev) => prev.map((c) => c.id === card.id ? { ...c, isActive: !c.isActive } : c));
      toast.success(card.isActive ? 'Card deactivated' : 'Card activated');
    } catch {
      toast.error('Failed to update');
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied!');
  };

  const filtered = cards.filter((c) =>
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    c.purchasedBy?.toLowerCase().includes(search.toLowerCase())
  );

  const totalIssued = cards.reduce((t, c) => t + c.originalAmount, 0);
  const totalBalance = cards.reduce((t, c) => t + c.balance, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gift Cards</h1>
          <p className="text-sm text-gray-500 mt-1">
            {cards.length} cards &middot; {formatCurrency(totalIssued)} issued &middot; {formatCurrency(totalBalance)} remaining
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> Create Gift Card
        </button>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Create Gift Card</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (ZAR)</label>
                <input
                  type="number"
                  value={newAmount}
                  onChange={(e) => setNewAmount(Number(e.target.value))}
                  min={50}
                  max={10000}
                  step={50}
                  className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {[100, 250, 500, 1000, 2500, 5000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setNewAmount(amt)}
                    className={`px-3 py-1.5 rounded-lg text-sm border ${
                      newAmount === amt ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {formatCurrency(amt)}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowCreate(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={createCard}
                  disabled={creating}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by code or email..."
          className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Cards List */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Gift className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No gift cards found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((card) => (
            <div key={card.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${card.isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <Gift className={`w-5 h-5 ${card.isActive ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono font-medium text-gray-900">{card.code}</code>
                    <button onClick={() => copyCode(card.code)} className="p-1 text-gray-400 hover:text-gray-600">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Created {formatDate(card.createdAt)}
                    {card.purchasedBy && ` · ${card.purchasedBy}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{formatCurrency(card.balance)}</p>
                  <p className="text-xs text-gray-400">of {formatCurrency(card.originalAmount)}</p>
                </div>
                <button onClick={() => toggleCard(card)} className="p-1">
                  {card.isActive ? (
                    <ToggleRight className="w-6 h-6 text-green-600" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
