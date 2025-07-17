import { TourType } from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export interface ToursResponse {
    success: boolean
    data: TourType[]
    pagination: {
        page: number
        limit: number
        total: number
        pages: number
    }
}

export interface TourResponse {
    success: boolean
    data: TourType
}

export interface ApiError {
    success: false
    message: string
    errors?: any
}

export interface ImageUploadResponse {
    success: boolean
    message: string
    data: {
        imageUrl: string
        filename: string
        originalName: string
        size: number
    }
}

export const tourApi = {
    // Get all tours with optional filters and pagination
    getTours: async (params?: {
        page?: number
        limit?: number
        type?: string
        search?: string
    }): Promise<ToursResponse> => {
        try {
            const searchParams = new URLSearchParams()

            if (params?.page) searchParams.append("page", params.page.toString())
            if (params?.limit) searchParams.append("limit", params.limit.toString())
            if (params?.type && params.type !== "all") searchParams.append("type", params.type)
            if (params?.search) searchParams.append("search", params.search)

            const response = await fetch(`${API_BASE_URL}/api/tours?${searchParams}`)

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            return await response.json()
        } catch (error) {
            console.error("Error fetching tours:", error)
            throw error
        }
    },

    // Get a single tour by ID
    getTourById: async (id: string): Promise<TourResponse> => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/tours/${id}`)

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            return await response.json()
        } catch (error) {
            console.error("Error fetching tour:", error)
            throw error
        }
    },

    // Get a single tour by slug
    getTourBySlug: async (slug: string): Promise<TourResponse> => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/tours/slug/${slug}`)

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            return await response.json()
        } catch (error) {
            console.error("Error fetching tour:", error)
            throw error
        }
    },

    // Check if a slug is available
    checkSlugAvailability: async (slug: string, excludeId?: string): Promise<{ success: boolean; available: boolean }> => {
        try {
            const searchParams = new URLSearchParams()
            if (excludeId) searchParams.append("excludeId", excludeId)

            const response = await fetch(`${API_BASE_URL}/api/tours/check-slug/${slug}?${searchParams}`)

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            return await response.json()
        } catch (error) {
            console.error("Error checking slug availability:", error)
            throw error
        }
    },

    // Upload tour image
    uploadImage: async (file: File): Promise<ImageUploadResponse> => {
        try {
            const formData = new FormData()
            formData.append("image", file)

            const response = await fetch(`${API_BASE_URL}/api/upload/tour-image`, {
                method: "POST",
                body: formData,
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
            }

            return await response.json()
        } catch (error) {
            console.error("Error uploading image:", error)
            throw error
        }
    },

    // Delete tour image
    deleteImage: async (imagePath: string): Promise<{ success: boolean; message: string }> => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/upload/tour-image`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ imagePath }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
            }

            return await response.json()
        } catch (error) {
            console.error("Error deleting image:", error)
            throw error
        }
    },
}

export default tourApi
