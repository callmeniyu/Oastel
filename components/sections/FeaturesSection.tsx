import { FaBed } from "react-icons/fa";
import { FaRegFaceSmileBeam } from "react-icons/fa6";
import { MdHiking } from "react-icons/md";

export default function Features() {
  const stats = [
    {
      icon: <FaBed className="text-3xl text-primary_green" />,
      title: "20+ Rooms",
      description:
        "Whether you're a solo traveller, a couple seeking a romantic getaway, or a family on vacation, we pride ourselves on offering a diverse range of over 80 meticulously designed rooms.",
    },
    {
      icon: <FaRegFaceSmileBeam className="text-3xl text-primary_green" />,
      title: "6000+ Happy Faces",
      description:
        "Our greatest achievement is the smiles we bring to our guest’s faces. With over 6000 happy faces and counting, we are dedicated to ensure customer satisfaction.",
    },
    {
      icon: <MdHiking className="text-3xl text-primary_green" />,
      title: "2000+ Tours",
      description:
        "Explore breathtaking landscapes and vibrant cultures with our curated selection of over 2000 tours. Adventure awaits at every corner, tailored for unforgettable memories.",
    },
  ];

  return (
    <section className="py-16 px-6 md:px-24 bg-white">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="section-title font-semibold font-poppins">
          Why Oastel?
        </h2>
        <p className="section-desc mb-8 md:px-10">
          At Oastel we understand that your journey is more than just a destination.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((item, i) => (
            <div
              key={i}
              className="bg-primary_green text-white rounded-lg p-6 text-left flex flex-col items-start gap-3 shadow-sm"
            >
              <div className="text-3xl p-2 bg-white rounded-lg">{item.icon}</div>
              <h3 className="text-lg font-semibold font-poppins">{item.title}</h3>
              <p className="text-sm font-poppins">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
