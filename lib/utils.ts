import { allTours } from "./data"
import { allBlogs } from "./data"

export const getAllTours = async () => { 
    return allTours
}

export const getOtherTours = async (slug:string) => {
    return  allTours.filter(tour => tour.slug !== slug).slice(0, 4);
}

export const getTourBySlug = async (slug: string) => {
    return allTours.find((tour) => tour.slug === slug)
}

export const getAllBlogs = async () => { 
    return allBlogs
}

export const getBlogBySlug = async (slug: string) => {
    return allBlogs.find((blog) => blog.slug === slug)
}

export const getOtherBlogs = async (slug: string) => {
    return allBlogs.filter(blog => blog.slug !== slug).slice(0, 4);
}