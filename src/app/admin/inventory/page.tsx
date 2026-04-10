'use client';

import React, { useState, useEffect } from 'react';
import { getCollection, updateDocument } from '@/lib/firebase';
import { formatCurrency } from '@/lib/utils';
import {
  Package, AlertTriangle, Search, Filter,
  ArrowUpDown, Eye, Edit2, Save, X,
} from 'lucide-react';
import { Button } from '@/components/ui';
import type { Product } from '@/types';
import toast from 'react-hot-toast';

type SortField = 'name' | 'stock' | 'price' | 'category';

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'low' | 'out' | 'in'>('all');
  const [sortField, setSortField] = useState<SortField>('stock');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStock, setEditStock] = useState(0);

  useEffect(() => {
    getCollection('products', [])
      .then((data) => setProducts(data as unknown as Product[]))
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = products
    .filter((p) => {
      if (search) {
        const q = search.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q);
      }
      return true;
    })
    .filter((p) => {
      const stock = p.stock ?? 999;
      switch (filter) {
        case 'low': return stock > 0 && stock <= 10;
        case 'out': return stock === 0;
        case 'in': return stock > 10;
        default: return true;
      }
    })
    .sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'name': cmp = a.name.localeCompare(b.name); break;
        case 'stock': cmp = (a.stock ?? 999) - (b.stock ?? 999); break;
        case 'price': cmp = a.price - b.price; break;
        case 'category': cmp = (a.category || '').localeCompare(b.category || ''); break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const handleSaveStock = async (productId: string) => {
    try {
      await updateDocument('products', productId, { stock: editStock });
      setProducts((prev) => prev.map((p) => p.id === productId ? { ...p, stock: editStock } : p));
      setEditingId(null);
      toast.success('Stock updated');
    } catch {
      toast.error('Failed to update stock');
    }
  };

  const totalProducts = products.length;
  const lowStock = products.filter((p) => (p.stock ?? 999) > 0 && (p.stock ?? 999) <= 10).length;
  const outOfStock = products.filter((p) => (p.stock ?? 0) === 0).length;
  const totalValue = products.reduce((s, p) => s + p.price * (p.stock ?? 0), 0);

  if (loading) {
    return <div className="animate-pulse"><div className="h-96 bg-gray-200 rounded-xl" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <p className="text-xs text-gray-500">Total Products</p>
          <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-xs text-gray-500">Total Inventory Value</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
        </div>
        <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4">
          <p className="text-xs text-yellow-600">Low Stock</p>
          <p className="text-2xl font-bold text-yellow-700">{lowStock}</p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-4">
          <p className="text-xs text-red-600">Out of Stock</p>
          <p className="text-2xl font-bold text-red-700">{outOfStock}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, SKU, category..."
            className="w-full h-10 pl-10 pr-4 border rounded-lg text-sm"
          />
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {(['all', 'in', 'low', 'out'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filter === f ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f === 'all' ? 'All' : f === 'in' ? 'In Stock' : f === 'low' ? 'Low Stock' : 'Out of Stock'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                {[
                  { key: 'name' as SortField, label: 'Product' },
                  { key: 'category' as SortField, label: 'Category' },
                  { key: 'price' as SortField, label: 'Price' },
                  { key: 'stock' as SortField, label: 'Stock' },
                ].map(({ key, label }) => (
                  <th
                    key={key}
                    className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort(key)}
                  >
                    <div className="flex items-center gap-1">
                      {label}
                      <ArrowUpDown className="w-3.5 h-3.5" />
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => {
                const stock = p.stock ?? 999;
                return (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900 truncate max-w-[250px]">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.sku || 'No SKU'}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 capitalize">{p.category}</td>
                    <td className="px-4 py-3 text-gray-900 font-medium">{formatCurrency(p.price)}</td>
                    <td className="px-4 py-3">
                      {editingId === p.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={editStock}
                            onChange={(e) => setEditStock(parseInt(e.target.value) || 0)}
                            className="w-20 h-8 px-2 border rounded text-sm"
                            min={0}
                          />
                          <button onClick={() => handleSaveStock(p.id)} className="p-1 text-green-600 hover:bg-green-50 rounded">
                            <Save className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditingId(null)} className="p-1 text-gray-400 hover:bg-gray-100 rounded">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="font-medium">{stock}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {stock === 0 ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                          Out of Stock
                        </span>
                      ) : stock <= 5 ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">
                          <AlertTriangle className="w-3 h-3" /> Low ({stock})
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => { setEditingId(p.id); setEditStock(p.stock ?? 0); }}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                        title="Edit stock"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
