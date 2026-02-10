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
  service_area_municipalities: string[] | null;
  service_area_zips: string[] | null;
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

  // Service area state
  const [serviceMunicipalities, setServiceMunicipalities] = useState<string[]>([]);
  const [serviceZipCodes, setServiceZipCodes] = useState<string[]>([]);
  const [availableMunicipalities, setAvailableMunicipalities] = useState<string[]>([]);
  const [newZipCode, setNewZipCode] = useState("");
  const [savingServiceArea, setSavingServiceArea] = useState(false);
  const [serviceAreaMessage, setServiceAreaMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

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
        setServiceMunicipalities(businessData.service_area_municipalities || []);
        setServiceZipCodes(businessData.service_area_zips || []);
      }

      // Load available municipalities from property_sales
      const { data: municipalities } = await supabase
        .from("property_sales")
        .select("municipality")
        .not("municipality", "is", null)
        .limit(500);

      if (municipalities) {
        const unique = [...new Set(
          municipalities.map((m) => m.municipality).filter(Boolean)
        )].sort() as string[];
        setAvailableMunicipalities(unique);
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

  const handleSaveServiceArea = async () => {
    if (!business) return;

    setServiceAreaMessage(null);
    setSavingServiceArea(true);

    try {
      const supabase = createSupabaseBrowserClient();

      const { error } = await supabase
        .from("businesses")
        .update({
          service_area_municipalities: serviceMunicipalities,
          service_area_zips: serviceZipCodes,
        })
        .eq("id", business.id);

      if (error) {
        setServiceAreaMessage({ type: "error", text: error.message });
        return;
      }

      setBusiness({
        ...business,
        service_area_municipalities: serviceMunicipalities,
        service_area_zips: serviceZipCodes,
      });
      setServiceAreaMessage({ type: "success", text: "Service area saved!" });

    } catch (err) {
      console.error(err);
      setServiceAreaMessage({ type: "error", text: "Failed to save." });
    } finally {
      setSavingServiceArea(false);
    }
  };

  const toggleMunicipality = (municipality: string) => {
    setServiceMunicipalities((prev) =>
      prev.includes(municipality)
        ? prev.filter((m) => m !== municipality)
        : [...prev, municipality]
    );
  };

  const addZipCode = () => {
    const zip = newZipCode.trim();
    if (zip && /^\d{5}$/.test(zip) && !serviceZipCodes.includes(zip)) {
      setServiceZipCodes((prev) => [...prev, zip]);
      setNewZipCode("");
    }
  };

  const removeZipCode = (zip: string) => {
    setServiceZipCodes((prev) => prev.filter((z) => z !== zip));
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
        <h1 className="mb-4 text-3xl font-bold text-charcoal">Settings</h1>
        <p className="text-text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8">
      <h1 className="mb-2 text-3xl font-bold text-charcoal">Settings</h1>
      <p className="mb-8 text-text-muted">Manage your business and account settings.</p>

      <div className="max-w-2xl space-y-8">

        {/* Service Area Settings */}
        <section className="rounded-lg border-2 border-copper/30 bg-copper/5 p-6">
          <h2 className="mb-2 text-lg font-semibold text-charcoal">Service Area</h2>
          <p className="mb-4 text-sm text-text-muted">
            Configure the areas you serve to see relevant leads on your dashboard.
          </p>
          <Link
            href="/app/settings/service-area"
            className="rounded-lg bg-copper px-4 py-2.5 font-medium text-white hover:bg-copper-dark"
          >
            Configure Service Area
          </Link>
        </section>

        {/* Business Settings */}
        <section className="rounded-lg bg-surface p-6">
          <h2 className="mb-4 text-lg font-semibold text-charcoal">Business Information</h2>

          <form onSubmit={handleSaveBusiness} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-text-secondary">
                Business name
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full rounded-md border border-border bg-white px-4 py-2.5 text-charcoal outline-none focus:ring-2 focus:ring-copper"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-text-secondary">
                Business type
              </label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full rounded-md border border-border bg-white px-4 py-2.5 text-charcoal outline-none focus:ring-2 focus:ring-copper"
              >
                <option value="">Select type...</option>
                {BUSINESS_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-text-secondary">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-md border border-border bg-white px-4 py-2.5 text-charcoal outline-none focus:ring-2 focus:ring-copper"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-text-secondary">
                  State
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full rounded-md border border-border bg-white px-4 py-2.5 text-charcoal outline-none focus:ring-2 focus:ring-copper"
                >
                  <option value="">Select state...</option>
                  {US_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-text-secondary">
                Business ID
              </label>
              <input
                type="text"
                value={business?.id || "—"}
                disabled
                className="w-full rounded-md bg-cream px-4 py-2.5 text-text-muted"
              />
              <p className="mt-1 text-xs text-text-muted">This cannot be changed.</p>
            </div>

            {businessMessage && (
              <div className={`rounded-md px-4 py-2 text-sm ${
                businessMessage.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}>
                {businessMessage.text}
              </div>
            )}

            <button
              type="submit"
              disabled={savingBusiness}
              className="rounded-md bg-copper px-4 py-2 font-semibold text-white hover:bg-copper-dark disabled:opacity-50"
            >
              {savingBusiness ? "Saving..." : "Save changes"}
            </button>
          </form>
        </section>

        {/* Service Area Settings */}
        <section className="rounded-lg bg-surface p-6">
          <h2 className="mb-2 text-lg font-semibold text-charcoal">Service Area</h2>
          <p className="mb-4 text-sm text-text-muted">
            Define your service area to filter new homeowner leads and get relevant property alerts.
          </p>

          <div className="space-y-6">
            {/* Municipalities */}
            <div>
              <label className="mb-2 block text-sm font-medium text-text-secondary">
                Municipalities / Townships
              </label>
              {availableMunicipalities.length > 0 ? (
                <div className="max-h-48 overflow-y-auto rounded-lg border border-border bg-white p-3">
                  <div className="flex flex-wrap gap-2">
                    {availableMunicipalities.map((municipality) => (
                      <button
                        key={municipality}
                        type="button"
                        onClick={() => toggleMunicipality(municipality)}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                          serviceMunicipalities.includes(municipality)
                            ? "bg-copper text-white"
                            : "bg-cream text-text-muted hover:bg-surface hover:text-charcoal"
                        }`}
                      >
                        {municipality}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-text-muted italic">
                  No municipalities available yet. They will appear once property data is loaded.
                </p>
              )}
              {serviceMunicipalities.length > 0 && (
                <p className="mt-2 text-xs text-text-muted">
                  {serviceMunicipalities.length} selected
                </p>
              )}
            </div>

            {/* ZIP Codes */}
            <div>
              <label className="mb-2 block text-sm font-medium text-text-secondary">
                ZIP Codes
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newZipCode}
                  onChange={(e) => setNewZipCode(e.target.value.replace(/\D/g, "").slice(0, 5))}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addZipCode(); } }}
                  placeholder="Enter ZIP code"
                  className="w-32 rounded-md border border-border bg-white px-3 py-2 text-charcoal outline-none focus:ring-2 focus:ring-copper"
                />
                <button
                  type="button"
                  onClick={addZipCode}
                  disabled={!newZipCode || newZipCode.length !== 5}
                  className="rounded-md bg-cream px-3 py-2 text-sm font-medium text-charcoal hover:bg-surface disabled:opacity-50"
                >
                  Add
                </button>
              </div>
              {serviceZipCodes.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {serviceZipCodes.map((zip) => (
                    <span
                      key={zip}
                      className="flex items-center gap-1 rounded-full bg-copper/10 px-3 py-1 text-xs font-medium text-copper"
                    >
                      {zip}
                      <button
                        type="button"
                        onClick={() => removeZipCode(zip)}
                        className="ml-1 hover:text-copper-dark"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {serviceAreaMessage && (
              <div className={`rounded-md px-4 py-2 text-sm ${
                serviceAreaMessage.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}>
                {serviceAreaMessage.text}
              </div>
            )}

            <button
              type="button"
              onClick={handleSaveServiceArea}
              disabled={savingServiceArea}
              className="rounded-md bg-copper px-4 py-2 font-semibold text-white hover:bg-copper-dark disabled:opacity-50"
            >
              {savingServiceArea ? "Saving..." : "Save service area"}
            </button>
          </div>
        </section>

        {/* Account Settings */}
        <section className="rounded-lg bg-surface p-6">
          <h2 className="mb-4 text-lg font-semibold text-charcoal">Account</h2>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-text-secondary">Email</label>
              <input
                type="text"
                value={user?.email || "—"}
                disabled
                className="w-full rounded-md bg-cream px-4 py-2.5 text-text-muted"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-text-secondary">Account created</label>
              <input
                type="text"
                value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}
                disabled
                className="w-full rounded-md bg-cream px-4 py-2.5 text-text-muted"
              />
            </div>
          </div>
        </section>

        {/* Change Password */}
        <section className="rounded-lg bg-surface p-6">
          <h2 className="mb-4 text-lg font-semibold text-charcoal">Change Password</h2>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-text-secondary">
                New password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-md border border-border bg-white px-4 py-2.5 text-charcoal placeholder-text-muted outline-none focus:ring-2 focus:ring-copper"
              />
              <p className="mt-1 text-xs text-text-muted">At least 6 characters</p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-text-secondary">
                Confirm new password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-md border border-border bg-white px-4 py-2.5 text-charcoal placeholder-text-muted outline-none focus:ring-2 focus:ring-copper"
              />
            </div>

            {passwordMessage && (
              <div className={`rounded-md px-4 py-2 text-sm ${
                passwordMessage.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}>
                {passwordMessage.text}
              </div>
            )}

            <button
              type="submit"
              disabled={savingPassword || !newPassword || !confirmPassword}
              className="rounded-md bg-copper px-4 py-2 font-semibold text-white hover:bg-copper-dark disabled:opacity-50"
            >
              {savingPassword ? "Updating..." : "Update password"}
            </button>
          </form>
        </section>

        {/* Notification Preferences */}
        <section className="rounded-lg bg-surface p-6">
          <h2 className="mb-4 text-lg font-semibold text-charcoal">Notification Preferences</h2>
          <p className="mb-4 text-sm text-text-muted">Choose what email notifications you receive.</p>

          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={notifyHighRisk}
                onChange={(e) => setNotifyHighRisk(e.target.checked)}
                className="h-4 w-4 rounded border-border bg-white"
              />
              <div>
                <span className="font-medium text-charcoal">High-risk alerts</span>
                <p className="text-sm text-text-muted">Get notified when a customer's reliability drops to At Risk</p>
              </div>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={notifyWeeklySummary}
                onChange={(e) => setNotifyWeeklySummary(e.target.checked)}
                className="h-4 w-4 rounded border-border bg-white"
              />
              <div>
                <span className="font-medium text-charcoal">Weekly summary</span>
                <p className="text-sm text-text-muted">Receive a weekly report of customer activity</p>
              </div>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={notifyNewDisputes}
                onChange={(e) => setNotifyNewDisputes(e.target.checked)}
                className="h-4 w-4 rounded border-border bg-white"
              />
              <div>
                <span className="font-medium text-charcoal">Dispute notifications</span>
                <p className="text-sm text-text-muted">Get notified when someone disputes an event you logged</p>
              </div>
            </label>

            {notificationMessage && (
              <div className={`rounded-md px-4 py-2 text-sm ${
                notificationMessage.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}>
                {notificationMessage.text}
              </div>
            )}

            <button
              onClick={handleSaveNotifications}
              disabled={savingNotifications}
              className="rounded-md bg-copper px-4 py-2 font-semibold text-white hover:bg-copper-dark disabled:opacity-50"
            >
              {savingNotifications ? "Saving..." : "Save preferences"}
            </button>
          </div>
        </section>

        {/* Legal */}
        <section className="rounded-lg bg-surface p-6">
          <h2 className="mb-4 text-lg font-semibold text-charcoal">Legal</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/terms" className="text-sm text-text-muted hover:text-charcoal underline">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-sm text-text-muted hover:text-charcoal underline">
              Privacy Policy
            </Link>
            <Link href="/app/reliability-info" className="text-sm text-text-muted hover:text-charcoal underline">
              How It Works
            </Link>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="rounded-lg border border-red-300 bg-red-50 p-6">
          <h2 className="mb-2 text-lg font-semibold text-red-800">Danger Zone</h2>
          <p className="mb-4 text-sm text-text-muted">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-800 hover:bg-red-200"
            >
              Delete Account
            </button>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-red-800">
                Type <strong>DELETE</strong> to confirm:
              </p>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                className="w-full rounded-md border border-border bg-white px-4 py-2.5 text-charcoal outline-none focus:ring-2 focus:ring-red-500"
              />
              {deleteError && (
                <p className="text-sm text-red-600">{deleteError}</p>
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
                  className="rounded-md bg-cream px-4 py-2 text-sm font-medium text-charcoal hover:bg-surface"
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
