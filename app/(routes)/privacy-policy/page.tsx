"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

type TermItem = {
  title: string;
  content: string[];
  id: string;
};

export default function TermsAndConditions() {
  const termsData: TermItem[] = [
    {
      title: "Confirmation",
      content: [
        "A booking confirmation will be sent automatically to the guest’s registered email after successful payment.",
        "Guests must present their booking confirmation during check-in. Both printed and mobile versions are accepted, but the confirmation must clearly show the guest name, dates, and booking details.",
        "For tours and transport services, guests are required to show proof of booking before boarding or joining. Failure to provide confirmation may result in denial of service.",
        "Guests are responsible for ensuring that their booking information is correct. Any errors must be reported to Oastel or the service provider immediately.",
      ],
      id: "confirmation",
    },
    {
      title: "Cancellation Policy",
      content: [
        "For accommodation bookings with Oastel, cancellations must be requested in writing through email or the official booking platform used at the time of reservation.",
        "Refund eligibility depends on the type of booking, the cancellation period, and the terms agreed upon during reservation. Some bookings may be non-refundable.",
        "No-shows without prior notice will be charged the full booking amount.",
        "For transfer and Tours tickets booked through oastel, all cancellations, rescheduling, and refund requests must be handled directly via the oastel website under the Manage Booking section. Oastel is not responsible for refunds or changes to oastel bookings.",
        "Oastel does not cover costs related to cancellations caused by weather, transportation delays, or unforeseen circumstances beyond its control.",
      ],
      id: "cancellation",
    },
    {
      title: "Hotel Pick-Up Information",
      content: [
        "Land Rover tours Free or included pick-up service is only available for hotels and guest houses located in Tanah Rata, Golden Hills, Brinchang, and Kea Farm.",
        "Guests staying outside of these areas must arrange their own transport to the designated meeting or pick-up point.",
        "-Mini Transfer Pick-Up Policy-",
        "Mini transfer pick-up service is only available for hotels and guest houses located within Tanah Rata town area.",
        "Guests staying outside Tanah Rata must arrange their own transport to the designated meeting point.",
        "Guests are expected to be ready at the hotel lobby or pick-up point at least 5minutes before the scheduled time. Drivers may only wait for a short period to avoid delays.",
        "Pick-up and drop-off times may vary due to traffic and weather conditions. Oastel is not liable for delays caused by such external factors.",
      ],
      id: "pickup",
    },
    {
      title: "Prohibitions & Limitations",
      content: [
        "Smoking, alcohol, and illegal substances are strictly prohibited inside Oastel property, transport vehicles, and during guided tours.",
        "Only registered guests are allowed in the rooms. Any unregistered visitors or additional guests require prior approval from Oastel management.",
        "Each room has a maximum occupancy limit based on the booking details. Exceeding this limit without permission is not allowed.",
        "Unauthorized entry, damage to property, or violation of house rules may result in fines of up to RM500 and possible eviction without refund.",
        "Guests must not engage in behavior that disturbs other guests, staff, or the local community.",
      ],
      id: "limitations",
    },
    {
      title: "Accessibility",
      content: [
        "While Oastel welcomes all guests, some tours and activities may not be suitable for people with limited mobility due to uneven terrain, steep trails, or natural landscapes.",
        "Wheelchair access may be limited in certain areas of the property or on selected tours.",
        "Guests with medical conditions, physical limitations, or special requirements are advised to inform Oastel before booking so that necessary arrangements can be considered.",
        "Oastel will make reasonable efforts to accommodate special needs, but accessibility cannot be guaranteed for all services.",
      ],
      id: "accessibility",
    },
    {
      title: "Important Notes",
      content: [
        "Guests must respect Oastel property, staff, and fellow travelers at all times. Disruptive or inappropriate behavior may result in removal from the premises or activities without refund.",
        "Entrance fees, food, and beverages are not included in room rates or tour prices unless explicitly stated.",
        "It is the guest’s responsibility to bring valid identification and booking confirmation in English for verification at check-in or before joining a tour.",
        "Oastel is not responsible for loss, theft, or damage to guests’ personal belongings during their stay or while participating in activities. Guests are encouraged to keep valuables secure.",
        "Travel insurance is strongly recommended for all guests to cover medical needs, trip cancellations, and personal belongings.",
        "For transfer and tours bookings made through oastel, customer service is available daily from 9 AM to 10 PM via their official WhatsApp. Guests may also use the 24/7 online Help Centre provided by oastel for urgent matters.",
        "By confirming a booking, guests agree to comply with all Oastel policies and local laws during their stay and activities.",
      ],
      id: "notes",
    },
  ];

  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    () => {
      const allExpanded: Record<string, boolean> = {};
      termsData.forEach((term) => {
        allExpanded[term.id] = true;
      });
      return allExpanded;
    }
  );
  const [fromBooking, setFromBooking] = useState(false);

  const [fromTour, setFromTour] = useState(false);

  useEffect(() => {
    const state = window.history.state;
    console.log("Navigated from booking page", state.fromBookingPage);
    if (state?.fromBookingPage) {
      setFromBooking(true);
    }
  }, []);

  const toggleItem = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    termsData.forEach((term) => {
      allExpanded[term.id] = true;
    });
    setExpandedItems(allExpanded);
  };

  const collapseAll = () => {
    setExpandedItems({});
  };

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      {/* Hero Section */}
      <div className="bg-primary_green text-white py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Terms & Conditions
        </h1>
        <p className="text-xl max-w-2xl mx-auto">
          Important information about your booking with Oastel
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Controls */}
        <div className="mb-8">
          <div className="flex gap-2">
            <button
              onClick={expandAll}
              className="text-sm bg-primary_green text-white px-4 py-2 rounded hover:bg-primary_green/90 transition-colors"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="text-sm bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Terms List */}
        <div className="space-y-4">
          {termsData.length > 0 ? (
            termsData.map((term) => (
              <div
                key={term.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => toggleItem(term.id)}
                  className={`w-full flex items-center justify-between p-5 text-left ${
                    expandedItems[term.id] ? "bg-primary_green/5" : ""
                  }`}
                >
                  <h3 className="font-semibold text-lg text-title_black">
                    {term.title}
                  </h3>
                  {expandedItems[term.id] ? (
                    <FiChevronUp className="text-primary_green" />
                  ) : (
                    <FiChevronDown className="text-primary_green" />
                  )}
                </button>
                <div
                  className={`px-5 pb-5 transition-all duration-300 ease-in-out ${
                    expandedItems[term.id] ? "block" : "hidden"
                  }`}
                >
                  <div className="prose text-desc_gray">
                    <ul className="list-disc pl-5 space-y-2">
                      {term.content.map((line, i) => (
                        <li key={i} className="text-sm">
                          {line}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-title_black mb-2">
                No terms found
              </h3>
              <p className="text-desc_gray">Try a different search term</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
