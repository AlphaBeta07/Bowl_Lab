'use client';

import React from 'react';
import Image from 'next/image';
import { Ingredient } from '@/types';
import { motion } from 'framer-motion';

interface SauceBottleProps {
  ingredient: Ingredient;
  isSqueezing: boolean;
  isApplied: boolean;
  quantity?: number;
  onSelect: (ingredient: Ingredient) => void;
  onIncrement?: () => void;
  onDecrement?: () => void;
  disabled?: boolean;
}

export default function SauceBottle({
  ingredient,
  isSqueezing,
  isApplied,
  quantity = 0,
  onSelect,
  onIncrement,
  onDecrement,
  disabled = false,
}: SauceBottleProps) {
  const isSelected = isApplied || quantity > 0;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`relative flex flex-col items-center group transition-opacity ${
        disabled ? 'opacity-40 pointer-events-none' : 'cursor-pointer'
      }`}
    >
      {/* Squeeze Bottle Container (Tap to squeeze/add) */}
      <div
        onClick={() => !disabled && (onIncrement ? onIncrement() : onSelect(ingredient))}
        className="relative w-12 h-24 sm:w-14 sm:h-28 transition-transform group-hover:scale-105"
        title={`Drizzle ${ingredient.name} (+₹${ingredient.price})`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!disabled) onIncrement ? onIncrement() : onSelect(ingredient);
          }
        }}
      >
        <Image
          src={ingredient.imageUrl}
          alt={ingredient.name}
          fill
          className={`object-contain transition-transform ${
            isSqueezing ? 'animate-pulse scale-110' : ''
          }`}
        />

        {/* Count badge on bottle if applied */}
        {isSelected && (
          <span className="absolute -top-1 -right-1 bg-accent text-white min-w-[20px] h-5 px-1 rounded-full text-[11px] font-bold flex items-center justify-center shadow-md border border-white/60">
            {quantity > 1 ? `×${quantity}` : '✓'}
          </span>
        )}
      </div>

      {/* Label under bottle */}
      <span
        onClick={() => !disabled && (onIncrement ? onIncrement() : onSelect(ingredient))}
        className="mt-1 text-[11px] font-bold text-foreground tracking-tight text-center max-w-[72px] leading-tight select-none"
      >
        {ingredient.name}
      </span>

      {/* Interactive Controls: - [Qty] + Stepper when selected, or Price when not */}
      {isSelected ? (
        <div className="flex items-center gap-1 mt-1 bg-surface border border-border/90 rounded-full px-1.5 py-0.5 shadow-sm">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDecrement?.();
            }}
            disabled={disabled}
            className="w-5 h-5 rounded-full bg-[#EAE4D7] hover:bg-accent hover:text-white flex items-center justify-center text-xs font-bold text-foreground transition-colors cursor-pointer disabled:opacity-40"
            title={`Remove one serving of ${ingredient.name}`}
            aria-label={`Decrease ${ingredient.name}`}
          >
            −
          </button>

          <span className="text-[11px] font-bold font-mono px-0.5 min-w-[14px] text-center text-foreground select-none">
            {quantity || 1}
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onIncrement ? onIncrement() : onSelect(ingredient);
            }}
            disabled={disabled}
            className="w-5 h-5 rounded-full bg-[#EAE4D7] hover:bg-accent hover:text-white flex items-center justify-center text-xs font-bold text-foreground transition-colors cursor-pointer disabled:opacity-40"
            title={`Add another serving of ${ingredient.name} (+₹${ingredient.price})`}
            aria-label={`Increase ${ingredient.name}`}
          >
            +
          </button>
        </div>
      ) : (
        <span
          onClick={() => !disabled && onSelect(ingredient)}
          className="text-[10px] text-secondary font-medium font-mono mt-0.5 select-none"
        >
          +₹{ingredient.price}
        </span>
      )}
    </motion.div>
  );
}
