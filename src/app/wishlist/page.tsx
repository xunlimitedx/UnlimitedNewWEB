'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Badge } from '@/components/ui';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { formatCurrency } from '@/lib/utils';
import { Heart, ShoppingCart, Trash2, Package, Sparkles } from 'lucide-react';
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
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      <Breadcrumbs items={[{ label: 'Wishlist' }]} />

      {/* Aurora hero */}
      <section className="relative isolate overflow-hidden bg-aurora text-white">
        <div className="absolute inset-0 animate-aurora opacity-90 pointer-events-none" />
        <div className="absolute inset-0 bg-grid pointer-events-none" />
        <div className="absolute -top-32 right-1/4 w-[26rem] h-[26rem] rounded-full bg-pink-500/25 blur-3xl animate-orb pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <span className="eyebrow-chip"><Heart className="w-3.5 h-3.5" /> Saved for later</span>
              <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.05]">
                Your <span className="text-gradient-premium">wishlist.</span>
              </h1>
              <p className="mt-3 text-slate-300/90">
                {items.length} item{items.length !== 1 ? 's' : ''} saved — ready when you are.
              </p>
            </div>
            {items.length > 0 && (
              <Button variant="outline" onClick={clearWishlist} className="!border-white/20 !text-white hover:!bg-white/10">
                Clear all
              </Button>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {items.length === 0 ? (
          <div className="card-premium text-center py-20 px-6 max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500/10 to-rose-500/10 ring-1 ring-pink-500/20 mb-5">
              <Heart className="w-7 h-7 text-pink-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">Your wishlist is empty</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Save items you love and come back to them anytime.</p>
            <Link href="/products">
              <Button className="btn-premium"><Sparkles className="w-4 h-4" /> Browse products</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item.productId}
                className="group card-premium overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <Link href={`/products/${item.productId}`} className="block">
                  <div className="relative h-56 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
                <div className="p-5 flex-1 flex flex-col">
                  <Link href={`/products/${item.productId}`}>
                    <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 mb-2 tracking-tight">
                      {item.name}
                    </h3>
                  </Link>
                  <span className="text-xl font-extrabold text-gradient-premium">{formatCurrency(item.price)}</span>
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <Button size="sm" className="flex-1" onClick={() => handleAddToCart(item)}>
                      <ShoppingCart className="w-4 h-4" /> Add to cart
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => {
                        removeItem(item.productId);
                        toast.success('Removed from wishlist');
                      }}
                      aria-label="Remove from wishlist"
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
