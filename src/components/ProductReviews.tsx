'use client';

import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, Camera, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getCollection, addDocument, updateDocument, where, orderBy } from '@/lib/firebase';
import { Button } from '@/components/ui';
import { sanitizeInput } from '@/lib/utils';
import type { Review } from '@/types';
import toast from 'react-hot-toast';

interface ProductReviewsProps {
  productId: string;
  productName: string;
}

export default function ProductReviews({ productId, productName }: ProductReviewsProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest' | 'helpful'>('newest');

  useEffect(() => {
    (async () => {
      try {
        const data = await getCollection('reviews', [
          where('productId', '==', productId),
          where('status', '==', 'approved'),
          orderBy('createdAt', 'desc'),
        ]);
        setReviews(data as unknown as Review[]);
      } catch {
        // Fallback without compound index
        try {
          const data = await getCollection('reviews', [
            where('productId', '==', productId),
          ]);
          setReviews(
            (data as unknown as Review[])
              .filter((r) => r.status !== 'rejected')
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          );
        } catch {
          console.error('Failed to load reviews');
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [productId]);

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.rating === stars).length,
    percentage: reviews.length > 0
      ? (reviews.filter((r) => r.rating === stars).length / reviews.length) * 100
      : 0,
  }));

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'highest': return b.rating - a.rating;
      case 'lowest': return a.rating - b.rating;
      case 'helpful': return (b.helpful ?? 0) - (a.helpful ?? 0);
      default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error('Please sign in to leave a review'); return; }
    if (rating === 0) { toast.error('Please select a rating'); return; }
    if (!title.trim() || !comment.trim()) { toast.error('Please fill in all fields'); return; }

    setSubmitting(true);
    try {
      const review: Omit<Review, 'id' | 'createdAt'> = {
        productId,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        userPhoto: user.photoURL || undefined,
        rating,
        title: sanitizeInput(title.trim()),
        comment: sanitizeInput(comment.trim()),
        verified: false,
        helpful: 0,
        status: 'pending',
      };
      await addDocument('reviews', review);
      toast.success('Review submitted! It will appear after moderation.');
      setShowForm(false);
      setRating(0);
      setTitle('');
      setComment('');
    } catch {
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleHelpful = async (reviewId: string) => {
    const storageKey = `helpful-${reviewId}`;
    if (localStorage.getItem(storageKey)) return;
    try {
      const review = reviews.find((r) => r.id === reviewId);
      if (!review) return;
      await updateDocument('reviews', reviewId, { helpful: (review.helpful ?? 0) + 1 });
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, helpful: (r.helpful ?? 0) + 1 } : r))
      );
      localStorage.setItem(storageKey, '1');
    } catch {
      // silent
    }
  };

  const userHasReviewed = reviews.some((r) => r.userId === user?.uid);

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>

      <div className="grid md:grid-cols-3 gap-8 mb-8">
        {/* Summary */}
        <div className="bg-gray-50 rounded-xl p-6 text-center">
          <div className="text-5xl font-bold text-gray-900 mb-1">{averageRating.toFixed(1)}</div>
          <div className="flex justify-center gap-0.5 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${i < Math.round(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
          {!userHasReviewed && user && (
            <Button onClick={() => setShowForm(true)} className="mt-4 w-full" size="sm">
              Write a Review
            </Button>
          )}
          {!user && (
            <p className="text-xs text-gray-400 mt-4">
              <a href="/auth/login" className="text-primary-600 hover:underline">Sign in</a> to write a review
            </p>
          )}
        </div>

        {/* Distribution */}
        <div className="md:col-span-2 space-y-2">
          {ratingDistribution.map(({ stars, count, percentage }) => (
            <div key={stars} className="flex items-center gap-3">
              <span className="text-sm text-gray-600 w-8">{stars}★</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                <div className="bg-yellow-400 h-2.5 rounded-full transition-all" style={{ width: `${percentage}%` }} />
              </div>
              <span className="text-sm text-gray-500 w-8 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Write a Review for {productName}</h3>

          {/* Star Rating */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(i + 1)}
                  onMouseEnter={() => setHoverRating(i + 1)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      i < (hoverRating || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Review Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-10 px-3 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Summarize your experience"
              maxLength={100}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              rows={4}
              placeholder="Tell others about your experience with this product"
              maxLength={2000}
              required
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Sort & Reviews List */}
      {reviews.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">All Reviews</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="text-sm border rounded-lg px-3 py-1.5 bg-white"
            >
              <option value="newest">Newest First</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>

          {sortedReviews.map((review) => (
            <div key={review.id} className="bg-white border rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                      />
                    ))}
                  </div>
                  <span className="font-medium text-sm text-gray-900">{review.title}</span>
                </div>
                {review.verified && (
                  <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    <CheckCircle className="w-3 h-3" /> Verified Purchase
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">{review.comment}</p>
              {review.adminReply && (
                <div className="bg-gray-50 rounded-lg p-3 mb-3 border-l-2 border-primary-500">
                  <p className="text-xs font-medium text-primary-600 mb-1">Response from Unlimited IT Solutions</p>
                  <p className="text-sm text-gray-600">{review.adminReply}</p>
                </div>
              )}
              <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-3">
                  <span>{review.userName}</span>
                  <span>{new Date(review.createdAt).toLocaleDateString('en-ZA')}</span>
                </div>
                <button
                  onClick={() => handleHelpful(review.id)}
                  className={`flex items-center gap-1 hover:text-gray-600 transition ${
                    localStorage.getItem(`helpful-${review.id}`) ? 'text-primary-500' : ''
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  Helpful ({review.helpful ?? 0})
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && reviews.length === 0 && !showForm && (
        <div className="text-center py-8 text-gray-400">
          <Star className="w-10 h-10 mx-auto mb-2 text-gray-300" />
          <p>No reviews yet. Be the first to review this product!</p>
        </div>
      )}
    </div>
  );
}
