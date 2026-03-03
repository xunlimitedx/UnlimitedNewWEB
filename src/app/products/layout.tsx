import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop',
  description:
    'Browse our wide range of IT products – laptops, desktops, components, peripherals, networking, and more. Quality tech at competitive prices from Unlimited IT Solutions.',
  openGraph: {
    title: 'Shop | Unlimited IT Solutions',
    description: 'Browse laptops, desktops, components, and more from Unlimited IT Solutions.',
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
