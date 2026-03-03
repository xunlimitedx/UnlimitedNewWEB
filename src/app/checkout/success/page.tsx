'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui';
import { CheckCircle, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="max-w-md w-full text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        Payment Successful!
      </h1>
      <p className="text-gray-500 mb-2">
        Thank you for your order. Your payment has been received.
      </p>
      {orderId && (
        <p className="text-sm text-gray-400 mb-8">
          Order reference: <span className="font-mono font-medium text-gray-600">{orderId}</span>
        </p>
      )}
      {!orderId && <div className="mb-8" />}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/account/orders">
          <Button size="lg">
            <ShoppingBag className="w-4 h-4" />
            View Orders
          </Button>
        </Link>
        <Link href="/products">
          <Button variant="outline" size="lg">
            Continue Shopping
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin text-gray-400" />}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
