'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Ingredient } from '@/types';
import { Minus, Check } from 'lucide-react';

interface IngredientCardProps {
  ingredient: Ingredient;
  countInBowl: number;
  onAdd: (ingredient: Ingredient) => void;
  onRemove: (ingredientId: string) => void;
  disabled?: boolean;
}

export default function IngredientCard({
  ingredient,
  countInBowl,
  onAdd,
  onRemove,
  disabled = false,
}: IngredientCardProps) {
  const isSelected = countInBowl > 0;

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('application/json', JSON.stringify(ingredient));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div
      draggable={!disabled}
      onDragStart={handleDragStart}
      onClick={() => !disabled && onAdd(ingredient)}
      className="cursor-pointer select-none"
    >
      <motion.div
        whileHover={{ y: -3, scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className={`relative flex flex-col items-center justify-between p-2.5 sm:p-3 rounded-2xl transition-all border ${
          isSelected
            ? 'bg-surface border-accent shadow-card ring-2 ring-accent/20'
            : 'bg-surface/80 hover:bg-surface border-border hover:border-accent/40 shadow-subtle'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={`${ingredient.name} — Click or drag into bowl`}
      >
        {/* Red checkmark badge or count in top right matching reel */}
        {isSelected && (
          <div className="absolute top-1.5 right-1.5 bg-accent text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-sm z-10">
            {countInBowl > 1 ? countInBowl : <Check className="w-3 h-3 stroke-[3]" />}
          </div>
        )}

        {/* Ingredient Image */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 my-1 pointer-events-none">
          <Image
            src={ingredient.imageUrl}
            alt={ingredient.name}
            fill
            sizes="(max-width: 640px) 70px, 90px"
            className="object-contain drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
          />
        </div>

        {/* Name & Price */}
        <div className="w-full text-center mt-1 pointer-events-none">
          <p className="text-xs sm:text-sm font-bold text-foreground leading-tight truncate">
            {ingredient.name}
          </p>
          <p className="text-[11px] sm:text-xs font-mono font-medium text-secondary mt-0.5">
            +₹{ingredient.price}
          </p>
        </div>

        {/* Quick Minus Action when selected */}
        {isSelected && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(ingredient.id);
            }}
            className="absolute -bottom-1 -left-1 w-5 h-5 rounded-full bg-cream-200 hover:bg-cream-300 text-foreground flex items-center justify-center text-xs shadow-sm z-20"
            title={`Remove one ${ingredient.name}`}
          >
            <Minus className="w-3 h-3" />
          </button>
        )}
      </motion.div>
    </div>
  );
}
