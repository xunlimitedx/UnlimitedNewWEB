'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const HOURS: Record<number, { open: number; close: number } | null> = {
  0: null, // Sunday - closed
  1: { open: 8, close: 17 }, // Monday 8am-5pm
  2: { open: 8, close: 17 },
  3: { open: 8, close: 17 },
  4: { open: 8, close: 17 },
  5: { open: 8, close: 17 }, // Friday
  6: { open: 8, close: 13 }, // Saturday 8am-1pm
};

export default function OpenClosedBadge() {
  const [status, setStatus] = useState<'open' | 'closed' | 'closing-soon' | null>(null);

  useEffect(() => {
    const now = new Date();
    // Use South African time (UTC+2)
    const saTime = new Date(now.toLocaleString('en-US', { timeZone: 'Africa/Johannesburg' }));
    const day = saTime.getDay();
    const hour = saTime.getHours();
    const minutes = saTime.getMinutes();
    const currentTime = hour + minutes / 60;

    const todayHours = HOURS[day];
    if (!todayHours) {
      setStatus('closed');
      return;
    }

    if (currentTime >= todayHours.open && currentTime < todayHours.close) {
      if (todayHours.close - currentTime <= 1) {
        setStatus('closing-soon');
      } else {
        setStatus('open');
      }
    } else {
      setStatus('closed');
    }
  }, []);

  if (status === null) return null;

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
      status === 'open'
        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
        : status === 'closing-soon'
        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    }`}>
      <span className={`w-2 h-2 rounded-full ${
        status === 'open' ? 'bg-green-500 animate-pulse' : status === 'closing-soon' ? 'bg-yellow-500' : 'bg-red-500'
      }`} />
      {status === 'open' ? 'Open Now' : status === 'closing-soon' ? 'Closing Soon' : 'Closed'}
    </div>
  );
}
