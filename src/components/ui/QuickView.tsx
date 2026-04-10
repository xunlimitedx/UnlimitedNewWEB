'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Badge } from '@/components/ui';
import { Modal } from '@/components/ui';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCompareStore } from '@/store/compareStore';
import { formatCurrency } from '@/lib/utils';
import {
  ShoppingCart,
  Heart,
  Package,
  Star,
  Check,
  ExternalLink,
  Minus,
  Plus,
  GitCompare,
  Truck,
  Shield,
  RotateCcw,
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
  const { addItem: addToCompare, isInCompare } = useCompareStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) return null;

  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);
  const inStock = (product.stock ?? 999) > 0;
  const maxStock = product.stock ?? 999;
  const discount = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      image: product.images?.[0] || '',
      price: product.price,
      quantity,
      stock: maxStock,
      sku: product.sku || '',
    });
    toast.success(`${product.name} added to cart`);
    setQuantity(1);
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

  const toggleCompare = () => {
    if (!inCompare) {
      addToCompare({
        productId: product.id,
        name: product.name,
        image: product.images?.[0] || '',
        price: product.price,
        category: product.category,
        brand: product.brand || '',
        specifications: product.specifications || {},
        rating: product.rating ?? 0,
        stock: product.stock ?? 0,
      });
      toast.success('Added to compare');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Images */}
        <div className="flex-shrink-0">
          <div className="relative w-full sm:w-56 h-56 bg-gray-50 rounded-xl overflow-hidden">
            {product.images?.[selectedImage] ? (
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-contain p-2"
                sizes="224px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-12 h-12 text-gray-300" />
              </div>
            )}
            {discount > 0 && (
              <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                -{discount}%
              </span>
            )}
          </div>
          {/* Thumbnail strip */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 mt-2 overflow-x-auto">
              {product.images.slice(0, 4).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-colors ${
                    selectedImage === i ? 'border-primary-600' : 'border-gray-200'
                  }`}
                >
                  <Image src={img} alt="" width={48} height={48} className="w-full h-full object-contain" />
                </button>
              ))}
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
              <span className="text-xs text-gray-400">({product.reviewCount ?? 0} reviews)</span>
            </div>
          )}

          <p className="text-sm text-gray-500 line-clamp-3 mb-3">
            {product.shortDescription || product.description?.substring(0, 200)}
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
                <span className="text-sm text-green-600">
                  In Stock {maxStock <= 5 && maxStock > 0 ? `(${maxStock} left)` : ''}
                </span>
              </>
            ) : (
              <span className="text-sm text-red-500 font-medium">Out of Stock</span>
            )}
          </div>

          {/* Quantity selector */}
          {inStock && (
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm text-gray-600">Qty:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="p-2 hover:bg-gray-100 transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(maxStock, q + 1))}
                  className="p-2 hover:bg-gray-100 transition-colors"
                  disabled={quantity >= maxStock}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 mb-4">
            <Button onClick={handleAddToCart} disabled={!inStock} className="flex-1">
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </Button>
            <Button variant="outline" size="icon" onClick={toggleWishlist} title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}>
              <Heart className={`w-4 h-4 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button variant="outline" size="icon" onClick={toggleCompare} disabled={inCompare} title="Compare">
              <GitCompare className={`w-4 h-4 ${inCompare ? 'text-primary-600' : ''}`} />
            </Button>
            <Link href={`/products/${product.id}`} onClick={onClose}>
              <Button variant="outline" size="icon" title="View full details">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Truck className="w-3.5 h-3.5" />
              Free shipping R2,500+
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Shield className="w-3.5 h-3.5" />
              Warranty
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <RotateCcw className="w-3.5 h-3.5" />
              30-day returns
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
