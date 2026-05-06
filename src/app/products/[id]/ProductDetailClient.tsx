'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Badge } from '@/components/ui';
import { Textarea } from '@/components/ui';
import StockNotify from '@/components/ui/StockNotify';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCompareStore } from '@/store/compareStore';
import { useRecentlyViewedStore } from '@/store/recentlyViewedStore';
import { useAuth } from '@/context/AuthContext';
import { getCollection, addDocument, where, orderBy } from '@/lib/firebase';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Star,
  ShoppingCart,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  Heart,
  Share2,
  ChevronRight,
  Package,
  Check,
  GitCompare,
  X,
} from 'lucide-react';
import type { Product, Review } from '@/types';
import type { QueryConstraint } from 'firebase/firestore';
import toast from 'react-hot-toast';
import ShareButtons from '@/components/ShareButtons';
import PriceAlertButton from '@/components/PriceAlertButton';
import StickyAddToCart from '@/components/StickyAddToCart';
import ShippingCalculator from '@/components/ShippingCalculator';
import VariantSelector from '@/components/VariantSelector';

interface ProductDetailClientProps {
  product: Product;
  initialReviews: Review[];
}

export default function ProductDetailClient({ product, initialReviews }: ProductDetailClientProps) {
  const { user } = useAuth();
  const addItem = useCartStore((s) => s.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const { addItem: addToCompare, isInCompare } = useCompareStore();
  const addToRecentlyViewed = useRecentlyViewedStore((s) => s.addItem);
  const recentlyViewed = useRecentlyViewedStore((s) => s.items);

  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Track recently viewed
    addToRecentlyViewed({
      productId: product.id,
      name: product.name,
      image: product.images?.[0] || '',
      price: product.price,
    });

    // Fetch related products
    if (product.category) {
      getCollection('products', [
        where('category', '==', product.category),
      ]).then((related) => {
        setRelatedProducts(
          (related as unknown as Product[])
            .filter((r) => r.id !== product.id && r.isActive !== false && (r as any).active !== false)
            .slice(0, 4)
        );
      }).catch(() => {});
    }
  }, [product.id]);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      image: product.images?.[0] || '',
      price: product.price,
      quantity,
      stock: product.stock ?? 999,
      sku: product.sku || '',
    });
    toast.success(`${product.name} added to cart`);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmittingReview(true);
    try {
      await addDocument('reviews', {
        productId: product.id,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        rating: reviewForm.rating,
        title: reviewForm.title,
        comment: reviewForm.comment,
        verified: false,
      });
      toast.success('Review submitted!');
      setReviewForm({ rating: 5, title: '', comment: '' });
      const updatedReviews = await getCollection('reviews', [
        where('productId', '==', product.id),
        orderBy('createdAt', 'desc'),
      ] as QueryConstraint[]);
      setReviews(updatedReviews as unknown as Review[]);
    } catch {
      toast.error('Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-md border-b border-gray-200/70 dark:border-gray-800/70 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/products" className="hover:text-primary-600 transition-colors">Products</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link
              href={`/products?category=${product.category}`}
              className="hover:text-primary-600 transition-colors capitalize"
            >
              {product.category}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-900 dark:text-white font-semibold truncate max-w-[200px]">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Product JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            image: product.images || [],
            description: product.description || product.shortDescription || '',
            sku: product.sku || product.id,
            brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
            category: product.category,
            offers: {
              '@type': 'Offer',
              url: `https://unlimitedits.co.za/products/${product.id}`,
              priceCurrency: 'ZAR',
              price: product.price,
              availability:
                (product.stock ?? 999) > 0
                  ? 'https://schema.org/InStock'
                  : 'https://schema.org/OutOfStock',
              seller: {
                '@type': 'Organization',
                name: 'Unlimited IT Solutions',
              },
            },
            aggregateRating:
              reviews.length > 0
                ? {
                    '@type': 'AggregateRating',
                    ratingValue: (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1),
                    reviewCount: reviews.length,
                  }
                : undefined,
          }),
        }}
      />

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-10 mb-12">
          {/* Images */}
          <div className="space-y-4">
            <div
              className="group relative w-full h-[400px] sm:h-[520px] bg-gradient-to-br from-white via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 rounded-3xl overflow-hidden shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-800/70 cursor-zoom-in"
              onClick={() => product.images?.[selectedImage] && setZoomedImage(product.images[selectedImage])}
            >
              <div className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-br from-primary-500/10 to-blue-500/10 blur-3xl" />
              {product.images?.[selectedImage] ? (
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-20 h-20 text-gray-200" />
                </div>
              )}
              {discount > 0 && (
                <Badge variant="danger" className="absolute top-4 left-4 text-sm shadow-lg">
                  -{discount}% OFF
                </Badge>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                      selectedImage === i
                        ? 'border-primary-600 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge>{product.category}</Badge>
              {product.brand && (
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                  {product.brand}
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight leading-[1.1]">
              {product.name}
            </h1>

            {/* Rating */}
            {(product.rating ?? 0) > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(product.rating ?? 0)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {(product.rating ?? 0).toFixed(1)}
                </span>
                <span className="text-sm text-gray-400">
                  ({product.reviewCount ?? 0} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-extrabold text-gradient-premium">
                {formatCurrency(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    {formatCurrency(product.compareAtPrice)}
                  </span>
                  <Badge variant="danger">Save {formatCurrency(product.compareAtPrice - product.price)}</Badge>
                </>
              )}
            </div>

            {/* PayFlex 4-pay messaging */}
            <div className="flex items-center gap-3 mb-6 p-3.5 rounded-xl bg-gradient-to-r from-purple-50 via-fuchsia-50/60 to-transparent dark:from-purple-900/30 dark:via-fuchsia-900/20 ring-1 ring-purple-500/20">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white text-xs font-extrabold shadow-md shadow-purple-500/20">P4</span>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Or 4 interest-free payments of <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(product.price / 4)}</span> with PayFlex
              </p>
            </div>

            {/* Short Description */}
            <p className="text-gray-600 leading-relaxed mb-6">
              {product.shortDescription || product.description?.substring(0, 200)}
            </p>

            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-6">
              {(product.stock ?? 999) > 0 ? (
                <>
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-green-600">
                    In Stock
                    {product.stock != null && product.stock <= 10 && ` (${product.stock} remaining)`}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-sm font-medium text-red-500 mb-2 block">Out of Stock</span>
                  <StockNotify productId={product.id} productName={product.name} />
                </>
              )}
            </div>

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <VariantSelector
                  variants={product.variants}
                  selected={selectedVariant}
                  onSelect={setSelectedVariant}
                />
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-100 rounded-l-lg transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-5 font-medium min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock ?? 999, quantity + 1))}
                  className="p-3 hover:bg-gray-100 rounded-r-lg transition-colors"
                  disabled={quantity >= (product.stock ?? 999)}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={(product.stock ?? 999) <= 0}
                className="flex-1"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-4"
                onClick={() => {
                  if (isInWishlist(product.id)) {
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
                }}
              >
                <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-4"
                onClick={() => {
                  addToCompare({
                    productId: product.id,
                    name: product.name,
                    image: product.images?.[0] || '',
                    price: product.price,
                    category: product.category || '',
                    brand: product.brand || '',
                    specifications: product.specifications || {},
                    rating: product.rating || 0,
                    stock: product.stock ?? 0,
                  });
                  toast.success(isInCompare(product.id) ? 'Already in comparison' : 'Added to comparison');
                }}
              >
                <GitCompare className={`w-5 h-5 ${isInCompare(product.id) ? 'text-primary-600' : ''}`} />
              </Button>
            </div>

            {/* WhatsApp Order */}
            <a
              href={`https://wa.me/27825569875?text=${encodeURIComponent(`Hi, I'm interested in ${product.name} (${formatCurrency(product.price)}) - ${typeof window !== 'undefined' ? window.location.href : `https://unlimitedits.co.za/products/${product.id}`}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors text-sm mb-2"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Order via WhatsApp
            </a>

            {/* SKU & Share */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <p className="text-xs text-gray-400">SKU: {product.sku}</p>
                <PriceAlertButton productId={product.id} productName={product.name} currentPrice={product.price} />
              </div>
              <ShareButtons
                url={typeof window !== 'undefined' ? window.location.href : `https://unlimitedits.co.za/products/${product.id}`}
                title={product.name}
              />
            </div>

            {/* Shipping Calculator */}
            <div className="mb-6">
              <ShippingCalculator subtotal={product.price * quantity} />
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 rounded-2xl ring-1 ring-gray-200/70 dark:ring-gray-800/70">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-md shadow-blue-500/20">
                  <Truck className="w-5 h-5" />
                </span>
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">Free Delivery</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">Orders over R2,500</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/20">
                  <Shield className="w-5 h-5" />
                </span>
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">Warranty</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">Manufacturer backed</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20">
                  <RotateCcw className="w-5 h-5" />
                </span>
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">Returns</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">30-day policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="card-premium overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-primary-50/40 via-blue-50/30 to-transparent dark:from-primary-900/20 dark:via-blue-900/10">
            <nav className="flex">
              {(['description', 'specs', 'reviews'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 text-sm font-semibold capitalize transition-all relative tracking-tight ${
                    activeTab === tab
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  {tab === 'specs' ? 'Specifications' : tab}
                  {tab === 'reviews' && ` (${reviews.length})`}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-4 right-4 h-[3px] rounded-full bg-gradient-to-r from-primary-500 to-blue-600" />
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6 sm:p-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none text-gray-600 leading-relaxed">
                <p>{product.description}</p>
              </div>
            )}

            {activeTab === 'specs' && (
              <div>
                {product.specifications && Object.keys(product.specifications).length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between py-2 border-b border-gray-100"
                      >
                        <span className="text-sm font-medium text-gray-500">{key}</span>
                        <span className="text-sm text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No specifications available for this product.
                  </p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-8">
                {/* Review Summary */}
                {reviews.length > 0 && (
                  <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-xl">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900">
                        {(
                          reviews.reduce((acc, r) => acc + r.rating, 0) /
                          reviews.length
                        ).toFixed(1)}
                      </div>
                      <div className="flex gap-0.5 mt-1 justify-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i <
                              Math.round(
                                reviews.reduce((acc, r) => acc + r.rating, 0) /
                                  reviews.length
                              )
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {reviews.length} reviews
                      </div>
                    </div>
                  </div>
                )}

                {/* Reviews List */}
                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="border-b border-gray-100 pb-6 last:border-0"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="font-medium text-gray-900">
                              {review.userName}
                            </span>
                            {review.verified && (
                              <Badge variant="success" className="ml-2 text-xs">
                                Verified
                              </Badge>
                            )}
                          </div>
                          <span className="text-sm text-gray-400">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                        <div className="flex gap-0.5 mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        {review.title && (
                          <h4 className="font-medium text-gray-900 mb-1">
                            {review.title}
                          </h4>
                        )}
                        <p className="text-sm text-gray-600">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    No reviews yet. Be the first to review this product!
                  </p>
                )}

                {/* Write Review Form */}
                {user ? (
                  <div className="border-t border-gray-100 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Write a Review
                    </h3>
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Rating
                        </label>
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() =>
                                setReviewForm({ ...reviewForm, rating: i + 1 })
                              }
                            >
                              <Star
                                className={`w-6 h-6 cursor-pointer transition-colors ${
                                  i < reviewForm.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300 hover:text-yellow-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Review Title
                        </label>
                        <input
                          type="text"
                          value={reviewForm.title}
                          onChange={(e) =>
                            setReviewForm({ ...reviewForm, title: e.target.value })
                          }
                          placeholder="Summarize your experience"
                          className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <Textarea
                        label="Your Review"
                        value={reviewForm.comment}
                        onChange={(e) =>
                          setReviewForm({ ...reviewForm, comment: e.target.value })
                        }
                        placeholder="Share your thoughts about this product..."
                        rows={4}
                        required
                      />
                      <Button type="submit" loading={submittingReview}>
                        Submit Review
                      </Button>
                    </form>
                  </div>
                ) : (
                  <div className="border-t border-gray-100 pt-6 text-center">
                    <p className="text-gray-500 mb-3">
                      Please sign in to write a review.
                    </p>
                    <Link href="/auth/login">
                      <Button variant="outline">Sign In</Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rp) => (
                <Link key={rp.id} href={`/products/${rp.id}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="relative h-48 bg-gray-100">
                    {rp.images?.[0] ? (
                      <Image src={rp.images[0]} alt={rp.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, 25vw" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><Package className="w-10 h-10 text-gray-300" /></div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 text-sm mb-2">{rp.name}</h3>
                    <span className="text-lg font-bold text-gray-900">{formatCurrency(rp.price)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recently Viewed */}
        {recentlyViewed.filter((rv) => rv.productId !== product.id).length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recently Viewed</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {recentlyViewed
                .filter((rv) => rv.productId !== product.id)
                .slice(0, 6)
                .map((rv) => (
                  <Link key={rv.productId} href={`/products/${rv.productId}`} className="group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all">
                    <div className="relative h-32 bg-gray-100">
                      {rv.image ? (
                        <Image src={rv.image} alt={rv.name} fill className="object-cover" sizes="(max-width: 640px) 50vw, 16vw" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Package className="w-8 h-8 text-gray-300" /></div>
                      )}
                    </div>
                    <div className="p-3">
                      <h4 className="text-xs font-medium text-gray-900 group-hover:text-primary-600 line-clamp-2 mb-1">{rv.name}</h4>
                      <span className="text-sm font-bold text-gray-900">{formatCurrency(rv.price)}</span>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Zoom Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setZoomedImage(null)}
        >
          <button
            onClick={() => setZoomedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            aria-label="Close zoom"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="relative w-full max-w-4xl h-[80vh]">
            <Image
              src={zoomedImage}
              alt={product.name}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      )}

      {/* Sticky Add to Cart Bar */}
      <StickyAddToCart product={product} />
    </div>
  );
}
