'use client';

import { useState } from 'react';
import { Building2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function BusinessQuotePage() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch('/api/business/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to submit');
      setDone(true);
    } catch (err: any) {
      setError(err.message || 'Could not submit. Please call 082 556 9875.');
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-10 text-center max-w-lg shadow-sm">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Quote request received</h1>
          <p className="text-gray-600">We&apos;ll respond within 1 business hour. Need it sooner? Call <a href="tel:+27825569875" className="text-primary-600 hover:underline">082 556 9875</a>.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-2 text-primary-600 mb-2">
            <Building2 className="w-5 h-5" />
            <span className="text-sm font-medium">Business & Bulk</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Request a Business Quote</h1>
          <p className="text-gray-600 mt-2">Trade pricing on hardware, networking and CCTV. We respond within 1 business hour.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <Input label="Company name" name="company" required />
            <Input label="VAT number (optional)" name="vat" />
            <Input label="Contact name" name="name" required />
            <Input label="Email" name="email" type="email" required />
            <Input label="Phone" name="phone" type="tel" required />
            <Input label="Town / Province" name="location" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Items / requirements</label>
            <textarea
              name="requirements"
              required
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g. 10× business laptops, 1× 16-port switch, CCTV installation for warehouse..."
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" size="lg" disabled={submitting} className="w-full">
            {submitting ? 'Submitting…' : 'Request quote'}
          </Button>
          <p className="text-xs text-gray-500 text-center">By submitting you agree to our privacy policy. POPIA compliant.</p>
        </form>
      </div>
    </div>
  );
}
