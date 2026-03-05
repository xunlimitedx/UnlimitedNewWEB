'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, Button, Badge, Spinner } from '@/components/ui';
import { addDocument, getCollection, setDocument } from '@/lib/firebase';
import { query, where } from '@/lib/firebase';
import toast from 'react-hot-toast';
import {
  RefreshCw,
  Download,
  Filter,
  Eye,
  Package,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Truck,
  DollarSign,
  Layers,
  Search,
  X,
  Link2,
} from 'lucide-react';

interface FeedProduct {
  sku: string;
  name: string;
  description: string;
  category: string;
  price: number;
  costPrice: number;
  stock: number | null;
  inStock: boolean;
  isActive: boolean;
  imageUrl: string;
  supplier: string;
  barcode?: string;
}

interface PreviewData {
  supplier: string;
  totalInFeed: number;
  afterFilters: number;
  categories: string[];
  previewProducts: ImportProduct[];
  markupApplied: { type: string; value: number };
}

interface ImportProduct {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  costPrice: number;
  category: string;
  brand: string;
  sku: string;
  stock: number | null;
  images: string[];
  tags: string[];
  specifications: Record<string, string>;
  isActive: boolean;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

interface FeedInfo {
  supplier: string;
  totalItems: number;
  currency: string;
  categories: string[];
  products: FeedProduct[];
}

interface SyncSettings {
  markupType: 'percentage' | 'fixed';
  markupValue: number;
  excludeOutOfStock: boolean;
  excludeZeroPrice: boolean;
  selectedCategories: string[];
  feedUrl: string;
}

const SUPPLIERS = [
  {
    id: 'uboss',
    name: 'Uboss',
    description: 'IT components, networking, storage & peripherals',
    color: 'blue',
  },
  {
    id: 'esquire',
    name: 'Esquire',
    description: 'Full range IT, office, household & accessories',
    color: 'purple',
  },
];

export default function DataFeedsPage() {
  const [activeSupplier, setActiveSupplier] = useState<string | null>(null);
  const [feedInfo, setFeedInfo] = useState<Record<string, FeedInfo>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [syncing, setSyncing] = useState(false);
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [syncResult, setSyncResult] = useState<{
    imported: number;
    failed: number;
    errors: string[];
  } | null>(null);
  const [showCategories, setShowCategories] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const [existingSkus, setExistingSkus] = useState<Set<string>>(new Set());
  const [loadingSkus, setLoadingSkus] = useState(false);

  const [settings, setSettings] = useState<Record<string, SyncSettings>>({
    uboss: {
      markupType: 'percentage',
      markupValue: 20,
      excludeOutOfStock: true,
      excludeZeroPrice: true,
      selectedCategories: [],
      feedUrl: '',
    },
    esquire: {
      markupType: 'percentage',
      markupValue: 20,
      excludeOutOfStock: true,
      excludeZeroPrice: true,
      selectedCategories: [],
      feedUrl: '',
    },
  });

  // Load existing product SKUs to detect duplicates
  const loadExistingSkus = useCallback(async () => {
    setLoadingSkus(true);
    try {
      const products = await getCollection('products');
      const skus = new Set<string>();
      products.forEach((p: Record<string, unknown>) => {
        if (p.sku) skus.add(p.sku as string);
      });
      setExistingSkus(skus);
    } catch {
      console.error('Failed to load existing SKUs');
    } finally {
      setLoadingSkus(false);
    }
  }, []);

  useEffect(() => {
    loadExistingSkus();
  }, [loadExistingSkus]);

  // Load saved feed settings from Firestore
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const docs = await getCollection('feedSettings');
        const savedSettings: Record<string, SyncSettings> = { ...settings };
        docs.forEach((doc: Record<string, unknown>) => {
          const supplier = doc.id as string;
          if (savedSettings[supplier]) {
            savedSettings[supplier] = {
              markupType: (doc.markupType as 'percentage' | 'fixed') || 'percentage',
              markupValue: (doc.markupValue as number) || 20,
              excludeOutOfStock: doc.excludeOutOfStock !== false,
              excludeZeroPrice: doc.excludeZeroPrice !== false,
              selectedCategories: (doc.selectedCategories as string[]) || [],
              feedUrl: (doc.feedUrl as string) || '',
            };
          }
        });
        setSettings(savedSettings);
      } catch {
        // Use defaults
      }
    };
    loadSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchFeed = async (supplier: string) => {
    const feedUrl = settings[supplier]?.feedUrl;
    if (!feedUrl) {
      toast.error('Please enter a feed URL first');
      return;
    }
    setLoading((prev) => ({ ...prev, [supplier]: true }));
    try {
      const response = await fetch('/api/feeds/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedUrl, format: supplier }),
      });
      const data = await response.json();
      if (data.success) {
        setFeedInfo((prev) => ({ ...prev, [supplier]: data.data }));
        toast.success(`Feed loaded: ${data.data.totalItems} products`);
      } else {
        toast.error(data.error || 'Failed to fetch feed');
      }
    } catch {
      toast.error('Network error fetching feed');
    } finally {
      setLoading((prev) => ({ ...prev, [supplier]: false }));
    }
  };

  const getPreview = async (supplier: string) => {
    const s = settings[supplier];
    setSyncing(true);
    setShowPreview(false);
    try {
      const response = await fetch('/api/feeds/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supplier,
          feedUrl: s.feedUrl,
          markupType: s.markupType,
          markupValue: s.markupValue,
          excludeOutOfStock: s.excludeOutOfStock,
          excludeZeroPrice: s.excludeZeroPrice,
          selectedCategories: s.selectedCategories,
          mode: 'preview',
        }),
      });
      const data = await response.json();
      if (data.success) {
        setPreview(data.data);
        setShowPreview(true);
      } else {
        toast.error(data.error || 'Preview failed');
      }
    } catch {
      toast.error('Preview request failed');
    } finally {
      setSyncing(false);
    }
  };

  const startImport = async (supplier: string) => {
    const s = settings[supplier];
    setSyncing(true);
    setSyncResult(null);
    try {
      const response = await fetch('/api/feeds/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supplier,
          feedUrl: s.feedUrl,
          markupType: s.markupType,
          markupValue: s.markupValue,
          excludeOutOfStock: s.excludeOutOfStock,
          excludeZeroPrice: s.excludeZeroPrice,
          selectedCategories: s.selectedCategories,
          mode: 'import',
        }),
      });
      const data = await response.json();
      if (!data.success) {
        toast.error(data.error || 'Import failed');
        setSyncing(false);
        return;
      }

      const products: ImportProduct[] = data.data.products;
      let imported = 0;
      let failed = 0;
      const errors: string[] = [];

      // Process in batches of 10
      const batchSize = 10;
      for (let i = 0; i < products.length; i += batchSize) {
        const batch = products.slice(i, i + batchSize);
        const promises = batch.map(async (product) => {
          try {
            // Check for duplicate SKU
            if (product.sku && existingSkus.has(product.sku)) {
              // Update existing product instead
              const existing = await getCollection('products', [
                where('sku', '==', product.sku),
              ]);
              if (existing.length > 0) {
                const existingDoc = existing[0] as Record<string, unknown>;
                await setDocument('products', existingDoc.id as string, {
                  price: product.price,
                  stock: product.stock,
                  isActive: product.isActive,
                  ...(product.images.length > 0 ? { images: product.images } : {}),
                  updatedAt: new Date().toISOString(),
                });
                imported++;
                return;
              }
            }

            await addDocument('products', product);
            if (product.sku) {
              setExistingSkus((prev) => {
                const next = new Set(Array.from(prev));
                next.add(product.sku);
                return next;
              });
            }
            imported++;
          } catch (err) {
            failed++;
            errors.push(`${product.name}: ${(err as Error).message}`);
          }
        });
        await Promise.all(promises);
      }

      // Create category documents for any new categories from the feed
      const feedCategories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
      for (const catName of feedCategories) {
        const slug = catName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        try {
          await setDocument('categories', slug, {
            name: catName,
            slug,
            description: `${catName} products`,
            isActive: true,
          });
        } catch {
          // Category may already exist, ignore errors
        }
      }

      // Save sync metadata
      await setDocument('feedSettings', supplier, {
        ...s,
        lastSync: new Date().toISOString(),
        lastSyncCount: imported,
      });

      setSyncResult({ imported, failed, errors });
      if (imported > 0) toast.success(`Imported ${imported} products from ${supplier}!`);
      if (failed > 0) toast.error(`${failed} products failed to import`);

      // Refresh SKU list
      await loadExistingSkus();
    } catch (err) {
      toast.error('Import failed: ' + (err as Error).message);
    } finally {
      setSyncing(false);
    }
  };

  const saveSettings = async (supplier: string) => {
    try {
      await setDocument('feedSettings', supplier, settings[supplier]);
      toast.success('Settings saved');
    } catch {
      toast.error('Failed to save settings');
    }
  };

  const updateSetting = (
    supplier: string,
    key: keyof SyncSettings,
    value: unknown
  ) => {
    setSettings((prev) => ({
      ...prev,
      [supplier]: { ...prev[supplier], [key]: value },
    }));
  };

  const toggleCategory = (supplier: string, category: string) => {
    const current = settings[supplier].selectedCategories;
    const updated = current.includes(category)
      ? current.filter((c) => c !== category)
      : [...current, category];
    updateSetting(supplier, 'selectedCategories', updated);
  };

  const filteredCategories = (categories: string[]) => {
    if (!categorySearch) return categories;
    return categories.filter((c) =>
      c.toLowerCase().includes(categorySearch.toLowerCase())
    );
  };

  const currentSettings = activeSupplier ? settings[activeSupplier] : null;
  const currentFeed = activeSupplier ? feedInfo[activeSupplier] : null;

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Truck className="w-5 h-5" />
          Supplier Data Feeds
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Import and sync products from your supplier data feeds
        </p>
        {loadingSkus && (
          <p className="text-xs text-blue-500 mt-1 flex items-center gap-1">
            <Spinner size="sm" /> Loading existing products...
          </p>
        )}
        {!loadingSkus && existingSkus.size > 0 && (
          <p className="text-xs text-gray-400 mt-1">
            {existingSkus.size} existing product SKUs loaded
          </p>
        )}
      </div>

      {/* Supplier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {SUPPLIERS.map((supplier) => {
          const info = feedInfo[supplier.id];
          const isLoading = loading[supplier.id];
          const isActive = activeSupplier === supplier.id;

          return (
            <Card key={supplier.id} className={isActive ? 'ring-2 ring-primary-500' : ''}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{supplier.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{supplier.description}</p>
                  </div>
                  <Badge variant={info ? 'success' : 'default'}>
                    {info ? `${info.totalItems} items` : 'Not loaded'}
                  </Badge>
                </div>

                {info && (
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-lg font-bold text-gray-900">{info.totalItems}</p>
                      <p className="text-[10px] text-gray-500">Total Items</p>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded-lg">
                      <p className="text-lg font-bold text-blue-600">{info.categories.length}</p>
                      <p className="text-[10px] text-blue-500">Categories</p>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded-lg">
                      <p className="text-lg font-bold text-green-600">
                        {info.products.filter((p) => p.inStock && p.price > 0).length}
                      </p>
                      <p className="text-[10px] text-green-500">In Stock</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={isActive ? 'secondary' : 'default'}
                    onClick={() => {
                      setActiveSupplier(isActive ? null : supplier.id);
                      setShowPreview(false);
                      setSyncResult(null);
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Spinner size="sm" />
                    ) : isActive ? (
                      'Close'
                    ) : (
                      'Configure'
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => fetchFeed(supplier.id)}
                    disabled={isLoading}
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Configuration Panel */}
      {activeSupplier && currentSettings && (
        <div className="space-y-4">
          {/* Feed URL */}
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <Link2 className="w-4 h-4" />
                Feed URL
              </h3>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Data Feed URL for {SUPPLIERS.find((s) => s.id === activeSupplier)?.name}
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/feed.xml"
                  value={currentSettings.feedUrl}
                  onChange={(e) =>
                    updateSetting(activeSupplier, 'feedUrl', e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  Enter the full URL to the supplier&apos;s product data feed
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Markup */}
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <DollarSign className="w-4 h-4" />
                Pricing & Markup
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Markup Type
                  </label>
                  <select
                    value={currentSettings.markupType}
                    onChange={(e) =>
                      updateSetting(activeSupplier, 'markupType', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (R)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Markup Value
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step={currentSettings.markupType === 'percentage' ? '1' : '0.01'}
                      value={currentSettings.markupValue}
                      onChange={(e) =>
                        updateSetting(
                          activeSupplier,
                          'markupValue',
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 pr-8"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                      {currentSettings.markupType === 'percentage' ? '%' : 'R'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col justify-end">
                  <p className="text-xs text-gray-500 mb-1">Preview: R100 cost →</p>
                  <p className="text-lg font-bold text-green-600">
                    R
                    {currentSettings.markupType === 'percentage'
                      ? (100 * (1 + currentSettings.markupValue / 100)).toFixed(2)
                      : (100 + currentSettings.markupValue).toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <Filter className="w-4 h-4" />
                Filters
              </h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentSettings.excludeOutOfStock}
                    onChange={(e) =>
                      updateSetting(activeSupplier, 'excludeOutOfStock', e.target.checked)
                    }
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">
                    Exclude out-of-stock items
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentSettings.excludeZeroPrice}
                    onChange={(e) =>
                      updateSetting(activeSupplier, 'excludeZeroPrice', e.target.checked)
                    }
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">
                    Exclude items with R0 price
                  </span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Category Filter */}
          {currentFeed && (
            <Card>
              <CardContent className="p-5">
                <button
                  onClick={() => setShowCategories(!showCategories)}
                  className="w-full flex items-center justify-between"
                >
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    Category Filter
                    {currentSettings.selectedCategories.length > 0 && (
                      <Badge variant="info">
                        {currentSettings.selectedCategories.length} selected
                      </Badge>
                    )}
                  </h3>
                  {showCategories ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </button>

                {showCategories && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 mb-3">
                      Select categories to import. Leave empty to import all.
                    </p>

                    {/* Search */}
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search categories..."
                        value={categorySearch}
                        onChange={(e) => setCategorySearch(e.target.value)}
                        className="w-full pl-9 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      {categorySearch && (
                        <button
                          onClick={() => setCategorySearch('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          <X className="w-4 h-4 text-gray-400" />
                        </button>
                      )}
                    </div>

                    <div className="flex gap-2 mb-3">
                      <button
                        onClick={() =>
                          updateSetting(
                            activeSupplier,
                            'selectedCategories',
                            [...currentFeed.categories]
                          )
                        }
                        className="text-xs text-primary-600 hover:underline"
                      >
                        Select All
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        onClick={() =>
                          updateSetting(activeSupplier, 'selectedCategories', [])
                        }
                        className="text-xs text-primary-600 hover:underline"
                      >
                        Clear All
                      </button>
                    </div>

                    <div className="max-h-60 overflow-y-auto border border-gray-100 rounded-lg p-2 space-y-1">
                      {filteredCategories(currentFeed.categories).map((cat) => (
                        <label
                          key={cat}
                          className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-50 cursor-pointer text-sm"
                        >
                          <input
                            type="checkbox"
                            checked={currentSettings.selectedCategories.includes(cat)}
                            onChange={() => toggleCategory(activeSupplier, cat)}
                            className="rounded border-gray-300"
                          />
                          <span className="text-gray-700 truncate">{cat}</span>
                          <span className="text-xs text-gray-400 ml-auto flex-shrink-0">
                            {currentFeed.products.filter((p) => p.category === cat).length}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => saveSettings(activeSupplier)}
            >
              Save Settings
            </Button>
            <Button
              variant="secondary"
              onClick={() => getPreview(activeSupplier)}
              disabled={syncing || !currentFeed}
            >
              <Eye className="w-4 h-4" />
              {syncing ? 'Loading...' : 'Preview Import'}
            </Button>
            <Button
              onClick={() => startImport(activeSupplier)}
              disabled={syncing || !currentFeed}
            >
              <Download className="w-4 h-4" />
              {syncing ? 'Importing...' : 'Start Import'}
            </Button>
          </div>

          {/* Preview */}
          {showPreview && preview && (
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                  <Eye className="w-4 h-4" />
                  Import Preview
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xl font-bold text-gray-900">{preview.totalInFeed}</p>
                    <p className="text-xs text-gray-500">Total in Feed</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-xl font-bold text-blue-600">{preview.afterFilters}</p>
                    <p className="text-xs text-blue-500">After Filters</p>
                  </div>
                  <div className="text-center p-3 bg-amber-50 rounded-lg">
                    <p className="text-xl font-bold text-amber-600">
                      {preview.markupApplied.value}
                      {preview.markupApplied.type === 'percentage' ? '%' : 'R'}
                    </p>
                    <p className="text-xs text-amber-500">Markup</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-xl font-bold text-green-600">
                      {preview.previewProducts.length}
                    </p>
                    <p className="text-xs text-green-500">Previewing</p>
                  </div>
                </div>

                {/* Preview Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-2 text-xs font-medium text-gray-500">
                          Product
                        </th>
                        <th className="text-left py-2 px-2 text-xs font-medium text-gray-500">
                          SKU
                        </th>
                        <th className="text-left py-2 px-2 text-xs font-medium text-gray-500">
                          Category
                        </th>
                        <th className="text-right py-2 px-2 text-xs font-medium text-gray-500">
                          Cost
                        </th>
                        <th className="text-right py-2 px-2 text-xs font-medium text-gray-500">
                          Sell Price
                        </th>
                        <th className="text-center py-2 px-2 text-xs font-medium text-gray-500">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {preview.previewProducts.map((product, i) => {
                        const isDuplicate = existingSkus.has(product.sku);
                        return (
                          <tr
                            key={i}
                            className={`border-b border-gray-50 ${
                              isDuplicate ? 'bg-amber-50/50' : ''
                            }`}
                          >
                            <td className="py-2 px-2">
                              <div className="flex items-center gap-2">
                                {product.images[0] && (
                                  <img
                                    src={product.images[0]}
                                    alt=""
                                    className="w-8 h-8 rounded object-cover bg-gray-100"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                  />
                                )}
                                <span className="truncate max-w-[200px]" title={product.name}>
                                  {product.name}
                                </span>
                              </div>
                            </td>
                            <td className="py-2 px-2 text-gray-500 font-mono text-xs">
                              {product.sku}
                            </td>
                            <td className="py-2 px-2 text-gray-500 text-xs truncate max-w-[120px]">
                              {product.category}
                            </td>
                            <td className="py-2 px-2 text-right text-gray-400 text-xs">
                              R{product.costPrice?.toFixed(2)}
                            </td>
                            <td className="py-2 px-2 text-right font-semibold text-green-600">
                              R{product.price.toFixed(2)}
                            </td>
                            <td className="py-2 px-2 text-center">
                              {isDuplicate ? (
                                <Badge variant="warning">Update</Badge>
                              ) : (
                                <Badge variant="success">New</Badge>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {preview.afterFilters > 20 && (
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    Showing first 20 of {preview.afterFilters} products
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Sync Results */}
          {syncResult && (
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                  <Package className="w-4 h-4" />
                  Import Results
                </h3>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-2xl font-bold text-green-600">{syncResult.imported}</p>
                    <p className="text-xs text-green-500">Imported / Updated</p>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    </div>
                    <p className="text-2xl font-bold text-red-600">{syncResult.failed}</p>
                    <p className="text-xs text-red-500">Failed</p>
                  </div>
                </div>
                {syncResult.errors.length > 0 && (
                  <div className="p-3 bg-red-50 rounded-lg mt-3">
                    <p className="text-xs font-medium text-red-700 mb-1">Errors:</p>
                    <ul className="text-xs text-red-600 space-y-0.5 max-h-40 overflow-y-auto">
                      {syncResult.errors.slice(0, 20).map((err, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          {err}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
