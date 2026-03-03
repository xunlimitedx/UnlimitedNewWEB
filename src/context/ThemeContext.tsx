'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getDocument } from '@/lib/firebase';

export interface ThemeSettings {
  primaryColor: string;
  accentColor: string;
  headerBg: string;
  headerText: string;
  footerBg: string;
  footerText: string;
  heroBg: string;
  heroText: string;
  bodyBg: string;
  bodyText: string;
  buttonRadius: string;
  fontBody: string;
  fontHeading: string;
  announcementBar: string;
  announcementBarEnabled: boolean;
}

export const defaultTheme: ThemeSettings = {
  primaryColor: '#2563eb',
  accentColor: '#22c55e',
  headerBg: '#ffffff',
  headerText: '#111827',
  footerBg: '#111827',
  footerText: '#d1d5db',
  heroBg: '#1e3a8a',
  heroText: '#ffffff',
  bodyBg: '#ffffff',
  bodyText: '#111827',
  buttonRadius: '0.5rem',
  fontBody: 'Inter',
  fontHeading: 'Black Ops One',
  announcementBar: '',
  announcementBarEnabled: false,
};

// Generate color shades from a hex color
function hexToHSL(hex: string): { h: number; s: number; l: number } {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function generateShade(h: number, s: number, targetL: number): string {
  return `hsl(${h}, ${s}%, ${targetL}%)`;
}

interface ThemeContextType {
  theme: ThemeSettings;
  loading: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  loading: true,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeSettings>(defaultTheme);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTheme() {
      try {
        const data = await getDocument('settings', 'theme');
        if (data) {
          setTheme({ ...defaultTheme, ...(data as unknown as ThemeSettings) });
        }
      } catch (err) {
        console.error('Failed to load theme:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTheme();
  }, []);

  // Apply CSS custom properties whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    const { h, s } = hexToHSL(theme.primaryColor);

    // Generate primary color palette as CSS vars
    root.style.setProperty('--color-primary-50', generateShade(h, Math.max(s - 10, 0), 97));
    root.style.setProperty('--color-primary-100', generateShade(h, Math.max(s - 5, 0), 93));
    root.style.setProperty('--color-primary-200', generateShade(h, s, 86));
    root.style.setProperty('--color-primary-300', generateShade(h, s, 74));
    root.style.setProperty('--color-primary-400', generateShade(h, s, 63));
    root.style.setProperty('--color-primary-500', generateShade(h, s, 52));
    root.style.setProperty('--color-primary-600', generateShade(h, s, 45));
    root.style.setProperty('--color-primary-700', generateShade(h, s, 38));
    root.style.setProperty('--color-primary-800', generateShade(h, s, 30));
    root.style.setProperty('--color-primary-900', generateShade(h, s, 23));
    root.style.setProperty('--color-primary-950', generateShade(h, s, 15));

    // Accent color palette
    const accent = hexToHSL(theme.accentColor);
    root.style.setProperty('--color-accent-500', generateShade(accent.h, accent.s, 52));
    root.style.setProperty('--color-accent-600', generateShade(accent.h, accent.s, 45));

    // Layout colors
    root.style.setProperty('--header-bg', theme.headerBg);
    root.style.setProperty('--header-text', theme.headerText);
    root.style.setProperty('--footer-bg', theme.footerBg);
    root.style.setProperty('--footer-text', theme.footerText);
    root.style.setProperty('--body-bg', theme.bodyBg);
    root.style.setProperty('--body-text', theme.bodyText);
    root.style.setProperty('--hero-bg', theme.heroBg);
    root.style.setProperty('--hero-text', theme.heroText);
    root.style.setProperty('--btn-radius', theme.buttonRadius);

    // Apply body styles
    document.body.style.backgroundColor = theme.bodyBg;
    document.body.style.color = theme.bodyText;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, loading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
