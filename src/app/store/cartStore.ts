// src/app/store/cartStore.ts
import { useEffect } from 'react';
import { create } from 'zustand';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

// Types
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface CartState {
  cart: CartItem[];
  userId: string | null | undefined;
  setUserId: (userId: string | null | undefined) => void;
  addToCart: (item: CartItem) => void;
  addMultipleToCart: (items: CartItem[]) => void; // ← NEW: for Reorder feature
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

// Helper to get user-specific storage key
const getCartStorageKey = (userId: string | null | undefined): string => {
  return userId ? `freshfastfoodhub-cart-${userId}` : 'freshfastfoodhub-cart-guest';
};

// Load cart from localStorage
const loadCartFromStorage = (userId: string | null | undefined): CartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const key = getCartStorageKey(userId);
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Failed to load cart from storage:', e);
    return [];
  }
};

// Save cart to localStorage
const saveCartToStorage = (cart: CartItem[], userId: string | null | undefined) => {
  if (typeof window === 'undefined') return;
  try {
    const key = getCartStorageKey(userId);
    localStorage.setItem(key, JSON.stringify(cart));
  } catch (e) {
    console.error('Failed to save cart to storage:', e);
  }
};

// Create the store
export const useCartStore = create<CartState>((set, get) => ({
  cart: [],
  userId: null,

  setUserId: (userId) => set({ userId }),

  addToCart: (newItem) =>
    set((state) => {
      const existingIndex = state.cart.findIndex((i) => i.id === newItem.id);
      let newCart: CartItem[];

      if (existingIndex !== -1) {
        // Update quantity if item exists
        newCart = state.cart.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + (newItem.quantity || 1) }
            : item
        );
      } else {
        // Add new item
        newCart = [...state.cart, { ...newItem, quantity: newItem.quantity || 1 }];
      }

      saveCartToStorage(newCart, state.userId);
      return { cart: newCart };
    }),

  // NEW: Add multiple items at once (used for Reorder)
  addMultipleToCart: (items) =>
    set((state) => {
      let newCart = [...state.cart];

      items.forEach((newItem) => {
        const existingIndex = newCart.findIndex((i) => i.id === newItem.id);
        if (existingIndex !== -1) {
          newCart[existingIndex] = {
            ...newCart[existingIndex],
            quantity: newCart[existingIndex].quantity + (newItem.quantity || 1),
          };
        } else {
          newCart.push({ ...newItem, quantity: newItem.quantity || 1 });
        }
      });

      saveCartToStorage(newCart, state.userId);
      return { cart: newCart };
    }),

  removeFromCart: (id) =>
    set((state) => {
      const newCart = state.cart.filter((item) => item.id !== id);
      saveCartToStorage(newCart, state.userId);
      return { cart: newCart };
    }),

  updateQuantity: (id, quantity) =>
    set((state) => {
      if (quantity < 1) return state;
      const newCart = state.cart.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );
      saveCartToStorage(newCart, state.userId);
      return { cart: newCart };
    }),

  clearCart: () =>
    set((state) => {
      saveCartToStorage([], state.userId);
      return { cart: [] };
    }),

  totalItems: () => get().cart.reduce((sum, i) => sum + i.quantity, 0),

  totalPrice: () => get().cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
}));

// Hook to sync cart with localStorage and handle user login/logout
export const useSyncedCart = () => {
  const { user } = useAuth();
  const setUserId = useCartStore((state) => state.setUserId);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    // Update userId in store
    setUserId(user?.uid);

    if (!user?.uid) {
      // Guest mode or logged out
      const guestCart = loadCartFromStorage(null);
      useCartStore.setState({ cart: guestCart });
      return;
    }

    // Logged-in user: load their cart
    const userCart = loadCartFromStorage(user.uid);
    useCartStore.setState({ cart: userCart });

    // Merge guest cart into user cart on login
    const guestCart = loadCartFromStorage(null);
    if (guestCart.length > 0) {
      const mergedCart = [...userCart];

      guestCart.forEach((guestItem) => {
        const existing = mergedCart.find((i) => i.id === guestItem.id);
        if (existing) {
          existing.quantity += guestItem.quantity;
        } else {
          mergedCart.push(guestItem);
        }
      });

      useCartStore.setState({ cart: mergedCart });
      saveCartToStorage(mergedCart, user.uid);
      // Clean up guest cart
      localStorage.removeItem(getCartStorageKey(null));
      toast.success("Guest cart items merged into your account!", { duration: 4000 });
    }
  }, [user?.uid, setUserId]);

  // Clear cart on logout
  const resetOnLogout = () => {
    const currentUserId = useCartStore.getState().userId;
    clearCart();
    localStorage.removeItem(getCartStorageKey(currentUserId));
  };

  return { resetOnLogout };
};