"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useToast } from "@/context/ToastContext";
import { tourApi } from "@/lib/tourApi";
import { transferApi } from "@/lib/transferApi";

type BookNowButtonProps = {
  bookingUrl: string;
  isAvailable: boolean;
  packageSlug?: string;
  packageType?: "tour" | "transfer";
  packageName: string;
  customStyles?: string;
  text?: string;
};

export default function BookNowButton({
  bookingUrl,
  isAvailable,
  packageSlug,
  packageType,
  packageName,
  customStyles = "",
  text = "Book Now",
}: BookNowButtonProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const { showToast } = useToast();
  const [currentAvailable, setCurrentAvailable] =
    useState<boolean>(isAvailable);

  const handleClick = () => {
    if (isProcessing) return;

    // Use latest fetched availability when available
    const available =
      currentAvailable !== undefined ? currentAvailable : isAvailable;

    if (!available) {
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

  useEffect(() => {
    // If a slug is provided, fetch the latest availability client-side
    let mounted = true;
    const fetchAvailability = async () => {
      try {
        if (!packageSlug || !packageType) return;
        if (packageType === "tour") {
          const res = await tourApi.getTourBySlug(packageSlug);
          if (res?.success && res.data && mounted) {
            setCurrentAvailable(res.data.isAvailable !== false);
          }
        } else if (packageType === "transfer") {
          const res = await transferApi.getTransferBySlug(packageSlug);
          if (res?.success && res.data && mounted) {
            setCurrentAvailable(res.data.isAvailable !== false);
          }
        }
      } catch (e) {
        // ignore - keep initial availability
      }
    };

    fetchAvailability();
    return () => {
      mounted = false;
    };
  }, [packageSlug, packageType]);

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
