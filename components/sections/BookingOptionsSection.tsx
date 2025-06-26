// components/BookingOptions.tsx
import { FaHome, FaMapMarkerAlt, FaShuttleVan } from "react-icons/fa";
import Link from "next/link";
import { IoHomeOutline } from "react-icons/io5";
import { FiMapPin } from "react-icons/fi";
import { LiaShuttleVanSolid } from "react-icons/lia";


export default function BookingOptions() {
  const options = [
    {
      title: "Book Stay",
      description: "Reserve a co-living space with ease",
      icon: <IoHomeOutline size={60} />,
      href: "https://booking.exely.com/en/oastel/",
    },
    {
      title: "Book Tour",
      description: "Choose a co-tour or private adventure",
      icon: <FiMapPin size={60} />,
      href: "/tours",
    },
    {
      title: "Book Transport",
      description: "Schedule your van transfer across destinations",
      icon: <LiaShuttleVanSolid size={60} />,
      href: "/transports",
    },
  ];

  return (
    <section className="py-12 px-4 md:px-8 font-poppins">
      <h2 className="text-center section-title ">
        What Would You Like to Book Today?
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-16">
        {options.map((opt, idx) => (
          <Link
            href={opt.href}
            key={idx}
            className="bg-white hover:bg-primary_green transition-all duration-300 rounded-xl shadow-lg p-6 flex flex-col items-center justify-center gap-4 text-center group"
          >
            <div className="text-primary_green group-hover:text-white transition-colors">
              {opt.icon}
            </div>
            <h3 className="text-xl font-semibold text-primary_green group-hover:text-white transition-colors">{opt.title}</h3>
            <p className="text-sm text-gray-400 group-hover:text-white transition-colors">{opt.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
