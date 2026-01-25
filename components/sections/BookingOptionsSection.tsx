// components/BookingOptions.tsx
"use client";
import Link from "next/link";
import { IoHomeOutline } from "react-icons/io5";
import { FiMapPin } from "react-icons/fi";
import { LiaShuttleVanSolid } from "react-icons/lia";
import { useToast } from "@/context/ToastContext";

export default function BookingOptions() {
  const { showToast } = useToast();

  const handleStayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    showToast({
      type: "info",
      title: "Stays Currently Unavailable",
      message:
        "We're currently updating our booking system. You can book our stays on Hostelworld or Booking.com. Thank you for your understanding!",
    });
  };
  const options = [
    {
      title: "Book Stay",
      description: "Reserve a co-living space with ease",
      icon: <IoHomeOutline size={40} />,
      href: "/",
      onClick: handleStayClick,
    },
    {
      title: "Book Tour",
      description: "Choose a co-tour or private adventure",
      icon: <FiMapPin size={40} />,
      href: "/tours",
    },
    {
      title: "Book Transport",
      description: "Schedule your van transfer across destinations",
      icon: <LiaShuttleVanSolid size={40} />,
      href: "/transfer",
    },
  ];

  return (
    <section className="px-2 md:px-8 font-poppins mt-6 hidden md:block">
      <div className="grid grid-cols-3 gap-2 md:gap-6 max-w-5xl mx-auto">
        {options.map((opt, idx) =>
          opt.onClick ? (
            <button
              onClick={opt.onClick}
              key={idx}
              className="bg-white hover:bg-gray-100 hover:scale-110 transition-all duration-300 rounded-xl shadow-lg p-2 md:p-6 flex flex-col items-center justify-center gap-2 md:gap-4 text-center group cursor-pointer"
            >
              <div className="text-primary_green transition-colors">
                {opt.icon}
              </div>
              <h3 className="text-md sm:text-xl font-semibold text-primary_green transition-colors">
                {opt.title}
              </h3>
              <p className="text-sm text-gray-400 transition-colors hidden sm:block">
                {opt.description}
              </p>
            </button>
          ) : (
            <Link
              href={opt.href}
              key={idx}
              className="bg-white hover:bg-gray-100 hover:scale-110 transition-all duration-300 rounded-xl shadow-lg p-2 md:p-6 flex flex-col items-center justify-center gap-2 md:gap-4 text-center group"
            >
              <div className="text-primary_green transition-colors">
                {opt.icon}
              </div>
              <h3 className="text-md sm:text-xl font-semibold text-primary_green transition-colors">
                {opt.title}
              </h3>
              <p className="text-sm text-gray-400 transition-colors hidden sm:block">
                {opt.description}
              </p>
            </Link>
          ),
        )}
      </div>
    </section>
  );
}
