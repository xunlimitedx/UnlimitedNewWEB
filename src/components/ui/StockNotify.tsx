'use client';

import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import toast from 'react-hot-toast';

interface StockNotifyProps {
  productId: string;
  productName: string;
}

export default function StockNotify({ productId, productName }: StockNotifyProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/stock-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), productId, productName }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Failed to subscribe');
        return;
      }
      toast.success(data.message);
      setSubscribed(true);
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (subscribed) {
    return (
      <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-100">
        <Bell className="w-4 h-4 text-green-600" />
        <span className="text-sm text-green-700">{"We'll notify you when this item is back in stock!"}</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
      <div className="flex items-center gap-2 mb-2">
        <Bell className="w-4 h-4 text-primary-600" />
        <span className="text-sm font-medium text-gray-900">Notify Me When Available</span>
      </div>
      <div className="flex gap-2">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="flex-1"
        />
        <Button type="submit" size="sm" loading={loading}>
          Notify Me
        </Button>
      </div>
    </form>
  );
}
