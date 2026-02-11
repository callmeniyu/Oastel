"use client";

import { BeBookingForm } from "@/components/be-forms/BeBookingForm";

export default function Booking() {
  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      {/* Hero Section */}
      <div
        className="relative h-[24rem] md:h-96 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/stays.jpg')" }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center h-full px-4 text-center text-white">
          <div className="max-w-4xl pt-16 md:pt-0">
            <h1 className="text-3xl md:text-7xl font-bold mb-6 text-white drop-shadow-lg">
              Oastel Co-Living
            </h1>
            <p className="text-lg md:text-2xl font-light leading-relaxed drop-shadow-md max-w-2xl mx-auto">
              Where modern living meets mountain vibes. Built for digital
              nomads, backpackers and ambitious minds seeking more than just a
              room.
            </p>
          </div>
        </div>
      </div>

      <div className="py-8 px-3">
        <BeBookingForm />
      </div>
    </div>
  );
}
