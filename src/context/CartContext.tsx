'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem, CustomBowl, DeliveryType, PredefinedBowl } from '@/types';
import { calculateOrderTotals, PriceBreakdown } from '@/lib/pricing/calculator';

interface CartContextType {
  items: CartItem[];
  deliveryType: DeliveryType;
  couponCode: string;
  discountAmount: number;
  totals: PriceBreakdown;
  itemCount: number;
  isCartOpen: boolean;

  // Actions
  setDeliveryType: (type: DeliveryType) => void;
  addCustomBowlToCart: (customBowl: CustomBowl, quantity?: number) => void;
  addPredefinedBowlToCart: (bowl: PredefinedBowl, quantity?: number) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  toggleCart: (open?: boolean) => void;
}

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = 'bowllab_cart_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('delivery');
  const [couponCode, setCouponCode] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {}
    setIsLoaded(true);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, isLoaded]);

  // Recalculate totals
  const totals = calculateOrderTotals(items, deliveryType, discountAmount);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const toggleCart = (open?: boolean) => {
    setIsCartOpen((prev) => (open !== undefined ? open : !prev));
  };

  const addCustomBowlToCart = useCallback((customBowl: CustomBowl, quantity: number = 1) => {
    const baseName = customBowl.base?.name || 'Sushi Rice';

    // Separate fresh ingredients (proteins, veggies) and crunch toppings
    const mainIngredients = customBowl.ingredients.filter((i) => i.category !== 'toppings');
    const toppingIngredients = customBowl.ingredients.filter((i) => i.category === 'toppings');

    // Group multiple quantities of fresh ingredients
    const ingredientCounts: Record<string, { name: string; count: number }> = {};
    for (const ing of mainIngredients) {
      if (!ingredientCounts[ing.ingredientId]) {
        ingredientCounts[ing.ingredientId] = { name: ing.name, count: 0 };
      }
      ingredientCounts[ing.ingredientId].count += ing.quantity || 1;
    }
    const ingredientNames = Object.values(ingredientCounts).map((item) =>
      item.count > 1 ? `${item.name} × ${item.count}` : item.name
    );

    // Group multiple quantities of crunch toppings
    const toppingCounts: Record<string, { name: string; count: number }> = {};
    for (const top of toppingIngredients) {
      if (!toppingCounts[top.ingredientId]) {
        toppingCounts[top.ingredientId] = { name: top.name, count: 0 };
      }
      toppingCounts[top.ingredientId].count += top.quantity || 1;
    }
    const toppingNames = Object.values(toppingCounts).map((item) =>
      item.count > 1 ? `${item.name} × ${item.count}` : item.name
    );

    const sauceCounts: Record<string, { name: string; count: number }> = {};
    for (const sauce of customBowl.sauces) {
      if (!sauceCounts[sauce.sauceId]) {
        sauceCounts[sauce.sauceId] = { name: sauce.name, count: 0 };
      }
      sauceCounts[sauce.sauceId].count += sauce.quantity || 1;
    }
    const sauceNames = Object.values(sauceCounts).map((item) =>
      item.count > 1 ? `${item.name} × ${item.count}` : item.name
    );

    const newItem: CartItem = {
      id: `cart-custom-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      bowlName: customBowl.name || 'Custom Poke Bowl',
      isCustom: true,
      quantity,
      unitPrice: customBowl.subtotal,
      totalPrice: customBowl.subtotal * quantity,
      summary: {
        baseName,
        ingredientNames,
        toppingNames,
        sauceNames,
      },
      customBowlData: customBowl,
    };

    setItems((prev) => [...prev, newItem]);
    toggleCart(true);
  }, []);

  const addPredefinedBowlToCart = useCallback((bowl: PredefinedBowl, quantity: number = 1) => {
    setItems((prev) => {
      // If already in cart, increment quantity
      const existing = prev.find((item) => !item.isCustom && item.predefinedBowlId === bowl.id);
      if (existing) {
        return prev.map((item) =>
          item.id === existing.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
                totalPrice: (item.quantity + quantity) * item.unitPrice,
              }
            : item
        );
      }

      const newItem: CartItem = {
        id: `cart-predef-${Date.now()}`,
        bowlName: bowl.name,
        isCustom: false,
        quantity,
        unitPrice: bowl.basePrice,
        totalPrice: bowl.basePrice * quantity,
        summary: {
          baseName: 'Signature Base',
          ingredientNames: bowl.dietaryTags,
          sauceNames: [],
        },
        predefinedBowlId: bowl.id,
      };

      return [...prev, newItem];
    });

    toggleCart(true);
  }, []);

  const updateQuantity = useCallback((itemId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0
              ? { ...item, quantity: nextQty, totalPrice: nextQty * item.unitPrice }
              : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setCouponCode('');
    setDiscountAmount(0);
  }, []);

  const applyCoupon = useCallback((code: string): { success: boolean; message: string } => {
    const clean = code.trim().toUpperCase();
    const subtotal = items.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0);

    if (clean === 'BOWLLAB50') {
      if (subtotal < 300) {
        return { success: false, message: 'Minimum order ₹300 required for BOWLLAB50' };
      }
      setCouponCode(clean);
      setDiscountAmount(50);
      return { success: true, message: '₹50 discount applied successfully!' };
    }

    if (clean === 'FIRSTBOWL') {
      if (subtotal < 200) {
        return { success: false, message: 'Minimum order ₹200 required for FIRSTBOWL' };
      }
      const disc = Math.round(subtotal * 0.2);
      setCouponCode(clean);
      setDiscountAmount(disc);
      return { success: true, message: `20% discount (₹${disc}) applied!` };
    }

    if (clean === 'FREESHIP') {
      setCouponCode(clean);
      setDiscountAmount(49);
      return { success: true, message: 'Free delivery applied!' };
    }

    return { success: false, message: 'Invalid or expired coupon code' };
  }, [items]);

  const removeCoupon = useCallback(() => {
    setCouponCode('');
    setDiscountAmount(0);
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        deliveryType,
        couponCode,
        discountAmount,
        totals,
        itemCount,
        isCartOpen,
        setDeliveryType,
        addCustomBowlToCart,
        addPredefinedBowlToCart,
        updateQuantity,
        removeItem,
        clearCart,
        applyCoupon,
        removeCoupon,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}

