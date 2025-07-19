import { allTours } from "./data"
import { allTransfers } from "./data"

export const getOtherTours = async (slug: string) => {
    return allTours.filter((tour) => tour.slug !== slug).slice(0, 4)
}

export const getTourBySlug = async (slug: string) => {
    return allTours.find((tour) => tour.slug === slug)
}

export const getBlogBySlug = async (slug: string) => {
    const { blogApi } = await import("./blogApi")
    try {
        const response = await blogApi.getBlogBySlug(slug)
        if (response.success) {
            // Increment view count
            await blogApi.incrementViews(response.data._id)
            return response.data
        }
        return null
    } catch (error) {
        console.error("Error fetching blog by slug:", error)
        return null
    }
}

export const getOtherBlogs = async (slug: string) => {
    const { blogApi } = await import("./blogApi")
    try {
        const response = await blogApi.getBlogs({
            sortBy: "createdAt",
            sortOrder: "desc",
            limit: 4,
        })
        if (response.success) {
            return response.data.filter((blog) => blog.slug !== slug)
        }
        return []
    } catch (error) {
        console.error("Error fetching other blogs:", error)
        return []
    }
}

export const getTransferBySlug = async (slug: string) => {
    const { transferApi } = await import("./transferApi")
    try {
        const response = await transferApi.getTransferBySlug(slug)
        return response.data
    } catch (error) {
        console.error("Error fetching transfer by slug:", error)
        return null
    }
}

export const getOtherTransfers = async (slug: string) => {
    const { transferApi } = await import("./transferApi")
    try {
        const response = await transferApi.getTransfers({ limit: 8 })
        if (response.success) {
            return response.data.filter((transfer) => transfer.slug !== slug).slice(0, 4)
        }
        return []
    } catch (error) {
        console.error("Error fetching other transfers:", error)
        return []
    }
}

export const isTripCompleted = (bookingDate: string, bookingTime: string) => {
    const currentDate = new Date()
    const tripDate = new Date(`${bookingDate} ${bookingTime}`)
    return tripDate < currentDate
}
