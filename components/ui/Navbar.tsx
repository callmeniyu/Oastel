"use client";
import { useState, useEffect, useRef } from "react";
import { CgMenuRightAlt } from "react-icons/cg";
import { IoPersonOutline } from "react-icons/io5";
import Sidebar from "./SideBar";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import UseSession from "@/hooks/SessionHook";
import { signOut } from "next-auth/react";
import { useToast } from "@/context/ToastContext";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [imageError, setImageError] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { user, isLoading, isAuthenticated } = UseSession();
  const { showToast } = useToast();

  // Generate initials for text avatar
  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  // Close dropdown when pathname changes
  useEffect(() => {
    setShowProfile(false);
  }, [pathname]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowProfile(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowProfile(false);
      }
    };

    if (showProfile) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleEscapeKey);
      };
    }
  }, [showProfile]);

  // Determine if current page should have glass navbar
  const isGlassPage =
    pathname === "/" || pathname === "/tours" || pathname === "/transfers";

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50); // Change after 50px scroll
    };

    if (isGlassPage) {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [isGlassPage]);

  const handleSignOut = () => {
    signOut({
      callbackUrl: "/auth",
    });
    showToast({
      type: "success",
      title: "Signed Out",
      message: "You have successfully signed out.",
    });
    setShowProfile(false);
    setIsOpen(false);
  };

  const closeDropdown = () => {
    setShowProfile(false);
  };

  return (
    <>
      <nav
        className={`flex items-center justify-between px-2 sm:px-6 py-3 transition-all duration-300 ${
          isGlassPage
            ? `fixed top-0 left-0 right-0 z-40 ${
                isScrolled
                  ? "bg-white border-b border-gray-200 shadow-md"
                  : "bg-transparent"
              }`
            : "bg-white border-b border-gray-200 shadow-sm"
        }`}
      >
        <button onClick={() => setIsOpen(true)} aria-label="Open menu">
          <CgMenuRightAlt
            size={28}
            className={
              isGlassPage
                ? isScrolled
                  ? "text-primary_green"
                  : "text-white"
                : "text-primary_green"
            }
          />
        </button>
        <Link
          href={"/"}
          className={`text-xl font-bold font-poppins ${
            isGlassPage
              ? isScrolled
                ? "text-black"
                : "text-white drop-shadow-sm"
              : "text-black"
          }`}
        >
          Oastel
        </Link>
        <div className="relative" ref={dropdownRef}>
          <div className="flex items-center gap-2">
            {/* Cart Icon */}
            {isAuthenticated && (
              <Link
                href="/cart"
                className={`p-2 rounded-full transition-all duration-300 ${
                  isGlassPage
                    ? isScrolled
                      ? "text-primary_green hover:bg-primary_green/10"
                      : "text-white hover:bg-white/20"
                    : "text-primary_green hover:bg-primary_green/10"
                }`}
                title="View Cart"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path d="M7 4H3C2.45 4 2 4.45 2 5S2.45 6 3 6H6L7.6 11.59L6.24 14.04C5.52 15.37 6.48 17 8 17H19C19.55 17 20 16.55 20 16S19.55 15 19 15H8L9.1 13H16.55C17.3 13 17.96 12.59 18.3 11.97L21.88 5H9L8.41 3.36C8.25 2.97 7.89 2.75 7.5 2.75H3C2.45 2.75 2 3.2 2 3.75S2.45 4.75 3 4.75H6.54L7 4ZM8 19C6.9 19 6 19.9 6 21S6.9 23 8 23 10 22.1 10 21 9.1 19 8 19ZM19 19C17.9 19 17 19.9 17 21S17.9 23 19 23 21 22.1 21 21 20.1 19 19 19Z" />
                </svg>
              </Link>
            )}

            {/* Profile Button */}
            <button
              className={`flex items-center gap-2 rounded-full sm:pr-3 xs:pr-0 transition-all duration-300 ${
                isGlassPage
                  ? isScrolled
                    ? "bg-primary_green text-white hover:bg-primary_green/90"
                    : "bg-white/15 border border-white/20 text-white hover:bg-white/25"
                  : "bg-primary_green text-white hover:bg-primary_green/90"
              }`}
              onClick={() => {
                if (isAuthenticated) {
                  setShowProfile((prev) => !prev);
                } else {
                  router.push("/auth");
                }
              }}
              aria-expanded={showProfile}
              aria-haspopup="true"
            >
              <div
                className={`rounded-full p-2 ${
                  isGlassPage
                    ? isScrolled
                      ? "border-r-[1.5px] border-white"
                      : "border-r-[1.5px] border-white/30"
                    : "border-r-[1.5px] border-white"
                }`}
              >
                <IoPersonOutline size={20} />
              </div>
              <span className="text-sm font-medium font-poppins xs:hidden sm:flex">
                {isAuthenticated ? user?.name?.slice(0, 15) : "Sign In"}
              </span>
            </button>
          </div>

          {/* Dropdown */}
          <div
            className={`absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg transform transition-all duration-200 origin-top z-50 ${
              showProfile
                ? "scale-y-100 opacity-100"
                : "scale-y-0 opacity-0 pointer-events-none"
            }`}
          >
            <div className="px-4 py-2 border-b flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
                {user?.image && !imageError ? (
                  <Image
                    src={user.image}
                    alt={user?.name ?? "User"}
                    width={40}
                    height={40}
                    className="w-10 h-10 object-cover"
                    onError={() => setImageError(true)}
                    unoptimized={user.image.includes("googleusercontent.com")}
                  />
                ) : (
                  <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-primary_green to-primary_green/80 text-white font-bold text-sm">
                    {getInitials(user?.name || "")}
                  </div>
                )}
              </div>
              <h6 className="text-sm font-medium">{user?.name || "Guest"}</h6>
            </div>
            <ul className="py-2 text-sm font-medium text-gray-700">
              <li>
                <Link
                  href="/profile"
                  onClick={closeDropdown}
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  href="/booking"
                  onClick={closeDropdown}
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Bookings
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  onClick={closeDropdown}
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Cart
                </Link>
              </li>
              <li>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={handleSignOut}
                >
                  Sign Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>{" "}
      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
