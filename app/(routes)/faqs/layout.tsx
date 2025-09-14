import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seoUtils";

export const metadata: Metadata = generatePageMetadata(
  "Frequently Asked Questions",
  "Find answers to common questions about Oastel tours and transfers. Learn about booking Cameron Highlands tours, transfer policies, pricing, and what to expect on your Malaysian adventure.",
  "/faqs",
  [
    "Malaysia tour FAQ",
    "Cameron Highlands tour questions",
    "transfer booking FAQ",
    "Mossy Forest tour info",
  ]
);

export default function FAQsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
