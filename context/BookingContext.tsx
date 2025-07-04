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
  const [booking, setBookingState] = useState<BookingDetailsType | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem("booking")
    if (stored) setBookingState(JSON.parse(stored))
  }, [])

  const setBooking = (booking: BookingDetailsType) => {
    setBookingState(booking)
    sessionStorage.setItem("booking", JSON.stringify(booking))
  }

    console.log("BookingProvider initialized with booking:", booking);
    
  const clearBooking = () => {
    setBookingState(null)
    sessionStorage.removeItem("booking")
  }

  return (
    <BookingContext.Provider value={{ booking, setBooking, clearBooking }}>
      {children}
    </BookingContext.Provider>
  )
}

export const useBooking = () => {
  const context = useContext(BookingContext)
  if (!context) throw new Error("useBooking must be used within BookingProvider")
  return context
}
