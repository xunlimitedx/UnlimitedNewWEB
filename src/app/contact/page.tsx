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

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields');
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
      <section className="gradient-hero text-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            Get in <span className="text-primary-300">Touch</span>
          </h1>
          <p className="text-lg text-primary-100 max-w-lg mx-auto">
            Have a question or need assistance? We&apos;d love to hear from you.
            Our team is ready to help.
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
                    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
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
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3468.5!2d30.3538!3d-30.8883!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1ef6b5b5b5b5b5b5%3A0x1234567890abcdef!2s202+Marine+Dr%2C+Ramsgate%2C+4285%2C+South+Africa!5e0!3m2!1sen!2sza!4v1700000000000"
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
    </div>
  );
}
