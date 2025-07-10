"use client"
import { useState } from "react"
import Image from "next/image"
import { FiClock, FiMapPin, FiCalendar, FiUser, FiCreditCard, FiXCircle } from "react-icons/fi"
import { isTripCompleted } from "@/lib/utils"

type Booking = {
    id: string
    packageType: "tour" | "transfer"
    title: string
    image: string
    date: string
    time: string
    adults: number
    children: number
    price: number
    status: "upcoming" | "completed"
    details: {
        location?: string
        pickup?: string
        duration?: string
        vehicle?: string
    }
}

export default function MyBookingsContent() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "history">("upcoming")

    // Dummy data - replace with actual API calls
    const bookings: Booking[] = [
        {
            id: "1",
            packageType: "tour",
            title: "Full Day Land Rover Adventure",
            image: "/images/tour1.jpg",
            date: "2021-11-15",
            time: "08:30 AM",
            adults: 2,
            children: 1,
            price: 449,
            status: isTripCompleted("2026-11-15", "08:30 AM") ? "completed" : "upcoming",
            details: {
                duration: "8 hours",
                pickup: "Tanah Rata Hotel",
            },
        },
        {
            id: "2",
            packageType: "transfer",
            title: "Cameron Highlands to Kuala Lumpur",
            image: "/images/transfer1.jpg",
            date: "2028-11-20",
            time: "02:00 PM",
            adults: 3,
            children: 1,
            price: 120,
            status: isTripCompleted("2028-11-20", "02:00 PM") ? "completed" : "upcoming",
            details: {
                pickup: "Heritage Hotel",
            },
        },
        {
            id: "3",
            packageType: "tour",
            title: "Sunrise + Half Day Tour",
            image: "/images/tour2.jpg",
            date: "2022-11-20",
            time: "05:00 AM",
            adults: 1,
            children: 1,
            price: 299,
            status: isTripCompleted("2022-11-20", "02:00 PM") ? "completed" : "upcoming",
            details: {
                location: "Coral Hills",
                duration: "6 hours",
            },
        },
        {
            id: "4",
            packageType: "transfer",
            title: "Taman Negara to Cameron Highlands",
            image: "/images/transfer3.jpg",
            date: "2026-07-11",
            time: "09:00 PM",
            adults: 5,
            children: 1,
            price: 150,
            status: isTripCompleted("2022-07-10", "01:00 PM") ? "completed" : "upcoming",
            details: {
                pickup: "Taman Negara Jetty",
                vehicle: "Mini Van (8 seater)",
            },
        },
    ]

    const upcomingBookings = bookings.filter((b) => b.status === "upcoming")
    const pastBookings = bookings.filter((b) => b.status !== "upcoming")

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "upcoming":
                return (
                    <span className="bg-primary_green/10 text-primary_green px-3 py-1 rounded-full text-sm">Upcoming</span>
                )
            case "completed":
                return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Completed</span>
            default:
                return null
        }
    }

    return (
        <div className="max-w-6xl mx-auto p-4p md:p-6 font-poppins">
            <h1 className="text-2xl md:text-3xl font-bold text-title_black mb-6">My Bookings</h1>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 mb-8">
                <button
                    onClick={() => setActiveTab("upcoming")}
                    className={`px-4 py-3 font-medium ${
                        activeTab === "upcoming" ? "text-primary_green border-b-2 border-primary_green" : "text-desc_gray"
                    }`}
                >
                    Upcoming ({upcomingBookings.length})
                </button>
                <button
                    onClick={() => setActiveTab("history")}
                    className={`px-4 py-3 font-medium ${
                        activeTab === "history" ? "text-primary_green border-b-2 border-primary_green" : "text-desc_gray"
                    }`}
                >
                    History ({pastBookings.length})
                </button>
            </div>

            {/* Bookings List */}
            <div className="space-y-6">
                {(activeTab === "upcoming" ? upcomingBookings : pastBookings).map((booking) => (
                    <div
                        key={booking.id}
                        className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
                    >
                        <div className="flex flex-col md:flex-row">
                            {/* Booking Image */}
                            <div className="relative h-48 md:h-auto md:w-1/3">
                                <Image src={booking.image} alt={booking.title} fill className="object-cover" />
                                <div className="absolute top-3 right-3">{getStatusBadge(booking.status)}</div>
                            </div>

                            {/* Booking Details */}
                            <div className="p-5 md:w-2/3">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-xl font-semibold text-title_black">{booking.title}</h3>
                                    <p className="text-lg font-medium text-primary_green">RM {booking.price}</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                    <div className="flex items-center text-desc_gray">
                                        <FiCalendar className="mr-2" />
                                        <span>
                                            {new Date(booking.date).toLocaleDateString("en-US", {
                                                weekday: "short",
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-desc_gray">
                                        <FiClock className="mr-2" />
                                        <span>{booking.time}</span>
                                    </div>
                                        <div className="flex items-center text-desc_gray">
                                            <FiUser className="mr-2" />
                                            <span className="flex flex-col">
                                                {booking.adults} {booking.adults === 1 ? "adult" : "adults"},{" "}
                                                {booking.children} {booking.children === 1 ? "child" : "children"}
                                            </span>
                                        </div>
                                    {booking.details.location && (
                                        <div className="flex items-center text-desc_gray">
                                            <FiMapPin className="mr-2" />
                                            <span>{booking.details.location}</span>
                                        </div>
                                    )}
                                    {booking.details.pickup && (
                                        <div className="flex items-center text-desc_gray">
                                            <FiMapPin className="mr-2" />
                                            <span>Pickup: {booking.details.pickup}</span>
                                        </div>
                                    )}
                                    {booking.details.vehicle && (
                                        <div className="flex items-center text-desc_gray">
                                            <FiCreditCard className="mr-2" />
                                            <span>Vehicle: {booking.details.vehicle}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                                    {booking.status === "upcoming" && (
                                        <>
                                            <button className="px-4 py-2 bg-primary_green text-white rounded-lg hover:bg-primary_green/90 transition-colors">
                                                View Trip
                                            </button>
                                        </>
                                    )}
                                    {booking.status !== "upcoming" && (
                                        <button className="px-4 py-2 bg-primary_green text-white rounded-lg hover:bg-primary_green/90 transition-colors">
                                            Book Again
                                        </button>
                                    )}
                                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                        Get Receipt
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Empty State */}
                {activeTab === "upcoming" && upcomingBookings.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-medium text-title_black mb-2">No Upcoming Bookings</h3>
                        <p className="text-desc_gray mb-6">Your upcoming tours and transfers will appear here</p>
                        <a
                            href="/tours"
                            className="inline-block bg-primary_green text-white px-6 py-3 rounded-lg hover:bg-primary_green/90 transition-colors"
                        >
                            Browse Tours
                        </a>
                    </div>
                )}

                {activeTab === "history" && pastBookings.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-medium text-title_black mb-2">No Booking History</h3>
                        <p className="text-desc_gray mb-6">Your completed and cancelled bookings will appear here</p>
                    </div>
                )}
            </div>
        </div>
    )
}
