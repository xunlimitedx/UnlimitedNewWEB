import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us — Computer Repairs, IT Support & CCTV | Ramsgate',
  description:
    'Contact Unlimited IT Solutions at 202 Marine Drive, Ramsgate, KZN. Call 039 314 4359 for computer repairs, CCTV installations, networking, console repairs, Mac repairs, and IT support. Walk-in or on-site callouts available.',
  keywords: [
    'contact IT company Ramsgate',
    'computer repairs near me',
    'IT support phone number South Coast',
    'CCTV installer Ramsgate contact',
    'Unlimited IT Solutions address',
    'computer shop Ramsgate KZN',
  ],
  openGraph: {
    title: 'Contact Us | Unlimited IT Solutions',
    description:
      'Visit our shop at 202 Marine Drive, Ramsgate or call 039 314 4359. Computer repairs, CCTV, networking, and IT support.',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
