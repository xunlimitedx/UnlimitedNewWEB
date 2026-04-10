'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { isAdmin } from '@/lib/utils';
import { Spinner } from '@/components/ui';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingBag,
  Settings,
  Upload,
  Sparkles,
  Palette,
  ChevronRight,
  Shield,
  Truck,
  DollarSign,
  Tag,
  Newspaper,
  Star,
  MessageCircle,
  BarChart3,
  Warehouse,
  ShoppingCart,
  Gift,
  UserCheck,
} from 'lucide-react';

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/pricing', label: 'Pricing', icon: DollarSign },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/inventory', label: 'Inventory', icon: Warehouse },
  { href: '/admin/abandoned-carts', label: 'Abandoned Carts', icon: ShoppingCart },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/segments', label: 'Segments', icon: UserCheck },
  { href: '/admin/coupons', label: 'Coupons', icon: Tag },
  { href: '/admin/gift-cards', label: 'Gift Cards', icon: Gift },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/questions', label: 'Questions', icon: MessageCircle },
  { href: '/admin/reports', label: 'Sales Reports', icon: BarChart3 },
  { href: '/admin/blog', label: 'Blog', icon: Newspaper },
  { href: '/admin/feeds', label: 'Data Feeds', icon: Truck },
  { href: '/admin/import', label: 'Data Import', icon: Upload },
  { href: '/admin/ai-tools', label: 'AI Tools', icon: Sparkles },
  { href: '/admin/theme', label: 'Theme', icon: Palette },
  { href: '/admin/security', label: 'Security', icon: Shield },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  // Allow admin login page to render without auth
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user || !isAdmin(user.email)) {
    router.push('/admin/login');
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-primary-400" />
            <div>
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-400 text-sm">Unlimited IT Solutions Management</p>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-56 flex-shrink-0">
            <nav className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {adminLinks.map((link) => {
                const isActive =
                  link.href === '/admin'
                    ? pathname === '/admin'
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-l-2 ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 border-primary-600'
                        : 'text-gray-600 border-transparent hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
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
