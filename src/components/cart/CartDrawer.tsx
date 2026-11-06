'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { formatINR } from '@/lib/pricing/calculator';
import { X, Plus, Minus, Trash2, ArrowRight, Tag, ShoppingBag } from 'lucide-react';

export default function CartDrawer() {
  const {
    items,
    deliveryType,
    setDeliveryType,
    couponCode,
    discountAmount,
    totals,
    itemCount,
    isCartOpen,
    toggleCart,
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
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => toggleCart(false)}
            className="absolute inset-0 bg-[#1A1915]/60 backdrop-blur-sm"
          />

          {/* Drawer Container */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-surface border-l border-border flex flex-col shadow-2xl"
            >
              
              {/* Drawer Header */}
              <div className="p-6 border-b border-border flex items-center justify-between bg-cream-50">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-accent" />
                  <h3 className="font-display font-black text-xl text-foreground">
                    Your Order ({itemCount})
                  </h3>
                </div>
                <button
                  onClick={() => toggleCart(false)}
                  className="p-2 rounded-full hover:bg-cream-200 text-secondary hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center text-3xl">
                      🥢
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-foreground">Your cart is empty</h4>
                      <p className="text-sm text-secondary mt-1">
                        Start building your custom bowl or choose from our signature menu.
                      </p>
                    </div>
                    <Link
                      href="/build"
                      onClick={() => toggleCart(false)}
                      className="px-6 py-2.5 rounded-full bg-accent text-white font-bold text-sm shadow-subtle hover:bg-accent-hover transition-colors"
                    >
                      Build a Bowl Now
                    </Link>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-cream-50 border border-border flex flex-col space-y-2 relative"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-sm text-foreground">{item.bowlName}</h4>
                          <span className="text-xs text-secondary font-mono">
                            Base: {item.summary.baseName}
                          </span>
                        </div>
                        <span className="font-mono font-bold text-sm text-foreground">
                          {formatINR(item.totalPrice)}
                        </span>
                      </div>

                      {/* Ingredients List Summary */}
                      {item.summary.ingredientNames.length > 0 && (
                        <p className="text-xs text-secondary leading-relaxed">
                          {item.summary.ingredientNames.join(' · ')}
                        </p>
                      )}

                      {/* Sauces Summary */}
                      {item.summary.sauceNames.length > 0 && (
                        <p className="text-xs font-semibold text-accent">
                          Drizzle: {item.summary.sauceNames.join(' & ')}
                        </p>
                      )}

                      {/* Quantity & Delete Controls */}
                      <div className="flex items-center justify-between pt-2 border-t border-border/60">
                        <div className="flex items-center gap-2 bg-surface border border-border rounded-lg px-2 py-0.5">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="text-secondary hover:text-foreground p-0.5"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold font-mono px-1">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="text-secondary hover:text-foreground p-0.5"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-secondary hover:text-red-500 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer with Calculations */}
              {items.length > 0 && (
                <div className="p-6 border-t border-border bg-cream-50 space-y-4">
                  
                  {/* Coupon Input */}
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-4 h-4 absolute left-3 top-3 text-secondary" />
                      <input
                        type="text"
                        placeholder="Coupon code (e.g. BOWLLAB50)"
                        value={inputCoupon}
                        onChange={(e) => {
                          setInputCoupon(e.target.value);
                          setCouponError('');
                        }}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-surface uppercase font-mono tracking-wider focus:outline-none focus:border-accent"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-foreground text-background rounded-xl text-xs font-bold hover:bg-black transition-colors"
                    >
                      Apply
                    </button>
                  </form>

                  {couponError && <p className="text-xs text-red-500">{couponError}</p>}

                  {couponCode && (
                    <div className="flex items-center justify-between text-xs bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-200">
                      <span>Coupon &quot;{couponCode}&quot; applied</span>
                      <button onClick={removeCoupon} className="font-bold underline text-emerald-900">
                        Remove
                      </button>
                    </div>
                  )}

                  {/* Calculations */}
                  <div className="space-y-1.5 text-xs text-secondary font-mono border-t border-border/80 pt-3">
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
                    <div className="flex justify-between text-base font-bold text-foreground font-sans pt-2 border-t border-border">
                      <span>Total</span>
                      <span className="font-display text-xl text-accent">
                        {formatINR(totals.total)}
                      </span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Link
                    href="/checkout"
                    onClick={() => toggleCart(false)}
                    className="w-full py-3.5 px-4 rounded-xl bg-accent hover:bg-accent-hover text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-floating transition-all"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <div className="text-center">
                    <Link
                      href="/cart"
                      onClick={() => toggleCart(false)}
                      className="text-xs text-secondary hover:text-foreground underline font-mono"
                    >
                      View full shopping cart page
                    </Link>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

