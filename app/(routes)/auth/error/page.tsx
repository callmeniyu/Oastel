"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { FiAlertTriangle, FiArrowLeft, FiMail, FiServer } from "react-icons/fi";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "";

  // Set default message and title based on next-auth error code
  let title = "Authentication Error";
  let description = "An unexpected error occurred while trying to authenticate your session. Please try again.";
  let Icon = FiAlertTriangle;

  if (error === "email-already-in-use") {
    title = "Email Already in Use";
    description = "This email is registered with a different login provider (e.g. Google). Please log in using that provider to access your bookings.";
    Icon = FiMail;
  } else if (error === "server_error") {
    title = "Server Error";
    description = "A connection error occurred on the server. Please try again in a few moments.";
    Icon = FiServer;
  } else if (error === "callback_error") {
    title = "Callback Error";
    description = "An error occurred while negotiating login with the authentication server. Please try again.";
    Icon = FiAlertTriangle;
  } else if (error === "CredentialsSignin") {
    title = "Invalid Credentials";
    description = "The email or password you provided is incorrect. Please check your credentials and try again.";
    Icon = FiAlertTriangle;
  }

  return (
    <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 font-poppins py-16">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
        {/* Animated Icon Circle */}
        <div className="mx-auto w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <Icon size={32} />
        </div>

        {/* Error Info */}
        <h1 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
          {title}
        </h1>
        <p className="text-gray-600 text-sm leading-relaxed mb-8">
          {description}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Link
            href="/auth"
            className="w-full flex items-center justify-center gap-2 bg-primary_green text-white font-semibold py-3 px-4 rounded-xl hover:bg-primary_green/90 transition-colors shadow-sm text-sm"
          >
            <FiArrowLeft size={16} />
            Return to Login
          </Link>
          <Link
            href="/"
            className="w-full py-3 px-4 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-colors text-sm"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center font-poppins">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary_green mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Loading error details...</p>
          </div>
        </div>
      }
    >
      <AuthErrorContent />
    </Suspense>
  );
}
