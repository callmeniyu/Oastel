"use client"
import { useState, useEffect } from "react"
import BookingCalendar from "@/components/ui/BookingCalendar"
import BookingInfoPanel from "@/components/ui/BookingInfoPanel"
import { getTicketBySlug } from "@/lib/utils"
import { TicketType } from "@/lib/types"
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

    const [ticketDetails, setticketDetails] = useState<TicketType>()
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [selectedTime, setSelectedTime] = useState("8:00 am")
    const [availableTimes, setAvailableTimes] = useState<string[]>([])

    const [adults, setAdults] = useState(0)
    const [children, setChildren] = useState(0)
    const [totalGuests, setTotalGuests] = useState(0)

    useEffect(() => {
        const getticketDetails = async () => {
            const ticket = await getTicketBySlug(slug)
            if (ticket) {
                setticketDetails(ticket)
                setAdults(1)
                setTotalGuests(1)
            }
        }
        getticketDetails()
    }, [slug])

    useEffect(() => {
        const key = selectedDate.toISOString().split("T")[0]
        setAvailableTimes(defaultTimings[key] || ["8:00 am"])
        setSelectedTime(defaultTimings[key]?.[0] || "8:00 am")
    }, [selectedDate])

    const updateAdults = (newCount: number) => {
        if (!ticketDetails) return

        const newTotal = newCount + children
        if (newCount >= (ticketDetails.minimumPerson || 1) && newTotal <= (ticketDetails.maximumPerson || Infinity)) {
            setAdults(newCount)
            setTotalGuests(newTotal)
        }
    }

    const updateChildren = (newCount: number) => {
        const newTotal = adults + newCount
        if (newTotal <= (ticketDetails?.maximumPerson || Infinity)) {
            setChildren(newCount)
            setTotalGuests(newTotal)
        }
    }

    useEffect(() => {
        if (totalGuests >= (ticketDetails?.maximumPerson || Infinity)) {
            showToast({
                type: "error",
                title: "You have reached the maximum number of guests.",
                message: "Please try contacting us for if more tickets.",
            })
        }
    }, [adults, children])

    const handleContinue = () => {
        if (!ticketDetails) return
        const totalPrice = calculateTotalPrice()
        setBooking({
            title: ticketDetails.title,
            slug: slug,
            date: selectedDate.toISOString(),
            time: selectedTime,
            type: ticketDetails.type || "Private ticket",
            duration: ticketDetails.duration || "4-6 hours",
            adults,
            children,
            adultPrice: ticketDetails.newPrice || 0,
            childPrice: ticketDetails.childPrice || 0,
            totalPrice: totalPrice,
            pickupLocations: ticketDetails.details.pickupLocations || [""],
            packageType: "ticket",
        })
        router.push("/booking/user-info")
    }

    // Calculate total price based on ticket type
    const calculateTotalPrice = () => {
        if (!ticketDetails) return 0
        return adults * (ticketDetails.newPrice || 0) + children * (ticketDetails.childPrice || 0)
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-6 font-poppins">
            <div className="space-y-6 md:col-span-2">
                <div className="flex flex-col md:flex-row gap-6">
                    <BookingCalendar selectedDate={selectedDate} onDateChange={setSelectedDate} />

                    <div className="w-full flex flex-col rounded-lg shadow-md p-4 bg-white">
                        <h3 className="text-primary_green text-xl font-bold mb-2">Select your time</h3>
                        <div className="flex flex-col gap-2 ">
                            {ticketDetails &&
                                ticketDetails.time.map((t) => (
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
                            <p className="text-desc_gray text-sm my-1">No other timings are available for now</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg shadow-md p-4 bg-white">
                    <h3 className="text-primary_green text-xl font-bold mb-2">No. of Guests</h3>

                    <div className="space-y-6 border p-3 rounded-lg my-4">
                        {[
                            {
                                label: "Adults",
                                desc: `Minimum: ${ticketDetails?.minimumPerson} person per group.`,
                                value: adults,
                                onIncrement: () => updateAdults(adults + 1),
                                onDecrement: () => updateAdults(adults - 1),
                                disableDecrement: adults <= (ticketDetails?.minimumPerson || 1),
                                disableIncrement: totalGuests >= (ticketDetails?.maximumPerson || Infinity),
                                price: ticketDetails?.newPrice || 0,
                            },
                            ...(ticketDetails?.type !== "Private"
                                ? [
                                      {
                                          label: "Children",
                                          desc: "Ages 3-11. Children under 3 travel free.",
                                          value: children,
                                          onIncrement: () => updateChildren(children + 1),
                                          onDecrement: () => updateChildren(children - 1),
                                          disableDecrement: children <= 0,
                                          disableIncrement: totalGuests >= (ticketDetails?.maximumPerson || Infinity),
                                          price: ticketDetails?.childPrice || 0,
                                      },
                                  ]
                                : []),
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
                                <div
                                    key={label}
                                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                                >
                                    <div className="flex-1">
                                        <p className="font-semibold">
                                            {label}{" "}
                                            <span className="text-sm text-desc_gray">
                                                (RM {price} {ticketDetails?.type === "Private" ? "/group" : "/person"})
                                            </span>
                                        </p>
                                        <div className="space-y-1 mt-1">
                                            <p className="text-xs text-desc_gray font-light">{desc}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between md:justify-normal gap-6 w-full md:w-auto">
                                        <div className="flex items-center gap-2 border rounded-full">
                                            <button
                                                onClick={onDecrement}
                                                disabled={disableDecrement}
                                                className={`px-3 py-1.5 rounded-l-xl text-lg ${
                                                    disableDecrement
                                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                        : "hover:bg-primary_green hover:text-white"
                                                }`}
                                            >
                                                -
                                            </button>
                                            <span className="min-w-[24px] text-center">{value}</span>
                                            <button
                                                onClick={onIncrement}
                                                disabled={disableIncrement}
                                                className={`px-3 py-1.5 rounded-r-xl text-lg ${
                                                    disableIncrement
                                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                        : "hover:bg-primary_green hover:text-white"
                                                }`}
                                            >
                                                +
                                            </button>
                                        </div>

                                        <span className="font-semibold text-primary_green min-w-[80px] text-right">
                                            RM {value * price}
                                        </span>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>

            <BookingInfoPanel
                title={ticketDetails?.title || "ticket Title"}
                date={selectedDate}
                time={selectedTime}
                type={ticketDetails?.type || "Private ticket"}
                duration={ticketDetails?.duration || "4-6 hours"}
                adults={adults}
                children={children}
                adultPrice={ticketDetails?.newPrice || 0}
                childPrice={ticketDetails?.childPrice || 0}
                totalPrice={calculateTotalPrice()}
                onClick={handleContinue}
                packageType="ticket"
            />
        </div>
    )
}
