"use client"
import Image from "next/image"
import GreenBtn from "./GreenBtn"
import { BlogType } from "@/lib/types"



export default function BlogCard({ _id, image, title, slug, description, category }: BlogType) {
    return (
        <div className="rounded-xl overflow-hidden shadow-lg bg-white flex flex-col">
            <Image src={image} alt={title} width={400} height={300} className="h-48 w-full object-cover" />
            <div className="p-4 flex flex-col justify-between flex-grow">
                <div>
                    <h3 className="text-title_black font-semibold font-poppins text-base mb-2">{title}</h3>
                    <p className="text-desc_gray text-sm font-poppins">{description}</p>
                </div>
                <div className="mt-4 flex justify-between items-center">
                    <GreenBtn text="Read More" customStyles="" action={`/blogs/${slug}`} />
                    <span className="text-primary_green font-semibold text-sm font-poppins text-right">{category}</span>
                </div>
            </div>
        </div>
    )
}
