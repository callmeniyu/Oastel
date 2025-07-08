import Image from "next/image"
import Tag from "@/components/ui/Tag"
import TicketCard from "@/components/ui/TicketCard"
import FAQSection from "@/components/sections/FAQSection"
import GreenBtn from "@/components/ui/GreenBtn"
import { FaBookmark } from "react-icons/fa"
import { BsInfoCircleFill } from "react-icons/bs"
import { FaClock } from "react-icons/fa6"
import { RiRouteFill } from "react-icons/ri"
import { RiMapPinLine } from "react-icons/ri"
import { IoWarningOutline } from "react-icons/io5"
import { getOtherTickets, getTicketBySlug } from "@/lib/utils"
import { FaBus, FaWalking } from "react-icons/fa"

type TicketDetailPageProps = {
    params: { slug: string }
}

export default async function ticketDetailPage({ params }: TicketDetailPageProps) {
    const { slug } = params
    const ticketDetails = await getTicketBySlug(slug)
    const othertickets = await getOtherTickets(slug)

    if (!ticketDetails) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-10">
                <h1 className="text-2xl font-bold text-red-600">ticket not found</h1>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-10 space-y-10 font-poppins">
            <div className="flex flex-col lg:flex-row gap-8 md:px-8 lg:px-16">
                <div className="flex-1 space-y-6">
                    <Image
                        src={ticketDetails.image}
                        alt={ticketDetails.title}
                        width={700}
                        height={500}
                        className="rounded-xl sm:w-full sm:h-[25rem] object-cover"
                    />
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold sm:font-bold text-primary_green">
                            {ticketDetails.title}
                        </h1>
                        <p className="text-desc_gray mt-2">{ticketDetails.desc}</p>
                        <div className="flex flex-wrap gap-2 mt-4">
                            {ticketDetails.tags.map((tag, i) => (
                                <Tag key={i} tag={tag} />
                            ))}
                        </div>
                    </div>

                    {/* ✅ Booking Panel for small screens */}
                    <div className="block lg:hidden bg-white border rounded-md p-4 shadow-sm mt-6">
                        <div className="mb-4">
                            <p className="text-lg text-gray-400 line-through">RM {ticketDetails.oldPrice}</p>
                            <h2 className="text-3xl font-extrabold sm:font-bold">
                                RM {ticketDetails.newPrice}
                                <span className="">/person</span>
                            </h2>
                            <div className="flex items-center gap-2">
                                <FaBookmark className="text-primary_green inline-block mr-1" />
                                <span className="font-semibold">{ticketDetails.bookedCount} + Booked</span>
                            </div>
                        </div>
                        <GreenBtn text="Book Now" action={`/booking/ticket/${ticketDetails.slug}`} customStyles="" />
                    </div>

                    <div className="space-y-6 mt-6">
                        <div className="bg-white border rounded-md p-4 shadow-sm">
                            <div className="flex gap-2 items-center">
                                <div className="p-1 rounded-full bg-primary_green">
                                    <FaBus className="text-sm text-white" />
                                </div>
                                <h5 className="font-semibold text-primary_green">From</h5>
                            </div>
                            <ul className="list-disc ml-5 text-sm text-desc_gray space-y-1 mt-2">
                                <p>{ticketDetails.from}</p>
                            </ul>
                        </div>
                        <div className="bg-white border rounded-md p-4 shadow-sm">
                            <div className="flex gap-2 items-center">
                                <div className="p-1 rounded-full bg-primary_green">
                                    <FaWalking className="text-md text-white" />
                                </div>
                                <h5 className="font-semibold text-primary_green">To</h5>
                            </div>
                            <ul className="list-disc ml-5 text-sm text-desc_gray space-y-1 mt-2">
                                <p>{ticketDetails.to}</p>
                            </ul>
                        </div>
                        <div className="bg-white border rounded-md p-4 shadow-sm">
                            <div className="flex gap-2 items-center">
                                <BsInfoCircleFill className="text-xl text-primary_green" />
                                <h5 className="font-semibold text-primary_green">About this ticket</h5>
                            </div>
                            <ul className="list-disc ml-5 text-sm text-desc_gray space-y-1 mt-2">
                                <p>{ticketDetails.details.about}</p>
                            </ul>
                        </div>

                        <div className="bg-white border rounded-md p-4 shadow-sm">
                            <div className="flex gap-2 items-center">
                                <FaClock className="text-xl text-primary_green" />
                                <h5 className="font-semibold text-primary_green">Departure Time</h5>
                            </div>
                            <ul className="mt-2 space-y-1">
                                {ticketDetails.time.map((time, index) => (
                                    <li key={index} className="text-sm text-desc_gray ml-5">
                                        {time}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-white border rounded-md p-4 shadow-sm">
                            <div className="flex gap-2 items-center mb-2">
                                <div className="p-0.5 rounded-full bg-primary_green">
                                    <RiRouteFill className="text-lg text-white" />
                                </div>
                                <h5 className="font-semibold text-primary_green">Itinerary</h5>
                            </div>
                            <ul className="ml-5 text-sm text-desc_gray space-y-1">
                                <p>{ticketDetails.details.itinerary}</p>
                            </ul>
                        </div>

                        <div className="bg-white border rounded-md p-4 shadow-sm">
                            <div className="flex gap-2 items-center mb-2">
                                <div className="p-0.5 rounded-full bg-primary_green">
                                    <RiMapPinLine className="text-lg text-white" />
                                </div>
                                <h5 className="font-semibold text-primary_green">Pickup Location</h5>
                            </div>
                            <p className="text-sm text-desc_gray mb-2">
                                We’ll pick you up from the gates of your hostels or guest houses anywhere around the
                                following places.
                            </p>
                            <ul className="list-disc ml-5 text-sm text-desc_gray space-y-1">
                                {ticketDetails.details.pickupLocations.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-white border rounded-md p-4 shadow-sm">
                            <div className="flex gap-2 items-center mb-2">
                                <div className="p-1 rounded-full bg-primary_green">
                                    <IoWarningOutline className="text-lg text-white" />
                                </div>
                                <h5 className="font-semibold text-primary_green">Note</h5>
                            </div>
                            <p className="text-sm text-desc_gray">{ticketDetails.details.note}</p>
                        </div>
                    </div>
                </div>

                {/* ✅ Booking Panel for large screens */}
                <div className="w-full lg:w-80 shrink-0 hidden lg:block">
                    <div className="mb-6">
                        <p className="text-lg text-gray-400 line-through">RM {ticketDetails.oldPrice}</p>
                        <h2 className="text-lg">
                            <h2 className="text-3xl font-bold">
                                RM {ticketDetails.newPrice} <span>/person</span>
                            </h2>
                        </h2>
                        <div className="flex items-center gap-2">
                            <FaBookmark className="text-primary_green inline-block mr-1" />
                            <span className="font-semibold">{ticketDetails.bookedCount} + Booked</span>
                        </div>
                    </div>
                    <GreenBtn text="Book Now" action={`/booking/ticket/${ticketDetails.slug}`} customStyles="" />
                </div>
            </div>

            <section>
                <FAQSection faqs={ticketDetails.details.faq} />
            </section>

            <section className="bg-white border rounded-md px-6 py-10 shadow-sm flex flex-col md:flex-row gap-6 mx-4 md:mx-10">
                <div className="md:w-1/2">
                    <h2 className="text-2xl md:text-3xl font-bold text-primary_green">Terms & Conditions</h2>
                    <p className="text-sm text-desc_gray">
                        We recommend you go through terms and cancellation policies before booking.
                    </p>
                </div>
                {/* Divider */}
                <hr className="hidden md:block border border-gray-200 w-40 rotate-90 self-center" />
                <hr className="block md:hidden border border-gray-200 w-full" />
                <div className="flex justify-center md:w-1/2">
                    <GreenBtn text="📄 See T&C" action={"/privacy-policy"} customStyles="w-32" />
                </div>
            </section>

            {/* Book Button */}
            <div className="text-center">
                <GreenBtn text="Book this ticket" action={`/booking/ticket/${ticketDetails.slug}`} />
            </div>

            {/* Other tickets */}
            <section>
                <div className="flex items-center gap-2">
                    <hr className="border-b-2 border-primary_green w-16 sm:w-40 md:flex" />
                    <h2 className="text-2xl font-extrabold sm:font-bold text-primary_green mb-4 pt-2  min-w-max">
                        Other tickets
                    </h2>
                    <hr className="border-b-2 border-primary_green  w-full  md:flex" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {othertickets.map((ticket, i) => (
                        <TicketCard key={i} {...ticket} />
                    ))}
                </div>
            </section>
        </div>
    )
}
