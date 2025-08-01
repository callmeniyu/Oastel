import Image from "next/image";
import Tag from "@/components/ui/Tag";
import TourCard from "@/components/ui/TourCard";
import TransferCard from "@/components/ui/TransferCard";
import FAQSection from "@/components/sections/FAQSection";
import GreenBtn from "@/components/ui/GreenBtn";
import { FaBookmark } from "react-icons/fa";
import { BsInfoCircleFill } from "react-icons/bs";
import { FaClock } from "react-icons/fa6";
import { RiRouteFill } from "react-icons/ri";
import { RiMapPinLine } from "react-icons/ri";
import { IoWarningOutline } from "react-icons/io5";
import { transferApi } from "@/lib/transferApi";
import { tourApi } from "@/lib/tourApi";
import { FaBus, FaWalking } from "react-icons/fa";

type TransferDetailPageProps = {
  params: { slug: string };
};

export default async function TransferDetailPage({
  params,
}: TransferDetailPageProps) {
  const { slug } = params;
  let transferDetails = null;
  try {
    const response = await transferApi.getTransferBySlug(slug);
    transferDetails = response.data;
  } catch (error) {
    console.error("Error fetching transfer by slug:", error);
  }

  // Get other packages (both transfers and tours)
  let otherPackages: any[] = [];
  try {
    const [transfersResponse, toursResponse] = await Promise.all([
      transferApi.getTransfers({ limit: 100 }),
      tourApi.getTours({ limit: 100 }),
    ]);

    if (transfersResponse.success && toursResponse.success) {
      // Combine transfers and tours, excluding current transfer
      const allPackages = [
        ...transfersResponse.data.filter((transfer) => transfer.slug !== slug),
        ...toursResponse.data,
      ];

      // Shuffle and take 4 packages
      const shuffledPackages = allPackages.sort(() => Math.random() - 0.5);
      otherPackages = shuffledPackages.slice(0, 4);
    }
  } catch (error) {
    console.error("Error fetching other packages:", error);
  }

  if (!transferDetails) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-red-600">transfer not found</h1>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-10 font-poppins">
      <div className="flex flex-col lg:flex-row gap-8 md:px-8 lg:px-16">
        <div className="flex-1 space-y-6">
          <Image
            src={transferDetails.image}
            alt={transferDetails.title}
            width={700}
            height={500}
            className="rounded-xl sm:w-full sm:h-[25rem] object-cover"
          />
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold sm:font-bold text-primary_green">
              {transferDetails.title}
            </h1>
            <p className="text-desc_gray mt-2">{transferDetails.desc}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {transferDetails.tags.map((tag, i) => (
                <Tag key={i} tag={tag} />
              ))}
            </div>
          </div>

          {/* ✅ Booking Panel for small screens */}
          <div className="block lg:hidden bg-white border rounded-md p-4 shadow-sm mt-6">
            <div className="mb-4">
              <p className="text-lg text-gray-400 line-through">
                RM {transferDetails.oldPrice}
              </p>
              <h2 className="text-3xl font-extrabold sm:font-bold">
                RM {transferDetails.newPrice}
                <span className="">/person</span>
              </h2>
              <div className="flex items-center gap-2">
                <FaBookmark className="text-primary_green inline-block mr-1" />
                <span className="font-semibold">
                  {transferDetails.bookedCount} Booked
                </span>
              </div>
            </div>
            <GreenBtn
              text="Book Now"
              action={`/booking/transfer/${transferDetails.slug}`}
              customStyles=""
            />
          </div>

          <div className="space-y-6 mt-6">
            <div className="bg-white border rounded-md p-4 shadow-sm">
              <div className="flex gap-2 items-center">
                <div className="p-1 rounded-full bg-primary_green">
                  <FaBus className="text-sm text-white" />
                </div>
                <h5 className="font-semibold text-primary_green">From</h5>
              </div>
              <ul className="list-disc ml-5 text-sm text-desc_gray space-y-1 mt-2">
                <p>{transferDetails.from}</p>
              </ul>
            </div>
            <div className="bg-white border rounded-md p-4 shadow-sm">
              <div className="flex gap-2 items-center">
                <div className="p-1 rounded-full bg-primary_green">
                  <FaWalking className="text-md text-white" />
                </div>
                <h5 className="font-semibold text-primary_green">To</h5>
              </div>
              <ul className="list-disc ml-5 text-sm text-desc_gray space-y-1 mt-2">
                <p>{transferDetails.to}</p>
              </ul>
            </div>
            <div className="bg-white border rounded-md p-4 shadow-sm">
              <div className="flex gap-2 items-center">
                <BsInfoCircleFill className="text-xl text-primary_green" />
                <h5 className="font-semibold text-primary_green">
                  About this transfer
                </h5>
              </div>
              <div
                className="prose max-w-none text-sm text-desc_gray mt-2"
                dangerouslySetInnerHTML={{
                  __html: transferDetails.details.about,
                }}
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
                {transferDetails.times.map((time, index) => (
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
                className="prose max-w-none text-sm text-desc_gray mt-2"
                dangerouslySetInnerHTML={{
                  __html: transferDetails.details.itinerary,
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
              <div
                className="prose max-w-none text-sm text-desc_gray mt-2"
                dangerouslySetInnerHTML={{
                  __html: transferDetails.details.pickupLocations,
                }}
              />
            </div>

            <div className="bg-white border rounded-md p-4 shadow-sm">
              <div className="flex gap-2 items-center mb-2">
                <div className="p-1 rounded-full bg-primary_green">
                  <IoWarningOutline className="text-lg text-white" />
                </div>
                <h5 className="font-semibold text-primary_green">Note</h5>
              </div>
              <div
                className="prose max-w-none text-sm text-desc_gray mt-2"
                dangerouslySetInnerHTML={{
                  __html:
                    transferDetails.details.note ||
                    "No additional notes provided.",
                }}
              />
            </div>
          </div>
        </div>

        {/* ✅ Booking Panel for large screens */}
        <div className="w-full lg:w-80 shrink-0 hidden lg:block">
          <div className="mb-6">
            <p className="text-lg text-gray-400 line-through">
              RM {transferDetails.oldPrice}
            </p>
            <h2 className="text-lg">
              <h2 className="text-3xl font-bold">
                RM {transferDetails.newPrice} <span>/person</span>
              </h2>
            </h2>
            <div className="flex items-center gap-2">
              <FaBookmark className="text-primary_green inline-block mr-1" />
              <span className="font-semibold">
                {transferDetails.bookedCount} Booked
              </span>
            </div>
          </div>
          <GreenBtn
            text="Book Now"
            action={`/booking/transfer/${transferDetails.slug}`}
            customStyles=""
          />
        </div>
      </div>

      <section>
        <FAQSection faqs={transferDetails.details.faq} />
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
          text="Book this transfer"
          action={`/booking/transfer/${transferDetails.slug}`}
        />
      </div>

      {/* Other Packages */}
      <section>
        <div className="flex items-center gap-2">
          <hr className="border-b-2 border-primary_green w-16 sm:w-40 md:flex" />
          <h2 className="text-2xl font-extrabold sm:font-bold text-primary_green mb-4 pt-2  min-w-max">
            Other Tours/Transfers
          </h2>
          <hr className="border-b-2 border-primary_green  w-full  md:flex" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {otherPackages.map((pkg, i) => {
            // Check if the package has tourPackage array - then it's a tour
            if (pkg.tourPackage && pkg.tourPackage.length > 0) {
              return <TourCard key={`tour-${i}`} {...pkg} />;
            } else {
              // Otherwise it's a transfer
              return <TransferCard key={`transfer-${i}`} {...pkg} />;
            }
          })}
        </div>
      </section>
    </div>
  );
}
