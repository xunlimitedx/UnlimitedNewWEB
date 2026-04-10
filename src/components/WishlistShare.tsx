'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui';
import { Share2, ShoppingCart, Trash2, Heart, Copy, Package } from 'lucide-react';
import toast from 'react-hot-toast';

export default function WishlistShareButton() {
  const items = useWishlistStore((s) => s.items);

  const handleShare = async () => {
    const itemNames = items.map((i) => `- ${i.name} (${formatCurrency(i.price)})`).join('\n');
    const text = `Check out my wishlist from Unlimited IT Solutions:\n\n${itemNames}\n\nShop at https://unlimitedits.co.za`;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'My Wishlist', text });
      } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(text);
      toast.success('Wishlist copied to clipboard!');
    }
  };

  if (items.length === 0) return null;

  return (
    <Button variant="outline" size="sm" onClick={handleShare}>
      <Share2 className="w-4 h-4" /> Share Wishlist
    </Button>
  );
}

export function MoveAllToCart() {
  const items = useWishlistStore((s) => s.items);
  const clearWishlist = useWishlistStore((s) => s.clearWishlist);
  const addItem = useCartStore((s) => s.addItem);

  const handleMoveAll = () => {
    items.forEach((item) => {
      addItem({
        productId: item.productId,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: 1,
        stock: 999,
        sku: '',
      });
    });
    clearWishlist();
    toast.success('All items moved to cart!');
  };

  if (items.length === 0) return null;

  return (
    <Button size="sm" onClick={handleMoveAll}>
      <ShoppingCart className="w-4 h-4" /> Move All to Cart
    </Button>
  );
}
