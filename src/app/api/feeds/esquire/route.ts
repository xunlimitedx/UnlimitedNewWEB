import { NextResponse } from 'next/server';
import type { FeedProduct } from '@/types';

const ESQUIRE_FEED_URL =
  'https://api.esquire.co.za/api/DataFeed?u=info@unlimitedits.co.za&p=Unlimited@4833&t=json&m=0&o=ascending&r=RoundNone&rm=0&min=0';

interface EsquireItem {
  productName: string;
  productCode: string;
  category: string;
  productSummary: string;
  price: number;
  availableQty: string;
  image: string | null;
  status: number;
}

function transformEsquireItem(item: EsquireItem): FeedProduct {
  const inStock = item.availableQty?.toLowerCase() === 'yes';

  return {
    sku: item.productCode || '',
    name: item.productName || '',
    description: item.productSummary || '',
    category: item.category || 'Uncategorized',
    price: item.price || 0,
    costPrice: item.price || 0,
    stock: inStock ? 1 : 0,
    inStock,
    isActive: item.status === 1,
    imageUrl: item.image || '',
    supplier: 'Esquire',
    lastUpdated: new Date().toISOString(),
  };
}

export async function GET() {
  try {
    const response = await fetch(ESQUIRE_FEED_URL, {
      next: { revalidate: 0 },
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: `Esquire API returned ${response.status}` },
        { status: 502 }
      );
    }

    const items: EsquireItem[] = await response.json();
    const products: FeedProduct[] = items.map(transformEsquireItem);

    // Get unique categories
    const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean))).sort();

    return NextResponse.json({
      success: true,
      data: {
        supplier: 'Esquire',
        totalItems: products.length,
        currency: 'ZAR',
        generatedAt: new Date().toISOString(),
        products,
        categories,
      },
    });
  } catch (error) {
    console.error('Esquire feed error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch Esquire feed' },
      { status: 500 }
    );
  }
}
