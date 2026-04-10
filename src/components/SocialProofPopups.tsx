'use client';

import React, { useEffect, useState } from 'react';
import { X, ShoppingBag, Star, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SocialProofPopupsProps {
  enabled?: boolean;
  intervalMs?: number;
}

const MOCK_EVENTS = [
  { type: 'purchase' as const, customer: 'John M.', city: 'Cape Town', product: 'Gaming Laptop', time: '2 minutes ago' },
  { type: 'purchase' as const, customer: 'Sarah K.', city: 'Johannesburg', product: 'Wireless Mouse', time: '5 minutes ago' },
  { type: 'review' as const, customer: 'David L.', city: 'Durban', product: 'Mechanical Keyboard', rating: 5, time: '8 minutes ago' },
  { type: 'signup' as const, customer: 'Nomsa T.', city: 'Pretoria', time: '12 minutes ago' },
  { type: 'purchase' as const, customer: 'Michael B.', city: 'Bloemfontein', product: 'Monitor Stand', time: '15 minutes ago' },
  { type: 'review' as const, customer: 'Lisa R.', city: 'Stellenbosch', product: 'USB Hub', rating: 4, time: '18 minutes ago' },
  { type: 'purchase' as const, customer: 'Thabo N.', city: 'Port Elizabeth', product: 'Webcam HD', time: '22 minutes ago' },
  { type: 'signup' as const, customer: 'Zanele M.', city: 'Polokwane', time: '25 minutes ago' },
];

export default function SocialProofPopups({ enabled = true, intervalMs = 20000 }: SocialProofPopupsProps) {
  const [visible, setVisible] = useState(false);
  const [eventIndex, setEventIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!enabled || dismissed) return;

    const showTimeout = setTimeout(() => {
      setVisible(true);
      const hideTimeout = setTimeout(() => setVisible(false), 5000);
      return () => clearTimeout(hideTimeout);
    }, 8000);

    const interval = setInterval(() => {
      setEventIndex((prev) => (prev + 1) % MOCK_EVENTS.length);
      setVisible(true);
      setTimeout(() => setVisible(false), 5000);
    }, intervalMs);

    return () => {
      clearTimeout(showTimeout);
      clearInterval(interval);
    };
  }, [enabled, dismissed, intervalMs]);

  if (!enabled || dismissed) return null;

  const event = MOCK_EVENTS[eventIndex];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-20 left-4 z-40 bg-white rounded-xl shadow-2xl border border-gray-100 p-4 max-w-xs"
        >
          <button
            onClick={() => { setVisible(false); setDismissed(true); }}
            className="absolute top-2 right-2 text-gray-300 hover:text-gray-500"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              event.type === 'purchase' ? 'bg-green-100 text-green-600' :
              event.type === 'review' ? 'bg-yellow-100 text-yellow-600' :
              'bg-blue-100 text-blue-600'
            }`}>
              {event.type === 'purchase' && <ShoppingBag className="w-5 h-5" />}
              {event.type === 'review' && <Star className="w-5 h-5" />}
              {event.type === 'signup' && <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {event.type === 'purchase' && `${event.customer} just purchased`}
                {event.type === 'review' && `${event.customer} left a review`}
                {event.type === 'signup' && `${event.customer} just signed up`}
              </p>
              <p className="text-xs text-gray-500">
                {event.type === 'purchase' && event.product}
                {event.type === 'review' && (
                  <span className="flex items-center gap-0.5">
                    {event.product} {'⭐'.repeat(event.rating || 5)}
                  </span>
                )}
                {event.type === 'signup' && `from ${event.city}`}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">{event.time} · {event.city}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
