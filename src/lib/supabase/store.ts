import { Ingredient, PredefinedBowl, Order, RestaurantSettings } from '@/types';
import { INITIAL_INGREDIENTS, PREDEFINED_BOWLS, DEFAULT_SETTINGS } from '@/config/catalog';

// In-memory runtime store fallback (persisted in browser via localStorage where available)
let runtimeIngredients: Ingredient[] = [...INITIAL_INGREDIENTS];
let runtimeBowls: PredefinedBowl[] = [...PREDEFINED_BOWLS];
let runtimeOrders: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'BL-84210',
    customerName: 'Anish Sharma',
    email: 'anish@example.com',
    phone: '+91 98765 12345',
    deliveryType: 'delivery',
    deliveryAddress: 'Flat 402, Green Palm Apts, Indiranagar 100ft Rd, Bengaluru',
    deliveryInstructions: 'Leave with guard if unreachable',
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    orderStatus: 'preparing',
    subtotal: 510,
    tax: 25.5,
    deliveryFee: 49,
    discount: 50,
    total: 534.5,
    items: [
      {
        id: 'item-1',
        bowlName: 'Custom Poke Bowl',
        isCustom: true,
        quantity: 1,
        unitPrice: 510,
        totalPrice: 510,
        summary: {
          baseName: 'Sushi Rice',
          ingredientNames: ['Fresh Salmon', 'Fresh Avocado', 'Sweet Edamame', 'Julienne Carrots', 'Crispy Shallots'],
          sauceNames: ['Spicy Mayo', 'Classic Shoyu'],
        },
      },
    ],
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: 'ord-1002',
    orderNumber: 'BL-84211',
    customerName: 'Priya Verma',
    email: 'priya@example.com',
    phone: '+91 99887 76655',
    deliveryType: 'pickup',
    deliveryAddress: 'Store Pickup — BOWL LAB Indiranagar',
    paymentMethod: 'pay_at_restaurant',
    paymentStatus: 'paid',
    orderStatus: 'ready',
    subtotal: 380,
    tax: 19,
    deliveryFee: 0,
    discount: 0,
    total: 399,
    items: [
      {
        id: 'item-2',
        bowlName: 'The Signature Salmon',
        isCustom: false,
        quantity: 1,
        unitPrice: 380,
        totalPrice: 380,
        summary: {
          baseName: 'Sushi Rice',
          ingredientNames: ['Salmon', 'Avocado', 'Cucumber', 'Edamame', 'Crispy Shallots'],
          sauceNames: ['Shoyu'],
        },
      },
    ],
    createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
  },
];
let runtimeSettings: RestaurantSettings = { ...DEFAULT_SETTINGS };

export const store = {
  getIngredients: (): Ingredient[] => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('bowllab_ingredients');
      if (stored) {
        try { return JSON.parse(stored); } catch {}
      }
    }
    return runtimeIngredients;
  },

  setIngredients: (items: Ingredient[]) => {
    runtimeIngredients = items;
    if (typeof window !== 'undefined') {
      localStorage.setItem('bowllab_ingredients', JSON.stringify(items));
    }
  },

  getBowls: (): PredefinedBowl[] => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('bowllab_bowls');
      if (stored) {
        try { return JSON.parse(stored); } catch {}
      }
    }
    return runtimeBowls;
  },

  setBowls: (items: PredefinedBowl[]) => {
    runtimeBowls = items;
    if (typeof window !== 'undefined') {
      localStorage.setItem('bowllab_bowls', JSON.stringify(items));
    }
  },

  getOrders: (): Order[] => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('bowllab_orders');
      if (stored) {
        try { return JSON.parse(stored); } catch {}
      }
    }
    return runtimeOrders;
  },

  getOrderById: (id: string): Order | undefined => {
    const orders = store.getOrders();
    return orders.find(o => o.id === id || o.orderNumber === id);
  },

  addOrder: (order: Order): Order => {
    const orders = store.getOrders();
    const updated = [order, ...orders];
    runtimeOrders = updated;
    if (typeof window !== 'undefined') {
      localStorage.setItem('bowllab_orders', JSON.stringify(updated));
    }
    return order;
  },

  updateOrderStatus: (id: string, status: Order['orderStatus'], paymentStatus?: Order['paymentStatus']): Order | null => {
    const orders = store.getOrders();
    const index = orders.findIndex(o => o.id === id || o.orderNumber === id);
    if (index === -1) return null;

    const updatedOrder = {
      ...orders[index],
      orderStatus: status,
      ...(paymentStatus ? { paymentStatus } : {}),
    };
    orders[index] = updatedOrder;
    runtimeOrders = [...orders];
    if (typeof window !== 'undefined') {
      localStorage.setItem('bowllab_orders', JSON.stringify(orders));
    }
    return updatedOrder;
  },

  updatePaymentStatus: (id: string, paymentStatus: Order['paymentStatus']): Order | null => {
    const orders = store.getOrders();
    const index = orders.findIndex(o => o.id === id || o.orderNumber === id);
    if (index === -1) return null;

    const updatedOrder = {
      ...orders[index],
      paymentStatus,
    };
    orders[index] = updatedOrder;
    runtimeOrders = [...orders];
    if (typeof window !== 'undefined') {
      localStorage.setItem('bowllab_orders', JSON.stringify(orders));
    }
    return updatedOrder;
  },

  getSettings: (): RestaurantSettings => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('bowllab_settings');
      if (stored) {
        try { return JSON.parse(stored); } catch {}
      }
    }
    return runtimeSettings;
  },

  updateSettings: (newSettings: Partial<RestaurantSettings>): RestaurantSettings => {
    const updated = { ...store.getSettings(), ...newSettings };
    runtimeSettings = updated;
    if (typeof window !== 'undefined') {
      localStorage.setItem('bowllab_settings', JSON.stringify(updated));
    }
    return updated;
  },
};

