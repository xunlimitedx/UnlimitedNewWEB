'use client';

import React, { useState, useEffect } from 'react';
import { getCollection, where, orderBy } from '@/lib/firebase';
import { formatCurrency } from '@/lib/utils';
import {
  DollarSign, ShoppingBag, Users, TrendingUp,
  Package, AlertTriangle, ArrowUp, ArrowDown,
} from 'lucide-react';
import type { Order, Product } from '@/types';
import type { QueryConstraint } from 'firebase/firestore';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const COLORS = ['#2563eb', '#7c3aed', '#059669', '#d97706', '#dc2626', '#6366f1', '#0891b2', '#be185d'];

export default function AdminDashboardCharts() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getCollection('orders', [orderBy('createdAt', 'desc')] as QueryConstraint[]),
      getCollection('products', []),
    ]).then(([o, p]) => {
      setOrders(o as unknown as Order[]);
      setProducts(p as unknown as Product[]);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  // Calculate metrics
  const totalRevenue = orders.filter((o) => o.paymentStatus === 'paid').reduce((s, o) => s + o.total, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const lowStockProducts = products.filter((p) => (p.stock ?? 999) > 0 && (p.stock ?? 999) <= 5);
  const outOfStock = products.filter((p) => (p.stock ?? 0) === 0);

  // Revenue by month (last 6 months)
  const revenueByMonth = React.useMemo(() => {
    const months: Record<string, number> = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months[`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`] = 0;
    }
    orders.forEach((o) => {
      if (o.paymentStatus !== 'paid') return;
      const key = o.createdAt.substring(0, 7);
      if (key in months) months[key] += o.total;
    });
    return Object.entries(months).map(([month, revenue]) => ({
      month: new Date(month + '-01').toLocaleDateString('en-ZA', { month: 'short' }),
      revenue: Math.round(revenue),
    }));
  }, [orders]);

  // Orders by status
  const ordersByStatus = React.useMemo(() => {
    const counts: Record<string, number> = {};
    orders.forEach((o) => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [orders]);

  // Products by category
  const productsByCategory = React.useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      const cat = p.category || 'Uncategorized';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [products]);

  // Top-selling products
  const topProducts = React.useMemo(() => {
    const sales: Record<string, { name: string; revenue: number; qty: number }> = {};
    orders.forEach((o) => {
      if (o.paymentStatus !== 'paid') return;
      o.items.forEach((item) => {
        if (!sales[item.productId]) {
          sales[item.productId] = { name: item.name, revenue: 0, qty: 0 };
        }
        sales[item.productId].revenue += item.price * item.quantity;
        sales[item.productId].qty += item.quantity;
      });
    });
    return Object.values(sales).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  }, [orders]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-gray-200 rounded-xl" />
          ))}
        </div>
        <div className="h-72 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard icon={DollarSign} label="Total Revenue" value={formatCurrency(totalRevenue)} color="blue" />
        <KPICard icon={ShoppingBag} label="Total Orders" value={String(totalOrders)} color="purple" />
        <KPICard icon={TrendingUp} label="Avg. Order Value" value={formatCurrency(avgOrderValue)} color="green" />
        <KPICard icon={Package} label="Products" value={String(products.length)} subValue={`${outOfStock.length} out of stock`} color="orange" />
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <h3 className="font-semibold text-yellow-800">Low Stock Alert ({lowStockProducts.length} products)</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStockProducts.slice(0, 5).map((p) => (
              <span key={p.id} className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                {p.name.substring(0, 30)} ({p.stock} left)
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl border p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Revenue (Last 6 Months)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `R${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders by Status */}
        <div className="bg-white rounded-xl border p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Orders by Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={ordersByStatus}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                label={({ name, value }) => `${name} (${value})`}
              >
                {ordersByStatus.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Products by Category */}
        <div className="bg-white rounded-xl border p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Products by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={productsByCategory} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#7c3aed" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white rounded-xl border p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Top Selling Products</h3>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-400 w-6">#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.qty} sold</p>
                </div>
                <span className="text-sm font-semibold text-gray-900">{formatCurrency(p.revenue)}</span>
              </div>
            ))}
            {topProducts.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No sales data yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ icon: Icon, label, value, subValue, color }: {
  icon: React.ElementType; label: string; value: string; subValue?: string;
  color: 'blue' | 'purple' | 'green' | 'orange';
}) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="bg-white rounded-xl border p-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-lg font-bold text-gray-900">{value}</p>
          {subValue && <p className="text-[10px] text-gray-400">{subValue}</p>}
        </div>
      </div>
    </div>
  );
}
