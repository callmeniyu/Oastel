"use client"

import { useEffect, useState } from "react"
import TransferFilterBar from "@/components/ui/TransferFilterBar"
import SearchInput from "@/components/ui/SearchInput"
import TransferCard from "@/components/ui/TransferCard"
import Lottie from "lottie-react"
import NotFound from "@/public/images/notfound.json"
import { IoFilterSharp, IoClose } from "react-icons/io5"
import { transferApi } from "@/lib/transferApi"
import { TransferType } from "@/lib/types"
import Image from "next/image"

type FilterState = {
    from: string
    to: string
    transports: string[]
    durations: string[]
    prices: string[]
}

export default function Transfers() {
    const [searchTerm, setSearchTerm] = useState("")
    const [allTransfers, setAllTransfers] = useState<TransferType[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Filter transfers by type
    const vanTransfers = allTransfers.filter((transfer) => transfer.type.toLowerCase() === "van")
    const ferryTransfers = allTransfers.filter((transfer) => transfer.type.toLowerCase() === "van + ferry")
    const privateTransfers = allTransfers.filter((transfer) => transfer.type.toLowerCase() === "private")

    const [filters, setFilters] = useState<FilterState>({
        from: "",
        to: "",
        transports: [],
        durations: [],
        prices: [],
    })

    const [filteredTransfers, setFilteredTransfers] = useState<TransferType[]>([])
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [filtersApplied, setFiltersApplied] = useState(false)

    // Fetch transfers data on component mount
    useEffect(() => {
        const fetchTransfers = async () => {
            try {
                setLoading(true)
                const response = await transferApi.getTransfers({ limit: 100 })
                setAllTransfers(response.data)
                setFilteredTransfers(response.data)
                setError(null)
            } catch (err) {
                console.error("Error fetching transfers:", err)
                setError("Failed to load transfers. Please try again later.")
            } finally {
                setLoading(false)
            }
        }

        fetchTransfers()
    }, [])

    const handleFilterChange = (field: keyof FilterState, value: string | string[]) => {
        setFilters((prev) => ({ ...prev, [field]: value }))
    }

    const handleApply = () => {
        const result = allTransfers.filter((transfer) => {
            const { from, to, transports, durations, prices } = filters

            // From filter - exact match or contains
            const matchFrom =
                !from.trim() ||
                transfer.from.toLowerCase() === from.trim().toLowerCase() ||
                transfer.from.toLowerCase().includes(from.trim().toLowerCase())

            // To filter - exact match or contains
            const matchTo =
                !to.trim() ||
                transfer.to.toLowerCase() === to.trim().toLowerCase() ||
                transfer.to.toLowerCase().includes(to.trim().toLowerCase())

            // Transport filter - map filter options to transfer types and tags
            const matchTransport =
                transports.length === 0 ||
                transports.some((t) => {
                    const transportLower = t.toLowerCase()
                    const transferTypeLower = transfer.type.toLowerCase()

                    switch (transportLower) {
                        case "shared mini van":
                            return transferTypeLower === "van"
                        case "shared van + ferry":
                            return transferTypeLower === "van + ferry"
                        case "private alphard":
                            return (
                                transferTypeLower === "private" ||
                                transfer.tags.some(
                                    (tag) => tag.toLowerCase().includes("private") || tag.toLowerCase().includes("alphard")
                                )
                            )
                        case "private innova":
                            return (
                                transferTypeLower === "private" ||
                                transfer.tags.some(
                                    (tag) => tag.toLowerCase().includes("private") || tag.toLowerCase().includes("innova")
                                )
                            )
                        case "private welfare":
                            return (
                                transferTypeLower === "private" ||
                                transfer.tags.some(
                                    (tag) => tag.toLowerCase().includes("private") || tag.toLowerCase().includes("welfare")
                                )
                            )
                        case "private mini van":
                            return (
                                transferTypeLower === "private" ||
                                transfer.tags.some(
                                    (tag) =>
                                        tag.toLowerCase().includes("private") ||
                                        tag.toLowerCase().includes("mini") ||
                                        tag.toLowerCase().includes("van")
                                )
                            )
                        default:
                            // Generic matching for any transport type
                            return (
                                transferTypeLower.includes(transportLower) ||
                                transfer.tags.some((tag) => tag.toLowerCase().includes(transportLower))
                            )
                    }
                })

            // Duration filter - check the duration field
            const matchDuration =
                durations.length === 0 ||
                durations.some((d) => {
                    // Extract number from duration string (e.g., "4 hours" -> 4, "3.5" -> 3.5)
                    const durationStr = transfer.duration.toString()
                    const transferDuration = parseFloat(durationStr.replace(/[^0-9.]/g, ""))

                    switch (d) {
                        case "2–4 hrs":
                            return transferDuration >= 2 && transferDuration <= 4
                        case "4–8 hrs":
                            return transferDuration > 4 && transferDuration <= 8
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
                    return transfer.newPrice >= min && transfer.newPrice <= max
                })

            // Search filter - include tags in search
            const matchSearch =
                searchTerm.trim() === "" ||
                transfer.title.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
                transfer.from.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
                transfer.to.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
                transfer.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
                transfer.desc.toLowerCase().includes(searchTerm.toLowerCase().trim())

            return matchFrom && matchTo && matchTransport && matchDuration && matchPrice && matchSearch
        })

        setFilteredTransfers(result)

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
        setFilteredTransfers(allTransfers) // Reset to show all current transfers
        setFiltersApplied(false)
        setIsFilterOpen(false)
    }

    const handleClearSearch = () => {
        setSearchTerm("")
        setFilteredTransfers(allTransfers) // Reset to show all current transfers
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
                    src="/images/transfer-main.jpg"
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

            {/* Loading State */}
            {loading && (
                <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary_green mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading transfers...</p>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                    <div className="text-red-500 mb-4">
                        <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <p className="text-lg font-semibold">{error}</p>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-primary_green text-white rounded-lg hover:bg-primary_green/90 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Main Content - only show when not loading and no error */}
            {!loading && !error && (
                <>
                    {/* Search & Filter Toggle */}
                    <div className="flex gap-3 items-center justify-between px-5 mt-8">
                        <hr className="border-b-2 border-primary_green w-full hidden md:flex" />
                        <SearchInput
                            customeStyles=""
                            value={searchTerm}
                            onChange={setSearchTerm}
                            onSearch={handleApply}
                            onClear={handleClearSearch}
                            placeholder="Search for transfers"
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
                            <TransferFilterBar
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
                                    <TransferFilterBar
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

                        {/* Transfers */}
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
                                        {filteredTransfers.length === 0 ? (
                                            <div className="col-span-full text-center text-desc_gray mt-4 text-sm">
                                                <Lottie loop animationData={NotFound} className="w-40 h-40 mx-auto" />
                                                <p>No transfers match your filters. Try changing the options.</p>
                                            </div>
                                        ) : (
                                            filteredTransfers.map((transfer, i) => (
                                                <TransferCard key={transfer._id || i} {...transfer} />
                                            ))
                                        )}
                                    </div>
                                </div>
                            ) : (
                                // Show categorized transfers when no filters are active
                                <>
                                    {/* Van Transfers */}
                                    {vanTransfers.length > 0 && (
                                        <div id="van">
                                            <div className="flex items-center gap-2 mb-6">
                                                <hr className="border-b-2 border-primary_green w-16 sm:w-40 md:flex" />
                                                <h2 className="text-3xl font-extrabold sm:font-semibold text-primary_green mb-4 pt-2 min-w-max">
                                                    Van
                                                </h2>
                                                <hr className="border-b-2 border-primary_green w-full md:flex" />
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {vanTransfers.map((transfer, i) => (
                                                    <TransferCard key={transfer._id || i} {...transfer} />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Van + Ferry Transfers */}
                                    {ferryTransfers.length > 0 && (
                                        <div id="ferry">
                                            <div className="flex items-center gap-2 mb-6">
                                                <hr className="border-b-2 border-primary_green w-16 sm:w-40 md:flex" />
                                                <h2 className="text-3xl font-extrabold sm:font-semibold text-primary_green mb-4 pt-2 min-w-max">
                                                    Van + Ferry
                                                </h2>
                                                <hr className="border-b-2 border-primary_green w-full md:flex" />
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {ferryTransfers.map((transfer, i) => (
                                                    <TransferCard key={transfer._id || i} {...transfer} />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Private Transfers */}
                                    {privateTransfers.length > 0 && (
                                        <div id="private">
                                            <div className="flex items-center gap-2 mb-6">
                                                <hr className="border-b-2 border-primary_green w-16 sm:w-40 md:flex" />
                                                <h2 className="text-3xl font-extrabold sm:font-semibold text-primary_green mb-4 pt-2 min-w-max">
                                                    Private
                                                </h2>
                                                <hr className="border-b-2 border-primary_green w-full md:flex" />
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {privateTransfers.map((transfer, i) => (
                                                    <TransferCard key={transfer._id || i} {...transfer} />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* No transfers state */}
                                    {vanTransfers.length === 0 &&
                                        ferryTransfers.length === 0 &&
                                        privateTransfers.length === 0 && (
                                            <div className="col-span-full text-center text-desc_gray mt-8">
                                                <Lottie loop animationData={NotFound} className="w-40 h-40 mx-auto" />
                                                <p className="text-lg font-semibold text-gray-600 mt-4">
                                                    No transfers available at the moment
                                                </p>
                                                <p className="text-sm text-gray-500 mt-2">
                                                    Please check back later for new transfers
                                                </p>
                                            </div>
                                        )}
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
