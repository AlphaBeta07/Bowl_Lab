'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatINR } from '@/lib/pricing/calculator';
import { PaymentMethod } from '@/types';
import { ShieldCheck, Truck, Store, Banknote, ArrowRight, Loader2, Sparkles } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, deliveryType, setDeliveryType, couponCode, totals, clearCart } = useCart();
  const { user } = useAuth();

  const [customerName, setCustomerName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [address, setAddress] = useState('12th Main, 100ft Road, Indiranagar, Bengaluru');
  const [instructions, setInstructions] = useState('');
  
  // Default payment method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    deliveryType === 'pickup' ? 'pay_at_restaurant' : 'cod'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setErrorMessage('Your cart is empty');
      return;
    }

    if (!customerName || !email || !phone) {
      setErrorMessage('Please enter your complete contact details');
      return;
    }

    if (deliveryType === 'delivery' && !address.trim()) {
      setErrorMessage('Please enter a delivery address');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          email,
          phone,
          deliveryType,
          deliveryAddress: deliveryType === 'pickup' ? 'Store Pickup' : address,
          deliveryInstructions: instructions,
          paymentMethod,
          couponCode,
          items,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      // Order created successfully! Clear cart & redirect
      clearCart();
      router.push(`/order/${data.order.orderNumber}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong while placing your order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background py-16 px-4 flex items-center justify-center">
        <div className="bg-surface border border-border rounded-3xl p-8 text-center max-w-md shadow-card">
          <h2 className="font-display font-black text-2xl text-foreground">Cart is empty</h2>
          <p className="text-secondary text-sm mt-2 mb-6">
            Add a delicious custom bowl to your cart before proceeding to checkout.
          </p>
          <Link
            href="/build"
            className="px-6 py-3 rounded-full bg-accent text-white font-bold text-sm shadow-floating"
          >
            Go to Bowl Builder
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 border-b border-border pb-6">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-accent">
            Final Step
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-foreground mt-1">
            Checkout &amp; Confirmation
          </h1>
          <p className="text-secondary text-sm mt-0.5">
            Review delivery details and choose your verified payment method.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Customer Info & Payment (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Contact Information */}
            <div className="bg-surface border border-border rounded-3xl p-6 shadow-subtle space-y-4">
              <h2 className="font-display font-bold text-xl text-foreground flex items-center gap-2">
                <span>1.</span>
                <span>Contact Details</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-secondary uppercase tracking-wider block mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Anish Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-cream-50 text-foreground text-sm focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-secondary uppercase tracking-wider block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-cream-50 text-foreground text-sm focus:outline-none focus:border-accent font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-secondary uppercase tracking-wider block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="anish@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-cream-50 text-foreground text-sm focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            {/* 2. Fulfillment Method & Address */}
            <div className="bg-surface border border-border rounded-3xl p-6 shadow-subtle space-y-4">
              <h2 className="font-display font-bold text-xl text-foreground flex items-center gap-2">
                <span>2.</span>
                <span>Fulfillment &amp; Location</span>
              </h2>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setDeliveryType('delivery');
                    if (paymentMethod === 'pay_at_restaurant') {
                      setPaymentMethod('cod');
                    }
                  }}
                  className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    deliveryType === 'delivery'
                      ? 'border-accent bg-accent/10 text-accent ring-2 ring-accent/20'
                      : 'border-border bg-cream-50 text-secondary'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  <span>Home Delivery</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryType('pickup')}
                  className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    deliveryType === 'pickup'
                      ? 'border-accent bg-accent/10 text-accent ring-2 ring-accent/20'
                      : 'border-border bg-cream-50 text-secondary'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  <span>Store Pickup (Free)</span>
                </button>
              </div>

              {deliveryType === 'delivery' ? (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs font-bold text-secondary uppercase tracking-wider block mb-1">
                      Delivery Address
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Building, flat/house number, street, landmark, city & pincode"
                      className="w-full px-3.5 py-2 rounded-xl border border-border bg-cream-50 text-foreground text-sm focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-secondary uppercase tracking-wider block mb-1">
                      Delivery Instructions (Optional)
                    </label>
                    <input
                      type="text"
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      placeholder="e.g. Ring the doorbell, leave with guard"
                      className="w-full px-3.5 py-2 rounded-xl border border-border bg-cream-50 text-foreground text-sm focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-cream-100 border border-border text-xs space-y-1">
                  <p className="font-bold text-foreground">Pickup Location:</p>
                  <p className="text-secondary leading-relaxed">
                    BOWL LAB Kitchen — 12th Main, 100ft Road, Indiranagar, Bengaluru.
                  </p>
                  <p className="text-accent font-semibold pt-1">
                    ✓ Your bowl will be ready in 15 minutes!
                  </p>
                </div>
              )}
            </div>

            {/* 3. Payment Method (COD or Pay at Restaurant) */}
            <div className="bg-surface border border-border rounded-3xl p-6 shadow-subtle space-y-4">
              <h2 className="font-display font-bold text-xl text-foreground flex items-center gap-2">
                <span>3.</span>
                <span>Select Payment Method</span>
              </h2>

              <div className="space-y-3">
                
                {/* Cash on Delivery */}
                <label
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-accent bg-accent/5 ring-2 ring-accent/20'
                      : 'border-border bg-cream-50 hover:bg-surface'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1 accent-accent"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                      <Banknote className="w-4 h-4 text-accent" />
                      <span>Cash on Delivery (COD)</span>
                    </div>
                    <p className="text-xs text-secondary mt-0.5">
                      Pay in cash or via UPI QR code directly to the rider upon delivery.
                    </p>
                  </div>
                </label>

                {/* Pay at Restaurant (Only for Pickup) */}
                {deliveryType === 'pickup' && (
                  <label
                    className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'pay_at_restaurant'
                        ? 'border-accent bg-accent/5 ring-2 ring-accent/20'
                        : 'border-border bg-cream-50 hover:bg-surface'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="pay_at_restaurant"
                      checked={paymentMethod === 'pay_at_restaurant'}
                      onChange={() => setPaymentMethod('pay_at_restaurant')}
                      className="mt-1 accent-accent"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                        <Store className="w-4 h-4 text-brand-green" />
                        <span>Pay at Restaurant Counter</span>
                      </div>
                      <p className="text-xs text-secondary mt-0.5">
                        Pay at the pickup counter with card, cash, or UPI when collecting your order.
                      </p>
                    </div>
                  </label>
                )}

              </div>
            </div>

          </div>

          {/* Right: Order Summary Breakdown (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-surface border border-border rounded-3xl p-6 shadow-card space-y-4">
              <h3 className="font-display font-black text-xl text-foreground pb-3 border-b border-border">
                Your Bowl Summary
              </h3>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1 text-xs">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start py-1 border-b border-border/50">
                    <div>
                      <p className="font-bold text-foreground">
                        {item.quantity}x {item.bowlName}
                      </p>
                      <p className="text-secondary text-[11px] truncate max-w-[200px]">
                        {item.summary.baseName}
                        {item.summary.ingredientNames.length > 0 && ` · ${item.summary.ingredientNames.slice(0, 2).join(', ')}`}
                        {item.summary.toppingNames && item.summary.toppingNames.length > 0 && ` · ${item.summary.toppingNames.join(', ')}`}
                      </p>
                    </div>
                    <span className="font-mono font-semibold text-foreground">
                      {formatINR(item.totalPrice)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Calculations */}
              <div className="space-y-1.5 font-mono text-xs text-secondary border-t border-border pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-foreground">{formatINR(totals.subtotal)}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount</span>
                    <span>-{formatINR(totals.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery ({deliveryType})</span>
                  <span className="text-foreground">
                    {totals.deliveryFee > 0 ? formatINR(totals.deliveryFee) : 'Free'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>GST (5%)</span>
                  <span className="text-foreground">{formatINR(totals.tax)}</span>
                </div>
                <div className="flex justify-between text-base font-bold font-sans text-foreground pt-3 border-t border-border">
                  <span>Total Amount</span>
                  <span className="font-display text-2xl text-accent">
                    {formatINR(totals.total)}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-accent hover:bg-accent-hover text-white font-bold text-sm uppercase tracking-wide flex items-center justify-center gap-2 shadow-floating transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Placing Your Order...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Confirm &amp; Place Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-secondary font-mono flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-green" />
                  <span>Secure zero-risk cash &amp; counter payment</span>
                </span>
              </div>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}

