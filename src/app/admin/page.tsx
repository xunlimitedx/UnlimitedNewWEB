'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, Skeleton } from '@/components/ui';
import { getCollection, getCollectionCount } from '@/lib/firebase';
import { orderBy, limit, where } from 'firebase/firestore';
import { formatCurrency } from '@/lib/utils';
import {
  Package,
  ShoppingBag,
  Users,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  AlertCircle,
} from 'lucide-react';
import DashboardCharts from '@/components/admin/DashboardCharts';

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  recentOrders: any[];
  lowStockProducts: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Use server-side count aggregations instead of pulling every document.
        // Pulling 5,917 products into the browser used to time out and show 0 —
        // count() is one billable read per query.
        const [
          totalProducts,
          totalOrders,
          totalCustomers,
          recentOrders,
          lowStockProducts,
        ] = await Promise.all([
          getCollectionCount('products').catch(() => 0),
          getCollectionCount('orders').catch(() => 0),
          getCollectionCount('users').catch(() => 0),
          getCollection('orders', [orderBy('createdAt', 'desc'), limit(5)]).catch(() => []),
          getCollection('products', [where('stock', '<', 10), limit(5)]).catch(() => []),
        ]);

        const totalRevenue = (recentOrders as any[]).reduce(
          (sum: number, o: any) => sum + (o.total || 0),
          0
        );

        setStats({
          totalProducts,
          totalOrders,
          totalRevenue,
          totalCustomers,
          recentOrders: recentOrders as any[],
          lowStockProducts: lowStockProducts as any[],
        });
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: Package,
      color: 'bg-blue-500',
      link: '/admin/products',
    },
    {
      label: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingBag,
      color: 'bg-green-500',
      link: '/admin/orders',
    },
    {
      label: 'Revenue',
      value: formatCurrency(stats?.totalRevenue || 0),
      icon: DollarSign,
      color: 'bg-purple-500',
      link: '/admin/orders',
    },
    {
      label: 'Customers',
      value: stats?.totalCustomers || 0,
      icon: Users,
      color: 'bg-orange-500',
      link: '/admin/customers',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <Link key={i} href={stat.link}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Recent Orders</h3>
            <Link
              href="/admin/orders"
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <CardContent className="p-0">
            {stats?.recentOrders.length === 0 ? (
              <p className="p-6 text-gray-500 text-sm text-center">
                No orders yet
              </p>
            ) : (
              <div className="divide-y divide-gray-100">
                {stats?.recentOrders.map((order: any) => (
                  <div
                    key={order.id}
                    className="px-6 py-3 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        #{order.id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.items?.length || 0} items
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {formatCurrency(order.total || 0)}
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          order.status === 'delivered'
                            ? 'bg-green-100 text-green-700'
                            : order.status === 'shipped'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {order.status || 'pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-500" />
              Low Stock Items
            </h3>
            <Link
              href="/admin/products"
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              Manage <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <CardContent className="p-0">
            {stats?.lowStockProducts.length === 0 ? (
              <p className="p-6 text-gray-500 text-sm text-center">
                All products are well stocked
              </p>
            ) : (
              <div className="divide-y divide-gray-100">
                {stats?.lowStockProducts.map((product: any) => (
                  <div
                    key={product.id}
                    className="px-6 py-3 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden">
                        {product.images?.[0] && (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {product.name}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-orange-600">
                      {product.stock} left
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dashboard Charts */}
      <DashboardCharts />
    </div>
  );
}
