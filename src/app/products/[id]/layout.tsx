import type { Metadata } from 'next';
import { getAdminDb } from '@/lib/firebase-admin';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const db = getAdminDb();
    const doc = await db.collection('products').doc(params.id).get();

    if (!doc.exists) {
      return { title: 'Product Not Found' };
    }

    const product = doc.data()!;
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
  } catch {
    return { title: 'Product Details' };
  }
}

export default function ProductDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
