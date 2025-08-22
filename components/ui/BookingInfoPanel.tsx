"use client";

import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { IoCartOutline } from "react-icons/io5";
import { IoBagOutline } from "react-icons/io5";
import { useToast } from "@/context/ToastContext";
import { useCart } from "@/context/CartContext";
import { formatDateForServer } from "@/lib/dateUtils";
import SessionHook from "@/hooks/SessionHook";
import PickupLocationModal from "./PickupLocationModal";
import { useState } from "react";

type Props = {
  title: string;
  date: Date;
  time: string;
  type: string;
  duration: string;
  adults: number;
  children: number;
  adultPrice: number;
  childPrice: number;
  isVehicleBooking?: boolean;
  vehicleSeatCapacity?: number;
  action?: string[];
  onClick?: () => void;
  onAddToCart?: () => void;
  userInfo?: boolean;
  totalPrice: number;
  packageType: "tour" | "transfer";
  packageId?: string;
  disabled?: boolean;
  transferDetails?: {
    pickupOption: "admin" | "user";
    pickupLocations: string;
  };
};

export default function BookingInfoPanel({
  title,
  date,
  time,
  type,
  duration,
  adults,
  children,
  adultPrice,
  childPrice,
  action,
  onClick,
  onAddToCart,
  userInfo,
  packageType,
  packageId,
  disabled = false,
  transferDetails,
  isVehicleBooking,
  vehicleSeatCapacity,
}: Props) {
  const router = useRouter();
  const { showToast } = useToast();
  const { user, isAuthenticated } = SessionHook();
  const { addToCart, loading: cartLoading } = useCart();
  const total = adults * adultPrice + children * childPrice;
  const [isPickupModalOpen, setIsPickupModalOpen] = useState(false);

  // Utility to strip HTML tags from any input (protect stored pickupLocation)
  const stripHtmlTags = (html: string) => {
    if (!html) return "";
    try {
      const div = document.createElement("div");
      div.innerHTML = html;
      return div.textContent || div.innerText || "";
    } catch (e) {
      return html;
    }
  };

  const handleAddToCart = async () => {
    console.log("BookingInfoPanel: handleAddToCart called", {
      packageType,
      packageId,
      isAuthenticated,
    });
    if (!isAuthenticated || !user) {
      showToast({
        type: "error",
        title: "Authentication Required",
        message: "Please log in to add items to cart",
      });
      router.push("/auth");
      return;
    }

    if (!packageId) {
      showToast({
        type: "error",
        title: "Error",
        message: "Package information is missing",
      });
      return;
    }

    // Show pickup location modal for both tours and transfers
    setIsPickupModalOpen(true);
  };

  const handlePickupLocationConfirm = async (pickupLocation: string) => {
    setIsPickupModalOpen(false);

    try {
      const cleaned = stripHtmlTags(pickupLocation || "");
      const success = await addToCart({
        packageId: packageId!,
        packageType,
        selectedDate: formatDateForServer(date), // Use timezone-safe date formatting
        selectedTime: time,
        adults,
        children: children || 0,
        pickupLocation: cleaned, // Pass cleaned pickup location
      });

      if (success) {
        router.push("/cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      showToast({
        type: "error",
        title: "Error",
        message: "Failed to add item to cart",
      });
    }
  };

  return (
    <div className="border rounded-md shadow min-w-[250px] font-poppins max-h-max pb-4">
      <div className="bg-primary_green text-white py-2 px-4 rounded-t-md text-center font-semibold font-poppins mb-4">
        Booking Details
      </div>
      <div className="px-4 flex flex-col gap-2">
        <div className="text-sm mb-2 flex gap-8 justify-between">
          <h6 className="font-semibold">
            {packageType === "tour" ? "Tour" : "Transfer"}
          </h6>
          <p className="text-desc_gray text-right">{title}</p>
        </div>
        <div className="text-sm mb-2 flex justify-between">
          <h6 className="font-semibold ">Date</h6>
          <p className="text-desc_gray">
            {format(new Date(date), "dd MMMM yyyy")}
          </p>
        </div>
        <div className="text-sm mb-2 flex justify-between">
          <h6 className="font-semibold">Time</h6>
          <p className="text-desc_gray">{time}</p>
        </div>
        <div className="text-sm mb-2 flex justify-between">
          <h6 className="font-semibold">Type</h6>
          <p className="text-desc_gray">{type}</p>
        </div>
        <div className="text-sm mb-2 flex justify-between">
          <h6 className="font-semibold">Duration</h6>
          <p className="text-desc_gray">{duration} hrs</p>
        </div>
        <div className="text-sm mb-4 flex justify-between">
          <h6 className="font-semibold">Persons</h6>
          <div className="text-desc_gray space-y-1 flex flex-col items-end">
            {isVehicleBooking ? (
              <div>
                <p>Vehicle booking • Seats: {vehicleSeatCapacity || "N/A"}</p>
              </div>
            ) : type === "private" ? (
              <div>
                <p>{adults}x Persons</p>
              </div>
            ) : (
              <div>
                <p>{adults}x Adults</p>
                <p>{children}x Children</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        className={`border-y p-5 flex justify-between ${
          userInfo ? "hidden" : "flex"
        }`}
      >
        <h4 className="text-xl font-bold">Amount</h4>
        <h4 className="text-xl font-bold"> RM {total}</h4>
      </div>
      <div
        className={`border-y p-5 flex flex-col gap-2 justify-between ${
          userInfo ? "flex" : "hidden"
        }`}
      >
        <div className="flex justify-between">
          <h4 className="text-lg font-semibold">Subtotal</h4>
          <h4 className="text-lg font-semibold"> RM {total}</h4>
        </div>
        <div className="flex justify-between">
          <h4 className="text-lg font-semibold">
            Bank Charge{" "}
            <span className="text-desc_gray text-sm font-medium">(2.8%)</span>
          </h4>
          <h4 className="text-lg font-semibold">
            {" "}
            RM {(total * 0.028).toFixed(2)}
          </h4>
        </div>
        <div className="flex justify-between">
          <h4 className="text-lg font-semibold">SST</h4>
          <h4 className="text-lg font-semibold"> RM {(0.0).toFixed(2)}</h4>
        </div>
      </div>

      <div
        className={`border-t p-5 flex text-primary_green gap-2 justify-between ${
          userInfo ? "flex" : "hidden"
        }`}
      >
        <h4 className="text-2xl font-semibold">Total</h4>
        <h4 className="text-2xl font-semibold">
          {" "}
          RM {(total + total * 0.028).toFixed(2)}
        </h4>
      </div>
      <div
        className={`flex flex-col gap-2 mt-4 px-6 ${userInfo ? "flex" : ""}`}
      >
        {userInfo ? (
          // User info page - show only Proceed to Payment button
          <div
            onClick={disabled ? undefined : onClick}
            className={`${
              disabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary_green cursor-pointer hover:bg-primary_green/90"
            } text-white text-sm px-4 py-2 flex gap-2 justify-center items-center rounded-md font-poppins font-semibold transition-colors`}
          >
            <IoBagOutline className="inline mr-2 text-2xl" />
            <p>Proceed to Payment</p>
          </div>
        ) : (
          // Booking details page - show Add to Cart and Continue buttons
          <>
            <button
              onClick={handleAddToCart}
              type="button"
              disabled={disabled || cartLoading}
              className={`${
                disabled || cartLoading
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "cursor-pointer border border-primary_green text-primary_green hover:bg-primary_green hover:text-white"
              } text-sm px-4 py-2 flex gap-2 justify-center items-center rounded-md font-poppins font-semibold transition-colors`}
            >
              <IoCartOutline className="inline mr-2 text-2xl" />
              <p>{cartLoading ? "Adding..." : "Add to Cart"}</p>
            </button>
            <div
              onClick={disabled ? undefined : onClick}
              className={`${
                disabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary_green cursor-pointer hover:bg-primary_green/90"
              } text-white text-sm px-4 py-3 flex gap-2 justify-center items-center rounded-md font-poppins font-semibold transition-colors`}
            >
              <p>Continue</p>
            </div>
          </>
        )}
      </div>

      {/* Pickup Location Modal (used for transfers) */}
      <PickupLocationModal
        isOpen={isPickupModalOpen}
        onClose={() => setIsPickupModalOpen(false)}
        onConfirm={handlePickupLocationConfirm}
        packageType={packageType}
        transferDetails={transferDetails}
        packageTitle={title}
      />
    </div>
  );
}
