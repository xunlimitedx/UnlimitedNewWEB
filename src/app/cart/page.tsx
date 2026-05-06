'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { formatCurrency } from '@/lib/utils';
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Truck,
  Tag,
} from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, clearCart } = useCartStore();
  const subtotal = getSubtotal();
  const shipping = subtotal >= 2500 ? 0 : 199;
  const tax = subtotal * 0.15;
  const total = subtotal + shipping + tax;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center bg-gradient-to-b from-white via-slate-50 to-white">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl rounded-full" />
          <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-xl">
            <ShoppingBag className="w-12 h-12 text-white" />
          </div>
        </div>
        <span className="eyebrow-chip eyebrow-light mb-4">Your cart awaits</span>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 tracking-tight">Your cart is empty</h1>
        <p className="text-gray-500 mb-8 max-w-md">Looks like you haven&apos;t added anything yet. Browse our curated catalogue and discover something exceptional.</p>
        <Link href="/products" className="btn-premium">
          <ArrowLeft className="w-5 h-5" />
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <span className="eyebrow-chip eyebrow-light mb-3">Shopping cart</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Review your selections</h1>
            <p className="text-sm text-gray-500 mt-2">{itemCount} {itemCount === 1 ? 'item' : 'items'} · ready when you are</p>
          </div>
          <button
            onClick={clearCart}
            className="text-sm text-red-500 hover:text-red-600 font-medium self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-red-100 hover:border-red-200 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="group relative bg-white rounded-2xl p-5 sm:p-6 shadow-[0_2px_20px_-8px_rgba(15,23,42,0.08)] border border-slate-100 hover:border-slate-200 hover:shadow-[0_8px_30px_-10px_rgba(15,23,42,0.15)] transition-all duration-300 flex gap-4 sm:gap-6"
              >
                <Link
                  href={`/products/${item.productId}`}
                  className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden flex-shrink-0 ring-1 ring-slate-200/60"
                >
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="128px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8 text-gray-300" />
                    </div>
                  )}
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2">
                    <Link href={`/products/${item.productId}`} className="font-semibold text-gray-900 hover:text-primary-600 transition-colors line-clamp-2">{item.name}</Link>
                    <button onClick={() => removeItem(item.productId)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0" aria-label="Remove item">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 font-mono">SKU: {item.sku}</p>
                  <div className="flex items-end justify-between mt-4">
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-full overflow-hidden">
                      <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="p-2 hover:bg-white text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors" disabled={item.quantity <= 1} aria-label="Decrease quantity">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 font-semibold min-w-[2.5rem] text-center text-sm tabular-nums">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="p-2 hover:bg-white text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors" disabled={item.quantity >= item.stock} aria-label="Increase quantity">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900 tabular-nums">{formatCurrency(item.price * item.quantity)}</p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-gray-400 tabular-nums">{formatCurrency(item.price)} each</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Link href="/products" className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium mt-6 group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Continue Shopping
            </Link>
          </div>

          <div>
            <div className="bg-white rounded-2xl shadow-[0_2px_20px_-8px_rgba(15,23,42,0.08)] border border-slate-100 sticky top-24 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-6 py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 mb-1">Summary</p>
                <h2 className="text-lg font-semibold">Order Total</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                    <span className="font-semibold text-gray-900 tabular-nums">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 inline-flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" /> Shipping</span>
                    <span className="font-semibold tabular-nums">
                      {shipping === 0 ? (<span className="text-green-600">Free</span>) : (<span className="text-gray-900">{formatCurrency(shipping)}</span>)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">VAT (15%)</span>
                    <span className="font-semibold text-gray-900 tabular-nums">{formatCurrency(tax)}</span>
                  </div>
                  {shipping > 0 && (
                    <div className="flex items-start gap-2 text-xs text-blue-700 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-3">
                      <Tag className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>Add <strong>{formatCurrency(2500 - subtotal)}</strong> more for free shipping!</span>
                    </div>
                  )}
                  <div className="border-t border-dashed border-slate-200 pt-4 flex justify-between items-baseline">
                    <span className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Total</span>
                    <span className="text-2xl font-bold text-gray-900 tabular-nums">{formatCurrency(total)}</span>
                  </div>
                </div>
                <Link href="/checkout" className="btn-premium w-full justify-center">
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-400">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  Secure checkout · 256-bit SSL encryption
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
