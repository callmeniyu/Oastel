"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import { FiSearch, FiX, FiChevronDown, FiChevronUp } from "react-icons/fi"

type TermItem = {
    title: string
    content: string
    id: string
}

export default function TermsAndConditions() {
    const termsData: TermItem[] = [
        {
            title: "Confirmation",
            content:
                "You will receive a booking confirmation within minutes. If you do not receive it, please contact our customer support via WhatsApp.",
            id: "confirmation",
        },
        {
            title: "Cancellation Policy",
            content:
                "Full refund available if cancelled at least 72 hours before the activity starts. No cancellations, refunds, or date changes allowed within 72 hours of the activity.",
            id: "cancellation",
        },
        {
            title: "Hotel Pick-Up Information",
            content:
                "Please arrive outside your hotel's main gate 5 minutes before your selected pick-up time. Provide your hotel name and address at the checkout page. Child seats are not available for this activity. Children must be accompanied by an adult at all times.",
            id: "pickup",
        },
        {
            title: "Prohibitions & Limitations",
            content:
                "This activity is not recommended for individuals with impaired physical mobility. This activity is not recommended for individuals with certain medical conditions such as high blood pressure, epilepsy, etc.",
            id: "limitations",
        },
        {
            title: "Accessibility",
            content: "This activity is not stroller-accessible and not wheelchair-accessible.",
            id: "accessibility",
        },
        {
            title: "Important Notes",
            content:
                "Entrance fees, food, and beverages are not included. Please bring sufficient cash. Weather conditions may affect the view; clear weather cannot be guaranteed. This tour is for sightseeing purposes only. Transport is only for tour participants. It is not a transfer service to other destinations. Luggage and backpacks are not permitted during or after the tour.",
            id: "notes",
        },
    ]

    const [searchTerm, setSearchTerm] = useState("")
    const [filteredTerms, setFilteredTerms] = useState(termsData)
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
    const [fromBooking, setFromBooking] = useState(false)

    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredTerms(termsData)
        } else {
            const results = termsData.filter(
                (term) =>
                    term.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    term.content.toLowerCase().includes(searchTerm.toLowerCase())
            )
            setFilteredTerms(results)
        }
    }, [searchTerm])

    const [fromTour, setFromTour] = useState(false)

    useEffect(() => {
        const state = window.history.state
        console.log("Navigated from booking page", state.fromBookingPage)
        if (state?.fromBookingPage) {
            setFromBooking(true)
        }
    }, [])

    const toggleItem = (id: string) => {
        setExpandedItems((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    const expandAll = () => {
        const allExpanded: Record<string, boolean> = {}
        termsData.forEach((term) => {
            allExpanded[term.id] = true
        })
        setExpandedItems(allExpanded)
    }

    const collapseAll = () => {
        setExpandedItems({})
    }

    return (
        <div className="min-h-screen bg-gray-50 font-poppins">
            {/* Hero Section */}
            <div className="bg-primary_green text-white py-16 px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms & Conditions</h1>
                <p className="text-xl max-w-2xl mx-auto">Important information about your booking with Oastel</p>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Search and Controls */}
                <div className="mb-8">
                    <div className="relative mb-4">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search terms..."
                            className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary_green focus:border-transparent"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                <FiX className="text-gray-400 hover:text-gray-600" />
                            </button>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={expandAll}
                            className="text-sm bg-primary_green text-white px-4 py-2 rounded hover:bg-primary_green/90 transition-colors"
                        >
                            Expand All
                        </button>
                        <button
                            onClick={collapseAll}
                            className="text-sm bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
                        >
                            Collapse All
                        </button>
                    </div>
                </div>

                {/* Terms List */}
                <div className="space-y-4">
                    {filteredTerms.length > 0 ? (
                        filteredTerms.map((term) => (
                            <div
                                key={term.id}
                                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
                            >
                                <button
                                    onClick={() => toggleItem(term.id)}
                                    className={`w-full flex items-center justify-between p-5 text-left ${
                                        expandedItems[term.id] ? "bg-primary_green/5" : ""
                                    }`}
                                >
                                    <h3 className="font-semibold text-lg text-title_black">{term.title}</h3>
                                    {expandedItems[term.id] ? (
                                        <FiChevronUp className="text-primary_green" />
                                    ) : (
                                        <FiChevronDown className="text-primary_green" />
                                    )}
                                </button>
                                <div
                                    className={`px-5 pb-5 transition-all duration-300 ease-in-out ${
                                        expandedItems[term.id] ? "block" : "hidden"
                                    }`}
                                >
                                    <div className="prose text-desc_gray">
                                        {term.content.split(". ").map((sentence, i) => (
                                            <p key={i} className="mb-3 last:mb-0">
                                                {sentence.trim()}
                                                {sentence.trim() ? "." : ""}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <h3 className="text-xl font-medium text-title_black mb-2">No terms found</h3>
                            <p className="text-desc_gray">Try a different search term</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}
