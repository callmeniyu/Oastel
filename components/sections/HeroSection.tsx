"use client";
import {
  IoHomeOutline,
  IoArrowForward,
  IoSearchOutline,
} from "react-icons/io5";
import { FiMapPin } from "react-icons/fi";
import { LiaShuttleVanSolid } from "react-icons/lia";
import { FaBus, FaWalking, FaChevronDown } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { transferApi } from "@/lib/transferApi";
import { TransferType } from "@/lib/types";

export default function HeroSection() {
  const [fromDropdownOpen, setFromDropdownOpen] = useState(false);
  const [toDropdownOpen, setToDropdownOpen] = useState(false);
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [allTransfers, setAllTransfers] = useState<TransferType[]>([]);
  const fromDropdownRef = useRef<HTMLDivElement>(null);
  const toDropdownRef = useRef<HTMLDivElement>(null);

  // Generate dynamic location options from transfer data with proper deduplication
  const getUniqueLocations = (locations: string[]) => {
    const seen = new Set<string>();
    const unique: string[] = [];

    locations.forEach((location) => {
      const normalized = location.trim().toLowerCase();
      if (normalized && !seen.has(normalized)) {
        seen.add(normalized);
        unique.push(location.trim()); // Keep original casing but trimmed
      }
    });

    return unique.sort();
  };

  const locationOptions = {
    from: getUniqueLocations(allTransfers.map((transfer) => transfer.from)),
    to: getUniqueLocations(allTransfers.map((transfer) => transfer.to)),
  };

  // Fetch transfers data on component mount
  useEffect(() => {
    const fetchTransfers = async () => {
      try {
        const response = await transferApi.getTransfers({ limit: 100 });
        setAllTransfers(response.data);
      } catch (err) {
        console.error("Error fetching transfers:", err);
      }
    };

    fetchTransfers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        fromDropdownRef.current &&
        !fromDropdownRef.current.contains(event.target as Node)
      ) {
        setFromDropdownOpen(false);
      }
      if (
        toDropdownRef.current &&
        !toDropdownRef.current.contains(event.target as Node)
      ) {
        setToDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchTransfer = () => {
    const params = new URLSearchParams();
    if (fromLocation) params.append("from", fromLocation);
    if (toLocation) params.append("to", toLocation);
    window.location.href = `/transfers${params.toString() ? `?${params.toString()}` : ""}`;
  };

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
        <div className="max-w-7xl mx-auto">
          {/* Hero Text - Above Actions */}
          <div className="max-w-5xl mx-auto text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
              Hello Backpackers. <br />
              Selamat Datang to Cameron Highlands!
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
              Stay cozy at Oastel · Wander the Mossy Forest · Sip Highland Tea ·
              Find the Rafflesia
            </p>
          </div>

          {/* Main Booking Actions - Priority Section */}
          <div className="mb-8 md:mb-12">
            {/* Tours & Stays Buttons - Desktop */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
              <Link
                href="/tours"
                className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 h-48 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:border-white/30"
              >
                {/* Glassmorphism overlay with subtle color hint */}
                <div className="absolute inset-0 bg-[#4CAF50]/5 group-hover:bg-[#4CAF50]/10 transition-all duration-300" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white z-10">
                  <div className="p-4 rounded-full backdrop-blur-sm group-hover:bg-[#4CAF50]/30 border border-white/20 group-hover:border-white/40 transition-all duration-300">
                    <FiMapPin className="text-3xl" />
                  </div>
                  <h3 className="text-3xl font-extrabold mt-4 drop-shadow-sm">
                    Book Tours
                  </h3>
                  <p className="mt-2 opacity-90 drop-shadow-sm">
                    Discover curated highland adventures
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Get started <IoArrowForward className="animate-pulse" />
                  </div>
                </div>
              </Link>

              <Link
                href="https://booking.exely.com/en/oastel/"
                className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 h-48 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:border-white/30"
              >
                {/* Glassmorphism overlay with subtle color hint */}
                <div className="absolute inset-0 bg-[#FF7E33]/5 group-hover:bg-[#FF7E33]/10 transition-all duration-300" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white z-10">
                  <div className="p-4 rounded-full backdrop-blur-sm group-hover:bg-[#FF7E33]/30 border border-white/20 group-hover:border-white/40 transition-all duration-300">
                    <IoHomeOutline className="text-3xl" />
                  </div>
                  <h3 className="text-3xl font-bold mt-4 drop-shadow-sm">
                    Book Your Stay
                  </h3>
                  <p className="mt-2 opacity-90 drop-shadow-sm">
                    Reserve your perfect accommodation
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Get started <IoArrowForward className="animate-pulse" />
                  </div>
                </div>
              </Link>
            </div>

            {/* Tours & Stays Buttons - Mobile */}
            <div className="md:hidden space-y-6 mb-8">
              <Link
                href="/tours"
                className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/10 backdrop-blur-md border-2 border-white/20 hover:bg-white/20 hover:border-white/30 p-6 flex items-center gap-4 min-h-[80px]"
              >
                <div className="bg-[#4CAF50]/20 p-4 rounded-xl backdrop-blur-sm border border-white/20">
                  <FiMapPin className="text-3xl text-white" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-xl font-bold text-white mb-1">
                    Explore Tours
                  </h3>
                  <p className="text-white/90 text-base">
                    Highland adventures await
                  </p>
                </div>
                <IoArrowForward className="text-2xl text-white group-hover:translate-x-1 transition-transform duration-300" />
              </Link>

              <Link
                href="https://booking.exely.com/en/oastel/"
                className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/10 backdrop-blur-md border-2 border-white/20 hover:bg-white/20 hover:border-white/30 p-6 flex items-center gap-4 min-h-[80px]"
              >
                <div className="bg-[#FF7E33]/20 p-4 rounded-xl backdrop-blur-sm border border-white/20">
                  <IoHomeOutline className="text-3xl text-white" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-xl font-bold text-white mb-1">
                    Book Your Stay
                  </h3>
                  <p className="text-white/90 text-base">
                    Cozy accommodation ready
                  </p>
                </div>
                <IoArrowForward className="text-2xl text-white group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            {/* Transfer Booking Section */}
            <div className="w-full md:max-w-4xl md:mx-auto relative z-30">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 md:p-8 shadow-xl">
                {/* Transfer Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-[#2196F3]/20 p-3 rounded-full backdrop-blur-sm border border-white/20">
                    <LiaShuttleVanSolid className="text-2xl text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-white drop-shadow-sm">
                      Book Your Transfer
                    </h3>
                    <p className="text-white/80 text-sm">
                      Seamless transfers between destinations
                    </p>
                  </div>
                </div>

                {/* Transfer Form */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* From Location */}
                  <div className="relative" ref={fromDropdownRef}>
                    <label className="block text-sm font-medium text-white/90 mb-2 drop-shadow-sm">
                      <FaBus className="inline mr-2 text-white" />
                      From
                    </label>
                    <button
                      type="button"
                      onClick={() => setFromDropdownOpen(!fromDropdownOpen)}
                      className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-left text-white hover:bg-white/20 hover:border-white/30 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300"
                    >
                      <span
                        className={
                          fromLocation
                            ? "text-white font-medium"
                            : "text-white/70"
                        }
                      >
                        {fromLocation || "Select departure"}
                      </span>
                      <FaChevronDown
                        className={`text-sm text-white/70 transition-transform duration-300 absolute right-4 top-1/2 transform -translate-y-1/2 ${
                          fromDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {fromDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white backdrop-blur-md border border-white/30 rounded-xl shadow-xl z-[100] overflow-hidden">
                        {locationOptions.from.map((location) => (
                          <button
                            key={location}
                            type="button"
                            onClick={() => {
                              setFromLocation(location);
                              setFromDropdownOpen(false);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-primary_green hover:text-white transition-colors duration-200 text-gray-800 font-medium"
                          >
                            {location}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* To Location */}
                  <div className="relative" ref={toDropdownRef}>
                    <label className="block text-sm font-medium text-white/90 mb-2 drop-shadow-sm">
                      <FaWalking className="inline mr-2 text-white" />
                      To
                    </label>
                    <button
                      type="button"
                      onClick={() => setToDropdownOpen(!toDropdownOpen)}
                      className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-left text-white hover:bg-white/20 hover:border-white/30 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300"
                    >
                      <span
                        className={
                          toLocation
                            ? "text-white font-medium"
                            : "text-white/70"
                        }
                      >
                        {toLocation || "Select destination"}
                      </span>
                      <FaChevronDown
                        className={`text-sm text-white/70 transition-transform duration-300 absolute right-4 top-1/2 transform -translate-y-1/2 ${
                          toDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {toDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white backdrop-blur-md border border-white/30 rounded-xl shadow-xl z-[100] overflow-hidden">
                        {locationOptions.to.map((location) => (
                          <button
                            key={location}
                            type="button"
                            onClick={() => {
                              setToLocation(location);
                              setToDropdownOpen(false);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-primary_green hover:text-white transition-colors duration-200 text-gray-800 font-medium"
                          >
                            {location}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Search Button */}
                  <div className="flex items-end">
                    <button
                      onClick={handleSearchTransfer}
                      className="w-full bg-[#2196F3]/20 backdrop-blur-sm border border-white/20 hover:bg-[#2196F3]/30 hover:border-white/30 text-white font-semibold py-3 md:py-[14px] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group"
                    >
                      <IoSearchOutline className="text-xl group-hover:scale-110 transition-transform duration-300" />
                      <span>Search</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
    </section>
  );
}
