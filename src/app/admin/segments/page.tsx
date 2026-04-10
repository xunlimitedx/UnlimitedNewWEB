'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { isAdmin, formatCurrency, formatDate } from '@/lib/utils';
import { getCollection } from '@/lib/firebase';
import { Users, TrendingUp, ShoppingBag, Crown, Clock, UserX, Star, Filter } from 'lucide-react';
import type { UserProfile, Order } from '@/types';

interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  customers: CustomerData[];
}

interface CustomerData {
  id: string;
  email: string;
  displayName: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder?: string;
  createdAt?: string;
}

export default function CustomerSegmentationPage() {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSegment, setActiveSegment] = useState<string>('all');

  useEffect(() => {
    if (!user || !isAdmin(user.email || '')) return;
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const [usersData, ordersData] = await Promise.all([
        getCollection('users'),
        getCollection('orders'),
      ]);

      const users = usersData as unknown as UserProfile[];
      const orders = ordersData as unknown as Order[];

      const customerMap = new Map<string, CustomerData>();

      for (const u of users) {
        customerMap.set(u.id, {
          id: u.id,
          email: u.email,
          displayName: u.displayName,
          totalOrders: 0,
          totalSpent: 0,
          createdAt: u.createdAt,
        });
      }

      for (const o of orders) {
        const existing = customerMap.get(o.userId);
        if (existing) {
          existing.totalOrders++;
          existing.totalSpent += o.total;
          if (!existing.lastOrder || new Date(o.createdAt) > new Date(existing.lastOrder)) {
            existing.lastOrder = o.createdAt;
          }
        }
      }

      setCustomers(Array.from(customerMap.values()));
    } catch {} finally {
      setLoading(false);
    }
  };

  const segments: CustomerSegment[] = useMemo(() => {
    const now = Date.now();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    const ninetyDays = 90 * 24 * 60 * 60 * 1000;

    return [
      {
        id: 'all',
        name: 'All Customers',
        description: 'Complete customer list',
        icon: Users,
        color: 'blue',
        customers,
      },
      {
        id: 'vip',
        name: 'VIP Customers',
        description: 'Customers who spent R5,000+',
        icon: Crown,
        color: 'yellow',
        customers: customers.filter((c) => c.totalSpent >= 5000),
      },
      {
        id: 'repeat',
        name: 'Repeat Buyers',
        description: 'Customers with 2+ orders',
        icon: TrendingUp,
        color: 'green',
        customers: customers.filter((c) => c.totalOrders >= 2),
      },
      {
        id: 'recent',
        name: 'Recent Customers',
        description: 'Purchased in last 30 days',
        icon: Clock,
        color: 'purple',
        customers: customers.filter((c) =>
          c.lastOrder && (now - new Date(c.lastOrder).getTime()) < thirtyDays
        ),
      },
      {
        id: 'at-risk',
        name: 'At Risk',
        description: 'No purchase in 90+ days',
        icon: UserX,
        color: 'red',
        customers: customers.filter((c) =>
          c.totalOrders > 0 && c.lastOrder &&
          (now - new Date(c.lastOrder).getTime()) > ninetyDays
        ),
      },
      {
        id: 'new',
        name: 'New Signups',
        description: 'No purchases yet',
        icon: Star,
        color: 'orange',
        customers: customers.filter((c) => c.totalOrders === 0),
      },
    ];
  }, [customers]);

  const currentSegment = segments.find((s) => s.id === activeSegment) || segments[0];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Customer Segments</h1>

      {/* Segment Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {segments.map((seg) => {
          const Icon = seg.icon;
          const isActive = activeSegment === seg.id;
          return (
            <button
              key={seg.id}
              onClick={() => setActiveSegment(seg.id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                isActive
                  ? 'border-primary-600 bg-primary-50 ring-1 ring-primary-200'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <Icon className={`w-5 h-5 mb-2 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
              <p className="text-xl font-bold text-gray-900">{seg.customers.length}</p>
              <p className="text-xs text-gray-500 mt-0.5">{seg.name}</p>
            </button>
          );
        })}
      </div>

      {/* Segment Details */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">{currentSegment.name}</h2>
          <p className="text-sm text-gray-500">{currentSegment.description}</p>
        </div>

        {currentSegment.customers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No customers in this segment</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Email</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500">Orders</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">Total Spent</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">Last Order</th>
                </tr>
              </thead>
              <tbody>
                {currentSegment.customers
                  .sort((a, b) => b.totalSpent - a.totalSpent)
                  .slice(0, 50)
                  .map((c) => (
                    <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{c.displayName || 'Unknown'}</td>
                      <td className="py-3 px-4 text-gray-600">{c.email}</td>
                      <td className="py-3 px-4 text-center text-gray-600">{c.totalOrders}</td>
                      <td className="py-3 px-4 text-right font-medium text-gray-900">{formatCurrency(c.totalSpent)}</td>
                      <td className="py-3 px-4 text-right text-gray-500 text-xs">
                        {c.lastOrder ? formatDate(c.lastOrder) : '—'}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
