import { Metadata } from 'next';
import { getAdminDb } from '@/lib/firebase-admin';
import HomeClient from './HomeClient';
import type { Product } from '@/types';

export const metadata: Metadata = {
  title: 'Unlimited IT Solutions | Computer Repairs, IT Support & Sales | Ramsgate, KZN',
  description:
    'Unlimited IT Solutions — computer repairs, laptop repairs, Mac repairs, console repairs, CCTV installations, networking, IT support, and hardware sales in Ramsgate, KwaZulu-Natal.',
  openGraph: {
    title: 'Unlimited IT Solutions | Computer Repairs, IT Support & Sales | Ramsgate, KZN',
    description:
      'Computer repairs, laptop & Mac repairs, CCTV installations, networking, console repairs, and IT support. Physical shop in Ramsgate with on-site technicians across KZN.',
    url: 'https://unlimitedits.co.za',
    type: 'website',
  },
};

async function getLatestProducts(): Promise<Product[]> {
  try {
    const db = getAdminDb();
    const snap = await db
      .collection('products')
      .where('isActive', '!=', false)
      .orderBy('isActive')
      .orderBy('createdAt', 'desc')
      .limit(8)
      .get();
    return snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const latestProducts = await getLatestProducts();
  return <HomeClient latestProducts={latestProducts} />;
}
