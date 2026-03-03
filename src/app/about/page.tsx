import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui';
import {
  Target,
  Eye,
  Heart,
  Users,
  Award,
  ArrowRight,
  Shield,
  Zap,
  Headphones,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Unlimited IT Solutions — your trusted partner for business technology since 2010. Serving thousands of clients across South Africa.',
};

const values = [
  {
    icon: Shield,
    title: 'Trust & Reliability',
    description:
      'We build lasting partnerships through transparent practices and dependable service delivery.',
  },
  {
    icon: Zap,
    title: 'Innovation',
    description:
      'We constantly explore emerging technologies to bring cutting-edge solutions to our clients.',
  },
  {
    icon: Users,
    title: 'Customer First',
    description:
      'Every decision we make starts with how it will benefit and serve our customers better.',
  },
  {
    icon: Headphones,
    title: 'Expert Support',
    description:
      'Our knowledgeable team provides personalized guidance to help you make the right tech choices.',
  },
];

const milestones = [
  { year: '2010', title: 'Founded', description: 'Started operations in Ramsgate, KwaZulu-Natal.' },
  { year: '2013', title: 'First Major Contract', description: 'Secured our first enterprise client for a full IT infrastructure deployment.' },
  { year: '2016', title: 'Online Expansion', description: 'Launched our e-commerce platform to serve customers nationwide.' },
  { year: '2019', title: '5000+ Clients', description: 'Reached the milestone of serving over 5,000 satisfied customers.' },
  { year: '2022', title: 'AI Integration', description: 'Integrated AI-powered tools for smarter logistics and customer service.' },
  { year: '2026', title: 'Unlimited IT Solutions', description: 'Launched the next-generation e-commerce experience.' },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative gradient-hero text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6">
                About <span className="text-primary-300">Unlimited IT</span>
              </h1>
              <p className="text-lg text-primary-100 max-w-lg leading-relaxed">
                Are you in search of reliable, expert solutions for all your
                technology needs? Unlimited IT Solutions is your one-stop
                destination for all things tech and security.
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1580106815433-a5b1d1d53d85?w=800&q=80"
                  alt="Our team working together"
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Founded in 2010, Unlimited IT Solutions started with a simple
              mission: to provide businesses with powerful, reliable, and
              scalable technology solutions. We saw a gap in the market for a
              provider that not only delivered cutting-edge hardware but also
              fostered long-term partnerships built on trust and exceptional
              service.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Over the past decade, we&apos;ve grown from a small startup into a
              leading national provider of IT infrastructure, serving thousands
              of clients across various industries. Our commitment to innovation
              and customer satisfaction remains at the core of everything we do.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                Our mission is to empower businesses by providing them with the
                technological tools and expertise they need to thrive in a
                digital world. We believe that the right technology can unlock
                immense potential, driving efficiency, innovation, and growth.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed italic text-lg">
                &ldquo;To be the most trusted partner for business technology,
                from the startup in a garage to the enterprise in the cloud.&rdquo;
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                We envision a future where every business, regardless of size,
                has access to enterprise-grade technology solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Our Values</h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              The principles that guide everything we do.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="text-center p-6 rounded-2xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Our Journey</h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Key milestones in our growth and evolution.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary-200" />
              <div className="space-y-8">
                {milestones.map((milestone) => (
                  <div key={milestone.year} className="relative flex gap-6">
                    <div className="flex-shrink-0 w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-sm z-10 shadow-lg">
                      {milestone.year}
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex-1 mt-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {milestone.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { value: '15+', label: 'Years in Business' },
              { value: '5,000+', label: 'Satisfied Clients' },
              { value: '10,000+', label: 'Products Sold' },
              { value: '99%', label: 'Customer Satisfaction' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl sm:text-4xl font-extrabold mb-1">
                  {stat.value}
                </div>
                <div className="text-primary-200 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Ready to Work With Us?
          </h2>
          <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
            Whether you need a single laptop or an entire IT infrastructure, we&apos;re
            here to help. Get in touch today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <Button size="lg">
                Get in Touch
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/products">
              <Button size="lg" variant="outline">
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
