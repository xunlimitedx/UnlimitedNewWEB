'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Badge } from '@/components/ui';
import { useProducts } from '@/hooks/useProducts';
import { useCartStore } from '@/store/cartStore';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { Product } from '@/types';
import {
  ArrowRight,
  Laptop,
  Monitor,
  Cpu,
  Mouse,
  Shield,
  Truck,
  Headphones,
  Star,
  Zap,
  CheckCircle,
  ChevronRight,
  ShoppingCart,
  Package,
  Wrench,
} from 'lucide-react';

const categories = [
  {
    name: 'Laptops',
    slug: 'laptops',
    icon: Laptop,
    description: 'Powerful laptops for work & play',
    color: 'from-blue-500 to-blue-700',
  },
  {
    name: 'Desktops',
    slug: 'desktops',
    icon: Monitor,
    description: 'Custom builds & pre-built systems',
    color: 'from-purple-500 to-purple-700',
  },
  {
    name: 'Components',
    slug: 'components',
    icon: Cpu,
    description: 'GPUs, CPUs, RAM & more',
    color: 'from-orange-500 to-orange-700',
  },
  {
    name: 'Peripherals',
    slug: 'peripherals',
    icon: Mouse,
    description: 'Keyboards, mice & accessories',
    color: 'from-green-500 to-green-700',
  },
];

const features = [
  {
    icon: Wrench,
    title: 'Expert Repairs',
    description: 'Computer, laptop, Mac, and console repairs by experienced technicians at our Ramsgate shop.',
    href: '/services/computer-repairs',
  },
  {
    icon: Shield,
    title: 'CCTV & Security',
    description: 'Professional CCTV installation, maintenance, and remote monitoring for homes and businesses.',
    href: '/services/cctv-installation',
  },
  {
    icon: Headphones,
    title: 'On-site & Remote Support',
    description: 'Callout technicians for on-site repairs and installations, plus nationwide remote support.',
    href: '/services',
  },
  {
    icon: CheckCircle,
    title: 'Certified Reseller',
    description: 'Authorised reseller for Adobe, Microsoft, Norton, McAfee, Kaspersky, and more.',
    href: '/products',
  },
];

const testimonials = [
  {
    name: 'David M.',
    role: 'Business Owner',
    content: 'Unlimited IT Solutions set up our entire CCTV system and network infrastructure. Professional, reliable, and great after-sales support.',
    rating: 5,
  },
  {
    name: 'Sarah K.',
    role: 'Graphic Designer',
    content: 'Had my MacBook repaired quickly and at a fair price. They also set me up with Adobe Creative Cloud. Highly recommend!',
    rating: 5,
  },
  {
    name: 'Andre V.',
    role: 'IT Manager',
    content: 'We use their managed IT services for our office — proactive monitoring, scheduled maintenance, the works. Outstanding technical knowledge.',
    rating: 5,
  },
];

export default function HomePage() {
  const { products: latestProducts, loading: productsLoading } = useProducts({ pageSize: 8, sortBy: 'newest' });
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      name: product.name,
      image: product.images?.[0] || '',
      price: product.price,
      quantity: 1,
      stock: product.stock ?? 999,
      sku: product.sku || '',
    });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative gradient-hero text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 50%, rgba(255,255,255,0.05) 0%, transparent 50%)',
          }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm mb-6">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span>Computer Repairs &bull; CCTV &bull; Networking &bull; IT Support</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                IT Repairs &amp;
                <br />
                <span className="text-primary-300">Solutions Experts</span>
              </h1>
              <p className="text-lg text-primary-100 max-w-lg mb-8 leading-relaxed">
                Walk-in computer, Mac &amp; console repairs. CCTV installations,
                network setups, and managed IT services — all from our shop
                in Ramsgate, KZN. Serving the South Coast since 2010.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/services">
                  <Button size="xl" className="bg-white text-primary-900 hover:bg-gray-100 shadow-lg">
                    View Our Services
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="xl" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    Get a Quote
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-8 mt-10 pt-8 border-t border-white/10">
                <div>
                  <div className="text-2xl font-bold">15+</div>
                  <div className="text-sm text-primary-200">Years Experience</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">5000+</div>
                  <div className="text-sm text-primary-200">Happy Clients</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">10K+</div>
                  <div className="text-sm text-primary-200">Products Sold</div>
                </div>
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="relative w-full h-[500px] flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/hero-tech.svg"
                  alt="Technology workstation illustration"
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Shop by Category
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Browse our carefully curated categories to find exactly what you need.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-64">
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} rounded-2xl`} />
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.3) 0%, transparent 50%)' }} />
                  </div>
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <cat.icon className="w-12 h-12 text-white/80 mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-bold text-white mb-1">{cat.name}</h3>
                    <p className="text-white/80 text-sm">{cat.description}</p>
                    <div className="flex items-center gap-1 mt-3 text-white/90 text-sm font-medium group-hover:translate-x-1 transition-transform">
                      Browse <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Products Section */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Latest Products
              </h2>
              <p className="text-gray-500">
                Check out our newest arrivals and top picks.
              </p>
            </div>
            <Link href="/products">
              <Button variant="outline" className="hidden sm:flex">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
                  <div className="w-full h-56 bg-gray-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-6 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : latestProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No products available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {latestProducts.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <Link href={`/products/${product.id}`}>
                    <div className="relative h-56 bg-gray-100 overflow-hidden">
                      {product.images?.[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-12 h-12 text-gray-300" />
                        </div>
                      )}
                      {product.compareAtPrice && product.compareAtPrice > product.price && (
                        <Badge variant="danger" className="absolute top-3 left-3">
                          -{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
                        </Badge>
                      )}
                    </div>
                  </Link>
                  <div className="p-5">
                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center justify-between mt-3">
                      <div>
                        <span className="text-xl font-bold text-gray-900">
                          {formatCurrency(product.price)}
                        </span>
                        {product.compareAtPrice && product.compareAtPrice > product.price && (
                          <span className="text-sm text-gray-400 line-through ml-2">
                            {formatCurrency(product.compareAtPrice)}
                          </span>
                        )}
                      </div>
                      <Button
                        size="icon"
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart(product);
                        }}
                        disabled={(product.stock ?? 999) <= 0}
                        aria-label="Add to cart"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-8 sm:hidden">
            <Link href="/products">
              <Button variant="outline">
                View All Products <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <Link
                key={feature.title}
                href={feature.href}
                className="text-center p-6 rounded-2xl hover:bg-gray-50 transition-colors group"
              >
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
                  <feature.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
                <span className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ChevronRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-white">
              <h2 className="text-3xl font-bold mb-2">
                Need a Repair or IT Solution?
              </h2>
              <p className="text-primary-100 text-lg">
                Walk in to our Ramsgate shop or call us — our technicians are ready to help.
              </p>
            </div>
            <div className="flex gap-4">
              <Link href="/contact">
                <Button size="lg" className="bg-white text-primary-700 hover:bg-gray-100 shadow-lg">
                  Contact Us
                </Button>
              </Link>
              <a href="tel:0393144359">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  Call Now
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              What Our Customers Say
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Don&apos;t just take our word for it — hear from our satisfied customers.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div>
                  <p className="font-semibold text-gray-900">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Ready to Get Your Tech Sorted?
          </h2>
          <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
            Whether it&apos;s a laptop repair, CCTV installation, or managed IT for your business
            — Unlimited IT Solutions has you covered.
          </p>
          <Link href="/contact">
            <Button size="xl">
              Contact Us Today
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
