'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getCollection, addDocument, where, orderBy } from '@/lib/firebase';
import { formatDate, sanitizeInput } from '@/lib/utils';
import { MessageCircle, Send, User, ThumbsUp } from 'lucide-react';
import type { QueryConstraint } from 'firebase/firestore';
import toast from 'react-hot-toast';

interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  content: string;
  likes: number;
  parentId?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface BlogCommentsProps {
  postId: string;
}

export default function BlogComments({ postId }: BlogCommentsProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    try {
      const data = await getCollection('blog-comments', [
        where('postId', '==', postId),
        where('status', '==', 'approved'),
        orderBy('createdAt', 'desc'),
      ] as QueryConstraint[]);
      setComments(data as unknown as Comment[]);
    } catch {
      // May fail if index not yet created
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent, parentId?: string) => {
    e.preventDefault();
    if (!user) return;

    const text = parentId ? replyContent : content;
    if (!text.trim()) return;

    setSubmitting(true);
    try {
      await addDocument('blog-comments', {
        postId,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        userPhoto: user.photoURL || '',
        content: sanitizeInput(text.trim()),
        likes: 0,
        parentId: parentId || null,
        status: 'approved', // Auto-approve for now; admin can moderate
        createdAt: new Date().toISOString(),
      });

      toast.success('Comment posted!');
      if (parentId) {
        setReplyContent('');
        setReplyTo(null);
      } else {
        setContent('');
      }
      loadComments();
    } catch {
      toast.error('Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const topLevelComments = comments.filter((c) => !c.parentId);
  const getReplies = (parentId: string) => comments.filter((c) => c.parentId === parentId);

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-5 h-5 text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Comment Form */}
      {user ? (
        <form onSubmit={(e) => handleSubmit(e)} className="mb-8">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
              {user.photoURL ? (
                <img src={user.photoURL} alt="" className="w-10 h-10 rounded-full" />
              ) : (
                <User className="w-5 h-5 text-primary-600" />
              )}
            </div>
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write a comment..."
                rows={3}
                maxLength={1000}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-400">{content.length}/1000</span>
                <button
                  type="submit"
                  disabled={submitting || !content.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="text-center py-6 mb-8 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-gray-500 mb-2">Sign in to leave a comment</p>
          <a href="/auth/login" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            Sign In
          </a>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : topLevelComments.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No comments yet. Be the first!</p>
      ) : (
        <div className="space-y-6">
          {topLevelComments.map((comment) => (
            <div key={comment.id}>
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  {comment.userPhoto ? (
                    <img src={comment.userPhoto} alt="" className="w-10 h-10 rounded-full" />
                  ) : (
                    <User className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">{comment.userName}</span>
                    <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
                  <div className="flex items-center gap-3 mt-2">
                    {user && (
                      <button
                        onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                        className="text-xs text-gray-500 hover:text-primary-600 font-medium"
                      >
                        Reply
                      </button>
                    )}
                  </div>

                  {/* Reply Form */}
                  {replyTo === comment.id && user && (
                    <form onSubmit={(e) => handleSubmit(e, comment.id)} className="mt-3">
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder={`Reply to ${comment.userName}...`}
                        rows={2}
                        maxLength={500}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => { setReplyTo(null); setReplyContent(''); }}
                          className="px-3 py-1.5 text-xs text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={submitting || !replyContent.trim()}
                          className="px-3 py-1.5 text-xs bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                        >
                          {submitting ? 'Posting...' : 'Reply'}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Replies */}
                  {getReplies(comment.id).length > 0 && (
                    <div className="mt-4 ml-4 space-y-4 border-l-2 border-gray-100 pl-4">
                      {getReplies(comment.id).map((reply) => (
                        <div key={reply.id} className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                            {reply.userPhoto ? (
                              <img src={reply.userPhoto} alt="" className="w-8 h-8 rounded-full" />
                            ) : (
                              <User className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium text-gray-900">{reply.userName}</span>
                              <span className="text-xs text-gray-400">{formatDate(reply.createdAt)}</span>
                            </div>
                            <p className="text-sm text-gray-700">{reply.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
