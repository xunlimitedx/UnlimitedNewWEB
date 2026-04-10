import { Metadata } from 'next';
import SearchClient from './SearchClient';

export const metadata: Metadata = {
  title: 'Search Products',
  description: 'Search our full catalogue of computers, laptops, components, peripherals, and IT accessories.',
  robots: { index: false },
};

export default function SearchPage() {
  return <SearchClient />;
}
