'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import Fuse from 'fuse.js';
import { getCollection } from '@/lib/firebase';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { Button } from '@/components/ui';
import type { Product } from '@/types';
import toast from 'react-hot-toast';
import {
  Search, SlidersHorizontal, X, ShoppingCart, Heart, Star,
  Package, ChevronDown, Grid3X3, List, ArrowUpDown,
} from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'name', label: 'Name A-Z' },
];

export default function SearchClient() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);

  const addToCart = useCartStore((s) => s.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getCollection('products');
        const active = (data as unknown as Product[]).filter(
          (p) => p.isActive !== false && p.active !== false
        );
        setProducts(active);
      } catch {
        console.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const fuse = useMemo(
    () =>
      new Fuse(products, {
        keys: [
          { name: 'name', weight: 0.4 },
          { name: 'description', weight: 0.2 },
          { name: 'brand', weight: 0.2 },
          { name: 'category', weight: 0.1 },
          { name: 'tags', weight: 0.1 },
        ],
        threshold: 0.4,
        includeScore: true,
      }),
    [products]
  );

  const categories = useMemo(() => Array.from(new Set(products.map((p) => p.category).filter(Boolean))), [products]);
  const brands = useMemo(() => Array.from(new Set(products.map((p) => p.brand).filter(Boolean))) as string[], [products]);

  const results = useMemo(() => {
    let filtered: Product[];

    if (query.trim()) {
      filtered = fuse.search(query).map((r) => r.item);
    } else {
      filtered = [...products];
    }

    // Apply filters
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) => selectedCategories.includes(p.category));
    }
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((p) => p.brand && selectedBrands.includes(p.brand));
    }
    if (inStockOnly) {
      filtered = filtered.filter((p) => (p.stock ?? 999) > 0);
    }
    if (minRating > 0) {
      filtered = filtered.filter((p) => (p.rating ?? 0) >= minRating);
    }
    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Sort
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return filtered;
  }, [query, products, fuse, sortBy, selectedCategories, selectedBrands, inStockOnly, minRating, priceRange]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setInStockOnly(false);
    setMinRating(0);
    setPriceRange([0, 100000]);
  };

  const activeFilterCount =
    selectedCategories.length + selectedBrands.length + (inStockOnly ? 1 : 0) + (minRating > 0 ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, brands, categories..."
                className="w-full h-12 pl-11 pr-10 rounded-xl border border-gray-300 bg-gray-50 text-base focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white transition-all"
                autoFocus
              />
              {query && (
                <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                showFilters ? 'bg-primary-50 border-primary-200 text-primary-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-primary-600 text-white text-xs px-1.5 py-0.5 rounded-full">{activeFilterCount}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-64 flex-shrink-0">
              <div className="bg-white rounded-xl border p-4 sticky top-32 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Filters</h3>
                  {activeFilterCount > 0 && (
                    <button onClick={clearFilters} className="text-xs text-primary-600 hover:underline">
                      Clear all
                    </button>
                  )}
                </div>

                {/* Category Filter */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Category</h4>
                  <div className="space-y-1.5">
                    {categories.map((cat) => (
                      <label key={cat} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat)}
                          onChange={() => toggleCategory(cat)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="capitalize">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Brand Filter */}
                {brands.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Brand</h4>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto">
                      {brands.map((brand) => (
                        <label key={brand} className="flex items-center gap-2 text-sm cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedBrands.includes(brand)}
                            onChange={() => toggleBrand(brand)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span>{brand}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price Range */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Price Range</h4>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                      className="w-full h-9 px-2 text-sm border rounded-lg"
                      placeholder="Min"
                      min={0}
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                      className="w-full h-9 px-2 text-sm border rounded-lg"
                      placeholder="Max"
                      min={0}
                    />
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Minimum Rating</h4>
                  <div className="space-y-1">
                    {[4, 3, 2, 1].map((r) => (
                      <button
                        key={r}
                        onClick={() => setMinRating(minRating === r ? 0 : r)}
                        className={`flex items-center gap-1 w-full px-2 py-1 rounded text-sm ${
                          minRating === r ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'
                        }`}
                      >
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < r ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                        ))}
                        <span className="ml-1">& Up</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* In Stock */}
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>
            </div>
          )}

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                {loading ? 'Searching...' : `${results.length} result${results.length !== 1 ? 's' : ''}`}
                {query && !loading && <span className="font-medium"> for &quot;{query}&quot;</span>}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 border rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-9 px-3 text-sm border rounded-lg bg-white"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Product Grid/List */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border p-4 animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-lg mb-4" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-16">
                <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">
                  {query ? `We couldn't find anything matching "${query}"` : 'Try adjusting your filters'}
                </p>
                <div className="flex gap-3 justify-center">
                  {query && <Button onClick={() => setQuery('')} variant="outline">Clear Search</Button>}
                  {activeFilterCount > 0 && <Button onClick={clearFilters} variant="outline">Clear Filters</Button>}
                  <Link href="/products"><Button>Browse All Products</Button></Link>
                </div>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((product) => (
                  <SearchProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {results.map((product) => (
                  <SearchProductListItem key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const wishlisted = isInWishlist(product.id);
  const discount = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) : 0;

  return (
    <div className="group bg-white rounded-xl border hover:shadow-lg transition-all overflow-hidden">
      <Link href={`/products/${product.id}`}>
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          {product.images?.[0] ? (
            <Image src={product.images[0]} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, 33vw" />
          ) : (
            <div className="w-full h-full flex items-center justify-center"><Package className="w-10 h-10 text-gray-300" /></div>
          )}
          {discount > 0 && <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">-{discount}%</span>}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); wishlisted ? removeFromWishlist(product.id) : addToWishlist({ productId: product.id, name: product.name, image: product.images?.[0] || '', price: product.price }); }}
            className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition ${wishlisted ? 'bg-red-500 text-white' : 'bg-white text-gray-600 opacity-0 group-hover:opacity-100'}`}
          >
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-medium text-gray-900 line-clamp-2 text-sm group-hover:text-primary-600 transition-colors">{product.name}</h3>
        </Link>
        {product.rating && product.rating > 0 && (
          <div className="flex items-center gap-1 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < Math.round(product.rating!) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
            ))}
            <span className="text-xs text-gray-400 ml-0.5">({product.reviewCount || 0})</span>
          </div>
        )}
        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-lg font-bold text-gray-900">{formatCurrency(product.price)}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs text-gray-400 line-through ml-1.5">{formatCurrency(product.compareAtPrice)}</span>
            )}
          </div>
          <button
            onClick={() => {
              addItem({ productId: product.id, name: product.name, image: product.images?.[0] || '', price: product.price, quantity: 1, stock: product.stock ?? 999, sku: product.sku || '' });
              toast.success('Added to cart');
            }}
            disabled={(product.stock ?? 999) <= 0}
            className="w-9 h-9 bg-primary-600 text-white rounded-lg flex items-center justify-center hover:bg-primary-700 transition disabled:opacity-50"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function SearchProductListItem({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const discount = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) : 0;

  return (
    <div className="bg-white rounded-xl border hover:shadow-md transition-all flex overflow-hidden">
      <Link href={`/products/${product.id}`} className="flex-shrink-0">
        <div className="relative w-36 h-36 bg-gray-100">
          {product.images?.[0] ? (
            <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="144px" />
          ) : (
            <div className="w-full h-full flex items-center justify-center"><Package className="w-8 h-8 text-gray-300" /></div>
          )}
          {discount > 0 && <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">-{discount}%</span>}
        </div>
      </Link>
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <Link href={`/products/${product.id}`}>
            <h3 className="font-medium text-gray-900 hover:text-primary-600 transition-colors">{product.name}</h3>
          </Link>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.shortDescription || product.description}</p>
          {product.brand && <span className="text-xs text-gray-400 mt-1 inline-block">{product.brand}</span>}
        </div>
        <div className="flex items-center justify-between mt-2">
          <div>
            <span className="text-lg font-bold text-gray-900">{formatCurrency(product.price)}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs text-gray-400 line-through ml-2">{formatCurrency(product.compareAtPrice)}</span>
            )}
          </div>
          <Button
            size="sm"
            onClick={() => {
              addItem({ productId: product.id, name: product.name, image: product.images?.[0] || '', price: product.price, quantity: 1, stock: product.stock ?? 999, sku: product.sku || '' });
              toast.success('Added to cart');
            }}
            disabled={(product.stock ?? 999) <= 0}
          >
            <ShoppingCart className="w-4 h-4" /> Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
