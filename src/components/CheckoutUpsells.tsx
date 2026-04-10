'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { getCollection, where } from '@/lib/firebase';
import { formatCurrency } from '@/lib/utils';
import { ShoppingCart, Plus, Sparkles, Package } from 'lucide-react';
import type { Product } from '@/types';
import type { QueryConstraint } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function CheckoutUpsells() {
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const [upsells, setUpsells] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUpsells = async () => {
      if (items.length === 0) {
        setLoading(false);
        return;
      }

      try {
        // Get categories from cart items — fetch related products
        const categories = Array.from(new Set(
          items.map((i) => i.productId).filter(Boolean)
        ));

        const allProducts = await getCollection('products');
        const products = allProducts as unknown as Product[];

        // Get cart product IDs to exclude
        const cartIds = new Set(items.map((i) => i.productId));

        // Find products in similar categories or price range, not in cart
        const cartCategories = new Set<string>();
        const avgPrice = items.reduce((t, i) => t + i.price, 0) / items.length;

        for (const p of products) {
          if (cartIds.has(p.id)) {
            cartCategories.add(p.category);
          }
        }

        const suggestions = products
          .filter((p) =>
            !cartIds.has(p.id) &&
            p.isActive !== false &&
            (p as any).active !== false &&
            (p.stock ?? 999) > 0 &&
            (cartCategories.has(p.category) || (p.price < avgPrice * 0.5))
          )
          .sort(() => Math.random() - 0.5)
          .slice(0, 4);

        setUpsells(suggestions);
      } catch {
        // Silently fail
      } finally {
        setLoading(false);
      }
    };

    loadUpsells();
  }, [items.length]);

  const handleAdd = (product: Product) => {
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

  if (loading || upsells.length === 0) return null;

  return (
    <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl border border-primary-100">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-primary-600" />
        <h3 className="font-semibold text-gray-900">You might also like</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {upsells.map((product) => (
          <div key={product.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden group">
            <div className="relative h-24 bg-gray-50">
              {product.images?.[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-gray-300" />
                </div>
              )}
            </div>
            <div className="p-2">
              <h4 className="text-xs font-medium text-gray-900 line-clamp-2 mb-1 leading-tight">
                {product.name}
              </h4>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-900">
                  {formatCurrency(product.price)}
                </span>
                <button
                  onClick={() => handleAdd(product)}
                  className="p-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  title="Add to cart"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
