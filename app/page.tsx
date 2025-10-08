import { Metadata } from "next";
import About from "@/components/sections/AboutSection";
import Blog from "@/components/sections/BlogSection";
import ContactUs from "@/components/sections/ContactUsSection";
import FAQ from "@/components/sections/FAQSection";
import Features from "@/components/sections/FeaturesSection";
import Hero from "@/components/sections/HeroSection";
import Testimonials from "@/components/sections/TestimonialSection";
import { generatePageMetadata, SITE_CONFIG } from "@/lib/seoUtils";

export const metadata: Metadata = {
  ...generatePageMetadata(
    "Cameron Highlands Tours & Transfers | Mossy Forest Adventures - Oastel",
    "Discover Cameron Highlands with Oastel's budget-friendly tours and comfortable transfers. From Mossy Forest tours to sunrise viewpoint tours, book your perfect Cameron Highlands adventure today.",
    "",
    [
      "Cameron Highlands tours",
      "Cameron Highlands transfers",
      "Mossy Forest Cameron Highlands",
      "Mossy Forest tour",
      "sunrise tour Cameron Highlands",
      "Land Rover ride Mossy Forest",
      "Cameron Highlands sightseeing",
      "Mossy Forest entrance",
      "Cameron Highlands adventure trip",
      "budget travel Cameron Highlands",
    ]
  ),
  // Explicitly set icons here to ensure the root page SSR emits public-root paths
  icons: {
    icon: "/favicons/favicon.ico",
    shortcut: "/favicons/favicon.ico",
    apple: "/favicons/apple-touch-icon.png",
  },
};

export default function Home() {
  return (
    <div className="font-poppins">
      <Hero />
      <Blog />
      <Features />
      <About />
      <Testimonials />
      <FAQ />
      <ContactUs />
    </div>
  );
}
