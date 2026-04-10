'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { getCollection, orderBy } from '@/lib/firebase';
import { formatCurrency } from '@/lib/utils';
import {
  DollarSign, TrendingUp, ShoppingBag, Calendar,
  Download, BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui';
import type { Order } from '@/types';
import type { QueryConstraint } from 'firebase/firestore';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

type Period = '7d' | '30d' | '90d' | '365d' | 'all';

export default function AdminSalesReportsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>('30d');

  useEffect(() => {
    getCollection('orders', [orderBy('createdAt', 'desc')] as QueryConstraint[])
      .then((data) => setOrders(data as unknown as Order[]))
      .finally(() => setLoading(false));
  }, []);

  const filteredOrders = useMemo(() => {
    if (period === 'all') return orders;
    const days = parseInt(period);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return orders.filter((o) => new Date(o.createdAt) >= cutoff);
  }, [orders, period]);

  const paidOrders = filteredOrders.filter((o) => o.paymentStatus === 'paid');
  const totalRevenue = paidOrders.reduce((s, o) => s + o.total, 0);
  const totalOrders = filteredOrders.length;
  const avgOrderValue = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;
  const totalItemsSold = paidOrders.reduce((s, o) => s + o.items.reduce((t, i) => t + i.quantity, 0), 0);

  // Daily revenue data
  const dailyRevenue = useMemo(() => {
    const days: Record<string, { revenue: number; orders: number }> = {};
    filteredOrders.forEach((o) => {
      const day = o.createdAt.substring(0, 10);
      if (!days[day]) days[day] = { revenue: 0, orders: 0 };
      if (o.paymentStatus === 'paid') days[day].revenue += o.total;
      days[day].orders += 1;
    });
    return Object.entries(days)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, data]) => ({
        date: new Date(date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' }),
        ...data,
      }));
  }, [filteredOrders]);

  // Revenue by payment method
  const revenueByPayment = useMemo(() => {
    const methods: Record<string, number> = {};
    paidOrders.forEach((o) => {
      const m = o.paymentMethod || 'unknown';
      methods[m] = (methods[m] || 0) + o.total;
    });
    return Object.entries(methods).map(([method, revenue]) => ({ method, revenue: Math.round(revenue) }));
  }, [paidOrders]);

  // Top categories
  const topCategories = useMemo(() => {
    const cats: Record<string, number> = {};
    paidOrders.forEach((o) => {
      o.items.forEach((item) => {
        // Use product name category heuristic
        cats['Sales'] = (cats['Sales'] || 0) + item.price * item.quantity;
      });
    });
    return Object.entries(cats).map(([name, revenue]) => ({ name, revenue }));
  }, [paidOrders]);

  const handleExportCSV = () => {
    const headers = ['Order ID', 'Date', 'Customer', 'Items', 'Total', 'Status', 'Payment'];
    const rows = filteredOrders.map((o) => [
      o.id,
      o.createdAt,
      `${o.shippingAddress?.firstName || ''} ${o.shippingAddress?.lastName || ''}`.trim(),
      o.items.length.toString(),
      o.total.toFixed(2),
      o.status,
      o.paymentMethod,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-report-${period}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="animate-pulse"><div className="h-96 bg-gray-200 rounded-xl" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Sales Reports</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {([
          { value: '7d', label: '7 Days' },
          { value: '30d', label: '30 Days' },
          { value: '90d', label: '90 Days' },
          { value: '365d', label: '1 Year' },
          { value: 'all', label: 'All Time' },
        ] as { value: Period; label: string }[]).map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setPeriod(value)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              period === value ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-gray-500">Revenue</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-2 mb-1">
            <ShoppingBag className="w-4 h-4 text-purple-600" />
            <span className="text-xs text-gray-500">Orders</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{totalOrders}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-xs text-gray-500">Avg. Order Value</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(avgOrderValue)}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-4 h-4 text-orange-600" />
            <span className="text-xs text-gray-500">Items Sold</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{totalItemsSold}</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl border p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Revenue Over Time</h3>
        {dailyRevenue.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `R${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center py-12">No data for this period</p>
        )}
      </div>

      {/* Revenue by Payment Method */}
      <div className="bg-white rounded-xl border p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Revenue by Payment Method</h3>
        {revenueByPayment.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueByPayment}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="method" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `R${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Revenue']} />
              <Bar dataKey="revenue" fill="#7c3aed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center py-8">No payment data</p>
        )}
      </div>
    </div>
  );
}
