"use client";
import Link from "next/link";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { SiGmail } from "react-icons/si";

export default function ContactInfo() {
  return (
    <section className="py-12 md:py-14 relative">
      <div className="bg-primary_green w-full top-32 -z-10 h-56 absolute hidden md:flex"></div>

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border md:px-20 py-12">
        <div className="px-6 md:px-6">
          <h2 className="section-title text-center">
            Explore Stories, Travel Tips, and Local Experiences from the Heart
            of Cameron Highlands
          </h2>
          <p className="section-desc text-center mb-12">
            Read travel stories, destination guides, and curated insights for
            your next adventure.
          </p>
        </div>
        <div className="flex sm:flex-row px-3 sm:px-8 items-center justify-between gap-2 md:gap-8">
          <Link
            href="https://www.instagram.com/oastelvibe?igsh=N3kxZGttN2ZqYXpv&utm_source=qr"
            className="flex flex-col items-center text-center"
          >
            <div className="bg-primary_green text-white p-3 md:p-4 rounded-full text-2xl">
              <FaInstagram className="text-2xl md:text-4xl" />
            </div>
            <h4 className="mt-3 font-semibold text-title_black">Instagram</h4>
            <p className="text-sm text-desc_gray mt-1">@oastelvibe</p>
          </Link>

          <Link
            href="http://wa.me/60196592141"
            className="flex flex-col items-center text-center"
          >
            <div className="bg-primary_green text-white p-3 md:p-4 rounded-full text-2xl">
              <FaWhatsapp className="text-2xl md:text-4xl" />
            </div>
            <h4 className="mt-3 font-semibold text-title_black">Whatsapp</h4>
            <p className="text-sm text-desc_gray mt-1">+60 19-659 2141</p>
          </Link>

          <div className="flex flex-col items-center text-center">
            <div className="bg-primary_green text-white p-3 md:p-4 rounded-full text-2xl">
              <SiGmail className="text-2xl md:text-4xl" />
            </div>
            <h4 className="mt-3 font-semibold text-title_black">Gmail</h4>
            <p className="text-sm text-desc_gray mt-1">hello@oastel.com</p>
          </div>
        </div>
      </div>
    </section>
  );
}
