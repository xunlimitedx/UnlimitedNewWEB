'use client';

import React, { useState, useEffect } from 'react';
import { getCollection, updateDocument, deleteDocument, orderBy } from '@/lib/firebase';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui';
import type { ProductQuestion } from '@/types';
import type { QueryConstraint } from 'firebase/firestore';
import { MessageCircle, Send, Trash2, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<ProductQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unanswered' | 'answered'>('unanswered');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    getCollection('product-questions', [orderBy('createdAt', 'desc')] as QueryConstraint[])
      .then((data) => setQuestions(data as unknown as ProductQuestion[]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = questions.filter((q) => {
    if (filter === 'unanswered') return !q.answer;
    if (filter === 'answered') return !!q.answer;
    return true;
  });

  const handleReply = async (questionId: string) => {
    if (!replyText.trim()) return;
    try {
      await updateDocument('product-questions', questionId, {
        answer: replyText.trim(),
        answeredBy: 'Unlimited IT',
        answeredAt: new Date().toISOString(),
      });
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId
            ? { ...q, answer: replyText.trim(), answeredBy: 'Unlimited IT', answeredAt: new Date().toISOString() }
            : q
        )
      );
      setReplyTo(null);
      setReplyText('');
      toast.success('Reply sent');
    } catch {
      toast.error('Failed to reply');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this question?')) return;
    try {
      await deleteDocument('product-questions', id);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
      toast.success('Question deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const unansweredCount = questions.filter((q) => !q.answer).length;

  if (loading) {
    return <div className="animate-pulse"><div className="h-64 bg-gray-200 rounded-xl" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <MessageCircle className="w-6 h-6" />
          Product Questions
          {unansweredCount > 0 && (
            <span className="text-sm bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
              {unansweredCount} pending
            </span>
          )}
        </h1>
      </div>

      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {(['all', 'unanswered', 'answered'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize ${
              filter === f ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((q) => (
          <div key={q.id} className="bg-white rounded-xl border p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-900">{q.question}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {q.userName} · {formatDate(q.createdAt)} · Product: {q.productId.slice(0, 8)}
                </p>
              </div>
              <button onClick={() => handleDelete(q.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {q.answer ? (
              <div className="mt-3 p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-1.5 mb-1">
                  <Check className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-xs font-medium text-green-700">Answered by {q.answeredBy}</span>
                </div>
                <p className="text-sm text-green-800">{q.answer}</p>
              </div>
            ) : replyTo === q.id ? (
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your answer..."
                  className="flex-1 h-9 px-3 border rounded-lg text-sm"
                  autoFocus
                />
                <Button size="sm" onClick={() => handleReply(q.id)}>
                  <Send className="w-3.5 h-3.5" /> Send
                </Button>
                <Button size="sm" variant="ghost" onClick={() => { setReplyTo(null); setReplyText(''); }}>
                  Cancel
                </Button>
              </div>
            ) : (
              <button
                onClick={() => setReplyTo(q.id)}
                className="mt-3 text-xs text-primary-600 hover:text-primary-700 font-medium"
              >
                Reply to question →
              </button>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-gray-500 text-center py-12">No questions to show</p>
        )}
      </div>
    </div>
  );
}
