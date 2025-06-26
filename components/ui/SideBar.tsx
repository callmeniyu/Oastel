"use client";
import { IoClose } from "react-icons/io5";
import { useEffect, useState } from "react";
import Link from "next/link";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

type SidebarProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const [aboutOpen, setAboutOpen] = useState(false);
    const [supportOpen, setSupportOpen] = useState(false);

    // Disable scroll on open
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "unset";
    }, [isOpen]);

    return (
        <div
            className={`fixed top-0 left-0 h-full w-[280px] bg-gray-50 text-white z-50 transform transition-transform duration-300 ease-in-out ${
                isOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray">
                <h2 className="text-xl font-bold font-poppins text-primary_green">Oastel</h2>
                <button onClick={onClose}>
                    <IoClose size={24} className="text-primary_green"/>
                </button>
            </div>

            <nav className="py-4 flex flex-col gap-4 text-base font-medium text-primary_green font-poppins">
                <div className="border-b border-gray pb-2 px-3">
                    <button
                        onClick={() => setAboutOpen(!aboutOpen)}
                        className="flex items-center justify-between w-full"
                    >
                        <span>About</span>
                        {aboutOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </button>
                    <ul
                        className={`pl-4 mt-2 flex flex-col gap-2 text-sm text-primary_green overflow-hidden transition-all duration-300 ease-in-out ${
                            aboutOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                        }`}
                    >
                        <li>
                            <Link href="/about">- About Us</Link>
                        </li>
                        <li>
                            <Link href="/our-story">- Our Story</Link>
                        </li>
                        <li>
                            <Link href="/vision">- Vision</Link>
                        </li>
                        <li>
                            <Link href="/mission">- Mission</Link>
                        </li>
                    </ul>
                </div>

                <Link href="/tours" className="px-3 py-1 border-b border-gray">
                    Tours
                </Link>
                <Link href="/vans" className="px-3 py-1 border-b border-gray">
                    Vans
                </Link>
                <Link href="/blogs" className="px-3 py-1 border-b border-gray">
                    Blogs
                </Link>

                {/* SUPPORT */}
                <div className="border-b border-gray pb-2 px-3">
                    <button
                        onClick={() => setSupportOpen(!supportOpen)}
                        className="flex items-center justify-between w-full"
                    >
                        <span>Help & Support</span>
                        {supportOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </button>
                    <ul
                        className={`pl-4 mt-2 flex flex-col gap-2 text-sm text-primary_green overflow-hidden transition-all duration-300 ease-in-out ${
                            supportOpen ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
                        }`}
                    >
                        <li>
                            <Link href="/contact">- Contact Us</Link>
                        </li>
                        <li>
                            <Link href="/terms">- Terms & Conditions</Link>
                        </li>
                        <li>
                            <Link href="/feedback">- Feedback</Link>
                        </li>
                    </ul>
                </div>
            </nav>

            <footer className="absolute bottom-4 w-full text-center text-xs text-gray-400 font-poppins">
                Copyright©2025 Oastel. All Rights Reserved.
            </footer>
        </div>
    );
}
