import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seoUtils";

export const metadata: Metadata = generatePageMetadata(
  "Contact Us",
  "Get in touch with Oastel for tours and transfers in Malaysia. WhatsApp, Instagram, or email us for Cameron Highlands tours, transfers to Perhentian Islands, and more.",
  "/contact-us",
  [
    "contact Oastel",
    "Malaysia tour booking",
    "WhatsApp booking",
    "tour inquiry Malaysia",
  ]
);

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
