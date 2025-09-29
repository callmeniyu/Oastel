import { FaQuoteLeft } from "react-icons/fa";

type TestimonialProps = {
  name: string;
  country?: string;
  message: string;
};

export default function TestimonialCard({
  name,
  country,
  message,
}: TestimonialProps) {
  return (
    <div className="min-w-[280px] sm:min-w-[320px] max-w-[320px] bg-white p-6 rounded-xl shadow-md relative">
      <FaQuoteLeft className="text-primary_green text-xl mb-2" />
      <p className="text-sm text-gray-700 mb-4 font-poppins">{message}</p>
      <div className="flex items-center gap-3">
        <div>
          <p className="text-sm font-semibold font-poppins">{name}</p>
          {country && <p className="text-xs text-gray-500">{country}</p>}
        </div>
      </div>
    </div>
  );
}
