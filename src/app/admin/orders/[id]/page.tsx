'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getDocument, updateDocument } from '@/lib/firebase';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import { Button } from '@/components/ui';
import OrderTimeline from '@/components/OrderTimeline';
import type { Order, OrderStatus } from '@/types';
import toast from 'react-hot-toast';
import {
  ArrowLeft, User, MapPin, CreditCard, Package, Truck,
  FileText, Save, Printer,
} from 'lucide-react';
import Image from 'next/image';

const ALL_STATUSES: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderStatus>('pending');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');
  const [courier, setCourier] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await getDocument('orders', orderId);
        if (data) {
          const o = data as unknown as Order;
          setOrder(o);
          setNewStatus(o.status);
          setTrackingNumber(o.trackingNumber || '');
          setTrackingUrl(o.trackingUrl || '');
          setCourier(o.courier || '');
          setAdminNotes(o.adminNotes || '');
        }
      } catch {
        toast.error('Failed to load order');
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  const handleSave = async () => {
    if (!order) return;
    setSaving(true);
    try {
      const updates: Record<string, unknown> = {
        status: newStatus,
        trackingNumber: trackingNumber || null,
        trackingUrl: trackingUrl || null,
        courier: courier || null,
        adminNotes: adminNotes || null,
      };

      // Add timeline event if status changed
      if (newStatus !== order.status) {
        const timeline = order.timeline || [];
        timeline.unshift({
          status: newStatus,
          timestamp: new Date().toISOString(),
          note: `Status updated to ${newStatus}`,
        });
        updates.timeline = timeline;
      }

      await updateDocument('orders', orderId, updates);
      setOrder({ ...order, ...updates } as Order);
      toast.success('Order updated');
    } catch {
      toast.error('Failed to update order');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="h-64 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500">Order not found</p>
        <Button onClick={() => router.push('/admin/orders')} variant="outline" className="mt-4">
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/admin/orders')} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order #{order.id.slice(0, 8)}</h1>
            <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="w-4 h-4" /> Print
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Order Timeline */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold mb-4">Order Status</h2>
        <OrderTimeline
          currentStatus={order.status}
          timeline={order.timeline}
          trackingNumber={order.trackingNumber}
          trackingUrl={order.trackingUrl}
          courier={order.courier}
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Status & Tracking Controls */}
        <div className="bg-white rounded-xl border p-5 space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Truck className="w-4 h-4 text-primary-600" /> Update Status
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
              className="w-full h-9 px-3 text-sm border rounded-lg"
            >
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s} className="capitalize">{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Courier</label>
            <input
              type="text"
              value={courier}
              onChange={(e) => setCourier(e.target.value)}
              className="w-full h-9 px-3 text-sm border rounded-lg"
              placeholder="e.g. The Courier Guy"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Number</label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="w-full h-9 px-3 text-sm border rounded-lg"
              placeholder="Enter tracking number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tracking URL</label>
            <input
              type="text"
              value={trackingUrl}
              onChange={(e) => setTrackingUrl(e.target.value)}
              className="w-full h-9 px-3 text-sm border rounded-lg"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes</label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-lg"
              rows={3}
              placeholder="Internal notes..."
            />
          </div>
        </div>

        {/* Customer / Address Info */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border p-5">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-primary-600" /> Customer
            </h3>
            <p className="text-sm text-gray-700">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
            <p className="text-sm text-gray-500">{order.shippingAddress.phone}</p>
          </div>
          <div className="bg-white rounded-xl border p-5">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-primary-600" /> Shipping Address
            </h3>
            <p className="text-sm text-gray-700">{order.shippingAddress.street}</p>
            {order.shippingAddress.apartment && <p className="text-sm text-gray-700">{order.shippingAddress.apartment}</p>}
            <p className="text-sm text-gray-700">{order.shippingAddress.city}, {order.shippingAddress.province}</p>
            <p className="text-sm text-gray-700">{order.shippingAddress.postalCode}</p>
          </div>
          <div className="bg-white rounded-xl border p-5">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
              <CreditCard className="w-4 h-4 text-primary-600" /> Payment
            </h3>
            <p className="text-sm text-gray-700 capitalize">{order.paymentMethod}</p>
            <p className={`text-sm font-medium mt-1 ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
              {order.paymentStatus}
            </p>
          </div>
        </div>

        {/* Order Items & Totals */}
        <div className="bg-white rounded-xl border p-5">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <Package className="w-4 h-4 text-primary-600" /> Items ({order.items.length})
          </h3>
          <div className="space-y-3 mb-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.image && <Image src={item.image} alt={item.name} width={48} height={48} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    {item.quantity} × {formatCurrency(item.price)}
                    {item.variant && ` · ${item.variant}`}
                  </p>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 space-y-1.5">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            {order.discount && order.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-gray-600">
              <span>Shipping</span>
              <span>{order.shipping === 0 ? 'FREE' : formatCurrency(order.shipping)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Tax</span>
              <span>{formatCurrency(order.tax)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
