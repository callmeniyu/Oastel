import BookingOptions from "./BookingOptionsSection"
import { IoHomeOutline } from "react-icons/io5";
import { FiMapPin } from "react-icons/fi";
import { LiaShuttleVanSolid } from "react-icons/lia";
import Link from "next/link";
const tourCards = [
    {
        title: "Explore Nature Without the Noise",
        subtitle: "Skip the crowds and connect deeply with nature in curated small-group adventures",
        image: "/images/hero3.jpg",
    },
    {
        title: "Easy Booking, Smooth Rides",
        subtitle: "From tour to transport, booking with Oastel is super easy",
        image: "/images/hero4.jpg",
    },
    {
        title: "Designed for Backpackers & Explorers",
        subtitle: "Packages tailored to solo travelers, digital nomads, and curious wanderers.",
        image: "/images/hero5.jpg",
    },
    {
        title: "Travel Together, Save More",
        subtitle: "Co-tours designed for solo travelers and groups to explore at a lower cost",
        image: "/images/hero1.jpg",
    },
    {
        title: "Your Ride, Your Rules",
        subtitle: "Enjoy private van transfers with full control over your schedule, stops, and comfort.",
        image: "/images/hero2.jpg",
    },
]

export default function HeroSection() {
    return (
        <section className="bg-primary_green text-white pt-12 pb-10  md:px-8 font-poppins">
            <div className="px-2 lg:px-28">
                <h1 className="text-2xl md:text-4xl font-semibold text-center leading-snug mb-3 ">
                    Explore Cameron Highlands with Oastel <br />
                    Mossy Forest • Tea Plantations • Rafflesia Adventures
                </h1>
                <p className="text-white/70 text-center">
                    From co-living stays to customizable tours and smooth transport — we’re your local guide to real
                    adventures in the Highlands.
                </p>
            </div>
            <BookingOptions />

            <div className="px-8 py-4 bg-white flex gap-4 justify-between mx-3 rounded-full mt-6 md:hidden">
                <Link href="https://booking.exely.com/en/oastel/" className="space-y-1 flex flex-col items-center flex-1 hover:scale-125 ease-in-out">
                    <IoHomeOutline className="text-2xl text-primary_green" />
                    <p className="text-sm text-primary_green font-semibold">Book Stay</p>
                </Link>
                <Link href="/tours" className="space-y-1 flex flex-col items-center flex-1 hover:scale-125 ease-in-out">
                    <FiMapPin className="text-2xl text-primary_green" />
                    <p className="text-sm text-primary_green font-semibold">Book Tour</p>
                </Link>
                <Link href="transports" className="space-y-1 flex flex-col items-center flex-1 hover:scale-125 ease-in-out">
                    <LiaShuttleVanSolid className="text-2xl text-primary_green" />
                    <p className="text-sm text-primary_green text-center font-semibold">Book Ticket</p>
                </Link>
            </div>
        </section>
    )
}
