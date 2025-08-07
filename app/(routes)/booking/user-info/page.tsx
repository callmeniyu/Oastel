"use client";

import { useBooking } from "@/context/BookingContext";
import { useCart } from "@/context/CartContext";
import { cartBookingApi } from "@/lib/cartBookingApi";
import BookingInfoPanel from "@/components/ui/BookingInfoPanel";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/context/ToastContext";
import SessionHook from "@/hooks/SessionHook";

type Country = { name: string; cca2: string; callingCode: string };

export default function BookingUserInfoPage() {
  const { booking } = useBooking();
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const { showToast } = useToast();
  const { user, isAuthenticated } = SessionHook();
  const searchParams = useSearchParams();

  // Check if this is a cart booking
  const isCartBooking = searchParams.get("from") === "cart";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "+60", // Malaysia's country code
    pickupLocation: "",
  });

  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Form validation function
  const isFormValid = () => {
    const basicFieldsValid =
      form.name.trim() !== "" &&
      form.email.trim() !== "" &&
      form.phone.trim() !== "";

    if (isCartBooking) {
      // For cart bookings, pickup location is handled per item
      return basicFieldsValid;
    }

    // For transfers with admin-defined pickup, don't require user input
    if (
      booking?.packageType === "transfer" &&
      booking?.pickupOption === "admin"
    ) {
      return basicFieldsValid;
    }

    // For all other cases (tours or user-defined pickup), require pickup location
    return basicFieldsValid && form.pickupLocation.trim() !== "";
  };

  useEffect(() => {
    if (isCartBooking) {
      // For cart bookings, check if cart exists and has items
      if (!cart || cart.items.length === 0) {
        router.replace("/cart");
      }
    } else {
      // For single bookings, check if booking exists
      if (!booking) {
        router.replace("/");
      }
    }
  }, [booking, cart, isCartBooking, router]);

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
    // Validate form
    if (!form.name || !form.email || !form.phone) {
      showToast({
        type: "error",
        title: "Missing Information",
        message: "Please fill in all required fields",
      });
      return;
    }

    if (isCartBooking) {
      // Handle cart booking
      return handleCartBooking();
    }

    // Handle single booking (existing logic)
    return handleSingleBooking();
  };

  const handleCartBooking = async () => {
    if (!cart || cart.items.length === 0) {
      showToast({
        type: "error",
        title: "Error",
        message: "No items in cart",
      });
      return;
    }

    if (!user?.email) {
      console.error("User email not found in session:", user);
      showToast({
        type: "error",
        title: "Authentication Error",
        message: "User email not found. Please try logging in again.",
      });
      return;
    }

    console.log("User session data:", {
      email: user.email,
      name: user.name,
      hasCart: !!cart,
      cartItemCount: cart?.items?.length || 0,
    });

    try {
      setIsLoading(true);

      const bookingRequest = {
        userEmail: user.email,
        contactInfo: {
          name: form.name,
          email: form.email,
          phone: `${form.countryCode}${form.phone}`,
          whatsapp: `${form.countryCode}${form.phone}`,
        },
      };

      console.log("Cart booking request:", bookingRequest);

      // Book all cart items using cart booking API
      const result = await cartBookingApi.bookCartItems(bookingRequest);

      if (result.success) {
        showToast({
          type: "success",
          title: "Bookings Confirmed!",
          message: `${result.totalBookings} booking(s) have been successfully created`,
        });

        // Clear the cart after successful booking
        await clearCart();

        // Redirect to cart confirmation page or first booking confirmation
        if (result.bookingIds.length > 0) {
          router.push(
            `/booking/cart-confirmation?bookings=${result.bookingIds.join(",")}`
          );
        } else {
          router.push("/bookings");
        }
      } else {
        showToast({
          type: "error",
          title: "Booking Failed",
          message: "Failed to create bookings",
        });
      }
    } catch (error: any) {
      console.error("Cart booking error:", error);
      showToast({
        type: "error",
        title: "Error",
        message:
          error.message || "An error occurred while creating your bookings",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSingleBooking = async () => {
    // Check pickup location based on transfer type
    if (
      booking?.packageType === "transfer" &&
      booking?.pickupOption === "user"
    ) {
      if (!form.pickupLocation) {
        showToast({
          type: "error",
          title: "Missing Information",
          message: "Please provide your pickup location",
        });
        return;
      }
    } else if (booking?.packageType !== "transfer" && !form.pickupLocation) {
      showToast({
        type: "error",
        title: "Missing Information",
        message: "Please provide your pickup location",
      });
      return;
    }

    if (!booking) {
      showToast({
        type: "error",
        title: "Error",
        message: "No booking information found",
      });
      return;
    }

    try {
      setIsLoading(true);

      // Prepare booking data for API
      const bookingData = {
        packageType: booking.packageType,
        packageId: booking.packageId,
        date: booking.date,
        time: booking.time,
        adults: booking.adults,
        children: booking.children,
        // For admin-defined pickup, use admin's pickup location; for user-defined, use user's input
        pickupLocation:
          booking?.packageType === "transfer" &&
          booking?.pickupOption === "admin"
            ? booking.pickupLocations || ""
            : form.pickupLocation,
        contactInfo: {
          name: form.name,
          email: form.email,
          phone: `${form.countryCode}${form.phone}`,
          whatsapp: `${form.countryCode}${form.phone}`,
        },
        subtotal: booking.totalPrice,
        total: booking.totalPrice,
        paymentInfo: {
          amount: booking.totalPrice,
          bankCharge: 0,
          currency: "MYR",
          paymentStatus: "pending",
        },
      };

      // Create booking via API
      console.log("Creating booking with data:", bookingData); // Debug log
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingData),
        }
      );

      const result = await response.json();
      console.log("Booking creation response:", result); // Debug log

      if (result.success) {
        showToast({
          type: "success",
          title: "Booking Confirmed!",
          message: "Your booking has been successfully created",
        });

        // Get the booking ID from the result - handle nested structure
        const bookingId =
          result.data?.data?._id ||
          result.data?._id ||
          result.data?.id ||
          result._id ||
          result.id;

        if (bookingId) {
          // Redirect to booking confirmation page with the ID
          router.push(`/booking/confirmation/${bookingId}`);
        } else {
          console.error("No booking ID found in response:", result);
          showToast({
            type: "error",
            title: "Error",
            message:
              "Booking created but unable to redirect to confirmation page",
          });
          router.push("/");
        }
      } else {
        showToast({
          type: "error",
          title: "Booking Failed",
          message: result.error || "Failed to create booking",
        });
      }
    } catch (error) {
      console.error("Booking error:", error);
      showToast({
        type: "error",
        title: "Error",
        message: "An error occurred while creating your booking",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const goToCheckout = () => {
    handleConfirmBooking();
  };

  // Calculate total for cart bookings
  const getCartTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce(
      (total, item) => total + (item.totalPrice || 0),
      0
    );
  };

  const getCartItemCount = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.length;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-12 py-6 grid grid-cols-1 md:grid-cols-3 gap-8 font-poppins">
      {/* Form Section */}
      <div className="md:col-span-2 order-1 md:-order-1">
        <h2 className="text-primary_green text-2xl font-bold mb-6">
          {isCartBooking ? "Complete your cart booking" : "Fill your details"}
        </h2>

        {isCartBooking && cart && cart.items.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">
              Booking {getCartItemCount()} item(s) from your cart
            </h3>
            <p className="text-sm text-blue-700">
              Total Amount: RM {getCartTotal().toFixed(2)}
            </p>
          </div>
        )}

        <div className="space-y-4">
          {/* Name and Email */}
          {["name", "email"].map((field) => (
            <div key={field} className="w-full">
              <input
                name={field}
                value={(form as any)[field]}
                onChange={handleChange}
                placeholder={`Enter your ${
                  field === "email" ? "email" : field
                }`}
                className="w-full border border-primary_green/40 rounded px-4 py-2 placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-primary_green"
              />
            </div>
          ))}

          {/* Pickup Location - Show for cart or conditional for single booking */}
          {isCartBooking ? (
            <div className="w-full">
              <input
                name="pickupLocation"
                value={form.pickupLocation}
                onChange={handleChange}
                placeholder="Enter your Hostel/Hotel name and address (optional - can be specified per item)"
                className="w-full border border-primary_green/40 rounded px-4 py-2 placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-primary_green"
              />
              <p className="text-xs text-gray-500 mt-1">
                This will be used as default pickup location for all items
                unless specified otherwise
              </p>
            </div>
          ) : (
            <>
              {booking?.packageType === "transfer" &&
              booking?.pickupOption === "admin" ? (
                // Admin-defined pickup location - show as read-only info
                <div className="w-full">
                  <div className="p-4 bg-gray-50 border border-primary_green/40 rounded">
                    <h4 className="font-medium text-primary_green mb-2">
                      Pickup Location:
                    </h4>
                    <div
                      className="prose max-w-none text-sm text-desc_gray"
                      dangerouslySetInnerHTML={{
                        __html: booking.pickupLocations,
                      }}
                    />
                  </div>
                  {/* Always show pickup description */}
                  {booking.pickupDescription && (
                    <div className="mt-3">
                      <div
                        className="prose max-w-none ttext-sm text-gray-600 leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: booking.pickupDescription,
                        }}
                      />
                    </div>
                  )}
                </div>
              ) : (
                // User-defined pickup location - show input field
                <div className="w-full">
                  <input
                    name="pickupLocation"
                    value={form.pickupLocation}
                    onChange={handleChange}
                    placeholder="Enter your Hostel/Hotel name and address"
                    className="w-full border border-primary_green/40 rounded px-4 py-2 placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-primary_green"
                  />
                  {/* Always show pickup description */}
                  {booking?.pickupDescription && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {booking.pickupDescription}
                      </p>
                    </div>
                  )}
                  {booking?.pickupLocations && (
                    <div className="mt-2">
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                        <h5 className="font-medium text-blue-800 mb-1 text-sm">
                          Pickup Guidelines:
                        </h5>
                        <div
                          className="prose max-w-none text-sm text-blue-700"
                          dangerouslySetInnerHTML={{
                            __html: booking.pickupLocations,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* WhatsApp Number Section */}
          <div>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                name="countryCode"
                value={form.countryCode}
                onChange={handleChange}
                className="sm:w-52 border border-primary_green/40 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary_green"
              >
                {countries.map((c) => (
                  <option key={c.cca2} value={c.callingCode}>
                    {c.name} ({c.callingCode})
                  </option>
                ))}
              </select>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter WhatsApp number"
                className="flex-1 border border-primary_green/40 rounded px-4 py-2 placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-primary_green"
              />
            </div>
          </div>
        </div>

        <button
          onClick={goToCheckout}
          disabled={isLoading || !isFormValid()}
          className="mt-6 w-full sm:w-auto px-6 py-3 bg-primary_green text-white rounded-md hover:bg-primary_green/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading
            ? isCartBooking
              ? "Creating Bookings..."
              : "Creating Booking..."
            : isCartBooking
            ? "Confirm Cart Booking"
            : "Confirm Booking"}
        </button>
      </div>

      {/* Booking Summary Panel */}
      {isCartBooking && cart ? (
        <div className="w-full">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Cart Summary
            </h3>

            <div className="space-y-3 mb-4">
              {cart.items.map((item, index) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span className="flex-1 truncate">
                    {(item as any).packageTitle || `Item ${index + 1}`}
                  </span>
                  <span className="font-medium">
                    RM {item.totalPrice.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">
                  Total ({getCartItemCount()} items)
                </span>
                <span className="font-bold text-primary_green text-lg">
                  RM {getCartTotal().toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={goToCheckout}
              disabled={isLoading || !isFormValid()}
              className="w-full mt-4 px-4 py-2 bg-primary_green text-white rounded-md hover:bg-primary_green/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Processing..." : "Confirm Booking"}
            </button>
          </div>
        </div>
      ) : (
        booking && (
          <div className="w-full">
            <BookingInfoPanel
              title={booking.title}
              date={new Date(booking.date)}
              time={booking.time}
              type={booking.type}
              duration={booking.duration}
              adults={booking.adults}
              children={booking.children}
              adultPrice={booking.adultPrice}
              childPrice={booking.childPrice}
              userInfo={true}
              totalPrice={booking.totalPrice}
              packageType={booking.packageType}
              onClick={goToCheckout}
            />
          </div>
        )
      )}
    </div>
  );
}
