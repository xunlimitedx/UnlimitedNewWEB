'use client';

import React, { useState, useEffect } from 'react';
import { getDocument, setDocument } from '@/lib/firebase';
import { defaultTheme, type ThemeSettings } from '@/context/ThemeContext';
import { Palette, Save, RotateCcw, Eye, Type, Layout, Sun } from 'lucide-react';
import { Button } from '@/components/ui';
import toast from 'react-hot-toast';

function ColorField({
  label,
  value,
  onChange,
  description,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  description?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="#000000"
        />
      </div>
      {description && (
        <p className="text-xs text-gray-400">{description}</p>
      )}
    </div>
  );
}

export default function AdminThemePage() {
  const [theme, setTheme] = useState<ThemeSettings>(defaultTheme);
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function fetchTheme() {
      try {
        const data = await getDocument('settings', 'theme');
        if (data) {
          setTheme({ ...defaultTheme, ...(data as unknown as ThemeSettings) });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    }
    fetchTheme();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDocument('settings', 'theme', {
        ...theme,
        updatedAt: new Date().toISOString(),
      });
      toast.success('Theme saved! Changes will apply on next page load.');
    } catch {
      toast.error('Failed to save theme');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setTheme(defaultTheme);
    toast.success('Reset to defaults — click Save to apply');
  };

  const updateTheme = (field: keyof ThemeSettings, value: string | boolean) => {
    setTheme((prev) => ({ ...prev, [field]: value }));
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Theme &amp; Appearance
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Customize the colors and look of your website for all visitors
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl px-4 py-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Defaults
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Live Preview */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <Eye className="w-4 h-4" />
            Live Preview
          </h3>
          <div className="rounded-xl overflow-hidden border border-gray-200">
            {/* Mini header */}
            <div
              className="px-4 py-3 flex items-center justify-between"
              style={{ backgroundColor: theme.headerBg, color: theme.headerText }}
            >
              <span className="font-bold text-sm">Unlimited IT Solutions</span>
              <div className="flex gap-3 text-xs opacity-70">
                <span>Shop</span>
                <span>About</span>
                <span>Contact</span>
              </div>
            </div>
            {/* Mini hero */}
            <div
              className="px-6 py-8 text-center"
              style={{ backgroundColor: theme.heroBg, color: theme.heroText }}
            >
              <h4 className="text-lg font-bold mb-1">Welcome to our store</h4>
              <p className="text-sm opacity-80 mb-3">Your tagline goes here</p>
              <span
                className="inline-block text-white text-xs font-semibold px-4 py-2"
                style={{
                  backgroundColor: theme.primaryColor,
                  borderRadius: theme.buttonRadius,
                }}
              >
                Shop Now
              </span>
            </div>
            {/* Mini body */}
            <div
              className="px-6 py-6"
              style={{ backgroundColor: theme.bodyBg, color: theme.bodyText }}
            >
              <div className="flex gap-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-lg border border-gray-200 p-3 text-center"
                  >
                    <div className="w-full h-12 rounded bg-gray-100 mb-2" />
                    <p className="text-xs font-medium">Product {i}</p>
                    <p className="text-xs" style={{ color: theme.primaryColor }}>
                      R 999.00
                    </p>
                    <span
                      className="inline-block text-white text-[10px] font-semibold px-3 py-1 mt-2"
                      style={{
                        backgroundColor: theme.accentColor,
                        borderRadius: theme.buttonRadius,
                      }}
                    >
                      Add to Cart
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {/* Mini footer */}
            <div
              className="px-4 py-3 text-center text-xs"
              style={{ backgroundColor: theme.footerBg, color: theme.footerText }}
            >
              © {new Date().getFullYear()} Unlimited IT Solutions
            </div>
          </div>
        </div>

        {/* Brand Colors */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Brand Colors
          </h3>
          <p className="text-sm text-gray-500">
            Your primary color is used for buttons, links, and accents throughout the site.
            The accent color is used for secondary call-to-action buttons like &quot;Add to Cart&quot;.
          </p>
          <div className="grid grid-cols-2 gap-6">
            <ColorField
              label="Primary Color"
              value={theme.primaryColor}
              onChange={(v) => updateTheme('primaryColor', v)}
              description="Main brand color — buttons, links, active states"
            />
            <ColorField
              label="Accent Color"
              value={theme.accentColor}
              onChange={(v) => updateTheme('accentColor', v)}
              description="Secondary actions — add to cart, success states"
            />
          </div>
        </div>

        {/* Header & Footer */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Layout className="w-4 h-4" />
            Header &amp; Footer
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <ColorField
              label="Header Background"
              value={theme.headerBg}
              onChange={(v) => updateTheme('headerBg', v)}
            />
            <ColorField
              label="Header Text"
              value={theme.headerText}
              onChange={(v) => updateTheme('headerText', v)}
            />
            <ColorField
              label="Footer Background"
              value={theme.footerBg}
              onChange={(v) => updateTheme('footerBg', v)}
            />
            <ColorField
              label="Footer Text"
              value={theme.footerText}
              onChange={(v) => updateTheme('footerText', v)}
            />
          </div>
        </div>

        {/* Hero & Body */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Sun className="w-4 h-4" />
            Hero &amp; Page Body
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <ColorField
              label="Hero Background"
              value={theme.heroBg}
              onChange={(v) => updateTheme('heroBg', v)}
              description="The large banner area at the top of the home page"
            />
            <ColorField
              label="Hero Text"
              value={theme.heroText}
              onChange={(v) => updateTheme('heroText', v)}
            />
            <ColorField
              label="Page Background"
              value={theme.bodyBg}
              onChange={(v) => updateTheme('bodyBg', v)}
            />
            <ColorField
              label="Page Text"
              value={theme.bodyText}
              onChange={(v) => updateTheme('bodyText', v)}
            />
          </div>
        </div>

        {/* Button & Typography */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Type className="w-4 h-4" />
            Buttons &amp; Typography
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Button Corner Radius
              </label>
              <select
                value={theme.buttonRadius}
                onChange={(e) => updateTheme('buttonRadius', e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="0">Square (0)</option>
                <option value="0.25rem">Slightly Rounded (0.25rem)</option>
                <option value="0.5rem">Rounded (0.5rem)</option>
                <option value="0.75rem">More Rounded (0.75rem)</option>
                <option value="1rem">Pill-ish (1rem)</option>
                <option value="9999px">Full Pill (9999px)</option>
              </select>
              <p className="text-xs text-gray-400">Controls the roundness of buttons across the site</p>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Preview
              </label>
              <div className="flex gap-3 pt-1">
                <span
                  className="inline-block text-white text-sm font-semibold px-5 py-2.5"
                  style={{
                    backgroundColor: theme.primaryColor,
                    borderRadius: theme.buttonRadius,
                  }}
                >
                  Primary
                </span>
                <span
                  className="inline-block text-white text-sm font-semibold px-5 py-2.5"
                  style={{
                    backgroundColor: theme.accentColor,
                    borderRadius: theme.buttonRadius,
                  }}
                >
                  Accent
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Heading Font
            </label>
            <select
              value={theme.fontHeading}
              onChange={(e) => updateTheme('fontHeading', e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="Black Ops One">Black Ops One</option>
              <option value="Inter">Inter (clean)</option>
              <option value="Poppins">Poppins</option>
              <option value="Oswald">Oswald</option>
              <option value="Bebas Neue">Bebas Neue</option>
            </select>
            <p className="text-xs text-gray-400">
              Font used for all headings (h1 – h6). Currently: {theme.fontHeading}
            </p>
          </div>
        </div>

        {/* Announcement Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Announcement Bar</h3>
          <p className="text-sm text-gray-500">
            Display a message at the top of every page (e.g. sales, shipping info).
          </p>
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={theme.announcementBarEnabled}
                onChange={(e) =>
                  updateTheme('announcementBarEnabled', e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600" />
            </label>
            <span className="text-sm text-gray-700">
              {theme.announcementBarEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          <input
            type="text"
            value={theme.announcementBar}
            onChange={(e) => updateTheme('announcementBar', e.target.value)}
            placeholder="e.g. 🎉 Free shipping on orders over R2,500!"
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {theme.announcementBarEnabled && theme.announcementBar && (
            <div
              className="rounded-lg text-center py-2 text-sm font-medium text-white"
              style={{ backgroundColor: theme.primaryColor }}
            >
              {theme.announcementBar}
            </div>
          )}
        </div>

        {/* Save */}
        <div className="flex items-center gap-4">
          <Button onClick={handleSave} loading={saving}>
            <Save className="w-4 h-4" />
            Save Theme
          </Button>
          <p className="text-sm text-gray-400">
            Changes apply site-wide on the next page load for all visitors
          </p>
        </div>
      </div>
    </div>
  );
}
