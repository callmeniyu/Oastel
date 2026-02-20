"use client";
import { FaFacebookF } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa";
import { FaTelegramPlane } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary_green text-white px-4 pt-10 pb-2 md:pr-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between gap-10">
        <div className="text-4xl font-bold my-auto font-poppins w-2/6 flex md:justify-center">
          <h1>Oastel</h1>
        </div>
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm md:text-base my-4 justify-center">
            <div>
              <h4 className="font-semibold text-gray-300 mb-2">About</h4>
              <ul className="space-y-1 font-medium">
                <li>
                  <Link href="/about#about-us">About us</Link>
                </li>
                <li>
                  <Link href="/about#our-story">Our Story</Link>
                </li>
                <li>
                  <Link href="/about#our-features">Features</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-300 mb-2">Services</h4>
              <ul className="space-y-1 font-medium">
                <li>
                  <a href="/tours">Tours</a>
                </li>
                <li>
                  <a href="/transfers">Transfers</a>
                </li>
                <li>
                  <Link href="/stays">Stays</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-300 mb-2">Help</h4>
              <ul className="space-y-1 font-medium">
                <li>
                  <a href="/contact-us">Contact Us</a>
                </li>
                <li>
                  <a href="contact-us#feedback">Feedback</a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-300 mb-2">Others</h4>
              <ul className="space-y-1 font-medium">
                <li>
                  <a href="/terms-and-conditions">Terms & Conditions</a>
                </li>
                <li>
                  <a href="/privacy-policy">Privacy Policy</a>
                </li>
                <li>
                  <a href="/blogs">Blogs</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex justify-between">
            <img
              src="/images/footer_payment1.png"
              className="w-9 h-8 md:w-11 md:h-10"
              alt="footer_payment"
            />
            <img
              src="/images/footer_payment2.png"
              className="w-9 h-8 md:w-11 md:h-10"
              alt="footer_payment"
            />
            <img
              src="/images/footer_payment3.png"
              className="w-9 h-8 md:w-11 md:h-10"
              alt="footer_payment"
            />
            <img
              src="/images/footer_payment4.png"
              className="w-9 h-8 md:w-11 md:h-10"
              alt="footer_payment"
            />
            <img
              src="/images/footer_payment5.png"
              className="w-9 h-8 md:w-11 md:h-10"
              alt="footer_payment"
            />
          </div>
        </div>
      </div>

      {/* Company Registration & Payment Partners */}
      <div className="mt-10 pt-8 border-t border-white/20">
        <div className="max-w-7xl mx-auto">
          {/* Company Registration */}
          <div className="text-center mb-8">
            <p className="text-sm font-semibold mb-1">OASTEL SDN. BHD.</p>
            <p className="text-xs text-gray-300">202401034459 (1580306-V)</p>
          </div>

          {/* Payment Partners */}
          <div className="text-center">
            <h4 className="text-sm font-semibold mb-4 text-gray-200">
              Trusted Payment Partners
            </h4>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-xs">
              {/* Stripe */}
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
                </svg>
                <span className="text-gray-300">Secure Online Payments</span>
              </div>

              {/* Banking Partners */}
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M2 8.5h20v2H2zm0 5h20v2H2zm8-10l10 4v2H2v-2l10-4zm0 18h12v2H2v-2h8z" />
                </svg>
                <span className="text-gray-300">
                  Public Bank & Alliance Bank
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8 text-center text-xs text-gray-300 font-poppins font-medium">
        Copyright@2025 Oastel. All Rights Reserved.
      </div>
    </footer>
  );
}
