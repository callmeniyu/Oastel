"use client";
import { useState, useEffect } from "react";
import BookingCalendar from "@/components/ui/BookingCalendar";
import BookingInfoPanel from "@/components/ui/BookingInfoPanel";
import { TourType } from "@/lib/types";
import { useParams } from "next/navigation";
import { useBooking } from "@/context/BookingContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";

type TimeSlot = {
  time: string;
  isAvailable: boolean;
  bookedCount: number;
  capacity: number;
  minimumPerson: number; // Database stored value - changes after first booking
  currentMinimum: number; // Effective minimum for validation - use this for UI logic
};

export default function BookingInfoPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { setBooking } = useBooking();
  const router = useRouter();
  const { showToast } = useToast();

  // State for server date/time
  const [serverDateTime, setServerDateTime] = useState<{
    date: string;
    time: string;
    longDate: string;
    fullDateTime: Date;
  } | null>(null);

  // Calculate minimum booking date based on server time - always allow booking from tomorrow
  const getMinimumBookingDate = () => {
    if (serverDateTime) {
      const serverDate = new Date(serverDateTime.fullDateTime);
      const minDate = new Date(serverDate);
      minDate.setDate(serverDate.getDate() + 1);
      minDate.setHours(0, 0, 0, 0); // Reset to start of day
      return minDate;
    } else {
      // Fallback to local time if server time not available yet
      const now = new Date();
      const minDate = new Date();
      minDate.setDate(now.getDate() + 1);
      minDate.setHours(0, 0, 0, 0);
      return minDate;
    }
  };

  const [tourDetails, setTourDetails] = useState<TourType>();
  const [selectedDate, setSelectedDate] = useState(() => {
    // Initialize with tomorrow to avoid initial load with today's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  });
  const [selectedTime, setSelectedTime] = useState("");
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [initialDateSet, setInitialDateSet] = useState(false);

  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [totalGuests, setTotalGuests] = useState(0);

  // Function to find next available date with time slots
  const findNextAvailableDate = async (tourId: string, startDate: Date) => {
    const maxDaysToCheck = 30; // Check up to 30 days ahead
    const currentDate = new Date(startDate);

    for (let i = 0; i < maxDaysToCheck; i++) {
      const dateString =
        currentDate.getFullYear() +
        "-" +
        String(currentDate.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(currentDate.getDate()).padStart(2, "0");

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/timeslots/available?packageType=tour&packageId=${tourId}&date=${dateString}`
        );
        const data = await response.json();

        if (data.success) {
          const slots = Array.isArray(data.data) ? data.data : [];
          // Check if there are any available slots
          const hasAvailableSlots = slots.some(
            (slot: TimeSlot) =>
              slot.isAvailable && slot.capacity - slot.bookedCount > 0
          );

          if (hasAvailableSlots) {
            console.log(`📅 Found available slots on ${dateString}`);
            return currentDate;
          }
        }
      } catch (error) {
        console.error(`Error checking date ${dateString}:`, error);
      }

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // If no available date found, return the start date
    console.log(`❌ No available slots found in next ${maxDaysToCheck} days`);
    return startDate;
  };

  // Fetch server date/time on component mount
  useEffect(() => {
    const fetchServerDateTime = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/timeslots/server-datetime`
        );
        const data = await response.json();
        console.log("Server DateTime API Response:", data); // Debug log

        if (data.success) {
          setServerDateTime(data.data);
          // Note: Don't set selectedDate here - let getTourDetails handle it
          console.log(`📅 Server datetime fetched: ${data.data.fullDateTime}`);
        }
      } catch (error) {
        console.error("Error fetching server date/time:", error);
        // Fallback to local time
        setSelectedDate(getMinimumBookingDate());
      }
    };

    fetchServerDateTime();
  }, []);

  useEffect(() => {
    const getTourDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/tours/slug/${slug}`
        );
        const data = await response.json();

        if (data.success) {
          const tour = data.data;
          setTourDetails(tour);
          // Always start with 8 adults for private tours
          const initialAdults =
            tour.type === "private" ? 8 : tour.minimumPerson || 1;
          setAdults(initialAdults);
          setTotalGuests(initialAdults);

          // Set initial date to next available date with slots
          if (!initialDateSet && tour._id) {
            console.log(
              `🔍 DEBUG: About to find next available date. initialDateSet=${initialDateSet}, tour._id=${tour._id}`
            );
            const minDate = new Date();
            minDate.setDate(minDate.getDate() + 1);
            minDate.setHours(0, 0, 0, 0);
            console.log(
              `🔍 Looking for next available date starting from ${minDate.toDateString()}`
            );

            try {
              const nextAvailableDate = await findNextAvailableDate(
                tour._id,
                minDate
              );
              console.log(
                `📅 Setting tour date to: ${nextAvailableDate.toDateString()}`
              );
              setSelectedDate(nextAvailableDate);
              setInitialDateSet(true);
              console.log(
                `✅ DEBUG: Date set successfully, initialDateSet now true`
              );
            } catch (error) {
              console.error(`❌ Error in findNextAvailableDate:`, error);
            }
          } else {
            console.log(
              `⏸️ DEBUG: Skipping date finding. initialDateSet=${initialDateSet}, tour._id=${
                tour._id || "undefined"
              }`
            );
          }
        } else {
          showToast({
            type: "error",
            title: "Error",
            message: "Failed to load tour details",
          });
        }
      } catch (error) {
        console.error("Error fetching tour:", error);
        showToast({
          type: "error",
          title: "Error",
          message: "Failed to load tour details",
        });
      }
    };
    if (slug) {
      getTourDetails();
    }
  }, [slug, showToast]);

  const fetchTimeSlots = async () => {
    if (!tourDetails?._id) {
      console.log(`⏸️ fetchTimeSlots skipped - no tour details ID`);
      return;
    }

    console.log(
      `🔄 fetchTimeSlots called for tour ${
        tourDetails._id
      } on date ${selectedDate.toDateString()}, current selectedTime: ${
        selectedTime || "none"
      }`
    );

    try {
      setIsLoading(true);
      // Format date to ensure consistent timezone handling
      const dateString =
        selectedDate.getFullYear() +
        "-" +
        String(selectedDate.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(selectedDate.getDate()).padStart(2, "0");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/timeslots/available?packageType=tour&packageId=${tourDetails._id}&date=${dateString}`
      );
      const data = await response.json();

      if (data.success) {
        // The backend now returns the slots directly as an array
        const slots = Array.isArray(data.data) ? data.data : [];

        // Debug: Log slot data to verify minimumPerson values being used for validation
        slots.forEach((slot: TimeSlot) => {
          console.log(
            `🎯 Frontend Slot ${slot.time}: bookedCount=${slot.bookedCount}, minimumPerson=${slot.minimumPerson}, currentMinimum=${slot.currentMinimum}`
          );
          console.log(
            `   ✅ Using minimumPerson (${slot.minimumPerson}) for validation logic`
          );
        });

        setTimeSlots(slots);

        // Auto-select first available slot if none is currently selected
        if (slots.length > 0 && !selectedTime) {
          const firstAvailableSlot = slots.find(
            (slot: TimeSlot) =>
              slot.isAvailable && slot.capacity - slot.bookedCount > 0
          );
          if (firstAvailableSlot) {
            console.log(
              `🎯 Auto-selecting first available slot: ${firstAvailableSlot.time}`
            );
            setSelectedTime(firstAvailableSlot.time);
          } else {
            console.log(`❌ No available slots found for auto-selection`);
          }
        } else if (selectedTime) {
          console.log(
            `⏸️ Skipping auto-selection - slot already selected: ${selectedTime}`
          );
        } else if (slots.length === 0) {
          console.log(`⏸️ Skipping auto-selection - no slots available`);
        }

        // Clear selected time if it's no longer available
        if (selectedTime) {
          const currentSlot = slots.find(
            (slot: TimeSlot) => slot.time === selectedTime
          );
          if (
            !currentSlot ||
            !currentSlot.isAvailable ||
            currentSlot.capacity - currentSlot.bookedCount <= 0
          ) {
            console.log(
              `🧹 Clearing unavailable selected time: ${selectedTime}`
            );
            setSelectedTime("");
          }
        }
      } else {
        console.error("Failed to load time slots:", data.message);
        setTimeSlots([]);
        setSelectedTime(""); // Clear selection when no slots available
        // Don't show any toast errors - just silently handle no slots
      }
    } catch (error) {
      console.error("Error fetching time slots:", error);
      setTimeSlots([]);
      setSelectedTime(""); // Clear selection on error
      // Don't show any toast errors - just silently handle errors
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeSlots();

    // Set up auto-refresh for time slots every 30 seconds when a date is selected
    const autoRefreshInterval = setInterval(() => {
      if (tourDetails?._id && selectedDate) {
        fetchTimeSlots();
      }
    }, 60000); // 60 seconds

    // Cleanup interval on component unmount or dependency change
    return () => clearInterval(autoRefreshInterval);
  }, [selectedDate, tourDetails?._id, showToast]);

  // Update adults count when slot is selected to meet minimum requirement
  useEffect(() => {
    if (selectedTime && timeSlots.length > 0 && tourDetails) {
      const selectedSlot = timeSlots.find((slot) => slot.time === selectedTime);
      if (selectedSlot && tourDetails.type !== "private") {
        const slotMinimum = selectedSlot.minimumPerson;
        const currentTotal = adults + children;

        console.log(
          `🔍 Slot selected: ${selectedTime}, SlotMinimum: ${slotMinimum}, CurrentAdults: ${adults}, CurrentChildren: ${children}, CurrentTotal: ${currentTotal}`
        );

        // Always reset adults to slot minimum when slot changes (unless user has manually set more)
        // This ensures adults start at the correct value for each slot
        if (adults !== slotMinimum) {
          const newAdults = Math.max(slotMinimum, 1);
          console.log(
            `🔄 Resetting adults from ${adults} to ${newAdults} for slot minimum (${slotMinimum})`
          );
          setAdults(newAdults);
          setTotalGuests(newAdults + children);
        }
      }
    }
  }, [selectedTime, timeSlots, tourDetails]); // Removed children dependency to reset properly

  // Calculate price per person for private tours (newPrice / 8)
  const getAdultPrice = () => {
    if (!tourDetails) return 0;
    return tourDetails.type === "private"
      ? (tourDetails.newPrice || 0) / 8
      : tourDetails.newPrice || 0;
  };

  // Get available capacity for selected time slot
  const getAvailableCapacity = () => {
    if (!selectedTime || !selectedDate) return 0;

    const selectedSlot = timeSlots.find((slot) => slot.time === selectedTime);
    if (!selectedSlot) return 0;

    return selectedSlot.capacity - selectedSlot.bookedCount;
  };

  const updateAdults = (newCount: number) => {
    if (!tourDetails) return;

    // Get available capacity from selected time slot
    const availableCapacity = getAvailableCapacity();

    // Get minimum person requirement for selected time slot
    const selectedSlot = timeSlots.find((slot) => slot.time === selectedTime);
    const minimumRequired = selectedSlot
      ? selectedSlot.minimumPerson // Use slot's minimumPerson directly
      : tourDetails.minimumPerson || 1;

    if (tourDetails.type === "private") {
      // Only allow increments of 8 for private tours
      if (
        newCount % 8 === 0 &&
        newCount >= 8 &&
        newCount <= (tourDetails.maximumPerson || Infinity) &&
        newCount <= availableCapacity
      ) {
        setAdults(newCount);
        setTotalGuests(newCount);
      }
    } else {
      const newTotal = newCount + children;
      if (
        newCount >= Math.max(1, minimumRequired - children) && // Ensure adults + children meets minimum
        newTotal <= (tourDetails.maximumPerson || Infinity) &&
        newTotal <= availableCapacity
      ) {
        setAdults(newCount);
        setTotalGuests(newTotal);
      }
    }
  };

  const updateChildren = (newCount: number) => {
    if (!tourDetails || tourDetails.type === "private") return;

    // Get available capacity from selected time slot
    const availableCapacity = getAvailableCapacity();

    // Get minimum person requirement for selected time slot
    const selectedSlot = timeSlots.find((slot) => slot.time === selectedTime);
    const minimumRequired = selectedSlot
      ? selectedSlot.minimumPerson // Use slot's minimumPerson directly
      : tourDetails.minimumPerson || 1;

    const newTotal = adults + newCount;

    if (
      newTotal >= minimumRequired && // Ensure total meets minimum requirement
      newTotal <= (tourDetails.maximumPerson || Infinity) &&
      newTotal <= availableCapacity
    ) {
      setChildren(newCount);
      setTotalGuests(newTotal);
    }
  };

  useEffect(() => {
    if (totalGuests >= (tourDetails?.maximumPerson || Infinity)) {
      showToast({
        type: "error",
        title: "You have reached the maximum number of guests.",
        message: "Please try contacting us for if more tickets.",
      });
    }
  }, [adults, children]);

  const handleContinue = () => {
    if (!tourDetails) return;

    // Check if date and time are selected
    if (!selectedDate) {
      showToast({
        type: "error",
        title: "Date Required",
        message: "Please select a date for your booking",
      });
      return;
    }

    const selectedSlot = timeSlots.find((slot) => slot.time === selectedTime);
    if (!selectedSlot) {
      showToast({
        type: "error",
        title: "Invalid time slot",
        message: "Please select a valid time slot",
      });
      return;
    }

    const totalGuests = adults + children;

    // Check minimum person requirement for this specific slot - USE minimumPerson
    if (totalGuests < selectedSlot.minimumPerson) {
      const isFirstBooking = selectedSlot.bookedCount === 0;
      showToast({
        type: "error",
        title: "Minimum guests required",
        message: `Minimum ${selectedSlot.minimumPerson} person${
          selectedSlot.minimumPerson > 1 ? "s" : ""
        } required for this ${isFirstBooking ? "first booking" : "booking"}`,
      });
      return;
    }

    if (totalGuests > selectedSlot.capacity - selectedSlot.bookedCount) {
      showToast({
        type: "error",
        title: "Not enough capacity",
        message:
          "Selected time slot doesn't have enough capacity for your group",
      });
      return;
    }

    const totalPrice = calculateTotalPrice();

    // Fix date handling to prevent offset issues
    const bookingDate = new Date(selectedDate);
    // Ensure the date is set to noon to avoid timezone issues
    bookingDate.setHours(12, 0, 0, 0);

    setBooking({
      packageId: tourDetails._id,
      title: tourDetails.title,
      slug: slug,
      date: bookingDate.toISOString(), // Use full ISO string to preserve date
      time: selectedTime,
      type: tourDetails.type || "Private Tour",
      duration: tourDetails.duration || "4-6 hours",
      adults,
      children,
      adultPrice: getAdultPrice(),
      childPrice: tourDetails.childPrice || 0,
      totalPrice: totalPrice,
      total: totalPrice,
      packageType: "tour",
      image: tourDetails.image || "",
      transport: tourDetails.type === "private" ? "Private" : undefined,
      pickupLocations:
        tourDetails.details.pickupGuidelines ||
        tourDetails.details.pickupLocation ||
        "",
    });
    router.push("/booking/user-info");
  };

  // Calculate total price based on tour type
  const calculateTotalPrice = () => {
    if (!tourDetails) return 0;
    return tourDetails.type === "private"
      ? (adults / 8) * (tourDetails.newPrice || 0)
      : adults * (tourDetails.newPrice || 0) +
          children * (tourDetails.childPrice || 0);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-6 font-poppins">
      {/* Server Date/Time Display - now green themed */}
      {serverDateTime && (
        <div className="col-span-1 md:col-span-3 bg-primary_green/10 border border-primary_green rounded-lg p-3 mb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm">
            <span className="text-primary_green font-medium">
              🕒 Time (Malaysia): {serverDateTime?.time || "-"}
            </span>
            <span className="text-primary_green">
              📅 Current Date: {serverDateTime?.longDate || "-"}
            </span>
          </div>
        </div>
      )}

      <div className="space-y-6 md:col-span-2">
        <div className="flex flex-col md:flex-row gap-6">
          <BookingCalendar
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            minDate={getMinimumBookingDate()}
            serverDateTime={serverDateTime}
          />

          <div className="w-full flex flex-col rounded-lg shadow-md p-4 bg-white">
            <h3 className="text-primary_green text-xl font-bold mb-2">
              Select your time
            </h3>
            <div className="flex flex-col gap-2 ">
              {isLoading ? (
                <div className="flex justify-center">
                  <div className="animate-spin h-8 w-8 border-4 border-primary_green border-t-transparent rounded-full"></div>
                </div>
              ) : timeSlots.length > 0 ? (
                timeSlots.map((slot) => {
                  const availableSeats = slot.capacity - slot.bookedCount;
                  const isSlotAvailable =
                    slot.isAvailable && availableSeats > 0;
                  // Format time to 12-hour
                  const slotTime = new Date(`1970-01-01T${slot.time}`);
                  const formattedTime = slotTime.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  });
                  return (
                    <button
                      key={slot.time}
                      className={`px-4 py-3 rounded border text-left transition-colors ${
                        selectedTime === slot.time
                          ? "bg-primary_green text-white border-primary_green"
                          : isSlotAvailable
                          ? "bg-white border-gray-200 hover:border-primary_green"
                          : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                      onClick={() =>
                        isSlotAvailable && setSelectedTime(slot.time)
                      }
                      disabled={!isSlotAvailable}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{formattedTime}</span>
                        <span className="text-sm">
                          {availableSeats} seats left
                        </span>
                      </div>
                    </button>
                  );
                })
              ) : (
                <p className="text-desc_gray text-sm my-1">
                  No time slots available for this date
                </p>
              )}
            </div>
            {timeSlots.length > 0 && (
              <div className="mt-3 space-y-1">
                <p className="text-desc_gray text-sm">
                  Times shown are in Malaysia timezone (GMT+8)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Show guest selection only when a time slot is selected */}
        {selectedTime && (
          <div className="rounded-lg shadow-md p-4 bg-white">
            <h3 className="text-primary_green text-xl font-bold mb-2">
              No. of Guests
            </h3>

            {/* Show minimum requirement for selected slot */}
            {(() => {
              const selectedSlot = timeSlots.find(
                (slot) => slot.time === selectedTime
              );
              if (selectedSlot) {
                const isFirstBooking = selectedSlot.bookedCount === 0;
                return (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700">
                      <span className="font-medium">Selected Time:</span>{" "}
                      {selectedTime} |
                      <span className="font-medium"> Minimum Required:</span>{" "}
                      {selectedSlot.minimumPerson} person
                      {selectedSlot.minimumPerson > 1 ? "s" : ""} |
                      <span className="font-medium"> Available:</span>{" "}
                      {selectedSlot.capacity - selectedSlot.bookedCount} seats
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      {isFirstBooking
                        ? `This is the first booking for this slot (requires ${selectedSlot.minimumPerson} minimum)`
                        : `This slot already has bookings (minimum reduced to ${selectedSlot.minimumPerson})`}
                    </p>
                  </div>
                );
              }
              return null;
            })()}

            <div className="space-y-6 border p-3 rounded-lg my-4">
              {[
                {
                  label: tourDetails?.type === "private" ? "Group" : "Adults",
                  desc: [
                    tourDetails?.type === "private"
                      ? "Maximum: 8 persons per group. Increments by 8."
                      : (() => {
                          const selectedSlot = timeSlots.find(
                            (slot) => slot.time === selectedTime
                          );
                          const slotMinimum =
                            selectedSlot?.minimumPerson ||
                            tourDetails?.minimumPerson ||
                            1;
                          return `Minimum: ${slotMinimum} person${
                            slotMinimum > 1 ? "s" : ""
                          } for selected time slot.`;
                        })(),
                  ],
                  value: adults,
                  onIncrement: () =>
                    tourDetails?.type === "private"
                      ? updateAdults(adults + 8)
                      : updateAdults(adults + 1),
                  onDecrement: () =>
                    tourDetails?.type === "private"
                      ? updateAdults(adults - 8)
                      : updateAdults(adults - 1),
                  disableDecrement:
                    tourDetails?.type === "private"
                      ? adults <= 8
                      : (() => {
                          const selectedSlot = timeSlots.find(
                            (slot) => slot.time === selectedTime
                          );
                          const slotMinimum = selectedSlot?.minimumPerson || 1;
                          return adults <= Math.max(1, slotMinimum - children);
                        })(),
                  disableIncrement:
                    totalGuests >= (tourDetails?.maximumPerson || Infinity) ||
                    totalGuests >= getAvailableCapacity() ||
                    (tourDetails?.type === "private" &&
                      adults + 8 > getAvailableCapacity()),
                  price: getAdultPrice(),
                },
                ...(tourDetails?.type !== "private"
                  ? [
                      {
                        label: "Child",
                        desc: [
                          "Age between 3 to 7 years. Child seats are not provided",
                        ],
                        value: children,
                        onIncrement: () => updateChildren(children + 1),
                        onDecrement: () => updateChildren(children - 1),
                        disableDecrement: children <= 0,
                        disableIncrement:
                          totalGuests >=
                            (tourDetails?.maximumPerson || Infinity) ||
                          totalGuests >= getAvailableCapacity(),
                        price: tourDetails?.childPrice || 0,
                      },
                    ]
                  : []),
              ].map(
                ({
                  label,
                  value,
                  price,
                  desc,
                  onIncrement,
                  onDecrement,
                  disableIncrement,
                  disableDecrement,
                }) => (
                  <div
                    key={label}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                  >
                    <div className="flex-1">
                      <p className="font-semibold">
                        {label}{" "}
                        <span className="text-sm text-desc_gray">
                          {label === "Group"
                            ? "Group (Price for entire group (1-8 members))"
                            : `(RM ${price})`}
                        </span>
                      </p>
                      <div className="space-y-1 mt-1">
                        {desc.map((d, index) => (
                          <p
                            key={index}
                            className="text-xs text-desc_gray font-light"
                          >
                            {d}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-normal gap-6 w-full md:w-auto">
                      <div className="flex items-center gap-2 border rounded-full">
                        <button
                          onClick={onDecrement}
                          disabled={disableDecrement}
                          className={`px-3 py-1.5 rounded-l-xl text-lg ${
                            disableDecrement
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "hover:bg-primary_green hover:text-white"
                          }`}
                        >
                          -
                        </button>
                        <span className="min-w-[24px] text-center">
                          {value}
                        </span>
                        <button
                          onClick={onIncrement}
                          disabled={disableIncrement}
                          className={`px-3 py-1.5 rounded-r-xl text-lg ${
                            disableIncrement
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "hover:bg-primary_green hover:text-white"
                          }`}
                        >
                          +
                        </button>
                      </div>

                      <span className="font-semibold text-primary_green min-w-[80px] text-right">
                        {tourDetails?.type === "private"
                          ? `RM ${(value / 8) * (tourDetails.newPrice || 0)}`
                          : `RM ${value * price}`}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Show message when no slot is selected */}
        {!selectedTime && (
          <div className="rounded-lg shadow-md p-4 bg-gray-50 border-2 border-dashed border-gray-300">
            <h3 className="text-gray-500 text-xl font-bold mb-2">
              No. of Guests
            </h3>
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">
                👆 Please select a time slot first
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Guest selection will appear after choosing your preferred time
              </p>
            </div>
          </div>
        )}
      </div>

      <BookingInfoPanel
        title={tourDetails?.title || "Tour Title"}
        date={selectedDate}
        time={selectedTime}
        type={tourDetails?.type || "Private Tour"}
        duration={tourDetails?.duration || "4-6 hours"}
        adults={adults}
        children={children}
        adultPrice={getAdultPrice()}
        childPrice={tourDetails?.childPrice || 0}
        totalPrice={calculateTotalPrice()}
        onClick={handleContinue}
        packageType="tour"
        packageId={tourDetails?._id}
        disabled={!selectedDate || !selectedTime}
        transferDetails={{
          pickupOption: "user",
          pickupLocations: "",
        }}
      />
    </div>
  );
}
