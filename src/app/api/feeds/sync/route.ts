import { NextRequest, NextResponse } from 'next/server';
import type { FeedProduct } from '@/types';

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

    // Fetch feed data from our internal API
    const feedUrl = `${request.nextUrl.origin}/api/feeds/${supplier}`;
    const feedResponse = await fetch(feedUrl);
    const feedData = await feedResponse.json();

    if (!feedData.success) {
      return NextResponse.json(
        { success: false, error: `Failed to fetch ${supplier} feed` },
        { status: 502 }
      );
    }

    let products: FeedProduct[] = feedData.data.products;

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
          totalInFeed: feedData.data.products.length,
          afterFilters: importProducts.length,
          categories: feedData.data.categories,
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
