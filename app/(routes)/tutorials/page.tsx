"use client";
import { useState } from "react";
import Link from "next/link";
import { FiSearch, FiTv, FiHelpCircle, FiArrowLeft, FiPlay, FiBookOpen } from "react-icons/fi";

type TutorialVideo = {
  id: string;
  title: string;
  description: string;
  videoId: string;
  category: "cancellation" | "guest-access";
  duration: string;
};

export default function Tutorials() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const tutorials: TutorialVideo[] = [
    {
      id: "cancel-booking",
      title: "How to Cancel a Booking",
      description: "Learn the step-by-step process of cancelling your upcoming tour or transfer booking directly from your account page.",
      videoId: "juz8do_zQYY",
      category: "cancellation",
      duration: "0:56 min",
    },
    {
      id: "guest-booking-cancellation",
      title: "Finding Guest Bookings",
      description: "Can't find your guest booking for cancellation? Learn how to retrieve it using your Booking ID and Email address.",
      videoId: "ImznYIPTuhY",
      category: "guest-access",
      duration: "0:52 min",
    },
  ];

  const filteredTutorials = tutorials.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50/50 font-poppins pb-16">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-primary_green to-emerald-800 text-white py-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 text-sm bg-white/10 px-3 py-1.5 rounded-full transition-colors"
          >
            <FiArrowLeft size={16} />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Video Tutorials
          </h1>
          <p className="text-lg md:text-xl text-white/90 font-light max-w-2xl mx-auto leading-relaxed">
            Need help with your booking? Watch our quick step-by-step video guides to manage, find, or cancel your trips.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-20">
        {/* Search and Filters Bar */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-100/50 border border-gray-100 p-4 md:p-6 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex gap-2 border-b border-gray-100 md:border-b-0 pb-3 md:pb-0 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === "all"
                  ? "bg-primary_green text-white"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              All Guides
            </button>
            <button
              onClick={() => setSelectedCategory("cancellation")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === "cancellation"
                  ? "bg-primary_green text-white"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              Cancellation & Refunds
            </button>
            <button
              onClick={() => setSelectedCategory("guest-access")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === "guest-access"
                  ? "bg-primary_green text-white"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              Guest Booking Help
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tutorials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary_green/50 focus:bg-white text-sm transition-all"
            />
          </div>
        </div>

        {/* Video Grid */}
        {filteredTutorials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {filteredTutorials.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 p-6 flex flex-col items-center"
              >
                {/* Vertical Aspect Video Frame (9:16) */}
                <div className="w-full max-w-[280px] sm:max-w-[315px] aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-inner border border-gray-200 relative mb-6">
                  <iframe
                    src={`https://www.youtube.com/embed/${item.videoId}?rel=0&modestbranding=1`}
                    title={item.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0 absolute inset-0"
                  />
                </div>

                {/* Details */}
                <div className="w-full text-center md:text-left flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                      <span className="bg-green-50 text-primary_green text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                        {item.category === "cancellation" ? "Cancellation" : "Guest Access"}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <FiTv size={12} />
                        {item.duration}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-6 flex justify-center md:justify-start">
                    <a
                      href={`https://youtube.com/shorts/${item.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-semibold text-primary_green hover:underline"
                    >
                      <FiPlay size={14} />
                      Watch on YouTube
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <FiHelpCircle size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-1">No tutorials found</h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto">
              We couldn't find any videos matching your search criteria. Try using different keywords.
            </p>
          </div>
        )}

        {/* Additional Help Section */}
        <div className="mt-16 bg-gradient-to-br from-green-50 to-emerald-50/50 rounded-3xl p-8 border border-green-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4 text-center md:text-left">
            <div className="p-3 bg-white rounded-2xl shadow-sm text-primary_green hidden md:block">
              <FiBookOpen size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                Still have questions?
              </h3>
              <p className="text-sm text-gray-600 max-w-lg">
                Read our detailed terms of booking and cancellation, or contact our customer support for manual assistance.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              href="/terms-and-conditions"
              className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 text-center font-semibold rounded-xl border border-gray-200 transition-colors text-sm whitespace-nowrap"
            >
              Terms & Conditions
            </Link>
            <Link
              href="/contact-us"
              className="px-6 py-3 bg-primary_green hover:bg-primary_green/90 text-white text-center font-semibold rounded-xl transition-colors text-sm whitespace-nowrap"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
