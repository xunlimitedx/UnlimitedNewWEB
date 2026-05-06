'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Input, Badge, Skeleton } from '@/components/ui';
import { QuickView } from '@/components/ui';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCompareStore } from '@/store/compareStore';
import { getCollection, where, orderBy, limit } from '@/lib/firebase';
import { formatCurrency, CATEGORIES } from '@/lib/utils';
import {
  Search,
  SlidersHorizontal,
  Grid3X3,
  List,
  Star,
  ShoppingCart,
  X,
  ChevronDown,
  Package,
  Heart,
  Eye,
  GitCompare,
} from 'lucide-react';
import type { Product } from '@/types';
import type { QueryConstraint } from 'firebase/firestore';
import toast from 'react-hot-toast';

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name' | 'rating';
type ViewMode = 'grid' | 'list';

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 p-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-72" />
            ))}
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [visibleCount, setVisibleCount] = useState(20);
  const addItem = useCartStore((s) => s.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const { addItem: addToCompare, isInCompare } = useCompareStore();

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const constraints: QueryConstraint[] = [];

      if (selectedCategory) {
        constraints.push(where('category', '==', selectedCategory));
      }

      const data = await getCollection('products', constraints);
      // Filter active products client-side to handle both isActive and active field names
      let result = (data as unknown as Product[]).filter(
        (p) => p.isActive !== false && p.active !== false
      );

      // Client-side search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        result = result.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q) ||
            p.brand?.toLowerCase().includes(q)
        );
      }

      // Price filter
      if (priceRange.min) {
        result = result.filter((p) => p.price >= Number(priceRange.min));
      }
      if (priceRange.max) {
        result = result.filter((p) => p.price <= Number(priceRange.max));
      }

      // Sort
      switch (sortBy) {
        case 'price-asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'name':
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'rating':
          result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case 'newest':
        default:
          result.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }

      setProducts(result);
      setVisibleCount(20);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery, sortBy, priceRange.min, priceRange.max]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    setSearchQuery(searchParam);
  }, [searchParam]);

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      name: product.name,
      image: product.images?.[0] || '',
      price: product.price,
      quantity: 1,
      stock: product.stock ?? 999,
      sku: product.sku || '',
    });
    toast.success(`${product.name} added to cart`);
  };

  const handleToggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist({
        productId: product.id,
        name: product.name,
        image: product.images?.[0] || '',
        price: product.price,
      });
      toast.success('Added to wishlist');
    }
  };

  const handleAddToCompare = (product: Product) => {
    addToCompare({
      productId: product.id,
      name: product.name,
      image: product.images?.[0] || '',
      price: product.price,
      category: product.category || '',
      brand: product.brand || '',
      specifications: product.specifications || {},
      rating: product.rating || 0,
      stock: product.stock ?? 0,
    });
    toast.success('Added to comparison');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="relative isolate overflow-hidden bg-aurora text-white border-b border-slate-900">
        <div className="absolute inset-0 animate-aurora opacity-90 pointer-events-none" />
        <div className="absolute inset-0 bg-grid pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-blue-500/25 blur-3xl animate-orb pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <span className="eyebrow-chip mb-4">
            {searchQuery ? 'Search results' : selectedCategory ? 'Category' : 'Catalogue'}
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
            {selectedCategory
              ? CATEGORIES.find((c) => c.slug === selectedCategory)?.name || 'Products'
              : searchQuery
              ? <>Results for <span className="text-gradient-premium">&ldquo;{searchQuery}&rdquo;</span></>
              : <>Every part. <span className="text-gradient-premium">Hand-picked.</span></>}
          </h1>
          <p className="text-slate-300 max-w-2xl">
            {loading ? 'Loading…' : `${products.length} ${products.length === 1 ? 'product' : 'products'} ready to ship from our Ramsgate workshop.`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside
            className={`lg:w-64 flex-shrink-0 ${
              showFilters ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setSearchQuery('');
                    setPriceRange({ min: '', max: '' });
                  }}
                  className="text-xs text-primary-600 hover:text-primary-700"
                >
                  Clear All
                </button>
              </div>

              {/* Search */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Category
                </label>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      !selectedCategory
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    All Categories
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === cat.slug
                          ? 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Price Range (ZAR)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) =>
                      setPriceRange({ ...priceRange, min: e.target.value })
                    }
                    className="w-full h-9 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange({ ...priceRange, max: e.target.value })
                    }
                    className="w-full h-9 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>

              <div className="flex items-center gap-3 ml-auto">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="h-9 px-3 pr-8 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name">Name: A-Z</option>
                  <option value="rating">Highest Rated</option>
                </select>
                <div className="hidden sm:flex border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${
                      viewMode === 'grid'
                        ? 'bg-primary-50 text-primary-600'
                        : 'bg-white text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${
                      viewMode === 'list'
                        ? 'bg-primary-50 text-primary-600'
                        : 'bg-white text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedCategory || searchQuery) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedCategory && (
                  <Badge variant="info" className="flex items-center gap-1 pr-1">
                    {CATEGORIES.find((c) => c.slug === selectedCategory)?.name}
                    <button
                      onClick={() => setSelectedCategory('')}
                      className="ml-1 p-0.5 hover:bg-blue-200 rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {searchQuery && (
                  <Badge variant="info" className="flex items-center gap-1 pr-1">
                    Search: {searchQuery}
                    <button
                      onClick={() => setSearchQuery('')}
                      className="ml-1 p-0.5 hover:bg-blue-200 rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}

            {/* Products Grid */}
            {loading ? (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                    <Skeleton className="w-full h-56 rounded-none" />
                    <div className="p-5 space-y-3">
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-6 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Package className="w-16 h-16 text-gray-200 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  No products found
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Try adjusting your filters or search query.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory('');
                    setSearchQuery('');
                    setPriceRange({ min: '', max: '' });
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.slice(0, visibleCount).map((product) => (
                  <div
                    key={product.id}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <Link href={`/products/${product.id}`}>
                      <div className="relative h-56 bg-gray-100 overflow-hidden">
                        {product.images?.[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-12 h-12 text-gray-300" />
                          </div>
                        )}
                        {product.compareAtPrice && product.compareAtPrice > product.price && (
                          <Badge variant="danger" className="absolute top-3 left-3">
                            -{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
                          </Badge>
                        )}
                        {product.featured && (
                          <Badge variant="warning" className="absolute top-3 right-3">
                            Featured
                          </Badge>
                        )}
                        {/* Hover action buttons */}
                        <div className="absolute top-3 right-3 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => { e.preventDefault(); handleToggleWishlist(product); }}
                            className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-colors ${
                              isInWishlist(product.id) ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'
                            }`}
                            title="Add to Wishlist"
                          >
                            <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                          </button>
                          <button
                            onClick={(e) => { e.preventDefault(); setQuickViewProduct(product); }}
                            className="w-8 h-8 rounded-full bg-white text-gray-600 hover:bg-primary-50 hover:text-primary-600 flex items-center justify-center shadow-md transition-colors"
                            title="Quick View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => { e.preventDefault(); handleAddToCompare(product); }}
                            className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-colors ${
                              isInCompare(product.id) ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 hover:bg-primary-50 hover:text-primary-600'
                            }`}
                            title="Compare"
                          >
                            <GitCompare className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </Link>
                    <div className="p-5">
                      <div className="flex items-center gap-1 mb-2">
                        <Badge variant="default" className="text-xs">{product.category}</Badge>
                        {product.brand && (
                          <span className="text-xs text-gray-400">{product.brand}</span>
                        )}
                      </div>
                      <Link href={`/products/${product.id}`}>
                        <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">
                          {product.name}
                        </h3>
                      </Link>
                      {(product.rating ?? 0) > 0 && (
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium text-gray-700">
                            {(product.rating ?? 0).toFixed(1)}
                          </span>
                          <span className="text-xs text-gray-400">
                            ({product.reviewCount ?? 0})
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-3">
                        <div>
                          <span className="text-xl font-bold text-gray-900">
                            {formatCurrency(product.price)}
                          </span>
                          {product.compareAtPrice && product.compareAtPrice > product.price && (
                            <span className="text-sm text-gray-400 line-through ml-2">
                              {formatCurrency(product.compareAtPrice)}
                            </span>
                          )}
                        </div>
                        <Button
                          size="icon"
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart(product);
                          }}
                          disabled={(product.stock ?? 999) <= 0}
                          aria-label="Add to cart"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </Button>
                      </div>
                      {(product.stock ?? 999) <= 0 && (
                        <p className="text-xs text-red-500 mt-1">Out of stock</p>
                      )}
                      {(product.stock ?? 999) > 0 && (product.stock ?? 999) <= 5 && (
                        <p className="text-xs text-orange-500 mt-1">
                          Only {product.stock} left
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {products.slice(0, visibleCount).map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex"
                  >
                    <Link
                      href={`/products/${product.id}`}
                      className="relative w-48 h-48 flex-shrink-0 bg-gray-100"
                    >
                      {product.images?.[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="192px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-10 h-10 text-gray-300" />
                        </div>
                      )}
                    </Link>
                    <div className="flex-1 p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge>{product.category}</Badge>
                          {product.brand && (
                            <span className="text-xs text-gray-400">{product.brand}</span>
                          )}
                        </div>
                        <Link href={`/products/${product.id}`}>
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors mb-1">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {product.shortDescription || product.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div>
                          <span className="text-xl font-bold text-gray-900">
                            {formatCurrency(product.price)}
                          </span>
                          {product.compareAtPrice && product.compareAtPrice > product.price && (
                            <span className="text-sm text-gray-400 line-through ml-2">
                              {formatCurrency(product.compareAtPrice)}
                            </span>
                          )}
                        </div>
                        <Button
                          onClick={() => handleAddToCart(product)}
                          disabled={(product.stock ?? 999) <= 0}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Load More */}
            {!loading && products.length > visibleCount && (
              <div className="text-center mt-10">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setVisibleCount((prev) => prev + 20)}
                >
                  Load More ({products.length - visibleCount} remaining)
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <QuickView
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}
