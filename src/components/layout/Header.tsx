'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCartStore } from '@/store/cartStore';
import { logout } from '@/lib/firebase';
import { useTheme } from '@/context/ThemeContext';
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Search,
  Laptop,
  Monitor,
  Cpu,
  Mouse,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Package,
  MapPin,
  Heart,
  GitCompare,
  Camera,
  Wifi,
  Wrench,
  Gamepad2,
  Headphones,
  Phone,
  Sun,
  Moon,
} from 'lucide-react';
import { Button } from '@/components/ui';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCompareStore } from '@/store/compareStore';
import InstantSearch from '@/components/InstantSearch';
import toast from 'react-hot-toast';

export default function Header() {
  const { user, isAdminUser } = useAuth();
  const { getItemCount, openCart } = useCartStore();
  const { darkMode, toggleDarkMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const itemCount = getItemCount();
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const compareCount = useCompareStore((s) => s.items.length);
  const megaMenuTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      setUserMenuOpen(false);
    } catch {
      toast.error('Failed to log out');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
      setMobileMenuOpen(false);
    }
  };

  const openMegaMenu = (menu: string) => {
    if (megaMenuTimeout.current) clearTimeout(megaMenuTimeout.current);
    setMegaMenuOpen(menu);
  };

  const closeMegaMenu = () => {
    megaMenuTimeout.current = setTimeout(() => setMegaMenuOpen(null), 150);
  };

  useEffect(() => {
    return () => {
      if (megaMenuTimeout.current) clearTimeout(megaMenuTimeout.current);
    };
  }, []);

  const productCategories = [
    { name: 'Laptops', href: '/products?category=laptops', icon: Laptop, desc: 'Notebooks for work & play' },
    { name: 'Desktops', href: '/products?category=desktops', icon: Monitor, desc: 'Towers, AIOs & custom builds' },
    { name: 'Components', href: '/products?category=components', icon: Cpu, desc: 'GPUs, RAM, storage & more' },
    { name: 'Peripherals', href: '/products?category=peripherals', icon: Mouse, desc: 'Keyboards, mice, monitors' },
    { name: 'Networking', href: '/products?category=networking', icon: Wifi, desc: 'Routers, switches, cables' },
    { name: 'Accessories', href: '/products?category=accessories', icon: Headphones, desc: 'Cases, chargers & more' },
  ];

  const serviceItems = [
    { name: 'Computer Repairs', href: '/services/computer-repairs', icon: Wrench, desc: 'Laptops & desktops' },
    { name: 'Mac Repairs', href: '/services/mac-repairs', icon: Laptop, desc: 'MacBook, iMac, Mac Pro' },
    { name: 'Console Repairs', href: '/services/console-repairs', icon: Gamepad2, desc: 'PlayStation, Xbox, Nintendo' },
    { name: 'CCTV Installation', href: '/services/cctv-installation', icon: Camera, desc: 'Security cameras & DVR' },
    { name: 'Networking', href: '/services/networking', icon: Wifi, desc: 'Wi-Fi, cabling & VPN' },
    { name: 'All Services', href: '/services', icon: Headphones, desc: 'View all our services' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      {/* Top bar */}
      <div className="bg-primary-900 text-primary-100 text-xs py-1.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              202 Marine Drive, Ramsgate, 4285
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <a href="tel:0393144359" className="hover:text-white transition-colors">
              039 314 4359
            </a>
            <span className="text-primary-700">|</span>
            <a href="tel:0825569875" className="hover:text-white transition-colors">
              082 556 9875
            </a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo.svg"
              alt="Unlimited IT Solutions"
              className="h-9 w-auto"
            />
            <div className="leading-tight">
              <span className="text-xl sm:text-2xl font-heading text-gray-900 dark:text-white tracking-wide">Unlimited</span>
              <span className="text-xl sm:text-2xl font-heading text-primary-600 tracking-wide"> IT Solutions</span>
            </div>
          </Link>

          {/* Search Bar - Instant Search */}
          <div className="hidden md:flex flex-1 max-w-lg mx-4">
            <InstantSearch />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors dark:text-gray-300 dark:hover:bg-gray-700"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Compare */}
            <Link
              href="/compare"
              className="relative p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Compare products"
            >
              <GitCompare className="w-5 h-5" />
              {compareCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {compareCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden lg:block text-sm font-medium max-w-[100px] truncate">
                    {user.displayName || 'Account'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 hidden lg:block" />
                </button>

                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20 animate-slide-down">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.displayName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/account"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <User className="w-4 h-4" /> My Profile
                      </Link>
                      <Link
                        href="/account/orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Package className="w-4 h-4" /> My Orders
                      </Link>
                      <Link
                        href="/account/addresses"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <MapPin className="w-4 h-4" /> Addresses
                      </Link>
                      {isAdminUser && (
                        <>
                          <div className="border-t border-gray-100 my-1" />
                          <Link
                            href="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-primary-600 hover:bg-primary-50 font-medium"
                          >
                            <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                          </Link>
                        </>
                      )}
                      <div className="border-t border-gray-100 my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1 -mb-px h-10">
          <Link
            href="/"
            className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors rounded-lg hover:bg-gray-50"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors rounded-lg hover:bg-gray-50"
          >
            About
          </Link>

          {/* Services Mega Menu */}
          <div
            className="relative"
            onMouseEnter={() => openMegaMenu('services')}
            onMouseLeave={closeMegaMenu}
          >
            <Link
              href="/services"
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors rounded-lg hover:bg-gray-50"
            >
              Services <ChevronDown className={`w-3.5 h-3.5 transition-transform ${megaMenuOpen === 'services' ? 'rotate-180' : ''}`} />
            </Link>
            {megaMenuOpen === 'services' && (
              <div className="absolute left-0 top-full mt-1 w-[420px] bg-white rounded-xl shadow-xl border border-gray-200 p-4 grid grid-cols-2 gap-1 z-50 animate-scale-in">
                {serviceItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    onClick={() => setMegaMenuOpen(null)}
                  >
                    <item.icon className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-gray-900 group-hover:text-primary-600">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Shop Mega Menu */}
          <div
            className="relative"
            onMouseEnter={() => openMegaMenu('shop')}
            onMouseLeave={closeMegaMenu}
          >
            <Link
              href="/products"
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors rounded-lg hover:bg-gray-50"
            >
              Shop <ChevronDown className={`w-3.5 h-3.5 transition-transform ${megaMenuOpen === 'shop' ? 'rotate-180' : ''}`} />
            </Link>
            {megaMenuOpen === 'shop' && (
              <div className="absolute left-0 top-full mt-1 w-[480px] bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-50 animate-scale-in">
                <div className="grid grid-cols-2 gap-1">
                  {productCategories.map((cat) => (
                    <Link
                      key={cat.name}
                      href={cat.href}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                      onClick={() => setMegaMenuOpen(null)}
                    >
                      <cat.icon className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 group-hover:text-primary-600">{cat.name}</div>
                        <div className="text-xs text-gray-500">{cat.desc}</div>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="border-t border-gray-100 mt-2 pt-2">
                  <Link
                    href="/products"
                    onClick={() => setMegaMenuOpen(null)}
                    className="flex items-center gap-2 p-3 rounded-lg hover:bg-primary-50 text-sm font-medium text-primary-600 transition-colors"
                  >
                    <Package className="w-4 h-4" /> Browse All Products
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/blog"
            className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors rounded-lg hover:bg-gray-50"
          >
            Blog
          </Link>
          <Link
            href="/faq"
            className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors rounded-lg hover:bg-gray-50"
          >
            FAQ
          </Link>
          <Link
            href="/contact"
            className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors rounded-lg hover:bg-gray-50"
          >
            Contact
          </Link>
        </nav>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white animate-slide-down">
          <div className="px-4 py-3">
            <form onSubmit={handleSearch} className="mb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </form>
            <div className="space-y-1">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">
                Home
              </Link>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">
                About
              </Link>

              {/* Services section */}
              <div className="py-1">
                <div className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Services</div>
                {serviceItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    <item.icon className="w-4 h-4 text-primary-600" />
                    {item.name}
                  </Link>
                ))}
              </div>

              <div className="border-t border-gray-200 my-2" />

              {/* Shop section */}
              <div className="py-1">
                <div className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Shop</div>
                <Link href="/products" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">
                  <Package className="w-4 h-4 text-primary-600" />
                  All Products
                </Link>
                {productCategories.map((cat) => (
                  <Link
                    key={cat.name}
                    href={cat.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    <cat.icon className="w-4 h-4 text-primary-600" />
                    {cat.name}
                  </Link>
                ))}
              </div>

              <div className="border-t border-gray-200 my-2" />
              <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">
                Blog
              </Link>
              <Link href="/faq" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">
                FAQ
              </Link>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">
                Contact
              </Link>

              {/* Quick call CTA */}
              <div className="border-t border-gray-200 mt-2 pt-3">
                <a
                  href="tel:0393144359"
                  className="flex items-center gap-2 px-3 py-2.5 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium"
                >
                  <Phone className="w-4 h-4" />
                  Call Us: 039 314 4359
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
