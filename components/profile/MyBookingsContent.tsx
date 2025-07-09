import Link from 'next/link';

export default function MyBookingsContent() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-center max-w-md">
        <h3 className="text-xl font-medium text-title_black mb-2">No Bookings Yet</h3>
        <p className="text-desc_gray mb-6">
          Your upcoming and past bookings will appear here when you make them.
        </p>
        <Link
          href="/tours"
          className="inline-block bg-primary_green text-white px-6 py-2 rounded-lg hover:bg-primary_green/90 transition-colors"
        >
          Browse Tours
        </Link>
      </div>
    </div>
  );
}