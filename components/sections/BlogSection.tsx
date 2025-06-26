import BlogCard from "../ui/BlogCard"

const blogData = [
    {
        image: "/images/blog1.jpg",
        title: "The Magic of Shared Journeys: Why Co-Touring with Strangers Becomes",
        description: "Learn how solo travelers and small groups find connection, laughter, and new friends on the road.",
        category: "Co-Tour",
    },
    {
        image: "/images/blog2.jpg",
        title: "The Easiest Way to Book Reliable Van Transfers",
        description: "Discover how our streamlined booking system and local knowledge make your travel smooth.",
        category: "Transportation",
    },
    {
        image: "/images/blog3.jpg",
        title: "Staying with Oastel: Why Co-Living Is the Heart of Cameron Highlands",
        description: "Looking for more than just a bed? Oastel’s co-living stays offer community, comfort, and character.",
        category: "Stay",
    },
]

export default function BlogSection() {
    return (
        <section className="py-16 px-6 bg-white">
            <div className="max-w-6xl mx-auto">
                <div className="md:px-28">
                    <h2 className="section-title text-center">
                        Explore Stories, Travel Tips, and Local Experiences from the Heart of Malaysia
                    </h2>
                    <p className="section-desc text-center mb-12">
                        Read travel stories, destination guides, and curated insights for your next adventure.
                    </p>
                </div>

                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {blogData.map((blog, i) => (
                        <BlogCard key={i} {...blog} />
                    ))}
                </div>
            </div>
        </section>
    )
}
