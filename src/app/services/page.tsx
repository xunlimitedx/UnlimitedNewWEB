import type { Metadata } from 'next';
import Link from 'next/link';
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd';
import {
  Monitor,
  Wrench,
  Shield,
  Wifi,
  Cloud,
  Headphones,
  Server,
  Laptop,
  ArrowRight,
  Camera,
  Gamepad2,
  Globe,
  Phone,
  CalendarClock,
  CircuitBoard,
  Settings,
  ShieldCheck,
  Lightbulb,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'IT Services — Computer Repairs, CCTV, Networking & Console Repairs | Ramsgate',
  description:
    'Unlimited IT Solutions offers computer repairs (including Mac), CCTV installations, network installations, console repairs (PlayStation, Xbox, Nintendo), fine soldering, managed IT services, remote support, cloud services, and more in Ramsgate, KwaZulu-Natal.',
  keywords: [
    'computer repairs Ramsgate', 'Mac repairs KZN', 'CCTV installation South Coast',
    'network installation Ramsgate', 'console repairs PlayStation Xbox Nintendo',
    'fine soldering', 'managed IT services KZN', 'IT support Ramsgate',
    'remote support South Africa', 'server maintenance', 'cloud services KZN',
    'IT consulting', 'callout IT support', 'internet solutions Ramsgate',
    'scheduled maintenance IT', 'software repairs',
  ],
  openGraph: {
    title: 'IT Services — Computer Repairs, CCTV, Networking & More | Unlimited IT Solutions',
    description:
      'From computer & Mac repairs to CCTV installations, networking, console repairs, and managed IT — we cover all your technology needs in Ramsgate, KZN.',
  },
};

const serviceCategories = [
  {
    heading: 'Repair Services',
    services: [
      {
        icon: Wrench,
        title: 'Computer Repair & Sales',
        href: '/services/computer-repairs',
        description:
          'Hardware and software diagnostics, component replacement, virus removal, and optimisation for desktops and laptops — Dell, HP, Lenovo, ASUS, Acer, MSI, Toshiba, and Apple Mac.',
      },
      {
        icon: Gamepad2,
        title: 'Console Repair & Sales',
        href: '/services/console-repairs',
        description:
          'Expert repair for PlayStation, Xbox, and Nintendo consoles — HDMI port replacement, overheating fixes, disc drive repairs, and refurbished console sales.',
      },
      {
        icon: CircuitBoard,
        title: 'Fine Soldering & Part Replacement',
        description:
          'Precision micro-soldering for motherboards, charging ports, GPU chips, and other delicate components that require specialist equipment.',
      },
      {
        icon: Settings,
        title: 'Software Repairs & Sales',
        description:
          'Windows repairs, virus removal, OS reinstallation, driver updates. Certified reseller for Adobe, Norton, McAfee, Kaspersky, Bitdefender, Avast, Windows, and Microsoft Office.',
      },
    ],
  },
  {
    heading: 'Installation Services',
    services: [
      {
        icon: Camera,
        title: 'CCTV Maintenance & Installations',
        href: '/services/cctv-installation',
        description:
          'Full CCTV system design, installation, and maintenance — IP cameras, DVR/NVR setup, remote monitoring, and integration with existing security infrastructure.',
      },
      {
        icon: Wifi,
        title: 'Network Maintenance & Installations',
        href: '/services/networking',
        description:
          'Structured cabling, Wi-Fi design, router and switch configuration, VPN setup, and enterprise networking for homes, offices, and commercial premises.',
      },
      {
        icon: Globe,
        title: 'Internet Solutions',
        description:
          'Fibre and wireless internet setup, Wi-Fi coverage design, ISP liaison, speed optimisation, and troubleshooting connectivity issues.',
      },
      {
        icon: Server,
        title: 'Server Repairs, Maintenance & Installations',
        description:
          'Server rack setup, installation, configuration, virtualisation, monitoring, and ongoing maintenance for small businesses to enterprise environments.',
      },
    ],
  },
  {
    heading: 'IT Support & Management',
    services: [
      {
        icon: ShieldCheck,
        title: 'IT Support & Maintenance',
        description:
          'Regular system check-ups, patch management, virus protection, hardware servicing, and proactive system health monitoring.',
      },
      {
        icon: Monitor,
        title: 'Managed IT Services',
        description:
          'Full IT outsourcing — proactive monitoring, helpdesk, infrastructure management, SLA-based contracts, and technology roadmaps for your business.',
      },
      {
        icon: Headphones,
        title: 'Remote Support',
        description:
          'Instant remote troubleshooting and maintenance via secure remote access — available nationwide for quick issue resolution.',
      },
      {
        icon: Phone,
        title: 'Callouts & On-site Support',
        description:
          'On-site visits for installations, repairs, troubleshooting, and setups at your home or business across the KZN South Coast and beyond.',
      },
      {
        icon: CalendarClock,
        title: 'Scheduled Maintenance',
        description:
          'Daily, weekly, or bi-weekly maintenance schedules — preventative check-ups, system updates, hardware cleaning, and performance optimisation.',
      },
      {
        icon: Cloud,
        title: 'Cloud Services',
        description:
          'Cloud migration, Microsoft 365 deployments, automated backups, disaster recovery planning, and SaaS solutions for businesses.',
      },
      {
        icon: Lightbulb,
        title: 'IT Consulting & Strategy',
        description:
          'Technology planning, cybersecurity audits, infrastructure assessments, compliance guidance, and digital transformation strategy.',
      },
      {
        icon: Laptop,
        title: 'Hardware Sales',
        description:
          'New and refurbished laptops, desktops, peripherals, and components from Dell, HP, Lenovo, ASUS, Acer, MSI, Toshiba, and Apple.',
      },
    ],
  },
];

export default function ServicesPage() {
  return (
    <div>
      <BreadcrumbJsonLd items={[
        { name: 'Home', href: '/' },
        { name: 'Services' },
      ]} />
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            From computer repairs and CCTV installations to managed IT and console repairs —
            we provide end-to-end technology solutions from our shop in Ramsgate, KZN.
          </p>
        </div>
      </section>

      {/* Services by Category */}
      {serviceCategories.map((category) => (
        <section key={category.heading} className="py-16 odd:bg-gray-50 even:bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 pb-3 border-b border-gray-200">
              {category.heading}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {category.services.map((service) => {
                const Card = (
                  <div
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-100 transition-all group"
                  >
                    <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
                      <service.icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{service.description}</p>
                    {service.href && (
                      <span className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-primary-600">
                        Learn more <ArrowRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                );
                return service.href ? (
                  <Link key={service.title} href={service.href}>{Card}</Link>
                ) : (
                  <div key={service.title}>{Card}</div>
                );
              })}
            </div>
          </div>
        </section>
      ))}

      {/* Brands */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Some of the Brands We Service &amp; Sell</h2>
          <div className="flex flex-wrap justify-center gap-6 text-gray-500 font-medium">
            {['Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'MSI', 'Toshiba', 'Apple', 'Microsoft', 'Adobe', 'PlayStation', 'Xbox', 'Nintendo'].map(
              (brand) => (
                <span key={brand} className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-sm">
                  {brand}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Need a custom solution?
          </h2>
          <p className="text-gray-600 mb-8">
            Contact us to discuss your requirements. We&apos;ll tailor a solution that fits your
            budget and needs — on-site or remote.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
          >
            Get in Touch
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
