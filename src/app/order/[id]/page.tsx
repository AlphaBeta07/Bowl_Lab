'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { store } from '@/lib/supabase/store';
import { Order } from '@/types';
import { formatINR } from '@/lib/pricing/calculator';
import { CheckCircle2, Clock, MapPin, Phone, ArrowRight, Sparkles, ChefHat, Truck } from 'lucide-react';

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!orderId) return;

    // Fetch order from store
    const found = store.getOrderById(orderId);
    if (found) {
      setOrder(found);
    }

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F15A35', '#6E8B61', '#F2DCA5', '#24786D'],
      });
    } catch {}
  }, [orderId]);

  if (!order) {
    return (
      <div className="min-h-screen bg-background py-16 px-4 flex items-center justify-center">
        <div className="bg-surface border border-border rounded-3xl p-8 text-center max-w-md shadow-card">
          <h2 className="font-display font-black text-2xl text-foreground">Order Not Found</h2>
          <p className="text-secondary text-sm mt-2 mb-6">
            We couldn&apos;t locate order #{orderId}. It may have been placed in another session.
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

  const steps = [
    { key: 'received', label: 'Order Placed', desc: 'Received by kitchen' },
    { key: 'preparing', label: 'Prepping', desc: 'Fresh ingredients assembling' },
    { key: 'ready', label: order.deliveryType === 'delivery' ? 'Out for Delivery' : 'Ready for Pickup', desc: 'Packed fresh & sealed' },
    { key: 'completed', label: 'Delivered', desc: 'Enjoy your fresh bowl' },
  ];

  const getStepStatus = (stepKey: string) => {
    const orderIndex = steps.findIndex(s => s.key === order.orderStatus);
    const thisIndex = steps.findIndex(s => s.key === stepKey);
    if (thisIndex < orderIndex) return 'completed';
    if (thisIndex === orderIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Success Header Pill */}
        <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-card text-center relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-xs font-mono font-bold uppercase tracking-widest text-accent bg-accent/10 px-3 py-1 rounded-full">
            Order Confirmed · {order.orderNumber}
          </span>

          <h1 className="font-display font-black text-3xl sm:text-4xl text-foreground mt-3">
            Your Bowl is Being Crafted!
          </h1>

          <p className="text-secondary text-sm sm:text-base max-w-lg mx-auto mt-2 leading-relaxed">
            Thank you, <strong className="text-foreground">{order.customerName}</strong>. Our chefs have received your ticket and are lifting the lid to prep your custom ingredients.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-secondary">
            <span className="flex items-center gap-1.5 bg-cream-100 px-3 py-1.5 rounded-full">
              <Clock className="w-4 h-4 text-accent" />
              <span>Est. Time: 15–25 mins</span>
            </span>
            <span className="flex items-center gap-1.5 bg-cream-100 px-3 py-1.5 rounded-full">
              <span>💳 Payment: </span>
              <strong className="text-foreground uppercase">{order.paymentMethod.replace(/_/g, ' ')}</strong>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                order.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {order.paymentStatus.toUpperCase()}
              </span>
            </span>
          </div>
        </div>

        {/* Live Kitchen Progress Stepper */}
        <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="font-display font-bold text-xl text-foreground flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-accent" />
              <span>Kitchen Status Tracker</span>
            </h2>
            <span className="text-xs font-mono text-accent font-bold animate-pulse">
              ● Live Kitchen Feed
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {steps.map((st, i) => {
              const status = getStepStatus(st.key);
              return (
                <div
                  key={st.key}
                  className={`p-4 rounded-2xl border transition-all ${
                    status === 'completed'
                      ? 'bg-emerald-50/60 border-emerald-300'
                      : status === 'current'
                      ? 'bg-accent/10 border-accent ring-2 ring-accent/20'
                      : 'bg-cream-50 border-border opacity-60'
                  }`}
                >
                  <div className="text-xs font-mono font-bold text-secondary mb-1">
                    0{i + 1}
                  </div>
                  <h4 className="font-bold text-sm text-foreground">{st.label}</h4>
                  <p className="text-[11px] text-secondary mt-1 leading-tight">{st.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Details & Ticket Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left: Items Summary (7 cols) */}
          <div className="md:col-span-7 bg-surface border border-border rounded-3xl p-6 shadow-subtle space-y-4">
            <h3 className="font-display font-bold text-lg text-foreground border-b border-border pb-3">
              Crafted Items
            </h3>

            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-cream-50 border border-border space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-sm text-foreground">
                      {item.quantity}x {item.bowlName}
                    </h4>
                    <span className="font-mono font-bold text-sm text-foreground">
                      {formatINR(item.totalPrice)}
                    </span>
                  </div>

                  <p className="text-xs text-secondary font-mono">
                    Base: {item.summary.baseName}
                  </p>

                  {item.summary.ingredientNames.length > 0 && (
                    <p className="text-xs text-secondary leading-relaxed">
                      Ingredients: {item.summary.ingredientNames.join(' · ')}
                    </p>
                  )}

                  {item.summary.sauceNames.length > 0 && (
                    <p className="text-xs font-semibold text-accent">
                      Sauces: {item.summary.sauceNames.join(' & ')}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Pricing Breakdown */}
            <div className="pt-4 border-t border-border space-y-1.5 font-mono text-xs text-secondary">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatINR(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount</span>
                  <span>-{formatINR(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>{order.deliveryFee > 0 ? formatINR(order.deliveryFee) : 'Free'}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span>{formatINR(order.tax)}</span>
              </div>
              <div className="flex justify-between text-base font-bold font-sans text-foreground pt-3 border-t border-border">
                <span>Total Due</span>
                <span className="font-display text-2xl text-accent">
                  {formatINR(order.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Fulfillment & Next Steps (5 cols) */}
          <div className="md:col-span-5 space-y-6">
            
            <div className="bg-surface border border-border rounded-3xl p-6 shadow-subtle space-y-3">
              <h3 className="font-display font-bold text-base text-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent" />
                <span>Fulfillment Address</span>
              </h3>
              <p className="text-xs text-secondary leading-relaxed">
                {order.deliveryAddress}
              </p>
              {order.deliveryInstructions && (
                <p className="text-xs italic text-secondary border-t border-border/80 pt-2">
                  Note: {order.deliveryInstructions}
                </p>
              )}
              <div className="pt-2 flex items-center gap-2 text-xs font-mono text-secondary">
                <Phone className="w-3.5 h-3.5" />
                <span>{order.phone}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href="/build"
                className="w-full py-3.5 px-4 rounded-2xl bg-accent hover:bg-accent-hover text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-floating transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Build Another Custom Bowl</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/account/orders"
                className="w-full py-3 px-4 rounded-2xl bg-surface hover:bg-cream-100 border border-border text-foreground font-semibold text-xs tracking-wide flex items-center justify-center gap-2 transition-all"
              >
                <span>View All My Orders</span>
              </Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

