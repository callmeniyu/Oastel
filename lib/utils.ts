import { allTours } from "./data"

export const getAllTours = async () => { 
    return allTours
}

export const getOtherTours = async (slug:string) => {
    return  allTours.filter(tour => tour.slug !== slug).slice(0, 4);
}

export const getTourBySlug = async (slug: string) => {
    return allTours.find((tour) => tour.slug === slug)
}