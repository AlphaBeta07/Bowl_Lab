'use client';

import React, { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useBowlBuilder } from '@/context/BowlBuilderContext';
import { useCart } from '@/context/CartContext';
import { INITIAL_INGREDIENTS, PREDEFINED_BOWLS } from '@/config/catalog';
import BowlCanvas from '@/components/bowl-builder/BowlCanvas';
import IngredientPanel from '@/components/bowl-builder/IngredientPanel';
import BowlReceipt from '@/components/bowl-builder/BowlReceipt';
import BuilderControls from '@/components/bowl-builder/BuilderControls';
import SauceBottle from '@/components/bowl-builder/SauceBottle';
import Image from 'next/image';

function BuilderContent() {
  const searchParams = useSearchParams();
  const bowlParam = searchParams.get('bowl');

  const {
    isLidOpen,
    isLidAnimating,
    isSealed,
    sauces,
    ingredients,
    squeezeSauce,
    decrementSauce,
    activeSqueezingSauce,
    addIngredient,
    removeIngredientById,
    loadPredefined,
    openLid,
  } = useBowlBuilder();

  const { toggleCart } = useCart();

  // Load predefined bowl if requested via URL param (e.g. from Menu)
  useEffect(() => {
    if (bowlParam) {
      const match = PREDEFINED_BOWLS.find((b) => b.id === bowlParam);
      if (match) {
        loadPredefined(
          match.name,
          match.defaultBaseId,
          match.defaultIngredientIds,
          match.defaultSauceIds
        );
        // If loaded, open lid so user can customize right away
        openLid();
      }
    }
  }, [bowlParam, loadPredefined, openLid]);

  const sauceList = INITIAL_INGREDIENTS.filter((i) => i.category === 'sauces');
  const toppingDishes = INITIAL_INGREDIENTS.filter((i) => i.category === 'toppings').slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-foreground py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Builder Context Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-4 border-b border-border gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest font-bold text-accent bg-accent/10 px-2.5 py-1 rounded-full">
                Interactive Lab
              </span>
              <span className="text-xs font-mono text-secondary">
                {ingredients.length} items placed
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-foreground mt-1">
              Craft Your Custom Bowl
            </h1>
          </div>

          <div className="text-xs text-secondary font-mono flex items-center gap-2">
            <span>• Flat photos &amp; real motion</span>
            <span>• 100% Chef grade</span>
          </div>
        </div>

        {/* Desktop 3-Column Layout / Mobile Responsive Stack */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Ingredient Selection Panel (3 cols) */}
          <div className="order-2 lg:order-1 lg:col-span-4 xl:col-span-3">
            <IngredientPanel />
          </div>

          {/* CENTER: Shelf + Bowl Canvas + Controls (5 or 6 cols) */}
          <div className="order-1 lg:order-2 lg:col-span-8 xl:col-span-6 flex flex-col items-center">
            
            {/* Top Shelf: Sauce Bottles & Topping Ramekins (as seen in the reel!) */}
            <div className="w-full flex flex-wrap items-center justify-center gap-4 sm:gap-6 pb-4 mb-2 border-b border-border/60">
              
              {/* Squeeze bottles */}
              <div className="flex items-center gap-2.5 sm:gap-4 overflow-x-auto max-w-full pb-1 no-scrollbar">
                {sauceList.map((sauce) => {
                  const appliedSauce = sauces.find((s) => s.sauceId === sauce.id);
                  return (
                    <SauceBottle
                      key={sauce.id}
                      ingredient={sauce}
                      isSqueezing={activeSqueezingSauce?.id === sauce.id}
                      isApplied={!!appliedSauce}
                      quantity={appliedSauce?.quantity || 0}
                      onSelect={squeezeSauce}
                      onIncrement={() => squeezeSauce(sauce)}
                      onDecrement={() => decrementSauce(sauce.id)}
                      disabled={isSealed || (!isLidOpen && !isSealed)}
                    />
                  );
                })}
              </div>

              {/* Topping Ceramic Ramekins beside sauces */}
              <div className="hidden sm:flex items-center gap-3 border-l border-border/80 pl-4">
                {toppingDishes.map((top) => {
                  const placedCount = ingredients.filter((i) => i.ingredientId === top.id).length;
                  const isPlaced = placedCount > 0;
                  const isDisabled = isSealed || (!isLidOpen && !isSealed);

                  return (
                    <div
                      key={top.id}
                      className="group flex flex-col items-center"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          if (isPlaced) {
                            removeIngredientById(top.id);
                          } else {
                            addIngredient(top);
                          }
                        }}
                        disabled={isDisabled}
                        className={`relative w-11 h-11 rounded-full transition-all duration-200 ${
                          isPlaced
                            ? 'ring-2 ring-accent scale-105 shadow-sm bg-warm-cream/60'
                            : 'hover:scale-110 opacity-85 hover:opacity-100'
                        } ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                        title={isPlaced ? `Remove ${top.name}` : `Sprinkle ${top.name} (+₹${top.price})`}
                      >
                        <Image
                          src={top.imageUrl}
                          alt={top.name}
                          fill
                          className="object-contain p-0.5"
                        />
                        {isPlaced && (
                          <span className="absolute -top-1 -right-1 bg-accent text-white min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center shadow-sm">
                            {placedCount > 1 ? `×${placedCount}` : '✓'}
                          </span>
                        )}
                      </button>

                      <span className="text-[10px] font-bold text-foreground mt-1">
                        {top.name.split(' ')[0]}
                      </span>

                      {/* Stepper when placed, or unit price when not */}
                      {isPlaced ? (
                        <div className="flex items-center gap-1 mt-0.5 bg-surface border border-border/90 rounded-full px-1.5 py-0.5 shadow-sm">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeIngredientById(top.id);
                            }}
                            disabled={isDisabled}
                            className="w-4 h-4 rounded-full bg-[#EAE4D7] hover:bg-accent hover:text-white flex items-center justify-center text-[10px] font-bold text-foreground transition-colors cursor-pointer disabled:opacity-40"
                            title={`Remove ${top.name}`}
                          >
                            −
                          </button>
                          <span className="text-[10px] font-bold font-mono px-0.5 min-w-[12px] text-center text-foreground select-none">
                            {placedCount}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              addIngredient(top);
                            }}
                            disabled={isDisabled}
                            className="w-4 h-4 rounded-full bg-[#EAE4D7] hover:bg-accent hover:text-white flex items-center justify-center text-[10px] font-bold text-foreground transition-colors cursor-pointer disabled:opacity-40"
                            title={`Add another serving of ${top.name} (+₹${top.price})`}
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <span className="text-[9px] font-mono text-secondary font-semibold mt-0.5">
                          +₹{top.price}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Central Interactive Bowl */}
            <BowlCanvas />

            {/* Floating Status & Undo Controls */}
            <BuilderControls />
          </div>

          {/* RIGHT: Thermal Receipt Order Summary (3 cols) */}
          <div className="order-3 lg:col-span-12 xl:col-span-3 flex justify-center mt-6 xl:mt-0">
            <BowlReceipt onProceedToCart={() => toggleCart(true)} />
          </div>

        </div>

      </div>
    </div>
  );
}

export default function BuildPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center font-mono">Loading bowl lab...</div>}>
      <BuilderContent />
    </Suspense>
  );
}

