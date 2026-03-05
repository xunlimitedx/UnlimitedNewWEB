'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CompareItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  category: string;
  brand: string;
  specifications: Record<string, string>;
  rating: number;
  stock: number;
}

interface CompareState {
  items: CompareItem[];
  addItem: (item: CompareItem) => void;
  removeItem: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  clearAll: () => void;
}

const MAX_COMPARE = 4;

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          if (state.items.length >= MAX_COMPARE) return state;
          if (state.items.some((i) => i.productId === item.productId)) return state;
          return { items: [...state.items, item] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      isInCompare: (productId) => {
        return get().items.some((i) => i.productId === productId);
      },

      clearAll: () => set({ items: [] }),
    }),
    {
      name: 'compare-storage',
    }
  )
);
