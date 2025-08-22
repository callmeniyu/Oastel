import Link from "next/link";
import Image from "next/image";
import {
  FaWhatsapp,
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaTwitter,
  FaTiktok,
  FaTelegram,
  FaEnvelope,
} from "react-icons/fa";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white font-poppins">
      {/* Hero Section */}
      <div className="relative h-64 md:h-96 bg-primary_green flex items-center justify-center">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <Image
          // Replace with your image path
          src="/images/contact.jpg" // Ensure this path is correct
          alt="Contact Oastel"
          fill
          className="object-cover brightness-95 transition-all duration-700"
          priority
        />
        <div className="relative z-20 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            We'd love to hear from you! Reach out through any of these channels.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        {/* Primary Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* WhatsApp */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4 ">
              <FaWhatsapp className="text-4xl text-primary_green mr-4" />
              <h3 className="text-xl font-semibold text-title_black">
                WhatsApp
              </h3>
            </div>
            <p className="text-desc_gray mb-4">
              Chat with us directly for quick responses
            </p>
            <Link
              href="https://wa.me/yourphonenumber" // Replace with your WhatsApp number
              target="_blank"
              className="inline-block bg-primary_green text-white px-6 py-2 rounded-md hover:bg-[#128C7E] transition-colors"
            >
              Message Us
            </Link>
          </div>

          {/* Instagram - Highlighted */}
          <div className="bg-white p-6 rounded-lg shadow-md border transform transition-transform hover:shadow-lg">
            <div className="flex items-center mb-4">
              <FaInstagram className="text-4xl text-primary_green mr-4" />
              <h3 className="text-xl font-semibold text-title_black">
                Instagram
              </h3>
            </div>
            <p className="text-desc_gray mb-4">
              Follow us and send DMs for the latest updates
            </p>
            <Link
              href="https://instagram.com/oastel" // Replace with your Instagram
              target="_blank"
              className="inline-block bg-primary_green text-white px-6 py-2 rounded-md hover:opacity-90 transition-opacity"
            >
              Follow & DM
            </Link>
          </div>

          {/* Email */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <FaEnvelope className="text-4xl text-primary_green mr-4" />
              <h3 className="text-xl font-semibold text-title_black">Email</h3>
            </div>
            <p className="text-desc_gray mb-4">Send us detailed inquiries</p>
            <Link
              href="mailto:hello@oastel.com" // Replace with your email
              className="inline-block bg-primary_green text-white px-6 py-2 rounded-md hover:bg-[#0a5a44] transition-colors"
            >
              Email Us
            </Link>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-primary_green mb-4">
            Our Socials
          </h2>
          <p className="text-desc_gray max-w-2xl mx-auto mb-8">
            Connect with us on social media for the latest updates, offers, and
            travel inspiration.
          </p>

          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <SocialIcon
              icon={<FaFacebook className="text-2xl" />}
              url="https://facebook.com/oastel"
              label="Facebook"
              color="bg-[#1877F2]"
            />
            <SocialIcon
              icon={<FaYoutube className="text-2xl" />}
              url="https://youtube.com/oastel"
              label="YouTube"
              color="bg-[#FF0000]"
            />
            <SocialIcon
              icon={<FaTwitter className="text-2xl" />}
              url="https://twitter.com/oastel"
              label="Twitter"
              color="bg-[#1DA1F2]"
            />
            <SocialIcon
              icon={<FaTiktok className="text-2xl" />}
              url="https://tiktok.com/@oastel"
              label="TikTok"
              color="bg-[#000000]"
            />
            <SocialIcon
              icon={<FaTelegram className="text-2xl" />}
              url="https://t.me/oastel"
              label="Telegram"
              color="bg-[#0088CC]"
            />
          </div>
        </div>

        <h2
          id="feedback"
          className="text-3xl py-4 pt-8 font-bold text-primary_green mb-6 text-center"
        >
          We'd Love to Hear Your FeedBack and Enquiries
        </h2>
        {/* Contact Form (Optional) */}
        <div className="bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto mt-6">
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-desc_gray mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary_green"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-desc_gray mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary_green"
                />
              </div>
            </div>
            <div>
              <label htmlFor="message" className="block text-desc_gray mb-2">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                placeholder="Share your feedback or ask a question..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary_green"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-primary_green text-white py-3 rounded-md hover:bg-[#0a5a44] transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Reusable Social Icon Component
function SocialIcon({
  icon,
  url,
  label,
  color,
}: {
  icon: React.ReactNode;
  url: string;
  label: string;
  color: string;
}) {
  return (
    <Link
      href={url}
      target="_blank"
      className={`flex items-center ${color} text-white px-6 py-3 rounded-full hover:opacity-90 transition-opacity`}
    >
      <span className="mr-2">{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  );
}
