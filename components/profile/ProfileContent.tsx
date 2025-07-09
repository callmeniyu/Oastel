"use client"
import { FiEdit } from "react-icons/fi"
import { useState, useEffect } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar"

interface ProfileContentProps {
    profileImage: string | null | undefined
    onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
    onDeleteImage: () => void
    name?: string
    email?: string | null
    image?: string | null
}

export default function ProfileContent({
    profileImage,
    onImageUpload,
    onDeleteImage,
    name,
    email,
    image,
}: ProfileContentProps) {
    const [userData, setUserData] = useState({
        username: "",
        email: "",
        image: "",
        location: "",
        bio: "",
    })

    // Update userData when user data is loaded
    useEffect(() => {
        setUserData({
            username: name || "",
            email: email || "",
            image: image || "",
            location: "",
            bio: "",
        })
    }, [name, email, image])
    return (
        <div>
            <h2 className="text-xl font-bold text-title_black mb-6">Profile Information</h2>
            <div className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative group">
                        <Avatar className="w-20 h-20 rounded-full border-4 border-white/30 overflow-hidden flex items-center justify-center bg-gray-200">
                            {profileImage ? (
                                <AvatarImage src={profileImage} alt="Profile" className="w-20 h-20 object-cover" />
                            ) : (
                                <AvatarFallback className="w-20 h-20 flex items-center justify-center bg-gray-300 text-gray-600 font-bold text-2xl">
                                    {name ? name.charAt(0).toUpperCase() : "U"}
                                </AvatarFallback>
                            )}
                        </Avatar>
                        <label className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <FiEdit className="text-white text-xl" />
                            <input type="file" accept="image/*" onChange={onImageUpload} className="hidden" />
                        </label>
                    </div>
                    {profileImage ? (
                        <button onClick={onDeleteImage} className="text-sm text-red-600 hover:text-red-800">
                            Remove Photo
                        </button>
                    ) : (
                        <p className="text-sm text-gray-500">Click on the avatar to add a profile image</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-desc_gray mb-1">Name</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary_green focus:border-transparent"
                        value={userData.username}
                        onChange={(e) => setUserData((prev) => ({ ...prev, username: e.target.value }))}
                        placeholder="Enter your name"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-desc_gray mb-1">Email</label>
                    <input
                        type="email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary_green focus:border-transparent text-gray-500"
                        disabled
                        value={userData.email || ""}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-desc_gray mb-1">Location</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary_green focus:border-transparent"
                        placeholder="Enter your location"
                        value={userData.location}
                        onChange={(e) => setUserData((prev) => ({ ...prev, location: e.target.value }))}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-desc_gray mb-1">Bio</label>
                    <textarea
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary_green focus:border-transparent"
                        placeholder="Tell us about yourself"
                        value={userData.bio}
                        onChange={(e) => setUserData((prev) => ({ ...prev, bio: e.target.value }))}
                    />
                </div>
                <button className="mt-4 bg-primary_green text-white px-6 py-2 rounded-lg hover:bg-primary_green/90 transition-colors">
                    Save Changes
                </button>
            </div>
        </div>
    )
}
