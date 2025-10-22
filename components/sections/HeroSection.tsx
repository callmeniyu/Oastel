"use client";
import { IoHomeOutline, IoArrowForward } from "react-icons/io5";
import { FiMapPin } from "react-icons/fi";
import { LiaShuttleVanSolid } from "react-icons/lia";
import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  const bookingOptions = [
    {
      title: "Book Stay",
      description: "Reserve your perfect accommodation",
      icon: <IoHomeOutline className="text-2xl" />,
      href: "/",
      bgColor: "bg-[#FF7E33]",
    },
    {
      title: "Book Tour",
      description: "Discover curated highland adventures",
      icon: <FiMapPin className="text-2xl" />,
      href: "/tours",
      bgColor: "bg-[#4CAF50]",
    },
    {
      title: "Book Transfer",
      description: "Seamless transfers between destinations",
      icon: <LiaShuttleVanSolid className="text-2xl" />,
      href: "/transfers",
      bgColor: "bg-[#2196F3]",
    },
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero.jpg"
          alt="Cameron Highlands"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 pt-24 md:pt-32 pb-10 md:pb-16 px-4 md:px-8 lg:px-28">
        {/* Hero Text */}
        <div className="max-w-5xl mx-auto text-center mb-6 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Hello Backpackers. <br />
            Selamat Datang to Cameron Highlands!
            {/* Unforgettable Adventures in <br className="hidden md:block" />
                        <span className="text-primary_green-light">Cameron Highlands</span> */}
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Stay cozy at Oastel · Wander the Mossy Forest · Sip Highland Tea ·
            Find the Rafflesia
          </p>
        </div>

        {/* Booking Options - Desktop */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-2 md:mt-12">
          {bookingOptions.map((option, index) => (
            <Link
              href={option.href}
              key={index}
              className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 h-64 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:border-white/30"
            >
              {/* Glassmorphism overlay with subtle color hint */}
              <div
                className={`absolute inset-0 ${option.bgColor}/5 group-hover:${option.bgColor}/10 transition-all duration-300`}
              />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white z-10">
                <div
                  className={`${option.bgColor}/20 p-4 rounded-full backdrop-blur-sm group-hover:${option.bgColor}/30 border border-white/20 group-hover:border-white/40 transition-all duration-300`}
                >
                  {option.icon}
                </div>
                <h3 className="text-2xl font-bold mt-4 drop-shadow-sm">
                  {option.title}
                </h3>
                <p className="mt-2 opacity-90 drop-shadow-sm">
                  {option.description}
                </p>
                <div className="mt-6 flex items-center gap-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Get started <IoArrowForward className="animate-pulse" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Booking Options - Mobile */}
        <div className="md:hidden bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-lg max-w-md mx-auto">
          <div className="grid grid-cols-3 gap-2">
            {bookingOptions.map((option, index) => (
              <Link
                href={option.href}
                key={index}
                className="flex flex-col items-center p-3 rounded-xl hover:bg-white/20 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-300"
              >
                <div
                  className={`p-3 rounded-full ${option.bgColor}/20 backdrop-blur-sm border border-white/20 text-white mb-2`}
                >
                  {option.icon}
                </div>
                <span className="text-sm font-medium text-center text-white drop-shadow-sm">
                  {option.title}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Scrolling Indicator */}
        <div className="mt-16 flex justify-center">
          <div className="animate-bounce w-8 h-14 rounded-full border-2 border-white/50 flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
    </section>
  );
}
