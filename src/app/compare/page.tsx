'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Badge } from '@/components/ui';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { useCompareStore } from '@/store/compareStore';
import { useCartStore } from '@/store/cartStore';
import { formatCurrency } from '@/lib/utils';
import { X, ShoppingCart, Package, Star, GitCompareArrows } from 'lucide-react';
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
    <div className="bg-gray-50 min-h-screen">
      <Breadcrumbs items={[{ label: 'Compare Products' }]} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Compare Products</h1>
            <p className="text-gray-500 mt-1">Compare up to 4 products side by side</p>
          </div>
          {items.length > 0 && (
            <Button variant="outline" onClick={clearAll}>Clear All</Button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <GitCompareArrows className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No products to compare</h2>
            <p className="text-gray-500 mb-6">Browse products and add them to comparison to see specs side by side.</p>
            <Link href="/products"><Button>Browse Products</Button></Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl shadow-sm border border-gray-100">
              {/* Product Images & Names */}
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="p-4 text-left text-sm font-medium text-gray-500 w-40">Product</th>
                  {items.map((item) => (
                    <th key={item.productId} className="p-4 text-center min-w-[200px]">
                      <div className="relative">
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="absolute -top-1 -right-1 p-1 bg-red-100 rounded-full hover:bg-red-200 transition-colors"
                        >
                          <X className="w-3 h-3 text-red-600" />
                        </button>
                        <Link href={`/products/${item.productId}`}>
                          <div className="relative w-32 h-32 mx-auto bg-gray-50 rounded-xl overflow-hidden mb-3">
                            {item.image ? (
                              <Image src={item.image} alt={item.name} fill className="object-contain p-2" sizes="128px" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-8 h-8 text-gray-300" />
                              </div>
                            )}
                          </div>
                          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 hover:text-primary-600 transition-colors">
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
                <tr className="border-b border-gray-50">
                  <td className="p-4 text-sm font-medium text-gray-500">Price</td>
                  {items.map((item) => (
                    <td key={item.productId} className="p-4 text-center">
                      <span className="text-lg font-bold text-gray-900">{formatCurrency(item.price)}</span>
                    </td>
                  ))}
                </tr>
                {/* Category */}
                <tr className="border-b border-gray-50 bg-gray-50/50">
                  <td className="p-4 text-sm font-medium text-gray-500">Category</td>
                  {items.map((item) => (
                    <td key={item.productId} className="p-4 text-center">
                      <Badge>{item.category}</Badge>
                    </td>
                  ))}
                </tr>
                {/* Brand */}
                <tr className="border-b border-gray-50">
                  <td className="p-4 text-sm font-medium text-gray-500">Brand</td>
                  {items.map((item) => (
                    <td key={item.productId} className="p-4 text-center text-sm text-gray-700">
                      {item.brand || '—'}
                    </td>
                  ))}
                </tr>
                {/* Rating */}
                <tr className="border-b border-gray-50 bg-gray-50/50">
                  <td className="p-4 text-sm font-medium text-gray-500">Rating</td>
                  {items.map((item) => (
                    <td key={item.productId} className="p-4 text-center">
                      {item.rating > 0 ? (
                        <div className="flex items-center justify-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{item.rating.toFixed(1)}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">No ratings</span>
                      )}
                    </td>
                  ))}
                </tr>
                {/* Stock */}
                <tr className="border-b border-gray-50">
                  <td className="p-4 text-sm font-medium text-gray-500">Availability</td>
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
                  <tr key={key} className={`border-b border-gray-50 ${idx % 2 === 0 ? 'bg-gray-50/50' : ''}`}>
                    <td className="p-4 text-sm font-medium text-gray-500">{key}</td>
                    {items.map((item) => (
                      <td key={item.productId} className="p-4 text-center text-sm text-gray-700">
                        {item.specifications?.[key] || '—'}
                      </td>
                    ))}
                  </tr>
                ))}
                {/* Add to Cart */}
                <tr>
                  <td className="p-4"></td>
                  {items.map((item) => (
                    <td key={item.productId} className="p-4 text-center">
                      <Button size="sm" onClick={() => handleAddToCart(item)} disabled={(item.stock || 999) <= 0}>
                        <ShoppingCart className="w-4 h-4" /> Add to Cart
                      </Button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
