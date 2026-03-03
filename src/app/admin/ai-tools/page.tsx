'use client';

import React, { useState } from 'react';
import { Button, Textarea, Card, CardContent } from '@/components/ui';
import {
  Sparkles,
  FileText,
  Truck,
  Copy,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminAIToolsPage() {
  // Summarizer state
  const [description, setDescription] = useState('');
  const [summary, setSummary] = useState('');
  const [summarizing, setSummarizing] = useState(false);

  // Shipping optimizer state
  const [shippingInput, setShippingInput] = useState('');
  const [shippingResult, setShippingResult] = useState('');
  const [optimizing, setOptimizing] = useState(false);

  const [copied, setCopied] = useState(false);

  const handleSummarize = async () => {
    if (!description.trim()) {
      toast.error('Please enter a product description');
      return;
    }
    setSummarizing(true);
    setSummary('');
    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSummary(data.summary);
    } catch (err) {
      toast.error('Failed to summarize: ' + (err as Error).message);
    } finally {
      setSummarizing(false);
    }
  };

  const handleOptimize = async () => {
    if (!shippingInput.trim()) {
      toast.error('Please enter shipping details');
      return;
    }
    setOptimizing(true);
    setShippingResult('');
    try {
      const res = await fetch('/api/ai/shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ details: shippingInput }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setShippingResult(data.recommendation);
    } catch (err) {
      toast.error('Failed to optimize: ' + (err as Error).message);
    } finally {
      setOptimizing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          AI Tools
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          AI-powered tools to help manage your store more efficiently
        </p>
      </div>

      {/* Product Description Summarizer */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                Description Summarizer
              </h3>
              <p className="text-xs text-gray-500">
                Generate concise product summaries from detailed descriptions
              </p>
            </div>
          </div>

          <Textarea
            label="Product Description"
            placeholder="Paste a lengthy product description here..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
          />

          <div className="mt-3">
            <Button
              onClick={handleSummarize}
              loading={summarizing}
              disabled={!description.trim()}
            >
              <Sparkles className="w-4 h-4" />
              Summarize
            </Button>
          </div>

          {summary && (
            <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-blue-600 uppercase tracking-wider">
                  AI Summary
                </span>
                <button
                  onClick={() => copyToClipboard(summary)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  {copied ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-sm text-gray-800 whitespace-pre-wrap">
                {summary}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Shipping Cost Optimizer */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Truck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                Shipping Cost Optimizer
              </h3>
              <p className="text-xs text-gray-500">
                Get AI recommendations on shipping costs and logistics
              </p>
            </div>
          </div>

          <Textarea
            label="Shipping Details"
            placeholder="Enter product weight, dimensions, origin, destination, urgency level..."
            value={shippingInput}
            onChange={(e) => setShippingInput(e.target.value)}
            rows={4}
          />

          <div className="mt-3">
            <Button
              onClick={handleOptimize}
              loading={optimizing}
              disabled={!shippingInput.trim()}
            >
              <Truck className="w-4 h-4" />
              Optimize
            </Button>
          </div>

          {shippingResult && (
            <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-green-600 uppercase tracking-wider">
                  AI Recommendation
                </span>
                <button
                  onClick={() => copyToClipboard(shippingResult)}
                  className="text-green-600 hover:text-green-700"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-800 whitespace-pre-wrap">
                {shippingResult}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
