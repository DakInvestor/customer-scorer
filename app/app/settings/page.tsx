// app/settings/page.tsx
"use client";

import Link from "next/link";
import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming"
];

const BUSINESS_TYPES = [
  "HVAC", "Plumbing", "Electrical", "General Contractor", "Cleaning Services",
  "Landscaping", "Auto Repair", "Handyman", "Roofing", "Pest Control",
  "Appliance Repair", "Moving Services", "Salon / Spa", "Other Home Services", "Other"
];

type Business = {
  id: string;
  name: string;
  business_type: string | null;
  city: string | null;
  state: string | null;
  contact_email: string | null;
  created_at: string;
};

type Profile = {
  notify_high_risk: boolean;
  notify_weekly_summary: boolean;
  notify_new_disputes: boolean;
};

type UserData = {
  email: string;
  created_at: string;
};

export default function SettingsPage() {
  const router = useRouter();
  
  // Business state
  const [business, setBusiness] = useState<Business | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  
  // User state
  const [user, setUser] = useState<UserData | null>(null);
  
  // Notifications state
  const [notifyHighRisk, setNotifyHighRisk] = useState(true);
  const [notifyWeeklySummary, setNotifyWeeklySummary] = useState(true);
  const [notifyNewDisputes, setNotifyNewDisputes] = useState(true);
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [savingBusiness, setSavingBusiness] = useState(false);
  const [savingNotifications, setSavingNotifications] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  
  // Messages
  const [businessMessage, setBusinessMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [notificationMessage, setNotificationMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const supabase = createSupabaseBrowserClient();

      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      setUser({
        email: authUser.email || "",
        created_at: authUser.created_at || "",
      });

      const { data: profile } = await supabase
        .from("profiles")
        .select("business_id, notify_high_risk, notify_weekly_summary, notify_new_disputes")
        .eq("id", authUser.id)
        .single();

      if (profile) {
        setNotifyHighRisk(profile.notify_high_risk ?? true);
        setNotifyWeeklySummary(profile.notify_weekly_summary ?? true);
        setNotifyNewDisputes(profile.notify_new_disputes ?? true);
      }

      if (!profile?.business_id) {
        setLoading(false);
        return;
      }

      const { data: businessData } = await supabase
        .from("businesses")
        .select("*")
        .eq("id", profile.business_id)
        .single();

      if (businessData) {
        setBusiness(businessData);
        setBusinessName(businessData.name || "");
        setBusinessType(businessData.business_type || "");
        setCity(businessData.city || "");
        setState(businessData.state || "");
      }

      setLoading(false);
    }

    loadData();
  }, []);

  const handleSaveBusiness = async (e: FormEvent) => {
    e.preventDefault();
    if (!business) return;

    setBusinessMessage(null);
    setSavingBusiness(true);

    try {
      const supabase = createSupabaseBrowserClient();

      const { error } = await supabase
        .from("businesses")
        .update({
          name: businessName.trim(),
          business_type: businessType || null,
          city: city.trim() || null,
          state: state || null,
        })
        .eq("id", business.id);

      if (error) {
        setBusinessMessage({ type: "error", text: error.message });
        return;
      }

      setBusiness({
        ...business,
        name: businessName.trim(),
        business_type: businessType,
        city: city.trim(),
        state: state,
      });
      setBusinessMessage({ type: "success", text: "Business info saved!" });

    } catch (err) {
      console.error(err);
      setBusinessMessage({ type: "error", text: "Failed to save." });
    } finally {
      setSavingBusiness(false);
    }
  };

  const handleSaveNotifications = async () => {
    setNotificationMessage(null);
    setSavingNotifications(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const { error } = await supabase
        .from("profiles")
        .update({
          notify_high_risk: notifyHighRisk,
          notify_weekly_summary: notifyWeeklySummary,
          notify_new_disputes: notifyNewDisputes,
        })
        .eq("id", authUser.id);

      if (error) {
        setNotificationMessage({ type: "error", text: error.message });
        return;
      }

      setNotificationMessage({ type: "success", text: "Notification preferences saved!" });

    } catch (err) {
      console.error(err);
      setNotificationMessage({ type: "error", text: "Failed to save." });
    } finally {
      setSavingNotifications(false);
    }
  };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword.length < 6) {
      setPasswordMessage({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    setSavingPassword(true);

    try {
      const supabase = createSupabaseBrowserClient();

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setPasswordMessage({ type: "error", text: error.message });
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordMessage({ type: "success", text: "Password updated successfully!" });

    } catch (err) {
      console.error(err);
      setPasswordMessage({ type: "error", text: "Failed to update password." });
    } finally {
      setSavingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      setDeleteError("Please type DELETE to confirm.");
      return;
    }

    setDeleting(true);
    setDeleteError(null);

    try {
      const supabase = createSupabaseBrowserClient();
      
      // Sign out first
      await supabase.auth.signOut();
      
      // Note: Full account deletion would require a server-side function
      // For now, we sign out and show a message
      router.push("/login?deleted=true");

    } catch (err) {
      console.error(err);
      setDeleteError("Failed to delete account. Please contact support.");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="mb-4 text-3xl font-bold">Settings</h1>
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8">
      <h1 className="mb-2 text-3xl font-bold">Settings</h1>
      <p className="mb-8 text-gray-400">Manage your business and account settings.</p>

      <div className="max-w-2xl space-y-8">
        
        {/* Business Settings */}
        <section className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-lg font-semibold">Business Information</h2>

          <form onSubmit={handleSaveBusiness} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-300">
                Business name
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full rounded-md bg-gray-700 px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-300">
                Business type
              </label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full rounded-md bg-gray-700 px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-gray-500"
              >
                <option value="">Select type...</option>
                {BUSINESS_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-300">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-md bg-gray-700 px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-300">
                  State
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full rounded-md bg-gray-700 px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <option value="">Select state...</option>
                  {US_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-300">
                Business ID
              </label>
              <input
                type="text"
                value={business?.id || "—"}
                disabled
                className="w-full rounded-md bg-gray-900 px-4 py-2.5 text-gray-500"
              />
              <p className="mt-1 text-xs text-gray-500">This cannot be changed.</p>
            </div>

            {businessMessage && (
              <div className={`rounded-md px-4 py-2 text-sm ${
                businessMessage.type === "success" ? "bg-green-900/50 text-green-200" : "bg-red-900/50 text-red-200"
              }`}>
                {businessMessage.text}
              </div>
            )}

            <button
              type="submit"
              disabled={savingBusiness}
              className="rounded-md bg-white px-4 py-2 font-semibold text-gray-900 hover:bg-gray-100 disabled:opacity-50"
            >
              {savingBusiness ? "Saving..." : "Save changes"}
            </button>
          </form>
        </section>

        {/* Account Settings */}
        <section className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-lg font-semibold">Account</h2>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-300">Email</label>
              <input
                type="text"
                value={user?.email || "—"}
                disabled
                className="w-full rounded-md bg-gray-900 px-4 py-2.5 text-gray-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-300">Account created</label>
              <input
                type="text"
                value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}
                disabled
                className="w-full rounded-md bg-gray-900 px-4 py-2.5 text-gray-500"
              />
            </div>
          </div>
        </section>

        {/* Change Password */}
        <section className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-lg font-semibold">Change Password</h2>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-300">
                New password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-md bg-gray-700 px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-gray-500"
              />
              <p className="mt-1 text-xs text-gray-500">At least 6 characters</p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-300">
                Confirm new password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-md bg-gray-700 px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>

            {passwordMessage && (
              <div className={`rounded-md px-4 py-2 text-sm ${
                passwordMessage.type === "success" ? "bg-green-900/50 text-green-200" : "bg-red-900/50 text-red-200"
              }`}>
                {passwordMessage.text}
              </div>
            )}

            <button
              type="submit"
              disabled={savingPassword || !newPassword || !confirmPassword}
              className="rounded-md bg-white px-4 py-2 font-semibold text-gray-900 hover:bg-gray-100 disabled:opacity-50"
            >
              {savingPassword ? "Updating..." : "Update password"}
            </button>
          </form>
        </section>

        {/* Notification Preferences */}
        <section className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-lg font-semibold">Notification Preferences</h2>
          <p className="mb-4 text-sm text-gray-400">Choose what email notifications you receive.</p>

          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={notifyHighRisk}
                onChange={(e) => setNotifyHighRisk(e.target.checked)}
                className="h-4 w-4 rounded border-gray-600 bg-gray-700"
              />
              <div>
                <span className="font-medium">High-risk alerts</span>
                <p className="text-sm text-gray-400">Get notified when a customer score drops below 50</p>
              </div>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={notifyWeeklySummary}
                onChange={(e) => setNotifyWeeklySummary(e.target.checked)}
                className="h-4 w-4 rounded border-gray-600 bg-gray-700"
              />
              <div>
                <span className="font-medium">Weekly summary</span>
                <p className="text-sm text-gray-400">Receive a weekly report of customer activity</p>
              </div>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={notifyNewDisputes}
                onChange={(e) => setNotifyNewDisputes(e.target.checked)}
                className="h-4 w-4 rounded border-gray-600 bg-gray-700"
              />
              <div>
                <span className="font-medium">Dispute notifications</span>
                <p className="text-sm text-gray-400">Get notified when someone disputes an event you logged</p>
              </div>
            </label>

            {notificationMessage && (
              <div className={`rounded-md px-4 py-2 text-sm ${
                notificationMessage.type === "success" ? "bg-green-900/50 text-green-200" : "bg-red-900/50 text-red-200"
              }`}>
                {notificationMessage.text}
              </div>
            )}

            <button
              onClick={handleSaveNotifications}
              disabled={savingNotifications}
              className="rounded-md bg-white px-4 py-2 font-semibold text-gray-900 hover:bg-gray-100 disabled:opacity-50"
            >
              {savingNotifications ? "Saving..." : "Save preferences"}
            </button>
          </div>
        </section>

        {/* Data Export */}
        <section className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-2 text-lg font-semibold">Data Export</h2>
          <p className="mb-4 text-sm text-gray-400">
            Download your customer and event data as CSV files.
          </p>
          <Link
            href="/export"
            className="inline-block rounded-md bg-gray-700 px-4 py-2 text-sm font-medium hover:bg-gray-600"
          >
            Export Data
          </Link>
        </section>

        {/* Legal */}
        <section className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-lg font-semibold">Legal</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/terms" className="text-sm text-gray-400 hover:text-white underline">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-sm text-gray-400 hover:text-white underline">
              Privacy Policy
            </Link>
            <Link href="/scoring-info" className="text-sm text-gray-400 hover:text-white underline">
              How Scoring Works
            </Link>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="rounded-lg border border-red-900/50 bg-red-900/10 p-6">
          <h2 className="mb-2 text-lg font-semibold text-red-200">Danger Zone</h2>
          <p className="mb-4 text-sm text-gray-400">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="rounded-md bg-red-900/50 px-4 py-2 text-sm font-medium text-red-200 hover:bg-red-900"
            >
              Delete Account
            </button>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-red-200">
                Type <strong>DELETE</strong> to confirm:
              </p>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                className="w-full rounded-md bg-gray-800 px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-red-500"
              />
              {deleteError && (
                <p className="text-sm text-red-300">{deleteError}</p>
              )}
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Permanently Delete"}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteConfirmText("");
                    setDeleteError(null);
                  }}
                  className="rounded-md bg-gray-700 px-4 py-2 text-sm font-medium hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}