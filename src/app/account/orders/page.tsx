'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { store } from '@/lib/supabase/store';
import { Order } from '@/types';
import { formatINR } from '@/lib/pricing/calculator';
import { Package, ArrowLeft, ArrowRight, Clock, MapPin, Sparkles } from 'lucide-react';

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const list = store.getOrders();
    setOrders(list);
  }, []);

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-border pb-6 flex items-baseline justify-between">
          <div>
            <Link
              href="/account"
              className="text-xs text-secondary hover:text-foreground font-semibold flex items-center gap-1 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Account</span>
            </Link>
            <h1 className="font-display text-3xl sm:text-4xl font-black text-foreground">
              Order History
            </h1>
            <p className="text-secondary text-sm mt-1">
              Live updates and historical records for all your custom bowl creations.
            </p>
          </div>

          <Link
            href="/build"
            className="px-5 py-2.5 rounded-full bg-accent hover:bg-accent-hover text-white text-xs font-bold shadow-floating flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Bowl</span>
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-surface border border-border rounded-3xl p-12 text-center max-w-md mx-auto shadow-card space-y-4">
            <Package className="w-12 h-12 text-secondary mx-auto" />
            <h3 className="font-display font-bold text-xl text-foreground">No orders placed yet</h3>
            <p className="text-secondary text-xs">
              Once you build and seal your first bowl, you can track its progress here.
            </p>
            <Link
              href="/build"
              className="inline-block px-6 py-2.5 rounded-full bg-accent text-white font-bold text-xs"
            >
              Build Your First Bowl
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-surface border border-border rounded-3xl p-6 shadow-subtle hover:shadow-card transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono font-black text-sm text-foreground bg-cream-100 px-3 py-1 rounded-full border border-border">
                      {ord.orderNumber}
                    </span>
                    <span className="text-xs text-secondary font-mono">
                      {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      ord.orderStatus === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : ord.orderStatus === 'ready' || ord.orderStatus === 'out_for_delivery'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800 animate-pulse'
                    }`}>
                      {ord.orderStatus.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="text-xs text-foreground font-medium">
                    {ord.items.map((i) => `${i.quantity}x ${i.bowlName}`).join(', ')}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-secondary font-mono">
                    <span>Payment: <strong className="text-foreground uppercase">{ord.paymentMethod.replace(/_/g, ' ')}</strong></span>
                    <span>Status: <strong className="uppercase text-accent">{ord.paymentStatus}</strong></span>
                    <span>Fulfillment: <strong className="capitalize text-foreground">{ord.deliveryType}</strong></span>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-border">
                  <span className="font-display font-black text-2xl text-foreground">
                    {formatINR(ord.total)}
                  </span>

                  <Link
                    href={`/order/${ord.orderNumber}`}
                    className="px-4 py-2 rounded-xl bg-cream-100 hover:bg-cream-200 border border-border text-foreground font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <span>View Ticket</span>
                    <ArrowRight className="w-3.5 h-3.5 text-accent" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

