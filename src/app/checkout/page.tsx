'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button, Input, Select } from '@/components/ui';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/context/AuthContext';
import { addDocument, getDocument } from '@/lib/firebase';
import { formatCurrency, PROVINCES } from '@/lib/utils';
import type { PaymentSettings } from '@/types';
import {
  ShoppingBag,
  MapPin,
  CreditCard,
  Check,
  ChevronRight,
  ArrowLeft,
  Shield,
  Lock,
  Banknote,
  Truck,
  Loader2,
  Tag,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import CheckoutUpsells from '@/components/CheckoutUpsells';

type Step = 'shipping' | 'payment' | 'review';

interface PaymentOption {
  value: string;
  label: string;
  desc: string;
  icon: React.ElementType;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, getSubtotal, clearCart } = useCartStore();
  const [step, setStep] = useState<Step>('shipping');
  const [loading, setLoading] = useState(false);
  const [paymentConfig, setPaymentConfig] = useState<PaymentSettings | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(true);
  const payfastFormRef = useRef<HTMLFormElement>(null);

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

  const [paymentMethod, setPaymentMethod] = useState('');

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    couponId: string;
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    discount: number;
  } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  // Fetch enabled payment methods
  useEffect(() => {
    async function loadPaymentConfig() {
      try {
        const data = await getDocument('settings', 'payment');
        if (data) {
          setPaymentConfig(data as unknown as PaymentSettings);
        }
      } catch (err) {
        console.error('Failed to load payment config:', err);
      } finally {
        setPaymentLoading(false);
      }
    }
    loadPaymentConfig();
  }, []);

  // Build available payment options based on config
  const availablePaymentMethods: PaymentOption[] = [];
  if (paymentConfig?.payfast?.enabled) {
    availablePaymentMethods.push({
      value: 'payfast',
      label: 'PayFast',
      desc: 'Credit/debit cards, instant EFT, SnapScan, Mobicred',
      icon: CreditCard,
    });
  }
  if (paymentConfig?.payflex?.enabled) {
    availablePaymentMethods.push({
      value: 'payflex',
      label: 'PayFlex',
      desc: 'Buy now, pay later — 4 interest-free instalments',
      icon: Banknote,
    });
  }
  if (paymentConfig?.eft?.enabled) {
    availablePaymentMethods.push({
      value: 'eft',
      label: 'EFT / Bank Transfer',
      desc: 'Manual bank transfer — order processed after proof of payment',
      icon: Banknote,
    });
  }
  if (paymentConfig?.cod?.enabled) {
    availablePaymentMethods.push({
      value: 'cod',
      label: 'Cash on Delivery',
      desc: paymentConfig.cod.surcharge
        ? `Pay on delivery (+${formatCurrency(paymentConfig.cod.surcharge)} surcharge)`
        : 'Pay when you receive your order',
      icon: Truck,
    });
  }

  // Set default payment method when config loads
  useEffect(() => {
    if (availablePaymentMethods.length > 0 && !paymentMethod) {
      setPaymentMethod(availablePaymentMethods[0].value);
    }
  }, [paymentConfig]); // eslint-disable-line react-hooks/exhaustive-deps

  const subtotal = getSubtotal();
  const shipping = subtotal >= 2500 ? 0 : 199;
  const couponDiscount = appliedCoupon?.discount || 0;
  const tax = (subtotal - couponDiscount) * 0.15;
  const total = subtotal - couponDiscount + shipping + tax;

  const steps: { key: Step; label: string; icon: React.ElementType }[] = [
    { key: 'shipping', label: 'Shipping', icon: MapPin },
    { key: 'payment', label: 'Payment', icon: CreditCard },
    { key: 'review', label: 'Review', icon: Check },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === step);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode.trim(), subtotal }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Invalid coupon');
        return;
      }
      setAppliedCoupon(data);
      toast.success(`Coupon "${data.code}" applied! You save ${formatCurrency(data.discount)}`);
    } catch {
      toast.error('Failed to validate coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

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

  const codSurcharge = paymentMethod === 'cod' && paymentConfig?.cod?.surcharge ? paymentConfig.cod.surcharge : 0;
  const orderTotal = total + codSurcharge;

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
        userEmail: user.email || null,
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
        ...(couponDiscount > 0 ? { couponDiscount, couponCode: appliedCoupon?.code } : {}),
        ...(codSurcharge > 0 ? { codSurcharge } : {}),
        total: orderTotal,
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
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDocument('orders', order);
      const orderId = docRef.id;

      // Notify admin of new order (fire-and-forget)
      fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'new-order',
          data: {
            orderId,
            customerEmail: user.email || '',
            total: formatCurrency(orderTotal),
            paymentMethod,
          },
        }),
      }).catch(() => {});

      // Handle payment based on method
      if (paymentMethod === 'payfast') {
        await handlePayFastPayment(orderId);
        return; // Don't clear cart here — wait for redirect
      } else if (paymentMethod === 'payflex') {
        await handlePayFlexPayment(orderId);
        return;
      } else {
        // EFT or COD — order is placed directly
        clearCart();
        toast.success('Order placed successfully!');
        router.push('/account/orders');
      }
    } catch {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayFastPayment = async (orderId: string) => {
    try {
      const itemNames = items.map((i) => i.name).join(', ');
      const res = await fetch('/api/payments/payfast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          amount: orderTotal.toFixed(2),
          itemName: itemNames.length > 100 ? `Order #${orderId}` : itemNames,
          firstName: shippingAddress.firstName,
          lastName: shippingAddress.lastName,
          email: user?.email || '',
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Payment initiation failed');
      }

      const { actionUrl, formData } = await res.json();

      // Create a hidden form and submit to PayFast
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = actionUrl;
      Object.entries(formData).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value as string;
        form.appendChild(input);
      });
      document.body.appendChild(form);
      clearCart();
      form.submit();
    } catch (error) {
      console.error('PayFast error:', error);
      toast.error('Failed to initiate PayFast payment. Your order has been saved.');
      router.push('/account/orders');
    }
  };

  const handlePayFlexPayment = async (orderId: string) => {
    try {
      const res = await fetch('/api/payments/payflex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          amount: orderTotal.toFixed(2),
          consumer: {
            firstName: shippingAddress.firstName,
            lastName: shippingAddress.lastName,
            email: user?.email || '',
            phone: shippingAddress.phone,
          },
          items: items.map((i) => ({
            name: i.name,
            quantity: i.quantity,
            price: i.price,
          })),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'PayFlex initiation failed');
      }

      const { redirectUrl } = await res.json();
      if (redirectUrl) {
        clearCart();
        window.location.href = redirectUrl;
      } else {
        throw new Error('No redirect URL received');
      }
    } catch (error) {
      console.error('PayFlex error:', error);
      toast.error('Failed to initiate PayFlex payment. Your order has been saved.');
      router.push('/account/orders');
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
                      name="given-name"
                      autoComplete="given-name"
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
                      name="family-name"
                      autoComplete="family-name"
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
                    name="address-line1"
                    autoComplete="address-line1"
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
                    name="address-line2"
                    autoComplete="address-line2"
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
                      name="address-level2"
                      autoComplete="address-level2"
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
                      name="address-level1"
                      autoComplete="address-level1"
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
                      name="postal-code"
                      autoComplete="postal-code"
                      inputMode="numeric"
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
                    name="tel"
                    autoComplete="tel"
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
                  {paymentLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                      <span className="ml-2 text-sm text-gray-500">Loading payment options...</span>
                    </div>
                  ) : availablePaymentMethods.length === 0 ? (
                    <div className="text-center py-8">
                      <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No payment methods are currently available.</p>
                      <p className="text-sm text-gray-400">Please contact the store for assistance.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {availablePaymentMethods.map((method) => {
                        const Icon = method.icon;
                        return (
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
                            <Icon className={`w-5 h-5 ${
                              paymentMethod === method.value ? 'text-primary-600' : 'text-gray-400'
                            }`} />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">
                                {method.label}
                              </p>
                              <p className="text-sm text-gray-500">{method.desc}</p>
                            </div>
                            {method.value === 'payflex' && (
                              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                                BNPL
                              </span>
                            )}
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {/* PayFlex instalment preview */}
                  {paymentMethod === 'payflex' && (
                    <div className="mt-4 p-4 bg-purple-50 rounded-xl border border-purple-100">
                      <p className="text-sm font-medium text-purple-800 mb-2">
                        Pay in 4 interest-free instalments
                      </p>
                      <div className="grid grid-cols-4 gap-2 text-center">
                        {[1, 2, 3, 4].map((n) => (
                          <div key={n} className="bg-white rounded-lg p-2 border border-purple-100">
                            <p className="text-[10px] text-purple-500 uppercase">
                              {n === 1 ? 'Today' : `Week ${n * 2}`}
                            </p>
                            <p className="text-sm font-semibold text-purple-800">
                              {formatCurrency(orderTotal / 4)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* EFT bank details preview */}
                  {paymentMethod === 'eft' && paymentConfig?.eft && (
                    <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-100">
                      <p className="text-sm font-medium text-green-800 mb-2">
                        Bank Transfer Details
                      </p>
                      <p className="text-sm text-green-700">
                        After placing your order, transfer the total amount to the following account.
                        Your order will be processed once payment is confirmed.
                      </p>
                      {paymentConfig.eft.bankName && (
                        <div className="mt-3 space-y-1 text-sm text-green-800">
                          <p><span className="font-medium">Bank:</span> {paymentConfig.eft.bankName}</p>
                          <p><span className="font-medium">Account:</span> {paymentConfig.eft.accountName}</p>
                          <p><span className="font-medium">Account #:</span> {paymentConfig.eft.accountNumber}</p>
                          <p><span className="font-medium">Branch:</span> {paymentConfig.eft.branchCode}</p>
                          <p><span className="font-medium">Reference:</span> {paymentConfig.eft.reference}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* COD notice */}
                  {paymentMethod === 'cod' && (
                    <div className="mt-4 p-4 bg-orange-50 rounded-xl border border-orange-100">
                      <p className="text-sm text-orange-700">
                        Pay with cash or card when your order is delivered.
                        {codSurcharge > 0 && (
                          <span className="font-medium"> A surcharge of {formatCurrency(codSurcharge)} applies.</span>
                        )}
                        {paymentConfig?.cod?.maxOrderAmount && orderTotal > paymentConfig.cod.maxOrderAmount && (
                          <span className="block mt-1 text-red-600 font-medium">
                            Note: COD is only available for orders up to {formatCurrency(paymentConfig.cod.maxOrderAmount)}.
                          </span>
                        )}
                      </p>
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
                    <Button type="submit" size="lg" disabled={!paymentMethod || availablePaymentMethods.length === 0}>
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
                    {paymentMethod === 'payfast'
                      ? 'PayFast (Cards, EFT, SnapScan)'
                      : paymentMethod === 'payflex'
                      ? 'PayFlex (Buy Now Pay Later)'
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
                    {paymentMethod === 'payfast' || paymentMethod === 'payflex'
                      ? `Pay ${formatCurrency(orderTotal)}`
                      : `Place Order - ${formatCurrency(orderTotal)}`}
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

              {/* Coupon Input */}
              <div className="mb-4 pb-4 border-b border-gray-100">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-green-600" />
                      <div>
                        <span className="text-sm font-medium text-green-700">{appliedCoupon.code}</span>
                        <span className="text-xs text-green-600 block">
                          {appliedCoupon.discountType === 'percentage'
                            ? `${appliedCoupon.discountValue}% off`
                            : `${formatCurrency(appliedCoupon.discountValue)} off`}
                        </span>
                      </div>
                    </div>
                    <button onClick={handleRemoveCoupon} className="text-green-600 hover:text-green-800">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Coupon code"
                      className="flex-1 h-9 px-3 rounded-lg border border-gray-300 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-primary-500"
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                    />
                    <Button size="sm" variant="outline" onClick={handleApplyCoupon} loading={couponLoading}>
                      Apply
                    </Button>
                  </div>
                )}
              </div>

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
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon Discount</span>
                    <span className="font-medium">-{formatCurrency(couponDiscount)}</span>
                  </div>
                )}
                {codSurcharge > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">COD Surcharge</span>
                    <span className="font-medium">{formatCurrency(codSurcharge)}</span>
                  </div>
                )}
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-gray-900">
                    {formatCurrency(orderTotal)}
                  </span>
                </div>
              </div>
            </div>
            <CheckoutUpsells />
          </div>
        </div>
      </div>
    </div>
  );
}
