import { NextRequest, NextResponse } from 'next/server';
import type { FeedProduct } from '@/types';

const UBOSS_FEED_URL =
  'https://app.uboss.co.za/api/inventory/feed?token=f2f8bc7927670589ccc49d3047053f32a7573201ccfac64a73fa30e31ebadd920f3ebdac7b2e4e92ce75bb276db34625&format=json';

const ESQUIRE_FEED_URL =
  'https://api.esquire.co.za/api/DataFeed?u=info@unlimitedits.co.za&p=Unlimited@4833&t=json&m=0&o=ascending&r=RoundNone&rm=0&min=0';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 120);
}

function applyMarkup(
  costPrice: number,
  markupType: 'percentage' | 'fixed',
  markupValue: number
): number {
  if (markupType === 'percentage') {
    return Math.round((costPrice * (1 + markupValue / 100)) * 100) / 100;
  }
  return Math.round((costPrice + markupValue) * 100) / 100;
}

async function fetchFeedProducts(supplier: string): Promise<{ products: FeedProduct[]; categories: string[] }> {
  if (supplier === 'uboss') {
    const response = await fetch(UBOSS_FEED_URL, {
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) throw new Error(`Uboss API returned ${response.status}`);
    const data = await response.json();
    const items = data.items || [];
    const products: FeedProduct[] = items.map((item: Record<string, unknown>) => ({
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
    }));
    const categories = Array.from(new Set(products.map((p) => p.category))).sort();
    return { products, categories };
  } else {
    const response = await fetch(ESQUIRE_FEED_URL, {
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) throw new Error(`Esquire API returned ${response.status}`);
    const items: Record<string, unknown>[] = await response.json();
    const products: FeedProduct[] = items.map((item) => {
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
    });
    const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean))).sort();
    return { products, categories };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      supplier,
      markupType = 'percentage',
      markupValue = 0,
      excludeOutOfStock = true,
      excludeZeroPrice = true,
      selectedCategories = [],
      mode = 'preview',
    } = body;

    if (!supplier || !['uboss', 'esquire'].includes(supplier)) {
      return NextResponse.json(
        { success: false, error: 'Invalid supplier' },
        { status: 400 }
      );
    }

    // Fetch feed data directly from supplier API
    const feedData = await fetchFeedProducts(supplier);
    let products: FeedProduct[] = feedData.products;

    // Apply filters
    if (excludeZeroPrice) {
      products = products.filter((p) => p.price > 0);
    }
    if (excludeOutOfStock) {
      products = products.filter((p) => p.inStock);
    }
    if (selectedCategories.length > 0) {
      products = products.filter((p) =>
        selectedCategories.includes(p.category)
      );
    }
    // Only include active products
    products = products.filter((p) => p.isActive);

    // Transform products for import
    const importProducts = products.map((p) => {
      const sellingPrice = applyMarkup(p.costPrice, markupType, markupValue);
      return {
        name: p.name,
        slug: generateSlug(p.name),
        description: p.description,
        shortDescription: p.description.substring(0, 200),
        price: sellingPrice,
        costPrice: p.costPrice,
        category: p.category,
        brand: p.supplier,
        sku: p.sku,
        stock: p.stock,
        images: p.imageUrl ? [p.imageUrl] : [],
        tags: [p.supplier.toLowerCase(), p.category.toLowerCase()],
        specifications: {
          Supplier: p.supplier,
          ...(p.barcode ? { Barcode: p.barcode } : {}),
        },
        isActive: true,
        isFeatured: false,
        rating: 0,
        reviewCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });

    if (mode === 'preview') {
      return NextResponse.json({
        success: true,
        data: {
          supplier,
          totalInFeed: feedData.products.length,
          afterFilters: importProducts.length,
          categories: feedData.categories,
          previewProducts: importProducts.slice(0, 20),
          markupApplied: { type: markupType, value: markupValue },
        },
      });
    }

    // Mode === 'import' — return the products for client-side Firestore writes
    return NextResponse.json({
      success: true,
      data: {
        supplier,
        products: importProducts,
        totalCount: importProducts.length,
      },
    });
  } catch (error) {
    console.error('Feed sync error:', error);
    return NextResponse.json(
      { success: false, error: 'Feed sync failed: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
