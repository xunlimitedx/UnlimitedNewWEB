'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Spinner } from '@/components/ui';
import { User, Package, MapPin, Settings, ChevronRight, Award, Gift } from 'lucide-react';

const accountLinks = [
  { href: '/account', label: 'Profile', icon: User },
  { href: '/account/orders', label: 'Orders', icon: Package },
  { href: '/account/addresses', label: 'Addresses', icon: MapPin },
  { href: '/account/loyalty', label: 'Loyalty Program', icon: Award },
  { href: '/account/referrals', label: 'Referrals', icon: Gift },
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

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your profile, orders, and addresses
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {accountLinks.map((link) => {
                const isActive =
                  link.href === '/account'
                    ? pathname === '/account'
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-colors border-l-2 ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 border-primary-600'
                        : 'text-gray-600 border-transparent hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                    <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-50" />
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
