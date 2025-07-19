import { TransferType } from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export interface TransfersResponse {
    success: boolean
    data: TransferType[]
    pagination: {
        page: number
        limit: number
        total: number
        pages: number
    }
}

export interface TransferResponse {
    success: boolean
    data: TransferType
}

export interface ApiError {
    success: false
    message: string
    errors?: any
}

export const transferApi = {
    // Get all transfers with optional filters and pagination
    getTransfers: async (params?: {
        page?: number
        limit?: number
        type?: string
        search?: string
    }): Promise<TransfersResponse> => {
        try {
            const searchParams = new URLSearchParams()

            if (params?.page) searchParams.append("page", params.page.toString())
            if (params?.limit) searchParams.append("limit", params.limit.toString())
            if (params?.type && params.type !== "all") searchParams.append("type", params.type)
            if (params?.search) searchParams.append("search", params.search)

            const response = await fetch(`${API_BASE_URL}/api/transfers?${searchParams}`)

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            return await response.json()
        } catch (error) {
            console.error("Error fetching transfers:", error)
            throw error
        }
    },

    // Get a single transfer by ID
    getTransferById: async (id: string): Promise<TransferResponse> => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/transfers/${id}`)

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            return await response.json()
        } catch (error) {
            console.error("Error fetching transfer:", error)
            throw error
        }
    },

    // Get a single transfer by slug
    getTransferBySlug: async (slug: string): Promise<TransferResponse> => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/transfers/slug/${slug}`)

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            return await response.json()
        } catch (error) {
            console.error("Error fetching transfer:", error)
            throw error
        }
    },

    // Check if a slug is available
    checkSlugAvailability: async (slug: string, excludeId?: string): Promise<{ success: boolean; available: boolean }> => {
        try {
            const searchParams = new URLSearchParams()
            if (excludeId) searchParams.append("excludeId", excludeId)

            const response = await fetch(`${API_BASE_URL}/api/transfers/check-slug/${slug}?${searchParams}`)

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            return await response.json()
        } catch (error) {
            console.error("Error checking slug availability:", error)
            throw error
        }
    },
}
