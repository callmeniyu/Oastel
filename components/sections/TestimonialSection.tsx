"use client"
import TestimonialCard from "../ui/TestimonialCard"
const testimonials = [
    {
        name: "Cooper",
        country: "Germany",
        avatar: "images/profile.png",
        message: `A3A was very clean & better equipped than most other places we have stayed at in Southeast Asia. The Host was very nice and accommodating as well. We ended up extending our stay for 2 more nights because we enjoyed the accommodation and the Cameron Highlands a lot!`,
    },
]

export default function TestimonialsSection() {
    return (
        <section className="relative bg-primary_green.light py-12 px-4 md:px-8 overflow-hidden">
            <div className="text-center section-title">
                <h2 className="section-title">Voices of Our Guests</h2>
                <p className="mt-2 section-desc font-reg">
                    See what made our customer’s journeys unforgettable.
                </p>
            </div>

            <div className="mt-8 relative">
                <div className="flex gap-6 overflow-x-auto scrollbar-hide px-4 md:px-8 pb-4">
                    {Array(6)
                        .fill(0)
                        .map((_, idx) => (
                            <TestimonialCard key={idx} {...testimonials[0]} />
                        ))}
                </div>
            </div>
            <div className="absolute left-0 top-0 h-full w-16 sm:w-24 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 h-full w-16 sm:w-24 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" />
        </section>
    )
}
