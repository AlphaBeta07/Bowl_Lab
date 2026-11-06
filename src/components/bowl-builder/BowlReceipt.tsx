'use client';

import React from 'react';
import Image from 'next/image';
import { useBowlBuilder } from '@/context/BowlBuilderContext';
import { useCart } from '@/context/CartContext';
import { formatINR } from '@/lib/pricing/calculator';
import { ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';

interface BowlReceiptProps {
  onProceedToCart?: () => void;
}

export default function BowlReceipt({ onProceedToCart }: BowlReceiptProps) {
  const {
    isLidOpen,
    isLidAnimating,
    isSealed,
    base,
    ingredients,
    sauces,
    subtotal,
    sealBowl,
    getCustomBowlData,
  } = useBowlBuilder();

  const { deliveryType, setDeliveryType, addCustomBowlToCart } = useCart();

  const deliveryFee = deliveryType === 'delivery' && (base || ingredients.length > 0) ? 49 : 0;
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const grandTotal = subtotal > 0 ? subtotal + tax + deliveryFee : 0;

  // Group ingredients by ingredientId so multiple servings show as "Fresh Salmon × 2" instead of repeating name
  const groupedIngredients = React.useMemo(() => {
    const groups: {
      ingredientId: string;
      name: string;
      unitPrice: number;
      count: number;
      totalPrice: number;
    }[] = [];

    for (const item of ingredients) {
      const existing = groups.find((g) => g.ingredientId === item.ingredientId);
      if (existing) {
        existing.count += 1;
        existing.totalPrice += item.price;
      } else {
        groups.push({
          ingredientId: item.ingredientId,
          name: item.name,
          unitPrice: item.price,
          count: 1,
          totalPrice: item.price,
        });
      }
    }
    return groups;
  }, [ingredients]);

  // Group sauces in case of multiple drizzles
  const groupedSauces = React.useMemo(() => {
    const groups: {
      sauceId: string;
      name: string;
      count: number;
      totalPrice: number;
    }[] = [];

    for (const s of sauces) {
      const existing = groups.find((g) => g.sauceId === s.sauceId);
      if (existing) {
        existing.count += 1;
        existing.totalPrice += s.price;
      } else {
        groups.push({
          sauceId: s.sauceId,
          name: s.name,
          count: 1,
          totalPrice: s.price,
        });
      }
    }
    return groups;
  }, [sauces]);

  const handleSealOrAddToCart = () => {
    if (!isLidOpen && !isSealed) {
      return;
    }

    if (isLidOpen && !isSealed) {
      // Seal the bowl!
      sealBowl();
      return;
    }

    if (isSealed) {
      // Add custom bowl to cart and open drawer
      const customBowl = getCustomBowlData();
      addCustomBowlToCart(customBowl);
      if (onProceedToCart) {
        onProceedToCart();
      }
    }
  };

  return (
    <div className="relative w-full max-w-sm flex flex-col items-center">
      
      {/* Subtle Striped Napkin / Placemat accent peeking beneath the receipt */}
      <div className="absolute -bottom-6 -right-4 w-48 h-48 opacity-40 pointer-events-none rounded-2xl overflow-hidden -rotate-6">
        <Image
          src="/images/branding/napkin-pattern.svg"
          alt="Striped table napkin"
          fill
          className="object-cover"
        />
      </div>

      {/* Top Status Tag */}
      <div className="text-[11px] font-mono tracking-wider text-secondary uppercase mb-2 font-semibold">
        Made to order · ready in 15 mins
      </div>

      {/* Main Thermal Receipt Container */}
      <div className="w-full bg-[#FFFDF7] border border-[#E9E3D8] rounded-2xl shadow-card p-6 flex flex-col relative z-10 transition-all font-mono">
        
        {/* Receipt Header */}
        <div className="text-center border-b border-dashed border-[#DCD5C5] pb-4 mb-4">
          <h3 className="font-display font-black text-2xl tracking-tight text-foreground">
            BOWL<span className="text-accent">LAB</span>
          </h3>
          <p className="text-[10px] tracking-widest uppercase text-secondary font-bold mt-0.5">
            POKE · FRESH · MADE YOUR WAY
          </p>
        </div>

        {/* Section: Your Bowl Items */}
        <div className="flex-1 space-y-2 mb-4 max-h-56 overflow-y-auto pr-1 no-scrollbar text-xs">
          <div className="font-bold text-[11px] uppercase tracking-wider text-secondary">
            YOUR BOWL
          </div>

          {/* Base */}
          {base && (
            <div className="flex items-center justify-between py-0.5">
              <span className="text-foreground">{base.name} base</span>
              <span className="font-semibold text-foreground">₹{base.price}</span>
            </div>
          )}

          {/* Grouped Ingredients with Multiple Quantity */}
          {groupedIngredients.map((item) => (
            <div key={item.ingredientId} className="flex items-center justify-between py-0.5 text-foreground/90">
              <span className="truncate max-w-[190px]">
                {item.name}
                {item.count > 1 && (
                  <span className="font-bold text-accent ml-1.5 font-mono text-[11px]">
                    × {item.count}
                  </span>
                )}
              </span>
              <span className="font-semibold">₹{item.totalPrice}</span>
            </div>
          ))}

          {/* Grouped Sauces */}
          {groupedSauces.map((sauce) => (
            <div key={sauce.sauceId} className="flex items-center justify-between py-0.5 text-accent font-medium">
              <span className="truncate max-w-[190px]">
                {sauce.name}
                {sauce.count > 1 && (
                  <span className="font-bold ml-1.5 font-mono text-[11px]">
                    × {sauce.count}
                  </span>
                )}
              </span>
              <span className="font-semibold">₹{sauce.totalPrice}</span>
            </div>
          ))}

          {/* Empty Prompt */}
          {!base && ingredients.length === 0 && sauces.length === 0 && (
            <div className="py-4 text-center text-secondary/70 italic text-xs">
              Nothing in the bowl yet.<br />Tap any ingredient to start.
            </div>
          )}
        </div>

        {/* Delivery / Pickup Radio Selector */}
        <div className="border-t border-dashed border-[#DCD5C5] pt-3 pb-3 my-1">
          <div className="flex items-center justify-between text-xs font-sans font-semibold">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="orderDeliveryType"
                checked={deliveryType === 'delivery'}
                onChange={() => setDeliveryType('delivery')}
                className="accent-accent"
              />
              <span>Delivery</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="orderDeliveryType"
                checked={deliveryType === 'pickup'}
                onChange={() => setDeliveryType('pickup')}
                className="accent-accent"
              />
              <span>Store Pickup</span>
            </label>
          </div>

          <div className="flex items-center justify-between text-xs text-secondary mt-2">
            <span>Delivery Fee</span>
            <span>{deliveryFee > 0 ? `₹${deliveryFee}` : 'Free'}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-secondary mt-1">
            <span>GST (5%)</span>
            <span>₹{tax}</span>
          </div>
        </div>

        {/* Total Price */}
        <div className="border-t-2 border-foreground pt-3 pb-4 flex items-baseline justify-between">
          <span className="font-bold text-xs uppercase tracking-wider text-foreground">
            TOTAL
          </span>
          <span className="font-display font-black text-2xl sm:text-3xl text-foreground tracking-tight">
            {formatINR(grandTotal)}
          </span>
        </div>

        {/* Primary CTA Button */}
        <button
          onClick={handleSealOrAddToCart}
          disabled={isLidAnimating || (!isLidOpen && !isSealed)}
          className={`w-full py-3.5 px-4 rounded-xl font-sans font-black text-sm uppercase tracking-wide flex items-center justify-center gap-2 shadow-floating transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
            isSealed
              ? 'bg-[#24786D] hover:bg-[#1E675D] text-white'
              : 'bg-accent hover:bg-accent-hover text-white'
          } ${isLidAnimating ? 'opacity-50 cursor-wait' : ''}`}
        >
          {isSealed ? (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>Add Sealed Bowl to Cart</span>
              <ArrowRight className="w-4 h-4" />
            </>
          ) : isLidOpen ? (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Seal My Bowl</span>
              <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            <>
              <span>Lift Lid to Start</span>
            </>
          )}
        </button>

        {/* Receipt Footer Message & Barcode */}
        <div className="mt-4 pt-3 text-center border-t border-dashed border-[#DCD5C5]">
          <p className="text-[11px] text-secondary font-sans font-medium italic mb-2">
            One bowl. Happy you.
          </p>
          <div className="w-44 h-8 mx-auto relative opacity-85">
            <Image
              src="/images/branding/barcode.svg"
              alt="Receipt Barcode"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
