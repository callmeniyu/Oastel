"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  FiClock,
  FiMapPin,
  FiCalendar,
  FiUser,
  FiPackage,
  FiEye,
  FiRepeat,
  FiFileText,
} from "react-icons/fi";
import { FaRoute, FaCar } from "react-icons/fa";
import Image from "next/image";
import { useToast } from "@/context/ToastContext";

type BookingStatus = "upcoming" | "completed" | "cancelled";

type Booking = {
  _id: string;
  packageType: "tour" | "transfer";
  packageId: string;
  date: string;
  time: string;
  adults: number;
  children: number;
  pickupLocation: string;
  total: number;
  status: string;
  createdAt: string;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  packageDetails?: {
    title: string;
    image?: string;
    duration?: string;
    price: number;
    slug?: string;
  };
};

export default function MyBookingsContent() {
  const { data: session } = useSession();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"upcoming" | "history">(
    "upcoming"
  );
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!session?.user?.email) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/user/${session.user.email}`
        );
        const result = await response.json();

        if (result.success && result.data) {
          setBookings(result.data);
        } else {
          setError("Failed to load bookings");
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [session?.user?.email]);

  const isUpcoming = (booking: Booking): boolean => {
    // Consider booking as upcoming if its date is today or in the future and not cancelled
    // Compare only the date part, not the time
    const bookingDate = new Date(booking.date);
    const today = new Date();
    // Set both to midnight for date-only comparison
    bookingDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return bookingDate >= today && booking.status !== "cancelled";
  };

  const upcomingBookings = bookings.filter(isUpcoming);
  const pastBookings = bookings.filter((booking) => !isUpcoming(booking));

  const getStatusBadge = (booking: Booking) => {
    if (booking.status === "cancelled") {
      return (
        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
          Cancelled
        </span>
      );
    }

    if (isUpcoming(booking)) {
      return (
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
          Upcoming
        </span>
      );
    }

    return (
      <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
        Completed
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleViewReceipt = (bookingId: string) => {
    window.open(`/booking/confirmation/${bookingId}`, "_blank");
  };

  const handleBookAgain = (booking: Booking) => {
    const packageType = booking.packageType === "tour" ? "tours" : "transfers";
    // Use slug if available and not empty, fallback to packageId
    const slug =
      booking.packageDetails?.slug && booking.packageDetails.slug.trim() !== ""
        ? booking.packageDetails.slug
        : booking.packageId;

    if (!slug) {
      showToast({
        type: "error",
        title: "Error",
        message: "Unable to navigate to package. Please try again.",
      });
      return;
    }

    window.location.href = `/${packageType}/${slug}`;
  };

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Package Image/Icon */}
        <div className="relative h-48 md:h-auto md:w-56 bg-gradient-to-br from-primary_green to-green-600 flex-shrink-0">
          {booking.packageDetails?.image ? (
            <Image
              src={booking.packageDetails.image}
              alt={booking.packageDetails.title || "Package"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              {booking.packageType === "tour" ? (
                <FaRoute className="text-5xl text-white" />
              ) : (
                <FaCar className="text-5xl text-white" />
              )}
            </div>
          )}
          <div className="absolute top-4 right-4">
            {getStatusBadge(booking)}
          </div>
        </div>

        {/* Booking Details */}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <FiPackage className="text-primary_green text-sm" />
                <span className="text-sm text-primary_green font-semibold uppercase tracking-wide">
                  {booking.packageType}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {booking.packageDetails?.title ||
                  `${booking.packageType} Package`}
              </h3>
            </div>
            <div className="text-right ml-4">
              <p className="text-2xl font-bold text-primary_green">
                RM {booking.total}
              </p>
            </div>
          </div>

          {/* Booking Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center text-gray-600">
              <FiCalendar className="mr-3 text-primary_green" />
              <span className="font-medium">{formatDate(booking.date)}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <FiClock className="mr-3 text-primary_green" />
              <span className="font-medium">{booking.time}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <FiUser className="mr-3 text-primary_green" />
              <span className="font-medium">
                {booking.adults} Adult{booking.adults > 1 ? "s" : ""}
                {booking.children > 0 &&
                  `, ${booking.children} Child${
                    booking.children > 1 ? "ren" : ""
                  }`}
              </span>
            </div>
            {booking.pickupLocation && (
              <div className="flex items-center text-gray-600">
                <FiMapPin className="mr-3 text-primary_green" />
                <span className="font-medium truncate">
                  {booking.pickupLocation}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={() => handleBookAgain(booking)}
              className="flex items-center gap-2 px-4 py-2 border border-primary_green text-primary_green rounded-lg hover:bg-primary_green hover:text-white transition-colors font-medium"
            >
              <FiRepeat size={16} />
              Book Again
            </button>

            <button
              onClick={() => handleViewReceipt(booking._id)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              <FiFileText size={16} />
              Get Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 font-poppins">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary_green"></div>
          <span className="ml-4 text-gray-600 text-lg">
            Loading your bookings...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6 font-poppins">
        <div className="text-center py-20">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
            <p className="text-red-600 mb-6 text-lg">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-6xl mx-auto p-6 font-poppins">
        <div className="text-center py-20">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Sign In Required
          </h3>
          <p className="text-gray-600 mb-8 text-lg">
            Please sign in to view your bookings.
          </p>
          <button
            onClick={() => (window.location.href = "/auth/login")}
            className="bg-primary_green text-white px-8 py-3 rounded-lg hover:bg-primary_green/90 transition-colors font-medium"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 font-poppins">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
        <p className="text-gray-600">Manage and track all your bookings</p>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-20">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiPackage className="text-4xl text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              No bookings yet
            </h3>
            <p className="text-gray-600 mb-8 text-lg">
              Start exploring our tours and transfers to make your first
              booking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => (window.location.href = "/tours")}
                className="bg-primary_green text-white px-8 py-3 rounded-lg hover:bg-primary_green/90 transition-colors font-medium"
              >
                Browse Tours
              </button>
              <button
                onClick={() => (window.location.href = "/transfers")}
                className="border border-primary_green text-primary_green px-8 py-3 rounded-lg hover:bg-primary_green hover:text-white transition-colors font-medium"
              >
                Browse Transfers
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-8">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`px-6 py-4 font-semibold text-lg relative ${
                activeTab === "upcoming"
                  ? "text-primary_green border-b-2 border-primary_green"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Upcoming
              <span className="ml-2 bg-primary_green text-white text-sm px-2 py-1 rounded-full">
                {upcomingBookings.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-6 py-4 font-semibold text-lg relative ${
                activeTab === "history"
                  ? "text-primary_green border-b-2 border-primary_green"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              History
              <span className="ml-2 bg-gray-500 text-white text-sm px-2 py-1 rounded-full">
                {pastBookings.length}
              </span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === "upcoming" && upcomingBookings.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">No upcoming bookings.</p>
              </div>
            )}

            {activeTab === "history" && pastBookings.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">No booking history.</p>
              </div>
            )}

            {(activeTab === "upcoming" ? upcomingBookings : pastBookings).map(
              (booking) => (
                <BookingCard key={booking._id} booking={booking} />
              )
            )}
          </div>
        </>
      )}
    </div>
  );
}
