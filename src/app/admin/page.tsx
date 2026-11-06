'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminNav from '@/components/admin/AdminNav';
import { store } from '@/lib/supabase/store';
import { Order } from '@/types';
import { formatINR } from '@/lib/pricing/calculator';
import { ShoppingBag, TrendingUp, Clock, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AdminOverviewPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders(store.getOrders());
  }, []);

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((acc, o) => acc + o.total, 0);

  const pendingOrders = orders.filter((o) => o.orderStatus !== 'completed' && o.orderStatus !== 'cancelled');
  const completedOrders = orders.filter((o) => o.orderStatus === 'completed');
  const pendingPayments = orders.filter((o) => o.paymentStatus === 'pending');

  const stats = [
    { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'text-foreground' },
    { label: 'Collected Revenue', value: formatINR(totalRevenue), icon: TrendingUp, color: 'text-emerald-600' },
    { label: 'Active in Kitchen', value: pendingOrders.length, icon: Clock, color: 'text-accent' },
    { label: 'Pending COD / Counter', value: pendingPayments.length, icon: ShieldCheck, color: 'text-amber-600' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-4">
          <div>
            <span className="text-xs uppercase font-mono tracking-widest font-bold text-accent">
              Kitchen &amp; Operations Center
            </span>
            <h1 className="font-display text-3xl font-black text-foreground mt-0.5">
              Admin Overview
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/orders"
              className="px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold shadow-floating flex items-center gap-1.5"
            >
              <span>Manage Live Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-surface border border-border rounded-3xl p-6 shadow-subtle flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-secondary">
                    {s.label}
                  </p>
                  <p className={`font-display font-black text-3xl mt-1 ${s.color}`}>
                    {s.value}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-cream-100 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-foreground" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Orders Table */}
        <div className="bg-surface border border-border rounded-3xl p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h3 className="font-display font-bold text-lg text-foreground">
              Recent Kitchen Tickets
            </h3>
            <Link
              href="/admin/orders"
              className="text-xs font-mono font-bold text-accent hover:underline"
            >
              View all orders →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-secondary font-mono uppercase tracking-wider">
                  <th className="py-3 px-3">Ticket #</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Payment</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Total</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {orders.slice(0, 5).map((ord) => (
                  <tr key={ord.id} className="hover:bg-cream-50 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-foreground">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3 px-3 font-medium text-foreground">
                      {ord.customerName}
                    </td>
                    <td className="py-3 px-3 capitalize font-mono text-secondary">
                      {ord.deliveryType}
                    </td>
                    <td className="py-3 px-3 font-mono">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ord.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ord.paymentStatus.toUpperCase()} ({ord.paymentMethod.replace(/_/g, ' ')})
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-accent capitalize">
                        {ord.orderStatus.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-foreground">
                      {formatINR(ord.total)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href={`/order/${ord.orderNumber}`}
                        className="text-xs font-bold text-accent hover:underline"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

