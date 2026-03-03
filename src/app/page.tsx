'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui';
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
} from 'lucide-react';

const categories = [
  {
    name: 'Laptops',
    slug: 'laptops',
    icon: Laptop,
    description: 'Powerful laptops for work & play',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80',
    color: 'from-blue-500 to-blue-700',
  },
  {
    name: 'Desktops',
    slug: 'desktops',
    icon: Monitor,
    description: 'Custom builds & pre-built systems',
    image: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=400&q=80',
    color: 'from-purple-500 to-purple-700',
  },
  {
    name: 'Components',
    slug: 'components',
    icon: Cpu,
    description: 'GPUs, CPUs, RAM & more',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&q=80',
    color: 'from-orange-500 to-orange-700',
  },
  {
    name: 'Peripherals',
    slug: 'peripherals',
    icon: Mouse,
    description: 'Keyboards, mice & accessories',
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&q=80',
    color: 'from-green-500 to-green-700',
  },
];

const features = [
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Free shipping on orders over R2,500. Express delivery available nationwide.',
  },
  {
    icon: Shield,
    title: 'Secure Shopping',
    description: 'Your payment and personal data are protected with industry-standard encryption.',
  },
  {
    icon: Headphones,
    title: 'Expert Support',
    description: 'Our knowledgeable team is available Mon-Fri to help you find the right tech.',
  },
  {
    icon: CheckCircle,
    title: 'Quality Guarantee',
    description: 'All products come with manufacturer warranty and our satisfaction guarantee.',
  },
];

const testimonials = [
  {
    name: 'David M.',
    role: 'Business Owner',
    content: 'Unlimited IT Solutions provided our entire office with workstations. Excellent service and competitive pricing.',
    rating: 5,
  },
  {
    name: 'Sarah K.',
    role: 'Graphic Designer',
    content: 'Found the perfect high-performance laptop for my design work. The team helped me choose the right specs.',
    rating: 5,
  },
  {
    name: 'Andre V.',
    role: 'IT Manager',
    content: 'Reliable supplier for all our IT infrastructure needs. Their technical knowledge is outstanding.',
    rating: 5,
  },
];

export default function HomePage() {
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
                <span>Technology for Tomorrow</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                Your One-Stop
                <br />
                <span className="text-primary-300">Tech Shop</span>
              </h1>
              <p className="text-lg text-primary-100 max-w-lg mb-8 leading-relaxed">
                Discover cutting-edge computing technology. High-performance
                hardware for professionals and enthusiasts, all backed by expert
                support and reliable service.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/products">
                  <Button size="xl" className="bg-white text-primary-900 hover:bg-gray-100 shadow-lg">
                    Shop All Products
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="xl" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    Learn More
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
              <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=800&q=80"
                  alt="Modern computer hardware setup"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 0vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/40 to-transparent" />
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
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} opacity-75`} />
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <cat.icon className="w-8 h-8 text-white mb-3" />
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

      {/* Features Section */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="text-center p-6 rounded-2xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
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
                Need Help Choosing the Right Tech?
              </h2>
              <p className="text-primary-100 text-lg">
                Our experts are ready to help you find the perfect solution for your needs.
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
            Ready to Upgrade Your Tech?
          </h2>
          <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Unlimited IT
            Solutions for their technology needs.
          </p>
          <Link href="/products">
            <Button size="xl">
              Browse All Products
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
