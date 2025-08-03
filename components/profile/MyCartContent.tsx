"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  FiShoppingCart,
  FiTrash2,
  FiArrowRight,
  FiClock,
  FiMapPin,
  FiCalendar,
  FiUser,
  FiCreditCard,
  FiPackage,
} from "react-icons/fi";
import { FaRoute, FaCar } from "react-icons/fa";
import Link from "next/link";
import { cartApi, CartItem } from "@/lib/cartApi";

type CartItemDisplay = {
  id: string;
  type: "tour" | "transfer";
  title: string;
  price: number;
  date: string;
  time: string;
  adults: number;
  children?: number;
  details: {
    duration?: string;
    pickup?: string;
  };
};

export default function MyCartContent() {
  const { data: session } = useSession();
  const [cartItems, setCartItems] = useState<CartItemDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!session?.user?.email) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const cart = await cartApi.getCart(session.user.email);

        if (cart && cart.items && cart.items.length > 0) {
          // Transform API cart items to component format
          const transformedItems: CartItemDisplay[] = cart.items.map(
            (item: any, index: number) => {
              return {
                id: item.packageId || `cart-${index}`,
                type: item.packageType,
                title: `${item.packageType} Package`,
                price: item.price || 0,
                date: new Date().toISOString().split("T")[0], // Default date
                time: "09:00", // Default time
                adults: item.adults,
                children: item.children,
                details: {
                  pickup: item.pickupLocation || "To be confirmed",
                  duration: "Full day",
                },
              };
            }
          );
          setCartItems(transformedItems);
        } else {
          setCartItems([]);
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching cart items:", err);
        setError("Failed to load cart items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [session?.user?.email]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const BankCharge = (subtotal * 0.028).toFixed(2); // 2.8% bank charge
  const total = (subtotal + Number(BankCharge)).toFixed(2);

  const removeFromCart = async (id: string, index: number) => {
    if (!session?.user?.email) return;

    try {
      const success = await cartApi.removeFromCart(session.user.email, id);
      if (success) {
        setCartItems(cartItems.filter((item) => item.id !== id));
      } else {
        setError("Failed to remove item from cart. Please try again.");
      }
    } catch (err) {
      console.error("Error removing from cart:", err);
      setError("Failed to remove item from cart. Please try again.");
    }
  };

  return (
    <div
      id="mycart"
      className="max-w-6xl mx-auto p-4 md:py-6 md:px-0 font-poppins"
    >
      <div className="flex items-center gap-3 mb-6">
        <FiShoppingCart className="text-2xl text-primary_green" />
        <h1 className="text-2xl md:text-3xl font-bold text-title_black">
          My Cart
        </h1>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary_green"></div>
          <span className="ml-3 text-desc_gray">Loading your cart...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => {
                setError(null);
                window.location.reload();
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* No Session State */}
      {!session && !loading && (
        <div className="text-center py-12">
          <p className="text-desc_gray mb-4">
            Please sign in to view your cart.
          </p>
          <button
            onClick={() => (window.location.href = "/auth/login")}
            className="bg-primary_green text-white px-6 py-2 rounded-lg hover:bg-primary_green/90 transition-colors"
          >
            Sign In
          </button>
        </div>
      )}

      {/* Content - only show if we have session and no errors */}
      {!loading && !error && session && (
        <>
          {cartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row gap-4"
                  >
                    <div className="relative w-full sm:w-32 h-32 flex-shrink-0 bg-gradient-to-br from-primary_green to-green-600 rounded-lg flex items-center justify-center">
                      {item.type === "tour" ? (
                        <FaRoute className="text-3xl text-white" />
                      ) : (
                        <FaCar className="text-3xl text-white" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <FiPackage className="text-primary_green" />
                            <span className="text-sm text-primary_green font-medium uppercase">
                              {item.type}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-title_black">
                            {item.title}
                          </h3>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id, index)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <FiTrash2 />
                        </button>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-2 items-center text-sm text-desc_gray">
                        <div className="flex items-center gap-2">
                          <FiCalendar />
                          {new Date(item.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                        <div className="flex items-center text-desc_gray">
                          <FiClock className="mr-2" />
                          <span>{item.time}</span>
                        </div>
                        <div className="flex items-center text-desc_gray">
                          <FiUser className="mr-2" />
                          <span className="flex flex-col">
                            {item.adults}{" "}
                            {item.adults === 1 ? "adult" : "adults"},{" "}
                            {item.children}{" "}
                            {item.children === 1 ? "child" : "children"}
                          </span>
                        </div>

                        <p className="flex items-center gap-2">
                          <FiMapPin className="" />
                          {item.details.pickup}
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col justify-between sm:justify-center items-end sm:items-center gap-2">
                      <p className="text-lg font-bold text-primary_green">
                        RM {item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Checkout Summary */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit sticky top-6">
                <h2 className="text-xl font-bold text-title_black mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-desc_gray">Subtotal</span>
                    <span className="font-medium">RM {subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-desc_gray">Bank Charge</span>
                    <span className="font-medium">RM {BankCharge}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="text-xl font-bold text-primary_green">
                      RM {total}
                    </span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full bg-primary_green text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-primary_green/90 transition-colors"
                >
                  Checkout
                  <FiArrowRight />
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FiShoppingCart className="text-3xl text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-title_black mb-2">
                Your cart is empty
              </h3>
              <p className="text-desc_gray mb-6">
                Add tours or transfers to get started
              </p>
              <div className="flex gap-3 justify-center">
                <Link
                  href="/tours"
                  className="bg-primary_green text-white px-6 py-2 rounded-lg hover:bg-primary_green/90 transition-colors"
                >
                  Browse Tours
                </Link>
                <Link
                  href="/transfers"
                  className="border border-primary_green text-primary_green px-6 py-2 rounded-lg hover:bg-primary_green/5 transition-colors"
                >
                  View Transfers
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
