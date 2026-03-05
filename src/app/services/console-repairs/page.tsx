import type { Metadata } from 'next';
import Link from 'next/link';
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd';
import { ArrowRight, Gamepad2, Wrench, CircuitBoard, Cpu, Monitor, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Console Repairs — PlayStation, Xbox & Nintendo | Ramsgate, KZN',
  description:
    'Expert gaming console repairs in Ramsgate, KZN. We fix PlayStation 4, PS5, Xbox One, Xbox Series X/S, and Nintendo Switch. HDMI port replacement, overheating, disc drive repairs, controller fixes, and more.',
  keywords: [
    'console repairs Ramsgate', 'PlayStation repair South Coast', 'Xbox repair KZN',
    'Nintendo Switch repair', 'PS5 repair near me', 'HDMI port replacement console',
    'console overheating fix', 'disc drive repair PlayStation', 'gaming console technician',
    'Xbox Series X repair Margate', 'PS4 repair KwaZulu-Natal',
  ],
  openGraph: {
    title: 'Console Repairs — PlayStation, Xbox & Nintendo | Unlimited IT Solutions',
    description: 'Expert PlayStation, Xbox, and Nintendo console repairs in Ramsgate, KZN South Coast.',
  },
  alternates: { canonical: 'https://unlimitedits.co.za/services/console-repairs' },
};

export default function ConsoleRepairsPage() {
  return (
    <div>
      <BreadcrumbJsonLd items={[
        { name: 'Home', href: '/' },
        { name: 'Services', href: '/services' },
        { name: 'Console Repairs' },
      ]} />
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Console Repairs</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            PlayStation, Xbox, and Nintendo repairs by experienced technicians. HDMI ports, disc drives, overheating, and more — fixed right at our Ramsgate shop.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Common Console Repairs</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { icon: Monitor, title: 'HDMI Port Replacement', desc: 'Damaged or loose HDMI port? We do precision soldering to replace HDMI ports on PS4, PS5, Xbox One, and Xbox Series X/S.' },
              { icon: Wrench, title: 'Disc Drive Repairs', desc: 'Console not reading discs? We repair and replace Blu-ray drives for PlayStation and Xbox consoles.' },
              { icon: Cpu, title: 'Overheating Fixes', desc: 'Thermal paste replacement, fan cleaning, heat sink servicing, and airflow improvements to stop your console from overheating.' },
              { icon: CircuitBoard, title: 'Power Supply Issues', desc: 'Console not turning on? We diagnose and repair power supply units, replace blown capacitors, and fix motherboard faults.' },
              { icon: Gamepad2, title: 'Controller Repairs', desc: 'Stick drift, button issues, trigger replacement, and charging problems for PS5, Xbox, and Switch controllers.' },
              { icon: CheckCircle, title: 'Free Diagnosis', desc: 'Drop off your console for a free diagnostic assessment. We\'ll tell you what\'s wrong and how much it\'ll cost before we start.' },
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Consoles We Repair</h2>
          <div className="flex flex-wrap gap-3">
            {['PlayStation 4', 'PlayStation 5', 'Xbox One', 'Xbox Series S', 'Xbox Series X', 'Nintendo Switch', 'Nintendo Switch Lite'].map((c) => (
              <span key={c} className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-sm font-medium text-gray-700">{c}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Console Not Working?</h2>
          <p className="text-primary-100 mb-8">Bring it in to our Ramsgate shop for a free diagnosis, or call us to discuss the issue.</p>
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
