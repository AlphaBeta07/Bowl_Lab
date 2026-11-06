'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatINR } from '@/lib/pricing/calculator';
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus, Tag, ShieldCheck } from 'lucide-react';

export default function CartPage() {
  const {
    items,
    deliveryType,
    setDeliveryType,
    couponCode,
    totals,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const res = applyCoupon(inputCoupon);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError('');
      setInputCoupon('');
    }
  };

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Page Title */}
        <div className="mb-8 border-b border-border pb-6 flex items-baseline justify-between">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-black text-foreground">
              Review Your Cart
            </h1>
            <p className="text-secondary text-sm mt-1">
              Freshly prepped to order. Check your custom creations below.
            </p>
          </div>
          <Link
            href="/build"
            className="text-accent hover:text-accent-hover font-bold text-sm flex items-center gap-1"
          >
            <span>+ Build Another Bowl</span>
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="bg-surface border border-border rounded-3xl p-12 text-center max-w-lg mx-auto shadow-card space-y-4">
            <div className="w-20 h-20 rounded-full bg-cream-100 mx-auto flex items-center justify-center text-4xl">
              🥢
            </div>
            <h2 className="font-display font-black text-2xl text-foreground">
              Your cart is waiting
            </h2>
            <p className="text-secondary text-sm leading-relaxed">
              No delicious bowls here yet. Start with our signature poke recipes or build your own from scratch!
            </p>
            <div className="pt-2 flex justify-center gap-4">
              <Link
                href="/build"
                className="px-6 py-3 rounded-full bg-accent text-white font-bold text-sm shadow-floating hover:bg-accent-hover transition-colors"
              >
                Start Bowl Builder
              </Link>
              <Link
                href="/menu"
                className="px-6 py-3 rounded-full bg-cream-100 hover:bg-cream-200 text-foreground font-bold text-sm transition-colors"
              >
                Browse Menu
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Items Column (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-surface border border-border rounded-2xl p-5 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🥢</span>
                      <h3 className="font-bold text-base text-foreground">{item.bowlName}</h3>
                      {item.isCustom && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                          Custom Crafted
                        </span>
                      )}
                    </div>
                    
                    <p className="text-xs text-secondary font-mono">
                      Base: <span className="font-semibold text-foreground">{item.summary.baseName}</span>
                    </p>

                    {item.summary.ingredientNames.length > 0 && (
                      <p className="text-xs text-secondary leading-relaxed">
                        Toppings: {item.summary.ingredientNames.join(' · ')}
                      </p>
                    )}

                    {item.summary.sauceNames.length > 0 && (
                      <p className="text-xs font-semibold text-accent">
                        Sauces: {item.summary.sauceNames.join(' & ')}
                      </p>
                    )}
                  </div>

                  {/* Quantity and Subtotal */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3">
                    <span className="font-display font-black text-lg text-foreground">
                      {formatINR(item.totalPrice)}
                    </span>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-cream-100 border border-border rounded-lg px-2 py-1">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="text-secondary hover:text-foreground"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold font-mono px-2">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="text-secondary hover:text-foreground"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-secondary hover:text-red-500 p-1.5 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Summary Column (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-surface border border-border rounded-3xl p-6 shadow-card space-y-5">
                <h3 className="font-display font-black text-xl text-foreground pb-3 border-b border-border">
                  Order Summary
                </h3>

                {/* Delivery Type Option */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-secondary block mb-2">
                    Fulfillment Method
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setDeliveryType('delivery')}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                        deliveryType === 'delivery'
                          ? 'border-accent bg-accent/10 text-accent ring-2 ring-accent/20'
                          : 'border-border bg-cream-50 text-secondary hover:text-foreground'
                      }`}
                    >
                      <span>🛵 Home Delivery</span>
                      <span className="font-mono font-normal">₹49 Standard</span>
                    </button>

                    <button
                      onClick={() => setDeliveryType('pickup')}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                        deliveryType === 'pickup'
                          ? 'border-accent bg-accent/10 text-accent ring-2 ring-accent/20'
                          : 'border-border bg-cream-50 text-secondary hover:text-foreground'
                      }`}
                    >
                      <span>🥡 Store Pickup</span>
                      <span className="font-mono font-normal">Free (Ready in 15m)</span>
                    </button>
                  </div>
                </div>

                {/* Coupon Code Input */}
                <form onSubmit={handleApplyCoupon} className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-secondary block">
                    Promo Code
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-4 h-4 absolute left-3 top-3 text-secondary" />
                      <input
                        type="text"
                        placeholder="Try BOWLLAB50"
                        value={inputCoupon}
                        onChange={(e) => {
                          setInputCoupon(e.target.value);
                          setCouponError('');
                        }}
                        className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-border bg-cream-50 uppercase font-mono tracking-wider focus:outline-none focus:border-accent"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-foreground text-background rounded-xl text-xs font-bold hover:bg-black transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-xs text-red-500 mt-1">{couponError}</p>}
                  {couponCode && (
                    <div className="flex items-center justify-between text-xs bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-200 mt-2">
                      <span>✓ Applied &quot;{couponCode}&quot;</span>
                      <button onClick={removeCoupon} className="font-bold underline text-emerald-900">
                        Remove
                      </button>
                    </div>
                  )}
                </form>

                {/* Price Breakdown */}
                <div className="space-y-2 font-mono text-xs text-secondary border-t border-border pt-4">
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
                    <span>Delivery Fee</span>
                    <span className="text-foreground">
                      {totals.deliveryFee > 0 ? formatINR(totals.deliveryFee) : 'Free'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (5%)</span>
                    <span className="text-foreground">{formatINR(totals.tax)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold font-sans text-foreground pt-3 border-t border-border">
                    <span>Grand Total</span>
                    <span className="font-display text-2xl text-accent">
                      {formatINR(totals.total)}
                    </span>
                  </div>
                </div>

                {/* Checkout Link */}
                <Link
                  href="/checkout"
                  className="w-full py-4 px-6 rounded-2xl bg-accent hover:bg-accent-hover text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-floating transition-all transform hover:scale-[1.01]"
                >
                  <span>Continue to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center justify-center gap-2 text-xs text-secondary font-mono pt-2">
                  <ShieldCheck className="w-4 h-4 text-brand-green" />
                  <span>Cash on Delivery &amp; Pay at Restaurant Accepted</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

