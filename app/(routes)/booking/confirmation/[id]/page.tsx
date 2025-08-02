"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface BookingDetails {
  _id: string;
  packageType: string;
  packageId: string;
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
      const pdf = new jsPDF();

      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

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
        console.log("Fetching booking with ID:", bookingId); // Debug log
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${bookingId}`
        );
        const data = await response.json();

        console.log("Booking API response:", data); // Debug log

        if (data.success && data.data) {
          setBooking(data.data);
        } else if (data.error) {
          console.error("Booking API error:", data.error);
          showToast({
            type: "error",
            title: "Error",
            message: data.error || "Booking not found",
          });
          router.push("/");
        } else {
          console.error("Unexpected API response format:", data);
          showToast({
            type: "error",
            title: "Error",
            message: "Failed to load booking details",
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
      console.error("Invalid booking ID:", bookingId);
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
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white rounded-lg shadow-lg p-8" ref={confirmationRef}>
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
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-gray-600">
            Your booking has been successfully created
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Booking ID</p>
                <p className="font-semibold">{booking._id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Package Type</p>
                <p className="font-semibold capitalize">
                  {booking.packageType}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-semibold">
                  {new Date(booking.date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Time</p>
                <p className="font-semibold">{booking.time}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Guests</p>
                <p className="font-semibold">
                  {booking.adults} Adults, {booking.children} Children
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-semibold capitalize">{booking.status}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold">{booking.contactInfo.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold">{booking.contactInfo.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-semibold">{booking.contactInfo.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Pickup Location</p>
                <p className="font-semibold">{booking.pickupLocation}</p>
              </div>
            </div>
          </div>

          <div className="bg-primary_green/10 rounded-lg p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Total Amount</h2>
              <p className="text-2xl font-bold text-primary_green">
                RM {booking.total}
              </p>
            </div>
          </div>

          <div className="text-center space-y-4">
            <p className="text-gray-600">
              A confirmation email has been sent to {booking.contactInfo.email}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={downloadPDF}
                disabled={isGeneratingPDF}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGeneratingPDF ? "Generating PDF..." : "Download PDF"}
              </button>
              <button
                onClick={() => router.push("/profile?tab=mybookings")}
                className="px-6 py-2 bg-primary_green text-white rounded-lg hover:bg-green-700"
              >
                View My Bookings
              </button>
              <button
                onClick={() => router.push("/tours")}
                className="px-6 py-2 border border-primary_green text-primary_green rounded-lg hover:bg-primary_green hover:text-white"
              >
                Browse More Tours
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
