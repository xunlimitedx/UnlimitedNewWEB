import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import type { FeedProduct } from '@/types';

interface FeedConfig {
  feedUrl: string;
  markupType: 'percentage' | 'fixed';
  markupValue: number;
  excludeOutOfStock: boolean;
  excludeZeroPrice: boolean;
  autoSync?: boolean;
  supplierName?: string;
}

function applyMarkup(
  costPrice: number,
  markupType: 'percentage' | 'fixed',
  markupValue: number
): number {
  if (markupType === 'percentage') {
    return Math.round(costPrice * (1 + markupValue / 100) * 100) / 100;
  }
  return Math.round((costPrice + markupValue) * 100) / 100;
}

function parseFeedProducts(supplier: string, rawData: unknown): FeedProduct[] {
  if (supplier === 'uboss') {
    const data = rawData as Record<string, unknown>;
    const items = (data.items || []) as Record<string, unknown>[];
    return items.map((item) => ({
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
    const items = (Array.isArray(rawData) ? rawData : []) as Record<string, unknown>[];
    return items.map((item) => {
      const inStock = ((item.availableQty as string) || '').toLowerCase() === 'yes';
      return {
        sku: (item.productCode as string) || '',
        name: (item.productName as string) || '',
        description: (item.productSummary as string) || '',
        category: (item.category as string) || 'Uncategorized',
        price: (item.price as number) || 0,
        costPrice: (item.price as number) || 0,
        // Use null when in stock to avoid the misleading "1 remaining" copy.
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
    const data = rawData as Record<string, unknown>;
    const items = (Array.isArray(rawData)
      ? rawData
      : (data.items || data.products || data.data || [])) as Record<string, unknown>[];
    const supplierName = supplier.charAt(0).toUpperCase() + supplier.slice(1);
    return items.map((item) => ({
      sku: (item.sku as string) || (item.productCode as string) || (item.id as string) || '',
      name: (item.name as string) || (item.productName as string) || (item.title as string) || '',
      description: (item.description as string) || '',
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
}

async function syncSupplierStock(
  supplier: string,
  config: FeedConfig
): Promise<{ updated: number; deactivated: number; errors: string[] }> {
  const db = getAdminDb();
  const errors: string[] = [];

  // 1. Fetch the feed
  const response = await fetch(config.feedUrl, {
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`Feed returned ${response.status}`);
  }
  const rawData = await response.json();
  const feedProducts = parseFeedProducts(supplier, rawData);

  // 2. Build a lookup of feed products by SKU
  const feedBySku = new Map<string, FeedProduct>();
  for (const fp of feedProducts) {
    if (fp.sku) feedBySku.set(fp.sku, fp);
  }

  // 3. Get all existing products for this supplier from Firestore
  // Try supplierName from config first, fall back to capitalized supplier ID
  const supplierName = config.supplierName
    || supplier.charAt(0).toUpperCase() + supplier.slice(1);
  const productsSnap = await db
    .collection('products')
    .where('brand', '==', supplierName)
    .get();

  let updated = 0;
  let deactivated = 0;
  let batch = db.batch();
  let batchCount = 0;
  const MAX_BATCH = 450; // Firestore limit is 500, leave room

  for (const doc of productsSnap.docs) {
    const productData = doc.data();
    const sku = productData.sku as string;
    if (!sku) continue;

    const feedItem = feedBySku.get(sku);

    try {
      if (feedItem) {
        // Product exists in feed — update stock, price, active status
        const newPrice = applyMarkup(feedItem.costPrice, config.markupType, config.markupValue);
        const updateData: Record<string, unknown> = {
          stock: feedItem.stock,
          price: newPrice,
          costPrice: feedItem.costPrice,
          isActive: feedItem.isActive && feedItem.inStock,
          updatedAt: new Date().toISOString(),
          lastStockSync: new Date().toISOString(),
        };

        batch.update(doc.ref, updateData);
        batchCount++;
        updated++;
      } else {
        // Product no longer in feed — mark as out of stock
        batch.update(doc.ref, {
          stock: 0,
          isActive: false,
          updatedAt: new Date().toISOString(),
          lastStockSync: new Date().toISOString(),
        });
        batchCount++;
        deactivated++;
      }

      // Commit batch when near the limit
      if (batchCount >= MAX_BATCH) {
        await batch.commit();
        batch = db.batch();
        batchCount = 0;
      }
    } catch (err) {
      errors.push(`${sku}: ${(err as Error).message}`);
    }
  }

  // Commit remaining
  if (batchCount > 0) {
    await batch.commit();
  }

  // 4. Update last sync timestamp
  await db.collection('feedSettings').doc(supplier).set(
    {
      lastStockSync: new Date().toISOString(),
      lastStockSyncUpdated: updated,
      lastStockSyncDeactivated: deactivated,
    },
    { merge: true }
  );

  return { updated, deactivated, errors };
}

// POST: Manual trigger from admin or external cron
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { supplier, secret } = body;

    // If called externally, validate secret
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && secret !== cronSecret) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const db = getAdminDb();
    const results: Record<string, { updated: number; deactivated: number; errors: string[] }> = {};

    if (supplier) {
      // Sync a specific supplier
      const configDoc = await db.collection('feedSettings').doc(supplier).get();
      if (!configDoc.exists) {
        return NextResponse.json(
          { success: false, error: `No feed config found for ${supplier}` },
          { status: 404 }
        );
      }
      const config = configDoc.data() as FeedConfig;
      if (!config.feedUrl) {
        return NextResponse.json(
          { success: false, error: `No feed URL configured for ${supplier}` },
          { status: 400 }
        );
      }
      results[supplier] = await syncSupplierStock(supplier, config);
    } else {
      // Sync ALL suppliers that have autoSync enabled or have a feedUrl
      const settingsSnap = await db.collection('feedSettings').get();
      for (const doc of settingsSnap.docs) {
        const config = doc.data() as FeedConfig;
        if (!config.feedUrl) continue;
        try {
          results[doc.id] = await syncSupplierStock(doc.id, config);
        } catch (err) {
          results[doc.id] = {
            updated: 0,
            deactivated: 0,
            errors: [(err as Error).message],
          };
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        syncedAt: new Date().toISOString(),
        results,
      },
    });
  } catch (error) {
    console.error('Stock sync error:', error);
    return NextResponse.json(
      { success: false, error: 'Stock sync failed: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
