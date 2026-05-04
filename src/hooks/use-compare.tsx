"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { toast } from "sonner";
import { TranslatableText } from "@/types/api";

export interface CompareProduct {
  id: number;
  name: TranslatableText;
  image: string;
  brand: string;
  category: TranslatableText;
}

interface CompareContextType {
  selectedProducts: CompareProduct[];
  addProduct: (product: CompareProduct) => void;
  removeProduct: (id: number) => void;
  toggleProduct: (product: CompareProduct) => void;
  clearCompare: () => void;
  isCompared: (id: number) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider = ({ children }: { children: ReactNode }) => {
  const [selectedProducts, setSelectedProducts] = useState<CompareProduct[]>([]);

  const addProduct = useCallback((product: CompareProduct) => {
    setSelectedProducts((prev) => {
      if (prev.length >= 4) {
        toast.error("You can only compare up to 4 products at a time.");
        return prev;
      }
      if (prev.find((p) => p.id === product.id)) {
        return prev;
      }
      return [...prev, product];
    });
  }, []);

  const removeProduct = useCallback((id: number) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const toggleProduct = useCallback((product: CompareProduct) => {
    setSelectedProducts((prev) => {
      if (prev.find((p) => p.id === product.id)) {
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= 4) {
        toast.error("You can only compare up to 4 products at a time.", {
          description: "Please remove an existing product before adding a new one."
        });
        return prev;
      }
      return [...prev, product];
    });
  }, []);

  const clearCompare = useCallback(() => {
    setSelectedProducts([]);
  }, []);

  const isCompared = useCallback((id: number) => {
    return selectedProducts.some((p) => p.id === id);
  }, [selectedProducts]);

  return (
    <CompareContext.Provider
      value={{
        selectedProducts,
        addProduct,
        removeProduct,
        toggleProduct,
        clearCompare,
        isCompared,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
};
