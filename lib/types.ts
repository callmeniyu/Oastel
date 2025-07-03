export type TourFAQType = {
    question: string;
    answer: string;
};

export type TourDetailsType = {
    about: string;
    itinerary: string[];
    pickupLocations: string[];
    note: string;
    faq: TourFAQType[];
};

export type TourType = {
    id: number;
    slug: string;
    title: string;
    image: string;
    tags: string[];
    desc: string;
    type: string;
    duration: string;
    bookedCount: string | number;
    oldPrice: number;
    newPrice: number;
    childPrice: number;
    time: string[];
    details: TourDetailsType;
};