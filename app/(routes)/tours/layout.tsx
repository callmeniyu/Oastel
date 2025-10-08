import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seoUtils";

export const metadata: Metadata = generatePageMetadata(
  "Cameron Highlands Tours | Mossy Forest & Sunrise Adventures",
  "Discover Cameron Highlands with our complete collection of tours including Mossy Forest adventures, sunrise viewpoint tours, Land Rover rides, and eco tours. Private and shared tour options available across Cameron Highlands.",
  "/tours",
  [
    "Cameron Highlands tours",
    "Mossy Forest tours",
    "Mossy Forest Cameron Highlands",
    "sunrise tour Cameron Highlands",
    "Land Rover ride Mossy Forest",
    "private tours Cameron Highlands",
    "co-tours Cameron Highlands",
    "adventure tours Cameron Highlands",
    "Cameron Highlands sightseeing",
    "Mossy Forest half-day tour",
    "Mossy Forest full-day tour",
    "Cameron Highlands sunrise tour",
    "Mossy Forest eco tour",
    "Cameron Highlands jungle walk",
  ]
);

export default function ToursLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
