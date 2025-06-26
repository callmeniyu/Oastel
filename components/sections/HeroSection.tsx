"use client"
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"
import Image from "next/image"
import { useEffect, useState } from "react" 

const tourCards = [
    {
        title: "Explore Nature Without the Noise",
        subtitle: "Skip the crowds and connect deeply with nature in curated small-group adventures",
        image: "/images/hero3.jpg",
    },
    {
        title: "Easy Booking, Smooth Rides",
        subtitle: "From tour to transport, booking with Oastel is super easy",
        image: "/images/hero4.jpg",
    },
    {
        title: "Designed for Backpackers & Explorers",
        subtitle:
            "Packages tailored to solo travelers, digital nomads, and curious wanderers.",
        image: "/images/hero5.jpg",
    },
    {
        title: "Travel Together, Save More",
        subtitle: "Co-tours designed for solo travelers and groups to explore at a lower cost",
        image: "/images/hero1.jpg",
    },
    {
        title: "Your Ride, Your Rules",
        subtitle: "Enjoy private van transfers with full control over your schedule, stops, and comfort.",
        image: "/images/hero2.jpg",
    },
]

export default function HeroSection() {
  const [isMounted, setIsMounted] = useState(false)
const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
  loop: true,
  slides: {
    perView: 1.5, 
    spacing: 16,
  },
  breakpoints: {
    "(min-width: 640px)": {
      slides: {
        perView: 2,
        spacing: 20,
      },
    },
    "(min-width: 1024px)": {
      slides: {
        perView: 3,
        spacing: 24,
      },
    },
  },
})
  
    useEffect(() => {
    setIsMounted(true) 
  }, [])

    return (
        <section className="bg-primary_green text-white pt-12 pb-10 px-4 md:px-8 font-poppins">
            <div className="lg:px-32">
                <h1 className="text-2xl md:text-4xl font-semibold text-center leading-snug mb-3 ">
                    Discover Cameron Highlands, Temman Negara, Kuala Besut and more in Your Way
                </h1>
                <p className="text-white/70 text-center">
                    From co-living stays to customizable tours and smooth transport — we’re your local guide to real
                    adventures in the Highlands.
                </p>
            </div>

            <div className="relative max-w-6xl mx-auto mt-6">
                <div className="relative flex items-center">
                    <div className="absolute z-10 left-[56%] sm:left-[43%] md:left-[45%] lg:left-[30%] top-12 flex gap-4 bg-white text-primary_green rounded-full px-4 py-8 shadow-md">
                        <button aria-label="Previous" onClick={() => instanceRef.current?.prev()}>
                            <FaArrowLeft size={16} />
                        </button>
                        <button aria-label="Next" onClick={() => instanceRef.current?.next()}>
                            <FaArrowRight size={16} />
                        </button>
                    </div>

          <div 
            ref={sliderRef} 
            className={`keen-slider ${isMounted ? 'opacity-100' : 'opacity-0'}`}
            style={{ visibility: isMounted ? 'visible' : 'hidden' }}
          >                        {tourCards.map((card, idx) => (
                            <div
                                key={idx}
                                className="keen-slider__slide bg-white/5 rounded-lg overflow-hidden h-72 relative"
                            >
                                <div className="px-3 py-2 absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent">
                                  <h3 className="text-base font-semibold text-white">{card.title}</h3>
                                  <p className="text-sm text-white/80">{card.subtitle}</p>
                                </div>
                                <Image
                                    src={card.image}
                                    alt={card.title}
                                    width={550}
                                    height={550}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
