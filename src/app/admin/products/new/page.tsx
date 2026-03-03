'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Textarea, Select } from '@/components/ui';
import { addDocument } from '@/lib/firebase';
import { CATEGORIES } from '@/lib/utils';
import { ArrowLeft, Plus, X, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    salePrice: '',
    category: '',
    brand: '',
    sku: '',
    stock: '',
    images: [''],
    specifications: [{ key: '', value: '' }],
    tags: '',
    isFeatured: false,
    isActive: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category) {
      toast.error('Name, price, and category are required');
      return;
    }

    setLoading(true);
    try {
      const product = {
        name: form.name,
        description: form.description,
        shortDescription: form.shortDescription,
        price: parseFloat(form.price),
        salePrice: form.salePrice ? parseFloat(form.salePrice) : null,
        category: form.category,
        brand: form.brand,
        sku: form.sku,
        stock: form.stock ? parseInt(form.stock) : null,
        images: form.images.filter((img) => img.trim() !== ''),
        specifications: form.specifications
          .filter((s) => s.key && s.value)
          .reduce((acc: Record<string, string>, s) => {
            acc[s.key] = s.value;
            return acc;
          }, {}),
        tags: form.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        isFeatured: form.isFeatured,
        isActive: form.isActive,
        rating: 0,
        reviewCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await addDocument('products', product);
      toast.success('Product created successfully!');
      router.push('/admin/products');
    } catch {
      toast.error('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const addImage = () => setForm({ ...form, images: [...form.images, ''] });
  const removeImage = (i: number) =>
    setForm({ ...form, images: form.images.filter((_, idx) => idx !== i) });
  const updateImage = (i: number, value: string) => {
    const images = [...form.images];
    images[i] = value;
    setForm({ ...form, images });
  };

  const addSpec = () =>
    setForm({
      ...form,
      specifications: [...form.specifications, { key: '', value: '' }],
    });
  const removeSpec = (i: number) =>
    setForm({
      ...form,
      specifications: form.specifications.filter((_, idx) => idx !== i),
    });
  const updateSpec = (i: number, field: 'key' | 'value', val: string) => {
    const specs = [...form.specifications];
    specs[i][field] = val;
    setForm({ ...form, specifications: specs });
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link
          href="/admin/products"
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>
        <h2 className="text-xl font-bold text-gray-900">Add New Product</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Basic Information</h3>
          <Input
            label="Product Name *"
            placeholder="Enter product name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Textarea
            label="Short Description"
            placeholder="Brief product summary (shown in listings)"
            value={form.shortDescription}
            onChange={(e) =>
              setForm({ ...form, shortDescription: e.target.value })
            }
            rows={2}
          />
          <Textarea
            label="Full Description"
            placeholder="Detailed product description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={5}
          />
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Pricing & Inventory</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price (ZAR) *"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
            <Input
              label="Sale Price (ZAR)"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={form.salePrice}
              onChange={(e) => setForm({ ...form, salePrice: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="SKU"
              placeholder="PROD-001"
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
            />
            <Input
              label="Stock Quantity"
              type="number"
              placeholder="Unlimited"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />
            <Select
              label="Category *"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              options={[
                { value: '', label: 'Select category' },
                ...CATEGORIES.map((c) => ({ value: c.slug, label: c.name })),
              ]}
              required
            />
          </div>
          <Input
            label="Brand"
            placeholder="Brand name"
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
          />
        </div>

        {/* Images */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Images</h3>
          <p className="text-sm text-gray-500">
            Add image URLs. First image is the main product image.
          </p>
          {form.images.map((img, i) => (
            <div key={i} className="flex gap-2">
              <Input
                placeholder="https://example.com/image.jpg"
                value={img}
                onChange={(e) => updateImage(i, e.target.value)}
                className="flex-1"
              />
              {form.images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="p-2 text-red-400 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addImage}>
            <Plus className="w-3.5 h-3.5" />
            Add Image URL
          </Button>
        </div>

        {/* Specifications */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Specifications</h3>
          {form.specifications.map((spec, i) => (
            <div key={i} className="flex gap-2">
              <Input
                placeholder="Key (e.g., Weight)"
                value={spec.key}
                onChange={(e) => updateSpec(i, 'key', e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Value (e.g., 500g)"
                value={spec.value}
                onChange={(e) => updateSpec(i, 'value', e.target.value)}
                className="flex-1"
              />
              <button
                type="button"
                onClick={() => removeSpec(i)}
                className="p-2 text-red-400 hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addSpec}>
            <Plus className="w-3.5 h-3.5" />
            Add Specification
          </Button>
        </div>

        {/* Options */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Options</h3>
          <Input
            label="Tags (comma-separated)"
            placeholder="laptop, gaming, sale"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) =>
                  setForm({ ...form, isFeatured: e.target.checked })
                }
                className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Featured Product</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm({ ...form, isActive: e.target.checked })
                }
                className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Active</span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <Button type="submit" loading={loading}>
            Create Product
          </Button>
          <Link href="/admin/products">
            <Button variant="ghost">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
