'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import AdminNav from '@/components/admin/AdminNav';
import { store } from '@/lib/supabase/store';
import { Ingredient, IngredientCategory } from '@/types';
import { formatINR } from '@/lib/pricing/calculator';
import { Plus, Edit2, Check, X, Sparkles, RefreshCw } from 'lucide-react';

export default function AdminIngredientsPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [editingItem, setEditingItem] = useState<Ingredient | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusNote, setStatusNote] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ingredients');
      if (res.ok) {
        const json = await res.json();
        if (json.ingredients && json.ingredients.length > 0) {
          setIngredients(json.ingredients);
          store.setIngredients(json.ingredients);
          setIsLoading(false);
          return;
        }
      }
    } catch {
      // Fallback
    }
    const local = store.getIngredients();
    setIngredients(local);
    setIsLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleToggleAvailable = async (item: Ingredient) => {
    const newStatus = !item.isAvailable;
    const updated = ingredients.map((i) =>
      i.id === item.id ? { ...i, isAvailable: newStatus } : i
    );
    setIngredients(updated);
    store.setIngredients(updated);

    try {
      await fetch('/api/ingredients', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, isAvailable: newStatus }),
      });
      setStatusNote(`Updated ${item.name} availability.`);
      setTimeout(() => setStatusNote(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const updated = ingredients.map((i) =>
      i.id === editingItem.id ? editingItem : i
    );
    setIngredients(updated);
    store.setIngredients(updated);

    try {
      await fetch('/api/ingredients', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem),
      });
      setStatusNote(`Saved changes for ${editingItem.name}.`);
      setTimeout(() => setStatusNote(null), 3000);
    } catch (err) {
      console.error(err);
    }

    setEditingItem(null);
  };

  const filtered = ingredients.filter((i) =>
    selectedCat === 'all' ? true : i.category === selectedCat
  );

  const proteinCount = ingredients.filter((i) => i.category === 'proteins').length;
  const veggieCount = ingredients.filter((i) => i.category === 'vegetables').length;
  const baseCount = ingredients.filter((i) => i.category === 'bases').length;

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header with Catalog Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-3xl font-black text-foreground">
                Ingredient Catalog Manager
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-accent/10 text-accent border border-accent/20">
                34 Builder Items
              </span>
            </div>
            <p className="text-secondary text-xs font-mono mt-1">
              Active Catalog: <strong className="text-foreground">{proteinCount} Proteins</strong> · <strong className="text-foreground">{veggieCount} Veggies</strong> · <strong className="text-foreground">{baseCount} Bases</strong>. Fully synced to Supabase database.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={load}
              className="p-2 rounded-xl border border-border bg-surface text-secondary hover:text-foreground transition-colors"
              title="Refresh from database"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

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
        </div>

        {statusNote && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600" />
            {statusNote}
          </div>
        )}

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`bg-surface border rounded-3xl p-5 shadow-subtle flex flex-col justify-between transition-all group ${
                item.isAvailable ? 'border-border' : 'border-red-200 bg-red-50/20 opacity-75'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="relative w-14 h-14 bg-cream-50 rounded-2xl flex items-center justify-center p-2 border border-border/50">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cream-100 text-secondary">
                      {item.category}
                    </span>
                    <button
                      onClick={() => setEditingItem({ ...item })}
                      className="p-1.5 text-secondary hover:text-accent rounded-lg hover:bg-cream-100 transition-colors"
                      title="Edit ingredient details"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
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
                  <span className="font-display font-black text-lg text-foreground">
                    {formatINR(item.price)}
                  </span>
                  <span className="text-[10px] text-secondary font-mono block">per serving</span>
                </div>

                <button
                  onClick={() => handleToggleAvailable(item)}
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

      {/* Edit Ingredient Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-3xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h2 className="font-bold text-lg text-foreground">Edit Ingredient</h2>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1 rounded-full text-secondary hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  Ingredient Name
                </label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-xl text-sm font-semibold focus:outline-none focus:border-accent"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  Price (INR ₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={editingItem.price}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, price: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-border rounded-xl text-sm font-mono font-bold focus:outline-none focus:border-accent"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  Description
                </label>
                <textarea
                  value={editingItem.description}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-border rounded-xl text-xs leading-relaxed focus:outline-none focus:border-accent"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  Illustration URL / Asset Path
                </label>
                <input
                  type="text"
                  value={editingItem.imageUrl}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, imageUrl: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-border rounded-xl text-xs font-mono focus:outline-none focus:border-accent"
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="text-xs font-bold text-foreground flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.isAvailable}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, isAvailable: e.target.checked })
                    }
                    className="accent-accent w-4 h-4 rounded"
                  />
                  <span>Available in Bowl Builder</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-border text-secondary hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-accent text-white hover:bg-accent-hover shadow-md transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
