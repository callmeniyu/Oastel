"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  FiCalendar,
  FiClock,
  FiUser,
  FiMapPin,
  FiPrinter,
  FiCheckCircle,
  FiArrowLeft,
  FiFileText,
  FiLoader,
  FiDollarSign,
} from "react-icons/fi";
import { formatMalaysianDateForDisplay } from "@/lib/dateUtils";

type Booking = {
  _id: string;
  packageType: "tour" | "transfer";
  packageId: string;
  date: string;
  time: string;
  adults: number;
  children: number;
  pickupLocation: string;
  total: number;
  status: string;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  isAdminBooking?: boolean;
  paymentInfo?: {
    refundStatus?: "none" | "partial" | "full" | "refunded";
    refundAmount?: number;
    stripePaymentIntentId?: string;
    paymentIntentId?: string;
    updatedAt?: string;
  };
  packageDetails?: {
    title: string;
    image?: string;
    price: number;
  };
};

export default function CancellationReceiptPage() {
  const params = useParams();
  const id = params.id as string;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/search?bookingId=${id}&email=admin`
        );
        
        // Wait, since search is secure, we can also fetch directly from search but since admin might bypass or we can use our search endpoint.
        // Wait, how can we fetch this booking without knowing the user's email if they just got redirected?
        // Let's implement a clean query that bypasses email check or checks a special flag, or let's call the public getBookingById endpoint since that's public for confirmation pages too!
        // Let's check: GET /api/bookings/:id is defined in booking.routes.ts as:
        // router.get("/:id", BookingController.getBookingById);
        // Let's call that endpoint! It doesn't require email query param.
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${id}`);
        const result = await res.json();

        if (result.success && result.data) {
          setBooking(result.data);
        } else {
          setError(result.error || "Booking not found");
        }
      } catch (err) {
        console.error("Error fetching booking details:", err);
        setError("Failed to load receipt. Please check your network.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBooking();
    }
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-poppins">
        <FiLoader className="animate-spin text-4xl text-primary_green mb-4" />
        <p className="text-gray-600 text-lg font-medium">Generating Receipt...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-poppins">
        <div className="bg-white rounded-2xl p-8 max-w-md mx-auto shadow-sm border border-gray-100 text-center">
          <FiFileText className="text-5xl text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Receipt Error</h2>
          <p className="text-gray-600 mb-6">{error || "Unable to display cancellation details."}</p>
          <button
            onClick={() => (window.location.href = "/profile?tab=mybookings")}
            className="bg-primary_green text-white px-6 py-3 rounded-lg font-medium hover:bg-primary_green/90 transition-colors inline-flex items-center gap-2"
          >
            <FiArrowLeft /> Go to My Bookings
          </button>
        </div>
      </div>
    );
  }

  const packageName = booking.packageDetails?.title || `${booking.packageType} Package`;
  const paid = booking.total;
  const isRefunded = booking.paymentInfo?.refundStatus === "refunded";
  const refundAmount = booking.paymentInfo?.refundAmount || 0;
  const fee = isRefunded ? paid * 0.05 : paid;
  const stripeId = booking.paymentInfo?.stripePaymentIntentId || booking.paymentInfo?.paymentIntentId || "N/A";

  const dateStr = formatMalaysianDateForDisplay(new Date(booking.date), {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 font-poppins print:bg-white print:py-0">
      <style jsx global>{`
        @media print {
          nav, footer, header {
            display: none !important;
          }
          body {
            background-color: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          .print-full {
            width: 100% !important;
            max-width: 100% !important;
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      `}</style>

      <div className="max-w-2xl mx-auto print-full">
        {/* Navigation & Print controls */}
        <div className="flex justify-between items-center mb-6 no-print">
          <button
            onClick={() => (window.location.href = "/profile?tab=mybookings")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            <FiArrowLeft /> Back to My Bookings
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-primary_green text-white px-4 py-2 rounded-lg font-medium hover:bg-primary_green/90 transition-colors shadow-sm"
          >
            <FiPrinter /> Print / Save PDF
          </button>
        </div>

        {/* Receipt Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden print-full">
          {/* Top Banner Status */}
          <div className="bg-red-600 text-white p-8 text-center relative">
            <div className="absolute top-4 right-4 bg-red-700/50 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              System Stamp
            </div>
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheckCircle className="text-3xl text-white" />
            </div>
            <h1 className="text-2xl font-bold uppercase tracking-wide">Cancellation Receipt</h1>
            <p className="text-red-100 mt-2 font-medium">Booking ID: #{booking._id}</p>
          </div>

          {/* Details */}
          <div className="p-8">
            {/* Stamp Section */}
            <div className="flex justify-between border-b border-gray-100 pb-6 mb-6">
              <div>
                <h3 className="text-sm font-semibold uppercase text-gray-400 tracking-wider">Customer Details</h3>
                <p className="font-bold text-gray-900 mt-1">{booking.contactInfo.name}</p>
                <p className="text-sm text-gray-500">{booking.contactInfo.email}</p>
                <p className="text-sm text-gray-500">{booking.contactInfo.phone}</p>
              </div>
              <div className="text-right">
                <h3 className="text-sm font-semibold uppercase text-gray-400 tracking-wider">Date Cancelled</h3>
                <p className="font-bold text-gray-900 mt-1">
                  {booking.paymentInfo?.updatedAt 
                    ? formatMalaysianDateForDisplay(new Date(booking.paymentInfo.updatedAt)) 
                    : formatMalaysianDateForDisplay(new Date())}
                </p>
                <p className="text-sm text-red-600 font-bold uppercase mt-1">Status: Cancelled</p>
              </div>
            </div>

            {/* Booking Specifics */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold uppercase text-gray-400 tracking-wider mb-3">Service Cancelled</h3>
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <h4 className="font-bold text-gray-900 text-lg mb-4">{packageName}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <FiCalendar className="text-primary_green flex-shrink-0" />
                    <span>{dateStr}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiClock className="text-primary_green flex-shrink-0" />
                    <span>{booking.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiUser className="text-primary_green flex-shrink-0" />
                    <span>
                      {booking.adults} Adult{booking.adults > 1 ? "s" : ""}
                      {booking.children > 0 && `, ${booking.children} Child${booking.children > 1 ? "ren" : ""}`}
                    </span>
                  </div>
                  {booking.pickupLocation && (
                    <div className="flex items-center gap-2">
                      <FiMapPin className="text-primary_green flex-shrink-0" />
                      <span className="truncate">{booking.pickupLocation}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Refund Math Table */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold uppercase text-gray-400 tracking-wider mb-3">Financial Details</h3>
              <div className="border border-gray-100 rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 text-xs font-bold uppercase border-b border-gray-100">
                      <th className="p-4">Description</th>
                      <th className="p-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-gray-700">
                    <tr className="border-b border-gray-100">
                      <td className="p-4 font-medium">Original Booking Cost</td>
                      <td className="p-4 text-right font-semibold">RM {paid.toFixed(2)}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-4 font-medium text-red-600">
                        {isRefunded ? "Processing & Administrative Fee (5%)" : "Cancellation Fee (100% - Non-Refundable)"}
                      </td>
                      <td className="p-4 text-right text-red-600 font-semibold">- RM {fee.toFixed(2)}</td>
                    </tr>
                    <tr className="bg-green-50/50">
                      <td className="p-4 font-bold text-gray-900">Total Refund Initiated</td>
                      <td className="p-4 text-right font-extrabold text-primary_green text-lg">
                        RM {refundAmount.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment Audit */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold uppercase text-gray-400 tracking-wider mb-3">Audit Information</h3>
              <div className="text-xs space-y-2 text-gray-500">
                {booking.isAdminBooking ? (
                  <>
                    <p><strong>Payment Gateway:</strong> office booking</p>
                    <p><strong>Stripe Payment Intent ID:</strong> <code>office booking</code></p>
                    <p><strong>Refund Destination:</strong> office booking</p>
                  </>
                ) : (
                  <>
                    <p><strong>Payment Gateway:</strong> Stripe Payments</p>
                    <p><strong>Stripe Payment Intent ID:</strong> <code>{stripeId}</code></p>
                    <p><strong>Refund Destination:</strong> Original payment card / account</p>
                  </>
                )}
              </div>
            </div>

            {/* Policy Notes */}
            {booking.isAdminBooking ? (
              <div className="bg-red-50 border border-red-100 p-5 rounded-2xl text-red-800 text-xs leading-relaxed">
                <p className="font-semibold flex items-center gap-1.5 mb-1.5">
                  <FiDollarSign className="text-sm" /> Policy Note:
                </p>
                <p className="font-medium">
                  This booking is done by admin at the office, no refund would be made, collect cash from the office.
                </p>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-100 p-5 rounded-2xl text-amber-800 text-xs leading-relaxed">
                <p className="font-semibold flex items-center gap-1.5 mb-1.5">
                  <FiDollarSign className="text-sm" /> Refund Processing Note:
                </p>
                <p>
                  The refund was submitted successfully to Stripe. It may take <strong>5 to 10 business days</strong> for the funds to reflect on your account, depending on your card issuer or banking institution.
                </p>
              </div>
            )}
          </div>

          {/* Footer Receipt Notice */}
          <div className="bg-gray-50 p-6 border-t border-gray-100 text-center text-xs text-gray-400">
            <p>Thank you for traveling with Oastel.</p>
            <p className="mt-1">For support, email us at oastel.com@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
