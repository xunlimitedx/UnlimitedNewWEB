'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, Button, Badge, Spinner } from '@/components/ui';
import { getCollection, updateDocument } from '@/lib/firebase';
import { formatCurrency } from '@/lib/utils';
import type { Product } from '@/types';
import toast from 'react-hot-toast';
import {
  DollarSign,
  Search,
  Package,
  Save,
  Percent,
  ArrowUpDown,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Calculator,
  RotateCcw,
  Filter,
  CheckSquare,
  Square,
} from 'lucide-react';

type RoundingMode =
  | 'none'
  | 'nearest1'
  | 'nearest5'
  | 'nearest10'
  | 'nearest50'
  | 'nearest100'
  | 'up99'
  | 'up95';

interface PriceEdit {
  id: string;
  originalPrice: number;
  originalSalePrice: number | null;
  newPrice: number | null;
  newSalePrice: number | null;
}

function roundPrice(price: number, mode: RoundingMode): number {
  if (price <= 0) return price;
  switch (mode) {
    case 'nearest1':
      return Math.round(price);
    case 'nearest5':
      return Math.round(price / 5) * 5;
    case 'nearest10':
      return Math.round(price / 10) * 10;
    case 'nearest50':
      return Math.round(price / 50) * 50;
    case 'nearest100':
      return Math.round(price / 100) * 100;
    case 'up99':
      return Math.ceil(price) - 0.01;
    case 'up95':
      return Math.ceil(price) - 0.05;
    default:
      return Math.round(price * 100) / 100;
  }
}

const ROUNDING_OPTIONS: { value: RoundingMode; label: string; example: string }[] = [
  { value: 'none', label: 'No rounding', example: 'R123.45 → R123.45' },
  { value: 'nearest1', label: 'Nearest R1', example: 'R123.45 → R123' },
  { value: 'nearest5', label: 'Nearest R5', example: 'R123 → R125' },
  { value: 'nearest10', label: 'Nearest R10', example: 'R123 → R120' },
  { value: 'nearest50', label: 'Nearest R50', example: 'R123 → R100' },
  { value: 'nearest100', label: 'Nearest R100', example: 'R123 → R100' },
  { value: 'up99', label: 'X.99 charm pricing', example: 'R123.45 → R123.99' },
  { value: 'up95', label: 'X.95 charm pricing', example: 'R123.45 → R123.95' },
];

type SortField = 'name' | 'price' | 'category' | 'margin';
type SortDirection = 'asc' | 'desc';

