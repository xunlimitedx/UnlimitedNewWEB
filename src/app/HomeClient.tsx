'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Badge } from '@/components/ui';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
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
  ChevronLeft,
  ShoppingCart,
  Package,
  Wrench,
  ExternalLink,
  Heart,
  Eye,
  Users,
  Clock,
  Award,
  TrendingUp,
} from 'lucide-react';

// ─── Animated counter component ───
function AnimatedCounter({ end, suffix = '', label }: { end: number; suffix?: string; label: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const start = performance.now();
          const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return (
    <div ref={ref}>
      <div className="text-3xl sm:text-4xl font-bold text-white">
        {count}
        {suffix}
      </div>
      <div className="text-sm text-primary-200 mt-1">{label}</div>
    </div>
  );
}

// ─── Testimonial carousel ───
function TestimonialCarousel({ testimonials }: { testimonials: typeof TESTIMONIALS }) {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, testimonials.length]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="w-full flex-shrink-0 px-4">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-2xl mx-auto">
                <div className="flex gap-1 mb-4 justify-center">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-lg text-center mb-6 leading-relaxed italic">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div className="text-center">
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === current ? 'bg-primary-600 w-8' : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to testimonial ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Product card with interactions ───
function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const wishlisted = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlisted) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist({
        productId: product.id,
        name: product.name,
        image: product.images?.[0] || '',
        price: product.price,
      });
      toast.success('Added to wishlist');
    }
  };

  const discount = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
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
          {discount > 0 && (
            <Badge variant="danger" className="absolute top-3 left-3">
              -{discount}%
            </Badge>
          )}
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleToggleWishlist}
              className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-colors ${
                wishlisted ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'
              }`}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
            </button>
            <Link
              href={`/products/${product.id}`}
              className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-md text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-colors"
              aria-label="Quick view"
            >
              <Eye className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </Link>
      <div className="p-5">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">
            {product.name}
          </h3>
        </Link>
        {product.rating && product.rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.round(product.rating!) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'
                }`}
              />
            ))}
            {product.reviewCount && (
              <span className="text-xs text-gray-400 ml-1">({product.reviewCount})</span>
            )}
          </div>
        )}
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
            onClick={handleAddToCart}
            disabled={(product.stock ?? 999) <= 0}
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
        {product.stock !== null && product.stock !== undefined && product.stock <= 5 && product.stock > 0 && (
          <p className="text-xs text-orange-600 mt-2 font-medium">Only {product.stock} left!</p>
        )}
      </div>
    </div>
  );
}

// ─── Brand logos ───
const BRANDS = ['Dell', 'HP', 'Lenovo', 'Apple', 'Microsoft', 'Adobe', 'Norton', 'Asus', 'Samsung', 'Intel', 'AMD', 'Logitech'];

