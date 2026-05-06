'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Spinner } from '@/components/ui';
import { User, Package, MapPin, ChevronRight, Award, Gift, Sparkles } from 'lucide-react';

const accountLinks = [
  { href: '/account', label: 'Profile', icon: User, hint: 'Personal details' },
  { href: '/account/orders', label: 'Orders', icon: Package, hint: 'Track & history' },
  { href: '/account/addresses', label: 'Addresses', icon: MapPin, hint: 'Saved delivery' },
  { href: '/account/loyalty', label: 'Loyalty Program', icon: Award, hint: 'Points & tiers' },
  { href: '/account/referrals', label: 'Referrals', icon: Gift, hint: 'Invite friends' },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  const firstName = (user.displayName || user.email || 'there').split(' ')[0].split('@')[0];

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      {/* Aurora banner */}
      <section className="relative isolate overflow-hidden bg-aurora text-white">
        <div className="absolute inset-0 animate-aurora opacity-90 pointer-events-none" />
        <div className="absolute inset-0 bg-grid pointer-events-none" />
        <div className="absolute -top-32 right-1/4 w-[26rem] h-[26rem] rounded-full bg-blue-500/25 blur-3xl animate-orb pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <span className="eyebrow-chip"><Sparkles className="w-3.5 h-3.5" /> Member area</span>
          <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.05]">
            Welcome back, <span className="text-gradient-premium">{firstName}.</span>
          </h1>
          <p className="mt-3 text-slate-300/90 max-w-xl">
            Track orders, save addresses, climb loyalty tiers and invite friends — all in one place.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-72 flex-shrink-0">
            <nav className="card-premium overflow-hidden p-2">
              {accountLinks.map((link) => {
                const isActive =
                  link.href === '/account'
                    ? pathname === '/account'
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`group relative flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/30 dark:to-blue-900/30 text-primary-700 dark:text-primary-300'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <span className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all ${
                      isActive
                        ? 'bg-gradient-to-br from-primary-500 to-blue-600 text-white shadow-md shadow-primary-500/20'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-700'
                    }`}>
                      <link.icon className="w-4 h-4" />
                    </span>
                    <span className="flex-1">
                      <span className="block leading-tight">{link.label}</span>
                      <span className={`block text-[11px] font-normal ${isActive ? 'text-primary-600/70 dark:text-primary-300/70' : 'text-gray-400 dark:text-gray-500'}`}>{link.hint}</span>
                    </span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'translate-x-0.5 text-primary-600 dark:text-primary-400' : 'opacity-40 group-hover:translate-x-0.5'}`} />
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
