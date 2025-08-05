"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import { cartBookingApi, CartBookingSummary } from "@/lib/cartBookingApi";
import {
  FiShoppingCart,
  FiClock,
  FiCalendar,
  FiUser,
  FiMapPin,
  FiAlertTriangle,
  FiCheckCircle,
  FiCreditCard,
  FiPackage,
  FiArrowLeft,
} from "react-icons/fi";
import { FaRoute, FaCar } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

export default function CartCheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showToast } = useToast();

  const [summary, setSummary] = useState<CartBookingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
  });

  useEffect(() => {
    // Wait for session to load
    if (status === "loading") return;

    if (status === "unauthenticated" || !session?.user?.email) {
      router.push("/auth/login");
      return;
    }

    // Pre-fill contact info from session
    setContactInfo({
      name: session.user.name || "",
      email: session.user.email || "",
      phone: "",
      whatsapp: "",
    });

    fetchCartSummary();
  }, [session, status]);

  const fetchCartSummary = async () => {
    if (!session?.user?.email) return;

    try {
      setLoading(true);
      const summaryData = await cartBookingApi.getCartBookingSummary(
        session.user.email
      );
      setSummary(summaryData);
    } catch (error) {
      console.error("Error fetching cart summary:", error);
      showToast({
        type: "error",
        title: "Error",
        message: "Failed to load cart summary",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormValid = () => {
    return (
      contactInfo.name.trim() !== "" &&
      contactInfo.email.trim() !== "" &&
      contactInfo.phone.trim() !== ""
    );
  };

  const handleBookAllItems = async () => {
    if (!session?.user?.email || !isFormValid()) {
      showToast({
        type: "error",
        title: "Form Incomplete",
        message: "Please fill in all required contact information",
      });
      return;
    }

    if (!summary || summary.validItems === 0) {
      showToast({
        type: "error",
        title: "No Valid Items",
        message: "There are no valid items in your cart to book",
      });
      return;
    }

    try {
      setProcessing(true);

      const result = await cartBookingApi.bookCartItems({
        userEmail: session.user.email,
        contactInfo: {
          name: contactInfo.name,
          email: contactInfo.email,
          phone: contactInfo.phone,
          whatsapp: contactInfo.whatsapp || contactInfo.phone,
        },
      });

      if (result.success) {
        let message = `Successfully created ${result.totalBookings} booking(s)`;
        if (result.warnings.length > 0) {
          message += `. Some items were skipped: ${result.warnings.join(", ")}`;
        }

        showToast({
          type: "success",
          title: "Bookings Created",
          message,
        });

        // Redirect to bookings page or success page
        router.push("/profile?tab=bookings");
      }
    } catch (error) {
      console.error("Error booking cart items:", error);
      showToast({
        type: "error",
        title: "Booking Failed",
        message: "Failed to create bookings. Please try again.",
      });
    } finally {
      setProcessing(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary_green mx-auto"></div>
          <p className="mt-4 text-desc_gray">Loading...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary_green mx-auto"></div>
          <p className="mt-4 text-desc_gray">Loading cart checkout...</p>
        </div>
      </div>
    );
  }

  if (!summary || summary.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <FiShoppingCart className="mx-auto text-6xl text-desc_gray mb-4" />
            <h2 className="text-2xl font-semibold text-title_black mb-2">
              Your cart is empty
            </h2>
            <p className="text-desc_gray mb-6">
              Add tours or transfers to get started
            </p>
            <Link
              href="/tours"
              className="bg-primary_green text-white px-6 py-2 rounded-lg hover:bg-primary_green/90 transition-colors"
            >
              Browse Tours
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/profile"
            className="text-primary_green hover:text-primary_green/80 flex items-center gap-2"
          >
            <FiArrowLeft />
            Back to Profile
          </Link>
          <h1 className="text-3xl font-bold text-title_black">Shopping Cart</h1>
        </div>

        {/* Alerts for expired items */}
        {summary.expiredItems > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-yellow-800">
              <FiAlertTriangle />
              <h3 className="font-medium">
                {summary.expiredItems} item(s) have expired dates
              </h3>
            </div>
            <p className="text-yellow-700 text-sm mt-1">
              These items will be skipped during booking as their selected dates
              have already passed.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold text-title_black mb-4">
              Review Your Items ({summary.items.length})
            </h2>

            {summary.items.map((item: any) => (
              <div
                key={item._id}
                className={`bg-white rounded-xl shadow-sm border p-4 ${
                  item.isExpired
                    ? "border-red-200 bg-red-50/30"
                    : "border-gray-100"
                }`}
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Item Image */}
                  <div className="relative w-full sm:w-24 h-24 flex-shrink-0">
                    {item.packageImage ? (
                      <Image
                        src={item.packageImage}
                        alt={item.packageTitle}
                        fill
                        className="object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary_green to-green-600 rounded-lg flex items-center justify-center">
                        {item.packageType === "tour" ? (
                          <FaRoute className="text-xl text-white" />
                        ) : (
                          <FaCar className="text-xl text-white" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <FiPackage className="text-primary_green" />
                          <span className="text-sm text-primary_green font-medium uppercase">
                            {item.packageType}
                          </span>
                          {item.isExpired && (
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                              Expired
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-title_black">
                          {item.packageTitle}
                        </h3>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary_green">
                          RM {item.totalPrice.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="grid grid-cols-2 gap-2 text-sm text-desc_gray">
                      <div className="flex items-center gap-2">
                        <FiCalendar />
                        {new Date(item.selectedDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <FiClock />
                        {item.selectedTime}
                      </div>
                      <div className="flex items-center gap-2">
                        <FiUser />
                        {item.adults} Adults, {item.children} Children
                      </div>
                      {item.pickupLocation && (
                        <div className="flex items-center gap-2 col-span-2">
                          <FiMapPin />
                          <span className="truncate">
                            {item.pickupLocation}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Contact Information Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-8">
              <h2 className="text-xl font-semibold text-title_black mb-4">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-desc_gray mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={contactInfo.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary_green"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-desc_gray mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={contactInfo.email}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary_green"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-desc_gray mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={contactInfo.phone}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary_green"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-desc_gray mb-2">
                    WhatsApp (Optional)
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={contactInfo.whatsapp}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary_green"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-title_black mb-4">
                Booking Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-desc_gray">Total Items</span>
                  <span className="font-medium">{summary.items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-desc_gray">Valid Items</span>
                  <span className="font-medium text-green-600">
                    {summary.validItems}
                  </span>
                </div>
                {summary.expiredItems > 0 && (
                  <div className="flex justify-between">
                    <span className="text-desc_gray">Expired Items</span>
                    <span className="font-medium text-red-600">
                      {summary.expiredItems}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-desc_gray">Subtotal</span>
                  <span className="font-medium">
                    RM {summary.totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-desc_gray">Bank Charge (2.8%)</span>
                  <span className="font-medium">
                    RM {summary.bankCharge.toFixed(2)}
                  </span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold text-primary_green">
                    RM {summary.grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <Link
                href="/booking/user-info"
                className={`w-full bg-primary_green text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-primary_green/90 transition-colors ${
                  summary.validItems === 0
                    ? "opacity-50 cursor-not-allowed pointer-events-none"
                    : ""
                }`}
              >
                <FiCreditCard />
                Proceed to Checkout ({summary.validItems} item(s))
              </Link>

              <p className="text-xs text-desc_gray mt-3 text-center">
                Only valid items will be booked. Expired items will be skipped.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
