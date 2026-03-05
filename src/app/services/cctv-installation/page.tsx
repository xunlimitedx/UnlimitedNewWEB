import type { Metadata } from 'next';
import Link from 'next/link';
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd';
import { ArrowRight, Camera, Shield, Wifi, Smartphone, Monitor, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'CCTV Installation & Maintenance — Ramsgate, KZN South Coast',
  description:
    'Professional CCTV installation, maintenance, and monitoring in Ramsgate and the KZN South Coast. IP cameras, DVR/NVR setup, remote viewing, home and business security systems. Call 039 314 4359.',
  keywords: [
    'CCTV installation Ramsgate', 'CCTV installer South Coast', 'security cameras KZN',
    'IP camera installation', 'CCTV maintenance Margate', 'DVR NVR setup',
    'remote CCTV monitoring', 'home security cameras Ramsgate', 'business CCTV KZN',
    'CCTV installer near me', 'security system installation Port Shepstone',
  ],
  openGraph: {
    title: 'CCTV Installation & Maintenance | Unlimited IT Solutions — Ramsgate, KZN',
    description: 'Professional CCTV installation for homes and businesses on the KZN South Coast.',
  },
  alternates: { canonical: 'https://unlimitedits.co.za/services/cctv-installation' },
};

export default function CCTVPage() {
  return (
    <div>
      <BreadcrumbJsonLd items={[
        { name: 'Home', href: '/' },
        { name: 'Services', href: '/services' },
        { name: 'CCTV Installation' },
      ]} />
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">CCTV Installation &amp; Maintenance</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Protect your home or business with professionally installed CCTV systems. We design, install, and maintain security camera systems across the KZN South Coast.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Our CCTV Services</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { icon: Camera, title: 'New Installations', desc: 'Complete CCTV system design and installation — site survey, camera placement, cabling, DVR/NVR setup, and configuration.' },
              { icon: Smartphone, title: 'Remote Viewing', desc: 'View your cameras from anywhere on your phone, tablet, or computer. We set up apps and configure remote access securely.' },
              { icon: Shield, title: 'Maintenance & Upgrades', desc: 'Regular system check-ups, firmware updates, camera cleaning, HDD replacement, and upgrades to higher resolution cameras.' },
              { icon: Wifi, title: 'Wireless Cameras', desc: 'Wi-Fi camera installations for locations where running cables is difficult. Battery-powered and solar-powered options available.' },
              { icon: Monitor, title: 'Monitoring Integration', desc: 'Integration with armed response services and alarm systems for comprehensive security coverage.' },
              { icon: CheckCircle, title: 'Free Site Survey', desc: 'We visit your property, assess security vulnerabilities, and recommend the best camera system for your needs and budget.' },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 p-4 rounded-xl border border-gray-100">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Where We Install</h2>
          <p className="text-gray-600 mb-4">
            We install CCTV systems for homes, businesses, farms, estates, and body corporates across the KZN South Coast:
          </p>
          <p className="text-gray-600">
            Ramsgate, Margate, Uvongo, Shelly Beach, Port Shepstone, Southbroom, Palm Beach, San Lameer, Munster, Paddock, Hibberdene, Port Edward, Scottburgh, Pennington, and surrounding areas.
          </p>
        </div>
      </section>

      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Get a Free CCTV Quote</h2>
          <p className="text-primary-100 mb-8">Call us or send a message to arrange a free site survey and quotation.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:0393144359" className="inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              Call 039 314 4359
            </a>
            <Link href="/contact" className="inline-flex items-center gap-2 border border-white/30 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors">
              Contact Us <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
