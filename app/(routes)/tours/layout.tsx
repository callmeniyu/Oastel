import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seoUtils";

export const metadata: Metadata = generatePageMetadata(
  "All Tours in Malaysia",
  "Browse our complete collection of Cameron Highlands tours, Mossy Forest adventures, private and shared tours across Malaysia. Find the perfect tour for your Malaysian adventure.",
  "/tours",
  [
    "Cameron Highlands tours",
    "Malaysia tours",
    "Mossy Forest tours",
    "private tours Malaysia",
    "co-tours Malaysia",
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
