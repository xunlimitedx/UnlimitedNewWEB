'use client';

import { useState, useEffect, useRef } from 'react';

interface CustomerCounterProps {
  className?: string;
}

export default function CustomerCounter({ className = '' }: CustomerCounterProps) {
  const [count, setCount] = useState(0);
  const target = 5247;
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const duration = 2500;
          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`text-center ${className}`}>
      <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary-600 to-blue-600 text-white px-6 py-3 rounded-full shadow-lg">
        <div className="flex -space-x-2">
          {['bg-yellow-400', 'bg-green-400', 'bg-pink-400', 'bg-blue-400'].map((bg, i) => (
            <div key={i} className={`w-8 h-8 ${bg} rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white`}>
              {String.fromCharCode(65 + i)}
            </div>
          ))}
        </div>
        <span className="font-bold text-lg">{count.toLocaleString()}+</span>
        <span className="text-primary-100 text-sm">happy customers served</span>
      </div>
    </div>
  );
}
