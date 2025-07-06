export type TourFAQType = {
    question: string
    answer: string
}

export type TourDetailsType = {
    about: string
    itinerary: string[]
    pickupLocations: string[]
    note: string
    faq: TourFAQType[]
}

export type TourType = {
    id: number
    slug: string
    title: string
    image: string
    tags: string[]
    desc: string
    type: string
    duration: string
    bookedCount: string | number
    oldPrice: number
    newPrice: number
    childPrice: number
    minimumPerson: number
    maximumPerson?: number
    time: string[]
    details: TourDetailsType
}

export interface BookingDetailsType {
    title: string
    slug: string
    date: string
    time: string
    type: string
    duration: string
    adults: number
    children: number
    adultPrice: number
    childPrice: number
    totalPrice: number
}

export type BlogType = {
    _id:string
    image: string
    title: string
    slug: string
    desc: string
    date: string
    category: string
    views: number
    content: string
}


