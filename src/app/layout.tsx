import type { Metadata } from 'next';
import { Inter, Black_Ops_One } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import JsonLd from '@/components/JsonLd';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const blackOpsOne = Black_Ops_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});


export const metadata: Metadata = {
  metadataBase: new URL('https://unlimitedits.co.za'),
  title: {
    default: 'Unlimited IT Solutions | Computer Repairs, IT Support & Sales | Ramsgate, KZN',
    template: '%s | Unlimited IT Solutions',
  },
  description:
    'Unlimited IT Solutions (Unlimited4all) — computer repairs, laptop repairs, Mac repairs, console repairs, CCTV installations, networking, IT support, and hardware sales in Ramsgate, KwaZulu-Natal. On-site technicians, remote support, and scheduled maintenance for homes and businesses across South Africa.',
  keywords: [
    'computer repairs Ramsgate',
    'laptop repairs South Coast',
    'Mac repairs KZN',
    'IT support KwaZulu-Natal',
    'CCTV installation Ramsgate',
    'CCTV installation South Coast',
    'networking installation KZN',
    'computer shop Ramsgate',
    'buy laptops South Africa',
    'console repairs PlayStation Xbox',
    'IT solutions South Africa',
    'server maintenance KZN',
    'remote IT support',
    'custom PC builds',
    'Microsoft 365 reseller',
    'Adobe certified reseller',
    'antivirus software South Africa',
    'Dell HP Lenovo Apple reseller',
    'internet solutions Ramsgate',
    'Unlimited IT Solutions',
    'computer technician near me',
    'IT company South Coast KZN',
    'fine soldering repairs',
    'on-site IT callouts',
    'managed IT services',
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
    title: 'Unlimited IT Solutions | Computer Repairs, IT Support & Sales | Ramsgate, KZN',
    description:
      'Computer repairs, laptop & Mac repairs, CCTV installations, networking, console repairs, and IT support. Physical shop in Ramsgate with on-site technicians across KZN.',

  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unlimited IT Solutions | Computer Repairs, IT Support & Sales | Ramsgate, KZN',
    description:
      'Computer repairs, laptop & Mac repairs, CCTV installations, networking, console repairs, and IT support. Physical shop in Ramsgate, KZN.',
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
    <html lang="en" className={`${inter.variable} ${blackOpsOne.variable}`}>
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
