import { BlogType } from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export interface BlogsResponse {
    success: boolean
    data: BlogType[]
    pagination: {
        page: number
        limit: number
        total: number
        pages: number
    }
}

export interface BlogResponse {
    success: boolean
    data: BlogType
}

export interface ApiError {
    success: false
    message: string
    errors?: any
}

export const blogApi = {
    // Get all blogs with optional filters and pagination
    getBlogs: async (params?: {
        page?: number
        limit?: number
        category?: string
        search?: string
        sortBy?: string
        sortOrder?: "asc" | "desc"
    }): Promise<BlogsResponse> => {
        try {
            const searchParams = new URLSearchParams()

            if (params?.page) searchParams.append("page", params.page.toString())
            if (params?.limit) searchParams.append("limit", params.limit.toString())
            if (params?.category && params.category !== "all") searchParams.append("category", params.category)
            if (params?.search) searchParams.append("search", params.search)
            if (params?.sortBy) searchParams.append("sortBy", params.sortBy)
            if (params?.sortOrder) searchParams.append("sortOrder", params.sortOrder)

            const response = await fetch(`${API_BASE_URL}/api/blogs?${searchParams}`)

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            return await response.json()
        } catch (error) {
            console.error("Error fetching blogs:", error)
            throw error
        }
    },

    // Get blog by ID
    getBlogById: async (id: string): Promise<BlogResponse> => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/blogs/${id}`)

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            return await response.json()
        } catch (error) {
            console.error("Error fetching blog:", error)
            throw error
        }
    },

    // Get blog by slug
    getBlogBySlug: async (slug: string): Promise<BlogResponse> => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/blogs/slug/${slug}`)

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            return await response.json()
        } catch (error) {
            console.error("Error fetching blog by slug:", error)
            throw error
        }
    },

    // Increment view count
    incrementViews: async (id: string): Promise<{ success: boolean; message: string }> => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/blogs/${id}/views`, {
                method: "POST",
            })

            if (!response.ok) {
                // If endpoint doesn't exist (404), return success to avoid breaking the page
                if (response.status === 404) {
                    console.warn("View increment endpoint not implemented yet")
                    return { success: true, message: "View increment endpoint not available" }
                }
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            return await response.json()
        } catch (error) {
            console.error("Error incrementing views:", error)
            // Return success to avoid breaking the page
            return { success: false, message: "Failed to increment views" }
        }
    },
}
