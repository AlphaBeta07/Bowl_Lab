'use client';

import React, { useEffect, useState } from 'react';
import AdminNav from '@/components/admin/AdminNav';
import { store } from '@/lib/supabase/store';
import { Order, OrderStatus, PaymentStatus } from '@/types';
import { formatINR } from '@/lib/pricing/calculator';
import { CheckCircle2, Clock, Check, ChevronRight } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>('all');

  const load = () => {
    setOrders(store.getOrders());
  };

  useEffect(() => {
    load();
  }, []);

  const handleUpdateStatus = (orderId: string, status: OrderStatus) => {
    store.updateOrderStatus(orderId, status);
    load();
  };

  const handleUpdatePayment = (orderId: string, status: PaymentStatus) => {
    store.updatePaymentStatus(orderId, status);
    load();
  };

  const statuses: OrderStatus[] = [
    'received',
    'preparing',
    'ready',
    'out_for_delivery',
    'completed',
    'cancelled',
  ];

  const filtered = orders.filter((o) => {
    if (filter === 'active') return o.orderStatus !== 'completed' && o.orderStatus !== 'cancelled';
    if (filter === 'pending_payment') return o.paymentStatus === 'pending';
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header & Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-4">
          <div>
            <h1 className="font-display text-3xl font-black text-foreground">
              Kitchen Orders Management
            </h1>
            <p className="text-secondary text-xs font-mono mt-0.5">
              Update prep stages, mark payments as received, and monitor kitchen cadence.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {['all', 'active', 'pending_payment'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all capitalize ${
                  filter === f
                    ? 'bg-foreground text-background'
                    : 'bg-surface border border-border text-secondary hover:text-foreground'
                }`}
              >
                {f.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Card Stack */}
        <div className="space-y-4">
          {filtered.map((ord) => (
            <div
              key={ord.id}
              className="bg-surface border border-border rounded-3xl p-6 shadow-subtle flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
            >
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono font-black text-sm text-foreground bg-cream-100 px-3 py-1 rounded-full border border-border">
                    {ord.orderNumber}
                  </span>
                  <span className="text-xs font-bold text-foreground">
                    {ord.customerName} ({ord.phone})
                  </span>
                  <span className="text-xs font-mono text-secondary">
                    {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cream-200 text-foreground capitalize">
                    {ord.deliveryType}
                  </span>
                </div>

                {/* Items & Customizations */}
                <div className="space-y-1.5 pl-2 border-l-2 border-accent/40 text-xs">
                  {ord.items.map((item, i) => (
                    <div key={i}>
                      <span className="font-bold text-foreground">
                        {item.quantity}x {item.bowlName}
                      </span>{' '}
                      — <span className="text-secondary font-mono">{item.summary.baseName}</span>
                      {item.summary.ingredientNames.length > 0 && (
                        <p className="text-secondary text-[11px]">
                          + {item.summary.ingredientNames.join(', ')}
                        </p>
                      )}
                      {item.summary.sauceNames.length > 0 && (
                        <p className="text-accent text-[11px] font-semibold">
                          Drizzle: {item.summary.sauceNames.join(' & ')}
                        </p>
                      )}
                    </div>
                  ))}
                  {ord.deliveryAddress && (
                    <p className="text-secondary text-[11px] pt-1">
                      <strong>Address:</strong> {ord.deliveryAddress}
                    </p>
                  )}
                </div>

                {/* Payment Status Pill */}
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span>Method: <strong className="uppercase">{ord.paymentMethod.replace(/_/g, ' ')}</strong></span>
                  <span>•</span>
                  <span>
                    Payment:{' '}
                    <span className={`px-2 py-0.5 rounded font-bold ${
                      ord.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {ord.paymentStatus.toUpperCase()}
                    </span>
                  </span>
                </div>
              </div>

              {/* Action Buttons for Kitchen Status & Payment */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3 w-full lg:w-auto border-t lg:border-t-0 pt-4 lg:pt-0 border-border">
                
                <span className="font-display font-black text-2xl text-foreground">
                  {formatINR(ord.total)}
                </span>

                {/* Order Status Select */}
                <div className="flex items-center gap-2">
                  <label className="text-[11px] font-bold text-secondary uppercase">
                    Stage:
                  </label>
                  <select
                    value={ord.orderStatus}
                    onChange={(e) => handleUpdateStatus(ord.id, e.target.value as OrderStatus)}
                    className="text-xs font-bold rounded-xl border border-border bg-cream-50 px-3 py-1.5 focus:outline-none focus:border-accent capitalize"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mark as Paid Toggle */}
                {ord.paymentStatus === 'pending' ? (
                  <button
                    onClick={() => handleUpdatePayment(ord.id, 'paid')}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Mark Cash / Counter Paid</span>
                  </button>
                ) : (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Payment Verified</span>
                  </span>
                )}

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

