'use client';

import { Button } from '@/components/ui';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Something Went Wrong
        </h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          An unexpected error occurred. Please try again, and if the problem
          persists, contact us for assistance.
        </p>
        <Button size="lg" onClick={reset}>
          <RefreshCw className="w-5 h-5" />
          Try Again
        </Button>
      </div>
    </div>
  );
}
