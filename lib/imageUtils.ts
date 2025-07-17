const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

/**
 * Resolves image URL to full URL if it's a relative path
 * @param imagePath - The image path from the database
 * @returns Full URL for the image
 */
export const resolveImageUrl = (imagePath: string): string => {
    if (!imagePath) return "/images/placeholder-tour.jpg"

    // If it's already a full URL (Cloudinary, external, etc.), return as is
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
        return imagePath
    }

    // If it's a data URL, return as is
    if (imagePath.startsWith("data:")) {
        return imagePath
    }

    // For local development with relative paths (/uploads/)
    if (imagePath.startsWith("/uploads/")) {
        return `${API_BASE_URL}${imagePath}`
    }

    // For any other relative paths, prepend API base URL
    return `${API_BASE_URL}/${imagePath.replace(/^\//, "")}`
}

/**
 * Extracts filename from image path for deletion
 * @param imagePath - The image path
 * @returns Just the filename
 */
export const getImageFilename = (imagePath: string): string => {
    if (!imagePath) return ""
    return imagePath.split("/").pop() || ""
}

/**
 * Checks if image is uploaded to server (vs external URL)
 * @param imagePath - The image path
 * @returns True if image is stored on server
 */
export const isServerImage = (imagePath: string): boolean => {
    return imagePath?.startsWith("/uploads/") || false
}
