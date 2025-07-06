import Image from "next/image"
import { MdAccessTimeFilled } from "react-icons/md"
import { FaBookmark } from "react-icons/fa"
import Tag from "./Tag"
import GreenBtn from "./GreenBtn"

type TourCardProps = {
    id: number
    slug: string
    image: string
    title: string
    tags: string[]
    desc: string
    duration: string
    bookedCount: string | number
    oldPrice: number
    newPrice: number
    type: string
}

export default function TourCard({
    id,
    slug,
    image,
    title,
    desc,
    duration,
    tags,
    bookedCount,
    oldPrice,
    newPrice,
    type
}: TourCardProps) {
    return (
        <div className="rounded-xl shadow-lg bg-white flex flex-col flex-grow justify-between">
            <Image src={image} alt={title} width={400} height={400} className="h-48 w-full object-cover rounded-t-lg" />
            <div className="p-4 flex flex-col justify-between gap-2 self-start">
                <h3 className="text-primary_green font-semibold font-poppins text-base">{title}</h3>
                <div className="flex gap-2">
                    {tags.map((tag, i) => (
                        <Tag key={i} tag={tag} />
                    ))}
                </div>
                <p className="text-desc_gray text-sm font-poppins">{desc}</p>
                <div className="flex justify-between gap-2">
                    <div className="flex gap-2 items-center font-semibold">
                        <MdAccessTimeFilled width={30} className="text-primary_green text-lg" />
                        <p className="text-sm">{duration} hrs</p>
                    </div>
                    <div className="flex gap-2 items-center font-semibold">
                        <FaBookmark width={30} className="text-primary_green text-md" />
                        <p className="text-sm">{bookedCount}+ Booked</p>
                    </div>
                </div>
                <div className="flex justify-between items-center mt-2">
                    <div className="flex flex-col items-start">
                        <p className="text-gray-400 line-through font-poppins text-base ">{oldPrice}</p>
                        <h4 className="font-poppins text-xl font-bold">{newPrice} RM <span className="text-sm font-light">{ type === "private" ? "/group" : "/person"}</span></h4>
                    </div>

                    <GreenBtn text="Book" customStyles="font-semibold w-24" action={`/tours/${slug}`} />
                </div>
            </div>
        </div>
    )
}
