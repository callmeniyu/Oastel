import { allTours } from "./data"
import { allBlogs } from "./data"
import { allTickets } from "./data"


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

export const getTicketBySlug = async (slug: string) => {
    return allTickets.find((ticket) => ticket.slug === slug)
}

export const getOtherTickets = async (slug: string) => {
    return allTickets.filter(ticket => ticket.slug !== slug).slice(0, 4);
}