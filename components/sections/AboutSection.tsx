export default function AboutSection() {
    return (
        <section className="bg-primary_green text-white py-12 px-4 md:px-16">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 items-center">
                {/* Left Section: Logo */}
                <div className="flex-1 text-center md:text-left flex justify-center py-20 sm:py-0">
                    <h2 className="text-4xl md:text-5xl font-bold font-poppins">Oastel</h2>
                </div>

                {/* Right Section: Content */}
                <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-semibold font-poppins mb-2">
                        More Than a Booking Platform
                    </h3>
                    <p className="text-gray-400 font-medium mb-4 ">
                        At Oastel, we go beyond bookings—we help you experience Malaysia the right way.
                    </p>
                    <p className="text-white font-poppins mb-4 leading-relaxed text-sm md:text-base">
                        We offer a thoughtfully curated selection of tours, private group adventures,
                        and transportation routes across some of the country’s most stunning destinations—
                        from the lush highlands of Cameron to the peaceful islands of Taman Negara and beyond.
                    </p>
                    <p className="text-white font-poppins leading-relaxed text-sm md:text-base">
                        We combine local expertise, seamless booking experiences, and a commitment to genuine,
                        personalized travel. Whether you’re heading out on a Land Rover tour, catching a sunrise
                        in the hills, or taking a minivan across scenic routes, Oastel ensures your journey is
                        smooth, safe, and memorable.
                    </p>
                </div>
            </div>
        </section>
    );
}
