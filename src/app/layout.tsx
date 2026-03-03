import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  metadataBase: new URL('https://unlimitedits.co.za'),
  title: {
    default: 'Unlimited IT Solutions | Technology for Tomorrow',
    template: '%s | Unlimited IT Solutions',
  },
  description:
    'Your one-stop shop for all things tech. From high-performance laptops to essential components. Unlimited IT Solutions provides reliable IT solutions for businesses and individuals across South Africa.',
  keywords: [
    'IT solutions',
    'laptops',
    'desktops',
    'computer components',
    'peripherals',
    'technology',
    'South Africa',
    'Ramsgate',
    'ecommerce',
    'Unlimited IT Solutions',
    'buy laptops South Africa',
    'computer shop Ramsgate',
    'IT support KZN',
  ],
  authors: [{ name: 'Unlimited IT Solutions' }],
  creator: 'Unlimited IT Solutions',
  publisher: 'Unlimited IT Solutions',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: 'https://unlimitedits.co.za',
    siteName: 'Unlimited IT Solutions',
    title: 'Unlimited IT Solutions | Technology for Tomorrow',
    description:
      'Your one-stop shop for all things tech. From high-performance laptops to essential components.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unlimited IT Solutions | Technology for Tomorrow',
    description:
      'Your one-stop shop for all things tech. From high-performance laptops to essential components.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your Google Search Console verification code here
    // google: 'your-verification-code',
  },
  alternates: {
    canonical: 'https://unlimitedits.co.za',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <JsonLd />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
