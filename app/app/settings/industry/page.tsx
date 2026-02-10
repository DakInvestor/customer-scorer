// app/app/settings/industry/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { INDUSTRIES, INDUSTRY_CATEGORIES, type BusinessIndustry } from "@/lib/industry-types";

export default function IndustrySettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [primaryIndustry, setPrimaryIndustry] = useState<BusinessIndustry>("other");
  const [secondaryIndustries, setSecondaryIndustries] = useState<BusinessIndustry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function loadBusiness() {
      const supabase = createSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("business_id")
        .eq("id", user.id)
        .single();

      if (!profile?.business_id) {
        setError("No business found");
        setLoading(false);
        return;
      }

      setBusinessId(profile.business_id);

      const { data: business } = await supabase
        .from("businesses")
        .select("industry, secondary_industries")
        .eq("id", profile.business_id)
        .single();

      if (business) {
        setPrimaryIndustry((business.industry as BusinessIndustry) || "other");
        setSecondaryIndustries((business.secondary_industries as BusinessIndustry[]) || []);
      }

      setLoading(false);
    }
    loadBusiness();
  }, [router]);

  const handleSave = async () => {
    if (!businessId) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const supabase = createSupabaseBrowserClient();

      const { error: updateError } = await supabase
        .from("businesses")
        .update({
          industry: primaryIndustry,
          secondary_industries: secondaryIndustries,
        })
        .eq("id", businessId);

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const toggleSecondary = (industry: BusinessIndustry) => {
    if (industry === primaryIndustry) return;

    setSecondaryIndustries((prev) =>
      prev.includes(industry)
        ? prev.filter((i) => i !== industry)
        : [...prev, industry]
    );
  };

  const groupedIndustries = INDUSTRIES.reduce((acc, industry) => {
    const category = industry.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(industry);
    return acc;
  }, {} as Record<string, typeof INDUSTRIES[number][]>);

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-6">
        <Link href="/app/settings" className="text-sm text-text-muted hover:text-charcoal">
          ← Back to settings
        </Link>
      </div>

      <h1 className="mb-2 text-3xl font-bold text-charcoal">Industry Settings</h1>
      <p className="mb-8 text-text-muted">
        Select your industry to see relevant tools and leads on your dashboard.
      </p>

      {error && (
        <div className="mb-6 rounded-lg border border-critical/30 bg-critical/10 px-4 py-3 text-sm text-critical">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 rounded-lg border border-emerald/30 bg-emerald/10 px-4 py-3 text-sm text-emerald">
          Settings saved successfully!
        </div>
      )}

      <div className="max-w-3xl space-y-8">
        {/* Primary Industry */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-charcoal">Primary Industry</h2>
          <p className="mb-4 text-sm text-text-muted">
            This determines your main dashboard tools and default alerts.
          </p>

          <div className="space-y-4">
            {Object.entries(groupedIndustries).map(([category, industries]) => (
              <div key={category}>
                <h3 className="mb-2 text-sm font-medium text-text-secondary">
                  {INDUSTRY_CATEGORIES[category as keyof typeof INDUSTRY_CATEGORIES]}
                </h3>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {industries.map((industry) => (
                    <button
                      key={industry.value}
                      onClick={() => {
                        setPrimaryIndustry(industry.value);
                        setSecondaryIndustries((prev) =>
                          prev.filter((i) => i !== industry.value)
                        );
                      }}
                      className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors ${
                        primaryIndustry === industry.value
                          ? "border-copper bg-copper/10 text-copper"
                          : "border-border bg-white hover:border-copper/50"
                      }`}
                    >
                      <span className="text-xl">{industry.icon}</span>
                      <span className="text-sm font-medium">{industry.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Secondary Industries */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-charcoal">Additional Services</h2>
          <p className="mb-4 text-sm text-text-muted">
            Select any additional services you offer to unlock more tools.
          </p>

          <div className="flex flex-wrap gap-2">
            {INDUSTRIES.filter((i) => i.value !== primaryIndustry).map((industry) => (
              <button
                key={industry.value}
                onClick={() => toggleSecondary(industry.value)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
                  secondaryIndustries.includes(industry.value)
                    ? "border-copper bg-copper/10 text-copper"
                    : "border-border bg-white text-text-secondary hover:border-copper/50"
                }`}
              >
                <span>{industry.icon}</span>
                <span>{industry.label}</span>
                {secondaryIndustries.includes(industry.value) && (
                  <span className="ml-1">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-lg bg-surface p-6">
          <h3 className="mb-2 font-semibold text-charcoal">Your Selection</h3>
          <p className="text-sm text-text-secondary">
            <strong>Primary:</strong>{" "}
            {INDUSTRIES.find((i) => i.value === primaryIndustry)?.icon}{" "}
            {INDUSTRIES.find((i) => i.value === primaryIndustry)?.label}
          </p>
          {secondaryIndustries.length > 0 && (
            <p className="mt-1 text-sm text-text-secondary">
              <strong>Also offering:</strong>{" "}
              {secondaryIndustries
                .map((i) => INDUSTRIES.find((ind) => ind.value === i)?.label)
                .join(", ")}
            </p>
          )}
        </div>

        {/* Save Button */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-copper px-6 py-3 font-semibold text-white hover:bg-copper-dark disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Industry Settings"}
          </button>
          <Link
            href="/app/settings/service-area"
            className="rounded-lg border border-border px-6 py-3 font-semibold text-charcoal hover:bg-surface"
          >
            Configure Service Area →
          </Link>
        </div>
      </div>
    </div>
  );
}
