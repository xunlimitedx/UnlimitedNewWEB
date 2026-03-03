'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button, Input, Select } from '@/components/ui';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/context/AuthContext';
import { addDocument } from '@/lib/firebase';
import { formatCurrency, PROVINCES } from '@/lib/utils';
import {
  ShoppingBag,
  MapPin,
  CreditCard,
  Check,
  ChevronRight,
  ArrowLeft,
  Shield,
  Lock,
} from 'lucide-react';
import toast from 'react-hot-toast';

type Step = 'shipping' | 'payment' | 'review';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, getSubtotal, clearCart } = useCartStore();
  const [step, setStep] = useState<Step>('shipping');
  const [loading, setLoading] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    street: '',
    apartment: '',
    city: '',
    province: '',
    postalCode: '',
    phone: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('card');

  const subtotal = getSubtotal();
  const shipping = subtotal >= 2500 ? 0 : 199;
  const tax = subtotal * 0.15;
  const total = subtotal + shipping + tax;

  const steps: { key: Step; label: string; icon: React.ElementType }[] = [
    { key: 'shipping', label: 'Shipping', icon: MapPin },
    { key: 'payment', label: 'Payment', icon: CreditCard },
    { key: 'review', label: 'Review', icon: Check },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === step);

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !shippingAddress.firstName ||
      !shippingAddress.lastName ||
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.province ||
      !shippingAddress.postalCode ||
      !shippingAddress.phone
    ) {
      toast.error('Please fill in all required fields');
      return;
    }
    setStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('review');
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error('Please sign in to place an order');
      router.push('/auth/login');
      return;
    }

    setLoading(true);
    try {
      const order = {
        userId: user.uid,
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
          sku: item.sku,
        })),
        subtotal,
        shipping,
        tax,
        total,
        status: 'pending',
        paymentStatus: 'pending',
        paymentMethod,
        shippingAddress: {
          ...shippingAddress,
          country: 'South Africa',
        },
        billingAddress: {
          ...shippingAddress,
          country: 'South Africa',
        },
      };

      const docRef = await addDocument('orders', order);
      clearCart();
      toast.success('Order placed successfully!');
      router.push(`/account/orders`);
    } catch {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <ShoppingBag className="w-20 h-20 text-gray-200 mb-6" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Your Cart is Empty
        </h1>
        <p className="text-gray-500 mb-8">Add some products before checking out.</p>
        <Link href="/products">
          <Button size="lg">Browse Products</Button>
        </Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <Lock className="w-20 h-20 text-gray-200 mb-6" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Sign In Required
        </h1>
        <p className="text-gray-500 mb-8">Please sign in to proceed with checkout.</p>
        <Link href="/auth/login">
          <Button size="lg">Sign In</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            {steps.map((s, i) => (
              <React.Fragment key={s.key}>
                <div
                  className={`flex items-center gap-2 ${
                    i <= currentStepIndex
                      ? 'text-primary-600'
                      : 'text-gray-400'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      i < currentStepIndex
                        ? 'bg-primary-600 text-white'
                        : i === currentStepIndex
                        ? 'bg-primary-100 text-primary-600 ring-2 ring-primary-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {i < currentStepIndex ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span className="hidden sm:block text-sm font-medium">
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`w-12 sm:w-24 h-0.5 ${
                      i < currentStepIndex ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            {/* Shipping Step */}
            {step === 'shipping' && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary-600" />
                  Shipping Address
                </h2>
                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="First Name *"
                      placeholder="John"
                      value={shippingAddress.firstName}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          firstName: e.target.value,
                        })
                      }
                      required
                    />
                    <Input
                      label="Last Name *"
                      placeholder="Doe"
                      value={shippingAddress.lastName}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          lastName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <Input
                    label="Street Address *"
                    placeholder="123 Main Street"
                    value={shippingAddress.street}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        street: e.target.value,
                      })
                    }
                    required
                  />
                  <Input
                    label="Apartment / Suite (optional)"
                    placeholder="Apt 4B"
                    value={shippingAddress.apartment}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        apartment: e.target.value,
                      })
                    }
                  />
                  <div className="grid sm:grid-cols-3 gap-4">
                    <Input
                      label="City *"
                      placeholder="Johannesburg"
                      value={shippingAddress.city}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          city: e.target.value,
                        })
                      }
                      required
                    />
                    <Select
                      label="Province *"
                      value={shippingAddress.province}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          province: e.target.value,
                        })
                      }
                      options={[
                        { value: '', label: 'Select province' },
                        ...PROVINCES.map((p) => ({ value: p, label: p })),
                      ]}
                      required
                    />
                    <Input
                      label="Postal Code *"
                      placeholder="2000"
                      value={shippingAddress.postalCode}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          postalCode: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <Input
                    label="Phone Number *"
                    type="tel"
                    placeholder="082 000 0000"
                    value={shippingAddress.phone}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        phone: e.target.value,
                      })
                    }
                    required
                  />
                  <div className="flex justify-between pt-4">
                    <Link href="/cart">
                      <Button variant="ghost">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Cart
                      </Button>
                    </Link>
                    <Button type="submit" size="lg">
                      Continue to Payment
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Payment Step */}
            {step === 'payment' && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary-600" />
                  Payment Method
                </h2>
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div className="space-y-3">
                    {[
                      { value: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, etc.' },
                      { value: 'eft', label: 'EFT / Bank Transfer', desc: 'Direct bank payment' },
                      { value: 'cash', label: 'Cash on Delivery', desc: 'Pay when you receive' },
                    ].map((method) => (
                      <label
                        key={method.value}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          paymentMethod === method.value
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.value}
                          checked={paymentMethod === method.value}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            {method.label}
                          </p>
                          <p className="text-sm text-gray-500">{method.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-xl space-y-4">
                      <Input label="Card Number" placeholder="4242 4242 4242 4242" />
                      <div className="grid grid-cols-2 gap-4">
                        <Input label="Expiry Date" placeholder="MM/YY" />
                        <Input label="CVV" placeholder="123" />
                      </div>
                      <Input label="Name on Card" placeholder="John Doe" />
                    </div>
                  )}

                  <div className="flex justify-between pt-4">
                    <Button
                      variant="ghost"
                      type="button"
                      onClick={() => setStep('shipping')}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </Button>
                    <Button type="submit" size="lg">
                      Review Order
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Review Step */}
            {step === 'review' && (
              <div className="space-y-6">
                {/* Shipping Summary */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary-600" />
                      Shipping Address
                    </h3>
                    <button
                      onClick={() => setStep('shipping')}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">
                    {shippingAddress.firstName} {shippingAddress.lastName}
                    <br />
                    {shippingAddress.street}
                    {shippingAddress.apartment && `, ${shippingAddress.apartment}`}
                    <br />
                    {shippingAddress.city}, {shippingAddress.province},{' '}
                    {shippingAddress.postalCode}
                    <br />
                    {shippingAddress.phone}
                  </p>
                </div>

                {/* Payment Summary */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-primary-600" />
                      Payment Method
                    </h3>
                    <button
                      onClick={() => setStep('payment')}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 capitalize">
                    {paymentMethod === 'card'
                      ? 'Credit / Debit Card'
                      : paymentMethod === 'eft'
                      ? 'EFT / Bank Transfer'
                      : 'Cash on Delivery'}
                  </p>
                </div>

                {/* Items */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Order Items ({items.length})
                  </h3>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-center gap-4"
                      >
                        <div className="relative w-14 h-14 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                          {item.image && (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="ghost"
                    onClick={() => setStep('payment')}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                  <Button
                    size="lg"
                    onClick={handlePlaceOrder}
                    loading={loading}
                  >
                    <Shield className="w-5 h-5" />
                    Place Order - {formatCurrency(total)}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      formatCurrency(shipping)
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">VAT (15%)</span>
                  <span className="font-medium">{formatCurrency(tax)}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-gray-900">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
