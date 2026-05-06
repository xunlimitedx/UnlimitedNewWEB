import Link from 'next/link';
import { Search, Home, Phone, ShoppingBag, Wrench, HelpCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="relative isolate overflow-hidden bg-aurora text-white min-h-[80vh] flex items-center justify-center px-4 py-20">
      <div className="absolute inset-0 animate-aurora opacity-90 pointer-events-none" />
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-blue-500/25 blur-3xl animate-orb pointer-events-none" />

      <div className="relative text-center max-w-2xl">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <h1 className="text-[8rem] sm:text-[12rem] font-extrabold leading-none text-transparent bg-clip-text bg-gradient-to-br from-blue-400 via-primary-400 to-purple-400 select-none tracking-tighter">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 sm:w-28 sm:h-28 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl flex items-center justify-center shadow-2xl animate-bounce-in">
              <Search className="w-10 h-10 sm:w-14 sm:h-14 text-white" />
            </div>
          </div>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 tracking-tight">
          We can&apos;t find that page.
        </h2>
        <p className="text-slate-300/90 mb-8 leading-relaxed max-w-md mx-auto">
          The page may have moved, or perhaps the link was a little gremlin. Let&apos;s get you back on track.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <Link href="/" className="btn-premium">
            <Home className="w-5 h-5" />
            Go Home
          </Link>
          <Link href="/products" className="btn-ghost-premium">
            <ShoppingBag className="w-5 h-5" />
            Products
          </Link>
          <Link href="/services" className="btn-ghost-premium">
            <Wrench className="w-5 h-5" />
            Services
          </Link>
          <Link href="/contact" className="btn-ghost-premium">
            <Phone className="w-5 h-5" />
            Contact
          </Link>
        </div>

        {/* Quick links grid */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300 mb-4 flex items-center justify-center gap-2">
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
                className="px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium text-slate-200 transition-colors border border-white/10 hover:border-white/25"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <p className="text-sm text-slate-400 mt-6">
          Need help? Call{' '}
          <a href="tel:0393144359" className="text-primary-300 hover:text-white font-medium transition-colors">
            039 314 4359
          </a>
        </p>
      </div>
    </div>
  );
}
