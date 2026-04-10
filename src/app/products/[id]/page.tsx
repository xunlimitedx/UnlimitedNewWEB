import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAdminDb } from '@/lib/firebase-admin';
import ProductDetailClient from './ProductDetailClient';
import type { Product, Review } from '@/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const db = getAdminDb();
    const doc = await db.collection('products').doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as Product;
  } catch {
    return null;
  }
}

async function getReviews(productId: string): Promise<Review[]> {
  try {
    const db = getAdminDb();
    const snap = await db
      .collection('reviews')
      .where('productId', '==', productId)
      .orderBy('createdAt', 'desc')
      .get();
    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Review[];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) {
    return { title: 'Product Not Found' };
  }

  const description =
    product.shortDescription ||
    product.description?.substring(0, 160) ||
    `Buy ${product.name} from Unlimited IT Solutions in Ramsgate, KZN.`;

  return {
    title: `${product.name} | Unlimited IT Solutions`,
    description,
    openGraph: {
      title: `${product.name} | Unlimited IT Solutions`,
      description,
      url: `https://unlimitedits.co.za/products/${id}`,
      type: 'website',
      images: product.images?.[0]
        ? [{ url: product.images[0], width: 800, height: 800, alt: product.name }]
        : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const [product, reviews] = await Promise.all([getProduct(id), getReviews(id)]);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} initialReviews={reviews} />;
}
