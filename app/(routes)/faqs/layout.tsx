import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seoUtils";

export const metadata: Metadata = generatePageMetadata(
  "Frequently Asked Questions",
  "Find answers to common questions about Oastel tours and transfers. Learn about booking Cameron Highlands tours, transfer policies, pricing, and what to expect on your Cameron Highlands adventure.",
  "/faqs",
  [
    "mossy forest entry fees",
    "Mossy Forest tour info",
    "Cameron Highlands tour",
    "mossy forest tour FAQ",
    "Cameron Highlands tour questions",
    "transfer booking FAQ",
  ]
);

export default function FAQsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
