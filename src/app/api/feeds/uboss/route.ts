import { NextResponse } from 'next/server';
import type { FeedProduct } from '@/types';

function getUbossFeedUrl(): string {
  const token = process.env.UBOSS_API_TOKEN;
  if (!token) throw new Error('UBOSS_API_TOKEN not configured');
  return `https://app.uboss.co.za/api/inventory/feed?token=${encodeURIComponent(token)}&format=json`;
}

interface UbossItem {
  sku: string;
  barcode: string;
  name: string;
  description: string;
  category: string;
  type: string;
  price: number;
  currency: string;
  tax_rate: number;
  tax_inclusive: boolean;
  quantity_on_hand: number;
  in_stock: boolean;
  is_active: boolean;
  last_updated: string;
  image_url: string;
}

function transformUbossItem(item: UbossItem): FeedProduct {
  return {
    sku: item.sku || '',
    name: item.name || '',
    description: item.description || '',
    category: item.category || 'Uncategorized',
    price: item.price || 0,
    costPrice: item.price || 0,
    stock: item.quantity_on_hand != null ? Math.max(0, item.quantity_on_hand) : null,
    inStock: item.in_stock,
    isActive: item.is_active,
    imageUrl: item.image_url || '',
    supplier: 'Uboss',
    barcode: item.barcode || '',
    lastUpdated: item.last_updated || '',
  };
}

export async function GET() {
  try {
    const response = await fetch(getUbossFeedUrl(), {
      next: { revalidate: 0 },
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: `Uboss API returned ${response.status}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    const items: UbossItem[] = data.items || [];
    const products: FeedProduct[] = items.map(transformUbossItem);

    // Get unique categories
    const categories = Array.from(new Set(products.map((p) => p.category))).sort();

    return NextResponse.json({
      success: true,
      data: {
        supplier: 'Uboss',
        totalItems: data.total_items || products.length,
        currency: data.currency || 'ZAR',
        generatedAt: data.generated_at || '',
        products,
        categories,
      },
    });
  } catch (error) {
    console.error('Uboss feed error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch Uboss feed' },
      { status: 500 }
    );
  }
}
