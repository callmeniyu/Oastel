"use client"

import { useEffect, useState } from "react"
import TicketFilterBar from "@/components/ui/TicketFilterBar"
import SearchInput from "@/components/ui/SearchInput"
import TicketCard from "@/components/ui/TicketCard"
import Lottie from "lottie-react"
import NotFound from "@/public/images/notfound.json"
import { IoFilterSharp, IoClose } from "react-icons/io5"
import { allTickets } from "@/lib/data"
import Image from "next/image"

type FilterState = {
    from: string
    to: string
    transports: string[]
    durations: string[]
    prices: string[]
}

export default function Tickets() {
    const [searchTerm, setSearchTerm] = useState("")
    const vanTickets = allTickets.filter((ticket) => ticket.type.toLowerCase() === "van")
    const ferryTickets = allTickets.filter((ticket) => ticket.type.toLowerCase() === "van + ferry")
    const privateTickets = allTickets.filter((ticket) => ticket.type.toLowerCase() === "private")

    const [filters, setFilters] = useState<FilterState>({
        from: "",
        to: "",
        transports: [],
        durations: [],
        prices: [],
    })

    const [filteredTickets, setFilteredTickets] = useState(allTickets)
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [filtersApplied, setFiltersApplied] = useState(false)

    const handleFilterChange = (field: keyof FilterState, value: string | string[]) => {
        setFilters((prev) => ({ ...prev, [field]: value }))
    }

    const handleApply = () => {
        const result = allTickets.filter((ticket) => {
            const { from, to, transports, durations, prices } = filters

            // From filter - exact match or contains
            const matchFrom =
                !from.trim() ||
                ticket.from.toLowerCase() === from.trim().toLowerCase() ||
                ticket.from.toLowerCase().includes(from.trim().toLowerCase())

            // To filter - exact match or contains
            const matchTo =
                !to.trim() ||
                ticket.to.toLowerCase() === to.trim().toLowerCase() ||
                ticket.to.toLowerCase().includes(to.trim().toLowerCase())

            // Transport filter - map filter options to ticket types and tags
            const matchTransport =
                transports.length === 0 ||
                transports.some((t) => {
                    const transportLower = t.toLowerCase()
                    const ticketTypeLower = ticket.type.toLowerCase()

                    switch (transportLower) {
                        case "shared mini van":
                            return ticketTypeLower === "van"
                        case "shared van + ferry":
                            return ticketTypeLower === "van + ferry"
                        case "private alphard":
                            return (
                                ticketTypeLower === "private" ||
                                ticket.tags.some(
                                    (tag) => tag.toLowerCase().includes("private") || tag.toLowerCase().includes("alphard")
                                )
                            )
                        case "private innova":
                            return (
                                ticketTypeLower === "private" ||
                                ticket.tags.some(
                                    (tag) => tag.toLowerCase().includes("private") || tag.toLowerCase().includes("innova")
                                )
                            )
                        case "private welfare":
                            return (
                                ticketTypeLower === "private" ||
                                ticket.tags.some(
                                    (tag) => tag.toLowerCase().includes("private") || tag.toLowerCase().includes("welfare")
                                )
                            )
                        case "private mini van":
                            return (
                                ticketTypeLower === "private" ||
                                ticket.tags.some(
                                    (tag) =>
                                        tag.toLowerCase().includes("private") ||
                                        tag.toLowerCase().includes("mini") ||
                                        tag.toLowerCase().includes("van")
                                )
                            )
                        default:
                            // Generic matching for any transport type
                            return (
                                ticketTypeLower.includes(transportLower) ||
                                ticket.tags.some((tag) => tag.toLowerCase().includes(transportLower))
                            )
                    }
                })

            // Duration filter - check the duration field
            const matchDuration =
                durations.length === 0 ||
                durations.some((d) => {
                    // Extract number from duration string (e.g., "4 hours" -> 4, "3.5" -> 3.5)
                    const durationStr = ticket.duration.toString()
                    const ticketDuration = parseFloat(durationStr.replace(/[^0-9.]/g, ""))

                    switch (d) {
                        case "2–4 hrs":
                            return ticketDuration >= 2 && ticketDuration <= 4
                        case "4–8 hrs":
                            return ticketDuration > 4 && ticketDuration <= 8
                        default:
                            return false
                    }
                })

            // Price filter
            const matchPrice =
                prices.length === 0 ||
                prices.some((range) => {
                    const [min, max] = range
                        .replace("RM", "")
                        .replace("-", "–") // Handle both dash types
                        .split("–")
                        .map((v) => parseInt(v.trim()))
                    return ticket.newPrice >= min && ticket.newPrice <= max
                })

            // Search filter - include tags in search
            const matchSearch =
                searchTerm.trim() === "" ||
                ticket.title.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
                ticket.from.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
                ticket.to.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
                ticket.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
                ticket.desc.toLowerCase().includes(searchTerm.toLowerCase().trim())

            return matchFrom && matchTo && matchTransport && matchDuration && matchPrice && matchSearch
        })

        setFilteredTickets(result)

        // Check if any filters/search are actually active
        const hasActiveFilters =
            searchTerm.trim() !== "" ||
            filters.from !== "" ||
            filters.to !== "" ||
            filters.transports.length > 0 ||
            filters.durations.length > 0 ||
            filters.prices.length > 0

        setFiltersApplied(hasActiveFilters)
        setIsFilterOpen(false)
    }

    const handleClearFilters = () => {
        setFilters({
            from: "",
            to: "",
            transports: [],
            durations: [],
            prices: [],
        })
        setSearchTerm("")
        setFilteredTickets(allTickets) // Reset to show all tickets
        setFiltersApplied(false)
        setIsFilterOpen(false)
    }

    const handleClearSearch = () => {
        setSearchTerm("")
        setFilteredTickets(allTickets)
        setFiltersApplied(false)
    }

    useEffect(() => {
        document.body.style.overflow = isFilterOpen ? "hidden" : "unset"
        // Add smooth scrolling behavior
        document.documentElement.style.scrollBehavior = "smooth"

        return () => {
            document.documentElement.style.scrollBehavior = "auto"
        }
    }, [isFilterOpen])

    return (
        <div>
            {/* Hero */}
            <div className="relative h-96 md:h-[100vh] pt-16 overflow-hidden">
                {/* Background Image */}
                <Image
                    src="/images/ticket-main.jpg"
                    alt="Van transfers background"
                    fill
                    className="object-cover"
                    priority
                />
                {/* Light black overlay */}
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white px-4">
                    <h1 className="text-3xl md:text-5xl font-semibold sm:font-bold font-poppins">
                        Comfortable Van Transfers, One Click Away
                    </h1>
                    <p className="mt-3 max-w-xl text-base md:text-lg font-poppins">
                        Browse our van and boat transfer tickets to and from Cameron Highlands, Taman Negara, Kuala Besut,
                        and more. Comfortable rides, trusted service.
                    </p>
                </div>

                <div className="sm:flex hidden  justify-center absolute bottom-8 left-0 right-0 z-20">
                    <div className="animate-bounce w-8 h-14 rounded-full border-2 border-white/50 flex justify-center">
                        <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
                    </div>
                </div>
            </div>

            {/* Search & Filter Toggle */}
            <div className="flex gap-3 items-center justify-between px-5 mt-8">
                <hr className="border-b-2 border-primary_green w-full hidden md:flex" />
                <SearchInput
                    customeStyles=""
                    value={searchTerm}
                    onChange={setSearchTerm}
                    onSearch={handleApply}
                    onClear={handleClearSearch}
                />
                <button
                    className="sm:hidden ml-2 flex items-center gap-1 text-sm bg-primary_green text-white px-3 py-2 rounded-md"
                    onClick={() => (filtersApplied ? handleClearFilters() : setIsFilterOpen(true))}
                >
                    {filtersApplied ? <IoClose /> : <IoFilterSharp />} {filtersApplied ? "Clear" : "Filters"}
                </button>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col sm:flex-row gap-4 relative">
                {/* Sidebar */}
                <div className="hidden sm:block sticky-filter">
                    <TicketFilterBar
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onApply={handleApply}
                        onClear={handleClearFilters}
                    />
                </div>

                {/* Mobile Filter */}
                {isFilterOpen && (
                    <div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-center px-4 sm:hidden">
                        <div className="bg-white rounded-lg w-full max-w-sm p-4 relative animate-fadeInUp shadow-lg">
                            <button
                                onClick={() => setIsFilterOpen(false)}
                                className="absolute top-3 right-3 text-gray-600 hover:text-black"
                            >
                                <IoClose size={24} />
                            </button>
                            <TicketFilterBar
                                filters={filters}
                                onFilterChange={handleFilterChange}
                                isSmallScreen={true}
                                onApply={() => {
                                    handleApply()
                                    setIsFilterOpen(false)
                                }}
                                onClear={() => {
                                    handleClearFilters()
                                    setIsFilterOpen(false)
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Tickets */}
                <div className="space-y-8 w-full">
                    {filtersApplied ? (
                        // Show filtered results under "Your Results"
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <hr className="border-b-2 border-primary_green w-16 sm:w-40 md:flex" />
                                <h2 className="text-3xl font-extrabold sm:font-semibold text-primary_green mb-4 pt-2 min-w-max">
                                    Your Results
                                </h2>
                                <hr className="border-b-2 border-primary_green w-full md:flex" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredTickets.length === 0 ? (
                                    <div className="col-span-full text-center text-desc_gray mt-4 text-sm">
                                        <Lottie loop animationData={NotFound} className="w-40 h-40 mx-auto" />
                                        <p>No tickets match your filters. Try changing the options.</p>
                                    </div>
                                ) : (
                                    filteredTickets.map((ticket, i) => <TicketCard key={i} {...ticket} />)
                                )}
                            </div>
                        </div>
                    ) : (
                        // Show categorized tickets when no filters are active
                        <>
                            {/* Van Tickets */}
                            {vanTickets.length > 0 && (
                                <div id="van">
                                    <div className="flex items-center gap-2 mb-6">
                                        <hr className="border-b-2 border-primary_green w-16 sm:w-40 md:flex" />
                                        <h2 className="text-3xl font-extrabold sm:font-semibold text-primary_green mb-4 pt-2 min-w-max">
                                            Van
                                        </h2>
                                        <hr className="border-b-2 border-primary_green w-full md:flex" />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {vanTickets.map((ticket, i) => (
                                            <TicketCard key={i} {...ticket} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Van + Ferry Tickets */}
                            {ferryTickets.length > 0 && (
                                <div id="ferry">
                                    <div className="flex items-center gap-2 mb-6">
                                        <hr className="border-b-2 border-primary_green w-16 sm:w-40 md:flex" />
                                        <h2 className="text-3xl font-extrabold sm:font-semibold text-primary_green mb-4 pt-2 min-w-max">
                                            Van + Ferry
                                        </h2>
                                        <hr className="border-b-2 border-primary_green w-full md:flex" />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {ferryTickets.map((ticket, i) => (
                                            <TicketCard key={i} {...ticket} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Private Tickets */}
                            {privateTickets.length > 0 && (
                                <div id="private">
                                    <div className="flex items-center gap-2 mb-6">
                                        <hr className="border-b-2 border-primary_green w-16 sm:w-40 md:flex" />
                                        <h2 className="text-3xl font-extrabold sm:font-semibold text-primary_green mb-4 pt-2 min-w-max">
                                            Private
                                        </h2>
                                        <hr className="border-b-2 border-primary_green w-full md:flex" />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {privateTickets.map((ticket, i) => (
                                            <TicketCard key={i} {...ticket} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
