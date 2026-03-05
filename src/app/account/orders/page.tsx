'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Badge, Skeleton, EmptyState, Button } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { getCollection, where } from '@/lib/firebase';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import {
  Package,
  ChevronDown,
  ChevronUp,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  CreditCard,
  RotateCcw,
} from 'lucide-react';
import type { Order } from '@/types';
import type { QueryConstraint } from 'firebase/firestore';

const STATUS_STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

function getStepIcon(step: string, isActive: boolean, isComplete: boolean) {
  const cls = `w-5 h-5 ${isComplete ? 'text-green-500' : isActive ? 'text-primary-600' : 'text-gray-300'}`;
  switch (step) {
    case 'pending': return <Clock className={cls} />;
    case 'confirmed': return <CheckCircle className={cls} />;
    case 'processing': return <Package className={cls} />;
    case 'shipped': return <Truck className={cls} />;
    case 'delivered': return <CheckCircle className={cls} />;
    default: return <Clock className={cls} />;
  }
}

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return;
      try {
        const data = await getCollection('orders', [
          where('userId', '==', user.uid),
        ] as QueryConstraint[]);
        const sorted = (data as unknown as Order[]).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setOrders(sorted);
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
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <Skeleton className="h-6 w-1/3 mb-4" />
            <Skeleton className="h-4 w-2/3 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
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
          action={<Link href="/products"><Button>Start Shopping</Button></Link>}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-gray-900">Order History</h2>
        <p className="text-sm text-gray-500">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
      </div>

      {orders.map((order) => {
        const isExpanded = expandedOrder === order.id;
        const currentStepIndex = STATUS_STEPS.indexOf(order.status);
        const isCancelled = order.status === 'cancelled' || order.status === 'refunded';

        return (
          <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Order Header */}
            <button
              onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <span className="font-semibold text-gray-900">
                    Order #{order.id.slice(-8).toUpperCase()}
                  </span>
                  <Badge variant={order.status === 'delivered' ? 'success' : order.status === 'cancelled' ? 'danger' : order.status === 'shipped' ? 'info' : 'warning'}>
                    {order.status}
                  </Badge>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {formatDate(order.createdAt)} · {order.items.length} item{order.items.length !== 1 ? 's' : ''} · {formatCurrency(order.total)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-gray-900 hidden sm:block">{formatCurrency(order.total)}</span>
                {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </div>
            </button>

            {/* Items Preview (always visible) */}
            {!isExpanded && (
              <div className="px-6 pb-4 flex gap-2 overflow-x-auto">
                {order.items.slice(0, 4).map((item, i) => (
                  <div key={i} className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><Package className="w-5 h-5 text-gray-300" /></div>
                    )}
                  </div>
                ))}
                {order.items.length > 4 && (
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-medium flex-shrink-0">
                    +{order.items.length - 4}
                  </div>
                )}
              </div>
            )}

            {/* Expanded Details */}
            {isExpanded && (
              <div className="border-t border-gray-100 p-6 space-y-6">
                {/* Order Progress */}
                {!isCancelled && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-4">Order Progress</h4>
                    <div className="flex items-center">
                      {STATUS_STEPS.map((step, idx) => {
                        const isComplete = idx < currentStepIndex;
                        const isActive = idx === currentStepIndex;
                        return (
                          <React.Fragment key={step}>
                            <div className="flex flex-col items-center">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                isComplete ? 'bg-green-100' : isActive ? 'bg-primary-100' : 'bg-gray-100'
                              }`}>
                                {getStepIcon(step, isActive, isComplete)}
                              </div>
                              <span className={`text-xs mt-1 capitalize hidden sm:block ${
                                isActive ? 'font-medium text-primary-600' : isComplete ? 'text-green-600' : 'text-gray-400'
                              }`}>
                                {step}
                              </span>
                            </div>
                            {idx < STATUS_STEPS.length - 1 && (
                              <div className={`flex-1 h-0.5 mx-1 ${isComplete ? 'bg-green-400' : 'bg-gray-200'}`} />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                )}

                {isCancelled && (
                  <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl">
                    {order.status === 'refunded' ? <RotateCcw className="w-5 h-5 text-red-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
                    <span className="text-sm font-medium text-red-700 capitalize">Order {order.status}</span>
                  </div>
                )}

                {/* Tracking Number */}
                {order.trackingNumber && (
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                    <Truck className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Tracking Number</p>
                      <p className="text-sm text-blue-700 font-mono">{order.trackingNumber}</p>
                    </div>
                  </div>
                )}

                {/* Items */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Items</h4>
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center"><Package className="w-5 h-5 text-gray-300" /></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Address & Payment */}
                <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-gray-900 mb-1">Shipping Address</p>
                      <p className="text-gray-500">
                        {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}<br />
                        {order.shippingAddress?.street}<br />
                        {order.shippingAddress?.city}, {order.shippingAddress?.province} {order.shippingAddress?.postalCode}
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <CreditCard className="w-5 h-5 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900 capitalize">{order.paymentMethod}</span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
                      <div className="flex justify-between text-gray-500"><span>Shipping</span><span>{formatCurrency(order.shipping)}</span></div>
                      <div className="flex justify-between text-gray-500"><span>Tax</span><span>{formatCurrency(order.tax)}</span></div>
                      <div className="flex justify-between font-bold text-gray-900 pt-1 border-t"><span>Total</span><span>{formatCurrency(order.total)}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
