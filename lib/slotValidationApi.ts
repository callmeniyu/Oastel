const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export interface SlotValidationResult {
  isValid: boolean;
  isExpired: boolean;
  isFull: boolean;
  message?: string;
  availableSlots?: number;
  totalCapacity?: number;
}

export class SlotValidationAPI {
  // Get Malaysian server time
  private async getMalaysianServerTime(): Promise<Date> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/timeslots/server-datetime`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          return new Date(data.data.fullDateTime);
        }
      }
    } catch (error) {
      console.error('Error fetching server time:', error);
    }
    
    // Fallback to local time if server time fetch fails
    return new Date();
  }

  // Check if a specific slot is available
  async validateSlot(
    packageType: 'tour' | 'transfer',
    packageId: string,
    date: string,
    time: string,
    guests: number
  ): Promise<SlotValidationResult> {
    try {
      // Get current Malaysian time from server
      const nowMYT = await this.getMalaysianServerTime();

      // Check if date is expired (using Malaysian time)
      const today = new Date(nowMYT);
      today.setHours(0, 0, 0, 0);
      const slotDate = new Date(date);
      slotDate.setHours(0, 0, 0, 0);

      if (slotDate < today) {
        return {
          isValid: false,
          isExpired: true,
          isFull: false,
          message: "Date has expired"
        };
      }

      // Skip 10-hour cutoff - only check actual slot availability

      // Check slot availability via API
      const response = await fetch(
        `${API_BASE_URL}/api/timeslots/availability?packageType=${packageType}&packageId=${packageId}&date=${date}&time=${encodeURIComponent(time)}&persons=${guests}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        return {
          isValid: false,
          isExpired: false,
          isFull: false,
          message: "Unable to verify availability"
        };
      }

      const data = await response.json();
      
      if (!data.success || !data.data.available) {
        return {
          isValid: false,
          isExpired: false,
          isFull: true,
          message: data.data?.reason || "Time slot is not available",
          availableSlots: data.data?.availableSlots
        };
      }

      return {
        isValid: true,
        isExpired: false,
        isFull: false,
        availableSlots: data.data.availableSlots
      };

    } catch (error) {
      console.error('Error validating slot:', error);
      return {
        isValid: false,
        isExpired: false,
        isFull: false,
        message: "Unable to verify availability"
      };
    }
  }

  // Validate multiple cart items at once
  async validateCartItems(items: Array<{
    _id: string;
    packageType: 'tour' | 'transfer';
    packageId?: string;
    selectedDate?: string;
    bookingDate?: string;
    timeSlot?: string;
    selectedTime?: string;
    guests?: number;
    adults?: number;
    children?: number;
    packageDetails?: {
      slug?: string;
      title?: string;
      name?: string;
    };
  }>): Promise<Record<string, SlotValidationResult>> {
    const results: Record<string, SlotValidationResult> = {};

    // Process items in parallel for better performance
    const validationPromises = items.map(async (item) => {
      // Try to get packageId from multiple possible sources
      const packageId = item.packageId || item.packageDetails?.slug;
      const date = item.selectedDate || item.bookingDate;
      const time = item.timeSlot || item.selectedTime;
      const guests = item.guests || ((item.adults || 0) + (item.children || 0));

      if (!packageId || !date || !time) {
        return {
          id: item._id,
          result: {
            isValid: false,
            isExpired: false,
            isFull: false,
            message: "Missing booking information"
          }
        };
      }

      const result = await this.validateSlot(
        item.packageType,
        packageId,
        date,
        time,
        guests
      );

      return {
        id: item._id,
        result
      };
    });

    const validationResults = await Promise.all(validationPromises);
    
    validationResults.forEach(({ id, result }) => {
      results[id] = result;
    });

    return results;
  }
}

export const slotValidationApi = new SlotValidationAPI();
