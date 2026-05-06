'use client';

import React, { useState } from 'react';

import { Button, Input, Textarea } from '@/components/ui';
import { addDocument } from '@/lib/firebase';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  CheckCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import ServiceRequestForm from '@/components/ServiceRequestForm';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    website: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (form.website) {
      setSubmitted(true);
      return;
    }
    setLoading(true);
    try {
      await addDocument('contactMessages', {
        ...form,
        status: 'new',
      });
      setSubmitted(true);
      toast.success('Message sent successfully!');
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      tile: 'from-blue-500 to-cyan-500',
      lines: [
        { text: '039 314 4359', href: 'tel:0393144359' },
        { text: '082 556 9875', href: 'tel:0825569875' },
      ],
    },
    {
      icon: MapPin,
      title: 'Address',
      tile: 'from-rose-500 to-pink-500',
      lines: [{ text: '202 Marine Drive, Ramsgate, 4285', href: '#map' }],
    },
    {
      icon: Mail,
      title: 'Email',
      tile: 'from-violet-500 to-fuchsia-500',
      lines: [
        { text: 'info@unlimitedits.co.za', href: 'mailto:info@unlimitedits.co.za' },
      ],
    },
    {
      icon: Clock,
      title: 'Business Hours',
      tile: 'from-emerald-500 to-teal-500',
      lines: [
        { text: 'Mon-Fri: 8am - 5pm', href: '' },
        { text: 'Sat: 8am - 1pm', href: '' },
      ],
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-aurora text-white">
        <div className="absolute inset-0 animate-aurora opacity-90 pointer-events-none" />
        <div className="absolute inset-0 bg-grid pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[0.98]">
            Let&apos;s <span className="text-gradient-premium">talk shop.</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-300/90 max-w-2xl mx-auto leading-relaxed">
            Walk in, call, message, email — every channel is monitored by a real human in Ramsgate within 1 business hour.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="-mt-16 relative z-10 mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {contactInfo.map((info) => (
              <div
                key={info.title}
                className="group card-premium p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${info.tile} text-white shadow-lg shadow-black/5 ring-1 ring-white/30 mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                  <info.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2 tracking-tight">{info.title}</h3>
                {info.lines.map((line) =>
                  line.href ? (
                    <a
                      key={line.text}
                      href={line.href}
                      className="block text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      {line.text}
                    </a>
                  ) : (
                    <span key={line.text} className="block text-sm text-gray-500 dark:text-gray-400">
                      {line.text}
                    </span>
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form & Map */}
      <section className="section-padding pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Form */}
            <div className="card-premium p-8">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
                    Message sent!
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                  </p>
                  <Button onClick={() => {
                    setSubmitted(false);
                    setForm({ name: '', email: '', phone: '', subject: '', message: '', website: '' });
                  }} variant="outline">
                    Send another message
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center shadow-md shadow-primary-500/20">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                        Send us a message
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        We respond within 1 business hour.
                      </p>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input
                        label="Full Name *"
                        placeholder="John Doe"
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        required
                      />
                      <Input
                        label="Email *"
                        type="email"
                        placeholder="john@example.com"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input
                        label="Phone"
                        type="tel"
                        placeholder="082 000 0000"
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                      />
                      <Input
                        label="Subject"
                        placeholder="How can we help?"
                        value={form.subject}
                        onChange={(e) =>
                          setForm({ ...form, subject: e.target.value })
                        }
                      />
                    </div>
                    <Textarea
                      label="Message *"
                      placeholder="Tell us about your needs..."
                      rows={5}
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      required
                    />
                    <div className="absolute -left-[9999px]" aria-hidden="true">
                      <input
                        type="text"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        value={form.website}
                        onChange={(e) =>
                          setForm({ ...form, website: e.target.value })
                        }
                      />
                    </div>
                    <Button type="submit" size="lg" loading={loading} className="w-full">
                      <Send className="w-4 h-4" />
                      Send Message
                    </Button>
                  </form>
                </>
              )}
            </div>

            {/* Map */}
            <div id="map" className="card-premium overflow-hidden min-h-[400px]">
              <iframe
                src="https://maps.google.com/maps?q=202+Marine+Drive,+Ramsgate,+KwaZulu-Natal,+4285,+South+Africa&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '500px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Unlimited IT Solutions Location"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Repair Request Form */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
              Submit a Repair Request
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Fill out the form below and we&apos;ll get back to you with a quote. Walk-in, mail-in, or callout — we cover all of South Africa.
            </p>
          </div>
          <ServiceRequestForm />
        </div>
      </section>
    </div>
  );
}
