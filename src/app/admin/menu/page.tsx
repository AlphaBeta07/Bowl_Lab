'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import AdminNav from '@/components/admin/AdminNav';
import { store } from '@/lib/supabase/store';
import { PredefinedBowl } from '@/types';
import { formatINR } from '@/lib/pricing/calculator';
import { Edit2, Check, BookOpen } from 'lucide-react';

export default function AdminMenuPage() {
  const [bowls, setBowls] = useState<PredefinedBowl[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);

  const load = () => {
    setBowls(store.getBowls());
  };

  useEffect(() => {
    load();
  }, []);

  const handleToggleAvailable = (id: string) => {
    const updated = bowls.map((b) =>
      b.id === id ? { ...b, isAvailable: !b.isAvailable } : b
    );
    store.setBowls(updated);
    setBowls(updated);
  };

  const handleSavePrice = (id: string) => {
    const updated = bowls.map((b) =>
      b.id === id ? { ...b, basePrice: Number(editPrice) } : b
    );
    store.setBowls(updated);
    setBowls(updated);
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-4">
          <div>
            <h1 className="font-display text-3xl font-black text-foreground">
              Signature Menu Management
            </h1>
            <p className="text-secondary text-xs font-mono mt-0.5">
              Manage pre-built chef recipes, menu pricing, and popular spotlights.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bowls.map((bowl) => (
            <div
              key={bowl.id}
              className={`bg-surface border rounded-3xl p-6 shadow-subtle flex flex-col justify-between transition-all ${
                bowl.isAvailable ? 'border-border' : 'border-red-200 bg-red-50/20 opacity-70'
              }`}
            >
              <div>
                <div className="relative w-full h-44 bg-cream-50 rounded-2xl flex items-center justify-center mb-4 overflow-hidden">
                  <Image
                    src={bowl.imageUrl}
                    alt={bowl.name}
                    width={180}
                    height={180}
                    className="object-contain"
                  />
                  {bowl.isPopular && (
                    <span className="absolute top-3 left-3 bg-accent text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                      Spotlight
                    </span>
                  )}
                </div>

                <h3 className="font-display font-black text-xl text-foreground">{bowl.name}</h3>
                <p className="text-xs text-secondary mt-1 line-clamp-2 leading-relaxed">
                  {bowl.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <div>
                  {editingId === bowl.id ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono">₹</span>
                      <input
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(Number(e.target.value))}
                        className="w-20 px-2 py-1 text-xs border border-accent rounded font-mono"
                      />
                      <button
                        onClick={() => handleSavePrice(bowl.id)}
                        className="p-1 bg-accent text-white rounded"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <span className="font-display font-black text-xl text-foreground">
                        {formatINR(bowl.basePrice)}
                      </span>
                      <button
                        onClick={() => {
                          setEditingId(bowl.id);
                          setEditPrice(bowl.basePrice);
                        }}
                        className="text-secondary hover:text-accent p-1"
                        title="Edit price"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleToggleAvailable(bowl.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    bowl.isAvailable
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                      : 'bg-red-50 text-red-800 border border-red-300'
                  }`}
                >
                  {bowl.isAvailable ? 'Active' : 'Disabled'}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

