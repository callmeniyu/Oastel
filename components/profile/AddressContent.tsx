"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/context/ToastContext";

export default function AddressContent() {
  const { data: session } = useSession();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [addressData, setAddressData] = useState({
    whatsapp: "",
    phone: "",
    pickupAddress1: "",
    pickupAddress2: "",
  });

  // Fetch user address data
  useEffect(() => {
    const fetchUserAddress = async () => {
      if (!session?.user?.email) return;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile/${session.user.email}`
        );
        const result = await response.json();

        if (result.success && result.data?.address) {
          const address = result.data.address;
          setAddressData({
            whatsapp: address.whatsapp || "",
            phone: address.phone || "",
            pickupAddress1: address.pickupAddresses?.[0] || "",
            pickupAddress2: address.pickupAddresses?.[1] || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user address:", error);
      }
    };

    fetchUserAddress();
  }, [session?.user?.email]);

  const handleSaveChanges = async () => {
    if (!session?.user?.email) {
      showToast({
        type: "error",
        title: "Error",
        message: "User email not found",
      });
      return;
    }

    setIsLoading(true);

    try {
      const pickupAddresses = [
        addressData.pickupAddress1,
        addressData.pickupAddress2,
      ].filter((addr) => addr.trim());

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/address`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: session.user.email,
            whatsapp: addressData.whatsapp,
            phone: addressData.phone,
            pickupAddresses: pickupAddresses,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        showToast({
          type: "success",
          title: "Success",
          message: "Address updated successfully",
        });
      } else {
        showToast({
          type: "error",
          title: "Error",
          message: result.message || "Failed to update address",
        });
      }
    } catch (error) {
      console.error("Error updating address:", error);
      showToast({
        type: "error",
        title: "Error",
        message: "An error occurred while updating your address",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-title_black mb-6">
        Address & Contact
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-desc_gray mb-1">
            WhatsApp Number
          </label>
          <input
            type="tel"
            value={addressData.whatsapp}
            onChange={(e) =>
              setAddressData((prev) => ({ ...prev, whatsapp: e.target.value }))
            }
            placeholder="Enter your WhatsApp number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary_green focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-desc_gray mb-1">
            Contact Number
          </label>
          <input
            type="tel"
            value={addressData.phone}
            onChange={(e) =>
              setAddressData((prev) => ({ ...prev, phone: e.target.value }))
            }
            placeholder="Enter your contact number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary_green focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-desc_gray mb-1">
            Pickup Address 1
          </label>
          <input
            type="text"
            value={addressData.pickupAddress1}
            onChange={(e) =>
              setAddressData((prev) => ({
                ...prev,
                pickupAddress1: e.target.value,
              }))
            }
            placeholder="Enter your primary pickup address"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary_green focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-desc_gray mb-1">
            Pickup Address 2 (Optional)
          </label>
          <input
            type="text"
            value={addressData.pickupAddress2}
            onChange={(e) =>
              setAddressData((prev) => ({
                ...prev,
                pickupAddress2: e.target.value,
              }))
            }
            placeholder="Enter your secondary pickup address"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary_green focus:border-transparent"
          />
        </div>
        <button
          onClick={handleSaveChanges}
          disabled={isLoading}
          className="mt-4 bg-primary_green text-white px-6 py-2 rounded-lg hover:bg-primary_green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
