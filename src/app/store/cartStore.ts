// src/app/store/cartStore.ts
import { useEffect } from 'react';
import { create } from 'zustand';
import { useAuth } from '@/hooks/useAuth';

// Helper to get user-specific storage key
const getCartStorageKey = (userId: string | null | undefined) => {
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

interface CartItem {
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
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => {
  return {
    cart: [],
    userId: null,

    setUserId: (userId) => set({ userId }),

    addToCart: (newItem) =>
      set((state) => {
        const existing = state.cart.find((i) => i.id === newItem.id);
        let newCart;
        if (existing) {
          newCart = state.cart.map((i) =>
            i.id === newItem.id ? { ...i, quantity: i.quantity + (newItem.quantity || 1) } : i
          );
        } else {
          newCart = [...state.cart, { ...newItem, quantity: newItem.quantity || 1 }];
        }
        // Save to localStorage immediately
        saveCartToStorage(newCart, state.userId);
        return { cart: newCart };
      }),

    removeFromCart: (id) =>
      set((state) => {
        const newCart = state.cart.filter((item) => item.id !== id);
        // Save to localStorage immediately
        saveCartToStorage(newCart, state.userId);
        return { cart: newCart };
      }),

    updateQuantity: (id, quantity) =>
      set((state) => {
        if (quantity < 1) return state;
        const newCart = state.cart.map((i) =>
          i.id === id ? { ...i, quantity } : i
        );
        // Save to localStorage immediately
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
  };
});

// Hook to sync cart with localStorage + user
export const useSyncedCart = () => {
  const { user } = useAuth();
  const setUserId = useCartStore((state) => state.setUserId);

  useEffect(() => {
    // Update userId in store
    setUserId(user?.uid);

    if (!user) {
      // Guest mode or logged out → load guest cart
      const guestCart = loadCartFromStorage(null);
      useCartStore.setState({ cart: guestCart });
      return;
    }

    // Logged in user → load their cart
    const userCart = loadCartFromStorage(user.uid);
    useCartStore.setState({ cart: userCart });

    // Optional: merge guest cart with user cart on login
    const guestCart = loadCartFromStorage(null);
    if (guestCart.length > 0) {
      // Merge guest cart items into user cart
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
      // Clear guest cart after merging
      localStorage.removeItem(getCartStorageKey(null));
    }
  }, [user?.uid, setUserId]);

  // Clear cart on logout
  const resetOnLogout = () => {
    const currentUserId = useCartStore.getState().userId;
    useCartStore.getState().clearCart();
    localStorage.removeItem(getCartStorageKey(currentUserId));
  };

  return { resetOnLogout };
};