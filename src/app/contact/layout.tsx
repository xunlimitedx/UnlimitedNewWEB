import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Unlimited IT Solutions. Visit us at 202 Marine Drive, Ramsgate or call 039 314 4359. We provide IT support, sales, and service across South Africa.',
  openGraph: {
    title: 'Contact Us | Unlimited IT Solutions',
    description: 'Get in touch with Unlimited IT Solutions for IT support, sales, and service.',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
