"use client";
import { IoClose } from "react-icons/io5";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    about: false,
    support: false,
    transports: true,
  });

  // Disable scroll on open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <>
      {/* Backdrop/Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <Link
            href="/"
            className="text-2xl font-bold text-primary_green font-poppins hover:text-primary_green/90 transition-colors"
          >
            Oastel
          </Link>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <IoClose size={24} className="text-primary_green" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="h-[calc(100%-120px)] overflow-y-auto scrollbar-hide py-4">
          <div className="space-y-1 px-4">
            {/* About Section */}
            <div className="mb-2">
              <button
                onClick={() => toggleSection("about")}
                className="flex items-center justify-between w-full px-3 py-3 rounded-lg hover:bg-primary_green/5 transition-colors"
              >
                <span className="font-medium text-title_black">About</span>
                {expandedSections.about ? (
                  <FiChevronUp className="text-primary_green" />
                ) : (
                  <FiChevronDown className="text-primary_green" />
                )}
              </button>
              <div
                className={`pl-4 space-y-1 overflow-hidden transition-all duration-300 ${
                  expandedSections.about ? "max-h-40 mt-2" : "max-h-0"
                }`}
              >
                <Link
                  href="/about#about-us"
                  onClick={onClose}
                  className="block px-3 py-2 text-desc_gray rounded-lg hover:bg-primary_green/5 hover:text-primary_green transition-colors"
                >
                  About Us
                </Link>
                <Link
                  href="/about#our-story"
                  onClick={onClose}
                  className="block px-3 py-2 text-desc_gray rounded-lg hover:bg-primary_green/5 hover:text-primary_green transition-colors"
                >
                  Our Story
                </Link>
                <Link
                  href="/about#our-features"
                  onClick={onClose}
                  className="block px-3 py-2 text-desc_gray rounded-lg hover:bg-primary_green/5 hover:text-primary_green transition-colors"
                >
                  Features
                </Link>
              </div>
            </div>

            {/* Simple Links */}
            <Link
              href="https://booking.exely.com/en/oastel/"
              onClick={onClose}
              className="block px-3 py-3 rounded-lg hover:bg-primary_green/5 text-title_black font-medium transition-colors"
            >
              Stays
            </Link>
            <Link
              href="/tours"
              onClick={onClose}
              className="block px-3 py-3 rounded-lg hover:bg-primary_green/5 text-title_black font-medium transition-colors"
            >
              Tours
            </Link>
            <div className="mb-2">
              <button
                onClick={() => toggleSection("transports")}
                className="flex items-center justify-between w-full px-3 py-3 rounded-lg hover:bg-primary_green/5 transition-colors"
              >
                <span className="font-medium text-title_black">Transfers</span>
                {expandedSections.transports ? (
                  <FiChevronUp className="text-primary_green" />
                ) : (
                  <FiChevronDown className="text-primary_green" />
                )}
              </button>
              <div
                className={`pl-4 space-y-1 overflow-hidden transition-all duration-300 ${
                  expandedSections.transports ? "max-h-40 mt-2" : "max-h-0"
                }`}
              >
                <Link
                  href="/transfers#van"
                  onClick={onClose}
                  className="block px-3 py-2 text-desc_gray rounded-lg hover:bg-primary_green/5 hover:text-primary_green transition-colors"
                >
                  Van
                </Link>
                <Link
                  href="/transfers#ferry"
                  onClick={onClose}
                  className="block px-3 py-2 text-desc_gray rounded-lg hover:bg-primary_green/5 hover:text-primary_green transition-colors"
                >
                  Van + Ferry
                </Link>
                <Link
                  href="/transfers#private"
                  onClick={onClose}
                  className="block px-3 py-2 text-desc_gray rounded-lg hover:bg-primary_green/5 hover:text-primary_green transition-colors"
                >
                  Private Transports
                </Link>
              </div>
            </div>
            <Link
              href="/blogs"
              onClick={onClose}
              className="block px-3 py-3 rounded-lg hover:bg-primary_green/5 text-title_black font-medium transition-colors"
            >
              Blogs
            </Link>

            {/* Support Section */}
            <div className="mb-2">
              <button
                onClick={() => toggleSection("support")}
                className="flex items-center justify-between w-full px-3 py-3 rounded-lg hover:bg-primary_green/5 transition-colors"
              >
                <span className="font-medium text-title_black">
                  Help & Support
                </span>
                {expandedSections.support ? (
                  <FiChevronUp className="text-primary_green" />
                ) : (
                  <FiChevronDown className="text-primary_green" />
                )}
              </button>
              <div
                className={`pl-4 space-y-1 overflow-hidden transition-all duration-300 ${
                  expandedSections.support ? "max-h-40 mt-2" : "max-h-0"
                }`}
              >
                <Link
                  href="/contact-us"
                  onClick={onClose}
                  className="block px-3 py-2 text-desc_gray rounded-lg hover:bg-primary_green/5 hover:text-primary_green transition-colors"
                >
                  Contact Us
                </Link>
                <Link
                  href="/contact-us#feedback"
                  onClick={onClose}
                  className="block px-3 py-2 text-desc_gray rounded-lg hover:bg-primary_green/5 hover:text-primary_green transition-colors"
                >
                  Feedback
                </Link>
                <Link
                  href="/faqs"
                  onClick={onClose}
                  className="block px-3 py-2 text-desc_gray rounded-lg hover:bg-primary_green/5 hover:text-primary_green transition-colors"
                >
                  FAQ
                </Link>
              </div>
            </div>

            <Link
              href="/privacy-policy"
              onClick={onClose}
              className="block px-3 py-3 rounded-lg hover:bg-primary_green/5 text-title_black font-medium transition-colors"
            >
              Terms & Conditions
            </Link>
          </div>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 w-full px-6 py-4 border-t border-gray-100">
          <p className="text-xs text-desc_gray text-center">
            Copyright©2025 Oastel. All Rights Reserved.
          </p>
        </div>
      </aside>
    </>
  );
}
