'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Badge, Skeleton, EmptyState, Button } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { getCollection, where, orderBy } from '@/lib/firebase';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import { Package, Eye, ChevronRight } from 'lucide-react';
import type { Order } from '@/types';
import type { QueryConstraint } from 'firebase/firestore';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return;
      try {
        const data = await getCollection('orders', [
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc'),
        ] as QueryConstraint[]);
        setOrders(data as unknown as Order[]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <EmptyState
          icon={<Package className="w-16 h-16" />}
          title="No Orders Yet"
          description="When you place an order, it will appear here."
          action={
            <Link href="/products">
              <Button>Start Shopping</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Order History</h2>
          <p className="text-sm text-gray-500">{orders.length} orders</p>
        </div>
        <div className="divide-y divide-gray-100">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-gray-900 text-sm">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </span>
                    <Badge
                      variant={
                        order.status === 'delivered'
                          ? 'success'
                          : order.status === 'cancelled'
                          ? 'danger'
                          : order.status === 'shipped'
                          ? 'info'
                          : 'warning'
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    Placed on {formatDate(order.createdAt)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {order.items.length} item{order.items.length > 1 ? 's' : ''} &middot;{' '}
                    {formatCurrency(order.total)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-900">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>
              {/* Order Items Preview */}
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {order.items.slice(0, 4).map((item, i) => (
                  <div
                    key={i}
                    className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 relative"
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-300" />
                      </div>
                    )}
                  </div>
                ))}
                {order.items.length > 4 && (
                  <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center text-sm text-gray-500 font-medium flex-shrink-0">
                    +{order.items.length - 4}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
