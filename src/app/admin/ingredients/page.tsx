'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import AdminNav from '@/components/admin/AdminNav';
import { store } from '@/lib/supabase/store';
import { Ingredient, IngredientCategory } from '@/types';
import { formatINR } from '@/lib/pricing/calculator';
import { Plus, Edit2, Check, X, Carrot } from 'lucide-react';

export default function AdminIngredientsPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);

  const load = () => {
    setIngredients(store.getIngredients());
  };

  useEffect(() => {
    load();
  }, []);

  const handleToggleAvailable = (id: string) => {
    const updated = ingredients.map((item) =>
      item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
    );
    store.setIngredients(updated);
    setIngredients(updated);
  };

  const handleSavePrice = (id: string) => {
    const updated = ingredients.map((item) =>
      item.id === id ? { ...item, price: Number(editPrice) } : item
    );
    store.setIngredients(updated);
    setIngredients(updated);
    setEditingId(null);
  };

  const filtered = ingredients.filter((i) =>
    selectedCat === 'all' ? true : i.category === selectedCat
  );

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-4">
          <div>
            <h1 className="font-display text-3xl font-black text-foreground">
              Ingredient Catalog Manager
            </h1>
            <p className="text-secondary text-xs font-mono mt-0.5">
              Control live pricing, stock availability, and allergen tags for builder components.
            </p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {['all', 'bases', 'proteins', 'vegetables', 'toppings', 'sauces'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all capitalize whitespace-nowrap ${
                  selectedCat === cat
                    ? 'bg-foreground text-background'
                    : 'bg-surface border border-border text-secondary hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Table / Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`bg-surface border rounded-3xl p-5 shadow-subtle flex flex-col justify-between transition-all ${
                item.isAvailable ? 'border-border' : 'border-red-200 bg-red-50/20 opacity-70'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="relative w-14 h-14 bg-cream-50 rounded-2xl flex items-center justify-center p-2">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>

                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cream-100 text-secondary">
                    {item.category}
                  </span>
                </div>

                <h3 className="font-bold text-base text-foreground">{item.name}</h3>
                <p className="text-xs text-secondary mt-1 leading-relaxed line-clamp-2">
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-1 mt-2.5">
                  {item.dietaryTags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] font-bold text-brand-green bg-green-50 px-2 py-0.5 rounded border border-green-200"
                    >
                      {t}
                    </span>
                  ))}
                  {item.allergens.map((a, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] font-mono text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price & Stock Availability Actions */}
              <div className="mt-5 pt-3 border-t border-border flex items-center justify-between">
                <div>
                  {editingId === item.id ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono">₹</span>
                      <input
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(Number(e.target.value))}
                        className="w-16 px-1.5 py-1 text-xs border border-accent rounded font-mono"
                      />
                      <button
                        onClick={() => handleSavePrice(item.id)}
                        className="p-1 bg-accent text-white rounded"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <span className="font-display font-black text-lg text-foreground">
                        {formatINR(item.price)}
                      </span>
                      <button
                        onClick={() => {
                          setEditingId(item.id);
                          setEditPrice(item.price);
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
                  onClick={() => handleToggleAvailable(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    item.isAvailable
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                      : 'bg-red-50 text-red-800 border border-red-300 hover:bg-red-100'
                  }`}
                >
                  {item.isAvailable ? 'In Stock' : 'Out of Stock'}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

