'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (item: Omit<CartItem, 'quantity'>, openDrawer?: boolean) => void;
  buyNow: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getSubtotal: () => number;
  getGST: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addToCart = (item: Omit<CartItem, 'quantity'>, openDrawer: boolean = true) => {
    setCartItems((prev) => {
      const existingItem = prev.find((i) => i.id === item.id && (!item.variant || i.variant === item.variant));
      if (existingItem) {
        return prev.map((i) =>
          i.id === item.id && (!item.variant || i.variant === item.variant) ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    if (openDrawer) {
      setIsOpen(true);
    }
  };

  const buyNow = (item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    // Clear existing cart and add only this item for Buy Now
    setCartItems([{ ...item, quantity }]);
    setIsOpen(false);
    // Redirect will be handled by the component using useRouter
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getGST = () => {
    return Math.round(getSubtotal() * 0.18);
  };

  const getTotalPrice = () => {
    return getSubtotal() + getGST();
  };

  const getItemCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isOpen,
        openCart,
        closeCart,
        addToCart,
        buyNow,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getSubtotal,
        getGST,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

