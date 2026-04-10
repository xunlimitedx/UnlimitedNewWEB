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
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-primary-600">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/products" className="hover:text-primary-600">Products</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link
              href={`/products?category=${product.category}`}
              className="hover:text-primary-600 capitalize"
            >
              {product.category}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-900 font-medium truncate max-w-[200px]">
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
              className="relative w-full h-[400px] sm:h-[500px] bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-zoom-in"
              onClick={() => product.images?.[selectedImage] && setZoomedImage(product.images[selectedImage])}
            >
              {product.images?.[selectedImage] ? (
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-20 h-20 text-gray-200" />
                </div>
              )}
              {discount > 0 && (
                <Badge variant="danger" className="absolute top-4 left-4 text-sm">
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
            <div className="flex items-center gap-2 mb-2">
              <Badge>{product.category}</Badge>
              {product.brand && (
                <span className="text-sm text-gray-500">{product.brand}</span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
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
              <span className="text-3xl font-bold text-gray-900">
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

            {/* SKU */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs text-gray-400">SKU: {product.sku}</p>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: product.name, url: window.location.href });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success('Link copied to clipboard');
                  }
                }}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 transition-colors"
              >
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="text-xs font-medium text-gray-900">Free Delivery</p>
                  <p className="text-xs text-gray-500">On orders over R2,500</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="text-xs font-medium text-gray-900">Warranty</p>
                  <p className="text-xs text-gray-500">Manufacturer warranty</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="text-xs font-medium text-gray-900">Returns</p>
                  <p className="text-xs text-gray-500">30-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {(['description', 'specs', 'reviews'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 text-sm font-medium capitalize transition-colors relative ${
                    activeTab === tab
                      ? 'text-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab === 'specs' ? 'Specifications' : tab}
                  {tab === 'reviews' && ` (${reviews.length})`}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
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
    </div>
  );
}
