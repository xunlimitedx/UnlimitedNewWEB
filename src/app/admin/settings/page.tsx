'use client';

import React, { useState, useEffect } from 'react';
import { Button, Input, Textarea } from '@/components/ui';
import { getDocument, setDocument } from '@/lib/firebase';
import { Settings, Save, Globe, MapPin, Phone, Mail, Clock, CreditCard, Banknote, Truck, ToggleLeft, ToggleRight, Send, Server, Bell, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import type { SiteSettings, PaymentSettings, EmailSettings } from '@/types';

const defaultEmailSettings: EmailSettings = {
  smtp: {
    host: '',
    port: 587,
    secure: false,
    user: '',
    pass: '',
    fromEmail: '',
    fromName: 'Unlimited IT Solutions',
  },
  notifications: {
    adminEmail: '',
    onNewSignup: true,
    onNewOrder: true,
    onPaymentReceived: true,
    onContactForm: true,
  },
};

const defaultPaymentSettings: PaymentSettings = {
  payfast: {
    enabled: false,
    sandbox: true,
    merchantId: '',
    merchantKey: '',
    passphrase: '',
  },
  payflex: {
    enabled: false,
    sandbox: true,
    merchantId: '',
    apiKey: '',
  },
  eft: {
    enabled: false,
    bankName: '',
    accountName: '',
    accountNumber: '',
    branchCode: '',
    reference: 'Order number',
  },
  cod: {
    enabled: false,
    surcharge: 0,
    maxOrderAmount: 5000,
  },
};

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
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(defaultPaymentSettings);
  const [emailSettings, setEmailSettings] = useState<EmailSettings>(defaultEmailSettings);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [testingEmail, setTestingEmail] = useState(false);
  const [testEmailStatus, setTestEmailStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    async function fetchSettings() {
      try {
        const [siteData, paymentData, emailData] = await Promise.all([
          getDocument('settings', 'site'),
          getDocument('settings', 'payment'),
          getDocument('settings', 'email'),
        ]);
        if (siteData) {
          setSettings({ ...defaultSettings, ...(siteData as unknown as SiteSettings) });
        }
        if (paymentData) {
          setPaymentSettings({ ...defaultPaymentSettings, ...(paymentData as unknown as PaymentSettings) });
        }
        if (emailData) {
          const ed = emailData as unknown as EmailSettings;
          setEmailSettings({
            smtp: { ...defaultEmailSettings.smtp, ...(ed.smtp || {}) },
            notifications: { ...defaultEmailSettings.notifications, ...(ed.notifications || {}) },
          });
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
      await Promise.all([
        setDocument('settings', 'site', {
          ...settings,
          updatedAt: new Date().toISOString(),
        }),
        setDocument('settings', 'payment', {
          ...paymentSettings,
          updatedAt: new Date().toISOString(),
        }),
        setDocument('settings', 'email', {
          ...emailSettings,
          updatedAt: new Date().toISOString(),
        }),
      ]);
      toast.success('Settings saved!');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const ToggleSwitch = ({ enabled, onToggle, label }: { enabled: boolean; onToggle: () => void; label: string }) => (
    <button
      type="button"
      onClick={onToggle}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
        enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
      }`}
    >
      {enabled ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
      {label}: {enabled ? 'On' : 'Off'}
    </button>
  );

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

        {/* Email / SMTP Configuration */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Server className="w-4 h-4" />
            Email / SMTP Configuration
          </h3>
          <p className="text-sm text-gray-500">
            Configure your SMTP server to send notification emails. For Gmail, use <code className="bg-gray-100 px-1 rounded text-xs">smtp.gmail.com</code> with an App Password.
          </p>

          {/* SMTP Server */}
          <div className="rounded-xl border border-gray-200 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-gray-500" />
              <p className="font-medium text-gray-900 text-sm">SMTP Server</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Input
                label="SMTP Host"
                placeholder="smtp.gmail.com"
                value={emailSettings.smtp.host}
                onChange={(e) => setEmailSettings({
                  ...emailSettings,
                  smtp: { ...emailSettings.smtp, host: e.target.value },
                })}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Port"
                  type="number"
                  placeholder="587"
                  value={emailSettings.smtp.port.toString()}
                  onChange={(e) => setEmailSettings({
                    ...emailSettings,
                    smtp: { ...emailSettings.smtp, port: parseInt(e.target.value) || 587 },
                  })}
                />
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">Security</label>
                  <select
                    className="h-10 px-3 rounded-lg border border-gray-300 text-sm bg-white"
                    value={emailSettings.smtp.secure ? 'ssl' : 'tls'}
                    onChange={(e) => setEmailSettings({
                      ...emailSettings,
                      smtp: { ...emailSettings.smtp, secure: e.target.value === 'ssl', port: e.target.value === 'ssl' ? 465 : 587 },
                    })}
                  >
                    <option value="tls">STARTTLS (587)</option>
                    <option value="ssl">SSL/TLS (465)</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Input
                label="Username / Email"
                placeholder="your@gmail.com"
                value={emailSettings.smtp.user}
                onChange={(e) => setEmailSettings({
                  ...emailSettings,
                  smtp: { ...emailSettings.smtp, user: e.target.value },
                })}
              />
              <Input
                label="Password / App Password"
                type="password"
                placeholder="••••••••••••••••"
                value={emailSettings.smtp.pass}
                onChange={(e) => setEmailSettings({
                  ...emailSettings,
                  smtp: { ...emailSettings.smtp, pass: e.target.value },
                })}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Input
                label="From Name"
                placeholder="Unlimited IT Solutions"
                value={emailSettings.smtp.fromName}
                onChange={(e) => setEmailSettings({
                  ...emailSettings,
                  smtp: { ...emailSettings.smtp, fromName: e.target.value },
                })}
              />
              <Input
                label="From Email"
                type="email"
                placeholder="noreply@unlimitedits.co.za"
                value={emailSettings.smtp.fromEmail}
                onChange={(e) => setEmailSettings({
                  ...emailSettings,
                  smtp: { ...emailSettings.smtp, fromEmail: e.target.value },
                })}
              />
            </div>
            <div className="rounded-lg bg-amber-50 border border-amber-100 p-3">
              <p className="text-xs text-amber-700">
                <strong>Gmail users:</strong> Enable 2-Step Verification in your Google Account, then go to
                Security → App passwords → Create a new app password for &ldquo;Mail&rdquo;. Use that 16-character password here.
              </p>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="rounded-xl border border-gray-200 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-gray-500" />
              <p className="font-medium text-gray-900 text-sm">Notification Preferences</p>
            </div>
            <Input
              label="Admin Notification Email"
              type="email"
              placeholder="willemvangreunen6@gmail.com"
              value={emailSettings.notifications.adminEmail}
              onChange={(e) => setEmailSettings({
                ...emailSettings,
                notifications: { ...emailSettings.notifications, adminEmail: e.target.value },
              })}
              icon={<Mail className="w-4 h-4" />}
            />
            <p className="text-xs text-gray-500">This is where all admin notification emails will be sent.</p>
            <div className="space-y-2">
              {[
                { key: 'onNewSignup' as const, label: 'New user signup', desc: 'Get notified when someone creates an account' },
                { key: 'onNewOrder' as const, label: 'New order placed', desc: 'Get notified when a customer places an order' },
                { key: 'onPaymentReceived' as const, label: 'Payment received', desc: 'Get notified when a payment is confirmed' },
                { key: 'onContactForm' as const, label: 'Contact form submission', desc: 'Get notified when someone submits the contact form' },
              ].map((notif) => (
                <label
                  key={notif.key}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                    emailSettings.notifications[notif.key]
                      ? 'border-green-200 bg-green-50/50'
                      : 'border-gray-200'
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{notif.label}</p>
                    <p className="text-xs text-gray-500">{notif.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailSettings.notifications[notif.key]}
                    onChange={(e) => setEmailSettings({
                      ...emailSettings,
                      notifications: { ...emailSettings.notifications, [notif.key]: e.target.checked },
                    })}
                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Test Email */}
          <div className="rounded-xl border border-dashed border-gray-300 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 text-sm">Test Email</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Send a test email to verify your SMTP settings are working.
                  {emailSettings.notifications.adminEmail
                    ? ` Will send to ${emailSettings.notifications.adminEmail}`
                    : ' Set an admin email above first.'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {testEmailStatus === 'success' && (
                  <span className="flex items-center gap-1 text-xs text-green-600">
                    <CheckCircle className="w-3.5 h-3.5" /> Sent!
                  </span>
                )}
                {testEmailStatus === 'error' && (
                  <span className="flex items-center gap-1 text-xs text-red-600">
                    <AlertCircle className="w-3.5 h-3.5" /> Failed
                  </span>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={testingEmail || !emailSettings.smtp.host || !emailSettings.smtp.user || !emailSettings.smtp.pass || !emailSettings.notifications.adminEmail}
                  onClick={async () => {
                    setTestingEmail(true);
                    setTestEmailStatus('idle');
                    try {
                      // Save email settings first so the API can read them
                      await setDocument('settings', 'email', {
                        ...emailSettings,
                        updatedAt: new Date().toISOString(),
                      });
                      const res = await fetch('/api/notifications/test', { method: 'POST' });
                      const data = await res.json();
                      if (data.sent) {
                        setTestEmailStatus('success');
                        toast.success('Test email sent! Check your inbox.');
                      } else {
                        setTestEmailStatus('error');
                        toast.error(data.error || 'Failed to send test email');
                      }
                    } catch {
                      setTestEmailStatus('error');
                      toast.error('Failed to send test email');
                    } finally {
                      setTestingEmail(false);
                    }
                  }}
                >
                  {testingEmail ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                  ) : (
                    <><Send className="w-4 h-4" /> Send Test</>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Gateways */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Payment Methods
          </h3>
          <p className="text-sm text-gray-500">
            Configure payment gateways for your store. Customers will see enabled methods at checkout.
          </p>

          {/* PayFast */}
          <div className={`rounded-xl border-2 p-5 space-y-4 transition-colors ${
            paymentSettings.payfast.enabled ? 'border-green-200 bg-green-50/30' : 'border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">PayFast</p>
                  <p className="text-xs text-gray-500">Credit/debit cards, instant EFT, SnapScan, Mobicred</p>
                </div>
              </div>
              <ToggleSwitch
                enabled={paymentSettings.payfast.enabled}
                onToggle={() => setPaymentSettings({
                  ...paymentSettings,
                  payfast: { ...paymentSettings.payfast, enabled: !paymentSettings.payfast.enabled },
                })}
                label="PayFast"
              />
            </div>
            {paymentSettings.payfast.enabled && (
              <div className="space-y-3 pt-2 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <ToggleSwitch
                    enabled={paymentSettings.payfast.sandbox}
                    onToggle={() => setPaymentSettings({
                      ...paymentSettings,
                      payfast: { ...paymentSettings.payfast, sandbox: !paymentSettings.payfast.sandbox },
                    })}
                    label="Sandbox"
                  />
                  <span className="text-xs text-gray-400">
                    {paymentSettings.payfast.sandbox ? 'Testing mode — no real charges' : 'Live — real payments will be processed'}
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Input
                    label="Merchant ID"
                    placeholder="10000100"
                    value={paymentSettings.payfast.merchantId}
                    onChange={(e) => setPaymentSettings({
                      ...paymentSettings,
                      payfast: { ...paymentSettings.payfast, merchantId: e.target.value },
                    })}
                  />
                  <Input
                    label="Merchant Key"
                    placeholder="46f0cd694581a"
                    value={paymentSettings.payfast.merchantKey}
                    onChange={(e) => setPaymentSettings({
                      ...paymentSettings,
                      payfast: { ...paymentSettings.payfast, merchantKey: e.target.value },
                    })}
                  />
                </div>
                <Input
                  label="Passphrase"
                  type="password"
                  placeholder="Your PayFast passphrase"
                  value={paymentSettings.payfast.passphrase}
                  onChange={(e) => setPaymentSettings({
                    ...paymentSettings,
                    payfast: { ...paymentSettings.payfast, passphrase: e.target.value },
                  })}
                />
                <div className="rounded-lg bg-blue-50 border border-blue-100 p-3">
                  <p className="text-xs text-blue-700">
                    Get your PayFast credentials at{' '}
                    <a href="https://www.payfast.co.za" target="_blank" rel="noreferrer" className="underline font-medium">
                      payfast.co.za
                    </a>. Set your return URL to <code className="bg-blue-100 px-1 rounded">https://unlimitedits.co.za/checkout/success</code> and notify URL to <code className="bg-blue-100 px-1 rounded">https://unlimitedits.co.za/api/payments/payfast/notify</code>.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* PayFlex */}
          <div className={`rounded-xl border-2 p-5 space-y-4 transition-colors ${
            paymentSettings.payflex.enabled ? 'border-green-200 bg-green-50/30' : 'border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Banknote className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">PayFlex</p>
                  <p className="text-xs text-gray-500">Buy now, pay later — 4 interest-free instalments</p>
                </div>
              </div>
              <ToggleSwitch
                enabled={paymentSettings.payflex.enabled}
                onToggle={() => setPaymentSettings({
                  ...paymentSettings,
                  payflex: { ...paymentSettings.payflex, enabled: !paymentSettings.payflex.enabled },
                })}
                label="PayFlex"
              />
            </div>
            {paymentSettings.payflex.enabled && (
              <div className="space-y-3 pt-2 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <ToggleSwitch
                    enabled={paymentSettings.payflex.sandbox}
                    onToggle={() => setPaymentSettings({
                      ...paymentSettings,
                      payflex: { ...paymentSettings.payflex, sandbox: !paymentSettings.payflex.sandbox },
                    })}
                    label="Sandbox"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Input
                    label="Merchant ID"
                    placeholder="Your PayFlex Merchant ID"
                    value={paymentSettings.payflex.merchantId}
                    onChange={(e) => setPaymentSettings({
                      ...paymentSettings,
                      payflex: { ...paymentSettings.payflex, merchantId: e.target.value },
                    })}
                  />
                  <Input
                    label="API Key"
                    type="password"
                    placeholder="Your PayFlex API key"
                    value={paymentSettings.payflex.apiKey}
                    onChange={(e) => setPaymentSettings({
                      ...paymentSettings,
                      payflex: { ...paymentSettings.payflex, apiKey: e.target.value },
                    })}
                  />
                </div>
                <div className="rounded-lg bg-purple-50 border border-purple-100 p-3">
                  <p className="text-xs text-purple-700">
                    Customers pay 25% upfront and the rest over 6 weeks in 3 instalments. Register at{' '}
                    <a href="https://www.payflex.co.za" target="_blank" rel="noreferrer" className="underline font-medium">
                      payflex.co.za
                    </a>.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* EFT / Bank Transfer */}
          <div className={`rounded-xl border-2 p-5 space-y-4 transition-colors ${
            paymentSettings.eft.enabled ? 'border-green-200 bg-green-50/30' : 'border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Banknote className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">EFT / Bank Transfer</p>
                  <p className="text-xs text-gray-500">Manual bank transfer — order processed after proof of payment</p>
                </div>
              </div>
              <ToggleSwitch
                enabled={paymentSettings.eft.enabled}
                onToggle={() => setPaymentSettings({
                  ...paymentSettings,
                  eft: { ...paymentSettings.eft, enabled: !paymentSettings.eft.enabled },
                })}
                label="EFT"
              />
            </div>
            {paymentSettings.eft.enabled && (
              <div className="space-y-3 pt-2 border-t border-gray-200">
                <div className="grid sm:grid-cols-2 gap-3">
                  <Input
                    label="Bank Name"
                    placeholder="FNB, Standard Bank, etc."
                    value={paymentSettings.eft.bankName}
                    onChange={(e) => setPaymentSettings({
                      ...paymentSettings,
                      eft: { ...paymentSettings.eft, bankName: e.target.value },
                    })}
                  />
                  <Input
                    label="Account Name"
                    placeholder="Unlimited IT Solutions"
                    value={paymentSettings.eft.accountName}
                    onChange={(e) => setPaymentSettings({
                      ...paymentSettings,
                      eft: { ...paymentSettings.eft, accountName: e.target.value },
                    })}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Input
                    label="Account Number"
                    placeholder="62000000000"
                    value={paymentSettings.eft.accountNumber}
                    onChange={(e) => setPaymentSettings({
                      ...paymentSettings,
                      eft: { ...paymentSettings.eft, accountNumber: e.target.value },
                    })}
                  />
                  <Input
                    label="Branch Code"
                    placeholder="250655"
                    value={paymentSettings.eft.branchCode}
                    onChange={(e) => setPaymentSettings({
                      ...paymentSettings,
                      eft: { ...paymentSettings.eft, branchCode: e.target.value },
                    })}
                  />
                </div>
                <Input
                  label="Payment Reference Instructions"
                  placeholder="Use your order number as reference"
                  value={paymentSettings.eft.reference}
                  onChange={(e) => setPaymentSettings({
                    ...paymentSettings,
                    eft: { ...paymentSettings.eft, reference: e.target.value },
                  })}
                />
              </div>
            )}
          </div>

          {/* Cash on Delivery */}
          <div className={`rounded-xl border-2 p-5 space-y-4 transition-colors ${
            paymentSettings.cod.enabled ? 'border-green-200 bg-green-50/30' : 'border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Cash on Delivery</p>
                  <p className="text-xs text-gray-500">Customer pays when the order is delivered</p>
                </div>
              </div>
              <ToggleSwitch
                enabled={paymentSettings.cod.enabled}
                onToggle={() => setPaymentSettings({
                  ...paymentSettings,
                  cod: { ...paymentSettings.cod, enabled: !paymentSettings.cod.enabled },
                })}
                label="COD"
              />
            </div>
            {paymentSettings.cod.enabled && (
              <div className="space-y-3 pt-2 border-t border-gray-200">
                <div className="grid sm:grid-cols-2 gap-3">
                  <Input
                    label="COD Surcharge (R)"
                    type="number"
                    placeholder="0"
                    value={paymentSettings.cod.surcharge.toString()}
                    onChange={(e) => setPaymentSettings({
                      ...paymentSettings,
                      cod: { ...paymentSettings.cod, surcharge: parseFloat(e.target.value) || 0 },
                    })}
                  />
                  <Input
                    label="Max Order Amount (R)"
                    type="number"
                    placeholder="5000"
                    value={paymentSettings.cod.maxOrderAmount.toString()}
                    onChange={(e) => setPaymentSettings({
                      ...paymentSettings,
                      cod: { ...paymentSettings.cod, maxOrderAmount: parseFloat(e.target.value) || 0 },
                    })}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <Button type="submit" loading={loading}>
          <Save className="w-4 h-4" />
          Save Settings
        </Button>
      </form>
    </div>
  );
}
