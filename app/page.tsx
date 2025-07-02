import About from "@/components/sections/AboutSection"
import Blog from "@/components/sections/BlogSection"
import BookingOptions from "@/components/sections/BookingOptionsSection"
import ContactUs from "@/components/sections/ContactUsSection"
import FAQ from "@/components/sections/FAQSection"
import Features from "@/components/sections/FeaturesSection"
import Hero from "@/components/sections/HeroSection"
import Testimonials from "@/components/sections/TestimonialSection"

export default function Home() {
    return (
        <div className="font-poppins">
            <Hero />
            <BookingOptions />
            <Blog />
            <Features />
            <About />
            <Testimonials />
            <FAQ/>
            <ContactUs />
        </div>
    )
}
