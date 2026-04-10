'use client';

import React from 'react';
import { CheckCircle, Clock, Package, Truck, Home, XCircle, RotateCcw } from 'lucide-react';
import type { OrderEvent, OrderStatus } from '@/types';

const STATUS_CONFIG: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  pending: { icon: Clock, color: 'text-yellow-500 bg-yellow-50 border-yellow-200', label: 'Order Placed' },
  confirmed: { icon: CheckCircle, color: 'text-blue-500 bg-blue-50 border-blue-200', label: 'Confirmed' },
  processing: { icon: Package, color: 'text-indigo-500 bg-indigo-50 border-indigo-200', label: 'Processing' },
  shipped: { icon: Truck, color: 'text-purple-500 bg-purple-50 border-purple-200', label: 'Shipped' },
  delivered: { icon: Home, color: 'text-green-500 bg-green-50 border-green-200', label: 'Delivered' },
  cancelled: { icon: XCircle, color: 'text-red-500 bg-red-50 border-red-200', label: 'Cancelled' },
  refunded: { icon: RotateCcw, color: 'text-gray-500 bg-gray-50 border-gray-200', label: 'Refunded' },
};

const STATUS_ORDER: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

interface OrderTimelineProps {
  currentStatus: OrderStatus;
  timeline?: OrderEvent[];
  trackingNumber?: string;
  trackingUrl?: string;
  courier?: string;
}

export default function OrderTimeline({ currentStatus, timeline, trackingNumber, trackingUrl, courier }: OrderTimelineProps) {
  const isCancelled = currentStatus === 'cancelled' || currentStatus === 'refunded';
  const currentIndex = STATUS_ORDER.indexOf(currentStatus);

  return (
    <div>
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {STATUS_ORDER.map((status, i) => {
          const isComplete = i <= currentIndex && !isCancelled;
          const isCurrent = status === currentStatus;
          const config = STATUS_CONFIG[status];
          const Icon = config.icon;

          return (
            <React.Fragment key={status}>
              <div className="flex flex-col items-center gap-1.5">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  isCurrent ? config.color + ' ring-4 ring-offset-2' :
                  isComplete ? 'bg-green-500 text-white border-green-500' :
                  'bg-gray-100 text-gray-400 border-gray-200'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-xs font-medium ${isCurrent ? 'text-gray-900' : isComplete ? 'text-green-600' : 'text-gray-400'}`}>
                  {config.label}
                </span>
              </div>
              {i < STATUS_ORDER.length - 1 && (
                <div className={`flex-1 h-1 mx-2 rounded-full ${i < currentIndex && !isCancelled ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Cancelled State */}
      {isCancelled && (
        <div className={`flex items-center gap-3 p-4 rounded-xl border ${STATUS_CONFIG[currentStatus].color}`}>
          {React.createElement(STATUS_CONFIG[currentStatus].icon, { className: 'w-5 h-5' })}
          <span className="font-medium">{STATUS_CONFIG[currentStatus].label}</span>
        </div>
      )}

      {/* Tracking Info */}
      {trackingNumber && (
        <div className="bg-primary-50 rounded-xl p-4 mb-4 border border-primary-100">
          <div className="flex items-center gap-2 text-sm">
            <Truck className="w-4 h-4 text-primary-600" />
            <span className="font-medium text-primary-900">
              {courier && `${courier} · `}Tracking: {trackingNumber}
            </span>
            {trackingUrl && (
              <a href={trackingUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline ml-auto">
                Track Shipment →
              </a>
            )}
          </div>
        </div>
      )}

      {/* Timeline Events */}
      {timeline && timeline.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Order Timeline</h4>
          <div className="space-y-3">
            {timeline.map((event, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-2.5 h-2.5 rounded-full ${i === 0 ? 'bg-primary-600' : 'bg-gray-300'}`} />
                  {i < timeline.length - 1 && <div className="w-px h-full bg-gray-200 my-1" />}
                </div>
                <div className="pb-4">
                  <p className="text-sm font-medium text-gray-900 capitalize">{event.status}</p>
                  {event.note && <p className="text-xs text-gray-500 mt-0.5">{event.note}</p>}
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(event.timestamp).toLocaleString('en-ZA')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
