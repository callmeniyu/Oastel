import { blogApi } from "@/lib/blogApi";
import { notFound } from "next/navigation";
import BlogImage from "@/components/ui/BlogImage";
import BlogCard from "@/components/ui/BlogCard";
import { MdOutlineDateRange } from "react-icons/md";
import { TbCategory } from "react-icons/tb";
import { MdOutlineRemoveRedEye } from "react-icons/md";

type Props = {
  params: {
    slug: string;
  };
};

export default async function BlogDetailsPage({ params }: Props) {
  const { slug } = params;
  console.log("BlogDetailsPage - received slug:", slug);

  // First, try to get the blog details
  let blogDetails = null;
  try {
    const response = await blogApi.getBlogBySlug(slug);
    console.log("Blog API response success:", response?.success);

    if (response.success) {
      blogDetails = response.data;
      console.log("Blog details loaded:", blogDetails?.title);

      // Try to increment view count (silently fails if endpoint doesn't exist)
      try {
        await blogApi.incrementViews(response.data._id);
      } catch (viewError) {
        console.warn("Failed to increment views:", viewError);
      }
    } else {
      console.log("API response failed:", response);
    }
  } catch (error) {
    console.error("Error fetching blog by slug:", error);
    // Return a simple error page instead of crashing
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1>Error loading blog</h1>
        <p>Could not load blog with slug: {slug}</p>
        <p>Error: {error instanceof Error ? error.message : "Unknown error"}</p>
      </div>
    );
  }

  // If no blog found, show not found
  if (!blogDetails) {
    console.log("Blog not found, showing 404");
    return notFound();
  }

  // Get other blogs (but don't fail the page if this fails)
  let otherBlogs: any[] = [];
  try {
    // Fetch more blogs to ensure we have at least 4 after filtering out current blog
    const response = await blogApi.getBlogs({
      sortBy: "publishDate",
      sortOrder: "desc",
      limit: 8, // Increased limit to ensure we have enough after filtering
    });
    if (response.success) {
      // Filter out current blog and limit to 4
      otherBlogs = response.data
        .filter((blog) => blog.slug !== slug)
        .slice(0, 4);
    }
  } catch (error) {
    console.warn("Error fetching other blogs (non-critical):", error);
    // Continue with empty array - this won't break the page
  }

  // Create safe date string (prefer publishDate set in admin)
  let formattedDate = "Unknown date";
  try {
    const rawDate = blogDetails.publishDate || blogDetails.createdAt;
    formattedDate = new Date(rawDate).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch (dateError) {
    console.warn("Date formatting error:", dateError);
  }

  console.log("Rendering blog details page");

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 font-poppins">
      {/* Title + Meta */}
      <div className="bg-primary_green text-white p-3 md:p-6 rounded-lg text-center space-y-3 mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-snug">
          {blogDetails.title || "Untitled Blog"}
        </h1>
        <p className="text-lg text-gray-100">
          {blogDetails.description || "No description available"}
        </p>
        <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-white/90">
          <div className="flex gap-2">
            <TbCategory className="text-lg" />
            <p>{blogDetails.category || "Uncategorized"}</p>
          </div>
          <div className="flex gap-2">
            <MdOutlineDateRange className="text-lg" />
            <p>{formattedDate}</p>
          </div>
          <div className="flex gap-2">
            <MdOutlineRemoveRedEye className="text-lg" />
            <p>{(blogDetails.views || 0).toLocaleString()} Views</p>
          </div>
        </div>
      </div>

      {/* Cover Image - with error handling */}
      {blogDetails.image && (
        <BlogImage
          src={blogDetails.image}
          alt={blogDetails.title || "Blog image"}
          title={blogDetails.title}
        />
      )}

      {/* Blog Content */}
      <article
        className="prose prose-lg max-w-none text-desc_gray mb-16 prose-headings:text-title_black prose-headings:font-semibold prose-ul:pl-5 prose-ul:marker:text-primary_green"
        dangerouslySetInnerHTML={{
          __html: blogDetails.content || "<p>No content available</p>",
        }}
      />

      {/* Other Blogs Section - show if we have other blogs */}
      {otherBlogs.length > 0 && (
        <section className="mt-16">
          <div className="flex items-center gap-2">
            <hr className="border-b-2 border-primary_green w-16 sm:w-40 md:flex" />
            <h2 className="text-2xl font-extrabold sm:font-bold text-primary_green mb-4 pt-2 min-w-max">
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
      )}
    </div>
  );
}
