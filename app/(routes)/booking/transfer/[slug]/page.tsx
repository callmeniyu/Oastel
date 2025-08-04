"use client";
import { useState, useEffect } from "react";
import BookingCalendar from "@/components/ui/BookingCalendar";
import BookingInfoPanel from "@/components/ui/BookingInfoPanel";
import { transferApi } from "@/lib/transferApi";
import { TransferType } from "@/lib/types";
import { useParams } from "next/navigation";
import { useBooking } from "@/context/BookingContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";

interface TimeSlot {
  time: string;
  capacity: number;
  bookedCount: number;
  isAvailable: boolean;
  minimumPerson: number;
  currentMinimum: number;
}

export default function BookingInfoPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { setBooking } = useBooking();
  const router = useRouter();
  const { showToast } = useToast();
  const [transferDetails, setTransferDetails] = useState<TransferType>();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [totalGuests, setTotalGuests] = useState(0);

  const [serverDateTime, setServerDateTime] = useState<{
    date: string;
    time: string;
    fullDateTime: Date;
  } | null>(null);

  useEffect(() => {
    const getTransferDetails = async () => {
      try {
        const response = await transferApi.getTransferBySlug(slug);

        if (response.success && response.data) {
          setTransferDetails(response.data);
          // Set initial values based on minimumPerson requirement
          const minimumPersons = response.data.minimumPerson || 1;
          setAdults(minimumPersons);
          setTotalGuests(minimumPersons);
          setChildren(0);
        } else {
          showToast({
            type: "error",
            title: "Error",
            message: "Failed to load transfer details",
          });
        }
      } catch (error) {
        console.error("Error fetching transfer:", error);
        showToast({
          type: "error",
          title: "Error",
          message: "Failed to load transfer details",
        });
      }
    };
    if (slug) {
      getTransferDetails();
    }
  }, [slug, showToast]);

  const fetchTimeSlots = async () => {
    if (!transferDetails?._id) return;

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
        `${process.env.NEXT_PUBLIC_API_URL}/api/timeslots/available?packageType=transfer&packageId=${transferDetails._id}&date=${dateString}`
      );
      const data = await response.json();

      if (data.success) {
        const slots = Array.isArray(data.data) ? data.data : [];
        setTimeSlots(slots);

        // Auto-select first available time slot only if none selected and slots are available
        if (slots.length > 0 && !selectedTime) {
          const firstAvailableSlot = slots.find(
            (slot: any) =>
              slot.isAvailable && slot.capacity - slot.bookedCount > 0
          );
          if (firstAvailableSlot) {
            setSelectedTime(firstAvailableSlot.time);
          }
        }

        // Clear selected time if it's no longer available
        if (selectedTime) {
          const currentSlot = slots.find(
            (slot: any) => slot.time === selectedTime
          );
          if (
            !currentSlot ||
            !currentSlot.isAvailable ||
            currentSlot.capacity - currentSlot.bookedCount <= 0
          ) {
            setSelectedTime("");
          }
        }
      } else {
        setTimeSlots([]);
        setSelectedTime(""); // Clear selection when no slots available
        console.error("Failed to fetch time slots:", data.message);
      }
    } catch (error) {
      console.error("Error fetching time slots:", error);
      setTimeSlots([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeSlots();
  }, [selectedDate, transferDetails?._id]);

  const updateAdults = (newCount: number) => {
    if (!transferDetails) return;

    const newTotal = newCount + children;
    if (
      newCount >= (transferDetails.minimumPerson || 1) &&
      newTotal <= (transferDetails.maximumPerson || Infinity)
    ) {
      setAdults(newCount);
      setTotalGuests(newTotal);
    }
  };

  const updateChildren = (newCount: number) => {
    if (!transferDetails) return;

    const newTotal = adults + newCount;
    const minimumRequired = transferDetails.minimumPerson || 1;

    if (
      newCount >= 0 &&
      newTotal >= minimumRequired &&
      newTotal <= (transferDetails.maximumPerson || Infinity)
    ) {
      setChildren(newCount);
      setTotalGuests(newTotal);
    }
  };

  useEffect(() => {
    if (totalGuests >= (transferDetails?.maximumPerson || Infinity)) {
      showToast({
        type: "error",
        title: "You have reached the maximum number of guests.",
        message: "Please try contacting us for if more tickets.",
      });
    }
  }, [adults, children]);

  const handleContinue = () => {
    if (!transferDetails) return;

    // Check if date and time are selected
    if (!selectedDate) {
      showToast({
        type: "error",
        title: "Date Required",
        message: "Please select a date for your booking",
      });
      return;
    }

    if (!selectedTime) {
      showToast({
        type: "error",
        title: "Time Required",
        message: "Please select a time slot for your booking",
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

    // Check minimum person requirement for this specific slot
    if (totalGuests < selectedSlot.currentMinimum) {
      showToast({
        type: "error",
        title: `Minimum ${selectedSlot.currentMinimum} ${
          selectedSlot.currentMinimum > 1 ? "persons" : "person"
        } required`,
        message: `This transfer requires a minimum of ${
          selectedSlot.currentMinimum
        } ${selectedSlot.currentMinimum > 1 ? "persons" : "person"}.`,
      });
      return;
    }

    // Check capacity
    const availableSlots = selectedSlot.capacity - selectedSlot.bookedCount;
    if (totalGuests > availableSlots) {
      showToast({
        type: "error",
        title: "Not enough capacity",
        message: `Only ${availableSlots} slots available for this time.`,
      });
      return;
    }

    const totalPrice = calculateTotalPrice();
    setBooking({
      packageId: transferDetails._id || "",
      title: transferDetails.title,
      slug: slug,
      date: selectedDate.toISOString(),
      time: selectedTime,
      type: transferDetails.type || "Private transfer",
      duration: transferDetails.duration || "4-6 hours",
      adults,
      children,
      adultPrice: transferDetails.newPrice || 0,
      childPrice: transferDetails.childPrice || 0,
      totalPrice: totalPrice,
      total: totalPrice,
      pickupLocations: transferDetails.details.pickupLocations || "",
      pickupOption: transferDetails.details.pickupOption || "user", // Include pickup option
      packageType: "transfer",
    });
    router.push("/booking/user-info");
  };

  // Calculate total price based on ticket type
  const calculateTotalPrice = () => {
    if (!transferDetails) return 0;
    return (
      adults * (transferDetails.newPrice || 0) +
      children * (transferDetails.childPrice || 0)
    );
  };

  useEffect(() => {
    const fetchServerDateTime = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/timeslots/server-datetime`
        );
        const data = await response.json();
        if (data.success) {
          setServerDateTime(data.data);
        }
      } catch (error) {
        console.error("Error fetching server date/time:", error);
      }
    };
    fetchServerDateTime();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-6 font-poppins">
      {/* Server Date/Time Display - green themed, at top */}
      {serverDateTime && (
        <div className="col-span-1 md:col-span-3 bg-primary_green/10 border border-primary_green rounded-lg p-3 mb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm">
            <span className="text-primary_green font-medium">
              🕒 Time (Malaysia): {serverDateTime?.time || "-"}
            </span>
            <span className="text-primary_green">
              📅 Current Date:{" "}
              {new Date(serverDateTime.fullDateTime).toLocaleDateString(
                "en-US",
                {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  timeZone: "Asia/Kuala_Lumpur",
                }
              )}
            </span>
          </div>
        </div>
      )}
      <div className="space-y-6 md:col-span-2">
        <div className="flex flex-col md:flex-row gap-6">
          <BookingCalendar
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
          <div className="w-full flex flex-col rounded-lg shadow-md p-4 bg-white">
            <h3 className="text-primary_green text-xl font-bold mb-2">
              Select your time
            </h3>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin h-6 w-6 border-2 border-primary_green border-t-transparent rounded-full"></div>
              </div>
            ) : timeSlots.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No available time slots for this date.</p>
                <p className="text-sm mt-1">Please select a different date.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {timeSlots.map((slot) => {
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
                })}
              </div>
            )}
            {timeSlots.length > 0 && (
              <div className="mt-3 space-y-1">
                <p className="text-desc_gray text-sm">
                  Times shown are in Malaysia timezone (GMT+8)
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-lg shadow-md p-4 bg-white">
          <h3 className="text-primary_green text-xl font-bold mb-2">
            No. of Guests
          </h3>

          <div className="space-y-6 border p-3 rounded-lg my-4">
            {[
              {
                label: "Adults",
                desc: `Minimum: ${transferDetails?.minimumPerson} person per group.`,
                value: adults,
                onIncrement: () => updateAdults(adults + 1),
                onDecrement: () => updateAdults(adults - 1),
                disableDecrement:
                  adults <= (transferDetails?.minimumPerson || 1),
                disableIncrement:
                  totalGuests >= (transferDetails?.maximumPerson || Infinity),
                price: transferDetails?.newPrice || 0,
              },
              ...(transferDetails?.type !== "Private"
                ? [
                    {
                      label: "Children",
                      desc: "Ages 3-11. Children under 3 travel free.",
                      value: children,
                      onIncrement: () => updateChildren(children + 1),
                      onDecrement: () => updateChildren(children - 1),
                      disableDecrement:
                        children <= 0 ||
                        adults + children <=
                          (transferDetails?.minimumPerson || 1),
                      disableIncrement:
                        totalGuests >=
                        (transferDetails?.maximumPerson || Infinity),
                      price: transferDetails?.childPrice || 0,
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
                        (RM {price}{" "}
                        {transferDetails?.type === "Private"
                          ? "/group"
                          : "/person"}
                        )
                      </span>
                    </p>
                    <div className="space-y-1 mt-1">
                      <p className="text-xs text-desc_gray font-light">
                        {desc}
                      </p>
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
                      <span className="min-w-[24px] text-center">{value}</span>
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
                      RM {value * price}
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <BookingInfoPanel
        title={transferDetails?.title || "Transfer Title"}
        date={selectedDate}
        time={selectedTime}
        type={transferDetails?.type || "Private transfer"}
        duration={transferDetails?.duration || "4-6 hours"}
        adults={adults}
        children={children}
        adultPrice={transferDetails?.newPrice || 0}
        childPrice={transferDetails?.childPrice || 0}
        totalPrice={calculateTotalPrice()}
        onClick={handleContinue}
        packageType="transfer"
        packageId={transferDetails?._id}
        disabled={!selectedTime || isLoading}
      />
    </div>
  );
}
