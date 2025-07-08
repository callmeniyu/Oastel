"use client"
import { useState } from "react"
import { CgMenuRightAlt } from "react-icons/cg"
import { IoPersonOutline } from "react-icons/io5"
import Sidebar from "./SideBar"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import UseSession from "@/hooks/SessionHook"
import { signOut } from "next-auth/react"
import { useToast } from "@/context/ToastContext"
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar"

export default function Navbar() {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)

    const [showProfile, setShowProfile] = useState(false)

    const { user, isLoading, isAuthenticated } = UseSession()

    const {showToast} = useToast()

    const handleSignOut = () => { 
        signOut({
            callbackUrl: "/auth",
        })
        showToast({
            type: "success",
            title: "Signed Out",
            message: "You have successfully signed out.",
        })
        setShowProfile(false)
        setIsOpen(false)
    }

    return (
        <>
            <nav className="flex items-center justify-between px-2 sm:px-6 py-3 border-b shadow-sm">
                <button onClick={() => setIsOpen(true)} aria-label="Open menu">
                    <CgMenuRightAlt size={28} className="text-primary_green" />
                </button>
                <Link href={"/"} className="text-xl font-bold text-black font-poppins">
                    Oastel
                </Link>
                <div className="relative">
                    <button
                        className="flex items-center gap-2 bg-primary_green text-white rounded-full sm:pr-3 xs:pr-0 "
                        onClick={() => {
                            if (isAuthenticated) {
                                setShowProfile((prev) => !prev)
                            } else {
                                router.push("/auth")
                            }
                        }}
                    >
                        <div className="border-r-[1.5px] border-white rounded-full p-2">
                            <IoPersonOutline size={20} />
                        </div>
                        <span className="text-sm font-medium font-poppins xs:hidden sm:flex">
                            {isAuthenticated ? user?.name?.slice(0, 15) : "Sign In"}
                        </span>
                    </button>

                    {/* Dropdown */}
                    <div
                        className={`absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg transform transition-all duration-200 origin-top z-50 ${
                            showProfile ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"
                        }`}
                    >
                        <div className="px-4 py-2 border-b flex flex-col items-center gap-1">
                            <Avatar className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
                                {user?.image ? (
                                    <AvatarImage
                                        src={user.image}
                                        alt={user?.name ?? "User"}
                                        className="w-10 h-10 object-cover"
                                    />
                                ) : (
                                    <AvatarFallback className="w-10 h-10 flex items-center justify-center bg-gray-300 text-gray-600 font-bold">
                                        {user?.name ? user.name.charAt(0).toUpperCase() : "G"}
                                    </AvatarFallback>
                                )}
                            </Avatar>
                            <h6 className="text-sm font-medium">{ user?.name || "Guest"}</h6>
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
                                <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                                    Cart
                                </Link>
                            </li>
                            <li>
                                <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={handleSignOut}>Sign Out</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    )
}
