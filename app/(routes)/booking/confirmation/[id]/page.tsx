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

      const canvas = await html2canvas(confirmationRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = 295; // A4 height in mm

      const imgProps = {
        width: pdfWidth,
        height: (canvas.height * pdfWidth) / canvas.width,
      };

      if (imgProps.height > pdfHeight) {
        imgProps.width = (canvas.width * pdfHeight) / canvas.height;
        imgProps.height = pdfHeight;
      }

      const x = (pdfWidth - imgProps.width) / 2;
      const y = (pdfHeight - imgProps.height) / 2;

      pdf.addImage(imgData, "PNG", x, y, imgProps.width, imgProps.height);

      pdf.save(`booking-confirmation-${booking._id}.pdf`);

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
          setBooking(data.data);
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
              <p className="font-semibold">
                {booking.adults} Adults, {booking.children} Children
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <div className="bg-primary_green/10 rounded-lg p-6 mb-6 flex justify-between">
          <h3 className="text-xl font-semibold">Total Amount</h3>
          <p className="text-2xl font-bold text-primary_green">
            RM {booking.total.toFixed(2)}
          </p>
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-6">
          <h3 className="text-lg font-semibold mb-2">Important Information:</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Please arrive 15 minutes before each scheduled time</li>
            <li>
              Bring a valid ID and this confirmation email for each booking
            </li>
            <li>Each booking may have different pickup locations and times</li>
            <li>For any changes, contact us at least 24 hours in advance</li>
            <li>Weather conditions may affect outdoor activities</li>
          </ul>
        </div>

        {/* Policies */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Key Policies</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Full refund if cancelled at least 72 hours before activity.</li>
            <li>No refunds or date changes within 72 hours of activity.</li>
            <li>
              Pick-up only from Tanah Rata, Golden Hill, Brinchang, and Kea
              Farm.
            </li>
            <li>
              Not wheelchair/stroller accessible; not recommended for certain
              medical conditions.
            </li>
          </ul>
        </div>
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
