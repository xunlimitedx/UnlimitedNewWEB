'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { isAdmin } from '@/lib/utils';
import { formatCurrency, formatDate } from '@/lib/utils';
import { getCollection, where } from '@/lib/firebase';
import { ShoppingCart, Mail, Trash2, Clock, Send } from 'lucide-react';
import toast from 'react-hot-toast';

interface AbandonedCart {
  id: string;
  userId: string;
  email: string;
  displayName: string;
  items: { productId: string; name: string; image: string; price: number; quantity: number }[];
  subtotal: number;
  itemCount: number;
  updatedAt: string;
}

export default function AbandonedCartsPage() {
  const { user } = useAuth();
  const [carts, setCarts] = useState<AbandonedCart[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !isAdmin(user.email || '')) return;
    loadCarts();
  }, [user]);

  const loadCarts = async () => {
    try {
      const data = await getCollection('abandoned-carts');
      const sorted = (data as unknown as AbandonedCart[]).sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      setCarts(sorted);
    } catch {
      toast.error('Failed to load abandoned carts');
    } finally {
      setLoading(false);
    }
  };

  const sendRecoveryEmail = async (cart: AbandonedCart) => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'abandoned-cart',
          to: cart.email,
          data: {
            name: cart.displayName,
            items: cart.items,
            subtotal: cart.subtotal,
          },
        }),
      });
      if (res.ok) {
        toast.success(`Recovery email sent to ${cart.email}`);
      } else {
        toast.error('Failed to send email');
      }
    } catch {
      toast.error('Failed to send email');
    }
  };

  const deleteCart = async (cartId: string) => {
    try {
      const { deleteDoc, doc, getFirestore } = await import('firebase/firestore');
      const { app } = await import('@/lib/firebase');
      const db = getFirestore(app);
      await deleteDoc(doc(db, 'abandoned-carts', cartId));
      setCarts((prev) => prev.filter((c) => c.id !== cartId));
      toast.success('Cart removed');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const totalValue = carts.reduce((t, c) => t + c.subtotal, 0);

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
          <h1 className="text-2xl font-bold text-gray-900">Abandoned Carts</h1>
          <p className="text-sm text-gray-500 mt-1">
            {carts.length} abandoned carts worth {formatCurrency(totalValue)}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-100">
              <ShoppingCart className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{carts.length}</p>
              <p className="text-xs text-gray-500">Total Carts</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-100">
              <Clock className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
              <p className="text-xs text-gray-500">Potential Revenue</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {carts.length > 0 ? formatCurrency(totalValue / carts.length) : 'R0'}
              </p>
              <p className="text-xs text-gray-500">Avg Cart Value</p>
            </div>
          </div>
        </div>
      </div>

      {carts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No abandoned carts found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {carts.map((cart) => (
            <div key={cart.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-medium text-gray-900">{cart.displayName || 'Unknown'}</h3>
                  <p className="text-sm text-gray-500">{cart.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    {formatDate(cart.updatedAt)}
                  </span>
                  <button
                    onClick={() => sendRecoveryEmail(cart)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Send recovery email"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteCart(cart.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {cart.items.slice(0, 4).map((item, i) => (
                  <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded-lg text-gray-600">
                    {item.name} × {item.quantity}
                  </span>
                ))}
                {cart.items.length > 4 && (
                  <span className="text-xs text-gray-400">+{cart.items.length - 4} more</span>
                )}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{cart.itemCount} items</span>
                <span className="font-semibold text-gray-900">{formatCurrency(cart.subtotal)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
