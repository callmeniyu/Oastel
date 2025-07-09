'use client';

export default function AddressContent() {
  return (
    <div>
      <h2 className="text-xl font-bold text-title_black mb-6">Address & Contact</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-desc_gray mb-1">WhatsApp Number</label>
          <input
            type="tel"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary_green focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-desc_gray mb-1">Contact Number</label>
          <input
            type="tel"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary_green focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-desc_gray mb-1">Pickup Address 1</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary_green focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-desc_gray mb-1">Pickup Address 2</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary_green focus:border-transparent"
          />
        </div>
        <button className="mt-4 bg-primary_green text-white px-6 py-2 rounded-lg hover:bg-primary_green/90 transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
}