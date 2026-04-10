'use client';

import React, { useEffect, useState } from 'react';
import { Eye, Type, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

/**
 * AccessibilityWidget: A floating widget for users to adjust font size,
 * high contrast mode, and reduced motion. Positions at bottom-left.
 * Preferences are persisted in localStorage.
 */
export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('a11y-prefs');
      if (saved) {
        const prefs = JSON.parse(saved);
        if (prefs.fontSize) setFontSize(prefs.fontSize);
        if (prefs.highContrast) setHighContrast(prefs.highContrast);
        if (prefs.reducedMotion) setReducedMotion(prefs.reducedMotion);
      }
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;

    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    if (reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }

    try {
      localStorage.setItem('a11y-prefs', JSON.stringify({ fontSize, highContrast, reducedMotion }));
    } catch {}
  }, [fontSize, highContrast, reducedMotion]);

  const reset = () => {
    setFontSize(100);
    setHighContrast(false);
    setReducedMotion(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-20 left-4 z-40 p-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors print:hidden"
        aria-label="Accessibility settings"
        title="Accessibility settings"
      >
        <Eye className="w-5 h-5" />
      </button>

      {open && (
        <div className="fixed bottom-36 left-4 z-40 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 w-64 print:hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 text-sm">Accessibility</h3>
            <button onClick={reset} className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1">
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* Font Size */}
          <div className="mb-4">
            <label className="text-xs font-medium text-gray-600 mb-2 block">
              Text Size: {fontSize}%
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFontSize(Math.max(75, fontSize - 10))}
                disabled={fontSize <= 75}
                className="p-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                aria-label="Decrease text size"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <input
                type="range"
                min={75}
                max={150}
                step={5}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="flex-1 accent-primary-600"
                aria-label="Text size slider"
              />
              <button
                onClick={() => setFontSize(Math.min(150, fontSize + 10))}
                disabled={fontSize >= 150}
                className="p-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                aria-label="Increase text size"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* High Contrast */}
          <label className="flex items-center justify-between py-2 cursor-pointer">
            <span className="text-sm text-gray-700">High Contrast</span>
            <div className={`relative w-10 h-6 rounded-full transition-colors ${highContrast ? 'bg-primary-600' : 'bg-gray-300'}`}>
              <input
                type="checkbox"
                checked={highContrast}
                onChange={(e) => setHighContrast(e.target.checked)}
                className="sr-only"
              />
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${highContrast ? 'translate-x-4' : ''}`} />
            </div>
          </label>

          {/* Reduced Motion */}
          <label className="flex items-center justify-between py-2 cursor-pointer">
            <span className="text-sm text-gray-700">Reduced Motion</span>
            <div className={`relative w-10 h-6 rounded-full transition-colors ${reducedMotion ? 'bg-primary-600' : 'bg-gray-300'}`}>
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
                className="sr-only"
              />
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${reducedMotion ? 'translate-x-4' : ''}`} />
            </div>
          </label>
        </div>
      )}
    </>
  );
}
