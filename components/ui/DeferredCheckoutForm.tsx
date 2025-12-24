"use client";

import { useState, useEffect } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import Image from "next/image";

interface DeferredCheckoutFormProps {
  onSuccess: (paymentIntent: any) => void;
  onError: (error: any) => void;
  isCartBooking: boolean;
  createPaymentIntentOnSubmit: () => Promise<string>;
}

export default function DeferredCheckoutForm({
  onSuccess,
  onError,
  isCartBooking,
  createPaymentIntentOnSubmit,
}: DeferredCheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isPaymentElementReady, setIsPaymentElementReady] = useState(false);
  const [isPaymentInProgress, setIsPaymentInProgress] = useState(false);

  // Track when PaymentElement is fully loaded and ready
  useEffect(() => {
    if (!elements) return;

    // Listen for when the PaymentElement is fully loaded
    const paymentElement = elements.getElement("payment");
    if (paymentElement) {
      paymentElement.on("ready", () => {
        console.log("[DEFERRED_CHECKOUT] PaymentElement is ready");
        setIsPaymentElementReady(true);
      });
    }
  }, [elements]);

  // Prevent user from closing page during payment processing
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isPaymentInProgress) {
        e.preventDefault();
        e.returnValue =
          "Your payment is being processed. Are you sure you want to leave?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isPaymentInProgress]);

  const handleSubmit = async (event?: React.FormEvent) => {
    // If invoked as a submit handler, prevent the default browser submit.
    if (event && typeof event.preventDefault === "function") {
      event.preventDefault();
    }

    if (!stripe || !elements) {
      console.error("[DEFERRED_CHECKOUT] Stripe not loaded");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setIsPaymentInProgress(true);

    try {
      // Validate the Elements immediately as soon as the customer presses Pay.
      // This must be called before any asynchronous work (like creating a PaymentIntent)
      // according to Stripe's deferred flow requirements.
      const { error: submitError } = await elements.submit();
      if (submitError) {
        console.error(
          "[DEFERRED_CHECKOUT] Form validation error:",
          submitError
        );
        setErrorMessage(
          submitError.message || "Please fill in all required fields"
        );
        setLoading(false);
        onError(submitError);
        return;
      }

      console.log("[DEFERRED_CHECKOUT] Creating payment intent on submit...");

      // Create payment intent only when user actually submits
      const clientSecret = await createPaymentIntentOnSubmit();

      console.log(
        "[DEFERRED_CHECKOUT] Payment intent created, processing payment..."
      );

      // Confirm payment with the newly created payment intent
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret: clientSecret,
        redirect: "if_required",
        confirmParams: {
          return_url: window.location.href,
        },
      });

      if (error) {
        console.error("[DEFERRED_CHECKOUT] Payment failed:", error);
        setErrorMessage(error.message || "Payment failed");
        onError(error);
      } else if (paymentIntent) {
        console.log(
          "[DEFERRED_CHECKOUT] Payment successful:",
          paymentIntent.id,
          paymentIntent.status
        );

        if (paymentIntent.status === "succeeded") {
          onSuccess(paymentIntent);
        } else {
          console.error(
            "[DEFERRED_CHECKOUT] Payment not successful:",
            paymentIntent.status
          );
          const statusError = {
            message: `Payment status: ${paymentIntent.status}`,
            type: "card_error",
          };
          setErrorMessage(statusError.message);
          onError(statusError);
        }
      }
    } catch (error: any) {
      console.error("[DEFERRED_CHECKOUT] Error during payment process:", error);
      setErrorMessage(error.message || "Payment processing failed");
      onError(error);
    } finally {
      setLoading(false);
      setIsPaymentInProgress(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Warning Banner */}
      {!loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-blue-800">
                Important Notice
              </h3>
              <div className="mt-1 text-sm text-blue-700">
                Please stay on this page until your payment is processed and you
                see the confirmation screen. Do not close your browser or
                navigate away.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Processing Warning - Prominent overlay */}
      {loading && (
        <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-yellow-900 mb-1">
                ⚠️ Processing Your Payment
              </h3>
              <p className="text-sm text-yellow-800 font-medium">
                DO NOT close this window or press the back button
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                This may take a few moments...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Element */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Payment Details</h3>
        <div className="p-4 border border-gray-200 rounded-md relative">
          {!isPaymentElementReady && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-md">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary_green mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Loading payment form...</p>
              </div>
            </div>
          )}
          <PaymentElement
            options={{
              layout: "tabs",
            }}
            onReady={() => {
              console.log(
                "[DEFERRED_CHECKOUT] PaymentElement onReady callback"
              );
              setIsPaymentElementReady(true);
            }}
          />
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Payment Error
              </h3>
              <div className="mt-1 text-sm text-red-700">{errorMessage}</div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="button"
        onClick={() => handleSubmit()}
        disabled={!stripe || !isPaymentElementReady || loading}
        className={`w-full px-6 py-3 text-white font-semibold rounded-md transition-colors ${
          loading || !stripe || !isPaymentElementReady
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-primary_green hover:bg-primary_green/90"
        }`}
      >
        {!isPaymentElementReady ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Loading payment form...
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Processing Payment - Please Wait...
          </div>
        ) : (
          `Pay Now - Complete ${isCartBooking ? "Cart" : "Booking"}`
        )}
      </button>

      {/* Payment Methods Info */}
      <div className="text-center text-sm text-gray-500">
        <p className="mb-3">We accept all major credit and debit cards</p>
        <div className="flex justify-center space-x-4">
          {/* Visa */}
          <Image
            src="/images/footer_payment1.png"
            alt="Visa"
            width={40}
            height={24}
            className="h-12 w-16"
          />

          {/* Mastercard */}
          <Image
            src="/images/mastercard.png"
            alt="Mastercard"
            width={40}
            height={24}
            className="h-12 w-16"
          />

          {/* American Express */}
          <Image
            src="/images/American Express Card.png"
            alt="American Express"
            width={40}
            height={24}
            className="h-12 w-16"
          />

          {/* Discover */}
          <Image
            src="/images/footer_payment2.png"
            alt="Discover"
            width={40}
            height={24}
            className="h-12 w-16"
          />
        </div>
        <p className="mt-3 text-xs">
          🔒 Your payment information is encrypted and secure. No payment intent
          is created until you click "Pay Now".
        </p>
      </div>
    </form>
  );
}
