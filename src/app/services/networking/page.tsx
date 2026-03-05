import type { Metadata } from 'next';
import Link from 'next/link';
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd';
import { ArrowRight, Wifi, Shield, Server, Globe, Monitor, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Network Installation & Maintenance — Ramsgate, KZN South Coast',
  description:
    'Professional network installation and maintenance in Ramsgate and the KZN South Coast. Wi-Fi setup, structured cabling, VPN, router configuration, enterprise networking, and internet solutions for homes and businesses.',
  keywords: [
    'network installation Ramsgate', 'Wi-Fi setup KZN', 'networking South Coast',
    'structured cabling', 'VPN setup business', 'router configuration',
    'network maintenance', 'fibre installation Ramsgate', 'enterprise networking KZN',
    'internet solutions Margate', 'Wi-Fi not working fix',
  ],
  openGraph: {
    title: 'Network Installation & Maintenance | Unlimited IT Solutions — Ramsgate, KZN',
    description: 'Wi-Fi, cabling, VPN, and enterprise networking for homes and businesses on the KZN South Coast.',
  },
  alternates: { canonical: 'https://unlimitedits.co.za/services/networking' },
};

export default function NetworkingPage() {
  return (
    <div>
      <BreadcrumbJsonLd items={[
        { name: 'Home', href: '/' },
        { name: 'Services', href: '/services' },
        { name: 'Networking' },
      ]} />
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Network Installation &amp; Maintenance</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Reliable, fast network solutions for homes and businesses. We design, install, and maintain wired and wireless networks across the KZN South Coast.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Networking Services</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { icon: Wifi, title: 'Wi-Fi Design & Setup', desc: 'Whole-home and office Wi-Fi coverage with access points, mesh systems, and signal boosters. No dead zones.' },
              { icon: Server, title: 'Structured Cabling', desc: 'CAT5e/CAT6 cabling, patch panel installation, network rack setup, and cable management for offices and buildings.' },
              { icon: Shield, title: 'VPN & Security', desc: 'Secure VPN connections for remote workers, firewall setup, network segmentation, and intrusion detection.' },
              { icon: Globe, title: 'Internet Solutions', desc: 'Fibre and wireless internet setup, ISP liaison, speed optimisation, and backup internet connections.' },
              { icon: Monitor, title: 'Network Monitoring', desc: 'Proactive monitoring for uptime, bandwidth management, network health alerts, and performance reporting.' },
              { icon: CheckCircle, title: 'Troubleshooting', desc: 'Slow internet? Dropping connections? We diagnose and fix network problems quickly to minimise downtime.' },
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Areas</h2>
          <p className="text-gray-600 mb-4">
            We install and maintain networks across the KZN South Coast:
          </p>
          <p className="text-gray-600">
            Ramsgate, Margate, Uvongo, Shelly Beach, Port Shepstone, Southbroom, Palm Beach, San Lameer, Hibberdene, Port Edward, Scottburgh, Pennington, and surrounding areas.
          </p>
        </div>
      </section>

      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Need Network Help?</h2>
          <p className="text-primary-100 mb-8">Whether it&apos;s a new install or a problem to fix — call us or get in touch online.</p>
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
