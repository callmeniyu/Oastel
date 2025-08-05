"use client";
import React, { useState } from "react";
import GreenBtn from "@/components/ui/GreenBtn";
import { useCart } from "@/context/CartContext";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUsers,
  FaBaby,
  FaMinus,
  FaPlus,
} from "react-icons/fa";

interface AddToCartFormProps {
  packageId: string;
  packageType: "tour" | "transfer";
  onSuccess?: () => void;
}

const AddToCartForm: React.FC<AddToCartFormProps> = ({
  packageId,
  packageType,
  onSuccess,
}) => {
  const { addToCart, loading } = useCart();
  const [formData, setFormData] = useState({
    selectedDate: "",
    selectedTime: "",
    adults: 1,
    children: 0,
    pickupLocation: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.selectedDate) {
      newErrors.selectedDate = "Please select a date";
    }

    if (!formData.selectedTime) {
      newErrors.selectedTime = "Please select a time";
    }

    if (formData.adults < 1) {
      newErrors.adults = "At least 1 adult is required";
    }

    if (packageType === "transfer" && !formData.pickupLocation.trim()) {
      newErrors.pickupLocation = "Pickup location is required for transfers";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const success = await addToCart({
        packageId,
        packageType,
        selectedDate: formData.selectedDate,
        selectedTime: formData.selectedTime,
        adults: formData.adults,
        children: formData.children,
        pickupLocation: formData.pickupLocation || undefined,
      });

      if (success && onSuccess) {
        onSuccess();
        // Reset form
        setFormData({
          selectedDate: "",
          selectedTime: "",
          adults: 1,
          children: 0,
          pickupLocation: "",
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleAddToCart = () => {
    const event = { preventDefault: () => {} } as React.FormEvent;
    handleSubmit(event);
  };

  // Generate time options
  const timeOptions = [];
  for (let hour = 8; hour <= 20; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      timeOptions.push(time);
    }
  }

  // Get minimum date (today)
  const today = new Date();
  const minDate = today.toISOString().split("T")[0];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Book this {packageType}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Date Selection */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <FaCalendarAlt className="w-4 h-4 mr-2" />
            Select Date *
          </label>
          <input
            type="date"
            value={formData.selectedDate}
            min={minDate}
            onChange={(e) => handleInputChange("selectedDate", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.selectedDate ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.selectedDate && (
            <p className="text-red-500 text-xs mt-1">{errors.selectedDate}</p>
          )}
        </div>

        {/* Time Selection */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <FaClock className="w-4 h-4 mr-2" />
            Select Time *
          </label>
          <select
            value={formData.selectedTime}
            onChange={(e) => handleInputChange("selectedTime", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.selectedTime ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Choose time</option>
            {timeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
          {errors.selectedTime && (
            <p className="text-red-500 text-xs mt-1">{errors.selectedTime}</p>
          )}
        </div>

        {/* Adults Count */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <FaUsers className="w-4 h-4 mr-2" />
            Adults *
          </label>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() =>
                handleInputChange("adults", Math.max(1, formData.adults - 1))
              }
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
            >
              <FaMinus className="w-3 h-3" />
            </button>
            <span className="w-8 text-center font-medium">
              {formData.adults}
            </span>
            <button
              type="button"
              onClick={() => handleInputChange("adults", formData.adults + 1)}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
            >
              <FaPlus className="w-3 h-3" />
            </button>
          </div>
          {errors.adults && (
            <p className="text-red-500 text-xs mt-1">{errors.adults}</p>
          )}
        </div>

        {/* Children Count */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <FaBaby className="w-4 h-4 mr-2" />
            Children
          </label>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() =>
                handleInputChange(
                  "children",
                  Math.max(0, formData.children - 1)
                )
              }
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
            >
              <FaMinus className="w-3 h-3" />
            </button>
            <span className="w-8 text-center font-medium">
              {formData.children}
            </span>
            <button
              type="button"
              onClick={() =>
                handleInputChange("children", formData.children + 1)
              }
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
            >
              <FaPlus className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Pickup Location (for transfers) */}
        {packageType === "transfer" && (
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <FaMapMarkerAlt className="w-4 h-4 mr-2" />
              Pickup Location *
            </label>
            <input
              type="text"
              placeholder="Enter pickup address"
              value={formData.pickupLocation}
              onChange={(e) =>
                handleInputChange("pickupLocation", e.target.value)
              }
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.pickupLocation ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.pickupLocation && (
              <p className="text-red-500 text-xs mt-1">
                {errors.pickupLocation}
              </p>
            )}
          </div>
        )}

        {/* Submit Button */}
        <GreenBtn
          text={loading ? "Adding to Cart..." : "Add to Cart"}
          customStyles="w-full py-3 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={!loading ? handleAddToCart : undefined}
        />
      </form>
    </div>
  );
};

export default AddToCartForm;
