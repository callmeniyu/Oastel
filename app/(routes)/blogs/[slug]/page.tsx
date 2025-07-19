import { getBlogBySlug, getOtherBlogs } from "@/lib/utils"
import { notFound } from "next/navigation"
import Image from "next/image"
import BlogCard from "@/components/ui/BlogCard"
import { MdOutlineDateRange } from "react-icons/md"
import { TbCategory } from "react-icons/tb"
import { MdOutlineRemoveRedEye } from "react-icons/md"

type Props = {
    params: {
        slug: string
    }
}

export default async function BlogDetailsPage({ params }: Props) {
    const { slug } = params
    const blogDetails = await getBlogBySlug(slug)
    const otherBlogs = await getOtherBlogs(slug)

    if (!blogDetails) return notFound()

    return (
        <div className="max-w-6xl mx-auto px-4 py-10 font-poppins">
            {/* Title + Meta */}
            <div className="bg-primary_green text-white p-3 md:p-6 rounded-lg text-center space-y-3 mb-6">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-snug">{blogDetails.title}</h1>
                <p className="text-lg text-gray-100">{blogDetails.desc}</p>
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
            <section className="mt-16">
                <div className="flex items-center gap-2">
                    <hr className="border-b-2 border-primary_green w-16 sm:w-40 md:flex" />
                    <h2 className="text-2xl font-extrabold sm:font-bold text-primary_green mb-4 pt-2  min-w-max">
                        Also Read
                    </h2>
                    <hr className="border-b-2 border-primary_green w-full md:flex" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {otherBlogs.map((blog) => (
                        <BlogCard key={blog._id} {...blog} />
                    ))}
                </div>
            </section>
        </div>
    )
}
