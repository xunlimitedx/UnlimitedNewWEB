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
      lines: [
        { text: '039 314 4359', href: 'tel:0393144359' },
        { text: '082 556 9875', href: 'tel:0825569875' },
      ],
    },
    {
      icon: MapPin,
      title: 'Address',
      lines: [{ text: '202 Marine Drive, Ramsgate, 4285', href: '#map' }],
    },
    {
      icon: Mail,
      title: 'Email',
      lines: [
        { text: 'info@unlimitedits.co.za', href: 'mailto:info@unlimitedits.co.za' },
      ],
    },
    {
      icon: Clock,
      title: 'Business Hours',
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
      <section className="-mt-12 relative z-10 mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactInfo.map((info) => (
              <div
                key={info.title}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <info.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{info.title}</h3>
                {info.lines.map((line) =>
                  line.href ? (
                    <a
                      key={line.text}
                      href={line.href}
                      className="block text-sm text-gray-500 hover:text-primary-600 transition-colors"
                    >
                      {line.text}
                    </a>
                  ) : (
                    <span key={line.text} className="block text-sm text-gray-500">
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
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Thank you for reaching out. We&apos;ll get back to you within 24
                    hours.
                  </p>
                  <Button onClick={() => {
                    setSubmitted(false);
                    setForm({ name: '', email: '', phone: '', subject: '', message: '', website: '' });
                  }} variant="outline">
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Send us a message
                      </h2>
                      <p className="text-sm text-gray-500">
                        Fill out the form and we&apos;ll respond as soon as possible.
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
            <div id="map" className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 min-h-[400px]">
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
