"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentFailedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      setErrorMessage(decodeURIComponent(error));
    }
  }, [searchParams]);

  const handleRetryPayment = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* Error Icon */}
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-red-100 mb-6">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Failed
          </h2>

          <p className="text-gray-600 mb-2">
            We were unable to process your payment.
          </p>

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <p className="text-red-800 text-sm">
                <strong>Error Details:</strong> {errorMessage}
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div className="text-left bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <h3 className="font-medium text-yellow-800 mb-2">
                What happened?
              </h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Your payment was not processed</li>
                <li>• No charges were made to your card</li>
                <li>• Your booking was not created</li>
              </ul>
            </div>

            <div className="text-left bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="font-medium text-blue-800 mb-2">
                Common reasons:
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Insufficient funds</li>
                <li>• Incorrect card details</li>
                <li>• Card declined by bank</li>
                <li>• Network connection issues</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3 pt-6">
            <button
              onClick={handleRetryPayment}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary_green hover:bg-primary_green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary_green transition-colors"
            >
              Try Payment Again
            </button>

            <button
              onClick={handleGoHome}
              className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary_green transition-colors"
            >
              Return to Home
            </button>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Need help? Contact our support team at{" "}
              <a
                href="mailto:support@oastel.com"
                className="text-primary_green hover:underline"
              >
                support@oastel.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