function BrandTicker() {
  return (
    <div className="overflow-hidden">
      <div className="flex animate-scroll whitespace-nowrap">
        {[...BRANDS, ...BRANDS].map((brand, i) => (
          <div
            key={`${brand}-${i}`}
            className="inline-flex items-center justify-center px-8 py-4 mx-4 text-gray-400 font-bold text-lg tracking-wider uppercase opacity-50 hover:opacity-100 transition-opacity"
          >
            {brand}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Data ───
const CATEGORIES = [
  { name: 'Laptops', slug: 'laptops', icon: Laptop, description: 'Powerful laptops for work & play', color: 'from-blue-500 to-blue-700' },
  { name: 'Desktops', slug: 'desktops', icon: Monitor, description: 'Custom builds & pre-built systems', color: 'from-purple-500 to-purple-700' },
  { name: 'Components', slug: 'components', icon: Cpu, description: 'GPUs, CPUs, RAM & more', color: 'from-orange-500 to-orange-700' },
  { name: 'Peripherals', slug: 'peripherals', icon: Mouse, description: 'Keyboards, mice & accessories', color: 'from-green-500 to-green-700' },
];

const FEATURES = [
  { icon: Wrench, title: 'Expert Repairs', description: 'Computer, laptop, Mac, and console repairs by experienced technicians at our Ramsgate shop.', href: '/services/computer-repairs' },
  { icon: Shield, title: 'CCTV & Security', description: 'Professional CCTV installation, maintenance, and remote monitoring for homes and businesses.', href: '/services/cctv-installation' },
  { icon: Headphones, title: 'On-site & Remote Support', description: 'Callout technicians for on-site repairs and installations, plus nationwide remote support.', href: '/services' },
  { icon: CheckCircle, title: 'Certified Reseller', description: 'Authorised reseller for Adobe, Microsoft, Norton, McAfee, Kaspersky, and more.', href: '/products' },
];

const TESTIMONIALS = [
  { name: 'Tracy Gaylord', role: 'Google Review', content: 'Highly recommended! The service is exemplary! They go above and beyond!', rating: 5 },
  { name: 'Pierre van Jaarsveld', role: 'Google Review', content: 'Great service, very patient. Would highly suggest Unlimited IT Solutions for all your computer or IT related issues. This is how a local business is run.', rating: 5 },
  { name: 'Edward Crankshaw', role: 'Google Review', content: 'Friendly service and competent staff. Pricing is good.', rating: 5 },
  { name: 'Anita Murray', role: 'Google Review', content: 'Fantastic service and very reasonable prices. I highly recommend this store!', rating: 5 },
  { name: 'Toby Ahlers', role: 'Google Review', content: 'Friendly and knowledgeable staff.', rating: 5 },
  { name: 'Memory Pieterse', role: 'Google Review', content: 'These guys are very professional and know exactly what they\u2019re doing. Their work is fast and efficient. They fixed my Dell and Packard laptops. They also offer a complete range of internet / WiFi services at competitive prices, which includes satellite.', rating: 5 },
];

const TRUST_BADGES = [
  { icon: Truck, text: 'Free shipping over R2,500' },
  { icon: Shield, text: 'Secure checkout' },
  { icon: Clock, text: 'Mon-Fri 8am-5pm' },
  { icon: Award, text: '15+ years experience' },
];

interface HomeClientProps {
  latestProducts: Product[];
}

export default function HomeClient({ latestProducts }: HomeClientProps) {
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
              {/* Stats */}
              <div className="flex items-center gap-8 mt-10 pt-8 border-t border-white/10">
                <AnimatedCounter end={15} suffix="+" label="Years Experience" />
                <AnimatedCounter end={5000} suffix="+" label="Happy Clients" />
                <AnimatedCounter end={10000} suffix="+" label="Products Sold" />
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="relative w-full h-[500px] flex items-center justify-center">
                <img
                  src="/images/hero-tech.svg"
                  alt="Technology workstation illustration"
                  className="w-full h-full object-contain drop-shadow-2xl animate-float"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TRUST_BADGES.map((badge) => (
              <div key={badge.text} className="flex items-center gap-3 justify-center py-2">
                <badge.icon className="w-5 h-5 text-primary-600 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Shop by Category</h2>
            <p className="text-gray-500 max-w-lg mx-auto">Browse our carefully curated categories to find exactly what you need.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map((cat) => (
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

      {/* Latest Products */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Latest Products</h2>
              <p className="text-gray-500">Check out our newest arrivals and top picks.</p>
            </div>
            <Link href="/products">
              <Button variant="outline" className="hidden sm:flex">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {latestProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No products available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {latestProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
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

      {/* Features */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map((feature) => (
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
                <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                <span className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ChevronRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Ticker */}
      <section className="py-8 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
          <p className="text-center text-sm text-gray-400 uppercase tracking-wider font-medium">Trusted brands we carry</p>
        </div>
        <BrandTicker />
      </section>

      {/* CTA Banner */}
      <section className="bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-white">
              <h2 className="text-3xl font-bold mb-2">Need a Repair or IT Solution?</h2>
              <p className="text-primary-100 text-lg">Walk in to our Ramsgate shop or call us — our technicians are ready to help.</p>
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
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">What Our Customers Say</h2>
            <p className="text-gray-500 max-w-lg mx-auto">Don&apos;t just take our word for it — hear from our satisfied customers.</p>
          </div>
          <TestimonialCarousel testimonials={TESTIMONIALS} />
          <div className="text-center mt-10">
            <a
              href="https://www.google.com/maps/place/Unlimited+IT+Solutions/@-30.878246,30.3545,17z/data=!4m8!3m7!1s0x1ef6b9f6a9c59a3b:0x7f4e8e12345!8m2!3d-30.878246!4d30.357!9m1!1b1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              See all reviews on Google
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Ready to Get Your Tech Sorted?</h2>
          <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
            Whether it&apos;s a laptop repair, CCTV installation, or managed IT for your business — Unlimited IT Solutions has you covered.
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
