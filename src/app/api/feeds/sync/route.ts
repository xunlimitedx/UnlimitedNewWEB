import { NextRequest, NextResponse } from 'next/server';
import type { FeedProduct } from '@/types';

// Validate that the URL is a valid HTTP(S) URL
function isValidFeedUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

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

async function fetchFeedProducts(supplier: string, feedUrl: string): Promise<{ products: FeedProduct[]; categories: string[] }> {
  const response = await fetch(feedUrl, {
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) throw new Error(`Feed API returned ${response.status}`);

  const rawData = await response.json();

  let products: FeedProduct[];

  if (supplier === 'uboss') {
    const items = rawData.items || [];
    products = items.map((item: Record<string, unknown>) => ({
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
  } else if (supplier === 'esquire') {
    const items: Record<string, unknown>[] = Array.isArray(rawData) ? rawData : [];
    products = items.map((item) => {
      const inStock = ((item.availableQty as string) || '').toLowerCase() === 'yes';
      // Esquire only exposes a yes/no availability flag, not a real count.
      // Use null when in stock so the storefront says "In Stock" without the
      // misleading "1 remaining" copy. Use 0 only when truly out of stock.
      return {
        sku: (item.productCode as string) || '',
        name: (item.productName as string) || '',
        description: (item.productSummary as string) || '',
        category: (item.category as string) || 'Uncategorized',
        price: (item.price as number) || 0,
        costPrice: (item.price as number) || 0,
        stock: inStock ? null : 0,
        inStock,
        isActive: (item.status as number) === 1,
        imageUrl: (item.image as string) || '',
        supplier: 'Esquire',
        lastUpdated: new Date().toISOString(),
      };
    });
  } else {
    // Generic format
    const items: Record<string, unknown>[] = Array.isArray(rawData)
      ? rawData
      : (rawData.items || rawData.products || rawData.data || []);
    const supplierName = supplier.charAt(0).toUpperCase() + supplier.slice(1);
    products = items.map((item) => ({
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
    }));
  }

  const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean))).sort();
  return { products, categories };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      supplier,
      feedUrl,
      markupType = 'percentage',
      markupValue = 0,
      excludeOutOfStock = true,
      excludeZeroPrice = true,
      selectedCategories = [],
      mode = 'preview',
    } = body;

    if (!supplier || typeof supplier !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Supplier is required' },
        { status: 400 }
      );
    }

    if (!feedUrl || !isValidFeedUrl(feedUrl)) {
      return NextResponse.json(
        { success: false, error: 'A valid feed URL is required' },
        { status: 400 }
      );
    }

    // Fetch feed data directly from supplier API
    const feedData = await fetchFeedProducts(supplier, feedUrl);
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
      const categorySlug = p.category
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      return {
        name: p.name,
        slug: generateSlug(p.name),
        description: p.description,
        shortDescription: p.description.substring(0, 200),
        price: sellingPrice,
        costPrice: p.costPrice,
        category: categorySlug,
        categoryName: p.category,
        brand: p.supplier,
        sku: p.sku,
        stock: p.stock,
        images: p.imageUrl ? [p.imageUrl] : [],
        tags: [p.supplier.toLowerCase(), categorySlug],
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
