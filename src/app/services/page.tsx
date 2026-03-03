import type { Metadata } from 'next';
import Link from 'next/link';
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
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Unlimited IT Solutions offers IT support, computer repairs, networking, cloud solutions, data recovery, and more for businesses and individuals in South Africa.',
  openGraph: {
    title: 'IT Services | Unlimited IT Solutions',
    description: 'Professional IT services for businesses and individuals across South Africa.',
  },
};

const services = [
  {
    icon: Wrench,
    title: 'Computer Repairs',
    description:
      'Hardware and software diagnostics, component replacement, virus removal, and system optimisation for desktops and laptops.',
  },
  {
    icon: Monitor,
    title: 'Custom PC Builds',
    description:
      'Tailor-made desktop systems built to your specifications — gaming rigs, workstations, or office machines.',
  },
  {
    icon: Wifi,
    title: 'Networking Solutions',
    description:
      'Wi-Fi setup, network cabling, router configuration, and enterprise networking for homes and businesses.',
  },
  {
    icon: Shield,
    title: 'Cybersecurity',
    description:
      'Antivirus setup, firewall configuration, security audits, and data protection to keep your systems safe.',
  },
  {
    icon: Cloud,
    title: 'Cloud & Backup',
    description:
      'Cloud migration, Microsoft 365 setup, automated backups, and disaster recovery planning.',
  },
  {
    icon: Server,
    title: 'Server Management',
    description:
      'Server installation, maintenance, monitoring, and virtualisation for businesses of all sizes.',
  },
  {
    icon: Headphones,
    title: 'IT Support & Helpdesk',
    description:
      'On-site and remote IT support, SLA-based helpdesk services, and ongoing maintenance contracts.',
  },
  {
    icon: Laptop,
    title: 'Hardware Sales',
    description:
      'Quality laptops, desktops, peripherals, and components from leading brands at competitive prices.',
  },
];

export default function ServicesPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            From repairs to full IT infrastructure — we provide end-to-end technology
            solutions for businesses and individuals across South Africa.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <div
                key={service.title}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-100 transition-all group"
              >
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
                  <service.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{service.description}</p>
              </div>
            ))}
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
            budget and needs.
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
