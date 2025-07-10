import { allTours } from "./data"
import { allBlogs } from "./data"
import { allTransfers } from "./data"


export const getOtherTours = async (slug:string) => {
    return  allTours.filter(tour => tour.slug !== slug).slice(0, 4);
}

export const getTourBySlug = async (slug: string) => {
    return allTours.find((tour) => tour.slug === slug)
}


export const getBlogBySlug = async (slug: string) => {
    return allBlogs.find((blog) => blog.slug === slug)
}

export const getOtherBlogs = async (slug: string) => {
    return allBlogs.filter(blog => blog.slug !== slug).slice(0, 4);
}

export const getTransferBySlug = async (slug: string) => {
    return allTransfers.find((transfer) => transfer.slug === slug)
}

export const getOtherTransfers = async (slug: string) => {
    return allTransfers.filter(transfer => transfer.slug !== slug).slice(0, 4);
}


export const isTripCompleted = (bookingDate: string, bookingTime: string) => {
    const currentDate = new Date();
    const tripDate = new Date(`${bookingDate} ${bookingTime}`);
    return tripDate < currentDate;
}