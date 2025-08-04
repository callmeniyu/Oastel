"use client";
import { FiEdit } from "react-icons/fi";
import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { useToast } from "@/context/ToastContext";
import Image from "next/image";

interface ProfileContentProps {
  profileImage: string | null | undefined;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteImage: () => void;
  name?: string;
  email?: string | null;
  image?: string | null;
}

export default function ProfileContent({
  profileImage,
  onImageUpload,
  onDeleteImage,
  name,
  email,
  image,
}: ProfileContentProps) {
  const { showToast } = useToast();
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    image: "",
    location: "",
    bio: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Get the primary image to display (prioritize profileImage, then image from session)
  const displayImage = profileImage || image;

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

  // Update userData when user data is loaded
  useEffect(() => {
    setUserData({
      username: name || "",
      email: email || "",
      image: image || "",
      location: "",
      bio: "",
    });
  }, [name, email, image]);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!email) return;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile/${email}`
        );
        const result = await response.json();

        if (result.success && result.data) {
          setUserData((prev) => ({
            ...prev,
            location: result.data.location || "",
            bio: result.data.bio || "",
          }));
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [email]);

  const handleSaveChanges = async () => {
    if (!email) {
      showToast({
        type: "error",
        title: "Error",
        message: "User email not found",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            name: userData.username,
            location: userData.location,
            bio: userData.bio,
            image: profileImage || userData.image,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        showToast({
          type: "success",
          title: "Success",
          message: "Profile updated successfully",
        });
      } else {
        showToast({
          type: "error",
          title: "Error",
          message: result.message || "Failed to update profile",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast({
        type: "error",
        title: "Error",
        message: "An error occurred while updating your profile",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <h2 className="text-xl font-bold text-title_black mb-6">
        Profile Information
      </h2>
      <div className="space-y-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative group">
            <div className="w-20 h-20 rounded-full border-4 border-white/30 overflow-hidden flex items-center justify-center bg-gray-200">
              {displayImage && !imageError ? (
                <Image
                  src={displayImage}
                  alt="Profile"
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover"
                  onError={() => setImageError(true)}
                  unoptimized={displayImage.includes("googleusercontent.com")} // For Google images
                />
              ) : (
                <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-primary_green to-primary_green/80 text-white font-bold text-2xl">
                  {getInitials(name || "")}
                </div>
              )}
            </div>
            <label className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <FiEdit className="text-white text-xl" />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setImageError(false); // Reset error state when new image is selected
                  onImageUpload(e);
                }}
                className="hidden"
              />
            </label>
          </div>
          {displayImage && !imageError ? (
            <button
              onClick={() => {
                setImageError(false);
                onDeleteImage();
              }}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Remove Photo
            </button>
          ) : (
            <p className="text-sm text-gray-500">
              {imageError
                ? "Image failed to load. Click to upload a new one."
                : "Click on the avatar to add a profile image"}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-desc_gray mb-1">
            Name
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary_green focus:border-transparent"
            value={userData.username}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, username: e.target.value }))
            }
            placeholder="Enter your name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-desc_gray mb-1">
            Email
          </label>
          <input
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary_green focus:border-transparent text-gray-500"
            disabled
            value={userData.email || ""}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-desc_gray mb-1">
            Location
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary_green focus:border-transparent"
            placeholder="Enter your location"
            value={userData.location}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, location: e.target.value }))
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-desc_gray mb-1">
            Bio
          </label>
          <textarea
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary_green focus:border-transparent"
            placeholder="Tell us about yourself"
            value={userData.bio}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, bio: e.target.value }))
            }
          />
        </div>
        <button
          onClick={handleSaveChanges}
          disabled={isLoading}
          className="mt-4 bg-primary_green text-white px-6 py-2 rounded-lg hover:bg-primary_green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
