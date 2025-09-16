// components/ui/BookingCalendar.tsx
import { format, addDays } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

type Props = {
  selectedDate: Date | null;
  onDateChange: (date: Date) => void;
  minDate?: Date;
  serverDateTime?: {
    date: string;
    time: string;
    longDate: string;
    fullDateTime: Date;
  } | null;
};

export default function BookingCalendar({
  selectedDate,
  onDateChange,
  minDate,
  serverDateTime,
}: Props) {
  // Calculate today's date - use server time if available, otherwise fallback to Malaysia timezone
  const getToday = () => {
    if (serverDateTime) {
      // Use server-provided date
      const serverDate = new Date(serverDateTime.fullDateTime);
      serverDate.setHours(0, 0, 0, 0);

      console.log("Server date time:", serverDate);

      return serverDate;
    } else {
      // Fallback to local Malaysia timezone calculation
      const now = new Date();
      const malaysiaDateString = now.toLocaleDateString("sv-SE", {
        timeZone: "Asia/Kuala_Lumpur",
      });
      return new Date(malaysiaDateString + "T00:00:00");
    }
  };

  const today = getToday();
  const maxDate = addDays(today, 90);

  return (
    <div className="rounded-lg shadow-md p-4 bg-white">
      <h3 className="text-primary_green text-xl font-bold mb-2">
        Select your date
      </h3>
      <DayPicker
        mode="single"
        selected={selectedDate || undefined}
        onSelect={(date) => date && onDateChange(date)}
        fromDate={minDate || today}
        today={today}
        toDate={maxDate}
        disabled={{ before: minDate || today }}
        animate
        modifiersClassNames={{
          today: "border border-primary_green",
          selected: "bg-primary_green text-white rounded-full",
        }}
      />
    </div>
  );
}
