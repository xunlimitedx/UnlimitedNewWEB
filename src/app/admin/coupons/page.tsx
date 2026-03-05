'use client';

import React, { useState, useEffect } from 'react';
import { Button, Badge, Input, Select } from '@/components/ui';
import { Modal } from '@/components/ui';
import { getCollection, addDocument, updateDocument, deleteDocument } from '@/lib/firebase';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Plus, Edit, Trash2, Tag, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxUses: number;
  usedCount: number;
  expiresAt: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [form, setForm] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 10,
    minOrderAmount: 0,
    maxUses: 0,
    expiresAt: '',
    isActive: true,
  });

  useEffect(() => { fetchCoupons(); }, []);

  async function fetchCoupons() {
    try {
      const data = await getCollection('coupons');
      const sorted = (data as unknown as Coupon[]).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setCoupons(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function openEditor(coupon?: Coupon) {
    if (coupon) {
      setEditingCoupon(coupon);
      setForm({
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrderAmount: coupon.minOrderAmount,
        maxUses: coupon.maxUses,
        expiresAt: coupon.expiresAt || '',
        isActive: coupon.isActive,
      });
    } else {
      setEditingCoupon(null);
      setForm({ code: '', discountType: 'percentage', discountValue: 10, minOrderAmount: 0, maxUses: 0, expiresAt: '', isActive: true });
    }
    setShowEditor(true);
  }

  async function handleSave() {
    if (!form.code.trim()) {
      toast.error('Coupon code is required');
      return;
    }

    const couponData = {
      code: form.code.trim().toUpperCase(),
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      minOrderAmount: Number(form.minOrderAmount),
      maxUses: Number(form.maxUses),
      expiresAt: form.expiresAt || null,
      isActive: form.isActive,
      updatedAt: new Date().toISOString(),
    };

    try {
      if (editingCoupon) {
        await updateDocument('coupons', editingCoupon.id, couponData);
        toast.success('Coupon updated');
      } else {
        await addDocument('coupons', { ...couponData, usedCount: 0, createdAt: new Date().toISOString() });
        toast.success('Coupon created');
      }
      setShowEditor(false);
      fetchCoupons();
    } catch {
      toast.error('Failed to save coupon');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this coupon?')) return;
    try {
      await deleteDocument('coupons', id);
      toast.success('Coupon deleted');
      fetchCoupons();
    } catch {
      toast.error('Failed to delete');
    }
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    toast.success('Coupon code copied');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
          <p className="text-sm text-gray-500">{coupons.length} coupons</p>
        </div>
        <Button onClick={() => openEditor()}><Plus className="w-4 h-4" /> New Coupon</Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : coupons.length === 0 ? (
        <div className="text-center py-12">
          <Tag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No coupons yet. Create your first discount code!</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase">
              <tr>
                <th className="px-6 py-3 text-left">Code</th>
                <th className="px-6 py-3 text-left">Discount</th>
                <th className="px-6 py-3 text-left">Min Order</th>
                <th className="px-6 py-3 text-left">Usage</th>
                <th className="px-6 py-3 text-left">Expires</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {coupons.map((coupon) => {
                const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
                const isMaxedOut = coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses;
                return (
                  <tr key={coupon.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <code className="font-mono font-bold text-primary-600">{coupon.code}</code>
                        <button onClick={() => copyCode(coupon.code)} className="text-gray-400 hover:text-gray-600">
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : formatCurrency(coupon.discountValue)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {coupon.minOrderAmount > 0 ? formatCurrency(coupon.minOrderAmount) : '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {coupon.usedCount}{coupon.maxUses > 0 ? ` / ${coupon.maxUses}` : ' / ∞'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {coupon.expiresAt ? formatDate(coupon.expiresAt) : 'Never'}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={!coupon.isActive || isExpired || isMaxedOut ? 'danger' : 'success'}>
                        {!coupon.isActive ? 'Disabled' : isExpired ? 'Expired' : isMaxedOut ? 'Maxed Out' : 'Active'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" onClick={() => openEditor(coupon)}><Edit className="w-4 h-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDelete(coupon.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={showEditor} onClose={() => setShowEditor(false)} title={editingCoupon ? 'Edit Coupon' : 'New Coupon'} size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
            <Input
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              placeholder="e.g. SAVE20"
              className="font-mono uppercase"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <Select
                value={form.discountType}
                onChange={(e) => setForm({ ...form, discountType: e.target.value as 'percentage' | 'fixed' })}
                options={[
                  { value: 'percentage', label: 'Percentage (%)' },
                  { value: 'fixed', label: 'Fixed Amount (R)' },
                ]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
              <Input type="number" min="0" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Order Amount</label>
              <Input type="number" min="0" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: Number(e.target.value) })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Uses (0 = unlimited)</label>
              <Input type="number" min="0" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: Number(e.target.value) })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expires At</label>
            <Input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="couponActive" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded border-gray-300" />
            <label htmlFor="couponActive" className="text-sm text-gray-700">Active</label>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowEditor(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingCoupon ? 'Update' : 'Create'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
