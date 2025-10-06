import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seoUtils";

export const metadata: Metadata = generatePageMetadata(
  "All Tours in Cameron Highlands",
  "Browse our complete collection of Cameron Highlands tours, Mossy Forest adventures, private and shared tours across Cameron Highlands. Find the perfect tour for your Cameron Highlands adventure.",
  "/tours",
  [
    "Cameron Highlands tours",
    "Mossy Forest tours",
    "Mossy Forest tours",
    "private tours Cameron Highlands",
    "co-tours Cameron Highlands",
    "adventure tours",
  ]
);

export default function ToursLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
