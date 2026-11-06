'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PREDEFINED_BOWLS } from '@/config/catalog';
import { useCart } from '@/context/CartContext';
import { formatINR } from '@/lib/pricing/calculator';
import { ShoppingBag, SlidersHorizontal, ArrowRight } from 'lucide-react';

export default function PopularBowls() {
  const { addPredefinedBowlToCart } = useCart();
  const populars = PREDEFINED_BOWLS.slice(0, 3);

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase font-mono tracking-widest font-bold text-accent">
              Signature Pre-Crafted Recipes
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-foreground mt-1">
              Most Loved In The Kitchen
            </h2>
          </div>
          <Link
            href="/menu"
            className="text-sm font-bold text-accent hover:text-accent-hover flex items-center gap-1.5"
          >
            <span>View Full Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {populars.map((bowl) => (
            <div
              key={bowl.id}
              className="bg-surface border border-border rounded-3xl p-6 shadow-subtle hover:shadow-card transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative w-full h-52 rounded-2xl bg-cream-50 flex items-center justify-center mb-5 overflow-hidden">
                  <Image
                    src={bowl.imageUrl}
                    alt={bowl.name}
                    width={200}
                    height={200}
                    className="object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 bg-accent text-white text-[10px] uppercase font-black px-2.5 py-1 rounded-full shadow-sm">
                    Chef Choice
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-2">
                  {bowl.dietaryTags.map((t, idx) => (
                    <span key={idx} className="text-[10px] font-bold text-brand-green bg-green-50 px-2 py-0.5 rounded border border-green-200">
                      {t}
                    </span>
                  ))}
                </div>

                <h3 className="font-display font-black text-xl text-foreground group-hover:text-accent transition-colors">
                  {bowl.name}
                </h3>
                <p className="text-xs text-secondary mt-1.5 line-clamp-2 leading-relaxed">
                  {bowl.tagline}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <span className="font-display font-black text-xl text-foreground">
                  {formatINR(bowl.basePrice)}
                </span>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/build?bowl=${bowl.id}`}
                    className="p-2.5 rounded-xl border border-border hover:border-accent text-xs font-bold text-secondary hover:text-foreground"
                    title="Customize in builder"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-accent" />
                  </Link>
                  <button
                    onClick={() => addPredefinedBowlToCart(bowl)}
                    className="px-4 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold flex items-center gap-1.5 shadow-floating"
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
    </section>
  );
}

