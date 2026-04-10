'use client';

import React, { useState } from 'react';
import { Button, Input, Textarea } from '@/components/ui';
import { addDocument } from '@/lib/firebase';
import {
  Send,
  Laptop,
  Gamepad2,
  Monitor,
  Smartphone,
  Printer,
  Camera,
  CheckCircle,
  Upload,
} from 'lucide-react';
import toast from 'react-hot-toast';

const DEVICE_TYPES = [
  { value: 'laptop', label: 'Laptop', icon: Laptop },
  { value: 'desktop', label: 'Desktop PC', icon: Monitor },
  { value: 'mac', label: 'Mac / MacBook', icon: Smartphone },
  { value: 'console', label: 'Gaming Console', icon: Gamepad2 },
  { value: 'printer', label: 'Printer', icon: Printer },
  { value: 'cctv', label: 'CCTV / Camera', icon: Camera },
  { value: 'other', label: 'Other', icon: Monitor },
];

export default function ServiceRequestForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    deviceType: '',
    brand: '',
    model: '',
    issue: '',
    repairType: 'walk-in' as 'walk-in' | 'mail-in' | 'callout',
    website: '', // honeypot
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.deviceType || !form.issue) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (form.website) {
      setSubmitted(true);
      return;
    }
    setLoading(true);
    try {
      await addDocument('repairRequests', {
        ...form,
        status: 'new',
        createdAt: new Date().toISOString(),
      });
      setSubmitted(true);
      toast.success('Repair request submitted!');
    } catch {
      toast.error('Failed to submit. Please try again or call us.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Request Submitted!</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
          We&apos;ll review your repair request and get back to you within 24 hours with a quote.
        </p>
        <Button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', deviceType: '', brand: '', model: '', issue: '', repairType: 'walk-in', website: '' }); }} variant="outline">
          Submit Another Request
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          label="Full Name *"
          placeholder="John Doe"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <Input
          label="Email *"
          type="email"
          placeholder="john@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
      </div>
      <Input
        label="Phone"
        type="tel"
        placeholder="082 000 0000"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />

      {/* Device Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Device Type *</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {DEVICE_TYPES.map((device) => (
            <button
              key={device.value}
              type="button"
              onClick={() => setForm({ ...form, deviceType: device.value })}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                form.deviceType === device.value
                  ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                  : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300'
              }`}
            >
              <device.icon className="w-4 h-4" />
              {device.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          label="Brand"
          placeholder="e.g. Dell, HP, Apple"
          value={form.brand}
          onChange={(e) => setForm({ ...form, brand: e.target.value })}
        />
        <Input
          label="Model"
          placeholder="e.g. Inspiron 15, MacBook Pro"
          value={form.model}
          onChange={(e) => setForm({ ...form, model: e.target.value })}
        />
      </div>

      <Textarea
        label="Describe the Problem *"
        placeholder="Tell us what's wrong with your device..."
        rows={4}
        value={form.issue}
        onChange={(e) => setForm({ ...form, issue: e.target.value })}
        required
      />

      {/* Repair Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">How Would You Like to Get It Repaired?</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: 'walk-in', label: 'Walk-in', desc: 'Visit our shop' },
            { value: 'mail-in', label: 'Mail-in', desc: 'Ship to us' },
            { value: 'callout', label: 'Callout', desc: 'We come to you' },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setForm({ ...form, repairType: opt.value as typeof form.repairType })}
              className={`px-3 py-3 rounded-xl border text-center transition-all ${
                form.repairType === opt.value
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
              }`}
            >
              <span className={`block text-sm font-semibold ${form.repairType === opt.value ? 'text-primary-700 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'}`}>
                {opt.label}
              </span>
              <span className="block text-xs text-gray-500 dark:text-gray-400">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Honeypot */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(e) => setForm({ ...form, website: e.target.value })}
        />
      </div>

      <Button type="submit" size="lg" loading={loading} className="w-full">
        <Send className="w-4 h-4" />
        Submit Repair Request
      </Button>
      <p className="text-xs text-gray-400 text-center">Free diagnostic • No obligation quote • Response within 24 hours</p>
    </form>
  );
}
