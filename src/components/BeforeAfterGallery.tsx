'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getCollection, orderBy } from '@/lib/firebase';

interface GalleryItem {
  id?: string;
  before: string;
  after: string;
  title: string;
  description: string;
  order?: number;
  active?: boolean;
}

const DEFAULT_ITEMS: GalleryItem[] = [
  {
    before: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=900&h=600&fit=crop',
    after: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&h=600&fit=crop',
    title: 'MacBook Pro Screen Replacement',
    description: 'Smashed Retina display swapped for a genuine OEM panel — like new in under 24 hours.',
  },
  {
    before: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=900&h=600&fit=crop',
    after: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900&h=600&fit=crop',
    title: 'Laptop Liquid Damage Recovery',
    description: 'Coffee-soaked motherboard ultrasonically cleaned, components replaced, fully restored.',
  },
  {
    before: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=900&h=600&fit=crop',
    after: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=900&h=600&fit=crop',
    title: 'PlayStation HDMI Port Repair',
    description: 'Bent HDMI port micro-soldered and replaced — back to 4K gaming the same week.',
  },
];

export default function BeforeAfterGallery() {
  const [items, setItems] = useState<GalleryItem[]>(DEFAULT_ITEMS);
  const [current, setCurrent] = useState(0);
  const [sliderPos, setSliderPos] = useState(50);

  useEffect(() => {
    getCollection('beforeAfter', [orderBy('order', 'asc')])
      .then((data) => {
        const list = (data as unknown as GalleryItem[]).filter((i) => i.active !== false && i.before && i.after);
        if (list.length > 0) setItems(list);
      })
      .catch(() => {});
  }, []);

  if (items.length === 0) return null;
  const item = items[current % items.length];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="relative rounded-2xl overflow-hidden shadow-lg ring-1 ring-gray-200/70 dark:ring-gray-800/70 select-none">
        <div className="relative h-64 sm:h-80 md:h-96">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.after}
            alt={`${item.title} - After`}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPos}%` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.before}
              alt={`${item.title} - Before`}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ width: `${(100 / sliderPos) * 100}%`, maxWidth: 'none' }}
            />
          </div>
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize z-10"
            style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
              <span className="text-gray-500 text-xs font-bold">↔</span>
            </div>
          </div>
          <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider">BEFORE</span>
          <span className="absolute top-3 right-3 bg-emerald-600/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider">AFTER</span>
          <input
            type="range"
            min={5}
            max={95}
            value={sliderPos}
            onChange={(e) => setSliderPos(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
            aria-label="Before/after comparison slider"
          />
        </div>
      </div>

      <div className="text-center mt-4">
        <h3 className="font-bold text-gray-900 dark:text-white tracking-tight">{item.title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
      </div>

      {items.length > 1 && (
        <div className="flex justify-center items-center gap-3 mt-4">
          <button
            onClick={() => setCurrent((c) => (c - 1 + items.length) % items.length)}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2.5 rounded-full transition-all ${
                i === current ? 'bg-primary-600 w-6' : 'bg-gray-300 dark:bg-gray-600 w-2.5'
              }`}
              aria-label={`View item ${i + 1}`}
            />
          ))}
          <button
            onClick={() => setCurrent((c) => (c + 1) % items.length)}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}