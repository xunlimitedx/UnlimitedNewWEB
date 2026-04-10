'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Cookie, Shield } from 'lucide-react';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = (type: 'all' | 'selected' | 'necessary') => {
    const settings = type === 'all'
      ? { necessary: true, analytics: true, marketing: true }
      : type === 'necessary'
        ? { necessary: true, analytics: false, marketing: false }
        : preferences;
    localStorage.setItem('cookie-consent', JSON.stringify({ ...settings, timestamp: Date.now() }));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-3xl mx-auto bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-primary-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Cookie className="w-5 h-5 text-primary-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-1 flex items-center gap-2">
                Cookie & Privacy Notice
                <Shield className="w-4 h-4 text-green-400" />
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                In accordance with the{' '}
                <span className="text-gray-300 font-medium">Protection of Personal Information Act (POPIA)</span>,
                we use cookies to enhance your browsing experience and analyse site traffic.{' '}
                <Link
                  href="/cookies"
                  className="text-primary-400 hover:text-primary-300 underline"
                >
                  Cookie Policy
                </Link>
                {' '}&bull;{' '}
                <Link
                  href="/privacy"
                  className="text-primary-400 hover:text-primary-300 underline"
                >
                  Privacy Policy
                </Link>
              </p>

              {showPreferences && (
                <div className="mt-4 space-y-3 border-t border-gray-700 pt-4">
                  <label className="flex items-center gap-3 cursor-not-allowed">
                    <input type="checkbox" checked disabled className="w-4 h-4 rounded" />
                    <div>
                      <span className="text-sm text-gray-300 font-medium">Necessary</span>
                      <p className="text-xs text-gray-500">Required for site functionality</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) => setPreferences(p => ({ ...p, analytics: e.target.checked }))}
                      className="w-4 h-4 rounded accent-primary-600"
                    />
                    <div>
                      <span className="text-sm text-gray-300 font-medium">Analytics</span>
                      <p className="text-xs text-gray-500">Google Analytics for site improvement</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) => setPreferences(p => ({ ...p, marketing: e.target.checked }))}
                      className="w-4 h-4 rounded accent-primary-600"
                    />
                    <div>
                      <span className="text-sm text-gray-300 font-medium">Marketing</span>
                      <p className="text-xs text-gray-500">Personalised ads and retargeting</p>
                    </div>
                  </label>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 mt-4">
                <button
                  onClick={() => accept('all')}
                  className="px-5 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                >
                  Accept All
                </button>
                {showPreferences ? (
                  <button
                    onClick={() => accept('selected')}
                    className="px-5 py-2 bg-gray-700 text-white rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors"
                  >
                    Save Preferences
                  </button>
                ) : (
                  <button
                    onClick={() => setShowPreferences(true)}
                    className="px-5 py-2 bg-gray-700 text-white rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors"
                  >
                    Manage Preferences
                  </button>
                )}
                <button
                  onClick={() => accept('necessary')}
                  className="px-5 py-2 text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Necessary Only
                </button>
              </div>
            </div>
            <button
              onClick={() => accept('necessary')}
              className="p-1.5 text-gray-500 hover:text-white transition-colors flex-shrink-0"
              aria-label="Close cookie banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
