"use client";

import { useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import Link from "next/link";

interface BusinessInfo {
  id: string;
  name: string;
  subscription_tier: string;
  subscription_status: string | null;
  customer_count_limit: number;
  stripe_customer_id: string | null;
}

export default function UpgradePage() {
  const [business, setBusiness] = useState<BusinessInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check URL params for success/cancel
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCanceled, setShowCanceled] = useState(false);

  useEffect(function () {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") {
      setShowSuccess(true);
    }
    if (params.get("canceled") === "true") {
      setShowCanceled(true);
    }

    loadBusiness();
  }, []);

  async function loadBusiness() {
    const supabase = createSupabaseBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("business_id")
      .eq("id", user.id)
      .single();

    if (profile?.business_id) {
      const { data: biz } = await supabase
        .from("businesses")
        .select("id, name, subscription_tier, subscription_status, customer_count_limit, stripe_customer_id")
        .eq("id", profile.business_id)
        .single();

      if (biz) {
        setBusiness(biz);
      }
    }

    setLoading(false);
  }

  async function handleCheckout(tier: string) {
    setCheckoutLoading(tier);
    setError(null);

    try {
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError("Failed to start checkout. Please try again.");
    } finally {
      setCheckoutLoading(null);
    }
  }

  async function handleManageBilling() {
    setError(null);

    try {
      const response = await fetch("/api/stripe/create-portal", {
        method: "POST",
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Portal error:", err);
      setError("Failed to open billing portal. Please try again.");
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-copper border-t-transparent"></div>
      </div>
    );
  }

  const currentTier = business?.subscription_tier || "starter";
  const isBeta = true; // Flip this to false when ready to charge

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-charcoal md:text-3xl">Your Plan</h1>
        <p className="mt-1 text-text-secondary">
          Manage your subscription and billing.
        </p>
      </div>

      {/* Success Banner */}
      {showSuccess && (
        <div className="mb-6 rounded-xl border border-emerald/20 bg-emerald/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="font-semibold text-emerald">Welcome to your new plan!</p>
              <p className="text-sm text-text-secondary">Your account has been upgraded. All features are now available.</p>
            </div>
          </div>
        </div>
      )}

      {/* Canceled Banner */}
      {showCanceled && (
        <div className="mb-6 rounded-xl border border-amber/20 bg-amber/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">ℹ️</span>
            <div>
              <p className="font-semibold text-amber">Checkout canceled</p>
              <p className="text-sm text-text-secondary">No charges were made. You can upgrade anytime.</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="mb-6 rounded-xl border border-critical/20 bg-critical/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-semibold text-critical">Error</p>
                <p className="text-sm text-text-secondary">{error}</p>
              </div>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-text-muted hover:text-charcoal"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Beta Banner */}
      {isBeta && (
        <div className="mb-8 rounded-xl border border-copper/30 bg-copper/10 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-copper/20">
              <span className="text-2xl">🚀</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-charcoal">You're on the Free Launch Plan</h2>
              <p className="mt-1 text-text-secondary">
                Thanks for being an early adopter! You have full access to all Professional features
                at no cost during our launch period. We'll give you plenty of notice before any changes.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-copper/20 px-3 py-1 text-sm text-copper">
                  ✓ Unlimited customers
                </span>
                <span className="rounded-full bg-copper/20 px-3 py-1 text-sm text-copper">
                  ✓ Network search & reporting
                </span>
                <span className="rounded-full bg-copper/20 px-3 py-1 text-sm text-copper">
                  ✓ Analytics dashboard
                </span>
                <span className="rounded-full bg-copper/20 px-3 py-1 text-sm text-copper">
                  ✓ Data export
                </span>
                <span className="rounded-full bg-copper/20 px-3 py-1 text-sm text-copper">
                  ✓ Priority support
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Current Plan Card */}
      <div className="mb-8 rounded-xl border border-border bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">Current Plan</p>
            <p className="mt-1 text-xl font-bold text-charcoal">
              {isBeta ? "Launch (Free)" : currentTier === "professional" ? "Professional" : currentTier === "business" ? "Business" : "Starter"}
            </p>
            {!isBeta && business?.subscription_status && (
              <p className="mt-1 text-sm text-text-secondary">
                Status: <span className={
                  business.subscription_status === "active" ? "text-emerald" :
                  business.subscription_status === "past_due" ? "text-amber" :
                  "text-critical"
                }>{business.subscription_status}</span>
              </p>
            )}
          </div>
          {!isBeta && business?.stripe_customer_id && (
            <button
              onClick={handleManageBilling}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-charcoal hover:bg-surface"
            >
              Manage Billing
            </button>
          )}
        </div>
      </div>

      {/* Pricing Cards - shown when not in beta */}
      {!isBeta && (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Starter */}
          <div className={`rounded-xl border p-6 ${currentTier === "starter" ? "border-copper bg-copper/5" : "border-border bg-white"}`}>
            <h3 className="text-lg font-semibold text-charcoal">Starter</h3>
            <p className="mt-1 text-sm text-text-secondary">For solo contractors</p>
            <div className="mt-4">
              <span className="text-3xl font-bold text-charcoal">$0</span>
              <span className="text-text-secondary">/mo</span>
            </div>
            <ul className="mt-6 space-y-2 text-sm text-text-secondary">
              <li className="flex items-center gap-2">
                <span className="text-emerald">✓</span> Up to 50 customers
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald">✓</span> Basic reliability scores
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald">✓</span> Event logging
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald">✓</span> CSV export
              </li>
            </ul>
            {currentTier === "starter" ? (
              <div className="mt-6 rounded-lg border border-copper bg-copper/10 py-2 text-center text-sm font-medium text-copper">
                Current Plan
              </div>
            ) : (
              <div className="mt-6 rounded-lg border border-border py-2 text-center text-sm text-text-muted">
                Free
              </div>
            )}
          </div>

          {/* Professional */}
          <div className={`rounded-xl border p-6 ${currentTier === "professional" ? "border-copper bg-copper/5" : "border-border bg-white"}`}>
            <h3 className="text-lg font-semibold text-charcoal">Professional</h3>
            <p className="mt-1 text-sm text-text-secondary">For growing businesses</p>
            <div className="mt-4">
              <span className="text-3xl font-bold text-charcoal">$29</span>
              <span className="text-text-secondary">/mo</span>
            </div>
            <ul className="mt-6 space-y-2 text-sm text-text-secondary">
              <li className="flex items-center gap-2">
                <span className="text-emerald">✓</span> Unlimited customers
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald">✓</span> Analytics dashboard
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald">✓</span> Network search & reporting
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald">✓</span> Up to 5 team members
              </li>
            </ul>
            {currentTier === "professional" ? (
              <div className="mt-6 rounded-lg border border-copper bg-copper/10 py-2 text-center text-sm font-medium text-copper">
                Current Plan
              </div>
            ) : (
              <button
                onClick={function () { handleCheckout("professional"); }}
                disabled={checkoutLoading !== null}
                className="mt-6 w-full rounded-lg bg-copper py-2 text-sm font-semibold text-white hover:bg-copper-dark disabled:opacity-50"
              >
                {checkoutLoading === "professional" ? "Loading..." : "Upgrade to Professional"}
              </button>
            )}
          </div>

          {/* Business */}
          <div className={`rounded-xl border p-6 ${currentTier === "business" ? "border-copper bg-copper/5" : "border-border bg-white"}`}>
            <h3 className="text-lg font-semibold text-charcoal">Business</h3>
            <p className="mt-1 text-sm text-text-secondary">For larger teams</p>
            <div className="mt-4">
              <span className="text-3xl font-bold text-charcoal">$79</span>
              <span className="text-text-secondary">/mo</span>
            </div>
            <ul className="mt-6 space-y-2 text-sm text-text-secondary">
              <li className="flex items-center gap-2">
                <span className="text-emerald">✓</span> Everything in Professional
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald">✓</span> Unlimited team members
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald">✓</span> API access
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald">✓</span> Dedicated account manager
              </li>
            </ul>
            {currentTier === "business" ? (
              <div className="mt-6 rounded-lg border border-copper bg-copper/10 py-2 text-center text-sm font-medium text-copper">
                Current Plan
              </div>
            ) : (
              <button
                onClick={function () { handleCheckout("business"); }}
                disabled={checkoutLoading !== null}
                className="mt-6 w-full rounded-lg bg-copper py-2 text-sm font-semibold text-white hover:bg-copper-dark disabled:opacity-50"
              >
                {checkoutLoading === "business" ? "Loading..." : "Upgrade to Business"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Future pricing preview during beta */}
      {isBeta && (
        <div className="rounded-xl border border-border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-charcoal">Future Pricing</h2>
          <p className="mb-6 text-sm text-text-secondary">
            When the free launch period ends, here's what plans will look like.
            Early adopters may receive special pricing.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-cream p-4">
              <p className="font-semibold text-charcoal">Starter</p>
              <p className="text-2xl font-bold text-charcoal">$0<span className="text-sm text-text-secondary">/mo</span></p>
              <p className="mt-1 text-xs text-text-muted">50 customers, basic features</p>
            </div>
            <div className="rounded-lg border border-copper/30 bg-copper/5 p-4">
              <p className="font-semibold text-charcoal">Professional</p>
              <p className="text-2xl font-bold text-charcoal">$29<span className="text-sm text-text-secondary">/mo</span></p>
              <p className="mt-1 text-xs text-text-muted">Unlimited customers, full features</p>
            </div>
            <div className="rounded-lg border border-border bg-cream p-4">
              <p className="font-semibold text-charcoal">Business</p>
              <p className="text-2xl font-bold text-charcoal">$79<span className="text-sm text-text-secondary">/mo</span></p>
              <p className="mt-1 text-xs text-text-muted">Teams, API, dedicated support</p>
            </div>
          </div>
        </div>
      )}

      {/* Help */}
      <div className="mt-8 text-center">
        <p className="text-sm text-text-secondary">
          Questions about pricing?{" "}
          <a href="mailto:support@forsure.app" className="text-copper hover:underline">
            Contact us
          </a>
        </p>
      </div>
    </div>
  );
}
