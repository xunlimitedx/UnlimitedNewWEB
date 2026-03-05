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
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Unlimited IT Solutions',
      },
    ],
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
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=JSON.parse(localStorage.getItem('theme-settings'));if(!t)return;var r=document.documentElement;function p(hex){hex=hex.replace('#','');var rv=parseInt(hex.substring(0,2),16)/255,g=parseInt(hex.substring(2,4),16)/255,b=parseInt(hex.substring(4,6),16)/255,mx=Math.max(rv,g,b),mn=Math.min(rv,g,b),h=0,s=0,l=(mx+mn)/2;if(mx!==mn){var d=mx-mn;s=l>0.5?d/(2-mx-mn):d/(mx+mn);switch(mx){case rv:h=((g-b)/d+(g<b?6:0))/6;break;case g:h=((b-rv)/d+2)/6;break;case b:h=((rv-g)/d+4)/6;break;}}return{h:Math.round(h*360),s:Math.round(s*100)}}function sh(h,s,l){return'hsl('+h+','+s+'%,'+l+'%)'}var c=p(t.primaryColor||'#2563eb');r.style.setProperty('--color-primary-50',sh(c.h,Math.max(c.s-10,0),97));r.style.setProperty('--color-primary-100',sh(c.h,Math.max(c.s-5,0),93));r.style.setProperty('--color-primary-200',sh(c.h,c.s,86));r.style.setProperty('--color-primary-300',sh(c.h,c.s,74));r.style.setProperty('--color-primary-400',sh(c.h,c.s,63));r.style.setProperty('--color-primary-500',sh(c.h,c.s,52));r.style.setProperty('--color-primary-600',sh(c.h,c.s,45));r.style.setProperty('--color-primary-700',sh(c.h,c.s,38));r.style.setProperty('--color-primary-800',sh(c.h,c.s,30));r.style.setProperty('--color-primary-900',sh(c.h,c.s,23));r.style.setProperty('--color-primary-950',sh(c.h,c.s,15));if(t.accentColor){var a=p(t.accentColor);r.style.setProperty('--color-accent-500',sh(a.h,a.s,52));r.style.setProperty('--color-accent-600',sh(a.h,a.s,45))}if(t.headerBg)r.style.setProperty('--header-bg',t.headerBg);if(t.headerText)r.style.setProperty('--header-text',t.headerText);if(t.footerBg)r.style.setProperty('--footer-bg',t.footerBg);if(t.footerText)r.style.setProperty('--footer-text',t.footerText);if(t.bodyBg)r.style.setProperty('--body-bg',t.bodyBg);if(t.bodyText)r.style.setProperty('--body-text',t.bodyText);if(t.heroBg)r.style.setProperty('--hero-bg',t.heroBg);if(t.heroText)r.style.setProperty('--hero-text',t.heroText);if(t.buttonRadius)r.style.setProperty('--btn-radius',t.buttonRadius)}catch(e){}})()`
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
