'use client';

import React, { useState } from 'react';
import { addDocument } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui';
import { Bell, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatCurrency } from '@/lib/utils';

interface PriceAlertButtonProps {
  productId: string;
  productName: string;
  currentPrice: number;
}

export default function PriceAlertButton({ productId, productName, currentPrice }: PriceAlertButtonProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [targetPrice, setTargetPrice] = useState(Math.floor(currentPrice * 0.9));
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please sign in to set a price alert');
      return;
    }
    try {
      await addDocument('price-alerts', {
        userId: user.uid,
        userEmail: user.email,
        productId,
        productName,
        targetPrice,
        currentPrice,
        notified: false,
      });
      setSubmitted(true);
      toast.success('Price alert set!');
      setTimeout(() => setIsOpen(false), 1500);
    } catch {
      toast.error('Failed to set price alert');
    }
  };

  if (submitted) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-green-600">
        <Check className="w-3.5 h-3.5" /> Alert set for {formatCurrency(targetPrice)}
      </span>
    );
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-primary-600 transition-colors"
        title="Set price alert"
      >
        <Bell className="w-3.5 h-3.5" /> Price Alert
      </button>
      {isOpen && (
        <div className="absolute z-20 top-full mt-2 left-0 bg-white rounded-lg shadow-xl border p-4 w-64">
          <p className="text-sm font-medium text-gray-900 mb-2">Alert me when price drops to:</p>
          <div className="flex gap-2 mb-3">
            <span className="text-sm text-gray-500 self-center">R</span>
            <input
              type="number"
              value={targetPrice}
              onChange={(e) => setTargetPrice(Number(e.target.value))}
              min={1}
              max={currentPrice - 1}
              className="flex-1 h-9 px-3 border rounded-lg text-sm"
            />
          </div>
          <p className="text-xs text-gray-400 mb-3">Current: {formatCurrency(currentPrice)}</p>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSubmit} className="flex-1">
              Set Alert
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
