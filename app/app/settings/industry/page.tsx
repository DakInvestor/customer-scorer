// app/app/settings/industry/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { INDUSTRIES, getIndustryLabel, getIndustryIcon } from "@/lib/industry-types";

export default function IndustrySettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [currentIndustry, setCurrentIndustry] = useState<string | null>(null);

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
        setLoading(false);
        return;
      }

      const { data: business } = await supabase
        .from("businesses")
        .select("industry")
        .eq("id", profile.business_id)
        .single();

      if (business) {
        setCurrentIndustry(business.industry);
      }

      setLoading(false);
    }
    loadBusiness();
  }, [router]);

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
        Your industry determines which tools and leads appear on your dashboard.
      </p>

      <div className="max-w-xl">
        {/* Current Industry */}
        <div className="rounded-xl border border-border bg-white p-6">
          <p className="text-sm font-medium uppercase tracking-wider text-text-muted mb-4">
            Your Industry
          </p>

          {currentIndustry && currentIndustry !== "other" ? (
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-copper/10">
                <span className="text-3xl">{getIndustryIcon(currentIndustry)}</span>
              </div>
              <div>
                <p className="text-xl font-bold text-charcoal">
                  {getIndustryLabel(currentIndustry)}
                </p>
                <p className="text-sm text-text-muted">
                  Set during account creation
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface">
                <span className="text-3xl">📋</span>
              </div>
              <div>
                <p className="text-xl font-bold text-charcoal">Not Set</p>
                <p className="text-sm text-text-muted">
                  Industry was not selected during signup
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Locked Notice */}
        <div className="mt-6 rounded-xl border border-amber/30 bg-amber/10 p-6">
          <div className="flex items-start gap-4">
            <span className="text-2xl">🔒</span>
            <div>
              <p className="font-semibold text-charcoal">Industry is locked</p>
              <p className="mt-1 text-sm text-text-secondary">
                Your industry is set during account creation and cannot be changed through settings.
                This ensures data consistency for your leads and tools.
              </p>
              <p className="mt-3 text-sm text-text-muted">
                Need to change your industry? Contact support for assistance.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Link
            href="/app/settings"
            className="rounded-lg border border-border px-6 py-3 font-semibold text-charcoal hover:bg-surface inline-block"
          >
            Back to Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
