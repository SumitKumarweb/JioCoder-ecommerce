'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface CompareProduct {
  id: string;
  name: string;
  image: string;
  price: string;
}

interface CompareContextType {
  compareProducts: CompareProduct[];
  addToCompare: (product: CompareProduct) => void;
  removeFromCompare: (id: string) => void;
  clearAll: () => void;
  isInCompare: (id: string) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareProducts, setCompareProducts] = useState<CompareProduct[]>([]);

  const addToCompare = (product: CompareProduct) => {
    setCompareProducts((prev) => {
      if (prev.find((p) => p.id === product.id)) {
        return prev;
      }
      if (prev.length >= 4) {
        return prev;
      }
      return [...prev, product];
    });
  };

  const removeFromCompare = (id: string) => {
    setCompareProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const clearAll = () => {
    setCompareProducts([]);
  };

  const isInCompare = (id: string) => {
    return compareProducts.some((p) => p.id === id);
  };

  return (
    <CompareContext.Provider
      value={{
        compareProducts,
        addToCompare,
        removeFromCompare,
        clearAll,
        isInCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}

