'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Badge } from '@/components/ui';
import { Modal } from '@/components/ui';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { formatCurrency } from '@/lib/utils';
import {
  ShoppingCart,
  Heart,
  Package,
  Star,
  Check,
  ExternalLink,
} from 'lucide-react';
import type { Product } from '@/types';
import toast from 'react-hot-toast';

interface QuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickView({ product, isOpen, onClose }: QuickViewProps) {
  const addItem = useCartStore((s) => s.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  if (!product) return null;

  const inWishlist = isInWishlist(product.id);
  const inStock = (product.stock ?? 999) > 0;

  const handleAddToCart = () => {
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

  const toggleWishlist = () => {
    if (inWishlist) {
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Image */}
        <div className="relative w-full sm:w-48 h-48 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-contain p-2"
              sizes="200px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-12 h-12 text-gray-300" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge>{product.category}</Badge>
            {product.brand && <span className="text-xs text-gray-400">{product.brand}</span>}
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>

          {(product.rating ?? 0) > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{(product.rating ?? 0).toFixed(1)}</span>
              <span className="text-xs text-gray-400">({product.reviewCount ?? 0})</span>
            </div>
          )}

          <p className="text-sm text-gray-500 line-clamp-2 mb-3">
            {product.shortDescription || product.description?.substring(0, 150)}
          </p>

          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-2xl font-bold text-gray-900">{formatCurrency(product.price)}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-sm text-gray-400 line-through">{formatCurrency(product.compareAtPrice)}</span>
            )}
          </div>

          <div className="flex items-center gap-2 mb-4">
            {inStock ? (
              <>
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">In Stock</span>
              </>
            ) : (
              <span className="text-sm text-red-500">Out of Stock</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={handleAddToCart} disabled={!inStock} className="flex-1">
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </Button>
            <Button variant="outline" size="icon" onClick={toggleWishlist}>
              <Heart className={`w-4 h-4 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Link href={`/products/${product.id}`} onClick={onClose}>
              <Button variant="outline" size="icon">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
}
