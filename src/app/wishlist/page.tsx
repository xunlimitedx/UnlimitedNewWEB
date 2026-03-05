'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Badge } from '@/components/ui';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { formatCurrency } from '@/lib/utils';
import { Heart, ShoppingCart, Trash2, Package } from 'lucide-react';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const addToCart = useCartStore((s) => s.addItem);

  const handleAddToCart = (item: typeof items[0]) => {
    addToCart({
      productId: item.productId,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: 1,
      stock: 999,
      sku: '',
    });
    toast.success(`${item.name} added to cart`);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Breadcrumbs items={[{ label: 'Wishlist' }]} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-500 mt-1">{items.length} item{items.length !== 1 ? 's' : ''} saved</p>
          </div>
          {items.length > 0 && (
            <Button variant="outline" onClick={clearWishlist}>
              Clear All
            </Button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-6">Save items you love to your wishlist and come back to them later.</p>
            <Link href="/products">
              <Button>Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item.productId}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
              >
                <Link href={`/products/${item.productId}`}>
                  <div className="relative h-56 bg-gray-100 overflow-hidden">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-5">
                  <Link href={`/products/${item.productId}`}>
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">
                      {item.name}
                    </h3>
                  </Link>
                  <span className="text-xl font-bold text-gray-900">{formatCurrency(item.price)}</span>
                  <div className="flex items-center gap-2 mt-4">
                    <Button size="sm" className="flex-1" onClick={() => handleAddToCart(item)}>
                      <ShoppingCart className="w-4 h-4" /> Add to Cart
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => {
                        removeItem(item.productId);
                        toast.success('Removed from wishlist');
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
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
