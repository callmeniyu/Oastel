"use client"
import { signOut } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import ProfileContent from "@/components/profile/ProfileContent"
import PasswordContent from "@/components/profile/PasswordContent"
import AddressContent from "@/components/profile/AddressContent"
import MyBookingsContent from "@/components/profile/MyBookingsContent"
import Confirmation from "@/components/ui/Confirmation"
import { FiChevronRight } from "react-icons/fi"
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar"
import MyCartContent from "@/components/profile/MyCartContent"
import { useRef } from "react"
import { useToast } from "@/context/ToastContext"
import { useRouter } from "next/navigation"
import SessionHook from "@/hooks/SessionHook"
import { useState, useEffect } from "react"

export default function ProfilePage() {
    const { user, isAuthenticated } = SessionHook()
    const router = useRouter()
    const { showToast } = useToast()
    const hasRedirected = useRef(false)

    const [userData, setUserData] = useState({
        username: "",
        email: "",
        image: "",
        location: "",
        bio: "",
    })
    const [activeTab, setActiveTab] = useState("profile")
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
    const [profileImage, setProfileImage] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    // Redirect unauthenticated users (after hooks are defined)
    useEffect(() => {
        if (!isAuthenticated && !hasRedirected.current) {
            hasRedirected.current = true
            showToast({
                type: "error",
                title: "Unauthorized",
                message: "You must be logged in to access profile page.",
            })
            // router.push("/auth")
        }
    }, [isAuthenticated, showToast, router])

    // Update user data when available
   useEffect(() => {
    if (user) {
        const userImage = user.image || null
        console.log("👤 User Image URL:", userImage) // Add this
        setProfileImage(userImage)
        setUserData({
            username: user.name || "",
            email: user.email || "",
            image: user.image || "",
            location: "",
            bio: "",
        })
    }
}, [user])

    // ❌ DON’T put `return null` before all hooks run
    // ✅ DO it here, after all hooks have been declared
    if (!isAuthenticated) {
        return console.log("User is not authenticated, redirecting...") // Redirect or show a loading spinner;
        // or a loading spinner
    }

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
        setProfileImage(null)
    }

    const handleSignOut = () => {
        signOut({ callbackUrl: "/" })
    }

    const handleDeleteAccount = async () => {
        if (!user?.email) {
            alert("User email not found. Please try logging in again.")
            return
        }

        console.log("User object:", user)
        console.log("Deleting account for email:", user.email)

        setIsDeleting(true)

        try {
            const response = await fetch(`http://localhost:3001/api/users/delete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: user.email }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || "Failed to delete account")
            }

            const result = await response.json()

            showToast({
                type: "success",
                title: "Success",
                message: "Account deleted successfully. You will be logged out.",
            })

            setShowDeleteConfirm(false)

            signOut({ callbackUrl: "/" })
        } catch (error) {
            console.error("Error deleting account:", error)
            alert(error instanceof Error ? error.message : "Failed to delete account. Please try again.")
        } finally {
            setIsDeleting(false)
        }
    }

    const tabs = [
        { id: "profile", label: "Edit Profile" },
        { id: "password", label: "Password" },
        { id: "address", label: "Address & Contact" },
        { id: "bookings", label: "My Bookings" },
        { id: "cart", label: "My Cart" },
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
                        name={user?.name || undefined}
                        email={user?.email || undefined}
                        image={user?.image || undefined}
                    />
                )
            case "password":
                return <PasswordContent />
            case "address":
                return <AddressContent />
            case "bookings":
                return <MyBookingsContent />
            case "cart":
                return <MyCartContent />
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 font-poppins">
            {/* Header Section */}
            <div className="bg-primary_green text-white py-8 px-4 md:px-8">
                <div className="max-w-6xl mx-auto flex items-center gap-6">
                    <div className="relative">
                        <Avatar className="w-20 h-20 rounded-full border-4 border-white/30 overflow-hidden flex items-center justify-center bg-gray-200">
                            {profileImage ? (
                                <AvatarImage src={profileImage} alt="Profile" className="w-20 h-20 object-cover" />
                            ) : (
                                <AvatarFallback className="w-20 h-20 flex items-center justify-center bg-gray-300 text-gray-600 font-bold text-2xl">
                                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                                </AvatarFallback>
                            )}
                        </Avatar>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">{user?.name || ""}</h1>
                        <p className="text-white/90">{user?.email || ""}</p>
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
                <div className="md:col-span-3 bg-white rounded-xl shadow-sm md:p-6 min-h-[400px]">
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
                onClose={() => !isDeleting && setShowDeleteConfirm(false)}
                onConfirm={handleDeleteAccount}
                title="Delete Account"
                message="Are you sure you want to delete your account? This action cannot be undone."
                confirmText={isDeleting ? "Deleting..." : "Delete Account"}
                variant="danger"
            />
        </div>
    )
}
