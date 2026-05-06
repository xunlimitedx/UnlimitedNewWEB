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
    // Esquire only exposes a yes/no flag — use null when in stock so the UI
    // doesn't lie with "1 remaining".
    stock: inStock ? null : 0,
    inStock,
    isActive: (item.status as number) === 1,
    imageUrl: (item.image as string) || '',
    supplier: 'Esquire',
    lastUpdated: new Date().toISOString(),
  };
}

function transformGenericItem(item: Record<string, unknown>, supplierName: string): FeedProduct {
  return {
    sku: (item.sku as string) || (item.productCode as string) || (item.id as string) || '',
    name: (item.name as string) || (item.productName as string) || (item.title as string) || '',
    description: (item.description as string) || (item.productSummary as string) || '',
    category: (item.category as string) || 'Uncategorized',
    price: Number(item.price) || 0,
    costPrice: Number(item.costPrice || item.cost || item.price) || 0,
    stock: item.stock != null ? Number(item.stock) : (item.quantity != null ? Number(item.quantity) : null),
    inStock: item.inStock != null ? Boolean(item.inStock) : (Number(item.stock || item.quantity || 0) > 0),
    isActive: item.isActive != null ? Boolean(item.isActive) : true,
    imageUrl: (item.imageUrl as string) || (item.image as string) || (item.image_url as string) || '',
    supplier: supplierName,
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

    if (!format || typeof format !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Format is required' },
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
    const supplierName = (body.supplierName as string) || format;

    if (format === 'uboss') {
      const items = rawData.items || [];
      products = items.map(transformUbossItem);
    } else if (format === 'esquire') {
      const items: Record<string, unknown>[] = Array.isArray(rawData) ? rawData : [];
      products = items.map(transformEsquireItem);
    } else {
      // Generic format: try to handle any JSON array or { items: [] }
      const items: Record<string, unknown>[] = Array.isArray(rawData)
        ? rawData
        : (rawData.items || rawData.products || rawData.data || []);
      products = items.map((item) => transformGenericItem(item, supplierName));
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
