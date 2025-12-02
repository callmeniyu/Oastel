"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/context/ToastContext";

type BookNowButtonProps = {
  bookingUrl: string;
  isAvailable: boolean;
  packageName: string;
  customStyles?: string;
  text?: string;
};

export default function BookNowButton({
  bookingUrl,
  isAvailable,
  packageName,
  customStyles = "",
  text = "Book Now",
}: BookNowButtonProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const { showToast } = useToast();

  const handleClick = () => {
    if (isProcessing) return;

    if (!isAvailable) {
      showToast({
        type: "error",
        title: "Unavailable",
        message: `Sorry, "${packageName}" is currently unavailable for booking. Please check back later or contact us for more information.`,
      });
      return;
    }

    setIsProcessing(true);
    router.push(bookingUrl);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isProcessing}
      className={`bg-primary_green text-white text-sm px-4 py-2 rounded-md font-poppins hover:bg-primary_green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${customStyles}`}
    >
      {isProcessing ? "Loading..." : text}
    </button>
  );
}
