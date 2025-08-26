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
      // Validate inputs
      if (!packageType || !packageId || !date || !time || guests < 1) {
        console.error('Invalid input parameters:', { packageType, packageId, date, time, guests });
        return {
          isValid: false,
          isExpired: false,
          isFull: false,
          message: "Invalid input parameters"
        };
      }

      // Get current Malaysian time from server
      const nowMYT = await this.getMalaysianServerTime();

      // Check if date is expired (using Malaysian time)
      const today = new Date(nowMYT);
      today.setHours(0, 0, 0, 0);

      // If the incoming date is already a YYYY-MM-DD string, use it directly
      // for API queries to avoid Date->toISOString() UTC shifts that can
      // change the day in some timezones. Use a Date object only for comparison.
      let slotDateObj: Date;
      let formattedDate: string;

      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        formattedDate = date;
        const parts = date.split('-').map(Number);
        slotDateObj = new Date(parts[0], parts[1] - 1, parts[2]);
        slotDateObj.setHours(0, 0, 0, 0);
      } else {
        slotDateObj = new Date(date);
        slotDateObj.setHours(0, 0, 0, 0);
        formattedDate = slotDateObj.toISOString().split('T')[0];
      }

      if (slotDateObj < today) {
        return {
          isValid: false,
          isExpired: true,
          isFull: false,
          message: "Date has expired"
        };
      }
      // formattedDate is set above (either directly from YYYY-MM-DD input or via UTC-safe conversion)

      // Validate packageId format (should be 24 character ObjectId)
      if (typeof packageId !== 'string' || packageId.length !== 24) {
        console.error('Invalid packageId format:', packageId);
        return {
          isValid: false,
          isExpired: false,
          isFull: false,
          message: "Invalid package ID format"
        };
      }

      console.log('Cart validation request:', {
        packageType,
        packageId,
        originalDate: date,
        formattedDate,
        time,
        guests
      });

      // Use the existing /available endpoint to get all slots for the date
      // This gives us the real slot data without 10-hour restriction for cart validation
      const response = await fetch(
        `${API_BASE_URL}/api/timeslots/available?packageType=${packageType}&packageId=${packageId}&date=${formattedDate}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText}`);
        console.error(`URL: ${API_BASE_URL}/api/timeslots/available?packageType=${packageType}&packageId=${packageId}&date=${formattedDate}`);
        
        return {
          isValid: false,
          isExpired: false,
          isFull: false,
          message: `Unable to verify availability (${response.status})`
        };
      }

      const data = await response.json();
      
      if (!data.success || !Array.isArray(data.data)) {
        return {
          isValid: false,
          isExpired: false,
          isFull: false,
          message: "No slots found for this date"
        };
      }

      // Find the specific time slot
      const slot = data.data.find((s: any) => s.time === time);
      
      if (!slot) {
        return {
          isValid: false,
          isExpired: false,
          isFull: false,
          message: "Time slot not found"
        };
      }

      // For cart validation, we only care if the slot exists and has capacity
      // We ignore the isAvailable flag which includes 10-hour restriction
      const availableCapacity = slot.capacity - slot.bookedCount;
      
      if (availableCapacity <= 0) {
        return {
          isValid: false,
          isExpired: false,
          isFull: true,
          message: "Time slot is fully booked",
          availableSlots: 0,
          totalCapacity: slot.capacity
        };
      }

      // Check if requested guests exceeds available capacity
      if (guests > availableCapacity) {
        return {
          isValid: false,
          isExpired: false,
          isFull: true,
          message: `Only ${availableCapacity} spots available`,
          availableSlots: availableCapacity,
          totalCapacity: slot.capacity
        };
      }

      // For cart validation, the slot is valid if it exists, has capacity, and date is not expired
      return {
        isValid: true,
        isExpired: false,
        isFull: false,
        message: "Slot available",
        availableSlots: availableCapacity,
        totalCapacity: slot.capacity
      };

    } catch (error) {
      console.error('Error validating slot:', error);
      console.error(`Failed for: packageType=${packageType}, packageId=${packageId}, date=${date}, time=${time}, guests=${guests}`);
      
      return {
        isValid: false,
        isExpired: false,
        isFull: false,
        message: `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
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
