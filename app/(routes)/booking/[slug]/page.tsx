"use client"
import { useState, useEffect, use } from "react"
import BookingCalendar from "@/components/ui/BookingCalendar"
import BookingInfoPanel from "@/components/ui/BookingInfoPanel"
import { getTourBySlug } from "@/lib/utils"
import { TourType } from "@/lib/types"
import { useParams } from "next/navigation"
import { useBooking } from "@/context/BookingContext"
import { useRouter } from "next/navigation"
import { useToast } from "@/context/ToastContext"

const defaultTimings: Record<string, string[]> = {
    "2025-07-03": ["8:00 am", "1:30 pm"],
}

export default function BookingInfoPage() {
    const params = useParams()
    const slug = params.slug as string
    const { setBooking } = useBooking()
    const router = useRouter()
    const { showToast } = useToast()

    const [tourDetails, setTourDetails] = useState<TourType>()
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [selectedTime, setSelectedTime] = useState("8:00 am")
    const [availableTimes, setAvailableTimes] = useState<string[]>([])

    const [adults, setAdults] = useState(0)
    const [children, setChildren] = useState(0)
    const [totalGuests, setTotalGuests] = useState(0)

    useEffect(() => {
        const getTourDetails = async () => {
            const tour = await getTourBySlug(slug)
            if (tour) {
                setTourDetails(tour)
                setAdults(tour.minimumPerson || 1)
                setTotalGuests(tour.minimumPerson || 1)
            }
        }
        getTourDetails()
    }, [slug])

    useEffect(() => {
        const key = selectedDate.toISOString().split("T")[0]
        setAvailableTimes(defaultTimings[key] || ["8:00 am"]) // fallback to default
        setSelectedTime(defaultTimings[key]?.[0] || "8:00 am")
    }, [selectedDate])

    const updateAdults = (newCount: number) => {
        const newTotal = newCount + children
        if (newCount >= (tourDetails?.minimumPerson || 1) && newTotal <= (tourDetails?.maximumPerson || Infinity)) {
            setAdults(newCount)
            setTotalGuests(newTotal)
        }
    }

    const updateChildren = (newCount: number) => {
        const newTotal = adults + newCount
        
        if (newTotal <= (tourDetails?.maximumPerson || Infinity)) {
            setChildren(newCount)
            setTotalGuests(newTotal)
        }
    }

    useEffect(() => {
        if (totalGuests >= (tourDetails?.maximumPerson || Infinity)) { 
            showToast({
            type: "error",
            title: "You have reached the maximum number of guests.",
            message: "Please try contacting us for if more tickets.",
          })
        }
     }, [adults, children])

    const handleContinue = () => {
        if (!tourDetails) return
        setBooking({
            title: tourDetails.title,
            slug: slug,
            date: selectedDate.toISOString(),
            time: selectedTime,
            type: tourDetails.type || "Private Tour",
            duration: tourDetails.duration || "4-6 hours",
            adults,
            children,
            adultPrice: tourDetails.newPrice || 0,
            childPrice: tourDetails.childPrice || 0,
        })
        router.push("/booking/user-info")
    }

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
                            {
                                label: "Adults",
                                desc: [
                                    `Minimum: ${tourDetails?.minimumPerson} person per group.`,
                                    `Maximum: ${tourDetails?.maximumPerson} person per group.`,
                                ],
                                value: adults,
                                onIncrement: () => updateAdults(adults + 1),
                                onDecrement: () => updateAdults(adults - 1),
                                disableDecrement: adults <= (tourDetails?.minimumPerson || 1),
                                disableIncrement: totalGuests >= (tourDetails?.maximumPerson || Infinity),
                                price: tourDetails?.newPrice || 0,
                            },
                            {
                                label: "Child",
                                desc: [`Age between 3 to 7 years`],
                                value: children,
                                onIncrement: () => updateChildren(children + 1),
                                onDecrement: () => updateChildren(children - 1),
                                disableDecrement: children <= 0,
                                disableIncrement: totalGuests >= (tourDetails?.maximumPerson || Infinity),
                                price: tourDetails?.childPrice || 0,
                            },
                        ].map(
                            ({
                                label,
                                value,
                                price,
                                desc,
                                onIncrement,
                                onDecrement,
                                disableIncrement,
                                disableDecrement,
                            }) => (
                                <div key={label} className="flex items-center justify-between">
                                    <span className="font-semibold">
                                        {label} <span className="text-sm text-desc_gray">(RM {price})</span>
                                        <div className="space-y-1">
                                            {desc.map((d, index) => (
                                                <p key={index} className="text-xs text-desc_gray font-light">
                                                    {d}
                                                </p>
                                            ))}
                                        </div>
                                    </span>
                                    <div className="flex items-center gap-2 border rounded-full">
                                        <button
                                            onClick={onDecrement}
                                            disabled={disableDecrement}
                                            className={`px-2 py-1 rounded-l-xl ${
                                                disableDecrement
                                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                    : "hover:bg-primary_green hover:text-white"
                                            }`}
                                        >
                                            -
                                        </button>
                                        <span>{value}</span>
                                        <button
                                            onClick={onIncrement}
                                            disabled={disableIncrement}
                                            className={`px-2 py-1 rounded-r-xl ${
                                                disableIncrement
                                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                    : "hover:bg-primary_green hover:text-white"
                                            }`}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <span className="font-semibold text-primary_green">RM {value * price}</span>
                                </div>
                            )
                        )}
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
                onClick={handleContinue}

            />
        </div>
    )
}
