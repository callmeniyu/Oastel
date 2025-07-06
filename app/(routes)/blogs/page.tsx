"use client"

import { useState, useMemo } from "react"
import { BlogType } from "@/lib/types"
import { allBlogs } from "@/lib/data"
import SearchInput from "@/components/ui/SearchInput"
import BlogCard from "@/components/ui/BlogCard"
import Image from "next/image"

export default function BlogArea() {
    const [searchTerm, setSearchTerm] = useState("")

    const filteredBlogs = useMemo(() => {
        const term = searchTerm.toLowerCase()
        return allBlogs.filter(
            (blog) => blog.title.toLowerCase().includes(term) || blog.category.toLowerCase().includes(term)
        )
    }, [searchTerm])

    const groupedBlogs = useMemo(() => {
        const groups: { [key: string]: BlogType[] } = {}
        filteredBlogs.forEach((blog) => {
            if (!groups[blog.category]) {
                groups[blog.category] = []
            }
            groups[blog.category].push(blog)
        })
        return groups
    }, [filteredBlogs])

    return (
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 font-poppins">
            {/* Top Hero Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 items-center">
                <Image
                    src="/images/blog-main.jpg"
                    alt="Explore Stories"
                    width={600}
                    height={400}
                    className="rounded-lg w-full h-full object-cover"
                />
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-primary_green mb-2">Explore Stories</h2>
                    <h3 className="text-xl md:text-2xl font-semibold text-title_black mb-4">
                        Travel Tips, and Local Insights
                    </h3>
                    <p className="text-desc_gray text-base leading-relaxed">
                        Dive into stories, guides, and travel inspiration from across Malaysia. Our blog is where you’ll
                        find hidden gems, expert tips, and local insights to help you plan smarter and travel deeper.
                        Whether you're exploring the highlands, hopping between islands, or discovering cultural trails, we
                        bring you real stories and practical advice from the road.
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="ml-auto mb-12 flex gap-4 items-center">
                <hr className="border-b-2 border-primary_green  w-full hidden md:flex" />
                <SearchInput customeStyles="md:w-2/4" value={searchTerm} onChange={setSearchTerm} onSearch={() => {}} />
            </div>

            {/* Blog Groups by Category */}
            {Object.entries(groupedBlogs).map(([category, blogs]) => (
                <div key={category} className="mb-12">
                    <div className="flex items-center gap-2 mb-3">
                        <hr className="border-b-2 border-primary_green w-16 sm:w-40 md:flex" />
                        <h2 className="text-3xl font-extrabold sm:font-semibold text-primary_green mb-4 pt-2  min-w-max">
                            {category}
                        </h2>
                        <hr className="border-b-2 border-primary_green  w-full  md:flex" />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {blogs.map((blog, i) => (
                            <BlogCard key={i} {...blog} />
                        ))}
                    </div>
                </div>
            ))}
        </section>
    )
}
