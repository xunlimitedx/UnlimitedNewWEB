import type { Metadata } from 'next';
import Link from 'next/link';
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd';
import { ArrowRight, Laptop, Wrench, CircuitBoard, HardDrive, Monitor, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Mac Repairs — MacBook, iMac & Mac Pro | Ramsgate, KZN',
  description:
    'Apple Mac repair specialists in Ramsgate, KZN. MacBook, MacBook Pro, MacBook Air, iMac, Mac Mini, and Mac Pro repairs. Screen replacement, battery swap, logic board repair, SSD upgrades, and macOS troubleshooting.',
  keywords: [
    'Mac repairs Ramsgate', 'MacBook repair South Coast', 'iMac repair KZN',
    'Apple repair KwaZulu-Natal', 'MacBook screen replacement', 'MacBook battery replacement',
    'Mac logic board repair', 'macOS fix near me', 'Apple technician South Coast',
    'MacBook Pro repair Margate', 'Mac not turning on fix',
  ],
  openGraph: {
    title: 'Mac Repairs — MacBook, iMac & Mac Pro | Unlimited IT Solutions',
    description: 'Expert Apple Mac repairs in Ramsgate, KZN. MacBook, iMac, Mac Mini, and Mac Pro.',
  },
  alternates: { canonical: 'https://unlimitedits.co.za/services/mac-repairs' },
};

export default function MacRepairsPage() {
  return (
    <div>
      <BreadcrumbJsonLd items={[
        { name: 'Home', href: '/' },
        { name: 'Services', href: '/services' },
        { name: 'Mac Repairs' },
      ]} />
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Mac Repairs</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            MacBook, iMac, Mac Mini, and Mac Pro repairs by experienced technicians. Screen replacements, battery swaps, logic board repairs, and macOS troubleshooting.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Mac Repair Services</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { icon: Monitor, title: 'Screen Replacement', desc: 'Cracked or damaged Retina displays repaired or replaced for MacBook Pro, MacBook Air, and iMac.' },
              { icon: Wrench, title: 'Battery Replacement', desc: 'Swollen or dead battery? We replace MacBook batteries so your laptop holds charge again.' },
              { icon: CircuitBoard, title: 'Logic Board Repair', desc: 'Micro-soldering and component-level repair for liquid-damaged, short-circuited, or failing logic boards.' },
              { icon: HardDrive, title: 'SSD & Storage Upgrades', desc: 'Upgrade your Mac to a faster SSD, increase storage capacity, and migrate your data seamlessly.' },
              { icon: Laptop, title: 'macOS Troubleshooting', desc: 'Boot issues, kernel panics, macOS reinstallation, firmware updates, and data recovery from failing drives.' },
              { icon: CheckCircle, title: 'Free Assessment', desc: 'Bring in your Mac for a free diagnostic. We\'ll tell you what\'s wrong and what it costs before any work begins.' },
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Devices We Repair</h2>
          <div className="flex flex-wrap gap-3">
            {['MacBook Air', 'MacBook Pro', 'iMac', 'Mac Mini', 'Mac Pro', 'Mac Studio'].map((d) => (
              <span key={d} className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-sm font-medium text-gray-700">{d}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Mac Giving You Trouble?</h2>
          <p className="text-primary-100 mb-8">Drop it off at our Ramsgate shop or call us first for advice — free diagnosis included.</p>
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
