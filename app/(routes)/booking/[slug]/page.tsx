"use client"
import { useState, useEffect, use } from "react"
import BookingCalendar from "@/components/ui/BookingCalendar"
import BookingInfoPanel from "@/components/ui/BookingInfoPanel"
import { getTourBySlug } from "@/lib/utils"
import { TourType } from "@/lib/types"
import { useParams } from "next/navigation"

const defaultTimings: Record<string, string[]> = {
    "2025-07-03": ["8:00 am", "1:30 pm"],
}

export default function BookingInformationPage() {
    const params = useParams()
    const slug = params.slug as string
    const [tourDetails, setTourDetails] = useState<TourType>()
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [selectedTime, setSelectedTime] = useState(tourDetails?.time[0] || "8:00 am")
    const [availableTimes, setAvailableTimes] = useState<string[]>([])
    const [adults, setAdults] = useState(1)
    const [children, setChildren] = useState(0)

    useEffect(() => {
        const getTourDetails = async () => {
            const tour = await getTourBySlug(slug)
            if (tour) {
                setTourDetails(tour)
            }
        }
        getTourDetails()
    }, [])

    useEffect(() => {
        const key = selectedDate.toISOString().split("T")[0]
        setAvailableTimes(defaultTimings[key] || ["8:00 am"]) // fallback to default
        setSelectedTime(defaultTimings[key]?.[0] || "8:00 am")
    }, [selectedDate])

    return (
        <div className="max-w-7xl mx-auto p-4 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-6 font-poppins">
            <div className="space-y-6 md:col-span-2">
                <div className="flex flex-col md:flex-row gap-6">
                    <BookingCalendar selectedDate={selectedDate} onDateChange={setSelectedDate} />

                    <div className="w-full flex flex-col rounded-lg shadow-md p-4 bg-white">
                        <h3 className="text-primary_green text-xl font-bold mb-2">Select your time</h3>
                        <div className="flex flex-col gap-2 ">
                            {tourDetails &&
                                tourDetails.time.map((t) => (
                                    <button
                                        key={t}
                                        className={`px-4 py-2 rounded border ${
                                            selectedTime === t ? "bg-primary_green text-white" : "bg-white"
                                        }`}
                                        onClick={() => setSelectedTime(t)}
                                    >
                                        {t}
                                    </button>
                                ))}
                            <p className="text-desc_gray text-sm my-1">No other timings are availabe for now</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg shadow-md p-4 bg-white">
                    <h3 className="text-primary_green text-xl font-bold mb-2">No. of Guests</h3>
                    <div className="space-y-4 border p-3 rounded-lg my-4 ">
                        {[
                            { label: "Adults", value: adults, set: setAdults, price: tourDetails?.newPrice || 0 },
                            { label: "Child", value: children, set: setChildren, price: tourDetails?.childPrice || 0 },
                        ].map(({ label, value, set, price }) => (
                            <div key={label} className="flex items-center justify-between">
                                <span className="font-semibold">
                                    {label} <span className="text-sm text-desc_gray">(RM {price})</span>
                                </span>
                                <div className="flex items-center gap-2 border rounded-full ">
                                    <button
                                        onClick={() => set(Math.max(0, value - 1))}
                                        className="hover:bg-primary_green hover:text-white px-2 py-1 rounded-l-xl transition-colors"
                                    >
                                        -
                                    </button>
                                    <span>{value}</span>
                                    <button
                                        onClick={() => set(value + 1)}
                                        className="hover:bg-primary_green hover:text-white px-2 py-1 rounded-r-xl transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                                <span className="font-semibold text-primary_green">RM {value * price}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <BookingInfoPanel
                title={tourDetails?.title || "Tour Title"}
                date={selectedDate}
                time={selectedTime}
                type={tourDetails?.type || "Private Tour"}
                duration={tourDetails?.duration || "4-6 hours"}
                adults={adults}
                children={children}
                adultPrice={tourDetails?.newPrice || 0}
                childPrice={tourDetails?.childPrice || 0}
            />
        </div>
    )
}
