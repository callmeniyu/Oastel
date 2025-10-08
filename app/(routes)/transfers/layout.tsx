import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seoUtils";

export const metadata: Metadata = generatePageMetadata(
  "Cameron Highlands Transfers | Van & Ferry Services",
  "Book comfortable van and ferry transfers across Cameron Highlands. From Cameron Highlands to Kuala Besut, Taman Negara to Perhentian Islands - reliable transportation for your Cameron Highlands journey.",
  "/transfers",
  [
    "Cameron Highlands transfers",
    "Minivan transfer Cameron Highlands to Kuala Besut",
    "Taman Negara to Perhentian Islands transfer",
    "Kuala Tahan minivan transfer",
    "Cameron Highlands to Perhentian Islands transfer",
    "Perhentian Islands boat ticket + minivan",
    "van transfer Cameron Highlands",
    "Taman Negara transfer",
    "Kuala Besut jetty van transfer",
    "private van Cameron Highlands",
  ]
);

export default function TransfersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
