const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export interface CartBookingRequest {
  userEmail: string;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    whatsapp?: string;
  };
  pickupLocation?: string;
}

export interface CartBookingSummary {
  items: any[];
  validItems: number;
  expiredItems: number;
  totalAmount: number;
  bankCharge: number;
  grandTotal: number;
}

export interface CartBookingResult {
  success: boolean;
  bookingIds: string[];
  warnings: string[];
  totalBookings: number;
}

export class CartBookingAPI {
  // Get cart booking summary with date validation
  async getCartBookingSummary(userEmail: string): Promise<CartBookingSummary> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/cart-booking/summary/${encodeURIComponent(userEmail)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to get cart booking summary');
      }

      return data.data;
    } catch (error) {
      console.error('Error getting cart booking summary:', error);
      throw error;
    }
  }

  // Book all cart items
  async bookCartItems(request: CartBookingRequest): Promise<CartBookingResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cart-booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      console.log('Cart booking response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Cart booking error response:', errorText);
        
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        } catch (parseError) {
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to book cart items');
      }

      return {
        success: data.success,
        bookingIds: data.data.bookingIds,
        warnings: data.data.warnings || [],
        totalBookings: data.data.totalBookings
      };
    } catch (error) {
      console.error('Error booking cart items:', error);
      throw error;
    }
  }
}

export const cartBookingApi = new CartBookingAPI();
