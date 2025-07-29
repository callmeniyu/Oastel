// components/ui/BookingCalendar.tsx
import { format, addDays } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

type Props = {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  minDate?: Date;
};

export default function BookingCalendar({ selectedDate, onDateChange }: Props) {
  const today = new Date();
  const maxDate = addDays(today, 90);

  return (
    <div className="rounded-lg shadow-md p-4 bg-white">
      <h3 className="text-primary_green text-xl font-bold mb-2">
        Select your date
      </h3>
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && onDateChange(date)}
        fromDate={today}
        toDate={maxDate}
        disabled={{ before: today }}
        animate
        modifiersClassNames={{
          today: "border border-primary_green",
          selected: "bg-primary_green text-white rounded-full",
        }}
      />
    </div>
  );
}
