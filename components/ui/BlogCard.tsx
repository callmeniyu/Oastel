"use client"
import Image from "next/image"
import GreenBtn from "./GreenBtn"

type BlogCardProps = {
    image: string
    title: string
    description: string
    category: string
    onClick?: () => void
}

export default function BlogCard({ image, title, description, category, onClick }: BlogCardProps) {
    return (
        <div className="rounded-xl overflow-hidden shadow-lg bg-white flex flex-col">
            <Image src={image} alt={title} width={400} height={300} className="h-48 w-full object-cover" />
            <div className="p-4 flex flex-col justify-between flex-grow">
                <div>
                    <h3 className="text-title_black font-semibold font-poppins text-base mb-2">{title}</h3>
                    <p className="text-desc_gray text-sm font-poppins">{description}</p>
                </div>
                <div className="mt-4 flex justify-between items-center">
                    <GreenBtn text="Explore more" customStyles="" onClick={ ()=>{}} />
                    <span className="text-primary_green font-semibold text-sm font-poppins">{category}</span>
                </div>
            </div>
        </div>
    )
}
