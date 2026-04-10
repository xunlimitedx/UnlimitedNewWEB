'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  count?: number;
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-100 animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="flex justify-between items-center">
          <div className="h-5 bg-gray-200 rounded w-24" />
          <div className="h-8 w-8 bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonProductGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-white rounded-xl border overflow-hidden animate-pulse">
      <div className="h-12 bg-gray-100 border-b" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-3 border-b last:border-0">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className={`h-4 bg-gray-200 rounded ${j === 0 ? 'w-48' : 'w-24'}`} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonProductDetail() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-full mb-4" />
      <div className="grid lg:grid-cols-2 gap-10">
        <div className="h-[400px] bg-gray-200 rounded-2xl" />
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded w-24" />
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-32" />
          <div className="h-10 bg-gray-200 rounded w-40" />
          <div className="h-20 bg-gray-200 rounded" />
          <div className="flex gap-3">
            <div className="h-12 bg-gray-200 rounded flex-1" />
            <div className="h-12 w-12 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
