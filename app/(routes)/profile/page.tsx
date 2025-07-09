"use client"
import { useState } from "react"
import { signOut } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import ProfileContent from "@/components/profile/ProfileContent"
import PasswordContent from "@/components/profile/PasswordContent"
import AddressContent from "@/components/profile/AddressContent"
import MyBookingsContent from "@/components/profile/MyBookingsContent"
import Confirmation from "@/components/ui/Confirmation"
import { FiChevronRight, FiUpload } from "react-icons/fi"
import Image from "next/image"

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState("profile")
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
    const [profileImage, setProfileImage] = useState("/images/profile.png") // Use existing image

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // Validate file type
            if (!file.type.startsWith("image/")) {
                alert("Please select a valid image file")
                return
            }

            // Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                alert("Image size should be less than 5MB")
                return
            }

            const reader = new FileReader()
            reader.onload = (event) => {
                if (event.target?.result) {
                    setProfileImage(event.target.result as string)
                }
            }
            reader.onerror = () => {
                alert("Error reading file")
            }
            reader.readAsDataURL(file)
        }
    }

    const handleDeleteImage = () => {
        setProfileImage("/images/profile.png") // Use existing default image
    }

    const handleSignOut = () => {
        signOut({ callbackUrl: "/" })
    }

    const handleDeleteAccount = () => {
        // Add proper account deletion logic here
        // This would typically involve an API call to delete the user account
        setShowDeleteConfirm(false)
        alert("Account deletion functionality would be implemented here")
    }

    const tabs = [
        { id: "profile", label: "Edit Profile" },
        { id: "password", label: "Password" },
        { id: "address", label: "Address & Contact" },
        { id: "bookings", label: "My Bookings" },
        { id: "signout", label: "Signout" },
        { id: "delete", label: "Delete Account" },
    ]

    const renderContent = () => {
        switch (activeTab) {
            case "profile":
                return (
                    <ProfileContent
                        profileImage={profileImage}
                        onImageUpload={handleImageUpload}
                        onDeleteImage={handleDeleteImage}
                    />
                )
            case "password":
                return <PasswordContent />
            case "address":
                return <AddressContent />
            case "bookings":
                return <MyBookingsContent />
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 font-poppins">
            {/* Header Section */}
            <div className="bg-primary_green text-white py-8 px-4 md:px-8">
                <div className="max-w-6xl mx-auto flex items-center gap-6">
                    <div className="relative group">
                        <Image
                            src={profileImage}
                            alt="Profile"
                            width={80}
                            height={80}
                            className="rounded-full border-4 border-white/30 object-cover"
                        />
                        <label className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <FiUpload className="text-white text-xl" />
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Alex Cooper</h1>
                        <p className="text-white/90">alexcooper@gmail.com</p>
                    </div>
                </div>
            </div>
            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Left Navigation */}
                <div className="md:col-span-1 bg-white rounded-xl shadow-sm p-4 h-fit">
                    <nav className="space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    if (tab.id === "signout") {
                                        setShowLogoutConfirm(true)
                                    } else if (tab.id === "delete") {
                                        setShowDeleteConfirm(true)
                                    } else {
                                        setActiveTab(tab.id)
                                    }
                                }}
                                className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                                    activeTab === tab.id && tab.id !== "signout" && tab.id !== "delete"
                                        ? "bg-primary_green/10 text-primary_green font-medium"
                                        : tab.id === "signout"
                                        ? "hover:bg-red-50 text-red-600 hover:text-red-700"
                                        : tab.id === "delete"
                                        ? "hover:bg-red-50 text-red-600 hover:text-red-700"
                                        : "hover:bg-gray-100 text-gray-700"
                                }`}
                            >
                                <span>{tab.label}</span>
                                <FiChevronRight />
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Right Content */}
                <div className="md:col-span-3 bg-white rounded-xl shadow-sm p-6 min-h-[400px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {renderContent()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Logout Confirmation Modal */}
            <Confirmation
                isOpen={showLogoutConfirm}
                onClose={() => setShowLogoutConfirm(false)}
                onConfirm={handleSignOut}
                title="Confirm Logout"
                message="Are you sure you want to logout?"
                confirmText="Logout"
                variant="default"
            />

            {/* Delete Account Confirmation Modal */}
            <Confirmation
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={handleDeleteAccount}
                title="Delete Account"
                message="Are you sure you want to delete your account? This action cannot be undone."
                confirmText="Delete Account"
                variant="danger"
            />
        </div>
    )
}
