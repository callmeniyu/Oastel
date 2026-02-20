import Image from "next/image";
import { IoMdArrowForward } from "react-icons/io";
export default function AboutPage() {
  const features = [
    {
      id: 1,
      title: "Secure",
      desc: "You are safe with us—verified tours, trusted partners, and protected payments.",
      icon: "/images/about3.png",
    },
    {
      id: 2,
      title: "Budget-Friendly",
      desc: "Enjoy unforgettable travel experiences without overspending. Great value, always.",
      icon: "/images/about4.png",
    },
    {
      id: 3,
      title: "Reliable",
      desc: "Count on punctual vans, confirmed tours, and dependable service every step of the way.",
      icon: "/images/about5.png",
    },
  ];
  return (
    <main className="font-poppins text-title_black">
      {/* Section 1: Hero */}
      <section
        id="abou-tus"
        className="px-6 flex gap-6 items-end md:px-12 py-10 max-w-7xl mx-auto"
      >
        <div>
          <h3 className="text-lg font-semibold mb-2">We are Oastel</h3>
          <h1 className="text-3xl md:text-5xl font-bold text-primary_green mb-2">
            We Know What Travelers Need
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-500 mb-10">
            We Deliver It Well
          </h2>
          <Image
            src="/images/about1.jpg"
            width={800}
            height={800}
            alt="Handshake"
            className="rounded-2xl h-[22rem] object-cover"
          />
        </div>

        <Image
          src="/images/about2.jpg"
          width={800}
          height={800}
          alt="Handshake"
          className="rounded-2xl w-2/6 h-[30rem] object-cover hidden md:block"
        />
      </section>

      {/* Section 2: Our Story */}
      <section
        id="our-story"
        className="bg-white px-6 md:px-12 py-16 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12"
      >
        <div>
          <div className="text-4xl font-bold text-primary_green flex items-center gap-2">
            <h2>Our Story</h2>{" "}
            <div className="transform rotate-90 mt-2">
              <IoMdArrowForward className="-rotate-12 " />
            </div>
          </div>
        </div>

        <div>
          <p className="text-primary_green font-semibold text-lg mb-4">
            Oastel began with a simple idea: to make travel in Cameron
            Highlands—especially in Tanah Rata—easier, more personal, and truly
            enriching.
          </p>
          <p className="text-desc_gray leading-relaxed">
            It all started in the heart of the Highlands, where we noticed
            something: travelers weren’t just looking for a bed or a ride. They
            were searching for something deeper—real experiences that connect
            them with people, nature, and culture. So we built Oastel not just
            as a co-living space, but as a backpacker-friendly community. A
            space where travelers could meet, share stories, and explore
            together.
            <br />
            <br />
            We brought them closer to the hidden gems of the highlands, the
            warmth of local life, and those unforgettable off-the-beaten-path
            adventures that only locals know. While we handle the details, you
            focus on what matters—making memories. Our team is made up of
            passionate locals and travelers who care about every part of your
            journey. At Oastel, every trip is designed to be smooth, safe, and
            full of meaning. More than just a stay—it’s a shared story.
          </p>
        </div>
      </section>

      {/* Section 3: Key Benefits */}
      <section id="our-features" className="bg-[#F5F5F5] px-2 md:px-12 py-16">
        <div className="max-w-7xl mx-auto text-center mb-10">
          <h2 className="text-xl font-semibold text-primary_green">
            Your journey is more than just a destination
          </h2>
          <p className="text-desc_gray">We get that :)</p>
        </div>

        <div className="flex flex-col gap-4 md:gap-8 items-start ">
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex gap-6 px-6 max-w-7xl mx-auto">
              <div className="bg-white rounded-lg py-6 pl-6 text-left shadow-md flex flex-col gap-4">
                <div className="flex justify-between items-start overflow-hidden">
                  <span className="text-sm font-bold text-gray-400 rounded-full bg-[#F5F5F5] px-4 py-2">
                    {features[0].id}
                  </span>
                  <img
                    src={features[0].icon}
                    alt={features[0].title}
                    className="w-32 h-36 relative left-6"
                  />
                </div>
                <div className="pr-6">
                  <h3 className="font-bold text-lg text-primary_green mb-1">
                    {features[0].title}
                  </h3>
                  <p className="text-desc_gray text-sm">{features[0].desc}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-6 px-6 max-w-7xl mx-auto">
              <div className="bg-white rounded-lg py-6 pl-6 text-left shadow-md flex flex-col gap-4">
                <div className="flex justify-between items-start overflow-hidden">
                  <span className="text-sm font-bold text-gray-400 rounded-full bg-[#F5F5F5] px-4 py-2">
                    {features[1].id}
                  </span>
                  <img
                    src={features[1].icon}
                    alt={features[1].title}
                    className="w-32 h-36 relative left-6"
                  />
                </div>
                <div className="pr-6">
                  <h3 className="font-bold text-lg text-primary_green mb-1">
                    {features[1].title}
                  </h3>
                  <p className="text-desc_gray text-sm">{features[1].desc}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-6 px-6 max-w-7xl mx-auto">
            <div className="bg-white rounded-lg py-6 pl-6 text-left shadow-md flex flex-col gap-4">
              <div className="flex justify-between items-start overflow-hidden">
                <span className="text-sm font-bold text-gray-400 rounded-full bg-[#F5F5F5] px-4 py-2">
                  {features[2].id}
                </span>
                <img
                  src={features[2].icon}
                  alt={features[2].title}
                  className="w-32 h-36 relative left-6"
                />
              </div>
              <div className="pr-6">
                <h3 className="font-bold text-lg text-primary_green mb-1">
                  {features[2].title}
                </h3>
                <p className="text-desc_gray text-sm">{features[2].desc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Trust & Security - Payment Partners */}
      <section
        id="trust-security"
        className="bg-white px-6 md:px-12 py-16 max-w-7xl mx-auto"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary_green mb-3">
            Trust & Security
          </h2>
          <p className="text-desc_gray max-w-2xl mx-auto">
            We partner with trusted financial institutions to ensure secure,
            reliable, and seamless transactions for all our guests.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Online Payment Gateway */}
          <div className="bg-gradient-to-br from-primary_green/5 to-primary_green/10 rounded-2xl p-8 shadow-md border border-primary_green/20 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-xl font-bold text-primary_green">
                  Online Payment Gateway
                </h3>
              </div>
              <div className="space-y-3 text-desc_gray">
                <div className="flex gap-2 font-semibold text-gray-800 items-center">
                  <span>Powered by</span>
                  <Image
                    src="/images/stripe-seeklogo.png"
                    alt="Stripe"
                    width={60}
                    height={20}
                    className="h-5 w-auto"
                  />
                </div>
                <ul className="space-y-2 text-sm mt-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary_green mt-1">✓</span>
                    <span>
                      Secure online card processing with advanced fraud
                      protection
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary_green mt-1">✓</span>
                    <span>
                      International payment support for seamless global
                      transactions
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary_green mt-1">✓</span>
                    <span>PCI DSS compliant for maximum security</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Local Banking Partners */}
          <div className="bg-gradient-to-br from-primary_green/5 to-primary_green/10 rounded-2xl p-8 shadow-md border border-primary_green/20 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-xl font-bold text-primary_green">
                  Local Banking Partners
                </h3>
              </div>
              <div className="space-y-3 text-desc_gray">
                <p className="font-semibold text-gray-800">
                  Trusted Malaysian Banks
                </p>
                <ul className="flex flex-col justify-start md:flex-row md:justify-between md:items-center space-y-2 text-sm mt-2">
                  <li className="flex flex-col gap-4">
                    <Image
                      src="/images/public_bank.png"
                      alt="Public Bank"
                      width={100}
                      height={100}
                      className="h-8 md:h-6 w-48 md:w-auto"
                    />
                  </li>
                  <li className="flex flex-col gap-3">
                    <Image
                      src="/images/alliancebank.png"
                      alt="Public Bank"
                      width={100}
                      height={100}
                      className="h-8 md:h-6 w-48 md:w-auto"
                    />
                  </li>
                </ul>
                <p className="text-sm pt-2 border-t border-primary_green/20 mt-4">
                  Our banking partnerships ensure efficient transaction
                  management with high standards of financial security,
                  compliance, and transparency.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Company Registration */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-primary_green/5 rounded-lg px-6 py-4 border border-primary_green/20">
            <p className="text-sm font-semibold text-primary_green mb-1">
              OASTEL SDN. BHD.
            </p>
            <p className="text-xs text-desc_gray">
              Company Registration No: 202401034459 (1580306-V)
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
