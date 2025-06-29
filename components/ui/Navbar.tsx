"use client"
import { useState } from "react"
import { CgMenuRightAlt } from "react-icons/cg"
import { IoPersonOutline } from "react-icons/io5"
import Sidebar from "./SideBar"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

export default function Navbar() {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)

    const [showProfile, setShowProfile] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(true)

    return (
        <>
            <nav className="flex items-center justify-between px-2 sm:px-6 py-3 border-b shadow-sm">
                <button onClick={() => setIsOpen(true)} aria-label="Open menu">
                    <CgMenuRightAlt size={28} className="text-primary_green" />
                </button>
                <h1 className="text-xl font-bold text-black font-poppins">Oastel</h1>
                <div className="relative">
                    <button
                        className="flex items-center gap-2 bg-primary_green text-white rounded-full sm:pr-3 xs:pr-0 "
                        onClick={() => {
                            if (isAuthenticated) {
                                setShowProfile((prev) => !prev)
                            } else {
                                router.push("/authenticate")
                            }
                        }}
                    >
                        <div className="border-r-[1.5px] border-white rounded-full p-2">
                            <IoPersonOutline size={20} />
                        </div>
                        <span className="text-sm font-medium font-poppins xs:hidden sm:flex">
                            {isAuthenticated ? "Cooper" : "Sign In"}
                        </span>
                    </button>

                    {/* Dropdown */}
                    <div
                        className={`absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg transform transition-all duration-200 origin-top z-50 ${
                            showProfile ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"
                        }`}
                    >
                        <div className="px-4 py-2 border-b flex flex-col items-center gap-1">
                            <Image src="/images/profile.png" alt="Profile" width={40} height={40} className="rounded-full" />
                            <h6 className="text-sm font-medium">Alex Cooper</h6>
                        </div>
                        <ul className="py-2 text-sm font-medium text-gray-700">
                            <li>
                                <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                                    Profile
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                                    Bookings
                                </Link>
                            </li>
                            <li>
                                <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">Sign Out</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    )
}
