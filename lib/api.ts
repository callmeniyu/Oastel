// API functions for transfers
import { TransferType } from "./types"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export const transferAPI = {
    // Get all transfers
    async getAllTransfers(): Promise<TransferType[]> {
        try {
            const response = await fetch(`${API_URL}/api/transfers?limit=1000`, {
                cache: "no-store", // Ensure fresh data
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result = await response.json()
            return result.data || []
        } catch (error) {
            console.error("Error fetching transfers:", error)
            return []
        }
    },

    // Get transfer by slug
    async getTransferBySlug(slug: string): Promise<TransferType | null> {
        try {
            const response = await fetch(`${API_URL}/api/transfers/slug/${slug}`, {
                cache: "no-store", // Ensure fresh data
            })

            if (!response.ok) {
                if (response.status === 404) {
                    return null
                }
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result = await response.json()
            return result.data || null
        } catch (error) {
            console.error("Error fetching transfer by slug:", error)
            return null
        }
    },

    // Get other transfers (excluding current one)
    async getOtherTransfers(slug: string, limit: number = 4): Promise<TransferType[]> {
        try {
            const allTransfers = await this.getAllTransfers()
            return allTransfers.filter((transfer) => transfer.slug !== slug).slice(0, limit)
        } catch (error) {
            console.error("Error fetching other transfers:", error)
            return []
        }
    },

    // Get transfers by type
    async getTransfersByType(type: string): Promise<TransferType[]> {
        try {
            const allTransfers = await this.getAllTransfers()
            return allTransfers.filter((transfer) => transfer.type.toLowerCase() === type.toLowerCase())
        } catch (error) {
            console.error("Error fetching transfers by type:", error)
            return []
        }
    },
}
