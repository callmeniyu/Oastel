"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  FiClock,
  FiMapPin,
  FiCalendar,
  FiUser,
  FiPackage,
  FiRepeat,
  FiFileText,
  FiSearch,
  FiAlertTriangle,
  FiX,
  FiLoader,
  FiEdit,
} from "react-icons/fi";
import { FaRoute, FaCar } from "react-icons/fa";
import Image from "next/image";
import { useToast } from "@/context/ToastContext";
import { formatMalaysianDateForDisplay, formatDateAsMYT, getMalaysianNow } from "@/lib/dateUtils";
import Confirmation from "@/components/ui/Confirmation";

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
  isAdminBooking?: boolean;
  paymentInfo?: {
    refundStatus?: "none" | "partial" | "full" | "refunded";
    refundAmount?: number;
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
  const [activeTab, setActiveTab] = useState<"upcoming" | "history">("upcoming");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Guest Search States
  const [searchBookingId, setSearchBookingId] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchResult, setSearchResult] = useState<Booking | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Cancellation Modal States
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Edit Booking Modal States
  const [selectedBookingForEdit, setSelectedBookingForEdit] = useState<Booking | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditConfirmModal, setShowEditConfirmModal] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editPickupLocation, setEditPickupLocation] = useState("");

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

  const getHoursToDeparture = (dateStr: string, timeStr: string): number => {
    try {
      const bookingDate = new Date(dateStr);
      const datePartStr = formatDateAsMYT(bookingDate);
      
      let hour24 = 0;
      let minutes = 0;
      const cleanTime = timeStr.trim();
      
      if (cleanTime.includes("AM") || cleanTime.includes("PM")) {
        const [tVal, period] = cleanTime.split(" ");
        const [h, m] = tVal.split(":").map(Number);
        hour24 = h;
        minutes = m;
        if (period && period.toUpperCase() === "PM" && h !== 12) {
          hour24 += 12;
        } else if (period && period.toUpperCase() === "AM" && h === 12) {
          hour24 = 0;
        }
      } else {
        const [h, m] = cleanTime.split(":").map(Number);
        hour24 = h;
        minutes = m;
      }

      const pad = (num: number) => String(num).padStart(2, "0");
      const departureISO = `${datePartStr}T${pad(hour24)}:${pad(minutes)}:00+08:00`;
      const departureTime = new Date(departureISO);
      const now = new Date();
      
      return (departureTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    } catch (err) {
      console.error("Error calculating hours to departure:", err);
      return 0;
    }
  };

  const handleEditClick = (booking: Booking) => {
    const hoursLeft = getHoursToDeparture(booking.date, booking.time);
    if (hoursLeft < 12) {
      showToast({
        type: "error",
        title: "Editing Not Allowed",
        message: "Editing is not allowed within 12 hours of the starting time.",
      });
      return;
    }

    setSelectedBookingForEdit(booking);
    setEditName(booking.contactInfo?.name || "");
    setEditPhone(booking.contactInfo?.phone || "");
    setEditPickupLocation(booking.pickupLocation || "");
    setShowEditModal(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate Name (minimum 5 characters)
    if (!editName || editName.trim().length < 5) {
      showToast({
        type: "error",
        title: "Invalid Name",
        message: "Name must be at least 5 characters",
      });
      return;
    }

    // Validate Phone (minimum 5 characters)
    if (!editPhone || editPhone.trim().length < 5) {
      showToast({
        type: "error",
        title: "Invalid Phone Number",
        message: "Phone number must be at least 5 characters",
      });
      return;
    }

    // Validate Pickup Location (minimum 10 characters)
    if (!editPickupLocation || editPickupLocation.trim().length < 10) {
      showToast({
        type: "error",
        title: "Invalid Pickup Location",
        message: "Pickup location must be at least 10 characters",
      });
      return;
    }

    setShowEditConfirmModal(true);
  };

  const handleConfirmEditSave = async () => {
    if (!selectedBookingForEdit) return;

    try {
      setSavingEdit(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${selectedBookingForEdit._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pickupLocation: editPickupLocation.trim(),
            contactInfo: {
              name: editName.trim(),
              phone: editPhone.trim(),
              email: selectedBookingForEdit.contactInfo?.email,
            },
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        showToast({
          type: "success",
          title: "Update Successful",
          message: "Your booking details have been updated successfully.",
        });

        // Update local state
        setBookings((prevBookings) =>
          prevBookings.map((b) =>
            b._id === selectedBookingForEdit._id
              ? {
                  ...b,
                  pickupLocation: editPickupLocation.trim(),
                  contactInfo: {
                    ...b.contactInfo,
                    name: editName.trim(),
                    phone: editPhone.trim(),
                  },
                }
              : b
          )
        );

        if (searchResult && searchResult._id === selectedBookingForEdit._id) {
          setSearchResult({
            ...searchResult,
            pickupLocation: editPickupLocation.trim(),
            contactInfo: {
              ...searchResult.contactInfo,
              name: editName.trim(),
              phone: editPhone.trim(),
            },
          });
        }

        setShowEditModal(false);
        setShowEditConfirmModal(false);
        setSelectedBookingForEdit(null);
      } else {
        showToast({
          type: "error",
          title: "Update Failed",
          message: result.error || "Failed to update booking details.",
        });
      }
    } catch (err) {
      console.error("Error updating booking:", err);
      showToast({
        type: "error",
        title: "Update Error",
        message: "A network error occurred. Please try again later.",
      });
    } finally {
      setSavingEdit(false);
    }
  };

  const isUpcoming = (booking: Booking): boolean => {
    const bookingDateStr = formatDateAsMYT(new Date(booking.date));
    const todayStr = formatDateAsMYT(getMalaysianNow());
    return bookingDateStr >= todayStr && booking.status !== "cancelled";
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
    return formatMalaysianDateForDisplay(new Date(dateString), {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleViewReceipt = (booking: Booking) => {
    if (booking.status === "cancelled") {
      window.open(`/booking/cancellation-receipt/${booking._id}`, "_blank");
    } else {
      window.open(`/booking/confirmation/${booking._id}`, "_blank");
    }
  };

  const handleBookAgain = (booking: Booking) => {
    const packageType = booking.packageType === "tour" ? "tours" : "transfers";
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

  const handleGuestSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchBookingId.trim() || !searchEmail.trim()) {
      setSearchError("Please fill in both Booking ID and Email address.");
      return;
    }

    try {
      setSearching(true);
      setSearchError(null);
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/search?bookingId=${searchBookingId.trim()}&email=${searchEmail.trim()}`
      );
      const result = await response.json();

      if (result.success && result.data) {
        setSearchResult(result.data);
      } else {
        setSearchError(result.error || "No matching booking found. Please check details.");
      }
    } catch (err) {
      console.error("Error searching guest booking:", err);
      setSearchError("Failed to fetch booking. Please try again later.");
    } finally {
      setSearching(false);
    }
  };

  const handleCancelClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setAgreeTerms(false);
    setShowCancelModal(true);
  };

  const handleConfirmCancellation = async () => {
    if (!selectedBooking || !agreeTerms) return;

    try {
      setCancelling(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${selectedBooking._id}/cancel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: selectedBooking.contactInfo.email,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        showToast({
          type: "success",
          title: "Cancelled Successfully",
          message: "Your booking has been cancelled and refund processed.",
        });
        
        // Redirect to cancellation receipt
        window.location.href = `/booking/cancellation-receipt/${selectedBooking._id}`;
      } else {
        showToast({
          type: "error",
          title: "Cancellation Failed",
          message: result.error || "Failed to process cancellation.",
        });
      }
    } catch (err) {
      console.error("Cancellation error:", err);
      showToast({
        type: "error",
        title: "Cancellation Error",
        message: "A network error occurred. Please try again later.",
      });
    } finally {
      setCancelling(false);
      setShowCancelModal(false);
    }
  };

  const BookingCard = ({ booking }: { booking: Booking }) => {
    const showCancelButton =
      booking.status === "confirmed" &&
      isUpcoming(booking) &&
      (activeTab === "upcoming" || (searchResult && searchResult._id === booking._id));

    return (
      <div
        id="mybookings"
        className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden"
      >
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
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <FiPackage className="text-primary_green text-sm" />
                  <span className="text-sm text-primary_green font-semibold uppercase tracking-wide">
                    {booking.packageType}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 leading-snug">
                  {booking.packageDetails?.title || `${booking.packageType} Package`}
                </h3>
                <p className="text-xs text-gray-400">ID: #{booking._id}</p>
              </div>
              <div className="text-left sm:text-right mt-1 sm:mt-0">
                <p className="text-xl sm:text-2xl font-bold text-primary_green">
                  RM {booking.total.toFixed(2)}
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
                    `, ${booking.children} Child${booking.children > 1 ? "ren" : ""}`}
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
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-gray-100 mt-4">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleViewReceipt(booking)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  <FiFileText size={15} />
                  <span>Receipt</span>
                </button>
                {booking.status === "confirmed" && (
                  <button
                    onClick={() => handleEditClick(booking)}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg font-medium border text-sm transition-colors ${
                      getHoursToDeparture(booking.date, booking.time) < 12
                        ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
                        : "border-primary_green text-primary_green hover:bg-green-50"
                    }`}
                  >
                    <FiEdit size={15} />
                    <span>Edit</span>
                  </button>
                )}
              </div>
              
              {showCancelButton && (
                <button
                  onClick={() => handleCancelClick(booking)}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 text-red-500 hover:text-red-700 hover:bg-red-50 sm:hover:bg-transparent rounded-lg sm:rounded-none transition-colors font-medium text-sm border border-red-100 sm:border-none"
                >
                  <FiX size={15} />
                  <span>Cancel Booking</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:p-3 font-poppins relative">
      {/* Full-screen Loading Overlay for Cancellation */}
      {cancelling && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-white">
          <FiLoader className="animate-spin text-5xl mb-4 text-primary_green" />
          <h2 className="text-2xl font-bold mb-2">Processing Cancellation...</h2>
          <p className="text-gray-300 max-w-md text-center px-4">
            We are processing your Stripe refund and reclaiming time slots. Please do not close or refresh this page.
          </p>
        </div>
      )}

      {/* Header section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
      </div>

      {/* Guest Search Component */}
      <div className="mb-10 bg-gradient-to-br from-green-50 to-emerald-50/50 p-6 rounded-2xl border border-green-100">
        <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
          <FiSearch className="text-primary_green" />
          Find Guest Booking
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Did you book without logging in? Enter your Booking ID(without #) and Email below to view and manage it.
        </p>
        
        <form onSubmit={handleGuestSearch} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Booking ID (e.g. 65ab6...)"
            value={searchBookingId}
            onChange={(e) => setSearchBookingId(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary_green"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary_green"
          />
          <button
            type="submit"
            disabled={searching}
            className="w-full bg-primary_green hover:bg-primary_green/90 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 py-3"
          >
            {searching ? <FiLoader className="animate-spin" /> : <FiSearch />}
            Search Booking
          </button>
        </form>

        {searchError && (
          <p className="mt-3 text-sm text-red-600 font-medium flex items-center gap-1">
            <FiAlertTriangle />
            {searchError}
          </p>
        )}

        {searchResult && (
          <div className="mt-6 border-t border-green-200 pt-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-900">Search Result:</h3>
              <button
                onClick={() => setSearchResult(null)}
                className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm font-medium"
              >
                <FiX /> Clear Result
              </button>
            </div>
            <BookingCard booking={searchResult} />
          </div>
        )}
      </div>

      {/* Main Tabbed Bookings Panel for Logged in Users */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <FiLoader className="animate-spin text-4xl text-primary_green" />
          <span className="ml-4 text-gray-600 text-lg font-medium">Loading your bookings...</span>
        </div>
      ) : error ? (
        <div className="text-center py-16">
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
      ) : !session ? (
        <div className="text-center py-10 bg-gray-50 rounded-2xl p-8 border border-gray-100">
          <FiPackage className="text-5xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Registered Accounts</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Log in to your account to instantly view and manage all past and upcoming bookings.
          </p>
          <button
            onClick={() => (window.location.href = "/auth")}
            className="bg-primary_green hover:bg-primary_green/90 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Sign In to Dashboard
          </button>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl p-8">
          <FiPackage className="text-5xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No bookings found</h3>
          <p className="text-gray-600 mb-6">
            You don't have any bookings registered with this account yet.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => (window.location.href = "/tours")}
              className="bg-primary_green text-white px-6 py-3 rounded-lg font-medium hover:bg-primary_green/90 transition-colors"
            >
              Browse Tours
            </button>
            <button
              onClick={() => (window.location.href = "/transfers")}
              className="border border-primary_green text-primary_green px-6 py-3 rounded-lg font-medium hover:bg-primary_green hover:text-white transition-colors"
            >
              Browse Transfers
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-8 w-full">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`flex-1 sm:flex-initial text-center px-4 sm:px-6 py-4 font-semibold text-base sm:text-lg relative ${
                activeTab === "upcoming"
                  ? "text-primary_green border-b-2 border-primary_green"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Upcoming
              <span className="ml-2 bg-primary_green text-white text-xs px-2 py-0.5 rounded-full">
                {upcomingBookings.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex-1 sm:flex-initial text-center px-4 sm:px-6 py-4 font-semibold text-base sm:text-lg relative ${
                activeTab === "history"
                  ? "text-primary_green border-b-2 border-primary_green"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              History
              <span className="ml-2 bg-gray-500 text-white text-xs px-2 py-0.5 rounded-full">
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

            {(activeTab === "upcoming" ? upcomingBookings : pastBookings).map((booking) => (
              <BookingCard key={booking._id} booking={booking} />
            ))}
          </div>
        </>
      )}

      {/* Cancellation Modal Overlay */}
      {showCancelModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-fade-in font-poppins">
            <div className="bg-red-600 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <FiAlertTriangle />
                Cancel Booking Request
              </h3>
              <button
                onClick={() => setShowCancelModal(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="p-6">
              <p className="text-gray-700 text-sm mb-4">
                You are cancelling your booking for:
              </p>
              <h4 className="font-bold text-gray-900 mb-4">
                {selectedBooking.packageDetails?.title || `${selectedBooking.packageType} Service`}
              </h4>

              {/* Policy Calculations */}
              {(() => {
                const hoursLeft = getHoursToDeparture(selectedBooking.date, selectedBooking.time);
                const isEligible = hoursLeft >= 24;
                const paid = selectedBooking.total;
                const isAdmin = selectedBooking.isAdminBooking === true;
                const fee = isEligible ? paid * 0.05 : paid;
                const refund = isEligible ? paid * 0.95 : 0;

                return (
                  <div className="space-y-4">
                    {/* Time / Departure Info */}
                    <div className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-semibold ${isEligible ? "bg-green-50 border-green-100 text-green-800" : "bg-red-50 border-red-100 text-red-800"}`}>
                      <FiClock className="flex-shrink-0" />
                      <span>{hoursLeft >= 0 ? `${hoursLeft.toFixed(1)} hours remaining until departure.` : "Booking departure is in the past."}</span>
                    </div>

                    {/* Cancellation Policy Rules */}
                    {isAdmin ? (
                      <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-red-800 text-xs font-semibold">
                        ⚠️ This booking is done by admin at the office, no refund would be made, collect cash from the office.
                      </div>
                    ) : (
                      <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl space-y-2 text-xs text-gray-700">
                        <p className="font-semibold text-gray-900 text-sm mb-1">Cancellation Rules:</p>
                        <p>• <strong>Cancel before 24 hours:</strong> 95% refund (5% processing and administrative fee deducted)</p>
                        <p>• <strong>Cancel within 24 hours:</strong> No cancellation can be made within 24 hours, since the booking has been finalized before 24 hours</p>
                      </div>
                    )}

                    {/* Error Box if Within 24 Hours */}
                    {!isEligible && (
                      <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
                        <FiAlertTriangle className="flex-shrink-0 text-sm" />
                        <span>No cancellation can be made within 24 hours, since the booking has been finalized before 24 hours.</span>
                      </div>
                    )}

                    {/* Financial Breakdown */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <div className="flex justify-between text-sm py-1">
                        <span className="text-gray-600">Total Paid</span>
                        <span className="font-semibold text-gray-900">RM {paid.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm py-1 border-b border-gray-200 pb-2">
                        <span className="text-gray-600">
                          {isAdmin ? "Cancellation Fee (100%)" : (isEligible ? "Stripe Processing & Admin Fee (5%)" : "Cancellation Fee (100%)")}
                        </span>
                        <span className="font-semibold text-red-600">- RM {fee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-base font-bold pt-2">
                        <span className="text-gray-900">Estimated Refund</span>
                        <span className="text-primary_green text-lg">RM {(isAdmin ? 0 : refund).toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Terms Checkbox */}
                    {isEligible && (
                      <label className="flex gap-3 items-start cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={agreeTerms}
                          onChange={(e) => setAgreeTerms(e.target.checked)}
                          className="mt-1 accent-red-600 rounded"
                        />
                        <span className="text-xs text-gray-600 leading-normal">
                          {isAdmin
                            ? "I understand that this cancellation is irreversible. The seat slots will be released instantly, and no refund will be processed via Stripe."
                            : "I understand that this cancellation is irreversible. The seat slots will be released instantly. Refund details are subject to Stripe's processing policies."}
                        </span>
                      </label>
                    )}
                  </div>
                );
              })()}

              <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="w-full sm:flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm sm:text-base"
                >
                  Keep Booking
                </button>
                <button
                  onClick={handleConfirmCancellation}
                  disabled={!agreeTerms || getHoursToDeparture(selectedBooking.date, selectedBooking.time) < 24}
                  className="w-full sm:flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:bg-red-300 text-sm sm:text-base"
                >
                  Confirm Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Booking Modal Overlay */}
      {showEditModal && selectedBookingForEdit && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl animate-fade-in font-poppins max-h-[90vh] flex flex-col">
            <div className="bg-primary_green text-white px-6 py-4 flex justify-between items-center flex-shrink-0">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <FiEdit />
                Edit Booking Details
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
              {/* Disabled/Read-only fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 text-xs">
                <div>
                  <label className="block text-gray-400 font-semibold mb-1 uppercase tracking-wider">Number of Persons</label>
                  <input
                    type="text"
                    disabled
                    value={`${selectedBookingForEdit.adults} Adult${selectedBookingForEdit.adults > 1 ? "s" : ""}${selectedBookingForEdit.children > 0 ? `, ${selectedBookingForEdit.children} Child${selectedBookingForEdit.children > 1 ? "ren" : ""}` : ""}`}
                    className="w-full bg-gray-200 text-gray-500 px-3 py-2 rounded-lg border border-gray-200 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-semibold mb-1 uppercase tracking-wider">Date</label>
                  <input
                    type="text"
                    disabled
                    value={formatDate(selectedBookingForEdit.date)}
                    className="w-full bg-gray-200 text-gray-500 px-3 py-2 rounded-lg border border-gray-200 cursor-not-allowed"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-gray-400 font-semibold mb-1 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={selectedBookingForEdit.contactInfo?.email || ""}
                    className="w-full bg-gray-200 text-gray-500 px-3 py-2 rounded-lg border border-gray-200 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Editable Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1 text-sm">Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary_green text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1 text-sm">Phone Number</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary_green text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1 text-sm">Pickup Location</label>
                  <textarea
                    rows={2}
                    value={editPickupLocation}
                    onChange={(e) => setEditPickupLocation(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary_green text-sm"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="flex-1 px-4 py-3 bg-primary_green text-white rounded-lg font-semibold hover:bg-primary_green/90 transition-colors text-sm flex items-center justify-center gap-2"
                >
                  {savingEdit ? <FiLoader className="animate-spin" /> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <Confirmation
        isOpen={showEditConfirmModal}
        onClose={() => setShowEditConfirmModal(false)}
        onConfirm={handleConfirmEditSave}
        title="Confirm Updated Details"
        message={
          <div className="space-y-3 text-sm">
            <p className="text-gray-600">Please confirm that you want to save the following updated details:</p>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2 text-left">
              <div>
                <span className="font-semibold text-gray-400 text-xs uppercase tracking-wider block">Full Name</span>
                <span className="text-gray-900 font-medium">{editName}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-400 text-xs uppercase tracking-wider block">Phone Number</span>
                <span className="text-gray-900 font-medium">{editPhone}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-400 text-xs uppercase tracking-wider block">Pickup Location</span>
                <span className="text-gray-900 font-medium">{editPickupLocation}</span>
              </div>
            </div>
          </div>
        }
        confirmText="Confirm Save"
        cancelText="Cancel"
      />
    </div>
  );
}
