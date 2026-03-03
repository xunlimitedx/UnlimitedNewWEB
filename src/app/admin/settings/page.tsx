'use client';

import React, { useState, useEffect } from 'react';
import { Button, Input, Textarea } from '@/components/ui';
import { getDocument, setDocument } from '@/lib/firebase';
import { Settings, Save, Globe, MapPin, Phone, Mail, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import type { SiteSettings } from '@/types';

const defaultSettings: SiteSettings = {
  siteName: 'Unlimited IT Solutions',
  tagline: 'Your one-stop IT solutions partner',
  description:
    'Unlimited IT Solutions – Premium IT products, services, and solutions for businesses and individuals across South Africa.',
  contactEmail: 'info@unlimitedits.co.za',
  contactPhone: '039 314 4359',
  contactPhoneAlt: '082 556 9875',
  address: '202 Marine Drive, Ramsgate, 4285',
  businessHours: 'Mon–Fri 8am–5pm, Sat 8am–1pm',
  emails: {
    noReply: 'noreply@unlimitedits.co.za',
    support: 'support@unlimitedits.co.za',
    sales: 'sales@unlimitedits.co.za',
    info: 'info@unlimitedits.co.za',
  },
  socialLinks: {
    facebook: 'https://www.facebook.com/unlimitedits',
    instagram: '',
    twitter: '',
    linkedin: '',
  },
  shippingThreshold: 2500,
  vatRate: 15,
  currency: 'ZAR',
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await getDocument('settings', 'site');
        if (data) {
          setSettings({ ...defaultSettings, ...(data as unknown as SiteSettings) });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await setDocument('settings', 'site', {
        ...settings,
        updatedAt: new Date().toISOString(),
      });
      toast.success('Settings saved!');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Store Settings
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Configure your store details and preferences
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            General
          </h3>
          <Input
            label="Store Name"
            value={settings.siteName}
            onChange={(e) =>
              setSettings({ ...settings, siteName: e.target.value })
            }
          />
          <Input
            label="Tagline"
            value={settings.tagline}
            onChange={(e) =>
              setSettings({ ...settings, tagline: e.target.value })
            }
          />
          <Textarea
            label="Store Description"
            value={settings.description}
            onChange={(e) =>
              setSettings({ ...settings, description: e.target.value })
            }
            rows={3}
          />
        </div>

        {/* Contact */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Contact Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              value={settings.contactEmail}
              onChange={(e) =>
                setSettings({ ...settings, contactEmail: e.target.value })
              }
              icon={<Mail className="w-4 h-4" />}
            />
            <Input
              label="Phone"
              value={settings.contactPhone}
              onChange={(e) =>
                setSettings({ ...settings, contactPhone: e.target.value })
              }
              icon={<Phone className="w-4 h-4" />}
            />
          </div>
          <Input
            label="Alt Phone"
            value={settings.contactPhoneAlt}
            onChange={(e) =>
              setSettings({ ...settings, contactPhoneAlt: e.target.value })
            }
          />
          <Input
            label="Address"
            value={settings.address}
            onChange={(e) =>
              setSettings({ ...settings, address: e.target.value })
            }
            icon={<MapPin className="w-4 h-4" />}
          />
          <Input
            label="Business Hours"
            value={settings.businessHours}
            onChange={(e) =>
              setSettings({ ...settings, businessHours: e.target.value })
            }
            icon={<Clock className="w-4 h-4" />}
          />
        </div>

        {/* Email Addresses */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email Addresses
          </h3>
          <p className="text-sm text-gray-500">
            Configure the email addresses used across your store for notifications, support, and transactional emails.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="No-Reply Email"
              type="email"
              placeholder="noreply@unlimitedits.co.za"
              value={settings.emails?.noReply || ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  emails: { ...settings.emails, noReply: e.target.value },
                })
              }
              icon={<Mail className="w-4 h-4" />}
            />
            <Input
              label="Support Email"
              type="email"
              placeholder="support@unlimitedits.co.za"
              value={settings.emails?.support || ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  emails: { ...settings.emails, support: e.target.value },
                })
              }
              icon={<Mail className="w-4 h-4" />}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Sales Email"
              type="email"
              placeholder="sales@unlimitedits.co.za"
              value={settings.emails?.sales || ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  emails: { ...settings.emails, sales: e.target.value },
                })
              }
              icon={<Mail className="w-4 h-4" />}
            />
            <Input
              label="General Info Email"
              type="email"
              placeholder="info@unlimitedits.co.za"
              value={settings.emails?.info || ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  emails: { ...settings.emails, info: e.target.value },
                })
              }
              icon={<Mail className="w-4 h-4" />}
            />
          </div>
          <div className="rounded-lg bg-blue-50 border border-blue-100 p-3">
            <p className="text-xs text-blue-700">
              <strong>No-Reply:</strong> Used as sender for automated order confirmations and notifications.<br />
              <strong>Support:</strong> Shown to customers for help requests.<br />
              <strong>Sales:</strong> For quotation requests and sales enquiries.<br />
              <strong>Info:</strong> General enquiries from the contact page.
            </p>
          </div>
        </div>

        {/* Commerce */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Commerce</h3>
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Currency"
              value={settings.currency}
              onChange={(e) =>
                setSettings({ ...settings, currency: e.target.value })
              }
            />
            <Input
              label="VAT Rate (%)"
              type="number"
              value={settings.vatRate.toString()}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  vatRate: parseFloat(e.target.value) || 0,
                })
              }
            />
            <Input
              label="Free Shipping Threshold (ZAR)"
              type="number"
              value={settings.shippingThreshold.toString()}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  shippingThreshold: parseFloat(e.target.value) || 0,
                })
              }
            />
          </div>
        </div>

        {/* Social */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Social Links</h3>
          <Input
            label="Facebook"
            placeholder="https://facebook.com/..."
            value={settings.socialLinks?.facebook || ''}
            onChange={(e) =>
              setSettings({
                ...settings,
                socialLinks: {
                  ...settings.socialLinks,
                  facebook: e.target.value,
                },
              })
            }
          />
          <Input
            label="Instagram"
            placeholder="https://instagram.com/..."
            value={settings.socialLinks?.instagram || ''}
            onChange={(e) =>
              setSettings({
                ...settings,
                socialLinks: {
                  ...settings.socialLinks,
                  instagram: e.target.value,
                },
              })
            }
          />
          <Input
            label="LinkedIn"
            placeholder="https://linkedin.com/..."
            value={settings.socialLinks?.linkedin || ''}
            onChange={(e) =>
              setSettings({
                ...settings,
                socialLinks: {
                  ...settings.socialLinks,
                  linkedin: e.target.value,
                },
              })
            }
          />
        </div>

        <Button type="submit" loading={loading}>
          <Save className="w-4 h-4" />
          Save Settings
        </Button>
      </form>
    </div>
  );
}
