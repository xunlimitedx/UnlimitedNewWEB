'use client';

import React from 'react';
import Image from 'next/image';
import type { ProductVariant } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface VariantSelectorProps {
  variants: ProductVariant[];
  selected?: string;
  onSelect: (variantId: string) => void;
}

export default function VariantSelector({ variants, selected, onSelect }: VariantSelectorProps) {
  if (!variants || variants.length === 0) return null;

  const grouped = variants.reduce<Record<string, ProductVariant[]>>((acc, v) => {
    const key = v.type;
    if (!acc[key]) acc[key] = [];
    acc[key].push(v);
    return acc;
  }, {});

  const typeLabels: Record<string, string> = {
    color: 'Color',
    size: 'Size',
    storage: 'Storage',
    other: 'Option',
  };

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([type, items]) => (
        <div key={type}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {typeLabels[type] || type}:{' '}
            <span className="text-gray-900 font-semibold">
              {items.find((v) => v.id === selected)?.name || 'Select'}
            </span>
          </label>

          {type === 'color' ? (
            <div className="flex flex-wrap gap-2">
              {items.map((v) => (
                <button
                  key={v.id}
                  onClick={() => onSelect(v.id)}
                  disabled={v.stock === 0}
                  className={`w-9 h-9 rounded-full border-2 transition-all relative ${
                    selected === v.id
                      ? 'border-primary-600 ring-2 ring-primary-200 scale-110'
                      : v.stock === 0
                      ? 'border-gray-200 opacity-40 cursor-not-allowed'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: v.value }}
                  title={`${v.name}${v.price ? ` (+${formatCurrency(v.price)})` : ''}${v.stock === 0 ? ' - Out of stock' : ''}`}
                  aria-label={`Select ${v.name}`}
                >
                  {selected === v.id && (
                    <svg className="absolute inset-0 m-auto w-4 h-4 text-white drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {v.stock === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-0.5 bg-red-500 rotate-45 rounded" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {items.map((v) => (
                <button
                  key={v.id}
                  onClick={() => onSelect(v.id)}
                  disabled={v.stock === 0}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                    selected === v.id
                      ? 'border-primary-600 bg-primary-50 text-primary-700 ring-1 ring-primary-200'
                      : v.stock === 0
                      ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed line-through'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {v.name}
                  {v.price ? (
                    <span className="ml-1 text-xs text-gray-500">
                      +{formatCurrency(v.price)}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          )}

          {/* Show variant image if available */}
          {items.find((v) => v.id === selected)?.image && (
            <div className="mt-2 relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
              <Image
                src={items.find((v) => v.id === selected)!.image!}
                alt="Variant"
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
