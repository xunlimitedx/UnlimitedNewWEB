'use client';

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { Toaster } from 'react-hot-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import CookieConsent from '@/components/CookieConsent';
import WhatsAppButton from '@/components/WhatsAppButton';

function AnnouncementBar() {
  const { theme } = useTheme();
  if (!theme.announcementBarEnabled || !theme.announcementBar) return null;
  return (
    <div
      className="text-center py-2 text-sm font-medium text-white"
      style={{ backgroundColor: 'var(--color-primary-600)' }}
    >
      {theme.announcementBar}
    </div>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1f2937',
              color: '#f9fafb',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
            },
          }}
        />
        <div className="min-h-screen flex flex-col">
          <AnnouncementBar />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <CartDrawer />
        <CookieConsent />
        <WhatsAppButton />
      </ThemeProvider>
    </AuthProvider>
  );
}
