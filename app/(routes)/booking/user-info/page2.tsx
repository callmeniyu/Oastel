"use client";

import { useBooking } from "@/context/BookingContext";
import BookingInfoPanel from "@/components/ui/BookingInfoPanel";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/context/ToastContext";
import SessionHook from "@/hooks/SessionHook";
import { useCart } from "@/context/CartContext";
import { cartBookingApi } from "@/lib/cartBookingApi";

type Country = { name: string; cca2: string; callingCode: string };

export default function BookingUserInfoPage() {
  const { booking } = useBooking();
  const router = useRouter();
  const { showToast } = useToast();
  const { user, isAuthenticated } = SessionHook();
  const { cart } = useCart();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "+60", // Malaysia's country code
    pickupLocation: "",
  });

  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBookingFromCart, setIsBookingFromCart] = useState(false);

  // Check if we're booking from cart or individual booking
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const fromCart = searchParams.get("from") === "cart";

    if (fromCart || (!booking && cart && cart.items.length > 0)) {
      setIsBookingFromCart(true);
    } else if (!booking && !cart?.items?.length) {
      router.replace("/");
    }
  }, [booking, cart, router]);

  // Form validation function
  const isFormValid = () => {
    const basicFieldsValid =
      form.name.trim() !== "" &&
      form.email.trim() !== "" &&
      form.phone.trim() !== "";

    // If booking from cart, we need pickup location for transfers
    if (isBookingFromCart) {
      // Check if any cart item is a transfer that needs pickup location
      const needsPickup = cart?.items?.some(
        (item) => item.packageType === "transfer" && !item.pickupLocation
      );

      if (needsPickup) {
        return basicFieldsValid && form.pickupLocation.trim() !== "";
      }
      return basicFieldsValid;
    }

    // For individual bookings
    if (booking) {
      // For transfers with admin-defined pickup, don't require user input
      if (
        booking?.packageType === "transfer" &&
        booking?.pickupOption === "admin"
      ) {
        return basicFieldsValid;
      }
      // For all other cases (tours or user-defined pickup), require pickup location
      return basicFieldsValid && form.pickupLocation.trim() !== "";
    }

    return basicFieldsValid;
  };

  useEffect(() => {
    async function loadCountries() {
      try {
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,cca2,idd"
        );
        const data = await res.json();
        interface RestCountry {
          name: { common: string };
          cca2: string;
          idd?: { root?: string; suffixes?: string[] };
        }

        const mapped: Country[] = (data as RestCountry[])
          .map((c: RestCountry) => {
            const code =
              c.idd?.root && c.idd?.suffixes?.[0]
                ? `${c.idd.root}${c.idd.suffixes[0]}`
                : null;
            return code
              ? { name: c.name.common, cca2: c.cca2, callingCode: code }
              : null;
          })
          .filter((c: Country | null): c is Country => !!c)
          .sort((a, b) => {
            // Put Malaysia first, then sort the rest alphabetically
            if (a.name === "Malaysia") return -1;
            if (b.name === "Malaysia") return 1;
            return a.name.localeCompare(b.name);
          });
        setCountries(mapped);
      } catch (err) {
        console.error("Could not load country codes", err);
      }
    }

    loadCountries();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirmBooking = async () => {
    if (!isAuthenticated || !user) {
      showToast({
        type: "error",
        title: "Authentication Required",
        message: "Please log in to proceed with booking",
      });
      router.push("/auth/login");
      return;
    }

    if (!isFormValid()) {
      showToast({
        type: "error",
        title: "Form Incomplete",
        message: "Please fill in all required fields before proceeding",
      });
      return;
    }

    try {
      setIsLoading(true);

      if (isBookingFromCart) {
        // Book all cart items
        const result = await cartBookingApi.bookCartItems({
          userEmail: user.email!,
          contactInfo: {
            name: form.name,
            email: form.email,
            phone: form.phone,
            whatsapp: form.phone,
          },
          pickupLocation: form.pickupLocation,
        });

        if (result.success) {
          let message = `Successfully created ${result.totalBookings} booking(s)`;
          if (result.warnings.length > 0) {
            message += `. Some items were skipped: ${result.warnings.join(
              ", "
            )}`;
          }

          showToast({
            type: "success",
            title: "Bookings Created",
            message,
          });

          router.push("/profile?tab=bookings");
        }
      } else if (booking) {
        // Individual booking logic (existing functionality)
        const bookingData = {
          userEmail: user.email,
          packageType: booking.packageType,
          packageId: booking.packageId,
          date: booking.date,
          time: booking.time,
          adults: booking.adults,
          children: booking.children,
          customerInfo: {
            name: form.name,
            email: form.email,
            phone: form.phone,
            countryCode: form.countryCode,
          },
          pickupLocation:
            booking?.packageType === "transfer" &&
            booking?.pickupOption === "admin"
              ? booking.pickupLocations || ""
              : form.pickupLocation,
          specialRequests: "",
          termsAccepted: true,
          pricing: {
            subtotal: booking.totalPrice,
            total: booking.totalPrice,
            bankCharge: 0,
            paymentMethod: {
              amount: booking.totalPrice,
              method: "online_banking",
            },
          },
        };

        const response = await fetch("/api/booking", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingData),
        });

        const result = await response.json();

        if (result.success) {
          showToast({
            type: "success",
            title: "Booking Confirmed",
            message: "Your booking has been successfully confirmed!",
          });
          router.push(`/booking/confirmation/${result.booking._id}`);
        } else {
          showToast({
            type: "error",
            title: "Booking Failed",
            message: result.error || "Failed to create booking",
          });
        }
      }
    } catch (error) {
      console.error("Error processing booking:", error);
      showToast({
        type: "error",
        title: "Booking Failed",
        message:
          "An error occurred while processing your booking. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Determine what to show in the booking panel
  const getBookingPanelData = () => {
    if (isBookingFromCart && cart?.items?.length) {
      // Show summary for cart items
      const totalAmount = cart.items.reduce(
        (sum, item) => sum + item.totalPrice,
        0
      );
      const totalAdults = cart.items.reduce(
        (sum, item) => sum + item.adults,
        0
      );
      const totalChildren = cart.items.reduce(
        (sum, item) => sum + item.children,
        0
      );

      return {
        title: `${cart.items.length} Item(s) in Cart`,
        date: new Date(), // Just for display
        time: "Various",
        type: "mixed",
        duration: "Various",
        adults: totalAdults,
        children: totalChildren,
        adultPrice: 0,
        childPrice: 0,
        totalPrice: totalAmount,
        packageType: "tour" as const,
      };
    } else if (booking) {
      return {
        title: booking.title || booking.packageTitle || "Booking",
        date: new Date(booking.date),
        time: booking.time,
        type: booking.type || "regular",
        duration: booking.duration || "4",
        adults: booking.adults,
        children: booking.children,
        adultPrice: booking.adultPrice || 0,
        childPrice: booking.childPrice || 0,
        totalPrice: booking.totalPrice,
        packageType: booking.packageType as "tour" | "transfer",
      };
    }
    return null;
  };

  const panelData = getBookingPanelData();

  if (!panelData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">
            No booking information found
          </h2>
          <p className="text-gray-600 mb-4">Please start a new booking</p>
          <button
            onClick={() => router.push("/")}
            className="bg-primary_green text-white px-6 py-2 rounded-lg"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-2xl font-semibold text-title_black mb-6">
                {isBookingFromCart
                  ? "Complete Your Booking"
                  : "Contact Information"}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary_green"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary_green"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <div className="flex">
                    <select
                      name="countryCode"
                      value={form.countryCode}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary_green w-24"
                    >
                      {countries.map((country) => (
                        <option key={country.cca2} value={country.callingCode}>
                          {country.callingCode}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="flex-1 border border-l-0 border-gray-300 rounded-r-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary_green"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                {/* Pickup Location - show based on booking type */}
                {(isBookingFromCart ||
                  (booking?.packageType === "transfer" &&
                    booking?.pickupOption === "user") ||
                  booking?.packageType !== "transfer") && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {isBookingFromCart
                        ? "Pickup Location (for transfers) *"
                        : booking?.packageType === "transfer"
                        ? "Pickup Location *"
                        : "Meeting Point *"}
                    </label>
                    <input
                      type="text"
                      name="pickupLocation"
                      value={form.pickupLocation}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary_green"
                      placeholder={
                        isBookingFromCart
                          ? "Enter pickup location for transfer items"
                          : booking?.packageType === "transfer"
                          ? "Enter your pickup location"
                          : "Enter meeting point location"
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div>
            <BookingInfoPanel
              title={panelData.title}
              date={panelData.date}
              time={panelData.time}
              type={panelData.type}
              duration={panelData.duration}
              adults={panelData.adults}
              children={panelData.children}
              adultPrice={panelData.adultPrice}
              childPrice={panelData.childPrice}
              totalPrice={panelData.totalPrice}
              packageType={panelData.packageType}
              userInfo={true}
              onClick={handleConfirmBooking}
              disabled={isLoading || !isFormValid()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
