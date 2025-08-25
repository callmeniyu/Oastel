"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Tag from "@/components/ui/Tag";
import TourCard from "@/components/ui/TourCard";
import TransferCard from "@/components/ui/TransferCard";
import FAQSection from "@/components/sections/FAQSection";
import GreenBtn from "@/components/ui/GreenBtn";
import Loader from "@/components/ui/Loader";
import { FaBookmark } from "react-icons/fa";
import { BsInfoCircleFill } from "react-icons/bs";
import { FaClock } from "react-icons/fa6";
import { RiRouteFill } from "react-icons/ri";
import { RiMapPinLine } from "react-icons/ri";
import { IoWarningOutline } from "react-icons/io5";
import { tourApi } from "@/lib/tourApi";
import { transferApi } from "@/lib/transferApi";
import { TourType } from "@/lib/types";
import { resolveImageUrl } from "@/lib/imageUtils";
import { formatBookedCount } from "@/lib/utils";

export default function TourDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [tourDetails, setTourDetails] = useState<TourType | null>(null);
  const [otherTours, setOtherTours] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTourData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch current tour by slug
        const currentTourResponse = await tourApi.getTourBySlug(slug);
        setTourDetails(currentTourResponse.data);

        // Fetch both tours and transfers for recommendations
        const [allToursResponse, allTransfersResponse] = await Promise.all([
          tourApi.getTours({ limit: 100 }),
          transferApi.getTransfers({ limit: 100 }),
        ]);

        // Separate tours and transfers, exclude current tour
        const availableTours = allToursResponse.data.filter(
          (tour) => tour.slug !== slug
        );
        const availableTransfers = allTransfersResponse.data;

        const shuffle = (arr: any[]) =>
          [...arr].sort(() => Math.random() - 0.5);

        const selectedTours = shuffle(availableTours).slice(0, 2);
        const selectedTransfers = shuffle(availableTransfers).slice(0, 2);

        // Interleave selections so UX shows mixed packages
        const combined: any[] = [];
        for (
          let i = 0;
          i < Math.max(selectedTours.length, selectedTransfers.length);
          i++
        ) {
          if (selectedTours[i]) combined.push(selectedTours[i]);
          if (selectedTransfers[i]) combined.push(selectedTransfers[i]);
        }

        setOtherTours(combined);
      } catch (err) {
        console.error("Error fetching tour data:", err);
        setError("Failed to load tour details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchTourData();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">{error}</h1>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary_green text-white rounded-lg hover:bg-green-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!tourDetails) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Tour not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-10 font-poppins">
      <div className="flex flex-col lg:flex-row gap-8 md:px-8 lg:px-16">
        <div className="flex-1 space-y-6">
          <Image
            src={resolveImageUrl(tourDetails.image)}
            alt={tourDetails.title}
            width={700}
            height={500}
            className="rounded-xl sm:w-full sm:h-[25rem] object-cover"
          />
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold sm:font-bold text-primary_green">
              {tourDetails.title}
            </h1>
            <p className="text-desc_gray mt-2">{tourDetails.description}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {tourDetails.tags.map((tag, i) => (
                <Tag key={i} tag={tag} />
              ))}
            </div>
          </div>

          {/* ✅ Booking Panel for small screens */}
          <div className="block lg:hidden bg-white border rounded-md p-4 shadow-sm mt-6">
            <div className="mb-4">
              <p className="text-lg text-gray-400 line-through">
                RM {tourDetails.oldPrice}
              </p>
              <h2 className="text-lg">
                <span className="text-3xl font-extrabold sm:font-bold">
                  RM {tourDetails.newPrice}
                </span>
                {tourDetails.type === "private" ? " / group" : " / person"}
              </h2>
              <div className="flex items-center gap-2">
                <FaBookmark className="text-primary_green inline-block mr-1" />
                <span className="font-semibold">
                  {formatBookedCount(tourDetails.bookedCount)} Booked
                </span>
              </div>
            </div>

            <GreenBtn
              text="Book Now"
              action={`/booking/tour/${tourDetails.slug}`}
            />
          </div>

          <div className="space-y-6 mt-6">
            <div className="bg-white border rounded-md p-4 shadow-sm">
              <div className="flex gap-2 items-center">
                <BsInfoCircleFill className="text-xl text-primary_green" />
                <h5 className="font-semibold text-primary_green">
                  About this tour
                </h5>
              </div>
              <div
                className="prose max-w-none text-sm text-desc_gray mt-2"
                dangerouslySetInnerHTML={{ __html: tourDetails.details.about }}
              />
            </div>

            <div className="bg-white border rounded-md p-4 shadow-sm">
              <div className="flex gap-2 items-center">
                <FaClock className="text-xl text-primary_green" />
                <h5 className="font-semibold text-primary_green">
                  Departure Times
                </h5>
              </div>
              <ul className="mt-2 space-y-1">
                {tourDetails.departureTimes.map((time, index) => (
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
              <div
                className="text-sm text-desc_gray leading-6 space-y-1"
                dangerouslySetInnerHTML={{
                  __html: tourDetails.details.itinerary,
                }}
              />
            </div>

            <div className="bg-white border rounded-md p-4 shadow-sm">
              <div className="flex gap-2 items-center mb-2">
                <div className="p-0.5 rounded-full bg-primary_green">
                  <RiMapPinLine className="text-lg text-white" />
                </div>
                <h5 className="font-semibold text-primary_green">
                  Pickup Location
                </h5>
              </div>
              <ul className="list-disc ml-5 text-sm text-desc_gray space-y-1">
                {tourDetails.details.pickupLocation && (
                  <li
                    dangerouslySetInnerHTML={{
                      __html: tourDetails.details.pickupLocation,
                    }}
                  />
                )}
              </ul>
            </div>

            <div className="bg-white border rounded-md p-4 shadow-sm">
              <div className="flex gap-2 items-center mb-2">
                <div className="p-1 rounded-full bg-primary_green">
                  <IoWarningOutline className="text-lg text-white" />
                </div>
                <h5 className="font-semibold text-primary_green">Note</h5>
              </div>
              {tourDetails.details.note && (
                <p
                  className="text-sm text-desc_gray space-y-1"
                  dangerouslySetInnerHTML={{ __html: tourDetails.details.note }}
                />
              )}
            </div>
          </div>
        </div>

        {/* ✅ Booking Panel for large screens */}
        <div className="w-full lg:w-80 shrink-0 hidden lg:block">
          <div className="bg-white border-2 border-primary_green rounded-xl shadow-lg p-6 flex flex-col gap-6">
            <div>
              <p className="text-lg text-gray-400 line-through mb-1">
                RM {tourDetails.oldPrice}
              </p>
              <h2 className="text-lg mb-2">
                <span className="text-4xl font-extrabold">
                  RM {tourDetails.newPrice}
                </span>{" "}
                <span className="text-base font-medium text-desc_gray">
                  {tourDetails.type === "private" ? " / group" : " / person"}
                </span>
              </h2>
              <div className="flex items-center gap-2 mb-2">
                <FaBookmark className="text-primary_green inline-block mr-1" />
                <span className="font-semibold text-desc_gray">
                  {formatBookedCount(tourDetails.bookedCount)} Booked
                </span>
              </div>
            </div>
            <GreenBtn
              text="Book Now"
              action={`/booking/tour/${tourDetails.slug}`}
              customStyles="w-full py-4 text-lg font-bold rounded-lg"
            />
          </div>
        </div>
      </div>

      <section>
        <FAQSection faqs={tourDetails.details.faq} />
      </section>

      <section className="bg-white border rounded-md px-6 py-10 shadow-sm flex flex-col md:flex-row gap-6 mx-4 md:mx-10">
        <div className="md:w-1/2">
          <h2 className="text-2xl md:text-3xl font-bold text-primary_green">
            Terms & Conditions
          </h2>
          <p className="text-sm text-desc_gray">
            We recommend you go through terms and cancellation policies before
            booking.
          </p>
        </div>
        {/* Divider */}
        <hr className="hidden md:block border border-gray-200 w-40 rotate-90 self-center" />
        <hr className="block md:hidden border border-gray-200 w-full" />
        <div className="flex justify-center md:w-1/2">
          <GreenBtn
            text="📄 See T&C"
            action={"/privacy-policy"}
            customStyles="w-32"
          />
        </div>
      </section>

      {/* Book Button */}
      <div className="text-center">
        <GreenBtn
          text="Book this tour"
          action={`/booking/tour/${tourDetails.slug}`}
          customStyles="w-72 py-5 text-xl font-medium "
        />
      </div>

      {/* Other Tours */}
      <section>
        <div className="flex items-center gap-2">
          <hr className="border-b-2 border-primary_green w-16 sm:w-40 md:flex" />
          <h2 className="text-2xl font-extrabold sm:font-bold text-primary_green mb-4 pt-2  min-w-max">
            Other Packages
          </h2>
          <hr className="border-b-2 border-primary_green  w-full  md:flex" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {otherTours.map((packageItem, i) =>
            // Render using explicit packageType if available
            packageItem.packageType === "transfer" ? (
              <TransferCard key={i} {...packageItem} />
            ) : (
              <TourCard key={i} {...packageItem} />
            )
          )}
        </div>
      </section>
    </div>
  );
}
