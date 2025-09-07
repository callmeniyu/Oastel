"use client";
import { useState, useEffect } from "react";
import { FAQType } from "@/lib/types";
import { FiChevronDown, FiChevronUp, FiSearch, FiX } from "react-icons/fi";

// FAQ Data
const allFaqs: FAQType[] = [
  // Stay FAQ
  {
    id: 1,
    question: "What types of accommodations does Oastel offer?",
    answer:
      "Oastel offers a range of budget-friendly stays designed with a co-living concept. It is ideal for backpackers and travelers looking for affordable, comfortable, and social accommodation.",
    category: "Stay",
  },
  {
    id: 2,
    question: "Are the stays suitable for families with children?",
    answer:
      "No. Oastel is designed for backpackers, couples, and solo travelers, and is not suitable for children.",
    category: "Stay",
  },
  {
    id: 3,
    question: "Can I choose my preferred room type while booking?",
    answer:
      "Yes. We offer two room types: rooms with a private bathroom and rooms with a shared bathroom. You can select your preferred option when booking.",
    category: "Stay",
  },
  {
    id: 4,
    question: "Is breakfast included with the stay?",
    answer:
      "No, breakfast is not included. However, there are many breakfast spots within 500 meters of Oastel.",
    category: "Stay",
  },
  {
    id: 5,
    question: "Are pets allowed at Oastel?",
    answer: "No, pets are not allowed.",
    category: "Stay",
  },
  {
    id: 6,
    question: "What are the check-in and check-out times?",
    answer: "Check-in is from 2:00 PM and check-out is by 12:00 PM.",
    category: "Stay",
  },
  {
    id: 7,
    question:
      "Can I store my luggage at Oastel after check-out while waiting for my bus?",
    answer:
      "Yes. You can leave your luggage at the lobby and relax in our common space until your bus departure.",
    category: "Stay",
  },
  {
    id: 8,
    question: "How do I get from the bus terminal to Oastel?",
    answer:
      "Oastel is about 500–800 meters from the bus terminal, which is within walking distance. Taxis are also available if you prefer not to walk.",
    category: "Stay",
  },
  // Transfers FAQ
  {
    id: 9,
    question: "What transportation options are available?",
    answer: "Oastel offers both private transfers and daily shuttle services.",
    category: "Transfers",
  },
  {
    id: 10,
    question: "How do I book a shuttle transfer?",
    answer:
      "You can book directly through our website by selecting your travel date, route, and number of passengers.",
    category: "Transfers",
  },
  {
    id: 11,
    question: "Can I request a custom pick-up or drop-off point?",
    answer:
      "Pick-up and drop-off points are listed in each package description. Please check the details when booking.",
    category: "Transfers",
  },
  {
    id: 12,
    question: "Do your vehicles have air conditioning?",
    answer: "Yes, all our vehicles are air-conditioned.",
    category: "Transfers",
  },
  {
    id: 13,
    question: "What happens if I miss my van departure?",
    answer:
      "If you are late and miss your van, your booking will be canceled. A new booking can be made depending on availability, but refunds are not provided.",
    category: "Transfers",
  },
  {
    id: 14,
    question: "Can I bring luggage on the land transfer?",
    answer:
      "Yes. Each passenger may bring up to 20 kg of checked luggage plus one 7 kg carry-on bag on both shuttle vans and private transfers.",
    category: "Transfers",
  },
  {
    id: 15,
    question: "Are child seats available?",
    answer:
      "No, child seats are not available. Parents must seat children on their lap during the transfer.",
    category: "Transfers",
  },
];

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFaqs, setFilteredFaqs] = useState<FAQType[]>(allFaqs);
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Get unique categories
  const categories = [...new Set(allFaqs.map((faq) => faq.category))];

  // Filter FAQs based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredFaqs(allFaqs);
    } else {
      const results = allFaqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFaqs(results);
    }
  }, [searchTerm]);

  const handleApply = () => {
    // Already handled in useEffect
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const toggleCategory = (category: string) => {
    setActiveCategory(activeCategory === category ? null : category);
  };

  return (
    <div className="min-h-screen bg-white font-poppins">
      {/* Hero Section */}
      <div className="relative h-64 bg-primary_green flex items-center justify-center">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <div className="relative z-20 text-center px-4">
          <h1 className="text-4xl font-bold text-white mb-4">FAQs</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Find answers to common questions about Oastel
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Search Bar */}
        <div className="mb-12">
          <SearchInput
            customeStyles="w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onSearch={handleApply}
            onClear={handleClearSearch}
          />
          {searchTerm && (
            <p className="mt-2 text-desc_gray">
              Showing {filteredFaqs.length} result
              {filteredFaqs.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* Categories */}
        <div className="space-y-12">
          {categories.map((category) => {
            const categoryFaqs = filteredFaqs.filter(
              (faq) => faq.category === category
            );
            if (categoryFaqs.length === 0) return null;

            return (
              <div key={category} className="border-b border-gray-100 pb-8">
                <button
                  onClick={() => toggleCategory(category ?? "")}
                  className="flex items-center justify-between w-full mb-6 transition-colors duration-200 hover:text-primary_green/80"
                >
                  <h2 className="text-2xl font-bold text-primary_green">
                    {category}
                  </h2>
                  <div className="transition-transform duration-200">
                    {activeCategory === category ? (
                      <FiChevronUp className="text-primary_green text-xl" />
                    ) : (
                      <FiChevronDown className="text-primary_green text-xl" />
                    )}
                  </div>
                </button>

                <div
                  className={`space-y-4 overflow-hidden transition-all duration-300 ease-in-out ${
                    activeCategory !== null && activeCategory !== category
                      ? "max-h-0 opacity-0"
                      : "max-h-[2000px] opacity-100"
                  }`}
                >
                  {categoryFaqs.map((faq, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleAccordion(index)}
                        className="flex items-center justify-between w-full p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <h3 className="font-medium text-title_black">
                          {faq.question}
                        </h3>
                        <div className="transition-transform duration-200">
                          {activeAccordion === index ? (
                            <FiChevronUp className="text-primary_green" />
                          ) : (
                            <FiChevronDown className="text-primary_green" />
                          )}
                        </div>
                      </button>
                      <div
                        className={`bg-white overflow-hidden transition-all duration-300 ease-in-out ${
                          activeAccordion === index
                            ? "max-h-96 opacity-100 border-t border-gray-200"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="p-4">
                          <p className="text-desc_gray">{faq.answer}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredFaqs.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-title_black mb-2">
              No results found
            </h3>
            <p className="text-desc_gray">
              Try a different search term or browse our categories
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Search Input Component
function SearchInput({
  customeStyles,
  value,
  onChange,
  onSearch,
  onClear,
}: {
  customeStyles: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  onClear: () => void;
}) {
  return (
    <div className={`relative ${customeStyles}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FiSearch className="text-gray-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Search FAQs..."
        className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary_green focus:border-transparent"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <FiX className="text-gray-400 hover:text-gray-600" />
        </button>
      )}
    </div>
  );
}
