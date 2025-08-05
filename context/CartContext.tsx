"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { cartApi, Cart, CartItem } from "@/lib/cartApi";
import { useSession } from "next-auth/react";
import { useToast } from "./ToastContext";

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  itemCount: number;
  totalAmount: number;
  addToCart: (item: {
    packageId: string;
    packageType: "tour" | "transfer";
    selectedDate: string;
    selectedTime: string;
    adults: number;
    children: number;
  }) => Promise<boolean>;
  removeFromCart: (itemId: string) => Promise<boolean>;
  updateCartItem: (
    itemId: string,
    updates: {
      adults?: number;
      children?: number;
      selectedDate?: string;
      selectedTime?: string;
      pickupLocation?: string;
    }
  ) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();
  const { showToast } = useToast();

  // Memoize user data to prevent unnecessary re-renders
  const user = useMemo(() => session?.user, [session?.user]);
  const isAuthenticated = status === "authenticated";
  const userEmail = user?.email;

  // Calculate derived state
  const itemCount = cart?.items?.length || 0;
  const totalAmount =
    cart?.items?.reduce((total, item) => total + item.totalPrice, 0) || 0;

  const refreshCart = useCallback(async () => {
    if (!userEmail) return;

    setLoading(true);
    try {
      const cartData = await cartApi.getCart(userEmail);
      setCart(cartData);
    } catch (error) {
      console.error("Error refreshing cart:", error);
    } finally {
      setLoading(false);
    }
  }, [userEmail]);

  // Load cart when user changes
  useEffect(() => {
    if (isAuthenticated && userEmail) {
      refreshCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated, userEmail, refreshCart]);

  const addToCart = async (item: {
    packageId: string;
    packageType: "tour" | "transfer";
    selectedDate: string;
    selectedTime: string;
    adults: number;
    children: number;
  }): Promise<boolean> => {
    if (!isAuthenticated || !userEmail) {
      showToast({
        type: "error",
        title: "Authentication Required",
        message: "Please log in to add items to cart",
      });
      return false;
    }

    setLoading(true);
    try {
      const updatedCart = await cartApi.addToCart({
        userEmail: userEmail,
        ...item,
      });
      if (updatedCart) {
        setCart(updatedCart);
        showToast({
          type: "success",
          title: "Added to Cart",
          message: `Item has been added to your cart`,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error adding to cart:", error);
      showToast({
        type: "error",
        title: "Error",
        message: "Failed to add item to cart",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId: string): Promise<boolean> => {
    if (!userEmail) return false;

    setLoading(true);
    try {
      const updatedCart = await cartApi.removeFromCart(userEmail, itemId);
      setCart(updatedCart);
      showToast({
        type: "success",
        title: "Removed from Cart",
        message: "Item has been removed from your cart",
      });
      return true;
    } catch (error) {
      console.error("Error removing from cart:", error);
      showToast({
        type: "error",
        title: "Error",
        message: "Failed to remove item from cart",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (
    itemId: string,
    updates: {
      adults?: number;
      children?: number;
      selectedDate?: string;
      selectedTime?: string;
      pickupLocation?: string;
    }
  ): Promise<boolean> => {
    if (!userEmail) return false;

    setLoading(true);
    try {
      const updatedCart = await cartApi.updateCartItem(
        userEmail,
        itemId,
        updates
      );
      if (updatedCart) {
        setCart(updatedCart);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating cart item:", error);
      showToast({
        type: "error",
        title: "Error",
        message: "Failed to update cart item",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async (): Promise<boolean> => {
    if (!userEmail) return false;

    setLoading(true);
    try {
      await cartApi.clearCart(userEmail);
      setCart(null);
      showToast({
        type: "success",
        title: "Cart Cleared",
        message: "All items have been removed from your cart",
      });
      return true;
    } catch (error) {
      console.error("Error clearing cart:", error);
      showToast({
        type: "error",
        title: "Error",
        message: "Failed to clear cart",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        itemCount,
        totalAmount,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
