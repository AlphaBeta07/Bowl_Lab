export type IngredientCategory = 'bases' | 'proteins' | 'vegetables' | 'toppings' | 'sauces';

export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  description: string;
  imageUrl: string;
  price: number;
  allergens: string[];
  dietaryTags: string[];
  isAvailable: boolean;
  defaultQuantity: number;
}

export interface BowlPieceInstance {
  pieceId: string;
  parentInstanceId: string;
  ingredientId: string;
  name: string;
  category: IngredientCategory;
  imageUrl: string;
  x: number; // 0 to 1 normalized relative to bowl center (0.5, 0.5)
  y: number; // 0 to 1 normalized
  scale: number;
  rotation: number;
  zIndex: number;
  pieceIndex: number;
}

export interface BowlIngredientInstance {
  instanceId: string;
  ingredientId: string;
  name: string;
  category: IngredientCategory;
  imageUrl: string;
  price: number;
  quantity: number;
  pieces: BowlPieceInstance[];
  // Fallback single coordinates if used as a base
  x?: number;
  y?: number;
  scale?: number;
  rotation?: number;
  zIndex?: number;
}

export interface SauceDrizzle {
  id: string;
  sauceId: string;
  name: string;
  overlayUrl: string;
  bottleUrl: string;
  price: number;
  color: string;
  quantity?: number;
}

export interface CustomBowl {
  id: string;
  name: string;
  base: BowlIngredientInstance | null;
  ingredients: BowlIngredientInstance[];
  sauces: SauceDrizzle[];
  subtotal: number;
  isSealed: boolean;
}

export interface PredefinedBowl {
  id: string;
  name: string;
  tagline: string;
  description: string;
  imageUrl: string;
  basePrice: number;
  calories: number;
  defaultBaseId: string;
  defaultIngredientIds: string[];
  defaultSauceIds: string[];
  dietaryTags: string[];
  allergens: string[];
  isAvailable: boolean;
  isPopular?: boolean;
}

export interface CartItem {
  id: string;
  bowlName: string;
  isCustom: boolean;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  summary: {
    baseName: string;
    ingredientNames: string[];
    toppingNames?: string[];
    sauceNames: string[];
  };
  customBowlData?: CustomBowl;
  predefinedBowlId?: string;
}

export type DeliveryType = 'delivery' | 'pickup';
export type PaymentMethod = 'cod' | 'pay_at_restaurant';
export type PaymentStatus = 'pending' | 'paid' | 'not_applicable';
export type OrderStatus = 'received' | 'preparing' | 'ready' | 'out_for_delivery' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string | null;
  customerName: string;
  email: string;
  phone: string;
  deliveryType: DeliveryType;
  deliveryAddress: string;
  deliveryInstructions?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;
  items: CartItem[];
  createdAt: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minimumOrder: number;
  isActive: boolean;
}

export interface RestaurantSettings {
  id: string;
  restaurantName: string;
  tagline: string;
  logoUrl: string;
  address: string;
  phone: string;
  openingHours: string;
  deliveryEnabled: boolean;
  pickupEnabled: boolean;
  taxPercentage: number;
  deliveryFee: number;
  minimumOrder: number;
}
