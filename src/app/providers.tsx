'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { QueryProvider } from '@/context/QueryProvider';
import { Toaster } from 'react-hot-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import CookieConsent from '@/components/CookieConsent';
import WhatsAppButton from '@/components/WhatsAppButton';
import ScrollToTop from '@/components/ScrollToTop';
import NewsletterPopup from '@/components/NewsletterPopup';
import SocialProofPopups from '@/components/SocialProofPopups';
import ExitIntentPopup from '@/components/ExitIntentPopup';
import MobileBottomNav from '@/components/MobileBottomNav';
import AbandonedCartTracker from '@/components/AbandonedCartTracker';
import AccessibilityWidget from '@/components/AccessibilityWidget';
import LiveChatWidget from '@/components/LiveChatWidget';
import PageTransition from '@/components/PageTransition';
import { LanguageProvider } from '@/components/LanguageToggle';

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
  const pathname = usePathname();
  const isSensitiveFlow =
    pathname.startsWith('/checkout') ||
    pathname.startsWith('/cart') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/account');

  return (
    <AuthProvider>
      <QueryProvider>
        <ThemeProvider>
        <LanguageProvider>
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
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg focus:text-sm focus:font-medium focus:shadow-lg"
        >
          Skip to main content
        </a>
        <div className="min-h-screen flex flex-col">
          <AnnouncementBar />
          <Header />
          <main id="main-content" className="flex-1"><PageTransition>{children}</PageTransition></main>
          <Footer />
        </div>
        <CartDrawer />
        <CookieConsent />
        <WhatsAppButton />
        <ScrollToTop />
        {!isSensitiveFlow && <NewsletterPopup />}
        {!isSensitiveFlow && <SocialProofPopups />}
        {!isSensitiveFlow && <ExitIntentPopup />}
        <MobileBottomNav />
        <AbandonedCartTracker />
        <LiveChatWidget />
        <AccessibilityWidget />
      </LanguageProvider>
      </ThemeProvider>
      </QueryProvider>
    </AuthProvider>
  );
}
