'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui';
import { ShoppingCart, Package, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Product } from '@/types';

interface ProductRecommendationsProps {
  products: Product[];
  title?: string;
  variant?: 'default' | 'compact';
}

export default function ProductRecommendations({
  products,
  title = 'Recommended for You',
  variant = 'default',
}: ProductRecommendationsProps) {
  const addItem = useCartStore((s) => s.addItem);

  if (products.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-yellow-500" />
        {title}
      </h2>
      <div className={`grid gap-4 ${variant === 'compact' ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'}`}>
        {products.map((product) => (
          <div key={product.id} className="group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
            <Link href={`/products/${product.id}`}>
              <div className="relative h-40 bg-gray-100">
                {product.images?.[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-10 h-10 text-gray-300" />
                  </div>
                )}
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    -{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
                  </span>
                )}
              </div>
            </Link>
            <div className="p-3">
              <Link href={`/products/${product.id}`}>
                <h3 className="text-sm font-medium text-gray-900 group-hover:text-primary-600 line-clamp-2 mb-2">
                  {product.name}
                </h3>
              </Link>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-base font-bold text-gray-900">{formatCurrency(product.price)}</span>
                  {product.compareAtPrice && product.compareAtPrice > product.price && (
                    <span className="text-xs text-gray-400 line-through ml-1.5">
                      {formatCurrency(product.compareAtPrice)}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    addItem({
                      productId: product.id,
                      name: product.name,
                      image: product.images?.[0] || '',
                      price: product.price,
                      quantity: 1,
                      stock: product.stock ?? 999,
                      sku: product.sku || '',
                    });
                    toast.success('Added to cart');
                  }}
                  className="p-2 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
                  title="Add to Cart"
                >
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
