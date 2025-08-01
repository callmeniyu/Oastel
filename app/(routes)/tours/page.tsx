"use client"

import { useEffect, useState } from "react"
import FilterSidebar from "@/components/ui/TourFilterBar"
import SearchInput from "@/components/ui/SearchInput"
import TourCard from "@/components/ui/TourCard"
import Lottie from "lottie-react"
import NotFound from "@/public/images/notfound.json"
import { IoFilterSharp, IoClose, IoRefresh } from "react-icons/io5"
import { tourApi } from "@/lib/tourApi"
import { TourType } from "@/lib/types"
import Loader from "@/components/ui/Loader"
import Image from "next/image"

type FilterState = {
    type: string
    prices: string[]
    durations: string[]
}

export default function ToursPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [allTours, setAllTours] = useState<TourType[]>([])
    const [filteredTours, setFilteredTours] = useState<TourType[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [filters, setFilters] = useState<FilterState>({
        type: "All",
        prices: [],
        durations: [],
    })

    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [filtersApplied, setFiltersApplied] = useState(false)

    // Fetch tours from API
    useEffect(() => {
        const fetchTours = async () => {
            try {
                setIsLoading(true)
                setError(null)
                const response = await tourApi.getTours({ limit: 100 }) // Get all tours
                console.log("API Response:", response.data)
                console.log("First tour image:", response.data[0]?.image)
                setAllTours(response.data)
                setFilteredTours(response.data)
            } catch (err) {
                console.error("Error fetching tours:", err)
                setError("Failed to load tours. Please try again later.")
            } finally {
                setIsLoading(false)
            }
        }

        fetchTours()
    }, [])

    const handleFilterChange = (field: keyof FilterState, value: any) => {
        setFilters((prev) => ({ ...prev, [field]: value }))
    }

    // Apply filters and search in real-time
    useEffect(() => {
        // Only apply search in real-time, not filters
        if (allTours.length === 0) return

        const applySearch = () => {
            console.log("Applying search:", { searchTerm, tourCount: allTours.length })

            const result = allTours.filter((tour: TourType) => {
                const matchSearch =
                    searchTerm.trim() === "" ||
                    tour.title.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
                    tour.description.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
                    tour.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase().trim()))

                return matchSearch
            })

            setFilteredTours(result)
            console.log("Search results:", result.length, "tours match the search criteria")

            // Check if search is active
            const hasActiveSearch = searchTerm.trim() !== ""
            setFiltersApplied(
                hasActiveSearch || filters.type !== "All" || filters.prices.length > 0 || filters.durations.length > 0
            )
        }

        applySearch()
    }, [allTours, searchTerm])

    const handleApply = () => {
        console.log("Applying filters:", { searchTerm, filters, tourCount: allTours.length })

        const result = allTours.filter((tour: TourType) => {
            const { type, prices, durations } = filters

            const matchType =
                type === "All" ||
                tour.type.toLowerCase() === type.toLowerCase() ||
                tour.packageType.toLowerCase() === type.toLowerCase() ||
                tour.tags.some((tag: string) => tag.toLowerCase() === type.toLowerCase())

            const matchPrice =
                prices.length === 0 ||
                prices.some((range) => {
                    const [min, max] = range.split("-").map(Number)
                    if (isNaN(min) || isNaN(max)) return false
                    return tour.newPrice >= min && tour.newPrice <= max
                })

            const matchDuration =
                durations.length === 0 ||
                durations.some((dur) => {
                    // Check both the period field and tags for duration matching
                    const periodMatch = tour.period && tour.period.toLowerCase().includes(dur.toLowerCase())
                    const tagMatch = tour.tags.some((tag: string) => tag.toLowerCase().includes(dur.toLowerCase()))
                    return periodMatch || tagMatch
                })

            const matchSearch =
                searchTerm.trim() === "" ||
                tour.title.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
                tour.description.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
                tour.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase().trim()))

            return matchType && matchPrice && matchDuration && matchSearch
        })

        setFilteredTours(result)
        console.log("Filtered results:", result.length, "tours match the criteria")

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

    const handleRefresh = async () => {
        try {
            setIsLoading(true)
            setError(null)
            const response = await tourApi.getTours({ limit: 100 })
            setAllTours(response.data)
            setFilteredTours(response.data)
            // Reset filters and search when refreshing
            setFilters({
                type: "All",
                prices: [],
                durations: [],
            })
            setSearchTerm("")
            setFiltersApplied(false)
        } catch (err) {
            console.error("Error refreshing tours:", err)
            setError("Failed to refresh tours. Please try again later.")
        } finally {
            setIsLoading(false)
        }
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

                {/* Desktop refresh button */}
                <button
                    className="hidden sm:flex items-center gap-2 text-sm bg-primary_green text-white px-4 py-2 rounded-md hover:bg-primary_green/80 transition-colors"
                    onClick={handleRefresh}
                    disabled={isLoading}
                >
                    <IoRefresh className={isLoading ? "animate-spin" : ""} />
                    {isLoading ? "Refreshing..." : "Refresh"}
                </button>

                {/* Mobile buttons */}
                <div className="sm:hidden flex gap-2">
                    <button
                        className="flex items-center justify-center w-10 h-10 bg-primary_green text-white rounded-md hover:bg-primary_green/80 transition-colors"
                        onClick={handleRefresh}
                        disabled={isLoading}
                        title="Refresh tours"
                    >
                        <IoRefresh className={isLoading ? "animate-spin" : ""} />
                    </button>
                    <button
                        className="flex items-center gap-1 text-sm bg-primary_green text-white px-3 py-2 rounded-md hover:bg-primary_green/80 transition-colors"
                        onClick={() => (filtersApplied ? handleClearFilters() : setIsFilterOpen(true))}
                    >
                        {filtersApplied ? <IoClose /> : <IoFilterSharp />} {filtersApplied ? "Clear" : "Filters"}
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col sm:flex-row gap-4 relative">
                <div className="hidden sm:block sticky-filter">
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
                    {isLoading ? (
                        <div className="col-span-full flex justify-center items-center py-20">
                            <Loader />
                        </div>
                    ) : error ? (
                        <div className="col-span-full text-center text-red-500 mt-4">
                            <p>{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-2 px-4 py-2 bg-primary_green text-white rounded-md hover:bg-primary_green/80"
                            >
                                Retry
                            </button>
                        </div>
                    ) : filteredTours.length === 0 ? (
                        <div className="col-span-full text-center text-desc_gray mt-4 text-sm">
                            <Lottie loop animationData={NotFound} className="w-40 h-40 mx-auto" />
                            <p>No tours match your filters. Try changing the options.</p>
                        </div>
                    ) : (
                        filteredTours.map((tour: TourType, i: number) => (
                            <TourCard key={tour._id || tour.slug || i} {...tour} />
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
