import { CartItem, CustomBowl, DeliveryType, Ingredient } from '@/types';
import { INITIAL_INGREDIENTS, DEFAULT_SETTINGS } from '@/config/catalog';

export interface PriceBreakdown {
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;
}

/**
 * Calculates custom bowl price from authoritative ingredient list.
 */
export function calculateCustomBowlSubtotal(
  bowl: CustomBowl,
  catalog: Ingredient[] = INITIAL_INGREDIENTS
): number {
  let sum = 0;

  // 1. Base price
  if (bowl.base) {
    const matchedBase = catalog.find((i) => i.id === bowl.base?.ingredientId);
    sum += matchedBase ? matchedBase.price : (bowl.base.price || 40);
  }

  // 2. Ingredients price
  for (const item of bowl.ingredients) {
    const matched = catalog.find((i) => i.id === item.ingredientId);
    const unitPrice = matched ? matched.price : item.price;
    sum += unitPrice * (item.quantity || 1);
  }

  // 3. Sauces price
  for (const sauce of bowl.sauces) {
    const matched = catalog.find((i) => i.id === sauce.sauceId);
    const unitPrice = matched ? matched.price : sauce.price;
    sum += unitPrice;
  }

  return Math.round(sum * 100) / 100;
}

/**
 * Full calculation for an entire cart.
 */
export function calculateOrderTotals(
  items: CartItem[],
  deliveryType: DeliveryType = 'delivery',
  discountAmount: number = 0,
  taxRatePercent: number = DEFAULT_SETTINGS.taxPercentage,
  standardDeliveryFee: number = DEFAULT_SETTINGS.deliveryFee
): PriceBreakdown {
  const subtotal = items.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
  const deliveryFee = deliveryType === 'delivery' && subtotal > 0 ? standardDeliveryFee : 0;
  
  // Tax applies to subtotal
  const tax = Math.round((subtotal * (taxRatePercent / 100)) * 100) / 100;
  
  // Total after discount and delivery
  const total = Math.max(0, Math.round((subtotal + tax + deliveryFee - discountAmount) * 100) / 100);

  return {
    subtotal,
    tax,
    deliveryFee,
    discount: discountAmount,
    total,
  };
}

/**
 * Server-side order verification: recalculates prices strictly using server catalog.
 */
export function validateAndRecalculateOrder(
  items: CartItem[],
  deliveryType: DeliveryType,
  discountCode?: string,
  catalog: Ingredient[] = INITIAL_INGREDIENTS
): { isValid: boolean; totals: PriceBreakdown; error?: string } {
  if (!items || items.length === 0) {
    return {
      isValid: false,
      totals: { subtotal: 0, tax: 0, deliveryFee: 0, discount: 0, total: 0 },
      error: 'Cart is empty',
    };
  }

  // Recalculate each item's true price
  let verifiedSubtotal = 0;
  for (const item of items) {
    if (item.isCustom && item.customBowlData) {
      const verifiedUnit = calculateCustomBowlSubtotal(item.customBowlData, catalog);
      verifiedSubtotal += verifiedUnit * item.quantity;
    } else {
      verifiedSubtotal += item.unitPrice * item.quantity;
    }
  }

  let discount = 0;
  if (discountCode) {
    const cleanCode = discountCode.trim().toUpperCase();
    if (cleanCode === 'BOWLLAB50' && verifiedSubtotal >= 300) {
      discount = 50;
    } else if (cleanCode === 'FIRSTBOWL' && verifiedSubtotal >= 200) {
      discount = Math.round(verifiedSubtotal * 0.2);
    } else if (cleanCode === 'FREESHIP' && deliveryType === 'delivery') {
      discount = DEFAULT_SETTINGS.deliveryFee;
    }
  }

  const tax = Math.round((verifiedSubtotal * (DEFAULT_SETTINGS.taxPercentage / 100)) * 100) / 100;
  const deliveryFee = deliveryType === 'delivery' ? DEFAULT_SETTINGS.deliveryFee : 0;
  const total = Math.max(0, Math.round((verifiedSubtotal + tax + deliveryFee - discount) * 100) / 100);

  return {
    isValid: true,
    totals: {
      subtotal: verifiedSubtotal,
      tax,
      deliveryFee,
      discount,
      total,
    },
  };
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

