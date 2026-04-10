'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { ShoppingCart, Filter, Grid, List, Package, SlidersHorizontal } from 'lucide-react';
import type { Product } from '@/types';
import toast from 'react-hot-toast';

interface CategoryClientProps {
  category: string;
  title: string;
  description: string;
  initialProducts: Product[];
}

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name' | 'popularity';

export default function CategoryClient({ category, title, description, initialProducts }: CategoryClientProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [sort, setSort] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [inStockOnly, setInStockOnly] = useState(false);

  const sorted = useMemo(() => {
    let items = [...initialProducts];

    if (inStockOnly) {
      items = items.filter((p) => (p.stock ?? 999) > 0);
    }

    items = items.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    switch (sort) {
      case 'price-asc': items.sort((a, b) => a.price - b.price); break;
      case 'price-desc': items.sort((a, b) => b.price - a.price); break;
      case 'name': items.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'popularity': items.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0)); break;
      default: items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return items;
  }, [initialProducts, sort, inStockOnly, priceRange]);

  const brands = useMemo(() =>
    Array.from(new Set(initialProducts.map((p) => p.brand).filter(Boolean))) as string[],
    [initialProducts]
  );

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

  return (
    <div className="bg-gray-50 min-h-screen">
      <Breadcrumbs items={[
        { label: 'Products', href: '/products' },
        { label: title },
      ]} />

      {/* Category Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          {description && <p className="text-gray-600 max-w-2xl">{description}</p>}
          <p className="text-sm text-gray-400 mt-2">{sorted.length} products</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name A-Z</option>
              <option value="popularity">Most Popular</option>
            </select>

            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded text-primary-600 focus:ring-primary-500"
              />
              In Stock Only
            </label>
          </div>

          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Products Grid/List */}
        {sorted.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No products found</h2>
            <p className="text-gray-500 mb-6">Try adjusting your filters</p>
            <Link href="/products" className="text-primary-600 hover:text-primary-700 font-medium">
              Browse all products
            </Link>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sorted.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
                <Link href={`/products/${product.id}`}>
                  <div className="relative h-52 bg-gray-50">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-12 h-12 text-gray-200" />
                      </div>
                    )}
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                      <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                        -{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
                      </span>
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <Link href={`/products/${product.id}`}>
                    <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 text-sm mb-2 leading-tight">
                      {product.name}
                    </h3>
                  </Link>
                  {product.brand && (
                    <p className="text-xs text-gray-400 mb-2">{product.brand}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-gray-900">{formatCurrency(product.price)}</span>
                      {product.compareAtPrice && product.compareAtPrice > product.price && (
                        <span className="text-xs text-gray-400 line-through ml-2">
                          {formatCurrency(product.compareAtPrice)}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={(product.stock ?? 999) <= 0}
                      className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sorted.map((product) => (
              <div key={product.id} className="bg-white rounded-xl border border-gray-100 p-4 flex gap-4 hover:shadow-md transition-shadow">
                <Link href={`/products/${product.id}`} className="relative w-32 h-32 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                  {product.images?.[0] ? (
                    <Image src={product.images[0]} alt={product.name} fill className="object-contain p-2" sizes="128px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><Package className="w-8 h-8 text-gray-200" /></div>
                  )}
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${product.id}`}>
                    <h3 className="font-medium text-gray-900 hover:text-primary-600 transition-colors mb-1">{product.name}</h3>
                  </Link>
                  {product.brand && <p className="text-xs text-gray-400 mb-2">{product.brand}</p>}
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">{product.shortDescription || product.description?.substring(0, 150)}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">{formatCurrency(product.price)}</span>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={(product.stock ?? 999) <= 0}
                      className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 disabled:opacity-50 transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
