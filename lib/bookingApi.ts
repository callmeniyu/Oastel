import { apiCache } from "./cache";

export interface BookingDetails {
  id: string;
  packageType: "tour" | "transfer";
  packageId: string;
  date: string;
  time: string;
  adults: number;
  children: number;
  pickupLocation: string;
  status: "pending" | "confirmed" | "cancelled";
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    whatsapp?: string;
  };
  subtotal: number;
  total: number;
  paymentInfo: {
    amount: number;
    bankCharge: number;
    currency: string;
    paymentStatus: string;
  };
  packageDetails?: {
    title: string;
    image: string;
    slug: string;
    price: number;
    duration?: string;
    vehicle?: string;
  };
}

export const bookingApi = {
  // Get bookings for a specific user (by email)
  async getBookings(userEmail: string): Promise<BookingDetails[]> {
    const cacheKey = `user-bookings-${userEmail}`;
    const cached = apiCache.get(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(
        `/api/bookings?userId=${encodeURIComponent(userEmail)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const bookings = data.bookings || [];
      
      apiCache.set(cacheKey, bookings);
      return bookings;
    } catch (error) {
      console.error("Error fetching bookings:", error);
      return [];
    }
  },

  // Get bookings with package details populated
  async getBookingsWithDetails(userEmail: string): Promise<BookingDetails[]> {
    const cacheKey = `user-bookings-details-${userEmail}`;
    const cached = apiCache.get(cacheKey);
    if (cached) return cached;

    try {
      const bookings = await this.getBookings(userEmail);
      
      // Fetch package details for each booking
      const bookingsWithDetails = await Promise.all(
        bookings.map(async (booking: any) => {
          try {
            let packageDetails = null;
            
            if (booking.packageType === 'tour') {
              const tourResponse = await fetch(`/api/tours/${booking.packageId}`);
              if (tourResponse.ok) {
                const tourData = await tourResponse.json();
                packageDetails = {
                  title: tourData.tour.title,
                  image: tourData.tour.images?.[0] || '/images/default-tour.jpg',
                  slug: tourData.tour.slug,
                  price: tourData.tour.price,
                  duration: tourData.tour.duration,
                };
              }
            } else if (booking.packageType === 'transfer') {
              const transferResponse = await fetch(`/api/transfers/${booking.packageId}`);
              if (transferResponse.ok) {
                const transferData = await transferResponse.json();
                packageDetails = {
                  title: transferData.transfer.title,
                  image: transferData.transfer.images?.[0] || '/images/default-transfer.jpg',
                  slug: transferData.transfer.slug,
                  price: transferData.transfer.price,
                  vehicle: transferData.transfer.vehicle,
                };
              }
            }

            return {
              ...booking,
              packageDetails,
            };
          } catch (error) {
            console.error(`Error fetching package details for ${booking.packageType} ${booking.packageId}:`, error);
            return booking;
          }
        })
      );

      apiCache.set(cacheKey, bookingsWithDetails);
      return bookingsWithDetails;
    } catch (error) {
      console.error("Error fetching bookings with details:", error);
      return [];
    }
  },
};
