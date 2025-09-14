"use client";

import { useState, useMemo, useEffect } from "react";
import { BlogType } from "@/lib/types";
import { blogApi } from "@/lib/blogApi";
import SearchInput from "@/components/ui/SearchInput";
import BlogCard from "@/components/ui/BlogCard";
import Image from "next/image";
import { IoRefresh } from "react-icons/io5";

export default function BlogArea() {
  const [searchTerm, setSearchTerm] = useState("");
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch blogs on component mount
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await blogApi.getBlogs({
          sortBy: "publishDate",
          sortOrder: "desc",
          limit: 100,
        });

        if (response.success) {
          setBlogs(response.data);
        } else {
          setError("Failed to fetch blogs");
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blogs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await blogApi.getBlogs({
        sortBy: "publishDate",
        sortOrder: "desc",
        limit: 100,
      });

      if (response.success) {
        setBlogs(response.data);
        // Reset search when refreshing
        setSearchTerm("");
      } else {
        setError("Failed to fetch blogs");
      }
    } catch (err) {
      console.error("Error refreshing blogs:", err);
      setError("Failed to refresh blogs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(term) ||
        blog.category.toLowerCase().includes(term)
    );
  }, [searchTerm, blogs]);

  const groupedBlogs = useMemo(() => {
    const groups: { [key: string]: BlogType[] } = {};
    filteredBlogs.forEach((blog) => {
      if (!groups[blog.category]) {
        groups[blog.category] = [];
      }
      groups[blog.category].push(blog);
    });
    return groups;
  }, [filteredBlogs]);

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
          <h2 className="text-3xl md:text-4xl font-bold text-primary_green mb-2">
            Explore Stories
          </h2>
          <h3 className="text-xl md:text-2xl font-semibold text-title_black mb-4">
            Travel Tips, and Local Insights
          </h3>
          <p className="text-desc_gray text-base leading-relaxed">
            Dive into stories, guides, and travel inspiration from across
            Malaysia. Our blog is where you’ll find hidden gems, expert tips,
            and local insights to help you plan smarter and travel deeper.
            Whether you're exploring the highlands, hopping between islands, or
            discovering cultural trails, we bring you real stories and practical
            advice from the road.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="ml-auto mb-12 flex gap-4 items-center">
        <hr className="border-b-2 border-primary_green w-full hidden md:flex" />
        <SearchInput
          customeStyles="md:w-2/4"
          value={searchTerm}
          onChange={setSearchTerm}
          onSearch={() => {}}
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary_green mx-auto mb-4"></div>
          <p className="text-desc_gray">Loading blogs...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-20">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-lg font-semibold">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary_green text-white rounded-lg hover:bg-primary_green/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Blog Groups by Category - only show when not loading and no error */}
      {!loading && !error && (
        <>
          {Object.keys(groupedBlogs).length === 0 ? (
            <div className="text-center py-20">
              <p className="text-desc_gray text-lg">No blogs found.</p>
              {searchTerm && (
                <p className="text-desc_gray text-sm mt-2">
                  Try adjusting your search terms.
                </p>
              )}
            </div>
          ) : (
            Object.entries(groupedBlogs).map(([category, blogs]) => (
              <div key={category} className="mb-12">
                <div className="flex items-center gap-2 mb-3">
                  <hr className="border-b-2 border-primary_green w-16 sm:w-40 md:flex" />
                  <h2 className="text-3xl font-extrabold sm:font-semibold text-primary_green mb-4 pt-2 min-w-max">
                    {category}
                  </h2>
                  <hr className="border-b-2 border-primary_green w-full md:flex" />
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {blogs.map((blog) => (
                    <BlogCard key={blog._id} {...blog} />
                  ))}
                </div>
              </div>
            ))
          )}
        </>
      )}
    </section>
  );
}
