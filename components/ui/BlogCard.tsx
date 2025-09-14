"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import GreenBtn from "./GreenBtn";
import { BlogType } from "@/lib/types";

export default function BlogCard({
  _id,
  image,
  title,
  slug,
  description,
  category,
  publishDate,
  createdAt,
}: BlogType) {
  // Use slug if available, otherwise fallback to _id or generated slug
  const blogSlug =
    slug ||
    _id ||
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  // Determine display date (prefer publishDate from admin, fall back to createdAt)
  const rawDate = publishDate || createdAt;
  let displayDate = "";
  try {
    displayDate = new Date(rawDate as string).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch (e) {
    displayDate = "";
  }

  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/blogs/${blogSlug}`);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleCardClick();
      }}
      className="rounded-xl overflow-hidden shadow-lg bg-white flex flex-col hover:shadow-xl transition-shadow cursor-pointer"
    >
      <Image
        src={image}
        alt={title}
        width={400}
        height={300}
        className="h-48 w-full object-cover"
      />
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="text-title_black font-semibold font-poppins text-base mb-2">
            {title}
          </h3>
          <p className="text-desc_gray text-sm font-poppins">{description}</p>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className="flex flex-col">
            <GreenBtn
              text="Read More"
              customStyles=""
              action={`/blogs/${blogSlug}`}
            />
          </div>
          <div className="text-right">
            {displayDate && (
              <div className="text-xs text-desc_gray mb-1">{displayDate}</div>
            )}
            <span className="text-primary_green font-semibold text-sm font-poppins">
              {category}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
