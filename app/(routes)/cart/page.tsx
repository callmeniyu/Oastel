"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  FiShoppingCart,
  FiTrash2,
  FiPlus,
  FiMinus,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUsers,
  FiArrowRight,
  FiArrowLeft,
} from "react-icons/fi";
import { cartApi, Cart, CartItem } from "@/lib/cartApi";

export default function CartPage() {
  const { data: session } = useSession();
  const { showToast } = useToast();
  const router = useRouter();

  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!session?.user?.email) {
      setLoading(false);
      return;
    }

    fetchCart();
  }, [session?.user?.email]);

  const fetchCart = async () => {
    if (!session?.user?.email) return;

    try {
      setLoading(true);
      const cartData = await cartApi.getCart(session.user.email);
      setCart(cartData);
    } catch (error) {
      console.error("Error fetching cart:", error);
      showToast({
        type: "error",
        title: "Error",
        message: "Failed to load cart. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateItemQuantity = async (
    itemId: string,
    type: "adults" | "children",
    change: number
  ) => {
    if (!session?.user?.email || !cart) return;

    const item = cart.items.find((item) => item._id === itemId);
    if (!item) return;

    const newValue = Math.max(0, item[type] + change);

    // Validate
    if (type === "adults" && (newValue < 1 || newValue > 20)) return;
    if (type === "children" && (newValue < 0 || newValue > 10)) return;

    setUpdatingItems((prev) => new Set(prev).add(itemId));

    try {
      const updatedCart = await cartApi.updateCartItem(
        session.user.email,
        itemId,
        { [type]: newValue }
      );
      setCart(updatedCart);
    } catch (error) {
      console.error("Error updating item:", error);
      showToast({
        type: "error",
        title: "Error",
        message: "Failed to update item quantity",
      });
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const removeItem = async (itemId: string) => {
    if (!session?.user?.email) return;

    setUpdatingItems((prev) => new Set(prev).add(itemId));

    try {
      const updatedCart = await cartApi.removeFromCart(
        session.user.email,
        itemId
      );
      setCart(updatedCart);
      showToast({
        type: "success",
        title: "Success",
        message: "Item removed from cart",
      });
    } catch (error) {
      console.error("Error removing item:", error);
      showToast({
        type: "error",
        title: "Error",
        message: "Failed to remove item from cart",
      });
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const clearCart = async () => {
    if (!session?.user?.email || !cart?.items.length) return;

    try {
      await cartApi.clearCart(session.user.email);
      setCart(null);
      showToast({
        type: "success",
        title: "Success",
        message: "Cart cleared successfully",
      });
    } catch (error) {
      console.error("Error clearing cart:", error);
      showToast({
        type: "error",
        title: "Error",
        message: "Failed to clear cart",
      });
    }
  };

  // Redirect if not authenticated
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-sm">
          <FiShoppingCart className="text-4xl text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Sign In Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please sign in to view your cart.
          </p>
          <Link
            href="/auth"
            className="bg-primary_green text-white px-6 py-2 rounded-lg hover:bg-primary_green/90 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary_green mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  const subtotal = cart?.totalAmount || 0;
  const serviceFee = subtotal * 0.028; // 2.8% service fee
  const total = subtotal + serviceFee;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <FiArrowLeft className="text-xl" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Shopping Cart
              </h1>
              <p className="text-gray-600">
                {cart?.items.length || 0} item
                {cart?.items.length !== 1 ? "s" : ""} in your cart
              </p>
            </div>
          </div>

          {cart && cart.items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Clear Cart
            </button>
          )}
        </div>

        {!cart?.items.length ? (
          // Empty Cart
          <div className="text-center py-16">
            <div className="bg-white rounded-xl shadow-sm p-12 max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiShoppingCart className="text-3xl text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-600 mb-8">
                Discover amazing tours and transfers to add to your cart
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/tours"
                  className="bg-primary_green text-white px-6 py-3 rounded-lg hover:bg-primary_green/90 transition-colors"
                >
                  Browse Tours
                </Link>
                <Link
                  href="/transfers"
                  className="border border-primary_green text-primary_green px-6 py-3 rounded-lg hover:bg-primary_green/5 transition-colors"
                >
                  View Transfers
                </Link>
              </div>
            </div>
          </div>
        ) : (
          // Cart with Items
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item: CartItem) => (
                <div
                  key={item._id}
                  className={`bg-white rounded-xl shadow-sm border p-6 transition-all ${
                    updatingItems.has(item._id) ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Package Image */}
                    <div className="relative w-full sm:w-48 h-32 bg-gradient-to-br from-primary_green to-green-600 rounded-lg overflow-hidden flex-shrink-0">
                      {item.packageImage ? (
                        <Image
                          src={item.packageImage}
                          alt={item.packageTitle}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-white">
                          <FiShoppingCart className="text-3xl" />
                        </div>
                      )}
                      <div className="absolute top-2 left-2">
                        <span className="bg-black/50 text-white text-xs px-2 py-1 rounded-full uppercase">
                          {item.packageType}
                        </span>
                      </div>
                    </div>

                    {/* Item Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {item.packageTitle}
                          </h3>
                          <p className="text-2xl font-bold text-primary_green">
                            RM {item.packagePrice}
                            <span className="text-sm font-normal text-gray-500">
                              {item.packageType === "tour"
                                ? " /person"
                                : " /group"}
                            </span>
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item._id)}
                          disabled={updatingItems.has(item._id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        >
                          <FiTrash2 className="text-lg" />
                        </button>
                      </div>

                      {/* Booking Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <FiCalendar className="text-primary_green" />
                          <span>
                            {new Date(item.selectedDate).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiClock className="text-primary_green" />
                          <span>{item.selectedTime}</span>
                        </div>
                        {item.pickupLocation && (
                          <div className="flex items-center gap-2 sm:col-span-2">
                            <FiMapPin className="text-primary_green" />
                            <span>{item.pickupLocation}</span>
                          </div>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {/* Adults */}
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">
                              Adults:
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() =>
                                  updateItemQuantity(item._id, "adults", -1)
                                }
                                disabled={
                                  item.adults <= 1 ||
                                  updatingItems.has(item._id)
                                }
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <FiMinus className="text-sm" />
                              </button>
                              <span className="w-8 text-center font-medium">
                                {item.adults}
                              </span>
                              <button
                                onClick={() =>
                                  updateItemQuantity(item._id, "adults", 1)
                                }
                                disabled={
                                  item.adults >= 20 ||
                                  updatingItems.has(item._id)
                                }
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <FiPlus className="text-sm" />
                              </button>
                            </div>
                          </div>

                          {/* Children */}
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">
                              Children:
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() =>
                                  updateItemQuantity(item._id, "children", -1)
                                }
                                disabled={
                                  item.children <= 0 ||
                                  updatingItems.has(item._id)
                                }
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <FiMinus className="text-sm" />
                              </button>
                              <span className="w-8 text-center font-medium">
                                {item.children}
                              </span>
                              <button
                                onClick={() =>
                                  updateItemQuantity(item._id, "children", 1)
                                }
                                disabled={
                                  item.children >= 10 ||
                                  updatingItems.has(item._id)
                                }
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <FiPlus className="text-sm" />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            RM {item.totalPrice.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>RM {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Service Fee (2.8%)</span>
                    <span>RM {serviceFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-semibold text-gray-900">
                      <span>Total</span>
                      <span>RM {total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/booking/user-info"
                  className="w-full bg-primary_green text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-primary_green/90 transition-colors font-medium"
                >
                  Proceed to Checkout
                  <FiArrowRight />
                </Link>

                <div className="mt-4 text-center">
                  <Link
                    href="/tours"
                    className="text-primary_green hover:underline text-sm"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
