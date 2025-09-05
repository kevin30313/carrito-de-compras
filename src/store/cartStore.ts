import { create } from 'zustand';
import { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  total: number;
  itemCount: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  closeCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,
  total: 0,
  itemCount: 0,

  addItem: (product: Product, quantity = 1) => {
    const { items } = get();
    const existingItem = items.find(item => item.product.id === product.id);

    if (existingItem) {
      get().updateQuantity(product.id, existingItem.quantity + quantity);
    } else {
      const newItems = [...items, { product, quantity }];
      const total = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
      
      set({ items: newItems, total, itemCount });
    }
  },

  removeItem: (productId: string) => {
    const newItems = get().items.filter(item => item.product.id !== productId);
    const total = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
    
    set({ items: newItems, total, itemCount });
  },

  updateQuantity: (productId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }

    const newItems = get().items.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    );
    const total = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
    
    set({ items: newItems, total, itemCount });
  },

  clearCart: () => set({ items: [], total: 0, itemCount: 0 }),
  
  toggleCart: () => set(state => ({ isOpen: !state.isOpen })),
  
  closeCart: () => set({ isOpen: false })
}));