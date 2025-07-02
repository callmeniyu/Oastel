import { FaCalendarAlt } from "react-icons/fa"

type TourBookPanelProps = {
    date: string
    time: string
    persons: number
    duration: string | number
    oldPrice: number
    newPrice: number
}
import GreenBtn from "./GreenBtn"

export default function TourBookPanel({ date, time, persons, duration, oldPrice, newPrice }: TourBookPanelProps) {
    return (
        <div className="w-full max-w-xs mx-auto rounded-md border border-primary_green p-4 shadow-sm ">
            <div className="bg-primary_green text-white rounded-md py-2 px-4 flex items-center justify-center gap-2 mb-4">
                <FaCalendarAlt />
                <span className="font-medium">{date}</span>
            </div>

            <div className="space-y-2 text-sm text-title_black">
                <div className="flex justify-between">
                    <span className="font-medium">Time</span>
                    <span className="font-semibold">{time}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium">No: of person</span>
                    <span className="font-semibold">{persons}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium">Duration</span>
                    <span className="font-semibold">{duration} hrs</span>
                </div>
            </div>

            <div className="my-4 border-t border-gray-300 pt-4">
                <div className="flex justify-between items-center text-title_black">
                    <span className="font-bold">Amount</span>
                    <div>
                        <span className="line-through text-sm text-gray-400 mr-2">RM {oldPrice}</span>
                        <span className="text-lg font-bold text-black">RM {newPrice}</span>
                    </div>
                </div>
            </div>

            <GreenBtn text="Change Details & Book Tour" customStyles="w-full font-semibold" action="" />
        </div>
    )
}
