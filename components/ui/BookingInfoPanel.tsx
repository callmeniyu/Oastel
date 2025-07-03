// components/ui/BookingDetails.tsx
import { format } from "date-fns"
import GreenBtn from "./GreenBtn"

type Props = {
    title: string
    date: Date
    time: string
    type: string
    duration: string
    adults: number
    children: number
    adultPrice: number
    childPrice: number
}

export default function BookingInfoPanel({
    title,
    date,
    time,
    type,
    duration,
    adults,
    children,
    adultPrice,
    childPrice,
}: Props) {
    const total = adults * adultPrice + children * childPrice

    return (
        <div className="border rounded-md shadow min-w-[250px] font-poppins max-h-max pb-4">
            <div className="bg-primary_green text-white py-2 px-4 rounded-t-md text-center font-semibold font-poppins mb-4">
                Booking Details
            </div>
            <div className="px-4 flex flex-col gap-2">
                <div className="text-sm mb-2 flex justify-between">
                    <h6 className="font-semibold">Tour</h6>
                    <p className="text-desc_gray">{title}</p>
                </div>
                <div className="text-sm mb-2 flex justify-between">
                    <h6 className="font-semibold ">Date</h6>
                    <p className="text-desc_gray">{format(date, "dd MMMM yyyy")}</p>
                </div>
                <div className="text-sm mb-2 flex justify-between">
                    <h6 className="font-semibold">Time</h6>
                    <p className="text-desc_gray">{time}</p>
                </div>
                <div className="text-sm mb-2 flex justify-between">
                    <h6 className="font-semibold">Type</h6>
                    <p className="text-desc_gray">{type}</p>
                </div>
                <div className="text-sm mb-2 flex justify-between">
                    <h6 className="font-semibold">Duration</h6>
                    <p className="text-desc_gray">{duration}</p>
                </div>
                <div className="text-sm mb-4 flex justify-between">
                    <h6 className="font-semibold">Persons</h6>
                    <div className="text-desc_gray space-y-1 flex flex-col items-end">
                        <p>{adults}x Adults</p>
                        <p>{children}x Children</p>
                    </div>
                </div>
            </div>
            <div className="border-y p-5 flex justify-between">
                <h4 className="text-xl font-bold">Amount</h4>
                <h4 className="text-xl font-bold"> RM {total}</h4>
            </div>
            <div className="flex flex-col gap-2 mt-4 px-6">
                <GreenBtn customStyles="font-semibold text-lg py-3" text="Add to cart" />
                <GreenBtn customStyles="font-semibold text-lg py-3" text="Buy Now" />
            </div>
        </div>
    )
}
