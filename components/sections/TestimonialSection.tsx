"use client";
import TestimonialCard from "../ui/TestimonialCard";

const testimonials = [
  {
    name: "Liam K.",
    avatar: `https://picsum.photos/id/237/200/200`,
    message: `The Land Rover tour was the highlight of our trip! Our guide was so knowledgeable and funny. The vehicle handled the bumpy roads to Mossy Forest like a dream. An unforgettable experience we’d do again in a heartbeat.`,
  },
  {
    name: "Sarah & Mia",
    avatar: `https://picsum.photos/id/250/200/200`,
    message: `Booked a van transfer from Cameron Highlands to the Teman Negara. The driver was punctual and the van was super clean and comfortable. Made the long journey actually enjoyable. Highly recommend their transport service!`,
  },
  {
    name: "The Chen Family",
    avatar: `https://picsum.photos/id/239/200/200`,
    message: `We used Oastel to book our stay and a few tours. Everything was seamless! The website made it easy to see all our options, and redirecting to book the room was simple. A one-stop shop for our vacation planning.`,
  },
  {
    name: "David R.",
    avatar: `https://picsum.photos/id/240/200/200`,
    message: `Chose the Private Half-Day Tour for just our group. Worth every penny! We got to set our own pace and ask a million questions. The vehicle was perfect for our small group, and the guide felt like a friend by the end.`,
  },
  {
    name: "Priya T.",
    avatar: `https://picsum.photos/id/241/200/200`,
    message: `Incredible service from start to finish. We had to change our transfer date last minute, and the team was so helpful and accommodating. It’s rare to find such friendly and efficient customer service these days.`,
  },
  {
    name: "Elena J.",
    avatar: `https://picsum.photos/id/242/200/200`,
    message: `Did the Sunrise Tour and it was magical. Waking up early was 100% worth it for those views. The guide knew all the best spots for photos. A perfect, intimate way to experience the highlands.`,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="relative bg-primary_green.light py-12 px-4 md:px-8 overflow-hidden">
      <div className="text-center section-title">
        <h2 className="section-title">Voices of Our Guests</h2>
        <p className="mt-2 section-desc font-reg">
          See what made our customer’s journeys unforgettable.
        </p>
      </div>

      <div className="mt-8 relative">
        <div className="flex gap-6 overflow-x-auto scrollbar-hide px-4 md:px-8 pb-4">
          {testimonials.map((testimonial, idx) => (
            <TestimonialCard key={idx} {...testimonial} />
          ))}
        </div>
      </div>
      <div className="absolute left-0 top-0 h-full w-16 sm:w-24 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none" />
      <div className="absolute right-0 top-0 h-full w-16 sm:w-24 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" />
    </section>
  );
}
