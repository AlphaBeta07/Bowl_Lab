import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { INITIAL_INGREDIENTS } from '@/config/catalog';

export default function FreshIngredients() {
  const highlights = [
    INITIAL_INGREDIENTS.find(i => i.id === 'salmon'),
    INITIAL_INGREDIENTS.find(i => i.id === 'avocado'),
    INITIAL_INGREDIENTS.find(i => i.id === 'ahi-tuna'),
    INITIAL_INGREDIENTS.find(i => i.id === 'crispy-tofu'),
    INITIAL_INGREDIENTS.find(i => i.id === 'edamame'),
    INITIAL_INGREDIENTS.find(i => i.id === 'mango'),
    INITIAL_INGREDIENTS.find(i => i.id === 'red-cabbage'),
    INITIAL_INGREDIENTS.find(i => i.id === 'sesame-seeds'),
  ].filter(Boolean);

  return (
    <section className="py-20 bg-cream-50 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-xs uppercase font-mono tracking-widest font-bold text-accent">
            Pure Nutrition · Zero Shortcuts
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-black text-foreground">
            Clean, Colourful Ingredient Cuts
          </h2>
          <p className="text-secondary text-sm">
            Top-down precision cutouts. Fresh daily delivery from certified ethical farms and line-caught fisheries.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {highlights.map((ing) => (
            <div
              key={ing!.id}
              className="bg-surface border border-border rounded-3xl p-5 text-center flex flex-col items-center shadow-subtle hover:shadow-card transition-all group"
            >
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 my-2">
                <Image
                  src={ing!.imageUrl}
                  alt={ing!.name}
                  fill
                  className="object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-sm"
                />
              </div>

              <h4 className="font-bold text-sm text-foreground mt-2">{ing!.name}</h4>
              <p className="text-[11px] text-secondary font-mono mt-0.5">+₹{ing!.price}</p>
              <span className="text-[10px] text-brand-green font-bold bg-green-50 px-2 py-0.5 rounded-full mt-2 border border-green-200">
                {ing!.dietaryTags[0] || 'Fresh'}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/build"
            className="text-xs font-mono font-bold text-accent hover:underline uppercase tracking-wider"
          >
            Explore all 24+ ingredients inside the interactive builder →
          </Link>
        </div>

      </div>
    </section>
  );
}

