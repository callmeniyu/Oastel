export interface Address {
    whatsapp?: string
    phone?: string
    pickupAddresses?: string[]
}

export interface UserType {
    name: string
    email: string
    passwordHash?: string
    image?: string
    location?: string
    bio?: string
    address?: Address
    bookings: string
    createdAt: Date
    updatedAt: Date
}

export type FAQType = {
    id?:number | string
    question: string
    answer: string
    category?: string
}

export type TourDetailsType = {
    about: string
    itinerary: string
    pickupLocation: string
    pickupGuidelines?: string
    note: string
    faq: FAQType[]
}

export type TourType = {
    id?: string
    _id: string
    title: string
    slug: string
    image: string
    tags: string[]
    description: string
    type: string
    packageType: string
    duration: string
    period: "Half-Day" | "Full-Day"
    bookedCount: string | number
    oldPrice: number
    newPrice: number
    childPrice: number
    minimumPerson: number
    maximumPerson?: number
    departureTimes: string[]
    label?: "Recommended" | "Popular" | "Best Value" | "Best seller" | null
    details: TourDetailsType
    createdAt: Date
    updatedAt: Date
}

export interface TransferDetails {
    about: string
    itinerary: string
    pickupOption: "admin" | "user"
    pickupLocations: string
    dropOffLocations?: string
    note?: string
    faq: FAQType[]
}

export interface TransferType {
    _id?: string
    slug: string
    title: string
    image: string
    from: string
    to: string
    tags: string[]
    desc: string
    type: "Van" | "Van + Ferry" | "Private"
    vehicle?: string
    packageType: "transfer"
    duration: string
    bookedCount: number | string
    oldPrice: number
    newPrice: number
    childPrice: number
    minimumPerson: number
    maximumPerson?: number
    seatCapacity?: number
    times: string[]
    label?: "Recommended" | "Popular" | "Best Value" | "Best seller"
    status: "active" | "sold"
    details: TransferDetails
    createdAt: Date
    updatedAt: Date
}

export interface BookingDetailsType {
    packageId: string
    title: string
    slug: string
    date: string
    time: string
    packageType: "tour" | "transfer"
    type: string
    transport?: "Van" | "Van + Ferry" | "Private"
    duration: string
    adults: number
    children: number
    adultPrice: number
    childPrice: number
    totalPrice: number
    total: number
    image?: string
    pickupLocations: string
    pickupDescription?: string // Add pickup description field
    pickupOption?: "admin" | "user" // Add pickupOption for transfers
    // For private transfers
    isVehicleBooking?: boolean
    vehicleSeatCapacity?: number
    vehicleName?: string
}

export type BlogType = {
    _id: string
    image: string
    title: string
    slug: string
    description: string
    createdAt: Date
    updatedAt: Date
    category: string
    views: number
    content: string
}
