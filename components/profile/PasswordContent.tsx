
export default function PasswordContent() {
  return (
    <div>
      <h2 className="text-xl font-bold text-title_black mb-6">Change Password</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-desc_gray mb-1">Current Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary_green focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-desc_gray mb-1">New Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary_green focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-desc_gray mb-1">Confirm New Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary_green focus:border-transparent"
          />
        </div>
        <button className="mt-4 bg-primary_green text-white px-6 py-2 rounded-lg hover:bg-primary_green/90 transition-colors">
          Change Password
        </button>
      </div>
    </div>
  );
}