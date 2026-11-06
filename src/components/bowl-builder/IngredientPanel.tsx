'use client';

import React from 'react';
import { useBowlBuilder } from '@/context/BowlBuilderContext';
import { INITIAL_INGREDIENTS } from '@/config/catalog';
import { store } from '@/lib/supabase/store';
import { Ingredient, IngredientCategory } from '@/types';
import IngredientCard from './IngredientCard';

interface IngredientPanelProps {
  catalog?: Ingredient[];
}

export default function IngredientPanel({ catalog: propCatalog }: IngredientPanelProps) {
  const [catalog, setCatalog] = React.useState<Ingredient[]>(propCatalog || INITIAL_INGREDIENTS);

  React.useEffect(() => {
    if (!propCatalog) {
      setCatalog(store.getIngredients());
    }
  }, [propCatalog]);
  const {
    isLidOpen,
    isSealed,
    activeCategory,
    setActiveCategory,
    base,
    ingredients,
    sauces,
    selectBase,
    addIngredient,
    removeIngredientById,
    squeezeSauce,
  } = useBowlBuilder();

  const categories: { id: IngredientCategory; label: string; icon: string }[] = [
    { id: 'proteins', label: 'Proteins', icon: '🐟' },
    { id: 'vegetables', label: 'Veggies', icon: '🥑' },
    { id: 'bases', label: 'Bases', icon: '🍚' },
    { id: 'toppings', label: 'Toppings', icon: '🥢' },
    { id: 'sauces', label: 'Sauces', icon: '🍶' },
  ];

  const currentItems = catalog.filter((item) => item.category === activeCategory && item.isAvailable);

  const handleCardClick = (ingredient: Ingredient) => {
    if (ingredient.category === 'bases') {
      selectBase(ingredient);
    } else if (ingredient.category === 'sauces') {
      squeezeSauce(ingredient);
    } else {
      addIngredient(ingredient);
    }
  };

  const getCountInBowl = (ingredient: Ingredient): number => {
    if (ingredient.category === 'bases') {
      return base?.ingredientId === ingredient.id ? 1 : 0;
    }
    if (ingredient.category === 'sauces') {
      return sauces.some((s) => s.sauceId === ingredient.id) ? 1 : 0;
    }
    return ingredients.filter((item) => item.ingredientId === ingredient.id).length;
  };

  return (
    <div className="flex flex-col w-full h-full max-w-sm">
      
      {/* Editorial Header matching reference reel */}
      <div className="mb-4">
        <h2 className="font-display text-3xl sm:text-4xl text-foreground font-black tracking-tight italic">
          Pile it on.
        </h2>
        <p className="text-xs text-secondary font-medium mt-0.5">
          Choose fresh proteins, crisp vegetables, and crunchy toppings.
        </p>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-1.5 p-1 bg-surface border border-border rounded-2xl mb-4 overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeCategory === cat.id
                ? 'bg-foreground text-background shadow-sm'
                : 'text-secondary hover:text-foreground hover:bg-cream-100'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Grid of Ingredients */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 overflow-y-auto max-h-[520px] pr-1 pb-4">
        {currentItems.map((ing) => (
          <IngredientCard
            key={ing.id}
            ingredient={ing}
            countInBowl={getCountInBowl(ing)}
            onAdd={handleCardClick}
            onRemove={removeIngredientById}
            disabled={isSealed}
          />
        ))}
      </div>
    </div>
  );
}

