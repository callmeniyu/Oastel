/**
 * Date utilities to handle timezone-safe date formatting
 * Prevents off-by-one day errors when sending dates to server
 */

/**
 * Format a Date object to YYYY-MM-DD string in local timezone
 * This prevents timezone conversion issues when sending dates to server
 * 
 * @param date - The Date object to format
 * @returns Formatted date string in YYYY-MM-DD format (local timezone)
 */
export function formatDateForServer(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Create a Date object from YYYY-MM-DD string that represents local date
 * This ensures the date is interpreted as the user intended, not converted to UTC
 * 
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Date object representing the local date at noon
 */
export function createLocalDate(dateString: string): Date {
  // Use noon to avoid timezone edge cases
  return new Date(dateString + 'T12:00:00');
}

/**
 * Check if a date string represents today in local timezone
 * 
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns true if the date is today
 */
export function isToday(dateString: string): boolean {
  const today = new Date();
  return dateString === formatDateForServer(today);
}

/**
 * Check if a date string represents a future date in local timezone
 * 
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns true if the date is in the future
 */
export function isFutureDate(dateString: string): boolean {
  const today = new Date();
  const inputDate = createLocalDate(dateString);
  
  // Set both to start of day for comparison
  today.setHours(0, 0, 0, 0);
  inputDate.setHours(0, 0, 0, 0);
  
  return inputDate > today;
}

/**
 * Get formatted date string for today in local timezone
 * 
 * @returns Today's date in YYYY-MM-DD format
 */
export function getTodayString(): string {
  return formatDateForServer(new Date());
}

/**
 * Parse a date string from server (assumes UTC noon) to local Date object
 * 
 * @param serverDateString - Date string from server
 * @returns Local Date object
 */
export function parseServerDate(serverDateString: string): Date {
  // Server dates are stored as UTC noon, convert to local
  return new Date(serverDateString);
}