export default function PricingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDir, setSortDir] = useState<SortDirection>('asc');

  // Bulk action state
  const [showBulk, setShowBulk] = useState(false);
  const [bulkAction, setBulkAction] = useState<'margin' | 'fixed' | 'setprice' | 'sale'>('margin');
  const [bulkValue, setBulkValue] = useState<number>(0);
  const [bulkRounding, setBulkRounding] = useState<RoundingMode>('none');
  const [bulkScope, setBulkScope] = useState<'all' | 'selected' | 'category'>('all');

  // Individual edits
  const [edits, setEdits] = useState<Record<string, PriceEdit>>({});
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const data = await getCollection('products');
      setProducts(data as unknown as Product[]);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }

  // Get unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
    return cats.sort();
  }, [products]);

  // Filter & sort products
  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      const matchesSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !categoryFilter || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'name':
          cmp = a.name.localeCompare(b.name);
          break;
        case 'price':
          cmp = (a.price || 0) - (b.price || 0);
          break;
        case 'category':
          cmp = (a.category || '').localeCompare(b.category || '');
          break;
        case 'margin': {
          const specA = (a as unknown as Record<string, unknown>).specifications as Record<string, string> | undefined;
          const specB = (b as unknown as Record<string, unknown>).specifications as Record<string, string> | undefined;
          const costA = specA?.Supplier ? (a.price || 0) : 0;
          const costB = specB?.Supplier ? (b.price || 0) : 0;
          cmp = costA - costB;
          break;
        }
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [products, searchQuery, categoryFilter, sortField, sortDir]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  // Selection helpers
  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(Array.from(prev));
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((p) => p.id)));
    }
  };

  // Individual price edit
  const startEdit = (product: Product) => {
    if (edits[product.id]) return;
    setEdits((prev) => ({
      ...prev,
      [product.id]: {
        id: product.id,
        originalPrice: product.price,
        originalSalePrice: product.salePrice ?? null,
        newPrice: product.price,
        newSalePrice: product.salePrice ?? null,
      },
    }));
  };

  const updateEdit = (id: string, field: 'newPrice' | 'newSalePrice', value: string) => {
    const num = value === '' ? null : parseFloat(value);
    setEdits((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: num },
    }));
  };

  const cancelEdit = (id: string) => {
    setEdits((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const saveEdit = async (id: string) => {
    const edit = edits[id];
    if (!edit) return;
    setSaving(true);
    try {
      const update: Record<string, unknown> = {
        price: edit.newPrice ?? edit.originalPrice,
      };
      if (edit.newSalePrice !== null && edit.newSalePrice !== undefined) {
        update.salePrice = edit.newSalePrice;
      } else {
        update.salePrice = null;
      }
      await updateDocument('products', id, update);
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                price: update.price as number,
                salePrice: update.salePrice as number | null,
              }
            : p
        )
      );
      cancelEdit(id);
      toast.success('Price updated');
    } catch {
      toast.error('Failed to update price');
    } finally {
      setSaving(false);
    }
  };

  // Bulk price operations
  const getAffectedProducts = useCallback((): Product[] => {
    switch (bulkScope) {
      case 'selected':
        return filtered.filter((p) => selected.has(p.id));
      case 'category':
        return categoryFilter
          ? products.filter((p) => p.category === categoryFilter)
          : filtered;
      case 'all':
      default:
        return filtered;
    }
  }, [bulkScope, filtered, selected, products, categoryFilter]);

  const previewBulkChanges = useCallback((): { id: string; name: string; oldPrice: number; newPrice: number }[] => {
    const affected = getAffectedProducts();
    return affected.map((p) => {
      let newPrice = p.price;
      switch (bulkAction) {
        case 'margin':
          newPrice = p.price * (1 + bulkValue / 100);
          break;
        case 'fixed':
          newPrice = p.price + bulkValue;
          break;
        case 'setprice':
          newPrice = bulkValue;
          break;
        case 'sale':
          newPrice = p.price * (1 - bulkValue / 100);
          break;
      }
      newPrice = Math.max(0, newPrice);
      newPrice = roundPrice(newPrice, bulkRounding);
      return { id: p.id, name: p.name, oldPrice: p.price, newPrice };
    });
  }, [getAffectedProducts, bulkAction, bulkValue, bulkRounding]);

  const applyBulkChanges = async () => {
    const changes = previewBulkChanges();
    if (changes.length === 0) {
      toast.error('No products to update');
      return;
    }
    if (!confirm(`Update prices for ${changes.length} products?`)) return;

    setSaving(true);
    let success = 0;
    let failed = 0;

    // Process in batches of 10
    const batchSize = 10;
    for (let i = 0; i < changes.length; i += batchSize) {
      const batch = changes.slice(i, i + batchSize);
      const promises = batch.map(async (change) => {
        try {
          const update: Record<string, unknown> = { price: change.newPrice };
          // If bulk action is 'sale', set original price as compareAtPrice and new as salePrice
          if (bulkAction === 'sale') {
            update.salePrice = change.newPrice;
            update.price = change.oldPrice;
          }
          await updateDocument('products', change.id, update);
          success++;
        } catch {
          failed++;
        }
      });
      await Promise.all(promises);
    }

    // Refresh products
    await fetchProducts();
    setSaving(false);
    setEdits({});

    if (success > 0) toast.success(`Updated ${success} products`);
    if (failed > 0) toast.error(`${failed} failed to update`);
  };

  const bulkPreview = useMemo(() => {
    if (!showBulk || bulkValue === 0) return [];
    return previewBulkChanges().slice(0, 10);
  }, [showBulk, bulkValue, previewBulkChanges]);

  const hasEdits = Object.keys(edits).length > 0;

  // Save all pending individual edits
  const saveAllEdits = async () => {
    setSaving(true);
    let success = 0;
    let failed = 0;
    const editEntries = Object.values(edits);

    for (const edit of editEntries) {
      try {
        const update: Record<string, unknown> = {
          price: edit.newPrice ?? edit.originalPrice,
        };
        if (edit.newSalePrice !== null && edit.newSalePrice !== undefined) {
          update.salePrice = edit.newSalePrice;
        } else {
          update.salePrice = null;
        }
        await updateDocument('products', edit.id, update);
        setProducts((prev) =>
          prev.map((p) =>
            p.id === edit.id
              ? {
                  ...p,
                  price: update.price as number,
                  salePrice: update.salePrice as number | null,
                }
              : p
          )
        );
        success++;
      } catch {
        failed++;
      }
    }

    setEdits({});
    setSaving(false);
    if (success > 0) toast.success(`Saved ${success} price changes`);
    if (failed > 0) toast.error(`${failed} failed to save`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Pricing Manager
          </h2>
          <p className="text-sm text-gray-500">
            {products.length} products &middot; {filtered.length} showing
            {selected.size > 0 && ` · ${selected.size} selected`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={showBulk ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setShowBulk(!showBulk)}
          >
            <Calculator className="w-4 h-4" />
            Bulk Pricing
          </Button>
          {hasEdits && (
            <>
              <Button size="sm" variant="ghost" onClick={() => setEdits({})}>
                <RotateCcw className="w-3.5 h-3.5" />
                Discard
              </Button>
              <Button size="sm" onClick={saveAllEdits} loading={saving}>
                <Save className="w-3.5 h-3.5" />
                Save All ({Object.keys(edits).length})
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Bulk Pricing Panel */}
      {showBulk && (
        <Card>
          <CardContent className="p-5">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <Calculator className="w-4 h-4" />
              Bulk Price Adjustment
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Action Type */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Action
                </label>
                <select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value as typeof bulkAction)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="margin">Increase by %</option>
                  <option value="fixed">Add fixed amount (R)</option>
                  <option value="sale">Sale discount (%)</option>
                  <option value="setprice">Set exact price (R)</option>
                </select>
              </div>

              {/* Value */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {bulkAction === 'margin'
                    ? 'Margin %'
                    : bulkAction === 'fixed'
                    ? 'Amount (R)'
                    : bulkAction === 'sale'
                    ? 'Discount %'
                    : 'Price (R)'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={bulkAction === 'setprice' ? '0' : undefined}
                    step={bulkAction === 'margin' || bulkAction === 'sale' ? '1' : '0.01'}
                    value={bulkValue || ''}
                    onChange={(e) => setBulkValue(parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    {bulkAction === 'margin' || bulkAction === 'sale' ? '%' : 'R'}
                  </span>
                </div>
              </div>

              {/* Rounding */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Round Price
                </label>
                <select
                  value={bulkRounding}
                  onChange={(e) => setBulkRounding(e.target.value as RoundingMode)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {ROUNDING_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {ROUNDING_OPTIONS.find((o) => o.value === bulkRounding)?.example}
                </p>
              </div>

              {/* Scope */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Apply To
                </label>
                <select
                  value={bulkScope}
                  onChange={(e) => setBulkScope(e.target.value as typeof bulkScope)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All filtered ({filtered.length})</option>
                  <option value="selected" disabled={selected.size === 0}>
                    Selected only ({selected.size})
                  </option>
                  {categoryFilter && (
                    <option value="category">
                      Category: {categoryFilter}
                    </option>
                  )}
                </select>
              </div>
            </div>

            {/* Preview */}
            {bulkPreview.length > 0 && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs font-medium text-gray-600 mb-2">
                  Preview ({previewBulkChanges().length} products affected):
                </p>
                <div className="space-y-1">
                  {bulkPreview.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="text-gray-700 truncate max-w-[200px]">
                        {item.name}
                      </span>
                      <span>
                        <span className="text-gray-400 line-through mr-2">
                          {formatCurrency(item.oldPrice)}
                        </span>
                        <span className="font-semibold text-green-600">
                          {formatCurrency(item.newPrice)}
                        </span>
                      </span>
                    </div>
                  ))}
                  {previewBulkChanges().length > 10 && (
                    <p className="text-[10px] text-gray-400 text-center pt-1">
                      ...and {previewBulkChanges().length - 10} more
                    </p>
                  )}
                </div>
              </div>
            )}

            <Button
              onClick={applyBulkChanges}
              disabled={bulkValue === 0 || saving}
              loading={saving}
            >
              <Percent className="w-4 h-4" />
              Apply to {getAffectedProducts().length} Products
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, SKU, or brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none bg-white min-w-[180px]"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  <th className="px-4 py-3 w-10">
                    <button onClick={toggleAll} className="text-gray-400 hover:text-gray-600">
                      {selected.size === filtered.length && filtered.length > 0 ? (
                        <CheckSquare className="w-4 h-4" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3">
                    <button
                      onClick={() => toggleSort('name')}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Product
                      {sortField === 'name' && (
                        sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3">
                    <button
                      onClick={() => toggleSort('category')}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Category
                      {sortField === 'category' && (
                        sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3">
                    <button
                      onClick={() => toggleSort('price')}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Price
                      {sortField === 'price' && (
                        sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3">Sale Price</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((product) => {
                  const edit = edits[product.id];
                  const isEditing = !!edit;
                  const isSelected = selected.has(product.id);
                  const priceChanged =
                    isEditing &&
                    (edit.newPrice !== edit.originalPrice ||
                      edit.newSalePrice !== edit.originalSalePrice);

                  return (
                    <tr
                      key={product.id}
                      className={`hover:bg-gray-50 transition-colors ${
                        isSelected ? 'bg-primary-50/50' : ''
                      } ${isEditing && priceChanged ? 'bg-yellow-50/50' : ''}`}
                    >
                      {/* Checkbox */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleSelect(product.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-primary-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Product Name */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                            {product.images?.[0] ? (
                              <img
                                src={product.images[0]}
                                alt=""
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-4 h-4 text-gray-300" />
                              </div>
                            )}
                          </div>
                          <span className="text-sm font-medium text-gray-900 truncate max-w-[180px]" title={product.name}>
                            {product.name}
                          </span>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="px-4 py-3 text-xs text-gray-500 font-mono">
                        {product.sku || '—'}
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3 text-xs text-gray-500 truncate max-w-[120px]">
                        {product.category || '—'}
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={edit.newPrice ?? ''}
                            onChange={(e) => updateEdit(product.id, 'newPrice', e.target.value)}
                            className={`w-24 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                              edit.newPrice !== edit.originalPrice
                                ? 'border-yellow-400 bg-yellow-50'
                                : 'border-gray-200'
                            }`}
                          />
                        ) : (
                          <button
                            onClick={() => startEdit(product)}
                            className="text-sm font-medium text-gray-900 hover:text-primary-600 cursor-pointer"
                            title="Click to edit"
                          >
                            {formatCurrency(product.price)}
                          </button>
                        )}
                      </td>

                      {/* Sale Price */}
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={edit.newSalePrice ?? ''}
                            onChange={(e) => updateEdit(product.id, 'newSalePrice', e.target.value)}
                            placeholder="—"
                            className={`w-24 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                              edit.newSalePrice !== edit.originalSalePrice
                                ? 'border-yellow-400 bg-yellow-50'
                                : 'border-gray-200'
                            }`}
                          />
                        ) : (
                          <button
                            onClick={() => startEdit(product)}
                            className="text-sm text-gray-500 hover:text-primary-600 cursor-pointer"
                            title="Click to edit"
                          >
                            {product.salePrice ? formatCurrency(product.salePrice) : '—'}
                          </button>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => saveEdit(product.id)}
                              disabled={!priceChanged || saving}
                              className="text-green-600 hover:bg-green-50"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => cancelEdit(product.id)}
                              className="text-gray-400 hover:bg-gray-100"
                            >
                              <X className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => startEdit(product)}
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
