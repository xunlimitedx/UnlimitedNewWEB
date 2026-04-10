'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryItem {
  before: string;
  after: string;
  title: string;
  description: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    before: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&h=400&fit=crop',
    after: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop',
    title: 'Laptop Screen Replacement',
    description: 'Cracked MacBook screen replaced with genuine display panel.',
  },
  {
    before: 'https://images.unsplash.com/photo-1555617766-c94804975da3?w=600&h=400&fit=crop',
    after: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=600&h=400&fit=crop',
    title: 'Desktop Overhaul',
    description: 'Complete hardware upgrade — new SSD, RAM, and cooling system.',
  },
  {
    before: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=400&fit=crop',
    after: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop',
    title: 'Console HDMI Port Fix',
    description: 'PlayStation 5 HDMI port micro-soldered and fully restored.',
  },
];

export default function BeforeAfterGallery() {
  const [current, setCurrent] = useState(0);
  const [sliderPos, setSliderPos] = useState(50);
  const item = GALLERY_ITEMS[current];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 select-none">
        {/* After image (full) */}
        <div className="relative h-64 sm:h-80 md:h-96">
          <img
            src={item.after}
            alt={`${item.title} - After`}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Before image (clipped) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPos}%` }}
          >
            <img
              src={item.before}
              alt={`${item.title} - Before`}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ width: `${(100 / sliderPos) * 100}%`, maxWidth: 'none' }}
            />
          </div>
          {/* Slider line */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize z-10"
            style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
              <span className="text-gray-500 text-xs font-bold">↔</span>
            </div>
          </div>
          {/* Labels */}
          <span className="absolute top-3 left-3 bg-black/60 text-white px-2 py-1 rounded text-xs font-semibold">BEFORE</span>
          <span className="absolute top-3 right-3 bg-black/60 text-white px-2 py-1 rounded text-xs font-semibold">AFTER</span>
          {/* Invisible drag area */}
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

      {/* Caption */}
      <div className="text-center mt-4">
        <h3 className="font-bold text-gray-900 dark:text-white">{item.title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
      </div>

      {/* Nav dots */}
      <div className="flex justify-center gap-3 mt-4">
        <button
          onClick={() => setCurrent((c) => (c - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length)}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {GALLERY_ITEMS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === current ? 'bg-primary-600 w-6' : 'bg-gray-300 dark:bg-gray-600'
            }`}
            aria-label={`View item ${i + 1}`}
          />
        ))}
        <button
          onClick={() => setCurrent((c) => (c + 1) % GALLERY_ITEMS.length)}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          aria-label="Next"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
