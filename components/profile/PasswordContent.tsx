import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/context/ToastContext";

export default function PasswordContent() {
  const { data: session } = useSession();
  const { showToast } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasPassword, setHasPassword] = useState<boolean | null>(null);
  const [checkingPassword, setCheckingPassword] = useState(true);

  // Check if user has a password set in the database
  useEffect(() => {
    const checkUserPassword = async () => {
      if (!session?.user?.email) {
        setCheckingPassword(false);
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile/${session.user.email}`
        );
        const result = await response.json();

        if (result.success && result.data) {
          // Check if user has a password hash (length > 0)
          setHasPassword(result.data.hasPassword || false);
        } else {
          setHasPassword(false);
        }
      } catch (err) {
        console.error("Error checking user password status:", err);
        setHasPassword(false);
      } finally {
        setCheckingPassword(false);
      }
    };

    checkUserPassword();
  }, [session?.user?.email]);

  const handleChangePassword = async () => {
    // Validation
    if (!newPassword.trim()) {
      showToast({
        type: "error",
        title: "Error",
        message: "Please enter a new password.",
      });
      return;
    }
    if (newPassword.length < 6) {
      showToast({
        type: "error",
        title: "Error",
        message: "Password must be at least 6 characters long.",
      });
      return;
    }
    if (!confirmPassword.trim()) {
      showToast({
        type: "error",
        title: "Error",
        message: "Please confirm your new password.",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast({
        type: "error",
        title: "Error",
        message: "Passwords do not match.",
      });
      return;
    }
    if (hasPassword && !currentPassword.trim()) {
      showToast({
        type: "error",
        title: "Error",
        message: "Please enter your current password.",
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        email: session?.user?.email,
        newPassword,
        ...(hasPassword ? { currentPassword } : {}),
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/change-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const result = await response.json();
      if (result.success) {
        showToast({
          type: "success",
          title: "Success",
          message: "Password updated successfully.",
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        // Update hasPassword status if this was the first time setting password
        if (!hasPassword) {
          setHasPassword(true);
        }
      } else {
        showToast({
          type: "error",
          title: "Error",
          message: result.message || "Failed to update password.",
        });
      }
    } catch (err) {
      console.error("Password change error:", err);
      showToast({
        type: "error",
        title: "Error",
        message: "Error updating password. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (checkingPassword) {
    return (
      <div>
        <h2 className="text-xl font-bold text-title_black mb-6">
          Change Password
        </h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary_green"></div>
          <span className="ml-3 text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-title_black mb-6">
        {hasPassword ? "Change Password" : "Set Password"}
      </h2>
      {!hasPassword && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            You don't have a password set yet. Create one to secure your
            account.
          </p>
        </div>
      )}
      <div className="space-y-4">
        {hasPassword && (
          <div>
            <label className="block text-sm font-medium text-desc_gray mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary_green focus:border-transparent"
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-desc_gray mb-1">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary_green focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-desc_gray mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary_green focus:border-transparent"
          />
        </div>
        <button
          className="mt-4 bg-primary_green text-white px-6 py-2 rounded-lg hover:bg-primary_green/90 transition-colors disabled:opacity-60"
          onClick={handleChangePassword}
          disabled={loading}
        >
          {loading
            ? "Updating..."
            : hasPassword
            ? "Change Password"
            : "Set Password"}
        </button>
      </div>
    </div>
  );
}
