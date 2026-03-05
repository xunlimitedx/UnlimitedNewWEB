import { NextRequest, NextResponse } from 'next/server';
import type { FeedProduct } from '@/types';

function transformUbossItem(item: Record<string, unknown>): FeedProduct {
  return {
    sku: (item.sku as string) || '',
    name: (item.name as string) || '',
    description: (item.description as string) || '',
    category: (item.category as string) || 'Uncategorized',
    price: (item.price as number) || 0,
    costPrice: (item.price as number) || 0,
    stock: item.quantity_on_hand != null ? Math.max(0, item.quantity_on_hand as number) : null,
    inStock: item.in_stock as boolean,
    isActive: item.is_active as boolean,
    imageUrl: (item.image_url as string) || '',
    supplier: 'Uboss',
    barcode: (item.barcode as string) || '',
    lastUpdated: (item.last_updated as string) || '',
  };
}

function transformEsquireItem(item: Record<string, unknown>): FeedProduct {
  const inStock = ((item.availableQty as string) || '').toLowerCase() === 'yes';
  return {
    sku: (item.productCode as string) || '',
    name: (item.productName as string) || '',
    description: (item.productSummary as string) || '',
    category: (item.category as string) || 'Uncategorized',
    price: (item.price as number) || 0,
    costPrice: (item.price as number) || 0,
    stock: inStock ? 1 : 0,
    inStock,
    isActive: (item.status as number) === 1,
    imageUrl: (item.image as string) || '',
    supplier: 'Esquire',
    lastUpdated: new Date().toISOString(),
  };
}

// Validate that the URL is a valid HTTP(S) URL
function isValidFeedUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { feedUrl, format } = body;

    if (!feedUrl || typeof feedUrl !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Feed URL is required' },
        { status: 400 }
      );
    }

    if (!isValidFeedUrl(feedUrl)) {
      return NextResponse.json(
        { success: false, error: 'Invalid feed URL. Must be a valid HTTP/HTTPS URL.' },
        { status: 400 }
      );
    }

    if (!format || !['uboss', 'esquire'].includes(format)) {
      return NextResponse.json(
        { success: false, error: 'Format must be "uboss" or "esquire"' },
        { status: 400 }
      );
    }

    const response = await fetch(feedUrl, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: `Feed API returned ${response.status}: ${response.statusText}` },
        { status: 502 }
      );
    }

    const rawData = await response.json();

    let products: FeedProduct[];
    let supplierName: string;

    if (format === 'uboss') {
      const items = rawData.items || [];
      products = items.map(transformUbossItem);
      supplierName = 'Uboss';
    } else {
      const items: Record<string, unknown>[] = Array.isArray(rawData) ? rawData : [];
      products = items.map(transformEsquireItem);
      supplierName = 'Esquire';
    }

    const categories = Array.from(
      new Set(products.map((p) => p.category).filter(Boolean))
    ).sort();

    return NextResponse.json({
      success: true,
      data: {
        supplier: supplierName,
        totalItems: products.length,
        currency: 'ZAR',
        generatedAt: new Date().toISOString(),
        products,
        categories,
      },
    });
  } catch (error) {
    console.error('Feed fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch feed: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
