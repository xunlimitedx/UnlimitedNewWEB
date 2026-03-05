'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RecentlyViewedItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  viewedAt: string;
}

interface RecentlyViewedState {
  items: RecentlyViewedItem[];
  addItem: (item: Omit<RecentlyViewedItem, 'viewedAt'>) => void;
  clearAll: () => void;
}

const MAX_ITEMS = 12;

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const filtered = state.items.filter((i) => i.productId !== item.productId);
          return {
            items: [{ ...item, viewedAt: new Date().toISOString() }, ...filtered].slice(0, MAX_ITEMS),
          };
        });
      },

      clearAll: () => set({ items: [] }),
    }),
    {
      name: 'recently-viewed-storage',
    }
  )
);
