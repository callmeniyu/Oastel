import { Metadata } from "next";
import About from "@/components/sections/AboutSection";
import Blog from "@/components/sections/BlogSection";
import ContactUs from "@/components/sections/ContactUsSection";
import FAQ from "@/components/sections/FAQSection";
import Features from "@/components/sections/FeaturesSection";
import Hero from "@/components/sections/HeroSection";
import Testimonials from "@/components/sections/TestimonialSection";
import { generatePageMetadata, SITE_CONFIG } from "@/lib/seoUtils";

export const metadata: Metadata = generatePageMetadata(
  "Best Tours & Transfers in Malaysia",
  "Discover Malaysia with Oastel's budget-friendly tours and comfortable transfers. From Cameron Highlands Mossy Forest tours to Perhentian Islands transfers, book your perfect Malaysian adventure today.",
  "",
  [
    "Malaysia tours",
    "Malaysia transfers",
    "Cameron Highlands",
    "Mossy Forest",
    "Perhentian Islands",
    "budget travel Malaysia",
  ]
);

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
