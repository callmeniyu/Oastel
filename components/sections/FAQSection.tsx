"use client";
import { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa6";

const faqs = [
  {
    question: "How do I book a tour with Oastel?",
    answer:
      "You can book any tour directly through our website. Just head to the “Book Tour” section, select your preferred package, date, and group size (for private tours), and complete the form. We'll confirm your booking via email or WhatsApp.",
  },
  {
    question: "What's the difference between a co-tour and a private tour?",
    answer:
      "Co-tours are shared experiences—you’ll join other travelers. Great for individuals or small groups. Private tours are exclusive to your group only, perfect for families or those seeking a more personal experience.",
  },
  {
    question: "Are van bookings one-way or round trip?",
    answer:
      "Most van transfers are one-way, but a few include return trips or boat tickets (like to Perhentian Islands). The details will be mentioned clearly in the booking options. If you need a round trip, just mention it during booking or contact us.",
  },
  {
    question: "Can I modify or cancel a booking after payment?",
    answer:
      "Yes, modifications or cancellations can be made depending on the service and notice period. Each booking comes with a cancellation policy—please check the terms shown during checkout or contact us directly for help.",
  },
  {
    question: "Where can I book accommodation with Oastel?",
    answer:
      "Oastel partners with a trusted third-party platform for stays. When you click “Book Stay,” you’ll be redirected to our external accommodation portal to view rooms, pricing, and availability.",
  },
  {
    question: "How will I receive my booking confirmation?",
    answer:
      "Once your booking is submitted and confirmed, you’ll receive a confirmation email. We may also follow up on WhatsApp with pickup details, payment confirmation, or itinerary updates.",
  },
];

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleIndex = (index: number): void => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
  <section className="px-4 md:px-12 py-8 md:py-12 max-w-6xl mx-auto">
    <h2 className="section-title text-center">Your Travel Questions, Answered</h2>
    <p className="section-desc text-center mb-8">
      Find responses to the most common traveler concerns.
    </p>

    <div className="flex flex-wrap -mx-2">
      {faqs.map((faq, index) => {
        const isOpen = activeIndex === index;
        return (
          <div
            key={index}
            className="w-full md:w-1/2 px-2 mb-4"
          >
            <div className="border rounded-md max-h-max min-h-20 shadow-sm border-primary_green-light transition-all duration-300 ease-in-out h-full">
              <button
                onClick={() => toggleIndex(index)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left text-primary_green font-semibold"
              >
                <span>{faq.question}</span>
                {isOpen ? <FaMinus size={20} /> : <FaPlus size={20} />}
              </button>
              <div
                className={`px-4 overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? "max-h-[500px] pb-4" : "max-h-0"
                } text-sm text-desc_gray font-poppins`}
              >
                {faq.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </section>
);
}
