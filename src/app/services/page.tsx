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
  Printer,
  HardDrive,
  Bot,
  Code,
  BarChart3,
  Briefcase,
  Rocket,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'IT Services — Repairs, CCTV, Networking, Software, POS & Business Solutions | Ramsgate',
  description:
    'Unlimited IT Solutions offers computer repairs, CCTV installations, networking, cybersecurity, data recovery, electronics repair, robotics, custom software development, POS systems, and UBOSS business software in Ramsgate, KwaZulu-Natal.',
  alternates: {
    canonical: 'https://unlimitedits.co.za/services',
  },
  keywords: [
    'computer repairs Ramsgate', 'Mac repairs KZN', 'CCTV installation South Coast',
    'network installation Ramsgate', 'console repairs PlayStation Xbox Nintendo',
    'fine soldering', 'managed IT services KZN', 'IT support Ramsgate',
    'remote support South Africa', 'server maintenance', 'cloud services KZN',
    'IT consulting', 'callout IT support', 'internet solutions Ramsgate',
    'data recovery KZN', 'electronics repair', 'printer repairs Ramsgate',
    'POS systems South Coast', 'custom software development KZN',
    'business management solutions', 'UBOSS business software',
    'robotics solutions', 'cybersecurity KZN',
  ],
  openGraph: {
    title: 'IT Services — Repairs, Software, Business Solutions & More | Unlimited IT Solutions',
    description:
      'From computer repairs to custom software and UBOSS business systems — complete technology solutions from Ramsgate, KZN.',
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
      {
        icon: Printer,
        title: 'Printer Sales, Setup & Repairs',
        description:
          'Printer and multifunction device sales, installation, driver setup, maintenance, and repairs for all major brands — inkjet, laser, and thermal.',
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
  {
    heading: 'Advanced & Specialized',
    services: [
      {
        icon: HardDrive,
        title: 'Data Recovery',
        description:
          'Professional recovery of lost, deleted, or damaged files from hard drives, SSDs, USB drives, memory cards, and RAID arrays.',
      },
      {
        icon: CircuitBoard,
        title: 'Electronic Repairs',
        description:
          'Board-level repair including capacitor replacement, microcontroller programming, and precision micro-soldering for all types of electronic devices.',
      },
      {
        icon: Bot,
        title: 'Robotics Solutions & Integration',
        description:
          'Custom robotics design, programming, integration, and automation solutions for education, industry, and hobbyists.',
      },
      {
        icon: Code,
        title: 'Custom Software Development',
        description:
          'Bespoke software solutions — web apps, mobile apps, business tools, API integrations, and database systems built to your specifications.',
      },
    ],
  },
  {
    heading: 'Business Solutions',
    services: [
      {
        icon: BarChart3,
        title: 'POS Systems',
        description:
          'Point-of-sale hardware and software — sales, setup, training, and ongoing support for retail, restaurants, and service businesses.',
      },
      {
        icon: Briefcase,
        title: 'Business Management Solutions',
        description:
          'Complete business technology consulting — workflow automation, digital systems, CRM, ERP, and operational efficiency solutions.',
      },
      {
        icon: Code,
        title: 'Custom Business Software',
        description:
          'Tailored software solutions for your specific business needs — inventory management, invoicing, reporting, and process automation.',
      },
      {
        icon: Rocket,
        title: 'UBOSS — Business Software',
        description:
          'Our powerful all-in-one business management platform. Invoicing, stock, customers, reporting, and more — built for South African businesses.',
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
      <section className="relative isolate overflow-hidden bg-aurora text-white">
        <div className="absolute inset-0 animate-aurora opacity-90 pointer-events-none" />
        <div className="absolute inset-0 bg-grid pointer-events-none" />
        <div className="absolute -top-32 left-1/4 w-[28rem] h-[28rem] rounded-full bg-blue-500/25 blur-3xl animate-orb pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
          <span className="eyebrow-chip mx-auto"><Rocket className="w-3.5 h-3.5" /> End-to-end IT</span>
          <h1 className="mt-6 text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[0.98]">
            Engineered services. <span className="text-gradient-premium">Human delivery.</span>
          </h1>
          <p className="mt-7 text-lg md:text-xl text-slate-300/90 max-w-2xl mx-auto leading-relaxed">
            From a cracked screen to a multi-site network rollout — we cover the full IT lifecycle for homes and businesses across South Africa&apos;s South Coast.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/business/quote" className="btn-premium">Request a quote <ArrowRight className="w-5 h-5" /></Link>
            <Link href="/contact" className="btn-ghost-premium">Talk to a technician</Link>
          </div>
        </div>
      </section>

      {/* Services by Category */}
      {serviceCategories.map((category) => (
        <section key={category.heading} className="py-16 odd:bg-gray-50 even:bg-white dark:odd:bg-gray-900 dark:even:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="eyebrow-light mb-3">{category.heading}</p>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                  {category.heading}
                </h2>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {category.services.map((service) => {
                const Card = (
                  <div className="card-premium p-6 h-full group">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/30 dark:to-blue-900/30 group-hover:scale-110 transition-transform">
                      <service.icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2 tracking-tight">{service.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{service.description}</p>
                    {service.href && (
                      <span className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-primary-600 group-hover:gap-2 transition-all">
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

      {/* Cybersecurity note */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 rounded-2xl p-8 md:p-12 text-white text-center">
            <Shield className="w-10 h-10 text-primary-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Cybersecurity &amp; Data Protection</h2>
            <p className="text-primary-100 max-w-2xl mx-auto">
              We offer comprehensive cybersecurity solutions — antivirus deployment, firewall configuration,
              network security audits, data encryption, and staff training to keep your home and business safe from cyber threats.
            </p>
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Some of the Brands We Service &amp; Sell</h2>
          <div className="flex flex-wrap justify-center gap-6 text-gray-500 font-medium">
            {['Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'MSI', 'Toshiba', 'Apple', 'Microsoft', 'Samsung', 'Sony', 'LG',
              'Huawei', 'Intel', 'AMD', 'Nvidia', 'Logitech', 'Corsair', 'Kingston', 'Seagate', 'Western Digital',
              'TP-Link', 'Ubiquiti', 'MikroTik', 'Hikvision', 'Dahua', 'Epson', 'Brother', 'Canon',
              'PlayStation', 'Xbox', 'Nintendo', 'Razer', 'APC', 'Kaspersky', 'Norton', 'Adobe'].map(
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
