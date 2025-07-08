"use client"
import GreenBtn from "./GreenBtn"
import { FaBus, FaWalking, FaChevronDown } from "react-icons/fa"
import { useState, useEffect, useRef } from "react"

type FilterState = {
    from: string
    to: string
    transports: string[]
    durations: string[]
    prices: string[]
}

type Props = {
    filters: FilterState
    onFilterChange: (field: keyof FilterState, value: string | string[]) => void
    onApply: () => void
    onClear?: () => void
    isSmallScreen?: boolean
}

export default function TicketFilterBar({ filters, onFilterChange, onApply, onClear, isSmallScreen }: Props) {
    const [fromDropdownOpen, setFromDropdownOpen] = useState(false)
    const [toDropdownOpen, setToDropdownOpen] = useState(false)
    const fromDropdownRef = useRef<HTMLDivElement>(null)
    const toDropdownRef = useRef<HTMLDivElement>(null)

    const locationOptions = ["Cameron Highlands", "Taman Negara", "Kuala Besut Jetty", "Perhentian Islands", "Kuala Lumpur"]

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (fromDropdownRef.current && !fromDropdownRef.current.contains(event.target as Node)) {
                setFromDropdownOpen(false)
            }
            if (toDropdownRef.current && !toDropdownRef.current.contains(event.target as Node)) {
                setToDropdownOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleCheckboxChange = (field: "transports" | "durations" | "prices", value: string) => {
        const updated = filters[field].includes(value)
            ? filters[field].filter((v) => v !== value)
            : [...filters[field], value]
        onFilterChange(field, updated)
    }

    const handleLocationSelect = (field: "from" | "to", value: string) => {
        onFilterChange(field, value)
        if (field === "from") setFromDropdownOpen(false)
        if (field === "to") setToDropdownOpen(false)
    }

    return (
        <aside className={`w-full sm:w-72 bg-white ${!isSmallScreen && "border shadow-md"} rounded-xl p-4 font-poppins`}>
            <h3 className="text-center text-lg font-semibold bg-primary_green text-white py-2 rounded-t-lg mb-4">
                Filters
            </h3>

            {/* From & To */}
            <div className="mb-4 space-y-3">
                {/* From Dropdown */}
                <div className="relative" ref={fromDropdownRef}>
                    <div className="flex items-center gap-2">
                        <FaBus className="text-xl text-primary_green" />
                        <div className="relative w-full">
                            <button
                                type="button"
                                onClick={() => setFromDropdownOpen(!fromDropdownOpen)}
                                className="w-full border rounded px-3 py-2 text-sm text-left bg-white flex items-center justify-between hover:border-primary_green focus:outline-none focus:border-primary_green"
                            >
                                <span className={filters.from ? "text-black" : "text-gray-400"}>
                                    {filters.from || "From"}
                                </span>
                                <FaChevronDown
                                    className={`text-xs transition-transform ${fromDropdownOpen ? "rotate-180" : ""}`}
                                />
                            </button>
                            {fromDropdownOpen && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-10">
                                    {locationOptions.map((location) => (
                                        <button
                                            key={location}
                                            type="button"
                                            onClick={() => handleLocationSelect("from", location)}
                                            className="w-full px-3 py-2 text-sm text-left hover:bg-primary_green hover:text-white transition-colors"
                                        >
                                            {location}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* To Dropdown */}
                <div className="relative" ref={toDropdownRef}>
                    <div className="flex items-center gap-2">
                        <FaWalking className="text-xl text-primary_green" />
                        <div className="relative w-full">
                            <button
                                type="button"
                                onClick={() => setToDropdownOpen(!toDropdownOpen)}
                                className="w-full border rounded px-3 py-2 text-sm text-left bg-white flex items-center justify-between hover:border-primary_green focus:outline-none focus:border-primary_green"
                            >
                                <span className={filters.to ? "text-black" : "text-gray-400"}>{filters.to || "To"}</span>
                                <FaChevronDown
                                    className={`text-xs transition-transform ${toDropdownOpen ? "rotate-180" : ""}`}
                                />
                            </button>
                            {toDropdownOpen && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-10">
                                    {locationOptions.map((location) => (
                                        <button
                                            key={location}
                                            type="button"
                                            onClick={() => handleLocationSelect("to", location)}
                                            className="w-full px-3 py-2 text-sm text-left hover:bg-primary_green hover:text-white transition-colors"
                                        >
                                            {location}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Transport Types */}
            <div className="border-t pt-4 mb-4">
                <h4 className="font-semibold text-title_black mb-2 text-sm">Type of transport</h4>
                <ul className="space-y-1 text-desc_gray text-sm">
                    {["Van only", "Van + Ferry", "Private Innova", "Private Welfare", "Private toyota van"].map((val) => (
                        <li key={val}>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={filters.transports.includes(val)}
                                    onChange={() => handleCheckboxChange("transports", val)}
                                />
                                {val}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Duration */}
            <div className="border-t pt-4 mb-4">
                <h4 className="font-semibold text-title_black mb-2 text-sm">Duration</h4>
                <ul className="space-y-1 text-desc_gray text-sm">
                    {["2–4 hrs", "4–8 hrs"].map((val) => (
                        <li key={val}>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={filters.durations.includes(val)}
                                    onChange={() => handleCheckboxChange("durations", val)}
                                />
                                {val}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Price */}
            <div className="border-t pt-4 mb-5">
                <h4 className="font-semibold text-title_black mb-2 text-sm">Price</h4>
                <ul className="space-y-1 text-desc_gray text-sm">
                    {["50–150 RM", "150–250 RM", "250-400 RM", "400-600 RM"].map((val) => (
                        <li key={val}>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={filters.prices.includes(val)}
                                    onChange={() => handleCheckboxChange("prices", val)}
                                />
                                {val}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Apply Filters Button */}
            <GreenBtn
                text="Apply Filters"
                onClick={onApply}
                customStyles="w-full py-2 text-white font-semibold rounded text-sm"
            />

            {onClear && (
                <button
                    onClick={onClear}
                    className="w-full mt-3 py-2 text-primary_green border border-primary_green rounded text-sm"
                >
                    Clear Filters
                </button>
            )}
        </aside>
    )
}
