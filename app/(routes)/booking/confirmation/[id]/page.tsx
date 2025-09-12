"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import {
  FaRegCalendarAlt as Calendar,
  FaRegClock as Clock,
  FaUsers as Users,
  FaRegEnvelope as Mail,
  FaPhone as Phone,
  FaMapMarkerAlt as MapPin,
} from "react-icons/fa";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import SessionHook from "@/hooks/SessionHook";

interface BookingDetails {
  _id: string;
  packageType: string;
  packageId: {
    _id: string;
    title: string;
    from?: string;
    to?: string;
    image?: string;
    type?: string;
    vehicle?: string;
    seatCapacity?: number;
    details?: {
      pickupGuidelines?: string;
    };
  };
  date: string;
  time: string;
  adults: number;
  children: number;
  pickupLocation: string;
  status: string;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  total: number;
  createdAt: string;
  // Vehicle properties for private transfers and tours
  isVehicleBooking?: boolean;
  vehicleSeatCapacity?: number;
  vehicleName?: string;
}

export default function BookingConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const bookingId = params.id as string;
  const confirmationRef = useRef<HTMLDivElement>(null);

  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { isAuthenticated } = SessionHook();

  const stripHtmlTags = (html: string): string => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const formatDate = (dateString?: string) => {
    try {
      if (!dateString) return "Invalid Date";
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return "Invalid Date";
      return d.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const downloadPDF = async () => {
    if (!confirmationRef.current || !booking) return;

    try {
      setIsGeneratingPDF(true);

      // A4 size in mm
      const pdfWidthMm = 210;
      const pdfHeightMm = 297;

      // Choose a baseline DPI for px/mm conversion. 96 is common in browsers.
      const dpi = 96;
      const pxPerMm = dpi / 25.4; // px per mm

      // Compute target pixel width for A4 at chosen DPI, minus small page padding
      const pagePaddingMm = 12; // mm
      const targetPxWidth = Math.round(
        (pdfWidthMm - pagePaddingMm * 2) * pxPerMm
      );

      // Create offscreen wrapper forced to A4 pixel width so html2canvas captures consistent layout
      const wrapper = document.createElement("div");
      wrapper.style.width = `${targetPxWidth}px`;
      wrapper.style.boxSizing = "border-box";
      wrapper.style.padding = "0";
      wrapper.style.background = "#ffffff";
      wrapper.style.fontFamily = "Poppins, Arial, Helvetica, sans-serif";
      wrapper.style.position = "fixed";
      wrapper.style.left = `0`;
      wrapper.style.top = `-99999px`;

      const clone = confirmationRef.current.cloneNode(true) as HTMLElement;
      // Ensure cloned content stretches to wrapper width
      clone.style.width = "100%";
      clone.style.boxSizing = "border-box";

      wrapper.appendChild(clone);
      document.body.appendChild(wrapper);

      // Compute scale so final canvas width maps cleanly to targetPxWidth at higher resolution
      // We'll request a canvas that is 2x device px to improve print quality
      const scale = 2;

      const canvas = await html2canvas(wrapper, {
        scale,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
      });

      // Cleanup
      document.body.removeChild(wrapper);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      // Convert canvas px to mm at our chosen dpi*scale
      const pxToMm = (px: number) => (px / (dpi * scale)) * 25.4;

      const imgWidthMm = pxToMm(canvas.width);
      const imgHeightMm = pxToMm(canvas.height);

      // Try to fit everything on a single page by scaling down if possible
      const maxImgWidthMm = pdfWidthMm - pagePaddingMm * 2;
      const fitScaleVert = pdfHeightMm / imgHeightMm;
      const fitScaleWidth = maxImgWidthMm / imgWidthMm;
      const fitScale = Math.min(fitScaleVert, fitScaleWidth, 1);
      const minAllowedScale = 0.6; // don't shrink below this to keep readability

      if (fitScale >= 1 || fitScale >= minAllowedScale) {
        // Create a scaled canvas to represent the whole page if scaling helps
        const scaleToUse = Math.min(fitScale, 1);
        const sCanvas = document.createElement("canvas");
        sCanvas.width = Math.round(canvas.width * scaleToUse);
        sCanvas.height = Math.round(canvas.height * scaleToUse);
        const sCtx = sCanvas.getContext("2d");
        if (!sCtx) throw new Error("Canvas context not available");
        sCtx.fillStyle = "#ffffff";
        sCtx.fillRect(0, 0, sCanvas.width, sCanvas.height);
        sCtx.drawImage(
          canvas,
          0,
          0,
          canvas.width,
          canvas.height,
          0,
          0,
          sCanvas.width,
          sCanvas.height
        );

        const pageImgData = sCanvas.toDataURL("image/png");
        const pageImgWidthMm = pxToMm(sCanvas.width);
        const pageImgHeightMm = pxToMm(sCanvas.height);
        const x = (pdfWidthMm - pageImgWidthMm) / 2;
        const y = (pdfHeightMm - pageImgHeightMm) / 2;
        pdf.addImage(pageImgData, "PNG", x, y, pageImgWidthMm, pageImgHeightMm);
        pdf.save(`booking-confirmation-${booking._id}.pdf`);
      } else {
        // Fallback: paginate into multiple pages as before
        const pages = Math.ceil(imgHeightMm / pdfHeightMm);

        for (let i = 0; i < pages; i++) {
          const sY = (i * pdfHeightMm * (dpi * scale)) / 25.4; // source y in px on canvas
          const pageCanvas = document.createElement("canvas");
          const pagePxWidth = canvas.width;
          const pagePxHeight = Math.min(
            canvas.height - sY,
            Math.round((pdfHeightMm * (dpi * scale)) / 25.4)
          );
          pageCanvas.width = pagePxWidth;
          pageCanvas.height = pagePxHeight;
          const ctx = pageCanvas.getContext("2d");
          if (!ctx) throw new Error("Canvas context not available");
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
          ctx.drawImage(
            canvas,
            0,
            sY,
            pageCanvas.width,
            pageCanvas.height,
            0,
            0,
            pageCanvas.width,
            pageCanvas.height
          );

          const pageImgData = pageCanvas.toDataURL("image/png");
          const pageImgHeightMm = pxToMm(pageCanvas.height);
          const pageImgWidthMm = pxToMm(pageCanvas.width);
          const x = (pdfWidthMm - pageImgWidthMm) / 2;
          const y = 0;

          pdf.addImage(
            pageImgData,
            "PNG",
            x,
            y,
            pageImgWidthMm,
            pageImgHeightMm
          );
          if (i < pages - 1) pdf.addPage();
        }

        pdf.save(`booking-confirmation-${booking._id}.pdf`);
      }

      showToast({
        type: "success",
        title: "PDF Downloaded",
        message: "Your booking confirmation has been downloaded successfully",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      showToast({
        type: "error",
        title: "Download Failed",
        message: "Failed to generate PDF. Please try again.",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${bookingId}`
        );
        const data = await response.json();

        if (data.success && data.data) {
          // Extract pickup guidelines from packageId details if available
          const bookingData = { ...data.data };
          if (bookingData.packageId?.details?.pickupGuidelines) {
            bookingData.pickupGuidelines =
              bookingData.packageId.details.pickupGuidelines;
          } else if (
            bookingData.packageType === "transfer" &&
            bookingData.packageId?.details?.pickupDescription
          ) {
            // Fallback for legacy transfers that use pickupDescription
            bookingData.pickupGuidelines =
              bookingData.packageId.details.pickupDescription;
          }
          setBooking(bookingData);
        } else {
          showToast({
            type: "error",
            title: "Error",
            message: data.error || "Booking not found",
          });
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching booking:", error);
        showToast({
          type: "error",
          title: "Error",
          message: "Failed to load booking details",
        });
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    if (bookingId && bookingId !== "undefined") {
      fetchBooking();
    } else {
      setIsLoading(false);
      showToast({
        type: "error",
        title: "Error",
        message: "Invalid booking ID",
      });
      router.push("/");
    }
  }, [bookingId, router, showToast]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary_green border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Booking Not Found
        </h1>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-2 bg-primary_green text-white rounded-lg hover:bg-green-700"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 font-poppins">
      <div className="bg-white rounded-lg shadow-lg p-8" ref={confirmationRef}>
        {/* Header */}
        <div className="text-center border-b pb-6 mb-6">
          <h1 className="text-3xl font-bold text-primary_green">
            Oastel Ticket Information
          </h1>
          <p className="text-gray-600 mt-2">
            Ticket ID: <span className="font-semibold">{booking._id}</span>
          </p>
          {/* package name moved into Booking Details section */}
        </div>

        {/* Confirmation Status */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-green-600">
            Booking Confirmed!
          </h2>
          <p className="text-gray-600">
            Thank you for choosing Oastel. Your booking is confirmed.
          </p>
        </div>

        {/* Booking Details */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Booking Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-2">
              <Calendar className="w-5 h-5 text-primary_green" />
              <p className="font-semibold">{formatDate(booking.date)}</p>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="w-5 h-5 text-primary_green" />
              <p className="font-semibold">{booking.time}</p>
            </div>
            <div className="flex items-start gap-2">
              <Users className="w-5 h-5 text-primary_green" />
              {booking.isVehicleBooking ||
              booking.packageId?.type === "private" ? (
                <p className="font-semibold">
                  Vehicle -{" "}
                  {booking.vehicleName || booking.packageId?.vehicle || "N/A"} (
                  {booking.vehicleSeatCapacity ||
                    booking.packageId?.seatCapacity ||
                    "N/A"}{" "}
                  seats)
                </p>
              ) : (
                <p className="font-semibold">
                  {booking.adults} Adults, {booking.children} Children
                </p>
              )}
            </div>
            {/* Package row added here so package name appears inside Booking Details */}
            {booking.packageId && (
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-primary_green" />
                <p className="font-semibold">
                  {booking.packageId.title || booking.packageType}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-2">
              <Users className="w-5 h-5 text-primary_green" />
              <p className="font-semibold">{booking.contactInfo.name}</p>
            </div>
            <div className="flex items-start gap-2">
              <Mail className="w-5 h-5 text-primary_green" />
              <p>{booking.contactInfo.email}</p>
            </div>
            <div className="flex items-start gap-2">
              <Phone className="w-5 h-5 text-primary_green" />
              <p>{booking.contactInfo.phone}</p>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-primary_green" />
              <p>{stripHtmlTags(booking.pickupLocation || "")}</p>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="bg-primary_green/10 rounded-lg p-6 mb-6 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold">Total Amount</h3>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary_green">
              RM {booking.total.toFixed(2)}
            </p>
            <p className="text-xs text-gray-600">Paid online</p>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-6">
          <h3 className="text-lg font-semibold mb-2">Important Information:</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>
              Be ready at your hotel’s main gate 5 minutes before pick-up.
            </li>
            <li>
              No child seats are available. Children must always be with an
              adult.
            </li>
            <li>Pick-up times and locations may vary for each booking.</li>
            <li>
              Cancellation Policy:
              <ul className="list-disc list-inside ml-5 text-gray-700 space-y-1 mt-1">
                <li>Cancel at least 72 hours in advance for a full refund.</li>
                <li>
                  No refund, cancellation, or date change within 72 hours.
                </li>
              </ul>
            </li>
            <li>
              Carry cash for entrance fees, as most entry points at the
              destination do not accept cards.
            </li>
            <li>
              {booking.packageType === "transfer"
                ? "Luggage upto 20kg is allowed per person."
                : "Luggage and large backpacks cannot be brought on the tour."}
            </li>
            <li>Views depend on the weather and cannot be guaranteed.</li>
          </ul>
        </div>

        {/* Pickup Guidelines */}
        {booking.packageId?.details?.pickupGuidelines && (
          <div className="bg-green-50 border-l-4 border-green-400 p-6 mb-6">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              Pickup Guidelines:
            </h3>
            <div
              className="prose max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: booking.packageId.details.pickupGuidelines,
              }}
            />
          </div>
        )}

        {/* Policies removed as requested */}
      </div>

      {/* Email Confirmation (outside PDF) */}
      <div className="text-center mt-8 text-gray-700">
        <p>
          Hi {booking.contactInfo.name},<br />
          Thank you for choosing Oastel for your booking. <br />
        </p>
      </div>

      {/* Buttons */}
      <div className="text-center space-y-4 mt-6">
        <button
          onClick={downloadPDF}
          disabled={isGeneratingPDF}
          className="px-6 py-2 mr-3 bg-primary_green text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-poppins"
        >
          {isGeneratingPDF ? "Generating PDF..." : "Download PDF"}
        </button>
        <button
          onClick={() => {
            // View bookings: profile for authenticated users, else browse relevant listing
            if (isAuthenticated) {
              router.push("/profile");
            } else if (booking.packageType === "tour") {
              router.push("/tours");
            } else {
              router.push("/transfers");
            }
          }}
          className="px-6 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-poppins"
        >
          View bookings
        </button>
      </div>
    </div>
  );
}
