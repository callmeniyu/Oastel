// context/BookingContext.tsx
"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { BookingDetailsType } from "@/lib/types"

interface BookingContextProps {
    booking: BookingDetailsType | null
    setBooking: (booking: BookingDetailsType) => void
    clearBooking: () => void
}

const BookingContext = createContext<BookingContextProps | undefined>(undefined)

export const BookingProvider = ({ children }: { children: React.ReactNode }) => {
    const [booking, setBookingState] = useState<BookingDetailsType | null>(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("booking")
            return stored ? JSON.parse(stored) : null
        }
    })

    useEffect(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("booking")
            if (stored) setBookingState(JSON.parse(stored))
        }
    }, [])

    const setBooking = (booking: BookingDetailsType) => {
        if (typeof window !== "undefined") {
            setBookingState(booking)
            localStorage.setItem("booking", JSON.stringify(booking))
        }
    }


    const clearBooking = () => {
        setBookingState(null)
        localStorage.removeItem("booking")
    }

    return <BookingContext.Provider value={{ booking, setBooking, clearBooking }}>{children}</BookingContext.Provider>
}

export const useBooking = () => {
    const context = useContext(BookingContext)
    if (!context) throw new Error("useBooking must be used within BookingProvider")
    return context
}
