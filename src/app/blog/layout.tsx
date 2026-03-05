import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tech Blog — IT Tips, Repair Guides & News',
  description:
    'Read the latest IT tips, computer repair guides, CCTV advice, networking tutorials, and tech news from Unlimited IT Solutions in Ramsgate, KZN.',
  keywords: [
    'IT blog South Africa',
    'computer repair tips',
    'CCTV setup guide',
    'tech news KZN',
    'networking tips',
    'Mac repair guide',
  ],
  openGraph: {
    title: 'Tech Blog | Unlimited IT Solutions',
    description: 'IT tips, repair guides, and tech news from Unlimited IT Solutions.',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
