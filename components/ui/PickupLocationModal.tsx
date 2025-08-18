"use client";

import React, { useState } from "react";
import { IoClose } from "react-icons/io5";

interface PickupLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (pickupLocation: string) => void;
  packageType: "tour" | "transfer";
  transferDetails?: {
    pickupOption: "admin" | "user";
    pickupLocations: string;
  };
  packageTitle: string;
}

const PickupLocationModal: React.FC<PickupLocationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  packageType,
  transferDetails,
  packageTitle,
}) => {
  const [pickupLocation, setPickupLocation] = useState("");
  const [selectedAdminLocation, setSelectedAdminLocation] = useState("");

  if (!isOpen) return null;

  // Utility function to strip HTML tags from text
  const stripHtmlTags = (html: string): string => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const isTransferWithAdminPickup =
    packageType === "transfer" && transferDetails?.pickupOption === "admin";
  const adminPickupOptions = transferDetails?.pickupLocations
    ? transferDetails.pickupLocations
        .split(",")
        .map((loc) => stripHtmlTags(loc.trim()))
        .filter(Boolean)
    : [];

  const handleConfirm = () => {
    const finalPickupLocation = isTransferWithAdminPickup
      ? selectedAdminLocation
      : pickupLocation;

    if (!finalPickupLocation.trim()) {
      return; // Don't proceed if no location is selected/entered
    }

    onConfirm(finalPickupLocation);
    setPickupLocation("");
    setSelectedAdminLocation("");
  };

  const isValid = isTransferWithAdminPickup
    ? selectedAdminLocation.trim() !== ""
    : pickupLocation.trim() !== "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Pickup Location
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">
            Please specify the pickup location for{" "}
            <span className="font-medium">{packageTitle}</span>
          </p>

          {isTransferWithAdminPickup ? (
            // Admin-defined pickup locations (for transfers)
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Pickup Location
              </label>
              <select
                value={selectedAdminLocation}
                onChange={(e) => setSelectedAdminLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary_green focus:border-transparent"
                required
              >
                <option value="">Choose a pickup location...</option>
                {adminPickupOptions.map((location, index) => (
                  <option key={index} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            // User-defined pickup location (for tours and user-defined transfers)
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Pickup Location
              </label>
              <textarea
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                placeholder="Enter your pickup location (e.g., Hotel name, Address, etc.)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary_green focus:border-transparent resize-none"
                rows={3}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Please provide a specific address or landmark for easy pickup
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 border-t">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isValid}
            className={`flex-1 px-4 py-2 rounded-md transition-colors ${
              isValid
                ? "bg-primary_green text-white hover:bg-green-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default PickupLocationModal;
