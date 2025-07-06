"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function AuthErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    // Log the error to the console for debugging
    console.error("Authentication Error:", error);
  }, [error]);

  const getErrorMessage = () => {
    console.log("Authentication Error:", error);
    
    switch (error) {
      case "email-already-in-use":
        return "This email is already registered with email/password. Please login with your password instead.";
      case "access_denied":
        return "You denied access to your Google account.";
      case "OAuthAccountNotLinked":
        return "This email is already registered with a different provider.";
      default:
        return "An unknown error occurred during authentication.";
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6 text-red-600">
        Authentication Error
      </h1>
      <p className="mb-4">error:{getErrorMessage()}</p>
      <button
        onClick={() => router.push("/auth/login")}
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
      >
        Back to Login
      </button>
    </div>
  );
}