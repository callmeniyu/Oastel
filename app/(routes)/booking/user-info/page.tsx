"use client"

import { useBooking } from "@/context/BookingContext"
import BookingInfoPanel from "@/components/ui/BookingInfoPanel"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type Country = { name: string; cca2: string; callingCode: string }

export default function BookingUserInfoPage() {
    const { booking } = useBooking()
    const router = useRouter()

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        countryCode: "+60", // Malaysia's country code
        pickupLocation: "",
    })

    const [countries, setCountries] = useState<Country[]>([])

    useEffect(() => {
        if (!booking) router.replace("/")
    }, [booking])

    useEffect(() => {
        async function loadCountries() {
            try {
                const res = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2,idd")
                const data = await res.json()
                interface RestCountry {
                    name: { common: string }
                    cca2: string
                    idd?: { root?: string; suffixes?: string[] }
                }

                const mapped: Country[] = (data as RestCountry[])
                    .map((c: RestCountry) => {
                        const code = c.idd?.root && c.idd?.suffixes?.[0] ? `${c.idd.root}${c.idd.suffixes[0]}` : null
                        return code ? { name: c.name.common, cca2: c.cca2, callingCode: code } : null
                    })
                    .filter((c: Country | null): c is Country => !!c)
                    .sort((a, b) => {
                        // Put Malaysia first, then sort the rest alphabetically
                        if (a.name === "Malaysia") return -1
                        if (b.name === "Malaysia") return 1
                        return a.name.localeCompare(b.name)
                    })
                setCountries(mapped)
            } catch (err) {
                console.error("Could not load country codes", err)
            }
        }

        loadCountries()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const goToCheckout = () => {
        router.push("/booking/checkout")
    }

    return (
        <div className="max-w-6xl mx-auto px-4 md:px-12 py-6 grid grid-cols-1 md:grid-cols-3 gap-8 font-poppins">
            {/* Form Section */}
            <div className="md:col-span-2 order-1 md:-order-1">
                <h2 className="text-primary_green text-2xl font-bold mb-6">Fill your details</h2>

                <div className="space-y-4">
                    {/* Name, Email, Pickup Location */}
                    {["name", "email", "pickupLocation"].map((field) => (
                        <div key={field} className="w-full">
                            <input
                                name={field}
                                value={(form as any)[field]}
                                onChange={handleChange}
                                placeholder={
                                    field === "pickupLocation"
                                        ? "Enter your Hostel/Hotel name and address"
                                        : `Enter your ${field === "email" ? "email" : field}`
                                }
                                className="w-full border border-primary_green/40 rounded px-4 py-2 placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-primary_green"
                            />
                            {field === "pickupLocation" && booking?.pickupLocations && (
                                <div className="mt-2">
                                    <div className="flex flex-col sm:flex-row flex-wrap gap-x-1 text-xs text-gray-500">
                                        <p className="mb-1 sm:mb-0">Pickups are available from hostels/hotels in</p>
                                        <div className="flex flex-wrap gap-x-1">
                                            {booking.pickupLocations.map((location, i) => (
                                                <span key={i}>
                                                    {location}
                                                    {i < booking.pickupLocations.length - 1 ? "," : "."}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* WhatsApp Number Section */}
                    <div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <select
                                name="countryCode"
                                value={form.countryCode}
                                onChange={handleChange}
                                className="sm:w-52 border border-primary_green/40 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary_green"
                            >
                                {countries.map((c) => (
                                    <option key={c.cca2} value={c.callingCode}>
                                        {c.name} ({c.callingCode})
                                    </option>
                                ))}
                            </select>
                            <input
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="Enter WhatsApp number"
                                className="flex-1 border border-primary_green/40 rounded px-4 py-2 placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-primary_green"
                            />
                        </div>
                    </div>
                </div>

                <button
                    onClick={goToCheckout}
                    className="mt-6 w-full sm:w-auto px-6 py-3 bg-primary_green text-white rounded-md hover:bg-primary_green/90 transition"
                >
                    Continue to payment
                </button>
            </div>

            {/* Booking Summary Panel */}
            {booking && (
                <div className="w-full">
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
                        totalPrice={booking.totalPrice}
                        packageType={booking.packageType}
                    />
                </div>
            )}
        </div>
    )
}
