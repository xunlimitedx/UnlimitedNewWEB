'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { addDocument, getCollection, where, orderBy } from '@/lib/firebase';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui';
import type { ProductQuestion } from '@/types';
import type { QueryConstraint } from 'firebase/firestore';
import { MessageCircle, Send, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface ProductQuestionsProps {
  productId: string;
  initialQuestions?: ProductQuestion[];
}

export default function ProductQuestions({ productId, initialQuestions = [] }: ProductQuestionsProps) {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<ProductQuestion[]>(initialQuestions);
  const [newQuestion, setNewQuestion] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newQuestion.trim()) return;
    setSubmitting(true);
    try {
      await addDocument('product-questions', {
        productId,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        question: newQuestion.trim(),
      });
      toast.success('Question submitted! We\'ll answer soon.');
      setNewQuestion('');
      const updated = await getCollection('product-questions', [
        where('productId', '==', productId),
        orderBy('createdAt', 'desc'),
      ] as QueryConstraint[]);
      setQuestions(updated as unknown as ProductQuestion[]);
    } catch {
      toast.error('Failed to submit question');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-primary-600" />
        Customer Questions ({questions.length})
      </h3>

      {/* Ask a Question */}
      {user ? (
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Ask a question about this product..."
            className="flex-1 h-10 px-4 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            maxLength={500}
            required
          />
          <Button type="submit" disabled={submitting || !newQuestion.trim()}>
            <Send className="w-4 h-4" /> Ask
          </Button>
        </form>
      ) : (
        <div className="text-center py-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">
            <Link href="/auth/login" className="text-primary-600 hover:underline">Sign in</Link> to ask a question.
          </p>
        </div>
      )}

      {/* Questions List */}
      {questions.length > 0 ? (
        <div className="space-y-4">
          {questions.map((q) => (
            <div key={q.id} className="border border-gray-100 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-primary-600 font-bold text-sm mt-0.5">Q:</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 font-medium">{q.question}</p>
                  <p className="text-xs text-gray-400 mt-1">{q.userName} · {formatDate(q.createdAt)}</p>
                </div>
              </div>
              {q.answer && (
                <div className="flex items-start gap-3 mt-3 pl-6 border-t pt-3">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-700">{q.answer}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {q.answeredBy || 'Store'} · {q.answeredAt ? formatDate(q.answeredAt) : ''}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 text-center py-6">
          No questions yet. Be the first to ask!
        </p>
      )}
    </div>
  );
}
