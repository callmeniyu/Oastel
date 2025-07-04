"use client"

import { useBooking } from "@/context/BookingContext"
import BookingInfoPanel from "@/components/ui/BookingInfoPanel"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function BookingUserInfoPage() {
    const { booking } = useBooking()
    const router = useRouter()

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
    })

    useEffect(() => {
        if (!booking) router.replace("/")
    }, [booking])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    return (
        <div className="max-w-6xl mx-auto p-4 md:px-12 grid md:grid-cols-3 gap-6 font-poppins">
            <div className="md:col-span-2">
                <h2 className="text-primary_green text-2xl font-bold mb-4">Fill your details</h2>
                <div className="space-y-4">
                    {["name", "email", "phone", "pickupLocation"].map((field) => (
                        <input
                            key={field}
                            name={field}
                            value={(form as any)[field]}
                            onChange={handleChange}
                            placeholder={
                                field === "pickupLocation"
                                    ? "Enter your Hostel/ Hotel name and address"
                                    : `Enter your ${field.replace(/phone/, "WhatsApp number")}`
                            }
                            className="w-full border border-primary_green/40 rounded px-4 py-2 placeholder:text-sm"
                        />
                    ))}
                </div>

                <button
                    onClick={() => router.push("/booking/checkout")}
                    className="mt-6 px-6 py-3 bg-primary_green text-white rounded-md"
                >
                    Continue to payment
                </button>
            </div>

            {booking && (
                <BookingInfoPanel
                    title={booking.title}
                    date={new Date(booking.date)}
                    time={booking.time}
                    type={booking.type}
                    duration={booking.duration}
                    adults={booking.adults}
                    children={booking.children}
                    adultPrice={booking.adultPrice}
                    childPrice={booking.childPrice}
                    userInfo={true}
                />
            )}
        </div>
    )
}
