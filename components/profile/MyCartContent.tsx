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
import { cartApi, CartItem, Cart } from "@/lib/cartApi";
import { useCart } from "@/context/CartContext";
import Image from "next/image";

export default function MyCartContent() {
  const { data: session } = useSession();
  const { cart, loading, itemCount, totalAmount, removeFromCart, clearCart } =
    useCart();
  const [error, setError] = useState<string | null>(null);

  // No need for manual cart refresh - CartContext handles this automatically

  const handleRemoveItem = async (itemId: string) => {
    if (confirm("Are you sure you want to remove this item from your cart?")) {
      try {
        await removeFromCart(itemId);
      } catch (error) {
        console.error("Error removing item:", error);
        setError("Failed to remove item. Please try again.");
      }
    }
  };

  const handleClearCart = async () => {
    if (confirm("Are you sure you want to clear your entire cart?")) {
      try {
        await clearCart();
      } catch (error) {
        console.error("Error clearing cart:", error);
        setError("Failed to clear cart. Please try again.");
      }
    }
  };

  // Calculate totals
  const subtotal = totalAmount;
  const bankCharge = (subtotal * 0.028).toFixed(2); // 2.8% bank charge
  const total = (subtotal + Number(bankCharge)).toFixed(2);

  return (
    <div
      id="mycart"
      className="max-w-6xl mx-auto p-4 md:py-6 md:px-0 font-poppins"
    >
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <FiShoppingCart className="text-2xl text-primary_green" />
          <h1 className="text-2xl md:text-3xl font-bold text-title_black">
            My Cart ({itemCount} items)
          </h1>
        </div>
        {cart && cart.items.length > 0 && (
          <button
            onClick={handleClearCart}
            className="text-red-600 hover:text-red-800 text-sm flex items-center gap-2 px-3 py-1 rounded border border-red-200 hover:bg-red-50 transition-colors"
          >
            <FiTrash2 className="text-sm" />
            Clear Cart
          </button>
        )}
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
          {cart && cart.items.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.items.map((item: CartItem) => (
                  <div
                    key={item._id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row gap-4"
                  >
                    <div className="relative w-full sm:w-32 h-32 flex-shrink-0">
                      {item.packageImage ? (
                        <Image
                          src={item.packageImage}
                          alt={item.packageTitle}
                          fill
                          className="object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary_green to-green-600 rounded-lg flex items-center justify-center">
                          {item.packageType === "tour" ? (
                            <FaRoute className="text-3xl text-white" />
                          ) : (
                            <FaCar className="text-3xl text-white" />
                          )}
                        </div>
                      )}
                      <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                        {item.packageType.charAt(0).toUpperCase() +
                          item.packageType.slice(1)}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <FiPackage className="text-primary_green" />
                            <span className="text-sm text-primary_green font-medium uppercase">
                              {item.packageType}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-title_black">
                            {item.packageTitle}
                          </h3>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item._id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                          title="Remove item"
                        >
                          <FiTrash2 />
                        </button>
                      </div>

                      {/* Booking Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-desc_gray mb-4">
                        <div className="flex items-center gap-2">
                          <FiCalendar />
                          {new Date(item.selectedDate).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <FiClock />
                          {item.selectedTime}
                        </div>
                        {item.pickupLocation && (
                          <div className="flex items-start gap-2 sm:col-span-2">
                            <FiMapPin className="mt-1 flex-shrink-0" />
                            <div className="flex-1">
                              <span className="text-sm font-medium text-desc_gray">
                                Pickup Location:
                              </span>
                              <div
                                className="text-sm text-title_black mt-1"
                                dangerouslySetInnerHTML={{
                                  __html: item.pickupLocation.includes("<")
                                    ? item.pickupLocation
                                    : `<p>${item.pickupLocation}</p>`,
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Guest Information */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          {/* Adults */}
                          <div className="flex items-center gap-2">
                            <FiUser className="text-desc_gray" />
                            <span className="text-sm text-desc_gray">
                              Adults:
                            </span>
                            <span className="text-sm font-medium text-title_black">
                              {item.adults}
                            </span>
                          </div>

                          {/* Children */}
                          <div className="flex items-center gap-2">
                            <FiUser className="text-desc_gray" />
                            <span className="text-sm text-desc_gray">
                              Children:
                            </span>
                            <span className="text-sm font-medium text-title_black">
                              {item.children}
                            </span>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary_green">
                            RM {item.totalPrice.toFixed(2)}
                          </div>
                        </div>
                      </div>
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
                    <span className="font-medium">
                      RM {subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-desc_gray">Bank Charge</span>
                    <span className="font-medium">RM {bankCharge}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="text-xl font-bold text-primary_green">
                      RM {total}
                    </span>
                  </div>
                </div>

                <Link
                  href="/cart/checkout"
                  className="w-full bg-primary_green text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-primary_green/90 transition-colors mb-3"
                >
                  Proceed to Checkout
                  <FiCreditCard />
                </Link>

                <button
                  onClick={handleClearCart}
                  className="w-full border border-red-500 text-red-500 py-3 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
                >
                  Clear Cart
                  <FiTrash2 />
                </button>
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
