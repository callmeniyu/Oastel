"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import { useCart } from "@/context/CartContext";
import {
  FiShoppingCart,
  FiClock,
  FiCalendar,
  FiUser,
  FiMapPin,
  FiAlertTriangle,
  FiCreditCard,
  FiPackage,
  FiArrowLeft,
  FiTrash2,
} from "react-icons/fi";
import { FaRoute, FaCar } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showToast } = useToast();
  const { cart, loading, removeFromCart, clearCart } = useCart();

  useEffect(() => {
    // Wait for session to load
    if (status === "loading") return;

    if (status === "unauthenticated" || !session?.user?.email) {
      router.push("/auth/login");
      return;
    }
  }, [session, status, router]);

  const handleRemoveItem = async (itemId: string) => {
    if (confirm("Are you sure you want to remove this item from your cart?")) {
      try {
        await removeFromCart(itemId);
      } catch (error) {
        console.error("Error removing item:", error);
        showToast({
          type: "error",
          title: "Error",
          message: "Failed to remove item. Please try again.",
        });
      }
    }
  };

  const handleClearCart = async () => {
    if (confirm("Are you sure you want to clear your entire cart?")) {
      try {
        await clearCart();
      } catch (error) {
        console.error("Error clearing cart:", error);
        showToast({
          type: "error",
          title: "Error",
          message: "Failed to clear cart. Please try again.",
        });
      }
    }
  };

  const isExpired = (dateStr: string) => {
    const selectedDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate < today;
  };

  const validItems =
    cart?.items?.filter((item) => !isExpired(item.selectedDate)) || [];
  const expiredItems =
    cart?.items?.filter((item) => isExpired(item.selectedDate)) || [];
  const subtotal = validItems.reduce(
    (total, item) => total + item.totalPrice,
    0
  );
  const bankCharge = subtotal * 0.028;
  const grandTotal = subtotal + bankCharge;

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary_green mx-auto"></div>
          <p className="mt-4 text-desc_gray">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <FiShoppingCart className="mx-auto text-6xl text-desc_gray mb-4" />
            <h2 className="text-2xl font-semibold text-title_black mb-2">
              Your cart is empty
            </h2>
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="text-primary_green hover:text-primary_green/80 flex items-center gap-2"
          >
            <FiArrowLeft />
            Continue Shopping
          </Link>
          <h1 className="text-3xl font-bold text-title_black">Shopping Cart</h1>
        </div>

        {/* Alerts for expired items */}
        {expiredItems.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-yellow-800">
              <FiAlertTriangle />
              <h3 className="font-medium">
                {expiredItems.length} item(s) have expired dates
              </h3>
            </div>
            <p className="text-yellow-700 text-sm mt-1">
              These items cannot be booked as their selected dates have already
              passed.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-title_black">
                Your Items ({cart.items.length})
              </h2>
              {cart.items.length > 0 && (
                <button
                  onClick={handleClearCart}
                  className="text-red-600 hover:text-red-800 flex items-center gap-2 text-sm"
                >
                  <FiTrash2 />
                  Clear Cart
                </button>
              )}
            </div>

            {cart.items.map((item: any) => (
              <div
                key={item._id}
                className={`bg-white rounded-xl shadow-sm border p-4 ${
                  isExpired(item.selectedDate)
                    ? "border-red-200 bg-red-50/30"
                    : "border-gray-100"
                }`}
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Item Image */}
                  <div className="relative w-full sm:w-24 h-24 flex-shrink-0">
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
                          <FaRoute className="text-xl text-white" />
                        ) : (
                          <FaCar className="text-xl text-white" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <FiPackage className="text-primary_green" />
                          <span className="text-sm text-primary_green font-medium uppercase">
                            {item.packageType}
                          </span>
                          {isExpired(item.selectedDate) && (
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                              Expired
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-title_black">
                          {item.packageTitle}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-lg font-bold text-primary_green">
                          RM {item.totalPrice.toFixed(2)}
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item._id)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="grid grid-cols-2 gap-2 text-sm text-desc_gray">
                      <div className="flex items-center gap-2">
                        <FiCalendar />
                        {new Date(item.selectedDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <FiClock />
                        {item.selectedTime}
                      </div>
                      <div className="flex items-center gap-2">
                        <FiUser />
                        {item.adults} Adults, {item.children} Children
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit sticky top-6">
            <h2 className="text-xl font-bold text-title_black mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-desc_gray">Valid Items</span>
                <span className="font-medium">{validItems.length}</span>
              </div>
              {expiredItems.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-desc_gray">Expired Items</span>
                  <span className="font-medium text-red-600">
                    {expiredItems.length}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-desc_gray">Subtotal</span>
                <span className="font-medium">RM {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-desc_gray">Bank Charge (2.8%)</span>
                <span className="font-medium">RM {bankCharge.toFixed(2)}</span>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold text-primary_green">
                  RM {grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <Link
              href="/booking/user-info"
              className={`w-full bg-primary_green text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-primary_green/90 transition-colors ${
                validItems.length === 0
                  ? "opacity-50 cursor-not-allowed pointer-events-none"
                  : ""
              }`}
            >
              <FiCreditCard />
              Proceed to Checkout ({validItems.length} item(s))
            </Link>

            <p className="text-xs text-desc_gray mt-3 text-center">
              Only valid items will be processed. Expired items will be skipped.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
