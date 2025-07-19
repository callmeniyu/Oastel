"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { blogApi } from "@/lib/blogApi"
import { notFound } from "next/navigation"
import Image from "next/image"
import BlogCard from "@/components/ui/BlogCard"
import Loader from "@/components/ui/Loader"
import { MdOutlineDateRange } from "react-icons/md"
import { TbCategory } from "react-icons/tb"
import { MdOutlineRemoveRedEye } from "react-icons/md"
import { BlogType } from "@/lib/types"

export default function BlogDetailsPage() {
    const params = useParams()
    const slug = params.slug as string

    const [blogDetails, setBlogDetails] = useState<BlogType | null>(null)
    const [otherBlogs, setOtherBlogs] = useState<BlogType[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchBlogData = async () => {
            try {
                setIsLoading(true)
                setError(null)

                // Fetch blog details
                const response = await blogApi.getBlogBySlug(slug)
                if (response.success) {
                    setBlogDetails(response.data)
                    // Increment view count (non-blocking)
                    try {
                        await blogApi.incrementViews(response.data._id)
                    } catch (viewError) {
                        console.warn("Failed to increment view count:", viewError)
                        // Don't fail the page load if view increment fails
                    }
                } else {
                    throw new Error("Blog not found")
                }

                // Fetch other blogs
                const otherBlogsResponse = await blogApi.getBlogs({
                    sortBy: "createdAt",
                    sortOrder: "desc",
                    limit: 10, // Get more to ensure we have 4 after filtering
                })
                if (otherBlogsResponse.success) {
                    // Filter out current blog and limit to exactly 4
                    const filteredBlogs = otherBlogsResponse.data.filter((blog) => blog.slug !== slug)
                    setOtherBlogs(filteredBlogs.slice(0, 4))
                }
            } catch (err) {
                console.error("Error fetching blog data:", err)
                setError("Failed to load blog details. Please try again later.")
            } finally {
                setIsLoading(false)
            }
        }

        if (slug) {
            fetchBlogData()
        }
    }, [slug])

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader />
            </div>
        )
    }

    if (error) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-10">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">{error}</h1>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-primary_green text-white rounded-lg hover:bg-green-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    if (!blogDetails) {
        return notFound()
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-10 font-poppins">
            {/* Title + Meta */}
            <div className="bg-primary_green text-white p-3 md:p-6 rounded-lg text-center space-y-3 mb-6">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-snug">{blogDetails.title}</h1>
                <p className="text-lg text-gray-100">{blogDetails.description}</p>
                <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-white/90">
                    <div className="flex gap-2">
                        <TbCategory className="text-lg" /> <p>{blogDetails.category}</p>
                    </div>
                    <div className="flex gap-2">
                        <MdOutlineDateRange className="text-lg" />
                        <p>
                            {new Date(blogDetails.createdAt).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <MdOutlineRemoveRedEye className="text-lg" /> <p>{blogDetails.views.toLocaleString()} Views</p>
                    </div>
                </div>
            </div>

            {/* Cover Image */}
            <div className="w-full rounded-lg overflow-hidden mb-8">
                <Image
                    src={blogDetails.image}
                    alt={blogDetails.title}
                    width={1000}
                    height={600}
                    className="w-full h-[30rem] rounded-lg object-cover"
                />
            </div>

            {/* Blog Content */}
            <article
                className="prose prose-lg max-w-none text-desc_gray mb-16 prose-headings:text-title_black prose-headings:font-semibold prose-ul:pl-5 prose-ul:marker:text-primary_green"
                dangerouslySetInnerHTML={{ __html: blogDetails.content || "" }}
            />

            {/* Other Blogs Section */}
            {otherBlogs.length > 0 && (
                <section className="mt-16">
                    <div className="flex items-center gap-2 mb-8">
                        <hr className="border-b-2 border-primary_green w-16 sm:w-40" />
                        <h2 className="text-2xl font-bold text-primary_green min-w-max">Also Read</h2>
                        <hr className="border-b-2 border-primary_green w-full" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-2">
                        {otherBlogs.map((blog) => (
                            <BlogCard key={blog._id} {...blog} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}
