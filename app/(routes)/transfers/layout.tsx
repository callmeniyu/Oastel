import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seoUtils";

export const metadata: Metadata = generatePageMetadata(
  "All Transfers in Malaysia",
  "Book comfortable van and ferry transfers across Malaysia. From Cameron Highlands to Kuala Besut, Taman Negara to Perhentian Islands - reliable transportation for your Malaysian journey.",
  "/transfers",
  [
    "Malaysia transfers",
    "Cameron Highlands transfer",
    "Kuala Besut transfer",
    "Perhentian Islands transfer",
    "van transfer Malaysia",
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
