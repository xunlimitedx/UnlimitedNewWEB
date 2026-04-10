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
import BeforeAfterGallery from '@/components/BeforeAfterGallery';
import CustomerCounter from '@/components/CustomerCounter';
import SocialFeed from '@/components/SocialFeed';
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
  ExternalLink,
  Heart,
  Eye,
  Clock,
  Award,
  Smartphone,
  Gamepad2,
  Network,
  Camera,
  Send,
  PackageCheck,
  RotateCcw,
  MapPin,
  Phone,
  Printer,
  HardDrive,
  CircuitBoard,
  Bot,
  Code,
  BarChart3,
  Briefcase,
  Rocket,
  Cloud,
} from 'lucide-react';

// ─── Animated counter ───
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
    <div ref={ref} className="text-center">
      <div className="text-3xl sm:text-4xl font-extrabold text-white">
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
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 max-w-2xl mx-auto">
                <div className="flex gap-1 mb-4 justify-center">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-lg text-center mb-6 leading-relaxed italic">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div className="text-center">
                  <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
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

// ─── Product card ───
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
    <div className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <Link href={`/products/${product.id}`}>
        <div className="relative h-52 bg-gray-100 dark:bg-gray-700 overflow-hidden">
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
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors line-clamp-2 mb-2 text-sm">
            {product.name}
          </h3>
        </Link>
        {product.rating && product.rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.round(product.rating!) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'
                }`}
              />
            ))}
            {product.reviewCount && (
              <span className="text-xs text-gray-400 ml-1">({product.reviewCount})</span>
            )}
          </div>
        )}
        <div className="flex items-center justify-between mt-2">
          <div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {formatCurrency(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs text-gray-400 line-through ml-2">
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
      </div>
    </div>
  );
}

// ─── Brand ticker ───
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
const SERVICE_CATEGORIES = [
  {
    heading: 'IT & Technical Services',
    services: [
      { icon: Laptop, title: 'Computer & Laptop Repairs', description: 'Sales, repairs & upgrades for all major brands.', href: '/services/computer-repairs', color: 'bg-blue-500' },
      { icon: Network, title: 'Networks & Wi-Fi', description: 'Network installations, fibre, Wi-Fi & cabling.', href: '/services/networking', color: 'bg-green-600' },
      { icon: Shield, title: 'Cybersecurity', description: 'Data protection, antivirus & security audits.', href: '/services', color: 'bg-red-700' },
      { icon: Camera, title: 'CCTV & Cameras', description: 'Camera systems, DVR/NVR & remote monitoring.', href: '/services/cctv-installation', color: 'bg-red-600' },
      { icon: Printer, title: 'Printer Services', description: 'Printer sales, setup, repairs & supplies.', href: '/services', color: 'bg-teal-600' },
      { icon: Cloud, title: 'Cloud & Backups', description: 'Cloud solutions, automated backups & recovery.', href: '/services', color: 'bg-sky-600' },
      { icon: Headphones, title: 'Callouts & Remote Support', description: 'On-site technicians & nationwide remote support.', href: '/services', color: 'bg-orange-500' },
    ],
  },
  {
    heading: 'Advanced & Specialized',
    services: [
      { icon: HardDrive, title: 'Data Recovery', description: 'Lost or damaged files recovered from any device.', href: '/services', color: 'bg-amber-600' },
      { icon: CircuitBoard, title: 'Electronics Repair', description: 'Board-level repair, capacitors & microcontrollers.', href: '/services', color: 'bg-violet-600' },
      { icon: Gamepad2, title: 'Console Repairs', description: 'PlayStation, Xbox & Nintendo Switch repairs.', href: '/services/console-repairs', color: 'bg-purple-600' },
      { icon: Smartphone, title: 'Mac & Apple Repairs', description: 'MacBook, iMac & Mac Mini specialist repairs.', href: '/services/mac-repairs', color: 'bg-gray-800' },
      { icon: Bot, title: 'Robotics Solutions', description: 'Robotics integration & automation systems.', href: '/services', color: 'bg-cyan-600' },
      { icon: Code, title: 'Custom Software', description: 'Bespoke software development & integrations.', href: '/services', color: 'bg-indigo-600' },
    ],
  },
  {
    heading: 'Business Solutions',
    services: [
      { icon: BarChart3, title: 'POS Systems', description: 'Point-of-sale sales, setup & ongoing support.', href: '/services', color: 'bg-emerald-600' },
      { icon: Briefcase, title: 'Business Management', description: 'Complete business technology & management solutions.', href: '/services', color: 'bg-slate-700' },
      { icon: Code, title: 'Custom Software Solutions', description: 'Tailored business software built to your needs.', href: '/services', color: 'bg-indigo-700' },
      { icon: Rocket, title: 'UBOSS', description: 'Our powerful all-in-one business management software.', href: '/services', color: 'bg-primary-600' },
    ],
  },
];

const MAIL_IN_STEPS = [
  {
    step: 1,
    icon: Phone,
    title: 'Contact Us',
    description: 'Call or WhatsApp us to describe the problem. We\'ll give you a free estimate and our shipping address.',
  },
  {
    step: 2,
    icon: Send,
    title: 'Ship Your Device',
    description: 'Pack your device securely and send it to our Ramsgate workshop via courier or Post Office.',
  },
  {
    step: 3,
    icon: Wrench,
    title: 'We Repair It',
    description: 'Our technicians diagnose and repair your device. We keep you updated every step of the way.',
  },
  {
    step: 4,
    icon: PackageCheck,
    title: 'Shipped Back to You',
    description: 'Once repaired and tested, we safely package and ship your device right back to your door.',
  },
];

const CATEGORIES = [
  { name: 'Laptops', slug: 'laptops', icon: Laptop, color: 'from-blue-500 to-blue-700' },
  { name: 'Desktops', slug: 'desktops', icon: Monitor, color: 'from-purple-500 to-purple-700' },
  { name: 'Components', slug: 'components', icon: Cpu, color: 'from-orange-500 to-orange-700' },
  { name: 'Peripherals', slug: 'peripherals', icon: Mouse, color: 'from-green-500 to-green-700' },
];

const TESTIMONIALS = [
  { name: 'Tracy Gaylord', role: 'Google Review', content: 'Highly recommended! The service is exemplary! They go above and beyond!', rating: 5 },
  { name: 'Pierre van Jaarsveld', role: 'Google Review', content: 'Great service, very patient. Would highly suggest Unlimited IT Solutions for all your computer or IT related issues. This is how a local business is run.', rating: 5 },
  { name: 'Edward Crankshaw', role: 'Google Review', content: 'Friendly service and competent staff. Pricing is good.', rating: 5 },
  { name: 'Anita Murray', role: 'Google Review', content: 'Fantastic service and very reasonable prices. I highly recommend this store!', rating: 5 },
  { name: 'Toby Ahlers', role: 'Google Review', content: 'Friendly and knowledgeable staff.', rating: 5 },
  { name: 'Memory Pieterse', role: 'Google Review', content: 'These guys are very professional and know exactly what they\u2019re doing. Their work is fast and efficient. They fixed my Dell and Packard laptops. They also offer a complete range of internet / WiFi services at competitive prices, which includes satellite.', rating: 5 },
];

interface HomeClientProps {
  latestProducts: Product[];
}

export default function HomeClient({ latestProducts }: HomeClientProps) {
  return (
    <div>
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden bg-gray-950">
        {/* Background pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-gray-900 to-gray-950" />
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234f46e5' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
          {/* Glow effects */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-primary-500/20 border border-primary-400/30 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm text-primary-200 mb-8">
              <Zap className="w-4 h-4" />
              <span>IT Repairs &bull; Software &bull; Business Solutions &bull; Since 2010</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
              Advanced Technology.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-blue-400">
                Complete Solutions.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-xl mb-10 leading-relaxed">
              From IT support &amp; repairs to custom software &amp; business systems — we power your home and your business. <strong className="text-white">Mail-in repairs from anywhere in South Africa.</strong>
            </p>
            <div className="flex flex-wrap gap-4 mb-12">
              <Link href="/services">
                <Button size="xl" className="bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-600/25 text-base px-8">
                  Our Repair Services
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="xl" variant="outline" className="border-gray-600 text-gray-200 hover:bg-white/10 hover:border-gray-400 text-base px-8">
                  Get a Free Quote
                </Button>
              </Link>
            </div>

            {/* Quick contact strip */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
              <a href="tel:0393144359" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-primary-400" />
                039 314 4359
              </a>
              <a href="tel:0825569875" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-primary-400" />
                082 556 9875
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary-400" />
                202 Marine Drive, Ramsgate
              </span>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-16 pt-10 border-t border-white/10">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
              <AnimatedCounter end={15} suffix="+" label="Years Experience" />
              <AnimatedCounter end={5000} suffix="+" label="Devices Repaired" />
              <AnimatedCounter end={4.9} suffix="★" label="Google Rating" />
              <AnimatedCounter end={100} suffix="%" label="Satisfaction" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ TRUST BADGES ═══════════ */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Wrench, text: 'Walk-in & mail-in repairs' },
              { icon: Shield, text: 'All repairs guaranteed' },
              { icon: Clock, text: 'Mon–Fri 8am–5pm' },
              { icon: Award, text: '15+ years experience' },
            ].map((badge) => (
              <div key={badge.text} className="flex items-center gap-3 justify-center py-2">
                <badge.icon className="w-5 h-5 text-primary-600 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ SERVICES ═══════════ */}
      {SERVICE_CATEGORIES.map((category, catIdx) => (
        <section key={category.heading} className={`section-padding ${catIdx % 2 === 0 ? 'bg-gray-50 dark:bg-gray-900' : 'bg-white dark:bg-gray-800'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-primary-600 font-semibold text-sm uppercase tracking-wider mb-2">
                {catIdx === 0 ? 'What We Do' : catIdx === 1 ? 'Specialized' : 'For Business'}
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                {category.heading}
              </h2>
            </div>

            <div className={`grid grid-cols-1 sm:grid-cols-2 ${category.services.length <= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3 xl:grid-cols-4'} gap-5`}>
              {category.services.map((service) => (
                <Link
                  key={service.title}
                  href={service.href}
                  className="group relative bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className={`w-11 h-11 ${service.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <service.icon className="w-5 h-5 text-white animate-service-icon" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* ═══════════ MAIL-IN REPAIRS ═══════════ */}
      <section className="section-padding bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 text-white relative overflow-hidden">
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='0.1'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm text-primary-200 mb-4">
              <Truck className="w-4 h-4" />
              <span>Nationwide Service</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
              Mail-In Repairs — All of South Africa
            </h2>
            <p className="text-primary-100 max-w-2xl mx-auto text-lg">
              Can&apos;t make it to our Ramsgate shop? No problem. Send us your broken laptop, PC, Mac, or console from <strong className="text-white">anywhere in South Africa</strong> and we&apos;ll fix it and ship it back.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {MAIL_IN_STEPS.map((item) => (
              <div key={item.step} className="relative text-center">
                {/* Connector line */}
                {item.step < 4 && (
                  <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-primary-400/30">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-primary-400/30 rotate-45" />
                  </div>
                )}
                <div className="relative inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-5 border border-white/20">
                  <item.icon className="w-8 h-8 text-primary-300" />
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-primary-500 rounded-full flex items-center justify-center text-xs font-bold">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-primary-200 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="bg-white text-primary-900 hover:bg-gray-100 shadow-lg font-semibold">
                  Request a Mail-In Repair
                  <Send className="w-4 h-4" />
                </Button>
              </Link>
              <a href="https://wa.me/27825569875?text=Hi%2C%20I%20want%20to%20send%20my%20device%20for%20repair" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  WhatsApp Us
                </Button>
              </a>
            </div>
            <p className="text-primary-300 text-sm mt-4">Free diagnostic &bull; No fix, no fee &bull; Insured shipping available</p>
          </div>
        </div>
      </section>

      {/* ═══════════ WHY CHOOSE US ═══════════ */}
      <section className="section-padding bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-primary-600 font-semibold text-sm uppercase tracking-wider mb-2">Why Choose Us</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-6">
                The South Coast&apos;s Most Trusted IT Shop
              </h2>
              <div className="space-y-5">
                {[
                  { title: 'Experienced technicians', desc: 'Our team has 15+ years of hands-on repair experience across all major brands.' },
                  { title: 'Transparent pricing', desc: 'Free diagnostics and upfront quotes — no hidden fees, no surprises.' },
                  { title: 'Quality parts', desc: 'We use genuine and OEM-quality parts with a warranty on all repairs.' },
                  { title: 'Fast turnaround', desc: 'Most repairs completed within 24–48 hours. Express service available.' },
                  { title: 'Nationwide mail-in', desc: 'Can\'t visit us? Ship your device from anywhere in SA for expert repair.' },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link href="/about">
                  <Button variant="outline" className="font-semibold">
                    About Our Team <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-100 to-blue-50 dark:from-primary-900/30 dark:to-blue-900/20 rounded-3xl p-8 lg:p-12">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { value: '15+', label: 'Years in Business', icon: Award },
                    { value: '5000+', label: 'Devices Repaired', icon: Wrench },
                    { value: '4.9★', label: 'Google Rating', icon: Star },
                    { value: '48hrs', label: 'Avg Turnaround', icon: Zap },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-2xl p-5 text-center shadow-sm">
                      <stat.icon className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                      <div className="text-2xl font-extrabold text-gray-900 dark:text-white">{stat.value}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ TESTIMONIALS ═══════════ */}
      <section className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-wider mb-2">Reviews</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
              What Our Customers Say
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
              Don&apos;t just take our word for it — hear from our satisfied customers.
            </p>
          </div>
          <TestimonialCarousel testimonials={TESTIMONIALS} />
          <div className="text-center mt-10">
            <a
              href="https://www.google.com/maps/place/Unlimited+IT+Solutions/@-30.873927,30.3620552,17z/data=!3m1!4b1!4m6!3m5!1s0x1e58ba7e50dfcdb7:0xcb1d92d923cbc399!8m2!3d-30.873927!4d30.3620552!16s%2Fg%2F119v4lr0x"
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

      {/* ═══════════ CTA BANNER ═══════════ */}
      <section className="bg-gray-900 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-white">
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">
                Got a Broken Device?
              </h2>
              <p className="text-gray-400 text-lg">
                Walk in, call, WhatsApp, or mail it in — we&apos;ll get it sorted.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact">
                <Button size="lg" className="bg-primary-600 hover:bg-primary-500 text-white shadow-lg">
                  Contact Us
                </Button>
              </Link>
              <a href="tel:0393144359">
                <Button size="lg" variant="outline" className="border-gray-600 text-gray-200 hover:bg-white/10">
                  Call 039 314 4359
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ ONLINE SHOP TEASER ═══════════ */}
      <section className="section-padding bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-wider mb-2">Online Store</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
              Shop Tech &amp; Accessories
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              Browse our selection of laptops, components, peripherals, and software — delivered to your door.
            </p>
          </div>

          {/* Category cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`h-32 sm:h-40 bg-gradient-to-br ${cat.color} flex flex-col items-center justify-center p-4`}>
                  <cat.icon className="w-10 h-10 text-white/80 mb-2 group-hover:scale-110 transition-transform" />
                  <h3 className="text-white font-bold text-lg">{cat.name}</h3>
                  <span className="text-white/70 text-xs mt-1 flex items-center gap-1 group-hover:text-white transition-colors">
                    Browse <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Latest products */}
          {latestProducts.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Latest Arrivals</h3>
                <Link href="/products">
                  <Button variant="outline" size="sm" className="hidden sm:flex">
                    View All <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {latestProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <div className="text-center mt-8 sm:hidden">
                <Link href="/products">
                  <Button variant="outline">
                    View All Products <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ═══════════ BEFORE & AFTER ═══════════ */}
      <section className="section-padding bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-wider mb-2">Our Work</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
              Before &amp; After
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
              Drag the slider to see the transformation. Real repairs from our workshop.
            </p>
          </div>
          <BeforeAfterGallery />
          <CustomerCounter className="mt-12" />
        </div>
      </section>

      {/* ═══════════ SOCIAL FEED ═══════════ */}
      <section className="section-padding bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-wider mb-2">Stay Connected</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
              Latest From Our Socials
            </h2>
          </div>
          <SocialFeed />
          <div className="text-center mt-8">
            <a
              href="https://www.facebook.com/unlimiteditsolutions"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              Follow us on Facebook
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════ BRANDS ═══════════ */}
      <section className="py-8 bg-gray-50 dark:bg-gray-800 border-y border-gray-100 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
          <p className="text-center text-sm text-gray-400 uppercase tracking-wider font-medium">Brands We Service &amp; Sell</p>
        </div>
        <BrandTicker />
      </section>

      {/* ═══════════ FINAL CTA ═══════════ */}
      <section className="section-padding bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            Ready to Get Your Tech Sorted?
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Whether it&apos;s a repair, CCTV installation, network setup, or managed IT for your business — we&apos;re here to help. Walk in or ship it to us from anywhere in South Africa.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <Button size="xl" className="font-semibold">
                Contact Us Today
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/services">
              <Button size="xl" variant="outline" className="font-semibold">
                View All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
