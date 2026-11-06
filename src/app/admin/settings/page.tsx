'use client';

import React, { useEffect, useState } from 'react';
import AdminNav from '@/components/admin/AdminNav';
import { store } from '@/lib/supabase/store';
import { RestaurantSettings } from '@/types';
import { Save, CheckCircle2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<RestaurantSettings>(store.getSettings());
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setSettings(store.getSettings());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateSettings(settings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="pb-4 border-b border-border">
          <h1 className="font-display text-3xl font-black text-foreground">
            Restaurant &amp; Store Configuration
          </h1>
          <p className="text-secondary text-xs font-mono mt-0.5">
            Configure brand name, tax rates, delivery fees, operational hours, and fulfillment flags.
          </p>
        </div>

        {isSaved && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings saved and updated across application!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-secondary block mb-1">
                Restaurant Brand Name
              </label>
              <input
                type="text"
                value={settings.restaurantName}
                onChange={(e) => setSettings({ ...settings, restaurantName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-cream-50 text-xs font-bold focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-secondary block mb-1">
                Brand Tagline
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-cream-50 text-xs focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-secondary block mb-1">
              Store Address
            </label>
            <textarea
              rows={2}
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-border bg-cream-50 text-xs focus:outline-none focus:border-accent"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-secondary block mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-cream-50 text-xs font-mono focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-secondary block mb-1">
                Operating Hours
              </label>
              <input
                type="text"
                value={settings.openingHours}
                onChange={(e) => setSettings({ ...settings, openingHours: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-cream-50 text-xs focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-4 border-t border-border">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-secondary block mb-1">
                GST Tax Rate (%)
              </label>
              <input
                type="number"
                value={settings.taxPercentage}
                onChange={(e) => setSettings({ ...settings, taxPercentage: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl border border-border bg-cream-50 text-xs font-mono focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-secondary block mb-1">
                Delivery Fee (₹)
              </label>
              <input
                type="number"
                value={settings.deliveryFee}
                onChange={(e) => setSettings({ ...settings, deliveryFee: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl border border-border bg-cream-50 text-xs font-mono focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-secondary block mb-1">
                Minimum Order (₹)
              </label>
              <input
                type="number"
                value={settings.minimumOrder}
                onChange={(e) => setSettings({ ...settings, minimumOrder: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl border border-border bg-cream-50 text-xs font-mono focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-6 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.deliveryEnabled}
                  onChange={(e) => setSettings({ ...settings, deliveryEnabled: e.target.checked })}
                  className="accent-accent"
                />
                <span className="font-bold">Enable Delivery</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.pickupEnabled}
                  onChange={(e) => setSettings({ ...settings, pickupEnabled: e.target.checked })}
                  className="accent-accent"
                />
                <span className="font-bold">Enable Store Pickup</span>
              </label>
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-accent hover:bg-accent-hover text-white text-xs font-bold flex items-center gap-2 shadow-floating transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

