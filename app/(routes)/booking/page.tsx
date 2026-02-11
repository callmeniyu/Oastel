"use client";

import {BeBookingForm} from "@/components/be-forms/BeBookingForm";

export default function Booking() {
  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      {/* Hero Section */}
      <div className="bg-primary_green text-white py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Booking</h1>
      </div>

      <div className="py-8 px-3">
        <BeBookingForm />
      </div>
    </div>
  );
}
