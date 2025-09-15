"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "@/components/ui/CheckoutForm";
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

  const [clientSecret, setClientSecret] = useState<string>("");
  const [paymentIntentId, setPaymentIntentId] = useState<string>("");
  const [loading, setLoading] = useState(false); // Changed to false - no initial loading
  const [paymentIntentCreated, setPaymentIntentCreated] = useState(false);
  const [error, setError] = useState<string>("");
  const [bookingData, setBookingData] = useState<any>(null);
  const [isCartBooking, setIsCartBooking] = useState(false);

  useEffect(() => {
    const validatePaymentData = async () => {
      try {
        console.log("[PAYMENT_PAGE] Validating payment data...");

        // Get payment data from URL params
        const bookingDataParam = searchParams.get("bookingData");
        const cartDataParam = searchParams.get("cartData");
        const contactInfoParam = searchParams.get("contactInfo");
        const amountParam = searchParams.get("amount");

        if (!amountParam) {
          throw new Error("Payment amount is missing");
        }

        if (cartDataParam && contactInfoParam) {
          // Cart booking flow
          console.log("[PAYMENT_PAGE] Processing cart booking payment");
          setIsCartBooking(true);

          const cartData = JSON.parse(decodeURIComponent(cartDataParam));
          const contactInfo = JSON.parse(decodeURIComponent(contactInfoParam));

          setBookingData({ cartData, contactInfo });
        } else if (bookingDataParam) {
          // Single booking flow
          console.log("[PAYMENT_PAGE] Processing single booking payment");
          setIsCartBooking(false);

          const bookingData = JSON.parse(decodeURIComponent(bookingDataParam));
          setBookingData(bookingData);
        } else {
          throw new Error("No booking data found");
        }
      } catch (error: any) {
        console.error("[PAYMENT_PAGE] Error validating payment data:", error);
        setError(error.message);
        showToast({
          type: "error",
          title: "Payment Error",
          message: error.message || "Invalid payment data",
        });
      }
    };

    validatePaymentData();
  }, [searchParams, showToast]);

  // Create payment intent only when user starts interacting with payment form
  const createPaymentIntent = async () => {
    if (paymentIntentCreated || loading) return;

    try {
      setLoading(true);
      console.log("[PAYMENT_PAGE] Creating payment intent...");

      const amountParam = searchParams.get("amount");
      if (!amountParam || !bookingData) {
        throw new Error("Payment data is incomplete");
      }

      const amount = parseFloat(amountParam);

      if (isCartBooking) {
        const response = await paymentApi.createCartPaymentIntent({
          amount,
          cartData: bookingData.cartData,
          contactInfo: bookingData.contactInfo,
        });

        if (response.success && response.data) {
          setClientSecret(response.data.clientSecret);
          setPaymentIntentId(response.data.paymentIntentId);
          setPaymentIntentCreated(true);
          console.log(
            "[PAYMENT_PAGE] Cart payment intent created:",
            response.data.paymentIntentId
          );
        } else {
          throw new Error(response.error || "Failed to create payment intent");
        }
      } else {
        const response = await paymentApi.createPaymentIntent({
          amount,
          bookingData,
        });

        if (response.success && response.data) {
          setClientSecret(response.data.clientSecret);
          setPaymentIntentId(response.data.paymentIntentId);
          setPaymentIntentCreated(true);
          console.log(
            "[PAYMENT_PAGE] Single payment intent created:",
            response.data.paymentIntentId
          );
        } else {
          throw new Error(response.error || "Failed to create payment intent");
        }
      }
    } catch (error: any) {
      console.error("[PAYMENT_PAGE] Error creating payment intent:", error);
      setError(error.message);
      showToast({
        type: "error",
        title: "Payment Error",
        message: error.message || "Failed to initialize payment",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntent: any) => {
    try {
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

      // Redirect to a support page or booking failed page
      router.push(
        `/booking/payment-success-booking-failed?paymentId=${paymentIntent.id}`
      );
    }
  };

  const handlePaymentError = (error: any) => {
    console.error("[PAYMENT_PAGE] Payment failed:", error);

    showToast({
      type: "error",
      title: "Payment Failed",
      message: error.message || "Payment was not successful",
    });

    // Redirect to payment failed page
    router.push(
      `/booking/payment-failed?error=${encodeURIComponent(
        error.message || "Payment failed"
      )}`
    );
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Setup Failed
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-primary_green text-white rounded-md hover:bg-primary_green/90"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary_green mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment data...</p>
        </div>
      </div>
    );
  }

  // Show start payment button before creating payment intent
  if (!paymentIntentCreated && !loading) {
    const amount = parseFloat(searchParams.get("amount") || "0");

    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Complete Your Payment
              </h1>
              <div className="flex items-center justify-center space-x-2 text-gray-600 mb-4">
                <span>Powered by</span>
                <Image
                  src="/images/stripe-seeklogo.png"
                  alt="Stripe"
                  width={60}
                  height={20}
                  className="h-5 w-12"
                />
              </div>
              <div className="text-3xl font-bold text-primary_green mb-4">
                RM {amount.toFixed(2)}
              </div>
              <p className="text-gray-600 text-sm mb-6">
                Click "Start Payment" to proceed with secure payment processing.
                Your payment will only be charged after you complete the card
                details.
              </p>
            </div>

            <button
              onClick={createPaymentIntent}
              className="w-full px-6 py-3 bg-primary_green text-white rounded-md hover:bg-primary_green/90 font-semibold transition-colors"
            >
              Start Payment Process
            </button>

            <button
              onClick={() => router.back()}
              className="w-full mt-3 px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary_green mx-auto mb-4"></div>
          <p className="text-gray-600">Setting up secure payment...</p>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Unable to initialize payment</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-6 py-3 bg-primary_green text-white rounded-md hover:bg-primary_green/90"
          >
            Go Back
          </button>
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

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
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
          </div>

          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              isCartBooking={isCartBooking}
            />
          </Elements>
        </div>
      </div>
    </div>
  );
}
