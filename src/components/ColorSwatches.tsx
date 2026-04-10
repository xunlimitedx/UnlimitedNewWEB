'use client';

import React from 'react';

interface ColorSwatchesProps {
  colors: { name: string; value: string; image?: string }[];
  selected?: string;
  onSelect: (colorName: string) => void;
}

export default function ColorSwatches({ colors, selected, onSelect }: ColorSwatchesProps) {
  if (!colors || colors.length === 0) return null;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Color: <span className="text-gray-900 font-semibold">{selected || 'Select'}</span>
      </label>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color.name}
            onClick={() => onSelect(color.name)}
            className={`w-8 h-8 rounded-full border-2 transition-all relative ${
              selected === color.name
                ? 'border-primary-600 ring-2 ring-primary-200 scale-110'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            style={{ backgroundColor: color.value }}
            title={color.name}
            aria-label={`Select ${color.name}`}
          >
            {selected === color.name && (
              <svg className="absolute inset-0 m-auto w-4 h-4 text-white drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
