"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/context/ToastContext";
import {
  FiCheckCircle,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUser,
  FiMail,
  FiPhone,
} from "react-icons/fi";
import Image from "next/image";

interface BookingDetails {
  _id: string;
  packageTitle: string;
  packageType: string;
  packageImage?: string;
  selectedDate: string;
  selectedTime: string;
  adults: number;
  children: number;
  totalPrice: number;
  pickupLocation: string;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  createdAt: string;
}

export default function CartConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [bookings, setBookings] = useState<BookingDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bookingIds = searchParams.get("bookings");

    if (!bookingIds) {
      router.push("/cart");
      return;
    }

    fetchBookingDetails(bookingIds.split(","));
  }, [searchParams, router]);

  const fetchBookingDetails = async (bookingIds: string[]) => {
    try {
      setLoading(true);

      // Fetch details for each booking
      const bookingPromises = bookingIds.map(async (id) => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${id}`
        );
        const result = await response.json();

        if (result.success) {
          return result.data;
        }
        throw new Error(`Failed to fetch booking ${id}`);
      });

      const bookingDetails = await Promise.all(bookingPromises);
      setBookings(bookingDetails);
    } catch (error) {
      console.error("Error fetching booking details:", error);
      showToast({
        type: "error",
        title: "Error",
        message: "Failed to load booking details",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString: string) => {
    try {
      const [hours, minutes] = timeString.split(":");
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return timeString;
    }
  };

  const getTotalAmount = () => {
    return bookings.reduce((total, booking) => total + booking.totalPrice, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary_green mx-auto"></div>
          <p className="mt-4 text-desc_gray">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">No booking details found</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-6 py-2 bg-primary_green text-white rounded-lg hover:bg-primary_green/90"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <FiCheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bookings Confirmed!
          </h1>
          <p className="text-gray-600">
            {bookings.length} booking{bookings.length > 1 ? "s have" : " has"}{" "}
            been successfully created
          </p>
        </div>

        {/* Booking Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Booking Summary
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-primary_green">
                {bookings.length}
              </p>
              <p className="text-sm text-gray-600">Total Bookings</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-primary_green">
                {bookings.reduce(
                  (total, b) => total + b.adults + b.children,
                  0
                )}
              </p>
              <p className="text-sm text-gray-600">Total Guests</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-primary_green">
                RM {getTotalAmount().toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">Total Amount</p>
            </div>
          </div>
        </div>

        {/* Individual Bookings */}
        <div className="space-y-6">
          {bookings.map((booking, index) => (
            <div
              key={booking._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="bg-primary_green text-white px-6 py-3">
                <h3 className="font-semibold">
                  Booking #{index + 1} - {booking.packageTitle}
                </h3>
                <p className="text-sm opacity-90">Booking ID: {booking._id}</p>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Booking Details */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <FiCalendar className="text-primary_green" />
                      <span className="font-medium">
                        {formatDate(booking.selectedDate)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <FiClock className="text-primary_green" />
                      <span className="font-medium">
                        {formatTime(booking.selectedTime)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <FiUser className="text-primary_green" />
                      <span className="font-medium">
                        {booking.adults} adult{booking.adults > 1 ? "s" : ""}
                        {booking.children > 0 &&
                          `, ${booking.children} child${
                            booking.children > 1 ? "ren" : ""
                          }`}
                      </span>
                    </div>

                    <div className="flex items-start gap-3">
                      <FiMapPin className="text-primary_green mt-0.5" />
                      <span className="font-medium">
                        {booking.pickupLocation}
                      </span>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">
                      Contact Information
                    </h4>

                    <div className="flex items-center gap-3">
                      <FiUser className="text-primary_green" />
                      <span>{booking.contactInfo.name}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <FiMail className="text-primary_green" />
                      <span>{booking.contactInfo.email}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <FiPhone className="text-primary_green" />
                      <span>{booking.contactInfo.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Amount:</span>
                    <span className="text-2xl font-bold text-primary_green">
                      RM {booking.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Information Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-800 mb-2">What's Next?</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• You will receive confirmation emails for each booking</li>
            <li>
              • Our team will contact you via WhatsApp to confirm pickup details
            </li>
            <li>• Please keep your WhatsApp number accessible</li>
            <li>• If you have any questions, feel free to contact us</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/bookings")}
              className="px-6 py-3 bg-primary_green text-white rounded-lg hover:bg-primary_green/90 transition-colors"
            >
              View All Bookings
            </button>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 border border-primary_green text-primary_green rounded-lg hover:bg-primary_green/5 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
