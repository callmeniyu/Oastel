// components/ui/BookingDetails.tsx
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { IoCartOutline } from "react-icons/io5"
import { IoBagOutline } from "react-icons/io5"
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
    action?: string[]
    onClick?: () => void
    userInfo?: boolean
    totalPrice: number
    packageType:"tour" | "transfer"
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
    action,
    onClick,
    userInfo,
    packageType
}: Props) {
    const router = useRouter()
    const total = adults * adultPrice + children * childPrice

    return (
        <div className="border rounded-md shadow min-w-[250px] font-poppins max-h-max pb-4">
            <div className="bg-primary_green text-white py-2 px-4 rounded-t-md text-center font-semibold font-poppins mb-4">
                Booking Details
            </div>
            <div className="px-4 flex flex-col gap-2">
                <div className="text-sm mb-2 flex gap-8 justify-between">
                    <h6 className="font-semibold">{ packageType === "tour" ? "Tour" : "Transfer"}</h6>
                    <p className="text-desc_gray text-right">{title}</p>
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
                    <p className="text-desc_gray">{duration} hrs</p>
                </div>
                <div className="text-sm mb-4 flex justify-between">
                    <h6 className="font-semibold">Persons</h6>
                    <div className="text-desc_gray space-y-1 flex flex-col items-end">
                        {type === "private" ? (
                            <div>
                                <p>{adults}x Persons</p>
                            </div>
                        ) : (
                            <div>
                                <p>{adults}x Adults</p>
                                <p>{children}x Children</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className={`border-y p-5 flex justify-between ${userInfo ? "hidden" : "flex"}`}>
                <h4 className="text-xl font-bold">Amount</h4>
                <h4 className="text-xl font-bold"> RM {total}</h4>
            </div>
            <div className={`border-y p-5 flex flex-col gap-2 justify-between ${userInfo ? "flex" : "hidden"}`}>
                <div className="flex justify-between">
                    <h4 className="text-lg font-semibold">Subtotal</h4>
                    <h4 className="text-lg font-semibold"> RM {total}</h4>
                </div>
                <div className="flex justify-between">
                    <h4 className="text-lg font-semibold">
                        Bank Charge <span className="text-desc_gray text-sm font-medium">(2.8%)</span>
                    </h4>
                    <h4 className="text-lg font-semibold"> RM {(total * 0.028).toFixed(2)}</h4>
                </div>
                <div className="flex justify-between">
                    <h4 className="text-lg font-semibold">SST</h4>
                    <h4 className="text-lg font-semibold"> RM {(0.0).toFixed(2)}</h4>
                </div>
            </div>

            <div className={`border-t p-5 flex text-primary_green gap-2 justify-between ${userInfo ? "flex" : "hidden"}`}>
                <h4 className="text-2xl font-semibold">Total</h4>
                <h4 className="text-2xl font-semibold"> RM {(total + total * 0.028).toFixed(2)}</h4>
            </div>
            <div className={`flex flex-col gap-2 mt-4 px-6 ${userInfo ? "hidden" : ""}`}>
                <div
                    onClick={() => router.push("/cart")}
                    className={` cursor-pointer border border-primary_green text-primary_green text-sm px-4 py-2 flex gap-2 justify-center items-center rounded-md font-poppins font-semibold`}
                >
                    <IoCartOutline className="inline mr-2 text-2xl" />
                    <p>Add to Cart</p>
                </div>
                <div
                    onClick={onClick}
                    className={`bg-primary_green cursor-pointer text-white text-sm px-4 py-2 flex gap-2 justify-center items-center rounded-md font-poppins font-semibold`}
                >
                    <IoBagOutline className="inline mr-2 text-2xl" />
                    <p>Buy Now</p>
                </div>
            </div>
        </div>
    )
}
