"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function GoogleBtn() {
  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <button
      onClick={handleGoogleLogin}
      type="button"
      className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded px-4 py-2 hover:bg-gray-100 transition"
    >
      <Image 
        src="/icons/google-logo.svg" 
        alt="Google" 
        width={20} 
        height={20} 
        className="w-5 h-5" 
      />
      Continue with Google
    </button>
  );
}