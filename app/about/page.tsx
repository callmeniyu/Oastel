import Image from "next/image"
import { IoMdArrowForward } from "react-icons/io"
export default function AboutPage() {
    const features = [
        {
            id: 1,
            title: "Secure",
            desc: "You are safe with us—verified tours, trusted partners, and protected payments.",
            icon: "/images/about3.png",
        },
        {
            id: 2,
            title: "Budget-Friendly",
            desc: "Enjoy unforgettable travel experiences without overspending. Great value, always.",
            icon: "/images/about4.png",
        },
        {
            id: 3,
            title: "Reliable",
            desc: "Count on punctual vans, confirmed tours, and dependable service every step of the way.",
            icon: "/images/about5.png",
        },
    ]
    return (
        <main className="font-poppins text-title_black">
            {/* Section 1: Hero */}
            <section id="abou-tus" className="px-6 flex gap-6 items-end md:px-12 py-10 max-w-7xl mx-auto">
                <div>
                    <h3 className="text-lg font-semibold mb-2">We are Oastel</h3>
                    <h1 className="text-3xl md:text-5xl font-bold text-primary_green mb-2">We Know What Travelers Need</h1>
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-500 mb-10">We Deliver It Well</h2>
                    <Image
                        src="/images/about1.jpg"
                        width={800}
                        height={800}
                        alt="Handshake"
                        className="rounded-2xl h-[22rem] object-cover"
                    />
                </div>

                <Image
                    src="/images/about2.jpg"
                    width={800}
                    height={800}
                    alt="Handshake"
                    className="rounded-2xl w-2/6 h-[30rem] object-cover hidden md:block"
                />
            </section>

            {/* Section 2: Our Story */}
            <section id="our-story" className="bg-white px-6 md:px-12 py-16 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                    <div className="text-4xl font-bold text-primary_green flex items-center gap-2">
                        <h2>Our Story</h2>{" "}
                        <div className="transform rotate-90 mt-2">
                            <IoMdArrowForward className="-rotate-12 " />
                        </div>
                    </div>
                </div>

                <div>
                    <p className="text-primary_green font-semibold text-lg mb-4">
                        Oastel began with a simple idea: to make travel in Malaysia easier, more personal, and deeply
                        enriching.
                    </p>
                    <p className="text-desc_gray leading-relaxed">
                        We started in the heart of Cameron Highlands, where we noticed travelers looking for something more
                        than just a hotel or a ride—they were looking for real experiences. So we brought them closer to the
                        beauty of the highlands, the culture of the locals, and the hidden gems that only a few get to see.
                        <br />
                        <br />
                        While we handle logistics—you create memories. Our team is made up of passionate locals and travel
                        lovers who care about every detail of your journey. Whether it’s a sunrise trek or a boat ride to an
                        island, we ensure every trip booked with Oastel feels smooth, safe, and special.
                    </p>
                </div>
            </section>

            {/* Section 3: Key Benefits */}
            <section id="our-features" className="bg-[#F5F5F5] px-2 md:px-12 py-16">
                <div className="max-w-7xl mx-auto text-center mb-10">
                    <h2 className="text-xl font-semibold text-primary_green">
                        Your journey is more than just a destination
                    </h2>
                    <p className="text-desc_gray">We get that :)</p>
                </div>

                <div className="flex flex-col gap-4 md:gap-8 items-start ">
                    <div className="flex flex-col md:flex-row gap-2">
                        <div className="flex gap-6 px-6 max-w-7xl mx-auto">
                            <div
                                className="bg-white rounded-lg py-6 pl-6 text-left shadow-md flex flex-col gap-4"
                            >
                                <div className="flex justify-between items-start overflow-hidden">
                                    <span className="text-sm font-bold text-gray-400 rounded-full bg-[#F5F5F5] px-4 py-2">
                                        {features[0].id}
                                    </span>
                                    <img
                                        src={features[0].icon}
                                        alt={features[0].title}
                                        className="w-32 h-36 relative left-6"
                                    />
                                </div>
                                <div className="pr-6">
                                    <h3 className="font-bold text-lg text-primary_green mb-1">{features[0].title}</h3>
                                    <p className="text-desc_gray text-sm">{features[0].desc}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-6 px-6 max-w-7xl mx-auto">
                            <div
                                className="bg-white rounded-lg py-6 pl-6 text-left shadow-md flex flex-col gap-4"
                            >
                                <div className="flex justify-between items-start overflow-hidden">
                                    <span className="text-sm font-bold text-gray-400 rounded-full bg-[#F5F5F5] px-4 py-2">
                                        {features[1].id}
                                    </span>
                                    <img
                                        src={features[1].icon}
                                        alt={features[1].title}
                                        className="w-32 h-36 relative left-6"
                                    />
                                </div>
                                <div className="pr-6">
                                    <h3 className="font-bold text-lg text-primary_green mb-1">{features[1].title}</h3>
                                    <p className="text-desc_gray text-sm">{features[1].desc}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex gap-6 px-6 max-w-7xl mx-auto">
                            <div
                                className="bg-white rounded-lg py-6 pl-6 text-left shadow-md flex flex-col gap-4"
                            >
                                <div className="flex justify-between items-start overflow-hidden">
                                    <span className="text-sm font-bold text-gray-400 rounded-full bg-[#F5F5F5] px-4 py-2">
                                        {features[2].id}
                                    </span>
                                    <img
                                        src={features[2].icon}
                                        alt={features[2].title}
                                        className="w-32 h-36 relative left-6"
                                    />
                                </div>
                                <div className="pr-6">
                                    <h3 className="font-bold text-lg text-primary_green mb-1">{features[2].title}</h3>
                                    <p className="text-desc_gray text-sm">{features[2].desc}</p>
                                </div>
                            </div>
                        </div>
                </div>
            </section>
        </main>
    )
}
