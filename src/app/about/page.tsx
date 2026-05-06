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
  title: 'About Us — Computer Repairs, IT Services & CCTV | Ramsgate KZN',
  description:
    'Unlimited4all T/A Unlimited IT Solutions — premier IT service provider in Ramsgate, KwaZulu-Natal since 2010. Computer repairs, Mac repairs, CCTV installations, networking, console repairs, managed IT services, and on-site technicians for homes and businesses.',
  alternates: {
    canonical: 'https://unlimitedits.co.za/about',
  },
  openGraph: {
    title: 'About Unlimited IT Solutions | Computer Repairs & IT Services | Ramsgate KZN',
    description: 'Your trusted IT partner since 2010. Computer & laptop repairs, CCTV, networking, console repairs, and managed IT services in Ramsgate, KwaZulu-Natal.',
  },
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
  { year: '2010', title: 'Founded', description: 'Opened our physical shop at 202 Marine Drive, Ramsgate, KwaZulu-Natal — offering computer repairs and IT support from day one.' },
  { year: '2013', title: 'Enterprise Contracts', description: 'Secured our first major enterprise IT infrastructure and managed services contract.' },
  { year: '2016', title: 'CCTV & Networking', description: 'Expanded into CCTV installations, network infrastructure, and on-site callout services.' },
  { year: '2019', title: '5000+ Clients', description: 'Reached the milestone of 5,000+ satisfied customers — from individual repairs to full business IT overhauls.' },
  { year: '2022', title: 'Console & Mac Repairs', description: 'Added specialised console repair (PlayStation, Xbox, Nintendo) and Apple Mac repair services.' },
  { year: '2026', title: 'Online Shop Launch', description: 'Launched our next-generation online store for hardware sales alongside our core repair and service operations.' },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-aurora text-white">
        <div className="absolute inset-0 animate-aurora opacity-90 pointer-events-none" />
        <div className="absolute inset-0 bg-grid pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-blue-500/25 blur-3xl animate-orb pointer-events-none" />
        <div className="absolute -bottom-32 right-0 w-[32rem] h-[32rem] rounded-full bg-purple-500/20 blur-3xl animate-orb pointer-events-none" style={{ animationDelay: '-7s' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <span className="eyebrow-chip">
                <Award className="w-3.5 h-3.5" />
                Established 2010
              </span>
              <h1 className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[0.98] tracking-tight">
                Built for South Africans <span className="text-gradient-premium">who can&apos;t afford downtime.</span>
              </h1>
              <p className="mt-7 text-lg sm:text-xl text-slate-300/90 max-w-2xl leading-relaxed">
                We&apos;re a Ramsgate-based IT firm engineered around one principle: enterprise-grade rigour with the speed of a local technician. Every repair, every device sold, every cable run — held to the standard of a billion-rand business.
              </p>
              <div className="mt-10 grid grid-cols-3 gap-4 max-w-lg">
                {[
                  { k: '15+', v: 'Years' },
                  { k: '5,000+', v: 'Repairs' },
                  { k: '4.9★', v: 'Rating' },
                ].map((s) => (
                  <div key={s.v} className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md px-4 py-3">
                    <div className="text-2xl font-extrabold text-white">{s.k}</div>
                    <div className="text-[0.7rem] uppercase tracking-wider text-slate-400 mt-0.5">{s.v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden lg:block lg:col-span-5">
              <div className="relative w-full h-[460px] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                <Image
                  src="https://images.unsplash.com/photo-1580106815433-a5b1d1d53d85?w=900&q=85"
                  alt="Our team working together"
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent" />
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
              Founded in 2010 in Ramsgate, KwaZulu-Natal, Unlimited IT Solutions
              started as a local computer repair shop with a mission: provide
              reliable, expert IT services that people and businesses can depend
              on. We opened our doors at 202 Marine Drive and quickly became the
              go-to destination for computer repairs, networking, and IT support
              on the South Coast.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Over the years we&apos;ve expanded into CCTV installations, console
              repairs (PlayStation, Xbox, Nintendo), Apple Mac repairs, server
              management, fine soldering, and managed IT services. Our team of
              experienced technicians provides on-site callouts and remote
              support across KwaZulu-Natal and beyond.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              As a certified reseller for Adobe, Microsoft, Norton, Kaspersky,
              and major hardware brands like Dell, HP, Lenovo, ASUS, and Apple,
              we offer both the products and the expertise to keep your
              technology running at its best.
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
                Our mission is to empower our clients through exceptional IT
                services, driving growth and efficiency by leveraging cutting-edge
                technology and unparalleled expertise. We strive to build lasting
                relationships based on trust, reliability, and mutual success.
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
            <Link href="/services">
              <Button size="lg" variant="outline">
                View Our Services
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
