'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Badge } from '@/components/ui';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { useCompareStore } from '@/store/compareStore';
import { useCartStore } from '@/store/cartStore';
import { formatCurrency } from '@/lib/utils';
import { X, ShoppingCart, Package, Star, GitCompareArrows, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ComparePage() {
  const { items, removeItem, clearAll } = useCompareStore();
  const addToCart = useCartStore((s) => s.addItem);

  // Collect all unique specification keys
  const allSpecKeys = Array.from(
    new Set(items.flatMap((item) => Object.keys(item.specifications || {})))
  ).sort();

  const handleAddToCart = (item: typeof items[0]) => {
    addToCart({
      productId: item.productId,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: 1,
      stock: item.stock || 999,
      sku: '',
    });
    toast.success(`${item.name} added to cart`);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      <Breadcrumbs items={[{ label: 'Compare Products' }]} />

      {/* Aurora hero */}
      <section className="relative isolate overflow-hidden bg-aurora text-white">
        <div className="absolute inset-0 animate-aurora opacity-90 pointer-events-none" />
        <div className="absolute inset-0 bg-grid pointer-events-none" />
        <div className="absolute -top-32 left-1/3 w-[26rem] h-[26rem] rounded-full bg-violet-500/25 blur-3xl animate-orb pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <span className="eyebrow-chip"><GitCompareArrows className="w-3.5 h-3.5" /> Side by side</span>
              <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.05]">
                Compare and <span className="text-gradient-premium">decide.</span>
              </h1>
              <p className="mt-3 text-slate-300/90 max-w-xl">
                Stack up to four products on one screen and see exactly what sets them apart.
              </p>
            </div>
            {items.length > 0 && (
              <Button variant="outline" onClick={clearAll} className="!border-white/20 !text-white hover:!bg-white/10">Clear all</Button>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {items.length === 0 ? (
          <div className="card-premium text-center py-20 px-6 max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 ring-1 ring-violet-500/20 mb-5">
              <GitCompareArrows className="w-7 h-7 text-violet-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">No products to compare</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Browse the catalogue and add items to comparison to see specs side by side.</p>
            <Link href="/products"><Button className="btn-premium"><Sparkles className="w-4 h-4" /> Browse products</Button></Link>
          </div>
        ) : (
          <div className="card-premium overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
              {/* Product Images & Names */}
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-primary-50/50 via-blue-50/30 to-transparent dark:from-primary-900/20 dark:via-blue-900/10">
                  <th className="p-5 text-left text-xs font-bold tracking-[0.18em] uppercase text-gray-500 dark:text-gray-400 w-44">Product</th>
                  {items.map((item) => (
                    <th key={item.productId} className="p-5 text-center min-w-[220px]">
                      <div className="relative">
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="absolute -top-2 -right-2 z-10 p-1.5 bg-white dark:bg-gray-800 rounded-full shadow-md ring-1 ring-red-500/20 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                          aria-label="Remove from comparison"
                        >
                          <X className="w-3.5 h-3.5 text-red-600" />
                        </button>
                        <Link href={`/products/${item.productId}`}>
                          <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden mb-3 ring-1 ring-gray-200/60 dark:ring-gray-700/60">
                            {item.image ? (
                              <Image src={item.image} alt={item.name} fill className="object-contain p-3" sizes="128px" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-8 h-8 text-gray-300" />
                              </div>
                            )}
                          </div>
                          <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors tracking-tight">
                            {item.name}
                          </h3>
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Price */}
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="p-4 text-xs font-bold tracking-[0.18em] uppercase text-gray-500 dark:text-gray-400">Price</td>
                  {items.map((item) => (
                    <td key={item.productId} className="p-4 text-center">
                      <span className="text-xl font-extrabold text-gradient-premium">{formatCurrency(item.price)}</span>
                    </td>
                  ))}
                </tr>
                {/* Category */}
                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/40">
                  <td className="p-4 text-xs font-bold tracking-[0.18em] uppercase text-gray-500 dark:text-gray-400">Category</td>
                  {items.map((item) => (
                    <td key={item.productId} className="p-4 text-center">
                      <Badge>{item.category}</Badge>
                    </td>
                  ))}
                </tr>
                {/* Brand */}
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="p-4 text-xs font-bold tracking-[0.18em] uppercase text-gray-500 dark:text-gray-400">Brand</td>
                  {items.map((item) => (
                    <td key={item.productId} className="p-4 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                      {item.brand || '—'}
                    </td>
                  ))}
                </tr>
                {/* Rating */}
                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/40">
                  <td className="p-4 text-xs font-bold tracking-[0.18em] uppercase text-gray-500 dark:text-gray-400">Rating</td>
                  {items.map((item) => (
                    <td key={item.productId} className="p-4 text-center">
                      {item.rating > 0 ? (
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-yellow-50 dark:bg-yellow-900/20 px-2.5 py-1 ring-1 ring-yellow-500/20">
                          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-bold text-yellow-700 dark:text-yellow-300">{item.rating.toFixed(1)}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">No ratings</span>
                      )}
                    </td>
                  ))}
                </tr>
                {/* Stock */}
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="p-4 text-xs font-bold tracking-[0.18em] uppercase text-gray-500 dark:text-gray-400">Availability</td>
                  {items.map((item) => (
                    <td key={item.productId} className="p-4 text-center">
                      {(item.stock || 999) > 0 ? (
                        <Badge variant="success">In Stock</Badge>
                      ) : (
                        <Badge variant="danger">Out of Stock</Badge>
                      )}
                    </td>
                  ))}
                </tr>
                {/* Specifications */}
                {allSpecKeys.map((key, idx) => (
                  <tr key={key} className={`border-b border-gray-100 dark:border-gray-800 ${idx % 2 === 0 ? 'bg-gray-50/60 dark:bg-gray-900/40' : ''}`}>
                    <td className="p-4 text-xs font-bold tracking-[0.18em] uppercase text-gray-500 dark:text-gray-400">{key}</td>
                    {items.map((item) => (
                      <td key={item.productId} className="p-4 text-center text-sm text-gray-700 dark:text-gray-300">
                        {item.specifications?.[key] || '—'}
                      </td>
                    ))}
                  </tr>
                ))}
                {/* Add to Cart */}
                <tr className="bg-gradient-to-r from-primary-50/50 via-blue-50/30 to-transparent dark:from-primary-900/20 dark:via-blue-900/10">
                  <td className="p-5"></td>
                  {items.map((item) => (
                    <td key={item.productId} className="p-5 text-center">
                      <Button size="sm" onClick={() => handleAddToCart(item)} disabled={(item.stock || 999) <= 0} className="w-full">
                        <ShoppingCart className="w-4 h-4" /> Add to cart
                      </Button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
