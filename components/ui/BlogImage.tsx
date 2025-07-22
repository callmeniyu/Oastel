"use client"

import Image from "next/image"
import { useState } from "react"

type BlogImageProps = {
    src: string
    alt: string
    title?: string
}

const BlogImage = ({ src, alt, title }: BlogImageProps) => {
    const [hasError, setHasError] = useState(false)

    if (hasError) {
        return null
    }

    return (
        <div className="w-full rounded-lg overflow-hidden mb-8">
            <Image
                src={src}
                alt={alt}
                width={1000}
                height={600}
                className="w-full h-[30rem] rounded-lg object-cover"
                onError={(e) => {
                    console.error("Image failed to load:", src)
                    setHasError(true)
                }}
            />
        </div>
    )
}

export default BlogImage
