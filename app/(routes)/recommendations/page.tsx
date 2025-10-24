"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import { FaArrowRight, FaBus, FaMountain, FaBullseye } from "react-icons/fa";
import TourCard from "@/components/ui/TourCard";
import TransferCard from "@/components/ui/TransferCard";
import type { TourType, TransferType } from "@/lib/types";

export default function RecommendationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const [transfers, setTransfers] = useState<TransferType[]>([]);
  const [tours, setTours] = useState<TourType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setIsLoading(true);

      // Fetch transfers first (higher priority)
      const transfersResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/transfers?limit=4&featured=true`
      );
      if (transfersResponse.ok) {
        const transfersData = await transfersResponse.json();
        if (transfersData.success) {
          setTransfers(transfersData.data);
        }
      }

      // Fetch tours
      const toursResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tours?limit=4&featured=true`
      );
      if (toursResponse.ok) {
        const toursData = await toursResponse.json();
        if (toursData.success) {
          setTours(toursData.data);
        }
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      showToast({
        type: "error",
        title: "Error",
        message: "Failed to load recommendations",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewAll = (type: "tours" | "transfers") => {
    router.push(`/${type}`);
  };

  const handleGoHome = () => {
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary_green mx-auto mb-4"></div>
          <p className="text-gray-600">Loading recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Transfers Section - Higher Priority */}
        {transfers.length > 0 && (
          <section className="mb-16">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <FaBus className="text-primary_green flex-shrink-0" />
                  <span>Recommended Transfer Services</span>
                </h2>
                <p className="text-gray-600">
                  Comfortable and reliable transportation for your next journey
                </p>
              </div>
              <button
                onClick={() => handleViewAll("transfers")}
                className="text-primary_green font-semibold hover:text-green-700 transition-colors flex items-center gap-2 self-start sm:self-center"
              >
                View All Transfers
                <FaArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {transfers.slice(0, 4).map((transfer, index) => (
                <TransferCard
                  key={transfer._id}
                  _id={transfer._id}
                  slug={transfer.slug}
                  image={transfer.image}
                  title={transfer.title}
                  tags={transfer.tags}
                  desc={transfer.desc}
                  duration={transfer.duration}
                  bookedCount={transfer.bookedCount}
                  oldPrice={transfer.oldPrice}
                  newPrice={transfer.newPrice}
                  type={transfer.type}
                  vehicle={transfer.vehicle}
                  from={transfer.from}
                  to={transfer.to}
                  label={index === 0 ? "Recommended" : transfer.label}
                />
              ))}
            </div>
          </section>
        )}

        {/* Tours Section */}
        {tours.length > 0 && (
          <section className="mb-16">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <FaMountain className="text-primary_green flex-shrink-0" />
                  <span>Amazing Tour Packages</span>
                </h2>
                <p className="text-gray-600">
                  Discover breathtaking destinations and unforgettable
                  experiences
                </p>
              </div>
              <button
                onClick={() => handleViewAll("tours")}
                className="text-primary_green font-semibold hover:text-green-700 transition-colors flex items-center gap-2 self-start sm:self-center"
              >
                View All Tours
                <FaArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tours.slice(0, 4).map((tour) => (
                <TourCard
                  key={tour._id}
                  _id={tour._id}
                  slug={tour.slug}
                  image={tour.image}
                  title={tour.title}
                  tags={tour.tags}
                  description={tour.description}
                  duration={tour.duration}
                  bookedCount={tour.bookedCount}
                  oldPrice={tour.oldPrice}
                  newPrice={tour.newPrice}
                  type={tour.type}
                  label={tour.label}
                />
              ))}
            </div>
          </section>
        )}

        {/* No Recommendations Available */}
        {transfers.length === 0 && tours.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4 text-primary_green">
              <FaBullseye />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No recommendations available
            </h2>
            <p className="text-gray-600 mb-8">
              We're working on adding more amazing packages for you!
            </p>
            <button
              onClick={handleGoHome}
              className="px-6 py-3 bg-primary_green text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Back to Home
            </button>
          </div>
        )}

        {/* Bottom CTA Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Plan Your Next Adventure?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have made unforgettable
            memories with Oastel. Book now and experience the best Malaysia has
            to offer!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGoHome}
              className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Back to Home
            </button>
            <button
              onClick={() => router.push("/contact-us")}
              className="px-8 py-3 bg-primary_green text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
