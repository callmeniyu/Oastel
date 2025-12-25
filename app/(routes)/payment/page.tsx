"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import DeferredCheckoutForm from "@/components/ui/DeferredCheckoutForm";
import { useToast } from "@/context/ToastContext";
import { paymentApi } from "@/lib/paymentApi";
import Image from "next/image";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [bookingData, setBookingData] = useState<any>(null);
  const [isCartBooking, setIsCartBooking] = useState(false);
  const [isNavigatingAway, setIsNavigatingAway] = useState(false);
  const [isConfirmingBooking, setIsConfirmingBooking] = useState(false);

  useEffect(() => {
    const validatePaymentData = async () => {
      // Don't re-validate if we're already navigating away or confirming booking
      if (isNavigatingAway || isConfirmingBooking) {
        console.log(
          "[PAYMENT_PAGE] Skipping validation - navigation in progress"
        );
        return;
      }

      try {
        console.log("[PAYMENT_PAGE] Validating payment data...");

        // Strategy 1: Check sessionStorage (New Approach)
        const storedData = sessionStorage.getItem("paymentPendingData");

        if (storedData) {
          console.log("[PAYMENT_PAGE] Found pending payment data in storage");
          const parsedData = JSON.parse(storedData);

          if (parsedData.type === "cart") {
            console.log("[PAYMENT_PAGE] Processing cart booking payment");
            setIsCartBooking(true);
            setBookingData({
              cartData: parsedData.cartData,
              contactInfo: parsedData.contactInfo,
              amount: parsedData.amount,
            });
          } else {
            console.log("[PAYMENT_PAGE] Processing single booking payment");
            setIsCartBooking(false);
            setBookingData(parsedData);
          }
          setLoading(false);
          return;
        }

        // Strategy 2: Check URL Params (Legacy/Fallback)
        const bookingDataParam = searchParams.get("bookingData");
        const cartDataParam = searchParams.get("cartData");
        const contactInfoParam = searchParams.get("contactInfo");
        const amountParam = searchParams.get("amount");

        if (amountParam) {
          if (cartDataParam && contactInfoParam) {
            // Cart booking flow
            console.log(
              "[PAYMENT_PAGE] Processing cart booking payment from URL"
            );
            setIsCartBooking(true);

            const cartData = JSON.parse(decodeURIComponent(cartDataParam));
            const contactInfo = JSON.parse(
              decodeURIComponent(contactInfoParam)
            );

            setBookingData({
              cartData,
              contactInfo,
              amount: parseFloat(amountParam),
            });
          } else if (bookingDataParam) {
            // Single booking flow
            console.log(
              "[PAYMENT_PAGE] Processing single booking payment from URL"
            );
            setIsCartBooking(false);

            const parsedBookingData = JSON.parse(
              decodeURIComponent(bookingDataParam)
            );
            setBookingData({
              ...parsedBookingData,
              amount: parseFloat(amountParam),
            });
          } else {
            throw new Error("Missing booking data");
          }
        } else {
          // If no storage and no URL params, it's an error
          throw new Error("No payment data found");
        }

        console.log("[PAYMENT_PAGE] Payment data validated successfully");
      } catch (error: any) {
        console.error("[PAYMENT_PAGE] Error validating payment data:", error);
        setError(error.message);
        showToast({
          type: "error",
          title: "Payment Error",
          message: error.message || "Invalid payment data",
        });
      } finally {
        setLoading(false);
      }
    };

    validatePaymentData();
  }, [searchParams, showToast, isNavigatingAway, isConfirmingBooking]);

  // Create payment intent on demand when user submits form
  const createPaymentIntentOnSubmit = async (): Promise<string> => {
    try {
      console.log("[PAYMENT_PAGE] Creating payment intent on form submit...");

      if (!bookingData) {
        throw new Error("Payment data is incomplete");
      }

      if (isCartBooking) {
        const response = await paymentApi.createCartPaymentIntent({
          amount: bookingData.amount,
          cartData: bookingData.cartData,
          contactInfo: bookingData.contactInfo,
        });

        if (response.success && response.data) {
          console.log(
            "[PAYMENT_PAGE] Cart payment intent created on submit:",
            response.data.paymentIntentId
          );
          return response.data.clientSecret;
        } else {
          throw new Error(response.error || "Failed to create payment intent");
        }
      } else {
        const response = await paymentApi.createPaymentIntent({
          amount: bookingData.amount,
          bookingData,
        });

        if (response.success && response.data) {
          console.log(
            "[PAYMENT_PAGE] Single payment intent created on submit:",
            response.data.paymentIntentId
          );
          return response.data.clientSecret;
        } else {
          throw new Error(response.error || "Failed to create payment intent");
        }
      }
    } catch (error: any) {
      console.error(
        "[PAYMENT_PAGE] Error creating payment intent on submit:",
        error
      );
      throw error;
    }
  };

  // Handle explicit navigation away (Go Back button)
  const handleGoBack = async () => {
    setIsNavigatingAway(true);
    router.back();
  };

  const handlePaymentSuccess = async (paymentIntent: any) => {
    try {
      setIsNavigatingAway(true);
      setIsConfirmingBooking(true);

      console.log(
        "[PAYMENT_PAGE] Payment successful, confirming...",
        paymentIntent.id
      );

      // Confirm payment on server and create booking
      const response = await paymentApi.confirmPayment({
        paymentIntentId: paymentIntent.id,
        bookingData: bookingData,
      });

      if (response.success && response.data) {
        console.log(
          "[PAYMENT_PAGE] Booking created successfully:",
          response.data.bookingIds
        );

        // Clear payment data from storage on success
        sessionStorage.removeItem("paymentPendingData");

        showToast({
          type: "success",
          title: "Payment Successful!",
          message: isCartBooking
            ? `${response.data.totalBookings} bookings created successfully`
            : "Your booking has been confirmed",
        });

        // Redirect to confirmation page
        if (isCartBooking) {
          router.push(
            `/booking/cart-confirmation?bookings=${response.data.bookingIds.join(
              ","
            )}`
          );
        } else {
          router.push(`/booking/confirmation/${response.data.bookingIds[0]}`);
        }
      } else {
        throw new Error(
          response.error || "Failed to create booking after payment"
        );
      }
    } catch (error: any) {
      console.error("[PAYMENT_PAGE] Error after payment success:", error);

      showToast({
        type: "error",
        title: "Booking Error",
        message:
          "Payment was successful but booking creation failed. Please contact support.",
      });

      router.push("/contact");
    } finally {
      setIsConfirmingBooking(false);
      sessionStorage.removeItem("paymentPendingData");
    }
  };

  const handlePaymentError = (error: any) => {
    console.error("[PAYMENT_PAGE] Payment error:", error);
    showToast({
      type: "error",
      title: "Payment Failed",
      message: error.message || "Payment failed. Please try again.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary_green mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Payment Error
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleGoBack}
            className="px-6 py-3 bg-primary_green text-white rounded-md hover:bg-primary_green/90"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Additional safety check - don't render until bookingData is available
  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary_green mx-auto mb-4"></div>
          <p className="text-gray-600">Preparing payment...</p>
        </div>
      </div>
    );
  }

  const appearance = {
    theme: "stripe" as const,
    variables: {
      colorPrimary: "#10B981", // primary_green
    },
  };

  // Use Elements without client secret - payment intent will be created on submit
  // bookingData is guaranteed to exist here due to early return check above
  const options = {
    mode: "payment" as const,
    amount: Math.round(bookingData.amount * 100), // Convert to cents
    currency: "myr",
    appearance,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {/* Full-screen overlay during booking confirmation */}
      {isConfirmingBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center shadow-2xl">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary_green mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ✅ Payment Successful!
            </h2>
            <h3 className="text-lg font-semibold text-yellow-700 mb-3">
              Creating Your Booking...
            </h3>
            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-md p-4 mb-4">
              <p className="text-sm font-bold text-yellow-900 mb-2">
                ⚠️ IMPORTANT: DO NOT CLOSE THIS WINDOW
              </p>
              <p className="text-xs text-yellow-800">
                Your payment was successful. We are now confirming your booking
                and preparing your confirmation email.
              </p>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <div className="animate-pulse">⏳</div>
              <span>Please wait a moment...</span>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Secure Payment
            </h1>
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <span>Powered by</span>
              <Image
                src="/images/stripe-seeklogo.png"
                alt="Stripe"
                width={60}
                height={20}
                className="h-5 w-12"
              />
            </div>
            <div className="text-3xl font-bold text-primary_green mt-4">
              RM {bookingData.amount.toFixed(2)}
            </div>
          </div>

          <Elements options={options} stripe={stripePromise}>
            <DeferredCheckoutForm
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              isCartBooking={isCartBooking}
              createPaymentIntentOnSubmit={createPaymentIntentOnSubmit}
            />
          </Elements>

          <button
            onClick={handleGoBack}
            className="w-full mt-4 px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
