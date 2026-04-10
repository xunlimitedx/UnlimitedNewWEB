'use client';

import React, { useState, useEffect } from 'react';
import { getCollection, updateDocument, deleteDocument, where } from '@/lib/firebase';
import { Star, CheckCircle, XCircle, Trash2, MessageSquare, Eye } from 'lucide-react';
import { Button } from '@/components/ui';
import type { Review } from '@/types';
import toast from 'react-hot-toast';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const constraints = filter !== 'all' ? [where('status', '==', filter)] : [];
        const data = await getCollection('reviews', constraints);
        const sorted = (data as unknown as Review[]).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setReviews(sorted);
      } catch {
        console.error('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    })();
  }, [filter]);

  const handleApprove = async (id: string) => {
    try {
      await updateDocument('reviews', id, { status: 'approved' });
      setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'approved' as const } : r)));
      toast.success('Review approved');
    } catch {
      toast.error('Failed to approve review');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateDocument('reviews', id, { status: 'rejected' });
      setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'rejected' as const } : r)));
      toast.success('Review rejected');
    } catch {
      toast.error('Failed to reject review');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review permanently?')) return;
    try {
      await deleteDocument('reviews', id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
      toast.success('Review deleted');
    } catch {
      toast.error('Failed to delete review');
    }
  };

  const handleReply = async (id: string) => {
    if (!replyText.trim()) return;
    try {
      await updateDocument('reviews', id, { adminReply: replyText.trim() });
      setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, adminReply: replyText.trim() } : r)));
      setReplyingTo(null);
      setReplyText('');
      toast.success('Reply posted');
    } catch {
      toast.error('Failed to post reply');
    }
  };

  const pendingCount = reviews.filter((r) => r.status === 'pending').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
          <p className="text-sm text-gray-500 mt-1">
            {pendingCount > 0 ? `${pendingCount} pending review${pendingCount !== 1 ? 's' : ''}` : 'All reviews moderated'}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
          <button
            key={f}
            onClick={() => { setFilter(f); setLoading(true); }}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors capitalize ${
              filter === f ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Star className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No {filter !== 'all' ? filter : ''} reviews found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl border p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                      ))}
                    </div>
                    <span className="font-medium text-sm">{review.title}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      review.status === 'approved' ? 'bg-green-100 text-green-700' :
                      review.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {review.status || 'pending'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{review.comment}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>{review.userName}</span>
                    <span>Product: {review.productId}</span>
                    <span>{new Date(review.createdAt).toLocaleDateString('en-ZA')}</span>
                  </div>
                  {review.adminReply && (
                    <div className="bg-blue-50 rounded-lg p-3 mt-3 border-l-2 border-blue-500">
                      <p className="text-xs font-medium text-blue-600 mb-1">Your Reply</p>
                      <p className="text-sm text-gray-700">{review.adminReply}</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 ml-4">
                  {review.status !== 'approved' && (
                    <button onClick={() => handleApprove(review.id)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Approve">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  {review.status !== 'rejected' && (
                    <button onClick={() => handleReject(review.id)} className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg" title="Reject">
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => { setReplyingTo(review.id); setReplyText(review.adminReply || ''); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Reply">
                    <MessageSquare className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(review.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {replyingTo === review.id && (
                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1 h-9 px-3 text-sm border rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Write a reply..."
                    onKeyDown={(e) => e.key === 'Enter' && handleReply(review.id)}
                  />
                  <Button size="sm" onClick={() => handleReply(review.id)}>Send</Button>
                  <Button size="sm" variant="outline" onClick={() => setReplyingTo(null)}>Cancel</Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
