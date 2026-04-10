import Link from 'next/link';
import { ArrowLeft, Search, Home, Phone, ShoppingBag, Wrench, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-2xl">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <h1 className="text-[8rem] sm:text-[12rem] font-extrabold leading-none text-transparent bg-clip-text bg-gradient-to-br from-primary-400 to-blue-500 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 sm:w-28 sm:h-28 bg-primary-100 dark:bg-primary-900/30 rounded-3xl flex items-center justify-center shadow-xl animate-bounce-in">
              <Search className="w-10 h-10 sm:w-14 sm:h-14 text-primary-600" />
            </div>
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Oops! Page Not Found
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let us help you find what you need.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <Link href="/">
            <Button size="lg" className="shadow-lg shadow-primary-600/20">
              <Home className="w-5 h-5" />
              Go Home
            </Button>
          </Link>
          <Link href="/products">
            <Button size="lg" variant="outline">
              <ShoppingBag className="w-5 h-5" />
              Products
            </Button>
          </Link>
          <Link href="/services">
            <Button size="lg" variant="outline">
              <Wrench className="w-5 h-5" />
              Services
            </Button>
          </Link>
          <Link href="/contact">
            <Button size="lg" variant="outline">
              <Phone className="w-5 h-5" />
              Contact
            </Button>
          </Link>
        </div>

        {/* Quick links grid */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 sm:p-8">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 flex items-center justify-center gap-2">
            <HelpCircle className="w-4 h-4" />
            Popular destinations
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: 'Computer Repairs', href: '/services/computer-repairs' },
              { label: 'CCTV Installation', href: '/services/cctv-installation' },
              { label: 'Console Repairs', href: '/services/console-repairs' },
              { label: 'Blog', href: '/blog' },
              { label: 'About Us', href: '/about' },
              { label: 'FAQ', href: '/faq' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2.5 bg-white dark:bg-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 transition-colors border border-gray-200 dark:border-gray-600"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <p className="text-sm text-gray-400 mt-6">
          Need help? Call{' '}
          <a href="tel:0393144359" className="text-primary-600 hover:underline font-medium">
            039 314 4359
          </a>
        </p>
      </div>
    </div>
  );
}
