import type { Metadata } from 'next';
import { getAdminDb } from '@/lib/firebase-admin';

type Props = {
  params: { id: string };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getProduct(id: string): Promise<Record<string, any> | null> {
  try {
    const db = getAdminDb();
    const doc = await db.collection('products').doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data()! };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.id);

  if (!product) return { title: 'Product Not Found' };

  const description =
    product.description?.substring(0, 160) ||
    `Buy ${product.name} from Unlimited IT Solutions in Ramsgate, KZN.`;

  return {
    title: product.name,
    description,
    openGraph: {
      title: `${product.name} | Unlimited IT Solutions`,
      description,
      images: product.images?.[0]
        ? [
            {
              url: product.images[0],
              width: 800,
              height: 800,
              alt: product.name,
            },
          ]
        : [],
    },
  };
}

export default async function ProductDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const product = await getProduct(params.id);

  const jsonLd = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description || '',
        url: `https://unlimitedits.co.za/products/${params.id}`,
        ...(product.images?.[0] ? { image: product.images[0] } : {}),
        ...(product.sku ? { sku: product.sku } : {}),
        ...(product.brand
          ? { brand: { '@type': 'Brand', name: product.brand } }
          : {}),
        offers: {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: 'ZAR',
          availability:
            (product.stock ?? 999) > 0
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
          seller: {
            '@type': 'Organization',
            name: 'Unlimited IT Solutions',
          },
        },
        ...(product.rating
          ? {
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: product.rating,
                reviewCount: product.reviewCount || 1,
              },
            }
          : {}),
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  );
}
