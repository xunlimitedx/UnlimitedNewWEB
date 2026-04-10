import Link from 'next/link';
import { ArrowLeft, Search, Home, Phone, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-lg">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <h1 className="text-[10rem] font-extrabold leading-none text-gray-100 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-primary-100 rounded-2xl flex items-center justify-center shadow-lg animate-bounce-in">
              <Search className="w-12 h-12 text-primary-600" />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Page Not Found
        </h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
          Try one of these instead:
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <Link href="/">
            <Button size="lg">
              <Home className="w-5 h-5" />
              Home
            </Button>
          </Link>
          <Link href="/products">
            <Button size="lg" variant="outline">
              <ShoppingBag className="w-5 h-5" />
              Products
            </Button>
          </Link>
          <Link href="/contact">
            <Button size="lg" variant="outline">
              <Phone className="w-5 h-5" />
              Contact
            </Button>
          </Link>
        </div>

        {/* Quick links */}
        <div className="border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-400 mb-3">Popular pages:</p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
            <Link href="/services" className="text-primary-600 hover:text-primary-700 transition-colors">
              Services
            </Link>
            <Link href="/services/computer-repairs" className="text-primary-600 hover:text-primary-700 transition-colors">
              Computer Repairs
            </Link>
            <Link href="/services/cctv-installation" className="text-primary-600 hover:text-primary-700 transition-colors">
              CCTV Installation
            </Link>
            <Link href="/blog" className="text-primary-600 hover:text-primary-700 transition-colors">
              Blog
            </Link>
            <Link href="/faq" className="text-primary-600 hover:text-primary-700 transition-colors">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
