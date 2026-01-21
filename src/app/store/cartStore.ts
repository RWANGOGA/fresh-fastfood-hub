// src/store/cartStore.ts
import { create } from 'zustand';

// Key for localStorage
const CART_STORAGE_KEY = 'freshfastfoodhub-cart';

// Helper to load cart from localStorage
const loadCartFromStorage = (): CartItem[] => {
  if (typeof window === 'undefined') return []; // Server-side safety
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Failed to load cart from storage:', e);
    return [];
  }
};

// Helper to save cart to localStorage
const saveCartToStorage = (cart: CartItem[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (e) {
    console.error('Failed to save cart to storage:', e);
  }
};

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface CartState {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: loadCartFromStorage(), // Load on init

  addToCart: (newItem) =>
    set((state) => {
      const existing = state.cart.find((i) => i.id === newItem.id);
      let newCart;
      if (existing) {
        newCart = state.cart.map((i) =>
          i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        newCart = [...state.cart, { ...newItem, quantity: 1 }];
      }
      saveCartToStorage(newCart); // Save after change
      return { cart: newCart };
    }),

  removeFromCart: (id) =>
    set((state) => {
      const newCart = state.cart.filter((i) => i.id !== id);
      saveCartToStorage(newCart);
      return { cart: newCart };
    }),

  updateQuantity: (id, quantity) =>
    set((state) => {
      const newCart = state.cart.map((i) =>
        i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i
      );
      saveCartToStorage(newCart);
      return { cart: newCart };
    }),

  clearCart: () =>
    set(() => {
      saveCartToStorage([]);
      return { cart: [] };
    }),

  totalItems: () => get().cart.reduce((sum, i) => sum + i.quantity, 0),
  totalPrice: () => get().cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
}));