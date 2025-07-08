"use client"

import { useEffect, useState } from "react"
import FilterSidebar from "@/components/ui/TourFilterBar"
import SearchInput from "@/components/ui/SearchInput"
import TourCard from "@/components/ui/TourCard"
import Lottie from "lottie-react"
import NotFound from "@/public/images/notfound.json"
import { IoFilterSharp, IoClose } from "react-icons/io5"
import { allTours } from "@/lib/data"
import Loader from "@/components/ui/Loader"
import Image from "next/image"

type FilterState = {
    type: string
    prices: string[]
    durations: string[]
}

export default function ToursPage() {
    const [searchTerm, setSearchTerm] = useState("")

    const [filters, setFilters] = useState<FilterState>({
        type: "All",
        prices: [],
        durations: [],
    })

    const [filteredTours, setFilteredTours] = useState(allTours)
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [filtersApplied, setFiltersApplied] = useState(false)

    const handleFilterChange = (field: keyof FilterState, value: any) => {
        setFilters((prev) => ({ ...prev, [field]: value }))
    }

    const handleApply = () => {
        const result = allTours.filter((tour) => {
            const { type, prices, durations } = filters

            const matchType = type === "All" || tour.tags.some((tag) => tag.toLowerCase() === type.toLowerCase())

            const matchPrice =
                prices.length === 0 ||
                prices.some((range) => {
                    const [min, max] = range.split("-").map(Number)
                    return tour.newPrice >= min && tour.newPrice <= max
                })

            const matchDuration =
                durations.length === 0 ||
                durations.some((dur) => tour.tags.some((tag) => tag.toLowerCase().includes(dur.toLowerCase())))

            const matchSearch =
                searchTerm.trim() === "" ||
                tour.title.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
                tour.desc.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
                tour.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase().trim()))

            return matchType && matchPrice && matchDuration && matchSearch
        })

        setFilteredTours(result)

        // Check if any filters/search are actually active
        const hasActiveFilters =
            searchTerm.trim() !== "" || filters.type !== "All" || filters.prices.length > 0 || filters.durations.length > 0

        setFiltersApplied(hasActiveFilters)
        setIsFilterOpen(false)
    }

    const handleClearFilters = () => {
        setFilters({
            type: "All",
            prices: [],
            durations: [],
        })
        setSearchTerm("")
        setFilteredTours(allTours)
        setFiltersApplied(false)
        setIsFilterOpen(false)
    }

    const handleClearSearch = () => {
        setSearchTerm("")
        setFilteredTours(allTours)
        setFiltersApplied(false)
    }

    useEffect(() => {
        document.body.style.overflow = isFilterOpen ? "hidden" : "unset"
    }, [isFilterOpen])

    return (
        <div>
            <div className="relative h-96 md:h-[90vh] pt-16 overflow-hidden">
                {/* Background Image */}
                <Image src="/images/tour_main.png" alt="Van transfers background" fill className="object-cover" priority />
                {/* Light black overlay */}
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white px-4">
                    <h1 className="text-3xl md:text-5xl font-semibold sm:font-bold font-poppins">Find Your Perfect Tour</h1>
                    <p className="mt-3 max-w-xl text-base md:text-lg font-poppins">
                        From scenic Land Rover rides to intimate group adventures, discover the best of Cameron Highlands
                        through our curated tour packages.
                    </p>
                </div>
                <div className="sm:flex hidden  justify-center absolute bottom-8 left-0 right-0 z-20">
                    <div className="animate-bounce w-8 h-14 rounded-full border-2 border-white/50 flex justify-center">
                        <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
                    </div>
                </div>
            </div>

            <div className="flex gap-3 items-center justify-between px-5 mt-8">
                <hr className="border-b-2 border-primary_green  w-full hidden md:flex" />
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

            <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row gap-4 relative">
                <div className="hidden sm:block">
                    <FilterSidebar
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onApply={handleApply}
                        onClear={handleClearFilters}
                    />
                </div>

                {isFilterOpen && (
                    <div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-center px-4 sm:hidden">
                        <div className="bg-white rounded-lg w-full max-w-sm p-4 relative animate-fadeInUp shadow-lg">
                            <button
                                onClick={() => setIsFilterOpen(false)}
                                className="absolute top-3 right-3 text-gray-600 hover:text-black"
                            >
                                <IoClose size={24} />
                            </button>
                            <FilterSidebar
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

                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTours.length === 0 ? (
                        <div className="col-span-full text-center text-desc_gray mt-4 text-sm">
                            <Lottie loop animationData={NotFound} className="w-40 h-40 mx-auto" />
                            <p>No tours match your filters. Try changing the options.</p>
                        </div>
                    ) : (
                        filteredTours.map((tour, i) => <TourCard key={i} {...tour} />)
                    )}
                </div>
            </div>
        </div>
    )
}
