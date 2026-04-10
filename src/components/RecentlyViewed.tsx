'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRecentlyViewedStore } from '@/store/recentlyViewedStore';
import { formatCurrency } from '@/lib/utils';
import { Package, X } from 'lucide-react';

export default function RecentlyViewed() {
  const { items, clearAll } = useRecentlyViewedStore();

  if (items.length === 0) return null;

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Recently Viewed</h2>
          <button onClick={clearAll} className="text-sm text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1">
            <X className="w-3.5 h-3.5" /> Clear
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {items.map((item) => (
            <Link
              key={item.productId}
              href={`/products/${item.productId}`}
              className="flex-shrink-0 w-40 group"
            >
              <div className="relative h-40 bg-gray-100 rounded-lg overflow-hidden mb-2">
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform" sizes="160px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><Package className="w-8 h-8 text-gray-300" /></div>
                )}
              </div>
              <h3 className="text-xs font-medium text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">{item.name}</h3>
              <p className="text-sm font-bold text-gray-900 mt-1">{formatCurrency(item.price)}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
