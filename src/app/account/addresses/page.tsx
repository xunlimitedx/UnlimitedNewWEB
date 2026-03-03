'use client';

import React, { useState, useEffect } from 'react';
import { Button, Input, Select, Badge, EmptyState, Modal } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { getDocument, updateDocument } from '@/lib/firebase';
import { PROVINCES, generateId } from '@/lib/utils';
import { MapPin, Plus, Edit2, Trash2, Star } from 'lucide-react';
import type { Address } from '@/types';
import toast from 'react-hot-toast';

export default function AddressesPage() {
  const { user, userProfile } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(false);

  const emptyAddress: Omit<Address, 'id'> = {
    label: '',
    firstName: '',
    lastName: '',
    street: '',
    apartment: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'South Africa',
    phone: '',
    isDefault: false,
  };

  const [form, setForm] = useState<Omit<Address, 'id'>>(emptyAddress);

  useEffect(() => {
    if (userProfile?.addresses) {
      setAddresses(userProfile.addresses);
    }
  }, [userProfile]);

  const handleSave = async () => {
    if (!user) return;
    if (!form.firstName || !form.lastName || !form.street || !form.city || !form.province || !form.postalCode) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      let updated: Address[];
      if (editingAddress) {
        updated = addresses.map((a) =>
          a.id === editingAddress.id ? { ...form, id: a.id } : a
        );
      } else {
        const newAddress: Address = { ...form, id: generateId() };
        updated = [...addresses, newAddress];
      }

      // Handle default
      if (form.isDefault) {
        updated = updated.map((a) => ({
          ...a,
          isDefault: editingAddress
            ? a.id === editingAddress.id
            : a.id === updated[updated.length - 1].id,
        }));
      }

      await updateDocument('users', user.uid, { addresses: updated });
      setAddresses(updated);
      setShowModal(false);
      setEditingAddress(null);
      setForm(emptyAddress);
      toast.success(editingAddress ? 'Address updated' : 'Address added');
    } catch {
      toast.error('Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (addressId: string) => {
    if (!user) return;
    const updated = addresses.filter((a) => a.id !== addressId);
    await updateDocument('users', user.uid, { addresses: updated });
    setAddresses(updated);
    toast.success('Address removed');
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setForm(address);
    setShowModal(true);
  };

  return (
    <div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Saved Addresses
            </h2>
            <p className="text-sm text-gray-500">
              {addresses.length} address{addresses.length !== 1 ? 'es' : ''}
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingAddress(null);
              setForm(emptyAddress);
              setShowModal(true);
            }}
          >
            <Plus className="w-4 h-4" />
            Add Address
          </Button>
        </div>

        {addresses.length === 0 ? (
          <EmptyState
            icon={<MapPin className="w-16 h-16" />}
            title="No Addresses Saved"
            description="Add a shipping address to speed up checkout."
          />
        ) : (
          <div className="grid sm:grid-cols-2 gap-4 p-6">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`rounded-xl border-2 p-5 relative ${
                  address.isDefault
                    ? 'border-primary-600 bg-primary-50/50'
                    : 'border-gray-200'
                }`}
              >
                {address.isDefault && (
                  <Badge variant="info" className="absolute top-3 right-3">
                    <Star className="w-3 h-3 mr-1" />
                    Default
                  </Badge>
                )}
                {address.label && (
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    {address.label}
                  </p>
                )}
                <p className="font-medium text-gray-900">
                  {address.firstName} {address.lastName}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {address.street}
                  {address.apartment && `, ${address.apartment}`}
                  <br />
                  {address.city}, {address.province} {address.postalCode}
                  <br />
                  {address.phone}
                </p>
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(address)}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(address.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Address Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingAddress(null);
          setForm(emptyAddress);
        }}
        title={editingAddress ? 'Edit Address' : 'Add New Address'}
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Label (e.g., Home, Office)"
            placeholder="Home"
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name *"
              placeholder="John"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              required
            />
            <Input
              label="Last Name *"
              placeholder="Doe"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              required
            />
          </div>
          <Input
            label="Street Address *"
            placeholder="123 Main Street"
            value={form.street}
            onChange={(e) => setForm({ ...form, street: e.target.value })}
            required
          />
          <Input
            label="Apartment / Suite"
            placeholder="Apt 4B"
            value={form.apartment}
            onChange={(e) => setForm({ ...form, apartment: e.target.value })}
          />
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="City *"
              placeholder="Johannesburg"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              required
            />
            <Select
              label="Province *"
              value={form.province}
              onChange={(e) => setForm({ ...form, province: e.target.value })}
              options={[
                { value: '', label: 'Select' },
                ...PROVINCES.map((p) => ({ value: p, label: p })),
              ]}
              required
            />
            <Input
              label="Postal Code *"
              placeholder="2000"
              value={form.postalCode}
              onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
              required
            />
          </div>
          <Input
            label="Phone *"
            type="tel"
            placeholder="082 000 0000"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">
              Set as default address
            </span>
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={() => {
                setShowModal(false);
                setEditingAddress(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} loading={loading}>
              {editingAddress ? 'Update Address' : 'Add Address'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
