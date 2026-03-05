import type { Metadata } from 'next';
import Link from 'next/link';
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd';
import { ArrowRight, Monitor, Laptop, Wrench, HardDrive, Cpu, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Computer Repairs Ramsgate — Laptop, Desktop & Hardware Fixes',
  description:
    'Professional computer repair services in Ramsgate, KZN. We fix desktops, laptops, hardware faults, software issues, virus removal, screen replacements, and upgrades. Dell, HP, Lenovo, ASUS, Acer, MSI, Toshiba. Walk-in or callout.',
  keywords: [
    'computer repairs Ramsgate', 'laptop repair South Coast', 'desktop repair KZN',
    'virus removal Ramsgate', 'screen replacement laptop', 'computer technician near me',
    'hardware repair KwaZulu-Natal', 'PC repair South Coast', 'computer fix Margate',
    'laptop screen repair Ramsgate',
  ],
  openGraph: {
    title: 'Computer Repairs | Unlimited IT Solutions — Ramsgate, KZN',
    description: 'Expert computer and laptop repairs in Ramsgate. Hardware, software, virus removal, and more.',
  },
  alternates: { canonical: 'https://unlimitedits.co.za/services/computer-repairs' },
};

export default function ComputerRepairsPage() {
  return (
    <div>
      <BreadcrumbJsonLd items={[
        { name: 'Home', href: '/' },
        { name: 'Services', href: '/services' },
        { name: 'Computer Repairs' },
      ]} />
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Computer Repairs</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Fast, affordable computer and laptop repairs from our Ramsgate shop. Walk in or book a callout — we service Dell, HP, Lenovo, ASUS, Acer, MSI, Toshiba, and more.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">What We Repair</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { icon: Laptop, title: 'Laptop Repairs', desc: 'Screen replacements, keyboard repairs, battery swaps, hinge fixes, overheating, charging port repairs.' },
              { icon: Monitor, title: 'Desktop Repairs', desc: 'Power supply failures, motherboard diagnosis, RAM upgrades, GPU replacements, boot issues.' },
              { icon: Wrench, title: 'Software Fixes', desc: 'Virus and malware removal, Windows reinstallation, driver updates, slow PC optimisation, data recovery.' },
              { icon: HardDrive, title: 'Storage Upgrades', desc: 'HDD to SSD upgrades, data migration, external drive recovery, NAS setup.' },
              { icon: Cpu, title: 'Component Upgrades', desc: 'RAM upgrades, CPU swaps, GPU upgrades, cooling solutions, custom builds.' },
              { icon: CheckCircle, title: 'Diagnostics', desc: 'Free initial assessment. We diagnose the issue and give you a quote before proceeding with repairs.' },
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Brands We Service</h2>
          <p className="text-gray-600 mb-6">We repair all major PC and laptop brands:</p>
          <div className="flex flex-wrap gap-3">
            {['Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'MSI', 'Toshiba', 'Samsung', 'Gigabyte', 'Intel', 'AMD'].map((b) => (
              <span key={b} className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-sm font-medium text-gray-700">{b}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Areas</h2>
          <p className="text-gray-600 mb-4">
            Our shop is at <strong>202 Marine Drive, Ramsgate</strong>. We also provide callout repairs across the KZN South Coast including:
          </p>
          <p className="text-gray-600">
            Margate, Uvongo, Shelly Beach, Port Shepstone, Southbroom, Palm Beach, San Lameer, Munster, Paddock, Hibberdene, Port Edward, and surrounding areas.
          </p>
        </div>
      </section>

      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Need a Repair?</h2>
          <p className="text-primary-100 mb-8">Walk in to our shop or call us to book a callout. Free diagnostics on all repairs.</p>
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
