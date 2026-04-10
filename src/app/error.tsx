'use client';

import Link from 'next/link';
import { Button } from '@/components/ui';
import { AlertTriangle, RefreshCw, Home, Phone } from 'lucide-react';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-lg">
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-red-100 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Something Went Wrong
        </h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          An unexpected error occurred. This has been logged and we&apos;ll look into it.
          Please try again, or contact us if the problem persists.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button size="lg" onClick={reset}>
            <RefreshCw className="w-5 h-5" />
            Try Again
          </Button>
          <Link href="/">
            <Button size="lg" variant="outline">
              <Home className="w-5 h-5" />
              Home
            </Button>
          </Link>
          <Link href="/contact">
            <Button size="lg" variant="outline">
              <Phone className="w-5 h-5" />
              Contact
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
