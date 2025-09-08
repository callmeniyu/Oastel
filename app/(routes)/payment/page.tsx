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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [bookingData, setBookingData] = useState<any>(null);
  const [isCartBooking, setIsCartBooking] = useState(false);

  useEffect(() => {
    const initializePayment = async () => {
      try {
        console.log("[PAYMENT_PAGE] Initializing payment...");

        // Get payment data from URL params
        const bookingDataParam = searchParams.get("bookingData");
        const cartDataParam = searchParams.get("cartData");
        const contactInfoParam = searchParams.get("contactInfo");
        const amountParam = searchParams.get("amount");

        if (!amountParam) {
          throw new Error("Payment amount is missing");
        }

        const amount = parseFloat(amountParam);

        if (cartDataParam && contactInfoParam) {
          // Cart booking flow
          console.log("[PAYMENT_PAGE] Processing cart booking payment");
          setIsCartBooking(true);

          const cartData = JSON.parse(decodeURIComponent(cartDataParam));
          const contactInfo = JSON.parse(decodeURIComponent(contactInfoParam));

          setBookingData({ cartData, contactInfo });

          const response = await paymentApi.createCartPaymentIntent({
            amount,
            cartData,
            contactInfo,
          });

          if (response.success && response.data) {
            setClientSecret(response.data.clientSecret);
            setPaymentIntentId(response.data.paymentIntentId);
            console.log(
              "[PAYMENT_PAGE] Cart payment intent created:",
              response.data.paymentIntentId
            );
          } else {
            throw new Error(
              response.error || "Failed to create payment intent"
            );
          }
        } else if (bookingDataParam) {
          // Single booking flow
          console.log("[PAYMENT_PAGE] Processing single booking payment");
          setIsCartBooking(false);

          const bookingData = JSON.parse(decodeURIComponent(bookingDataParam));
          setBookingData(bookingData);

          const response = await paymentApi.createPaymentIntent({
            amount,
            bookingData,
          });

          if (response.success && response.data) {
            setClientSecret(response.data.clientSecret);
            setPaymentIntentId(response.data.paymentIntentId);
            console.log(
              "[PAYMENT_PAGE] Single payment intent created:",
              response.data.paymentIntentId
            );
          } else {
            throw new Error(
              response.error || "Failed to create payment intent"
            );
          }
        } else {
          throw new Error("No booking data found");
        }
      } catch (error: any) {
        console.error("[PAYMENT_PAGE] Error initializing payment:", error);
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

    initializePayment();
  }, [searchParams, showToast]);

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

  if (!clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Unable to initialize payment</p>
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
