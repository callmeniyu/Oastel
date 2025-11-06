import Link from "next/link";

interface TransferSEOLinksProps {
  currentTransfer?: {
    from: string;
    to: string;
    type: string;
    slug: string;
  };
  relatedTransfers?: Array<{
    title: string;
    slug: string;
    from: string;
    to: string;
    type: string;
  }>;
}

export default function TransferSEOLinks({
  currentTransfer,
  relatedTransfers = [],
}: TransferSEOLinksProps) {
  // Popular transfer routes for internal linking
  const popularRoutes = [
    {
      from: "Cameron Highlands",
      to: "Kuala Lumpur",
      slug: "cameron-highlands-to-kuala-lumpur",
    },
    {
      from: "Cameron Highlands",
      to: "Perhentian Islands",
      slug: "cameron-highlands-to-perhentian-islands",
    },
    {
      from: "Taman Negara",
      to: "Perhentian Islands",
      slug: "taman-negara-to-perhentian-islands",
    },
    {
      from: "Cameron Highlands",
      to: "Kuala Besut",
      slug: "cameron-highlands-to-kuala-besut",
    },
    {
      from: "Kuala Lumpur",
      to: "Cameron Highlands",
      slug: "kuala-lumpur-to-cameron-highlands",
    },
  ];

  // Filter out current transfer from suggestions
  const suggestedRoutes = popularRoutes.filter(
    (route) => !currentTransfer || route.slug !== currentTransfer.slug
  );

  return (
    <div className="bg-gray-50 p-6 rounded-lg mt-8">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        Popular Transfer Routes
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suggestedRoutes.slice(0, 4).map((route, index) => (
          <Link
            key={index}
            href={`/transfers/${route.slug}`}
            className="block p-3 bg-white rounded border hover:shadow-md transition-shadow"
          >
            <div className="font-medium text-green-600">
              {route.from} → {route.to}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Comfortable transfer service
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="font-medium text-gray-800 mb-3">
          Explore More Cameron Highlands Services
        </h4>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/tours"
            className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition-colors"
          >
            Cameron Highlands Tours
          </Link>
          <Link
            href="/tours/mossy-forest"
            className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition-colors"
          >
            Mossy Forest Tours
          </Link>
          <Link
            href="/tours/sunrise"
            className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition-colors"
          >
            Sunrise Tours
          </Link>
          <Link
            href="/contact-us"
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
          >
            Custom Transfer Request
          </Link>
        </div>
      </div>

      {relatedTransfers.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="font-medium text-gray-800 mb-3">
            Similar Transfer Services
          </h4>
          <div className="space-y-2">
            {relatedTransfers.slice(0, 3).map((transfer, index) => (
              <Link
                key={index}
                href={`/transfers/${transfer.slug}`}
                className="block text-green-600 hover:text-green-800 text-sm"
              >
                {transfer.title} - {transfer.from} to {transfer.to}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
