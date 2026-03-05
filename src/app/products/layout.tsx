import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop — Computers, Laptops & IT Hardware | Ramsgate',
  description:
    'Browse laptops, desktops, components, peripherals, and networking equipment from Dell, HP, Lenovo, ASUS, Apple, and more. Visit our shop in Ramsgate, KZN, or order online from Unlimited IT Solutions.',
  openGraph: {
    title: 'Shop | Unlimited IT Solutions',
    description: 'Browse laptops, desktops, components, and more from Unlimited IT Solutions in Ramsgate.',
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
