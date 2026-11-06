'use client';

import React from 'react';
import Image from 'next/image';
import { Ingredient } from '@/types';
import { motion } from 'framer-motion';

interface SauceBottleProps {
  ingredient: Ingredient;
  isSqueezing: boolean;
  isApplied: boolean;
  onSelect: (ingredient: Ingredient) => void;
  disabled?: boolean;
}

export default function SauceBottle({
  ingredient,
  isSqueezing,
  isApplied,
  onSelect,
  disabled = false,
}: SauceBottleProps) {
  return (
    <motion.button
      whileHover={{ y: -6, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onSelect(ingredient)}
      disabled={disabled}
      className={`relative flex flex-col items-center group transition-opacity ${
        disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
      }`}
      title={`Drizzle ${ingredient.name} (+₹${ingredient.price})`}
    >
      {/* Squeeze Bottle Container */}
      <div className="relative w-12 h-24 sm:w-14 sm:h-28 transition-transform">
        <Image
          src={ingredient.imageUrl}
          alt={ingredient.name}
          fill
          className={`object-contain transition-transform group-hover:scale-105 ${
            isSqueezing ? 'animate-pulse' : ''
          }`}
        />

        {/* Checkmark badge if applied */}
        {isApplied && (
          <span className="absolute -top-1 -right-1 bg-accent text-white w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center shadow-md">
            ✓
          </span>
        )}
      </div>

      {/* Label under bottle */}
      <span className="mt-1 text-[11px] font-bold text-foreground tracking-tight text-center max-w-[70px] leading-tight">
        {ingredient.name}
      </span>
      <span className="text-[10px] text-secondary font-medium font-mono">
        +₹{ingredient.price}
      </span>
    </motion.button>
  );
}

