import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seoUtils";

export const metadata: Metadata = generatePageMetadata(
  "All Transfers in Cameron Highlands",
  "Book comfortable van and ferry transfers across Cameron Highlands. From Cameron Highlands to Kuala Besut, Taman Negara to Perhentian Islands - reliable transportation for your Cameron Highlands journey.",
  "/transfers",
  [
    "Cameron Highlands transfers",
    "Budget transfer",
    "Cameron Highlands Van Ticket",
    "Cameron Highlands Bus Ticket",
    "Kuala Besut transfer",
    "Perhentian Islands transfer",
    "van transfer Cameron Highlands",
    "Taman Negara transfer",
  ]
);

export default function TransfersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
