'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Check } from 'lucide-react';

interface CartAnimationContextType {
  triggerAnimation: (productName: string) => void;
}

const CartAnimationContext = createContext<CartAnimationContextType>({ triggerAnimation: () => {} });

export function useCartAnimation() {
  return useContext(CartAnimationContext);
}

export function CartAnimationProvider({ children }: { children: React.ReactNode }) {
  const [animation, setAnimation] = useState<{ id: number; name: string } | null>(null);

  const triggerAnimation = useCallback((productName: string) => {
    const id = Date.now();
    setAnimation({ id, name: productName });
    setTimeout(() => setAnimation(null), 2000);
  }, []);

  return (
    <CartAnimationContext.Provider value={{ triggerAnimation }}>
      {children}
      <AnimatePresence>
        {animation && (
          <motion.div
            key={animation.id}
            initial={{ y: 50, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="fixed bottom-24 right-4 z-50 bg-green-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 max-w-xs"
          >
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{animation.name}</p>
              <p className="text-xs text-green-200">Added to cart</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </CartAnimationContext.Provider>
  );
}
