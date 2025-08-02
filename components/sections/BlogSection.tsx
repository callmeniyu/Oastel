"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import BlogCard from "../ui/BlogCard";
import { blogApi } from "@/lib/blogApi";
import { BlogType } from "@/lib/types";
import { FaArrowRightLong } from "react-icons/fa6";

export default function BlogSection() {
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await blogApi.getBlogs({
          limit: 3,
          sortBy: "createdAt",
          sortOrder: "desc",
        });
        setBlogs(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blogs");
        // Fallback to empty array if API fails
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="md:px-28">
            <h2 className="section-title text-center">
              Real Stories, Tasty Bites, Local Brews & Everyday Travel Tips
            </h2>
            <p className="section-desc text-center mb-12">
              More Than a Guide - it's a Highland Lifestyle
            </p>
          </div>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary_green"></div>
            <span className="ml-3 text-gray-600">Loading blogs...</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="md:px-28">
          <h2 className="section-title text-center">
            Real Stories, Tasty Bites, Local Brews & Everyday Travel Tips
          </h2>
          <p className="section-desc text-center mb-12">
            More Than a Guide - it's a Highland Lifestyle
          </p>
        </div>

        {error && (
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
          </div>
        )}

        {!error && blogs.length === 0 && !loading && (
          <div className="text-center py-8">
            <p className="text-gray-600">No blogs available at the moment.</p>
          </div>
        )}

        {!error && blogs.length > 0 && (
          <>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog, i) => (
                <BlogCard key={blog._id || i} {...blog} />
              ))}
            </div>
            <Link
              href="/blogs"
              className="text-xl font-poppins font-semibold flex justify-center items-center gap-2 mx-auto my-6 text-primary_green"
            >
              Show me more tips <FaArrowRightLong className="" />
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
