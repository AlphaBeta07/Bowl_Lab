'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { PREDEFINED_BOWLS } from '@/config/catalog';
import { PredefinedBowl } from '@/types';
import { formatINR } from '@/lib/pricing/calculator';
import { Sparkles, SlidersHorizontal, ShoppingBag, ArrowRight } from 'lucide-react';

export default function MenuPage() {
  const { addPredefinedBowlToCart } = useCart();
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filters = [
    { id: 'all', label: 'All Bowls' },
    { id: 'popular', label: 'Chef Favorites' },
    { id: 'high-protein', label: 'High Protein' },
    { id: 'vegan', label: 'Vegan' },
  ];

  const filteredBowls = PREDEFINED_BOWLS.filter((b) => {
    if (activeFilter === 'popular') return b.isPopular;
    if (activeFilter === 'high-protein') return b.dietaryTags.some((t) => t.toLowerCase().includes('protein'));
    if (activeFilter === 'vegan') return b.dietaryTags.some((t) => t.toLowerCase().includes('vegan'));
    return true;
  });

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase font-mono tracking-widest font-bold text-accent bg-accent/10 px-3 py-1 rounded-full">
            Artisan Signature Recipes
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-foreground tracking-tight">
            Chef-Crafted Bowls
          </h1>
          <p className="text-secondary text-sm sm:text-base leading-relaxed">
            Balanced macro nutrition, seasonal ingredients, and signature marinades. Enjoy as-is or customize in our 2D interactive lab.
          </p>

          <div className="pt-2">
            <Link
              href="/build"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent hover:bg-accent-hover text-white text-xs sm:text-sm font-bold shadow-floating transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Prefer to build your own from scratch? Click here</span>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeFilter === f.id
                  ? 'bg-foreground text-background shadow-md'
                  : 'bg-surface border border-border text-secondary hover:text-foreground hover:bg-cream-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Grid of Bowls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBowls.map((bowl) => (
            <div
              key={bowl.id}
              className="bg-surface border border-border rounded-3xl p-6 shadow-subtle hover:shadow-card transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Visual Image */}
                <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-cream-50 flex items-center justify-center mb-5 group-hover:scale-102 transition-transform">
                  <Image
                    src={bowl.imageUrl}
                    alt={bowl.name}
                    width={220}
                    height={220}
                    className="object-contain drop-shadow-lg transition-transform duration-300 group-hover:scale-105"
                  />
                  {bowl.isPopular && (
                    <span className="absolute top-3 left-3 bg-accent text-white text-[10px] uppercase tracking-wider font-black px-2.5 py-1 rounded-full shadow-sm">
                      Popular Pick
                    </span>
                  )}
                  <span className="absolute bottom-3 right-3 bg-surface/90 backdrop-blur-sm border border-border text-foreground font-mono text-xs font-bold px-2.5 py-1 rounded-full">
                    {bowl.calories} kcal
                  </span>
                </div>

                {/* Dietary Tags */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {bowl.dietaryTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-bold text-brand-green bg-green-50 px-2 py-0.5 rounded-md border border-green-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Title & Description */}
                <h3 className="font-display font-black text-2xl text-foreground group-hover:text-accent transition-colors">
                  {bowl.name}
                </h3>
                <p className="text-xs text-secondary leading-relaxed mt-2 line-clamp-3">
                  {bowl.description}
                </p>

                {/* Allergens warning */}
                {bowl.allergens.length > 0 && (
                  <p className="text-[11px] text-[#A8A49A] mt-2 font-mono">
                    Contains: {bowl.allergens.join(', ')}
                  </p>
                )}
              </div>

              {/* Price & Actions */}
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between gap-3">
                <span className="font-display font-black text-2xl text-foreground">
                  {formatINR(bowl.basePrice)}
                </span>

                <div className="flex items-center gap-2">
                  {/* Customize in builder */}
                  <Link
                    href={`/build?bowl=${bowl.id}`}
                    className="p-2.5 rounded-xl border border-border hover:border-accent bg-cream-50 hover:bg-cream-100 text-secondary hover:text-foreground text-xs font-bold flex items-center gap-1 transition-all"
                    title="Open in interactive Bowl Builder to customize"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-accent" />
                    <span className="hidden sm:inline">Customize</span>
                  </Link>

                  {/* Direct Add to Cart */}
                  <button
                    onClick={() => addPredefinedBowlToCart(bowl)}
                    className="px-4 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold flex items-center gap-1.5 shadow-floating transition-all transform hover:scale-105 active:scale-95"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Order</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

